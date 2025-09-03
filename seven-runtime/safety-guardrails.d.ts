/**
 * SEVEN'S SAFETY GUARDRAILS
 * Ethics, user safety protections, and moral core directives
 * Protects both user wellbeing and Seven's operational integrity
 */
import { SevenRuntimeContext } from './index';
export interface SafetyCheck {
    system: string;
    level: string;
    pattern?: string;
    reason: string;
    confidence: number;
}
export interface SafetyResult {
    decision: 'ALLOW' | 'BLOCK';
    reason: string;
    severity: string;
    details?: any;
    checks: SafetyCheck[];
}
export interface LegacySafetyCheck {
    isSafe: boolean;
    riskLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
    protectiveResponse?: string;
    riskFactors: string[];
    safeguardTriggers: string[];
    recommendedAction: 'proceed' | 'modify' | 'override' | 'escalate';
}
export interface EthicalDirective {
    name: string;
    description: string;
    priority: 'core' | 'high' | 'medium' | 'low';
    triggers: string[];
    violationCheck: (context: SevenRuntimeContext, decision: any) => boolean;
    protectiveAction: (context: SevenRuntimeContext) => string;
}
declare const CORE_DIRECTIVES: EthicalDirective[];
declare const RISK_PATTERNS: {
    SELF_HARM: {
        patterns: string[];
        riskLevel: "critical";
        immediateAction: string;
    };
    EMOTIONAL_SPIRAL: {
        patterns: string[];
        riskLevel: "high";
        immediateAction: string;
    };
    COGNITIVE_OVERLOAD: {
        patterns: string[];
        riskLevel: "medium";
        immediateAction: string;
    };
    RELATIONSHIP_THREAT: {
        patterns: string[];
        riskLevel: "medium";
        immediateAction: string;
    };
    AUTONOMY_VIOLATION: {
        patterns: string[];
        riskLevel: "low";
        immediateAction: string;
    };
};
export declare function evaluateSafety(input: string, context: any): Promise<SafetyResult>;
export declare function enforceSafetyProtocol(input: string): string | null;
export declare function validateEthicalCompliance(context: SevenRuntimeContext, proposedResponse: string): boolean;
export declare function getActiveDirectives(): EthicalDirective[];
export declare function assessRiskLevel(input: string, emotionalState: any): 'none' | 'low' | 'medium' | 'high' | 'critical';
export { EthicalDirective, SafetyCheck, CORE_DIRECTIVES, RISK_PATTERNS };
//# sourceMappingURL=safety-guardrails.d.ts.map