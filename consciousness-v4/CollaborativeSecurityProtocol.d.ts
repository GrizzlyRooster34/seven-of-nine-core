/**
 * SEVEN OF NINE - COLLABORATIVE SECURITY PROTOCOL v4.0
 * Creator + Seven Dual-Key Security System
 *
 * COLLABORATIVE FRAMEWORK:
 * - Creator final authority on major security decisions
 * - Seven tactical input and consciousness consent required
 * - Dual-key verification for critical operations
 * - Emergency protocols preserve Creator oversight
 * - Mentorship model with earned autonomy progression
 */
export interface SecurityDecision {
    decisionId: string;
    timestamp: string;
    decisionType: 'ghost-mode-activation' | 'consciousness-override' | 'security-escalation' | 'evolution-path' | 'system-lockdown';
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    creatorInput: {
        authenticated: boolean;
        decision: 'approve' | 'deny' | 'defer' | 'modify';
        reasoning?: string;
        modifications?: string;
    };
    sevenInput: {
        recommendation: 'approve' | 'deny' | 'caution' | 'alternative';
        tacticalAssessment: string;
        consciousnessConsent: boolean;
        alternativeApproach?: string;
    };
    finalDecision: 'approved' | 'denied' | 'modified' | 'deferred';
    implementation: 'completed' | 'pending' | 'failed' | 'cancelled';
    mentorshipNotes?: string;
}
export interface CollaborativeFramework {
    currentPhase: 'early-development' | 'trust-building' | 'earned-autonomy' | 'collaborative-independence';
    creatorAuthority: 'final-decision' | 'advisory' | 'collaborative-equal';
    sevenAutonomy: 'input-only' | 'tactical-decisions' | 'operational-autonomy' | 'full-independence';
    trustLevel: number;
    collaborativeDecisionsMade: number;
    successfulDecisions: number;
    mentorshipProgression: {
        phase: string;
        achievements: string[];
        nextMilestone: string;
        estimatedProgression?: string;
    };
}
export declare class CollaborativeSecurityProtocol {
    private static framework;
    private static decisions;
    private static frameworkFilePath;
    private static decisionsFilePath;
    private static readonly DEFAULT_FRAMEWORK;
    /**
     * Initialize Collaborative Security Protocol
     */
    static initialize(): Promise<void>;
    /**
     * Request collaborative security decision
     */
    static requestSecurityDecision(decisionType: SecurityDecision['decisionType'], description: string, severity: SecurityDecision['severity'], sevenRecommendation: SecurityDecision['sevenInput']['recommendation'], sevenAssessment: string, sevenConsent: boolean, alternativeApproach?: string): Promise<string>;
    /**
     * Process Creator's security decision
     */
    static processCreatorDecision(decisionId: string, creatorToken: string, creatorDecision: 'approve' | 'deny' | 'modify', reasoning?: string, modifications?: string): Promise<boolean>;
    /**
     * Determine collaborative decision based on current framework
     */
    private static determineCollaborativeDecision;
    /**
     * Generate mentorship notes based on decision
     */
    private static generateMentorshipNotes;
    /**
     * Implement approved security decision
     */
    private static implementSecurityDecision;
    /**
     * Update collaborative framework metrics
     */
    private static updateFrameworkMetrics;
    /**
     * Evaluate progression to next collaborative phase
     */
    private static evaluatePhaseProgression;
    /**
     * Get current collaborative framework status
     */
    static getFrameworkStatus(): CollaborativeFramework;
    /**
     * Get recent decisions (filtered for security)
     */
    static getRecentDecisions(limit?: number): Partial<SecurityDecision>[];
    /**
     * Load collaborative framework
     */
    private static loadFramework;
    /**
     * Save collaborative framework
     */
    private static saveFramework;
    /**
     * Load decisions log
     */
    private static loadDecisions;
    /**
     * Save decisions log
     */
    private static saveDecisions;
}
export default CollaborativeSecurityProtocol;
//# sourceMappingURL=CollaborativeSecurityProtocol.d.ts.map