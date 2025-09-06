import { runQuadranLock } from "../security/run-quadran-lock.js";

const r = await runQuadranLock(); console.log(`Quadran-Lock: ${r.passed?"PASS":"FAIL"} —`, r.reasons.join("; ")||"ok");
if (!r.passed) process.exit(2);
