/* Собрано из исходников платформы (node build.mjs site). Эталонные решения хранятся в Google Таблице. */
window.ORBITA.lessons['pz-13'] = {
  type: "practice",
  intro: "<p>До сих пор данные жили прямо в коде. Настоящие сайты получают их извне: из файлов или с серверов — списки товаров, посты, погоду. Инструмент для этого — функция <code>fetch()</code>: она отправляет запрос по адресу (URL) и возвращает ответ.</p><p>Наши учебные данные лежат в файлах рядом с платформой: <code>data/posts.json</code> (100 постов), <code>data/users.json</code> (10 пользователей), <code>data/comments.json</code> (комментарии). Формат JSON — тот же, что присылают настоящие серверы, поэтому всё, что вы сегодня напишете, сработает и с сетевым адресом вида <code>https://…</code>.</p><p>Интернет для этой практики <b>не нужен</b> — всё загружается с самой платформы.</p>",
  tasks: [
    {
      id: "t1",
      title: "Первый запрос",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Функция <code>fetch(адрес)</code> запрашивает данные по адресу. Она <b>асинхронная</b>: не ждёт ответ, а возвращает объект Promise — «обещание» ответа. Чтобы получить сам ответ, используют <code>await</code> внутри функции, помеченной словом <code>async</code>:</p><pre class=\"code\"><code>async function load() {\n  const response = await fetch('data/posts.json');\n  const data = await response.json();  // разобрать ответ как JSON\n  console.log(data.length);            // 100 — столько постов в файле\n}\nload();</code></pre><p>Ответ в два шага: <code>await fetch(...)</code> даёт объект ответа, а <code>await response.json()</code> превращает тело ответа в обычный массив или объект JavaScript. Команда <code>load()</code> в конце запускает функцию — без неё ничего не произойдёт.</p><p>Сделайте первый запрос: напишите async-функцию <code>load</code>, загрузите <code>data/posts.json</code> и выведите в консоль строку «Постов: 100» (число — из <code>data.length</code>). Не забудьте вызвать <code>load()</code>.</p>",
      starter: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Посты из сети</title>\n  <style>\n    body { font-family: Arial, sans-serif; background: #f3f5fb; padding: 24px; }\n    button { padding: 8px 16px; border: 0; border-radius: 8px; background: #2f6fed; color: #fff; cursor: pointer; }\n    li { margin: 6px 0; }\n    #loading { color: #777; }\n    #error { color: #d33; }\n  </style>\n</head>\n<body>\n  <h1>Посты из сети</h1>\n  <ul id=\"posts\"></ul>\n\n  <!-- Напишите async-функцию load: fetch → response.json() → console.log -->\n\n</body>\n</html>",
      hint: "async function load() { const response = await fetch('data/posts.json'); const data = await response.json(); console.log('Постов: ' + data.length); } load();",
      tests: [
        {
          name: "В консоли появилось «Постов: 100»",
          check: async (d, w, H) => {
              const deadline = Date.now() + 3000;
              while (Date.now() < deadline) {
                const logs = H.logs().map(s => String(s));
                if (logs.some(s => /Постов:\s*100/.test(s))) return true;
                await new Promise(r => setTimeout(r, 150));
              }
              return 'В консоли не нашли «Постов: 100». Проверьте: fetch → await response.json() → console.log, и что load() вызвана.';
            }
        },
        {
          name: "Используется fetch и await",
          check: (d, w, H) => (/fetch\s*\(/.test(H.src()) && /await/.test(H.src())) || 'Нужны fetch(...) и await — без них запрос не выполнится.'
        }
      ]
    },
    {
      id: "t2",
      title: "Проверяем ответ и ловим ошибки",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Сервер не всегда отвечает удачей: файл мог переехать, сеть упасть. Ответ несёт свойство <code>ok</code> — <code>true</code>, если код состояния 200–299 (успех). Принято его проверять и при неудаче «бросать» ошибку через <code>throw</code>:</p><pre class=\"code\"><code>if (!response.ok) {\n  throw new Error('Ответ сервера: ' + response.status);\n}</code></pre><p>Брошенная ошибка ловится конструкцией <code>try { ... } catch (error) { ... }</code>: код в <code>try</code> выполняется как обычно, а если внутри случилась ошибка — управление переходит в <code>catch</code>, и программа не падает:</p><pre class=\"code\"><code>try {\n  const response = await fetch(url);\n  if (!response.ok) { throw new Error('bad'); }\n  // ...работаем с данными\n} catch (error) {\n  console.log('Ошибка загрузки');\n}</code></pre><p>Оберните тело функции <code>load</code> в <code>try/catch</code>: после fetch проверьте <code>response.ok</code> и при проблеме бросьте ошибку, в <code>catch</code> выводите в консоль «Ошибка загрузки». Успешный сценарий работает как раньше.</p>",
      starter: "@prev",
      hint: "try { ...старый код, но с if (!response.ok) { throw new Error(...); } после fetch... } catch (error) { console.log('Ошибка загрузки'); }",
      tests: [
        {
          name: "Проверяется response.ok",
          check: (d, w, H) => /response\.ok/.test(H.src()) || 'Добавьте проверку: if (!response.ok) { throw new Error(...); }.'
        },
        {
          name: "Есть try и catch",
          check: (d, w, H) => (/try\s*\{/.test(H.src()) && /catch\s*\(/.test(H.src())) || 'Оберните запрос в try { ... } catch (error) { ... }.'
        },
        {
          name: "Успешный запрос по-прежнему работает",
          check: async (d, w, H) => {
              const deadline = Date.now() + 3000;
              while (Date.now() < deadline) {
                const logs = H.logs().map(s => String(s));
                if (logs.some(s => /Постов:\s*100/.test(s))) return true;
                await new Promise(r => setTimeout(r, 150));
              }
              return '«Постов: 100» не появилось — проверка response.ok не должна мешать успешной загрузке.';
            }
        }
      ]
    },
    {
      id: "t3",
      title: "Показываем посты на странице",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Данные из JSON — это массив обычных объектов. У поста есть поля <code>title</code> (заголовок), <code>body</code> (текст), <code>id</code>. Вывести их на страницу — значит пройти по массиву циклом <code>for...of</code> и создать элементы, как в ПЗ №9:</p><pre class=\"code\"><code>for (const post of data) {\n  const li = document.createElement('li');\n  li.textContent = post.title;\n  posts.append(li);\n}</code></pre><p>Список <code>&lt;ul id=\"posts\"&gt;</code> уже есть в разметке. После <code>console.log</code> добавьте цикл: каждый пост превращается в <code>&lt;li&gt;</code> с его заголовком, пункты добавляются в <code>#posts</code>.</p>",
      starter: "@prev",
      hint: "Найдите список: const posts = document.querySelector('#posts'); — лучше в начале script. После console.log: for (const post of data) { const li = document.createElement('li'); li.textContent = post.title; posts.append(li); }",
      tests: [
        {
          name: "В списке появились посты (около 100)",
          check: async (d, w) => {
              const deadline = Date.now() + 3000;
              while (Date.now() < deadline) {
                const n = d.querySelectorAll('#posts li').length;
                if (n >= 90) return true;
                await new Promise(r => setTimeout(r, 150));
              }
              return 'В #posts меньше 90 пунктов. Цикл for...of по data создаёт li из post.title.';
            }
        },
        {
          name: "Пункты не пустые",
          check: async (d) => {
              const deadline = Date.now() + 3000;
              while (Date.now() < deadline) {
                const items = d.querySelectorAll('#posts li');
                if (items.length >= 90 && items[0].textContent.trim().length > 5) return true;
                await new Promise(r => setTimeout(r, 150));
              }
              return 'Первый пункт пустой или слишком короткий — выводите post.title.';
            }
        }
      ]
    },
    {
      id: "t4",
      title: "Загрузка по кнопке",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Запрос не обязан идти сразу при открытии страницы — его можно привязать к клику. Обработчик тоже может быть <code>async</code>: поставьте <code>async</code> перед стрелкой, и внутри доступен <code>await</code>.</p><p>Второй файл данных: <code>data/users.json</code> — список пользователей, у каждого есть поле <code>email</code>.</p><pre class=\"code\"><code>button.addEventListener('click', async () =&gt; {\n  const response = await fetch('data/users.json');\n  const data = await response.json();\n  // ...показать данные\n});</code></pre><p>Добавьте в разметку кнопку <code>&lt;button id=\"loadUsers\"&gt;Загрузить пользователей&lt;/button&gt;</code> и список <code>&lt;ul id=\"users\"&gt;</code>. По клику загружайте пользователей и выводите email каждого отдельным <code>&lt;li&gt;</code> в <code>#users</code>.</p>",
      starter: "@prev",
      hint: "loadUsers.addEventListener('click', async () =&gt; { const response = await fetch('data/users.json'); const data = await response.json(); for (const user of data) { const li = document.createElement('li'); li.textContent = user.email; users.append(li); } });",
      tests: [
        {
          name: "Клик загружает email-адреса",
          check: async (d, w) => {
              const b = d.querySelector('#loadUsers'), ul = d.querySelector('#users');
              if (!b || !ul) return 'Нужны кнопка #loadUsers и список #users.';
              b.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
              const deadline = Date.now() + 3000;
              while (Date.now() < deadline) {
                const items = [].map.call(ul.querySelectorAll('li'), li => li.textContent);
                if (items.filter(t => t.indexOf('@') >= 0).length >= 5) return true;
                await new Promise(r => setTimeout(r, 150));
              }
              return 'После клика в #users меньше 5 пунктов с символом @. Выводите user.email.';
            }
        },
        {
          name: "Запрос идёт к users.json",
          check: (d, w, H) => /data\/users\.json/.test(H.src()) || 'Запрос должен идти к data/users.json.'
        }
      ]
    },
    {
      id: "t5",
      title: "Индикатор загрузки",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Пока данные едут (пусть даже из соседнего файла — сеть или диск могут подтормаживать), пользователь должен видеть, что процесс идёт, — иначе кажется, что кнопка «сломалась». Паттерн простой:</p><pre class=\"code\"><code>loading.style.display = 'block';   // 1. показать перед fetch\nconst response = await fetch(url);   // 2. ждём\n// ...показать данные\nloading.style.display = 'none';    // 3. скрыть после</code></pre><p>Добавьте абзац <code>&lt;p id=\"loading\" style=\"display: none;\"&gt;Загружаю…&lt;/p&gt;</code> — сразу после кнопки. В обработчике клика показывайте его перед запросом и скрывайте, когда email выведены. До клика индикатор не виден.</p>",
      starter: "@prev",
      hint: "В начале обработчика: loading.style.display = 'block'; в конце (после цикла): loading.style.display = 'none';. Элемент: document.querySelector('#loading').",
      tests: [
        {
          name: "До клика индикатор скрыт",
          check: (d) => {
              const l = d.querySelector('#loading');
              if (!l) return 'Нужен абзац #loading.';
              return l.style.display === 'none' || 'Индикатор виден до загрузки. Начальное состояние: style="display: none;".';
            }
        },
        {
          name: "После загрузки индикатор снова скрыт",
          check: async (d, w) => {
              const b = d.querySelector('#loadUsers'), ul = d.querySelector('#users'), l = d.querySelector('#loading');
              if (!b || !ul || !l) return 'Нужны #loadUsers, #users и #loading.';
              b.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
              const deadline = Date.now() + 3000;
              while (Date.now() < deadline) {
                if (ul.querySelectorAll('li').length >= 5) break;
                await new Promise(r => setTimeout(r, 150));
              }
              await new Promise(r => setTimeout(r, 100));
              return ul.querySelectorAll('li').length >= 5
                ? (l.style.display === 'none' || 'После загрузки индикатор должен скрыться: loading.style.display = \'none\'.')
                : 'Email не загрузились — проверьте запрос из прошлого задания.';
            }
        }
      ]
    },
    {
      id: "t6",
      title: "Сообщение об ошибке",
      points: 12,
      lang: "html",
      text: "<p><b>Теория.</b> Финальный шаблон надёжной загрузки собирает всё вместе:</p><pre class=\"code\"><code>loading.style.display = 'block';\ntry {\n  const response = await fetch(url);\n  if (!response.ok) { throw new Error('bad'); }\n  const data = await response.json();\n  // ...показать данные\n} catch (e) {\n  error.textContent = 'Не удалось загрузить';\n}\nloading.style.display = 'none';</code></pre><p>Обратите внимание: <code>response.ok</code> будет <code>false</code>, если адрес не найден (код 404) — поэтому throw обязателен, иначе catch не сработает.</p><p>Добавьте красный абзац <code>&lt;p id=\"error\"&gt;</code> (цвет уже задан в стилях). Затем — вторую кнопку <code>&lt;button id=\"checkError\"&gt;Проверить ошибку&lt;/button&gt;</code>: она запрашивает несуществующий файл <code>data/nothere.json</code> в try/catch, и при ошибке выводит в <code>#error</code> текст «Не удалось загрузить».</p>",
      starter: "@prev",
      hint: "checkError.addEventListener('click', async () =&gt; { try { const response = await fetch('data/nothere.json'); if (!response.ok) { throw new Error('bad'); } } catch (e) { error.textContent = 'Не удалось загрузить'; } });",
      tests: [
        {
          name: "Ошибка показывается в #error",
          check: async (d, w) => {
              const b = d.querySelector('#checkError'), e = d.querySelector('#error');
              if (!b || !e) return 'Нужны кнопка #checkError и абзац #error.';
              b.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
              const deadline = Date.now() + 3000;
              while (Date.now() < deadline) {
                if (e.textContent.indexOf('Не удалось загрузить') >= 0) return true;
                await new Promise(r => setTimeout(r, 150));
              }
              return 'В #error нет «Не удалось загрузить». Нужны try/catch и throw при !response.ok.';
            }
        },
        {
          name: "Запрос идёт к несуществующему файлу",
          check: (d, w, H) => /data\/nothere\.json/.test(H.src()) || 'Адрес для проверки ошибки: data/nothere.json.'
        }
      ]
    },
    {
      id: "t7",
      title: "Итог: страница загрузки",
      points: 28,
      lang: "html",
      final: true,
      variants: [
        {
          resource: "posts",
          count: 5,
          title: "Последние посты",
          field: "post.title"
        },
        {
          resource: "users",
          count: 6,
          title: "Пользователи сайта",
          field: "user.email"
        },
        {
          resource: "comments",
          count: 4,
          title: "Свежие комментарии",
          field: "comment.name"
        },
        {
          resource: "posts",
          count: 8,
          title: "Посты недели",
          field: "post.title"
        },
        {
          resource: "users",
          count: 4,
          title: "Наша команда",
          field: "user.email"
        },
        {
          resource: "comments",
          count: 6,
          title: "Отзывы",
          field: "comment.name"
        }
      ],
      text: "<p>Соберите страницу загрузки данных с нуля (можно в VS Code и загрузить файлом). Ресурс вашего варианта: <b>{{title}}</b>.</p><p><b>Теория-подсказка.</b> Файл может быть больше, чем нужно: выберите первые N записей методом <code>data.slice(0, N)</code> — он возвращает кусок массива от 0 до N, не меняя исходный. План обработчика клика: очистить старые данные и сообщение об ошибке → показать «Загружаю…» → try: fetch <code>data/{{resource}}.json</code>, проверить <code>ok</code>, вывести {{count}} пунктов (<code>data.slice(0, {{count}})</code>, поле: <code>{{field}}</code>) → catch: «Не удалось загрузить» → в любом случае скрыть индикатор.</p><ul><li>заголовок <code>&lt;h2&gt;</code> с названием «{{title}}»;</li><li>кнопка <code>&lt;button id=\"load\"&gt;Загрузить&lt;/button&gt;</code>;</li><li>индикатор <code>&lt;p id=\"loading\" style=\"display: none;\"&gt;Загружаю…&lt;/p&gt;</code>;</li><li>абзац <code>&lt;p id=\"error\" style=\"color: #d33;\"&gt;</code> для сообщения об ошибке;</li><li>список <code>&lt;ul id=\"list\"&gt;</code> — сюда попадают {{count}} пунктов после клика;</li><li>повторный клик не дублирует список — перед загрузкой старые пункты стираются (<code>list.innerHTML = ''</code>).</li></ul>",
      starter: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>{{title}}</title>\n  <style>\n    body { font-family: Arial, sans-serif; background: #f3f5fb; padding: 24px; }\n    button { padding: 8px 16px; border: 0; border-radius: 8px; background: #2f6fed; color: #fff; cursor: pointer; }\n    li { margin: 6px 0; }\n    #loading { color: #777; }\n    #error { color: #d33; }\n  </style>\n</head>\n<body>\n  <h1>Посты из сети</h1>\n  <!-- Соберите страницу: h2, button#load, p#loading, p#error, ul#list -->\n\n</body>\n</html>",
      hint: "Каркас обработчика: error.textContent = ''; list.innerHTML = ''; loading.style.display = 'block'; try { const response = await fetch('data/ВАШ_РЕСУРС.json'); if (!response.ok) { throw new Error('bad'); } const data = await response.json(); for (const item of data.slice(0, ЧИСЛО)) { /* li + нужное поле + append */ } } catch (e) { error.textContent = 'Не удалось загрузить'; } loading.style.display = 'none';",
      tests: [
        {
          name: "Есть все элементы",
          check: (d) => !!(d.querySelector('#load') && d.querySelector('#loading') && d.querySelector('#error') && d.querySelector('#list')) || 'Нужны #load, #loading, #error и #list.'
        },
        {
          name: "До клика индикатор скрыт и список пуст",
          check: (d) => {
              const l = d.querySelector('#loading'), list = d.querySelector('#list');
              if (!l || !list) return 'Нужны #loading и #list.';
              return (l.style.display === 'none' && list.querySelectorAll('li').length === 0) || 'Начальное состояние: индикатор скрыт, список пуст.';
            }
        },
        {
          name: "После клика в списке нужное число пунктов",
          check: async (d, w, H) => {
              const b = d.querySelector('#load'), list = d.querySelector('#list');
              if (!b || !list) return 'Нужны #load и #list.';
              b.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
              const deadline = Date.now() + 3000, need = +H.v.count;
              while (Date.now() < deadline) {
                if (list.querySelectorAll('li').length === need) return true;
                await new Promise(r => setTimeout(r, 150));
              }
              return 'В #list пунктов: ' + list.querySelectorAll('li').length + ', ожидалось ' + need + '. Файл: data/' + H.v.resource + '.json, выводите data.slice(0, ' + need + ').';
            }
        },
        {
          name: "Пункты не пустые, индикатор скрыт после загрузки",
          check: async (d, w, H) => {
              const b = d.querySelector('#load'), list = d.querySelector('#list'), l = d.querySelector('#loading');
              if (!b || !list || !l) return 'Нужны #load, #list и #loading.';
              b.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
              const deadline = Date.now() + 3000, need = +H.v.count;
              while (Date.now() < deadline) {
                if (list.querySelectorAll('li').length === need) break;
                await new Promise(r => setTimeout(r, 150));
              }
              await new Promise(r => setTimeout(r, 100));
              const items = [].map.call(list.querySelectorAll('li'), li => li.textContent.trim());
              if (items.length !== need) return 'Загрузилось пунктов: ' + items.length + ' из ' + need + '.';
              if (items.some(t => t.length < 3)) return 'Есть пустые пункты — выводите поле записи (' + H.v.field + ').';
              return l.style.display === 'none' || 'После загрузки индикатор должен скрыться.';
            }
        },
        {
          name: "Повторный клик не дублирует список",
          check: async (d, w, H) => {
              const b = d.querySelector('#load'), list = d.querySelector('#list');
              if (!b || !list) return 'Нужны #load и #list.';
              const need = +H.v.count;
              const waitItems = async () => {
                const deadline = Date.now() + 3000;
                while (Date.now() < deadline) {
                  if (list.querySelectorAll('li').length === need) return true;
                  await new Promise(r => setTimeout(r, 150));
                }
                return false;
              };
              b.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
              if (!await waitItems()) return 'Первый клик не загрузил ' + need + ' пунктов.';
              await new Promise(r => setTimeout(r, 100));
              b.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
              if (!await waitItems()) return 'После повторного клика пунктов ' + list.querySelectorAll('li').length + ' вместо ' + need + '.';
              await new Promise(r => setTimeout(r, 100));
              return list.querySelectorAll('li').length === need || 'После второго клика пунктов: ' + list.querySelectorAll('li').length + ' вместо ' + need + '. Перед загрузкой очищайте список: list.innerHTML = \'\'.';
            }
        }
      ]
    }
  ]
};
