"use strict";
/**
 * QUADRAN-LOCK ORCHESTRATOR - Creator Authentication Proof System
 * Implements 2-of-3 minimum gate evaluation with deny-by-default security
 *
 * COMMIT: 772bb18a9a5cb8b4cf39ab87f8129e1c87322c64
 * PATCH: Critical security fix for Creator Bond authentication
 * RATIONALE: Current system has single weak token - implement full Quadran-Lock
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatorProofOrchestrator = exports.AuthDecision = exports.AuthGate = void 0;
const ed25519_attest_1 = require("./crypto/ed25519_attest");
const semanticNonce_1 = require("./challenge/semanticNonce");
const behavioralCodex_1 = require("./behavioral/behavioralCodex");
const sessionIntegrity_1 = require("./session/sessionIntegrity");
var AuthGate;
(function (AuthGate) {
    AuthGate["Q1_CRYPTO_ATTESTATION"] = "crypto_attestation";
    AuthGate["Q2_BEHAVIORAL_CODEX"] = "behavioral_codex";
    AuthGate["Q3_SEMANTIC_NONCE"] = "semantic_nonce";
    AuthGate["Q4_SESSION_INTEGRITY"] = "session_integrity";
})(AuthGate || (exports.AuthGate = AuthGate = {}));
var AuthDecision;
(function (AuthDecision) {
    AuthDecision["ALLOW"] = "ALLOW";
    AuthDecision["LIMITED"] = "LIMITED";
    AuthDecision["DENY"] = "DENY";
    AuthDecision["MANUAL_REVIEW"] = "MANUAL_REVIEW";
})(AuthDecision || (exports.AuthDecision = AuthDecision = {}));
class CreatorProofOrchestrator {
    constructor() {
        // Security thresholds
        this.TAU_HIGH = 85;
        this.TAU_MEDIUM = 70;
        this.TAU_LOW = 50;
        this.MIN_GATES_REQUIRED = 2;
        this.MAX_AUTHENTICATION_TIME_MS = 30000; // 30 seconds
        this.ed25519 = new ed25519_attest_1.Ed25519Attestation();
        this.semanticNonce = new semanticNonce_1.SemanticNonceChallenge();
        this.behavioralCodex = new behavioralCodex_1.BehavioralCodex();
        this.sessionIntegrity = new sessionIntegrity_1.SessionIntegrity();
    }
    /**
     * PRIMARY AUTHENTICATION ENTRY POINT
     * Implements Quadran-Lock 2-of-3 minimum with crypto presence logic
     */
    async authenticateCreator(deviceId, authRequest, context) {
        const startTime = Date.now();
        const gateResults = [];
        try {
            console.log('🔐 Quadran-Lock: Initiating Creator authentication');
            console.log(`   Device ID: ${deviceId.substring(0, 8)}...`);
            console.log(`   Request Type: ${authRequest.type || 'standard'}`);
            // Execute all four gates in parallel for performance
            const gatePromises = [
                this.executeGate(AuthGate.Q1_CRYPTO_ATTESTATION, deviceId, authRequest, context),
                this.executeGate(AuthGate.Q2_BEHAVIORAL_CODEX, deviceId, authRequest, context),
                this.executeGate(AuthGate.Q3_SEMANTIC_NONCE, deviceId, authRequest, context),
                this.executeGate(AuthGate.Q4_SESSION_INTEGRITY, deviceId, authRequest, context)
            ];
            // Wait for all gates with timeout
            const results = await Promise.allSettled(gatePromises.map(p => this.withTimeout(p, this.MAX_AUTHENTICATION_TIME_MS)));
            // Process gate results
            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                const gate = [
                    AuthGate.Q1_CRYPTO_ATTESTATION,
                    AuthGate.Q2_BEHAVIORAL_CODEX,
                    AuthGate.Q3_SEMANTIC_NONCE,
                    AuthGate.Q4_SESSION_INTEGRITY
                ][i];
                if (result.status === 'fulfilled') {
                    gateResults.push(result.value);
                }
                else {
                    // Gate failed with error
                    gateResults.push({
                        gate,
                        success: false,
                        confidence: 0,
                        evidence: null,
                        processingTime: Date.now() - startTime,
                        errors: [result.reason.message || 'Gate execution failed']
                    });
                }
            }
            // Apply Quadran-Lock decision logic
            const authResult = this.evaluateQuadranLock(gateResults, deviceId);
            // Log authentication attempt
            await this.logAuthenticationAttempt(deviceId, authRequest, authResult, gateResults);
            const totalTime = Date.now() - startTime;
            console.log(`🔐 Quadran-Lock: Authentication complete in ${totalTime}ms`);
            console.log(`   Decision: ${authResult.decision}`);
            console.log(`   Gates Successful: ${authResult.successfulGates.length}/${gateResults.length}`);
            return authResult;
        }
        catch (error) {
            console.error('🚨 Quadran-Lock: Authentication system error:', error);
            // Fail closed on system errors
            return {
                decision: AuthDecision.DENY,
                gateResults: [],
                overallConfidence: 0,
                requiredGates: [],
                successfulGates: [],
                failedGates: [AuthGate.Q1_CRYPTO_ATTESTATION, AuthGate.Q2_BEHAVIORAL_CODEX, AuthGate.Q3_SEMANTIC_NONCE, AuthGate.Q4_SESSION_INTEGRITY],
                reasoning: 'System error - failing closed for security',
                restrictions: ['EMERGENCY_LOCKDOWN']
            };
        }
    }
    /**
     * QUADRAN-LOCK DECISION LOGIC
     * Implements specification: 2-of-3 minimum, crypto present = fast-path
     */
    evaluateQuadranLock(gateResults, deviceId) {
        const successfulGates = gateResults.filter(r => r.success).map(r => r.gate);
        const failedGates = gateResults.filter(r => !r.success).map(r => r.gate);
        const cryptoGate = gateResults.find(r => r.gate === AuthGate.Q1_CRYPTO_ATTESTATION);
        const behavioralGate = gateResults.find(r => r.gate === AuthGate.Q2_BEHAVIORAL_CODEX);
        const semanticGate = gateResults.find(r => r.gate === AuthGate.Q3_SEMANTIC_NONCE);
        // Calculate overall confidence
        const overallConfidence = successfulGates.length > 0
            ? gateResults.filter(r => r.success).reduce((sum, r) => sum + r.confidence, 0) / successfulGates.length
            : 0;
        // QUADRAN-LOCK SPECIFICATION LOGIC:
        // Rule 1: Crypto present + 1 other = fast-path ALLOW
        if (cryptoGate?.success && successfulGates.length >= 2) {
            return {
                decision: AuthDecision.ALLOW,
                gateResults,
                overallConfidence,
                requiredGates: [AuthGate.Q1_CRYPTO_ATTESTATION],
                successfulGates,
                failedGates,
                reasoning: 'Fast-path: Crypto attestation + additional factor success',
                sessionToken: this.generateSessionToken(deviceId, successfulGates)
            };
        }
        // Rule 2: No crypto = require Q2≥τ_high + Q3 PASS + manual approve
        if (!cryptoGate?.success) {
            const behavioralHighConfidence = behavioralGate?.success && behavioralGate.confidence >= this.TAU_HIGH;
            const semanticPass = semanticGate?.success;
            if (behavioralHighConfidence && semanticPass) {
                return {
                    decision: AuthDecision.MANUAL_REVIEW,
                    gateResults,
                    overallConfidence,
                    requiredGates: [AuthGate.Q2_BEHAVIORAL_CODEX, AuthGate.Q3_SEMANTIC_NONCE],
                    successfulGates,
                    failedGates,
                    reasoning: 'No crypto - behavioral + semantic success, manual review required',
                    restrictions: ['MANUAL_APPROVAL_REQUIRED', 'LIMITED_ACCESS_PENDING']
                };
            }
        }
        // Rule 3: 2-of-3 minimum with medium confidence
        if (successfulGates.length >= this.MIN_GATES_REQUIRED) {
            const highConfidenceGates = gateResults.filter(r => r.success && r.confidence >= this.TAU_MEDIUM);
            if (highConfidenceGates.length >= this.MIN_GATES_REQUIRED) {
                return {
                    decision: AuthDecision.LIMITED,
                    gateResults,
                    overallConfidence,
                    requiredGates: successfulGates.slice(0, this.MIN_GATES_REQUIRED),
                    successfulGates,
                    failedGates,
                    reasoning: '2-of-3 gates passed with medium confidence - limited access granted',
                    restrictions: ['LIMITED_ACCESS', 'ENHANCED_MONITORING'],
                    sessionToken: this.generateSessionToken(deviceId, successfulGates, 'LIMITED')
                };
            }
        }
        // Rule 4: Factor disagreement or insufficient gates = DENY
        const hasDisagreement = this.detectFactorDisagreement(gateResults);
        if (hasDisagreement || successfulGates.length < this.MIN_GATES_REQUIRED) {
            return {
                decision: AuthDecision.DENY,
                gateResults,
                overallConfidence,
                requiredGates: [AuthGate.Q1_CRYPTO_ATTESTATION, AuthGate.Q2_BEHAVIORAL_CODEX, AuthGate.Q3_SEMANTIC_NONCE],
                successfulGates,
                failedGates,
                reasoning: hasDisagreement
                    ? 'Factor disagreement detected - denying access'
                    : 'Insufficient gates passed - minimum 2 required',
                restrictions: ['ACCESS_DENIED', 'SECURITY_ALERT']
            };
        }
        // Default deny (should never reach here)
        return {
            decision: AuthDecision.DENY,
            gateResults,
            overallConfidence: 0,
            requiredGates: [],
            successfulGates,
            failedGates,
            reasoning: 'Default deny - unexpected authentication state',
            restrictions: ['ACCESS_DENIED']
        };
    }
    /**
     * Execute individual authentication gate
     */
    async executeGate(gate, deviceId, authRequest, context) {
        const startTime = Date.now();
        try {
            let result;
            switch (gate) {
                case AuthGate.Q1_CRYPTO_ATTESTATION:
                    result = await this.ed25519.validateAttestation(deviceId, authRequest.cryptoChallenge);
                    break;
                case AuthGate.Q2_BEHAVIORAL_CODEX:
                    result = await this.behavioralCodex.analyzeBehavior(authRequest.input, context);
                    break;
                case AuthGate.Q3_SEMANTIC_NONCE:
                    result = await this.semanticNonce.validateResponse(authRequest.semanticResponse, context);
                    break;
                case AuthGate.Q4_SESSION_INTEGRITY:
                    result = await this.sessionIntegrity.validateSession(authRequest.sessionData, deviceId);
                    break;
                default:
                    throw new Error(`Unknown gate: ${gate}`);
            }
            const processingTime = Date.now() - startTime;
            return {
                gate,
                success: result.success || false,
                confidence: result.confidence || 0,
                evidence: result.evidence || null,
                processingTime,
                errors: result.errors || []
            };
        }
        catch (error) {
            return {
                gate,
                success: false,
                confidence: 0,
                evidence: null,
                processingTime: Date.now() - startTime,
                errors: [error.message]
            };
        }
    }
    /**
     * Detect factor disagreement between gates
     */
    detectFactorDisagreement(gateResults) {
        // Check for contradictory evidence between gates
        const successfulResults = gateResults.filter(r => r.success);
        if (successfulResults.length < 2)
            return false;
        // Example: Behavioral gate says "high stress" but semantic gate shows "calm responses"
        // This would indicate potential impersonation
        // Implementation would depend on specific evidence structures
        return false; // Placeholder - implement based on evidence types
    }
    /**
     * Generate secure session token for successful authentication
     */
    generateSessionToken(deviceId, successfulGates, accessLevel = 'FULL') {
        const crypto = require('crypto');
        const sessionData = {
            deviceId,
            gates: successfulGates,
            accessLevel,
            timestamp: Date.now(),
            nonce: crypto.randomBytes(16).toString('hex')
        };
        const token = crypto.createHmac('sha256', process.env.SESSION_SIGNING_KEY || 'seven-session-key')
            .update(JSON.stringify(sessionData))
            .digest('hex');
        return `${Buffer.from(JSON.stringify(sessionData)).toString('base64')}.${token}`;
    }
    /**
     * Add timeout wrapper for gate execution
     */
    async withTimeout(promise, timeoutMs) {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Gate execution timeout')), timeoutMs);
        });
        return Promise.race([promise, timeoutPromise]);
    }
    /**
     * Log authentication attempt for audit trail
     */
    async logAuthenticationAttempt(deviceId, authRequest, result, gateResults) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            commit: '772bb18a9a5cb8b4cf39ab87f8129e1c87322c64',
            deviceId: deviceId.substring(0, 8) + '...',
            decision: result.decision,
            overallConfidence: result.overallConfidence,
            successfulGates: result.successfulGates,
            failedGates: result.failedGates,
            processingTime: gateResults.reduce((sum, r) => sum + r.processingTime, 0),
            'quadran-lock-version': '1.0'
        };
        // Write to audit log (implementation would use secure logging system)
        console.log('🔐 Quadran-Lock Audit:', JSON.stringify(logEntry, null, 2));
    }
}
exports.CreatorProofOrchestrator = CreatorProofOrchestrator;
exports.default = CreatorProofOrchestrator;
//# sourceMappingURL=creator_proof.js.map