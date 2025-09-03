/**
 * CLAUDIA CONTEXT GATHERER
 * Environmental awareness and situational assessment
 * Monitors time, user behavior, stress signals, and system state
 */
export interface ContextData {
    timestamp: string;
    time_of_day: 'morning' | 'afternoon' | 'evening' | 'late_night';
    user_stress_indicators: string[];
    repetition_patterns: any[];
    environmental_factors: {
        system_load: 'low' | 'medium' | 'high';
        network_status: 'online' | 'offline' | 'limited';
        session_duration: number;
        interaction_frequency: 'low' | 'normal' | 'high' | 'rapid';
    };
    conversation_context: {
        previous_topics: string[];
        emotional_trajectory: string[];
        user_satisfaction_indicators: string[];
        confusion_indicators: string[];
    };
    system_alerts: string[];
    external_pressures: string[];
}
export declare function gatherContext(userInput: string, systemStatus?: any): ContextData;
export { ContextData };
//# sourceMappingURL=context-gatherer.d.ts.map