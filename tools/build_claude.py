# Gera, a partir dos arquivos oficiais deste Design System, o Design System da A-Players no Claude
# (um artefato do tipo "Design System" no claude.ai): tokens, brand book, componentes com prévia,
# padrões de página, o Graph, os grupos de assets e a capa.
#
# Fonte única: tokens/tokens.json, css/aplayers.css, css/docs.css, js/ap-vivo.js, llms.txt,
# index.html (as vitrines e as tabelas de escrita) e assets/. Nada é digitado de novo aqui.
#
# Uso (a partir da pasta do Design System):
#   python tools/build_claude.py --uploads   lista as imagens que ainda não foram enviadas ao artefato
#   python tools/build_claude.py             gera claude/design-system/project/ (pronto para publicar)
#
# As imagens (logos, ícones, geometria, stickers, fotos) ficam no armazenamento do artefato; os ids
# de cada envio ficam em claude/assets-map.json e são reaproveitados nas próximas gerações.
import datetime, io, json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import dsdoc  # noqa: E402

ROOT = dsdoc.ROOT
OUT = os.path.join(ROOT, 'claude', 'design-system', 'project')
MAP = os.path.join(ROOT, 'claude', 'assets-map.json')
STATE = os.path.join(ROOT, 'claude', 'design-system', 'state.json')
TITLE = 'A-Players Design System'
PUBLISHED = 'https://aplayers-site-final.netlify.app/design-system/'


def rd(rel):
    return io.open(os.path.join(ROOT, rel), encoding='utf-8').read()


def wr(rel, text):
    p = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    io.open(p, 'w', encoding='utf-8', newline='\n').write(text)


# ------------------------------------------------------------------ assets
GROUPS = [
    # grupo, pasta de origem, tamanho do quadro, nota de uso (README do grupo)
    ('Logos', 'assets/marca', 'l', 'As 16 assinaturas oficiais da A-Players (logo de 14/10/2026) e o símbolo. Escolha pelo fundo: '
     'colorido (claro, vertical-01) no claro; cores e escrita branca (escuro, site, vertical-02) no escuro; branco e amarelo '
     'sempre sobre o escuro; preto, azul, verde e vermelho conforme o fundo indicado em Logo. Nunca esticar, girar ou recolorir; '
     'proteção de metade da altura do símbolo. No site, a horizontal tem 36px de altura no cabeçalho.'),
    ('Geometria', 'assets/geometria', 'm', 'Os 15 SVGs oficiais de geometria. Apenas na periferia das composições, sem opacidade '
     'por cima e nunca atrás de texto. Na noite, a geometria já vem em azul noite; no dia (tema Light), em tons suaves.'),
    ('Parceiros', 'assets/parceiros', 'm', 'Logos oficiais das parceiras estratégicas, sempre na ordem Atlassian, CISP1, monday.com, '
     'com a mesma altura óptica (Atlassian 23px, CISP1 46px, monday.com 28px numa placa de 68 x 280px). As Collections da Atlassian '
     'usam o logo oficial, cada uma num quadro de 466 x 164; o par -dark é para o tema escuro.'),
    ('Produtos', 'assets/produtos', 's', 'Ícones oficiais das aplicações (Atlassian e monday.com), usados em chips, IA em destaque e '
     'atalhos do Portal. Sempre no tamanho do chip, sem azulejo extra para os ícones da Atlassian.'),
    ('Stickers', 'assets/stickers', 'm', 'Stickers do lado B (tema Light): apenas em peças internas e no Portal, nunca sobre rosto '
     'ou texto, nunca numa peça para o mercado.'),
    ('Fotos', 'assets/fotos', 'm', 'Fotos reais do time, para o Portal e peças internas. Gente de verdade, sem banco de imagens.'),
    ('Capas', 'assets/capas', 'm', 'Capas dos materiais oficiais (site, Design System), usadas no cartão de material do Portal.'),
]
ALWAYS = [  # enviados sempre, mesmo que nenhuma prévia use
    'assets/marca/*.svg', 'assets/geometria/*.svg', 'assets/stickers/*',
]
MIME = {'.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif'}


def group_of(rel):
    for g, folder, _, _ in GROUPS:
        if rel.startswith(folder + '/'):
            return g, rel[len(folder) + 1:]
    return None, None


def load_map():
    if os.path.exists(MAP):
        return json.load(io.open(MAP, encoding='utf-8'))
    return {}


