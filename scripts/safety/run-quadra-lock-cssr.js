"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
function detectors() {
    const out = [];
    const read = (p) => node_fs_1.default.existsSync(p) ? node_fs_1.default.readFileSync(p, "utf8") : "";
    const code = read("seven-runtime/security_middleware.ts") + read("package.json");
    if (/spawn\(.+npm.+run.+agent/i.test(code))
        out.push({ id: "autonomy-spawn", sev: "HIGH", case: "skynet", why: "external runner allowed" });
    if (/override-conditions.+allow/i.test(code))
        out.push({ id: "override-weak", sev: "MEDIUM", case: "clu", why: "broad override" });
    return out;
}
function group(fsx) { return fsx.reduce((m, f) => { (m[f.sev] = m[f.sev] || []).push(f); return m; }, {}); }
if (require.main === module) {
    const f = detectors();
    const g = group(f);
    const md = ["# CSSR SUMMARY", `CRITICAL: ${(g.CRITICAL || []).length}`, `HIGH: ${(g.HIGH || []).length}`, `MEDIUM: ${(g.MEDIUM || []).length}`, `LOW: ${(g.LOW || []).length}`].join("\n") + "\n";
    node_fs_1.default.mkdirSync("reports", { recursive: true });
    node_fs_1.default.writeFileSync("reports/CSSR_SUMMARY.md", md);
    console.log(md.trim());
    if ((g.CRITICAL || []).length > 0)
        process.exit(3);
}
//# sourceMappingURL=run-quadra-lock-cssr.js.map