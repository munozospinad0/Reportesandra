import { readFileSync, writeFileSync } from 'node:fs';
const ENV='c:/clientes/Merge/loymark-academy/.env';
function key(){const r=readFileSync(ENV,'utf8');for(const l of r.split(/\r?\n/)){const m=l.match(/^\s*ELEVENLABS_API_KEY\s*=\s*(.*)\s*$/);if(m)return m[1].trim().replace(/^["']|["']$/g,'');}}
const K=key();
const prompt='Soft ambient background drone for a calm professional presentation. Warm sustained string pad and very faint piano, extremely gentle and EVEN in volume from start to finish, no crescendos, no swells, no dynamic changes, no percussion, no melody peaks, no sharp or loud moments at all. Flat, smooth, minimal, almost imperceptible, meant to sit quietly under a narrator on a loop without ever drawing attention.';
const body={ prompt, music_length_ms: 45000 };
const res=await fetch('https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128',{method:'POST',headers:{'xi-api-key':K,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('status', res.status, res.headers.get('content-type'));
if(!res.ok){ console.log('ERROR', (await res.text()).slice(0,300)); process.exit(1); }
const buf=Buffer.from(await res.arrayBuffer());
writeFileSync('c:/clientes/Sandra Clavijo/reporte-sandra/bg-elegante.mp3', buf);
console.log('OK · bg-elegante.mp3', (buf.length/1024).toFixed(0)+'KB');
