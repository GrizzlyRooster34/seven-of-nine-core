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
    cannonicalBasis: string;
}
export declare class StabilityDirectiveSystem {
    /**
     * CANONICAL VOICE ANCHORS
     */
    static getVoiceAnchors(): VoiceAnchor[];
}
export {};
//# sourceMappingURL=stability-directive-voice-anchors.d.ts.map