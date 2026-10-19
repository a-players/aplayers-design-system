#!/usr/bin/env python3
# Gera a skill aplayers-brand (claude/skill/aplayers-brand/) a partir deste Design System: SKILL.md, referências
# (llms.txt, tokens, escrita, componentes com marcação, logos), a folha e o motor oficiais, os logos e o verificador.
#
#   python tools/build_skill.py           gera a pasta da skill
#   python tools/build_skill.py --zip     gera também claude/skill/aplayers-brand.zip (para enviar em Configurações > Skills)
#
# A skill não tem fonte própria: tudo vem de llms.txt, tokens/tokens.json, css/aplayers.css, js/ap-vivo.js, index.html
# (vitrines) e assets/. Rode depois de qualquer mudança no Design System, junto com tools/build_claude.py.
import io, json, os, re, shutil, sys, textwrap, zipfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import dsdoc, build_claude as bc

ROOT = dsdoc.ROOT
OUT = os.path.join(ROOT, 'claude', 'skill', 'aplayers-brand')
NAME = 'aplayers-brand'


def rd(rel):
    return io.open(os.path.join(ROOT, rel), encoding='utf-8').read()


def wr(rel, text):
    p = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    io.open(p, 'w', encoding='utf-8', newline='\n').write(text)


def version():
    m = re.search(r'Versão ([\d.]+), (\d\d/\d\d/\d{4})', rd('llms.txt'))
    return m.group(1), m.group(2)


# ------------------------------------------------------------------ tokens.md
GROUP_TITLES = {'marca': 'Marca', 'superficie': 'Superfícies', 'tinta': 'Tinta', 'espectro': 'Espectro', 'lado-b': 'Tema Light (Portal)',
                'logo': 'Logo', 'texto-sobre-tom': 'Texto sobre o tom', 'tipo': 'Tipografia', 'forma': 'Forma (cantos)', 'espaco': 'Espaço',
                'movimento': 'Movimento', 'foco': 'Foco', 'alias': 'Apelidos (aliases)'}


def tokens_md():
    src = json.loads(rd('tokens/tokens.json'))
    out = ['# Tokens da A-Players', '',
           'Todos os tokens do Design System, com o valor em cada tema. Em CSS, use sempre `var(--ap-<nome>)` (a folha '
           '`assets/css/aplayers.css` já declara todos). Fora do CSS (PowerPoint, Word, imagem), use o valor da coluna do tema da peça.', '',
           '- **Original**: o padrão do site e de tudo o que o mercado vê (`data-theme="light"` ou sem atributo).',
           '- **Dark**: a opção noite do site (`data-theme="dark"`). Vazio = igual ao Original.',
           '- **Light (Portal)**: o dia do Portal do A-Player e das peças internas (`class="ap-day"` no contêiner). Vazio = igual ao Original.', '']
    for g, items in src.items():
        if g.startswith('$'):
            continue
        out += ['## ' + GROUP_TITLES.get(g, g), '', '| Token | Original | Dark | Light (Portal) | Uso |', '|---|---|---|---|---|']
        for n, t in items.items():
            name = '--ap-' + n
            v = t['$value']
            dark = (t.get('$extensions') or {}).get('tema-escuro', '')
            portal = bc.PORTAL.get('ap-' + n, '')
            cell = lambda x: ('`%s`' % x.replace('|', '\\|')) if x else ''
            out.append('| `%s` | %s | %s | %s | %s |' % (name, cell(v), cell(dark), cell(portal), (t.get('$description') or '').replace('|', '\\|')))
        out.append('')
    return '\n'.join(out)


# ------------------------------------------------------------------ componentes.md
def skill_asset(path):
    # caminho de imagem do Design System -> caminho dentro da skill (assets/<pasta>/<arquivo>)
    return re.sub(r'^(\.\./)?assets/', 'assets/', path.split('?')[0])


def stage_markup(spec_html):
    m = re.search(r'<div class="spec__stage[^"]*"[^>]*>(.*)</div>\s*<div class="spec__bar">', spec_html, flags=re.S)
    body = m.group(1) if m else spec_html
    body = bc.IMG.sub(lambda mm: mm.group(1) + skill_asset(mm.group(2)) + mm.group(3), body)
    body = re.sub(r'href="#(componentes|padroes|fundamentos|graph|recursos)/[^"]*"', 'href="#"', body)
    body = textwrap.dedent(body.strip('\n')).strip()
    return body


