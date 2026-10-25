/* Собрано из исходников платформы (node build.mjs site). Эталонные решения хранятся в Google Таблице. */
window.ORBITA.lessons['pz-04'] = {
  type: "practice",
  intro: "<p>Подвал завершает страницу: контакты, разделы, копирайт. Сверстаем подвал из трёх колонок, разберёмся со ссылками разных видов и картинками. В последнем задании соберёте целую страницу: шапку, контент и подвал.</p>",
  tasks: [
    {
      id: "t1",
      title: "Колонки подвала",
      points: 10,
      lang: "html",
      text: "<p>Перед <code>&lt;/body&gt;</code> создайте <code>&lt;footer class=\"footer\"&gt;</code> с тремя колонками <code>&lt;div class=\"footer-col\"&gt;</code>:</p><ol><li>название клуба и адрес;</li><li>«Разделы» — список из двух ссылок-якорей;</li><li>«Контакты» — пока просто абзац.</li></ol><p>У каждой колонки заголовок <code>&lt;h4&gt;</code>.</p>",
      starter: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <title>IT-клуб колледжа</title>\n  <style>\n    body { margin: 0; font-family: Arial, sans-serif; }\n    main { min-height: 600px; padding: 24px 32px; }\n  </style>\n</head>\n<body id=\"top\">\n  <header><h1>IT-клуб колледжа</h1></header>\n  <main><p>Основной контент страницы.</p></main>\n  <!-- Подвал -->\n\n</body>\n</html>",
      hint: "Колонки — это три одинаковых <code>div</code> с разным содержимым, стоящие рядом внутри footer.",
      tests: [
        {
          name: "Есть <footer class=\"footer\">",
          check: (d) => !!d.querySelector('footer.footer') || 'Нужен <footer class="footer">.'
        },
        {
          name: "В подвале 3 колонки .footer-col",
          check: (d) => { const n = d.querySelectorAll('footer .footer-col').length; return n >= 3 || 'Сейчас колонок: ' + n + '.'; }
        },
        {
          name: "У каждой колонки заголовок h4",
          check: (d, w, H) => { const c = [...d.querySelectorAll('footer .footer-col')]; return (c.length > 0 && c.every(x => H.text(x.querySelector('h4, h3')))) || 'Добавьте <h4> в каждую колонку.'; }
        },
        {
          name: "В разделах есть ссылки-якоря",
          check: (d) => d.querySelectorAll('footer a[href^="#"]').length >= 2 || 'Нужны минимум две ссылки вида href="#about".'
        }
      ]
    },
    {
      id: "t2",
      title: "Ссылки для связи",
      points: 15,
      lang: "html",
      text: "<p>В колонку «Контакты» вместо абзаца добавьте список из трёх ссылок:</p><ul><li>почта: <code>href=\"mailto:club@example.ru\"</code>;</li><li>телефон: <code>href=\"tel:+79991234567\"</code> — номер без пробелов и скобок;</li><li>внешний сайт в новой вкладке: <code>target=\"_blank\" rel=\"noopener\"</code>.</li></ul>",
      starter: "@prev",
      hint: "Текст ссылки может быть любым, а в <code>href</code> телефон пишется слитно: <code>tel:+79991234567</code>.",
      tests: [
        {
          name: "Есть ссылка mailto:",
          check: (d) => !!d.querySelector('footer a[href^="mailto:"]') || 'Добавьте <a href="mailto:…">.'
        },
        {
          name: "Есть ссылка tel: без пробелов",
          check: (d) => { const a = d.querySelector('footer a[href^="tel:"]'); if (!a) return 'Добавьте <a href="tel:…">.'; return /^tel:\+?\d{6,15}$/.test(a.getAttribute('href')) || 'В href телефона только цифры и +, например tel:+79991234567.'; }
        },
        {
          name: "Внешняя ссылка открывается в новой вкладке",
          check: (d) => !!d.querySelector('footer a[href^="http"][target="_blank"]') || 'Добавьте ссылку на сайт с target="_blank".'
        },
        {
          name: "У ссылки в новую вкладку есть rel=\"noopener\"",
          check: (d) => { const a = [...d.querySelectorAll('a[target="_blank"]')]; return (a.length > 0 && a.every(x => /noopener|noreferrer/.test(x.rel))) || 'Добавьте rel="noopener" ко всем ссылкам с target="_blank".'; }
        }
      ]
    },
    {
      id: "t3",
      title: "Логотип-картинка",
      points: 15,
      lang: "html",
      text: "<p>В первую колонку перед заголовком добавьте логотип: <code>&lt;img src=\"logo.png\" alt=\"Логотип IT-клуба\" width=\"48\" height=\"48\"&gt;</code>.</p><p>Файла logo.png здесь нет, поэтому в окне результата появится текст из <code>alt</code>. Так и проверяют, что alt написан. В VS Code положите картинку рядом с index.html — и она появится.</p>",
      starter: "@prev",
      hint: "Атрибуты <code>width</code> и <code>height</code> пишутся числами без px.",
      tests: [
        {
          name: "В подвале есть картинка",
          check: (d) => !!d.querySelector('footer img[src]') || 'Добавьте <img src="…"> в подвал.'
        },
        {
          name: "У всех картинок есть alt с текстом",
          check: (d) => { const i = [...d.querySelectorAll('img')]; return (i.length > 0 && i.every(x => (x.getAttribute('alt') || '').trim().length > 2)) || 'Опишите картинку в alt.'; }
        },
        {
          name: "У картинки заданы размеры",
          check: (d) => { const i = d.querySelector('footer img'); return !!(i && i.getAttribute('width') && i.getAttribute('height')) || 'Добавьте width и height.'; }
        }
      ]
    },
    {
      id: "t4",
      title: "Колонки в ряд",
      points: 15,
      lang: "html",
      text: "<ul><li>Поставьте колонки рядом: <code>.footer { display: flex; justify-content: space-between; gap: 32px; }</code>. Добавьте <code>flex-wrap: wrap</code>, чтобы на узком экране колонки переносились;</li><li>тёмный фон, светлый текст и отступы;</li><li>ссылки в подвале — яркого цвета, списки без маркеров.</li></ul>",
      starter: "@prev",
      hint: "Цвет ссылок задаётся самим ссылкам (<code>.footer a</code>): цвет родителя они не наследуют.",
      tests: [
        {
          name: "Колонки стоят в один ряд",
          check: (d) => { const c = [...d.querySelectorAll('footer .footer-col')]; return (c.length >= 3 && c.every(x => Math.abs(x.getBoundingClientRect().top - c[0].getBoundingClientRect().top) < 2)) || 'Колонки стоят друг под другом. Задайте .footer { display: flex; }'; }
        },
        {
          name: "У подвала фон и отступы",
          check: (d, w, H) => { const f = d.querySelector('footer'); return (H.css(f, 'background-color') !== 'rgba(0, 0, 0, 0)' && parseFloat(H.css(f, 'padding-top')) > 0) || 'Задайте footer background и padding.'; }
        },
        {
          name: "Ссылки подвала перекрашены",
          check: (d, w, H) => H.css(d.querySelector('footer a'), 'color') !== 'rgb(0, 0, 238)' || 'Задайте .footer a { color: …; }'
        },
        {
          name: "Списки без маркеров",
          check: (d, w, H) => [...d.querySelectorAll('footer ul')].every(u => H.css(u, 'list-style-type') === 'none') || 'Задайте .footer ul { list-style: none; }'
        }
      ]
    },
    {
      id: "t5",
      title: "Копирайт с текущим годом",
      points: 15,
      lang: "html",
      text: "<p>В конец подвала добавьте строку <code>&lt;p class=\"copyright\"&gt;© &lt;span id=\"year\"&gt;&lt;/span&gt; IT-клуб колледжа&lt;/p&gt;</code>.</p><p>Год не пишите руками: перед <code>&lt;/body&gt;</code> добавьте скрипт, который подставит текущий год:</p><p><code>document.getElementById('year').textContent = new Date().getFullYear();</code></p><p>Чтобы строка заняла всю ширину под колонками, задайте <code>.copyright { flex-basis: 100%; }</code>.</p>",
      starter: "@prev",
      hint: "Знак © можно набрать как <code>&amp;copy;</code>.",
      tests: [
        {
          name: "Есть .copyright со знаком ©",
          check: (d, w, H) => /©/.test(H.text(d.querySelector('.copyright'))) || 'Добавьте <p class="copyright"> со знаком ©.'
        },
        {
          name: "Год подставляется скриптом",
          check: (d, w, H) => { const y = d.getElementById('year'); if (!y) return 'Нужен <span id="year">.'; return H.text(y) === String(new Date().getFullYear()) || 'В #year должен оказаться текущий год. Проверьте скрипт.'; }
        },
        {
          name: "Копирайт занимает всю ширину",
          check: (d) => { const p = d.querySelector('.copyright'), f = d.querySelector('footer'); if (!p || !f) return 'Нет .copyright в подвале.'; return p.getBoundingClientRect().width >= f.clientWidth * 0.8 || 'Задайте .copyright { flex-basis: 100%; }'; }
        }
      ]
    },
    {
      id: "t6",
      title: "Ссылка «Наверх»",
      points: 10,
      lang: "html",
      text: "<ul><li>Добавьте <code>&lt;body&gt;</code> атрибут <code>id=\"top\"</code>.</li><li>В подвал поставьте ссылку <code>&lt;a href=\"#top\" class=\"to-top\"&gt;Наверх ↑&lt;/a&gt;</code>.</li><li>Сделайте прокрутку плавной: <code>html { scroll-behavior: smooth; }</code>.</li></ul>",
      starter: "@prev",
      hint: "Якорь ведёт к элементу, у которого id совпадает с текстом после решётки.",
      tests: [
        {
          name: "Есть ссылка href=\"#top\"",
          check: (d) => !!d.querySelector('footer a[href="#top"]') || 'Добавьте в подвал <a href="#top">.'
        },
        {
          name: "Есть элемент с id=\"top\"",
          check: (d) => !!d.getElementById('top') || 'Добавьте id="top" к body или к шапке.'
        },
        {
          name: "Прокрутка плавная",
          check: (d, w, H) => H.css(d.documentElement, 'scroll-behavior') === 'smooth' || 'Задайте html { scroll-behavior: smooth; }'
        }
      ]
    },
    {
      id: "t7",
      title: "Итог: страница целиком",
      points: 20,
      lang: "html",
      final: true,
      variants: [
        {
          club: "IT-клуб",
          color: "#1e2a4a",
          rgb: "rgb(30, 42, 74)"
        },
        {
          club: "Шахматный клуб",
          color: "#2d6a4f",
          rgb: "rgb(45, 106, 79)"
        },
        {
          club: "Клуб киберспорта",
          color: "#5a189a",
          rgb: "rgb(90, 24, 154)"
        },
        {
          club: "Медиастудия",
          color: "#9d0208",
          rgb: "rgb(157, 2, 8)"
        },
        {
          club: "Клуб 3D-печати",
          color: "#00509d",
          rgb: "rgb(0, 80, 157)"
        },
        {
          club: "Театральная студия",
          color: "#7f4f24",
          rgb: "rgb(127, 79, 36)"
        }
      ],
      text: "<p>Соберите полную страницу сайта по ПЗ №2–4. Ваш клуб: <b>{{club}}</b>, фон шапки — ровно <code>{{color}}</code>. Удобно делать в VS Code и загрузить файл кнопкой «Загрузить файл».</p><ul><li>название клуба — в шапке и в подвале;</li><li><code>header</code> с меню <code>nav</code> минимум из 3 ссылок;</li><li><code>main</code> с заголовком <code>h1</code>;</li><li><code>footer</code> со ссылкой mailto;</li><li>медиазапрос для экранов до 768px;</li><li>хотя бы одна анимация или плавный переход;</li><li>у всех картинок есть alt, у ссылок в новую вкладку — rel=\"noopener\".</li></ul>",
      starter: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <title>IT-клуб колледжа</title>\n</head>\n<body>\n\n</body>\n</html>",
      hint: "Скопируйте готовые куски из ПЗ №2 (шапка), №3 (контент) и этого ПЗ (подвал). Стили объедините в один <code>&lt;style&gt;</code>.",
      tests: [
        {
          name: "Название клуба в шапке и подвале",
          check: (d, w, H) => { const c = H.v.club.toLowerCase(); return (H.text(d.querySelector('header')).toLowerCase().includes(c) && H.text(d.querySelector('footer')).toLowerCase().includes(c)) || 'Напишите «' + H.v.club + '» и в header, и в footer.'; }
        },
        {
          name: "Фон шапки вашего варианта",
          check: (d, w, H) => H.css(d.querySelector('header'), 'background-color') === H.v.rgb || 'Фон header должен быть ' + H.v.color + '.'
        },
        {
          name: "Шапка с меню из 3+ ссылок",
          check: (d) => d.querySelectorAll('header nav a').length >= 3 || 'Нужен header с nav и минимум 3 ссылками.'
        },
        {
          name: "В main есть h1",
          check: (d, w, H) => !!H.text(d.querySelector('main h1')) || 'Добавьте <h1> внутрь <main>.'
        },
        {
          name: "В подвале есть ссылка mailto",
          check: (d) => !!d.querySelector('footer a[href^="mailto:"]') || 'Добавьте в footer ссылку на почту.'
        },
        {
          name: "Есть медиазапрос до 768px",
          check: (d, w, H) => H.mobile(768).length > 0 || 'Добавьте @media (max-width: 768px).'
        },
        {
          name: "Есть анимация или плавный переход",
          check: (d, w, H) => [...d.querySelectorAll('body *')].some(el => H.ms(H.css(el, 'transition-duration')) > 0 || H.css(el, 'animation-name') !== 'none') || 'Добавьте transition или animation хотя бы одному элементу.'
        },
        {
          name: "Картинки с alt, внешние ссылки с noopener",
          check: (d) => { const badImg = [...d.querySelectorAll('img')].find(i => !(i.getAttribute('alt') || '').trim()); if (badImg) return 'У картинки ' + badImg.getAttribute('src') + ' нет alt.'; return [...d.querySelectorAll('a[target="_blank"]')].every(a => /noopener|noreferrer/.test(a.rel)) || 'Добавьте rel="noopener" ссылкам с target="_blank".'; }
        }
      ]
    }
  ]
};
