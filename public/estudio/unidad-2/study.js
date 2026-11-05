(() => {
  'use strict';

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

  // Desarrollo basado en Semana 06, pp. 4-7. Ejemplos didácticos propios.
  // Semana 07 introduce cambio de variables, reservado para lecciones posteriores.
  const lessons = [
    {
      title: 'Integral doble y sumas de Riemann',
      content: `
        <h2>Integral doble y sumas de Riemann</h2>
        <p>Una integral doble acumula los valores de una función de dos variables sobre una región del plano. Si <span class="math-text">z = f(x, y) ≥ 0</span> representa una altura, la integral calcula el volumen entre la superficie y la región que le sirve de base.</p>
        <p><strong>Objetivo:</strong> construir una suma de Riemann, interpretar cada factor y comprender cómo su límite define una integral doble.</p>

        <h3>De una región a pequeños prismas</h3>
        <p>Consideremos el rectángulo <span class="math-text">R = [a, b] × [c, d]</span>. Dividimos el intervalo de <i>x</i> en <i>m</i> partes y el de <i>y</i> en <i>n</i> partes. Una partición uniforme produce <span class="math-text">m · n</span> celdas rectangulares:</p>
        <p class="math-text">Δx = (b − a)/m, &nbsp; Δy = (d − c)/n,<br>ΔA = Δx · Δy.</p>
        <p>En cada celda <span class="math-text">R<sub>ij</sub></span> elegimos un punto de muestra <span class="math-text">(x*<sub>ij</sub>, y*<sub>ij</sub>)</span>. El producto <span class="math-text">f(x*<sub>ij</sub>, y*<sub>ij</sub>) ΔA<sub>ij</sub></span> es «altura por área de la base»: aproxima el volumen de una columna cuando la función es no negativa.</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Suma de Riemann e integral doble</strong></div>
          <p class="math-text">S(P) = ∑<sub>i=1</sub><sup>m</sup> ∑<sub>j=1</sub><sup>n</sup> f(x*<sub>ij</sub>, y*<sub>ij</sub>) ΔA<sub>ij</sub></p>
          <p class="math-text">∬<sub>R</sub> f(x, y) dA = <span class="math-limit">lim<sub>‖P‖ → 0</sub></span> S(P).</p>
          <p>La norma <span class="math-text">‖P‖</span> es la mayor diagonal de las celdas de la partición. La integral existe si las sumas convergen al mismo número al hacer <span class="math-text">‖P‖ → 0</span>, independientemente de la partición y de los puntos de muestra elegidos.</p>
        </div>
        <p>En lenguaje preciso: para cada <span class="math-text">ε &gt; 0</span> debe existir <span class="math-text">δ &gt; 0</span> tal que <span class="math-text">|S(P) − I| &lt; ε</span> para toda partición con <span class="math-text">‖P‖ &lt; δ</span> y toda elección de muestras. Entonces <span class="math-text">I = ∬<sub>R</sub> f dA</span>. Una función continua en un rectángulo cerrado es integrable.</p>
        <p><strong>No basta con añadir celdas:</strong> sus tamaños deben disminuir en ambas direcciones. En particiones no uniformes, cada celda tiene su propia área <span class="math-text">ΔA<sub>ij</sub></span>.</p>

        <h3>Ejemplo resuelto: una malla de 2 × 2</h3>
        <p>Aproximemos la integral de <span class="math-text">f(x, y) = x + y</span> sobre <span class="math-text">R = [0, 2] × [0, 1]</span>, tomando la esquina superior derecha de cada celda.</p>
        <p><strong>1. Calcular las dimensiones.</strong><br><span class="math-text">Δx = 2/2 = 1, &nbsp; Δy = 1/2, &nbsp; ΔA = 1/2.</span></p>
        <p><strong>2. Evaluar las cuatro alturas.</strong><br><span class="math-text">f(1, 1/2) = 3/2, &nbsp; f(1, 1) = 2,<br>f(2, 1/2) = 5/2, &nbsp; f(2, 1) = 3.</span></p>
        <p><strong>3. Multiplicar por el área y sumar.</strong><br><span class="math-text">S = (3/2 + 2 + 5/2 + 3) · 1/2 = 9/2 = 4.5.</span><br>Como la función crece con ambas variables, estas esquinas proporcionan las alturas máximas de las celdas: la aproximación sobreestima la integral.</p>
        <p><strong>4. Refinar y obtener el límite.</strong><br>En una malla uniforme de <span class="math-text">m × n</span>, las mismas esquinas son <span class="math-text">(2i/m, j/n)</span> y <span class="math-text">ΔA = 2/(mn)</span>. Usando <span class="math-text">∑<sub>i=1</sub><sup>m</sup> i = m(m + 1)/2</span>:</p>
        <p class="math-text">S<sub>m,n</sub> = ∑<sub>i=1</sub><sup>m</sup> ∑<sub>j=1</sub><sup>n</sup> (2i/m + j/n) · 2/(mn)<br>= 2(m + 1)/m + (n + 1)/n<br>= 3 + 2/m + 1/n.</p>
        <p>Cuando <span class="math-text">m, n → ∞</span>, los términos de error desaparecen. Por tanto, <strong>la integral vale 3</strong>. Con una malla de <span class="math-text">4 × 4</span> la suma es <span class="math-text">3.75</span>, más cercana al límite que <span class="math-text">4.5</span>.</p>
        <p><strong>Otra elección de muestras.</strong> Los puntos medios de las cuatro celdas dan las alturas <span class="math-text">3/4, 5/4, 7/4, 9/4</span>. Su suma por <span class="math-text">ΔA = 1/2</span> vale exactamente <span class="math-text">3</span>. Esta coincidencia se debe a que la función es afín; no ocurre con cualquier función.</p>

        <h3>Interpretación y propiedades básicas</h3>
        <p>Si <span class="math-text">f ≥ 0</span>, la integral es un volumen. Si cambia de signo, representa una acumulación con signo; el volumen geométrico entre la gráfica y el plano se obtiene integrando <span class="math-text">|f|</span>. Cuando <span class="math-text">f = 1</span>, la integral devuelve el área de la región.</p>
        <p><strong>Linealidad:</strong> <span class="math-text">∬<sub>R</sub> (αf + βg) dA = α ∬<sub>R</sub> f dA + β ∬<sub>R</sub> g dA</span>, para funciones integrables y constantes <span class="math-text">α, β</span>.</p>
        <p><strong>Aditividad:</strong> si dividimos una región en dos subregiones con interiores disjuntos y frontera común de área nula, la integral total es la suma de las integrales sobre ambas partes.</p>
        <p><strong>Control del resultado:</strong> si <span class="math-text">L ≤ f ≤ U</span>, entonces <span class="math-text">L · área(R) ≤ ∬<sub>R</sub> f dA ≤ U · área(R)</span>. Las unidades son las de <i>f</i> multiplicadas por las del área.</p>

        <h3>Práctica con solución</h3>
        <p><strong>1.</strong> Para <span class="math-text">f(x, y) = 5</span> en <span class="math-text">[0, 2] × [0, 3]</span>, calcula una suma de Riemann con cualquier partición y deduce la integral.</p>
        <details><summary>Ver solución del ejercicio 1</summary><p>Todas las alturas valen 5. La suma de las áreas de las celdas es el área del rectángulo: <span class="math-text">2 · 3 = 6</span>. Por tanto, cualquier suma vale <span class="math-text">5 · 6 = 30</span> y su límite también es <strong>30</strong>.</p></details>
        <p><strong>2.</strong> Para <span class="math-text">f(x, y) = xy</span> en el cuadrado unidad, usa una malla de <span class="math-text">2 × 2</span> con puntos medios. Compara con las esquinas superiores derechas.</p>
        <details><summary>Ver solución del ejercicio 2</summary><p>Cada celda tiene área <span class="math-text">1/4</span>. En los puntos medios, las alturas son <span class="math-text">1/16, 3/16, 3/16, 9/16</span>: la suma ponderada es <span class="math-text">(16/16) · 1/4 = 1/4</span>. En las esquinas, las alturas son <span class="math-text">1/4, 1/2, 1/2, 1</span>: la aproximación es <span class="math-text">(9/4) · 1/4 = 9/16</span>. Ambas son sumas válidas; una suma finita no es, por definición, el límite.</p></details>

        <h3>Antes de continuar</h3>
        <p>Comprueba que puedes distinguir <span class="math-text">f(x*, y*)</span> (altura), <span class="math-text">ΔA</span> (área) y su producto (aporte). No olvides multiplicar por el área, ni confundas una aproximación con el valor exacto. La siguiente lección permite calcular ese valor mediante integrales de una variable.</p>
        <p class="study-content-note">Fuente: Semana 06, pp. 4–5, definición de integral doble y propiedades. Ejemplos y ejercicios desarrollados para esta lección.</p>`
    },
    {
      title: 'Teorema de Fubini',
      content: `
        <h2>Teorema de Fubini</h2>
        <p>Las sumas de Riemann definen la integral doble. El teorema de Fubini permite calcularla mediante dos integrales de una variable, llamadas <strong>integrales iteradas</strong>. Integramos primero en una dirección y después acumulamos el resultado en la otra.</p>
        <p><strong>Objetivo:</strong> reconocer cuándo aplicar el teorema, leer el orden de los diferenciales y evaluar integrales iteradas sobre rectángulos y regiones simples.</p>

        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Fubini para funciones continuas en un rectángulo</strong></div>
          <p>Si <span class="math-text">f</span> es continua en <span class="math-text">R = [a, b] × [c, d]</span>, entonces:</p>
          <p class="math-text">∬<sub>R</sub> f(x, y) dA<br>= ∫<sub>a</sub><sup>b</sup> [∫<sub>c</sub><sup>d</sup> f(x, y) dy] dx<br>= ∫<sub>c</sub><sup>d</sup> [∫<sub>a</sub><sup>b</sup> f(x, y) dx] dy.</p>
          <p>Ambos órdenes dan el mismo valor. La continuidad sobre el rectángulo cerrado es una condición suficiente; no se debe intercambiar el orden de una integral impropia sin comprobar sus condiciones de convergencia.</p>
        </div>

        <h3>Cómo leer una integral iterada</h3>
        <p>En <span class="math-text">∫<sub>a</sub><sup>b</sup> [∫<sub>c</sub><sup>d</sup> f(x, y) dy] dx</span>, el diferencial <span class="math-text">dy</span> indica que primero integramos respecto de <i>y</i>, tratando <i>x</i> como constante. Sustituimos los límites interiores; el resultado depende solo de <i>x</i>. Finalmente integramos respecto de <i>x</i> y evaluamos sus límites.</p>
        <p>Geométricamente, la integral interior suma una sección de la superficie y la exterior acumula esas secciones a lo largo de la región. Si la función es no negativa, esta acumulación produce un volumen.</p>

        <h3>Ejemplo 1: comprobar los dos órdenes</h3>
        <p>Calcular <span class="math-text">I = ∬<sub>R</sub> (x + 2y) dA</span> para <span class="math-text">R = [0, 2] × [0, 1]</span>. La función es un polinomio, por lo que es continua y podemos aplicar Fubini.</p>
        <p><strong>Orden dy dx: primero y.</strong><br><span class="math-text">I = ∫<sub>0</sub><sup>2</sup> [∫<sub>0</sub><sup>1</sup> (x + 2y) dy] dx.</span><br>Al integrar respecto de <i>y</i>, <i>x</i> es constante:</p>
        <p class="math-text">∫<sub>0</sub><sup>1</sup> (x + 2y) dy = [xy + y²]<sub>y=0</sub><sup>y=1</sup> = x + 1.<br>I = ∫<sub>0</sub><sup>2</sup> (x + 1) dx = [x²/2 + x]<sub>0</sub><sup>2</sup> = 4.</p>
        <p><strong>Orden dx dy: primero x.</strong><br><span class="math-text">I = ∫<sub>0</sub><sup>1</sup> [∫<sub>0</sub><sup>2</sup> (x + 2y) dx] dy.</span><br>Ahora <i>y</i> se trata como constante:</p>
        <p class="math-text">∫<sub>0</sub><sup>2</sup> (x + 2y) dx = [x²/2 + 2xy]<sub>x=0</sub><sup>x=2</sup> = 2 + 4y.<br>I = ∫<sub>0</sub><sup>1</sup> (2 + 4y) dy = [2y + 2y²]<sub>0</sub><sup>1</sup> = 4.</p>
        <p>Los dos cálculos coinciden. Como <span class="math-text">x + 2y ≥ 0</span> en <i>R</i>, el resultado es un volumen de <strong>4 unidades cúbicas</strong> si las tres coordenadas se miden en la misma unidad de longitud.</p>

        <h3>Regiones vertical y horizontalmente simples</h3>
        <p>Según Semana 06, p. 6, también podemos evaluar por integrales iteradas sobre regiones simples. Suponemos que las funciones de frontera son continuas y que <span class="math-text">f</span> es continua en la región cerrada.</p>
        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Región verticalmente simple</strong></div>
          <p class="math-text">R = {(x, y): a ≤ x ≤ b, g₁(x) ≤ y ≤ g₂(x)}.</p>
          <p class="math-text">∬<sub>R</sub> f dA = ∫<sub>a</sub><sup>b</sup> [∫<sub>g₁(x)</sub><sup>g₂(x)</sup> f(x, y) dy] dx.</p>
          <p>Para cada <i>x</i> fijo, recorremos la región de abajo hacia arriba. Los límites interiores de <i>y</i> pueden depender de <i>x</i>.</p>
        </div>
        <div class="lesson-definition">
          <div class="lesson-definition-title"><strong>Región horizontalmente simple</strong></div>
          <p class="math-text">R = {(x, y): c ≤ y ≤ d, h₁(y) ≤ x ≤ h₂(y)}.</p>
          <p class="math-text">∬<sub>R</sub> f dA = ∫<sub>c</sub><sup>d</sup> [∫<sub>h₁(y)</sub><sup>h₂(y)</sup> f(x, y) dx] dy.</p>
          <p>Para cada <i>y</i> fijo, recorremos la región de izquierda a derecha. Los límites interiores de <i>x</i> pueden depender de <i>y</i>.</p>
        </div>

        <h3>Ejemplo 2: una región triangular</h3>
        <p>Calcular la integral de <span class="math-text">f(x, y) = x + y</span> sobre el triángulo de vértices <span class="math-text">(0, 0), (1, 0), (1, 1)</span>.</p>
        <p><strong>1. Describir la región.</strong> Sus fronteras son <span class="math-text">y = 0, y = x, x = 1</span>. Con franjas verticales, <span class="math-text">0 ≤ x ≤ 1</span> y <span class="math-text">0 ≤ y ≤ x</span>.</p>
        <p><strong>2. Integrar de adentro hacia afuera.</strong></p>
        <p class="math-text">I = ∫<sub>0</sub><sup>1</sup> [∫<sub>0</sub><sup>x</sup> (x + y) dy] dx<br>= ∫<sub>0</sub><sup>1</sup> [xy + y²/2]<sub>y=0</sub><sup>y=x</sup> dx<br>= ∫<sub>0</sub><sup>1</sup> 3x²/2 dx = [x³/2]<sub>0</sub><sup>1</sup> = 1/2.</p>
        <p><strong>3. Verificar con franjas horizontales.</strong> La misma región se describe como <span class="math-text">0 ≤ y ≤ 1, y ≤ x ≤ 1</span>. Hay que cambiar los límites además de los diferenciales:</p>
        <p class="math-text">I = ∫<sub>0</sub><sup>1</sup> [∫<sub>y</sub><sup>1</sup> (x + y) dx] dy<br>= ∫<sub>0</sub><sup>1</sup> (1/2 + y − 3y²/2) dy<br>= [y/2 + y²/2 − y³/2]<sub>0</sub><sup>1</sup> = 1/2.</p>

        <h3>Errores que conviene evitar</h3>
        <p><strong>Integrar ambas variables a la vez:</strong> en la integral interior solo cambia la variable de su diferencial. Por ejemplo, respecto de <i>y</i>, la primitiva de <span class="math-text">x</span> es <span class="math-text">xy</span>.</p>
        <p><strong>Intercambiar dy dx sin describir de nuevo la región:</strong> en un triángulo los límites no se conservan como en un rectángulo. Primero identifica las fronteras y la proyección sobre el eje de la variable exterior.</p>
        <p><strong>Separar cualquier integrando en un producto:</strong> la identidad <span class="math-text">∬<sub>R</sub> g(x)h(y) dA = (∫<sub>a</sub><sup>b</sup> g(x) dx)(∫<sub>c</sub><sup>d</sup> h(y) dy)</span> se aplica aquí a un producto separable sobre un rectángulo y con funciones continuas. No permite convertir una suma o una región arbitraria en ese producto.</p>

        <h3>Práctica con solución</h3>
        <p><strong>1.</strong> Evalúa <span class="math-text">∬<sub>R</sub> xy dA</span> para <span class="math-text">R = [0, 2] × [0, 3]</span>, integrando primero en <i>y</i>.</p>
        <details><summary>Ver solución del ejercicio 1</summary><p class="math-text">∫<sub>0</sub><sup>3</sup> xy dy = [xy²/2]<sub>y=0</sub><sup>y=3</sup> = 9x/2.<br>∫<sub>0</sub><sup>2</sup> 9x/2 dx = [9x²/4]<sub>0</sub><sup>2</sup> = 9.</p><p>También se verifica separando el producto: <span class="math-text">(∫<sub>0</sub><sup>2</sup> x dx)(∫<sub>0</sub><sup>3</sup> y dy) = 2 · 9/2 = 9</span>.</p></details>
        <p><strong>2.</strong> Usa una integral doble de la función <span class="math-text">1</span> para calcular el área del triángulo <span class="math-text">0 ≤ x ≤ 1, 0 ≤ y ≤ x</span>. Escribe ambos órdenes.</p>
        <details><summary>Ver solución del ejercicio 2</summary><p class="math-text">∫<sub>0</sub><sup>1</sup> [∫<sub>0</sub><sup>x</sup> 1 dy] dx = ∫<sub>0</sub><sup>1</sup> x dx = 1/2.<br>∫<sub>0</sub><sup>1</sup> [∫<sub>y</sub><sup>1</sup> 1 dx] dy = ∫<sub>0</sub><sup>1</sup> (1 − y) dy = 1/2.</p><p>Coincide con <span class="math-text">base · altura / 2 = 1 · 1 / 2</span>.</p></details>

        <h3>Antes de marcar la lección</h3>
        <p>Debes poder justificar las condiciones de Fubini, identificar la variable interior, evaluar sus límites y comprobar que el resultado final es un número. En una región simple, explica de dónde salen las dos fronteras interiores.</p>
        <p class="study-content-note">Fuente: Semana 06, pp. 6–7, evaluación de integrales dobles, regiones simples e integrales iteradas. Ejemplos y ejercicios desarrollados para esta lección. Semana 07 continúa con el cambio de variables, fuera del alcance de estas dos lecciones.</p>`
    }
  ];


  const storageKey = 'mathverse.study.unit2.completed.v1';
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
    progressTrack.setAttribute('aria-valuemax', String(lessons.length));
    progressTrack.setAttribute('aria-valuenow', String(count));
    progressFill.style.width = `${percent}%`;
    progressPercent.textContent = `${percent}% completado`;
  }

  function render() {
    const lesson = lessons[currentIndex];
    lessonCrumb.textContent = lesson.title;
    lessonContent.innerHTML = lesson.content;
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
