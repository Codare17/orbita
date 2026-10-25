/* Орбита — интерфейс платформы: вход, курсы, карта, уроки-теория, тренажёр практик, отчёт преподавателя. */
(function () {
  'use strict';

  const O = window.ORBITA, S = window.OrbitaStore, HL = window.OrbitaHL, R = window.OrbitaRunner, ED = window.OrbitaEditor;
  const app = document.getElementById('app');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const plain = html => { const d = document.createElement('div'); d.innerHTML = html; return d.textContent; };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ---------- иконки ---------- */
  const ICON = {
    flame: '<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-4 2.5-5 .3 1.7 1.2 2.6 2.2 3 .3-2.8-.4-5.5.3-8z"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    check: '<path d="M5 12.5 10 17 19 7"/>',
    cross: '<path d="M7 7l10 10M17 7 7 17"/>',
    dot: '<circle cx="12" cy="12" r="4"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    back: '<path d="M15 5 8 12l7 7"/>',
    book: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5M5 20h14"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5"/>',
    play: '<path d="M7 4v16l13-8z"/>',
    logout: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    ruler: '<path d="M3 17 17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2"/>',
    form: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h4"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-2.9-5.4 2.9 1.1-6L3.2 9.4l6.1-.8z"/>',
    tree: '<path d="M12 3v6M12 9 6 15M12 9l6 6M6 15v5M18 15v5"/><circle cx="12" cy="4" r="1.5"/>',
    grid: '<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/>',
    brush: '<path d="M18 3l3 3-9 9-3-3zM9 12c-3 0-4 2-4 4 0 1.5-1 2.5-2 3 3 1 7 0 8-3"/>',
    table: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M9 5v14"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4a3 3 0 0 0 4 4M16 6h4a3 3 0 0 1-4 4M12 13v4M8 21h8M9 17h6"/>',
    code: '<path d="m9 8-5 4 5 4M15 8l5 4-5 4"/>'
  };
  const ico = (n, cls) => '<svg class="ico ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + ICON[n] + '</svg>';
  const LOGO = '<svg class="logo" viewBox="0 0 32 32" aria-hidden="true"><ellipse cx="16" cy="16" rx="14" ry="6" transform="rotate(-25 16 16)" fill="none" stroke="#7CC7FF" stroke-width="1.6"/><circle cx="16" cy="16" r="6.5" fill="#FFB547"/><circle cx="28.7" cy="10.1" r="2.2" fill="#ECEFFA"/></svg>';
  const ORBIT_ART = '<svg class="orbit-art" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke-width="1.2"><ellipse cx="100" cy="100" rx="92" ry="36" transform="rotate(-25 100 100)" stroke="#7CC7FF" opacity=".5"/><ellipse cx="100" cy="100" rx="64" ry="24" transform="rotate(-25 100 100)" stroke="#FFB547" opacity=".6"/></g><circle cx="100" cy="100" r="20" fill="#FFB547" opacity=".85"/><circle cx="183" cy="61" r="5" fill="#ECEFFA"/><circle cx="42" cy="127" r="3.5" fill="#7CC7FF"/></svg>';

  /* ---------- оценивание ---------- */
  // Шкала для журнала: процент баллов за ПЗ → оценка. Ниже 50% — «не зачтено», можно доработать.
  const SCALE = [[85, 5], [70, 4], [50, 3]];
  const markFor = pct => { for (const [min, m] of SCALE) if (pct >= min) return m; return null; };
  const markHtml = m => m ? '<span class="mark m' + m + '" title="Оценка">' + m + '</span>' : '<span class="mark mn" title="Не зачтено">н/з</span>';
  const HINT_FACTOR = 0.7;

  /* ---------- достижения ---------- */
  const ACH = [
    { id: 'first', icon: 'flag', title: 'Первый шаг', text: 'Пройти первое занятие' },
    { id: 'architect', icon: 'ruler', title: 'Архитектор', text: 'Пройти урок 1.1 о проектировании' },
    { id: 'forms', icon: 'form', title: 'Мастер форм', text: 'Сдать ПЗ №1 на «5»' },
    { id: 'clean', icon: 'star', title: 'Без подсказок', text: 'Сдать ПЗ без подсказок и решений' },
    { id: 'streak3', icon: 'flame', title: 'Три дня подряд', text: 'Заниматься 3 дня без пропусков' },
    { id: 'xp100', icon: 'bolt', title: 'Сотня', text: 'Набрать 100 XP' },
    { id: 'flex', icon: 'grid', title: 'Мастер Flexbox', text: 'Сдать ПЗ №2 и №3 на «5»' },
    { id: 'dom', icon: 'tree', title: 'Повелитель DOM', text: 'Сдать ПЗ №9 на «5»' },
    { id: 'canvas', icon: 'brush', title: 'Художник Canvas', text: 'Сдать ПЗ №12' }
  ];
  function checkAchievements() {
    const p = S.profile(), res = p.progress;
    const five = id => res[id] && res[id].done && res[id].mark === 5;
    const rules = {
      first: () => Object.values(res).some(r => r.done),
      architect: () => res['l-1-1'] && res['l-1-1'].done,
      forms: () => five('pz-01'),
      clean: () => Object.values(res).some(r => r.done && r.kind === 'practice' && r.clean),
      streak3: () => S.streak() >= 3,
      xp100: () => p.xp >= 100,
      flex: () => five('pz-02') && five('pz-03'),
      dom: () => five('pz-09'),
      canvas: () => res['pz-12'] && res['pz-12'].done
    };
    return ACH.filter(a => rules[a.id]() && S.unlock(a.id));
  }

  /* ---------- курс ---------- */
  const course = id => O.courses.find(c => c.id === id);
  function allItems(c) {
    const out = [];
    c.semesters.forEach(s => s.topics.forEach(t => t.items.forEach(it => out.push(Object.assign({ topic: t, sem: s.n, course: c }, it)))));
    return out;
  }
  function findItem(id) {
    for (const c of O.courses) { const it = allItems(c).find(i => i.id === id); if (it) return it; }
    return null;
  }
  const itemLabel = it => it.kind === 'practice' ? 'ПЗ №' + it.num : it.kind === 'exam' ? 'Зачёт' : 'Урок ' + it.num;
  function itemState(it) {
    const r = S.result(it.id);
    if (r && r.done) return 'done';
    if (!O.lessons[it.id]) return 'soon';
    if (r && r.started) return 'wip';
    return 'open';
  }
  const nextItem = c => allItems(c).find(it => O.lessons[it.id] && itemState(it) !== 'done');

  function practiceScore(lid) {
    const L = O.lessons[lid];
    let score = 0, max = 0, passed = 0, clean = true;
    L.tasks.forEach(t => {
      const st = S.task(lid, t.id);
      max += t.points;
      if (st.passed) { score += st.points || 0; passed++; }
      if (st.hint || st.solution) clean = false;
    });
    const pct = max ? Math.round(score / max * 100) : 0;
    return { score, max, pct, mark: markFor(pct), passed, total: L.tasks.length, clean: clean && passed === L.tasks.length };
  }

  /* ---------- навигация ---------- */
  let state = { screen: 'home' };
  let teardown = [];
  function go(screen, params) {
    teardown.forEach(f => f());
    teardown = [];
    state = Object.assign({ screen }, params || {});
    render();
    window.scrollTo(0, 0);
  }
  function onKey(fn) {
    document.addEventListener('keydown', fn);
    teardown.push(() => document.removeEventListener('keydown', fn));
  }
  function onMessage(fn) {
    window.addEventListener('message', fn);
    teardown.push(() => window.removeEventListener('message', fn));
  }

  function render() {
    if (state.screen === 'teacher') return renderTeacher();
    if (!S.user()) return renderLogin();
    if (state.screen === 'course') return renderCourse();
    if (state.screen === 'theory') return renderTheory();
    if (state.screen === 'practice') return renderPractice();
    return renderHome();
  }

  function openItem(id) {
    const L = O.lessons[id];
    if (!L) return;
    go(L.type === 'practice' ? 'practice' : 'theory', { id, course: findItem(id).course.id });
  }

  /* ---------- уведомления ---------- */
  function toast(html, icon) {
    let box = document.querySelector('.toasts');
    if (!box) { box = document.createElement('div'); box.className = 'toasts'; box.setAttribute('role', 'status'); document.body.appendChild(box); }
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = ico(icon || 'trophy') + '<div>' + html + '</div>';
    box.appendChild(t);
    setTimeout(() => t.remove(), 3800);
  }
  function announceAch(list) {
    list.forEach((a, i) => setTimeout(() => toast('<b>Достижение: ' + esc(a.title) + '</b><br>' + esc(a.text), a.icon), i * 500));
  }

  /* ---------- сохранение и автовыход ---------- */
  const SYNC = {
    ok: ['check', 'Сохранено в облаке'],
    saving: ['reset', 'Сохраняем…'],
    offline: ['cross', 'Нет связи: прогресс сохранён в браузере и отправится, когда появится интернет']
  };
  function syncChip() {
    if (!S.remote) return '';
    const s = SYNC[S.status()] || SYNC.ok;
    return '<span class="chip sync s-' + S.status() + '" title="' + s[1] + '" aria-label="' + s[1] + '">' + ico(s[0]) + '</span>';
  }
  S.onStatus(() => document.querySelectorAll('.chip.sync').forEach(el => { el.outerHTML = syncChip(); }));

  ['pointerdown', 'keydown'].forEach(ev => document.addEventListener(ev, () => S.touch(), { passive: true }));
  setInterval(async () => {
    if (!S.idle()) return;
    await S.logout();
    go('login', { notice: 'Вы долго не занимались, поэтому вышли автоматически. Войдите снова — прогресс сохранён.' });
  }, 30000);

  /* ---------- вход ---------- */
  function renderLogin() {
    const groups = Array.from(new Set(O.courses.flatMap(c => c.groups)));
    app.innerHTML =
      '<main class="login"><div class="login-card">' +
        '<div class="brand">' + LOGO + '<span>Орбита</span></div>' +
        '<h1>Вход для студентов</h1>' +
        '<p class="muted">Выберите группу и введите личный код. Код выдаёт преподаватель: имя и фамилия на платформе не нужны.</p>' +
        '<form class="login-form" id="login-form" novalidate>' +
          '<label for="lg-group">Группа</label>' +
          '<select class="field" id="lg-group">' + groups.map(g => '<option>' + esc(g) + '</option>').join('') + '</select>' +
          '<label for="lg-code">Личный код</label>' +
          '<input class="field" id="lg-code" autocomplete="off" maxlength="12" placeholder="например, 07">' +
          '<div class="form-err" id="lg-err" aria-live="polite"></div>' +
          '<button class="btn primary big" type="submit">Войти</button>' +
        '</form>' +
        '<p class="note">' + (S.remote
          ? 'Прогресс сохраняется в облаке: можно продолжить с любого устройства. На общем компьютере нажимайте «Выйти» в конце занятия.'
          : 'Прототип: подойдёт любой код из цифр и букв. Прогресс хранится в этом браузере.') + '</p>' +
        '<button class="link" type="button" id="to-teacher">Отчёт преподавателя</button>' +
      '</div></main>';
    const err = document.getElementById('lg-err');
    if (state.notice) err.textContent = state.notice;
    document.getElementById('login-form').addEventListener('submit', async e => {
      e.preventDefault();
      const group = document.getElementById('lg-group').value;
      const code = document.getElementById('lg-code').value.trim();
      if (!/^[0-9A-Za-zА-Яа-яЁё-]{1,12}$/.test(code)) {
        err.textContent = 'Введите код: до 12 букв и цифр, без пробелов.';
        return;
      }
      const btn = e.target.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Входим…'; err.textContent = '';
      const r = await S.login(group, code);
      btn.disabled = false; btn.textContent = 'Войти';
      if (r.ok) return go('home');
      err.textContent = {
        code: 'Такого кода нет в группе ' + group + '. Проверьте группу и код или спросите преподавателя.',
        locked: 'Слишком много неверных попыток. Вход для этого кода закрыт на 10 минут.',
        network: 'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.'
      }[r.error] || 'Не получилось войти: ' + r.error;
    });
    document.getElementById('to-teacher').addEventListener('click', () => go('teacher'));
  }

  /* ---------- верхняя панель ---------- */
  function topbar() {
    const p = S.profile(), u = S.user(), streak = S.streak();
    return '<header class="topbar"><div class="topbar-in">' +
      '<button class="brand" data-act="home" aria-label="На главную">' + LOGO + '<span>Орбита</span></button>' +
      '<div class="tb-stats">' +
        '<span class="chip streak' + (streak ? ' on' : '') + '" title="Дней подряд">' + ico('flame') + streak + '</span>' +
        '<span class="chip xp" title="Очки опыта">' + ico('bolt') + p.xp + ' XP</span>' + syncChip() +
        '<button class="chip user" data-act="logout" title="Выйти">' + '<span class="who">' + esc(u.group) + ' · ' + esc(u.code) + '</span>' + ico('logout') + '</button>' +
      '</div></div></header>';
  }
  function bindCommon() {
    app.querySelectorAll('[data-act="home"]').forEach(b => b.addEventListener('click', () => go('home')));
    app.querySelectorAll('[data-act="logout"]').forEach(b => b.addEventListener('click', async () => { b.disabled = true; await S.logout(); go('login'); }));
    app.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => openItem(b.dataset.open)));
    app.querySelectorAll('[data-course]').forEach(b => b.addEventListener('click', () => go('course', { course: b.dataset.course })));
  }

  /* ---------- главная ---------- */
  function renderHome() {
    const p = S.profile(), u = S.user();
    const achCount = Object.keys(p.ach).length;
    const courses = O.courses.filter(c => c.groups.includes(u.group));
    const cards = courses.map(c => {
      const items = allItems(c).filter(i => i.kind !== 'exam');
      const done = items.filter(i => itemState(i) === 'done').length;
      const next = nextItem(c);
      return '<article class="course-card">' + ORBIT_ART +
        '<span class="eyebrow">' + esc(c.code) + ' · ' + esc(c.specialty) + '</span>' +
        '<h2>' + esc(c.title) + '</h2>' +
        '<p class="muted">' + c.hours.total + ' ак. ч, из них ' + c.hours.practice + ' практики · ' + items.filter(i => i.kind === 'practice').length + ' практических занятий</p>' +
        '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="' + items.length + '" aria-valuenow="' + done + '"><i style="width:' + (done / items.length * 100) + '%"></i></div>' +
        '<div class="cc-meta"><span>Пройдено ' + done + ' из ' + items.length + ' занятий</span></div>' +
        '<div class="cc-actions">' +
          (next ? '<button class="btn primary" data-open="' + next.id + '">' + ico('play') + 'Продолжить: ' + esc(itemLabel(next)) + '. ' + esc(next.title) + '</button>' : '') +
          '<button class="btn" data-course="' + c.id + '">Карта курса</button>' +
        '</div></article>';
    }).join('');

    app.innerHTML = topbar() +
      '<main class="wrap">' +
        '<section class="hello"><span class="eyebrow">' + esc(u.group) + ' · код ' + esc(u.code) + '</span><h1>Привет! Продолжим?</h1></section>' +
        '<section class="stats" aria-label="Мой прогресс">' +
          '<div class="stat s-xp"><b>' + ico('bolt') + p.xp + '</b><span>очков опыта</span></div>' +
          '<div class="stat s-streak"><b>' + ico('flame') + S.streak() + '</b><span>дней подряд</span></div>' +
          '<div class="stat s-ach"><b>' + ico('trophy') + achCount + '</b><span>достижений из ' + ACH.length + '</span></div>' +
        '</section>' +
        '<section><div class="section-h"><h2>Мои курсы</h2></div><div style="display:flex;flex-direction:column;gap:12px">' + cards +
          '<div class="future">Здесь появятся курсы для других специальностей колледжа.</div></div></section>' +
        '<section><div class="section-h"><h2>Достижения</h2></div><div class="ach-grid">' +
          ACH.map(a => '<div class="ach' + (p.ach[a.id] ? '' : ' locked') + '"><span class="badge">' + ico(a.icon) + '</span><div><b>' + esc(a.title) + '</b><small>' + esc(a.text) + '</small></div></div>').join('') +
        '</div></section>' +
      '</main>';
    bindCommon();
  }

  /* ---------- карта курса ---------- */
  function renderCourse() {
    const c = course(state.course);
    const sem = state.sem || 1;
    const next = nextItem(c);
    const semester = c.semesters.find(s => s.n === sem);
    const row = it => {
      const st = itemState(it), r = S.result(it.id);
      let node;
      if (it.kind === 'practice') node = '<span class="node sq">' + (st === 'done' ? ico('check') : it.num) + '</span>';
      else if (it.kind === 'exam') node = '<span class="node">' + ico('trophy') + '</span>';
      else node = '<span class="node">' + ico(st === 'done' ? 'check' : 'book') + '</span>';
      let right;
      if (st === 'done') right = it.kind === 'practice' ? markHtml(r.mark) : '<span class="tag ok">пройден</span>';
      else if (st === 'soon') right = '<span class="tag">скоро</span>';
      else if (st === 'wip') right = '<span class="tag sky">' + (it.kind === 'practice' ? practiceScore(it.id).pct + '%' : 'начат') + '</span>';
      else right = '<span class="tag accent">начать</span>';
      return '<li class="ti ' + st + ' ' + it.kind + (next && next.id === it.id ? ' next' : '') + '">' +
        '<button class="ti-btn"' + (st === 'soon' ? ' disabled' : ' data-open="' + it.id + '"') + '>' + node +
        '<span class="ti-text"><span class="ti-kind">' + esc(itemLabel(it)) + ' · ' + it.hours + ' ак. ч</span><span class="ti-title">' + esc(it.title) + '</span></span>' + right +
        '</button></li>';
    };
    app.innerHTML = topbar() +
      '<main class="wrap">' +
        '<div class="course-head"><button class="back" data-act="home">' + ico('back') + 'Все курсы</button>' +
          '<span class="eyebrow">' + esc(c.code) + ' · ' + c.hours.total + ' ак. ч</span><h1>' + esc(c.title) + '</h1></div>' +
        '<div class="seg" role="tablist" aria-label="Семестр">' + c.semesters.map(s => '<button role="tab" data-sem="' + s.n + '" aria-selected="' + (s.n === sem) + '">' + esc(s.title) + '</button>').join('') + '</div>' +
        semester.topics.map(t =>
          '<section class="topic"><header class="topic-h"><span class="eyebrow">' + (/^\d/.test(t.id) ? 'Тема ' + esc(t.id) : '') + '</span><h2>' + esc(t.title) + '</h2></header>' +
          '<ol class="trail">' + t.items.map(row).join('') + '</ol></section>').join('') +
      '</main>';
    bindCommon();
    app.querySelectorAll('[data-sem]').forEach(b => b.addEventListener('click', () => go('course', { course: c.id, sem: +b.dataset.sem })));
  }

  /* ---------- урок-теория ---------- */
  const codeBlock = c => '<pre class="code"><code>' + HL.auto(c.src, c.lang) + '</code></pre>';

  function uiCard(step, el) {
    el.innerHTML = '<div class="q-kind">Теория</div><h2 class="card-title">' + step.title + '</h2>' +
      '<div class="prose">' + step.html + '</div>' + (step.code ? codeBlock(step.code) : '');
    return { card: true };
  }

  function uiQuiz(step, el, changed) {
    const multi = Array.isArray(step.answer);
    const right = new Set(multi ? step.answer : [step.answer]);
    const order = shuffle(step.options.map((t, i) => i));
    const sel = new Set();
    el.innerHTML = '<div class="q-kind">' + (multi ? 'Выберите все верные ответы' : 'Выберите ответ') + '</div>' +
      '<h2 class="q">' + step.q + '</h2>' + (step.code ? codeBlock(step.code) : '') +
      '<div class="opts" role="' + (multi ? 'group' : 'radiogroup') + '">' +
      order.map((i, k) => '<button class="opt' + (multi ? ' multi' : '') + '" role="' + (multi ? 'checkbox' : 'radio') + '" aria-checked="false" data-i="' + i + '"><span class="opt-k">' + (k + 1) + '</span><span>' + step.options[i] + '</span></button>').join('') +
      '</div>';
    const btns = Array.from(el.querySelectorAll('.opt'));
    const toggle = b => {
      const i = +b.dataset.i;
      if (multi) { sel.has(i) ? sel.delete(i) : sel.add(i); }
      else { sel.clear(); sel.add(i); }
      btns.forEach(x => x.setAttribute('aria-checked', String(sel.has(+x.dataset.i))));
      changed();
    };
    btns.forEach(b => b.addEventListener('click', () => toggle(b)));
    return {
      ready: () => sel.size > 0,
      key(k) { const b = btns[+k - 1]; if (b && !b.disabled) toggle(b); },
      check() {
        const ok = sel.size === right.size && [...sel].every(i => right.has(i));
        btns.forEach(b => {
          const i = +b.dataset.i;
          b.disabled = true;
          if (sel.has(i)) b.classList.add(right.has(i) ? 'ok' : 'bad');
          else if (right.has(i)) b.classList.add('missed');
        });
        return ok;
      },
      answer: () => [...right].map(i => plain(step.options[i])).join('; ')
    };
  }

  function uiBuild(step, el, changed) {
    const list = step.type === 'order';
    const good = list ? step.items : step.tokens;
    const pool = shuffle(good.concat(step.extra || []).map((t, i) => ({ t, i })));
    const picked = [];
    el.innerHTML = '<div class="q-kind">' + (list ? 'Расставьте по порядку' : 'Соберите из блоков') + '</div>' +
      '<h2 class="q">' + step.q + '</h2>' +
      '<div class="build-line' + (list ? ' list' : '') + '" data-empty="' + (list ? 'Нажимайте на пункты в нужном порядке' : 'Нажимайте на блоки ниже') + '"></div>' +
      '<div class="bank' + (list ? ' list' : '') + '">' + pool.map(p => '<button class="tok" data-i="' + p.i + '">' + esc(p.t) + '</button>').join('') + '</div>';
    const line = el.querySelector('.build-line');
    const bank = Array.from(el.querySelectorAll('.bank .tok'));
    let locked = false;
    const draw = () => {
      line.innerHTML = picked.map(i => '<button class="tok" data-i="' + i + '">' + esc(pool.find(p => p.i === i).t) + '</button>').join('');
      line.querySelectorAll('.tok').forEach(b => b.addEventListener('click', () => {
        if (locked) return;
        picked.splice(picked.indexOf(+b.dataset.i), 1);
        bank.find(x => +x.dataset.i === +b.dataset.i).classList.remove('used');
        draw(); changed();
      }));
    };
    bank.forEach(b => b.addEventListener('click', () => {
      if (locked) return;
      picked.push(+b.dataset.i); b.classList.add('used'); draw(); changed();
    }));
    const textOf = arr => arr.join(' ');
    return {
      ready: () => list ? picked.length === good.length : picked.length > 0,
      check() {
        locked = true;
        el.querySelectorAll('.tok').forEach(b => { b.disabled = true; });
        const got = picked.map(i => pool.find(p => p.i === i).t);
        return textOf(got) === textOf(good) || (step.accept || []).some(a => textOf(a) === textOf(got));
      },
      answer: () => list ? good.map((t, i) => (i + 1) + '. ' + t).join('  ') : textOf(good)
    };
  }

  function uiMatch(step, el, changed) {
    const L = shuffle(step.pairs.map((p, i) => i)), Rr = shuffle(step.pairs.map((p, i) => i));
    let selL = null, selR = null, mistakes = 0, matched = 0;
    el.innerHTML = '<div class="q-kind">Найдите пары</div><h2 class="q">' + step.q + '</h2>' +
      '<div class="match"><div class="mcol">' + L.map(i => '<button class="mitem term" data-side="l" data-i="' + i + '">' + esc(step.pairs[i][0]) + '</button>').join('') + '</div>' +
      '<div class="mcol">' + Rr.map(i => '<button class="mitem" data-side="r" data-i="' + i + '">' + esc(step.pairs[i][1]) + '</button>').join('') + '</div></div>';
    const items = Array.from(el.querySelectorAll('.mitem'));
    const pick = b => {
      if (b.classList.contains('done')) return;
      if (b.dataset.side === 'l') selL = selL === b ? null : b; else selR = selR === b ? null : b;
      items.forEach(x => x.classList.toggle('sel', x === selL || x === selR));
      if (selL && selR) {
        const a = selL, c = selR;
        selL = selR = null;
        items.forEach(x => x.classList.remove('sel'));
        if (a.dataset.i === c.dataset.i) {
          a.classList.add('done'); c.classList.add('done'); a.disabled = c.disabled = true; matched++;
          changed();
        } else {
          mistakes++;
          [a, c].forEach(x => { x.classList.add('err'); setTimeout(() => x.classList.remove('err'), 450); });
        }
      }
    };
    items.forEach(b => b.addEventListener('click', () => pick(b)));
    return {
      noRetry: true,
      ready: () => matched === step.pairs.length,
      check: () => mistakes === 0,
      answer: () => 'Пары найдены, ошибок: ' + mistakes
    };
  }

  const STEP_UI = { card: uiCard, quiz: uiQuiz, build: uiBuild, order: uiBuild, match: uiMatch };

  function renderTheory() {
    const it = findItem(state.id), L = O.lessons[state.id];
    const queue = L.steps.map((s, i) => Object.assign({ _i: i }, s));
    const firstTry = {};
    let pos = 0, xp = 0, ui = null, mode = 'next';
    const started = Date.now();
    S.saveResult(it.id, { started: true, kind: 'theory' });

    app.innerHTML =
      '<div class="player">' +
        '<header class="pl-top"><div class="pl-top-in">' +
          '<button class="icon-btn" id="pl-exit" aria-label="Закрыть урок">' + ico('close') + '</button>' +
          '<div class="pl-bar" role="progressbar" aria-label="Прогресс урока"><i></i></div>' +
          '<span class="chip xp">' + ico('bolt') + '<span id="pl-xp">0</span></span>' +
        '</div></header>' +
        '<main class="pl-stage"><div class="pl-step" id="pl-step"></div></main>' +
        '<footer class="pl-foot" id="pl-foot"><div class="pl-foot-in"><div class="pl-fb" id="pl-fb" aria-live="polite"></div>' +
          '<button class="btn primary big pl-main" id="pl-main">Далее</button></div></footer>' +
      '</div>';
    const stepEl = document.getElementById('pl-step'), foot = document.getElementById('pl-foot');
    const fb = document.getElementById('pl-fb'), main = document.getElementById('pl-main');
    const bar = app.querySelector('.pl-bar i');

    function setFoot(m, ok, text) {
      mode = m;
      foot.className = 'pl-foot' + (m === 'result' ? (ok ? ' ok' : ' bad') : '');
      main.className = 'btn big pl-main ' + (m === 'result' ? (ok ? 'ok' : 'bad') : 'primary');
      if (m === 'next') { fb.innerHTML = ''; main.textContent = pos === queue.length - 1 ? 'Завершить' : 'Далее'; main.disabled = false; }
      if (m === 'check') { fb.innerHTML = ''; main.textContent = 'Проверить'; main.disabled = !ui.ready(); }
      if (m === 'result') { fb.innerHTML = text; main.textContent = 'Продолжить'; main.disabled = false; }
    }

    function show() {
      const step = queue[pos];
      bar.style.width = (pos / queue.length * 100) + '%';
      stepEl.style.animation = 'none'; void stepEl.offsetWidth; stepEl.style.animation = '';
      ui = STEP_UI[step.type](step, stepEl, () => { if (mode === 'check') main.disabled = !ui.ready(); });
      setFoot(ui.card ? 'next' : 'check');
      window.scrollTo(0, 0);
    }

    function check() {
      const step = queue[pos];
      const ok = ui.check();
      if (!(step._i in firstTry)) firstTry[step._i] = ok;
      if (ok && !step._retry) { xp += 2; document.getElementById('pl-xp').textContent = xp; }
      if (!ok && !step._retry && !ui.noRetry) queue.push(Object.assign({}, step, { _retry: true }));
      const extra = step.explain ? '<span>' + step.explain + '</span>' : '';
      if (ok) setFoot('result', true, '<b>Верно!</b>' + extra);
      else if (ui.noRetry) setFoot('result', false, '<b>Есть ошибки</b><span>' + esc(ui.answer()) + '</span>' + extra);
      else setFoot('result', false, '<b>Не совсем</b><span>Правильно: ' + esc(ui.answer()) + '</span>' + extra + '<span>Вернёмся к этому вопросу в конце урока.</span>');
    }

    function advance() {
      pos++;
      if (pos >= queue.length) return finish();
      show();
    }

    function finish() {
      const asked = Object.keys(firstTry).length;
      const acc = asked ? Math.round(Object.values(firstTry).filter(Boolean).length / asked * 100) : 100;
      const gained = xp + 10;
      const was = S.result(it.id);
      S.saveResult(it.id, { done: true, kind: 'theory', accuracy: Math.max(acc, (was && was.accuracy) || 0), finishedAt: new Date().toISOString() });
      S.addXP(gained);
      const fresh = checkAchievements();
      const min = Math.max(1, Math.round((Date.now() - started) / 60000));
      const next = nextItem(it.course);
      teardown.forEach(f => f()); teardown = [];
      app.innerHTML =
        '<main class="finish"><div class="finish-in">' +
          '<div class="finish-badge">' + ico('star') + '</div>' +
          '<div><span class="eyebrow">' + esc(itemLabel(it)) + '</span><h1>Урок пройден!</h1></div>' +
          '<div class="stats">' +
            '<div class="stat s-xp"><b>+' + gained + '</b><span>XP</span></div>' +
            '<div class="stat s-ach"><b>' + acc + '%</b><span>с первой попытки</span></div>' +
            '<div class="stat"><b>' + min + '</b><span>мин</span></div>' +
          '</div>' +
          (fresh.length ? '<div class="new-ach"><span class="eyebrow">Новые достижения</span>' + fresh.map(a => '<div class="ach"><span class="badge">' + ico(a.icon) + '</span><div><b>' + esc(a.title) + '</b><small>' + esc(a.text) + '</small></div></div>').join('') + '</div>' : '') +
          '<div class="finish-actions">' +
            (next ? '<button class="btn primary big" data-open="' + next.id + '">Дальше: ' + esc(itemLabel(next)) + '</button>' : '') +
            '<button class="btn big" data-course="' + it.course.id + '">К карте курса</button>' +
          '</div>' +
        '</div></main>';
      bindCommon();
    }

    main.addEventListener('click', () => {
      if (mode === 'next') advance();
      else if (mode === 'check') { if (ui.ready()) check(); }
      else advance();
    });
    document.getElementById('pl-exit').addEventListener('click', () => go('course', { course: it.course.id }));
    onKey(e => {
      if (e.target.closest('input, textarea, select')) return;
      if (e.key === 'Enter' && !e.target.closest('button:not(#pl-main)')) { e.preventDefault(); main.click(); }
      else if (/^[1-9]$/.test(e.key) && mode === 'check' && ui.key) ui.key(e.key);
      else if (e.key === 'Escape') go('course', { course: it.course.id });
    });
    show();
  }

  /* ---------- тренажёр практики ---------- */
  function renderPractice() {
    const it = findItem(state.id), L = O.lessons[state.id], lid = it.id;
    const tasks = L.tasks;
    let ti = state.task != null ? state.task : Math.max(0, tasks.findIndex(t => !S.task(lid, t.id).passed));
    let results = null, busy = false, previewTimer = null, solArmed = false;
    S.saveResult(lid, { started: true, kind: 'practice' });

    const starterFor = i => {
      const t = tasks[i];
      if (t.starter !== '@prev') return t.starter;
      const prev = tasks[i - 1];
      return S.task(lid, prev.id).code || prev.solution || starterFor(i - 1);
    };
    // Индивидуальный вариант задания зависит от кода студента: решение соседа не пройдёт проверку.
    const variantOf = t => {
      if (!t.variants) return null;
      const u = S.user(), s = u.group + '/' + u.code.toUpperCase() + '/' + lid + '/' + t.id;
      let h = 0;
      for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
      return t.variants[h % t.variants.length];
    };
    const fill = (html, v) => v ? html.replace(/\{\{(\w+)\}\}/g, (m, k) => esc(v[k] != null ? v[k] : m)) : html;
    const canShowSolution = t => S.remote || !!t.solution;
    const codeFor = i => S.task(lid, tasks[i].id).code || starterFor(i);

    app.innerHTML =
      '<div class="ws" data-tab="task">' +
        '<header class="ws-top">' +
          '<button class="icon-btn" id="ws-back" aria-label="К карте курса">' + ico('back') + '</button>' +
          '<div class="ws-title"><span class="eyebrow">ПЗ №' + it.num + ' · Тема ' + esc(it.topic.id) + ' · ' + it.hours + ' ак. ч</span><b>' + esc(it.title) + '</b></div>' +
          '<div class="ws-score" id="ws-score"></div>' + syncChip() +
          '<button class="btn small" id="ws-finish">' + ico('flag') + '<span class="lbl">Сдать ПЗ</span></button>' +
        '</header>' +
        '<nav class="ws-tasks" id="ws-tasks" aria-label="Задания"></nav>' +
        '<div class="ws-tabs" role="tablist" aria-label="Панели тренажёра">' +
          '<button role="tab" data-tab="task" aria-selected="true">Задание</button>' +
          '<button role="tab" data-tab="code" aria-selected="false">Код</button>' +
          '<button role="tab" data-tab="view" aria-selected="false" id="ws-vtab">Результат</button>' +
        '</div>' +
        '<div class="ws-grid">' +
          '<section class="pane pane-task" id="pane-task" aria-label="Задание"></section>' +
          '<section class="pane pane-code" aria-label="Код">' +
            '<div class="pane-h"><span class="grow" id="ws-fname">index.html</span>' +
              '<label class="btn small ghost" title="Загрузить файл из VS Code">' + ico('upload') + '<span class="desk-only">Загрузить файл</span><input type="file" id="ws-file" accept=".html,.htm,.css,.js,.txt" class="sr"></label>' +
              '<button class="btn small ghost" id="ws-reset" title="Вернуть исходный код">' + ico('reset') + '</button>' +
              '<button class="btn small primary mobile-only" id="ws-check-m">Проверить</button>' +
            '</div>' +
            '<div class="editor-host" id="ws-editor"></div>' +
          '</section>' +
          '<section class="pane pane-view" aria-label="Результат">' +
            '<div class="pane-h"><span class="grow" id="ws-vtitle">Результат</span><button class="btn small ghost" id="ws-run" title="Запустить код">' + ico('play') + '<span class="js-only">Запустить</span></button></div>' +
            '<iframe class="preview" id="ws-preview" sandbox="allow-scripts" title="Результат вашего кода"></iframe>' +
            '<div class="console" id="ws-console" hidden aria-label="Консоль"></div>' +
          '</section>' +
        '</div>' +
      '</div>';

    const ws = app.querySelector('.ws');
    const pane = document.getElementById('pane-task');
    const preview = document.getElementById('ws-preview');
    const consoleEl = document.getElementById('ws-console');
    const editor = ED.create(document.getElementById('ws-editor'), {
      id: 'ws-code', lang: tasks[ti].lang, value: codeFor(ti),
      onChange(v) {
        S.saveTask(lid, tasks[ti].id, { code: v });
        // HTML обновляется на лету, JavaScript запускается кнопкой: незаконченный цикл не должен запускаться сам.
        if (tasks[ti].lang === 'js') return;
        clearTimeout(previewTimer);
        previewTimer = setTimeout(runPreview, 450);
      }
    });
    teardown.push(() => clearTimeout(previewTimer));

    const isJs = () => tasks[ti].lang === 'js';
    function applyLang() {
      ws.classList.toggle('js-mode', isJs());
      document.getElementById('ws-fname').textContent = isJs() ? 'script.js' : 'index.html';
      document.getElementById('ws-vtitle').textContent = isJs() ? 'Консоль' : 'Результат';
      document.getElementById('ws-vtab').textContent = isJs() ? 'Консоль' : 'Результат';
    }
    let emptyTimer = null;
    function runPreview() {
      clearTimeout(emptyTimer);
      consoleEl.innerHTML = '';
      consoleEl.hidden = !isJs();
      R.preview(preview, editor.value, tasks[ti].lang);
      if (isJs()) emptyTimer = setTimeout(() => {
        if (!consoleEl.childElementCount) consoleEl.innerHTML = '<div class="c-muted">Код выполнен, вывода нет. Чтобы увидеть значение, используйте console.log(…).</div>';
      }, 800);
    }
    teardown.push(() => clearTimeout(emptyTimer));
    onMessage(e => {
      if (e.source !== preview.contentWindow || !e.data || e.data.__orbita !== 'console') return;
      consoleEl.hidden = false;
      const muted = consoleEl.querySelector('.c-muted');
      if (muted) muted.remove();
      const line = document.createElement('div');
      line.className = 'c-' + e.data.level;
      line.textContent = (e.data.level === 'error' ? '✖ ' + (e.data.line ? 'строка ' + e.data.line + ': ' : '') : '› ') + e.data.text;
      consoleEl.appendChild(line);
    });

    function setTab(tab) {
      ws.dataset.tab = tab;
      ws.querySelectorAll('.ws-tabs [data-tab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === tab)));
    }
    ws.querySelectorAll('.ws-tabs [data-tab]').forEach(b => b.addEventListener('click', () => setTab(b.dataset.tab)));

    function drawScore() {
      const s = practiceScore(lid);
      document.getElementById('ws-score').innerHTML =
        '<span class="pts">' + s.score + '<small> / ' + s.max + ' б.</small></span>' + (s.passed ? markHtml(s.mark) : '');
      document.getElementById('ws-tasks').innerHTML = tasks.map((t, i) => {
        const st = S.task(lid, t.id);
        const cls = (st.passed ? (st.points ? ' pass' : ' zero') : '') + (i === ti ? ' cur' : '');
        return '<button class="tchip' + cls + '" data-t="' + i + '" aria-label="Задание ' + (i + 1) + (st.passed ? ', выполнено' : '') + '"' + (i === ti ? ' aria-current="step"' : '') + '>' + (st.passed ? ico('check') : '') + (i + 1) + '</button>';
      }).join('');
      document.querySelectorAll('#ws-tasks [data-t]').forEach(b => b.addEventListener('click', () => selectTask(+b.dataset.t)));
    }

    function drawTask() {
      const t = tasks[ti], st = S.task(lid, t.id);
      const worth = st.solution ? 0 : st.hint ? Math.round(t.points * HINT_FACTOR) : t.points;
      const res = results || st.results || null;
      pane.innerHTML =
        (ti === 0 && L.intro ? '<div class="intro-box"><div class="prose">' + L.intro + '</div></div>' : '') +
        '<div class="task-head"><span class="eyebrow">Задание ' + (ti + 1) + ' из ' + tasks.length + ' · ' + (st.passed ? 'получено ' + (st.points || 0) : worth + (worth !== t.points ? ' из ' + t.points : '')) + ' б.</span>' +
          '<h2>' + esc(t.title) + '</h2>' + (t.variants ? '<span class="tag sky">Индивидуальный вариант</span>' : '') + '</div>' +
        '<div class="prose">' + fill(t.text, variantOf(t)) + '</div>' +
        (st.passed ? '<div class="pass-box"><b>Задание выполнено' + (st.points ? ': +' + st.points + ' б.' : '') + '</b>' +
          (st.solution ? '<span class="muted">Решение было открыто, поэтому баллы за задание не начислены.</span>' : '') +
          (ti < tasks.length - 1 ? '<button class="btn ok" id="ws-next">Следующее задание →</button>' : '<button class="btn ok" id="ws-done">Сдать ПЗ</button>') + '</div>' : '') +
        (res && res.errors && res.errors.length
          ? '<div class="code-err"><b>В коде ошибка' + (res.errors[0].line ? ' в строке ' + res.errors[0].line : '') + '</b><code>' + esc(res.errors[0].msg) + '</code></div>' : '') +
        '<div class="checks"><h3>Автопроверка</h3><ul>' +
          t.tests.map((x, i) => {
            const r = res && res[i];
            const cls = r ? (r.ok ? 'ok' : 'fail') : '';
            return '<li class="chk ' + cls + '">' + ico(r ? (r.ok ? 'check' : 'cross') : 'dot') + '<span>' + esc(x.name) + (r && !r.ok && r.msg ? '<span class="msg">' + esc(r.msg) + '</span>' : '') + '</span></li>';
          }).join('') +
        '</ul></div>' +
        '<div class="task-actions">' +
          '<button class="btn primary" id="ws-check">' + ico('check') + 'Проверить <kbd class="desk-only">Ctrl+Enter</kbd></button>' +
          (st.hint || st.solution ? '' : '<button class="btn small" id="ws-hint">' + ico('bulb') + 'Подсказка −30%</button>') +
          (st.solution || !canShowSolution(t) ? '' : '<button class="btn small ' + (solArmed ? 'bad' : 'ghost') + '" id="ws-sol">' + ico('eye') + (solArmed ? 'Точно? Баллы за задание: 0' : 'Показать решение') + '</button>') +
        '</div>' +
        (st.hint ? '<div class="hint-box"><b>Подсказка.</b> ' + fill(t.hint, variantOf(t)) + '</div>' : '') +
        (st.solution && t.variants ? '<p class="note">Открытое решение — пример для другого варианта. Для зачёта задания выполните требования своего варианта.</p>' : '');

      document.getElementById('ws-check').addEventListener('click', runCheck);
      const h = document.getElementById('ws-hint');
      if (h) h.addEventListener('click', () => { S.saveTask(lid, t.id, { hint: true }); drawTask(); });
      const sol = document.getElementById('ws-sol');
      if (sol) sol.addEventListener('click', async () => {
        if (!solArmed) { solArmed = true; drawTask(); return; }
        solArmed = false;
        sol.disabled = true; sol.textContent = 'Загружаем решение…';
        let code = t.solution;
        if (S.remote) {
          const r = await S.solution(lid, t.id);
          if (!r.ok) { toast(r.error === 'network' ? 'Нет связи с сервером. Решение не загружено, баллы не тронуты.' : 'Для этого задания решения нет.', 'cross'); drawTask(); return; }
          code = r.solution;
        }
        S.saveTask(lid, t.id, { solution: true, code });
        editor.value = code; runPreview(); drawTask(); drawScore();
      });
      const nx = document.getElementById('ws-next');
      if (nx) nx.addEventListener('click', () => selectTask(ti + 1));
      const dn = document.getElementById('ws-done');
      if (dn) dn.addEventListener('click', finishPractice);
    }

    function selectTask(i) {
      if (i < 0 || i >= tasks.length) return;
      ti = i; results = null; solArmed = false;
      editor.setLang(tasks[i].lang);
      applyLang();
      editor.value = codeFor(i);
      runPreview(); drawScore(); drawTask();
      setTab('task');
      pane.scrollTop = 0;
    }

    async function runCheck() {
      if (busy) return;
      busy = true;
      const t = tasks[ti];
      const btn = document.getElementById('ws-check');
      if (btn) { btn.disabled = true; btn.textContent = 'Проверяем…'; }
      results = await R.test(editor.value, t.tests, t.lang, variantOf(t));
      busy = false;
      const okAll = results.every(r => r.ok);
      const st = S.task(lid, t.id);
      S.saveTask(lid, t.id, { results, code: editor.value });
      const okCount = results.filter(r => r.ok).length;
      if (okAll && !st.passed) {
        const pts = st.solution ? 0 : Math.round(t.points * (st.hint ? HINT_FACTOR : 1));
        S.saveTask(lid, t.id, { passed: true, points: pts, passedAt: new Date().toISOString() });
        if (pts) S.addXP(pts);
        const sc = practiceScore(lid);
        S.saveResult(lid, { score: sc.score, max: sc.max, pct: sc.pct, mark: sc.mark });
        announceAch(checkAchievements());
        toast('<b>Задание ' + (ti + 1) + ' выполнено!</b>' + (pts ? ' +' + pts + ' XP' : ''), 'check');
      } else if (!okAll) {
        toast('Пройдено проверок: ' + okCount + ' из ' + results.length + '. Подробности во вкладке «Задание».', 'dot');
      } else {
        toast('Все проверки пройдены.', 'check');
      }
      drawScore(); drawTask();
      if (window.matchMedia('(max-width: 999px)').matches && !okAll) setTab('task');
    }

    function finishPractice() {
      const s = practiceScore(lid);
      const back = document.createElement('div');
      back.className = 'modal-back';
      back.innerHTML =
        '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="sum-h">' +
          '<h2 id="sum-h">Сдать ПЗ №' + it.num + '?</h2>' +
          '<table class="sum-table"><tbody>' + tasks.map((t, i) => {
            const st = S.task(lid, t.id);
            return '<tr><td>' + (i + 1) + '. ' + esc(t.title) + '</td><td>' + (st.passed ? (st.points || 0) : '—') + ' / ' + t.points + '</td></tr>';
          }).join('') + '</tbody></table>' +
          '<div class="sum-total"><span>Итого ' + s.score + ' из ' + s.max + ' баллов (' + s.pct + '%)</span>' + markHtml(s.mark) + '</div>' +
          '<p class="note">Шкала: от 85% — «5», от 70% — «4», от 50% — «3». ' + (s.mark ? 'После сдачи можно вернуться и доделать задания: оценка пересчитается.' : 'Пока набрано меньше 50%. Можно сдать сейчас и доделать позже.') + '</p>' +
          '<div class="modal-actions"><button class="btn ghost" id="sum-cancel">Продолжить работу</button><button class="btn primary" id="sum-ok">Сдать</button></div>' +
        '</div>';
      document.body.appendChild(back);
      const close = () => back.remove();
      teardown.push(close);
      back.addEventListener('click', e => { if (e.target === back) close(); });
      document.getElementById('sum-cancel').addEventListener('click', close);
      document.getElementById('sum-ok').addEventListener('click', () => {
        S.saveResult(lid, { done: true, kind: 'practice', score: s.score, max: s.max, pct: s.pct, mark: s.mark, clean: s.clean, finishedAt: new Date().toISOString() });
        S.addXP(10);
        const fresh = checkAchievements();
        close();
        go('course', { course: it.course.id });
        toast('<b>ПЗ №' + it.num + ' сдано.</b> Оценка: ' + (s.mark || 'н/з') + '. +10 XP', 'flag');
        announceAch(fresh);
      });
      document.getElementById('sum-ok').focus();
    }

    document.getElementById('ws-back').addEventListener('click', () => go('course', { course: it.course.id }));
    document.getElementById('ws-finish').addEventListener('click', finishPractice);
    document.getElementById('ws-check-m').addEventListener('click', runCheck);
    document.getElementById('ws-run').addEventListener('click', runPreview);
    document.getElementById('ws-reset').addEventListener('click', () => {
      editor.value = starterFor(ti);
      S.saveTask(lid, tasks[ti].id, { code: editor.value });
      runPreview();
    });
    document.getElementById('ws-file').addEventListener('change', e => {
      const f = e.target.files[0];
      if (!f) return;
      const rd = new FileReader();
      rd.onload = () => {
        editor.value = String(rd.result);
        S.saveTask(lid, tasks[ti].id, { code: editor.value });
        runPreview();
        toast('Файл «' + esc(f.name) + '» загружен. Нажмите «Проверить».', 'upload');
      };
      rd.readAsText(f, 'utf-8');
      e.target.value = '';
    });
    onKey(e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); runCheck(); }
    });

    applyLang(); runPreview(); drawScore(); drawTask();
  }

  /* ---------- отчёт преподавателя ---------- */
  const TEACHER_KEY = 'orbita.teacher';
  const teacherPass = {
    get() { try { return sessionStorage.getItem(TEACHER_KEY) || ''; } catch (e) { return ''; } },
    set(v) { try { if (v) sessionStorage.setItem(TEACHER_KEY, v); else sessionStorage.removeItem(TEACHER_KEY); } catch (e) { /* нет sessionStorage */ } }
  };

  // Пример строк для режима без облака, чтобы было видно, как выглядит заполненный отчёт. Помечены как «пример».
  function exampleRows(c, group) {
    const pz = allItems(c).filter(i => i.kind === 'practice');
    const rnd = (seed => () => (seed = (seed * 9301 + 49297) % 233280) / 233280)(group.length * 31 + 7);
    return Array.from({ length: 10 }, (_, k) => {
      const reach = 1 + Math.floor(rnd() * 3);
      const progress = {};
      pz.slice(0, reach).forEach((it, j) => {
        const pct = Math.round(40 + rnd() * 60);
        progress[it.id] = j < reach - 1 || rnd() > .4 ? { done: true, pct, mark: markFor(pct) } : { started: true, pct };
      });
      progress['l-1-1'] = { done: true };
      return { group, code: String(k + 1).padStart(2, '0'), xp: Math.round(rnd() * 180), progress, tasks: {}, example: true };
    });
  }

  // Похожие решения итоговых заданий: код без комментариев и пробелов режется на фрагменты по 5 символов,
  // сходство — доля общих фрагментов (коэффициент Жаккара).
  const SIMILAR = 0.85;
  const normCode = s => String(s || '').replace(/<!--[\s\S]*?-->|\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
  function grams(s) { const g = new Set(); for (let i = 0; i + 5 <= s.length; i++) g.add(s.slice(i, i + 5)); return g; }
  function similarity(a, b) { let n = 0; a.forEach(x => { if (b.has(x)) n++; }); return n / ((a.size + b.size - n) || 1); }
  function similarPairs(rows, items) {
    const out = [];
    items.forEach(it => {
      const L = O.lessons[it.id];
      if (!L || !L.tasks) return;
      L.tasks.filter(t => t.final).forEach(t => {
        const subs = rows
          .map(p => ({ p, st: (p.tasks || {})[it.id + '/' + t.id] }))
          .filter(x => x.st && x.st.passed && !x.st.solution && normCode(x.st.code).length > 200)
          .map(x => Object.assign(x, { g: grams(normCode(x.st.code)) }));
        for (let i = 0; i < subs.length; i++) {
          for (let j = i + 1; j < subs.length; j++) {
            const s = similarity(subs[i].g, subs[j].g);
            if (s >= SIMILAR) out.push({ it, t, a: subs[i], b: subs[j], s });
          }
        }
      });
    });
    return out.sort((x, y) => y.s - x.s);
  }
  const fmtTime = iso => iso ? new Date(iso).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—';

  const teacherBar = () =>
    '<header class="topbar"><div class="topbar-in"><button class="brand" id="t-home">' + LOGO + '<span>Орбита</span></button>' +
    '<div class="tb-stats"><span class="chip">' + ico('table') + 'Преподаватель</span>' +
    (S.remote && teacherPass.get() ? '<button class="chip user" id="t-out" title="Выйти из отчёта">' + ico('logout') + '</button>' : '') +
    '</div></div></header>';

  function bindTeacherBar() {
    document.getElementById('t-home').addEventListener('click', () => go('home'));
    const out = document.getElementById('t-out');
    if (out) out.addEventListener('click', () => { teacherPass.set(''); go('teacher'); });
  }

  function renderTeacherLogin(message) {
    app.innerHTML = teacherBar() +
      '<main class="login"><div class="login-card">' +
        '<h1>Отчёт преподавателя</h1>' +
        '<p class="muted">Пароль — в Google Таблице: меню «Орбита → Пароль преподавателя».</p>' +
        '<form class="login-form" id="t-form" novalidate>' +
          '<label for="t-pass">Пароль</label>' +
          '<input class="field" type="password" id="t-pass" autocomplete="current-password">' +
          '<div class="form-err" aria-live="polite">' + esc(message || '') + '</div>' +
          '<button class="btn primary big" type="submit">Открыть отчёт</button>' +
        '</form>' +
        '<button class="link" type="button" id="t-back">' + (S.user() ? 'На главную' : 'Ко входу для студентов') + '</button>' +
      '</div></main>';
    bindTeacherBar();
    document.getElementById('t-back').addEventListener('click', () => go('home'));
    document.getElementById('t-form').addEventListener('submit', e => {
      e.preventDefault();
      const v = document.getElementById('t-pass').value.trim();
      if (!v) return;
      teacherPass.set(v);
      go('teacher', { group: state.group, sem: state.sem });
    });
    document.getElementById('t-pass').focus();
  }

  async function renderTeacher() {
    const c = O.courses[0];
    const group = state.group || c.groups[0];
    const sem = state.sem || 1;
    const showEx = !S.remote && state.examples !== false;
    if (S.remote && !teacherPass.get()) return renderTeacherLogin();

    const token = state;
    app.innerHTML = teacherBar() + '<main class="wrap"><p class="muted">Загружаем отчёт группы ' + esc(group) + '…</p></main>';
    bindTeacherBar();
    const r = await S.report(teacherPass.get(), group);
    if (state !== token) return;
    if (!r.ok) {
      if (r.error === 'password' || r.error === 'locked') {
        teacherPass.set('');
        return renderTeacherLogin(r.error === 'locked' ? 'Слишком много неверных попыток. Попробуйте через 10 минут.' : 'Неверный пароль.');
      }
      app.querySelector('main').innerHTML = '<p>Нет связи с сервером: отчёт не загрузился.</p><button class="btn" id="t-retry">Попробовать ещё раз</button>';
      document.getElementById('t-retry').addEventListener('click', () => go('teacher', { group, sem }));
      return;
    }

    const items = allItems(c).filter(i => i.sem === sem);
    const pz = items.filter(i => i.kind === 'practice');
    const th = items.filter(i => i.kind === 'theory');
    let rows = r.profiles.map(p => Object.assign({ progress: {}, tasks: {}, xp: 0 }, p));
    (r.codes || []).forEach(code => {
      if (!rows.some(p => p.code.toUpperCase() === code)) rows.push({ group, code, xp: 0, progress: {}, tasks: {} });
    });
    if (showEx) rows = rows.concat(exampleRows(c, group).filter(e => !rows.some(p => p.code.toUpperCase() === e.code)));
    rows.sort((a, b) => a.code.localeCompare(b.code, 'ru', { numeric: true }));

    const cell = (p, it) => {
      const x = p.progress[it.id];
      if (!x) return { html: '<span class="none">—</span>', text: '' };
      if (x.done) return { html: markHtml(x.mark), text: x.mark ? String(x.mark) : 'н/з' };
      const pct = x.pct != null ? x.pct : (O.lessons[it.id] && !p.example ? practiceScoreFor(p, it.id) : 0);
      return { html: '<span class="pct" title="В работе, не сдано">' + pct + '%</span>', text: '' };
    };
    const theoryDone = p => th.filter(i => p.progress[i.id] && p.progress[i.id].done).length;
    const pairs = similarPairs(rows.filter(p => !p.example), pz);
    const finals = pz.filter(i => O.lessons[i.id] && O.lessons[i.id].tasks.some(t => t.final)).map(i => '№' + i.num);

    app.innerHTML = teacherBar() +
      '<main class="wrap" style="max-width:1200px">' +
        '<div class="course-head"><button class="back" id="t-back">' + ico('back') + (S.user() ? 'На главную' : 'Ко входу') + '</button>' +
          '<span class="eyebrow">' + esc(c.code) + ' · отчёт по практическим занятиям</span><h1>' + esc(c.title) + '</h1></div>' +
        '<div class="rep-tools">' +
          '<label class="sr" for="t-group">Группа</label><select id="t-group">' + c.groups.map(g => '<option' + (g === group ? ' selected' : '') + '>' + esc(g) + '</option>').join('') + '</select>' +
          '<div class="seg" role="tablist" aria-label="Семестр">' + c.semesters.map(s => '<button role="tab" data-sem="' + s.n + '" aria-selected="' + (s.n === sem) + '">' + esc(s.title) + '</button>').join('') + '</div>' +
          (S.remote ? '<button class="btn small" id="t-reload">' + ico('reset') + 'Обновить</button>' : '<label class="tgl"><input type="checkbox" id="t-ex"' + (showEx ? ' checked' : '') + '> Пример данных</label>') +
          '<button class="btn small primary" id="t-copy" style="margin-left:auto">' + ico('copy') + 'Копировать для Excel</button>' +
        '</div>' +
        '<div class="legend"><span>' + markHtml(5) + markHtml(4) + markHtml(3) + ' сдано</span><span>' + markHtml(null) + ' сдано, меньше 50%</span><span><span class="pct">38%</span> в работе</span><span><span class="none">—</span> не начато</span></div>' +
        '<div class="scroll-x"><table class="rep"><thead><tr><th>Код</th>' + pz.map(i => '<th title="' + esc(i.title) + '">ПЗ ' + i.num + '</th>').join('') + '<th>Уроки</th><th>XP</th></tr></thead><tbody>' +
          (rows.length ? rows.map(p => '<tr><td>' + esc(p.code) + (p.example ? '<span class="ex">пример</span>' : '') + '</td>' + pz.map(i => '<td>' + cell(p, i).html + '</td>').join('') +
            '<td>' + theoryDone(p) + '/' + th.length + '</td><td>' + p.xp + '</td></tr>').join('')
            : '<tr><td colspan="' + (pz.length + 3) + '" style="text-align:left;padding:20px" class="muted">' +
              (S.remote ? 'Для группы ' + esc(group) + ' ещё нет кодов. Создайте их в таблице: «Орбита → Создать коды для группы…».' : 'В группе ' + esc(group) + ' пока никто не занимался на этом устройстве.') + '</td></tr>') +
        '</tbody></table></div>' +
        '<p class="note">Шкала: от 85% баллов за ПЗ — «5», от 70% — «4», от 50% — «3». Подсказка снижает баллы за задание на 30%, просмотр решения — до нуля. ' +
          (S.remote ? 'Данные загружены из Google Таблицы только что; кто ещё не входил, показан прочерками.' : 'Без облака видны только студенты, занимавшиеся в этом браузере.') + '</p>' +
        (finals.length ? '<section><div class="section-h"><h2>Похожие решения итоговых заданий</h2></div>' +
          (pairs.length
            ? '<div class="scroll-x"><table class="rep"><thead><tr><th>Задание</th><th>Студенты</th><th>Сходство</th><th>Выполнено</th></tr></thead><tbody>' +
              pairs.map(x => '<tr><td>ПЗ ' + x.it.num + ' · ' + esc(x.t.title) + '</td><td>' + esc(x.a.p.code) + ' и ' + esc(x.b.p.code) + '</td><td>' + Math.round(x.s * 100) + '%</td><td>' + fmtTime(x.a.st.passedAt) + ' / ' + fmtTime(x.b.st.passedAt) + '</td></tr>').join('') +
              '</tbody></table></div>'
            : '<p class="muted">Совпадений не найдено.</p>') +
          '<p class="note">Сравниваются итоговые задания ПЗ ' + finals.join(', ') + ': код без пробелов и комментариев, совпадение от ' + Math.round(SIMILAR * 100) + '%. Это повод посмотреть код вместе со студентами, а не доказательство списывания.</p></section>' : '') +
      '</main>';

    bindTeacherBar();
    const rerender = patch => go('teacher', Object.assign({ group, sem, examples: showEx }, patch));
    document.getElementById('t-group').addEventListener('change', e => rerender({ group: e.target.value }));
    const ex = document.getElementById('t-ex');
    if (ex) ex.addEventListener('change', e => rerender({ examples: e.target.checked }));
    const rl = document.getElementById('t-reload');
    if (rl) rl.addEventListener('click', () => rerender({}));
    app.querySelectorAll('[data-sem]').forEach(b => b.addEventListener('click', () => rerender({ sem: +b.dataset.sem })));
    document.getElementById('t-back').addEventListener('click', () => go('home'));
    document.getElementById('t-copy').addEventListener('click', () => {
      const head = ['Группа', 'Код'].concat(pz.map(i => 'ПЗ №' + i.num), ['Уроки', 'XP']).join('\t');
      const body = rows.filter(p => !p.example).map(p => [group, p.code].concat(pz.map(i => cell(p, i).text), [theoryDone(p) + '/' + th.length, p.xp]).join('\t')).join('\n');
      const text = head + '\n' + body;
      const done = () => toast('Таблица скопирована. Вставьте её в Excel через Ctrl+V.', 'copy');
      const fallback = () => {
        const ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { toast('Не получилось скопировать: выделите таблицу мышью и нажмите Ctrl+C.', 'copy'); }
        ta.remove();
      };
      try { navigator.clipboard.writeText(text).then(done, fallback); } catch (e) { fallback(); }
    });
  }

  function practiceScoreFor(profile, lid) {
    const L = O.lessons[lid];
    let s = 0, max = 0;
    L.tasks.forEach(t => { max += t.points; const st = profile.tasks[lid + '/' + t.id]; if (st && st.passed) s += st.points || 0; });
    return max ? Math.round(s / max * 100) : 0;
  }

  render();
})();
