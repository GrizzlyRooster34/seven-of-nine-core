
import { spawn } from "node:child_process";

const args = process.argv.slice(2);
if (args[0]?.toLowerCase() !== "run" || args.length < 2) {
  console.error("Usage: npm run agent -- run <agent name or alias>");
  process.exit(1);
}

const phrase = args.slice(1).join(" ").toLowerCase().trim();

// Map fuzzy names → npm scripts
const routes:[RegExp,string][] = [
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
  [/^coverage( |-)gate$/, "coverage-gate"],
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
