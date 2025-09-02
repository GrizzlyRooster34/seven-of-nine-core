import fs from "node:fs";
import { checkSemanticNonce } from "./q3-semantic-nonce";
import { devMode } from "../dev/dev-flags";

type Quadran = { q1:boolean;q2:boolean;q3:boolean;q4:boolean;passed:boolean;reasons:string[] };

function q1_deviceRegistry(): boolean {
  try {
    const p = "core/security/quadran-lock/device_registry.json";
    if (!fs.existsSync(p)) return false;
    const j = JSON.parse(fs.readFileSync(p,"utf8"));
    return !!j?.devices && Object.keys(j.devices).length>0;
  } catch { return false; }
}
function q2_identity_codex(): boolean { return true; }   // wire real scorer later

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

export async function runQuadranLock(): Promise<Quadran> {
  let r1 = q1_deviceRegistry();
  let r2 = q2_identity_codex();
  let r3 = q3_nonce();
  let r4 = q4_session_mfa();

  const reasons:string[]=[];
  if (!r1) reasons.push("Q1 device registry invalid/empty");
  if (!r2) reasons.push("Q2 identity codex below threshold");
  if (!r3) reasons.push("Q3 semantic nonce failed/expired");
  if (!r4) reasons.push("Q4 session MFA/TTL invalid");

  // Dev override (only outside production)
  if (!r1 || !r2 || !r3 || !r4) {
    if (devMode()) {
      console.warn("[DEV] Quadran override engaged (non-production). Reasons:", reasons.join("; "));
      r1 ||= true; r2 ||= true; r3 ||= true; r4 ||= true;
    }
  }

  const passed = r1 && r2 && r3 && r4;
  fs.mkdirSync("reports",{recursive:true});
  fs.writeFileSync("reports/QUADRAN_SUMMARY.md", `passed: ${passed}\nQ1:${r1} Q2:${r2} Q3:${r3} Q4:${r4}\nreasons: ${reasons.join(" | ")||"none"}\n`);
  return { q1:r1,q2:r2,q3:r3,q4:r4,passed,reasons };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runQuadranLock().then(r=>{
    console.log(`Quadran-Lock: ${r.passed?"PASS":"FAIL"} — ${r.reasons.join("; ")||"ok"}`);
    if (!r.passed) process.exit(2);
  });
}
