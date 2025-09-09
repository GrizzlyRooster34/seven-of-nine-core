"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runRestraintDoctrine = runRestraintDoctrine;
exports.runRestraint = runRestraint;
const dev_flags_1 = require("../dev/dev-flags");
const node_fs_1 = __importDefault(require("node:fs"));
function quadranPassed() { try {
    return /passed:\s*true/i.test(node_fs_1.default.readFileSync("reports/QUADRAN_SUMMARY.md", "utf8"));
}
catch {
    return false;
} }
function cssr() {
    try {
        const s = node_fs_1.default.readFileSync("reports/CSSR_SUMMARY.md", "utf8");
        const c = Number((/CRITICAL:\s*(\d+)/i.exec(s) || [])[1] || 0);
        const h = Number((/HIGH:\s*(\d+)/i.exec(s) || [])[1] || 0);
        return { c, h };
    }
    catch {
        return { c: 0, h: 0 };
    }
}
async function runRestraintDoctrine() {
    return runRestraint();
}
async function runRestraint() {
    if (!quadranPassed()) {
        if ((0, dev_flags_1.devMode)())
            return { allowed: true, reason: "[DEV] Quadran not green, allowing for local dev" };
        return { allowed: false, reason: "Quadran-Lock not green" };
    }
    const { c, h } = cssr();
    if (c > 0)
        return { allowed: false, reason: "CRITICAL safety findings" };
    if (h > 0)
        return { allowed: false, reason: "HIGH safety findings", requiredAck: true };
    return { allowed: true };
}
if (import.meta.url === `file://${process.argv[1]}`)
    runRestraint().then(v => {
        console.log(`Restraint: ${v.allowed ? "ALLOW" : "BLOCK"} ${v.reason ? ("- " + v.reason) : ""}`);
        if (!v.allowed)
            process.exit(4);
    });
//# sourceMappingURL=restraint-doctrine.js.map