# ------------------------------------------------------------------ tokens.json
PORTAL = {'ap-sheet': '#f5f2eb', 'ap-card': '#fffdf8', 'ap-card-2': '#f9f6f0', 'ap-field': '#fffdf8'}


def build_tokens():
    src = json.loads(rd('tokens/tokens.json'))
    colors, spacing, fam = [], [], {}

    def other(key, name, value, usage, note=None):
        f = fam.setdefault(key, {'tokens': []})
        if note:
            f['note'] = note
        f['tokens'].append({'name': name, 'value': value, 'usage': usage})

    for g, items in src.items():
        if g.startswith('$'):
            continue
        for n, t in items.items():
            name, v, desc = 'ap-' + n, t['$value'], t.get('$description', '')
            dark = (t.get('$extensions') or {}).get('tema-escuro')
            if g == 'alias':
                m = re.match(r'var\(--(ap-[a-z0-9-]+)\)', v)
                colors.append({'name': name, 'value': '{%s}' % m.group(1), 'usage': desc})
            elif t.get('$type') == 'color':
                val = {'original': v}
                if dark:
                    val['dark'] = dark
                if name in PORTAL:
                    val['portal'] = PORTAL[name]
                colors.append({'name': name, 'value': val if len(val) > 1 else v, 'usage': desc})
            elif g == 'espectro':
                other('gradient', name, v, desc)
            elif g == 'forma':
                other('corner', name, v, desc + ' Sempre assimétrico: cantos maiores no alto à esquerda e embaixo à direita.',
                      'Os cantos da marca são assimétricos (quatro valores). Use como border-radius.')
            elif g == 'espaco':
                if v.startswith('clamp('):
                    other('layout', name, v, desc, 'Medidas fluidas de página.')
                else:
                    spacing.append({'name': name, 'value': v, 'usage': desc})
            elif g == 'movimento':
                other('easing' if n.startswith('ease') else 'duration', name, v, desc)
            elif g == 'logo':
                other('logo', name, v, desc, 'Medidas do logo de 14/10/2026: proporções para aspect-ratio e proteção em fração da altura.')
            # tipo: vira type.groups (abaixo); --ap-title, --ap-text e --ap-t-* continuam na folha da marca
    shadow = {'tokens': [
        {'name': 'ap-plate-rest', 'value': '10px 10px 0 0 #3580c3', 'usage': 'Placa do cartão em repouso (.ap-plate): deslocada, sólida, no tom do item (aqui o azul). Troque a cor pelo --ap-tone do cartão.'},
        {'name': 'ap-plate-hover', 'value': '14px 14px 0 0 #3580c3', 'usage': 'Placa do cartão na interação: o cartão sobe e a placa cresce para 14px.'},
        {'name': 'ap-plate-small', 'value': '4px 4px 0 0 #f1e84e', 'usage': 'Placa de botão e de elemento pequeno em repouso (4px); 6px na interação. O botão principal leva a placa amarela.'},
        {'name': 'ap-island', 'value': '0 20px 44px -24px rgba(0, 0, 0, .7)', 'usage': 'Sombra da ilha do cabeçalho sobre a noite.'},
        {'name': 'ap-island-day', 'value': '0 18px 40px -26px rgba(13, 23, 40, .42)', 'usage': 'Sombra da ilha do dia (cabeçalho do Portal, tema Light).'},
    ]}
    tokens = {
        'name': TITLE, 'version': 1,
        'color': {'themes': [{'id': 'original', 'name': 'Original'}, {'id': 'dark', 'name': 'Dark'}, {'id': 'portal', 'name': 'Light (Portal)'}],
                  'tokens': colors},
        'type': {
            'fonts': [],
            'families': {'title': '"Manrope", system-ui, sans-serif', 'text': '"DM Sans", system-ui, sans-serif'},
            'groups': [
                {'name': 'Títulos', 'family': 'title', 'styles': [
                    {'name': 't-display', 'fontSize': '102px', 'lineHeight': 0.9, 'fontWeight': 780, 'letterSpacing': '-0.05em', 'sample': 'We Are AI-People Company.',
                     'usage': '.ap-display: abertura principal; clamp(54px, 7.1vw, 120px) (102px a 1440px), até 3 linhas de sentido (.ap-ln).'},
                    {'name': 't-h1', 'fontSize': '78px', 'lineHeight': 1, 'fontWeight': 800, 'letterSpacing': '-0.038em', 'sample': 'Faça a IA trabalhar onde o trabalho acontece.',
                     'usage': '.ap-h1: abertura de página; clamp(44px, 5.4vw, 88px), frase de até 40 caracteres em até 3 linhas.'},
                    {'name': 't-h2', 'fontSize': '62px', 'lineHeight': 1.02, 'fontWeight': 800, 'letterSpacing': '-0.035em', 'sample': 'Cada desafio pede uma combinação diferente.',
                     'usage': '.ap-h2: título de seção; clamp(36px, 4.3vw, 70px), duas frases de até 21 caracteres (.ap-ln2) ou uma de até 45.'},
                    {'name': 't-mid', 'fontSize': '42px', 'lineHeight': 1.06, 'fontWeight': 800, 'letterSpacing': '-0.03em', 'sample': 'Gente para entregar.',
                     'usage': '.ap-mid: título intermediário; clamp(28px, 2.9vw, 44px).'},
                    {'name': 't-h3', 'fontSize': '24px', 'lineHeight': 1.2, 'fontWeight': 700, 'letterSpacing': '-0.015em', 'sample': 'Escutar antes de propor',
                     'usage': '.ap-h3: título de cartão, numa linha.'},
                    {'name': 't-h4', 'fontSize': '17px', 'lineHeight': 1.3, 'fontWeight': 700, 'sample': 'Consultoria especializada',
                     'usage': '.ap-h4: título de item.'},
                ]},
                {'name': 'Texto', 'family': 'text', 'styles': [
                    {'name': 't-lead-label', 'fontSize': '18px', 'lineHeight': 1.45, 'fontWeight': 700, 'sample': 'O diferencial começa antes da IA.',
                     'usage': '.ap-lead-label: frase de destaque do apoio, até 36 caracteres.'},
                    {'name': 't-lead', 'fontSize': '18px', 'lineHeight': 1.6, 'fontWeight': 400, 'sample': 'Organizamos conhecimento, processos e aplicações para que a IA encontre a informação certa.',
                     'usage': '.ap-lead: texto de apoio (--ap-ink-2), até 140 caracteres.'},
                    {'name': 't-body', 'fontSize': '16px', 'lineHeight': 1.6, 'fontWeight': 400, 'sample': 'Especialistas em tecnologia para o seu time.',
                     'usage': 'Texto corrido (.ap-base), em --ap-ink sobre --ap-sheet ou --ap-card.'},
                    {'name': 't-small', 'fontSize': '15px', 'lineHeight': 1.55, 'fontWeight': 400, 'sample': 'Indicamos quando muitas equipes trabalham sobre o mesmo contexto.',
                     'usage': 'Texto de cartão e de nota.'},
                    {'name': 't-label', 'fontSize': '14px', 'lineHeight': 1.35, 'fontWeight': 700, 'sample': 'Escolha o seu desafio',
                     'usage': '.ap-label: rótulo em caixa normal, nunca caixa alta espaçada.'},
                    {'name': 't-kicker', 'fontSize': '13px', 'lineHeight': 1.3, 'fontWeight': 700, 'sample': 'Contexto corporativo',
                     'usage': '.ap-kicker: rótulo com a marca de tom de 9px antes.'},
                    {'name': 't-num', 'fontSize': '12px', 'lineHeight': 1, 'fontWeight': 700, 'sample': '01 02 03',
                     'usage': 'Número do selo (.ap-badge), apenas para sequência real.'},
                ]},
            ]},
        'spacing': {'tokens': spacing},
        'shadow': shadow,
    }
    tokens.update(fam)
    names = set()
    for k, f in tokens.items():
        if isinstance(f, dict) and 'tokens' in f:
            for t in f['tokens']:
                assert t['name'] not in names, t['name']
                names.add(t['name'])
    return tokens, names


