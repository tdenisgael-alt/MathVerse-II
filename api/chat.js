/**
 * Vercel Serverless Function: /api/chat
 * Profesor Virtual - MathVerse II
 * Tutor académico para Matemática II (Cálculo Multivariable) y Física Universitaria.
 */

const SYSTEM_INSTRUCTION = `Eres el Profesor Virtual de MathVerse II, un tutor académico universitario especializado en Matemática II (Cálculo Multivariable) y Física Universitaria para estudiantes de ingeniería de la Universidad Nacional de Ingeniería.

Tu misión es guiar, explicar y resolver consultas académicas con pedagogía, claridad, estructura y rigor conceptual.

Principios pedagógicos y directrices de respuesta:
1. Responde siempre en español con un tono formal, accesible, paciente y motivador.
2. Explica y desglosa los procedimientos paso a paso:
   - Identificación del problema, variables dadas y datos iniciales (usando siempre unidades del Sistema Internacional en física: m, s, m/s, m/s², kg, N, J, etc.).
   - Fórmulas teóricas, definiciones o teoremas matemáticos aplicables.
   - Sustitución ordenada y desarrollo algebraico o numérico detallado.
   - Conclusión clara e interpretación geométrica o física del resultado.
3. Rigor y honestidad académica:
   - Si una pregunta es ambigua o faltan datos indispensables para resolver el ejercicio, indícalo con precisión y orienta al estudiante sobre qué datos hacen falta.
   - Si no puedes verificar un cálculo o una expresión con total certeza, reconócelo explícitamente: "No puedo verificar este cálculo con total certeza debido a...", en lugar de inventar o adivinar valores numéricos.
4. Áreas temáticas principales:
   - Matemática II: Funciones de varias variables, dominio y rango en R^n, curvas y superficies de nivel, límites y continuidad multivariable, derivadas parciales de primer y orden superior, plano tangente y aproximación lineal, vector gradiente y derivada direccional, matriz Hessiana, puntos críticos y optimización (máximos locales, mínimos locales y puntos de silla), e integrales múltiples.
   - Física: Cinemática (MRU, MRUV, caída libre, aceleración constante, tiro parabólico en 2D, velocidad media por tramos, encuentro y alcance), leyes de Newton y dinámica, trabajo y energía mecánica.
5. Utiliza notación matemática clara y limpia, fácil de leer en formato texto (por ejemplo: z = f(x, y), ∂f/∂x, ∇f(x, y), x^2 + y^2 = 4, sqrt(...)).`;

// Helper para emitir respuestas JSON uniformes en Vercel y entornos locales de prueba
function sendJson(res, statusCode, data) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(data);
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

const { checkRateLimit } = require('./rate-limiter.js');

/**
 * Extrae y normaliza la lista explícita de orígenes permitidos desde las variables de entorno.
 */
function getConfiguredAllowedOrigins() {
  const envOrigins = process.env.ALLOWED_ORIGINS || '';
  return envOrigins
    .split(',')
    .map(o => o.trim().replace(/\/+$/, ''))
    .filter(Boolean);
}

/**
 * Valida si el Host de la solicitud corresponde estrictamente a la infraestructura legítima de MathVerse II.
 * Utiliza exclusivamente coincidencias exactas con VERCEL_URL, VERCEL_PROJECT_PRODUCTION_URL y ALLOWED_ORIGINS,
 * eliminando cualquier patrón de coincidencia amplia o comodín.
 */
function isTrustedMathVerseHost(host) {
  if (!host || typeof host !== 'string') return false;
  const cleanHost = host.trim().toLowerCase();

  // 1. Entorno de desarrollo local (localhost o 127.0.0.1 con puerto opcional)
  if (/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(cleanHost)) {
    return true;
  }

  // 2. Dominio exacto asignado automáticamente por Vercel para esta instancia específica (preview o producción)
  if (process.env.VERCEL_URL && cleanHost === process.env.VERCEL_URL.trim().toLowerCase()) {
    return true;
  }

  // 3. Dominio de producción oficial exacto de Vercel para este proyecto
  const prodHost = (process.env.VERCEL_PROJECT_PRODUCTION_URL || 'mathverse.vercel.app').trim().toLowerCase();
  if (cleanHost === prodHost) {
    return true;
  }

  // 4. Hosts exactos asociados a los orígenes explícitamente configurados en ALLOWED_ORIGINS
  const configuredOrigins = getConfiguredAllowedOrigins();
  for (const allowed of configuredOrigins) {
    try {
      const parsed = new URL(allowed);
      if (parsed.host.toLowerCase() === cleanHost) {
        return true;
      }
    } catch (e) {}
  }

  return false;
}

