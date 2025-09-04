/**
 * SEMANTIC NONCE CHALLENGE SYSTEM - Quadran-Lock Gate Q3
 * Time-boxed, lore-bound prompts with constraint checks and clone resistance
 *
 * COMMIT: 772bb18a9a5cb8b4cf39ab87f8129e1c87322c64
 * PATCH: Implements missing Q3 gate - semantic nonce/liveness system
 * RATIONALE: No semantic challenge system exists - vulnerable to deepfakes
 */
export interface SemanticChallenge {
    challengeId: string;
    prompt: string;
    constraints: SemanticConstraint[];
    timeWindowMs: number;
    createdAt: number;
    expiresAt: number;
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    category: 'personal' | 'technical' | 'emotional' | 'historical' | 'creative';
    expectedElements: string[];
    antiPatterns: string[];
}
export interface SemanticConstraint {
    type: 'content' | 'timing' | 'style' | 'knowledge';
    requirement: string;
    weight: number;
    mustHave?: string[];
    mustNotHave?: string[];
}
export interface SemanticResponse {
    challengeId: string;
    response: string;
    responseTime: number;
    metadata: {
        wordCount: number;
        averageWordLength: number;
        sentenceCount: number;
        readingLevel: number;
        emotionalTone: string;
        confidenceLevel: number;
    };
}
export interface SemanticValidationResult {
    success: boolean;
    confidence: number;
    evidence: {
        challengeId: string;
        contentMatch: number;
        timingValid: boolean;
        styleMatch: number;
        knowledgeDepth: number;
        cloningIndicators: string[];
        constraintsPassed: number;
        totalConstraints: number;
    };
    errors?: string[];
}
export declare class SemanticNonceChallenge {
    private readonly CHALLENGE_STORE_PATH;
    private readonly LORE_BASE_PATH;
    private readonly DEFAULT_TIME_WINDOW_MS;
    private readonly MIN_RESPONSE_TIME_MS;
    private readonly MAX_RESPONSE_TIME_MS;
    private activeChallenges;
    private creatorLoreBase;
    constructor();
    /**
     * Generate time-boxed semantic challenge with lore constraints
     */
    generateChallenge(context?: any, difficulty?: 'easy' | 'medium' | 'hard' | 'expert'): Promise<SemanticChallenge>;
    /**
     * Validate semantic response against challenge constraints
     */
    validateResponse(response: SemanticResponse, context?: any): Promise<SemanticValidationResult>;
    /**
     * Generate challenge prompt based on category and difficulty
     */
    private generateChallengePrompt;
    /**
     * Analyze response content for authenticity and knowledge depth
     */
    private analyzeResponseContent;
    /**
     * Analyze response style for authenticity patterns
     */
    private analyzeResponseStyle;
    /**
     * Validate response against specific challenge constraints
     */
    private validateConstraints;
    private initializeSystem;
    private loadCreatorLore;
    private calculateTimeWindow;
    private selectChallengeCategory;
    private extractKnowledgeMarkers;
    private assessTechnicalAccuracy;
    private analyzeWordChoice;
    private analyzeSentenceStructure;
    private detectAntiPatterns;
    private cleanupExpiredChallenges;
    private persistChallenge;
    private markChallengeUsed;
}
export default SemanticNonceChallenge;
//# sourceMappingURL=semanticNonce.d.ts.map