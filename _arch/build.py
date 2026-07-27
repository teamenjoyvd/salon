import markdown, html, json

DOCS = [
 ("cheklist",  "Стартов чеклист",        "Какво трябва да е готово преди първи клиент", "startov-cheklist.md"),
 ("risk",      "Риск-регистър",          "10 риска в 3 нива, с ранни сигнали",          "risk-registar-artistry.md"),
 ("protokoli", "Кабинетни протоколи",    "3 протокола с разход и марж",                 "protokoli-artistry.md"),
 ("finansi",   "Финансов модел",         "ABO цени, себестойност, break-even",          "finansov-model-artistry.md"),
 ("pazar",     "Пазарно проучване",      "47 цени от 27 обекта в София",                "pazarno-prouchvane-sofia.md"),
 ("benchmark", "Бенчмарк на уредите",    "Кой с какво работи и как се сравняваш",       "benchmark-uredi.md"),
 ("higiena",   "Хигиенен протокол",      "ПРОЕКТ — за потвърждение от Amway BG",        "protokol-higiena-DRAFT.md"),
 ("saglasie",  "Информирано съгласие",   "ПРОЕКТ — за адвокатски преглед",              "informirano-saglasie-DRAFT.md"),
 ("promt",     "Оптимизиран промпт",     "Изходното задание, преработено",              "optimalen-promt-artistry.md"),
]

md = markdown.Markdown(extensions=["tables","fenced_code","sane_lists","attr_list"])

sections, nav = [], []
for i,(sid,title,sub,fn) in enumerate(DOCS):
    md.reset()
    body = md.convert(open(fn,encoding="utf-8").read())
    nav.append(f'<button class="navbtn" data-t="{sid}"><span class="n">{i+1}</span><span class="tt">{html.escape(title)}</span><span class="ss">{html.escape(sub)}</span></button>')
    sections.append(f'<section id="{sid}" class="doc">{body}</section>')

