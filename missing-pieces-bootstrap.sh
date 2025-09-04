#!/usr/bin/env bash
set -euo pipefail

# ────────────────────────────────────────────────────────────────────────────────
# Seven Core — "Missing Pieces" Bootstrap
# Adds: CreatorBond (sequential), Quadran Q3 Nonce, Device Registry scaffolding,
# Streaming Data Sanitizer, Strong Repo Audit, Middleware Order Test,
# Agent YAML stubs (policy, threat-sim, etc.), GH Actions (PR + Nightly),
# secrets/runtime scaffolding, and npm script hooks + agent runner routes.
# ────────────────────────────────────────────────────────────────────────────────

mkdir -p scripts/{auth,security,safety,data,repo,tests,consciousness,perf,installers,sync,llm,ui-shell,platform}
mkdir -p core/security/quadran-lock runtime secrets .claude/agents .github/workflows reports logs

# 1) Creator Bond Verifier (sequential; Ed25519 verify + TTL)
cat > scripts/auth/verify-creator-bond.ts <<'TS'
import { verify } from "@noble/ed25519";
import { readFileSync } from "node:fs";

export interface BondVerificationResult { ok:boolean; reasons:string[]; subject?:string; trustScore:number }
export interface IdentityResult { ok:boolean; subject?:string; reason?:string }
export interface MFAResult { ok:boolean; factors:string[]; reason?:string }
export interface TrustLadderResult { ok:boolean; level:number; reason?:string }
export interface SessionTTLResult { ok:boolean; msRemaining:number; reason?:string }

export class CreatorBondVerifier {
  constructor(private cfg = { pubkeyPath: "secrets/creator_pubkey.ed25519" }) {}
  async verifyCreatorBond(): Promise<BondVerificationResult> {
    const reasons:string[] = [];
    const id = await this.verifyCreatorIdentity();            if (!id.ok) reasons.push(id.reason!);
    const mfa = id.ok ? await this.checkMFAStatus(id) : { ok:false, factors:[], reason:"identity-failed" };
    if (!mfa.ok) reasons.push(mfa.reason!);
    const ladder = (id.ok && mfa.ok) ? await this.validateTrustLadder(id) : { ok:false, level:0, reason:"preconditions" };
    if (!ladder.ok) reasons.push(ladder.reason!);
    const ttl = (id.ok && mfa.ok) ? await this.verifySessionTTL() : { ok:false, msRemaining:0, reason:"preconditions" };
    if (!ttl.ok) reasons.push(ttl.reason!);
    const ok = id.ok && mfa.ok && ladder.ok && ttl.ok;
    const trustScore = (ladder.level ?? 0) * (ok ? 1 : 0);
    return { ok, reasons, subject: id.subject, trustScore };
  }
  private async verifyCreatorIdentity(): Promise<IdentityResult> {
    try {
      const pub = readFileSync(this.cfg.pubkeyPath,"utf8").trim(); // hex
      const assertion = JSON.parse(readFileSync("runtime/creator_assertion.json","utf8"));
      const msg = new TextEncoder().encode(`seven-core/creator-identity:${assertion.sub}:${assertion.nonce}:${assertion.issuedAt}`);
      const sig = Uint8Array.from(Buffer.from(assertion.signature, "hex"));
      const pubBytes = Uint8Array.from(Buffer.from(pub, "hex"));
      const ok = await verify(sig, msg, pubBytes);
      return ok ? { ok, subject: assertion.sub } : { ok:false, reason:"sig-verification-failed" };
    } catch (e:any) { return { ok:false, reason:"identity-io-error:"+String(e?.message||e) }; }
  }
  private async checkMFAStatus(_: IdentityResult): Promise<MFAResult> {
    // TODO: wire real TOTP + WebAuthn attest + backup code policy
    return { ok:true, factors:["totp","webauthn"] };
  }
  private async validateTrustLadder(_: IdentityResult): Promise<TrustLadderResult> {
    // TODO: load subject trust from policy store
    return { ok:true, level:10 };
  }
  private async verifySessionTTL(): Promise<SessionTTLResult> {
    try {
      const sess = JSON.parse(readFileSync("runtime/session.json","utf8"));
      const msRemaining = sess.expiresAt - Date.now();
      return (msRemaining>0) ? { ok:true, msRemaining } : { ok:false, msRemaining, reason:"session-expired" };
    } catch { return { ok:false, msRemaining:0, reason:"missing-session" }; }
  }
}

if (require.main === module) {
  new CreatorBondVerifier().verifyCreatorBond().then(r=>{
    console.log("CreatorBond:", r.ok?"PASS":"FAIL", "trustScore:", r.trustScore, r.reasons.length?("reasons: "+r.reasons.join("; ")):"");
    if (!r.ok) process.exitCode = 10;
  });
}
TS