def stage_kind(spec_html):
    m = re.search(r'<div class="spec__stage([^"]*)"', spec_html)
    k = m.group(1) if m else ''
    if '--night' in k:
        return 'sobre a noite (`.ap-night` ou o fundo `--ap-night`)'
    if 'day' in k:
        return 'no tema Light (`.ap-day`)'
    return 'sobre a folha (`.ap-sheet`)'


def componentes_md(text, els):
    out = ['# Componentes da A-Players (classes e marcação)', '',
           'Cada componente vem da folha oficial `assets/css/aplayers.css`. Copie a marcação, troque apenas o texto e o tom '
           '(`style="--ap-tone: var(--ap-green)"`), e não reescreva o componente com CSS próprio. As imagens apontam para '
           '`assets/` desta skill: copie os arquivos para junto da peça (ou incorpore como data URI num artefato de arquivo único). '
           'Nos exemplos com geometria (`.ap-geo`), o contêiner (a noite ou a folha) precisa de `position: relative` e `overflow: hidden`, '
           'como no Design System; sem isso a forma passa da borda e cria rolagem lateral.', '',
           '## Símbolos SVG', '',
           'Pills, setas e ícones usam os símbolos abaixo (`<use href="#tris"/>` e afins). Cole este bloco uma vez, logo depois de `<body>`.', '',
           '```html', bc.sprite(text), '```', '']
    for sid, comp, group in bc.COMPONENTS:
        sec = [s for s in dsdoc.sections(text, els, sid) if s['attrs']['id'] == sid][0]
        title, lead, specs, h = bc.section_bits(text, els, sec)
        out += ['## %s · %s' % (title, group), '', lead, '']
        r = bc.rules_md(h)
        if r:
            out += [re.sub(r'^### (.*)$', r'**\1**', r, flags=re.M), '']
        for e in specs:
            o = dsdoc.outer(text, e)
            bar = re.search(r'<div class="spec__bar">(.*?)</div>', o, flags=re.S)
            label = ''
            if bar:
                parts = re.findall(r'<strong>(.*?)</strong>|<code>(.*?)</code>|<span>(.*?)</span>', bar.group(1), flags=re.S)
                st = next((bc.md_inline(a) for a, b, c in parts if a), '')
                cd = ' · '.join('`%s`' % bc.md_inline(b) for a, b, c in parts if b)
                sp = ' '.join(bc.md_inline(c) for a, b, c in parts if c)
                label = '**%s**%s%s' % (st, (': ' + cd) if cd else '', ('. ' + sp) if sp else '')
            out += ['### ' + (re.sub(r'\*\*(.*?)\*\*.*', r'\1', label) or title), '', label + ' Fundo: ' + stage_kind(o) + '.', '',
                    '```html', stage_markup(o), '```', '']
    # índice no alto (o arquivo é longo) e as classes de composição dos exemplos, que vêm de css/docs.css
    toc = ['## Índice', ''] + ['- %s' % l[3:] for l in out if l.startswith('## ') and l != '## Índice'] + ['- Graph · o gráfico vivo', '']
    out[4:4] = toc
    defined = set(re.findall(r'\.([a-zA-Z][\w-]*)', rd('css/aplayers.css')))
    used = set(c for code in re.findall(r'```html\n(.*?)```', '\n'.join(out), flags=re.S) for cl in re.findall(r'class="([^"]+)"', code) for c in cl.split())
    helpers = sorted(c for c in used - defined if not c.startswith('spec'))
    out += ['## Classes de composição dos exemplos', '',
            'Alguns exemplos usam classes de composição da própria documentação (%s). Elas não são componentes da marca: estão em '
            '`assets/css/exemplos.css` para o exemplo funcionar igual; numa peça, a composição (grade, colunas, espaços) é da folha da peça.'
            % ', '.join('`.%s`' % c for c in helpers), '']
    wr('assets/css/exemplos.css', '/* Classes de composição dos exemplos de references/componentes.md, extraídas de css/docs.css do Design System. */\n'
       + pick_css(rd('css/docs.css'), helpers))
    out += ['## Graph · o gráfico vivo', '',
            'O motor oficial é `assets/js/ap-vivo.js` (global `APVivo`). Um contêiner `.ap-vivo` recebe o canvas atrás do conteúdo:', '',
            '```html', '<div class="ap-vivo" data-vivo="constellation" style="position:relative;height:560px"></div>',
            '<script src="assets/js/ap-vivo.js"></script>', '```', '',
            'Formações, camadas, zona livre (`data-vivo-hole`) e API: seção Graph de `references/llms.txt`.', '']
    return '\n'.join(out)


