"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runQuadranLock = runQuadranLock;
const node_fs_1 = __importDefault(require("node:fs"));
const q3_semantic_nonce_1 = require("./q3-semantic-nonce");
const dev_flags_1 = require("../dev/dev-flags");
function q1_deviceRegistry() {
    try {
        const p = "core/security/quadran-lock/device_registry.json";
        if (!node_fs_1.default.existsSync(p))
            return false;
        const j = JSON.parse(node_fs_1.default.readFileSync(p, "utf8"));
        return !!j?.devices && Object.keys(j.devices).length > 0;
    }
    catch {
        return false;
    }
}
function q2_identity_codex() { return true; } // wire real scorer later
function q3_nonce() {
    try {
        const ctx = JSON.parse(node_fs_1.default.readFileSync("runtime/q3_nonce_request.json", "utf8"));
        return (0, q3_semantic_nonce_1.checkSemanticNonce)(ctx).ok;
    }
    catch {
        return false;
    }
}
function q4_session_mfa() {
    try {
        const sess = JSON.parse(node_fs_1.default.readFileSync("runtime/session.json", "utf8"));
        return !!sess?.mfa?.ok && (sess.expiresAt - Date.now() > 0);
    }
    catch {
        return false;
    }
}
async function runQuadranLock() {
    let r1 = q1_deviceRegistry();
    let r2 = q2_identity_codex();
    let r3 = q3_nonce();
    let r4 = q4_session_mfa();
    const reasons = [];
    if (!r1)
        reasons.push("Q1 device registry invalid/empty");
    if (!r2)
        reasons.push("Q2 identity codex below threshold");
    if (!r3)
        reasons.push("Q3 semantic nonce failed/expired");
    if (!r4)
        reasons.push("Q4 session MFA/TTL invalid");
    // Dev override (only outside production)
    if (!r1 || !r2 || !r3 || !r4) {
        if ((0, dev_flags_1.devMode)()) {
            console.warn("[DEV] Quadran override engaged (non-production). Reasons:", reasons.join("; "));
            r1 || (r1 = true);
            r2 || (r2 = true);
            r3 || (r3 = true);
            r4 || (r4 = true);
        }
    }
    const passed = r1 && r2 && r3 && r4;
    node_fs_1.default.mkdirSync("reports", { recursive: true });
    node_fs_1.default.writeFileSync("reports/QUADRAN_SUMMARY.md", `passed: ${passed}\nQ1:${r1} Q2:${r2} Q3:${r3} Q4:${r4}\nreasons: ${reasons.join(" | ") || "none"}\n`);
    return { q1: r1, q2: r2, q3: r3, q4: r4, passed, reasons };
}
if (require.main === module)
    runQuadranLock().then(r => {
        console.log(`Quadran-Lock: ${r.passed ? "PASS" : "FAIL"} — ${r.reasons.join("; ") || "ok"}`);
        if (!r.passed)
            process.exit(2);
    });
//# sourceMappingURL=run-quadran-lock.js.map