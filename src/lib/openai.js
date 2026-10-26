// Direct browser calls to the OpenAI Chat Completions API with the visitor's
// own key. The key goes only to api.openai.com, never anywhere else.

const API_URL = 'https://api.openai.com/v1/chat/completions';

export const MODEL_OPTIONS = [
    { id: 'gpt-4o-mini', label: 'gpt-4o-mini (cheap, fast, what the original used)' },
    { id: 'gpt-4.1-mini', label: 'gpt-4.1-mini' },
    { id: 'gpt-4o', label: 'gpt-4o' },
    { id: 'gpt-4.1', label: 'gpt-4.1' },
    { id: 'gpt-5-mini', label: 'gpt-5-mini (reasoning, slower)' },
    { id: 'gpt-5', label: 'gpt-5 (reasoning, slowest)' },
    { id: 'o4-mini', label: 'o4-mini (reasoning)' },
];

export const DEFAULT_MODEL = 'gpt-4o-mini';

// Reasoning models reject temperature/top_p and spend part of the token
// budget on hidden reasoning, so they get no sampling params and no cap.
export function isReasoningModel(model) {
    return /^(o\d|gpt-5)/i.test(model || '');
}

export class OpenAIError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

function friendlyError(status, apiMessage, model) {
    if (status === 401) return 'OpenAI rejected the API key. Check it in Settings.';
    if (status === 403) return `Your OpenAI account does not have access to ${model}. Pick another model in Settings.`;
    if (status === 404) return `Model "${model}" was not found for this key. Pick another model in Settings.`;
    if (status === 429) return 'OpenAI rate limit or quota reached for this key. Wait a moment, or check billing on your OpenAI account.';
    return apiMessage || `OpenAI request failed (${status}).`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * One chat completion. `options` mirrors what the old Cloud Functions sent:
 * { temperature, maxTokens, stop }.
 */
export async function chat({ apiKey, model, messages, temperature = 0.4, maxTokens = 1000, stop }) {
    if (!apiKey) throw new OpenAIError('Add your OpenAI API key in Settings first.', 0);
    const useModel = model || DEFAULT_MODEL;

    const body = { model: useModel, messages };
    if (!isReasoningModel(useModel)) {
        body.temperature = temperature;
        body.max_completion_tokens = maxTokens;
        if (stop) body.stop = stop;
    }

    let lastError;
    for (let attempt = 0; attempt < 3; attempt++) {
        let res;
        try {
            res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify(body),
            });
        } catch (networkError) {
            // OpenAI's reply to an invalid or revoked key on this endpoint has no
            // CORS headers, so the browser reports it as a network failure.
            lastError = new OpenAIError(
                'No usable reply from OpenAI. The API key is most likely invalid or revoked (use Test key in Settings), or you are offline.',
                0
            );
            if (attempt >= 1) break;
            await sleep(800);
            continue;
        }

        if (res.ok) {
            const data = await res.json();
            return data.choices?.[0]?.message?.content ?? '';
        }

        let apiMessage = '';
        try {
            apiMessage = (await res.json())?.error?.message || '';
        } catch {
            // body was not JSON
        }
        lastError = new OpenAIError(friendlyError(res.status, apiMessage, useModel), res.status);

        // Only rate limits and server errors are worth retrying.
        if (res.status !== 429 && res.status < 500) break;
        await sleep(1000 * (attempt + 1));
    }
    throw lastError;
}
