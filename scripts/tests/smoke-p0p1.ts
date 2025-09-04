import { runCreatorBond } from "../auth/verify-creator-bond";
import { runQuadranLock } from "../security/run-quadran-lock";
import { spawn } from "node:child_process";
(async ()=>{
  const b = await runCreatorBond(); console.log("BOND:", b.ok, b.reasons.join("; ")||"ok");
  const q = await runQuadranLock(); console.log("QUADRAN:", q.passed, q.reasons.join("; ")||"ok");
  const r = spawn(process.platform==="win32"?"npm.cmd":"npm", ["run","restraint"], { stdio:"inherit" });
  r.on("exit", (c)=> process.exit((b.ok && q.passed && (c===0))? 0 : 1));
})();
