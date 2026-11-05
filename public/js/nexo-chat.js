(() => {
  'use strict';
  const toggle = document.getElementById('nexo-chat-toggle');
  const dialog = document.getElementById('nexo-chat');
  if (!toggle || !dialog) return;

  const question = dialog.querySelector('#question');
  const send = dialog.querySelector('#send-btn');
  const clear = dialog.querySelector('#clear-chat');
  const startup = dialog.querySelector('#nexo-chat-startup');
  const retry = dialog.querySelector('#nexo-chat-retry');
  const themeToggle = dialog.querySelector('#nexo-chat-theme');
  const themeKey = 'mathverse.study.theme.v1';
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const clientURL = new URL('../profesor/js/chat.js', document.currentScript.src).href;
  let clientReady = false;
  let clientLoading = false;

  function fitViewport() {
    // Mobile keyboards resize the visual viewport without always resizing the page.
    const viewport = window.visualViewport;
    const height = viewport ? viewport.height : window.innerHeight;
    const offset = viewport ? Math.max(0, window.innerHeight - height - viewport.offsetTop) : 0;
    dialog.style.setProperty('--nexo-visible-height', `${height}px`);
    dialog.style.setProperty('--nexo-keyboard-offset', `${offset}px`);
    toggle.style.setProperty('--nexo-keyboard-offset', `${offset}px`);
    dialog.toggleAttribute('data-compact', height <= 480);
  }
  fitViewport();
  window.addEventListener('resize', fitViewport);
  window.visualViewport?.addEventListener('resize', fitViewport);
  window.visualViewport?.addEventListener('scroll', fitViewport);

  function applyTheme(theme) {
    const dark = theme === 'dark';
    dialog.dataset.theme = dark ? 'dark' : 'light';
    themeToggle.textContent = dark ? '☀' : '☾';
    themeToggle.setAttribute('aria-label', dark ? 'Cambiar el chat al modo claro' : 'Cambiar el chat al modo oscuro');
  }

  function syncTheme() {
    let saved;
    try { saved = localStorage.getItem(themeKey); } catch (error) { /* Optional storage. */ }
    applyTheme(saved || document.documentElement.dataset.theme || (systemTheme.matches ? 'dark' : 'light'));
  }
  syncTheme();
  systemTheme.addEventListener('change', syncTheme);
  window.addEventListener('storage', event => { if (event.key === themeKey || event.key === null) syncTheme(); });
  new MutationObserver(() => {
    applyTheme(document.documentElement.dataset.theme || (systemTheme.matches ? 'dark' : 'light'));
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  themeToggle.addEventListener('click', () => {
    const theme = dialog.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    try { localStorage.setItem(themeKey, theme); } catch (error) { /* Keep theme for this visit. */ }
  });

  function loadClient() {
    if (clientReady || clientLoading) return;
    clientLoading = true;
    startup.hidden = false;
    retry.hidden = true;
    dialog.querySelector('#nexo-chat-startup-text').textContent = 'Cargando el chat…';
    const script = document.createElement('script');
    script.src = clientURL;
    script.onload = () => {
      clientReady = true;
      clientLoading = false;
      startup.hidden = true;
      clear.disabled = send.disabled;
      if (dialog.open) question.focus({ preventScroll: true });
    };
    script.onerror = () => {
      clientLoading = false;
      script.remove();
      dialog.querySelector('#nexo-chat-startup-text').textContent = 'No se pudo cargar el chat. Revisa tu conexión.';
      retry.hidden = false;
    };
    document.head.append(script);
  }
  // Reuse the existing transport and in-memory history exactly once. Closing never removes it.
  function openChat() {
    dialog.show();
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar NEXO, Profesor Virtual');
    loadClient();
    if (clientReady && !question.disabled) question.focus({ preventScroll: true });
    else dialog.querySelector('#nexo-chat-close').focus({ preventScroll: true });
    const messages = dialog.querySelector('#chat-messages');
    messages.scrollTop = messages.scrollHeight;
  }
  function closeChat() {
    dialog.close();
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir NEXO, Profesor Virtual');
    toggle.focus({ preventScroll: true });
  }
  toggle.addEventListener('click', () => { if (dialog.open) closeChat(); else openChat(); });
  dialog.querySelector('#nexo-chat-close').addEventListener('click', closeChat);
  retry.addEventListener('click', loadClient);
  // Prevent the homepage's menu Escape handler from stealing the returned focus.
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dialog.open) {
      event.preventDefault();
      event.stopImmediatePropagation();
      closeChat();
    }
  }, true);
  // Do not clear a conversation while its response is still being added by the shared client.
  new MutationObserver(() => { clear.disabled = !clientReady || send.disabled; })
    .observe(send, { attributes: true, attributeFilter: ['disabled'] });
  dialog.querySelector('#chat-form').addEventListener('submit', event => {
    if (!clientReady) event.preventDefault();
  });
})();
