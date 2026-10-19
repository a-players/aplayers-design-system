# Graph

- Um gráfico único por tela, na noite, atrás do conteúdo. Retícula de pontos a cada 56px (2px, 9%), que acende em amarelo até 220px do cursor.
- Nós: polo (selo assimétrico de 14px com contorno a 6px, brilho e halo que respira), satélite (círculo de 8,4px com anel), poeira (1,6 a 3,6px). Em HTML: .ap-hub, .ap-hub--live, .ap-sat, .ap-dust, com --ap-size e --ap-tone.
- Ligações: ponte (polo a polo, 55%, 1,7px, curva), retorno (tracejado 4 e 6), polo (42%), árvore (22%), malha (13%). Pulsos: núcleo branco e halo da cor de origem, de 1,2 a 2,8s, em mistura aditiva.
- Respiração: cada nó orbita o seu lugar (3 a 10px); câmera gira devagar; profundidade com foco 900, até 42% de esmaecimento.
- Cursor como agente: atrai satélites e poeira até 170px, liga-se aos sete nós mais próximos (150px) com anel branco de 5px, mostra nomes até 120px. Perto de um grupo (polo a 150px, satélite a 90px, poeira a 50px), todos os satélites dele aparecem juntos e as ligações e o brilho do grupo sobem de leve. Os polos mostram o nome sempre; os nomes não se sobrepõem (o satélite tenta os dois lados, acima e abaixo, e senão espera a vez). Toda formação tem satélites com o que cada polo reúne. No toque, o site não move o gráfico.
- Troca de formação em ondas (16ms por grupo de 16 nós, até 160ms); na troca de página, explosão do ponto do clique e remontagem pela mola.
- Geometria em profundidade: .ap-geo[data-depth] desliza na rolagem (deslocamento = (centro do pai - meio da tela) × profundidade × -0,012), apenas acima de 1000px.
- Luz no espectro: .ap-run. Sticker que balança: .ap-sway (sobe 4px e gira 3 graus em 6,5s; --i desencontra os vizinhos).
- Cores: data-vivo-theme="night" (padrão), "day" (lado B: amarelo em traço fino #d4b106, gelo em cinza azulado, pulsos e anel na tinta) ou "auto" (segue o data-theme do html). Página inteira: .ap-vivo.ap-vivo--page, transparente, com o brilho alinhado à retícula do body; é o fundo de todas as vistas do Portal do A-Player.
- Com prefers-reduced-motion ou ?movimento=reduzido: desenho parado e completo, sem cursor nem pulsos.
- Satélites: uma palavra estratégica que define o polo, sem repetir sentido no mesmo gráfico; nomes de produto e de oferta ficam como são (Jira, Rovo, monday CRM, as Collections, as ofertas de Nossos serviços). Ligações podem fixar a curva com um quarto item (negativo curva para fora num anel em sentido horário), para o arco contornar o texto.
- Não mude as constantes do motor; troque a formação e as camadas. Inventário completo na rota #graph da documentação (o endereço antigo #vivo leva para lá).
