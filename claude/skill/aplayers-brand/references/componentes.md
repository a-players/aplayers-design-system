# Componentes da A-Players (classes e marcação)

Cada componente vem da folha oficial `assets/css/aplayers.css`. Copie a marcação, troque apenas o texto e o tom (`style="--ap-tone: var(--ap-green)"`), e não reescreva o componente com CSS próprio. As imagens apontam para `assets/` desta skill: copie os arquivos para junto da peça (ou incorpore como data URI num artefato de arquivo único). Nos exemplos com geometria (`.ap-geo`), o contêiner (a noite ou a folha) precisa de `position: relative` e `overflow: hidden`, como no Design System; sem isso a forma passa da borda e cria rolagem lateral.

## Índice

- Símbolos SVG
- Botões · Ações
- Links · Ações
- Pill · Identidade
- Selo e marca de tom · Identidade
- Chips · Identidade
- Placa · Identidade
- Cartão de plataforma · Cartões
- Porta e oferta · Cartões
- Três camadas · Cartões
- IA em destaque · Cartões
- Leituras · Cartões
- Abas e nós · Escolha e conteúdo
- Listas · Escolha e conteúdo
- Notas · Escolha e conteúdo
- Formulários · Escolha e conteúdo
- Tema e idioma · Cabeçalho e avisos
- Navegação · Cabeçalho e avisos
- Avisos · Cabeçalho e avisos
- Dia e painel suave · Portal (tema Light)
- Cabeçalho do Portal · Portal (tema Light)
- Crachá, selo e foto · Portal (tema Light)
- Evento e termo · Portal (tema Light)
- Material, busca, atalhos e trilha · Portal (tema Light)
- Diálogo e confirmação · Portal (tema Light)
- Abertura · Padrões de página
- Folha sobre a noite · Padrões de página
- Três plataformas de IA · Padrões de página
- Mapa de escolha · Padrões de página
- Fechamento · Padrões de página
- Graph · o gráfico vivo

## Símbolos SVG

Pills, setas e ícones usam os símbolos abaixo (`<use href="#tris"/>` e afins). Cole este bloco uma vez, logo depois de `<body>`.

```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="tris" viewBox="0 0 44 10"><path d="M5 0l5 10H0z" fill="#3580c3"/><path d="M16 0l5 10H11z" fill="#6eb751"/><path d="M27 0l5 10H22z" fill="#eb594d"/><path d="M38 0l5 10H33z" fill="#f1e84e"/></symbol>
  <symbol id="chev" viewBox="0 0 10 6"><path d="M0 0h10L5 6z" fill="currentColor"/></symbol>
  <symbol id="ext" viewBox="0 0 12 12"><path d="M3 2h7v7M10 2 2 10" fill="none" stroke="currentColor" stroke-width="1.6"/></symbol>
  <symbol id="i-home" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 11.2 12 4l8.5 7.2"/><path d="M6 9.6V20h12V9.6"/><path d="M10 20v-5h4v5"/></g></symbol>
  <symbol id="i-grid" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/></g></symbol>
  <symbol id="i-chat" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 5.5h15v10.5H10l-5.5 4z"/><path d="M8.5 10.8h7"/></g></symbol>
  <symbol id="i-graph" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="7" r="2.2"/><circle cx="18" cy="6.5" r="2.2"/><circle cx="12.5" cy="17.5" r="2.6"/><path d="M7.4 8.9l3.8 6.4M16.9 8.4l-3.3 6.8M8.2 6.9h7.6"/></g></symbol>
  <symbol id="i-menu" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M4 12h16M4 17h10"/></g></symbol>
  <symbol id="i-close" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></g></symbol>
  <symbol id="i-people" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9.5" r="2.3"/><path d="M3.5 19c.6-3.2 2.9-5 5.5-5s4.9 1.8 5.5 5"/><path d="M15 14.4c.6-.3 1.3-.4 2-.4 2 0 3.5 1.4 3.9 3.8"/></g></symbol>
  <symbol id="i-book" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.6c2.7-1 5.3-.9 8 .9 2.7-1.8 5.3-1.9 8-.9V19c-2.7-1-5.3-.9-8 .9-2.7-1.8-5.3-1.9-8-.9z"/><path d="M12 6.5v13.4"/></g></symbol>
  <symbol id="i-copy" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/></g></symbol>
  <symbol id="i-code" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 7 3.5 12l5 5M15.5 7l5 5-5 5"/></g></symbol>
  <symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2"/><g stroke-linecap="round"><path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M5.4 18.6l1.5-1.5M17.1 6.9l1.5-1.5"/></g></symbol>
  <symbol id="i-moon" viewBox="0 0 24 24"><path d="M19.5 14.6A8 8 0 0 1 9.4 4.5a8 8 0 1 0 10.1 10.1z"/></symbol>
</svg>
```

## Botões · Ações

O botão principal é azul e ganha a placa amarela no hover; no clique, afunda. Sobre a noite, quando o azul já está no cabeçalho, o principal fica branco. O texto diz o que acontece.

**Faça**
- Um botão principal por área; o segundo em `--ghost` (noite) ou `--line` (folha).
- Na abertura sobre a noite, com o "Vamos conversar" azul no cabeçalho, o principal é o claro (`--light`): branco com a placa amarela.
- Rótulo que diz o destino ou a ação: "Nossos serviços", "Explorar Atlassian", "Enviar mensagem".
**Evite**
- Seta ou símbolo no fim do texto.
- "Clique aqui", "Saiba mais" sem dizer o quê.
- Dois botões azuis lado a lado.
- Botão de envio esticado na largura do formulário: ele fica no tamanho padrão.

### Sobre a folha

**Sobre a folha**: `.ap-btn · --line · --ink · --sm` Fundo: sobre a folha (`.ap-sheet`).

```html
<a class="ap-btn" href="#">Vamos conversar</a>
<a class="ap-btn ap-btn--line" href="#">Ver os casos</a>
<a class="ap-btn ap-btn--ink" href="#">Enviar mensagem</a>
<a class="ap-btn ap-btn--sm" href="#">Usar na minha peça</a>
<button type="button" class="ap-btn" disabled>Enviando</button>
```

### Sobre a noite

**Sobre a noite**: `.ap-btn--light · --ghost`. A dupla da abertura da Home. Fundo: sobre a noite (`.ap-night` ou o fundo `--ap-night`).

```html
<a class="ap-btn ap-btn--light" href="#">Nossos serviços</a>
<a class="ap-btn ap-btn--ghost" href="#">Quem somos</a>
<a class="ap-btn" href="#">Vamos conversar</a>
```

## Links · Ações

Sublinhado de 2px no tom, afastado do texto; no hover ele sobe para perto. Para chamadas no fim de cartões e portas.

### Link de texto

**Link de texto**: `.ap-link` Fundo: sobre a folha (`.ap-sheet`).

```html
<a class="ap-link" href="#">Explorar Atlassian</a>
<a class="ap-link" href="#" style="--ap-tone:var(--ap-violet)">Conhecer CISP1</a>
<a class="ap-link" href="#" style="--ap-tone:var(--ap-red)">Explorar monday.com</a>
```

## Pill · Identidade

A etiqueta que abre uma página, com os quatro triângulos da marca. Uma por abertura, em capitalização editorial.

### Sobre a noite

**Sobre a noite**: `.ap-pill` Fundo: sobre a noite (`.ap-night` ou o fundo `--ap-night`).

```html
<p class="ap-pill"><svg class="ap-tri" aria-hidden="true"><use href="#tris"/></svg>Comece pelo desafio</p>
```

### Sobre a folha

**Sobre a folha**: `.ap-pill--sheet`. Os triângulos usam o símbolo `#tris` (44 × 10). Fundo: sobre a folha (`.ap-sheet`).

```html
<p class="ap-pill ap-pill--sheet"><svg class="ap-tri" aria-hidden="true"><use href="#tris"/></svg>Quem somos</p>
```

## Selo e marca de tom · Identidade

O selo numera uma sequência real. A marca de tom é o quadrado de 9px que diz a que plataforma ou papel um item pertence.

**Faça**
- Selo apenas quando a ordem for informação: etapas, cenas, passos.
- A marca de tom antes do rótulo, para dizer o tom do item.
**Evite**
- Numerar itens que não são sequência.
- Trocar a marca de tom por barra lateral ou bolinha.

### Selo numerado

**Selo numerado**: `.ap-badge`. Texto na cor da noite, algarismos tabulares. Fundo: sobre a folha (`.ap-sheet`).

