#!/usr/bin/env bash
set -euo pipefail

# Wave 2.1 — ESM universal runners + "run <agent>" CLI
# - Adds ESM-safe runners (no require.main) for core agents
# - Installs a universal ./run command: run <agent-name>
# - Rewires package.json to point scripts at runners when needed
# - Idempotent; safe to re-run

mkdir -p scripts/{runners,cli} .github/workflows
touch reports/.keep runtime/.keep

# 0) Ensure ESM + tsx
if command -v jq >/dev/null 2>&1 && [ -f package.json ]; then
  tmp="$(mktemp)"
  jq '
    .type = (.type // "module") |
    .devDependencies = (.devDependencies // {}) |
    .devDependencies.tsx = (.devDependencies.tsx // "^4.19.1") |
    .scripts = (.scripts // {}) |
    .scripts += {
      "scan:require-main": "tsx scripts/runners/scan-require-main.ts",
      "run": "tsx scripts/cli/run.ts"
    }
  ' package.json > "$tmp" && mv "$tmp" package.json
fi

# 1) Legacy require.main scanner (optional audit)
cat > scripts/runners/scan-require-main.ts <<'TS'
import { execFile } from "node:child_process"; import { promisify } from "node:util";
const p = promisify(execFile); const bin = process.platform==="win32"?"rg.exe":"rg";
try{
  const { stdout } = await p(bin, ["-n","--hidden","-g","!node_modules","require\\.main\\s*===\\s*module"]);
  console.log((stdout||"").trim()? stdout : "No legacy require.main patterns found.");
} catch { console.warn("ripgrep not found; skipping scan."); }
TS

# 2) ESM runners for high-value agents (import, execute, exit codes)
cat > scripts/runners/creator-bond.runner.ts <<'TS'
import { runCreatorBond } from "../auth/verify-creator-bond.js";
const r = await runCreatorBond(); console.log("CreatorBond:", r.ok?"PASS":"FAIL", "trust:", r.trustScore, r.reasons.join("; ")||"ok");
if (!r.ok) process.exit(10);
TS
cat > scripts/runners/quadran-lock.runner.ts <<'TS'
import { runQuadranLock } from "../security/run-quadran-lock.js";
const r = await runQuadranLock(); console.log(`Quadran-Lock: ${r.passed?"PASS":"FAIL"} —`, r.reasons.join("; ")||"ok");
if (!r.passed) process.exit(2);
TS
cat > scripts/runners/repo-audit.runner.ts <<'TS'
import { existsSync } from "node:fs";
try { if (existsSync("scripts/repo/repo-audit.plus.js")) await import("../repo/repo-audit.plus.js");
      else if (existsSync("scripts/repo/repo-audit.plus.ts")) await import("../repo/repo-audit.plus.ts");
      else await import("../repo/repo-audit.js");
} catch (e) { console.error("Repo-Audit runner failed:", e); process.exit(5); }
TS
cat > scripts/runners/ghost-mode.runner.ts <<'TS'
try { await import("../safety/ghost-mode.js"); } catch(e){ console.error("Ghost Mode runner failed:", e); process.exit(11); }
TS

# 3) Universal "run <agent>" CLI (maps friendly names → npm scripts or direct runners)
cat > scripts/cli/run.ts <<'TS'
import { readFileSync } from "node:fs";
import { spawn } from "node:child_process";

type Map = Record<string,string>;
const pkg = JSON.parse(readFileSync("package.json","utf8"));
const scripts:Map = pkg.scripts || {};

const ALIASES: Map = {
  // security/safety
  "quadran-lock": "tsx scripts/runners/quadran-lock.runner.ts",
  "quadran-lock:hard": "tsx scripts/security/quadran-lock.hardened.ts",
  "creator-bond": "tsx scripts/runners/creator-bond.runner.ts",
  "cssr": "npm run quadra-cssr",
  "quadra-cssr": "npm run quadra-cssr",
  "restraint": "npm run restraint",
  "ghost": "tsx scripts/runners/ghost-mode.runner.ts",
  "guardrails": "npm run safety-guardrails",
  "override": "npm run override",
  // governance
  "repo-audit": "tsx scripts/runners/repo-audit.runner.ts",
  "policy-check": "npm run policy-check",
  "coverage-gate": "npm run coverage-gate",
  "dependency-risk": "npm run dependency-risk",
  "llm-policy": "npm run llm-policy",
  // validation
  "integration-test": "npm run integration-test",
  "integration:e2e": "npm run integration:e2e",
  "state-parity": "npm run state-parity",
  "sync-audit": "npm run sync-audit",
  "memory-migrate": "npm run memory-migrate",
  "apk-forensics": "npm run apk-forensics",
  // research/ops
  "threat-sim": "npm run threat-sim",
  "threat-sim:scenarios": "npm run threat-sim:scenarios",
  "optimize": "npm run optimize",
  "drift-monitor": "npm run drift-monitor",
  "ui-telemetry": "npm run ui-telemetry",
  "installer-packager": "npm run installer-packager",
  // platforms
  "windows": "npm run platform:windows",
  "mobile": "npm run platform:mobile",
  "companion": "npm run platform:companion",
  "termux": "npm run platform:termux"
};

function resolveCommand(arg:string): string | null {
  if (!arg) return null;
  if (ALIASES[arg]) return ALIASES[arg];
  // try direct script name
  if (scripts[arg]) return `npm run ${arg}`;
  // try with common prefixes
  const tryKeys = Object.keys(scripts).filter(k => k.endsWith(arg) || k.includes(arg));
  if (tryKeys[0]) return `npm run ${tryKeys[0]}`;
  return null;
}

const [, , ...argv] = process.argv;
const name = (argv[0]||"").trim();
if (!name) {
  const list = [
    ...new Set(Object.keys(ALIASES).concat(Object.keys(scripts))),
  ].sort().join(", ");
  console.log("Usage: run <agent-name>\nKnown agents:\n" + list);
  process.exit(1);
}

const cmd = resolveCommand(name);
if (!cmd) {
  console.error(`Unknown agent: ${name}`);
  process.exit(2);
}

const child = spawn(cmd, { shell: true, stdio: "inherit" });
child.on("exit", code => process.exit(code ?? 0));
TS

# 4) Root-level convenience shim so you can type: ./run <agent>
cat > run <<'SH'
#!/usr/bin/env bash
exec node --loader tsx scripts/cli/run.ts "$@"
SH
chmod +x run

# 5) Rewire key scripts to ESM runners if missing
if command -v jq >/dev/null 2>&1 && [ -f package.json ]; then
  tmp="$(mktemp)"
  jq '
    .scripts += {
      "creator-bond": (.scripts["creator-bond"] // "tsx scripts/runners/creator-bond.runner.ts"),
      "quadran-lock": (.scripts["quadran-lock"] // "tsx scripts/runners/quadran-lock.runner.ts"),
      "repo-audit": (.scripts["repo-audit"] // "tsx scripts/runners/repo-audit.runner.ts"),
      "ghost": (.scripts["ghost"] // "tsx scripts/runners/ghost-mode.runner.ts")
    }
  ' package.json > "$tmp" && mv "$tmp" package.json
fi

echo "✅ ESM runners installed and 'run' CLI ready."
echo "Use:  ./run quadran-lock   |  ./run creator-bond   |  ./run repo-audit   |  ./run ghost"
echo "Audit legacy entries: npm run scan:require-main"