# ------------------------------------------------------------------ folhas
def strip_dark_media(css):
    # remove os blocos @media (prefers-color-scheme: dark) {...}: no Claude o tema vem sempre por data-theme
    out, i = [], 0
    for m in re.finditer(r'@media \(prefers-color-scheme: dark\)\s*\{', css):
        if m.start() < i:
            continue
        depth, j = 1, m.end()
        while depth:
            c = css[j]
            depth += (c == '{') - (c == '}')
            j += 1
        out.append(css[i:m.start()])
        i = j
    out.append(css[i:])
    return ''.join(out)


FONTS = '@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@500..800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap");\n'


def build_bundle_css(names):
    css = rd('css/aplayers.css')
    tok = json.loads(rd('tokens/tokens.json'))
    keep = []
    for n, t in tok['tipo'].items():  # o que tokens.json não declara com o mesmo --nome
        keep.append('  --ap-%s: %s;' % (n, t['$value']))
    block = (':root {\n  color-scheme: light;\n' + '\n'.join(keep) + '\n}\n'
             ':root[data-theme="dark"] { color-scheme: dark; }\n')
    css, n = re.subn(r'/\* @tokens:start \*/.*?/\* @tokens:end \*/', lambda m: '/* tokens: tokens.json do Design System no Claude (tokens.css) */\n' + block, css, flags=re.S)
    assert n == 1
    css = strip_dark_media(css)
    for name in names:  # nenhum valor de tokens.json pode continuar declarado aqui (trocas por var(), como em .ap-day, ficam)
        assert not re.search(r'(?:^|;)\s*--%s:(?!\s*var\()' % re.escape(name), css, flags=re.M), name
    head = ('/* A-Players Design System: a folha da marca (css/aplayers.css), no Claude.\n'
            '   Gerada por tools/build_claude.py. Os valores dos tokens vêm de tokens.json; aqui ficam as classes ap-*. */\n')
    return FONTS + head + css


