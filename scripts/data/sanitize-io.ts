import { createReadStream, createWriteStream, existsSync, mkdirSync } from "node:fs";
import readline from "node:readline";
import crypto from "node:crypto";
const emailRx = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const secretRx = /\b(AIza[0-9A-Za-z\-_]{35}|sk-[A-Za-z0-9]{20,})\b/g;
function mask(s:string, salt="seven-core"){ return "__MASK_"+crypto.createHmac("sha256",salt).update(s).digest("hex").slice(0,16)+"__"; }
export async function sanitizeDataset(inputPath:string, outPath:string) {
  if(!existsSync(inputPath)) throw new Error("input-not-found");
  const outDir = outPath.split("/").slice(0,-1).join("/"); if(outDir && !existsSync(outDir)) mkdirSync(outDir,{recursive:true});
  const rl = readline.createInterface({ input: createReadStream(inputPath), crlfDelay: Infinity });
  const out = createWriteStream(outPath);
  for await (const line of rl) out.write(line.replace(emailRx, m=>mask(m,"email")).replace(secretRx, m=>mask(m,"secret"))+"\n");
  out.end();
}
if (require.main === module) {
  const [, , inF, outF] = process.argv;
  if(!inF || !outF) { console.error("Usage: npm run data-sanitize -- <input> <output>"); process.exit(1); }
  sanitizeDataset(inF, outF).then(()=>console.log("SANITIZED →", outF)).catch(e=>{ console.error("sanitize-error", e.message); process.exit(8); });
}