TPL = """<!DOCTYPE html>
<html lang="bg"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#12100e">
<title>ARTISTRY Derma-Architect — работна папка</title>
<style>
*{box-sizing:border-box;-webkit-text-size-adjust:100%}
:root{--bg:#12100e;--card:#1b1815;--ink:#ece7e0;--dim:#a09589;--line:#2e2924;--acc:#c9a227;--red:#e0554a;--yel:#d9a441;--grn:#5da96a}
html,body{margin:0;padding:0}
body{background:var(--bg);color:var(--ink);font:16px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding-bottom:env(safe-area-inset-bottom)}
header{position:sticky;top:0;z-index:20;background:rgba(18,16,14,.94);backdrop-filter:blur(12px);border-bottom:1px solid var(--line);padding:14px 18px calc(14px + env(safe-area-inset-top)) 18px;padding-top:calc(14px + env(safe-area-inset-top))}
h1.brand{margin:0;font-size:15px;letter-spacing:.04em;text-transform:uppercase;color:var(--acc);font-weight:700}
.meta{color:var(--dim);font-size:12px;margin-top:3px}
#back{display:none;background:none;border:0;color:var(--acc);font-size:15px;padding:0;margin-bottom:6px;cursor:pointer}
main{padding:18px;max-width:900px;margin:0 auto}
#menu{display:grid;gap:11px}
.navbtn{display:block;width:100%;text-align:left;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:15px 16px;color:var(--ink);cursor:pointer;font:inherit;position:relative;transition:.15s}
.navbtn:active{transform:scale(.985);border-color:var(--acc)}
.navbtn .n{position:absolute;right:15px;top:14px;color:var(--acc);font-size:12px;font-weight:700;opacity:.55}
.navbtn .tt{display:block;font-weight:650;font-size:16.5px;padding-right:26px}
.navbtn .ss{display:block;color:var(--dim);font-size:13px;margin-top:3px;line-height:1.4}
.doc{display:none}
.doc.on{display:block;animation:f .18s ease}
@keyframes f{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
.doc h1{font-size:23px;line-height:1.28;margin:.2em 0 .5em;color:#fff}
.doc h2{font-size:19px;margin:1.7em 0 .5em;padding-top:.7em;border-top:1px solid var(--line);color:var(--acc)}
.doc h3{font-size:16.5px;margin:1.4em 0 .35em;color:#fff}
.doc p,.doc li{font-size:15.5px}
.doc ul,.doc ol{padding-left:1.25em}
.doc li{margin:.3em 0}
.doc strong{color:#fff}
.doc code{background:#26221e;padding:.1em .38em;border-radius:4px;font-size:13.5px}
.doc pre{background:#0d0c0a;border:1px solid var(--line);border-radius:10px;padding:13px;overflow-x:auto;font-size:12.5px;line-height:1.5;-webkit-overflow-scrolling:touch}
.doc pre code{background:none;padding:0}
.doc blockquote{margin:1.1em 0;padding:12px 15px;background:#231f1a;border-left:3px solid var(--acc);border-radius:0 9px 9px 0}
.doc blockquote p{margin:.35em 0;font-size:15px}
.doc hr{border:0;border-top:1px solid var(--line);margin:1.8em 0}
.doc a{color:var(--acc);word-break:break-word}
.tw{overflow-x:auto;-webkit-overflow-scrolling:touch;margin:1.1em -18px;padding:0 18px}
.doc table{border-collapse:collapse;width:100%;min-width:460px;font-size:13.5px}
.doc th{background:#262119;color:var(--acc);text-align:left;font-weight:650;white-space:nowrap}
.doc th,.doc td{border:1px solid var(--line);padding:8px 10px;vertical-align:top}
.doc tr:nth-child(even) td{background:#191612}
footer{color:var(--dim);font-size:12px;text-align:center;padding:26px 18px 40px;line-height:1.6}
</style></head><body>
<header>
  <button id="back">‹ Всички документи</button>
  <h1 class="brand" id="ttl">ARTISTRY Derma-Architect</h1>
  <div class="meta" id="sub">Работна папка · 27 юли 2026 · 9 документа</div>
</header>
<main>
  <div id="menu">__NAV__</div>
  __SECTIONS__
</main>
<footer>Цени и пазарни данни към 27.07.2026.<br>Документите, отбелязани като ПРОЕКТ, изискват потвърждение преди употреба.</footer>
<script>
var D=__DATA__;
var menu=document.getElementById('menu'),back=document.getElementById('back'),
    ttl=document.getElementById('ttl'),sub=document.getElementById('sub');
function open(id){
  var d=D.find(function(x){return x[0]===id});
  document.querySelectorAll('.doc').forEach(function(s){s.classList.remove('on')});
  document.getElementById(id).classList.add('on');
  menu.style.display='none'; back.style.display='block';
  ttl.textContent=d[1]; sub.textContent=d[2];
  window.scrollTo(0,0); location.hash=id;
}
function home(){
  document.querySelectorAll('.doc').forEach(function(s){s.classList.remove('on')});
  menu.style.display='grid'; back.style.display='none';
  ttl.textContent='ARTISTRY Derma-Architect';
  sub.textContent='Работна папка · 27 юли 2026 · 9 документа';
  window.scrollTo(0,0);
  history.replaceState(null,'',location.pathname);
}
document.querySelectorAll('.navbtn').forEach(function(b){
  b.addEventListener('click',function(){open(b.dataset.t)})});
back.addEventListener('click',home);
document.querySelectorAll('.doc table').forEach(function(t){
  var w=document.createElement('div'); w.className='tw';
  t.parentNode.insertBefore(w,t); w.appendChild(t)});
if(location.hash){var h=location.hash.slice(1); if(document.getElementById(h))open(h)}
</script></body></html>"""

out = (TPL.replace("__NAV__","\n".join(nav))
          .replace("__SECTIONS__","\n".join(sections))
          .replace("__DATA__", json.dumps([[d[0],d[1],d[2]] for d in DOCS], ensure_ascii=False)))
open("ARTISTRY-rabotna-papka.html","w",encoding="utf-8").write(out)
print("OK", len(out), "bytes")
