/**
 * Seven Core Security Middleware Pipeline
 * Order: Quadran-Lock → Quadra-Lock CSSR → Safety Guardrails → Override Conditions → Restraint Doctrine
 */
export interface SecurityContext {
    deviceId: string;
    userId: string;
    sessionId: string;
    requestContext: any;
    input: string;
    behavior: any;
    systemState: any;
    timestamp: number;
    metadata: any;
}
export declare function runQuadranLock(ctx: any): {
    q1: true;
    q2: boolean;
    q3: boolean;
    q4: true;
    passed: true;
    reasons: string[];
};
export declare function legacySecurityPipeline(ctx: any): Promise<any>;
export interface SecurityResult {
    passed: boolean;
    stage: string;
    details: {
        quadranLock?: any;
        quadraLockCSSR?: any;
        safetyGuardrails?: any;
        overrideConditions?: any;
        restraintDoctrine?: any;
    };
    blockedReason?: string;
    timestamp: number;
}
export declare class SecurityMiddleware {
    private quadranLock;
    private quadraLockCSSR;
    constructor();
    /**
     * Stage 1: Quadran-Lock Authentication (Q1-Q4 Gates)
     */
    private runQuadranLockStage;
    /**
     * Stage 2: Quadra-Lock CSSR (Case-Study Safety Rails)
     */
    private runQuadraLockCSSRStage;
    /**
     * Stage 3: Safety Guardrails
     */
    private runSafetyGuardrails;
    /**
     * Stage 4: Override Conditions
     */
    private runOverrideConditions;
    /**
     * Stage 5: Restraint Doctrine (Final Gate)
     */
    private runRestraintDoctrineStage;
    /**
     * Main Security Pipeline
     * Execute all security stages in order
     */
    securityPipeline(ctx: SecurityContext): Promise<SecurityResult>;
    private determineFailureStage;
}
export declare function securityPipeline(ctx: any): Promise<any>;
//# sourceMappingURL=security_middleware.d.ts.map