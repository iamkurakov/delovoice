/* Деловойс: согласие на cookie и Яндекс Метрику.
   Метрика загружается только после нажатия «Согласен».
   Выбор хранится в браузере посетителя (localStorage, ключ dv_cookie: yes / no). */
(function(){
  var KEY = 'dv_cookie', ID = 113913973;

  function read(){ try { return localStorage.getItem(KEY); } catch(e){ return null; } }
  function save(v){ try { localStorage.setItem(KEY, v); } catch(e){} }

  function loadMetrika(){
    (function(m,e,t,r,i,k,a){
      m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=' + ID, 'ym');
    ym(ID, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
  }

  var CSS = '/* стили встроены сюда, чтобы окошко одинаково выглядело на всех страницах */.cookie-bar{position:fixed;left:16px;bottom:16px;z-index:1000;width:min(420px,calc(100vw - 32px));box-sizing:border-box;background:#fff8ec;border:1px solid #b89d78;border-radius:12px;box-shadow:0 1px 2px rgba(27,38,50,.08),0 4px 16px rgba(27,38,50,.06);padding:16px 18px;display:flex;flex-direction:column;gap:12px;font:14px/1.5 "Golos Text",system-ui,sans-serif;color:#2c3b4d;opacity:0;transform:translateY(12px);transition:opacity .25s,transform .25s}.cookie-bar.cookie-show{opacity:1;transform:none}.cookie-bar.cookie-hide{opacity:0;transform:translateY(12px)}.cookie-bar p{margin:0;font-size:14px}.cookie-bar a{color:inherit;text-decoration:underline;text-underline-offset:2px}.cookie-actions{display:flex;gap:8px}.cookie-actions button{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:0 20px;border-radius:999px;font:600 14px/1.2 "Golos Text",system-ui,sans-serif;cursor:pointer;border:1px solid #a35139;background:#a35139;color:#fff6e8}.cookie-actions button:hover{background:#8e4430;border-color:#8e4430}.cookie-actions .cookie-no{background:transparent;border-color:transparent;color:#5b6472}.cookie-actions .cookie-no:hover{background:#f4e0bf;border-color:#f4e0bf}@media (max-width:600px){.cookie-bar{left:12px;right:12px;bottom:12px;width:auto}.cookie-actions button{flex:1}}@media (prefers-reduced-motion:reduce){.cookie-bar{transition:none}}';

  function showBanner(){
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    var box = document.createElement('div');
    box.className = 'cookie-bar';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-live', 'polite');
    box.setAttribute('aria-label', 'Согласие на cookie');
    box.innerHTML =
      '<p>Сайт использует cookie и Яндекс Метрику, чтобы понимать, как им пользуются. ' +
      '<a href="/privacy.html#cookie">Подробнее</a></p>' +
      '<div class="cookie-actions">' +
        '<button type="button" data-v="yes">Согласен</button>' +
        '<button type="button" class="cookie-no" data-v="no">Нет</button>' +
      '</div>';
    box.addEventListener('click', function(e){
      var b = e.target.closest && e.target.closest('button[data-v]');
      if(!b) return;
      var v = b.getAttribute('data-v');
      save(v);
      box.classList.add('cookie-hide');
      setTimeout(function(){ box.remove(); }, 250);
      if(v === 'yes') loadMetrika();
    });
    document.body.appendChild(box);
    requestAnimationFrame(function(){ box.classList.add('cookie-show'); });
  }

  var v = read();
  if(v === 'yes') loadMetrika();
  else if(v !== 'no'){
    if(document.body) showBanner();
    else document.addEventListener('DOMContentLoaded', showBanner);
  }
})();
