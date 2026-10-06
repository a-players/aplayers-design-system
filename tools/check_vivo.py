"""Confere se as formações do gráfico vivo do Design System (js/ap-vivo.js)
são as mesmas do site (../js/graph.js). Rode dentro desta pasta:

    python tools/check_vivo.py

O site é a fonte: mudou uma formação em js/graph.js, copie para js/ap-vivo.js."""
import io
import re
import sys


def bloco(caminho, inicio):
    s = io.open(caminho, encoding='utf-8').read()
    i = s.index(inicio)
    j = s.index('\n  };', i)
    linhas = [l.strip() for l in s[i + len(inicio):j].splitlines()]
    return ''.join(l for l in linhas if l and not l.startswith('//'))


site = bloco('../js/graph.js', 'var SPECS = {')
ds = bloco('js/ap-vivo.js', 'var FORMATIONS = {')
if site == ds:
    print('ok: as 13 formações do Design System são as do site')
    sys.exit(0)
a = re.split(r'(?<=\}),', site)
b = re.split(r'(?<=\}),', ds)
for x, y in zip(a, b):
    if x != y:
        print('diferente:\n  site: ' + x[:160] + '\n  ds:   ' + y[:160])
        break
sys.exit(1)
