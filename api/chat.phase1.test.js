'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const handler = require('./chat.js');
const { selectGeminiRoute, isSupportedConfig } = require('./model-router.js');
const { recordGeminiUsage } = require('./usage-metrics.js');

let requestNumber = 0;
function request(body, options = {}) {
  requestNumber += 1;
  const id = requestNumber;
  const req = {
    method: 'POST',
    headers: { host: 'localhost:3000', 'x-forwarded-for': `192.0.2.${id}` },
    body: { clientId: `mock-${id}`, ...body },
    _rateLimitOptionsOverride: { isProduction: false, upstashUrl: null, upstashToken: null, ...options }
  };
  const res = {
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; }
  };
  return { req, res };
}

async function withMockProvider(t, body, provider, options = {}) {
  const oldFetch = global.fetch;
  const oldKey = process.env.GEMINI_API_KEY;
  const oldRouting = process.env.GEMINI_ROUTING_ENABLED;
  const oldModel = process.env.GEMINI_MODEL;
  const oldInfo = console.info;
  const oldError = console.error;
  const calls = [];
  const logs = [];
  process.env.GEMINI_API_KEY = 'test-key-never-sent';
  if (options.routing) process.env.GEMINI_ROUTING_ENABLED = 'true';
  else delete process.env.GEMINI_ROUTING_ENABLED;
  if (options.model) process.env.GEMINI_MODEL = options.model;
  else delete process.env.GEMINI_MODEL;
  global.fetch = async (url, init) => {
    calls.push({ url, payload: JSON.parse(init.body) });
    return provider;
  };
  console.info = value => logs.push(JSON.parse(value));
  console.error = () => {};
  t.after(() => {
    global.fetch = oldFetch;
    console.info = oldInfo;
    console.error = oldError;
    if (oldKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = oldKey;
    if (oldRouting === undefined) delete process.env.GEMINI_ROUTING_ENABLED;
    else process.env.GEMINI_ROUTING_ENABLED = oldRouting;
    if (oldModel === undefined) delete process.env.GEMINI_MODEL;
    else process.env.GEMINI_MODEL = oldModel;
  });
  const { req, res } = request(body, options.rateLimit);
  await handler(req, res);
  return { res, calls, logs };
}

function success(text = 'Respuesta simulada') {
  return {
    ok: true,
    status: 200,
    async json() {
      return {
        candidates: [{ content: { parts: [{ text }] } }],
        usageMetadata: {
          promptTokenCount: 41,
          candidatesTokenCount: 12,
          thoughtsTokenCount: 3,
          cachedContentTokenCount: 5,
          totalTokenCount: 56,
          privateStudentName: 'do-not-log'
        }
      };
    }
  };
}

test('router keeps legacy behavior until explicitly enabled', () => {
  const legacy = selectGeminiRoute({ message: '¿Qué es la velocidad?', legacyModel: 'custom-model' });
  assert.equal(legacy.model, 'custom-model');
  assert.deepEqual(legacy.generationConfig, { maxOutputTokens: 2048, thinkingConfig: { thinkingLevel: 'LOW' } });
  assert.equal(selectGeminiRoute({ message: '¿Qué es la velocidad?', enabled: 'false' }).route, 'legacy');
  assert.equal(selectGeminiRoute({ message: '¿Qué es la velocidad?', enabled: 'true' }).model, 'gemini-3.5-flash-lite');
  assert.equal(selectGeminiRoute({ message: 'Calcula v = 10/2', enabled: 'true' }).model, 'gemini-3.8-flash');
  assert.equal(selectGeminiRoute({ message: '¿Qué es la derivada?', context: { status: 'CALCULATED' }, enabled: 'true' }).route, 'standard');
  assert.equal(isSupportedConfig('gemini-3.5-flash-lite', 'MINIMAL', 1024), true);
  assert.equal(isSupportedConfig('gemini-3.8-flash', 'LOW', 2048), true);
  assert.equal(isSupportedConfig('gemini-3.8-flash', 'MINIMAL', 2048), false);
  assert.equal(isSupportedConfig('gemini-3.8-flash', 'LOW', 65537), false);
});

test('metrics emit only allowlisted counts and safe identifiers', () => {
  const emitted = [];
  const event = recordGeminiUsage({
    model: 'model\nprivate', route: 'conceptual', httpStatus: 200, providerStatus: 200,
    latencyMs: 20, usageMetadata: { promptTokenCount: 9, candidatesTokenCount: 4, thoughtsTokenCount: 2, cachedContentTokenCount: 1, totalTokenCount: 13, message: 'secret' }
  }, value => emitted.push(value));
  assert.equal(event.model, 'unknown');
  assert.equal(event.inputTokens, 9);
  assert.equal(event.outputTokens, 4);
  assert.equal(event.thinkingTokens, 2);
  assert.equal(event.cachedTokens, 1);
  assert.equal(event.totalTokens, 13);
  assert.equal(JSON.stringify(event).includes('secret'), false);
  assert.equal(emitted.length, 1);
});

test('Profesor Virtual preserves response and generation contract without context', async t => {
  const { res, calls, logs } = await withMockProvider(t, { message: 'Explica el movimiento', history: [{ role: 'assistant', text: 'Historial' }] }, success());
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { reply: 'Respuesta simulada', model: 'gemini-3.8-flash' });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].payload.contents.length, 2);
  assert.equal(calls[0].payload.contents[0].role, 'model');
  assert.equal(calls[0].payload.generationConfig.maxOutputTokens, 2048);
  assert.equal(calls[0].payload.generationConfig.thinkingConfig.thinkingLevel, 'LOW');
  assert.equal(logs.length, 1);
  assert.equal(logs[0].inputTokens, 41);
  assert.equal(logs[0].providerStatus, 200);
  assert.equal(JSON.stringify(logs).includes('do-not-log'), false);
});

