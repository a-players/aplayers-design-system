# Peças fora do HTML

Como levar o Design System para apresentação, documento, imagem e e-mail, onde a folha `aplayers.css` não roda. Os valores
vêm de `tokens.md`; as regras, de `llms.txt`. Quando o formato não permite um detalhe, simplifique sem trocar por outro estilo.

## Base comum

- Fontes: Manrope para títulos (peso 800; 700 em títulos de cartão; 720 em títulos claros sobre a noite) e DM Sans para texto
  (400; 700 em rótulos). As duas são gratuitas no Google Fonts; instale no computador para PowerPoint e Word e incorpore
  as fontes ao arquivo antes de enviar. No Google Slides e no Docs, as duas estão em Mais fontes.
- Cores: apenas as dos tokens. Noite #0d1728 (fundo escuro), folha #f2f6fb (fundo claro), cartão #ffffff, tinta #17233a,
  tinta de apoio #4f5d73; sobre a noite, texto #ffffff e apoio #b7c2d3. Espectro: azul #3580c3, verde #6eb751,
  vermelho #eb594d, amarelo #f1e84e (traço fino amarelo sobre claro: #d4b106). Violeta #a18be8 de apoio.
- Logo: PNG de `assets/marca/png/` escolhido pelo fundo (`logo.md`): colorido no claro, cores e escrita branca na noite.
  Área de proteção de metade da altura do símbolo; nunca menor que o mínimo.
- Texto: as mesmas regras de `escrita.md`. Rode `scripts/check_brand.py` também no .pptx e no .docx.

## Apresentação (PowerPoint, Google Slides, Keynote)

- Capa e aberturas de seção na noite, com título grande em branco, apoio em #b7c2d3 e a barra espectral de quatro quartos
  (azul, verde, vermelho, amarelo, paradas duras) como divisor. Conteúdo na folha clara, com cartões brancos.
- Cantos da marca: no PowerPoint, a forma "Retângulo com cantos diagonais arredondados" (round2DiagRect) arredonda o alto
  à esquerda e o canto de baixo à direita, como `--ap-r-card`. Não use retângulo com os quatro cantos iguais.
- Placa deslocada: um retângulo sólido no tom do item, atrás do cartão, deslocado 10px para a direita e para baixo
  (proporcional: menor em elementos pequenos). Sem sombra difusa no lugar dela.
- Rótulos e pills em caixa normal; marca de tom de 9px (um quadradinho no tom) antes do rótulo.
- Títulos curtos que cabem na escala (até 40 caracteres na abertura; duas frases de até 21 no título de seção).
- Plataformas de IA sempre na ordem Atlassian, CISP1, monday.com, com os logos oficiais de `assets/parceiros/`.
- Fechamento na noite com a assinatura "We Are AI-People Company." e a barra espectral.

## Documento e proposta (Word, Google Docs, PDF)

- Título em Manrope 800 na tinta #17233a; texto em DM Sans 400; rótulos em DM Sans 700, caixa normal.
- Logo colorido no cabeçalho, no tamanho mínimo ou acima; a barra espectral como divisor de capa ou de seção.
- Tabelas com linhas finas na cor de linha (#17233a a 12%) e cabeçalho em negrito, sem fundo colorido pesado.
- Separe o que é fato com fonte, conteúdo interno, hipótese e rascunho; nenhum número ou preço sem fonte.

## Imagem e post

- Fundo noite com a retícula de pontos (um ponto a cada 56px, a 9% de opacidade) ou folha clara; uma ideia por peça.
- Geometria apenas com os SVGs oficiais de `assets/geometria/`, na periferia, sem opacidade por cima do texto.
- Stickers e fotos do time são do tema Light: apenas em peça interna ou do Portal do A-Player.

## E-mail

- Clientes de e-mail não carregam fontes da web: o HTML de e-mail pode cair na fonte do sistema, mantendo cores, logo em PNG
  e as regras de escrita.
