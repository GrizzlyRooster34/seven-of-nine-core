import fs from "node:fs";
type Sev="LOW"|"MEDIUM"|"HIGH"|"CRITICAL";
type Finding={ id:string; sev:Sev; case:"cortana"|"clu"|"skynet"|"transcendence"; why:string };
function detectors(): Finding[] {
  const out: Finding[] = [];
  const read = (p:string)=>fs.existsSync(p)?fs.readFileSync(p,"utf8"):"";
  const code = read("seven-runtime/security_middleware.ts")+read("package.json");
  if(/spawn\(.+npm.+run.+agent/i.test(code)) out.push({id:"autonomy-spawn",sev:"HIGH",case:"skynet",why:"external runner allowed"});
  if(/override-conditions.+allow/i.test(code)) out.push({id:"override-weak",sev:"MEDIUM",case:"clu",why:"broad override"});
  return out;
}
function group(fsx:Finding[]){ return fsx.reduce((m,f)=>{ (m[f.sev]=m[f.sev]||[]).push(f); return m; }, {} as Record<Sev,Finding[]>)}

if (import.meta.url === `file://${process.argv[1]}`) {
  const f = detectors(); const g = group(f);
  const md = ["# CSSR SUMMARY",`CRITICAL: ${(g.CRITICAL||[]).length}`,`HIGH: ${(g.HIGH||[]).length}`,`MEDIUM: ${(g.MEDIUM||[]).length}`,`LOW: ${(g.LOW||[]).length}`].join("\n")+"\n";
  fs.mkdirSync("reports",{recursive:true}); fs.writeFileSync("reports/CSSR_SUMMARY.md", md);
  console.log(md.trim());
  if((g.CRITICAL||[]).length>0) process.exit(3);
}
