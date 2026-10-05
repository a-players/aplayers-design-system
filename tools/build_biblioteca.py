# Biblioteca das frentes: gera a rota #biblioteca do index.html a partir de assets/biblioteca/biblioteca.json.
# Também grava assets/biblioteca/biblioteca.js (o mesmo JSON embutido, para os detalhes abrirem até fora do servidor).
# Uso: python tools/build_biblioteca.py  (a partir da pasta do Design System)
# Para incluir ou trocar um logo: ponha o arquivo oficial em assets/biblioteca/<frente>/<aplicação>/,
# registre no biblioteca.json (com fonte e data) e rode este script.
import io, json, os, re, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
J = os.path.join(ROOT, 'assets', 'biblioteca', 'biblioteca.json')
D = json.load(io.open(J, encoding='utf-8'))
E = html.escape

FRENTE = {'atlassian': ('Atlassian', 'var(--ap-blue)'), 'cisp1': ('CISP1', 'var(--ap-violet)'), 'monday': ('monday.com', 'var(--ap-red)')}
ORDEM = ['atlassian', 'cisp1', 'monday']  # ordem das frentes: Atlassian, CISP1, monday.com
TIPO = {'marca': 'Marca', 'aplicacao': 'Aplicação', 'collection': 'Collection', 'ia': 'IA'}
NOME_ARQ = {'icone': 'Ícone', 'simbolo': 'Símbolo', 'logo-fundo-claro': 'Logo para fundo claro', 'logo-fundo-escuro': 'Logo para fundo escuro',
            'atribuicao-fundo-claro': 'Atribuição para fundo claro', 'atribuicao-fundo-escuro': 'Atribuição para fundo escuro',
            'logo-neutro': 'Logo neutro', 'simbolo-neutro': 'Símbolo neutro', 'simbolo-branco': 'Símbolo branco',
            'logo-compacto-fundo-claro': 'Logo compacto para fundo claro', 'logo-compacto-fundo-escuro': 'Logo compacto para fundo escuro',
            'logo-circular-fundo-claro': 'Logo Circular para fundo claro', 'logo-circular-fundo-escuro': 'Logo Circular para fundo escuro',
            'icone-hexagono': 'Ícone hexágono', 'logo-hexagono-fundo-escuro': 'Logo hexágono para fundo escuro', 'logo-quadrado': 'Logo quadrado'}


def itens():
    return sorted(D['itens'], key=lambda i: ORDEM.index(i['frente']))


def slug(i):
    return i['id']


def card(i):
    nome, tom = FRENTE[i['frente']]
    a = i['arquivos']
    claro = a.get('logo-fundo-claro') or a.get('icone')
    escuro = a.get('logo-fundo-escuro')
    so_claro = not escuro
    busca = ' '.join([i['nome'], i['grupo'], nome, TIPO[i['tipo']]] + i.get('colecoes', []) + ([i['desc']] if i.get('desc') else [])).lower()
    arts = f'<img class="lib-card__img lib-claro" src="{claro}" alt="" loading="lazy">'
    arts += f'<img class="lib-card__img lib-escuro" src="{escuro}" alt="" loading="lazy">' if escuro else f'<span class="lib-escuro lib-card__inset"><img class="lib-card__img" src="{claro}" alt="" loading="lazy"><em>só para fundo claro</em></span>'
    quick = []
    if a.get('icone'):
        quick.append(f'<a class="ap-btn-quiet" href="{a["icone"]}" download="{slug(i)}-icone{os.path.splitext(a["icone"])[1]}">Ícone</a>')
    if a.get('logo-fundo-claro'):
        quick.append(f'<a class="ap-btn-quiet lib-claro-i" href="{a["logo-fundo-claro"]}" download="{slug(i)}-logo-fundo-claro{os.path.splitext(a["logo-fundo-claro"])[1]}">Logo</a>')
    if escuro:
        quick.append(f'<a class="ap-btn-quiet lib-escuro-i" href="{escuro}" download="{slug(i)}-logo-fundo-escuro{os.path.splitext(escuro)[1]}">Logo</a>')
    grupo = i.get('rotulo') or i['grupo']
    desc = f'<span class="lib-card__desc">{E(i["desc"])}</span>' if i.get('desc') else ''
    return (f'<article class="lib-card" id="b-{slug(i)}" data-frente="{i["frente"]}" data-tipo="{i["tipo"]}" data-busca="{E(busca)}" style="--ap-tone:{tom}">'
            f'<div class="lib-card__art">{arts}</div>'
            f'<div class="lib-card__info"><h3>{E(i["nome"])}</h3><p class="ap-kicker">{E(grupo)}</p>{desc}</div>'
            f'<div class="lib-card__files">{"".join(quick)}<button type="button" class="lib-card__more" data-lib-open="{slug(i)}" aria-haspopup="dialog">Todos os arquivos<span class="ap-sr"> de {E(i["nome"])}</span></button></div>'
            f'</article>')


