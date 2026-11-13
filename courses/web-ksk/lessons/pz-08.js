/* Собрано из исходников платформы (node build.mjs site). Эталонные решения хранятся в Google Таблице. */
window.ORBITA.lessons['pz-08'] = {
  type: "practice",
  intro: "<p>Сегодня страница станет живой: она будет реагировать на клики, ввод текста и переключатели. Работаем с событиями — сигналами, которые браузер посылает элементу.</p><p>В каждом задании под условием есть короткая теория с примером кода. Прочитайте её перед тем, как писать решение.</p>",
  tasks: [
    {
      id: "t1",
      title: "Первая кнопка",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Событие — это сигнал от браузера: «по кнопке кликнули», «в поле что-то ввели». Чтобы реагировать на событие, элементу подписываются (англ. <i>listener</i> — «слушатель»):</p><pre class=\"code\"><code>const button = document.querySelector('#plus');\nbutton.addEventListener('click', () =&gt; {\n  // этот код выполнится при каждом клике\n});</code></pre><p><code>document.querySelector('#plus')</code> находит элемент по CSS-селектору — здесь по <code>id</code>. Первый аргумент <code>addEventListener</code> — название события (<code>'click'</code>), второй — функция, что делать.</p><p>Сделайте так: по клику на кнопку <code>#plus</code> абзац <code>#score</code> меняет текст на «Настроение: 1».</p>",
      starter: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Счётчик настроения</title>\n  <style>\n    body { font-family: Arial, sans-serif; background: #f3f5fb; padding: 24px; }\n    button { padding: 10px 16px; border: 0; border-radius: 8px; background: #2f6fed; color: #fff; cursor: pointer; }\n  </style>\n</head>\n<body>\n  <h1>Счётчик настроения</h1>\n  <p id=\"score\">Настроение: 0</p>\n  <button id=\"plus\">Улучшить</button>\n\n  <!-- Подпишитесь на click кнопки #plus и измените #score -->\n\n</body>\n</html>",
      hint: "Найдите оба элемента через document.querySelector, затем: button.addEventListener('click', () =&gt; { score.textContent = 'Настроение: 1'; }). Текст меняется через свойство textContent.",
      tests: [
        {
          name: "По клику текст меняется на «Настроение: 1»",
          check: (d, w) => { const b = d.querySelector('#plus'), s = d.querySelector('#score'); if (!b || !s) return 'Нужны кнопка #plus и абзац #score.'; b.click(); return s.textContent.trim() === 'Настроение: 1' || 'После клика в #score сейчас: «' + s.textContent.trim() + '».'; }
        },
        {
          name: "Используется addEventListener",
          check: (d, w, H) => /addEventListener\s*\(\s*['"]click['"]/.test(H.src()) || 'Подпишитесь на событие через addEventListener(\'click\', …).'
        }
      ]
    },
    {
      id: "t2",
      title: "Считаем клики",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Сейчас надпись всегда «Настроение: 1», как ни кликай. Функция-обработчик не помнит прошлые клики — каждый раз она начинает с чистого листа. Чтобы помнить, нужна переменная <b>снаружи</b> обработчика:</p><pre class=\"code\"><code>let count = 0;\nbutton.addEventListener('click', () =&gt; {\n  count = count + 1;   // меняем внешнюю переменную\n  score.textContent = 'Настроение: ' + count;\n});</code></pre><p>Если объявить <code>let count</code> <i>внутри</i> обработчика, при каждом клике она создавалась бы заново и всегда была бы равна 1.</p><p>Переделайте обработчик: каждый клик прибавляет 1, абзац показывает текущее значение.</p>",
      starter: "@prev",
      hint: "Объявите let count = 0 до addEventListener. Внутри обработчика: count = count + 1, затем выводите 'Настроение: ' + count.",
      tests: [
        {
          name: "Клик увеличивает счётчик: 1, 2, 3",
          check: (d, w) => {
              const b = d.querySelector('#plus'), s = d.querySelector('#score');
              if (!b || !s) return 'Нужны кнопка #plus и абзац #score.';
              b.click(); if (s.textContent.trim() !== 'Настроение: 1') return 'После первого клика: «' + s.textContent.trim() + '». Ожидалось «Настроение: 1».';
              b.click(); if (s.textContent.trim() !== 'Настроение: 2') return 'После второго клика: «' + s.textContent.trim() + '». Проверьте, где объявлена переменная count.';
              b.click(); if (s.textContent.trim() !== 'Настроение: 3') return 'После третьего клика: «' + s.textContent.trim() + '».';
              return true;
            }
        }
      ]
    },
    {
      id: "t3",
      title: "Вторая кнопка «Сбросить»",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> На одном элементе может быть сколько угодно обработчиков, а один и тот же обработчик можно повесить на разные элементы. Кнопка «Сбросить» — самостоятельная пара: найти элемент, подписаться, написать функцию.</p><p>Добавьте кнопку <code>&lt;button id=\"reset\"&gt;Сбросить&lt;/button&gt;</code>. По клику на неё счётчик обнуляется и абзац снова показывает «Настроение: 0». Кнопка «Улучшить» должна работать как раньше.</p>",
      starter: "@prev",
      hint: "Обработчик reset: count = 0; score.textContent = 'Настроение: 0';. Не забудьте найти кнопку через document.querySelector('#reset').",
      tests: [
        {
          name: "«Улучшить» добавляет, «Сбросить» обнуляет",
          check: (d, w) => {
              const plus = d.querySelector('#plus'), reset = d.querySelector('#reset'), s = d.querySelector('#score');
              if (!plus || !reset || !s) return 'Нужны кнопки #plus и #reset и абзац #score.';
              plus.click(); plus.click();
              if (s.textContent.trim() !== 'Настроение: 2') return 'После двух кликов «Улучшить»: «' + s.textContent.trim() + '».';
              reset.click();
              return s.textContent.trim() === 'Настроение: 0' || 'После «Сбросить»: «' + s.textContent.trim() + '». Ожидалось «Настроение: 0».';
            }
        },
        {
          name: "После сброса счёт идёт снова",
          check: (d, w) => { const plus = d.querySelector('#plus'), reset = d.querySelector('#reset'), s = d.querySelector('#score'); if (!plus || !reset || !s) return 'Нужны кнопки #plus и #reset и абзац #score.'; plus.click(); plus.click(); reset.click(); plus.click(); return s.textContent.trim() === 'Настроение: 1' || 'После сброса и одного клика: «' + s.textContent.trim() + '». Ожидалось «Настроение: 1».'; }
        }
      ]
    },
    {
      id: "t4",
      title: "Событие input: считаем символы",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Событий много, у каждого своё имя. <code>click</code> — клик мышью, <code>input</code> — изменение поля ввода (срабатывает на каждый введённый символ). У текстового поля значение лежит в свойстве <code>value</code>, а длина строки — в <code>value.length</code>:</p><pre class=\"code\"><code>shirt.addEventListener('input', () =&gt; {\n  length.textContent = 'Длина: ' + shirt.value.length + ' символов';\n});</code></pre><p>Добавьте в разметку поле <code>&lt;input type=\"text\" id=\"shirt\"&gt;</code> с подписью «Подпись на футболке» и абзац <code>&lt;p id=\"length\"&gt;Длина: 0 символов&lt;/p&gt;</code>. При вводе текста абзац показывает актуальную длину.</p>",
      starter: "@prev",
      hint: "Событие — 'input'. В обработчике читайте shirt.value.length. Помните: у input нет textContent, текст лежит в value.",
      tests: [
        {
          name: "Длина пересчитывается при вводе",
          check: (d, w) => {
              const i = d.querySelector('#shirt'), l = d.querySelector('#length');
              if (!i || !l) return 'Нужны поле #shirt и абзац #length.';
              i.value = 'Привет';
              i.dispatchEvent(new w.Event('input', { bubbles: true }));
              if (l.textContent.trim() !== 'Длина: 6 символов') return 'После ввода «Привет» (6 символов) в #length: «' + l.textContent.trim() + '». Ожидалось «Длина: 6 символов».';
              i.value = 'Код';
              i.dispatchEvent(new w.Event('input', { bubbles: true }));
              return l.textContent.trim() === 'Длина: 3 символов' || 'После ввода «Код» (3 символа) в #length: «' + l.textContent.trim() + '». Ожидалось «Длина: 3 символов».';
            }
        },
        {
          name: "Используется событие input",
          check: (d, w, H) => /addEventListener\s*\(\s*['"]input['"]/.test(H.src()) || 'Подпишитесь на событие \'input\'.'
        }
      ]
    },
    {
      id: "t5",
      title: "Чекбокс-усилитель",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> У флажка (<code>type=\"checkbox\"</code>) состояние хранится в свойстве <code>checked</code>: <code>true</code>, если поставлен. Меняется он событием <code>change</code> — оно срабатывает, когда элемент «зафиксировал» новое значение:</p><pre class=\"code\"><code>double.addEventListener('change', () =&gt; {\n  console.log(double.checked); // true или false\n});</code></pre><p>Условие «если» пишется через <code>if</code>: <code>count = count + (double.checked ? 2 : 1);</code> — сокращённая форма. Обычная: <code>if (double.checked) { … } else { … }</code>.</p><p>Добавьте флажок <code>&lt;input type=\"checkbox\" id=\"double\"&gt;</code> с текстом «Двойные очки» (удобно обернуть в <code>&lt;label&gt;</code>). Пока флажок стоит, каждый клик «Улучшить» добавляет 2, а не 1.</p>",
      starter: "@prev",
      hint: "В обработчике клика замените прибавление на: count = count + (double.checked ? 2 : 1);. Читать состояние флажка — double.checked.",
      tests: [
        {
          name: "Без флажка +1, с флажком +2",
          check: (d, w) => {
              const plus = d.querySelector('#plus'), db = d.querySelector('#double'), s = d.querySelector('#score');
              if (!plus || !db || !s) return 'Нужны кнопка #plus, флажок #double и абзац #score.';
              plus.click();
              if (s.textContent.trim() !== 'Настроение: 1') return 'Без флажка после клика: «' + s.textContent.trim() + '». Ожидалось «Настроение: 1».';
              db.checked = true;
              plus.click(); plus.click();
              return s.textContent.trim() === 'Настроение: 5' || 'С флажком после ещё двух кликов: «' + s.textContent.trim() + '». Ожидалось «Настроение: 5» (1 + 2 + 2).';
            }
        },
        {
          name: "Флажок — type=\"checkbox\"",
          check: (d) => { const c = d.querySelector('#double'); return (c && c.type === 'checkbox') || 'Нужен <input type="checkbox" id="double">.'; }
        }
      ]
    },
    {
      id: "t6",
      title: "Двойной клик скрывает счётчик",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Не все события — клики и ввод. Полезные имена: <code>dblclick</code> — двойной клик, <code>mouseenter</code> / <code>mouseleave</code> — курсор наехал / уехал, <code>keydown</code> — нажата клавиша.</p><p>Стиль элемента меняется через свойство <code>style</code>: <code>score.style.display = 'none'</code> прячет элемент, <code>'block'</code> — показывает снова.</p><p>Добавьте кнопку <code>&lt;button id=\"hide\"&gt;Скрыть счётчик&lt;/button&gt;</code>: по <b>двойному</b> клику на неё абзац <code>#score</code> скрывается. Одиночный клик ничего не должен менять.</p>",
      starter: "@prev",
      hint: "Событие — 'dblclick'. Внутри: score.style.display = 'none';. Проверка «не срабатывает по одиночному клику» — это просто отсутствие обработчика на click.",
      tests: [
        {
          name: "Двойной клик скрывает, одиночный — нет",
          check: (d, w) => {
              const h = d.querySelector('#hide'), s = d.querySelector('#score');
              if (!h || !s) return 'Нужны кнопка #hide и абзац #score.';
              h.click();
              if (s.style.display === 'none') return 'Счётчик скрылся от одиночного клика. Подпишитесь именно на \'dblclick\'.';
              h.dispatchEvent(new w.MouseEvent('dblclick', { bubbles: true }));
              return s.style.display === 'none' || 'После двойного клика счётчик должен скрыться (style.display = \'none\').';
            }
        }
      ]
    },
    {
      id: "t7",
      title: "Итог: кликер цели",
      points: 28,
      lang: "html",
      final: true,
      variants: [
        {
          goal: "Собери 10 очков энергии",
          need: 10,
          winText: "Энергия собрана!"
        },
        {
          goal: "Поймай 15 звёзд",
          need: 15,
          winText: "Все звёзды пойманы!"
        },
        {
          goal: "Накорми кота: 12 порций",
          need: 12,
          winText: "Кот сыт и доволен!"
        },
        {
          goal: "Собери 20 монет",
          need: 20,
          winText: "Клад найден!"
        },
        {
          goal: "Заполни батарею до 8 делений",
          need: 8,
          winText: "Батарея заряжена!"
        },
        {
          goal: "Сделай 25 шагов по маршруту",
          need: 25,
          winText: "Маршрут пройден!"
        }
      ],
      text: "<p>Соберите кликер с нуля (можно в VS Code и загрузить файлом). Ваша цель: <b>{{goal}}</b>.</p><p><b>Теория-подсказка.</b> Мини-план: переменная-счётчик → по клику увеличить её и обновить текст прогресса → условие <code>if (clicks &gt;= {{need}})</code> показывает абзац победы.</p><ul><li>заголовок <code>&lt;h2&gt;</code> с целью и абзац <code>&lt;p id=\"progress\"&gt;</code> вида «Собрано: 0 / {{need}}»;</li><li>кнопка <code>&lt;button id=\"tap\"&gt;</code> — каждый клик добавляет 1 и обновляет прогресс;</li><li>абзац <code>&lt;p id=\"win\" style=\"display: none;\"&gt;{{winText}}&lt;/p&gt;</code> — скрыт, пока цель не достигнута;</li><li>когда счётчик дошёл до {{need}}, победный абзац становится видимым (<code>style.display = 'block'</code>).</li></ul>",
      starter: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Кликер цели</title>\n  <style>\n    body { font-family: Arial, sans-serif; background: #f3f5fb; padding: 24px; }\n    button { padding: 10px 16px; border: 0; border-radius: 8px; background: #2f6fed; color: #fff; cursor: pointer; }\n  </style>\n</head>\n<body>\n  <h1>Счётчик настроения</h1>\n  <!-- Соберите кликер: h2, #progress, #tap, #win -->\n\n</body>\n</html>",
      hint: "Скелет: let clicks = 0; tap.addEventListener('click', () =&gt; { clicks = clicks + 1; progress.textContent = 'Собрано: ' + clicks + ' / {{need}}'; if (clicks &gt;= {{need}}) { win.style.display = 'block'; } });",
      tests: [
        {
          name: "Есть кнопка #tap и абзацы #progress и #win",
          check: (d) => !!(d.querySelector('#tap') && d.querySelector('#progress') && d.querySelector('#win')) || 'Нужны #tap, #progress и #win.'
        },
        {
          name: "Клики считаются и показываются в прогрессе",
          check: (d, w, H) => {
              const t = d.querySelector('#tap'), p = d.querySelector('#progress');
              if (!t || !p) return 'Нужны кнопка #tap и абзац #progress.';
              t.click(); t.click();
              return p.textContent.indexOf('2') >= 0 || 'После двух кликов прогресс должен содержать 2: «' + p.textContent.trim() + '».';
            }
        },
        {
          name: "Победа появляется при достижении цели",
          check: (d, w, H) => {
              const t = d.querySelector('#tap'), win = d.querySelector('#win'), p = d.querySelector('#progress');
              if (!t || !win || !p) return 'Нужны #tap, #progress и #win.';
              for (let i = 0; i < +H.v.need; i++) t.click();
              return win.style.display !== 'none' || 'После ' + H.v.need + ' кликов абзац победы должен стать видимым.';
            }
        },
        {
          name: "В прогрессе указана цель задания",
          check: (d, w, H) => {
              const p = d.querySelector('#progress');
              if (!p) return 'Нужен абзац #progress.';
              return p.textContent.indexOf(String(H.v.need)) >= 0 || 'В тексте прогресса должна быть цель ' + H.v.need + ': «' + p.textContent.trim() + '».';
            }
        }
      ]
    }
  ]
};
