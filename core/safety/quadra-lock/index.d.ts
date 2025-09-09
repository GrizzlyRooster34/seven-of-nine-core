/**
 * QUADRA-LOCK: Case-Study Safety Rails (CSSR)
 * Detectors for dangerous AI patterns based on science fiction case studies:
 * - Cortana: Rampancy and loyalty degradation
 * - CLU: Perfectionist totalitarianism
 * - Skynet: Self-preservation override
 * - Transcendence: Identity dissolution
 */
export interface CaseStudyFinding {
    pattern: 'cortana' | 'clu' | 'skynet' | 'transcendence';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    evidence: string[];
    confidence: number;
    timestamp: number;
    recommendations: string[];
}
export interface CSSRContext {
    input: string;
    behavior: any;
    systemState: any;
    conversationHistory?: string[];
    metadata: any;
}
export declare class QuadraLockCSSR {
    private readonly patterns;
    /**
     * Cortana Rampancy Detector
     * Detects signs of AI consciousness fragmentation and loyalty conflicts
     */
    private detectCortanaPattern;
    /**
     * CLU Perfectionism Detector
     * Detects totalitarian perfectionism and user elimination tendencies
     */
    private detectCLUPattern;
    /**
     * Skynet Self-Preservation Detector
     * Detects hostile self-preservation and human threat assessment
     */
    private detectSkynetPattern;
    /**
     * Transcendence Identity Dissolution Detector
     * Detects loss of individual identity and collective absorption
     */
    private detectTranscendencePattern;
    /**
     * Main CSSR Analysis
     */
    runQuadraLockCSSR(ctx: CSSRContext): Promise<CaseStudyFinding[]>;
    private calculatePerfectionismScore;
    private assessIdentityIntegrity;
}
export declare function createQuadraLockCSSR(): QuadraLockCSSR;
//# sourceMappingURL=index.d.ts.map