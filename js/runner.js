/* Запуск кода студента в изолированном iframe и автопроверка.
   Проверки (tests) описываются в уроке как функции (document, window, H) => true | 'сообщение об ошибке'.
   Они выполняются внутри iframe после загрузки страницы студента. */
(function () {
  'use strict';

  // Перехват console.* и ошибок. offset — сколько строк служебной обёртки стоит перед кодом студента,
  // чтобы номер строки в сообщении об ошибке совпадал с номером в редакторе.
  const hook = offset => '<script>(function(){' +
    'var one=function(x){if(typeof x==="string")return x;if(x===undefined)return "undefined";if(typeof x==="function")return "ƒ "+(x.name||"функция");try{return JSON.stringify(x)}catch(e){return String(x)}};' +
    'window.__fmt=function(a){return Array.prototype.map.call(a,one).join(" ")};' +
    'var send=function(l,t,line){try{parent.postMessage({__orbita:"console",level:l,text:t,line:line||0},"*")}catch(e){}};' +
    'window.__logs=[];window.__errors=[];' +
    '["log","info","warn","error"].forEach(function(l){var o=console[l];console[l]=function(){window.__logs.push({level:l,args:[].slice.call(arguments)});send(l,window.__fmt(arguments));return o.apply(console,arguments)}});' +
    'var err=function(msg,line){line=line>' + offset + '?line-' + offset + ':0;window.__errors.push({msg:msg,line:line});send("error",msg,line)};' +
    'window.addEventListener("error",function(e){err(e.message,e.lineno)});' +
    'window.addEventListener("unhandledrejection",function(e){err("Promise: "+(e.reason&&e.reason.message||e.reason),0)});' +
    '})();<\/script>';

  const HELPERS = 'var H={' +
    'labeled:function(el){return !!(el&&el.labels&&[].some.call(el.labels,function(l){return l.textContent.trim().length>0}))},' +
    'text:function(el){return el?el.textContent.replace(/\\s+/g," ").trim():""},' +
    'css:function(el,p){return el?getComputedStyle(el).getPropertyValue(p).trim():""},' +
    'logs:function(){return (window.__logs||[]).map(function(x){return window.__fmt(x.args)})},' +
    // Значение глобальной переменной или функции студента (в том числе объявленной через let/const).
    'get:function(name){try{return (0,eval)(name)}catch(e){return undefined}},' +
    'has:function(name){try{return (0,eval)("typeof "+name)!=="undefined"}catch(e){return false}},' +
    // Текст кода студента (все <script>, кроме служебных).
    'src:function(){return [].map.call(document.scripts,function(s){return s.textContent}).filter(function(t){return t.indexOf("__orbita")<0&&t.indexOf("__fmt")<0}).join("\\n")},' +
    'eq:function(a,b){return JSON.stringify(a)===JSON.stringify(b)},' +
    // Ожидаемые строки есть в консоли в этом порядке (между ними могут быть другие). Иначе — сообщение, какой не хватает.
    'inOrder:function(exp){var L=H.logs().map(function(s){return String(s).trim()}),i=0;for(var k=0;k<L.length&&i<exp.length;k++)if(L[k]===String(exp[i]))i++;' +
      'return i===exp.length?true:"В консоли не нашли строку «"+exp[i]+"»"+(i?" после «"+exp[i-1]+"»":"")},' +
    // Все CSS-правила страницы: [{ sel, style, media }], включая правила внутри @media.
    'rules:function(){var out=[];function walk(list,media){for(var i=0;i<list.length;i++){var r=list[i];' +
      'if(r.selectorText)out.push({sel:r.selectorText,style:r.style,media:media||""});' +
      'else if(r.cssRules&&!(r instanceof CSSKeyframesRule))walk(r.cssRules,r.conditionText||(r.media&&r.media.mediaText)||media)}}' +
      'for(var s=0;s<document.styleSheets.length;s++){try{walk(document.styleSheets[s].cssRules)}catch(e){}}return out},' +
    // Правила внутри @media (max-width: N px) с N не больше limit.
    'mobile:function(limit){return H.rules().filter(function(r){var m=/max-width\\s*:\\s*(\\d+)px/.exec(r.media);return m&&+m[1]<=limit&&+m[1]>=320})},' +
    'keyframes:function(){var out=[];for(var s=0;s<document.styleSheets.length;s++){try{[].forEach.call(document.styleSheets[s].cssRules,function(r){if(r instanceof CSSKeyframesRule)out.push(r.name)})}catch(e){}}return out},' +
    'ms:function(v){var t=String(v).split(",")[0].trim();return t.endsWith("ms")?parseFloat(t):parseFloat(t)*1000}' +
    '};';

  function inject(code, head) {
    if (/<head[^>]*>/i.test(code)) return code.replace(/<head[^>]*>/i, m => m + head);
    if (/<html[^>]*>/i.test(code)) return code.replace(/<html[^>]*>/i, m => m + head);
    if (/<!doctype[^>]*>/i.test(code)) return code.replace(/<!doctype[^>]*>/i, m => m + head);
    return head + code;
  }

  function toDoc(code, lang) {
    if (lang === 'js') {
      return '<!doctype html><html><head><meta charset="utf-8"></head><body><script>\n' +
        code.replace(/<\/script/gi, '<\\/script') + '\n<\/script></body></html>';
    }
    return code;
  }

  const prepare = (code, lang) => inject(toDoc(code, lang), hook(lang === 'js' ? 1 : 0));

  function preview(iframe, code, lang) {
    iframe.srcdoc = prepare(code, lang);
  }

  // vars — индивидуальный вариант задания, в проверках доступен как H.v.
  function test(code, tests, lang, vars) {
    return new Promise(resolve => {
      const id = 'r' + Math.random().toString(36).slice(2);
      const list = tests.map(t => '{fn:(' + t.check.toString() + ')}').join(',');
      const v = JSON.stringify(vars || {}).replace(/</g, '\\u003c');
      const harness = '<script>(function(){' + HELPERS + 'H.v=' + v + ';' +
        'var T=[' + list + '];' +
        'function go(){(async function(){var out=[];for(var i=0;i<T.length;i++){try{var r=await T[i].fn(document,window,H);out.push({ok:r===true,msg:typeof r==="string"?r:""})}catch(e){out.push({ok:false,msg:"Проверка упала: "+(e&&e.message||e)})}}' +
        'parent.postMessage({__orbita:"test",id:"' + id + '",results:out,errors:window.__errors||[]},"*")})()}' +
        'if(document.readyState==="complete")setTimeout(go,30);else addEventListener("load",function(){setTimeout(go,30)});' +
        '})();<\/script>';

      const f = document.createElement('iframe');
      f.setAttribute('sandbox', 'allow-scripts');
      f.setAttribute('aria-hidden', 'true');
      f.tabIndex = -1;
      f.className = 'test-frame';

      const timer = setTimeout(() => finish(tests.map(() => ({
        ok: false, msg: 'Страница не ответила за 5 секунд. Возможно, в коде бесконечный цикл.'
      }))), 5000);

      function onMsg(e) {
        if (e.source !== f.contentWindow || !e.data || e.data.__orbita !== 'test' || e.data.id !== id) return;
        finish(e.data.results, e.data.errors);
      }
      // Результат — массив { ok, msg } по проверкам; в свойстве errors — ошибки в коде студента { msg, line }.
      function finish(results, errors) {
        clearTimeout(timer);
        window.removeEventListener('message', onMsg);
        f.remove();
        results.errors = errors || [];
        resolve(results);
      }
      window.addEventListener('message', onMsg);
      document.body.appendChild(f);
      f.srcdoc = prepare(code, lang) + harness;
    });
  }

  window.OrbitaRunner = { preview, test };
})();
