/* Собрано из исходников платформы (node build.mjs site). Эталонные решения хранятся в Google Таблице. */
window.ORBITA.lessons['pz-03'] = {
  type: "practice",
  intro: "<p>Под шапкой начинается основной контент. Сверстаем главный экран (hero) с кнопкой и сетку карточек, а потом оживим их: плавное появление, подъём карточки при наведении.</p>",
  tasks: [
    {
      id: "t1",
      title: "Главный экран",
      points: 10,
      lang: "html",
      text: "<p>Внутри <code>&lt;main&gt;</code> создайте <code>&lt;section class=\"hero\"&gt;</code>:</p><ul><li>заголовок <code>&lt;h1&gt;</code>;</li><li>абзац с описанием;</li><li>ссылка-кнопка <code>&lt;a class=\"btn\"&gt;</code> «Записаться».</li></ul>",
      starter: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <title>IT-клуб колледжа</title>\n  <style>\n    body { margin: 0; font-family: Arial, sans-serif; color: #1e2a4a; }\n  </style>\n</head>\n<body>\n  <main>\n    <!-- Главный экран -->\n\n  </main>\n</body>\n</html>",
      hint: "section — обычный парный тег: внутри него h1, p и a друг за другом.",
      tests: [
        {
          name: "В main есть section.hero",
          check: (d) => !!d.querySelector('main section.hero') || 'Нужен <section class="hero"> внутри <main>.'
        },
        {
          name: "В hero есть h1 с текстом",
          check: (d, w, H) => !!H.text(d.querySelector('.hero h1')) || 'Добавьте <h1> в hero.'
        },
        {
          name: "В hero есть абзац",
          check: (d, w, H) => !!H.text(d.querySelector('.hero p')) || 'Добавьте <p> в hero.'
        },
        {
          name: "В hero есть ссылка a.btn",
          check: (d, w, H) => !!H.text(d.querySelector('.hero a.btn')) || 'Добавьте <a class="btn">Записаться</a>.'
        }
      ]
    },
    {
      id: "t2",
      title: "Карточки",
      points: 10,
      lang: "html",
      text: "<p>После hero добавьте <code>&lt;section class=\"cards\"&gt;</code> с тремя карточками <code>&lt;article class=\"card\"&gt;</code>. В каждой — заголовок <code>&lt;h3&gt;</code> и абзац.</p>",
      starter: "@prev",
      hint: "Сделайте одну карточку, скопируйте её дважды и поменяйте текст.",
      tests: [
        {
          name: "Есть section.cards",
          check: (d) => !!d.querySelector('main section.cards') || 'Нужен <section class="cards"> в main.'
        },
        {
          name: "Минимум 3 карточки article.card",
          check: (d) => d.querySelectorAll('.cards article.card').length >= 3 || 'Сейчас карточек: ' + d.querySelectorAll('.cards article.card').length + '.'
        },
        {
          name: "В каждой карточке h3 и абзац",
          check: (d) => { const c = [...d.querySelectorAll('.card')]; return (c.length > 0 && c.every(x => x.querySelector('h3') && x.querySelector('p'))) || 'В каждой .card нужны <h3> и <p>.'; }
        }
      ]
    },
    {
      id: "t3",
      title: "Сетка карточек",
      points: 15,
      lang: "html",
      text: "<ul><li>Оформите hero: отступы, центрирование текста, тёмный фон, белый текст.</li><li>Поставьте карточки в ряд по три с промежутками: <code>.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }</code>. Подойдёт и flex.</li><li>Карточкам — внутренний отступ, скругление и светлый фон.</li></ul>",
      starter: "@prev",
      hint: "<code>repeat(3, 1fr)</code> — три колонки равной ширины. <code>fr</code> — доля свободного места.",
      tests: [
        {
          name: "Hero оформлен: фон и центрированный текст",
          check: (d, w, H) => { const h = d.querySelector('.hero'); return (H.css(h, 'background-color') !== 'rgba(0, 0, 0, 0)' && H.css(h, 'text-align') === 'center') || 'Задайте .hero фон и text-align: center.'; }
        },
        {
          name: "Карточки стоят в один ряд",
          check: (d) => { const c = [...d.querySelectorAll('.card')].slice(0, 3); return (c.length === 3 && c.every(x => Math.abs(x.getBoundingClientRect().top - c[0].getBoundingClientRect().top) < 2)) || 'Первые три карточки должны стоять в одну строку.'; }
        },
        {
          name: "Между карточками есть промежуток",
          check: (d) => { const c = d.querySelectorAll('.card'); return (c.length > 1 && c[1].getBoundingClientRect().left - c[0].getBoundingClientRect().right >= 8) || 'Добавьте gap: 20px.'; }
        },
        {
          name: "У карточек отступы и скругление",
          check: (d, w, H) => { const c = d.querySelector('.card'); return (parseFloat(H.css(c, 'padding-top')) > 0 && parseFloat(H.css(c, 'border-top-left-radius')) > 0) || 'Задайте .card padding и border-radius.'; }
        }
      ]
    },
    {
      id: "t4",
      title: "Карточка при наведении",
      points: 15,
      lang: "html",
      text: "<p>Пусть карточка плавно приподнимается под курсором:</p><ul><li>у <code>.card</code> — <code>transition: transform 0.3s</code>;</li><li>правило <code>.card:hover</code> с <code>transform: translateY(-6px)</code> и тенью <code>box-shadow</code>.</li></ul>",
      starter: "@prev",
      hint: "transition пишут в обычном состоянии (.card), а не в :hover — тогда анимация работает в обе стороны.",
      tests: [
        {
          name: "У карточки задан transition",
          check: (d, w, H) => H.ms(H.css(d.querySelector('.card'), 'transition-duration')) > 0 || 'Задайте .card { transition: transform 0.3s; }'
        },
        {
          name: "Есть .card:hover с transform",
          check: (d, w, H) => H.rules().some(r => /card:hover/.test(r.sel) && r.style.transform) || 'Добавьте .card:hover { transform: translateY(-6px); }'
        },
        {
          name: "При наведении появляется тень",
          check: (d, w, H) => H.rules().some(r => /card:hover/.test(r.sel) && r.style.boxShadow) || 'Добавьте в .card:hover box-shadow.'
        }
      ]
    },
    {
      id: "t5",
      title: "Анимация появления",
      points: 20,
      lang: "html",
      text: "<p>Создайте анимацию через <code>@keyframes</code>: элемент выезжает снизу и проявляется.</p><ul><li><code>@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }</code></li><li>Подключите её к hero: <code>animation: fadeUp 0.8s ease-out;</code></li></ul><p>Нажмите кнопку перезапуска над окном результата, чтобы увидеть анимацию ещё раз.</p>",
      starter: "@prev",
      hint: "Имя в <code>animation</code> должно совпадать с именем после <code>@keyframes</code> буква в букву.",
      tests: [
        {
          name: "Есть правило @keyframes",
          check: (d, w, H) => H.keyframes().length > 0 || 'Не нашли @keyframes.'
        },
        {
          name: "Hero использует эту анимацию",
          check: (d, w, H) => { const n = H.css(d.querySelector('.hero'), 'animation-name'); return (n !== 'none' && H.keyframes().includes(n)) || 'Укажите у .hero animation с именем из @keyframes.'; }
        },
        {
          name: "У анимации есть длительность",
          check: (d, w, H) => H.ms(H.css(d.querySelector('.hero'), 'animation-duration')) > 0 || 'Укажите длительность, например 0.8s.'
        }
      ]
    },
    {
      id: "t6",
      title: "Карточки на телефоне",
      points: 15,
      lang: "html",
      text: "<p>На экранах до 768px три карточки в ряд не помещаются. Добавьте медиазапрос <code>@media (max-width: 768px)</code>, в котором карточки идут в одну колонку: <code>grid-template-columns: 1fr</code>.</p>",
      starter: "@prev",
      hint: "Если делали сетку на flex, внутри медиазапроса задайте <code>.cards { flex-direction: column; }</code>.",
      tests: [
        {
          name: "Есть медиазапрос max-width до 768px",
          check: (d, w, H) => H.mobile(768).length > 0 || 'Добавьте @media (max-width: 768px).'
        },
        {
          name: "На телефоне карточки в одну колонку",
          check: (d, w, H) => H.mobile(768).some(r => /cards?/.test(r.sel) && (/^(1fr|100%|auto)$/.test(r.style.gridTemplateColumns.trim()) || r.style.flexDirection === 'column' || r.style.display === 'block' || /100%/.test(r.style.flexBasis + r.style.width + r.style.flex))) || 'Внутри @media задайте .cards { grid-template-columns: 1fr; }'
        }
      ]
    },
    {
      id: "t7",
      title: "Кнопка-ссылка",
      points: 15,
      lang: "html",
      text: "<p>Превратите ссылку <code>.btn</code> в кнопку:</p><ul><li><code>display: inline-block</code>, внутренние отступы, скругление;</li><li>яркий фон, без подчёркивания;</li><li>правило <code>.btn:hover</code> с другим фоном и плавный <code>transition</code>.</li></ul>",
      starter: "@prev",
      hint: "У строчной ссылки вертикальные отступы «не толкают» соседей — поэтому <code>inline-block</code>.",
      tests: [
        {
          name: "Кнопка inline-block с отступами",
          check: (d, w, H) => { const b = d.querySelector('.btn'); return (/inline-block|inline-flex|block/.test(H.css(b, 'display')) && parseFloat(H.css(b, 'padding-top')) > 0 && parseFloat(H.css(b, 'padding-left')) > 0) || 'Задайте .btn display: inline-block и padding.'; }
        },
        {
          name: "У кнопки фон и скругление",
          check: (d, w, H) => { const b = d.querySelector('.btn'); return (H.css(b, 'background-color') !== 'rgba(0, 0, 0, 0)' && parseFloat(H.css(b, 'border-top-left-radius')) > 0) || 'Задайте .btn background и border-radius.'; }
        },
        {
          name: "Без подчёркивания",
          check: (d, w, H) => H.css(d.querySelector('.btn'), 'text-decoration-line') === 'none' || 'Задайте text-decoration: none.'
        },
        {
          name: "Есть .btn:hover и плавный переход",
          check: (d, w, H) => (H.rules().some(r => /btn:hover/.test(r.sel)) && H.ms(H.css(d.querySelector('.btn'), 'transition-duration')) > 0) || 'Добавьте .btn:hover и transition у .btn.'
        }
      ]
    }
  ]
};
