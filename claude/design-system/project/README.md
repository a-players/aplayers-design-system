A marca da A-Players em tokens, classes e regras: o padrão de tudo o que a A-Players cria (site, apresentação, material, produto, campanha). Este sistema é gerado do Design System oficial, publicado em https://aplayers-site-final.netlify.app/design-system/, pelo script tools/build_claude.py. Quando algo diverge, vale o oficial.

## Como usar este sistema

- Cores, espaços, cantos, sombras e movimento: os tokens deste sistema, com os mesmos nomes do código (`--ap-blue`, `--ap-sheet`, `--ap-r-card`).
- Três temas: **Original** (o padrão do site, para o mercado), **Dark** (a opção noite do site) e **Light (Portal)** (o dia do Portal do A-Player e das peças internas). No código, Original é `data-theme="light"`, Dark é `data-theme="dark"` e Light é `class="ap-day"` no contêiner.
- Componentes: a folha `components/bundle.css` é a `css/aplayers.css` oficial; use as classes `ap-*` como nas prévias e troque o tom pelo `--ap-tone`.
- Tipografia: Manrope nos títulos (`--ap-title`, de 700 a 800) e DM Sans no texto (`--ap-text`), pelo Google Fonts. Pill e rótulos em caixa normal.
- Logos: o grupo Logos tem as 16 assinaturas oficiais e o símbolo; escolha pelo fundo e nunca redesenhe.
- Escrita: pt-BR consultivo e direto, sem travessão; leia a seção Escrita antes de escrever qualquer texto.

## Como montar uma peça

1. Carregue as fontes Manrope (títulos) e DM Sans (texto) pelo Google Fonts e a folha css/aplayers.css.
2. Use as classes ap-*. Não reescreva componentes; a folha da peça cuida apenas da composição (grade, posição, ritmo).
3. O tom de cada componente vem de --ap-tone (padrão: --ap-blue). Troque no elemento: style="--ap-tone: var(--ap-green)".
4. Tema escuro: data-theme="dark" no html, ou deixe seguir o sistema. Na publicação, site, Design System e Portal do A-Player leem e gravam a mesma escolha (chave ap-tema; entre visitas apenas com cookies de preferências permitidos).
5. Graph (o gráfico do site): js/ap-vivo.js é o motor do site (js/graph.js) para qualquer peça. Um contêiner .ap-vivo com data-vivo="<formação>" recebe o canvas, atrás do conteúdo. Formações: constellation, fronts, ecosystem, context, context-wide, cycle, flow, people, people-wide, teamwork, operation, cisp, calm. Camadas (data-vivo-off ou data-vivo-layers): grid, glow, edges, pulses, halos, nodes, labels, cursor, attract, breathe, camera, depth. Zona livre para o texto: data-vivo-hole="x y largura altura" (0 a 1). API: APVivo.mount(el, opções), g.set(), g.burst(), g.highlight(), g.layer(), g.png(). A abertura do próprio Design System usa js/grafo.js (versão compacta, polos próprios em window.APDS_GRAPH_GROUPS).
6. Antes de entregar: python tools/check_brand.py <pasta> (texto e estilo; no workspace, também tools/check-peca.py) e render em 390x844, 1366x768 e 1920x1080, claro e escuro.

## Tokens principais

- Marca, na ordem do espectro: --ap-blue #3580c3, --ap-green #6eb751, --ap-red #eb594d, --ap-yellow #f1e84e. Apoio: --ap-violet #a18be8, --ap-blue-l #5fa6e3, --ap-yellow-line #d4b106 (traço fino sobre claro).
- Superfícies: --ap-night #0d1728 (fundo da marca, escuro no Original e no Dark), --ap-night-2 #111d32, --ap-night-3 #16253f, --ap-sheet #f2f6fb (folha), --ap-card #fff, --ap-card-2 #f7f9fc, --ap-field #fff. Tema Light: --ap-day, --ap-day-dots, --ap-paper, --ap-paper-2, --ap-glass e --ap-soft-* (valores em Temas).
- Tinta: --ap-ink #17233a, --ap-ink-2 #4f5d73, --ap-on-night #fff, --ap-on-night-2 #b7c2d3, --ap-line, --ap-line-strong, --ap-night-line.
- Espectro: --ap-spectrum (quatro quartos, paradas duras, divisor de 2px), --ap-spectrum-flow (trilhos e progresso).
- Tipografia: --ap-title Manrope, --ap-text DM Sans. Escala: display 54 a 120px (780), H1 44 a 88 (800), H2 36 a 70 (800), intermediário 28 a 44, H3 24 (700), H4 17, apoio 18, texto 16, rótulo 14 (700, caixa normal), número 12. Títulos claros sobre a noite em 720.
- Forma (sempre assimétrica: cantos grandes no alto à esquerda e embaixo à direita): --ap-r-sheet 48 14, --ap-r-card 20 6, --ap-r-path 14 4, --ap-r-pill 12 4, --ap-r-action 10 3, --ap-r-badge 9 3, --ap-r-mark 3 1.
- Placa deslocada (o destaque da marca, no tom do item), proporcional ao tamanho: 4px botão e placa pequena em repouso, 6px aba, porta e placa pequena na interação, 10px cartão em repouso, 14px cartão no hover. Nunca placa de cartão num elemento do tamanho de um botão.
- Espaço: módulo de 56px (retícula de pontos na noite), largura 1320px, margem 20 a 56px, entre seções 104 a 168px.
- Movimento: --ap-ease (.2,.7,.2,1), --ap-ease-expo (.16,1,.3,1), --ap-ease-curtain (.7,0,.3,1); .2s, .3s, .45s, .9s.
- Plataformas de IA: Atlassian azul, CISP1 violeta, monday.com vermelho (tokens --ap-front-*, nome mantido). Papéis do Context Graph: pessoas azul, processo verde, conexão vermelho, sinal amarelo, feedback violeta.

## Regras que não mudam

- Evoluir os componentes de identidade (placa deslocada, bordas assimétricas, selos, pills com triângulos, espectro, geometrias oficiais). Minimalismo genérico no lugar deles foi recusado.
- Sem barra lateral colorida em cartão, lista ou coluna. O tom vai na marca de 9px e na placa.
- Geometria decorativa apenas com os 15 SVGs oficiais de assets/geometria, na periferia, sem opacidade por cima.
- Logos oficiais de assets/marca e assets/parceiros; escolher a versão pelo contraste do fundo; nunca redesenhar.
- Pill e rótulos em caixa normal, nunca caixa alta espaçada.
- Respeitar prefers-reduced-motion e ?movimento=reduzido.
