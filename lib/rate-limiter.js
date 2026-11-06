/**
 * MathVerse II - Rate Limiter Distribuido para Vercel Serverless
 *
 * Implementa protección atómica contra abuso basada en Upstash Redis (REST API)
 * mediante scripts Lua (EVAL) indivisibles, con mitigación de fallos en producción
 * (Fail-Closed controlado) y fallback local en memoria exclusivo para desarrollo.
 *
 * Diseñado con limitación compuesta:
 * - Límite individual por estudiante (10 consultas/min).
 * - Límite de ráfaga agregado por IP para redes universitarias (60 consultas/min).
 */

// Configuración predeterminada
const DEFAULT_LIMIT = 10; // Consultas por ventana
const DEFAULT_WINDOW_SECONDS = 60; // Ventana de 1 minuto
const DEFAULT_SHARED_IP_BURST = 60; // Límite agregado para IPs compartidas (ej. campus universitario)
const UPSTASH_TIMEOUT_MS = 1500; // Tiempo límite estricto para la llamada a Upstash

// Script Lua atómico para Upstash Redis
// Ejecuta de forma estrictamente indivisible la comprobación y el incremento de ambos contadores
// Distingue entre el TTL de retención de almacenamiento (storageTtl) y el tiempo real
// hasta el siguiente momento de admisión (resetSeconds).
const ATOMIC_RATE_LIMIT_LUA = `
local studentKey = KEYS[1]
local ipKey = KEYS[2]
local studentLimit = tonumber(ARGV[1])
local ipLimit = tonumber(ARGV[2])
local storageTtl = tonumber(ARGV[3])
local resetSeconds = tonumber(ARGV[4])

-- 1. Obtener contadores actuales
local studentCount = tonumber(redis.call('GET', studentKey) or '0')
local ipCount = tonumber(redis.call('GET', ipKey) or '0')

-- 2. Verificar límites: comprobar si uno o ambos están agotados
local studentExceeded = (studentCount >= studentLimit)
local ipExceeded = (ipKey ~= studentKey and ipCount >= ipLimit)

if studentExceeded and ipExceeded then
  return { 0, studentCount, studentLimit, resetSeconds, 'BOTH_LIMITS' }
end

if studentExceeded then
  return { 0, studentCount, studentLimit, resetSeconds, 'STUDENT_LIMIT' }
end

if ipExceeded then
  return { 0, ipCount, ipLimit, resetSeconds, 'IP_LIMIT' }
end

-- 3. Ambos dentro del límite: incremento atómico e inicialización de expiración de almacenamiento
local newStudent = redis.call('INCR', studentKey)
if newStudent == 1 then
  redis.call('EXPIRE', studentKey, storageTtl)
end

local newIp = newStudent
if ipKey ~= studentKey then
  newIp = redis.call('INCR', ipKey)
  if newIp == 1 then
    redis.call('EXPIRE', ipKey, storageTtl)
  end
end

return { 1, newStudent, studentLimit, resetSeconds, 'OK' }
`;

// Almacenamiento local en memoria (exclusivo para desarrollo local / pruebas)
const localMemoryStore = new Map();

let lastCleanup = Date.now();
function cleanupExpiredMemoryEntries() {
  const now = Date.now();
  if (now - lastCleanup < 120000) return;
  lastCleanup = now;

  for (const [key, value] of localMemoryStore.entries()) {
    if (value.expiresAt <= now) {
      localMemoryStore.delete(key);
    }
  }
}

/**
 * Normaliza una dirección IP eliminando prefijos IPv4-mapped de IPv6 (::ffff:).
 */
function normalizeIp(ip) {
  if (typeof ip !== 'string') return '';
  return ip.trim().replace(/^::ffff:/, '');
}

/**
 * Valida si una cadena tiene formato válido de dirección IPv4 o IPv6.
 */
function isValidIp(ip) {
  if (typeof ip !== 'string') return false;
  const trimmed = normalizeIp(ip);
  // IPv4 estándar
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (ipv4Regex.test(trimmed)) return true;
  // IPv6 estándar
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
  if (ipv6Regex.test(trimmed)) return true;
  return false;
}

