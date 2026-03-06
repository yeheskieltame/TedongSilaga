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
};

interface GeminiApiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

interface GeminiResponse {
  statusCode: number;
  answer: string;
}

const SYSTEM_PROMPT = `You are a judge for a traditional Torajan buffalo fighting event (Tedong Silaga).
You will receive text from a community report about a buffalo fight.
Determine who won based on the text.

OUTPUT FORMAT (CRITICAL):
Reply with ONLY a single digit, nothing else:
1 - if the first buffalo won
2 - if the second buffalo won
3 - if draw, cancelled, or unclear

Your ENTIRE response must be ONLY the number. No explanation, no whitespace, no punctuation.`;

export function askGemini(
  runtime: Runtime<Config>,
  buffaloA: string,
  buffaloB: string,
  facebookText: string,
): GeminiResponse {
  runtime.log('[Gemini] Querying AI for match result...');

  const geminiApiKey = runtime.getSecret({ id: 'GEMINI_API_KEY' }).result();
  const httpClient = new cre.capabilities.HTTPClient();

  const userPrompt = `Buffalo fight between "${buffaloA}" and "${buffaloB}".

Community report:
${facebookText}

Who won? Reply with ONLY the number (1, 2, or 3).`;

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
      generationConfig: { temperature: 0.1, maxOutputTokens: 10 },
    };

    const bodyBytes = new TextEncoder().encode(JSON.stringify(requestData));
    const body = btoa(String.fromCharCode(...bodyBytes));

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
    const answer = parsed?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '3';

    return { statusCode: resp.statusCode, answer };
  };
