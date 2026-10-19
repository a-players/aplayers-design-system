# Tokens da A-Players

Todos os tokens do Design System, com o valor em cada tema. Em CSS, use sempre `var(--ap-<nome>)` (a folha `assets/css/aplayers.css` já declara todos). Fora do CSS (PowerPoint, Word, imagem), use o valor da coluna do tema da peça.

- **Original**: o padrão do site e de tudo o que o mercado vê (`data-theme="light"` ou sem atributo).
- **Dark**: a opção noite do site (`data-theme="dark"`). Vazio = igual ao Original.
- **Light (Portal)**: o dia do Portal do A-Player e das peças internas (`class="ap-day"` no contêiner). Vazio = igual ao Original.

## Marca

| Token | Original | Dark | Light (Portal) | Uso |
|---|---|---|---|---|
| `--ap-blue` | `#3580c3` |  |  | Azul A-Players. Primeiro quarto do espectro; ação principal, Atlassian, pessoas. |
| `--ap-blue-l` | `#5fa6e3` |  |  | Azul claro. Início do espectro fluido e foco de campo no tema escuro. |
| `--ap-green` | `#6eb751` |  |  | Verde A-Players. Segundo quarto do espectro; processo, sucesso. |
| `--ap-red` | `#eb594d` |  |  | Vermelho A-Players. Terceiro quarto do espectro; conexão, monday.com. |
| `--ap-yellow` | `#f1e84e` |  |  | Amarelo A-Players. Último quarto do espectro; sinal, foco sobre a noite, placa dos botões. |
| `--ap-violet` | `#a18be8` |  |  | Violeta de apoio. Feedback, CISP1, tema escuro. Não faz parte do espectro do logo. |
| `--ap-yellow-line` | `#d4b106` | `#f1e84e` |  | Amarelo para traço fino sobre fundo claro (o amarelo da marca some em linha de 2px). |
| `--ap-logo-gray` | `#706b69` |  |  | Cinza do nome A-PLAYERS no logo colorido para fundo claro. Existe apenas no arquivo do logo: nunca em texto ou interface. |
| `--ap-logo-gray-2` | `#625e5c` |  |  | Cinza do descritor TECH KNOWLEDGE no logo colorido (logo de 14/10/2026). Existe apenas no arquivo do logo. |
| `--ap-logo-black` | `#000000` |  |  | Preto do logo de uma cor (logo de 14/10/2026). Existe apenas no arquivo do logo. |

## Superfícies

| Token | Original | Dark | Light (Portal) | Uso |
|---|---|---|---|---|
| `--ap-night` | `#0d1728` |  |  | A noite: fundo da marca, sempre escuro nos dois temas. |
| `--ap-night-2` | `#111d32` |  |  | Noite elevada: folhas noturnas, painéis. |
| `--ap-night-3` | `#16253f` |  |  | Noite mais alta: cartões sobre a noite. |
| `--ap-sheet` | `#f2f6fb` | `#111d32` | `#f5f2eb` | Folha: a superfície de leitura que sobe sobre a noite. |
| `--ap-card` | `#ffffff` | `#172741` | `#fffdf8` | Cartão sobre a folha. |
| `--ap-card-2` | `#f7f9fc` | `#1d2f4d` | `#f9f6f0` | Cartão secundário, etiquetas de etapa. |
| `--ap-field` | `#ffffff` | `#0f1a2e` | `#fffdf8` | Fundo de campo de formulário. |

## Tinta

