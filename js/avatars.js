/* Аватарки профиля: круг с градиентом и значок. 12 доступны сразу, 12 открываются за достижения и XP.
   need — условие открытия: { ach: 'id достижения' } | { xp: число } | { fives: число ПЗ на «5» }. */
(function () {
  'use strict';

  const G = {
    planet: '<circle cx="12" cy="12" r="5.5"/><ellipse cx="12" cy="12" rx="10.5" ry="3.6" transform="rotate(-20 12 12)"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    comet: '<circle cx="16" cy="8" r="3"/><path d="M13.8 10.2 4 20M12.2 6.8 6 13M17.2 11.8 11 18"/>',
    rocket: '<path d="M12 3c3 2 4.5 5.5 4.5 9.5L14 16h-4l-2.5-3.5C7.5 8.5 9 5 12 3z"/><circle cx="12" cy="9.5" r="1.6"/><path d="M10 16l-1 4 3-2 3 2-1-4"/>',
    ufo: '<ellipse cx="12" cy="13" rx="9" ry="3.5"/><path d="M7.5 11.5a4.5 4.5 0 0 1 9 0M8 17l-1.5 3M16 17l1.5 3M12 17v3"/>',
    cat: '<path d="M5 20v-9L4 5l4.5 3h7L20 5l-1 6v9z"/><path d="M9.5 13v.5M14.5 13v.5M11 16.5h2"/>',
    robot: '<rect x="5" y="8" width="14" height="11" rx="2"/><path d="M12 5v3M9.5 12.5v1M14.5 12.5v1M9.5 16h5M3 12v3M21 12v3"/><circle cx="12" cy="4" r="1"/>',
    gamepad: '<path d="M7 8h10a4 4 0 0 1 3.9 4.9l-.8 3.4a2.4 2.4 0 0 1-4.1 1L14 15h-4l-2 2.3a2.4 2.4 0 0 1-4.1-1l-.8-3.4A4 4 0 0 1 7 8z"/><path d="M8 11v3M6.5 12.5h3M15.5 12h.01M17.5 13.5h.01"/>',
    music: '<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
    coffee: '<path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 3v3M12 3v3"/>',
    ghost: '<path d="M5 20v-9a7 7 0 0 1 14 0v9l-2.5-2-2.3 2-2.2-2-2.2 2-2.3-2z"/><path d="M9.5 11v1M14.5 11v1"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-2.9-5.4 2.9 1.1-6L3.2 9.4l6.1-.8z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M8.5 10h7M8.5 14h7M8.5 18h4"/>',
    diamond: '<path d="M6 4h12l3 5-9 11L3 9z"/><path d="M3 9h18M9 4l3 16 3-16"/>',
    flame: '<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-4 2.5-5 .3 1.7 1.2 2.6 2.2 3 .3-2.8-.4-5.5.3-8z"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    grid: '<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/>',
    tree: '<path d="M12 6v4M12 10 6 15M12 10l6 5M6 15v3M18 15v3"/><circle cx="12" cy="4" r="2"/><circle cx="6" cy="19.5" r="1.5"/><circle cx="18" cy="19.5" r="1.5"/>',
    brush: '<path d="M18 3l3 3-9 9-3-3zM9 12c-3 0-4 2-4 4 0 1.5-1 2.5-2 3 3 1 7 0 8-3"/>',
    crown: '<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>',
    atom: '<circle cx="12" cy="12" r="1.5"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4a3 3 0 0 0 4 4M16 6h4a3 3 0 0 1-4 4M12 13v4M8 21h8M9 17h6"/>'
  };

  const LIST = [
    { id: 'planet', title: 'Планета', bg: ['#3B5BDB', '#7CC7FF'] },
    { id: 'moon', title: 'Луна', bg: ['#5F3DC4', '#9775FA'] },
    { id: 'sun', title: 'Солнце', bg: ['#E8590C', '#FFB547'] },
    { id: 'comet', title: 'Комета', bg: ['#0B7285', '#3BC9DB'] },
    { id: 'rocket', title: 'Ракета', bg: ['#C92A2A', '#FF8787'] },
    { id: 'ufo', title: 'НЛО', bg: ['#2B8A3E', '#69DB7C'] },
    { id: 'cat', title: 'Кот', bg: ['#D9480F', '#FFA94D'] },
    { id: 'robot', title: 'Робот', bg: ['#495057', '#ADB5BD'] },
    { id: 'gamepad', title: 'Геймпад', bg: ['#862E9C', '#DA77F2'] },
    { id: 'music', title: 'Музыка', bg: ['#A61E4D', '#F783AC'] },
    { id: 'coffee', title: 'Кофе', bg: ['#5C3D2E', '#B08968'] },
    { id: 'ghost', title: 'Призрак', bg: ['#364FC7', '#91A7FF'] },
    { id: 'star', title: 'Звезда', bg: ['#E67700', '#FFD43B'], need: { ach: 'first' } },
    { id: 'compass', title: 'Компас', bg: ['#087F5B', '#38D9A9'], need: { ach: 'architect' } },
    { id: 'clipboard', title: 'Анкета', bg: ['#1864AB', '#4DABF7'], need: { ach: 'forms' } },
    { id: 'diamond', title: 'Кристалл', bg: ['#0C8599', '#99E9F2'], need: { ach: 'clean' } },
    { id: 'flame', title: 'Огонь', bg: ['#C92A2A', '#FF922B'], need: { ach: 'streak3' } },
    { id: 'bolt', title: 'Молния', bg: ['#F08C00', '#FFE066'], need: { ach: 'xp100' } },
    { id: 'grid', title: 'Сетка', bg: ['#5F3DC4', '#4DABF7'], need: { ach: 'flex' } },
    { id: 'tree', title: 'Дерево DOM', bg: ['#2B8A3E', '#A9E34B'], need: { ach: 'dom' } },
    { id: 'brush', title: 'Кисть', bg: ['#C2255C', '#FFB547'], need: { ach: 'canvas' } },
    { id: 'trophy', title: 'Кубок', bg: ['#B07D00', '#FFD43B'], need: { fives: 3 } },
    { id: 'crown', title: 'Корона', bg: ['#862E9C', '#FFB547'], need: { xp: 300 } },
    { id: 'atom', title: 'Атом', bg: ['#1B1F3B', '#7CC7FF'], need: { xp: 500 } }
  ];

  const byId = id => LIST.find(a => a.id === id);

  // Аватар по умолчанию — по номеру из кода, чтобы у соседей по списку были разные.
  function fallback(code) {
    const n = parseInt(String(code || '').split('-')[0], 10) || 0;
    return LIST[n % 12].id;
  }

  function svg(id, size) {
    const a = byId(id) || LIST[0];
    const gid = 'av-' + a.id;
    return '<svg class="avatar" width="' + size + '" height="' + size + '" viewBox="0 0 40 40" aria-hidden="true">' +
      '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + a.bg[0] + '"/><stop offset="1" stop-color="' + a.bg[1] + '"/></linearGradient></defs>' +
      '<circle cx="20" cy="20" r="20" fill="url(#' + gid + ')"/>' +
      '<g transform="translate(8 8)" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + G[a.id] + '</g></svg>';
  }

  window.OrbitaAvatars = { list: LIST, byId, fallback, svg };
})();