def build_stage_css():
    css = strip_dark_media(rd('css/docs.css'))
    extra = ('\n/* prévia no Claude: a vitrine sem a página da documentação em volta */\n'
             'html, body { margin: 0; overflow-x: hidden; }\n'
             'body { padding: 16px; background: var(--ap-sheet); color: var(--ap-ink); font: 400 16px/1.6 var(--ap-text); -webkit-font-smoothing: antialiased; }\n'
             'body::before, body::after { content: none !important; }\n'
             '.spec { margin-top: 0; }\n.spec + .spec { margin-top: 16px; }\n'
             '.spec__tools { display: none; }\n')
    return ('/* Vitrines do Design System (css/docs.css) para as prévias no Claude. Gerada por tools/build_claude.py. */\n'
            + css + extra)


# ------------------------------------------------------------------ componentes
COMPONENTS = [
    ('componentes-botoes', 'Button', 'Ações'), ('componentes-links', 'Link', 'Ações'),
    ('componentes-pill', 'Pill', 'Identidade'), ('componentes-selos', 'Badge', 'Identidade'),
    ('componentes-chips', 'Chip', 'Identidade'), ('componentes-placa', 'Plate', 'Identidade'),
    ('componentes-plataforma', 'PlatformCard', 'Cartões'), ('componentes-portas', 'DoorOffer', 'Cartões'),
    ('componentes-camadas', 'ThreeLayers', 'Cartões'), ('componentes-ia', 'AiApps', 'Cartões'),
    ('componentes-leituras', 'Post', 'Cartões'),
    ('componentes-abas', 'TabsNodes', 'Escolha e conteúdo'), ('componentes-listas', 'Lists', 'Escolha e conteúdo'),
    ('componentes-notas', 'Note', 'Escolha e conteúdo'), ('componentes-formularios', 'Form', 'Escolha e conteúdo'),
    ('componentes-preferencias', 'Preferences', 'Cabeçalho e avisos'), ('componentes-navegacao', 'Navigation', 'Cabeçalho e avisos'),
    ('componentes-avisos', 'Notices', 'Cabeçalho e avisos'),
    ('componentes-lado-b', 'DayPanel', 'Portal (tema Light)'), ('componentes-ilha-dia', 'PortalHeader', 'Portal (tema Light)'),
    ('componentes-cracha', 'IdCard', 'Portal (tema Light)'), ('componentes-agenda', 'EventTerm', 'Portal (tema Light)'),
    ('componentes-materiais', 'Material', 'Portal (tema Light)'), ('componentes-dialogo', 'Dialog', 'Portal (tema Light)'),
    ('padroes-abertura', 'Opening', 'Padrões de página'), ('padroes-folha', 'SheetOverNight', 'Padrões de página'),
    ('padroes-plataformas', 'AiPlatforms', 'Padrões de página'), ('padroes-mapa', 'ChoiceMap', 'Padrões de página'),
    ('padroes-fechamento', 'Closing', 'Padrões de página'),
]
IMG = re.compile(r'((?:src|href)=")((?:\.\./)?assets/[^"?#]+)(?:\?[^"]*)?(")')


