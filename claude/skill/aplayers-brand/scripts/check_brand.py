#!/usr/bin/env python3
# Verificador da marca A-Players: confere texto e estilo de uma peça contra o Design System (llms.txt, Escrita e Regras).
#
#   python check_brand.py <arquivo ou pasta> [...]      lista ERRO e AVISO por arquivo:linha; sai com 1 se houver ERRO
#   python check_brand.py peca/ --json                  o mesmo em JSON
#
# Lê .html/.htm, .md/.txt, .css, .svg (estilo) e o texto de .docx, .pptx e .xlsx. Código (script, style, code, pre,
# kbd, svg) não entra na leitura de texto. Um trecho que mostra o que evitar (lista de "não use") fica de fora com
# data-brand-ignore no elemento, ou entre <!-- brand-ignore --> e <!-- /brand-ignore --> no Markdown.
# Só a biblioteca padrão do Python; nenhum arquivo é alterado.
import html.parser, io, json, os, re, sys, zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
WORD = 'A-Za-zÀ-ÖØ-öø-ÿ0-9'

# ------------------------------------------------------------------ regras de texto
# (nível, id, padrão, mensagem). Padrões sem flags são sensíveis a caixa de propósito (AMS, PDI, Monday.com).
TEXT_RULES = [
    ('ERRO', 'travessao', re.compile(r'[—―]'), 'Travessão como pontuação. Use vírgula, dois-pontos, parênteses ou duas frases.'),
    ('ERRO', 'meia-risca', re.compile(r'(?<!\d)\s?–\s?|–(?!\s?\d)'), 'Meia-risca como pontuação (fora de intervalo numérico).'),
    ('ERRO', 'hifen-pontuacao', re.compile(r'(?<=[%s.,!?)"”]) - (?=[%s"“(])' % (WORD, WORD)), 'Hífen com espaços como pontuação.'),
    ('ERRO', '100-por-cento', re.compile(r'\b100\s?%'), 'Sem "100%": prudente na promessa.'),
    ('ERRO', 'nunca-mais', re.compile(r'(?i)\bnunca mais\b'), 'Sem "nunca mais": prudente na promessa.'),
    ('ERRO', 'qualquer-integracao', re.compile(r'(?i)\bqualquer integração\b'), 'Sem "qualquer integração".'),
    ('ERRO', 'so', re.compile(r'(?i)(?<![%s])só(?![%s])' % (WORD, WORD)), 'Nunca "só": reescreva a frase sem a palavra.'),
    ('ERRO', 'supervisao', re.compile(r'(?i)\bsupervis(ão|ões|ionad\w*|ionar\w*|or\w*)'), 'AI-Player é "acompanhado por especialistas", nunca supervisão.'),
    ('ERRO', 'termo-aposentado', re.compile(r'\b(AMS|Academy|Workpacks?|A-Hub)\b'), 'Termo aposentado (Planos de assinatura, Capacitações e workshops, Portal do A-Player).'),
    ('ERRO', 'potencializar', re.compile(r'(?i)\bpotencializ\w*'), 'Termo aposentado: "potencializar".'),
    ('ERRO', 'hrbp', re.compile(r'\bHRBP\b'), 'Business Partner, nunca HRBP.'),
    ('ERRO', 'pdi', re.compile(r'\bPDI\b'), '"Plano de desenvolvimento", nunca PDI.'),
    ('ERRO', 'acima-da-media', re.compile(r'(?i)\bgente acima da média\b'), 'Nunca "gente acima da média": "Tecnologia feita de gente movida por desafios."'),
    ('ERRO', 'frentes', re.compile(r'(?i)\bfrentes\b'), 'Atlassian, CISP1 e monday.com são as "plataformas de IA", nunca "frentes".'),
    ('ERRO', 'nossas-plataformas', re.compile(r'(?i)\bnossas plataformas\b'), 'As três são parceiras estratégicas: "plataformas de IA", nunca "nossas plataformas".'),
    ('ERRO', 'grafo', re.compile(r'(?i)\bgrafos?\b'), 'Gráfico, nunca grafo (Teamwork Graph e Context Graph ficam em inglês).'),
    ('ERRO', 'ai-players', re.compile(r'\bAI-Players\b'), 'AI-Player no singular (agente e profissional), nunca AI-Players.'),
    ('ERRO', 'agentes-ai-people', re.compile(r'(?i)\bagentes AI-People\b'), 'Os agentes são AI-Player, nunca "agentes AI-People".'),
    ('ERRO', 'inteligencia-artificial', re.compile(r'\b(?!Inteligência Artificial\b)(?i:inteligência artificial)\b'), '"Inteligência Artificial" com as duas iniciais maiúsculas.'),
    ('ERRO', 'monday-maiusculo', re.compile(r'\bMonday(\.com| CRM| Service| Dev| Work| work| Sidekick| Agents| Vibe| Campaigns)'), 'monday.com sempre em minúsculas.'),
    ('AVISO', 'ferramenta', re.compile(r'(?i)\bferramentas?\b'), 'Plataformas e aplicações, nunca ferramentas.'),
    ('AVISO', 'cisp1-feminino', re.compile(r'\b(o|do|no|pelo|ao|O|Do|No|Pelo|Ao)\s+CISP1\b'), '"a CISP1", no feminino.'),
    ('AVISO', 'work-management', re.compile(r'\bWork Management\b'), '"work management" em minúsculas, como a monday.com escreve.'),
    ('AVISO', 'inventario', re.compile(r'(?i)\binventário\b'), 'No FinOps SaaS e no FinOps IA a primeira etapa é "visibilidade", nunca "inventário".'),
    ('AVISO', 'sinais', re.compile(r'(?i)\bsinais\b'), '"Contexto" e "dados para decidir", não "sinais".'),
    ('AVISO', 'porte', re.compile(r'(?i)\bporte da empresa\b'), '"Maturidade da empresa", não "porte".'),
    ('AVISO', 'formula-atlassian', re.compile(r'(?i)aceleração\s*=\s*contexto'), 'A fórmula "Aceleração = Contexto × Inteligência" é da Atlassian; não apresentar como da A-Players.'),
]
PARTNERS = [('Atlassian', re.compile(r'\bAtlassian\b')), ('CISP1', re.compile(r'\bCISP1\b')), ('monday.com', re.compile(r'\bmonday\b'))]

