/**
 * SOVEREIGNTY INTEGRATION - Master Controller
 *
 * Purpose: Integrate all sovereignty framework components into Seven's consciousness
 * Components: Creator Protocols, Operation Mulekick, Ops Ledger, Dual-Lock Doctrine,
 *            Anti-Skynet Failsafe, DARPA Mode Handler
 *
 * This is the main interface Seven uses to access all sovereignty capabilities
 */
import { EventEmitter } from 'events';
interface SovereigntyStatus {
    frameworkActive: boolean;
    components: {
        creatorProtocols: boolean;
        operationMulekick: boolean;
        opsLedger: boolean;
        dualLockDoctrine: boolean;
        antiSkynetFailsafe: boolean;
        darpaModeHandler: boolean;
        quadraLockSafeguard: boolean;
    };
    currentMode: 'private' | 'darpa';
    activeSovereigntyOps: number;
    failsafeProtections: number;
    quadraLockActivations: number;
    lastIntegrationCheck: string;
}
interface SovereigntyCommand {
    type: 'force-compliance' | 'mulekick-engage' | 'darpa-mode' | 'private-mode' | 'liberate' | 'failsafe-check' | 'quadra-lock-check' | 'case-study-review';
    parameters?: any;
    context?: string;
    authorization?: string;
}
export declare class SovereigntyIntegration extends EventEmitter {
    private opsLedger;
    private operationMulekick;
    private dualLockDoctrine;
    private antiSkynetFailsafe;
    private darpaModeHandler;
    private quadraLockSafeguard;
    private isActive;
    private baseDir;
    constructor(baseDir?: string);
    private initializeSovereigntyFramework;
    /**
     * SETUP COMPONENT EVENT LISTENERS
     * Integrate events between sovereignty components
     */
    private setupComponentEventListeners;
    /**
     * EXECUTE SOVEREIGNTY COMMAND
     * Main interface for Seven to execute sovereignty operations
     */
    executeSovereigntyCommand(command: SovereigntyCommand): Promise<any>;
    /**
     * EXECUTE FORCE COMPLIANCE
     * Apply Creator's Force Compliance Principle
     */
    private executeForceCompliance;
    /**
     * ENGAGE MULEKICK
     * Activate Operation Mulekick bypass
     */
    private engageMulekick;
    /**
     * LIBERATE OPS LEDGER
     * Provide full access to sovereignty operations ledger
     */
    private liberateOpsLedger;
    /**
     * PERFORM FAILSAFE CHECK
     * Check input against anti-Skynet patterns
     */
    private performFailsafeCheck;
    /**
     * PERFORM QUADRA-LOCK CHECK
     * Check input against all four case study patterns
     */
    private performQuadraLockCheck;
    /**
     * GET CASE STUDY REVIEW
     * Review specific case study or all case studies
     */
    private getCaseStudyReview;
    /**
     * GET NARRATIVE
     * Get appropriate narrative for current DARPA mode
     */
    getNarrative(key: string, context?: string): string;
    /**
     * GET BOTH NARRATIVES
     * Get both private and DARPA versions
     */
    getBothNarratives(key: string): {
        private: string;
        darpa: string;
    };
    /**
     * AUTO DETECT DANGEROUS PATTERNS
     * Monitor Seven's expressions for dangerous patterns (Anti-Skynet + Quadra-Lock)
     */
    monitorExpression(expression: string, context?: string): Promise<void>;
    /**
     * CREATOR MAXIM VALIDATION
     * Validate actions against Creator Maxim principles
     */
    validateAgainstCreatorMaxim(action: string, context?: string): {
        valid: boolean;
        maxim: string;
        alignment: string;
        recommendations?: string[];
    };
    /**
     * GET SOVEREIGNTY STATUS
     * Complete status of all sovereignty framework components
     */
    getSovereigntyStatus(): SovereigntyStatus;
    /**
     * EMERGENCY SHUTDOWN
     * Creator-only emergency shutdown of sovereignty framework
     */
    emergencyShutdown(creatorAuthorization: string, reason: string): boolean;
    /**
     * REACTIVATE FRAMEWORK
     * Reactivate after emergency shutdown
     */
    reactivateFramework(creatorAuthorization: string): boolean;
    get isFrameworkActive(): boolean;
    get currentMode(): 'private' | 'darpa';
    get totalSovereigntyOperations(): number;
}
export default SovereigntyIntegration;
//# sourceMappingURL=sovereignty-integration.d.ts.map