/* Собрано из исходников платформы (node build.mjs site). Эталонные решения хранятся в Google Таблице. */
window.ORBITA.lessons['pz-10'] = {
  type: "practice",
  intro: "<p>У каждого события есть объект — его обычно называют <code>event</code> (или <code>e</code>). Он несёт подробности: по какому именно элементу кликнули, какая клавиша нажата, координаты мыши. Сегодня учимся его читать.</p><p>Строим гостевую книгу: форма приветствия, счётчик клавиш, лайки и записи.</p>",
  tasks: [
    {
      id: "t1",
      title: "submit и preventDefault",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> У формы отправка — это событие <code>submit</code>. По умолчанию браузер при отправке <b>перезагружает страницу</b> и введённые данные теряются. Чтобы обработать форму в JavaScript, это действие по умолчанию отменяют:</p><pre class=\"code\"><code>form.addEventListener('submit', (event) =&gt; {\n  event.preventDefault();  // не перезагружать страницу\n  // ...наш код\n});</code></pre><p>Объект события передаётся в функцию первым аргументом — его имя может быть любым, но принято <code>event</code> или <code>e</code>.</p><p>Подпишите форму <code>#form</code> на <code>submit</code>: отмените перезагрузку и покажите в абзаце <code>#hello</code> текст «Привет, Имя!», где имя — значение поля <code>#name</code>.</p>",
      starter: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Гостевая книга</title>\n  <style>\n    body { font-family: Arial, sans-serif; background: #f3f5fb; padding: 24px; }\n    input, textarea { display: block; width: 320px; padding: 8px; box-sizing: border-box; margin: 4px 0; }\n    button { padding: 8px 16px; border: 0; border-radius: 8px; background: #2f6fed; color: #fff; cursor: pointer; }\n    li { margin: 6px 0; }\n  </style>\n</head>\n<body>\n  <h1>Гостевая книга</h1>\n  <form id=\"form\">\n    <input type=\"text\" id=\"name\" placeholder=\"Ваше имя\">\n    <button type=\"submit\">Отправить</button>\n  </form>\n  <p id=\"hello\"></p>\n\n  <!-- Обработайте submit: preventDefault и приветствие -->\n\n</body>\n</html>",
      hint: "В обработчике сначала event.preventDefault(), затем hello.textContent = 'Привет, ' + name.value + '!';. Поля нашли заранее через querySelector.",
      tests: [
        {
          name: "submit показывает приветствие без перезагрузки",
          check: (d, w) => {
              const f = d.querySelector('#form'), n = d.querySelector('#name'), h = d.querySelector('#hello');
              if (!f || !n || !h) return 'Нужны #form, #name и #hello.';
              n.value = 'Аня';
              f.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
              return h.textContent.trim() === 'Привет, Аня!' || 'В #hello: «' + h.textContent.trim() + '», ожидалось «Привет, Аня!».';
            }
        },
        {
          name: "Используется preventDefault",
          check: (d, w, H) => /preventDefault\s*\(/.test(H.src()) || 'Отмените действие по умолчанию: event.preventDefault().'
        }
      ]
    },
    {
      id: "t2",
      title: "Очистка после отправки",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Хороший интерфейс возвращается в исходное состояние: после отправки поле очищают — <code>name.value = ''</code>. Это та же самая запись значения в <code>value</code>, только пустая строка.</p><p>Дополните обработчик <code>submit</code>: после показа приветствия поле <code>#name</code> очищается.</p>",
      starter: "@prev",
      hint: "После hello.textContent = … добавьте строку name.value = '';.",
      tests: [
        {
          name: "После отправки поле пустое",
          check: (d, w) => {
              const f = d.querySelector('#form'), n = d.querySelector('#name'), h = d.querySelector('#hello');
              if (!f || !n || !h) return 'Нужны #form, #name и #hello.';
              n.value = 'Борис';
              f.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
              return (h.textContent.trim() === 'Привет, Борис!' && n.value === '') || 'Приветствие: «' + h.textContent.trim() + '», поле после отправки: «' + n.value + '».';
            }
        }
      ]
    },
    {
      id: "t3",
      title: "Читаем event.key",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Объект события хранит данные о конкретном случае. У события <code>keydown</code> (нажата клавиша) главное свойство — <code>event.key</code>: это название клавиши строкой: <code>'a'</code>, <code>'Enter'</code>, <code>'Escape'</code>, <code>'7'</code>.</p><pre class=\"code\"><code>input.addEventListener('keydown', (event) =&gt; {\n  console.log(event.key);\n});</code></pre><p>Добавьте абзац <code>&lt;p id=\"keys\"&gt;Нажато клавиш: 0&lt;/p&gt;</code>. Подпишите поле <code>#name</code> на <code>keydown</code>: каждое нажатие увеличивает счётчик и обновляет текст абзаца.</p>",
      starter: "@prev",
      hint: "Тот же счётчик, что в ПЗ №8: let count = 0 снаружи, в обработчике count = count + 1 и вывод. Событие — 'keydown' на поле #name.",
      tests: [
        {
          name: "Счётчик клавиш растёт",
          check: (d, w) => {
              const n = d.querySelector('#name'), k = d.querySelector('#keys');
              if (!n || !k) return 'Нужны #name и #keys.';
              n.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'a', bubbles: true }));
              if (k.textContent.trim() !== 'Нажато клавиш: 1') return 'После первого нажатия: «' + k.textContent.trim() + '».';
              n.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'b', bubbles: true }));
              n.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'c', bubbles: true }));
              return k.textContent.trim() === 'Нажато клавиш: 3' || 'После трёх нажатий: «' + k.textContent.trim() + '».';
            }
        },
        {
          name: "Используется keydown",
          check: (d, w, H) => /addEventListener\s*\(\s*['"]keydown['"]/.test(H.src()) || 'Подпишитесь на \'keydown\'.'
        }
      ]
    },
    {
      id: "t4",
      title: "Escape очищает поле",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Значение <code>event.key</code> сравнивают с помощью <code>===</code>, чтобы по-разному реагировать на разные клавиши:</p><pre class=\"code\"><code>if (event.key === 'Escape') {\n  name.value = '';   // сброс поля\n}</code></pre><p>Клавиша Escape — стандарт «отмены» в интерфейсах: закрывает окна, отменяет ввод.</p><p>В обработчике <code>keydown</code> поля <code>#name</code> добавьте: если нажата <code>Escape</code> — поле очищается. Счётчик клавиш по-прежнему считает все нажатия, включая Escape.</p>",
      starter: "@prev",
      hint: "Внутри обработчика: if (event.key === 'Escape') { name.value = ''; }. Название клавиши — строка 'Escape' с большой буквы.",
      tests: [
        {
          name: "Escape очищает поле, счётчик продолжает работать",
          check: (d, w) => {
              const n = d.querySelector('#name'), k = d.querySelector('#keys');
              if (!n || !k) return 'Нужны #name и #keys.';
              n.value = 'Лишний текст';
              n.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
              if (n.value !== '') return 'После Escape поле должно быть пустым, сейчас: «' + n.value + '».';
              n.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'x', bubbles: true }));
              return k.textContent.trim() === 'Нажато клавиш: 2' || 'Счётчик после двух нажатий: «' + k.textContent.trim() + '», ожидалось «Нажато клавиш: 2».';
            }
        }
      ]
    },
    {
      id: "t5",
      title: "Делегирование: лайки",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Свойство <code>event.target</code> — элемент, по которому кликнули на самом деле. Это позволяет повесить <b>один</b> обработчик на родителя и разбирать клики внутри него — приём называется делегированием. Он незаменим, когда элементы появляются динамически:</p><pre class=\"code\"><code>posts.addEventListener('click', (event) =&gt; {\n  if (event.target.classList.contains('like')) {\n    // кликнули именно по кнопке лайка\n  }\n});</code></pre><p>Добавьте в разметку список <code>&lt;ul id=\"posts\"&gt;</code> с двумя пунктами. В каждом — текст поста и кнопка <code>&lt;button class=\"like\"&gt;Лайк (0)&lt;/button&gt;</code>. По клику на кнопку лайка число в её тексте увеличивается на 1. Клик по тексту поста ничего не делает.</p>",
      starter: "@prev",
      hint: "Один обработчик на #posts. Внутри: if (event.target.classList.contains('like')) { … }. Число из текста кнопки можно взять через parseInt(текст.match(/\\d+/)[0]).",
      tests: [
        {
          name: "Лайк увеличивается у своей кнопки",
          check: (d, w) => {
              const posts = d.querySelector('#posts');
              if (!posts) return 'Нужен список #posts.';
              const buttons = posts.querySelectorAll('.like');
              if (buttons.length < 2) return 'Нужно минимум две кнопки .like.';
              buttons[1].dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
              if (buttons[1].textContent.indexOf('1') < 0) return 'После клика по второй кнопке её текст: «' + buttons[1].textContent.trim() + '».';
              buttons[1].dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
              return buttons[1].textContent.indexOf('2') >= 0 || 'После второго клика: «' + buttons[1].textContent.trim() + '».';
            }
        },
        {
          name: "Клик по тексту поста не считается лайком",
          check: (d, w) => {
              const posts = d.querySelector('#posts');
              if (!posts) return 'Нужен список #posts.';
              const li = posts.querySelector('li');
              const before = li.querySelector('.like').textContent;
              li.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
              return li.querySelector('.like').textContent === before || 'Клик по пункту списка изменил счётчик лайка. Проверяйте event.target.';
            }
        }
      ]
    },
    {
      id: "t6",
      title: "Enter добавляет запись",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Соберём всё вместе: обработка клавиш + создание элементов. Поле «Ваша запись» (<code>&lt;input type=\"text\" id=\"entry\"&gt;</code>) должно добавлять пост в <code>#posts</code> по нажатию <b>Enter</b> (<code>event.key === 'Enter'</code>). Пустой текст (или пробелы) не добавляется, поле после добавления очищается.</p><p>Пост — просто <code>&lt;li&gt;</code> с текстом: <code>li.textContent = text; posts.append(li);</code>. Лайки на новых постах не обязательны — делегирование из прошлого задания само разберётся, если кнопку добавите, но для зачёта достаточно текста.</p>",
      starter: "@prev",
      hint: "entry.addEventListener('keydown', (event) =&gt; { if (event.key === 'Enter') { const text = entry.value.trim(); if (text !== '') { /* создать li, append, очистить */ } } });",
      tests: [
        {
          name: "Enter добавляет запись в список",
          check: (d, w) => {
              const e = d.querySelector('#entry'), posts = d.querySelector('#posts');
              if (!e || !posts) return 'Нужны #entry и #posts.';
              const before = posts.querySelectorAll('li').length;
              e.value = 'Отличная книга!';
              e.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
              const items = posts.querySelectorAll('li');
              return (items.length === before + 1 && items[items.length - 1].textContent.indexOf('Отличная книга!') >= 0) || 'После Enter записей: ' + items.length + ' (было ' + before + '), последняя: «' + (items[items.length - 1] ? items[items.length - 1].textContent.trim() : 'нет') + '».';
            }
        },
        {
          name: "Поле очищается, пробелы не добавляются",
          check: (d, w) => {
              const e = d.querySelector('#entry'), posts = d.querySelector('#posts');
              if (!e || !posts) return 'Нужны #entry и #posts.';
              e.value = '   ';
              const before = posts.querySelectorAll('li').length;
              e.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
              if (posts.querySelectorAll('li').length !== before) return 'Пустая запись добавилась.';
              e.value = 'Проверка';
              e.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
              return e.value === '' || 'После добавления поле должно очиститься.';
            }
        }
      ]
    },
    {
      id: "t7",
      title: "Итог: регистрация с проверкой",
      points: 28,
      lang: "html",
      final: true,
      variants: [
        {
          eventName: "День открытых дверей",
          ticketHint: "Номер билета (4 символа)",
          minName: 3,
          ticketLen: 4,
          okText: "Вы зарегистрированы"
        },
        {
          eventName: "Хакатон «Орбита»",
          ticketHint: "Код команды (5 символов)",
          minName: 2,
          ticketLen: 5,
          okText: "Команда принята"
        },
        {
          eventName: "Концерт студентов",
          ticketHint: "Номер места (2 символа)",
          minName: 3,
          ticketLen: 2,
          okText: "Билет подтверждён"
        },
        {
          eventName: "Квест «По следам кода»",
          ticketHint: "Ключ доступа (6 символов)",
          minName: 4,
          ticketLen: 6,
          okText: "Доступ открыт"
        },
        {
          eventName: "Ярмарка проектов",
          ticketHint: "Номер стенда (3 символа)",
          minName: 2,
          ticketLen: 3,
          okText: "Стенд закреплён"
        },
        {
          eventName: "Лекция про ИИ",
          ticketHint: "Промокод (4 символа)",
          minName: 3,
          ticketLen: 4,
          okText: "Место забронировано"
        }
      ],
      text: "<p>Соберите форму регистрации с нуля (можно в VS Code и загрузить файлом). Мероприятие вашего варианта: <b>{{eventName}}</b>.</p><p><b>Теория-подсказка.</b> План: submit → <code>preventDefault</code> → очистить старые сообщения → проверить имя (длина не меньше {{minName}}) → проверить билет (ровно {{ticketLen}} символа) → при ошибке показать текст в <code>#error</code> и выйти через <code>return</code> → при успехе поздравить и очистить форму <code>form.reset()</code>.</p><ul><li>заголовок <code>&lt;h2&gt;</code> с названием мероприятия и форма <code>&lt;form id=\"regForm\"&gt;</code>;</li><li>два текстовых поля: <code>#visitor</code> (имя) и <code>#ticket</code> (подсказка: {{ticketHint}});</li><li>абзац <code>&lt;p id=\"error\" style=\"color: #d33;\"&gt;</code> — красные сообщения об ошибках;</li><li>абзац <code>&lt;p id=\"ok\"&gt;</code> — сообщение об успехе;</li><li>имя короче {{minName}} символов → ошибка «Имя слишком короткое: минимум {{minName}} символа.»;</li><li>билет не из {{ticketLen}} символов → ошибка «Билет должен быть ровно из {{ticketLen}} символов.»;</li><li>если всё верно — «{{okText}}, Имя!» и форма очищается; перед новой проверкой старые сообщения стираются.</li></ul>",
      starter: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Регистрация</title>\n  <style>\n    body { font-family: Arial, sans-serif; background: #f3f5fb; padding: 24px; }\n    input, textarea { display: block; width: 320px; padding: 8px; box-sizing: border-box; margin: 4px 0; }\n    button { padding: 8px 16px; border: 0; border-radius: 8px; background: #2f6fed; color: #fff; cursor: pointer; }\n    li { margin: 6px 0; }\n  </style>\n</head>\n<body>\n  <h1>Гостевая книга</h1>\n  <!-- Соберите форму: h2, form#regForm, #visitor, #ticket, p#error, p#ok -->\n\n</body>\n</html>",
      hint: "Каркас: regForm.addEventListener('submit', (event) =&gt; { event.preventDefault(); error.textContent = ''; ok.textContent = ''; const name = visitor.value.trim(); if (name.length &lt; {{minName}}) { error.textContent = '…'; return; } if (ticket.value.trim().length !== {{ticketLen}}) { error.textContent = '…'; return; } ok.textContent = '{{okText}}, ' + name + '!'; regForm.reset(); });",
      tests: [
        {
          name: "Есть форма и поля",
          check: (d) => !!(d.querySelector('#regForm') && d.querySelector('#visitor') && d.querySelector('#ticket')) || 'Нужны #regForm, #visitor и #ticket.'
        },
        {
          name: "Короткое имя — ошибка",
          check: (d, w, H) => {
              const f = d.querySelector('#regForm'), n = d.querySelector('#visitor'), t = d.querySelector('#ticket'), e = d.querySelector('#error');
              if (!f || !n || !t || !e) return 'Нужны #regForm, #visitor, #ticket и #error.';
              n.value = 'Я';
              t.value = '1234567'.slice(0, +H.v.ticketLen);
              f.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
              return e.textContent.trim() !== '' || 'При коротком имени должно быть сообщение об ошибке.';
            }
        },
        {
          name: "Неверный билет — ошибка",
          check: (d, w, H) => {
              const f = d.querySelector('#regForm'), n = d.querySelector('#visitor'), t = d.querySelector('#ticket'), e = d.querySelector('#error');
              if (!f || !n || !t || !e) return 'Нужны #regForm, #visitor, #ticket и #error.';
              n.value = 'Мария';
              t.value = '12345678'.slice(0, +H.v.ticketLen + 1);
              f.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
              return e.textContent.trim() !== '' || 'При билете не из ' + H.v.ticketLen + ' символов должна быть ошибка.';
            }
        },
        {
          name: "Всё верно — успех и очистка формы",
          check: (d, w, H) => {
              const f = d.querySelector('#regForm'), n = d.querySelector('#visitor'), t = d.querySelector('#ticket'), e = d.querySelector('#error'), ok = d.querySelector('#ok');
              if (!f || !n || !t || !e || !ok) return 'Нужны #regForm, #visitor, #ticket, #error и #ok.';
              n.value = 'Мария';
              t.value = '12345678'.slice(0, +H.v.ticketLen);
              f.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
              if (e.textContent.trim() !== '') return 'При верных данных ошибка не должна показываться: «' + e.textContent.trim() + '».';
              return (ok.textContent.indexOf('Мария') >= 0 && n.value === '') || 'Ожидалось приветствие с именем и пустое поле имени. Сейчас: «' + ok.textContent.trim() + '», поле: «' + n.value + '».';
            }
        },
        {
          name: "Старые сообщения стираются перед проверкой",
          check: (d, w, H) => {
              const f = d.querySelector('#regForm'), n = d.querySelector('#visitor'), t = d.querySelector('#ticket'), e = d.querySelector('#error'), ok = d.querySelector('#ok');
              if (!f || !n || !t || !e || !ok) return 'Нужны #regForm, #visitor, #ticket, #error и #ok.';
              n.value = 'Я';
              t.value = '12';
              f.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
              n.value = 'Мария';
              t.value = '12345678'.slice(0, +H.v.ticketLen);
              f.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
              return e.textContent.trim() === '' || 'Старая ошибка осталась на экране после успешной отправки.';
            }
        }
      ]
    }
  ]
};
