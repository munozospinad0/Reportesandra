import { readFileSync, writeFileSync } from 'node:fs';
const ENV='c:/clientes/Merge/loymark-academy/.env';
function key(){const r=readFileSync(ENV,'utf8');for(const l of r.split(/\r?\n/)){const m=l.match(/^\s*ELEVENLABS_API_KEY\s*=\s*(.*)\s*$/);if(m)return m[1].trim().replace(/^["']|["']$/g,'');}}
const K=key();
const prompt='Elegant, calm and professional instrumental background music for a premium immigration law firm results presentation. Soft solo piano with warm sustained strings, hopeful, reassuring and refined, slow tempo, minimal, no drums, no beat, gentle and unobtrusive, suitable to loop quietly under a narrator.';
const body={ prompt, music_length_ms: 45000 };
const res=await fetch('https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128',{method:'POST',headers:{'xi-api-key':K,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('status', res.status, res.headers.get('content-type'));
if(!res.ok){ console.log('ERROR', (await res.text()).slice(0,300)); process.exit(1); }
const buf=Buffer.from(await res.arrayBuffer());
writeFileSync('c:/clientes/Sandra Clavijo/reporte-sandra/bg-elegante.mp3', buf);
console.log('OK · bg-elegante.mp3', (buf.length/1024).toFixed(0)+'KB');
