# Fonte única dos tokens do A-Players Design System.
# Gera tokens/tokens.css, tokens/tokens.json e o bloco de tokens dentro de css/aplayers.css.
# Os valores vêm do site A-Players (site-aplayers/site-alternativo-claude/css/site.css, 01/10/2026),
# do Portal do A-Player (portal/css/hub.css, lado B, 02/10/2026) e dos arquivos oficiais do logo (A-Players/logos).
# Uso: python tools/build_tokens.py  (a partir da pasta do Design System)
import io, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# grupo -> [(nome, valor claro, valor escuro ou None, descrição)]
TOKENS = {
    'marca': [
        ('blue', '#3580c3', None, 'Azul A-Players. Primeiro quarto do espectro; ação principal, Atlassian, pessoas.'),
        ('blue-l', '#5fa6e3', None, 'Azul claro. Início do espectro fluido e foco de campo no tema escuro.'),
        ('green', '#6eb751', None, 'Verde A-Players. Segundo quarto do espectro; processo, sucesso.'),
        ('red', '#eb594d', None, 'Vermelho A-Players. Terceiro quarto do espectro; conexão, monday.com.'),
        ('yellow', '#f1e84e', None, 'Amarelo A-Players. Último quarto do espectro; sinal, foco sobre a noite, placa dos botões.'),
        ('violet', '#a18be8', None, 'Violeta de apoio. Feedback, CISP1, tema escuro. Não faz parte do espectro do logo.'),
        ('yellow-line', '#d4b106', '#f1e84e', 'Amarelo para traço fino sobre fundo claro (o amarelo da marca some em linha de 2px).'),
        ('logo-gray', '#706b69', None, 'Cinza do nome no logo colorido para fundo claro. Só existe no arquivo do logo: nunca em texto ou interface.'),
        ('logo-black', '#1d1d1b', None, 'Preto do logo de uma cor. Só existe no arquivo do logo.'),
    ],
    'superficie': [
        ('night', '#0d1728', None, 'A noite: fundo da marca, sempre escuro nos dois temas.'),
        ('night-2', '#111d32', None, 'Noite elevada: folhas noturnas, painéis.'),
        ('night-3', '#16253f', None, 'Noite mais alta: cartões sobre a noite.'),
        ('sheet', '#f2f6fb', '#111d32', 'Folha: a superfície de leitura que sobe sobre a noite.'),
        ('card', '#ffffff', '#172741', 'Cartão sobre a folha.'),
        ('card-2', '#f7f9fc', '#1d2f4d', 'Cartão secundário, etiquetas de etapa.'),
        ('field', '#ffffff', '#0f1a2e', 'Fundo de campo de formulário.'),
    ],
    'tinta': [
        ('ink', '#17233a', '#eaf0f8', 'Texto principal sobre folha e cartão.'),
        ('ink-2', '#4f5d73', '#a9b6ca', 'Texto de apoio, rótulos.'),
        ('line', 'rgba(23, 35, 58, .12)', 'rgba(255, 255, 255, .1)', 'Borda de cartão e divisória.'),
        ('line-strong', 'rgba(23, 35, 58, .24)', 'rgba(255, 255, 255, .2)', 'Borda de campo e etiqueta de etapa.'),
        ('on-night', '#ffffff', None, 'Texto principal sobre a noite.'),
        ('on-night-2', '#b7c2d3', None, 'Texto de apoio sobre a noite.'),
        ('night-line', 'rgba(255, 255, 255, .13)', None, 'Borda e divisória sobre a noite.'),
        ('error', '#b3261e', '#ff9a8f', 'Mensagem de erro de formulário.'),
    ],
    'espectro': [
        ('spectrum', 'linear-gradient(90deg, #3580c3 0 25%, #6eb751 25% 50%, #eb594d 50% 75%, #f1e84e 75% 100%)', None, 'Divisor espectral: quatro quartos de paradas duras, 2px.'),
        ('spectrum-flow', 'linear-gradient(90deg, #5fa6e3 0%, #6eb751 34%, #eb594d 67%, #f1e84e 100%)', None, 'Espectro fluido: progresso, trilhos e ligações.'),
    ],
    'lado-b': [
        ('day', '#ffffff', '#0f1a2e', 'O dia da marca: fundo do lado B (Portal do A-Player e peças internas), com a mesma retícula de 56px.'),
        ('day-dots', 'rgba(23, 35, 58, .075)', 'rgba(183, 194, 211, .075)', 'Pontos da retícula sobre o dia.'),
        ('soft-blue', '#e4eef9', '#1a3455', 'Azul suave: bloco no tom azul do lado B.'),
        ('soft-blue-2', '#cfe1f4', '#1e3f66', 'Azul suave mais forte: fundo de imagem e segundo plano do bloco azul.'),
        ('soft-green', '#e7f3e1', '#22393e', 'Verde suave.'),
        ('soft-green-2', '#d1eac6', '#2c4b40', 'Verde suave mais forte.'),
        ('soft-red', '#fde6e3', '#382b3d', 'Vermelho suave.'),
        ('soft-red-2', '#f9cfca', '#523140', 'Vermelho suave mais forte.'),
        ('soft-yellow', '#fbf6d0', '#2e393c', 'Amarelo suave.'),
        ('soft-yellow-2', '#f4eba1', '#444d3e', 'Amarelo suave mais forte.'),
        ('soft-violet', '#efebfc', '#2f365d', 'Violeta suave.'),
        ('soft-violet-2', '#ddd4f8', '#404372', 'Violeta suave mais forte.'),
    ],
    'texto-sobre-tom': [
        ('on-blue', '#ffffff', None, 'Texto grande sobre o azul (iniciais, selo da pessoa): branco.'),
        ('on-green', '#0d1728', None, 'Texto sobre o verde: noite.'),
        ('on-red', '#ffffff', None, 'Texto grande sobre o vermelho: branco.'),
        ('on-yellow', '#0d1728', None, 'Texto sobre o amarelo: noite.'),
        ('on-violet', '#0d1728', None, 'Texto sobre o violeta: noite.'),
    ],
    'tipo': [
        ('title', '"Manrope", system-ui, sans-serif', None, 'Títulos (H1 a H4, display, números grandes).'),
        ('text', '"DM Sans", system-ui, sans-serif', None, 'Texto, interface, rótulos, botões.'),
        ('t-display', 'clamp(54px, 7.1vw, 120px)', None, 'Display de abertura. Manrope 780, entrelinha .9, -0,05em.'),
        ('t-h1', 'clamp(44px, 5.4vw, 88px)', None, 'H1. Manrope 800, entrelinha 1, -0,038em.'),
        ('t-h2', 'clamp(36px, 4.3vw, 70px)', None, 'H2. Manrope 800, entrelinha 1,02, -0,035em.'),
        ('t-mid', 'clamp(28px, 2.9vw, 44px)', None, 'Título intermediário. Manrope 800.'),
        ('t-h3', '24px', None, 'H3. Manrope 700, entrelinha 1,2.'),
        ('t-h4', '17px', None, 'H4. Manrope 700, entrelinha 1,3.'),
        ('t-lead', '18px', None, 'Texto de apoio de abertura.'),
        ('t-body', '16px', None, 'Texto corrido. DM Sans 400, entrelinha 1,6.'),
        ('t-small', '15px', None, 'Texto de cartão.'),
        ('t-label', '14px', None, 'Rótulo. DM Sans 700, caixa normal.'),
        ('t-num', '12px', None, 'Números em selo. DM Sans 700, algarismos tabulares.'),
        ('w-night', '720', None, 'Peso dos títulos claros sobre a noite.'),
    ],
    'forma': [
        ('r-sheet', '48px 14px 48px 14px', None, 'Folha.'),
        ('r-card', '20px 6px 20px 6px', None, 'Cartão, placa, submenu, diálogo.'),
        ('r-path', '14px 4px 14px 4px', None, 'Caixa interna, item de lista, nota.'),
        ('r-pill', '12px 4px 12px 4px', None, 'Pill, filtros, seletores.'),
        ('r-action', '10px 3px 10px 3px', None, 'Botão, campo.'),
        ('r-badge', '9px 3px 9px 3px', None, 'Selo numerado, chip, etiqueta.'),
        ('r-mark', '3px 1px 3px 1px', None, 'Marca de tom (quadrado de 9px).'),
    ],
    'espaco': [
        ('grid', '56px', None, 'Módulo da retícula. O fundo da noite tem um ponto a cada 56px.'),
        ('wrap-w', '1320px', None, 'Largura do conteúdo (1480px acima de 1800px; 1680px acima de 2300px).'),
        ('gutter', 'clamp(20px, 4vw, 56px)', None, 'Margem lateral.'),
        ('gap-sec', 'clamp(104px, 11.5vw, 168px)', None, 'Distância entre seções numa folha.'),
        ('sheet-inset', 'clamp(6px, 1vw, 16px)', None, 'Recuo da folha em relação à tela.'),
        ('plate-sm', '4px', None, 'Placa deslocada pequena: botão no hover.'),
        ('plate-md', '6px', None, 'Placa deslocada média: aba, porta, logo de parceiro.'),
        ('plate', '10px', None, 'Placa deslocada padrão: cartão em repouso.'),
        ('plate-lg', '14px', None, 'Placa deslocada no hover do cartão.'),
    ],
    'movimento': [
        ('ease', 'cubic-bezier(.2, .7, .2, 1)', None, 'Curva padrão: interação, hover, troca de estado.'),
        ('ease-expo', 'cubic-bezier(.16, 1, .3, 1)', None, 'Curva de entrada: revelações, submenus, abertura.'),
        ('ease-curtain', 'cubic-bezier(.7, 0, .3, 1)', None, 'Curva da cortina entre páginas.'),
        ('dur-fast', '.2s', None, 'Cor, sublinhado.'),
        ('dur-base', '.3s', None, 'Placa, deslocamento de cartão.'),
        ('dur-slow', '.45s', None, 'Nós, seletores, trilhos.'),
        ('dur-enter', '.9s', None, 'Entrada orquestrada de uma abertura.'),
    ],
    'foco': [
        ('focus', '#f1e84e', None, 'Anel de foco sobre a noite (amarelo).'),
        ('focus-sheet', '#3580c3', '#f1e84e', 'Anel de foco sobre a folha (azul no claro, amarelo no escuro).'),
    ],
}