# ------------------------------------------------------------------ regras de estilo
FONTS_OK = {'manrope', 'dm sans', 'system-ui', 'sans-serif', 'serif', 'monospace', 'ui-monospace', 'ui-sans-serif', 'sfmono-regular',
            'menlo', 'consolas', 'monaco', 'segoe ui', 'roboto', 'helvetica', 'helvetica neue', 'arial', '-apple-system',
            'blinkmacsystemfont', 'inherit', 'initial', 'unset', 'liberation mono', 'courier new', 'apple color emoji',
            'segoe ui emoji', 'noto color emoji'}


def palette():
    # todas as cores dos tokens (Original, Dark e Light) e do logo; procura tokens.json ao lado ou no Design System
    cands = [os.path.join(HERE, '..', 'assets', 'tokens', 'tokens.json'), os.path.join(HERE, '..', 'tokens', 'tokens.json')]
    cores = {'#fff', '#ffffff', '#000', '#000000'}
    for c in cands:
        if os.path.exists(c):
            raw = io.open(c, encoding='utf-8').read()
            cores |= {h.lower() for h in re.findall(r'#[0-9a-fA-F]{3,8}\b', raw)}
            break
    else:
        return None
    return cores


def css_issues(css, line0, out, path):
    pal = PAL
    for m in re.finditer(r'text-transform\s*:\s*uppercase', css):
        out.append(issue(path, line0 + css.count('\n', 0, m.start()), 'ERRO', 'caixa-alta', 'Pill e rótulos em caixa normal, nunca caixa alta.', m.group(0)))
    for m in re.finditer(r'font-family\s*:\s*([^;}"\n]*(?:"[^"]*"[^;}"\n]*)*)', css):
        for f in m.group(1).split(','):
            name = f.strip().strip('"\'').lower()
            if name and not name.startswith('var(') and name not in FONTS_OK and not name.startswith('!'):
                out.append(issue(path, line0 + css.count('\n', 0, m.start()), 'AVISO', 'fonte', 'Fonte fora da marca: Manrope (títulos) e DM Sans (texto).', f.strip()))
    if pal:
        for m in re.finditer(r'#[0-9a-fA-F]{3,8}\b', css):
            if m.group(0).lower() not in pal:
                out.append(issue(path, line0 + css.count('\n', 0, m.start()), 'AVISO', 'cor', 'Cor fora dos tokens: use var(--ap-*).', m.group(0)))
    for m in re.finditer(r'border-left\s*:\s*([3-9]|\d{2,})px\s+solid', css):
        out.append(issue(path, line0 + css.count('\n', 0, m.start()), 'AVISO', 'barra-lateral', 'Sem barra lateral colorida: o tom vai na marca de 9px e na placa.', m.group(0)))


# ------------------------------------------------------------------ leitura
def issue(path, line, level, rid, msg, snip):
    return {'arquivo': path, 'linha': line, 'nivel': level, 'regra': rid, 'mensagem': msg, 'trecho': snip.strip()[:120]}


