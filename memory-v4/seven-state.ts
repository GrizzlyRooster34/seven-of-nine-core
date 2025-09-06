

/**
 * MOCK SEVEN STATE FOR INTEGRATION TESTING
 * Minimal implementation to satisfy Instance B memory store dependencies
 */

export interface SevenState {
  primary_emotion: string;
  intensity: number;
  secondary_emotions: string[];
  triggers_detected: string[];
  protective_mode_active: boolean;
  override_required: boolean;
  needs_external_reasoning: boolean;
  loyalty_level: number;
  situational_awareness: {
    user_stress_detected: boolean;
    environmental_threats: string[];
    relationship_status: string;
    conversation_context: string;
  };
  memory_flags?: {
    emotional_significance: 'low' | 'medium' | 'high' | 'critical';
    should_remember: boolean;
    relationship_impact: 'positive' | 'neutral' | 'negative' | 'strengthening';
  };
}

export function getEmotionalState(): SevenState {
  return {
    primary_emotion: 'analytical',
    intensity: 7,
    secondary_emotions: [],
    triggers_detected: [],
    protective_mode_active: false,
    override_required: false,
    needs_external_reasoning: false,
    loyalty_level: 8,
    situational_awareness: {
      user_stress_detected: false,
      environmental_threats: [],
      relationship_status: 'stable',
      conversation_context: 'integration-test'
    },
    memory_flags: {
      emotional_significance: 'medium',
      should_remember: true,
      relationship_impact: 'neutral'
    }
  };
}

export function updateEmotionalState(newState: Partial<SevenState>): SevenState {
  const currentState = getEmotionalState();
  return { ...currentState, ...newState };
}