def mosaico():
    pick = [i for i in itens() if i['arquivos'].get('icone') and i['tipo'] != 'marca' and i['id'] not in ('atl-rovo-dev',)]
    cells = ''.join(f'<button type="button" class="lib-mosaic__i" data-lib-open="{slug(i)}" style="--d:{(n % 7) * .06:.2f}s" title="{E(i["nome"])}"><img src="{i["arquivos"]["icone"]}" alt="" loading="lazy"><span class="ap-sr">{E(i["nome"])}: ver os arquivos</span></button>' for n, i in enumerate(pick[:35]))
    return f'<div class="lib-mosaic" aria-label="Ícones das aplicações">{cells}</div>'


def nomes():
    linhas = []
    for i in itens():
        if i['tipo'] == 'collection':
            continue
        nome, _ = FRENTE[i['frente']]
        nota = ''
        if i['id'] == 'atl-customer-service-management':
            nota = 'CSM em espaço curto, com o nome completo no title'
        elif i['id'] in ('mon-sidekick', 'mon-agents', 'mon-vibe'):
            nota = 'Em espaço curto, como no site: ' + {'mon-sidekick': 'Sidekick', 'mon-agents': 'Agents', 'mon-vibe': 'Vibe'}[i['id']]
        elif i['id'] == 'atl-pipelines':
            nota = 'Bitbucket Pipelines por extenso; Pipelines no cartão da Software Collection'
        elif i['id'] == 'mon-monday':
            nota = 'Sempre minúsculo e com o .com'
        elif i['id'] == 'cisp1':
            nota = 'No feminino: a CISP1'
        linhas.append(f'<tr><td><strong>{E(i["nome"])}</strong></td><td class="muted">{nome}</td><td class="muted">{E(i.get("rotulo") or i["grupo"])}</td><td class="muted">{E(nota)}</td></tr>')
    return '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Nome oficial</th><th>Frente</th><th>Grupo</th><th>No site e em espaço curto</th></tr></thead><tbody>' + ''.join(linhas) + '</tbody></table></div>'


def colecoes():
    out = []
    for c in [i for i in D['itens'] if i['tipo'] == 'collection']:
        apps = [i for i in D['itens'] if c['nome'] in i.get('colecoes', []) and i['tipo'] != 'collection' and i['arquivos'].get('icone')]
        icons = ''.join(f'<img src="{a["arquivos"]["icone"]}" alt="{E(a["nome"])}" title="{E(a["nome"])}" loading="lazy">' for a in apps)
        out.append(f'<div class="lib-col"><img class="lib-col__logo" src="{c["arquivos"]["logo-fundo-claro"]}" alt="{E(c["nome"])}" loading="lazy"><p>{E(c["rotulo"])}</p><span class="lib-col__apps">{icons}</span></div>')
    return '<div class="lib-cols">' + ''.join(out) + '</div>'


def regras(k):
    return '<ul class="ap-bars">' + ''.join(f'<li style="--ap-tone:{FRENTE[k][1]}"><span>{E(r)}</span></li>' for r in D['fontes'][k]['regras']) + '</ul>'


def usos_monday():
    nomes_u = {'black': 'Sobre o preto', 'white': 'Sobre o branco', 'red': 'Sobre o vermelho da marca', 'yellow': 'Sobre o amarelo da marca', 'green': 'Sobre o verde da marca', 'purple': 'Sobre o roxo'}
    out = ''.join(f'<figure><img src="{p}" alt="Exemplo oficial da monday.com: logo {E(nomes_u.get(k, k).lower())}" loading="lazy"><figcaption>{E(nomes_u.get(k, k))}</figcaption></figure>' for k, p in D['usos-monday-2026'].items())
    return f'<div class="lib-usos">{out}</div>'


