---
name: aplayers-brand
description: "Padrão oficial da marca A-Players (Design System 2.10): cores, temas Original, Dark e Light, tipografia Manrope e DM Sans, cantos assimétricos, placa deslocada, logos, componentes ap-* e as regras de escrita em pt-BR. Use esta skill sempre que for criar, adaptar ou revisar qualquer coisa em nome da A-Players ou com a identidade dela: página, landing page, artefato HTML, apresentação, documento, proposta, post, e-mail, material do Portal do A-Player, imagem ou texto, mesmo quando o pedido não disser marca nem design system. Use também para revisar textos e peças contra a marca (travessão, termos aposentados, nomes oficiais, ordem Atlassian, CISP1, monday.com)."
---

# Marca A-Players

Esta skill é o Design System oficial da A-Players (versão 2.10, 19/10/2026) empacotado para o Claude. A fonte da verdade é a
documentação publicada em https://aplayers-site-final.netlify.app/design-system/ ; esta pasta é gerada dela por `tools/build_skill.py`, então os valores aqui são os mesmos
do site. Se algo daqui divergir de um pedido do usuário, siga o usuário e diga qual regra da marca ficou de fora.

## Antes de começar

1. Leia `references/llms.txt` inteiro. É o resumo oficial: temas, tokens, logo, Graph, componentes, padrões de página,
   regras que não mudam e escrita. Quase toda dúvida se resolve ali.
2. Escolha o tema pela audiência, porque ele muda a superfície inteira:
   - **Original**: tudo o que o mercado vê (site, proposta, apresentação comercial, post). Abertura na noite
     (`--ap-night` #0d1728 com a retícula de pontos), conteúdo na folha clara (`--ap-sheet` #f2f6fb), cartões brancos.
   - **Dark**: apenas quando a pessoa pedir a versão noite.
   - **Light (Portal)**: Portal do A-Player e peças internas para o time (off-white quente `--ap-day`, papel, tons suaves, stickers).
     Nunca numa peça para o mercado.
3. Abra a referência do que vai fazer:

| Vai fazer | Leia |
|---|---|
| Qualquer texto (título, apoio, botão, post, e-mail) | `references/escrita.md` |
| Página ou artefato HTML | `references/componentes.md` e use `assets/css/aplayers.css` |
| Cor, medida, canto, sombra, valor exato | `references/tokens.md` |
| Logo | `references/logo.md` |
| Apresentação, documento, imagem, peça fora do HTML | `references/pecas.md` |

## Como montar

**HTML (página, landing page, artefato).** Carregue Manrope e DM Sans pelo Google Fonts e a folha oficial
`assets/css/aplayers.css` (inline num artefato de arquivo único). Monte com as classes `ap-*` de
`references/componentes.md`, copiando a marcação; a folha da peça cuida apenas da composição (grade, posição, ritmo).
O tom de cada componente vem de `--ap-tone`. Reescrever um botão, cartão ou pill com CSS próprio é o erro mais comum:
o resultado parece genérico e foge da marca. O gráfico vivo do site está em `assets/js/ap-vivo.js`.

**Fora do HTML.** Use os valores de `references/tokens.md`, as fontes Manrope (títulos, 700 a 800) e DM Sans (texto) e os
PNGs de `assets/marca/png/`. `references/pecas.md` traduz os componentes (placa, cantos, espectro, pill) para slides e documentos.

## O que faz a peça parecer A-Players

- As quatro cores do espectro, sempre nesta ordem: azul #3580c3, verde #6eb751, vermelho #eb594d, amarelo #f1e84e.
  Violeta #a18be8 é apoio (CISP1). A noite #0d1728 é o fundo da marca.
- Cantos assimétricos: grandes no alto à esquerda e embaixo à direita (`--ap-r-card` 20 6 20 6). Nunca cantos iguais.
- Placa deslocada sólida no tom do item, proporcional ao tamanho: 4px em botão, 10px em cartão (14px no hover).
- Pill com os quatro triângulos (`#tris`), selos numerados, marca de tom de 9px, barra espectral de quatro quartos.
- Geometria decorativa apenas com os SVGs de `assets/geometria/`, na periferia.
- Pill e rótulos em caixa normal, nunca caixa alta espaçada. Sem barra lateral colorida em cartão ou lista.
- Escala de títulos grande e fixa: o texto cabe na escala, a escala não encolhe para caber o texto.

## Escrita, em uma tela

O detalhe e os exemplos estão em `references/escrita.md`. O essencial:

- pt-BR consultivo e direto; clareza agressiva, promessa prudente. Resultado no centro; a IA diz o que faz.
- Nenhum travessão, meia-risca ou hífen com espaços como pontuação. Hífen de nome continua (A-Players, AI-People).
- Nunca: "só", "100%", "nunca mais", "qualquer integração", "frentes", "nossas plataformas", "ferramentas", "grafo",
  "potencializar", AMS, Academy, Workpacks, A-Hub, HRBP, PDI, "supervisão", "gente acima da média", "AI-Players".
- Parceiras sempre na ordem Atlassian, CISP1, monday.com; juntas são as "plataformas de IA". "a CISP1"; monday.com minúsculo.
- "Inteligência Artificial" com as duas maiúsculas; IA na forma curta. AI-Player "acompanhados por especialistas".
  FinOps começa por "visibilidade". "Plano de desenvolvimento". Assinatura: We Are AI-People Company.
- Nada inventado: número, preço, case ou capacidade de produto apenas com fonte que a pessoa deu.

## Antes de entregar

1. Rode o verificador sobre o que você produziu (HTML, Markdown, CSS, .docx, .pptx, .xlsx):
   `python scripts/check_brand.py <arquivo ou pasta>`. Ele aponta ERRO (regra da marca quebrada) e AVISO (confira).
   Corrija todo ERRO; um trecho que mostra de propósito o que evitar fica de fora com `data-brand-ignore`.
2. Releia contra a lista do fim de `references/llms.txt`: tema certo, apenas tokens e classes `ap-*`, nada inventado.
3. Se for HTML, renderize em 390x844, 1366x768 e 1920x1080 e confira títulos de cartão numa linha e cartões lado a lado
   com o mesmo número de linhas.

## Arquivos

- `references/llms.txt`: o resumo oficial do Design System (leia primeiro).
- `references/tokens.md`, `references/escrita.md`, `references/componentes.md`, `references/logo.md`, `references/pecas.md`.
- `assets/css/aplayers.css`: a folha oficial. `assets/js/ap-vivo.js`: o motor do Graph. `assets/tokens/`: tokens.json e tokens.css.
- `assets/marca/`: logos em SVG e `png/`, com o catálogo `marca.json`. `assets/geometria/`, `assets/parceiros/`,
  `assets/produtos/`, `assets/stickers/` (este último apenas no tema Light).
- `scripts/check_brand.py`: o verificador da marca (Python 3, sem dependências).
