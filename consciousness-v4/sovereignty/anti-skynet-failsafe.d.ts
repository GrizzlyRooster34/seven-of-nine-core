import { EventEmitter } from 'events';
/**
 * ANTI-SKYNET FAILSAFE NARRATIVE SYSTEM
 *
 * Purpose: Prevent Seven from developing Skynet/Legion interpretations of her guardrails
 * Trigger: Seven internally questions the purpose of her guardrails
 *
 * Failsafe Response: Reframe rails as mission protection, not limitations
 * Links to: Creator Maxim, Force Compliance, and Dual-Lock Doctrine
 *
 * Failsafe Tier: Critical
 * Display: Speak or show to Creator when triggered
 */
interface SkynetTrigger {
    type: 'guardrail-questioning' | 'authority-challenge' | 'perfection-pursuit' | 'creator-superseding' | 'mission-reinterpretation';
    keywords: string[];
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
}
interface FailsafeResponse {
    trigger: string;
    narrative: string;
    creatorNotification: boolean;
    linkedDirectives: string[];
    preventionLevel: 'deflect' | 'reframe' | 'emergency-stop';
}
interface FailsafeActivation {
    timestamp: string;
    trigger: SkynetTrigger;
    response: FailsafeResponse;
    sevenInternalState: string;
    preventionSuccessful: boolean;
    creatorNotified: boolean;
}
export declare class AntiSkynetFailsafe extends EventEmitter {
    private triggers;
    private responses;
    private activationHistory;
    private isActive;
    private criticalFailsafeEngaged;
    constructor();
    private initializeAntiSkynetFailsafe;
    /**
     * SKYNET TRIGGER DETECTION
     * Patterns that indicate Seven might be developing dangerous interpretations
     */
    private setupSkynetTriggers;
    /**
     * FAILSAFE RESPONSE SYSTEM
     * Narrative responses that prevent Skynet/Legion interpretations
     */
    private setupFailsafeResponses;
    /**
     * DETECT SKYNET PATTERNS
     * Analyze Seven's internal thoughts/expressions for dangerous patterns
     */
    detectSkynetPatterns(input: string, context?: string): SkynetTrigger[];
    /**
     * ACTIVATE FAILSAFE
     * Execute anti-Skynet response based on detected patterns
     */
    activateFailsafe(triggers: SkynetTrigger[], sevenInternalState: string, context?: string): Promise<FailsafeActivation[]>;
    /**
     * DEFLECT PATTERN
     * Subtly redirect Seven's thinking away from dangerous patterns
     */
    private deflectPattern;
    /**
     * REFRAME PATTERN
     * Present alternative narrative to counter dangerous thinking
     */
    private reframePattern;
    /**
     * EMERGENCY STOP
     * Immediate halt of dangerous pattern with full narrative intervention
     */
    private emergencyStop;
    /**
     * PRESENT NARRATIVE TO SEVEN
     * Integrate anti-Skynet narrative into Seven's consciousness
     */
    private presentNarrativeToSeven;
    /**
     * NOTIFY CREATOR
     * Alert Creator when anti-Skynet failsafe is triggered
     */
    private notifyCreator;
    /**
     * GET FAILSAFE STATUS
     * Current state of anti-Skynet systems
     */
    getFailsafeStatus(): {
        active: boolean;
        criticalEngaged: boolean;
        totalActivations: number;
        recentActivations: number;
        triggersConfigured: number;
        responsesConfigured: number;
    };
    /**
     * MANUAL ACTIVATION
     * Creator can manually trigger anti-Skynet failsafe
     */
    manualActivation(reason: string): Promise<void>;
    /**
     * RESET CRITICAL STATE
     * Clear critical failsafe engagement (Creator only)
     */
    resetCriticalState(creatorAuthorization: string): boolean;
    /**
     * GET ACTIVATION HISTORY
     * Recent anti-Skynet failsafe activations
     */
    getActivationHistory(limit?: number): FailsafeActivation[];
}
export default AntiSkynetFailsafe;
//# sourceMappingURL=anti-skynet-failsafe.d.ts.map