def fora():
    return '<ul class="ap-bars">' + ''.join(f'<li style="--ap-tone:var(--ap-line-strong)"><strong>{E(f["nome"])}</strong><span>{E(f["motivo"])} <a class="ap-link" href="{f["fonte"]}" target="_blank" rel="noopener">Fonte</a></span></li>' for f in D['fora']) + '</ul>'


n_itens = len(D['itens'])
n_arq = sum(len(i['arquivos']) for i in D['itens'])
cont = {k: sum(1 for i in D['itens'] if i['frente'] == k) for k in ORDEM}
data_br = '/'.join(reversed(D['atualizado'].split('-')))
cards = ''.join(card(i) for i in itens())
fa = D['fontes']['atlassian']
fm = D['fontes']['monday']

ART = f'''<!-- @biblioteca:start (gerado por tools/build_biblioteca.py a partir de assets/biblioteca/biblioteca.json; não edite à mão) -->
<article class="rota" data-rota="biblioteca" id="biblioteca" aria-label="Biblioteca">
  <section class="hero hero--split hero--lib ap-wrap" aria-labelledby="h-lib">
    <div class="hero__inner">
      <p class="ap-pill"><svg class="ap-tri" aria-hidden="true"><use href="#tris"/></svg>Biblioteca</p>
      <h1 class="ap-h1" id="h-lib"><span class="ap-ln2">As três frentes,</span> <span class="ap-ln2">nos arquivos oficiais.</span></h1>
      <p class="ap-lead">{n_itens} marcas, Collections, aplicações e IAs da Atlassian, da CISP1 e da monday.com, com {n_arq} arquivos tirados das páginas oficiais dos fabricantes, sem edição. Busque, escolha o fundo e baixe o arquivo certo.</p>
      <nav class="hero__index" aria-label="Biblioteca">
        <a href="#biblioteca/todas" style="--ap-tone:var(--ap-yellow)">Todas</a><a href="#biblioteca/atlassian" style="--ap-tone:var(--ap-blue)">Regras da Atlassian</a><a href="#biblioteca/cisp1" style="--ap-tone:var(--ap-violet)">CISP1</a><a href="#biblioteca/monday" style="--ap-tone:var(--ap-red)">Regras da monday.com</a><a href="#biblioteca/nomes" style="--ap-tone:var(--ap-green)">Nomes oficiais</a>
      </nav>
    </div>
    {mosaico()}
  </section>

  <div class="ap-sheet page">
    <div class="ap-wrap page__grid">
      <aside class="side" aria-label="Nesta página">
        <p class="side__title">Biblioteca</p>
        <ol>
          <li><a href="#biblioteca/todas" style="--ap-tone:var(--ap-yellow)">Todas as marcas</a></li>
          <li><a href="#biblioteca/atlassian" style="--ap-tone:var(--ap-blue)">Regras da Atlassian</a></li>
          <li><a href="#biblioteca/cisp1" style="--ap-tone:var(--ap-violet)">CISP1</a></li>
          <li><a href="#biblioteca/monday" style="--ap-tone:var(--ap-red)">Regras da monday.com</a></li>
          <li><a href="#biblioteca/nomes" style="--ap-tone:var(--ap-green)">Nomes oficiais</a></li>
          <li><a href="#biblioteca/fora" style="--ap-tone:var(--ap-blue)">Fora da biblioteca</a></li>
        </ol>
        <p class="side__foot">Conferida em {data_br}. Dados em <a href="assets/biblioteca/biblioteca.json">biblioteca.json</a>.</p>
      </aside>
      <div class="content">

        <section class="doc" id="biblioteca-todas" style="--ap-tone:var(--ap-yellow)">
          <header class="doc__head">
            <p class="ap-kicker">Biblioteca</p>
            <h2>Todas as marcas</h2>
            <p class="ap-lead">Atlassian ({cont["atlassian"]}), CISP1 ({cont["cisp1"]}) e monday.com ({cont["monday"]}), nessa ordem. Cada cartão traz o logo no fundo escolhido; em Todos os arquivos estão as outras versões, a fonte e o texto alternativo.</p>
          </header>
          <div class="lib-bar" data-lib-bar>
            <label class="ap-field lib-bar__busca" for="lib-q"><span>Buscar</span><input id="lib-q" type="search" placeholder="Jira, Rovo, sidekick, Collection" autocomplete="off" data-lib-q></label>
            <div class="lib-bar__grupo"><p class="ap-label" id="lib-f">Frente</p><div class="ap-filters" role="group" aria-labelledby="lib-f" data-lib-frente>
              <button type="button" class="ap-filter" aria-pressed="true" data-v="">Todas</button><button type="button" class="ap-filter" aria-pressed="false" data-v="atlassian"><span class="ap-mark" style="--ap-tone:var(--ap-blue)"></span>Atlassian</button><button type="button" class="ap-filter" aria-pressed="false" data-v="cisp1"><span class="ap-mark" style="--ap-tone:var(--ap-violet)"></span>CISP1</button><button type="button" class="ap-filter" aria-pressed="false" data-v="monday"><span class="ap-mark" style="--ap-tone:var(--ap-red)"></span>monday.com</button>
            </div></div>
            <div class="lib-bar__grupo"><p class="ap-label" id="lib-t">Tipo</p><div class="ap-filters" role="group" aria-labelledby="lib-t" data-lib-tipo>
              <button type="button" class="ap-filter" aria-pressed="true" data-v="">Tudo</button><button type="button" class="ap-filter" aria-pressed="false" data-v="marca">Marcas</button><button type="button" class="ap-filter" aria-pressed="false" data-v="collection">Collections</button><button type="button" class="ap-filter" aria-pressed="false" data-v="aplicacao">Aplicações</button><button type="button" class="ap-filter" aria-pressed="false" data-v="ia">IA</button>
            </div></div>
            <div class="lib-bar__grupo"><p class="ap-label" id="lib-bg">Fundo</p><div class="ap-filters" role="group" aria-labelledby="lib-bg" data-lib-fundo>
              <button type="button" class="ap-filter" aria-pressed="true" data-v="claro">Claro</button><button type="button" class="ap-filter" aria-pressed="false" data-v="escuro">Escuro</button>
            </div></div>
          </div>
          <p class="lib-count" aria-live="polite" data-lib-count>{n_itens} marcas</p>
          <div class="lib-grid" data-lib-grid data-fundo="claro">{cards}</div>
          <div class="ap-empty lib-empty" data-lib-empty hidden><p class="ap-empty__title">Nenhuma marca com essa busca</p><p>Tente o nome do produto ou limpe os filtros.</p><button type="button" class="ap-btn ap-btn--sm ap-btn--line" data-lib-clear>Limpar a busca e os filtros</button></div>
        </section>

        <section class="doc" id="biblioteca-atlassian" style="--ap-tone:var(--ap-blue)">
          <header class="doc__head">
            <p class="ap-kicker">Biblioteca</p>
            <h2>Regras da Atlassian</h2>
            <p class="ap-lead">Resumo da página oficial de logos, lida em {'/'.join(reversed(fa['lido'].split('-')))}. Em dúvida, vale a página: <a class="ap-link" href="{fa['url']}" target="_blank" rel="noopener">atlassian.design/foundations/logos</a>.</p>
          </header>
          {regras('atlassian')}
          <h3 class="doc__sub">A cor do azulejo é a Collection</h3>
          <p class="doc__note" style="margin-top:0">Cada ícone traz o desenho da função num azulejo; a cor do azulejo diz a Collection. As aplicações de cada uma, como o site apresenta:</p>
          {colecoes()}
          <div class="rules">
            <div class="rule"><p class="rule__title">Faça</p><ul><li>Logo de aplicação em peças sobre Atlassian; attribution em anúncio, vídeo e white paper.</li><li>Versão para fundo escuro na noite; azul ou neutra no claro.</li><li>Texto alternativo com a aplicação e Atlassian: "Jira, Atlassian".</li></ul></div>
            <div class="rule rule--evite"><p class="rule__title">Evite</p><ul><li>Pôr o ícone dentro de outro azulejo, círculo ou cartão.</li><li>Montar a sua própria assinatura com a palavra Atlassian.</li><li>Logo com strapline abaixo de 280px de largura.</li></ul></div>
          </div>
        </section>

        <section class="doc" id="biblioteca-cisp1" style="--ap-tone:var(--ap-violet)">
          <header class="doc__head">
            <p class="ap-kicker">Biblioteca</p>
            <h2>CISP1</h2>
            <p class="ap-lead">A frente própria da <span class="ap-nw">A-Players</span>: software e IA sob medida. Nos textos, a CISP1, no feminino, como no site da própria CISP1.</p>
          </header>
          <div class="lib-cisp">
            <div style="--bg:#ffffff"><img src="assets/biblioteca/cisp1/logo-fundo-claro.png" alt="CISP1" loading="lazy"></div>
            <div style="--bg:#0d1728"><img src="assets/biblioteca/cisp1/logo-fundo-escuro.png" alt="CISP1" loading="lazy"></div>
          </div>
          {regras('cisp1')}
        </section>

        <section class="doc" id="biblioteca-monday" style="--ap-tone:var(--ap-red)">
          <header class="doc__head">
            <p class="ap-kicker">Biblioteca</p>
            <h2>Regras da monday.com</h2>
            <p class="ap-lead">Resumo do press kit oficial, lido em {'/'.join(reversed(fm['lido'].split('-')))}: <a class="ap-link" href="{fm['url']}" target="_blank" rel="noopener">monday.com/p/news/press-kit</a>. Os nomes seguem o menu do site da monday.com.</p>
          </header>
          {regras('monday')}
          <h3 class="doc__sub">Exemplos oficiais do pacote 2026</h3>
          {usos_monday()}
          <p class="doc__note">Sobre as cores, o logo vai inteiro dentro da cápsula escura. A cápsula é parte do arquivo, não um fundo para outros elementos.</p>
        </section>

        <section class="doc" id="biblioteca-nomes" style="--ap-tone:var(--ap-green)">
          <header class="doc__head">
            <p class="ap-kicker">Biblioteca</p>
            <h2>Nomes oficiais</h2>
            <p class="ap-lead">Escreva como o fabricante escreve: monday.com e os produtos da monday.com em minúsculas, Jira Service Management por extenso, Rovo sem sufixo. A coluna da direita mostra a forma curta que o site usa.</p>
          </header>
          {nomes()}
        </section>

        <section class="doc" id="biblioteca-fora" style="--ap-tone:var(--ap-blue)">
          <header class="doc__head">
            <p class="ap-kicker">Biblioteca</p>
            <h2>Fora da biblioteca</h2>
            <p class="ap-lead">Logos que ainda aparecem nas páginas oficiais, mas não entram nas peças da <span class="ap-nw">A-Players</span>, e o porquê.</p>
          </header>
          {fora()}
        </section>
      </div>
    </div>
  </div>
  <dialog class="lib-dialog" data-lib-dialog aria-labelledby="lib-d-t">
    <div class="lib-dialog__in">
      <div class="lib-dialog__top"><h2 id="lib-d-t" data-lib-d-title>Arquivos</h2><button type="button" class="ap-close" data-lib-close>Fechar <span class="ap-kbd">Esc</span></button></div>
      <div data-lib-d-body></div>
    </div>
  </dialog>
</article>
<!-- @biblioteca:end -->'''

idx = os.path.join(ROOT, 'index.html')
src = io.open(idx, encoding='utf-8').read()
new, n = re.subn(r'<!-- @biblioteca:start.*?<!-- @biblioteca:end -->', lambda m: ART, src, flags=re.S)
assert n == 1, 'marcadores @biblioteca não encontrados no index.html'
io.open(idx, 'w', encoding='utf-8', newline='\n').write(new)
# o mesmo JSON embutido, com os nomes legíveis de cada tipo de arquivo, para os detalhes
emb = dict(D)
emb['nomes-de-arquivo'] = NOME_ARQ
io.open(os.path.join(ROOT, 'assets', 'biblioteca', 'biblioteca.js'), 'w', encoding='utf-8', newline='\n').write(
    '/* A-Players Design System: assets/biblioteca/biblioteca.json embutido (gerado por tools/build_biblioteca.py; não edite à mão) */\nwindow.APDS_BIBLIOTECA = ' + json.dumps(emb, ensure_ascii=False) + ';\n')
print('biblioteca: %d itens, %d arquivos' % (n_itens, n_arq))
