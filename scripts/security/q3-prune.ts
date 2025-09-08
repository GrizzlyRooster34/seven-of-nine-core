import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";

const p="runtime/q3_nonce_db.json";
if(!existsSync("runtime")) mkdirSync("runtime",{recursive:true});
const db = existsSync(p)? JSON.parse(readFileSync(p,"utf8")) : { used:{} as Record<string,number> };
const now=Date.now(), ttl = 24*60*60*1000;
let kept=0, dropped=0; const next:Record<string,number> = {};
for (const [k,v] of Object.entries(db.used||{})) { if (now - (v as number) < ttl) { next[k]=v as number; kept++; } else { dropped++; } }
writeFileSync(p, JSON.stringify({ used: next }, null, 2));
console.log(`nonce prune: kept=${kept} dropped=${dropped}`);