def css_blocks(css):
    out, i = [], 0
    while True:
        j = css.find('{', i)
        if j < 0:
            return out
        depth, k = 1, j + 1
        while depth:
            depth += (css[k] == '{') - (css[k] == '}')
            k += 1
        out.append((re.split(r'[;}]', css[i:j])[-1].strip(), css[j + 1:k - 1]))
        i = k


def pick_css(css, classes):
    # as regras (e os @media/@supports em volta) cujo seletor usa alguma das classes
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    res = []
    for pre, body in css_blocks(css):
        if pre.startswith('@'):
            inner = pick_css(body, classes)
            if inner:
                res.append('%s {\n%s}\n' % (pre, inner))
        elif any(re.search(r'\.%s(?![\w-])' % re.escape(c), pre) for c in classes):
            res.append('%s { %s }\n' % (pre, ' '.join(body.split())))
    return ''.join(res)


# ------------------------------------------------------------------ logo.md
def logo_md():
    m = json.loads(rd('assets/marca/marca.json'))
    out = ['# Logo da A-Players', '',
           'Assinaturas oficiais de %s. Use sempre os arquivos de `assets/marca/` (SVG para HTML e impressão; PNG de 2400px '
           'transparente para PowerPoint, Word, Google Slides e imagens). Nunca redesenhe, estique, gire ou recolora.' % m.get('atualizado', ''), '',
           '## Qual arquivo usar', '', '| Versão | Layout | Fundo | SVG | PNG |', '|---|---|---|---|---|']
    for v in m.get('versoes', []):
        out.append('| %s | %s | %s | `%s` | `%s` |' % (v.get('versao', ''), v.get('layout', ''), v.get('fundos', ''),
                                                      skill_asset(v.get('svg', '')), skill_asset(v.get('png', '')) if v.get('png') else ''))
    out += ['', '## Regras', '']
    for k in ('simbolo', 'assinatura', 'protecao'):
        if m.get(k):
            out.append('- %s' % m[k])
    c = m.get('construcao') or {}
    for k in ('unidade', 'horizontal', 'vertical'):
        if c.get(k):
            out.append('- Construção, %s: %s' % (k, c[k]))
    tm = m.get('tamanho-minimo') or {}
    if tm:
        out.append('- Tamanho mínimo na tela: horizontal %s, vertical %s, símbolo %s. Impresso: horizontal %s, vertical %s, símbolo %s.' % (
            tm['tela']['horizontal'], tm['tela']['vertical'], tm['tela']['simbolo'], tm['impresso']['horizontal'], tm['impresso']['vertical'], tm['impresso']['simbolo']))
    out += ['- Cores do logo: ' + ', '.join('%s %s' % (k, v) for k, v in (m.get('cores-do-logo') or {}).items()) + '.', '',
            'O texto completo das regras do logo está na seção Logo de `references/llms.txt`.', '']
    return '\n'.join(out)


