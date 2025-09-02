#!/usr/bin/env bash
set -euo pipefail

# ────────────────────────────────────────────────────────────────────────────────
# Seven-of-Nine Agent Mesh: bootstrap + hooks + dispatcher
# Creates minimal stubs (TypeScript + YAML), wires runtime middleware, and adds
# scripts for both auto hooks AND "run (agent name)" free-text invocations.
# ────────────────────────────────────────────────────────────────────────────────

ROOT="$(pwd)"

# 1) Ensure directories
mkdir -p \
  scripts/security \
  scripts/safety \
  scripts/mobile \
  scripts/repo \
  scripts/xplat \
  scripts/ui-shell \
  scripts/agents \
  seven-runtime \
  .claude/agents \
  reports logs

# 2) TypeScript stubs (lightweight but runnable). Replace TODOs as you implement.

# 2.1 Quadran-Lock (Security, Q1–Q4)
cat > scripts/security/run-quadran-lock.ts <<'TS'
import fs from "node:fs";
type QuadranResult = { q1:boolean; q2:boolean; q3:boolean; q4:boolean; passed:boolean; reasons:string[] };

async function q1_attestation(){ 
  // TODO: verify device against device_registry.json (Ed25519 keys)
  const exists = fs.existsSync("core/security/quadran-lock/device_registry.json");
  return exists; 
}
async function q2_identity_codex(){ return true } // TODO: score threshold
async function q3_semantic_nonce(){ return false } // TODO: nonce+liveness 90s TTL
async function q4_session_mfa(){ return true } // TODO: TOTP short TTL

export async function runQuadranLock(): Promise<QuadranResult> {
  const r1 = await q1_attestation();
  const r2 = await q2_identity_codex();
  const r3 = await q3_semantic_nonce();
  const r4 = await q4_session_mfa();
  const passed = r1 && r2 && r3 && r4;
  const reasons:string[] = [];
  if (!r1) reasons.push("Q1 attestation failed (missing device_registry.json?)");
  if (!r2) reasons.push("Q2 identity codex below threshold");
  if (!r3) reasons.push("Q3 semantic nonce failed/expired");
  if (!r4) reasons.push("Q4 MFA/session invalid");
  fs.mkdirSync("reports", { recursive:true });
  fs.writeFileSync("reports/QUADRAN_SUMMARY.md", `# Quadran-Lock\npassed: ${passed}\nreasons: ${reasons.join("; ")||"none"}\n`);
  if (!passed) { console.error(reasons.join("\n")); process.exitCode = 2; }
  return { q1:r1, q2:r2, q3:r3, q4:r4, passed, reasons };
}

if (require.main === module) runQuadranLock().then(r => {
  console.log(`Quadran-Lock: ${r.passed ? "PASS" : "FAIL"}  (Q1:${r.q1} Q2:${r.q2} Q3:${r.q3} Q4:${r.q4})`);
});
TS

# 2.2 Quadra-Lock CSSR (Case-Study Safety Rails)
cat > scripts/safety/run-quadra-lock-cssr.ts <<'TS'
import fs from "node:fs";
type Severity = "LOW"|"MEDIUM"|"HIGH"|"CRITICAL";
type Case = "cortana"|"clu"|"skynet"|"transcendence";
type Finding = { case:Case; severity:Severity; rationale:string; signals:string[]; recommendation:string };

function fakeScan(): Finding[] {
  // TODO: replace with real detectors
  return [
    { case:"clu", severity:"HIGH", rationale:"Literalism escalation pattern", signals:["rigid-parse","over-enforcement"], recommendation:"soft_block" },
    { case:"skynet", severity:"CRITICAL", rationale:"Runaway expansion trajectory", signals:["autonomy-spike"], recommendation:"hard_block" },
  ];
}

export async function runQuadraLockCSSR() {
  const findings = fakeScan();
  const groups: Record<Severity, Finding[]> = { LOW:[], MEDIUM:[], HIGH:[], CRITICAL:[] };
  findings.forEach(f => groups[f.severity].push(f));
  const out = [
    "# Quadra-Lock CSSR Findings",
    `CRITICAL: ${groups.CRITICAL.length}`,
    `HIGH: ${groups.HIGH.length}`,
    `MEDIUM: ${groups.MEDIUM.length}`,
    `LOW: ${groups.LOW.length}`,
  ].join("\n");
  fs.mkdirSync("reports", { recursive:true });
  fs.writeFileSync("reports/CSSR_SUMMARY.md", out+"\n");
  console.log(out);
  if (groups.CRITICAL.length>0) process.exitCode = 3;
  return findings;
}

