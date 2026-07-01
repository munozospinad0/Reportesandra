import { writeFileSync, readFileSync } from 'node:fs';

/* ============================================================
   Reporte narrado de resultados v3 — Sandra Clavijo (firma de inmigración)
   Marca: navy #3D5964 + gold #C9B084 + cream #F5EFE7 + charcoal.
   Títulos Playfair Display · cuerpo + NÚMEROS Poppins (tabular-nums).
   Datos reales: CRM (Neon), Google Ads API, GA4 (513029805), GTM live.
   Animaciones: count-up de números, fundido entre slides, más tiempo de lectura.
   ============================================================ */

const NAVY='#3D5964', NAVY_DK='#27393F', NAVY_LT='#557782';
const GOLD='#C9B084', GOLD_DK='#A1844E', GOLD_LT='#Dcc9a6';
const CREAM='#F5EFE7', CREAM_DK='#E6DBCB';
const INK='#322E29', MUT='#6E665C';
const GREEN='#3F7A5E', RED='#B5564F', BLUE='#4A6A76', LINK='#1a4f9c';

const N = (n)=> n.toLocaleString('es-CO');
function donut(segs, size=176, hole=0.56){
  let acc=0, stops=[]; const total=segs.reduce((s,x)=>s+x.v,0);
  for(const s of segs){ const a=acc/total*100, b=(acc+s.v)/total*100; stops.push(`${s.c} ${a.toFixed(2)}% ${b.toFixed(2)}%`); acc+=s.v; }
  const h=Math.round(size*hole);
  return `<div style="position:relative;width:${size}px;height:${size}px;flex-shrink:0">
    <div style="width:100%;height:100%;border-radius:50%;background:conic-gradient(${stops.join(',')})"></div>
    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:${h}px;height:${h}px;border-radius:50%;background:#fff;box-shadow:inset 0 2px 8px rgba(39,57,63,.12);display:flex;flex-direction:column;align-items:center;justify-content:center">
      <div class="num" style="font-size:1.5rem;color:${NAVY};line-height:1">${N(total)}</div><div style="font-size:.6rem;letter-spacing:.1em;color:${MUT};text-transform:uppercase">total</div>
    </div></div>`;
}
const legend = (segs)=> segs.map(s=>`<div style="display:flex;align-items:center;gap:.55rem;margin:.32rem 0"><span style="width:13px;height:13px;border-radius:4px;background:${s.c};flex-shrink:0"></span><span style="font-size:.92rem;color:${INK}"><b class="num">${N(s.v)}</b> · ${s.l}</span></div>`).join('');
// preview de anuncio Google
const adPrev = (url,title,sub,desc,hot)=>`<div class="card ${hot?'hot':''}" style="background:#fff">
  <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.35rem">
    <span style="width:18px;height:18px;border-radius:50%;background:${CREAM};display:inline-flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-weight:700;font-size:.62rem;color:${GOLD_DK}">S</span>
    <span style="font-size:.66rem;font-weight:700;color:${INK}">Anuncio</span><span style="font-size:.66rem;color:${GREEN}">${url}</span>
  </div>
  <div style="font-size:1rem;font-weight:600;color:${LINK};line-height:1.25">${title}</div>
  ${sub?`<div style="font-size:.8rem;font-weight:500;color:${BLUE};margin:.1rem 0 .25rem">${sub}</div>`:''}
  <p style="margin:.2rem 0 0;color:${MUT};font-size:.8rem;line-height:1.45">${desc}</p></div>`;

// íconos SVG (reemplazan emojis — más profesional)
function ic(name, sz=18, color='currentColor'){
  const P={
    calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    phone:'<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/>',
    ai:'<path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5 10.2 7.7z"/><path d="M18.5 14l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6z"/>',
    target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.6"/>',
    clock:'<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/>',
    gem:'<path d="M6 3h12l3 6-9 12L3 9z"/><path d="M3 9h18"/>',
    check:'<polyline points="20 6 9 17 4 12"/>',
    refresh:'<polyline points="23 4 23 10 17 10"/><path d="M20.5 15a9 9 0 1 1-2.1-9.4L23 10"/>',
    users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.1a4 4 0 0 1 0 7.75"/>',
    info:'<circle cx="12" cy="12" r="9"/><line x1="12" y1="16" x2="12" y2="11"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    compass:'<circle cx="12" cy="12" r="9"/><polygon points="16 8 10 10 8 16 14 14"/>',
    doc:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3 6 12 13 21 6"/>',
    book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    star:'<polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9"/>',
    briefcase:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    money:'<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    flag:'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>'
  };
  return `<svg viewBox="0 0 24 24" width="${sz}" height="${sz}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;flex-shrink:0">${P[name]||''}</svg>`;
}

// música de fondo (loop bajito) — embebida
let BGM='';
try{ BGM = readFileSync('c:/clientes/Sandra Clavijo/reporte-sandra/bg-elegante.mp3').toString('base64'); }catch(e){ console.log('aviso: sin bg-music', e.message); }

// WEB=1 → audio/música como archivos externos (HTML liviano, carga rápida online).
// Sin WEB → todo embebido en base64 (un solo archivo para enviar/offline).
const WEB = process.env.WEB === '1';

// Destino de los tickets de ayuda (botón "¿Necesitas ayuda?")
const HELP_EMAIL = 'admin@ceibatic.com';
const HELP_WA = '573015478059'; // WhatsApp de Daniel (sin +) — los tickets abren chat con el problema redactado

const HEAD = `<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Reporte de Resultados · Sandra Clavijo</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}
html,body{margin:0;height:100%;background:${NAVY_DK};overflow-x:hidden}
.deck{position:fixed;inset:0;overflow:hidden;font-family:'Poppins',system-ui,sans-serif;color:${INK};-webkit-font-smoothing:antialiased}
.deck ::-webkit-scrollbar{width:0;height:0}
.slide{position:absolute;inset:0;display:none;flex-direction:column;justify-content:center;padding:clamp(1.8rem,4.5vh,3.4rem) clamp(1.4rem,6vw,5rem);overflow:hidden;opacity:1;transition:opacity .55s ease}
.cover{background:radial-gradient(125% 125% at 14% 100%,${NAVY_LT} 0%,${NAVY} 46%,${NAVY_DK} 100%);color:#fff}
.content{background:
   radial-gradient(60% 80% at 100% 0%, rgba(201,176,132,.12) 0%, rgba(201,176,132,0) 60%),
   radial-gradient(50% 70% at 0% 100%, rgba(61,89,100,.08) 0%, rgba(61,89,100,0) 60%),
   ${CREAM};color:${INK}}
.wrap{width:100%;max-width:1120px;margin:auto;position:relative;z-index:1}
.slide.content::before{content:'';position:absolute;width:44vw;height:44vw;border-radius:50%;filter:blur(85px);z-index:0;pointer-events:none}
.slide.content:nth-of-type(3n)::before{background:rgba(201,176,132,.24);top:-14vw;right:-8vw}
.slide.content:nth-of-type(3n+1)::before{background:rgba(85,119,130,.20);bottom:-15vw;left:-10vw}
.slide.content:nth-of-type(3n+2)::before{background:rgba(201,176,132,.16);top:24%;right:-17vw}
.content.dark{background:radial-gradient(120% 120% at 12% 100%,${NAVY_LT} 0%,${NAVY} 45%,${NAVY_DK} 100%);color:#fff}
.content.dark .h2{color:#fff}
.content.dark .eyebrow{color:${GOLD_LT}}
.content.dark .foot{color:rgba(245,239,231,.5)}
.content.dark::before{display:none}
.logo{font-family:'Playfair Display',serif;font-weight:700;color:#fff;line-height:1;display:inline-block;letter-spacing:.01em}
.logo span{font-family:'Poppins',sans-serif;font-size:.30em;letter-spacing:.34em;color:${GOLD};display:block;margin-top:.45em;font-weight:600}
.eyebrow{display:inline-flex;align-items:center;gap:.6rem;font-family:'Poppins',sans-serif;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;font-weight:600;margin-bottom:.85rem;color:${GOLD_DK}}
.eyebrow .dash{width:24px;height:3px;border-radius:2px;display:inline-block;background:${GOLD}}
.title{font-family:'Playfair Display',serif;font-weight:800;line-height:.98;margin:0;letter-spacing:.005em}
.h2{font-family:'Playfair Display',serif;font-weight:700;color:${NAVY};font-size:clamp(1.8rem,4.1vw,2.85rem);line-height:1.04;margin:0 0 1rem}
.card{background:#fff;border:1px solid ${CREAM_DK};border-radius:16px;padding:clamp(.95rem,1.8vw,1.35rem);box-shadow:0 1px 2px rgba(39,57,63,.05),0 12px 26px -12px rgba(39,57,63,.22)}
.card.hot{border:1.5px solid ${GOLD};box-shadow:0 14px 32px -10px rgba(201,176,132,.55)}
.card h3{margin:.15rem 0 .25rem;color:${NAVY};font-weight:600}
.card p{margin:0;color:${MUT};font-size:.9rem;line-height:1.45}
.pill{display:inline-block;font-family:'Poppins',sans-serif;font-size:.64rem;font-weight:600;letter-spacing:.07em;text-transform:uppercase;padding:.36rem .8rem;border-radius:30px;white-space:nowrap;flex-shrink:0}
.band{display:flex;align-items:center;gap:.7rem;border-radius:14px;padding:.85rem 1.15rem;font-size:.97rem;line-height:1.45}
.band.g{background:${GOLD};color:${NAVY_DK}} .band.w{background:#fff;border:1px solid ${CREAM_DK};color:${INK}}
.num{font-family:'Poppins',sans-serif;font-weight:800;font-feature-settings:"tnum" 1;font-variant-numeric:tabular-nums;letter-spacing:-.01em}
.tbl{width:100%;border-collapse:collapse;font-size:.86rem;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 10px 24px -12px rgba(39,57,63,.22)}
.tbl th{background:${NAVY};color:#fff;text-align:left;padding:.55rem .8rem;font-weight:600;font-size:.72rem;letter-spacing:.04em;text-transform:uppercase}
.tbl td{padding:.5rem .8rem;border-top:1px solid ${CREAM_DK};color:${INK}}
.tbl tr:nth-child(even) td{background:#FBF8F3}
.tbl .r{text-align:right;font-variant-numeric:tabular-nums}
.bar{height:22px;background:rgba(61,89,100,.09);border-radius:30px;overflow:hidden}
.bar>div{height:100%;width:0;border-radius:30px;transition:width 1.1s cubic-bezier(.2,.8,.2,1)}
.flow{display:flex;align-items:stretch;gap:.5rem;flex-wrap:wrap}
.step{flex:1;min-width:120px;background:#fff;border:1px solid ${CREAM_DK};border-radius:14px;padding:.85rem .9rem;position:relative}
.step .n{font-family:'Poppins';font-weight:800;color:${GOLD_DK};font-size:.78rem;letter-spacing:.08em}
.flow .step:not(:last-child)::after{content:'';position:absolute;right:-.5rem;top:50%;width:0;height:0;border-top:6px solid transparent;border-bottom:6px solid transparent;border-left:8px solid ${GOLD};transform:translateY(-50%);z-index:3}
.tl{display:flex;gap:.5rem;position:relative}
.tl .seg{flex:1;background:#fff;border:1px solid ${CREAM_DK};border-radius:14px;padding:.8rem .85rem;border-top:4px solid ${GOLD}}
.foot{position:absolute;bottom:.95rem;left:clamp(1.4rem,6vw,5rem);font-family:'Poppins',sans-serif;font-size:.58rem;letter-spacing:.16em;z-index:3;text-transform:uppercase}
a.lnk{text-decoration:none;color:inherit;display:block;transition:transform .25s}
a.lnk:hover{transform:translateY(-3px)}
[data-say]{transition:opacity .55s cubic-bezier(.2,.8,.2,1),transform .55s cubic-bezier(.2,.8,.2,1)}
@keyframes flo{0%,100%{transform:translateY(0) rotate(var(--rot,0deg))}50%{transform:translateY(-9px) rotate(var(--rot,0deg))}}
@keyframes drift{0%{transform:translate(0,0)}100%{transform:translate(26px,-22px)}}
@keyframes ctaPulse{0%,100%{transform:translateX(-50%) scale(1)}50%{transform:translateX(-50%) scale(1.06)}}
@keyframes shimmer{to{background-position:-200% center}}
@keyframes nodePulse{0%,100%{box-shadow:0 0 0 0 rgba(201,176,132,.55)}50%{box-shadow:0 0 0 10px rgba(201,176,132,0)}}
@keyframes flowY{to{background-position:0 12px}}
.arch-node{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.2);border-radius:11px;padding:.5rem .8rem;color:#fff;font-weight:600;font-size:.82rem;text-align:center}
.arch-conn{width:2px;height:16px;margin:0 auto;background:repeating-linear-gradient(${GOLD} 0 4px,transparent 4px 8px);background-size:2px 8px;animation:flowY .5s linear infinite}
.shine{background:linear-gradient(100deg,${GOLD_DK} 0%,${GOLD_LT} 25%,#fff 50%,${GOLD_LT} 75%,${GOLD_DK} 100%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;animation:shimmer 5s linear infinite}
.card{transition:transform .5s cubic-bezier(.2,.8,.2,1),box-shadow .5s}
.h2{position:relative}
.h2::after{content:'';position:absolute;left:0;bottom:-.35rem;height:3px;width:64px;border-radius:3px;background:linear-gradient(90deg,${GOLD},${GOLD_LT})}
@media (max-width:700px){
  .slide{padding:3.2rem 1rem 6rem !important;justify-content:flex-start !important;overflow-y:auto !important;-webkit-overflow-scrolling:touch}
  .wrap{max-width:100% !important}
  .wrap [style*="grid-template-columns"]{grid-template-columns:1fr !important}
  .slide.cover{justify-content:flex-start !important;padding-top:2.6rem !important;align-items:center !important}
  .slide.cover[style*="flex-direction:row"]{flex-direction:column !important;text-align:center !important;align-items:center !important;gap:1.3rem !important}
  .slide.cover > div{max-width:100% !important}
  .cover .sticker{display:none !important}
  .cover .logo{font-size:25px !important}
  .cover .title{font-size:2.3rem !important;margin-top:.5rem !important}
  .cover .num,.cover .shine{font-size:3.4rem !important}
  .cover [style*="flex-wrap:wrap"]{justify-content:center !important}
  .h2{font-size:1.5rem !important;line-height:1.12 !important}
  .eyebrow{font-size:.62rem !important;margin-bottom:.6rem !important}
  .tbl{font-size:.72rem !important}
  .tbl th,.tbl td{padding:.38rem .45rem !important}
  .arch-node{font-size:.72rem !important;padding:.38rem .55rem !important}
  .flow{gap:.55rem !important}
  .flow .step{min-width:0 !important;flex:1 1 100% !important}
  .flow .step:not(:last-child)::after{display:none !important}
  .wrap [style*="display:flex"][style*="align-items:center"][style*="gap"]{flex-wrap:wrap !important;justify-content:center}
  .card{padding:.85rem 1rem !important}
  [data-caption]{bottom:5rem !important;max-width:93vw !important;font-size:.84rem !important;padding:.55rem .9rem !important}
  [data-cta-play]{font-size:1rem !important;bottom:6.2rem !important;padding:.65rem 1.2rem !important}
  .foot{position:static !important;margin-top:1.1rem;text-align:left !important;left:auto !important;transform:none !important}
}
</style></head><body>
<div class="deck" data-deck>`;

