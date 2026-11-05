/* ПЗ №4. Алгебра логики: значения выражений, таблицы истинности (задания ЕКР 12, 13). */
(function () {
  const imp = (a, b) => !a || b;
  const B = v => v ? 1 : 0;

  // Выражения от двух переменных x, y.
  const E2 = [
    ['x ∧ ¬y', (x, y) => x && !y], ['¬x ∨ y', (x, y) => !x || y], ['x → y', (x, y) => imp(x, y)], ['¬(x ∨ y)', (x, y) => !(x || y)],
    ['x ∨ ¬y', (x, y) => x || !y], ['¬x ∧ ¬y', (x, y) => !x && !y], ['y → x', (x, y) => imp(y, x)], ['¬(x ∧ y)', (x, y) => !(x && y)],
    ['¬x → y', (x, y) => imp(!x, y)], ['¬(x → y)', (x, y) => !imp(x, y)]
  ];
  // Выражения от X, Y, Z. Приоритет: ¬, ∧, ∨, →.
  const E3 = [
    ['¬X ∧ (¬Y ∨ Z)', (X, Y, Z) => !X && (!Y || Z)], ['X → (Y → Z)', (X, Y, Z) => imp(X, imp(Y, Z))],
    ['Y ∨ (X ∧ Z)', (X, Y, Z) => Y || (X && Z)], ['(¬X ∨ Y) ∧ ¬Z', (X, Y, Z) => (!X || Y) && !Z],
    ['X ∨ Y ∧ Z', (X, Y, Z) => X || (Y && Z)], ['Z → X ∨ Y', (X, Y, Z) => imp(Z, X || Y)],
    ['¬(X ∧ Y) ∧ Z', (X, Y, Z) => !(X && Y) && Z], ['¬(X ∨ Y) ∨ ¬Z', (X, Y, Z) => !(X || Y) || !Z],
    ['X ∧ ¬Y ∨ Z', (X, Y, Z) => (X && !Y) || Z], ['(X → Y) ∧ Z', (X, Y, Z) => imp(X, Y) && Z],
    ['¬X ∨ Y ∧ ¬Z', (X, Y, Z) => !X || (Y && !Z)], ['(X ∨ Z) → Y', (X, Y, Z) => imp(X || Z, Y)],
    ['X ∧ (Y → Z)', (X, Y, Z) => X && imp(Y, Z)], ['¬Y → X ∧ Z', (X, Y, Z) => imp(!Y, X && Z)],
    ['(¬X → Z) ∧ Y', (X, Y, Z) => imp(!X, Z) && Y], ['¬X ∧ Y ∨ ¬Z', (X, Y, Z) => (!X && Y) || !Z],
    ['X ∨ ¬Y ∨ Z', (X, Y, Z) => X || !Y || Z], ['¬X ∧ ¬Y ∧ Z', (X, Y, Z) => !X && !Y && Z],
    ['(X ∨ Y) ∧ ¬Z', (X, Y, Z) => (X || Y) && !Z], ['Y → ¬X ∨ Z', (X, Y, Z) => imp(Y, !X || Z)]
  ];
  // Выражения для задания 12: a, b, c, d заменяются на w, x, y, z в случайном порядке. show — какие строки даны: где F = 1 или F = 0.
  const E4 = [
    ['(¬a ∨ b) ∧ c ∧ ¬d', (a, b, c, d) => (!a || b) && c && !d, 1],
    ['(a ∧ ¬b) ∨ c ∨ ¬d', (a, b, c, d) => (a && !b) || c || !d, 0],
    ['¬(¬a ∧ b) ∧ ¬c ∧ d', (a, b, c, d) => !(!a && b) && !c && d, 1],
    ['(a → b) ∧ c ∧ ¬d', (a, b, c, d) => imp(a, b) && c && !d, 1],
    ['a ∧ ¬b ∧ (c ∨ ¬d)', (a, b, c, d) => a && !b && (c || !d), 1],
    ['(¬a ∧ b) ∨ ¬c ∨ d', (a, b, c, d) => (!a && b) || !c || d, 0],
    ['¬a ∧ b ∧ (c → d)', (a, b, c, d) => !a && b && imp(c, d), 1],
    ['(a ∨ ¬b) → c ∨ d', (a, b, c, d) => imp(a || !b, c || d), 0]
  ];
  const BITS3 = [...Array(8).keys()].map(n => [n >> 2 & 1, n >> 1 & 1, n & 1]);
  const BITS4 = [...Array(16).keys()].map(n => [n >> 3 & 1, n >> 2 & 1, n >> 1 & 1, n & 1]);
  const PERMS = (function perms(a) { return a.length < 2 ? [a] : a.flatMap((x, i) => perms(a.slice(0, i).concat(a.slice(i + 1))).map(p => [x].concat(p))); })([0, 1, 2, 3]);

  function truthTask12(r) {
    const D = window.OrbitaDrill;
    return D.retry(r, () => {
      const [form, fn, show] = r.pick(E4);
      const vars = r.shuffle(['w', 'x', 'y', 'z']);                 // a, b, c, d → эти переменные
      const expr = form.replace(/[abcd]/g, ch => vars['abcd'.indexOf(ch)]);
      const val = (o) => B(fn(o[vars[0]], o[vars[1]], o[vars[2]], o[vars[3]]));
      const order = r.shuffle(['w', 'x', 'y', 'z']);                // в каком порядке переменные стоят в столбцах
      const rows = BITS4.map(bits => { const o = {}; order.forEach((v, i) => { o[v] = bits[i]; }); return { bits, f: val(o) }; }).filter(x => x.f === show);
      if (rows.length < 2 || rows.length > 4) return null;
      // Порядок столбцов должен восстанавливаться однозначно.
      const key = rs => rs.map(x => x.bits.join('')).sort().join(',');
      const target = key(rows);
      const fits = PERMS.filter(p => {
        const ord = p.map(i => order[i]);
        const rs = BITS4.map(bits => { const o = {}; ord.forEach((v, i) => { o[v] = bits[i]; }); return { bits, f: val(o) }; }).filter(x => x.f === show);
        return key(rs) === target;
      });
      if (fits.length !== 1) return null;
      const shown = r.shuffle(rows);
      const consts = [0, 1, 2, 3].filter(j => shown.every(x => x.bits[j] === shown[0].bits[j]));
      return {
        text: '<p>Логическая функция F задаётся выражением <b class="dr-mono">' + expr + '</b>. Ниже приведён фрагмент таблицы истинности, содержащий <b>все</b> наборы аргументов, при которых F ' + (show ? 'истинна' : 'ложна') + '. ' +
          'Определите, какому столбцу соответствует каждая из переменных w, x, y, z.</p>' +
          '<p>В ответе напишите буквы в порядке столбцов (сначала букву первого столбца и т. д.), без разделителей.</p>',
        table: D.table(['?', '?', '?', '?', 'F'], shown.map(x => x.bits.concat(x.f))),
        answer: order.join(''),
        explain: (consts.length ? 'Сначала смотрим на столбцы, где значение не меняется: ' + consts.map(j => (j + 1) + '-й всегда ' + shown[0].bits[j] + ' — это ' + order[j]).join(', ') + '. ' : '') +
          'Остальные столбцы определяем подстановкой строк в выражение. Порядок столбцов: ' + order.join('') + ' — при нём все строки таблицы дают F = ' + show + ', а при любом другом порядке набор строк будет другим.'
      };
    });
  }

  function choose13(r) {
    const D = window.OrbitaDrill;
    return D.retry(r, () => {
      const rows = r.sample(BITS3, 3);
      const [cs, cf] = r.pick(E3);
      const fits = e => rows.every(b => B(e[1](...b)) === B(cf(...b)));
      const wrong = r.shuffle(E3.filter(e => e[0] !== cs && !fits(e))).slice(0, 3);
      if (wrong.length < 3) return null;
      const opts = r.shuffle([[cs, cf]].concat(wrong));
      const ans = opts.findIndex(e => e[0] === cs) + 1;
      const firstBad = e => rows.find(b => B(e[1](...b)) !== B(cf(...b)));
      return {
        text: '<p>Символом F обозначено одно из выражений от трёх аргументов X, Y, Z. Дан фрагмент таблицы истинности выражения F. Какое выражение соответствует F?</p>',
        table: D.table(['X', 'Y', 'Z', 'F'], rows.map(b => b.concat(B(cf(...b))))),
        options: opts.map(e => e[0]), answer: String(ans),
        explain: 'Подставляем строки таблицы в каждый вариант. ' + opts.map((e, i) => {
          if (e[0] === cs) return 'Вариант ' + (i + 1) + ' совпадает во всех строках.';
          const b = firstBad(e);
          return 'Вариант ' + (i + 1) + ' не подходит: при X=' + b[0] + ', Y=' + b[1] + ', Z=' + b[2] + ' он даёт ' + B(e[1](...b)) + ', а нужно ' + B(cf(...b)) + '.';
        }).join(' ') + ' Ответ: ' + ans + '.'
      };
    });
  }

  window.ORBITA.lessons['inf-pz-04'] = {
    type: 'drill',
    intro: '<p>Обозначения как в ЕКР: ¬ — НЕ, ∧ — И, ∨ — ИЛИ, → — следование. Порядок действий: сначала ¬, потом ∧, потом ∨, последним →. Скобки меняют порядок.</p>' +
      '<p>Напоминание: A → B ложно только в одном случае — когда A = 1, а B = 0.</p>',
    tasks: [
      {
        id: 't1', ekr: null, title: 'Значения выражения', points: 10,
        hint: 'Подставьте по очереди x = 0, y = 0; x = 0, y = 1; x = 1, y = 0; x = 1, y = 1 и запишите четыре значения F подряд.',
        gen(r) {
          const [s, f] = r.pick(E2);
          const vals = [[0, 0], [0, 1], [1, 0], [1, 1]].map(([x, y]) => B(f(x, y)));
          return {
            text: '<p>Вычислите значение выражения <b class="dr-mono">F = ' + s + '</b> для наборов (x, y) = (0, 0), (0, 1), (1, 0), (1, 1). Запишите четыре значения F подряд, например 0110.</p>',
            answer: vals.join(''),
            explain: [[0, 0], [0, 1], [1, 0], [1, 1]].map(([x, y], i) => 'x=' + x + ', y=' + y + ' → ' + vals[i]).join('; ') + '. Ответ: ' + vals.join('') + '.'
          };
        }
      },
      {
        id: 't2', ekr: null, title: 'Сколько единиц в таблице', points: 10,
        hint: 'Составьте таблицу истинности: для трёх переменных 8 строк (от 000 до 111). Посчитайте строки, где F = 1.',
        gen(r) {
          const [s, f] = r.pick(E3);
          const n = BITS3.filter(b => f(...b)).length;
          return {
            text: '<p>Сколько существует наборов значений переменных (X, Y, Z), при которых выражение <b class="dr-mono">' + s + '</b> истинно?</p>',
            answer: String(n),
            explain: 'Истинно при (X, Y, Z) = ' + BITS3.filter(b => f(...b)).map(b => b.join('')).join(', ') + ' — всего ' + n + '.'
          };
        }
      },
      {
        id: 't3', ekr: null, title: 'Четыре переменные', points: 10,
        hint: 'Строк 16. Удобнее искать, когда выражение ложно: для ∧ хватит одного ложного множителя, для → — посылка 1 и следствие 0.',
        gen(r) {
          const D = window.OrbitaDrill;
          return D.retry(r, () => {
            const [s1, f1] = r.pick(E2), [s2, f2] = r.pick(E2), op = r.pick(['∧', '∨', '→']);
            const s2b = s2.replace(/x/g, 'z').replace(/y/g, 'w');
            const f = (x, y, z, w) => op === '∧' ? f1(x, y) && f2(z, w) : op === '∨' ? f1(x, y) || f2(z, w) : imp(f1(x, y), f2(z, w));
            const n = BITS4.filter(b => f(...b)).length;
            if (n === 0 || n === 16) return null;
            const t1 = [[0, 0], [0, 1], [1, 0], [1, 1]].filter(([x, y]) => f1(x, y)).length, t2 = [[0, 0], [0, 1], [1, 0], [1, 1]].filter(([z, w]) => f2(z, w)).length;
            return {
              text: '<p>Сколько существует наборов значений переменных (x, y, z, w), при которых выражение <b class="dr-mono">(' + s1 + ') ' + op + ' (' + s2b + ')</b> истинно?</p>',
              answer: String(n),
              explain: 'Левая скобка истинна в ' + t1 + ' из 4 случаев для (x, y), правая — в ' + t2 + ' из 4 для (z, w). ' +
                (op === '∧' ? 'Обе истинны: ' + t1 + ' · ' + t2 + ' = ' + n + '.' : op === '∨' ? 'Хотя бы одна истинна: 16 − (4 − ' + t1 + ')·(4 − ' + t2 + ') = ' + n + '.' : 'Ложно, только если левая 1, а правая 0: ' + t1 + ' · ' + (4 - t2) + ' = ' + (16 - n) + ' наборов, значит истинно 16 − ' + (16 - n) + ' = ' + n + '.')
            };
          });
        }
      },
      { id: 't4', ekr: 12, title: 'Найдите столбцы переменных', points: 10, hint: 'Начните с переменных, которые входят в выражение «отдельно» через ∧ (или через ∨ для случая F = 0): у них во всех строках одно и то же значение.', gen: truthTask12 },
      { id: 't5', ekr: 13, title: 'Выражение по фрагменту таблицы', points: 10, hint: 'Подставляйте строки таблицы в каждый вариант. Как только вариант не совпал хотя бы в одной строке — вычёркивайте его.', gen: choose13 },
      { id: 't6', ekr: 12, title: 'Столбцы переменных: ещё раз', points: 10, hint: 'Если дано F = 0 для выражения с ∨, то каждое слагаемое ложно: переменные, стоящие отдельно, имеют постоянные значения.', gen: truthTask12 },
      { id: 't7', ekr: 13, title: 'Выбор выражения: ещё раз', points: 10, hint: 'Помните порядок: ¬, затем ∧, затем ∨, последним →. Например, X ∨ Y ∧ Z = X ∨ (Y ∧ Z).', gen: choose13 },
      {
        id: 't8', ekr: null, title: 'Наименьшее и наибольшее X', points: 10,
        hint: '¬(X < a) означает X ≥ a, ¬(X > a) означает X ≤ a. Запишите условие как отрезок и возьмите его край.',
        gen(r) {
          const D = window.OrbitaDrill;
          return D.retry(r, () => {
            const a = r.int(2, 40), b = a + r.int(3, 30);
            const forms = [
              ['¬(X < ' + a + ') ∧ (X < ' + b + ')', X => X >= a && X < b],
              ['(X > ' + a + ') ∧ ¬(X > ' + b + ')', X => X > a && X <= b],
              ['¬(X ≤ ' + a + ') ∧ ¬(X ≥ ' + b + ')', X => X > a && X < b],
              ['(X ≥ ' + a + ') ∧ ¬(X ≥ ' + b + ')', X => X >= a && X < b],
              ['¬((X < ' + a + ') ∨ (X > ' + b + '))', X => !(X < a || X > b)]
            ];
            const [s, f] = r.pick(forms), max = r.chance();
            const xs = []; for (let X = -100; X <= 200; X++) if (f(X)) xs.push(X);
            if (!xs.length) return null;
            const ans = max ? xs[xs.length - 1] : xs[0];
            return {
              text: '<p>При каком ' + (max ? 'наибольшем' : 'наименьшем') + ' целом X истинно высказывание <b class="dr-mono">' + s.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</b>?</p>',
              answer: String(ans),
              explain: 'Высказывание истинно при X от ' + xs[0] + ' до ' + xs[xs.length - 1] + ' включительно. ' + (max ? 'Наибольшее' : 'Наименьшее') + ': ' + ans + '.'
            };
          });
        }
      },
      { id: 't9', ekr: 12, title: 'Столбцы переменных: закрепление', points: 10, hint: 'Сначала постоянные столбцы, затем подставьте оставшиеся строки и проверьте условие в скобках.', gen: truthTask12 },
      { id: 't10', ekr: 13, title: 'Выбор выражения: закрепление', points: 10, hint: 'Проверяйте сначала строку, где F = 0 (или единственную строку с F = 1): она обычно сразу отсекает несколько вариантов.', gen: choose13 }
    ]
  };
})();
