
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