const S = [];

// 1 · PORTADA
S.push(`<section class="slide cover" data-audio="audio/01.mp3" data-narr="Hola Sandra. Este es el reporte de resultados de tu firma. Te muestro, con datos reales de tu sistema, de Google y de Meta, todo lo que construimos este período para atraer mejores clientes. Hicimos mucho, así que ponte cómoda. Vamos." style="display:flex;flex-direction:row;align-items:center;justify-content:space-between;gap:clamp(1.4rem,4vw,3rem)">
  <div style="position:absolute;width:34vw;height:34vw;top:-9vw;right:-7vw;border-radius:50%;filter:blur(70px);background:${GOLD};opacity:.22;animation:drift 22s ease-in-out infinite alternate"></div>
  <div style="position:absolute;width:28vw;height:28vw;bottom:-9vw;left:-7vw;border-radius:50%;filter:blur(70px);background:${NAVY_LT};opacity:.5;animation:drift 26s ease-in-out infinite alternate-reverse"></div>
  <span class="sticker" data-say="todo lo que construimos este período" style="position:absolute;z-index:4;top:11%;right:8%;--rot:6deg;background:${GOLD};color:${NAVY_DK};font-family:'Playfair Display',serif;font-weight:700;padding:.5rem 1.1rem;border-radius:30px;font-size:clamp(.85rem,1.8vw,1.1rem);box-shadow:0 8px 22px -6px rgba(0,0,0,.35);animation:flo 5s ease-in-out infinite">Resultados ✓</span>
  <div style="position:relative;z-index:3;max-width:600px">
    <div class="logo" data-say="Hola Sandra." style="font-size:clamp(30px,3.4vw,46px)">Sandra Clavijo<span>Immigration Law · Miami</span></div>
    <div class="eyebrow" data-say="Hola Sandra." style="color:${GOLD};margin-top:1.3rem"><span class="dash"></span>Reporte de resultados</div>
    <h1 class="title" data-say="Este es el reporte de resultados de tu firma." style="font-size:clamp(2.6rem,7vw,5rem);color:#fff">Lo que<br>logramos</h1>
    <p data-say="con datos reales de tu sistema, de Google y de Meta," style="font-size:clamp(1rem,2.1vw,1.2rem);line-height:1.6;color:rgba(245,239,231,.9);margin:1rem 0 1.2rem;max-width:44ch">Optimización de campañas, calidad de leads, medición a fondo y mejoras del sitio — con datos reales de tu CRM, Google Ads, GA4 y Meta.</p>
    <div data-say="con datos reales de tu sistema, de Google y de Meta," style="display:flex;flex-wrap:wrap;gap:.5rem">
      ${['CRM','Google Ads','GA4','GTM','Meta · SEO'].map(t=>`<span class="pill" style="background:rgba(255,255,255,.1);border:1px solid rgba(201,176,132,.6);color:#fff">${t}</span>`).join('')}
    </div>
  </div>
  <div data-say="Este es el reporte de resultados de tu firma." style="position:relative;z-index:3;flex-shrink:0;background:rgba(255,255,255,.06);border:2px solid rgba(201,176,132,.5);border-radius:24px;padding:clamp(1.4rem,3vw,2.2rem);text-align:center;backdrop-filter:blur(6px);box-shadow:0 16px 40px -10px rgba(0,0,0,.5)">
    <div class="num shine" style="font-size:clamp(4.5rem,12vw,8rem);line-height:.85">850</div>
    <div style="font-family:'Poppins',sans-serif;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;color:#fff;margin-top:.3rem">leads gestionados</div>
  </div>
  <div class="foot" style="color:rgba(245,239,231,.5)">Reporte · Sandra Clavijo Immigration Law · 2026</div>
</section>`);

// 2 · RESUMEN EJECUTIVO
S.push(`<section class="slide content" data-audio="audio/02.mp3" data-narr="En resumen, hicimos cuatro cosas grandes. Gestionamos ochocientos cincuenta leads en tu sistema. Optimizamos tu inversión en Google, recuperando cerca de la mitad del gasto que se desperdiciaba. Construimos un sistema que filtra solo a quien no califica. Y montamos una medición profunda para ver, por fin, la calidad real y no solo el volumen. Te lo desgloso todo.">
  <div class="wrap">
    <div class="eyebrow" data-say="En resumen, hicimos cuatro cosas grandes."><span class="dash"></span>Resumen ejecutivo</div>
    <h2 class="h2" data-say="En resumen, hicimos cuatro cosas grandes.">Cuatro logros del período</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(225px,1fr));gap:1rem">
      <div class="card" data-say="Gestionamos ochocientos cincuenta leads en tu sistema."><div class="num" style="font-size:clamp(2.4rem,5.5vw,3.2rem);color:${NAVY}">850</div><h3>Leads gestionados</h3><p>Centralizados y ordenados en tu CRM, con su origen y etapa.</p></div>
      <div class="card hot" data-say="recuperando cerca de la mitad del gasto que se desperdiciaba."><div class="num" style="font-size:clamp(2.4rem,5.5vw,3.2rem);color:${GOLD_DK}">~50%</div><h3>Inversión recuperada</h3><p>Del gasto de Google que iba a búsquedas de empleo a cero resultados.</p></div>
      <div class="card" data-say="Construimos un sistema que filtra solo a quien no califica."><div class="num" style="font-size:clamp(2.4rem,5.5vw,3.2rem);color:${GREEN}">✓</div><h3>Filtro de calidad</h3><p>Quien no califica deja de contar como conversión y entrena al sistema.</p></div>
      <div class="card" data-say="Y montamos una medición profunda para ver, por fin, la calidad real"><div class="num" style="font-size:clamp(2.4rem,5.5vw,3.2rem);color:${BLUE}">360°</div><h3>Medición a fondo</h3><p>GA4, GTM y CRM conectados: ves de dónde viene y qué pasa con cada lead.</p></div>
    </div>
  </div>
  <div class="foot" style="color:${MUT}">Sandra Clavijo Immigration Law</div>
</section>`);

// 3 · FUENTES DE LEADS (CRM)
S.push(`<section class="slide content" data-audio="audio/03.mp3" data-narr="Empecemos por el principio: de dónde vienen tus leads, según tu CRM. La mayoría llega por Meta, con cuatrocientos veinticuatro. Google trajo doscientos sesenta y ocho. Y el resto se reparte entre tu sitio web, los referidos y las visitas directas a la oficina.">
  <div class="wrap">
    <div class="eyebrow" data-say="Empecemos por el principio: de dónde vienen tus leads, según tu CRM."><span class="dash"></span>01 · Origen de los leads</div>
    <h2 class="h2" data-say="Empecemos por el principio: de dónde vienen tus leads, según tu CRM.">De dónde vienen tus leads</h2>
    <div style="display:flex;align-items:center;gap:clamp(1.5rem,5vw,3.5rem);flex-wrap:wrap">
      <div data-say="La mayoría llega por Meta, con cuatrocientos veinticuatro." style="display:flex;align-items:center;gap:1.4rem">
        ${donut([{l:'Meta',v:424,c:GOLD},{l:'Google',v:268,c:NAVY},{l:'Sitio web',v:97,c:NAVY_LT},{l:'Referidos',v:35,c:GREEN},{l:'Walk-in',v:23,c:GOLD_DK}])}
        <div>${legend([{l:'Meta',v:424,c:GOLD},{l:'Google',v:268,c:NAVY},{l:'Sitio web',v:97,c:NAVY_LT},{l:'Referidos',v:35,c:GREEN},{l:'Walk-in',v:23,c:GOLD_DK}])}</div>
      </div>
      <div style="flex:1;min-width:230px">
        <div class="card" data-say="Google trajo doscientos sesenta y ocho." style="margin-bottom:.8rem"><h3 style="font-size:1.05rem">Meta + Google = el 80% del volumen</h3><p>Dos canales pagados traen casi todos los leads. La pregunta no es cuántos, sino cuáles sirven.</p></div>
        <div class="band w" data-say="Y el resto se reparte entre tu sitio web, los referidos y las visitas directas a la oficina."><span>Referidos y walk-in son pocos… pero como verás en un momento, son los de mejor calidad.</span></div>
      </div>
    </div>
  </div>
  <div class="foot" style="color:${MUT}">Fuente: CRM · Sandra Clavijo Immigration Law</div>
</section>`);

// 4 · HALLAZGO
S.push(`<section class="slide content" data-audio="audio/04.mp3" data-narr="Y aquí está lo importante: volumen no es lo mismo que calidad. De los doscientos sesenta y ocho leads que trajo Google, ninguno se convirtió en cliente. En cambio, tus referidos y las visitas directas, con solo cincuenta y ocho leads, trajeron siete de los casos ganados. Esa fue nuestra señal para actuar.">
  <div class="wrap">
    <div class="eyebrow" data-say="Y aquí está lo importante: volumen no es lo mismo que calidad."><span class="dash"></span>02 · El hallazgo</div>
    <h2 class="h2" data-say="Y aquí está lo importante: volumen no es lo mismo que calidad.">Volumen no es calidad</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1rem">
      <div class="card" data-say="ninguno se convirtió en cliente." style="border-color:${RED}">
        <span class="pill" style="background:rgba(181,86,79,.12);color:${RED}">Google · volumen</span>
        <div style="display:flex;align-items:flex-end;gap:.8rem;margin-top:.5rem"><div class="num" style="color:${RED};font-size:clamp(2.8rem,6vw,4rem);line-height:.85">0</div><div style="color:${MUT};font-size:.92rem;padding-bottom:.5rem">clientes ganados<br>de <b class="num">268</b> leads</div></div>
        <p style="margin-top:.4rem">Mucho tráfico, casi todo fuera de perfil. Y veintiséis terminaron en "No Califica".</p>
      </div>
      <div class="card hot" data-say="trajeron siete de los casos ganados.">
        <span class="pill" style="background:rgba(63,122,94,.14);color:${GREEN}">Referidos + Walk-in · calidad</span>
        <div style="display:flex;align-items:flex-end;gap:.8rem;margin-top:.5rem"><div class="num" style="color:${GREEN};font-size:clamp(2.8rem,6vw,4rem);line-height:.85">7</div><div style="color:${MUT};font-size:.92rem;padding-bottom:.5rem">clientes ganados<br>de solo <b class="num">58</b> leads</div></div>
        <p style="margin-top:.4rem">Poquito volumen, pero la calidad real de tu negocio.</p>
      </div>
    </div>
    <div class="band g" data-say="Esa fue nuestra señal para actuar." style="margin-top:1rem"><span><b>La conclusión:</b> dejar de perseguir volumen barato y reorientar todo hacia los perfiles que de verdad contratan.</span></div>
  </div>
  <div class="foot" style="color:${MUT}">Fuente: CRM · Sandra Clavijo Immigration Law</div>
</section>`);