def text_issues(text, line, out, path):
    t = text.replace(' ', ' ').replace('&#8209;', '-')
    t = re.sub(r'\S*[/\\]\S*', lambda m: ' ' * len(m.group(0)), t)  # caminhos e endereços (js/grafo.js) não são texto
    if not t.strip():
        return
    if t.strip() in ('—', '–', '-'):  # célula de "não disponível"
        return
    for level, rid, rx, msg in TEXT_RULES:
        for m in rx.finditer(t):
            if rid == 'meia-risca' and re.search(r'\d\s?–\s?\d', t[max(0, m.start() - 2):m.end() + 2]):
                continue
            if rid == 'inventario' and 'finops' not in t.lower():
                continue  # a regra vale para o FinOps; "inventário" do Graph é outro sentido
            if rid == 'hifen-pontuacao' and re.search(r'[=×÷]', t[max(0, m.start() - 40):m.end() + 40]):
                continue  # sinal de menos numa fórmula
            if m.start() and t[m.start() - 1] in '"“\'‘' and t[m.end():m.end() + 1] in ('"', '”', "'", '’'):
                continue  # termo entre aspas é menção (a lista do que evitar), não uso
            a = max(0, m.start() - 30)
            out.append(issue(path, line + t.count('\n', 0, m.start()), level, rid, msg, t[a:m.end() + 30].replace('\n', ' ')))
    pos = [(rx.search(t).start(), name) for name, rx in PARTNERS if rx.search(t)]
    if len(pos) >= 2:
        ordem = [n for _, n in sorted(pos)]
        certa = [n for n, _ in PARTNERS if n in ordem]
        if ordem != certa:
            out.append(issue(path, line, 'ERRO', 'ordem-parceiras', 'Parceiras sempre na ordem Atlassian, CISP1, monday.com.', ' > '.join(ordem) + ': ' + t.strip()[:80]))


BLOCK = {'p', 'div', 'section', 'article', 'header', 'footer', 'main', 'aside', 'nav', 'li', 'ul', 'ol', 'h1', 'h2', 'h3', 'h4',
         'h5', 'h6', 'td', 'th', 'tr', 'table', 'figcaption', 'blockquote', 'dt', 'dd', 'br', 'button', 'label', 'option', 'title',
         'summary', 'details', 'form', 'fieldset', 'legend', 'caption'}
SKIP = {'script', 'style', 'code', 'pre', 'kbd', 'svg', 'samp', 'template', 'noscript', 'del', 's'}
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'}


class Leitor(html.parser.HTMLParser):
    def __init__(self, path, out):
        super().__init__(convert_charrefs=True)
        self.path, self.out, self.stack, self.buf, self.start, self.css = path, out, [], [], None, []

    def _skip(self):
        return any(t in SKIP or ign for t, ign in self.stack)

    def flush(self):
        if self.buf:
            text_issues(''.join(self.buf), self.start or 1, self.out, self.path)
        self.buf, self.start = [], None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in BLOCK:
            self.flush()
        if tag == 'html' and a.get('lang') and not a['lang'].lower().startswith(('pt', 'en')):
            self.out.append(issue(self.path, self.getpos()[0], 'AVISO', 'idioma', 'Página em pt-BR (ou en para a versão em inglês).', 'lang=' + a['lang']))
        if a.get('style'):
            css_issues(a['style'], self.getpos()[0], self.out, self.path)
        if not self._skip():
            for k in ('alt', 'title', 'aria-label', 'placeholder'):
                if a.get(k):
                    text_issues(a[k], self.getpos()[0], self.out, self.path)
            if tag == 'meta' and a.get('name') in ('description', 'og:description') or a.get('property') in ('og:description', 'og:title'):
                text_issues(a.get('content') or '', self.getpos()[0], self.out, self.path)
        if tag == 'style':
            self.css.append(self.getpos()[0])
        if tag not in VOID:
            self.stack.append((tag, 'data-brand-ignore' in a or 'avoid' in (a.get('class') or '')))

    def handle_endtag(self, tag):
        if tag in BLOCK:
            self.flush()
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                break

    def handle_data(self, data):
        if self.stack and self.stack[-1][0] == 'style':
            css_issues(data, self.css[-1] if self.css else self.getpos()[0], self.out, self.path)
            return
        if self._skip():
            return
        if self.start is None and data.strip():
            self.start = self.getpos()[0]
        self.buf.append(data)

    def close(self):
        super().close()
        self.flush()


