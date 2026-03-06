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
    finishReason?: string;
  }>;
  blockReason?: string;
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
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1024,
        // gemini-3-flash-preview is a thinking model; set low thinking budget
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
    // Buffer is polyfilled by CRE WASM runtime
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

    // Log full response for debugging
    // eslint-disable-next-line no-console
    console.log(`[Gemini RAW] status=${resp.statusCode} finish=${finishReason} block=${blockReason} text="${rawText}"`);

    if (!rawText) {
      console.log(`[Gemini RAW BODY] ${bodyText.substring(0, 500)}`);
    }

    // Extract digit 1, 2, or 3 from response
    const match = rawText.match(/[123]/);
    const answer = match ? match[0] : '3';

    return { statusCode: resp.statusCode, answer };
  };
