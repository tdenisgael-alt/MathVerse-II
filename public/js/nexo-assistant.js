/**
 * NEXO Asistente Flotante Global - MathVerse II
 * Tutor inteligente contextual, persistente y responsivo.
 */

(() => {
  'use strict';

  // Evitar ejecuciones duplicadas si el script se incluye más de una vez
  if (typeof window !== 'undefined') {
    if (window.__MATHVERSE_NEXO_LOADED__) return;
    window.__MATHVERSE_NEXO_LOADED__ = true;
  }

  const STORAGE_HISTORY_KEY = 'mathverse.nexo.history.v1';
  const STORAGE_STATE_KEY = 'mathverse.nexo.state.v1';
  const STORAGE_THEME_KEY = 'mathverse.study.theme.v1';
  const STORAGE_CLIENT_ID_KEY = 'mathverse.client.id.v1';

  function getOrCreateClientId() {
    try {
      if (typeof localStorage === 'undefined') return 'mv_session';
      let id = localStorage.getItem(STORAGE_CLIENT_ID_KEY);
      if (!id || typeof id !== 'string' || id.length < 8) {
        id = 'mv_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
        localStorage.setItem(STORAGE_CLIENT_ID_KEY, id);
      }
      return id;
    } catch (e) {
      return 'mv_anonymous';
    }
  }

  // Resolución dinámica de URLs base según la ubicación de este script
  const scriptSrc = typeof document !== 'undefined' && document.currentScript
    ? document.currentScript.src
    : (typeof window !== 'undefined' ? window.location.origin + '/js/nexo-assistant.js' : '');
  const avatarUrl = scriptSrc ? new URL('../nexo/nexo-avatar.png', scriptSrc).href : '';
  const cssUrl = scriptSrc ? new URL('../css/nexo-assistant.css', scriptSrc).href : '';
  const rendererUrl = scriptSrc ? new URL('math-renderer.js', scriptSrc).href : '';

  // Inyectar automáticamente la hoja de estilos compartida si no existe en la página
  if (typeof document !== 'undefined' && !document.querySelector('link[href*="nexo-assistant.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssUrl;
    document.head.appendChild(link);
  }

  function refreshTeacherMessages() {
    if (typeof window === 'undefined' || !window.MathVerseRenderer || typeof window.MathVerseRenderer.render !== 'function') return;
    try {
      const nodes = document.querySelectorAll('.nexo-msg-teacher .nexo-msg-content[data-raw-text]');
      nodes.forEach(el => {
        const raw = el.getAttribute('data-raw-text');
        if (raw) {
          el.innerHTML = window.MathVerseRenderer.render(raw);
        }
      });
    } catch (e) {}
  }

  // Inyectar automáticamente el renderizador unificado de LaTeX si no existe en la página
  if (typeof window !== 'undefined' && !window.MathVerseRenderer && typeof document !== 'undefined' && !document.querySelector('script[src*="math-renderer.js"]')) {
    const script = document.createElement('script');
    script.src = rendererUrl;
    script.defer = true;
    script.onload = refreshTeacherMessages;
    document.head.appendChild(script);
  }

  /**
   * Detección de contexto académico según la ruta actual del navegador
   */
  function detectContext(pathOverride) {
    const rawPath = pathOverride || (typeof window !== 'undefined' && window.location ? window.location.pathname : '');
    const path = String(rawPath || '').toLowerCase();

    // Física · Cinemática
    if (path.includes('/fisica/tema-1')) {
      return {
        topic: 'Fundamentos de Cinemática',
        category: 'Física',
        chips: ['¿Diferencia entre rapidez y velocidad?', '¿Cómo convertir km/h a m/s?', '¿Qué es el desplazamiento Δx?']
      };
    }
    if (path.includes('/fisica/tema-2')) {
      return {
        topic: 'MRU (Velocidad Constante)',
        category: 'Física',
        chips: ['Fórmulas de MRU', '¿Cómo resolver un problema de encuentro?', 'Pendiente en la gráfica posición-tiempo']
      };
    }
    if (path.includes('/fisica/tema-3')) {
      return {
        topic: 'MRUV (Aceleración Constante)',
        category: 'Física',
        chips: ['Las 4 fórmulas de MRUV', '¿Cómo calcular la distancia de frenado?', 'Acelerado vs Retardado']
      };
    }
    if (path.includes('/fisica/tema-4')) {
      return {
        topic: 'Caída Libre y Vertical',
        category: 'Física',
        chips: ['Convenio de signos para g', '¿Qué ocurre en la altura máxima?', 'Fórmula de caída desde el reposo']
      };
    }
    if (path.includes('/fisica/tema-5')) {
      return {
        topic: 'Movimiento Parabólico',
        category: 'Física',
        chips: ['Descomposición de velocidad inicial', 'Alcance horizontal máximo', '¿Por qué fallan las fórmulas con desnivel?']
      };
    }
    if (path.includes('/fisica/tema-6')) {
      return {
        topic: 'Comparación y Errores',
        category: 'Física',
        chips: ['¿Cómo distinguir MRU de MRUV?', 'Los 5 errores más comunes', 'Glosario de cinemática']
      };
    }
    if (path.includes('/fisica/tema-7')) {
      return {
        topic: 'Taller de Ejercicios',
        category: 'Física',
        chips: ['El método de 6 pasos', 'Problema de encuentro paso a paso', 'Tiro oblicuo resuelto']
      };
    }
    if (path.includes('/fisica')) {
      return {
        topic: 'Física · Cinemática',
        category: 'Física',
        chips: ['Resumen de cinemática', 'Temas de cinemática disponibles', '¿Cómo usar el simulador?']
      };
    }

    // Matemática II · Unidad 3
    if (path.includes('/unidad-3/tema-6')) {
      return {
        topic: 'Teorema de Green',
        category: 'Matemática II',
        chips: ['Enunciado de Green', 'Cálculo de áreas con Green', 'Formas tangencial y normal']
      };
    }
    if (path.includes('/unidad-3/tema-5')) {
      return {
        topic: 'Integrales de Línea',
        category: 'Matemática II',
        chips: ['Integral escalar respecto a ds', 'Trabajo de un campo vectorial', 'Teorema Fundamental de integrales de línea']
      };
    }
    if (path.includes('/unidad-3/tema-4')) {
      return {
        topic: 'Rotacional de un Campo',
        category: 'Matemática II',
        chips: ['Determinante 3x3 del rotacional', 'Significado de la vorticidad', 'Condición de campo conservativo']
      };
    }
    if (path.includes('/unidad-3/tema-3')) {
      return {
        topic: 'Divergencia de un Campo',
        category: 'Matemática II',
        chips: ['¿Qué mide la divergencia?', 'Campos solenoidales', 'Fuentes y sumideros']
      };
    }
    if (path.includes('/unidad-3/tema-2')) {
      return {
        topic: 'Operador Nabla y Laplaciano',
        category: 'Matemática II',
        chips: ['Operador Nabla ∇', 'Laplaciano ∇² y funciones armónicas', 'Demostración rot(grad f) = 0']
      };
    }
    if (path.includes('/unidad-3/tema-1')) {
      return {
        topic: 'Campos Vectoriales',
        category: 'Matemática II',
        chips: ['Definición de campo vectorial', 'Líneas de flujo', 'Campo gradiente']
      };
    }
    if (path.includes('/unidad-3')) {
      return {
        topic: 'Unidad 3 · Análisis Vectorial',
        category: 'Matemática II',
        chips: ['Temario de Análisis Vectorial', 'Divergencia vs Rotacional', 'Calculadora 3D de vectores']
      };
    }

    // Matemática II · Unidades 1 y 2
    if (path.includes('/unidad-2')) {
      return {
        topic: 'Unidad 2 · Integrales Múltiples',
        category: 'Matemática II',
        chips: ['Teorema de Fubini', 'Inversión del orden de integración', 'Coordenadas polares en integrales']
      };
    }
    if (path.includes('/unidad-1')) {
      return {
        topic: 'Unidad 1 · Cálculo Diferencial',
        category: 'Matemática II',
        chips: ['Derivadas parciales', 'Ecuación del plano tangente', 'Optimización y matriz Hessiana']
      };
    }

    // Calculadoras
    if (path.includes('/calculadora/fisica')) {
      return {
        topic: 'Calculadora de Física',
        category: 'Herramientas',
        chips: ['¿Cómo escribir un problema en lenguaje natural?', 'Cambiar el valor de g a 10', 'Interpretar gráfica de trayectoria']
      };
    }
    if (path.includes('/calculadora/matematica')) {
      return {
        topic: 'Calculadora de Matemática II',
        category: 'Herramientas',
        chips: ['Visualizar campo vectorial en 3D', 'Diagnosticar si es conservativo', 'Derivadas simbólicas']
      };
    }
    if (path.includes('/calculadora')) {
      return {
        topic: 'Calculadoras MathVerse',
        category: 'Herramientas',
        chips: ['Calculadora de Matemática II', 'Calculadora de Cinemática', 'Gráficas interactivas']
      };
    }

    // Profesor y Estudio general
    if (path.includes('/profesor')) {
      return {
        topic: 'Profesor Virtual',
        category: 'Tutoría',
        chips: ['¿Cómo resolver un ejercicio paso a paso?', 'Dudas sobre Cálculo Multivariable', 'Dudas sobre Cinemática']
      };
    }
    if (path.includes('/estudio')) {
      return {
        topic: 'Espacio de Estudio',
        category: 'Académico',
        chips: ['Temario de Matemática II', 'Módulo de Física: Cinemática', '¿Por dónde empezar a estudiar?']
      };
    }

    // Página de Inicio
    return {
      topic: 'MathVerse II',
      category: 'General',
      chips: ['¿Qué es MathVerse II?', 'Explorar lecciones de Estudio', 'Probar calculadoras interactivas']
    };
  }

  const currentContext = detectContext();

  /**
   * Construye el mensaje con contexto académico respetando el límite estricto de 2500 caracteres de /api/chat.
   * Reglas de adaptación:
   * 1. No recorta jamás el mensaje del estudiante.
   * 2. Incluye el contexto más descriptivo posible que quepa en el espacio restante.
   * 3. Si el mensaje del estudiante agota el cupo (hasta 2500 caracteres), se envía completo sin prefijo.
   */
  function buildContextualMessage(text, context) {
    const MAX_LEN = 2500;
    const cleanText = (text || '').trim();
    if (!context || !context.topic) return cleanText;

    const fullPrefix = `[Página actual: "${context.topic}" (${context.category}) en MathVerse II]: `;
    if (fullPrefix.length + cleanText.length <= MAX_LEN) {
      return fullPrefix + cleanText;
    }

    const compactPrefix = `[Tema: ${context.topic} (${context.category})]: `;
    if (compactPrefix.length + cleanText.length <= MAX_LEN) {
      return compactPrefix + cleanText;
    }

    const minimalPrefix = `[Tema: ${context.topic}]: `;
    if (minimalPrefix.length + cleanText.length <= MAX_LEN) {
      return minimalPrefix + cleanText;
    }

    const shortPrefix = `[${context.topic}]: `;
    if (shortPrefix.length + cleanText.length <= MAX_LEN) {
      return shortPrefix + cleanText;
    }

    return cleanText;
  }

  /**
   * Sanitización básica y renderizado seguro de Markdown y LaTeX
   */
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatSafeMarkdown(rawText) {
    if (window.MathVerseRenderer && typeof window.MathVerseRenderer.render === 'function') {
      return window.MathVerseRenderer.render(rawText);
    }
    // Fallback defensivo inicial mientras math-renderer.js termina de cargarse
    let s = escapeHtml(rawText);
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*])\*([^*]+)\*([^*]|$)/g, '$1<em>$2</em>$3');
    const paras = s.split(/\n{2,}/);
    return paras.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
  }

  // Carga y sanitización de historial persistente desde LocalStorage
  function loadHistory() {
    try {
      if (typeof localStorage === 'undefined') return [];
      const raw = localStorage.getItem(STORAGE_HISTORY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Deduplicación y sanitización defensiva:
          // 1. Asegurar roles y formato { role: 'user' | 'assistant', text: string }
          // 2. Descartar mensajes de usuario consecutivos duplicados (residuos de fallos o reconexiones)
          const clean = [];
          for (let i = 0; i < parsed.length; i++) {
            const item = parsed[i];
            if (!item || typeof item !== 'object') continue;
            const role = (item.role === 'user') ? 'user' : 'assistant';
            const text = typeof item.text === 'string' ? item.text.trim() : '';
            if (!text) continue;

            // Evitar mensajes de usuario duplicados inmediatamente consecutivos
            if (role === 'user' && clean.length > 0 && clean[clean.length - 1].role === 'user' && clean[clean.length - 1].text === text) {
              continue;
            }
            clean.push({ role, text });
          }
          return clean;
        }
      }
    } catch (e) {}
    return [];
  }

  function saveHistory(history) {
    try {
      if (typeof localStorage === 'undefined') return;
      const toSave = (Array.isArray(history) ? history : []).slice(-12);
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(toSave));
    } catch (e) {}
  }

  /**
   * Construye el arreglo 'history' a enviar a /api/chat.
   * Reglas estrictas:
   * 1. La pregunta actual NUNCA debe estar en el historial (solo en 'message').
   * 2. Únicamente turnos anteriores pertinentes: pares de preguntas completadas y respuestas.
   * 3. Para la primera pregunta, devuelve un arreglo vacío [].
   * 4. Excluye por posición cualquier turno de usuario descolgado al final (sin respuesta).
   * 5. Mantiene intactas preguntas legítimas repetidas de turnos anteriores completados.
   * 6. Mapea roles a 'user' y 'model' para el backend /api/chat.
   */
  function getHistoryPayload(currentQuestionText, historyOverride) {
    const history = Array.isArray(historyOverride) ? historyOverride : loadHistory();

    const dialogHistory = [];
    for (const item of history) {
      if (!item || !item.text) continue;
      const text = typeof item.text === 'string' ? item.text.trim() : '';
      if (!text) continue;

      // Omitir bienvenidas locales no originadas por una consulta del estudiante
      if (item.role !== 'user' && (text.startsWith('¡Hola! Soy') || text.startsWith('Conversación reiniciada'))) {
        continue;
      }

      // Evitar turnos de usuario consecutivos idénticos sin respuesta intermedia
      if (item.role === 'user' && dialogHistory.length > 0 && dialogHistory[dialogHistory.length - 1].role === 'user' && dialogHistory[dialogHistory.length - 1].text === text) {
        continue;
      }

      dialogHistory.push({
        role: item.role === 'user' ? 'user' : 'model',
        text: text
      });
    }

    // Por posición: si el último elemento es un turno de usuario sin respuesta,
    // excluirlo para garantizar la alternancia estricta (el nuevo turno de usuario va en 'message')
    while (dialogHistory.length > 0 && dialogHistory[dialogHistory.length - 1].role === 'user') {
      dialogHistory.pop();
    }

    // Enviar como máximo los últimos 6 turnos (3 turnos completos de diálogo)
    return dialogHistory.slice(-6);
  }

  /**
   * Construcción del DOM del Asistente NEXO
   */
  function createWidgetDom() {
    // 1. Botón flotante
    const floatBtn = document.createElement('button');
    floatBtn.id = 'nexo-float-btn';
    floatBtn.className = 'nexo-float-btn';
    floatBtn.type = 'button';
    floatBtn.setAttribute('aria-label', 'Abrir asistente NEXO, Profesor Virtual');
    floatBtn.setAttribute('aria-expanded', 'false');
    floatBtn.setAttribute('aria-controls', 'nexo-chat-window');

    const floatImg = document.createElement('img');
    floatImg.src = avatarUrl;
    floatImg.alt = 'NEXO, robot flotante de MathVerse II';
    floatImg.width = 68;
    floatImg.height = 68;
    floatBtn.appendChild(floatImg);

    const tooltip = document.createElement('span');
    tooltip.className = 'nexo-float-tooltip';
    tooltip.textContent = '✦ Pregúntale a NEXO';
    floatBtn.appendChild(tooltip);

    // 2. Ventana de chat flotante
    const chatWindow = document.createElement('div');
    chatWindow.id = 'nexo-chat-window';
    chatWindow.className = 'nexo-chat-window';
    chatWindow.setAttribute('role', 'dialog');
    chatWindow.setAttribute('aria-modal', 'true');
    chatWindow.setAttribute('aria-labelledby', 'nexo-chat-title');
    chatWindow.setAttribute('aria-hidden', 'true');

    chatWindow.innerHTML = `
      <header class="nexo-chat-header">
        <img class="nexo-header-avatar" src="${avatarUrl}" alt="NEXO" width="36" height="36">
        <div class="nexo-header-info">
          <h2 class="nexo-header-title" id="nexo-chat-title">
            <span>NEXO</span>
            <span class="nexo-online-dot" title="En línea"></span>
          </h2>
          <p class="nexo-header-context" id="nexo-header-context">📍 ${escapeHtml(currentContext.topic)}</p>
        </div>
        <div class="nexo-header-actions">
          <button class="nexo-header-btn" id="nexo-btn-minimize" type="button" aria-label="Minimizar chat" title="Minimizar">_</button>
          <button class="nexo-header-btn" id="nexo-btn-theme" type="button" aria-label="Cambiar modo oscuro" title="Modo oscuro">☾</button>
          <button class="nexo-header-btn" id="nexo-btn-close" type="button" aria-label="Cerrar chat" title="Cerrar">×</button>
        </div>
      </header>

      <div class="nexo-chat-toolbar">
        <span class="nexo-context-badge">Módulo: ${escapeHtml(currentContext.category)}</span>
        <button class="nexo-clear-btn" id="nexo-btn-clear" type="button" aria-label="Reiniciar conversación con NEXO" title="Reiniciar historial">Limpiar chat</button>
      </div>

      <div class="nexo-chat-body">
        <div class="nexo-chat-messages" id="nexo-messages" role="log" aria-live="polite"></div>

        <div class="nexo-chat-loading" id="nexo-loading" aria-hidden="true">
          <div class="nexo-dots"><span></span><span></span><span></span></div>
          <span>NEXO está preparando la explicación…</span>
        </div>

        <div class="nexo-chat-error" id="nexo-error" role="alert" aria-live="assertive">
          <span id="nexo-error-text"></span>
          <button id="nexo-btn-retry" type="button" aria-label="Reintentar última consulta a NEXO">Reintentar</button>
        </div>

        <div class="nexo-chat-chips" id="nexo-chips" aria-label="Sugerencias contextuales"></div>
      </div>

      <div class="nexo-chat-input-bar">
        <form class="nexo-chat-form" id="nexo-form">
          <input class="nexo-chat-input" id="nexo-input" type="text" placeholder="Hazle una consulta a NEXO…" maxlength="2500" autocomplete="off" aria-label="Mensaje para el asistente NEXO" required>
          <button class="nexo-send-btn" id="nexo-btn-send" type="submit" aria-label="Enviar pregunta a NEXO">Enviar</button>
        </form>
      </div>
    `;

    document.body.appendChild(floatBtn);
    document.body.appendChild(chatWindow);

    return { floatBtn, chatWindow };
  }

  /**
   * Inicialización del Asistente
   */
  function initAssistant() {
    const { floatBtn, chatWindow } = createWidgetDom();

    const messagesContainer = chatWindow.querySelector('#nexo-messages');
    const loadingElem = chatWindow.querySelector('#nexo-loading');
    const errorElem = chatWindow.querySelector('#nexo-error');
    const errorText = chatWindow.querySelector('#nexo-error-text');
    const retryBtn = chatWindow.querySelector('#nexo-btn-retry');
    const chipsContainer = chatWindow.querySelector('#nexo-chips');
    const formElem = chatWindow.querySelector('#nexo-form');
    const inputElem = chatWindow.querySelector('#nexo-input');
    const sendBtn = chatWindow.querySelector('#nexo-btn-send');
    const closeBtn = chatWindow.querySelector('#nexo-btn-close');
    const minimizeBtn = chatWindow.querySelector('#nexo-btn-minimize');
    const themeBtn = chatWindow.querySelector('#nexo-btn-theme');
    const clearBtn = chatWindow.querySelector('#nexo-btn-clear');

    let isSubmitting = false;
    let lastUserQuestion = '';
    let activeAbortController = null;
    const CLIENT_TIMEOUT_MS = 11000;

    // Gestión del tema (oscuro/claro)
    function syncTheme() {
      let isDark = false;
      const docTheme = document.documentElement.getAttribute('data-theme');
      if (docTheme) {
        isDark = docTheme === 'dark';
      } else {
        try {
          const stored = localStorage.getItem(STORAGE_THEME_KEY);
          isDark = stored === 'dark';
        } catch (e) {}
      }
      chatWindow.setAttribute('data-theme', isDark ? 'dark' : 'light');
      themeBtn.textContent = isDark ? '☀' : '☾';
      themeBtn.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    }

    syncTheme();
    new MutationObserver(() => syncTheme()).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    themeBtn.addEventListener('click', () => {
      if (typeof window !== 'undefined' && window.MathVerseTheme && typeof window.MathVerseTheme.toggle === 'function') {
        window.MathVerseTheme.toggle();
      } else {
        const current = chatWindow.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        chatWindow.setAttribute('data-theme', next);
        themeBtn.textContent = next === 'dark' ? '☀' : '☾';
        try {
          localStorage.setItem(STORAGE_THEME_KEY, next);
          document.documentElement.setAttribute('data-theme', next);
        } catch (e) {}
      }
    });

    // Renderizado de mensaje en el contenedor
    function appendMessage(role, text, save = false) {
      const isUser = role === 'user';
      const msgDiv = document.createElement('div');
      msgDiv.className = `nexo-msg ${isUser ? 'nexo-msg-user' : 'nexo-msg-teacher'}`;

      const authorSpan = document.createElement('span');
      authorSpan.className = 'nexo-msg-author';
      authorSpan.textContent = isUser ? 'Tú' : 'NEXO';
      msgDiv.appendChild(authorSpan);

      const contentDiv = document.createElement('div');
      contentDiv.className = 'nexo-msg-content';

      if (isUser) {
        const p = document.createElement('p');
        p.textContent = text;
        contentDiv.appendChild(p);
      } else {
        contentDiv.setAttribute('data-raw-text', text);
        contentDiv.innerHTML = formatSafeMarkdown(text);
      }

      msgDiv.appendChild(contentDiv);
      messagesContainer.appendChild(msgDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      if (save) {
        const history = loadHistory();
        history.push({ role, text });
        saveHistory(history);
      }
    }

    // Inicializar mensajes: restaurar diálogo previo o mostrar bienvenida contextual
    const savedHistory = loadHistory();
    const hasPriorDialogue = savedHistory.some(item => item.role === 'user');

    if (hasPriorDialogue) {
      savedHistory.forEach(item => appendMessage(item.role, item.text, false));
    } else {
      const welcome = `¡Hola! Soy **NEXO**, tu asistente académico de MathVerse II.\n\nActualmente te encuentras en **${currentContext.topic}** (${currentContext.category}). ¿Qué fórmula, concepto o ejercicio deseas que analicemos paso a paso?`;
      appendMessage('assistant', welcome, false);
    }

    // Generar chips de preguntas sugeridas
    function renderChips() {
      chipsContainer.innerHTML = '';
      currentContext.chips.forEach(chipText => {
        const btn = document.createElement('button');
        btn.className = 'nexo-chip';
        btn.type = 'button';
        btn.textContent = chipText;
        btn.setAttribute('aria-label', `Preguntar a NEXO: ${chipText}`);
        btn.addEventListener('click', () => {
          if (isSubmitting) return;
          inputElem.value = chipText;
          submitQuestion(chipText);
        });
        chipsContainer.appendChild(btn);
      });
    }
    renderChips();

    let previousFocusedElement = null;

    // Estado del diálogo (abrir, minimizar, cerrar)
    function openChat() {
      previousFocusedElement = document.activeElement;
      chatWindow.classList.add('nexo-open');
      chatWindow.classList.remove('nexo-minimized');
      chatWindow.removeAttribute('aria-hidden');
      floatBtn.setAttribute('aria-expanded', 'true');
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      inputElem.focus({ preventScroll: true });
      try {
        localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify({ isOpen: true, isMinimized: false }));
      } catch (e) {}
    }

    function closeChat() {
      chatWindow.classList.remove('nexo-open');
      chatWindow.classList.remove('nexo-minimized');
      chatWindow.setAttribute('aria-hidden', 'true');
      floatBtn.setAttribute('aria-expanded', 'false');
      try {
        localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify({ isOpen: false, isMinimized: false }));
      } catch (e) {}
      // Restaurar el foco para evitar que el usuario pierda su posición
      if (previousFocusedElement && typeof previousFocusedElement.focus === 'function' && document.body.contains(previousFocusedElement)) {
        previousFocusedElement.focus();
      } else if (floatBtn && typeof floatBtn.focus === 'function') {
        floatBtn.focus();
      }
    }

    function toggleMinimize() {
      const isMinimized = chatWindow.classList.toggle('nexo-minimized');
      minimizeBtn.textContent = isMinimized ? '□' : '_';
      const label = isMinimized ? 'Expandir chat' : 'Minimizar chat';
      minimizeBtn.setAttribute('title', label);
      minimizeBtn.setAttribute('aria-label', label);
      if (isMinimized) {
        if (previousFocusedElement && typeof previousFocusedElement.focus === 'function' && document.body.contains(previousFocusedElement)) {
          previousFocusedElement.focus();
        } else if (floatBtn && typeof floatBtn.focus === 'function') {
          floatBtn.focus();
        }
      } else {
        inputElem.focus({ preventScroll: true });
      }
      try {
        localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify({ isOpen: true, isMinimized }));
      } catch (e) {}
    }

    floatBtn.addEventListener('click', () => {
      if (chatWindow.classList.contains('nexo-open') && !chatWindow.classList.contains('nexo-minimized')) {
        closeChat();
      } else {
        openChat();
      }
    });

    closeBtn.addEventListener('click', closeChat);
    minimizeBtn.addEventListener('click', toggleMinimize);

    // Navegación por teclado dentro de la ventana de chat (Focus Trap y accesibilidad)
    chatWindow.addEventListener('keydown', e => {
      if (!chatWindow.classList.contains('nexo-open') || chatWindow.classList.contains('nexo-minimized')) return;
      if (e.key === 'Tab') {
        const focusables = Array.from(chatWindow.querySelectorAll('button:not([disabled]):not([aria-hidden="true"]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'))
          .filter(el => el.offsetParent !== null || window.getComputedStyle(el).display !== 'none');
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });

    // Escape para cerrar
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && chatWindow.classList.contains('nexo-open')) {
        closeChat();
      }
    });

    // Limpiar chat
    clearBtn.addEventListener('click', () => {
      if (activeAbortController) {
        try {
          activeAbortController.isUserCancellation = true;
          activeAbortController.abort('cleared');
        } catch (e) {}
        activeAbortController = null;
      }
      try {
        localStorage.removeItem(STORAGE_HISTORY_KEY);
      } catch (e) {}
      messagesContainer.innerHTML = '';
      lastUserQuestion = '';
      const welcome = `Conversación reiniciada. ¿Qué tema de **${currentContext.topic}** deseas estudiar ahora?`;
      appendMessage('assistant', welcome, false);
      errorElem.classList.remove('nexo-visible');
    });

    // Envío y comunicación con /api/chat
    async function submitQuestion(questionText, isRetry = false) {
      const text = (questionText || '').trim();
      if (!text || isSubmitting) return;

      if (text.length > 2500) {
        showError('Tu pregunta excede el límite permitido de 2500 caracteres (tiene ' + text.length + ' caracteres). Por favor sintetízala.');
        return;
      }

      // Si existe una solicitud previa pendiente, abortarla limpiamente
      if (activeAbortController) {
        try {
          activeAbortController.isUserCancellation = true;
          activeAbortController.abort('superseded');
        } catch (e) {}
        activeAbortController = null;
      }

      const controller = new AbortController();
      activeAbortController = controller;
      let timeoutId = setTimeout(() => {
        try {
          controller.abort('timeout');
        } catch (e) {}
      }, CLIENT_TIMEOUT_MS);

      lastUserQuestion = text;
      isSubmitting = true;
      if (inputElem) {
        inputElem.value = '';
        inputElem.disabled = true;
      }
      if (sendBtn) sendBtn.disabled = true;
      errorElem.classList.remove('nexo-visible');
      loadingElem.classList.add('nexo-visible');
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      // Renderizar pregunta en el chat solo si no es un reintento
      if (!isRetry) {
        appendMessage('user', text, false);
      }

      // Preparar historial previo pertinente (excluye estrictamente la pregunta actual)
      const historyPayload = getHistoryPayload(text);

      // Añadir contexto implícito calculando dinámicamente el tamaño final para respetar los 2500 caracteres (D4)
      const contextualMessage = buildContextualMessage(text, currentContext);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: contextualMessage,
            history: historyPayload,
            clientId: getOrCreateClientId()
          }),
          signal: controller.signal
        });

        const data = await res.json().catch(() => null);
        clearTimeout(timeoutId);

        if (!res.ok) {
          let errorMsg = 'No fue posible obtener respuesta en este momento.';
          if (res.status === 504) {
            errorMsg = (data && data.error) ? data.error : 'El tiempo de espera para obtener una respuesta se ha agotado. Por favor reintenta tu consulta.';
          } else if (res.status === 503) {
            errorMsg = (data && data.error) ? data.error : 'El servicio del Profesor Virtual no está disponible (falta configurar GEMINI_API_KEY).';
          } else if (res.status === 429) {
            if (data && data.code === 'RATE_LIMITED') {
              const retrySuffix = (data.retryAfter && Number(data.retryAfter) > 0) ? ` (espera ${data.retryAfter}s)` : '';
              errorMsg = (data.error || 'Has alcanzado el límite de consultas permitidas.') + retrySuffix;
            } else if (data && data.code === 'QUOTA_EXCEEDED') {
              errorMsg = data.error || 'Se ha alcanzado la cuota de consultas de Gemini. Por favor espera unos momentos antes de reintentar.';
            } else {
              errorMsg = (data && data.error) || 'Límite de consultas alcanzado. Por favor espera un momento antes de volver a preguntar.';
            }
          } else if (data && data.code === 'MESSAGE_TOO_LONG') {
            errorMsg = data.error || 'La pregunta excede el límite permitido de 2500 caracteres. Por favor sintetiza tu consulta.';
          } else if (data && data.error) {
            errorMsg = data.error;
          }
          showError(errorMsg);
          return;
        }

        const reply = data && typeof data.reply === 'string' ? data.reply : '';
        if (!reply) {
          showError('NEXO no devolvió una respuesta válida. Intenta reformular tu pregunta.');
          return;
        }

        if (controller.isUserCancellation) {
          return;
        }

        // Renderizar respuesta en la interfaz
        appendMessage('assistant', reply, false);

        // Guardar el intercambio completado (pregunta y respuesta) en el almacenamiento local persistente
        const history = loadHistory();
        history.push({ role: 'user', text: text });
        history.push({ role: 'assistant', text: reply });
        saveHistory(history);

        // Operación exitosa: limpiar estado de reintento
        lastUserQuestion = '';
      } catch (err) {
        clearTimeout(timeoutId);
        // Si fue una cancelación voluntaria iniciada por el usuario (ej. limpiar conversación), salir en silencio
        if (controller.isUserCancellation || controller.signal.reason === 'cleared') {
          return;
        }
        if (err && (err.name === 'AbortError' || err.name === 'TimeoutError' || controller.signal.aborted)) {
          showError('El tiempo de espera para obtener una respuesta se ha agotado. Por favor reintenta tu consulta.');
        } else {
          showError('Error de conexión con el servidor. Verifica tu conexión de red.');
        }
      } finally {
        clearTimeout(timeoutId);
        if (activeAbortController === controller) {
          activeAbortController = null;
        }
        isSubmitting = false;
        if (inputElem) {
          inputElem.disabled = false;
          inputElem.focus({ preventScroll: true });
        }
        if (sendBtn) sendBtn.disabled = false;
        loadingElem.classList.remove('nexo-visible');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }

    function showError(msg) {
      errorText.textContent = msg;
      errorElem.classList.add('nexo-visible');
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    retryBtn.addEventListener('click', () => {
      if (lastUserQuestion) {
        submitQuestion(lastUserQuestion, true);
      }
    });

    formElem.addEventListener('submit', e => {
      e.preventDefault();
      submitQuestion(inputElem.value, false);
    });

    // Restaurar estado si estaba abierto previamente
    try {
      const stateRaw = localStorage.getItem(STORAGE_STATE_KEY);
      if (stateRaw) {
        const state = JSON.parse(stateRaw);
        if (state.isOpen) {
          if (state.isMinimized) {
            chatWindow.classList.add('nexo-open', 'nexo-minimized');
            chatWindow.removeAttribute('aria-hidden');
            floatBtn.setAttribute('aria-expanded', 'true');
            minimizeBtn.textContent = '□';
          } else {
            openChat();
          }
        }
      }
    } catch (e) {}

    // Cancelación limpia en caso de navegación o descarga de página
    if (typeof window !== 'undefined') {
      window.addEventListener('pagehide', () => {
        if (activeAbortController) {
          try {
            activeAbortController.isUserCancellation = true;
            activeAbortController.abort('pagehide');
          } catch (e) {}
          activeAbortController = null;
        }
      });
    }

    // Exponer API para pruebas automatizadas y extensiones
    if (typeof window !== 'undefined') {
      window.MathVerseNexo = {
        buildContextualMessage,
        detectContext,
        getHistoryPayload,
        loadHistory,
        saveHistory,
        submitQuestion,
        showError,
        appendMessage,
        openChat,
        closeChat,
        clearChat: () => clearBtn.click(),
        getActiveAbortController: () => activeAbortController
      };
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      buildContextualMessage,
      detectContext,
      getHistoryPayload,
      loadHistory,
      saveHistory
    };
  }

  if (typeof document === 'undefined') return;

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAssistant);
  } else {
    initAssistant();
  }
})();
