/* Подсветка синтаксиса HTML / CSS / JS без внешних библиотек.
   Возвращает HTML-строку со <span class="tk-…">. */
(function () {
  'use strict';

  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const span = (cls, s) => '<span class="tk-' + cls + '">' + esc(s) + '</span>';

  const JS_KW = /^(?:const|let|var|function|return|if|else|for|while|do|break|continue|new|class|extends|import|export|from|default|async|await|try|catch|finally|throw|typeof|instanceof|of|in|switch|case|this|null|undefined|true|false)$/;

  function js(src) {
    const re = /(\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$))|(`(?:\\[\s\S]|[^`\\])*`?|'(?:\\.|[^'\\\n])*'?|"(?:\\.|[^"\\\n])*"?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$Ѐ-ӿ][\w$Ѐ-ӿ]*)/g;
    let out = '', last = 0, m;
    while ((m = re.exec(src))) {
      out += esc(src.slice(last, m.index));
      if (m[1]) out += span('com', m[1]);
      else if (m[2]) out += span('str', m[2]);
      else if (m[3]) out += span('num', m[3]);
      else {
        const w = m[4];
        if (JS_KW.test(w)) out += span('kw', w);
        else if (/^\s*\(/.test(src.slice(re.lastIndex))) out += span('fn', w);
        else out += esc(w);
      }
      last = re.lastIndex;
    }
    return out + esc(src.slice(last));
  }

  function cssValue(v) {
    return v.replace(/(#[0-9a-fA-F]{3,8}\b)|(-?\d*\.?\d+(?:px|em|rem|%|vh|vw|dvh|s|ms|deg|fr)?)|("[^"]*"?|'[^']*'?)|([^#\d"'-]+|.)/g,
      (all, color, num, str, rest) => color ? span('num', color) : num ? span('num', num) : str ? span('str', str) : esc(rest));
  }

  function cssDecl(s) {
    return s.replace(/([\w-]+)(\s*:)([^;]*)(;?)|([\s\S])/g,
      (all, prop, colon, val, semi, ch) => prop ? span('prop', prop) + esc(colon) + cssValue(val) + esc(semi) : esc(ch));
  }

  function css(src) {
    const re = /(\/\*[\s\S]*?(?:\*\/|$))|([{}])|([^{}/]+|\/)/g;
    let out = '', depth = 0, m;
    while ((m = re.exec(src))) {
      if (m[1]) out += span('com', m[1]);
      else if (m[2]) { depth = Math.max(0, depth + (m[2] === '{' ? 1 : -1)); out += esc(m[2]); }
      else out += depth === 0 ? span('sel', m[3]) : cssDecl(m[3]);
    }
    return out;
  }

  function tag(t) {
    const m = /^(<\/?)([a-zA-Z][\w-]*)([\s\S]*?)(\/?>)?$/.exec(t);
    if (!m) return esc(t);
    const attrs = m[3].replace(/(\s+)|([^\s=]+)(?:(\s*=\s*)("[^"]*"?|'[^']*'?|[^\s"'>]+)?)?/g,
      (all, ws, name, eq, val) => ws ? ws : span('attr', name) + (eq ? esc(eq) + span('str', val || '') : ''));
    return span('tag', m[1] + m[2]) + attrs + (m[4] ? span('tag', m[4]) : '');
  }

  function html(src) {
    const re = /<!--[\s\S]*?(?:-->|$)|<![^>]*>?|<\/?[a-zA-Z][\w-]*(?:"[^"]*"?|'[^']*'?|[^'">])*>?/g;
    let out = '', last = 0, m;
    while ((m = re.exec(src))) {
      out += esc(src.slice(last, m.index));
      const t = m[0];
      if (t.startsWith('<!--')) out += span('com', t);
      else if (t.startsWith('<!')) out += span('meta', t);
      else {
        out += tag(t);
        const nm = /^<([a-zA-Z][\w-]*)/.exec(t);
        if (nm && /^(script|style)$/i.test(nm[1]) && !t.endsWith('/>')) {
          const rest = src.slice(re.lastIndex);
          const c = new RegExp('</' + nm[1] + '\\s*>', 'i').exec(rest);
          const inner = c ? rest.slice(0, c.index) : rest;
          out += nm[1].toLowerCase() === 'script' ? js(inner) : css(inner);
          re.lastIndex += inner.length;
        }
      }
      last = re.lastIndex;
    }
    return out + esc(src.slice(last));
  }

  function auto(src, lang) {
    if (lang === 'js') return js(src);
    if (lang === 'css') return css(src);
    return html(src);
  }

  window.OrbitaHL = { html, css, js, auto, esc };
})();
