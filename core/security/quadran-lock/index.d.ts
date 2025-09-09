/**
 * QUADRAN-LOCK: 4-Gate Security Authentication System
 * Q1: Device Attestation
 * Q2: Identity Codex (Behavioral Analysis)
 * Q3: Semantic Nonce (Context Verification)
 * Q4: Session MFA/TTL (Multi-Factor + Time-to-Live)
 */
export interface QuadranContext {
    deviceId: string;
    userId: string;
    sessionId: string;
    requestContext: any;
    timestamp: number;
}
export interface QuadranResult {
    gates: {
        q1_device: boolean;
        q2_identity: boolean;
        q3_semantic: boolean;
        q4_session: boolean;
    };
    score: number;
    passed: boolean;
    metadata: any;
    timestamp: number;
}
export interface QuadranConfig {
    minGatesRequired: number;
    strictMode: boolean;
    timeoutMs: number;
}
export declare class QuadranLockSystem {
    private config;
    constructor(config?: Partial<QuadranConfig>);
    /**
     * Q1: Device Attestation
     * Verifies device identity and integrity
     */
    private evaluateQ1DeviceAttestation;
    /**
     * Q2: Identity Codex (Behavioral Analysis)
     * Analyzes user behavior patterns for authentication
     */
    private evaluateQ2IdentityCodex;
    /**
     * Q3: Semantic Nonce (Context Verification)
     * Validates request context and semantic consistency
     */
    private evaluateQ3SemanticNonce;
    /**
     * Q4: Session MFA/TTL (Multi-Factor Authentication + Time-to-Live)
     * Validates session state and time-based constraints
     */
    private evaluateQ4SessionMFA;
    /**
     * Main Quadran-Lock evaluation
     */
    runQuadranLock(ctx: QuadranContext): Promise<QuadranResult>;
    private generateDeviceFingerprint;
    private verifyDeviceIdentity;
    private checkDeviceIntegrity;
    private analyzeBehavioralPatterns;
    private verifyIdentityConsistency;
    private assessUserRisk;
    private validateRequestContext;
    private generateSemanticNonce;
    private verifySemanticNonce;
    private validateSession;
    private verifyMultiFactor;
    private checkTimeToLive;
}
export declare function createQuadranLock(config?: Partial<QuadranConfig>): QuadranLockSystem;
//# sourceMappingURL=index.d.ts.map