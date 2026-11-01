/* Python в браузере: Pyodide в отдельном Web Worker.
   Worker не блокирует страницу, а при бесконечном цикле его можно остановить и запустить заново.
   Проверки Python-заданий — выражения на Python: { name, py: "выражение", stdin?: "ввод" }.
   Выражение возвращает True (проверка пройдена) или строку с объяснением, что не так. Помощники внутри проверок:
     lines()            — строки, выведенные print (без подсказок input)
     inorder([...])     — эти строки есть в выводе по порядку → True или сообщение
     v('имя'), has('имя') — значение и наличие переменной или функции студента
     cases('f', [((аргументы), ожидаемое), ...]) — вызывает функцию студента → True или сообщение
     src                — текст программы; uses(r'regex') — есть ли в коде (без комментариев)
     read_file('имя')   — содержимое файла после работы программы; V — индивидуальный вариант задания */
(function () {
  'use strict';

  const PYODIDE = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
  const TIMEOUT = 6000;

  const PRELUDE = String.raw`
import sys, io, json, re, traceback, os

class _Tee:
    def __init__(self, out, tr):
        self.out, self.tr = out, tr
    def write(self, s):
        self.out.write(s); self.tr.write(s); return len(s)
    def flush(self):
        pass

def _err(e):
    line = 0
    for fr in traceback.extract_tb(e.__traceback__):
        if fr.filename == 'main.py':
            line = fr.lineno
    if isinstance(e, SyntaxError) and e.filename == 'main.py':
        line = e.lineno or line
    msg = e.msg if isinstance(e, SyntaxError) else str(e)
    return {'type': type(e).__name__, 'msg': msg, 'line': line or 0}

def _exec(src, stdin_text, files):
    for name in os.listdir('.'):
        if os.path.isfile(name):
            os.remove(name)
    for name, text in files.items():
        with open(name, 'w', encoding='utf-8') as f:
            f.write(text)
    feed = iter(stdin_text.split('\n') if stdin_text else [])
    out, tr = io.StringIO(), io.StringIO()
    def _input(prompt=''):
        tr.write(str(prompt))
        try:
            value = next(feed)
        except StopIteration:
            raise EOFError('input() просит данные, а в поле «Ввод» больше нет строк')
        tr.write(value + '\n')
        return value
    ns = {'__name__': '__main__', 'input': _input}
    old = sys.stdout
    sys.stdout = _Tee(out, tr)
    err = None
    try:
        exec(compile(src, 'main.py', 'exec'), ns)
    except BaseException as e:
        err = _err(e)
    finally:
        sys.stdout = old
    written = {n: open(n, encoding='utf-8').read() for n in os.listdir('.') if os.path.isfile(n)}
    return ns, out.getvalue(), tr.getvalue(), err, written

def _helpers(ns, out, written, src, V):
    printed = out.split('\n')
    while printed and printed[-1] == '':
        printed.pop()
    MISSING = object()
    def lines():
        return [s.rstrip() for s in printed]
    def inorder(exp):
        got, i = lines(), 0
        for s in got:
            if i < len(exp) and s.strip() == str(exp[i]):
                i += 1
        if i == len(exp):
            return True
        return 'В выводе не нашли строку «' + str(exp[i]) + '»' + (' после «' + str(exp[i - 1]) + '»' if i else '')
    def v(name):
        return ns.get(name, MISSING)
    def has(name):
        return name in ns
    def cases(name, items):
        f = ns.get(name)
        if not callable(f):
            return 'Не нашли функцию ' + name + '. Объявите её через def ' + name + '(...):'
        for args, expected in items:
            args = args if isinstance(args, tuple) else (args,)
            try:
                got = f(*args)
            except Exception as e:
                return name + repr(args).replace(',)', ')') + ' — ошибка ' + type(e).__name__ + ': ' + str(e)
            nums = isinstance(got, (int, float)) and isinstance(expected, (int, float)) and not isinstance(got, bool) and not isinstance(expected, bool)
            if got != expected or (type(got) != type(expected) and not nums):
                tip = ' — функция ничего не возвращает: используйте return вместо print' if got is None else ''
                return name + repr(args).replace(',)', ')') + ' вернула ' + repr(got) + ', а нужно ' + repr(expected) + tip
        return True
    code_only = re.sub(r'#.*', '', src)
    def uses(pattern):
        return re.search(pattern, code_only) is not None
    def read_file(name):
        return written.get(name)
    return {'lines': lines, 'inorder': inorder, 'v': v, 'has': has, 'cases': cases,
            'src': src, 'uses': uses, 'read_file': read_file, 'V': V, 'MISSING': MISSING}

def _orbita_run(payload):
    p = json.loads(payload)
    src, stdin, files, tests, V = p['code'], p.get('stdin', ''), p.get('files', {}), p.get('tests', []), p.get('vars', {})
    runs = {}
    def run(s):
        if s not in runs:
            runs[s] = _exec(src, s, files)
        return runs[s]
    ns, out, tr, err, written = run(stdin)
    results = []
    for t in tests:
        tns, tout, ttr, terr, twritten = run(t.get('stdin', stdin))
        H = _helpers(tns, tout, twritten, src, V)
        old = sys.stdout
        sys.stdout = io.StringIO()
        try:
            r = eval(t['py'], H)
            ok = r is True
            msg = r if isinstance(r, str) else ''
        except Exception as e:
            ok = False
            if terr:
                msg = 'Программа завершилась с ошибкой ' + terr['type'] + (' (ввод: ' + repr(t['stdin']) + ')' if 'stdin' in t else '')
            else:
                msg = 'Проверка не выполнилась: ' + type(e).__name__ + ': ' + str(e)
        finally:
            sys.stdout = old
        results.append({'ok': ok, 'msg': msg})
    return json.dumps({'output': tr, 'error': err, 'results': results}, ensure_ascii=False)
`;

  const WORKER = `
importScripts('${PYODIDE}pyodide.js');
let py = null;
const ready = (async () => {
  py = await loadPyodide({ indexURL: '${PYODIDE}' });
  py.runPython(${JSON.stringify(PRELUDE)});
  self.postMessage({ type: 'ready' });
})().catch(e => self.postMessage({ type: 'fail', error: String(e) }));
self.onmessage = async (e) => {
  const { id, payload, code } = e.data;
  try {
    await ready;
    await py.loadPackagesFromImports(code);
    py.globals.set('__payload', payload);
    const res = py.runPython('_orbita_run(__payload)');
    self.postMessage({ type: 'result', id, data: JSON.parse(res) });
  } catch (err) {
    self.postMessage({ type: 'result', id, data: { output: '', error: { type: 'Error', msg: String(err), line: 0 }, results: [] } });
  }
};`;

  let worker = null, readyPromise = null, queue = Promise.resolve(), loadListeners = [], isReady = false;

  function start() {
    const url = URL.createObjectURL(new Blob([WORKER], { type: 'text/javascript' }));
    worker = new Worker(url);
    readyPromise = new Promise((resolve, reject) => {
      const onMsg = e => {
        if (e.data.type === 'ready') { worker.removeEventListener('message', onMsg); resolve(); }
        if (e.data.type === 'fail') { worker.removeEventListener('message', onMsg); reject(new Error(e.data.error)); }
      };
      worker.addEventListener('message', onMsg);
      worker.addEventListener('error', err => reject(err));
    });
    readyPromise.catch(() => { worker = null; });
  }

  function exec(code, opts) {
    const job = async () => {
      if (!worker) start();
      const first = !isReady;
      if (first) loadListeners.forEach(f => f(true));
      try { await readyPromise; isReady = true; }
      catch (e) { worker = null; return { output: '', error: { type: 'LoadError', msg: 'Не удалось загрузить Python. Проверьте интернет и попробуйте ещё раз.', line: 0 }, results: [] }; }
      finally { if (first) loadListeners.forEach(f => f(false)); }
      return new Promise(resolve => {
        const id = Math.random().toString(36).slice(2);
        const w = worker;
        const timer = setTimeout(() => {
          w.terminate();
          worker = null; isReady = false;
          resolve({ output: '', timeout: true, error: { type: 'Timeout', msg: 'Программа работает дольше ' + TIMEOUT / 1000 + ' секунд. Возможно, бесконечный цикл: проверьте условие while.', line: 0 }, results: (opts.tests || []).map(() => ({ ok: false, msg: 'Программа не завершилась: возможно, бесконечный цикл.' })) });
        }, TIMEOUT);
        const onMsg = e => {
          if (e.data.type !== 'result' || e.data.id !== id) return;
          clearTimeout(timer);
          w.removeEventListener('message', onMsg);
          resolve(e.data.data);
        };
        w.addEventListener('message', onMsg);
        w.postMessage({ id, code, payload: JSON.stringify({ code, stdin: opts.stdin || '', files: opts.files || {}, tests: opts.tests || [], vars: opts.vars || {} }) });
      });
    };
    const p = queue.then(job, job);
    queue = p.catch(() => {});
    return p;
  }

  // Понятное объяснение частых ошибок для начинающих.
  const HINTS = {
    SyntaxError: 'синтаксическая ошибка: проверьте двоеточие после if, for, while, def, а также скобки и кавычки',
    IndentationError: 'ошибка отступа: строки внутри if, for, while, def начинаются с 4 пробелов, на одном уровне — одинаковый отступ',
    TabError: 'смешаны табуляция и пробелы в отступах — используйте только пробелы',
    NameError: 'имя не найдено: опечатка в названии или переменная ещё не создана (строки в кавычках?)',
    TypeError: 'несовместимые типы: например, строку нельзя сложить с числом — используйте int() или str()',
    ValueError: 'неподходящее значение: например, int("abc") — в строке нет числа',
    ZeroDivisionError: 'деление на ноль',
    IndexError: 'индекс за пределами списка: элементы нумеруются с 0 до len(список) − 1',
    KeyError: 'такого ключа нет в словаре — проверьте написание или используйте .get()',
    AttributeError: 'у этого значения нет такого метода или свойства',
    EOFError: 'программа ждёт ввод через input(), а данных больше нет — допишите строку в поле «Ввод»',
    FileNotFoundError: 'файл не найден — проверьте имя файла',
    RecursionError: 'функция вызывает сама себя без конца',
    Timeout: '',
    LoadError: ''
  };
  function explain(err) {
    if (!err) return '';
    const hint = HINTS[err.type];
    return err.type + ': ' + err.msg + (hint ? ' — ' + hint : '');
  }

  // Тот же интерфейс, что у OrbitaRunner.test: массив { ok, msg } и errors [{ msg, line }].
  async function test(code, tests, opts) {
    const r = await exec(code, Object.assign({}, opts, { tests }));
    const results = r.results.length ? r.results : tests.map(() => ({ ok: false, msg: '' }));
    results.errors = r.error ? [{ msg: explain(r.error), line: r.error.line }] : [];
    return results;
  }

  window.OrbitaPython = {
    run: (code, opts) => exec(code, opts || {}),
    test,
    explain,
    onLoading(fn) { loadListeners.push(fn); },
    get ready() { return isReady; }
  };
})();
