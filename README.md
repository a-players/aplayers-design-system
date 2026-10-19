# A-Players Design System

O padrão da marca A-Players, extraído do site A-Players (versão Claude, a pasta acima desta, outubro de 2026) para ser usado em qualquer peça: apresentações, materiais, landing pages, produtos e campanhas.

| Campo | Valor |
| --- | --- |
| Dono | Fernando Horn (A-Players) |
| Status | ativo, versão 2.10 (19/10/2026) |
| Fonte de verdade | O site A-Players versão Claude para decisões visuais; `tools/build_tokens.py` para os valores dos tokens; `css/aplayers.css` para os componentes |
| Local | a pasta `design-system/` do repositório `a-players/site-aplayers-final` (a fonte). O repositório `a-players/aplayers-design-system` é a cópia desta pasta para distribuição, com o mesmo histórico (`git subtree split --prefix=design-system`); mudanças entram sempre por aqui. |
| Publicação | junto com o site e o Portal do A-Player, em `/design-system/` da mesma publicação no Netlify (ver o README da pasta acima) |
| Validação | `python tools/check-peca.py A-Players/site-aplayers/site-alternativo-claude/design-system` na raiz do workspace; render pela entrada `ap-site-alternativo-claude` do `.claude/launch.json` (porta 3469), em `http://localhost:3469/design-system/` |
| Entrega | pasta estática: `index.html` (documentação, com a Biblioteca), `css/aplayers.css` (a folha da marca), `tokens/`, `assets/`, `llms.txt`; no Claude, o Design System da A-Players (`claude/design-system/`) e a skill `aplayers-brand` (`claude/skill/`) |

## Estrutura

```
index.html            documentação: Início, Fundamentos, Componentes, Graph, Padrões (com Escrita), Biblioteca, Recursos
css/aplayers.css      a folha da marca: tokens + base + componentes do lado A (o site) e do lado B (o Portal), prefixo ap-
css/docs.css          apenas a moldura da documentação
js/docs.js            rotas com cortina, abertura, índice lateral, código das vitrines, demos, tema, caixas vivas e Biblioteca
js/grafo.js           o gráfico vivo da abertura (versão compacta do canvas do site)
js/ap-vivo.js         o motor do gráfico vivo do site (js/graph.js) para qualquer peça: .ap-vivo[data-vivo]
tokens/tokens.css     tokens em CSS (gerado)
tokens/tokens.json    tokens em formato de design tokens (gerado)
tokens/tokens.js      o mesmo JSON embutido para a tabela da documentação (gerado)
tools/build_tokens.py fonte única dos tokens; gera os dois arquivos e o bloco de tokens de aplayers.css
tools/check_vivo.py   confere se as formações de js/ap-vivo.js são as do site (../js/graph.js)
tools/build_biblioteca.py gera a rota #biblioteca do index.html e assets/biblioteca/biblioteca.js a partir de biblioteca.json
tools/check_brand.py  verificador da marca para qualquer peça: texto (travessão, vocabulário, nomes, ordem das parceiras) e estilo
tools/build_claude.py gera o Design System da A-Players no Claude em claude/design-system/project/ (dsdoc.py lê o index.html)
tools/build_skill.py  gera a skill aplayers-brand em claude/skill/ (pasta e .zip para Configurações, Skills)
claude/               o que vai para o Claude: o Design System, a skill e assets-map.json (ids das imagens no artefato)
llms.txt              o sistema resumido para agentes de IA
assets/marca          logos A-Players oficiais (de A-Players/logos/A-Players/SVG) e favicon
assets/parceiros      logos Atlassian, CISP1 e monday.com usados no site; collections/ com os cinco logos das Collections (claro e escuro, mesmo quadro)
assets/biblioteca     logos e ícones oficiais das três plataformas de IA, sem edição, com fonte e data em biblioteca.json
assets/produtos       ícones oficiais de produto (Atlassian e monday.com)
assets/geometria      as 15 geometrias oficiais em SVG
assets/stickers       stickers da marca (WebP para a web; em alta/, os PNG grandes com fundo transparente)
```

## Como mudar um valor

1. Edite o valor em `tools/build_tokens.py`.
2. Rode `python tools/build_tokens.py` dentro desta pasta: ele regenera `tokens/tokens.css`, `tokens/tokens.json`, `tokens/tokens.js` e o bloco entre `@tokens:start` e `@tokens:end` de `css/aplayers.css`.
3. Registre a mudança em Recursos, Versões, no `index.html`.

## Como mudar a Biblioteca

