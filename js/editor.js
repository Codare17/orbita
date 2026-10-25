/* Лёгкий редактор кода: textarea + слой подсветки под ней.
   Tab вставляет 2 пробела, Enter сохраняет отступ и раскрывает {} и парные теги. */
(function () {
  'use strict';

  const VOID = /^(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)$/i;

  function create(host, opts) {
    opts = opts || {};
    host.classList.add('ed');
    host.innerHTML =
      '<div class="ed-gutter" aria-hidden="true"><div class="ed-lines"></div></div>' +
      '<div class="ed-body"><pre class="ed-hl" aria-hidden="true"><code></code></pre>' +
      '<textarea class="ed-ta" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off"></textarea></div>';
    const ta = host.querySelector('textarea');
    const code = host.querySelector('code');
    const pre = host.querySelector('.ed-hl');
    const lines = host.querySelector('.ed-lines');
    ta.id = opts.id || 'code-editor';
    ta.setAttribute('aria-label', opts.label || 'Редактор кода');
    let lang = opts.lang || 'html';
    let lineCount = 0;

    function sync() {
      pre.style.transform = 'translate(' + (-ta.scrollLeft) + 'px,' + (-ta.scrollTop) + 'px)';
      lines.style.transform = 'translateY(' + (-ta.scrollTop) + 'px)';
    }

    function paint() {
      const v = ta.value;
      code.innerHTML = window.OrbitaHL.auto(v, lang) + '\n ';
      const n = v.split('\n').length;
      if (n !== lineCount) {
        let s = '';
        for (let i = 1; i <= n; i++) s += i + '\n';
        lines.textContent = s;
        lineCount = n;
      }
      sync();
    }

    function insert(text, caretBack) {
      ta.focus();
      const ok = document.execCommand && document.execCommand('insertText', false, text);
      if (!ok) {
        ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, 'end');
        ta.dispatchEvent(new Event('input'));
      }
      if (caretBack) {
        const p = ta.selectionStart - caretBack;
        ta.setSelectionRange(p, p);
      }
    }

    function opensBlock(before) {
      const t = before.replace(/[ \t]+$/, '');
      if (/[{[(]$/.test(t)) return true;
      const m = /<([a-zA-Z][\w-]*)(?:"[^"]*"|'[^']*'|[^'">])*>$/.exec(t);
      return !!(m && !VOID.test(m[1]) && !t.endsWith('/>'));
    }

    ta.addEventListener('keydown', e => {
      if (e.key === 'Tab' && !e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
        e.preventDefault();
        insert('  ');
      } else if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        const before = ta.value.slice(0, ta.selectionStart);
        const after = ta.value.slice(ta.selectionEnd);
        const line = before.slice(before.lastIndexOf('\n') + 1);
        const ind = /^[ \t]*/.exec(line)[0];
        if (opensBlock(before)) {
          if (/^[ \t]*([}\])]|<\/)/.test(after)) insert('\n' + ind + '  \n' + ind, ind.length + 1);
          else insert('\n' + ind + '  ');
        } else {
          insert('\n' + ind);
        }
      }
    });
    ta.addEventListener('input', () => { paint(); if (opts.onChange) opts.onChange(ta.value); });
    ta.addEventListener('scroll', sync);

    ta.value = opts.value || '';
    paint();

    return {
      el: ta,
      get value() { return ta.value; },
      set value(v) { ta.value = v; paint(); ta.scrollTop = 0; ta.scrollLeft = 0; sync(); },
      setLang(l) { lang = l; paint(); },
      focus() { ta.focus(); }
    };
  }

  window.OrbitaEditor = { create };
})();
