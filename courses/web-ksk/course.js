/* Курс ДУП.05 «Основы разработки веб-приложений» — структура по рабочей программе.
   kind: 'theory' — теоретическое занятие (ТЗ), 'practice' — практическое занятие (ПЗ, идёт в отчёт с оценкой).
   Занятия без файла урока в lessons/ показываются на карте как «скоро». */
window.ORBITA = window.ORBITA || { courses: [], lessons: {} };

window.ORBITA.courses.push({
  id: 'web-ksk',
  code: 'ДУП.05',
  title: 'Основы разработки веб-приложений',
  specialty: 'Компьютерные системы и комплексы',
  groups: ['КСК114', 'КСК114д', 'КСК134', 'КСК154'],
  hours: { total: 112, practice: 82 },
  semesters: [
    {
      n: 1,
      title: 'Семестр 1',
      topics: [
        {
          id: '1.1', title: 'Проектирование веб-приложения',
          items: [
            { id: 'l-1-1', kind: 'theory', num: '1.1', hours: 1, title: 'Введение в веб-разработку. Начальные этапы планирования' }
          ]
        },
        {
          id: '1.2', title: 'Основы вёрстки с использованием HTML5 и CSS3',
          items: [
            { id: 'l-1-2-1', kind: 'theory', num: '1.2.1', hours: 2, title: 'Основы HTML5: текст, изображения, ссылки, блоки, формы' },
            { id: 'l-1-2-2', kind: 'theory', num: '1.2.2', hours: 2, title: 'Основы CSS: понятия, назначение, форматирование документа' },
            { id: 'pz-01', kind: 'practice', num: 1, hours: 4, title: 'Работа с элементами форм' },
            { id: 'pz-02', kind: 'practice', num: 2, hours: 4, title: 'Вёрстка шапки сайта (header), адаптивное меню' },
            { id: 'pz-03', kind: 'practice', num: 3, hours: 4, title: 'Вёрстка основного контента (main), анимация' },
            { id: 'pz-04', kind: 'practice', num: 4, hours: 4, title: 'Вёрстка подвала сайта, изображения и ссылки' }
          ]
        },
        {
          id: '1.3', title: 'Разработка клиентской части веб-приложений',
          items: [
            { id: 'l-1-3-1', kind: 'theory', num: '1.3.1', hours: 1, title: 'Стандарт ES6+. Синтаксис JS' },
            { id: 'l-1-3-2', kind: 'theory', num: '1.3.2', hours: 2, title: 'Методы массивов, функции и объекты в JS' },
            { id: 'l-1-3-3', kind: 'theory', num: '1.3.3', hours: 1, title: 'Работа с DOM' },
            { id: 'l-1-3-4', kind: 'theory', num: '1.3.4', hours: 1, title: 'Асинхронное программирование' },
            { id: 'pz-05', kind: 'practice', num: 5, hours: 4, title: 'Циклы, условный оператор, массивы, объекты' },
            { id: 'pz-06', kind: 'practice', num: 6, hours: 4, title: 'Пользовательские функции' },
            { id: 'pz-07', kind: 'practice', num: 7, hours: 4, title: 'Методы массивов' },
            { id: 'pz-08', kind: 'practice', num: 8, hours: 4, title: 'События в JS' },
            { id: 'pz-09', kind: 'practice', num: 9, hours: 4, title: 'Работа с DOM' },
            { id: 'pz-10', kind: 'practice', num: 10, hours: 4, title: 'Работа с Event' },
            { id: 'pz-11', kind: 'practice', num: 11, hours: 6, title: 'Работа с таймерами' },
            { id: 'pz-12', kind: 'practice', num: 12, hours: 6, title: 'Работа с Canvas' },
            { id: 'pz-13', kind: 'practice', num: 13, hours: 6, title: 'Работа с Fetch' }
          ]
        }
      ]
    },
    {
      n: 2,
      title: 'Семестр 2',
      topics: [
        {
          id: '1.4', title: 'Библиотеки и фреймворки',
          items: [
            { id: 'l-1-4-1', kind: 'theory', num: '1.4.1', hours: 2, title: 'Фреймворк Bootstrap. Подключение' },
            { id: 'l-1-4-2', kind: 'theory', num: '1.4.2', hours: 2, title: 'Bootstrap: система сеток, основные компоненты' },
            { id: 'l-1-4-3', kind: 'theory', num: '1.4.3', hours: 2, title: 'Фреймворк Tailwind. Подключение' },
            { id: 'l-1-4-4', kind: 'theory', num: '1.4.4', hours: 2, title: 'Tailwind: синтаксис, адаптивный дизайн' },
            { id: 'pz-14', kind: 'practice', num: 14, hours: 4, title: 'Работа с фреймворком Bootstrap' },
            { id: 'pz-15', kind: 'practice', num: 15, hours: 4, title: 'Работа с фреймворком Tailwind' }
          ]
        },
        {
          id: '1.5', title: 'Движки разработки реактивного интерфейса',
          items: [
            { id: 'l-1-5-1', kind: 'theory', num: '1.5.1', hours: 4, title: 'Движки реактивного интерфейса. Сравнительный анализ' },
            { id: 'l-1-5-2', kind: 'theory', num: '1.5.2', hours: 2, title: 'Особенности синтаксиса. Компоненты и свойства' },
            { id: 'l-1-5-3', kind: 'theory', num: '1.5.3', hours: 2, title: 'Управление состоянием приложения' },
            { id: 'pz-16', kind: 'practice', num: 16, hours: 2, title: 'Установка движка и настройка проекта' },
            { id: 'pz-17', kind: 'practice', num: 17, hours: 2, title: 'Структура приложения, компонентный подход' },
            { id: 'pz-18', kind: 'practice', num: 18, hours: 2, title: 'Работа с состояниями. Redux' },
            { id: 'pz-19', kind: 'practice', num: 19, hours: 2, title: 'Работа с маршрутизацией' },
            { id: 'pz-20', kind: 'practice', num: 20, hours: 2, title: 'Работа с хуками' },
            { id: 'pz-21', kind: 'practice', num: 21, hours: 2, title: 'Работа с API' }
          ]
        },
        {
          id: '1.6', title: 'Инструменты',
          items: [
            { id: 'l-1-6-1', kind: 'theory', num: '1.6.1', hours: 3, title: 'Основы работы с пакетными менеджерами' },
            { id: 'pz-22', kind: 'practice', num: 22, hours: 4, title: 'Пакетные менеджеры в проекте. Установка зависимостей' }
          ]
        },
        {
          id: 'ДЗ', title: 'Промежуточная аттестация',
          items: [
            { id: 'exam', kind: 'exam', num: 'ДЗ', hours: 1, title: 'Дифференцированный зачёт: итоговый проект' }
          ]
        }
      ]
    }
  ]
});
