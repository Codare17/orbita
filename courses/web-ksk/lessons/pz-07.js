/* Собрано из исходников платформы (node build.mjs site). Эталонные решения хранятся в Google Таблице. */
window.ORBITA.lessons['pz-07'] = {
  type: "practice",
  intro: "<p>Работаем с каталогом товаров <code>products</code>. Каждое задание решается одним методом массива, без циклов <code>for</code>. Не меняйте исходные данные: проверка рассчитана на них.</p>",
  tasks: [
    {
      id: "t1",
      title: "forEach: вывести каталог",
      points: 10,
      lang: "js",
      text: "<p>С помощью <code>forEach</code> выведите каждый товар строкой вида <code>Ноутбук: 65000 руб.</code></p>",
      starter: "const products = [\n  { title: \"Ноутбук\", price: 65000, category: \"техника\", inStock: true },\n  { title: \"Мышь\", price: 900, category: \"техника\", inStock: true },\n  { title: \"Рюкзак\", price: 3200, category: \"аксессуары\", inStock: false },\n  { title: \"Наушники\", price: 4500, category: \"техника\", inStock: true },\n  { title: \"Термокружка\", price: 800, category: \"аксессуары\", inStock: true },\n  { title: \"Монитор\", price: 18000, category: \"техника\", inStock: false },\n  { title: \"Чехол\", price: 1500, category: \"аксессуары\", inStock: true }\n];\n\n",
      hint: "<code>products.forEach(p =&gt; console.log(`${p.title}: ${p.price} руб.`));</code>",
      tests: [
        {
          name: "Все 7 товаров по порядку",
          check: (d, w, H) => H.inOrder(['Ноутбук: 65000 руб.', 'Мышь: 900 руб.', 'Рюкзак: 3200 руб.', 'Наушники: 4500 руб.', 'Термокружка: 800 руб.', 'Монитор: 18000 руб.', 'Чехол: 1500 руб.'])
        },
        {
          name: "Используется forEach",
          check: (d, w, H) => /\.forEach\s*\(/.test(H.src()) || 'Решите через products.forEach(…).'
        }
      ]
    },
    {
      id: "t2",
      title: "map: только названия",
      points: 15,
      lang: "js",
      text: "<p>Создайте массив <code>titles</code> с названиями всех товаров с помощью <code>map</code>.</p>",
      starter: "@prev",
      hint: "map возвращает новый массив: <code>const titles = products.map(p =&gt; p.title);</code>",
      tests: [
        {
          name: "titles — массив названий",
          check: (d, w, H) => H.eq(H.get('titles'), ['Ноутбук', 'Мышь', 'Рюкзак', 'Наушники', 'Термокружка', 'Монитор', 'Чехол']) || 'Сейчас titles = ' + JSON.stringify(H.get('titles'))
        },
        {
          name: "Используется map",
          check: (d, w, H) => /\.map\s*\(/.test(H.src()) || 'Решите через products.map(…).'
        },
        {
          name: "Исходный массив не изменён",
          check: (d, w, H) => {
    const p = H.get('products');
    return (Array.isArray(p) && p.length === 7 && p[0].title === 'Ноутбук' && p[6].title === 'Чехол') || 'Исходный массив products изменился. Методы map, filter, reduce его не меняют, а sort — меняет: сортируйте копию [...products].';
  }
        }
      ]
    },
    {
      id: "t3",
      title: "filter: что в наличии",
      points: 15,
      lang: "js",
      text: "<p>Создайте массив <code>available</code> из товаров, которые есть в наличии (<code>inStock</code> равно <code>true</code>).</p>",
      starter: "@prev",
      hint: "inStock уже логическое значение: <code>products.filter(p =&gt; p.inStock)</code>.",
      tests: [
        {
          name: "В available 5 товаров в наличии",
          check: (d, w, H) => { const a = H.get('available'); return (Array.isArray(a) && H.eq(a.map(p => p.title), ['Ноутбук', 'Мышь', 'Наушники', 'Термокружка', 'Чехол'])) || 'Сейчас: ' + JSON.stringify(a && a.map ? a.map(p => p.title) : a); }
        },
        {
          name: "Используется filter",
          check: (d, w, H) => /\.filter\s*\(/.test(H.src()) || 'Решите через products.filter(…).'
        },
        {
          name: "Исходный массив не изменён",
          check: (d, w, H) => {
    const p = H.get('products');
    return (Array.isArray(p) && p.length === 7 && p[0].title === 'Ноутбук' && p[6].title === 'Чехол') || 'Исходный массив products изменился. Методы map, filter, reduce его не меняют, а sort — меняет: сортируйте копию [...products].';
  }
        }
      ]
    },
    {
      id: "t4",
      title: "reduce: стоимость склада",
      points: 15,
      lang: "js",
      text: "<p>Посчитайте <code>total</code> — сумму цен товаров <b>в наличии</b> — с помощью <code>reduce</code>. Используйте массив <code>available</code> из прошлого задания.</p>",
      starter: "@prev",
      hint: "Не забудьте начальное значение 0: <code>available.reduce((sum, p) =&gt; sum + p.price, 0)</code>.",
      tests: [
        {
          name: "total = 72700",
          check: (d, w, H) => H.get('total') === 72700 || 'Сейчас total = ' + JSON.stringify(H.get('total')) + '. Считайте только товары в наличии.'
        },
        {
          name: "Используется reduce",
          check: (d, w, H) => /\.reduce\s*\(/.test(H.src()) || 'Решите через reduce.'
        }
      ]
    },
    {
      id: "t5",
      title: "find, some, every",
      points: 15,
      lang: "js",
      text: "<ul><li><code>cheap</code> — первый товар дешевле 1000 ₽ (<code>find</code>);</li><li><code>hasExpensive</code> — есть ли товар дороже 50 000 ₽ (<code>some</code>);</li><li><code>allPriced</code> — у всех ли товаров цена больше нуля (<code>every</code>).</li></ul>",
      starter: "@prev",
      hint: "find возвращает сам элемент (объект), а some и every — true или false.",
      tests: [
        {
          name: "cheap — первый товар дешевле 1000",
          check: (d, w, H) => { const c = H.get('cheap'); return (c && c.title === 'Мышь') || 'Ожидается объект «Мышь», сейчас: ' + JSON.stringify(c); }
        },
        {
          name: "hasExpensive — true",
          check: (d, w, H) => H.get('hasExpensive') === true || 'Ноутбук дороже 50 000 ₽, нужно true.'
        },
        {
          name: "allPriced — true",
          check: (d, w, H) => H.get('allPriced') === true || 'У всех товаров цена больше нуля, нужно true.'
        },
        {
          name: "Используются find, some и every",
          check: (d, w, H) => ['find', 'some', 'every'].every(m => new RegExp('\\.' + m + '\\s*\\(').test(H.src())) || 'Используйте все три метода.'
        }
      ]
    },
    {
      id: "t6",
      title: "sort: от дешёвых к дорогим",
      points: 15,
      lang: "js",
      text: "<p>Создайте <code>byPrice</code> — товары, отсортированные по возрастанию цены. Исходный <code>products</code> должен остаться в прежнем порядке.</p>",
      starter: "@prev",
      hint: "<code>sort</code> меняет массив, на котором вызван. Сортируйте копию: <code>[...products].sort((a, b) =&gt; a.price - b.price)</code>.",
      tests: [
        {
          name: "byPrice отсортирован по цене",
          check: (d, w, H) => { const b = H.get('byPrice'); return (Array.isArray(b) && H.eq(b.map(p => p.title), ['Термокружка', 'Мышь', 'Чехол', 'Рюкзак', 'Наушники', 'Монитор', 'Ноутбук'])) || 'Порядок неверный: ' + JSON.stringify(b && b.map ? b.map(p => p.title) : b); }
        },
        {
          name: "Исходный массив не изменён",
          check: (d, w, H) => {
    const p = H.get('products');
    return (Array.isArray(p) && p.length === 7 && p[0].title === 'Ноутбук' && p[6].title === 'Чехол') || 'Исходный массив products изменился. Методы map, filter, reduce его не меняют, а sort — меняет: сортируйте копию [...products].';
  }
        }
      ]
    },
    {
      id: "t7",
      title: "Цепочка: отчёт по категории",
      points: 15,
      lang: "js",
      text: "<p>Напишите функцию <code>report(category)</code>. Она возвращает строку с названиями товаров этой категории, которые есть в наличии, от дешёвых к дорогим, через запятую с пробелом.</p><p><code>report(\"техника\")</code> → <code>Мышь, Наушники, Ноутбук</code>. Если таких товаров нет — пустая строка.</p>",
      starter: "@prev",
      hint: "Цепочка filter → sort → map → join(\", \"). filter создаёт новый массив, поэтому сортировать его можно сразу.",
      tests: [
        {
          name: "report(\"техника\")",
          check: (d, w, H) => { const f = H.get('report'); if (typeof f !== 'function') return 'Не нашли функцию report.'; return f('техника') === 'Мышь, Наушники, Ноутбук' || 'Вернулось: «' + f('техника') + '»'; }
        },
        {
          name: "report(\"аксессуары\")",
          check: (d, w, H) => H.get('report')('аксессуары') === 'Термокружка, Чехол' || 'Вернулось: «' + H.get('report')('аксессуары') + '»'
        },
        {
          name: "Несуществующая категория — пустая строка",
          check: (d, w, H) => H.get('report')('еда') === '' || 'Для report("еда") нужна пустая строка.'
        },
        {
          name: "Исходный массив не изменён",
          check: (d, w, H) => {
    const p = H.get('products');
    return (Array.isArray(p) && p.length === 7 && p[0].title === 'Ноутбук' && p[6].title === 'Чехол') || 'Исходный массив products изменился. Методы map, filter, reduce его не меняют, а sort — меняет: сортируйте копию [...products].';
  }
        }
      ]
    }
  ]
};