# ------------------------------------------------------------------ SKILL.md
SKILL = '''---
name: aplayers-brand
description: "Padrão oficial da marca A-Players (Design System {ver}): cores, temas Original, Dark e Light, tipografia Manrope e DM Sans, cantos assimétricos, placa deslocada, logos, componentes ap-* e as regras de escrita em pt-BR. Use esta skill sempre que for criar, adaptar ou revisar qualquer coisa em nome da A-Players ou com a identidade dela: página, landing page, artefato HTML, apresentação, documento, proposta, post, e-mail, material do Portal do A-Player, imagem ou texto, mesmo quando o pedido não disser marca nem design system. Use também para revisar textos e peças contra a marca (travessão, termos aposentados, nomes oficiais, ordem Atlassian, CISP1, monday.com)."
---

# Marca A-Players

Esta skill é o Design System oficial da A-Players (versão {ver}, {data}) empacotado para o Claude. A fonte da verdade é a
documentação publicada em {pub} ; esta pasta é gerada dela por `tools/build_skill.py`, então os valores aqui são os mesmos
do site. Se algo daqui divergir de um pedido do usuário, siga o usuário e diga qual regra da marca ficou de fora.

## Antes de começar

1. Leia `references/llms.txt` inteiro. É o resumo oficial: temas, tokens, logo, Graph, componentes, padrões de página,
   regras que não mudam e escrita. Quase toda dúvida se resolve ali.
2. Escolha o tema pela audiência, porque ele muda a superfície inteira:
   - **Original**: tudo o que o mercado vê (site, proposta, apresentação comercial, post). Abertura na noite
     (`--ap-night` #0d1728 com a retícula de pontos), conteúdo na folha clara (`--ap-sheet` #f2f6fb), cartões brancos.
   - **Dark**: apenas quando a pessoa pedir a versão noite.
   - **Light (Portal)**: Portal do A-Player e peças internas para o time (off-white quente `--ap-day`, papel, tons suaves, stickers).
     Nunca numa peça para o mercado.
3. Abra a referência do que vai fazer:

| Vai fazer | Leia |
|---|---|
| Qualquer texto (título, apoio, botão, post, e-mail) | `references/escrita.md` |
| Página ou artefato HTML | `references/componentes.md` e use `assets/css/aplayers.css` |
| Cor, medida, canto, sombra, valor exato | `references/tokens.md` |
| Logo | `references/logo.md` |
| Apresentação, documento, imagem, peça fora do HTML | `references/pecas.md` |

## Como montar

**HTML (página, landing page, artefato).** Carregue Manrope e DM Sans pelo Google Fonts e a folha oficial
`assets/css/aplayers.css` (inline num artefato de arquivo único). Monte com as classes `ap-*` de
`references/componentes.md`, copiando a marcação; a folha da peça cuida apenas da composição (grade, posição, ritmo).
O tom de cada componente vem de `--ap-tone`. Reescrever um botão, cartão ou pill com CSS próprio é o erro mais comum:
o resultado parece genérico e foge da marca. O gráfico vivo do site está em `assets/js/ap-vivo.js`.

**Fora do HTML.** Use os valores de `references/tokens.md`, as fontes Manrope (títulos, 700 a 800) e DM Sans (texto) e os
PNGs de `assets/marca/png/`. `references/pecas.md` traduz os componentes (placa, cantos, espectro, pill) para slides e documentos.

## O que faz a peça parecer A-Players

- As quatro cores do espectro, sempre nesta ordem: azul #3580c3, verde #6eb751, vermelho #eb594d, amarelo #f1e84e.
  Violeta #a18be8 é apoio (CISP1). A noite #0d1728 é o fundo da marca.
- Cantos assimétricos: grandes no alto à esquerda e embaixo à direita (`--ap-r-card` 20 6 20 6). Nunca cantos iguais.
- Placa deslocada sólida no tom do item, proporcional ao tamanho: 4px em botão, 10px em cartão (14px no hover).
- Pill com os quatro triângulos (`#tris`), selos numerados, marca de tom de 9px, barra espectral de quatro quartos.
- Geometria decorativa apenas com os SVGs de `assets/geometria/`, na periferia.
- Pill e rótulos em caixa normal, nunca caixa alta espaçada. Sem barra lateral colorida em cartão ou lista.
- Escala de títulos grande e fixa: o texto cabe na escala, a escala não encolhe para caber o texto.

## Escrita, em uma tela

O detalhe e os exemplos estão em `references/escrita.md`. O essencial:

- pt-BR consultivo e direto; clareza agressiva, promessa prudente. Resultado no centro; a IA diz o que faz.
- Nenhum travessão, meia-risca ou hífen com espaços como pontuação. Hífen de nome continua (A-Players, AI-People).
- Nunca: "só", "100%", "nunca mais", "qualquer integração", "frentes", "nossas plataformas", "ferramentas", "grafo",
  "potencializar", AMS, Academy, Workpacks, A-Hub, HRBP, PDI, "supervisão", "gente acima da média", "AI-Players".
- Parceiras sempre na ordem Atlassian, CISP1, monday.com; juntas são as "plataformas de IA". "a CISP1"; monday.com minúsculo.
- "Inteligência Artificial" com as duas maiúsculas; IA na forma curta. AI-Player "acompanhados por especialistas".
  FinOps começa por "visibilidade". "Plano de desenvolvimento". Assinatura: We Are AI-People Company.
- Nada inventado: número, preço, case ou capacidade de produto apenas com fonte que a pessoa deu.

## Antes de entregar

1. Rode o verificador sobre o que você produziu (HTML, Markdown, CSS, .docx, .pptx, .xlsx):
   `python scripts/check_brand.py <arquivo ou pasta>`. Ele aponta ERRO (regra da marca quebrada) e AVISO (confira).
   Corrija todo ERRO; um trecho que mostra de propósito o que evitar fica de fora com `data-brand-ignore`.
2. Releia contra a lista do fim de `references/llms.txt`: tema certo, apenas tokens e classes `ap-*`, nada inventado.
3. Se for HTML, renderize em 390x844, 1366x768 e 1920x1080 e confira títulos de cartão numa linha e cartões lado a lado
   com o mesmo número de linhas.

## Arquivos

- `references/llms.txt`: o resumo oficial do Design System (leia primeiro).
- `references/tokens.md`, `references/escrita.md`, `references/componentes.md`, `references/logo.md`, `references/pecas.md`.
- `assets/css/aplayers.css`: a folha oficial. `assets/js/ap-vivo.js`: o motor do Graph. `assets/tokens/`: tokens.json e tokens.css.
- `assets/marca/`: logos em SVG e `png/`, com o catálogo `marca.json`. `assets/geometria/`, `assets/parceiros/`,
  `assets/produtos/`, `assets/stickers/` (este último apenas no tema Light).
- `scripts/check_brand.py`: o verificador da marca (Python 3, sem dependências).
'''

