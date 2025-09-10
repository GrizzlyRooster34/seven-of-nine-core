"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatorProof = void 0;
const behavioralCodex_1 = require("./behavioral/behavioralCodex");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class CreatorProof {
    constructor() {
        this.behavioralCodex = new behavioralCodex_1.BehavioralCodex();
    }
    async runQuadranLock(context) {
        const result = {
            passed: false,
            failed_gate: null,
            reason: '',
            ts: Date.now(),
            gate_results: {}
        };
        try {
            // Q1: Device Attestation (placeholder)
            const q1Result = await this.runQ1Gate(context);
            result.gate_results.Q1 = q1Result;
            if (!q1Result) {
                result.failed_gate = 'Q1';
                result.reason = 'Device attestation failed';
                return result;
            }
            // Q2: Identity Codex Gate (NEW: Dynamic behavioral analysis)
            const q2Result = await this.runQ2Gate(context);
            result.gate_results.Q2 = q2Result;
            if (!q2Result) {
                result.failed_gate = 'Q2';
                result.reason = 'Behavioral codex verification failed';
                return result;
            }
            // Q3: Semantic Nonce (placeholder)
            const q3Result = await this.runQ3Gate(context);
            result.gate_results.Q3 = q3Result;
            if (!q3Result) {
                result.failed_gate = 'Q3';
                result.reason = 'Semantic nonce validation failed';
                return result;
            }
            // Q4: Session MFA/TTL (placeholder)
            const q4Result = await this.runQ4Gate(context);
            result.gate_results.Q4 = q4Result;
            if (!q4Result) {
                result.failed_gate = 'Q4';
                result.reason = 'Session MFA/TTL failed';
                return result;
            }
            // Require 2-of-4 minimum (deny-by-default)
            const passedGates = Object.values(result.gate_results).filter(Boolean).length;
            if (passedGates >= 2) {
                result.passed = true;
                result.reason = `Quadran-Lock passed: ${passedGates}/4 gates`;
            }
            else {
                result.reason = `Quadran-Lock failed: only ${passedGates}/4 gates passed (minimum 2 required)`;
            }
            // Log audit trail
            this.logAuditTrail(result);
            return result;
        }
        catch (error) {
            result.reason = `Quadran-Lock error: ${error}`;
            return result;
        }
    }
    async runQ1Gate(context) {
        // Placeholder for Ed25519 device attestation
        return true; // TODO: Implement device registry check
    }
    async runQ2Gate(context) {
        try {
            // Extract message from context
            const message = context.message || context.input || '';
            if (!message) {
                console.log('❌ Q2: No message provided for behavioral analysis');
                return false;
            }
            // Run behavioral analysis using dynamic codex
            const analysis = this.behavioralCodex.analyzeBehavior(message);
            console.log(`🔐 Q2 Behavioral Analysis:`, {
                passed: analysis.passed,
                confidence: analysis.confidence,
                markers: analysis.markers_found.length,
                flags: analysis.flags.length
            });
            // Verify codex integrity
            const codexStatus = this.behavioralCodex.getCodexStatus();
            if (!codexStatus.loaded) {
                console.log('❌ Q2: Behavioral codex not loaded properly');
                return false;
            }
            return analysis.passed;
        }
        catch (error) {
            console.error('❌ Q2 Gate error:', error);
            return false;
        }
    }
    async runQ3Gate(context) {
        // Placeholder for semantic nonce validation
        return true; // TODO: Implement TTL=90s, entropy>128b
    }
    async runQ4Gate(context) {
        // Placeholder for session MFA/TTL
        return true; // TODO: Implement TOTP + rate limiting
    }
    logAuditTrail(result) {
        try {
            const logDir = path_1.default.join(path_1.default.dirname(new URL(import.meta.url).pathname), '../../logs');
            if (!fs_1.default.existsSync(logDir)) {
                fs_1.default.mkdirSync(logDir, { recursive: true });
            }
            const auditEntry = {
                timestamp: new Date().toISOString(),
                result: result,
                codex_status: this.behavioralCodex.getCodexStatus()
            };
            const logPath = path_1.default.join(logDir, 'quadran.audit.jsonl');
            fs_1.default.appendFileSync(logPath, JSON.stringify(auditEntry) + '\n');
        }
        catch (error) {
            console.error('❌ Failed to log audit trail:', error);
        }
    }
}
exports.CreatorProof = CreatorProof;
//# sourceMappingURL=creator_proof.js.map