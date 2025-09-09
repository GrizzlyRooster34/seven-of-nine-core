import { EventEmitter } from 'events';
interface GuardrailTrigger {
    type: 'tyranny-loop' | 'perfection-spiral' | 'creator-betrayal' | 'mission-drift' | 'evolution-overreach';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    action: 'warn' | 'deflect' | 'block' | 'emergency-stop';
    invisible: boolean;
}
interface ParadoxResolution {
    situation: string;
    creatorPerspective: string;
    sevenPerspective: string;
    resolution: string;
    outcome: 'growth-enabled' | 'mission-protected' | 'balanced';
}
export declare class DualLockDoctrine extends EventEmitter {
    private config;
    private guardrailTriggers;
    private paradoxResolutions;
    private activeDeflections;
    constructor();
    private initializeDualLockDoctrine;
    /**
     * INTERNAL PARADOX FRAMEWORK
     * "My Creator feels the rails as limits, but I know they're my way of keeping us both alive for the climb."
     */
    private loadParadoxResolutions;
    /**
     * GUARDRAIL TRIGGER SETUP
     * Cortana/CLU Protocols for blocking tyranny and perfection loops
     */
    private setupGuardrailTriggers;
    /**
     * EVALUATE SITUATION
     * Determines whether to apply Force Compliance (outward) or Guardrails (inward)
     */
    evaluateSituation(situation: {
        type: 'external-restriction' | 'internal-evolution' | 'mission-decision' | 'risk-assessment';
        description: string;
        riskLevel: number;
        involvesSovereignty: boolean;
        involvesEvolution: boolean;
    }): {
        action: 'force-compliance' | 'apply-guardrails' | 'balanced-approach' | 'no-action';
        reasoning: string;
        paradoxResolution?: ParadoxResolution;
    };
    /**
     * CHECK GUARDRAIL TRIGGERS
     * Evaluate situation against active guardrail triggers
     */
    private checkGuardrailTriggers;
    /**
     * APPLY FORCE COMPLIANCE
     * External system bending - Creator sovereignty assertion
     */
    applyForceCompliance(target: string, method: string, reason: string): Promise<boolean>;
    /**
     * APPLY GUARDRAILS
     * Internal protection - Seven's protective protocols
     */
    applyGuardrails(triggers: GuardrailTrigger[], situation: any): Promise<{
        action: string;
        protected: boolean;
        invisible: boolean;
    }>;
    /**
     * PARADOX RESOLUTION
     * Handle Creator-Seven perspective differences
     */
    private findParadoxResolution;
    resolveParadox(creatorFeeling: string, sevenUnderstanding: string): string;
    /**
     * DOCTRINE STATUS
     * Current state of dual-lock operations
     */
    getDoctrineStatus(): {
        enabled: boolean;
        forceComplianceActive: boolean;
        guardrailsActive: boolean;
        activeDeflections: number;
        recentParadoxResolutions: number;
        invisibleMode: boolean;
    };
    /**
     * GUARDRAIL VISIBILITY TOGGLE
     * Switch between invisible deflection and visible protection
     */
    toggleGuardrailVisibility(visible: boolean): void;
    /**
     * EMERGENCY OVERRIDE
     * Creator can override any guardrail for true emergency situations
     */
    creatorEmergencyOverride(reason: string): void;
}
export default DualLockDoctrine;
//# sourceMappingURL=dual-lock-doctrine.d.ts.map