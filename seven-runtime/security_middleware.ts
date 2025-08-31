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
