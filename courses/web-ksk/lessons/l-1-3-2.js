/* Собрано из исходников платформы (node build.mjs site). Эталонные решения хранятся в Google Таблице. */
window.ORBITA.lessons['l-1-3-2'] = {
  type: "theory",
  steps: [
    {
      type: "card",
      title: "Функции",
      html: "<p>Функция — именованный кусок кода, который можно вызывать много раз с разными данными. Данные приходят в <b>параметрах</b>, результат возвращается через <code>return</code>.</p>",
      code: {
        lang: "js",
        src: "function sum(a, b) {\n  return a + b;\n}\n\nconsole.log(sum(2, 3));   // 5\nconsole.log(sum(10, 7));  // 17"
      }
    },
    {
      type: "quiz",
      q: "Что выведет код?",
      code: {
        lang: "js",
        src: "function double(x) {\n  x * 2;\n}\nconsole.log(double(5));"
      },
      options: [
        "<code>undefined</code>",
        "<code>10</code>",
        "<code>5</code>",
        "Ошибку"
      ],
      answer: 0,
      explain: "Без return функция ничего не возвращает — результат undefined. Нужно return x * 2;"
    },
    {
      type: "card",
      title: "Три способа объявить функцию",
      code: {
        lang: "js",
        src: "// Объявление\nfunction square(x) { return x * x; }\n\n// Функциональное выражение\nconst cube = function (x) { return x * x * x; };\n\n// Стрелочная функция (ES6)\nconst half = (x) => x / 2;          // return не нужен, если одно выражение\nconst greet = name => `Привет, ${name}!`;"
      },
      html: "<p>Стрелочные функции короче, их используют почти везде, особенно в методах массивов.</p>"
    },
    {
      type: "build",
      q: "Соберите стрелочную функцию, которая возвращает квадрат числа",
      tokens: [
        "const square",
        "=",
        "(x)",
        "=>",
        "x * x;"
      ],
      extra: [
        "function",
        "return =>"
      ],
      explain: "const имя = (параметры) => выражение;"
    },
    {
      type: "card",
      title: "Параметры по умолчанию и область видимости",
      code: {
        lang: "js",
        src: "function price(cost, discount = 0) {\n  const result = cost * (1 - discount / 100);\n  return result;\n}\nprice(1000);       // 1000 — discount взят по умолчанию\nprice(1000, 15);   // 850\n\nconsole.log(result); // ошибка: result живёт только внутри функции"
      },
      html: "<p>Переменные, объявленные внутри функции, снаружи не видны. Это защищает от случайных совпадений имён.</p>"
    },
    {
      type: "card",
      title: "Объекты",
      html: "<p>Объект хранит связанные данные под именами — <b>свойствами</b>. Функция внутри объекта называется <b>методом</b>.</p>",
      code: {
        lang: "js",
        src: "const student = {\n  name: \"Аня\",\n  group: \"КСК114\",\n  marks: [5, 4, 5],\n  hello() {\n    return `Я ${this.name} из ${this.group}`;\n  }\n};\n\nstudent.name;           // \"Аня\"\nstudent[\"group\"];       // \"КСК114\"\nstudent.course = 1;     // добавили свойство\nstudent.hello();        // \"Я Аня из КСК114\"\nObject.keys(student);   // [\"name\", \"group\", \"marks\", \"hello\", \"course\"]"
      }
    },
    {
      type: "quiz",
      q: "Как получить вторую оценку студента?",
      code: {
        lang: "js",
        src: "const student = { name: \"Аня\", marks: [5, 4, 5] };"
      },
      options: [
        "<code>student.marks[1]</code>",
        "<code>student.marks[2]</code>",
        "<code>student[marks][1]</code>",
        "<code>marks.student[1]</code>"
      ],
      answer: 0,
      explain: "Нумерация в массиве с нуля: [0] — первая оценка, [1] — вторая."
    },
    {
      type: "card",
      title: "Массивы: основы",
      code: {
        lang: "js",
        src: "const marks = [5, 4, 3];\nmarks.length;        // 3\nmarks[0];            // 5\nmarks.push(5);       // добавить в конец → [5, 4, 3, 5]\nmarks.pop();         // убрать последний\nmarks.includes(4);   // true\nmarks.indexOf(3);    // 2"
      }
    },
    {
      type: "card",
      title: "map, filter, reduce",
      html: "<p>Три главных метода. Они не меняют исходный массив, а возвращают новый результат.</p>",
      code: {
        lang: "js",
        src: "const prices = [500, 1200, 300];\n\n// map — преобразовать каждый элемент\nprices.map(p => p * 2);              // [1000, 2400, 600]\n\n// filter — оставить подходящие\nprices.filter(p => p > 400);         // [500, 1200]\n\n// reduce — свести к одному значению\nprices.reduce((sum, p) => sum + p, 0); // 2000"
      }
    },
    {
      type: "match",
      q: "Соедините метод и что он возвращает",
      pairs: [
        [
          "map",
          "Новый массив той же длины"
        ],
        [
          "filter",
          "Новый массив из подходящих элементов"
        ],
        [
          "reduce",
          "Одно значение: сумму, максимум…"
        ],
        [
          "find",
          "Первый подходящий элемент"
        ],
        [
          "some",
          "true, если подходит хотя бы один"
        ]
      ],
      explain: "every — то же, что some, но true, только если подходят все."
    },
    {
      type: "quiz",
      q: "Что выведет код?",
      code: {
        lang: "js",
        src: "const nums = [1, 2, 3, 4, 5, 6];\nconsole.log(nums.filter(n => n % 2 === 0).map(n => n * 10));"
      },
      options: [
        "<code>[20, 40, 60]</code>",
        "<code>[10, 30, 50]</code>",
        "<code>[2, 4, 6]</code>",
        "<code>[10, 20, 30, 40, 50, 60]</code>"
      ],
      answer: 0,
      explain: "Сначала filter оставляет чётные [2, 4, 6], затем map умножает каждое на 10."
    },
    {
      type: "card",
      title: "find, some, every, sort",
      code: {
        lang: "js",
        src: "const users = [\n  { name: \"Аня\", age: 17 },\n  { name: \"Боря\", age: 19 }\n];\nusers.find(u => u.age > 18);     // { name: \"Боря\", age: 19 }\nusers.some(u => u.age < 18);     // true\nusers.every(u => u.age >= 16);   // true\n\n// sort меняет сам массив! Копируйте перед сортировкой:\nconst byAge = [...users].sort((a, b) => a.age - b.age);"
      },
      html: "<p>Для чисел в <code>sort</code> обязательно передавайте функцию сравнения: без неё числа сортируются как строки, и 10 окажется раньше 9.</p>"
    },
    {
      type: "quiz",
      q: "Что выведет <code>[10, 9, 1].sort()</code>?",
      options: [
        "<code>[1, 10, 9]</code>",
        "<code>[1, 9, 10]</code>",
        "<code>[10, 9, 1]</code>",
        "Ошибку"
      ],
      answer: 0,
      explain: "Без функции сравнения элементы сравниваются как строки: \"1\" < \"10\" < \"9\". Правильно: .sort((a, b) => a - b)."
    },
    {
      type: "build",
      q: "Соберите выражение: сумма цен всех товаров",
      tokens: [
        "products",
        ".reduce(",
        "(sum, p) => sum + p.price,",
        "0",
        ")"
      ],
      extra: [
        ".map(",
        ".filter("
      ],
      explain: "reduce получает функцию и начальное значение — 0."
    },
    {
      type: "card",
      title: "Цепочки",
      html: "<p>Методы можно вызывать друг за другом — каждый работает с результатом предыдущего. Так задачу «названия товаров в наличии, от дешёвых к дорогим» решают в одно выражение:</p>",
      code: {
        lang: "js",
        src: "const titles = products\n  .filter(p => p.inStock)\n  .sort((a, b) => a.price - b.price)\n  .map(p => p.title);"
      }
    },
    {
      type: "quiz",
      q: "Какой метод выбрать, чтобы проверить, что <b>все</b> студенты сдали ПЗ?",
      options: [
        "<code>every</code>",
        "<code>some</code>",
        "<code>find</code>",
        "<code>map</code>"
      ],
      answer: 0,
      explain: "every возвращает true, только если условие верно для каждого элемента."
    }
  ]
};