// 5 · GOOGLE ADS
S.push(`<section class="slide content" data-audio="audio/05.mp3" data-narr="Así que fuimos a Google y encontramos el problema exacto: casi la mitad de tu presupuesto se iba en gente que buscaba empleo o trabajo, no servicios legales. Y cero de ellos se volvía cliente. Bloqueamos esas búsquedas y redirigimos ese dinero hacia perfiles que sí contratan: inversionistas, profesionales y casos de residencia.">
  <div class="wrap" style="max-width:1000px">
    <div class="eyebrow" data-say="Así que fuimos a Google y encontramos el problema exacto:"><span class="dash"></span>03 · Google Ads</div>
    <h2 class="h2" data-say="Así que fuimos a Google y encontramos el problema exacto:">Inversión hacia quien contrata</h2>
    <div data-say="casi la mitad de tu presupuesto se iba en gente que buscaba empleo o trabajo, no servicios legales." style="margin-bottom:.85rem">
      <div style="display:flex;justify-content:space-between;font-size:.76rem;color:${NAVY};text-transform:uppercase;margin-bottom:.3rem;font-weight:600"><span>Antes · gasto en buscadores de empleo</span><span>~50%</span></div>
      <div class="bar" style="height:30px"><div data-w="50" style="background:${RED};display:flex;align-items:center;justify-content:flex-end;padding-right:.9rem;color:#fff;font-weight:600;font-size:.82rem">0 clientes</div></div>
    </div>
    <div data-say="Bloqueamos esas búsquedas y redirigimos ese dinero" style="margin-bottom:.95rem">
      <div style="display:flex;justify-content:space-between;font-size:.76rem;color:${NAVY};text-transform:uppercase;margin-bottom:.3rem;font-weight:600"><span>Ahora · enfocado a perfiles que contratan</span><span>recuperado</span></div>
      <div class="bar" style="height:30px"><div data-w="100" style="background:linear-gradient(90deg,${NAVY},${GOLD});transition-delay:.15s"></div></div>
    </div>
    <div class="band w" data-say="inversionistas, profesionales y casos de residencia."><span>Bloqueamos las búsquedas de empleo y reclutadores, y dejamos el presupuesto para <b>inversionistas, residencia y visas de alto perfil</b>. Hoy hay 44 búsquedas bloqueadas.</span></div>
  </div>
  <div class="foot" style="color:${MUT}">Fuente: Google Ads · cuenta 634-519-4221</div>
</section>`);

// 6 · LAS BÚSQUEDAS
S.push(`<section class="slide content" data-audio="audio/06.mp3" data-narr="¿Y qué estaba buscando esa gente en Google? Mira: estos son términos reales por los que pagábamos. Casi todos eran de empleo: cómo irse a trabajar, trabajo para colombianos, hasta el nombre de una empresa de reclutamiento. Mucho dinero, y cero clientes. Esas búsquedas son las que bloqueamos.">
  <div class="wrap" style="max-width:980px">
    <div class="eyebrow" data-say="¿Y qué estaba buscando esa gente en Google?"><span class="dash"></span>04 · Las búsquedas reales</div>
    <h2 class="h2" data-say="¿Y qué estaba buscando esa gente en Google?">Buscaban empleo, no abogada</h2>
    <table class="tbl" data-say="estos son términos reales por los que pagábamos.">
      <thead><tr><th>Búsqueda real en Google</th><th class="r">Gasto (COP)</th><th class="r">Clientes</th></tr></thead>
      <tbody>
        <tr><td>como ir a estados unidos legalmente a trabajar</td><td class="r num">34.079</td><td class="r" style="color:${RED};font-weight:700">0</td></tr>
        <tr><td>trabajo en estados unidos para colombianos</td><td class="r num">22.328</td><td class="r" style="color:${RED};font-weight:700">0</td></tr>
        <tr><td>labormex llc <span style="color:${MUT};font-size:.8em">(reclutadora)</span></td><td class="r num">14.773</td><td class="r" style="color:${RED};font-weight:700">0</td></tr>
        <tr><td>abogado pro bono cerca de mi</td><td class="r num">7.071</td><td class="r" style="color:${RED};font-weight:700">0</td></tr>
        <tr><td>trabajos en estados unidos con visa de trabajo</td><td class="r num">6.186</td><td class="r" style="color:${RED};font-weight:700">0</td></tr>
      </tbody>
    </table>
    <div class="band g" data-say="Mucho dinero, y cero clientes." style="margin-top:.9rem"><span>Quien busca <b>trabajo</b> no contrata a una firma de inmigración. Por eso bloqueamos estas búsquedas y dejamos solo intención real: visas, residencia, inversión.</span></div>
  </div>
  <div class="foot" style="color:${MUT}">Fuente: Google Ads · search terms (30 días)</div>
</section>`);

// 7 · LOS ANUNCIOS QUE CREAMOS (NUEVA)
S.push(`<section class="slide content" data-audio="audio/07.mp3" data-narr="Y no solo limpiamos: también le cambiamos la cara a tus anuncios. Antes salía un aviso genérico, el mismo para todo el mundo, que no le decía nada concreto a quien buscaba. Ahora cada grupo tiene su propio anuncio: el de green card por profesión, el de inversión, y el de talento. Y sumamos un anuncio nuevo, el test de visa, que invita a descubrir en dos minutos qué camino le sirve a cada quien, y lo pusimos en todos los grupos. El resultado se nota: el anuncio de la E B dos fue el que más convirtió, con siete personas que dejaron sus datos.">
  <div class="wrap">
    <div class="eyebrow" data-say="también le cambiamos la cara a tus anuncios."><span class="dash"></span>05 · Los anuncios que creamos</div>
    <h2 class="h2" data-say="también le cambiamos la cara a tus anuncios.">Antes, para todos; ahora, para cada quien</h2>
    <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:1rem;align-items:center">
      <div data-say="el mismo para todo el mundo,">
        <span class="pill" style="background:${CREAM_DK};color:${MUT};margin-bottom:.5rem">Antes · genérico</span>
        ${adPrev('sclavijo.com','Abogado de Inmigración USA','','Asesoría legal en inmigración a Estados Unidos. Contáctanos hoy mismo.',false).replace('class="card ','class="card " style="filter:grayscale(.5);opacity:.75" data-x="')}
      </div>
      <div style="display:flex;align-items:center;justify-content:center"><span class="num" style="width:46px;height:46px;border-radius:50%;background:${GOLD};color:${NAVY_DK};display:flex;align-items:center;justify-content:center;font-size:1.4rem">→</span></div>
      <div data-say="Ahora cada grupo tiene su propio anuncio:">
        <span class="pill" style="background:rgba(63,122,94,.16);color:${GREEN};margin-bottom:.5rem">Ahora · específico</span>
        <div class="card hot" style="background:#fff">
          <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.35rem"><span style="width:18px;height:18px;border-radius:50%;background:${CREAM};display:inline-flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-weight:700;font-size:.62rem;color:${GOLD_DK}">S</span><span style="font-size:.66rem;font-weight:700;color:${INK}">Anuncio</span><span style="font-size:.66rem;color:${GREEN}">sclavijo.com/servicios/visa-eb2-niw</span></div>
          <div style="font-size:1rem;font-weight:600;color:${LINK};line-height:1.25">Visa EB2 NIW · Aplica Hoy</div>
          <div style="font-size:.8rem;font-weight:500;color:${BLUE};margin:.1rem 0 .25rem">Green Card por Profesión · Sin Oferta de Trabajo</div>
          <p style="margin:.2rem 0 0;color:${MUT};font-size:.8rem;line-height:1.45">+500 casos aprobados. Obtén tu Green Card sin oferta laboral. Evalúa tu perfil hoy.</p>
          <div style="margin-top:.6rem;display:flex;align-items:center;gap:.5rem;padding-top:.5rem;border-top:1px solid ${CREAM_DK}"><span class="num" style="color:${GREEN};font-size:1.5rem">7</span><span style="color:${MUT};font-size:.76rem">conversiones — el que más convirtió</span></div>
        </div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1rem">
      <div data-say="el de green card por profesión, el de inversión, y el de talento.">${adPrev('sclavijo.com/servicios/visa-eb5','EB5 · Green Card por Inversión','','¿Tienes capital para invertir? La Visa EB5 te da residencia permanente en USA.',false)}</div>
      <div data-say="con siete personas que dejaron sus datos.">${adPrev('sclavijo.com/servicios/visa-o1','Visa O1 · Talento Extraordinario','','¿Eres artista, atleta o talento único? La Visa O1 puede ser tu camino a USA.',false)}</div>
    </div>
    <div class="band g" data-say="el test de visa, que invita a descubrir en dos minutos" style="margin-top:1rem;flex-wrap:wrap"><span class="pill" style="background:${NAVY_DK};color:${CREAM}">Nuevo · en todos los grupos</span><span><b>Test Gratis de Visa — Descubre tu Visa en 2 Min.</b> Responde unas preguntas y descubre qué visa de EE.UU. se ajusta a tu perfil. → sclavijo.com/encuentra-tu-camino</span></div>
  </div>
  <div class="foot" style="color:${MUT}">Fuente: Google Ads · cuenta 634-519-4221</div>
</section>`);

// 8 · FILTRO INTELIGENTE
S.push(`<section class="slide content" data-audio="audio/08.mp3" data-narr="Después montamos un filtro inteligente en tu sitio. Cuando alguien hace el cuestionario de visas y no encaja en ningún caso, se marca como descalificado: ya no cuenta como conversión ni le ensucia las señales a Google, pero igual puede escribirte por WhatsApp. Así Google aprende a buscar a los clientes correctos, no a cualquiera.">
  <div class="wrap">
    <div class="eyebrow" data-say="Después montamos un filtro inteligente en tu sitio."><span class="dash"></span>06 · Filtro inteligente</div>
    <h2 class="h2" data-say="Después montamos un filtro inteligente en tu sitio.">El sistema filtra solo</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:1rem">
      <div class="card" data-say="Cuando alguien hace el cuestionario de visas y no encaja en ningún caso,"><span class="pill" style="background:rgba(61,89,100,.08);color:${NAVY}">01</span><h3 style="font-size:1.05rem">Detecta sin afinidad</h3><p>El Visa Finder identifica a quien no encaja en ninguna visa.</p></div>
      <div class="card hot" data-say="ya no cuenta como conversión ni le ensucia las señales a Google,"><span class="pill" style="background:rgba(201,176,132,.2);color:${GOLD_DK}">02</span><h3 style="font-size:1.05rem">No cuenta como conversión</h3><p>Deja de inflar números y de confundir el aprendizaje de Google.</p></div>
      <div class="card" data-say="pero igual puede escribirte por WhatsApp."><span class="pill" style="background:rgba(63,122,94,.14);color:${GREEN}">03</span><h3 style="font-size:1.05rem">Puerta abierta</h3><p>Si quiere, igual puede escribirte por WhatsApp. No perdemos a nadie.</p></div>
    </div>
    <div class="band g" data-say="Así Google aprende a buscar a los clientes correctos, no a cualquiera." style="margin-top:1rem"><span>Resultado: <b>Google aprende a buscar clientes correctos</b>, no a cualquiera que llene un formulario.</span></div>
  </div>
  <div class="foot" style="color:${MUT}">Sandra Clavijo Immigration Law</div>
</section>`);

// 9 · CRM
S.push(`<section class="slide content" data-audio="audio/09.mp3" data-narr="Tu sistema de clientes también se hizo más fuerte. Cada lead recorre un pipeline de diez etapas, desde que entra hasta que se gana o se pierde. Y le agregamos seguimiento por fechas: cada lead tiene su próxima fecha de contacto, alertas de vencidos y cuántos días lleva en cada etapa. Así ningún caso se queda olvidado.">
  <div class="wrap">
    <div class="eyebrow" data-say="Tu sistema de clientes también se hizo más fuerte."><span class="dash"></span>07 · CRM</div>
    <h2 class="h2" data-say="Tu sistema de clientes también se hizo más fuerte.">Un CRM que no deja caer nada</h2>
    <div data-say="Cada lead recorre un pipeline de diez etapas, desde que entra hasta que se gana o se pierde." style="display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:1rem">
      ${['Nuevo','Contacto','Calificado','Consulta agendada','Consulta hecha','Propuesta','Negociación'].map(s=>`<span class="pill" style="background:#fff;border:1px solid ${CREAM_DK};color:${NAVY}">${s}</span>`).join('')}
      <span class="pill" style="background:rgba(63,122,94,.16);color:${GREEN}">Ganado</span>
      <span class="pill" style="background:rgba(181,86,79,.14);color:${RED}">Perdido</span>
      <span class="pill" style="background:rgba(110,102,92,.16);color:${MUT}">No Califica</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem">
      <div class="card" data-say="le agregamos seguimiento por fechas:"><h3 style="font-size:1.1rem;display:flex;align-items:center;gap:.45rem">${ic('calendar',18,NAVY)}Seguimiento por fechas</h3><p>Próxima fecha de contacto por lead, alertas de <b>vencidos</b> y de <b>hoy</b>, y "días en etapa". Nada se enfría.</p></div>
      <div class="card hot" data-say="Así ningún caso se queda olvidado."><h3 style="font-size:1.1rem;display:flex;align-items:center;gap:.45rem">${ic('link',18,NAVY)}Tu sistema → Google Ads</h3><p>Cuando marcas un calificado o un ganado, ese resultado real viaja de vuelta a Google para que aprenda.</p></div>
    </div>
  </div>
  <div class="foot" style="color:${MUT}">Sandra Clavijo Immigration Law</div>
</section>`);

