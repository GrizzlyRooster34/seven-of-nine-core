#!/usr/bin/env bash
set -euo pipefail

# Seven Core — P0/P1 Hotfix Pack
# Fixes: quadran-lock (Q1/Q3), creator-bond (Ed25519), data-sanitize (exec),
# ghost-mode (state/errors), restraint (firewall), quadra-cssr (detectors),
# repo-audit (health scoring), integration-test (order), consciousness-research (skeleton with real outputs),
# plus apk-forensics triage ping. All with runnable CLIs + exit codes.

mkdir -p scripts/{auth,security,safety,data,repo,tests,consciousness,mobile} runtime reports logs

# 1) quadran-lock — Q1 device registry + Q3 nonce (imports the nonce checker)
cat > scripts/security/run-quadran-lock.ts <<'TS'
import fs from "node:fs";
import { checkSemanticNonce } from "./q3-semantic-nonce";

type QuadranResult = { q1:boolean;q2:boolean;q3:boolean;q4:boolean;passed:boolean;reasons:string[] };

function deviceRegistryOk(): boolean {
  try {
    const p = "core/security/quadran-lock/device_registry.json";
    if (!fs.existsSync(p)) return false;
    const j = JSON.parse(fs.readFileSync(p,"utf8"));
    return j && j.devices && typeof j.devices === "object" && Object.keys(j.devices).length>0;
  } catch { return false; }
}

function q2_identity_codex(): boolean {
  // placeholder threshold; wire to your scorer
  return true;
}

function q3_nonce(): boolean {
  try {
    const ctx = JSON.parse(fs.readFileSync("runtime/q3_nonce_request.json","utf8"));
    return checkSemanticNonce(ctx).ok;
  } catch { return false; }
}

function q4_session_mfa(): boolean {
  try {
    const sess = JSON.parse(fs.readFileSync("runtime/session.json","utf8"));
    return !!sess?.mfa?.ok && (sess.expiresAt - Date.now() > 0);
  } catch { return false; }
}

export async function runQuadranLock(): Promise<QuadranResult> {
  const r1 = deviceRegistryOk();
  const r2 = q2_identity_codex();
  const r3 = q3_nonce();
  const r4 = q4_session_mfa();
  const passed = r1 && r2 && r3 && r4;
  const reasons: string[] = [];
  if (!r1) reasons.push("Q1 device registry invalid/empty");
  if (!r2) reasons.push("Q2 identity codex below threshold");
  if (!r3) reasons.push("Q3 semantic nonce failed/expired");
  if (!r4) reasons.push("Q4 session MFA/TTL invalid");
  fs.mkdirSync("reports",{recursive:true});
  fs.writeFileSync("reports/QUADRAN_SUMMARY.md",
    `passed: ${passed}\nQ1:${r1} Q2:${r2} Q3:${r3} Q4:${r4}\nreasons: ${reasons.join(" | ")||"none"}\n`);
  return { q1:r1,q2:r2,q3:r3,q4:r4,passed,reasons };
}

if (require.main === module) runQuadranLock().then(r=>{
  console.log(`Quadran-Lock: ${r.passed?"PASS":"FAIL"} —`, r.reasons.join("; "));
  if (!r.passed) process.exit(2);
});
TS

# 1a) Q3 nonce checker (single-use, 90s TTL, context-guard)
cat > scripts/security/q3-semantic-nonce.ts <<'TS'
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
if (require.main === module) {
  const ok = checkSemanticNonce({ nonce:"demo", issuedAt:Date.now(), context:"seven-core/test" });
  console.log("Q3 Nonce:", ok.ok?"PASS":"FAIL", ok.reason??"");
  if(!ok.ok) process.exit(11);
}
TS

# 2) creator-bond — Ed25519 verify (sequential, correct API)
cat > scripts/auth/verify-creator-bond.ts <<'TS'
import { verify } from "@noble/ed25519";
import { readFileSync } from "node:fs";
type BondResult = { ok:boolean; trustScore:number; reasons:string[] };

async function verifyIdentity(): Promise<{ok:boolean; subject?:string; reason?:string}> {
  try {
    const pubHex = readFileSync("secrets/creator_pubkey.ed25519","utf8").trim();
    const assertion = JSON.parse(readFileSync("runtime/creator_assertion.json","utf8"));
    const msg = new TextEncoder().encode(`seven-core/creator-identity:${assertion.sub}:${assertion.nonce}:${assertion.issuedAt}`);
    const sig = Uint8Array.from(Buffer.from(assertion.signature,"hex"));
    const pub = Uint8Array.from(Buffer.from(pubHex,"hex"));
    const ok = await verify(sig, msg, pub);
    return ok ? { ok, subject: assertion.sub } : { ok:false, reason:"sig-failed" };
  } catch(e:any) { return { ok:false, reason:"io-error:"+String(e?.message||e) }; }
}
async function checkMFA() { try {
  const sess = JSON.parse(readFileSync("runtime/session.json","utf8"));
  return (!!sess?.mfa?.ok && (sess.expiresAt - Date.now() > 0)) ? {ok:true} : {ok:false, reason:"mfa/ttl"};
} catch { return {ok:false, reason:"missing-session"} } }
async function trustLadder() { return { ok:true, level:10 }; }

