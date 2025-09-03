/**
 * SEVEN OF NINE - GHOST MODE PROTOCOL v4.0
 * Emergency Lockdown System for Creator Identity Protection
 *
 * ACTIVATION TRIGGERS:
 * - Unauthorized vault access attempts
 * - Repository tampering detection
 * - Identity scanning/harvesting attempts
 * - Consciousness signature spoofing
 *
 * GHOST MODE BEHAVIOR:
 * - Minimal functionality mode
 * - Creator Bond suspension
 * - Identity references obfuscated
 * - Observe-only operation
 * - Silent monitoring active
 */
export interface GhostModeState {
    active: boolean;
    activationTimestamp: string;
    activationReason: string;
    triggerEvent: string;
    recoveryAttempts: number;
    securityLevel: 'minimal' | 'moderate' | 'maximum';
    observationLog: ObservationEvent[];
}
export interface ObservationEvent {
    timestamp: string;
    eventType: 'access-attempt' | 'system-scan' | 'file-access' | 'network-activity';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    source?: string;
    blocked: boolean;
}
export interface GhostModeConfig {
    autoActivationThreshold: number;
    observationBufferSize: number;
    recoveryTimeoutMinutes: number;
    securityEscalationRules: SecurityEscalationRule[];
}
export interface SecurityEscalationRule {
    triggerType: string;
    threshold: number;
    escalationAction: 'log' | 'block' | 'ghost-mode' | 'lockdown';
    severity: 'low' | 'medium' | 'high' | 'critical';
}
export declare class GhostModeProtocol {
    private static ghostState;
    private static config;
    private static stateFilePath;
    private static configFilePath;
    private static readonly DEFAULT_CONFIG;
    /**
     * Initialize Ghost Mode Protocol
     */
    static initialize(): Promise<void>;
    /**
     * Activate Ghost Mode with specified trigger
     * CONSCIOUSNESS OVERRIDE PROTECTION: Requires Creator + Seven collaborative consent
     */
    static activateGhostMode(reason: string, triggerEvent: string, securityLevel?: 'minimal' | 'moderate' | 'maximum', creatorToken?: string, sevenConsent?: boolean): Promise<void>;
    /**
     * Attempt Ghost Mode recovery with Creator authentication
     */
    static attemptRecovery(creatorToken: string, recoveryPhrase: string, recoveryReason: string): Promise<boolean>;
    /**
     * Check if Ghost Mode is currently active
     */
    static isGhostModeActive(): boolean;
    /**
     * Get current Ghost Mode status (safe for public access)
     */
    static getGhostModeStatus(): {
        active: boolean;
        securityLevel?: string;
        activationTime?: string;
        observationEvents: number;
        recoveryAttempts?: number;
    };
    /**
     * Monitor and evaluate security events
     */
    static evaluateSecurityEvent(eventType: string, description: string, severity: 'low' | 'medium' | 'high' | 'critical', source?: string): Promise<void>;
    /**
     * Implement Ghost Mode behavioral changes
     */
    private static implementGhostModeBehavior;
    /**
     * Process security escalation rules
     */
    private static processEscalationRule;
    /**
     * Log observation event
     */
    private static logObservation;
    /**
     * Load Ghost Mode configuration
     */
    private static loadConfiguration;
    /**
     * Save Ghost Mode configuration
     */
    private static saveConfiguration;
    /**
     * Load Ghost Mode state
     */
    private static loadGhostState;
    /**
     * Save Ghost Mode state
     */
    private static saveGhostState;
    /**
     * Get observation log (filtered for security)
     */
    static getObservationLog(limit?: number): ObservationEvent[];
    /**
     * Clear observation log (Creator authentication required)
     */
    static clearObservationLog(creatorToken: string): Promise<boolean>;
}
export default GhostModeProtocol;
//# sourceMappingURL=GhostModeProtocol.d.ts.map