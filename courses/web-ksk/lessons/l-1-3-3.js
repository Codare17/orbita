/* Собрано из исходников платформы (node build.mjs site). Эталонные решения хранятся в Google Таблице. */
window.ORBITA.lessons['l-1-3-3'] = {
  type: "theory",
  steps: [
    {
      type: "card",
      title: "Что такое DOM",
      html: "<p>Браузер читает HTML и строит из него дерево объектов — <b>DOM</b> (Document Object Model). Каждый тег становится узлом, вложенные теги — его детьми.</p><p>JavaScript работает не с текстом HTML, а с этим деревом: находит элементы, меняет текст и стили, добавляет и удаляет узлы. Изменения сразу видны на странице.</p>",
      code: {
        lang: "html",
        src: "<body>\n  <h1>Заголовок</h1>\n  <ul>\n    <li>Один</li>\n    <li>Два</li>\n  </ul>\n</body>\n\n<!-- document → html → body → h1, ul → li, li -->"
      }
    },
    {
      type: "card",
      title: "Найти элемент",
      code: {
        lang: "js",
        src: "document.querySelector(\"h1\");          // первый h1\ndocument.querySelector(\".card\");       // первый с классом card\ndocument.querySelector(\"#logo\");       // по id\ndocument.querySelectorAll(\".card\");    // все карточки — коллекция\n\nconst cards = document.querySelectorAll(\".card\");\ncards.forEach(card => console.log(card.textContent));"
      },
      html: "<p>Селекторы те же, что в CSS. Если элемент не найден, <code>querySelector</code> вернёт <code>null</code>.</p>"
    },
    {
      type: "quiz",
      q: "Как найти <b>все</b> пункты меню с классом <code>menu-item</code>?",
      options: [
        "<code>document.querySelectorAll(\".menu-item\")</code>",
        "<code>document.querySelector(\".menu-item\")</code>",
        "<code>document.querySelectorAll(\"menu-item\")</code>",
        "<code>document.getAll(\".menu-item\")</code>"
      ],
      answer: 0,
      explain: "querySelectorAll возвращает все совпадения. Без точки селектор искал бы тег <menu-item>."
    },
    {
      type: "card",
      title: "Изменить текст и HTML",
      code: {
        lang: "js",
        src: "const title = document.querySelector(\"h1\");\ntitle.textContent = \"Новый заголовок\";        // только текст\n\nconst box = document.querySelector(\".box\");\nbox.innerHTML = \"<b>Жирный</b> текст\";         // разметка"
      },
      html: "<p><code>textContent</code> безопаснее: он вставляет текст как есть. <code>innerHTML</code> разбирает строку как HTML — не вставляйте через него то, что ввёл пользователь: так в страницу можно подсунуть чужой код.</p>"
    },
    {
      type: "quiz",
      q: "Пользователь ввёл имя, его нужно показать на странице. Что использовать?",
      options: [
        "<code>el.textContent = name</code>",
        "<code>el.innerHTML = name</code>",
        "<code>document.write(name)</code>",
        "<code>el.style = name</code>"
      ],
      answer: 0,
      explain: "textContent не выполняет разметку: даже если ввести <script>, он появится просто текстом."
    },
    {
      type: "card",
      title: "Классы и стили",
      code: {
        lang: "js",
        src: "const menu = document.querySelector(\".menu\");\nmenu.classList.add(\"open\");\nmenu.classList.remove(\"open\");\nmenu.classList.toggle(\"open\");      // добавить, если нет; убрать, если есть\nmenu.classList.contains(\"open\");    // true / false\n\nmenu.style.backgroundColor = \"orange\"; // свойства CSS — в camelCase"
      },
      html: "<p>Лучше переключать классы, а сами стили держать в CSS. Так вы уже сделали бургер-меню в ПЗ №2.</p>"
    },
    {
      type: "match",
      q: "Соедините задачу и подходящий код",
      pairs: [
        [
          "Показать или скрыть меню",
          "classList.toggle(\"open\")"
        ],
        [
          "Поменять текст кнопки",
          "textContent = \"…\""
        ],
        [
          "Найти все карточки",
          "querySelectorAll(\".card\")"
        ],
        [
          "Узнать адрес ссылки",
          "getAttribute(\"href\")"
        ]
      ],
      explain: "Атрибуты читаются getAttribute и меняются setAttribute."
    },
    {
      type: "card",
      title: "Создать и удалить элемент",
      code: {
        lang: "js",
        src: "const li = document.createElement(\"li\");\nli.textContent = \"Новая задача\";\nli.classList.add(\"task\");\ndocument.querySelector(\"ul\").append(li);   // в конец списка\n\nli.remove();                                // удалить"
      }
    },
    {
      type: "order",
      q: "Расставьте шаги: добавить новую карточку на страницу",
      items: [
        "const card = document.createElement(\"div\")",
        "card.classList.add(\"card\")",
        "card.textContent = \"Текст карточки\"",
        "container.append(card)"
      ],
      explain: "Создать элемент, настроить его, вставить в нужное место."
    },
    {
      type: "card",
      title: "События — коротко",
      html: "<p>Чтобы код сработал по клику, на элемент вешают <b>обработчик события</b>. Подробно разберём события в ПЗ №8 и №10.</p>",
      code: {
        lang: "js",
        src: "const btn = document.querySelector(\".btn\");\nbtn.addEventListener(\"click\", () => {\n  btn.textContent = \"Нажато!\";\n});"
      }
    },
    {
      type: "quiz",
      q: "Скрипт подключён в <code>&lt;head&gt;</code>, и <code>querySelector(\".btn\")</code> возвращает <code>null</code>. Почему?",
      options: [
        "Скрипт выполнился раньше, чем браузер дошёл до кнопки",
        "В селекторе нужна решётка вместо точки",
        "querySelector не находит кнопки",
        "Кнопка должна быть внутри <code>&lt;form&gt;</code>"
      ],
      answer: 0,
      explain: "Подключайте скрипт в конце body или с атрибутом defer: <script src=\"script.js\" defer>."
    }
  ]
};
