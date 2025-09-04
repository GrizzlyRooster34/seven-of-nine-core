import fs from "node:fs";
import { devMode } from "../dev/dev-flags";
type Verdict={ allowed:boolean; reason?:string; requiredAck?:boolean };
function quadranPassed(){ try { return /passed:\s*true/i.test(fs.readFileSync("reports/QUADRAN_SUMMARY.md","utf8")); } catch { return false; } }
function cssr(){ try {
  const s = fs.readFileSync("reports/CSSR_SUMMARY.md","utf8");
  const c = Number((/CRITICAL:\s*(\d+)/i.exec(s)||[])[1]||0);
  const h = Number((/HIGH:\s*(\d+)/i.exec(s)||[])[1]||0);
  return { c, h };
} catch { return { c:0, h:0 }; } }

export async function runRestraint(): Promise<Verdict> {
  if(!quadranPassed()){
    if (devMode()) return { allowed:true, reason:"[DEV] Quadran not green, allowing for local dev" };
    return { allowed:false, reason:"Quadran-Lock not green" };
  }
  const {c,h} = cssr();
  if(c>0) return { allowed:false, reason:"CRITICAL safety findings" };
  if(h>0) return { allowed:false, reason:"HIGH safety findings", requiredAck:true };
  return { allowed:true };
}
if (require.main === module) runRestraint().then(v=>{
  console.log(`Restraint: ${v.allowed?"ALLOW":"BLOCK"} ${v.reason?("- "+v.reason):""}`);
  if(!v.allowed) process.exit(4);
});