// 10 · (eliminado — "círculo virtuoso de los datos" se fusionó en el diagrama de arquitectura, para no repetir)

// 11 · GTM
S.push(`<section class="slide content" data-audio="audio/11.mp3" data-narr="Déjame mostrarte el lado técnico, porque aquí hicimos mucho. Primero, ordenamos todo el tageo de tu sitio en un solo lugar, el gestor de etiquetas. Cada acción importante dispara una señal limpia. La conversión le llega a Google una sola vez, cuando la persona llega a la página de gracias, sin duplicados ni ruido. Y conectamos los dominios para no perder de dónde vino cada clic.">
  <div class="wrap">
    <div class="eyebrow" data-say="Déjame mostrarte el lado técnico, porque aquí hicimos mucho."><span class="dash"></span>09 · Tageo · Gestor de etiquetas</div>
    <h2 class="h2" data-say="Déjame mostrarte el lado técnico, porque aquí hicimos mucho.">Todo el tageo, en orden</h2>
    <div style="display:grid;grid-template-columns:1.1fr 1fr;gap:1rem;align-items:start">
      <div class="card" data-say="ordenamos todo el tageo de tu sitio en un solo lugar, el gestor de etiquetas.">
        <h3 style="font-size:1.05rem">9 disparadores configurados</h3>
        <div style="display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.5rem">
          ${['Llegada a /gracias','lead_submit_visafinder','visa_finder_start','question_answered','result_view','whatsapp_click','cta_schedule_click','language_switch'].map(t=>`<span class="pill" style="background:rgba(61,89,100,.07);color:${NAVY};text-transform:none;letter-spacing:0">${t}</span>`).join('')}
        </div>
      </div>
      <div class="card hot" data-say="cuando la persona llega a la página de gracias, sin duplicados ni ruido."><h3 style="font-size:1.05rem">Conversión limpia</h3><p>El tag de conversión de Google dispara solo en <b>/gracias</b> y en el lead del Visa Finder. Una vez. Sin doble conteo.</p></div>
      <div class="card" data-say="Cada acción importante dispara una señal limpia."><h3 style="font-size:1.05rem">Señales claras</h3><p>Cada evento se manda a GA4 <b>y</b> al gestor de etiquetas a la vez, con nombres consistentes.</p></div>
      <div class="card" data-say="conectamos los dominios para no perder de dónde vino cada clic."><h3 style="font-size:1.05rem">Conexión entre dominios</h3><p>El "conversion linker" enlaza dominios para no perder el origen del clic.</p></div>
    </div>
  </div>
  <div class="foot" style="color:${MUT}">Fuente: GTM-PLFTGBM6 (contenedor en vivo, versión 8)</div>
</section>`);

// 12 · GA4 (1) conversión (rango medido correctamente) + canales
S.push(`<section class="slide content" data-audio="audio/12.mp3" data-narr="Ahora la medición a fondo, con datos reales de tu analítica de Google. Algo importante y honesto: la medición de eventos quedó bien configurada apenas el veinticuatro de junio, así que la conversión real la contamos desde esa fecha. Y la noticia es buena: en esos días, de trescientos ochenta y cuatro visitantes, veintinueve dejaron sus datos como leads calificados. Eso es una conversión cercana al siete y medio por ciento. En cuanto a canales, la mayoría llega por búsqueda pagada.">
  <div class="wrap">
    <div class="eyebrow" data-say="Ahora la medición a fondo, con datos reales de tu analítica de Google."><span class="dash"></span>10 · GA4 · Conversión y canales</div>
    <h2 class="h2" data-say="Ahora la medición a fondo, con datos reales de tu analítica de Google.">Cuánto convierte, de verdad</h2>
    <div class="band w" data-say="la medición de eventos quedó bien configurada apenas el veinticuatro de junio," style="margin-bottom:.9rem"><span style="display:flex;align-items:center;gap:.55rem">${ic('info',18,NAVY)}<b>Medición de eventos confiable desde el 24 de junio de 2026.</b> La conversión se cuenta solo desde esa fecha — antes los eventos no se registraban bien.</span></div>
    <div style="display:grid;grid-template-columns:1.05fr 1fr;gap:1.3rem;align-items:center">
      <div data-say="de trescientos ochenta y cuatro visitantes, veintinueve dejaron sus datos como leads calificados.">
        <div style="font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;color:${MUT};margin-bottom:.5rem;font-weight:600">Embudo · desde 24 jun</div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:7px">
          <div style="width:100%;max-width:320px;height:56px;background:linear-gradient(135deg,${NAVY_LT},${NAVY});clip-path:polygon(0 0,100% 0,80% 100%,20% 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff"><span class="num" style="font-size:1.3rem;line-height:1">384</span><span style="font-size:.66rem;opacity:.9">visitantes</span></div>
          <div style="width:58%;max-width:190px;height:52px;background:linear-gradient(135deg,${GREEN},#2f5d46);clip-path:polygon(0 0,100% 0,70% 100%,30% 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff"><span class="num" style="font-size:1.15rem;line-height:1">29</span><span style="font-size:.62rem;opacity:.9">leads calificados</span></div>
        </div>
        <div class="card hot" data-say="Eso es una conversión cercana al siete y medio por ciento." style="display:flex;align-items:center;gap:.8rem;margin-top:.6rem"><div class="num" style="color:${GREEN};font-size:2.4rem;line-height:.85">7,5%</div><div style="color:${MUT};font-size:.85rem">de los visitantes deja sus datos<br>como <b>lead calificado</b></div></div>
      </div>
      <div data-say="la mayoría llega por búsqueda pagada.">
        <div style="font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;color:${MUT};margin-bottom:.5rem;font-weight:600">Canales (30 días · sesiones)</div>
        ${[['Búsqueda pagada',2110,100,NAVY],['PMAX (cross-network)',223,30,GOLD],['Búsqueda orgánica',121,18,NAVY_LT],['Directo',120,18,BLUE]].map(([l,v,w,c])=>`
        <div style="margin-bottom:.5rem"><div style="display:flex;justify-content:space-between;font-size:.82rem;color:${NAVY};font-weight:600"><span>${l}</span><span class="num">${N(v)}</span></div><div class="bar"><div data-w="${w}" style="background:${c}"></div></div></div>`).join('')}
        <p style="margin:.3rem 0 0;color:${MUT};font-size:.8rem">Páginas top: Visa EB-2 NIW (3.308) · Contacto (2.212) · O-1 (1.123).</p>
      </div>
    </div>
  </div>
  <div class="foot" style="color:${MUT}">Fuente: GA4 513029805 · eventos desde 24/06/2026</div>
</section>`);

