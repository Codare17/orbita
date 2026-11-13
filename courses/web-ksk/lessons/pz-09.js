/* Собрано из исходников платформы (node build.mjs site). Эталонные решения хранятся в Google Таблице. */
window.ORBITA.lessons['pz-09'] = {
  type: "practice",
  intro: "<p>DOM (Document Object Model) — это представление страницы в виде дерева объектов, которым можно управлять из JavaScript: менять текст, добавлять и удалять элементы, переключать стили.</p><p>Сегодня соберём список задач, как в настоящих приложениях для заметок. В каждом задании — короткая теория перед условием.</p>",
  tasks: [
    {
      id: "t1",
      title: "Найти и изменить",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Главный инструмент поиска — <code>document.querySelector(селектор)</code>: он принимает любой CSS-селектор и возвращает <b>первый</b> подходящий элемент. Для id ставят решётку: <code>'#title'</code>. Текст элемента меняют свойством <code>textContent</code>:</p><pre class=\"code\"><code>const title = document.querySelector('#title');\ntitle.textContent = 'Новый текст';</code></pre><p>В скрипте (внутри <code>&lt;script&gt;</code> в конце <code>&lt;body&gt;</code>) найдите заголовок <code>#title</code> и замените его текст на «Список задач на сегодня». Сам HTML заголовка не трогайте — меняет только скрипт.</p>",
      starter: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Список задач</title>\n  <style>\n    body { font-family: Arial, sans-serif; background: #f3f5fb; padding: 24px; }\n    li.done { text-decoration: line-through; color: #888; }\n    button { padding: 6px 12px; border: 0; border-radius: 6px; background: #2f6fed; color: #fff; cursor: pointer; }\n  </style>\n</head>\n<body>\n  <h1 id=\"title\">Мой список задач</h1>\n  <ul id=\"list\">\n    <li>Выучить DOM</li>\n    <li>Сделать ПЗ</li>\n  </ul>\n  <!-- Скриптом замените текст заголовка #title -->\n\n</body>\n</html>",
      hint: "Два шага: const title = document.querySelector('#title'); и затем title.textContent = 'Список задач на сегодня';. Скрипт ставьте в конец body.",
      tests: [
        {
          name: "Заголовок сменился скриптом",
          check: (d, w, H) => { const t = d.querySelector('#title'); return (t && t.textContent.trim() === 'Список задач на сегодня') || 'Сейчас заголовок: «' + (t ? t.textContent.trim() : 'не найден') + '».'; }
        },
        {
          name: "Используется querySelector",
          check: (d, w, H) => /querySelector\s*\(/.test(H.src()) || 'Найдите элемент через document.querySelector.'
        }
      ]
    },
    {
      id: "t2",
      title: "Создаём элементы",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Новый элемент создаётся в два шага: сначала <code>document.createElement('li')</code> — элемент появляется, но «в воздухе», затем его добавляют в страницу, обычно в конец родителя: <code>list.append(li)</code>.</p><pre class=\"code\"><code>const li = document.createElement('li');\nli.textContent = 'Задача №3';\nlist.append(li);</code></pre><p>Добавьте кнопку <code>&lt;button id=\"add\"&gt;Добавить задачу&lt;/button&gt;</code>. По клику она создаёт в списке <code>#list</code> пункт «Задача №3», при следующем клике — «Задача №4» и так далее (ведите счётчик).</p>",
      starter: "@prev",
      hint: "Переменная-счётчик let n = 3 объявляется до обработчика. Внутри: создать li, задать textContent 'Задача №' + n, append в список, затем n = n + 1.",
      tests: [
        {
          name: "Клик добавляет пункты с номерами",
          check: (d, w) => {
              const b = d.querySelector('#add'), l = d.querySelector('#list');
              if (!b || !l) return 'Нужны кнопка #add и список #list.';
              const before = l.querySelectorAll('li').length;
              b.click();
              const items = l.querySelectorAll('li');
              if (items.length !== before + 1) return 'Пункт не добавился: было ' + before + ', стало ' + items.length + '.';
              if (items[items.length - 1].textContent.trim() !== 'Задача №' + (before + 1)) return 'Текст нового пункта: «' + items[items.length - 1].textContent.trim() + '», ожидалось «Задача №' + (before + 1) + '».';
              b.click();
              return l.querySelectorAll('li')[before + 1].textContent.trim() === 'Задача №' + (before + 2) || 'Второй пункт должен называться «Задача №' + (before + 2) + '».';
            }
        },
        {
          name: "Используется createElement",
          check: (d, w, H) => /createElement\s*\(/.test(H.src()) || 'Создайте элемент через document.createElement.'
        }
      ]
    },
    {
      id: "t3",
      title: "Удаляем элемент",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Удалить элемент проще всего его же методом <code>remove()</code>. Чтобы удалить <b>последний</b> пункт, сначала получаем все пункты: <code>list.querySelectorAll('li')</code> — это похоже на массив, у него есть <code>length</code>, а последний элемент — <code>items[items.length - 1]</code>.</p><pre class=\"code\"><code>const items = list.querySelectorAll('li');\nif (items.length &gt; 0) {\n  items[items.length - 1].remove();\n}</code></pre><p>Проверка <code>if</code> нужна, чтобы не пытаться удалить из пустого списка.</p><p>Добавьте кнопку <code>&lt;button id=\"remove\"&gt;Удалить последнюю&lt;/button&gt;</code>: по клику удаляет последний пункт списка. В пустом списке не должно быть ошибки в консоли.</p>",
      starter: "@prev",
      hint: "В обработчике: const items = list.querySelectorAll('li'); if (items.length &gt; 0) { items[items.length - 1].remove(); }",
      tests: [
        {
          name: "Удаляется последний пункт",
          check: (d, w) => {
              const a = d.querySelector('#add'), r = d.querySelector('#remove'), l = d.querySelector('#list');
              if (!a || !r || !l) return 'Нужны кнопки #add, #remove и список #list.';
              a.click();
              const before = l.querySelectorAll('li').length;
              r.click();
              const after = l.querySelectorAll('li').length;
              return after === before - 1 || 'После удаления пунктов: ' + after + ', а ожидалось ' + (before - 1) + '.';
            }
        },
        {
          name: "Пустой список не даёт ошибку",
          check: (d, w) => {
              const r = d.querySelector('#remove'), l = d.querySelector('#list');
              if (!r || !l) return 'Нужны кнопка #remove и список #list.';
              while (l.querySelectorAll('li').length) l.querySelector('li:last-child').remove();
              r.click();
              return (window.__errors || []).length === 0 || 'В пустом списке появилась ошибка: ' + (window.__errors[0] && window.__errors[0].msg);
            }
        }
      ]
    },
    {
      id: "t4",
      title: "Переключаем класс",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Стили удобно не прописывать в JS, а прятать в CSS-классе, а в JS только переключать его. Свойство <code>classList</code> умеет:</p><ul><li><code>el.classList.add('done')</code> — добавить класс;</li><li><code>el.classList.remove('done')</code> — убрать;</li><li><code>el.classList.toggle('done')</code> — переключить: есть → убрать, нет → добавить.</li></ul><p>В CSS уже готов класс <code>li.done</code>: перечёркнутый серый текст. Подпишите список <code>#list</code> на событие <code>click</code> так, чтобы клик по пункту переключал у него класс <code>done</code>. (Проверка «кликнули именно по пункту» — через <code>event.target</code>, подробнее в следующем ПЗ; здесь можно считать, что клик всегда по пункту.)</p>",
      starter: "@prev",
      hint: "list.addEventListener('click', (event) =&gt; { event.target.classList.toggle('done'); });. Класс уже есть в CSS — писать стили не нужно.",
      tests: [
        {
          name: "Клик переключает класс done",
          check: (d, w) => {
              const l = d.querySelector('#list');
              if (!l) return 'Нужен список #list.';
              const li = l.querySelector('li');
              li.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
              if (!li.classList.contains('done')) return 'После клика у пункта нет класса done.';
              li.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
              return !li.classList.contains('done') || 'Повторный клик должен убирать класс done (toggle).';
            }
        },
        {
          name: "Используется classList",
          check: (d, w, H) => /classList\s*\./.test(H.src()) || 'Переключайте класс через el.classList.toggle(\'done\').'
        }
      ]
    },
    {
      id: "t5",
      title: "Счётчик выполненных",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Чтобы узнать, сколько элементов подходит под селектор, используют <code>querySelectorAll</code> и его <code>length</code>: <code>list.querySelectorAll('li.done').length</code> — число пунктов с классом <code>done</code>.</p><p>Один и тот же код пересчёта понадобится в нескольких обработчиках. Вместо копирования выносят его в <b>функцию</b>:</p><pre class=\"code\"><code>function refreshCounter() {\n  const done = list.querySelectorAll('li.done').length;\n  counter.textContent = 'Выполнено: ' + done;\n}</code></pre><p>Добавьте абзац <code>&lt;p id=\"counter\"&gt;Выполнено: 0&lt;/p&gt;</code> и функцию <code>refreshCounter()</code>. Вызывайте её после каждого отметки пункта и после удаления пункта — счётчик всегда показывает актуальное число.</p>",
      starter: "@prev",
      hint: "Функция: const done = list.querySelectorAll('li.done').length; counter.textContent = 'Выполнено: ' + done;. Не забудьте вызвать её в обоих обработчиках.",
      tests: [
        {
          name: "Счётчик следит за отметками",
          check: (d, w) => {
              const l = d.querySelector('#list'), c = d.querySelector('#counter');
              if (!l || !c) return 'Нужны список #list и абзац #counter.';
              const items = l.querySelectorAll('li');
              items[0].dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
              items[1].dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
              if (c.textContent.trim() !== 'Выполнено: 2') return 'После двух отметок: «' + c.textContent.trim() + '», ожидалось «Выполнено: 2».';
              items[0].dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
              return c.textContent.trim() === 'Выполнено: 1' || 'После снятия отметки: «' + c.textContent.trim() + '», ожидалось «Выполнено: 1».';
            }
        }
      ]
    },
    {
      id: "t6",
      title: "Своя задача из поля ввода",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Осталось добавить главное — свои задачи. Текст из поля ввода читают через <code>input.value</code>. Полезный приём — <code>trim()</code>: он убирает пробелы по краям, чтобы пробел не считался задачей.</p><pre class=\"code\"><code>const text = newTask.value.trim();\nif (text !== '') {\n  addItem(text);\n  newTask.value = '';   // очистить поле\n}</code></pre><p>Обратите внимание: код создания пункта уже есть в обработчике «Добавить задачу». Вынесите его в функцию <code>addItem(text)</code> и вызывайте из обоих мест — так код не дублируется.</p><p>Добавьте поле <code>&lt;input type=\"text\" id=\"newTask\" placeholder=\"Новая задача\"&gt;</code> и кнопку <code>&lt;button id=\"addCustom\"&gt;Добавить свою&lt;/button&gt;</code>: по клику пункт с введённым текстом попадает в список, поле очищается. Пустой текст (или один пробел) не добавляется.</p>",
      starter: "@prev",
      hint: "function addItem(text) { const li = document.createElement('li'); li.textContent = text; list.append(li); }. В обработчике addCustom: читайте newTask.value.trim(), проверяйте на пустоту, вызывайте addItem, очищайте поле.",
      tests: [
        {
          name: "Свой текст попадает в список",
          check: (d, w) => {
              const i = d.querySelector('#newTask'), b = d.querySelector('#addCustom'), l = d.querySelector('#list');
              if (!i || !b || !l) return 'Нужны поле #newTask, кнопка #addCustom и список #list.';
              i.value = 'Полить цветы';
              b.click();
              const items = l.querySelectorAll('li');
              return items[items.length - 1].textContent.trim() === 'Полить цветы' || 'Последний пункт: «' + items[items.length - 1].textContent.trim() + '».';
            }
        },
        {
          name: "Поле очищается, пустой текст не добавляется",
          check: (d, w) => {
              const i = d.querySelector('#newTask'), b = d.querySelector('#addCustom'), l = d.querySelector('#list');
              if (!i || !b || !l) return 'Нужны поле #newTask, кнопка #addCustom и список #list.';
              i.value = '   ';
              const before = l.querySelectorAll('li').length;
              b.click();
              if (l.querySelectorAll('li').length !== before) return 'Пустой текст добавился в список. Проверяйте text !== \'\'.';
              i.value = 'Тест';
              b.click();
              return i.value === '' || 'После добавления поле должно очиститься.';
            }
        }
      ]
    },
    {
      id: "t7",
      title: "Итог: свой список",
      points: 28,
      lang: "html",
      final: true,
      variants: [
        {
          listName: "Продукты на завтрак",
          items: [
            "Хлеб",
            "Молоко",
            "Яйца",
            "Сыр"
          ],
          total: 4,
          doneText: "Завтрак обеспечен!"
        },
        {
          listName: "Овощи для борща",
          items: [
            "Картошка",
            "Морковь",
            "Лук",
            "Капуста",
            "Свёкла"
          ],
          total: 5,
          doneText: "Борщ получится!"
        },
        {
          listName: "Сладости на праздник",
          items: [
            "Шоколад",
            "Печенье",
            "Мороженое",
            "Сок"
          ],
          total: 4,
          doneText: "Праздник удался!"
        },
        {
          listName: "Салат овощной",
          items: [
            "Зелень",
            "Помидоры",
            "Огурцы",
            "Перец",
            "Лук",
            "Масло"
          ],
          total: 6,
          doneText: "Салат готов!"
        },
        {
          listName: "Паста карбонара",
          items: [
            "Макароны",
            "Соус",
            "Пармезан",
            "Чеснок"
          ],
          total: 4,
          doneText: "Ужин готов!"
        },
        {
          listName: "Чаепитие",
          items: [
            "Чай",
            "Мёд",
            "Лимон",
            "Имбирь",
            "Печенье"
          ],
          total: 5,
          doneText: "Чаёк подан!"
        }
      ],
      text: "<p>Соберите свой список с нуля (можно в VS Code и загрузить файлом). Тема вашего варианта: <b>{{listName}}</b>.</p><p><b>Теория-подсказка.</b> Составьте план: разметка (заголовок, <code>&lt;ul id=\"list\"&gt;</code> с {{total}} пунктами, счётчик, скрытый абзац победы) → CSS-класс <code>li.done</code> → скрипт: переключение класса по клику, функция пересчёта, условие полного выполнения.</p><ul><li>заголовок <code>&lt;h2 id=\"listTitle\"&gt;</code> с темой списка и <code>&lt;ul id=\"list\"&gt;</code> с {{total}} пунктами;</li><li>клик по пункту переключает класс <code>done</code>, а класс в CSS перечёркивает текст;</li><li>абзац <code>&lt;p id=\"counter\"&gt;</code> вида «Куплено: 0 из {{total}}» пересчитывается после каждого клика;</li><li>абзац <code>&lt;p id=\"allDone\" style=\"display: none;\"&gt;{{doneText}}&lt;/p&gt;</code> становится видимым, когда отмечены все {{total}} пунктов.</li></ul>",
      starter: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Список покупок</title>\n  <style>\n    body { font-family: Arial, sans-serif; background: #f3f5fb; padding: 24px; }\n    li.done { text-decoration: line-through; color: #888; }\n    button { padding: 6px 12px; border: 0; border-radius: 6px; background: #2f6fed; color: #fff; cursor: pointer; }\n  </style>\n</head>\n<body>\n  <h1 id=\"title\">Мой список задач</h1>\n  <!-- Соберите список: h2#listTitle, ul#list, p#counter, p#allDone -->\n\n</body>\n</html>",
      hint: "Опирайтесь на задания 4–6: делегирование клика на #list, classList.toggle('done'), функция refresh() с querySelectorAll('li.done').length и условие if (done === {{total}}).",
      tests: [
        {
          name: "Есть заголовок и список",
          check: (d, w, H) => !!(d.querySelector('#listTitle') && d.querySelector('#list')) || 'Нужны #listTitle и #list.'
        },
        {
          name: "В списке правильное число пунктов",
          check: (d, w, H) => { const l = d.querySelector('#list'); return (l && l.querySelectorAll('li').length === +H.v.total) || 'В #list должно быть ' + H.v.total + ' пунктов.'; }
        },
        {
          name: "Клик отмечает пункт и обновляет счётчик",
          check: (d, w, H) => {
              const l = d.querySelector('#list'), c = d.querySelector('#counter');
              if (!l || !c) return 'Нужны #list и #counter.';
              l.querySelector('li').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
              return c.textContent.indexOf('1') >= 0 || 'После одной отметки счётчик должен показывать 1: «' + c.textContent.trim() + '».';
            }
        },
        {
          name: "Полное выполнение показывает победу",
          check: (d, w, H) => {
              const l = d.querySelector('#list'), win = d.querySelector('#allDone');
              if (!l || !win) return 'Нужны #list и #allDone.';
              const items = [].slice.call(l.querySelectorAll('li'));
              items.forEach(li => { if (li.classList.contains('done')) li.dispatchEvent(new w.MouseEvent('click', { bubbles: true })); });
              items.forEach(li => { if (!li.classList.contains('done')) li.dispatchEvent(new w.MouseEvent('click', { bubbles: true })); });
              return win.style.display !== 'none' || 'После отметки всех пунктов #allDone должен стать видимым.';
            }
        },
        {
          name: "У пункта переключается класс done",
          check: (d, w, H) => { const l = d.querySelector('#list'); if (!l) return 'Нужен #list.'; const li = l.querySelector('li'); const before = li.classList.contains('done'); li.dispatchEvent(new w.MouseEvent('click', { bubbles: true })); return li.classList.contains('done') !== before || 'После клика класс done должен переключиться (classList.toggle).'; }
        }
      ]
    }
  ]
};
