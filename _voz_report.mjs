import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

/* Narración del reporte de Sandra — ElevenLabs voz David, /with-timestamps.
   Embebe cada mp3 como base64 en data-audio + inyecta data-at (sync palabra).
   RESILIENTE: si la API falla (p.ej. cuota), reutiliza el mp3 en disco (sin
   re-sync) y SIEMPRE escribe el HTML final. FORCE=1 regenera todo desde la API. */

const ENV   = 'c:/clientes/Merge/loymark-academy/.env';
const DECK  = 'c:/clientes/Sandra Clavijo/reporte-sandra/index.html';
const ADIR  = 'c:/clientes/Sandra Clavijo/reporte-sandra/audio';
const VOICE = 'dQ0C8BEdKF2odmELvNee';            // David
const MODEL = 'eleven_multilingual_v2';
const FMT   = 'mp3_44100_192';   // Creator: mayor calidad de audio
const SET   = { stability:0.34, similarity_boost:0.85, style:0.30, use_speaker_boost:true, speed:1.0 }; // mas natural/humano
const LEAD  = 0.10;
const FORCE = process.env.FORCE === '1';

function readKey(){ const raw=readFileSync(ENV,'utf8'); for(const l of raw.split(/\r?\n/)){const m=l.match(/^\s*ELEVENLABS_API_KEY\s*=\s*(.*)\s*$/); if(m)return m[1].trim().replace(/^["']|["']$/g,'');} return null; }
const KEY = readKey(); if(!KEY){ console.error('Falta ELEVENLABS_API_KEY'); process.exit(1); }

const decode = (s)=> s.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
// guion natural: NO forzar fonéticas raras; el modelo multilingüe lee bien.
// Solo se evitan acrónimos deletreados reescribiendo el texto del guion (CRM, GA) arriba.
const spoken = (t)=> t
  .replace(/\bGTM\b/g,'gestor de etiquetas')
  .replace(/\bIA\b/g,'inteligencia artificial');
const norm = (t)=> spoken(decode(t));

async function tts(text){
  const url=`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}/with-timestamps?output_format=${FMT}`;
  const res=await fetch(url,{method:'POST',headers:{'xi-api-key':KEY,'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({text,model_id:MODEL,voice_settings:SET})});
  if(!res.ok){const d=await res.text().catch(()=> ''); throw new Error('HTTP '+res.status+' '+d.slice(0,120));}
  const j=await res.json();
  const al=j.alignment||j.normalized_alignment||{};
  return { audio:Buffer.from(j.audio_base64,'base64'), chars:(al.characters||[]), starts:(al.character_start_times_seconds||[]) };
}

let html=readFileSync(DECK,'utf8');
mkdirSync(ADIR,{recursive:true});

const sectionRe=/<section[\s\S]*?<\/section>/g;
const sections=html.match(sectionRe)||[];
console.log('secciones:', sections.length, FORCE?'· FORCE':'');
let idx=0, totalKB=0, okSync=0, okReuse=0, noAudio=0;
for(let sIdx=0;sIdx<sections.length;sIdx++){
  let sec=sections[sIdx];
  const narrM=sec.match(/data-narr="([^"]*)"/);
  const audM=sec.match(/data-audio="([^"]*)"/);
  if(!narrM||!audM){ continue; }
  idx++;
  const name=String(idx).padStart(2,'0');
  const mp3path=ADIR+'/'+name+'.mp3';
  const spokenNarr=norm(narrM[1]);
  const jsonpath=ADIR+'/'+name+'.json';
  let audio=null, chars=[], starts=[], synced=false;
  try{
    if(!FORCE && existsSync(mp3path)){ // reusar sin gastar cuota; recuperar sync del cache json
      audio=readFileSync(mp3path);
      if(existsSync(jsonpath)){ try{ const j=JSON.parse(readFileSync(jsonpath,'utf8')); chars=j.chars||[]; starts=j.starts||[]; synced=(chars.length>0); }catch(e){} }
    }
    else { const r=await tts(spokenNarr); audio=r.audio; chars=r.chars; starts=r.starts; synced=true; writeFileSync(mp3path, audio); writeFileSync(jsonpath, JSON.stringify({chars,starts})); await new Promise(r=>setTimeout(r,400)); }
  }catch(e){
    if(existsSync(mp3path)){ audio=readFileSync(mp3path); }
    else { noAudio++; console.log('  slide '+name+' SIN audio ('+e.message.slice(0,48)+') → texto+caption'); continue; }
  }
  if(!audio){ noAudio++; continue; }
  totalKB+=audio.length/1024;
  if(synced){
    const joined=chars.join('');
    const sayVals=[...new Set([...sec.matchAll(/data-say="([^"]*)"/g)].map(m=>m[1]))];
    for(const v of sayVals){
      const cue=norm(v).trim(); let pos=joined.indexOf(cue);
      if(pos<0){ pos=joined.indexOf(cue.split(/\s+/).slice(0,4).join(' ')); }
      if(pos<0) continue;
      const at=Math.max(0,(starts[pos]||0)-LEAD);
      sec=sec.split('data-say="'+v+'"').join('data-say="'+v+'" data-at="'+at.toFixed(2)+'"');
    }
    okSync++;
  } else { okReuse++; }
  sec=sec.replace('data-audio="'+audM[1]+'"','data-audio="data:audio/mpeg;base64,'+audio.toString('base64')+'"');
  html=html.replace(sections[sIdx], sec);
  console.log('  ✓ '+name+' '+(audio.length/1024).toFixed(0)+'KB '+(synced?'(sync)':'(reuso)'));
}
writeFileSync(DECK, html);
console.log('\naudio total:', Math.round(totalKB),'KB · con sync:', okSync, '· reusados:', okReuse, '· sin audio:', noAudio);
console.log('data-at:', (html.match(/data-at=/g)||[]).length, '· data:audio embebidos:', (html.match(/data:audio\/mpeg/g)||[]).length, '· index KB:', Math.round(html.length/1024));