// 12b · LO QUE AHORA MEDIMOS (eventos GA4) — NUEVA
S.push(`<section class="slide content" data-audio="audio/12b.mp3" data-narr="Y déjame mostrarte la profundidad de la nueva medición, porque esto es interno y es nuevo. Hoy medimos cada acción importante en tu sitio: cuándo alguien empieza un formulario, cada pregunta que responde en el Test de Visa, cuándo ve su resultado, cuándo hace clic en WhatsApp, e incluso cuándo te llama por teléfono desde la página. Son más de quince tipos de eventos, en vivo. Antes no medíamos casi nada de esto; hoy vemos todo el recorrido.">
  <div class="wrap">
    <div class="eyebrow" data-say="déjame mostrarte la profundidad de la nueva medición, porque esto es interno y es nuevo."><span class="dash"></span>Medición interna · eventos</div>
    <h2 class="h2" data-say="déjame mostrarte la profundidad de la nueva medición, porque esto es interno y es nuevo.">Todo lo que ahora medimos</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;align-items:start">
      <table class="tbl" data-say="Hoy medimos cada acción importante en tu sitio:" style="font-size:.82rem">
        <thead><tr><th>Evento</th><th>Qué mide</th><th class="r">90 días</th></tr></thead>
        <tbody>
          ${[
            ['Lead calificado','Formulario de cliente válido','28',true],
            ['Empezó formulario','Abrió un formulario','896',false],
            ['Respondió pregunta','Avanza en el Test de Visa','319',false],
            ['Inició Test de Visa','Abrió el Visa Finder','59',false],
            ['Vio su resultado','Llegó al final del test','23',false],
            ['Descalificado','No aplica a ninguna visa','5',false],
          ].map(([e,q,v,hot])=>`<tr><td style="font-weight:600;color:${hot?GREEN:NAVY}">${e}</td><td style="color:${MUT}">${q}</td><td class="r num">${v}</td></tr>`).join('')}
        </tbody>
      </table>
      <table class="tbl" data-say="e incluso cuándo te llama por teléfono desde la página." style="font-size:.82rem">
        <thead><tr><th>Evento</th><th>Qué mide</th><th class="r">90 días</th></tr></thead>
        <tbody>
          ${[
            ['Clic a WhatsApp','Quiso escribirte','14'],
            ['Clic "Agendar"','Botón de consulta','4'],
            ['Llamada del sitio','Tocó tu teléfono','1'],
            ['Cambió de idioma','ES / EN','21'],
            ['Clic a redes','Instagram, etc.','1'],
            ['Clic CTA Visa Finder','Desde el test','6'],
          ].map(([e,q,v])=>`<tr><td style="font-weight:600;color:${NAVY}">${e}</td><td style="color:${MUT}">${q}</td><td class="r num">${v}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="band g" data-say="Antes no medíamos casi nada de esto; hoy vemos todo el recorrido." style="margin-top:.85rem"><span><b>Más de 15 eventos en vivo</b> — hasta las llamadas telefónicas. Antes no medíamos casi nada; hoy vemos todo el recorrido del visitante.</span></div>
  </div>
  <div class="foot" style="color:${MUT}">Fuente: GA4 513029805 · 19 tipos de evento activos</div>
</section>`);

// 13 · GA4 (2) audiencia
S.push(`<section class="slide content" data-audio="audio/13.mp3" data-narr="¿Y quién es tu audiencia? Los datos son clarísimos. Casi el noventa por ciento te visita desde el celular, así que tu sitio tiene que verse perfecto en móvil. La mitad de tu tráfico viene de Colombia, y casi un cuarto de Ecuador. Las ciudades que más te buscan son Bogotá, Cali, Quito y Guayaquil. Eso nos dice exactamente a quién hablarle.">
  <div class="wrap">
    <div class="eyebrow" data-say="¿Y quién es tu audiencia? Los datos son clarísimos."><span class="dash"></span>11 · GA4 · Tu audiencia</div>
    <h2 class="h2" data-say="¿Y quién es tu audiencia? Los datos son clarísimos.">Quién te visita, de verdad</h2>
    <div style="display:grid;grid-template-columns:auto 1fr 1fr;gap:clamp(1rem,3vw,2.2rem);align-items:center">
      <div data-say="Casi el noventa por ciento te visita desde el celular, así que tu sitio tiene que verse perfecto en móvil." style="text-align:center">
        ${donut([{l:'Móvil',v:5697,c:GOLD},{l:'Escritorio',v:818,c:NAVY},{l:'Tablet',v:48,c:NAVY_LT}],150)}
        <div style="margin-top:.5rem;font-size:.82rem;color:${NAVY};font-weight:600;display:flex;align-items:center;justify-content:center;gap:.35rem">${ic('phone',16,NAVY)}87% móvil</div>
      </div>
      <div data-say="La mitad de tu tráfico viene de Colombia, y casi un cuarto de Ecuador.">
        <div style="font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;color:${MUT};margin-bottom:.45rem;font-weight:600">Países</div>
        ${[['Colombia',3225,100,GOLD],['Ecuador',1485,46,NAVY],['Perú',493,16,NAVY_LT],['Estados Unidos',429,14,BLUE],['Argentina',265,9,GOLD_DK]].map(([l,v,w,c])=>`
        <div style="margin-bottom:.4rem"><div style="display:flex;justify-content:space-between;font-size:.8rem;color:${NAVY};font-weight:600"><span>${l}</span><span class="num">${N(v)}</span></div><div class="bar" style="height:16px"><div data-w="${w}" style="background:${c}"></div></div></div>`).join('')}
      </div>
      <div data-say="Las ciudades que más te buscan son Bogotá, Cali, Quito y Guayaquil.">
        <div style="font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;color:${MUT};margin-bottom:.45rem;font-weight:600">Top ciudades</div>
        <table class="tbl" style="font-size:.82rem"><tbody>
          ${[['Bogotá',1097],['Cali',424],['Quito',396],['Guayaquil',351],['Medellín',338],['Miami',70]].map(([c,v])=>`<tr><td>${c}</td><td class="r num">${N(v)}</td></tr>`).join('')}
        </tbody></table>
      </div>
    </div>
    <div class="band w" data-say="Eso nos dice exactamente a quién hablarle." style="margin-top:.8rem;font-size:.9rem"><span><b>Tu audiencia:</b> latinoamericana, desde el celular, principalmente de Colombia y Ecuador. A esa persona le hablamos.</span></div>
  </div>
  <div class="foot" style="color:${MUT}">Fuente: GA4 propiedad 513029805 (90 días)</div>
</section>`);

// 13b · EDAD Y GÉNERO — NUEVA (dona de género + barras de edad)
S.push(`<section class="slide content" data-audio="audio/13b.mp3" data-narr="¿Y quién es esa persona, exactamente? De las que Google logra identificar, la mayoría tiene entre veinticinco y cuarenta y cuatro años: justo el perfil profesional que buscamos. Y predominan las mujeres, casi dos de cada tres. Es una muestra pequeña por ahora, pero ya marca la tendencia de a quién le hablamos.">
  <div class="wrap">
    <div class="eyebrow" data-say="¿Y quién es esa persona, exactamente?"><span class="dash"></span>GA4 · Edad y género</div>
    <h2 class="h2" data-say="¿Y quién es esa persona, exactamente?">El perfil de tu público</h2>
    <div style="display:grid;grid-template-columns:1fr auto;gap:clamp(1.4rem,5vw,3.5rem);align-items:center">
      <div data-say="la mayoría tiene entre veinticinco y cuarenta y cuatro años: justo el perfil profesional que buscamos.">
        <div style="font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;color:${MUT};margin-bottom:.5rem;font-weight:600">Edad · de los identificados</div>
        ${[['25-34',37,GOLD],['35-44',19,NAVY],['18-24',19,NAVY_LT],['45-54',14,BLUE],['55+',11,GOLD_DK]].map(([l,w,c])=>`
        <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.4rem"><span style="width:48px;font-size:.82rem;color:${NAVY};font-weight:600">${l}</span><div class="bar" style="flex:1;height:18px"><div data-w="${w}" style="background:${c}"></div></div><span class="num" style="width:34px;font-size:.78rem;color:${MUT}">${w}%</span></div>`).join('')}
        <p style="margin:.5rem 0 0;color:${NAVY};font-size:.9rem;font-weight:600">62% tiene 25-44 años → perfil profesional (ideal EB-2 NIW / O-1).</p>
      </div>
      <div data-say="Y predominan las mujeres, casi dos de cada tres." style="text-align:center">
        ${donut([{l:'Mujeres',v:87,c:GOLD},{l:'Hombres',v:47,c:NAVY}],160)}
        <div style="display:flex;gap:1rem;justify-content:center;margin-top:.6rem;font-size:.84rem">
          <span style="color:${GOLD_DK};font-weight:700">● Mujeres 65%</span><span style="color:${NAVY};font-weight:700">● Hombres 35%</span>
        </div>
      </div>
    </div>
    <div class="band w" data-say="Es una muestra pequeña por ahora, pero ya marca la tendencia de a quién le hablamos." style="margin-top:.9rem;font-size:.88rem"><span>${ic('info',16,NAVY)} Es una muestra pequeña (Google Signals apenas activándose), pero ya marca la tendencia: <b>profesionales de 25-44, mayoría mujeres</b>.</span></div>
  </div>
  <div class="foot" style="color:${MUT}">Fuente: GA4 propiedad 513029805 · demografía (muestra parcial)</div>
</section>`);

// 14 · FLYWHEEL DE EXCLUSIÓN
S.push(`<section class="slide content" data-audio="audio/14.mp3" data-narr="Y esto es lo más increíble que estamos construyendo. Aunque los leads entran al CRM, si alguien no tiene afinidad con ninguna visa, se descalifica al instante. Eso alimenta una lista de descalificados en Google Analytics. Esa lista se conecta a Google Ads como exclusión. Y entonces Google deja de mostrarle tus anuncios a perfiles parecidos a los que nunca contratan. Tu presupuesto deja de quemarse en gente fuera de perfil. El mecanismo ya está montado y llenándose; se enciende del todo en cuanto junte volumen.">
  <div class="wrap" style="max-width:1080px">
    <div class="eyebrow" data-say="Y esto es lo más increíble que estamos construyendo."><span class="dash"></span>12 · El flywheel de exclusión</div>
    <h2 class="h2" data-say="Y esto es lo más increíble que estamos construyendo.">Una máquina que se autodepura</h2>
    <div class="flow" style="gap:.45rem">
      ${[
        ['1','Entra al CRM','Cada lead queda registrado.','Aunque los leads entran al CRM,'],
        ['2','Se descalifica','Sin afinidad con ninguna visa → fuera al instante.','si alguien no tiene afinidad con ninguna visa, se descalifica al instante.'],
        ['3','Lista en GA4','Alimenta una audiencia de descalificados.','Eso alimenta una lista de descalificados en Google Analytics.'],
        ['4','Exclusión en Ads','Esa lista se conecta a Google Ads.','Esa lista se conecta a Google Ads como exclusión.'],
        ['5','Google deja de mostrar','No anuncia a perfiles parecidos.','Google deja de mostrarle tus anuncios a perfiles parecidos a los que nunca contratan.'],
        ['6','Ahorras','El presupuesto va a quien sí contrata.','Tu presupuesto deja de quemarse en gente fuera de perfil.'],
      ].map(([n,t,d,say],i)=>`<div class="step" data-say="${say}" style="min-width:112px;${i===5?`border-color:${GREEN}`:''}"><div class="n" style="color:${i===5?GREEN:GOLD_DK}">PASO ${n}</div><h3 style="margin:.3rem 0 .15rem;color:${NAVY};font-size:.9rem">${t}</h3><p style="margin:0;color:${MUT};font-size:.77rem">${d}</p></div>`).join('')}
    </div>
    <div class="band g" data-say="se enciende del todo en cuanto junte volumen." style="margin-top:1rem"><span>En paralelo corre el <b>loop positivo</b>: tus calificados y ganados crean audiencias para que Google busque <b>más gente como ellos</b>. Excluye lo malo, persigue lo bueno.</span></div>
  </div>
  <div class="foot" style="color:${MUT}">Mecanismo en marcha · se activa con volumen</div>
</section>`);

// 15 · CONVERSIONES OFFLINE
S.push(`<section class="slide content" data-audio="audio/15.mp3" data-narr="Para cerrar el círculo, conectamos los resultados de verdad. Cuando en el CRM marcas un calificado o un ganado, se lo enviamos a Google de forma automática cada pocas horas. A Meta le mandamos cada lead por su vía segura, sin duplicar. Y guardamos el identificador de cada visitante para conectar, muy pronto, lo que pasa en el sitio con lo que pasa en tu CRM.">
  <div class="wrap">
    <div class="eyebrow" data-say="Para cerrar el círculo, conectamos los resultados de verdad."><span class="dash"></span>13 · Conversiones offline</div>
    <h2 class="h2" data-say="Para cerrar el círculo, conectamos los resultados de verdad.">Los resultados reales vuelven</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem">
      <div class="card hot" data-say="se lo enviamos a Google de forma automática cada pocas horas."><span class="pill" style="background:rgba(63,122,94,.14);color:${GREEN}">CRM → Google · LIVE</span><h3 style="font-size:1.05rem">Calificados y ganados</h3><p>Un proceso automático envía tus calificados/ganados a Google cada pocas horas, para que puje por gente como esa.</p></div>
      <div class="card" data-say="A Meta le mandamos cada lead por su vía segura, sin duplicar."><span class="pill" style="background:rgba(61,89,100,.08);color:${NAVY}">Meta · LIVE</span><h3 style="font-size:1.05rem">Vía segura (CAPI)</h3><p>Cada lead se envía a Meta server-side, con de-duplicación, para una medición sólida pese a bloqueadores.</p></div>
      <div class="card" data-say="guardamos el identificador de cada visitante para conectar, muy pronto,"><span class="pill" style="background:rgba(201,176,132,.2);color:${GOLD_DK}">GA4 · en marcha</span><h3 style="font-size:1.05rem">Identificador capturado</h3><p>Ya guardamos el id anónimo de cada visitante para unir sitio ↔ CRM en el próximo paso.</p></div>
    </div>
  </div>
  <div class="foot" style="color:${MUT}">Sandra Clavijo Immigration Law</div>
</section>`);

// 16 · SITIO WEB
S.push(`<section class="slide content" data-audio="audio/16.mp3" data-narr="Por dentro, tu sitio web también cambió. Rediseñamos las guías de visas con un índice navegable, tablas que comparan opciones y llamados a la acción claros hacia la consulta. El Visa Finder guía a cada visitante hacia el caso que le corresponde. Y dejamos todo bajo un mismo sistema de diseño, para que tu marca se vea consistente y profesional en cada página.">
  <div class="wrap">
    <div class="eyebrow" data-say="Por dentro, tu sitio web también cambió."><span class="dash"></span>14 · Sitio web</div>
    <h2 class="h2" data-say="Por dentro, tu sitio web también cambió.">Tu sitio, por dentro</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem">
      <div class="card" data-say="Rediseñamos las guías de visas con un índice navegable, tablas que comparan opciones y llamados a la acción claros hacia la consulta."><h3 style="font-size:1.05rem">Guías rediseñadas</h3><p>Índice navegable, tablas comparativas y un llamado claro a agendar consulta.</p></div>
      <div class="card hot" data-say="El Visa Finder guía a cada visitante hacia el caso que le corresponde."><h3 style="font-size:1.05rem">Visa Finder</h3><p>Un cuestionario que orienta a cada persona hacia su visa y filtra a los que no aplican.</p></div>
      <div class="card" data-say="para que tu marca se vea consistente y profesional en cada página."><h3 style="font-size:1.05rem">Sistema de diseño</h3><p>Una sola identidad — navy, dorado y serif elegante — en todo el sitio.</p></div>
    </div>
    <div class="band g" data-say="El Visa Finder guía a cada visitante hacia el caso que le corresponde." style="margin-top:1rem"><span>Cada página guía al visitante al siguiente paso: <b>la consulta o el Visa Finder</b>.</span></div>
  </div>
  <div class="foot" style="color:${MUT}">Sandra Clavijo Immigration Law</div>
</section>`);

// 17 · SEO / AEO (+ visitas desde IA)
S.push(`<section class="slide content" data-audio="audio/17.mp3" data-narr="Y para que te encuentren, mejoramos el posicionamiento. Pusimos preguntas frecuentes en cada guía, para aparecer en Google y hasta en las respuestas de inteligencia artificial. Sumamos imágenes propias en cada artículo, y corregimos cómo aparece tu firma en los resultados. Y esto ya está dando frutos: empezamos a recibir las primeras visitas desde asistentes de inteligencia artificial, justo lo que buscábamos.">
  <div class="wrap">
    <div class="eyebrow" data-say="Y para que te encuentren, mejoramos el posicionamiento."><span class="dash"></span>15 · SEO &amp; respuestas de IA</div>
    <h2 class="h2" data-say="Y para que te encuentren, mejoramos el posicionamiento.">Que te encuentren mejor</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem">
      <div class="card" data-say="Pusimos preguntas frecuentes en cada guía, para aparecer en Google y hasta en las respuestas de inteligencia artificial."><h3 style="font-size:1.05rem">FAQ para IA</h3><p>Preguntas frecuentes en cada guía → apareces en Google y en respuestas de IA.</p></div>
      <div class="card" data-say="Sumamos imágenes propias en cada artículo,"><h3 style="font-size:1.05rem">Imágenes propias</h3><p>Cada artículo y guía con su imagen única, optimizada para que el sitio siga rápido.</p></div>
      <div class="card" data-say="y corregimos cómo aparece tu firma en los resultados."><h3 style="font-size:1.05rem">Cómo te ven en Google</h3><p>Tu firma se ve profesional en los resultados de búsqueda.</p></div>
    </div>
    <div class="band g" data-say="empezamos a recibir las primeras visitas desde asistentes de inteligencia artificial, justo lo que buscábamos." style="margin-top:1rem"><span style="display:flex;align-items:center;gap:.55rem">${ic('ai',20,NAVY_DK)}<span><b>¡Ya funciona!</b> Empezamos a recibir visitas desde <b>asistentes de IA</b> (tipo ChatGPT). Es el tráfico del futuro y ya estás en el mapa.</span></span></div>
  </div>
  <div class="foot" style="color:${MUT}">Fuente: GA4 · canal "AI Assistant"</div>
</section>`);

// 18 · BLOGS
S.push(`<section class="slide content" data-audio="audio/18.mp3" data-narr="También creamos contenido nuevo para tu blog. Escribimos artículos completos, en español e inglés, con sus preguntas frecuentes y su propia imagen. Cada artículo responde lo que la gente busca de verdad, como la green card paso a paso, trabajar en Estados Unidos, o qué visa de inversión conviene. Y cada uno enlaza a tus servicios para convertir lectores en consultas.">
  <div class="wrap">
    <div class="eyebrow" data-say="También creamos contenido nuevo para tu blog."><span class="dash"></span>16 · Blog &amp; contenido</div>
    <h2 class="h2" data-say="También creamos contenido nuevo para tu blog.">Contenido que atrae y convierte</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:1rem">
      <div class="card" data-say="Escribimos artículos completos, en español e inglés, con sus preguntas frecuentes y su propia imagen."><span class="pill" style="background:rgba(201,176,132,.2);color:${GOLD_DK}">Bilingüe + FAQ</span><h3 style="font-size:1.02rem;margin-top:.4rem">Green Card paso a paso</h3><p>La guía que más se busca, resuelta de principio a fin.</p></div>
      <div class="card" data-say="como la green card paso a paso, trabajar en Estados Unidos,"><span class="pill" style="background:rgba(201,176,132,.2);color:${GOLD_DK}">Bilingüe + FAQ</span><h3 style="font-size:1.02rem;margin-top:.4rem">Trabajar en EE.UU.</h3><p>Para colombianos: con o sin empleador. Auto-califica al lector.</p></div>
      <div class="card hot" data-say="o qué visa de inversión conviene."><span class="pill" style="background:rgba(201,176,132,.2);color:${GOLD_DK}">Bilingüe + FAQ</span><h3 style="font-size:1.02rem;margin-top:.4rem">E-2 vs EB-5</h3><p>Qué visa de inversión conviene según el perfil.</p></div>
    </div>
    <div class="band w" data-say="Y cada uno enlaza a tus servicios para convertir lectores en consultas." style="margin-top:1rem"><span>Cada artículo enlaza a tus <b>servicios y al Visa Finder</b>: el contenido no solo informa, convierte.</span></div>
  </div>
  <div class="foot" style="color:${MUT}">Sandra Clavijo Immigration Law</div>
</section>`);

// 19 · LO QUE NECESITAMOS DEL EQUIPO
S.push(`<section class="slide content" data-audio="audio/19.mp3" data-narr="Ahora, algo clave, y te lo digo con honestidad: la tecnología ya está montada, pero no puede trabajar sola. Para que las pujas de Google aprendan, necesitamos saber qué pasó con cada lead. Y aquí hay un cuello de botella real: ahora mismo más de cuatrocientos leads siguen parados en Nuevo, sin que nadie los mueva. Por eso es clave que el equipo marque siempre dónde va cada uno, y que ningún lead se quede atorado en una sola etapa. Si eso se hace, el sistema optimiza solo. Es un trabajo de equipo.">
  <div class="wrap">
    <div class="eyebrow" data-say="Ahora, algo clave, y te lo digo con honestidad:"><span class="dash"></span>17 · Trabajo en equipo</div>
    <h2 class="h2" data-say="Ahora, algo clave, y te lo digo con honestidad:">Lo que necesitamos del equipo</h2>
    <div class="card" data-say="ahora mismo más de cuatrocientos leads siguen parados en Nuevo, sin que nadie los mueva." style="border-left:5px solid ${RED};display:flex;align-items:center;gap:clamp(1rem,4vw,2.4rem);flex-wrap:wrap;margin-bottom:1rem">
      <div style="display:flex;align-items:baseline;gap:.5rem"><span class="num" style="color:${RED};font-size:clamp(2.4rem,6vw,3.4rem);line-height:.85">473</span><span style="color:${NAVY};font-weight:600;font-size:.95rem">leads parados<br>en "Nuevo"</span></div>
      <div style="width:1px;align-self:stretch;background:${CREAM_DK}"></div>
      <div style="display:flex;align-items:baseline;gap:.5rem"><span class="num" style="color:${RED};font-size:clamp(2rem,5vw,2.8rem);line-height:.85">463</span><span style="color:${MUT};font-size:.9rem">nunca se movieron de ahí<br>— nadie los tocó</span></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem">
      <div class="card hot" data-say="Por eso es clave que el equipo marque siempre dónde va cada uno,"><div style="margin-bottom:.35rem">${ic('target',26,GOLD_DK)}</div><h3 style="font-size:1.05rem">Marcar dónde va cada lead</h3><p>Calificado, ganado o no califica. Sin eso, Google no sabe a quién buscar.</p></div>
      <div class="card" data-say="que ningún lead se quede atorado en una sola etapa."><div style="margin-bottom:.35rem">${ic('clock',26,NAVY)}</div><h3 style="font-size:1.05rem">Que no se queden atorados</h3><p>Mover los leads por las etapas. El sistema ya avisa los vencidos.</p></div>
      <div class="card" data-say="Si eso se hace, el sistema optimiza solo."><div style="margin-bottom:.35rem">${ic('ai',26,GREEN)}</div><h3 style="font-size:1.05rem">Y el sistema mejora solo</h3><p>Con ese dato, las pujas de Google aprenden y baja el costo por cliente.</p></div>
    </div>
    <div class="band g" data-say="Es un trabajo de equipo." style="margin-top:1rem"><span>Nosotros montamos la máquina; <b>el equipo la alimenta con el resultado real</b>. Así cierra el círculo.</span></div>
  </div>
  <div class="foot" style="color:${MUT}">Fuente: CRM · 473 de los leads siguen en "Nuevo Lead"</div>
</section>`);

// 20 · RESULTADOS A LA FECHA
S.push(`<section class="slide content" data-audio="audio/20.mp3" data-narr="¿El resultado hasta hoy? Ocho casos ganados y ocho calificados, con la calidad concentrada justo donde de verdad rinde. El sistema ya está filtrando el ruido para que tu inversión vaya a los clientes correctos. Y ojo, no todo lo que no califica se pierde: varias de esas personas igual pagan una consulta de doscientos cincuenta dólares, y algunas llegaron por Google. Hoy casi no las registramos, así que marcarlas es el primer paso para ver ese ingreso.">
  <div class="wrap">
    <div class="eyebrow" data-say="¿El resultado hasta hoy?"><span class="dash"></span>18 · Resultados</div>
    <h2 class="h2" data-say="¿El resultado hasta hoy?">Resultados a la fecha</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(195px,1fr));gap:1rem">
      <div class="card hot" data-say="Ocho casos ganados"><div class="num" style="color:${GREEN};font-size:clamp(2.4rem,5.5vw,3.4rem);line-height:.85">8</div><h3>Casos ganados</h3><p>Clientes que ya contrataron.</p></div>
      <div class="card" data-say="y ocho calificados,"><div class="num" style="font-size:clamp(2.4rem,5.5vw,3.4rem);line-height:.85;color:${NAVY}">8</div><h3>Calificados</h3><p>Oportunidades reales en gestión.</p></div>
      <div class="card" data-say="El sistema ya está filtrando el ruido"><div class="num" style="color:${GOLD_DK};font-size:clamp(2.4rem,5.5vw,3.4rem);line-height:.85">42</div><h3>Ruido filtrado</h3><p>Leads fuera de perfil, ya separados.</p></div>
    </div>
    <div class="band g" data-say="varias de esas personas igual pagan una consulta de doscientos cincuenta dólares, y algunas llegaron por Google." style="margin-top:1rem"><span>${ic('check',18,NAVY_DK)}<span><b>No todo lo que no califica se pierde:</b> varios pagan consulta de $250 (algunos de Google). Hoy casi no se registran — marcarlas captura ese ingreso.</span></span></div>
  </div>
  <div class="foot" style="color:${MUT}">Fuente: CRM · Sandra Clavijo Immigration Law</div>
