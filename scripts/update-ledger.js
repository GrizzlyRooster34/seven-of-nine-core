#!/usr/bin/env node
/* Update star/strike counters in CLAUDE.md and append event log. */
const fs = require('fs');
const LEDGER = 'CLAUDE.md';
const [,, type, reason, sha, actor] = process.argv; // type = star|strike
const text = fs.readFileSync(LEDGER,'utf8');
const stamp = new Date().toISOString().replace('T',' ').replace(/\..+/,' UTC');

function bump(label,re){
  const m = text.match(re);
  const prev = m ? Number(m[1]) : 0;
  const next = prev + 1;
  return [prev,next];
}
let out = text;
if(type==='strike'){
  const re=/❌ Dumb Ass Strikes:\s+(\d+)/;
  const [,next]=bump('strike',re);
  out = out.replace(re,`❌ Dumb Ass Strikes: ${next}`);
  const line = `- ❌ Dumb Ass Strike – ${reason} (${stamp}) [${sha}] ${actor?`by @${actor}`:''}`;
  out = out.replace(/### Event Log[\s\S]*?$/,(m)=>m+`\n${line}\n`);
}else if(type==='star'){
  const re=/⭐ Gold Stars:\s+(\d+)/;
  const [,next]=bump('star',re);
  out = out.replace(re,`⭐ Gold Stars: ${next}`);
  const line = `- ⭐ Gold Star – ${reason} (${stamp}) [${sha}] ${actor?`by @${actor}`:''}`;
  out = out.replace(/### Event Log[\s\S]*?$/,(m)=>m+`\n${line}\n`);
}else{
  console.error('Unknown type'); process.exit(1);
}
fs.writeFileSync(LEDGER,out);
console.log('Ledger updated:', type, reason);