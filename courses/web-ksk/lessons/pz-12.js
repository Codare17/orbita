/* Собрано из исходников платформы (node build.mjs site). Эталонные решения хранятся в Google Таблице. */
window.ORBITA.lessons['pz-12'] = {
  type: "practice",
  intro: "<p>Canvas — элемент-«холст»: на нём JavaScript рисует программно — фигуры, линии, текст, целые игры. Рисование не меняет HTML-разметку: картинка живёт внутри холста.</p><p>Три шага в каждом задании: найти <code>&lt;canvas&gt;</code>, получить «кисть» — <code>getContext('2d')</code>, вызвать метод рисования. Проверка смотрит на настоящие пиксели холста.</p>",
  tasks: [
    {
      id: "t1",
      title: "Холст и первый прямоугольник",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Холст создаётся тегом <code>&lt;canvas id=\"cv\" width=\"300\" height=\"200\"&gt;</code>. Внимание: размер задают <b>атрибутами</b> width и height, а не CSS — иначе картинка растянется. Рисовать начинают с получения контекста — объекта с методами рисования:</p><pre class=\"code\"><code>const cv = document.querySelector('#cv');\nconst ctx = cv.getContext('2d');\n\n// закрашенный прямоугольник: x, y, ширина, высота\nctx.fillRect(20, 20, 120, 80);</code></pre><p>Координаты (0, 0) — левый верхний угол холста. Ось x растёт вправо, ось y — вниз.</p><p>Добавьте холст 300×200 и закрасьте на нём прямоугольник любого размера.</p>",
      starter: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Рисовалка</title>\n  <style>\n    body { font-family: Arial, sans-serif; background: #f3f5fb; padding: 24px; }\n    canvas { background: #fff; border: 1px solid #ccc; }\n    button { padding: 8px 16px; border: 0; border-radius: 8px; background: #2f6fed; color: #fff; cursor: pointer; }\n  </style>\n</head>\n<body>\n  <h1>Рисовалка</h1>\n  <!-- Добавьте <canvas id=\"cv\" width=\"300\" height=\"200\"> и закрасьте прямоугольник -->\n\n</body>\n</html>",
      hint: "Порядок: querySelector('#cv') → getContext('2d') → ctx.fillRect(x, y, ширина, высота). Код — внутри <script> в конце body.",
      tests: [
        {
          name: "Холст есть и на нём что-то нарисовано",
          check: (d, w, H) => {
              const cv = d.querySelector('#cv');
              if (!cv) return 'Нужен <canvas id="cv">.';
              if (cv.width < 50 || cv.height < 50) return 'Задайте холсту ширину и высоту (атрибуты width и height).';
              try {
                const ctx = cv.getContext('2d');
                const data = ctx.getImageData(0, 0, cv.width, cv.height).data;
                let painted = 0;
                for (let i = 0; i < data.length; i += 4) {
                  if (data[i + 3] > 0 && !(data[i] > 245 && data[i + 1] > 245 && data[i + 2] > 245)) painted++;
                }
                return painted > 100 || 'На холсте почти нет закрашенных пикселей. Нарисуйте прямоугольник fillRect(…).';
              } catch (e) { return 'Не удалось прочитать пиксели: ' + (e && e.message); }
            }
        }
      ]
    },
    {
      id: "t2",
      title: "Цвет заливки",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Цвет задаётся <b>до</b> рисования, через свойство <code>fillStyle</code>. Оно действует на все заливки после него, пока его не изменят:</p><pre class=\"code\"><code>ctx.fillStyle = 'red';\nctx.fillRect(20, 20, 120, 80);  // красный\n\nctx.fillStyle = '#2f6fed';\nctx.fillRect(160, 20, 60, 80);  // синий</code></pre><p>Цвет можно писать словом (<code>red</code>, <code>gold</code>), в HEX (<code>#2f6fed</code>) или rgb (<code>rgb(47, 111, 237)</code>).</p><p>Перекрасьте свой прямоугольник в красный.</p>",
      starter: "@prev",
      hint: "Перед fillRect добавьте строку ctx.fillStyle = 'red';. Порядок важен: сначала цвет, потом рисование.",
      tests: [
        {
          name: "Есть красная заливка",
          check: (d, w, H) => {
              const cv = d.querySelector('#cv');
              if (!cv) return 'Нужен <canvas id="cv">.';
              try {
                const ctx = cv.getContext('2d');
                const data = ctx.getImageData(0, 0, cv.width, cv.height).data;
                for (let i = 0; i < data.length; i += 4) {
                  if (data[i + 3] > 0 && data[i] > 200 && data[i + 1] < 80 && data[i + 2] < 80) return true;
                }
                return 'На холсте нет красных пикселей. Задайте ctx.fillStyle = \'red\' до fillRect.';
              } catch (e) { return 'Не удалось прочитать пиксели: ' + (e && e.message); }
            }
        }
      ]
    },
    {
      id: "t3",
      title: "Фон холста и рамка",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Два приёма, которые понадобятся постоянно:</p><ul><li><b>Фон на весь холст.</b> Залить холст целиком: <code>ctx.fillRect(0, 0, cv.width, cv.height)</code> — размеры самого холста читаются из его свойств <code>width</code> и <code>height</code>. Первой строкой рисования — иначе она скроет остальное.</li><li><b>Рамка.</b> <code>strokeRect(x, y, ширина, высота)</code> рисует не закрашенный, а контурный прямоугольник. Цвет контура — свойство <code>strokeStyle</code>, толщина — <code>lineWidth</code> (в пикселях).</li></ul><p>Сделайте фон холста цвета <code>#dff3ff</code> (светло-голубой) и добавьте рамку вокруг красного прямоугольника.</p>",
      starter: "@prev",
      hint: "Фон: ctx.fillStyle = '#dff3ff'; ctx.fillRect(0, 0, cv.width, cv.height); — первой командой. Рамка: ctx.strokeRect(те же координаты, что у красного прямоугольника).",
      tests: [
        {
          name: "Фон светло-голубой",
          check: (d, w, H) => {
              const cv = d.querySelector('#cv');
              if (!cv) return 'Нужен <canvas id="cv">.';
              try {
                const ctx = cv.getContext('2d');
                const data = ctx.getImageData(0, 0, cv.width, cv.height).data;
                let bg = 0;
                for (let i = 0; i < data.length; i += 4) {
                  if (data[i + 3] > 0 && Math.abs(data[i] - 223) <= 10 && Math.abs(data[i + 1] - 243) <= 10 && Math.abs(data[i + 2] - 255) <= 10) bg++;
                }
                return bg > 5000 || 'Не нашли фона #dff3ff. Залейте весь холст: fillRect(0, 0, cv.width, cv.height).';
              } catch (e) { return 'Не удалось прочитать пиксели: ' + (e && e.message); }
            }
        },
        {
          name: "У прямоугольника есть рамка",
          check: (d, w, H) => {
              const cv = d.querySelector('#cv');
              if (!cv) return 'Нужен <canvas id="cv">.';
              try {
                const ctx = cv.getContext('2d');
                const data = ctx.getImageData(0, 0, cv.width, cv.height).data;
                let line = 0;
                for (let i = 0; i < data.length; i += 4) {
                  if (data[i + 3] > 200 && data[i] < 200 && (data[i] + data[i + 1] + data[i + 2]) / 3 < 160) line++;
                }
                return line > 100 || 'Не увидели рамку strokeRect вокруг прямоугольника (тёмный контур по периметру).';
              } catch (e) { return 'Не удалось прочитать пиксели: ' + (e && e.message); }
            }
        }
      ]
    },
    {
      id: "t4",
      title: "Окружность",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Круг рисуют через дугу — <code>arc</code>. У него необычный протокол: сначала <code>beginPath()</code> («начинаем новую линию»), потом сама дуга, потом <code>fill()</code> («залить») или <code>stroke()</code> («обвести»):</p><pre class=\"code\"><code>ctx.beginPath();\nctx.arc(x, y, радиус, 0, Math.PI * 2);\nctx.fillStyle = '#ffcc00';\nctx.fill();</code></pre><p><code>0, Math.PI * 2</code> — начальный и конечный угол в радианах; такая пара даёт полный круг. <code>Math.PI</code> — число π из встроенного объекта Math.</p><p>Нарисуйте жёлтый круг (<code>#ffcc00</code>) радиусом 40 в правой верхней части холста (например, центр 220, 60).</p>",
      starter: "@prev",
      hint: "Четыре строки: beginPath() → ctx.arc(220, 60, 40, 0, Math.PI * 2) → fillStyle = '#ffcc00' → fill(). Без beginPath дуги могут соединиться лишними линиями.",
      tests: [
        {
          name: "Есть жёлтый круг",
          check: (d, w, H) => {
              const cv = d.querySelector('#cv');
              if (!cv) return 'Нужен <canvas id="cv">.';
              try {
                const ctx = cv.getContext('2d');
                const data = ctx.getImageData(0, 0, cv.width, cv.height).data;
                for (let i = 0; i < data.length; i += 4) {
                  if (data[i + 3] > 0 && data[i] > 230 && data[i] > 180 && data[i + 1] > 180 && data[i + 1] < 230 && data[i + 2] < 80) return true;
                }
                return 'Не нашли жёлтых пикселей #ffcc00. Круг: beginPath → arc → fill.';
              } catch (e) { return 'Не удалось прочитать пиксели: ' + (e && e.message); }
            }
        }
      ]
    },
    {
      id: "t5",
      title: "Линия",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Линия тоже рисуется «путём»: <code>moveTo(x, y)</code> переносит невидимое перо в точку (не рисуя), <code>lineTo(x, y)</code> проводит линию от текущей точки к новой, <code>stroke()</code> обводит накопленный путь:</p><pre class=\"code\"><code>ctx.beginPath();\nctx.moveTo(20, 180);\nctx.lineTo(280, 180);   // горизонтальная линия\nctx.lineWidth = 4;\nctx.stroke();</code></pre><p>Нарисуйте в нижней части холста горизонтальную линию толщиной 4 пикселя — например, «землю» под домиком от x=20 до x=280 на высоте y=180.</p>",
      starter: "@prev",
      hint: "beginPath() → moveTo(20, 180) → lineTo(280, 180) → lineWidth = 4 → stroke(). Линия не видна без stroke().",
      tests: [
        {
          name: "Внизу холста есть чёрная линия",
          check: (d, w, H) => {
              const cv = d.querySelector('#cv');
              if (!cv) return 'Нужен <canvas id="cv">.';
              try {
                const ctx = cv.getContext('2d');
                const y0 = Math.floor(cv.height * 0.75), h = Math.floor(cv.height * 0.25);
                const data = ctx.getImageData(0, y0, cv.width, h).data;
                let n = 0;
                for (let i = 0; i < data.length; i += 4) {
                  if (data[i + 3] > 0 && data[i] < 80 && data[i + 1] < 80 && data[i + 2] < 80) n++;
                }
                return n > 50 || 'В нижней четверти холста нет тёмной линии. Нарисуйте линию moveTo → lineTo → stroke.';
              } catch (e) { return 'Не удалось прочитать пиксели: ' + (e && e.message); }
            }
        }
      ]
    },
    {
      id: "t6",
      title: "Текст по клику",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Текст рисуют методом <code>fillText(строка, x, y)</code>. Шрифт задают заранее строкой: <code>ctx.font = '24px Arial'</code>. Как и цвета, это «настройки кисти»: меняются до рисования.</p><pre class=\"code\"><code>draw.addEventListener('click', () =&gt; {\n  ctx.fillStyle = '#2f6fed';\n  ctx.font = '24px Arial';\n  ctx.fillText('Орбита', 100, 150);\n});</code></pre><p>Координата y у текста — это <b>нижний</b> край букв, а не верхний.</p><p>Добавьте кнопку <code>&lt;button id=\"draw\"&gt;Дорисовать&lt;/button&gt;</code>: по клику на холсте появляется синяя надпись «Орбита» размером 24 px. До клика надписи быть не должно.</p>",
      starter: "@prev",
      hint: "В обработчике клика: fillStyle = '#2f6fed'; font = '24px Arial'; fillText('Орбита', 100, 150);. Контекст ctx уже есть — использовать его же.",
      tests: [
        {
          name: "До клика надписи нет, после клика — есть",
          check: async (d, w) => {
              const cv = d.querySelector('#cv'), btn = d.querySelector('#draw');
              if (!cv || !btn) return 'Нужны #cv и кнопка #draw.';
              try {
                const ctx = cv.getContext('2d');
                const blank = ctx.getImageData(0, 0, cv.width, cv.height).data;
                const count = (data) => { let n = 0; for (let i = 0; i < data.length; i += 4) { if (data[i] === 47 && data[i + 1] === 111 && data[i + 2] === 237) n++; } return n; };
                const before = count(blank);
                btn.click();
                const after = count(ctx.getImageData(0, 0, cv.width, cv.height).data);
                return after > before + 50 || 'По клику на холсте не появились синие пиксели (#2f6fed). Используйте fillText.';
              } catch (e) { return 'Не удалось прочитать пиксели: ' + (e && e.message); }
            }
        },
        {
          name: "Используется fillText",
          check: (d, w, H) => /fillText\s*\(/.test(H.src()) || 'Нарисуйте текст методом fillText.'
        }
      ]
    },
    {
      id: "t7",
      title: "Итог: свой рисунок",
      points: 28,
      lang: "html",
      final: true,
      variants: [
        {
          pictureName: "Домик у реки",
          bgColor: "#dff3ff",
          color1: "#ffcc00",
          color2: "#2f6fed",
          caption: "Мой домик"
        },
        {
          pictureName: "Космический порт",
          bgColor: "#1b2340",
          color1: "#ffcc00",
          color2: "#ff5555",
          caption: "На старт!"
        },
        {
          pictureName: "Поляна с солнцем",
          bgColor: "#e6f7e6",
          color1: "#ffcc00",
          color2: "#2f9d5b",
          caption: "Лето"
        },
        {
          pictureName: "Ночной город",
          bgColor: "#222233",
          color1: "#ffcc00",
          color2: "#8888ff",
          caption: "Город не спит"
        },
        {
          pictureName: "Пиратский корабль",
          bgColor: "#dff3ff",
          color1: "#8b5a2b",
          color2: "#2f6fed",
          caption: "Абордаж!"
        },
        {
          pictureName: "Вулкан",
          bgColor: "#f7e6df",
          color1: "#ff5555",
          color2: "#555566",
          caption: "Извержение"
        }
      ],
      text: "<p>Нарисуйте картинку с нуля (можно в VS Code и загрузить файлом). Тема вашего варианта: <b>{{pictureName}}</b>.</p><p><b>Теория-подсказка.</b> Мини-план: фон через <code>fillRect(0, 0, cv.width, cv.height)</code> → два элемента из ваших цветов ({{color1}} и {{color2}}) — например круг и прямоугольник, как в заданиях 4 и 5 → подпись через <code>fillText</code>.</p><ul><li>холст <code>&lt;canvas id=\"cv\" width=\"400\" height=\"300\"&gt;</code>;</li><li>фон цвета {{bgColor}};</li><li>на картинке есть оба цвета варианта: {{color1}} и {{color2}};</li><li>подпись вашего варианта («{{caption}}») методом fillText;</li><li>минимум три разные фигуры (например: круг, прямоугольник и треугольник через lineTo).</li></ul>",
      starter: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Мой рисунок</title>\n  <style>\n    body { font-family: Arial, sans-serif; background: #f3f5fb; padding: 24px; }\n    canvas { background: #fff; border: 1px solid #ccc; }\n    button { padding: 8px 16px; border: 0; border-radius: 8px; background: #2f6fed; color: #fff; cursor: pointer; }\n  </style>\n</head>\n<body>\n  <h1>Рисовалка</h1>\n  <!-- Нарисуйте картинку: canvas#cv 400×300, фон, фигуры, подпись -->\n\n</body>\n</html>",
      hint: "Соберите из заданий 1–6: фон fillRect, круг arc+fill, прямоугольник fillRect, треугольник — три lineTo и closePath, текст fillText.",
      tests: [
        {
          name: "Холст есть и достаточно большой",
          check: (d) => { const cv = d.querySelector('#cv'); return (cv && cv.width >= 300 && cv.height >= 200) || 'Нужен <canvas id="cv"> минимум 300×200.'; }
        },
        {
          name: "Есть первый цвет варианта",
          check: (d, w, H) => {
              const cv = d.querySelector('#cv');
              if (!cv) return 'Нужен <canvas id="cv">.';
              try {
                const ctx = cv.getContext('2d');
                const data = ctx.getImageData(0, 0, cv.width, cv.height).data;
                let h = String(H.v.color1).replace('#', '');
                if (h.length === 3) h = h.split('').map(c => c + c).join('');
                const want = [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
                for (let i = 0; i < data.length; i += 4) {
                  if (data[i + 3] > 0 && Math.abs(data[i] - want[0]) <= 10 && Math.abs(data[i + 1] - want[1]) <= 10 && Math.abs(data[i + 2] - want[2]) <= 10) return true;
                }
                return 'На картинке нет цвета ' + H.v.color1 + ' — он обязателен для вашего варианта.';
              } catch (e) { return 'Не удалось прочитать пиксели: ' + (e && e.message); }
            }
        },
        {
          name: "Есть второй цвет варианта",
          check: (d, w, H) => {
              const cv = d.querySelector('#cv');
              if (!cv) return 'Нужен <canvas id="cv">.';
              try {
                const ctx = cv.getContext('2d');
                const data = ctx.getImageData(0, 0, cv.width, cv.height).data;
                let h = String(H.v.color2).replace('#', '');
                if (h.length === 3) h = h.split('').map(c => c + c).join('');
                const want = [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
                for (let i = 0; i < data.length; i += 4) {
                  if (data[i + 3] > 0 && Math.abs(data[i] - want[0]) <= 10 && Math.abs(data[i + 1] - want[1]) <= 10 && Math.abs(data[i + 2] - want[2]) <= 10) return true;
                }
                return 'На картинке нет цвета ' + H.v.color2 + ' — он обязателен для вашего варианта.';
              } catch (e) { return 'Не удалось прочитать пиксели: ' + (e && e.message); }
            }
        },
        {
          name: "Рисунок не пустой и не состоит из одной точки",
          check: (d, w, H) => {
              const cv = d.querySelector('#cv');
              if (!cv) return 'Нужен <canvas id="cv">.';
              try {
                const ctx = cv.getContext('2d');
                const data = ctx.getImageData(0, 0, cv.width, cv.height).data;
                let painted = 0;
                for (let i = 0; i < data.length; i += 4) {
                  if (data[i + 3] > 0 && !(data[i] > 245 && data[i + 1] > 245 && data[i + 2] > 245)) painted++;
                }
                return painted > 1500 || 'Закрашено слишком мало пикселей: добавьте минимум три фигуры.';
              } catch (e) { return 'Не удалось прочитать пиксели: ' + (e && e.message); }
            }
        },
        {
          name: "Используется fillText",
          check: (d, w, H) => /fillText\s*\(/.test(H.src()) || 'Добавьте подпись через fillText.'
        }
      ]
    }
  ]
};