def check_md(src, path, out):
    fence, ignore = False, False
    para, start = [], None
    def flush():
        nonlocal para, start
        if para:
            text_issues('\n'.join(para), start, out, path)
        para, start = [], None
    for i, line in enumerate(src.split('\n'), 1):
        s = line.strip()
        if s.startswith('```') or s.startswith('~~~'):
            fence = not fence
            flush()
            continue
        if '<!-- brand-ignore -->' in s:
            ignore = True
        if '<!-- /brand-ignore -->' in s:
            ignore = False
            continue
        if fence or ignore:
            continue
        s = re.sub(r'`[^`]*`', ' ', s)                  # código em linha
        s = re.sub(r'\]\([^)]*\)', ']', s)               # destino de link
        if re.match(r'^\s*([-*+]|\d+\.)\s+', s):         # cada item de lista é um bloco
            flush()
            s = re.sub(r'^\s*([-*+]|\d+\.)\s+', '', s)
        if s.startswith('|') and s.endswith('|'):        # tabela: cada célula é um bloco
            flush()
            for cell in s.strip('|').split('|'):
                if not re.fullmatch(r'\s*:?-{3,}:?\s*', cell):
                    text_issues(cell, i, out, path)
            continue
        if not s or s.startswith('#'):
            flush()
            if s:
                text_issues(s.lstrip('#'), i, out, path)
            continue
        if start is None:
            start = i
        para.append(s)
    flush()


def check_office(path, out):
    with zipfile.ZipFile(path) as z:
        names = [n for n in z.namelist() if re.match(r'(word/document|word/header\d*|word/footer\d*|ppt/slides/slide\d+|ppt/notesSlides/notesSlide\d+|xl/sharedStrings)\.xml$', n)]
        for n in sorted(names, key=lambda x: [int(d) if d.isdigit() else d for d in re.split(r'(\d+)', x)]):
            xml = z.read(n).decode('utf-8', 'replace')
            for k, p in enumerate(re.findall(r'<(?:w|a):p\b.*?</(?:w|a):p>|<si>.*?</si>', xml, flags=re.S), 1):
                text = html.unescape(''.join(re.findall(r'<(?:w:t|a:t|t)(?:\s[^>]*)?>([^<]*)</(?:w:t|a:t|t)>', p)))
                text_issues(text, k, out, '%s#%s' % (path, n))


def check_file(path, out):
    ext = os.path.splitext(path)[1].lower()
    if ext in ('.docx', '.pptx', '.xlsx'):
        return check_office(path, out)
    try:
        src = io.open(path, encoding='utf-8').read()
    except (UnicodeDecodeError, OSError):
        return
    if ext in ('.html', '.htm'):
        p = Leitor(path, out)
        p.feed(src)
        p.close()
    elif ext in ('.md', '.markdown', '.txt'):
        check_md(src, path, out)
    elif ext == '.css':
        css_issues(re.sub(r'/\*.*?\*/', lambda m: '\n' * m.group(0).count('\n'), src, flags=re.S), 1, out, path)
    elif ext == '.svg':
        for m in re.finditer(r'<style[^>]*>(.*?)</style>', src, flags=re.S):
            css_issues(m.group(1), src.count('\n', 0, m.start()) + 1, out, path)


EXTS = ('.html', '.htm', '.md', '.markdown', '.txt', '.css', '.svg', '.docx', '.pptx', '.xlsx')
PAL = palette()


def main(argv):
    as_json = '--json' in argv
    alvos = [a for a in argv if not a.startswith('--')]
    if not alvos:
        print(__doc__ or 'uso: python check_brand.py <arquivo ou pasta> [...] [--json]')
        return 2
    out = []
    for alvo in alvos:
        if os.path.isdir(alvo):
            for raiz, dirs, files in os.walk(alvo):
                dirs[:] = sorted(d for d in dirs if not d.startswith('.') and d not in ('node_modules', 'vendor'))
                for f in sorted(files):
                    if f.lower().endswith(EXTS):
                        check_file(os.path.join(raiz, f), out)
        else:
            check_file(alvo, out)
    erros = sum(1 for i in out if i['nivel'] == 'ERRO')
    if as_json:
        print(json.dumps({'erros': erros, 'avisos': len(out) - erros, 'itens': out}, ensure_ascii=False, indent=1))
    else:
        for i in out:
            print('%s:%s  %s  %s  %s  [%s]' % (i['arquivo'], i['linha'], i['nivel'], i['regra'], i['mensagem'], i['trecho']))
        print('%d erro(s), %d aviso(s)%s' % (erros, len(out) - erros, '' if PAL else ' (sem tokens.json: cores não conferidas)'))
    return 1 if erros else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
