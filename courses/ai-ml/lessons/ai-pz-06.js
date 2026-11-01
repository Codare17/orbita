/* Собрано из исходников платформы (node build.mjs site). Эталонные решения хранятся в Google Таблице. */
window.ORBITA.lessons['ai-pz-06'] = {
  type: "practice",
  intro: "<p>Функции позволяют назвать кусок кода и вызывать его много раз. Проверка будет вызывать ваши функции с разными значениями, поэтому важно точно соблюсти имя функции и <b>возвращать</b> результат через <code>return</code>, а не печатать его.</p><p>Во второй части — файлы: данные для ИИ почти всегда приходят в файлах, чаще всего в формате CSV.</p>",
  tasks: [
    {
      id: "t1",
      title: "Приветствие функцией",
      points: 10,
      lang: "py",
      text: "<p>Напишите функцию <code>greet(name)</code>, которая <b>возвращает</b> строку <code>Привет, Аня!</code> для имени «Аня».</p>",
      starter: "# Функция greet\n\n\nprint(greet(\"Аня\"))\n",
      hint: "<code>def greet(name):</code> и внутри <code>return f\"Привет, {name}!\"</code>.",
      tests: [
        {
          name: "greet(\"Аня\") → «Привет, Аня!»",
          py: "cases('greet', [('Аня', 'Привет, Аня!')])"
        },
        {
          name: "Работает с любым именем",
          py: "cases('greet', [('Борис', 'Привет, Борис!')])"
        }
      ]
    },
    {
      id: "t2",
      title: "Квадрат и чётность",
      points: 15,
      lang: "py",
      text: "<p>Напишите две функции:</p><ul><li><code>square(x)</code> — возвращает квадрат числа;</li><li><code>is_even(n)</code> — возвращает <code>True</code>, если число чётное, иначе <code>False</code>.</li></ul>",
      starter: "# Функции square и is_even\n",
      hint: "Выражение <code>n % 2 == 0</code> уже равно True или False — его можно сразу вернуть.",
      tests: [
        {
          name: "square",
          py: "cases('square', [(7, 49), (-3, 9), (0, 0)])"
        },
        {
          name: "is_even",
          py: "cases('is_even', [(4, True), (7, False), (0, True), (-2, True)])"
        }
      ]
    },
    {
      id: "t3",
      title: "Оценка по баллам",
      points: 15,
      lang: "py",
      text: "<p>Оформите шкалу оценок функцией <code>grade(score)</code>: от 85 — <code>5</code>, от 70 — <code>4</code>, от 50 — <code>3</code>, иначе <code>2</code>. Функция возвращает число.</p>",
      starter: "# Функция grade\n",
      hint: "В функции можно сразу возвращать результат в каждой ветке: <code>if score &gt;= 85: return 5</code>.",
      tests: [
        {
          name: "Обычные значения",
          py: "cases('grade', [(92, 5), (78, 4), (55, 3), (10, 2)])"
        },
        {
          name: "Граничные значения",
          py: "cases('grade', [(85, 5), (84, 4), (70, 4), (69, 3), (50, 3), (49, 2)])"
        }
      ]
    },
    {
      id: "t4",
      title: "Среднее значение",
      points: 15,
      lang: "py",
      text: "<p>Напишите функцию <code>average(values)</code>, которая возвращает среднее арифметическое списка чисел. Для пустого списка — <code>0</code>.</p>",
      starter: "# Функция average\n",
      hint: "Сначала <code>if len(values) == 0: return 0</code>, потом сумма делить на количество.",
      tests: [
        {
          name: "average([5, 4, 3]) → 4.0",
          py: "cases('average', [([5, 4, 3], 4.0)])"
        },
        {
          name: "Дробный результат",
          py: "cases('average', [([5, 4], 4.5)])"
        },
        {
          name: "Пустой список → 0",
          py: "cases('average', [([], 0)])"
        }
      ]
    },
    {
      id: "t5",
      title: "Чтение файла",
      points: 15,
      lang: "py",
      files: {
        "marks.txt": "5\n4\n3\n5\n4\n"
      },
      text: "<p>Рядом с программой лежит файл <code>marks.txt</code>, в нём по одной оценке в строке. Прочитайте его и выведите:</p><p><code>Оценок: 5</code><br><code>Среднее: 4.2</code></p>",
      starter: "marks = []\nwith open(\"marks.txt\", encoding=\"utf-8\") as f:\n    for line in f:\n        pass  # добавьте оценку в список\n",
      hint: "Каждая строка файла — текст с переводом строки. <code>int(line)</code> справится, а пустые строки пропускайте: <code>if line.strip():</code>.",
      tests: [
        {
          name: "Количество оценок",
          py: "inorder(['Оценок: 5'])"
        },
        {
          name: "Средний балл",
          py: "inorder(['Среднее: 4.2'])"
        },
        {
          name: "Данные прочитаны из файла",
          py: "uses(r'open\\s*\\(') or 'Прочитайте оценки из файла через open().'"
        }
      ]
    },
    {
      id: "t6",
      title: "Запись в файл",
      points: 15,
      lang: "py",
      text: "<p>Запишите в файл <code>squares.txt</code> квадраты чисел от 1 до 5 — каждое число на отдельной строке. Затем прочитайте файл и выведите его содержимое.</p>",
      starter: "with open(\"squares.txt\", \"w\", encoding=\"utf-8\") as f:\n    pass  # запишите квадраты\n",
      hint: "<code>f.write(f\"{i * i}\\n\")</code> — <code>\\n</code> переводит строку.",
      tests: [
        {
          name: "Файл squares.txt создан",
          py: "read_file('squares.txt') is not None or 'Файл squares.txt не создан: откройте его в режиме \"w\".'"
        },
        {
          name: "В файле квадраты 1–5 по строкам",
          py: "(read_file('squares.txt') or '').split() == ['1', '4', '9', '16', '25'] or 'В файле должно быть 1, 4, 9, 16, 25 — каждое на своей строке.'"
        },
        {
          name: "Содержимое выведено",
          py: "inorder(['1', '4', '9', '16', '25'])"
        }
      ]
    },
    {
      id: "t7",
      title: "Итог: таблица CSV",
      points: 15,
      lang: "py",
      final: true,
      files: {
        "students.csv": "name,group,score\nАня,ИС114,92\nБорис,ИС134,65\nВика,ИС114,68\nГоша,ИС114д,85\nДина,ИС134,58\nЕгор,ИС114,74\nЖеня,ИС114д,79\nЗоя,ИС134,90\nИлья,ИС114д,81\n"
      },
      variants: [
        {
          group: "ИС114",
          min: 70,
          expect: [
            "Аня",
            "Егор"
          ]
        },
        {
          group: "ИС134",
          min: 60,
          expect: [
            "Борис",
            "Зоя"
          ]
        },
        {
          group: "ИС114д",
          min: 80,
          expect: [
            "Гоша",
            "Илья"
          ]
        }
      ],
      text: "<p>В файле <code>students.csv</code> таблица: имя, группа, баллы. Первая строка — заголовок.</p><p>Напишите функцию <code>top_students(path, group, min_score)</code>, которая читает файл и <b>возвращает список имён</b> студентов группы <code>group</code> с баллами не меньше <code>min_score</code> — в том порядке, как они идут в файле.</p><p>Ваш вариант: группа <b>{{group}}</b>, порог <b>{{min}}</b>. Вызовите функцию с этими значениями, выведите каждое имя на отдельной строке и в конце <code>Всего: N</code>.</p>",
      starter: "def top_students(path, group, min_score):\n    result = []\n    # прочитайте файл и заполните result\n    return result\n\n",
      hint: "Пропустите заголовок: <code>lines = f.read().splitlines()[1:]</code>. Строку разбейте: <code>name, grp, score = line.split(\",\")</code>.",
      tests: [
        {
          name: "Функция top_students работает для разных групп",
          py: "cases('top_students', [(('students.csv', 'ИС114', 70), ['Аня', 'Егор']), (('students.csv', 'ИС134', 60), ['Борис', 'Зоя']), (('students.csv', 'ИС114д', 80), ['Гоша', 'Илья'])])"
        },
        {
          name: "Порог включительно",
          py: "cases('top_students', [(('students.csv', 'ИС114', 74), ['Аня', 'Егор']), (('students.csv', 'ИС134', 91), [])])"
        },
        {
          name: "Выведен результат вашего варианта",
          py: "inorder(V['expect'] + ['Всего: ' + str(len(V['expect']))]) is True or 'Вызовите функцию для своего варианта: группа ' + V['group'] + ', порог ' + str(V['min']) + '.'"
        }
      ]
    }
  ]
};
