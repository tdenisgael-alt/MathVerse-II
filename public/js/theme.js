/**
 * MathVerse II - Sistema Global Compartido de Tema (Claro / Oscuro)
 * Clave compartida: 'mathverse.study.theme.v1'
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'mathverse.study.theme.v1';

  // 1. Obtener preferencia de tema: localStorage primero, luego preferencia del sistema
  function getPreferredTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {}

    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  // 2. Aplicar tema en el DOM de forma sincronizada
  function applyTheme(theme, save) {
    const isDark = theme === 'dark';
    const root = document.documentElement;

    root.setAttribute('data-theme', theme);

    // Compatibilidad con Tailwind darkMode: 'class' (ej. Calculadora Matemática)
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Actualizar <meta name="theme-color">
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', isDark ? '#090d1b' : '#10152b');
    }

    // Actualizar botones de alternancia en la página
    updateButtons(isDark);

    // Guardar si fue una acción explícita
    if (save) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (e) {}
    }

    // Notificar a observadores (ej. adaptadores Plotly)
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('mathverse:themechange', { detail: { theme, isDark } }));
      } catch (e) {}
    }
  }

  function updateButtons(isDark) {
    if (typeof document === 'undefined') return;
    const buttons = document.querySelectorAll('.study-theme-toggle, [data-theme-toggle], #theme-toggle');
    buttons.forEach(btn => {
      btn.setAttribute('aria-pressed', String(isDark));
      btn.setAttribute('aria-label', isDark ? 'Cambiar al modo claro' : 'Cambiar al modo oscuro');

      const label = btn.querySelector('#theme-label, .theme-label');
      if (label) {
        label.textContent = isDark ? 'Modo claro' : 'Modo oscuro';
      }

      const icon = btn.querySelector('.theme-icon');
      if (icon) {
        icon.textContent = isDark ? '☀' : '☾';
      }
    });
  }

  // 3. Ejecución inmediata en <head> para evitar FOUC / parpadeos
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme, false);

  // 4. Inicialización de eventos al cargar el DOM
  let lastToggleTime = 0;
  function handleToggleClick(e) {
    const now = Date.now();
    // Evitar doble alternancia si varios listeners capturan el mismo click en un tick
    if (now - lastToggleTime < 80) return;
    lastToggleTime = now;

    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
  }

  function init() {
    updateButtons(document.documentElement.getAttribute('data-theme') === 'dark');

    // Delegación de eventos para cualquier botón de alternancia presente o futuro
    document.addEventListener('click', (e) => {
      const btn = e.target && e.target.closest ? e.target.closest('.study-theme-toggle, [data-theme-toggle], #theme-toggle') : null;
      if (btn) {
        e.preventDefault();
        handleToggleClick(e);
      }
    });

    // Sincronización entre pestañas abiertas
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && (e.newValue === 'dark' || e.newValue === 'light')) {
        applyTheme(e.newValue, false);
      }
    });

    // Escucha de cambios en la preferencia del sistema operativo cuando el usuario no ha guardado preferencia manual
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        try {
          if (!localStorage.getItem(STORAGE_KEY)) {
            applyTheme(e.matches ? 'dark' : 'light', false);
          }
        } catch (err) {}
      });
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  // API global exportada
  if (typeof window !== 'undefined') {
    window.MathVerseTheme = {
      get: () => document.documentElement.getAttribute('data-theme') || getPreferredTheme(),
      isDark: () => document.documentElement.getAttribute('data-theme') === 'dark',
      set: (t) => applyTheme(t, true),
      toggle: () => {
        const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        applyTheme(current === 'dark' ? 'light' : 'dark', true);
      }
    };
  }
})();