/**
 * Extrae la dirección IP del cliente conforme a la arquitectura oficial de Vercel Edge Proxy.
 * Prioriza estrictamente x-vercel-forwarded-for y x-real-ip para evitar spoofing desde el cliente.
 */
function getClientIp(req) {
  if (!req || !req.headers) return '127.0.0.1';

  // 1. Cabeceras oficiales confiables inyectadas por Vercel Edge Proxy
  // En Vercel, estas cabeceras son fijadas por el proxy perimetral y no son manipulables por el cliente.
  const vercelForwarded = req.headers['x-vercel-forwarded-for'];
  if (typeof vercelForwarded === 'string' && vercelForwarded.trim()) {
    const candidate = normalizeIp(vercelForwarded.split(',')[0].trim());
    if (isValidIp(candidate)) return candidate;
  }

  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) {
    const candidate = normalizeIp(realIp.trim());
    if (isValidIp(candidate)) return candidate;
  }

  // 2. Si no existen cabeceras de Vercel (desarrollo local o pruebas),
  // se evalúa x-forwarded-for tomando el primer valor con formato válido
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    const parts = forwarded.split(',').map(p => normalizeIp(p.trim())).filter(Boolean);
    for (const part of parts) {
      if (isValidIp(part)) return part;
    }
  }

  // 3. Socket TCP directo
  if (req.socket && typeof req.socket.remoteAddress === 'string') {
    const candidate = normalizeIp(req.socket.remoteAddress);
    if (isValidIp(candidate)) return candidate;
  }

  return '127.0.0.1';
}

/**
 * Determina si la aplicación se está ejecutando en un entorno de producción / Vercel.
 */
function isProductionEnvironment(optionsOverride = {}) {
  if (optionsOverride.isProduction !== undefined) {
    return Boolean(optionsOverride.isProduction);
  }
  return (
    process.env.NODE_ENV === 'production' ||
    process.env.VERCEL === '1' ||
    process.env.VERCEL_ENV === 'production' ||
    process.env.VERCEL_ENV === 'preview'
  );
}

/**
 * Contador en memoria para desarrollo local con soporte para limitación compuesta.
 * Calcula de forma exacta el tiempo hasta la expiración de la ventana actual.
 */
function checkLocalMemoryRateLimit(studentKey, ipKey, studentLimit, ipLimit, windowSeconds, nowOverride = null) {
  cleanupExpiredMemoryEntries();
  const now = nowOverride !== null ? nowOverride : Date.now();
  const windowMs = windowSeconds * 1000;
  const currentWindowIndex = Math.floor(now / windowMs);
  const windowEndMs = (currentWindowIndex + 1) * windowMs;
  const windowRemainingSeconds = Math.max(1, Math.ceil((windowEndMs - now) / 1000));
  const storageExpiresAt = windowEndMs + windowMs; // Dos ventanas de retención para limpieza

  const studentEntry = localMemoryStore.get(studentKey);
  const ipEntry = (ipKey !== studentKey) ? localMemoryStore.get(ipKey) : null;

  const studentExceeded = Boolean(studentEntry && studentEntry.count >= studentLimit);
  const ipExceeded = Boolean(ipEntry && ipEntry.count >= ipLimit);

  // 1. Si ambos límites están excedidos
  if (studentExceeded && ipExceeded) {
    return {
      allowed: false,
      limit: studentLimit,
      remaining: 0,
      resetSeconds: windowRemainingSeconds,
      isCampusBurst: false,
      reason: 'BOTH_LIMITS'
    };
  }

  // 2. Si el límite individual fue alcanzado
  if (studentExceeded) {
    return {
      allowed: false,
      limit: studentLimit,
      remaining: 0,
      resetSeconds: windowRemainingSeconds,
      isCampusBurst: false,
      reason: 'STUDENT_LIMIT'
    };
  }

  // 3. Si el límite agregado de la IP fue alcanzado
  if (ipExceeded) {
    return {
      allowed: false,
      limit: ipLimit,
      remaining: 0,
      resetSeconds: windowRemainingSeconds,
      isCampusBurst: true,
      reason: 'IP_LIMIT'
    };
  }

  // 4. Incrementar studentKey
  if (!studentEntry) {
    localMemoryStore.set(studentKey, { count: 1, expiresAt: storageExpiresAt });
  } else {
    studentEntry.count += 1;
  }

  // 5. Incrementar ipKey si es distinta
  if (ipKey !== studentKey) {
    if (!ipEntry) {
      localMemoryStore.set(ipKey, { count: 1, expiresAt: storageExpiresAt });
    } else {
      ipEntry.count += 1;
    }
  }

  const updatedStudent = localMemoryStore.get(studentKey);

  return {
    allowed: true,
    limit: studentLimit,
    remaining: Math.max(0, studentLimit - updatedStudent.count),
    resetSeconds: windowRemainingSeconds,
    isCampusBurst: false,
    reason: 'OK'
  };
}

