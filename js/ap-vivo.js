/* =====================================================================
   A-Players · Graph, o gráfico do site (APVivo) 1.1
   O mesmo motor do canvas do site (js/graph.js), empacotado para qualquer
   peça: um contêiner, um canvas, uma formação. Os números são os do site;
   mude a formação e as camadas, não as constantes.

   Uso mínimo
     <div class="ap-vivo" data-vivo="constellation" style="height:560px"></div>
     <script src="js/ap-vivo.js" defer></script>

   Atributos (todos opcionais)
     data-vivo           formação: constellation, fronts, ecosystem, context,
                         context-wide, cycle, flow, people, people-wide,
                         teamwork, operation, cisp, calm
     data-vivo-layers    só estas camadas, separadas por espaço
     data-vivo-off       camadas desligadas, separadas por espaço
                         camadas: grid glow edges pulses halos nodes labels
                                  cursor attract breathe camera depth
     data-vivo-labels    hubs | sats | all | none
     data-vivo-nodes     quantidade de nós (96 na tela larga, 60 no celular)
     data-vivo-area      "x y largura altura" (0 a 1): onde a formação vive
     data-vivo-hole      "x y largura altura" (0 a 1): zona livre para texto
     data-vivo-dim       0 a 1: intensidade
     data-vivo-touch     o toque também funciona como cursor
     data-vivo-theme     night (padrão) | day | auto (segue o data-theme do html)
     .ap-vivo--page      fundo fixo da página: transparente, sem retícula
                         própria; o brilho se alinha à retícula do body

   API
     var g = APVivo.mount(el, { formation, layers, off, labels, nodes, area, hole, dim, touch, theme, page })
     g.set(formação) · g.burst(x, y) · g.highlight(chave) · g.layer(nome, ligada)
     g.png(escala) · g.step(quadros) · g.state() · g.destroy()
     APVivo.formations · APVivo.palette · APVivo.mark(ctx, x, y, meia)
     APVivo.depth()      reposiciona as formas .ap-geo[data-depth] (parallax)
   ===================================================================== */