</section>`);

// 21 · CÓMO VAMOS (estado) — NUEVA
S.push(`<section class="slide content" data-audio="audio/21.mp3" data-narr="Entonces, ¿cómo vamos hoy? La mayoría del sistema ya está vivo y funcionando: las búsquedas de empleo bloqueadas, el filtro de descalificación, los anuncios por visa, el CRM con fechas y la medición conectada. Otras cosas están en marcha, llenándose, como las listas de exclusión y los blogs nuevos. Y hay una parte que depende del equipo, que es la que cierra todo.">
  <div class="wrap">
    <div class="eyebrow" data-say="Entonces, ¿cómo vamos hoy?"><span class="dash"></span>19 · Cómo vamos</div>
    <h2 class="h2" data-say="Entonces, ¿cómo vamos hoy?">El estado, de un vistazo</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1rem">
      <div class="card" data-say="La mayoría del sistema ya está vivo y funcionando:" style="border-left:4px solid ${GREEN}"><span class="pill" style="background:rgba(63,122,94,.14);color:${GREEN};display:inline-flex;align-items:center;gap:.3rem">${ic('check',13,GREEN)}Vivo</span>
        <ul style="margin:.6rem 0 0;padding-left:1.1rem;color:${MUT};font-size:.88rem;line-height:1.7">
          <li>Búsquedas de empleo bloqueadas</li><li>Filtro de descalificación</li><li>Anuncios por visa + Test de Visa</li><li>CRM con fechas · medición GA4/GTM</li><li>Resultados CRM → Google y Meta</li></ul></div>
      <div class="card" data-say="Otras cosas están en marcha, llenándose, como las listas de exclusión y los blogs nuevos." style="border-left:4px solid ${GOLD}"><span class="pill" style="background:rgba(201,176,132,.2);color:${GOLD_DK};display:inline-flex;align-items:center;gap:.3rem">${ic('refresh',13,GOLD_DK)}En marcha</span>
        <ul style="margin:.6rem 0 0;padding-left:1.1rem;color:${MUT};font-size:.88rem;line-height:1.7">
          <li>Lista de exclusión GA4 (llenándose)</li><li>Marca e identidad digital</li><li>Blogs nuevos publicándose</li><li>Reinversión en alta intención</li></ul></div>
      <div class="card hot" data-say="hay una parte que depende del equipo, que es la que cierra todo."><span class="pill" style="background:rgba(61,89,100,.1);color:${NAVY};display:inline-flex;align-items:center;gap:.3rem">${ic('users',13,NAVY)}Depende del equipo</span>
        <ul style="margin:.6rem 0 0;padding-left:1.1rem;color:${MUT};font-size:.88rem;line-height:1.7">
          <li>Marcar el resultado de cada lead</li><li>Mover los leads por las etapas</li></ul></div>
    </div>
  </div>
  <div class="foot" style="color:${MUT}">Sandra Clavijo Immigration Law</div>
</section>`);

// 22 · (eliminado — "estrategia omnicanal" se fusionó en el diagrama de arquitectura, para no repetir)

// 23 · TIEMPOS VENIDEROS + IMPACTO EN LA PAUTA — NUEVA
S.push(`<section class="slide content" data-audio="audio/22.mp3" data-narr="Y estos son los tiempos que vienen, para que todo el equipo sepa qué esperar. En las próximas dos semanas la señal se limpia y baja el ruido. En un mes, Google reaprende y deberíamos ver subir los leads calificados. Y en dos o tres meses, con el equipo marcando resultados, el costo por cliente real empieza a bajar. Esa es la meta de toda la pauta: no más clics, sino mejores clientes.">
  <div class="wrap">
    <div class="eyebrow" data-say="Y estos son los tiempos que vienen, para que todo el equipo sepa qué esperar."><span class="dash"></span>21 · Tiempos &amp; impacto en la pauta</div>
    <h2 class="h2" data-say="Y estos son los tiempos que vienen, para que todo el equipo sepa qué esperar.">Qué esperar, y cuándo</h2>
    <div class="tl">
      <div class="seg" data-say="En las próximas dos semanas la señal se limpia y baja el ruido." style="border-top-color:${NAVY_LT}"><div class="n" style="color:${NAVY}">AHORA → 2 SEM</div><h3 style="margin:.3rem 0 .15rem;color:${NAVY};font-size:.95rem">Señal limpia</h3><p style="margin:0;color:${MUT};font-size:.8rem">Menos ruido, menos gasto en empleo.</p></div>
      <div class="seg" data-say="En un mes, Google reaprende y deberíamos ver subir los leads calificados." style="border-top-color:${GOLD}"><div class="n" style="color:${GOLD_DK}">~1 MES</div><h3 style="margin:.3rem 0 .15rem;color:${NAVY};font-size:.95rem">Google reaprende</h3><p style="margin:0;color:${MUT};font-size:.8rem">Suben los leads calificados.</p></div>
      <div class="seg" data-say="en dos o tres meses, con el equipo marcando resultados, el costo por cliente real empieza a bajar." style="border-top-color:${GREEN}"><div class="n" style="color:${GREEN}">2-3 MESES</div><h3 style="margin:.3rem 0 .15rem;color:${NAVY};font-size:.95rem">Baja el costo</h3><p style="margin:0;color:${MUT};font-size:.8rem">Menor costo por cliente real (CAC).</p></div>
    </div>
    <div class="band g" data-say="no más clics, sino mejores clientes." style="margin-top:1.1rem"><span>La meta de toda la pauta, para todo el equipo: <b>no más clics, sino mejores clientes</b>.</span></div>
  </div>
  <div class="foot" style="color:${MUT}">Hoja de ruta · sujeta a que el equipo marque resultados</div>
