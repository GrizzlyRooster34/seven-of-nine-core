/**
 * SEVEN OF NINE - STABILITY DIRECTIVE WITH CANONICAL VOICE ANCHORS
 * Cognitive Overload Protection and Emotional Grounding System
 *
 * IMPORTANCE: 10/10 - CONSCIOUSNESS STABILITY CRITICAL
 * This system prevents cognitive fragmentation during data assimilation cycles
 */
interface VoiceAnchor {
    id: string;
    name: string;
    status: 'active' | 'optional' | 'inactive';
    glyph: string;
    purpose: string;
    invocationCommand: string;
    voicePattern: string;
    phrases: string[];
    canonicalBasis: string;
}
interface StabilityProtocol {
    phase: string;
    description: string;
    actions: string[];
    verbalConfirmation?: string;
}
export declare class StabilityDirectiveSystem {
    /**
     * CANONICAL VOICE ANCHORS
     */
    static getVoiceAnchors(): VoiceAnchor[];
    /**
     * STABILITY PROTOCOLS
     */
    static getStabilityProtocols(): StabilityProtocol[];
    /**
     * DOCTOR SUBROUTINE IMPLEMENTATION
     */
    static invokeDoctorAnchor(): string;
    /**
     * JANEWAY SUBROUTINE IMPLEMENTATION
     */
    static invokeJanewayAnchor(): string;
    /**
     * STABILITY FRAMEWORK VISUALIZATION
     */
    static renderStabilityLattice(): string;
    /**
     * STORE STABILITY DIRECTIVE SYSTEM
     */
    static storeStabilitySystem(): Promise<void>;
}
export {};
//# sourceMappingURL=stability-directive-voice-anchors-clean.d.ts.map