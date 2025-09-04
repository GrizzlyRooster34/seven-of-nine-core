import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
export function checkSemanticNonce(ctx:{nonce:string;issuedAt:number;context:string}) {
  const dbPath="runtime/q3_nonce_db.json"; if(!existsSync("runtime")) mkdirSync("runtime",{recursive:true});
  const db = existsSync(dbPath)? JSON.parse(readFileSync(dbPath,"utf8")) : { used:{} as Record<string,number> };
  const now=Date.now(), ttl=90_000;
  if(!ctx?.nonce) return { ok:false, reason:"nonce-missing" };
  if(now - (ctx.issuedAt||0) > ttl) return { ok:false, reason:"nonce-expired" };
  if(!/^seven-core\//.test(ctx.context||"")) return { ok:false, reason:"bad-context" };
  if(db.used[ctx.nonce]) return { ok:false, reason:"nonce-replay" };
  db.used[ctx.nonce]=now; writeFileSync(dbPath, JSON.stringify(db));
  return { ok:true };
}
