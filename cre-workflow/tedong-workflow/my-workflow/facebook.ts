import {
  cre,
  ok,
  consensusIdenticalAggregation,
  type Runtime,
  type HTTPSendRequester,
} from '@chainlink/cre-sdk';

type Config = {
  geminiModel: string;
  chainSelectorName: string;
  marketAddress: string;
  gasLimit: string;
  facebookPageId: string;
  apifyActorId: string;
};

// Apify Facebook page posts response item
interface FacebookPost {
  post_id?: string;
  message?: string;
  message_rich?: string;
  url?: string;
  timestamp?: number;
}

// CRE WASM runtime cannot wrap null/undefined values in consensus.
// Response must only contain non-null primitive fields.
interface FacebookScrapeResponse {
  statusCode: number;
  postCount: number;
  matchedText: string;
}

/**
 * Scrape Facebook page posts using Apify and filter for buffalo fight results.
 *
 * Uses the sync API: POST /v2/acts/{actorId}/run-sync-get-dataset-items
 * Input: { page_id, maxResults: 1 }
 * Output: array of { post_id, message, url, timestamp, ... }
 */
export function scrapeFacebookPage(
  runtime: Runtime<Config>,
  buffaloA: string,
  buffaloB: string,
): FacebookScrapeResponse {
  runtime.log(`[Facebook] Scraping page ${runtime.config.facebookPageId} via Apify...`);
  runtime.log(`[Facebook] Looking for: "${buffaloA}" and "${buffaloB}"`);

  const apifyToken = runtime.getSecret({ id: 'APIFY_TOKEN' }).result();
  const httpClient = new cre.capabilities.HTTPClient();

  const result = httpClient
    .sendRequest(
      runtime,
      buildApifyRequest(apifyToken.value, buffaloA, buffaloB),
      consensusIdenticalAggregation<FacebookScrapeResponse>(),
    )(runtime.config)
    .result();

  runtime.log(`[Facebook] Found ${result.postCount} posts`);
  if (result.matchedText) {
    const preview = result.matchedText.length > 150
      ? result.matchedText.substring(0, 150) + '...'
      : result.matchedText;
    runtime.log(`[Facebook] Post: ${preview}`);
  }

  return result;
}

const buildApifyRequest =
  (apifyToken: string, buffaloA: string, buffaloB: string) =>
  (sendRequester: HTTPSendRequester, config: Config): FacebookScrapeResponse => {
    // Apify actor input — scrape latest posts from the Facebook page
    const actorInput = {
      page_id: config.facebookPageId,
      maxResults: 3,
    };

    const bodyBytes = new TextEncoder().encode(JSON.stringify(actorInput));
    const body = (Buffer as any).from(bodyBytes).toString('base64');

    // Sync API: runs actor and returns dataset items directly
    const actorId = config.apifyActorId;
    const resp = sendRequester
      .sendRequest({
        url: `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${apifyToken}`,
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .result();

    const bodyText = new TextDecoder().decode(resp.body);

    // eslint-disable-next-line no-console
    console.log(`[Apify RAW] status=${resp.statusCode} body=${bodyText.substring(0, 500)}`);

    if (!ok(resp)) {
      // eslint-disable-next-line no-console
      console.log(`[Apify API error] ${resp.statusCode} - ${bodyText.substring(0, 200)}`);
      return { statusCode: resp.statusCode, postCount: 0, matchedText: "" };
    }

    // Parse response — Apify returns an array of post objects
    let posts: FacebookPost[] = [];
    try {
      const parsed = JSON.parse(bodyText);
      posts = Array.isArray(parsed) ? parsed : [];
    } catch {
      // eslint-disable-next-line no-console
      console.log(`[Apify] Failed to parse response: ${bodyText.substring(0, 200)}`);
    }

    // Collect message text from all posts, filtering for buffalo name mentions
    const allMessages = posts
      .map((p) => p.message || p.message_rich || '')
      .filter((t) => t.length > 0);

    // Try to find posts mentioning both buffalo names
    const lowerA = buffaloA.toLowerCase();
    const lowerB = buffaloB.toLowerCase();
    const relevant = allMessages.filter((msg) => {
      const lower = msg.toLowerCase();
      return lower.includes(lowerA) && lower.includes(lowerB);
    });

    // Use relevant posts if found, otherwise use all posts
    const matchedText = relevant.length > 0
      ? relevant.join('\n\n---\n\n')
      : allMessages.join('\n\n---\n\n');

    return { statusCode: resp.statusCode, postCount: posts.length, matchedText };
  };
