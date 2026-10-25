/* Собрано из исходников платформы (node build.mjs site). Эталонные решения хранятся в Google Таблице. */
window.ORBITA.lessons['l-1-3-4'] = {
  type: "theory",
  steps: [
    {
      type: "card",
      title: "Зачем асинхронность",
      html: "<p>JavaScript в браузере выполняет код в одном потоке: пока идёт одна задача, страница не реагирует на клики.</p><p>Долгие операции — загрузка данных с сервера, таймеры — делают <b>асинхронно</b>: запустили и пошли дальше, а когда результат готов, браузер вызовет нужную функцию. Поэтому интерфейс не зависает, пока грузятся данные.</p>"
    },
    {
      type: "card",
      title: "setTimeout и setInterval",
      code: {
        lang: "js",
        src: "console.log(\"1\");\nsetTimeout(() => console.log(\"2\"), 1000);  // через 1 секунду\nconsole.log(\"3\");\n// Выведет: 1, 3, 2\n\nconst id = setInterval(() => console.log(\"тик\"), 500);  // каждые 0,5 с\nclearInterval(id);                                      // остановить"
      },
      html: "<p>Таймеры подробно — в ПЗ №11.</p>"
    },
    {
      type: "quiz",
      q: "В каком порядке появятся сообщения?",
      code: {
        lang: "js",
        src: "setTimeout(() => console.log(\"A\"), 0);\nconsole.log(\"B\");\nconsole.log(\"C\");"
      },
      options: [
        "B, C, A",
        "A, B, C",
        "B, A, C",
        "Только B и C"
      ],
      answer: 0,
      explain: "Даже с задержкой 0 функция из setTimeout выполнится только после того, как закончится текущий код."
    },
    {
      type: "card",
      title: "Промисы",
      html: "<p><b>Promise</b> — «обещание» результата в будущем. У него три состояния: <b>ожидание</b> (pending), <b>выполнено</b> (fulfilled) и <b>ошибка</b> (rejected).</p><p>Что делать с результатом, говорят методами <code>.then</code> (успех) и <code>.catch</code> (ошибка).</p>",
      code: {
        lang: "js",
        src: "fetch(\"https://api.example.ru/news\")\n  .then(response => response.json())\n  .then(news => console.log(news))\n  .catch(error => console.log(\"Не загрузилось:\", error));"
      }
    },
    {
      type: "match",
      q: "Соедините состояние промиса и его смысл",
      pairs: [
        [
          "pending",
          "Ждём результат"
        ],
        [
          "fulfilled",
          "Результат получен"
        ],
        [
          "rejected",
          "Произошла ошибка"
        ]
      ],
      explain: "Промис меняет состояние один раз: из pending — в fulfilled или rejected."
    },
    {
      type: "card",
      title: "async и await",
      html: "<p>Тот же код можно написать как обычный последовательный. <code>await</code> ждёт результат промиса и работает только внутри функции с <code>async</code>. Ошибки ловят через <code>try…catch</code>.</p>",
      code: {
        lang: "js",
        src: "async function loadNews() {\n  try {\n    const response = await fetch(\"https://api.example.ru/news\");\n    if (!response.ok) throw new Error(\"Сервер ответил \" + response.status);\n    const news = await response.json();\n    console.log(news);\n  } catch (error) {\n    console.log(\"Не загрузилось:\", error.message);\n  }\n}\nloadNews();"
      }
    },
    {
      type: "build",
      q: "Соберите строку, которая дождётся ответа сервера",
      tokens: [
        "const response",
        "=",
        "await",
        "fetch(url);"
      ],
      extra: [
        "async",
        ".then("
      ],
      explain: "await ставится перед промисом, результат которого нужно дождаться."
    },
    {
      type: "quiz",
      q: "Где можно использовать <code>await</code>?",
      options: [
        "Внутри функции, объявленной с <code>async</code>",
        "В любом месте кода",
        "Только внутри <code>setTimeout</code>",
        "Только в <code>.then</code>"
      ],
      answer: 0,
      explain: "await работает внутри async-функций (и ещё на верхнем уровне модулей <script type=\"module\">)."
    },
    {
      type: "card",
      title: "Fetch и JSON",
      html: "<p><code>fetch(адрес)</code> отправляет запрос и возвращает промис с ответом. Сервер обычно присылает данные в формате <b>JSON</b> — это текст, похожий на объекты JS. <code>response.json()</code> превращает его в объект.</p><p>Всегда обрабатывайте ошибки: сеть может пропасть, сервер — ответить 404 или 500. Пользователь должен увидеть понятное сообщение, а не пустую страницу. С настоящими API поработаем в ПЗ №13.</p>",
      code: {
        lang: "js",
        src: "// JSON с сервера:\n// [{ \"id\": 1, \"title\": \"Хакатон в пятницу\" }]\n\nJSON.parse('{\"a\": 1}');   // текст → объект\nJSON.stringify({ a: 1 });  // объект → текст"
      }
    },
    {
      type: "order",
      q: "Расставьте шаги загрузки данных",
      items: [
        "Отправить запрос: fetch(url)",
        "Дождаться ответа: await",
        "Проверить response.ok",
        "Разобрать JSON: response.json()",
        "Показать данные на странице"
      ],
      explain: "Проверка response.ok до разбора JSON — чтобы не пытаться разбирать страницу ошибки."
    },
    {
      type: "quiz",
      q: "Сервер ответил «404 Not Found». Попадёт ли код в <code>catch</code> сам по себе?",
      options: [
        "Нет: fetch считает это успешным ответом, нужно проверить response.ok",
        "Да, любой код ошибки вызывает catch",
        "Нет, и проверить это невозможно",
        "Да, но только в Chrome"
      ],
      answer: 0,
      explain: "fetch отклоняет промис только при сетевой ошибке. Ответ 404 или 500 — это тоже ответ, его проверяют через response.ok."
    }
  ]
};