| Token | Original | Dark | Light (Portal) | Uso |
|---|---|---|---|---|
| `--ap-ink` | `#17233a` | `#eaf0f8` |  | Texto principal sobre folha e cartão. |
| `--ap-ink-2` | `#4f5d73` | `#a9b6ca` |  | Texto de apoio, rótulos. |
| `--ap-line` | `rgba(23, 35, 58, .12)` | `rgba(255, 255, 255, .1)` |  | Borda de cartão e divisória. |
| `--ap-line-strong` | `rgba(23, 35, 58, .24)` | `rgba(255, 255, 255, .2)` |  | Borda de campo e etiqueta de etapa. |
| `--ap-on-night` | `#ffffff` |  |  | Texto principal sobre a noite. |
| `--ap-on-night-2` | `#b7c2d3` |  |  | Texto de apoio sobre a noite. |
| `--ap-night-line` | `rgba(255, 255, 255, .13)` |  |  | Borda e divisória sobre a noite. |
| `--ap-error` | `#b3261e` | `#ff9a8f` |  | Mensagem de erro de formulário. |

## Espectro

| Token | Original | Dark | Light (Portal) | Uso |
|---|---|---|---|---|
| `--ap-spectrum` | `linear-gradient(90deg, #3580c3 0 25%, #6eb751 25% 50%, #eb594d 50% 75%, #f1e84e 75% 100%)` |  |  | Divisor espectral: quatro quartos de paradas duras, 2px. |
| `--ap-spectrum-flow` | `linear-gradient(90deg, #5fa6e3 0%, #6eb751 34%, #eb594d 67%, #f1e84e 100%)` |  |  | Espectro fluido: progresso, trilhos e ligações. |

## Tema Light (Portal)

| Token | Original | Dark | Light (Portal) | Uso |
|---|---|---|---|---|
| `--ap-day` | `#f5f2eb` | `#0f1a2e` |  | Tema Light: o dia da marca, fundo do Portal do A-Player e das peças internas (o off-white quente, "osso"), com a mesma retícula de 56px. |
| `--ap-day-dots` | `rgba(46, 40, 30, .085)` | `rgba(183, 194, 211, .075)` |  | Tema Light: pontos da retícula sobre o dia. |
| `--ap-paper` | `#fffdf8` | `#172741` |  | Tema Light: folha e cartão sobre o dia, um tom acima do fundo. Dentro de .ap-day ele vira o --ap-card. |
| `--ap-paper-2` | `#f9f6f0` | `#1b2d4a` |  | Tema Light: cartão secundário sobre o dia. Dentro de .ap-day ele vira o --ap-card-2. |
| `--ap-glass` | `rgba(250, 248, 242, .84)` | `rgba(17, 29, 50, .84)` |  | Tema Light: vidro do cabeçalho do Portal (.ap-island--day), com desfoque. |
| `--ap-soft-blue` | `#e4eef9` | `#1a3455` |  | Azul suave: bloco no tom azul do lado B. |
| `--ap-soft-blue-2` | `#cfe1f4` | `#1e3f66` |  | Azul suave mais forte: fundo de imagem e segundo plano do bloco azul. |
| `--ap-soft-green` | `#e7f3e1` | `#22393e` |  | Verde suave. |
| `--ap-soft-green-2` | `#d1eac6` | `#2c4b40` |  | Verde suave mais forte. |
| `--ap-soft-red` | `#fde6e3` | `#382b3d` |  | Vermelho suave. |
| `--ap-soft-red-2` | `#f9cfca` | `#523140` |  | Vermelho suave mais forte. |
| `--ap-soft-yellow` | `#fbf6d0` | `#2e393c` |  | Amarelo suave. |
| `--ap-soft-yellow-2` | `#f4eba1` | `#444d3e` |  | Amarelo suave mais forte. |
| `--ap-soft-violet` | `#efebfc` | `#2f365d` |  | Violeta suave. |
| `--ap-soft-violet-2` | `#ddd4f8` | `#404372` |  | Violeta suave mais forte. |

## Logo

