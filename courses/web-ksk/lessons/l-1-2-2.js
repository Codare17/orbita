/* Собрано из исходников платформы (node build.mjs site). Эталонные решения хранятся в Google Таблице. */
window.ORBITA.lessons['l-1-2-2'] = {
  type: "theory",
  steps: [
    {
      type: "card",
      title: "Зачем нужен CSS",
      html: "<p>HTML говорит, <b>что</b> на странице: заголовок, меню, форма. CSS (Cascading Style Sheets, каскадные таблицы стилей) говорит, <b>как</b> это выглядит: цвета, шрифты, отступы, расположение.</p><p>CSS состоит из <b>правил</b>. Правило — это селектор (кого оформляем) и блок объявлений в фигурных скобках (как оформляем).</p>",
      code: {
        lang: "css",
        src: "h1 {\n  color: #2f6fed;      /* свойство: значение; */\n  font-size: 32px;\n}"
      }
    },
    {
      type: "build",
      q: "Соберите правило: все заголовки h1 красного цвета",
      tokens: [
        "h1",
        "{",
        "color:",
        "red;",
        "}"
      ],
      extra: [
        "=",
        "\"red\"",
        "<h1>"
      ],
      explain: "Селектор без угловых скобок, значение без кавычек, после значения — точка с запятой."
    },
    {
      type: "card",
      title: "Три способа подключить стили",
      html: "<ol><li><b>Атрибут style</b> прямо в теге: <code>&lt;p style=\"color: red\"&gt;</code>. Только для разовых случаев.</li><li><b>Тег &lt;style&gt;</b> в <code>&lt;head&gt;</code>: удобно для одной страницы и учебных задач.</li><li><b>Внешний файл</b>: <code>&lt;link rel=\"stylesheet\" href=\"style.css\"&gt;</code>. Один файл оформляет все страницы сайта, браузер его кэширует.</li></ol>"
    },
    {
      type: "quiz",
      q: "У сайта 20 страниц с одинаковым оформлением. Как подключить стили?",
      options: [
        "Внешним файлом через <code>&lt;link rel=\"stylesheet\"&gt;</code>",
        "Тегом <code>&lt;style&gt;</code> на каждой странице",
        "Атрибутом <code>style</code> у каждого тега",
        "Стили не нужны, хватит HTML"
      ],
      answer: 0,
      explain: "Меняете цвет в одном файле — он меняется на всех 20 страницах."
    },
    {
      type: "card",
      title: "Селекторы",
      html: "<ul><li><code>p</code> — по тегу: все абзацы;</li><li><code>.card</code> — по классу: все элементы с <code>class=\"card\"</code>. Классов может быть несколько: <code>class=\"card big\"</code>;</li><li><code>#logo</code> — по id: один элемент с <code>id=\"logo\"</code>;</li><li><code>nav a</code> — потомок: ссылки внутри nav;</li><li><code>h1, h2</code> — группа: одно правило для нескольких селекторов;</li><li><code>a:hover</code> — псевдокласс: ссылка под курсором.</li></ul>"
    },
    {
      type: "match",
      q: "Соедините селектор и то, что он выбирает",
      pairs: [
        [
          "p",
          "Все абзацы"
        ],
        [
          ".card",
          "Элементы с class=\"card\""
        ],
        [
          "#logo",
          "Элемент с id=\"logo\""
        ],
        [
          "nav a",
          "Ссылки внутри nav"
        ],
        [
          "a:hover",
          "Ссылка под курсором"
        ]
      ],
      explain: "Точка — класс, решётка — id, пробел — вложенность, двоеточие — состояние."
    },
    {
      type: "card",
      title: "Каскад и специфичность",
      html: "<p>На один элемент часто действует несколько правил. Побеждает:</p><ol><li>более <b>конкретный</b> селектор: <code>#id</code> сильнее <code>.класса</code>, класс сильнее тега;</li><li>при равной силе — правило, которое написано <b>ниже</b>.</li></ol><p>Атрибут <code>style</code> сильнее всех селекторов. <code>!important</code> перебивает всё, но им лучше не пользоваться: потом его трудно переопределить.</p><p>Некоторые свойства <b>наследуются</b>: цвет и шрифт у <code>body</code> получат все элементы внутри.</p>"
    },
    {
      type: "quiz",
      q: "Какого цвета будет текст абзаца <code>&lt;p id=\"intro\" class=\"note\"&gt;</code>?",
      code: {
        lang: "css",
        src: "#intro { color: red; }\n.note { color: green; }\np { color: blue; }"
      },
      options: [
        "Красного",
        "Зелёного",
        "Синего",
        "Чёрного"
      ],
      answer: 0,
      explain: "Селектор по id самый конкретный, и порядок правил тут не важен."
    },
    {
      type: "card",
      title: "Цвета и единицы",
      html: "<p><b>Цвет</b>: название <code>red</code>, HEX <code>#ff8800</code>, <code>rgb(255, 136, 0)</code>, с прозрачностью <code>rgba(0, 0, 0, .5)</code>.</p><p><b>Размеры</b>:</p><ul><li><code>px</code> — пиксели, фиксированный размер;</li><li><code>%</code> — доля от родителя;</li><li><code>em</code> — от размера шрифта элемента, <code>rem</code> — от размера шрифта <code>html</code> (обычно 16px);</li><li><code>vw</code> / <code>vh</code> — проценты ширины и высоты окна.</li></ul>"
    },
    {
      type: "quiz",
      q: "У <code>html</code> размер шрифта 16px. Сколько это — <code>2rem</code>?",
      options: [
        "32px",
        "16px",
        "2px",
        "Зависит от родителя"
      ],
      answer: 0,
      explain: "rem всегда считается от корневого элемента: 2 × 16 = 32px."
    },
    {
      type: "card",
      title: "Текст и шрифты",
      code: {
        lang: "css",
        src: "body {\n  font-family: Arial, sans-serif; /* запасной шрифт через запятую */\n  font-size: 16px;\n  line-height: 1.5;               /* межстрочный интервал */\n  color: #222;\n}\nh1 { font-weight: bold; text-align: center; }\na  { text-decoration: none; }     /* убрать подчёркивание */"
      },
      html: "<p>Главные свойства текста: <code>font-family</code>, <code>font-size</code>, <code>font-weight</code>, <code>line-height</code>, <code>color</code>, <code>text-align</code>, <code>text-decoration</code>.</p>"
    },
    {
      type: "quiz",
      q: "Как убрать подчёркивание у ссылок?",
      options: [
        "<code>text-decoration: none;</code>",
        "<code>underline: false;</code>",
        "<code>font-style: none;</code>",
        "<code>border-bottom: 0;</code>"
      ],
      answer: 0,
      explain: "Подчёркивание — это text-decoration. Значение none его убирает."
    },
    {
      type: "card",
      title: "Блочная модель",
      html: "<p>Каждый элемент — прямоугольник из четырёх слоёв:</p><div class=\"boxm\" aria-label=\"Схема блочной модели\"><div class=\"bm-margin\">margin — внешний отступ<div class=\"bm-border\">border — рамка<div class=\"bm-padding\">padding — внутренний отступ<div class=\"bm-content\">content — содержимое</div></div></div></div></div><p>По умолчанию <code>width</code> задаёт ширину только содержимого, а padding и border прибавляются сверху. С <code>box-sizing: border-box</code> ширина включает и их: так проще считать.</p>"
    },
    {
      type: "order",
      q: "Расставьте слои блочной модели от центра наружу",
      items: [
        "content",
        "padding",
        "border",
        "margin"
      ],
      explain: "Содержимое, внутренний отступ, рамка, внешний отступ."
    },
    {
      type: "quiz",
      q: "Какой будет полная ширина блока?",
      code: {
        lang: "css",
        src: ".box {\n  width: 200px;\n  padding: 20px;\n  border: 5px solid black;\n  /* box-sizing не задан */\n}"
      },
      options: [
        "250px",
        "200px",
        "225px",
        "240px"
      ],
      answer: 0,
      explain: "200 + 20 × 2 + 5 × 2 = 250px. С box-sizing: border-box было бы ровно 200px."
    },
    {
      type: "card",
      title: "display и первое знакомство с flex",
      html: "<ul><li><code>display: block</code> — как div, с новой строки на всю ширину;</li><li><code>display: inline</code> — как span, ширину и высоту задать нельзя;</li><li><code>display: inline-block</code> — в строку, но с размерами и отступами;</li><li><code>display: none</code> — элемент скрыт и не занимает места;</li><li><code>display: flex</code> — дети выстраиваются в ряд.</li></ul>",
      code: {
        lang: "css",
        src: ".header {\n  display: flex;\n  justify-content: space-between; /* по горизонтали: по краям */\n  align-items: center;            /* по вертикали: по центру */\n  gap: 16px;                      /* промежуток между детьми */\n}"
      }
    },
    {
      type: "quiz",
      q: "Логотип слева, меню справа, оба по центру по вертикали. Что задать родителю с <code>display: flex</code>?",
      options: [
        "<code>justify-content: space-between; align-items: center;</code>",
        "<code>text-align: center;</code>",
        "<code>float: right;</code>",
        "<code>align-items: space-between;</code>"
      ],
      answer: 0,
      explain: "justify-content распределяет по главной оси (горизонталь), align-items выравнивает по поперечной."
    },
    {
      type: "card",
      title: "Состояния и плавность",
      html: "<p>Псевдоклассы описывают состояние: <code>:hover</code> — под курсором, <code>:focus</code> — в фокусе с клавиатуры, <code>:first-child</code> — первый ребёнок.</p><p><code>transition</code> делает смену стилей плавной.</p>",
      code: {
        lang: "css",
        src: ".btn { background: #2f6fed; transition: background 0.3s; }\n.btn:hover { background: #1d4fbf; }"
      }
    },
    {
      type: "build",
      q: "Соберите правило: при наведении ссылка становится оранжевой",
      tokens: [
        "a:hover",
        "{",
        "color:",
        "orange;",
        "}"
      ],
      extra: [
        "a.hover",
        "hover:a"
      ],
      explain: "Псевдокласс пишется через двоеточие сразу после селектора."
    },
    {
      type: "card",
      title: "Отладка в DevTools",
      html: "<p>Нажмите F12 в Chrome, вкладка <b>Elements</b>. Выберите элемент — справа во вкладке <b>Styles</b> видны все правила, которые к нему применились. Перечёркнутые свойства проиграли в каскаде.</p><p>Значения можно менять прямо там и сразу видеть результат. Удачные правки потом переносите в свой файл: после перезагрузки страницы изменения в DevTools пропадают.</p>"
    },
    {
      type: "quiz",
      q: "В DevTools свойство <code>color</code> у абзаца перечёркнуто. Что это значит?",
      options: [
        "Его перебило другое, более сильное правило",
        "В свойстве опечатка, браузер его не понял",
        "Цвет текста нельзя менять",
        "Файл стилей не подключён"
      ],
      answer: 0,
      explain: "Перечёркнутое свойство проиграло в каскаде. Если браузер не понял свойство, рядом будет значок предупреждения."
    }
  ]
};
