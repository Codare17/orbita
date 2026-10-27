/* Собрано из исходников платформы (node build.mjs site). Эталонные решения хранятся в Google Таблице. */
window.ORBITA.lessons['pz-01'] = {
  type: "practice",
  intro: "<p>Форма — это то, через что пользователь «разговаривает» с сайтом: регистрация, поиск, заказ. Сегодня шаг за шагом соберём анкету записи в IT-клуб, а в конце сделаете свою форму с нуля.</p><p>Каждое задание проверяется автоматически. Подсказка снижает баллы за задание на 30%, просмотр решения — до нуля.</p>",
  tasks: [
    {
      id: "t1",
      title: "Первая форма",
      points: 10,
      lang: "html",
      text: "<p>Внутри <code>&lt;body&gt;</code> создайте форму <code>&lt;form&gt;</code>. В ней должны быть:</p><ul><li>текстовое поле <code>&lt;input type=\"text\" name=\"fullname\"&gt;</code>;</li><li>кнопка <code>&lt;button type=\"submit\"&gt;</code> с текстом «Отправить».</li></ul>",
      starter: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Запись в клуб</title>\n</head>\n<body>\n  <h1>Запись в IT-клуб</h1>\n  <!-- Создайте форму здесь -->\n\n</body>\n</html>",
      hint: "Форма — парный тег: всё содержимое пишется между <code>&lt;form&gt;</code> и <code>&lt;/form&gt;</code>. У <code>input</code> закрывающего тега нет.",
      tests: [
        {
          name: "На странице есть форма <form>",
          check: (d) => !!d.querySelector('form') || 'Не нашли тег <form>.'
        },
        {
          name: "В форме есть текстовое поле с name=\"fullname\"",
          check: (d) => {
              const el = d.querySelector('form input[name="fullname"]');
              if (!el) return 'Нужен <input name="fullname"> внутри <form>.';
              return el.type === 'text' || 'Тип поля должен быть text.';
            }
        },
        {
          name: "В форме есть кнопка «Отправить»",
          check: (d, w, H) => {
              const b = d.querySelector('form button, form input[type="submit"]');
              if (!b) return 'Добавьте <button> внутрь формы.';
              return /отправить/i.test(b.tagName === 'INPUT' ? b.value : H.text(b)) || 'Текст на кнопке должен быть «Отправить».';
            }
        }
      ]
    },
    {
      id: "t2",
      title: "Подписи к полям",
      points: 10,
      lang: "html",
      text: "<p>Поле без подписи непонятно, особенно для незрячих пользователей с экранным диктором.</p><ul><li>Добавьте полю <code>fullname</code> атрибут <code>id=\"fullname\"</code>.</li><li>Перед полем поставьте <code>&lt;label for=\"fullname\"&gt;ФИО&lt;/label&gt;</code>.</li><li>Добавьте полю подсказку <code>placeholder=\"Иванов Иван\"</code>.</li></ul><p>Проверьте: клик по слову «ФИО» в результате ставит курсор в поле.</p>",
      starter: "@prev",
      hint: "Значение <code>for</code> у label должно совпадать с <code>id</code> поля буква в букву.",
      tests: [
        {
          name: "У поля fullname есть id",
          check: (d) => { const el = d.querySelector('input[name="fullname"]'); return !!(el && el.id) || 'Добавьте полю атрибут id.'; }
        },
        {
          name: "Поле fullname связано с подписью <label>",
          check: (d, w, H) => H.labeled(d.querySelector('input[name="fullname"]')) || 'Не нашли <label>, у которого for совпадает с id поля.'
        },
        {
          name: "У поля есть placeholder",
          check: (d) => { const el = d.querySelector('input[name="fullname"]'); return !!(el && el.placeholder.trim()) || 'Добавьте атрибут placeholder.'; }
        }
      ]
    },
    {
      id: "t3",
      title: "Почта и телефон",
      points: 10,
      lang: "html",
      text: "<p>Добавьте в форму перед кнопкой ещё два поля, каждое со своей подписью:</p><ul><li>почта: <code>type=\"email\"</code>, <code>name=\"email\"</code>, обязательное — атрибут <code>required</code>;</li><li>телефон: <code>type=\"tel\"</code>, <code>name=\"phone\"</code>, placeholder в формате <code>+7 (999) 123-45-67</code>.</li></ul><p>Попробуйте нажать «Отправить» с пустой почтой: браузер сам покажет ошибку.</p>",
      starter: "@prev",
      hint: "Скопируйте пару label + input из прошлого задания и поменяйте type, name, id и for.",
      tests: [
        {
          name: "Есть поле type=\"email\" с name=\"email\"",
          check: (d) => { const el = d.querySelector('form input[name="email"]'); return (el && el.type === 'email') || 'Нужен <input type="email" name="email">.'; }
        },
        {
          name: "Почта обязательна (required)",
          check: (d) => { const el = d.querySelector('input[name="email"]'); return !!(el && el.required) || 'Добавьте полю почты атрибут required.'; }
        },
        {
          name: "Есть поле type=\"tel\" с name=\"phone\"",
          check: (d) => { const el = d.querySelector('form input[name="phone"]'); return (el && el.type === 'tel') || 'Нужен <input type="tel" name="phone">.'; }
        },
        {
          name: "У всех полей есть подписи",
          check: (d, w, H) => {
    const bad = Array.from(d.querySelectorAll('form input, form select, form textarea'))
      .filter(el => !/^(hidden|submit|button|reset|image)$/.test(el.type))
      .find(el => !H.labeled(el));
    return !bad || 'Нет подписи у поля ' + (bad.name ? 'name="' + bad.name + '"' : '<' + bad.tagName.toLowerCase() + '>') + '. Свяжите <label for="…"> с id поля или оберните поле в <label>.';
  }
        }
      ]
    },
    {
      id: "t4",
      title: "Выбор группы",
      points: 10,
      lang: "html",
      text: "<p>Добавьте выпадающий список <code>&lt;select name=\"group\"&gt;</code> с подписью «Группа».</p><ul><li>Первый пункт — «Выберите группу», его нельзя выбрать: <code>value=\"\" disabled selected</code>.</li><li>Дальше пункты: КСК114, КСК114д, КСК134, КСК154.</li></ul>",
      starter: "@prev",
      hint: "Каждый пункт списка — отдельный тег <code>&lt;option&gt;</code> внутри <code>&lt;select&gt;</code>.",
      tests: [
        {
          name: "Есть список <select name=\"group\">",
          check: (d) => !!d.querySelector('form select[name="group"]') || 'Нужен <select name="group"> внутри формы.'
        },
        {
          name: "В списке есть все четыре группы",
          check: (d, w, H) => {
              const s = d.querySelector('select[name="group"]');
              if (!s) return 'Сначала создайте список.';
              const texts = Array.from(s.options).map(o => H.text(o));
              const miss = ['КСК114', 'КСК114д', 'КСК134', 'КСК154'].filter(g => !texts.includes(g));
              return !miss.length || 'Не хватает пунктов: ' + miss.join(', ');
            }
        },
        {
          name: "Первый пункт — неактивная подсказка",
          check: (d) => {
              const s = d.querySelector('select[name="group"]');
              const o = s && s.options[0];
              return !!(o && o.disabled && o.value === '') || 'У первого <option> должны быть value="" и disabled.';
            }
        },
        {
          name: "У списка есть подпись",
          check: (d, w, H) => H.labeled(d.querySelector('select[name="group"]')) || 'Свяжите <label for="group"> со списком через id.'
        }
      ]
    },
    {
      id: "t5",
      title: "Переключатели и флажок",
      points: 10,
      lang: "html",
      text: "<p>Добавьте выбор формата участия и согласие с правилами:</p><ul><li>два переключателя <code>type=\"radio\"</code> с одинаковым <code>name=\"format\"</code>: «Очно» и «Онлайн»;</li><li>флажок <code>type=\"checkbox\"</code>, <code>name=\"agree\"</code>, обязательный, с текстом «Согласен с правилами клуба».</li></ul><p>Удобный приём: оберните поле в label, тогда <code>for</code> и <code>id</code> не нужны: <code>&lt;label&gt;&lt;input type=\"radio\" …&gt; Очно&lt;/label&gt;</code>.</p>",
      starter: "@prev",
      hint: "Переключатели связаны в группу одинаковым <code>name</code>. Тогда можно выбрать только один из них.",
      tests: [
        {
          name: "Есть два переключателя с name=\"format\"",
          check: (d) => d.querySelectorAll('form input[type="radio"][name="format"]').length >= 2 || 'Нужно минимум два <input type="radio" name="format">.'
        },
        {
          name: "У переключателей разные value",
          check: (d) => { const v = Array.from(d.querySelectorAll('input[type="radio"][name="format"]')).map(r => r.getAttribute('value')); return (v.length >= 2 && v.every(Boolean) && new Set(v).size === v.length) || 'Задайте каждому переключателю свой value.'; }
        },
        {
          name: "Флажок agree обязателен",
          check: (d) => { const c = d.querySelector('form input[type="checkbox"][name="agree"]'); if (!c) return 'Нужен <input type="checkbox" name="agree">.'; return c.required || 'Добавьте флажку атрибут required.'; }
        },
        {
          name: "У всех полей есть подписи",
          check: (d, w, H) => {
    const bad = Array.from(d.querySelectorAll('form input, form select, form textarea'))
      .filter(el => !/^(hidden|submit|button|reset|image)$/.test(el.type))
      .find(el => !H.labeled(el));
    return !bad || 'Нет подписи у поля ' + (bad.name ? 'name="' + bad.name + '"' : '<' + bad.tagName.toLowerCase() + '>') + '. Свяжите <label for="…"> с id поля или оберните поле в <label>.';
  }
        }
      ]
    },
    {
      id: "t6",
      title: "Текст о себе и группировка",
      points: 10,
      lang: "html",
      text: "<ul><li>Добавьте многострочное поле <code>&lt;textarea name=\"about\" rows=\"4\"&gt;</code> с подписью «О себе».</li><li>Оберните поля почты и телефона в <code>&lt;fieldset&gt;</code> с заголовком <code>&lt;legend&gt;Контакты&lt;/legend&gt;</code>.</li></ul>",
      starter: "@prev",
      hint: "<code>&lt;legend&gt;</code> должен быть первым тегом внутри <code>&lt;fieldset&gt;</code>.",
      tests: [
        {
          name: "Есть поле <textarea name=\"about\">",
          check: (d) => !!d.querySelector('form textarea[name="about"]') || 'Добавьте <textarea name="about">.'
        },
        {
          name: "В поле минимум 3 строки (rows)",
          check: (d) => { const t = d.querySelector('textarea[name="about"]'); return !!(t && t.rows >= 3) || 'Укажите атрибут rows="4".'; }
        },
        {
          name: "Есть <fieldset> с заголовком <legend>",
          check: (d, w, H) => { const l = d.querySelector('form fieldset > legend'); return !!(l && H.text(l)) || 'Внутри <fieldset> нужен <legend> с текстом.'; }
        },
        {
          name: "Почта и телефон внутри fieldset",
          check: (d) => !!(d.querySelector('fieldset input[name="email"]') && d.querySelector('fieldset input[name="phone"]')) || 'Переместите поля почты и телефона внутрь <fieldset>.'
        },
        {
          name: "У всех полей есть подписи",
          check: (d, w, H) => {
    const bad = Array.from(d.querySelectorAll('form input, form select, form textarea'))
      .filter(el => !/^(hidden|submit|button|reset|image)$/.test(el.type))
      .find(el => !H.labeled(el));
    return !bad || 'Нет подписи у поля ' + (bad.name ? 'name="' + bad.name + '"' : '<' + bad.tagName.toLowerCase() + '>') + '. Свяжите <label for="…"> с id поля или оберните поле в <label>.';
  }
        }
      ]
    },
    {
      id: "t7",
      title: "Оформление формы",
      points: 15,
      lang: "html",
      text: "<p>Добавьте в <code>&lt;head&gt;</code> блок <code>&lt;style&gt;</code> и оформите форму:</p><ul><li>ширина формы не больше 500 px — свойство <code>max-width</code>;</li><li>текстовые поля, список и textarea занимают всю ширину формы: <code>display: block; width: 100%</code>;</li><li>у кнопки свой цвет фона и скруглённые углы: <code>background</code>, <code>border-radius</code>.</li></ul>",
      starter: "@prev",
      hint: "Чтобы поле с <code>width: 100%</code> и отступами не вылезало за край, добавьте <code>box-sizing: border-box</code>.",
      tests: [
        {
          name: "Ширина формы не больше 500 px",
          check: (d) => { const f = d.querySelector('form'); return !!(f && f.getBoundingClientRect().width <= 500) || 'Сейчас форма шире 500 px. Задайте ей max-width.'; }
        },
        {
          name: "Поле ФИО растянуто на ширину формы",
          check: (d) => {
              const f = d.querySelector('form'), i = d.querySelector('input[name="fullname"]');
              if (!f || !i) return 'Не нашли форму или поле fullname.';
              const cs = getComputedStyle(f);
              const inner = f.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
              return i.getBoundingClientRect().width >= inner * 0.9 || 'Поле должно занимать всю ширину формы (width: 100%).';
            }
        },
        {
          name: "Форма одна, кнопка отправки внутри неё",
          check: (d) => {
              const forms = d.querySelectorAll('form').length;
              if (forms > 1) return 'На странице ' + forms + ' тега <form>. Все поля и кнопка должны быть в одной форме: удалите лишние <form> и </form>.';
              if (!d.querySelector('button, input[type="submit"]')) return 'Не нашли кнопку <button>.';
              return !!d.querySelector('form button, form input[type="submit"]') || 'Кнопка стоит вне формы. Перенесите <button> внутрь, перед </form>.';
            }
        },
        {
          name: "У кнопки свой цвет фона",
          check: (d, w, H) => {
              const b = d.querySelector('form button, form input[type="submit"]') || d.querySelector('button, input[type="submit"]');
              if (!b) return 'Не нашли кнопку <button>.';
              const bg = H.css(b, 'background-color');
              return !/^(rgba\(0, 0, 0, 0\)|rgb\(239, 239, 239\)|rgb\(240, 240, 240\)|transparent)$/.test(bg) || 'Задайте кнопке background.';
            }
        },
        {
          name: "У кнопки скруглённые углы",
          check: (d, w, H) => {
              const b = d.querySelector('form button, form input[type="submit"]') || d.querySelector('button, input[type="submit"]');
              if (!b) return 'Не нашли кнопку <button>.';
              return parseFloat(H.css(b, 'border-top-left-radius')) > 0 || 'Задайте кнопке border-radius.';
            }
        }
      ]
    },
    {
      id: "t8",
      title: "Итог: своя анкета",
      points: 25,
      lang: "html",
      final: true,
      variants: [
        {
          theme: "Анкета участника хакатона",
          word: "хакатон",
          type: "date",
          field: "дата рождения (type=\"date\")"
        },
        {
          theme: "Запись в спортивную секцию",
          word: "секци",
          type: "number",
          field: "рост в сантиметрах (type=\"number\")"
        },
        {
          theme: "Заявка волонтёра",
          word: "волонт",
          type: "color",
          field: "цвет футболки волонтёра (type=\"color\")"
        },
        {
          theme: "Запись в библиотеку",
          word: "библиотек",
          type: "range",
          field: "сколько книг в месяц вы читаете (type=\"range\")"
        },
        {
          theme: "Регистрация на киберспортивный турнир",
          word: "турнир",
          type: "url",
          field: "ссылка на профиль игрока (type=\"url\")"
        },
        {
          theme: "Заявка на экскурсию",
          word: "экскурси",
          type: "time",
          field: "удобное время (type=\"time\")"
        }
      ],
      text: "<p>Тема вашей анкеты: <b>{{theme}}</b>. Сверстайте её с нуля. Можно писать здесь или в VS Code и загрузить файл кнопкой «Загрузить файл».</p><ul><li>заголовок <code>&lt;h1&gt;</code> с темой анкеты и форма;</li><li>обязательно есть поле: {{field}};</li><li>минимум <b>6 разных видов</b> полей: text, email, tel, date, number, select, radio, checkbox, textarea, range, color…;</li><li>у каждого поля есть подпись;</li><li>ФИО и почта обязательны;</li><li>хотя бы один <code>fieldset</code> с <code>legend</code>;</li><li>кнопка отправки;</li><li>форма оформлена через CSS и не шире 600 px.</li></ul>",
      starter: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Анкета участника хакатона</title>\n</head>\n<body>\n\n</body>\n</html>",
      hint: "Соберите форму из кусков прошлых заданий и добавьте новые типы: <code>type=\"date\"</code>, <code>type=\"number\"</code>, <code>type=\"color\"</code>.",
      tests: [
        {
          name: "Есть заголовок <h1> и форма",
          check: (d, w, H) => !!(H.text(d.querySelector('h1')) && d.querySelector('form')) || 'Нужны <h1> с текстом и <form>.'
        },
        {
          name: "Заголовок называет тему вашего варианта",
          check: (d, w, H) => H.text(d.querySelector('h1')).toLowerCase().includes(H.v.word) || 'В <h1> должна быть тема вашего варианта — посмотрите текст задания.'
        },
        {
          name: "Есть поле вашего варианта",
          check: (d, w, H) => !!d.querySelector('form input[type="' + H.v.type + '"]') || 'Не нашли поле type="' + H.v.type + '" — оно обязательно в вашем варианте.'
        },
        {
          name: "Минимум 6 разных видов полей",
          check: (d) => {
              const kinds = new Set(Array.from(d.querySelectorAll('form input, form select, form textarea'))
                .filter(el => !/^(hidden|submit|button|reset|image)$/.test(el.type))
                .map(el => el.tagName === 'INPUT' ? el.type : el.tagName.toLowerCase()));
              return kinds.size >= 6 || 'Сейчас видов полей: ' + kinds.size + ' (' + Array.from(kinds).join(', ') + '). Нужно 6.';
            }
        },
        {
          name: "У всех полей есть подписи",
          check: (d, w, H) => {
    const bad = Array.from(d.querySelectorAll('form input, form select, form textarea'))
      .filter(el => !/^(hidden|submit|button|reset|image)$/.test(el.type))
      .find(el => !H.labeled(el));
    return !bad || 'Нет подписи у поля ' + (bad.name ? 'name="' + bad.name + '"' : '<' + bad.tagName.toLowerCase() + '>') + '. Свяжите <label for="…"> с id поля или оберните поле в <label>.';
  }
        },
        {
          name: "ФИО и почта обязательны",
          check: (d) => {
              const email = d.querySelector('form input[type="email"]');
              const text = d.querySelector('form input[type="text"]');
              if (!email || !text) return 'Нужны текстовое поле для ФИО и поле type="email".';
              return (email.required && text.required) || 'Добавьте required полям ФИО и почты.';
            }
        },
        {
          name: "Есть fieldset с legend",
          check: (d, w, H) => !!H.text(d.querySelector('form fieldset > legend')) || 'Добавьте <fieldset> с <legend>.'
        },
        {
          name: "Есть кнопка отправки",
          check: (d) => !!d.querySelector('form button:not([type="button"]):not([type="reset"]), form input[type="submit"]') || (d.querySelector('button, input[type="submit"]') ? 'Кнопка стоит вне формы. Перенесите её внутрь, перед </form>.' : 'Добавьте кнопку отправки.')
        },
        {
          name: "Форма оформлена и не шире 600 px",
          check: (d) => {
              const f = d.querySelector('form');
              if (!f) return 'Нет формы.';
              if (!d.querySelector('style, link[rel="stylesheet"]')) return 'Добавьте стили в <style>.';
              return f.getBoundingClientRect().width <= 600 || 'Ограничьте ширину формы: max-width до 600 px.';
            }
        }
      ]
    }
  ]
};
