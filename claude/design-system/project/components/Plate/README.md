# Placa

A base de todo cartão: fundo de cartão, borda fina, canto de cartão e a placa do tom. Como link, ela sobe e afunda.

## Variações e classes

- **Placa**: `.ap-plate · a.ap-plate · --flat`
- **Placa pequena**: `.ap-plate--sm · .is-on`. 4px em repouso, 6px na interação.

## Uso

### Faça
- Placa proporcional ao tamanho: 10px e 14px apenas em cartão; aba, nó, atalho e ação curta com 4 a 6px.
- Na interação, o elemento sobe 2px (pequeno) ou 3px (cartão) enquanto a placa cresce.
### Evite
- Placa de cartão num elemento do tamanho de um botão: ela fica longe do fundo e pesa mais que o texto.

## O que você fornece

A folha da marca (`components/bundle.css`, a `css/aplayers.css` oficial) e o tom de cada item em `--ap-tone` (padrão `--ap-blue`). Copie a marcação da prévia e troque apenas o texto e o tom. Referência completa: https://aplayers-site-final.netlify.app/design-system/#componentes/placa.
