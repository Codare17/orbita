/* ПЗ №6. Что выведет программа на Python: присваивания, условия, циклы while и for, функции, списки (задания ЕКР 20, 21, 22).
   Генератор строит программу и сам «выполняет» её на JavaScript, чтобы получить ответ. */
(function () {
  // Деление нацело и остаток как в Python (для отрицательных чисел — округление вниз).
  const idiv = (a, b) => Math.floor(a / b), mod = (a, b) => ((a % b) + b) % b;
  const trace = rows => '<table class="drill-table"><tbody>' + rows.map(r => '<tr>' + r.map(c => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table>';

  window.ORBITA.lessons['inf-pz-06'] = {
    type: 'drill',
    intro: '<p>На ЕКР программу нельзя запустить — её нужно «выполнить» в уме. Заведите на черновике таблицу: столбец для каждой переменной и строка на каждый шаг цикла.</p>' +
      '<p>Напоминание: <code>//</code> — деление нацело, <code>%</code> — остаток, <code>range(a, b)</code> — числа от a до b − 1.</p>',
    tasks: [
      {
        id: 't1', ekr: null, title: 'Присваивания', points: 10,
        hint: 'Выполняйте строки сверху вниз и после каждой записывайте новые значения переменных. Новое значение заменяет старое.',
        gen(r) {
          let a = r.int(2, 9), b = r.int(2, 9);
          const k = r.int(2, 4), op = r.pick(['+', '-']);
          const code = 'a = ' + a + '\nb = ' + b + '\na = a ' + op + ' b * ' + k + '\nb = a - b\nprint(a + b)';
          const a1 = op === '+' ? a + b * k : a - b * k, b1 = a1 - b;
          return { text: '<p>Что выведет программа?</p>', code, answer: String(a1 + b1),
            explain: 'a = ' + a + ', b = ' + b + '. Умножение раньше сложения: a = ' + a + ' ' + op + ' ' + b + '·' + k + ' = ' + a1 + '. b = ' + a1 + ' − ' + b + ' = ' + b1 + '. Выводится ' + a1 + ' + ' + b1 + ' = ' + (a1 + b1) + '.' };
        }
      },
      {
        id: 't2', ekr: null, title: 'Деление нацело и остаток', points: 10,
        hint: 'x // 10 отбрасывает последнюю цифру, x % 10 — это последняя цифра. Например, 347 // 10 = 34, 347 % 10 = 7.',
        gen(r) {
          const x = r.int(100, 999), d = r.pick([10, 100, 3, 4, 7]);
          const a = idiv(x, d), b = mod(x, d);
          const code = 'x = ' + x + '\na = x // ' + d + '\nb = x % ' + d + '\nprint(a + b)';
          return { text: '<p>Что выведет программа?</p>', code, answer: String(a + b),
            explain: x + ' // ' + d + ' = ' + a + ', ' + x + ' % ' + d + ' = ' + b + ' (' + x + ' = ' + a + '·' + d + ' + ' + b + '). Сумма: ' + (a + b) + '.' };
        }
      },
      {
        id: 't3', ekr: null, title: 'Условие if', points: 10,
        hint: 'Проверьте условие с данным значением. Если оно истинно — выполняется блок после if, иначе — блок после else.',
        gen(r) {
          const x = r.int(3, 40), t = r.int(5, 30), p = r.int(2, 5), q = r.int(2, 9), cmp = r.pick(['>', '<', '>=', '%']);
          let code, res, cond;
          if (cmp === '%') {
            code = 'x = int(input())\nif x % 2 == 0:\n    x = x // 2\nelse:\n    x = x * ' + p + ' + 1\nprint(x)';
            cond = x % 2 === 0; res = cond ? x / 2 : x * p + 1;
          } else {
            code = 'x = int(input())\nif x ' + cmp + ' ' + t + ':\n    x = x - ' + q + '\nelse:\n    x = x * ' + p + '\nprint(x)';
            cond = cmp === '>' ? x > t : cmp === '<' ? x < t : x >= t; res = cond ? x - q : x * p;
          }
          return { text: '<p>Что выведет программа, если ввести число <b>' + x + '</b>?</p>', code, answer: String(res),
            explain: 'Условие ' + (cmp === '%' ? x + ' % 2 == 0' : x + ' ' + cmp + ' ' + t) + ' ' + (cond ? 'истинно' : 'ложно') + ', выполняется ветка ' + (cond ? 'if' : 'else') + '. Выводится ' + res + '.' };
        }
      },
      {
        id: 't4', ekr: 20, title: 'Цикл while', points: 10,
        hint: 'Каждый шаг: проверить условие → если истинно, выполнить тело и вернуться к проверке. Ведите таблицу значений k и i.',
        gen(r) {
          const D = window.OrbitaDrill;
          return D.retry(r, () => {
            const k0 = r.int(10, 40), i0 = r.int(0, 10), di = r.int(1, 4), dk = r.int(2, 5), op = r.pick(['>', '>=']);
            const code = 'k = int(input())\ni = ' + i0 + '\nwhile k ' + op + ' 0:\n    i = i + ' + di + '\n    k = k - ' + dk + '\nprint(i)';
            let k = k0, i = i0, steps = 0;
            while (op === '>' ? k > 0 : k >= 0) { i += di; k -= dk; steps++; }
            if (steps < 3 || steps > 15) return null;
            return { text: '<p>Что выведет программа при вводе числа <b>' + k0 + '</b>?</p>', code, answer: String(i),
              explain: 'Цикл выполняется, пока k ' + op + ' 0. k уменьшается на ' + dk + ': ' + Array.from({ length: steps + 1 }, (_, s) => k0 - s * dk).join(' → ') + ' — тело выполнилось ' + steps + ' раз. ' +
                'i = ' + i0 + ' + ' + steps + '·' + di + ' = ' + i + '.' };
          });
        }
      },
      {
        id: 't5', ekr: 20, title: 'Цикл while с суммой', points: 10,
        hint: 'Цикл останавливается, как только условие стало ложным. Запишите s и n после каждого шага.',
        gen(r) {
          const D = window.OrbitaDrill;
          return D.retry(r, () => {
            const lim = r.int(20, 120), a = r.int(3, 12), start = r.int(0, 3);
            const code = 's = 0\nn = ' + start + '\nwhile s < ' + lim + ':\n    s = s + ' + a + '\n    n = n + 1\nprint(n)';
            let s = 0, n = start; const seq = [0];
            while (s < lim) { s += a; n++; seq.push(s); }
            if (seq.length > 14) return null;
            return { text: '<p>Что выведет программа?</p>', code, answer: String(n),
              explain: 's: ' + seq.join(' → ') + '. Остановились, когда s = ' + s + ' (не меньше ' + lim + '). Шагов ' + (n - start) + ', n = ' + start + ' + ' + (n - start) + ' = ' + n + '.' };
          });
        }
      },
      {
        id: 't6', ekr: 21, title: 'Цикл for', points: 10,
        hint: 'range(6) — это 0, 1, 2, 3, 4, 5: тело выполнится 6 раз. Ведите таблицу: i, x, S.',
        gen(r) {
          const x0 = r.int(5, 20), n = r.int(4, 7), d = r.pick([1, 2]), op = r.pick(['-', '+']);
          const code = 'x = int(input())\nS = 0\nfor i in range(' + n + '):\n    S = S + x\n    x = x ' + op + ' ' + d + '\nprint(S)';
          let x = x0, S = 0; const rows = [['i', 'x', 'S']];
          for (let i = 0; i < n; i++) { S += x; rows.push([i, x, S]); x = op === '-' ? x - d : x + d; }
          return { text: '<p>Что выведет программа при вводе числа <b>' + x0 + '</b>?</p>', code, answer: String(S),
            explain: 'Тело выполнится ' + n + ' раз. К S прибавляются ' + rows.slice(1).map(r2 => r2[1]).join(' + ') + ' = ' + S + '.' + trace(rows) };
        }
      },
      {
        id: 't7', ekr: 21, title: 'Цикл for с условием', points: 10,
        hint: 'range(a, b) идёт от a до b − 1. Для каждого i проверьте условие: прибавляются только подходящие числа.',
        gen(r) {
          const a = r.int(1, 10), b = a + r.int(6, 12), m = r.pick([2, 3, 4, 5]), rem = r.int(0, m - 1), what = r.pick(['count', 'sum']);
          const code = 's = 0\nfor i in range(' + a + ', ' + b + '):\n    if i % ' + m + ' == ' + rem + ':\n        s = s + ' + (what === 'sum' ? 'i' : '1') + '\nprint(s)';
          const good = []; for (let i = a; i < b; i++) if (i % m === rem) good.push(i);
          const ans = what === 'sum' ? good.reduce((x, y) => x + y, 0) : good.length;
          return { text: '<p>Что выведет программа?</p>', code, answer: String(ans),
            explain: 'i пробегает ' + a + '…' + (b - 1) + '. Условие i % ' + m + ' == ' + rem + ' верно для ' + (good.join(', ') || 'ни одного числа') + '. ' + (what === 'sum' ? 'Сумма: ' + ans : 'Их количество: ' + ans) + '.' };
        }
      },
      {
        id: 't8', ekr: 20, title: 'Функция в условии цикла', points: 10,
        hint: 'Сначала поймите, что считает функция, например F(n) = 3·n. Затем проверяйте условие цикла для i = 10, 9, 8… пока оно не станет ложным.',
        gen(r) {
          const D = window.OrbitaDrill;
          return D.retry(r, () => {
            const a = r.int(2, 5), b = r.int(-5, 5), i0 = r.pick([10, 12, 15, 20]), k = r.int(5, 50);
            const F = n => a * n + b;
            const code = 'def F(n):\n    return ' + a + ' * n' + (b ? (b > 0 ? ' + ' + b : ' - ' + -b) : '') + '\n\nk = int(input())\ni = ' + i0 + '\nwhile F(i) > k:\n    i = i - 1\nprint(i)';
            let i = i0, steps = 0; while (F(i) > k && steps < 100) { i--; steps++; }
            if (steps < 2 || steps > 18) return null;
            return { text: '<p>Определите, что выведет программа при вводе числа <b>' + k + '</b>.</p>', code, answer: String(i),
              explain: 'F(n) = ' + a + '·n' + (b ? (b > 0 ? ' + ' + b : ' − ' + -b) : '') + '. Цикл уменьшает i, пока F(i) > ' + k + '. F(' + (i + 1) + ') = ' + F(i + 1) + ' > ' + k + ', а F(' + i + ') = ' + F(i) + ' ≤ ' + k + ' — цикл остановился. Выводится ' + i + '.' };
          });
        }
      },
      {
        id: 't9', ekr: 22, title: 'Обработка списка', points: 10,
        hint: 'Выпишите элементы с номерами: A[0], A[1], … Цикл идёт по k от 1 до 9 и сравнивает A[k] с соседом A[k − 1].',
        gen(r) {
          const A = Array.from({ length: 10 }, () => r.int(1, 30)), kind = r.pick(['>=', '>', '<']), acc = r.pick(['sum', 'count']);
          const code = 'A = [' + A.join(', ') + ']\nf = 0\nfor k in range(1, 10):\n    if A[k] ' + kind + ' A[k - 1]:\n        f = f + ' + (acc === 'sum' ? 'A[k]' : '1') + '\nprint(f)';
          const ok = []; for (let k = 1; k < 10; k++) if (kind === '>=' ? A[k] >= A[k - 1] : kind === '>' ? A[k] > A[k - 1] : A[k] < A[k - 1]) ok.push(k);
          const ans = acc === 'sum' ? ok.reduce((s, k) => s + A[k], 0) : ok.length;
          return { text: '<p>Определите значение переменной f после выполнения программы.</p>', code, answer: String(ans),
            explain: 'Условие A[k] ' + kind + ' A[k − 1] верно при k = ' + (ok.join(', ') || '— ни разу') + '. ' + (acc === 'sum' ? 'Складываем A[k]: ' + (ok.map(k => A[k]).join(' + ') || '0') + ' = ' + ans : 'Таких k: ' + ans) + '.' };
        }
      },
      {
        id: 't10', ekr: 22, title: 'Цифры числа', points: 10,
        hint: 'n % 10 — последняя цифра, n // 10 — число без последней цифры. Цикл перебирает цифры справа налево.',
        gen(r) {
          const n0 = r.int(1000, 99999), kind = r.pick(['sum', 'count', 'max']);
          const body = kind === 'sum' ? '    s = s + n % 10\n' : kind === 'count' ? '    if n % 10 > 4:\n        s = s + 1\n' : '    if n % 10 > s:\n        s = n % 10\n';
          const code = 'n = int(input())\ns = 0\nwhile n > 0:\n' + body + '    n = n // 10\nprint(s)';
          const digits = String(n0).split('').map(Number).reverse();
          const ans = kind === 'sum' ? digits.reduce((a, b) => a + b, 0) : kind === 'count' ? digits.filter(d => d > 4).length : Math.max(...digits);
          return { text: '<p>Что выведет программа при вводе числа <b>' + n0 + '</b>?</p>', code, answer: String(ans),
            explain: 'Цифры справа налево: ' + digits.join(', ') + '. ' + (kind === 'sum' ? 'Программа считает их сумму: ' + ans : kind === 'count' ? 'Программа считает цифры больше 4: ' + ans : 'Программа ищет наибольшую цифру: ' + ans) + '.' };
        }
      }
    ]
  };
})();
