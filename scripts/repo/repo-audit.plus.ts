import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";
const pexec = promisify(execFile);

async function run(cmd:string, args:string[]) {
  try { const { stdout } = await pexec(cmd, args); return { ok:true, out: stdout }; }
  catch (e:any) { return { ok:false, out: e.stdout || e.message || "" }; }
}
async function rg(pattern:string, globs:string[]=["-g","!node_modules"]){
  const bin = process.platform==="win32"?"rg.exe":"rg";
  return run(bin, ["-n","--hidden",...globs, pattern]);
}

async function checkGitFsck(){ return run("git", ["fsck","--full","--strict"]); }
async function checkForbiddenTokens(){
  const tokens = ["\\bquadran-lock\\b","password123","TODO: remove this"];
  const hits:any[]=[];
  for (const t of tokens){
    const r = await rg(t);
    if (r.out.trim()) hits.push({ token:t, lines:r.out.split("\n").filter(Boolean).slice(0,50) });
  }
  return { ok: hits.length===0, hits };
}
async function checkCommitSigning() {
  const r = await run("git", ["log","-n","20","--pretty=%G?"]);
  // '%' = bad, 'N' = no signature
  const bad = (r.out||"").split("\n").filter(x => x==="N" || x==="%").length;
  return { ok: bad===0, unsigned: bad };
}
async function checkBranchProtectionHint() {
  // local hint only: ensure main exists and not ahead of origin
  const r1 = await run("git", ["rev-parse","--abbrev-ref","HEAD"]);
  const onMain = /main/.test(r1.out.trim());
  return { ok: onMain, reason: onMain?"":"not-on-main" };
}

function score(parts:{ok:boolean}[]) {
  const base = Math.round(100 * parts.filter(p=>p.ok).length / parts.length);
  return Math.max(0, Math.min(100, base));
}

(async ()=>{
  const fsck = await checkGitFsck();
  const forb = await checkForbiddenTokens();
  const sign = await checkCommitSigning();
  const prot = await checkBranchProtectionHint();

  const items = [fsck, forb, sign, prot];
  const s = score(items);
  const report = {
    score: s,
    fsck: fsck.ok,
    forbiddenTokens: forb,
    commitSigningOK: sign.ok,
    branchMain: prot.ok
  };
  fs.mkdirSync("reports",{recursive:true});
  fs.writeFileSync("reports/REPO_AUDIT_REPORT.md", JSON.stringify(report,null,2));
  console.log(`Repo health: ${s}/100`);
  if (s < 70) process.exit(5);
})();
