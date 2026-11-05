(() => {
  'use strict';

  if (!window.MathVerseTheme) {
    const themeStorageKey = 'mathverse.study.theme.v1';
    const themeToggle = document.getElementById('theme-toggle');
    const themeLabel = document.getElementById('theme-label');
    const themeMeta = document.querySelector('meta[name="theme-color"]');

    function applyTheme(theme) {
      const isDark = theme === 'dark';
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', String(isDark));
        themeToggle.setAttribute('aria-label', isDark ? 'Cambiar al modo claro' : 'Cambiar al modo oscuro');
      }
      if (themeLabel) themeLabel.textContent = isDark ? 'Modo claro' : 'Modo oscuro';
      const icon = themeToggle?.querySelector('.theme-icon');
      if (icon) icon.textContent = isDark ? '☀' : '☾';
      if (themeMeta) themeMeta.setAttribute('content', isDark ? '#090d1b' : '#10152b');
    }

    let savedTheme = 'light';
    try {
      savedTheme = window.localStorage.getItem(themeStorageKey) || 'light';
    } catch (e) {
      savedTheme = 'light';
    }
    applyTheme(savedTheme);

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try {
          window.localStorage.setItem(themeStorageKey, next);
        } catch (e) {}
      });
    }
  }
})();