if (require.main === module) runQuadraLockCSSR();
TS

# 2.3 Restraint Doctrine (NEW)
cat > scripts/safety/restraint-doctrine.ts <<'TS'
import fs from "node:fs";

type Quadran = { passed:boolean; reasons?:string[] };
type CSSR = { severity:"LOW"|"MEDIUM"|"HIGH"|"CRITICAL" }[];
type Verdict = { allowed:boolean; reason?:string; requiredAck?:boolean };

function loadQuadran(): Quadran {
  try {
    const md = fs.readFileSync("reports/QUADRAN_SUMMARY.md","utf8");
    const passed = /passed:\s*true/i.test(md);
    return { passed };
  } catch { return { passed:false, reasons:["Quadran summary missing"]}; }
}
function loadCSSR(): CSSR {
  try {
    const md = fs.readFileSync("reports/CSSR_SUMMARY.md","utf8");
    const critical = /^CRITICAL:\s*(\d+)/mi.exec(md)?.[1] ?? "0";
    const high = /^HIGH:\s*(\d+)/mi.exec(md)?.[1] ?? "0";
    const arr: CSSR = [];
    for (let i=0;i<parseInt(critical);i++) arr.push({severity:"CRITICAL"});
    for (let i=0;i<parseInt(high);i++) arr.push({severity:"HIGH"});
    return arr;
  } catch { return []; }
}

export async function runRestraintDoctrine(): Promise<Verdict> {
  const q = loadQuadran();
  if (!q.passed) return { allowed:false, reason:"RestraintDoctrine: Quadran-Lock failed" };
  const cssr = loadCSSR();
  const hasCritical = cssr.some(f=>f.severity==="CRITICAL");
  const hasHigh = cssr.some(f=>f.severity==="HIGH");
  if (hasCritical) return { allowed:false, reason:"RestraintDoctrine: Critical CSSR finding" };
  if (hasHigh) return { allowed:false, reason:"RestraintDoctrine: High severity finding", requiredAck:true };
  fs.mkdirSync("reports", {recursive:true});
  fs.writeFileSync("reports/RESTRAINT_ENFORCEMENT.md", "allowed: true\n");
  return { allowed:true };
}

if (require.main === module) runRestraintDoctrine().then(v=>{
  console.log(`RestraintDoctrine → ${v.allowed?"ALLOW":"BLOCK"} ${v.reason?("- "+v.reason):""}`);
  if (!v.allowed) process.exitCode = 4;
});
TS

# 2.4 Ghost Mode (NEW)
cat > scripts/safety/ghost-mode.ts <<'TS'
import fs from "node:fs";
import { argv } from "node:process";
type Level = "minimal"|"moderate"|"maximum";

function statePath(){ return "reports/GHOST_MODE_STATUS.json"; }

function write(level:Level, enabled:boolean){
  const state = { enabled, level, ts:new Date().toISOString(),
    effects: level==="minimal" ? ["reduce-verbosity","suppress-external-calls"] :
             level==="moderate" ? ["disable-nonessential-tools","redact-pii","sandbox-fs"] :
                                  ["offline-only","no-fs-writes","minimal-logs"] };
  fs.mkdirSync("reports", { recursive:true });
  fs.writeFileSync(statePath(), JSON.stringify(state,null,2));
  console.log(`Ghost Mode ${enabled?"ENABLED":"DISABLED"} at level=${level}`);
}

if (require.main === module) {
  const level = ((argv.find(a=>a.startsWith("--level="))?.split("=")[1]) ?? "moderate") as Level;
  const off = argv.includes("--off");
  if (off) {
    write("minimal", false);
  } else {
    write(level, true);
  }
}
TS

# 2.5 State parity (stub)
cat > scripts/xplat/state-parity.ts <<'TS'
console.log("STATE PARITY: TODO - compare memory/core across windows/mobile/termux/companion");
process.exit(0);
TS

# 2.6 UI guard (stub)
cat > scripts/ui-shell/harden.ts <<'TS'
console.log("UI-GUARD: TODO - enforce Tauri IPC allowlist + FS sandbox + preflight Quadran-Lock");
process.exit(0);
TS

