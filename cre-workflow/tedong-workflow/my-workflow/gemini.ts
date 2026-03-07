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

interface GeminiApiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
    finishReason?: string;
  }>;
  blockReason?: string;
}

interface GeminiResponse {
  statusCode: number;
  answer: string;
}

const SYSTEM_PROMPT = `You are a judge for a traditional Torajan buffalo fighting event called "Tedong Silaga" or "Adu Kerbau".

You will receive the names of two buffaloes and text scraped from Facebook community posts about the match result.

Based on the Facebook post content, determine who won the buffalo fight.

OUTPUT FORMAT (CRITICAL):
Reply with ONLY a single digit, nothing else:
1 - if the first buffalo (Buffalo A) won
2 - if the second buffalo (Buffalo B) won
3 - if draw, cancelled, unclear, or no reliable information found

Your ENTIRE response must be ONLY the number 1, 2, or 3. No explanation, no whitespace, no punctuation.`;

/**
 * Ask Gemini AI to determine the winner from scraped Facebook posts.
 *
 * @param runtime - CRE runtime
 * @param buffaloA - First buffalo name
 * @param buffaloB - Second buffalo name
 * @param facebookText - Scraped text from Facebook (via Apify)
 */
export function askGemini(
  runtime: Runtime<Config>,
  buffaloA: string,
  buffaloB: string,
  facebookText: string,
): GeminiResponse {
  runtime.log('[Gemini] Analyzing Facebook post for match result...');

  const geminiApiKey = runtime.getSecret({ id: 'GEMINI_API_KEY' }).result();
  const httpClient = new cre.capabilities.HTTPClient();

  const userPrompt = `Buffalo fight match:
Buffalo A (first buffalo): "${buffaloA}"
Buffalo B (second buffalo): "${buffaloB}"

Facebook community posts about this match:
---
${facebookText}
---

Based on the Facebook posts above, who won? Reply with ONLY 1, 2, or 3.`;

  const result = httpClient
    .sendRequest(
      runtime,
      buildGeminiRequest(userPrompt, geminiApiKey.value),
      consensusIdenticalAggregation<GeminiResponse>(),
    )(runtime.config)
    .result();

  runtime.log(`[Gemini] Answer: ${result.answer}`);
  return result;
}

const buildGeminiRequest =
  (question: string, apiKey: string) =>
  (sendRequester: HTTPSendRequester, config: Config): GeminiResponse => {
    const requestData = {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ parts: [{ text: question }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1024,
        thinkingConfig: { thinkingBudget: 0 },
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      ],
    };

    const bodyBytes = new TextEncoder().encode(JSON.stringify(requestData));
    const body = (Buffer as any).from(bodyBytes).toString('base64');

    const resp = sendRequester
      .sendRequest({
        url: `https://generativelanguage.googleapis.com/v1beta/models/${config.geminiModel}:generateContent`,
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
      })
      .result();

    const bodyText = new TextDecoder().decode(resp.body);

    if (!ok(resp)) {
      throw new Error(`Gemini API error: ${resp.statusCode} - ${bodyText}`);
    }

    const parsed = JSON.parse(bodyText) as GeminiApiResponse;
    const rawText = parsed?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    const finishReason = parsed?.candidates?.[0]?.finishReason || 'unknown';
    const blockReason = parsed?.blockReason || 'none';

    // eslint-disable-next-line no-console
    console.log(`[Gemini RAW] status=${resp.statusCode} finish=${finishReason} block=${blockReason} text="${rawText}"`);

    if (!rawText) {
      console.log(`[Gemini RAW BODY] ${bodyText.substring(0, 500)}`);
    }

    const match = rawText.match(/[123]/);
    const answer = match ? match[0] : '3';

    return { statusCode: resp.statusCode, answer };
  };
