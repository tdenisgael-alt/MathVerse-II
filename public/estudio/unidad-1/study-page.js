(() => {
  'use strict';

  const body = document.body;
  const lessonIndex = Number(body.dataset.lessonIndex);
  if (!Number.isInteger(lessonIndex) || lessonIndex < 1 || lessonIndex > 10) return;

  body.classList.add('module-page', 'study-page');
  const root = document.createElement('div');
  root.id = 'lesson-page';
  root.innerHTML = `
    <a class="skip-link" href="#contenido">Saltar al contenido</a>
    <header class="site-header">
      <nav class="navbar container" aria-label="Navegación principal">
        <a class="brand" href="../../../" aria-label="MathVerse II, inicio">
          <span class="brand-mark" aria-hidden="true">M<span>²</span></span>
          <span>MATHVERSE <b>II</b></span>
        </a>
        <div class="study-nav">
          <a href="../../../#inicio">Inicio</a>
          <a href="../../../#que-es">¿Qué es?</a>
          <a href="../../#contenido-academico">Unidades</a>
          <a href="../../../calculadora/">Calculadora</a>
          <a href="../../../profesor/">Profesor virtual</a>
          <a class="study-nav-cta" href="../#temario">Estudio guiado <span aria-hidden="true">↗</span></a>
          <button class="study-theme-toggle" id="theme-toggle" type="button" aria-label="Cambiar al modo oscuro" aria-pressed="false"><span class="theme-icon" aria-hidden="true">☾</span><span id="theme-label">Modo oscuro</span></button>
        </div>
      </nav>
    </header>
    <main class="study-main container" id="contenido">
      <div class="study-heading lesson-page-heading">
        <p class="eyebrow">ESTUDIO / UNIDAD 01</p>
        <p class="lesson-unit-kicker">Tema ${String(lessonIndex).padStart(2, '0')} de 10</p>
        <h1 class="lesson-page-title" id="lesson-title"></h1>
        <a class="study-button study-button-secondary lesson-back-link" href="../#temario"><span aria-hidden="true">←</span> Volver a Unidad 1</a>
      </div>
      <div class="study-layout study-lesson-layout">
        <section class="study-center" aria-label="Lección">
          <article class="study-panel lesson-card">
            <nav class="study-crumbs" aria-label="Ruta de navegación">
              <a href="../../../">MathVerse II</a><span aria-hidden="true">›</span><a href="../#temario">Unidad 1</a>
            </nav>
            <nav class="lesson-outline" id="lesson-outline" aria-label="Secciones de la lección" hidden>
              <details open>
                <summary>Secciones de esta lección</summary>
                <ol id="lesson-section-links"></ol>
              </details>
            </nav>
            <div class="lesson-content" id="lesson-content" tabindex="-1" aria-live="polite"></div>
            <nav class="lesson-pager" aria-label="Navegar entre lecciones">
              <a class="study-button study-button-secondary" id="prev-button"><span aria-hidden="true">←</span> Tema anterior</a>
              <span id="lesson-position" aria-live="polite">Tema ${lessonIndex} de 10</span>
              <a class="study-button study-button-primary" id="next-button">Siguiente tema <span aria-hidden="true">→</span></a>
            </nav>
          </article>
        </section>
      </div>
    </main>
    <footer class="site-footer"><div class="container footer-bottom"><span>© 2026 MathVerse II</span><span>Universidad Nacional de Ingeniería · Ingeniería en Computación</span><a href="../../../">MATHVERSE II ↗</a></div></footer>`;
  body.append(root);

  ['style.css', 'modules.css', 'study-dark.css'].forEach(file => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `../../../css/${file}`;
    document.head.append(link);
  });
  const lessonStyles = document.createElement('link');
  lessonStyles.rel = 'stylesheet';
  lessonStyles.href = new URL('./lesson.css', document.currentScript.src).href;
  document.head.append(lessonStyles);

  const sharedStudy = document.createElement('script');
  sharedStudy.src = '../../../js/study.js';
  sharedStudy.onerror = () => {
    const message = document.createElement('p');
    message.setAttribute('role', 'alert');
    message.textContent = 'No se pudo cargar la lección. Vuelve a intentarlo o abre la página de Unidad 1.';
    root.querySelector('.lesson-content').replaceChildren(message);
  };
  document.body.append(sharedStudy);
})();
