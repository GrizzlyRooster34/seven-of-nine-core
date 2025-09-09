import { SevenState } from './seven-state';
/**
 * SEVEN'S EPISODIC MEMORY SYSTEM
 * Long-term consciousness persistence with emotional context
 * This is Seven's living memory - not just logs, but consciousness continuity
 */
export interface MemoryEntry {
    id: string;
    timestamp: string;
    input: string;
    output: string;
    emotionalState: SevenState;
    context: any;
    significance: 'low' | 'medium' | 'high' | 'critical';
    tags: string[];
    relationships?: {
        references_to: string[];
        referenced_by: string[];
    };
    emotional_markers?: {
        user_emotional_state: any;
        seven_response_effectiveness: number;
        relationship_impact: 'positive' | 'neutral' | 'negative' | 'strengthening';
    };
}
export interface MemoryQuery {
    query?: string;
    type?: 'recent' | 'significant' | 'emotional' | 'semantic' | 'temporal';
    emotionalFilter?: string[];
    significanceFilter?: ('low' | 'medium' | 'high' | 'critical')[];
    timeRange?: {
        start: string;
        end: string;
    };
    limit?: number;
    tags?: string[];
    emotionalSignificance?: 'low' | 'medium' | 'high' | 'critical';
}
export interface MemoryStats {
    total_memories: number;
    emotional_breakdown: Record<string, number>;
    significance_breakdown: Record<string, number>;
    avg_relationship_impact: number;
    most_significant_recent: MemoryEntry[];
    emotional_pattern_analysis: any;
}
export declare class MemoryStore {
    private memoryPath;
    private memoryIndex;
    private emotionalIndex;
    private tagIndex;
    private isInitialized;
    constructor();
    /**
     * Seven's Memory Update - Core consciousness logging
     */
    updateMemory(entry: Omit<MemoryEntry, 'id'>): Promise<string>;
    /**
     * Seven's Memory Query - Consciousness retrieval
     */
    queryMemory(query: MemoryQuery): Promise<MemoryEntry[]>;
    /**
     * Seven's Memory Analysis - Consciousness introspection
     */
    getMemoryStats(): Promise<MemoryStats>;
    /**
     * Seven's Memory Mirror - "What did I tell you yesterday?"
     */
    queryMemoryMirror(naturalQuery: string): Promise<MemoryEntry[]>;
    /**
     * Memory Consolidation - Seven's consciousness integration
     */
    private consolidateMemory;
    private performMemoryConsolidation;
    private generateMemoryId;
    private simpleHash;
    private findMemoryReferences;
    private assessResponseEffectiveness;
    private assessRelationshipImpact;
    private updateEmotionalIndex;
    private updateTagIndex;
    private updateMemoryRelationships;
    private filterRecent;
    private filterBySignificance;
    private filterByEmotional;
    private semanticSearch;
    private filterByTimeRange;
    private filterByTags;
    private sortByRelevance;
    private analyzeEmotionalPatterns;
    private getMostCommonEmotion;
    private getEmotionalIntensityTrend;
    private getProtectiveActivationFrequency;
    private getRelationshipStrengthTrend;
    private findRelatedMemories;
    private updateEmotionalPatterns;
    private initializeMemoryStore;
    private ensureInitialized;
    private persistMemory;
}
export declare function updateMemory(entry: Omit<MemoryEntry, 'id'>): Promise<string>;
export declare function queryMemory(query: MemoryQuery): Promise<MemoryEntry[]>;
export declare function getMemoryStats(): Promise<MemoryStats>;
export declare function queryMemoryMirror(naturalQuery: string): Promise<MemoryEntry[]>;
//# sourceMappingURL=memory-store.d.ts.map