# plataformas de IA e papéis: valores que apontam para outros tokens
ALIASES = [
    ('front-atlassian', 'var(--ap-blue)', 'Tom da plataforma Atlassian.'),
    ('front-cisp1', 'var(--ap-violet)', 'Tom da plataforma CISP1.'),
    ('front-monday', 'var(--ap-red)', 'Tom da plataforma monday.com.'),
    ('role-pessoas', 'var(--ap-blue)', 'Papel no Context Graph: pessoas.'),
    ('role-processo', 'var(--ap-green)', 'Papel no Context Graph: processo.'),
    ('role-conexao', 'var(--ap-red)', 'Papel no Context Graph: conexão.'),
    ('role-sinal', 'var(--ap-yellow)', 'Papel no Context Graph: sinal.'),
    ('role-feedback', 'var(--ap-violet)', 'Papel no Context Graph: feedback.'),
    ('tone', 'var(--ap-blue)', 'Tom do componente. Troque por qualquer cor da marca no elemento.'),
    ('soft', 'var(--ap-soft-blue)', 'Tom suave do componente no lado B. As classes .ap-tone--* trocam tom e tom suave juntos.'),
    ('soft-2', 'var(--ap-soft-blue-2)', 'Segundo tom suave do componente no lado B.'),
    ('on-tone', 'var(--ap-on-blue)', 'Cor do texto sobre o tom do componente.'),
]