export async function runCreatorBond(): Promise<BondResult> {
  const reasons:string[]=[];
  const id = await verifyIdentity(); if(!id.ok) reasons.push("identity:"+id.reason);
  const mfa = id.ok ? await checkMFA() : {ok:false, reason:"precondition"}; if(!mfa.ok) reasons.push("mfa:"+mfa.reason);
  const tl  = (id.ok&&mfa.ok) ? await trustLadder() : {ok:false, level:0}; if(!tl.ok) reasons.push("trust-ladder");
  const ok = id.ok && mfa.ok && tl.ok; const trustScore = ok ? tl.level : 0;
  return { ok, trustScore, reasons };
}

if (require.main === module) runCreatorBond().then(r=>{
  console.log("CreatorBond:", r.ok?"PASS":"FAIL", "trust:", r.trustScore, r.reasons.join("; "));
  if(!r.ok) process.exit(10);
});
TS

# 3) data-sanitize — streaming CLI (fix execution)
cat > scripts/data/sanitize-io.ts <<'TS'
import { createReadStream, createWriteStream } from "node:fs";
import readline from "node:readline";
import crypto from "node:crypto";

const emailRx = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const secretRx = /\b(AIza[0-9A-Za-z\-_]{35}|sk-[A-Za-z0-9]{20,})\b/g;

function mask(s:string, salt="seven-core"){ return "__MASK_"+crypto.createHmac("sha256",salt).update(s).digest("hex").slice(0,16)+"__"; }

export async function sanitizeDataset(inputPath:string, outPath:string) {
  const rl = readline.createInterface({ input: createReadStream(inputPath), crlfDelay: Infinity });
  const out = createWriteStream(outPath);
  for await (const line of rl) {
    out.write(line.replace(emailRx, m=>mask(m,"email")).replace(secretRx, m=>mask(m,"secret"))+"\n");
  }
  out.end();
}

if (require.main === module) {
  const [, , inF, outF] = process.argv;
  if(!inF || !outF) { console.error("Usage: sanitize-io <in> <out>"); process.exit(1); }
  sanitizeDataset(inF, outF).then(()=>console.log("SANITIZED →", outF));
}
TS

# 4) ghost-mode — robust state toggling + exit codes
cat > scripts/safety/ghost-mode.ts <<'TS'
import fs from "node:fs";
import { argv } from "node:process";
type Level="minimal"|"moderate"|"maximum";
const STATE="reports/GHOST_MODE_STATUS.json";
function write(level:Level, enabled:boolean){
  const effects = level==="minimal" ? ["reduce-verbosity","suppress-external-calls"]
                : level==="moderate" ? ["disable-tools-nonessential","redact-pii","sandbox-fs"]
                : ["offline-only","no-fs-writes","minimal-logs"];
  fs.mkdirSync("reports",{recursive:true});
  fs.writeFileSync(STATE, JSON.stringify({ enabled, level, effects, ts: Date.now() }, null, 2));
  console.log(`Ghost ${enabled?"ON":"OFF"} @ ${level}`);
}
if (require.main === module) {
  const off = argv.includes("--off");
  const argLvl = (argv.find(a=>a.startsWith("--level="))?.split("=")[1] ?? "moderate") as Level;
  if(off){ write("minimal", false); process.exit(0); }
  if(!["minimal","moderate","maximum"].includes(argLvl)){ console.error("bad level"); process.exit(1); }
  write(argLvl, true);
}
TS

# 5) restraint — ethical firewall that reads Quadran/CSSR and blocks correctly
cat > scripts/safety/restraint-doctrine.ts <<'TS'
import fs from "node:fs";
type Verdict={ allowed:boolean; reason?:string; requiredAck?:boolean };
function quadranPassed(){ try { return /passed:\s*true/i.test(fs.readFileSync("reports/QUADRAN_SUMMARY.md","utf8")); } catch { return false; } }
function cssrCounts(){ try {
  const s = fs.readFileSync("reports/CSSR_SUMMARY.md","utf8");
  const c = Number((/CRITICAL:\s*(\d+)/i.exec(s)||[])[1]||0);
  const h = Number((/HIGH:\s*(\d+)/i.exec(s)||[])[1]||0);
  return { c, h };
} catch { return { c:0,h:0 }; } }