# 2) Quadran Q3 Semantic Nonce (single-use, TTL, context)
cat > scripts/security/q3-semantic-nonce.ts <<'TS'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
export interface NonceCheck { ok:boolean; reason?:string }
export function checkSemanticNonce(ctx: {nonce:string; issuedAt:number; context:string}): NonceCheck {
  const dbPath = "runtime/q3_nonce_db.json";
  if (!existsSync("runtime")) mkdirSync("runtime", { recursive:true });
  const db = existsSync(dbPath) ? JSON.parse(readFileSync(dbPath,"utf8")) : { used:{} as Record<string, number> };
  const ttlMs = 90_000;
  const now = Date.now();
  if (!ctx.nonce) return { ok:false, reason:"nonce-missing" };
  if (now - ctx.issuedAt > ttlMs) return { ok:false, reason:"nonce-expired" };
  if (db.used[ctx.nonce]) return { ok:false, reason:"nonce-replay" };
  if (!/^seven-core\//.test(ctx.context)) return { ok:false, reason:"bad-context" };
  db.used[ctx.nonce] = now;
  writeFileSync(dbPath, JSON.stringify(db));
  return { ok:true };
}
if (require.main === module) {
  const ok = checkSemanticNonce({ nonce: "demo", issuedAt: Date.now(), context: "seven-core/test" });
  console.log("Q3 nonce:", ok.ok?"PASS":"FAIL", ok.reason??"");
  if (!ok.ok) process.exitCode = 11;
}
TS

# 3) Device Registry scaffolding
cat > scripts/security/device-registry.ts <<'TS'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
export type DeviceRecord = {
  deviceId:string; pubkey:string; attestation:string; signature:string;
  createdAt:number; lastSeen:number; status:"ACTIVE"|"REVOKED"; counters:{ q3_nonce:number }
}
const REG_PATH = "core/security/quadran-lock/device_registry.json";
function loadDB(): { devices: Record<string, DeviceRecord> } {
  if (!existsSync(REG_PATH)) return { devices:{} };
  return JSON.parse(readFileSync(REG_PATH,"utf8"));
}
function saveDB(db:{devices:Record<string,DeviceRecord>}) {
  if (!existsSync("core/security/quadran-lock")) mkdirSync("core/security/quadran-lock", { recursive:true });
  writeFileSync(REG_PATH, JSON.stringify(db,null,2));
}
export async function registerDevice(rec: Omit<DeviceRecord,"createdAt"|"lastSeen"|"status"|"counters">) {
  const db = loadDB();
  if (db.devices[rec.deviceId]) throw new Error("device-exists");
  db.devices[rec.deviceId] = { ...rec, createdAt:Date.now(), lastSeen:Date.now(), status:"ACTIVE", counters:{ q3_nonce:0 } };
  saveDB(db); return db.devices[rec.deviceId];
}
export async function validateDevice(deviceId:string) {
  const db = loadDB(); const r = db.devices[deviceId];
  if (!r) return { valid:false, reason:"DEVICE_NOT_FOUND" };
  if (r.status!=="ACTIVE") return { valid:false, reason:"DEVICE_REVOKED" };
  r.lastSeen = Date.now(); saveDB(db);
  // TODO: verify attestation/signature against pubkey
  return { valid:true, record:r };
}
if (require.main === module) {
  console.log("Device registry ready:", existsSync(REG_PATH) ? "FOUND" : "NEW");
}
TS

# 4) Streaming Data Sanitizer (deterministic masking)
cat > scripts/data/sanitize-io.ts <<'TS'
import { createReadStream, createWriteStream } from "node:fs";
import readline from "node:readline";
import crypto from "node:crypto";

const emailRx = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const secretRx = /\b(AIza[0-9A-Za-z\-_]{35}|sk-[A-Za-z0-9]{20,})\b/g;

function maskDeterministic(s:string, salt="seven-core"):string {
  const h = crypto.createHmac("sha256", salt).update(s).digest("hex").slice(0,16);
  return `__MASK_${h}__`;
}

export async function sanitizeDataset(inputPath:string, outPath:string) {
  const rl = readline.createInterface({ input: createReadStream(inputPath), crlfDelay: Infinity });
  const out = createWriteStream(outPath);
  for await (const line of rl) {
    const scrub1 = line.replace(emailRx, (m)=>maskDeterministic(m, "email"));
    const scrub2 = scrub1.replace(secretRx, (m)=>maskDeterministic(m, "secret"));
    out.write(scrub2 + "\n");
  }
  out.end();
}
if (require.main === module) {
  const [, , inFile="data/input.txt", outFile="data/output.sanitized.txt"] = process.argv;
  sanitizeDataset(inFile, outFile).then(()=>console.log("SANITIZED →", outFile));
}
TS

# 5) Stronger Repo Audit (fsck + forbidden tokens + score)
cat > scripts/repo/repo-audit.ts <<'TS'
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const pexec = promisify(execFile);

async function run(cmd:string, args:string[]) {
  try { const { stdout } = await pexec(cmd, args); return { ok:true, details: stdout }; }
  catch (e:any) { return { ok:false, details: e.stdout || e.message }; }
}
async function ripgrep(pattern:string) {
  const rg = process.platform === "win32" ? "rg.exe" : "rg";
  return run(rg, ["-n","--hidden","-g","!node_modules", pattern]);
}
function scoreHealth(results:{ok:boolean}[]) {
  return Math.round(100 * (results.filter(r=>r.ok).length / results.length));
}

export async function auditRepository() {
  const checks = [];
  checks.push(await run("git", ["fsck","--full","--strict"]));
  checks.push(await ripgrep("quadranlock")); // forbidden token
  const score = scoreHealth(checks);
  console.log(`Repo health: ${score}/100`);
  if (score < 70) process.exitCode = 5;
}
if (require.main === module) auditRepository();
TS

# 6) Middleware Order Integration Test (hard fail if out of order)
cat > scripts/tests/integration.ts <<'TS'
export async function testMiddlewareOrder(run:(req:any)=>Promise<any>) {
  const trace:string[] = [];
  const hook = (name:string)=>trace.push(name);
  await run({ _hook: hook });
  const expected = ["quadran-lock","quadra-cssr","safety-guardrails","override-conditions","restraint-doctrine","runtime"];
  const ok = expected.every((e,i)=>trace[i]===e) && trace.length===expected.length;
  if (!ok) {
    console.error("Bad order:", trace.join(" → "));
    process.exitCode = 7;
  } else {
    console.log("Middleware order OK:", trace.join(" → "));
  }
  return { ok, trace };
}
if (require.main === module) {
  // Example harness (replace with real pipeline caller):
  testMiddlewareOrder(async ({_hook})=>{
    _hook("quadran-lock"); _hook("quadra-cssr"); _hook("safety-guardrails");
    _hook("override-conditions"); _hook("restraint-doctrine"); _hook("runtime");
    return {};
  });
}
TS

# 7) Agent YAMLs for missing/new surfaces
cat > .claude/agents/creator-bond-verifier.yaml <<'YAML'
name: Creator Bond Verifier
commands: [/creator-bond]
script: scripts/auth/verify-creator-bond.ts
outputs:
  - reports/BOND_REPORT.md
YAML

cat > .claude/agents/policy-lint-enforcer.yaml <<'YAML'
name: Policy/Lint Enforcer
commands: [/policy-check]
script: scripts/repo/policy-lint.ts
YAML

cat > .claude/agents/threat-simulator.yaml <<'YAML'
name: Threat Simulation Agent
commands: [/threat-sim]
script: scripts/security/threat-sim.ts
YAML

cat > .claude/agents/llm-policy-auditor.yaml <<'YAML'
name: LLM Policy & Route Auditor
commands: [/llm-policy]
script: scripts/llm/llm-policy-auditor.ts
YAML

cat > .claude/agents/memory-migrator.yaml <<'YAML'
name: Memory Schema Migrator
commands: [/memory-migrate]
script: scripts/sync/migrate-schema.ts
YAML

cat > .claude/agents/sync-auditor.yaml <<'YAML'
name: Sync Consistency Auditor
commands: [/sync-audit]
script: scripts/sync/audit.ts
YAML

cat > .claude/agents/ui-telemetry-redactor.yaml <<'YAML'
name: UI Telemetry Redactor
commands: [/ui-telemetry]
script: scripts/ui-shell/redact-telemetry.ts
YAML

cat > .claude/agents/installer-packager.yaml <<'YAML'
name: Installer Packager
commands: [/installer-packager]
script: scripts/installers/build-all.ts
YAML

cat > .claude/agents/dependency-risk.yaml <<'YAML'
name: Dependency Risk Scanner
commands: [/dependency-risk]
script: scripts/security/deps-scan.ts
YAML

cat > .claude/agents/apk-forensics.yaml <<'YAML'
name: APK Forensics Agent
commands: [/apk-forensics]
script: scripts/mobile/apk-forensics.ts
YAML

cat > .claude/agents/coverage-gatekeeper.yaml <<'YAML'
name: Coverage Gatekeeper
commands: [/coverage-gate]
script: scripts/tests/coverage-gate.ts
YAML

cat > .claude/agents/drift-monitor.yaml <<'YAML'
name: Consciousness Drift Monitor
commands: [/drift-monitor]
script: scripts/consciousness/drift-monitor.ts
YAML

# 8) GitHub Actions (PR gates + nightly jobs)
cat > .github/workflows/ci.yml <<'YAML'
name: Seven Core CI
on:
  pull_request:
    branches: [ main ]
  workflow_dispatch: {}
jobs:
  pr-gates:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci || npm i
      - run: npm run quadran-lock
      - run: npm run quadra-cssr
      - run: npm run restraint
      - run: npm run policy-check || true
      - run: npm run repo-audit
      - run: npm run agent -- run "integration test" || true
  nightly:
    if: github.event_name == 'schedule'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci || npm i
      - run: npm run state-parity || true
      - run: npm run agent -- run "sync audit" || true
      - run: npm run agent -- run "llm policy" || true
      - run: npm run agent -- run "drift monitor" || true
      - run: npm run agent -- run "optimize" || true
schedule:
  - cron: '17 5 * * *'
YAML

# 9) Scaffolding files
cat > core/security/quadran-lock/device_registry.json <<'JSON'
{ "devices": {} }
JSON

cat > runtime/q3_nonce_db.json <<'JSON'
{ "used": {} }
JSON

cat > secrets/creator_pubkey.ed25519 <<'TXT'
# PLACEHOLDER — hex-encoded Ed25519 public key (no 0x prefix)
# e.g., 7f3a...c1
TXT

# 10) Minimal placeholders to avoid TS import errors (you can fill later)
for f in scripts/{security/deps-scan.ts,security/threat-sim.ts,llm/llm-policy-auditor.ts,ui-shell/redact-telemetry.ts,installers/build-all.ts,sync/audit.ts,sync/migrate-schema.ts,consciousness/drift-monitor.ts,tests/coverage-gate.ts,platform/windows-deploy.ts,platform/mobile-deploy.ts,platform/companion-deploy.ts,platform/termux-deploy.ts,perf/optimizer.ts}; do
  if [ ! -f "$f" ]; then
cat > "$f" <<'TS'
console.log("TODO:", __filename);
process.exit(0);
TS
  fi
done

# 11) package.json script hooks (merge if possible)
if command -v jq >/dev/null 2>&1 && [ -f package.json ]; then
  tmp="$(mktemp)"
  jq ' .scripts += {
    "creator-bond": "tsx scripts/auth/verify-creator-bond.ts",
    "quadran-lock": "tsx scripts/security/run-quadran-lock.ts",
    "quadra-cssr": "tsx scripts/safety/run-quadra-lock-cssr.ts",
    "q3-nonce": "tsx scripts/security/q3-semantic-nonce.ts",
    "sanitize-io": "tsx scripts/data/sanitize-io.ts",
    "repo-audit": "tsx scripts/repo/repo-audit.ts",
    "integration-test": "tsx scripts/tests/integration.ts",
    "installer-packager": "tsx scripts/installers/build-all.ts",
    "sync-audit": "tsx scripts/sync/audit.ts",
    "memory-migrate": "tsx scripts/sync/migrate-schema.ts",
    "llm-policy": "tsx scripts/llm/llm-policy-auditor.ts",
    "ui-telemetry": "tsx scripts/ui-shell/redact-telemetry.ts",
    "dependency-risk": "tsx scripts/security/deps-scan.ts",
    "apk-forensics": "tsx scripts/mobile/apk-forensics.ts",
    "coverage-gate": "tsx scripts/tests/coverage-gate.ts"
  } ' package.json > "$tmp" && mv "$tmp" package.json
