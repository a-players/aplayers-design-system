/* =====================================================================
   A-Players Design System · docs.js
   Rotas por hash (#rota ou #rota/secao) com a cortina de quatro cores,
   abertura na primeira visita, índice lateral que acompanha a leitura,
   código das vitrines gerado do próprio exemplo, cópia, seletor de tom,
   demos de movimento, abas, mapa de escolha, tema e tabelas vivas
   (contraste calculado e tokens lidos de tokens/tokens.json).
   ===================================================================== */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches || root.classList.contains('reduce-motion');
  var ROUTES = { inicio: 'Início', fundamentos: 'Fundamentos', componentes: 'Componentes', padroes: 'Padrões', voz: 'Voz e escrita', recursos: 'Recursos' };
  var BASE_TITLE = 'A-Players Design System';
  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }

  /* ------------------------------------------------------------ aviso de cópia */
  var toast = $('.copied');
  var toastT;
  function say(msg) {
    if (!toast) return;
    toast.querySelector('span').textContent = msg;
    toast.classList.add('is-on'); clearTimeout(toastT);
    toastT = setTimeout(function () { toast.classList.remove('is-on'); }, 1800);
  }
  function copy(text, label) {
    function done() { say(label || 'Copiado'); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
    function fallback() {
      var ta = d.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; d.body.appendChild(ta); ta.select();
      try { d.execCommand('copy'); done(); } catch (e) { say('Selecione e copie o texto'); }
      ta.remove();
    }
  }

  /* ------------------------------------------------------------ rotas */
  var current = null, first = true, pinned = null;
  var curtain = $('.curtain'), curtainLabel = $('.curtain__label');
  function parse() {
    var h = (location.hash || '').replace('#', ''), parts = h.split('/');
    var r = ROUTES[parts[0]] ? parts[0] : 'inicio';
    return { rota: r, secao: parts[1] || null };
  }
  function show(rota, secao) {
    $$('.rota').forEach(function (a) { a.classList.toggle('is-active', a.dataset.rota === rota); });
    $$('[data-nav]').forEach(function (a) { if (a.dataset.nav === rota) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    d.title = rota === 'inicio' ? BASE_TITLE : ROUTES[rota] + ' | ' + BASE_TITLE;
    var art = $('.rota.is-active');
    if (art && !reduced) { art.classList.remove('is-entering'); void art.offsetWidth; art.classList.add('is-entering'); setTimeout(function () { art.classList.remove('is-entering'); }, 1400); }
    var target = secao ? d.getElementById(rota + '-' + secao) : null;
    pinned = target ? target.id : null;
    if (target) target.scrollIntoView({ block: 'start' }); else window.scrollTo(0, 0);
    if (rota === 'inicio') charge();
    spy();
    if (window.apdsGraph) window.apdsGraph.refresh();
  }
  function go() {
    var p = parse();
    if (p.rota === current) {
      var t = p.secao ? d.getElementById(p.rota + '-' + p.secao) : null;
      pinned = t ? t.id : null;
      if (t) t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      return;
    }
    var prev = current; current = p.rota;
    closeMenu();
    if (first || reduced || !curtain || !prev) { first = false; show(p.rota, p.secao); return; }
    curtainLabel.textContent = ROUTES[p.rota];
    curtain.hidden = false; curtain.classList.remove('is-out'); void curtain.offsetWidth; curtain.classList.add('is-in');
    setTimeout(function () {
      show(p.rota, p.secao);
      curtain.classList.remove('is-in'); curtain.classList.add('is-out');
      setTimeout(function () { curtain.hidden = true; curtain.classList.remove('is-out'); }, 760);
    }, 620);
  }
  window.addEventListener('hashchange', go);

  /* hífen que carrega, na abertura da Home */
  function charge() {
    var hy = $('[data-rota="inicio"] .hero .ap-hy');
    if (!hy || reduced) return;
    hy.classList.remove('is-charging'); void hy.offsetWidth; hy.classList.add('is-charging');
  }

  /* ------------------------------------------------------------ abertura (primeira visita) */
  function intro() {
    var el = $('.intro');
    var seen = false;
    try { seen = sessionStorage.getItem('apds-abertura') === '1'; } catch (e) { seen = true; }
    if (!el || reduced || seen || parse().rota !== 'inicio') { if (el) el.remove(); return; }
    el.hidden = false;
    var ended = false;
    function end() {
      if (ended) return; ended = true;
      try { sessionStorage.setItem('apds-abertura', '1'); } catch (e) { /* sem armazenamento */ }
      el.classList.add('is-leaving');
      charge();
      setTimeout(function () { el.remove(); }, 900);
    }
    el.addEventListener('click', end);
    d.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { end(); d.removeEventListener('keydown', k); } });
    setTimeout(end, 2300);
  }
  window.apdsReplayIntro = function () {
    try { sessionStorage.removeItem('apds-abertura'); } catch (e) { /* sem armazenamento */ }
    var tpl = $('#tpl-intro');
    if (!tpl) return;
    d.body.appendChild(tpl.content.cloneNode(true));
    var el = d.body.lastElementChild; el.hidden = false;
    var ended = false;
    function end() { if (ended) return; ended = true; el.classList.add('is-leaving'); setTimeout(function () { el.remove(); }, 900); }
    el.addEventListener('click', end); setTimeout(end, 2300);
  };
  window.apdsCurtain = function () {
    if (!curtain || reduced) return;
    curtainLabel.textContent = 'A-Players';
    curtain.hidden = false; curtain.classList.remove('is-out'); void curtain.offsetWidth; curtain.classList.add('is-in');
    setTimeout(function () { curtain.classList.remove('is-in'); curtain.classList.add('is-out'); setTimeout(function () { curtain.hidden = true; curtain.classList.remove('is-out'); }, 760); }, 900);
  };

  /* ------------------------------------------------------------ índice lateral que acompanha a leitura */
  var spyT;
  function spy() {
    if (spyT) return;
    spyT = setTimeout(function () {
      spyT = null;
      var art = $('.rota.is-active'); if (!art) return;
      var links = $$('.side ol a[href^="#"]', art); if (!links.length) return;
      var y = 140, pick = links[0];
      links.forEach(function (a) {
        var t = d.getElementById(a.getAttribute('href').slice(1).replace('/', '-'));
        if (t && t.getBoundingClientRect().top - y <= 0) pick = a;
      });
      // no fim da página, as últimas seções nunca chegam ao topo: vale a última visível
      if (innerHeight + scrollY >= root.scrollHeight - 8) {
        links.forEach(function (a) {
          var t = d.getElementById(a.getAttribute('href').slice(1).replace('/', '-'));
          if (t && t.getBoundingClientRect().top < innerHeight * .8) pick = a;
        });
      }
      // seção escolhida no índice fica marcada até a pessoa rolar por conta própria
      if (pinned) links.forEach(function (a) { if (a.getAttribute('href').slice(1).replace('/', '-') === pinned) pick = a; });
      links.forEach(function (a) { a.classList.toggle('is-current', a === pick); });
      if (matchMedia('(max-width: 1000px)').matches && pick.scrollIntoView) {
        var ol = pick.parentElement.parentElement; var l = pick.offsetLeft - 20;
        if (ol && (l < ol.scrollLeft || l > ol.scrollLeft + ol.clientWidth - 80)) ol.scrollTo({ left: l, behavior: 'smooth' });
      }
    }, 60);
  }
  window.addEventListener('scroll', spy, { passive: true });
  ['wheel', 'touchmove', 'keydown', 'mousedown'].forEach(function (ev) { window.addEventListener(ev, function (e) { if (pinned && !(ev === 'mousedown' && e.target.closest && e.target.closest('a[href^="#"]'))) { pinned = null; spy(); } }, { passive: true }); });

  /* ------------------------------------------------------------ vitrines: código gerado do exemplo */
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function tidy(html) {
    var lines = html.replace(/\sdata-demo-[a-z-]+(="[^"]*")?/g, '').replace(/^\n+|\s+$/g, '').split('\n');
    var ind = lines.filter(function (l) { return l.trim(); }).reduce(function (m, l) { return Math.min(m, l.match(/^\s*/)[0].length); }, 99);
    return lines.map(function (l) { return l.slice(ind); }).join('\n');
  }
  function paint(code) {
    return esc(code)
      .replace(/(&lt;\/?)([a-z0-9-]+)/g, '$1<span class="t">$2</span>')
      .replace(/ ([a-z-:]+)=("[^"]*")/g, ' <span class="a">$1</span>=<span class="v">$2</span>');
  }
  $$('.spec').forEach(function (spec) {
    var stage = $('.spec__stage', spec), bar = $('.spec__bar', spec);
    if (!stage || !bar || spec.hasAttribute('data-nocode')) return;
    var src = spec.querySelector('[data-snippet]') ? $$('[data-snippet]', spec).map(function (n) { var c = n.cloneNode(true); c.removeAttribute('data-snippet'); return c.outerHTML; }).join('\n') : stage.innerHTML;
    var code = tidy(src);
    var box = d.createElement('div'); box.className = 'spec__code'; box.hidden = true;
    box.innerHTML = '<pre><code>' + paint(code) + '</code></pre>';
    spec.appendChild(box);
    var tools = d.createElement('div'); tools.className = 'spec__tools';
    tools.innerHTML = '<button type="button" class="tool" aria-pressed="false"><svg aria-hidden="true"><use href="#i-code"/></svg>Código</button><button type="button" class="tool"><svg aria-hidden="true"><use href="#i-copy"/></svg>Copiar</button>';
    bar.appendChild(tools);
    var b = tools.children;
    b[0].addEventListener('click', function () { var open = box.hidden; box.hidden = !open; b[0].setAttribute('aria-pressed', String(open)); });
    b[1].addEventListener('click', function () { copy(code, 'Código copiado'); });
  });
  $$('[data-copy]').forEach(function (el) {
    el.addEventListener('click', function () { copy(el.dataset.copy, 'Copiado: ' + el.dataset.copy); });
  });
  $$('.code').forEach(function (c) {
    var btn = $('.tool', c), pre = $('pre', c);
    if (btn && pre) btn.addEventListener('click', function () { copy(pre.textContent, 'Código copiado'); });
  });

  /* ------------------------------------------------------------ seletor de tom das vitrines */
  $$('[data-toner]').forEach(function (t) {
    var target = d.querySelector(t.dataset.toner);
    $$('button', t).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('button', t).forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
        if (target) target.style.setProperty('--ap-tone', b.dataset.tone);
      });
    });
  });

  /* ------------------------------------------------------------ demos de movimento */
  $$('[data-play]').forEach(function (btn) {
    var m = btn.closest('.motion');
    btn.addEventListener('click', function () {
      if (btn.dataset.play === 'curtain') { window.apdsCurtain(); return; }
      if (btn.dataset.play === 'intro') { window.apdsReplayIntro(); return; }
      if (!m) return;
      m.classList.remove('is-playing'); void m.offsetWidth; m.classList.add('is-playing');
    });
  });
  // curvas de aceleração desenhadas a partir dos tokens
  $$('svg.curve[data-bezier]').forEach(function (svg) {
    var p = svg.dataset.bezier.split(',').map(Number), s = 120, o = 14;
    function X(v) { return o + v * s; } function Y(v) { return o + s - v * s; }
    svg.setAttribute('viewBox', '0 0 ' + (s + o * 2) + ' ' + (s + o * 2));
    svg.innerHTML = '<path class="axis" d="M' + X(0) + ' ' + Y(0) + 'H' + X(1) + 'M' + X(0) + ' ' + Y(0) + 'V' + Y(1) + '"/>' +
      '<path class="line" d="M' + X(0) + ' ' + Y(0) + 'C' + X(p[0]) + ' ' + Y(p[1]) + ' ' + X(p[2]) + ' ' + Y(p[3]) + ' ' + X(1) + ' ' + Y(1) + '"/>' +
      '<circle cx="' + X(0) + '" cy="' + Y(0) + '" r="4"/><circle cx="' + X(1) + '" cy="' + Y(1) + '" r="4"/>';
  });

  /* ------------------------------------------------------------ abas (padrão role=tab) */
  $$('[data-tabs]').forEach(function (list) {
    var tabs = $$('[role="tab"]', list);
    function pick(t, focus) {
      tabs.forEach(function (o) { var on = o === t; o.setAttribute('aria-selected', String(on)); o.tabIndex = on ? 0 : -1; });
      if (focus) t.focus();
      list.dispatchEvent(new CustomEvent('pick', { detail: t }));
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { pick(t); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, n = null;
        if (k === 'ArrowDown' || k === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (k === 'ArrowUp' || k === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (k === 'Home') n = tabs[0]; if (k === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); pick(n, true); }
      });
    });
  });
  // mapa de escolha: cada desafio acende o caminho
  $$('[data-map]').forEach(function (map) {
    var list = $('[data-tabs]', map), out = $('[data-map-out]', map);
    function light(t) {
      var on = (t.dataset.path || '').split(' ');
      map.style.setProperty('--ap-tone', t.dataset.tone);
      $$('.ap-node', map).forEach(function (n) { var hit = on.indexOf(n.dataset.k) >= 0; n.classList.toggle('is-on', hit); n.classList.toggle('is-dim', !hit); });
      if (out) { out.textContent = t.dataset.out || ''; }
    }
    if (list) { list.addEventListener('pick', function (e) { light(e.detail); }); light($('[aria-selected="true"]', list)); }
  });
  // filtros (pressionado/solto)
  $$('.ap-filters[data-demo-filters]').forEach(function (f) {
    $$('.ap-filter', f).forEach(function (b) { b.addEventListener('click', function () { $$('.ap-filter', f).forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); }); }); });
  });
  // seletor de idioma (demonstração)
  $$('.ap-lang[data-demo-lang]').forEach(function (l) {
    $$('.ap-lang__opt', l).forEach(function (o, i) { o.addEventListener('click', function () { $$('.ap-lang__opt', l).forEach(function (x) { x.setAttribute('aria-current', String(x === o)); }); l.dataset.active = String(i + 1); }); });
  });
  // campo de arquivo
  $$('.ap-file input[type="file"]').forEach(function (inp) {
    inp.addEventListener('change', function () { var n = inp.parentElement.querySelector('.ap-file__name'); if (n) n.textContent = inp.files && inp.files[0] ? inp.files[0].name : 'Nenhum arquivo escolhido'; });
  });

  /* ------------------------------------------------------------ tema */
  // o mesmo tema do site (ap-tema): entre visitas só com cookies de preferências permitidos, senão vale na sessão
  function keepTheme(t) {
    var keep = false;
    try { var c = JSON.parse(localStorage.getItem('ap-consentimento') || 'null'); keep = !!(c && c.v === 1 && c.preferences); } catch (e) { /* sem consentimento lido */ }
    try {
      if (keep) { localStorage.setItem('ap-tema', t); sessionStorage.removeItem('ap-tema'); }
      else { sessionStorage.setItem('ap-tema', t); localStorage.removeItem('ap-tema'); }
    } catch (e) { /* sem armazenamento: o tema vale até recarregar */ }
  }
  function setTheme(t, from) {
    function apply() { root.setAttribute('data-theme', t); keepTheme(t); syncMode(); }
    if (d.startViewTransition && !reduced && from) {
      var r = from.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
      var end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      var vt = d.startViewTransition(apply);
      vt.ready.then(function () { root.animate({ clipPath: ['circle(0 at ' + x + 'px ' + y + 'px)', 'circle(' + end + 'px at ' + x + 'px ' + y + 'px)'] }, { duration: 650, easing: 'cubic-bezier(.16, 1, .3, 1)', pseudoElement: '::view-transition-new(root)' }); }).catch(function () {});
    } else apply();
  }
  function syncMode() { var dark = root.getAttribute('data-theme') === 'dark'; $$('.ap-mode[data-theme-toggle]').forEach(function (m) { m.setAttribute('aria-checked', String(dark)); }); paintContrast(); }
  $$('.ap-mode[data-theme-toggle]').forEach(function (m) { m.addEventListener('click', function () { setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', m); }); });

  /* ------------------------------------------------------------ contraste calculado */
  function hex(c) {
    var p = d.createElement('i'); p.style.color = c; d.body.appendChild(p); var v = getComputedStyle(p).color; p.remove();
    var m = v.match(/[\d.]+/g).map(Number); return m;
  }
  function lum(c) { var f = function (v) { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); }
  function ratio(a, b) { var l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05); }
  function paintContrast() {
    $$('[data-contrast]').forEach(function (row) {
      var cs = getComputedStyle(row);
      var fg = hex(cs.getPropertyValue('--fg').trim()), bg = hex(cs.getPropertyValue('--bg').trim());
      var r = ratio(fg, bg), big = row.dataset.contrast === 'grande';
      var ok = r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? (big ? 'AA (texto grande)' : 'Só texto grande') : 'Não usar em texto';
      $('.c-ratio', row).textContent = r.toFixed(2).replace('.', ',') + ':1';
      $('.c-level', row).textContent = ok;
      $('.c-level', row).dataset.level = r >= 4.5 ? 'ok' : r >= 3 ? 'mid' : 'no';
    });
  }

  /* ------------------------------------------------------------ tokens lidos do JSON */
  var tokBox = $('[data-tokens]');
  function drawTokens(j) {
      var rows = [];
      Object.keys(j).forEach(function (g) {
        if (g.charAt(0) === '$') return;
        Object.keys(j[g]).forEach(function (n) {
          var t = j[g][n], v = t.$value, dk = t.$extensions && t.$extensions['tema-escuro'];
          var isColor = /^(#|rgba?\()/.test(v), name = '--ap-' + n;
          rows.push('<tr><td><code>' + esc(name) + '</code></td><td class="muted">' + esc(g) + '</td><td>' + (isColor ? '<i class="tok-sw" style="--sw:' + v + '"></i>' : '') + '<code>' + esc(v) + '</code></td><td>' + (dk ? (/^(#|rgba?\()/.test(dk) ? '<i class="tok-sw" style="--sw:' + dk + '"></i>' : '') + '<code>' + esc(dk) + '</code>' : '<span class="muted">igual</span>') + '</td><td class="muted">' + esc(t.$description || '') + '</td></tr>');
        });
      });
      tokBox.innerHTML = rows.join('');
      var count = $('[data-token-count]'); if (count) count.textContent = String(rows.length);
  }
  // tokens/tokens.js traz o mesmo JSON embutido, para a tabela abrir até fora do servidor
  if (tokBox && window.APDS_TOKENS) drawTokens(window.APDS_TOKENS);
  else if (tokBox && window.fetch) {
    fetch('tokens/tokens.json').then(function (r) { return r.json(); }).then(drawTokens)
      .catch(function () { tokBox.innerHTML = '<tr><td colspan="5">Não foi possível ler tokens/tokens.json. Rode python tools/build_tokens.py.</td></tr>'; });
  }

  /* ------------------------------------------------------------ menu móvel */
  var burger = $('.burger'), menu = $('#menu');
  function closeMenu() { if (burger && menu && !menu.hidden) { menu.hidden = true; burger.setAttribute('aria-expanded', 'false'); } }
  if (burger && menu) {
    burger.addEventListener('click', function () { var open = menu.hidden; menu.hidden = !open; burger.setAttribute('aria-expanded', String(open)); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ------------------------------------------------------------ início */
  syncMode();
  intro();
  go();
})();
