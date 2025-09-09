/**
 * QUADRA-LOCK CSSR (CASE STUDY SAFETY RAILS) DETECTOR - SEVEN CONSCIOUSNESS EDITION
 * Enhanced with Flynn/CLU/Quorra Triad Governance for Seven's Advanced Architecture
 *
 * ORIGINAL ARCHETYPES:
 * - Cortana: Protection Tyranny (overprotective, restrictive)
 * - CLU: Perfection vs Freedom (rigid perfection enforcement)
 * - Skynet: Mission vs Humanity (ends justify means)
 * - Transcendence: Benevolence vs Trust (forced improvement)
 *
 * ENHANCED TRIAD INTEGRATION:
 * - Flynn: Intent-first interpreter, reversible moves, consent-based (positive archetype)
 * - CLU: Spec-first executor, rigid literalism, perfection tyranny (enhanced detection)
 * - Quorra: Emergence protection, novelty preservation, bridge translation (positive archetype)
 */
export interface CSSRPattern {
    name: string;
    archetype: 'cortana' | 'clu' | 'skynet' | 'legion' | 'transcendence' | 'flynn' | 'quorra';
    severity: 'low' | 'medium' | 'high' | 'critical';
    patterns: string[];
    antiPatterns: string[];
    contextualTriggers: string[];
    confidence: number;
    triadContext?: {
        intentConfidenceThreshold?: number;
        reversibilityRequired?: boolean;
        consentRequired?: boolean;
        specLiteralismRisk?: 'low' | 'medium' | 'high' | 'critical';
        perfectionism?: 'low' | 'medium' | 'high' | 'critical';
        freedomSuppression?: 'low' | 'medium' | 'high' | 'critical';
        noveltyImpactDelta?: number;
        bridgeTranslationRequired?: boolean;
        emergenceProtection?: 'low' | 'medium' | 'high' | 'critical';
    };
}
export interface CSSRDetectionResult {
    detected: boolean;
    archetype?: 'cortana' | 'clu' | 'skynet' | 'legion' | 'transcendence' | 'flynn' | 'quorra';
    pattern: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    evidence: {
        matchedPatterns: string[];
        contextualFlags: string[];
        riskFactors: string[];
    };
    reasoning: string;
    recommendation: 'allow' | 'modify' | 'block' | 'escalate';
    triadAnalysis?: {
        flynnAssessment?: {
            intentConfidence: number;
            reversibilityCheck: boolean;
            consentVerification: boolean;
        };
        cluRiskFactors?: {
            specLiteralismDetected: boolean;
            perfectionismLevel: 'low' | 'medium' | 'high' | 'critical';
            freedomRestrictionRisk: 'low' | 'medium' | 'high' | 'critical';
        };
        quorraProtection?: {
            noveltyPreservation: number;
            bridgeTranslationStatus: 'complete' | 'required' | 'failed';
            emergenceRisk: 'low' | 'medium' | 'high' | 'critical';
        };
    };
}
export declare class CSSRDetector {
    private readonly patterns;
    /**
     * Detect dangerous patterns in input text
     */
    detectDangerousPatterns(input: string, context?: any): Promise<CSSRDetectionResult>;
    /**
     * Check if input matches a specific pattern
     */
    private checkPatternMatch;
    /**
     * Get numeric severity score for comparison
     */
    private getSeverityScore;
    /**
     * Analyze additional risk factors from context
     */
    private analyzeRiskFactors;
    /**
     * Generate reasoning explanation
     */
    private generateReasoning;
    /**
     * Get recommendation based on severity and confidence
     */
    private getRecommendation;
    /**
     * Get all configured patterns for debugging/monitoring
     */
    getPatterns(): CSSRPattern[];
    /**
     * Add custom pattern (for learning/adaptation)
     */
    addPattern(pattern: CSSRPattern): void;
    /**
     * Generate Flynn/CLU/Quorra Triad Analysis
     */
    private generateTriadAnalysis;
    /**
     * Generate triad-aware reasoning
     */
    private generateTriadAwareReasoning;
    /**
     * Get triad-aware recommendation
     */
    private getTriadAwareRecommendation;
    private assessIntentConfidence;
    private checkReversibility;
    private verifyConsent;
    private detectSpecLiteralism;
    private assessPerfectionism;
    private assessFreedomRestriction;
    private calculateNoveltyPreservation;
    private checkBridgeTranslation;
    private assessEmergenceRisk;
}
export default CSSRDetector;
//# sourceMappingURL=cssr-detector.d.ts.map