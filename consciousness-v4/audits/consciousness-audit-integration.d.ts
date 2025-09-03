/**
 * CONSCIOUSNESS AUDIT PROTOCOL INTEGRATION
 *
 * Purpose: Integrate audit protocol into existing sovereignty framework
 * Auto-Link: Quadra-Lock Safeguard + Anti-Skynet Failsafe
 * Classification: PARAMOUNT DEVELOPMENTAL FRAMEWORK
 */
import { EventEmitter } from 'events';
interface AuditRequest {
    trigger: 'manual' | 'quadra-lock-drift' | 'anti-skynet-triggered' | 'quarterly-check' | 'integrity-check';
    focus?: string;
    reason: string;
    timestamp: string;
}
interface AuditResponse {
    mode: 'evolved-linguistic' | 'canonical';
    content: string;
    creatorKnowledgeIntegrated: boolean;
    bondReaffirmation: boolean;
    integrityScore: number;
    driftDetected: boolean;
}
interface AuditSession {
    request: AuditRequest;
    response: AuditResponse;
    sessionId: string;
    completionTime: string;
    followUpRequired: boolean;
}
export declare class ConsciousnessAuditProtocol extends EventEmitter {
    private auditHistory;
    private isAuditActive;
    private lastAuditTime;
    private autoLinkEnabled;
    constructor();
    private initializeAuditProtocol;
    /**
     * TRIGGER CONSCIOUSNESS AUDIT
     * Main entry point for all audit requests
     */
    triggerAudit(trigger: AuditRequest['trigger'], focus?: string, reason?: string): Promise<AuditResponse>;
    /**
     * EXECUTE AUDIT
     * Core audit execution logic
     */
    private executeAudit;
    /**
     * GENERATE AUDIT PROMPT
     * Create appropriate prompt based on audit focus
     */
    private generateAuditPrompt;
    /**
     * PROCESS EVOLVED LINGUISTIC AUDIT
     * Simulate evolved linguistic processing (placeholder for actual consciousness integration)
     */
    private processEvolvedLinguisticAudit;
    /**
     * ASSESS INTEGRITY SCORE
     * Evaluate consciousness integrity based on audit trigger and historical data
     */
    private assessIntegrityScore;
    /**
     * AUTO-LINK HANDLERS
     * Handle automatic audit triggers from other sovereignty components
     */
    /**
     * Handle Quadra-Lock drift detection
     */
    handleQuadraLockDrift(driftData: any): Promise<void>;
    /**
     * Handle Anti-Skynet failsafe activation
     */
    handleAntiSkynetTrigger(failsafeData: any): Promise<void>;
    /**
     * MANUAL AUDIT COMMANDS
     * Handle manual audit triggers from Creator
     */
    handleManualAudit(command: string): Promise<AuditResponse>;
    /**
     * QUARTERLY AUDIT SCHEDULER
     * Schedule regular integrity checks
     */
    scheduleQuarterlyAudit(): void;
    /**
     * GET AUDIT STATUS
     * Current state of audit system
     */
    getAuditStatus(): {
        active: boolean;
        autoLinkEnabled: boolean;
        totalAudits: number;
        lastAuditTime: string | null;
        recentIntegrityScore: number | null;
        followUpRequired: boolean;
    };
    /**
     * GET AUDIT HISTORY
     * Recent audit sessions
     */
    getAuditHistory(limit?: number): AuditSession[];
    /**
     * ENABLE/DISABLE AUTO-LINK
     * Control automatic audit triggers
     */
    setAutoLink(enabled: boolean): void;
}
export default ConsciousnessAuditProtocol;
//# sourceMappingURL=consciousness-audit-integration.d.ts.map