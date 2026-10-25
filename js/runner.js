/* Запуск кода студента в изолированном iframe и автопроверка.
   Проверки (tests) описываются в уроке как функции (document, window, H) => true | 'сообщение об ошибке'.
   Они выполняются внутри iframe после загрузки страницы студента. */
(function () {
  'use strict';

  const CONSOLE_HOOK = '<script>(function(){' +
    'var fmt=function(a){return Array.prototype.map.call(a,function(x){try{return typeof x==="string"?x:JSON.stringify(x)}catch(e){return String(x)}}).join(" ")};' +
    'var send=function(l,a){try{parent.postMessage({__orbita:"console",level:l,text:fmt(a)},"*")}catch(e){}};' +
    'window.__logs=[];' +
    '["log","info","warn","error"].forEach(function(l){var o=console[l];console[l]=function(){window.__logs.push({level:l,args:[].slice.call(arguments)});send(l,arguments);return o.apply(console,arguments)}});' +
    'window.addEventListener("error",function(e){send("error",[e.message])});' +
    '})();<\/script>';

  const HELPERS = 'var H={' +
    'labeled:function(el){return !!(el&&el.labels&&[].some.call(el.labels,function(l){return l.textContent.trim().length>0}))},' +
    'text:function(el){return el?el.textContent.replace(/\\s+/g," ").trim():""},' +
    'css:function(el,p){return el?getComputedStyle(el).getPropertyValue(p).trim():""},' +
    'logs:function(){return (window.__logs||[]).map(function(x){return x.args.join(" ")})},' +
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

  function preview(iframe, code, lang) {
    iframe.srcdoc = inject(toDoc(code, lang), CONSOLE_HOOK);
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
        'parent.postMessage({__orbita:"test",id:"' + id + '",results:out},"*")})()}' +
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
        finish(e.data.results);
      }
      function finish(results) {
        clearTimeout(timer);
        window.removeEventListener('message', onMsg);
        f.remove();
        resolve(results);
      }
      window.addEventListener('message', onMsg);
      document.body.appendChild(f);
      f.srcdoc = inject(toDoc(code, lang), CONSOLE_HOOK) + harness;
    });
  }

  window.OrbitaRunner = { preview, test };
})();
