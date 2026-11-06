'use strict';

function count(value) {
  return Number.isSafeInteger(value) && value >= 0 ? value : null;
}

function safeModel(value) {
  return typeof value === 'string' && /^[a-z0-9._-]{1,80}$/i.test(value) ? value : 'unknown';
}

function recordGeminiUsage({ model, route, httpStatus, providerStatus, latencyMs, usageMetadata } = {}, emit = console.info) {
  const usage = usageMetadata && typeof usageMetadata === 'object' ? usageMetadata : {};
  const event = {
    event: 'gemini_usage',
    model: safeModel(model),
    route: ['legacy', 'conceptual', 'standard'].includes(route) ? route : 'unknown',
    httpStatus: count(httpStatus),
    providerStatus: count(providerStatus),
    latencyMs: count(latencyMs),
    inputTokens: count(usage.promptTokenCount),
    outputTokens: count(usage.candidatesTokenCount),
    thinkingTokens: count(usage.thoughtsTokenCount),
    cachedTokens: count(usage.cachedContentTokenCount),
    totalTokens: count(usage.totalTokenCount)
  };
  try {
    emit(JSON.stringify(event));
  } catch (_) {
    // La telemetria no debe alterar la respuesta al estudiante.
  }
  return event;
}

module.exports = { recordGeminiUsage };
