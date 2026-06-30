import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const ENV='c:/clientes/Merge/loymark-academy/.env';
function key(){const r=readFileSync(ENV,'utf8');for(const l of r.split(/\r?\n/)){const m=l.match(/^\s*ELEVENLABS_API_KEY\s*=\s*(.*)\s*$/);if(m)return m[1].trim().replace(/^["']|["']$/g,'');}}
const K=key();
const OUT='c:/clientes/Sandra Clavijo/reporte-sandra/voces-muestra';
mkdirSync(OUT,{recursive:true});
const TXT='Hola Sandra. Este es el reporte de resultados de tu firma. Y la verdad, este período hicimos muchísimo para atraer mejores clientes, con datos reales y sin adornos.';
const SET={stability:0.35,similarity_boost:0.85,style:0.30,use_speaker_boost:true,speed:1.0};
const voces=[
  ['1-David', 'dQ0C8BEdKF2odmELvNee'],
  ['2-Superior', 'IaUx9NjPDJeDAwpNQMW2'],
  ['3-Cristian', 'WZOxu5tVZTrgbKo1DIXH'],
  ['4-Camila', 'kmcS4vnMNzneqDSErHEd'],
];
for(const [name,id] of voces){
  process.stdout.write('  '+name+' … ');
  const res=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${id}?output_format=mp3_44100_192`,{method:'POST',headers:{'xi-api-key':K,'Content-Type':'application/json'},body:JSON.stringify({text:TXT,model_id:'eleven_multilingual_v2',voice_settings:SET})});
  if(!res.ok){console.log('ERROR '+res.status+' '+(await res.text()).slice(0,80));continue;}
  const buf=Buffer.from(await res.arrayBuffer());
  writeFileSync(OUT+'/'+name+'.mp3',buf);
  console.log('✓ '+(buf.length/1024).toFixed(0)+'KB');
  await new Promise(r=>setTimeout(r,400));
}
console.log('\nMuestras en:', OUT);