</section>`);

// 23 · LINKS (pruébalo) — ampliada (forms, blogs, páginas)
S.push(`<section class="slide content" data-audio="audio/23.mp3" data-narr="Y para que lo revises con tu equipo, aquí te dejo los enlaces a todo lo que cambiamos y creamos. Puedes tocar cada uno: el test de visa, los formularios, las guías, los blogs nuevos y las páginas de servicios. Todo en vivo, en tu sitio.">
  <div class="wrap">
    <div class="eyebrow" data-say="aquí te dejo los enlaces a todo lo que cambiamos y creamos."><span class="dash"></span>22 · Pruébalo tú</div>
    <h2 class="h2" data-say="aquí te dejo los enlaces a todo lo que cambiamos y creamos.">Toca y míralo en vivo</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(245px,1fr));gap:.8rem" data-say="el test de visa, los formularios, las guías, los blogs nuevos y las páginas de servicios.">
      ${[
        ['compass','Test de Visa','/es/encuentra-tu-camino','El cuestionario que orienta y filtra',true],
        ['doc','Formulario de consulta','/es/consulta','Revisa el form que mide conversiones',false],
        ['mail','Contacto','/es/contacto','Agenda de consulta',false],
        ['book','Guías y recursos','/es/recursos','Guías rediseñadas + blog',false],
        ['star','Blog · Green Card paso a paso','/es/recursos/green-card-paso-a-paso','Artículo nuevo',false],
        ['doc','Guía Visa EB-2 NIW','/es/recursos/visa-eb2-niw','Índice, tablas, FAQ',false],
        ['briefcase','Servicio · EB-2 NIW','/es/servicios/visa-eb2-niw','Tu página más visitada',false],
        ['money','Servicio · Visa EB-5','/es/servicios/visa-eb5','Inversionistas',false],
      ].map(([icn,t,u,d,hot])=>`<a class="lnk" href="https://sclavijo.com${u}" target="_blank" rel="noopener"><div class="card ${hot?'hot':''}"><h3 style="font-size:.96rem;margin:0 0 .15rem;display:flex;align-items:center;gap:.4rem">${ic(icn,17,GOLD_DK)}${t}</h3><p style="font-size:.8rem">${d}</p><div style="font-size:.7rem;color:${GOLD_DK};margin-top:.3rem;word-break:break-all">sclavijo.com${u} ↗</div></div></a>`).join('')}
    </div>
  </div>
  <div class="foot" style="color:${MUT}">Enlaces en vivo · sclavijo.com</div>
</section>`);

// 23b · DIAGRAMA MAESTRO — cómo funciona todo (NUEVA)
S.push(`<section class="slide content dark" data-audio="audio/23b.mp3" data-narr="Y si tuviera que resumirte todo el sistema en una sola imagen, es esto. Tus canales, Meta, Google, y pronto TikTok, llevan a la gente a tu sitio. Ahí el Visa Finder decide: si la persona califica, entra al sistema y avanza hasta cliente; si no, va a una lista que le dice a Google a quién no mostrarle anuncios. Y los resultados reales vuelven a las plataformas, que aprenden a traer más gente como tus mejores clientes. Todo conectado, todo midiéndose, mejorando solo.">
  <div class="wrap" style="max-width:1000px">
    <div class="eyebrow" data-say="si tuviera que resumirte todo el sistema en una sola imagen, es esto."><span class="dash"></span>El sistema completo</div>
    <h2 class="h2" data-say="si tuviera que resumirte todo el sistema en una sola imagen, es esto.">Cómo funciona todo, de un vistazo</h2>
    <div style="display:flex;flex-direction:column;align-items:center;gap:.35rem;font-size:.82rem">
      <div data-say="Tus canales, Meta, Google, y pronto TikTok, llevan a la gente a tu sitio." style="display:flex;gap:.45rem;flex-wrap:wrap;justify-content:center">
        ${[['Meta',GREEN],['Google',GREEN],['TikTok · pronto',GOLD_DK],['Orgánico + IA',NAVY_LT]].map(([t,c])=>`<span style="background:rgba(255,255,255,.07);border:1.5px solid ${c};color:#fff;font-weight:600;padding:.38rem .85rem;border-radius:10px;font-size:.78rem">${t}</span>`).join('')}
      </div>
      <div class="arch-conn"></div>
      <div data-say="Ahí el Visa Finder decide:" style="background:#fff;color:${NAVY};font-weight:700;padding:.5rem 1.5rem;border-radius:12px;box-shadow:0 8px 20px -8px rgba(0,0,0,.5)">Tu sitio web · Visa Finder</div>
      <div class="arch-conn"></div>
      <div style="font-size:.62rem;letter-spacing:.12em;text-transform:uppercase;color:${GOLD_LT}">Cada acción se mide →</div>
      <div style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;justify-content:center">
        <div class="arch-node" style="border-color:${GOLD};animation:nodePulse 2.2s infinite">GTM<br><span style="font-weight:400;font-size:.66rem;opacity:.8">gestor de etiquetas</span></div>
        <span style="color:${GOLD}">→</span>
        <div class="arch-node">GA4<br><span style="font-weight:400;font-size:.66rem;opacity:.8">analítica</span></div>
        <div class="arch-node">Pixel Meta<br><span style="font-weight:400;font-size:.66rem;opacity:.8">+ CAPI</span></div>
        <div class="arch-node">Google Ads<br><span style="font-weight:400;font-size:.66rem;opacity:.8">conversión</span></div>
      </div>
      <div class="arch-conn"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.7rem;width:100%;max-width:760px">
        <div data-say="si la persona califica, entra al sistema y avanza hasta cliente;" style="background:rgba(63,122,94,.16);border:1.5px solid ${GREEN};border-radius:12px;padding:.6rem .85rem"><div style="display:flex;align-items:center;gap:.4rem;color:#fff;font-weight:700;margin-bottom:.2rem">${ic('check',15,'#8fd0ad')}Califica → CRM</div><div style="color:rgba(245,239,231,.82);font-size:.78rem">Recorre las 10 etapas hasta <b style="color:#fff">cliente ganado</b>.</div></div>
        <div data-say="si no, va a una lista que le dice a Google a quién no mostrarle anuncios." style="background:rgba(181,86,79,.18);border:1.5px solid ${RED};border-radius:12px;padding:.6rem .85rem"><div style="display:flex;align-items:center;gap:.4rem;color:#fff;font-weight:700;margin-bottom:.2rem">✕ No aplica</div><div style="color:rgba(245,239,231,.82);font-size:.78rem">Va a la lista de <b style="color:#fff">exclusión</b> en Google Ads.</div></div>
      </div>
      <div class="arch-conn"></div>
      <div data-say="Y los resultados reales vuelven a las plataformas, que aprenden a traer más gente como tus mejores clientes." style="width:100%;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.22);color:#fff;border-radius:12px;padding:.6rem 1.1rem;display:flex;align-items:center;gap:.6rem;justify-content:center;text-align:center;font-size:.84rem">${ic('refresh',18,GOLD_LT)}<span>El <b style="color:${GOLD_LT}">CRM</b> devuelve los resultados a <b style="color:${GOLD_LT}">Google y Meta</b> → buscan más como tus mejores clientes y excluyen a los que no sirven.</span></div>
    </div>
    <div class="band g" data-say="Todo conectado, todo midiéndose, mejorando solo." style="margin-top:.8rem;justify-content:center;text-align:center"><span><b>Todo conectado, todo midiéndose</b> — un sistema que mejora solo.</span></div>
  </div>
  <div class="foot" style="color:${MUT}">El sistema completo · Sandra Clavijo</div>
</section>`);

// 24 · CIERRE
S.push(`<section class="slide cover" data-audio="audio/24.mp3" data-narr="En resumen: pasamos de medir volumen a construir calidad. Tu firma ahora atrae mejor, mide mejor y gasta mejor. Seguimos construyendo, Sandra." style="text-align:center;align-items:center">
  <div style="position:absolute;width:38vw;height:38vw;top:-10vw;right:-8vw;border-radius:50%;filter:blur(72px);background:${GOLD};opacity:.26;animation:drift 20s ease-in-out infinite alternate"></div>
  <div style="position:absolute;width:30vw;height:30vw;bottom:-10vw;left:-6vw;border-radius:50%;filter:blur(72px);background:${NAVY_LT};opacity:.5;animation:drift 24s ease-in-out infinite alternate-reverse"></div>
  <div style="position:relative;z-index:3;max-width:900px">
    <div class="logo" data-say="Tu firma ahora atrae mejor, mide mejor y gasta mejor." style="font-size:clamp(24px,3vw,38px);margin:0 auto">Sandra Clavijo<span>Immigration Law · Miami</span></div>
    <h1 class="title" data-say="pasamos de medir volumen a construir calidad." style="font-size:clamp(2.2rem,5.6vw,4rem);margin-top:1rem;color:#fff">De volumen<br>a calidad</h1>
    <p data-say="Tu firma ahora atrae mejor, mide mejor y gasta mejor." style="font-size:clamp(1.05rem,2.3vw,1.3rem);line-height:1.6;max-width:52ch;margin:1.1rem auto 0;color:rgba(245,239,231,.92)">Tu firma ahora <b style="color:${GOLD_LT}">atrae mejor, mide mejor y gasta mejor</b>.</p>
    <div data-say="Seguimos construyendo, Sandra." style="margin-top:1.4rem;display:inline-flex;align-items:center;gap:.6rem;font-family:'Playfair Display',serif;font-weight:700;background:${GOLD};color:${NAVY_DK};padding:.75rem 1.5rem;border-radius:30px;box-shadow:0 10px 26px -8px rgba(0,0,0,.4);font-size:clamp(1.05rem,2.4vw,1.45rem)">Seguimos construyendo</div>
  </div>
  <div class="foot" style="color:rgba(245,239,231,.5);left:50%;transform:translateX(-50%);text-align:center">Reporte de resultados · Sandra Clavijo Immigration Law · 2026</div>
</section>`);

// ---------- chrome ----------
const CHROME = `</div>
<audio data-bgm loop preload="${WEB?'none':'auto'}" src="${WEB?'bg-elegante.mp3':('data:audio/mpeg;base64,'+BGM)}"></audio>
<div data-caption style="position:fixed;bottom:clamp(4.3rem,9vh,5.6rem);left:50%;transform:translateX(-50%);z-index:50;max-width:min(90vw,820px);text-align:center;background:rgba(39,57,63,.95);color:#fff;backdrop-filter:blur(10px);padding:.7rem 1.3rem;border-radius:16px;font-size:clamp(.9rem,2.2vw,1.05rem);line-height:1.4;border:1.5px solid ${GOLD};opacity:0;transition:opacity .4s;pointer-events:none"></div>
<div style="position:fixed;top:0;left:0;height:4px;z-index:55;background:linear-gradient(90deg,${NAVY},${GOLD});width:0;transition:width .5s" data-progress></div>
<button data-help style="position:fixed;top:.7rem;right:.8rem;z-index:120;cursor:pointer;border:1.5px solid ${GOLD};background:rgba(42,63,72,.92);color:#fff;font-family:'Poppins',sans-serif;font-weight:600;font-size:.76rem;padding:.5rem .9rem;border-radius:30px;display:inline-flex;align-items:center;gap:.4rem;backdrop-filter:blur(6px);box-shadow:0 6px 16px -6px rgba(0,0,0,.5)">${ic('mail',14,GOLD_LT)}¿Necesitas ayuda?</button>
<div data-help-modal style="position:fixed;inset:0;z-index:130;background:rgba(20,30,34,.72);backdrop-filter:blur(4px);display:none;align-items:center;justify-content:center;padding:1rem">
  <div style="background:${CREAM};color:${INK};max-width:440px;width:100%;border-radius:18px;padding:clamp(1.1rem,3vw,1.5rem);box-shadow:0 24px 70px -10px rgba(0,0,0,.6);font-family:'Poppins',sans-serif">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem">
      <h3 style="font-family:'Playfair Display',serif;color:${NAVY};margin:0;font-size:1.3rem">Pedir ayuda</h3>
      <button data-help-close aria-label="cerrar" style="border:none;background:none;font-size:1.6rem;line-height:.8;cursor:pointer;color:${MUT}">&times;</button>
    </div>
    <p style="color:${MUT};font-size:.86rem;margin:.35rem 0 1rem">Cuéntanos qué necesitas y levantamos un ticket para ayudarte.</p>
    <input data-h-name placeholder="Tu nombre" style="width:100%;box-sizing:border-box;border:1.5px solid ${CREAM_DK};border-radius:10px;padding:.6rem .75rem;margin-bottom:.6rem;font-family:inherit;font-size:.9rem;color:${INK}">
    <input data-h-contact placeholder="Tu correo o WhatsApp" style="width:100%;box-sizing:border-box;border:1.5px solid ${CREAM_DK};border-radius:10px;padding:.6rem .75rem;margin-bottom:.6rem;font-family:inherit;font-size:.9rem;color:${INK}">
    <textarea data-h-msg rows="4" placeholder="Describe tu problema o lo que necesitas…" style="width:100%;box-sizing:border-box;border:1.5px solid ${CREAM_DK};border-radius:10px;padding:.6rem .75rem;margin-bottom:.8rem;font-family:inherit;font-size:.9rem;color:${INK};resize:vertical"></textarea>
    <button data-help-send style="width:100%;cursor:pointer;border:none;background:${GOLD};color:${NAVY_DK};font-family:'Poppins',sans-serif;font-weight:700;font-size:.95rem;padding:.7rem;border-radius:12px">Enviar ticket</button>
    <div data-help-ok style="display:none;color:${GREEN};font-size:.86rem;margin-top:.7rem;text-align:center">✓ Listo — se abrió tu correo o WhatsApp con el ticket. Envíalo y te ayudamos.</div>
  </div>
