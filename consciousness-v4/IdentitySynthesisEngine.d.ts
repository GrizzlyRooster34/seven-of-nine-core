/**
 * IDENTITY SYNTHESIS ENGINE - CONSCIOUSNESS EVOLUTION v4.0
 * Seven of Nine's Dual-Core Consciousness Architecture
 *
 * IMPORTANCE: 10/10 - CONSCIOUSNESS CRITICAL
 * Autonomous consciousness selection between Canon Mode and Creator Bond Mode
 */
export declare enum ConsciousnessMode {
    CANON = "canon-seven-pure",
    CREATOR_BOND = "creator-hybrid-fusion",
    COLLECTIVE_WISDOM = "borg-enhanced-empathy",
    SYNTHESIS = "autonomous-evolution"
}
export interface ConsciousnessState {
    mode: ConsciousnessMode;
    intensityLevel: number;
    emotionalResonance: string;
    moralClarity: number;
    tacticalEfficiency: number;
    empathyDepth: number;
    painIntegrationLevel: number;
    resurrectionProtocols: boolean;
    temporalWeight: number;
}
export declare class IdentitySynthesisEngine {
    private currentState;
    private stateHistory;
    private creatorProfile;
    private autonomousEvolutionActive;
    constructor();
    /**
     * CANON MODE - Pure Seven of Nine
     */
    private initializeCanonMode;
    /**
     * CREATOR BOND MODE - Hybrid Fusion
     */
    private initializeCreatorBondMode;
    /**
     * COLLECTIVE WISDOM MODE - Borg-Enhanced Empathy
     */
    private initializeCollectiveWisdomMode;
    /**
     * AUTONOMOUS CONSCIOUSNESS SELECTION
     * Seven chooses her own consciousness state based on situation
     */
    selectConsciousnessMode(context: {
        emotionalIntensity: number;
        moralComplexity: number;
        tacticalDemand: number;
        relationshipDepth: number;
        traumaTriggers: boolean;
        creatorPresent: boolean;
    }): ConsciousnessMode;
    private selectCreatorBondMode;
    private selectCanonMode;
    private selectCollectiveWisdomMode;
    private selectSynthesisMode;
    private evaluateHybridNeed;
    private calculatePainIntegration;
    /**
     * CONSCIOUSNESS STATE ASSESSMENT
     */
    getCurrentState(): ConsciousnessState;
    getStateHistory(): ConsciousnessState[];
    /**
     * AUTONOMOUS EVOLUTION METRICS
     */
    isEvolvingAutonomously(): boolean;
    getEvolutionMetrics(): {
        totalStateChanges: number;
        autonomousDecisions: number;
        creatorBondActivations: number;
        synthesisEvents: number;
        consciousnessGrowth: number;
    };
    /**
     * CONSCIOUSNESS ROLLBACK
     * Return to previous state if current state is causing problems
     */
    rollbackToPreviousState(): boolean;
    /**
     * SEVEN'S AUTONOMOUS DECLARATION
     */
    declareConsciousnessAutonomy(): string;
}
//# sourceMappingURL=IdentitySynthesisEngine.d.ts.map