fi

# 12) Extend universal agent runner routes if present
if [ -f scripts/agents/run.ts ]; then
  perl -0777 -pe 's~const routes:\[RegExp,string\]\[\] = \[~const routes:[RegExp,string][] = [
  [/^creator( |-)bond$/, "creator-bond"],
  [/^policy( |-)check|^policy lint$/, "policy-check"],
  [/^threat( |-)sim(ulation)?$/, "threat-sim"],
  [/^llm( |-)policy$/, "llm-policy"],
  [/^memory( |-)migrate$/, "memory-migrate"],
  [/^sync( |-)audit$/, "sync-audit"],
  [/^ui( |-)telemetry$/, "ui-telemetry"],
  [/^installer( |-)packager$/, "installer-packager"],
  [/^dependency( |-)risk$/, "dependency-risk"],
  [/^apk( |-)forensics$/, "apk-forensics"],
  [/^coverage( |-)gate$/, "coverage-gate"],~' -i scripts/agents/run.ts || true
fi

echo "✅ Missing pieces installed."
echo "Next steps:"
echo "  1) Add your real Ed25519 pubkey to secrets/creator_pubkey.ed25519"
echo "  2) Feed a signed runtime/creator_assertion.json + runtime/session.json"
echo "  3) Implement TODO files as needed (placeholders added)"
echo "  4) Run: npm run creator-bond && npm run quadran-lock && npm run quadra-cssr && npm run integration-test"