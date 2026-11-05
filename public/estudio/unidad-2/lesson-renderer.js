(() => {
  'use strict';

  const lessons = window.mathverseUnit2Lessons;
  const navigation = document.body.dataset.studyNavigation;
  if (!Array.isArray(lessons) || !['index', 'pages'].includes(navigation)) return;

  if (navigation === 'index') {
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

  const lessonIndex = Number(document.body.dataset.lessonIndex);
  if (!Number.isInteger(lessonIndex) || lessonIndex < 1 || lessonIndex > lessons.length) return;
  const currentIndex = lessonIndex - 1;
  const lessonContent = document.getElementById('lesson-content');
  const lessonTitle = document.getElementById('lesson-title');
  const lessonOutline = document.getElementById('lesson-outline');
  const lessonSectionLinks = document.getElementById('lesson-section-links');
  const position = document.getElementById('lesson-position');
  const previousButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');
  if (!lessonContent || !lessonTitle || !position || !previousButton || !nextButton) return;

  const lesson = lessons[currentIndex];
  lessonTitle.textContent = lesson.title;
  lessonContent.innerHTML = lesson.content;
  position.textContent = `Tema ${lessonIndex} de ${lessons.length}`;
  document.title = `Tema ${String(lessonIndex).padStart(2, '0')} · ${lesson.title} | Unidad 02 · MathVerse II`;

  function updatePagerLink(link, destination) {
    const unavailable = destination < 0 || destination >= lessons.length;
    link.setAttribute('aria-disabled', String(unavailable));
    if (unavailable) {
      link.removeAttribute('href');
      link.setAttribute('tabindex', '-1');
    } else {
      link.href = `../tema-${destination + 1}/`;
    }
  }
  updatePagerLink(previousButton, currentIndex - 1);
  updatePagerLink(nextButton, currentIndex + 1);

  function buildLessonOutline() {
    if (!lessonOutline || !lessonSectionLinks) return;
    const headings = [...lessonContent.querySelectorAll('h2, h3')];
    lessonSectionLinks.replaceChildren();
    headings.forEach((heading, index) => {
      heading.id = `u2-tema-${lessonIndex}-seccion-${index + 1}`;
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
    [...lessonContent.querySelectorAll('p')].forEach(paragraph => {
      const solutionLabel = [...paragraph.querySelectorAll('em')].find(label => /soluci[oó]n/i.test(label.textContent));
      if (!solutionLabel) return;
      const precedingHeadings = headings.filter(heading => heading.compareDocumentPosition(paragraph) & Node.DOCUMENT_POSITION_FOLLOWING);
      const precedingHeading = precedingHeadings[precedingHeadings.length - 1];
      const exerciseTitle = paragraph.querySelector('strong')?.textContent.trim() || '';
      if (!/^ejercicio\s*\d*/i.test(exerciseTitle) && !/ejercicios?/i.test(precedingHeading?.textContent || '')) return;

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

  buildLessonOutline();
  enhanceExamples();
  enhanceExercises();
})();