1. Ponha o arquivo oficial em `assets/biblioteca/<plataforma>/<aplicação>/` e registre no `biblioteca.json`, com fonte e data.
2. Rode `python tools/build_biblioteca.py` dentro desta pasta: ele reescreve o trecho entre `@biblioteca:start` e `@biblioteca:end` do `index.html` e o `assets/biblioteca/biblioteca.js`.

## Como mudar o Graph (o gráfico do site)

1. O site é a fonte: formações, números e desenho nascem em `../js/graph.js`.
2. Leve a mesma mudança para `js/ap-vivo.js` (formações em `FORMATIONS`, o resto na mesma ordem do arquivo do site) e rode `python tools/check_vivo.py` dentro desta pasta.
3. Atualize a rota Graph do `index.html` (tabelas de números e formações) e registre em Recursos, Versões.

## Como levar uma mudança para o Claude

1. Depois de mudar o sistema, rode dentro desta pasta `python tools/build_claude.py` e `python tools/build_skill.py --zip`.
2. Se `build_claude.py` listar imagens novas, envie-as ao artefato do Design System no Claude e registre os ids em `claude/assets-map.json` (`python tools/build_claude.py --uploads` lista o que falta).
3. Publique no artefato os arquivos de `claude/design-system/project/` que mudaram, com `design-system.json` por último.
4. Envie `claude/skill/aplayers-brand.zip` em Configurações, Skills, no Claude (substitui a versão anterior da skill).
5. Confira com `python tools/check_brand.py <pasta ou arquivo>` antes de publicar qualquer peça.

## Como atualizar o repositório aplayers-design-system

O repositório https://github.com/a-players/aplayers-design-system é esta pasta, com o mesmo histórico. Ninguém edita lá: a mudança entra aqui, no site, e depois vai para lá. Na raiz do repositório do site, depois do merge no main:

```
git subtree split --prefix=design-system -b aplayers-design-system
git push https://github.com/a-players/aplayers-design-system aplayers-design-system:main
```

O `split` refaz a mesma história de forma determinística, então o envio é sempre um avanço simples (sem forçar).

## Decisões desta versão

