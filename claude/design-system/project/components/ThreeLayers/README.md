# Três camadas

A estratégia de uma plataforma em uma leitura: o que entra, o núcleo em destaque e o que ele entrega, ligados por um fio do tom. O núcleo traz um desenho vivo do que a plataforma faz.

## Variações e classes

- **Três camadas**: `.ap-layer3 · .is-core · .ap-layer3__apps · .ap-layer3__art[data-weave]`. O código mostra a da monday.com.

## Uso

### Faça
- Um desenho por plataforma, que mostra o que ela faz: fios que correm juntos (Atlassian), pulsos que atravessam o núcleo (CISP1), um quadro de status que muda (monday.com).
- Movimento apenas enquanto a caixa está na tela (`[data-weave]` liga `.is-live`), começando já no meio do ciclo.
### Evite
- Desenho que apenas decora, sem relação com a plataforma.
- Movimento com `prefers-reduced-motion` ou `?movimento=reduzido`: o desenho fica parado e completo.

## O que você fornece

A folha da marca (`components/bundle.css`, a `css/aplayers.css` oficial) e o tom de cada item em `--ap-tone` (padrão `--ap-blue`). Copie a marcação da prévia e troque apenas o texto e o tom. Referência completa: https://aplayers-site-final.netlify.app/design-system/#componentes/camadas.
