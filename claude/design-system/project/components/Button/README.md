# Botões

O botão principal é azul e ganha a placa amarela no hover; no clique, afunda. Sobre a noite, quando o azul já está no cabeçalho, o principal fica branco. O texto diz o que acontece.

## Variações e classes

- **Sobre a folha**: `.ap-btn · --line · --ink · --sm`
- **Sobre a noite**: `.ap-btn--light · --ghost`. A dupla da abertura da Home.

## Uso

### Faça
- Um botão principal por área; o segundo em `--ghost` (noite) ou `--line` (folha).
- Na abertura sobre a noite, com o "Vamos conversar" azul no cabeçalho, o principal é o claro (`--light`): branco com a placa amarela.
- Rótulo que diz o destino ou a ação: "Nossos serviços", "Explorar Atlassian", "Enviar mensagem".
### Evite
- Seta ou símbolo no fim do texto.
- "Clique aqui", "Saiba mais" sem dizer o quê.
- Dois botões azuis lado a lado.
- Botão de envio esticado na largura do formulário: ele fica no tamanho padrão.

## O que você fornece

A folha da marca (`components/bundle.css`, a `css/aplayers.css` oficial) e o tom de cada item em `--ap-tone` (padrão `--ap-blue`). Copie a marcação da prévia e troque apenas o texto e o tom. Referência completa: https://aplayers-site-final.netlify.app/design-system/#componentes/botoes.