```html
<span class="ap-badge" style="--ap-tone:var(--ap-blue)">01</span>
<span class="ap-badge" style="--ap-tone:var(--ap-green)">02</span>
<span class="ap-badge" style="--ap-tone:var(--ap-red)">03</span>
<span class="ap-badge" style="--ap-tone:var(--ap-yellow)">04</span>
<span class="ap-badge" style="--ap-tone:var(--ap-violet)">05</span>
```

### Marca de tom

**Marca de tom**: `.ap-kicker · .ap-mark` Fundo: sobre a folha (`.ap-sheet`).

```html
<p class="ap-kicker" style="--ap-tone:var(--ap-blue)">Contexto corporativo</p>
<p class="ap-kicker" style="--ap-tone:var(--ap-violet)">Software e IA sob medida</p>
<p class="ap-kicker" style="--ap-tone:var(--ap-red)">Operação das áreas</p>
```

## Chips · Identidade

Aplicações e produtos com o ícone oficial, ou etiquetas curtas. Quatro variações para fundos e pesos diferentes.

### Chips

**Chips**: `.ap-chip · --soft · --tone · --marked` Fundo: sobre a folha (`.ap-sheet`).

```html
<div class="ap-chips">
  <span class="ap-chip"><img src="assets/produtos/atl-jira.svg" alt="">Jira</span>
  <span class="ap-chip"><img src="assets/produtos/atl-confluence.svg" alt="">Confluence</span>
  <span class="ap-chip"><img src="assets/produtos/atl-loom.svg" alt="">Loom</span>
  <span class="ap-chip"><img src="assets/produtos/mon-crm.png" alt="">monday CRM</span>
  <span class="ap-chip ap-chip--soft"><img src="assets/produtos/atl-rovo.svg" alt="">Rovo</span>
  <span class="ap-chip ap-chip--tone">Modelos abertos</span>
  <span class="ap-chip ap-chip--marked">Estratégia e desenho</span>
</div>
```

## Placa · Identidade

A base de todo cartão: fundo de cartão, borda fina, canto de cartão e a placa do tom. Como link, ela sobe e afunda.

**Faça**
- Placa proporcional ao tamanho: 10px e 14px apenas em cartão; aba, nó, atalho e ação curta com 4 a 6px.
- Na interação, o elemento sobe 2px (pequeno) ou 3px (cartão) enquanto a placa cresce.
**Evite**
- Placa de cartão num elemento do tamanho de um botão: ela fica longe do fundo e pesa mais que o texto.

### Placa

**Placa**: `.ap-plate · a.ap-plate · --flat` Fundo: sobre a folha (`.ap-sheet`).

```html
<div class="ap-plate" style="padding:22px"><p class="ap-kicker" style="margin-bottom:8px">Em repouso</p><p class="ap-h3">Placa de 10px</p></div>
<a class="ap-plate" href="#" style="padding:22px"><p class="ap-kicker" style="margin-bottom:8px">Interativa</p><p class="ap-h3">Passe o mouse</p></a>
<div class="ap-plate ap-plate--flat" style="padding:22px"><p class="ap-kicker" style="margin-bottom:8px">Sem placa</p><p class="ap-h3">Plana</p></div>
```

### Placa pequena

**Placa pequena**: `.ap-plate--sm · .is-on`. 4px em repouso, 6px na interação. Fundo: sobre a folha (`.ap-sheet`).

```html
<a class="ap-plate ap-plate--sm" href="#" style="padding:12px 16px;font-weight:700">Passe o mouse</a>
<a class="ap-plate ap-plate--sm is-on" href="#" style="--ap-tone:var(--ap-green);padding:12px 16px;font-weight:700">Escolhida</a>
```

## Cartão de plataforma · Cartões

Para apresentar uma plataforma de IA, um parceiro ou um produto: o que é, como se organiza e quando a A-Players indica.

### Plataforma

**Plataforma**: `.ap-plate.ap-front`. A classe mantém o nome `ap-front`. Fundo: sobre a folha (`.ap-sheet`).

```html
<article class="ap-plate ap-front" style="--ap-tone:var(--ap-violet)">
  <p class="ap-kicker">Software e IA sob medida</p>
  <p class="ap-front__logo"><img class="ap-partner ap-on-light" style="--ap-logo-h:25px" src="assets/parceiros/cisp1.png" alt="CISP1" width="480" height="153"><img class="ap-partner ap-on-dark" style="--ap-logo-h:25px" src="assets/parceiros/cisp1-dark.png" alt="CISP1" width="480" height="153"></p>
  <p class="ap-front__text">A camada de aplicação da IA empresarial, sob medida para você.</p>
  <div class="ap-fit"><p class="ap-fit__title">Indicamos quando</p><ul><li>Piloto que não escala.</li><li>Dados espalhados.</li><li>Sem produto pronto.</li></ul></div>
  <a class="ap-front__cta" href="#">Conhecer CISP1</a>
</article>
```

## Porta e oferta · Cartões

A porta leva a outra página com um título forte. A oferta apresenta um serviço: para quem, o nome e o que entrega.

### Porta e oferta

**Porta e oferta**: `.ap-door · --night · .ap-offer` Fundo: sobre a folha (`.ap-sheet`).

```html
<a class="ap-plate ap-door" href="#"><span class="ap-kicker">Quem somos</span><strong>Uma empresa de tecnologia feita de gente movida por desafios.</strong><span class="ap-door__cta">Conhecer a <span class="ap-nw">A-Players</span></span></a>
<a class="ap-plate ap-door ap-door--night" href="#" style="--ap-tone:var(--ap-yellow)"><span class="ap-kicker">Trabalho conectado</span><strong><span class="ap-nw">A-Players</span> Intelligence</strong><span>Atlassian, CISP1 e monday.com</span><span class="ap-door__cta">Conhecer as plataformas de IA</span></a>
<a class="ap-offer" href="#"><p class="ap-kicker">Contratação direta pela sua empresa</p><strong>Recrutamento e Seleção</strong><p>Para encontrar, avaliar e selecionar profissionais de tecnologia com aderência ao seu contexto.</p></a>
```

## Três camadas · Cartões

A estratégia de uma plataforma em uma leitura: o que entra, o núcleo em destaque e o que ele entrega, ligados por um fio do tom. O núcleo traz um desenho vivo do que a plataforma faz.

**Faça**
- Um desenho por plataforma, que mostra o que ela faz: fios que correm juntos (Atlassian), pulsos que atravessam o núcleo (CISP1), um quadro de status que muda (monday.com).
- Movimento apenas enquanto a caixa está na tela (`[data-weave]` liga `.is-live`), começando já no meio do ciclo.
**Evite**
- Desenho que apenas decora, sem relação com a plataforma.
- Movimento com `prefers-reduced-motion` ou `?movimento=reduzido`: o desenho fica parado e completo.

### Três camadas

**Três camadas**: `.ap-layer3 · .is-core · .ap-layer3__apps · .ap-layer3__art[data-weave]`. O código mostra a da monday.com. Fundo: sobre a folha (`.ap-sheet`).