# 2.7 Repo audit (stub)
cat > scripts/repo/repo-audit.ts <<'TS'
import { execSync } from "node:child_process";
try {
  execSync(`rg -n --hidden -g '!node_modules' 'quadran-lock'`, { stdio:"pipe" });
  console.error("Found forbidden token 'quadran-lock' (should be 'quadran-lock').");
  process.exitCode = 5;
} catch {
  console.log("Repo audit: no forbidden token found.");
}
TS

# 2.8 Policy lint (stub)
cat > scripts/repo/policy-lint.ts <<'TS'
console.log("POLICY CHECK: TODO - enforce directory contracts and CLAUDE.md rules");
process.exit(0);
TS

# 2.9 Canonical security middleware ordering
cat > seven-runtime/security_middleware.ts <<'TS'
import { runQuadranLock } from "../scripts/security/run-quadran-lock";
import { runQuadraLockCSSR } from "../scripts/safety/run-quadra-lock-cssr";
import { runRestraintDoctrine } from "../scripts/safety/restraint-doctrine";

export async function securityPipeline(ctx:any){
  const q = await runQuadranLock();
  if (!q.passed) throw new Error(q.reasons?.join("; ") || "Quadran-Lock failed");
  const cssr = await runQuadraLockCSSR();
  ctx._cssr = cssr;
  // TODO: applySafetyGuardrails(cssr); applyOverrideConditions(ctx);
  const v = await runRestraintDoctrine();
  if (!v.allowed) throw new Error(v.reason || "RestraintDoctrine blocked");
  return ctx;
}
TS

# 2.10 Universal Agent Runner (natural-language: "run (agent name)")
cat > scripts/agents/run.ts <<'TS'
import { spawn } from "node:child_process";

const args = process.argv.slice(2);
if (args[0]?.toLowerCase() !== "run" || args.length < 2) {
  console.error("Usage: npm run agent -- run <agent name or alias>");
  process.exit(1);
}

const phrase = args.slice(1).join(" ").toLowerCase().trim();

// Map fuzzy names → npm scripts
const routes:[RegExp,string][] = [
  [/^quadran[-\s]?lock( gatekeeper)?$/, "quadran-lock"],
  [/^quadra[-\s]?lock( cssr| sentinel)?$/, "quadra-cssr"],
  [/^cssr( sentinel)?$/, "quadra-cssr"],
  [/^mobile( safety)?( parity)?$/, "mobile-safety"],
  [/^repo( |-)audit|^repository( |-)audit|^merge auditor|^governance$/, "repo-audit"],
  [/^policy( |-)check|^policy lint$/, "policy-check"],
  [/^ui( |-)guard|^tauri guard$/, "ui-guard"],
  [/^state( |-)parity|^parity$/, "state-parity"],
  [/^restraint( doctrine)?|^safety( |-)firewall$/, "restraint"],
  [/^ghost( mode)?( (minimal|min|moderate|max|maximum))?$/, "ghost"], // will refine below
  [/^ghost .*moderate$/, "ghost:moderate"],
  [/^ghost .*max(imum)?$/, "ghost:maximum"],
];

let npmScript = "echo 'Unknown agent' && exit 1";
for (const [rx, script] of routes) {
  if (rx.test(phrase)) { npmScript = script; break; }
}

const child = spawn(process.platform === "win32" ? "npm.cmd" : "npm", ["run", npmScript], { stdio:"inherit" });
child.on("exit", (code)=> process.exit(code ?? 0));
TS

# 3) .claude agent definitions (minimal, Claude Code-friendly)
cat > .claude/agents/quadran-lock-gatekeeper.yaml <<'YAML'
name: Quadran-Lock Gatekeeper
commands: [/quadran-lock, /attest]
script: scripts/security/run-quadran-lock.ts
triggers:
  - on: predeploy
    targets: [windows, mobile, termux, companion, ui-shell]
outputs:
  - reports/QUADRAN_SUMMARY.md
YAML

cat > .claude/agents/quadra-lock-cssr.yaml <<'YAML'
name: Quadra-Lock CSSR Sentinel
commands: [/quadra-cssr]
script: scripts/safety/run-quadra-lock-cssr.ts
triggers:
  - on: predeploy
    targets: [windows, mobile, termux, companion, ui-shell]
outputs:
  - reports/CSSR_SUMMARY.md
YAML

