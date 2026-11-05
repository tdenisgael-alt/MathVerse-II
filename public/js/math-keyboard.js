/**
 * MathVerse II - Teclado Matemático Virtual Reutilizable
 * Inspirado en GeoGebra, compatible con Math.js.
 * public/js/math-keyboard.js
 */

(function (window, document) {
  'use strict';

  // Configuración de campos objetivo en MathVerse II
  const DEFAULT_TARGET_IDS = ['func', 'intFunc', 'vecP', 'vecQ', 'vecR'];

  const FIELD_LABELS = {
    func: 'f(x, y) · Diferencial',
    intFunc: 'f(x, y) · Integral',
    vecP: 'P(x, y, z) · Campo î',
    vecQ: 'Q(x, y, z) · Campo ĵ',
    vecR: 'R(x, y, z) · Campo k̂'
  };

  class MathVerseKeyboard {
    constructor(options = {}) {
      this.physicsMode = document.body?.dataset?.mathKeyboardMode === 'physics';
      this.proseActive = false;
      this.targetIds = options.targetIds || DEFAULT_TARGET_IDS;
      this.activeInput = null;
      this.isOpen = false;
      this.isMinimized = false;
      this.activeTab = this.physicsMode ? 'physics' : 'basic'; // 'basic' | 'functions' | 'calculus' | 'physics'

      this.drawerEl = null;
      this.toggleBtnEl = null;
      this.indicatorEl = null;
      this.gridContainerEl = null;

      this.init();
    }

    init() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.buildUI());
      } else {
        this.buildUI();
      }
    }

    buildUI() {
      if (document.getElementById('math-keyboard-drawer')) return;

      this.createToggleButton();
      this.createDrawer();
      if (this.physicsMode) this.attachPhysicsInputListeners();
      else this.attachInputListeners();
      this.observeLayout();

      // Cerrar con Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });
    }

    createToggleButton() {
      const btn = document.createElement('button');
      btn.id = 'math-keyboard-toggle';
      btn.type = 'button';
      btn.className = 'math-keyboard-toggle-btn';
      btn.setAttribute('aria-label', this.physicsMode ? 'Abrir teclado numérico de Física' : 'Abrir teclado matemático virtual');
      btn.setAttribute('aria-expanded', 'false');
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="2" y="4" width="20" height="16" rx="2.5"></rect>
          <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 16h10"></path>
        </svg>
        <span>Teclado</span>
        <span class="status-dot"></span>
      `;

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });

      document.body.appendChild(btn);
      this.toggleBtnEl = btn;
    }

    createDrawer() {
      const drawer = document.createElement('div');
      drawer.id = 'math-keyboard-drawer';
      drawer.className = 'math-keyboard-drawer';
      drawer.setAttribute('role', 'region');
      drawer.setAttribute('aria-label', this.physicsMode ? 'Teclado numérico de Física en pantalla' : 'Teclado matemático en pantalla');

      // 1. Header
      const header = document.createElement('div');
      header.className = 'math-keyboard-header';

      // Pestañas
      const tabs = document.createElement('div');
      tabs.className = 'math-keyboard-tabs';

      const tabDefs = this.physicsMode ? [] : [
        { id: 'basic', label: '123 Básico', active: true },
        { id: 'functions', label: 'f(x) Funciones', active: false },
        { id: 'calculus', label: '∫ Cálculo', active: false }
      ];

      tabDefs.forEach((t) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `math-keyboard-tab${t.active ? ' is-active' : ''}`;
        btn.setAttribute('data-tab', t.id);
        btn.textContent = t.label;
        tabs.appendChild(btn);
      });

      tabs.addEventListener('click', (e) => {
        const tabBtn = e.target.closest('.math-keyboard-tab');
        if (!tabBtn) return;
        const tabId = tabBtn.getAttribute('data-tab');
        this.switchTab(tabId);
      });

      // Indicador de campo activo
      const indicator = document.createElement('div');
      indicator.className = 'math-keyboard-indicator';
      indicator.innerHTML = `<span>Entrada:</span> <span class="target-name">f(x, y)</span>`;
      this.indicatorEl = indicator;

      // Controles
      const controls = document.createElement('div');
      controls.className = 'math-keyboard-controls';

      const ctrlDefs = [
        { action: 'clear', label: 'AC', cls: 'math-keyboard-ctrl-btn action-danger', title: 'Limpiar entrada activa (AC)' },
        { action: 'minimize', label: '▾', cls: 'math-keyboard-ctrl-btn', title: 'Minimizar / Restaurar' },
        { action: 'close', label: '✕', cls: 'math-keyboard-ctrl-btn close', title: 'Cerrar teclado' }
      ];

      ctrlDefs.forEach((c) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = c.cls;
        btn.setAttribute('data-action', c.action);
        btn.setAttribute('title', c.title);
        btn.textContent = c.label;
        controls.appendChild(btn);
      });

      controls.addEventListener('click', (e) => {
        const btn = e.target.closest('.math-keyboard-ctrl-btn');
        if (!btn) return;
        const action = btn.getAttribute('data-action');
        if (action === 'clear') this.clearActive();
        else if (action === 'minimize') this.toggleMinimize();
        else if (action === 'close') this.close();
      });

      // Evitar pérdida de foco al pulsar en controles del encabezado
      header.addEventListener('mousedown', (e) => {
        if (e.target.closest('button')) e.preventDefault();
      });

      header.appendChild(tabs);
      header.appendChild(indicator);
      header.appendChild(controls);
      drawer.appendChild(header);

      // 2. Cuerpo con grids para cada pestaña
      const body = document.createElement('div');
      body.className = 'math-keyboard-body';

      if (this.physicsMode) {
        body.appendChild(this.renderPhysicsGrid());
      } else {
        body.appendChild(this.renderTabBasic());
        body.appendChild(this.renderTabFunctions());
        body.appendChild(this.renderTabCalculus());
      }

      drawer.appendChild(body);
      document.body.appendChild(drawer);

      this.drawerEl = drawer;
      this.gridContainerEl = body;
    }

    renderPhysicsGrid() {
      const grid = document.createElement('div');
      grid.className = 'math-keyboard-grid is-visible';
      grid.setAttribute('data-grid-tab', 'physics');
      const keys = [
        ...'789456123'.split('').map((digit) => ({ label: digit, token: digit, cls: 'num-key' })),
        { label: '−', token: '-', cls: 'op-key' },
        { label: '0', token: '0', cls: 'num-key' },
        { label: '.', token: '.', cls: 'num-key' },
        { label: ',', token: ',', cls: 'num-key' },
        { label: ';', token: ';', cls: 'action-util tramos-only' },
        { label: '↵', token: '\n', cls: 'action-util tramos-only' },
        { label: '⌫', action: 'backspace', cls: 'action-util' },
        { label: '←', action: 'left', cls: 'action-util' },
        { label: '→', action: 'right', cls: 'action-util' }
      ];
      keys.forEach((key) => grid.appendChild(this.createKeyButton(key)));
      return grid;
    }

    renderTabBasic() {
      const grid = document.createElement('div');
      grid.className = 'math-keyboard-grid is-visible';
      grid.setAttribute('data-grid-tab', 'basic');

      const keys = [
        // Fila 1
        { label: 'x', token: 'x', cls: 'var-key' },
        { label: 'y', token: 'y', cls: 'var-key' },
        { label: 'z', token: 'z', cls: 'var-key' },
        { label: '(', token: '(', cls: 'action-util' },
        { label: ')', token: ')', cls: 'action-util' },
        { label: '⌫', action: 'backspace', cls: 'action-util' },

        // Fila 2
        { label: '7', token: '7', cls: 'num-key' },
        { label: '8', token: '8', cls: 'num-key' },
        { label: '9', token: '9', cls: 'num-key' },
        { label: '÷', token: '/', cls: 'op-key' },
        { label: 'xʸ', token: '^', cls: 'op-key' },
        { label: 'x²', token: '^2', cls: 'op-key' },

        // Fila 3
        { label: '4', token: '4', cls: 'num-key' },
        { label: '5', token: '5', cls: 'num-key' },
        { label: '6', token: '6', cls: 'num-key' },
        { label: '×', token: '*', cls: 'op-key' },
        { label: '√x', token: 'sqrt()', cls: 'fn-key' },
        { label: 'π', token: 'pi', cls: 'var-key' },

        // Fila 4
        { label: '1', token: '1', cls: 'num-key' },
        { label: '2', token: '2', cls: 'num-key' },
        { label: '3', token: '3', cls: 'num-key' },
        { label: '−', token: '-', cls: 'op-key' },
        { label: '+', token: '+', cls: 'op-key' },
        { label: 'e', token: 'e', cls: 'var-key' },

        // Fila 5
        { label: '0', token: '0', cls: 'num-key' },
        { label: '.', token: '.', cls: 'num-key' },
        { label: ',', token: ',', cls: 'num-key' },
        { label: '←', action: 'left', cls: 'action-util' },
        { label: '→', action: 'right', cls: 'action-util' },
        { label: '↵', action: 'enter', cls: 'action-enter' }
      ];

      keys.forEach((k) => grid.appendChild(this.createKeyButton(k)));
      return grid;
    }

    renderTabFunctions() {
      const grid = document.createElement('div');
      grid.className = 'math-keyboard-grid';
      grid.setAttribute('data-grid-tab', 'functions');

      const keys = [
        // Fila 1
        { label: 'sin', token: 'sin()', cls: 'fn-key' },
        { label: 'cos', token: 'cos()', cls: 'fn-key' },
        { label: 'tan', token: 'tan()', cls: 'fn-key' },
        { label: 'ln', sub: 'log', token: 'log()', cls: 'fn-key' },
        { label: 'log₁₀', token: 'log10()', cls: 'fn-key' },
        { label: 'eˣ', sub: 'exp', token: 'exp()', cls: 'fn-key' },

        // Fila 2
        { label: 'asin', token: 'asin()', cls: 'fn-key' },
        { label: 'acos', token: 'acos()', cls: 'fn-key' },
        { label: 'atan', token: 'atan()', cls: 'fn-key' },
        { label: '|x|', sub: 'abs', token: 'abs()', cls: 'fn-key' },
        { label: '√', token: 'sqrt()', cls: 'fn-key' },
        { label: '∛', token: 'cbrt()', cls: 'fn-key' },

        // Fila 3
        { label: 'sinh', token: 'sinh()', cls: 'fn-key' },
        { label: 'cosh', token: 'cosh()', cls: 'fn-key' },
        { label: 'tanh', token: 'tanh()', cls: 'fn-key' },
        { label: 'sign', token: 'sign()', cls: 'fn-key' },
        { label: 'x²', token: '^2', cls: 'op-key' },
        { label: '^', token: '^', cls: 'op-key' },

        // Fila 4
        { label: '(', token: '(', cls: 'action-util' },
        { label: ')', token: ')', cls: 'action-util' },
        { label: ',', token: ',', cls: 'action-util' },
        { label: 'π', token: 'pi', cls: 'var-key' },
        { label: 'e', token: 'e', cls: 'var-key' },
        { label: '⌫', action: 'backspace', cls: 'action-util' },

        // Fila 5
        { label: 'x', token: 'x', cls: 'var-key' },
        { label: 'y', token: 'y', cls: 'var-key' },
        { label: 'z', token: 'z', cls: 'var-key' },
        { label: '←', action: 'left', cls: 'action-util' },
        { label: '→', action: 'right', cls: 'action-util' },
        { label: '↵', action: 'enter', cls: 'action-enter' }
      ];

      keys.forEach((k) => grid.appendChild(this.createKeyButton(k)));
      return grid;
    }

    renderTabCalculus() {
      const grid = document.createElement('div');
      grid.className = 'math-keyboard-grid';
      grid.setAttribute('data-grid-tab', 'calculus');

      const keys = [
        // Fila 1: Potencias y productos multivariables comunes
        { label: 'x²', token: 'x^2', cls: 'var-key' },
        { label: 'y²', token: 'y^2', cls: 'var-key' },
        { label: 'z²', token: 'z^2', cls: 'var-key' },
        { label: 'x·y', token: 'x*y', cls: 'var-key' },
        { label: 'x·z', token: 'x*z', cls: 'var-key' },
        { label: 'y·z', token: 'y*z', cls: 'var-key' },

        // Fila 2: Formas cuadráticas e integrando típicos
        { label: 'x²+y²', token: 'x^2 + y^2', cls: 'fn-key' },
        { label: 'x²−y²', token: 'x^2 - y^2', cls: 'fn-key' },
        { label: '√(x²+y²)', token: 'sqrt(x^2 + y^2)', cls: 'fn-key' },
        { label: '|r|', sub: '3D', token: 'sqrt(x^2 + y^2 + z^2)', cls: 'fn-key' },
        { label: 'e^{-(r²)}', sub: 'Gauss', token: 'exp(-(x^2 + y^2))', cls: 'fn-key' },
        { label: 'exp()', token: 'exp()', cls: 'fn-key' },

        // Fila 3: Términos armónicos y auxiliares
        { label: 'sin(xy)', token: 'sin(x*y)', cls: 'fn-key' },
        { label: 'cos(xy)', token: 'cos(x*y)', cls: 'fn-key' },
        { label: 'ln()', token: 'log()', cls: 'fn-key' },
        { label: 'sqrt()', token: 'sqrt()', cls: 'fn-key' },
        { label: '|x|', token: 'abs()', cls: 'fn-key' },
        { label: '^', token: '^', cls: 'op-key' },

        // Fila 4: Operadores y símbolos
        { label: '+', token: '+', cls: 'op-key' },
        { label: '−', token: '-', cls: 'op-key' },
        { label: '×', token: '*', cls: 'op-key' },
        { label: '÷', token: '/', cls: 'op-key' },
        { label: '(', token: '(', cls: 'action-util' },
        { label: '⌫', action: 'backspace', cls: 'action-util' },

        // Fila 5: Variables y navegación
        { label: 'x', token: 'x', cls: 'var-key' },
        { label: 'y', token: 'y', cls: 'var-key' },
        { label: 'z', token: 'z', cls: 'var-key' },
        { label: '←', action: 'left', cls: 'action-util' },
        { label: '→', action: 'right', cls: 'action-util' },
        { label: '↵', action: 'enter', cls: 'action-enter' }
      ];

      keys.forEach((k) => grid.appendChild(this.createKeyButton(k)));
      return grid;
    }

    createKeyButton(def) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `math-key ${def.cls || ''}`;
      if (def.token) btn.setAttribute('data-token', def.token);

      if (def.sub) {
        btn.innerHTML = `<span>${def.label}</span><span class="sub-label">${def.sub}</span>`;
      } else {
        btn.textContent = def.label;
      }

      // Preservar el foco sin cancelar el clic sintetizado por un toque móvil.
      btn.addEventListener('pointerdown', (e) => e.preventDefault());
      btn.addEventListener('mousedown', (e) => e.preventDefault());

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (def.action) {
          this.handleAction(def.action);
        } else if (def.token) {
          this.insertToken(def.token);
        }
      });

      return btn;
    }

    switchTab(tabId) {
      if (!this.drawerEl) return;
      this.activeTab = tabId;

      // Actualizar botones de pestaña
      const tabs = this.drawerEl.querySelectorAll('.math-keyboard-tab');
      tabs.forEach((tab) => {
        if (tab.getAttribute('data-tab') === tabId) {
          tab.classList.add('is-active');
        } else {
          tab.classList.remove('is-active');
        }
      });

      // Actualizar grids visibles
      const grids = this.drawerEl.querySelectorAll('.math-keyboard-grid');
      grids.forEach((g) => {
        if (g.getAttribute('data-grid-tab') === tabId) {
          g.classList.add('is-visible');
        } else {
          g.classList.remove('is-visible');
        }
      });
    }

    attachInputListeners() {
      // Registrar campos por ID y por atributo data-math-keyboard
      const inputs = [];
      this.targetIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el && !inputs.includes(el)) inputs.push(el);
      });
      const dataInputs = document.querySelectorAll('input[data-math-keyboard="true"]');
      if (dataInputs && dataInputs.forEach) {
        dataInputs.forEach((el) => {
          if (!inputs.includes(el)) inputs.push(el);
        });
      }

      inputs.forEach((input) => {
        input.addEventListener('focus', () => {
          this.setActiveInput(input);
        });

        input.addEventListener('click', () => {
          this.setActiveInput(input);
        });

        input.addEventListener('keyup', () => {
          this.setActiveInput(input);
        });
      });

      // Asignar primer campo objetivo visible por defecto si existe
      if (!this.activeInput && inputs.length > 0) {
        this.setActiveInput(inputs.find((input) => input.offsetParent !== null) || inputs[0]);
      }
    }

    isPhysicsTarget(input) {
      return input && input.closest && input.closest('#cin-app') &&
        (input.id === 'cin-g' || (input.closest('.cin-card') && !input.closest('.cin-prob') &&
          (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA')));
    }

    attachPhysicsInputListeners() {
      const app = document.getElementById('cin-app');
      const activate = (event) => {
        if (this.isPhysicsTarget(event.target)) {
          this.proseActive = false;
          this.setActiveInput(event.target);
        } else if (event.target.closest?.('.cin-prob textarea')) {
          this.proseActive = true;
          this.activeInput = null;
          this.drawerEl.classList.remove('physics-tramos');
          this.updateIndicator();
          this.updateContextKeys();
        }
      };
      app.addEventListener('focusin', activate);
      app.addEventListener('click', activate);
      app.addEventListener('keyup', activate);
      app.addEventListener('input', activate);
      app.addEventListener('select', activate);
      app.querySelector('.cin-tabs').addEventListener('click', () => {
        this.activeInput = null;
        this.proseActive = !!app.querySelector('.cin-sec.on .cin-prob textarea');
        if (this.proseActive) {
          this.drawerEl.classList.remove('physics-tramos');
          this.updateIndicator();
          this.updateContextKeys();
        } else {
          this.getActiveInput();
        }
      });
      this.getActiveInput();
    }

    setActiveInput(input) {
      if (!input) return;
      this.activeInput = input;
      if (this.physicsMode) this.drawerEl.classList.toggle('physics-tramos', input.tagName === 'TEXTAREA');
      this.updateIndicator();
      this.updateContextKeys();
    }

    getActiveInput() {
      if (this.physicsMode) {
        if (this.proseActive) return null;
        if (this.isPhysicsTarget(this.activeInput) && this.activeInput.offsetParent !== null) return this.activeInput;
        const app = document.getElementById('cin-app');
        const visible = Array.from(app.querySelectorAll('.cin-sec.on input, .cin-sec.on textarea'))
          .find((input) => this.isPhysicsTarget(input) && input.offsetParent !== null);
        const fallback = visible || document.getElementById('cin-g');
        if (fallback) this.setActiveInput(fallback);
        return fallback;
      }
      const bodyContains = (el) => typeof document !== 'undefined' && document.body && (typeof document.body.contains === 'function' ? document.body.contains(el) : true);
      if (this.activeInput && bodyContains(this.activeInput) && this.activeInput.offsetParent !== null) {
        return this.activeInput;
      }

      // Buscar el primer campo visible registrado
      for (const id of this.targetIds) {
        const el = document.getElementById(id);
        if (el && el.offsetParent !== null) {
          this.setActiveInput(el);
          return el;
        }
      }

      const fallback = document.querySelector('input[data-math-keyboard="true"]');
      if (fallback) {
        this.setActiveInput(fallback);
        return fallback;
      }

      return null;
    }

    isTokenAllowed(token, input = this.activeInput) {
      if (this.physicsMode) {
        if (!this.isPhysicsTarget(input)) return false;
        const isTramos = input.tagName === 'TEXTAREA';
        if (!(/^[0-9.,-]$/.test(token) || (isTramos && (token === ';' || token === '\n')))) return false;
        if (isTramos) return true;
        const start = typeof input.selectionStart === 'number' ? input.selectionStart : input.value.length;
        const end = typeof input.selectionEnd === 'number' ? input.selectionEnd : input.value.length;
        const next = input.value.slice(0, start) + token + input.value.slice(end);
        return /^-?(?:\d+(?:[.,]\d*)?|[.,]\d*)?$/.test(next);
      }
      return !input || !['func', 'intFunc'].includes(input.id) || !/\bz\b/.test(token);
    }

    updateContextKeys() {
      this.drawerEl.querySelectorAll('.math-key').forEach((key) => {
        const token = key.getAttribute('data-token');
        key.disabled = this.physicsMode
          ? (!this.activeInput || (token !== null && !this.isTokenAllowed(token)))
          : !this.isTokenAllowed(token || '');
      });
    }

    observeLayout() {
      this.headerEl = this.drawerEl.querySelector('.math-keyboard-header');
      if (window.ResizeObserver) {
        this.layoutObserver = new window.ResizeObserver(() => {
          this.getActiveInput();
          this.updateLayout();
        });
        this.layoutObserver.observe(this.drawerEl);
        this.layoutObserver.observe(this.headerEl);
        this.targetIds.forEach((id) => {
          if (this.physicsMode) return;
          const input = document.getElementById(id);
          if (input) this.layoutObserver.observe(input);
        });
      }
      window.addEventListener('resize', () => this.updateLayout());
      this.updateLayout();
    }

    updateLayout() {
      // Incluir el borde superior; el encabezado puede ocupar más de una línea.
      const headerHeight = this.headerEl.offsetHeight + 1;
      this.drawerEl.style.setProperty('--mk-header-height', `${headerHeight}px`);
      const height = this.isOpen ? (this.isMinimized ? headerHeight : this.drawerEl.offsetHeight) : 0;
      document.body.style.setProperty('--math-keyboard-height', `${height}px`);
    }

    updateIndicator() {
      if (!this.indicatorEl) return;
      const input = this.activeInput;
      if (!input) {
        this.indicatorEl.innerHTML = this.physicsMode
          ? `<span>Enunciado:</span> <span class="target-name">teclado físico</span>`
          : `<span>Entrada:</span> <span class="target-name">Ninguna</span>`;
        return;
      }

      const id = input.id;
      const label = this.physicsMode
        ? (input.closest('label')?.firstChild?.textContent?.trim() || 'Valor')
        : (FIELD_LABELS[id] || (input.placeholder ? input.placeholder.slice(0, 15) : id || 'Expresión'));
      this.indicatorEl.innerHTML = `<span>Entrada:</span> <span class="target-name" title="${this.physicsMode ? label : id}">${label}</span>`;
    }

    insertToken(token) {
      const input = this.getActiveInput();
      if (!input || !this.isTokenAllowed(token, input)) return;

      const start = typeof input.selectionStart === 'number' ? input.selectionStart : input.value.length;
      const end = typeof input.selectionEnd === 'number' ? input.selectionEnd : input.value.length;
      const val = input.value;
      const selected = val.substring(start, end);

      let insertText = '';
      let newCursor = start;

      // 1. Manejo de funciones envolventes: sin(), sqrt(), abs(), exp(), log(), etc.
      if (token.endsWith('()')) {
        const fnName = token.slice(0, -2);
        if (selected.length > 0) {
          // Envolver la selección: sin(seleccion)
          insertText = `${fnName}(${selected})`;
          newCursor = start + insertText.length;
        } else {
          // Insertar función y colocar cursor adentro: sin(|)
          insertText = `${fnName}()`;
          newCursor = start + fnName.length + 1;
        }
      }
      // 2. Paréntesis de apertura '('
      else if (token === '(') {
        if (selected.length > 0) {
          insertText = `(${selected})`;
          newCursor = start + insertText.length;
        } else {
          insertText = '()';
          newCursor = start + 1;
        }
      }
      // 3. Potencia al cuadrado '^2'
      else if (token === '^2') {
        if (selected.length > 0) {
          // Si seleccionó un término compuesto como x + y, envolverlo: (x + y)^2
          const needsParens = selected.includes('+') || selected.includes('-') || selected.includes('*') || selected.includes('/');
          insertText = needsParens ? `(${selected})^2` : `${selected}^2`;
          newCursor = start + insertText.length;
        } else {
          insertText = '^2';
          newCursor = start + 2;
        }
      }
      // 4. Token directo (números, operadores, variables, constantes, expresiones compuestas)
      else {
        insertText = token;
        newCursor = start + token.length;
      }

      // Reemplazar rango en el input
      const newVal = val.substring(0, start) + insertText + val.substring(end);
      input.value = newVal;

      // Restaurar foco y ubicar el cursor
      input.focus();
      try {
        input.setSelectionRange(newCursor, newCursor);
      } catch (err) {}

      // Disparar evento 'input' para actualización reactiva
      input.dispatchEvent(new Event('input', { bubbles: true }));
      if (this.physicsMode) this.updateContextKeys();
    }

    handleAction(action) {
      const input = this.getActiveInput();
      if (!input) return;

      const start = typeof input.selectionStart === 'number' ? input.selectionStart : input.value.length;
      const end = typeof input.selectionEnd === 'number' ? input.selectionEnd : input.value.length;
      const val = input.value;

      if (action === 'backspace') {
        if (start !== end) {
          input.value = val.substring(0, start) + val.substring(end);
          input.focus();
          input.setSelectionRange(start, start);
        } else if (start > 0) {
          input.value = val.substring(0, start - 1) + val.substring(start);
          input.focus();
          input.setSelectionRange(start - 1, start - 1);
        }
        input.dispatchEvent(new Event('input', { bubbles: true }));
        if (this.physicsMode) this.updateContextKeys();
      } else if (action === 'left') {
        const newPos = Math.max(0, start - 1);
        input.focus();
        input.setSelectionRange(newPos, newPos);
      } else if (action === 'right') {
        const newPos = Math.min(val.length, end + 1);
        input.focus();
        input.setSelectionRange(newPos, newPos);
      } else if (action === 'enter') {
        input.focus();
        // Disparar evento 'change' para ejecutar cálculo si tiene onchange
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    clearActive() {
      const input = this.getActiveInput();
      if (!input) return;
      input.value = '';
      input.focus();
      input.setSelectionRange(0, 0);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      if (this.physicsMode) this.updateContextKeys();
    }

    open() {
      if (!this.drawerEl) return;
      this.isOpen = true;
      this.isMinimized = false;
      this.drawerEl.classList.add('is-open');
      this.drawerEl.classList.remove('is-minimized');
      document.body.classList.add('math-keyboard-open');
      this.updateLayout();

      if (this.toggleBtnEl) {
        this.toggleBtnEl.setAttribute('aria-expanded', 'true');
      }

      // Si no hay input activo, intentar enfocar el primero
      const active = this.getActiveInput();
      if (active) {
        active.focus();
      }
    }

    close() {
      if (!this.drawerEl) return;
      this.isOpen = false;
      this.isMinimized = false;
      this.drawerEl.classList.remove('is-open', 'is-minimized');
      document.body.classList.remove('math-keyboard-open');
      this.updateLayout();

      if (this.toggleBtnEl) {
        this.toggleBtnEl.setAttribute('aria-expanded', 'false');
      }
    }

    toggle() {
      if (this.isOpen && !this.isMinimized) {
        this.close();
      } else {
        this.open();
      }
    }

    toggleMinimize() {
      if (!this.isOpen) {
        this.open();
        return;
      }
      this.isMinimized = !this.isMinimized;
      if (this.isMinimized) {
        this.drawerEl.classList.add('is-minimized');
      } else {
        this.drawerEl.classList.remove('is-minimized');
      }
      this.updateLayout();
    }
  }

  // Instanciación automática
  window.MathVerseKeyboard = MathVerseKeyboard;
  window.mathVerseKeyboard = new MathVerseKeyboard();

})(typeof window !== 'undefined' ? window : this, typeof document !== 'undefined' ? document : {});
