/* Собрано из исходников платформы (node build.mjs site). Эталонные решения хранятся в Google Таблице. */
window.ORBITA.lessons['ai-pz-03'] = {
  type: "practice",
  intro: "<p>Циклы повторяют действия. <code>for</code> — когда известно, сколько раз (или что перебирать), <code>while</code> — пока выполняется условие.</p><p>Если программа «зависла», скорее всего, условие <code>while</code> никогда не становится ложным: через 6 секунд платформа её остановит.</p>",
  tasks: [
    {
      id: "t1",
      title: "Таблица умножения",
      points: 15,
      lang: "py",
      stdin: "7",
      text: "<p>Пользователь вводит число <code>n</code>. Выведите таблицу умножения на него от 1 до 10 в формате <code>7 x 1 = 7</code>.</p>",
      starter: "n = int(input())\n",
      hint: "<code>range(1, 11)</code> даёт числа от 1 до 10.",
      tests: [
        {
          name: "Таблица на 7",
          py: "inorder([f'7 x {i} = {7 * i}' for i in range(1, 11)])"
        },
        {
          name: "Таблица на 3",
          stdin: "3",
          py: "inorder([f'3 x {i} = {3 * i}' for i in range(1, 11)])"
        },
        {
          name: "Используется цикл for",
          py: "uses(r'\\bfor\\b') or 'Выведите строки в цикле for.'"
        }
      ]
    },
    {
      id: "t2",
      title: "Сумма чисел",
      points: 15,
      lang: "py",
      stdin: "100",
      text: "<p>Посчитайте в цикле сумму всех чисел от 1 до <code>n</code> и выведите её. Функцию <code>sum()</code> не используйте — цель научиться накапливать сумму самим.</p>",
      starter: "n = int(input())\ntotal = 0\n",
      hint: "В цикле прибавляйте к <code>total</code> очередное число: <code>total += i</code>.",
      tests: [
        {
          name: "n = 100 → 5050",
          py: "inorder(['5050'])"
        },
        {
          name: "n = 10 → 55",
          stdin: "10",
          py: "inorder(['55']) is True or 'Для n = 10 должно получиться 55. Проверьте, входит ли n в range.'"
        },
        {
          name: "Сумма накоплена в цикле",
          py: "not uses(r'\\bsum\\s*\\(') and uses(r'\\b(for|while)\\b') or 'Посчитайте сумму циклом, без функции sum().'"
        }
      ]
    },
    {
      id: "t3",
      title: "Чётные числа",
      points: 10,
      lang: "py",
      stdin: "10",
      text: "<p>Выведите все чётные числа от 2 до <code>n</code> включительно, каждое на отдельной строке.</p>",
      starter: "n = int(input())\n",
      hint: "У <code>range</code> есть третий параметр — шаг: <code>range(2, n + 1, 2)</code>.",
      tests: [
        {
          name: "n = 10 → 2 4 6 8 10",
          py: "inorder(['2', '4', '6', '8', '10'])"
        },
        {
          name: "n = 7 → 2 4 6",
          stdin: "7",
          py: "inorder(['2', '4', '6']) is True and '8' not in lines() or 'Для n = 7 нужны только 2, 4, 6.'"
        }
      ]
    },
    {
      id: "t4",
      title: "Факториал",
      points: 15,
      lang: "py",
      stdin: "5",
      text: "<p>Факториал <code>n!</code> — произведение чисел от 1 до n: 5! = 1 · 2 · 3 · 4 · 5 = 120. По определению 0! = 1. Выведите факториал введённого числа.</p>",
      starter: "n = int(input())\nresult = 1\n",
      hint: "Начните с <code>result = 1</code> и умножайте его на каждое число в цикле.",
      tests: [
        {
          name: "5! = 120",
          py: "inorder(['120'])"
        },
        {
          name: "0! = 1",
          stdin: "0",
          py: "inorder(['1'])"
        },
        {
          name: "10! = 3628800",
          stdin: "10",
          py: "inorder(['3628800'])"
        },
        {
          name: "Без math.factorial",
          py: "not uses(r'factorial') or 'Посчитайте факториал циклом, без math.factorial.'"
        }
      ]
    },
    {
      id: "t5",
      title: "Количество цифр",
      points: 15,
      lang: "py",
      stdin: "12345",
      text: "<p>Пользователь вводит натуральное число. С помощью цикла <code>while</code> посчитайте, сколько в нём цифр. Без <code>len()</code> и без превращения в строку: делите число на 10, пока оно не станет нулём.</p>",
      starter: "n = int(input())\ncount = 0\n",
      hint: "<code>while n &gt; 0:</code> — внутри <code>n = n // 10</code> и <code>count += 1</code>.",
      tests: [
        {
          name: "12345 → 5",
          py: "inorder(['5'])"
        },
        {
          name: "7 → 1",
          stdin: "7",
          py: "inorder(['1'])"
        },
        {
          name: "1000 → 4",
          stdin: "1000",
          py: "inorder(['4'])"
        },
        {
          name: "Цикл while без len()",
          py: "uses(r'\\bwhile\\b') and not uses(r'\\blen\\s*\\(') or 'Решите циклом while, без len().'"
        }
      ]
    },
    {
      id: "t6",
      title: "До стоп-слова",
      points: 15,
      lang: "py",
      stdin: "кот\nпёс\nмышь\nстоп",
      text: "<p>Программа читает слова по одному, пока не встретит слово <code>стоп</code>. Затем выводит, сколько слов было введено до него:</p><p><code>Введено: 3</code></p>",
      starter: "count = 0\nword = input()\n",
      hint: "<code>while word != \"стоп\":</code> — внутри увеличьте счётчик и прочитайте следующее слово.",
      tests: [
        {
          name: "Три слова → Введено: 3",
          py: "inorder(['Введено: 3'])"
        },
        {
          name: "Сразу «стоп» → Введено: 0",
          stdin: "стоп",
          py: "inorder(['Введено: 0'])"
        },
        {
          name: "Пять слов",
          stdin: "a\nb\nc\nd\ne\nстоп",
          py: "inorder(['Введено: 5'])"
        }
      ]
    },
    {
      id: "t7",
      title: "FizzBuzz",
      points: 15,
      lang: "py",
      stdin: "15",
      text: "<p>Выведите числа от 1 до <code>n</code>, но вместо чисел, кратных 3, — <code>Fizz</code>, кратных 5 — <code>Buzz</code>, кратных и 3, и 5 — <code>FizzBuzz</code>.</p>",
      starter: "n = int(input())\n",
      hint: "Проверку на 15 (и 3, и 5) ставьте первой, иначе раньше сработает проверка на 3.",
      tests: [
        {
          name: "n = 15",
          py: "inorder(['FizzBuzz' if i % 15 == 0 else 'Fizz' if i % 3 == 0 else 'Buzz' if i % 5 == 0 else str(i) for i in range(1, 16)])"
        },
        {
          name: "n = 5",
          stdin: "5",
          py: "inorder(['1', '2', 'Fizz', '4', 'Buzz'])"
        }
      ]
    }
  ]
};
