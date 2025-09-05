#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const banned = [
  /\bquadran-lock\b/i,       // legacy no-hyphen
  /\bquadralock\b/i,        // missing "n"
  /\bquadran[_ .]lock\b/i   // underscore/space/dot variants
];

const ignore = new Set(['node_modules','.git','dist','build','out','.next']);
function allFiles(dir){
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
    if (ignore.has(e.name)) return [];
    const p=path.join(dir,e.name);
    return e.isDirectory()?allFiles(p):[p];
  });
}
const files = allFiles(process.cwd());
const hits=[];
for(const f of files){
  const t=fs.readFileSync(f,'utf8');
  for(const rx of banned){ if(rx.test(t)) hits.push([f,rx]); }
}
if(hits.length){
  console.error('🚨 DUMB ASS PROTOCOL ACTIVATED');
  hits.forEach(([f,rx])=>console.error(` - ${f} :: ${rx}`));
  console.error('👉 Pull head from anus and get smarter.');
  process.exit(1);
}
console.log('✅ No forbidden Quadran/Quadra token violations.');