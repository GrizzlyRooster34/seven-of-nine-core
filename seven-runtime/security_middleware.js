"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityPipeline = securityPipeline;
const run_quadran_lock_1 = require("../scripts/security/run-quadran-lock");
const run_quadra_lock_cssr_1 = require("../scripts/safety/run-quadra-lock-cssr");
const restraint_doctrine_1 = require("../scripts/safety/restraint-doctrine");
async function securityPipeline(ctx) {
    const q = await (0, run_quadran_lock_1.runQuadranLock)();
    if (!q.passed)
        throw new Error(q.reasons?.join("; ") || "Quadran-Lock failed");
    const cssr = await (0, run_quadra_lock_cssr_1.runQuadraLockCSSR)();
    ctx._cssr = cssr;
    // TODO: applySafetyGuardrails(cssr); applyOverrideConditions(ctx);
    const v = await (0, restraint_doctrine_1.runRestraintDoctrine)();
    if (!v.allowed)
        throw new Error(v.reason || "RestraintDoctrine blocked");
    return ctx;
}
//# sourceMappingURL=security_middleware.js.map