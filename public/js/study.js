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
      title: 'Funciones de varias variables',
      content: `
        <h2>Funciones reales de varias variables</h2>
        <p>En el cálculo de una variable modelamos situaciones mediante funciones <span class="math-text"><i>y</i> = <i>f</i>(<i>x</i>)</span>. Sin embargo, los fenómenos físicos, geométricos y de ingeniería suelen depender de múltiples factores simultáneos (como la temperatura en un punto del espacio, el costo según varias materias primas o la altitud en un mapa). Las funciones de varias variables extienden estos conceptos a dimensiones superiores.</p>

        <h3>El espacio numérico <i>n</i>-dimensional (ℝⁿ)</h3>
        <p>Para trabajar con múltiples variables definimos formalmente el espacio donde habitan sus valores de entrada:</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Definición formal: Espacio numérico ℝⁿ</strong></div>
          <p>El conjunto de todas las <i>n</i>-adas ordenadas de números reales se denomina <strong>espacio numérico <i>n</i>-dimensional</strong> y se denota por <span class="math-text">ℝ<sup><i>n</i></sup></span>:</p>
          <p><span class="math-text">ℝ<sup><i>n</i></sup> = {(<i>x</i><sub>1</sub>, <i>x</i><sub>2</sub>, …, <i>x</i><sub><i>n</i></sub>) | <i>x</i><sub><i>i</i></sub> ∈ ℝ}</span></p>
          <p>Cada elemento <span class="math-text"><i>P</i> = (<i>x</i><sub>1</sub>, <i>x</i><sub>2</sub>, …, <i>x</i><sub><i>n</i></sub>)</span> se llama <strong>punto</strong>, y los valores <span class="math-text"><i>x</i><sub><i>i</i></sub></span> son sus <strong>coordenadas</strong>. Se establece una relación biunívoca entre los puntos del espacio y las <i>n</i>-adas ordenadas.</p>
        </div>

        <p>Geométricamente representamos los espacios de dimensiones 1, 2 y 3:</p>
        <p>• <strong>ℝ¹ (Recta numérica):</strong> Cada punto tiene una coordenada llamada <em>abscisa</em> respecto al origen 0.<br>
        • <strong>ℝ² (Plano cartesiano):</strong> Dos rectas perpendiculares determinan las coordenadas <span class="math-text">(<i>x</i>, <i>y</i>)</span>, donde <span class="math-text"><i>x</i></span> es la abscisa (distancia dirigida al eje <i>Y</i>) y <span class="math-text"><i>y</i></span> es la ordenada (distancia dirigida al eje <i>X</i>).<br>
        • <strong>ℝ³ (Espacio tridimensional):</strong> Agregamos un tercer eje perpendicular <span class="math-text"><i>Z</i></span> al plano <span class="math-text"><i>XY</i></span>. Cada punto tiene una terna ordenada <span class="math-text">(<i>x</i>, <i>y</i>, <i>z</i>)</span>: abscisa <span class="math-text"><i>x</i></span> (distancia al plano <i>YZ</i>), ordenada <span class="math-text"><i>y</i></span> (distancia al plano <i>XZ</i>) y <strong>cota</strong> <span class="math-text"><i>z</i></span> (distancia al plano <i>XY</i>). Los tres planos coordenados dividen a <span class="math-text">ℝ³</span> en ocho regiones llamadas <strong>octantes</strong>.</p>

        <h3>Función escalar de varias variables</h3>
        <p>Cuando a cada punto en un conjunto de <span class="math-text">ℝ<sup><i>n</i></sup></span> le corresponde un único valor real, tenemos una función escalar:</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Definición formal: Función escalar de <i>n</i> variables</strong><span class="math-text"><i>f</i>: <i>A</i> ⊂ ℝ<sup><i>n</i></sup> → ℝ</span></div>
          <p>Una función escalar de <i>n</i> variables reales es un conjunto de parejas ordenadas de la forma <span class="math-text">(<i>P</i>, <i>w</i>)</span> en el cual dos parejas ordenadas diferentes no tienen el mismo primer elemento, donde <span class="math-text"><i>P</i> ∈ ℝ<sup><i>n</i></sup></span> y <span class="math-text"><i>w</i> ∈ ℝ</span>.</p>
          <p>Simbólicamente escribimos <span class="math-text"><i>w</i> = <i>f</i>(<i>x</i><sub>1</sub>, <i>x</i><sub>2</sub>, …, <i>x</i><sub><i>n</i></sub>)</span> o bien <span class="math-text"><i>w</i> = <i>f</i>(<i>P</i>)</span>.</p>
        </div>

        <h3>Comprensión y roles de las variables</h3>
        <p>Para analizar una función multivariable distinguimos las variables que intervienen:</p>
        <p>• <strong>Variables independientes:</strong> Son las <span class="math-text"><i>n</i></span> entradas libres <span class="math-text">(<i>x</i><sub>1</sub>, <i>x</i><sub>2</sub>, …, <i>x</i><sub><i>n</i></sub>)</span>. En funciones de dos variables se usan usualmente <span class="math-text">(<i>x</i>, <i>y</i>)</span>, y en tres variables <span class="math-text">(<i>x</i>, <i>y</i>, <i>z</i>)</span>.<br>
        • <strong>Variable dependiente:</strong> Es la salida escalar única <span class="math-text"><i>w</i></span> (o <span class="math-text"><i>z</i></span> al trabajar con <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span>). Su valor queda determinado por el punto evaluado.<br>
        • <strong>Total de variables:</strong> Al considerar las <span class="math-text"><i>n</i></span> variables independientes más la variable dependiente, la relación involucra en total <span class="math-text">(<i>n</i> + 1)</span> variables.<br>
        • <strong>Dominio y rango:</strong> La totalidad de puntos <span class="math-text"><i>P</i></span> válidos es el <strong>dominio</strong> o campo de existencia de la función, y los posibles valores resultantes de <span class="math-text"><i>w</i></span> constituyen su <strong>rango</strong>.</p>

        <h3>Ejemplo resuelto paso a paso (Folleto Secc. 1.1)</h3>
        <p>Analizar la función de dos variables <span class="math-text"><i>z</i> = √<span class="math-radical">4 − <i>x</i>² − <i>y</i>²</span></span> identificando sus variables, su dominio, su rango y su lectura geométrica:</p>

        <p><strong>1. Identificación de variables:</strong><br>
        Las variables independientes son <span class="math-text"><i>x</i></span> e <span class="math-text"><i>y</i></span> (entradas en <span class="math-text">ℝ²</span>). La variable dependiente es <span class="math-text"><i>z</i></span> (salida en <span class="math-text">ℝ</span>). En total se relacionan <span class="math-text">2 + 1 = 3</span> variables en el espacio <span class="math-text">ℝ³</span>.</p>

        <p><strong>2. Determinación del dominio:</strong><br>
        Para que <span class="math-text"><i>z</i></span> sea un número real, la cantidad subradical no puede ser negativa:<br>
        <span class="math-text">4 − <i>x</i>² − <i>y</i>² ≥ 0 &nbsp;⟹&nbsp; <i>x</i>² + <i>y</i>² ≤ 4</span><br>
        Por tanto, el dominio es el conjunto de puntos <span class="math-text">(<i>x</i>, <i>y</i>)</span> situados sobre la circunferencia con centro en el origen y radio 2 y todos los puntos en su interior; es decir, un <strong>disco cerrado</strong> cuya frontera es la circunferencia <span class="math-text"><i>x</i>² + <i>y</i>² = 4</span>:<br>
        <span class="math-text">dom <i>f</i> = <i>A</i> = {(<i>x</i>, <i>y</i>) ∈ ℝ² | <i>x</i>² + <i>y</i>² ≤ 4}</span>.</p>

        <p><strong>3. Determinación del rango:</strong><br>
        Dado que <span class="math-text"><i>x</i>² + <i>y</i>² ≥ 0</span>, la cantidad subradical está acotada entre 0 y 4:<br>
        <span class="math-text">0 ≤ 4 − <i>x</i>² − <i>y</i>² ≤ 4</span><br>
        Extrayendo la raíz cuadrada positiva a cada miembro obtenemos:<br>
        <span class="math-text">0 ≤ <i>z</i> ≤ 2</span><br>
        Simbólicamente: <span class="math-text">rang <i>f</i> = {<i>z</i> ∈ ℝ | 0 ≤ <i>z</i> ≤ 2} = [0, 2]</span>.</p>

        <p><strong>4. Interpretación geométrica:</strong><br>
        Elevando al cuadrado con <span class="math-text"><i>z</i> ≥ 0</span> obtenemos <span class="math-text"><i>x</i>² + <i>y</i>² + <i>z</i>² = 4</span>. La gráfica corresponde a una <strong>superficie semiesférica</strong> con centro en el origen y radio 2, situada enteramente sobre el plano <span class="math-text"><i>XY</i></span>.</p>`
    },
    {
      title: 'Dominio y rango',
      content: `
        <h2>Dominio y rango de funciones de varias variables</h2>
        <p>Al estudiar funciones de varias variables, una de las primeras tareas fundamentales consiste en determinar para qué puntos del espacio la función está definida (su dominio) y qué valores numéricos puede producir como resultado (su rango o recorrido).</p>

        <h3>Diferencia conceptual entre dominio y rango</h3>
        <p>Para comprender la distinción en cálculo multivariable, consideremos la naturaleza geométrica de cada conjunto:</p>
        <p>• <strong>El Dominio (Espacio de entrada):</strong> Para una función de dos variables <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span>, el dominio habita en el plano <span class="math-text">ℝ²</span>. Es un subconjunto geométrico bidimensional (como discos, franjas, semiplanos o regiones entre curvas) que reúne todas las parejas <span class="math-text">(<i>x</i>, <i>y</i>)</span> para las cuales la función tiene sentido matemático y físico. Responde a la pregunta: <em>¿dónde podemos evaluar la función?</em><br>
        • <strong>El Rango (Espacio de salida):</strong> A diferencia del dominio, el rango es un conjunto unidimensional que habita en la recta numérica <span class="math-text">ℝ</span>. Corresponde a todos los valores posibles de la cota <span class="math-text"><i>z</i></span> (o variable dependiente <span class="math-text"><i>w</i></span>) generados al evaluar todos los puntos del dominio. Responde a la pregunta: <em>¿qué valores reales se obtienen como resultado?</em></p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Definición formal: Dominio y rango</strong><span class="math-text"><i>f</i>: <i>A</i> ⊂ ℝ<sup><i>n</i></sup> → ℝ</span></div>
          <p>Sea <span class="math-text"><i>f</i></span> una función escalar de <span class="math-text"><i>n</i></span> variables reales con regla de correspondencia <span class="math-text"><i>w</i> = <i>f</i>(<i>P</i>)</span>:</p>
          <p>• <strong>Dominio (<span class="math-text">dom <i>f</i></span>):</strong> Es el conjunto de todos los posibles puntos <span class="math-text"><i>P</i> ∈ ℝ<sup><i>n</i></sup></span> para los cuales la expresión <span class="math-text"><i>f</i>(<i>P</i>)</span> es un número real bien definido (también llamado <em>campo de existencia</em> de la función):<br>
          <span class="math-text">dom <i>f</i> = {<i>P</i> ∈ ℝ<sup><i>n</i></sup> | <i>f</i>(<i>P</i>) ∈ ℝ}</span>.</p>
          <p>• <strong>Rango (<span class="math-text">rang <i>f</i></span> o <span class="math-text">rec <i>f</i></span>):</strong> Es el conjunto de todos los valores reales que toma la variable dependiente <span class="math-text"><i>w</i></span> al recorrer <span class="math-text"><i>P</i></span> todo el dominio:<br>
          <span class="math-text">rang <i>f</i> = {<i>w</i> ∈ ℝ | <i>w</i> = <i>f</i>(<i>P</i>), <i>P</i> ∈ dom <i>f</i>}</span>.</p>
        </div>

        <h3>Reglas para determinar dominios analíticos</h3>
        <p>A menos que el contexto del problema restrinja el dominio, se asume el <em>dominio natural</em> (el mayor subconjunto donde la fórmula es válida en <span class="math-text">ℝ</span>). Para hallarlo, aplicamos las siguientes restricciones fundamentales:</p>
        <p>1. <strong>Raíces de índice par:</strong> La cantidad subradical no puede ser negativa. Si <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = √<span class="math-radical"><i>g</i>(<i>x</i>, <i>y</i>)</span></span>, exigimos:<br>
        <span class="math-text"><i>g</i>(<i>x</i>, <i>y</i>) ≥ 0</span>.</p>
        <p>2. <strong>Denominadores y cocientes:</strong> La división por cero no está permitida. Si <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = <span class="math-fraction"><span><i>g</i>(<i>x</i>, <i>y</i>)</span><span><i>h</i>(<i>x</i>, <i>y</i>)</span></span></span>, exigimos:<br>
        <span class="math-text"><i>h</i>(<i>x</i>, <i>y</i>) ≠ 0</span>.</p>
        <p>3. <strong>Funciones logarítmicas:</strong> El argumento de un logaritmo debe ser estrictamente positivo. Si <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = ln(<i>g</i>(<i>x</i>, <i>y</i>))</span>, exigimos:<br>
        <span class="math-text"><i>g</i>(<i>x</i>, <i>y</i>) &gt; 0</span>.</p>

        <h3>Ejemplo paso a paso: Dominio de <i>f</i>(<i>x</i>, <i>y</i>) = ln(1 − <i>xy</i>)</h3>
        <p>Siguiendo el desarrollo de la Sección 1.1 del folleto, analicemos la función logarítmica de dos variables:</p>

        <p><strong>Paso 1: Planteamiento analítico de la condición</strong><br>
        La función logaritmo natural solo está definida para argumentos estrictamente positivos en los reales. Por tanto:<br>
        <span class="math-text">1 − <i>xy</i> &gt; 0 &nbsp;⟹&nbsp; <i>xy</i> &lt; 1</span>.<br>
        Simbólicamente: <span class="math-text">dom <i>f</i> = {(<i>x</i>, <i>y</i>) ∈ ℝ² | <i>xy</i> &lt; 1}</span>.</p>

        <p><strong>Paso 2: Análisis por regiones y casos</strong><br>
        La ecuación frontera asociada es la hipérbola equilátera <span class="math-text"><i>xy</i> = 1</span> (o <span class="math-text"><i>y</i> = <span class="math-fraction"><span>1</span><span><i>x</i></span></span></span> con <span class="math-text"><i>x</i> ≠ 0</span>). Para determinar qué puntos satisfacen la desigualdad <span class="math-text"><i>xy</i> &lt; 1</span>, evaluamos los signos de <span class="math-text"><i>x</i></span>:<br>
        • Si <span class="math-text"><i>x</i> &gt; 0</span>: Al dividir entre <span class="math-text"><i>x</i></span> (positivo), el sentido de la desigualdad se conserva: <span class="math-text"><i>y</i> &lt; <span class="math-fraction"><span>1</span><span><i>x</i></span></span></span> (puntos situados por debajo de la rama en el primer cuadrante).<br>
        • Si <span class="math-text"><i>x</i> &lt; 0</span>: Al dividir entre <span class="math-text"><i>x</i></span> (negativo), el sentido de la desigualdad se invierte: <span class="math-text"><i>y</i> &gt; <span class="math-fraction"><span>1</span><span><i>x</i></span></span></span> (puntos situados por encima de la rama en el tercer cuadrante).<br>
        • Si <span class="math-text"><i>x</i> = 0</span>: Tenemos <span class="math-text">0 · <i>y</i> = 0 &lt; 1</span>, lo cual es verdadero para todo valor de <span class="math-text"><i>y</i> ∈ ℝ</span>. Por ende, todo el eje <span class="math-text"><i>Y</i></span> pertenece al dominio.</p>

        <p><strong>Paso 3: Interpretación geométrica</strong><br>
        El dominio corresponde a la <strong>región abierta</strong> comprendida entre las dos ramas de la hipérbola equilátera <span class="math-text"><i>xy</i> = 1</span>. Como la desigualdad es estricta (<span class="math-text">&lt;</span>), las ramas de la hipérbola forman la frontera y <em>no pertenecen</em> al dominio (se representan geométricamente con línea discontinua).</p>

        <h3>Determinación del rango: Métodos y ejemplo resuelto</h3>
        <p>Para determinar el rango no suele bastar con un simple despeje algebraico; es necesario analizar los valores extremos o el intervalo de variación que alcanza la expresión dependiente cuando las entradas recorren su dominio.</p>

        <p><strong>Ejemplo resuelto 1: Rango de <i>f</i>(<i>x</i>, <i>y</i>) = ln(1 − <i>xy</i>)</strong><br>
        Definamos el argumento auxiliar <span class="math-text"><i>u</i> = 1 − <i>xy</i></span>. Como en el dominio <span class="math-text"><i>xy</i> &lt; 1</span>, el valor de <span class="math-text"><i>xy</i></span> puede hacerse arbitrariamente cercano a 1 por la izquierda (haciendo que <span class="math-text"><i>u</i> → 0⁺</span>), y puede hacerse arbitrariamente negativo (por ejemplo si <span class="math-text"><i>x</i> → ∞</span> e <span class="math-text"><i>y</i> → −∞</span>, haciendo que <span class="math-text"><i>u</i> → +∞</span>).<br>
        Por tanto, el argumento <span class="math-text"><i>u</i></span> recorre todo el intervalo <span class="math-text">(0, ∞)</span>.<br>
        Dado que la función <span class="math-text"><i>z</i> = ln <i>u</i></span> es continua y suprayectiva sobre los números reales (<span class="math-text">ln <i>u</i> → −∞</span> cuando <span class="math-text"><i>u</i> → 0⁺</span>, y <span class="math-text">ln <i>u</i> → +∞</span> cuando <span class="math-text"><i>u</i> → +∞</span>), la variable dependiente toma todos los valores reales:<br>
        <span class="math-text">rang <i>f</i> = ℝ = (−∞, ∞)</span>.</p>

        <p><strong>Ejemplo resuelto 2: Rango por acotación subradical</strong><br>
        Para la función <span class="math-text"><i>z</i> = √<span class="math-radical"><i>x</i>² + <i>y</i>² − 1</span></span> (Ejemplo 2 del folleto):<br>
        1. Para que <span class="math-text"><i>z</i> ∈ ℝ</span>, se requiere <span class="math-text"><i>x</i>² + <i>y</i>² − 1 ≥ 0 ⟹ <i>x</i>² + <i>y</i>² ≥ 1</span>.<br>
        2. El valor mínimo del radicando es <span class="math-text">1 − 1 = 0</span> (cuando el punto está sobre la circunferencia unidad <span class="math-text"><i>x</i>² + <i>y</i>² = 1</span>).<br>
        3. A medida que nos alejamos del origen, <span class="math-text"><i>x</i>² + <i>y</i>² → ∞</span>, por lo que el radicando no tiene cota superior.<br>
        4. Al extraer la raíz cuadrada principal positiva, los valores posibles de <span class="math-text"><i>z</i></span> son:<br>
        <span class="math-text">rang <i>f</i> = [0, ∞) = {<i>z</i> ∈ ℝ | <i>z</i> ≥ 0}</span>.</p>`
    },
    {
      title: 'Superficies',
      content: `
        <h2>Gráficas de funciones multivariables y superficies en ℝ³</h2>
        <p>En el cálculo de varias variables, la representación gráfica de una función escalar de dos variables independientes <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span> ya no es una curva en el plano, sino una <strong>superficie tridimensional</strong> en el espacio numérico <span class="math-text">ℝ³</span>. De acuerdo con la Sección 1.2 del folleto del profesor David Chávez, la comprensión de estas superficies y de sus ecuaciones características constituye el soporte visual indispensable para abordar los conceptos posteriores de derivadas parciales, planos tangentes e integrales dobles.</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Definición formal: Gráfica de una función y superficie</strong><span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span></div>
          <p>Si <span class="math-text"><i>f</i></span> es una función real de dos variables, entonces la <strong>gráfica de <span class="math-text"><i>f</i></span></strong> es el conjunto de todos los puntos <span class="math-text">(<i>x</i>, <i>y</i>, <i>z</i>) ∈ ℝ³</span> para los cuales <span class="math-text">(<i>x</i>, <i>y</i>)</span> pertenece al dominio de <span class="math-text"><i>f</i></span> y <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span>:</p>
          <p><span class="math-text">Gráfica(<i>f</i>) = {(<i>x</i>, <i>y</i>, <i>z</i>) ∈ ℝ³ | (<i>x</i>, <i>y</i>) ∈ dom <i>f</i>, <i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)}</span></p>
          <p>Geométricamente, las gráficas de funciones de dos variables <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span> o de ecuaciones implícitas <span class="math-text"><i>F</i>(<i>x</i>, <i>y</i>, <i>z</i>) = 0</span> corresponden a <strong>superficies</strong> en el espacio. La proyección ortogonal de dicha superficie sobre el plano coordenado <span class="math-text"><i>XY</i></span> coincide exactamente con el dominio de la función.</p>
        </div>

        <p>Las superficies más elementales en <span class="math-text">ℝ³</span> son los <strong>planos</strong>, cuyas ecuaciones corresponden a expresiones polinómicas de primer grado de la forma <span class="math-text"><i>ax</i> + <i>by</i> + <i>cz</i> = <i>d</i></span>. Para graficar un plano basta determinar sus intersecciones con los tres ejes coordenados (haciendo sucesivamente cero a las otras dos variables) o bosquejar sus trazas.</p>

        <h3>Superficies cilíndricas y la regla de la variable ausente</h3>
        <p>En el espacio tridimensional, una ecuación donde no figuran explícitamente las tres variables no representa una curva aislada, sino una <strong>superficie cilíndrica</strong>. Según la Sección 1.3 del folleto:</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Propiedad fundamental de los cilindros</strong><span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = 0, &nbsp; <i>f</i>(<i>x</i>, <i>z</i>) = 0, &nbsp; <i>f</i>(<i>y</i>, <i>z</i>) = 0</span></div>
          <p>Una superficie cilíndrica es una superficie generada por una recta (llamada <strong>generatriz</strong>) que se desplaza paralelamente a una dirección fija apoyándose siempre sobre una curva plana fija (llamada <strong>directriz</strong>).</p>
          <p><strong>Regla práctica del profesor Chávez:</strong> Las ecuaciones de la forma <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = 0</span>, <span class="math-text"><i>f</i>(<i>x</i>, <i>z</i>) = 0</span> y <span class="math-text"><i>f</i>(<i>y</i>, <i>z</i>) = 0</span> corresponden a superficies cilíndricas cuya <em>generatriz es paralela al eje asociado a la variable que 'falta'</em> en la ecuación.</p>
        </div>

        <p>El folleto clasifica los siguientes ejemplos representativos de superficies cilíndricas:</p>
        <p>• <strong>Cilindro circular recto:</strong> <span class="math-text"><i>x</i>² + <i>y</i>² = <i>r</i>²</span>. Falta la variable <span class="math-text"><i>z</i></span>; la directriz es una circunferencia de radio <span class="math-text"><i>r</i></span> en el plano <span class="math-text"><i>XY</i></span> y sus generatrices son rectas verticales paralelas al eje <span class="math-text"><i>Z</i></span>.<br>
        • <strong>Cilindro parabólico:</strong> <span class="math-text"><i>y</i> = 4<i>z</i>²</span>. Falta la variable <span class="math-text"><i>x</i></span>; la directriz es una parábola en el plano <span class="math-text"><i>YZ</i></span> que abre en el sentido positivo del eje <span class="math-text"><i>Y</i></span>, y sus generatrices son paralelas al eje <span class="math-text"><i>X</i></span>.<br>
        • <strong>Cilindro logarítmico:</strong> <span class="math-text"><i>y</i> = ln <i>x</i></span> (con <span class="math-text"><i>x</i> &gt; 0</span>). Falta la variable <span class="math-text"><i>z</i></span>; sus generatrices se extienden verticalmente paralelas al eje <span class="math-text"><i>Z</i></span>.<br>
        • <strong>Cilindro cúbico (o semicúbico):</strong> <span class="math-text"><i>z</i>² = <i>x</i>³</span>. Falta la variable <span class="math-text"><i>y</i></span>; la curva directriz se encuentra en el plano <span class="math-text"><i>XZ</i></span> y las generatrices son paralelas al eje <span class="math-text"><i>Y</i></span>.<br>
        • <strong>Cilindro elíptico:</strong> <span class="math-text"><span class="math-fraction"><span><i>x</i>²</span><span>4</span></span> + <span class="math-fraction"><span><i>z</i>²</span><span>9</span></span> = 1</span>. Falta la variable <span class="math-text"><i>y</i></span>; la directriz es una elipse en el plano <span class="math-text"><i>XZ</i></span> y la superficie se extiende a lo largo del eje <span class="math-text"><i>Y</i></span>.<br>
        • <strong>Cilindro hiperbólico:</strong> <span class="math-text"><span class="math-fraction"><span><i>z</i>²</span><span><i>c</i>²</span></span> − <span class="math-fraction"><span><i>x</i>²</span><span><i>a</i>²</span></span> = 1</span>. Falta la variable <span class="math-text"><i>y</i></span>; la directriz es una hipérbola en el plano <span class="math-text"><i>XZ</i></span> con generatrices paralelas al eje <span class="math-text"><i>Y</i></span>.</p>

        <h3>Criterios de simetría en el espacio tridimensional</h3>
        <p>Antes de bosquejar una superficie, el profesor Chávez recomienda verificar rápidamente las simetrías algebraicas evaluando cambios de signo en las variables de la ecuación <span class="math-text"><i>F</i>(<i>x</i>, <i>y</i>, <i>z</i>) = 0</span>:</p>
        <p>• <strong>Respecto al plano <i>XY</i>:</strong> Se cumple si <span class="math-text"><i>F</i>(<i>x</i>, <i>y</i>, <i>z</i>) = <i>F</i>(<i>x</i>, <i>y</i>, −<i>z</i>)</span>.<br>
        • <strong>Respecto al plano <i>XZ</i>:</strong> Se cumple si <span class="math-text"><i>F</i>(<i>x</i>, <i>y</i>, <i>z</i>) = <i>F</i>(<i>x</i>, −<i>y</i>, <i>z</i>)</span>.<br>
        • <strong>Respecto al plano <i>YZ</i>:</strong> Se cumple si <span class="math-text"><i>F</i>(<i>x</i>, <i>y</i>, <i>z</i>) = <i>F</i>(−<i>x</i>, <i>y</i>, <i>z</i>)</span>.<br>
        • <strong>Respecto al eje <i>X</i>:</strong> Se cumple si <span class="math-text"><i>F</i>(<i>x</i>, <i>y</i>, <i>z</i>) = <i>F</i>(<i>x</i>, −<i>y</i>, −<i>z</i>)</span>.<br>
        • <strong>Respecto al eje <i>Y</i>:</strong> Se cumple si <span class="math-text"><i>F</i>(<i>x</i>, <i>y</i>, <i>z</i>) = <i>F</i>(−<i>x</i>, <i>y</i>, −<i>z</i>)</span>.<br>
        • <strong>Respecto al eje <i>Z</i>:</strong> Se cumple si <span class="math-text"><i>F</i>(<i>x</i>, <i>y</i>, <i>z</i>) = <i>F</i>(−<i>x</i>, −<i>y</i>, <i>z</i>)</span>.</p>

        <h3>Superficies cuádricas canónicas fundamentales</h3>
        <p>Las cuádricas son superficies generadas por ecuaciones polinómicas de segundo grado en tres variables. Su identificación y bosquejo se efectúa mediante el <strong>método de trazas</strong> (intersecciones con los planos coordenados <span class="math-text"><i>x</i>=0, <i>y</i>=0, <i>z</i>=0</span> y con planos paralelos a ellos <span class="math-text"><i>z</i>=<i>k</i>, <i>y</i>=<i>k</i>, <i>x</i>=<i>k</i></span>). El folleto establece las siguientes familias canónicas:</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>1. Esfera</strong><span class="math-text">(<i>x</i> − <i>x</i>₀)² + (<i>y</i> − <i>y</i>₀)² + (<i>z</i> − <i>z</i>₀)² = <i>R</i>²</span></div>
          <p>Es el lugar geométrico de los puntos que equidistan una distancia <span class="math-text"><i>R</i></span> de un centro fijo <span class="math-text">(<i>x</i>₀, <i>y</i>₀, <i>z</i>₀)</span>. En forma general se escribe:</p>
          <p><span class="math-text"><i>x</i>² + <i>y</i>² + <i>z</i>² + <i>Dx</i> + <i>Ey</i> + <i>Fz</i> + <i>G</i> = 0</span></p>
          <p>Posee centro en <span class="math-text">(−<span class="math-fraction"><span><i>D</i></span><span>2</span></span>, −<span class="math-fraction"><span><i>E</i></span><span>2</span></span>, −<span class="math-fraction"><span><i>F</i></span><span>2</span></span>)</span> y radio <span class="math-text"><i>R</i> = √<span class="math-radical"><span class="math-fraction"><span><i>D</i>²</span><span>4</span></span> + <span class="math-fraction"><span><i>E</i>²</span><span>4</span></span> + <span class="math-fraction"><span><i>F</i>²</span><span>4</span></span> − <i>G</span></span></span>, siempre que la cantidad subradical sea estrictamente positiva.</p>
        </div>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>2. Elipsoide</strong><span class="math-text"><span class="math-fraction"><span><i>x</i>²</span><span><i>a</i>²</span></span> + <span class="math-fraction"><span><i>y</i>²</span><span><i>b</i>²</span></span> + <span class="math-fraction"><span><i>z</i>²</span><span><i>c</i>²</span></span> = 1</span></div>
          <p>Superficie cerrada simétrica respecto a los tres planos coordenados. Si el centro está en el origen <span class="math-text">(0, 0, 0)</span>, corta a los ejes en los vértices <span class="math-text">(±<i>a</i>, 0, 0)</span>, <span class="math-text">(0, ±<i>b</i>, 0)</span> y <span class="math-text">(0, 0, ±<i>c</i>)</span>. Todas sus trazas planas son elipses (o circunferencias si dos semiejes son iguales). Cuando <span class="math-text"><i>a</i> = <i>b</i> = <i>c</i></span>, el elipsoide se convierte en una esfera.</p>
        </div>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>3. Hiperboloide elíptico de una hoja</strong><span class="math-text"><span class="math-fraction"><span><i>x</i>²</span><span><i>a</i>²</span></span> + <span class="math-fraction"><span><i>y</i>²</span><span><i>b</i>²</span></span> − <span class="math-fraction"><span><i>z</i>²</span><span><i>c</i>²</span></span> = 1</span></div>
          <p>Superficie continua y conexa. El <strong>eje de simetría principal</strong> corresponde a la variable que tiene el coeficiente negativo (en este caso el eje <span class="math-text"><i>Z</i></span>). Sus trazas en planos horizontales <span class="math-text"><i>z</i> = <i>k</i></span> son elipses que se ensanchan a medida que <span class="math-text">|<i>z</i>|</span> crece; la elipse de menor tamaño ocurre en <span class="math-text"><i>z</i> = 0</span> (llamada <em>elipse garganta</em>). Sus trazas verticales con planos paralelos a los ejes <span class="math-text"><i>XZ</i></span> e <span class="math-text"><i>YZ</i></span> son hipérbolas.</p>
        </div>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>4. Hiperboloide elíptico de dos hojas</strong><span class="math-text">−<span class="math-fraction"><span><i>x</i>²</span><span><i>a</i>²</span></span> − <span class="math-fraction"><span><i>y</i>²</span><span><i>b</i>²</span></span> + <span class="math-fraction"><span><i>z</i>²</span><span><i>c</i>²</span></span> = 1</span></div>
          <p>Superficie compuesta por dos mantos separados. Presenta dos signos negativos y uno positivo; el eje principal corresponde a la <strong>única variable con signo positivo</strong> (eje <span class="math-text"><i>Z</i></span>). Para valores de <span class="math-text">−<i>c</i> &lt; <i>z</i> &lt; <i>c</i></span> no existen puntos reales en la superficie (zona vacía entre ambas hojas). Para <span class="math-text">|<i>z</i>| &gt; <i>c</i></span>, las trazas horizontales son elipses; las trazas verticales son hipérbolas.</p>
        </div>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>5. Cono elíptico</strong><span class="math-text"><span class="math-fraction"><span><i>x</i>²</span><span><i>a</i>²</span></span> + <span class="math-fraction"><span><i>y</i>²</span><span><i>b</i>²</span></span> = <span class="math-fraction"><span><i>z</i>²</span><span><i>c</i>²</span></span></span></div>
          <p>Posee su vértice en el origen <span class="math-text">(0, 0, 0)</span>. Las trazas en planos horizontales <span class="math-text"><i>z</i> = <i>k</i> ≠ 0</span> son elipses. En el plano <span class="math-text"><i>z</i> = 0</span>, la traza se reduce al único punto <span class="math-text">(0, 0, 0)</span>. Las trazas en los planos verticales coordenados (<span class="math-text"><i>x</i> = 0</span> o <span class="math-text"><i>y</i> = 0</span>) corresponden a pares de rectas secantes que se cortan en el vértice: <span class="math-text"><i>z</i> = ±<span class="math-fraction"><span><i>c</i></span><span><i>b</i></span></span><i>y</i></span> y <span class="math-text"><i>z</i> = ±<span class="math-fraction"><span><i>c</i></span><span><i>a</i></span></span><i>x</i></span>.</p>
        </div>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>6. Paraboloide elíptico</strong><span class="math-text"><span class="math-fraction"><span><i>x</i>²</span><span><i>a</i>²</span></span> + <span class="math-fraction"><span><i>y</i>²</span><span><i>b</i>²</span></span> = <span class="math-fraction"><span><i>z</i></span><span><i>c</i></span></span></span></div>
          <p>Superficie abierta en forma de copa. El eje principal corresponde a la <strong>variable lineal</strong> (en este caso el eje <span class="math-text"><i>Z</i></span>). Su vértice se ubica en el origen. Si <span class="math-text"><i>c</i> &gt; 0</span>, abre hacia arriba (<span class="math-text"><i>z</i> ≥ 0</span>); si <span class="math-text"><i>c</i> &lt; 0</span>, abre hacia abajo. Las trazas horizontales en planos <span class="math-text"><i>z</i> = <i>k</i></span> (con el mismo signo de <span class="math-text"><i>c</i></span>) son elipses, mientras que las trazas verticales son parábolas.</p>
        </div>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>7. Paraboloide hiperbólico (Silla de montar)</strong><span class="math-text"><span class="math-fraction"><span><i>x</i>²</span><span><i>a</i>²</span></span> − <span class="math-fraction"><span><i>y</i>²</span><span><i>b</i>²</span></span> = <span class="math-fraction"><span><i>z</i></span><span><i>c</i></span></span></span></div>
          <p>Superficie de doble curvatura con un punto de ensilladura en el origen <span class="math-text">(0, 0, 0)</span>. Sus trazas horizontales con planos <span class="math-text"><i>z</i> = <i>k</i> ≠ 0</span> son hipérbolas con ramas en distintas direcciones según el signo de <span class="math-text"><i>k</i></span>; para <span class="math-text"><i>z</i> = 0</span> la traza es el par de rectas que se intersectan <span class="math-text"><i>y</i> = ±<span class="math-fraction"><span><i>b</i></span><span><i>a</i></span></span><i>x</i></span>. Sus trazas verticales con los planos <span class="math-text"><i>xz</i></span> e <span class="math-text"><i>yz</i></span> son parábolas con concavidades opuestas.</p>
        </div>

        <h3>Ejemplo resuelto 1: Análisis por trazas de un paraboloide elíptico</h3>
        <p>Analizar y bosquejar la superficie dada por la ecuación <span class="math-text"><i>z</i> = <span class="math-fraction"><span><i>x</i>²</span><span>4</span></span> + <span class="math-fraction"><span><i>y</i>²</span><span>9</span></span></span> (Ejercicio I.vi del folleto):</p>

        <p><strong>Paso 1: Identificación de la cuádrica</strong><br>
        Observamos que la variable <span class="math-text"><i>z</i></span> aparece en primer grado (potencia 1), mientras que las variables <span class="math-text"><i>x</i></span> e <span class="math-text"><i>y</i></span> aparecen elevadas al cuadrado con coeficientes del mismo signo positivo. Por tanto, se trata de un <strong>paraboloide elíptico</strong> con eje de simetría sobre el eje <span class="math-text"><i>Z</i></span> y vértice en el origen <span class="math-text">(0, 0, 0)</span>.</p>

        <p><strong>Paso 2: Trazas sobre los planos coordenados</strong><br>
        • <em>Traza sobre el plano XY (z = 0):</em><br>
        Sustituyendo <span class="math-text"><i>z</i> = 0</span> en la ecuación: <span class="math-text"><span class="math-fraction"><span><i>x</i>²</span><span>4</span></span> + <span class="math-fraction"><span><i>y</i>²</span><span>9</span></span> = 0</span>. Dado que la suma de dos términos no negativos solo es cero cuando ambos se anulan simultáneamente, la única solución real es el punto <span class="math-text">(0, 0, 0)</span> (el vértice).<br>
        • <em>Traza sobre el plano XZ (y = 0):</em><br>
        Haciendo <span class="math-text"><i>y</i> = 0</span>: <span class="math-text"><i>z</i> = <span class="math-fraction"><span><i>x</i>²</span><span>4</span></span></span>. Es una parábola en el plano <span class="math-text"><i>XZ</i></span> con vértice en <span class="math-text">(0,0,0)</span> que abre hacia arriba a lo largo del eje positivo de <span class="math-text"><i>Z</i></span>.<br>
        • <em>Traza sobre el plano YZ (x = 0):</em><br>
        Haciendo <span class="math-text"><i>x</i> = 0</span>: <span class="math-text"><i>z</i> = <span class="math-fraction"><span><i>y</i>²</span><span>9</span></span></span>. Es otra parábola en el plano <span class="math-text"><i>YZ</i></span>, también orientada hacia arriba pero con una apertura más amplia debido al denominador 9.</p>

        <p><strong>Paso 3: Trazas sobre planos horizontales paralelos (z = k)</strong><br>
        Para cualquier constante <span class="math-text"><i>k</i> &gt; 0</span>, cortamos la superficie con el plano <span class="math-text"><i>z</i> = <i>k</i></span>:<br>
        <span class="math-text"><span class="math-fraction"><span><i>x</i>²</span><span>4</span></span> + <span class="math-fraction"><span><i>y</i>²</span><span>9</span></span> = <i>k</i> &nbsp;⟹&nbsp; <span class="math-fraction"><span><i>x</i>²</span><span>4<i>k</i></span></span> + <span class="math-fraction"><span><i>y</i>²</span><span>9<i>k</i></span></span> = 1</span>.<br>
        Esta ecuación representa una familia de <strong>elipses</strong> concéntricas cuyos semiejes crecen proporcionalmente a <span class="math-text">√<i>k</i></span>: semieje en <span class="math-text"><i>x</i></span> de longitud <span class="math-text">2√<i>k</i></span> y semieje en <span class="math-text"><i>y</i></span> de longitud <span class="math-text">3√<i>k</i></span>. Para <span class="math-text"><i>k</i> &lt; 0</span> no existen trazas reales, lo que confirma que la superficie no posee puntos debajo del plano <span class="math-text"><i>XY</i></span>.</p>

        <p><strong>Paso 4: Dominio, rango y conclusión</strong><br>
        • Dominio: <span class="math-text">dom <i>f</i> = ℝ²</span> (las entradas <span class="math-text">(<i>x</i>, <i>y</i>)</span> pueden tomar cualquier valor real).<br>
        • Rango: <span class="math-text">rang <i>f</i> = [0, ∞) = {<i>z</i> ∈ ℝ | <i>z</i> ≥ 0}</span>.<br>
        • La superficie es un paraboloide elíptico que se extiende infinitamente hacia arriba sobre el semiespacio <span class="math-text"><i>z</i> ≥ 0</span>.</p>

        <h3>Ejemplo resuelto 2: Superficie cilíndrica y su generatriz</h3>
        <p>Analizar y clasificar la ecuación <span class="math-text"><i>y</i> = 4<i>z</i>²</span> en el espacio <span class="math-text">ℝ³</span> (del folleto, pág. 12 y Ejercicio I.v):</p>

        <p><strong>Paso 1: Identificación de la variable ausente</strong><br>
        La ecuación relaciona exclusivamente a las variables <span class="math-text"><i>y</i></span> y <span class="math-text"><i>z</i></span>. La variable <span class="math-text"><i>x</i></span> no aparece en la expresión.</p>

        <p><strong>Paso 2: Aplicación del principio de la generatriz</strong><br>
        Siguiendo la regla del profesor David Chávez, al faltar la variable <span class="math-text"><i>x</i></span>, la ecuación en <span class="math-text">ℝ³</span> representa una <strong>superficie cilíndrica</strong> cuyas generatrices son rectas completamente paralelas al eje coordenado <span class="math-text"><i>X</i></span>.</p>

        <p><strong>Paso 3: Descripción de la curva directriz</strong><br>
        La directriz es la parábola <span class="math-text"><i>y</i> = 4<i>z</i>²</span> (o <span class="math-text"><i>z</i>² = <span class="math-fraction"><span>1</span><span>4</span></span><i>y</i></span>) situada en el plano coordenado <span class="math-text"><i>YZ</i></span> (<span class="math-text"><i>x</i> = 0</span>). Su vértice se encuentra en el origen <span class="math-text">(0, 0, 0)</span> y se abre hacia el semieje positivo de las <span class="math-text"><i>y</i></span> (<span class="math-text"><i>y</i> ≥ 0</span>).</p>

        <p><strong>Paso 4: Geometría en el espacio</strong><br>
        Al trasladar esta parábola a lo largo de cualquier valor de <span class="math-text"><i>x</i> ∈ (−∞, ∞)</span>, se forma una superficie abierta con forma de canalón parabólico horizontal infinito cuyo lomo descansa a lo largo del eje <span class="math-text"><i>X</i></span>.</p>

        <h3>Ejemplo resuelto 3: Hiperboloide de una hoja y orientación del eje</h3>
        <p>Identificar la superficie <span class="math-text"><span class="math-fraction"><span><i>x</i>²</span><span>4</span></span> + <span class="math-fraction"><span><i>y</i>²</span><span>9</span></span> − <i>z</i>² = 1</span> (Ejercicio I.x del folleto):</p>

        <p><strong>Paso 1: Clasificación por signos cuadráticos</strong><br>
        Los tres términos son de segundo grado igualados a 1. Dos coeficientes son positivos (<span class="math-text">+<i>x</i>²/4</span>, <span class="math-text">+<i>y</i>²/9</span>) y uno es negativo (<span class="math-text">−<i>z</i>²</span>). Esta estructura define inequívocamente a un <strong>hiperboloide elíptico de una hoja</strong>.</p>

        <p><strong>Paso 2: Eje principal y elipse garganta</strong><br>
        La variable que porta el signo negativo es <span class="math-text"><i>z</i></span>, por lo que el eje de simetría de la superficie coincide con el eje coordenado <span class="math-text"><i>Z</i></span>. Al intersectar con el plano <span class="math-text"><i>z</i> = 0</span>, obtenemos la sección más estrecha (elipse garganta):<br>
        <span class="math-text"><span class="math-fraction"><span><i>x</i>²</span><span>4</span></span> + <span class="math-fraction"><span><i>y</i>²</span><span>9</span></span> = 1</span>, con semiejes <span class="math-text"><i>a</i> = 2</span> en <span class="math-text"><i>x</i></span> y <span class="math-text"><i>b</i> = 3</span> en <span class="math-text"><i>y</i></span>.</p>

        <p><strong>Paso 3: Trazas verticales hiperbólicas</strong><br>
        • Haciendo <span class="math-text"><i>x</i> = 0</span> (plano <span class="math-text"><i>YZ</i></span>): <span class="math-text"><span class="math-fraction"><span><i>y</i>²</span><span>9</span></span> − <i>z</i>² = 1</span> (hipérbola con eje transversal en <span class="math-text"><i>Y</i></span>).<br>
        • Haciendo <span class="math-text"><i>y</i> = 0</span> (plano <span class="math-text"><i>XZ</i></span>): <span class="math-text"><span class="math-fraction"><span><i>x</i>²</span><span>4</span></span> − <i>z</i>² = 1</span> (hipérbola con eje transversal en <span class="math-text"><i>X</i></span>).<br>
        Esto confirma la forma continua de diábolo o reloj de arena extendiéndose indefinidamente sobre el eje <span class="math-text"><i>Z</i></span>.</p>

        <h3>Ejercicios de práctica con soluciones explicadas (Folleto Secc. 1.3)</h3>
        <p>Los siguientes ejercicios corresponden a la sección de Ejercicios Propuestos I (página 15) del folleto de la Semana 1:</p>

        <p><strong>Ejercicio 1: Clasificar y describir la superficie <i>x</i>² + <span class="math-fraction"><span><i>y</i>²</span><span>4</span></span> + <span class="math-fraction"><span><i>z</i>²</span><span>9</span></span> = 1 (Ejercicio I.ii)</strong><br>
        • <em>Solución explicada:</em> Todos los términos cuadráticos son positivos y su suma está igualada a 1, lo que caracteriza a un <strong>elipsoide</strong> con centro en el origen <span class="math-text">(0, 0, 0)</span>. Sus semiejes principales son <span class="math-text"><i>a</i> = 1</span> (sobre el eje <span class="math-text"><i>X</i></span>), <span class="math-text"><i>b</i> = 2</span> (sobre el eje <span class="math-text"><i>Y</i></span>) y <span class="math-text"><i>c</i> = 3</span> (sobre el eje <span class="math-text"><i>Z</i></span>). Al ser una superficie acotada, los rangos de variación de cada variable son cerrados: <span class="math-text"><i>x</i> ∈ [−1, 1]</span>, <span class="math-text"><i>y</i> ∈ [−2, 2]</span> y <span class="math-text"><i>z</i> ∈ [−3, 3]</span>.</p>

        <p><strong>Ejercicio 2: Identificar la superficie <i>z</i>² = <i>x</i>² + 4<i>y</i>² (Ejercicio I.iii)</strong><br>
        • <em>Solución explicada:</em> Reescribiendo la ecuación en forma canónica dividiendo entre <span class="math-text"><i>z</i>²</span> tenemos <span class="math-text"><span class="math-fraction"><span><i>x</i>²</span><span><i>z</i>²</span></span> + <span class="math-fraction"><span><i>y</i>²</span><span>(<i>z</i>/2)²</span></span> = 1</span>, o bien <span class="math-text"><i>x</i>² + 4<i>y</i>² − <i>z</i>² = 0</span>. Es un <strong>cono elíptico</strong> con eje principal a lo largo del eje <span class="math-text"><i>Z</i></span> y vértice en el origen <span class="math-text">(0, 0, 0)</span>. Para cada plano horizontal <span class="math-text"><i>z</i> = <i>k</i> ≠ 0</span>, la traza es una elipse <span class="math-text"><i>x</i>² + 4<i>y</i>² = <i>k</i>²</span>; mientras que las trazas sobre los planos coordenados verticales corresponden a rectas que se intersectan: <span class="math-text"><i>z</i> = ±<i>x</i></span> (en <span class="math-text"><i>y</i> = 0</span>) y <span class="math-text"><i>z</i> = ±2<i>y</i></span> (en <span class="math-text"><i>x</i> = 0</span>).</p>

        <p><strong>Ejercicio 3: Identificar la cuádrica <span class="math-fraction"><span><i>x</i>²</span><span>25</span></span> − <span class="math-fraction"><span><i>z</i>²</span><span>16</span></span> = 4<i>y</i> (Ejercicio I.ix)</strong><br>
        • <em>Solución explicada:</em> Dos términos cuadráticos con signos opuestos en el primer miembro y una variable lineal (<span class="math-text"><i>y</i></span>) en el segundo miembro definen un <strong>paraboloide hiperbólico (silla de montar)</strong> con eje principal sobre el eje <span class="math-text"><i>Y</i></span>. Las trazas en planos <span class="math-text"><i>y</i> = <i>k</i></span> con <span class="math-text"><i>k</i> ≠ 0</span> son hipérbolas; la traza con <span class="math-text"><i>y</i> = 0</span> es el par de rectas <span class="math-text"><i>z</i> = ±<span class="math-fraction"><span>4</span><span>5</span></span><i>x</i></span>. En los planos verticales coordenados las trazas son parábolas de concavidades opuestas: en <span class="math-text"><i>z</i> = 0</span> es <span class="math-text"><i>y</i> = <span class="math-fraction"><span><i>x</i>²</span><span>100</span></span></span> (abre hacia <span class="math-text"><i>y</i> &gt; 0</span>) y en <span class="math-text"><i>x</i> = 0</span> es <span class="math-text"><i>y</i> = −<span class="math-fraction"><span><i>z</i>²</span><span>64</span></span></span> (abre hacia <span class="math-text"><i>y</i> &lt; 0</span>), confirmando el punto de ensilladura en el origen.</p>

        <p><strong>Ejercicio 4: Interpretar la ecuación <i>x</i>² + <i>y</i>² = 1 en el espacio tridimensional ℝ³ (Ejercicio I.vii)</strong><br>
        • <em>Solución explicada:</em> Aunque en el plano <span class="math-text">ℝ²</span> representa una circunferencia de radio 1, en el espacio <span class="math-text">ℝ³</span> representa un <strong>cilindro circular recto</strong>. Dado que la variable <span class="math-text"><i>z</i></span> no interviene en la relación, los puntos <span class="math-text">(<i>x</i>, <i>y</i>, <i>z</i>)</span> pueden adoptar cualquier cota <span class="math-text"><i>z</i> ∈ (−∞, ∞)</span>, generando un tubo cilíndrico infinito de radio 1 centrado en el eje <span class="math-text"><i>Z</i></span>.</p>`
    },
    {
      title: 'Curvas de nivel',
      content: `
        <h2>Curvas de nivel y superficies de nivel</h2>
        <p>Al estudiar funciones en una variable <span class="math-text"><i>y</i> = <i>f</i>(<i>x</i>)</span>, su comportamiento se visualiza directamente en el plano cartesiano <span class="math-text">ℝ²</span>. Para funciones de dos variables independientes <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span>, la gráfica completa es una superficie que habita en el espacio tridimensional <span class="math-text">ℝ³</span>. Sin embargo, cuando pasamos a tres variables independientes <span class="math-text"><i>w</i> = <i>f</i>(<i>x</i>, <i>y</i>, <i>z</i>)</span>, graficar la función requeriría cuatro dimensiones geométricas (<span class="math-text">ℝ⁴</span>), lo cual excede nuestra capacidad de percepción física tridimensional.</p>

        <p>Para resolver esta limitación geométrica y facilitar el análisis práctico, el cálculo multivariable utiliza la técnica de los <strong>conjuntos de nivel</strong>. Este método reduce en una dimensión la visualización: representa una superficie 3D mediante una familia de <strong>curvas de nivel</strong> en el plano bidimensional <span class="math-text">ℝ²</span>, y permite interpretar una relación 4D mediante una familia de <strong>superficies de nivel</strong> en el espacio tridimensional <span class="math-text">ℝ³</span>.</p>

        <h3>Aplicaciones en el mundo real</h3>
        <p>El concepto de curvas y superficies de nivel es una de las herramientas más extendidas en la ciencia y la ingeniería aplicada:</p>
        <p>• <strong>Mapas topográficos y de relieve:</strong> Las curvas de nivel unen todos los puntos del terreno que se encuentran a una misma altitud sobre el nivel del mar (llamadas <em>curvas de cota</em>). Permiten a ingenieros y topógrafos leer la pendiente, crestas, valles y desniveles de una montaña en un mapa plano.<br>
        • <strong>Meteorología y climatología:</strong> Se utilizan las <em>isobaras</em> (curvas de igual presión atmosférica) para predecir tormentas y sistemas de viento, y las <em>isotermas</em> (curvas de igual temperatura) para mapear frentes térmicos.<br>
        • <strong>Termodinámica y transferencia de calor:</strong> En un cuerpo tridimensional sometido a fuentes de calor, las <em>superficies isotérmicas</em> delimitan las zonas del volumen con idéntica temperatura.<br>
        • <strong>Electromagnetismo y gravitación:</strong> Las <em>superficies equipotenciales</em> son superficies de nivel del potencial electrostático o gravitatorio; las líneas de campo de fuerza son siempre perpendiculares a estas superficies.</p>

        <h3>Curvas de nivel</h3>
        <p>Consideremos una función escalar de dos variables independientes <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span> con dominio <span class="math-text"><i>D</i> ⊂ ℝ²</span> y rango <span class="math-text">rang <i>f</i> ⊂ ℝ</span>:</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Definición formal: Curva de nivel (Definición 3 del folleto)</strong><span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = <i>k</i>,  <i>k</i> ∈ rang <i>f</i></span></div>
          <p>Una <strong>CURVA DE NIVEL</strong> es el lugar geométrico de todos los puntos <span class="math-text">(<i>x</i>, <i>y</i>)</span> del dominio que originan iguales valores de la función <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span>.</p>
          <p>Simbólicamente, para una constante fija <span class="math-text"><i>k</i> ∈ rang <i>f</i></span>, la curva de nivel correspondiente a la cota <span class="math-text"><i>k</i></span> se define como el conjunto plano:</p>
          <p><span class="math-text"><i>C</i><sub><i>k</i></sub> = {(<i>x</i>, <i>y</i>) ∈ dom <i>f</i> | <i>f</i>(<i>x</i>, <i>y</i>) = <i>k</i>} ⊂ ℝ²</span></p>
        </div>

        <h3>Interpretación geométrica tridimensional</h3>
        <p>Geométricamente, una curva de nivel se construye mediante una intersección espacial y una proyección ortogonal:</p>
        <p>1) En el espacio <span class="math-text">ℝ³</span>, cortamos la superficie <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span> con el plano horizontal paralelo al plano <span class="math-text"><i>XY</i></span> de altura fija <span class="math-text"><i>z</i> = <i>k</i></span>.<br>
        2) La intersección entre la superficie y el plano horizontal genera una curva tridimensional denominada <strong>traza horizontal</strong> de la superficie a cota <span class="math-text"><i>k</i></span>.<br>
        3) Al <strong>proyectar ortogonalmente</strong> dicha traza sobre el plano coordenado <span class="math-text"><i>XY</i></span> (haciendo <span class="math-text"><i>z</i> = 0</span>), obtenemos la curva de nivel en el plano cartesiano <span class="math-text">ℝ²</span>.</p>

        <h3>Propiedades fundamentales de las curvas de nivel</h3>
        <p>• <strong>Unicidad e incompatibilidad de intersección:</strong> Dos curvas de nivel que corresponden a valores distintos de la constante (<span class="math-text"><i>k</i>₁ ≠ <i>k</i>₂</span>) <strong>nunca pueden cruzarse ni cortarse</strong>. Si se cruzaran en un punto <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span>, la función tendría que tomar simultáneamente dos valores distintos (<span class="math-text"><i>f</i>(<i>x</i>₀, <i>y</i>₀) = <i>k</i>₁</span> y <span class="math-text"><i>f</i>(<i>x</i>₀, <i>y</i>₀) = <i>k</i>₂</span>), lo cual contradice la definición misma de función de una sola imagen.<br>
        • <strong>Densidad y pendiente del terreno:</strong> Si al graficar curvas con incrementos regulares de nivel (<span class="math-text">Δ<i>k</i> = constante</span>) las curvas se encuentran muy cercanas entre sí, significa que la superficie cambia de altura muy rápidamente en esa dirección (indica una pendiente pronunciada o un gradiente de gran magnitud). Por el contrario, curvas ampliamente espaciadas indican una pendiente suave o casi plana.<br>
        • <strong>Restricción del rango:</strong> La constante <span class="math-text"><i>k</i></span> debe elegirse obligatoriamente dentro del rango de la función (<span class="math-text"><i>k</i> ∈ rang <i>f</i></span>). Si se evalúa un valor de <span class="math-text"><i>k</i> ∉ rang <i>f</i></span>, el conjunto solución es vacío (<span class="math-text">∅</span>), indicando que el plano horizontal no intersecta la superficie.</p>

        <h3>Procedimiento para obtener y graficar curvas de nivel</h3>
        <p>Para construir el mapa de curvas de nivel de una función <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span> se sigue una secuencia analítica metódica:</p>
        <p><strong>Paso 1: Determinar el dominio y el rango de la función.</strong> Hallar los valores admisibles de <span class="math-text">(<i>x</i>, <i>y</i>)</span> y establecer el intervalo exacto de variación para la cota <span class="math-text"><i>z</i></span>.<br>
        <strong>Paso 2: Plantear la ecuación de nivel.</strong> Igualar la regla de correspondencia a la constante arbitraria <span class="math-text"><i>k</i></span>: <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = <i>k</i></span>, con <span class="math-text"><i>k</i> ∈ rang <i>f</i></span>.<br>
        <strong>Paso 3: Transformar algebraicamente la ecuación.</strong> Despejar <span class="math-text"><i>y</i></span> en términos de <span class="math-text"><i>x</i></span> o llevar la ecuación a su forma canónica de curva cónica (recta, circunferencia, elipse, hipérbola o parábola).<br>
        <strong>Paso 4: Asignar valores representativos y ordenados a <i>k</i>.</strong> Seleccionar una muestra ordenada de valores en el rango (por ejemplo, el valor mínimo en la frontera, seguidos de valores equiespaciados <span class="math-text"><i>k</i> = 0, 1, 2, 3, …</span>) y calcular los radios, semiejes o pendientes resultantes.<br>
        <strong>Paso 5: Trazar y rotular las curvas en el plano cartesiano ℝ².</strong> Dibujar las curvas en un único sistema de ejes coordenados <span class="math-text"><i>XY</i></span>, indicando al lado de cada trazo el valor respectivo de <span class="math-text"><i>z</i> = <i>k</i></span>.</p>

        <h3>Superficies de nivel</h3>
        <p>Cuando la función depende de tres variables independientes <span class="math-text"><i>w</i> = <i>f</i>(<i>x</i>, <i>y</i>, <i>z</i>)</span>, generalizamos el concepto hacia el espacio tridimensional:</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Definición formal: Superficie de nivel (Definición 4 del folleto)</strong><span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>, <i>z</i>) = <i>k</i>,  <i>k</i> ∈ rang <i>f</i></span></div>
          <p>Una <strong>SUPERFICIE DE NIVEL</strong> es el lugar geométrico de todos los puntos <span class="math-text">(<i>x</i>, <i>y</i>, <i>z</i>)</span> del dominio que originan iguales valores de la función <span class="math-text"><i>w</i> = <i>f</i>(<i>x</i>, <i>y</i>, <i>z</i>)</span>.</p>
          <p>Simbólicamente, fijando una constante <span class="math-text"><i>k</i> ∈ rang <i>f</i></span>, la superficie de nivel asociada a <span class="math-text"><i>k</i></span> es el conjunto tridimensional:</p>
          <p><span class="math-text"><i>S</i><sub><i>k</i></sub> = {(<i>x</i>, <i>y</i>, <i>z</i>) ∈ dom <i>f</i> | <i>f</i>(<i>x</i>, <i>y</i>, <i>z</i>) = <i>k</i>} ⊂ ℝ³</span></p>
        </div>

        <p>Al asignar sucesivamente distintos valores a <span class="math-text"><i>k</i></span>, se genera una familia o conjunto de superficies en <span class="math-text">ℝ³</span> (como capas de cebolla, esferas concéntricas o planos paralelos). Cada una de estas superficies representa una región tridimensional donde la magnitud evaluada (como potencial eléctrico, presión o densidad) se conserva constante.</p>

        <h3>Distinción rigurosa: Curvas de nivel vs. Superficies de nivel</h3>
        <p>Es indispensable no confundir ambos conceptos, pues operan en dimensiones matemáticas y geométricas completamente distintas:</p>
        <p>• <strong>Función subyacente:</strong> Las curvas de nivel provienen de funciones de dos variables <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span>; las superficies de nivel provienen de funciones de tres variables <span class="math-text"><i>w</i> = <i>f</i>(<i>x</i>, <i>y</i>, <i>z</i>)</span>.<br>
        • <strong>Espacio donde habitan:</strong> La curva de nivel habita en el plano cartesiano <span class="math-text">ℝ²</span> (en el dominio de la función); la superficie de nivel habita en el espacio tridimensional <span class="math-text">ℝ³</span> (en el dominio de la función).<br>
        • <strong>Naturaleza geométrica:</strong> Una curva de nivel es un objeto unidimensional (línea o curva plana con 1 grado de libertad); una superficie de nivel es un objeto bidimensional (superficie con 2 grados de libertad).<br>
        • <strong>Visualización de la gráfica completa:</strong> La gráfica completa de <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span> es una superficie visible en <span class="math-text">ℝ³</span> (la curva de nivel es su proyección plana); en cambio, la gráfica completa de <span class="math-text"><i>w</i> = <i>f</i>(<i>x</i>, <i>y</i>, <i>z</i>)</span> requeriría el espacio tetradimensional <span class="math-text">ℝ⁴</span> (la superficie de nivel es el corte tridimensional que sí podemos visualizar en <span class="math-text">ℝ³</span>).<br>
        • <strong>Papel de la constante <i>k</i>:</strong> En curvas de nivel, <span class="math-text"><i>k</i></span> es la cota horizontal de corte <span class="math-text"><i>z</i> = <i>k</i></span>; en superficies de nivel, <span class="math-text"><i>k</i></span> es el valor escalar fijo asignado a la cuarta variable dependiente <span class="math-text"><i>w</i> = <i>k</i></span>.</p>

        <h3>Ejemplo resuelto 1: Familia de circunferencias concéntricas y el hiperboloide (Ejemplo 2 del folleto)</h3>
        <p>Bosquejar la gráfica de la función definida por <span class="math-text"><i>z</i> = √<span class="math-radical"><i>x</i>² + <i>y</i>² − 1</span></span> e indicar su dominio y recorrido a) en <span class="math-text">ℝ³</span> y b) en <span class="math-text">ℝ²</span> usando curvas de nivel (Folleto Secc. 1.2, Ejemplo 2, pág. 8):</p>

        <p><strong>Paso 1: Determinación analítica del dominio</strong><br>
        Como <span class="math-text"><i>z</i></span> debe ser un valor real, la cantidad subradical no puede ser negativa:<br>
        <span class="math-text"><i>x</i>² + <i>y</i>² − 1 ≥ 0 ⇒ <i>x</i>² + <i>y</i>² ≥ 1</span><br>
        Esto significa que el dominio está formado por todos los puntos del plano cartesiano que no pertenecen al interior del círculo unitario centrado en el origen. Simbólicamente:<br>
        <span class="math-text">dom <i>f</i> = {(<i>x</i>, <i>y</i>) ∈ ℝ² | <i>x</i>² + <i>y</i>² ≥ 1}</span>.</p>

        <p><strong>Paso 2: Determinación analítica del rango (recorrido)</strong><br>
        Por estar indicada la raíz cuadrada principal positiva y siendo <span class="math-text"><i>x</i>² + <i>y</i>² ≥ 1</span>, el radicando toma todos los valores posibles en el intervalo <span class="math-text">[0, ∞)</span>. En consecuencia, el rango de la función es:<br>
        <span class="math-text">rang <i>f</i> = [0, ∞) = {<i>z</i> ∈ ℝ | <i>z</i> ≥ 0}</span>.</p>

        <p><strong>Paso 3: Representación gráfica en el espacio ℝ³</strong><br>
        Elevando al cuadrado ambos miembros de la ecuación <span class="math-text"><i>z</i> = √<span class="math-radical"><i>x</i>² + <i>y</i>² − 1</span></span> obtenemos:<br>
        <span class="math-text"><i>z</i>² = <i>x</i>² + <i>y</i>² − 1 ⇒ <i>x</i>² + <i>y</i>² − <i>z</i>² = 1</span><br>
        Esta ecuación corresponde a un <strong>hiperboloide elíptico (circular) de una hoja</strong> con eje de simetría a lo largo del eje <span class="math-text"><i>Z</i></span>. Como la función original exige <span class="math-text"><i>z</i> ≥ 0</span>, la gráfica en <span class="math-text">ℝ³</span> corresponde exclusivamente a la <strong>hoja superior (<span class="math-text"><i>z</i> ≥ 0</span>)</strong> del hiperboloide, cuya base en el plano <span class="math-text"><i>z</i> = 0</span> es la circunferencia garganta <span class="math-text"><i>x</i>² + <i>y</i>² = 1</span>.</p>

        <p><strong>Paso 4: Deducción analítica de las curvas de nivel en ℝ²</strong><br>
        Hacemos <span class="math-text"><i>z</i> = <i>k</i></span> con <span class="math-text"><i>k</i> ≥ 0</span>:<br>
        <span class="math-text">√<span class="math-radical"><i>x</i>² + <i>y</i>² − 1</span> = <i>k</i> ⇒ <i>x</i>² + <i>y</i>² − 1 = <i>k</i>² ⇒ <i>x</i>² + <i>y</i>² = 1 + <i>k</i>²</span><br>
        Esta ecuación representa una familia de <strong>circunferencias concéntricas</strong> con centro en el origen <span class="math-text">(0, 0)</span> y radio variable <span class="math-text"><i>r</i> = √<span class="math-radical">1 + <i>k</i>²</span></span>.</p>

        <p><strong>Paso 5: Cálculo sistemático de radios para los valores del folleto</strong><br>
        • Para <span class="math-text"><i>z</i> = 0</span>: <span class="math-text"><i>x</i>² + <i>y</i>² = 1 + 0² = 1 ⇒ <i>r</i> = 1</span> (circunferencia frontera del dominio).<br>
        • Para <span class="math-text"><i>z</i> = 1</span>: <span class="math-text"><i>x</i>² + <i>y</i>² = 1 + 1² = 2 ⇒ <i>r</i> = √<span class="math-radical">2</span> ≈ 1.414</span>.<br>
        • Para <span class="math-text"><i>z</i> = 2</span>: <span class="math-text"><i>x</i>² + <i>y</i>² = 1 + 2² = 5 ⇒ <i>r</i> = √<span class="math-radical">5</span> ≈ 2.236</span>.<br>
        • Para <span class="math-text"><i>z</i> = 3</span>: <span class="math-text"><i>x</i>² + <i>y</i>² = 1 + 3² = 10 ⇒ <i>r</i> = √<span class="math-radical">10</span> ≈ 3.162</span>.<br>
        • Para <span class="math-text"><i>z</i> = 4</span>: <span class="math-text"><i>x</i>² + <i>y</i>² = 1 + 4² = 17 ⇒ <i>r</i> = √<span class="math-radical">17</span> ≈ 4.123</span>.</p>

        <p><strong>Paso 6: Interpretación geométrica del mapa plano</strong><br>
        Al aumentar el valor de la cota <span class="math-text"><i>z</i></span>, el radio de las circunferencias crece continuamente, mostrando cómo el hiperboloide se ensancha conforme asciende en altura. La separación radial entre curvas sucesivas con igual paso <span class="math-text">Δ<i>z</i> = 1</span> refleja la curvatura hiperbólica de la superficie hacia su asíntota cónica.</p>

        <h3>Ejemplo resuelto 2: Familia de planos paralelos como superficies de nivel (Ejemplo 3 del folleto)</h3>
        <p>Representar mediante superficies de nivel la función de tres variables <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>, <i>z</i>) = <i>x</i> + <i>y</i> + <i>z</i></span> (Folleto Secc. 1.2, Ejemplo 3, pág. 9):</p>

        <p><strong>Paso 1: Planteamiento de la ecuación de nivel</strong><br>
        Hacemos <span class="math-text"><i>w</i> = <i>k</i></span>, donde <span class="math-text"><i>k</i> ∈ ℝ</span> representa una constante real:<br>
        <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>, <i>z</i>) = <i>k</i> ⇒ <i>x</i> + <i>y</i> + <i>z</i> = <i>k</i></span>.</p>

        <p><strong>Paso 2: Reconocimiento geométrico</strong><br>
        Toda ecuación lineal de la forma <span class="math-text"><i>Ax</i> + <i>By</i> + <i>Cz</i> = <i>D</i></span> define un <strong>plano</strong> en el espacio tridimensional <span class="math-text">ℝ³</span>. En este caso, los coeficientes son <span class="math-text"><i>A</i> = 1</span>, <span class="math-text"><i>B</i> = 1</span> y <span class="math-text"><i>C</i> = 1</span>, de modo que cada superficie de nivel es un plano con vector director normal constante <span class="math-text"><b>n</b> = (1, 1, 1)</span>.</p>

        <p><strong>Paso 3: Familia de planos paralelos</strong><br>
        Como el vector normal es el mismo para cualquier valor de <span class="math-text"><i>k</i></span>, al variar la constante obtenemos una <strong>familia de planos paralelos entre sí</strong> perpendiculares a la diagonal del primer octante.</p>

        <p><strong>Paso 4: Trazas e intersecciones en el primer octante</strong><br>
        Para visualizar estos planos en el primer octante (<span class="math-text"><i>x</i> ≥ 0, <i>y</i> ≥ 0, <i>z</i> ≥ 0</span>) con valores positivos <span class="math-text"><i>k</i> &gt; 0</span>, hallamos las intersecciones con los tres ejes coordenados:<br>
        • Con el eje <span class="math-text"><i>X</i></span> (<span class="math-text"><i>y</i> = 0, <i>z</i> = 0</span>): <span class="math-text"><i>x</i> = <i>k</i> ⇒ (<i>k</i>, 0, 0)</span>.<br>
        • Con el eje <span class="math-text"><i>Y</i></span> (<span class="math-text"><i>x</i> = 0, <i>z</i> = 0</span>): <span class="math-text"><i>y</i> = <i>k</i> ⇒ (0, <i>k</i>, 0)</span>.<br>
        • Con el eje <span class="math-text"><i>Z</i></span> (<span class="math-text"><i>x</i> = 0, <i>y</i> = 0</span>): <span class="math-text"><i>z</i> = <i>k</i> ⇒ (0, 0, <i>k</i>)</span>.<br>
        En el primer octante, cada plano intersecta a los planos coordenados formando un triángulo equilátero cuyos vértices equidistan del origen en el valor <span class="math-text"><i>k</i></span>. Al aumentar <span class="math-text"><i>k</i></span>, el plano se desplaza paralelamente alejándose del origen.</p>

        <h3>Ejercicios de práctica propuestos en el folleto (con soluciones explicadas)</h3>

        <p><strong>Ejercicio 1: Curvas de nivel de la función <i>f</i>(<i>x</i>, <i>y</i>) = 4<i>xy</i> (Ejercicio III.i)</strong><br>
        • <em>Solución explicada:</em> Igualamos la función a la constante <span class="math-text"><i>k</i></span>: <span class="math-text">4<i>xy</i> = <i>k</i> ⇒ <i>xy</i> = <span class="math-fraction"><span><i>k</i></span><span>4</span></span></span>.<br>
        1) Si <span class="math-text"><i>k</i> = 0</span>, tenemos <span class="math-text"><i>xy</i> = 0</span>, lo que exige <span class="math-text"><i>x</i> = 0</span> o <span class="math-text"><i>y</i> = 0</span>. La curva de nivel cero está formada por la unión de los dos ejes coordenados (eje <span class="math-text"><i>X</i></span> y eje <span class="math-text"><i>Y</i></span>).<br>
        2) Si <span class="math-text"><i>k</i> &gt; 0</span>, se obtiene <span class="math-text"><i>y</i> = <span class="math-fraction"><span><i>k</i></span><span>4<i>x</i></span></span></span> con <span class="math-text"><i>xy</i> &gt; 0</span>. Representa una familia de <strong>hipérbolas equiláteras</strong> ubicadas en el primer y tercer cuadrante, cuyas asíntotas son los ejes coordenados.<br>
        3) Si <span class="math-text"><i>k</i> &lt; 0</span>, con <span class="math-text"><i>k</i> = −<i>c</i></span> (<span class="math-text"><i>c</i> &gt; 0</span>), se tiene <span class="math-text"><i>y</i> = −<span class="math-fraction"><span><i>c</i></span><span>4<i>x</i></span></span></span> con <span class="math-text"><i>xy</i> &lt; 0</span>. Corresponde a hipérbolas equiláteras ubicadas en el segundo y cuarto cuadrante.<br>
        Esta familia describe el comportamiento del paraboloide hiperbólico rotado <span class="math-text"><i>z</i> = 4<i>xy</i></span>, evidenciando un punto de ensilladura en el origen.</p>

        <p><strong>Ejercicio 2: Curvas de nivel de la función <i>f</i>(<i>x</i>, <i>y</i>) = <i>y</i>² + <i>x</i>² − 2<i>x</i> (Ejercicio III.ii)</strong><br>
        • <em>Solución explicada:</em> Igualamos la expresión a la constante de nivel <span class="math-text"><i>k</i></span>:<br>
        <span class="math-text"><i>x</i>² − 2<i>x</i> + <i>y</i>² = <i>k</i></span><br>
        Completando el trinomio cuadrado perfecto en la variable <span class="math-text"><i>x</i></span>:<br>
        <span class="math-text">(<i>x</i>² − 2<i>x</i> + 1) + <i>y</i>² = <i>k</i> + 1 ⇒ (<i>x</i> − 1)² + <i>y</i>² = <i>k</i> + 1</span><br>
        Para que existan puntos reales en el plano, el segundo miembro no puede ser negativo, por lo que <span class="math-text"><i>k</i> + 1 ≥ 0 ⇒ <i>k</i> ≥ −1</span>. Esto demuestra que el valor mínimo de la función es <span class="math-text">−1</span> y su rango es <span class="math-text">[−1, ∞)</span>.<br>
        1) Si <span class="math-text"><i>k</i> = −1</span>: <span class="math-text">(<i>x</i> − 1)² + <i>y</i>² = 0</span>. La curva de nivel degenera en el único punto <span class="math-text">(1, 0)</span>, que es el mínimo global de la superficie (vértice del paraboloide circular).<br>
        2) Si <span class="math-text"><i>k</i> &gt; −1</span>: La ecuación representa una familia de <strong>circunferencias concéntricas con centro fijo en <span class="math-text">(1, 0)</span></strong> y radio variable <span class="math-text"><i>r</i> = √<span class="math-radical"><i>k</i> + 1</span></span>.<br>
        Por ejemplo, para <span class="math-text"><i>k</i> = 0</span> el radio es <span class="math-text"><i>r</i> = 1</span> (circunferencia que pasa por el origen); para <span class="math-text"><i>k</i> = 3</span> el radio es <span class="math-text"><i>r</i> = 2</span>; y para <span class="math-text"><i>k</i> = 8</span> el radio es <span class="math-text"><i>r</i> = 3</span>.</p>

        <p><strong>Ejercicio 3: Curvas de nivel de la función <i>f</i>(<i>x</i>, <i>y</i>) = <i>y</i>² − <i>x</i>² (Ejercicio III.iii)</strong><br>
        • <em>Solución explicada:</em> Planteamos la ecuación <span class="math-text"><i>y</i>² − <i>x</i>² = <i>k</i></span>:<br>
        1) Si <span class="math-text"><i>k</i> = 0</span>: <span class="math-text"><i>y</i>² − <i>x</i>² = 0 ⇒ (<i>y</i> − <i>x</i>)(<i>y</i> + <i>x</i>) = 0</span>. La curva de nivel cero es el par de <strong>rectas secantes perpendiculares <span class="math-text"><i>y</i> = <i>x</i></span> y <span class="math-text"><i>y</i> = −<i>x</i></span></strong> que se cruzan en el origen a 45° con los ejes coordenados y actúan como asíntotas comunes para toda la familia.<br>
        2) Si <span class="math-text"><i>k</i> &gt; 0</span>: Dividiendo entre <span class="math-text"><i>k</i></span> resulta <span class="math-text"><span class="math-fraction"><span><i>y</i>²</span><span><i>k</i></span></span> − <span class="math-fraction"><span><i>x</i>²</span><span><i>k</i></span></span> = 1</span>. Son <strong>hipérbolas equiláteras con eje focal vertical</strong> sobre el eje <span class="math-text"><i>Y</i></span>, con vértices en <span class="math-text">(0, ±√<span class="math-radical"><i>k</i></span>)</span>.<br>
        3) Si <span class="math-text"><i>k</i> &lt; 0</span>: Escribiendo <span class="math-text"><i>k</i> = −<i>c</i></span> con <span class="math-text"><i>c</i> &gt; 0</span>, obtenemos <span class="math-text"><i>x</i>² − <i>y</i>² = <i>c</i> ⇒ <span class="math-fraction"><span><i>x</i>²</span><span><i>c</i></span></span> − <span class="math-fraction"><span><i>y</i>²</span><span><i>c</i></span></span> = 1</span>. Son <strong>hipérbolas equiláteras con eje focal horizontal</strong> sobre el eje <span class="math-text"><i>X</i></span>, con vértices en <span class="math-text">(±√<span class="math-radical"><i>c</i></span>, 0)</span>.<br>
        Este conjunto de curvas describe con precisión el punto de ensilladura (silla de montar) del paraboloide hiperbólico en el origen.</p>

        <p><strong>Ejercicio 4: Superficie de nivel de <i>f</i>(<i>x</i>, <i>y</i>, <i>z</i>) = <span class="math-fraction"><span><i>x</i>² + <i>y</i>²</span><span>(<i>z</i> − 2)²</span></span> con <i>x</i>, <i>y</i>, <i>z</i> ≥ 0 y <i>z</i> ≠ 2 (Ejercicio IV.ii)</strong><br>
        • <em>Solución explicada:</em> Determinamos primero las restricciones del dominio. Para evitar la división entre cero en el denominador se exige estrictamente <span class="math-text"><i>z</i> ≠ 2</span>, de modo que el plano horizontal <span class="math-text"><i>z</i> = 2</span> queda excluido y en particular el punto del vértice <span class="math-text">(0, 0, 2) ∉ dom <i>f</i></span>. Junto con la condición de no negatividad para las tres variables, el dominio es:<br>
        <span class="math-text">dom <i>f</i> = {(<i>x</i>, <i>y</i>, <i>z</i>) ∈ ℝ³ | <i>x</i> ≥ 0, <i>y</i> ≥ 0, <i>z</i> ≥ 0, <i>z</i> ≠ 2}</span>.</p>

        <p>Para determinar las superficies de nivel igualamos la función a una constante real arbitraria <span class="math-text"><i>k</i> ∈ ℝ</span>:<br>
        <span class="math-text"><span class="math-fraction"><span><i>x</i>² + <i>y</i>²</span><span>(<i>z</i> − 2)²</span></span> = <i>k</i></span><br>
        Multiplicando ambos miembros por el denominador estrictamente positivo <span class="math-text">(<i>z</i> − 2)² &gt; 0</span> (válido en todo el dominio ya que <span class="math-text"><i>z</i> ≠ 2</span>), obtenemos la ecuación equivalente fundamental:<br>
        <span class="math-text"><i>x</i>² + <i>y</i>² = <i>k</i>(<i>z</i> − 2)²</span></p>

        <p>Analizamos exhaustivamente el comportamiento geométrico según el valor de la constante <span class="math-text"><i>k</i></span> <strong>sin dividir entre <span class="math-text"><i>k</i></span> cuando <span class="math-text"><i>k</i> = 0</span></strong>:</p>

        <p><strong>1) Caso <i>k</i> &lt; 0 (Conjunto de nivel vacío):</strong><br>
        En el primer miembro, como <span class="math-text"><i>x</i>, <i>y</i> ∈ ℝ</span> se cumple siempre que <span class="math-text"><i>x</i>² + <i>y</i>² ≥ 0</span>. En el segundo miembro, siendo <span class="math-text">(<i>z</i> − 2)² &gt; 0</span> y <span class="math-text"><i>k</i> &lt; 0</span>, el producto es estrictamente negativo: <span class="math-text"><i>k</i>(<i>z</i> − 2)² &lt; 0</span>. Dado que un número real no negativo nunca puede igualar a uno estrictamente negativo, la ecuación carece de soluciones reales:<br>
        <span class="math-text"><i>S</i><sub><i>k</i></sub> = ∅ &nbsp;(conjunto vacío)</span><br>
        Esto confirma con rigor que los valores negativos no pertenecen al rango de la función (<span class="math-text">rang <i>f</i> = [0, ∞)</span>).</p>

        <p><strong>2) Caso <i>k</i> = 0 (Conjunto sobre el semieje <i>Z</i>, con <i>z</i> ≠ 2):</strong><br>
        Sustituimos directamente <span class="math-text"><i>k</i> = 0</span> en la ecuación <span class="math-text"><i>x</i>² + <i>y</i>² = <i>k</i>(<i>z</i> − 2)²</span> sin dividir entre <span class="math-text"><i>k</i></span>:<br>
        <span class="math-text"><i>x</i>² + <i>y</i>² = 0 · (<i>z</i> − 2)² = 0 ⇒ <i>x</i>² + <i>y</i>² = 0</span><br>
        La suma de dos cuadrados no negativos sólo es cero cuando ambos sumandos se anulan simultáneamente:<br>
        <span class="math-text"><i>x</i> = 0 &nbsp; e &nbsp; <i>y</i> = 0</span><br>
        Incorporando las restricciones del dominio (<span class="math-text"><i>x</i> ≥ 0, <i>y</i> ≥ 0, <i>z</i> ≥ 0, <i>z</i> ≠ 2</span>), el conjunto de nivel para <span class="math-text"><i>k</i> = 0</span> es:<br>
        <span class="math-text"><i>S</i>₀ = {(0, 0, <i>z</i>) ∈ ℝ³ | <i>z</i> ≥ 0, <i>z</i> ≠ 2}</span><br>
        Geométricamente no es una superficie bidimensional, sino un <strong>conjunto degenerado</strong>: corresponde a la <strong>semirrecta sobre el semieje no negativo <i>Z</i></strong> (desde el origen <span class="math-text">(0, 0, 0)</span> hacia <span class="math-text">+∞</span>), con el punto <span class="math-text">(0, 0, 2)</span> <strong>excluido (perforado)</strong> debido a la restricción del denominador.</p>

        <p><strong>3) Caso <i>k</i> &gt; 0 (Superficie cónica restringida al dominio original, excluyendo el vértice):</strong><br>
        Al ser <span class="math-text"><i>k</i> &gt; 0</span>, es válido dividir entre la constante positiva <span class="math-text"><i>k</i></span> para obtener la ecuación canónica:<br>
        <span class="math-text"><span class="math-fraction"><span><i>x</i>²</span><span><i>k</i></span></span> + <span class="math-fraction"><span><i>y</i>²</span><span><i>k</i></span></span> = (<i>z</i> − 2)² &nbsp;⇒&nbsp; <i>x</i>² + <i>y</i>² = (√<span class="math-radical"><i>k</i></span>(<i>z</i> − 2))²</span><br>
        Esta ecuación define en <span class="math-text">ℝ³</span> un <strong>cono circular recto</strong> con eje de simetría sobre la recta vertical <span class="math-text"><i>x</i> = 0, <i>y</i> = 0</span> y vértice geométrico situado en el punto <span class="math-text">(0, 0, 2)</span>.<br>
        Al aplicar estrictamente las condiciones del dominio original:<br>
        • <strong>Restricción al primer octante:</strong> Dado que <span class="math-text"><i>x</i> ≥ 0</span> e <span class="math-text"><i>y</i> ≥ 0</span>, para cada cota fija <span class="math-text"><i>z</i> = <i>c</i> ≠ 2</span> la sección horizontal no es una circunferencia completa, sino un <strong>cuadrante de circunferencia</strong> de radio <span class="math-text"><i>r</i> = √<span class="math-radical"><i>k</i></span>|<i>c</i> − 2|</span> contenido en el primer cuadrante.<br>
        • <strong>Exclusión indispensable del vértice (0, 0, 2):</strong> Dado que <span class="math-text"><i>z</i> ≠ 2</span> por definición de la función, <strong>el vértice (0, 0, 2) no pertenece a la superficie de nivel</strong> (es un punto excluido/perforado). La superficie cónica queda así compuesta por dos mantos abiertos y separados: el manto inferior para <span class="math-text">0 ≤ <i>z</i> &lt; 2</span> (cuya base en el plano <span class="math-text"><i>z</i> = 0</span> es el cuadrante <span class="math-text"><i>x</i>² + <i>y</i>² = 4<i>k</i></span>) y el manto superior abierto hacia arriba para <span class="math-text"><i>z</i> &gt; 2</span>.<br>
        • <strong>Apertura modulada por <i>k</i>:</strong> La constante positiva <span class="math-text"><i>k</i></span> controla el ángulo de apertura del cono: valores mayores de <span class="math-text"><i>k</i></span> producen conos más anchos y aplanados, mientras que cuando <span class="math-text"><i>k</i> → 0⁺</span> el cono se hace infinitesimalmente estrecho, colapsando en el límite exactamente sobre la semirrecta del caso <span class="math-text"><i>k</i> = 0</span>.</p>`
    },
    {
      title: 'Límites',
      content: `
        <h2>Límites de funciones de varias variables</h2>
        <p>En el cálculo de una sola variable <span class="math-text"><i>y</i> = <i>f</i>(<i>x</i>)</span>, evaluar el límite cuando <span class="math-text"><i>x</i> → <i>a</i></span> consiste únicamente en analizar dos direcciones posibles a lo largo de la recta real: la aproximación por la izquierda (<span class="math-text"><i>x</i> → <i>a</i>⁻</span>) y por la derecha (<span class="math-text"><i>x</i> → <i>a</i>⁺</span>). Si ambos límites laterales coinciden, el límite existe.</p>

        <p>En funciones de dos o más variables, los puntos de entrada <span class="math-text">(<i>x</i>, <i>y</i>)</span> pertenecen al plano cartesiano <span class="math-text">ℝ²</span> (o a <span class="math-text">ℝ<sup><i>n</i></sup></span>). Por la propia naturaleza bidimensional del plano, existen <strong>infinitas direcciones y curvas de aproximación</strong> hacia un punto objetivo <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span>: rectas de cualquier pendiente, parábolas, cúbicas, curvas sinusoidales o espirales. Para que el límite exista, la función debe converger exactamente al mismo valor numérico <span class="math-text"><i>L</i></span> sin importar por cuál de las infinitas trayectorias concebibles nos aproximemos.</p>

        <h3>Definición formal de límite multivariable (ε – δ)</h3>
        <p>El profesor David Chávez formula la definición rigurosa de límite en <span class="math-text">ℝ²</span> a partir de discos abiertos o entornos circulares reducidos:</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Definición formal: Límite de una función de dos variables (Definición 1 del folleto)</strong><span class="math-text"><span class="math-limit"><span>lim</span><sub>(<i>x</i>,<i>y</i>)→(<i>x</i>₀,<i>y</i>₀)</sub></span><i>f</i>(<i>x</i>, <i>y</i>) = <i>L</i></span></div>
          <p>Sea <span class="math-text"><i>f</i></span> una función de dos variables definida en un disco abierto <span class="math-text"><i>B</i>((<i>x</i>₀, <i>y</i>₀); <i>r</i>)</span>, excepto posiblemente en el punto <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span> mismo. Entonces el límite de <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>)</span> cuando <span class="math-text">(<i>x</i>, <i>y</i>)</span> se aproxima a <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span> es <span class="math-text"><i>L</i></span>, y se escribe:</p>
          <p><span class="math-text"><span class="math-limit"><span>lim</span><sub>(<i>x</i>,<i>y</i>)→(<i>x</i>₀,<i>y</i>₀)</sub></span><i>f</i>(<i>x</i>, <i>y</i>) = <i>L</i></span></p>
          <p>si para cualquier <span class="math-text"><i>ε</i> &gt; 0</span>, no importando qué tan pequeño sea, existe un <span class="math-text"><i>δ</i> &gt; 0</span> tal que:</p>
          <p><span class="math-text">|<i>f</i>(<i>x</i>, <i>y</i>) − <i>L</i>| &lt; <i>ε</i> &nbsp; siempre que &nbsp; 0 &lt; √<span class="math-radical">(<i>x</i> − <i>x</i>₀)² + (<i>y</i> − <i>y</i>₀)²</span> &lt; <i>δ</i></span>.</p>
        </div>

        <p><strong>Observación metodológica esencial del folleto:</strong> Nótese que la definición no exige en absoluto que la función esté definida en el punto <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span>. El límite describe exclusivamente el comportamiento de los valores de <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>)</span> en las cercanías del punto (en el entorno perforado o reducido), independientemente de que <span class="math-text"><i>f</i>(<i>x</i>₀, <i>y</i>₀)</span> exista, no exista o tenga un valor numérico diferente.</p>

        <p><strong>Generalización a ℝⁿ (Definición 2 del folleto):</strong><br>
        Para una función de <span class="math-text"><i>n</i></span> variables <span class="math-text"><i>f</i>: <i>A</i> ⊂ ℝ<sup><i>n</i></sup> → ℝ</span> con punto de acumulación <span class="math-text"><i>A</i></span>:<br>
        <span class="math-text"><span class="math-limit"><span>lim</span><sub><i>P</i>→<i>A</i></sub></span><i>f</i>(<i>P</i>) = <i>L</i> ⇔ ∀ <i>ε</i> &gt; 0, ∃ <i>δ</i> &gt; 0 | |<i>f</i>(<i>P</i>) − <i>L</i>| &lt; <i>ε</i> &nbsp; siempre que &nbsp; 0 &lt; ||<i>P</i> − <i>A</i>|| &lt; <i>δ</i></span>.</p>

        <h3>Interpretación geométrica tridimensional</h3>
        <p>La formulación <span class="math-text"><i>ε</i> − <i>δ</i></span> posee una lectura geométrica clara en el espacio tridimensional <span class="math-text">ℝ³</span>:</p>
        <p>1) En el plano <span class="math-text"><i>XY</i></span>, fijamos un disco abierto reducido de radio <span class="math-text"><i>δ</i></span> centrado en <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span>: <span class="math-text">0 &lt; (<i>x</i> − <i>x</i>₀)² + (<i>y</i> − <i>y</i>₀)² &lt; <i>δ</i>²</span>.<br>
        2) En el eje vertical <span class="math-text"><i>Z</i></span>, para cualquier tolerancia <span class="math-text"><i>ε</i> &gt; 0</span> trazamos dos planos horizontales paralelos: <span class="math-text"><i>z</i> = <i>L</i> − <i>ε</i></span> y <span class="math-text"><i>z</i> = <i>L</i> + <i>ε</i></span>.<br>
        3) Que el límite sea <span class="math-text"><i>L</i></span> significa que, por muy estrecha que sea la franja entre los planos horizontales <span class="math-text"><i>z</i> = <i>L</i> ± <i>ε</i></span>, siempre es posible encontrar un disco de radio <span class="math-text"><i>δ</i> &gt; 0</span> tal que toda la porción de la superficie <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span> situada sobre dicho disco quede <strong>enteramente contenida dentro de la franja</strong> <span class="math-text">(<i>L</i> − <i>ε</i>, <i>L</i> + <i>ε</i>)</span>, excepto posiblemente el punto central <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span>.</p>

        <h3>Propiedades algebraicas de los límites</h3>
        <p>Si los límites individuales <span class="math-text"><span class="math-limit"><span>lim</span><sub><i>P</i>→<i>A</i></sub></span><i>f</i>(<i>P</i>) = <i>L</i></span> y <span class="math-text"><span class="math-limit"><span>lim</span><sub><i>P</i>→<i>A</i></sub></span><i>g</i>(<i>P</i>) = <i>M</i></span> existen, se verifican las siguientes propiedades fundamentales:</p>
        <p>• <strong>Unicidad del límite:</strong> Si el límite de una función en un punto existe, dicho límite es <strong>único</strong>.<br>
        • <strong>Límite de la suma o resta:</strong> <span class="math-text"><span class="math-limit"><span>lim</span><sub><i>P</i>→<i>A</i></sub></span>[<i>f</i>(<i>P</i>) ± <i>g</i>(<i>P</i>)] = <i>L</i> ± <i>M</i></span>.<br>
        • <strong>Múltiplo escalar:</strong> <span class="math-text"><span class="math-limit"><span>lim</span><sub><i>P</i>→<i>A</i></sub></span>[<i>α</i>·<i>f</i>(<i>P</i>)] = <i>α</i>·<i>L</i></span>, para cualquier constante <span class="math-text"><i>α</i> ∈ ℝ</span>.<br>
        • <strong>Límite del producto:</strong> <span class="math-text"><span class="math-limit"><span>lim</span><sub><i>P</i>→<i>A</i></sub></span>[<i>f</i>(<i>P</i>)·<i>g</i>(<i>P</i>)] = <i>L</i>·<i>M</i></span>.<br>
        • <strong>Límite del cociente:</strong> <span class="math-text"><span class="math-limit"><span>lim</span><sub><i>P</i>→<i>A</i></sub></span><span class="math-fraction"><span><i>f</i>(<i>P</i>)</span><span><i>g</i>(<i>P</i>)</span></span> = <span class="math-fraction"><span><i>L</i></span><span><i>M</i></span></span></span>, siempre que <span class="math-text"><i>M</i> ≠ 0</span>.<br>
        • <strong>Potencias y raíces:</strong> <span class="math-text"><span class="math-limit"><span>lim</span><sub><i>P</i>→<i>A</i></sub></span>[<i>f</i>(<i>P</i>)]<sup><i>n</i></sup> = <i>L</i><sup><i>n</i></sup></span> y <span class="math-text"><span class="math-limit"><span>lim</span><sub><i>P</i>→<i>A</i></sub></span>√<span class="math-radical"><i>f</i>(<i>P</i>)</span> = √<span class="math-radical"><i>L</i></span></span> (con <span class="math-text"><i>L</i> &gt; 0</span> si el índice radical es par).</p>

        <h3>Métodos de evaluación de límites multivariables</h3>
        <p>Para calcular o investigar el límite de una función multivariable se emplean las siguientes estrategias analíticas:</p>
        <p>1) <strong>Sustitución directa:</strong> Si la función es continua en el punto <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span> (por ejemplo polinomios enteros en <span class="math-text"><i>x</i></span> e <span class="math-text"><i>y</i></span>, o funciones racionales con denominador no nulo), el límite se calcula evaluando directamente: <span class="math-text"><span class="math-limit"><span>lim</span><sub>(<i>x</i>,<i>y</i>)→(<i>x</i>₀,<i>y</i>₀)</sub></span><i>f</i>(<i>x</i>, <i>y</i>) = <i>f</i>(<i>x</i>₀, <i>y</i>₀)</span>.<br>
        2) <strong>Cancelación algebraica:</strong> Cuando se presenta una forma indeterminada del tipo <span class="math-text"><span class="math-fraction"><span>0</span><span>0</span></span></span>, se factorizan expresiones o se racionalizan raíces para simplificar factores que causan la indeterminación.<br>
        3) <strong>Teorema del emparedado (acotación o sándwich):</strong> Si logramos acotar la función entre dos funciones que tienden al mismo límite <span class="math-text"><i>L</i></span> (por ejemplo usando desigualdades notables como <span class="math-text"><i>x</i>² ≤ <i>x</i>² + <i>y</i>² ⇒ <span class="math-fraction"><span><i>x</i>²</span><span><i>x</i>² + <i>y</i>²</span></span> ≤ 1</span> o <span class="math-text">|<i>y</i>| ≤ √<span class="math-radical"><i>x</i>² + <i>y</i>²</span></span>), el límite de la función intermedia queda forzado a valer <span class="math-text"><i>L</i></span>.<br>
        4) <strong>Coordenadas polares:</strong> Al calcular límites cuando <span class="math-text">(<i>x</i>, <i>y</i>) → (0, 0)</span>, el cambio <span class="math-text"><i>x</i> = <i>r</i> cos <i>θ</i></span>, <span class="math-text"><i>y</i> = <i>r</i> sen <i>θ</i></span> transforma la distancia al origen en <span class="math-text"><i>r</i> = √<span class="math-radical"><i>x</i>² + <i>y</i>²</span> → 0⁺</span>. Si la expresión resultante tiende a un valor independiente de <span class="math-text"><i>θ</i></span> de manera uniforme, el límite existe.</p>

        <h3>Límites sobre conjuntos y criterio de trayectorias (Teoremas 1 y 2)</h3>
        <p>Cuando restringimos el acercamiento a una curva o subconjunto <span class="math-text"><i>S</i> ⊂ ℝ²</span> que pasa por <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span>, el límite se denota por <span class="math-text"><span class="math-limit"><span>lim</span><sub><i>P</i>→<i>P</i>₀, <i>P</i>∈<i>S</i></sub></span><i>f</i>(<i>P</i>)</span>. El folleto establece dos teoremas esenciales:</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Teorema 1: Consistencia sobre cualquier conjunto</strong></div>
          <p>Supongamos que <span class="math-text"><i>f</i></span> está definida en un disco abierto con centro <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span>, excepto posiblemente en dicho punto, y que <span class="math-text"><span class="math-limit"><span>lim</span><sub>(<i>x</i>,<i>y</i>)→(<i>x</i>₀,<i>y</i>₀)</sub></span><i>f</i>(<i>x</i>, <i>y</i>) = <i>L</i></span>. Entonces, si <span class="math-text"><i>S</i></span> es cualquier conjunto de puntos en <span class="math-text">ℝ²</span> que tiene a <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span> como punto de acumulación:</p>
          <p><span class="math-text"><span class="math-limit"><span>lim</span><sub>(<i>x</i>,<i>y</i>)→(<i>x</i>₀,<i>y</i>₀), <i>P</i>∈<i>S</i></sub></span><i>f</i>(<i>x</i>, <i>y</i>) = <i>L</i></span></p>
          <p>Es decir, el valor del límite no depende en modo alguno del camino o conjunto <span class="math-text"><i>S</i></span> elegido.</p>
        </div>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Teorema 2: Criterio de no existencia de límite</strong></div>
          <p>Si la función <span class="math-text"><i>f</i></span> produce límites diferentes cuando <span class="math-text">(<i>x</i>, <i>y</i>)</span> se aproxima al punto <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span> a través de dos conjuntos o curvas diferentes (<span class="math-text"><i>S</i>₁</span> y <span class="math-text"><i>S</i>₂</span>), entonces:</p>
          <p><span class="math-text"><span class="math-limit"><span>lim</span><sub>(<i>x</i>,<i>y</i>)→(<i>x</i>₀,<i>y</i>₀)</sub></span><i>f</i>(<i>x</i>, <i>y</i>) &nbsp; <strong>NO EXISTE</strong></span>.</p>
        </div>

        <p><strong>ADVERTENCIA METODOLÓGICA FUNDAMENTAL (Principio de asimetría de trayectorias):</strong><br>
        Tal como subraya textualmente el profesor Chávez en su folleto: <em>«El hecho de que por varios caminos diferentes se obtengan los mismos resultados, NO asegura la existencia del límite, ya que es imposible agotar todas las trayectorias»</em>.<br>
        • El análisis por trayectorias es un criterio <strong>exclusivamente de no existencia</strong>.<br>
        • <strong>Nunca afirmes la existencia de un límite únicamente porque varias trayectorias produzcan el mismo resultado.</strong> Aunque mil rectas den el mismo valor <span class="math-text"><i>L</i></span>, podría existir una curva parabólica o de grado superior que produzca un valor diferente, demostrando que el límite no existe.<br>
        • Para <em>afirmar</em> que un límite existe es obligatorio utilizar la definición formal <span class="math-text"><i>ε</i> − <i>δ</i></span>, propiedades de funciones continuas, el teorema del emparedado o coordenadas polares acotadas uniformemente.</p>

        <h3>Análisis mediante trayectorias rectas y parabólicas</h3>
        <p>• <strong>Trayectorias rectas (<span class="math-text"><i>y</i> = <i>mx</i></span>):</strong> Al evaluar el límite en el origen, se sustituye <span class="math-text"><i>y</i> = <i>mx</i></span> (y por separado el eje vertical <span class="math-text"><i>x</i> = 0</span>). Si la expresión final depende de la pendiente <span class="math-text"><i>m</i></span>, el límite no existe.<br>
        • <strong>Trayectorias parabólicas (<span class="math-text"><i>y</i> = <i>kx</i>²</span> o <span class="math-text"><i>x</i> = <i>ky</i>²</span>):</strong> En funciones racionales donde las potencias de <span class="math-text"><i>x</i></span> e <span class="math-text"><i>y</i></span> en el denominador son asimétricas (por ejemplo <span class="math-text"><i>x</i>⁴ + <i>y</i>²</span>), las rectas rectas <span class="math-text"><i>y</i> = <i>mx</i></span> arrojan falsamente siempre el mismo valor 0. Para balancear los grados del denominador y revelar la no existencia, se selecciona una curva cuyo grado equipare las potencias: haciendo <span class="math-text"><i>y</i> = <i>kx</i>²</span> se logra que <span class="math-text"><i>y</i>² = <i>k</i>²<i>x</i>⁴</span>, equiparando el grado 4 y haciendo que el límite dependa de <span class="math-text"><i>k</i></span>.</p>

        <h3>Ejemplos resueltos del folleto (paso a paso)</h3>

        <p><strong>Ejemplo resuelto 1: Demostración formal ε – δ de una función lineal (Ejemplo 1 del folleto, pág. 5)</strong><br>
        Demostrar mediante la definición de límite que <span class="math-text"><span class="math-limit"><span>lim</span><sub>(<i>x</i>,<i>y</i>)→(2,4)</sub></span>(5<i>x</i> − 3<i>y</i>) = −2</span>:</p>

        <p><strong>Paso 1: Planteamiento analítico de la meta</strong><br>
        Dado un <span class="math-text"><i>ε</i> &gt; 0</span> arbitrario, debemos hallar una regla para <span class="math-text"><i>δ</i> &gt; 0</span> tal que:<br>
        <span class="math-text">|(5<i>x</i> − 3<i>y</i>) − (−2)| &lt; <i>ε</i> &nbsp; siempre que &nbsp; 0 &lt; √<span class="math-radical">(<i>x</i> − 2)² + (<i>y</i> − 4)²</span> &lt; <i>δ</i></span>.</p>

        <p><strong>Paso 2: Transformación de la expresión en términos de (x − 2) e (y − 4)</strong><br>
        Reescribimos la expresión lineal agrupando los incrementos respecto al punto <span class="math-text">(2, 4)</span>:<br>
        <span class="math-text">|5<i>x</i> − 3<i>y</i> + 2| = |5<i>x</i> − 10 − 3<i>y</i> + 12| = |5(<i>x</i> − 2) − 3(<i>y</i> − 4)|</span>.</p>

        <p><strong>Paso 3: Aplicación de la desigualdad triangular y acotación</strong><br>
        Por la desigualdad triangular <span class="math-text">|<i>a</i> + <i>b</i>| ≤ |<i>a</i>| + |<i>b</i>|</span>:<br>
        <span class="math-text">|5(<i>x</i> − 2) − 3(<i>y</i> − 4)| ≤ 5|<i>x</i> − 2| + 3|<i>y</i> − 4|</span>.<br>
        Recordemos que cada componente cartesiana es menor o igual que la distancia euclidiana total:<br>
        <span class="math-text">|<i>x</i> − 2| = √<span class="math-radical">(<i>x</i> − 2)²</span> ≤ √<span class="math-radical">(<i>x</i> − 2)² + (<i>y</i> − 4)²</span> &lt; <i>δ</i></span><br>
        <span class="math-text">|<i>y</i> − 4| = √<span class="math-radical">(<i>y</i> − 4)²</span> ≤ √<span class="math-radical">(<i>x</i> − 2)² + (<i>y</i> − 4)²</span> &lt; <i>δ</i></span>.<br>
        Por consiguiente:<br>
        <span class="math-text">5|<i>x</i> − 2| + 3|<i>y</i> − 4| &lt; 5<i>δ</i> + 3<i>δ</i> = 8<i>δ</i></span>.</p>

        <p><strong>Paso 4: Elección de δ y conclusión formal</strong><br>
        Para que se cumpla <span class="math-text">8<i>δ</i> ≤ <i>ε</i></span>, basta elegir <span class="math-text"><i>δ</i> = <span class="math-fraction"><span><i>ε</i></span><span>8</span></span></span>.<br>
        Así, para cualquier <span class="math-text"><i>ε</i> &gt; 0</span>, tomando <span class="math-text"><i>δ</i> = <span class="math-fraction"><span><i>ε</i></span><span>8</span></span></span> se garantiza que <span class="math-text">|(5<i>x</i> − 3<i>y</i>) − (−2)| &lt; <i>ε</i></span> cuando la distancia es menor a <span class="math-text"><i>δ</i></span>, quedando formalmente demostrado que el límite es <span class="math-text">−2</span>.</p>

        <p><strong>Ejemplo resuelto 2: Demostración ε – δ con términos cuadráticos y acotación previa (Ejemplo 2 del folleto, pág. 6)</strong><br>
        Demostrar formalmente que <span class="math-text"><span class="math-limit"><span>lim</span><sub>(<i>x</i>,<i>y</i>)→(2,4)</sub></span>(<i>x</i>² + 2<i>x</i> − <i>y</i>) = 4</span>:</p>

        <p><strong>Paso 1: Planteamiento analítico</strong><br>
        Queremos probar que para todo <span class="math-text"><i>ε</i> &gt; 0</span> existe <span class="math-text"><i>δ</i> &gt; 0</span> tal que <span class="math-text">|(<i>x</i>² + 2<i>x</i> − <i>y</i>) − 4| &lt; <i>ε</i></span> siempre que <span class="math-text">0 &lt; √<span class="math-radical">(<i>x</i> − 2)² + (<i>y</i> − 4)²</span> &lt; <i>δ</i></span>.</p>

        <p><strong>Paso 2: Descomposición en potencias centradas en (2, 4)</strong><br>
        Completamos cuadrados y acomodamos los términos:<br>
        <span class="math-text"><i>x</i>² + 2<i>x</i> − <i>y</i> − 4 = (<i>x</i>² − 4<i>x</i> + 4) + 6<i>x</i> − 12 − <i>y</i> + 4 = (<i>x</i> − 2)² + 6(<i>x</i> − 2) − (<i>y</i> − 4)</span>.<br>
        Aplicando valor absoluto y desigualdad triangular:<br>
        <span class="math-text">|(<i>x</i>² + 2<i>x</i> − <i>y</i>) − 4| ≤ |<i>x</i> − 2|² + 6|<i>x</i> − 2| + |<i>y</i> − 4| &lt; <i>δ</i>² + 6<i>δ</i> + <i>δ</i> = <i>δ</i>² + 7<i>δ</i></span>.</p>

        <p><strong>Paso 3: Control del término cuadrático estableciendo δ ≤ 1</strong><br>
        Como observó el profesor Chávez, si restringimos inicialmente <span class="math-text"><i>δ</i> ≤ 1</span>, entonces <span class="math-text"><i>δ</i>² ≤ <i>δ</i></span>. Por lo tanto:<br>
        <span class="math-text"><i>δ</i>² + 7<i>δ</i> ≤ <i>δ</i> + 7<i>δ</i> = 8<i>δ</i></span>.</p>

        <p><strong>Paso 4: Elección del mínimo para δ</strong><br>
        Para asegurar <span class="math-text">8<i>δ</i> ≤ <i>ε</i></span> requerimos <span class="math-text"><i>δ</i> ≤ <span class="math-fraction"><span><i>ε</i></span><span>8</span></span></span>. Tomando conjuntamente:<br>
        <span class="math-text"><i>δ</i> = min(1, <span class="math-fraction"><span><i>ε</i></span><span>8</span></span>)</span><br>
        se satisfacen simultáneamente ambas desigualdades y se prueba que el límite es exactamente <span class="math-text">4</span>.</p>

        <p><strong>Ejemplo resuelto 3: Demostración ε – δ con indeterminación en el origen (Ejemplo 3 del folleto, pág. 6-7)</strong><br>
        Probar por definición que <span class="math-text"><span class="math-limit"><span>lim</span><sub>(<i>x</i>,<i>y</i>)→(0,0)</sub></span><span class="math-fraction"><span><i>x</i>⁴ + <i>y</i>⁴</span><span><i>x</i>² + <i>y</i>²</span></span> = 0</span>:</p>

        <p>• <em>Solución explicada:</em> En el origen la función no está definida pues el denominador se anula. Para probar que <span class="math-text"><i>L</i> = 0</span>, buscamos acotar <span class="math-text">|<span class="math-fraction"><span><i>x</i>⁴ + <i>y</i>⁴</span><span><i>x</i>² + <i>y</i>²</span></span> − 0| &lt; <i>ε</i></span> siempre que <span class="math-text">0 &lt; √<span class="math-radical"><i>x</i>² + <i>y</i>²</span> &lt; <i>δ</i> ⇔ 0 &lt; <i>x</i>² + <i>y</i>² &lt; <i>δ</i>²</span>.<br>
        Desarrollando el binomio cuadrado de <span class="math-text"><i>x</i>² + <i>y</i>²</span>:<br>
        <span class="math-text">(<i>x</i>² + <i>y</i>²)(<i>x</i>² + <i>y</i>²) = <i>x</i>⁴ + 2<i>x</i>²<i>y</i>² + <i>y</i>⁴</span>.<br>
        Como <span class="math-text">2<i>x</i>²<i>y</i>² ≥ 0</span> para todos los reales, si omitimos este término positivo obtenemos:<br>
        <span class="math-text"><i>x</i>⁴ + <i>y</i>⁴ ≤ <i>x</i>⁴ + 2<i>x</i>²<i>y</i>² + <i>y</i>⁴ = (<i>x</i>² + <i>y</i>²)²</span>.<br>
        Dividiendo entre la cantidad positiva <span class="math-text"><i>x</i>² + <i>y</i>² &gt; 0</span>:<br>
        <span class="math-text"><span class="math-fraction"><span><i>x</i>⁴ + <i>y</i>⁴</span><span><i>x</i>² + <i>y</i>²</span></span> ≤ <i>x</i>² + <i>y</i>² &lt; <i>δ</i>²</span>.<br>
        Para que <span class="math-text"><i>δ</i>² ≤ <i>ε</i></span>, basta elegir <span class="math-text"><i>δ</i> = √<span class="math-radical"><i>ε</i></span></span>. Con esta elección se cumple estrictamente la definición y queda verificado que el límite es <span class="math-text">0</span>.</p>

        <p><strong>Ejemplo resuelto 4: No existencia de límite mediante rectas (Ejemplo 4 del folleto, pág. 8-9)</strong><br>
        Demuestre que <span class="math-text"><span class="math-limit"><span>lim</span><sub>(<i>x</i>,<i>y</i>)→(0,0)</sub></span><span class="math-fraction"><span><i>xy</i></span><span><i>x</i>² + <i>y</i>²</span></span></span> no existe:</p>

        <p>• <em>Solución explicada:</em> Nos aproximamos al origen a través de la familia de rectas que pasan por <span class="math-text">(0, 0)</span> con pendiente <span class="math-text"><i>m</i></span>: <span class="math-text"><i>y</i> = <i>mx</i></span>.<br>
        Sustituyendo <span class="math-text"><i>y</i> = <i>mx</i></span> en la función:<br>
        <span class="math-text"><i>f</i>(<i>x</i>, <i>mx</i>) = <span class="math-fraction"><span><i>x</i>(<i>mx</i>)</span><span><i>x</i>² + (<i>mx</i>)²</span></span> = <span class="math-fraction"><span><i>mx</i>²</span><span><i>x</i>²(1 + <i>m</i>²)</span></span> = <span class="math-fraction"><span><i>m</i></span><span>1 + <i>m</i>²</span></span></span>.<br>
        Calculando el límite cuando <span class="math-text"><i>x</i> → 0</span>:<br>
        <span class="math-text"><span class="math-limit"><span>lim</span><sub><i>x</i>→0</sub></span><span class="math-fraction"><span><i>m</i></span><span>1 + <i>m</i>²</span></span> = <span class="math-fraction"><span><i>m</i></span><span>1 + <i>m</i>²</span></span></span>.<br>
        El valor del límite depende directamente de la pendiente <span class="math-text"><i>m</i></span> de la recta elegida:<br>
        • Por el eje <span class="math-text"><i>X</i></span> (<span class="math-text"><i>y</i> = 0</span>, <span class="math-text"><i>m</i> = 0</span>): el resultado es <span class="math-text">0</span>.<br>
        • Por la recta <span class="math-text"><i>y</i> = <i>x</i></span> (<span class="math-text"><i>m</i> = 1</span>): el resultado es <span class="math-text"><span class="math-fraction"><span>1</span><span>1 + 1²</span></span> = <span class="math-fraction"><span>1</span><span>2</span></span></span>.<br>
        • Por la recta <span class="math-text"><i>y</i> = −<i>x</i></span> (<span class="math-text"><i>m</i> = −1</span>): el resultado es <span class="math-text">−<span class="math-fraction"><span>1</span><span>2</span></span></span>.<br>
        Como distintas trayectorias arrojan límites diferentes, por el Teorema 2 el límite <strong>no existe</strong>.</p>

        <p><strong>Ejemplo resuelto 5: No existencia desenmascarada por trayectorias parabólicas (Fallo del criterio de rectas)</strong><br>
        Demuestre que <span class="math-text"><span class="math-limit"><span>lim</span><sub>(<i>x</i>,<i>y</i>)→(0,0)</sub></span><span class="math-fraction"><span><i>x</i>²<i>y</i></span><span><i>x</i>⁴ + <i>y</i>²</span></span></span> no existe:</p>

        <p>• <em>Solución explicada:</em><br>
        1) Si nos aproximamos únicamente por la familia de rectas <span class="math-text"><i>y</i> = <i>mx</i></span>:<br>
        <span class="math-text"><span class="math-limit"><span>lim</span><sub><i>x</i>→0</sub></span><span class="math-fraction"><span><i>x</i>²(<i>mx</i>)</span><span><i>x</i>⁴ + <i>m</i>²<i>x</i>²</span></span> = <span class="math-limit"><span>lim</span><sub><i>x</i>→0</sub></span><span class="math-fraction"><span><i>mx</i>³</span><span><i>x</i>²(<i>x</i>² + <i>m</i>²)</span></span> = <span class="math-limit"><span>lim</span><sub><i>x</i>→0</sub></span><span class="math-fraction"><span><i>mx</i></span><span><i>x</i>² + <i>m</i>²</span></span> = 0</span>.<br>
        (Y sobre el eje vertical <span class="math-text"><i>x</i> = 0</span>, <span class="math-text"><span class="math-limit"><span>lim</span><sub><i>y</i>→0</sub></span><span class="math-fraction"><span>0</span><span><i>y</i>²</span></span> = 0</span>).<br>
        ¡Todas las líneas rectas que pasan por el origen producen exactamente el mismo valor <span class="math-text">0</span>!<br>
        2) ¿Significa esto que el límite existe y vale 0? <strong>¡No!</strong> Como advertimos, que infinitas rectas den el mismo valor no garantiza la existencia.<br>
        3) Observando los grados del denominador (<span class="math-text"><i>x</i>⁴</span> y <span class="math-text"><i>y</i>²</span>), para equiparar los exponentes ensayamos la trayectoria parabólica <span class="math-text"><i>y</i> = <i>kx</i>²</span>:<br>
        <span class="math-text"><span class="math-limit"><span>lim</span><sub><i>x</i>→0</sub></span><span class="math-fraction"><span><i>x</i>²(<i>kx</i>²)</span><span><i>x</i>⁴ + (<i>kx</i>²)²</span></span> = <span class="math-limit"><span>lim</span><sub><i>x</i>→0</sub></span><span class="math-fraction"><span><i>kx</i>⁴</span><span><i>x</i>⁴(1 + <i>k</i>²)</span></span> = <span class="math-fraction"><span><i>k</i></span><span>1 + <i>k</i>²</span></span></span>.<br>
        Al variar el parámetro de la parábola, obtenemos límites distintos: para <span class="math-text"><i>k</i> = 1</span> (<span class="math-text"><i>y</i> = <i>x</i>²</span>) da <span class="math-text"><span class="math-fraction"><span>1</span><span>2</span></span></span>, mientras que para <span class="math-text"><i>k</i> = 0</span> (<span class="math-text"><i>y</i> = 0</span>) da <span class="math-text">0</span>. Al existir dos caminos con resultados dispares (<span class="math-text"><span class="math-fraction"><span>1</span><span>2</span></span> ≠ 0</span>), el límite <strong>no existe</strong>.</p>

        <h3>Ejercicios de práctica propuestos en el folleto (con soluciones explicadas)</h3>

        <p><strong>Ejercicio 1: Evaluación por sustitución directa (Ejercicio I.i del folleto)</strong><br>
        Calcular <span class="math-text"><span class="math-limit"><span>lim</span><sub>(<i>x</i>,<i>y</i>)→(−1,2)</sub></span><span class="math-fraction"><span>2<i>xy</i></span><span><i>x</i>² + <i>y</i>²</span></span></span>.<br>
        • <em>Solución explicada:</em> Como la función es racional y el denominador evaluado en <span class="math-text">(−1, 2)</span> es <span class="math-text">(−1)² + 2² = 1 + 4 = 5 ≠ 0</span>, la función es continua en dicho punto. Aplicando álgebra de límites y evaluación directa:<br>
        <span class="math-text"><span class="math-limit"><span>lim</span><sub>(<i>x</i>,<i>y</i>)→(−1,2)</sub></span><span class="math-fraction"><span>2<i>xy</i></span><span><i>x</i>² + <i>y</i>²</span></span> = <span class="math-fraction"><span>2(−1)(2)</span><span>(−1)² + 2²</span></span> = −<span class="math-fraction"><span>4</span><span>5</span></span></span>.</p>

        <p><strong>Ejercicio 2: Demostración de no existencia por trayectorias en los ejes (Ejercicio I.ix del folleto)</strong><br>
        Evaluar <span class="math-text"><span class="math-limit"><span>lim</span><sub>(<i>x</i>,<i>y</i>)→(0,0)</sub></span><span class="math-fraction"><span><i>x</i>² − <i>y</i>²</span><span><i>x</i>² + <i>y</i>²</span></span></span>.<br>
        • <em>Solución explicada:</em> Analizamos el límite a lo largo de dos caminos elementales:<br>
        1) Aproximación a lo largo del eje <span class="math-text"><i>X</i></span> (<span class="math-text"><i>y</i> = 0</span>):<br>
        <span class="math-text"><span class="math-limit"><span>lim</span><sub><i>x</i>→0</sub></span><span class="math-fraction"><span><i>x</i>² − 0²</span><span><i>x</i>² + 0²</span></span> = <span class="math-limit"><span>lim</span><sub><i>x</i>→0</sub></span><span class="math-fraction"><span><i>x</i>²</span><span><i>x</i>²</span></span> = 1</span>.<br>
        2) Aproximación a lo largo del eje <span class="math-text"><i>Y</i></span> (<span class="math-text"><i>x</i> = 0</span>):<br>
        <span class="math-text"><span class="math-limit"><span>lim</span><sub><i>y</i>→0</sub></span><span class="math-fraction"><span>0² − <i>y</i>²</span><span>0² + <i>y</i>²</span></span> = <span class="math-limit"><span>lim</span><sub><i>y</i>→0</sub></span><span class="math-fraction"><span>−<i>y</i>²</span><span><i>y</i>²</span></span> = −1</span>.<br>
        Dado que los caminos arrojan valores diferentes (<span class="math-text">1 ≠ −1</span>), el límite <strong>no existe</strong>.</p>

        <p><strong>Ejercicio 3: No existencia de potencia cuadrática racional (Ejercicio III del folleto)</strong><br>
        Demuestre que <span class="math-text"><span class="math-limit"><span>lim</span><sub>(<i>x</i>,<i>y</i>)→(0,0)</sub></span>(<span class="math-fraction"><span><i>x</i>² − <i>y</i>²</span><span><i>x</i>² + <i>y</i>²</span></span>)²</span> no existe.<br>
        • <em>Solución explicada:</em> Seleccionamos dos trayectorias que pasan por el origen:<br>
        1) A lo largo del eje <span class="math-text"><i>X</i></span> (<span class="math-text"><i>y</i> = 0</span>):<br>
        <span class="math-text"><span class="math-limit"><span>lim</span><sub><i>x</i>→0</sub></span>(<span class="math-fraction"><span><i>x</i>²</span><span><i>x</i>²</span></span>)² = 1² = 1</span>.<br>
        2) A lo largo de la recta diagonal <span class="math-text"><i>y</i> = <i>x</i></span>:<br>
        <span class="math-text"><span class="math-limit"><span>lim</span><sub><i>x</i>→0</sub></span>(<span class="math-fraction"><span><i>x</i>² − <i>x</i>²</span><span><i>x</i>² + <i>x</i>²</span></span>)² = (<span class="math-fraction"><span>0</span><span>2<i>x</i>²</span></span>)² = 0² = 0</span>.<br>
        Como los límites en ambas trayectorias difieren (<span class="math-text">1 ≠ 0</span>), el límite <strong>no existe</strong>.</p>

        <p><strong>Ejercicio 4: Demostración formal ε – δ mediante acotación (Ejercicio II del folleto)</strong><br>
        Utilizando la definición de límite, demuestre que <span class="math-text"><span class="math-limit"><span>lim</span><sub>(<i>x</i>,<i>y</i>)→(0,0)</sub></span><span class="math-fraction"><span>5<i>x</i>²<i>y</i></span><span><i>x</i>² + <i>y</i>²</span></span> = 0</span>.<br>
        • <em>Solución explicada:</em> Para cualquier <span class="math-text"><i>ε</i> &gt; 0</span>, debemos encontrar <span class="math-text"><i>δ</i> &gt; 0</span> tal que <span class="math-text">|<span class="math-fraction"><span>5<i>x</i>²<i>y</i></span><span><i>x</i>² + <i>y</i>²</span></span> − 0| &lt; <i>ε</i></span> siempre que <span class="math-text">0 &lt; √<span class="math-radical"><i>x</i>² + <i>y</i>²</span> &lt; <i>δ</i></span>.<br>
        Observamos las siguientes propiedades de los números reales para todo <span class="math-text">(<i>x</i>, <i>y</i>) ≠ (0, 0)</span>:<br>
        1) Como <span class="math-text"><i>x</i>² ≤ <i>x</i>² + <i>y</i>²</span>, se tiene que <span class="math-text"><span class="math-fraction"><span><i>x</i>²</span><span><i>x</i>² + <i>y</i>²</span></span> ≤ 1</span>.<br>
        2) Además, <span class="math-text">|<i>y</i>| = √<span class="math-radical"><i>y</i>²</span> ≤ √<span class="math-radical"><i>x</i>² + <i>y</i>²</span> &lt; <i>δ</i></span>.<br>
        Por tanto, acotando el valor absoluto de la función:<br>
        <span class="math-text">|<span class="math-fraction"><span>5<i>x</i>²<i>y</i></span><span><i>x</i>² + <i>y</i>²</span></span>| = 5·<span class="math-fraction"><span><i>x</i>²</span><span><i>x</i>² + <i>y</i>²</span></span>·|<i>y</i>| ≤ 5·(1)·|<i>y</i>| &lt; 5<i>δ</i></span>.<br>
        Para que <span class="math-text">5<i>δ</i> ≤ <i>ε</i></span>, basta seleccionar <span class="math-text"><i>δ</i> = <span class="math-fraction"><span><i>ε</i></span><span>5</span></span></span>.<br>
        Con esta elección de <span class="math-text"><i>δ</i></span>, siempre que <span class="math-text">0 &lt; √<span class="math-radical"><i>x</i>² + <i>y</i>²</span> &lt; <i>δ</i></span> se verifica que <span class="math-text">|<span class="math-fraction"><span>5<i>x</i>²<i>y</i></span><span><i>x</i>² + <i>y</i>²</span></span> − 0| &lt; <i>ε</i></span>, demostrando con pleno rigor matemático que el límite existe y su valor es exactamente <span class="math-text">0</span>.</p>`
    },
    {
      title: 'Continuidad',
      content: `
        <h2>Continuidad de funciones de varias variables</h2>
        <p>El concepto de continuidad para funciones de dos y más variables generaliza la idea intuitiva de continuidad del cálculo de una variable: una función continua no presenta saltos abruptos, fracturas, interrupciones ni perforaciones en su gráfica tridimensional. Geométricamente, sobre una región conexa de su dominio, la gráfica de una función continua <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span> se visualiza como un manto continuo y sin rupturas.</p>

        <p><strong>Precisión conceptual fundamental (Continuidad vs. Suavidad o Diferenciabilidad):</strong><br>
        Es indispensable no confundir la <em>continuidad</em> con la <em>suavidad</em> o <em>diferenciabilidad</em>. Una función puede ser perfectamente continua en un punto o sobre toda una región y, sin embargo, <strong>no ser diferenciable</strong> (no ser suave, carecer de plano tangente o presentar aristas, vértices afilados y cúspides donde no existen derivadas parciales continuas).<br>
        Un ejemplo canónico es la superficie cónica <span class="math-text"><i>z</i> = √<span class="math-radical"><i>x</i>² + <i>y</i>²</span></span> o la superficie piramidal <span class="math-text"><i>z</i> = |<i>x</i>| + |<i>y</i>|</span>: ambas son continuas en todo el plano <span class="math-text">ℝ²</span> (incluyendo el origen <span class="math-text">(0, 0)</span>), pero en el origen presentan una punta o arista no suave donde la función no es diferenciable. La continuidad garantiza la cohesión espacial sin desprendimientos de la superficie; la diferenciabilidad, que se estudiará en lecciones posteriores, impone una condición más estricta de suavidad y existencia de plano tangente.</p>

        <h3>Las tres condiciones para la continuidad en un punto</h3>
        <p>En el folleto académico (Sección 1.6, pág. 9), el profesor David Chávez establece formalmente cuándo una función es continua en un punto específico <span class="math-text"><i>P</i>₀(<i>x</i>₀, <i>y</i>₀)</span>:</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Definición formal: Continuidad en un punto (Definición 4 del folleto)</strong></div>
          <p>Decimos que una función <span class="math-text"><i>f</i></span> es continua en el punto <span class="math-text"><i>P</i>₀(<i>x</i>₀, <i>y</i>₀)</span> si y sólo si se satisfacen <strong>simultáneamente</strong> las siguientes tres condiciones:</p>
          <p><strong>i)</strong> <span class="math-text"><i>f</i></span> está definida en <span class="math-text"><i>P</i>₀(<i>x</i>₀, <i>y</i>₀)</span> (es decir, existe el valor numérico real <span class="math-text"><i>f</i>(<i>x</i>₀, <i>y</i>₀)</span> en el dominio).<br>
          <strong>ii)</strong> Existe el límite multivariable finito:<br>
          <span class="math-text"><span class="math-limit"><span>lim</span><sub>(<i>x</i>,<i>y</i>)→(<i>x</i>₀,<i>y</i>₀)</sub></span><i>f</i>(<i>x</i>, <i>y</i>) = <i>L</i></span>, con <span class="math-text"><i>L</i> &lt; ∞</span>.<br>
          <strong>iii)</strong> El valor del límite coincide exactamente con el valor evaluado de la función:<br>
          <span class="math-text"><span class="math-limit"><span>lim</span><sub>(<i>x</i>,<i>y</i>)→(<i>x</i>₀,<i>y</i>₀)</sub></span><i>f</i>(<i>x</i>, <i>y</i>) = <i>f</i>(<i>x</i>₀, <i>y</i>₀) = <i>L</i></span>.</p>
        </div>

        <p>Si alguna de estas tres condiciones falla en un punto considerado, la función no es continua en dicho punto.</p>

        <h3>Distinción rigurosa: Existencia del límite vs. Continuidad y puntos no definidos</h3>
        <p>El folleto del profesor resalta las siguientes observaciones analíticas indispensables:</p>
        <p>• <strong>Límite sin continuidad (Discontinuidad evitable dentro del dominio extendido):</strong> Una función puede tener límite en <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span> y no ser continua en dicho punto. Esto sucede si la función no está definida en <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span> (falla la condición i), o bien si estando definida, el valor asignado difiere del límite (falla la condición iii). En este caso, la discontinuidad se denomina <em>evitable o removible</em> porque bastaría redefinir <span class="math-text"><i>f</i>(<i>x</i>₀, <i>y</i>₀) = <i>L</i></span> para restablecer la continuidad.<br>
        • <strong>Continuidad implica existencia de límite:</strong> Si una función es continua en <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span>, <strong>necesariamente tiene límite</strong> en dicho punto y, además, ese límite se puede calcular por evaluación directa inmediata: <span class="math-text"><span class="math-limit"><span>lim</span><sub>(<i>x</i>,<i>y</i>)→(<i>x</i>₀,<i>y</i>₀)</sub></span><i>f</i>(<i>x</i>, <i>y</i>) = <i>f</i>(<i>x</i>₀, <i>y</i>₀)</span>.<br>
        • <strong>No existencia de límite implica discontinuidad esencial:</strong> Si el límite no existe (por ejemplo, porque dos trayectorias arrojan valores distintos), la condición ii no se cumple y la discontinuidad es insalvable.<br>
        • <strong>Distinción entre «punto de discontinuidad» y «punto no definido»:</strong> La propiedad de continuidad se predica estrictamente en relación con los puntos del dominio de la función o de su frontera por límites relativos. Si un punto queda totalmente fuera del campo de existencia en los reales (como números negativos bajo una raíz par), la función <em>simplemente no está definida</em> en dichos puntos, debiendo evitarse catalogar como «discontinuos» a puntos donde la función ni siquiera tiene existencia real.</p>

        <h3>Continuidad sobre un conjunto (Definición 5 del folleto)</h3>
        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Definición formal: Continuidad en un conjunto S</strong></div>
          <p>La función <span class="math-text"><i>f</i></span> es continua en el conjunto <span class="math-text"><i>S</i> ⊂ ℝ²</span> si es continua en cada uno de los puntos que pertenecen a <span class="math-text"><i>S</i></span> (considerando límites relativos a <span class="math-text"><i>S</i></span> para puntos frontera).</p>
        </div>

        <h3>Propiedades de las funciones continuas (Sección 1.6, pág. 9-10)</h3>
        <p>El folleto establece los siguientes teoremas fundamentales:</p>
        <p>1. <strong>Álgebra de funciones continuas:</strong> Si <span class="math-text"><i>f</i></span> y <span class="math-text"><i>g</i></span> son continuas en un punto <span class="math-text"><i>P</i>₀</span> (o sobre un conjunto <span class="math-text"><i>S</i></span>), entonces:<br>
        • La suma y diferencia <span class="math-text"><i>f</i> ± <i>g</i></span> son continuas.<br>
        • El producto <span class="math-text"><i>f</i> · <i>g</i></span> es continuo.<br>
        • El cociente <span class="math-text"><span class="math-fraction"><span><i>f</i></span><span><i>g</i></span></span></span> es continuo en todo punto donde <span class="math-text"><i>g</i>(<i>P</i>₀) ≠ 0</span>.<br>
        2. <strong>Teorema de acotación en compactos:</strong> Si una función <span class="math-text"><i>f</i></span> es continua sobre un conjunto cerrado y acotado <span class="math-text"><i>S</i></span>, entonces la función es <strong>acotada</strong> sobre <span class="math-text"><i>S</i></span> (existen números reales <span class="math-text"><i>k</i>₁</span> y <span class="math-text"><i>k</i>₂</span> tales que <span class="math-text"><i>k</i>₁ ≤ <i>f</i>(<i>x</i>, <i>y</i>) ≤ <i>k</i>₂</span> para todo <span class="math-text">(<i>x</i>, <i>y</i>) ∈ <i>S</i></span>).<br>
        3. <strong>Teorema de los valores extremos (Weierstrass):</strong> Sea <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>)</span> continua sobre un conjunto cerrado y acotado <span class="math-text"><i>S</i></span>. Sean <span class="math-text"><i>m</i></span> y <span class="math-text"><i>M</i></span> los extremos inferior (mínimo absoluto) y superior (máximo absoluto) de <span class="math-text"><i>f</i></span> en <span class="math-text"><i>S</i></span>. Entonces <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>)</span> alcanza cada uno de los valores <span class="math-text"><i>m</i></span> y <span class="math-text"><i>M</i></span> al menos una vez en el conjunto <span class="math-text"><i>S</i></span>.</p>

        <h3>Familias de funciones continuas más usuales</h3>
        <p>De acuerdo con el folleto del profesor (pág. 10), las funciones elementales gozan de continuidad en todos los puntos donde están definidas:</p>
        <p>• <strong>Funciones constantes:</strong> <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = <i>k</i></span>, continuas en todo el plano cartesiano (planos horizontales paralelos al plano <span class="math-text"><i>XY</i></span>).<br>
        • <strong>Funciones polinómicas:</strong> Polinomios enteros en las variables <span class="math-text"><i>x</i></span> e <span class="math-text"><i>y</i></span> (por ejemplo <span class="math-text"><i>x</i>² + 3<i>xy</i> − 2<i>y</i>³</span>), continuas en todo <span class="math-text">ℝ²</span>.<br>
        • <strong>Funciones racionales:</strong> <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = <span class="math-fraction"><span><i>P</i>(<i>x</i>, <i>y</i>)</span><span><i>Q</i>(<i>x</i>, <i>y</i>)</span></span></span>, donde <span class="math-text"><i>P</i></span> y <span class="math-text"><i>Q</i></span> son polinomios; continuas en todo su dominio natural: <span class="math-text"><i>Q</i>(<i>x</i>, <i>y</i>) ≠ 0</span>.<br>
        • <strong>Funciones circulares e hiperbólicas:</strong> Seno, coseno y sus combinaciones, continuas en todo su dominio.<br>
        • <strong>Función exponencial:</strong> <span class="math-text"><i>e</i><sup><i>g</i>(<i>x</i>, <i>y</i>)</sup></span>, continua en todo punto donde el exponente <span class="math-text"><i>g</i>(<i>x</i>, <i>y</i>)</span> sea continuo.<br>
        • <strong>Función logarítmica:</strong> <span class="math-text">ln(<i>g</i>(<i>x</i>, <i>y</i>))</span>, continua en todos los puntos donde su argumento sea estrictamente positivo: <span class="math-text"><i>g</i>(<i>x</i>, <i>y</i>) &gt; 0</span>.</p>

        <h3>Geometría de las discontinuidades y puntos no definidos</h3>
        <p>En el cálculo multivariable, clasificar la estructura geométrica donde una expresión analítica pierde continuidad o deja de estar definida en <span class="math-text">ℝ²</span> resulta fundamental:</p>
        <p>• <strong>Puntos aislados de discontinuidad:</strong> Puntos puntuales <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span> (como el origen en <span class="math-text">ln √<span class="math-radical"><i>x</i>² + <i>y</i>²</span></span> o en funciones a trozos con valor puntual alterado) donde la función no es continua, rodeados enteramente por puntos donde la función sí es continua.<br>
        • <strong>Líneas o curvas de discontinuidad:</strong> Conjuntos de puntos que satisfacen una ecuación cartesiana <span class="math-text"><i>g</i>(<i>x</i>, <i>y</i>) = 0</span> que anula el denominador de una expresión racional en <span class="math-text">ℝ²</span>. Pueden ser rectas, circunferencias o parábolas.<br>
        • <strong>Fronteras y regiones fuera del dominio:</strong> Cuando intervienen raíces de índice par o logaritmos, la función posee un dominio delimitado por curvas frontera. En todo el interior y sobre la frontera de dicho dominio (mediante límites relativos) la función es continua; fuera del dominio, la función <em>no está definida</em> en los números reales.</p>

        <h3>Ejemplos resueltos del folleto (paso a paso)</h3>

        <p><strong>Ejemplo resuelto 1: Continuidad de una función racional en un punto (Ejemplo 5 del folleto, pág. 10)</strong><br>
        Investigue la continuidad de <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = <span class="math-fraction"><span>3 − <i>x</i> + <i>y</i></span><span>5 + <i>x</i> − 2<i>y</i></span></span></span> en el punto <span class="math-text">(1, 2)</span> y calcule el límite <span class="math-text"><span class="math-limit"><span>lim</span><sub>(<i>x</i>,<i>y</i>)→(1,2)</sub></span><span class="math-fraction"><span>3 − <i>x</i> + <i>y</i></span><span>5 + <i>x</i> − 2<i>y</i></span></span></span>:</p>

        <p><strong>Paso 1: Verificación de la condición i (Definición en el punto)</strong><br>
        Evaluamos la función directamente en <span class="math-text">(1, 2)</span>:<br>
        Numerador: <span class="math-text">3 − 1 + 2 = 4</span>.<br>
        Denominador: <span class="math-text">5 + 1 − 2(2) = 6 − 4 = 2</span>.<br>
        Como el denominador es <span class="math-text">2 ≠ 0</span>, el punto <span class="math-text">(1, 2)</span> pertenece al dominio de la función y toma el valor:<br>
        <span class="math-text"><i>f</i>(1, 2) = <span class="math-fraction"><span>4</span><span>2</span></span> = 2</span>. Se satisface la condición (i).</p>

        <p><strong>Paso 2: Verificación de la condición ii (Existencia del límite)</strong><br>
        La función es racional (cociente de polinomios continuos). Por las propiedades de las funciones continuas, toda función racional es continua en todo punto donde su denominador no sea cero. Como el denominador evaluado es <span class="math-text">2 ≠ 0</span>, el límite en <span class="math-text">(1, 2)</span> existe y se calcula por sustitución directa:<br>
        <span class="math-text"><span class="math-limit"><span>lim</span><sub>(<i>x</i>,<i>y</i>)→(1,2)</sub></span><span class="math-fraction"><span>3 − <i>x</i> + <i>y</i></span><span>5 + <i>x</i> − 2<i>y</i></span></span> = <span class="math-fraction"><span>3 − 1 + 2</span><span>5 + 1 − 2(2)</span></span> = <span class="math-fraction"><span>4</span><span>2</span></span> = 2</span>. Se satisface la condición (ii).</p>

        <p><strong>Paso 3: Verificación de la condición iii (Coincidencia de límite y valor)</strong><br>
        Observamos que <span class="math-text"><span class="math-limit"><span>lim</span><sub>(<i>x</i>,<i>y</i>)→(1,2)</sub></span><i>f</i>(<i>x</i>, <i>y</i>) = 2 = <i>f</i>(1, 2)</span>. Las tres condiciones se satisfacen simultáneamente. Se concluye con rigor que la función es <strong>continua en el punto (1, 2)</strong>.</p>

        <p><strong>Ejemplo resuelto 2: Discontinuidad puntual en una función logarítmica con radical (Ejemplo 6 del folleto, pág. 10)</strong><br>
        Investigue la continuidad de <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = ln √<span class="math-radical"><i>x</i>² + <i>y</i>²</span></span>:</p>

        <p><strong>Paso 1: Análisis de las componentes interiores</strong><br>
        La expresión subradical <span class="math-text"><i>x</i>² + <i>y</i>²</span> es un polinomio continuo en todo el plano <span class="math-text">ℝ²</span>. Además, al ser suma de cuadrados, <span class="math-text"><i>x</i>² + <i>y</i>² ≥ 0</span> para todo <span class="math-text">(<i>x</i>, <i>y</i>) ∈ ℝ²</span>, por lo que la raíz cuadrada <span class="math-text">√<span class="math-radical"><i>x</i>² + <i>y</i>²</span></span> está definida y es continua en todo el plano.</p>

        <p><strong>Paso 2: Análisis del dominio del logaritmo natural</strong><br>
        La función logaritmo natural exige estrictamente que su argumento sea estrictamente positivo: <span class="math-text">√<span class="math-radical"><i>x</i>² + <i>y</i>²</span> &gt; 0</span>, lo cual se cumple si y sólo si <span class="math-text"><i>x</i>² + <i>y</i>² &gt; 0</span>.<br>
        Por consiguiente, el dominio natural de la función es todo el plano excepto el origen: <span class="math-text">dom <i>f</i> = ℝ²  {(0, 0)}</span>.</p>

        <p><strong>Paso 3: Conclusión geométrica de continuidad</strong><br>
        En todo punto de su dominio <span class="math-text">(<i>x</i>, <i>y</i>) ≠ (0, 0)</span>, la función es composición de funciones continuas y está perfectamente definida. En el origen <span class="math-text">(0, 0)</span>, la función <strong>no está definida</strong> (<span class="math-text">ln(0)</span> no existe en <span class="math-text">ℝ</span>, fallando la condición i). En el contexto del plano <span class="math-text">ℝ²</span>, el origen <span class="math-text">(0, 0)</span> constituye un <strong>punto aislado de discontinuidad</strong> de la fórmula analítica.</p>

        <h3>Ejercicios de práctica propuestos en el folleto (con soluciones explicadas)</h3>

        <p><strong>Ejercicio 1: Análisis de continuidad en una función definida a trozos (Ejercicio V del folleto, pág. 11)</strong><br>
        Determine si la siguiente función <span class="math-text"><i>f</i></span> es continua o no en el punto <span class="math-text">(0, 1)</span>. Explique detalladamente su respuesta:<br>
        <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = { <i>x</i>² + sen(<i>xy</i>) &nbsp; si (<i>x</i>, <i>y</i>) ≠ (0, 1); &nbsp; 1 &nbsp; si (<i>x</i>, <i>y</i>) = (0, 1) }</span>.<br>
        • <em>Solución explicada:</em> Verificamos una a una las tres condiciones de la Definición 4 en <span class="math-text">(0, 1)</span>:<br>
        1) <strong>Condición i:</strong> La función está explícitamente definida en <span class="math-text">(0, 1)</span> mediante la segunda regla: <span class="math-text"><i>f</i>(0, 1) = 1</span>. Pertenece al dominio.<br>
        2) <strong>Condición ii:</strong> Evaluamos el límite cuando <span class="math-text">(<i>x</i>, <i>y</i>) → (0, 1)</span>. Para puntos <span class="math-text">(<i>x</i>, <i>y</i>) ≠ (0, 1)</span>, la regla es <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = <i>x</i>² + sen(<i>xy</i>)</span>. Por álgebra de funciones continuas (polinomio y seno), calculamos directamente:<br>
        <span class="math-text"><span class="math-limit"><span>lim</span><sub>(<i>x</i>,<i>y</i>)→(0,1)</sub></span>[<i>x</i>² + sen(<i>xy</i>)] = 0² + sen(0 · 1) = 0 + sen(0) = 0</span>.<br>
        El límite existe y vale <span class="math-text"><i>L</i> = 0</span>.<br>
        3) <strong>Condición iii:</strong> Comparamos el límite obtenido con el valor de la función:<br>
        <span class="math-text"><span class="math-limit"><span>lim</span><sub>(<i>x</i>,<i>y</i>)→(0,1)</sub></span><i>f</i>(<i>x</i>, <i>y</i>) = 0 ≠ 1 = <i>f</i>(0, 1)</span>.<br>
        La condición (iii) no se satisface. Concluimos que la función <strong>no es continua en (0, 1)</strong>. Como el límite existe pero difiere del valor asignado, presenta una <strong>discontinuidad evitable o removible</strong> (bastaría definir <span class="math-text"><i>f</i>(0, 1) = 0</span> para hacerla continua).</p>

        <p><strong>Ejercicio 2: Discontinuidad sobre una curva circular (Ejercicio IV.i del folleto, pág. 11)</strong><br>
        Hallar las líneas o curvas de discontinuidad de <span class="math-text"><i>z</i> = <span class="math-fraction"><span>1</span><span>1 − <i>x</i>² − <i>y</i>²</span></span></span>.<br>
        • <em>Solución explicada:</em> El numerador es constante y el denominador <span class="math-text">1 − <i>x</i>² − <i>y</i>²</span> es un polinomio continuo. La función es continua en todo su dominio natural <span class="math-text"><i>D</i> = {(<i>x</i>, <i>y</i>) ∈ ℝ² | <i>x</i>² + <i>y</i>² ≠ 1}</span>.<br>
        La expresión no está definida cuando el denominador se hace cero:<br>
        <span class="math-text">1 − <i>x</i>² − <i>y</i>² = 0 ⇒ <i>x</i>² + <i>y</i>² = 1</span>.<br>
        En todos los puntos de la circunferencia unitaria centrada en el origen, la función no está definida por división entre cero y diverge a infinito. En el espacio <span class="math-text">ℝ²</span>, dicha circunferencia representa una <strong>curva de discontinuidad</strong> de la regla analítica dada.</p>

        <p><strong>Ejercicio 3: Discontinuidad sobre una recta (Ejercicio IV.iv del folleto, pág. 11)</strong><br>
        Hallar la línea de discontinuidad de la función <span class="math-text"><i>z</i> = <span class="math-fraction"><span><i>x</i></span><span><i>x</i> + <i>y</i></span></span></span>.<br>
        • <em>Solución explicada:</em> Al ser cociente de dos polinomios lineales, la función es continua en todo su dominio <span class="math-text"><i>D</i> = {(<i>x</i>, <i>y</i>) ∈ ℝ² | <i>y</i> ≠ −<i>x</i>}</span>.<br>
        La división entre cero se produce cuando:<br>
        <span class="math-text"><i>x</i> + <i>y</i> = 0 ⇒ <i>y</i> = −<i>x</i></span>.<br>
        Por tanto, la <strong>recta <span class="math-text"><i>y</i> = −<i>x</i></span></strong> que cruza por el origen en el segundo y cuarto cuadrante constituye la <strong>línea de discontinuidad</strong> de la expresión en <span class="math-text">ℝ²</span>.</p>

        <p><strong>Ejercicio 4: Discontinuidad sobre una curva parabólica (Ejercicio IV.v del folleto, pág. 11)</strong><br>
        Hallar la curva de discontinuidad de <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = <span class="math-fraction"><span>2</span><span><i>y</i> − <i>x</i>²</span></span></span>.<br>
        • <em>Solución explicada:</em> La función racional es continua en todo su dominio <span class="math-text"><i>D</i> = {(<i>x</i>, <i>y</i>) ∈ ℝ² | <i>y</i> ≠ <i>x</i>²}</span>. La expresión deja de estar definida cuando el denominador se anula:<br>
        <span class="math-text"><i>y</i> − <i>x</i>² = 0 ⇒ <i>y</i> = <i>x</i>²</span>.<br>
        El conjunto de puntos sobre la <strong>parábola canónica <span class="math-text"><i>y</i> = <i>x</i>²</span></strong> conforma la <strong>curva de discontinuidad</strong> de la expresión analítica.</p>

        <p><strong>Ejercicio 5: Continuidad en el dominio con radicales dobles (Ejercicio IV.iii del folleto, pág. 11)</strong><br>
        Determinar el dominio y la continuidad de la función <span class="math-text"><i>z</i> = √<span class="math-radical"><i>x</i></span> · cos √<span class="math-radical"><i>x</i> + <i>y</i></span></span>.<br>
        • <em>Solución explicada:</em> Analizamos primero las condiciones para que la expresión tome valores reales:<br>
        1) <span class="math-text"><i>x</i> ≥ 0</span> (semiplano derecho, que incluye el eje vertical <span class="math-text"><i>Y</i></span>).<br>
        2) <span class="math-text"><i>x</i> + <i>y</i> ≥ 0 ⇒ <i>y</i> ≥ −<i>x</i></span> (la región situada sobre y por encima de la recta frontera <span class="math-text"><i>y</i> = −<i>x</i></span>).<br>
        Por tanto, el dominio natural de definición de la función es el conjunto cerrado:<br>
        <span class="math-text"><i>D</i> = {(<i>x</i>, <i>y</i>) ∈ ℝ² | <i>x</i> ≥ 0, <i>y</i> ≥ −<i>x</i>}</span>.<br>
        <strong>Continuidad dentro del dominio vs. puntos no definidos:</strong><br>
        • <strong>Continuidad en todo su dominio D:</strong> Dado que las funciones raíz cuadrada, producto y coseno son continuas en sus campos de existencia, la función es <strong>continua en todo su dominio <i>D</i></strong>. En los puntos de la frontera de <span class="math-text"><i>D</i></span> (los rayos <span class="math-text"><i>x</i> = 0</span> con <span class="math-text"><i>y</i> ≥ 0</span>, y <span class="math-text"><i>y</i> = −<i>x</i></span> con <span class="math-text"><i>x</i> ≥ 0</span>), la continuidad se verifica formalmente mediante límites relativos restringidos al conjunto <span class="math-text"><i>D</i></span> (<span class="math-text"><span class="math-limit"><span>lim</span><sub>(<i>x</i>,<i>y</i>)→(<i>x</i>₀,<i>y</i>₀), (<i>x</i>,<i>y</i>)∈<i>D</i></sub></span><i>f</i>(<i>x</i>, <i>y</i>) = <i>f</i>(<i>x</i>₀, <i>y</i>₀)</span>), cumpliéndose en cada uno de ellos.<br>
        • <strong>Puntos donde no está definida:</strong> En cualquier punto exterior a <span class="math-text"><i>D</i></span> (donde <span class="math-text"><i>x</i> &lt; 0</span> o <span class="math-text"><i>x</i> + <i>y</i> &lt; 0</span>), los radicales conducen a cantidades complejas no reales; por tanto, la función <strong>simplemente no está definida</strong> en dichos puntos. Debe distinguirse con precisión: la función no es «discontinua» fuera de <span class="math-text"><i>D</i></span>, sino que carece de definición real en esa región externa.</p>`
    },
    {
      title: 'Derivadas parciales',
      content: `<p class="lesson-lead">Las derivadas parciales extienden el concepto fundamental de tasa instantánea de cambio a campos escalares de dos o más variables independientes. Al evaluar cómo varía la función respecto a una variable manteniendo todas las demás estrictamente constantes, se obtienen las pendientes de las rectas tangentes a lo largo de cortes axiales y se sientan los pilares para el cálculo de planos tangentes, vectores gradientes, ecuaciones diferenciales parciales y matrices hessianas de curvatura.</p>

        <h2>Derivadas parciales y de orden superior</h2>

        <h3>Definición formal mediante límites (Definición 1 del folleto)</h3>
        <p>De acuerdo con la <strong>Definición 1 (pág. 4)</strong> del folleto del profesor David Chávez, sea <span class="math-text"><i>f</i></span> una función de dos variables <span class="math-text"><i>x</i></span> e <span class="math-text"><i>y</i></span>, definida sobre un conjunto <span class="math-text"><i>S</i> ⊂ ℝ²</span>:</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Definición 1: Derivadas parciales de primer orden</strong></div>
          <p>• La <strong>derivada parcial de <span class="math-text"><i>f</i></span> respecto a <span class="math-text"><i>x</i></span></strong>, denotada por <span class="math-text"><i>D</i>₁<i>f</i>(<i>x</i>, <i>y</i>)</span>, es la función cuyo valor en cualquier punto <span class="math-text">(<i>x</i>, <i>y</i>) ∈ <i>S</i></span> viene dado por:<br>
          <span class="math-text"><i>D</i>₁<i>f</i>(<i>x</i>, <i>y</i>) = <span class="math-limit"><span>lim</span><sub>Δ<i>x</i>→0</sub></span><span class="math-fraction"><span><i>f</i>(<i>x</i> + Δ<i>x</i>, <i>y</i>) − <i>f</i>(<i>x</i>, <i>y</i>)</span><span>Δ<i>x</i></span></span></span>, siempre que este límite exista.</p>
          <p>• De manera similar, la <strong>derivada parcial de <span class="math-text"><i>f</i></span> respecto a <span class="math-text"><i>y</i></span></strong>, denotada por <span class="math-text"><i>D</i>₂<i>f</i>(<i>x</i>, <i>y</i>)</span>, se define por:<br>
          <span class="math-text"><i>D</i>₂<i>f</i>(<i>x</i>, <i>y</i>) = <span class="math-limit"><span>lim</span><sub>Δ<i>y</i>→0</sub></span><span class="math-fraction"><span><i>f</i>(<i>x</i>, <i>y</i> + Δ<i>y</i>) − <i>f</i>(<i>x</i>, <i>y</i>)</span><span>Δ<i>y</i></span></span></span>, siempre que este límite exista.</p>
        </div>

        <p>Si <span class="math-text"><i>P</i>₀(<i>x</i>₀, <i>y</i>₀)</span> es un punto particular del dominio, el valor numérico puntual de las derivadas parciales se calcula mediante:</p>
        <div class="lesson-definition">
          <p><span class="math-text"><i>D</i>₁<i>f</i>(<i>x</i>₀, <i>y</i>₀) = <i>f<sub>x</sub></i>(<i>x</i>₀, <i>y</i>₀) = <span class="math-limit"><span>lim</span><sub>Δ<i>x</i>→0</sub></span><span class="math-fraction"><span><i>f</i>(<i>x</i>₀ + Δ<i>x</i>, <i>y</i>₀) − <i>f</i>(<i>x</i>₀, <i>y</i>₀)</span><span>Δ<i>x</i></span></span></span></p>
          <p><span class="math-text"><i>D</i>₂<i>f</i>(<i>x</i>₀, <i>y</i>₀) = <i>f<sub>y</sub></i>(<i>x</i>₀, <i>y</i>₀) = <span class="math-limit"><span>lim</span><sub>Δ<i>y</i>→0</sub></span><span class="math-fraction"><span><i>f</i>(<i>x</i>₀, <i>y</i>₀ + Δ<i>y</i>) − <i>f</i>(<i>x</i>₀, <i>y</i>₀)</span><span>Δ<i>y</i></span></span></span></p>
        </div>

        <h3>Notaciones matemáticas usuales</h3>
        <p>En la literatura científica y en el folleto del profesor existen diversas notaciones equivalentes indispensables para familiarizarse con la derivación multivariable:</p>
        <p>Si <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span>, para la derivada respecto a <span class="math-text"><i>x</i></span>:</p>
        <p><span class="math-text"><i>D</i>₁<i>f</i> ≡ <i>f</i>₁ ≡ <i>f<sub>x</sub></i> ≡ <span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>x</i></span></span> ≡ <span class="math-fraction"><span>∂<i>f</i></span><span>∂<i>x</i></span></span> ≡ <i>z<sub>x</sub></i></span></p>
        <p>Para la derivada respecto a <span class="math-text"><i>y</i></span>:</p>
        <p><span class="math-text"><i>D</i>₂<i>f</i> ≡ <i>f</i>₂ ≡ <i>f<sub>y</sub></i> ≡ <span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>y</i></span></span> ≡ <span class="math-fraction"><span>∂<i>f</i></span><span>∂<i>y</i></span></span> ≡ <i>z<sub>y</sub></i></span></p>
        <p>• <strong>Observación sobre el símbolo <span class="math-text">∂</span>:</strong> El símbolo diferencial curvo <span class="math-text">∂</span> (introducido históricamente por Legendre y Jacobi) se reserva exclusivamente para derivadas parciales, advirtiendo que la función depende de múltiples variables y que las restantes se consideran fijas durante el cálculo, a diferencia de la <span class="math-text"><i>d</i></span> recta de la derivada total ordinaria <span class="math-text"><span class="math-fraction"><span><i>df</i></span><span><i>dx</i></span></span></span>.</p>

        <h3>Interpretación geométrica de las derivadas parciales</h3>
        <p>La interpretación geométrica en dos variables es análoga a la derivada ordinaria de una función univariable <span class="math-text"><i>y</i> = <i>f</i>(<i>x</i>)</span>, donde la derivada en <span class="math-text"><i>x</i>₀</span> representa la pendiente de la recta tangente a la curva en el punto <span class="math-text">(<i>x</i>₀, <i>f</i>(<i>x</i>₀))</span>.</p>
        <p>Consideremos la superficie tridimensional <span class="math-text"><i>S</i>: <i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span> y un punto fijado <span class="math-text"><i>P</i>₀(<i>x</i>₀, <i>y</i>₀, <i>z</i>₀)</span> con <span class="math-text"><i>z</i>₀ = <i>f</i>(<i>x</i>₀, <i>y</i>₀)</span>:</p>

        <p><strong>1. Sección vertical con el plano <span class="math-text"><i>y</i> = <i>y</i>₀</span> (plano paralelo al plano <span class="math-text"><i>XZ</i></span>):</strong><br>
        La intersección entre la superficie <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span> y el plano vertical <span class="math-text"><i>y</i> = <i>y</i>₀</span> forma una curva traza espacial <span class="math-text"><i>C</i>₁</span> descrita por el sistema:<br>
        <span class="math-text"><i>C</i>₁: { <i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>₀),  <i>y</i> = <i>y</i>₀ }</span>.<br>
        En el plano <span class="math-text"><i>y</i> = <i>y</i>₀</span>, <span class="math-text"><i>z</i></span> depende únicamente de <span class="math-text"><i>x</i></span>. La derivada parcial <span class="math-text"><i>f<sub>x</sub></i>(<i>x</i>₀, <i>y</i>₀)</span> es exactamente la <strong>pendiente de la recta tangente <span class="math-text"><i>T</i>₁</span></strong> a la curva <span class="math-text"><i>C</i>₁</span> en el punto <span class="math-text"><i>P</i>₀</span>:<br>
        <span class="math-text"><i>m</i>₁ = <i>f<sub>x</sub></i>(<i>x</i>₀, <i>y</i>₀)</span>.<br>
        Un vector director de esta recta tangente <span class="math-text"><i>T</i>₁</span> en el espacio es <span class="math-text"><b>v</b>₁ = (1, 0, <i>f<sub>x</sub></i>(<i>x</i>₀, <i>y</i>₀))</span>.</p>

        <p><strong>2. Sección vertical con el plano <span class="math-text"><i>x</i> = <i>x</i>₀</span> (plano paralelo al plano <span class="math-text"><i>YZ</i></span>):</strong><br>
        La intersección entre la superficie <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span> y el plano vertical <span class="math-text"><i>x</i> = <i>x</i>₀</span> genera la curva traza espacial <span class="math-text"><i>C</i>₂</span> descrita por:<br>
        <span class="math-text"><i>C</i>₂: { <i>z</i> = <i>f</i>(<i>x</i>₀, <i>y</i>),  <i>x</i> = <i>x</i>₀ }</span>.<br>
        En el plano <span class="math-text"><i>x</i> = <i>x</i>₀</span>, <span class="math-text"><i>z</i></span> depende únicamente de <span class="math-text"><i>y</i></span>. La derivada parcial <span class="math-text"><i>f<sub>y</sub></i>(<i>x</i>₀, <i>y</i>₀)</span> es la <strong>pendiente de la recta tangente <span class="math-text"><i>T</i>₂</span></strong> a la curva <span class="math-text"><i>C</i>₂</span> en el punto <span class="math-text"><i>P</i>₀</span>:<br>
        <span class="math-text"><i>m</i>₂ = <i>f<sub>y</sub></i>(<i>x</i>₀, <i>y</i>₀)</span>.<br>
        Un vector director de la recta tangente <span class="math-text"><i>T</i>₂</span> en el espacio es <span class="math-text"><b>v</b>₂ = (0, 1, <i>f<sub>y</sub></i>(<i>x</i>₀, <i>y</i>₀))</span>.</p>

        <h3>Cálculo práctico de derivadas parciales: Reglas de derivación</h3>
        <p>Como señala el profesor Chávez (pág. 5), existen dos vías metodológicas para determinar derivadas parciales:</p>
        <p>1. <strong>Vía por definición formal de límite:</strong> Se evalúa el cociente incremental cuando <span class="math-text">Δ<i>x</i> → 0</span> o <span class="math-text">Δ<i>y</i> → 0</span>. Es obligatoria en puntos singulares, en el origen para funciones definidas por tramos o en problemas teóricos.<br>
        2. <strong>Vía mediante reglas de derivación ordinaria:</strong> Se aplican las reglas convencionales del cálculo diferencial considerando a la variable de derivación como la variable activa y <em>tratando a todas las demás variables independientes como si fueran constantes fijas</em>.</p>
        <p>• <strong>Regla para <span class="math-text"><span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>x</i></span></span></span>:</strong> Tratamos a <span class="math-text"><i>y</i></span> como una constante numérica <span class="math-text"><i>c</i></span> y derivamos respecto a <span class="math-text"><i>x</i></span>.<br>
        • <strong>Regla para <span class="math-text"><span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>y</i></span></span></span>:</strong> Tratamos a <span class="math-text"><i>x</i></span> como una constante numérica <span class="math-text"><i>c</i></span> y derivamos respecto a <span class="math-text"><i>y</i></span>.</p>

        <h3>Derivadas parciales de orden superior</h3>
        <p>Dado que las primeras derivadas parciales <span class="math-text"><i>f<sub>x</sub></i></span> y <span class="math-text"><i>f<sub>y</sub></i></span> son a su vez funciones de dos variables <span class="math-text"><i>x</i></span> e <span class="math-text"><i>y</i></span>, es posible calcular sus derivadas respecto a cualquiera de las variables independientes, originando las <strong>derivadas parciales de segundo orden</strong>.</p>
        <p>Para una función <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span> existen cuatro derivadas parciales de segundo orden:</p>
        <p>1. <strong>Segunda derivada directa respecto a <i>x</i>:</strong><br>
        <span class="math-text"><i>f<sub>xx</sub></i> ≡ <i>D</i>₁₁<i>f</i> ≡ <span class="math-fraction"><span>∂²<i>z</i></span><span>∂<i>x</i>²</span></span> = <span class="math-fraction"><span>∂</span><span>∂<i>x</i></span></span>(<span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>x</i></span></span>)</span></p>
        <p>2. <strong>Segunda derivada directa respecto a <i>y</i>:</strong><br>
        <span class="math-text"><i>f<sub>yy</sub></i> ≡ <i>D</i>₂₂<i>f</i> ≡ <span class="math-fraction"><span>∂²<i>z</i></span><span>∂<i>y</i>²</span></span> = <span class="math-fraction"><span>∂</span><span>∂<i>y</i></span></span>(<span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>y</i></span></span>)</span></p>
        <p>3. <strong>Derivada mixta o cruzada derivando primero respecto a <i>x</i> y luego respecto a <i>y</i>:</strong><br>
        <span class="math-text"><i>f<sub>xy</sub></i> ≡ <i>D</i>₁₂<i>f</i> ≡ <span class="math-fraction"><span>∂²<i>z</i></span><span>∂<i>y</i>∂<i>x</i></span></span> = <span class="math-fraction"><span>∂</span><span>∂<i>y</i></span></span>(<span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>x</i></span></span>)</span></p>
        <p>4. <strong>Derivada mixta o cruzada derivando primero respecto a <i>y</i> y luego respecto a <i>x</i>:</strong><br>
        <span class="math-text"><i>f<sub>yx</sub></i> ≡ <i>D</i>₂₁<i>f</i> ≡ <span class="math-fraction"><span>∂²<i>z</i></span><span>∂<i>x</i>∂<i>y</i></span></span> = <span class="math-fraction"><span>∂</span><span>∂<i>x</i></span></span>(<span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>y</i></span></span>)</span></p>

        <p><strong>Convenio crucial de orden en la notación (págs. 6-7 del folleto):</strong><br>
        • En la notación de subíndices (<span class="math-text"><i>f<sub>xy</sub></i></span>), los índices se ejecutan de <strong>izquierda a derecha</strong>: <span class="math-text"><i>f<sub>xy</sub></i> = (<i>f<sub>x</sub></i>)<sub><i>y</i></sub></span> (primero respecto a <span class="math-text"><i>x</i></span>, luego respecto a <span class="math-text"><i>y</i></span>).<br>
        • En la notación fraccionaria de Leibniz (<span class="math-text"><span class="math-fraction"><span>∂²<i>z</i></span><span>∂<i>y</i>∂<i>x</i></span></span></span>), los operadores diferenciales actúan de <strong>derecha a izquierda</strong>: primero se aplica el operador <span class="math-text"><span class="math-fraction"><span>∂</span><span>∂<i>x</i></span></span></span> interior y sobre el resultado se aplica el operador <span class="math-text"><span class="math-fraction"><span>∂</span><span>∂<i>y</i></span></span></span> exterior.</p>

        <h3>Teorema de Schwarz o Teorema de Clairaut (Teorema 1 del folleto, pág. 7)</h3>
        <p>Las derivadas mixtas <span class="math-text"><i>f<sub>xy</sub></i></span> y <span class="math-text"><i>f<sub>yx</sub></i></span> involucran secuencias de derivación distintas. ¿Son siempre iguales? La respuesta analítica rigurosa la establece el <strong>Teorema de Schwarz</strong>:</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Teorema 1 (Schwarz / Clairaut): Igualdad de derivadas parciales mixtas</strong></div>
          <p>Sea <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>)</span> una función definida en un entorno <span class="math-text"><i>B</i>(<i>P</i>₀; <i>r</i>)</span> del punto <span class="math-text"><i>P</i>₀(<i>x</i>₀, <i>y</i>₀)</span>. Supongamos que las derivadas parciales <span class="math-text"><i>f<sub>x</sub></i></span>, <span class="math-text"><i>f<sub>y</sub></i></span>, <span class="math-text"><i>f<sub>xy</sub></i></span> y <span class="math-text"><i>f<sub>yx</sub></i></span> existen en dicho entorno.<br>
          Si las derivadas parciales mixtas <span class="math-text"><i>f<sub>xy</sub></i></span> y <span class="math-text"><i>f<sub>yx</sub></i></span> son <strong>continuas</strong> en el punto <span class="math-text"><i>P</i>₀(<i>x</i>₀, <i>y</i>₀)</span>, entonces coinciden idénticamente:<br>
          <span class="math-text"><i>f<sub>xy</sub></i>(<i>x</i>₀, <i>y</i>₀) = <i>f<sub>yx</sub></i>(<i>x</i>₀, <i>y</i>₀)</span>, es decir:<br>
          <span class="math-text"><span class="math-fraction"><span>∂²<i>f</i></span><span>∂<i>y</i>∂<i>x</i></span></span>(<i>x</i>₀, <i>y</i>₀) = <span class="math-fraction"><span>∂²<i>f</i></span><span>∂<i>x</i>∂<i>y</i></span></span>(<i>x</i>₀, <i>y</i>₀)</span>.</p>
        </div>

        <p>• <strong>Hipótesis indispensable:</strong> La igualdad de las derivadas mixtas exige la <em>continuidad</em> de dichas derivadas parciales de segundo orden. Para todas las funciones estándar de clase <span class="math-text"><i>C</i>²</span> (polinomios, racionales en sus dominios, exponenciales y trigonométricas), las mixtas siempre son continuas e intercambiables en cualquier orden.</p>

        <h3>Distinción conceptual rigurosa: Existencia de parciales vs. Diferenciabilidad vs. Continuidad</h3>
        <p>Uno de los errores conceptuales más frecuentes en el cálculo multivariable es suponer erróneamente que la existencia de las derivadas parciales en un punto garantiza la continuidad o la diferenciabilidad de la función. El análisis moderno establece con claridad las siguientes distinciones:</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Relación lógica y jerarquía conceptual</strong></div>
          <p><strong>1. Existencia de derivadas parciales ⇏ Continuidad:</strong><br>
          Las derivadas parciales <span class="math-text"><i>f<sub>x</sub></i></span> y <span class="math-text"><i>f<sub>y</sub></i></span> miden únicamente el cambio a lo largo de <strong>dos rectas axiales paralelas a los ejes</strong> coordenados. No brindan información alguna sobre el comportamiento de la función a lo largo de rectas diagonales o curvas parabólicas.<br>
          • <em>Contraejemplo clásico:</em> Consideremos la función:<br>
          <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = <span class="math-fraction"><span><i>xy</i></span><span><i>x</i>² + <i>y</i>²</span></span></span> si <span class="math-text">(<i>x</i>, <i>y</i>) ≠ (0, 0)</span>, y <span class="math-text"><i>f</i>(0, 0) = 0</span>.<br>
          Calculando por definición formal en el origen:<br>
          <span class="math-text"><i>f<sub>x</sub></i>(0, 0) = <span class="math-limit"><span>lim</span><sub>Δ<i>x</i>→0</sub></span><span class="math-fraction"><span><i>f</i>(Δ<i>x</i>, 0) − <i>f</i>(0, 0)</span><span>Δ<i>x</i></span></span> = <span class="math-limit"><span>lim</span><sub>Δ<i>x</i>→0</sub></span><span class="math-fraction"><span>0 − 0</span><span>Δ<i>x</i></span></span> = 0</span>.<br>
          <span class="math-text"><i>f<sub>y</sub></i>(0, 0) = <span class="math-limit"><span>lim</span><sub>Δ<i>y</i>→0</sub></span><span class="math-fraction"><span><i>f</i>(0, Δ<i>y</i>) − <i>f</i>(0, 0)</span><span>Δ<i>y</i></span></span> = <span class="math-limit"><span>lim</span><sub>Δ<i>y</i>→0</sub></span><span class="math-fraction"><span>0 − 0</span><span>Δ<i>y</i></span></span> = 0</span>.<br>
          Ambas derivadas parciales existen en el origen y valen cero. Sin embargo, como se demostró rigurosamente en la Lección 5 mediante trayectorias <span class="math-text"><i>y</i> = <i>mx</i></span>, el límite <span class="math-text"><span class="math-limit"><span>lim</span><sub>(<i>x</i>,<i>y</i>)→(0,0)</sub></span><i>f</i>(<i>x</i>, <i>y</i>)</span> no existe. Por consiguiente, la función <strong>no es continua ni es diferenciable</strong> en <span class="math-text">(0, 0)</span>, a pesar de que sus dos derivadas parciales existen.</p>
          <p><strong>2. Diferenciabilidad ⇒ Continuidad y existencia de derivadas parciales:</strong><br>
          Si una función es diferenciable en un punto <span class="math-text"><i>P</i>₀</span>, su gráfica admite un plano tangente no vertical bien definido; como consecuencia geométrica y analítica ineludible, la función es continua en <span class="math-text"><i>P</i>₀</span> y existen necesariamente sus derivadas parciales.</p>
          <p><strong>3. Condición suficiente de diferenciabilidad (Clase <i>C</i>¹):</strong><br>
          Si las derivadas parciales <span class="math-text"><i>f<sub>x</sub></i></span> y <span class="math-text"><i>f<sub>y</sub></i></span> existen en un entorno del punto y son <strong>continuas</strong> en dicho punto, entonces la función <span class="math-text"><i>f</i></span> es <strong>garantizadamente diferenciable</strong> en el punto.</p>
          <p><strong>En síntesis:</strong><br>
          <span class="math-text">Parciales continuas (<i>C</i>¹) ⇒ Diferenciable ⇒ Continua (<i>C</i>⁰) y existen parciales</span>.<br>
          Pero ninguna de las implicaciones recíprocas es válida en general.</p>
        </div>

        <h3>Ejemplos resueltos del folleto (paso a paso)</h3>

        <p><strong>Ejemplo 1: Derivadas parciales de primer orden en un polinomio multivariable (Ejemplo 1 del folleto, pág. 5)</strong><br>
        Hallar las primeras derivadas parciales de la función:<br>
        <span class="math-text"><i>z</i> = 2<i>x</i>³ − 7<i>x</i>²<i>y</i> − 3<i>y</i>³ + 7<i>x</i> − 5</span></p>
        <p>• <em>Cálculo de <span class="math-text"><span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>x</i></span></span></span>:</em> Tomamos la variable <span class="math-text"><i>y</i></span> como si fuera una constante fija y aplicamos las reglas ordinarias de derivación:<br>
        <span class="math-text"><span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>x</i></span></span> = <span class="math-fraction"><span>∂</span><span>∂<i>x</i></span></span>(2<i>x</i>³) − <span class="math-fraction"><span>∂</span><span>∂<i>x</i></span></span>(7<i>x</i>²<i>y</i>) − <span class="math-fraction"><span>∂</span><span>∂<i>x</i></span></span>(3<i>y</i>³) + <span class="math-fraction"><span>∂</span><span>∂<i>x</i></span></span>(7<i>x</i>) − <span class="math-fraction"><span>∂</span><span>∂<i>x</i></span></span>(5)</span><br>
        <span class="math-text"><span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>x</i></span></span> = 2(3<i>x</i>²) − 7<i>y</i>(2<i>x</i>) − 0 + 7 − 0 = 6<i>x</i>² − 14<i>xy</i> + 7</span>.<br>
        • <em>Cálculo de <span class="math-text"><span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>y</i></span></span></span>:</em> Ahora tomamos la variable <span class="math-text"><i>x</i></span> como si fuera constante:<br>
        <span class="math-text"><span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>y</i></span></span> = <span class="math-fraction"><span>∂</span><span>∂<i>y</i></span></span>(2<i>x</i>³) − <span class="math-fraction"><span>∂</span><span>∂<i>y</i></span></span>(7<i>x</i>²<i>y</i>) − <span class="math-fraction"><span>∂</span><span>∂<i>y</i></span></span>(3<i>y</i>³) + <span class="math-fraction"><span>∂</span><span>∂<i>y</i></span></span>(7<i>x</i>) − <span class="math-fraction"><span>∂</span><span>∂<i>y</i></span></span>(5)</span><br>
        <span class="math-text"><span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>y</i></span></span> = 0 − 7<i>x</i>²(1) − 3(3<i>y</i>²) + 0 − 0 = −7<i>x</i>² − 9<i>y</i>²</span>.</p>

        <p><strong>Ejemplo 2: Derivación con regla de la cadena (Ejemplo 2 del folleto, pág. 5)</strong><br>
        Determinar las primeras derivadas parciales de la superficie cónica:<br>
        <span class="math-text"><i>z</i> = √<span class="math-radical"><i>x</i>² + <i>y</i>²</span> = (<i>x</i>² + <i>y</i>²)<sup>1/2</sup></span></p>
        <p>• <em>Cálculo de <span class="math-text"><span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>x</i></span></span></span>:</em> Consideramos <span class="math-text"><i>y</i></span> constante y aplicamos la regla de la cadena de la potencia:<br>
        <span class="math-text"><span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>x</i></span></span> = <span class="math-fraction"><span>1</span><span>2</span></span>(<i>x</i>² + <i>y</i>²)<sup>−1/2</sup> · <span class="math-fraction"><span>∂</span><span>∂<i>x</i></span></span>(<i>x</i>² + <i>y</i>²) = <span class="math-fraction"><span>1</span><span>2</span></span>(<i>x</i>² + <i>y</i>²)<sup>−1/2</sup>(2<i>x</i>) = <span class="math-fraction"><span><i>x</i></span><span>√<span class="math-radical"><i>x</i>² + <i>y</i>²</span></span></span></span> (para todo <span class="math-text">(<i>x</i>, <i>y</i>) ≠ (0, 0)</span>).<br>
        • <em>Cálculo de <span class="math-text"><span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>y</i></span></span></span>:</em> Manteniendo <span class="math-text"><i>x</i></span> constante:<br>
        <span class="math-text"><span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>y</i></span></span> = <span class="math-fraction"><span>1</span><span>2</span></span>(<i>x</i>² + <i>y</i>²)<sup>−1/2</sup> · <span class="math-fraction"><span>∂</span><span>∂<i>y</i></span></span>(<i>x</i>² + <i>y</i>²) = <span class="math-fraction"><span>1</span><span>2</span></span>(<i>x</i>² + <i>y</i>²)<sup>−1/2</sup>(2<i>y</i>) = <span class="math-fraction"><span><i>y</i></span><span>√<span class="math-radical"><i>x</i>² + <i>y</i>²</span></span></span></span>.<br>
        <em>Observación singular:</em> En el vértice <span class="math-text">(0, 0)</span>, las derivadas parciales no existen, pues la superficie forma una cúspide con rectas tangentes secantes no derivables.</p>

        <p><strong>Ejemplo 3: Cálculo de las cuatro segundas derivadas y verificación de Schwarz (Ejemplo 7 del folleto, pág. 7)</strong><br>
        Halle las segundas derivadas parciales de la función trascendente:<br>
        <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = <i>x</i>²<i>y</i> + sen(<i>xy</i>²)</span></p>
        <p>• <em>Primeras derivadas parciales:</em><br>
        1) Derivando respecto a <span class="math-text"><i>x</i></span> (<span class="math-text"><i>y</i></span> constante):<br>
        <span class="math-text"><span class="math-fraction"><span>∂<i>f</i></span><span>∂<i>x</i></span></span> = 2<i>xy</i> + cos(<i>xy</i>²) · <span class="math-fraction"><span>∂</span><span>∂<i>x</i></span></span>(<i>xy</i>²) = 2<i>xy</i> + <i>y</i>² cos(<i>xy</i>²)</span>.<br>
        2) Derivando respecto a <span class="math-text"><i>y</i></span> (<span class="math-text"><i>x</i></span> constante):<br>
        <span class="math-text"><span class="math-fraction"><span>∂<i>f</i></span><span>∂<i>y</i></span></span> = <i>x</i>² + cos(<i>xy</i>²) · <span class="math-fraction"><span>∂</span><span>∂<i>y</i></span></span>(<i>xy</i>²) = <i>x</i>² + 2<i>xy</i> cos(<i>xy</i>²)</span>.<br>
        • <em>Segundas derivadas directas:</em><br>
        3) <span class="math-text"><span class="math-fraction"><span>∂²<i>f</i></span><span>∂<i>x</i>²</span></span> = <span class="math-fraction"><span>∂</span><span>∂<i>x</i></span></span>[2<i>xy</i> + <i>y</i>² cos(<i>xy</i>²)] = 2<i>y</i> + <i>y</i>²[−sen(<i>xy</i>²) · <i>y</i>²] = 2<i>y</i> − <i>y</i>⁴ sen(<i>xy</i>²)</span>.<br>
        4) <span class="math-text"><span class="math-fraction"><span>∂²<i>f</i></span><span>∂<i>y</i>²</span></span> = <span class="math-fraction"><span>∂</span><span>∂<i>y</i></span></span>[<i>x</i>² + 2<i>xy</i> cos(<i>xy</i>²)] = 0 + 2<i>x</i> cos(<i>xy</i>²) + 2<i>xy</i>[−sen(<i>xy</i>²) · 2<i>xy</i>] = 2<i>x</i> cos(<i>xy</i>²) − 4<i>x</i>²<i>y</i>² sen(<i>xy</i>²)</span>.<br>
        • <em>Segundas derivadas cruzadas (mixtas):</em><br>
        5) Derivando primero respecto a <span class="math-text"><i>y</i></span> y luego a <span class="math-text"><i>x</i></span>:<br>
        <span class="math-text"><span class="math-fraction"><span>∂²<i>f</i></span><span>∂<i>x</i>∂<i>y</i></span></span> = <span class="math-fraction"><span>∂</span><span>∂<i>x</i></span></span>[<i>x</i>² + 2<i>xy</i> cos(<i>xy</i>²)] = 2<i>x</i> + 2<i>y</i> cos(<i>xy</i>²) + 2<i>xy</i>[−sen(<i>xy</i>²) · <i>y</i>²] = 2<i>x</i> + 2<i>y</i> cos(<i>xy</i>²) − 2<i>xy</i>³ sen(<i>xy</i>²)</span>.<br>
        6) Derivando primero respecto a <span class="math-text"><i>x</i></span> y luego a <span class="math-text"><i>y</i></span>:<br>
        <span class="math-text"><span class="math-fraction"><span>∂²<i>f</i></span><span>∂<i>y</i>∂<i>x</i></span></span> = <span class="math-fraction"><span>∂</span><span>∂<i>y</i></span></span>[2<i>xy</i> + <i>y</i>² cos(<i>xy</i>²)] = 2<i>x</i> + 2<i>y</i> cos(<i>xy</i>²) + <i>y</i>²[−sen(<i>xy</i>²) · 2<i>xy</i>] = 2<i>x</i> + 2<i>y</i> cos(<i>xy</i>²) − 2<i>xy</i>³ sen(<i>xy</i>²)</span>.<br>
        <em>Conclusión de Schwarz:</em> Ambas expresiones coinciden exactamente en todo el plano: <span class="math-text"><span class="math-fraction"><span>∂²<i>f</i></span><span>∂<i>y</i>∂<i>x</i></span></span> = <span class="math-fraction"><span>∂²<i>f</i></span><span>∂<i>x</i>∂<i>y</i></span></span></span>.</p>

        <p><strong>Ejemplo 4: Verificación de una Ecuación Diferencial Parcial (Ejemplo 13 del folleto, pág. 9)</strong><br>
        Verifique que la función de onda amortiguada/modulada <span class="math-text"><i>u</i>(<i>x</i>, <i>t</i>) = <i>e</i><sup><i>x</i> − <i>at</i></sup> cos(<i>x</i> − <i>at</i>)</span> satisface la ecuación diferencial en derivadas parciales:<br>
        <span class="math-text"><span class="math-fraction"><span>∂²<i>u</i></span><span>∂<i>t</i>²</span></span> = <i>a</i>² <span class="math-fraction"><span>∂²<i>u</i></span><span>∂<i>x</i>²</span></span></span></p>
        <p>• <em>Cálculo de derivadas temporales (respecto a <i>t</i>):</em><br>
        Aplicamos la regla del producto con <span class="math-text"><span class="math-fraction"><span>∂</span><span>∂<i>t</i></span></span>(<i>x</i> − <i>at</i>) = −<i>a</i></span>:<br>
        <span class="math-text"><span class="math-fraction"><span>∂<i>u</i></span><span>∂<i>t</i></span></span> = (−<i>a</i>)<i>e</i><sup><i>x</i> − <i>at</i></sup> cos(<i>x</i> − <i>at</i>) + <i>e</i><sup><i>x</i> − <i>at</i></sup>[−sen(<i>x</i> − <i>at</i>) · (−<i>a</i>)] = −<i>a e</i><sup><i>x</i> − <i>at</i></sup> cos(<i>x</i> − <i>at</i>) + <i>a e</i><sup><i>x</i> − <i>at</i></sup> sen(<i>x</i> − <i>at</i>)</span>.<br>
        Derivando nuevamente respecto a <span class="math-text"><i>t</i></span>:<br>
        <span class="math-text"><span class="math-fraction"><span>∂²<i>u</i></span><span>∂<i>t</i>²</span></span> = <i>a</i>² <i>e</i><sup><i>x</i> − <i>at</i></sup> cos(<i>x</i> − <i>at</i>) − <i>a</i>² <i>e</i><sup><i>x</i> − <i>at</i></sup> sen(<i>x</i> − <i>at</i>) − <i>a</i>² <i>e</i><sup><i>x</i> − <i>at</i></sup> sen(<i>x</i> − <i>at</i>) − <i>a</i>² <i>e</i><sup><i>x</i> − <i>at</i></sup> cos(<i>x</i> − <i>at</i>)</span>.<br>
        Los términos con coseno se cancelan mutuamente (<span class="math-text"><i>a</i>² − <i>a</i>² = 0</span>):<br>
        <span class="math-text"><span class="math-fraction"><span>∂²<i>u</i></span><span>∂<i>t</i>²</span></span> = −2<i>a</i>² <i>e</i><sup><i>x</i> − <i>at</i></sup> sen(<i>x</i> − <i>at</i>)</span> &nbsp;&nbsp;<strong>(1)</strong><br>
        • <em>Cálculo de derivadas espaciales (respecto a <i>x</i>):</em><br>
        Con <span class="math-text"><span class="math-fraction"><span>∂</span><span>∂<i>x</i></span></span>(<i>x</i> − <i>at</i>) = 1</span>:<br>
        <span class="math-text"><span class="math-fraction"><span>∂<i>u</i></span><span>∂<i>x</i></span></span> = <i>e</i><sup><i>x</i> − <i>at</i></sup> cos(<i>x</i> − <i>at</i>) − <i>e</i><sup><i>x</i> − <i>at</i></sup> sen(<i>x</i> − <i>at</i>)</span>.<br>
        Derivando nuevamente respecto a <span class="math-text"><i>x</i></span>:<br>
        <span class="math-text"><span class="math-fraction"><span>∂²<i>u</i></span><span>∂<i>x</i>²</span></span> = [<i>e</i><sup><i>x</i> − <i>at</i></sup> cos(<i>x</i> − <i>at</i>) − <i>e</i><sup><i>x</i> − <i>at</i></sup> sen(<i>x</i> − <i>at</i>)] − [<i>e</i><sup><i>x</i> − <i>at</i></sup> sen(<i>x</i> − <i>at</i>) + <i>e</i><sup><i>x</i> − <i>at</i></sup> cos(<i>x</i> − <i>at</i>)]</span>.<br>
        Cancelando nuevamente el coseno:<br>
        <span class="math-text"><span class="math-fraction"><span>∂²<i>u</i></span><span>∂<i>x</i>²</span></span> = −2 <i>e</i><sup><i>x</i> − <i>at</i></sup> sen(<i>x</i> − <i>at</i>)</span> &nbsp;&nbsp;<strong>(2)</strong><br>
        • <em>Comprobación de la EDP:</em> Multiplicando (2) por <span class="math-text"><i>a</i>²</span> obtenemos exactamente la igualdad (1):<br>
        <span class="math-text"><i>a</i>² <span class="math-fraction"><span>∂²<i>u</i></span><span>∂<i>x</i>²</span></span> = <i>a</i>²[−2 <i>e</i><sup><i>x</i> − <i>at</i></sup> sen(<i>x</i> − <i>at</i>)] = −2<i>a</i>² <i>e</i><sup><i>x</i> − <i>at</i></sup> sen(<i>x</i> − <i>at</i>) = <span class="math-fraction"><span>∂²<i>u</i></span><span>∂<i>t</i>²</span></span></span>.<br>
        Queda verificado que la función satisface idénticamente la ecuación de onda.</p>

        <h3>Ejercicios de práctica propuestos del folleto (con solución completa)</h3>

        <p><strong>Ejercicio 1: Derivadas parciales de funciones racionales (Propuesto 1.iv, pág. 9)</strong><br>
        Hallar las primeras derivadas parciales de la función:<br>
        <span class="math-text"><i>z</i> = <span class="math-fraction"><span><i>x</i> − <i>y</i></span><span><i>x</i> + <i>y</i></span></span></span>, para todo <span class="math-text"><i>x</i> + <i>y</i> ≠ 0</span>.<br>
        • <em>Solución explicada:</em><br>
        1) Derivada respecto a <span class="math-text"><i>x</i></span> manteniendo <span class="math-text"><i>y</i></span> constante mediante la regla del cociente:<br>
        <span class="math-text"><i>z<sub>x</sub></i> = <span class="math-fraction"><span><span class="math-fraction"><span>∂</span><span>∂<i>x</i></span></span>(<i>x</i> − <i>y</i>) · (<i>x</i> + <i>y</i>) − (<i>x</i> − <i>y</i>) · <span class="math-fraction"><span>∂</span><span>∂<i>x</i></span></span>(<i>x</i> + <i>y</i>)</span><span>(<i>x</i> + <i>y</i>)²</span></span> = <span class="math-fraction"><span>1 · (<i>x</i> + <i>y</i>) − (<i>x</i> − <i>y</i>) · 1</span><span>(<i>x</i> + <i>y</i>)²</span></span> = <span class="math-fraction"><span><i>x</i> + <i>y</i> − <i>x</i> + <i>y</i></span><span>(<i>x</i> + <i>y</i>)²</span></span> = <span class="math-fraction"><span>2<i>y</i></span><span>(<i>x</i> + <i>y</i>)²</span></span></span>.<br>
        2) Derivada respecto a <span class="math-text"><i>y</i></span> manteniendo <span class="math-text"><i>x</i></span> constante:<br>
        <span class="math-text"><i>z<sub>y</sub></i> = <span class="math-fraction"><span><span class="math-fraction"><span>∂</span><span>∂<i>y</i></span></span>(<i>x</i> − <i>y</i>) · (<i>x</i> + <i>y</i>) − (<i>x</i> − <i>y</i>) · <span class="math-fraction"><span>∂</span><span>∂<i>y</i></span></span>(<i>x</i> + <i>y</i>)</span><span>(<i>x</i> + <i>y</i>)²</span></span> = <span class="math-fraction"><span>(−1) · (<i>x</i> + <i>y</i>) − (<i>x</i> − <i>y</i>) · 1</span><span>(<i>x</i> + <i>y</i>)²</span></span> = <span class="math-fraction"><span>−<i>x</i> − <i>y</i> − <i>x</i> + <i>y</i></span><span>(<i>x</i> + <i>y</i>)²</span></span> = <span class="math-fraction"><span>−2<i>x</i></span><span>(<i>x</i> + <i>y</i>)²</span></span></span>.</p>

        <p><strong>Ejercicio 2: Pendientes de rectas tangentes a curvas de intersección (Propuesto 3, pág. 10)</strong><br>
        Dada la superficie elipsoidal <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = 2√<span class="math-radical">1 − <span class="math-fraction"><span><i>x</i>²</span><span>16</span></span> − <span class="math-fraction"><span><i>y</i>²</span><span>9</span></span></span></span>, determine la pendiente de la recta tangente a la curva de intersección:<br>
        i) con el plano <span class="math-text"><i>y</i> = 2</span> cuando <span class="math-text"><i>x</i> = 2</span>.<br>
        ii) con el plano <span class="math-text"><i>x</i> = 2</span> cuando <span class="math-text"><i>y</i> = 2</span>.<br>
        • <em>Solución explicada:</em><br>
        1) Verificamos la cota en el punto <span class="math-text">(2, 2)</span>:<br>
        <span class="math-text">1 − <span class="math-fraction"><span>2²</span><span>16</span></span> − <span class="math-fraction"><span>2²</span><span>9</span></span> = 1 − <span class="math-fraction"><span>1</span><span>4</span></span> − <span class="math-fraction"><span>4</span><span>9</span></span> = <span class="math-fraction"><span>3</span><span>4</span></span> − <span class="math-fraction"><span>4</span><span>9</span></span> = <span class="math-fraction"><span>27 − 16</span><span>36</span></span> = <span class="math-fraction"><span>11</span><span>36</span></span> &gt; 0</span>.<br>
        El radicando es positivo y la función vale <span class="math-text"><i>f</i>(2, 2) = 2 · <span class="math-fraction"><span>√<span class="math-radical">11</span></span><span>6</span></span> = <span class="math-fraction"><span>√<span class="math-radical">11</span></span><span>3</span></span></span>.<br>
        2) Calculamos las derivadas parciales generales:<br>
        <span class="math-text"><i>f<sub>x</sub></i>(<i>x</i>, <i>y</i>) = 2 · <span class="math-fraction"><span>1</span><span>2√<span class="math-radical">1 − <span class="math-fraction"><span><i>x</i>²</span><span>16</span></span> − <span class="math-fraction"><span><i>y</i>²</span><span>9</span></span></span></span></span> · (−<span class="math-fraction"><span>2<i>x</i></span><span>16</span></span>) = −<span class="math-fraction"><span><i>x</i></span><span>8√<span class="math-radical">1 − <span class="math-fraction"><span><i>x</i>²</span><span>16</span></span> − <span class="math-fraction"><span><i>y</i>²</span><span>9</span></span></span></span></span></span>.<br>
        <span class="math-text"><i>f<sub>y</sub></i>(<i>x</i>, <i>y</i>) = 2 · <span class="math-fraction"><span>1</span><span>2√<span class="math-radical">1 − <span class="math-fraction"><span><i>x</i>²</span><span>16</span></span> − <span class="math-fraction"><span><i>y</i>²</span><span>9</span></span></span></span></span> · (−<span class="math-fraction"><span>2<i>y</i></span><span>9</span></span>) = −<span class="math-fraction"><span>2<i>y</i></span><span>9√<span class="math-radical">1 − <span class="math-fraction"><span><i>x</i>²</span><span>16</span></span> − <span class="math-fraction"><span><i>y</i>²</span><span>9</span></span></span></span></span></span>.<br>
        3) <strong>Intersección con el plano <i>y</i> = 2 (varía <i>x</i>):</strong> La pendiente de la recta tangente a la curva traza <span class="math-text"><i>C</i>₁</span> viene dada por <span class="math-text"><i>f<sub>x</sub></i>(2, 2)</span>:<br>
        <span class="math-text"><i>m</i>₁ = <i>f<sub>x</sub></i>(2, 2) = −<span class="math-fraction"><span>2</span><span>8 · (<span class="math-fraction"><span>√<span class="math-radical">11</span></span><span>6</span></span>)</span></span> = −<span class="math-fraction"><span>1/4</span><span>√<span class="math-radical">11</span>/6</span></span> = −<span class="math-fraction"><span>6</span><span>4√<span class="math-radical">11</span></span></span> = −<span class="math-fraction"><span>3</span><span>2√<span class="math-radical">11</span></span></span> = −<span class="math-fraction"><span>3√<span class="math-radical">11</span></span><span>22</span></span> ≈ −0.452</span>.<br>
        4) <strong>Intersección con el plano <i>x</i> = 2 (varía <i>y</i>):</strong> La pendiente de la recta tangente a la curva traza <span class="math-text"><i>C</i>₂</span> viene dada por <span class="math-text"><i>f<sub>y</sub></i>(2, 2)</span>:<br>
        <span class="math-text"><i>m</i>₂ = <i>f<sub>y</sub></i>(2, 2) = −<span class="math-fraction"><span>2(2)</span><span>9 · (<span class="math-fraction"><span>√<span class="math-radical">11</span></span><span>6</span></span>)</span></span> = −<span class="math-fraction"><span>4</span><span><span class="math-fraction"><span>3√<span class="math-radical">11</span></span><span>2</span></span></span></span> = −<span class="math-fraction"><span>8</span><span>3√<span class="math-radical">11</span></span></span> = −<span class="math-fraction"><span>8√<span class="math-radical">11</span></span><span>33</span></span> ≈ −0.804</span>.</p>

        <p><strong>Ejercicio 3: Funciones armónicas y Ecuación de Laplace (Propuesto 4.i, pág. 10)</strong><br>
        Una función <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>)</span> se denomina <strong>armónica</strong> en una región si satisface la Ecuación de Laplace: <span class="math-text"><i>f<sub>xx</sub></i> + <i>f<sub>yy</sub></i> = 0</span>. Demuestre que el potencial logarítmico <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = ln √<span class="math-radical"><i>x</i>² + <i>y</i>²</span> = <span class="math-fraction"><span>1</span><span>2</span></span> ln(<i>x</i>² + <i>y</i>²)</span> es armónico en todo <span class="math-text">ℝ²  {(0, 0)}</span>.<br>
        • <em>Solución explicada:</em><br>
        1) Primeras derivadas parciales:<br>
        <span class="math-text"><i>f<sub>x</sub></i> = <span class="math-fraction"><span>1</span><span>2</span></span> · <span class="math-fraction"><span>2<i>x</i></span><span><i>x</i>² + <i>y</i>²</span></span> = <span class="math-fraction"><span><i>x</i></span><span><i>x</i>² + <i>y</i>²</span></span></span>.<br>
        <span class="math-text"><i>f<sub>y</sub></i> = <span class="math-fraction"><span>1</span><span>2</span></span> · <span class="math-fraction"><span>2<i>y</i></span><span><i>x</i>² + <i>y</i>²</span></span> = <span class="math-fraction"><span><i>y</i></span><span><i>x</i>² + <i>y</i>²</span></span></span>.<br>
        2) Segundas derivadas mediante la regla del cociente:<br>
        <span class="math-text"><i>f<sub>xx</sub></i> = <span class="math-fraction"><span>1 · (<i>x</i>² + <i>y</i>²) − <i>x</i> · (2<i>x</i>)</span><span>(<i>x</i>² + <i>y</i>²)²</span></span> = <span class="math-fraction"><span><i>y</i>² − <i>x</i>²</span><span>(<i>x</i>² + <i>y</i>²)²</span></span></span>.<br>
        <span class="math-text"><i>f<sub>yy</sub></i> = <span class="math-fraction"><span>1 · (<i>x</i>² + <i>y</i>²) − <i>y</i> · (2<i>y</i>)</span><span>(<i>x</i>² + <i>y</i>²)²</span></span> = <span class="math-fraction"><span><i>x</i>² − <i>y</i>²</span><span>(<i>x</i>² + <i>y</i>²)²</span></span></span>.<br>
        3) Sumando ambas componentes segundas:<br>
        <span class="math-text"><i>f<sub>xx</sub></i> + <i>f<sub>yy</sub></i> = <span class="math-fraction"><span>(<i>y</i>² − <i>x</i>²) + (<i>x</i>² − <i>y</i>²)</span><span>(<i>x</i>² + <i>y</i>²)²</span></span> = <span class="math-fraction"><span>0</span><span>(<i>x</i>² + <i>y</i>²)²</span></span> = 0</span>.<br>
        Como la suma es idénticamente nula en todo punto donde <span class="math-text">(<i>x</i>, <i>y</i>) ≠ (0, 0)</span>, queda demostrado que la función es armónica.</p>

        <p><strong>Ejercicio 4: Identidad de Euler para funciones homogéneas (Propuesto 22, pág. 11)</strong><br>
        Sea <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = √<span class="math-radical"><i>x</i>² + <i>y</i>²</span></span>. Demuestre que <span class="math-text"><i>x f<sub>x</sub></i> + <i>y f<sub>y</sub></i> = <i>f</i>(<i>x</i>, <i>y</i>)</span> para todo <span class="math-text">(<i>x</i>, <i>y</i>) ≠ (0, 0)</span>.<br>
        • <em>Solución explicada:</em><br>
        1) Del Ejemplo 2, sabemos que para <span class="math-text">(<i>x</i>, <i>y</i>) ≠ (0, 0)</span>:<br>
        <span class="math-text"><i>f<sub>x</sub></i> = <span class="math-fraction"><span><i>x</i></span><span>√<span class="math-radical"><i>x</i>² + <i>y</i>²</span></span></span></span> &nbsp;&nbsp;y&nbsp;&nbsp; <span class="math-text"><i>f<sub>y</sub></i> = <span class="math-fraction"><span><i>y</i></span><span>√<span class="math-radical"><i>x</i>² + <i>y</i>²</span></span></span></span>.<br>
        2) Sustituimos directamente en la combinación lineal propuesta:<br>
        <span class="math-text"><i>x f<sub>x</sub></i> + <i>y f<sub>y</sub></i> = <i>x</i> · <span class="math-fraction"><span><i>x</i></span><span>√<span class="math-radical"><i>x</i>² + <i>y</i>²</span></span></span> + <i>y</i> · <span class="math-fraction"><span><i>y</i></span><span>√<span class="math-radical"><i>x</i>² + <i>y</i>²</span></span></span> = <span class="math-fraction"><span><i>x</i>² + <i>y</i>²</span><span>√<span class="math-radical"><i>x</i>² + <i>y</i>²</span></span></span></span>.<br>
        3) Racionalizando o simplificando la potencia fraccionaria:<br>
        <span class="math-text"><span class="math-fraction"><span>(√<span class="math-radical"><i>x</i>² + <i>y</i>²</span>)²</span><span>√<span class="math-radical"><i>x</i>² + <i>y</i>²</span></span></span> = √<span class="math-radical"><i>x</i>² + <i>y</i>²</span> = <i>f</i>(<i>x</i>, <i>y</i>)</span>.<br>
        La identidad se satisface plenamente, ilustrando el teorema de Euler para funciones positivamente homogéneas de grado 1.</p>`
    },
    {
      title: 'Plano tangente',
      content: `<p class="lesson-lead">El plano tangente constituye la mejor aproximación lineal de primer orden a una superficie en las inmediaciones de un punto de contacto. Al integrar las pendientes de todas las curvas suaves que cruzan por el punto, el plano tangente y su recta normal ortogonal establecen el marco geométrico para el cálculo del diferencial total, estimación de tolerancias físicas, trayectorias sobre variedades y direcciones óptimas de variación mediante el vector gradiente.</p>

        <h2>Plano tangente y recta normal</h2>

        <h3>Concepto geométrico e interpretación física</h3>
        <p>En el cálculo diferencial de una variable, la derivada <span class="math-text"><i>f</i>′(<i>x</i>₀)</span> define la pendiente de la recta tangente a la curva plana <span class="math-text"><i>y</i> = <i>f</i>(<i>x</i>)</span>. Al pasar a funciones de dos variables <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span>, la gráfica ya no es una curva unidimensional sino una <strong>superficie tridimensional</strong> en <span class="math-text">ℝ³</span>.</p>
        <p>Por un punto <span class="math-text"><i>P</i>₀(<i>x</i>₀, <i>y</i>₀, <i>z</i>₀)</span> sobre la superficie pasan infinitas curvas espaciales que yacen completamente en dicha superficie. Si la función es diferenciable en <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span>, las rectas tangentes a <em>todas</em> estas curvas en el punto <span class="math-text"><i>P</i>₀</span> no se dispersan caóticamente en el espacio, sino que <strong>están contenidas exactamente en un mismo plano</strong>:</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Definición geométrica: Plano tangente y Recta normal</strong></div>
          <p>• <strong>Plano tangente:</strong> Es el plano que pasa por el punto <span class="math-text"><i>P</i>₀(<i>x</i>₀, <i>y</i>₀, <i>f</i>(<i>x</i>₀, <i>y</i>₀))</span> y contiene a las rectas tangentes de todas las curvas trazadas sobre la superficie <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span> que pasan por <span class="math-text"><i>P</i>₀</span>.<br>
          • <strong>Recta normal:</strong> Es la línea recta perpendicular (ortogonal) al plano tangente que pasa por el punto de contacto <span class="math-text"><i>P</i>₀</span>. Su vector director es el vector normal del plano tangente.</p>
        </div>

        <h3>Deducción paso a paso de la ecuación del plano tangente para <i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</h3>
        <p>Siguiendo la deducción de la <strong>Sección 1.8 (pág. 4)</strong> del folleto <em>Semana 05.pdf</em> del profesor David Chávez, consideremos dos curvas traza particulares generadas por cortes con planos verticales perpendiculares:</p>

        <p><strong>1. Curva traza <i>C</i>₁ (corte con el plano vertical <i>y</i> = <i>y</i>₀):</strong><br>
        La intersección de la superficie con el plano <span class="math-text"><i>y</i> = <i>y</i>₀</span> forma la curva espacial:<br>
        <span class="math-text"><i>C</i>₁: { <i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>₀),  <i>y</i> = <i>y</i>₀ }</span>.<br>
        En este plano paralelo a <span class="math-text"><i>XZ</i></span>, la única variable activa es <span class="math-text"><i>x</i></span>. La pendiente de la recta tangente a <span class="math-text"><i>C</i>₁</span> en <span class="math-text"><i>P</i>₀</span> es la derivada parcial <span class="math-text"><i>f<sub>x</sub></i>(<i>x</i>₀, <i>y</i>₀)</span>.<br>
        Un vector director tangente a <span class="math-text"><i>C</i>₁</span> en el espacio <span class="math-text">ℝ³</span> es:<br>
        <span class="math-text"><b>v</b>₁ = <b>i</b> + 0<b>j</b> + <i>f<sub>x</sub></i>(<i>x</i>₀, <i>y</i>₀)<b>k</b> = (1, 0, <i>f<sub>x</sub></i>(<i>x</i>₀, <i>y</i>₀))</span>.</p>

        <p><strong>2. Curva traza <i>C</i>₂ (corte con el plano vertical <i>x</i> = <i>x</i>₀):</strong><br>
        La intersección con el plano vertical <span class="math-text"><i>x</i> = <i>x</i>₀</span> forma la curva espacial:<br>
        <span class="math-text"><i>C</i>₂: { <i>z</i> = <i>f</i>(<i>x</i>₀, <i>y</i>),  <i>x</i> = <i>x</i>₀ }</span>.<br>
        En este plano paralelo a <span class="math-text"><i>YZ</i></span>, la variable activa es <span class="math-text"><i>y</i></span>. La pendiente de la recta tangente a <span class="math-text"><i>C</i>₂</span> en <span class="math-text"><i>P</i>₀</span> es <span class="math-text"><i>f<sub>y</sub></i>(<i>x</i>₀, <i>y</i>₀)</span>.<br>
        Un vector director tangente a <span class="math-text"><i>C</i>₂</span> en el espacio <span class="math-text">ℝ³</span> es:<br>
        <span class="math-text"><b>v</b>₂ = 0<b>i</b> + <b>j</b> + <i>f<sub>y</sub></i>(<i>x</i>₀, <i>y</i>₀)<b>k</b> = (0, 1, <i>f<sub>y</sub></i>(<i>x</i>₀, <i>y</i>₀))</span>.</p>

        <p><strong>3. Obtención del vector normal <b>N</b> mediante el producto vectorial:</strong><br>
        Puesto que los vectores directores tangentes <span class="math-text"><b>v</b>₁</span> y <span class="math-text"><b>v</b>₂</span> yacen completamente dentro del plano tangente, el vector normal <span class="math-text"><b>N</b></span> a dicho plano debe ser ortogonal a ambos simultáneamente. Calculamos su producto cruz:</p>

        <div class="lesson-definition">
          <p><span class="math-text"><b>N</b> = <b>v</b>₂ × <b>v</b>₁ = <span class="math-fraction"><span>| <b>i</b> &nbsp; <b>j</b> &nbsp; <b>k</b> |</span><span>| 0 &nbsp; 1 &nbsp; <i>f<sub>y</sub></i> |</span><span>| 1 &nbsp; 0 &nbsp; <i>f<sub>x</sub></i> |</span></span> = <i>f<sub>x</sub></i>(<i>x</i>₀, <i>y</i>₀)<b>i</b> + <i>f<sub>y</sub></i>(<i>x</i>₀, <i>y</i>₀)<b>j</b> − <b>k</b></span></p>
          <p>Es decir, el vector normal canónico a la superficie explícita <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span> es:<br>
          <span class="math-text"><b>N</b> = (<i>f<sub>x</sub></i>(<i>x</i>₀, <i>y</i>₀),  <i>f<sub>y</sub></i>(<i>x</i>₀, <i>y</i>₀),  −1)</span></p>
        </div>

        <p><em>Nota sobre el sentido:</em> Si calculamos <span class="math-text"><b>v</b>₁ × <b>v</b>₂</span>, obtenemos el vector opuesto <span class="math-text">(−<i>f<sub>x</sub></i>, −<i>f<sub>y</sub></i>, 1)</span>, el cual apunta hacia arriba y es igualmente ortogonal al plano.</p>

        <p><strong>4. Ecuación punto-normal del plano tangente:</strong><br>
        Recordemos de la geometría analítica del espacio que un plano que pasa por <span class="math-text"><i>P</i>₀(<i>x</i>₀, <i>y</i>₀, <i>z</i>₀)</span> con vector normal <span class="math-text"><b>N</b> = (<i>A</i>, <i>B</i>, <i>C</i>)</span> satisface:<br>
        <span class="math-text"><i>A</i>(<i>x</i> − <i>x</i>₀) + <i>B</i>(<i>y</i> − <i>y</i>₀) + <i>C</i>(<i>z</i> − <i>z</i>₀) = 0</span>.<br>
        Sustituyendo <span class="math-text"><i>A</i> = <i>f<sub>x</sub></i>(<i>x</i>₀, <i>y</i>₀)</span>, <span class="math-text"><i>B</i> = <i>f<sub>y</sub></i>(<i>x</i>₀, <i>y</i>₀)</span> y <span class="math-text"><i>C</i> = −1</span>:</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Ecuación general del plano tangente a <i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</strong></div>
          <p><span class="math-text"><i>f<sub>x</sub></i>(<i>x</i>₀, <i>y</i>₀)(<i>x</i> − <i>x</i>₀) + <i>f<sub>y</sub></i>(<i>x</i>₀, <i>y</i>₀)(<i>y</i> − <i>y</i>₀) − (<i>z</i> − <i>z</i>₀) = 0</span></p>
          <p>O despejando la cota <span class="math-text"><i>z</i></span>:</p>
          <p><span class="math-text"><i>z</i> − <i>z</i>₀ = <i>f<sub>x</sub></i>(<i>x</i>₀, <i>y</i>₀)(<i>x</i> − <i>x</i>₀) + <i>f<sub>y</sub></i>(<i>x</i>₀, <i>y</i>₀)(<i>y</i> − <i>y</i>₀)</span></p>
        </div>

        <p><strong>5. Ecuaciones de la recta normal:</strong><br>
        La recta normal pasa por <span class="math-text"><i>P</i>₀(<i>x</i>₀, <i>y</i>₀, <i>z</i>₀)</span> con vector director <span class="math-text"><b>N</b> = (<i>f<sub>x</sub></i>(<i>x</i>₀, <i>y</i>₀), <i>f<sub>y</sub></i>(<i>x</i>₀, <i>y</i>₀), −1)</span>. Sus ecuaciones continuas simétricas son:</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Ecuaciones simétricas de la recta normal</strong></div>
          <p><span class="math-text"><span class="math-fraction"><span><i>x</i> − <i>x</i>₀</span><span><i>f<sub>x</sub></i>(<i>x</i>₀, <i>y</i>₀)</span></span> = <span class="math-fraction"><span><i>y</i> − <i>y</i>₀</span><span><i>f<sub>y</sub></i>(<i>x</i>₀, <i>y</i>₀)</span></span> = <span class="math-fraction"><span><i>z</i> − <i>z</i>₀</span><span>−1</span></span></span></p>
          <p>O en forma paramétrica vectorial con parámetro <span class="math-text"><i>t</i> ∈ ℝ</span>:<br>
          <span class="math-text"><i>x</i> = <i>x</i>₀ + <i>f<sub>x</sub></i>(<i>x</i>₀, <i>y</i>₀)<i>t</i>, &nbsp;&nbsp; <i>y</i> = <i>y</i>₀ + <i>f<sub>y</sub></i>(<i>x</i>₀, <i>y</i>₀)<i>t</i>, &nbsp;&nbsp; <i>z</i> = <i>z</i>₀ − <i>t</i></span>.</p>
        </div>

        <h3>Superficies implícitas <i>F</i>(<i>x</i>, <i>y</i>, <i>z</i>) = 0 y condiciones de regularidad</h3>
        <p>Muchas superficies en la física y la ingeniería no se presentan con <span class="math-text"><i>z</i></span> despejada, sino como una relación implícita <span class="math-text"><i>F</i>(<i>x</i>, <i>y</i>, <i>z</i>) = 0</span> (o una superficie de nivel <span class="math-text"><i>F</i>(<i>x</i>, <i>y</i>, <i>z</i>) = <i>c</i></span>, como esferas, elipsoides o hiperboloides).</p>

        <p>De acuerdo con el <strong>Teorema 4 (pág. 10)</strong> de <em>Semana 05.pdf</em>, para construir rigurosamente el plano tangente a una superficie implícita se deben verificar las siguientes condiciones:</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Teorema 4: Condiciones de regularidad y vector normal implícito</strong></div>
          <p>Sea una superficie <span class="math-text"><i>S</i></span> definida por la ecuación implícita <span class="math-text"><i>F</i>(<i>x</i>, <i>y</i>, <i>z</i>) = 0</span> y sea <span class="math-text"><i>P</i>₀(<i>x</i>₀, <i>y</i>₀, <i>z</i>₀)</span> un punto sobre <span class="math-text"><i>S</i></span>.<br>
          <strong>Condición 1:</strong> Las derivadas parciales <span class="math-text"><i>F<sub>x</sub></i>, <i>F<sub>y</sub></i>, <i>F<sub>z</sub></i></span> existen y son continuas en un entorno esférico de <span class="math-text"><i>P</i>₀</span> (<span class="math-text"><i>F</i> ∈ <i>C</i>¹</span>).<br>
          <strong>Condición 2 (No singularidad):</strong> Las derivadas parciales no se anulan simultáneamente en <span class="math-text"><i>P</i>₀</span>, es decir:<br>
          <span class="math-text">∇<i>F</i>(<i>P</i>₀) = (<i>F<sub>x</sub></i>(<i>P</i>₀),  <i>F<sub>y</sub></i>(<i>P</i>₀),  <i>F<sub>z</sub></i>(<i>P</i>₀)) ≠ (0, 0, 0)</span>.<br>
          Bajo estas dos condiciones, el vector gradiente <span class="math-text">∇<i>F</i>(<i>P</i>₀)</span> es un <strong>vector normal</strong> a la superficie <span class="math-text"><i>S</i></span> en el punto <span class="math-text"><i>P</i>₀</span>.</p>
        </div>

        <p>• <strong>Demostración de ortogonalidad mediante la regla de la cadena:</strong><br>
        Sea <span class="math-text"><b>r</b>(<i>t</i>) = (<i>x</i>(<i>t</i>), <i>y</i>(<i>t</i>), <i>z</i>(<i>t</i>))</span> cualquier curva suave trazada sobre la superficie <span class="math-text"><i>S</i></span> que pasa por <span class="math-text"><i>P</i>₀</span> en <span class="math-text"><i>t</i> = 0</span> (con <span class="math-text"><b>r</b>(0) = <i>P</i>₀</span>).<br>
        Dado que toda la curva está en la superficie, satisface idénticamente <span class="math-text"><i>F</i>(<i>x</i>(<i>t</i>), <i>y</i>(<i>t</i>), <i>z</i>(<i>t</i>)) = 0</span> para todo <span class="math-text"><i>t</i></span>.<br>
        Derivando respecto a <span class="math-text"><i>t</i></span> mediante la regla de la cadena multivariable en <span class="math-text"><i>t</i> = 0</span>:<br>
        <span class="math-text"><span class="math-fraction"><span><i>d</i></span><span><i>dt</i></span></span>[<i>F</i>(<b>r</b>(<i>t</i>))] = <span class="math-fraction"><span>∂<i>F</i></span><span>∂<i>x</i></span></span> <span class="math-fraction"><span><i>dx</i></span><span><i>dt</i></span></span> + <span class="math-fraction"><span>∂<i>F</i></span><span>∂<i>y</i></span></span> <span class="math-fraction"><span><i>dy</i></span><span><i>dt</i></span></span> + <span class="math-fraction"><span>∂<i>F</i></span><span>∂<i>z</i></span></span> <span class="math-fraction"><span><i>dz</i></span><span><i>dt</i></span></span> = ∇<i>F</i>(<i>P</i>₀) · <b>r</b>′(0) = 0</span>.<br>
        Como el producto escalar es nulo, el vector gradiente <span class="math-text">∇<i>F</i>(<i>P</i>₀)</span> es estrictamente perpendicular al vector tangente <span class="math-text"><b>r</b>′(0)</span> de <em>cualquier</em> curva sobre la superficie.</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Ecuaciones del plano tangente y recta normal para superficies implícitas</strong></div>
          <p>• <strong>Plano tangente implícito:</strong><br>
          <span class="math-text"><i>F<sub>x</sub></i>(<i>P</i>₀)(<i>x</i> − <i>x</i>₀) + <i>F<sub>y</sub></i>(<i>P</i>₀)(<i>y</i> − <i>y</i>₀) + <i>F<sub>z</sub></i>(<i>P</i>₀)(<i>z</i> − <i>z</i>₀) = 0</span></p>
          <p>• <strong>Recta normal implícita:</strong><br>
          <span class="math-text"><span class="math-fraction"><span><i>x</i> − <i>x</i>₀</span><span><i>F<sub>x</sub></i>(<i>P</i>₀)</span></span> = <span class="math-fraction"><span><i>y</i> − <i>y</i>₀</span><span><i>F<sub>y</sub></i>(<i>P</i>₀)</span></span> = <span class="math-fraction"><span><i>z</i> − <i>z</i>₀</span><span><i>F<sub>z</sub></i>(<i>P</i>₀)</span></span></span></p>
        </div>

        <p>• <strong>Alcance del teorema y casos con gradiente nulo (falla de hipótesis vs. inexistencia):</strong> El Teorema 4 establece una condición suficiente: cuando <span class="math-text">∇<i>F</i>(<i>P</i>₀) ≠ <b>0</b></span> bajo las hipótesis de continuidad, <strong>se garantiza la existencia de un plano tangente regular</strong> con vector normal <span class="math-text">∇<i>F</i>(<i>P</i>₀)</span>. Si en un punto ocurre que <span class="math-text">∇<i>F</i>(<i>P</i>₀) = (<i>F<sub>x</sub></i>, <i>F<sub>y</sub></i>, <i>F<sub>z</sub></i>) = (0, 0, 0)</span>, el teorema <strong>simplemente no es aplicable</strong>; sin embargo, <em>esto no demuestra automáticamente que el plano tangente no exista</em>, ya que la anulación del gradiente puede originarse en la elección analítica de la función <span class="math-text"><i>F</i></span> y no en una singularidad geométrica real.<br>
        • <em>Contraejemplo ilustrativo:</em> Consideremos la función implícita <span class="math-text"><i>F</i>(<i>x</i>, <i>y</i>, <i>z</i>) = <i>z</i>² = 0</span>. Sus derivadas parciales son <span class="math-text"><i>F<sub>x</sub></i> = 0</span>, <span class="math-text"><i>F<sub>y</sub></i> = 0</span> y <span class="math-text"><i>F<sub>z</sub></i> = 2<i>z</i></span>, por lo que en cualquier punto <span class="math-text">(<i>x</i>₀, <i>y</i>₀, 0)</span> de la superficie se anulan simultáneamente: <span class="math-text">∇<i>F</i> = (0, 0, 0)</span>. Aunque el Teorema 4 no aplica, la superficie geométrica <span class="math-text"><i>z</i>² = 0</span> es exactamente el plano <span class="math-text"><i>z</i> = 0</span> (el plano cartesiano <span class="math-text"><i>XY</i></span>), el cual admite evidentemente plano tangente en todos sus puntos (coincidente consigo mismo: <span class="math-text"><i>z</i> = 0</span>).<br>
        • <em>Casos de singularidad geométrica genuina:</em> En contraste, cuando la superficie presenta una verdadera cúspide o autointersección, como en el vértice del cono <span class="math-text"><i>x</i>² + <i>y</i>² − <i>z</i>² = 0</span> en el origen <span class="math-text">(0, 0, 0)</span>, también se tiene <span class="math-text">∇<i>F</i> = (0, 0, 0)</span>, pero allí la superficie efectivamente carece de un plano tangente único.</p>
        <p>• <strong>Equivalencia con el caso explícito:</strong> Si tomamos <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span> y lo expresamos en forma implícita definiendo <span class="math-text"><i>F</i>(<i>x</i>, <i>y</i>, <i>z</i>) = <i>f</i>(<i>x</i>, <i>y</i>) − <i>z</i> = 0</span>, se calculan de inmediato sus parciales:<br>
        <span class="math-text"><i>F<sub>x</sub></i> = <i>f<sub>x</sub></i></span>, &nbsp;&nbsp; <span class="math-text"><i>F<sub>y</sub></i> = <i>f<sub>y</sub></i></span>, &nbsp;&nbsp; <span class="math-text"><i>F<sub>z</sub></i> = −1</span>.<br>
        Sustituyendo en la fórmula implícita recuperamos con total naturalidad la ecuación explícita.</p>

        <h3>Relación con el diferencial total y la aproximación lineal (04_Semana.pdf)</h3>
        <p>El plano tangente no es solamente una entidad geométrica estática: representa el soporte analítico de la <strong>linealización local</strong> y del <strong>diferencial total</strong> desarrollados por el profesor Chávez en <em>04_Semana.pdf</em> (págs. 4-8):</p>

        <p><strong>1. La función de linealización <i>L</i>(<i>x</i>, <i>y</i>):</strong><br>
        Si despejamos <span class="math-text"><i>z</i></span> en la ecuación del plano tangente a <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span> en <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span>, obtenemos la función afín lineal:<br>
        <span class="math-text"><i>L</i>(<i>x</i>, <i>y</i>) = <i>f</i>(<i>x</i>₀, <i>y</i>₀) + <i>f<sub>x</sub></i>(<i>x</i>₀, <i>y</i>₀)(<i>x</i> − <i>x</i>₀) + <i>f<sub>y</sub></i>(<i>x</i>₀, <i>y</i>₀)(<i>y</i> − <i>y</i>₀)</span>.<br>
        La gráfica de <span class="math-text"><i>z</i> = <i>L</i>(<i>x</i>, <i>y</i>)</span> es exactamente el plano tangente. Para cualquier punto <span class="math-text">(<i>x</i>, <i>y</i>)</span> en un entorno cercano al punto base <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span>, la superficie real se aproxima mediante su plano tangente:<br>
        <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) ≈ <i>L</i>(<i>x</i>, <i>y</i>)</span>.</p>

        <p><strong>2. El diferencial total <i>dz</i> vs. el incremento real Δ<i>z</i>:</strong><br>
        Si fijamos los incrementos en las variables independientes como <span class="math-text">Δ<i>x</i> = <i>dx</i> = <i>x</i> − <i>x</i>₀</span> y <span class="math-text">Δ<i>y</i> = <i>dy</i> = <i>y</i> − <i>y</i>₀</span>:<br>
        • El <strong>incremento real de la función</strong> es la variación vertical sobre la <em>superficie curva</em>:<br>
        <span class="math-text">Δ<i>z</i> = <i>f</i>(<i>x</i>₀ + Δ<i>x</i>, <i>y</i>₀ + Δ<i>y</i>) − <i>f</i>(<i>x</i>₀, <i>y</i>₀)</span>.<br>
        • El <strong>diferencial total</strong> es la variación vertical medida sobre el <em>plano tangente</em>:<br>
        <span class="math-text"><i>dz</i> = <i>f<sub>x</sub></i>(<i>x</i>₀, <i>y</i>₀)<i>dx</i> + <i>f<sub>y</sub></i>(<i>x</i>₀, <i>y</i>₀)<i>dy</i></span>.<br>
        • <em>Interpretación del error:</em> Por la definición formal de diferenciabilidad (Definición 2 de <em>04_Semana.pdf</em>), <span class="math-text">Δ<i>z</i> = <i>dz</i> + <i>ε</i>₁Δ<i>x</i> + <i>ε</i>₂Δ<i>y</i></span> donde <span class="math-text">(<i>ε</i>₁, <i>ε</i>₂) → (0, 0)</span> cuando <span class="math-text">(Δ<i>x</i>, Δ<i>y</i>) → (0, 0)</span>. Esto garantiza geométricamente que el plano tangente se «adhiere» a la superficie con un error que se desvanece mucho más rápido que la distancia en el plano base.</p>

        <h3>Ejemplos resueltos del folleto (paso a paso)</h3>

        <p><strong>Ejemplo 1: Plano tangente al paraboloide hiperbólico (Ejemplo 1 de Semana 05, pág. 5)</strong><br>
        Hallar la ecuación del plano tangente y de la recta normal a la superficie <span class="math-text"><i>z</i> = <i>x</i>² − 4<i>y</i>²</span> en el punto <span class="math-text"><i>P</i>(5, 2, 9)</span>.<br>
        • <em>Solución explicada paso a paso:</em><br>
        1) <strong>Verificación del punto en la superficie:</strong><br>
        Evaluamos las coordenadas <span class="math-text"><i>x</i> = 5</span> e <span class="math-text"><i>y</i> = 2</span> en la función:<br>
        <span class="math-text"><i>z</i>(5, 2) = (5)² − 4(2)² = 25 − 4(4) = 25 − 16 = 9</span>.<br>
        El punto <span class="math-text"><i>P</i>(5, 2, 9)</span> satisface la ecuación y pertenece a la superficie.<br>
        2) <strong>Cálculo de las derivadas parciales en el punto:</strong><br>
        <span class="math-text"><span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>x</i></span></span> = <span class="math-fraction"><span>∂</span><span>∂<i>x</i></span></span>(<i>x</i>² − 4<i>y</i>²) = 2<i>x</i> ⇒ <span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>x</i></span></span>|<sub><i>P</i></sub> = 2(5) = 10</span>.<br>
        <span class="math-text"><span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>y</i></span></span> = <span class="math-fraction"><span>∂</span><span>∂<i>y</i></span></span>(<i>x</i>² − 4<i>y</i>²) = −8<i>y</i> ⇒ <span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>y</i></span></span>|<sub><i>P</i></sub> = −8(2) = −16</span>.<br>
        3) <strong>Construcción del vector normal:</strong><br>
        El vector normal a la superficie en <span class="math-text"><i>P</i></span> viene dado por:<br>
        <span class="math-text"><b>N</b> = (<span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>x</i></span></span>, <span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>y</i></span></span>, −1) = (10, −16, −1)</span>.<br>
        4) <strong>Ecuación del plano tangente:</strong><br>
        Aplicamos la fórmula punto-normal con <span class="math-text">(<i>x</i>₀, <i>y</i>₀, <i>z</i>₀) = (5, 2, 9)</span>:<br>
        <span class="math-text">10(<i>x</i> − 5) − 16(<i>y</i> − 2) − 1(<i>z</i> − 9) = 0</span><br>
        Efectuamos el desarrollo algebraico:<br>
        <span class="math-text">10<i>x</i> − 50 − 16<i>y</i> + 32 − <i>z</i> + 9 = 0</span><br>
        <span class="math-text">10<i>x</i> − 16<i>y</i> − <i>z</i> − 9 = 0 ⇒ 10<i>x</i> − 16<i>y</i> − <i>z</i> = 9</span>.<br>
        5) <strong>Ecuaciones de la recta normal:</strong><br>
        Con vector director <span class="math-text"><b>N</b> = (10, −16, −1)</span>:<br>
        <span class="math-text"><span class="math-fraction"><span><i>x</i> − 5</span><span>10</span></span> = <span class="math-fraction"><span><i>y</i> − 2</span><span>−16</span></span> = <span class="math-fraction"><span><i>z</i> − 9</span><span>−1</span></span></span>.</p>

        <p><strong>Ejemplo 2: Puntos con plano tangente horizontal (Ejemplo 2 de Semana 05, pág. 5)</strong><br>
        Encuentre el punto donde el plano tangente a la superficie <span class="math-text"><i>z</i> = <i>x</i>² + 2<i>xy</i> + 2<i>y</i>² − 6<i>x</i> + 8<i>y</i></span> es horizontal.<br>
        • <em>Solución explicada:</em><br>
        1) <strong>Condición de plano horizontal:</strong> Un plano es horizontal si es paralelo al plano <span class="math-text"><i>XY</i></span>, lo que exige que su vector normal <span class="math-text"><b>N</b> = (<i>z<sub>x</sub></i>, <i>z<sub>y</sub></i>, −1)</span> tenga sus dos primeras componentes nulas:<br>
        <span class="math-text"><span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>x</i></span></span> = 0 &nbsp;&nbsp;y&nbsp;&nbsp; <span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>y</i></span></span> = 0</span>.<br>
        2) <strong>Sistema de derivadas parciales:</strong><br>
        <span class="math-text"><span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>x</i></span></span> = 2<i>x</i> + 2<i>y</i> − 6 = 0 ⇒ <i>x</i> + <i>y</i> = 3</span> &nbsp;&nbsp;<strong>(1)</strong><br>
        <span class="math-text"><span class="math-fraction"><span>∂<i>z</i></span><span>∂<i>y</i></span></span> = 2<i>x</i> + 4<i>y</i> + 8 = 0 ⇒ <i>x</i> + 2<i>y</i> = −4</span> &nbsp;&nbsp;<strong>(2)</strong><br>
        3) <strong>Resolución del sistema lineal:</strong><br>
        Restando la ecuación (1) de la ecuación (2):<br>
        <span class="math-text">(<i>x</i> + 2<i>y</i>) − (<i>x</i> + <i>y</i>) = −4 − 3 ⇒ <i>y</i> = −7</span>.<br>
        Sustituyendo <span class="math-text"><i>y</i> = −7</span> en (1):<br>
        <span class="math-text"><i>x</i> + (−7) = 3 ⇒ <i>x</i> = 10</span>.<br>
        4) <strong>Cálculo de la cota <i>z</i>:</strong><br>
        <span class="math-text"><i>z</i>(10, −7) = (10)² + 2(10)(−7) + 2(−7)² − 6(10) + 8(−7)</span><br>
        <span class="math-text"><i>z</i> = 100 − 140 + 2(49) − 60 − 56 = 100 − 140 + 98 − 60 − 56 = −58</span>.<br>
        Por tanto, el punto buscado es <span class="math-text"><i>P</i>(10, −7, −58)</span> y la ecuación del plano tangente horizontal es <span class="math-text"><i>z</i> = −58</span>.</p>

        <p><strong>Ejemplo 3: Plano tangente a una superficie implícita (Ejemplo 8 de Semana 05, pág. 11)</strong><br>
        Encontrar una ecuación del plano tangente y de la recta normal a la superficie implícita <span class="math-text"><i>z x</i>² − <i>x y</i>² − <i>y z</i>² = 18</span> en el punto <span class="math-text"><i>P</i>₀(0, −2, 3)</span>.<br>
        • <em>Solución explicada:</em><br>
        1) Definimos el campo escalar implícito:<br>
        <span class="math-text"><i>F</i>(<i>x</i>, <i>y</i>, <i>z</i>) = <i>z x</i>² − <i>x y</i>² − <i>y z</i>² − 18 = 0</span>.<br>
        Comprobamos el punto: <span class="math-text">3(0)² − 0(−2)² − (−2)(3)² − 18 = 0 − 0 − (−18) − 18 = 0</span>.<br>
        2) Calculamos las componentes del vector gradiente <span class="math-text">∇<i>F</i></span> y las evaluamos en <span class="math-text"><i>P</i>₀(0, −2, 3)</span>:<br>
        <span class="math-text"><i>F<sub>x</sub></i> = 2<i>zx</i> − <i>y</i>² ⇒ <i>F<sub>x</sub></i>(<i>P</i>₀) = 2(3)(0) − (−2)² = 0 − 4 = −4</span>.<br>
        <span class="math-text"><i>F<sub>y</sub></i> = −2<i>xy</i> − <i>z</i>² ⇒ <i>F<sub>y</sub></i>(<i>P</i>₀) = −2(0)(−2) − (3)² = 0 − 9 = −9</span>.<br>
        <span class="math-text"><i>F<sub>z</sub></i> = <i>x</i>² − 2<i>yz</i> ⇒ <i>F<sub>z</sub></i>(<i>P</i>₀) = (0)² − 2(−2)(3) = 0 + 12 = 12</span>.<br>
        El vector normal es <span class="math-text">∇<i>F</i>(<i>P</i>₀) = (−4, −9, 12)</span>.<br>
        3) <strong>Ecuación del plano tangente:</strong><br>
        <span class="math-text">−4(<i>x</i> − 0) − 9(<i>y</i> − (−2)) + 12(<i>z</i> − 3) = 0</span><br>
        <span class="math-text">−4<i>x</i> − 9(<i>y</i> + 2) + 12(<i>z</i> − 3) = 0</span><br>
        <span class="math-text">−4<i>x</i> − 9<i>y</i> − 18 + 12<i>z</i> − 36 = 0 ⇒ −4<i>x</i> − 9<i>y</i> + 12<i>z</i> − 54 = 0</span>.<br>
        Multiplicando por <span class="math-text">−1</span> obtenemos la ecuación canónica simplificada:<br>
        <span class="math-text">4<i>x</i> + 9<i>y</i> − 12<i>z</i> + 54 = 0</span>.<br>
        4) <strong>Ecuaciones simétricas de la recta normal:</strong><br>
        <span class="math-text"><span class="math-fraction"><span><i>x</i></span><span>−4</span></span> = <span class="math-fraction"><span><i>y</i> + 2</span><span>−9</span></span> = <span class="math-fraction"><span><i>z</i> − 3</span><span>12</span></span></span> &nbsp;&nbsp;(o multiplicando denominadores por −1: <span class="math-text"><span class="math-fraction"><span><i>x</i></span><span>4</span></span> = <span class="math-fraction"><span><i>y</i> + 2</span><span>9</span></span> = <span class="math-fraction"><span><i>z</i> − 3</span><span>−12</span></span></span>).</p>

        <h3>Ejercicios de práctica propuestos del folleto (con soluciones detalladas)</h3>

        <p><strong>Ejercicio 1: Plano tangente a un paraboloide elíptico en forma implícita (Propuesto 7.i de Semana 05, pág. 14)</strong><br>
        Encuentre las ecuaciones del plano tangente y de la recta normal a la superficie <span class="math-text"><i>x</i>² + <i>y</i>² − 3<i>z</i> = 2</span> en el punto <span class="math-text"><i>P</i>(2, 4, 6)</span>.<br>
        • <em>Solución explicada:</em><br>
        1) Comprobamos el punto: <span class="math-text">2² + 4² − 3(6) = 4 + 16 − 18 = 2</span>.<br>
        2) Expresamos <span class="math-text"><i>F</i>(<i>x</i>, <i>y</i>, <i>z</i>) = <i>x</i>² + <i>y</i>² − 3<i>z</i> − 2 = 0</span>.<br>
        Derivadas parciales evaluadas en <span class="math-text"><i>P</i>(2, 4, 6)</span>:<br>
        <span class="math-text"><i>F<sub>x</sub></i> = 2<i>x</i> ⇒ <i>F<sub>x</sub></i>(<i>P</i>) = 2(2) = 4</span>.<br>
        <span class="math-text"><i>F<sub>y</sub></i> = 2<i>y</i> ⇒ <i>F<sub>y</sub></i>(<i>P</i>) = 2(4) = 8</span>.<br>
        <span class="math-text"><i>F<sub>z</sub></i> = −3 ⇒ <i>F<sub>z</sub></i>(<i>P</i>) = −3</span>.<br>
        Vector normal: <span class="math-text"><b>N</b> = (4, 8, −3)</span>.<br>
        3) <strong>Plano tangente:</strong><br>
        <span class="math-text">4(<i>x</i> − 2) + 8(<i>y</i> − 4) − 3(<i>z</i> − 6) = 0</span><br>
        <span class="math-text">4<i>x</i> − 8 + 8<i>y</i> − 32 − 3<i>z</i> + 18 = 0 ⇒ 4<i>x</i> + 8<i>y</i> − 3<i>z</i> = 22</span>.<br>
        4) <strong>Recta normal:</strong><br>
        <span class="math-text"><span class="math-fraction"><span><i>x</i> − 2</span><span>4</span></span> = <span class="math-fraction"><span><i>y</i> − 4</span><span>8</span></span> = <span class="math-fraction"><span><i>z</i> − 6</span><span>−3</span></span></span>.</p>

        <p><strong>Ejercicio 2: Tangencia con simplificación de vector director (Propuesto 7.v de Semana 05, pág. 14)</strong><br>
        Encuentre las ecuaciones del plano tangente y de la recta normal a <span class="math-text"><i>x</i>² + <i>y</i>² = 4<i>z</i></span> en el punto <span class="math-text"><i>P</i>(2, −4, 5)</span>.<br>
        • <em>Solución explicada:</em><br>
        1) Comprobamos el punto: <span class="math-text">2² + (−4)² = 4 + 16 = 20 = 4(5)</span>.<br>
        2) Tomamos <span class="math-text"><i>F</i>(<i>x</i>, <i>y</i>, <i>z</i>) = <i>x</i>² + <i>y</i>² − 4<i>z</i> = 0</span>:<br>
        <span class="math-text"><i>F<sub>x</sub></i>(<i>P</i>) = 2(2) = 4, &nbsp;&nbsp; <i>F<sub>y</sub></i>(<i>P</i>) = 2(−4) = −8, &nbsp;&nbsp; <i>F<sub>z</sub></i>(<i>P</i>) = −4</span>.<br>
        Vector gradiente: <span class="math-text">∇<i>F</i>(<i>P</i>) = (4, −8, −4)</span>.<br>
        Podemos dividir por el factor común 4 para obtener un vector normal simplificado más elegante: <span class="math-text"><b>n</b> = (1, −2, −1)</span>.<br>
        3) <strong>Plano tangente:</strong><br>
        <span class="math-text">1(<i>x</i> − 2) − 2(<i>y</i> − (−4)) − 1(<i>z</i> − 5) = 0</span><br>
        <span class="math-text"><i>x</i> − 2 − 2<i>y</i> − 8 − <i>z</i> + 5 = 0 ⇒ <i>x</i> − 2<i>y</i> − <i>z</i> = 5</span>.<br>
        4) <strong>Recta normal:</strong><br>
        <span class="math-text"><span class="math-fraction"><span><i>x</i> − 2</span><span>1</span></span> = <span class="math-fraction"><span><i>y</i> + 4</span><span>−2</span></span> = <span class="math-fraction"><span><i>z</i> − 5</span><span>−1</span></span></span>.</p>

        <p><strong>Ejercicio 3: Superficie explícita polinómica (Propuesto 7.vii de Semana 05, pág. 14)</strong><br>
        Hallar el plano tangente y la recta normal a <span class="math-text"><i>z</i> = <i>x</i>² + <i>y</i>² − 1</span> en <span class="math-text"><i>P</i>(2, 1, 4)</span>.<br>
        • <em>Solución explicada:</em><br>
        1) Comprobamos el punto: <span class="math-text"><i>z</i>(2, 1) = 2² + 1² − 1 = 4 + 1 − 1 = 4</span>.<br>
        2) Derivadas parciales directas:<br>
        <span class="math-text"><i>z<sub>x</sub></i> = 2<i>x</i> ⇒ <i>z<sub>x</sub></i>(2, 1) = 4</span>.<br>
        <span class="math-text"><i>z<sub>y</sub></i> = 2<i>y</i> ⇒ <i>z<sub>y</sub></i>(2, 1) = 2</span>.<br>
        Vector normal: <span class="math-text"><b>N</b> = (4, 2, −1)</span>.<br>
        3) <strong>Plano tangente:</strong><br>
        <span class="math-text">4(<i>x</i> − 2) + 2(<i>y</i> − 1) − (<i>z</i> − 4) = 0</span><br>
        <span class="math-text">4<i>x</i> − 8 + 2<i>y</i> − 2 − <i>z</i> + 4 = 0 ⇒ 4<i>x</i> + 2<i>y</i> − <i>z</i> = 6</span>.<br>
        4) <strong>Recta normal:</strong><br>
        <span class="math-text"><span class="math-fraction"><span><i>x</i> − 2</span><span>4</span></span> = <span class="math-fraction"><span><i>y</i> − 1</span><span>2</span></span> = <span class="math-fraction"><span><i>z</i> − 4</span><span>−1</span></span></span>.</p>

        <p><strong>Ejercicio 4: Estimación del incremento real mediante el diferencial del plano tangente (04_Semana.pdf, págs. 8-9)</strong><br>
        Sea la superficie del paraboloide circular <span class="math-text"><i>z</i> = <i>x</i>² + <i>y</i>²</span>. Se pasa del punto <span class="math-text">(1, 2)</span> al punto perturbado <span class="math-text">(1.05, 2.02)</span>. Compare el incremento exacto <span class="math-text">Δ<i>z</i></span> sobre la superficie con la aproximación lineal <span class="math-text"><i>dz</i></span> proporcionada por el plano tangente.<br>
        • <em>Solución explicada:</em><br>
        1) <strong>Cálculo del valor base e incremento real:</strong><br>
        En el punto inicial <span class="math-text">(1, 2)</span>: <span class="math-text"><i>z</i>₀ = 1² + 2² = 5</span>.<br>
        En el punto final <span class="math-text">(1.05, 2.02)</span>: <span class="math-text"><i>z</i> = (1.05)² + (2.02)² = 1.1025 + 4.0804 = 5.1829</span>.<br>
        Incremento real exacto: <span class="math-text">Δ<i>z</i> = 5.1829 − 5 = 0.1829</span>.<br>
        2) <strong>Cálculo mediante el plano tangente (Diferencial total):</strong><br>
        Las variaciones de las variables son <span class="math-text"><i>dx</i> = 1.05 − 1 = 0.05</span> y <span class="math-text"><i>dy</i> = 2.02 − 2 = 0.02</span>.<br>
        Las derivadas en <span class="math-text">(1, 2)</span> valen <span class="math-text"><i>z<sub>x</sub></i> = 2(1) = 2</span> y <span class="math-text"><i>z<sub>y</sub></i> = 2(2) = 4</span>.<br>
        La variación estimada sobre el plano tangente es el diferencial:<br>
        <span class="math-text"><i>dz</i> = <i>z<sub>x</sub> dx</i> + <i>z<sub>y</sub> dy</i> = 2(0.05) + 4(0.02) = 0.10 + 0.08 = 0.1800</span>.<br>
        3) <strong>Comparación y error de aproximación:</strong><br>
        La diferencia absoluta entre la variación real y la estimada sobre el plano tangente es:<br>
        <span class="math-text">|Δ<i>z</i> − <i>dz</i>| = |0.1829 − 0.1800| = 0.0029</span>.<br>
        Tomando como base el <strong>incremento real <span class="math-text">Δ<i>z</i></span></strong>, el error relativo es:<br>
        <span class="math-text"><span class="math-fraction"><span>|Δ<i>z</i> − <i>dz</i>|</span><span>Δ<i>z</i></span></span> = <span class="math-fraction"><span>0.0029</span><span>0.1829</span></span> ≈ 0.01586 ≈ 1.59%</span>.<br>
        Este error relativo de aproximadamente <span class="math-text">1.59%</span> respecto a <span class="math-text">Δ<i>z</i></span> demuestra la extraordinaria fidelidad del plano tangente como aproximación lineal local de la superficie.</p>`
    },
    {
      title: 'Gradiente',
      content: `<p class="lesson-lead">El vector gradiente y la derivada direccional constituyen dos de los pilares más potentes y versátiles del cálculo multivariable. Mientras que las derivadas parciales ordinarias evalúan la tasa de variación restringida a las direcciones axiales de los ejes coordenados, la derivada direccional permite medir la rapidez de cambio en cualquier dirección del espacio. El vector gradiente reúne estas razones de cambio formando una brújula geométrica que apunta en la dirección de máxima pendiente, tiene por módulo la tasa máxima de crecimiento y es rigurosamente ortogonal a las curvas y superficies de nivel.</p>

        <h2>El vector gradiente y la derivada direccional</h2>

        <h3>Construcción y definición del vector gradiente</h3>
        <p>Sea <span class="math-text"><i>f</i></span> un campo escalar diferenciable de dos o más variables independientes. Al agrupar sus derivadas parciales de primer orden en una estructura vectorial ordenada, se define el <strong>vector gradiente</strong> de la función:</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Definición: Vector gradiente (Definición 2 del folleto, pág. 7)</strong></div>
          <p>• Para una función de dos variables <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span>, el gradiente de <span class="math-text"><i>f</i></span>, denotado por <span class="math-text">grad <i>f</i></span> o <span class="math-text">∇<i>f</i></span>, es el campo vectorial definido por:<br>
          <span class="math-text">∇<i>f</i>(<i>x</i>, <i>y</i>) = <i>f<sub>x</sub></i>(<i>x</i>, <i>y</i>)<b>i</b> + <i>f<sub>y</sub></i>(<i>x</i>, <i>y</i>)<b>j</b> = (<span class="math-fraction"><span>∂<i>f</i></span><span>∂<i>x</i></span></span>, <span class="math-fraction"><span>∂<i>f</i></span><span>∂<i>y</i></span></span>)</span></p>
          <p>• Para una función de tres variables <span class="math-text"><i>w</i> = <i>f</i>(<i>x</i>, <i>y</i>, <i>z</i>)</span>, el vector gradiente en <span class="math-text">ℝ³</span> viene dado por:<br>
          <span class="math-text">∇<i>f</i>(<i>x</i>, <i>y</i>, <i>z</i>) = <i>f<sub>x</sub></i><b>i</b> + <i>f<sub>y</sub></i><b>j</b> + <i>f<sub>z</sub></i><b>k</b> = (<span class="math-fraction"><span>∂<i>f</i></span><span>∂<i>x</i></span></span>, <span class="math-fraction"><span>∂<i>f</i></span><span>∂<i>y</i></span></span>, <span class="math-fraction"><span>∂<i>f</i></span><span>∂<i>z</i></span></span>)</span></p>
        </div>

        <p>• <strong>El operador diferencial Nabla (∇):</strong> El símbolo <span class="math-text">∇</span> (nabla) representa un operador diferencial vectorial que en coordenadas cartesianas tridimensionales actúa como <span class="math-text">∇ = (<span class="math-fraction"><span>∂</span><span>∂<i>x</i></span></span>, <span class="math-fraction"><span>∂</span><span>∂<i>y</i></span></span>, <span class="math-fraction"><span>∂</span><span>∂<i>z</i></span></span>)</span>. Al operar sobre un campo escalar <span class="math-text"><i>f</i></span>, produce un campo vectorial <span class="math-text">∇<i>f</i></span>, transformando funciones numéricas en vectores direccionales con significado físico y geométrico.</p>

        <h3>La derivada direccional: Definición formal por límites</h3>
        <p>En muchas aplicaciones prácticas interesa conocer cómo varía una magnitud (como la temperatura, la presión o el potencial eléctrico) al desplazarse en una dirección oblicua arbitraria, no necesariamente paralela a los ejes cartesianos <span class="math-text"><i>X</i></span> o <span class="math-text"><i>Y</i></span>.</p>
        <p>De acuerdo con la <strong>Definición 1 (pág. 6)</strong> del folleto <em>Semana 05.pdf</em> del profesor David Chávez:</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Definición 1: Derivada direccional mediante límites</strong></div>
          <p>Sea <span class="math-text"><i>f</i></span> una función de dos variables <span class="math-text">(<i>x</i>, <i>y</i>)</span> y sea <span class="math-text"><b>u</b> = cos <i>θ</i> <b>i</b> + sen <i>θ</i> <b>j</b></span> un <strong>vector unitario</strong> en el plano <span class="math-text"><i>XY</i></span> (donde <span class="math-text"><i>θ</i></span> es el ángulo que forma <span class="math-text"><b>u</b></span> con el sentido positivo del eje <span class="math-text"><i>X</i></span>).<br>
          La <strong>derivada direccional</strong> de <span class="math-text"><i>f</i></span> en la dirección del vector unitario <span class="math-text"><b>u</b></span>, denotada por <span class="math-text"><i>D</i><sub><b>u</b></sub><i>f</i></span>, se define por el límite incremental:<br>
          <span class="math-text"><i>D</i><sub><b>u</b></sub><i>f</i>(<i>x</i>, <i>y</i>) = <span class="math-limit"><span>lim</span><sub><i>h</i>→0</sub></span><span class="math-fraction"><span><i>f</i>(<i>x</i> + <i>h</i> cos <i>θ</i>, <i>y</i> + <i>h</i> sen <i>θ</i>) − <i>f</i>(<i>x</i>, <i>y</i>)</span><span><i>h</i></span></span></span><br>
          siempre que este límite exista.</p>
        </div>

        <p>• <strong>Interpretación geométrica de la derivada direccional:</strong><br>
        La derivada direccional <span class="math-text"><i>D</i><sub><b>u</b></sub><i>f</i></span> mide la razón instantánea de cambio de los valores de la función por unidad de distancia recorrida en el plano base <span class="math-text"><i>XY</i></span> en la dirección marcada por <span class="math-text"><b>u</b></span>. Geométricamente representa la <strong>pendiente de la recta tangente</strong> a la curva espacial formada por la intersección de la superficie <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span> con un plano vertical que pasa por <span class="math-text">(<i>x</i>, <i>y</i>, 0)</span> en la dirección del vector <span class="math-text"><b>u</b></span>.</p>

        <p>• <strong>Reducción a las derivadas parciales canónicas:</strong><br>
        1) Si tomamos la dirección horizontal del semieje <span class="math-text"><i>X</i></span> positivo, <span class="math-text"><i>θ</i> = 0 ⇒ <b>u</b> = <b>i</b> = (1, 0)</span>:<br>
        <span class="math-text"><i>D</i><sub><b>i</b></sub><i>f</i> = <span class="math-limit"><span>lim</span><sub><i>h</i>→0</sub></span><span class="math-fraction"><span><i>f</i>(<i>x</i> + <i>h</i>, <i>y</i>) − <i>f</i>(<i>x</i>, <i>y</i>)</span><span><i>h</i></span></span> = <span class="math-fraction"><span>∂<i>f</i></span><span>∂<i>x</i></span></span> = <i>f<sub>x</sub></i></span>.<br>
        2) Si tomamos la dirección vertical del semieje <span class="math-text"><i>Y</i></span> positivo, <span class="math-text"><i>θ</i> = <span class="math-fraction"><span><i>π</i></span><span>2</span></span> ⇒ <b>u</b> = <b>j</b> = (0, 1)</span>:<br>
        <span class="math-text"><i>D</i><sub><b>j</b></sub><i>f</i> = <span class="math-limit"><span>lim</span><sub><i>h</i>→0</sub></span><span class="math-fraction"><span><i>f</i>(<i>x</i>, <i>y</i> + <i>h</i>) − <i>f</i>(<i>x</i>, <i>y</i>)</span><span><i>h</i></span></span> = <span class="math-fraction"><span>∂<i>f</i></span><span>∂<i>y</i></span></span> = <i>f<sub>y</sub></i></span>.<br>
        Las derivadas parciales axiales son, en consecuencia, casos particulares de la derivada direccional.</p>

        <h3>Cálculo mediante el producto escalar para funciones diferenciables</h3>
        <p>Aunque la definición por límite es la base formal del concepto, evaluar incrementos algebraicos en cada dirección resulta laborioso. Cuando la función es diferenciable, el <strong>Teorema 1 (pág. 7)</strong> del profesor Chávez simplifica drásticamente el cálculo:</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Teorema 1: Fórmula del producto escalar (Gradiente y Derivada direccional)</strong></div>
          <p>Si <span class="math-text"><i>f</i></span> es una función <strong>diferenciable</strong> de dos variables <span class="math-text">(<i>x</i>, <i>y</i>)</span> y <span class="math-text"><b>u</b> = cos <i>θ</i> <b>i</b> + sen <i>θ</i> <b>j</b></span> es un vector unitario, entonces la derivada direccional existe en toda dirección y se calcula mediante:<br>
          <span class="math-text"><i>D</i><sub><b>u</b></sub><i>f</i>(<i>x</i>, <i>y</i>) = <i>f<sub>x</sub></i>(<i>x</i>, <i>y</i>) cos <i>θ</i> + <i>f<sub>y</sub></i>(<i>x</i>, <i>y</i>) sen <i>θ</i> = ∇<i>f</i>(<i>x</i>, <i>y</i>) · <b>u</b></span></p>
          <p>Para funciones de tres variables con <span class="math-text"><b>u</b> = (cos <i>α</i>, cos <i>β</i>, cos <i>γ</i>)</span> unitario:<br>
          <span class="math-text"><i>D</i><sub><b>u</b></sub><i>f</i>(<i>x</i>, <i>y</i>, <i>z</i>) = ∇<i>f</i>(<i>x</i>, <i>y</i>, <i>z</i>) · <b>u</b> = <i>f<sub>x</sub></i> cos <i>α</i> + <i>f<sub>y</sub></i> cos <i>β</i> + <i>f<sub>z</sub></i> cos <i>γ</i></span></p>
        </div>

        <p>• <strong>Deducción mediante la regla de la cadena:</strong><br>
        Consideremos la trayectoria rectilínea <span class="math-text"><b>r</b>(<i>h</i>) = (<i>x</i>₀ + <i>h u</i>₁, <i>y</i>₀ + <i>h u</i>₂)</span> parametrizada por la distancia <span class="math-text"><i>h</i></span>, con <span class="math-text"><b>r</b>(0) = (<i>x</i>₀, <i>y</i>₀)</span> y vector velocidad constante <span class="math-text"><b>r</b>′(<i>h</i>) = <b>u</b> = (<i>u</i>₁, <i>u</i>₂)</span>. La tasa de variación de la función a lo largo de esta recta es, por la regla de la cadena multivariable:<br>
        <span class="math-text"><i>D</i><sub><b>u</b></sub><i>f</i> = <span class="math-fraction"><span><i>d</i></span><span><i>dh</i></span></span>[<i>f</i>(<b>r</b>(<i>h</i>))]|<sub><i>h</i>=0</sub> = <span class="math-fraction"><span>∂<i>f</i></span><span>∂<i>x</i></span></span> <span class="math-fraction"><span><i>dx</i></span><span><i>dh</i></span></span> + <span class="math-fraction"><span>∂<i>f</i></span><span>∂<i>y</i></span></span> <span class="math-fraction"><span><i>dy</i></span><span><i>dh</i></span></span> = <i>f<sub>x</sub> u</i>₁ + <i>f<sub>y</sub> u</i>₂ = ∇<i>f</i> · <b>u</b></span>.<br>
        Esta elegante identidad conecta el análisis multivariable con el álgebra lineal elemental.</p>

        <p>• <strong>Hipótesis de aplicabilidad: Condición suficiente vs. condición necesaria</strong><br>
        Para aplicar con rigor matemático la fórmula <span class="math-text"><i>D</i><sub><b>u</b></sub><i>f</i> = ∇<i>f</i> · <b>u</b></span>, es indispensable tener presente la jerarquía de condiciones:<br>
        1. <strong>La diferenciabilidad en el punto es suficiente:</strong> Basta con que <span class="math-text"><i>f</i></span> sea <em>diferenciable en el punto</em> para asegurar que la derivada direccional exista y coincida con el producto escalar en toda dirección unitaria <span class="math-text"><b>u</b></span>.<br>
        2. <strong>Ser de clase <i>C</i>¹ en un entorno es suficiente, pero NO necesaria, para la diferenciabilidad:</strong> Una función es de clase <span class="math-text"><i>C</i>¹</span> cuando sus derivadas parciales son continuas en un entorno. Esta regularidad garantiza la diferenciabilidad (condición suficiente), pero <em>no es una condición necesaria</em>: existen funciones diferenciables en un punto cuyas derivadas parciales no son continuas en dicho punto. En consecuencia, la continuidad de las derivadas parciales (clase <span class="math-text"><i>C</i>¹</span>) <strong>no debe presentarse como condición necesaria</strong> para emplear la fórmula del gradiente.<br>
        3. <strong>Estudio mediante límites en casos no diferenciables:</strong> Si la función no es diferenciable en el punto, el producto escalar no es aplicable en general. Sin embargo, <strong>la definición formal mediante límites</strong> permite estudiar rigurosamente y calcular la derivada direccional en cualquier dirección para la cual dicho límite incremental exista.</p>

        <h3>Propiedades fundamentales: Máximo crecimiento, decrecimiento y magnitud</h3>
        <p>Aplicando la definición geométrica del producto escalar entre dos vectores, podemos expresar la derivada direccional en términos del ángulo <span class="math-text"><i>φ</i></span> formado entre el gradiente <span class="math-text">∇<i>f</i></span> y el vector unitario de dirección <span class="math-text"><b>u</b></span>:</p>

        <div class="lesson-definition">
          <p><span class="math-text"><i>D</i><sub><b>u</b></sub><i>f</i> = ∇<i>f</i> · <b>u</b> = ‖∇<i>f</i>‖ ‖<b>u</b>‖ cos <i>φ</i> = ‖∇<i>f</i>‖ cos <i>φ</i></span> &nbsp;&nbsp;(puesto que <span class="math-text">‖<b>u</b>‖ = 1</span>)</p>
        </div>

        <p>Dado que la función coseno varía estrictamente en el intervalo <span class="math-text">[−1, 1]</span>, se deducen directamente las tres propiedades cardinales del gradiente (Folleto, pág. 8):</p>

        <p><strong>1. Dirección y valor de máximo crecimiento (máxima razón de cambio):</strong><br>
        El valor de <span class="math-text">cos <i>φ</i></span> alcanza su máximo absoluto igual a <span class="math-text">1</span> cuando <span class="math-text"><i>φ</i> = 0</span>. Esto ocurre cuando el vector unitario <span class="math-text"><b>u</b></span> apunta en la <strong>misma dirección y sentido del gradiente ∇<i>f</i></strong>:<br>
        <span class="math-text"><b>u</b><sub>máx</sub> = <span class="math-fraction"><span>∇<i>f</i></span><span>‖∇<i>f</i>‖</span></span></span>.<br>
        El valor máximo de la derivada direccional es exactamente la <strong>magnitud del gradiente</strong>:<br>
        <span class="math-text">máx <i>D</i><sub><b>u</b></sub><i>f</i> = ‖∇<i>f</i>‖</span>.<br>
        <em>Conclusión física:</em> El vector gradiente <span class="math-text">∇<i>f</i></span> señala la dirección hacia donde la función experimenta el incremento más rápido por unidad de distancia (la trayectoria de máxima pendiente ascendente).</p>

        <p><strong>2. Dirección y valor de máximo decrecimiento (mínima razón de cambio):</strong><br>
        El valor de <span class="math-text">cos <i>φ</i></span> alcanza su mínimo de <span class="math-text">−1</span> cuando <span class="math-text"><i>φ</i> = <i>π</i></span> (180°). Ocurre cuando <span class="math-text"><b>u</b></span> apunta en la <strong>dirección opuesta al gradiente</strong>:<br>
        <span class="math-text"><b>u</b><sub>mín</sub> = −<span class="math-fraction"><span>∇<i>f</i></span><span>‖∇<i>f</i>‖</span></span></span>.<br>
        El valor mínimo de la derivada direccional es el opuesto de su norma:<br>
        <span class="math-text">mín <i>D</i><sub><b>u</b></sub><i>f</i> = −‖∇<i>f</i>‖</span>.<br>
        Esta propiedad es la base de los métodos de optimización por descenso del gradiente (<em>gradient descent</em>) en aprendizaje automático e ingeniería.</p>

        <p><strong>3. Direcciones de cambio nulo:</strong><br>
        Si <span class="math-text"><i>φ</i> = <span class="math-fraction"><span><i>π</i></span><span>2</span></span></span> (90°), entonces <span class="math-text">cos <i>φ</i> = 0 ⇒ <i>D</i><sub><b>u</b></sub><i>f</i> = 0</span>. Al desplazarse en una dirección perpendicular al gradiente, la función permanece localmente estacionaria.</p>

        <h3>Ortogonalidad del gradiente a las curvas y superficies de nivel</h3>
        <p>Una de las propiedades geométricas más notables del vector gradiente es su relación con las curvas y superficies de nivel (<strong>Teorema 3 del folleto, pág. 9</strong>):</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Teorema 3: Ortogonalidad a conjuntos de nivel</strong></div>
          <p>Sea <span class="math-text"><i>f</i></span> una función diferenciable y sea <span class="math-text"><i>C</i></span> una curva de nivel descrita por la ecuación cartesiana <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = <i>k</i></span>. Si <span class="math-text"><i>P</i>₀(<i>x</i>₀, <i>y</i>₀)</span> es un punto regular de <span class="math-text"><i>C</i></span> donde <span class="math-text">∇<i>f</i>(<i>P</i>₀) ≠ <b>0</b></span>, entonces:<br>
          1. El vector gradiente <span class="math-text">∇<i>f</i>(<i>P</i>₀)</span> es <strong>estrictamente perpendicular (normal)</strong> a la recta tangente a la curva de nivel en <span class="math-text"><i>P</i>₀</span>.<br>
          2. La derivada direccional de <span class="math-text"><i>f</i></span> es idénticamente cero en la dirección tangente a la curva de nivel: <span class="math-text"><i>D</i><sub><b>T</b></sub><i>f</i> = 0</span>.<br>
          3. En tres variables, si <span class="math-text"><i>S</i></span> es la superficie de nivel <span class="math-text"><i>F</i>(<i>x</i>, <i>y</i>, <i>z</i>) = <i>k</i></span>, el vector <span class="math-text">∇<i>F</i>(<i>P</i>₀)</span> es perpendicular al plano tangente a la superficie en <span class="math-text"><i>P</i>₀</span>.</p>
        </div>

        <p>• <strong>Demostración:</strong><br>
        Sea <span class="math-text"><b>r</b>(<i>t</i>) = (<i>x</i>(<i>t</i>), <i>y</i>(<i>t</i>))</span> una parametrización de la curva de nivel <span class="math-text"><i>C</i></span> con <span class="math-text"><b>r</b>(0) = <i>P</i>₀</span> y vector tangente no nulo <span class="math-text"><b>r</b>′(0) = <b>T</b></span>. Como cada punto de la trayectoria permanece sobre la curva de nivel, el valor de la función es invariante:<br>
        <span class="math-text"><i>f</i>(<i>x</i>(<i>t</i>), <i>y</i>(<i>t</i>)) = <i>k</i></span> para todo <span class="math-text"><i>t</i></span>.<br>
        Derivando ambos miembros respecto a <span class="math-text"><i>t</i></span> mediante la regla de la cadena en <span class="math-text"><i>t</i> = 0</span>:<br>
        <span class="math-text"><span class="math-fraction"><span><i>d</i></span><span><i>dt</i></span></span>[<i>f</i>(<b>r</b>(<i>t</i>))]|<sub><i>t</i>=0</sub> = ∇<i>f</i>(<i>P</i>₀) · <b>r</b>′(0) = <span class="math-fraction"><span><i>d</i></span><span><i>dt</i></span></span>(<i>k</i>) = 0</span>.<br>
        Al ser su producto escalar nulo, queda demostrado con rigor algebraico que el vector gradiente es perpendicular al vector tangente a la curva de nivel en todo punto regular.</p>

        <h3>Distinciones analíticas indispensables para evitar conclusiones erróneas</h3>
        <p>Para garantizar una comprensión matemática sólida, el folleto del profesor resalta tres distinciones conceptuales fundamentales:</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Precisiones analíticas rigurosas</strong></div>
          <p><strong>1. Gradiente nulo (Puntos estacionarios):</strong><br>
          Si <span class="math-text">∇<i>f</i>(<i>P</i>₀) = <b>0</b></span>, entonces <span class="math-text"><i>D</i><sub><b>u</b></sub><i>f</i>(<i>P</i>₀) = <b>0</b> · <b>u</b> = 0</span> para <em>toda</em> dirección <span class="math-text"><b>u</b></span>. En un punto donde el gradiente se anula no existe una dirección preferente de máximo crecimiento lineal de primer orden; el análisis de la superficie requiere el estudio de derivadas de segundo orden (la matriz Hessiana).</p>
          <p><strong>2. Obligatoriedad de normalizar el vector de dirección:</strong><br>
          La derivada direccional <span class="math-text"><i>D</i><sub><b>u</b></sub><i>f</i></span> está definida estrictamente respecto a un <strong>vector unitario</strong> (<span class="math-text">‖<b>u</b>‖ = 1</span>) para medir la razón de cambio por unidad de distancia métrica euclidiana.<br>
          Si se plantea la variación a lo largo de un vector director arbitrario no unitario <span class="math-text"><b>v</b></span> (por ejemplo, el vector de posición entre dos puntos <span class="math-text"><b>v</b> = <span class="math-overline"><i>PQ</i></span></span>), el producto punto <span class="math-text">∇<i>f</i> · <b>v</b></span> no es la derivada direccional sino que queda escalado por <span class="math-text">‖<b>v</b>‖</span>. Es imprescindible calcular primero el vector unitario:<br>
          <span class="math-text"><b>u</b> = <span class="math-fraction"><span><b>v</b></span><span>‖<b>v</b>‖</span></span>, &nbsp;&nbsp; <i>D</i><sub><b>u</b></sub><i>f</i> = ∇<i>f</i> · <span class="math-fraction"><span><b>v</b></span><span>‖<b>v</b>‖</span></span></span>.</p>
          <p><strong>3. Hipótesis de validez del producto punto y alcance de la definición por límites:</strong><br>
          • <em>La diferenciabilidad en el punto es condición suficiente:</em> Para aplicar la fórmula <span class="math-text"><i>D</i><sub><b>u</b></sub><i>f</i> = ∇<i>f</i> · <b>u</b></span>, la diferenciabilidad de <span class="math-text"><i>f</i></span> en el punto analizado es una condición <strong>suficiente</strong> que garantiza la existencia y el cálculo de la derivada direccional para todo vector unitario <span class="math-text"><b>u</b></span>.<br>
          • <em>Ser de clase C¹ es suficiente, pero NO necesario:</em> Que la función sea de clase <span class="math-text"><i>C</i>¹</span> en un entorno (es decir, que sus derivadas parciales existan y sean continuas) constituye una condición suficiente para la diferenciabilidad, pero <strong>no es una condición necesaria</strong> (una función puede ser diferenciable puntualmente aun con parciales discontinuas). Jamás debe asumirse la continuidad de las derivadas parciales (clase <span class="math-text"><i>C</i>¹</span>) como requisito indispensable o necesario para aplicar <span class="math-text"><i>D</i><sub><b>u</b></sub><i>f</i> = ∇<i>f</i> · <b>u</b></span>.<br>
          • <em>Funciones no diferenciables y estudio por límites:</em> Si una función no es diferenciable en un punto (por ejemplo, en el vértice de un cono o en funciones a trozos singulares), las derivadas parciales axiales <span class="math-text"><i>f<sub>x</sub></i></span> y <span class="math-text"><i>f<sub>y</sub></i></span> pueden existir y permitir escribir formalmente una expresión numérica, pero la fórmula lineal <span class="math-text">∇<i>f</i> · <b>u</b></span> fallará en direcciones oblicuas. No obstante, la no diferenciabilidad no implica que no existan derivadas direccionales: <strong>la definición formal de derivada direccional mediante límites</strong>:<br>
          <span class="math-text"><i>D</i><sub><b>u</b></sub><i>f</i>(<i>P</i>₀) = <span class="math-limit"><span>lim</span><sub><i>h</i>→0</sub></span><span class="math-fraction"><span><i>f</i>(<i>P</i>₀ + <i>h</i><b>u</b>) − <i>f</i>(<i>P</i>₀)</span><span><i>h</i></span></span></span><br>
          es la herramienta matemáticamente válida para estudiar y calcular la razón de cambio direccional en casos no diferenciables, siempre que el límite incremental exista en la dirección <span class="math-text"><b>u</b></span> considerada.</p>
        </div>

        <h3>Ejemplos resueltos del folleto (paso a paso)</h3>

        <p><strong>Ejemplo 1: Derivada direccional por definición y por fórmula (Ejemplo 5 de Semana 05, pág. 9)</strong><br>
        Dada la función <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = 6<i>x</i>² − 2<i>xy</i></span> y el vector unitario en la dirección de <span class="math-text"><i>θ</i> = <span class="math-fraction"><span><i>π</i></span><span>3</span></span></span>:<br>
        a) Encontrar <span class="math-text"><i>D</i><sub><b>u</b></sub><i>f</i></span> aplicando la definición formal por límites.<br>
        b) Encontrar <span class="math-text"><i>D</i><sub><b>u</b></sub><i>f</i></span> usando la fórmula del gradiente.<br>
        c) Evaluar <span class="math-text"><i>D</i><sub><b>u</b></sub><i>f</i></span> en el punto <span class="math-text">(0, −2)</span>.<br>
        • <em>Solución explicada paso a paso:</em><br>
        Para <span class="math-text"><i>θ</i> = <span class="math-fraction"><span><i>π</i></span><span>3</span></span></span> (60°), los componentes del vector unitario son:<br>
        <span class="math-text">cos <span class="math-fraction"><span><i>π</i></span><span>3</span></span> = <span class="math-fraction"><span>1</span><span>2</span></span> &nbsp;&nbsp;y&nbsp;&nbsp; sen <span class="math-fraction"><span><i>π</i></span><span>3</span></span> = <span class="math-fraction"><span>√<span class="math-radical">3</span></span><span>2</span></span> ⇒ <b>u</b> = (<span class="math-fraction"><span>1</span><span>2</span></span>, <span class="math-fraction"><span>√<span class="math-radical">3</span></span><span>2</span></span>)</span>.<br>
        <strong>a) Por definición de límite:</strong><br>
        Evaluamos <span class="math-text"><i>f</i>(<i>x</i> + <span class="math-fraction"><span><i>h</i></span><span>2</span></span>, <i>y</i> + <span class="math-fraction"><span>√<span class="math-radical">3</span><i>h</i></span><span>2</span></span>)</span>:<br>
        <span class="math-text"><i>f</i>(<i>x</i> + <span class="math-fraction"><span><i>h</i></span><span>2</span></span>, <i>y</i> + <span class="math-fraction"><span>√<span class="math-radical">3</span><i>h</i></span><span>2</span></span>) = 6(<i>x</i> + <span class="math-fraction"><span><i>h</i></span><span>2</span></span>)² − 2(<i>x</i> + <span class="math-fraction"><span><i>h</i></span><span>2</span></span>)(<i>y</i> + <span class="math-fraction"><span>√<span class="math-radical">3</span><i>h</i></span><span>2</span></span>)</span><br>
        <span class="math-text">= 6(<i>x</i>² + <i>xh</i> + <span class="math-fraction"><span><i>h</i>²</span><span>4</span></span>) − 2(<i>xy</i> + <span class="math-fraction"><span>√<span class="math-radical">3</span><i>xh</i></span><span>2</span></span> + <span class="math-fraction"><span><i>yh</i></span><span>2</span></span> + <span class="math-fraction"><span>√<span class="math-radical">3</span><i>h</i>²</span><span>4</span></span>)</span><br>
        <span class="math-text">= 6<i>x</i>² + 6<i>xh</i> + <span class="math-fraction"><span>3<i>h</i>²</span><span>2</span></span> − 2<i>xy</i> − √<span class="math-radical">3</span><i>xh</i> − <i>yh</i> − <span class="math-fraction"><span>√<span class="math-radical">3</span><i>h</i>²</span><span>2</span></span></span>.<br>
        Restando <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = 6<i>x</i>² − 2<i>xy</i></span>:<br>
        <span class="math-text"><i>f</i>(<i>x</i> + <span class="math-fraction"><span><i>h</i></span><span>2</span></span>, <i>y</i> + <span class="math-fraction"><span>√<span class="math-radical">3</span><i>h</i></span><span>2</span></span>) − <i>f</i>(<i>x</i>, <i>y</i>) = 6<i>xh</i> − √<span class="math-radical">3</span><i>xh</i> − <i>yh</i> + <span class="math-fraction"><span>3<i>h</i>²</span><span>2</span></span> − <span class="math-fraction"><span>√<span class="math-radical">3</span><i>h</i>²</span><span>2</span></span></span>.<br>
        Dividiendo entre <span class="math-text"><i>h</i></span> y tomando el límite cuando <span class="math-text"><i>h</i> → 0</span>:<br>
        <span class="math-text"><i>D</i><sub><b>u</b></sub><i>f</i> = <span class="math-limit"><span>lim</span><sub><i>h</i>→0</sub></span> [6<i>x</i> − √<span class="math-radical">3</span><i>x</i> − <i>y</i> + <span class="math-fraction"><span>3<i>h</i></span><span>2</span></span> − <span class="math-fraction"><span>√<span class="math-radical">3</span><i>h</i></span><span>2</span></span>] = 6<i>x</i> − √<span class="math-radical">3</span><i>x</i> − <i>y</i> = (6 − √<span class="math-radical">3</span>)<i>x</i> − <i>y</i></span>.<br>
        <strong>b) Usando la fórmula del gradiente:</strong><br>
        Derivadas parciales:<br>
        <span class="math-text"><i>f<sub>x</sub></i> = <span class="math-fraction"><span>∂</span><span>∂<i>x</i></span></span>(6<i>x</i>² − 2<i>xy</i>) = 12<i>x</i> − 2<i>y</i></span>.<br>
        <span class="math-text"><i>f<sub>y</sub></i> = <span class="math-fraction"><span>∂</span><span>∂<i>y</i></span></span>(6<i>x</i>² − 2<i>xy</i>) = −2<i>x</i></span>.<br>
        Vector gradiente: <span class="math-text">∇<i>f</i> = (12<i>x</i> − 2<i>y</i>)<b>i</b> + (−2<i>x</i>)<b>j</b></span>.<br>
        Producto punto con <span class="math-text"><b>u</b> = <span class="math-fraction"><span>1</span><span>2</span></span><b>i</b> + <span class="math-fraction"><span>√<span class="math-radical">3</span></span><span>2</span></span><b>j</b></span>:<br>
        <span class="math-text"><i>D</i><sub><b>u</b></sub><i>f</i> = ∇<i>f</i> · <b>u</b> = (12<i>x</i> − 2<i>y</i>)(<span class="math-fraction"><span>1</span><span>2</span></span>) + (−2<i>x</i>)(<span class="math-fraction"><span>√<span class="math-radical">3</span></span><span>2</span></span>) = 6<i>x</i> − <i>y</i> − √<span class="math-radical">3</span><i>x</i> = (6 − √<span class="math-radical">3</span>)<i>x</i> − <i>y</i></span>.<br>
        Ambos métodos producen exactamente el mismo resultado analítico.<br>
        <strong>c) Evaluación en el punto <i>P</i>(0, −2):</strong><br>
        <span class="math-text"><i>D</i><sub><b>u</b></sub><i>f</i>(0, −2) = (6 − √<span class="math-radical">3</span>)(0) − (−2) = 0 + 2 = 2</span>.</p>

        <p><strong>Ejemplo 2: Dirección y valor de máxima razón de cambio en ℝ³ (Ejemplo 6 de Semana 05, págs. 9-10)</strong><br>
        Si <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>, <i>z</i>) = <span class="math-fraction"><span><i>x</i> + ln <i>y</i></span><span><i>z</i></span></span></span> y <span class="math-text"><i>P</i>(2, 1, 4)</span>, encontrar el vector unitario en cuya dirección la función tiene la mayor razón de cambio en <span class="math-text"><i>P</i></span> y el valor de dicha razón máxima.<br>
        • <em>Solución explicada:</em><br>
        1) <strong>Cálculo de derivadas parciales en <i>P</i>(2, 1, 4):</strong><br>
        <span class="math-text"><i>f<sub>x</sub></i> = <span class="math-fraction"><span>1</span><span><i>z</i></span></span> ⇒ <i>f<sub>x</sub></i>(2, 1, 4) = <span class="math-fraction"><span>1</span><span>4</span></span></span>.<br>
        <span class="math-text"><i>f<sub>y</sub></i> = <span class="math-fraction"><span>1</span><span><i>yz</i></span></span> ⇒ <i>f<sub>y</sub></i>(2, 1, 4) = <span class="math-fraction"><span>1</span><span>(1)(4)</span></span> = <span class="math-fraction"><span>1</span><span>4</span></span></span>.<br>
        <span class="math-text"><i>f<sub>z</sub></i> = −<span class="math-fraction"><span><i>x</i> + ln <i>y</i></span><span><i>z</i>²</span></span> ⇒ <i>f<sub>z</sub></i>(2, 1, 4) = −<span class="math-fraction"><span>2 + ln 1</span><span>4²</span></span> = −<span class="math-fraction"><span>2 + 0</span><span>16</span></span> = −<span class="math-fraction"><span>1</span><span>8</span></span></span>.<br>
        2) <strong>Vector gradiente en <i>P</i>:</strong><br>
        <span class="math-text">∇<i>f</i>(<i>P</i>) = <span class="math-fraction"><span>1</span><span>4</span></span><b>i</b> + <span class="math-fraction"><span>1</span><span>4</span></span><b>j</b> − <span class="math-fraction"><span>1</span><span>8</span></span><b>k</b> = <span class="math-fraction"><span>1</span><span>8</span></span>(2<b>i</b> + 2<b>j</b> − <b>k</b>)</span>.<br>
        3) <strong>Módulo del gradiente (Razón máxima de cambio):</strong><br>
        <span class="math-text">‖∇<i>f</i>(<i>P</i>)‖ = √<span class="math-radical">(<span class="math-fraction"><span>1</span><span>4</span></span>)² + (<span class="math-fraction"><span>1</span><span>4</span></span>)² + (−<span class="math-fraction"><span>1</span><span>8</span></span>)²</span> = √<span class="math-radical"><span class="math-fraction"><span>1</span><span>16</span></span> + <span class="math-fraction"><span>1</span><span>16</span></span> + <span class="math-fraction"><span>1</span><span>64</span></span></span> = √<span class="math-radical"><span class="math-fraction"><span>4 + 4 + 1</span><span>64</span></span></span> = √<span class="math-radical"><span class="math-fraction"><span>9</span><span>64</span></span></span> = <span class="math-fraction"><span>3</span><span>8</span></span></span>.<br>
        4) <strong>Vector unitario en la dirección de máxima razón de cambio:</strong><br>
        <span class="math-text"><b>u</b> = <span class="math-fraction"><span>∇<i>f</i>(<i>P</i>)</span><span>‖∇<i>f</i>(<i>P</i>)‖</span></span> = <span class="math-fraction"><span><span class="math-fraction"><span>1</span><span>8</span></span>(2<b>i</b> + 2<b>j</b> − <b>k</b>)</span><span><span class="math-fraction"><span>3</span><span>8</span></span></span></span> = <span class="math-fraction"><span>8</span><span>3</span></span> · <span class="math-fraction"><span>1</span><span>8</span></span>(2<b>i</b> + 2<b>j</b> − <b>k</b>) = <span class="math-fraction"><span>2</span><span>3</span></span><b>i</b> + <span class="math-fraction"><span>2</span><span>3</span></span><b>j</b> − <span class="math-fraction"><span>1</span><span>3</span></span><b>k</b> = (<span class="math-fraction"><span>2</span><span>3</span></span>, <span class="math-fraction"><span>2</span><span>3</span></span>, −<span class="math-fraction"><span>1</span><span>3</span></span>)</span>.</p>

        <p><strong>Ejemplo 3: Derivada direccional entre dos puntos espaciales (Ejemplo 7 de Semana 05, pág. 10)</strong><br>
        Si <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>, <i>z</i>) = <i>xy</i>² + <i>yz</i> + <i>x</i>³<i>z</i>²</span>, hallar la derivada direccional en el punto <span class="math-text"><i>P</i>(1, 2, −1)</span> en la dirección del vector <span class="math-text"><span class="math-overline"><i>PQ</i></span></span> si <span class="math-text"><i>Q</i>(3, 1, 1)</span>.<br>
        • <em>Solución explicada:</em><br>
        1) <strong>Determinación y normalización del vector director:</strong><br>
        <span class="math-text"><b>v</b> = <span class="math-overline"><i>PQ</i></span> = <i>Q</i> − <i>P</i> = (3 − 1, 1 − 2, 1 − (−1)) = (2, −1, 2)</span>.<br>
        Calculamos su norma para obtener el vector unitario <span class="math-text"><b>u</b></span>:<br>
        <span class="math-text">‖<b>v</b>‖ = √<span class="math-radical">2² + (−1)² + 2²</span> = √<span class="math-radical">4 + 1 + 4</span> = √<span class="math-radical">9</span> = 3</span>.<br>
        <span class="math-text"><b>u</b> = <span class="math-fraction"><span><b>v</b></span><span>‖<b>v</b>‖</span></span> = <span class="math-fraction"><span>1</span><span>3</span></span>(2, −1, 2) = (<span class="math-fraction"><span>2</span><span>3</span></span>, −<span class="math-fraction"><span>1</span><span>3</span></span>, <span class="math-fraction"><span>2</span><span>3</span></span>)</span>.<br>
        2) <strong>Cálculo del gradiente en <i>P</i>(1, 2, −1):</strong><br>
        <span class="math-text"><i>f<sub>x</sub></i> = <i>y</i>² + 3<i>x</i>²<i>z</i>² ⇒ <i>f<sub>x</sub></i>(<i>P</i>) = 2² + 3(1)²(−1)² = 4 + 3 = 7</span>.<br>
        <span class="math-text"><i>f<sub>y</sub></i> = 2<i>xy</i> + <i>z</i> ⇒ <i>f<sub>y</sub></i>(<i>P</i>) = 2(1)(2) + (−1) = 4 − 1 = 3</span>.<br>
        <span class="math-text"><i>f<sub>z</sub></i> = <i>y</i> + 2<i>x</i>³<i>z</i> ⇒ <i>f<sub>z</sub></i>(<i>P</i>) = 2 + 2(1)³(−1) = 2 − 2 = 0</span>.<br>
        Vector gradiente: <span class="math-text">∇<i>f</i>(<i>P</i>) = (7, 3, 0)</span>.<br>
        3) <strong>Cálculo de la derivada direccional:</strong><br>
        <span class="math-text"><i>D</i><sub><b>u</b></sub><i>f</i>(<i>P</i>) = ∇<i>f</i>(<i>P</i>) · <b>u</b> = (7, 3, 0) · <span class="math-fraction"><span>1</span><span>3</span></span>(2, −1, 2) = <span class="math-fraction"><span>7(2) + 3(−1) + 0(2)</span><span>3</span></span> = <span class="math-fraction"><span>14 − 3 + 0</span><span>3</span></span> = <span class="math-fraction"><span>11</span><span>3</span></span></span>.</p>

        <h3>Ejercicios de práctica propuestos del folleto (con soluciones detalladas)</h3>

        <p><strong>Ejercicio 1: Cálculo del vector gradiente en un punto (Propuesto 2.ii de Semana 05, pág. 13)</strong><br>
        Hallar el vector gradiente del campo escalar <span class="math-text"><i>z</i> = √<span class="math-radical"><i>x</i>² − <i>y</i>²</span></span> en el punto <span class="math-text"><i>P</i>(5, 3)</span>.<br>
        • <em>Solución explicada:</em><br>
        1) Comprobamos la existencia real: <span class="math-text">5² − 3² = 25 − 9 = 16 &gt; 0</span>.<br>
        2) Derivadas parciales por regla de la cadena:<br>
        <span class="math-text"><i>z<sub>x</sub></i> = <span class="math-fraction"><span>2<i>x</i></span><span>2√<span class="math-radical"><i>x</i>² − <i>y</i>²</span></span></span> = <span class="math-fraction"><span><i>x</i></span><span>√<span class="math-radical"><i>x</i>² − <i>y</i>²</span></span></span> ⇒ <i>z<sub>x</sub></i>(5, 3) = <span class="math-fraction"><span>5</span><span>√<span class="math-radical">16</span></span></span> = <span class="math-fraction"><span>5</span><span>4</span></span></span>.<br>
        <span class="math-text"><i>z<sub>y</sub></i> = <span class="math-fraction"><span>−2<i>y</i></span><span>2√<span class="math-radical"><i>x</i>² − <i>y</i>²</span></span></span> = <span class="math-fraction"><span>−<i>y</i></span><span>√<span class="math-radical"><i>x</i>² − <i>y</i>²</span></span></span> ⇒ <i>z<sub>y</sub></i>(5, 3) = <span class="math-fraction"><span>−3</span><span>√<span class="math-radical">16</span></span></span> = −<span class="math-fraction"><span>3</span><span>4</span></span></span>.<br>
        3) Por tanto, el vector gradiente es:<br>
        <span class="math-text">∇<i>z</i>(5, 3) = (<span class="math-fraction"><span>5</span><span>4</span></span>, −<span class="math-fraction"><span>3</span><span>4</span></span>)</span>.</p>

        <p><strong>Ejercicio 2: Derivada direccional con ángulo trigonométrico (Propuesto 4.i de Semana 05, pág. 13)</strong><br>
        Encuentre la derivada direccional de <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = 5<i>x</i>³<i>y</i>⁶</span> en el punto <span class="math-text"><i>P</i>(1, 1)</span> en la dirección indicada por <span class="math-text"><i>θ</i> = <span class="math-fraction"><span><i>π</i></span><span>6</span></span></span>.<br>
        • <em>Solución explicada:</em><br>
        1) Vector unitario director:<br>
        <span class="math-text"><b>u</b> = (cos <span class="math-fraction"><span><i>π</i></span><span>6</span></span>, sen <span class="math-fraction"><span><i>π</i></span><span>6</span></span>) = (<span class="math-fraction"><span>√<span class="math-radical">3</span></span><span>2</span></span>, <span class="math-fraction"><span>1</span><span>2</span></span>)</span>.<br>
        2) Gradiente en <span class="math-text"><i>P</i>(1, 1)</span>:<br>
        <span class="math-text"><i>f<sub>x</sub></i> = 15<i>x</i>²<i>y</i>⁶ ⇒ <i>f<sub>x</sub></i>(1, 1) = 15(1)²(1)⁶ = 15</span>.<br>
        <span class="math-text"><i>f<sub>y</sub></i> = 30<i>x</i>³<i>y</i>⁵ ⇒ <i>f<sub>y</sub></i>(1, 1) = 30(1)³(1)⁵ = 30</span>.<br>
        <span class="math-text">∇<i>f</i>(1, 1) = (15, 30)</span>.<br>
        3) Derivada direccional:<br>
        <span class="math-text"><i>D</i><sub><b>u</b></sub><i>f</i>(1, 1) = ∇<i>f</i> · <b>u</b> = 15(<span class="math-fraction"><span>√<span class="math-radical">3</span></span><span>2</span></span>) + 30(<span class="math-fraction"><span>1</span><span>2</span></span>) = <span class="math-fraction"><span>15√<span class="math-radical">3</span></span><span>2</span></span> + 15 = <span class="math-fraction"><span>15(√<span class="math-radical">3</span> + 2)</span><span>2</span></span></span>.</p>

        <p><strong>Ejercicio 3: Vector unitario y tasa máxima de cambio (Propuesto 6.i de Semana 05, pág. 14)</strong><br>
        Para la función <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = <i>e</i><sup>2<i>x</i></sup> sen <i>y</i></span> en el punto <span class="math-text"><i>P</i>(0, <span class="math-fraction"><span><i>π</i></span><span>4</span></span>)</span>, encuentre un vector unitario que indique la dirección en la cual la función aumenta más rápidamente y halle el valor de dicha razón máxima.<br>
        • <em>Solución explicada:</em><br>
        1) Derivadas parciales en <span class="math-text"><i>P</i>(0, <span class="math-fraction"><span><i>π</i></span><span>4</span></span>)</span>:<br>
        <span class="math-text"><i>f<sub>x</sub></i> = 2<i>e</i><sup>2<i>x</i></sup> sen <i>y</i> ⇒ <i>f<sub>x</sub></i>(0, <span class="math-fraction"><span><i>π</i></span><span>4</span></span>) = 2<i>e</i>⁰ sen <span class="math-fraction"><span><i>π</i></span><span>4</span></span> = 2(1)(<span class="math-fraction"><span>√<span class="math-radical">2</span></span><span>2</span></span>) = √<span class="math-radical">2</span></span>.<br>
        <span class="math-text"><i>f<sub>y</sub></i> = <i>e</i><sup>2<i>x</i></sup> cos <i>y</i> ⇒ <i>f<sub>y</sub></i>(0, <span class="math-fraction"><span><i>π</i></span><span>4</span></span>) = <i>e</i>⁰ cos <span class="math-fraction"><span><i>π</i></span><span>4</span></span> = (1)(<span class="math-fraction"><span>√<span class="math-radical">2</span></span><span>2</span></span>) = <span class="math-fraction"><span>√<span class="math-radical">2</span></span><span>2</span></span></span>.<br>
        Vector gradiente: <span class="math-text">∇<i>f</i> = √<span class="math-radical">2</span> <b>i</b> + <span class="math-fraction"><span>√<span class="math-radical">2</span></span><span>2</span></span> <b>j</b> = <span class="math-fraction"><span>√<span class="math-radical">2</span></span><span>2</span></span> (2<b>i</b> + <b>j</b>)</span>.<br>
        2) Módulo del gradiente (máxima razón de cambio):<br>
        <span class="math-text">‖∇<i>f</i>‖ = √<span class="math-radical">(√<span class="math-radical">2</span>)² + (<span class="math-fraction"><span>√<span class="math-radical">2</span></span><span>2</span></span>)²</span> = √<span class="math-radical">2 + <span class="math-fraction"><span>2</span><span>4</span></span></span> = √<span class="math-radical"><span class="math-fraction"><span>10</span><span>4</span></span></span> = √<span class="math-radical"><span class="math-fraction"><span>5</span><span>2</span></span></span> = <span class="math-fraction"><span>√<span class="math-radical">10</span></span><span>2</span></span></span>.<br>
        3) Vector unitario de máximo aumento:<br>
        <span class="math-text"><b>u</b> = <span class="math-fraction"><span>∇<i>f</i></span><span>‖∇<i>f</i>‖</span></span> = <span class="math-fraction"><span><span class="math-fraction"><span>√<span class="math-radical">2</span></span><span>2</span></span>(2<b>i</b> + <b>j</b>)</span><span><span class="math-fraction"><span>√<span class="math-radical">10</span></span><span>2</span></span></span></span> = <span class="math-fraction"><span>√<span class="math-radical">2</span></span><span>√<span class="math-radical">10</span></span></span>(2<b>i</b> + <b>j</b>) = <span class="math-fraction"><span>1</span><span>√<span class="math-radical">5</span></span></span>(2<b>i</b> + <b>j</b>) = (<span class="math-fraction"><span>2</span><span>√<span class="math-radical">5</span></span></span>, <span class="math-fraction"><span>1</span><span>√<span class="math-radical">5</span></span></span>)</span>.</p>

        <p><strong>Ejercicio 4: Comprobación de ortogonalidad del gradiente a una curva de nivel</strong><br>
        Dada la familia de curvas de nivel elípticas <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = 2<i>x</i>² + 3<i>y</i>² = 11</span>, verifique analíticamente en el punto <span class="math-text"><i>P</i>(2, 1)</span> que el vector gradiente es ortogonal a la recta tangente a la curva.<br>
        • <em>Solución explicada:</em><br>
        1) Comprobamos el punto: <span class="math-text">2(2)² + 3(1)² = 2(4) + 3(1) = 8 + 3 = 11</span>.<br>
        2) Calculamos el gradiente en <span class="math-text"><i>P</i>(2, 1)</span>:<br>
        <span class="math-text">∇<i>f</i> = (4<i>x</i>, 6<i>y</i>) ⇒ ∇<i>f</i>(2, 1) = (4(2), 6(1)) = (8, 6)</span>.<br>
        3) Obtenemos la pendiente de la recta tangente derivando implícitamente respecto a <span class="math-text"><i>x</i></span>:<br>
        <span class="math-text">4<i>x</i> + 6<i>y</i> <span class="math-fraction"><span><i>dy</i></span><span><i>dx</i></span></span> = 0 ⇒ <span class="math-fraction"><span><i>dy</i></span><span><i>dx</i></span></span> = −<span class="math-fraction"><span>4<i>x</i></span><span>6<i>y</i></span></span> = −<span class="math-fraction"><span>2<i>x</i></span><span>3<i>y</i></span></span></span>.<br>
        Evaluando en <span class="math-text">(2, 1)</span>:<br>
        <span class="math-text"><i>m</i><sub>tan</sub> = <span class="math-fraction"><span><i>dy</i></span><span><i>dx</i></span></span>|<sub>(2,1)</sub> = −<span class="math-fraction"><span>2(2)</span><span>3(1)</span></span> = −<span class="math-fraction"><span>4</span><span>3</span></span></span>.<br>
        Un vector director tangente a la curva es <span class="math-text"><b>T</b> = (3, −4)</span> (pues <span class="math-text"><span class="math-fraction"><span>−4</span><span>3</span></span> = <i>m</i><sub>tan</sub></span>).<br>
        4) Calculamos el producto escalar entre el gradiente y el vector tangente:<br>
        <span class="math-text">∇<i>f</i>(2, 1) · <b>T</b> = (8, 6) · (3, −4) = 8(3) + 6(−4) = 24 − 24 = 0</span>.<br>
        Al ser su producto escalar nulo, queda verificado que el gradiente es perpendicular a la curva de nivel.</p>`
    },
    {
      title: 'Optimización',
      content: `<p class="lesson-lead">La optimización de funciones de varias variables constituye una de las aplicaciones más fecundas y trascendentales del cálculo diferencial en la ciencia, la ingeniería y la economía. Su objetivo es determinar los puntos donde una magnitud cuantitativa alcanza sus valores máximos o mínimos, ya sea de forma libre o sujeta a restricciones geométricas o físicas. A través de la condición necesaria del gradiente nulo, el discriminante Hessiano, el criterio de Sylvester para matrices de orden superior y el método de los multiplicadores de Lagrange, se desarrolla un marco analítico riguroso para distinguir candidatos teóricos de extremos efectivamente demostrados.</p>

        <h2>Extremos de funciones de varias variables y optimización</h2>

        <h3>Extremos relativos y absolutos en varias variables</h3>
        <p>Al estudiar superficies <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span> en el espacio euclidiano, es indispensable distinguir con precisión entre los valores extremos locales (relativos al entorno inmediato de un punto) y los valores extremos globales (absolutos en todo el dominio o en una región dada), según lo establece el folleto <em>Semana 05.pdf</em> (pág. 16) del profesor David Chávez:</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Definición: Extremos relativos (locales)</strong></div>
          <p>Sea <span class="math-text"><i>f</i></span> una función de dos variables definida en un conjunto <span class="math-text"><i>D</i> ⊆ ℝ²</span> y sea <span class="math-text"><i>P</i>₀(<i>x</i>₀, <i>y</i>₀) ∈ <i>D</i></span>:<br>
          1. <strong>Máximo relativo:</strong> Se dice que <span class="math-text"><i>f</i></span> tiene un <em>máximo relativo</em> en <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span> si y sólo si existe un entorno circular abierto <span class="math-text"><i>B</i>((<i>x</i>₀, <i>y</i>₀); <i>r</i>)</span> tal que:<br>
          <span class="math-text"><i>f</i>(<i>x</i>₀, <i>y</i>₀) ≥ <i>f</i>(<i>x</i>, <i>y</i>)</span> &nbsp;para todo <span class="math-text">(<i>x</i>, <i>y</i>) ∈ <i>B</i>((<i>x</i>₀, <i>y</i>₀); <i>r</i>) ∩ <i>D</i></span>.<br>
          2. <strong>Mínimo relativo:</strong> Se dice que <span class="math-text"><i>f</i></span> tiene un <em>mínimo relativo</em> en <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span> si y sólo si existe un entorno <span class="math-text"><i>B</i>((<i>x</i>₀, <i>y</i>₀); <i>r</i>)</span> tal que:<br>
          <span class="math-text"><i>f</i>(<i>x</i>₀, <i>y</i>₀) ≤ <i>f</i>(<i>x</i>, <i>y</i>)</span> &nbsp;para todo <span class="math-text">(<i>x</i>, <i>y</i>) ∈ <i>B</i>((<i>x</i>₀, <i>y</i>₀); <i>r</i>) ∩ <i>D</i></span>.</p>
        </div>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Definición: Extremos absolutos (globales) y Teorema de Weierstrass</strong></div>
          <p>Sea <span class="math-text"><i>S</i></span> una región del dominio de <span class="math-text"><i>f</i></span>:<br>
          1. <strong>Máximo absoluto:</strong> <span class="math-text"><i>f</i>(<i>x</i>₀, <i>y</i>₀)</span> es el <em>máximo absoluto</em> de <span class="math-text"><i>f</i></span> en <span class="math-text"><i>S</i></span> si <span class="math-text"><i>f</i>(<i>x</i>₀, <i>y</i>₀) ≥ <i>f</i>(<i>x</i>, <i>y</i>)</span> para todo <span class="math-text">(<i>x</i>, <i>y</i>) ∈ <i>S</i></span>.<br>
          2. <strong>Mínimo absoluto:</strong> <span class="math-text"><i>f</i>(<i>x</i>₀, <i>y</i>₀)</span> es el <em>mínimo absoluto</em> de <span class="math-text"><i>f</i></span> en <span class="math-text"><i>S</i></span> si <span class="math-text"><i>f</i>(<i>x</i>₀, <i>y</i>₀) ≤ <i>f</i>(<i>x</i>, <i>y</i>)</span> para todo <span class="math-text">(<i>x</i>, <i>y</i>) ∈ <i>S</i></span>.<br>
          • <strong>Teorema del Valor Extremo (Weierstrass):</strong> Si <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>)</span> es una función continua en una región <span class="math-text"><i>S</i> ⊂ ℝ²</span> <strong>cerrada y acotada</strong> (conjunto compacto), entonces <span class="math-text"><i>f</i></span> alcanza con certeza absoluta al menos un valor máximo absoluto y al menos un valor mínimo absoluto en <span class="math-text"><i>S</i></span>.</p>
        </div>

        <h3>Puntos críticos y la condición necesaria de primer orden</h3>
        <p>Para localizar los puntos donde pueden ocurrir extremos relativos, el análisis diferencial recurre a las derivadas parciales de primer orden:</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Condición necesaria de primer orden (Folleto, pág. 16)</strong></div>
          <p>Si <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>)</span> tiene un extremo relativo (máximo o mínimo local) en un punto interior <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span> y existen sus derivadas parciales de primer orden en dicho punto, entonces ambas se anulan simultáneamente:<br>
          <span class="math-text"><i>f<sub>x</sub></i>(<i>x</i>₀, <i>y</i>₀) = 0 &nbsp;&nbsp;y&nbsp;&nbsp; <i>f<sub>y</sub></i>(<i>x</i>₀, <i>y</i>₀) = 0</span><br>
          Equivalentemente, el vector gradiente es nulo: <span class="math-text">∇<i>f</i>(<i>x</i>₀, <i>y</i>₀) = <b>0</b></span>.<br>
          <em>Interpretación geométrica:</em> En un extremo suave relativo, el plano tangente a la superficie <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>)</span> es <strong>estrictamente horizontal</strong> (<span class="math-text"><i>z</i> = <i>z</i>₀</span>), pues su vector normal <span class="math-text"><b>N</b> = (<i>f<sub>x</sub></i>, <i>f<sub>y</sub></i>, −1) = (0, 0, −1)</span> es vertical.</p>
        </div>

        <p>• <strong>Definición de punto crítico (Definición 5 del folleto, pág. 16):</strong><br>
        Un punto <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span> en el dominio de <span class="math-text"><i>f</i></span> se denomina <strong>punto crítico</strong> o <strong>punto estacionario</strong> si:<br>
        1. <span class="math-text">∇<i>f</i>(<i>x</i>₀, <i>y</i>₀) = <b>0</b></span> (es decir, <span class="math-text"><i>f<sub>x</sub></i>(<i>x</i>₀, <i>y</i>₀) = 0</span> y <span class="math-text"><i>f<sub>y</sub></i>(<i>x</i>₀, <i>y</i>₀) = 0</span>), o bien<br>
        2. Alguna de las derivadas parciales de primer orden (<span class="math-text"><i>f<sub>x</sub></i></span> o <span class="math-text"><i>f<sub>y</sub></i></span>) <strong>no existe</strong> en dicho punto.</p>

        <p>• <strong>Distinción rigurosa: Candidatos vs. extremos comprobados:</strong><br>
        Como enfatiza el profesor David Chávez (pág. 16): <em>«El recíproco de este teorema no es válido, es decir que <span class="math-text"><i>f<sub>x</sub></i> = <i>f<sub>y</sub></i> = 0</span> no es suficiente para la existencia de un valor extremo»</em>.<br>
        Los puntos donde el gradiente se anula son únicamente <strong>candidatos a extremos</strong>. Para verificar si un punto crítico es verdaderamente un máximo, un mínimo o un punto de silla, es indispensable aplicar un criterio de segundo orden o analizar directamente el comportamiento de la función en su vecindad.</p>

        <p>• <strong>Puntos de silla (Saddle points):</strong><br>
        Un punto crítico estacionario <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span> que no constituye un máximo relativo ni un mínimo relativo se denomina <strong>punto de silla</strong>. En un punto de silla, la superficie presenta curvatura contraria según la dirección que se elija: asciende en ciertas direcciones (actuando como un mínimo direccional) y desciende en otras (actuando como un máximo direccional), asemejándose a una silla de montar o a un paso de montaña (como el hiperboloide parabólico <span class="math-text"><i>z</i> = <i>x</i>² − <i>y</i>²</span> en el origen).</p>

        <h3>Criterio de la segunda derivada: El discriminante Hessiano</h3>
        <p>Para clasificar analíticamente los puntos críticos de una función de dos variables sin necesidad de graficar la superficie, se emplea el <strong>Criterio de la Segunda Derivada</strong> (Folleto, pág. 17):</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Teorema: Criterio de la segunda derivada (Discriminante de Hesse)</strong></div>
          <p>Sea <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>)</span> una función con derivadas parciales de segundo orden <span class="math-text"><i>f<sub>xx</sub></i>, <i>f<sub>yy</sub></i>, <i>f<sub>xy</sub></i></span> continuas en un disco abierto centrado en el punto crítico <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span> donde <span class="math-text"><i>f<sub>x</sub></i>(<i>x</i>₀, <i>y</i>₀) = 0</span> y <span class="math-text"><i>f<sub>y</sub></i>(<i>x</i>₀, <i>y</i>₀) = 0</span>.<br>
          Se define el <strong>discriminante Hessiano</strong> <span class="math-text"><i>D</i></span> (o <span class="math-text">Δ</span>) mediante el determinante de la matriz Hessiana <span class="math-text">2 × 2</span>:<br>
          <span class="math-text"><i>D</i> = <i>f<sub>xx</sub></i>(<i>x</i>₀, <i>y</i>₀) <i>f<sub>yy</sub></i>(<i>x</i>₀, <i>y</i>₀) − [<i>f<sub>xy</sub></i>(<i>x</i>₀, <i>y</i>₀)]² = <span class="math-fraction"><span>|</span><span>|</span></span> <i>f<sub>xx</sub></i> &nbsp;&nbsp; <i>f<sub>xy</sub></i> |<br>
          | <i>f<sub>xy</sub></i> &nbsp;&nbsp; <i>f<sub>yy</sub></i> <span class="math-fraction"><span>|</span><span>|</span></span></span></p>
          <p><strong>Clasificación exhaustiva según los signos de <i>D</i> y <i>f<sub>xx</sub></i>:</strong><br>
          <strong>a) Si <span class="math-text"><i>D</i> &gt; 0</span> y <span class="math-text"><i>f<sub>xx</sub></i>(<i>x</i>₀, <i>y</i>₀) &gt; 0</span>:</strong><br>
          La función <span class="math-text"><i>f</i></span> tiene un <strong>mínimo relativo</strong> en <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span>. (Dado que <span class="math-text"><i>D</i> &gt; 0</span> implica que <span class="math-text"><i>f<sub>xx</sub> f<sub>yy</sub> &gt; (f<sub>xy</sub>)² ≥ 0</i></span>, se deduce que <span class="math-text"><i>f<sub>yy</sub></i></span> tiene forzosamente el mismo signo positivo que <span class="math-text"><i>f<sub>xx</sub></i></span>; la superficie es cóncava hacia arriba en todas las direcciones).<br>
          <strong>b) Si <span class="math-text"><i>D</i> &gt; 0</span> y <span class="math-text"><i>f<sub>xx</sub></i>(<i>x</i>₀, <i>y</i>₀) &lt; 0</span>:</strong><br>
          La función <span class="math-text"><i>f</i></span> tiene un <strong>máximo relativo</strong> en <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span>. (Análogamente, <span class="math-text"><i>f<sub>yy</sub> &lt; 0</i></span>; la superficie es cóncava hacia abajo en todas las direcciones).<br>
          <strong>c) Si <span class="math-text"><i>D</i> &lt; 0</span>:</strong><br>
          La función <span class="math-text"><i>f</i></span> tiene un <strong>punto de silla</strong> en <span class="math-text">(<i>x</i>₀, <i>y</i>₀)</span>. El punto no es un extremo relativo.<br>
          <strong>d) Si <span class="math-text"><i>D</i> = 0</span>:</strong><br>
          <strong>El criterio falla (es inconcluso)</strong>. El valor <span class="math-text"><i>D</i> = 0</span> no proporciona información suficiente para determinar la naturaleza del punto: este puede corresponder a un máximo relativo, a un mínimo relativo o a un punto de silla. En este caso es obligatorio realizar un análisis directo mediante desarrollos de orden superior o evaluar el signo del incremento <span class="math-text">Δ<i>f</i> = <i>f</i>(<i>x</i>, <i>y</i>) − <i>f</i>(<i>x</i>₀, <i>y</i>₀)</span> sobre distintas trayectorias.</p>
        </div>

        <h3>Generalización a n variables: Matriz Hessiana y menores principales</h3>
        <p>Cuando la función depende de tres o más variables independientes <span class="math-text"><i>y</i> = <i>f</i>(<i>x</i>₁, <i>x</i>₂, ..., <i>x<sub>n</sub></i>)</span>, el discriminante escalar se generaliza mediante la <strong>Matriz Hessiana</strong> y el criterio de determinantes de los menores principales de Sylvester (Folleto, pág. 20):</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>La Matriz Hessiana y el Criterio de Sylvester</strong></div>
          <p>Para un punto crítico <span class="math-text"><b>a</b> = (<i>a</i>₁, <i>a</i>₂, ..., <i>a<sub>n</sub></i>)</span> donde <span class="math-text"><i>f</i>₁ = <i>f</i>₂ = ... = <i>f<sub>n</sub></i> = 0</span>, la matriz formada por todas las derivadas parciales de segundo orden es la <strong>matriz Hessiana</strong> <span class="math-text"><i>H</i></span>:<br>
          <span class="math-text"><i>H</i> = (<i>f<sub>ij</sub></i>)<sub><i>n</i>×<i>n</i></sub> = (<span class="math-fraction"><span>∂²<i>f</i></span><span>∂<i>x<sub>i</sub></i> ∂<i>x<sub>j</sub></i></span></span>)</span></p>
          <p>Se definen las submatrices cuadradas principales <span class="math-text"><i>H</i>₁, <i>H</i>₂, ..., <i>H<sub>n</sub></i></span> correspondientes a los bloques superiores izquierdos de orden <span class="math-text">1 × 1, 2 × 2, ..., <i>n</i> × <i>n</i></span>, y sus determinantes llamados <strong>menores principales</strong>:<br>
          <span class="math-text">|<i>H</i>₁| = <i>f</i>₁₁, &nbsp;&nbsp; |<i>H</i>₂| = <span class="math-fraction"><span>|</span><span>|</span></span> <i>f</i>₁₁ &nbsp; <i>f</i>₁₂ |<br>
          | <i>f</i>₂₁ &nbsp; <i>f</i>₂₂ <span class="math-fraction"><span>|</span><span>|</span></span>, &nbsp;&nbsp; ..., &nbsp;&nbsp; |<i>H<sub>n</sub></i>| = det(<i>H</i>)</span></p>
          <p><strong>Criterios de clasificación:</strong><br>
          1. <strong>Mínimo relativo:</strong> Si todos los menores principales son <strong>estrictamente positivos</strong>:<br>
          <span class="math-text">|<i>H</i>₁| &gt; 0, &nbsp; |<i>H</i>₂| &gt; 0, &nbsp; |<i>H</i>₃| &gt; 0, &nbsp; ..., &nbsp; |<i>H<sub>n</sub></i>| &gt; 0</span><br>
          (la matriz Hessiana es definida positiva).<br>
          2. <strong>Máximo relativo:</strong> Si los menores principales <strong>alternan de signo</strong> comenzando con valor negativo en el de orden 1:<br>
          <span class="math-text">|<i>H</i>₁| &lt; 0, &nbsp; |<i>H</i>₂| &gt; 0, &nbsp; |<i>H</i>₃| &lt; 0, &nbsp; |<i>H</i>₄| &gt; 0, &nbsp; ...</span><br>
          es decir, <span class="math-text">(−1)<sup><i>k</i></sup> |<i>H<sub>k</sub></i>| &gt; 0</span> para todo <span class="math-text"><i>k</i></span> (la matriz Hessiana es definida negativa).<br>
          3. <strong>Punto de silla / Inconcluso:</strong> Si los determinantes no nulos no siguen ninguno de los dos patrones anteriores (habiendo valores propios con signos opuestos), el punto es un punto de silla. Si algún menor principal es cero, el criterio de Sylvester no concluye.</p>
        </div>

        <h3>Optimización con restricciones: Multiplicadores de Lagrange</h3>
        <p>En ingeniería y física, la inmensa mayoría de problemas de optimización no son libres, sino que las variables independientes están obligadas a satisfacer una o más ecuaciones denominadas <strong>restricciones</strong> o <strong>ecuaciones de enlace</strong> (Folleto, págs. 21-23):</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Método de los Multiplicadores de Lagrange</strong></div>
          <p>Se desea optimizar la <strong>función objetivo</strong> <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>, <i>z</i>)</span> sujeta a la restricción <span class="math-text"><i>g</i>(<i>x</i>, <i>y</i>, <i>z</i>) = 0</span>.<br>
          • <strong>Fundamento geométrico:</strong> En el punto de extremo condicionado, la superficie de nivel de la función objetivo debe ser tangente a la superficie de la restricción. Por consiguiente, los vectores gradientes de ambas superficies deben ser <strong>colineales (paralelos)</strong>:<br>
          <span class="math-text">∇<i>f</i>(<i>x</i>, <i>y</i>, <i>z</i>) = −<i>λ</i> ∇<i>g</i>(<i>x</i>, <i>y</i>, <i>z</i>) &nbsp;&nbsp;o&nbsp;&nbsp; ∇<i>f</i> + <i>λ</i> ∇<i>g</i> = <b>0</b></span><br>
          donde la variable auxiliar <span class="math-text"><i>λ</i></span> recibe el nombre de <strong>multiplicador de Lagrange</strong>.</p>
          <p>• <strong>La función Lagrangiana:</strong><br>
          Se define la función de Lagrange combinando la función objetivo y la restricción multiplicada por <span class="math-text"><i>λ</i></span>:<br>
          <span class="math-text"><i>F</i>(<i>x</i>, <i>y</i>, <i>z</i>, <i>λ</i>) = <i>f</i>(<i>x</i>, <i>y</i>, <i>z</i>) + <i>λ g</i>(<i>x</i>, <i>y</i>, <i>z</i>)</span><br>
          Las condiciones necesarias de extremo corresponden a igualar a cero todas sus derivadas parciales:<br>
          <span class="math-text"><i>F<sub>x</sub></i> = <i>f<sub>x</sub></i> + <i>λ g<sub>x</sub></i> = 0, &nbsp;&nbsp; <i>F<sub>y</sub></i> = <i>f<sub>y</sub></i> + <i>λ g<sub>y</sub></i> = 0, &nbsp;&nbsp; <i>F<sub>z</sub></i> = <i>f<sub>z</sub></i> + <i>λ g<sub>z</sub></i> = 0, &nbsp;&nbsp; <i>F<sub>λ</sub></i> = <i>g</i>(<i>x</i>, <i>y</i>, <i>z</i>) = 0</span></p>
        </div>

        <p>• <strong>Hipótesis rigurosas y limitaciones del método de Lagrange:</strong><br>
        1. <strong>Diferenciabilidad:</strong> Tanto la función objetivo <span class="math-text"><i>f</i></span> como la función de restricción <span class="math-text"><i>g</i></span> deben ser diferenciables con derivadas parciales continuas en el dominio de interés.<br>
        2. <strong>Condición de regularidad (Cualificación de la restricción):</strong> En todo punto de la superficie de restricción <span class="math-text"><i>g</i>(<i>x</i>, <i>y</i>, <i>z</i>) = 0</span> se exige que el gradiente no se anule: <span class="math-text">∇<i>g</i> ≠ <b>0</b></span>. Si existieran puntos sobre la restricción donde <span class="math-text">∇<i>g</i> = <b>0</b></span> (puntos singulares), el método de Lagrange no es aplicable en ellos y deben estudiarse por separado.<br>
        3. <strong>Condición necesaria, no suficiente:</strong> El método de Lagrange genera exclusivamente <strong>puntos críticos candidatos</strong> a extremos condicionados. No clasifica por sí mismo si el punto es un máximo, un mínimo o un punto de inflexión restringido. Para concluir categóricamente se debe verificar si la restricción es un conjunto compacto (cerrado y acotado), evaluar y comparar el valor de <span class="math-text"><i>f</i></span> en todos los puntos críticos candidatos, o emplear matrices Hessianas orladas.</p>

        <p>• <strong>Caso con dos restricciones simultáneas (Folleto, pág. 22):</strong><br>
        Si se optimiza <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>, <i>z</i>)</span> sujeta a dos restricciones <span class="math-text"><i>g</i>(<i>x</i>, <i>y</i>, <i>z</i>) = 0</span> y <span class="math-text"><i>h</i>(<i>x</i>, <i>y</i>, <i>z</i>) = 0</span> cuyos gradientes <span class="math-text">∇<i>g</i></span> y <span class="math-text">∇<i>h</i></span> no sean paralelos, se introducen dos multiplicadores <span class="math-text"><i>λ</i></span> y <span class="math-text"><i>μ</i></span>:<br>
        <span class="math-text"><i>F</i>(<i>x</i>, <i>y</i>, <i>z</i>, <i>λ</i>, <i>μ</i>) = <i>f</i>(<i>x</i>, <i>y</i>, <i>z</i>) + <i>λ g</i>(<i>x</i>, <i>y</i>, <i>z</i>) + <i>μ h</i>(<i>x</i>, <i>y</i>, <i>z</i>)</span><br>
        resolviendo el sistema vectorial: <span class="math-text">∇<i>f</i> + <i>λ</i> ∇<i>g</i> + <i>μ</i> ∇<i>h</i> = <b>0</b></span> junto con <span class="math-text"><i>g</i> = 0</span> y <span class="math-text"><i>h</i> = 0</span>.</p>

        <h3>Ejemplos resueltos del folleto (paso a paso)</h3>

        <p><strong>Ejemplo 1: Análisis y clasificación de cuatro puntos críticos (Ejemplo 14 de Semana 05, pág. 18)</strong><br>
        Encontrar y clasificar todos los valores extremos relativos y puntos de silla de la función cúbica:<br>
        <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = <i>x</i>³ + <i>y</i>³ − 3<i>x</i> − 12<i>y</i> + 20</span>.<br>
        • <em>Solución paso a paso:</em><br>
        1) <strong>Búsqueda de puntos críticos (primeras derivadas):</strong><br>
        <span class="math-text"><i>f<sub>x</sub></i> = 3<i>x</i>² − 3 = 0 ⇒ 3(<i>x</i>² − 1) = 0 ⇒ <i>x</i> = ±1</span>.<br>
        <span class="math-text"><i>f<sub>y</sub></i> = 3<i>y</i>² − 12 = 0 ⇒ 3(<i>y</i>² − 4) = 0 ⇒ <i>y</i> = ±2</span>.<br>
        Al ser ecuaciones independientes desacopladas, se obtienen exactamente <strong>cuatro puntos críticos candidatos</strong>:<br>
        <span class="math-text"><i>P</i>₁(1, 2), &nbsp;&nbsp; <i>P</i>₂(1, −2), &nbsp;&nbsp; <i>P</i>₃(−1, 2), &nbsp;&nbsp; <i>P</i>₄(−1, −2)</span>.<br>
        2) <strong>Cálculo de derivadas de segundo orden y discriminante:</strong><br>
        <span class="math-text"><i>f<sub>xx</sub></i> = <span class="math-fraction"><span>∂</span><span>∂<i>x</i></span></span>(3<i>x</i>² − 3) = 6<i>x</i></span>.<br>
        <span class="math-text"><i>f<sub>yy</sub></i> = <span class="math-fraction"><span>∂</span><span>∂<i>y</i></span></span>(3<i>y</i>² − 12) = 6<i>y</i></span>.<br>
        <span class="math-text"><i>f<sub>xy</sub></i> = <span class="math-fraction"><span>∂</span><span>∂<i>y</i></span></span>(3<i>x</i>² − 3) = 0</span>.<br>
        El discriminante Hessiano en cualquier punto <span class="math-text">(<i>x</i>, <i>y</i>)</span> es:<br>
        <span class="math-text"><i>D</i>(<i>x</i>, <i>y</i>) = <i>f<sub>xx</sub> f<sub>yy</sub></i> − (<i>f<sub>xy</sub></i>)² = (6<i>x</i>)(6<i>y</i>) − 0² = 36<i>xy</i></span>.<br>
        3) <strong>Evaluación y clasificación de cada candidato:</strong><br>
        • Para <span class="math-text"><i>P</i>₁(1, 2)</span>:<br>
        <span class="math-text"><i>D</i>(1, 2) = 36(1)(2) = 72 &gt; 0</span> &nbsp;y&nbsp; <span class="math-text"><i>f<sub>xx</sub></i>(1, 2) = 6(1) = 6 &gt; 0</span>.<br>
        Por tanto, en <span class="math-text">(1, 2)</span> hay un <strong>mínimo relativo</strong>.<br>
        Valor de la función: <span class="math-text"><i>f</i>(1, 2) = 1³ + 2³ − 3(1) − 12(2) + 20 = 1 + 8 − 3 − 24 + 20 = 2</span>.<br>
        • Para <span class="math-text"><i>P</i>₂(1, −2)</span>:<br>
        <span class="math-text"><i>D</i>(1, −2) = 36(1)(−2) = −72 &lt; 0</span>.<br>
        Al ser <span class="math-text"><i>D</i> &lt; 0</span>, el punto <span class="math-text">(1, −2)</span> es un <strong>punto de silla</strong> (valor <span class="math-text"><i>f</i>(1, −2) = 1 − 8 − 3 + 24 + 20 = 34</span>).<br>
        • Para <span class="math-text"><i>P</i>₃(−1, 2)</span>:<br>
        <span class="math-text"><i>D</i>(−1, 2) = 36(−1)(2) = −72 &lt; 0</span>.<br>
        Al ser <span class="math-text"><i>D</i> &lt; 0</span>, el punto <span class="math-text">(−1, 2)</span> es un <strong>punto de silla</strong> (valor <span class="math-text"><i>f</i>(−1, 2) = −1 + 8 + 3 − 24 + 20 = 6</span>).<br>
        • Para <span class="math-text"><i>P</i>₄(−1, −2)</span>:<br>
        <span class="math-text"><i>D</i>(−1, −2) = 36(−1)(−2) = 72 &gt; 0</span> &nbsp;y&nbsp; <span class="math-text"><i>f<sub>xx</sub></i>(−1, −2) = 6(−1) = −6 &lt; 0</span>.<br>
        Por tanto, en <span class="math-text">(−1, −2)</span> hay un <strong>máximo relativo</strong>.<br>
        Valor de la función: <span class="math-text"><i>f</i>(−1, −2) = (−1)³ + (−2)³ − 3(−1) − 12(−2) + 20 = −1 − 8 + 3 + 24 + 20 = 38</span>.<br>
        • <em>Conclusión global:</em> La función posee un mínimo relativo de <span class="math-text">2</span> en <span class="math-text">(1, 2)</span>, un máximo relativo de <span class="math-text">38</span> en <span class="math-text">(−1, −2)</span> y dos puntos de silla en <span class="math-text">(1, −2)</span> y <span class="math-text">(−1, 2)</span>.</p>

        <p><strong>Ejemplo 2: Optimización con restricción por Multiplicadores de Lagrange (Ejemplo 18 de Semana 05, pág. 23)</strong><br>
        Hallar los extremos de la función lineal <span class="math-text"><i>z</i> = <i>f</i>(<i>x</i>, <i>y</i>) = 6 − 4<i>x</i> − 3<i>y</i></span> sujeta a la restricción circular <span class="math-text"><i>x</i>² + <i>y</i>² = 1</span>.<br>
        • <em>Solución paso a paso:</em><br>
        1) <strong>Formulación de la función de Lagrange:</strong><br>
        La restricción es <span class="math-text"><i>g</i>(<i>x</i>, <i>y</i>) = <i>x</i>² + <i>y</i>² − 1 = 0</span>. Formamos:<br>
        <span class="math-text"><i>F</i>(<i>x</i>, <i>y</i>, <i>λ</i>) = 6 − 4<i>x</i> − 3<i>y</i> + <i>λ</i>(<i>x</i>² + <i>y</i>² − 1)</span>.<br>
        2) <strong>Cálculo de derivadas parciales del Lagrangiano e igualación a cero:</strong><br>
        (1) <span class="math-text"><i>F<sub>x</sub></i> = −4 + 2<i>λx</i> = 0 ⇒ 2<i>λx</i> = 4 ⇒ 2<i>λ</i> = <span class="math-fraction"><span>4</span><span><i>x</i></span></span></span> &nbsp;&nbsp;(con <span class="math-text"><i>x</i> ≠ 0</span>).<br>
        (2) <span class="math-text"><i>F<sub>y</sub></i> = −3 + 2<i>λy</i> = 0 ⇒ 2<i>λy</i> = 3 ⇒ 2<i>λ</i> = <span class="math-fraction"><span>3</span><span><i>y</i></span></span></span> &nbsp;&nbsp;(con <span class="math-text"><i>y</i> ≠ 0</span>).<br>
        (3) <span class="math-text"><i>F<sub>λ</sub></i> = <i>x</i>² + <i>y</i>² − 1 = 0 ⇒ <i>x</i>² + <i>y</i>² = 1</span>.<br>
        3) <strong>Relación geométrica entre las coordenadas:</strong><br>
        Igualando las expresiones para <span class="math-text">2<i>λ</i></span> obtenidas en (1) y (2):<br>
        <span class="math-text"><span class="math-fraction"><span>4</span><span><i>x</i></span></span> = <span class="math-fraction"><span>3</span><span><i>y</i></span></span> ⇒ 4<i>y</i> = 3<i>x</i> ⇒ <i>y</i> = <span class="math-fraction"><span>3</span><span>4</span></span><i>x</i></span>.<br>
        4) <strong>Sustitución en la ecuación de la circunferencia:</strong><br>
        <span class="math-text"><i>x</i>² + (<span class="math-fraction"><span>3</span><span>4</span></span><i>x</i>)² = 1 ⇒ <i>x</i>² + <span class="math-fraction"><span>9</span><span>16</span></span><i>x</i>² = 1 ⇒ <span class="math-fraction"><span>25</span><span>16</span></span><i>x</i>² = 1 ⇒ <i>x</i>² = <span class="math-fraction"><span>16</span><span>25</span></span> ⇒ <i>x</i> = ±<span class="math-fraction"><span>4</span><span>5</span></span></span>.<br>
        5) <strong>Determinación de puntos candidatos y evaluación:</strong><br>
        • Si <span class="math-text"><i>x</i> = <span class="math-fraction"><span>4</span><span>5</span></span></span>:<br>
        <span class="math-text"><i>y</i> = <span class="math-fraction"><span>3</span><span>4</span></span>(<span class="math-fraction"><span>4</span><span>5</span></span>) = <span class="math-fraction"><span>3</span><span>5</span></span></span>, &nbsp;&nbsp; <span class="math-text"><i>λ</i> = <span class="math-fraction"><span>4</span><span>2(4/5)</span></span> = <span class="math-fraction"><span>5</span><span>2</span></span></span>.<br>
        Evaluamos <span class="math-text"><i>z</i></span> en <span class="math-text">(<span class="math-fraction"><span>4</span><span>5</span></span>, <span class="math-fraction"><span>3</span><span>5</span></span>)</span>:<br>
        <span class="math-text"><i>z</i> = 6 − 4(<span class="math-fraction"><span>4</span><span>5</span></span>) − 3(<span class="math-fraction"><span>3</span><span>5</span></span>) = 6 − <span class="math-fraction"><span>16</span><span>5</span></span> − <span class="math-fraction"><span>9</span><span>5</span></span> = 6 − <span class="math-fraction"><span>25</span><span>5</span></span> = 6 − 5 = 1</span>.<br>
        • Si <span class="math-text"><i>x</i> = −<span class="math-fraction"><span>4</span><span>5</span></span></span>:<br>
        <span class="math-text"><i>y</i> = <span class="math-fraction"><span>3</span><span>4</span></span>(−<span class="math-fraction"><span>4</span><span>5</span></span>) = −<span class="math-fraction"><span>3</span><span>5</span></span></span>, &nbsp;&nbsp; <span class="math-text"><i>λ</i> = −<span class="math-fraction"><span>5</span><span>2</span></span></span>.<br>
        Evaluamos <span class="math-text"><i>z</i></span> en <span class="math-text">(−<span class="math-fraction"><span>4</span><span>5</span></span>, −<span class="math-fraction"><span>3</span><span>5</span></span>)</span>:<br>
        <span class="math-text"><i>z</i> = 6 − 4(−<span class="math-fraction"><span>4</span><span>5</span></span>) − 3(−<span class="math-fraction"><span>3</span><span>5</span></span>) = 6 + <span class="math-fraction"><span>16</span><span>5</span></span> + <span class="math-fraction"><span>9</span><span>5</span></span> = 6 + 5 = 11</span>.<br>
        6) <strong>Justificación de extremos absolutos condicionados:</strong><br>
        La restricción <span class="math-text"><i>x</i>² + <i>y</i>² = 1</span> define una curva cerrada y acotada (compacta en <span class="math-text">ℝ²</span>) y la función objetivo es continua. Por el Teorema del Valor Extremo de Weierstrass, <span class="math-text"><i>f</i></span> alcanza obligatoriamente su máximo y mínimo absolutos sobre la restricción.<br>
        Al comparar los valores de los dos únicos candidatos regulares, se concluye formalmente:<br>
        - <strong>Mínimo absoluto condicionado:</strong> valor <span class="math-text"><i>z</i> = 1</span> en el punto <span class="math-text">(<span class="math-fraction"><span>4</span><span>5</span></span>, <span class="math-fraction"><span>3</span><span>5</span></span>)</span>.<br>
        - <strong>Máximo absoluto condicionado:</strong> valor <span class="math-text"><i>z</i> = 11</span> en el punto <span class="math-text">(−<span class="math-fraction"><span>4</span><span>5</span></span>, −<span class="math-fraction"><span>3</span><span>5</span></span>)</span>.</p>

        <p><strong>Ejemplo 3: Extremos de funciones en ℝ³ mediante la Matriz Hessiana (Ejemplo 17 de Semana 05, pág. 21)</strong><br>
        Investigar los valores extremos de la función en tres variables:<br>
        <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>, <i>z</i>) = <i>x</i>² − 2<i>xy</i> + 2<i>y</i>² + 2<i>xz</i> + 4<i>z</i>² − 2<i>z</i></span>.<br>
        • <em>Solución explicada:</em><br>
        1) <strong>Sistema de derivadas de primer orden:</strong><br>
        (1) <span class="math-text"><i>f<sub>x</sub></i> = 2<i>x</i> − 2<i>y</i> + 2<i>z</i> = 0</span>.<br>
        (2) <span class="math-text"><i>f<sub>y</sub></i> = −2<i>x</i> + 4<i>y</i> = 0 ⇒ 2<i>x</i> = 4<i>y</i> ⇒ <i>x</i> = 2<i>y</i></span>.<br>
        (3) <span class="math-text"><i>f<sub>z</sub></i> = 2<i>x</i> + 8<i>z</i> − 2 = 0</span>.<br>
        Sustituyendo <span class="math-text"><i>x</i> = 2<i>y</i></span> en la ecuación (1):<br>
        <span class="math-text">2(2<i>y</i>) − 2<i>y</i> + 2<i>z</i> = 0 ⇒ 2<i>y</i> + 2<i>z</i> = 0 ⇒ <i>z</i> = −<i>y</i></span>.<br>
        Sustituyendo <span class="math-text"><i>x</i> = 2<i>y</i></span> y <span class="math-text"><i>z</i> = −<i>y</i></span> en la ecuación (3):<br>
        <span class="math-text">2(2<i>y</i>) + 8(−<i>y</i>) − 2 = 0 ⇒ 4<i>y</i> − 8<i>y</i> − 2 = 0 ⇒ −4<i>y</i> = 2 ⇒ <i>y</i> = −<span class="math-fraction"><span>1</span><span>2</span></span></span>.<br>
        Por consiguiente: <span class="math-text"><i>x</i> = 2(−<span class="math-fraction"><span>1</span><span>2</span></span>) = −1</span> y <span class="math-text"><i>z</i> = −(−<span class="math-fraction"><span>1</span><span>2</span></span>) = <span class="math-fraction"><span>1</span><span>2</span></span></span>.<br>
        Existe un único punto crítico: <span class="math-text"><i>P</i>₀(−1, −<span class="math-fraction"><span>1</span><span>2</span></span>, <span class="math-fraction"><span>1</span><span>2</span></span>)</span>.<br>
        2) <strong>Construcción de la matriz Hessiana:</strong><br>
        Calculamos las 9 derivadas parciales de segundo orden:<br>
        <span class="math-text"><i>f<sub>xx</sub></i> = 2, &nbsp; <i>f<sub>xy</sub></i> = −2, &nbsp; <i>f<sub>xz</sub></i> = 2</span><br>
        <span class="math-text"><i>f<sub>yx</sub></i> = −2, &nbsp; <i>f<sub>yy</sub></i> = 4, &nbsp; <i>f<sub>yz</sub></i> = 0</span><br>
        <span class="math-text"><i>f<sub>zx</sub></i> = 2, &nbsp; <i>f<sub>zy</sub></i> = 0, &nbsp; <i>f<sub>zz</sub></i> = 8</span><br>
        La matriz Hessiana simétrica constante es:<br>
        <span class="math-text"><i>H</i> = <span class="math-fraction"><span>(</span><span>(</span></span> <span class="math-fraction"><span>&nbsp;2</span><span>−2</span></span> <span class="math-fraction"><span>−2</span><span>&nbsp;4</span></span> <span class="math-fraction"><span>2</span><span>0</span></span> | <span class="math-fraction"><span>2</span><span>0</span></span> <span class="math-fraction"><span>8</span><span>)</span></span></span>.<br>
        3) <strong>Evaluación de los menores principales de Sylvester:</strong><br>
        • Menor de orden 1: <span class="math-text">|<i>H</i>₁| = <i>f<sub>xx</sub></i> = 2 &gt; 0</span>.<br>
        • Menor de orden 2: <span class="math-text">|<i>H</i>₂| = <span class="math-fraction"><span>|</span><span>|</span></span> 2 &nbsp; −2 |<br>
        | −2 &nbsp; 4 <span class="math-fraction"><span>|</span><span>|</span></span> = 2(4) − (−2)(−2) = 8 − 4 = 4 &gt; 0</span>.<br>
        • Menor de orden 3 (Determinante completo):<br>
        Desarrollando por la primera fila:<br>
        <span class="math-text">|<i>H</i>₃| = 2(4 · 8 − 0 · 0) − (−2)(−2 · 8 − 0 · 2) + 2(−2 · 0 − 4 · 2)</span><br>
        <span class="math-text">= 2(32) + 2(−16) + 2(−8) = 64 − 32 − 16 = 16 &gt; 0</span>.<br>
        4) <strong>Clasificación del punto crítico:</strong><br>
        Dado que todos los menores principales son estrictamente positivos (<span class="math-text">|<i>H</i>₁| &gt; 0, |<i>H</i>₂| &gt; 0, |<i>H</i>₃| &gt; 0</span>), la matriz Hessiana es <strong>definida positiva</strong>.<br>
        Se concluye que en <span class="math-text">(−1, −<span class="math-fraction"><span>1</span><span>2</span></span>, <span class="math-fraction"><span>1</span><span>2</span></span>)</span> la función alcanza un <strong>mínimo relativo</strong> estricto.<br>
        Valor mínimo: <span class="math-text"><i>f</i>(−1, −<span class="math-fraction"><span>1</span><span>2</span></span>, <span class="math-fraction"><span>1</span><span>2</span></span>) = (−1)² − 2(−1)(−<span class="math-fraction"><span>1</span><span>2</span></span>) + 2(−<span class="math-fraction"><span>1</span><span>2</span></span>)² + 2(−1)(<span class="math-fraction"><span>1</span><span>2</span></span>) + 4(<span class="math-fraction"><span>1</span><span>2</span></span>)² − 2(<span class="math-fraction"><span>1</span><span>2</span></span>) = 1 − 1 + <span class="math-fraction"><span>1</span><span>2</span></span> − 1 + 1 − 1 = −<span class="math-fraction"><span>1</span><span>2</span></span></span>.</p>

        <p><strong>Ejemplo 4: Optimización en un disco cerrado (Interior y Frontera) (Ejemplo 22 de Semana 05, págs. 24-25)</strong><br>
        Una placa metálica circular ocupa la región <span class="math-text"><i>x</i>² + <i>y</i>² ≤ 1</span>. Su temperatura en cualquier punto viene dada por <span class="math-text"><i>T</i>(<i>x</i>, <i>y</i>) = <i>x</i>² + 2<i>y</i>² − <i>x</i></span>. Determinar los puntos más calientes y más fríos de la placa y sus temperaturas respectivas.<br>
        • <em>Solución analítica completa:</em><br>
        1) <strong>Análisis en el interior abierto (<span class="math-text"><i>x</i>² + <i>y</i>² &lt; 1</span>):</strong><br>
        Derivadas parciales igualadas a cero:<br>
        <span class="math-text"><i>T<sub>x</sub></i> = 2<i>x</i> − 1 = 0 ⇒ <i>x</i> = <span class="math-fraction"><span>1</span><span>2</span></span></span>.<br>
        <span class="math-text"><i>T<sub>y</sub></i> = 4<i>y</i> = 0 ⇒ <i>y</i> = 0</span>.<br>
        Comprobamos si el punto pertenece al interior: <span class="math-text">(<span class="math-fraction"><span>1</span><span>2</span></span>)² + 0² = <span class="math-fraction"><span>1</span><span>4</span></span> &lt; 1</span> (punto interior válido).<br>
        Temperatura en este candidato interior: <span class="math-text"><i>T</i>(<span class="math-fraction"><span>1</span><span>2</span></span>, 0) = (<span class="math-fraction"><span>1</span><span>2</span></span>)² + 0 − <span class="math-fraction"><span>1</span><span>2</span></span> = <span class="math-fraction"><span>1</span><span>4</span></span> − <span class="math-fraction"><span>1</span><span>2</span></span> = −<span class="math-fraction"><span>1</span><span>4</span></span></span>.<br>
        2) <strong>Análisis en la frontera (<span class="math-text"><i>x</i>² + <i>y</i>² = 1</span>) mediante multiplicadores de Lagrange:</strong><br>
        Lagrangiano: <span class="math-text"><i>F</i>(<i>x</i>, <i>y</i>, <i>λ</i>) = <i>x</i>² + 2<i>y</i>² − <i>x</i> + <i>λ</i>(<i>x</i>² + <i>y</i>² − 1)</span>.<br>
        (1) <span class="math-text"><i>F<sub>x</sub></i> = 2<i>x</i> − 1 + 2<i>λx</i> = 0</span>.<br>
        (2) <span class="math-text"><i>F<sub>y</sub></i> = 4<i>y</i> + 2<i>λy</i> = 2<i>y</i>(2 + <i>λ</i>) = 0 ⇒ <i>y</i> = 0 &nbsp;o&nbsp; <i>λ</i> = −2</span>.<br>
        • Caso A: Si <span class="math-text"><i>y</i> = 0</span>, por la restricción <span class="math-text"><i>x</i>² + 0² = 1 ⇒ <i>x</i> = ±1</span>.<br>
        - En <span class="math-text">(1, 0)</span>: <span class="math-text"><i>T</i>(1, 0) = 1² − 1 = 0</span>.<br>
        - En <span class="math-text">(−1, 0)</span>: <span class="math-text"><i>T</i>(−1, 0) = (−1)² − (−1) = 1 + 1 = 2</span>.<br>
        • Caso B: Si <span class="math-text"><i>λ</i> = −2</span>, sustituyendo en (1):<br>
        <span class="math-text">2<i>x</i> − 1 + 2(−2)<i>x</i> = 0 ⇒ −2<i>x</i> − 1 = 0 ⇒ <i>x</i> = −<span class="math-fraction"><span>1</span><span>2</span></span></span>.<br>
        De la restricción <span class="math-text"><i>x</i>² + <i>y</i>² = 1</span>:<br>
        <span class="math-text">(−<span class="math-fraction"><span>1</span><span>2</span></span>)² + <i>y</i>² = 1 ⇒ <span class="math-fraction"><span>1</span><span>4</span></span> + <i>y</i>² = 1 ⇒ <i>y</i>² = <span class="math-fraction"><span>3</span><span>4</span></span> ⇒ <i>y</i> = ±<span class="math-fraction"><span>√<span class="math-radical">3</span></span><span>2</span></span></span>.<br>
        Evaluamos la temperatura en <span class="math-text">(−<span class="math-fraction"><span>1</span><span>2</span></span>, ±<span class="math-fraction"><span>√<span class="math-radical">3</span></span><span>2</span></span>)</span>:<br>
        <span class="math-text"><i>T</i>(−<span class="math-fraction"><span>1</span><span>2</span></span>, ±<span class="math-fraction"><span>√<span class="math-radical">3</span></span><span>2</span></span>) = (−<span class="math-fraction"><span>1</span><span>2</span></span>)² + 2(<span class="math-fraction"><span>√<span class="math-radical">3</span></span><span>2</span></span>)² − (−<span class="math-fraction"><span>1</span><span>2</span></span>) = <span class="math-fraction"><span>1</span><span>4</span></span> + 2(<span class="math-fraction"><span>3</span><span>4</span></span>) + <span class="math-fraction"><span>1</span><span>2</span></span> = <span class="math-fraction"><span>1</span><span>4</span></span> + <span class="math-fraction"><span>6</span><span>4</span></span> + <span class="math-fraction"><span>2</span><span>4</span></span> = <span class="math-fraction"><span>9</span><span>4</span></span> = 2.25</span>.<br>
        3) <strong>Comparación global exhaustiva:</strong><br>
        Comparamos los valores en todos los candidatos identificados:<br>
        - <span class="math-text"><i>T</i>(<span class="math-fraction"><span>1</span><span>2</span></span>, 0) = −<span class="math-fraction"><span>1</span><span>4</span></span> = −0.25</span> &nbsp;&nbsp;(candidato interior)<br>
        - <span class="math-text"><i>T</i>(1, 0) = 0</span> &nbsp;&nbsp;(candidato de frontera)<br>
        - <span class="math-text"><i>T</i>(−1, 0) = 2</span> &nbsp;&nbsp;(candidato de frontera)<br>
        - <span class="math-text"><i>T</i>(−<span class="math-fraction"><span>1</span><span>2</span></span>, ±<span class="math-fraction"><span>√<span class="math-radical">3</span></span><span>2</span></span>) = <span class="math-fraction"><span>9</span><span>4</span></span> = 2.25</span> &nbsp;&nbsp;(candidatos de frontera)<br>
        • <em>Conclusión física y matemática:</em><br>
        - Los <strong>puntos más calientes</strong> (máximos absolutos) son <span class="math-text">(−<span class="math-fraction"><span>1</span><span>2</span></span>, <span class="math-fraction"><span>√<span class="math-radical">3</span></span><span>2</span></span>)</span> y <span class="math-text">(−<span class="math-fraction"><span>1</span><span>2</span></span>, −<span class="math-fraction"><span>√<span class="math-radical">3</span></span><span>2</span></span>)</span> con temperatura máxima <span class="math-text"><i>T</i> = <span class="math-fraction"><span>9</span><span>4</span></span></span>.<br>
        - El <strong>punto más frío</strong> (mínimo absoluto) se ubica en el interior en <span class="math-text">(<span class="math-fraction"><span>1</span><span>2</span></span>, 0)</span> con temperatura mínima <span class="math-text"><i>T</i> = −<span class="math-fraction"><span>1</span><span>4</span></span></span>.</p>

        <h3>Ejercicios de práctica propuestos del folleto (con soluciones detalladas)</h3>

        <p><strong>Ejercicio 1: Clasificación de punto crítico mediante discriminante (Propuesto 1.i de Semana 05, pág. 30)</strong><br>
        Determine los valores extremos relativos de la función:<br>
        <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = <i>x</i>² + 2<i>y</i>² − 4<i>x</i> + 4<i>y</i> − 3</span>.<br>
        • <em>Solución explicada:</em><br>
        1) <strong>Cálculo de derivadas parciales:</strong><br>
        <span class="math-text"><i>f<sub>x</sub></i> = 2<i>x</i> − 4 = 0 ⇒ <i>x</i> = 2</span>.<br>
        <span class="math-text"><i>f<sub>y</sub></i> = 4<i>y</i> + 4 = 0 ⇒ <i>y</i> = −1</span>.<br>
        Único punto crítico candidato: <span class="math-text"><i>P</i>₀(2, −1)</span>.<br>
        2) <strong>Segundas derivadas y discriminante:</strong><br>
        <span class="math-text"><i>f<sub>xx</sub></i> = 2</span>, &nbsp;&nbsp; <span class="math-text"><i>f<sub>yy</sub></i> = 4</span>, &nbsp;&nbsp; <span class="math-text"><i>f<sub>xy</sub></i> = 0</span>.<br>
        <span class="math-text"><i>D</i> = <i>f<sub>xx</sub> f<sub>yy</sub></i> − (<i>f<sub>xy</sub></i>)² = (2)(4) − 0 = 8 &gt; 0</span>.<br>
        3) <strong>Clasificación:</strong><br>
        Como <span class="math-text"><i>D</i> = 8 &gt; 0</span> y <span class="math-text"><i>f<sub>xx</sub></i> = 2 &gt; 0</span>, la función presenta un <strong>mínimo relativo</strong> en <span class="math-text">(2, −1)</span>.<br>
        Valor mínimo: <span class="math-text"><i>f</i>(2, −1) = 2² + 2(−1)² − 4(2) + 4(−1) − 3 = 4 + 2 − 8 − 4 − 3 = −9</span>.</p>

        <p><strong>Ejercicio 2: Puntos críticos múltiples y punto de silla (Propuesto 1.vii de Semana 05, pág. 30)</strong><br>
        Determinar y clasificar los extremos relativos de la función cúbica:<br>
        <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = <i>x</i>³ + 3<i>xy</i> − <i>y</i>³</span>.<br>
        • <em>Solución explicada:</em><br>
        1) <strong>Sistema de derivadas parciales:</strong><br>
        (1) <span class="math-text"><i>f<sub>x</sub></i> = 3<i>x</i>² + 3<i>y</i> = 0 ⇒ <i>y</i> = −<i>x</i>²</span>.<br>
        (2) <span class="math-text"><i>f<sub>y</sub></i> = 3<i>x</i> − 3<i>y</i>² = 0 ⇒ <i>x</i> = <i>y</i>²</span>.<br>
        Sustituyendo <span class="math-text"><i>y</i> = −<i>x</i>²</span> en (2):<br>
        <span class="math-text"><i>x</i> = (−<i>x</i>²)² = <i>x</i>⁴ ⇒ <i>x</i>⁴ − <i>x</i> = 0 ⇒ <i>x</i>(<i>x</i>³ − 1) = 0</span>.<br>
        Las soluciones reales son <span class="math-text"><i>x</i> = 0</span> y <span class="math-text"><i>x</i> = 1</span>.<br>
        - Si <span class="math-text"><i>x</i> = 0 ⇒ <i>y</i> = −(0)² = 0 ⇒</span> punto crítico <span class="math-text"><i>P</i>₁(0, 0)</span>.<br>
        - Si <span class="math-text"><i>x</i> = 1 ⇒ <i>y</i> = −(1)² = −1 ⇒</span> punto crítico <span class="math-text"><i>P</i>₂(1, −1)</span>.<br>
        2) <strong>Segundas derivadas y discriminante:</strong><br>
        <span class="math-text"><i>f<sub>xx</sub></i> = 6<i>x</i>, &nbsp;&nbsp; <i>f<sub>yy</sub></i> = −6<i>y</i>, &nbsp;&nbsp; <i>f<sub>xy</sub></i> = 3</span>.<br>
        <span class="math-text"><i>D</i>(<i>x</i>, <i>y</i>) = (6<i>x</i>)(−6<i>y</i>) − 3² = −36<i>xy</i> − 9</span>.<br>
        3) <strong>Clasificación:</strong><br>
        • En <span class="math-text"><i>P</i>₁(0, 0)</span>: <span class="math-text"><i>D</i>(0, 0) = −36(0)(0) − 9 = −9 &lt; 0</span>.<br>
        Por tanto, <span class="math-text">(0, 0)</span> es un <strong>punto de silla</strong> con valor <span class="math-text"><i>f</i>(0, 0) = 0</span>.<br>
        • En <span class="math-text"><i>P</i>₂(1, −1)</span>: <span class="math-text"><i>D</i>(1, −1) = −36(1)(−1) − 9 = 36 − 9 = 27 &gt; 0</span>.<br>
        Como <span class="math-text"><i>D</i> &gt; 0</span> y <span class="math-text"><i>f<sub>xx</sub></i>(1, −1) = 6(1) = 6 &gt; 0</span>, en <span class="math-text">(1, −1)</span> hay un <strong>mínimo relativo</strong>.<br>
        Valor mínimo: <span class="math-text"><i>f</i>(1, −1) = 1³ + 3(1)(−1) − (−1)³ = 1 − 3 + 1 = −1</span>.</p>

        <p><strong>Ejercicio 3: Identificación analítica de punto de silla (Propuesto 1.ii de Semana 05, pág. 30)</strong><br>
        Determinar los extremos relativos de la superficie hiperbólica:<br>
        <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = <i>x</i>² − <i>y</i>² + 2<i>x</i> − 4<i>y</i> − 2</span>.<br>
        • <em>Solución explicada:</em><br>
        1) <strong>Punto crítico:</strong><br>
        <span class="math-text"><i>f<sub>x</sub></i> = 2<i>x</i> + 2 = 0 ⇒ <i>x</i> = −1</span>.<br>
        <span class="math-text"><i>f<sub>y</sub></i> = −2<i>y</i> − 4 = 0 ⇒ <i>y</i> = −2</span>.<br>
        Punto crítico: <span class="math-text"><i>P</i>₀(−1, −2)</span>.<br>
        2) <strong>Segundas derivadas y discriminante:</strong><br>
        <span class="math-text"><i>f<sub>xx</sub></i> = 2, &nbsp;&nbsp; <i>f<sub>yy</sub></i> = −2, &nbsp;&nbsp; <i>f<sub>xy</sub></i> = 0</span>.<br>
        <span class="math-text"><i>D</i> = (2)(−2) − 0² = −4 &lt; 0</span>.<br>
        Al ser el discriminante estrictamente negativo (<span class="math-text"><i>D</i> &lt; 0</span>), se concluye de forma concluyente que en <span class="math-text">(−1, −2)</span> la superficie presenta un <strong>punto de silla</strong> (la función no posee ningún extremo relativo).<br>
        Valor en el punto de silla: <span class="math-text"><i>f</i>(−1, −2) = (−1)² − (−2)² + 2(−1) − 4(−2) − 2 = 1 − 4 − 2 + 8 − 2 = 1</span>.</p>

        <p><strong>Ejercicio 4: Optimización restringida con restricción lineal (Propuesto 10.i de Semana 05, pág. 31)</strong><br>
        Optimizar la función cóncava <span class="math-text"><i>f</i>(<i>x</i>, <i>y</i>) = 25 − <i>x</i>² − <i>y</i>²</span> sujeta a la condición lineal <span class="math-text">2<i>x</i> + <i>y</i> = 4</span>.<br>
        • <em>Solución paso a paso:</em><br>
        1) <strong>Función de Lagrange:</strong><br>
        <span class="math-text"><i>F</i>(<i>x</i>, <i>y</i>, <i>λ</i>) = 25 − <i>x</i>² − <i>y</i>² + <i>λ</i>(2<i>x</i> + <i>y</i> − 4)</span>.<br>
        2) <strong>Sistema de derivadas parciales:</strong><br>
        (1) <span class="math-text"><i>F<sub>x</sub></i> = −2<i>x</i> + 2<i>λ</i> = 0 ⇒ <i>λ</i> = <i>x</i></span>.<br>
        (2) <span class="math-text"><i>F<sub>y</sub></i> = −2<i>y</i> + <i>λ</i> = 0 ⇒ <i>λ</i> = 2<i>y</i></span>.<br>
        (3) <span class="math-text"><i>F<sub>λ</sub></i> = 2<i>x</i> + <i>y</i> − 4 = 0 ⇒ 2<i>x</i> + <i>y</i> = 4</span>.<br>
        3) <strong>Resolución del sistema:</strong><br>
        Igualando los valores de <span class="math-text"><i>λ</i></span>: <span class="math-text"><i>x</i> = 2<i>y</i></span>.<br>
        Sustituyendo en la restricción lineal:<br>
        <span class="math-text">2(2<i>y</i>) + <i>y</i> = 4 ⇒ 5<i>y</i> = 4 ⇒ <i>y</i> = <span class="math-fraction"><span>4</span><span>5</span></span></span>.<br>
        Entonces: <span class="math-text"><i>x</i> = 2(<span class="math-fraction"><span>4</span><span>5</span></span>) = <span class="math-fraction"><span>8</span><span>5</span></span></span> y <span class="math-text"><i>λ</i> = <span class="math-fraction"><span>8</span><span>5</span></span></span>.<br>
        4) <strong>Clasificación y valor extremo condicionado:</strong><br>
        Geométricamente, la superficie <span class="math-text"><i>z</i> = 25 − (<i>x</i>² + <i>y</i>²)</span> es un paraboloide circular cóncavo hacia abajo con vértice en <span class="math-text">(0, 0, 25)</span>. Su intersección con el plano vertical <span class="math-text">2<i>x</i> + <i>y</i> = 4</span> es una parábola orientada hacia abajo, lo que garantiza que el único punto crítico corresponde a un <strong>máximo condicionado</strong>.<br>
        Evaluamos el valor óptimo:<br>
        <span class="math-text"><i>f</i>(<span class="math-fraction"><span>8</span><span>5</span></span>, <span class="math-fraction"><span>4</span><span>5</span></span>) = 25 − (<span class="math-fraction"><span>8</span><span>5</span></span>)² − (<span class="math-fraction"><span>4</span><span>5</span></span>)² = 25 − <span class="math-fraction"><span>64</span><span>25</span></span> − <span class="math-fraction"><span>16</span><span>25</span></span> = 25 − <span class="math-fraction"><span>80</span><span>25</span></span> = 25 − <span class="math-fraction"><span>16</span><span>5</span></span> = <span class="math-fraction"><span>125 − 16</span><span>5</span></span> = <span class="math-fraction"><span>109</span><span>5</span></span> = 21.8</span>.<br>
        Por consiguiente, la función alcanza un máximo de <span class="math-text">21.8</span> en el punto <span class="math-text">(<span class="math-fraction"><span>8</span><span>5</span></span>, <span class="math-fraction"><span>4</span><span>5</span></span>)</span>, en rigurosa concordancia con la clave oficial del profesor David Chávez (pág. 33).</p>`
    }
  ];

  if (document.body.dataset.studyNavigation === 'index') {
    const topicsList = document.getElementById('topics');
    if (!topicsList) return;

    lessons.forEach((lesson, index) => {
      const source = new DOMParser().parseFromString(lesson.content || '', 'text/html');
      const paragraphs = [...source.querySelectorAll('p')]
        .map(paragraph => paragraph.textContent.replace(/\s+/g, ' ').trim())
        .filter(text => text.length > 30);
      const description = paragraphs[0] || lesson.title;
      const sectionNames = [...source.querySelectorAll('h2, h3')]
        .map(heading => heading.textContent.replace(/\s+/g, ' ').trim())
        .filter((name, position, names) => name && name.toLowerCase() !== lesson.title.toLowerCase() && names.indexOf(name) === position)
        .slice(0, 4);

      const card = document.createElement('li');
      card.className = 'academic-card academic-card-vectorial';
      const top = document.createElement('div');
      top.className = 'academic-card-top';
      const titleGroup = document.createElement('div');
      titleGroup.className = 'academic-card-title';
      const number = document.createElement('span');
      number.textContent = `TEMA ${String(index + 1).padStart(2, '0')}`;
      const title = document.createElement('h3');
      title.textContent = lesson.title;
      titleGroup.append(number, title);
      top.append(titleGroup);

      const summary = document.createElement('p');
      summary.className = 'academic-index-description';
      const excerpt = description.length > 175 ? `${description.slice(0, 172).trimEnd()}\u2026` : description;
      summary.textContent = excerpt;

      const tags = document.createElement('div');
      tags.className = 'academic-tags';
      sectionNames.forEach(name => {
        const tag = document.createElement('span');
        tag.textContent = name.length > 34 ? `${name.slice(0, 31).trimEnd()}\u2026` : name;
        if (tag.textContent !== name) tag.title = name;
        tags.append(tag);
      });

      const footer = document.createElement('div');
      footer.className = 'academic-card-footer';
      const status = document.createElement('span');
      status.className = 'academic-status academic-status-active';
      const indicator = document.createElement('i');
      indicator.setAttribute('aria-hidden', 'true');
      status.append(indicator, document.createTextNode(' DISPONIBLE'));
      const link = document.createElement('a');
      link.className = 'academic-link';
      link.href = `tema-${index + 1}/`;
      link.setAttribute('aria-label', `Estudiar tema ${index + 1}: ${lesson.title}`);
      link.append(document.createTextNode('Estudiar tema'));
      const arrow = document.createElement('span');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '\u2192';
      link.append(arrow);
      footer.append(status, link);
      card.append(top, summary, tags, footer);
      topicsList.append(card);
    });
    return;
  }

  const separateLessonPages = document.body.dataset.studyNavigation === 'pages';
  const routeLessonIndex = Number(document.body.dataset.lessonIndex);
  const validRouteLessonIndex = Number.isInteger(routeLessonIndex) && routeLessonIndex >= 1 && routeLessonIndex <= lessons.length;
  const topicsList = document.getElementById('topics');
  const lessonContent = document.getElementById('lesson-content');
  const lessonTitle = document.getElementById('lesson-title');
  const lessonOutline = document.getElementById('lesson-outline');
  const lessonSectionLinks = document.getElementById('lesson-section-links');
  const position = document.getElementById('lesson-position');
  const previousButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');

  if ((!topicsList && !separateLessonPages) || !lessonContent || !lessonTitle || !position || !previousButton || !nextButton) return;

  let currentIndex = separateLessonPages && validRouteLessonIndex ? routeLessonIndex - 1 : 0;

  function placeholderContent(title) {
    return `<span class="lesson-sample-label">Contenido de ejemplo</span>
      <h2>${title}</h2>
      <p>Aquí va la introducción del tema: una o dos frases que expliquen qué se estudia y por qué importa dentro de la unidad.</p>
      <div class="lesson-definition"><div class="lesson-definition-title"><strong>Definición formal</strong></div><p>Aquí va la definición o el resultado principal del tema.</p></div>
      <h3>Idea principal</h3><p>Explicación del concepto con tus propias palabras y los datos del informe.</p>
      <h3>Ejemplo resuelto</h3><p>Paso a paso de un ejercicio representativo.</p>
      <h3>Interpretación geométrica</h3><p>Qué significa el resultado visualmente.</p>`;
  }

  function buildLessonOutline() {
    if (!lessonOutline || !lessonSectionLinks) return;
    const headings = [...lessonContent.querySelectorAll('h2, h3')];
    lessonSectionLinks.replaceChildren();
    headings.forEach((heading, index) => {
      heading.id = `u1-tema-${currentIndex + 1}-seccion-${index + 1}`;
      heading.classList.add('lesson-anchor-heading');
      const item = document.createElement('li');
      if (heading.tagName === 'H3') item.className = 'lesson-outline-subsection';
      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent.trim();
      item.append(link);
      lessonSectionLinks.append(item);
    });
    lessonOutline.hidden = headings.length < 2;
    const summary = lessonOutline.querySelector('summary');
    if (summary && headings.length >= 2) summary.setAttribute('aria-label', `Secciones de esta lección, ${headings.length} enlaces`);
  }

  function enhanceExamples() {
    const examples = [...lessonContent.querySelectorAll('h3')]
      .filter(heading => /\bejemplos?\b/i.test(heading.textContent));
    examples.forEach(heading => {
      if (heading.closest('.lesson-example')) return;
      const wrapper = document.createElement('section');
      wrapper.className = 'lesson-example';
      heading.parentNode.insertBefore(wrapper, heading);
      wrapper.append(heading);
      let sibling = wrapper.nextElementSibling;
      while (sibling && !sibling.matches('h2, h3') && !sibling.querySelector('h2, h3')) {
        const nextSibling = sibling.nextElementSibling;
        wrapper.append(sibling);
        sibling = nextSibling;
      }
    });
  }

  function enhanceExercises() {
    const headings = [...lessonContent.querySelectorAll('h2, h3')];
    const paragraphs = [...lessonContent.querySelectorAll('p')];
    paragraphs.forEach(paragraph => {
      const solutionLabel = [...paragraph.querySelectorAll('em')].find(label => /soluci[oó]n/i.test(label.textContent));
      if (!solutionLabel) return;

      const precedingHeadings = headings.filter(heading => heading.compareDocumentPosition(paragraph) & Node.DOCUMENT_POSITION_FOLLOWING);
      const precedingHeading = precedingHeadings[precedingHeadings.length - 1];
      const exerciseTitle = paragraph.querySelector('strong')?.textContent.trim() || '';
      const isExercise = /^ejercicio\s*\d*/i.test(exerciseTitle) || /ejercicios?/i.test(precedingHeading?.textContent || '');
      if (!isExercise) return;

      const card = document.createElement('div');
      card.className = 'study-exercise';
      paragraph.classList.add('study-exercise-prompt');
      paragraph.parentNode.insertBefore(card, paragraph);
      card.append(paragraph);

      const disclosure = document.createElement('details');
      disclosure.className = 'study-exercise-solution';
      const summary = document.createElement('summary');
      const bulletText = solutionLabel.previousSibling;
      let node = solutionLabel.nextSibling;
      if (bulletText?.nodeType === Node.TEXT_NODE && /•\s*$/.test(bulletText.textContent)) {
        bulletText.textContent = bulletText.textContent.replace(/•\s*$/, '');
        summary.append(document.createTextNode('• '));
      }
      summary.append(solutionLabel);
      const solutionBody = document.createElement('div');
      solutionBody.className = 'study-exercise-solution-body';
      while (node) {
        const nextNode = node.nextSibling;
        solutionBody.append(node);
        node = nextNode;
      }
      disclosure.append(summary, solutionBody);
      card.append(disclosure);
    });

    lessonContent.querySelectorAll('p').forEach(paragraph => {
      if (paragraph.closest('.study-exercise, .lesson-definition')) return;
      const text = paragraph.textContent.trim();
      const wordCount = (text.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{3,}/g) || []).length;
      if (text.length <= 170 && wordCount <= 4 && paragraph.querySelector('.math-text') && !paragraph.querySelector('strong, em')) {
        paragraph.classList.add('lesson-equation');
      }
    });
  }

  function render() {
    const lesson = lessons[currentIndex];
    lessonTitle.textContent = lesson.title;
    lessonContent.innerHTML = lesson.content || placeholderContent(lesson.title);
    if (separateLessonPages) {
      document.title = `Tema ${String(currentIndex + 1).padStart(2, '0')} · ${lesson.title} | Unidad 01 · MathVerse II`;
      buildLessonOutline();
      enhanceExamples();
      enhanceExercises();
    }
    position.textContent = `Tema ${currentIndex + 1} de ${lessons.length}`;
    if (separateLessonPages) {
      const updatePagerLink = (link, destination) => {
        const unavailable = destination < 0 || destination >= lessons.length;
        link.setAttribute('aria-disabled', String(unavailable));
        if (unavailable) {
          link.removeAttribute('href');
          link.setAttribute('tabindex', '-1');
        } else {
          link.href = `../tema-${destination + 1}/`;
          link.removeAttribute('tabindex');
        }
      };
      updatePagerLink(previousButton, currentIndex - 1);
      updatePagerLink(nextButton, currentIndex + 1);
    } else {
      previousButton.disabled = currentIndex === 0;
      nextButton.disabled = currentIndex === lessons.length - 1;
    }
  }
  if (!separateLessonPages) {
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
  }

  render();
})();