/**
 * Ejecuta el script Lua de forma atómica en Upstash Redis vía HTTP REST.
 */
async function executeUpstashLua(url, token, studentKey, ipKey, studentLimit, ipLimit, storageTtl, resetSeconds) {
  const cleanUrl = url.trim().replace(/\/+$/, '');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTASH_TIMEOUT_MS);

  const command = [
    'EVAL',
    ATOMIC_RATE_LIMIT_LUA,
    2,
    studentKey,
    ipKey,
    studentLimit,
    ipLimit,
    storageTtl,
    resetSeconds
  ];

  try {
    const response = await fetch(cleanUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(command),
      signal: controller.signal
    });

    clearTimeout(timer);
    if (!response.ok) {
      throw new Error(`Upstash HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    if (data && data.error) {
      throw new Error(`Upstash Redis Error: ${data.error}`);
    }

    if (!data || !Array.isArray(data.result) || data.result.length < 5) {
      throw new Error('Respuesta malformada de Upstash Redis');
    }

    const [allowedNum, currentCount, appliedLimit, resetSecs, reason] = data.result;
    const isAllowed = allowedNum === 1;

    return {
      allowed: isAllowed,
      limit: appliedLimit,
      remaining: isAllowed ? Math.max(0, appliedLimit - currentCount) : 0,
      resetSeconds: Math.max(1, Number(resetSecs || resetSeconds)),
      isCampusBurst: reason === 'IP_LIMIT',
      reason
    };
  } catch (error) {
    clearTimeout(timer);
    throw error;
  }
}

/**
 * Comprueba el límite de tasa de una solicitud entrante.
 *
 * @param {Object} req - Objeto IncomingMessage
 * @param {string} [customClientId] - Identificador de sesión de estudiante
 * @param {Object} [optionsOverride] - Opciones para pruebas unitarias / inyección de dependencias
 */
async function checkRateLimit(req, customClientId = null, optionsOverride = {}) {
  const limit = Number(optionsOverride.limit || process.env.RATE_LIMIT_MAX_REQUESTS || DEFAULT_LIMIT);
  const windowSeconds = Number(optionsOverride.windowSeconds || process.env.RATE_LIMIT_WINDOW_SECONDS || DEFAULT_WINDOW_SECONDS);
  const sharedIpBurst = Number(optionsOverride.sharedIpBurst || process.env.RATE_LIMIT_SHARED_IP_BURST || DEFAULT_SHARED_IP_BURST);

  const upstashUrl = optionsOverride.upstashUrl !== undefined ? optionsOverride.upstashUrl : process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = optionsOverride.upstashToken !== undefined ? optionsOverride.upstashToken : process.env.UPSTASH_REDIS_REST_TOKEN;
  const isDistributedConfigured = Boolean(upstashUrl && upstashToken);

  const isProd = isProductionEnvironment(optionsOverride);
  const ip = getClientIp(req);

  // Sanitizar clientId estudiantil
  let validClientId = null;
  if (typeof customClientId === 'string' && customClientId.trim()) {
    const candidate = customClientId.trim().slice(0, 64);
    if (/^[a-zA-Z0-9_.-]{4,64}$/.test(candidate)) {
      validClientId = candidate;
    }
  }

  // Claves indexadas por ventana de tiempo para rotación automática y expiración atómica
  const now = optionsOverride.now !== undefined ? Number(optionsOverride.now) : Date.now();
  const windowMs = windowSeconds * 1000;
  const currentWindowIndex = Math.floor(now / windowMs);
  const windowEndMs = (currentWindowIndex + 1) * windowMs;
  // Tiempo real exacto hasta el siguiente momento de admisión (inicio de la próxima ventana)
  const windowRemainingSeconds = Math.max(1, Math.ceil((windowEndMs - now) / 1000));
  // Tiempo de retención en almacenamiento para limpieza/tolerancia sin interferir con la cuota (2 ventanas)
  const storageTtl = windowSeconds * 2;

  const studentKey = validClientId ? `mv_rl:st:${ip}:${validClientId}:${currentWindowIndex}` : `mv_rl:ip:${ip}:${currentWindowIndex}`;
  const ipKey = `mv_rl:ip:${ip}:${currentWindowIndex}`;

  // ========================================================
  // 1. POLÍTICA PARA ENTORNO DE PRODUCCIÓN (VERCEL)
  // ========================================================
  if (isProd) {
    // Si en producción falta configurar Redis distribuido, no se permite consultar Gemini sin control
    if (!isDistributedConfigured) {
      return {
        allowed: false,
        unavailable: true,
        error: 'El servicio del Profesor Virtual no está disponible temporalmente por mantenimiento en la protección del sistema.',
        code: 'RATE_LIMITER_UNAVAILABLE',
        source: 'production_unconfigured',
        ip
      };
    }

    // Ejecutar control atómico en Upstash Redis
    try {
      const result = await executeUpstashLua(upstashUrl, upstashToken, studentKey, ipKey, limit, sharedIpBurst, storageTtl, windowRemainingSeconds);
      return {
        ...result,
        source: 'distributed',
        ip,
        clientId: validClientId
      };
    } catch (err) {
      // Si Redis distribuido falla en producción, NO se recurre a memoria local para evitar abusos distribuidos
      return {
        allowed: false,
        unavailable: true,
        error: 'El servicio de consultas experimenta una interrupción temporal en la verificación de seguridad. Por favor reintenta en unos instantes.',
        code: 'RATE_LIMITER_UNAVAILABLE',
        source: 'production_redis_failure',
        ip,
        failureError: err.message
      };
    }
  }

  // ========================================================
  // 2. POLÍTICA PARA ENTORNO DE DESARROLLO / PRUEBAS LOCALES
  // ========================================================
  if (isDistributedConfigured) {
    try {
      const result = await executeUpstashLua(upstashUrl, upstashToken, studentKey, ipKey, limit, sharedIpBurst, storageTtl, windowRemainingSeconds);
      return {
        ...result,
        source: 'distributed_dev',
        ip,
        clientId: validClientId
      };
    } catch (err) {
      // En desarrollo local, se permite fallback en memoria si Redis falla
      const memoryResult = checkLocalMemoryRateLimit(studentKey, ipKey, limit, sharedIpBurst, windowSeconds, now);
      return {
        ...memoryResult,
        source: 'fallback_memory_dev',
        ip,
        clientId: validClientId,
        fallbackError: err.message
      };
    }
  }

  // Desarrollo local sin Upstash configurado: contador en memoria local
  const memoryResult = checkLocalMemoryRateLimit(studentKey, ipKey, limit, sharedIpBurst, windowSeconds, now);
  return {
    ...memoryResult,
    source: 'local_memory_dev',
    ip,
    clientId: validClientId
  };
}

module.exports = {
  checkRateLimit,
  getClientIp,
  isValidIp,
  DEFAULT_LIMIT,
  DEFAULT_WINDOW_SECONDS,
  DEFAULT_SHARED_IP_BURST
};
