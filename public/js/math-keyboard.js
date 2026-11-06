/**
 * MathVerse II - Teclado Matemático Virtual Reutilizable
 * Inspirado en GeoGebra, compatible con Math.js y Cinemática de Física.
 * public/js/math-keyboard.js
 */

(function (window, document) {
  'use strict';

  // Configuración de campos objetivo por defecto en Matemática II
  const DEFAULT_TARGET_IDS = ['func', 'intFunc', 'vecP', 'vecQ', 'vecR'];

  const FIELD_LABELS = {
    func: 'f(x, y) · Diferencial',
    intFunc: 'f(x, y) · Integral',
    vecP: 'P(x, y, z) · Campo î',
    vecQ: 'Q(x, y, z) · Campo ĵ',
    vecR: 'R(x, y, z) · Campo k̂'
  };

  // Base de datos de fórmulas para los ocho módulos de Cinemática
  const PHYSICS_FORMULAS = [
    {
      mod: 'mru',
      name: 'MRU',
      badge: 'Velocidad Constante',
      items: [
        { title: 'Distancia', expr: 'd = v · t', desc: 'Distancia recorrida a velocidad constante' },
        { title: 'Velocidad', expr: 'v = d / t', desc: 'Rapidez o velocidad del móvil' },
        { title: 'Tiempo', expr: 't = d / v', desc: 'Duración del movimiento' }
      ]
    },
    {
      mod: 'encuentro',
      name: 'Encuentro',
      badge: 'Sentidos Opuestos',
      items: [
        { title: 'Tiempo de encuentro', expr: 't = d / (v1 + v2)', desc: 'Tiempo hasta cruzarse en el camino' },
        { title: 'Recorrido móvil 1', expr: 'd1 = v1 · t', desc: 'Distancia recorrida por el primer móvil' },
        { title: 'Recorrido móvil 2', expr: 'd2 = v2 · t', desc: 'Distancia recorrida por el segundo móvil' }
      ]
    },
    {
      mod: 'alcance',
      name: 'Alcance',
      badge: 'Mismo Sentido',
      items: [
        { title: 'Tiempo de alcance', expr: 't = d / (v1 − v2)', desc: 'v1 > v2 (móvil veloz alcanza al lento)' },
        { title: 'Posición de alcance', expr: 'x = v1 · t', desc: 'Punto medido desde la salida del móvil rápido' }
      ]
    },
    {
      mod: 'tramos',
      name: 'Tramos',
      badge: 'Velocidad Media',
      items: [
        { title: 'Velocidad media', expr: 'v_media = d_total / t_total', desc: 'No promediar las velocidades de tramos' },
        { title: 'Distancia total', expr: 'd_total = Σ dᵢ', desc: 'Suma de todas las distancias' },
        { title: 'Tiempo total', expr: 't_total = Σ tᵢ', desc: 'Suma de todas las duraciones' }
      ]
    },
    {
      mod: 'mruv',
      name: 'MRUV / MRUA',
      badge: 'a constante (a < 0 si frena)',
      items: [
        { title: 'Velocidad final', expr: 'vf = v0 + a · t', desc: 'Ecuación horaria de rapidez (si frena, a < 0)' },
        { title: 'Distancia con aceleración', expr: 'd = v0 · t + ½ · a · t²', desc: 'Posición o desplazamiento (a conserva su signo)' },
        { title: 'Ecuación sin tiempo (Torricelli)', expr: 'vf² = v0² + 2 · a · d', desc: 'Relación v-d (si frena: vf² = v0² − 2|a|d)' },
        { title: 'Distancia con velocidad media', expr: 'd = ((v0 + vf) / 2) · t', desc: 'Válido para aceleración uniforme' },
        { title: 'Aceleración', expr: 'a = (vf − v0) / t', desc: 'a < 0 indica frenado o desaceleración' },
        { title: 'Distancia de frenado (vf = 0)', expr: 'd_frenado = v0² / (2 · |a|)', desc: 'Distancia recorrida hasta detenerse por completo' }
      ]
    },
    {
      mod: 'caida',
      name: 'Caída Libre',
      badge: 'v0 = 0 (Se suelta libremente)',
      items: [
        { title: 'Tiempo de caída', expr: 't = √(2 · h / g)', desc: 'Tiempo hasta impactar contra el suelo (g ≈ 9.8 m/s²)' },
        { title: 'Velocidad de impacto', expr: 'v = √(2 · g · h)', desc: 'Rapidez final al llegar al suelo' },
        { title: 'Altura vertical', expr: 'h = ½ · g · t²', desc: 'Distancia vertical descendida en el tiempo t' },
        { title: 'Velocidad instantánea', expr: 'v = g · t', desc: 'Rapidez vertical en descenso libre' }
      ]
    },
    {
      mod: 'vertical',
      name: 'Lanzamiento Vertical',
      badge: 'Eje vertical hacia arriba',
      items: [
        { title: 'Tiempo de subida', expr: 't_sub = v0 / g', desc: 'Instante de cúspide en que vy = 0' },
        { title: 'Altura máxima', expr: 'h_max = y0 + v0² / (2 · g)', desc: 'Cota máxima absoluta medida desde el suelo' },
        { title: 'Tiempo de vuelo simétrico (y0 = 0)', expr: 't_vuelo = 2 · v0 / g', desc: 'Válido si inicia y finaliza en el mismo nivel (y0 = 0)' },
        { title: 'Tiempo hasta el suelo (y0 > 0)', expr: 't_suelo = (v0 + √(v0² + 2·g·y0)) / g', desc: 'Tiempo total de vuelo cuando parte con altura inicial y0' },
        { title: 'Ecuación de posición', expr: 'y(t) = y0 + v0 · t − ½ · g · t²', desc: 'Posición vertical en cualquier instante t' },
        { title: 'Velocidad instantánea', expr: 'v(t) = v0 − g · t', desc: 'Positiva al subir, cero en cúspide, negativa al bajar' }
      ]
    },
    {
      mod: 'parabolico',
      name: 'Tiro Parabólico',
      badge: 'Movimiento 2D (MRU en X + MRUV en Y)',
      items: [
        { title: 'Componente horizontal v0x', expr: 'v0x = v0 · cos(θ)', desc: 'Velocidad horizontal (constante durante el vuelo)' },
        { title: 'Componente vertical v0y', expr: 'v0y = v0 · sen(θ)', desc: 'Velocidad vertical inicial' },
        { title: 'Tiempo de altura máxima', expr: 't_sub = v0y / g', desc: 'Instante de cúspide de la trayectoria' },
        { title: 'Altura máxima alcanzada', expr: 'h_max = y0 + v0y² / (2 · g)', desc: 'Punto más alto alcanzado sobre el suelo' },
        { title: 'Alcance horizontal simétrico (y0 = 0)', expr: 'R = (v0² · sen(2θ)) / g', desc: 'Alcance sobre terreno horizontal con y0 = 0' },
        { title: 'Alcance horizontal general', expr: 'R = v0x · t_total', desc: 'Distancia horizontal recorrida (válido para cualquier y0)' },
        { title: 'Tiempo total al suelo (y0 > 0)', expr: 't_total = (v0y + √(v0y² + 2·g·y0)) / g', desc: 'Tiempo total hasta impactar el suelo resolviendo y(t)=0' },
        { title: 'Posición horizontal x(t)', expr: 'x(t) = v0x · t', desc: 'MRU en el eje x (avance constante)' },
        { title: 'Posición vertical y(t)', expr: 'y(t) = y0 + v0y · t − ½ · g · t²', desc: 'MRUV en el eje vertical y con aceleración -g' },
        { title: 'Rapidez total instantánea', expr: '|v| = √(vx² + vy²)', desc: 'Módulo del vector velocidad resultante √(vx² + vy²)' }
      ]
    }
  ];

  class MathVerseKeyboard {
    constructor(options = {}) {
      this.physicsMode = document.body?.dataset?.mathKeyboardMode === 'physics';
      this.targetIds = options.targetIds || DEFAULT_TARGET_IDS;
      this.activeInput = null;
      this.isOpen = false;
      this.isMinimized = false;
      this.activeTab = this.physicsMode ? 'physics_num' : 'basic';
      this.formulaFilter = 'all';

      this.drawerEl = null;
      this.toggleBtnEl = null;
      this.indicatorEl = null;
      this.gridContainerEl = null;
      this._toastTimeout = null;

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
      if (this.physicsMode) {
        this.attachPhysicsInputListeners();
      } else {
        this.attachInputListeners();
      }
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
      btn.setAttribute('aria-label', this.physicsMode ? 'Abrir teclado científico de Física' : 'Abrir teclado matemático virtual');
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
      drawer.setAttribute('aria-label', this.physicsMode ? 'Teclado científico de Física en pantalla' : 'Teclado matemático en pantalla');

      // 1. Encabezado
      const header = document.createElement('div');
      header.className = 'math-keyboard-header';

      // Pestañas dinámicas según el modo (Física o Matemática)
      const tabs = document.createElement('div');
      tabs.className = 'math-keyboard-tabs';

      const tabDefs = this.physicsMode ? [
        { id: 'physics_num', label: '123 Números', active: true },
        { id: 'physics_mag', label: 'x Magnitudes', active: false },
        { id: 'physics_unit', label: 'm/s Unidades', active: false },
        { id: 'physics_form', label: 'fx Fórmulas', active: false }
      ] : [
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
      indicator.innerHTML = `<span>Entrada:</span> <span class="target-name">${this.physicsMode ? 'Enunciado del problema' : 'f(x, y)'}</span>`;
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

      // 2. Cuerpo del cajón
      const body = document.createElement('div');
      body.className = 'math-keyboard-body';

      if (this.physicsMode) {
        body.appendChild(this.renderPhysicsTabNumeric());
        body.appendChild(this.renderPhysicsTabMagnitudes());
        body.appendChild(this.renderPhysicsTabUnits());
        body.appendChild(this.renderPhysicsTabFormulas());
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

    // =========================================================================
    // SECCIONES DE FÍSICA
    // =========================================================================

    /**
     * A. Pestaña NUMÉRICO de Física
     */
    renderPhysicsTabNumeric() {
      const grid = document.createElement('div');
      grid.className = 'math-keyboard-grid is-visible';
      grid.setAttribute('data-grid-tab', 'physics_num');

      const keys = [
        // Fila 1
        { label: '7', token: '7', cls: 'num-key' },
        { label: '8', token: '8', cls: 'num-key' },
        { label: '9', token: '9', cls: 'num-key' },
        { label: '⌫', action: 'backspace', cls: 'action-util' },
        { label: 'AC', action: 'clear', cls: 'action-danger' },
        { label: '±', action: 'toggle_sign', cls: 'op-key' },

        // Fila 2
        { label: '4', token: '4', cls: 'num-key' },
        { label: '5', token: '5', cls: 'num-key' },
        { label: '6', token: '6', cls: 'num-key' },
        { label: '−', token: '-', cls: 'op-key' },
        { label: '+', token: '+', cls: 'op-key' },
        { label: '↵', action: 'enter', cls: 'action-enter', title: 'Calcular / Enter' },

        // Fila 3
        { label: '1', token: '1', cls: 'num-key' },
        { label: '2', token: '2', cls: 'num-key' },
        { label: '3', token: '3', cls: 'num-key' },
        { label: '.', token: '.', cls: 'num-key' },
        { label: ',', token: ',', cls: 'num-key' },
        { label: ';', token: ';', cls: 'action-util', title: 'Separador de tramos (;)' },

        // Fila 4
        { label: '0', token: '0', cls: 'num-key' },
        { label: '00', token: '00', cls: 'num-key' },
        { label: '(', token: '(', cls: 'action-util' },
        { label: ')', token: ')', cls: 'action-util' },
        { label: '←', action: 'left', cls: 'action-util' },
        { label: '→', action: 'right', cls: 'action-util' }
      ];

      keys.forEach((key) => grid.appendChild(this.createKeyButton(key)));
      return grid;
    }

    /**
     * B. Pestaña MAGNITUDES de Física
     */
    renderPhysicsTabMagnitudes() {
      const grid = document.createElement('div');
      grid.className = 'math-keyboard-grid';
      grid.setAttribute('data-grid-tab', 'physics_mag');

      const keys = [
        // Fila 1: Posición y distancia
        { label: 'd', sub: 'distancia', token: 'd', cls: 'var-key' },
        { label: 'Δx', sub: 'desplaz.', token: 'Δx', cls: 'var-key' },
        { label: 'x', sub: 'pos horiz', token: 'x', cls: 'var-key' },
        { label: 'y', sub: 'pos vert', token: 'y', cls: 'var-key' },
        { label: 'y₀', sub: 'alt inicial', token: 'y0', cls: 'var-key' },
        { label: 'h', sub: 'altura', token: 'h', cls: 'var-key' },

        // Fila 2: Tiempo y cotas
        { label: 't', sub: 'tiempo', token: 't', cls: 'var-key' },
        { label: 'Δt', sub: 'intervalo', token: 'Δt', cls: 'var-key' },
        { label: 't_sub', sub: 'subida', token: 'ts', cls: 'var-key' },
        { label: 't_max', sub: 'vuelo', token: 't_max', cls: 'var-key' },
        { label: 'h_max', sub: 'alt máx', token: 'h_max', cls: 'var-key' },
        { label: 'R', sub: 'alcance', token: 'R', cls: 'var-key' },

        // Fila 3: Velocidades
        { label: 'v', sub: 'rapidez', token: 'v', cls: 'var-key' },
        { label: 'v₀', sub: 'vel inicial', token: 'v0', cls: 'var-key' },
        { label: 'vf', sub: 'vel final', token: 'vf', cls: 'var-key' },
        { label: 'v0x', sub: 'v inicial x', token: 'v0x', cls: 'var-key' },
        { label: 'v0y', sub: 'v inicial y', token: 'v0y', cls: 'var-key' },
        { label: 'vm', sub: 'vel media', token: 'vm', cls: 'var-key' },

        // Fila 4: Aceleración, gravedad y ángulos
        { label: 'v₁', sub: 'móvil 1', token: 'v1', cls: 'var-key' },
        { label: 'v₂', sub: 'móvil 2', token: 'v2', cls: 'var-key' },
        { label: 'a', sub: 'aceleración', token: 'a', cls: 'var-key' },
        { label: 'g', sub: 'gravedad', token: 'g', cls: 'var-key' },
        { label: 'θ', sub: 'ángulo', token: 'θ', cls: 'var-key' },
        { label: '⌫', action: 'backspace', cls: 'action-util' }
      ];

      keys.forEach((key) => grid.appendChild(this.createKeyButton(key)));
      return grid;
    }

    /**
     * C. Pestaña UNIDADES Y SÍMBOLOS de Física
     */
    renderPhysicsTabUnits() {
      const grid = document.createElement('div');
      grid.className = 'math-keyboard-grid';
      grid.setAttribute('data-grid-tab', 'physics_unit');

      const keys = [
        // Fila 1: Longitud y tiempo
        { label: 'm', sub: 'metros', token: 'm', cls: 'fn-key' },
        { label: 'km', sub: 'kilómetros', token: 'km', cls: 'fn-key' },
        { label: 'cm', sub: 'centímetros', token: 'cm', cls: 'fn-key' },
        { label: 's', sub: 'segundos', token: 's', cls: 'fn-key' },
        { label: 'min', sub: 'minutos', token: 'min', cls: 'fn-key' },
        { label: 'h', sub: 'horas', token: 'h', cls: 'fn-key' },

        // Fila 2: Velocidad, aceleración y ángulos
        { label: 'm/s', sub: 'rapidez', token: 'm/s', cls: 'fn-key' },
        { label: 'km/h', sub: 'rapidez', token: 'km/h', cls: 'fn-key' },
        { label: 'm/s²', sub: 'aceleración', token: 'm/s²', cls: 'fn-key' },
        { label: '°', sub: 'grados', token: '°', cls: 'fn-key' },
        { label: 'rad', sub: 'radianes', token: 'rad', cls: 'fn-key' },
        { label: 'Δ', sub: 'delta', token: 'Δ', cls: 'op-key' },

        // Fila 3: Símbolos matemáticos
        { label: 'π', sub: 'pi', token: 'π', cls: 'var-key' },
        { label: 'x²', sub: 'cuadrado', token: '²', cls: 'op-key' },
        { label: '√', sub: 'raíz', token: '√', cls: 'fn-key' },
        { label: '×', sub: 'por', token: ' · ', cls: 'op-key' },
        { label: '÷', sub: 'entre', token: ' / ', cls: 'op-key' },
        { label: '±', sub: 'más/menos', token: '±', cls: 'op-key' },

        // Fila 4: Vectores y utilidades
        { label: 'î', sub: 'eje x', token: 'î', cls: 'var-key' },
        { label: 'ĵ', sub: 'eje y', token: 'ĵ', cls: 'var-key' },
        { label: 'k̂', sub: 'eje z', token: 'k̂', cls: 'var-key' },
        { label: '(', token: '(', cls: 'action-util' },
        { label: ')', token: ')', cls: 'action-util' },
        { label: '⌫', action: 'backspace', cls: 'action-util' }
      ];

      keys.forEach((key) => grid.appendChild(this.createKeyButton(key)));
      return grid;
    }

    /**
     * D. Pestaña FÓRMULAS de Física (Panel Consultivo e Interactivo)
     */
    renderPhysicsTabFormulas() {
      const container = document.createElement('div');
      container.className = 'math-keyboard-grid math-keyboard-formulas-container';
      container.setAttribute('data-grid-tab', 'physics_form');

      // Barra de filtros por módulo
      const filterBar = document.createElement('div');
      filterBar.className = 'math-keyboard-form-filter';

      const filters = [
        { id: 'all', label: 'Todos' },
        { id: 'mru', label: 'MRU' },
        { id: 'encuentro', label: 'Encuentro' },
        { id: 'alcance', label: 'Alcance' },
        { id: 'tramos', label: 'Tramos' },
        { id: 'mruv', label: 'MRUV' },
        { id: 'caida', label: 'Caída Libre' },
        { id: 'vertical', label: 'Lanzamiento' },
        { id: 'parabolico', label: 'Parabólico' }
      ];

      filters.forEach((f) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `math-keyboard-filter-pill${f.id === this.formulaFilter ? ' is-active' : ''}`;
        btn.setAttribute('data-filter', f.id);
        btn.textContent = f.label;
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.formulaFilter = f.id;
          filterBar.querySelectorAll('.math-keyboard-filter-pill').forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          this.updateFormulasList(listContainer);
        });
        filterBar.appendChild(btn);
      });

      container.appendChild(filterBar);

      // Lista de tarjetas de fórmulas
      const listContainer = document.createElement('div');
      listContainer.className = 'math-keyboard-formulas-list';
      this.updateFormulasList(listContainer);
      container.appendChild(listContainer);

      return container;
    }

    updateFormulasList(container) {
      container.innerHTML = '';
      const filter = this.formulaFilter;

      const filtered = filter === 'all'
        ? PHYSICS_FORMULAS
        : PHYSICS_FORMULAS.filter(m => m.mod === filter);

      filtered.forEach((mod) => {
        const card = document.createElement('div');
        card.className = 'math-keyboard-form-card';

        const head = document.createElement('div');
        head.className = 'math-keyboard-form-card-head';
        head.innerHTML = `
          <div class="math-keyboard-form-mod-name">${mod.name}</div>
          <div class="math-keyboard-form-badge">${mod.badge}</div>
        `;
        card.appendChild(head);

        const itemsBox = document.createElement('div');
        itemsBox.className = 'math-keyboard-form-items';

        mod.items.forEach((item) => {
          const row = document.createElement('div');
          row.className = 'math-keyboard-form-row';

          row.innerHTML = `
            <div class="math-keyboard-form-row-info">
              <span class="math-keyboard-form-row-title">${item.title}</span>
              <code class="math-keyboard-form-expr">${item.expr}</code>
              <span class="math-keyboard-form-row-desc">${item.desc}</span>
            </div>
          `;

          const actions = document.createElement('div');
          actions.className = 'math-keyboard-form-row-actions';

          // Botón Copiar fórmula
          const copyBtn = document.createElement('button');
          copyBtn.type = 'button';
          copyBtn.className = 'math-keyboard-form-btn copy-btn';
          copyBtn.textContent = 'Copiar';
          copyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.copySymbolFeedback(item.expr);
          });
          actions.appendChild(copyBtn);

          // Si el input activo es el textarea del problema, ofrecer botón Insertar
          const activeInput = this.getActiveInput();
          const isProblemText = activeInput && activeInput.tagName === 'TEXTAREA' &&
            (activeInput.classList.contains('cin-ta') || !!activeInput.closest('.cin-prob'));

          if (isProblemText) {
            const insertBtn = document.createElement('button');
            insertBtn.type = 'button';
            insertBtn.className = 'math-keyboard-form-btn insert-btn';
            insertBtn.textContent = 'Insertar';
            insertBtn.addEventListener('click', (e) => {
              e.preventDefault();
              this.insertRawText(activeInput, item.expr);
              this.showToast(`Insertada: ${item.title}`);
            });
            actions.appendChild(insertBtn);
          }

          row.appendChild(actions);
          itemsBox.appendChild(row);
        });

        card.appendChild(itemsBox);
        container.appendChild(card);
      });
    }

    // =========================================================================
    // SECCIONES DE MATEMÁTICA II (CONSERVADAS INTACTAS)
    // =========================================================================

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
        // Fila 1
        { label: 'x²', token: 'x^2', cls: 'var-key' },
        { label: 'y²', token: 'y^2', cls: 'var-key' },
        { label: 'z²', token: 'z^2', cls: 'var-key' },
        { label: 'x·y', token: 'x*y', cls: 'var-key' },
        { label: 'x·z', token: 'x*z', cls: 'var-key' },
        { label: 'y·z', token: 'y*z', cls: 'var-key' },

        // Fila 2
        { label: 'x²+y²', token: 'x^2 + y^2', cls: 'fn-key' },
        { label: 'x²−y²', token: 'x^2 - y^2', cls: 'fn-key' },
        { label: '√(x²+y²)', token: 'sqrt(x^2 + y^2)', cls: 'fn-key' },
        { label: '|r|', sub: '3D', token: 'sqrt(x^2 + y^2 + z^2)', cls: 'fn-key' },
        { label: 'e^{-(r²)}', sub: 'Gauss', token: 'exp(-(x^2 + y^2))', cls: 'fn-key' },
        { label: 'exp()', token: 'exp()', cls: 'fn-key' },

        // Fila 3
        { label: 'sin(xy)', token: 'sin(x*y)', cls: 'fn-key' },
        { label: 'cos(xy)', token: 'cos(x*y)', cls: 'fn-key' },
        { label: 'ln()', token: 'log()', cls: 'fn-key' },
        { label: 'sqrt()', token: 'sqrt()', cls: 'fn-key' },
        { label: '|x|', token: 'abs()', cls: 'fn-key' },
        { label: '^', token: '^', cls: 'op-key' },

        // Fila 4
        { label: '+', token: '+', cls: 'op-key' },
        { label: '−', token: '-', cls: 'op-key' },
        { label: '×', token: '*', cls: 'op-key' },
        { label: '÷', token: '/', cls: 'op-key' },
        { label: '(', token: '(', cls: 'action-util' },
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

    createKeyButton(def) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `math-key ${def.cls || ''}`;
      if (def.token) btn.setAttribute('data-token', def.token);
      if (def.title) btn.setAttribute('title', def.title);

      if (def.sub) {
        btn.innerHTML = `<span>${def.label}</span><span class="sub-label">${def.sub}</span>`;
      } else {
        btn.textContent = def.label;
      }

      // Preservar foco sin cancelar toque
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

    // =========================================================================
    // DETECCIÓN Y CONEXIÓN DE CAMPOS ACTIVOS
    // =========================================================================

    attachInputListeners() {
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
        input.addEventListener('focus', () => this.setActiveInput(input));
        input.addEventListener('click', () => this.setActiveInput(input));
        input.addEventListener('keyup', () => this.setActiveInput(input));
      });

      if (!this.activeInput && inputs.length > 0) {
        this.setActiveInput(inputs.find((input) => input.offsetParent !== null) || inputs[0]);
      }
    }

    isPhysicsTarget(input) {
      if (!input || !input.closest) return false;
      if (input.id === 'cin-g') return true;
      const app = input.closest('#cin-app');
      if (!app) return false;
      return (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA');
    }

    getPhysicsInputLabel(input) {
      if (!input) return 'Ninguna';
      if (input.id === 'cin-g') return 'Gravedad g (m/s²)';
      if (input.classList.contains('cin-ta') || input.closest('.cin-prob')) {
        return 'Enunciado del problema';
      }
      const labelEl = input.closest('label');
      if (labelEl) {
        const clone = labelEl.cloneNode(true);
        const insideInput = clone.querySelector('input, textarea');
        if (insideInput) insideInput.remove();
        const text = clone.textContent.trim();
        if (text) return text;
      }
      const card = input.closest('.cin-card');
      const cardTitle = card ? card.querySelector('h3')?.textContent.trim() : '';
      const ph = input.placeholder ? input.placeholder.slice(0, 20) : '';
      return ph ? (cardTitle ? `${cardTitle} (${ph})` : ph) : (cardTitle || 'Campo de Física');
    }

    attachPhysicsInputListeners() {
      const app = document.getElementById('cin-app');
      if (!app) return;

      const activate = (event) => {
        const target = event.target;
        if (this.isPhysicsTarget(target)) {
          this.setActiveInput(target);
        }
      };

      app.addEventListener('focusin', activate);
      app.addEventListener('click', activate);
      app.addEventListener('keyup', activate);
      app.addEventListener('input', activate);

      // Sincronizar automáticamente al cambiar de pestaña en cin-tabs
      const tabsEl = app.querySelector('.cin-tabs');
      if (tabsEl) {
        tabsEl.addEventListener('click', () => {
          setTimeout(() => {
            const activeSec = app.querySelector('.cin-sec.on');
            if (activeSec) {
              const firstInput = activeSec.querySelector('textarea, input');
              if (firstInput) {
                this.setActiveInput(firstInput);
              }
            }
          }, 40);
        });
      }

      // Buscar campo activo inicial tras carga de cinematica.js
      setTimeout(() => {
        this.getActiveInput();
      }, 100);
    }

    setActiveInput(input) {
      if (!input) return;
      this.activeInput = input;
      this.updateIndicator();
    }

    getActiveInput() {
      if (this.physicsMode) {
        if (this.activeInput && this.isPhysicsTarget(this.activeInput) && this.activeInput.offsetParent !== null) {
          return this.activeInput;
        }

        const app = document.getElementById('cin-app');
        if (app) {
          const visible = Array.from(app.querySelectorAll('.cin-sec.on input, .cin-sec.on textarea'))
            .find((input) => this.isPhysicsTarget(input) && input.offsetParent !== null);
          const fallback = visible || document.getElementById('cin-g');
          if (fallback) {
            this.setActiveInput(fallback);
            return fallback;
          }
        }
        return null;
      }

      const bodyContains = (el) => typeof document !== 'undefined' && document.body && (typeof document.body.contains === 'function' ? document.body.contains(el) : true);
      if (this.activeInput && bodyContains(this.activeInput) && this.activeInput.offsetParent !== null) {
        return this.activeInput;
      }

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

    updateIndicator() {
      if (!this.indicatorEl) return;
      const input = this.activeInput;
      if (!input) {
        this.indicatorEl.innerHTML = `<span>Entrada:</span> <span class="target-name">Ninguna</span>`;
        return;
      }

      if (this.physicsMode) {
        const label = this.getPhysicsInputLabel(input);
        this.indicatorEl.innerHTML = `<span>Entrada:</span> <span class="target-name" title="${label}">${label}</span>`;
      } else {
        const id = input.id;
        const label = FIELD_LABELS[id] || (input.placeholder ? input.placeholder.slice(0, 15) : id || 'Expresión');
        this.indicatorEl.innerHTML = `<span>Entrada:</span> <span class="target-name" title="${id}">${label}</span>`;
      }
    }

    // =========================================================================
    // INSERCIÓN INTELIGENTE DE TOKENS Y ACCIONES
    // =========================================================================

    insertToken(token) {
      const input = this.getActiveInput();
      if (!input) return;

      const isTextarea = input.tagName === 'TEXTAREA';
      const isProblemText = isTextarea && (input.classList.contains('cin-ta') || !!input.closest('.cin-prob'));
      const isTramos = isTextarea && !isProblemText;

      // 1. Modo Física en campos puramente numéricos
      if (this.physicsMode && !isTextarea) {
        if (token === '±' || token === '+/-') {
          this.toggleSign(input);
          return;
        }

        if (token === '-') {
          this.toggleSign(input);
          return;
        }

        if (token === '.' || token === ',') {
          this.insertDecimal(input, token);
          return;
        }

        if (/^[0-9]$/.test(token) || token === '00') {
          this.insertRawText(input, token);
          return;
        }

        // Si es una magnitud, intentar saltar al campo correspondiente en la tarjeta actual
        if (this.tryFocusCardField(input, token)) {
          return;
        }

        // Si es unidad o símbolo matemático, copiar al portapapeles sin corromper el campo numérico
        this.copySymbolFeedback(token);
        return;
      }

      // 2. Modo Física en textarea de Tramos (distancia,tiempo)
      if (this.physicsMode && isTramos) {
        if (/^[0-9.,;\n\-]$/.test(token) || token === '00') {
          this.insertRawText(input, token);
          return;
        }
        if (token === '±') {
          this.toggleSign(input);
          return;
        }
        this.copySymbolFeedback(token);
        return;
      }

      // 3. Textarea de Enunciado de Física (admite números, magnitudes, unidades y símbolos)
      if (this.physicsMode && isProblemText) {
        if (token === '±') {
          this.insertRawText(input, '±');
          return;
        }
        // Añadir espacio previo si se inserta una unidad pegada a un número
        if (/^(m|km|cm|s|min|h|m\/s|km\/h|m\/s²|rad)$/.test(token)) {
          const val = input.value;
          const pos = typeof input.selectionStart === 'number' ? input.selectionStart : val.length;
          const charBefore = pos > 0 ? val[pos - 1] : '';
          const prefix = (/[\d\)]/.test(charBefore)) ? ' ' : '';
          this.insertRawText(input, prefix + token);
          return;
        }
        this.insertRawText(input, token);
        return;
      }

      // 4. Modo Matemática II
      this.insertMathJSToken(input, token);
    }

    insertDecimal(input, decChar) {
      let val = input.value;
      const selStart = typeof input.selectionStart === 'number' ? input.selectionStart : val.length;
      const selEnd = typeof input.selectionEnd === 'number' ? input.selectionEnd : val.length;
      const selText = val.substring(selStart, selEnd);
      const selHasDecimal = selText.includes('.') || selText.includes(',');
      const valHasDecimal = val.includes('.') || val.includes(',');

      // Si ya tiene decimal y no lo estamos reemplazando, evitar duplicar punto/coma
      if (valHasDecimal && !selHasDecimal) {
        input.focus();
        return;
      }

      // Si el campo está vacío o solo tiene signo menos, anteponer 0
      if (val === '' || val === '-') {
        this.insertRawText(input, (val === '-' ? '' : '0') + decChar);
      } else {
        this.insertRawText(input, decChar);
      }
    }

    toggleSign(input) {
      let val = input.value;
      if (val.startsWith('-')) {
        input.value = val.substring(1);
      } else {
        input.value = '-' + val;
      }
      input.focus();
      try {
        const len = input.value.length;
        input.setSelectionRange(len, len);
      } catch (e) {}
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      this.updateIndicator();
    }

    tryFocusCardField(currentInput, token) {
      const card = currentInput.closest('.cin-card');
      if (!card) return false;

      // Normalizar nombre de magnitud
      const key = token.replace(/[₀₁₂]/g, (m) => ({ '₀': '0', '₁': '1', '₂': '2' }[m] || m)).toLowerCase();
      const labels = Array.from(card.querySelectorAll('label'));

      for (const lbl of labels) {
        const text = lbl.textContent.toLowerCase();
        if (new RegExp('\\b' + key + '\\b').test(text)) {
          const targetInp = lbl.querySelector('input, textarea');
          if (targetInp && targetInp !== currentInput) {
            targetInp.focus();
            this.setActiveInput(targetInp);
            this.showToast(`Enfocado: ${this.getPhysicsInputLabel(targetInp)}`);
            return true;
          }
        }
      }
      return false;
    }

    insertRawText(input, text) {
      let start = input.value.length;
      let end = input.value.length;
      try {
        if (typeof input.selectionStart === 'number') {
          start = input.selectionStart;
          end = input.selectionEnd;
        }
      } catch (e) {}

      const val = input.value;
      const newVal = val.substring(0, start) + text + val.substring(end);
      input.value = newVal;

      const newCursor = start + text.length;
      input.focus();
      try {
        input.setSelectionRange(newCursor, newCursor);
      } catch (err) {}

      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      this.updateIndicator();
    }

    insertMathJSToken(input, token) {
      let start = input.value.length;
      let end = input.value.length;
      try {
        if (typeof input.selectionStart === 'number') {
          start = input.selectionStart;
          end = input.selectionEnd;
        }
      } catch (e) {}

      const val = input.value;
      const selected = val.substring(start, end);

      let insertText = '';
      let newCursor = start;

      if (token.endsWith('()')) {
        const fnName = token.slice(0, -2);
        if (selected.length > 0) {
          insertText = `${fnName}(${selected})`;
          newCursor = start + insertText.length;
        } else {
          insertText = `${fnName}()`;
          newCursor = start + fnName.length + 1;
        }
      } else if (token === '(') {
        if (selected.length > 0) {
          insertText = `(${selected})`;
          newCursor = start + insertText.length;
        } else {
          insertText = '()';
          newCursor = start + 1;
        }
      } else if (token === '^2') {
        if (selected.length > 0) {
          const needsParens = selected.includes('+') || selected.includes('-') || selected.includes('*') || selected.includes('/');
          insertText = needsParens ? `(${selected})^2` : `${selected}^2`;
          newCursor = start + insertText.length;
        } else {
          insertText = '^2';
          newCursor = start + 2;
        }
      } else {
        insertText = token;
        newCursor = start + token.length;
      }

      input.value = val.substring(0, start) + insertText + val.substring(end);
      input.focus();
      try {
        input.setSelectionRange(newCursor, newCursor);
      } catch (err) {}

      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      this.updateIndicator();
    }

    handleAction(action) {
      const input = this.getActiveInput();
      if (!input) return;

      let start = input.value.length;
      let end = input.value.length;
      try {
        if (typeof input.selectionStart === 'number') {
          start = input.selectionStart;
          end = input.selectionEnd;
        }
      } catch (e) {}

      const val = input.value;

      if (action === 'backspace') {
        if (start !== end) {
          input.value = val.substring(0, start) + val.substring(end);
          input.focus();
          try { input.setSelectionRange(start, start); } catch (e) {}
        } else if (start > 0) {
          input.value = val.substring(0, start - 1) + val.substring(start);
          input.focus();
          try { input.setSelectionRange(start - 1, start - 1); } catch (e) {}
        }
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        this.updateIndicator();
      } else if (action === 'left') {
        const newPos = Math.max(0, start - 1);
        input.focus();
        try { input.setSelectionRange(newPos, newPos); } catch (e) {}
      } else if (action === 'right') {
        const newPos = Math.min(val.length, end + 1);
        input.focus();
        try { input.setSelectionRange(newPos, newPos); } catch (e) {}
      } else if (action === 'toggle_sign') {
        this.toggleSign(input);
      } else if (action === 'clear') {
        this.clearActive();
      } else if (action === 'enter') {
        input.focus();
        input.dispatchEvent(new Event('change', { bubbles: true }));
        if (this.physicsMode) {
          const card = input.closest('.cin-card');
          if (card) {
            const goBtn = card.querySelector('.cin-go');
            if (goBtn) goBtn.click();
          }
        }
      }
    }

    clearActive() {
      const input = this.getActiveInput();
      if (!input) return;
      input.value = '';
      input.focus();
      try { input.setSelectionRange(0, 0); } catch (e) {}
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      this.updateIndicator();
    }

    copySymbolFeedback(text) {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text);
        } else {
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
        }
        this.showToast(`Copiado: ${text}`);
      } catch (e) {
        this.showToast(`Símbolo: ${text}`);
      }
    }

    showToast(msg) {
      if (!this.drawerEl) return;
      let toast = this.drawerEl.querySelector('.math-keyboard-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'math-keyboard-toast';
        this.drawerEl.appendChild(toast);
      }
      toast.textContent = msg;
      toast.classList.add('is-visible');
      clearTimeout(this._toastTimeout);
      this._toastTimeout = setTimeout(() => {
        toast.classList.remove('is-visible');
      }, 1800);
    }

    // =========================================================================
    // CONTROL DEL CAJÓN Y RESPONSIVE
    // =========================================================================

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
      if (!this.headerEl || !this.drawerEl) return;
      const headerHeight = this.headerEl.offsetHeight + 1;
      this.drawerEl.style.setProperty('--mk-header-height', `${headerHeight}px`);
      const height = this.isOpen ? (this.isMinimized ? headerHeight : this.drawerEl.offsetHeight) : 0;
      document.body.style.setProperty('--math-keyboard-height', `${height}px`);
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
