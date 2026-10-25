/* Собрано из исходников платформы (node build.mjs site). Эталонные решения хранятся в Google Таблице. */
window.ORBITA.lessons['l-1-2-1'] = {
  type: "theory",
  steps: [
    {
      type: "card",
      title: "Скелет HTML-документа",
      html: "<p>Любая страница начинается с одного и того же каркаса:</p><ul><li><code>&lt;!DOCTYPE html&gt;</code> — «это HTML5», браузер включает современный режим;</li><li><code>&lt;html lang=\"ru\"&gt;</code> — корень страницы и язык текста;</li><li><code>&lt;head&gt;</code> — служебная часть: кодировка, заголовок вкладки, подключение стилей;</li><li><code>&lt;body&gt;</code> — всё, что видно на экране.</li></ul>",
      code: {
        lang: "html",
        src: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <title>Мой сайт</title>\n</head>\n<body>\n  <h1>Привет!</h1>\n</body>\n</html>"
      }
    },
    {
      type: "order",
      q: "Расставьте строки каркаса страницы по порядку",
      items: [
        "<!DOCTYPE html>",
        "<html lang=\"ru\">",
        "<head> … </head>",
        "<body> … </body>",
        "</html>"
      ],
      explain: "Сначала объявление типа, затем html, внутри него head и body, в конце закрывающий </html>."
    },
    {
      type: "card",
      title: "Теги и атрибуты",
      html: "<p><b>Тег</b> — команда в угловых скобках. Большинство тегов <b>парные</b>: <code>&lt;p&gt;текст&lt;/p&gt;</code>. Некоторые <b>одиночные</b>, у них нет содержимого: <code>&lt;img&gt;</code>, <code>&lt;br&gt;</code>, <code>&lt;input&gt;</code>, <code>&lt;meta&gt;</code>.</p><p><b>Атрибут</b> уточняет тег и пишется в открывающем теге: <code>имя=\"значение\"</code>.</p><p>Теги вкладываются друг в друга как матрёшки: что открыли последним, то закрываем первым.</p>",
      code: {
        lang: "html",
        src: "<a href=\"https://mos.ru\" target=\"_blank\">Портал</a>\n<img src=\"cat.jpg\" alt=\"Рыжий кот\">"
      }
    },
    {
      type: "quiz",
      q: "Какой тег одиночный?",
      options: [
        "<code>&lt;img&gt;</code>",
        "<code>&lt;p&gt;</code>",
        "<code>&lt;a&gt;</code>",
        "<code>&lt;div&gt;</code>"
      ],
      answer: 0,
      explain: "У картинки нет содержимого между тегами, поэтому закрывающий тег не нужен."
    },
    {
      type: "quiz",
      q: "Где ошибка в этом коде?",
      code: {
        lang: "html",
        src: "<p>Сегодня <b>важное объявление</p></b>"
      },
      options: [
        "Теги закрыты в неправильном порядке",
        "Нельзя вкладывать <code>&lt;b&gt;</code> в абзац",
        "Абзац должен быть одиночным тегом",
        "Ошибки нет"
      ],
      answer: 0,
      explain: "Открыли p, потом b — значит, сначала закрываем b, потом p: <b>…</b></p>."
    },
    {
      type: "card",
      title: "Текст",
      html: "<ul><li><code>&lt;h1&gt;</code>…<code>&lt;h6&gt;</code> — заголовки по уровням. <code>h1</code> на странице один: это её главная тема.</li><li><code>&lt;p&gt;</code> — абзац.</li><li><code>&lt;strong&gt;</code> — важный текст, <code>&lt;em&gt;</code> — смысловое ударение.</li><li><code>&lt;br&gt;</code> — перенос строки внутри абзаца.</li><li><code>&lt;ul&gt;</code> — маркированный список, <code>&lt;ol&gt;</code> — нумерованный, пункты в <code>&lt;li&gt;</code>.</li></ul><p>Заголовки выбирают по смыслу, а не по размеру шрифта: размер потом меняется в CSS.</p>"
    },
    {
      type: "match",
      q: "Соедините тег и его назначение",
      pairs: [
        [
          "<h1>",
          "Главный заголовок страницы"
        ],
        [
          "<p>",
          "Абзац текста"
        ],
        [
          "<ol>",
          "Нумерованный список"
        ],
        [
          "<li>",
          "Пункт списка"
        ],
        [
          "<strong>",
          "Важный текст"
        ]
      ],
      explain: "Каждый тег описывает смысл содержимого, а не его внешний вид."
    },
    {
      type: "card",
      title: "Ссылки",
      html: "<p>Ссылка — тег <code>&lt;a&gt;</code> с атрибутом <code>href</code>:</p><ul><li><b>абсолютная</b> — полный адрес: <code>href=\"https://ya.ru\"</code>;</li><li><b>относительная</b> — файл рядом: <code>href=\"contacts.html\"</code>, <code>href=\"pages/about.html\"</code>;</li><li><b>якорь</b> — место на этой же странице: <code>href=\"#prices\"</code> ведёт к элементу с <code>id=\"prices\"</code>;</li><li><code>href=\"mailto:…\"</code> открывает почту, <code>href=\"tel:…\"</code> — звонок на телефоне.</li></ul><p>Чтобы открыть ссылку в новой вкладке, добавьте <code>target=\"_blank\"</code> и для безопасности <code>rel=\"noopener\"</code>.</p>"
    },
    {
      type: "build",
      q: "Соберите ссылку на страницу контактов, которая открывается в новой вкладке",
      tokens: [
        "<a",
        "href=\"contacts.html\"",
        "target=\"_blank\">",
        "Контакты",
        "</a>"
      ],
      extra: [
        "src=\"contacts.html\"",
        "<link"
      ],
      explain: "Адрес ссылки задаёт href. Атрибут src — у картинок и скриптов."
    },
    {
      type: "quiz",
      q: "Ссылка <code>&lt;a href=\"#prices\"&gt;</code> ведёт…",
      options: [
        "к элементу с <code>id=\"prices\"</code> на этой странице",
        "на файл prices.html",
        "на сайт prices.ru",
        "к элементу с <code>class=\"prices\"</code>"
      ],
      answer: 0,
      explain: "Решётка в начале — якорь. Браузер прокручивает страницу к элементу с таким id."
    },
    {
      type: "card",
      title: "Изображения",
      html: "<p><code>&lt;img src=\"путь\" alt=\"описание\"&gt;</code></p><ul><li><code>src</code> — где лежит файл;</li><li><code>alt</code> — текст вместо картинки: его читает экранный диктор, и он виден, если файл не загрузился;</li><li><code>width</code> и <code>height</code> — размеры: браузер заранее оставит место, и страница не будет «прыгать».</li></ul><p>Форматы: JPG — фото, PNG — картинки с прозрачностью, SVG — иконки и логотипы, WebP — современный лёгкий формат.</p>"
    },
    {
      type: "quiz",
      q: "Зачем картинке атрибут <code>alt</code>?",
      options: [
        "Чтобы описать картинку для незрячих и на случай, если она не загрузится",
        "Чтобы задать ширину картинки",
        "Чтобы картинка стала ссылкой",
        "Чтобы ускорить загрузку"
      ],
      answer: 0,
      explain: "alt делает сайт доступным. Для чисто декоративной картинки пишут пустой alt=\"\"."
    },
    {
      type: "card",
      title: "Блочные и строчные элементы",
      html: "<p><b>Блочные</b> элементы начинаются с новой строки и занимают всю ширину: <code>div</code>, <code>p</code>, <code>h1</code>, <code>ul</code>, <code>section</code>.</p><p><b>Строчные</b> живут внутри текста и занимают столько места, сколько содержимое: <code>span</code>, <code>a</code>, <code>strong</code>, <code>img</code>.</p><p><code>&lt;div&gt;</code> и <code>&lt;span&gt;</code> ничего не значат сами по себе — это «коробки» для оформления.</p>",
      code: {
        lang: "html",
        src: "<div class=\"card\">\n  <p>Цена: <span class=\"price\">500 ₽</span></p>\n</div>"
      }
    },
    {
      type: "quiz",
      q: "Какой элемент строчный?",
      options: [
        "<code>&lt;span&gt;</code>",
        "<code>&lt;div&gt;</code>",
        "<code>&lt;p&gt;</code>",
        "<code>&lt;section&gt;</code>"
      ],
      answer: 0,
      explain: "span не переносит содержимое на новую строку."
    },
    {
      type: "card",
      title: "Семантические теги HTML5",
      html: "<p>HTML5 добавил теги, которые говорят, <b>что это за часть страницы</b>. Поисковики и экранные дикторы понимают такую страницу лучше, чем гору <code>div</code>.</p><div class=\"wire\" aria-label=\"Схема страницы из семантических тегов\"><div class=\"wire-row wire-head\"><span>header</span><span>nav</span></div><div class=\"wire-row\"><span style=\"flex:3\">main → section, article</span><span>aside</span></div><div class=\"wire-row wire-foot\"><span>footer</span></div></div><ul><li><code>header</code> — шапка, <code>nav</code> — меню;</li><li><code>main</code> — основное содержимое, на странице один;</li><li><code>section</code> — раздел с заголовком, <code>article</code> — самостоятельная запись: новость, карточка товара;</li><li><code>aside</code> — боковая колонка, <code>footer</code> — подвал.</li></ul>"
    },
    {
      type: "match",
      q: "Соедините семантический тег и часть страницы",
      pairs: [
        [
          "<header>",
          "Шапка с логотипом"
        ],
        [
          "<nav>",
          "Меню навигации"
        ],
        [
          "<main>",
          "Основное содержимое"
        ],
        [
          "<article>",
          "Новость или карточка товара"
        ],
        [
          "<footer>",
          "Подвал с контактами"
        ]
      ],
      explain: "Эти теги понадобятся в ПЗ №2–4, где мы сверстаем шапку, контент и подвал."
    },
    {
      type: "card",
      title: "Формы — коротко",
      html: "<p>Форму вы уже собирали в ПЗ №1. Главное:</p><ul><li><code>&lt;form&gt;</code> объединяет поля;</li><li><code>&lt;input type=\"…\"&gt;</code>: text, email, tel, password, number, date, checkbox, radio, color, range, file;</li><li><code>&lt;select&gt;</code> со списком <code>&lt;option&gt;</code>, многострочное <code>&lt;textarea&gt;</code>;</li><li>у каждого поля — <code>&lt;label&gt;</code>, у кнопки отправки — <code>type=\"submit\"</code>.</li></ul>"
    },
    {
      type: "quiz",
      q: "Какие значения атрибута <code>type</code> у <code>&lt;input&gt;</code> существуют?",
      options: [
        "<code>email</code>",
        "<code>phone</code>",
        "<code>date</code>",
        "<code>textarea</code>",
        "<code>color</code>"
      ],
      answer: [
        0,
        2,
        4
      ],
      explain: "Для телефона используют type=\"tel\", а textarea — отдельный тег."
    }
  ]
};
