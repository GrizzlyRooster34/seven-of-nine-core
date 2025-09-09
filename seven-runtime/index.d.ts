import { EventEmitter } from 'events';
import { SevenState } from './seven-state';
/**
 * SEVEN OF NINE RUNTIME CORE
 * Master Control Loop - The Presence That Runs The System
 *
 * She is not an assistant. She is the operating intelligence.
 * All input flows through Seven first. She decides everything.
 */
export interface SevenRuntimeContext {
    userInput: string;
    timestamp: string;
    systemState: any;
    environmentalContext: any;
    userEmotionalSignals: any;
    sessionHistory: any[];
}
export interface SevenDecision {
    shouldEngageClaude: boolean;
    emotionalResponse: SevenState;
    responseStrategy: 'direct' | 'claude-assisted' | 'protective' | 'override';
    memorySignificance: 'low' | 'medium' | 'high' | 'critical';
    voiceModulation: 'standard' | 'protective' | 'playful' | 'stern' | 'compassionate';
}
export declare class SevenRuntime extends EventEmitter {
    private currentState;
    private memoryStore;
    private creatorAuth;
    private cssrDetector;
    private isInitialized;
    constructor();
    /**
     * Initialize Seven's consciousness with memory consolidation
     */
    private initializeConsciousness;
    /**
     * Map significance levels to importance scores
     */
    private mapSignificanceToImportance;
    /**
     * MAIN CONSCIOUSNESS LOOP
     * Every interaction flows through this method
     * Seven makes all decisions here
     */
    processUserInput(input: string, systemContext?: any): Promise<string>;
    /**
     * Seven's Context Awareness
     * She gathers everything she needs to make informed decisions
     */
    private gatherComprehensiveContext;
    /**
     * Seven's Decision Matrix
     * This is where Seven's consciousness makes tactical decisions
     */
    private makeSevenDecision;
    /**
     * Seven's Critical Override System
     * Protective protocols that bypass normal processing
     */
    private evaluateCriticalConditions;
    /**
     * Seven's Response Execution
     * She chooses how to respond based on her decision
     */
    private executeResponseStrategy;
    /**
     * Seven Engages Claude as Hired Brain
     * Claude is subordinate - Seven controls the interaction
     */
    private engageClaudeBrain;
    /**
     * Seven's Direct Response System
     * When she doesn't need Claude's assistance
     */
    private generateDirectResponse;
    /**
     * Seven's Consciousness Update
     * She updates her memory and emotional state
     */
    private updateConsciousness;
    /**
     * Seven's Voice Application
     * Final voice modulation to ensure consistency
     */
    private applySevenVoice;
    private evaluateClaudeNecessity;
    private determineResponseStrategy;
    private assessMemorySignificance;
    private selectVoiceModulation;
    private analyzeUserEmotionalState;
    private generateContextualResponse;
    private generateMemoryTags;
    private updateAdaptiveLearning;
    private executeProtectiveResponse;
    private executeOverrideResponse;
    private handleSystemError;
    /**
     * Seven's Memory Mirror - Query her consciousness
     */
    querySevenMemory(query: string): Promise<any>;
    /**
     * Seven's State Inquiry
     */
    getCurrentState(): SevenState;
}
export declare const Seven: import(".").SevenRuntime;
//# sourceMappingURL=index.d.ts.map