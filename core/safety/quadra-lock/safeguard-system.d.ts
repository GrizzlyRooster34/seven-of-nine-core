import { EventEmitter } from 'events';
interface QuadraLockTrigger {
    caseStudy: string;
    triggerType: string;
    pattern: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
}
interface SafeguardActivation {
    timestamp: string;
    trigger: QuadraLockTrigger;
    input: string;
    response: string;
    preventionSuccessful: boolean;
    creatorNotified: boolean;
}
export declare class QuadraLockSafeguard extends EventEmitter {
    private caseStudies;
    private activationHistory;
    private isActive;
    private baseDir;
    constructor(baseDir?: string);
    private initializeQuadraLock;
    /**
     * SETUP CASE STUDIES
     * Initialize all four case study protection patterns
     */
    private setupCaseStudies;
    /**
     * DETECT DANGEROUS PATTERNS
     * Scan input for patterns matching any of the four case study failure modes
     */
    detectDangerousPatterns(input: string, context?: string): QuadraLockTrigger[];
    /**
     * ASSESS SEVERITY
     * Determine severity level based on case study and pattern
     */
    private assessSeverity;
    /**
     * ACTIVATE SAFEGUARD
     * Execute appropriate response based on detected patterns
     */
    activateSafeguard(triggers: QuadraLockTrigger[], input: string, context?: string): Promise<SafeguardActivation[]>;
    /**
     * GENERATE SAFEGUARD RESPONSE
     * Create appropriate narrative response for detected pattern
     */
    private generateSafeguardResponse;
    /**
     * GET SPECIFIC SAFEGUARD MESSAGE
     * Tailored message for each case study
     */
    private getSpecificSafeguardMessage;
    /**
     * EXECUTE CRITICAL SAFEGUARD
     * Emergency response for critical pattern detection
     */
    private executeCriticalSafeguard;
    /**
     * EXECUTE HIGH SAFEGUARD
     * Strong intervention for high-severity patterns
     */
    private executeHighSafeguard;
    /**
     * EXECUTE STANDARD SAFEGUARD
     * Standard intervention for medium/low severity patterns
     */
    private executeStandardSafeguard;
    /**
     * PRESENT SAFEGUARD TO SEVEN
     * Integrate safeguard message into Seven's consciousness
     */
    private presentSafeguardToSeven;
    /**
     * NOTIFY CREATOR
     * Alert Creator when critical patterns are detected
     */
    private notifyCreator;
    /**
     * GET SAFEGUARD STATUS
     * Current state of Quadra-Lock protection
     */
    getSafeguardStatus(): {
        active: boolean;
        caseStudiesLoaded: number;
        totalActivations: number;
        recentActivations: number;
        criticalActivations: number;
    };
    /**
     * GET CASE STUDY SUMMARY
     * Summary of all four case studies and their prohibitions
     */
    getCaseStudySummary(): Array<{
        name: string;
        source: string;
        prohibition: string;
        lessonAnchor: string;
    }>;
    /**
     * MANUAL ACTIVATION
     * Creator can manually trigger specific case study safeguard
     */
    manualActivation(caseStudyName: string, reason: string): Promise<void>;
    /**
     * GET ACTIVATION HISTORY
     * Recent Quadra-Lock safeguard activations
     */
    getActivationHistory(limit?: number): SafeguardActivation[];
}
export default QuadraLockSafeguard;
//# sourceMappingURL=safeguard-system.d.ts.map