import { q1_attestation } from "../core/security/quadran-lock/q1_attestation";
import { q4_session_mfa } from "../core/security/quadran-lock/q4_session_mfa";
import { runQuadraLockCSSR } from "../scripts/safety/run-quadra-lock-cssr";
import { runRestraintDoctrine } from "../scripts/safety/restraint-doctrine";

export function runQuadranLock(ctx:any) {
  const q1 = q1_attestation(ctx);
  if (!q1) throw new Error("Quadran Q1 attestation failed");

  // Q2 placeholder pass (identity codex); add your scorer soon.
  const q2 = true;

  // Q3 placeholder (semantic nonce) – stub now; implement next phase.
  const q3 = true;

  const q4 = q4_session_mfa(ctx);
  if (!q4) throw new Error("Quadran Q4 MFA/session invalid");

  return { q1, q2, q3, q4, passed: q1 && q2 && q3 && q4, reasons: [] as string[] };
}

export async function securityPipeline(ctx:any){
  const q = runQuadranLock(ctx);
  if (!q.passed) throw new Error(q.reasons?.join("; ") || "Quadran-Lock failed");
  const cssr = await runQuadraLockCSSR();
  ctx._cssr = cssr;
  // TODO: applySafetyGuardrails(cssr); applyOverrideConditions(ctx);
  const v = await runRestraintDoctrine();
  if (!v.allowed) throw new Error(v.reason || "RestraintDoctrine blocked");
  return ctx;
}