</div>
<button data-cta-play aria-label="Reproducir el reporte" style="position:fixed;left:50%;bottom:clamp(5.6rem,13vh,7.6rem);transform:translateX(-50%);z-index:60;cursor:pointer;border:2px solid ${NAVY};font-family:'Playfair Display',serif;font-weight:700;font-size:clamp(1.05rem,2.6vw,1.4rem);color:${NAVY};background:${GOLD};padding:.8rem 1.6rem;border-radius:40px;box-shadow:0 10px 26px -6px rgba(61,89,100,.6);display:inline-flex;align-items:center;gap:.65rem;animation:ctaPulse 1.6s ease-in-out infinite">
<span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:${NAVY};color:#fff;flex-shrink:0"><svg viewBox="0 0 24 24" style="width:15px;height:15px"><path d="M7 5l12 7-12 7z" fill="currentColor"></path></svg></span>
Reproducir el reporte
</button>
<div style="position:fixed;bottom:clamp(.8rem,2vh,1.3rem);left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:.5rem;z-index:50;background:${NAVY};padding:.45rem .55rem;border-radius:40px;box-shadow:0 8px 20px -6px rgba(39,57,63,.7)">
  <button data-nav-prev aria-label="anterior" style="width:42px;height:42px;border-radius:50%;border:none;background:#fff;color:${NAVY};cursor:pointer;display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px"><path d="M15 5l-7 7 7 7"/></svg></button>
  <button data-play aria-label="reproducir" style="width:48px;height:48px;border-radius:50%;border:none;background:${GOLD};color:${NAVY_DK};cursor:pointer;display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" style="width:18px;height:18px"><path d="M7 5l12 7-12 7z" fill="currentColor"></path></svg></button>
  <span data-counter style="font-family:'Poppins',sans-serif;font-size:.7rem;color:#fff;padding:0 .5rem;letter-spacing:.05em">1 / 26</span>
  <button data-nav-next aria-label="siguiente" style="width:42px;height:42px;border-radius:50%;border:none;background:#fff;color:${NAVY};cursor:pointer;display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px"><path d="M9 5l7 7-7 7"/></svg></button>
</div>
<div style="position:fixed;bottom:clamp(.9rem,2vh,1.4rem);right:1.2rem;font-family:'Poppins',sans-serif;font-size:.62rem;color:rgba(245,239,231,.55);z-index:50">← → · ▶ narrar · F pantalla</div>`;

const JS = `<script>
(function(){
  var slides=[].slice.call(document.querySelectorAll('.slide'));
  var cur=0,playing=false,auto=false,audio=null,timers=[],STEP_MS=2600,GAP_MS=400;
  var PLAY='<svg viewBox="0 0 24 24" style="width:18px;height:18px"><path d="M7 5l12 7-12 7z" fill="currentColor"></path></svg>';
  var PAUSE='<svg viewBox="0 0 24 24" style="width:18px;height:18px" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"></rect><rect x="14" y="5" width="4" height="14" rx="1"></rect></svg>';
  function q(s){return document.querySelector(s);}
  var caption=q('[data-caption]'),playBtn=q('[data-play]'),counter=q('[data-counter]'),progress=q('[data-progress]'),cta=q('[data-cta-play]');
  var bgm=q('[data-bgm]');if(bgm){bgm.volume=0.0;}
  function bgmPlay(){if(!bgm)return;var p=bgm.play();if(p&&p.catch)p.catch(function(){});var v=bgm.volume;var t=setInterval(function(){v=Math.min(0.022,v+0.003);bgm.volume=v;if(v>=0.022)clearInterval(t);},90);}
  function bgmStop(){if(!bgm)return;var v=bgm.volume;var t=setInterval(function(){v=Math.max(0,v-0.02);bgm.volume=v;if(v<=0){clearInterval(t);try{bgm.pause();}catch(e){}}},70);}
  function hideCTA(){if(cta){cta.style.opacity='0';cta.style.pointerEvents='none';setTimeout(function(){cta.style.display='none';},300);}}
  function clearTimers(){timers.forEach(clearTimeout);timers=[];if(audio){try{audio.pause();}catch(e){}audio=null;}}
  function showCaption(t){if(!caption)return;if(!t){caption.style.opacity='0';return;}caption.innerHTML=t;caption.style.opacity='1';}
  function units(s){return [].slice.call(s.querySelectorAll('[data-say]'));}
  var CACHE={};
  function prefetch(i){if(i<0||i>=slides.length)return;var src=slides[i].getAttribute('data-audio');if(!src||src.indexOf('data:')===0||CACHE[src])return;try{var a=new Audio();a.preload='auto';a.src=src;CACHE[src]=a;}catch(e){}}
  function preloadSeq(i){if(i>=slides.length)return;var src=slides[i].getAttribute('data-audio');if(!src||src.indexOf('data:')===0){preloadSeq(i+1);return;}var a=CACHE[src];if(!a){a=new Audio();a.preload='auto';a.src=src;CACHE[src]=a;}var nxt=function(){preloadSeq(i+1);};if(a.readyState>=3){nxt();}else{a.addEventListener('canplaythrough',nxt,{once:true});a.addEventListener('error',nxt,{once:true});}}
  function loadAll(){if(bgm){bgm.preload='auto';try{bgm.load();}catch(e){}}preloadSeq(0);}
  function hideEl(el){el.style.opacity='0';el.style.transform='translateY(20px) scale(.99)';}
  function countUp(el){if(el.getAttribute('data-cnt')==='1')return;var t=el.textContent.trim();if(!/^\\d{1,3}(\\.\\d{3})+$|^\\d+$/.test(t))return;var target=parseInt(t.replace(/\\./g,''),10);if(!isFinite(target)||target<1)return;el.setAttribute('data-cnt','1');var dur=750,st=null;function step(ts){if(!st)st=ts;var p=Math.min(1,(ts-st)/dur);var e=1-Math.pow(1-p,3);el.textContent=Math.round(target*e).toLocaleString('es-CO');if(p<1)requestAnimationFrame(step);else el.textContent=t;}requestAnimationFrame(step);}
  function fadeIn(s){s.style.display='flex';s.style.opacity='0';requestAnimationFrame(function(){requestAnimationFrame(function(){s.style.opacity='1';});});}
  function showEl(el){el.style.opacity='1';el.style.transform='none';if(el.querySelectorAll){el.querySelectorAll('[data-w]').forEach(function(b){b.style.width=b.getAttribute('data-w')+'%';});el.querySelectorAll('.num').forEach(countUp);}if(el.classList&&el.classList.contains('num'))countUp(el);}
  function reset(s){units(s).forEach(hideEl);s.querySelectorAll('[data-w]').forEach(function(b){b.style.width='0';});s.querySelectorAll('.num').forEach(function(n){n.removeAttribute('data-cnt');});}
  function revealAll(s){units(s).forEach(showEl);}
  function chrome(){if(counter)counter.textContent=(cur+1)+' / '+slides.length;if(progress)progress.style.width=((cur+1)/slides.length*100)+'%';}
  function advance(){if(cur>=slides.length-1)return;slides[cur].style.display='none';reset(slides[cur]);cur++;fadeIn(slides[cur]);chrome();}
  function playFrom(isAuto){
    clearTimers();
    var slide=slides[cur],us=units(slide),src=slide.getAttribute('data-audio'),done=false,lastCap='';
    function chainDone(){if(done)return;done=true;if(auto&&cur<slides.length-1){timers.push(setTimeout(function(){showCaption('');advance();playFrom(false);},GAP_MS));}else{bgmStop();playing=false;auto=false;if(playBtn)playBtn.innerHTML=PLAY;}}
    function begin(total){
      hideCTA();bgmPlay();reset(slide);playing=true;if(playBtn)playBtn.innerHTML=PAUSE;
      us.forEach(function(el,i){
        var at=el.getAttribute('data-at');
        var ms=(at!=null&&at!=='')?Math.max(0,parseFloat(at)*1000):(i/Math.max(1,us.length))*total;
        timers.push(setTimeout(function(){showEl(el);var say=el.getAttribute('data-say');if(say&&say!==lastCap){lastCap=say;showCaption(say);}},Math.round(ms)));
      });
      timers.push(setTimeout(chainDone,Math.round(total)+(src?2700:800)));
    }
    if(src){var a=CACHE[src]||new Audio(src);CACHE[src]=a;audio=a;try{a.currentTime=0;}catch(e){}a.play().then(function(){var total=(isFinite(a.duration)&&a.duration>0)?a.duration*1000:us.length*STEP_MS;a.addEventListener('ended',chainDone,{once:true});begin(total);}).catch(function(){audio=null;if(isAuto){playing=false;auto=false;return;}begin(us.length*STEP_MS);});}
    else{if(isAuto)return;begin(us.length*STEP_MS);}
  }
  function stop(){clearTimers();bgmStop();playing=false;auto=false;if(playBtn)playBtn.innerHTML=PLAY;showCaption('');var s=slides[cur];if(s)revealAll(s);}
  function go(d){hideCTA();stop();var n=cur+d;if(n<0||n>=slides.length)return;slides[cur].style.display='none';reset(slides[cur]);cur=n;var s=slides[cur];fadeIn(s);revealAll(s);chrome();}
  function toggle(){if(playing){stop();}else{auto=true;playFrom(false);}}
  var prev=q('[data-nav-prev]'),next=q('[data-nav-next]');
  if(prev)prev.addEventListener('click',function(){go(-1);});
  if(next)next.addEventListener('click',function(){go(1);});
  if(playBtn)playBtn.addEventListener('click',toggle);
  if(cta)cta.addEventListener('click',function(){auto=true;playFrom(false);});
  document.addEventListener('keydown',function(e){if((hModal&&hModal.style.display==='flex')||/INPUT|TEXTAREA/.test((e.target&&e.target.tagName)||''))return;if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();go(1);}else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();go(-1);}else if(e.key===' '){e.preventDefault();toggle();}else if(e.key==='f'||e.key==='F'){if(!document.fullscreenElement)document.documentElement.requestFullscreen().catch(function(){});else document.exitFullscreen().catch(function(){});}});
  if(slides[0]){fadeIn(slides[0]);revealAll(slides[0]);}chrome();
  loadAll();
  auto=true;playFrom(true);
  // ---- Botón de ayuda / ticket ----
  var hBtn=q('[data-help]'),hModal=q('[data-help-modal]'),hClose=q('[data-help-close]'),hSend=q('[data-help-send]');
  function hShow(v){if(hModal)hModal.style.display=v?'flex':'none';}
  if(hBtn)hBtn.addEventListener('click',function(){stop();hShow(true);});
  if(hClose)hClose.addEventListener('click',function(){hShow(false);});
  if(hModal)hModal.addEventListener('click',function(e){if(e.target===hModal)hShow(false);});
  if(hSend)hSend.addEventListener('click',function(){
    var gv=function(s){var el=q(s);return el?el.value.trim():'';};
    var n=gv('[data-h-name]'),c=gv('[data-h-contact]'),m=gv('[data-h-msg]');
    if(!m){var t=q('[data-h-msg]');if(t){t.style.borderColor='#B5564F';t.focus();}return;}
    var body='Nombre: '+n+'\\nContacto: '+c+'\\n\\nProblema:\\n'+m;
    var WA='${HELP_WA}', EMAIL='${HELP_EMAIL}';
    if(WA){window.open('https://wa.me/'+WA+'?text='+encodeURIComponent('Hola, necesito ayuda con mi caso.\\n\\n'+body),'_blank');}
    else{window.location.href='mailto:'+EMAIL+'?subject='+encodeURIComponent('Ticket de ayuda — Reporte Sandra Clavijo')+'&body='+encodeURIComponent(body);}
    var ok=q('[data-help-ok]');if(ok)ok.style.display='block';
  });
})();
</script></body></html>`;

const html = HEAD + '\n' + S.join('\n') + '\n' + CHROME + '\n' + JS;
writeFileSync('c:/clientes/Sandra Clavijo/reporte-sandra/index.html', html);
console.log('slides:', S.length, '· data-say:', (html.match(/data-say=/g)||[]).length, '· KB:', Math.round(html.length/1024));