```html
<ol class="ap-layer3" style="--ap-tone:var(--ap-blue)">
  <li><strong>Uma Collection para cada equipe</strong><span class="ap-layer3__apps"><span><img src="assets/produtos/atl-jira.svg" alt=""><em>Teamwork</em></span><span><img src="assets/produtos/atl-jsm.svg" alt=""><em>Service</em></span><span><img src="assets/produtos/atl-bitbucket.svg" alt=""><em>Software</em></span><span><img src="assets/produtos/atl-jira-product-discovery.svg" alt=""><em>Product</em></span><span><img src="assets/produtos/atl-focus.svg" alt=""><em>Strategy</em></span></span></li>
  <li class="is-core"><strong>Teamwork Graph</strong><span>Um gráfico único liga pessoas, trabalho e conhecimento.</span><svg class="ap-layer3__art" data-weave viewBox="0 0 300 28" aria-hidden="true" focusable="false"><path class="t-blue w-strand" d="M0 14.0 L5 15.1 L10 16.1 L15 17.1 L20 18.1 L25 18.9 L30 19.7 L35 20.3 L40 20.8 L45 21.2 L50 21.4 L55 21.5 L60 21.4 L65 21.2 L70 20.8 L75 20.3 L80 19.7 L85 18.9 L90 18.1 L95 17.1 L100 16.1 L105 15.1 L110 14.0 L115 12.9 L120 11.9 L125 10.9 L130 9.9 L135 9.1 L140 8.3 L145 7.7 L150 7.2 L155 6.8 L160 6.6 L165 6.5 L170 6.6 L175 6.8 L180 7.2 L185 7.7 L190 8.3 L195 9.1 L200 9.9 L205 10.9 L210 11.9 L215 12.9 L220 14.0 L225 15.1 L230 16.1 L235 17.1 L240 18.1 L245 18.9 L250 19.7 L255 20.3 L260 20.8 L265 21.2 L270 21.4 L275 21.5 L280 21.4 L285 21.2 L290 20.8 L295 20.3 L300 19.7 L305 18.9 L310 18.1 L315 17.1 L320 16.1 L325 15.1 L330 14.0 L335 12.9 L340 11.9 L345 10.9 L350 9.9 L355 9.1 L360 8.3 L365 7.7 L370 7.2 L375 6.8 L380 6.6 L385 6.5 L390 6.6 L395 6.8 L400 7.2 L405 7.7 L410 8.3 L415 9.1 L420 9.9 L425 10.9 L430 11.9 L435 12.9 L440 14.0 L445 15.1 L450 16.1 L455 17.1 L460 18.1 L465 18.9 L470 19.7 L475 20.3 L480 20.8 L485 21.2 L490 21.4 L495 21.5 L500 21.4 L505 21.2 L510 20.8 L515 20.3 L520 19.7"/><path class="t-yellow w-strand" d="M0 21.1 L5 21.4 L10 21.5 L15 21.5 L20 21.3 L25 20.9 L30 20.4 L35 19.8 L40 19.1 L45 18.2 L50 17.3 L55 16.3 L60 15.3 L65 14.2 L70 13.1 L75 12.1 L80 11.1 L85 10.1 L90 9.3 L95 8.5 L100 7.8 L105 7.3 L110 6.9 L115 6.6 L120 6.5 L125 6.5 L130 6.7 L135 7.1 L140 7.6 L145 8.2 L150 8.9 L155 9.8 L160 10.7 L165 11.7 L170 12.7 L175 13.8 L180 14.9 L185 15.9 L190 16.9 L195 17.9 L200 18.7 L205 19.5 L210 20.2 L215 20.7 L220 21.1 L225 21.4 L230 21.5 L235 21.5 L240 21.3 L245 20.9 L250 20.4 L255 19.8 L260 19.1 L265 18.2 L270 17.3 L275 16.3 L280 15.3 L285 14.2 L290 13.1 L295 12.1 L300 11.1 L305 10.1 L310 9.3 L315 8.5 L320 7.8 L325 7.3 L330 6.9 L335 6.6 L340 6.5 L345 6.5 L350 6.7 L355 7.1 L360 7.6 L365 8.2 L370 8.9 L375 9.8 L380 10.7 L385 11.7 L390 12.7 L395 13.8 L400 14.9 L405 15.9 L410 16.9 L415 17.9 L420 18.7 L425 19.5 L430 20.2 L435 20.7 L440 21.1 L445 21.4 L450 21.5 L455 21.5 L460 21.3 L465 20.9 L470 20.4 L475 19.8 L480 19.1 L485 18.2 L490 17.3 L495 16.3 L500 15.3 L505 14.2 L510 13.1 L515 12.1 L520 11.1"/><path class="t-green w-strand" d="M0 18.4 L5 17.5 L10 16.5 L15 15.5 L20 14.4 L25 13.4 L30 12.3 L35 11.3 L40 10.3 L45 9.4 L50 8.6 L55 7.9 L60 7.4 L65 6.9 L70 6.6 L75 6.5 L80 6.5 L85 6.7 L90 7.0 L95 7.5 L100 8.1 L105 8.8 L110 9.6 L115 10.5 L120 11.5 L125 12.5 L130 13.6 L135 14.6 L140 15.7 L145 16.7 L150 17.7 L155 18.6 L160 19.4 L165 20.1 L170 20.6 L175 21.1 L180 21.4 L185 21.5 L190 21.5 L195 21.3 L200 21.0 L205 20.5 L210 19.9 L215 19.2 L220 18.4 L225 17.5 L230 16.5 L235 15.5 L240 14.4 L245 13.4 L250 12.3 L255 11.3 L260 10.3 L265 9.4 L270 8.6 L275 7.9 L280 7.4 L285 6.9 L290 6.6 L295 6.5 L300 6.5 L305 6.7 L310 7.0 L315 7.5 L320 8.1 L325 8.8 L330 9.6 L335 10.5 L340 11.5 L345 12.5 L350 13.6 L355 14.6 L360 15.7 L365 16.7 L370 17.7 L375 18.6 L380 19.4 L385 20.1 L390 20.6 L395 21.1 L400 21.4 L405 21.5 L410 21.5 L415 21.3 L420 21.0 L425 20.5 L430 19.9 L435 19.2 L440 18.4 L445 17.5 L450 16.5 L455 15.5 L460 14.4 L465 13.4 L470 12.3 L475 11.3 L480 10.3 L485 9.4 L490 8.6 L495 7.9 L500 7.4 L505 6.9 L510 6.6 L515 6.5 L520 6.5"/><path class="t-violet w-strand" d="M0 9.6 L5 8.8 L10 8.1 L15 7.5 L20 7.0 L25 6.7 L30 6.5 L35 6.5 L40 6.6 L45 6.9 L50 7.4 L55 7.9 L60 8.6 L65 9.4 L70 10.3 L75 11.3 L80 12.3 L85 13.4 L90 14.4 L95 15.5 L100 16.5 L105 17.5 L110 18.4 L115 19.2 L120 19.9 L125 20.5 L130 21.0 L135 21.3 L140 21.5 L145 21.5 L150 21.4 L155 21.1 L160 20.6 L165 20.1 L170 19.4 L175 18.6 L180 17.7 L185 16.7 L190 15.7 L195 14.6 L200 13.6 L205 12.5 L210 11.5 L215 10.5 L220 9.6 L225 8.8 L230 8.1 L235 7.5 L240 7.0 L245 6.7 L250 6.5 L255 6.5 L260 6.6 L265 6.9 L270 7.4 L275 7.9 L280 8.6 L285 9.4 L290 10.3 L295 11.3 L300 12.3 L305 13.4 L310 14.4 L315 15.5 L320 16.5 L325 17.5 L330 18.4 L335 19.2 L340 19.9 L345 20.5 L350 21.0 L355 21.3 L360 21.5 L365 21.5 L370 21.4 L375 21.1 L380 20.6 L385 20.1 L390 19.4 L395 18.6 L400 17.7 L405 16.7 L410 15.7 L415 14.6 L420 13.6 L425 12.5 L430 11.5 L435 10.5 L440 9.6 L445 8.8 L450 8.1 L455 7.5 L460 7.0 L465 6.7 L470 6.5 L475 6.5 L480 6.6 L485 6.9 L490 7.4 L495 7.9 L500 8.6 L505 9.4 L510 10.3 L515 11.3 L520 12.3"/><path class="t-red w-strand" d="M0 6.9 L5 7.3 L10 7.8 L15 8.5 L20 9.3 L25 10.1 L30 11.1 L35 12.1 L40 13.1 L45 14.2 L50 15.3 L55 16.3 L60 17.3 L65 18.2 L70 19.1 L75 19.8 L80 20.4 L85 20.9 L90 21.3 L95 21.5 L100 21.5 L105 21.4 L110 21.1 L115 20.7 L120 20.2 L125 19.5 L130 18.7 L135 17.9 L140 16.9 L145 15.9 L150 14.9 L155 13.8 L160 12.7 L165 11.7 L170 10.7 L175 9.8 L180 8.9 L185 8.2 L190 7.6 L195 7.1 L200 6.7 L205 6.5 L210 6.5 L215 6.6 L220 6.9 L225 7.3 L230 7.8 L235 8.5 L240 9.3 L245 10.1 L250 11.1 L255 12.1 L260 13.1 L265 14.2 L270 15.3 L275 16.3 L280 17.3 L285 18.2 L290 19.1 L295 19.8 L300 20.4 L305 20.9 L310 21.3 L315 21.5 L320 21.5 L325 21.4 L330 21.1 L335 20.7 L340 20.2 L345 19.5 L350 18.7 L355 17.9 L360 16.9 L365 15.9 L370 14.9 L375 13.8 L380 12.7 L385 11.7 L390 10.7 L395 9.8 L400 8.9 L405 8.2 L410 7.6 L415 7.1 L420 6.7 L425 6.5 L430 6.5 L435 6.6 L440 6.9 L445 7.3 L450 7.8 L455 8.5 L460 9.3 L465 10.1 L470 11.1 L475 12.1 L480 13.1 L485 14.2 L490 15.3 L495 16.3 L500 17.3 L505 18.2 L510 19.1 L515 19.8 L520 20.4"/></svg></li>
  <li><strong>Rovo e Rovo Dev</strong><span>IA com contexto, das equipes ao código.</span></li>
</ol>
<ol class="ap-layer3" style="--ap-tone:var(--ap-violet)">
  <li><strong>Modelos de IA</strong><span class="ap-chips" style="justify-content:center;gap:6px;margin-top:8px"><span class="ap-chip ap-chip--tone">OpenAI</span><span class="ap-chip ap-chip--tone">Anthropic</span><span class="ap-chip ap-chip--tone">Google</span><span class="ap-chip ap-chip--tone">Modelos abertos</span></span></li>
  <li class="is-core"><strong>CISP1</strong><span>Conecta, governa e opera a IA em escala, com segurança.</span><svg class="ap-layer3__art" data-weave viewBox="0 0 300 28" aria-hidden="true" focusable="false"><path class="c-line" d="M12 5 C70 5 96 14 138 14"/><path class="c-line" d="M12 14 C70 14 96 14 138 14"/><path class="c-line" d="M12 23 C70 23 96 14 138 14"/><path class="c-line" d="M162 14 C204 14 230 4 286 4"/><path class="c-line" d="M162 14 C204 14 230 11 286 11"/><path class="c-line" d="M162 14 C204 14 230 17.5 286 17.5"/><path class="c-line" d="M162 14 C204 14 230 24 286 24"/><path class="c-pulse" pathLength="100" style="--d:-0.00s" d="M12 5 C70 5 96 14 138 14"/><path class="c-pulse" pathLength="100" style="--d:-0.37s" d="M12 14 C70 14 96 14 138 14"/><path class="c-pulse" pathLength="100" style="--d:-0.74s" d="M12 23 C70 23 96 14 138 14"/><path class="c-pulse" pathLength="100" style="--d:-1.11s" d="M162 14 C204 14 230 4 286 4"/><path class="c-pulse" pathLength="100" style="--d:-1.48s" d="M162 14 C204 14 230 11 286 11"/><path class="c-pulse" pathLength="100" style="--d:-1.85s" d="M162 14 C204 14 230 17.5 286 17.5"/><path class="c-pulse" pathLength="100" style="--d:-2.22s" d="M162 14 C204 14 230 24 286 24"/><circle class="c-in" cx="8" cy="5" r="3.3"/><circle class="c-in" cx="8" cy="14" r="3.3"/><circle class="c-in" cx="8" cy="23" r="3.3"/><rect class="c-out" x="287" y="1.5" width="10" height="5" rx="1.6"/><rect class="c-out" x="287" y="8.5" width="10" height="5" rx="1.6"/><rect class="c-out" x="287" y="15.0" width="10" height="5" rx="1.6"/><rect class="c-out" x="287" y="21.5" width="10" height="5" rx="1.6"/><path class="c-ring" d="M147.4 2L158.9 2A3.1 3.1 0 0 1 162 5.1L162 16.6A9.4 9.4 0 0 1 152.6 26L141.1 26A3.1 3.1 0 0 1 138 22.9L138 11.4A9.4 9.4 0 0 1 147.4 2Z"/><path class="c-core" d="M148.3 6.5L155.6 6.5A2 2 0 0 1 157.5 8.4L157.5 15.6A5.9 5.9 0 0 1 151.7 21.5L144.4 21.5A2 2 0 0 1 142.5 19.6L142.5 12.4A5.9 5.9 0 0 1 148.3 6.5Z"/></svg></li>
  <li><strong>Sua operação</strong><span>ERP, CRM, dados e sistemas legados.</span></li>
</ol>
<ol class="ap-layer3" style="--ap-tone:var(--ap-red)" data-snippet>
  <li><strong>Cada área com o seu processo</strong><span class="ap-layer3__apps"><span><img src="assets/produtos/mon-work-management.png" alt=""><em>work management</em></span><span><img src="assets/produtos/mon-crm.png" alt=""><em>CRM</em></span><span><img src="assets/produtos/mon-service.png" alt=""><em>service</em></span><span><img src="assets/produtos/mon-dev.png" alt=""><em>dev</em></span></span></li>
  <li class="is-core"><strong>Uma base de dados</strong><span>Quadros e fluxos de todas as áreas, na mesma base.</span><svg class="ap-layer3__art" data-weave viewBox="0 0 300 28" aria-hidden="true" focusable="false"><rect class="b-item" x="0" y="1.0" width="84" height="7" rx="2"/><rect class="st st--g" style="--d:-4.19s" x="92" y="1.0" width="46" height="7" rx="2" fill="#00c875"/><rect class="st st--o" style="--d:-2.09s" x="144" y="1.0" width="46" height="7" rx="2" fill="#fdab3d"/><rect class="st st--b" style="--d:-3.59s" x="196" y="1.0" width="46" height="7" rx="2" fill="#579bfc"/><rect class="st st--g" style="--d:-1.49s" x="248" y="1.0" width="46" height="7" rx="2" fill="#00c875"/><rect class="b-item" x="0" y="10.4" width="84" height="7" rx="2"/><rect class="st st--o" style="--d:-2.99s" x="92" y="10.4" width="46" height="7" rx="2" fill="#fdab3d"/><rect class="st st--g" style="--d:-0.89s" x="144" y="10.4" width="46" height="7" rx="2" fill="#00c875"/><rect class="st st--r" style="--d:-2.39s" x="196" y="10.4" width="46" height="7" rx="2" fill="#e2445c"/><rect class="st st--b" style="--d:-3.89s" x="248" y="10.4" width="46" height="7" rx="2" fill="#579bfc"/><rect class="b-item" x="0" y="19.8" width="84" height="7" rx="2"/><rect class="st st--b" style="--d:-1.79s" x="92" y="19.8" width="46" height="7" rx="2" fill="#579bfc"/><rect class="st st--g" style="--d:-3.29s" x="144" y="19.8" width="46" height="7" rx="2" fill="#00c875"/><rect class="st st--g" style="--d:-1.19s" x="196" y="19.8" width="46" height="7" rx="2" fill="#00c875"/><rect class="st st--o" style="--d:-2.69s" x="248" y="19.8" width="46" height="7" rx="2" fill="#fdab3d"/></svg></li>
  <li><strong>IA ao lado do time</strong><span>Sidekick, Agents e Vibe em cada área.</span></li>
</ol>
```