test('Matemática II context remains in user turn and outside system instruction', async t => {
  const { res, calls } = await withMockProvider(t, {
    message: 'Explica el resultado',
    context: { page: 'Matemática II', unitNumber: 2, module: 'Derivadas', status: 'CALCULATED', inputs: { function: 'x^2+y^2', evaluationPoint: { a: 2, b: 3 } }, results: '13' }
  }, success());
  assert.equal(res.statusCode, 200);
  const payload = calls[0].payload;
  assert.match(payload.contents[0].parts[0].text, /Unidad 2/);
  assert.match(payload.contents[0].parts[0].text, /CALCULATED/);
  assert.match(payload.contents[0].parts[0].text, /x\^2\+y\^2/);
  assert.doesNotMatch(payload.systemInstruction.parts[0].text, /x\^2\+y\^2/);
});

test('Physics and Study allowlists accept bounded fields and READING', async t => {
  const context = {
    page: 'Física', module: 'Cinemática', moduleNumber: 4, status: 'READING',
    inputs: { physics: { velocity: '-12,5', time: '3.2', angle: '<script>bad</script>', v0: '-4', th: '30', unknown: 'reject' } },
    studySection: { title: 'MRUV', section: 'Aceleración', summary: 'A'.repeat(800), unknown: 'reject' },
    unknown: 'reject'
  };
  const { calls } = await withMockProvider(t, { message: '¿Qué es aceleración?', context }, success(), { routing: true });
  const payload = calls[0].payload;
  const content = payload.contents.at(-1).parts[0].text;
  assert.match(content, /READING/);
  assert.match(content, /velocity: -12,5/);
  assert.match(content, /v0: -4/);
  assert.match(content, /th: 30/);
  assert.match(content, /angle: &lt;script&gt;bad&lt;\/script&gt;/);
  assert.match(content, /Apartado de estudio:/);
  assert.doesNotMatch(content, /reject/);
  assert.match(content, /<\/academic_context>/);
  assert.equal(payload.generationConfig.thinkingConfig.thinkingLevel, 'MINIMAL');
  assert.match(calls[0].url, /gemini-3\.5-flash-lite:generateContent/);
});

test('provider 429 keeps public error contract and logs status without retry', async t => {
  const provider = { ok: false, status: 429, async json() { return { error: { status: 'RESOURCE_EXHAUSTED' } }; } };
  const { res, calls, logs } = await withMockProvider(t, { message: 'Problema complejo' }, provider);
  assert.equal(res.statusCode, 429);
  assert.equal(res.body.code, 'QUOTA_EXCEEDED');
  assert.equal(calls.length, 1);
  assert.equal(logs[0].httpStatus, 429);
  assert.equal(logs[0].providerStatus, 429);
});

test('provider 503 and 504 preserve one request and measured HTTP status', async t => {
  for (const status of [503, 504]) {
    const provider = { ok: false, status, async json() { return { error: { status: 'UNAVAILABLE' } }; } };
    const { res, calls, logs } = await withMockProvider(t, { message: 'Resuelve el ejercicio' }, provider);
    assert.equal(res.statusCode, 503);
    assert.equal(res.body.code, 'SERVICE_UNAVAILABLE');
    assert.equal(calls.length, 1);
    assert.equal(logs[0].providerStatus, status);
  }
});

test('existing context states and strict size limit remain valid', async t => {
  for (const status of ['CALCULATED', 'STALE', 'ERROR', 'EMPTY', 'READING']) {
    const { calls } = await withMockProvider(t, {
      message: 'Ayuda',
      context: { status, page: 'A'.repeat(10000), results: 'B'.repeat(10000), stepsSummary: 'C'.repeat(10000), studySection: { summary: 'D'.repeat(10000) } }
    }, success());
    const turn = calls[0].payload.contents.at(-1).parts[0].text;
    const block = turn.split('\n\nPregunta del estudiante:')[0];
    assert.match(block, new RegExp(`Estado del cálculo: ${status}`));
    assert.ok(block.length <= 3500);
    assert.ok(block.endsWith('</academic_context>'));
  }
});

test('Upstash production fail-closed prevents Gemini call', async t => {
  const { res, calls } = await withMockProvider(t, { message: 'Hola' }, success(), { rateLimit: { isProduction: true, upstashUrl: null, upstashToken: null } });
  assert.equal(res.statusCode, 503);
  assert.equal(res.body.code, 'RATE_LIMITER_UNAVAILABLE');
  assert.equal(calls.length, 0);
});
