"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.q1_attestation = q1_attestation;
exports.runQ1Attestation = runQ1Attestation;
const node_url_1 = require("node:url");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const __filename = (0, node_url_1.fileURLToPath)(import.meta.url);
const __dirname = node_path_1.default.dirname(__filename);
const REG_PATH = node_path_1.default.resolve(__dirname, "device_registry.json");
// Legacy function - keep for compatibility
function q1_attestation(ctx) {
    const reg = JSON.parse(node_fs_1.default.readFileSync(REG_PATH, "utf8"));
    const deviceId = ctx?.env?.deviceId || ctx?.runtime?.deviceId;
    const presentedKey = ctx?.auth?.pubkey_ssh_ed25519; // from launcher / env
    if (!deviceId || !presentedKey)
        return false;
    const match = reg.devices.find(d => d.deviceId === deviceId);
    if (!match)
        return false;
    // Minimal match: same key string registered. (Upgrade: verify signed nonce)
    if (match.pubkey_ssh_ed25519 !== presentedKey)
        return false;
    // TODO (upgrade): verify a signed semantic nonce with the registered public key
    return true;
}
// New function that orchestrator expects
async function runQ1Attestation(ctx, signature) {
    const timestamp = new Date().toISOString();
    try {
        const isValid = q1_attestation(ctx);
        return {
            valid: isValid,
            timestamp
        };
    }
    catch (error) {
        return {
            valid: false,
            timestamp,
            error: error.message || 'Q1 attestation failed'
        };
    }
}
//# sourceMappingURL=q1_attestation.js.map