# Leitura da documentação do Design System (index.html) para os geradores do Claude.
# Extrai seções (<section class="doc" id="...">) e blocos de exemplo (.spec) com o HTML original,
# sem dependências externas.
import io, os, re
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'}


class _Spans(HTMLParser):
    """Guarda (tag, atributos, início, fim) de cada elemento, em offsets de caractere."""
    def __init__(self, text):
        super().__init__(convert_charrefs=False)
        self.text = text
        self.lines = [0]
        for m in re.finditer('\n', text):
            self.lines.append(m.end())
        self.stack, self.els = [], []

    def _off(self):
        l, c = self.getpos()
        return self.lines[l - 1] + c

    def handle_starttag(self, tag, attrs):
        start = self._off()
        end_of_tag = self.text.index('>', start) + 1
        el = {'tag': tag, 'attrs': dict(attrs), 'start': start, 'inner': end_of_tag, 'end': None}
        self.els.append(el)
        if tag not in VOID:
            self.stack.append(el)
        else:
            el['end'] = end_of_tag

    def handle_startendtag(self, tag, attrs):
        start = self._off()
        end = self.text.index('>', start) + 1
        self.els.append({'tag': tag, 'attrs': dict(attrs), 'start': start, 'inner': end, 'end': end})

    def handle_endtag(self, tag):
        off = self._off()
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i]['tag'] == tag:
                el = self.stack[i]
                el['close'] = off
                el['end'] = self.text.index('>', off) + 1
                del self.stack[i:]
                return


def load(path=os.path.join(ROOT, 'index.html')):
    text = io.open(path, encoding='utf-8').read()
    p = _Spans(text)
    p.feed(text)
    return text, p.els


def classes(el):
    return (el['attrs'].get('class') or '').split()


def outer(text, el):
    return text[el['start']:el['end']]


def inner(text, el):
    return text[el['inner']:el.get('close', el['end'])]


def within(a, b):
    return b['start'] >= a['start'] and b['end'] <= a['end']


def sections(text, els, prefix):
    out = []
    for el in els:
        if el['tag'] == 'section' and 'doc' in classes(el) and (el['attrs'].get('id') or '').startswith(prefix):
            out.append(el)
    return out


def strip_tags(s):
    s = re.sub(r'<[^>]+>', '', s)
    return re.sub(r'\s+', ' ', s.replace('&nbsp;', ' ').replace('&#8209;', '-').replace('&amp;', '&')).strip()