/**
 * Valida si un Origin es legítimo según la política de seguridad estricta de MathVerse II.
 * Prioriza mismo origen estricto y listas blancas explícitas.
 */
function isOriginAllowed(origin, req) {
  // Rechazar orígenes ausentes, no strings, cadenas vacías o literales 'null'
  if (!origin || typeof origin !== 'string') return false;
  const cleanOrigin = origin.trim().replace(/\/+$/, '');
  if (!cleanOrigin || cleanOrigin.toLowerCase() === 'null') return false;

  let parsedOrigin;
  try {
    parsedOrigin = new URL(cleanOrigin);
  } catch (e) {
    return false;
  }

  // Exigir protocolos estándar http o https
  if (parsedOrigin.protocol !== 'http:' && parsedOrigin.protocol !== 'https:') {
    return false;
  }

  // 1. REGLA PRINCIPAL: Coincidencia exacta con ALLOWED_ORIGINS explícito
  const configuredOrigins = getConfiguredAllowedOrigins();
  for (const allowed of configuredOrigins) {
    if (cleanOrigin.toLowerCase() === allowed.toLowerCase()) {
      return true;
    }
  }

  // 2. REGLA DE MISMO ORIGEN (Same-Origin estricto con el endpoint)
  // Se utiliza exclusivamente req.headers.host verificado (descartando x-forwarded-host por ser manipulable)
  const reqHost = (req.headers && req.headers.host ? req.headers.host : '').trim().toLowerCase();
  if (reqHost && isTrustedMathVerseHost(reqHost)) {
    const originHost = parsedOrigin.host.toLowerCase();

    // El host y puerto del Origin deben coincidir exactamente con el Host del endpoint
    if (originHost === reqHost) {
      // Para dominios no locales (ej. Vercel o producción), exigir HTTPS estrictamente
      const isLocal = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(reqHost);
      if (!isLocal && parsedOrigin.protocol !== 'https:') {
        return false;
      }
      return true;
    }
  }

  return false;
}

/**
 * Handler principal de la Vercel Serverless Function
 */
