/**
 * QUADRAN-LOCK ORCHESTRATOR - Creator Authentication Proof System
 * Implements 2-of-3 minimum gate evaluation with deny-by-default security
 *
 * COMMIT: 772bb18a9a5cb8b4cf39ab87f8129e1c87322c64
 * PATCH: Critical security fix for Creator Bond authentication
 * RATIONALE: Current system has single weak token - implement full Quadran-Lock
 */
export declare enum AuthGate {
    Q1_CRYPTO_ATTESTATION = "crypto_attestation",
    Q2_BEHAVIORAL_CODEX = "behavioral_codex",
    Q3_SEMANTIC_NONCE = "semantic_nonce",
    Q4_SESSION_INTEGRITY = "session_integrity"
}
export declare enum AuthDecision {
    ALLOW = "ALLOW",
    LIMITED = "LIMITED",
    DENY = "DENY",
    MANUAL_REVIEW = "MANUAL_REVIEW"
}
export interface GateResult {
    gate: AuthGate;
    success: boolean;
    confidence: number;
    evidence: any;
    processingTime: number;
    errors?: string[];
}
export interface AuthenticationResult {
    decision: AuthDecision;
    gateResults: GateResult[];
    overallConfidence: number;
    requiredGates: AuthGate[];
    successfulGates: AuthGate[];
    failedGates: AuthGate[];
    reasoning: string;
    sessionToken?: string;
    restrictions?: string[];
}
export declare class CreatorProofOrchestrator {
    private ed25519;
    private semanticNonce;
    private behavioralCodex;
    private sessionIntegrity;
    private readonly TAU_HIGH;
    private readonly TAU_MEDIUM;
    private readonly TAU_LOW;
    private readonly MIN_GATES_REQUIRED;
    private readonly MAX_AUTHENTICATION_TIME_MS;
    constructor();
    /**
     * PRIMARY AUTHENTICATION ENTRY POINT
     * Implements Quadran-Lock 2-of-3 minimum with crypto presence logic
     */
    authenticateCreator(deviceId: string, authRequest: any, context?: any): Promise<AuthenticationResult>;
    /**
     * QUADRAN-LOCK DECISION LOGIC
     * Implements specification: 2-of-3 minimum, crypto present = fast-path
     */
    private evaluateQuadranLock;
    /**
     * Execute individual authentication gate
     */
    private executeGate;
    /**
     * Detect factor disagreement between gates
     */
    private detectFactorDisagreement;
    /**
     * Generate secure session token for successful authentication
     */
    private generateSessionToken;
    /**
     * Add timeout wrapper for gate execution
     */
    private withTimeout;
    /**
     * Log authentication attempt for audit trail
     */
    private logAuthenticationAttempt;
}
export default CreatorProofOrchestrator;
//# sourceMappingURL=creator_proof.d.ts.map