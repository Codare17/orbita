/* Открытка дня: праздник из js/holidays.js (или «Хорошего дня» с вопросом по курсу) и картинка к нему.
   Варианты ответа перемешиваются одинаково для всех в течение дня, чтобы на соседних компьютерах порядок совпадал. */
(function () {
  'use strict';

  const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const pad = n => String(n).padStart(2, '0');
  const dayKey = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const leap = y => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function shuffle(list, seed) {
    const a = list.slice();
    let x = seed || 1;
    for (let i = a.length - 1; i > 0; i--) {
      x = (Math.imul(x, 1103515245) + 12345) >>> 0;
      const j = x % (i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // День программиста — 256-й день года: 13 сентября, а в високосный год 12 сентября.
  function holidayOn(d) {
    let md = pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    if (leap(d.getFullYear())) {
      if (md === '09-13') return null;
      if (md === '09-12') md = '09-13';
    }
    return (window.ORBITA_HOLIDAYS || []).find(h => h.date === md) || null;
  }

  function today(courseId, now) {
    const d = now || new Date();
    const key = dayKey(d);
    const h = holidayOn(d);
    let card;
    if (h) card = Object.assign({}, h);
    else {
      const pool = (window.ORBITA_DAILY_Q || {})[courseId] || [];
      const doy = Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(d.getFullYear(), 0, 1)) / 864e5);
      const q = pool.length ? pool[(doy + d.getFullYear()) % pool.length] : null;
      card = Object.assign({ title: 'Хорошего дня!', kind: 'Обычный день', theme: 'orbit', text: 'Сегодня без особого праздника — зато есть вопрос по курсу.' }, q);
    }
    card.key = key;
    card.dateLabel = d.getDate() + ' ' + MONTHS[d.getMonth()];
    card.holiday = !!h;
    if (card.q) card.options = shuffle([card.a].concat(card.wrong), hash(key + card.q));
    return card;
  }

  /* ---------- картинки: 320×140, цвета платформы ---------- */
  const C = { a: '#FFB547', s: '#7CC7FF', g: '#4ADE80', r: '#FF6B7A', p: '#B79CFF', f: '#ECEFFA', d: '#222A48' };
  const stars = (n, seed, color) => {
    let x = seed, out = '';
    for (let i = 0; i < n; i++) {
      x = (Math.imul(x, 1103515245) + 12345) >>> 0;
      const cx = x % 320; x = (Math.imul(x, 1103515245) + 12345) >>> 0;
      const cy = x % 140;
      out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (i % 3 ? 1 : 1.8) + '" fill="' + (color || C.f) + '" opacity="' + (i % 2 ? .5 : .85) + '"/>';
    }
    return out;
  };
  const ART = {
    space: ['#141B3A', '#2B1F5C', stars(40, 7) +
      '<ellipse cx="236" cy="78" rx="62" ry="14" fill="none" stroke="' + C.s + '" stroke-width="2.5" opacity=".7" transform="rotate(-18 236 78)"/>' +
      '<circle cx="236" cy="78" r="30" fill="' + C.a + '"/><path d="M210 66a30 30 0 0 1 48-8" stroke="#fff" stroke-width="5" fill="none" opacity=".25"/>' +
      '<g transform="translate(78 82) rotate(35)"><path d="M0-38c12 10 14 30 10 46H-10C-14-8-12-28 0-38z" fill="' + C.f + '"/><circle cy="-14" r="6" fill="' + C.s + '"/>' +
      '<path d="M-10 0l-10 14 10-4zM10 0l10 14-10-4z" fill="' + C.r + '"/><path d="M-6 10h12l-6 18z" fill="' + C.a + '"/></g>'],
    tech: ['#10203A', '#123B4A', '<g opacity=".35" stroke="' + C.s + '" stroke-width="1.5" fill="none"><path d="M0 30h50l14 14h40M320 110h-60l-12-12h-30M0 112h30l10-10"/></g>' +
      '<circle cx="104" cy="44" r="3" fill="' + C.s + '"/><circle cx="218" cy="98" r="3" fill="' + C.s + '"/>' +
      '<rect x="100" y="22" width="120" height="80" rx="8" fill="' + C.d + '" stroke="' + C.s + '" stroke-width="2.5"/>' +
      '<rect x="146" y="102" width="28" height="12" fill="' + C.s + '" opacity=".6"/><rect x="128" y="114" width="64" height="5" rx="2.5" fill="' + C.s + '"/>' +
      '<path d="m140 50-14 12 14 12M180 50l14 12-14 12M166 44l-12 36" stroke="' + C.a + '" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<rect x="240" y="30" width="44" height="6" rx="3" fill="' + C.g + '" opacity=".7"/><rect x="240" y="44" width="30" height="6" rx="3" fill="' + C.p + '" opacity=".7"/><rect x="240" y="58" width="38" height="6" rx="3" fill="' + C.a + '" opacity=".7"/>' +
      '<rect x="34" y="66" width="40" height="6" rx="3" fill="' + C.p + '" opacity=".7"/><rect x="34" y="80" width="26" height="6" rx="3" fill="' + C.g + '" opacity=".7"/>'],
    science: ['#1A1640', '#14324A', stars(14, 3, C.p) +
      '<g transform="translate(110 70)" fill="none" stroke-width="2.5"><ellipse rx="58" ry="20" stroke="' + C.s + '"/><ellipse rx="58" ry="20" stroke="' + C.p + '" transform="rotate(60)"/>' +
      '<ellipse rx="58" ry="20" stroke="' + C.g + '" transform="rotate(-60)"/></g><circle cx="110" cy="70" r="10" fill="' + C.a + '"/><circle cx="168" cy="70" r="5" fill="' + C.s + '"/>' +
      '<g transform="translate(232 28)"><path d="M14 0h22M18 0v34L0 82a6 6 0 0 0 6 8h38a6 6 0 0 0 6-8L32 34V0" fill="' + C.d + '" stroke="' + C.f + '" stroke-width="2.5"/>' +
      '<path d="M8 66h34l6 16a4 4 0 0 1-4 6H6a4 4 0 0 1-4-6z" fill="' + C.g + '" opacity=".85"/><circle cx="20" cy="56" r="4" fill="' + C.g + '"/><circle cx="30" cy="44" r="3" fill="' + C.g + '" opacity=".7"/></g>'],
    nature: ['#173A4A', '#1F4A3A', '<circle cx="250" cy="40" r="22" fill="' + C.a + '"/><circle cx="250" cy="40" r="32" fill="' + C.a + '" opacity=".15"/>' +
      '<path d="M0 108c50-34 90-34 140-6s100 24 180-20v58H0z" fill="#2E7A4E"/><path d="M0 124c70-24 130-20 190 0s90 6 130-8v24H0z" fill="#3DA066"/>' +
      '<rect x="74" y="64" width="8" height="34" fill="#7A5232"/><circle cx="78" cy="56" r="22" fill="' + C.g + '"/><circle cx="64" cy="66" r="12" fill="#35B56A"/><circle cx="92" cy="64" r="13" fill="#35B56A"/>' +
      '<path d="M150 36q8-8 16 0q8-8 16 0M190 54q6-6 12 0q6-6 12 0" stroke="' + C.f + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>'],
    books: ['#2A1E3E', '#1E2A4A', stars(10, 11, C.a) +
      '<rect x="70" y="96" width="120" height="18" rx="3" fill="' + C.s + '"/><rect x="80" y="78" width="104" height="18" rx="3" fill="' + C.r + '"/>' +
      '<rect x="74" y="60" width="112" height="18" rx="3" fill="' + C.g + '"/><rect x="86" y="42" width="96" height="18" rx="3" fill="' + C.a + '"/>' +
      '<path d="M78 100h104M88 82h88M82 64h96M94 46h80" stroke="#fff" stroke-width="1.5" opacity=".35"/>' +
      '<g transform="translate(214 44)"><path d="M0 8q26-10 40 2v62Q26 62 0 70z" fill="' + C.f + '"/><path d="M80 8q-26-10-40 2v62q14-10 40-2z" fill="#D8DDF0"/>' +
      '<path d="M8 22h24M8 32h24M8 42h20M48 22h24M48 32h24M48 42h18" stroke="' + C.d + '" stroke-width="2" opacity=".5"/></g>'],
    people: ['#3A1E3A', '#22264A', '<g opacity=".9"><circle cx="110" cy="58" r="18" fill="' + C.a + '"/><path d="M80 120c0-24 14-36 30-36s30 12 30 36z" fill="' + C.a + '"/>' +
      '<circle cx="190" cy="58" r="18" fill="' + C.s + '"/><path d="M160 120c0-24 14-36 30-36s30 12 30 36z" fill="' + C.s + '"/></g>' +
      '<path d="M150 34c-6-10-20-6-18 4 1 7 18 16 18 16s17-9 18-16c2-10-12-14-18-4z" fill="' + C.r + '"/>' +
      '<path d="M40 30c-4-7-14-4-12 3 1 5 12 11 12 11s11-6 12-11c2-7-8-10-12-3zM272 84c-4-7-14-4-12 3 1 5 12 11 12 11s11-6 12-11c2-7-8-10-12-3z" fill="' + C.p + '" opacity=".7"/>' +
      '<path d="M246 30h46a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8h-30l-10 10v-10h-6a8 8 0 0 1-8-8V38a8 8 0 0 1 8-8z" fill="' + C.d + '" stroke="' + C.f + '" stroke-width="2"/>' +
      '<circle cx="258" cy="46" r="3" fill="' + C.f + '"/><circle cx="270" cy="46" r="3" fill="' + C.f + '"/><circle cx="282" cy="46" r="3" fill="' + C.f + '"/>'],
    fun: ['#3A1F38', '#2A2050', (function () {
      let s = '', x = 5;
      const cols = [C.a, C.s, C.g, C.r, C.p];
      for (let i = 0; i < 34; i++) {
        x = (Math.imul(x, 1103515245) + 12345) >>> 0;
        const cx = x % 320; x = (Math.imul(x, 1103515245) + 12345) >>> 0;
        s += '<rect x="' + cx + '" y="' + (x % 140) + '" width="6" height="3" rx="1" fill="' + cols[i % 5] + '" transform="rotate(' + (x % 90) + ' ' + cx + ' ' + (x % 140) + ')"/>';
      }
      return s;
    })() +
      '<path d="M96 76q2 30-6 60" stroke="' + C.f + '" stroke-width="1.5" fill="none" opacity=".6"/><ellipse cx="96" cy="50" rx="22" ry="27" fill="' + C.r + '"/><path d="M92 76h8l-4 6z" fill="' + C.r + '"/>' +
      '<path d="M140 70q-4 30 4 66" stroke="' + C.f + '" stroke-width="1.5" fill="none" opacity=".6"/><ellipse cx="140" cy="44" rx="20" ry="25" fill="' + C.a + '"/><path d="M136 68h8l-4 6z" fill="' + C.a + '"/>' +
      '<path d="M226 80q4 28-4 56" stroke="' + C.f + '" stroke-width="1.5" fill="none" opacity=".6"/><ellipse cx="226" cy="56" rx="20" ry="25" fill="' + C.s + '"/><path d="M222 80h8l-4 6z" fill="' + C.s + '"/>' +
      '<ellipse cx="88" cy="40" rx="5" ry="8" fill="#fff" opacity=".35"/><ellipse cx="133" cy="34" rx="5" ry="8" fill="#fff" opacity=".35"/><ellipse cx="219" cy="46" rx="5" ry="8" fill="#fff" opacity=".35"/>'],
    art: ['#2E1E3A', '#3A2A1E', '<rect x="196" y="22" width="88" height="96" rx="4" fill="#7A5232"/><rect x="204" y="30" width="72" height="80" fill="#1E3A4A"/>' +
      '<circle cx="256" cy="52" r="10" fill="' + C.a + '"/><path d="M204 110l24-34 18 22 12-14 18 26z" fill="' + C.g + '"/>' +
      '<path d="M70 40c40-18 96 0 92 36-2 18-22 14-30 24-8 12 4 26-20 26-44 0-82-62-42-86z" fill="' + C.f + '"/>' +
      '<circle cx="86" cy="60" r="8" fill="' + C.r + '"/><circle cx="110" cy="48" r="8" fill="' + C.a + '"/><circle cx="136" cy="58" r="8" fill="' + C.s + '"/><circle cx="86" cy="88" r="8" fill="' + C.g + '"/>' +
      '<path d="M120 112 176 30" stroke="#C99A5B" stroke-width="5" stroke-linecap="round"/><path d="M176 30l6-10 4 4-6 10z" fill="' + C.p + '"/>'],
    orbit: ['#141B3A', '#1E2A4A', stars(30, 19) +
      '<g transform="translate(160 70)" fill="none" stroke-width="2"><ellipse rx="120" ry="38" transform="rotate(-14)" stroke="' + C.s + '" opacity=".55"/>' +
      '<ellipse rx="78" ry="24" transform="rotate(-14)" stroke="' + C.a + '" opacity=".7"/></g>' +
      '<circle cx="160" cy="70" r="24" fill="' + C.a + '"/><circle cx="160" cy="70" r="36" fill="' + C.a + '" opacity=".12"/>' +
      '<circle cx="276" cy="42" r="7" fill="' + C.f + '"/><circle cx="84" cy="88" r="5" fill="' + C.s + '"/>']
  };

  function art(theme) {
    const t = ART[theme] || ART.orbit, id = 'dg-' + (theme || 'orbit');
    return '<svg class="daily-art" viewBox="0 0 320 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + t[0] + '"/><stop offset="1" stop-color="' + t[1] + '"/></linearGradient></defs>' +
      '<rect width="320" height="140" fill="url(#' + id + ')"/>' + t[2] + '</svg>';
  }

  window.OrbitaDaily = { today, art, holidayOn };
})();