- Pedido do Fernando (01/10/2026): um Design System único e próprio, a partir do site, desconsiderando os sistemas anteriores (`site-aplayers/site-design-system`, `aplayers-stylesheet`).
- Classes com prefixo `ap-` e tokens `--ap-*` para não colidir com o CSS de outras peças. Cada componente traz no comentário a classe de origem no site.
- O tema escuro segue o do site: a noite fica escura; folha e cartões viram camadas de azul noite.
- A documentação usa o próprio sistema: os componentes mostrados vêm de `aplayers.css`, e o código de cada vitrine é gerado do exemplo renderizado.
- Versão 2.1 (05/10/2026): acompanha a revisão de posicionamento do site. "Frentes" virou "plataformas de IA" (classes `ap-front` e tokens `--ap-front-*` mantêm o nome, para não quebrar peças); entraram `ap-btn--light`, `ap-coll-logo`, `ap-on-light`/`ap-on-dark`, `ap-aiapps` e as caixas vivas `ap-layer3__art`; a documentação passou a mostrar o lado B e a Biblioteca, que já estavam na folha e na pasta desde a 2.0; o índice lateral deixou de cortar a placa do item atual.
- Versão 2.10 (19/10/2026): o sistema chega ao Claude. `tools/build_claude.py` gera o Design System da A-Players no Claude (`claude/design-system/project/`, com as imagens no armazenamento do artefato e os ids em `claude/assets-map.json`); `tools/build_skill.py` gera a skill `aplayers-brand` (`claude/skill/`); `tools/check_brand.py` é o verificador de texto e estilo para qualquer peça. Nada disso tem fonte própria: tudo vem de `llms.txt`, `tokens/`, `css/`, `js/`, `index.html` e `assets/`.
- Versão 2.9 (14/10/2026): logo de 14/10/2026 (kit consolidado). Os arquivos de `assets/marca` foram trocados mantendo os nomes; entraram as verticais azul, verde, vermelha e amarela (16 assinaturas no total), os PDFs (8 páginas na horizontal e na vertical) e o pacote `aplayers-marca.zip`. Fundamentos, Logos mostra todas as assinaturas com download, a construção em h, a proteção, os tamanhos e as cores do logo. Tokens do logo: `--ap-logo-gray-2`, `--ap-logo-ratio-h`, `--ap-logo-ratio-v`, `--ap-logo-clear-h`, `--ap-logo-clear-v`, `--ap-logo-h-header`; `--ap-logo-black` vira #000000. No site, o logo mantém a altura anterior (36px no cabeçalho).
- Versão 2.8 (14/10/2026): três temas em Fundamentos, Temas: Original (o padrão do site, `data-theme="light"`), Dark (a opção noite, `data-theme="dark"`) e Light (o dia do Portal do A-Player, `.ap-day`). Tokens novos do Light: `--ap-day` passa ao off-white quente do Portal (#f5f2eb), `--ap-paper`, `--ap-paper-2` e `--ap-glass`; dentro de `.ap-day`, cartões usam o papel. Ilha do dia (`.ap-island--day`). Componentes em dois grupos (Site e Portal, este em seis seções). A Voz entrou em Padrões, grupo Escrita (`#voz` leva para lá), e o Graph veio depois de Componentes no cabeçalho. Índice lateral com mais respiro, logo do cabeçalho em 132px como no site, `llms.txt` com o mapa da documentação, os temas e a lista do que conferir antes de entregar.
- Versão 2.7 (08/10/2026): a rota Vivo passa a se chamar Graph (`#vivo` leva para `#graph`). O motor `js/ap-vivo.js` (APVivo 1.1) acompanha o site: todas as formações com satélites, o grupo sob o cursor revela o que reúne e os nomes não se sobrepõem. Medidas novas: título de cartão numa linha, cartões lado a lado com as mesmas linhas, aplicativos em chips numa linha. Fechamento com duas portas; fios das etapas em movimento; FinOps SaaS e IA.
- Versão 2.6 (07/10/2026): quinta rodada de 2027, revista no notebook e no monitor grande. A escala dos títulos volta à original em todas as telas e o texto passa a caber nela: abertura com uma frase de até 40 caracteres (até 3 linhas), título de seção com duas frases de até 21 caracteres ou uma de até 45, apoio de até 140 caracteres sem passar da altura do título, cena da Home com título de até 26, fechamento de até 40 e item de lista de até 55.
- Versão 2.5 (06/10/2026): terceira rodada de 2027, validada no notebook. H1 e H2 descem um degrau entre 1001 e 1799px (44 a 66px e 36 a 55px) para os títulos de duas frases ficarem em duas linhas; "acompanhados por especialistas" no lugar de "supervisão"; "visibilidade" no lugar de "inventário" no FinOps.
- Versão 2.4 (06/10/2026): segunda rodada de 2027 no site. Home e aberturas falam de impacto; o plano de assinatura fica nas páginas de Professional Services, Atlassian e monday.com e reúne gestão de ambientes, suporte, melhorias contínuas e evolução estratégica da plataforma (Essential, Growth e Enterprise, cada um somando ao anterior). Em Talent as a Service, o tradicional vem primeiro e os AI-Players entram como apoio, com a gestão e o conhecimento sempre humanos.
- Versão 2.3 (06/10/2026): vocabulário de 2027, da revisão de posicionamento do site. AI-Players são os agentes de IA da A-Players (terceira forma de Talent as a Service; "agentes AI-People" saiu), a sustentação é vendida em planos de assinatura (Essential, Growth, Enterprise), o FinOps SaaS e IA entra avulso ou no Enterprise, e a CISP1 é parceira estratégica, como Atlassian e monday.com. Títulos de oferta: a dor com nome, o que muda, a condição real e o primeiro passo.
- Versão 2.2 (06/10/2026): tudo o que é vivo no site ganhou lugar próprio, a rota Vivo. O motor do gráfico do site virou `js/ap-vivo.js`, portátil, com as mesmas formações e números; entraram `ap-vivo`, `ap-vivo--page`, os nós em HTML (`ap-hub`, `ap-sat`, `ap-dust`), `ap-run` e a profundidade das geometrias (`ap-geo[data-depth]`). O motor ganhou as cores do dia (`data-vivo-theme`) e a página inteira (`ap-vivo--page`), o fundo vivo do Portal, e os stickers ganharam o balanço `ap-sway`. A placa ganhou o tamanho pequeno (`ap-plate--sm`, 4px e 6px), para elementos do tamanho de um botão.

## Quem usa direto

- O Portal do A-Player (`../portal/`) carrega `css/aplayers.css`, `js/grafo.js` (na entrada), `js/ap-vivo.js` (fundo vivo de todas as vistas), os logos das plataformas de IA, as geometrias e os ícones de produto daqui. Ao renomear ou mover arquivo, confira o Portal.
- O tema é o mesmo das três peças da publicação (chave `ap-tema`, com a regra de cookies do site).
- `js/grafo.js` aceita polos próprios: defina `window.APDS_GRAPH_GROUPS` (cinco polos) antes de carregar o arquivo, como faz a entrada do Portal.

## Pendências

- Definir quem pode editar depois da publicação.
- Atualizar `A-Players/CLAUDE.md` e `AGENTS.md`, que hoje apontam o `site-design-system` como referência para peças novas, se este sistema passar a ser o oficial.
