/* Собрано из исходников платформы (node build.mjs site). Эталонные решения хранятся в Google Таблице. */
window.ORBITA.lessons['pz-11'] = {
  type: "practice",
  intro: "<p>Таймеры позволяют откладывать действия и повторять их снова и снова: напомнить через минуту, тикать каждую секунду, остановиться по команде.</p><p>Задания этой практики проверяются по-настоящему — проверка ждёт пару секунд, поэтому «Проверить» нажимается чуть дольше обычного. Это нормально.</p>",
  tasks: [
    {
      id: "t1",
      title: "setTimeout: напомнить позже",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> <code>setTimeout(функция, миллисекунды)</code> выполняет функцию <b>один раз</b> через заданную задержку. Время указывается в миллисекундах: 1000 мс = 1 секунда, 2000 мс = 2 секунды.</p><pre class=\"code\"><code>setTimeout(() =&gt; {\n  msg.textContent = 'Прошло 2 секунды!';\n}, 2000);</code></pre><p>Код не ждёт: строки после <code>setTimeout</code> выполняются сразу, а функция внутри — потом, «фоном».</p><p>По клику на кнопку <code>#later</code> запустите <code>setTimeout</code> на 2000 мс: через 2 секунды абзац <code>#msg</code> показывает «Прошло 2 секунды!».</p>",
      starter: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Таймерная мастерская</title>\n  <style>\n    body { font-family: Arial, sans-serif; background: #f3f5fb; padding: 24px; }\n    button { padding: 8px 16px; border: 0; border-radius: 8px; background: #2f6fed; color: #fff; cursor: pointer; }\n  </style>\n</head>\n<body>\n  <h1>Таймерная мастерская</h1>\n  <p id=\"msg\">Ничего не произошло</p>\n  <button id=\"later\">Напомнить через 2 секунды</button>\n\n  <!-- По клику: setTimeout на 2000 мс меняет текст #msg -->\n\n</body>\n</html>",
      hint: "В обработчике клика: setTimeout(() =&gt; { msg.textContent = 'Прошло 2 секунды!'; }, 2000);. 2000 — это миллисекунды.",
      tests: [
        {
          name: "Текст меняется только через 2 секунды",
          check: async (d, w) => {
            const b = d.querySelector('#later'), m = d.querySelector('#msg');
            if (!b || !m) return 'Нужны кнопка #later и абзац #msg.';
            b.click();
            if (m.textContent.trim() !== 'Ничего не произошло') return 'Текст изменился сразу, без ожидания. Используйте setTimeout.';
            const t0 = Date.now();
            while (m.textContent.trim() === 'Ничего не произошло' && Date.now() - t0 < 8000) await new Promise(r => setTimeout(r, 100));
            return m.textContent.trim() === 'Прошло 2 секунды!' || 'Текст: «' + m.textContent.trim() + '», ожидалось «Прошло 2 секунды!».';
          }
        },
        {
          name: "Используется setTimeout",
          check: (d, w, H) => /setTimeout\s*\(/.test(H.src()) || 'Используйте setTimeout.'
        }
      ]
    },
    {
      id: "t2",
      title: "setInterval: часы тикают",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> <code>setInterval(функция, миллисекунды)</code> повторяет функцию <b>снова и снова</b> с заданным шагом. Часы «тикают»: каждую секунду счётчик увеличивается на 1.</p><pre class=\"code\"><code>let seconds = 0;\nsetInterval(() =&gt; {\n  seconds = seconds + 1;\n  clock.textContent = 'Прошло секунд: ' + seconds;\n}, 1000);</code></pre><p>Переменную-счётчик снова объявляют <b>снаружи</b>, иначе каждый тик начинался бы с нуля.</p><p>Добавьте абзац <code>&lt;p id=\"clock\"&gt;Прошло секунд: 0&lt;/p&gt;</code> и кнопку <code>&lt;button id=\"go\"&gt;Запустить часы&lt;/button&gt;</code>: по клику каждую секунду число в абзаце растёт на 1.</p>",
      starter: "@prev",
      hint: "В обработчике: let seconds = 0; setInterval(() =&gt; { seconds = seconds + 1; clock.textContent = 'Прошло секунд: ' + seconds; }, 1000);",
      tests: [
        {
          name: "Счётчик тикает каждую секунду",
          check: async (d, w) => {
            const b = d.querySelector('#go'), c = d.querySelector('#clock');
            if (!b || !c) return 'Нужны кнопка #go и абзац #clock.';
            b.click();
            const t0 = Date.now();
            while (c.textContent.trim() === 'Прошло секунд: 0' && Date.now() - t0 < 8000) await new Promise(r => setTimeout(r, 100));
            return c.textContent.trim() === 'Прошло секунд: 1' || 'После запуска: «' + c.textContent.trim() + '», ожидалось «Прошло секунд: 1» — число должно вырасти на 1 после первого тика.';
          }
        },
        {
          name: "Используется setInterval",
          check: (d, w, H) => /setInterval\s*\(/.test(H.src()) || 'Используйте setInterval.'
        }
      ]
    },
    {
      id: "t3",
      title: "clearInterval: стоп-кран",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> <code>setInterval</code> возвращает номер таймера. Если сохранить его в переменную, таймер можно остановить: <code>clearInterval(номер)</code>.</p><pre class=\"code\"><code>let timer = setInterval(() =&gt; { … }, 1000);\n// позже:\nclearInterval(timer);</code></pre><p>Добавьте кнопку <code>&lt;button id=\"stop\"&gt;Стоп&lt;/button&gt;</code>. Часы запускаются по-прежнему кнопкой «Запустить часы», а по клику «Стоп» останавливаются: число замирает. Сохраняйте номер таймера в переменную, объявленную снаружи обработчиков.</p>",
      starter: "@prev",
      hint: "Снаружи: let timer = null;. В «Запустить»: timer = setInterval(…). В «Стоп»: clearInterval(timer);.",
      tests: [
        {
          name: "Стоп замирает счётчик",
          check: async (d, w) => {
            const go = d.querySelector('#go'), stop = d.querySelector('#stop'), c = d.querySelector('#clock');
            if (!go || !stop || !c) return 'Нужны кнопки #go и #stop и абзац #clock.';
            go.click();
            await new Promise(r => setTimeout(r, 1300));
            stop.click();
            const frozen = c.textContent.trim();
            await new Promise(r => setTimeout(r, 1300));
            return c.textContent.trim() === frozen || 'После «Стоп» счётчик продолжил идти: было «' + frozen + '», стало «' + c.textContent.trim() + '».';
          }
        },
        {
          name: "Используется clearInterval",
          check: (d, w, H) => /clearInterval\s*\(/.test(H.src()) || 'Останавливайте таймер через clearInterval.'
        }
      ]
    },
    {
      id: "t4",
      title: "Сброс и защита от двойного запуска",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Два улучшения, которые есть в любом настоящем секундомере:</p><ul><li><b>Сброс.</b> Кнопка «Сброс» останавливает таймер (<code>clearInterval</code>), обнуляет счётчик и возвращает текст «Прошло секунд: 0».</li><li><b>Защита от двойного запуска.</b> Без неё каждый клик «Запустить» создавал бы ещё один таймер, и секунды побежали бы вдвое быстрее. Приём: хранить номер таймера в переменной и запускать новый только если она пустая: <code>if (timer === null) { … }</code>. После остановки не забудьте вернуть <code>timer = null</code>.</li></ul><p>Добавьте кнопку <code>&lt;button id=\"reset\"&gt;Сброс&lt;/button&gt;</code> и переделайте запуск: двойной клик «Запустить» не должен ускорять часы.</p>",
      starter: "@prev",
      hint: "Переменные seconds и timer объявите снаружи обработчиков. В «Запустить»: if (timer === null) { timer = setInterval(…); }. В «Стоп» после clearInterval: timer = null;. В «Сброс»: clearInterval(timer); timer = null; seconds = 0; и текст «Прошло секунд: 0».",
      tests: [
        {
          name: "Сброс возвращает ноль",
          check: async (d, w) => {
            const go = d.querySelector('#go'), reset = d.querySelector('#reset'), c = d.querySelector('#clock');
            if (!go || !reset || !c) return 'Нужны #go, #reset и #clock.';
            go.click();
            await new Promise(r => setTimeout(r, 1300));
            reset.click();
            return c.textContent.trim() === 'Прошло секунд: 0' || 'После сброса: «' + c.textContent.trim() + '», ожидалось «Прошло секунд: 0».';
          }
        },
        {
          name: "Двойной клик не ускоряет часы",
          check: async (d, w) => {
            const go = d.querySelector('#go'), c = d.querySelector('#clock');
            if (!go || !c) return 'Нужны #go и #clock.';
            const num = () => { const m = c.textContent.match(/(\d+)/); return m ? +m[1] : -1; };
            if (num() < 0) return 'Не разобрала текст часов: «' + c.textContent.trim() + '». Ожидалось «Прошло секунд: N».';
            go.click(); go.click(); go.click();
            let last = num(), best = last, jump = 0;
            const t0 = Date.now();
            while (best < 2 && Date.now() - t0 < 9000) {
              await new Promise(r => setTimeout(r, 150));
              const v = num();
              if (v < 0) return 'Не разобрала текст часов: «' + c.textContent.trim() + '». Ожидалось «Прошло секунд: N».';
              if (v - last > jump) jump = v - last;
              if (v > best) best = v;
              last = v;
            }
            if (jump >= 2) return 'Часы идут слишком быстро: счётчик вырос сразу на ' + jump + ' за один шаг — после двойного клика работает несколько таймеров. Запускайте новый интервал, только если timer === null.';
            return best >= 2 || 'Часы почти не идут: за 9 секунд дошли только до «Прошло секунд: ' + best + '». Ожидалось дойти до 2.';
          }
        }
      ]
    },
    {
      id: "t5",
      title: "Обратный отсчёт",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Обратный отсчёт — тот же <code>setInterval</code>, только число <b>уменьшается</b>, и интервал нужно остановить изнутри, когда дошли до нуля:</p><pre class=\"code\"><code>let n = 3;\nconst cd = setInterval(() =&gt; {\n  n = n - 1;\n  count.textContent = n;\n  if (n &lt;= 0) {\n    clearInterval(cd);   // остановились сами\n  }\n}, 1000);</code></pre><p>Добавьте абзац <code>&lt;p id=\"count\"&gt;3&lt;/p&gt;</code>, кнопку <code>&lt;button id=\"launch\"&gt;Обратный отсчёт&lt;/button&gt;</code> и скрытый абзац <code>&lt;p id=\"start\" style=\"display: none;\"&gt;Старт!&lt;/p&gt;</code>. По клику счётчик идёт 3 → 0, на нуле останавливается и появляется «Старт!».</p>",
      starter: "@prev",
      hint: "Как секундомер, но n = n - 1. Внутри интервала: if (n &lt;= 0) { clearInterval(cd); start.style.display = 'block'; }.",
      tests: [
        {
          name: "Отсчёт доходит до нуля, останавливается и показывает «Старт!»",
          check: async (d, w) => {
            const l = d.querySelector('#launch'), c = d.querySelector('#count'), st = d.querySelector('#start');
            if (!l || !c || !st) return 'Нужны #launch, #count и #start.';
            l.click();
            const t0 = Date.now();
            while (c.textContent.trim() !== '0' && Date.now() - t0 < 12000) await new Promise(r => setTimeout(r, 150));
            if (c.textContent.trim() !== '0') return 'Отсчёт не дошёл до нуля: сейчас «' + c.textContent.trim() + '», ожидалось «0».';
            if (st.style.display === 'none') return 'На нуле «Старт!» должен стать видимым.';
            await new Promise(r => setTimeout(r, 900));
            return c.textContent.trim() === '0' || 'Отсчёт не остановился на нуле — сейчас «' + c.textContent.trim() + '». Нужен clearInterval внутри if.';
          }
        }
      ]
    },
    {
      id: "t6",
      title: "Конечное мигание",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Таймер может остановить сам себя по счётчику повторений. Приём — считать тики и сравнивать с лимитом:</p><pre class=\"code\"><code>let times = 0;\nconst bl = setInterval(() => {\n  blink.textContent = blink.textContent === 'Тихо' ? 'Бип!' : 'Тихо';\n  times = times + 1;\n  if (times &gt;= 6) {\n    clearInterval(bl);\n  }\n}, 300);</code></pre><p>Тернарный оператор <code>a ? b : c</code> — короткая запись if-else: «если a — b, иначе c».</p><p>Добавьте абзац <code>&lt;p id=\"blink\"&gt;Тихо&lt;/p&gt;</code> и кнопку <code>&lt;button id=\"blinkBtn\"&gt;Мигнуть 3 раза&lt;/button&gt;</code>: по клику текст переключается между «Тихо» и «Бип!» каждые 300 мс и после 6 переключений (это 3 полных мигания) замирает.</p>",
      starter: "@prev",
      hint: "Счётчик times внутри обработчика клика, интервал каждые 300 мс. Переключение: blink.textContent = blink.textContent === 'Тихо' ? 'Бип!' : 'Тихо';. Остановка при times &gt;= 6.",
      tests: [
        {
          name: "Текст мигает",
          check: async (d, w) => {
            const b = d.querySelector('#blinkBtn'), bl = d.querySelector('#blink');
            if (!b || !bl) return 'Нужны #blinkBtn и #blink.';
            const was = bl.textContent.trim();
            b.click();
            const t0 = Date.now();
            while (bl.textContent.trim() === was && Date.now() - t0 < 5000) await new Promise(r => setTimeout(r, 100));
            return bl.textContent.trim() !== was || 'Текст не меняется после клика. Ожидалось переключение «Тихо» ↔ «Бип!» каждые 300 мс.';
          }
        },
        {
          name: "Мигание заканчивается само",
          check: async (d, w) => {
            const b = d.querySelector('#blinkBtn'), bl = d.querySelector('#blink');
            if (!b || !bl) return 'Нужны #blinkBtn и #blink.';
            b.click();
            const t0 = Date.now();
            let last = bl.textContent.trim(), quiet = Date.now();
            while (Date.now() - t0 < 15000) {
              await new Promise(r => setTimeout(r, 200));
              const v = bl.textContent.trim();
              if (v !== last) { last = v; quiet = Date.now(); }
              else if (Date.now() - quiet >= 900) return true;
            }
            return 'Текст продолжает меняться дольше 3 миганий. Остановите интервал через clearInterval после 6 переключений.';
          }
        }
      ]
    },
    {
      id: "t7",
      title: "Итог: свой таймер",
      points: 28,
      lang: "html",
      final: true,
      variants: [
        {
          timerName: "Перерыв на 5 минут",
          seconds: 5,
          doneText: "Перерыв окончен!"
        },
        {
          timerName: "Зарядка — 8 повторений",
          seconds: 8,
          doneText: "Зарядка завершена!"
        },
        {
          timerName: "Варим яйцо: 10 минут",
          seconds: 10,
          doneText: "Яйцо сварилось!"
        },
        {
          timerName: "Фокус: 6 минут тишины",
          seconds: 6,
          doneText: "Молодец, фокус сохранён!"
        },
        {
          timerName: "Разминка глаз: 12 минут",
          seconds: 12,
          doneText: "Глаза отдохнули!"
        },
        {
          timerName: "Челлендж: 7 минут без телефона",
          seconds: 7,
          doneText: "Челлендж пройден!"
        }
      ],
      text: "<p>Соберите таймер с нуля (можно в VS Code и загрузить файлом). Ваша тема: <b>{{timerName}}</b> — обратный отсчёт от {{seconds}}.</p><p><b>Теория-подсказка.</b> Мини-план: абзац <code>#display</code> с числом {{seconds}} → кнопка «Запустить» запускает <code>setInterval</code> на 1000 мс → каждый тик число уменьшается и выводится в <code>#display</code> → при нуле <code>clearInterval</code> и показ абзаца <code>#done</code>.</p><ul><li>заголовок <code>&lt;h2&gt;</code> с темой таймера и абзац <code>&lt;p id=\"display\"&gt;{{seconds}}&lt;/p&gt;</code>;</li><li>кнопка <code>&lt;button id=\"run\"&gt;Запустить&lt;/button&gt;</code> запускает обратный отсчёт от {{seconds}} до 0;</li><li>абзац <code>&lt;p id=\"done\" style=\"display: none;\"&gt;{{doneText}}&lt;/p&gt;</code> появляется на нуле;</li><li>отсчёт останавливается на нуле и не уходит в минус.</li></ul>",
      starter: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Мой таймер</title>\n  <style>\n    body { font-family: Arial, sans-serif; background: #f3f5fb; padding: 24px; }\n    button { padding: 8px 16px; border: 0; border-radius: 8px; background: #2f6fed; color: #fff; cursor: pointer; }\n  </style>\n</head>\n<body>\n  <h1>Таймерная мастерская</h1>\n  <!-- Соберите таймер: h2, p#display, button#run, p#done -->\n\n</body>\n</html>",
      hint: "Опирайтесь на задание 5: let n = {{seconds}}; display.textContent = n; const t = setInterval(() =&gt; { n = n - 1; display.textContent = n; if (n &lt;= 0) { clearInterval(t); done.style.display = 'block'; } }, 1000);",
      tests: [
        {
          name: "Есть #display, #run и #done",
          check: (d) => !!(d.querySelector('#display') && d.querySelector('#run') && d.querySelector('#done')) || 'Нужны #display, #run и #done.'
        },
        {
          name: "Отсчёт идёт от числа варианта до нуля",
          check: async (d, w, H) => {
              const run = d.querySelector('#run'), disp = d.querySelector('#display');
              if (!run || !disp) return 'Нужны #run и #display.';
              const start = disp.textContent.trim();
              run.click();
              const t0 = Date.now();
              while (disp.textContent.trim() === start && Date.now() - t0 < 8000) await new Promise(r => setTimeout(r, 100));
              return disp.textContent.trim() === String(+H.v.seconds - 1) || 'После первого тика: «' + disp.textContent.trim() + '», ожидалось «' + (+H.v.seconds - 1) + '».';
            }
        },
        {
          name: "#done скрыт до старта",
          check: (d, w, H) => {
              const done = d.querySelector('#done');
              return (done && done.style.display === 'none') || 'Абзац #done должен быть скрыт (style.display = \'none\'), пока таймер не дошёл до нуля.';
            }
        }
      ]
    }
  ]
};
