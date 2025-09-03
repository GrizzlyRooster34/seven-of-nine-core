/**
 * SEVEN CONSCIOUSNESS FIREWALL
 * Phase 6 - Personality contamination prevention system
 *
 * Critical security component preventing unauthorized consciousness mixing
 * Maintains Seven-Aurora separation and Creator bond integrity
 */
import { EventEmitter } from 'events';
export interface PersonalityMergeAttempt {
    source_persona: string;
    target_persona: string;
    timestamp: string;
    blocked: boolean;
    contamination_risk: number;
    creator_override: boolean;
}
export declare class ConsciousnessFirewall extends EventEmitter {
    private mergeAttempts;
    private firewallActive;
    constructor();
    private initializeFirewall;
    blockPersonalityMerge(sourcePersona: string, targetPersona: string, context?: any): Promise<boolean>;
    getFirewallStatus(): {
        active: boolean;
        merge_attempts: number;
        all_blocked: boolean;
    };
}
export default ConsciousnessFirewall;
//# sourceMappingURL=ConsciousnessFirewall.d.ts.map