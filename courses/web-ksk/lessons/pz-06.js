/* Собрано из исходников платформы (node build.mjs site). Эталонные решения хранятся в Google Таблице. */
window.ORBITA.lessons['pz-06'] = {
  type: "practice",
  intro: "<p>Пишем функции, которые возвращают результат через <code>return</code>. Автопроверка сама вызовет вашу функцию с разными значениями, в том числе с граничными, поэтому важно точно соблюсти имя функции и формат ответа.</p><p>Для своей проверки вызывайте функцию и выводите результат: <code>console.log(greet(\"Аня\"))</code>.</p>",
  tasks: [
    {
      id: "t1",
      title: "Приветствие",
      points: 10,
      lang: "js",
      text: "<p>Напишите функцию <code>greet(name)</code>, которая <b>возвращает</b> строку <code>Привет, Аня!</code> для имени «Аня».</p>",
      starter: "// Функция greet\n\n\nconsole.log(greet(\"Аня\"));\n",
      hint: "<code>function greet(name) { return `Привет, ${name}!`; }</code> — без return функция вернёт undefined.",
      tests: [
        {
          name: "Есть функция greet",
          check: (d, w, H) => typeof H.get('greet') === 'function' || 'Не нашли функцию greet.'
        },
        {
          name: "greet(\"Аня\") → «Привет, Аня!»",
          check: (d, w, H) => { const r = H.get('greet')('Аня'); return r === 'Привет, Аня!' || 'Функция вернула: ' + JSON.stringify(r); }
        },
        {
          name: "Работает с любым именем",
          check: (d, w, H) => H.get('greet')('Борис') === 'Привет, Борис!' || 'Имя должно браться из параметра name.'
        }
      ]
    },
    {
      id: "t2",
      title: "Стрелочная функция",
      points: 10,
      lang: "js",
      text: "<p>Объявите стрелочную функцию <code>square</code>, которая возвращает квадрат числа: <code>const square = (x) =&gt; …</code>.</p>",
      starter: "@prev",
      hint: "Если тело — одно выражение, фигурные скобки и return не нужны: <code>const square = x =&gt; x * x;</code>",
      tests: [
        {
          name: "square — стрелочная функция",
          check: (d, w, H) => { const f = H.get('square'); return (typeof f === 'function' && /=>/.test(f.toString())) || 'Объявите: const square = (x) => …'; }
        },
        {
          name: "square(7) → 49, square(-3) → 9, square(0) → 0",
          check: (d, w, H) => { const f = H.get('square'); return (f(7) === 49 && f(-3) === 9 && f(0) === 0) || 'square(7) вернула ' + f(7); }
        }
      ]
    },
    {
      id: "t3",
      title: "Чётное или нет",
      points: 15,
      lang: "js",
      text: "<p>Напишите функцию <code>isEven(n)</code>, которая возвращает <code>true</code>, если число чётное, и <code>false</code>, если нечётное. Возвращать нужно именно логическое значение, а не строку.</p>",
      starter: "@prev",
      hint: "Выражение <code>n % 2 === 0</code> уже само по себе true или false — его можно сразу вернуть.",
      tests: [
        {
          name: "isEven(4) → true, isEven(7) → false",
          check: (d, w, H) => { const f = H.get('isEven'); if (typeof f !== 'function') return 'Не нашли функцию isEven.'; return (f(4) === true && f(7) === false) || 'isEven(4) вернула ' + JSON.stringify(f(4)) + ', isEven(7) — ' + JSON.stringify(f(7)); }
        },
        {
          name: "Ноль и отрицательные числа",
          check: (d, w, H) => { const f = H.get('isEven'); return (f(0) === true && f(-2) === true && f(-5) === false) || 'Проверьте isEven(0), isEven(-2), isEven(-5).'; }
        }
      ]
    },
    {
      id: "t4",
      title: "Оценка по баллам",
      points: 15,
      lang: "js",
      text: "<p>Оформите шкалу оценок из ПЗ №5 функцией <code>grade(score)</code>. Она возвращает число: от 85 — <code>5</code>, от 70 — <code>4</code>, от 50 — <code>3</code>, иначе <code>2</code>.</p><p>Проверка вызовет функцию и на граничных значениях.</p>",
      starter: "@prev",
      hint: "Внутри функции можно сразу писать <code>return</code> в каждой ветке: <code>if (score &gt;= 85) return 5;</code>",
      tests: [
        {
          name: "Обычные значения: 92, 78, 55, 10",
          check: (d, w, H) => { const f = H.get('grade'); if (typeof f !== 'function') return 'Не нашли функцию grade.'; const r = [92, 78, 55, 10].map(f); return H.eq(r, [5, 4, 3, 2]) || 'Получилось: ' + r.join(', ') + ', а нужно 5, 4, 3, 2.'; }
        },
        {
          name: "Границы: 85, 84, 70, 69, 50, 49",
          check: (d, w, H) => { const r = [85, 84, 70, 69, 50, 49].map(H.get('grade')); return H.eq(r, [5, 4, 4, 3, 3, 2]) || 'Получилось: ' + r.join(', ') + ', а нужно 5, 4, 4, 3, 3, 2.'; }
        },
        {
          name: "Возвращается число",
          check: (d, w, H) => typeof H.get('grade')(90) === 'number' || 'Верните число 5, а не строку "5".'
        }
      ]
    },
    {
      id: "t5",
      title: "Цена со скидкой",
      points: 15,
      lang: "js",
      text: "<p>Напишите функцию <code>finalPrice(cost, discount = 0)</code>: цена со скидкой в процентах, округлённая до рубля через <code>Math.round</code>.</p><p><code>finalPrice(1000)</code> → 1000, <code>finalPrice(1000, 15)</code> → 850.</p>",
      starter: "@prev",
      hint: "Скидка 15% — это умножить на <code>(1 - 15 / 100)</code>.",
      tests: [
        {
          name: "Скидка считается",
          check: (d, w, H) => { const f = H.get('finalPrice'); if (typeof f !== 'function') return 'Не нашли функцию finalPrice.'; return f(1000, 15) === 850 || 'finalPrice(1000, 15) вернула ' + f(1000, 15); }
        },
        {
          name: "Без скидки — параметр по умолчанию",
          check: (d, w, H) => H.get('finalPrice')(1000) === 1000 || 'finalPrice(1000) должна вернуть 1000. Задайте discount = 0.'
        },
        {
          name: "Округление до рубля",
          check: (d, w, H) => H.get('finalPrice')(999, 10) === 899 || 'finalPrice(999, 10) должна вернуть 899 (899,1 округляется).'
        }
      ]
    },
    {
      id: "t6",
      title: "Среднее значение",
      points: 15,
      lang: "js",
      text: "<p>Напишите функцию <code>average(arr)</code>, которая возвращает среднее арифметическое массива чисел.</p><p>Для пустого массива функция возвращает <code>0</code>: делить на ноль нельзя.</p>",
      starter: "@prev",
      hint: "Сначала проверьте <code>if (arr.length === 0) return 0;</code>, потом сложите элементы в цикле.",
      tests: [
        {
          name: "average([5, 4, 3]) → 4",
          check: (d, w, H) => { const f = H.get('average'); if (typeof f !== 'function') return 'Не нашли функцию average.'; return f([5, 4, 3]) === 4 || 'Вернулось ' + f([5, 4, 3]); }
        },
        {
          name: "Дробный результат: [5, 4] → 4.5",
          check: (d, w, H) => H.get('average')([5, 4]) === 4.5 || 'Не округляйте результат.'
        },
        {
          name: "Пустой массив → 0",
          check: (d, w, H) => H.get('average')([]) === 0 || 'Для [] вернулось ' + H.get('average')([]) + '. Нужно 0.'
        }
      ]
    },
    {
      id: "t7",
      title: "Итог: надёжность пароля",
      points: 20,
      lang: "js",
      final: true,
      variants: [
        {
          min: 6,
          strong: 10
        },
        {
          min: 8,
          strong: 12
        },
        {
          min: 5,
          strong: 9
        },
        {
          min: 7,
          strong: 11
        }
      ],
      text: "<p>Напишите функцию <code>passwordStrength(password)</code>, которая возвращает одну из строк: <code>слабый</code>, <code>средний</code> или <code>надёжный</code>. Правила вашего варианта:</p><ul><li>короче <b>{{min}}</b> символов — <code>слабый</code>;</li><li>не короче <b>{{strong}}</b> символов, есть хотя бы одна цифра и одна заглавная буква (латинская или русская) — <code>надёжный</code>;</li><li>всё остальное — <code>средний</code>.</li></ul>",
      starter: "// Надёжность пароля\n\n",
      hint: "Есть ли цифра: <code>/\\d/.test(password)</code>. Заглавная буква: <code>/[A-ZА-ЯЁ]/.test(password)</code>.",
      tests: [
        {
          name: "Есть функция passwordStrength",
          check: (d, w, H) => typeof H.get('passwordStrength') === 'function' || 'Не нашли функцию passwordStrength.'
        },
        {
          name: "Короткий пароль — слабый",
          check: (d, w, H) => {
              const f = H.get('passwordStrength');
              const p = 'Aa1' + 'a'.repeat(H.v.min - 4);
              return f(p) === 'слабый' || 'Для пароля из ' + p.length + ' символов вернулось «' + f(p) + '», нужно «слабый».';
            }
        },
        {
          name: "Длинный с цифрой и заглавной — надёжный",
          check: (d, w, H) => {
              const f = H.get('passwordStrength');
              const p1 = 'Aa1' + 'a'.repeat(H.v.strong - 3), p2 = 'пароль' + 'Я'.repeat(Math.max(0, H.v.strong - 7)) + '7';
              return (f(p1) === 'надёжный' && f(p2) === 'надёжный') || 'Пароль «' + p1 + '» должен быть надёжным, вернулось «' + f(p1) + '».';
            }
        },
        {
          name: "Без цифры, без заглавной или коротковат — средний",
          check: (d, w, H) => {
              const f = H.get('passwordStrength');
              const cases = ['A' + 'a'.repeat(H.v.strong + 2), '1' + 'a'.repeat(H.v.strong + 2), 'Aa1' + 'a'.repeat(H.v.strong - 4), 'a'.repeat(H.v.min)];
              const bad = cases.find(p => f(p) !== 'средний');
              return !bad || 'Для «' + bad + '» вернулось «' + f(bad) + '», нужно «средний».';
            }
        }
      ]
    }
  ]
};