| Token | Original | Dark | Light (Portal) | Uso |
|---|---|---|---|---|
| `--ap-logo-ratio-h` | `1195.055 / 280` |  |  | Proporção da assinatura horizontal (largura / altura), para aspect-ratio. O símbolo ocupa a altura toda: 2,80h, com h = altura do nome A-PLAYERS. |
| `--ap-logo-ratio-v` | `834.043 / 634` |  |  | Proporção da assinatura vertical (largura / altura): caixa de 8,34h × 6,34h. |
| `--ap-logo-clear-h` | `.5` |  |  | Área de proteção da horizontal, em fração da altura da assinatura: metade da altura do símbolo (1,40h) em todo o contorno. |
| `--ap-logo-clear-v` | `.3155` |  |  | Área de proteção da vertical, em fração da altura da assinatura: metade da altura do símbolo (2,00h) em todo o contorno. |
| `--ap-logo-h-header` | `36px` |  |  | Altura do logo horizontal no cabeçalho do site e do Design System (152px de largura; no celular, 32px e 136px). |

## Texto sobre o tom

| Token | Original | Dark | Light (Portal) | Uso |
|---|---|---|---|---|
| `--ap-on-blue` | `#ffffff` |  |  | Texto grande sobre o azul (iniciais, selo da pessoa): branco. |
| `--ap-on-green` | `#0d1728` |  |  | Texto sobre o verde: noite. |
| `--ap-on-red` | `#ffffff` |  |  | Texto grande sobre o vermelho: branco. |
| `--ap-on-yellow` | `#0d1728` |  |  | Texto sobre o amarelo: noite. |
| `--ap-on-violet` | `#0d1728` |  |  | Texto sobre o violeta: noite. |

## Tipografia

| Token | Original | Dark | Light (Portal) | Uso |
|---|---|---|---|---|
| `--ap-title` | `"Manrope", system-ui, sans-serif` |  |  | Títulos (H1 a H4, display, números grandes). |
| `--ap-text` | `"DM Sans", system-ui, sans-serif` |  |  | Texto, interface, rótulos, botões. |
| `--ap-t-display` | `clamp(54px, 7.1vw, 120px)` |  |  | Display de abertura. Manrope 780, entrelinha .9, -0,05em. |
| `--ap-t-h1` | `clamp(44px, 5.4vw, 88px)` |  |  | H1. Manrope 800, entrelinha 1, -0,038em. |
| `--ap-t-h2` | `clamp(36px, 4.3vw, 70px)` |  |  | H2. Manrope 800, entrelinha 1,02, -0,035em. |
| `--ap-t-mid` | `clamp(28px, 2.9vw, 44px)` |  |  | Título intermediário. Manrope 800. |
| `--ap-t-h3` | `24px` |  |  | H3. Manrope 700, entrelinha 1,2. |
| `--ap-t-h4` | `17px` |  |  | H4. Manrope 700, entrelinha 1,3. |
| `--ap-t-lead` | `18px` |  |  | Texto de apoio de abertura. |
| `--ap-t-body` | `16px` |  |  | Texto corrido. DM Sans 400, entrelinha 1,6. |
| `--ap-t-small` | `15px` |  |  | Texto de cartão. |
| `--ap-t-label` | `14px` |  |  | Rótulo. DM Sans 700, caixa normal. |
| `--ap-t-num` | `12px` |  |  | Números em selo. DM Sans 700, algarismos tabulares. |
| `--ap-w-night` | `720` |  |  | Peso dos títulos claros sobre a noite. |

## Forma (cantos)

| Token | Original | Dark | Light (Portal) | Uso |
|---|---|---|---|---|
| `--ap-r-sheet` | `48px 14px 48px 14px` |  |  | Folha. |
| `--ap-r-card` | `20px 6px 20px 6px` |  |  | Cartão, placa, submenu, diálogo. |
| `--ap-r-path` | `14px 4px 14px 4px` |  |  | Caixa interna, item de lista, nota. |
| `--ap-r-pill` | `12px 4px 12px 4px` |  |  | Pill, filtros, seletores. |
| `--ap-r-action` | `10px 3px 10px 3px` |  |  | Botão, campo. |
| `--ap-r-badge` | `9px 3px 9px 3px` |  |  | Selo numerado, chip, etiqueta. |
| `--ap-r-mark` | `3px 1px 3px 1px` |  |  | Marca de tom (quadrado de 9px). |

## Espaço