PECAS = '''# Peças fora do HTML

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
'''


def main():
    ver, data = version()
    text, els = dsdoc.load()
    shutil.rmtree(OUT, ignore_errors=True)
    wr('SKILL.md', SKILL.format(ver=ver, data=data, pub=bc.PUBLISHED))
    wr('references/llms.txt', rd('llms.txt'))
    wr('references/tokens.md', tokens_md())
    esc = io.open(os.path.join(bc.OUT, '06-Escrita.md'), encoding='utf-8').read() if os.path.exists(os.path.join(bc.OUT, '06-Escrita.md')) else ''
    assert esc, 'rode antes tools/build_claude.py (gera 06-Escrita.md)'
    wr('references/escrita.md', esc.replace('O verificador `tools/check-peca.py` confere', 'O verificador `scripts/check_brand.py` desta skill confere'))
    wr('references/componentes.md', componentes_md(text, els))
    wr('references/logo.md', logo_md())
    wr('references/pecas.md', PECAS)
    copies = [('css/aplayers.css', 'assets/css/aplayers.css'), ('js/ap-vivo.js', 'assets/js/ap-vivo.js'),
              ('tokens/tokens.json', 'assets/tokens/tokens.json'), ('tokens/tokens.css', 'assets/tokens/tokens.css'),
              ('assets/marca/marca.json', 'assets/marca/marca.json'), ('tools/check_brand.py', 'scripts/check_brand.py')]
    import glob
    for pat, dest in (('assets/marca/*.svg', 'assets/marca'), ('assets/marca/png/*.png', 'assets/marca/png'), ('assets/geometria/*.svg', 'assets/geometria'),
                      ('assets/parceiros/*', 'assets/parceiros'), ('assets/produtos/*', 'assets/produtos'), ('assets/stickers/*.webp', 'assets/stickers')):
        for f in sorted(glob.glob(os.path.join(ROOT, pat))):
            if os.path.isfile(f):
                copies.append((os.path.relpath(f, ROOT), os.path.join(dest, os.path.basename(f))))
    for src, dest in copies:
        d = os.path.join(OUT, dest)
        os.makedirs(os.path.dirname(d), exist_ok=True)
        shutil.copyfile(os.path.join(ROOT, src), d)
    n = sum(len(fs) for _, _, fs in os.walk(OUT))
    size = sum(os.path.getsize(os.path.join(r, f)) for r, _, fs in os.walk(OUT) for f in fs)
    print('skill %s %s: %d arquivos, %.1f MB em %s' % (NAME, ver, n, size / 1e6, os.path.relpath(OUT, ROOT)))
    if '--zip' in sys.argv:
        z = os.path.join(os.path.dirname(OUT), NAME + '.zip')
        with zipfile.ZipFile(z, 'w', zipfile.ZIP_DEFLATED) as zf:
            for r, _, fs in os.walk(OUT):
                for f in sorted(fs):
                    p = os.path.join(r, f)
                    zf.write(p, os.path.join(NAME, os.path.relpath(p, OUT)))
        print('zip: %s (%.1f MB)' % (os.path.relpath(z, ROOT), os.path.getsize(z) / 1e6))


if __name__ == '__main__':
    main()