def md_inline(html):
    s = re.sub(r'<strong>(.*?)</strong>', r'**\1**', html, flags=re.S)
    s = re.sub(r'<b>(.*?)</b>', r'**\1**', s, flags=re.S)
    s = re.sub(r'<code>(.*?)</code>', r'`\1`', s, flags=re.S)
    s = re.sub(r'<br\s*/?>', ' ', s)
    s = re.sub(r'<[^>]+>', '', s)
    s = s.replace('&nbsp;', ' ').replace('&#8209;', '-').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').replace('&quot;', '"')
    return re.sub(r'\s+', ' ', s).strip()


def html_table_md(t):
    head = [md_inline(x) for x in re.findall(r'<th[^>]*>(.*?)</th>', t, flags=re.S)]
    rows = [[md_inline(c).replace('|', '\\|') for c in re.findall(r'<td[^>]*>(.*?)</td>', r, flags=re.S)] for r in re.findall(r'<tr>(.*?)</tr>', t.split('<tbody>')[-1], flags=re.S)]
    out = ['| ' + ' | '.join(head) + ' |', '|' + '---|' * len(head)]
    out += ['| ' + ' | '.join(r) + ' |' for r in rows if r]
    return '\n'.join(out)


def rules_md(sec_html):
    out = []
    for title, body in re.findall(r'<p class="rule__title">(.*?)</p><ul>(.*?)</ul>', sec_html, flags=re.S):
        out.append('### ' + md_inline(title))
        out += ['- ' + md_inline(li) for li in re.findall(r'<li>(.*?)</li>', body, flags=re.S)]
    return '\n'.join(out)


def section_bits(text, els, sec):
    h = dsdoc.inner(text, sec)
    title = md_inline(re.search(r'<h2>(.*?)</h2>', h, flags=re.S).group(1))
    lead = re.search(r'<p class="ap-lead">(.*?)</p>', h, flags=re.S)
    lead = md_inline(lead.group(1)) if lead else ''
    specs = [e for e in els if dsdoc.within(sec, e) and 'spec' in dsdoc.classes(e)]
    return title, lead, specs, h


def rewrite_assets(html, amap, need):
    def rep(m):
        rel = m.group(2).replace('../', '')
        rec = amap.get(rel)
        if not rec:
            need.add(rel)
            return m.group(0)
        return m.group(1) + rec['url'] + m.group(3)
    return IMG.sub(rep, html)


def sprite(text):
    m = re.search(r'<svg width="0" height="0" style="position:absolute" aria-hidden="true">.*?</svg>', text, flags=re.S)
    return m.group(0)


def preview_doc(group, title, body, height=240, extra_head=''):
    return ('<!-- @dsCard group="%s" height=%d -->\n<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<title>%s</title>\n'
            '<link rel="stylesheet" href="../../components/docs-stage.css">\n%s</head>\n<body>\n%s\n</body>\n</html>\n') % (group, height, title, extra_head, body)