TYPES = {'marca': 'color', 'superficie': 'color', 'tinta': 'color', 'lado-b': 'color', 'texto-sobre-tom': 'color', 'espectro': 'gradient', 'tipo': 'typography',
         'forma': 'borderRadius', 'espaco': 'dimension', 'movimento': 'transition', 'foco': 'color'}


def css():
    light = ['  /* ' + g + ' */\n' + ''.join('  --ap-%s: %s;\n' % (n, v) for n, v, _, _ in items) for g, items in TOKENS.items()]
    light.append('  /* plataformas de IA, papéis e tom */\n' + ''.join('  --ap-%s: %s;\n' % (n, v) for n, v, _ in ALIASES))
    dark = ''.join('  --ap-%s: %s;\n' % (n, d) for items in TOKENS.values() for n, _, d, _ in items if d)
    return (':root {\n  color-scheme: light;\n' + '\n'.join(light) + '}\n'
            '/* tema escuro: segue o sistema até a pessoa escolher; data-theme vence nos dois sentidos */\n'
            '@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {\n    color-scheme: dark;\n'
            + ''.join('  ' + l + '\n' for l in dark.rstrip('\n').split('\n')) + '  }\n}\n'
            ':root[data-theme="dark"] {\n  color-scheme: dark;\n' + dark + '}\n')


def as_json():
    out = {'$description': 'A-Players Design System: tokens da marca (gerado por tools/build_tokens.py).'}
    for g, items in TOKENS.items():
        grp = out.setdefault(g, {})
        for n, v, d, desc in items:
            t = {'$value': v, '$type': TYPES[g], '$description': desc}
            if d:
                t['$extensions'] = {'tema-escuro': d}
            grp[n] = t
    out['alias'] = {n: {'$value': v, '$description': desc} for n, v, desc in ALIASES}
    return json.dumps(out, ensure_ascii=False, indent=2) + '\n'


def write(rel, text):
    p = os.path.join(ROOT, rel)
    io.open(p, 'w', encoding='utf-8', newline='\n').write(text)


block = css()
write('tokens/tokens.css', '/* A-Players Design System: tokens (gerado por tools/build_tokens.py; não edite à mão) */\n' + block)
write('tokens/tokens.json', as_json())
write('tokens/tokens.js', '/* A-Players Design System: tokens/tokens.json embutido para a documentação (gerado; não edite à mão) */\nwindow.APDS_TOKENS = ' + as_json().rstrip() + ';\n')
main = os.path.join(ROOT, 'css', 'aplayers.css')
if os.path.exists(main):
    src = io.open(main, encoding='utf-8').read()
    new, n = re.subn(r'(/\* @tokens:start \*/\n).*?(/\* @tokens:end \*/)', lambda m: m.group(1) + block + m.group(2), src, flags=re.S)
    assert n == 1, 'marcadores @tokens não encontrados em css/aplayers.css'
    io.open(main, 'w', encoding='utf-8', newline='\n').write(new)
print('tokens: %d + %d apelidos' % (sum(len(v) for v in TOKENS.values()), len(ALIASES)))
