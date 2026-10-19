# Graph

O gráfico vivo do site: pessoas, processos, plataformas, agentes e feedback que se reorganizam a cada página, sempre na noite e atrás do conteúdo.

## Uso

- Um gráfico por tela, atrás do conteúdo: `<div class="ap-vivo" data-vivo="constellation" style="height:560px">` e `js/ap-vivo.js` (aqui, `components/lib/ap-vivo.js`).
- Formações: constellation, fronts, ecosystem, context, context-wide, cycle, flow, people, people-wide, teamwork, operation, cisp, calm.
- Zona livre para o texto com `data-vivo-hole="x y largura altura"`; tema do dia com `data-vivo-theme="day"` (fundo `--ap-day`).
- API: `APVivo.mount(el, { formation, labels, hole, theme })`, `g.set()`, `g.highlight()`, `g.burst()`.
- Satélites: uma palavra estratégica por polo, sem repetir sentido; nomes de produto e de oferta ficam como são.
- Não mude as constantes do motor; troque a formação e as camadas. Com movimento reduzido, o desenho fica parado.
