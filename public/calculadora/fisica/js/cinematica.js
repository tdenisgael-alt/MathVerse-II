(function () {

  const fmt = x => {
    if (x === null || x === undefined) return '';
    const r = Math.abs(x) < 1e-9 ? 0 : x;
    return String(+r.toFixed(4)).replace('.', ',');
  };
  const N = x => (x < 0 ? '(' + fmt(x) + ')' : fmt(x));          // negativos entre paréntesis
  const S = (t, l, fin) => ({ t, l: Array.isArray(l) ? l : [l], fin: !!fin }); // un paso del procedimiento

  const TABS = ['Escribir problema', 'MRU', 'MRUV / MRUA', 'Caída libre', 'Parabólico'];
  const TAB_COLORS = [['#d63a6e', '#ff8fb3'], ['#2a5fe0', '#8fb4ff'], ['#c2570a', '#ffb067'], ['#12805c', '#6ee7b7'], ['#7a45d6', '#c4a3ff']];
  const UN = { v0: 'm/s', vf: 'm/s', a: 'm/s²', t: 's', d: 'm' };


  const RULES = [
    ['vf', ['v0', 'a', 't'], s => s.v0 + s.a * s.t, 'vf = v0 + a·t'],
    ['v0', ['vf', 'a', 't'], s => s.vf - s.a * s.t, 'v0 = vf − a·t'],
    ['a', ['v0', 'vf', 't'], s => s.t ? (s.vf - s.v0) / s.t : null, 'a = (vf − v0) / t'],
    ['t', ['v0', 'vf', 'a'], s => s.a ? (s.vf - s.v0) / s.a : null, 't = (vf − v0) / a'],
    ['d', ['v0', 't', 'a'], s => s.v0 * s.t + 0.5 * s.a * s.t * s.t, 'd = v0·t + ½·a·t²'],
    ['d', ['v0', 'vf', 't'], s => (s.v0 + s.vf) / 2 * s.t, 'd = (v0 + vf)/2 · t'],
    ['d', ['v0', 'vf', 'a'], s => s.a ? (s.vf ** 2 - s.v0 ** 2) / (2 * s.a) : null, 'd = (vf² − v0²) / (2·a)'],
    ['a', ['v0', 't', 'd'], s => s.t ? 2 * (s.d - s.v0 * s.t) / (s.t * s.t) : null, 'a = 2·(d − v0·t) / t²'],
    ['v0', ['a', 't', 'd'], s => s.t ? (s.d - 0.5 * s.a * s.t * s.t) / s.t : null, 'v0 = (d − ½·a·t²) / t'],
    ['v0', ['vf', 't', 'd'], s => s.t ? 2 * s.d / s.t - s.vf : null, 'v0 = 2·d / t − vf'],
    ['vf', ['v0', 't', 'd'], s => s.t ? 2 * s.d / s.t - s.v0 : null, 'vf = 2·d / t − v0'],
    ['a', ['v0', 'vf', 'd'], s => s.d ? (s.vf ** 2 - s.v0 ** 2) / (2 * s.d) : null, 'a = (vf² − v0²) / (2·d)'],
    ['t', ['v0', 'vf', 'd'], s => (s.v0 + s.vf) ? 2 * s.d / (s.v0 + s.vf) : null, 't = 2·d / (v0 + vf)']
  ];
  function subst(formula, s) {
    const rhs = formula.split(' = ').slice(1).join(' = ');
    return rhs.replace(/v0|vf|\ba\b|\bt\b|\bd\b/g, m => N(s[m]));
  }
  function prop(k, log) {
    k = Object.assign({}, k);
    let ch = true;
    while (ch && Object.keys(k).length < 5) {
      ch = false;
      for (const [o, req, fn, ftxt] of RULES) {
        if (!(o in k) && req.every(x => x in k)) {
          const v = fn(k);
          if (v !== null && isFinite(v)) {
            const val = Math.abs(v) < 1e-9 ? 0 : v;
            if (log) log.push({ o, f: ftxt, sub: subst(ftxt, k), v: val });
            k[o] = val; ch = true;
          }
        }
      }
    }
    return k;
  }
  function solveMRUV(k) {
    if ('t' in k && k.t < -1e-9) {
      const r = []; r.logs = []; r.rejectedPast = { t: k.t };
      return r;
    }
    const base = [];
    const s = prop(k, base);
    if (Object.keys(s).length === 5) {
      if (s.t >= -1e-9) {
        if (Math.abs(s.t) < 1e-9) s.t = 0;
        const r = [s]; r.logs = [base]; return r;
      }
      const r = []; r.logs = []; r.rejectedPast = s;
      return r;
    }
    const out = []; out.logs = [];
    const pastCandidates = [];
    for (const [dado, busc, sg] of [['v0', 'vf', 1], ['vf', 'v0', -1]]) {
      if (dado in s && 'a' in s && 'd' in s && !(busc in s)) {
        const rad = s[dado] ** 2 + sg * 2 * s.a * s.d;
        if (rad < -1e-9) {
          out.radNegative = { rad, dado, busc, a: s.a, d: s.d, val: s[dado] };
          return out;
        }
        const nonNegRad = Math.max(0, rad);
        for (const m of nonNegRad < 1e-9 ? [1] : [1, -1]) {
          const val = m * Math.sqrt(nonNegRad);
          const lg = base.slice();
          lg.push({ quad: true, dado, busc, rad: nonNegRad, val, dos: nonNegRad >= 1e-9, a: s.a, d: s.d, dv: s[dado] });
          const c = prop(Object.assign({}, s, { [busc]: val }), lg);
          if (Object.keys(c).length === 5) {
            if (c.t >= -1e-9) {
              if (Math.abs(c.t) < 1e-9) c.t = 0;
              if (!out.some(o => Math.abs(o.t - c.t) < 1e-9)) {
                out.push(c);
                out.logs.push(lg);
              }
            } else {
              pastCandidates.push(c);
            }
          }
        }
      }
    }
    if (out.length === 0 && pastCandidates.length > 0) {
      out.rejectedPast = pastCandidates[0];
      out.rejectedPasts = pastCandidates;
    }
    return out;
  }


  const F = (k, l, opt, def) => ({ k, l, opt, def });
  const CALCS = [
    { tab: 0, title: 'Velocidad, distancia o tiempo (v = d/t)', note: 'Deja en blanco SOLO la incógnita.',
      fields: [F('d', 'Distancia d (m)', 1), F('v', 'Velocidad v (m/s)', 1), F('t', 'Tiempo t (s)', 1)],
      fn(v) {
        const { d, v: vel, t } = v;
        if ([d, vel, t].filter(x => x === null).length !== 1) throw new Error('Deja exactamente UNA incógnita en blanco.');
        if (t !== null && t < -1e-9) throw new Error('La duración o tiempo transcurrido (t) no puede ser negativo (t = ' + fmt(t) + ' s). Debe cumplirse t ≥ 0.');
        const datos = [];
        if (d !== null) datos.push('d = ' + fmt(d) + ' m');
        if (vel !== null) datos.push('v = ' + fmt(vel) + ' m/s');
        if (t !== null) datos.push('t = ' + fmt(t) + ' s');
        const inc = d === null ? 'd (distancia)' : vel === null ? 'v (velocidad)' : 't (tiempo)';
        const st = [S('Anota los datos', datos.concat('Incógnita: ' + inc))];
        if (d === null) {
          const r = vel * t;
          st.push(S('Escribe la fórmula del MRU', 'd = v · t'), S('Sustituye los valores', 'd = ' + N(vel) + ' · ' + N(t)), S('Resultado', 'd = ' + fmt(r) + ' m', true));
          return { rows: [['Distancia d = v·t', r, 'm', true, 'd']], steps: st };
        }
        if (vel === null) {
          if (Math.abs(t) < 1e-9) {
            if (Math.abs(d) < 1e-9) {
              const r = 0;
              st.push(S('Escribe la fórmula del MRU', 'v = d / t'), S('Móvil en reposo en el origen (t = 0 s, d = 0 m)', 'v = 0 m/s', true));
              return { rows: [['Velocidad v = d/t', r, 'm/s', true, 'v'], ['Equivale a', 0, 'km/h', true, 'v']], steps: st };
            }
            throw new Error('No es posible recorrer una distancia no nula (d = ' + fmt(d) + ' m) en un tiempo nulo (t = 0 s).');
          }
          const r = d / t;
          st.push(S('Escribe la fórmula del MRU', 'v = d / t'), S('Sustituye los valores', 'v = ' + N(d) + ' / ' + N(t)),
            S('Resultado', ['v = ' + fmt(r) + ' m/s', 'En km/h: ' + fmt(r) + ' · 3,6 = ' + fmt(r * 3.6) + ' km/h'], true));
          return { rows: [['Velocidad v = d/t', r, 'm/s', true, 'v'], ['Equivale a', r * 3.6, 'km/h', true, 'v']], steps: st };
        }
        if (Math.abs(vel) < 1e-9) {
          if (Math.abs(d) < 1e-9) {
            const r = 0;
            st.push(S('Escribe la fórmula del MRU', 't = d / v'), S('Móvil en reposo en el origen', 't = 0 s', true));
            return { rows: [['Tiempo t = d/v', r, 's', true, 't']], steps: st };
          }
          throw new Error('Con velocidad cero (v = 0 m/s), el móvil permanece en reposo y no puede recorrer una distancia distinta de cero (d = ' + fmt(d) + ' m).');
        }
        const r = d / vel;
        if (r < -1e-9) {
          throw new Error('El tiempo resultante es negativo (t = ' + fmt(r) + ' s). La velocidad (' + fmt(vel) + ' m/s) y el desplazamiento (' + fmt(d) + ' m) tienen sentidos opuestos, por lo que el móvil nunca alcanzará esa posición en el futuro (t ≥ 0).');
        }
        const tVal = Math.abs(r) < 1e-9 ? 0 : r;
        st.push(S('Escribe la fórmula del MRU', 't = d / v'), S('Sustituye los valores', 't = ' + N(d) + ' / ' + N(vel)), S('Resultado', 't = ' + fmt(tVal) + ' s', true));
        return { rows: [['Tiempo t = d/v', tVal, 's', true, 't']], steps: st };
      } },
    { tab: 0, title: 'Encuentro (uno hacia el otro)', note: 't = d / (v1 + v2)',
      fields: [F('d', 'Distancia que los separa (m)'), F('v1', 'Velocidad móvil 1 (m/s)'), F('v2', 'Velocidad móvil 2 (m/s)')],
      fn(v) {
        if (v.d < 0) throw new Error('La distancia que los separa no puede ser negativa (d ≥ 0).');
        if (v.v1 <= 0 || v.v2 <= 0) throw new Error('Las velocidades de ambos móviles deben ser mayores que cero.');
        const t = v.d / (v.v1 + v.v2), d1 = v.v1 * t, d2 = v.v2 * t;
        return {
          rows: [['Tiempo de encuentro', t, 's', true, 't'], ['Recorre el móvil 1', d1, 'm', true, 'd1'], ['Recorre el móvil 2', d2, 'm', true, 'd2']],
          steps: [
            S('Anota los datos', ['d = ' + fmt(v.d) + ' m', 'v1 = ' + fmt(v.v1) + ' m/s', 'v2 = ' + fmt(v.v2) + ' m/s', 'Incógnita: t (tiempo de encuentro)']),
            S('Piensa en la idea', 'Como se acercan, cada segundo la distancia entre ellos baja v1 + v2.'),
            S('Escribe la fórmula', 't = d / (v1 + v2)'),
            S('Sustituye los valores', ['t = ' + N(v.d) + ' / (' + N(v.v1) + ' + ' + N(v.v2) + ')', 't = ' + N(v.d) + ' / ' + N(v.v1 + v.v2)]),
            S('Resultado', 't = ' + fmt(t) + ' s', true),
            S('Cuánto recorre cada uno', ['d1 = v1 · t = ' + N(v.v1) + ' · ' + fmt(t) + ' = ' + fmt(d1) + ' m', 'd2 = v2 · t = ' + N(v.v2) + ' · ' + fmt(t) + ' = ' + fmt(d2) + ' m',
              'Comprobación: d1 + d2 = ' + fmt(d1 + d2) + ' m, igual a d.'], true)
          ]
        };
      } },
    { tab: 0, title: 'Alcance (mismo sentido)', note: 't = d / (v1 − v2), v1 = móvil más rápido.',
      fields: [F('d', 'Ventaja del móvil lento (m)'), F('v1', 'Velocidad del RÁPIDO v1 (m/s)'), F('v2', 'Velocidad del LENTO v2 (m/s)')],
      fn(v) {
        if (v.d < 0) throw new Error('La ventaja del móvil lento no puede ser negativa (d ≥ 0).');
        if (v.v1 <= v.v2) throw new Error('El móvil rápido debe tener mayor velocidad.');
        const t = v.d / (v.v1 - v.v2), x = v.v1 * t;
        return {
          rows: [['Tiempo de alcance', t, 's', true, 't'], ['Posición del alcance (desde la salida del rápido)', x, 'm', true, 'd']],
          steps: [
            S('Anota los datos', ['Ventaja del lento: d = ' + fmt(v.d) + ' m', 'v1 (rápido) = ' + fmt(v.v1) + ' m/s', 'v2 (lento) = ' + fmt(v.v2) + ' m/s', 'Incógnita: t (tiempo de alcance)']),
            S('Piensa en la idea', 'Como van en el mismo sentido, el rápido recorta la ventaja a razón de v1 − v2 cada segundo.'),
            S('Escribe la fórmula', 't = d / (v1 − v2)'),
            S('Sustituye los valores', ['t = ' + N(v.d) + ' / (' + N(v.v1) + ' − ' + N(v.v2) + ')', 't = ' + N(v.d) + ' / ' + N(v.v1 - v.v2)]),
            S('Resultado', 't = ' + fmt(t) + ' s', true),
            S('Dónde se encuentran', ['x = v1 · t = ' + N(v.v1) + ' · ' + fmt(t) + ' = ' + fmt(x) + ' m'], true)
          ]
        };
      } },
    { tab: 0, title: 'Velocidad media por tramos', note: 'Un tramo por línea: distancia,tiempo (m y s; usa «;» como separador si escribes coma decimal). v_media = d_total / t_total.',
      fields: [{ k: 'tr', l: 'Tramos (distancia,tiempo)', area: 1 }],
      fn(v) {
        let D = 0, T = 0, n = 0; const lin = [];
        for (const line of v.tr.split('\n')) {
          if (!line.trim()) continue;
          const parts = line.includes(';') ? line.split(';') : line.split(','); // «;» permite coma decimal
          const d = Number(String(parts[0]).replace(',', '.')), t = Number(String(parts[1]).replace(',', '.'));
          if (parts.length !== 2 || isNaN(d) || isNaN(t)) throw new Error('Formato inválido en: "' + line + '"');
          if (t < -1e-9) throw new Error('El tiempo de un tramo no puede ser negativo (t = ' + fmt(t) + ' s). Debe cumplirse t ≥ 0.');
          D += d; T += t; n++;
          lin.push('Tramo ' + n + ': d = ' + fmt(d) + ' m, t = ' + fmt(t) + ' s');
        }
        if (!n) throw new Error('Ingresa al menos un tramo.');
        if (T <= 0) throw new Error('El tiempo total acumulado debe ser mayor que cero.');
        const vm = D / T;
        return {
          rows: [['Distancia total', D, 'm', true, 'd'], ['Tiempo total', T, 's', true, 't'], ['Velocidad media', vm, 'm/s', true, 'v'], ['Equivale a', vm * 3.6, 'km/h', true, 'v']],
          steps: [
            S('Anota los tramos', lin),
            S('Suma las distancias', 'd_total = ' + fmt(D) + ' m'),
            S('Suma los tiempos', 't_total = ' + fmt(T) + ' s'),
            S('Aplica la fórmula', ['v_media = d_total / t_total', 'No se promedian las velocidades de cada tramo.']),
            S('Sustituye los valores', 'v_media = ' + fmt(D) + ' / ' + fmt(T)),
            S('Resultado', ['v_media = ' + fmt(vm) + ' m/s', 'En km/h: ' + fmt(vm) + ' · 3,6 = ' + fmt(vm * 3.6) + ' km/h'], true)
          ]
        };
      } },

    { tab: 1, title: 'MRUV / MRUA: resuelve con 3 datos',
      note: 'Llena 3 de los 5 datos y deja los otros 2 en blanco. «Parte del reposo» → v0 = 0 · «Se detiene» → vf = 0 · «Frena» → a negativa.',
      fields: [F('v0', 'Velocidad inicial v0 (m/s)', 1), F('vf', 'Velocidad final vf (m/s)', 1), F('a', 'Aceleración a (m/s²)', 1), F('t', 'Tiempo t (s)', 1), F('d', 'Distancia d (m)', 1)],
      fn(v) {
        const k = {};
        for (const key in v) if (v[key] !== null) k[key] = v[key];
        if (Object.keys(k).length !== 3) throw new Error('Necesitas exactamente 3 datos (ingresaste ' + Object.keys(k).length + ').');
        if ('t' in k && k.t < -1e-9) throw new Error('La duración o tiempo transcurrido (t) no puede ser negativo (t = ' + fmt(k.t) + ' s). Debe cumplirse t ≥ 0.');
        if ('t' in k && Math.abs(k.t) < 1e-9) {
          k.t = 0;
          if ('v0' in k && 'vf' in k && Math.abs(k.v0 - k.vf) > 1e-9) {
            throw new Error('En t = 0 s, la velocidad inicial y final deben coincidir (v0 = vf). Un cambio instantáneo requeriría aceleración infinita.');
          }
          if ('d' in k && Math.abs(k.d) > 1e-9) {
            throw new Error('No es posible recorrer una distancia no nula (d = ' + fmt(k.d) + ' m) en un tiempo nulo (t = 0 s).');
          }
        }
        const sols = solveMRUV(k);
        if (!sols.length) {
          if ('a' in k && Math.abs(k.a) < 1e-9) {
            if ('v0' in k && 'vf' in k && Math.abs(k.v0 - k.vf) > 1e-9) {
              throw new Error('Datos incompatibles: con aceleración nula (a = 0 m/s²), la velocidad debe ser constante (v0 = vf).');
            }
            if ('v0' in k && 'vf' in k) {
              throw new Error('Con aceleración nula (a = 0 m/s²) y velocidad constante, el movimiento es MRU; se requiere indicar la distancia o el tiempo para determinar el resto de variables.');
            }
            if ((('v0' in k && Math.abs(k.v0) < 1e-9) || ('vf' in k && Math.abs(k.vf) < 1e-9)) && ('d' in k && Math.abs(k.d) > 1e-9)) {
              throw new Error('Con aceleración nula (a = 0 m/s²) y velocidad cero, el móvil permanece en reposo y no puede alcanzar una distancia de ' + fmt(k.d) + ' m.');
            }
          }
          if (sols.rejectedPast) {
            const p = sols.rejectedPast;
            const tVal = p.t !== undefined ? p.t : null;
            if ('v0' in k && 'vf' in k && 'a' in k) {
              let msg = 'El tiempo calculado es negativo (t = ' + fmt(tVal) + ' s). Esta solución algebraica corresponde al pasado y no a un tiempo físico válido (t ≥ 0).';
              if (k.a > 0 && k.v0 > k.vf) {
                msg += ' Con velocidad inicial v0 = ' + fmt(k.v0) + ' m/s y aceleración positiva a = ' + fmt(k.a) + ' m/s², el móvil acelera y su velocidad aumentará en el futuro, por lo que nunca se reducirá a vf = ' + fmt(k.vf) + ' m/s.';
                if (k.vf === 0) msg += ' Para frenar hasta detenerse, la aceleración debe ser negativa (a < 0).';
              } else if (k.a < 0 && k.v0 < k.vf) {
                msg += ' Con velocidad inicial v0 = ' + fmt(k.v0) + ' m/s y aceleración negativa a = ' + fmt(k.a) + ' m/s², el móvil frena y su velocidad disminuirá en el futuro, por lo que nunca aumentará a vf = ' + fmt(k.vf) + ' m/s.';
              } else {
                msg += ' Los datos ingresados no corresponden a una evolución temporal hacia el futuro.';
              }
              throw new Error(msg);
            }
            if ('v0' in k && 'vf' in k && 'd' in k) {
              const vm = (k.v0 + k.vf) / 2;
              throw new Error('El tiempo calculado es negativo (t = ' + fmt(tVal) + ' s). Con velocidad media ' + fmt(vm) + ' m/s y desplazamiento ' + fmt(k.d) + ' m de sentidos opuestos, el móvil nunca alcanzará esa posición en el futuro (t ≥ 0).');
            }
            if ('v0' in k && 'a' in k && 'd' in k) {
              const times = sols.rejectedPasts ? sols.rejectedPasts.map(c => 't = ' + fmt(c.t) + ' s').join(' y ') : 't = ' + fmt(tVal) + ' s';
              throw new Error('Las soluciones algebraicas para el tiempo son negativas (' + times + '). Corresponden al pasado y el móvil no alcanzará d = ' + fmt(k.d) + ' m en el futuro (t ≥ 0).');
            }
            if ('vf' in k && 'a' in k && 'd' in k) {
              const times = sols.rejectedPasts ? sols.rejectedPasts.map(c => 't = ' + fmt(c.t) + ' s').join(' y ') : 't = ' + fmt(tVal) + ' s';
              throw new Error('Las soluciones algebraicas para el tiempo son negativas (' + times + '). Corresponden al pasado y no tienen solución física futura (t ≥ 0).');
            }
            throw new Error('El tiempo resultante es negativo (t = ' + fmt(tVal) + ' s). No existe solución física válida en el futuro (t ≥ 0).');
          }
          if (sols.radNegative) {
            const rad = sols.radNegative.rad;
            if ('v0' in k && 'a' in k && 'd' in k) {
              const dMax = - (k.v0 ** 2) / (2 * k.a);
              throw new Error('Sin solución física real: el radicando de la velocidad es negativo (vf² = ' + fmt(rad) + '). El móvil frena con a = ' + fmt(k.a) + ' m/s² y se detiene a los ' + fmt(dMax) + ' m, antes de alcanzar d = ' + fmt(k.d) + ' m.');
            }
            if ('vf' in k && 'a' in k && 'd' in k) {
              throw new Error('Sin solución física real: el radicando de la velocidad es negativo (v0² = ' + fmt(rad) + '). Revisa los signos de aceleración y distancia.');
            }
            throw new Error('Sin solución física real: raíz cuadrada de un radicando negativo (' + fmt(rad) + ').');
          }
          throw new Error('Sin solución física válida con esos datos (revisa los signos de la velocidad, aceleración y distancia).');
        }
        const names = { v0: 'Velocidad inicial v0', vf: 'Velocidad final vf', a: 'Aceleración a', t: 'Tiempo t', d: 'Distancia d' };
        const order = ['v0', 'vf', 'a', 't', 'd'];
        const rows = [], steps = [];
        steps.push(S('Anota los datos', order.filter(c => c in k).map(c => c + ' = ' + fmt(k[c]) + ' ' + UN[c]).concat('Incógnitas: ' + order.filter(c => !(c in k)).join(' y '))));
        sols.forEach((s, i) => {
          if (sols.length > 1) { rows.push(['Solución ' + (i + 1), null]); steps.push(S('Solución ' + (i + 1) + ' de ' + sols.length, [])); }
          for (const c of order) rows.push([names[c], s[c], UN[c], !(c in k), c]);
          for (const e of sols.logs[i]) {
            if (e.quad) {
              const f = e.dado === 'v0' ? 'vf² = v0² + 2·a·d' : 'v0² = vf² − 2·a·d';
              const sg = e.dado === 'v0' ? ' + ' : ' − ';
              const sq = Math.sqrt(e.rad);
              let rootExpl;
              if (!e.dos) {
                rootExpl = e.busc + ' = ' + fmt(e.val) + ' m/s (raíz única)';
              } else if (sols.length > 1) {
                rootExpl = 'Ambas raíces dan tiempos admisibles (t ≥ 0). En esta solución: ' + e.busc + ' = ' + fmt(e.val) + ' m/s';
              } else {
                rootExpl = 'Al evaluar ±' + fmt(sq) + ', la otra raíz produce un tiempo en el pasado (t < 0 s). Se conserva la físicamente admisible (t ≥ 0): ' + e.busc + ' = ' + fmt(e.val) + ' m/s';
              }
              steps.push(S('Falta una velocidad: uso la ecuación sin tiempo', [
                'Fórmula: ' + f,
                e.busc + ' = ±√(' + e.dado + '²' + sg + '2·a·d)',
                e.busc + ' = ±√(' + N(e.dv) + '²' + sg + '2·' + N(e.a) + '·' + N(e.d) + ') = ±√' + fmt(e.rad) + ' = ±' + fmt(sq),
                rootExpl
              ]));
            } else {
              steps.push(S('Calculo ' + e.o + ' (' + names[e.o].split(' ')[0].toLowerCase() + ')', ['Fórmula: ' + e.f, e.o + ' = ' + e.sub, e.o + ' = ' + fmt(e.v) + ' ' + UN[e.o]]));
            }
          }
          steps.push(S('Resultado' + (sols.length > 1 ? ' ' + (i + 1) : ''), order.filter(c => !(c in k)).map(c => c + ' = ' + fmt(s[c]) + ' ' + UN[c]), true));
        });
        return { rows, steps };
      } },

    { tab: 2, title: 'Se suelta un objeto (v0 = 0)', note: 't = √(2h/g) ; v = √(2gh)',
      fields: [F('h', 'Altura h (m)')],
      fn(v, g) {
        if (v.h < 0) throw new Error('La altura h debe ser mayor o igual a cero (h ≥ 0).');
        const t = Math.sqrt(2 * v.h / g), vi = Math.sqrt(2 * g * v.h);
        return {
          rows: [['Tiempo de caída', t, 's', true, 't'], ['Velocidad de impacto (hacia abajo)', vi, 'm/s', true, 'v']],
          steps: [
            S('Anota los datos', ['h = ' + fmt(v.h) + ' m', 'g = ' + fmt(g) + ' m/s²', 'v0 = 0 (se suelta, no se lanza)', 'Incógnitas: t y v de impacto']),
            S('Tiempo de caída: parte de h = ½·g·t²', ['Despejo t: t = √(2·h / g)', 't = √(2·' + N(v.h) + ' / ' + fmt(g) + ') = √' + fmt(2 * v.h / g) + ' = ' + fmt(t) + ' s']),
            S('Velocidad de impacto', ['v = g · t', 'v = ' + fmt(g) + ' · ' + fmt(t) + ' = ' + fmt(vi) + ' m/s', '(es lo mismo que v = √(2·g·h))']),
            S('Resultado', ['t = ' + fmt(t) + ' s', 'v = ' + fmt(vi) + ' m/s hacia abajo'], true)
          ]
        };
      } },
    { tab: 2, title: 'Lanzamiento vertical (eje + hacia ARRIBA)', note: 'v0 > 0 si se lanza hacia arriba; v0 < 0 hacia abajo.',
      fields: [F('y0', 'Altura inicial y0 (m)', 1, 0), F('v0', 'Velocidad inicial v0 (m/s)')],
      fn(v, g) {
        const { y0, v0 } = v;
        if (y0 < 0) throw new Error('La altura inicial y0 debe ser mayor o igual a cero (y0 ≥ 0).');
        const rows = [], st = [];
        st.push(S('Anota los datos', ['y0 = ' + fmt(y0) + ' m', 'v0 = ' + fmt(v0) + ' m/s (+ hacia arriba)', 'g = ' + fmt(g) + ' m/s² (la gravedad apunta hacia abajo)']),
          S('Ecuaciones del movimiento', ['y(t) = y0 + v0·t − ½·g·t²', 'v(t) = v0 − g·t']));
        if (v0 > 0) {
          const ts = v0 / g, hm = y0 + v0 * v0 / (2 * g);
          rows.push(['Tiempo de subida = v0/g', ts, 's', true, 'ts'], ['Altura máxima = y0 + v0²/(2g)', hm, 'm', true, 'h']);
          st.push(S('Subida: arriba la velocidad vale 0', ['0 = v0 − g·t  →  t = v0 / g', 't = ' + N(v0) + ' / ' + fmt(g) + ' = ' + fmt(ts) + ' s']),
            S('Altura máxima', ['h_max = y0 + v0² / (2·g)', 'h_max = ' + N(y0) + ' + ' + N(v0) + '² / (2·' + fmt(g) + ') = ' + fmt(hm) + ' m'], true));
          if (y0 === 0) { rows.push(['Tiempo de vuelo = 2·v0/g', 2 * v0 / g, 's', true, 't']); st.push(S('Tiempo de vuelo (sube y baja al mismo nivel)', ['t_vuelo = 2·v0 / g = 2·' + N(v0) + ' / ' + fmt(g) + ' = ' + fmt(2 * v0 / g) + ' s'], true)); }
        }
        const t = (v0 + Math.sqrt(v0 * v0 + 2 * g * y0)) / g, vf = v0 - g * t;
        rows.push(['Tiempo hasta el suelo (y = 0)', t, 's', true, 't'], ['Velocidad al llegar al suelo (− = hacia abajo)', vf, 'm/s', true, 'v']);
        st.push(S('Llegada al suelo: y = 0', ['0 = y0 + v0·t − ½·g·t²  (ecuación de 2.º grado en t)', 't = (v0 + √(v0² + 2·g·y0)) / g',
          't = (' + N(v0) + ' + √(' + N(v0) + '² + 2·' + fmt(g) + '·' + N(y0) + ')) / ' + fmt(g) + ' = ' + fmt(t) + ' s'], true),
        S('Velocidad al llegar', ['v = v0 − g·t', 'v = ' + N(v0) + ' − ' + fmt(g) + '·' + fmt(t) + ' = ' + fmt(vf) + ' m/s'], true));
        return { rows, steps: st };
      } },

    { tab: 3, title: 'Tiro oblicuo / horizontal', note: 'Tiro horizontal: θ = 0°. El tiempo es el único dato común a los ejes x e y.', plot: 1,
      fields: [F('v0', 'Rapidez inicial v0 (m/s)'), F('th', 'Ángulo θ (°)', 1, 0), F('y0', 'Altura inicial y0 (m)', 1, 0), F('tq', 'Instante t a consultar (s)', 1)],
      fn(v, g) {
        if (v.v0 < 0) throw new Error('La rapidez inicial v0 no puede ser negativa (v0 ≥ 0).');
        if (v.y0 < 0) throw new Error('La altura inicial y0 no puede ser negativa (y0 ≥ 0).');
        if (v.tq !== null && v.tq < -1e-9) throw new Error('El instante t a consultar no puede ser negativo (t ≥ 0).');
        const r = v.th * Math.PI / 180, v0x = v.v0 * Math.cos(r), v0y = v.v0 * Math.sin(r), y0 = v.y0;
        const T = (v0y + Math.sqrt(v0y * v0y + 2 * g * y0)) / g, vy = v0y - g * T;
        const rows = [['Componente v0x = v0·cosθ', v0x, 'm/s', true, 'cmp'], ['Componente v0y = v0·senθ', v0y, 'm/s', true, 'cmp']];
        const st = [
          S('Anota los datos', ['v0 = ' + fmt(v.v0) + ' m/s', 'θ = ' + fmt(v.th) + '°', 'y0 = ' + fmt(y0) + ' m', 'g = ' + fmt(g) + ' m/s²']),
          S('Descompón la velocidad inicial', ['v0x = v0·cosθ = ' + fmt(v.v0) + '·cos(' + fmt(v.th) + '°) = ' + fmt(v0x) + ' m/s', 'v0y = v0·senθ = ' + fmt(v.v0) + '·sen(' + fmt(v.th) + '°) = ' + fmt(v0y) + ' m/s']),
          S('Ecuaciones de cada eje', ['Eje x (MRU): x = v0x·t', 'Eje y (caída con g): y = y0 + v0y·t − ½·g·t²', 'vy = v0y − g·t'])
        ];
        if (v0y > 0) {
          const ts = v0y / g, hm = y0 + v0y * v0y / (2 * g);
          rows.push(['Tiempo de subida', ts, 's', true, 'ts'], ['Altura máxima', hm, 'm', true, 'h']);
          st.push(S('Subida: en la cima vy = 0', ['t_subida = v0y / g = ' + fmt(v0y) + ' / ' + fmt(g) + ' = ' + fmt(ts) + ' s', 'h_max = y0 + v0y² / (2·g) = ' + N(y0) + ' + ' + fmt(v0y) + '² / (2·' + fmt(g) + ') = ' + fmt(hm) + ' m'], true));
        }
        const R = v0x * T, vi = Math.hypot(v0x, vy), ang = Math.atan2(vy, v0x) * 180 / Math.PI;
        rows.push(['Tiempo total en el aire', T, 's', true, 't'], ['Alcance horizontal', R, 'm', true, 'd'],
          ['Velocidad vertical al impactar', vy, 'm/s', true, 'cmp'], ['Rapidez de impacto', vi, 'm/s', true, 'v'],
          ['Ángulo de impacto (− = bajando)', ang, '°', true, 'ang']);
        st.push(S('Tiempo total: llega al suelo cuando y = 0', ['t = (v0y + √(v0y² + 2·g·y0)) / g', 't = (' + N(v0y) + ' + √(' + N(v0y) + '² + 2·' + fmt(g) + '·' + N(y0) + ')) / ' + fmt(g) + ' = ' + fmt(T) + ' s'], true),
          S('Alcance horizontal', ['x = v0x · t = ' + N(v0x) + ' · ' + fmt(T) + ' = ' + fmt(R) + ' m'], true),
          S('Cómo llega al suelo', ['vy = v0y − g·t = ' + N(v0y) + ' − ' + fmt(g) + '·' + fmt(T) + ' = ' + fmt(vy) + ' m/s', '|v| = √(v0x² + vy²) = √(' + N(v0x) + '² + ' + N(vy) + '²) = ' + fmt(vi) + ' m/s',
            'θ = arctan(vy / v0x) = ' + fmt(ang) + '°'], true));
        if (v.tq !== null) {
          const t = v.tq, vyt = v0y - g * t, x = v0x * t, y = y0 + v0y * t - 0.5 * g * t * t, sp = Math.hypot(v0x, vyt);
          rows.push(['En t: posición x', x, 'm', true, 'xt'], ['En t: altura y', y, 'm', true, 'yt'], ['En t: rapidez |v|', sp, 'm/s', true, 'vt']);
          st.push(S('En el instante t = ' + fmt(t) + ' s', ['x = v0x·t = ' + N(v0x) + '·' + fmt(t) + ' = ' + fmt(x) + ' m', 'y = y0 + v0y·t − ½·g·t² = ' + fmt(y) + ' m',
            'vy = v0y − g·t = ' + fmt(vyt) + ' m/s', '|v| = √(v0x² + vy²) = ' + fmt(sp) + ' m/s'], true));
        }
        return { rows, steps: st, plot: { v0x, v0y, y0, T, g } };
      } }
  ];


  const strip = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const UNIT_RE = '(-?\\d+(?:\\.\\d+)?)\\s*(metros? por segundos? (?:al )?cuadrados?|m\\/s\\^2|m\\/s2|m\\/s²|metros? por segundos?|kilometros? por hora|km\\/h|kph|m\\/s|kilometros?|km|centimetros?|cm|metros?|segundos?|seg|minutos?|min|horas?|hrs?|grados?|°|º|s|m|h)(?![a-z0-9²\\/])';
  function classify(u) {
    if (/cuadrad|\^2|s2$|s²$/.test(u)) return ['a', 1, 'm/s²'];
    if (/km\/h|kph|por hora/.test(u)) return ['v', 1 / 3.6, 'm/s'];
    if (/\/s|por segundo/.test(u)) return ['v', 1, 'm/s'];
    if (/^(km|kilometro)/.test(u)) return ['L', 1000, 'm'];
    if (/^(cm|centimetro)/.test(u)) return ['L', 0.01, 'm'];
    if (/^min/.test(u)) return ['T', 60, 's'];
    if (/^(h|hr|hora)/.test(u)) return ['T', 3600, 's'];
    if (/^(seg|s)/.test(u)) return ['T', 1, 's'];
    if (/grado|°|º/.test(u)) return ['ang', 1, '°'];
    return ['L', 1, 'm'];
  }
  const ASKNAME = { t: 'el tiempo (t)', d: 'la distancia (d)', v: 'la velocidad (v)', a: 'la aceleración (a)', h: 'la altura (h)', v0: 'la velocidad inicial (v0)', vf: 'la velocidad final (vf)' };

  function detectAsk(tx) {
    const sents = tx.split(/(?<=[.!?])\s+/).filter(Boolean).reverse();
    const q = sents.find(s => s.includes('?')) || sents.find(s => /calcul|determin|hall|cuant|cual/.test(s)) || sents[0] || '';
    if (/inicial/.test(q)) return 'v0';
    if (/tiempo|tarda|demora|cuando|cuantos segundos|cuantas horas|cuantos minutos|\bdura\b/.test(q)) return 't';
    if (/aceler/.test(q)) return 'a';
    if (/altura|que tan alto/.test(q)) return 'h';
    if (/velocidad final|velocidad de impacto|rapidez de impacto|con que (?:velocidad|rapidez) (?:llega|impacta|choca|toca)/.test(q)) return 'vf';
    if (/velocidad|rapidez/.test(q)) return 'v';
    if (/distancia|recorr|lejos|avanz|desplaz|largo|alcance|cuantos metros|cuanto mide/.test(q)) return 'd';
    return null;
  }

  const FINAL_W = /final|alcanza|llega|adquiere|logra|hasta|termina|queda|impacta|\bvf\b/;
  const INIT_W = /inicial|parte|sale|lleva|viaja|se mueve|mueve|arranca|lanza|con (?:una )?(?:velocidad|rapidez)|va a|iba a|circula|corre|\bv0\b|\bcon\b/;

  function speedRoles(sp, rest, stop) {
    const roles = sp.map(q => q.label === 'v0' ? 'v0' : q.label === 'vf' ? 'vf' : FINAL_W.test(q.win) ? 'vf' : INIT_W.test(q.win) ? 'v0' : null);
    roles.forEach((r, i) => {
      if (r) return;
      const cur = roles.filter(Boolean);
      if (rest && !cur.includes('vf')) roles[i] = 'vf';
      else if (stop && !cur.includes('v0')) roles[i] = 'v0';
      else if (!cur.includes('v0')) roles[i] = 'v0';
      else if (!cur.includes('vf')) roles[i] = 'vf';
    });
    return { v0: sp[roles.indexOf('v0')] || null, vf: sp[roles.indexOf('vf')] || null };
  }

  function parseProblem(raw, g0) {
    const orig = String(raw || '').trim();
    if (!orig) return { error: 'Escribe primero el enunciado del problema.' };
    let tx = strip(orig.toLowerCase()).replace(/(\d),(\d)/g, '$1.$2').replace(/\s+/g, ' ');
    const notas = [];
    let g = g0;
    tx = tx.replace(/(?:\bg\b\s*=\s*|gravedad(?:\s+(?:de|es|igual a|=))?\s*)(\d+(?:\.\d+)?)(?:\s*m\/s(?:²|2|\^2))?/, (m, n) => { g = Number(n); notas.push('Usé g = ' + fmt(g) + ' m/s² (lo indicaste en el problema).'); return ' '; });

    const re = new RegExp(UNIT_RE, 'g'), qs = []; let m;
    while ((m = re.exec(tx))) {
      const [type, f, siU] = classify(m[2]);
      const prevEnd = qs.length ? qs[qs.length - 1].end : 0;
      let w = tx.slice(Math.max(prevEnd, m.index - 45), m.index);
      w = w.slice(w.search(/[^.;?!]*$/));
      const lb = (w.match(/(v0|vi|vf|v|a|t|d|x|h|y0)\s*=\s*$/) || [])[1];
      qs.push({ type, val: Number(m[1]) * f, f, siU, rawTxt: m[1].replace('.', ',') + ' ' + m[2], end: re.lastIndex, win: w, label: lb === 'v0' || lb === 'vi' ? 'v0' : lb === 'vf' ? 'vf' : null });
    }
    const of = t => qs.filter(q => q.type === t);
    const spQ = of('v'), aQ = of('a'), LQ = of('L'), TQ = of('T'), angQ = of('ang')[0];
    const D = (name, q) => name + ' = ' + fmt(q.val) + ' ' + q.siU + (q.f !== 1 ? '  (de ' + q.rawTxt + ')' : '');
    const ask = detectAsk(tx);
    const has = r => r.test(tx);

    const stopSrc = 'se detiene|se detuvo|detenerse|detener|hasta parar|se para\\b|llega al reposo|quedar? en reposo|queda(?:r)? detenid\\w*|hasta el reposo|hasta frenar';
    const stop = new RegExp(stopSrc).test(tx);
    const rest = /(?:desde|del|de) reposo|parte en reposo|arranca|(?:parte|sale|inicia|parten)\w* del reposo/.test(tx.replace(new RegExp(stopSrc, 'g'), ' '));
    const decel = has(/frena|frenado|frenar|desacel|retard/);

    const para = angQ || has(/parabol|oblicu|proyectil|horizontalmente|velocidad horizontal|tiro horizontal/);
    const enc = has(/se encuentran|encuentro|uno hacia el otro|hacia el otro|se acercan|sentido contrario|sentidos opuestos|opuest|al encuentro/);
    const alc = has(/alcanz\w*\s+(?:a|al)\s+(?!\d|un\b|una\b|velocidad)|da alcance|dar alcance|persigue|mismo sentido|ventaja/);
    const fall = has(/caida libre|\bcae\b|\bcaen\b|se suelta|\bsuelta|deja(?:n)? caer|verticalmente|hacia arriba|hacia abajo|vertical|se tira|se arroja|arrojan/);
    const media = has(/media|promedio/) && LQ.length >= 2 && LQ.length === TQ.length && !aQ.length;
    const mruv = aQ.length || spQ.length >= 2 || has(/acelera|aceler|desacel|frena|frenado|detenerse|se detiene|reposo|mruv|mrua|uniformemente variado|pasa de|aumenta su velocidad|disminuye su velocidad/);

    const fail = (error, tipo, datos) => ({ error, tipo, datos: datos || [], notas, g });
    const ok = (calc, vals, tipo, datos) => ({ calc, vals, tipo, datos, notas, ask, g });

    if (!qs.length) return fail('No encontré datos con unidades. Escribe cada número con su unidad (m, s, m/s, km/h, m/s², °). Ejemplo: «parte del reposo y acelera a 2 m/s² durante 8 s».');
    if (TQ.some(q => q.val < -1e-9)) return fail('El tiempo o duración no puede ser negativo (' + D('t', TQ.find(q => q.val < -1e-9)) + '). Debe cumplirse t ≥ 0.');

    if (para) {
      const horiz = has(/horizontal/);
      if (!spQ.length) return fail('Es un tiro parabólico, pero no encontré la rapidez inicial (por ejemplo «25 m/s»).', 'Movimiento parabólico (tiro oblicuo / horizontal)');
      if (!angQ && !horiz) return fail('Es un tiro parabólico, pero falta el ángulo (por ejemplo «30°») o decir que se lanza horizontalmente.', 'Movimiento parabólico (tiro oblicuo / horizontal)', [D('Rapidez inicial (v0)', spQ[0])]);
      const th = angQ ? angQ.val : 0, y0 = LQ.length ? LQ[0].val : 0;
      const datos = [D('Rapidez inicial (v0)', spQ[0]), 'Ángulo θ = ' + fmt(th) + '°' + (angQ ? '' : ' (tiro horizontal)'), 'Altura inicial (y0) = ' + fmt(y0) + ' m' + (LQ.length ? '' : '  (no la dijiste: asumí que sale del suelo)')];
      if (th === 0 && y0 === 0) return fail('En un tiro horizontal necesito la altura desde donde se lanza (por ejemplo «desde una mesa de 1,5 m»).', 'Movimiento parabólico (tiro horizontal)', datos);
      if (TQ.length) datos.push(D('Instante a consultar (t)', TQ[0]));
      return ok(7, { v0: spQ[0].val, th, y0, tq: TQ.length ? TQ[0].val : null }, 'Movimiento parabólico (tiro oblicuo / horizontal)', datos);
    }
    if (enc) {
      if (LQ.length < 1 || spQ.length < 2) return fail('Parece un problema de encuentro: necesito la distancia que los separa y las dos velocidades.', 'Encuentro (MRU, uno hacia el otro)');
      return ok(1, { d: LQ[0].val, v1: spQ[0].val, v2: spQ[1].val }, 'Encuentro (MRU, uno hacia el otro)', [D('Distancia que los separa', LQ[0]), D('Velocidad del móvil 1 (v1)', spQ[0]), D('Velocidad del móvil 2 (v2)', spQ[1])]);
    }
    if (alc && spQ.length >= 2) {
      if (LQ.length < 1) return fail('Parece un problema de alcance: necesito la ventaja (distancia) del móvil lento.', 'Alcance (MRU, mismo sentido)');
      const [fast, slow] = spQ[0].val >= spQ[1].val ? [spQ[0], spQ[1]] : [spQ[1], spQ[0]];
      return ok(2, { d: LQ[0].val, v1: fast.val, v2: slow.val }, 'Alcance (MRU, mismo sentido)', [D('Ventaja del lento', LQ[0]), D('Velocidad del rápido (v1)', fast), D('Velocidad del lento (v2)', slow)]);
    }
    if (fall) {
      const sube = has(/hacia arriba|ascend|\barriba\b/), baja = has(/hacia abajo|descend|\babajo\b/);
      if (!spQ.length && !(sube || baja)) {
        if (!LQ.length) return fail('Es una caída libre: necesito la altura desde donde se suelta (por ejemplo «45 m»). Si te dan el tiempo en vez de la altura, usa la pestaña MRUV con a = 9,8.', 'Caída libre (se suelta)');
        return ok(5, { h: LQ[0].val }, 'Caída libre (se suelta desde una altura)', [D('Altura (h)', LQ[0]), 'Velocidad inicial (v0) = 0 m/s  (se suelta)']);
      }
      if (!spQ.length) return fail('Es un lanzamiento vertical: necesito la velocidad inicial (por ejemplo «20 m/s»).', 'Lanzamiento vertical');
      const neg = baja && !sube, v0 = neg ? -spQ[0].val : spQ[0].val, y0 = LQ.length ? LQ[0].val : 0;
      return ok(6, { y0, v0 }, 'Lanzamiento vertical', [D('Velocidad inicial (v0)', spQ[0]) + (neg ? '  → negativa porque va hacia abajo' : ''), 'Altura inicial (y0) = ' + fmt(y0) + ' m' + (LQ.length ? '' : '  (no la dijiste: asumí que sale del suelo)')]);
    }
    if (media) {
      const tr = LQ.map((q, i) => q.val + ';' + TQ[i].val).join('\n');
      return ok(3, { tr }, 'Velocidad media por tramos', LQ.map((q, i) => 'Tramo ' + (i + 1) + ': ' + D('d', q) + ' en ' + D('t', TQ[i])));
    }
    if (mruv) {
      const k = {}, datos = [];
      const sr = speedRoles(spQ, rest, stop);
      if (sr.v0) { k.v0 = sr.v0.val; datos.push(D('Velocidad inicial (v0)', sr.v0)); }
      else if (rest) { k.v0 = 0; datos.push('Velocidad inicial (v0) = 0 m/s  («parte del reposo»)'); }
      if (sr.vf) { k.vf = sr.vf.val; datos.push(D('Velocidad final (vf)', sr.vf)); }
      else if (stop) { k.vf = 0; datos.push('Velocidad final (vf) = 0 m/s  («se detiene»)'); }
      if (aQ.length) {
        let a = aQ[0].val;
        if (decel && a > 0) { a = -a; notas.push('Como el móvil «frena», la aceleración es negativa.'); }
        k.a = a; datos.push('Aceleración (a) = ' + fmt(a) + ' m/s²');
      }
      if (TQ.length) { k.t = TQ[0].val; datos.push(D('Tiempo (t)', TQ[0])); }
      if (LQ.length) { k.d = LQ[0].val; datos.push(D('Distancia (d)', LQ[0])); }
      const n = Object.keys(k).length;
      const tipo = 'MRUV / MRUA (aceleración constante)';
      if (n < 3) return fail('Detecté ' + n + ' dato(s) y para el MRUV necesito 3 (de v0, vf, a, t, d). Agrega el que falta con su unidad.', tipo, datos);
      if (n > 3) return fail('Detecté ' + n + ' datos y para el MRUV uso exactamente 3. Quita el que sobra (el resto se calcula) o revísalos en la calculadora.', tipo, datos);
      return ok(4, { v0: 'v0' in k ? k.v0 : null, vf: 'vf' in k ? k.vf : null, a: 'a' in k ? k.a : null, t: 't' in k ? k.t : null, d: 'd' in k ? k.d : null }, tipo, datos);
    }
    const known = (LQ.length ? 1 : 0) + (spQ.length ? 1 : 0) + (TQ.length ? 1 : 0);
    const tipo = 'MRU (velocidad constante)';
    const datos = [];
    if (LQ.length) datos.push(D('Distancia (d)', LQ[0]));
    if (spQ.length) datos.push(D('Velocidad (v)', spQ[0]));
    if (TQ.length) datos.push(D('Tiempo (t)', TQ[0]));
    if (known === 3) return fail('Ya dan los tres datos (d, v y t), así que no hay incógnita. Revisa cuál es la que te piden.', tipo, datos);
    if (known < 2) return fail('No pude identificar el tipo de movimiento con esos datos. Necesito al menos dos entre distancia, velocidad y tiempo (MRU), o aceleración para MRUV.', tipo, datos);
    if (LQ.length > 1 || spQ.length > 1 || TQ.length > 1) notas.push('Había varios valores de la misma magnitud; usé el primero de cada una.');
    return ok(0, { d: LQ.length ? LQ[0].val : null, v: spQ.length ? spQ[0].val : null, t: TQ.length ? TQ[0].val : null }, tipo, datos);
  }

  const SAMPLES = 240;
  const curveP = (p, s0, s1, name, dash) => ({ name, dash: !!dash, pts: Array.from({ length: SAMPLES + 1 }, (_, i) => p(s0 + (s1 - s0) * i / SAMPLES)) });
  const curveXY = (f, a, b, name, dash) => curveP(s => [s, f(s)], a, b, name, dash);
  const poly = (pts, name, dash) => ({ name, dash: !!dash, pts });
  const pt = (x, y, name) => ({ x, y, name });
  const okT = x => isFinite(x) && x > 0;
  const TL = 't (s)';

  /* Una función por calculadora (mismo orden que CALCS). Devuelven la descripción de la
     gráfica: vistas con curvas, puntos y la posición del punto móvil según el tiempo. */
  const GRAPHS = [
    v => {
      let { d, v: vel, t } = v;
      if (d === null) d = vel * t; else if (vel === null) vel = d / t; else t = d / vel;
      if (!okT(t)) return null;
      const ext = t * 1.25;
      return {
        t0: 0, t1: t,
        info: s => 't = ' + fmt(s) + ' s   x = ' + fmt(vel * s) + ' m   v = ' + fmt(vel) + ' m/s',
        views: [
          { name: 'Posición vs tiempo', xl: TL, yl: 'x (m)', curves: [curveXY(s => vel * s, 0, ext, 'x = v·t')], points: [pt(0, 0, 'Salida'), pt(t, d, 'Llegada')], at: s => [[s, vel * s]] },
          { name: 'Velocidad vs tiempo', xl: TL, yl: 'v (m/s)', curves: [curveXY(() => vel, 0, ext, 'v constante')], points: [pt(t, vel, 'v')], at: s => [[s, vel]] }
        ]
      };
    },
    v => {
      const t = v.d / (v.v1 + v.v2);
      if (!okT(t)) return null;
      const ext = t * 1.4, x1 = s => v.v1 * s, x2 = s => v.d - v.v2 * s;
      return {
        t0: 0, t1: t,
        info: s => 't = ' + fmt(s) + ' s   x1 = ' + fmt(x1(s)) + ' m   x2 = ' + fmt(x2(s)) + ' m',
        views: [
          { name: 'Posición vs tiempo', xl: TL, yl: 'x (m)', curves: [curveXY(x1, 0, ext, 'Móvil 1'), curveXY(x2, 0, ext, 'Móvil 2')], points: [pt(0, 0, 'Salida 1'), pt(0, v.d, 'Salida 2'), pt(t, x1(t), 'Encuentro')], at: s => [[s, x1(s)], [s, x2(s)]] },
          { name: 'Velocidad vs tiempo', xl: TL, yl: 'v (m/s)', curves: [curveXY(() => v.v1, 0, ext, 'Móvil 1'), curveXY(() => -v.v2, 0, ext, 'Móvil 2 (sentido contrario)')], points: [], at: s => [[s, v.v1], [s, -v.v2]] }
        ]
      };
    },
    v => {
      const t = v.d / (v.v1 - v.v2);
      if (!okT(t)) return null;
      const ext = t * 1.4, x1 = s => v.v1 * s, x2 = s => v.d + v.v2 * s;
      return {
        t0: 0, t1: t,
        info: s => 't = ' + fmt(s) + ' s   x1 = ' + fmt(x1(s)) + ' m   x2 = ' + fmt(x2(s)) + ' m',
        views: [
          { name: 'Posición vs tiempo', xl: TL, yl: 'x (m)', curves: [curveXY(x1, 0, ext, 'Móvil rápido'), curveXY(x2, 0, ext, 'Móvil lento')], points: [pt(0, 0, 'Salida del rápido'), pt(0, v.d, 'Salida del lento'), pt(t, x1(t), 'Alcance')], at: s => [[s, x1(s)], [s, x2(s)]] },
          { name: 'Velocidad vs tiempo', xl: TL, yl: 'v (m/s)', curves: [curveXY(() => v.v1, 0, ext, 'Móvil rápido'), curveXY(() => v.v2, 0, ext, 'Móvil lento')], points: [], at: s => [[s, v.v1], [s, v.v2]] }
        ]
      };
    },
    v => {
      const seg = [];
      for (const line of String(v.tr).split('\n')) {
        if (!line.trim()) continue;
        const p = line.includes(';') ? line.split(';') : line.split(',');
        seg.push([Number(String(p[0]).replace(',', '.')), Number(String(p[1]).replace(',', '.'))]);
      }
      if (!seg.length) return null;
      const pts = [[0, 0]]; let T = 0, D = 0;
      seg.forEach(q => { T += q[1]; D += q[0]; pts.push([T, D]); });
      if (!okT(T)) return null;
      const at = s => {
        let i = 1; while (i < pts.length - 1 && s > pts[i][0]) i++;
        const [t0, x0] = pts[i - 1], [t1, x1] = pts[i];
        return { i: i - 1, x: t1 > t0 ? x0 + (x1 - x0) * (s - t0) / (t1 - t0) : x1 };
      };
      const vm = D / T;
      const views = [{ name: 'Posición vs tiempo', xl: TL, yl: 'x (m)', curves: [poly(pts, 'Recorrido'), poly([[0, 0], [T, D]], 'Velocidad media', true)],
        points: pts.map((p, i) => pt(p[0], p[1], i === 0 ? 'Salida' : 'Fin tramo ' + i)), at: s => [[s, at(s).x]] }];
      if (seg.every(q => q[1] > 0)) {
        views.push({ name: 'Velocidad vs tiempo', xl: TL, yl: 'v (m/s)',
          curves: seg.map((q, i) => poly([[pts[i][0], q[0] / q[1]], [pts[i + 1][0], q[0] / q[1]]], 'Tramo ' + (i + 1))).concat([poly([[0, vm], [T, vm]], 'Velocidad media', true)]),
          points: [], at: s => { const k = at(s).i; return [[s, seg[k][0] / seg[k][1]]]; } });
      }
      return { t0: 0, t1: T, info: s => 't = ' + fmt(s) + ' s   x = ' + fmt(at(s).x) + ' m   v media = ' + fmt(vm) + ' m/s', views };
    },
    v => {
      const k = {};
      for (const key in v) if (v[key] !== null) k[key] = v[key];
      const sols = solveMRUV(k).filter(s => okT(s.t));
      if (!sols.length) return null;
      const multi = sols.length > 1, T = Math.max(...sols.map(s => s.t));
      const X = (s, u) => s.v0 * u + 0.5 * s.a * u * u, V = (s, u) => s.v0 + s.a * u;
      const nm = (i, base) => multi ? 'Solución ' + (i + 1) : base;
      const pp = [pt(0, 0, 'Inicio')], vp = [];
      sols.forEach((s, i) => {
        pp.push(pt(s.t, X(s, s.t), multi ? 'Final ' + (i + 1) : 'Final'));
        vp.push(pt(0, s.v0, multi ? 'v0 (sol. ' + (i + 1) + ')' : 'v0'), pt(s.t, s.vf, multi ? 'vf (sol. ' + (i + 1) + ')' : 'vf'));
        const tr = s.a ? -s.v0 / s.a : -1;
        if (tr > 1e-9 && tr < s.t - 1e-9) { pp.push(pt(tr, X(s, tr), 'Cambio de sentido')); vp.push(pt(tr, 0, 'v = 0')); }
      });
      return {
        t0: 0, t1: T,
        info: s => sols.map((q, i) => { const u = Math.min(s, q.t); return (multi ? 'Sol. ' + (i + 1) + ': ' : '') + 't = ' + fmt(u) + ' s   x = ' + fmt(X(q, u)) + ' m   v = ' + fmt(V(q, u)) + ' m/s'; }).join('   |   '),
        views: [
          { name: 'Posición vs tiempo', xl: TL, yl: 'x (m)', curves: sols.map((s, i) => curveXY(u => X(s, u), 0, s.t, nm(i, 'x(t) = v0·t + ½·a·t²'))), points: pp, at: s => sols.map(q => { const u = Math.min(s, q.t); return [u, X(q, u)]; }) },
          { name: 'Velocidad vs tiempo', xl: TL, yl: 'v (m/s)', curves: sols.map((s, i) => curveXY(u => V(s, u), 0, s.t, nm(i, 'v(t) = v0 + a·t'))), points: vp, at: s => sols.map(q => { const u = Math.min(s, q.t); return [u, V(q, u)]; }) }
        ]
      };
    },
    (v, g) => {
      const T = Math.sqrt(2 * v.h / g);
      if (!okT(T)) return null;
      const Y = s => v.h - 0.5 * g * s * s;
      return {
        t0: 0, t1: T,
        info: s => 't = ' + fmt(s) + ' s   y = ' + fmt(Y(s)) + ' m   v = ' + fmt(-g * s) + ' m/s',
        views: [
          { name: 'Altura vs tiempo', xl: TL, yl: 'y (m)', curves: [curveXY(Y, 0, T, 'y = h − ½·g·t²')], points: [pt(0, v.h, 'Suelta'), pt(T, 0, 'Impacto')], at: s => [[s, Y(s)]] },
          { name: 'Velocidad vs tiempo', xl: TL, yl: 'v (m/s)', curves: [curveXY(s => -g * s, 0, T, 'v = −g·t')], points: [pt(T, -g * T, 'Impacto')], at: s => [[s, -g * s]] }
        ]
      };
    },
    (v, g) => {
      const { y0, v0 } = v, T = (v0 + Math.sqrt(v0 * v0 + 2 * g * y0)) / g;
      if (!okT(T)) return null;
      const Y = s => y0 + v0 * s - 0.5 * g * s * s, V = s => v0 - g * s;
      const pp = [pt(0, y0, 'Lanzamiento')], vp = [pt(0, v0, 'v0')];
      if (v0 > 0) { const ts = v0 / g; pp.push(pt(ts, Y(ts), 'Altura máxima')); vp.push(pt(ts, 0, 'Cima')); }
      pp.push(pt(T, 0, 'Suelo')); vp.push(pt(T, V(T), 'Llegada'));
      return {
        t0: 0, t1: T,
        info: s => 't = ' + fmt(s) + ' s   y = ' + fmt(Y(s)) + ' m   v = ' + fmt(V(s)) + ' m/s',
        views: [
          { name: 'Altura vs tiempo', xl: TL, yl: 'y (m)', curves: [curveXY(Y, 0, T, 'y = y0 + v0·t − ½·g·t²')], points: pp, at: s => [[s, Y(s)]] },
          { name: 'Velocidad vs tiempo', xl: TL, yl: 'v (m/s)', curves: [curveXY(V, 0, T, 'v = v0 − g·t')], points: vp, at: s => [[s, V(s)]] }
        ]
      };
    },
    (v, g) => {
      const r = v.th * Math.PI / 180, v0x = v.v0 * Math.cos(r), v0y = v.v0 * Math.sin(r), y0 = v.y0;
      const T = (v0y + Math.sqrt(v0y * v0y + 2 * g * y0)) / g;
      if (!okT(T)) return null;
      const Y = s => y0 + v0y * s - 0.5 * g * s * s, VY = s => v0y - g * s;
      const pp = [pt(0, y0, 'Lanzamiento')], hp = [pt(0, y0, 'Lanzamiento')];
      if (v0y > 0) { const ts = v0y / g; pp.push(pt(v0x * ts, Y(ts), 'Altura máxima')); hp.push(pt(ts, Y(ts), 'Altura máxima')); }
      pp.push(pt(v0x * T, 0, 'Impacto')); hp.push(pt(T, 0, 'Impacto'));
      if (v.tq !== null && v.tq >= 0 && v.tq <= T) { pp.push(pt(v0x * v.tq, Y(v.tq), 't = ' + fmt(v.tq) + ' s')); hp.push(pt(v.tq, Y(v.tq), 't = ' + fmt(v.tq) + ' s')); }
      return {
        t0: 0, t1: T,
        info: s => 't = ' + fmt(s) + ' s   x = ' + fmt(v0x * s) + ' m   y = ' + fmt(Y(s)) + ' m   |v| = ' + fmt(Math.hypot(v0x, VY(s))) + ' m/s',
        views: [
          { name: 'Trayectoria (y vs x)', xl: 'x (m)', yl: 'y (m)', equal: true, curves: [curveP(s => [v0x * s, Y(s)], 0, T, 'Trayectoria')], points: pp, at: s => [[v0x * s, Y(s)]] },
          { name: 'Altura vs tiempo', xl: TL, yl: 'y (m)', curves: [curveXY(Y, 0, T, 'y(t)')], points: hp, at: s => [[s, Y(s)]] },
          { name: 'Velocidad vs tiempo', xl: TL, yl: 'v (m/s)', curves: [curveXY(() => v0x, 0, T, 'vx (constante)'), curveXY(VY, 0, T, 'vy = v0y − g·t')], points: [pt(T, VY(T), 'vy al impactar')], at: s => [[s, v0x], [s, VY(s)]] }
        ]
      };
    }
  ];

  function graphFor(i, vals, g) {
    try {
      const gr = GRAPHS[i](vals, g);
      if (!gr) return null;
      const bad = gr.views.some(w => w.curves.some(c => c.pts.some(p => !isFinite(p[0]) || !isFinite(p[1]))) || w.points.some(p => !isFinite(p.x) || !isFinite(p.y)));
      return bad ? null : gr;
    } catch (e) { return null; }
  }

  /* Escenas de la simulación (misma física que la gráfica, pero dibujada como un juego). */
  function simFor(i, v, g) {
    try {
      const gr = graphFor(i, v, g);
      if (!gr) return null;
      const T = gr.t1, base = { t0: gr.t0, t1: T, info: gr.info };
      const maxOver = f => { let m = -Infinity; for (let n = 0; n <= 200; n++) m = Math.max(m, f(T * n / 200)); return m; };
      let sp = null;
      if (i === 0) {
        let { d, v: vel } = v; if (d === null) d = vel * v.t; else if (vel === null) vel = d / v.t;
        sp = { kind: 'road', lanes: [{ name: 'Móvil', x: s => vel * s, v: () => vel }], marks: [{ x: 0, label: 'Salida' }, { x: d, label: 'Meta' }], range: [Math.min(0, d), Math.max(0, d)] };
      } else if (i === 1) {
        const x1 = s => v.v1 * s, x2 = s => v.d - v.v2 * s;
        sp = { kind: 'road', lanes: [{ name: 'Móvil 1', x: x1, v: () => v.v1 }, { name: 'Móvil 2', x: x2, v: () => -v.v2 }],
          marks: [{ x: 0, label: 'Salida 1' }, { x: v.d, label: 'Salida 2' }, { x: x1(T), label: 'Encuentro', meet: true }], range: [0, v.d] };
      } else if (i === 2) {
        const x1 = s => v.v1 * s, x2 = s => v.d + v.v2 * s, xe = x1(T);
        sp = { kind: 'road', lanes: [{ name: 'Rápido', x: x1, v: () => v.v1 }, { name: 'Lento', x: x2, v: () => v.v2 }],
          marks: [{ x: 0, label: 'Salida del rápido' }, { x: v.d, label: 'Salida del lento' }, { x: xe, label: 'Alcance', meet: true }], range: [0, xe * 1.04] };
      } else if (i === 3) {
        const seg = [], pts = [[0, 0]]; let TT = 0, D = 0;
        for (const line of String(v.tr).split('\n')) {
          if (!line.trim()) continue;
          const p = line.includes(';') ? line.split(';') : line.split(',');
          seg.push([Number(String(p[0]).replace(',', '.')), Number(String(p[1]).replace(',', '.'))]);
        }
        seg.forEach(q => { TT += q[1]; D += q[0]; pts.push([TT, D]); });
        const at = s => {
          let k = 1; while (k < pts.length - 1 && s > pts[k][0]) k++;
          const [t0, x0] = pts[k - 1], [t1, x1] = pts[k];
          return { i: k - 1, x: t1 > t0 ? x0 + (x1 - x0) * (s - t0) / (t1 - t0) : x1 };
        };
        sp = { kind: 'road', lanes: [{ name: 'Móvil', x: s => at(s).x, v: s => { const q = seg[at(s).i]; return q[1] > 0 ? q[0] / q[1] : 0; } }],
          marks: pts.map((p, k) => ({ x: p[1], label: k === 0 ? 'Salida' : 'Fin tramo ' + k })), range: [Math.min(0, D), Math.max(0, D)] };
      } else if (i === 4) {
        const k = {};
        for (const key in v) if (v[key] !== null) k[key] = v[key];
        const sols = solveMRUV(k).filter(s => okT(s.t)), multi = sols.length > 1;
        const X = (s, u) => s.v0 * u + 0.5 * s.a * u * u, V = (s, u) => s.v0 + s.a * u;
        let lo = 0, hi = 0;
        sols.forEach(s => { for (let n = 0; n <= 120; n++) { const x = X(s, s.t * n / 120); lo = Math.min(lo, x); hi = Math.max(hi, x); } });
        sp = { kind: 'road', range: [lo, hi],
          lanes: sols.map((s, j) => ({ name: multi ? 'Solución ' + (j + 1) : 'Móvil', x: u => X(s, Math.min(u, s.t)), v: u => V(s, Math.min(u, s.t)) })),
          marks: [{ x: 0, label: 'Inicio' }].concat(sols.map((s, j) => ({ x: X(s, s.t), label: multi ? 'Final ' + (j + 1) : 'Final' }))) };
      } else if (i === 5) {
        const h = v.h;
        sp = { kind: 'world', x: () => 0, y: s => h - 0.5 * g * s * s, vx: () => 0, vy: s => -g * s, y0: h, platform: true, launcher: null, ymax: h, xmin: 0, xmax: 0, strobe: 10, marks: [{ x: 0, y: 0, label: 'Impacto' }] };
      } else if (i === 6) {
        const { y0, v0 } = v, Y = s => y0 + v0 * s - 0.5 * g * s * s;
        const marks = [{ x: 0, y: 0, label: 'Suelo' }]; let ymax = y0;
        if (v0 > 0) { const hm = y0 + v0 * v0 / (2 * g); ymax = hm; marks.push({ x: 0, y: hm, label: 'Altura máxima' }); }
        sp = { kind: 'world', x: () => 0, y: Y, vx: () => 0, vy: s => v0 - g * s, y0, platform: y0 > 0, launcher: null, ymax, xmin: 0, xmax: 0, strobe: 10, marks };
      } else if (i === 7) {
        const r = v.th * Math.PI / 180, v0x = v.v0 * Math.cos(r), v0y = v.v0 * Math.sin(r), y0 = v.y0;
        const Y = s => y0 + v0y * s - 0.5 * g * s * s, R = v0x * T;
        const marks = [{ x: R, y: 0, label: 'Impacto' }];
        if (v0y > 0) { const ts = v0y / g; marks.push({ x: v0x * ts, y: Y(ts), label: 'Altura máxima' }); }
        sp = { kind: 'world', x: s => v0x * s, y: Y, vx: () => v0x, vy: s => v0y - g * s, y0, platform: y0 > 0, launcher: v.th !== 0 ? { th: v.th } : null,
          ymax: Math.max(y0, maxOver(Y)), xmin: Math.min(0, R), xmax: Math.max(0, R), strobe: 12, marks };
      }
      if (!sp) return null;
      if (sp.kind === 'world') sp.vmax = Math.max(maxOver(s => Math.hypot(sp.vx(s), sp.vy(s))), 1e-9);
      return Object.assign(base, sp);
    } catch (e) { return null; }
  }

  if (typeof module !== 'undefined') module.exports = { CALCS, solveMRUV, parseProblem, graphFor, simFor, buildGraph, buildSim };
  if (typeof document === 'undefined') return;


  const app = document.getElementById('cin-app');
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const parse = s => { s = s.trim().replace(',', '.'); if (s === '') return null; const x = Number(s); return isNaN(x) ? NaN : x; };
  const gEl = document.getElementById('cin-g');
  const getG = () => {
    const g = parse(gEl.value);
    if (!g || g <= 0) throw new Error('La gravedad g debe ser un número positivo.');
    return g;
  };
  const errHTML = msg => '<div class="cin-err">' + esc(msg) + '</div>';

  function resultHTML(res, ask, hasGraph, hasSim) {
    const hitTag = tag => ask && tag && (tag === ask || (ask === 'v' && /^v/.test(tag)));
    let h = '<div class="cin-res"><div class="cin-ttl">Resultados</div>' + res.rows.map(r => {
      if (r[1] === null) return '<div class="cin-h">' + esc(r[0]) + '</div>';
      const given = r[3] === false, hit = !given && hitTag(r[4]);
      return '<div class="cin-row' + (hit ? ' ask' : '') + '"><span>' + esc(r[0]) + (hit ? ' <i class="cin-tag">lo que piden</i>' : '') + '</span><b' + (given ? ' class="given"' : '') + '>' + fmt(r[1]) + ' ' + esc(r[2]) + '</b></div>';
    }).join('') + '</div>';
    if (hasGraph || hasSim) h += '<div class="cin-act">' + (hasGraph ? '<button type="button" class="cin-go cin-showg" aria-expanded="false">Ver gráfica</button>' : '') + (hasSim ? '<button type="button" class="cin-go cin-shows" aria-expanded="false">Ver simulación</button>' : '') + '</div>' +
      (hasGraph ? '<div class="cin-panel cin-graph" hidden></div>' : '') + (hasSim ? '<div class="cin-panel cin-sim" hidden></div>' : '');
    if (res.steps && res.steps.length) {
      h += '<details class="cin-proc" open><summary>Procedimiento paso a paso</summary><ol class="cin-steps">' + res.steps.map(s =>
        '<li><div class="cin-st">' + esc(s.t) + '</div>' + s.l.map(l => '<div class="cin-ln' + (s.fin ? ' fin' : '') + '">' + esc(l) + '</div>').join('') + '</li>').join('') + '</ol></details>';
    }
    return h;
  }

  /* ---------- Gráfica interactiva (estilo GeoGebra) ---------- */
  const PALETTE = { l: ['#2a5fe0', '#d63a6e', '#12805c', '#7a45d6'], d: ['#8fb4ff', '#ff8fb3', '#6ee7b7', '#c4a3ff'] };
  const isDark = () => {
    const theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  };
  const niceStep = raw => { const p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p; return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * p; };
  const numLabel = (x, step) => {
    const dec = Math.min(6, Math.max(0, -Math.floor(Math.log10(step) + 1e-9)));
    let s = x.toFixed(dec); if (+s === 0) s = (0).toFixed(dec);
    return s.replace('.', ',');
  };

  function buildGraph(box, spec) {
    box.innerHTML =
      '<div class="cin-gtabs"></div>' +
      '<div class="cin-gwrap"><canvas class="cin-gcv" role="img" aria-label="Gráfica interactiva del problema"></canvas>' +
      '<div class="cin-gtools"><button type="button" data-a="in" aria-label="Acercar">+</button><button type="button" data-a="out" aria-label="Alejar">&minus;</button><button type="button" data-a="fit">Ajustar vista</button></div></div>' +
      '<div class="cin-glegend"></div>' +
      '<div class="cin-gslider"><button type="button" class="cin-reset cin-gplay">Reproducir</button><input type="range" min="0" max="1000" value="0" aria-label="Instante de tiempo"><div class="cin-ginfo"></div></div>' +
      '<p class="cin-note">Arrastra para mover la vista; usa la rueda del mouse o los botones + y − para acercar. Pasa el cursor sobre una curva para ver sus coordenadas y mueve el deslizador para ver el movimiento.</p>';
    const cv = box.querySelector('canvas'), ctx = cv.getContext('2d');
    const tabs = box.querySelector('.cin-gtabs'), legend = box.querySelector('.cin-glegend');
    const slider = box.querySelector('input[type=range]'), info = box.querySelector('.cin-ginfo'), playBtn = box.querySelector('.cin-gplay');
    const views = spec.views, vs = views.map(() => null), FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
    let cur = 0, W = 0, H = 0, hover = null, raf = null;
    const pal = () => PALETTE[isDark() ? 'd' : 'l'];
    const tNow = () => spec.t0 + (spec.t1 - spec.t0) * slider.value / 1000;

    function setLegend() {
      const p = pal();
      legend.innerHTML = views[cur].curves.map((c, i) => c.name ? '<span><i style="background:' + p[i % p.length] + (c.dash ? ';opacity:.6' : '') + '"></i>' + esc(c.name) + '</span>' : '').join('');
    }
    function fit(i) {
      const w = views[i]; let x0 = 0, x1 = 0, y0 = 0, y1 = 0;
      const add = (x, y) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); };
      w.curves.forEach(c => c.pts.forEach(q => add(q[0], q[1])));
      w.points.forEach(q => add(q.x, q.y));
      let dx = x1 - x0, dy = y1 - y0;
      if (dx < 1e-9) dx = 1;
      if (dy < 1e-9) dy = 1;
      const PL = 54, PR = 26, PT = 28, PB = 42;
      let sx = (W - PL - PR) / dx, sy = (H - PT - PB) / dy;
      if (w.equal) sx = sy = Math.min(sx, sy);
      vs[i] = { sx, sy, cx: (x0 + x1) / 2 - ((PL - PR) / 2) / sx, cy: (y0 + y1) / 2 - ((PB - PT) / 2) / sy };
    }
    function zoomAt(px, py, f) {
      const v = vs[cur]; if (!v) return;
      f = Math.min(Math.max(f, 1e-3), 1e3);
      if (v.sx * f < 1e-7 || v.sx * f > 1e9 || v.sy * f < 1e-7 || v.sy * f > 1e9) return;
      const wx = v.cx + (px - W / 2) / v.sx, wy = v.cy - (py - H / 2) / v.sy;
      v.sx *= f; v.sy *= f;
      v.cx = wx - (px - W / 2) / v.sx; v.cy = wy + (py - H / 2) / v.sy;
      draw();
    }

    function draw() {
      const dpr = window.devicePixelRatio || 1;
      W = cv.clientWidth; H = cv.clientHeight;
      if (!W || !H) return;
      const pw = Math.round(W * dpr), ph = Math.round(H * dpr);
      if (cv.width !== pw || cv.height !== ph) { cv.width = pw; cv.height = ph; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!vs[cur]) { fit(cur); setLegend(); }
      const v = vs[cur], w = views[cur], css = getComputedStyle(app), col = n => css.getPropertyValue(n).trim(), p = pal();
      const bg = col('--card'), tx = col('--tx'), mut = col('--mut'), bd = col('--bd');
      const X = x => W / 2 + (x - v.cx) * v.sx, Y = y => H / 2 - (y - v.cy) * v.sy;
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      const xa = v.cx - W / 2 / v.sx, xb = v.cx + W / 2 / v.sx, ya = v.cy - H / 2 / v.sy, yb = v.cy + H / 2 / v.sy;
      const stX = niceStep(90 / v.sx), stY = niceStep(64 / v.sy);
      const sub = st => { const m = Math.round(st / Math.pow(10, Math.floor(Math.log10(st)))); return st / (m === 2 ? 4 : 5); };
      const grid = (stx, sty, alpha) => {
        ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = bd; ctx.lineWidth = 1; ctx.beginPath();
        let n0 = Math.ceil(xa / stx), n1 = Math.floor(xb / stx);
        if (n1 - n0 < 600) for (let n = n0; n <= n1; n++) { const px = Math.round(X(n * stx)) + 0.5; ctx.moveTo(px, 0); ctx.lineTo(px, H); }
        n0 = Math.ceil(ya / sty); n1 = Math.floor(yb / sty);
        if (n1 - n0 < 600) for (let n = n0; n <= n1; n++) { const py = Math.round(Y(n * sty)) + 0.5; ctx.moveTo(0, py); ctx.lineTo(W, py); }
        ctx.stroke(); ctx.restore();
      };
      if (sub(stX) * v.sx >= 9 && sub(stY) * v.sy >= 9) grid(sub(stX), sub(stY), 0.3);
      grid(stX, stY, 0.9);

      const ax = Math.min(Math.max(X(0), 0), W), ay = Math.min(Math.max(Y(0), 0), H);
      ctx.strokeStyle = tx; ctx.lineWidth = 1.6; ctx.beginPath();
      ctx.moveTo(0, ay + 0.5); ctx.lineTo(W, ay + 0.5); ctx.moveTo(ax + 0.5, 0); ctx.lineTo(ax + 0.5, H); ctx.stroke();

      const halo = (s, x, y) => { ctx.lineWidth = 3; ctx.strokeStyle = bg; ctx.lineJoin = 'round'; ctx.strokeText(s, x, y); ctx.fillText(s, x, y); };
      ctx.font = '12px ' + FONT; ctx.fillStyle = mut;
      const labY = ay < H - 22 ? ay + 15 : ay - 7, leftSide = ax > 46, labX = leftSide ? ax - 6 : ax + 6;
      ctx.textAlign = 'center';
      for (let n = Math.ceil(xa / stX); n <= Math.floor(xb / stX) && n < 600; n++) { if (n !== 0) halo(numLabel(n * stX, stX), X(n * stX), labY); }
      ctx.textAlign = leftSide ? 'right' : 'left';
      for (let n = Math.ceil(ya / stY); n <= Math.floor(yb / stY) && n < 600; n++) { if (n !== 0) halo(numLabel(n * stY, stY), labX, Y(n * stY) + 4); }
      halo('0', labX, labY);
      ctx.font = 'bold 12px ' + FONT; ctx.fillStyle = tx; ctx.textAlign = 'right';
      halo(w.xl, W - 8, ay < H - 44 ? ay + 32 : ay - 24);
      if (ax < W - 100) { ctx.textAlign = 'left'; halo(w.yl, ax + 8, 16); } else { ctx.textAlign = 'right'; halo(w.yl, ax - 8, 16); }

      ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.lineWidth = 3;
      w.curves.forEach((c, i) => {
        ctx.strokeStyle = p[i % p.length]; ctx.setLineDash(c.dash ? [9, 6] : []); ctx.beginPath();
        c.pts.forEach((q, j) => { if (j) ctx.lineTo(X(q[0]), Y(q[1])); else ctx.moveTo(X(q[0]), Y(q[1])); });
        ctx.stroke();
      });
      ctx.setLineDash([]);

      ctx.font = '12px ' + FONT;
      w.points.forEach((q, i) => {
        const px = X(q.x), py = Y(q.y);
        if (px < -20 || px > W + 20 || py < -20 || py > H + 20) return;
        ctx.fillStyle = tx; ctx.beginPath(); ctx.arc(px, py, 5, 0, 7); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = bg; ctx.stroke();
        const s = q.name + ' (' + fmt(q.x) + '; ' + fmt(q.y) + ')', right = px + 10 + ctx.measureText(s).width > W - 4;
        ctx.fillStyle = tx; ctx.textAlign = right ? 'right' : 'left';
        halo(s, right ? px - 10 : px + 10, py + (i % 2 ? 18 : -9));
      });

      const t = tNow();
      (w.at ? w.at(t) : []).forEach((q, j) => {
        const px = X(q[0]), py = Y(q[1]), c = p[j % p.length];
        ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = c; ctx.globalAlpha = 0.7; ctx.lineWidth = 1.5; ctx.beginPath();
        ctx.moveTo(px, py); ctx.lineTo(px, ay); ctx.moveTo(px, py); ctx.lineTo(ax, py); ctx.stroke(); ctx.restore();
        ctx.fillStyle = c; ctx.beginPath(); ctx.arc(px, py, 7, 0, 7); ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = bg; ctx.stroke();
      });

      if (hover) {
        let best = null, bestD = 18 * 18;
        w.curves.forEach(c => {
          for (let k = 1; k < c.pts.length; k++) {
            const a = c.pts[k - 1], b = c.pts[k], ax_ = X(a[0]), ay_ = Y(a[1]), bx_ = X(b[0]), by_ = Y(b[1]);
            const dx = bx_ - ax_, dy = by_ - ay_, L2 = dx * dx + dy * dy;
            const u = L2 ? Math.min(1, Math.max(0, ((hover[0] - ax_) * dx + (hover[1] - ay_) * dy) / L2)) : 0;
            const ex = ax_ + u * dx - hover[0], ey = ay_ + u * dy - hover[1], d2 = ex * ex + ey * ey;
            if (d2 < bestD) { bestD = d2; best = [a[0] + u * (b[0] - a[0]), a[1] + u * (b[1] - a[1])]; }
          }
        });
        if (best) {
          const px = X(best[0]), py = Y(best[1]), s = '(' + fmt(best[0]) + '; ' + fmt(best[1]) + ')';
          ctx.font = 'bold 12px ' + FONT;
          const tw = ctx.measureText(s).width + 14;
          let bx = px + 12, by = py - 32;
          if (bx + tw > W - 4) bx = px - 12 - tw;
          if (by < 4) by = py + 12;
          ctx.fillStyle = bg; ctx.strokeStyle = tx; ctx.lineWidth = 1.5; ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(bx, by, tw, 22, 6); else ctx.rect(bx, by, tw, 22);
          ctx.fill(); ctx.stroke();
          ctx.fillStyle = tx; ctx.textAlign = 'left'; ctx.fillText(s, bx + 7, by + 15);
          ctx.beginPath(); ctx.arc(px, py, 5, 0, 7); ctx.lineWidth = 2; ctx.strokeStyle = tx; ctx.stroke();
        }
      }
      info.textContent = spec.info(t);
    }

    views.forEach((w, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = w.name; if (i === 0) b.className = 'on';
      b.onclick = () => { cur = i; [].forEach.call(tabs.children, (x, j) => x.classList.toggle('on', j === i)); hover = null; if (vs[i]) setLegend(); draw(); };
      tabs.appendChild(b);
    });
    if (views.length < 2) tabs.hidden = true;

    const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const ptrs = new Map();
    cv.addEventListener('pointerdown', e => { cv.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, pos(e)); hover = null; });
    cv.addEventListener('pointermove', e => {
      const q = pos(e), v = vs[cur];
      if (ptrs.has(e.pointerId) && v) {
        const old = ptrs.get(e.pointerId);
        if (ptrs.size === 1) {
          v.cx -= (q[0] - old[0]) / v.sx; v.cy += (q[1] - old[1]) / v.sy; ptrs.set(e.pointerId, q); draw();
        } else if (ptrs.size === 2) {
          const other = [...ptrs].find(([id]) => id !== e.pointerId)[1];
          const d0 = Math.hypot(old[0] - other[0], old[1] - other[1]), d1 = Math.hypot(q[0] - other[0], q[1] - other[1]);
          ptrs.set(e.pointerId, q);
          if (d0 > 5) zoomAt((q[0] + other[0]) / 2, (q[1] + other[1]) / 2, d1 / d0);
        }
      } else { hover = q; draw(); }
    });
    const up = e => ptrs.delete(e.pointerId);
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    cv.addEventListener('pointerleave', () => { hover = null; draw(); });
    cv.addEventListener('wheel', e => { e.preventDefault(); const q = pos(e); zoomAt(q[0], q[1], Math.exp(-e.deltaY * 0.0015)); }, { passive: false });
    box.querySelector('.cin-gtools').addEventListener('click', e => {
      const a = e.target.closest('button'); if (!a) return;
      if (a.dataset.a === 'in') zoomAt(W / 2, H / 2, 1.3);
      else if (a.dataset.a === 'out') zoomAt(W / 2, H / 2, 1 / 1.3);
      else { fit(cur); draw(); }
    });

    slider.addEventListener('input', draw);
    const stop = () => { if (raf) cancelAnimationFrame(raf); raf = null; playBtn.textContent = 'Reproducir'; };
    playBtn.onclick = () => {
      if (raf) { stop(); return; }
      let f0 = slider.value / 1000; if (f0 >= 0.999) f0 = 0;
      const t0 = performance.now(); playBtn.textContent = 'Pausa';
      const stepF = now => {
        const f = f0 + (now - t0) / 4500;
        if (f >= 1) { slider.value = 1000; draw(); stop(); return; }
        slider.value = f * 1000; draw(); raf = requestAnimationFrame(stepF);
      };
      raf = requestAnimationFrame(stepF);
    };
    if (window.ResizeObserver) new window.ResizeObserver(draw).observe(cv); else window.addEventListener('resize', draw);
    if (window.MutationObserver) {
      const themeObserver = new window.MutationObserver(() => {
        setLegend();
        draw();
      });
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }
    draw();
  }

  /* ---------- Simulación animada (escena tipo juego) ---------- */
  const SCENE = {
    l: { skyA: '#8fcbff', skyB: '#eaf6ff', ground: '#8fd0a0', groundD: '#5fae78', road: '#4a505c', line: '#f1f3f6', txt: '#22304d', build: '#9aa8c4', buildD: '#7c8bab', win: '#fff3b0', ball: '#e0531f', flag: '#d63a6e' },
    d: { skyA: '#0d1828', skyB: '#2a4468', ground: '#2f5d49', groundD: '#244838', road: '#20242b', line: '#aab3c2', txt: '#eef4ee', build: '#51607f', buildD: '#3f4c68', win: '#ffe58a', ball: '#ff9a5a', flag: '#ff8fb3' }
  };

  function buildSim(box, spec) {
    box.innerHTML =
      '<div class="cin-gwrap"><canvas class="cin-gcv cin-scv" role="img" aria-label="Simulación animada del problema"></canvas></div>' +
      '<div class="cin-gslider"><button type="button" class="cin-reset cin-splay">Reproducir</button><button type="button" class="cin-reset cin-srep">Repetir</button>' +
      '<label class="cin-ssp">Velocidad<select><option value="12000">Lenta</option><option value="7000" selected>Normal</option><option value="3500">Rápida</option></select></label>' +
      '<input type="range" min="0" max="1000" value="0" aria-label="Instante de tiempo"><div class="cin-ginfo"></div></div>' +
      '<p class="cin-note">Pulsa Reproducir para ver el movimiento. Puedes pausar, mover el deslizador para ir a cualquier instante o cambiar la velocidad de la animación. Las flechas indican la velocidad: la grande es la total y las finas son sus componentes horizontal y vertical.</p>';
    const cv = box.querySelector('canvas'), ctx = cv.getContext('2d');
    const slider = box.querySelector('input[type=range]'), info = box.querySelector('.cin-ginfo'), playBtn = box.querySelector('.cin-splay'), sel = box.querySelector('select');
    const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
    let W = 0, H = 0, raf = null;
    const tNow = () => spec.t0 + (spec.t1 - spec.t0) * slider.value / 1000;

    const rr = (x, y, w, h, r) => { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); };
    const circle = (x, y, r) => { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); };
    const arrow = (x0, y0, x1, y1, color, lw) => {
      const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy); if (L < 3) return;
      const a = Math.atan2(dy, dx), hl = Math.min(11, L * 0.5);
      ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - hl * 0.6 * Math.cos(a), y1 - hl * 0.6 * Math.sin(a)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - hl * Math.cos(a - 0.45), y1 - hl * Math.sin(a - 0.45)); ctx.lineTo(x1 - hl * Math.cos(a + 0.45), y1 - hl * Math.sin(a + 0.45)); ctx.closePath(); ctx.fill(); ctx.restore();
    };
    function car(cx, yb, dir, color, ang) {
      ctx.save(); ctx.translate(cx, yb); ctx.scale(dir, 1);
      ctx.fillStyle = color; rr(-28, -22, 56, 16, 5); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-14, -22); ctx.lineTo(-8, -34); ctx.lineTo(10, -34); ctx.lineTo(17, -22); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.8)';
      ctx.beginPath(); ctx.moveTo(-9, -23); ctx.lineTo(-5, -31.5); ctx.lineTo(1, -31.5); ctx.lineTo(1, -23); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(4, -23); ctx.lineTo(4, -31.5); ctx.lineTo(9, -31.5); ctx.lineTo(13, -23); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ffe58a'; ctx.fillRect(25, -19, 4, 5);
      [-17, 17].forEach(wx => {
        ctx.save(); ctx.translate(wx, -6); ctx.fillStyle = '#1b1f27'; circle(0, 0, 7); ctx.fill(); ctx.rotate(ang);
        ctx.strokeStyle = '#cfd5e0'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(5, 0); ctx.moveTo(0, -5); ctx.lineTo(0, 5); ctx.stroke(); ctx.restore();
      });
      ctx.restore();
    }

    // Altura de la escena según su contenido (evita mucho cielo o suelo vacío)
    function wantH() {
      if (spec.kind === 'road') return 64 + spec.lanes.length * 94 + 80;
      const dx = spec.xmax - spec.xmin;
      if (dx < 1e-9) return 420;
      const PL = spec.platform ? 128 : 76, yTop = Math.max(spec.ymax, 1) * 1.12;
      return Math.round(Math.min(420, Math.max(250, 56 + 62 + yTop * (W - PL - 70) / dx)));
    }

    function draw() {
      const dpr = window.devicePixelRatio || 1;
      W = cv.clientWidth;
      if (!W) return;
      cv.style.height = wantH() + 'px';
      H = cv.clientHeight;
      if (!H) return;
      const pw = Math.round(W * dpr), ph = Math.round(H * dpr);
      if (cv.width !== pw || cv.height !== ph) { cv.width = pw; cv.height = ph; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const dark = isDark(), sc = SCENE[dark ? 'd' : 'l'], p = PALETTE[dark ? 'd' : 'l'], t = tNow();
      const halo = (s, x, y, align) => { ctx.textAlign = align || 'center'; ctx.lineJoin = 'round'; ctx.lineWidth = 3.5; ctx.strokeStyle = sc.skyB; if (dark) ctx.strokeStyle = sc.skyA; ctx.strokeText(s, x, y); ctx.fillText(s, x, y); };
      const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, sc.skyA); sky.addColorStop(1, sc.skyB);
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = sc.txt;

      if (spec.kind === 'road') drawRoad(t, sc, p, halo); else drawWorld(t, sc, p, halo);

      ctx.font = 'bold 18px ' + FONT; ctx.fillStyle = sc.txt;
      halo('t = ' + fmt(t) + ' s', W - 14, spec.kind === 'road' ? 22 : 28, 'right');
      info.textContent = spec.info(t);
    }

    function drawRoad(t, sc, p, halo) {
      const lanes = spec.lanes, n = lanes.length, LH = 94, padL = 52, padR = 52;
      const top = Math.max(64, (H - (n * LH + 44)) / 2);
      const xa = spec.range[0], span = (spec.range[1] - xa) || 1, k = (W - padL - padR) / span, X = x => padL + (x - xa) * k;
      ctx.fillStyle = sc.ground; ctx.fillRect(0, top - 6, W, H - top + 6);
      ctx.fillStyle = sc.groundD; ctx.fillRect(0, top - 6, W, 4);
      const rulerY = top + n * LH + 4;
      // regla de distancia
      ctx.strokeStyle = sc.txt; ctx.fillStyle = sc.txt; ctx.lineWidth = 1.5; ctx.font = '12px ' + FONT; ctx.textAlign = 'center';
      ctx.beginPath(); ctx.moveTo(padL, rulerY); ctx.lineTo(W - padR, rulerY); ctx.stroke();
      const st = niceStep(80 / k);
      for (let m = Math.ceil(xa / st); m * st <= xa + span + 1e-9 && m < 400; m++) {
        const px = X(m * st); ctx.beginPath(); ctx.moveTo(px, rulerY); ctx.lineTo(px, rulerY + 6); ctx.stroke();
        ctx.fillText(numLabel(m * st, st), px, rulerY + 20);
      }
      ctx.textAlign = 'right'; ctx.fillText('x (m)', W - 8, rulerY + 36);
      // banderas
      ctx.font = 'bold 12px ' + FONT;
      spec.marks.forEach((m, j) => {
        const px = X(m.x);
        ctx.save(); ctx.strokeStyle = m.meet ? sc.flag : sc.txt; ctx.globalAlpha = m.meet ? 0.95 : 0.55; ctx.lineWidth = m.meet ? 2.5 : 1.5; ctx.setLineDash([6, 5]);
        ctx.beginPath(); ctx.moveTo(px, top + 2); ctx.lineTo(px, rulerY); ctx.stroke(); ctx.restore();
        ctx.fillStyle = m.meet ? sc.flag : sc.txt;
        const lbl = m.label + ' (' + fmt(m.x) + ' m)', w = ctx.measureText(lbl).width / 2 + 4;
        const nearCron = px > W - 140;
        const stagger = (!nearCron && j > 0 && Math.abs(px - X(spec.marks[j - 1].x)) < 70) ? 14 : 0;
        halo(lbl, Math.min(Math.max(px, w), W - w), top - 10 - stagger);
      });
      // carriles y móviles
      lanes.forEach((ln, j) => {
        const rt = top + j * LH + 52, x = ln.x(t), px = X(x), vcur = ln.v(t);
        ctx.fillStyle = sc.road; ctx.fillRect(padL - 24, rt, W - padL - padR + 48, 26);
        ctx.strokeStyle = sc.line; ctx.lineWidth = 2; ctx.setLineDash([14, 12]); ctx.beginPath(); ctx.moveTo(padL - 24, rt + 11); ctx.lineTo(W - padR + 24, rt + 11); ctx.stroke(); ctx.setLineDash([]);
        const col = p[j % p.length];
        ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(X(ln.x(0)), rt + 21); ctx.lineTo(px, rt + 21); ctx.stroke();
        const e = Math.max((spec.t1 - spec.t0) * 1e-3, 1e-9);
        let dx = ln.x(Math.min(t + e, spec.t1)) - ln.x(Math.max(t - e, spec.t0));
        if (Math.abs(dx) < 1e-12) dx = ln.x(spec.t1) - ln.x(spec.t0);
        const dir = dx < 0 ? -1 : 1;
        car(px, rt + 2, dir, col, px / 7);
        ctx.font = 'bold 13px ' + FONT; ctx.fillStyle = sc.txt;
        const lbl = (n > 1 ? ln.name + ':  ' : '') + 'v = ' + fmt(Math.abs(vcur)) + ' m/s', w = ctx.measureText(lbl).width / 2 + 4;
        halo(lbl, Math.min(Math.max(px, w), W - w), rt - 40);
      });
    }

    function drawWorld(t, sc, p, halo) {
      const vertical = spec.xmax - spec.xmin < 1e-9;
      const PT = 56, PB = 62, PL = vertical ? 60 : (spec.platform ? 128 : 76), PR = 70, yTop = Math.max(spec.ymax, 1) * 1.12;
      let s, X;
      const Y = y => H - PB - y * s;
      if (vertical) { s = (H - PT - PB) / yTop; X = x => W / 2 + x * s; }
      else {
        const dx = spec.xmax - spec.xmin; s = Math.min((W - PL - PR) / dx, (H - PT - PB) / yTop);
        const left = PL + (W - PL - PR - dx * s) / 2; X = x => left + (x - spec.xmin) * s;
      }
      // suelo
      ctx.fillStyle = sc.ground; ctx.fillRect(0, Y(0), W, H - Y(0));
      ctx.fillStyle = sc.groundD; ctx.fillRect(0, Y(0), W, 5);
      // edificio / acantilado
      if (spec.platform) {
        const x2 = vertical ? X(0) - 16 : X(0), bw = vertical ? Math.min(150, W * 0.28) : 70, x1 = x2 - bw, yt = Y(spec.y0) + 10, yb = Y(0);
        ctx.fillStyle = sc.build; ctx.fillRect(x1, yt, bw, yb - yt);
        ctx.fillStyle = sc.buildD; ctx.fillRect(x1 - 3, yt, bw + 3, 6);
        ctx.fillStyle = sc.win;
        for (let j = 0; yt + 18 + j * 24 < yb - 16; j++) for (let i = 0; x1 + 10 + i * 20 < x2 - 14; i++) if ((i * 7 + j * 3) % 5 !== 0) ctx.fillRect(x1 + 10 + i * 20, yt + 18 + j * 24, 11, 14);
      }
      // regla vertical de alturas
      ctx.font = '12px ' + FONT; ctx.fillStyle = sc.txt; ctx.strokeStyle = sc.txt; ctx.lineWidth = 1.5;
      const sy = niceStep(58 / s);
      ctx.beginPath(); ctx.moveTo(46, Y(0)); ctx.lineTo(46, Y(yTop * 0.98)); ctx.stroke();
      for (let m = 0; m * sy <= yTop * 0.98 && m < 300; m++) {
        const py = Y(m * sy); ctx.beginPath(); ctx.moveTo(40, py); ctx.lineTo(52, py); ctx.stroke();
        ctx.textAlign = 'right'; ctx.fillText(numLabel(m * sy, sy), 36, py + 4);
      }
      ctx.font = 'bold 12px ' + FONT; halo('y (m)', 8, 18, 'left');
      // regla horizontal sobre el suelo
      if (!vertical) {
        const sx = niceStep(80 / s); ctx.font = '12px ' + FONT; ctx.fillStyle = sc.txt;
        for (let m = Math.ceil(spec.xmin / sx); m * sx <= spec.xmax + 1e-9 && m < 400; m++) {
          const px = X(m * sx); ctx.beginPath(); ctx.moveTo(px, Y(0)); ctx.lineTo(px, Y(0) + 8); ctx.stroke();
          ctx.textAlign = 'center'; ctx.fillText(numLabel(m * sx, sx), px, Y(0) + 24);
        }
        ctx.textAlign = 'right'; ctx.font = 'bold 12px ' + FONT; ctx.fillText('x (m)', W - 8, Y(0) + 44);
      }
      // trayectoria prevista, estela y posiciones cada intervalo igual de tiempo
      const N = 140, T = spec.t1 - spec.t0;
      ctx.save(); ctx.setLineDash([7, 7]); ctx.lineWidth = 2; ctx.strokeStyle = p[0]; ctx.globalAlpha = 0.45; ctx.beginPath();
      for (let k = 0; k <= N; k++) { const tt = spec.t0 + T * k / N; if (k) ctx.lineTo(X(spec.x(tt)), Y(spec.y(tt))); else ctx.moveTo(X(spec.x(tt)), Y(spec.y(tt))); }
      ctx.stroke(); ctx.restore();
      ctx.save(); ctx.lineWidth = 3.5; ctx.strokeStyle = p[0]; ctx.lineCap = 'round'; ctx.beginPath();
      const steps = Math.max(2, Math.ceil(N * (t - spec.t0) / T));
      for (let k = 0; k <= steps; k++) { const tt = spec.t0 + (t - spec.t0) * k / steps; if (k) ctx.lineTo(X(spec.x(tt)), Y(spec.y(tt))); else ctx.moveTo(X(spec.x(tt)), Y(spec.y(tt))); }
      ctx.stroke(); ctx.restore();
      for (let k = 0; k <= spec.strobe; k++) {
        const tk = spec.t0 + T * k / spec.strobe; if (tk > t + 1e-9) break;
        ctx.save(); ctx.globalAlpha = 0.45; ctx.fillStyle = sc.ball; circle(X(spec.x(tk)), Y(spec.y(tk)), 5); ctx.fill(); ctx.restore();
      }
      // puntos importantes
      ctx.font = 'bold 12px ' + FONT;
      spec.marks.forEach((m, j) => {
        const px = X(m.x), py = Y(m.y);
        ctx.fillStyle = sc.flag; ctx.beginPath(); ctx.moveTo(px, py - 7); ctx.lineTo(px + 7, py); ctx.lineTo(px, py + 7); ctx.lineTo(px - 7, py); ctx.closePath(); ctx.fill();
        const lbl = vertical ? m.label + ' (' + fmt(m.y) + ' m)' : m.label + ' (' + fmt(m.x) + '; ' + fmt(m.y) + ')', w = ctx.measureText(lbl).width + 8;
        ctx.fillStyle = sc.txt;
        if (px + 12 + w <= W - 6) halo(lbl, px + 12, py - 12 - (j % 2) * 4, 'left');
        else if (px - 12 - w >= 6) halo(lbl, px - 12, py - 12 - (j % 2) * 4, 'right');
        else halo(lbl, Math.max(6, W - 6 - w), py - 28, 'left');
      });
      // cañón
      if (spec.launcher) {
        ctx.save(); ctx.translate(X(0), Y(spec.y0)); ctx.rotate(-spec.launcher.th * Math.PI / 180); ctx.fillStyle = '#3a4150'; rr(-4, -7, 42, 14, 4); ctx.fill(); ctx.restore();
        ctx.fillStyle = '#2b303b'; circle(X(0), Y(spec.y0) + 3, 12); ctx.fill();
      }
      // objeto con flechas de velocidad
      const bx = X(spec.x(t)), by = Y(spec.y(t)), vx = spec.vx(t), vy = spec.vy(t), ka = 66 / spec.vmax;
      if (Math.abs(vx) > 1e-9 && Math.abs(vy) > 1e-9) { arrow(bx, by, bx + vx * ka, by, p[2], 2); arrow(bx, by, bx, by - vy * ka, p[3], 2); }
      arrow(bx, by, bx + vx * ka, by - vy * ka, p[1], 3.5);
      const gr = ctx.createRadialGradient(bx - 3, by - 3, 1, bx, by, 11); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.3, sc.ball); gr.addColorStop(1, sc.ball);
      ctx.fillStyle = gr; circle(bx, by, 10); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 1.5; ctx.stroke();
      // choque con el suelo
      if (t >= spec.t1 - 1e-9) {
        const ex = X(spec.x(spec.t1)), ey = Y(spec.y(spec.t1));
        ctx.save(); ctx.strokeStyle = sc.flag; ctx.lineWidth = 3; circle(ex, ey, 16); ctx.stroke(); ctx.globalAlpha = 0.5; circle(ex, ey, 26); ctx.stroke(); ctx.restore();
      }
    }

    const stop = () => { if (raf) cancelAnimationFrame(raf); raf = null; playBtn.textContent = 'Reproducir'; };
    const play = fromStart => {
      stop();
      let f0 = slider.value / 1000; if (fromStart || f0 >= 0.999) f0 = 0;
      const dur = +sel.value, t0 = performance.now(); playBtn.textContent = 'Pausa';
      const stepF = now => {
        const f = f0 + (now - t0) / dur;
        if (f >= 1) { slider.value = 1000; draw(); stop(); return; }
        slider.value = f * 1000; draw(); raf = requestAnimationFrame(stepF);
      };
      raf = requestAnimationFrame(stepF);
    };
    playBtn.onclick = () => { if (raf) stop(); else play(false); };
    box.querySelector('.cin-srep').onclick = () => { slider.value = 0; play(true); };
    sel.onchange = () => { if (raf) play(false); };
    slider.addEventListener('input', () => { if (raf) stop(); draw(); });
    if (window.ResizeObserver) new window.ResizeObserver(draw).observe(cv); else window.addEventListener('resize', draw);
    if (window.MutationObserver) {
      const themeObserver = new window.MutationObserver(() => {
        draw();
      });
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }
    draw();
    if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) play(true);
    return { stop, redraw: draw };
  }

  function bindPanels(root, gr, sim) {
    const defs = [['.cin-showg', '.cin-graph', gr, buildGraph, 'gráfica'], ['.cin-shows', '.cin-sim', sim, buildSim, 'simulación']];
    const items = defs.map(d => ({ btn: root.querySelector(d[0]), box: root.querySelector(d[1]), spec: d[2], build: d[3], name: d[4], api: null, built: false })).filter(it => it.btn && it.box && it.spec);
    const close = it => {
      it.box.setAttribute('hidden', ''); it.btn.textContent = 'Ver ' + it.name; it.btn.setAttribute('aria-expanded', 'false');
      if (it.api && it.api.stop) it.api.stop();
    };
    items.forEach(it => {
      it.btn.onclick = () => {
        const opening = it.box.hasAttribute('hidden');
        items.forEach(o => { if (o !== it && !o.box.hasAttribute('hidden')) close(o); });
        if (!opening) { close(it); return; }
        it.box.removeAttribute('hidden');
        if (!it.built) { it.api = it.build(it.box, it.spec) || null; it.built = true; } else if (it.api && it.api.redraw) it.api.redraw();
        it.btn.textContent = 'Ocultar ' + it.name; it.btn.setAttribute('aria-expanded', 'true');
      };
    });
  }

  function show(out, cfg, vals, g, ask) {
    let res = cfg.fn(vals, g);
    if (Array.isArray(res)) res = { rows: res };
    if (res.rows.some(r => r[1] !== null && !isFinite(r[1]))) throw new Error('Datos no válidos (¿división entre cero o raíz negativa?).');
    const gr = graphFor(CALCS.indexOf(cfg), vals, g);
    const sim = gr ? simFor(CALCS.indexOf(cfg), vals, g) : null;
    out.innerHTML = resultHTML(res, ask, !!gr, !!sim);
    if (gr) bindPanels(out, gr, sim);
  }

  function run(cfg, card) {
    const out = card.querySelector('.cin-out');
    try {
      const g = getG();
      const vals = {};
      cfg.fields.forEach((fl, i) => {
        const el = card.querySelectorAll('input,textarea')[i];
        if (fl.area) { vals[fl.k] = el.value; return; }
        let x = parse(el.value);
        if (Number.isNaN(x)) throw new Error('«' + fl.l + '» no es un número válido.');
        if (x === null && fl.def !== undefined) x = fl.def;
        if (x === null && !fl.opt) throw new Error('Falta: ' + fl.l);
        vals[fl.k] = x;
      });
      show(out, cfg, vals, g, null);
    } catch (e) {
      out.innerHTML = errHTML(e.message);
    }
  }

  function resetCard(card, focus) {
    card.querySelectorAll('input,textarea').forEach(el => { el.value = ''; });
    card.querySelector('.cin-out').innerHTML = '';
    if (focus) { const f = card.querySelector('input,textarea'); if (f) f.focus(); }
  }


  const tabsEl = app.querySelector('.cin-tabs'), body = app.querySelector('.cin-body'), secs = [], cards = [];
  function showTab(i) { secs.forEach((s, j) => { s.classList.toggle('on', i === j); tabsEl.children[j].classList.toggle('on', i === j); tabsEl.children[j].setAttribute('aria-selected', i === j); }); }
  TABS.forEach((name, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = name; b.setAttribute('role', 'tab');
    b.style.setProperty('--cl', TAB_COLORS[i][0]); b.style.setProperty('--cd', TAB_COLORS[i][1]);
    b.onclick = () => showTab(i);
    tabsEl.appendChild(b);
    const s = document.createElement('div'); s.className = 'cin-sec';
    s.style.setProperty('--cl', TAB_COLORS[i][0]); s.style.setProperty('--cd', TAB_COLORS[i][1]);
    body.appendChild(s); secs.push(s);
  });


  const EJEMPLOS = [
    ['Auto que acelera', 'Un auto parte del reposo y acelera a 2 m/s² durante 8 s. ¿Qué distancia recorre?'],
    ['Tren en km/h', 'Un tren viaja a 72 km/h y recorre 3 km. ¿Cuánto tiempo tarda?'],
    ['Carro que frena', 'Un carro que va a 20 m/s frena con una aceleración de 4 m/s² hasta detenerse. ¿Qué distancia recorre?'],
    ['Piedra que cae', 'Se suelta una piedra desde un edificio de 45 m de altura. ¿Cuánto tarda en llegar al suelo?'],
    ['Pelota hacia arriba', 'Una pelota se lanza hacia arriba con una velocidad de 20 m/s. ¿Qué altura máxima alcanza?'],
    ['Balón a 30°', 'Un balón se patea con una rapidez de 25 m/s y un ángulo de 30°. ¿Cuál es su alcance?'],
    ['Dos ciclistas', 'Dos ciclistas están separados 300 m y avanzan uno hacia el otro a 5 m/s y 10 m/s. ¿Cuándo se encuentran?']
  ];
  const pcard = document.createElement('div'); pcard.className = 'cin-card cin-prob';
  pcard.innerHTML = '<h3>Escribe tu problema</h3>' +
    '<p class="cin-note">Escríbelo con tus palabras e incluye cada dato con su unidad (m, s, m/s, km/h, m/s², °). Yo detecto los datos, elijo el tipo de movimiento y lo resuelvo paso a paso.</p>' +
    '<textarea class="cin-ta" placeholder="Ejemplo: Un auto parte del reposo y acelera a 2 m/s² durante 8 s. ¿Qué distancia recorre?" aria-label="Enunciado del problema"></textarea>' +
    '<div class="cin-chips"><span>¿Sin ideas? Prueba uno:</span>' + EJEMPLOS.map((e, i) => '<button type="button" data-i="' + i + '">' + esc(e[0]) + '</button>').join('') + '</div>' +
    '<div class="cin-act"><button type="button" class="cin-go">Resolver problema</button><button type="button" class="cin-reset">Borrar y escribir otro</button></div>' +
    '<div class="cin-out"></div>';
  secs[0].appendChild(pcard);
  const ta = pcard.querySelector('textarea'), pout = pcard.querySelector('.cin-out');

  function fillCard(i, vals) {
    const card = cards[i], els = card.querySelectorAll('input,textarea');
    CALCS[i].fields.forEach((fl, j) => {
      const v = vals[fl.k];
      els[j].value = fl.area ? (v || '') : (v === null || v === undefined ? '' : fmt(v));
    });
    card.querySelector('.cin-out').innerHTML = '';
  }
  function knowHTML(p) {
    let h = '<div class="cin-know"><div class="cin-ttl">Esto es lo que entendí</div>';
    if (p.tipo) h += '<p><b>Tipo de problema:</b> ' + esc(p.tipo) + '</p>';
    if (p.datos && p.datos.length) h += '<ul>' + p.datos.map(d => '<li>' + esc(d) + '</li>').join('') + '</ul>';
    if (p.ask) h += '<p><b>Te piden:</b> ' + ASKNAME[p.ask] + '</p>';
    (p.notas || []).forEach(n => { h += '<p class="cin-note2">' + esc(n) + '</p>'; });
    return h + '</div>';
  }
  function solveText() {
    let g;
    try { g = getG(); } catch (e) { pout.innerHTML = errHTML(e.message); return; }
    const p = parseProblem(ta.value, g);
    if (p.error && !p.tipo && !(p.datos && p.datos.length)) { pout.innerHTML = errHTML(p.error); return; }
    let h = knowHTML(p);
    if (p.error) { pout.innerHTML = h + errHTML(p.error); return; }
    pout.innerHTML = h;
    const holder = document.createElement('div');
    pout.appendChild(holder);
    try { show(holder, CALCS[p.calc], p.vals, p.g, p.ask); } catch (e) { holder.innerHTML = errHTML(e.message); }
    pout.insertAdjacentHTML('beforeend', '<div class="cin-act"><button type="button" class="cin-reset cin-fix">Corregir los datos en la calculadora</button></div>');
    pout.querySelector('.cin-fix').onclick = () => {
      fillCard(p.calc, p.vals); showTab(CALCS[p.calc].tab + 1);
      const f = cards[p.calc].querySelector('input,textarea'); cards[p.calc].scrollIntoView({ block: 'center' }); if (f) f.focus();
    };
  }
  pcard.querySelector('.cin-go').onclick = solveText;
  pcard.querySelector('.cin-reset').onclick = () => resetProblem(true);
  ta.addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) solveText(); });
  pcard.querySelector('.cin-chips').addEventListener('click', e => {
    const b = e.target.closest('button[data-i]'); if (!b) return;
    ta.value = EJEMPLOS[+b.dataset.i][1]; pout.innerHTML = ''; ta.focus();
  });
  function resetProblem(focus) { ta.value = ''; pout.innerHTML = ''; if (focus) ta.focus(); }


  CALCS.forEach((cfg, idx) => {
    const card = document.createElement('div'); card.className = 'cin-card';
    card.innerHTML = '<h3>' + esc(cfg.title) + '</h3>' + (cfg.note ? '<p class="cin-note">' + esc(cfg.note) + '</p>' : '') +
      '<div class="cin-grid">' + cfg.fields.map(fl => '<label>' + esc(fl.l) + (fl.area
        ? '<textarea placeholder="300,30&#10;200,25"></textarea>'
        : '<input inputmode="decimal" placeholder="' + (fl.opt && fl.def === undefined ? 'incógnita / vacío' : fl.def !== undefined ? 'por defecto ' + fl.def : '') + '">') + '</label>').join('') +
      '</div><div class="cin-act"><button type="button" class="cin-go">Calcular</button><button type="button" class="cin-reset">Reiniciar</button></div><div class="cin-out"></div>';
    card.querySelector('.cin-go').onclick = () => run(cfg, card);
    card.querySelector('.cin-reset').onclick = () => resetCard(card, true);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.tagName === 'INPUT') run(cfg, card); });
    secs[cfg.tab + 1].appendChild(card); cards[idx] = card;
  });


  document.getElementById('cin-reset-all').onclick = () => {
    cards.forEach(c => resetCard(c, false)); resetProblem(false); gEl.value = '9,8';
  };

  showTab(0);
})();