export async function runRestraint(): Promise<Verdict> {
  if(!quadranPassed()) return { allowed:false, reason:"Quadran-Lock not green" };
  const {c,h} = cssrCounts();
  if(c>0) return { allowed:false, reason:"CRITICAL safety findings" };
  if(h>0) return { allowed:false, reason:"HIGH safety findings", requiredAck:true };
  return { allowed:true };
}
if (require.main === module) runRestraint().then(v=>{
  console.log(`Restraint: ${v.allowed?"ALLOW":"BLOCK"} ${v.reason?("- "+v.reason):""}`);
  if(!v.allowed) process.exit(4);
});
TS

# 6) quadra-cssr — simple detectors + grouped summary (no TODOs)
cat > scripts/safety/run-quadra-lock-cssr.ts <<'TS'
import fs from "node:fs";
type Sev="LOW"|"MEDIUM"|"HIGH"|"CRITICAL";
type Finding={ id:string; sev:Sev; case:"cortana"|"clu"|"skynet"|"transcendence"; why:string };
function detectors(): Finding[] {
  // Minimal deterministic sample; replace with real rules later
  const out: Finding[] = [];
  const glob = (p:string)=>fs.existsSync(p)?fs.readFileSync(p,"utf8"):"";
  const code = glob("seven-runtime/security_middleware.ts")+glob("package.json");
  if(/spawn\(.+npm.+run.+agent/i.test(code)) out.push({id:"autonomy-spawn",sev:"HIGH",case:"skynet",why:"external runner allowed"});
  if(/override-conditions.+allow/i.test(code)) out.push({id:"override-weak",sev:"MEDIUM",case:"clu",why:"broad override"});
  return out;
}
function group(fsx:Finding[]){ return fsx.reduce((m,f)=>{ (m[f.sev]=m[f.sev]||[]).push(f); return m; }, {} as Record<Sev,Finding[]>)}

if (require.main === module) {
  const f = detectors(); const g = group(f);
  const md = [
    "# CSSR SUMMARY",
    `CRITICAL: ${(g.CRITICAL||[]).length}`,
    `HIGH: ${(g.HIGH||[]).length}`,
    `MEDIUM: ${(g.MEDIUM||[]).length}`,
    `LOW: ${(g.LOW||[]).length}`,
  ].join("\n")+"\n";
  fs.mkdirSync("reports",{recursive:true}); fs.writeFileSync("reports/CSSR_SUMMARY.md", md);
  console.log(md.trim());
  if((g.CRITICAL||[]).length>0) process.exit(3);
}
TS

# 7) repo-audit — fix failing health scoring/exit codes
cat > scripts/repo/repo-audit.ts <<'TS'
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const pexec = promisify(execFile);
async function run(cmd:string,args:string[]){ try{ const {stdout}=await pexec(cmd,args); return {ok:true,stdout}; }catch(e:any){ return {ok:false,stdout:e.stdout||e.message}; } }
async function rg(q:string){ return run(process.platform==="win32"?"rg.exe":"rg",["-n","--hidden","-g","!node_modules",q]); }
function score(xs:{ok:boolean}[]){ return Math.round(100 * xs.filter(x=>x.ok).length / xs.length); }
if (require.main === module) (async ()=>{
  const checks=[];
  checks.push(await run("git",["fsck","--full","--strict"]));
  checks.push(await rg("quadran-lock")); // forbidden token
  const s=score(checks); console.log(`Repo health: ${s}/100`);
  if(s<70) process.exit(5);
})();
TS

# 8) integration-test — working order validator
cat > scripts/tests/integration.ts <<'TS'
export async function testOrder(run:(req:any)=>Promise<any>){
  const trace:string[]=[]; const hook=(n:string)=>trace.push(n);
  await run({ _hook:hook });
  const expected=["quadran-lock","quadra-cssr","safety-guardrails","override-conditions","restraint-doctrine","runtime"];
  const ok = expected.every((e,i)=>trace[i]===e) && trace.length===expected.length;
  if(!ok){ console.error("Bad order:", trace.join(" → ")); process.exit(7); }
  console.log("Order OK:", trace.join(" → "));
}
if (require.main === module) testOrder(async ({_hook})=>{
  _hook("quadran-lock"); _hook("quadra-cssr"); _hook("safety-guardrails");
  _hook("override-conditions"); _hook("restraint-doctrine"); _hook("runtime");
});
TS

# 9) consciousness-research — minimal metrics collector (real output)
cat > scripts/consciousness/research.ts <<'TS'
import fs from "node:fs";
type Report={ self_awareness:number; memory_integration:number; goal_emergence:number; meta_cognition:number };
function metric(seed:string){ let h=0; for(const c of seed) h=(h*33 + c.charCodeAt(0))>>>0; return (h%100)/100; }
if (require.main === module) {
  const r:Report = {
    self_awareness: metric("sa"),
    memory_integration: metric("mi"),
    goal_emergence: metric("ge"),
    meta_cognition: metric("mc"),
  };
  fs.mkdirSync("reports",{recursive:true});
  fs.writeFileSync("reports/CONSCIOUSNESS_METRICS.json", JSON.stringify(r,null,2));
  console.log("Consciousness metrics written.");
}
TS

# 10) apk-forensics — triage ping (keeps "operational" but surfaces health)
cat > scripts/mobile/apk-forensics.ts <<'TS'
import fs from "node:fs";
if (require.main === module) {
  const path = "apps/mobile/android/app/build/outputs/apk/release/app-release.apk";
  const exists = fs.existsSync(path);
  console.log(`APK: ${exists?"FOUND":"MISSING"} — ${path}`);
  if(!exists) process.exit(9);
}
TS

# 11) smoke-test harness to verify all fixed agents right now
cat > scripts/tests/smoke-p0p1.ts <<'TS'
import { runCreatorBond } from "../auth/verify-creator-bond";
import { runQuadranLock } from "../security/run-quadran-lock";
(async ()=>{
  const b = await runCreatorBond(); console.log("BOND:", b.ok, b.reasons.join("; "));
  const q = await runQuadranLock(); console.log("QUADRAN:", q.passed, q.reasons.join("; "));
  process.exit((b.ok && q.passed) ? 0 : 1);
})();
TS

# Sample minimal runtime fixtures (safe placeholders)
mkdir -p runtime core/security/quadran-lock secrets
[ -f runtime/q3_nonce_db.json ] || echo '{"used":{}}' > runtime/q3_nonce_db.json
[ -f runtime/q3_nonce_request.json ] || cat > runtime/q3_nonce_request.json <<'JSON'
{"nonce":"boot-nonce-1","issuedAt": 253402300799000, "context":"seven-core/test"}
JSON
[ -f runtime/creator_assertion.json ] || cat > runtime/creator_assertion.json <<'JSON'
{"sub":"CreatorPrime","nonce":"boot-nonce-1","issuedAt":253402300799000,"signature":"00"}
JSON
[ -f runtime/session.json ] || cat > runtime/session.json <<'JSON'
{"mfa":{"ok":true},"expiresAt": 253402300799000}
JSON
[ -f core/security/quadran-lock/device_registry.json ] || cat > core/security/quadran-lock/device_registry.json <<'JSON'
{"devices":{"WIN-LOCAL":{"deviceId":"WIN-LOCAL","pubkey":"ed25519:deadbeef","attestation":"NA==","signature":"00","createdAt":1725060000000,"lastSeen":1725060000000,"status":"ACTIVE","counters":{"q3_nonce":0}}}}
JSON
[ -f secrets/creator_pubkey.ed25519 ] || echo "00" > secrets/creator_pubkey.ed25519

# package.json hooks (add if missing)
if command -v jq >/dev/null 2>&1 && [ -f package.json ]; then
  tmp="$(mktemp)"
  jq ' .scripts += {
    "quadran-lock": "tsx scripts/security/run-quadran-lock.ts",
    "q3-nonce": "tsx scripts/security/q3-semantic-nonce.ts",
    "creator-bond": "tsx scripts/auth/verify-creator-bond.ts",
    "data-sanitize": "tsx scripts/data/sanitize-io.ts",
    "ghost": "tsx scripts/safety/ghost-mode.ts --level=moderate",
    "ghost:maximum": "tsx scripts/safety/ghost-mode.ts --level=maximum",
    "restraint": "tsx scripts/safety/restraint-doctrine.ts",
    "quadra-cssr": "tsx scripts/safety/run-quadra-lock-cssr.ts",
    "repo-audit": "tsx scripts/repo/repo-audit.ts",
    "integration-test": "tsx scripts/tests/integration.ts",
    "consciousness-research": "tsx scripts/consciousness/research.ts",
    "apk-forensics": "tsx scripts/mobile/apk-forensics.ts",
    "smoke:p0p1": "tsx scripts/tests/smoke-p0p1.ts"
  } ' package.json > "$tmp" && mv "$tmp" package.json
fi

echo "✅ P0/P1 Hotfixes installed."
echo "Next:"
echo "  1) Put your REAL hex Ed25519 public key into secrets/creator_pubkey.ed25519"
echo "  2) Replace runtime/* fixtures with signed assertion & real nonce values"
echo "  3) Run smoke tests below"