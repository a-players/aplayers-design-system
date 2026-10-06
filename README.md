# A-Players Design System

O padrão da marca A-Players, extraído do site A-Players (versão Claude, a pasta acima desta, outubro de 2026) para ser usado em qualquer peça: apresentações, materiais, landing pages, produtos e campanhas.

| Campo | Valor |
| --- | --- |
| Dono | Fernando Horn (A-Players) |
| Status | ativo, versão 2.1 (05/10/2026) |
| Fonte de verdade | O site A-Players versão Claude para decisões visuais; `tools/build_tokens.py` para os valores dos tokens; `css/aplayers.css` para os componentes |
| Local | `A-Players/site-aplayers/site-alternativo-claude/design-system/` (desde 01/10/2026; antes em `A-Players/aplayers-design-system`) |
| Publicação | junto com o site e o Portal do A-Player, em `/design-system/` da mesma publicação no Netlify (ver o README da pasta acima) |
| Validação | `python tools/check-peca.py A-Players/site-aplayers/site-alternativo-claude/design-system` na raiz do workspace; render pela entrada `ap-site-alternativo-claude` do `.claude/launch.json` (porta 3469), em `http://localhost:3469/design-system/` |
| Entrega | pasta estática: `index.html` (documentação, com a Biblioteca), `css/aplayers.css` (a folha da marca), `tokens/`, `assets/`, `llms.txt` |

## Estrutura

```
index.html            documentação: Início, Fundamentos, Componentes, Padrões, Voz e escrita, Biblioteca, Recursos
css/aplayers.css      a folha da marca: tokens + base + componentes do lado A (o site) e do lado B (o Portal), prefixo ap-
css/docs.css          só a moldura da documentação
js/docs.js            rotas com cortina, abertura, índice lateral, código das vitrines, demos, tema, caixas vivas e Biblioteca
js/grafo.js           o gráfico vivo da abertura (versão compacta do canvas do site)
js/ap-vivo.js         o motor do gráfico vivo do site (js/graph.js) para qualquer peça: .ap-vivo[data-vivo]
tokens/tokens.css     tokens em CSS (gerado)
tokens/tokens.json    tokens em formato de design tokens (gerado)
tokens/tokens.js      o mesmo JSON embutido para a tabela da documentação (gerado)
tools/build_tokens.py fonte única dos tokens; gera os dois arquivos e o bloco de tokens de aplayers.css
tools/check_vivo.py   confere se as formações de js/ap-vivo.js são as do site (../js/graph.js)
tools/build_biblioteca.py gera a rota #biblioteca do index.html e assets/biblioteca/biblioteca.js a partir de biblioteca.json
llms.txt              o sistema resumido para agentes de IA
assets/marca          logos A-Players oficiais (de A-Players/logos/A-Players/SVG) e favicon
assets/parceiros      logos Atlassian, CISP1 e monday.com usados no site; collections/ com os cinco logos das Collections (claro e escuro, mesmo quadro)
assets/biblioteca     logos e ícones oficiais das três plataformas de IA, sem edição, com fonte e data em biblioteca.json
assets/produtos       ícones oficiais de produto (Atlassian e monday.com)
assets/geometria      as 15 geometrias oficiais em SVG
assets/stickers       stickers da marca
```

## Como mudar um valor

1. Edite o valor em `tools/build_tokens.py`.
2. Rode `python tools/build_tokens.py` dentro desta pasta: ele regenera `tokens/tokens.css`, `tokens/tokens.json`, `tokens/tokens.js` e o bloco entre `@tokens:start` e `@tokens:end` de `css/aplayers.css`.
3. Registre a mudança em Recursos, Versões, no `index.html`.

## Como mudar a Biblioteca

1. Ponha o arquivo oficial em `assets/biblioteca/<plataforma>/<aplicação>/` e registre no `biblioteca.json`, com fonte e data.
2. Rode `python tools/build_biblioteca.py` dentro desta pasta: ele reescreve o trecho entre `@biblioteca:start` e `@biblioteca:end` do `index.html` e o `assets/biblioteca/biblioteca.js`.

## Como mudar o gráfico vivo

1. O site é a fonte: formações, números e desenho nascem em `../js/graph.js`.
2. Leve a mesma mudança para `js/ap-vivo.js` (formações em `FORMATIONS`, o resto na mesma ordem do arquivo do site) e rode `python tools/check_vivo.py` dentro desta pasta.
3. Atualize a rota Vivo do `index.html` (tabelas de números e formações) e registre em Recursos, Versões.

## Decisões desta versão

- Pedido do Fernando (01/10/2026): um Design System único e próprio, a partir do site, desconsiderando os sistemas anteriores (`site-aplayers/site-design-system`, `aplayers-stylesheet`).
- Classes com prefixo `ap-` e tokens `--ap-*` para não colidir com o CSS de outras peças. Cada componente traz no comentário a classe de origem no site.
- O tema escuro segue o do site: a noite fica escura; folha e cartões viram camadas de azul noite.
- A documentação usa o próprio sistema: os componentes mostrados vêm de `aplayers.css`, e o código de cada vitrine é gerado do exemplo renderizado.
- Versão 2.1 (05/10/2026): acompanha a revisão de posicionamento do site. "Frentes" virou "plataformas de IA" (classes `ap-front` e tokens `--ap-front-*` mantêm o nome, para não quebrar peças); entraram `ap-btn--light`, `ap-coll-logo`, `ap-on-light`/`ap-on-dark`, `ap-aiapps` e as caixas vivas `ap-layer3__art`; a documentação passou a mostrar o lado B e a Biblioteca, que já estavam na folha e na pasta desde a 2.0; o índice lateral deixou de cortar a placa do item atual.
- Versão 2.2 (06/10/2026): tudo o que é vivo no site ganhou lugar próprio, a rota Vivo. O motor do gráfico do site virou `js/ap-vivo.js`, portátil, com as mesmas formações e números; entraram `ap-vivo`, `ap-vivo--page`, os nós em HTML (`ap-hub`, `ap-sat`, `ap-dust`), `ap-run` e a profundidade das geometrias (`ap-geo[data-depth]`).

## Quem usa direto

- O Portal do A-Player (`../portal/`) carrega `css/aplayers.css`, `js/grafo.js` (na entrada), os logos das plataformas de IA, as geometrias e os ícones de produto daqui. Ao renomear ou mover arquivo, confira o Portal.
- O tema é o mesmo das três peças da publicação (chave `ap-tema`, com a regra de cookies do site).
- `js/grafo.js` aceita polos próprios: defina `window.APDS_GRAPH_GROUPS` (cinco polos) antes de carregar o arquivo, como faz a entrada do Portal.

## Pendências

- Definir quem pode editar depois da publicação.
- Atualizar `A-Players/CLAUDE.md` e `AGENTS.md`, que hoje apontam o `site-design-system` como referência para peças novas, se este sistema passar a ser o oficial.