(function (root) {
  'use strict';
  if (root.APVivo) return;

  var GRID = 56;
  var FOCAL = 900;
  var NIGHT = [13, 23, 40];
  var PAL = {
    blue: [53, 128, 195], blueL: [95, 166, 227], green: [110, 183, 81],
    red: [235, 89, 77], yellow: [241, 232, 78], violet: [161, 139, 232], ice: [183, 194, 211]
  };
  // o dia (lado B): tons sobre o claro. Amarelo vira o traço fino (--ap-yellow-line) e o gelo, um cinza azulado
  var DAY = {
    blue: PAL.blue, blueL: PAL.blueL, green: PAL.green, red: PAL.red,
    yellow: [212, 177, 6], violet: PAL.violet, ice: [141, 155, 176]
  };
  var THEMES = {
    night: { pal: PAL, bg: NIGHT, dot: 'rgba(183,194,211,0.09)', glow: [241, 232, 78], glowA: 0.32, ring: 'rgba(255,255,255,0.5)', core: null, blend: 'lighter', haloA: 0.34, hubLabel: [255, 255, 255], satLabel: [214, 224, 238] },
    day: { pal: DAY, bg: [255, 255, 255], dot: 'rgba(23,35,58,0.075)', glow: [212, 177, 6], glowA: 0.5, ring: 'rgba(23,35,58,0.42)', core: 'tone', blend: 'source-over', haloA: 0.2, hubLabel: [23, 35, 58], satLabel: [79, 93, 115] }
  };
  var LAYERS = ['grid', 'glow', 'edges', 'pulses', 'halos', 'nodes', 'labels', 'cursor', 'attract', 'breathe', 'camera', 'depth'];

  /* ------------------------------------------------------------ formações do site */
  // cópia fiel de js/graph.js (SPECS); rótulos em português
  var FORMATIONS = {
    // Home: o que a A-Players conecta, nas palavras da própria abertura; satélites em palavras soltas, quatro por grupo
    // (Processos e estratégia um pouco para dentro, longe da borda direita)
    constellation: {
      seed: 7, spread: 0.135, labels: 'hubs',
      groups: [
        { key: 'g-talentos', tags: ['taas'], label: 'Talentos e desenvolvimento', tone: 'blue', at: [0.30, 0.28], w: 1.35,
          sats: ['Recrutamento', 'Seleção', 'Carreira', 'Evolução'] },
        { key: 'g-pessoas', tags: ['taas'], label: 'Gestão de pessoas', tone: 'violet', at: [0.19, 0.69], w: 0.9,
          sats: ['Acompanhamento', 'Mentoria', 'Feedback', 'Engajamento'] },
        { key: 'g-plataformas', tags: ['intel'], label: 'Plataformas e aplicações', tone: 'green', at: [0.66, 0.16], w: 1,
          sats: ['Atlassian', 'CISP1', 'monday.com'] },
        { key: 'g-processos', tags: ['ps'], label: 'Processos e estratégia', tone: 'red', at: [0.81, 0.58], w: 1,
          sats: ['Consultoria especializada', 'Planos de assinatura', 'Arquitetura', 'Capacitações e workshops'] },
        { key: 'g-ia', tags: ['taas', 'ps', 'intel'], label: 'Inteligência Artificial', tone: 'yellow', at: [0.50, 0.80], w: 1.15,
          sats: ['AI-Player', 'Context Graph', 'Adoção de IA', 'FinOps IA'], satTags: ['taas', 'intel', 'ps', 'ps'] }
      ],
      links: [[0, 1], [0, 2], [2, 3], [3, 4], [4, 1], [0, 4, 'bridge'], [2, 4]]
    },
    // Nossos serviços: duas especialidades a partir do desafio
    fronts: {
      seed: 21, spread: 0.14, labels: 'hubs',
      groups: [
        { key: 'g-taas', tags: ['taas', 'g0'], label: 'Talent as a Service', tone: 'blue', at: [0.20, 0.34], w: 1.1,
          sats: ['Recrutamento e Seleção', 'Extensão de Equipe', 'AI-Player'] },
        { key: 'g-ps', tags: ['ps', 'g1'], label: 'Professional Services', tone: 'green', at: [0.80, 0.32], w: 1.3,
          sats: ['Consultoria especializada', 'Planos de assinatura', 'Capacitações e workshops', 'Adoção de IA', 'FinOps SaaS', 'FinOps IA'] },
        { key: 'g-desafio', tags: ['need'], label: 'O seu desafio', tone: 'red', at: [0.50, 0.90], w: 0.55, sats: ['Objetivos', 'Contexto'] }
      ],
      links: [[0, 2, 'bridge'], [1, 2, 'bridge'], [0, 1]]
    },
    // Intelligence e Home: as três plataformas conectadas pela A-Players Intelligence (o método no centro),
    // na ordem Atlassian (pelas Collections), CISP1, monday.com (sem aresta direta entre parceiros)
    ecosystem: {
      seed: 5, spread: 0.18, labels: 'hubs',
      groups: [
        { key: 'g-core', tags: ['core'], label: 'A-Players Intelligence', tone: 'yellow', at: [0.50, 0.50], w: 0.8,
          sats: ['Context Graph', 'Conhecimento', 'Integrações'] },
        { key: 'atlassian', tags: ['atlassian'], label: 'Atlassian', tone: 'blue', at: [0.23, 0.24], w: 1.05,
          sats: ['Teamwork Collection', 'Service Collection', 'Software Collection', 'Product Collection', 'Strategy Collection', 'Rovo'] },
        { key: 'cisp1', tags: ['cisp1'], label: 'CISP1', tone: 'violet', at: [0.83, 0.28], w: 0.95,
          sats: ['Estratégia', 'Arquitetura', 'Engenharia', 'Infraestrutura', 'Operação', 'Governança'] },
        { key: 'monday', tags: ['monday'], label: 'monday.com', tone: 'red', at: [0.56, 0.82], w: 1.05,
          sats: ['work management', 'monday CRM', 'monday dev', 'monday service', 'Sidekick', 'Agents', 'Vibe'] }
      ],
      links: [[0, 1, 'bridge'], [0, 2, 'bridge'], [0, 3, 'bridge']]
    },
    // Intelligence (cena lateral): o Context Graph em cinco camadas
    context: {
      seed: 13, spread: 0.15, labels: 'hubs',
      groups: [
        { key: 'g0', tags: ['negocio'], label: 'Negócio', tone: 'blue', at: [0.14, 0.52], w: 1.2, sats: ['Objetivos', 'Vocabulário'] },
        { key: 'g1', tags: ['processos'], label: 'Processos', tone: 'green', at: [0.36, 0.22], w: 1, sats: ['Fluxos', 'Papéis'] },
        { key: 'g2', tags: ['plataformas'], label: 'Plataformas', tone: 'red', at: [0.56, 0.60], w: 1, sats: ['Atlassian', 'CISP1', 'monday.com'] },
        { key: 'g3', tags: ['agentes'], label: 'Agentes', tone: 'yellow', at: [0.82, 0.26], w: 0.95, sats: ['AI-Player', 'Rovo', 'Sidekick'] },
        { key: 'g4', tags: ['feedback'], label: 'Feedback', tone: 'violet', at: [0.80, 0.84], w: 0.85, sats: ['Uso', 'Melhoria'] }
      ],
      links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0, 'back'], [0, 2]]
    },
    // Intelligence (abertura em tela cheia): as camadas envolvem o título
    'context-wide': {
      seed: 19, spread: 0.14, labels: 'hubs',
      groups: [
        { key: 'g0', tags: ['negocio'], label: 'Negócio', tone: 'blue', at: [0.09, 0.50], w: 1.2, sats: ['Objetivos', 'Vocabulário'] },
        { key: 'g1', tags: ['processos'], label: 'Processos', tone: 'green', at: [0.24, 0.12], w: 1, sats: ['Fluxos', 'Papéis'] },
        { key: 'g2', tags: ['plataformas'], label: 'Plataformas', tone: 'red', at: [0.52, 0.93], w: 1, sats: ['Atlassian', 'CISP1', 'monday.com'] },
        { key: 'g3', tags: ['agentes'], label: 'Agentes', tone: 'yellow', at: [0.78, 0.12], w: 0.95, sats: ['AI-Player', 'Rovo', 'Sidekick'] },
        { key: 'g4', tags: ['feedback'], label: 'Feedback', tone: 'violet', at: [0.92, 0.55], w: 0.85, sats: ['Uso', 'Melhoria'] }
      ],
      links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0, 'back']]
    },
    // Talent as a Service: seis momentos; o que se aprende volta ao desenvolvimento
    cycle: {
      seed: 3, spread: 0.1, labels: 'hubs',
      groups: [
        { key: 'c0', label: 'Recrutamento', tone: 'blue', at: [0.50, 0.10], w: 1, sats: ['Busca especializada'] },
        { key: 'c1', label: 'Seleção', tone: 'blueL', at: [0.86, 0.32], w: 1, sats: ['Aderência técnica', 'Aderência cultural'] },
        { key: 'c2', label: 'Desenvolvimento', tone: 'green', at: [0.80, 0.76], w: 1, sats: ['Plano de desenvolvimento'] },
        { key: 'c3', label: 'Gestão', tone: 'red', at: [0.46, 0.90], w: 1, sats: ['Business Partner'] },
        { key: 'c4', label: 'Performance', tone: 'yellow', at: [0.19, 0.70], w: 1, sats: ['Feedback contínuo'] },
        { key: 'c5', label: 'Inteligência Artificial', tone: 'violet', at: [0.16, 0.28], w: 1, sats: ['AI-Player', 'Capacitação em IA'] }
      ],
      links: [[0, 1, 'bridge'], [1, 2, 'bridge'], [2, 3, 'bridge'], [3, 4, 'bridge'], [4, 5, 'bridge'], [5, 2, 'back']],
      flow: true
    },
    // Professional Services: entender, desenhar, capacitar; cada pilar aparece na fase em que entra
    flow: {
      seed: 17, spread: 0.19, labels: 'hubs',
      groups: [
        { key: 'g0', label: 'Entender a operação', tone: 'blue', at: [0.167, 0.48], w: 1, sats: ['Objetivos', 'Processos', 'Consultoria especializada'] },
        { key: 'g1', label: 'Desenhar e implementar', tone: 'green', at: [0.50, 0.40], w: 1, sats: ['Arquitetura', 'Conexões', 'Adoção de IA'] },
        { key: 'g2', label: 'Capacitar e evoluir', tone: 'red', at: [0.833, 0.52], w: 1, sats: ['Capacitações e workshops', 'Planos de assinatura', 'FinOps SaaS', 'FinOps IA'] }
      ],
      links: [[0, 1, 'bridge'], [1, 2, 'bridge'], [2, 0, 'back']],
      flow: true
    },
    // Home (cena de Talent as a Service): as três formas, contratar, ampliar a equipe e agentes de IA
    people: {
      seed: 29, spread: 0.2, labels: 'hubs',
      groups: [
        { key: 'g-rs', tags: ['taas'], label: 'Recrutamento e Seleção', tone: 'blue', at: [0.28, 0.30], w: 1.3, sats: ['Busca especializada', 'Aderência técnica', 'Aderência cultural'] },
        { key: 'g-ext', tags: ['taas'], label: 'Extensão de Equipe', tone: 'green', at: [0.76, 0.30], w: 1.1, sats: ['Business Partner', 'Plano de desenvolvimento', 'Capacitação em IA'] },
        { key: 'g-aip', tags: ['taas'], label: 'AI-Player', tone: 'yellow', at: [0.56, 0.80], w: 0.9, sats: ['Agentes de IA', 'Trabalho repetitivo'] }
      ],
      links: [[0, 1], [1, 2], [2, 0]]
    },
    // Quem somos (abertura em tela cheia): as pessoas cercam o título
    'people-wide': {
      seed: 31, spread: 0.14, labels: 'hubs',
      groups: [
        { key: 'g-certas', label: 'Pessoas certas', tone: 'blue', at: [0.19, 0.32], w: 1.3, mix: 'violet', sats: ['Recrutamento e Seleção', 'Aderência cultural'] },
        { key: 'g-times', label: 'Times A-Player', tone: 'violet', at: [0.23, 0.78], w: 1, mix: 'blue', sats: ['Business Partner', 'Comunidade'] },
        { key: 'g-contexto', label: 'Contexto claro', tone: 'green', at: [0.81, 0.28], w: 1, sats: ['Objetivos', 'Processos', 'Plataformas'] },
        { key: 'g-evolucao', label: 'Evolução acompanhada', tone: 'red', at: [0.77, 0.78], w: 1, sats: ['Plano de desenvolvimento', 'Capacitação em IA', 'Feedback'] }
      ],
      links: [[0, 1], [0, 2], [2, 3], [3, 1]]
    },
    // Atlassian: as cinco Collections da página em volta do Teamwork Graph, com o Rovo no centro
    teamwork: {
      seed: 41, spread: 0.14, labels: 'hubs',
      groups: [
        { key: 'g-tg', label: 'Teamwork Graph', tone: 'green', at: [0.50, 0.50], w: 1.3, sats: ['Rovo', 'Pessoas', 'Trabalho', 'Conhecimento'] },
        { key: 'g-teamwork', label: 'Teamwork Collection', tone: 'blue', at: [0.20, 0.18], w: 1, sats: ['Jira', 'Confluence', 'Loom'] },
        { key: 'g-service', label: 'Service Collection', tone: 'yellow', at: [0.82, 0.18], w: 0.95, sats: ['Jira Service Management', 'CSM', 'Assets'] },
        { key: 'g-software', label: 'Software Collection', tone: 'green', at: [0.86, 0.64], w: 0.95, sats: ['Bitbucket', 'Pipelines', 'DX', 'Rovo Dev'] },
        { key: 'g-product', label: 'Product Collection', tone: 'violet', at: [0.54, 0.90], w: 0.8, sats: ['Jira Product Discovery', 'Feedback'] },
        { key: 'g-strategy', label: 'Strategy Collection', tone: 'red', at: [0.15, 0.66], w: 0.8, sats: ['Focus', 'Talent'] }
      ],
      links: [[0, 1, 'bridge'], [0, 2, 'bridge'], [0, 3, 'bridge'], [0, 4, 'bridge'], [0, 5, 'bridge'], [1, 2], [1, 5], [3, 4]]
    },
    // monday.com: planejar, executar, aprender, com pessoas e agentes
    operation: {
      seed: 43, spread: 0.2, labels: 'hubs',
      groups: [
        { key: 'g-plan', label: 'Planejar', tone: 'blue', at: [0.18, 0.46], w: 1, sats: ['Prioridades visíveis', 'Portfólios'] },
        { key: 'g-exec', label: 'Executar', tone: 'green', at: [0.52, 0.75], w: 1.2, sats: ['Fluxos em movimento', 'Automações'] },
        { key: 'g-learn', label: 'Aprender', tone: 'yellow', at: [0.84, 0.42], w: 1, sats: ['Dados para decidir', 'Dashboards'] },
        { key: 'g-agents', label: 'Sidekick e Agents', tone: 'red', at: [0.58, 0.22], w: 0.6, sats: ['Vibe'] }
      ],
      links: [[0, 1, 'bridge'], [1, 2, 'bridge'], [2, 0, 'back'], [3, 1], [3, 2]],
      flow: true
    },
    // CISP1: dados, processos, sistemas e objetivos em torno da plataforma; a faixa à esquerda, na altura do título, fica livre
    cisp: {
      seed: 47, spread: 0.13, labels: 'hubs',
      groups: [
        { key: 'g-cisp', label: 'CISP1', tone: 'violet', at: [0.58, 0.50], w: 1.2 },
        { key: 'g-dados', label: 'Dados', tone: 'blue', at: [0.34, 0.15], w: 0.9, sats: ['Fontes', 'Contexto'] },
        { key: 'g-proc', label: 'Processos', tone: 'green', at: [0.86, 0.22], w: 0.9, sats: ['Fluxos', 'Agentes'] },
        { key: 'g-sist', label: 'Sistemas', tone: 'red', at: [0.32, 0.84], w: 0.9, sats: ['ERP', 'CRM', 'APIs'] },
        { key: 'g-obj', label: 'Objetivos', tone: 'yellow', at: [0.86, 0.80], w: 0.9, sats: ['Indicadores', 'Impacto'] }
      ],
      links: [[1, 0, 'bridge'], [2, 0, 'bridge'], [3, 0, 'bridge'], [4, 0, 'bridge']],
      flow: true
    },
    // áreas de leitura e formulários: o grafo descansa na retícula de 56px
    calm: { seed: 53, calm: true, labels: 'none' }
  };

  /* ------------------------------------------------------------ utilidades */
  function rng(seed) {
    var s = (seed * 2654435761) >>> 0 || 1;
    return function () {
      s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
      return (s % 1000003) / 1000003;
    };
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function rgba(c, a) { return 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + (a < 0 ? 0 : a > 1 ? 1 : a).toFixed(3) + ')'; }
  function nums(v, n) {
    if (!v) return null;
    var p = String(v).trim().split(/\s+/).map(parseFloat);
    return p.length === n && p.every(function (x) { return !isNaN(x); }) ? p : null;
  }

  // selo assimétrico da marca: quadrado com cantos grandes no alto à esquerda e embaixo à direita (3px 1px 3px 1px)
  function mark(ctx, x, y, h) {
    var a = h * 0.78, b = h * 0.26;
    ctx.beginPath();
    ctx.moveTo(x - h + a, y - h);
    ctx.lineTo(x + h - b, y - h); ctx.arcTo(x + h, y - h, x + h, y - h + b, b);
    ctx.lineTo(x + h, y + h - a); ctx.arcTo(x + h, y + h, x + h - a, y + h, a);
    ctx.lineTo(x - h + b, y + h); ctx.arcTo(x - h, y + h, x - h, y + h - b, b);
    ctx.lineTo(x - h, y - h + a); ctx.arcTo(x - h, y - h, x - h + a, y - h, a);
    ctx.closePath();
  }

  /* ------------------------------------------------------------ construção */
  function buildCalm(spec, w, h, hole, N) {
    var R = rng(spec.seed + Math.round(w) + Math.round(h));
    var cols = Math.max(2, Math.floor(w / GRID)), rows = Math.max(2, Math.floor(h / GRID));
    var ox = (w - (cols - 1) * GRID) / 2, oy = (h - (rows - 1) * GRID) / 2;
    var cells = [];
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
      var cx = ox + c * GRID, cy = oy + r * GRID;
      if (hole && cx > hole[0] * w && cx < (hole[0] + hole[2]) * w && cy > hole[1] * h && cy < (hole[1] + hole[3]) * h) continue;
      cells.push([c, r]);
    }
    if (!cells.length) cells.push([0, 0]);
    for (var i = cells.length - 1; i > 0; i--) { var j = Math.floor(R() * (i + 1)); var t = cells[i]; cells[i] = cells[j]; cells[j] = t; }
    var tones = ['blue', 'green', 'red', 'yellow', 'violet', 'blueL', 'ice', 'ice'];
    var nodes = [], edges = [], at = {};
    for (var k = 0; k < N; k++) {
      var cell = cells[k % cells.length];
      var extra = k >= cells.length ? (R() - 0.5) * 20 : 0;
      nodes.push({ x: ox + cell[0] * GRID + extra, y: oy + cell[1] * GRID + extra, r: 1.6 + R() * 1.6, kind: 'dust', tone: tones[Math.floor(R() * tones.length)], label: null, group: null });
      at[cell[0] + ',' + cell[1]] = k;
    }
    for (var m = 0; m < N; m++) {
      var cc = cells[m % cells.length];
      var right = at[(cc[0] + 1) + ',' + cc[1]], down = at[cc[0] + ',' + (cc[1] + 1)];
      if (right !== undefined && R() < 0.3) edges.push([m, right, 'tree']);
      if (down !== undefined && R() < 0.22) edges.push([m, down, 'tree']);
    }
    return { nodes: nodes, edges: edges, groups: [], labels: 'none', flow: false, dim: 0.5 };
  }

  function buildGroups(spec, w, h, hole, N) {
    var R = rng(spec.seed || 1);
    var nodes = [], edges = [], groups = [];
    var m = Math.min(w, h * 1.25);
    var labeled = spec.groups.reduce(function (a, g) { return a + 1 + (g.sats ? g.sats.length : 0); }, 0);
    var dustTotal = Math.max(0, N - labeled);
    var wsum = spec.groups.reduce(function (a, g) { return a + (g.w || 1); }, 0);

    spec.groups.forEach(function (g, gi) {
      var G = { key: g.key || 'g' + gi, tags: g.tags || [], tone: g.tone, label: g.label, nodes: [] };
      groups.push(G);
      var cx = g.at[0] * w, cy = g.at[1] * h;
      var sats = g.sats || [];
      var nd = gi === spec.groups.length - 1
        ? Math.max(0, N - nodes.length - 1 - sats.length)
        : Math.round(dustTotal * (g.w || 1) / wsum);
      var rad = m * (spec.spread || 0.16) * Math.sqrt(g.w || 1);
      var hubIdx = nodes.length;
      nodes.push({ x: cx, y: cy, r: 7.5, kind: 'hub', tone: g.tone, label: g.label, group: G });
      G.nodes.push(hubIdx);
      var placed = [hubIdx];
      var rot = R() * Math.PI * 2;
      sats.forEach(function (s, k) {
        var a = rot + (k / sats.length) * Math.PI * 2 + (R() - 0.5) * 0.4;
        var rr = rad * (0.78 + R() * 0.25);
        var idx = nodes.length;
        nodes.push({ x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr * 0.86, r: 4.2, kind: 'sat', tone: g.tone, label: s, group: G });
        edges.push([hubIdx, idx, 'hub']);
        G.nodes.push(idx); placed.push(idx);
      });
      for (var k = 0; k < nd; k++) {
        var a = k * 2.39996323 + R() * 0.6;
        var rr = 12 + rad * Math.sqrt((k + 0.6) / Math.max(nd, 1)) * (0.88 + R() * 0.3);
        var n = { x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr * 0.86, r: 1.7 + R() * 1.9, kind: 'dust',
          tone: g.mix && R() < 0.3 ? g.mix : g.tone, label: null, group: G };
        var d1 = -1, d2 = -1, b1 = 1e12, b2 = 1e12;
        for (var p = 0; p < placed.length; p++) {
          var q = nodes[placed[p]], dx = q.x - n.x, dy = q.y - n.y, dd = dx * dx + dy * dy;
          if (dd < b1) { b2 = b1; d2 = d1; b1 = dd; d1 = placed[p]; } else if (dd < b2) { b2 = dd; d2 = placed[p]; }
        }
        var idn = nodes.length;
        nodes.push(n);
        edges.push([d1, idn, 'tree']);
        if (d2 >= 0 && R() < 0.22) edges.push([d2, idn, 'mesh']);
        G.nodes.push(idn); placed.push(idn);
      }
    });

    (spec.links || []).forEach(function (l) {
      var A = groups[l[0]], B = groups[l[1]];
      if (!A || !B) return;
      edges.push([A.nodes[0], B.nodes[0], l[2] || 'bridge']);
      var best = null, bd = 1e12;
      for (var i = 1; i < A.nodes.length; i++) for (var j = 1; j < B.nodes.length; j++) {
        var a = nodes[A.nodes[i]], b = nodes[B.nodes[j]], dx = a.x - b.x, dy = a.y - b.y, dd = dx * dx + dy * dy;
        if (dd < bd && a.kind === 'dust' && b.kind === 'dust') { bd = dd; best = [A.nodes[i], B.nodes[j]]; }
      }
      if (best && l[2] !== 'back') edges.push([best[0], best[1], 'mesh']);
    });

    relax(nodes, w, h, hole);
    return { nodes: nodes, edges: edges, groups: groups, labels: spec.labels || 'hubs', flow: !!spec.flow, dim: 1 };
  }

  // relaxação force-directed curta: afasta sobreposições, mantém a forma e libera a zona do texto
  function relax(nodes, w, h, hole) {
    var ox = nodes.map(function (n) { return n.x; }), oy = nodes.map(function (n) { return n.y; });
    function clear(n) { return n.kind === 'hub' ? 26 : n.kind === 'sat' ? 16 : 6.5; }
    var H = hole ? { x0: hole[0] * w, y0: hole[1] * h, x1: (hole[0] + hole[2]) * w, y1: (hole[1] + hole[3]) * h } : null;
    for (var it = 0; it < 80; it++) {
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j], dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy, md = clear(a) + clear(b);
          if (d2 < md * md) {
            var d = Math.sqrt(d2) || 0.01, push = (md - d) / 2 / d;
            var fa = a.kind === 'hub' ? 0.25 : 1, fb = b.kind === 'hub' ? 0.25 : 1;
            a.x -= dx * push * fa; a.y -= dy * push * fa; b.x += dx * push * fb; b.y += dy * push * fb;
          }
        }
      }
      for (var k = 0; k < nodes.length; k++) {
        var n = nodes[k], pull = n.kind === 'hub' ? 0.2 : 0.035;
        n.x += (ox[k] - n.x) * pull; n.y += (oy[k] - n.y) * pull;
        if (H) {
          var m = n.kind === 'hub' ? 34 : 14;
          if (n.x > H.x0 - m && n.x < H.x1 + m && n.y > H.y0 - m && n.y < H.y1 + m) {
            var dl = n.x - (H.x0 - m), dr = (H.x1 + m) - n.x, dt = n.y - (H.y0 - m), db = (H.y1 + m) - n.y;
            var mn = Math.min(dl, dr, dt, db);
            if (mn === dl) n.x = H.x0 - m; else if (mn === dr) n.x = H.x1 + m; else if (mn === dt) n.y = H.y0 - m; else n.y = H.y1 + m;
          }
        }
      }
    }
    var pad = 16;
    nodes.forEach(function (n) { n.x = clamp(n.x, pad, w - pad); n.y = clamp(n.y, pad, h - pad); });
  }

  function build(spec, w, h, hole, N) {
    var F = spec.calm ? buildCalm(spec, w, h, hole, N) : buildGroups(spec, w, h, hole, N);
    F.hole = hole ? { x: hole[0] * w, y: hole[1] * h, w: hole[2] * w, h: hole[3] * h } : null;
    // profundidade: polos no plano, satélites perto, poeira espalhada
    var R = rng((spec.seed || 1) * 7 + 3);
    F.nodes.forEach(function (n) { n.z = n.kind === 'hub' ? 0 : n.kind === 'sat' ? (R() - 0.5) * 90 : (R() - 0.5) * 340; });
    return F;
  }

  /* ------------------------------------------------------------ cursor compartilhado */
  var all = [];
  var mouse = { x: -9999, y: -9999, on: false, touch: false };
  function feed() { for (var i = 0; i < all.length; i++) all[i]._pointer(); }
  function listen() {
    if (listen.done) return; listen.done = true;
    root.addEventListener('pointermove', function (e) {
      mouse.touch = e.pointerType === 'touch';
      mouse.x = e.clientX; mouse.y = e.clientY; mouse.on = true; feed();
    }, { passive: true });
    root.addEventListener('pointerdown', function (e) {
      mouse.touch = e.pointerType === 'touch';
      mouse.x = e.clientX; mouse.y = e.clientY; mouse.on = true; feed();
    }, { passive: true });
    root.addEventListener('pointerup', function (e) { if (e.pointerType === 'touch') { mouse.on = false; feed(); } }, { passive: true });
    root.addEventListener('pointercancel', function () { mouse.on = false; feed(); }, { passive: true });
    document.addEventListener('pointerleave', function () { mouse.on = false; feed(); });
    root.addEventListener('blur', function () { mouse.on = false; feed(); });
    root.addEventListener('scroll', feed, { passive: true });
  }

  /* ------------------------------------------------------------ instância */
  function mount(el, o) {
    if (!el) return null;
    if (el.apVivo) return el.apVivo;
    o = o || {};
    listen();

    var canvas = el.querySelector(':scope > canvas.ap-vivo__canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'ap-vivo__canvas';
      canvas.setAttribute('aria-hidden', 'true');
      el.insertBefore(canvas, el.firstChild);
    }
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;

    var mqReduce = root.matchMedia('(prefers-reduced-motion: reduce)');
    var forcedCalm = /[?&]movimento=reduzido/.test(location.search) || document.documentElement.classList.contains('reduce-motion');
    var reduced = mqReduce.matches || forcedCalm;
    var LITE = root.matchMedia('(max-width: 760px), (pointer: coarse)').matches;
    // página inteira: a mesma densidade do rodapé do site (cerca de 96 nós em 250 casas da retícula)
    var isPage = o.page != null ? !!o.page : el.classList.contains('ap-vivo--page');
    var cells = Math.floor((el.clientWidth || root.innerWidth) / GRID) * Math.floor((el.clientHeight || root.innerHeight) / GRID);
    var N = Math.max(8, Math.min(160, o.nodes || (isPage ? Math.max(LITE ? 40 : 60, Math.min(LITE ? 60 : 150, Math.round(cells * 0.38))) : (LITE ? 60 : 96))));
    var glow = !LITE, dprCap = LITE ? 1.25 : 1.75;
    var perf = { n: 0, sum: 0, last: 0 };

    var L = {};
    LAYERS.forEach(function (k) { L[k] = !o.layers; });
    if (o.layers) o.layers.forEach(function (k) { L[k] = true; });
    if (o.off) o.off.forEach(function (k) { L[k] = false; });

    var area = o.area || [0, 0, 1, 1];
    var holeOpt = o.hole || null;
    var labelOpt = o.labels || null;
    var dimOpt = o.dim == null ? 1 : +o.dim;
    // página inteira: o canvas fica fixo atrás de tudo e o brilho acende os pontos da retícula do body
    var page = isPage;
    if (page && !(o.layers && o.layers.indexOf('grid') !== -1)) L.grid = false;
    var themeOpt = o.theme || 'night', T = THEMES.night;
    function themeNow() {
      if (themeOpt !== 'auto') return THEMES[themeOpt] || THEMES.night;
      var a = document.documentElement.getAttribute('data-theme');
      if (a === 'dark') return THEMES.night;
      if (a === 'light') return THEMES.day;
      return root.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.night : THEMES.day;
    }
    T = themeNow();
    var gridO = { x: 0, y: 0 };
    function readGrid() {
      // centro do ponto = posição do fundo do body + 1px (radial-gradient em 1px 1px)
      var bp = (getComputedStyle(document.body).backgroundPosition || '0px 0px').split(',')[0].trim().split(/\s+/);
      gridO.x = (parseFloat(bp[0]) || 0) + 1; gridO.y = (parseFloat(bp[1]) || 0) + 1;
    }

    var W = 0, H = 0, DPR = 1, opaque = false;
    var P = { x: -9999, y: -9999, on: false };
    var live = [], edgeMap = {}, pulses = [];
    var current = null, spec = null, specKey = null, rect = null;
    var hl = null, hoverG = null, running = false, visible = false, dead = false;
    var lastPulse = 0, fade = 1, fadeT = 1;
    var cam = { yaw: 0, pitch: 0 };

    for (var i = 0; i < N; i++) {
      live.push({
        x: 0, y: 0, z: 0, vx: 0, vy: 0, tx: 0, ty: 0, tz: 0, r: 2, tr: 2, c: T.pal.ice.slice(), tc: T.pal.ice, tk: 'ice',
        kind: 'dust', label: null, group: null, ph: Math.random() * 6.283, amp: 3 + Math.random() * 7, sp: 0.6 + Math.random() * 0.8,
        pend: null, lab: 0, px: 0, py: 0, ps: 1, pd: 1, seeded: false
      });
    }

    function resolve(f) {
      if (f && typeof f === 'object') { specKey = 'custom'; return f; }
      specKey = FORMATIONS[f] ? f : 'constellation';
      return FORMATIONS[specKey];
    }
    spec = resolve(o.formation);

    function size() {
      var w = el.clientWidth, h = el.clientHeight;
      if (w < 2 || h < 2) return false;
      DPR = Math.min(root.devicePixelRatio || 1, dprCap);
      if (w !== W || h !== H || canvas.width !== Math.round(w * DPR)) {
        W = w; H = h;
        canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
        canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      }
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      rect = { left: area[0] * W, top: area[1] * H, width: area[2] * W, height: area[3] * H };
      return true;
    }

    function apply(instant) {
      if (!rect) return;
      var narrow = rect.width < 700;
      var F = build(spec, rect.width, rect.height, narrow ? null : holeOpt, N);
      current = F;
      var now = performance.now();
      for (var i = 0; i < N; i++) {
        var s = F.nodes[i], n = live[i];
        if (!n.seeded) { n.seeded = true; n.x = Math.random() * W; n.y = Math.random() * H; }
        var delay = reduced || instant ? 0 : (i % 16) * 16 + Math.random() * 160;
        n.pend = { tx: s.x, ty: s.y, tz: s.z, tr: s.r, tc: T.pal[s.tone] || T.pal.ice, tk: T.pal[s.tone] ? s.tone : 'ice', kind: s.kind, label: s.label, group: s.group, at: now + delay };
        if (reduced || instant) commit(n);
      }
      for (var k in edgeMap) edgeMap[k].ta = 0;
      F.edges.forEach(function (e) {
        var key = e[0] < e[1] ? e[0] + '-' + e[1] : e[1] + '-' + e[0];
        var ex = edgeMap[key];
        if (!ex) ex = edgeMap[key] = { i: e[0], j: e[1], a: 0, ta: 1, kind: e[2], bend: (Math.random() - 0.5) * 0.3 };
        ex.i = e[0]; ex.j = e[1]; ex.kind = e[2]; ex.ta = 1;
        if (reduced || instant) ex.a = 1;
      });
      if (reduced || instant) {
        for (var j = 0; j < N; j++) { var q = live[j]; q.x = rect.left + q.tx; q.y = rect.top + q.ty; q.z = q.tz; q.r = q.tr; q.c = q.tc.slice(); }
        for (var kk in edgeMap) if (edgeMap[kk].ta === 0) delete edgeMap[kk];
      }
    }

    function commit(n) {
      var p = n.pend; if (!p) return;
      n.tx = p.tx; n.ty = p.ty; n.tz = L.depth ? p.tz : 0; n.tr = p.tr; n.tc = p.tc; n.tk = p.tk; n.kind = p.kind; n.label = p.label; n.group = p.group;
      n.pend = null;
    }

    function isHl(n) {
      if (!hl || !n.group) return false;
      return n.group.key === hl || n.group.tags.indexOf(hl) !== -1;
    }

    /* ---------------------------------------------------------- simulação */
    function step(t) {
      var r = rect;
      var nx = P.on ? clamp(P.x / W - 0.5, -0.5, 0.5) * 2 : 0, ny = P.on ? clamp(P.y / H - 0.5, -0.5, 0.5) * 2 : 0;
      var yawT = reduced || !L.camera ? 0 : Math.sin(t * 0.00011) * 0.2 + nx * 0.16;
      var pitchT = reduced || !L.camera ? 0 : Math.sin(t * 0.00009 + 1) * 0.07 - ny * 0.1;
      cam.yaw += (yawT - cam.yaw) * 0.04; cam.pitch += (pitchT - cam.pitch) * 0.04;

      var K = 0.014, D = 0.84;
      for (var k = 0; k < N; k++) {
        var n = live[k];
        if (n.pend && t >= n.pend.at) commit(n);
        var br = L.breathe ? 1 : 0;
        var sx = r.left + n.tx + Math.sin(t * 0.00052 * n.sp + n.ph) * n.amp * br;
        var sy = r.top + n.ty + Math.cos(t * 0.00041 * n.sp + n.ph) * n.amp * br;
        n.vx += (sx - n.x) * K; n.vy += (sy - n.y) * K;
        if (P.on && L.attract && n.kind !== 'hub') {
          var px = P.x - n.px, py = P.y - n.py, pd = Math.sqrt(px * px + py * py);
          if (pd < 170 && pd > 1) { var f = (1 - pd / 170) * 0.22; n.vx += px / pd * f; n.vy += py / pd * f; }
        }
        n.vx *= D; n.vy *= D;
        n.x += n.vx; n.y += n.vy;
        n.z += ((L.depth ? n.tz : 0) - n.z) * 0.05;
        n.r += (n.tr * (isHl(n) ? 1.35 : 1) - n.r) * 0.12;
        n.c[0] += (n.tc[0] - n.c[0]) * 0.07; n.c[1] += (n.tc[1] - n.c[1]) * 0.07; n.c[2] += (n.tc[2] - n.c[2]) * 0.07;
      }
      for (var a = 0; a < N; a++) {
        var A = live[a];
        for (var b = a + 1; b < N; b++) {
          var B = live[b], ddx = B.x - A.x, ddy = B.y - A.y, d2 = ddx * ddx + ddy * ddy;
          if (d2 < 64 && d2 > 0.01) { var d = Math.sqrt(d2), push = (8 - d) * 0.04 / d; A.vx -= ddx * push; A.vy -= ddy * push; B.vx += ddx * push; B.vy += ddy * push; }
        }
      }
      fade += (fadeT - fade) * 0.05;
      for (var key in edgeMap) {
        var e = edgeMap[key];
        e.a += (e.ta - e.a) * 0.07;
        if (e.ta === 0 && e.a < 0.01) delete edgeMap[key];
      }
      if (L.pulses && current && t - lastPulse > (current.flow ? 140 : 300) && pulses.length < (current.flow ? 20 : 12)) {
        lastPulse = t;
        var keys = Object.keys(edgeMap);
        for (var tries = 0; tries < 6 && keys.length; tries++) {
          var ek = edgeMap[keys[Math.floor(Math.random() * keys.length)]];
          if (ek.ta === 1 && ek.a > 0.6 && (ek.kind !== 'tree' || Math.random() < 0.3)) {
            pulses.push({ e: ek, t: 0, v: 0.006 + Math.random() * 0.008 });
            break;
          }
        }
      }
      for (var p = pulses.length - 1; p >= 0; p--) {
        pulses[p].t += pulses[p].v;
        if (pulses[p].t >= 1 || pulses[p].e.ta === 0 || !L.pulses) pulses.splice(p, 1);
      }
      project();
      hoverG = groupNear();
      for (var q = 0; q < N; q++) { var ln = live[q]; ln.lab += ((labelWanted(ln) ? 1 : 0) - ln.lab) * 0.12; }
    }

    // projeção em perspectiva em torno do centro da área
    function project() {
      var cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
      var cyw = Math.cos(cam.yaw), syw = Math.sin(cam.yaw), cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
      for (var i = 0; i < N; i++) {
        var n = live[i], dx = n.x - cx, dy = n.y - cy, dz = n.z;
        var x1 = dx * cyw + dz * syw, z1 = -dx * syw + dz * cyw;
        var y1 = dy * cp - z1 * sp, z2 = dy * sp + z1 * cp;
        var s = FOCAL / (FOCAL + z2);
        n.px = cx + x1 * s; n.py = cy + y1 * s; n.ps = s;
        n.pd = clamp(1 - (z2 + 60) / 420, 0.42, 1);
      }
    }

    function labelMode() { return labelOpt || null; }
    // o grupo mais perto do cursor: polo a até 150px, satélite a até 90px ou poeira a até 50px
    function groupNear() {
      if (!P.on || reduced || rect.width < 560) return null;
      var best = null, bd = 1e12;
      for (var i = 0; i < N; i++) {
        var n = live[i]; if (!n.group) continue;
        var lim = n.kind === 'hub' ? 150 : n.kind === 'sat' ? 90 : 50;
        var dx = P.x - n.px, dy = P.y - n.py, d2 = dx * dx + dy * dy;
        if (d2 < lim * lim && d2 / (lim * lim) < bd) { bd = d2 / (lim * lim); best = n.group; }
      }
      return best;
    }
    function labelWanted(n) { return wantLabel(n) && !n.blk; }
    function wantLabel(n) {
      if (!L.labels || !n.label || !current) return false;
      var compact = rect.width < 560, mode = labelMode();
      if (mode === 'none') return false;
      if (mode === 'sats') return n.kind === 'sat' && (!compact || isHl(n));
      if (n.kind === 'hub') return current.labels !== 'none';
      if (isHl(n)) return true;
      if (compact) return false;
      if (mode === 'all' || current.labels === 'all') return true;
      if (hoverG && n.group === hoverG) return true;
      if (P.on) { var dx = P.x - n.px, dy = P.y - n.py; if (dx * dx + dy * dy < 120 * 120) return true; }
      return false;
    }

    /* ---------------------------------------------------------- desenho */
    function bez(A, B, bend) {
      var mx = (A.px + B.px) / 2, my = (A.py + B.py) / 2, dx = B.px - A.px, dy = B.py - A.py;
      return { cx: mx - dy * bend, cy: my + dx * bend };
    }
    function inHole(x, y) {
      var h = current && current.hole; if (!h) return false;
      var lx = x - rect.left, ly = y - rect.top;
      return lx > h.x && lx < h.x + h.w && ly > h.y && ly < h.y + h.h;
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      var dim = (current ? current.dim : 1) * dimOpt;
      var offX = (W % GRID) / 2, offY = (H % GRID) / 2;
      if (page) {
        var sx0 = root.scrollX || 0, sy0 = root.scrollY || 0;
        offX = ((gridO.x - sx0) % GRID + GRID) % GRID; offY = ((gridO.y - sy0) % GRID + GRID) % GRID;
      }

      if (opaque) { ctx.fillStyle = rgba(T.bg, 1); ctx.fillRect(0, 0, W, H); }
      // retícula de 56px: pontos de 2px a 9%; no site ela vive no fundo do body (CSS)
      if (L.grid) {
        ctx.fillStyle = T.dot;
        ctx.beginPath();
        for (var gy = offY; gy < H; gy += GRID) for (var gx = offX; gx < W; gx += GRID) { ctx.moveTo(gx + 1, gy); ctx.arc(gx, gy, 1, 0, 6.283); }
        ctx.fill();
      }
      // brilho da retícula perto do cursor
      if (L.glow && P.on && !reduced) {
        for (var hy = offY; hy < H; hy += GRID) {
          if (Math.abs(hy - P.y) > 220) continue;
          for (var hx = offX; hx < W; hx += GRID) {
            var dd = Math.hypot(hx - P.x, hy - P.y);
            if (dd < 220) { ctx.fillStyle = rgba(T.glow, T.glowA * (1 - dd / 220)); ctx.fillRect(hx - 1.5, hy - 1.5, 3, 3); }
          }
        }
      }

      ctx.globalAlpha = reduced ? 1 : fade;

      // ligações: agrupadas por cor, opacidade, espessura e traço
      ctx.lineCap = 'round';
      if (L.edges) {
        var groupsE = {};
        for (var key in edgeMap) {
          var e = edgeMap[key], A = live[e.i], B = live[e.j];
          if (!A || !B) continue;
          var base = e.kind === 'bridge' ? 0.55 : e.kind === 'back' ? 0.55 : e.kind === 'hub' ? 0.42 : e.kind === 'mesh' ? 0.13 : 0.22;
          var emph = hl ? (isHl(A) || isHl(B) ? 1.9 : 0.3) : 1;
          var alpha = e.a * base * emph * dim * Math.min(A.pd, B.pd);
          if (hoverG && A.group === hoverG && B.group === hoverG) alpha = Math.min(alpha * 1.6, 0.9);
          if (inHole((A.px + B.px) / 2, (A.py + B.py) / 2)) alpha *= 0.25;
          if (alpha < 0.01) continue;
          var bend = e.kind === 'bridge' || e.kind === 'back' ? e.bend + (e.kind === 'back' ? 0.28 : 0.12) : e.bend * 0.5;
          var c = bez(A, B, bend);
          var lw = Math.round((e.kind === 'bridge' || e.kind === 'back' ? 1.7 : e.kind === 'hub' ? 1.2 : 1) * Math.min(A.ps, B.ps) * 5) / 5;
          var aq = Math.round(Math.min(alpha, 0.9) * 40) / 40;
          var gk = (A.c[0] | 0) + ',' + (A.c[1] | 0) + ',' + (A.c[2] | 0) + '|' + aq + '|' + lw + '|' + (e.kind === 'back' ? 1 : 0);
          var grp = groupsE[gk] || (groupsE[gk] = { c: A.c, a: aq, lw: lw, dash: e.kind === 'back', seg: [] });
          grp.seg.push(A.px, A.py, c.cx, c.cy, B.px, B.py);
        }
        for (var gkey in groupsE) {
          var G = groupsE[gkey], sg = G.seg;
          ctx.strokeStyle = rgba(G.c, G.a); ctx.lineWidth = G.lw; ctx.setLineDash(G.dash ? [4, 6] : []);
          ctx.beginPath();
          for (var si = 0; si < sg.length; si += 6) { ctx.moveTo(sg[si], sg[si + 1]); ctx.quadraticCurveTo(sg[si + 2], sg[si + 3], sg[si + 4], sg[si + 5]); }
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }

      // brilho: halos dos polos e pulsos em mistura aditiva
      ctx.globalCompositeOperation = T.blend;
      for (var h = 0; L.halos && L.nodes && glow && h < N; h++) {
        var hn = live[h];
        if (hn.kind !== 'hub') continue;
        var ha = (hl ? (isHl(hn) ? 1 : 0.25) : 0.8) * dim * hn.pd * (hoverG && hn.group === hoverG ? 1.3 : 1);
        var pulse = reduced ? 0 : Math.sin(t * 0.002 + hn.ph) * 3;
        var gr = (hn.r + 26 + pulse) * hn.ps;
        var g = ctx.createRadialGradient(hn.px, hn.py, 0, hn.px, hn.py, gr);
        g.addColorStop(0, rgba(hn.c, T.haloA * ha)); g.addColorStop(1, rgba(hn.c, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hn.px, hn.py, gr, 0, 6.283); ctx.fill();
      }
      for (var p = 0; p < pulses.length; p++) {
        var pu = pulses[p], PA = live[pu.e.i], PB = live[pu.e.j];
        var bb = pu.e.kind === 'bridge' || pu.e.kind === 'back' ? pu.e.bend + (pu.e.kind === 'back' ? 0.28 : 0.12) : pu.e.bend * 0.5;
        var cc = bez(PA, PB, bb), u = pu.t, iu = 1 - u;
        var x = iu * iu * PA.px + 2 * iu * u * cc.cx + u * u * PB.px, y = iu * iu * PA.py + 2 * iu * u * cc.cy + u * u * PB.py;
        var pa = Math.sin(Math.PI * u) * dim;
        ctx.fillStyle = rgba(PA.c, 0.35 * pa); ctx.beginPath(); ctx.arc(x, y, 6, 0, 6.283); ctx.fill();
        ctx.fillStyle = T.core ? rgba(PA.c, 0.9 * pa) : 'rgba(255,255,255,' + (0.85 * pa).toFixed(3) + ')'; ctx.beginPath(); ctx.arc(x, y, 1.8, 0, 6.283); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';

      // nós: poeira agrupada por cor e opacidade; polos e satélites um a um
      if (L.nodes) {
        var groupsN = {}, special = [];
        for (var k = 0; k < N; k++) {
          var n = live[k];
          if (n.px < -40 || n.px > W + 40 || n.py < -40 || n.py > H + 40) continue;
          var on = isHl(n), na = (hl ? (on ? 1 : 0.26) : 0.94) * dim * n.pd;
          var rr = n.r * n.ps;
          if (n.kind === 'dust') {
            var nq = Math.round(na * 20) / 20, nk = (n.c[0] | 0) + ',' + (n.c[1] | 0) + ',' + (n.c[2] | 0) + '|' + nq;
            var ng = groupsN[nk] || (groupsN[nk] = { c: n.c, a: nq, pts: [] });
            ng.pts.push(n.px, n.py, rr);
            continue;
          }
          special.push(n, na, rr);
        }
        for (var nkey in groupsN) {
          var NG = groupsN[nkey], pt = NG.pts;
          ctx.fillStyle = rgba(NG.c, NG.a);
          ctx.beginPath();
          for (var pi = 0; pi < pt.length; pi += 3) { ctx.moveTo(pt[pi] + pt[pi + 2], pt[pi + 1]); ctx.arc(pt[pi], pt[pi + 1], pt[pi + 2], 0, 6.283); }
          ctx.fill();
        }
        for (var sp = 0; sp < special.length; sp += 3) {
          var sn = special[sp], sa = special[sp + 1], sr = special[sp + 2];
          if (sn.kind === 'hub') {
            ctx.strokeStyle = rgba(sn.c, 0.5 * sa); ctx.lineWidth = 1.2; mark(ctx, sn.px, sn.py, sr * 0.92 + 6); ctx.stroke();
            ctx.fillStyle = rgba(sn.c, sa); mark(ctx, sn.px, sn.py, sr * 0.92); ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,' + (0.5 * sa).toFixed(3) + ')'; mark(ctx, sn.px - sr * 0.22, sn.py - sr * 0.22, sr * 0.3); ctx.fill();
            continue;
          }
          ctx.strokeStyle = rgba(sn.c, 0.42 * sa); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(sn.px, sn.py, sr + 3.5, 0, 6.283); ctx.stroke();
          ctx.fillStyle = rgba(sn.c, sa); ctx.beginPath(); ctx.arc(sn.px, sn.py, sr, 0, 6.283); ctx.fill();
        }
      }

      // o cursor como agente: liga os nós próximos
      if (L.cursor && P.on && !reduced) {
        var near = [];
        for (var q = 0; q < N; q++) { var m = live[q], dx = m.px - P.x, dy = m.py - P.y, d2 = dx * dx + dy * dy; if (d2 < 150 * 150) near.push([d2, m]); }
        near.sort(function (a, b) { return a[0] - b[0]; });
        for (var z = 0; z < Math.min(7, near.length); z++) {
          var nd = Math.sqrt(near[z][0]), nm = near[z][1];
          ctx.strokeStyle = rgba(nm.c, 0.55 * (1 - nd / 150)); ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(P.x, P.y); ctx.lineTo(nm.px, nm.py); ctx.stroke();
        }
        if (near.length) {
          ctx.strokeStyle = T.ring; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.arc(P.x, P.y, 5, 0, 6.283); ctx.stroke();
        }
      }

      // rótulos: os polos primeiro, depois o grupo sob o cursor; um satélite que bateria em outro rótulo
      // troca de lado, tenta acima e abaixo e, se ainda bater, espera a vez (esmaece em vez de sobrepor)
      var compact = rect.width < 560;
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';
      var edgePad = 8, boxes = [], order = [];
      for (var Li = 0; Li < N; Li++) { var c0 = live[Li]; if (c0.label && (c0.lab > 0.03 || wantLabel(c0))) order.push(c0); }
      order.sort(function (a, b) { return rank(a) - rank(b); });
      function rank(n) { return n.kind === 'hub' ? 0 : hoverG && n.group === hoverG ? 1 : 2; }
      function fontOf(hub) { return (hub ? '700 ' : '500 ') + (compact ? (hub ? 11.5 : 10.5) : (hub ? 13.5 : 11.5)) + 'px "DM Sans", system-ui, sans-serif'; }
      function hits(x0, y0, x1, y1) {
        for (var q2 = 0; q2 < boxes.length; q2++) { var bx = boxes[q2]; if (x0 < bx[2] && x1 > bx[0] && y0 < bx[3] && y1 > bx[1]) return true; }
        return false;
      }
      for (var o2 = 0; o2 < order.length; o2++) {
        var ln = order[o2], hub = ln.kind === 'hub';
        ctx.font = fontOf(hub);
        var tw = ctx.measureText(ln.label).width, th = hub ? 17 : 14;
        if (hub) {
          ln.lx = clamp(ln.px, tw / 2 + edgePad, W - tw / 2 - edgePad); ln.ly = ln.py + ln.r * ln.ps + 20; ln.la = 'center';
          boxes.push([ln.lx - tw / 2 - 3, ln.ly - th / 2, ln.lx + tw / 2 + 3, ln.ly + th / 2]);
          ln.blk = false;
          continue;
        }
        var off = ln.r * ln.ps + 8, first = (ln.px - rect.left) < rect.width * 0.62;
        var placedL = false, vy = ln.r * ln.ps + 13;
        var spots = [first ? 'r' : 'l', first ? 'l' : 'r', 'u', 'd'];
        for (var si2 = 0; si2 < spots.length && !placedL; si2++) {
          var sp2 = spots[si2], x0, cy0 = ln.py;
          if (sp2 === 'r') x0 = ln.px + off; else if (sp2 === 'l') x0 = ln.px - off - tw;
          else { x0 = clamp(ln.px - tw / 2, edgePad, W - edgePad - tw); cy0 = sp2 === 'u' ? ln.py - vy : ln.py + vy; }
          if (x0 < edgePad || x0 + tw > W - edgePad) continue;
          if (!hits(x0 - 3, cy0 - th / 2, x0 + tw + 3, cy0 + th / 2)) {
            boxes.push([x0 - 3, cy0 - th / 2, x0 + tw + 3, cy0 + th / 2]);
            ln.lx = sp2 === 'r' ? ln.px + off : sp2 === 'l' ? ln.px - off : x0 + tw / 2; ln.ly = cy0;
            ln.la = sp2 === 'r' ? 'left' : sp2 === 'l' ? 'right' : 'center';
            placedL = true;
          }
        }
        ln.blk = !placedL;
      }
      for (var D = 0; D < order.length; D++) {
        var dn = order[D];
        if (dn.lab < 0.03 || dn.lx === undefined) continue;
        var dh = dn.kind === 'hub';
        ctx.font = fontOf(dh); ctx.textAlign = dn.la;
        // texto não esmaece com a profundidade: rótulo é leitura, não cenário
        var la = dn.lab * (hl ? (isHl(dn) ? 1 : 0.35) : 1) * Math.max(dim, 0.85) * (dh ? 1 : Math.max(dn.pd, 0.9));
        ctx.lineWidth = dh ? 4 : 3.5; ctx.strokeStyle = rgba(T.bg, (dh ? 0.88 : 0.8) * la);
        ctx.strokeText(dn.label, dn.lx, dn.ly);
        ctx.fillStyle = dh ? rgba(T.hubLabel, 0.96 * la) : rgba(T.satLabel, 0.74 * la);
        ctx.fillText(dn.label, dn.lx, dn.ly);
      }
      ctx.globalAlpha = 1;
    }

    /* ---------------------------------------------------------- ciclo */
    function loop(t) {
      if (!running || dead) return;
      step(t); draw(t);
      adapt(t);
      if (visible && !document.hidden) requestAnimationFrame(loop);
      else running = false;
    }
    // qualidade adaptável: média acima de 24 ms em 60 quadros tira o brilho; se continuar lenta, reduz a resolução
    function adapt(t) {
      var dt = perf.last ? t - perf.last : 16; perf.last = t;
      if (dt > 100) return;
      perf.sum += dt; perf.n++;
      if (perf.n < 60) return;
      var avg = perf.sum / perf.n; perf.sum = 0; perf.n = 0;
      if (avg <= 24) return;
      if (glow) glow = false;
      else if (dprCap > 1) { dprCap = 1; size(); }
    }
    function kick() {
      if (dead || !current) return;
      if (reduced) { still(); return; }
      if (!running && visible && !document.hidden) { running = true; perf.last = 0; requestAnimationFrame(loop); }
    }
    function still() {
      if (!current) return;
      for (var i = 0; i < N; i++) { var n = live[i]; commit(n); n.x = rect.left + n.tx; n.y = rect.top + n.ty; n.z = n.tz; n.r = n.tr; n.c = n.tc.slice(); }
      project();
      for (var j = 0; j < N; j++) live[j].lab = labelWanted(live[j]) ? 1 : 0;
      for (var k in edgeMap) { if (edgeMap[k].ta === 0) delete edgeMap[k]; else edgeMap[k].a = 1; }
      pulses.length = 0;
      draw(0);
    }

    function ready(instant) {
      if (!size()) return false;
      apply(instant);
      if (reduced) still(); else kick();
      return true;
    }

    var api = {
      el: el,
      _pointer: function () {
        if (dead) return;
        var r = el.getBoundingClientRect();
        var inside = mouse.on && (!mouse.touch || o.touch) && mouse.x >= r.left && mouse.x <= r.right && mouse.y >= r.top && mouse.y <= r.bottom;
        P.on = !!inside; P.x = mouse.x - r.left; P.y = mouse.y - r.top;
        if (inside) kick();
      },
      set: function (f, instant) { spec = resolve(f); if (rect) { apply(!!instant); if (reduced) still(); else kick(); } return api; },
      burst: function (x, y) {
        fadeT = 1;
        if (reduced || !rect) return api;
        x = x == null ? W / 2 : x; y = y == null ? H / 2 : y;
        for (var i = 0; i < N; i++) {
          var n = live[i], a = Math.random() * 6.283, s = 2 + Math.random() * 7;
          n.x = x + Math.cos(a) * 4; n.y = y + Math.sin(a) * 4; n.vx = Math.cos(a) * s; n.vy = Math.sin(a) * s;
        }
        for (var k in edgeMap) edgeMap[k].a = 0;
        apply(false);
        kick();
        return api;
      },
      highlight: function (key) { hl = key || null; if (reduced) still(); else kick(); return api; },
      layer: function (name, on) {
        if (!(name in L)) return api;
        L[name] = on == null ? !L[name] : !!on;
        if (name === 'depth') for (var i = 0; i < N; i++) { var n = live[i]; n.tz = 0; }
        if (name === 'depth' && L.depth && current) for (var j = 0; j < N; j++) live[j].tz = current.nodes[j].z;
        if (reduced) still(); else kick();
        return api;
      },
      layers: function () { var c = {}; for (var k in L) c[k] = L[k]; return c; },
      // PNG com fundo da noite e retícula, para peças paradas (post, slide, impressão)
      png: function (scale) {
        if (!rect) return null;
        var keep = dprCap;
        dprCap = scale || 2; DPR = dprCap;
        canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        opaque = true; draw(performance.now()); opaque = false;
        var url = canvas.toDataURL('image/png');
        dprCap = keep; size(); draw(performance.now());
        return url;
      },
      step: function (frames) {
        if (!current) return api;
        var t = performance.now();
        for (var i = 0; i < (frames || 1); i++) { t += 16.7; step(t); }
        draw(t);
        return api;
      },
      state: function () {
        return { formation: specKey, nodes: N, edges: Object.keys(edgeMap).length, pulses: pulses.length, visible: visible, running: running, reduced: reduced, highlight: hl, layers: api.layers(), size: [W, H] };
      },
      destroy: function () {
        dead = true; running = false;
        if (io) io.disconnect();
        if (mo) mo.disconnect();
        if (ro) ro.disconnect();
        all.splice(all.indexOf(api), 1);
        if (canvas.parentNode === el) el.removeChild(canvas);
        delete el.apVivo;
      }
    };

    var io = null, ro = null;
    if ('IntersectionObserver' in root) {
      io = new IntersectionObserver(function (en) {
        en.forEach(function (x) {
          visible = x.isIntersecting;
          if (visible) { if (!current) ready(!!o.instant); else kick(); }
        });
      }, { rootMargin: '120px' });
      io.observe(el);
    } else { visible = true; ready(!!o.instant); }
    if ('ResizeObserver' in root) {
      // nova medida: a formação se refaz no lugar, sem voo (como no site)
      var rt = null;
      ro = new ResizeObserver(function () {
        clearTimeout(rt);
        rt = setTimeout(function () {
          if (dead) return;
          var w = el.clientWidth, h = el.clientHeight;
          if (w < 2 || h < 2 || (w === W && h === H && current)) return;
          var first = !current;
          if (size()) { apply(first ? !!o.instant : true); if (reduced) still(); else kick(); }
        }, current ? 120 : 0);
      });
      ro.observe(el);
    }
    document.addEventListener('visibilitychange', function () { if (!document.hidden) kick(); });
    function retheme() {
      var nt = themeNow(); if (nt === T) return;
      T = nt;
      for (var i = 0; i < N; i++) { var n = live[i]; n.tc = T.pal[n.tk] || T.pal.ice; if (n.pend) n.pend.tc = T.pal[n.pend.tk] || T.pal.ice; }
      if (reduced) still(); else kick();
    }
    var mo = null;
    if (themeOpt === 'auto') {
      if ('MutationObserver' in root) { mo = new MutationObserver(retheme); mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] }); }
      var mqDark = root.matchMedia('(prefers-color-scheme: dark)');
      if (mqDark.addEventListener) mqDark.addEventListener('change', retheme);
    }
    if (page) {
      readGrid();
      root.addEventListener('resize', readGrid);
      root.addEventListener('scroll', function () { if (reduced) still(); else kick(); }, { passive: true });
    }
    if (mqReduce.addEventListener) mqReduce.addEventListener('change', function (e) { reduced = e.matches || forcedCalm; if (rect) { apply(true); if (reduced) still(); else kick(); } });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (reduced && current) still(); });

    all.push(api);
    el.apVivo = api;
    return api;
  }

  /* ------------------------------------------------------------ montagem pelos atributos */
  function fromAttrs(el) {
    var d = el.dataset, list = function (v) { return v ? v.trim().split(/\s+/) : null; };
    return {
      formation: d.vivo || 'constellation',
      layers: list(d.vivoLayers), off: list(d.vivoOff),
      labels: d.vivoLabels || null,
      nodes: d.vivoNodes ? parseInt(d.vivoNodes, 10) : null,
      area: nums(d.vivoArea, 4), hole: nums(d.vivoHole, 4),
      dim: d.vivoDim ? parseFloat(d.vivoDim) : null,
      touch: d.vivoTouch != null,
      theme: d.vivoTheme || null,
      instant: d.vivoInstant != null
    };
  }
  function mountAll(scope) {
    return Array.prototype.map.call((scope || document).querySelectorAll('[data-vivo]'), function (el) { return mount(el, fromAttrs(el)); });
  }

  /* ------------------------------------------------------------ geometria em profundidade */
  // .ap-geo[data-depth]: a forma desliza na rolagem, mais devagar ou ao contrário do texto.
  // y = (centro do pai - meio da tela) × profundidade × -0,012. Só acima de 1000px e com movimento.
  var wide = root.matchMedia('(min-width: 1001px)');
  var calmDepth = root.matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]movimento=reduzido/.test(location.search);
  var depthTick = false;
  function depth() {
    depthTick = false;
    var vh = root.innerHeight, on = wide.matches && !calmDepth;
    Array.prototype.forEach.call(document.querySelectorAll('.ap-geo[data-depth]'), function (g) {
      if (!on || !g.offsetParent) { g.style.transform = ''; return; }
      var host = g.parentElement.getBoundingClientRect();
      var y = (host.top + host.height / 2 - vh / 2) * (parseFloat(g.getAttribute('data-depth')) || 8) * -0.012;
      g.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
    });
  }
  function depthSoon() { if (!depthTick) { depthTick = true; requestAnimationFrame(depth); } }
  root.addEventListener('scroll', depthSoon, { passive: true });
  root.addEventListener('resize', depthSoon);

  root.APVivo = { version: '1.0', mount: mount, mountAll: mountAll, formations: FORMATIONS, palette: PAL, layers: LAYERS.slice(), grid: GRID, mark: mark, depth: depthSoon, instances: all };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { mountAll(); depthSoon(); });
  else { mountAll(); depthSoon(); }
})(window);
