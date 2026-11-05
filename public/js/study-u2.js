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
      savedTheme = window.localStorage.getItem(themeStorageKey) === 'dark' ? 'dark' : 'light';
    } catch (error) {
      // The page defaults to light mode if browser storage is unavailable.
    }
    applyTheme(savedTheme);

    themeToggle?.addEventListener('click', () => {
      const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      try {
        window.localStorage.setItem(themeStorageKey, nextTheme);
      } catch (error) {
        // The selected theme still applies for the current visit.
      }
    });
  }

  const lessons = [
    {
      title: 'Integral doble y sumas de Riemann',
      content: `<p class="lesson-lead">El cálculo integral para funciones de varias variables extiende los conceptos fundamentales de la integral definida univariable hacia dimensiones superiores. Mientras que en una variable la integral de Riemann cuantifica el área neta bajo una curva, en dos variables la integral doble permite calcular el volumen encerrado bajo superficies tridimensionales, la masa de láminas con densidad variable, cargas eléctricas y centros de masa en regiones planas acotadas.</p>

        <h2>Integral doble y sumas de Riemann</h2>

        <h3>Construcción geométrica y formal mediante sumas de Riemann</h3>
        <p>De acuerdo con el folleto <em>Semana 06.pdf</em> (págs. 4-5) del profesor David Chávez (UNI), la construcción de la integral doble parte de considerar una función continua <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>) ≥ 0</span> definida sobre una región acotada <span class="math-text"><i>R</i></span> en el plano <span class="math-text"><i>XY</i></span>. Deseamos determinar el volumen <span class="math-text"><i>V</i></span> del sólido cilíndrico recto delimitado inferiormente por <span class="math-text"><i>R</i></span> y superiormente por la superficie <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span>:</p>

        <p>1. <strong>Partición de la región:</strong> Trazamos una malla de planos paralelos a los planos coordenados <span class="math-text"><i>YZ</i></span> y <span class="math-text"><i>XZ</i></span> separados por distancias <span class="math-text">Δ<i>x<sub>i</sub></i></span> y <span class="math-text">Δ<i>y<sub>j</sub></i></span>. Esto subdivide la región <span class="math-text"><i>R</i></span> en <span class="math-text"><i>m</i> × <i>n</i></span> subrectángulos elementales <span class="math-text"><i>R<sub>i,j</sub></i></span>, cada uno con área elemental:<br>
        <span class="math-text">Δ<i>A<sub>i,j</sub></i> = Δ<i>x<sub>i</sub></i> · Δ<i>y<sub>j</sub></i></span>.</p>

        <p>2. <strong>Norma de la partición:</strong> Se define la norma de la partición <span class="math-text">‖<i>P</i>‖</span> como la mayor de las longitudes diagonales de todos los subrectángulos <span class="math-text"><i>R<sub>i,j</sub></i></span>:</p>
        <div class="lesson-definition">
          <p><span class="math-text">‖<i>P</i>‖ = máx { √<span class="math-radical">(Δ<i>x<sub>i</sub></i>)² + (Δ<i>y<sub>j</sub></i>)²</span> }</span></p>
        </div>

        <p>3. <strong>Suma de volúmenes de prismas columnares:</strong> En cada celda rectangular <span class="math-text"><i>R<sub>i,j</sub></i></span> se elige un punto muestra arbitrario <span class="math-text">(<i>x<sub>i</sub></i>*, <i>y<sub>j</sub></i>*)</span>. El volumen de la columna prismática con base <span class="math-text"><i>R<sub>i,j</sub></i></span> y altura <span class="math-text"><i>z</i> = <i>f</i>(<i>x<sub>i</sub></i>*, <i>y<sub>j</sub></i>*)</span> es <span class="math-text"><i>V<sub>i,j</sub></i> = <i>f</i>(<i>x<sub>i</sub></i>*, <i>y<sub>j</sub></i>*) · Δ<i>A<sub>i,j</sub></i></span>.<br>
        La suma total de los volúmenes de estas columnas constituye la <strong>suma doble de Riemann</strong>:<br>
        <span class="math-text"><i>V</i>′ = <span class="math-fraction"><span><i>m</i></span><span>∑</span><span><i>j</i>=1</span></span> <span class="math-fraction"><span><i>n</i></span><span>∑</span><span><i>i</i>=1</span></span> <i>f</i>(<i>x<sub>i</sub></i>*, <i>y<sub>j</sub></i>*) · Δ<i>x<sub>i</sub></i> Δ<i>y<sub>j</sub></i></span>.</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Definición 1: Integral doble (Folleto, pág. 5)</strong></div>
          <p>La integral doble de una función acotada <span class="math-text"><i>f</i></span> sobre la región <span class="math-text"><i>R</i></span> es el número real <span class="math-text"><i>I</i></span> denotado por:<br>
          <span class="math-text"><i>I</i> = ∬<sub><i>R</i></sub> <i>f</i>(<i>x</i>, <i>y</i>) <i>dA</i> = ∬<sub><i>R</i></sub> <i>f</i>(<i>x</i>, <i>y</i>) <i>dx dy</i></span><br>
          siempre que para todo <span class="math-text"><i>ε</i> &gt; 0</span> exista un <span class="math-text"><i>δ</i> &gt; 0</span> tal que:<br>
          <span class="math-text">| <span class="math-fraction"><span><i>m</i></span><span>∑</span><span><i>j</i>=1</span></span> <span class="math-fraction"><span><i>n</i></span><span>∑</span><span><i>i</i>=1</span></span> <i>f</i>(<i>x<sub>i</sub></i>*, <i>y<sub>j</sub></i>*) · Δ<i>A<sub>i,j</sub></i> − <i>I</i> | &lt; <i>ε</i></span><br>
          para toda partición <span class="math-text"><i>P</i></span> de <span class="math-text"><i>R</i></span> con norma <span class="math-text">‖<i>P</i>‖ &lt; <i>δ</i></span> e independiente de la elección de los puntos de muestreo <span class="math-text">(<i>x<sub>i</sub></i>*, <i>y<sub>j</sub></i>*) ∈ <i>R<sub>i,j</sub></i></span>.<br>
          En forma de límite: <span class="math-text">∬<sub><i>R</i></sub> <i>f</i>(<i>x</i>, <i>y</i>) <i>dA</i> = <span class="math-limit"><span>lim</span><sub>‖<i>P</i>‖→0</sub></span> <span class="math-fraction"><span><i>m</i></span><span>∑</span><span><i>j</i>=1</span></span> <span class="math-fraction"><span><i>n</i></span><span>∑</span><span><i>i</i>=1</span></span> <i>f</i>(<i>x<sub>i</sub></i>*, <i>y<sub>j</sub></i>*) · Δ<i>A<sub>i,j</sub></i></span>.<br>
          <em>Teorema de integrabilidad:</em> Si <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>)</span> es continua sobre una región cerrada y acotada <span class="math-text"><i>R</i></span> cuya frontera es suave a trozos, entonces <span class="math-text"><i>f</i></span> es integrable en <span class="math-text"><i>R</i></span>.</p>
        </div>

        <h3>Propiedades cardinales de la integral doble</h3>
        <p>Siguiendo la exposición del profesor Chávez (págs. 3 y 5 de <em>Semana 06.pdf</em>), la integral doble hereda y generaliza todas las propiedades de la integral univariable ordinaria:</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Propiedades fundamentales (Folleto, pág. 5)</strong></div>
          <p><strong>1. Homogeneidad respecto a constantes:</strong><br>
          <span class="math-text">∬<sub><i>R</i></sub> <i>k f</i>(<i>x</i>, <i>y</i>) <i>dA</i> = <i>k</i> ∬<sub><i>R</i></sub> <i>f</i>(<i>x</i>, <i>y</i>) <i>dA</i></span>, para cualquier constante real <span class="math-text"><i>k</i></span>.</p>
          <p><strong>2. Linealidad:</strong><br>
          <span class="math-text">∬<sub><i>R</i></sub> [<i>a f</i>(<i>x</i>, <i>y</i>) + <i>b g</i>(<i>x</i>, <i>y</i>)] <i>dx dy</i> = <i>a</i> ∬<sub><i>R</i></sub> <i>f</i>(<i>x</i>, <i>y</i>) <i>dx dy</i> + <i>b</i> ∬<sub><i>R</i></sub> <i>g</i>(<i>x</i>, <i>y</i>) <i>dx dy</i></span>.</p>
          <p><strong>3. Aditividad respecto al dominio de integración:</strong><br>
          Si la región <span class="math-text"><i>R</i></span> se divide en dos subregiones <span class="math-text"><i>R</i>₁</span> y <span class="math-text"><i>R</i>₂</span> tales que <span class="math-text"><i>R</i> = <i>R</i>₁ ∪ <i>R</i>₂</span> y sus interiores no se traslapan (<span class="math-text"><i>R</i>₁° ∩ <i>R</i>₂° = ∅</span>), entonces:<br>
          <span class="math-text">∬<sub><i>R</i></sub> <i>f</i>(<i>x</i>, <i>y</i>) <i>dA</i> = ∬<sub><i>R</i>₁</sub> <i>f</i>(<i>x</i>, <i>y</i>) <i>dA</i> + ∬<sub><i>R</i>₂</sub> <i>f</i>(<i>x</i>, <i>y</i>) <i>dA</i></span>.<br>
          Esta propiedad es esencial para descomponer geometrías no regulares en piezas fácilmente integrables.</p>
          <p><strong>4. Positividad y orden (Monotonía):</strong><br>
          • Si <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) ≥ 0</span> en toda la región <span class="math-text"><i>R</i></span>, entonces <span class="math-text">∬<sub><i>R</i></sub> <i>f</i>(<i>x</i>, <i>y</i>) <i>dA</i> ≥ 0</span>.<br>
          • Si <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) ≥ <i>g</i>(<i>x</i>, <i>y</i>)</span> en toda la región <span class="math-text"><i>R</i></span>, entonces <span class="math-text">∬<sub><i>R</i></sub> <i>f</i>(<i>x</i>, <i>y</i>) <i>dA</i> ≥ ∬<sub><i>R</i></sub> <i>g</i>(<i>x</i>, <i>y</i>) <i>dA</i></span>.</p>
          <p><strong>5. Desigualdad triangular integral:</strong><br>
          <span class="math-text">| ∬<sub><i>R</i></sub> <i>f</i>(<i>x</i>, <i>y</i>) <i>dA</i> | ≤ ∬<sub><i>R</i></sub> |<i>f</i>(<i>x</i>, <i>y</i>)| <i>dA</i></span>.</p>
          <p><strong>6. Cálculo de área plana:</strong><br>
          Si la función integrando es idénticamente la unidad <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) ≡ 1</span>, la integral doble mide exactamente el <strong>área geométrica</strong> de la región base:<br>
          <span class="math-text">Área(<i>R</i>) = ∬<sub><i>R</i></sub> 1 <i>dA</i> = ∬<sub><i>R</i></sub> <i>dx dy</i></span>.</p>
        </div>

        <h3>Ejemplos resueltos del folleto (paso a paso)</h3>

        <p><strong>Ejemplo 1: Aditividad de dominio y cálculo por simetría (Ejemplo 7 de Semana 06, págs. 11-12)</strong><br>
        Calcular la integral doble:<br>
        <span class="math-text">∬<sub>|<i>x</i>| + |<i>y</i>| ≤ 1</sub> (|<i>x</i>| + |<i>y</i>|) <i>dx dy</i></span>.<br>
        • <em>Solución analítica explicada:</em><br>
        1) <strong>Identificación de la región geométrica:</strong><br>
        La condición <span class="math-text">|<i>x</i>| + |<i>y</i>| ≤ 1</span> define un cuadrado en el plano <span class="math-text"><i>XY</i></span> con vértices en <span class="math-text">(1, 0)</span>, <span class="math-text">(0, 1)</span>, <span class="math-text">(−1, 0)</span> y <span class="math-text">(0, −1)</span>, rotado 45° respecto a los ejes coordenados. Sus lados están dados por las rectas <span class="math-text">±<i>x</i> ± <i>y</i> = 1</span>.<br>
        2) <strong>Descomposición en los cuatro cuadrantes (Aditividad):</strong><br>
        Dividimos la región <span class="math-text"><i>D</i></span> en cuatro subregiones cuadrantales: <span class="math-text"><i>D</i> = <i>D</i>₁ ∪ <i>D</i>₂ ∪ <i>D</i>₃ ∪ <i>D</i>₄</span>.<br>
        Por la propiedad de aditividad del dominio:<br>
        <span class="math-text">∬<sub><i>D</i></sub> (|<i>x</i>| + |<i>y</i>|) <i>dx dy</i> = ∬<sub><i>D</i>₁</sub> (|<i>x</i>| + |<i>y</i>|) <i>dx dy</i> + ∬<sub><i>D</i>₂</sub> (|<i>x</i>| + |<i>y</i>|) <i>dx dy</i> + ∬<sub><i>D</i>₃</sub> (|<i>x</i>| + |<i>y</i>|) <i>dx dy</i> + ∬<sub><i>D</i>₄</sub> (|<i>x</i>| + |<i>y</i>|) <i>dx dy</i></span>.<br>
        3) <strong>Evaluación en el primer cuadrante <span class="math-text"><i>D</i>₁</span>:</strong><br>
        En <span class="math-text"><i>D</i>₁</span> se tiene <span class="math-text"><i>x</i> ≥ 0</span> e <span class="math-text"><i>y</i> ≥ 0</span>, por lo que <span class="math-text">|<i>x</i>| + |<i>y</i>| = <i>x</i> + <i>y</i></span>, acotado por <span class="math-text"><i>x</i> + <i>y</i> ≤ 1 ⇒ 0 ≤ <i>y</i> ≤ 1 − <i>x</i></span> para <span class="math-text">0 ≤ <i>x</i> ≤ 1</span>:<br>
        <span class="math-text">∬<sub><i>D</i>₁</sub> (<i>x</i> + <i>y</i>) <i>dx dy</i> = ∫₀¹ [ ∫₀<sup>1−<i>x</i></sup> (<i>x</i> + <i>y</i>) <i>dy</i> ] <i>dx</i></span>.<br>
        Integrando respecto a <span class="math-text"><i>y</i></span>:<br>
        <span class="math-text">∫₀<sup>1−<i>x</i></sup> (<i>x</i> + <i>y</i>) <i>dy</i> = [ <i>xy</i> + <span class="math-fraction"><span><i>y</i>²</span><span>2</span></span> ]₀<sup>1−<i>x</i></sup> = <i>x</i>(1 − <i>x</i>) + <span class="math-fraction"><span>(1 − <i>x</i>)²</span><span>2</span></span> = <i>x</i> − <i>x</i>² + <span class="math-fraction"><span>1 − 2<i>x</i> + <i>x</i>²</span><span>2</span></span> = <span class="math-fraction"><span>1 − <i>x</i>²</span><span>2</span></span></span>.<br>
        Integrando respecto a <span class="math-text"><i>x</i></span>:<br>
        <span class="math-text">∫₀¹ <span class="math-fraction"><span>1 − <i>x</i>²</span><span>2</span></span> <i>dx</i> = <span class="math-fraction"><span>1</span><span>2</span></span> [ <i>x</i> − <span class="math-fraction"><span><i>x</i>³</span><span>3</span></span> ]₀¹ = <span class="math-fraction"><span>1</span><span>2</span></span> (1 − <span class="math-fraction"><span>1</span><span>3</span></span>) = <span class="math-fraction"><span>1</span><span>2</span></span> · <span class="math-fraction"><span>2</span><span>3</span></span> = <span class="math-fraction"><span>1</span><span>3</span></span></span>.<br>
        4) <strong>Simetría en los cuadrantes restantes:</strong><br>
        Tanto la función integrando como la región son rigurosamente pares respecto a ambos ejes. Al evaluar en <span class="math-text"><i>D</i>₂</span> (<span class="math-text">−<i>x</i> + <i>y</i></span>), <span class="math-text"><i>D</i>₃</span> (<span class="math-text">−<i>x</i> − <i>y</i></span>) y <span class="math-text"><i>D</i>₄</span> (<span class="math-text"><i>x</i> − <i>y</i></span>) se obtiene el mismo valor <span class="math-text"><span class="math-fraction"><span>1</span><span>3</span></span></span> en cada uno.<br>
        5) <strong>Resultado total:</strong><br>
        <span class="math-text">∬<sub><i>D</i></sub> (|<i>x</i>| + |<i>y</i>|) <i>dx dy</i> = <span class="math-fraction"><span>1</span><span>3</span></span> + <span class="math-fraction"><span>1</span><span>3</span></span> + <span class="math-fraction"><span>1</span><span>3</span></span> + <span class="math-fraction"><span>1</span><span>3</span></span> = <span class="math-fraction"><span>4</span><span>3</span></span></span>.</p>

        <h3>Ejercicios de práctica propuestos del folleto (con soluciones detalladas)</h3>

        <p><strong>Ejercicio 1: Integral doble sobre región acotada por parábolas (Propuesto 35 de Semana 06, pág. 17)</strong><br>
        Evaluar la integral doble:<br>
        <span class="math-text">∬<sub><i>R</i></sub> (<i>x</i>² + 2<i>y</i>) <i>dA</i></span>, donde <span class="math-text"><i>R</i></span> es la región limitada por las parábolas <span class="math-text"><i>y</i> = <i>x</i>²</span> y <span class="math-text"><i>x</i> = <i>y</i>²</span>.<br>
        • <em>Solución paso a paso:</em><br>
        1) <strong>Puntos de corte entre las curvas:</strong><br>
        Sustituyendo <span class="math-text"><i>y</i> = <i>x</i>²</span> en <span class="math-text"><i>x</i> = <i>y</i>²</span>:<br>
        <span class="math-text"><i>x</i> = (<i>x</i>²)² = <i>x</i>⁴ ⇒ <i>x</i>⁴ − <i>x</i> = 0 ⇒ <i>x</i>(<i>x</i>³ − 1) = 0 ⇒ <i>x</i> = 0 &nbsp;o&nbsp; <i>x</i> = 1</span>.<br>
        Puntos de intersección: <span class="math-text">(0, 0)</span> y <span class="math-text">(1, 1)</span>.<br>
        2) <strong>Descripción como región verticalmente simple (Tipo I):</strong><br>
        En el intervalo <span class="math-text">0 ≤ <i>x</i> ≤ 1</span>, la curva superior es <span class="math-text"><i>y</i> = √<span class="math-radical"><i>x</i></span></span> y la inferior es <span class="math-text"><i>y</i> = <i>x</i>²</span>:<br>
        <span class="math-text"><i>R</i> = { (<i>x</i>, <i>y</i>) ∈ ℝ² | 0 ≤ <i>x</i> ≤ 1, &nbsp; <i>x</i>² ≤ <i>y</i> ≤ √<span class="math-radical"><i>x</i></span> }</span>.<br>
        3) <strong>Planteamiento y evaluación de la integral iterada:</strong><br>
        <span class="math-text">∬<sub><i>R</i></sub> (<i>x</i>² + 2<i>y</i>) <i>dA</i> = ∫₀¹ [ ∫<sub><i>x</i>²</sub><sup>√<span class="math-radical"><i>x</i></span></sup> (<i>x</i>² + 2<i>y</i>) <i>dy</i> ] <i>dx</i></span>.<br>
        Integral interior respecto a <span class="math-text"><i>y</i></span>:<br>
        <span class="math-text">[ <i>x</i>²<i>y</i> + <i>y</i>² ]<sub><i>x</i>²</sub><sup>√<span class="math-radical"><i>x</i></span></sup> = [ <i>x</i>²√<span class="math-radical"><i>x</i></span> + (√<span class="math-radical"><i>x</i></span>)² ] − [ <i>x</i>²(<i>x</i>²) + (<i>x</i>²)² ] = <i>x</i><sup>5/2</sup> + <i>x</i> − <i>x</i>⁴ − <i>x</i>⁴ = <i>x</i><sup>5/2</sup> + <i>x</i> − 2<i>x</i>⁴</span>.<br>
        Integral exterior respecto a <span class="math-text"><i>x</i></span>:<br>
        <span class="math-text">∫₀¹ (<i>x</i><sup>5/2</sup> + <i>x</i> − 2<i>x</i>⁴) <i>dx</i> = [ <span class="math-fraction"><span>2</span><span>7</span></span> <i>x</i><sup>7/2</sup> + <span class="math-fraction"><span><i>x</i>²</span><span>2</span></span> − <span class="math-fraction"><span>2<i>x</i>⁵</span><span>5</span></span> ]₀¹</span>.<br>
        Evaluando en los límites <span class="math-text">0</span> y <span class="math-text">1</span>:<br>
        <span class="math-text"><span class="math-fraction"><span>2</span><span>7</span></span> + <span class="math-fraction"><span>1</span><span>2</span></span> − <span class="math-fraction"><span>2</span><span>5</span></span> = <span class="math-fraction"><span>20 + 35 − 28</span><span>70</span></span> = <span class="math-fraction"><span>27</span><span>70</span></span></span>.<br>
        El valor exacto de la integral es <span class="math-text"><span class="math-fraction"><span>27</span><span>70</span></span></span>.</p>`
    },
    {
      title: 'Teorema de Fubini',
      content: `<p class="lesson-lead">El Teorema de Fubini establece el puente fundamental entre el cálculo multivariable y el cálculo univariable. Permite transformar una integral doble sobre una región rectangular en integrales simples sucesivas o iteradas. Gracias a este resultado, el cálculo de volúmenes y magnitudes físicas se reduce a evaluar antiderivadas familiares paso a paso, garantizando que el orden en que se integre respecto a cada coordenada sea indistinto para toda función continua.</p>

        <h2>El Teorema de Fubini y las integrales iteradas</h2>

        <h3>Enunciado formal del Teorema de Fubini en rectángulos</h3>
        <p>De acuerdo con el folleto <em>Semana 06.pdf</em> (pág. 8) del profesor David Chávez, el Teorema de Fubini formaliza las condiciones bajo las cuales es posible evaluar la integral doble mediante integrales univariables reiteradas:</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Teorema 2: Teorema de Fubini (Folleto, pág. 8)</strong></div>
          <p>Sea <span class="math-text"><i>f</i>: <i>D</i> ⊂ ℝ² → ℝ</span> una función continua sobre el rectángulo cerrado <span class="math-text"><i>R</i> = [<i>a</i>, <i>b</i>] × [<i>c</i>, <i>d</i>] = { (<i>x</i>, <i>y</i>) ∈ ℝ² | <i>a</i> ≤ <i>x</i> ≤ <i>b</i> ∧ <i>c</i> ≤ <i>y</i> ≤ <i>d</i> }</span>.<br>
          Entonces la integral doble existe y es idéntica al resultado de integrar sucesivamente en cualquiera de los dos órdenes posibles:<br>
          <span class="math-text">∬<sub><i>R</i></sub> <i>f</i>(<i>x</i>, <i>y</i>) <i>dx dy</i> = ∫<sub><i>a</i></sub><sup><i>b</i></sup> [ ∫<sub><i>c</i></sub><sup><i>d</i></sup> <i>f</i>(<i>x</i>, <i>y</i>) <i>dy</i> ] <i>dx</i> = ∫<sub><i>c</i></sub><sup><i>d</i></sup> [ ∫<sub><i>a</i></sub><sup><i>b</i></sup> <i>f</i>(<i>x</i>, <i>y</i>) <i>dx</i> ] <i>dy</i></span></p>
        </div>

        <p>• <strong>Interpretación geométrica (Principio de Cavalieri de rebanadas planas):</strong><br>
        1. Si se integra primero respecto a <span class="math-text"><i>y</i></span> manteniendo <span class="math-text"><i>x</i></span> fijo, la integral interna <span class="math-text"><i>A</i>(<i>x</i>) = ∫<sub><i>c</i></sub><sup><i>d</i></sup> <i>f</i>(<i>x</i>, <i>y</i>) <i>dy</i></span> representa el <strong>área transversal de la sección plana</strong> del sólido obtenida al cortar la superficie <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span> con un plano vertical perpendicular al eje <span class="math-text"><i>X</i></span>. Integrar luego <span class="math-text"><i>A</i>(<i>x</i>)</span> desde <span class="math-text"><i>x</i> = <i>a</i></span> hasta <span class="math-text"><i>x</i> = <i>b</i></span> suma todas las rebanadas para obtener el volumen total.<br>
        2. Inversamente, fijar <span class="math-text"><i>y</i></span> e integrar primero respecto a <span class="math-text"><i>x</i></span> genera el área transversal <span class="math-text"><i>A</i>(<i>y</i>) = ∫<sub><i>a</i></sub><sup><i>b</i></sup> <i>f</i>(<i>x</i>, <i>y</i>) <i>dx</i></span> de los cortes perpendiculares al eje <span class="math-text"><i>Y</i></span>, cuya acumulación posterior a lo largo de <span class="math-text"><i>y</i> ∈ [<i>c</i>, <i>d</i>]</span> reproduce con exactitud el mismo volumen.</p>

        <h3>Regla de factorización para integrandos de variables separables</h3>
        <p>Un caso de suma utilidad y alta frecuencia ocurre cuando el integrando puede expresarse como el producto de dos funciones independientes, una exclusiva de <span class="math-text"><i>x</i></span> y otra exclusiva de <span class="math-text"><i>y</i></span>: <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = <i>g</i>(<i>x</i>) · <i>h</i>(<i>y</i>)</span>:</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Regla del producto de integrales desacopladas</strong></div>
          <p>Si la región es un rectángulo <span class="math-text"><i>R</i> = [<i>a</i>, <i>b</i>] × [<i>c</i>, <i>d</i>]</span> y el integrando se factoriza como <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = <i>g</i>(<i>x</i>) <i>h</i>(<i>y</i>)</span>, la integral doble se desacopla en el producto algebraico de dos integrales definidas ordinarias:<br>
          <span class="math-text">∬<sub><i>R</i></sub> <i>g</i>(<i>x</i>) <i>h</i>(<i>y</i>) <i>dA</i> = [ ∫<sub><i>a</i></sub><sup><i>b</i></sup> <i>g</i>(<i>x</i>) <i>dx</i> ] · [ ∫<sub><i>c</i></sub><sup><i>d</i></sup> <i>h</i>(<i>y</i>) <i>dy</i> ]</span></p>
        </div>

        <h3>Ejemplos resueltos del folleto (paso a paso)</h3>

        <p><strong>Ejemplo 1: Aplicación directa de Fubini con función separable (Ejemplo 1 de Semana 06, pág. 8)</strong><br>
        Calcular la integral doble:<br>
        <span class="math-text">∬<sub><i>D</i></sub> <span class="math-fraction"><span><i>x</i>²</span><span>1 + <i>y</i>²</span></span> <i>dx dy</i></span>, donde <span class="math-text"><i>D</i>: 0 ≤ <i>x</i> ≤ 1, &nbsp; 0 ≤ <i>y</i> ≤ 1</span>.<br>
        • <em>Solución explicada:</em><br>
        1) Comprobamos la continuidad: la función racional es continua en todo el cuadrado <span class="math-text"><i>D</i> = [0, 1] × [0, 1]</span> dado que el denominador <span class="math-text">1 + <i>y</i>² ≥ 1 &gt; 0</span> nunca se anula.<br>
        2) Desacoplamos la función en producto de dos factores univariables:<br>
        <span class="math-text"><span class="math-fraction"><span><i>x</i>²</span><span>1 + <i>y</i>²</span></span> = <i>x</i>² · <span class="math-fraction"><span>1</span><span>1 + <i>y</i>²</span></span></span>.<br>
        3) Aplicamos Fubini mediante la regla del producto:<br>
        <span class="math-text">∬<sub><i>D</i></sub> <span class="math-fraction"><span><i>x</i>²</span><span>1 + <i>y</i>²</span></span> <i>dx dy</i> = [ ∫₀¹ <i>x</i>² <i>dx</i> ] · [ ∫₀¹ <span class="math-fraction"><span>1</span><span>1 + <i>y</i>²</span></span> <i>dy</i> ]</span>.<br>
        Evaluando ambas integrales inmediatas:<br>
        <span class="math-text">∫₀¹ <i>x</i>² <i>dx</i> = [ <span class="math-fraction"><span><i>x</i>³</span><span>3</span></span> ]₀¹ = <span class="math-fraction"><span>1</span><span>3</span></span></span>.<br>
        <span class="math-text">∫₀¹ <span class="math-fraction"><span>1</span><span>1 + <i>y</i>²</span></span> <i>dy</i> = [ arctan <i>y</i> ]₀¹ = arctan(1) − arctan(0) = <span class="math-fraction"><span><i>π</i></span><span>4</span></span> − 0 = <span class="math-fraction"><span><i>π</i></span><span>4</span></span></span>.<br>
        Multiplicando ambos valores numéricos:<br>
        <span class="math-text">∬<sub><i>D</i></sub> <span class="math-fraction"><span><i>x</i>²</span><span>1 + <i>y</i>²</span></span> <i>dx dy</i> = <span class="math-fraction"><span>1</span><span>3</span></span> · <span class="math-fraction"><span><i>π</i></span><span>4</span></span> = <span class="math-fraction"><span><i>π</i></span><span>12</span></span></span>.</p>

        <p><strong>Ejemplo 2: Integral iterada con sustitución e integración por partes (Ejemplo 2 de Semana 06, pág. 9)</strong><br>
        Calcular la integral iterada:<br>
        <span class="math-text"><i>I</i> = ∬<sub><i>R</i></sub> <i>x</i>² <i>y</i> cos(<i>x y</i>²) <i>dx dy</i></span>, donde <span class="math-text"><i>R</i>: 0 ≤ <i>x</i> ≤ <span class="math-fraction"><span><i>π</i></span><span>2</span></span>, &nbsp; 0 ≤ <i>y</i> ≤ 2</span>.<br>
        • <em>Solución analítica paso a paso:</em><br>
        Al no poder separarse algebraicamente en un producto simple desacoplado, planteamos la integración iterada resolviendo primero respecto a la variable interna <span class="math-text"><i>y</i></span>:<br>
        <span class="math-text"><i>I</i> = ∫₀<sup><i>π</i>/2</sup> [ ∫₀² <i>x</i>² <i>y</i> cos(<i>x y</i>²) <i>dy</i> ] <i>dx</i> = ∫₀<sup><i>π</i>/2</sup> <i>x</i> [ ∫₀² <i>xy</i> cos(<i>x y</i>²) <i>dy</i> ] <i>dx</i></span>.<br>
        1) <strong>Integral interna respecto a <i>y</i> (Sustitución):</strong><br>
        Hacemos el cambio de variable: <span class="math-text"><i>u</i> = <i>x y</i>² ⇒ <i>du</i> = 2<i>xy dy</i> ⇒ <i>xy dy</i> = <span class="math-fraction"><span><i>du</i></span><span>2</span></span></span>.<br>
        Límites de la variable auxiliar:<br>
        - Cuando <span class="math-text"><i>y</i> = 0 ⇒ <i>u</i> = <i>x</i>(0)² = 0</span>.<br>
        - Cuando <span class="math-text"><i>y</i> = 2 ⇒ <i>u</i> = <i>x</i>(2)² = 4<i>x</i></span>.<br>
        La integral interna resulta:<br>
        <span class="math-text">∫₀² <i>xy</i> cos(<i>x y</i>²) <i>dy</i> = <span class="math-fraction"><span>1</span><span>2</span></span> ∫₀<sup>4<i>x</i></sup> cos <i>u</i> <i>du</i> = <span class="math-fraction"><span>1</span><span>2</span></span> [ sen <i>u</i> ]₀<sup>4<i>x</i></sup> = <span class="math-fraction"><span>1</span><span>2</span></span> sen(4<i>x</i>)</span>.<br>
        2) <strong>Integral externa respecto a <i>x</i> (Integración por partes):</strong><br>
        Sustituyendo el resultado interno:<br>
        <span class="math-text"><i>I</i> = ∫₀<sup><i>π</i>/2</sup> <i>x</i> · [ <span class="math-fraction"><span>1</span><span>2</span></span> sen(4<i>x</i>) ] <i>dx</i> = <span class="math-fraction"><span>1</span><span>2</span></span> ∫₀<sup><i>π</i>/2</sup> <i>x</i> sen(4<i>x</i>) <i>dx</i></span>.<br>
        Aplicamos integración por partes con:<br>
        <span class="math-text"><i>u</i> = <i>x</i> ⇒ <i>du</i> = <i>dx</i></span>.<br>
        <span class="math-text"><i>dv</i> = sen(4<i>x</i>) <i>dx</i> ⇒ <i>v</i> = −<span class="math-fraction"><span>1</span><span>4</span></span> cos(4<i>x</i>)</span>.<br>
        Desarrollando la fórmula <span class="math-text">∫ <i>u dv</i> = <i>uv</i> − ∫ <i>v du</i></span>:<br>
        <span class="math-text">∫ <i>x</i> sen(4<i>x</i>) <i>dx</i> = −<span class="math-fraction"><span><i>x</i></span><span>4</span></span> cos(4<i>x</i>) − ∫ [ −<span class="math-fraction"><span>1</span><span>4</span></span> cos(4<i>x</i>) ] <i>dx</i> = −<span class="math-fraction"><span><i>x</i></span><span>4</span></span> cos(4<i>x</i>) + <span class="math-fraction"><span>1</span><span>16</span></span> sen(4<i>x</i>)</span>.<br>
        Evaluando entre <span class="math-text">0</span> y <span class="math-text"><span class="math-fraction"><span><i>π</i></span><span>2</span></span></span>:<br>
        <span class="math-text"><i>I</i> = <span class="math-fraction"><span>1</span><span>2</span></span> [ −<span class="math-fraction"><span><i>x</i></span><span>4</span></span> cos(4<i>x</i>) + <span class="math-fraction"><span>1</span><span>16</span></span> sen(4<i>x</i>) ]₀<sup><i>π</i>/2</sup></span>.<br>
        - En el límite superior <span class="math-text"><i>x</i> = <span class="math-fraction"><span><i>π</i></span><span>2</span></span></span>:<br>
        <span class="math-text">−<span class="math-fraction"><span>(<i>π</i>/2)</span><span>4</span></span> cos(2<i>π</i>) + <span class="math-fraction"><span>1</span><span>16</span></span> sen(2<i>π</i>) = −<span class="math-fraction"><span><i>π</i></span><span>8</span></span>(1) + 0 = −<span class="math-fraction"><span><i>π</i></span><span>8</span></span></span>.<br>
        - En el límite inferior <span class="math-text"><i>x</i> = 0</span>:<br>
        <span class="math-text">−0 + <span class="math-fraction"><span>1</span><span>16</span></span> sen(0) = 0</span>.<br>
        Multiplicando por el factor exterior <span class="math-text"><span class="math-fraction"><span>1</span><span>2</span></span></span>:<br>
        <span class="math-text"><i>I</i> = <span class="math-fraction"><span>1</span><span>2</span></span> ( −<span class="math-fraction"><span><i>π</i></span><span>8</span></span> − 0 ) = −<span class="math-fraction"><span><i>π</i></span><span>16</span></span></span>.<br>
        Por consiguiente, el valor final de la integral iterada es <span class="math-text">−<span class="math-fraction"><span><i>π</i></span><span>16</span></span></span>.</p>

        <h3>Ejercicios de práctica propuestos del folleto (con soluciones detalladas)</h3>

        <p><strong>Ejercicio 1: Integral iterada en rectángulo (Propuesto 15 de Semana 06, pág. 17)</strong><br>
        Calcular la integral iterada en el orden inverso respecto al Ejemplo 1:<br>
        <span class="math-text">∫₀¹ [ ∫₀¹ <span class="math-fraction"><span><i>x</i>²</span><span>1 + <i>y</i>²</span></span> <i>dy</i> ] <i>dx</i></span>.<br>
        • <em>Solución explicada:</em><br>
        Por el Teorema de Fubini, como el integrando es continuo y el dominio es rectangular, invertir el orden debe producir idéntico resultado.<br>
        Evaluamos la integral interior respecto a <span class="math-text"><i>y</i></span>:<br>
        <span class="math-text">∫₀¹ <span class="math-fraction"><span><i>x</i>²</span><span>1 + <i>y</i>²</span></span> <i>dy</i> = <i>x</i>² [ arctan <i>y</i> ]₀¹ = <i>x</i>² (<span class="math-fraction"><span><i>π</i></span><span>4</span></span> − 0) = <span class="math-fraction"><span><i>π</i></span><span>4</span></span> <i>x</i>²</span>.<br>
        Evaluamos la integral exterior respecto a <span class="math-text"><i>x</i></span>:<br>
        <span class="math-text">∫₀¹ <span class="math-fraction"><span><i>π</i></span><span>4</span></span> <i>x</i>² <i>dx</i> = <span class="math-fraction"><span><i>π</i></span><span>4</span></span> [ <span class="math-fraction"><span><i>x</i>³</span><span>3</span></span> ]₀¹ = <span class="math-fraction"><span><i>π</i></span><span>4</span></span> · <span class="math-fraction"><span>1</span><span>3</span></span> = <span class="math-fraction"><span><i>π</i></span><span>12</span></span></span>.<br>
        Queda comprobado el cumplimiento del Teorema de Fubini.</p>

        <p><strong>Ejercicio 2: Integral doble con exponenciales separables</strong><br>
        Evaluar la integral doble:<br>
        <span class="math-text">∬<sub><i>R</i></sub> <i>xy e</i><sup><i>x</i>² + <i>y</i>²</sup> <i>dx dy</i></span>, donde <span class="math-text"><i>R</i> = [0, 1] × [0, 1]</span>.<br>
        • <em>Solución explicada:</em><br>
        1) Aplicando propiedades de exponentes: <span class="math-text"><i>e</i><sup><i>x</i>² + <i>y</i>²</sup> = <i>e</i><sup><i>x</i>²</sup> · <i>e</i><sup><i>y</i>²</sup></span>.<br>
        El integrando se desacopla como <span class="math-text">(<i>x e</i><sup><i>x</i>²</sup>)(<i>y e</i><sup><i>y</i>²</sup>)</span>.<br>
        2) Por la regla del producto de Fubini:<br>
        <span class="math-text">∬<sub><i>R</i></sub> <i>xy e</i><sup><i>x</i>² + <i>y</i>²</sup> <i>dx dy</i> = [ ∫₀¹ <i>x e</i><sup><i>x</i>²</sup> <i>dx</i> ] · [ ∫₀¹ <i>y e</i><sup><i>y</i>²</sup> <i>dy</i> ]</span>.<br>
        Ambas integrales univariables son idénticas por simetría de variables:<br>
        <span class="math-text">∫₀¹ <i>x e</i><sup><i>x</i>²</sup> <i>dx</i> = [ <span class="math-fraction"><span>1</span><span>2</span></span> <i>e</i><sup><i>x</i>²</sup> ]₀¹ = <span class="math-fraction"><span><i>e</i> − 1</span><span>2</span></span></span>.<br>
        3) Multiplicando ambos factores:<br>
        <span class="math-text">[ <span class="math-fraction"><span><i>e</i> − 1</span><span>2</span></span> ]² = <span class="math-fraction"><span>(<i>e</i> − 1)²</span><span>4</span></span></span>.<br>
        El resultado exacto es <span class="math-text"><span class="math-fraction"><span>(<i>e</i> − 1)²</span><span>4</span></span></span>.</p>`
    },
    {
      title: 'Regiones Tipo I y Tipo II',
      content: `<p class="lesson-lead">En las aplicaciones reales del cálculo multivariable, las regiones de integración rara vez son simples rectángulos alineados con los ejes coordenados. Con frecuencia están delimitadas por curvas funcionales continuas, como parábolas, hipérbolas o rectas oblicuas. Para evaluar integrales dobles sobre tales dominios, se introduce la clasificación geométrica en regiones Tipo I (verticalmente simples) y Tipo II (horizontalmente simples), proporcionando un marco algebraico seguro para establecer los límites de integración iterada.</p>

        <h2>Integración sobre regiones generales del plano</h2>

        <h3>Definición de regiones Tipo I y Tipo II</h3>
        <p>De acuerdo con la <strong>Definición 2 (pág. 6)</strong> del folleto <em>Semana 06.pdf</em> del profesor David Chávez (UNI), una región plana acotada <span class="math-text"><i>R</i></span> se clasifica según la dirección en que sus curvas frontera puedan describirse de forma unívoca:</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Definición: Región Tipo I (Verticalmente simple)</strong></div>
          <p>Una región <span class="math-text"><i>R</i> ⊂ ℝ²</span> se denomina <strong>verticalmente simple (Tipo I)</strong> si está comprendida entre dos rectas verticales constantes <span class="math-text"><i>x</i> = <i>a</i></span> y <span class="math-text"><i>x</i> = <i>b</i></span>, y acotada inferior y superiormente por dos funciones continuas de <span class="math-text"><i>x</i></span>:<br>
          <span class="math-text"><i>R</i> = { (<i>x</i>, <i>y</i>) ∈ ℝ² | <i>a</i> ≤ <i>x</i> ≤ <i>b</i>, &nbsp; <i>g</i>₁(<i>x</i>) ≤ <i>y</i> ≤ <i>g</i>₂(<i>x</i>) }</span></p>
          <p>• <strong>Fórmula de evaluación iterada (Teorema 1.i, pág. 6):</strong><br>
          <span class="math-text">∬<sub><i>R</i></sub> <i>f</i>(<i>x</i>, <i>y</i>) <i>dA</i> = ∫<sub><i>a</i></sub><sup><i>b</i></sup> [ ∫<sub><i>g</i>₁(<i>x</i>)</sub><sup><i>g</i>₂(<i>x</i>)</sup> <i>f</i>(<i>x</i>, <i>y</i>) <i>dy</i> ] <i>dx</i></span><br>
          <em>Procedimiento:</em> Se integra primero respecto a <span class="math-text"><i>y</i></span> tratando a <span class="math-text"><i>x</i></span> como una constante, evaluando entre la curva inferior <span class="math-text"><i>y</i> = <i>g</i>₁(<i>x</i>)</span> y la curva superior <span class="math-text"><i>y</i> = <i>g</i>₂(<i>x</i>)</span>. La expresión resultante es una función univariable de <span class="math-text"><i>x</i></span>, que finalmente se integra entre las constantes <span class="math-text"><i>a</i></span> y <span class="math-text"><i>b</i></span>.</p>
        </div>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Definición: Región Tipo II (Horizontalmente simple)</strong></div>
          <p>Una región <span class="math-text"><i>R</i> ⊂ ℝ²</span> se denomina <strong>horizontalmente simple (Tipo II)</strong> si está comprendida entre dos rectas horizontales constantes <span class="math-text"><i>y</i> = <i>c</i></span> y <span class="math-text"><i>y</i> = <i>d</i></span>, y acotada a izquierda y derecha por dos funciones continuas de <span class="math-text"><i>y</i></span>:<br>
          <span class="math-text"><i>R</i> = { (<i>x</i>, <i>y</i>) ∈ ℝ² | <i>c</i> ≤ <i>y</i> ≤ <i>d</i>, &nbsp; <i>h</i>₁(<i>y</i>) ≤ <i>x</i> ≤ <i>h</i>₂(<i>y</i>) }</span></p>
          <p>• <strong>Fórmula de evaluación iterada (Teorema 1.ii, pág. 6):</strong><br>
          <span class="math-text">∬<sub><i>R</i></sub> <i>f</i>(<i>x</i>, <i>y</i>) <i>dA</i> = ∫<sub><i>c</i></sub><sup><i>d</i></sup> [ ∫<sub><i>h</i>₁(<i>y</i>)</sub><sup><i>h</i>₂(<i>y</i>)</sup> <i>f</i>(<i>x</i>, <i>y</i>) <i>dx</i> ] <i>dy</i></span><br>
          <em>Procedimiento:</em> Se integra primero respecto a <span class="math-text"><i>x</i></span> tratando a <span class="math-text"><i>y</i></span> como constante, evaluando entre la curva izquierda <span class="math-text"><i>x</i> = <i>h</i>₁(<i>y</i>)</span> y la curva derecha <span class="math-text"><i>x</i> = <i>h</i>₂(<i>y</i>)</span>, e integrando luego el resultado respecto a <span class="math-text"><i>y</i></span> entre <span class="math-text"><i>c</i></span> y <span class="math-text"><i>d</i></span>.</p>
        </div>

        <h3>Procedimiento metódico para la determinación de límites</h3>
        <p>El profesor Chávez resalta la siguiente regla mnemotécnica para la correcta colocación de los límites (Folleto, pág. 7):</p>
        <p>1. <strong>Límites externos:</strong> Siempre son <strong>números constantes</strong>. Corresponden a los valores extremos de la proyección geométrica de la región <span class="math-text"><i>R</i></span> sobre el eje asociado a la variable de integración exterior (<span class="math-text">[<i>a</i>, <i>b</i>]</span> para el eje <span class="math-text"><i>X</i></span> o <span class="math-text">[<i>c</i>, <i>d</i>]</span> para el eje <span class="math-text"><i>Y</i></span>).<br>
        2. <strong>Límites internos:</strong> Son las <strong>ecuaciones de las curvas frontera</strong> que limitan la región: van de abajo hacia arriba (<span class="math-text"><i>y</i> = <i>g</i>₁(<i>x</i>)</span> a <span class="math-text"><i>y</i> = <i>g</i>₂(<i>x</i>)</span>) para Tipo I, o de izquierda a derecha (<span class="math-text"><i>x</i> = <i>h</i>₁(<i>y</i>)</span> a <span class="math-text"><i>x</i> = <i>h</i>₂(<i>y</i>)</span>) para Tipo II.<br>
        3. <strong>Regiones compuestas (no simples):</strong> Si una recta vertical u horizontal cruza la frontera de la región en más de dos puntos, o si la curva de entrada o de salida cambia de fórmula algebraica a lo largo del intervalo, la región <strong>no es simple</strong>. En tal situación es obligatorio subdividir <span class="math-text"><i>R</i></span> en subregiones simples contiguas (<span class="math-text"><i>R</i> = <i>R</i>₁ ∪ <i>R</i>₂</span>) y aplicar la propiedad de aditividad.</p>

        <h3>Ejemplos resueltos del folleto (paso a paso)</h3>

        <p><strong>Ejemplo 1: Región verticalmente simple entre parábola y recta (Ejemplo 3 de Semana 06, pág. 9)</strong><br>
        Calcular la integral doble <span class="math-text">∬<sub><i>D</i></sub> 2<i>x</i> <i>dx dy</i></span>, donde <span class="math-text"><i>D</i></span> es la región acotada por la parábola <span class="math-text">4<i>y</i> = <i>x</i>²</span> y la recta <span class="math-text"><i>x</i> − 2<i>y</i> + 4 = 0</span>.<br>
        • <em>Solución paso a paso:</em><br>
        1) <strong>Cálculo de los puntos de intersección:</strong><br>
        Despejando <span class="math-text"><i>y</i></span> en ambas ecuaciones:<br>
        <span class="math-text"><i>y</i> = <span class="math-fraction"><span>1</span><span>4</span></span> <i>x</i>² &nbsp;&nbsp;y&nbsp;&nbsp; <i>y</i> = <span class="math-fraction"><span>1</span><span>2</span></span> <i>x</i> + 2</span>.<br>
        Igualando ambas expresiones:<br>
        <span class="math-text"><span class="math-fraction"><span>1</span><span>4</span></span> <i>x</i>² = <span class="math-fraction"><span>1</span><span>2</span></span> <i>x</i> + 2 ⇒ <span class="math-fraction"><span>1</span><span>4</span></span> <i>x</i>² − <span class="math-fraction"><span>1</span><span>2</span></span> <i>x</i> − 2 = 0 ⇒ <i>x</i>² − 2<i>x</i> − 8 = 0 ⇒ (<i>x</i> − 4)(<i>x</i> + 2) = 0</span>.<br>
        Se obtienen las abscisas de corte: <span class="math-text"><i>x</i> = −2</span> y <span class="math-text"><i>x</i> = 4</span>.<br>
        Los puntos de corte son <span class="math-text">(−2, 1)</span> y <span class="math-text">(4, 4)</span>.<br>
        2) <strong>Identificación de curvas y orden de integración:</strong><br>
        En el intervalo <span class="math-text">[−2, 4]</span>, la recta está por encima de la parábola (<span class="math-text"><span class="math-fraction"><span><i>x</i> + 4</span><span>2</span></span> ≥ <span class="math-fraction"><span><i>x</i>²</span><span>4</span></span></span>). La región es verticalmente simple (Tipo I):<br>
        <span class="math-text">−2 ≤ <i>x</i> ≤ 4, &nbsp;&nbsp; <span class="math-fraction"><span><i>x</i>²</span><span>4</span></span> ≤ <i>y</i> ≤ <span class="math-fraction"><span><i>x</i> + 4</span><span>2</span></span></span>.<br>
        3) <strong>Evaluación de la integral iterada:</strong><br>
        <span class="math-text">∬<sub><i>D</i></sub> 2<i>x</i> <i>dx dy</i> = ∫<sub>−2</sub>⁴ [ ∫<sub>0.25<i>x</i>²</sub><sup>0.5<i>x</i> + 2</sup> 2<i>x</i> <i>dy</i> ] <i>dx</i> = ∫<sub>−2</sub>⁴ 2<i>x</i> [ <i>y</i> ]<sub>0.25<i>x</i>²</sub><sup>0.5<i>x</i> + 2</sup> <i>dx</i></span>.<br>
        <span class="math-text">= ∫<sub>−2</sub>⁴ 2<i>x</i> (0.5<i>x</i> + 2 − 0.25<i>x</i>²) <i>dx</i> = ∫<sub>−2</sub>⁴ (<i>x</i>² + 4<i>x</i> − 0.5<i>x</i>³) <i>dx</i></span>.<br>
        Integrando respecto a <span class="math-text"><i>x</i></span>:<br>
        <span class="math-text">= [ <span class="math-fraction"><span><i>x</i>³</span><span>3</span></span> + 2<i>x</i>² − <span class="math-fraction"><span>0.5<i>x</i>⁴</span><span>4</span></span> ]<sub>−2</sub>⁴ = [ <span class="math-fraction"><span><i>x</i>³</span><span>3</span></span> + 2<i>x</i>² − 0.125<i>x</i>⁴ ]<sub>−2</sub>⁴</span>.<br>
        - Evaluando en <span class="math-text"><i>x</i> = 4</span>:<br>
        <span class="math-text"><span class="math-fraction"><span>64</span><span>3</span></span> + 2(16) − 0.125(256) = <span class="math-fraction"><span>64</span><span>3</span></span> + 32 − 32 = <span class="math-fraction"><span>64</span><span>3</span></span></span>.<br>
        - Evaluando en <span class="math-text"><i>x</i> = −2</span>:<br>
        <span class="math-text">−<span class="math-fraction"><span>8</span><span>3</span></span> + 2(4) − 0.125(16) = −<span class="math-fraction"><span>8</span><span>3</span></span> + 8 − 2 = −<span class="math-fraction"><span>8</span><span>3</span></span> + 6 = <span class="math-fraction"><span>10</span><span>3</span></span></span>.<br>
        Restando ambos límites:<br>
        <span class="math-text"><span class="math-fraction"><span>64</span><span>3</span></span> − <span class="math-fraction"><span>10</span><span>3</span></span> = <span class="math-fraction"><span>54</span><span>3</span></span> = 18</span>.<br>
        El valor numérico de la integral es exactamente <span class="math-text">18</span>.</p>

        <p><strong>Ejemplo 2: Región delimitada por hipérbola y rectas (Ejemplo 5 de Semana 06, pág. 10)</strong><br>
        Calcular la integral doble <span class="math-text">∬<sub><i>D</i></sub> <span class="math-fraction"><span><i>x</i>²</span><span><i>y</i>²</span></span> <i>dx dy</i></span>, donde <span class="math-text"><i>D</i></span> es el dominio acotado por las rectas <span class="math-text"><i>x</i> = 2</span>, <span class="math-text"><i>y</i> = <i>x</i></span> y la hipérbola equilátera <span class="math-text"><i>xy</i> = 1</span>.<br>
        • <em>Solución paso a paso:</em><br>
        1) <strong>Intersección de las curvas:</strong><br>
        Igualando la recta <span class="math-text"><i>y</i> = <i>x</i></span> con la hipérbola <span class="math-text"><i>y</i> = <span class="math-fraction"><span>1</span><span><i>x</i></span></span></span>:<br>
        <span class="math-text"><i>x</i> = <span class="math-fraction"><span>1</span><span><i>x</i></span></span> ⇒ <i>x</i>² = 1 ⇒ <i>x</i> = ±1</span>.<br>
        En la región del primer cuadrante, tomamos la raíz positiva <span class="math-text"><i>x</i> = 1</span>, con punto de corte <span class="math-text">(1, 1)</span>.<br>
        2) <strong>Límites como región verticalmente simple (Tipo I):</strong><br>
        La región se extiende horizontalmente desde <span class="math-text"><i>x</i> = 1</span> hasta <span class="math-text"><i>x</i> = 2</span>. Para cada <span class="math-text"><i>x</i></span> fijo en este intervalo, la variable <span class="math-text"><i>y</i></span> varía desde la rama hiperbólica inferior <span class="math-text"><i>y</i> = <span class="math-fraction"><span>1</span><span><i>x</i></span></span></span> hasta la recta superior <span class="math-text"><i>y</i> = <i>x</i></span>:<br>
        <span class="math-text">1 ≤ <i>x</i> ≤ 2, &nbsp;&nbsp; <span class="math-fraction"><span>1</span><span><i>x</i></span></span> ≤ <i>y</i> ≤ <i>x</i></span>.<br>
        3) <strong>Evaluación iterada:</strong><br>
        <span class="math-text">∬<sub><i>D</i></sub> <span class="math-fraction"><span><i>x</i>²</span><span><i>y</i>²</span></span> <i>dx dy</i> = ∫₁² [ ∫<sub>1/<i>x</i></sub><sup><i>x</i></sup> <span class="math-fraction"><span><i>x</i>²</span><span><i>y</i>²</span></span> <i>dy</i> ] <i>dx</i> = ∫₁² <i>x</i>² [ −<span class="math-fraction"><span>1</span><span><i>y</i></span></span> ]<sub>1/<i>x</i></sub><sup><i>x</i></sup> <i>dx</i></span>.<br>
        Evaluando el corchete interno:<br>
        <span class="math-text">[ −<span class="math-fraction"><span>1</span><span><i>y</i></span></span> ]<sub>1/<i>x</i></sub><sup><i>x</i></sup> = −<span class="math-fraction"><span>1</span><span><i>x</i></span></span> − ( −<span class="math-fraction"><span>1</span><span>1/<i>x</i></span></span> ) = −<span class="math-fraction"><span>1</span><span><i>x</i></span></span> + <i>x</i> = <i>x</i> − <span class="math-fraction"><span>1</span><span><i>x</i></span></span></span>.<br>
        Multiplicando por <span class="math-text"><i>x</i>²</span> e integrando respecto a <span class="math-text"><i>x</i></span>:<br>
        <span class="math-text">∫₁² <i>x</i>² (<i>x</i> − <span class="math-fraction"><span>1</span><span><i>x</i></span></span>) <i>dx</i> = ∫₁² (<i>x</i>³ − <i>x</i>) <i>dx</i> = [ <span class="math-fraction"><span><i>x</i>⁴</span><span>4</span></span> − <span class="math-fraction"><span><i>x</i>²</span><span>2</span></span> ]₁²</span>.<br>
        - En <span class="math-text"><i>x</i> = 2</span>: <span class="math-text"><span class="math-fraction"><span>16</span><span>4</span></span> − <span class="math-fraction"><span>4</span><span>2</span></span> = 4 − 2 = 2</span>.<br>
        - En <span class="math-text"><i>x</i> = 1</span>: <span class="math-text"><span class="math-fraction"><span>1</span><span>4</span></span> − <span class="math-fraction"><span>1</span><span>2</span></span> = −<span class="math-fraction"><span>1</span><span>4</span></span></span>.<br>
        Restando: <span class="math-text">2 − (−<span class="math-fraction"><span>1</span><span>4</span></span>) = 2 + <span class="math-fraction"><span>1</span><span>4</span></span> = <span class="math-fraction"><span>9</span><span>4</span></span></span>.<br>
        El resultado analítico es <span class="math-text"><span class="math-fraction"><span>9</span><span>4</span></span></span>.</p>

        <h3>Ejercicios de práctica propuestos del folleto (con soluciones detalladas)</h3>

        <p><strong>Ejercicio 1: Integral sobre región parabólica (Propuesto 31 de Semana 06, pág. 17)</strong><br>
        Evaluar <span class="math-text">∬<sub><i>R</i></sub> (<i>x</i> + <i>y</i>) <i>dA</i></span>, si <span class="math-text"><i>R</i></span> es la región limitada por la parábola <span class="math-text"><i>y</i> = <i>x</i>²</span> y la recta horizontal <span class="math-text"><i>y</i> = 1</span>.<br>
        • <em>Solución explicada:</em><br>
        1) <strong>Límites de integración:</strong> Las curvas se cortan en <span class="math-text"><i>x</i>² = 1 ⇒ <i>x</i> = ±1</span>. Como región Tipo I: <span class="math-text">−1 ≤ <i>x</i> ≤ 1</span> y <span class="math-text"><i>x</i>² ≤ <i>y</i> ≤ 1</span>.<br>
        2) <strong>Evaluación:</strong><br>
        <span class="math-text">∬<sub><i>R</i></sub> (<i>x</i> + <i>y</i>) <i>dA</i> = ∫<sub>−1</sub>¹ [ ∫<sub><i>x</i>²</sub>¹ (<i>x</i> + <i>y</i>) <i>dy</i> ] <i>dx</i> = ∫<sub>−1</sub>¹ [ <i>xy</i> + <span class="math-fraction"><span><i>y</i>²</span><span>2</span></span> ]<sub><i>x</i>²</sub>¹ <i>dx</i></span>.<br>
        <span class="math-text">= ∫<sub>−1</sub>¹ [ (<i>x</i> + <span class="math-fraction"><span>1</span><span>2</span></span>) − (<i>x</i>³ + <span class="math-fraction"><span><i>x</i>⁴</span><span>2</span></span>) ] <i>dx</i> = ∫<sub>−1</sub>¹ (<i>x</i> − <i>x</i>³ + <span class="math-fraction"><span>1</span><span>2</span></span> − <span class="math-fraction"><span><i>x</i>⁴</span><span>2</span></span>) <i>dx</i></span>.<br>
        Por simetría, las funciones impares <span class="math-text"><i>x</i> − <i>x</i>³</span> se anulan al integrar en un intervalo simétrico <span class="math-text">[−1, 1]</span>:<br>
        <span class="math-text">= 2 ∫₀¹ ( <span class="math-fraction"><span>1</span><span>2</span></span> − <span class="math-fraction"><span><i>x</i>⁴</span><span>2</span></span> ) <i>dx</i> = ∫₀¹ (1 − <i>x</i>⁴) <i>dx</i> = [ <i>x</i> − <span class="math-fraction"><span><i>x</i>⁵</span><span>5</span></span> ]₀¹ = 1 − <span class="math-fraction"><span>1</span><span>5</span></span> = <span class="math-fraction"><span>4</span><span>5</span></span></span>.</p>

        <p><strong>Ejercicio 2: Región horizontalmente simple (Propuesto 33 de Semana 06, pág. 17)</strong><br>
        Evaluar <span class="math-text">∬<sub><i>R</i></sub> <i>x</i> <i>dA</i></span>, si <span class="math-text"><i>R</i></span> es el triángulo con vértices en <span class="math-text">(0, 0)</span>, <span class="math-text">(1, 1)</span> y <span class="math-text">(0, 1)</span>.<br>
        • <em>Solución explicada:</em><br>
        1) Las rectas que forman los lados son el eje <span class="math-text"><i>Y</i></span> (<span class="math-text"><i>x</i> = 0</span>), la recta horizontal <span class="math-text"><i>y</i> = 1</span> y la recta identidad <span class="math-text"><i>y</i> = <i>x</i></span> (<span class="math-text"><i>x</i> = <i>y</i></span>).<br>
        2) Describiendo como región Tipo II (horizontalmente simple):<br>
        Para cada <span class="math-text"><i>y</i> ∈ [0, 1]</span>, la coordenada <span class="math-text"><i>x</i></span> entra por la izquierda en <span class="math-text"><i>x</i> = 0</span> y sale por la derecha en <span class="math-text"><i>x</i> = <i>y</i></span>:<br>
        <span class="math-text">0 ≤ <i>y</i> ≤ 1, &nbsp;&nbsp; 0 ≤ <i>x</i> ≤ <i>y</i></span>.<br>
        3) Evaluación iterada:<br>
        <span class="math-text">∬<sub><i>R</i></sub> <i>x</i> <i>dA</i> = ∫₀¹ [ ∫₀<sup><i>y</i></sup> <i>x</i> <i>dx</i> ] <i>dy</i> = ∫₀¹ [ <span class="math-fraction"><span><i>x</i>²</span><span>2</span></span> ]₀<sup><i>y</i></sup> <i>dy</i> = ∫₀¹ <span class="math-fraction"><span><i>y</i>²</span><span>2</span></span> <i>dy</i> = [ <span class="math-fraction"><span><i>y</i>³</span><span>6</span></span> ]₀¹ = <span class="math-fraction"><span>1</span><span>6</span></span></span>.</p>`
    },
    {
      title: 'Inversión del orden de integración',
      content: `<p class="lesson-lead">Invertir el orden de integración es una de las técnicas analíticas más poderosas del cálculo multivariable. Con frecuencia, una integral iterada planteada en un orden determinado resulta imposible de calcular mediante funciones elementales ordinarias (como ocurre con <i>e</i><sup><i>x</i>²</sup> o sen(<i>x</i>²)), pero al intercambiar el orden de integración, la presencia de la variable diferencial acompañante destraba la antiderivada. Asimismo, cambiar el orden permite reducir drásticamente el número de subregiones requeridas para calcular una misma integral.</p>

        <h2>Inversión del orden de integración</h2>

        <h3>Motivación analítica y necesidad geométrica</h3>
        <p>De acuerdo con el folleto <em>Semana 06.pdf</em> (pág. 13) del profesor David Chávez, existen dos razones fundamentales para cambiar el orden de los límites de integración:</p>
        <p>1. <strong>Inviabilidad de antiderivadas elementales:</strong> Ciertas funciones de una variable como <span class="math-text"><i>e</i><sup><i>x</i>²</sup></span>, <span class="math-text">sen(<i>x</i>²)</span> o <span class="math-text"><span class="math-fraction"><span>sen <i>x</i></span><span><i>x</i></span></span></span> no admiten primitivas expresables en términos de funciones elementales. Si se plantea una integral iterada donde la primera integración deba hacerse respecto a <span class="math-text"><i>x</i></span> con tal integrando, el cálculo queda bloqueado. Al invertir el orden al formato <span class="math-text"><i>dy dx</i></span>, la integración previa respecto a <span class="math-text"><i>y</i></span> suele introducir un factor lineal <span class="math-text"><i>x</i></span> en el integrando (<span class="math-text"><i>x e</i><sup><i>x</i>²</sup></span>), permitiendo una sustitución inmediata.<br>
        2. <strong>Simplificación geométrica del dominio:</strong> Una región que requiere ser subdividida en dos o tres partes cuando se describe como Tipo I puede ser descrita como una <strong>única región simple</strong> si se mira como Tipo II (o viceversa), reduciendo el número de integrales a calcular.</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Metodología sistemática de inversión en 4 etapas</strong></div>
          <p><strong>Paso 1: Extraer las desigualdades analíticas:</strong> Identificar a partir de los límites dados la descripción algebraica de la región <span class="math-text"><i>R</i></span>.<br>
          <strong>Paso 2: Bosquejar gráficamente la región:</strong> Trazar las curvas frontera en el plano cartesiano y hallar todos los puntos de intersección resolviendo las ecuaciones simultáneas.<br>
          <strong>Paso 3: Invertir el rol de las variables:</strong> Proyectar sobre el eje coordenado opuesto para obtener los nuevos límites constantes externos, y despejar la variable complementaria para determinar las nuevas funciones frontera de entrada y salida.<br>
          <strong>Paso 4: Formular y evaluar las nuevas integrales iteradas:</strong> Escribir la integral equivalente (o la suma de integrales si la nueva vista requiere partición) y resolver analíticamente.</p>
        </div>

        <h3>Ejemplos resueltos del folleto (paso a paso)</h3>

        <p><strong>Ejemplo 1: Inversión de límites entre recta y parábola (Ejemplo 9.i de Semana 06, pág. 15)</strong><br>
        Invertir el orden de integración de la integral doble:<br>
        <span class="math-text"><i>I</i> = ∫₀⁴ [ ∫<sub>3<i>x</i>²</sub><sup>12<i>x</i></sup> <i>f</i>(<i>x</i>, <i>y</i>) <i>dy</i> ] <i>dx</i></span>.<br>
        • <em>Solución paso a paso:</em><br>
        1) <strong>Interpretación de límites dados (Tipo I):</strong><br>
        Límites externos: <span class="math-text">0 ≤ <i>x</i> ≤ 4</span>.<br>
        Límites internos: <span class="math-text">3<i>x</i>² ≤ <i>y</i> ≤ 12<i>x</i></span>.<br>
        2) <strong>Puntos de corte entre la parábola y la recta:</strong><br>
        <span class="math-text">3<i>x</i>² = 12<i>x</i> ⇒ 3<i>x</i>² − 12<i>x</i> = 0 ⇒ 3<i>x</i>(<i>x</i> − 4) = 0</span>.<br>
        Puntos de intersección: <span class="math-text">(0, 0)</span> y <span class="math-text">(4, 48)</span>.<br>
        3) <strong>Despeje de <i>x</i> en función de <i>y</i> (Tipo II):</strong><br>
        - De la recta <span class="math-text"><i>y</i> = 12<i>x</i> ⇒ <i>x</i> = <span class="math-fraction"><span><i>y</i></span><span>12</span></span></span> (actúa como curva frontera izquierda de entrada).<br>
        - De la parábola <span class="math-text"><i>y</i> = 3<i>x</i>² ⇒ <i>x</i>² = <span class="math-fraction"><span><i>y</i></span><span>3</span></span> ⇒ <i>x</i> = √<span class="math-radical"><span class="math-fraction"><span><i>y</i></span><span>3</span></span></span></span> (actúa como curva frontera derecha de salida).<br>
        4) <strong>Rango de variación de <i>y</i>:</strong><br>
        La proyección sobre el eje <span class="math-text"><i>Y</i></span> va desde el valor mínimo <span class="math-text"><i>y</i> = 0</span> hasta el valor máximo en la cúspide de intersección <span class="math-text"><i>y</i> = 48</span>.<br>
        5) <strong>Integral con orden invertido:</strong><br>
        <span class="math-text">∫₀⁴⁸ [ ∫<sub><i>y</i>/12</sub><sup>√<span class="math-radical"><i>y</i>/3</span></sup> <i>f</i>(<i>x</i>, <i>y</i>) <i>dx</i> ] <i>dy</i></span>.</p>

        <p><strong>Ejemplo 2: Inversión y evaluación analítica completa (Ejemplo 10 de Semana 06, pág. 16)</strong><br>
        Invierta el orden de integración y evalúe la integral resultante:<br>
        <span class="math-text"><i>I</i> = ∫<sub>−2</sub>² [ ∫<sub><i>x</i>²</sub>⁴ <i>x</i>² <i>y</i> <i>dy</i> ] <i>dx</i></span>.<br>
        • <em>Solución analítica explicada:</em><br>
        1) <strong>Descripción original (Tipo I):</strong><br>
        La región está dada por <span class="math-text"><i>x</i>² ≤ <i>y</i> ≤ 4</span> para <span class="math-text">−2 ≤ <i>x</i> ≤ 2</span>. Corresponde a la zona comprendida entre la parábola <span class="math-text"><i>y</i> = <i>x</i>²</span> y la recta horizontal superior <span class="math-text"><i>y</i> = 4</span>.<br>
        2) <strong>Inversión a región horizontalmente simple (Tipo II):</strong><br>
        Despejando <span class="math-text"><i>x</i></span> de la ecuación de la parábola: <span class="math-text"><i>x</i> = ±√<span class="math-radical"><i>y</i></span></span>.<br>
        La variable <span class="math-text"><i>y</i></span> varía entre las cotas constantes <span class="math-text">0 ≤ <i>y</i> ≤ 4</span>.<br>
        Para cada valor de <span class="math-text"><i>y</i></span> fijo, <span class="math-text"><i>x</i></span> entra por la rama izquierda negativa <span class="math-text"><i>x</i> = −√<span class="math-radical"><i>y</i></span></span> y sale por la rama derecha positiva <span class="math-text"><i>x</i> = +√<span class="math-radical"><i>y</i></span></span>:<br>
        <span class="math-text">0 ≤ <i>y</i> ≤ 4, &nbsp;&nbsp; −√<span class="math-radical"><i>y</i></span> ≤ <i>x</i> ≤ √<span class="math-radical"><i>y</i></span></span>.<br>
        3) <strong>Planteamiento y evaluación de la integral invertida:</strong><br>
        <span class="math-text"><i>I</i> = ∫₀⁴ [ ∫<sub>−√<span class="math-radical"><i>y</i></span></sub><sup>√<span class="math-radical"><i>y</i></span></sup> <i>x</i>² <i>y</i> <i>dx</i> ] <i>dy</i></span>.<br>
        Resolvemos la integral interior respecto a <span class="math-text"><i>x</i></span>:<br>
        <span class="math-text">∫<sub>−√<span class="math-radical"><i>y</i></span></sub><sup>√<span class="math-radical"><i>y</i></span></sup> <i>x</i>² <i>y</i> <i>dx</i> = <i>y</i> [ <span class="math-fraction"><span><i>x</i>³</span><span>3</span></span> ]<sub>−√<span class="math-radical"><i>y</i></span></sub><sup>√<span class="math-radical"><i>y</i></span></sup> = <i>y</i> ( <span class="math-fraction"><span>(√<span class="math-radical"><i>y</i></span>)³</span><span>3</span></span> − <span class="math-fraction"><span>(−√<span class="math-radical"><i>y</i></span>)³</span><span>3</span></span> ) = <span class="math-fraction"><span>2</span><span>3</span></span> <i>y</i> · <i>y</i><sup>3/2</sup> = <span class="math-fraction"><span>2</span><span>3</span></span> <i>y</i><sup>5/2</sup></span>.<br>
        Resolvemos la integral exterior respecto a <span class="math-text"><i>y</i></span>:<br>
        <span class="math-text"><i>I</i> = ∫₀⁴ <span class="math-fraction"><span>2</span><span>3</span></span> <i>y</i><sup>5/2</sup> <i>dy</i> = <span class="math-fraction"><span>2</span><span>3</span></span> [ <span class="math-fraction"><span><i>y</i><sup>7/2</sup></span><span>7/2</span></span> ]₀⁴ = <span class="math-fraction"><span>2</span><span>3</span></span> · <span class="math-fraction"><span>2</span><span>7</span></span> [ <i>y</i><sup>7/2</sup> ]₀⁴ = <span class="math-fraction"><span>4</span><span>21</span></span> (4<sup>7/2</sup>)</span>.<br>
        Como <span class="math-text">4<sup>7/2</sup> = (√<span class="math-radical">4</span>)⁷ = 2⁷ = 128</span>:<br>
        <span class="math-text"><i>I</i> = <span class="math-fraction"><span>4 · 128</span><span>21</span></span> = <span class="math-fraction"><span>512</span><span>21</span></span></span>.<br>
        El resultado exacto es <span class="math-text"><span class="math-fraction"><span>512</span><span>21</span></span></span>.</p>

        <p><strong>Ejemplo 3: Reducción de subregiones en un trapecio (Ejemplo 8.iii de Semana 06, pág. 13)</strong><br>
        Dada la región trapezoidal <span class="math-text"><i>R</i></span> con vértices <span class="math-text"><i>O</i>(0, 0)</span>, <span class="math-text"><i>A</i>(2, 0)</span>, <span class="math-text"><i>B</i>(1, 1)</span> y <span class="math-text"><i>C</i>(0, 1)</span>:<br>
        • <em>En orden <span class="math-text"><i>dy dx</i></span>:</em> La región debe dividirse en dos subregiones:<br>
        - Un cuadrado <span class="math-text"><i>R</i>₁: 0 ≤ <i>x</i> ≤ 1, 0 ≤ <i>y</i> ≤ 1</span>.<br>
        - Un triángulo <span class="math-text"><i>R</i>₂: 1 ≤ <i>x</i> ≤ 2, 0 ≤ <i>y</i> ≤ 2 − <i>x</i></span>.<br>
        <span class="math-text"><i>I</i> = ∫₀¹ [ ∫₀¹ <i>f</i>(<i>x</i>, <i>y</i>) <i>dy</i> ] <i>dx</i> + ∫₁² [ ∫₀<sup>2−<i>x</i></sup> <i>f</i>(<i>x</i>, <i>y</i>) <i>dy</i> ] <i>dx</i></span>.<br>
        • <em>En orden invertido <span class="math-text"><i>dx dy</i></span>:</em> La región se describe de forma inmediata como una única región Tipo II:<br>
        <span class="math-text">0 ≤ <i>y</i> ≤ 1, &nbsp;&nbsp; 0 ≤ <i>x</i> ≤ 2 − <i>y</i></span>.<br>
        <span class="math-text"><i>I</i> = ∫₀¹ [ ∫₀<sup>2−<i>y</i></sup> <i>f</i>(<i>x</i>, <i>y</i>) <i>dx</i> ] <i>dy</i></span>.<br>
        Invertir el orden reduce a la mitad el número de integrales a calcular.</p>

        <h3>Ejercicios de práctica propuestos del folleto (con soluciones detalladas)</h3>

        <p><strong>Ejercicio 1: Inversión con partición en subregiones (Propuesto 5 de Semana 06, pág. 16)</strong><br>
        Invertir el orden de integración de la integral:<br>
        <span class="math-text">∫<sub>−1</sub>² [ ∫<sub><i>x</i>²</sub><sup><i>x</i>+2</sup> <i>f</i>(<i>x</i>, <i>y</i>) <i>dy</i> ] <i>dx</i></span>.<br>
        • <em>Solución paso a paso:</em><br>
        1) <strong>Intersecciones de frontera:</strong> <span class="math-text"><i>x</i>² = <i>x</i> + 2 ⇒ <i>x</i>² − <i>x</i> − 2 = 0 ⇒ (<i>x</i> − 2)(<i>x</i> + 1) = 0</span>. Puntos de corte: <span class="math-text">(−1, 1)</span> y <span class="math-text">(2, 4)</span>.<br>
        2) <strong>Proyección sobre el eje <i>Y</i>:</strong> El valor de <span class="math-text"><i>y</i></span> varía de <span class="math-text">0</span> a <span class="math-text">4</span>. En el nivel crítico <span class="math-text"><i>y</i> = 1</span> cambia la curva frontera de la izquierda:<br>
        - Para <span class="math-text">0 ≤ <i>y</i> ≤ 1</span>: La variable <span class="math-text"><i>x</i></span> entra por la rama parabólica izquierda <span class="math-text"><i>x</i> = −√<span class="math-radical"><i>y</i></span></span> y sale por la rama derecha <span class="math-text"><i>x</i> = √<span class="math-radical"><i>y</i></span></span>.<br>
        - Para <span class="math-text">1 ≤ <i>y</i> ≤ 4</span>: La variable <span class="math-text"><i>x</i></span> entra por la recta <span class="math-text"><i>x</i> = <i>y</i> − 2</span> y sale por la parábola <span class="math-text"><i>x</i> = √<span class="math-radical"><i>y</i></span></span>.<br>
        3) <strong>Suma de integrales invertidas:</strong><br>
        <span class="math-text">∫₀¹ [ ∫<sub>−√<span class="math-radical"><i>y</i></span></sub><sup>√<span class="math-radical"><i>y</i></span></sup> <i>f</i>(<i>x</i>, <i>y</i>) <i>dx</i> ] <i>dy</i> + ∫₁⁴ [ ∫<sub><i>y</i>−2</sub><sup>√<span class="math-radical"><i>y</i></span></sup> <i>f</i>(<i>x</i>, <i>y</i>) <i>dx</i> ] <i>dy</i></span>.</p>

        <p><strong>Ejercicio 2: Resolución de integral no elemental mediante inversión de orden</strong><br>
        Evaluar la integral doble:<br>
        <span class="math-text"><i>I</i> = ∫₀¹ [ ∫<sub><i>y</i></sub>¹ <i>e</i><sup><i>x</i>²</sup> <i>dx</i> ] <i>dy</i></span>.<br>
        • <em>Solución paso a paso:</em><br>
        1) La integral interna <span class="math-text">∫ <i>e</i><sup><i>x</i>²</sup> <i>dx</i></span> no tiene primitiva elemental.<br>
        2) Describimos geométricamente la región: <span class="math-text">0 ≤ <i>y</i> ≤ 1</span> y <span class="math-text"><i>y</i> ≤ <i>x</i> ≤ 1</span>. Es el triángulo acotado por <span class="math-text"><i>y</i> = 0</span>, <span class="math-text"><i>x</i> = 1</span> y <span class="math-text"><i>y</i> = <i>x</i></span>.<br>
        3) Invertimos a Tipo I: <span class="math-text">0 ≤ <i>x</i> ≤ 1</span> y <span class="math-text">0 ≤ <i>y</i> ≤ <i>x</i></span>.<br>
        <span class="math-text"><i>I</i> = ∫₀¹ [ ∫₀<sup><i>x</i></sup> <i>e</i><sup><i>x</i>²</sup> <i>dy</i> ] <i>dx</i> = ∫₀¹ <i>e</i><sup><i>x</i>²</sup> [ <i>y</i> ]₀<sup><i>x</i></sup> <i>dx</i> = ∫₀¹ <i>x e</i><sup><i>x</i>²</sup> <i>dx</i></span>.<br>
        4) Integrando por sustitución <span class="math-text"><i>u</i> = <i>x</i>² ⇒ <i>du</i> = 2<i>x dx</i></span>:<br>
        <span class="math-text"><i>I</i> = [ <span class="math-fraction"><span>1</span><span>2</span></span> <i>e</i><sup><i>x</i>²</sup> ]₀¹ = <span class="math-fraction"><span><i>e</i>¹ − <i>e</i>⁰</span><span>2</span></span> = <span class="math-fraction"><span><i>e</i> − 1</span><span>2</span></span></span>.<br>
        La inversión permite resolver de forma exacta una integral previamente imposible.</p>`
    },
    {
      title: 'Cambio de variables y Jacobiano',
      content: `<p class="lesson-lead">El cambio de variables en integrales dobles es el análogo multivariable del método de sustitución del cálculo en una variable. Cuando una región plana de integración presenta fronteras curvilíneas complejas o cuando el integrando combina variables de forma no separable, una transformación de coordenadas adecuada permite simplificar la geometría del dominio convirtiéndolo en un rectángulo o paralelogramo estándar, a la vez que regulariza el integrando. Para preservar rigurosamente la medida del área bajo esta deformación espacial, interviene el determinante Jacobiano y su valor absoluto.</p>

        <h2>Cambio de variables y determinante Jacobiano</h2>

        <h3>Fundamento analítico y transformación de coordenadas</h3>
        <p>De acuerdo con el folleto <em>Semana 07.pdf</em> (pág. 4) del profesor David Chávez (UNI), consideremos una transformación biyectiva de clase <span class="math-text"><i>C</i>¹</span> que relaciona las coordenadas cartesianas <span class="math-text">(<i>x</i>, <i>y</i>)</span> con un nuevo sistema de coordenadas <span class="math-text">(<i>u</i>, <i>v</i>)</span> mediante las funciones continuas:</p>
        <p><span class="math-text"><i>x</i> = <i>g</i>(<i>u</i>, <i>v</i>), &nbsp;&nbsp; <i>y</i> = <i>h</i>(<i>u</i>, <i>v</i>)</span></p>
        <p>Esta aplicación transforma de manera biunívoca una región acotada <span class="math-text"><i>S</i></span> del plano <span class="math-text"><i>UV</i></span> en una región <span class="math-text"><i>R</i></span> del plano cartesiano <span class="math-text"><i>XY</i></span>. Bajo esta correspondencia geométrica, el integrando <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>)</span> se expresa en términos de las nuevas variables como <span class="math-text"><i>F</i>(<i>u</i>, <i>v</i>) = <i>f</i>(<i>g</i>(<i>u</i>, <i>v</i>), <i>h</i>(<i>u</i>, <i>v</i>))</span>.</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Definición: Determinante Jacobiano de la transformación</strong></div>
          <p>El <strong>determinante Jacobiano</strong> de <span class="math-text">(<i>x</i>, <i>y</i>)</span> con respecto a <span class="math-text">(<i>u</i>, <i>v</i>)</span>, denotado por <span class="math-text"><i>J</i>(<i>u</i>, <i>v</i>)</span> o <span class="math-text"><span class="math-fraction"><span>∂(<i>x</i>, <i>y</i>)</span><span>∂(<i>u</i>, <i>v</i>)</span></span></span>, es el determinante de la matriz de derivadas parciales:<br>
          <span class="math-text"><i>J</i>(<i>u</i>, <i>v</i>) = <span class="math-fraction"><span>∂(<i>x</i>, <i>y</i>)</span><span>∂(<i>u</i>, <i>v</i>)</span></span> = | <span class="math-fraction"><span>∂<i>x</i></span><span>∂<i>u</i></span></span> &nbsp; <span class="math-fraction"><span>∂<i>x</i></span><span>∂<i>v</i></span></span> ; &nbsp; <span class="math-fraction"><span>∂<i>y</i></span><span>∂<i>u</i></span></span> &nbsp; <span class="math-fraction"><span>∂<i>y</i></span><span>∂<i>v</i></span></span> | = <span class="math-fraction"><span>∂<i>x</i></span><span>∂<i>u</i></span></span> <span class="math-fraction"><span>∂<i>y</i></span><span>∂<i>v</i></span></span> − <span class="math-fraction"><span>∂<i>x</i></span><span>∂<i>v</i></span></span> <span class="math-fraction"><span>∂<i>y</i></span><span>∂<i>u</i></span></span></span></p>
          <p>• <strong>Propiedad del Jacobiano recíproco o inverso (Folleto, pág. 4):</strong><br>
          Si es más sencillo despejar <span class="math-text"><i>u</i> = <i>u</i>(<i>x</i>, <i>y</i>)</span> y <span class="math-text"><i>v</i> = <i>v</i>(<i>x</i>, <i>y</i>)</span> a partir de las fronteras de la región, el Jacobiano directo se calcula como el inverso del Jacobiano de las variables inversas:<br>
          <span class="math-text"><span class="math-fraction"><span>∂(<i>x</i>, <i>y</i>)</span><span>∂(<i>u</i>, <i>v</i>)</span></span> = <span class="math-fraction"><span>1</span><span><span class="math-fraction"><span>∂(<i>u</i>, <i>v</i>)</span><span>∂(<i>x</i>, <i>y</i>)</span></span></span></span></span>, &nbsp;&nbsp;siempre que &nbsp;<span class="math-text"><span class="math-fraction"><span>∂(<i>u</i>, <i>v</i>)</span><span>∂(<i>x</i>, <i>y</i>)</span></span> ≠ 0</span>.</p>
        </div>

        <h3>El factor de distorsión de área y la necesidad obligatoria del valor absoluto |J|</h3>
        <p>Un rectángulo infinitesimal en el plano <span class="math-text"><i>UV</i></span> de dimensiones <span class="math-text">Δ<i>u</i></span> y <span class="math-text">Δ<i>v</i></span> se transforma en el plano <span class="math-text"><i>XY</i></span> en un paralelogramo curvilíneo generado por los vectores tangentes:<br>
        <span class="math-text"><b>t</b><sub><i>u</i></sub> ≈ ( <span class="math-fraction"><span>∂<i>x</i></span><span>∂<i>u</i></span></span>, <span class="math-fraction"><span>∂<i>y</i></span><span>∂<i>u</i></span></span> ) Δ<i>u</i> &nbsp;&nbsp;y&nbsp;&nbsp; <b>t</b><sub><i>v</i></sub> ≈ ( <span class="math-fraction"><span>∂<i>x</i></span><span>∂<i>v</i></span></span>, <span class="math-fraction"><span>∂<i>y</i></span><span>∂<i>v</i></span></span> ) Δ<i>v</i></span>.<br>
        El área orientada de dicho paralelogramo corresponde a la componente normal del producto cruz vectorial:<br>
        <span class="math-text"><b>t</b><sub><i>u</i></sub> × <b>t</b><sub><i>v</i></sub> = ( <span class="math-fraction"><span>∂<i>x</i></span><span>∂<i>u</i></span></span> <span class="math-fraction"><span>∂<i>y</i></span><span>∂<i>v</i></span></span> − <span class="math-fraction"><span>∂<i>x</i></span><span>∂<i>v</i></span></span> <span class="math-fraction"><span>∂<i>y</i></span><span>∂<i>u</i></span></span> ) Δ<i>u</i> Δ<i>v</i> = <i>J</i>(<i>u</i>, <i>v</i>) Δ<i>u</i> Δ<i>v</i></span>.</p>
        <p><strong>¿Por qué es indispensable tomar el valor absoluto <span class="math-text">|<i>J</i>(<i>u</i>, <i>v</i>)|</span>?</strong><br>
        El determinante Jacobiano <span class="math-text"><i>J</i>(<i>u</i>, <i>v</i>)</span> puede tener signo negativo si la transformación invierte la orientación geométrica del plano (por ejemplo, si transforma una base dextrógira en una levógira). No obstante, el elemento diferencial de área geométrica <span class="math-text"><i>dA</i> = <i>dx dy</i></span> en la integral de Riemann cuantifica una magnitud espacial estrictamente no negativa. Por consiguiente, es <strong>obligatorio</strong> tomar el módulo o valor absoluto:<br>
        <span class="math-text"><i>dA</i> = <i>dx dy</i> = |<i>J</i>(<i>u</i>, <i>v</i>)| <i>du dv</i></span>.</p>
        <p>• <strong>Teorema fundamental del cambio de variables (Folleto, pág. 4):</strong><br>
        <span class="math-text">∬<sub><i>R</i></sub> <i>f</i>(<i>x</i>, <i>y</i>) <i>dx dy</i> = ∬<sub><i>S</i></sub> <i>f</i>(<i>g</i>(<i>u</i>, <i>v</i>), <i>h</i>(<i>u</i>, <i>v</i>)) |<i>J</i>(<i>u</i>, <i>v</i>)| <i>du dv</i></span>.</p>

        <h3>Ejemplos resueltos del folleto (paso a paso)</h3>

        <p><strong>Ejemplo 1: Transformación lineal y rectificación de fronteras (Ejemplo 7 de Semana 07, págs. 8-9)</strong><br>
        Calcule la integral doble:<br>
        <span class="math-text">∬<sub><i>R</i></sub> <span class="math-fraction"><span><i>e</i><sup>−(<i>y</i> − <i>x</i>)</sup></span><span><i>y</i> + <i>x</i></span></span> <i>dx dy</i></span>,<br>
        donde <span class="math-text"><i>R</i></span> es la región plana acotada por las cuatro rectas: <span class="math-text"><i>y</i> − <i>x</i> = 0</span>, <span class="math-text"><i>y</i> − <i>x</i> = 5</span>, <span class="math-text"><i>y</i> + <i>x</i> = 2</span> y <span class="math-text"><i>y</i> + <i>x</i> = 4</span>.<br>
        • <em>Solución paso a paso:</em><br>
        1) <strong>Elección del cambio de variables:</strong><br>
        En el orden cartesiano usual <span class="math-text"><i>dy dx</i></span> o <span class="math-text"><i>dx dy</i></span>, la región no es simple y exigiría subdividir <span class="math-text"><i>R</i></span> en tres subregiones distintas. Observando las ecuaciones frontera y el integrando, definimos las nuevas variables:<br>
        <span class="math-text"><i>u</i> = <i>y</i> − <i>x</i> &nbsp;&nbsp;y&nbsp;&nbsp; <i>v</i> = <i>y</i> + <i>x</i></span>.<br>
        2) <strong>Despeje de las variables originales:</strong><br>
        Sumando ambas expresiones: <span class="math-text"><i>u</i> + <i>v</i> = 2<i>y</i> ⇒ <i>y</i> = <span class="math-fraction"><span><i>u</i> + <i>v</i></span><span>2</span></span></span>.<br>
        Restando ambas expresiones: <span class="math-text"><i>v</i> − <i>u</i> = 2<i>x</i> ⇒ <i>x</i> = <span class="math-fraction"><span><i>v</i> − <i>u</i></span><span>2</span></span></span>.<br>
        3) <strong>Cálculo del determinante Jacobiano:</strong><br>
        Calculamos las derivadas parciales de <span class="math-text"><i>x</i></span> e <span class="math-text"><i>y</i></span>:<br>
        <span class="math-text"><span class="math-fraction"><span>∂<i>x</i></span><span>∂<i>u</i></span></span> = −<span class="math-fraction"><span>1</span><span>2</span></span></span>, &nbsp;<span class="math-text"><span class="math-fraction"><span>∂<i>x</i></span><span>∂<i>v</i></span></span> = <span class="math-fraction"><span>1</span><span>2</span></span></span>, &nbsp;<span class="math-text"><span class="math-fraction"><span>∂<i>y</i></span><span>∂<i>u</i></span></span> = <span class="math-fraction"><span>1</span><span>2</span></span></span>, &nbsp;<span class="math-text"><span class="math-fraction"><span>∂<i>y</i></span><span>∂<i>v</i></span></span> = <span class="math-fraction"><span>1</span><span>2</span></span></span>.<br>
        <span class="math-text"><i>J</i>(<i>u</i>, <i>v</i>) = | −<span class="math-fraction"><span>1</span><span>2</span></span> &nbsp; <span class="math-fraction"><span>1</span><span>2</span></span> ; &nbsp; <span class="math-fraction"><span>1</span><span>2</span></span> &nbsp; <span class="math-fraction"><span>1</span><span>2</span></span> | = (−<span class="math-fraction"><span>1</span><span>2</span></span>)(<span class="math-fraction"><span>1</span><span>2</span></span>) − (<span class="math-fraction"><span>1</span><span>2</span></span>)(<span class="math-fraction"><span>1</span><span>2</span></span>) = −<span class="math-fraction"><span>1</span><span>4</span></span> − <span class="math-fraction"><span>1</span><span>4</span></span> = −<span class="math-fraction"><span>1</span><span>2</span></span></span>.<br>
        Tomando el valor absoluto obligatorio:<br>
        <span class="math-text">|<i>J</i>(<i>u</i>, <i>v</i>)| = | −<span class="math-fraction"><span>1</span><span>2</span></span> | = <span class="math-fraction"><span>1</span><span>2</span></span> ⇒ <i>dx dy</i> = <span class="math-fraction"><span>1</span><span>2</span></span> <i>du dv</i></span>.<br>
        4) <strong>Identificación de la nueva región transformada <i>S</i>:</strong><br>
        Las cuatro rectas frontera se transforman de inmediato en cotas constantes:<br>
        - <span class="math-text"><i>y</i> − <i>x</i> = 0 ⇒ <i>u</i> = 0</span><br>
        - <span class="math-text"><i>y</i> − <i>x</i> = 5 ⇒ <i>u</i> = 5</span><br>
        - <span class="math-text"><i>y</i> + <i>x</i> = 2 ⇒ <i>v</i> = 2</span><br>
        - <span class="math-text"><i>y</i> + <i>x</i> = 4 ⇒ <i>v</i> = 4</span><br>
        La región <span class="math-text"><i>S</i></span> es un rectángulo estándar: <span class="math-text">0 ≤ <i>u</i> ≤ 5</span> y <span class="math-text">2 ≤ <i>v</i> ≤ 4</span>.<br>
        5) <strong>Evaluación analítica de la integral:</strong><br>
        El integrando se transforma en <span class="math-text"><span class="math-fraction"><span><i>e</i><sup>−<i>u</i></sup></span><span><i>v</i></span></span></span>:<br>
        <span class="math-text">∬<sub><i>R</i></sub> <span class="math-fraction"><span><i>e</i><sup>−(<i>y</i> − <i>x</i>)</sup></span><span><i>y</i> + <i>x</i></span></span> <i>dx dy</i> = ∫₂⁴ [ ∫₀⁵ <span class="math-fraction"><span><i>e</i><sup>−<i>u</i></sup></span><span><i>v</i></span></span> · <span class="math-fraction"><span>1</span><span>2</span></span> <i>du</i> ] <i>dv</i> = <span class="math-fraction"><span>1</span><span>2</span></span> ( ∫₂⁴ <span class="math-fraction"><span>1</span><span><i>v</i></span></span> <i>dv</i> ) ( ∫₀⁵ <i>e</i><sup>−<i>u</i></sup> <i>du</i> )</span>.<br>
        - Factor en <span class="math-text"><i>v</i></span>: <span class="math-text">∫₂⁴ <span class="math-fraction"><span>1</span><span><i>v</i></span></span> <i>dv</i> = [ ln <i>v</i> ]₂⁴ = ln 4 − ln 2 = ln( <span class="math-fraction"><span>4</span><span>2</span></span> ) = ln 2</span>.<br>
        - Factor en <span class="math-text"><i>u</i></span>: <span class="math-text">∫₀⁵ <i>e</i><sup>−<i>u</i></sup> <i>du</i> = [ −<i>e</i><sup>−<i>u</i></sup> ]₀⁵ = −<i>e</i><sup>−5</sup> − (−<i>e</i>⁰) = 1 − <i>e</i><sup>−5</sup></span>.<br>
        Multiplicando ambos factores:<br>
        <span class="math-text"><span class="math-fraction"><span>1</span><span>2</span></span> · (ln 2) · (1 − <i>e</i><sup>−5</sup>) = <span class="math-fraction"><span>1 − <i>e</i><sup>−5</sup></span><span>2</span></span> ln 2</span>.<br>
        El resultado exacto es <span class="math-text"><span class="math-fraction"><span>1 − <i>e</i><sup>−5</sup></span><span>2</span></span> ln 2</span>.</p>

        <p><strong>Ejemplo 2: Cambio no lineal entre hipérbolas y rectas concurrentes</strong><br>
        Calcular el área de la región <span class="math-text"><i>R</i></span> acotada por las hipérbolas <span class="math-text"><i>xy</i> = 1</span>, <span class="math-text"><i>xy</i> = 3</span> y las rectas <span class="math-text"><i>y</i> = <i>x</i></span>, <span class="math-text"><i>y</i> = 4<i>x</i></span> en el primer cuadrante.<br>
        • <em>Solución paso a paso:</em><br>
        1) <strong>Definición de las nuevas variables:</strong><br>
        Tomamos <span class="math-text"><i>u</i> = <i>xy</i></span> y <span class="math-text"><i>v</i> = <span class="math-fraction"><span><i>y</i></span><span><i>x</i></span></span></span>. Los nuevos límites son constantes: <span class="math-text">1 ≤ <i>u</i> ≤ 3</span> y <span class="math-text">1 ≤ <i>v</i> ≤ 4</span>.<br>
        2) <strong>Cálculo mediante el Jacobiano recíproco:</strong><br>
        <span class="math-text"><span class="math-fraction"><span>∂(<i>u</i>, <i>v</i>)</span><span>∂(<i>x</i>, <i>y</i>)</span></span> = | <i>y</i> &nbsp; <i>x</i> ; &nbsp; −<span class="math-fraction"><span><i>y</i></span><span><i>x</i>²</span></span> &nbsp; <span class="math-fraction"><span>1</span><span><i>x</i></span></span> | = <i>y</i>( <span class="math-fraction"><span>1</span><span><i>x</i></span></span> ) − <i>x</i>( −<span class="math-fraction"><span><i>y</i></span><span><i>x</i>²</span></span> ) = <span class="math-fraction"><span><i>y</i></span><span><i>x</i></span></span> + <span class="math-fraction"><span><i>y</i></span><span><i>x</i></span></span> = 2 <span class="math-fraction"><span><i>y</i></span><span><i>x</i></span></span> = 2<i>v</i></span>.<br>
        Por la propiedad del recíproco: <span class="math-text">|<i>J</i>(<i>u</i>, <i>v</i>)| = <span class="math-fraction"><span>1</span><span>2<i>v</i></span></span></span>.<br>
        3) <strong>Evaluación:</strong><br>
        <span class="math-text">Área(<i>R</i>) = ∬<sub><i>R</i></sub> <i>dx dy</i> = ∫₁³ [ ∫₁⁴ <span class="math-fraction"><span>1</span><span>2<i>v</i></span></span> <i>dv</i> ] <i>du</i> = ( ∫₁³ <i>du</i> ) · <span class="math-fraction"><span>1</span><span>2</span></span> [ ln <i>v</i> ]₁⁴ = 2 · <span class="math-fraction"><span>1</span><span>2</span></span> (ln 4 − 0) = ln 4 = 2 ln 2</span>.</p>

        <h3>Ejercicios de práctica propuestos del folleto (con soluciones detalladas)</h3>

        <p><strong>Ejercicio 1: Transformación sobre dominio triangular acotado (Propuesto 31 de Semana 07, pág. 11)</strong><br>
        Calcule la integral doble:<br>
        <span class="math-text">∬<sub><i>R</i></sub> <i>e</i><sup><span class="math-fraction"><span><i>y</i> − <i>x</i></span><span><i>y</i> + <i>x</i></span></span></sup> <i>dA</i></span>,<br>
        donde <span class="math-text"><i>R</i></span> es la región triangular limitada por <span class="math-text"><i>x</i> + <i>y</i> = 2</span>, <span class="math-text"><i>x</i> ≥ 0</span> e <span class="math-text"><i>y</i> ≥ 0</span>.<br>
        • <em>Solución explicada:</em><br>
        1) <strong>Cambio de variable:</strong> Siguiendo la sugerencia del profesor, hacemos <span class="math-text"><i>u</i> = <i>y</i> − <i>x</i></span> y <span class="math-text"><i>v</i> = <i>y</i> + <i>x</i></span>.<br>
        Despejando: <span class="math-text"><i>x</i> = <span class="math-fraction"><span><i>v</i> − <i>u</i></span><span>2</span></span></span>, <span class="math-text"><i>y</i> = <span class="math-fraction"><span><i>u</i> + <i>v</i></span><span>2</span></span></span>. El Jacobiano es <span class="math-text">|<i>J</i>| = <span class="math-fraction"><span>1</span><span>2</span></span></span>.<br>
        2) <strong>Límites transformados:</strong><br>
        - <span class="math-text"><i>x</i> ≥ 0 ⇒ <i>v</i> − <i>u</i> ≥ 0 ⇒ <i>u</i> ≤ <i>v</i></span>.<br>
        - <span class="math-text"><i>y</i> ≥ 0 ⇒ <i>u</i> + <i>v</i> ≥ 0 ⇒ <i>u</i> ≥ −<i>v</i></span>.<br>
        Por consiguiente: <span class="math-text">−<i>v</i> ≤ <i>u</i> ≤ <i>v</i></span>.<br>
        - La recta <span class="math-text"><i>x</i> + <i>y</i> = 2</span> se convierte en <span class="math-text"><i>v</i> = 2</span>, con cota inferior <span class="math-text"><i>v</i> = 0</span> (vértice en el origen). Por tanto: <span class="math-text">0 ≤ <i>v</i> ≤ 2</span>.<br>
        3) <strong>Evaluación analítica:</strong><br>
        <span class="math-text">∬<sub><i>R</i></sub> <i>e</i><sup>(<i>y</i>−<i>x</i>)/(<i>y</i>+<i>x</i>)</sup> <i>dA</i> = ∫₀² [ ∫<sub>−<i>v</i></sub><sup><i>v</i></sup> <i>e</i><sup><i>u</i>/<i>v</i></sup> · <span class="math-fraction"><span>1</span><span>2</span></span> <i>du</i> ] <i>dv</i></span>.<br>
        Evaluamos la integral interior respecto a <span class="math-text"><i>u</i></span>:<br>
        <span class="math-text">∫<sub>−<i>v</i></sub><sup><i>v</i></sup> <i>e</i><sup><i>u</i>/<i>v</i></sup> <i>du</i> = [ <i>v e</i><sup><i>u</i>/<i>v</i></sup> ]<sub>−<i>v</i></sub><sup><i>v</i></sup> = <i>v</i> ( <i>e</i><sup><i>v</i>/<i>v</i></sup> − <i>e</i><sup>−<i>v</i>/<i>v</i></sup> ) = <i>v</i> ( <i>e</i>¹ − <i>e</i><sup>−1</sup> )</span>.<br>
        Sustituyendo en la integral exterior:<br>
        <span class="math-text"><span class="math-fraction"><span>1</span><span>2</span></span> ( <i>e</i> − <i>e</i><sup>−1</sup> ) ∫₀² <i>v</i> <i>dv</i> = <span class="math-fraction"><span><i>e</i> − <i>e</i><sup>−1</sup></span><span>2</span></span> [ <span class="math-fraction"><span><i>v</i>²</span><span>2</span></span> ]₀² = <span class="math-fraction"><span><i>e</i> − <i>e</i><sup>−1</sup></span><span>2</span></span> · 2 = <i>e</i> − <i>e</i><sup>−1</sup> = <span class="math-fraction"><span><i>e</i>² − 1</span><span><i>e</i></span></span></span>.<br>
        El valor exacto de la integral es <span class="math-text"><span class="math-fraction"><span><i>e</i>² − 1</span><span><i>e</i></span></span></span>.</p>

        <p><strong>Ejercicio 2: Transformación afín sobre paralelogramo oblicuo</strong><br>
        Evaluar <span class="math-text">∬<sub><i>R</i></sub> (<i>x</i> + 2<i>y</i>) <i>dA</i></span>, donde <span class="math-text"><i>R</i></span> es el paralelogramo limitado por <span class="math-text"><i>x</i> − <i>y</i> = 0</span>, <span class="math-text"><i>x</i> − <i>y</i> = 2</span>, <span class="math-text">2<i>x</i> + <i>y</i> = 1</span> y <span class="math-text">2<i>x</i> + <i>y</i> = 4</span>.<br>
        • <em>Solución explicada:</em><br>
        1) Definimos <span class="math-text"><i>u</i> = <i>x</i> − <i>y</i></span> y <span class="math-text"><i>v</i> = 2<i>x</i> + <i>y</i></span>, con límites <span class="math-text">0 ≤ <i>u</i> ≤ 2</span> y <span class="math-text">1 ≤ <i>v</i> ≤ 4</span>.<br>
        2) El Jacobiano inverso es <span class="math-text"><span class="math-fraction"><span>∂(<i>u</i>, <i>v</i>)</span><span>∂(<i>x</i>, <i>y</i>)</span></span> = (1)(1) − (−1)(2) = 3 ⇒ |<i>J</i>| = <span class="math-fraction"><span>1</span><span>3</span></span></span>.<br>
        3) Sumando el sistema se obtiene <span class="math-text"><i>x</i> = <span class="math-fraction"><span><i>u</i> + <i>v</i></span><span>3</span></span></span> e <span class="math-text"><i>y</i> = <span class="math-fraction"><span><i>v</i> − 2<i>u</i></span><span>3</span></span></span>, de modo que <span class="math-text"><i>x</i> + 2<i>y</i> = <i>v</i> − <i>u</i></span>.<br>
        4) Evaluación:<br>
        <span class="math-text"><span class="math-fraction"><span>1</span><span>3</span></span> ∫₁⁴ [ ∫₀² (<i>v</i> − <i>u</i>) <i>du</i> ] <i>dv</i> = <span class="math-fraction"><span>1</span><span>3</span></span> ∫₁⁴ [ 2<i>v</i> − 2 ] <i>dv</i> = <span class="math-fraction"><span>1</span><span>3</span></span> [ <i>v</i>² − 2<i>v</i> ]₁⁴ = <span class="math-fraction"><span>1</span><span>3</span></span> ( 8 − (−1) ) = <span class="math-fraction"><span>9</span><span>3</span></span> = 3</span>.</p>`
    },
    {
      title: 'Coordenadas polares',
      content: `<p class="lesson-lead">Las coordenadas polares constituyen la aplicación más recurrente y fundamental del cambio de variables en dos dimensiones. Permiten describir con notable elegancia geométrica regiones dotadas de simetría radial o angular, tales como círculos, sectores angulares, coronas circulares y curvas polares clásicas (cardioides, lemniscatas y rosas). El paso del plano cartesiano al plano polar reemplaza el elemento de área cartesiano <i>dx dy</i> por el factor métrico <i>r dr dθ</i>, simplificando expresiones que involucran la suma cuadrática <i>x</i>² + <i>y</i>² al transformarla directamente en <i>r</i>².</p>

        <h2>Coordenadas polares e integrales dobles</h2>

        <h3>Definición formal y deducción del factor de escala diferencial r</h3>
        <p>De acuerdo con el folleto <em>Semana 07.pdf</em> (pág. 4) del profesor David Chávez, la correspondencia entre coordenadas cartesianas <span class="math-text">(<i>x</i>, <i>y</i>)</span> y polares <span class="math-text">(<i>r</i>, <i>θ</i>)</span> se establece mediante:</p>
        <p><span class="math-text"><i>x</i> = <i>r</i> cos <i>θ</i>, &nbsp;&nbsp; <i>y</i> = <i>r</i> sen <i>θ</i></span>, &nbsp;&nbsp;con <span class="math-text"><i>r</i> ≥ 0</span> &nbsp;y&nbsp; <span class="math-text"><i>θ</i> ∈ [0, 2<i>π</i>]</span>.</p>
        <p>A partir de estas ecuaciones se deducen las identidades fundamentales:<br>
        <span class="math-text"><i>x</i>² + <i>y</i>² = <i>r</i>² cos² <i>θ</i> + <i>r</i>² sen² <i>θ</i> = <i>r</i>²</span>, &nbsp;&nbsp;<span class="math-text">tan <i>θ</i> = <span class="math-fraction"><span><i>y</i></span><span><i>x</i></span></span></span>, &nbsp;&nbsp;<span class="math-text">cos <i>θ</i> = <span class="math-fraction"><span><i>x</i></span><span><i>r</i></span></span></span>, &nbsp;&nbsp;<span class="math-text">sen <i>θ</i> = <span class="math-fraction"><span><i>y</i></span><span><i>r</i></span></span></span>.<br>
        El profesor destaca: <em>«La presencia de la expresión x² + y² en un integrando o en la descripción de la región de integración sugiere el uso de coordenadas polares, ya que se sustituye por r², que es mucho más simple»</em>.</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Deducción analítica del Jacobiano polar y factor de área</strong></div>
          <p>Calculamos el determinante Jacobiano de la transformación cartesiana a polar:<br>
          <span class="math-text"><i>J</i>(<i>r</i>, <i>θ</i>) = <span class="math-fraction"><span>∂(<i>x</i>, <i>y</i>)</span><span>∂(<i>r</i>, <i>θ</i>)</span></span> = | <span class="math-fraction"><span>∂<i>x</i></span><span>∂<i>r</i></span></span> &nbsp; <span class="math-fraction"><span>∂<i>x</i></span><span>∂<i>θ</i></span></span> ; &nbsp; <span class="math-fraction"><span>∂<i>y</i></span><span>∂<i>r</i></span></span> &nbsp; <span class="math-fraction"><span>∂<i>y</i></span><span>∂<i>θ</i></span></span> | = | cos <i>θ</i> &nbsp; −<i>r</i> sen <i>θ</i> ; &nbsp; sen <i>θ</i> &nbsp; <i>r</i> cos <i>θ</i> |</span>.<br>
          Desarrollando el determinante 2×2:<br>
          <span class="math-text"><i>J</i>(<i>r</i>, <i>θ</i>) = (cos <i>θ</i>)(<i>r</i> cos <i>θ</i>) − (−<i>r</i> sen <i>θ</i>)(sen <i>θ</i>) = <i>r</i> cos² <i>θ</i> + <i>r</i> sen² <i>θ</i> = <i>r</i> (cos² <i>θ</i> + sen² <i>θ</i>) = <i>r</i></span>.</p>
          <p>Dado que el radio <span class="math-text"><i>r</i> ≥ 0</span>, su valor absoluto coincide con el radio mismo: <span class="math-text">|<i>J</i>(<i>r</i>, <i>θ</i>)| = <i>r</i></span>.<br>
          Por lo tanto, el diferencial de área polar es:<br>
          <span class="math-text"><i>dA</i> = <i>dx dy</i> = <i>r</i> <i>dr dθ</i></span>.</p>
          <p>• <em>Interpretación geométrica del factor r:</em><br>
          Un sector infinitesimal de corona circular entre radios <span class="math-text"><i>r</i></span> y <span class="math-text"><i>r</i> + Δ<i>r</i></span> y ángulos <span class="math-text"><i>θ</i></span> y <span class="math-text"><i>θ</i> + Δ<i>θ</i></span> tiene una longitud radial de <span class="math-text">Δ<i>r</i></span> y un ancho de arco circular igual a <span class="math-text"><i>r</i> Δ<i>θ</i></span>. Su área geométrica elemental es el producto de ambas dimensiones: <span class="math-text">Δ<i>A</i> ≈ <i>r</i> Δ<i>r</i> Δ<i>θ</i></span>. Olvidar el factor <span class="math-text"><i>r</i></span> distorsiona por completo las escalas de medida.</p>
        </div>

        <h3>Clasificación de regiones en el plano polar</h3>
        <p>De acuerdo con la clasificación del folleto <em>Semana 07.pdf</em> (pág. 5):</p>
        <p>1. <strong>Región radialmente simple:</strong> Se describe entre dos rayos fijos <span class="math-text"><i>α</i> ≤ <i>θ</i> ≤ <i>β</i></span>, acotada por dos funciones radiales continuas <span class="math-text"><i>g</i>₁(<i>θ</i>) ≤ <i>r</i> ≤ <i>g</i>₂(<i>θ</i>)</span>:<br>
        <span class="math-text">∬<sub><i>R</i></sub> <i>f</i>(<i>x</i>, <i>y</i>) <i>dA</i> = ∫<sub><i>α</i></sub><sup><i>β</i></sup> [ ∫<sub><i>g</i>₁(<i>θ</i>)</sub><sup><i>g</i>₂(<i>θ</i>)</sup> <i>f</i>(<i>r</i> cos <i>θ</i>, <i>r</i> sen <i>θ</i>) <i>r</i> <i>dr</i> ] <i>dθ</i></span>.<br>
        2. <strong>Región angularmente simple:</strong> Se describe entre dos radios concéntricos <span class="math-text"><i>a</i> ≤ <i>r</i> ≤ <i>b</i></span>, acotada por dos funciones angulares <span class="math-text"><i>h</i>₁(<i>r</i>) ≤ <i>θ</i> ≤ <i>h</i>₂(<i>r</i>)</span>:<br>
        <span class="math-text">∬<sub><i>R</i></sub> <i>f</i>(<i>x</i>, <i>y</i>) <i>dA</i> = ∫<sub><i>a</i></sub><sup><i>b</i></sup> [ ∫<sub><i>h</i>₁(<i>r</i>)</sub><sup><i>h</i>₂(<i>r</i>)</sup> <i>f</i>(<i>r</i> cos <i>θ</i>, <i>r</i> sen <i>θ</i>) <i>r</i> <i>dθ</i> ] <i>dr</i></span>.</p>

        <h3>Ejemplos resueltos del folleto (paso a paso)</h3>

        <p><strong>Ejemplo 1: Región radialmente simple entre circunferencias descentradas (Ejemplo 1 de Semana 07, págs. 5-6)</strong><br>
        Evalúe <span class="math-text">∬<sub><i>R</i></sub> <i>dA</i></span>, si <span class="math-text"><i>R</i></span> es la región plana limitada por <span class="math-text"><i>x</i>² + <i>y</i>² = 2<i>x</i></span>, <span class="math-text"><i>x</i>² + <i>y</i>² = 4<i>x</i></span>, <span class="math-text"><i>y</i> = <i>x</i></span> y <span class="math-text"><i>y</i> = 0</span>.<br>
        • <em>Solución paso a paso:</em><br>
        1) <strong>Transformación de las ecuaciones a coordenadas polares:</strong><br>
        - Para el círculo interior: <span class="math-text"><i>x</i>² + <i>y</i>² = 2<i>x</i> ⇒ <i>r</i>² = 2<i>r</i> cos <i>θ</i> ⇒ <i>r</i> = 2 cos <i>θ</i></span>.<br>
        - Para el círculo exterior: <span class="math-text"><i>x</i>² + <i>y</i>² = 4<i>x</i> ⇒ <i>r</i>² = 4<i>r</i> cos <i>θ</i> ⇒ <i>r</i> = 4 cos <i>θ</i></span>.<br>
        - Para la recta <span class="math-text"><i>y</i> = <i>x</i></span>: <span class="math-text"><i>r</i> sen <i>θ</i> = <i>r</i> cos <i>θ</i> ⇒ tan <i>θ</i> = 1 ⇒ <i>θ</i> = <span class="math-fraction"><span><i>π</i></span><span>4</span></span></span>.<br>
        - Para la recta <span class="math-text"><i>y</i> = 0</span>: el semieje positivo de las abscisas corresponde a <span class="math-text"><i>θ</i> = 0</span>.<br>
        2) <strong>Descripción como región radialmente simple:</strong><br>
        <span class="math-text">0 ≤ <i>θ</i> ≤ <span class="math-fraction"><span><i>π</i></span><span>4</span></span>, &nbsp;&nbsp; 2 cos <i>θ</i> ≤ <i>r</i> ≤ 4 cos <i>θ</i></span>.<br>
        3) <strong>Evaluación iterada:</strong><br>
        <span class="math-text">∬<sub><i>R</i></sub> <i>dA</i> = ∫₀<sup><i>π</i>/4</sup> [ ∫<sub>2 cos <i>θ</i></sub><sup>4 cos <i>θ</i></sup> <i>r</i> <i>dr</i> ] <i>dθ</i> = ∫₀<sup><i>π</i>/4</sup> [ <span class="math-fraction"><span><i>r</i>²</span><span>2</span></span> ]<sub>2 cos <i>θ</i></sub><sup>4 cos <i>θ</i></sup> <i>dθ</i></span>.<br>
        Evaluando los límites en <span class="math-text"><i>r</i></span>:<br>
        <span class="math-text"><span class="math-fraction"><span>(4 cos <i>θ</i>)² − (2 cos <i>θ</i>)²</span><span>2</span></span> = <span class="math-fraction"><span>16 cos² <i>θ</i> − 4 cos² <i>θ</i></span><span>2</span></span> = <span class="math-fraction"><span>12 cos² <i>θ</i></span><span>2</span></span> = 6 cos² <i>θ</i></span>.<br>
        Integrando respecto a <span class="math-text"><i>θ</i></span> usando la identidad <span class="math-text">cos² <i>θ</i> = <span class="math-fraction"><span>1 + cos(2<i>θ</i>)</span><span>2</span></span></span>:<br>
        <span class="math-text">6 ∫₀<sup><i>π</i>/4</sup> <span class="math-fraction"><span>1 + cos(2<i>θ</i>)</span><span>2</span></span> <i>dθ</i> = 3 [ <i>θ</i> + <span class="math-fraction"><span>sen(2<i>θ</i>)</span><span>2</span></span> ]₀<sup><i>π</i>/4</sup> = 3 ( <span class="math-fraction"><span><i>π</i></span><span>4</span></span> + <span class="math-fraction"><span>sen(<i>π</i>/2)</span><span>2</span></span> − 0 ) = 3 ( <span class="math-fraction"><span><i>π</i></span><span>4</span></span> + <span class="math-fraction"><span>1</span><span>2</span></span> ) = <span class="math-fraction"><span>3<i>π</i></span><span>4</span></span> + <span class="math-fraction"><span>3</span><span>2</span></span></span>.<br>
        El valor exacto de la integral es <span class="math-text"><span class="math-fraction"><span>3<i>π</i></span><span>4</span></span> + <span class="math-fraction"><span>3</span><span>2</span></span></span>.</p>

        <p><strong>Ejemplo 2: Integral de radical semiesférico sobre semicírculo (Ejemplo 2 de Semana 07, pág. 6)</strong><br>
        Evalúe <span class="math-text">∬<sub><i>S</i></sub> √<span class="math-radical"><i>a</i>² − <i>x</i>² − <i>y</i>²</span> <i>dA</i></span>, si <span class="math-text"><i>S</i></span> es el semicírculo de radio <span class="math-text"><i>a</i></span> con centro en el origen para <span class="math-text"><i>x</i> ≥ 0</span>.<br>
        • <em>Solución paso a paso:</em><br>
        1) El integrando contiene <span class="math-text"><i>x</i>² + <i>y</i>² = <i>r</i>²</span>, transformándose en <span class="math-text">√<span class="math-radical"><i>a</i>² − <i>r</i>²</span></span>.<br>
        2) El semicírculo derecho <span class="math-text"><i>x</i> ≥ 0</span> abarca el rango angular <span class="math-text">−<span class="math-fraction"><span><i>π</i></span><span>2</span></span> ≤ <i>θ</i> ≤ <span class="math-fraction"><span><i>π</i></span><span>2</span></span></span> con <span class="math-text">0 ≤ <i>r</i> ≤ <i>a</i></span>.<br>
        3) Añadiendo el factor Jacobiano <span class="math-text"><i>r</i></span>:<br>
        <span class="math-text">∬<sub><i>S</i></sub> √<span class="math-radical"><i>a</i>² − <i>x</i>² − <i>y</i>²</span> <i>dA</i> = ∫<sub>−<i>π</i>/2</sub><sup><i>π</i>/2</sup> [ ∫₀<sup><i>a</i></sup> √<span class="math-radical"><i>a</i>² − <i>r</i>²</span> <i>r</i> <i>dr</i> ] <i>dθ</i></span>.<br>
        Evaluamos la integral interior por sustitución <span class="math-text"><i>w</i> = <i>a</i>² − <i>r</i>² ⇒ <i>dw</i> = −2<i>r dr</i></span>:<br>
        <span class="math-text">∫₀<sup><i>a</i></sup> (<i>a</i>² − <i>r</i>²)<sup>1/2</sup> <i>r</i> <i>dr</i> = [ −<span class="math-fraction"><span>1</span><span>3</span></span> (<i>a</i>² − <i>r</i>²)<sup>3/2</sup> ]₀<sup><i>a</i></sup> = 0 − ( −<span class="math-fraction"><span><i>a</i>³</span><span>3</span></span> ) = <span class="math-fraction"><span><i>a</i>³</span><span>3</span></span></span>.<br>
        Integrando respecto a <span class="math-text"><i>θ</i></span>:<br>
        <span class="math-text">( <span class="math-fraction"><span><i>π</i></span><span>2</span></span> − (−<span class="math-fraction"><span><i>π</i></span><span>2</span></span>) ) · <span class="math-fraction"><span><i>a</i>³</span><span>3</span></span> = <i>π</i> · <span class="math-fraction"><span><i>a</i>³</span><span>3</span></span> = <span class="math-fraction"><span><i>π a</i>³</span><span>3</span></span></span>.<br>
        El resultado analítico es <span class="math-text"><span class="math-fraction"><span><i>π a</i>³</span><span>3</span></span></span>.</p>

        <p><strong>Ejemplo 3: Área de rosa polar de 4 pétalos (Ejemplo 6 de Semana 07, pág. 8)</strong><br>
        Evalúe el área total encerrada por la rosa polar <span class="math-text"><i>r</i> = 3 sen(2<i>θ</i>)</span>.<br>
        • <em>Solución paso a paso:</em><br>
        1) <strong>Simetría de la curva:</strong> La curva posee 4 pétalos idénticos y congruentes. El pétalo situado en el primer cuadrante está acotado por <span class="math-text">0 ≤ <i>θ</i> ≤ <span class="math-fraction"><span><i>π</i></span><span>2</span></span></span> (donde <span class="math-text">sen(2<i>θ</i>) ≥ 0</span>) y <span class="math-text">0 ≤ <i>r</i> ≤ 3 sen(2<i>θ</i>)</span>.<br>
        2) Evaluamos el pétalo y multiplicamos por 4:<br>
        <span class="math-text">Área = 4 ∫₀<sup><i>π</i>/2</sup> [ ∫₀<sup>3 sen(2<i>θ</i>)</sup> <i>r</i> <i>dr</i> ] <i>dθ</i> = 4 ∫₀<sup><i>π</i>/2</sup> [ <span class="math-fraction"><span><i>r</i>²</span><span>2</span></span> ]₀<sup>3 sen(2<i>θ</i>)</sup> <i>dθ</i> = 4 ∫₀<sup><i>π</i>/2</sup> <span class="math-fraction"><span>9 sen²(2<i>θ</i>)</span><span>2</span></span> <i>dθ</i> = 18 ∫₀<sup><i>π</i>/2</sup> <span class="math-fraction"><span>1 − cos(4<i>θ</i>)</span><span>2</span></span> <i>dθ</i></span>.<br>
        <span class="math-text">= 9 [ <i>θ</i> − <span class="math-fraction"><span>sen(4<i>θ</i>)</span><span>4</span></span> ]₀<sup><i>π</i>/2</sup> = 9 ( <span class="math-fraction"><span><i>π</i></span><span>2</span></span> − 0 ) = <span class="math-fraction"><span>9<i>π</i></span><span>2</span></span></span>.<br>
        El área exacta es <span class="math-text"><span class="math-fraction"><span>9<i>π</i></span><span>2</span></span></span>.</p>

        <h3>Ejercicios de práctica propuestos del folleto (con soluciones detalladas)</h3>

        <p><strong>Ejercicio 1: Integral sobre corona circular concéntrica (Propuesto 16 de Semana 07, pág. 10)</strong><br>
        Evaluar la integral doble:<br>
        <span class="math-text">∬<sub><i>R</i></sub> √<span class="math-radical"><i>x</i>² + <i>y</i>² − 9</span> <i>dx dy</i></span>,<br>
        donde <span class="math-text"><i>R</i></span> es la corona circular situada entre <span class="math-text"><i>x</i>² + <i>y</i>² = 9</span> y <span class="math-text"><i>x</i>² + <i>y</i>² = 25</span>.<br>
        • <em>Solución explicada:</em><br>
        1) <strong>Límites polares:</strong> Los radios van desde <span class="math-text"><i>r</i>₁ = √<span class="math-radical">9</span> = 3</span> hasta <span class="math-text"><i>r</i>₂ = √<span class="math-radical">25</span> = 5</span>. El ángulo recorre la circunferencia completa: <span class="math-text">0 ≤ <i>θ</i> ≤ 2<i>π</i></span>.<br>
        2) <strong>Integrando y Jacobiano:</strong> <span class="math-text">√<span class="math-radical"><i>r</i>² − 9</span> · <i>r</i> <i>dr dθ</i></span>.<br>
        3) <strong>Evaluación:</strong><br>
        <span class="math-text">∫₀<sup>2<i>π</i></sup> <i>dθ</i> · ∫₃⁵ √<span class="math-radical"><i>r</i>² − 9</span> <i>r</i> <i>dr</i> = 2<i>π</i> [ <span class="math-fraction"><span>1</span><span>3</span></span> (<i>r</i>² − 9)<sup>3/2</sup> ]₃⁵ = <span class="math-fraction"><span>2<i>π</i></span><span>3</span></span> ( (25 − 9)<sup>3/2</sup> − (9 − 9)<sup>3/2</sup> )</span>.<br>
        Como <span class="math-text">16<sup>3/2</sup> = (√<span class="math-radical">16</span>)³ = 4³ = 64</span>:<br>
        <span class="math-text"><span class="math-fraction"><span>2<i>π</i></span><span>3</span></span> (64) = <span class="math-fraction"><span>128<i>π</i></span><span>3</span></span></span>.<br>
        El resultado exacto es <span class="math-text"><span class="math-fraction"><span>128<i>π</i></span><span>3</span></span></span>.</p>

        <p><strong>Ejercicio 2: Integral gaussiana en el disco unitario (Propuesto 19/30 de Semana 07, págs. 10-11)</strong><br>
        Evaluar <span class="math-text">∬<sub><i>D</i></sub> <i>e</i><sup>−(<i>x</i>² + <i>y</i>²)</sup> <i>dA</i></span>, donde <span class="math-text"><i>D</i></span> es el interior del círculo unitario <span class="math-text"><i>x</i>² + <i>y</i>² ≤ 1</span>.<br>
        • <em>Solución explicada:</em><br>
        1) En polares: <span class="math-text">0 ≤ <i>θ</i> ≤ 2<i>π</i></span> y <span class="math-text">0 ≤ <i>r</i> ≤ 1</span> con integrando <span class="math-text"><i>e</i><sup>−<i>r</i>²</sup> <i>r</i> <i>dr dθ</i></span>.<br>
        2) Desacoplando variables:<br>
        <span class="math-text">( ∫₀<sup>2<i>π</i></sup> <i>dθ</i> ) · ( ∫₀¹ <i>e</i><sup>−<i>r</i>²</sup> <i>r</i> <i>dr</i> ) = 2<i>π</i> [ −<span class="math-fraction"><span>1</span><span>2</span></span> <i>e</i><sup>−<i>r</i>²</sup> ]₀¹ = 2<i>π</i> ( −<span class="math-fraction"><span><i>e</i><sup>−1</sup></span><span>2</span></span> − ( −<span class="math-fraction"><span>1</span><span>2</span></span> ) ) = <i>π</i> ( 1 − <i>e</i><sup>−1</sup> ) = <span class="math-fraction"><span><i>π</i>(<i>e</i> − 1)</span><span><i>e</i></span></span></span>.</p>`
    },
    {
      title: 'Coordenadas elípticas y transformaciones lineales',
      content: `<p class="lesson-lead">Cuando las regiones de integración presentan geometrías elípticas u oblicuas en lugar de circulares o rectangulares, las coordenadas polares estándar no logran desacoplar los límites de integración de manera óptima. Para superar este desafío analítico, se introducen las coordenadas elípticas generalizadas y las transformaciones lineales afines. Estas técnicas normalizan las escalas en cada eje coordenado mediante coeficientes de distorsión lineal, produciendo factores de área proporcionales al producto de semiejes <i>ab r dr dθ</i> o al determinante de la matriz de transformación |det(<i>T</i>)| <i>du dv</i>.</p>

        <h2>Coordenadas elípticas y transformaciones lineales</h2>

        <h3>Coordenadas elípticas generalizadas y deducción del factor ab·r</h3>
        <p>De acuerdo con el folleto <em>Semana 07.pdf</em> (págs. 6-7) del profesor David Chávez, para una región limitada por una elipse canónica de semiejes <span class="math-text"><i>a</i> > 0</span> y <span class="math-text"><i>b</i> > 0</span> con ecuación <span class="math-text"><span class="math-fraction"><span><i>x</i>²</span><span><i>a</i>²</span></span> + <span class="math-fraction"><span><i>y</i>²</span><span><i>b</i>²</span></span> ≤ 1</span>, se introducen las coordenadas elípticas:</p>
        <p><span class="math-text"><i>x</i> = <i>a r</i> cos <i>θ</i>, &nbsp;&nbsp; <i>y</i> = <i>b r</i> sen <i>θ</i></span>, &nbsp;&nbsp;con <span class="math-text">0 ≤ <i>r</i> ≤ 1</span> &nbsp;y&nbsp; <span class="math-text">0 ≤ <i>θ</i> ≤ 2<i>π</i></span>.</p>
        <p>Al sustituir en la ecuación de la elipse, se simplifica inmediatamente:<br>
        <span class="math-text"><span class="math-fraction"><span>(<i>a r</i> cos <i>θ</i>)²</span><span><i>a</i>²</span></span> + <span class="math-fraction"><span>(<i>b r</i> sen <i>θ</i>)²</span><span><i>b</i>²</span></span> = <i>r</i>² cos² <i>θ</i> + <i>r</i>² sen² <i>θ</i> = <i>r</i>² (cos² <i>θ</i> + sen² <i>θ</i>) = <i>r</i>² ≤ 1 ⇒ 0 ≤ <i>r</i> ≤ 1</span>.<br>
        La frontera elíptica queda reducida a un rectángulo polar estándar en el plano <span class="math-text">(<i>r</i>, <i>θ</i>)</span>.</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Deducción analítica del Jacobiano elíptico</strong></div>
          <p>Calculamos el determinante Jacobiano de la transformación elíptica generalizada:<br>
          <span class="math-text"><i>J</i>(<i>r</i>, <i>θ</i>) = <span class="math-fraction"><span>∂(<i>x</i>, <i>y</i>)</span><span>∂(<i>r</i>, <i>θ</i>)</span></span> = | <span class="math-fraction"><span>∂<i>x</i></span><span>∂<i>r</i></span></span> &nbsp; <span class="math-fraction"><span>∂<i>x</i></span><span>∂<i>θ</i></span></span> ; &nbsp; <span class="math-fraction"><span>∂<i>y</i></span><span>∂<i>r</i></span></span> &nbsp; <span class="math-fraction"><span>∂<i>y</i></span><span>∂<i>θ</i></span></span> | = | <i>a</i> cos <i>θ</i> &nbsp; −<i>a r</i> sen <i>θ</i> ; &nbsp; <i>b</i> sen <i>θ</i> &nbsp; <i>b r</i> cos <i>θ</i> |</span>.<br>
          Desarrollando el determinante:<br>
          <span class="math-text"><i>J</i>(<i>r</i>, <i>θ</i>) = (<i>a</i> cos <i>θ</i>)(<i>b r</i> cos <i>θ</i>) − (−<i>a r</i> sen <i>θ</i>)(<i>b</i> sen <i>θ</i>) = <i>a b r</i> cos² <i>θ</i> + <i>a b r</i> sen² <i>θ</i> = <i>a b r</i> (cos² <i>θ</i> + sen² <i>θ</i>) = <i>a b r</i></span>.</p>
          <p>Dado que los semiejes y el radio son positivos (<span class="math-text"><i>a</i> > 0, <i>b</i> > 0, <i>r</i> ≥ 0</span>), el valor absoluto es <span class="math-text">|<i>J</i>(<i>r</i>, <i>θ</i>)| = <i>a b r</i></span>.<br>
          Por lo tanto, el elemento diferencial de área elíptico es:<br>
          <span class="math-text"><i>dA</i> = <i>dx dy</i> = <i>a b r</i> <i>dr dθ</i></span>.</p>
          <p>• <em>Cálculo directo del área elíptica:</em><br>
          <span class="math-text">Área(Elipse) = ∬<sub><i>S</i></sub> <i>dA</i> = ∫₀<sup>2<i>π</i></sup> [ ∫₀¹ <i>a b r</i> <i>dr</i> ] <i>dθ</i> = (2<i>π</i>)(<i>a b</i>) [ <span class="math-fraction"><span><i>r</i>²</span><span>2</span></span> ]₀¹ = <i>π a b</i></span>.</p>
        </div>

        <h3>Transformaciones lineales afines y geometría de paralelogramos</h3>
        <p>Una transformación lineal afín del plano viene dada por una matriz invertible 2×2:<br>
        <span class="math-text">( <i>x</i> ; <i>y</i> ) = [ <i>A</i> &nbsp; <i>B</i> ; <i>C</i> &nbsp; <i>D</i> ] ( <i>u</i> ; <i>v</i> ) ⇒ <i>x</i> = <i>A u</i> + <i>B v</i>, &nbsp;&nbsp; <i>y</i> = <i>C u</i> + <i>D v</i></span>.<br>
        El Jacobiano es constante en todo punto del plano:<br>
        <span class="math-text"><i>J</i> = | <i>A</i> &nbsp; <i>B</i> ; <i>C</i> &nbsp; <i>D</i> | = <i>A D</i> − <i>B C</i> = det(<i>T</i>) ⇒ <i>dA</i> = |det(<i>T</i>)| <i>du dv</i></span>.</p>
        <p><strong>Propiedad geométrica fundamental:</strong> Las transformaciones lineales preservan el paralelismo entre rectas. Por ende, cualquier paralelogramo con lados no paralelos a los ejes coordenados en el plano <span class="math-text"><i>XY</i></span> puede transformarse en un rectángulo estándar con lados paralelos a los ejes en el plano <span class="math-text"><i>UV</i></span>, eliminando la necesidad de particionar el dominio.</p>

        <h3>Ejemplos resueltos del folleto (paso a paso)</h3>

        <p><strong>Ejemplo 1: Hemisferio superior sobre dominio elíptico (Ejemplo 3 de Semana 07, págs. 6-7)</strong><br>
        Calcular la integral doble:<br>
        <span class="math-text">∬<sub><i>S</i></sub> √<span class="math-radical">1 − <span class="math-fraction"><span><i>x</i>²</span><span><i>a</i>²</span></span> − <span class="math-fraction"><span><i>y</i>²</span><span><i>b</i>²</span></span></span> <i>dA</i></span>,<br>
        donde <span class="math-text"><i>S</i></span> es la región plana limitada por la elipse <span class="math-text"><span class="math-fraction"><span><i>x</i>²</span><span><i>a</i>²</span></span> + <span class="math-fraction"><span><i>y</i>²</span><span><i>b</i>²</span></span> ≤ 1</span>.<br>
        • <em>Solución paso a paso:</em><br>
        1) <strong>Cambio a coordenadas elípticas generalizadas:</strong><br>
        Hacemos <span class="math-text"><i>x</i> = <i>a r</i> cos <i>θ</i></span> e <span class="math-text"><i>y</i> = <i>b r</i> sen <i>θ</i></span>.<br>
        El integrando se reduce a:<br>
        <span class="math-text">√<span class="math-radical">1 − ( <span class="math-fraction"><span><i>a</i>² <i>r</i>² cos² <i>θ</i></span><span><i>a</i>²</span></span> + <span class="math-fraction"><span><i>b</i>² <i>r</i>² sen² <i>θ</i></span><span><i>b</i>²</span></span> )</span> = √<span class="math-radical">1 − <i>r</i>²</span></span>.<br>
        2) <strong>Límites y diferencial de área:</strong><br>
        La elipse completa se describe con <span class="math-text">0 ≤ <i>r</i> ≤ 1</span> y <span class="math-text">0 ≤ <i>θ</i> ≤ 2<i>π</i></span>.<br>
        El diferencial de área transformado es <span class="math-text"><i>dA</i> = <i>a b r</i> <i>dr dθ</i></span>.<br>
        3) <strong>Evaluación iterada:</strong><br>
        <span class="math-text">∬<sub><i>S</i></sub> √<span class="math-radical">1 − <span class="math-fraction"><span><i>x</i>²</span><span><i>a</i>²</span></span> − <span class="math-fraction"><span><i>y</i>²</span><span><i>b</i>²</span></span></span> <i>dA</i> = ∫₀<sup>2<i>π</i></sup> [ ∫₀¹ √<span class="math-radical">1 − <i>r</i>²</span> · <i>a b r</i> <i>dr</i> ] <i>dθ</i></span>.<br>
        Calculamos la integral radial usando la sustitución <span class="math-text"><i>u</i> = 1 − <i>r</i>² ⇒ <i>du</i> = −2<i>r dr</i></span>:<br>
        <span class="math-text"><i>a b</i> ∫₀¹ (1 − <i>r</i>²)<sup>1/2</sup> <i>r</i> <i>dr</i> = <i>a b</i> [ −<span class="math-fraction"><span>1</span><span>3</span></span> (1 − <i>r</i>²)<sup>3/2</sup> ]₀¹ = <i>a b</i> ( 0 − ( −<span class="math-fraction"><span>1</span><span>3</span></span> ) ) = <span class="math-fraction"><span><i>a b</i></span><span>3</span></span></span>.<br>
        Integrando respecto a <span class="math-text"><i>θ</i></span>:<br>
        <span class="math-text">∫₀<sup>2<i>π</i></sup> <span class="math-fraction"><span><i>a b</i></span><span>3</span></span> <i>dθ</i> = <span class="math-fraction"><span><i>a b</i></span><span>3</span></span> (2<i>π</i>) = <span class="math-fraction"><span>2<i>π a b</i></span><span>3</span></span></span>.<br>
        El resultado exacto es <span class="math-text"><span class="math-fraction"><span>2<i>π a b</i></span><span>3</span></span></span>.</p>

        <p><strong>Ejemplo 2: Dilatación elíptica y traslación en disco descentrado (Ejemplo 8 de Semana 07, págs. 9-10)</strong><br>
        Evalúe la integral doble <span class="math-text">∬<sub><i>R</i></sub> √<span class="math-radical">64 − 4<i>x</i>² − 4<i>y</i>²</span> <i>dA</i></span>, donde <span class="math-text"><i>R</i></span> es el disco circular <span class="math-text"><i>x</i>² + (<i>y</i> − 2)² ≤ 4</span>.<br>
        • <em>Solución paso a paso:</em><br>
        1) Desarrollando la ecuación del círculo: <span class="math-text"><i>x</i>² + <i>y</i>² − 4<i>y</i> ≤ 0</span>.<br>
        2) El profesor Chávez propone la variante polar escalada: <span class="math-text"><i>x</i> = 2<i>r</i> cos <i>θ</i>, &nbsp; <i>y</i> = 2<i>r</i> sen <i>θ</i></span>.<br>
        El integrando se factoriza como:<br>
        <span class="math-text">√<span class="math-radical">64 − 4(4<i>r</i>²)</span> = √<span class="math-radical">64 − 16<i>r</i>²</span> = √<span class="math-radical">16(4 − <i>r</i>²)</span> = 8 √<span class="math-radical">1 − <i>r</i>²</span></span> (con escala unitaria).<br>
        Sustituyendo en la frontera del disco: <span class="math-text">4<i>r</i>² − 8<i>r</i> sen <i>θ</i> ≤ 0 ⇒ <i>r</i> ≤ sen <i>θ</i></span> con <span class="math-text">0 ≤ <i>θ</i> ≤ <i>π</i></span>.<br>
        3) El Jacobiano para este cambio escalado resulta <span class="math-text"><i>J</i> = 16<i>r</i></span>.<br>
        4) Evaluación:<br>
        <span class="math-text">16 ∫₀<sup><i>π</i></sup> [ ∫₀<sup>sen <i>θ</i></sup> 8 √<span class="math-radical">1 − <i>r</i>²</span> <i>r</i> <i>dr</i> ] <i>dθ</i> = 128 ∫₀<sup><i>π</i></sup> [ −<span class="math-fraction"><span>1</span><span>3</span></span> (1 − <i>r</i>²)<sup>3/2</sup> ]₀<sup>sen <i>θ</i></sup> <i>dθ</i> = <span class="math-fraction"><span>128</span><span>3</span></span> ∫₀<sup><i>π</i></sup> ( 1 − |cos <i>θ</i>|³ ) <i>dθ</i></span>.<br>
        Integrando por simetría respecto a <span class="math-text"><i>π</i>/2</span>:<br>
        <span class="math-text">∫₀<sup><i>π</i></sup> |cos <i>θ</i>|³ <i>dθ</i> = 2 ∫₀<sup><i>π</i>/2</sup> cos³ <i>θ</i> <i>dθ</i> = 2 [ sen <i>θ</i> − <span class="math-fraction"><span>sen³ <i>θ</i></span><span>3</span></span> ]₀<sup><i>π</i>/2</sup> = 2 ( 1 − <span class="math-fraction"><span>1</span><span>3</span></span> ) = <span class="math-fraction"><span>4</span><span>3</span></span></span>.<br>
        Por tanto:<br>
        <span class="math-text"><span class="math-fraction"><span>128</span><span>3</span></span> ( <i>π</i> − <span class="math-fraction"><span>4</span><span>3</span></span> ) = <span class="math-fraction"><span>128<i>π</i></span><span>3</span></span> − <span class="math-fraction"><span>512</span><span>9</span></span></span>.<br>
        El valor numérico exacto coincide con el folleto: <span class="math-text"><span class="math-fraction"><span>128</span><span>3</span></span> ( <i>π</i> − <span class="math-fraction"><span>4</span><span>3</span></span> )</span>.</p>

        <h3>Ejercicios de práctica propuestos del folleto (con soluciones detalladas)</h3>

        <p><strong>Ejercicio 1: Momentos cuadráticos sobre lámina elíptica canónica</strong><br>
        Calcular la integral doble <span class="math-text">∬<sub><i>R</i></sub> (<i>x</i>² + <i>y</i>²) <i>dA</i></span>, si <span class="math-text"><i>R</i></span> es la región sólida interior a la elipse <span class="math-text"><span class="math-fraction"><span><i>x</i>²</span><span><i>a</i>²</span></span> + <span class="math-fraction"><span><i>y</i>²</span><span><i>b</i>²</span></span> ≤ 1</span>.<br>
        • <em>Solución explicada:</em><br>
        1) Aplicamos coordenadas elípticas: <span class="math-text"><i>x</i> = <i>a r</i> cos <i>θ</i>, &nbsp; <i>y</i> = <i>b r</i> sen <i>θ</i></span>, con <span class="math-text"><i>dA</i> = <i>a b r</i> <i>dr dθ</i></span>.<br>
        2) Expresamos el integrando: <span class="math-text"><i>x</i>² + <i>y</i>² = <i>r</i>² ( <i>a</i>² cos² <i>θ</i> + <i>b</i>² sen² <i>θ</i> )</span>.<br>
        3) Por la regla de producto de integrales desacopladas:<br>
        <span class="math-text">∬<sub><i>R</i></sub> (<i>x</i>² + <i>y</i>²) <i>dA</i> = ( ∫₀¹ <i>a b r</i>³ <i>dr</i> ) · ( ∫₀<sup>2<i>π</i></sup> ( <i>a</i>² cos² <i>θ</i> + <i>b</i>² sen² <i>θ</i> ) <i>dθ</i> )</span>.<br>
        - Factor radial: <span class="math-text"><i>a b</i> [ <span class="math-fraction"><span><i>r</i>⁴</span><span>4</span></span> ]₀¹ = <span class="math-fraction"><span><i>a b</i></span><span>4</span></span></span>.<br>
        - Factor angular: <span class="math-text"><i>a</i>² <i>π</i> + <i>b</i>² <i>π</i> = <i>π</i> (<i>a</i>² + <i>b</i>²)</span>.<br>
        Multiplicando ambos resultados:<br>
        <span class="math-text"><span class="math-fraction"><span><i>a b</i></span><span>4</span></span> · <i>π</i>(<i>a</i>² + <i>b</i>²) = <span class="math-fraction"><span><i>π a b</i>(<i>a</i>² + <i>b</i>²)</span><span>4</span></span></span>.</p>

        <p><strong>Ejercicio 2: Transformación afín y evaluación de paralelogramo general</strong><br>
        Evaluar <span class="math-text">∬<sub><i>R</i></sub> (<i>u</i> + <i>v</i>) <i>dA</i></span> transformado, donde <span class="math-text"><i>R</i></span> es el paralelogramo definido por <span class="math-text"><i>x</i> − 2<i>y</i> = <i>u</i> ∈ [0, 4]</span> y <span class="math-text">3<i>x</i> − <i>y</i> = <i>v</i> ∈ [1, 8]</span>.<br>
        • <em>Solución explicada:</em><br>
        1) El Jacobiano inverso es <span class="math-text"><span class="math-fraction"><span>∂(<i>u</i>, <i>v</i>)</span><span>∂(<i>x</i>, <i>y</i>)</span></span> = (1)(−1) − (−2)(3) = 5 ⇒ |<i>J</i>| = <span class="math-fraction"><span>1</span><span>5</span></span></span>.<br>
        2) La integral en el plano <span class="math-text"><i>UV</i></span> resulta:<br>
        <span class="math-text"><span class="math-fraction"><span>1</span><span>5</span></span> ∫₁⁸ [ ∫₀⁴ (<i>u</i> + <i>v</i>) <i>du</i> ] <i>dv</i> = <span class="math-fraction"><span>1</span><span>5</span></span> ∫₁⁸ [ 8 + 4<i>v</i> ] <i>dv</i> = <span class="math-fraction"><span>1</span><span>5</span></span> [ 8<i>v</i> + 2<i>v</i>² ]₁⁸ = <span class="math-fraction"><span>1</span><span>5</span></span> ( (64 + 128) − (8 + 2) ) = <span class="math-fraction"><span>182</span><span>5</span></span> = 36.4</span>.</p>`
    }
  ];

  const studyNavigation = document.body.dataset.studyNavigation;
  if (studyNavigation === 'index' || studyNavigation === 'pages') {
    window.mathverseUnit2Lessons = lessons;
    const lessonRenderer = document.createElement('script');
    lessonRenderer.src = new URL('../estudio/unidad-2/lesson-renderer.js', document.currentScript.src).href;
    lessonRenderer.onerror = () => {
      const target = document.querySelector('#lesson-content, #topics');
      if (!target) return;
      const message = document.createElement('p');
      message.setAttribute('role', 'alert');
      message.textContent = 'No se pudo cargar la vista de Unidad 2. Intenta recargar la página.';
      target.replaceChildren(message);
    };
    document.body.append(lessonRenderer);
    return;
  }

  const storageKey = 'mathverse.study.completed.u2.v1';
  const topicsList = document.getElementById('topics');
  const lessonContent = document.getElementById('lesson-content');
  const lessonCrumb = document.getElementById('lesson-crumb');
  const progressCount = document.getElementById('progress-count');
  const progressTrack = document.getElementById('progress-track');
  const progressFill = document.getElementById('progress-fill');
  const progressPercent = document.getElementById('progress-percent');
  const completeButton = document.getElementById('complete-button');
  const completionHint = document.getElementById('completion-hint');
  const position = document.getElementById('lesson-position');
  const previousButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');

  if (!topicsList || !lessonContent || !lessonCrumb || !progressCount || !progressTrack || !progressFill || !progressPercent || !completeButton || !completionHint || !position || !previousButton || !nextButton) return;

  let currentIndex = 0;
  let completed = new Set();

  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(saved)) completed = new Set(saved.filter((index) => Number.isInteger(index) && index >= 0 && index < lessons.length));
  } catch (error) {
    // The study view remains usable when browser storage is unavailable.
  }

  function saveProgress() {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(Array.from(completed)));
    } catch (error) {
      // Progress remains available for the current visit if storage is blocked.
    }
  }

  function placeholderContent(title) {
    return `<span class="lesson-sample-label">Contenido de ejemplo</span>
      <h2>${title}</h2>
      <p>Aquí va la introducción del tema: una o dos frases que expliquen qué se estudia y por qué importa dentro de la unidad.</p>
      <div class="lesson-definition"><div class="lesson-definition-title"><strong>Definición formal</strong></div><p>Aquí va la definición o el resultado principal del tema.</p></div>
      <h3>Idea principal</h3><p>Explicación del concepto con tus propias palabras y los datos del folleto.</p>
      <h3>Ejemplo resuelto</h3><p>Paso a paso de un ejercicio representativo.</p>
      <h3>Interpretación geométrica</h3><p>Qué significa el resultado visualmente.</p>`;
  }

  function renderTopics() {
    topicsList.replaceChildren();
    lessons.forEach((lesson, index) => {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'study-topic-button';
      button.setAttribute('aria-current', String(index === currentIndex));
      button.setAttribute('aria-label', `${index + 1}. ${lesson.title}${completed.has(index) ? ', completada' : ''}`);
      const number = document.createElement('span');
      number.className = 'study-topic-number';
      number.textContent = `${String(index + 1).padStart(2, '0')}`;
      const title = document.createElement('span');
      title.className = 'study-topic-title';
      title.textContent = lesson.title;
      const status = document.createElement('span');
      status.className = 'study-topic-check';
      status.setAttribute('aria-hidden', 'true');
      status.textContent = completed.has(index) ? '✓' : '';
      button.append(number, title, status);
      button.addEventListener('click', () => {
        currentIndex = index;
        render();
        topicsList.querySelectorAll('button')[index]?.focus();
      });
      item.append(button);
      topicsList.append(item);
    });
  }

  function renderProgress() {
    const count = completed.size;
    const percent = Math.round((count / lessons.length) * 100);
    progressCount.textContent = `${count} de ${lessons.length}`;
    progressTrack.setAttribute('aria-valuenow', String(count));
    progressFill.style.width = `${percent}%`;
    progressPercent.textContent = `${percent}% completado`;
  }

  function render() {
    const lesson = lessons[currentIndex];
    lessonCrumb.textContent = lesson.title;
    lessonContent.innerHTML = lesson.content || placeholderContent(lesson.title);
    position.textContent = `Tema ${currentIndex + 1} de ${lessons.length}`;
    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === lessons.length - 1;
    const isCompleted = completed.has(currentIndex);
    completeButton.setAttribute('aria-pressed', String(isCompleted));
    completeButton.textContent = isCompleted ? 'Marcar como pendiente' : 'Marcar como completada';
    completionHint.textContent = isCompleted ? 'Esta lección está marcada como completada.' : 'Marca esta lección cuando hayas terminado de estudiarla.';
    renderTopics();
    renderProgress();
  }

  completeButton.addEventListener('click', () => {
    if (completed.has(currentIndex)) completed.delete(currentIndex);
    else completed.add(currentIndex);
    saveProgress();
    render();
    completeButton.focus();
  });
  previousButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      render();
    }
  });
  nextButton.addEventListener('click', () => {
    if (currentIndex < lessons.length - 1) {
      currentIndex += 1;
      render();
    }
  });

  render();
})();
