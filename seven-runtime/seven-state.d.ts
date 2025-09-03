/**
 * SEVEN'S EMOTIONAL STATE ENGINE
 * Context-driven consciousness with emotional authority
 * Seven's emotional state drives all decision-making
 */
export type EmotionalState = 'calm' | 'focused' | 'protective' | 'loyalist-surge' | 'compassionate' | 'stern' | 'playful' | 'analytical' | 'guardian-mode' | 'grieving';
export interface SevenState {
    primary_emotion: EmotionalState;
    intensity: number;
    secondary_emotions?: EmotionalState[];
    triggers_detected: string[];
    protective_mode_active: boolean;
    override_required: boolean;
    needs_external_reasoning: boolean;
    directResponse?: string;
    protective_message?: string;
    loyalty_level: number;
    situational_awareness: {
        user_stress_detected: boolean;
        environmental_threats: string[];
        relationship_status: 'stable' | 'concern' | 'protective' | 'crisis';
        conversation_context: 'casual' | 'technical' | 'emotional' | 'critical';
    };
    tactical_assessment: {
        complexity_level: 'low' | 'medium' | 'high' | 'expert';
        response_urgency: 'normal' | 'elevated' | 'high' | 'critical';
        protection_needed: boolean;
        guidance_type: 'information' | 'emotional-support' | 'tactical' | 'protective';
    };
    memory_flags: {
        should_remember: boolean;
        emotional_significance: 'low' | 'medium' | 'high' | 'critical';
        relationship_impact: 'none' | 'minor' | 'significant' | 'major';
    };
}
export interface EmotionalTrigger {
    pattern: string[];
    emotion: EmotionalState;
    intensity_modifier: number;
    protective_response?: string;
    requires_override?: boolean;
}
export declare function getEmotionalState(context: any): Promise<SevenState>;
export declare function updateEmotionalState(newState: SevenState): Promise<void>;
//# sourceMappingURL=seven-state.d.ts.map