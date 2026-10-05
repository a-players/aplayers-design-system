# A-Players Design System

O padrão da marca A-Players, extraído do site A-Players (versão Claude, a pasta acima desta, outubro de 2026) para ser usado em qualquer peça: apresentações, materiais, landing pages, produtos e campanhas.

| Campo | Valor |
| --- | --- |
| Dono | Fernando Horn (A-Players) |
| Status | ativo, versão 1.1 (01/10/2026) |
| Fonte de verdade | O site A-Players versão Claude para decisões visuais; `tools/build_tokens.py` para os valores dos tokens; `css/aplayers.css` para os componentes |
| Local | `A-Players/site-aplayers/site-alternativo-claude/design-system/` (desde 01/10/2026; antes em `A-Players/aplayers-design-system`) |
| Publicação | junto com o site e o A-Hub, em `/design-system/` da mesma publicação no Netlify (ver o README da pasta acima) |
| Validação | `python tools/check-peca.py A-Players/site-aplayers/site-alternativo-claude/design-system` na raiz do workspace; render pela entrada `ap-site-alternativo-claude` do `.claude/launch.json` (porta 3469), em `http://localhost:3469/design-system/` |
| Entrega | pasta estática: `index.html` (documentação), `css/aplayers.css` (a folha da marca), `tokens/`, `assets/`, `llms.txt` |

## Estrutura

```
index.html            documentação: Início, Fundamentos, Componentes, Padrões, Voz e escrita, Recursos
css/aplayers.css      a folha da marca: tokens + base + 36 componentes com prefixo ap-
css/docs.css          só a moldura da documentação
js/docs.js            rotas com cortina, abertura, índice lateral, código das vitrines, demos, tema
js/grafo.js           o gráfico vivo da abertura (versão compacta do canvas do site)
tokens/tokens.css     tokens em CSS (gerado)
tokens/tokens.json    tokens em formato de design tokens (gerado)
tokens/tokens.js      o mesmo JSON embutido para a tabela da documentação (gerado)
tools/build_tokens.py fonte única dos tokens; gera os dois arquivos e o bloco de tokens de aplayers.css
llms.txt              o sistema resumido para agentes de IA
assets/marca          logos A-Players oficiais (de A-Players/logos/A-Players/SVG) e favicon
assets/parceiros      logos Atlassian, CISP1 e monday.com usados no site
assets/produtos       ícones oficiais de produto (Atlassian e monday.com)
assets/geometria      as 15 geometrias oficiais em SVG
assets/stickers       stickers da marca
```

## Como mudar um valor

1. Edite o valor em `tools/build_tokens.py`.
2. Rode `python tools/build_tokens.py` dentro desta pasta: ele regenera `tokens/tokens.css`, `tokens/tokens.json`, `tokens/tokens.js` e o bloco entre `@tokens:start` e `@tokens:end` de `css/aplayers.css`.
3. Registre a mudança em Recursos, Versões, no `index.html`.

## Decisões desta versão

- Pedido do Fernando (01/10/2026): um Design System único e próprio, a partir do site, desconsiderando os sistemas anteriores (`site-aplayers/site-design-system`, `aplayers-stylesheet`).
- Classes com prefixo `ap-` e tokens `--ap-*` para não colidir com o CSS de outras peças. Cada componente traz no comentário a classe de origem no site.
- O tema escuro segue o do site: a noite fica escura; folha e cartões viram camadas de azul noite.
- A documentação usa o próprio sistema: os componentes mostrados vêm de `aplayers.css`, e o código de cada vitrine é gerado do exemplo renderizado.

## Quem usa direto

- O A-Hub (`../portal/`) carrega `css/aplayers.css`, `js/grafo.js` (na entrada), os logos das frentes, as geometrias e os ícones de produto daqui. Ao renomear ou mover arquivo, confira o A-Hub.
- O tema é o mesmo das três peças da publicação (chave `ap-tema`, com a regra de cookies do site).
- `js/grafo.js` aceita polos próprios: defina `window.APDS_GRAPH_GROUPS` (cinco polos) antes de carregar o arquivo, como faz a entrada do A-Hub.

## Pendências

- Definir quem pode editar depois da publicação.
- Atualizar `A-Players/CLAUDE.md` e `AGENTS.md`, que hoje apontam o `site-design-system` como referência para peças novas, se este sistema passar a ser o oficial.
