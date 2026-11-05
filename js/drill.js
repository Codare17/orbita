/* Помощники для практик с ответом-числом (курс подготовки к ЕКР).
   Каждое задание практики — генератор gen(r): по случайным числам r он собирает условие и сам считает ответ.
   Вариант зависит от группы, кода студента и номера попытки, поэтому у соседей числа разные,
   а при повторном открытии студент видит тот же вариант.

   Формат практики (type: 'drill'):
     { type: 'drill', intro?, tasks: [{ id, ekr, title, points, hint, gen(r) }] }
   gen(r) возвращает:
     { text, answer, explain, unit?, code?: 'код Python', options?: ['…', …], img?: 'svg', table?: 'html' }
     answer — строка или массив допустимых строк; для выбора из вариантов — номер варианта ('1'…'4'). */
(function () {
  'use strict';

  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  // Генератор случайных чисел mulberry32 с удобными методами.
  function rng(seed) {
    let a = seed >>> 0;
    const next = () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const r = {
      next,
      int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
      pick: arr => arr[Math.floor(next() * arr.length)],
      chance: p => next() < (p == null ? 0.5 : p),
      shuffle(arr) {
        const a2 = arr.slice();
        for (let i = a2.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [a2[i], a2[j]] = [a2[j], a2[i]]; }
        return a2;
      },
      sample: (arr, k) => r.shuffle(arr).slice(0, k)
    };
    return r;
  }

  // Генератор пробует до 200 раз, пока условие не станет «хорошим» (целый ответ, единственное решение…).
  function retry(r, make) {
    for (let i = 0; i < 200; i++) { const v = make(r); if (v) return v; }
    throw new Error('Генератор не подобрал вариант');
  }

  // Ответ сравнивается без пробелов и регистра, запятая равна точке, латинские буквы-двойники — русским.
  const TWINS = { A: 'А', B: 'В', E: 'Е', K: 'К', M: 'М', H: 'Н', O: 'О', P: 'Р', C: 'С', T: 'Т', X: 'Х', Y: 'У' };
  function norm(s, letters) {
    let v = String(s == null ? '' : s).trim().replace(/\s+/g, '').replace(/,/g, '.').replace(/ё/gi, 'е');
    if (letters === 'ru') v = v.toUpperCase().replace(/[ABEKMHOPCTXY]/g, ch => TWINS[ch]);
    else v = v.toLowerCase();
    return v.replace(/^\+/, '').replace(/^(-?\d+)\.0+$/, '$1');
  }
  function check(input, answer, letters) {
    const list = Array.isArray(answer) ? answer : [answer];
    const v = norm(input, letters);
    return v !== '' && list.some(a => norm(a, letters) === v);
  }

  /* ---------- общие помощники для генераторов ---------- */
  const log2ceil = n => { let i = 0; while (2 ** i < n) i++; return i; };
  const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');   // 153600 → 153 600 (тонкий пробел)
  const sub = (n, base) => n + '<sub>' + base + '</sub>';
  const RU = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЭЮЯ'.split('');

  // Схема дорог: узлы по слоям слева направо, стрелки только вперёд. edges — [[из, в], …] индексами узлов.
  function graphSvg(names, pos, edges) {
    const R = 17, W = 520, H = 250;
    const line = ([a, b]) => {
      const [x1, y1] = pos[a], [x2, y2] = pos[b];
      const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy);
      const sx = x1 + dx / d * R, sy = y1 + dy / d * R, ex = x2 - dx / d * (R + 4), ey = y2 - dy / d * (R + 4);
      return '<line x1="' + sx.toFixed(1) + '" y1="' + sy.toFixed(1) + '" x2="' + ex.toFixed(1) + '" y2="' + ey.toFixed(1) + '" marker-end="url(#ar)"/>';
    };
    return '<svg class="drill-graph" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Схема дорог: ' +
      edges.map(([a, b]) => names[a] + '→' + names[b]).join(', ') + '">' +
      '<defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" fill="#7CC7FF"/></marker></defs>' +
      '<g stroke="#7CC7FF" stroke-width="2">' + edges.map(line).join('') + '</g>' +
      names.map((n, i) => '<g><circle cx="' + pos[i][0] + '" cy="' + pos[i][1] + '" r="' + R + '" fill="#222A48" stroke="#FFB547" stroke-width="2"/>' +
        '<text x="' + pos[i][0] + '" y="' + (pos[i][1] + 6) + '" text-anchor="middle" fill="#ECEFFA" font-size="17" font-family="Golos Text, sans-serif" font-weight="600">' + n + '</text></g>').join('') +
      '</svg>';
  }

  function table(head, rows, cls) {
    return '<table class="drill-table' + (cls ? ' ' + cls : '') + '"><thead><tr>' + head.map(h => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>' +
      rows.map(r => '<tr>' + r.map(c => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
  }

  window.OrbitaDrill = { hash, rng, retry, norm, check, log2ceil, fmt, sub, RU, graphSvg, table };
})();