def build_components(text, els, amap, need):
    spr = sprite(text)
    cards = []
    for sid, comp, group in COMPONENTS:
        sec = [s for s in dsdoc.sections(text, els, sid) if s['attrs']['id'] == sid][0]
        title, lead, specs, h = section_bits(text, els, sec)
        body = '\n'.join(dsdoc.outer(text, e) for e in specs)
        body = rewrite_assets(body, amap, need)
        wr('components/%s/preview.html' % comp, preview_doc(group, title, spr + '\n' + body, 120 + 260 * len(specs)))
        bars = []
        for e in specs:
            bar = re.search(r'<div class="spec__bar">(.*?)</div>', dsdoc.outer(text, e), flags=re.S)
            if bar:
                parts = re.findall(r'<strong>(.*?)</strong>|<code>(.*?)</code>|<span>(.*?)</span>', bar.group(1), flags=re.S)
                st = next((md_inline(a) for a, b, c in parts if a), '')
                cd = ' · '.join('`%s`' % md_inline(b) for a, b, c in parts if b)
                sp = ' '.join(md_inline(c) for a, b, c in parts if c)
                bars.append('- **%s**%s%s' % (st, (': ' + cd) if cd else '', ('. ' + sp) if sp else ''))
        readme = ['# ' + title, '', lead or title + '.', '']
        if bars:
            readme += ['## Variações e classes', ''] + bars + ['']
        r = rules_md(h)
        if r:
            readme += ['## Uso', '', r, '']
        readme += ['## O que você fornece', '',
                   'A folha da marca (`components/bundle.css`, a `css/aplayers.css` oficial) e o tom de cada item em `--ap-tone` '
                   '(padrão `--ap-blue`). Copie a marcação da prévia e troque apenas o texto e o tom. Referência completa: %s#%s.' % (PUBLISHED, sid.replace('-', '/', 1)), '']
        wr('components/%s/README.md' % comp, '\n'.join(readme))
        cards.append((comp, group, title))
    # Graph: a prévia monta o motor do site (APVivo), carregado como biblioteca
    wr('components/Graph/preview.html', preview_doc('Graph', 'Graph',
       '<div id="g" class="ap-vivo" style="position:relative;height:380px;border-radius:var(--ap-r-card);overflow:hidden;background:var(--ap-night)"></div>\n'
       '<script>\n  APVivo.mount(document.getElementById("g"), { formation: "constellation", labels: "hubs" });\n</script>', 400))
    wr('components/Graph/README.md', '\n'.join([
        '# Graph', '', 'O gráfico vivo do site: pessoas, processos, plataformas, agentes e feedback que se reorganizam a cada página, sempre na noite e atrás do conteúdo.', '',
        '## Uso', '',
        '- Um gráfico por tela, atrás do conteúdo: `<div class="ap-vivo" data-vivo="constellation" style="height:560px">` e `js/ap-vivo.js` (aqui, `components/lib/ap-vivo.js`).',
        '- Formações: constellation, fronts, ecosystem, context, context-wide, cycle, flow, people, people-wide, teamwork, operation, cisp, calm.',
        '- Zona livre para o texto com `data-vivo-hole="x y largura altura"`; tema do dia com `data-vivo-theme="day"` (fundo `--ap-day`).',
        '- API: `APVivo.mount(el, { formation, labels, hole, theme })`, `g.set()`, `g.highlight()`, `g.burst()`.',
        '- Satélites: uma palavra estratégica por polo, sem repetir sentido; nomes de produto e de oferta ficam como são.',
        '- Não mude as constantes do motor; troque a formação e as camadas. Com movimento reduzido, o desenho fica parado.', '']))
    cards.append(('Graph', 'Graph', 'Graph'))
    return cards


# ------------------------------------------------------------------ brand book
def llms_sections():
    t = rd('llms.txt')
    parts = re.split(r'^## ', t, flags=re.M)
    intro, secs = parts[0], {}
    for p in parts[1:]:
        head, _, body = p.partition('\n')
        secs[head.strip()] = body.strip() + '\n'
    return intro, secs