## IA em destaque · Cartões

Quando a plataforma tem IA com nome próprio, as três principais ganham um quadro com o ícone oficial. As que completam vêm logo abaixo, em texto, mais discretas.

### IA em destaque

**IA em destaque**: `.ap-aiapps · .ap-aiapps__more`. Da página monday.com: "A inteligência deixa de ser uma camada extra". Fundo: sobre a folha (`.ap-sheet`).

```html
<div data-snippet>
  <ul class="ap-aiapps"><li><img src="assets/produtos/mon-sidekick.png" alt="">Sidekick</li><li><img src="assets/produtos/mon-agents.png" alt="">Agents</li><li><img src="assets/produtos/mon-vibe.png" alt="">Vibe</li></ul>
  <p class="ap-aiapps__more"><span>AI workflow builder</span><span>AI Notetaker</span></p>
</div>
```

## Leituras · Cartões

O cartão do blog: capa, tipo e tempo, título em Manrope e uma linha de apoio. Sem foto, a capa é o tom com o título.

### Leitura

**Leitura**: `.ap-post · .ap-post__type`. Títulos de exemplo. Fundo: sobre a folha (`.ap-sheet`).

```html
<a class="ap-post" href="#" style="--ap-tone:var(--ap-yellow)"><span class="ap-post__type">Newsletter</span><span class="ap-post__meta">Newsletter · Edição de outubro</span><strong>O que mudou na adoção de IA</strong><span>As leituras do mês, em cinco minutos.</span></a>
<a class="ap-post" href="#" style="--ap-tone:var(--ap-green)"><span class="ap-post__type">Plataformas</span><span class="ap-post__meta">Artigo · 7 min</span><strong>Collections: uma para cada equipe</strong><span>Como o Teamwork Graph liga o trabalho.</span></a>
```

## Abas e nós · Escolha e conteúdo

A escolha ativa ganha a placa do seu tom. Setas do teclado trocam a aba. Nós de um mapa acendem quando fazem parte do caminho.

### Abas e nós

