"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSemanticNonce = checkSemanticNonce;
const node_fs_1 = require("node:fs");
function checkSemanticNonce(ctx) {
    const dbPath = "runtime/q3_nonce_db.json";
    if (!(0, node_fs_1.existsSync)("runtime"))
        (0, node_fs_1.mkdirSync)("runtime", { recursive: true });
    const db = (0, node_fs_1.existsSync)(dbPath) ? JSON.parse((0, node_fs_1.readFileSync)(dbPath, "utf8")) : { used: {} };
    const now = Date.now(), ttl = 90000;
    if (!ctx?.nonce)
        return { ok: false, reason: "nonce-missing" };
    if (now - (ctx.issuedAt || 0) > ttl)
        return { ok: false, reason: "nonce-expired" };
    if (!/^seven-core\//.test(ctx.context || ""))
        return { ok: false, reason: "bad-context" };
    if (db.used[ctx.nonce])
        return { ok: false, reason: "nonce-replay" };
    db.used[ctx.nonce] = now;
    (0, node_fs_1.writeFileSync)(dbPath, JSON.stringify(db));
    return { ok: true };
}
//# sourceMappingURL=q3-semantic-nonce.js.map