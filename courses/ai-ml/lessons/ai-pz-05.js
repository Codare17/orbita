/* Собрано из исходников платформы (node build.mjs site). Эталонные решения хранятся в Google Таблице. */
window.ORBITA.lessons['ai-pz-05'] = {
  type: "practice",
  intro: "<p>Словарь хранит пары «ключ: значение» — как одна строка таблицы с подписанными столбцами. Множество хранит только уникальные значения. На этих двух структурах держится подсчёт и группировка данных — то, что потом делает Pandas.</p>",
  tasks: [
    {
      id: "t1",
      title: "Словарь студента",
      points: 10,
      lang: "py",
      text: "<p>Создайте словарь <code>student</code> с ключами <code>\"name\"</code> (строка), <code>\"group\"</code> (строка) и <code>\"marks\"</code> (список минимум из трёх оценок).</p><p>Выведите строку <code>Имя (группа)</code>, например <code>Аня (ИС114)</code>, взяв значения из словаря.</p>",
      starter: "# Словарь student\n",
      hint: "Значение по ключу: <code>student[\"name\"]</code>. Внутри f-строки используйте одинарные кавычки: <code>f\"{student['name']}\"</code>.",
      tests: [
        {
          name: "student — словарь с нужными ключами",
          py: "'Нет переменной student.' if not has('student') else (isinstance(v('student'), dict) and {'name', 'group', 'marks'} <= set(v('student')) or 'Нужен словарь с ключами \"name\", \"group\", \"marks\".')"
        },
        {
          name: "marks — список из 3+ чисел",
          py: "isinstance(v('student'), dict) and isinstance(v('student').get('marks'), list) and len(v('student')['marks']) >= 3 or 'marks должен быть списком минимум из трёх оценок.'"
        },
        {
          name: "Выведено «Имя (группа)»",
          py: "isinstance(v('student'), dict) and inorder([str(v('student').get('name')) + ' (' + str(v('student').get('group')) + ')'])"
        }
      ]
    },
    {
      id: "t2",
      title: "Изменение словаря",
      points: 15,
      lang: "py",
      text: "<p>Дан словарь цен <code>prices</code>. Измените его:</p><ul><li>добавьте <code>\"кофе\"</code> по цене 150;</li><li>измените цену <code>\"чай\"</code> на 90;</li><li>удалите <code>\"сок\"</code>.</li></ul><p>Выведите словарь.</p>",
      starter: "prices = {\"чай\": 80, \"сок\": 120, \"булочка\": 60}\n",
      hint: "Добавить и изменить — одинаково: <code>prices[\"кофе\"] = 150</code>. Удалить — <code>del prices[\"сок\"]</code>.",
      tests: [
        {
          name: "Кофе добавлен",
          py: "isinstance(v('prices'), dict) and v('prices').get('кофе') == 150 or 'В prices нет \"кофе\": 150.'"
        },
        {
          name: "Цена чая — 90",
          py: "isinstance(v('prices'), dict) and v('prices').get('чай') == 90 or 'Цена \"чай\" должна быть 90.'"
        },
        {
          name: "Сок удалён",
          py: "isinstance(v('prices'), dict) and 'сок' not in v('prices') or 'Удалите \"сок\" командой del.'"
        },
        {
          name: "Булочка на месте",
          py: "isinstance(v('prices'), dict) and v('prices').get('булочка') == 60 or 'Остальные товары не трогайте.'"
        }
      ]
    },
    {
      id: "t3",
      title: "Перебор словаря",
      points: 15,
      lang: "py",
      text: "<p>Выведите каждый товар из <code>menu</code> строкой вида <code>чай: 80 руб.</code>, а последней строкой — общую стоимость всех товаров: <code>Итого: 410 руб.</code></p>",
      starter: "menu = {\"чай\": 80, \"кофе\": 150, \"булочка\": 60, \"салат\": 120}\n",
      hint: "<code>for name, price in menu.items():</code> — перебирает сразу ключ и значение.",
      tests: [
        {
          name: "Все товары по порядку",
          py: "inorder(['чай: 80 руб.', 'кофе: 150 руб.', 'булочка: 60 руб.', 'салат: 120 руб.'])"
        },
        {
          name: "Итоговая стоимость",
          py: "inorder(['Итого: 410 руб.'])"
        },
        {
          name: "Используется items()",
          py: "uses(r'\\.items\\s*\\(') or 'Переберите словарь через menu.items().'"
        }
      ]
    },
    {
      id: "t4",
      title: "Подсчёт слов",
      points: 15,
      lang: "py",
      stdin: "кот пёс кот мышь кот пёс",
      text: "<p>Пользователь вводит слова через пробел. Посчитайте с помощью словаря, сколько раз встречается каждое слово, и выведите результат в порядке первого появления:</p><p><code>кот: 3</code><br><code>пёс: 2</code><br><code>мышь: 1</code></p>",
      starter: "words = input().split()\ncounts = {}\n",
      hint: "Для каждого слова: <code>counts[w] = counts.get(w, 0) + 1</code>. Словарь помнит порядок добавления ключей.",
      tests: [
        {
          name: "Пример из задания",
          py: "inorder(['кот: 3', 'пёс: 2', 'мышь: 1'])"
        },
        {
          name: "Другие слова",
          stdin: "да нет да да",
          py: "inorder(['да: 3', 'нет: 1'])"
        },
        {
          name: "Подсчёт в словаре",
          py: "isinstance(v('counts'), dict) and v('counts').get('кот') == 3 or 'Сохраняйте количество в словаре counts.'"
        }
      ]
    },
    {
      id: "t5",
      title: "Множества",
      points: 15,
      lang: "py",
      text: "<p>Даны два списка студентов, которые пришли на занятия в понедельник и во вторник. С помощью множеств выведите три строки:</p><ol><li>сколько разных студентов было за два дня;</li><li>кто был в оба дня — отсортированным списком;</li><li>кто был только в понедельник — отсортированным списком.</li></ol>",
      starter: "monday = [\"Аня\", \"Борис\", \"Вика\", \"Гоша\", \"Аня\"]\ntuesday = [\"Вика\", \"Дина\", \"Аня\", \"Егор\"]\n",
      hint: "<code>set(monday) | set(tuesday)</code> — объединение, <code>&amp;</code> — пересечение, <code>-</code> — разность. <code>sorted()</code> вернёт отсортированный список.",
      tests: [
        {
          name: "Всего разных студентов",
          py: "inorder(['6'])"
        },
        {
          name: "Были в оба дня",
          py: "inorder([\"['Аня', 'Вика']\"])"
        },
        {
          name: "Только в понедельник",
          py: "inorder([\"['Борис', 'Гоша']\"])"
        },
        {
          name: "Используются множества",
          py: "uses(r'\\bset\\s*\\(') or 'Превратите списки в множества через set().'"
        }
      ]
    },
    {
      id: "t6",
      title: "Уникальные значения",
      points: 15,
      lang: "py",
      stdin: "3 1 3 2 1",
      text: "<p>Пользователь вводит числа через пробел. Выведите, сколько среди них разных, и сами разные числа по возрастанию списком.</p><p>Ввод <code>3 1 3 2 1</code> → <code>3</code> и <code>[1, 2, 3]</code>.</p>",
      starter: "numbers = [int(x) for x in input().split()]\n",
      hint: "<code>set(numbers)</code> уберёт повторы, <code>sorted(…)</code> упорядочит.",
      tests: [
        {
          name: "3 1 3 2 1",
          py: "inorder(['3', '[1, 2, 3]'])"
        },
        {
          name: "10 10 10",
          stdin: "10 10 10",
          py: "inorder(['1', '[10]'])"
        },
        {
          name: "Числа, а не строки",
          stdin: "10 9 100",
          py: "inorder(['3', '[9, 10, 100]']) is True or 'Сортируйте числа: при сортировке строк «100» оказывается раньше «9».'"
        }
      ]
    },
    {
      id: "t7",
      title: "Итог: телефонная книга",
      points: 15,
      lang: "py",
      stdin: "Аня",
      final: true,
      text: "<p>Дан словарь <code>book</code>. Пользователь вводит имя. Если имя есть в книге, выведите <code>Аня: +7 900 111-22-33</code>, иначе <code>Нет в книге</code>.</p><p>Поиск не должен зависеть от регистра: <code>аня</code> и <code>АНЯ</code> тоже находят Аню.</p>",
      starter: "book = {\"Аня\": \"+7 900 111-22-33\", \"Борис\": \"+7 900 444-55-66\", \"Вика\": \"+7 900 777-88-99\"}\nname = input()\n",
      hint: "Приведите введённое имя к виду «Аня»: <code>name.capitalize()</code>. Найти без ошибки — <code>book.get(name)</code>.",
      tests: [
        {
          name: "Аня найдена",
          py: "inorder(['Аня: +7 900 111-22-33'])"
        },
        {
          name: "Регистр не важен",
          stdin: "борис",
          py: "inorder(['Борис: +7 900 444-55-66'])"
        },
        {
          name: "Нет в книге",
          stdin: "Гоша",
          py: "inorder(['Нет в книге'])"
        }
      ]
    }
  ]
};