**Abas e nós**: `.ap-tab[aria-selected] · .ap-node.is-on · .is-dim` Fundo: sobre a folha (`.ap-sheet`).

```html
<div class="ap-tabs" role="tablist" aria-label="Exemplo de abas" data-tabs>
  <button type="button" class="ap-tab" role="tab" aria-selected="true" style="--ap-tone:var(--ap-blue)"><span class="ap-badge">01</span>Contratar talentos</button>
  <button type="button" class="ap-tab" role="tab" aria-selected="false" tabindex="-1" style="--ap-tone:var(--ap-green)"><span class="ap-badge">02</span>Ampliar a equipe</button>
  <button type="button" class="ap-tab" role="tab" aria-selected="false" tabindex="-1" style="--ap-tone:var(--ap-red)"><span class="ap-badge">03</span>Evoluir plataformas</button>
</div>
<div style="display:grid;gap:10px;align-content:start">
  <span class="ap-node is-on" style="--ap-tone:var(--ap-blue)">Talent as a Service</span>
  <span class="ap-node is-dim" style="--ap-tone:var(--ap-green)">Professional Services</span>
  <span class="ap-node is-on" style="--ap-tone:var(--ap-blue)">Recrutamento e Seleção</span>
</div>
```

### Filtros

**Filtros**: `.ap-filter[aria-pressed]` Fundo: sobre a folha (`.ap-sheet`).

```html
<div class="ap-filters" data-demo-filters>
  <button type="button" class="ap-filter" aria-pressed="true">Tudo</button>
  <button type="button" class="ap-filter" aria-pressed="false">Artigos</button>
  <button type="button" class="ap-filter" aria-pressed="false">Newsletter</button>
  <button type="button" class="ap-filter" aria-pressed="false">Eventos</button>
</div>
```

## Listas · Escolha e conteúdo

Seis formas de listar, cada uma para um tipo de conteúdo: tópicos, pontos, passos, fluxo, jornada e etapas.

### Tópicos, pontos e passos

**Tópicos, pontos e passos**: `.ap-bars · .ap-ticks · .ap-steps` Fundo: sobre a folha (`.ap-sheet`).

```html
<ul class="ap-bars"><li><strong>Tópicos com tom</strong><span>Título forte e uma linha de apoio.</span></li><li><strong>Para o que a plataforma faz</strong><span>Sem numerar o que não é sequência.</span></li></ul>
<ul class="ap-ticks"><li>Muitas equipes dividem o mesmo contexto.</li><li>Os processos cruzam áreas, com governança.</li><li>A IA precisa conhecer a empresa toda.</li></ul>
<ol class="ap-steps"><li><strong>Conte o desafio</strong><span>Em poucas linhas, com o contexto do time.</span></li><li><strong>A equipe retorna o contato</strong><span>Com quem vai conduzir a conversa.</span></li></ol>
```

### Fluxo com pulso

**Fluxo com pulso**: `.ap-flow · --n` Fundo: sobre a folha (`.ap-sheet`).

```html
<ol class="ap-flow" style="--n:3"><li><strong>Diagnóstico</strong><span>Entender processos e plataformas.</span></li><li><strong>Implementação</strong><span>Configurar, integrar e migrar.</span></li><li><strong>Evolução</strong><span>Sustentar e melhorar com o time.</span></li></ol>
```

### Jornada e etapas

**Jornada e etapas**: `.ap-acts · .ap-stepline` Fundo: sobre a folha (`.ap-sheet`).

```html
<ol class="ap-acts"><li><strong>Alinhamento</strong><span>Perfil, cultura e momento do time.</span></li><li><strong>Seleção</strong><span>Busca ativa e avaliação técnica.</span></li><li><strong>Acompanhamento</strong><span>Business Partner ao lado do profissional.</span></li></ol>
<div class="ap-plate" style="--ap-tone:var(--ap-yellow);padding:26px;grid-column:span 2">
  <ol class="ap-stepline" style="--n:3;--ap-surface:var(--ap-card)">
    <li style="--ap-tone:var(--ap-blue)"><span class="ap-badge">01</span><h3>Escutar</h3><p>Antes de propor.</p></li>
    <li style="--ap-tone:var(--ap-green)"><span class="ap-badge">02</span><h3>Dar forma</h3><p>Ao complexo.</p></li>
    <li style="--ap-tone:var(--ap-red)"><span class="ap-badge">03</span><h3>Evoluir</h3><p>Em movimento.</p></li>
  </ol>
</div>
```

## Notas · Escolha e conteúdo

Caixas no tom para o que a A-Players indica, entrega ou garante. O fundo mistura 11% do tom com o cartão.

### Notas

**Notas**: `.ap-note · .ap-fit` Fundo: sobre a folha (`.ap-sheet`).

```html
<div class="ap-note"><strong>O que fica com você</strong>Processos documentados, plataforma configurada e o time preparado para evoluir.</div>
<div class="ap-fit" style="--ap-tone:var(--ap-red)"><p class="ap-fit__title">Indicamos quando</p><ul><li>Cada área organiza a própria operação.</li><li>O processo precisa nascer rápido, sem código.</li><li>A IA entra no dia a dia do time.</li></ul></div>
```

## Formulários · Escolha e conteúdo

Campos altos (50px), rótulo acima em DM Sans 600, foco com anel azul e erro que explica como resolver.

### Formulário

**Formulário**: `.ap-field · .ap-file · .ap-switch · .ap-status`. Exemplo demonstrativo. Fundo: sobre a folha (`.ap-sheet`).

```html
<label class="ap-field" for="f-nome"><span>Nome <em>*</em></span><input id="f-nome" type="text" autocomplete="name" value="Ana Souza"></label>
<label class="ap-field" for="f-mail"><span>E-mail corporativo <em>*</em></span><input id="f-mail" type="email" value="ana@" aria-invalid="true" aria-describedby="f-mail-e"><span class="ap-field__error" id="f-mail-e">Informe um e-mail completo, como nome@empresa.com.br.</span></label>
<label class="ap-field" for="f-desafio">Desafio<select id="f-desafio"><option>Contratar talentos</option><option>Ampliar a equipe</option><option>Evoluir plataformas</option><option>Colocar a IA em prática</option></select></label>
<label class="ap-field" for="f-msg" style="grid-column:1 / -1">Conte o contexto<textarea id="f-msg">Queremos levar o atendimento para o Jira Service Management.</textarea><span class="ap-field__hint">Quanto mais contexto, mais certeira a conversa.</span></label>
<div class="ap-field" style="grid-column:1 / -1">Currículo<span class="ap-file"><input id="f-cv" type="file"><label class="ap-file__btn" for="f-cv">Escolher arquivo</label><span class="ap-file__name">Nenhum arquivo escolhido</span></span></div>
<label style="display:flex;align-items:center;gap:12px;font-weight:600"><span class="ap-switch"><input type="checkbox" checked aria-label="Receber a newsletter"><span class="ap-switch__track"></span></span>Receber a newsletter</label>
<p class="ap-status" style="grid-column:1 / -1">Mensagem enviada. A equipe responde pelo e-mail informado.</p>
```

## Tema e idioma · Cabeçalho e avisos

Os seletores do cabeçalho. O de tema troca sol por lua e acende estrelas; o de idioma desliza com a placa amarela.

### Idioma e tema

**Idioma e tema**: `.ap-lang · .ap-mode`. Este seletor de tema funciona: troca o tema desta página. Fundo: sobre a noite (`.ap-night` ou o fundo `--ap-night`).

```html
<div class="ap-lang" data-active="1" data-demo-lang><span class="ap-lang__knob" aria-hidden="true"></span><button type="button" class="ap-lang__opt" aria-current="true">PT</button><button type="button" class="ap-lang__opt" aria-current="false">EN</button></div>
<button type="button" class="ap-mode" role="switch" aria-checked="false" aria-label="Tema escuro" data-theme-toggle><span class="ap-mode__track"><i></i><i></i><i></i></span><span class="ap-mode__knob"><svg class="ap-mode__sun" aria-hidden="true"><use href="#i-sun"/></svg><svg class="ap-mode__moon" aria-hidden="true"><use href="#i-moon"/></svg></span></button>
```

## Navegação · Cabeçalho e avisos

A ilha do cabeçalho flutua sobre a noite com vidro e borda assimétrica. A página atual leva o espectro embaixo.

### Ilha

**Ilha**: `.ap-island · .ap-nav__link[aria-current]` Fundo: sobre a noite (`.ap-night` ou o fundo `--ap-night`).

