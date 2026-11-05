/* ПЗ №3. Системы счисления: перевод, арифметика, поиск основания (задания ЕКР 6, 7). */
(function () {
  const ones = n => n.toString(2).split('').filter(c => c === '1').length;
  const NAME = { 2: 'двоичной', 8: 'восьмеричной', 10: 'десятичной', 16: 'шестнадцатеричной' };
  const up = (n, b) => n.toString(b).toUpperCase();

  window.ORBITA.lessons['inf-pz-03'] = {
    type: 'drill',
    intro: '<p>Основание системы пишут маленькой цифрой справа: 101<sub>2</sub> — двоичное число, 17<sub>8</sub> — восьмеричное. В шестнадцатеричной системе после 9 идут буквы A–F (A = 10, …, F = 15). Ответ можно писать большими или маленькими буквами.</p>',
    tasks: [
      {
        id: 't1', ekr: 6, title: 'Из двоичной в десятичную', points: 10,
        hint: 'Подпишите над цифрами степени двойки справа налево: 1, 2, 4, 8, 16, 32… и сложите те, под которыми стоит 1.',
        gen(r) {
          const D = window.OrbitaDrill, n = r.int(37, 250), b = n.toString(2);
          const parts = b.split('').map((d, i) => d === '1' ? 2 ** (b.length - 1 - i) : 0).filter(Boolean);
          return { text: '<p>Переведите число ' + D.sub(b, 2) + ' в десятичную систему счисления.</p>', answer: String(n),
            explain: b + '<sub>2</sub> = ' + parts.join(' + ') + ' = ' + n + '.' };
        }
      },
      {
        id: 't2', ekr: 6, title: 'Из десятичной в двоичную', points: 10,
        hint: 'Делите число на 2 и записывайте остатки. Ответ — остатки, прочитанные снизу вверх. Или раскладывайте на степени двойки: 128, 64, 32…',
        gen(r) {
          const D = window.OrbitaDrill, n = r.int(30, 255), b = n.toString(2);
          const parts = b.split('').map((d, i) => d === '1' ? 2 ** (b.length - 1 - i) : 0).filter(Boolean);
          return { text: '<p>Переведите число ' + D.sub(n, 10) + ' в двоичную систему счисления.</p>', answer: b,
            explain: n + ' = ' + parts.join(' + ') + ', поэтому ' + n + '<sub>10</sub> = ' + b + '<sub>2</sub>.' };
        }
      },
      {
        id: 't3', ekr: 6, title: 'В восьмеричную и шестнадцатеричную', points: 10,
        hint: 'Удобнее через двоичную: разбейте двоичную запись справа налево на тройки (для 8-ричной) или четвёрки (для 16-ричной) и переведите каждую группу.',
        gen(r) {
          const D = window.OrbitaDrill, base = r.pick([8, 16]), n = r.int(70, 900), b = n.toString(2);
          const g = base === 8 ? 3 : 4, padded = b.padStart(Math.ceil(b.length / g) * g, '0');
          const groups = padded.match(new RegExp('.{' + g + '}', 'g'));
          return { text: '<p>Переведите число ' + D.sub(n, 10) + ' в ' + (base === 8 ? 'восьмеричную' : 'шестнадцатеричную') + ' систему счисления.</p>', answer: up(n, base),
            explain: n + ' = ' + b + '<sub>2</sub>. Группы по ' + g + ': ' + groups.join(' ') + ' → ' + groups.map(x => up(parseInt(x, 2), base)).join(' ') + '. Ответ: ' + up(n, base) + '.' };
        }
      },
      {
        id: 't4', ekr: 6, title: 'Из шестнадцатеричной в двоичную', points: 10,
        hint: 'Каждую шестнадцатеричную цифру замените четырьмя двоичными: A = 1010, B = 1011, C = 1100, D = 1101, E = 1110, F = 1111. Ведущие нули в ответе не пишут.',
        gen(r) {
          const D = window.OrbitaDrill, n = r.int(0x1A, 0xFFF), h = up(n, 16);
          return { text: '<p>Переведите число ' + D.sub(h, 16) + ' в двоичную систему счисления.</p>', answer: n.toString(2),
            explain: h.split('').map(c => c + ' = ' + parseInt(c, 16).toString(2).padStart(4, '0')).join(', ') + '. Без ведущих нулей: ' + n.toString(2) + '.' };
        }
      },
      {
        id: 't5', ekr: 6, title: 'Сумма в разных системах', points: 10,
        hint: 'Переведите оба числа в десятичную систему, сложите, а результат переведите в нужную систему.',
        gen(r) {
          const D = window.OrbitaDrill;
          const a = r.int(20, 120), bb = r.pick([8, 16]), b = r.int(40, 400), res = r.pick([16, 8, 2].filter(x => x !== bb)), sum = a + b;
          return {
            text: '<p>Вычислите ' + D.sub(a.toString(2), 2) + ' + ' + D.sub(up(b, bb), bb) + '. Ответ запишите в ' + NAME[res] + ' системе счисления.</p>',
            answer: up(sum, res),
            explain: a.toString(2) + '<sub>2</sub> = ' + a + ', ' + up(b, bb) + '<sub>' + bb + '</sub> = ' + b + '. Сумма ' + sum + ' = ' + up(sum, res) + '<sub>' + res + '</sub>.'
          };
        }
      },
      {
        id: 't6', ekr: 6, title: 'Число с заданным количеством единиц', points: 10,
        hint: 'Запишите число в двоичном виде и считайте единицы. Наименьшее трёхзначное 16-ричное — 100₁₆ = 256 = 2⁸; четырёхзначное 8-ричное начинается с 1000₈ = 512 = 2⁹.',
        gen(r) {
          const D = window.OrbitaDrill;
          const base = r.pick([8, 16]), digits = base === 16 ? 3 : 4, k = r.int(2, 5), max = r.chance(0.4);
          const lo = base ** (digits - 1), hi = base ** digits - 1;
          let n = null;
          if (max) { for (let x = hi; x >= lo; x--) if (ones(x) === k) { n = x; break; } }
          else { for (let x = lo; x <= hi; x++) if (ones(x) === k) { n = x; break; } }
          const word = digits === 3 ? 'трёхзначное' : 'четырёхзначное';
          return {
            text: '<p>Укажите ' + (max ? 'наибольшее' : 'наименьшее') + ' ' + word + ' ' + (base === 16 ? 'шестнадцатеричное' : 'восьмеричное') + ' число, двоичная запись которого содержит ровно ' + k + (k < 5 ? ' единицы' : ' единиц') + '. ' +
              'В ответе запишите только само ' + (base === 16 ? 'шестнадцатеричное' : 'восьмеричное') + ' число, основание указывать не нужно.</p>',
            answer: up(n, base),
            explain: (base === 16 ? 'Трёхзначные 16-ричные числа' : 'Четырёхзначные 8-ричные числа') + ' — от ' + up(lo, base) + ' до ' + up(hi, base) + ', то есть от ' + lo + ' до ' + hi + '. ' +
              (max ? 'Ищем самое большое' : 'Ищем самое маленькое') + ' число с ' + k + ' единицами: ' + n + ' = ' + n.toString(2) + '<sub>2</sub> = ' + up(n, base) + '<sub>' + base + '</sub>.'
          };
        }
      },
      {
        id: 't7', ekr: 6, title: 'Сколько единиц', points: 10,
        hint: 'Разложите число на сумму степеней двойки: сколько слагаемых, столько и единиц в двоичной записи.',
        gen(r) {
          const n = r.int(100, 1000), b = n.toString(2);
          return { text: '<p>Сколько единиц в двоичной записи десятичного числа ' + n + '?</p>', answer: String(ones(n)),
            explain: n + ' = ' + b + '<sub>2</sub>, единиц: ' + ones(n) + '.' };
        }
      },
      {
        id: 't8', ekr: 7, title: 'Основание по последним цифрам', points: 10,
        hint: 'Последняя цифра — это остаток от деления числа на N. Значит, N делит (число − последняя цифра). Найдите общий делитель двух таких разностей, который больше этих цифр.',
        gen(r) {
          const D = window.OrbitaDrill;
          return D.retry(r, () => {
            const N = r.int(3, 9), a = r.int(20, 99), b = r.int(20, 99);
            if (a === b) return null;
            const ra = a % N, rb = b % N;
            const fits = [];
            for (let x = Math.max(ra, rb) + 1; x <= 40; x++) if (a % x === ra && b % x === rb) fits.push(x);
            if (fits.length !== 1) return null;
            return {
              text: '<p>В системе счисления с основанием N запись числа ' + D.sub(a, 10) + ' оканчивается на ' + ra + ', а запись числа ' + D.sub(b, 10) + ' — на ' + rb + '. Чему равно N?</p>',
              answer: String(N),
              explain: 'N делит ' + a + ' − ' + ra + ' = ' + (a - ra) + ' и ' + b + ' − ' + rb + ' = ' + (b - rb) + ', а ещё N больше ' + Math.max(ra, rb) + '. Подходит только N = ' + N + ' (' + a + ' = ' + Math.floor(a / N) + '·' + N + ' + ' + ra + ', ' + b + ' = ' + Math.floor(b / N) + '·' + N + ' + ' + rb + ').'
            };
          });
        }
      },
      {
        id: 't9', ekr: 7, title: 'Основание по записи числа', points: 10,
        hint: 'Распишите запись по разрядам: «abc» в системе N — это a·N² + b·N + c. Подберите N, при котором получится данное число (цифры должны быть меньше N).',
        gen(r) {
          const D = window.OrbitaDrill;
          return D.retry(r, () => {
            const N = r.int(3, 9), n = r.int(N * N, N * N * N - 1), s = n.toString(N);
            const fits = [];
            for (let x = 2; x <= 36; x++) { if (s.split('').some(c => parseInt(c, 36) >= x)) continue; if (parseInt(s, x) === n) fits.push(x); }
            if (fits.length !== 1) return null;
            const terms = s.split('').map((c, i) => c + '·N' + (s.length - 1 - i > 1 ? '<sup>' + (s.length - 1 - i) + '</sup>' : s.length - 1 - i === 1 ? '' : '⁰')).join(' + ').replace(/·N⁰/, '');
            return {
              text: '<p>Десятичное число ' + n + ' в системе счисления с основанием N записывается как ' + s + '. Чему равно N?</p>',
              answer: String(N),
              explain: s + '<sub>N</sub> = ' + terms + '. При N = ' + N + ': ' + s.split('').map((c, i) => c + '·' + N ** (s.length - 1 - i)).join(' + ') + ' = ' + n + '.'
            };
          });
        }
      },
      {
        id: 't10', ekr: 6, title: 'Разность в разных системах', points: 10,
        hint: 'Переведите оба числа в десятичную систему, вычтите, результат переведите в требуемую систему.',
        gen(r) {
          const D = window.OrbitaDrill;
          const a = r.int(200, 700), b = r.int(20, 180), ba = r.pick([16, 8]), bb = r.pick([2, 8]), res = r.pick([2, 8, 16, 10]);
          const d = a - b;
          return {
            text: '<p>Вычислите ' + D.sub(up(a, ba), ba) + ' − ' + D.sub(up(b, bb), bb) + '. Ответ запишите в ' + NAME[res] + ' системе счисления.</p>',
            answer: up(d, res),
            explain: up(a, ba) + '<sub>' + ba + '</sub> = ' + a + ', ' + up(b, bb) + '<sub>' + bb + '</sub> = ' + b + '. Разность ' + d + (res === 10 ? '.' : ' = ' + up(d, res) + '<sub>' + res + '</sub>.')
          };
        }
      }
    ]
  };
})();
