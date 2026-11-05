/**
 * MathVerse II - Renderizador Compartido de Markdown y Matemáticas LaTeX
 * Soporta fórmulas display ($$...$$, \[...\]) e inline ($...$, \(...\)),
 * KaTeX con fallback semántico puro en JavaScript, sanitización anti-XSS
 * y adaptabilidad responsiva con scroll horizontal para móvil y escritorio.
 */

(() => {
  'use strict';

  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function upgradeRenderedMathWithKatex() {
    if (typeof document === 'undefined' || !window.katex || typeof window.katex.renderToString !== 'function') return;
    try {
      const nodes = document.querySelectorAll('[data-mv-tex]');
      nodes.forEach(el => {
        const tex = el.getAttribute('data-mv-tex');
        if (!tex) return;
        const isBlock = el.classList.contains('mv-math-block');
        try {
          const katexHtml = window.katex.renderToString(tex, {
            displayMode: isBlock,
            throwOnError: false
          });
          el.innerHTML = katexHtml;
        } catch (e) {}
      });
    } catch (e) {}
  }

  // Carga asíncrona no bloqueante de KaTeX para tipografía matemática de alta precisión
  if (typeof document !== 'undefined' && !window.katex && !document.querySelector('script[data-katex-loader]')) {
    const katexCss = document.createElement('link');
    katexCss.rel = 'stylesheet';
    katexCss.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    katexCss.setAttribute('data-katex-loader', 'true');
    document.head.appendChild(katexCss);

    const katexScript = document.createElement('script');
    katexScript.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
    katexScript.defer = true;
    katexScript.setAttribute('data-katex-loader', 'true');
    katexScript.onload = () => {
      upgradeRenderedMathWithKatex();
    };
    document.head.appendChild(katexScript);
  }

  function extractBalancedBraces(str, startIndex) {
    if (startIndex >= str.length || str[startIndex] !== '{') return null;
    let depth = 0;
    for (let i = startIndex; i < str.length; i++) {
      if (str[i] === '{') depth++;
      else if (str[i] === '}') {
        depth--;
        if (depth === 0) {
          return { content: str.slice(startIndex + 1, i), endIndex: i };
        }
      }
    }
    // Soporte para streaming/incompleto: si falta la llave de cierre en el chunk, toma el resto
    return { content: str.slice(startIndex + 1), endIndex: str.length - 1 };
  }

  /**
   * Sanitiza expresiones matemáticas contra inyección de HTML activo (XSS).
   * Neutraliza etiquetas y atributos ejecutables (<, >, ") en entidades seguras
   * para que jamás alcancen innerHTML como elementos DOM activos, preservando
   * simultáneamente la sintaxis matemática de LaTeX (desigualdades, matrices, etc.).
   */
  function sanitizeMathInput(tex) {
    if (typeof tex !== 'string') return '';
    return tex
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * Parser fallback en JavaScript puro para transformar expresiones LaTeX
   * en HTML semántico cuando KaTeX no está cargado o se encuentra fuera de línea.
   * Utiliza sanitización defensiva en el nivel de entrada y preserva etiquetas
   * semánticas generadas internamente mediante el parámetro isSanitized.
   */
  function parseFallbackMath(tex, isSanitized = false) {
    if (!tex) return '';
    let s = isSanitized ? tex.trim() : sanitizeMathInput(tex.trim());

    // 1. Textos y unidades físicas: \text{...}, \mathrm{...}, \operatorname{...}
    let textRegex = /\\(?:text|mathrm|operatorname)\s*\{/g;
    let textMatch;
    while ((textMatch = textRegex.exec(s)) !== null) {
      const braceStart = textMatch.index + textMatch[0].length - 1;
      const extracted = extractBalancedBraces(s, braceStart);
      if (extracted) {
        const before = s.slice(0, textMatch.index);
        const after = s.slice(extracted.endIndex + 1);
        const inner = escapeHtml(extracted.content);
        s = `${before}<span class="mv-math-unit">${inner}</span>${after}`;
        textRegex.lastIndex = textMatch.index + `<span class="mv-math-unit">${inner}</span>`.length;
      } else {
        break;
      }
    }

    // 2. Matrices: \begin{pmatrix|bmatrix|vmatrix|matrix} ... \end{...}
    // Delimitador de columnas '&' respetando entidades HTML ya escapadas (&lt;, &gt;, &quot;)
    const matrixColRegex = /(?<!\\)&(?!(?:lt|gt|amp|quot|apos|#\d+|#x[0-9a-fA-F]+);)/;
    s = s.replace(/\\begin\{(pmatrix|bmatrix|vmatrix|matrix)\}([\s\S]*?)(?:\\end\{\1\}|$)/g, (match, type, content) => {
      const rows = content.trim().split(/\\\\|\\cr/).map(r => r.trim()).filter(r => r);
      let rowsHtml = '';
      for (const row of rows) {
        const cells = row.split(matrixColRegex).map(c => parseFallbackMath(c.trim(), true));
        rowsHtml += '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
      }
      const typeClass = type === 'vmatrix' ? 'mv-matrix-det' : (type === 'bmatrix' ? 'mv-matrix-bracket' : 'mv-matrix-paren');
      return `<table class="mv-math-matrix ${typeClass}"><tbody>${rowsHtml}</tbody></table>`;
    });

    // 3. Fracciones: \frac, \dfrac, \tfrac, \cfrac recursivas
    let fracMatch;
    while ((fracMatch = /\\(?:frac|dfrac|tfrac|cfrac)/.exec(s)) !== null) {
      const fracIdx = fracMatch.index;
      const commandLen = fracMatch[0].length;
      const firstBrace = s.indexOf('{', fracIdx + commandLen - 1);
      if (firstBrace === -1) {
        s = s.slice(0, fracIdx) + s.slice(fracIdx + commandLen);
        break;
      }
      const num = extractBalancedBraces(s, firstBrace);
      if (!num) break;
      const secondBrace = s.indexOf('{', num.endIndex + 1);
      let den = { content: '', endIndex: num.endIndex };
      if (secondBrace !== -1 && secondBrace <= num.endIndex + 3) {
        den = extractBalancedBraces(s, secondBrace) || den;
      }

      const before = s.slice(0, fracIdx);
      const after = s.slice(den.endIndex + 1);
      const parsedNum = parseFallbackMath(num.content, true);
      const parsedDen = parseFallbackMath(den.content, true);
      const replacement = `<span class="mv-math-frac"><span class="mv-frac-top">${parsedNum}</span><span class="mv-frac-bottom">${parsedDen}</span></span>`;
      s = before + replacement + after;
    }

    // 4. Raíces: \sqrt[n]{content} y \sqrt{content}
    let sqrtIdx;
    while ((sqrtIdx = s.indexOf('\\sqrt')) !== -1) {
      let cursor = sqrtIdx + 5;
      let degree = '';
      if (s[cursor] === '[') {
        const closeBracket = s.indexOf(']', cursor);
        if (closeBracket !== -1) {
          degree = `<sup>${escapeHtml(s.slice(cursor + 1, closeBracket))}</sup>`;
          cursor = closeBracket + 1;
        }
      }
      const braceStart = s.indexOf('{', cursor);
      if (braceStart === -1 || braceStart > cursor + 2) {
        s = s.replace('\\sqrt', '√');
        break;
      }
      const rad = extractBalancedBraces(s, braceStart);
      if (!rad) break;
      const before = s.slice(0, sqrtIdx);
      const after = s.slice(rad.endIndex + 1);
      const parsedRad = parseFallbackMath(rad.content, true);
      const replacement = `<span class="mv-math-sqrt">${degree}<span class="mv-sqrt-symbol">√</span><span class="mv-sqrt-rad">${parsedRad}</span></span>`;
      s = before + replacement + after;
    }

    // 5. Superíndices y Subíndices
    s = s.replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>');
    s = s.replace(/\^([0-9a-zA-Z\+\-\*])/g, '<sup>$1</sup>');
    s = s.replace(/_\{([^}]+)\}/g, '<sub>$1</sub>');
    s = s.replace(/_([0-9a-zA-Z])/g, '<sub>$1</sub>');

    // 6. Vectores y caracteres en negrita
    s = s.replace(/\\vec\{([^}]+)\}/g, '<span class="mv-vec">$1⃗</span>');
    s = s.replace(/\\hat\{([a-zA-Z])\}/g, '<span class="mv-hat">$1̂</span>');
    s = s.replace(/\\hat\s*([ijk])/g, '<span class="mv-hat">$1̂</span>');
    s = s.replace(/\\(?:mathbf|boldsymbol)\{([^}]+)\}/g, '<b>$1</b>');

    // 7. Símbolos matemáticos de Cálculo Multivariable y Física
    const symbols = [
      [/\\Delta\b/g, 'Δ'],
      [/\\nabla\b/g, '∇'],
      [/\\partial\b/g, '∂'],
      [/\\iint\b/g, '∬'],
      [/\\iiint\b/g, '∭'],
      [/\\oint\b/g, '∮'],
      [/\\int\b/g, '∫'],
      [/\\sum\b/g, '∑'],
      [/\\prod\b/g, '∏'],
      [/\\cdot\b/g, ' · '],
      [/\\times\b/g, ' × '],
      [/\\pm\b/g, '±'],
      [/\\mp\b/g, '∓'],
      [/\\neq\b/g, '≠'],
      [/\\approx\b/g, '≈'],
      [/\\leq\b|\\le\b/g, '≤'],
      [/\\geq\b|\\ge\b/g, '≥'],
      [/\\ll\b/g, '≪'],
      [/\\gg\b/g, '≫'],
      [/\\infty\b/g, '∞'],
      [/\\alpha\b/g, 'α'],
      [/\\beta\b/g, 'β'],
      [/\\gamma\b/g, 'γ'],
      [/\\Gamma\b/g, 'Γ'],
      [/\\delta\b/g, 'δ'],
      [/\\epsilon\b|\\varepsilon\b/g, 'ε'],
      [/\\zeta\b/g, 'ζ'],
      [/\\eta\b/g, 'η'],
      [/\\theta\b/g, 'θ'],
      [/\\Theta\b/g, 'Θ'],
      [/\\iota\b/g, 'ι'],
      [/\\kappa\b/g, 'κ'],
      [/\\lambda\b/g, 'λ'],
      [/\\Lambda\b/g, 'Λ'],
      [/\\mu\b/g, 'μ'],
      [/\\nu\b/g, 'ν'],
      [/\\xi\b/g, 'ξ'],
      [/\\pi\b/g, 'π'],
      [/\\Pi\b/g, 'Π'],
      [/\\rho\b/g, 'ρ'],
      [/\\sigma\b/g, 'σ'],
      [/\\Sigma\b/g, 'Σ'],
      [/\\tau\b/g, 'τ'],
      [/\\phi\b|\\varphi\b/g, 'φ'],
      [/\\Phi\b/g, 'Φ'],
      [/\\chi\b/g, 'χ'],
      [/\\psi\b/g, 'ψ'],
      [/\\Psi\b/g, 'Ψ'],
      [/\\omega\b/g, 'ω'],
      [/\\Omega\b/g, 'Ω'],
      [/\\to\b|\\rightarrow\b/g, '→'],
      [/\\leftarrow\b/g, '←'],
      [/\\Rightarrow\b/g, '⇒'],
      [/\\Leftrightarrow\b/g, '⇔'],
      [/\\in\b/g, '∈'],
      [/\\notin\b/g, '∉'],
      [/\\subset\b/g, '⊂'],
      [/\\subseteq\b/g, '⊆'],
      [/\\mathbb\{R\}/g, 'ℝ'],
      [/\\langle\b/g, '⟨'],
      [/\\rangle\b/g, '⟩'],
      [/\\left\(/g, '('],
      [/\\right\)/g, ')'],
      [/\\left\[/g, '['],
      [/\\right\]/g, ']'],
      [/\\left\\\{/g, '{'],
      [/\\right\\\}/g, '}'],
      [/\\left\|/g, '‖'],
      [/\\right\|/g, '‖'],
      [/\\quad\b/g, '&nbsp;&nbsp;'],
      [/\\qquad\b/g, '&nbsp;&nbsp;&nbsp;&nbsp;'],
      [/\\&/g, '&amp;'],
      [/\\,|\\;|\\ /g, '&nbsp;']
    ];

    for (const [re, sym] of symbols) {
      s = s.replace(re, sym);
    }

    // 8. Limpieza de comandos restantes para evitar código TeX crudo
    s = s.replace(/\\([a-zA-Z]+)/g, '$1');

    return s;
  }

  function renderMathSnippet(tex, isBlock) {
    if (typeof window !== 'undefined' && window.katex && typeof window.katex.renderToString === 'function') {
      try {
        const rendered = window.katex.renderToString(tex, {
          displayMode: isBlock,
          throwOnError: false
        });
        return isBlock
          ? `<div class="mv-math-block" tabindex="0" data-mv-tex="${escapeHtml(tex)}">${rendered}</div>`
          : `<span class="mv-math-inline" data-mv-tex="${escapeHtml(tex)}">${rendered}</span>`;
      } catch (e) {}
    }

    const parsed = parseFallbackMath(tex, false);
    return isBlock
      ? `<div class="mv-math-block" tabindex="0" data-mv-tex="${escapeHtml(tex)}"><span class="mv-math-expr">${parsed}</span></div>`
      : `<span class="mv-math-inline" data-mv-tex="${escapeHtml(tex)}"><span class="mv-math-expr">${parsed}</span></span>`;
  }

  function renderMathVerseMarkdown(rawText) {
    if (!rawText) return '';

    let text = String(rawText);

    // 1. Bloques de código multilínea ```...```
    const codeBlocks = [];
    text = text.replace(/```([a-zA-Z0-9_-]*)\n?([\s\S]*?)```/g, (match, lang, code) => {
      const id = `@@@MVCODEBLOCK${codeBlocks.length}@@@`;
      codeBlocks.push(`<pre class="chat-code-block" data-lang="${escapeHtml(lang)}"><code>${escapeHtml(code.trim())}</code></pre>`);
      return `\n\n${id}\n\n`;
    });

    // 2. Código en línea `...`
    const inlineCodes = [];
    text = text.replace(/`([^`\n]+)`/g, (match, code) => {
      const id = `@@@MVINLINECODE${inlineCodes.length}@@@`;
      inlineCodes.push(`<code class="chat-inline-code">${escapeHtml(code)}</code>`);
      return id;
    });

    // 3. Fórmulas Display (Bloque): $$...$$ y \[...\] (soporta streaming unclosed)
    const mathBlocks = [];
    text = text.replace(/\$\$([\s\S]*?)(?:\$\$|$)/g, (match, tex) => {
      const id = `@@@MVMATHBLOCK${mathBlocks.length}@@@`;
      mathBlocks.push(renderMathSnippet(tex.trim(), true));
      return `\n\n${id}\n\n`;
    });
    text = text.replace(/\\\[([\s\S]*?)(?:\\\]|$)/g, (match, tex) => {
      const id = `@@@MVMATHBLOCK${mathBlocks.length}@@@`;
      mathBlocks.push(renderMathSnippet(tex.trim(), true));
      return `\n\n${id}\n\n`;
    });

    // 4. Fórmulas Inline: \(...\) y $...$ (soporta streaming unclosed con sintaxis TeX)
    const mathInlines = [];
    text = text.replace(/\\\(([\s\S]*?)(?:\\\)|$)/g, (match, tex) => {
      const id = `@@@MVMATHINLINE${mathInlines.length}@@@`;
      mathInlines.push(renderMathSnippet(tex.trim(), false));
      return id;
    });

    // Expresiones $...$
    text = text.replace(/(?<!\\|\$)\$((?:[^\$\n]|\\\$)+?)\$(?!\$|[0-9])/g, (match, tex) => {
      const id = `@@@MVMATHINLINE${mathInlines.length}@@@`;
      mathInlines.push(renderMathSnippet(tex.trim(), false));
      return id;
    });

    // Expresiones $... incompletas en streaming si contienen comando LaTeX de inicio
    text = text.replace(/(?<!\\|\$)\$(\\[a-zA-Z]+[^\$\n]*)$/g, (match, tex) => {
      const id = `@@@MVMATHINLINE${mathInlines.length}@@@`;
      mathInlines.push(renderMathSnippet(tex.trim(), false));
      return id;
    });

    // 5. Normalizar encabezados
    text = text.replace(/^(#{1,6}\s+[^\n]+)/gm, '\n\n$1\n\n');

    // Procesamiento de bloques y estructuras Markdown
    const rawParagraphs = text.split(/\n{2,}/);
    let htmlResult = '';

    function formatInlineText(t) {
      let s = escapeHtml(t);
      // Negrita
      s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
      // Cursiva
      s = s.replace(/(^|[^*])\*([^*]+)\*([^*]|$)/g, '$1<em>$2</em>$3');
      s = s.replace(/(^|[^_])_([^_]+)_([^_]|$)/g, '$1<em>$2</em>$3');
      // Tachado
      s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');
      return s;
    }

    for (let block of rawParagraphs) {
      block = block.trim();
      if (!block) continue;

      // Marcadores reservados de bloque
      if (/^@@@(?:MVCODEBLOCK|MVMATHBLOCK)\d+@@@$/.test(block)) {
        htmlResult += block + '\n';
        continue;
      }

      // Encabezados
      if (/^#{1,6}\s+/.test(block)) {
        const level = block.match(/^(#{1,6})\s+/)[1].length;
        const title = block.replace(/^#{1,6}\s+/, '');
        const headingTag = level <= 2 ? 'h3' : 'h4';
        htmlResult += `<${headingTag}>${formatInlineText(title)}</${headingTag}>\n`;
        continue;
      }

      // Citas
      if (/^>\s+/.test(block)) {
        const quoteText = block.replace(/^>\s+/gm, '');
        htmlResult += `<blockquote class="chat-quote">${formatInlineText(quoteText)}</blockquote>\n`;
        continue;
      }

      // Separador horizontal
      if (/^(?:---|\*\*\*|___)$/.test(block)) {
        htmlResult += `<hr class="chat-hr">\n`;
        continue;
      }

      // Tablas Markdown
      if (block.includes('|') && block.split('\n').length >= 2) {
        const lines = block.split('\n').map(l => l.trim()).filter(l => l);
        if (lines.length >= 2 && lines[1].includes('---')) {
          const headerCells = lines[0].split('|').map(c => c.trim()).filter(c => c);
          const rows = lines.slice(2);
          let tableHtml = '<div class="chat-table-wrapper"><table class="chat-table"><thead><tr>';
          headerCells.forEach(h => {
            tableHtml += `<th>${formatInlineText(h)}</th>`;
          });
          tableHtml += '</tr></thead><tbody>';
          rows.forEach(r => {
            const cells = r.split('|').map(c => c.trim()).filter(c => c);
            if (cells.length > 0) {
              tableHtml += '<tr>';
              cells.forEach(c => {
                tableHtml += `<td>${formatInlineText(c)}</td>`;
              });
              tableHtml += '</tr>';
            }
          });
          tableHtml += '</tbody></table></div>\n';
          htmlResult += tableHtml;
          continue;
        }
      }

      // Listas y párrafos
      const lines = block.split('\n');
      let isUl = false;
      let isOl = false;
      let listHtml = '';

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/^[-*•]\s+/.test(line)) {
          if (!isUl) {
            if (isOl) { listHtml += '</ol>'; isOl = false; }
            listHtml += '<ul class="chat-list">';
            isUl = true;
          }
          listHtml += `<li>${formatInlineText(line.replace(/^[-*•]\s+/, ''))}</li>`;
        } else if (/^\d+\.\s+/.test(line)) {
          if (!isOl) {
            if (isUl) { listHtml += '</ul>'; isUl = false; }
            listHtml += '<ol class="chat-list-ol">';
            isOl = true;
          }
          listHtml += `<li>${formatInlineText(line.replace(/^\d+\.\s+/, ''))}</li>`;
        } else {
          if (isUl) { listHtml += '</ul>'; isUl = false; }
          if (isOl) { listHtml += '</ol>'; isOl = false; }
          listHtml += `<p>${formatInlineText(line)}</p>`;
        }
      }
      if (isUl) listHtml += '</ul>';
      if (isOl) listHtml += '</ol>';
      htmlResult += listHtml + '\n';
    }

    // 6. Restaurar marcadores sin colisión de tokens $
    mathBlocks.forEach((rendered, i) => {
      htmlResult = htmlResult.split(`@@@MVMATHBLOCK${i}@@@`).join(rendered);
    });
    mathInlines.forEach((rendered, i) => {
      htmlResult = htmlResult.split(`@@@MVMATHINLINE${i}@@@`).join(rendered);
    });
    codeBlocks.forEach((rendered, i) => {
      htmlResult = htmlResult.split(`@@@MVCODEBLOCK${i}@@@`).join(rendered);
    });
    inlineCodes.forEach((rendered, i) => {
      htmlResult = htmlResult.split(`@@@MVINLINECODE${i}@@@`).join(rendered);
    });

    return htmlResult;
  }

  // Exportar globalmente
  window.MathVerseRenderer = {
    render: renderMathVerseMarkdown,
    renderMath: renderMathSnippet,
    escapeHtml: escapeHtml,
    sanitizeMath: sanitizeMathInput,
    upgradeMath: upgradeRenderedMathWithKatex
  };
})();
