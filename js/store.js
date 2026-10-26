/* Хранилище прогресса.
   Главная копия — Google Таблица (если в config.js задан api), рабочая копия — localStorage браузера.
   Изменения отправляются в таблицу через 2 секунды после последней правки, при ошибке — повтор через 15 секунд.
   Вход живёт до закрытия вкладки и сбрасывается после 20 минут бездействия: компьютеры в классе общие. */
(function () {
  'use strict';

  const API = ((window.ORBITA_CONFIG || {}).api || '').trim();
  const KEY = 'orbita.v1';
  const SESSION = 'orbita.session';
  const IDLE_MS = 20 * 60 * 1000;
  const MAX_CODE = 20000;

  let db = null;
  try { db = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* хранилище недоступно */ }
  if (!db || typeof db !== 'object') db = {};
  db.profiles = db.profiles || {};
  delete db.user;

  let session = null;
  try { session = JSON.parse(sessionStorage.getItem(SESSION)); } catch (e) { /* нет sessionStorage */ }
  if (session && Date.now() - session.last > IDLE_MS) session = null;

  function saveSession() {
    try { session ? sessionStorage.setItem(SESSION, JSON.stringify(session)) : sessionStorage.removeItem(SESSION); } catch (e) { /* работаем в памяти */ }
  }
  function persistLocal() {
    try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { /* работаем в памяти */ }
  }
  function day(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  const today = () => day(new Date());
  const yesterday = () => day(new Date(Date.now() - 864e5));
  const keyOf = (group, code) => group + '/' + code.toUpperCase();
  // Неделя рейтинга начинается в понедельник 00:00 по Москве. Ключ — дата понедельника; так же считает скрипт таблицы.
  function weekKey(t) {
    const d = new Date((t == null ? Date.now() : t) + 3 * 3600e3);
    const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - (d.getUTCDay() + 6) % 7));
    return monday.toISOString().slice(0, 10);
  }

  function profile() {
    if (!session) return null;
    const k = keyOf(session.group, session.code);
    if (!db.profiles[k]) {
      db.profiles[k] = { group: session.group, code: session.code, xp: 0, streak: { count: 0, last: null }, ach: {}, progress: {}, tasks: {} };
    }
    return db.profiles[k];
  }

  /* ---------- связь с таблицей ---------- */
  let dirty = false, timer = null, status = API ? 'ok' : 'local';
  const listeners = [], resetListeners = [];
  function setStatus(s) { status = s; listeners.forEach(f => f(s)); }

  async function call(body) {
    const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  }

  // В таблицу уходит прогресс без результатов проверок; очень длинный код обрезается.
  function slim(p) {
    const tasks = {};
    Object.keys(p.tasks).forEach(k => {
      const t = Object.assign({}, p.tasks[k]);
      delete t.results;
      if (t.code && t.code.length > MAX_CODE) t.code = t.code.slice(0, MAX_CODE);
      tasks[k] = t;
    });
    return Object.assign({}, p, { tasks });
  }

  async function push() {
    if (!API || !session || !dirty) return;
    dirty = false;
    setStatus('saving');
    try {
      const r = await call({ action: 'save', group: session.group, code: session.code, profile: slim(profile()) });
      if (!r.ok) throw new Error(r.error);
      if (r.reset && r.profile) {
        // Преподаватель сбросил ПЗ: берём очищенный профиль из таблицы.
        db.profiles[keyOf(session.group, session.code)] = r.profile;
        persistLocal();
        resetListeners.forEach(f => f(r.reset));
      }
      setStatus(dirty ? 'saving' : 'ok');
    } catch (e) {
      dirty = true;
      setStatus('offline');
      clearTimeout(timer);
      timer = setTimeout(push, 15000);
    }
  }

  function persist() {
    const p = profile();
    if (p) p.updatedAt = new Date().toISOString();
    persistLocal();
    if (API && session) {
      dirty = true;
      setStatus('saving');
      clearTimeout(timer);
      timer = setTimeout(push, 2000);
    }
  }

  window.addEventListener('pagehide', () => { if (dirty) push(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && dirty) { clearTimeout(timer); push(); } });

  window.OrbitaStore = {
    remote: !!API,
    user: () => session ? { group: session.group, code: session.code } : null,

    /* Вход. Возвращает { ok: true } или { ok: false, error: 'code' | 'locked' | 'network' }. */
    async login(group, code) {
      code = code.trim().toUpperCase();
      if (API) {
        let r;
        try { r = await call({ action: 'login', group, code }); } catch (e) { return { ok: false, error: 'network' }; }
        if (!r.ok) return r;
        const k = keyOf(group, code), local = db.profiles[k], remote = r.profile;
        const localNewer = local && (!remote || (local.updatedAt || '') > (remote.updatedAt || ''));
        if (remote && !localNewer) db.profiles[k] = remote;
        session = { group, code, last: Date.now() };
        saveSession();
        persistLocal();
        if (localNewer) { dirty = true; push(); }
        return { ok: true };
      }
      session = { group, code, last: Date.now() };
      saveSession();
      profile();
      persistLocal();
      return { ok: true };
    },

    async logout() {
      clearTimeout(timer);
      if (dirty) await push();
      if (API && session && !dirty) {
        // Главная копия в таблице: на общем компьютере не оставляем чужой прогресс и код.
        delete db.profiles[keyOf(session.group, session.code)];
        persistLocal();
      }
      session = null;
      saveSession();
    },

    touch() {
      if (!session) return;
      const now = Date.now();
      if (now - session.last > 30000) { session.last = now; saveSession(); }
    },
    idle: () => !!session && Date.now() - session.last > IDLE_MS,

    status: () => status,
    onStatus(fn) { listeners.push(fn); },
    /* Вызывается со списком сброшенных преподавателем ПЗ, например ['pz-05']. */
    onReset(fn) { resetListeners.push(fn); },

    profile,

    streak() {
      const s = profile().streak;
      return s.last === today() || s.last === yesterday() ? s.count : 0;
    },
    addXP(n) {
      const p = profile();
      p.xp += n;
      const w = weekKey();
      p.xpWeek = p.xpWeek || {};
      p.xpWeek[w] = (p.xpWeek[w] || 0) + n;
      Object.keys(p.xpWeek).sort().slice(0, -8).forEach(k => { delete p.xpWeek[k]; });   // храним 8 недель
      const t = today();
      if (p.streak.last !== t) {
        p.streak.count = p.streak.last === yesterday() ? p.streak.count + 1 : 1;
        p.streak.last = t;
      }
      persist();
    },

    result: id => profile().progress[id] || null,
    saveResult(id, r) {
      const p = profile();
      p.progress[id] = Object.assign({}, p.progress[id], r);
      persist();
    },

    task: (lessonId, taskId) => profile().tasks[lessonId + '/' + taskId] || {},
    saveTask(lessonId, taskId, patch) {
      const p = profile();
      const k = lessonId + '/' + taskId;
      p.tasks[k] = Object.assign({}, p.tasks[k], patch);
      persist();
    },

    unlock(id) {
      const p = profile();
      if (p.ach[id]) return false;
      p.ach[id] = today();
      persist();
      return true;
    },

    /* Эталонное решение хранится только в таблице. */
    async solution(lessonId, taskId) {
      if (!API) return { ok: false, error: 'local' };
      try { return await call({ action: 'solution', group: session.group, code: session.code, lesson: lessonId, task: taskId }); }
      catch (e) { return { ok: false, error: 'network' }; }
    },

    weekKey,

    /* Имя для рейтинга и аватар: { name, consent, avatar }. */
    display: () => profile().display || {},
    setDisplay(patch) {
      const p = profile();
      p.display = Object.assign({}, p.display, patch);
      persist();
    },

    /* Рейтинг своей группы: { ok, rows: [{ name, avatar, num, week, all, me }] }. Коды других студентов не приходят. */
    async leaderboard() {
      if (!API) {
        const p = profile(), d = p.display || {};
        return { ok: true, local: true, rows: [{ name: d.consent && d.name ? d.name : '', avatar: d.avatar || '', num: session.code.split('-')[0], week: (p.xpWeek || {})[weekKey()] || 0, all: p.xp, me: true }] };
      }
      try { return await call({ action: 'leaderboard', group: session.group, code: session.code }); }
      catch (e) { return { ok: false, error: 'network' }; }
    },

    /* Отчёт преподавателя: { ok, profiles, codes } или { ok: false, error: 'password' | 'locked' | 'network' }. */
    async report(password, group) {
      if (!API) return { ok: true, profiles: Object.values(db.profiles).filter(p => p.group === group), codes: [] };
      try { return await call({ action: 'report', password, group }); }
      catch (e) { return { ok: false, error: 'network' }; }
    }
  };
})();