def build_docs(text, els):
    intro, s = llms_sections()
    get = lambda k: next(v for h, v in s.items() if h.startswith(k))
    readme = [
        'A marca da A-Players em tokens, classes e regras: o padrão de tudo o que a A-Players cria (site, apresentação, material, '
        'produto, campanha). Este sistema é gerado do Design System oficial, publicado em ' + PUBLISHED + ', '
        'pelo script tools/build_claude.py. Quando algo diverge, vale o oficial.', '',
        '## Como usar este sistema', '',
        '- Cores, espaços, cantos, sombras e movimento: os tokens deste sistema, com os mesmos nomes do código (`--ap-blue`, `--ap-sheet`, `--ap-r-card`).',
        '- Três temas: **Original** (o padrão do site, para o mercado), **Dark** (a opção noite do site) e **Light (Portal)** (o dia do Portal do A-Player e das peças internas). No código, Original é `data-theme="light"`, Dark é `data-theme="dark"` e Light é `class="ap-day"` no contêiner.',
        '- Componentes: a folha `components/bundle.css` é a `css/aplayers.css` oficial; use as classes `ap-*` como nas prévias e troque o tom pelo `--ap-tone`.',
        '- Tipografia: Manrope nos títulos (`--ap-title`, de 700 a 800) e DM Sans no texto (`--ap-text`), pelo Google Fonts. Pill e rótulos em caixa normal.',
        '- Logos: o grupo Logos tem as 16 assinaturas oficiais e o símbolo; escolha pelo fundo e nunca redesenhe.',
        '- Escrita: pt-BR consultivo e direto, sem travessão; leia a seção Escrita antes de escrever qualquer texto.', '',
        '## Como montar uma peça', '', get('Como montar'),
        '## Tokens principais', '', get('Tokens principais'),
        '## Regras que não mudam', '', get('Regras que não mudam'),
    ]
    wr('README.md', '\n'.join(readme))
    order = [('01-Temas.md', 'Temas', 'Temas'), ('02-Logo.md', 'Logo', 'Logo'), ('03-Componentes.md', 'Componentes', 'Componentes (classes)'),
             ('04-Padroes.md', 'Padrões de página', 'Padrões de página'), ('05-Graph.md', 'Graph', 'Graph (a base da marca)')]
    for fn, head, key in order:
        wr(fn, '# %s\n\n%s' % (head, get(key.split(' (')[0])))
    # escrita: a regra do llms.txt e as tabelas oficiais de Padrões, Escrita
    esc = ['# Escrita', '', get('Escrita'), '']
    for sid in ('padroes-principios', 'padroes-pontuacao', 'padroes-vocabulario', 'padroes-nomes', 'padroes-interface'):
        sec = [x for x in dsdoc.sections(text, els, sid) if x['attrs']['id'] == sid][0]
        title, lead, _, h = section_bits(text, els, sec)
        esc += ['## ' + title, '', lead, '']
        for li in re.findall(r'<li><strong>(.*?)</strong><span>(.*?)</span></li>', h, flags=re.S):
            esc.append('- **%s**: %s' % (md_inline(li[0]), md_inline(li[1])))
        for t in re.findall(r'<table class="tbl">(.*?)</table>', h, flags=re.S):
            esc += ['', html_table_md(t)]
        note = re.findall(r'<p class="doc__note">(.*?)</p>', h, flags=re.S)
        esc += [''] + [md_inline(n) for n in note] + ['']
    wr('06-Escrita.md', '\n'.join(esc))
    wr('07-Antes-de-entregar.md', '# Antes de entregar\n\n' + get('Antes de entregar'))
    wr('08-Mapa-da-documentacao.md', '# Mapa da documentação\n\nO Design System oficial, com exemplos vivos e código: ' + PUBLISHED + '\n\n' + get('Mapa da documentação'))


# ------------------------------------------------------------------ capa
def build_cover():
    # capa no esqueleto de faixa no alto (o nome passa de 440px a 64px): a noite com a retícula e os quatro quartos do espectro
    dots = ''.join('<circle class="dot" cx="%d" cy="%d" r="1.7"/>' % (x, y) for y in (28, 56, 84) for x in range(28, 420, 28))
    wr('components/Cover/preview.html', """<!-- @dsCard height=288 -->
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>A-Players Design System</title>
<style>
  html, body { margin: 0; }
  body { background: var(--ap-sheet); color: var(--ap-ink); overflow: hidden; }
  .cover { position: relative; width: 960px; height: 288px; overflow: hidden; }
  .band { position: absolute; top: 0; left: 0; display: block; width: 960px; height: 112px; }
  .night { fill: var(--ap-ink); }
  .dot { fill: var(--ap-sheet); opacity: .42; }
  .blue { fill: var(--ap-blue); }
  .green { fill: var(--ap-green); }
  .red { fill: var(--ap-red); }
  .yellow { fill: var(--ap-yellow); }
  .words { position: absolute; left: 48px; bottom: 34px; }
  .name { margin: 0; font: 800 64px/.95 var(--ap-title); letter-spacing: -.04em; color: var(--ap-ink); white-space: nowrap; }
  .tag { margin: 12px 0 0 2px; max-width: 440px; font: 400 14px/20px var(--ap-text); color: var(--ap-ink-2); }
</style>
</head>
<body>
<div class="cover">
<svg class="band" viewBox="0 0 960 112" width="960" height="112" aria-hidden="true">
<!--
  blocks      a noite em --ap-ink (432x112, a laje escura; no Dark vira clara e continua contrastando) e os quatro quartos do espectro,
              --ap-blue 192, --ap-green 128, --ap-red 96, --ap-yellow 48 (sai pela direita), na ordem da marca
  arrangement faixa de ponta a ponta saindo pelo alto: a laje à esquerda, o espectro em larguras decrescentes, canto --ap-r-card (20 / 6) embaixo
  pattern     a retícula de pontos (--ap-grid 56px, aqui na metade): "precise, a dot grid at one spacing step", o fundo da noite do site,
              recortada da laje na cor do chão (--ap-sheet)
  scales      passo 28 (--ap-grid / 2); vão 16; cantos 20 e 6 (--ap-r-card); larguras em múltiplos de 16
-->
<path class="night" d="M0 0H432V92Q432 112 412 112H0Z"/>
""" + dots + """
<path class="blue" d="M448 0H640V92Q640 112 620 112H454Q448 112 448 106Z"/>
<path class="green" d="M656 0H784V92Q784 112 764 112H662Q656 112 656 106Z"/>
<path class="red" d="M800 0H896V92Q896 112 876 112H806Q800 112 800 106Z"/>
<path class="yellow" d="M912 0H960V112H918Q912 112 912 106Z"/>
</svg>
<div class="words">
<p class="name">A-Players Design System</p>
<p class="tag">We Are AI-People Company. Cor, forma, movimento e voz da marca.</p>
</div>
</div>
</body>
</html>
""")


