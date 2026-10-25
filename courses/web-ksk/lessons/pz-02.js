/* Собрано из исходников платформы (node build.mjs site). Эталонные решения хранятся в Google Таблице. */
window.ORBITA.lessons['pz-02'] = {
  type: "practice",
  intro: "<p>Шапка — первое, что видит посетитель: логотип и меню. Сегодня сверстаем шапку сайта IT-клуба и сделаем меню, которое на телефоне прячется под кнопку-«бургер».</p><p>Чтобы посмотреть мобильный вид, сузьте окно браузера или откройте DevTools (F12) и включите режим устройства (Ctrl + Shift + M).</p>",
  tasks: [
    {
      id: "t1",
      title: "Разметка шапки",
      points: 10,
      lang: "html",
      text: "<p>Внутри <code>&lt;body&gt;</code> создайте шапку:</p><ul><li><code>&lt;header class=\"header\"&gt;</code>;</li><li>в нём логотип — ссылка <code>&lt;a class=\"logo\"&gt;</code> с названием клуба;</li><li>меню <code>&lt;nav class=\"nav\"&gt;</code>, внутри список <code>&lt;ul class=\"menu\"&gt;</code> минимум из 4 пунктов со ссылками.</li></ul><p>Ниже шапки добавьте <code>&lt;main&gt;</code> с любым абзацем.</p>",
      starter: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <title>IT-клуб колледжа</title>\n  <style>\n    body { margin: 0; font-family: Arial, sans-serif; }\n  </style>\n</head>\n<body>\n  <!-- Шапка сайта -->\n\n</body>\n</html>",
      hint: "Меню — это список ссылок: <code>&lt;ul&gt;&lt;li&gt;&lt;a href=\"#about\"&gt;О клубе&lt;/a&gt;&lt;/li&gt;…&lt;/ul&gt;</code>.",
      tests: [
        {
          name: "Есть <header class=\"header\">",
          check: (d) => !!d.querySelector('header.header') || 'Не нашли <header class="header">.'
        },
        {
          name: "В шапке есть логотип a.logo",
          check: (d, w, H) => !!H.text(d.querySelector('header a.logo')) || 'Добавьте в header ссылку с class="logo" и текстом.'
        },
        {
          name: "В шапке есть nav со списком ul",
          check: (d) => !!d.querySelector('header nav ul') || 'Нужен <nav> со списком <ul> внутри header.'
        },
        {
          name: "В меню минимум 4 ссылки",
          check: (d) => d.querySelectorAll('header nav li a').length >= 4 || 'Сейчас ссылок: ' + d.querySelectorAll('header nav li a').length + '. Нужно 4.'
        },
        {
          name: "После шапки есть <main>",
          check: (d) => !!d.querySelector('header ~ main') || 'Добавьте <main> после </header>.'
        }
      ]
    },
    {
      id: "t2",
      title: "Шапка во flex",
      points: 15,
      lang: "html",
      text: "<p>В <code>&lt;style&gt;</code> оформите шапку:</p><ul><li><code>.header</code>: <code>display: flex</code>, логотип слева и меню справа — <code>justify-content: space-between</code>, по центру по вертикали — <code>align-items: center</code>;</li><li>внутренние отступы и тёмный фон;</li><li>логотип белым, крупным, без подчёркивания.</li></ul>",
      starter: "@prev",
      hint: "Свойства flex задаются родителю — самой шапке, а не логотипу и меню.",
      tests: [
        {
          name: "У шапки display: flex",
          check: (d, w, H) => H.css(d.querySelector('.header'), 'display') === 'flex' || 'Задайте .header { display: flex; }'
        },
        {
          name: "Логотип и меню по краям",
          check: (d, w, H) => H.css(d.querySelector('.header'), 'justify-content') === 'space-between' || 'Нужно justify-content: space-between.'
        },
        {
          name: "Выравнивание по центру по вертикали",
          check: (d, w, H) => H.css(d.querySelector('.header'), 'align-items') === 'center' || 'Нужно align-items: center.'
        },
        {
          name: "У шапки есть фон и отступы",
          check: (d, w, H) => { const h = d.querySelector('.header'); return (parseFloat(H.css(h, 'padding-left')) > 0 && H.css(h, 'background-color') !== 'rgba(0, 0, 0, 0)') || 'Задайте шапке padding и background.'; }
        },
        {
          name: "Логотип без подчёркивания",
          check: (d, w, H) => H.css(d.querySelector('.logo'), 'text-decoration-line') === 'none' || 'Задайте .logo { text-decoration: none; }'
        }
      ]
    },
    {
      id: "t3",
      title: "Горизонтальное меню",
      points: 15,
      lang: "html",
      text: "<ul><li>Выстройте пункты меню в строку: <code>.menu { display: flex; gap: 24px; }</code>;</li><li>уберите маркеры списка и лишние отступы: <code>list-style: none; margin: 0; padding: 0</code>;</li><li>ссылки меню — белые и без подчёркивания.</li></ul>",
      starter: "@prev",
      hint: "Для ссылок внутри меню подойдёт селектор-потомок <code>.menu a</code>.",
      tests: [
        {
          name: "Пункты меню стоят в одну строку",
          check: (d) => { const li = [...d.querySelectorAll('.menu li')]; return (li.length > 1 && li.every(x => Math.abs(x.getBoundingClientRect().top - li[0].getBoundingClientRect().top) < 2)) || 'Пункты стоят столбиком. Задайте .menu { display: flex; }'; }
        },
        {
          name: "Между пунктами есть промежуток",
          check: (d) => { const li = d.querySelectorAll('.menu li'); return (li.length > 1 && li[1].getBoundingClientRect().left - li[0].getBoundingClientRect().right >= 8) || 'Добавьте gap или отступы между пунктами.'; }
        },
        {
          name: "Нет маркеров списка",
          check: (d, w, H) => H.css(d.querySelector('.menu'), 'list-style-type') === 'none' || 'Задайте list-style: none.'
        },
        {
          name: "Ссылки меню без подчёркивания",
          check: (d, w, H) => [...d.querySelectorAll('.menu a')].every(a => H.css(a, 'text-decoration-line') === 'none') || 'Уберите подчёркивание: text-decoration: none.'
        }
      ]
    },
    {
      id: "t4",
      title: "Реакция на наведение",
      points: 10,
      lang: "html",
      text: "<p>Добавьте правило <code>.menu a:hover</code>, которое меняет цвет ссылки под курсором. Наведите мышь на меню в окне результата и проверьте.</p>",
      starter: "@prev",
      hint: "<code>.menu a:hover { color: #ffb547; }</code> — двоеточие без пробела.",
      tests: [
        {
          name: "Есть правило :hover для ссылок меню",
          check: (d, w, H) => H.rules().some(r => /a:hover/.test(r.sel) && (r.style.color || r.style.backgroundColor || r.style.background || r.style.borderBottom || r.style.textDecoration)) || 'Не нашли правило вида .menu a:hover { color: …; }'
        }
      ]
    },
    {
      id: "t5",
      title: "Липкая шапка",
      points: 10,
      lang: "html",
      text: "<p>Сделайте так, чтобы шапка оставалась вверху экрана при прокрутке: <code>position: sticky; top: 0;</code>. Чтобы контент не наезжал на шапку, добавьте <code>z-index</code>.</p><p>Чтобы было что прокручивать, задайте <code>main { min-height: 1200px; }</code>.</p>",
      starter: "@prev",
      hint: "sticky работает, только если указано, где «прилипнуть»: <code>top: 0</code>.",
      tests: [
        {
          name: "Шапка position: sticky",
          check: (d, w, H) => H.css(d.querySelector('.header'), 'position') === 'sticky' || 'Задайте .header { position: sticky; }'
        },
        {
          name: "Шапка прилипает к верху (top: 0)",
          check: (d, w, H) => H.css(d.querySelector('.header'), 'top') === '0px' || 'Добавьте top: 0.'
        },
        {
          name: "У шапки задан z-index",
          check: (d, w, H) => H.css(d.querySelector('.header'), 'z-index') !== 'auto' || 'Добавьте z-index: 10.'
        }
      ]
    },
    {
      id: "t6",
      title: "Меню на телефоне",
      points: 20,
      lang: "html",
      text: "<p>Добавьте медиазапрос для узких экранов:</p><p><code>@media (max-width: 600px) { … }</code></p><p>Внутри него поставьте пункты меню столбиком: <code>.menu { flex-direction: column; }</code>. Разрешите шапке переносить меню на новую строку: <code>.header { flex-wrap: wrap; }</code>.</p>",
      starter: "@prev",
      hint: "Медиазапрос пишут в конце стилей: его правила должны перебивать обычные.",
      tests: [
        {
          name: "Есть медиазапрос max-width до 768px",
          check: (d, w, H) => H.mobile(768).length > 0 || 'Не нашли @media (max-width: …px) с шириной от 320 до 768px.'
        },
        {
          name: "На телефоне меню столбиком",
          check: (d, w, H) => H.mobile(768).some(r => /menu|nav|ul/.test(r.sel) && r.style.flexDirection === 'column') || 'Внутри @media задайте .menu { flex-direction: column; }'
        },
        {
          name: "На ПК меню по-прежнему в строку",
          check: (d, w, H) => H.css(d.querySelector('.menu'), 'flex-direction') === 'row' || 'flex-direction: column должен действовать только внутри @media.'
        }
      ]
    },
    {
      id: "t7",
      title: "Кнопка-бургер",
      points: 20,
      lang: "html",
      text: "<ol><li>Добавьте в шапку кнопку <code>&lt;button class=\"burger\" aria-label=\"Открыть меню\"&gt;☰&lt;/button&gt;</code>.</li><li>На ПК кнопка скрыта: <code>.burger { display: none; }</code>.</li><li>В медиазапросе кнопка видна, а меню <code>.nav</code> скрыто. Меню с классом <code>open</code> видно: <code>.nav.open { display: block; }</code>.</li><li>Перед <code>&lt;/body&gt;</code> добавьте скрипт: по клику на кнопку переключать у меню класс <code>open</code>.</li></ol>",
      starter: "@prev",
      hint: "Скрипт из трёх строк: найти кнопку, найти меню, <code>burger.addEventListener('click', () =&gt; nav.classList.toggle('open'));</code>",
      tests: [
        {
          name: "Есть кнопка .burger",
          check: (d) => !!d.querySelector('button.burger') || 'Добавьте <button class="burger">.'
        },
        {
          name: "На ПК бургер скрыт",
          check: (d, w, H) => H.css(d.querySelector('.burger'), 'display') === 'none' || 'Задайте .burger { display: none; } вне медиазапроса.'
        },
        {
          name: "На телефоне бургер виден",
          check: (d, w, H) => H.mobile(768).some(r => /burger/.test(r.sel) && r.style.display && r.style.display !== 'none') || 'Внутри @media покажите .burger: display: block.'
        },
        {
          name: "На телефоне меню скрыто, пока не открыто",
          check: (d, w, H) => H.mobile(768).some(r => /nav|menu/.test(r.sel) && !/open/.test(r.sel) && r.style.display === 'none') || 'Внутри @media скройте .nav: display: none.'
        },
        {
          name: "Клик по бургеру открывает и закрывает меню",
          check: (d) => {
              const b = d.querySelector('.burger'), n = d.querySelector('.nav');
              if (!b || !n) return 'Нужны .burger и .nav.';
              b.click();
              const opened = n.classList.contains('open');
              b.click();
              return (opened && !n.classList.contains('open')) || 'По клику у .nav должен переключаться класс open (classList.toggle).';
            }
        }
      ]
    }
  ]
};
