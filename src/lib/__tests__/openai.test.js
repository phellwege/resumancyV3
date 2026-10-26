import { chat, isReasoningModel } from '../openai';
import { parseExperience } from '../resumeAI';

const ok = (content) => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ choices: [{ message: { content } }] }) });
const fail = (status, message) => Promise.resolve({ ok: false, status, json: () => Promise.resolve({ error: { message } }) });

afterEach(() => { delete global.fetch; });

test('sends key only to api.openai.com with sampling params for classic models', async () => {
  global.fetch = jest.fn(() => ok('hello'));
  const out = await chat({ apiKey: 'sk-test', model: 'gpt-4o-mini', messages: [{ role: 'user', content: 'hi' }], temperature: 0.4, maxTokens: 500 });
  expect(out).toBe('hello');
  const [url, opts] = global.fetch.mock.calls[0];
  expect(url).toBe('https://api.openai.com/v1/chat/completions');
  expect(opts.headers.Authorization).toBe('Bearer sk-test');
  const body = JSON.parse(opts.body);
  expect(body).toMatchObject({ model: 'gpt-4o-mini', temperature: 0.4, max_completion_tokens: 500 });
});

test('reasoning models get no temperature or token cap', async () => {
  global.fetch = jest.fn(() => ok('x'));
  await chat({ apiKey: 'k', model: 'gpt-5-mini', messages: [] });
  expect(Object.keys(JSON.parse(global.fetch.mock.calls[0][1].body)).sort()).toEqual(['messages', 'model']);
  expect(isReasoningModel('o4-mini')).toBe(true);
  expect(isReasoningModel('gpt-4.1')).toBe(false);
});

test('no key fails fast without a request', async () => {
  global.fetch = jest.fn();
  await expect(chat({ apiKey: '', messages: [] })).rejects.toThrow(/API key/);
  expect(global.fetch).not.toHaveBeenCalled();
});

test('4xx is not retried and gets a friendly message', async () => {
  global.fetch = jest.fn(() => fail(404, 'nope'));
  await expect(chat({ apiKey: 'k', model: 'gpt-x', messages: [] })).rejects.toThrow(/gpt-x/);
  expect(global.fetch).toHaveBeenCalledTimes(1);
});

test('parseExperience handles fences, raw newlines and junk', () => {
  expect(parseExperience('```json\n[{"a":1}]\n```')).toEqual([{ a: 1 }]);
  expect(parseExperience('[{"d":"line1\nline2"}]')).toEqual([{ d: 'line1\nline2' }]);
  expect(parseExperience('not json', ['fallback'])).toEqual(['fallback']);
});