```html
<div class="ap-island">
  <a class="ap-island__brand" href="#"><img src="assets/marca/aplayers-horizontal-site.svg" alt="A-Players" width="152" height="36"></a>
  <ul class="ap-nav"><li><a class="ap-nav__link" aria-current="page" href="#">Home</a></li><li><a class="ap-nav__link" href="#">Quem somos</a></li><li><a class="ap-nav__link" href="#">Blog</a></li></ul>
</div>
```

### Base de abertura

**Base de abertura**: `.ap-strata · .ap-stratum`. A linha do tom cresce no hover. As três frases cabem numa linha de 1280 a 1920px. Fundo: sobre a noite (`.ap-night` ou o fundo `--ap-night`).

```html
<div class="ap-strata" style="--n:3">
  <a class="ap-stratum" href="#" style="--ap-tone:var(--ap-blue)"><strong>Talent as a Service</strong><span>Especialistas de tecnologia no seu time.</span></a>
  <a class="ap-stratum" href="#" style="--ap-tone:var(--ap-green)"><strong>Professional Services</strong><span>Implementar, adotar e evoluir tecnologia.</span></a>
  <a class="ap-stratum" href="#" style="--ap-tone:var(--ap-yellow)"><strong><span class="ap-nw">A-Players</span> Intelligence</strong><span>Trabalho conectado. Inteligência para agir.</span></a>
</div>
```

## Avisos · Cabeçalho e avisos

O aviso de cookies dá o mesmo peso a aceitar e recusar. A confirmação é curta e some sozinha. O estado vazio diz o que fazer.

### Cookies e confirmação

**Cookies e confirmação**: `.ap-consent · .ap-toast` Fundo: sobre a noite (`.ap-night` ou o fundo `--ap-night`).

```html
<div class="ap-consent" role="region" aria-label="Exemplo de aviso de cookies">
  <div class="ap-consent__head"><svg class="ap-tri" aria-hidden="true"><use href="#tris"/></svg><p class="ap-consent__title">Cookies, do seu jeito</p></div>
  <p class="ap-consent__text">Usamos cookies necessários para o site funcionar. Os de preferência guardam escolhas como o tema. Você decide.</p>
  <div class="ap-consent__actions"><button type="button" class="ap-btn ap-btn--sm">Aceitar todos</button><button type="button" class="ap-btn ap-btn--sm ap-btn--ghost">Recusar opcionais</button></div>
</div>
<p class="ap-toast" style="--ap-tone:var(--ap-green)">Preferências salvas.</p>
```

### Estado vazio

**Estado vazio**: `.ap-empty` Fundo: sobre a folha (`.ap-sheet`).

```html
<div class="ap-empty"><p class="ap-empty__title">Nenhuma leitura com esse filtro</p><p>Tente outro tema ou veja todas as leituras.</p><button type="button" class="ap-btn ap-btn--sm ap-btn--line">Ver todas</button></div>
```

## Dia e painel suave · Portal (tema Light)

O tema Light. O lado A é o que o mercado vê: a noite do site. O lado B somos nós: o dia da marca, os cinco tons em versão suave, as fotos do time e os stickers. Nasceram no Portal do A-Player e servem a qualquer peça interna.

**Faça**
- Lado B nas peças internas: Portal, materiais do time, campanhas para quem é da casa.
- Um tom completo por bloco (`.ap-tone--*`) e gente de verdade nas fotos.
**Evite**
- Tons suaves no lado A: no site, a noite e as cores da marca.
- Sticker em cima de rosto ou de texto.

### Dia e painel suave

**Dia e painel suave**: `.ap-day · .ap-panel · .ap-tone--blue, --green, --red, --yellow, --violet`. O tom completo troca o tom, o tom suave e o texto sobre o tom de uma vez. Fundo: no tema Light (`.ap-day`).

```html
<div class="ap-panel ap-tone--yellow ladob-panel">
  <p class="ap-kicker" style="margin-bottom:14px">Portal do A&#8209;Player</p>
  <p class="ap-panel__title">Lado B.</p>
  <p class="ap-panel__lead">O lado A é o que o mercado vê. O lado B somos nós, as pessoas que fazem a <span class="ap-nw">A-Players</span> acontecer.</p>
  <img class="ap-sticker" src="assets/stickers/we-are-ai-people.webp" alt="">
</div>
```

## Cabeçalho do Portal · Portal (tema Light)

A ilha do Portal tem o formato da ilha do site: marca com o nome da peça, abas de texto com o espectro embaixo da atual e a ação de topo. Muda o vidro, que fica claro sobre o dia.

### Ilha do dia

**Ilha do dia**: `.ap-island.ap-island--day · .ap-nav__link[aria-current]`. O mesmo formato da ilha do site, com o vidro claro (`--ap-glass`), logo claro e o nome da peça. Fundo: no tema Light (`.ap-day`).

```html
<div class="ap-island ap-island--day">
  <a class="ap-island__brand" href="#" style="display:flex;align-items:center;gap:12px;text-decoration:none"><img src="assets/marca/aplayers-horizontal-claro.svg" alt="A-Players" width="152" height="36"><span style="padding-left:12px;border-left:1px solid var(--ap-line-strong);font:700 14px/1.15 var(--ap-text);color:var(--ap-ink-2);white-space:nowrap">Portal do <span class="ap-nw">A-Player</span></span></a>
  <ul class="ap-nav ladob-nav"><li><a class="ap-nav__link" aria-current="page" href="#">Início</a></li><li><a class="ap-nav__link" href="#">Favoritos</a></li><li><a class="ap-nav__link" href="#">Agenda</a></li><li><a class="ap-nav__link" href="#">Materiais</a></li></ul>
  <a class="ap-btn ap-btn--sm" href="#">Design System</a>
</div>
```

## Crachá, selo e foto · Portal (tema Light)

A pessoa no Portal: o crachá com o tom escolhido e um sticker, o selo com as iniciais em quatro tamanhos e a foto do time com legenda, levemente girada.

### Crachá, selo e foto

**Crachá, selo e foto**: `.ap-lanyard · .ap-idcard · .ap-avatar (--sm, --lg, --xl) · .ap-snap` Fundo: no tema Light (`.ap-day`).

```html
<div class="ladob-badge">
  <span class="ap-lanyard" aria-hidden="true"></span>
  <div class="ap-idcard ap-tone--blue">
    <i class="ap-idcard__hole" aria-hidden="true"></i>
    <p class="ap-idcard__top"><img src="assets/marca/aplayers-simbolo.svg" alt="">A-Players</p>
    <span class="ap-avatar ap-avatar--lg">AP</span>
    <p class="ap-idcard__name">A-Player</p>
    <p class="ap-idcard__meta">Portal do <span class="ap-nw">A-Player</span></p>
    <hr class="ap-spectrum">
    <img class="ap-idcard__sticker" src="assets/stickers/mascote.webp" alt="">
  </div>
</div>
<div class="ladob-stack">
  <p class="ap-label">Selo da pessoa</p>
  <p class="ladob-row"><span class="ap-avatar ap-avatar--sm ap-tone--blue">AP</span><span class="ap-avatar ap-tone--green">AP</span><span class="ap-avatar ap-avatar--lg ap-tone--red">AP</span><span class="ap-avatar ap-avatar--xl ap-tone--yellow">AP</span></p>
  <figure class="ap-snap ap-tone--violet" style="--w:210px;--r:-3deg"><img src="assets/fotos/setembro-01.jpg" alt="Destaques de setembro: o time da A-Players num evento" loading="lazy"><figcaption>Destaques de setembro</figcaption></figure>
</div>
```

## Evento e termo · Portal (tema Light)

O evento da Agenda, com a data em destaque e a ação de levar ao calendário, e o termo do Vocabulário, com o uso certo e o que evitar.

### Evento e termo

**Evento e termo**: `.ap-event · .ap-when · .ap-term · .ap-uses · .ap-use--avoid`. Evento da agenda do Portal. Fundo: no tema Light (`.ap-day`).

```html
<div class="ladob-cols">
  <article class="ap-event ap-tone--blue">
    <div class="ap-event__date"><b>06</b><span><strong>out</strong>a 08</span></div>
    <div class="ap-event__body"><span class="ap-when">Atlassian</span><h3>Atlassian Team ’26 Europe</h3><p class="ap-event__meta"><span>RAI, Amsterdã, e online</span></p></div>
    <div class="ap-event__actions"><a class="ap-btn-quiet" href="#">Levar ao calendário</a></div>
  </article>
  <article class="ap-term ap-tone--violet">
    <h3 class="ap-term__word">Plataformas de IA</h3>
    <p>Atlassian, CISP1 e monday.com juntas, nessa ordem. Sem "nossas": as três são parceiras estratégicas.</p>
    <ul class="ap-uses"><li class="ap-use"><b>Use</b><span>Conhecer as plataformas de IA</span></li><li class="ap-use ap-use--avoid"><b>Evite</b><span>três frentes</span></li></ul>
  </article>
</div>
```

