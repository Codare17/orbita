/* Собрано из исходников платформы (node build.mjs site). Эталонные решения хранятся в Google Таблице. */
window.ORBITA.lessons['pz-05'] = {
  type: "practice",
  intro: "<p>Переходим к JavaScript. Код пишете слева, справа — консоль. Код запускается кнопкой <b>▶ Запустить</b>, а <b>Проверить</b> запускает его заново и сверяет вывод.</p><p>Если в коде ошибка, консоль покажет её красным с номером строки.</p>",
  tasks: [
    {
      id: "t1",
      title: "Таблица умножения",
      points: 10,
      lang: "js",
      text: "<p>С помощью цикла <code>for</code> выведите таблицу умножения на 7 от 1 до 10. Каждая строка — в формате:</p><p><code>7 x 1 = 7</code></p><p>Используйте шаблонную строку: <code>`7 x ${i} = ${7 * i}`</code>.</p>",
      starter: "// Таблица умножения на 7\n\n",
      hint: "<code>for (let i = 1; i &lt;= 10; i++) { console.log(…); }</code>",
      tests: [
        {
          name: "В консоли 10 строк таблицы по порядку",
          check: (d, w, H) => H.inOrder([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => '7 x ' + i + ' = ' + 7 * i))
        },
        {
          name: "Используется цикл for",
          check: (d, w, H) => /\bfor\s*\(/.test(H.src()) || 'Выведите строки в цикле for, а не десятью console.log.'
        }
      ]
    },
    {
      id: "t2",
      title: "Сумма чисел",
      points: 10,
      lang: "js",
      text: "<p>Посчитайте в цикле сумму всех чисел от 1 до 100. Сумму храните в переменной <code>sum</code> (объявите её через <code>let</code>) и выведите в консоль.</p>",
      starter: "// Сумма чисел от 1 до 100\n\n",
      hint: "Перед циклом <code>let sum = 0;</code>, в цикле <code>sum += i;</code>.",
      tests: [
        {
          name: "В переменной sum правильная сумма",
          check: (d, w, H) => H.get('sum') === 5050 || 'Сейчас sum = ' + H.get('sum') + '. Проверьте границы цикла.'
        },
        {
          name: "Сумма выведена в консоль",
          check: (d, w, H) => H.inOrder([5050])
        },
        {
          name: "Ответ посчитан, а не вписан",
          check: (d, w, H) => (!/5050/.test(H.src()) && /\b(for|while)\b/.test(H.src())) || 'Число нужно получить циклом, а не вписать готовым.'
        }
      ]
    },
    {
      id: "t3",
      title: "FizzBuzz",
      points: 15,
      lang: "js",
      text: "<p>Классическая задача с собеседований. Выведите числа от 1 до 30, но:</p><ul><li>если число делится на 3 — вместо него <code>Fizz</code>;</li><li>если делится на 5 — <code>Buzz</code>;</li><li>если делится и на 3, и на 5 — <code>FizzBuzz</code>.</li></ul><p>Делится ли число: <code>n % 3 === 0</code>.</p>",
      starter: "// FizzBuzz от 1 до 30\n\n",
      hint: "Проверку на 15 (и на 3, и на 5) ставьте первой — иначе раньше сработает проверка на 3.",
      tests: [
        {
          name: "Все 30 строк верные и по порядку",
          check: (d, w, H) => {
              const exp = [];
              for (let n = 1; n <= 30; n++) exp.push(n % 15 === 0 ? 'FizzBuzz' : n % 3 === 0 ? 'Fizz' : n % 5 === 0 ? 'Buzz' : String(n));
              return H.inOrder(exp);
            }
        },
        {
          name: "Числа, кратные 15, — FizzBuzz",
          check: (d, w, H) => H.logs().filter(l => l === 'FizzBuzz').length === 2 || 'FizzBuzz должен появиться дважды: на 15 и 30.'
        }
      ]
    },
    {
      id: "t4",
      title: "Оценки по баллам",
      points: 15,
      lang: "js",
      text: "<p>В массиве <code>scores</code> баллы студентов за ПЗ. Переберите массив и для каждого значения выведите строку <code>баллы: оценка</code>, например <code>92: 5</code>.</p><p>Шкала как на нашей платформе: от 85 — «5», от 70 — «4», от 50 — «3», меньше — «2».</p>",
      starter: "const scores = [92, 78, 55, 31, 85, 70, 50, 49];\n\n",
      hint: "Перебор массива: <code>for (const s of scores) { … }</code>. Внутри — <code>if / else if / else</code> со знаками <code>&gt;=</code>.",
      tests: [
        {
          name: "Обычные значения",
          check: (d, w, H) => H.inOrder(['92: 5', '78: 4', '55: 3', '31: 2'])
        },
        {
          name: "Граничные значения 85, 70, 50, 49",
          check: (d, w, H) => H.inOrder(['85: 5', '70: 4', '50: 3', '49: 2']) || 'Проверьте знаки: «от 85» — это >= 85.'
        },
        {
          name: "Массив scores не изменён",
          check: (d, w, H) => H.eq(H.get('scores'), [92, 78, 55, 31, 85, 70, 50, 49]) || 'Не меняйте исходный массив.'
        }
      ]
    },
    {
      id: "t5",
      title: "Максимум, минимум, среднее",
      points: 15,
      lang: "js",
      text: "<p>В массиве <code>temps</code> температура за неделю. Одним циклом найдите максимум, минимум и среднее и выведите три строки:</p><p><code>Максимум: 7</code><br><code>Минимум: -3</code><br><code>Среднее: 2.0</code></p><p>Среднее округлите до одного знака: <code>avg.toFixed(1)</code>. Готовые <code>Math.max</code> и <code>Math.min</code> не используйте — цель научиться делать это самим.</p>",
      starter: "const temps = [-3, 2, 5, -1, 7, 4, 0];\n\n",
      hint: "Начните с <code>let max = temps[0], min = temps[0], total = 0;</code> и в цикле сравнивайте каждый элемент.",
      tests: [
        {
          name: "Максимум",
          check: (d, w, H) => H.inOrder(['Максимум: 7'])
        },
        {
          name: "Минимум",
          check: (d, w, H) => H.inOrder(['Минимум: -3'])
        },
        {
          name: "Среднее с одним знаком",
          check: (d, w, H) => H.inOrder(['Среднее: 2.0'])
        },
        {
          name: "Без Math.max и Math.min",
          check: (d, w, H) => !/Math\.(max|min)/.test(H.src()) || 'Найдите максимум и минимум сами, в цикле.'
        }
      ]
    },
    {
      id: "t6",
      title: "Объект студента",
      points: 10,
      lang: "js",
      text: "<p>Создайте объект <code>student</code> со свойствами:</p><ul><li><code>name</code> — имя (строка);</li><li><code>group</code> — группа (строка);</li><li><code>marks</code> — массив минимум из трёх оценок.</li></ul><p>Выведите строку <code>Имя из Группа</code>, например <code>Иван из КСК114</code>, взяв значения из объекта.</p>",
      starter: "// Объект student\n\n",
      hint: "Свойства читаются через точку: <code>`${student.name} из ${student.group}`</code>.",
      tests: [
        {
          name: "Есть объект student",
          check: (d, w, H) => { const s = H.get('student'); return (!!s && typeof s === 'object' && !Array.isArray(s)) || 'Создайте объект: const student = { … };'; }
        },
        {
          name: "name и group — строки",
          check: (d, w, H) => { const s = H.get('student') || {}; return (typeof s.name === 'string' && s.name.trim() !== '' && typeof s.group === 'string' && s.group.trim() !== '') || 'Заполните свойства name и group строками.'; }
        },
        {
          name: "marks — массив из 3+ чисел",
          check: (d, w, H) => { const m = (H.get('student') || {}).marks; return (Array.isArray(m) && m.length >= 3 && m.every(x => typeof x === 'number')) || 'marks должен быть массивом минимум из трёх чисел.'; }
        },
        {
          name: "Строка «Имя из Группа» в консоли",
          check: (d, w, H) => { const s = H.get('student') || {}; return H.inOrder([s.name + ' из ' + s.group]); }
        }
      ]
    },
    {
      id: "t7",
      title: "Средний балл группы",
      points: 15,
      lang: "js",
      text: "<p>Для каждого студента из массива <code>students</code> выведите средний балл с одним знаком после запятой: <code>Аня: 4.8</code>.</p><p>В конце выведите, у кого средний балл выше всех: <code>Лучший: Аня</code>.</p>",
      starter: "const students = [\n  { name: \"Аня\", marks: [5, 5, 4, 5] },\n  { name: \"Борис\", marks: [3, 4, 4, 3] },\n  { name: \"Вика\", marks: [5, 4, 5, 4] },\n  { name: \"Гоша\", marks: [4, 3, 5, 4] }\n];\n\n",
      hint: "Два вложенных цикла: внешний по студентам, внутренний по оценкам. Лучшего ищите так же, как максимум в задании 5.",
      tests: [
        {
          name: "Средний балл каждого студента",
          check: (d, w, H) => H.inOrder(['Аня: 4.8', 'Борис: 3.5', 'Вика: 4.5', 'Гоша: 4.0'])
        },
        {
          name: "Найден лучший студент",
          check: (d, w, H) => H.inOrder(['Лучший: Аня'])
        },
        {
          name: "Ответ посчитан из массива",
          check: (d, w, H) => /\b(for|while|forEach|reduce)\b/.test(H.src()) || 'Считайте средние в цикле, а не вписывайте готовые числа.'
        }
      ]
    },
    {
      id: "t8",
      title: "Корзина со скидкой",
      points: 10,
      lang: "js",
      text: "<p>В корзине <code>cart</code> товары с ценой и количеством. Посчитайте сумму. Если она больше 5000 ₽, дайте скидку 10%. Выведите три строки:</p><p><code>Сумма: 5500</code><br><code>Скидка: 550</code><br><code>К оплате: 4950</code></p><p>Если скидки нет, строка <code>Скидка: 0</code>.</p>",
      starter: "const cart = [\n  { title: \"Мышь\", price: 1200, qty: 2 },\n  { title: \"Клавиатура\", price: 2500, qty: 1 },\n  { title: \"Коврик\", price: 600, qty: 1 }\n];\n\n",
      hint: "Стоимость позиции — <code>item.price * item.qty</code>. Скидка: <code>const discount = sum &gt; 5000 ? sum * 0.1 : 0;</code>",
      tests: [
        {
          name: "Сумма с учётом количества",
          check: (d, w, H) => H.inOrder(['Сумма: 5500']) || 'Не забудьте умножить цену на количество (qty).'
        },
        {
          name: "Скидка 10% при сумме больше 5000",
          check: (d, w, H) => H.inOrder(['Скидка: 550'])
        },
        {
          name: "Итог к оплате",
          check: (d, w, H) => H.inOrder(['К оплате: 4950'])
        },
        {
          name: "Сумма посчитана из массива",
          check: (d, w, H) => !/5500|4950/.test(H.src()) || 'Получите числа расчётом, а не вписывайте готовые.'
        }
      ]
    }
  ]
};