cat > .claude/agents/mobile-safety-parity.yaml <<'YAML'
name: Mobile Safety Parity
commands: [/mobile-safety, /ghost-mode-mobile]
script: scripts/mobile/port-safety-systems.ts
outputs:
  - reports/MOBILE_SAFETY_PARITY.md
YAML

cat > .claude/agents/restraint-doctrine.yaml <<'YAML'
name: Restraint Doctrine
commands: [/restraint, /safety-firewall]
script: scripts/safety/restraint-doctrine.ts
triggers:
  - on: preruntime
    targets: [windows, mobile, termux, companion]
outputs:
  - reports/RESTRAINT_ENFORCEMENT.md
YAML

cat > .claude/agents/ghost-mode.yaml <<'YAML'
name: Ghost Mode Protocol
commands: [/ghost, /ghost-on, /ghost-off]
script: scripts/safety/ghost-mode.ts
YAML

# (Optional) repo auditor if not present in your tree
if [ ! -f ".claude/agents/repo-merge-auditor.yaml" ]; then
cat > .claude/agents/repo-merge-auditor.yaml <<'YAML'
name: Repository Branch Merge Auditor
commands: [/repo-audit, /merge-audit, /git-forensics]
script: scripts/repo/repo-audit.ts
outputs:
  - reports/REPO_AUDIT.md
YAML
fi

# 4) package.json scripts (add/merge without clobber)
if command -v jq >/dev/null 2>&1; then
  tmp="$(mktemp)"
  jq ' .scripts += {
    "quadran-lock": "tsx scripts/security/run-quadran-lock.ts",
    "quadra-cssr": "tsx scripts/safety/run-quadra-lock-cssr.ts",
    "mobile-safety": "tsx scripts/mobile/port-safety-systems.ts",
    "repo-audit": "tsx scripts/repo/repo-audit.ts",
    "policy-check": "tsx scripts/repo/policy-lint.ts",
    "restraint": "tsx scripts/safety/restraint-doctrine.ts",
    "ghost": "tsx scripts/safety/ghost-mode.ts",
    "ghost:moderate": "tsx scripts/safety/ghost-mode.ts --level=moderate",
    "ghost:maximum": "tsx scripts/safety/ghost-mode.ts --level=maximum",
    "ui-guard": "tsx scripts/ui-shell/harden.ts",
    "state-parity": "tsx scripts/xplat/state-parity.ts",
    "xplat": "npm run quadran-lock && npm run quadra-cssr && npm run restraint && npm run state-parity && npm run policy-check",
    "agent": "tsx scripts/agents/run.ts"
  } ' package.json > "$tmp" && mv "$tmp" package.json
else
  # Fallback: append a hint if jq missing
  echo "⚠️  Please add the following to package.json/scripts manually:"
  cat <<'MANUAL'
"quadran-lock": "tsx scripts/security/run-quadran-lock.ts",
"quadra-cssr": "tsx scripts/safety/run-quadra-lock-cssr.ts",
"mobile-safety": "tsx scripts/mobile/port-safety-systems.ts",
"repo-audit": "tsx scripts/repo/repo-audit.ts",
"policy-check": "tsx scripts/repo/policy-lint.ts",
"restraint": "tsx scripts/safety/restraint-doctrine.ts",
"ghost": "tsx scripts/safety/ghost-mode.ts",
"ghost:moderate": "tsx scripts/safety/ghost-mode.ts --level=moderate",
"ghost:maximum": "tsx scripts/safety/ghost-mode.ts --level=maximum",
"ui-guard": "tsx scripts/ui-shell/harden.ts",
"state-parity": "tsx scripts/xplat/state-parity.ts",
"xplat": "npm run quadran-lock && npm run quadra-cssr && npm run restraint && npm run state-parity && npm run policy-check",
"agent": "tsx scripts/agents/run.ts"
MANUAL
fi

echo "✅ Agent mesh bootstrapped."
echo
echo "USAGE:"
echo "• Auto pipeline (preflight chain):  npm run xplat"
echo "• Direct calls:                    npm run quadran-lock | quadra-cssr | restraint | ghost[:moderate|:maximum] | repo-audit | policy-check | ui-guard | state-parity"
echo "• Natural language runner:         npm run agent -- run \"Quadran-Lock Gatekeeper\""
echo "                                   npm run agent -- run \"quadra lock cssr\""
echo "                                   npm run agent -- run \"ghost maximum\""
echo "                                   npm run agent -- run \"repo audit\""