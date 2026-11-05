/* ПЗ №5. Маски файлов, URL, IP-адрес и маска подсети, пути в графе, база данных родственников (задания ЕКР 1, 14, 15, 16, 19). */
(function () {
  /* ---------- маски имён файлов ---------- */
  const NAMES = ['inform', 'example', 'table', 'report', 'photo', 'music', 'start', 'index', 'data', 'paper', 'lesson', 'program', 'school',
    'prime', 'format', 'forest', 'graph', 'robot', 'media', 'print', 'notes', 'tetris', 'course', 'editor', 'telescope', 'elephant', 'apple', 'design'];
  const EXTS = ['txt', 'doc', 'docx', 'c', 'cpp', 'cs', 'csv', 'exe', 'jpg', 'png', 'pdf', 'xls', 'xlsx', 'mp3', 'ppt', 'html', 'htm', 'cab', 'bat', 'py'];
  const toRe = m => new RegExp('^' + m.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\?/g, '.').replace(/\*/g, '.*') + '$');
  function maskFor(r, name, ext) {
    const p = r.int(0, Math.max(0, name.length - 3)), core = name.slice(p, p + r.int(2, 3));
    const before = name.slice(0, p), after = name.slice(p + core.length);
    const left = before.length === 0 ? r.pick(['', '*']) : before.length === 1 ? r.pick(['?', '*']) : r.pick(['*', '?*', '*?', '??'.slice(0, Math.min(2, before.length)) + (before.length > 2 ? '*' : '')]);
    const right = after.length === 0 ? r.pick(['', '*']) : after.length === 1 ? r.pick(['?', '*']) : r.pick(['*', '?*', '*?']);
    const e = ext.length === 1 ? r.pick([ext, '?', '*']) : r.pick([ext[0] + '*', ext[0] + '?*', '?' + ext.slice(1), ext[0] + '?'.repeat(ext.length - 1), '*' + ext.slice(-1)]);
    return left + core + right + '.' + e;
  }
  function maskTask(r) {
    const D = window.OrbitaDrill;
    return D.retry(r, () => {
      const name = r.pick(NAMES), ext = r.pick(EXTS), mask = maskFor(r, name, ext), re = toRe(mask);
      const [nm, em] = mask.split('.'), reN = toRe(nm), reE = toRe(em);
      if (!re.test(name + '.' + ext)) return null;
      // Отвлекающие варианты: подходят по имени или по расширению, но не целиком.
      const pool = [];
      NAMES.forEach(n => EXTS.forEach(x => { const f = n + '.' + x; if (!re.test(f) && (reN.test(n) || reE.test(x))) pool.push(f); }));
      for (let i = 0; i < 12; i++) {
        const k = r.int(0, name.length - 1), ch = 'aeiourstn'[r.int(0, 8)];
        const n = name.slice(0, k) + ch + name.slice(k + 1), x = r.chance() ? ext : r.pick(EXTS);
        const f = n + '.' + x;
        if (!re.test(f)) pool.push(f);
      }
      const wrong = [...new Set(r.shuffle(pool))].slice(0, 3);
      if (wrong.length < 3) return null;
      const opts = r.shuffle([name + '.' + ext].concat(wrong)), ans = opts.indexOf(name + '.' + ext) + 1;
      return {
        text: '<p>Символ «?» в маске означает ровно один произвольный символ, «*» — любую последовательность символов, в том числе пустую. Какое из имён файлов удовлетворяет маске <b class="dr-mono">' + mask + '</b>?</p>',
        options: opts, answer: String(ans), mask,
        explain: 'Маска делится точкой на имя «' + nm + '» и расширение «' + em + '». ' + opts.map((f, i) => {
          const [n, x] = [f.slice(0, f.lastIndexOf('.')), f.slice(f.lastIndexOf('.') + 1)];
          if (i + 1 === ans) return f + ' — подходит.';
          return f + ' — нет: ' + (!reN.test(n) ? 'имя «' + n + '» не подходит под «' + nm + '»' : 'расширение «' + x + '» не подходит под «' + em + '»') + '.';
        }).join(' ')
      };
    });
  }

  /* ---------- графы ---------- */
  const NODE = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И'];
  function layout(n) {
    const mid = n - 2, cols = Math.ceil(mid / 2), pos = [[40, 125]];
    for (let k = 1; k <= mid; k++) {
      const c = Math.ceil(k / 2), x = 40 + c * 440 / (cols + 1);
      pos.push([Math.round(x), mid % 2 && k === mid ? 125 : k % 2 ? 50 : 200]);
    }
    pos.push([480, 125]);
    return pos;
  }
  function randomGraph(r, n) {
    for (;;) {
      const edges = [];
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n && j - i <= 3; j++) if (r.chance(0.5)) edges.push([i, j]);
      const outs = i => edges.filter(e => e[0] === i).length, ins = j => edges.filter(e => e[1] === j).length;
      let ok = outs(0) >= 2 && ins(n - 1) >= 2;
      for (let k = 1; k < n - 1; k++) if (!ins(k) || !outs(k)) ok = false;
      if (ok && edges.length <= n * 2) return edges;
    }
  }
  const countPaths = (n, edges, from, to) => {
    const p = Array(n).fill(0); p[from] = 1;
    for (let j = from + 1; j <= to; j++) p[j] = edges.filter(e => e[1] === j && e[0] >= from).reduce((s, e) => s + p[e[0]], 0);
    return p;
  };

  /* ---------- база данных родственников ---------- */
  const SURN = ['Петров', 'Иванов', 'Сидоров', 'Кузнецов', 'Смирнов', 'Орлов', 'Волков', 'Зайцев', 'Морозов', 'Лебедев', 'Соколов', 'Козлов', 'Новиков', 'Фёдоров', 'Белов', 'Громов'];
  const INIT = 'АБВГДЕИКЛМНОПРСТФ'.split('');
  const fem = s => s + 'а';
  const gen = p => p.sex === 'М' ? p.sur + 'а ' + p.ini : p.sur.slice(0, -1) + 'ой ' + p.ini;   // Петров → Петрова, Петрова → Петровой
  const REL = {
    'родной тёти': { note: 'родная тётя — сестра матери или отца (у них общие родители)', find: (f, t) => siblingsOfParents(f, t).filter(p => p.sex === 'Ж') },
    'родного дяди': { note: 'родной дядя — брат матери или отца (у них общие родители)', find: (f, t) => siblingsOfParents(f, t).filter(p => p.sex === 'М') },
    'бабушки': { note: 'бабушка — мать матери или отца', find: (f, t) => parentsOf(f, t).flatMap(p => parentsOf(f, p)).filter(p => p.sex === 'Ж') },
    'двоюродной сестры': { note: 'двоюродная сестра — дочь родного брата или сестры одного из родителей', find: (f, t) => siblingsOfParents(f, t).flatMap(p => childrenOf(f, p)).filter(p => p.sex === 'Ж') },
    'двоюродного брата': { note: 'двоюродный брат — сын родного брата или сестры одного из родителей', find: (f, t) => siblingsOfParents(f, t).flatMap(p => childrenOf(f, p)).filter(p => p.sex === 'М') }
  };
  const parentsOf = (f, p) => f.links.filter(l => l[1] === p).map(l => l[0]);
  const childrenOf = (f, p) => f.links.filter(l => l[0] === p).map(l => l[1]);
  function siblingsOfParents(f, t) {
    const out = new Set();
    parentsOf(f, t).forEach(par => parentsOf(f, par).forEach(g => childrenOf(f, g).forEach(c => { if (c !== par) out.add(c); })));
    return [...out];
  }
  function family(r) {
    const people = [], links = [];
    const used = new Set();
    const person = (sur, sex, father) => {
      let ini;
      do { ini = r.pick(INIT) + '. ' + (father ? father.ini[0] : r.pick(INIT)) + '.'; } while (used.has(sur + ini));
      used.add(sur + ini);
      const p = { sur: sex === 'Ж' ? fem(sur) : sur, sex, ini, base: sur };
      people.push(p);
      return p;
    };
    const [s1, ...others] = r.shuffle(SURN);
    const g1 = person(s1, 'М'), g2 = person(s1, 'Ж');
    const kids = Array.from({ length: r.int(3, 4) }, () => {
      const sex = r.pick(['М', 'Ж']);
      const k = person(sex === 'М' ? s1 : others.pop(), sex, g1);   // дочери носят фамилию мужа
      links.push([g1, k], [g2, k]);
      return k;
    });
    kids.forEach(k => {
      const sur = k.base;   // дети замужней дочери носят фамилию её мужа
      for (let i = r.int(1, 2); i > 0; i--) {
        const sex = r.pick(['М', 'Ж']);
        const c = person(sur, sex, k.sex === 'М' ? k : null);
        links.push([k, c]);
      }
    });
    // Посторонний человек — однофамилец без связей, чтобы нельзя было угадывать по фамилии.
    person(s1, r.pick(['М', 'Ж']));
    return { people, links };
  }
  function relTask(r) {
    const D = window.OrbitaDrill;
    return D.retry(r, () => {
      const f = family(r);
      const grand = f.people.filter(p => parentsOf(f, p).length && parentsOf(f, parentsOf(f, p)[0]).length);
      const t = r.pick(grand), rel = r.pick(Object.keys(REL));
      const found = REL[rel].find(f, t);
      if (found.length !== 1) return null;
      const big = r.chance();
      const ids = r.sample(Array.from({ length: big ? 900 : 89 }, (_, i) => i + (big ? 1000 : 10)), f.people.length);
      f.people.forEach((p, i) => { p.id = ids[i]; });
      const t1 = f.people.slice().sort((a, b) => a.id - b.id);
      const t2 = r.shuffle(f.links).sort((a, b) => a[0].id - b[0].id);
      const par = parentsOf(f, t);
      return {
        text: '<p>Во фрагменте базы данных представлены сведения о родственных отношениях. Определите ID ' + rel + ' ' + gen(t) + '</p><p class="note">Примечание: ' + REL[rel].note + '.</p>',
        table: '<div class="dr-tables"><div><p class="note">Таблица 1</p>' + D.table(['ID', 'Фамилия_И. О.', 'Пол'], t1.map(p => [p.id, p.sur + ' ' + p.ini, p.sex]), 'left') + '</div>' +
          '<div><p class="note">Таблица 2</p>' + D.table(['ID_Родителя', 'ID_Ребёнка'], t2.map(l => [l[0].id, l[1].id])) + '</div></div>',
        answer: String(found[0].id),
        explain: gen(t).replace(/^./, c => c.toUpperCase()) + ' — ID ' + t.id + '. В таблице 2 находим родителя: ID ' + par.map(p => p.id).join(', ') + '. ' +
          (rel === 'бабушки'
            ? 'Родители этого человека: ' + parentsOf(f, par[0]).map(p => p.id + ' (' + p.sex + ')').join(', ') + '. Женщина — ID ' + found[0].id + '.'
            : 'Родители этого человека: ' + parentsOf(f, par[0]).map(p => p.id).join(' и ') + '. Их другие дети: ' + siblingsOfParents(f, t).map(p => p.id + ' (' + p.sex + ')').join(', ') + '. ' +
              (/двоюрод/.test(rel) ? 'Дети этих людей: ' + siblingsOfParents(f, t).flatMap(p => childrenOf(f, p)).map(p => p.id + ' (' + p.sex + ')').join(', ') + '. ' : '') +
              'Подходит ID ' + found[0].id + ' — ' + found[0].sur + ' ' + found[0].ini)
      };
    });
  }

  /* ---------- IP-адреса ---------- */
  const ip2n = s => s.split('.').reduce((n, o) => n * 256 + +o, 0);
  const n2ip = n => [n >>> 24, n >>> 16 & 255, n >>> 8 & 255, n & 255].join('.');
  const maskN = len => len ? (0xFFFFFFFF << (32 - len)) >>> 0 : 0;
  const bin8 = n => n.toString(2).padStart(8, '0');

  window.ORBITA.lessons['inf-pz-05'] = {
    type: 'drill',
    intro: '<p>В заданиях с выбором ответа одна попытка — как на бланке ЕКР. Прежде чем нажать, проверьте каждый вариант.</p>' +
      '<p>Адрес сети = IP-адрес AND маска (поразрядное «И»): там, где в маске 1, бит остаётся, где 0 — становится 0.</p>',
    tasks: [
      { id: 't1', ekr: 1, title: 'Маска имени файла', points: 10, hint: 'Разделите маску по точке на «имя» и «расширение» и проверяйте их отдельно. «?» — ровно один символ, «*» — сколько угодно, даже ноль.', gen: maskTask },
      {
        id: 't2', ekr: 1, title: 'Сколько файлов подходят', points: 10,
        hint: 'Проверьте каждое имя по очереди: сначала расширение (это быстрее), потом имя.',
        gen(r) {
          const D = window.OrbitaDrill;
          return D.retry(r, () => {
            const name = r.pick(NAMES), ext = r.pick(EXTS), mask = maskFor(r, name, ext), re = toRe(mask);
            const files = new Set([name + '.' + ext]);
            while (files.size < 6) files.add(r.pick(NAMES) + '.' + (r.chance(0.5) ? ext : r.pick(EXTS)));
            const list = r.shuffle([...files]), n = list.filter(f => re.test(f)).length;
            if (n < 1 || n > 4) return null;
            return {
              text: '<p>Сколько файлов из списка удовлетворяют маске <b class="dr-mono">' + mask + '</b>?</p><p class="dr-mono">' + list.join('<br>') + '</p>',
              answer: String(n),
              explain: 'Подходят: ' + list.filter(f => re.test(f)).join(', ') + ' — всего ' + n + '.'
            };
          });
        }
      },
      {
        id: 't3', ekr: 14, title: 'Адрес файла в интернете', points: 10,
        hint: 'Адрес собирается так: протокол :// сервер / файл. Например: https://mail.school.edu/report.pdf.',
        gen(r) {
          const D = window.OrbitaDrill;
          const proto = r.pick(['http', 'https', 'ftp']), h1 = r.pick(['www.', 'mail.', 'ftp.', 'edu.', 'docs.']), h2 = r.pick(['spo.', 'info.', 'school.', 'college.', 'site.', 'spot.']);
          const tld = r.pick(['ru', 'edu', 'org', 'com', 'net']), file = r.pick(['report', 'info', 'comp', 'spot', 'task', 'plan', 'list', 'exam']), ext = r.pick(['.pdf', '.doc', '.xls', '.jpg', '.txt', '.htm']);
          const parts = [proto, '://', h1, h2, tld, '/', file, ext];
          const L = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З'], shuffled = r.shuffle(parts.map((p, i) => i));
          const ans = parts.map((p, i) => L[shuffled.indexOf(i)]).join('');
          return {
            text: '<p>Доступ к файлу <b>' + file + ext + '</b>, который находится на сервере <b>' + h1 + h2 + tld + '</b>, осуществляется по протоколу <b>' + proto + '</b>. ' +
              'Фрагменты адреса файла обозначены буквами от А до З. Запишите последовательность букв, соответствующую адресу файла.</p>',
            table: D.table(L, [shuffled.map(i => '<span class="dr-mono">' + parts[i] + '</span>')]),
            answer: ans, letters: 'ru',
            explain: 'Адрес: ' + parts.join('') + '. По фрагментам: ' + parts.map((p, i) => p + ' — ' + L[shuffled.indexOf(i)]).join(', ') + '. Ответ: ' + ans + '.'
          };
        }
      },
      {
        id: 't4', ekr: 15, title: 'Номер компьютера в сети', points: 10,
        hint: 'Номер компьютера — это биты IP-адреса там, где в маске нули. Переведите в двоичную систему только тот байт, где маска не 255 и не 0.',
        gen(r) {
          const len = r.int(17, 30), m = maskN(len), ip = ((r.int(1, 223) << 24) | (r.int(0, 255) << 16) | (r.int(0, 255) << 8) | r.int(1, 254)) >>> 0;
          const host = (ip & ~m) >>> 0;
          const k = Math.floor(len / 8), mo = (m >>> (24 - 8 * k)) & 255;
          return {
            text: '<p>Маска подсети — <b class="dr-mono">' + n2ip(m) + '</b>, IP-адрес компьютера — <b class="dr-mono">' + n2ip(ip) + '</b>. Чему равен номер компьютера в этой сети? Ответ запишите десятичным числом.</p>',
            answer: String(host),
            explain: 'В маске ' + len + ' единиц (' + mo + ' = ' + bin8(mo) + '), значит номер компьютера — последние ' + (32 - len) + ' бит адреса. ' +
              'Последние байты адреса: ' + n2ip(ip).split('.').slice(k).map(o => bin8(+o)).join(' ') + '. Берём ' + (32 - len) + ' младших бит: ' + host.toString(2).padStart(32 - len, '0') + '<sub>2</sub> = ' + host + '.'
          };
        }
      },
      {
        id: 't5', ekr: 15, title: 'Адрес сети', points: 10,
        hint: 'Поразрядное «И» по байтам: 255 оставляет байт как есть, 0 обнуляет. Для «неполного» байта переведите оба числа в двоичную систему.',
        gen(r) {
          const len = r.pick([18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29]), m = maskN(len);
          const ip = ((r.int(10, 223) << 24) | (r.int(0, 255) << 16) | (r.int(0, 255) << 8) | r.int(1, 254)) >>> 0, net = (ip & m) >>> 0;
          const k = Math.floor(len / 8), mo = (m >>> (24 - 8 * k)) & 255, io = (ip >>> (24 - 8 * k)) & 255;
          return {
            text: '<p>IP-адрес узла — <b class="dr-mono">' + n2ip(ip) + '</b>, маска подсети — <b class="dr-mono">' + n2ip(m) + '</b>. Определите адрес сети. Ответ запишите в виде четырёх чисел через точку.</p>',
            answer: n2ip(net),
            explain: 'Байты, где маска 255, копируем, где 0 — пишем 0. ' + (k + 1) + '-й байт: ' + bin8(io) + ' AND ' + bin8(mo) + ' = ' + bin8(io & mo) + ' = ' + (io & mo) + '. Адрес сети: ' + n2ip(net) + '.'
          };
        }
      },
      {
        id: 't6', ekr: 15, title: 'Наименьшее число единиц в маске', points: 10,
        hint: 'Найдите первый байт, где IP-адрес и адрес сети различаются, и сравните их двоичные записи. Маска должна «обнулить» все отличающиеся биты.',
        gen(r) {
          const D = window.OrbitaDrill;
          return D.retry(r, () => {
            const len = r.int(17, 29), m = maskN(len);
            const ip = ((r.int(10, 223) << 24) | (r.int(0, 255) << 16) | (r.int(0, 255) << 8) | r.int(1, 254)) >>> 0, net = (ip & m) >>> 0;
            let min = 0;
            while (((ip & maskN(min)) >>> 0) !== net) min++;
            if (min < 17) return null;
            const k = Math.floor((min - 1) / 8), io = (ip >>> (24 - 8 * k)) & 255, no = (net >>> (24 - 8 * k)) & 255;
            return {
              text: '<p>Для узла с IP-адресом <b class="dr-mono">' + n2ip(ip) + '</b> адрес сети равен <b class="dr-mono">' + n2ip(net) + '</b>. Найдите наименьшее возможное количество единиц в двоичной записи маски подсети.</p>',
              answer: String(min),
              explain: (k + 1) + '-й байт: адрес ' + io + ' = ' + bin8(io) + ', сеть ' + no + ' = ' + bin8(no) + '. Чтобы получить сеть, маске нужно ' + (min - 8 * k) + ' единиц в этом байте (последняя единица — у самой младшей единицы адреса сети). ' +
                'Плюс ' + 8 * k + ' единиц в предыдущих байтах: ' + 8 * k + ' + ' + (min - 8 * k) + ' = ' + min + '.'
            };
          });
        }
      },
      {
        id: 't7', ekr: 16, title: 'Пути в графе', points: 10,
        hint: 'Идите слева направо: у А — 1 путь. Число путей в пункт = сумма путей во все пункты, из которых в него ведёт стрелка.',
        gen(r) {
          const D = window.OrbitaDrill, n = r.int(6, 8), edges = randomGraph(r, n), names = NODE.slice(0, n), p = countPaths(n, edges, 0, n - 1);
          return {
            text: '<p>На рисунке — схема дорог, связывающих пункты ' + names.join(', ') + '. По каждой дороге можно двигаться только в направлении стрелки. Сколько существует различных путей из пункта А в пункт ' + names[n - 1] + '?</p>',
            img: D.graphSvg(names, layout(n), edges),
            answer: String(p[n - 1]),
            explain: names.map((nm, i) => nm + ' = ' + (i ? edges.filter(e => e[1] === i).map(e => names[e[0]]).join(' + ') + ' = ' + p[i] : '1')).join('; ') + '.'
          };
        }
      },
      {
        id: 't8', ekr: 16, title: 'Пути через пункт', points: 10,
        hint: 'Путей через пункт X = (путей из А в X) · (путей из X в конец). Посчитайте обе части отдельно.',
        gen(r) {
          const D = window.OrbitaDrill;
          return D.retry(r, () => {
            const n = r.int(7, 8), edges = randomGraph(r, n), names = NODE.slice(0, n);
            const x = r.int(2, n - 3), a = countPaths(n, edges, 0, n - 1)[x], b = countPaths(n, edges, x, n - 1)[n - 1];
            if (a * b < 3) return null;
            return {
              text: '<p>По схеме дорог (двигаться можно только по стрелкам) определите, сколько существует различных путей из пункта А в пункт ' + names[n - 1] + ', <b>проходящих через пункт ' + names[x] + '</b>.</p>',
              img: D.graphSvg(names, layout(n), edges),
              answer: String(a * b),
              explain: 'Путей из А в ' + names[x] + ': ' + a + '. Путей из ' + names[x] + ' в ' + names[n - 1] + ': ' + b + '. Всего ' + a + ' · ' + b + ' = ' + a * b + '.'
            };
          });
        }
      },
      { id: 't9', ekr: 19, title: 'База данных: родственники', points: 10, hint: 'Найдите ID человека в таблице 1, его родителей — в таблице 2 (он стоит в столбце ID_Ребёнка), затем родителей родителя и их других детей.', gen: relTask },
      { id: 't10', ekr: 19, title: 'База данных: ещё раз', points: 10, hint: 'Двигайтесь по таблице 2 шаг за шагом и выписывайте ID на черновике: ребёнок → родитель → бабушка и дедушка → их дети.', gen: relTask }
    ]
  };
})();
