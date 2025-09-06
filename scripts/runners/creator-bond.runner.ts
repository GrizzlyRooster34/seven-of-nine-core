import { runCreatorBond } from "../auth/verify-creator-bond.js";

const r = await runCreatorBond(); console.log("CreatorBond:", r.ok?"PASS":"FAIL", "trust:", r.trustScore, r.reasons.join("; ")||"ok");
if (!r.ok) process.exit(10);