## Material, busca, atalhos e trilha · Portal (tema Light)

As peças do dia a dia do Portal: o material com capa, a busca com atalho de teclado, as aplicações salvas, o quadrado "Salvar", os relacionados e a trilha do A-Learning com progresso.

### Material, busca, aplicações e trilha

**Material, busca, aplicações e trilha**: `.ap-material · .ap-search · .ap-kbd · .ap-apps · .ap-app (--bare, --add) · .ap-save · .ap-related · .ap-progress · .ap-ministeps`. Ícone da Atlassian sem outro azulejo: `.ap-app--bare`. Fundo: no tema Light (`.ap-day`).

```html
<a class="ap-material ap-tone--blue" href="../index.html"><img src="assets/capas/site.jpg" alt="" loading="lazy"><span class="ap-material__text"><strong>Site <span class="ap-nw">A-Players</span></strong><span>We Are <span class="ap-nw">AI-People</span> Company.</span><em>Marca</em></span></a>
<div class="ladob-stack">
  <button type="button" class="ap-search"><span class="ap-search__text"><strong>Buscar no Portal</strong><span>Pessoas, materiais, termos e aplicações</span></span><span class="ap-kbd">/</span></button>
  <ul class="ap-apps">
    <li><a class="ap-app ap-app--bare" href="#"><span class="ap-app__tile"><img src="assets/produtos/atl-jira.svg" alt=""></span><span class="ap-app__name">Jira</span><span class="ap-app__key">1</span></a></li>
    <li><a class="ap-app ap-app--bare" href="#"><span class="ap-app__tile"><img src="assets/produtos/atl-confluence.svg" alt=""></span><span class="ap-app__name">Confluence</span><span class="ap-app__key">2</span></a></li>
    <li><a class="ap-app" href="#" style="--ap-tone:var(--ap-red)"><span class="ap-app__tile"><img src="assets/produtos/mon-work-management.png" alt=""></span><span class="ap-app__name">monday work management</span><span class="ap-app__key">3</span></a></li>
    <li><a class="ap-app ap-app--add" href="#"><span class="ap-app__tile" aria-hidden="true">+</span><span class="ap-app__name">Adicionar</span></a></li>
  </ul>
  <p class="ladob-row"><button type="button" class="ap-save ap-tone--red" aria-pressed="true" data-demo-save>Salvo</button><button type="button" class="ap-save ap-tone--green" aria-pressed="false" data-demo-save>Salvar</button></p>
  <ul class="ap-related ap-tone--red"><li><a href="#">monday.com</a></li><li><a href="#">Sidekick</a></li><li><a href="#">Agents</a></li></ul>
</div>
<div class="ladob-stack ap-tone--green">
  <p class="ap-label">Trilha de exemplo</p>
  <div class="ap-progress" style="--n:5"><i class="is-done"></i><i class="is-done"></i><i></i><i></i><i></i></div>
  <ol class="ap-ministeps"><li class="is-done"><span class="ap-badge">01</span>O jeito A&#8209;Players</li><li class="is-done"><span class="ap-badge">02</span>As plataformas de IA</li><li class="is-next"><span class="ap-badge">03</span>A IA no dia a dia</li><li><span class="ap-badge">04</span>Escrever como a marca</li><li><span class="ap-badge">05</span>Antes de publicar</li></ol>
</div>
```

## Diálogo e confirmação · Portal (tema Light)

O diálogo pergunta com clareza e dá duas saídas; a confirmação é curta, some sozinha e oferece desfazer.

### Diálogo e confirmação

**Diálogo e confirmação**: `.ap-dialog · .ap-close · .ap-btn-quiet · .ap-toast__action` Fundo: no tema Light (`.ap-day`).

```html
<div class="ap-dialog ap-tone--yellow" role="group" aria-label="Exemplo de diálogo">
  <div class="ap-dialog__top"><p class="ap-dialog__title">Sair do Portal?</p><button type="button" class="ap-close">Fechar <span class="ap-kbd">Esc</span></button></div>
  <p class="ap-dialog__lead">Para voltar, use o botão Portal do <span class="ap-nw">A-Player</span> no rodapé do site.</p>
  <div class="ap-dialog__actions"><button type="button" class="ap-btn-quiet">Ficar</button><button type="button" class="ap-btn ap-btn--sm">Sair do Portal</button></div>
</div>
<div class="ladob-night"><p class="ap-toast" style="--ap-tone:var(--ap-green)">Aplicação removida.<button type="button" class="ap-toast__action">Desfazer</button></p></div>
```

## Abertura · Padrões de página

Pill, título, apoio, ações e, quando houver, a base com as especialidades. Tudo entra num único momento, sobre a noite e o gráfico.

### Abertura de página

**Abertura de página**. Exemplo com o texto da página Intelligence. Fundo: sobre a noite (`.ap-night` ou o fundo `--ap-night`).

```html
<div class="ap-geo" style="width:180px;right:-30px;bottom:-30px" aria-hidden="true"><img src="assets/geometria/services-triangle.svg" alt=""></div>
<p class="ap-pill" style="margin-bottom:22px"><svg class="ap-tri" aria-hidden="true"><use href="#tris"/></svg><span><span class="ap-nw">A-Players</span> Intelligence</span></p>
<h3 class="ap-h1" style="font-size:clamp(34px,4vw,60px);font-weight:720;max-width:15ch;margin-bottom:20px">Faça a IA trabalhar onde o trabalho acontece.</h3>
<p class="ap-lead-label" style="color:#fff;margin-bottom:6px">O diferencial começa antes da IA.</p>
<p class="ap-lead" style="max-width:540px">Organizamos conhecimento, processos e aplicações para que a IA encontre a informação certa, responda com contexto e execute tarefas dentro do processo.</p>
<div class="ap-actions" style="margin-top:28px"><a class="ap-btn ap-btn--light" href="#">Conhecer as plataformas de IA</a><a class="ap-btn ap-btn--ghost" href="#">Falar sobre o meu cenário</a></div>
```

## Folha sobre a noite · Padrões de página

Depois da abertura, o conteúdo corre numa folha clara que sobe sobre a noite. Entre duas folhas, a noite volta para um momento de destaque.

### Folha

**Folha**: `.ap-sheet`. Recuo de 6 a 16px da tela, canto de folha, sombra longa. Fundo: sobre a noite (`.ap-night` ou o fundo `--ap-night`).

```html
<div class="ap-sheet" style="padding:clamp(24px,3vw,40px);border-radius:var(--ap-r-sheet)">
  <div style="display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:20px;align-items:end">
    <h3 class="ap-mid">Do desafio ao resultado.</h3>
    <p style="color:var(--ap-ink-2);font-size:15px">Entendemos o contexto do negócio para conectar a capacidade do time, os processos e as plataformas. A parceria vai da decisão à execução e segue até o resultado aparecer na operação.</p>
  </div>
  <hr class="ap-spectrum" style="margin-top:24px">
</div>
```

## Três plataformas de IA · Padrões de página

Atlassian, CISP1 e monday.com lado a lado, nessa ordem. Cada bloco começa e termina na mesma linha nos três cartões, e os textos irmãos quebram no mesmo número de linhas.

**Faça**
- Ordem alfabética, sempre: Atlassian, CISP1, monday.com.
- Mesma anatomia e o mesmo número de linhas por bloco nos três, conferido de 1280 a 1920px; quando um quebra diferente, ajuste o texto, não o layout.
- "Plataformas de IA" para o conjunto; a CISP1 é a plataforma própria da A-Players.
**Evite**
- "Frentes" para o conjunto: o termo saiu do site em 05/10/2026.
- "Nossas plataformas": Atlassian e monday.com são parceiras.
- Logos com alturas iguais em pixels (o peso óptico fica diferente).

### Três plataformas de IA

**Três plataformas de IA**. Grade com subgrid: cada linha tem a altura do maior bloco. Fundo: sobre a folha (`.ap-sheet`).