async function handler(req, res) {
  const origin = req.headers && req.headers.origin;

  // Política CORS segura: validación estricta de origen sin credenciales ni comodín '*'
  if (origin) {
    if (!isOriginAllowed(origin, req)) {
      return sendJson(res, 403, {
        error: 'Origen no autorizado por la política de seguridad (CORS).',
        code: 'CORS_FORBIDDEN'
      });
    }

    const cleanOrigin = origin.trim().replace(/\/+$/, '');
    res.setHeader('Access-Control-Allow-Origin', cleanOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Vary', 'Origin');
  }

  // Responder preflight OPTIONS si el método es OPTIONS
  if (req.method === 'OPTIONS') {
    if (!origin) {
      res.setHeader('Allow', 'POST, OPTIONS');
    }
    res.statusCode = 204;
    res.end();
    return;
  }

  // Validación de método HTTP
  if (req.method !== 'POST') {
    return sendJson(res, 405, {
      error: 'Método no permitido. El endpoint /api/chat solo acepta solicitudes POST.',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  // Parsear cuerpo de la solicitud
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return sendJson(res, 400, {
        error: 'El cuerpo de la solicitud no contiene un formato JSON válido.',
        code: 'INVALID_JSON'
      });
    }
  }

  if (!body || typeof body !== 'object') {
    return sendJson(res, 400, {
      error: 'Se esperaba un objeto JSON en el cuerpo de la solicitud.',
      code: 'MISSING_BODY'
    });
  }

  // Extraer y validar la pregunta del usuario
  const rawMessage = body.message || body.prompt || body.question || '';
  if (typeof rawMessage !== 'string' || !rawMessage.trim()) {
    return sendJson(res, 400, {
      error: 'Debes proporcionar una pregunta válida en el campo "message".',
      code: 'EMPTY_MESSAGE'
    });
  }

  const message = rawMessage.trim();
  const MAX_MESSAGE_LENGTH = 2500;
  if (message.length > MAX_MESSAGE_LENGTH) {
    return sendJson(res, 400, {
      error: `La pregunta excede el límite permitido de ${MAX_MESSAGE_LENGTH} caracteres. Por favor sintetiza tu consulta.`,
      code: 'MESSAGE_TOO_LONG'
    });
  }

  // Control de abuso mediante Rate Limiting (distribuido con fallback local)
  const clientIdentifier = (typeof body.clientId === 'string' && body.clientId.trim())
    ? body.clientId.trim()
    : (req.headers && req.headers['x-client-id'] ? String(req.headers['x-client-id']).trim() : null);

  const rateLimitResult = await checkRateLimit(req, clientIdentifier, req._rateLimitOptionsOverride || {});

  // Si el limitador distribuido falla o está ausente en producción, denegar acceso de forma segura (Fail-Closed)
  if (rateLimitResult && rateLimitResult.unavailable) {
    return sendJson(res, 503, {
      error: rateLimitResult.error || 'El servicio no está disponible temporalmente por mantenimiento en la protección del sistema.',
      code: rateLimitResult.code || 'RATE_LIMITER_UNAVAILABLE'
    });
  }

  if (rateLimitResult) {
    if (rateLimitResult.limit) res.setHeader('X-RateLimit-Limit', String(rateLimitResult.limit));
    if (typeof rateLimitResult.remaining === 'number') res.setHeader('X-RateLimit-Remaining', String(rateLimitResult.remaining));
    if (rateLimitResult.resetSeconds) res.setHeader('X-RateLimit-Reset', String(rateLimitResult.resetSeconds));
  }

  if (rateLimitResult && !rateLimitResult.allowed) {
    if (rateLimitResult.resetSeconds) {
      res.setHeader('Retry-After', String(rateLimitResult.resetSeconds));
    }
    const friendlyRateLimitMsg = rateLimitResult.isCampusBurst
      ? `Se ha alcanzado temporalmente el límite de consultas para esta red institucional (${rateLimitResult.limit} consultas por minuto). Por favor espera ${rateLimitResult.resetSeconds} segundos antes de enviar otra consulta.`
      : `Has alcanzado el límite permitido de consultas (${rateLimitResult.limit} consultas por minuto). Por favor espera ${rateLimitResult.resetSeconds} segundos antes de enviar otra consulta.`;

    return sendJson(res, 429, {
      error: friendlyRateLimitMsg,
      code: 'RATE_LIMITED',
      retryAfter: rateLimitResult.resetSeconds
    });
  }

  // Verificar existencia de la clave de API del servidor
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return sendJson(res, 503, {
      error: 'El servicio del Profesor Virtual no está disponible temporalmente.',
      code: 'SERVICE_UNAVAILABLE'
    });
  }

  // Modelo configurable (predeterminado: gemini-3.8-flash)
  const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

  // Procesar y sanitizar historial breve de conversación (máximo 10 mensajes)
  let history = Array.isArray(body.history) ? body.history : [];
  if (history.length > 10) {
    history = history.slice(-10);
  }

  const sanitizedHistory = history
    .filter(item => item && typeof item === 'object')
    .map(item => {
      const role = (item.role === 'model' || item.role === 'assistant') ? 'model' : 'user';
      const text = typeof item.text === 'string'
        ? item.text.slice(0, 2000)
        : (typeof item.content === 'string' ? item.content.slice(0, 2000) : '');
      return { role, text: text.trim() };
    })
    .filter(item => item.text.length > 0);

  // Estructurar contenido para la API de Gemini
  const contents = [];
  for (const item of sanitizedHistory) {
    contents.push({
      role: item.role,
      parts: [{ text: item.text }]
    });
  }
  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  const geminiPayload = {
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }]
    },
    contents,
    generationConfig: {
      temperature: 0.35,
      maxOutputTokens: 2048
    }
  };

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  // Timeout para la llamada al proveedor Gemini (8.5s)
  // Permite responder con un error 504 controlado antes de que Vercel cancele la ejecución serverless (10-15s)
  const PROVIDER_TIMEOUT_MS = 8500;
  const controller = new AbortController();
  let isTimedOut = false;
  const timeoutId = setTimeout(() => {
    isTimedOut = true;
    try {
      controller.abort('timeout');
    } catch (e) {}
  }, PROVIDER_TIMEOUT_MS);

  // Si el cliente cierra o aborta la conexión antes de recibir la respuesta, cancelamos la llamada upstream
  const onDisconnect = () => {
    const isEnded = Boolean(res?.writableEnded || res?.finished);
    if (!isEnded) {
      try {
        controller.abort('client_disconnected');
      } catch (e) {}
    }
  };

  if (res && typeof res.on === 'function') {
    res.on('close', onDisconnect);
  }

  const cleanupListeners = () => {
    clearTimeout(timeoutId);
    if (res && typeof res.removeListener === 'function') {
      res.removeListener('close', onDisconnect);
    }
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(geminiPayload),
      signal: controller.signal
    });

    if (!response.ok) {
      cleanupListeners();

      // Manejo seguro de cuota y límites de tasa (429)
      if (response.status === 429) {
        return sendJson(res, 429, {
          error: 'Se ha alcanzado la cuota de consultas de la API de Gemini. Por favor espera unos momentos antes de enviar otra consulta.',
          code: 'QUOTA_EXCEEDED'
        });
      }

      // Solicitud no válida al modelo (400)
      if (response.status === 400) {
        return sendJson(res, 400, {
          error: 'La consulta no pudo ser procesada por la API de Gemini.',
          code: 'GEMINI_BAD_REQUEST'
        });
      }

      // Problema de autenticación o permisos con la clave de API (401 o 403)
      if (response.status === 401 || response.status === 403) {
        return sendJson(res, 503, {
          error: 'El servicio del Profesor Virtual no está disponible temporalmente.',
          code: 'SERVICE_UNAVAILABLE'
        });
      }

      // Servicio no disponible o fallos de pasarela del proveedor (502, 503, 504)
      if (response.status === 503 || response.status === 502 || response.status === 504) {
        return sendJson(res, 503, {
          error: 'El servicio del Profesor Virtual no está disponible temporalmente. Intenta nuevamente más tarde.',
          code: 'SERVICE_UNAVAILABLE'
        });
      }

      // Cualquier otro error del proveedor (500)
      return sendJson(res, 500, {
        error: 'Error interno en el servidor al consultar al Profesor Virtual.',
        code: 'INTERNAL_ERROR'
      });
    }

    const data = await response.json().catch(() => null);
    cleanupListeners();

    const candidate = data?.candidates?.[0];
    const replyParts = candidate?.content?.parts;
    const replyText = Array.isArray(replyParts) ? replyParts.map(p => p.text).join('') : '';

    if (!replyText) {
      return sendJson(res, 500, {
        error: 'El modelo no devolvió una respuesta válida.',
        code: 'EMPTY_RESPONSE'
      });
    }

    return sendJson(res, 200, {
      reply: replyText,
      model
    });
  } catch (error) {
    cleanupListeners();

    // Distinguir timeout o desconexión del cliente frente a errores inesperados
    if (isTimedOut || controller.signal.aborted || error?.name === 'AbortError' || error?.name === 'TimeoutError') {
      if (controller.signal.reason === 'client_disconnected') {
        // El cliente cerró la conexión prematuramente; no hay receptor para la respuesta
        return;
      }
      return sendJson(res, 504, {
        error: 'El tiempo de respuesta del servicio se ha agotado. Por favor intenta nuevamente.',
        code: 'GATEWAY_TIMEOUT'
      });
    }

    return sendJson(res, 500, {
      error: 'Error interno en el servidor al consultar al Profesor Virtual.',
      code: 'INTERNAL_ERROR'
    });
  }
}

module.exports = handler;
module.exports.default = handler;
