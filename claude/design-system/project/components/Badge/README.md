# Selo e marca de tom

O selo numera uma sequência real. A marca de tom é o quadrado de 9px que diz a que plataforma ou papel um item pertence.

## Variações e classes

- **Selo numerado**: `.ap-badge`. Texto na cor da noite, algarismos tabulares.
- **Marca de tom**: `.ap-kicker · .ap-mark`

## Uso

### Faça
- Selo apenas quando a ordem for informação: etapas, cenas, passos.
- A marca de tom antes do rótulo, para dizer o tom do item.
### Evite
- Numerar itens que não são sequência.
- Trocar a marca de tom por barra lateral ou bolinha.

## O que você fornece

A folha da marca (`components/bundle.css`, a `css/aplayers.css` oficial) e o tom de cada item em `--ap-tone` (padrão `--ap-blue`). Copie a marcação da prévia e troque apenas o texto e o tom. Referência completa: https://aplayers-site-final.netlify.app/design-system/#componentes/selos.