```html
<div class="fronts3">
  <article class="ap-plate ap-front" style="--ap-tone:var(--ap-blue)">
    <p class="ap-kicker">Contexto corporativo</p>
    <p class="ap-front__logo"><img class="ap-partner ap-on-light" style="--ap-logo-h:25px" src="assets/parceiros/atlassian.png" alt="Atlassian" width="760" height="94"><img class="ap-partner ap-on-dark" style="--ap-logo-h:25px" src="assets/parceiros/atlassian-inverse.svg" alt="Atlassian" width="296" height="35"></p>
    <p class="ap-front__text">A empresa num fluxo único, com o mesmo contexto para equipes e IA.</p>
    <div class="ap-fit"><p class="ap-fit__title">Indicamos quando</p><ul><li>Muitas equipes juntas.</li><li>Processos entre áreas.</li><li>IA com contexto.</li></ul></div>
    <a class="ap-front__cta" href="#">Explorar Atlassian</a>
  </article>
  <article class="ap-plate ap-front" style="--ap-tone:var(--ap-violet)">
    <p class="ap-kicker">Software e IA sob medida</p>
    <p class="ap-front__logo"><img class="ap-partner ap-on-light" style="--ap-logo-h:25px" src="assets/parceiros/cisp1.png" alt="CISP1" width="480" height="153"><img class="ap-partner ap-on-dark" style="--ap-logo-h:25px" src="assets/parceiros/cisp1-dark.png" alt="CISP1" width="480" height="153"></p>
    <p class="ap-front__text">A camada de aplicação da IA empresarial, sob medida para você.</p>
    <div class="ap-fit"><p class="ap-fit__title">Indicamos quando</p><ul><li>Piloto que não escala.</li><li>Dados espalhados.</li><li>Sem produto pronto.</li></ul></div>
    <a class="ap-front__cta" href="#">Conhecer CISP1</a>
  </article>
  <article class="ap-plate ap-front" style="--ap-tone:var(--ap-red)">
    <p class="ap-kicker">Operação das áreas</p>
    <p class="ap-front__logo"><img class="ap-partner ap-on-light" style="--ap-logo-h:25px" src="assets/parceiros/monday.svg" alt="monday.com" width="512" height="81"><img class="ap-partner ap-on-dark" style="--ap-logo-h:25px" src="assets/parceiros/monday-white.svg" alt="monday.com" width="512" height="81"></p>
    <p class="ap-front__text">Cada área com o seu processo, sem código, e a IA ao lado do time.</p>
    <div class="ap-fit"><p class="ap-fit__title">Indicamos quando</p><ul><li>Cada área no seu fluxo.</li><li>Processos sem código.</li><li>IA no dia a dia.</li></ul></div>
    <a class="ap-front__cta" href="#">Explorar monday.com</a>
  </article>
</div>
```

## Mapa de escolha · Padrões de página

A pessoa escolhe o desafio e o mapa acende o caminho que a A-Players conecta. O resto esmaece para 38%.

### Mapa de escolha

**Mapa de escolha**. Abas com setas do teclado; nós com `.is-on` e `.is-dim`. Fundo: sobre a folha (`.ap-sheet`).

```html
<div class="mapdemo" data-map>
  <div class="ap-tabs" role="tablist" aria-label="Desafios" data-tabs>
    <button type="button" class="ap-tab" role="tab" aria-selected="true" style="--ap-tone:var(--ap-blue)" data-tone="var(--ap-blue)" data-path="taas rs" data-out="Talent as a Service com Recrutamento e Seleção, no seu time."><span class="ap-badge">01</span>Contratar talentos</button>
    <button type="button" class="ap-tab" role="tab" aria-selected="false" tabindex="-1" style="--ap-tone:var(--ap-green)" data-tone="var(--ap-green)" data-path="taas ext aip" data-out="Talent as a Service com Extensão de Equipe e AI-Player, na sua operação."><span class="ap-badge">02</span>Ampliar a equipe</button>
    <button type="button" class="ap-tab" role="tab" aria-selected="false" tabindex="-1" style="--ap-tone:var(--ap-red)" data-tone="var(--ap-red)" data-path="ps cons sust cap fins" data-out="Professional Services: consultoria, planos de assinatura, capacitações e FinOps SaaS, em Atlassian e monday.com."><span class="ap-badge">03</span>Evoluir plataformas</button>
    <button type="button" class="ap-tab" role="tab" aria-selected="false" tabindex="-1" style="--ap-tone:var(--ap-yellow)" data-tone="var(--ap-yellow)" data-path="ps intel ia fini cg sob" data-out="Professional Services e A-Players Intelligence: Adoção de IA, FinOps IA, Context Graph e Software e IA sob medida."><span class="ap-badge">04</span>Colocar a IA em prática</button>
  </div>
  <div class="mapdemo__cols">
    <div><p class="ap-label"><span class="ap-nw">A-Players</span></p><span class="ap-node" data-k="taas">Talent as a Service</span><span class="ap-node" data-k="ps">Professional Services</span><span class="ap-node" data-k="intel"><span><span class="ap-nw">A-Players</span> Intelligence</span></span></div>
    <div><p class="ap-label">Como atuamos</p><span class="ap-node" data-k="rs">Recrutamento e Seleção</span><span class="ap-node" data-k="ext">Extensão de Equipe</span><span class="ap-node" data-k="aip">AI-Player</span><span class="ap-node" data-k="cons">Consultoria especializada</span><span class="ap-node" data-k="sust">Planos de assinatura</span><span class="ap-node" data-k="cap">Capacitações e workshops</span><span class="ap-node" data-k="fins">FinOps SaaS</span><span class="ap-node" data-k="fini">FinOps IA</span><span class="ap-node" data-k="ia">Adoção de IA</span><span class="ap-node" data-k="cg">Context Graph</span><span class="ap-node" data-k="sob">Software e IA sob medida</span></div>
  </div>
  <p class="ap-note mapdemo__out"><strong>Caminho</strong><span data-map-out></span></p>
</div>
```

## Fechamento · Padrões de página

Toda página termina na noite, com um convite claro e a assinatura da marca. A barra espectral fecha a composição.

### Fechamento

**Fechamento**. No site, toda página fecha com o convite à esquerda e duas portas à direita: "Conte seu desafio" e um próximo destino. Nada de botão solto. Assinatura em Manrope 750, 48 a 104px, -0,05em. No rodapé, o norte: "Estratégia que gera resultado. Resultado que sustenta o crescimento." Fundo: sobre a noite (`.ap-night` ou o fundo `--ap-night`).

```html
<div class="ap-geo" style="width:200px;right:3%;top:10px" aria-hidden="true"><img src="assets/geometria/footer-triangle.svg" alt=""></div>
<p class="closing__sign" style="font-size:clamp(36px,4.6vw,72px)">We Are <span class="ap-nw">AI<span class="ap-hy">-</span>People</span> Company.</p>
<p class="ap-lead" style="margin-top:18px;max-width:560px">Fortalecer o time, evoluir suas plataformas ou colocar a IA em prática? Conte o momento da sua operação. A resposta começa pelo contexto, não por uma solução pronta.</p>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;margin-top:26px;max-width:720px">
  <a class="ap-plate ap-door ap-door--night" href="#" style="--ap-tone:var(--ap-blue)"><span class="ap-kicker">Uma conversa sobre a sua operação</span><strong>Conte seu desafio</strong><span>Vamos construir o ponto de partida.</span></a>
  <a class="ap-plate ap-door ap-door--night" href="#" style="--ap-tone:var(--ap-green)"><span class="ap-kicker">Como a A-Players atua</span><strong>Professional Services</strong><span>Conheça os seis pilares.</span></a>
</div>
<hr class="ap-spectrum" style="margin-top:36px">
```

## Classes de composição dos exemplos

Alguns exemplos usam classes de composição da própria documentação (`.closing__sign`, `.fronts3`, `.ladob-badge`, `.ladob-cols`, `.ladob-nav`, `.ladob-night`, `.ladob-panel`, `.ladob-row`, `.ladob-stack`, `.mapdemo`, `.mapdemo__cols`, `.mapdemo__out`, `.st--g`). Elas não são componentes da marca: estão em `assets/css/exemplos.css` para o exemplo funcionar igual; numa peça, a composição (grade, colunas, espaços) é da folha da peça.

## Graph · o gráfico vivo

O motor oficial é `assets/js/ap-vivo.js` (global `APVivo`). Um contêiner `.ap-vivo` recebe o canvas atrás do conteúdo:

```html
<div class="ap-vivo" data-vivo="constellation" style="position:relative;height:560px"></div>
<script src="assets/js/ap-vivo.js"></script>
```

Formações, camadas, zona livre (`data-vivo-hole`) e API: seção Graph de `references/llms.txt`.
