/* ПЗ №2. Изображения, звук, передача данных, условие Фано (задания ЕКР 3, 5, 10, 11). */
(function () {
  // Наименьшая суммарная длина кодов для букв с весами weights (сколько раз встречается буква),
  // если коды fixed уже заняты и весь набор должен удовлетворять условию Фано. Перебор строк длиной до 5.
  function fanoBest(fixed, weights) {
    const prefixClash = (a, b) => a.startsWith(b) || b.startsWith(a);
    const cand = [];
    for (let len = 1; len <= 5; len++) for (let x = 0; x < 2 ** len; x++) {
      const s = x.toString(2).padStart(len, '0');
      if (!fixed.some(f => prefixClash(f, s))) cand.push(s);
    }
    const w = weights.slice().sort((a, b) => b - a);
    let best = Infinity, bestSet = null;
    (function dfs(start, chosen) {
      if (chosen.length === w.length) {
        const sum = chosen.reduce((s, c, i) => s + c.length * w[i], 0);
        if (sum < best) { best = sum; bestSet = chosen.slice(); }
        return;
      }
      for (let i = start; i < cand.length; i++) {
        const c = cand[i];
        if (chosen.some(x => prefixClash(x, c))) continue;
        chosen.push(c); dfs(i + 1, chosen); chosen.pop();
      }
    })(0, []);
    return bestSet ? { sum: best, codes: bestSet } : null;
  }
  function randomCodes(r, n) {
    for (;;) {
      const codes = [];
      while (codes.length < n) {
        const len = r.int(2, 3), s = Array.from({ length: len }, () => r.int(0, 1)).join('');
        if (!codes.some(c => c.startsWith(s) || s.startsWith(c))) codes.push(s);
      }
      return codes;
    }
  }

  window.ORBITA.lessons['inf-pz-02'] = {
    type: 'drill',
    intro: '<p>Пригодятся: 1 Кбайт = 2<sup>10</sup> байт, 1 Мбайт = 2<sup>20</sup> байт, 1 байт = 2<sup>3</sup> бит. Раскладывайте числа на степени двойки — так считать без калькулятора намного легче.</p>' +
      '<p>Частота «кГц» — это тысячи (1 кГц = 1000 Гц), а не 1024.</p>',
    tasks: [
      {
        id: 't1', ekr: 10, title: 'Объём рисунка', points: 10,
        hint: 'Цвета: 2ⁱ = число цветов → i бит на пиксель. Объём = ширина · высота · i бит. Делим на 8 и на 1024.',
        gen(r) {
          const D = window.OrbitaDrill;
          return D.retry(r, () => {
            const w = r.pick([64, 128, 256, 512, 1024]), h = r.pick([32, 64, 128, 256, 512]), i = r.pick([1, 2, 3, 4, 6, 8, 12, 16, 24]);
            const bits = w * h * i;
            if (bits % 8192) return null;
            const colors = 2 ** i;
            return {
              text: '<p>Какой минимальный объём памяти (в Кбайт) нужно зарезервировать, чтобы сохранить любое растровое изображение размером ' + w + ' × ' + h + ' пикселей, если в нём могут использоваться ' + D.fmt(colors) + ' различных цветов?</p>',
              unit: 'Кбайт', answer: String(bits / 8192),
              explain: D.fmt(colors) + ' = 2<sup>' + i + '</sup> → ' + i + ' бит на пиксель. ' + w + ' · ' + h + ' · ' + i + ' = ' + D.fmt(bits) + ' бит = ' + D.fmt(bits / 8) + ' байт = ' + D.fmt(bits / 8192) + ' Кбайт.'
            };
          });
        }
      },
      {
        id: 't2', ekr: 10, title: 'Сколько цветов в палитре', points: 10,
        hint: 'Найдите, сколько бит приходится на один пиксель: объём в битах : (ширина · высота). Число цветов = 2 в этой степени.',
        gen(r) {
          const D = window.OrbitaDrill;
          return D.retry(r, () => {
            const w = r.pick([64, 128, 256, 512]), h = r.pick([64, 128, 256]), i = r.pick([2, 3, 4, 5, 6, 8]);
            const bits = w * h * i;
            if (bits % 8192) return null;
            return {
              text: '<p>Растровое изображение размером ' + w + ' × ' + h + ' пикселей занимает ' + D.fmt(bits / 8192) + ' Кбайт памяти. Каково максимально возможное число цветов в палитре изображения?</p>',
              unit: 'цветов', answer: String(2 ** i),
              explain: D.fmt(bits / 8192) + ' Кбайт = ' + D.fmt(bits) + ' бит. На пиксель: ' + D.fmt(bits) + ' : (' + w + ' · ' + h + ') = ' + i + ' бит. Цветов: 2<sup>' + i + '</sup> = ' + 2 ** i + '.'
            };
          });
        }
      },
      {
        id: 't3', ekr: 10, title: 'Фотокамера', points: 10,
        hint: 'Сначала один снимок: ширина · высота · бит на пиксель. Потом число снимков: время работы в секундах : интервал. Перемножьте и переведите в Мбайт.',
        gen(r) {
          const D = window.OrbitaDrill;
          return D.retry(r, () => {
            const w = r.pick([256, 512, 1024]), h = r.pick([256, 512, 1024]), i = r.pick([4, 8, 12, 16, 24]);
            const every = r.pick([5, 10, 15, 20, 30, 60]), hours = r.pick([1, 2, 3, 4, 5, 6, 8, 10, 12]);
            const shots = hours * 3600 / every, bytes = shots * w * h * i / 8;
            if (!Number.isInteger(shots) || bytes % 1048576) return null;
            const mb = bytes / 1048576;
            if (mb > 100000) return null;
            const one = w * h * i / 8 / 1048576;
            return {
              text: '<p>Автоматическая камера каждые ' + every + ' секунд делает цветное растровое изображение, в котором ' + D.fmt(2 ** i) + ' цветов. Размер изображения — ' + w + ' × ' + h + ' пикселей. ' +
                'Изображения записываются подряд без сжатия и без дополнительной информации. Сколько Мбайт нужно для хранения всех изображений за ' + hours + ' ч работы?</p>',
              unit: 'Мбайт', answer: String(mb),
              explain: 'Цветов 2<sup>' + i + '</sup> → ' + i + ' бит. Один снимок: ' + w + ' · ' + h + ' · ' + i + ' бит = ' + String(one).replace('.', ',') + ' Мбайт. ' +
                'Снимков: ' + hours + ' · 3600 : ' + every + ' = ' + D.fmt(shots) + '. Всего: ' + D.fmt(shots) + ' · ' + String(one).replace('.', ',') + ' = ' + D.fmt(mb) + ' Мбайт.'
            };
          });
        }
      },
      {
        id: 't4', ekr: 11, title: 'Время звукозаписи', points: 10,
        hint: 'Объём звука = каналы · частота (Гц) · разрядность (бит) · время (с). Отсюда время = объём в битах : (каналы · частота · разрядность).',
        gen(r) {
          const D = window.OrbitaDrill;
          return D.retry(r, () => {
            const ch = r.pick([1, 2]), khz = r.pick([8, 16, 32, 64, 128]), b = r.pick([8, 16, 24, 32]), t = r.int(16, 400);
            const bits = ch * khz * 1000 * b * t;
            if (bits % 8192) return null;
            const kb = bits / 8192;
            return {
              text: '<p>Производилась ' + (ch === 2 ? 'двухканальная (стерео)' : 'одноканальная (моно)') + ' звукозапись с частотой дискретизации ' + khz + ' кГц и ' + b + '-битным разрешением. ' +
                'Получен файл размером ' + D.fmt(kb) + ' Кбайт, сжатие не производилось. Сколько секунд длилась запись?</p>',
              unit: 'с', answer: String(t),
              explain: 'Объём: ' + D.fmt(kb) + ' · 1024 · 8 = ' + D.fmt(bits) + ' бит. За секунду пишется ' + ch + ' · ' + D.fmt(khz * 1000) + ' · ' + b + ' = ' + D.fmt(ch * khz * 1000 * b) + ' бит. ' +
                'Время: ' + D.fmt(bits) + ' : ' + D.fmt(ch * khz * 1000 * b) + ' = ' + t + ' с.'
            };
          });
        }
      },
      {
        id: 't5', ekr: 11, title: 'Время записи с округлением', points: 10,
        hint: 'Здесь деление не нацело — округлите по правилам математики: 0,5 и больше — вверх. 1 Мбайт = 1024 · 1024 байт.',
        gen(r) {
          const D = window.OrbitaDrill;
          return D.retry(r, () => {
            const ch = r.pick([1, 2]), khz = r.pick([11, 16, 22, 32, 44, 48]), b = r.pick([8, 16]), mb = r.int(2, 40);
            const sec = mb * 1048576 * 8 / (ch * khz * 1000 * b);
            if (Number.isInteger(sec) || Math.abs(sec - Math.round(sec)) > 0.45 || sec < 10) return null;
            return {
              text: '<p>Производилась ' + (ch === 2 ? 'двухканальная (стерео)' : 'одноканальная (моно)') + ' звукозапись с частотой дискретизации ' + khz + ' кГц и ' + b + '-битным разрешением. ' +
                'Получен файл размером ' + mb + ' Мбайт без сжатия. Сколько секунд длилась запись? Ответ округлите до целого.</p>',
              unit: 'с', answer: String(Math.round(sec)),
              explain: mb + ' Мбайт = ' + D.fmt(mb * 1048576) + ' байт = ' + D.fmt(mb * 1048576 * 8) + ' бит. За секунду: ' + ch + ' · ' + D.fmt(khz * 1000) + ' · ' + b + ' = ' + D.fmt(ch * khz * 1000 * b) + ' бит. ' +
                'Время ≈ ' + sec.toFixed(2).replace('.', ',') + ' с → ' + Math.round(sec) + ' с.'
            };
          });
        }
      },
      {
        id: 't6', ekr: 5, title: 'Канал связи: две скорости', points: 10,
        hint: 'Посчитайте отдельно, сколько передано на каждой скорости: скорость · время в секундах. Сложите и переведите Кбит в Кбайт (: 8).',
        gen(r) {
          const D = window.OrbitaDrill;
          return D.retry(r, () => {
            const total = r.int(6, 60), first = r.int(2, total - 2), v = r.pick([128, 256, 320, 512, 640, 768, 1024]), faster = r.chance();
            const v2 = faster ? v * 2 : v / 2;
            const kbit = first * 60 * v + (total - first) * 60 * v2;
            if (kbit % 8) return null;
            return {
              text: '<p>По каналу связи непрерывно в течение ' + total + ' минут передаются данные. Скорость в течение первых ' + first + ' минут — ' + v + ' Кбит в секунду, а в остальное время — в два раза ' + (faster ? 'больше' : 'меньше') + '. ' +
                'Сколько Кбайт данных передано за всё время?</p>',
              unit: 'Кбайт', answer: String(kbit / 8),
              explain: 'Первые ' + first + ' мин: ' + first * 60 + ' с · ' + v + ' = ' + D.fmt(first * 60 * v) + ' Кбит. Остальные ' + (total - first) + ' мин: ' + (total - first) * 60 + ' с · ' + v2 + ' = ' + D.fmt((total - first) * 60 * v2) + ' Кбит. ' +
                'Всего ' + D.fmt(kbit) + ' Кбит : 8 = ' + D.fmt(kbit / 8) + ' Кбайт.'
            };
          });
        }
      },
      {
        id: 't7', ekr: 5, title: 'Канал связи: биты в секунду', points: 10,
        hint: 'Скорость дана в битах в секунду: сначала посчитайте биты, затем : 8 — байты, : 1024 — Кбайты.',
        gen(r) {
          const D = window.OrbitaDrill;
          return D.retry(r, () => {
            const total = r.int(4, 30), first = r.int(1, total - 1), v = r.pick([1024, 2048, 4096, 8192, 16384]), faster = r.chance();
            const v2 = faster ? v * 2 : v / 2;
            const bits = first * 60 * v + (total - first) * 60 * v2;
            if (bits % 8192) return null;
            return {
              text: '<p>По каналу связи непрерывно в течение ' + total + ' минут передаются данные. Скорость в течение первых ' + first + ' минут составляет ' + D.fmt(v) + ' бит в секунду, а в остальное время — в два раза ' + (faster ? 'больше' : 'меньше') + '. ' +
                'Сколько Кбайт данных было передано?</p>',
              unit: 'Кбайт', answer: String(bits / 8192),
              explain: D.fmt(first * 60) + ' с · ' + D.fmt(v) + ' + ' + D.fmt((total - first) * 60) + ' с · ' + D.fmt(v2) + ' = ' + D.fmt(bits) + ' бит = ' + D.fmt(bits / 8) + ' байт = ' + D.fmt(bits / 8192) + ' Кбайт.'
            };
          });
        }
      },
      {
        id: 't8', ekr: 5, title: 'Время передачи файла', points: 10,
        hint: 'Время = объём : скорость. Объём переведите в те же единицы, что и скорость (Кбит): Мбайт · 1024 · 8.',
        gen(r) {
          const D = window.OrbitaDrill;
          return D.retry(r, () => {
            const mb = r.pick([1, 2, 3, 4, 5, 6, 8, 10, 16]), v = r.pick([64, 128, 256, 512, 1024, 2048]);
            const kbit = mb * 1024 * 8, sec = kbit / v;
            if (!Number.isInteger(sec)) return null;
            return {
              text: '<p>Файл размером ' + mb + ' Мбайт передаётся по каналу со скоростью ' + v + ' Кбит/с. Сколько секунд займёт передача?</p>',
              unit: 'с', answer: String(sec),
              explain: mb + ' Мбайт = ' + mb + ' · 1024 · 8 = ' + D.fmt(kbit) + ' Кбит. ' + D.fmt(kbit) + ' : ' + v + ' = ' + sec + ' с.'
            };
          });
        }
      },
      {
        id: 't9', ekr: 3, title: 'Условие Фано: длина всех кодов', points: 10,
        hint: 'Новые коды не должны начинаться с уже занятых и сами не должны быть началом занятых. Перебирайте свободные коды от коротких к длинным: 0, 1, 00, 01…',
        gen(r) {
          const D = window.OrbitaDrill;
          return D.retry(r, () => {
            const letters = r.sample(['А', 'Б', 'В', 'Г', 'Д', 'Е', 'К', 'М'], 5).sort();
            const given = r.int(2, 3), fixed = randomCodes(r, given);
            const best = fanoBest(fixed, Array(5 - given).fill(1));
            if (!best) return null;
            const total = fixed.reduce((s, c) => s + c.length, 0) + best.sum;
            return {
              text: '<p>Для кодирования последовательности из букв ' + letters.join(', ') + ' используют неравномерный двоичный код, удовлетворяющий условию Фано. ' +
                fixed.map((c, i) => (i ? 'для' : 'Для') + ' буквы ' + letters[i] + ' — кодовое слово ' + c).join(', ') + '. ' +
                'Какова наименьшая возможная суммарная длина всех пяти кодовых слов?</p>' +
                '<p class="note">Условие Фано: никакое кодовое слово не является началом другого.</p>',
              answer: String(total),
              explain: 'Занятые коды: ' + fixed.join(', ') + '. Самые короткие свободные коды, не конфликтующие с ними и между собой: ' + best.codes.join(', ') + '. ' +
                'Сумма: ' + fixed.map(c => c.length).concat(best.codes.map(c => c.length)).join(' + ') + ' = ' + total + '.'
            };
          });
        }
      },
      {
        id: 't10', ekr: 3, title: 'Условие Фано: длина слова', points: 10,
        hint: 'Часто встречающимся в слове буквам выгодно дать самые короткие свободные коды. Длина слова = сумма длин кодов всех его букв (с повторами).',
        gen(r) {
          const D = window.OrbitaDrill;
          return D.retry(r, () => {
            const word = r.pick(['ЗАРЯД', 'КАРАТ', 'ПАРАД', 'МАРКА', 'ТАРАН', 'КОЛОС', 'ДОРОГА', 'БАРАБАН', 'КАНАТ', 'ПОТОП']);
            const letters = [...new Set(word.split(''))];
            if (letters.length < 4 || letters.length > 5) return null;
            const known = r.sample(letters, 2), fixed = randomCodes(r, 2);
            const rest = letters.filter(l => !known.includes(l));
            const count = l => word.split('').filter(x => x === l).length;
            const best = fanoBest(fixed, rest.map(count));
            if (!best) return null;
            const total = known.reduce((s, l, i) => s + fixed[i].length * count(l), 0) + best.sum;
            const w = rest.map(count).sort((a, b) => b - a);
            const restSorted = rest.slice().sort((a, b) => count(b) - count(a));
            return {
              text: '<p>Для кодирования букв ' + letters.join(', ') + ' используют неравномерный двоичный код, удовлетворяющий условию Фано. ' +
                'Для буквы ' + known[0] + ' использовали кодовое слово ' + fixed[0] + ', для буквы ' + known[1] + ' — ' + fixed[1] + '. ' +
                'Какова наименьшая возможная длина закодированного слова ' + word + '?</p>',
              answer: String(total),
              explain: 'Свободные короткие коды: ' + best.codes.join(', ') + '. Отдаём их буквам по частоте в слове: ' + restSorted.map((l, i) => l + ' (' + w[i] + ' раз) — ' + best.codes[i]).join(', ') + '. ' +
                'Длина: ' + letters.map(l => { const k = known.indexOf(l); const len = k >= 0 ? fixed[k].length : best.codes[restSorted.indexOf(l)].length; return count(l) + '·' + len; }).join(' + ') + ' = ' + total + '.'
            };
          });
        }
      }
    ]
  };
})();
