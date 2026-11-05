/**
 * Profesor Virtual - MathVerse II
 * Conexión del cliente al endpoint POST /api/chat
 */

(function () {
  'use strict';

  const chatMessages = typeof document !== 'undefined' ? document.getElementById('chat-messages') : null;
  const chatForm = typeof document !== 'undefined' ? document.getElementById('chat-form') : null;
  const questionInput = typeof document !== 'undefined' ? document.getElementById('question') : null;
  const sendButton = typeof document !== 'undefined' ? document.getElementById('send-btn') : null;
  const loadingIndicator = typeof document !== 'undefined' ? document.getElementById('chat-loading') : null;
  const errorBanner = typeof document !== 'undefined' ? document.getElementById('chat-error') : null;
  const errorMessage = typeof document !== 'undefined' ? document.getElementById('chat-error-text') : null;
  const clearButton = typeof document !== 'undefined' ? document.getElementById('clear-chat') : null;
  const chipsContainer = typeof document !== 'undefined' ? document.getElementById('chat-chips') : null;

  // Historial en memoria para seguimiento pedagógico contextual
  let conversationHistory = [];
  let isSubmitting = false;
  let upgradePollTimer = null;
  let activeAbortController = null;
  const CLIENT_TIMEOUT_MS = 11000;
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

  /**
   * Escape defensivo de caracteres HTML para prevenir XSS.
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

  /**
   * Fallback semántico seguro cuando MathVerseRenderer no está disponible o falla.
   * Estructura párrafos y saltos de línea sin ejecutar código HTML activo.
   */
  function renderFallbackText(rawText) {
    const escaped = escapeHtml(rawText);
    const paragraphs = escaped.split(/\n{2,}/);
    return paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
  }

  /**
   * Renderizado seguro de respuestas del modelo con soporte de matemáticas LaTeX y Markdown.
   * Utiliza el renderizador unificado de MathVerse II con KaTeX y fallback semántico puro.
   */
  function formatSafeMarkdown(rawText) {
    if (typeof window !== 'undefined' && window.MathVerseRenderer && typeof window.MathVerseRenderer.render === 'function') {
      try {
        return window.MathVerseRenderer.render(rawText);
      } catch (err) {
        // Fallback defensivo si el renderizador falla en tiempo de ejecución
        return renderFallbackText(rawText);
      }
    }
    return renderFallbackText(rawText);
  }

  /**
   * Actualiza los mensajes mostrados en modo fallback cuando MathVerseRenderer se carga posteriormente.
   * Actualiza el contenido in-situ sin duplicar mensajes en el DOM.
   */
  function upgradePendingMessages() {
    if (!chatMessages || !window.MathVerseRenderer || typeof window.MathVerseRenderer.render !== 'function') {
      return 0;
    }

    const pendingNodes = chatMessages.querySelectorAll('.chat-bubble-content[data-pending-renderer="true"]');
    let upgradedCount = 0;
    pendingNodes.forEach(node => {
      const rawText = node.getAttribute('data-raw-text');
      if (!rawText) return;
      try {
        node.innerHTML = window.MathVerseRenderer.render(rawText);
        node.removeAttribute('data-pending-renderer');
        upgradedCount++;
      } catch (err) {
        // Si la expresión falla en KaTeX, se conserva el fallback seguro
      }
    });
    return upgradedCount;
  }

  /**
   * Programa verificación ligera para actualizar burbujas pendientes si el renderizador carga tardíamente.
   */
  function scheduleUpgradeCheck() {
    if (typeof window === 'undefined') return;
    setTimeout(() => {
      if (window.MathVerseRenderer && typeof window.MathVerseRenderer.render === 'function') {
        upgradePendingMessages();
      }
    }, 100);
  }

  /**
   * Agrega un mensaje visual a la lista de mensajes.
   */
  function appendMessage(role, text) {
    if (!chatMessages) return null;

    const msgArticle = document.createElement('article');
    const isUser = role === 'user';
    msgArticle.className = 'chat-message ' + (isUser ? 'chat-message-user' : 'chat-message-teacher');

    const authorSpan = document.createElement('span');
    authorSpan.className = 'chat-author';
    authorSpan.textContent = isUser ? 'Estudiante' : 'Profesor MathVerse';
    msgArticle.appendChild(authorSpan);

    const bubbleContent = document.createElement('div');
    bubbleContent.className = 'chat-bubble-content';

    if (isUser) {
      // Para el estudiante, renderizado estrictamente como texto plano por seguridad
      const p = document.createElement('p');
      p.textContent = text;
      bubbleContent.appendChild(p);
    } else {
      bubbleContent.setAttribute('data-raw-text', text);
      const hasRenderer = window.MathVerseRenderer && typeof window.MathVerseRenderer.render === 'function';
      if (hasRenderer) {
        try {
          bubbleContent.innerHTML = window.MathVerseRenderer.render(text);
        } catch (err) {
          bubbleContent.innerHTML = renderFallbackText(text);
          bubbleContent.setAttribute('data-pending-renderer', 'true');
          scheduleUpgradeCheck();
        }
      } else {
        bubbleContent.innerHTML = renderFallbackText(text);
        bubbleContent.setAttribute('data-pending-renderer', 'true');
        scheduleUpgradeCheck();
      }
    }

    msgArticle.appendChild(bubbleContent);
    chatMessages.appendChild(msgArticle);
    scrollToBottom();
    return msgArticle;
  }

  function scrollToBottom() {
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  function showLoading(show) {
    isSubmitting = Boolean(show);
    if (loadingIndicator) {
      loadingIndicator.hidden = !isSubmitting;
      loadingIndicator.style.display = isSubmitting ? 'flex' : 'none';
      if (!isSubmitting) {
        loadingIndicator.setAttribute('hidden', '');
      } else {
        loadingIndicator.removeAttribute('hidden');
      }
    }
    if (sendButton) {
      sendButton.disabled = isSubmitting;
    }
    if (questionInput) {
      questionInput.disabled = isSubmitting;
    }
    if (chipsContainer) {
      const chips = chipsContainer.querySelectorAll('.chat-chip');
      chips.forEach(function (btn) {
        btn.disabled = isSubmitting;
      });
    }
    if (isSubmitting) scrollToBottom();
  }

  function showError(msg) {
    const text = typeof msg === 'string' ? msg.trim() : '';
    if (!text) {
      clearError();
      return;
    }
    if (errorBanner && errorMessage) {
      errorMessage.textContent = text;
      errorBanner.hidden = false;
      errorBanner.removeAttribute('hidden');
      errorBanner.style.display = 'flex';
      scrollToBottom();
    }
  }

  function clearError() {
    if (errorBanner && errorMessage) {
      errorMessage.textContent = '';
      errorBanner.hidden = true;
      errorBanner.setAttribute('hidden', '');
      errorBanner.style.display = 'none';
    }
  }

  function clearChat() {
    if (activeAbortController) {
      try {
        activeAbortController.isUserCancellation = true;
        activeAbortController.abort('cleared');
      } catch (e) {}
      activeAbortController = null;
    }
    conversationHistory = [];
    clearError();
    showLoading(false);
    if (chatMessages) {
      chatMessages.innerHTML = '';
      appendMessage('assistant', '¡Hola! Soy tu **Profesor Virtual** de Matemática II y Física. ¿Qué concepto, teorema o ejercicio deseas que analicemos paso a paso?');
    }
    if (questionInput) {
      questionInput.value = '';
      questionInput.focus();
    }
  }

  /**
   * Envía la pregunta del estudiante a la función serverless POST /api/chat.
   */
  async function submitQuestion(questionText) {
    const message = (questionText || '').trim();
    if (!message || isSubmitting) return;

    if (message.length > 2500) {
      showError('Tu pregunta excede el límite permitido de 2500 caracteres (tiene ' + message.length + ' caracteres). Por favor sintetízala.');
      return;
    }

    // Cancelar limpiamente solicitud pendiente previa si existiera
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

    clearError();
    appendMessage('user', message);
    if (questionInput) questionInput.value = '';
    showLoading(true);

    // Preparar historial breve para preguntas de seguimiento (últimos 6 turnos)
    const historyPayload = conversationHistory.slice(-6);

    let replyText = '';
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          history: historyPayload,
          clientId: getOrCreateClientId()
        }),
        signal: controller.signal
      });

      const data = await response.json().catch(() => null);
      clearTimeout(timeoutId);

      if (!response.ok) {
        let friendlyMsg = 'No fue posible obtener una respuesta en este momento.';

        if (response.status === 504) {
          friendlyMsg = data && data.error
            ? data.error
            : 'El tiempo de espera para obtener una respuesta se ha agotado. Por favor reintenta tu pregunta.';
        } else if (response.status === 503) {
          friendlyMsg = data && data.error
            ? data.error
            : 'El servicio no está disponible: falta configurar GEMINI_API_KEY en las variables de entorno de Vercel.';
        } else if (response.status === 429) {
          if (data && data.code === 'RATE_LIMITED') {
            const retrySuffix = (data.retryAfter && Number(data.retryAfter) > 0) ? ` (espera ${data.retryAfter}s)` : '';
            friendlyMsg = (data.error || 'Has alcanzado el límite de consultas permitidas.') + retrySuffix;
          } else if (data && data.code === 'QUOTA_EXCEEDED') {
            friendlyMsg = data.error || 'Se ha alcanzado la cuota de consultas de Gemini. Por favor espera unos momentos antes de reintentar.';
          } else {
            friendlyMsg = (data && data.error) || 'Se ha alcanzado el límite de consultas. Por favor espera unos momentos antes de reintentar.';
          }
        } else if (response.status === 400) {
          friendlyMsg = data && data.error ? data.error : 'La pregunta enviada no es válida.';
        } else if (data && data.error) {
          friendlyMsg = data.error;
        }

        showError(friendlyMsg);
        return;
      }

      replyText = data && typeof data.reply === 'string' ? data.reply : '';
      if (!replyText) {
        showError('El Profesor Virtual no devolvió texto. Por favor intenta reformular tu pregunta.');
        return;
      }

      if (controller.isUserCancellation) {
        return;
      }

      // Limpiar errores previos en caso de éxito en la respuesta de la red
      clearError();

      // Guardar en el historial de seguimiento
      conversationHistory.push({ role: 'user', text: message });
      conversationHistory.push({ role: 'assistant', text: replyText });
      if (conversationHistory.length > 10) {
        conversationHistory = conversationHistory.slice(-10);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      // Cancelación voluntaria iniciada por el estudiante (ej. limpiar conversación): salir en silencio
      if (controller.isUserCancellation || controller.signal.reason === 'cleared') {
        return;
      }
      if (err && (err.name === 'AbortError' || err.name === 'TimeoutError' || controller.signal.aborted)) {
        showError('El tiempo de espera para obtener una respuesta se ha agotado. Por favor reintenta tu pregunta.');
        return;
      }
      showError('Error de conexión: No se pudo comunicar con el servidor. Verifica tu conexión a internet o el despliegue del backend.');
      return;
    } finally {
      clearTimeout(timeoutId);
      if (activeAbortController === controller) {
        activeAbortController = null;
      }
      showLoading(false);
      if (questionInput) {
        questionInput.focus();
      }
    }

    if (controller.isUserCancellation) {
      return;
    }

    // Presentación en la interfaz protegida independientemente de la llamada de red
    try {
      appendMessage('assistant', replyText);
    } catch (renderErr) {
      // Fallback ultra-defensivo en caso de anomalía imprevista en el DOM
      if (chatMessages) {
        const fallbackArticle = document.createElement('article');
        fallbackArticle.className = 'chat-message chat-message-teacher';
        const author = document.createElement('span');
        author.className = 'chat-author';
        author.textContent = 'Profesor MathVerse';
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble-content';
        bubble.textContent = replyText;
        fallbackArticle.appendChild(author);
        fallbackArticle.appendChild(bubble);
        chatMessages.appendChild(fallbackArticle);
        scrollToBottom();
      }
    }
  }

  // Manejo de eventos del formulario
  if (chatForm) {
    chatForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (questionInput) {
        submitQuestion(questionInput.value);
      }
    });
  }

  // Botón para limpiar conversación
  if (clearButton) {
    clearButton.addEventListener('click', clearChat);
  }

  // Chips con sugerencias de preguntas rápidas
  if (chipsContainer) {
    chipsContainer.addEventListener('click', function (e) {
      if (isSubmitting) return;
      const chip = e.target.closest('.chat-chip');
      if (chip && chip.dataset.query) {
        if (questionInput) {
          questionInput.value = chip.dataset.query;
          submitQuestion(chip.dataset.query);
        }
      }
    });
  }

  // Estado inicial limpio y enfocar campo al cargar la página
  clearError();
  showLoading(false);
  if (questionInput) {
    questionInput.focus();
  }

  // Detectar carga tardía del renderizador si la página termina de cargar
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    window.addEventListener('load', upgradePendingMessages);
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', upgradePendingMessages);
    } else {
      upgradePendingMessages();
    }
  }

  // Cancelación limpia en caso de navegación o descarga de página
  if (typeof window !== 'undefined') {
    window.addEventListener('pagehide', function () {
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
    window.MathVerseProfesor = {
      submitQuestion,
      showError,
      clearError,
      clearChat,
      appendMessage,
      formatSafeMarkdown,
      renderFallbackText,
      escapeHtml,
      upgradePendingMessages,
      getConversationHistory: () => conversationHistory,
      getActiveAbortController: () => activeAbortController
    };
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      escapeHtml,
      renderFallbackText,
      formatSafeMarkdown,
      upgradePendingMessages
    };
  }
})();