| Token | Original | Dark | Light (Portal) | Uso |
|---|---|---|---|---|
| `--ap-grid` | `56px` |  |  | Módulo da retícula. O fundo da noite tem um ponto a cada 56px. |
| `--ap-wrap-w` | `1320px` |  |  | Largura do conteúdo (1480px acima de 1800px; 1680px acima de 2300px). |
| `--ap-gutter` | `clamp(20px, 4vw, 56px)` |  |  | Margem lateral. |
| `--ap-gap-sec` | `clamp(104px, 11.5vw, 168px)` |  |  | Distância entre seções numa folha. |
| `--ap-sheet-inset` | `clamp(6px, 1vw, 16px)` |  |  | Recuo da folha em relação à tela. |
| `--ap-plate-sm` | `4px` |  |  | Placa deslocada pequena: botão no hover. |
| `--ap-plate-md` | `6px` |  |  | Placa deslocada média: aba, porta, logo de parceiro. |
| `--ap-plate` | `10px` |  |  | Placa deslocada padrão: cartão em repouso. |
| `--ap-plate-lg` | `14px` |  |  | Placa deslocada no hover do cartão. |

## Movimento

| Token | Original | Dark | Light (Portal) | Uso |
|---|---|---|---|---|
| `--ap-ease` | `cubic-bezier(.2, .7, .2, 1)` |  |  | Curva padrão: interação, hover, troca de estado. |
| `--ap-ease-expo` | `cubic-bezier(.16, 1, .3, 1)` |  |  | Curva de entrada: revelações, submenus, abertura. |
| `--ap-ease-curtain` | `cubic-bezier(.7, 0, .3, 1)` |  |  | Curva da cortina entre páginas. |
| `--ap-dur-fast` | `.2s` |  |  | Cor, sublinhado. |
| `--ap-dur-base` | `.3s` |  |  | Placa, deslocamento de cartão. |
| `--ap-dur-slow` | `.45s` |  |  | Nós, seletores, trilhos. |
| `--ap-dur-enter` | `.9s` |  |  | Entrada orquestrada de uma abertura. |

## Foco

| Token | Original | Dark | Light (Portal) | Uso |
|---|---|---|---|---|
| `--ap-focus` | `#f1e84e` |  |  | Anel de foco sobre a noite (amarelo). |
| `--ap-focus-sheet` | `#3580c3` | `#f1e84e` |  | Anel de foco sobre a folha (azul no claro, amarelo no escuro). |

## Apelidos (aliases)

| Token | Original | Dark | Light (Portal) | Uso |
|---|---|---|---|---|
| `--ap-front-atlassian` | `var(--ap-blue)` |  |  | Tom da plataforma Atlassian. |
| `--ap-front-cisp1` | `var(--ap-violet)` |  |  | Tom da plataforma CISP1. |
| `--ap-front-monday` | `var(--ap-red)` |  |  | Tom da plataforma monday.com. |
| `--ap-role-pessoas` | `var(--ap-blue)` |  |  | Papel no Context Graph: pessoas. |
| `--ap-role-processo` | `var(--ap-green)` |  |  | Papel no Context Graph: processo. |
| `--ap-role-conexao` | `var(--ap-red)` |  |  | Papel no Context Graph: conexão. |
| `--ap-role-sinal` | `var(--ap-yellow)` |  |  | Papel no Context Graph: sinal. |
| `--ap-role-feedback` | `var(--ap-violet)` |  |  | Papel no Context Graph: feedback. |
| `--ap-tone` | `var(--ap-blue)` |  |  | Tom do componente. Troque por qualquer cor da marca no elemento. |
| `--ap-soft` | `var(--ap-soft-blue)` |  |  | Tom suave do componente no lado B. As classes .ap-tone--* trocam tom e tom suave juntos. |
| `--ap-soft-2` | `var(--ap-soft-blue-2)` |  |  | Segundo tom suave do componente no lado B. |
| `--ap-on-tone` | `var(--ap-on-blue)` |  |  | Cor do texto sobre o tom do componente. |
