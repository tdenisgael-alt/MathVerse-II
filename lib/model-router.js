'use strict';

const FLASH_MODEL = 'gemini-3.8-flash';
const FLASH_LITE_MODEL = 'gemini-3.5-flash-lite';

// Límites y niveles documentados para los dos modelos de texto admitidos.
const MODEL_CAPABILITIES = Object.freeze({
  [FLASH_MODEL]: Object.freeze({
    maxOutputTokens: 65536,
    thinkingLevels: Object.freeze(['LOW', 'MEDIUM', 'HIGH'])
  }),
  [FLASH_LITE_MODEL]: Object.freeze({
    maxOutputTokens: 65536,
    thinkingLevels: Object.freeze(['MINIMAL', 'LOW', 'MEDIUM', 'HIGH'])
  })
});

const ROUTES = Object.freeze({
  conceptual: Object.freeze({ model: FLASH_LITE_MODEL, thinkingLevel: 'MINIMAL', maxOutputTokens: 1024 }),
  standard: Object.freeze({ model: FLASH_MODEL, thinkingLevel: 'LOW', maxOutputTokens: 2048 })
});

function isSupportedConfig(model, thinkingLevel, maxOutputTokens) {
  const capabilities = MODEL_CAPABILITIES[model];
  return Boolean(capabilities
    && capabilities.thinkingLevels.includes(thinkingLevel)
    && Number.isInteger(maxOutputTokens)
    && maxOutputTokens > 0
    && maxOutputTokens <= capabilities.maxOutputTokens);
}

function normalizeQuestion(message) {
  return String(message || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/^[\s¿?¡!]+/, '')
    .trim();
}

function getSimpleMaxChars(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 80 && parsed <= 400 ? parsed : 220;
}

function isSimpleConceptualQuestion(message, context, maxChars) {
  const question = normalizeQuestion(message);
  if (!question || question.length > maxChars) return false;

  // Un cálculo visible o pendiente requiere el modelo habitual, aunque la pregunta sea breve.
  const status = context && typeof context === 'object' ? String(context.status || '') : '';
  if (['CALCULATED', 'STALE', 'ERROR'].includes(status)) return false;

  const conceptualStart = /^(?:que es|que significa|define|definicion de|cual es la diferencia entre|diferencia entre|para que sirve)\b/;
  const procedure = /\b(?:calcula|calcular|resuelve|resolver|deriva|derivar|integra|integrar|evalua|evaluar|demuestra|demostrar|halla|hallar|determina|determinar|verifica|verificar|comprueba|comprobar|ejercicio|problema|resultado|paso a paso)\b/;
  const expression = /[=^∫∂∇]|\bf\s*\(|\d\s*[+*/-]\s*\d/;
  return conceptualStart.test(question) && !procedure.test(question) && !expression.test(question);
}

function selectGeminiRoute({ message, context = null, enabled = false, legacyModel = FLASH_MODEL, maxConceptualChars } = {}) {
  const routingEnabled = enabled === true || String(enabled).toLowerCase() === 'true' || String(enabled) === '1';
  if (!routingEnabled) {
    // Contrato anterior exacto: modelo configurable, LOW y 2048 tokens.
    return {
      route: 'legacy',
      model: legacyModel,
      generationConfig: { maxOutputTokens: 2048, thinkingConfig: { thinkingLevel: 'LOW' } }
    };
  }

  const simple = isSimpleConceptualQuestion(message, context, getSimpleMaxChars(maxConceptualChars));
  const route = simple ? 'conceptual' : 'standard';
  const config = ROUTES[route];
  if (!isSupportedConfig(config.model, config.thinkingLevel, config.maxOutputTokens)) {
    throw new Error('Configuración de modelo no compatible');
  }
  return {
    route,
    model: config.model,
    generationConfig: {
      maxOutputTokens: config.maxOutputTokens,
      thinkingConfig: { thinkingLevel: config.thinkingLevel }
    }
  };
}

module.exports = { selectGeminiRoute, isSupportedConfig, MODEL_CAPABILITIES };
