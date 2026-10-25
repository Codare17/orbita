/* Собрано из исходников платформы (node build.mjs site). Эталонные решения хранятся в Google Таблице. */
window.ORBITA.lessons['l-1-3-1'] = {
  type: "theory",
  steps: [
    {
      type: "card",
      title: "JavaScript и стандарт ES6+",
      html: "<p>JavaScript — язык, который браузер выполняет прямо на странице: реагирует на клики, считает, загружает данные. Тот же язык работает и на сервере (Node.js).</p><p>Язык развивается по стандарту <b>ECMAScript</b>. Версия 2015 года (<b>ES6</b>) сильно его изменила: <code>let</code> и <code>const</code>, стрелочные функции, шаблонные строки, деструктуризация. С тех пор новые возможности выходят каждый год — всё это вместе называют <b>ES6+</b>.</p><p>Подключаем код в конце <code>&lt;body&gt;</code> или из файла:</p>",
      code: {
        lang: "html",
        src: "<script src=\"script.js\"></script>"
      }
    },
    {
      type: "card",
      title: "Консоль — первый инструмент",
      html: "<p><code>console.log(…)</code> выводит значение в консоль. В Chrome она открывается клавишей F12, вкладка <b>Console</b>. В тренажёре консоль справа.</p><p>Через консоль проверяют, что лежит в переменной и дошёл ли код до нужной строки. Красные сообщения — ошибки с номером строки.</p>",
      code: {
        lang: "js",
        src: "console.log(\"Привет!\");\nconsole.log(2 + 2);          // 4\nconsole.log(\"Сумма:\", 10 + 5); // Сумма: 15"
      }
    },
    {
      type: "card",
      title: "Переменные: let и const",
      html: "<ul><li><code>const</code> — значение задаётся один раз. Пишите <code>const</code> по умолчанию.</li><li><code>let</code> — значение будет меняться: счётчик, сумма.</li><li><code>var</code> — старый способ, в новом коде не используется.</li></ul><p>Имена — латиницей в стиле camelCase: <code>totalPrice</code>, <code>userName</code>.</p>",
      code: {
        lang: "js",
        src: "const group = \"КСК114\";\nlet count = 0;\ncount = count + 1;   // можно\ngroup = \"КСК134\";    // ошибка: const нельзя переприсвоить"
      }
    },
    {
      type: "quiz",
      q: "Какое объявление подходит для счётчика, который увеличивается в цикле?",
      options: [
        "<code>let i = 0</code>",
        "<code>const i = 0</code>",
        "<code>var i == 0</code>",
        "<code>i := 0</code>"
      ],
      answer: 0,
      explain: "Значение будет меняться, поэтому let. const не даст изменить значение."
    },
    {
      type: "card",
      title: "Типы данных",
      html: "<ul><li><b>number</b> — числа: <code>42</code>, <code>3.14</code>;</li><li><b>string</b> — строки в кавычках: <code>\"текст\"</code>, <code>'текст'</code>;</li><li><b>boolean</b> — <code>true</code> или <code>false</code>;</li><li><b>undefined</b> — значение не задано, <b>null</b> — «пусто» намеренно;</li><li><b>object</b> — объекты и массивы.</li></ul><p>Узнать тип: <code>typeof</code>. Строка из поля ввода превращается в число так: <code>Number(\"42\")</code>.</p>"
    },
    {
      type: "quiz",
      q: "Что выведет код?",
      code: {
        lang: "js",
        src: "console.log(\"5\" + 3);\nconsole.log(\"5\" - 3);"
      },
      options: [
        "<code>53</code> и <code>2</code>",
        "<code>8</code> и <code>2</code>",
        "<code>53</code> и <code>53</code>",
        "Ошибку"
      ],
      answer: 0,
      explain: "Плюс со строкой склеивает строки. Минус работает только с числами, поэтому строка \"5\" превращается в число."
    },
    {
      type: "card",
      title: "Шаблонные строки",
      html: "<p>Строка в обратных кавычках <code>`…`</code> позволяет вставлять значения через <code>${…}</code> и писать текст в несколько строк. Не нужно склеивать куски плюсами.</p>",
      code: {
        lang: "js",
        src: "const name = \"Аня\";\nconst score = 92;\nconsole.log(`${name} набрала ${score} баллов`);\n// Аня набрала 92 баллов"
      }
    },
    {
      type: "build",
      q: "Соберите строку, которая выведет «7 x 3 = 21»",
      tokens: [
        "console.log(",
        "`${a} x ${b} = ${a * b}`",
        ");"
      ],
      extra: [
        "\"${a} x ${b}\"",
        "print("
      ],
      explain: "Подстановка ${…} работает только в обратных кавычках."
    },
    {
      type: "card",
      title: "Сравнение и логика",
      html: "<ul><li><code>===</code> и <code>!==</code> — строгое сравнение: значение и тип. Используйте их, а не <code>==</code>.</li><li><code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code> — больше, меньше.</li><li><code>&amp;&amp;</code> — И, <code>||</code> — ИЛИ, <code>!</code> — НЕ.</li><li><code>%</code> — остаток от деления: <code>10 % 3</code> равно 1, чётное число: <code>n % 2 === 0</code>.</li></ul>"
    },
    {
      type: "quiz",
      q: "Чему равно выражение <code>5 === \"5\"</code>?",
      options: [
        "<code>false</code>",
        "<code>true</code>",
        "<code>undefined</code>",
        "Ошибка"
      ],
      answer: 0,
      explain: "Строгое сравнение учитывает тип: число и строка не равны. А вот 5 == \"5\" дало бы true — поэтому == и не используют."
    },
    {
      type: "card",
      title: "Условия",
      code: {
        lang: "js",
        src: "const score = 78;\n\nif (score >= 85) {\n  console.log(\"Отлично\");\n} else if (score >= 70) {\n  console.log(\"Хорошо\");\n} else {\n  console.log(\"Надо подтянуть\");\n}\n\n// Короткая запись — тернарный оператор:\nconst status = score >= 50 ? \"зачёт\" : \"незачёт\";"
      },
      html: "<p>Условия проверяются сверху вниз, срабатывает первая верная ветка.</p>"
    },
    {
      type: "quiz",
      q: "Что выведет код при <code>score = 70</code>?",
      code: {
        lang: "js",
        src: "if (score > 85) console.log(\"A\");\nelse if (score > 70) console.log(\"B\");\nelse console.log(\"C\");"
      },
      options: [
        "C",
        "B",
        "A",
        "Ничего"
      ],
      answer: 0,
      explain: "70 > 70 — ложь, поэтому вторая ветка не срабатывает. Для «70 и больше» нужен знак >=."
    },
    {
      type: "card",
      title: "Циклы",
      code: {
        lang: "js",
        src: "// for — когда известно, сколько раз\nfor (let i = 1; i <= 5; i++) {\n  console.log(i);\n}\n\n// while — пока условие верно\nlet n = 100;\nwhile (n > 1) n = n / 2;\n\n// for...of — по элементам массива\nconst groups = [\"КСК114\", \"КСК134\"];\nfor (const g of groups) console.log(g);"
      },
      html: "<p>Следите, чтобы условие цикла когда-нибудь стало ложным, иначе получится бесконечный цикл и страница зависнет.</p>"
    },
    {
      type: "order",
      q: "Расставьте части цикла for в правильном порядке",
      items: [
        "for (",
        "let i = 0;",
        "i < 10;",
        "i++",
        ") { … }"
      ],
      explain: "Начальное значение, условие продолжения, шаг."
    },
    {
      type: "quiz",
      q: "Сколько раз выполнится тело цикла?",
      code: {
        lang: "js",
        src: "for (let i = 0; i < 10; i += 3) {\n  console.log(i);\n}"
      },
      options: [
        "4 раза: 0, 3, 6, 9",
        "3 раза",
        "10 раз",
        "Бесконечно"
      ],
      answer: 0,
      explain: "i = 0, 3, 6, 9 — четыре значения меньше 10. Следующее, 12, уже не подходит."
    },
    {
      type: "card",
      title: "Деструктуризация и spread",
      html: "<p>Два приёма ES6, которые встречаются в любом современном коде:</p>",
      code: {
        lang: "js",
        src: "// Деструктуризация — достать значения в переменные\nconst student = { name: \"Иван\", group: \"КСК114\" };\nconst { name, group } = student;\n\nconst [first, second] = [5, 4, 3];   // first = 5, second = 4\n\n// Spread ... — «раскрыть» массив или объект\nconst a = [1, 2];\nconst b = [...a, 3];                 // [1, 2, 3]\nconst copy = { ...student, course: 1 };"
      }
    },
    {
      type: "quiz",
      q: "Что окажется в переменной <code>b</code>?",
      code: {
        lang: "js",
        src: "const a = [1, 2];\nconst b = [0, ...a, 3];"
      },
      options: [
        "<code>[0, 1, 2, 3]</code>",
        "<code>[0, [1, 2], 3]</code>",
        "<code>[1, 2]</code>",
        "<code>[0, 3]</code>"
      ],
      answer: 0,
      explain: "Три точки вставляют элементы массива по одному, а не весь массив целиком."
    }
  ]
};
