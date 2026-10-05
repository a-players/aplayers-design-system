/* =====================================================================
   Gráfico vivo do Design System (versão compacta do canvas do site)
   Cinco polos (as áreas do sistema) com satélites rotulados e poeira de
   contexto. Profundidade com câmera lenta, cursor que inclina a cena e
   liga os nós próximos, retícula de 56px que acende perto do cursor.
   O gráfico se ancora no elemento [data-graph] da página ativa e acompanha
   a rolagem como se estivesse impresso nela.
   Polos próprios: window.APDS_GRAPH_GROUPS (cinco), definido antes deste arquivo.
   API: window.apdsGraph.refresh()
   ===================================================================== */
(function () {
  'use strict';
  var canvas = document.getElementById('grafo');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]movimento=reduzido/.test(location.search);
  var LITE = matchMedia('(max-width: 760px), (pointer: coarse)').matches;
  var DPR = Math.min(window.devicePixelRatio || 1, LITE ? 1.25 : 1.75);
  var GRID = 56, FOCAL = 900;
  var PAL = { blue: [53, 128, 195], green: [110, 183, 81], red: [235, 89, 77], yellow: [241, 232, 78], violet: [161, 139, 232], ice: [183, 194, 211] };

  // uma peça pode trocar os polos antes de carregar este arquivo: window.APDS_GRAPH_GROUPS = [{ label, tone, at, sats }] (cinco polos)
  var GROUPS = window.APDS_GRAPH_GROUPS || [
    { label: 'Fundamentos', tone: 'blue', at: [0.30, 0.26], sats: ['Cor', 'Tipografia', 'Forma', 'Movimento'] },
    { label: 'Componentes', tone: 'green', at: [0.74, 0.20], sats: ['Placa', 'Selo', 'Pill', 'Botão'] },
    { label: 'Padrões', tone: 'red', at: [0.86, 0.64], sats: ['Abertura', 'Folha', 'Jornada'] },
    { label: 'Voz', tone: 'yellow', at: [0.50, 0.84], sats: ['Escrita', 'Vocabulário'] },
    { label: 'Recursos', tone: 'violet', at: [0.14, 0.68], sats: ['Tokens', 'Logos', 'IA'] }
  ];
  var LINKS = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2], [1, 3]];

  function rng(seed) { var s = seed; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + Math.max(0, Math.min(1, a)).toFixed(3) + ')'; }

  var W = 0, H = 0, nodes = [], edges = [], anchor = null, rect = null, cam = { yaw: 0, pitch: 0 }, P = { x: 0, y: 0, on: false }, pulses = [];
  var running = false, last = 0;

  function build() {
    var R = rng(11), w = rect.width, h = rect.height;
    nodes = []; edges = [];
    var spread = Math.min(w, h) * (LITE ? 0.16 : 0.13);
    GROUPS.forEach(function (g, gi) {
      var hx = g.at[0] * w, hy = g.at[1] * h;
      var hub = { x: hx, y: hy, z: 0, r: LITE ? 7 : 9, c: PAL[g.tone], kind: 'hub', label: g.label, g: gi, ph: R() * 6 };
      nodes.push(hub);
      var hi = nodes.length - 1;
      g.sats.forEach(function (s, k) {
        var a = (k / g.sats.length) * Math.PI * 2 + R() * 0.8, d = spread * (0.9 + R() * 0.5);
        nodes.push({ x: hx + Math.cos(a) * d, y: hy + Math.sin(a) * d * 0.8, z: (R() - 0.5) * 90, r: 4, c: PAL[g.tone], kind: 'sat', label: s, g: gi });
        edges.push({ i: hi, j: nodes.length - 1, kind: 'hub', bend: (R() - 0.5) * 0.3 });
      });
      var dust = LITE ? 6 : 11;
      for (var q = 0; q < dust; q++) {
        var a2 = R() * Math.PI * 2, d2 = spread * (0.5 + R() * 1.6);
        nodes.push({ x: hx + Math.cos(a2) * d2, y: hy + Math.sin(a2) * d2, z: (R() - 0.5) * 340, r: 1.2 + R() * 1.8, c: R() < 0.25 ? PAL.ice : PAL[g.tone], kind: 'dust', g: gi });
        if (R() < 0.55) edges.push({ i: hi, j: nodes.length - 1, kind: 'mesh', bend: (R() - 0.5) * 0.4 });
      }
    });
    var hubIdx = nodes.map(function (n, i) { return n.kind === 'hub' ? i : -1; }).filter(function (i) { return i >= 0; });
    LINKS.forEach(function (l) { edges.push({ i: hubIdx[l[0]], j: hubIdx[l[1]], kind: 'bridge', bend: 0.14 * (l[0] % 2 ? 1 : -1) }); });
  }

  function project() {
    var cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    var cyw = Math.cos(cam.yaw), syw = Math.sin(cam.yaw), cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i], dx = rect.left + n.x - cx, dy = rect.top + n.y - cy, dz = n.z;
      var x1 = dx * cyw + dz * syw, z1 = -dx * syw + dz * cyw;
      var y1 = dy * cp - z1 * sp, z2 = dy * sp + z1 * cp;
      var s = FOCAL / (FOCAL + z2);
      n.px = cx + x1 * s; n.py = cy + y1 * s; n.ps = s;
      n.pd = Math.max(0.42, Math.min(1, 1 - (z2 + 60) / 420));
    }
  }

  function mark(x, y, h) {
    var a = h * 0.78, b = h * 0.26;
    ctx.beginPath();
    ctx.moveTo(x - h + a, y - h);
    ctx.lineTo(x + h - b, y - h); ctx.arcTo(x + h, y - h, x + h, y - h + b, b);
    ctx.lineTo(x + h, y + h - a); ctx.arcTo(x + h, y + h, x + h - a, y + h, a);
    ctx.lineTo(x - h + b, y + h); ctx.arcTo(x - h, y + h, x - h, y + h - b, b);
    ctx.lineTo(x - h, y - h + a); ctx.arcTo(x - h, y - h, x - h + a, y - h, a);
    ctx.closePath();
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    if (!rect) return;
    // retícula: acende perto do cursor
    if (P.on && !reduced) {
      var offY = -((window.scrollY || 0) % GRID), offX = (W % GRID) / 2;
      for (var gy = offY; gy < H; gy += GRID) {
        if (Math.abs(gy - P.y) > 220) continue;
        for (var gx = offX; gx < W; gx += GRID) {
          var dd = Math.hypot(gx - P.x, gy - P.y);
          if (dd < 220) { ctx.fillStyle = 'rgba(241,232,78,' + (0.32 * (1 - dd / 220)).toFixed(3) + ')'; ctx.fillRect(gx - 1.5, gy - 1.5, 3, 3); }
        }
      }
    }
    var dim = anchor && anchor.dataset.graphDim ? +anchor.dataset.graphDim : 1;
    ctx.lineCap = 'round';
    edges.forEach(function (e) {
      var A = nodes[e.i], B = nodes[e.j];
      var base = e.kind === 'bridge' ? 0.5 : e.kind === 'hub' ? 0.42 : 0.14;
      var alpha = base * dim * Math.min(A.pd, B.pd);
      var mx = (A.px + B.px) / 2, my = (A.py + B.py) / 2, dx = B.px - A.px, dy = B.py - A.py;
      ctx.strokeStyle = rgba(A.c, alpha); ctx.lineWidth = (e.kind === 'bridge' ? 1.7 : 1) * Math.min(A.ps, B.ps);
      ctx.beginPath(); ctx.moveTo(A.px, A.py); ctx.quadraticCurveTo(mx - dy * e.bend, my + dx * e.bend, B.px, B.py); ctx.stroke();
    });
    // brilho dos polos e pulsos
    ctx.globalCompositeOperation = 'lighter';
    nodes.forEach(function (n) {
      if (n.kind !== 'hub' || LITE) return;
      var gr = (n.r + 26 + (reduced ? 0 : Math.sin(t * 0.002 + n.ph) * 3)) * n.ps;
      var g = ctx.createRadialGradient(n.px, n.py, 0, n.px, n.py, gr);
      g.addColorStop(0, rgba(n.c, 0.32 * dim)); g.addColorStop(1, rgba(n.c, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(n.px, n.py, gr, 0, 6.283); ctx.fill();
    });
    pulses.forEach(function (pu) {
      var A = nodes[pu.e.i], B = nodes[pu.e.j], u = pu.t, iu = 1 - u;
      var mx = (A.px + B.px) / 2, my = (A.py + B.py) / 2, dx = B.px - A.px, dy = B.py - A.py, cx = mx - dy * pu.e.bend, cy = my + dx * pu.e.bend;
      var x = iu * iu * A.px + 2 * iu * u * cx + u * u * B.px, y = iu * iu * A.py + 2 * iu * u * cy + u * u * B.py, pa = Math.sin(Math.PI * u) * dim;
      ctx.fillStyle = rgba(A.c, 0.35 * pa); ctx.beginPath(); ctx.arc(x, y, 6, 0, 6.283); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,' + (0.85 * pa).toFixed(3) + ')'; ctx.beginPath(); ctx.arc(x, y, 1.8, 0, 6.283); ctx.fill();
    });
    ctx.globalCompositeOperation = 'source-over';
    // nós
    nodes.forEach(function (n) {
      var a = 0.94 * dim * n.pd, r = n.r * n.ps;
      if (n.kind === 'hub') {
        ctx.strokeStyle = rgba(n.c, 0.5 * a); ctx.lineWidth = 1.2; mark(n.px, n.py, r * 0.92 + 6); ctx.stroke();
        ctx.fillStyle = rgba(n.c, a); mark(n.px, n.py, r * 0.92); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,' + (0.5 * a).toFixed(3) + ')'; mark(n.px - r * 0.22, n.py - r * 0.22, r * 0.3); ctx.fill();
      } else if (n.kind === 'sat') {
        ctx.strokeStyle = rgba(n.c, 0.42 * a); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(n.px, n.py, r + 3.5, 0, 6.283); ctx.stroke();
        ctx.fillStyle = rgba(n.c, a); ctx.beginPath(); ctx.arc(n.px, n.py, r, 0, 6.283); ctx.fill();
      } else {
        ctx.fillStyle = rgba(n.c, a * 0.9); ctx.beginPath(); ctx.arc(n.px, n.py, r, 0, 6.283); ctx.fill();
      }
    });
    // o cursor como agente: liga os nós próximos
    if (P.on && !reduced) {
      var near = [];
      nodes.forEach(function (m) { var dx = m.px - P.x, dy = m.py - P.y, d2 = dx * dx + dy * dy; if (d2 < 150 * 150) near.push([d2, m]); });
      near.sort(function (a, b) { return a[0] - b[0]; });
      near.slice(0, 7).forEach(function (q) {
        var d = Math.sqrt(q[0]); ctx.strokeStyle = rgba(q[1].c, 0.55 * (1 - d / 150)); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(P.x, P.y); ctx.lineTo(q[1].px, q[1].py); ctx.stroke();
      });
      if (near.length) { ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(P.x, P.y, 5, 0, 6.283); ctx.stroke(); }
    }
    // rótulos: polos sempre; satélites perto do cursor (ou todos no modo calmo)
    var labels = anchor && anchor.dataset.graphLabels || 'hubs';
    ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    nodes.forEach(function (n) {
      if (!n.label) return;
      var hub = n.kind === 'hub';
      if (!hub) {
        if (labels !== 'all') {
          if (!P.on) return;
          var dx = P.x - n.px, dy = P.y - n.py; if (dx * dx + dy * dy > 130 * 130) return;
        }
      } else if (labels === 'none') return;
      ctx.font = (hub ? '700 13.5px' : '500 12px') + ' "DM Sans", system-ui, sans-serif';
      var lx, ly = n.py;
      if (hub) { ctx.textAlign = 'center'; ly = n.py + n.r * n.ps + 20; lx = n.px; }
      else { var right = (n.px - rect.left) < rect.width * 0.62; ctx.textAlign = right ? 'left' : 'right'; lx = right ? n.px + 10 : n.px - 10; }
      ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(13,23,40,' + (0.85 * dim).toFixed(3) + ')'; ctx.strokeText(n.label, lx, ly);
      ctx.fillStyle = hub ? 'rgba(255,255,255,' + (0.95 * Math.max(dim, 0.85)).toFixed(3) + ')' : 'rgba(215,224,236,.88)';
      ctx.fillText(n.label, lx, ly);
    });
  }

  function step(t) {
    var dt = Math.min(50, t - (last || t)); last = t;
    var ty = P.on ? ((P.x / W) - 0.5) * 0.35 : 0, tp = P.on ? ((P.y / H) - 0.5) * 0.22 : 0;
    cam.yaw += ((reduced ? 0 : Math.sin(t * 0.00012) * 0.28) + ty - cam.yaw) * 0.04;
    cam.pitch += (tp - cam.pitch) * 0.04;
    if (!reduced && Math.random() < dt * 0.0012 && edges.length) {
      var e = edges[(Math.random() * edges.length) | 0];
      if (e.kind !== 'mesh') pulses.push({ e: e, t: 0, v: 0.008 + Math.random() * 0.006 });
    }
    for (var p = pulses.length - 1; p >= 0; p--) { pulses[p].t += pulses[p].v * dt / 16; if (pulses[p].t >= 1) pulses.splice(p, 1); }
  }

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  var builtFor = null;
  function locate() {
    var el = document.querySelector('.rota.is-active [data-graph]') || document.querySelector('[data-graph]');
    anchor = el;
    if (!el) { rect = null; return false; }
    var r = el.getBoundingClientRect();
    if (r.width < 10 || r.height < 10) { rect = null; return false; }
    rect = { left: r.left, top: r.top, width: r.width, height: r.height };
    var key = el.id + '|' + Math.round(r.width) + 'x' + Math.round(r.height);
    if (key !== builtFor) { builtFor = key; build(); }
    return r.bottom > -100 && r.top < H + 100;
  }

  function frame(t) {
    var vis = locate();
    if (!vis) { ctx.clearRect(0, 0, W, H); running = false; return; }
    step(t); project(); draw(t);
    if (!reduced && !document.hidden) requestAnimationFrame(frame); else running = false;
  }
  function kick() { if (!running) { running = true; requestAnimationFrame(frame); } }
  function still() { if (locate()) { project(); draw(0); } else ctx.clearRect(0, 0, W, H); }

  resize();
  window.addEventListener('resize', function () { resize(); builtFor = null; reduced ? still() : kick(); });
  window.addEventListener('scroll', function () { reduced ? still() : kick(); }, { passive: true });
  window.addEventListener('pointermove', function (e) { if (e.pointerType === 'touch') return; P.x = e.clientX; P.y = e.clientY; P.on = true; if (!reduced) kick(); }, { passive: true });
  document.addEventListener('pointerleave', function () { P.on = false; });
  document.addEventListener('visibilitychange', function () { if (!document.hidden && !reduced) kick(); });
  window.apdsGraph = { refresh: function () { builtFor = null; reduced ? still() : kick(); } };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { reduced ? still() : kick(); });
  reduced ? still() : kick();
})();