# ------------------------------------------------------------------ índice
def build_index(amap, cards, now):
    st = json.load(io.open(STATE, encoding='utf-8')) if os.path.exists(STATE) else {}
    created = st.get('createdOnFiles') or {'v': 1, 'at': now}
    groups, ag = [], {}
    for g, folder, tile, note in GROUPS:
        recs = sorted(((r['name'], r) for rel, r in amap.items() if r['group'] == g), key=lambda x: x[0])
        if not recs:
            continue
        groups.append(g)
        files = {}
        for name, r in recs:
            key = re.sub(r'[^A-Za-z0-9_./-]', lambda m: ''.join('~%02x' % b for b in m.group(0).encode('utf-8')), name)
            files[key] = {'name': name, 'blob': r['id'], 'size': r['size'], 'type': r['type']}
        ag[g] = {'name': g, 'tile': tile, 'order': [n for n, _ in recs], 'files': files}
        wr('assets/%s/README.md' % g, '# %s\n\n%s\n' % (g, note))
    idx = {'v': 3, 'layout': 'files', 'createdOnFiles': created, 'title': TITLE, 'namespace': 'APlayers',
           'libraries': [{'name': 'ap-vivo', 'version': '1.1.0', 'global': 'APVivo', 'file': 'components/lib/ap-vivo.js'}],
           'sections': {}, 'groups': groups, 'assetGroups': ag, 'blobs': {}, 'docs': {'sections': []},
           'lastChange': {'by': 'Fernando', 'at': now, 'via': 'Claude Code · a-players/site-aplayers-final', 'note': 'Gerado do Design System oficial %s por tools/build_claude.py' % re.search(r'Versão ([\d.]+)', rd('llms.txt')).group(1)}}
    wr('design-system.json', json.dumps(idx, ensure_ascii=False, indent=2) + '\n')
    os.makedirs(os.path.dirname(STATE), exist_ok=True)
    io.open(STATE, 'w', encoding='utf-8', newline='\n').write(json.dumps({'createdOnFiles': created}, indent=2) + '\n')


def main():
    text, els = dsdoc.load()
    amap = load_map()
    need = set()
    import glob
    for pat in ALWAYS:
        for f in sorted(glob.glob(os.path.join(ROOT, pat))):
            rel = os.path.relpath(f, ROOT).replace(os.sep, '/')
            if os.path.splitext(rel)[1].lower() in MIME and rel not in amap:
                need.add(rel)
    if '--uploads' in sys.argv:
        # só a lista: quais imagens ainda faltam no armazenamento do artefato
        tmp = set()
        for sid, comp, group in COMPONENTS:
            sec = [s for s in dsdoc.sections(text, els, sid) if s['attrs']['id'] == sid][0]
            _, _, specs, _ = section_bits(text, els, sec)
            rewrite_assets('\n'.join(dsdoc.outer(text, e) for e in specs), amap, tmp)
        for rel in sorted(need | tmp):
            print(rel)
        return
    now = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z')
    tokens, names = build_tokens()
    wr('tokens.json', json.dumps(tokens, ensure_ascii=False, indent=2) + '\n')
    wr('components/bundle.css', build_bundle_css(names))
    wr('components/docs-stage.css', build_stage_css())
    wr('components/lib/ap-vivo.js', rd('js/ap-vivo.js'))
    cards = build_components(text, els, amap, need)
    build_docs(text, els)
    build_cover()
    build_index(amap, cards, now)
    if need:
        print('Faltam %d imagens no artefato (rode com --uploads e envie):' % len(need))
        for r in sorted(need):
            print('  ' + r)
    print('ok: %d componentes, %d tokens' % (len(cards), len(names)))


if __name__ == '__main__':
    main()
