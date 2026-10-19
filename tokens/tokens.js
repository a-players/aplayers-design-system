/* A-Players Design System: tokens/tokens.json embutido para a documentação (gerado; não edite à mão) */
window.APDS_TOKENS = {
  "$description": "A-Players Design System: tokens da marca (gerado por tools/build_tokens.py).",
  "marca": {
    "blue": {
      "$value": "#3580c3",
      "$type": "color",
      "$description": "Azul A-Players. Primeiro quarto do espectro; ação principal, Atlassian, pessoas."
    },
    "blue-l": {
      "$value": "#5fa6e3",
      "$type": "color",
      "$description": "Azul claro. Início do espectro fluido e foco de campo no tema escuro."
    },
    "green": {
      "$value": "#6eb751",
      "$type": "color",
      "$description": "Verde A-Players. Segundo quarto do espectro; processo, sucesso."
    },
    "red": {
      "$value": "#eb594d",
      "$type": "color",
      "$description": "Vermelho A-Players. Terceiro quarto do espectro; conexão, monday.com."
    },
    "yellow": {
      "$value": "#f1e84e",
      "$type": "color",
      "$description": "Amarelo A-Players. Último quarto do espectro; sinal, foco sobre a noite, placa dos botões."
    },
    "violet": {
      "$value": "#a18be8",
      "$type": "color",
      "$description": "Violeta de apoio. Feedback, CISP1, tema escuro. Não faz parte do espectro do logo."
    },
    "yellow-line": {
      "$value": "#d4b106",
      "$type": "color",
      "$description": "Amarelo para traço fino sobre fundo claro (o amarelo da marca some em linha de 2px).",
      "$extensions": {
        "tema-escuro": "#f1e84e"
      }
    },
    "logo-gray": {
      "$value": "#706b69",
      "$type": "color",
      "$description": "Cinza do nome A-PLAYERS no logo colorido para fundo claro. Existe apenas no arquivo do logo: nunca em texto ou interface."
    },
    "logo-gray-2": {
      "$value": "#625e5c",
      "$type": "color",
      "$description": "Cinza do descritor TECH KNOWLEDGE no logo colorido (logo de 14/10/2026). Existe apenas no arquivo do logo."
    },
    "logo-black": {
      "$value": "#000000",
      "$type": "color",
      "$description": "Preto do logo de uma cor (logo de 14/10/2026). Existe apenas no arquivo do logo."
    }
  },
  "superficie": {
    "night": {
      "$value": "#0d1728",
      "$type": "color",
      "$description": "A noite: fundo da marca, sempre escuro nos dois temas."
    },
    "night-2": {
      "$value": "#111d32",
      "$type": "color",
      "$description": "Noite elevada: folhas noturnas, painéis."
    },
    "night-3": {
      "$value": "#16253f",
      "$type": "color",
      "$description": "Noite mais alta: cartões sobre a noite."
    },
    "sheet": {
      "$value": "#f2f6fb",
      "$type": "color",
      "$description": "Folha: a superfície de leitura que sobe sobre a noite.",
      "$extensions": {
        "tema-escuro": "#111d32"
      }
    },
    "card": {
      "$value": "#ffffff",
      "$type": "color",
      "$description": "Cartão sobre a folha.",
      "$extensions": {
        "tema-escuro": "#172741"
      }
    },
    "card-2": {
      "$value": "#f7f9fc",
      "$type": "color",
      "$description": "Cartão secundário, etiquetas de etapa.",
      "$extensions": {
        "tema-escuro": "#1d2f4d"
      }
    },
    "field": {
      "$value": "#ffffff",
      "$type": "color",
      "$description": "Fundo de campo de formulário.",
      "$extensions": {
        "tema-escuro": "#0f1a2e"
      }
    }
  },
  "tinta": {
    "ink": {
      "$value": "#17233a",
      "$type": "color",
      "$description": "Texto principal sobre folha e cartão.",
      "$extensions": {
        "tema-escuro": "#eaf0f8"
      }
    },
    "ink-2": {
      "$value": "#4f5d73",
      "$type": "color",
      "$description": "Texto de apoio, rótulos.",
      "$extensions": {
        "tema-escuro": "#a9b6ca"
      }
    },
    "line": {
      "$value": "rgba(23, 35, 58, .12)",
      "$type": "color",
      "$description": "Borda de cartão e divisória.",
      "$extensions": {
        "tema-escuro": "rgba(255, 255, 255, .1)"
      }
    },
    "line-strong": {
      "$value": "rgba(23, 35, 58, .24)",
      "$type": "color",
      "$description": "Borda de campo e etiqueta de etapa.",
      "$extensions": {
        "tema-escuro": "rgba(255, 255, 255, .2)"
      }
    },
    "on-night": {
      "$value": "#ffffff",
      "$type": "color",
      "$description": "Texto principal sobre a noite."
    },
    "on-night-2": {
      "$value": "#b7c2d3",
      "$type": "color",
      "$description": "Texto de apoio sobre a noite."
    },
    "night-line": {
      "$value": "rgba(255, 255, 255, .13)",
      "$type": "color",
      "$description": "Borda e divisória sobre a noite."
    },
    "error": {
      "$value": "#b3261e",
      "$type": "color",
      "$description": "Mensagem de erro de formulário.",
      "$extensions": {
        "tema-escuro": "#ff9a8f"
      }
    }
  },
  "espectro": {
    "spectrum": {
      "$value": "linear-gradient(90deg, #3580c3 0 25%, #6eb751 25% 50%, #eb594d 50% 75%, #f1e84e 75% 100%)",
      "$type": "gradient",
      "$description": "Divisor espectral: quatro quartos de paradas duras, 2px."
    },
    "spectrum-flow": {
      "$value": "linear-gradient(90deg, #5fa6e3 0%, #6eb751 34%, #eb594d 67%, #f1e84e 100%)",
      "$type": "gradient",
      "$description": "Espectro fluido: progresso, trilhos e ligações."
    }
  },
  "lado-b": {
    "day": {
      "$value": "#f5f2eb",
      "$type": "color",
      "$description": "Tema Light: o dia da marca, fundo do Portal do A-Player e das peças internas (o off-white quente, \"osso\"), com a mesma retícula de 56px.",
      "$extensions": {
        "tema-escuro": "#0f1a2e"
      }
    },
    "day-dots": {
      "$value": "rgba(46, 40, 30, .085)",
      "$type": "color",
      "$description": "Tema Light: pontos da retícula sobre o dia.",
      "$extensions": {
        "tema-escuro": "rgba(183, 194, 211, .075)"
      }
    },
    "paper": {
      "$value": "#fffdf8",
      "$type": "color",
      "$description": "Tema Light: folha e cartão sobre o dia, um tom acima do fundo. Dentro de .ap-day ele vira o --ap-card.",
      "$extensions": {
        "tema-escuro": "#172741"
      }
    },
    "paper-2": {
      "$value": "#f9f6f0",
      "$type": "color",
      "$description": "Tema Light: cartão secundário sobre o dia. Dentro de .ap-day ele vira o --ap-card-2.",
      "$extensions": {
        "tema-escuro": "#1b2d4a"
      }
    },
    "glass": {
      "$value": "rgba(250, 248, 242, .84)",
      "$type": "color",
      "$description": "Tema Light: vidro do cabeçalho do Portal (.ap-island--day), com desfoque.",
      "$extensions": {
        "tema-escuro": "rgba(17, 29, 50, .84)"
      }
    },
    "soft-blue": {
      "$value": "#e4eef9",
      "$type": "color",
      "$description": "Azul suave: bloco no tom azul do lado B.",
      "$extensions": {
        "tema-escuro": "#1a3455"
      }
    },
    "soft-blue-2": {
      "$value": "#cfe1f4",
      "$type": "color",
      "$description": "Azul suave mais forte: fundo de imagem e segundo plano do bloco azul.",
      "$extensions": {
        "tema-escuro": "#1e3f66"
      }
    },
    "soft-green": {
      "$value": "#e7f3e1",
      "$type": "color",
      "$description": "Verde suave.",
      "$extensions": {
        "tema-escuro": "#22393e"
      }
    },
    "soft-green-2": {
      "$value": "#d1eac6",
      "$type": "color",
      "$description": "Verde suave mais forte.",
      "$extensions": {
        "tema-escuro": "#2c4b40"
      }
    },
    "soft-red": {
      "$value": "#fde6e3",
      "$type": "color",
      "$description": "Vermelho suave.",
      "$extensions": {
        "tema-escuro": "#382b3d"
      }
    },
    "soft-red-2": {
      "$value": "#f9cfca",
      "$type": "color",
      "$description": "Vermelho suave mais forte.",
      "$extensions": {
        "tema-escuro": "#523140"
      }
    },
    "soft-yellow": {
      "$value": "#fbf6d0",
      "$type": "color",
      "$description": "Amarelo suave.",
      "$extensions": {
        "tema-escuro": "#2e393c"
      }
    },
    "soft-yellow-2": {
      "$value": "#f4eba1",
      "$type": "color",
      "$description": "Amarelo suave mais forte.",
      "$extensions": {
        "tema-escuro": "#444d3e"
      }
    },
    "soft-violet": {
      "$value": "#efebfc",
      "$type": "color",
      "$description": "Violeta suave.",
      "$extensions": {
        "tema-escuro": "#2f365d"
      }
    },
    "soft-violet-2": {
      "$value": "#ddd4f8",
      "$type": "color",
      "$description": "Violeta suave mais forte.",
      "$extensions": {
        "tema-escuro": "#404372"
      }
    }
  },
  "logo": {
    "logo-ratio-h": {
      "$value": "1195.055 / 280",
      "$type": "number",
      "$description": "Proporção da assinatura horizontal (largura / altura), para aspect-ratio. O símbolo ocupa a altura toda: 2,80h, com h = altura do nome A-PLAYERS."
    },
    "logo-ratio-v": {
      "$value": "834.043 / 634",
      "$type": "number",
      "$description": "Proporção da assinatura vertical (largura / altura): caixa de 8,34h × 6,34h."
    },
    "logo-clear-h": {
      "$value": ".5",
      "$type": "number",
      "$description": "Área de proteção da horizontal, em fração da altura da assinatura: metade da altura do símbolo (1,40h) em todo o contorno."
    },
    "logo-clear-v": {
      "$value": ".3155",
      "$type": "number",
      "$description": "Área de proteção da vertical, em fração da altura da assinatura: metade da altura do símbolo (2,00h) em todo o contorno."
    },
    "logo-h-header": {
      "$value": "36px",
      "$type": "number",
      "$description": "Altura do logo horizontal no cabeçalho do site e do Design System (152px de largura; no celular, 32px e 136px)."
    }
  },
  "texto-sobre-tom": {
    "on-blue": {
      "$value": "#ffffff",
      "$type": "color",
      "$description": "Texto grande sobre o azul (iniciais, selo da pessoa): branco."
    },
    "on-green": {
      "$value": "#0d1728",
      "$type": "color",
      "$description": "Texto sobre o verde: noite."
    },
    "on-red": {
      "$value": "#ffffff",
      "$type": "color",
      "$description": "Texto grande sobre o vermelho: branco."
    },
    "on-yellow": {
      "$value": "#0d1728",
      "$type": "color",
      "$description": "Texto sobre o amarelo: noite."
    },
    "on-violet": {
      "$value": "#0d1728",
      "$type": "color",
      "$description": "Texto sobre o violeta: noite."
    }
  },
  "tipo": {
    "title": {
      "$value": "\"Manrope\", system-ui, sans-serif",
      "$type": "typography",
      "$description": "Títulos (H1 a H4, display, números grandes)."
    },
    "text": {
      "$value": "\"DM Sans\", system-ui, sans-serif",
      "$type": "typography",
      "$description": "Texto, interface, rótulos, botões."
    },
    "t-display": {
      "$value": "clamp(54px, 7.1vw, 120px)",
      "$type": "typography",
      "$description": "Display de abertura. Manrope 780, entrelinha .9, -0,05em."
    },
    "t-h1": {
      "$value": "clamp(44px, 5.4vw, 88px)",
      "$type": "typography",
      "$description": "H1. Manrope 800, entrelinha 1, -0,038em."
    },
    "t-h2": {
      "$value": "clamp(36px, 4.3vw, 70px)",
      "$type": "typography",
      "$description": "H2. Manrope 800, entrelinha 1,02, -0,035em."
    },
    "t-mid": {
      "$value": "clamp(28px, 2.9vw, 44px)",
      "$type": "typography",
      "$description": "Título intermediário. Manrope 800."
    },
    "t-h3": {
      "$value": "24px",
      "$type": "typography",
      "$description": "H3. Manrope 700, entrelinha 1,2."
    },
    "t-h4": {
      "$value": "17px",
      "$type": "typography",
      "$description": "H4. Manrope 700, entrelinha 1,3."
    },
    "t-lead": {
      "$value": "18px",
      "$type": "typography",
      "$description": "Texto de apoio de abertura."
    },
    "t-body": {
      "$value": "16px",
      "$type": "typography",
      "$description": "Texto corrido. DM Sans 400, entrelinha 1,6."
    },
    "t-small": {
      "$value": "15px",
      "$type": "typography",
      "$description": "Texto de cartão."
    },
    "t-label": {
      "$value": "14px",
      "$type": "typography",
      "$description": "Rótulo. DM Sans 700, caixa normal."
    },
    "t-num": {
      "$value": "12px",
      "$type": "typography",
      "$description": "Números em selo. DM Sans 700, algarismos tabulares."
    },
    "w-night": {
      "$value": "720",
      "$type": "typography",
      "$description": "Peso dos títulos claros sobre a noite."
    }
  },
  "forma": {
    "r-sheet": {
      "$value": "48px 14px 48px 14px",
      "$type": "borderRadius",
      "$description": "Folha."
    },
    "r-card": {
      "$value": "20px 6px 20px 6px",
      "$type": "borderRadius",
      "$description": "Cartão, placa, submenu, diálogo."
    },
    "r-path": {
      "$value": "14px 4px 14px 4px",
      "$type": "borderRadius",
      "$description": "Caixa interna, item de lista, nota."
    },
    "r-pill": {
      "$value": "12px 4px 12px 4px",
      "$type": "borderRadius",
      "$description": "Pill, filtros, seletores."
    },
    "r-action": {
      "$value": "10px 3px 10px 3px",
      "$type": "borderRadius",
      "$description": "Botão, campo."
    },
    "r-badge": {
      "$value": "9px 3px 9px 3px",
      "$type": "borderRadius",
      "$description": "Selo numerado, chip, etiqueta."
    },
    "r-mark": {
      "$value": "3px 1px 3px 1px",
      "$type": "borderRadius",
      "$description": "Marca de tom (quadrado de 9px)."
    }
  },
  "espaco": {
    "grid": {
      "$value": "56px",
      "$type": "dimension",
      "$description": "Módulo da retícula. O fundo da noite tem um ponto a cada 56px."
    },
    "wrap-w": {
      "$value": "1320px",
      "$type": "dimension",
      "$description": "Largura do conteúdo (1480px acima de 1800px; 1680px acima de 2300px)."
    },
    "gutter": {
      "$value": "clamp(20px, 4vw, 56px)",
      "$type": "dimension",
      "$description": "Margem lateral."
    },
    "gap-sec": {
      "$value": "clamp(104px, 11.5vw, 168px)",
      "$type": "dimension",
      "$description": "Distância entre seções numa folha."
    },
    "sheet-inset": {
      "$value": "clamp(6px, 1vw, 16px)",
      "$type": "dimension",
      "$description": "Recuo da folha em relação à tela."
    },
    "plate-sm": {
      "$value": "4px",
      "$type": "dimension",
      "$description": "Placa deslocada pequena: botão no hover."
    },
    "plate-md": {
      "$value": "6px",
      "$type": "dimension",
      "$description": "Placa deslocada média: aba, porta, logo de parceiro."
    },
    "plate": {
      "$value": "10px",
      "$type": "dimension",
      "$description": "Placa deslocada padrão: cartão em repouso."
    },
    "plate-lg": {
      "$value": "14px",
      "$type": "dimension",
      "$description": "Placa deslocada no hover do cartão."
    }
  },
  "movimento": {
    "ease": {
      "$value": "cubic-bezier(.2, .7, .2, 1)",
      "$type": "transition",
      "$description": "Curva padrão: interação, hover, troca de estado."
    },
    "ease-expo": {
      "$value": "cubic-bezier(.16, 1, .3, 1)",
      "$type": "transition",
      "$description": "Curva de entrada: revelações, submenus, abertura."
    },
    "ease-curtain": {
      "$value": "cubic-bezier(.7, 0, .3, 1)",
      "$type": "transition",
      "$description": "Curva da cortina entre páginas."
    },
    "dur-fast": {
      "$value": ".2s",
      "$type": "transition",
      "$description": "Cor, sublinhado."
    },
    "dur-base": {
      "$value": ".3s",
      "$type": "transition",
      "$description": "Placa, deslocamento de cartão."
    },
    "dur-slow": {
      "$value": ".45s",
      "$type": "transition",
      "$description": "Nós, seletores, trilhos."
    },
    "dur-enter": {
      "$value": ".9s",
      "$type": "transition",
      "$description": "Entrada orquestrada de uma abertura."
    }
  },
  "foco": {
    "focus": {
      "$value": "#f1e84e",
      "$type": "color",
      "$description": "Anel de foco sobre a noite (amarelo)."
    },
    "focus-sheet": {
      "$value": "#3580c3",
      "$type": "color",
      "$description": "Anel de foco sobre a folha (azul no claro, amarelo no escuro).",
      "$extensions": {
        "tema-escuro": "#f1e84e"
      }
    }
  },
  "alias": {
    "front-atlassian": {
      "$value": "var(--ap-blue)",
      "$description": "Tom da plataforma Atlassian."
    },
    "front-cisp1": {
      "$value": "var(--ap-violet)",
      "$description": "Tom da plataforma CISP1."
    },
    "front-monday": {
      "$value": "var(--ap-red)",
      "$description": "Tom da plataforma monday.com."
    },
    "role-pessoas": {
      "$value": "var(--ap-blue)",
      "$description": "Papel no Context Graph: pessoas."
    },
    "role-processo": {
      "$value": "var(--ap-green)",
      "$description": "Papel no Context Graph: processo."
    },
    "role-conexao": {
      "$value": "var(--ap-red)",
      "$description": "Papel no Context Graph: conexão."
    },
    "role-sinal": {
      "$value": "var(--ap-yellow)",
      "$description": "Papel no Context Graph: sinal."
    },
    "role-feedback": {
      "$value": "var(--ap-violet)",
      "$description": "Papel no Context Graph: feedback."
    },
    "tone": {
      "$value": "var(--ap-blue)",
      "$description": "Tom do componente. Troque por qualquer cor da marca no elemento."
    },
    "soft": {
      "$value": "var(--ap-soft-blue)",
      "$description": "Tom suave do componente no lado B. As classes .ap-tone--* trocam tom e tom suave juntos."
    },
    "soft-2": {
      "$value": "var(--ap-soft-blue-2)",
      "$description": "Segundo tom suave do componente no lado B."
    },
    "on-tone": {
      "$value": "var(--ap-on-blue)",
      "$description": "Cor do texto sobre o tom do componente."
    }
  }
};
