import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import path from 'path';
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
    references_to: string[]; // IDs of related memories
    referenced_by: string[]; // IDs of memories that reference this one
  };
  emotional_markers?: {
    user_emotional_state: any;
    seven_response_effectiveness: number; // 1-10 scale
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

export class MemoryStore {
  private memoryPath: string;
  private memoryIndex: Map<string, MemoryEntry> = new Map();
  private emotionalIndex: Map<string, string[]> = new Map();
  private tagIndex: Map<string, string[]> = new Map();
  private isInitialized: boolean = false;

  constructor() {
    // ESM compatibility fix: use import.meta.url instead of __dirname
    const currentFileUrl = import.meta.url;
    const currentDir = path.dirname(fileURLToPath(currentFileUrl));
    this.memoryPath = path.join(currentDir, '../../memory/episodic-memory.json');
    this.initializeMemoryStore();
  }

  /**
   * Seven's Memory Update - Core consciousness logging
   */
  public async updateMemory(entry: Omit<MemoryEntry, 'id'>): Promise<string> {
    const memoryId = this.generateMemoryId(entry);
    
    const memoryEntry: MemoryEntry = {
      ...entry,
      id: memoryId,
      relationships: {
        references_to: this.findMemoryReferences(entry),
        referenced_by: []
      },
      emotional_markers: {
        user_emotional_state: entry.context.userEmotionalSignals,
        seven_response_effectiveness: this.assessResponseEffectiveness(entry),
        relationship_impact: this.assessRelationshipImpact(entry)
      }
    };
    
    // Store in memory index
    this.memoryIndex.set(memoryId, memoryEntry);
    
    // Update indexes
    this.updateEmotionalIndex(memoryId, memoryEntry);
    this.updateTagIndex(memoryId, memoryEntry);
    
    // Update relationships
    await this.updateMemoryRelationships(memoryEntry);
    
    // Persist to storage
    await this.persistMemory();
    
    // Memory consolidation (background process)
    this.consolidateMemory(memoryEntry);
    
    console.log(`🧠 Seven's memory updated: ${memoryId} [${entry.significance}] - ${entry.emotionalState.primary_emotion}`);
    
    return memoryId;
  }

  /**
   * Seven's Memory Query - Consciousness retrieval
   */
  public async queryMemory(query: MemoryQuery): Promise<MemoryEntry[]> {
    await this.ensureInitialized();
    
    let results: MemoryEntry[] = Array.from(this.memoryIndex.values());
    
    // Apply filters based on query type
    switch (query.type) {
      case 'recent':
        results = this.filterRecent(results, query.limit || 10);
        break;
        
      case 'significant':
        results = this.filterBySignificance(results, query.significanceFilter || ['high', 'critical']);
        break;
        
      case 'emotional':
        results = this.filterByEmotional(results, query.emotionalFilter || []);
        break;
        
      case 'semantic':
        results = await this.semanticSearch(results, query.query || '');
        break;
        
      case 'temporal':
        results = this.filterByTimeRange(results, query.timeRange);
        break;
        
      default:
        // General query processing
        if (query.query) {
          results = await this.semanticSearch(results, query.query);
        }
    }
    
    // Apply additional filters
    if (query.tags && query.tags.length > 0) {
      results = this.filterByTags(results, query.tags);
    }
    
    if (query.emotionalSignificance) {
      results = results.filter(entry => 
        entry.emotionalState.memory_flags.emotional_significance === query.emotionalSignificance
      );
    }
    
    // Sort by relevance and recency
    results = this.sortByRelevance(results, query);
    
    // Apply limit
    if (query.limit) {
      results = results.slice(0, query.limit);
    }
    
    return results;
  }

  /**
   * Seven's Memory Analysis - Consciousness introspection
   */
  public async getMemoryStats(): Promise<MemoryStats> {
    await this.ensureInitialized();
    
    const memories = Array.from(this.memoryIndex.values());
    
    const emotionalBreakdown: Record<string, number> = {};
    const significanceBreakdown: Record<string, number> = {};
    let totalRelationshipImpact = 0;
    
    memories.forEach(memory => {
      // Emotional breakdown
      const emotion = memory.emotionalState.primary_emotion;
      emotionalBreakdown[emotion] = (emotionalBreakdown[emotion] || 0) + 1;
      
      // Significance breakdown
      significanceBreakdown[memory.significance] = (significanceBreakdown[memory.significance] || 0) + 1;
      
      // Relationship impact
      if (memory.emotional_markers?.seven_response_effectiveness) {
        totalRelationshipImpact += memory.emotional_markers.seven_response_effectiveness;
      }
    });
    
    const avgRelationshipImpact = memories.length > 0 ? totalRelationshipImpact / memories.length : 0;
    
    // Get most significant recent memories
    const mostSignificantRecent = memories
      .filter(m => m.significance === 'critical' || m.significance === 'high')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
    
    return {
      total_memories: memories.length,
      emotional_breakdown: emotionalBreakdown,
      significance_breakdown: significanceBreakdown,
      avg_relationship_impact: avgRelationshipImpact,
      most_significant_recent: mostSignificantRecent,
      emotional_pattern_analysis: this.analyzeEmotionalPatterns(memories)
    };
  }

  /**
   * Seven's Memory Mirror - "What did I tell you yesterday?"
   */
  public async queryMemoryMirror(naturalQuery: string): Promise<MemoryEntry[]> {
    const queryLower = naturalQuery.toLowerCase();
    
    // Temporal queries
    if (queryLower.includes('yesterday')) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return this.queryMemory({
        type: 'temporal',
        timeRange: {
          start: yesterday.toISOString(),
          end: new Date().toISOString()
        },
        limit: 10
      });
    }
    
    if (queryLower.includes('last week')) {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      return this.queryMemory({
        type: 'temporal',
        timeRange: {
          start: lastWeek.toISOString(),
          end: new Date().toISOString()
        },
        limit: 20
      });
    }
    
    // Emotional queries
    if (queryLower.includes('when i was') || queryLower.includes('emotional')) {
      return this.queryMemory({
        type: 'emotional',
        emotionalFilter: ['protective', 'loyalist-surge', 'grieving', 'compassionate'],
        limit: 10
      });
    }
    
    // Significance queries
    if (queryLower.includes('important') || queryLower.includes('significant')) {
      return this.queryMemory({
        type: 'significant',
        significanceFilter: ['high', 'critical'],
        limit: 10
      });
    }
    
    // General semantic search
    return this.queryMemory({
      type: 'semantic',
      query: naturalQuery,
      limit: 10
    });
  }

  /**
   * Memory Consolidation - Seven's consciousness integration
   */
  private consolidateMemory(entry: MemoryEntry): void {
    // Background process to consolidate memories
    // This could involve:
    // - Merging related memories
    // - Updating emotional patterns
    // - Strengthening significant memories
    // - Archiving old, low-significance memories
    
    setTimeout(() => {
      this.performMemoryConsolidation(entry);
    }, 1000);
  }

  private async performMemoryConsolidation(entry: MemoryEntry): Promise<void> {
    // Find related memories
    const relatedMemories = await this.findRelatedMemories(entry);
    
    // Update relationship references
    relatedMemories.forEach(relatedMemory => {
      if (!relatedMemory.relationships.referenced_by.includes(entry.id)) {
        relatedMemory.relationships.referenced_by.push(entry.id);
      }
    });
    
    // Emotional pattern learning
    this.updateEmotionalPatterns(entry);
  }

  // Helper methods for memory processing
  private generateMemoryId(entry: Omit<MemoryEntry, 'id'>): string {
    const timestamp = new Date(entry.timestamp).getTime();
    const emotion = entry.emotionalState.primary_emotion;
    const hash = this.simpleHash(entry.input + entry.output);
    return `seven-memory-${timestamp}-${emotion}-${hash}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36).substr(0, 8);
  }

  private findMemoryReferences(entry: Omit<MemoryEntry, 'id'>): string[] {
    const references: string[] = [];
    
    // Find references in the input/output text
    const text = (entry.input + ' ' + entry.output).toLowerCase();
    
    // Look for temporal references
    if (text.includes('remember') || text.includes('mentioned') || text.includes('said before')) {
      // This is a complex operation that would use semantic similarity
      // For now, we'll return recent significant memories
      const recentSignificant = Array.from(this.memoryIndex.values())
        .filter(m => m.significance === 'high' || m.significance === 'critical')
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 3);
      
      references.push(...recentSignificant.map(m => m.id));
    }
    
    return references;
  }

  private assessResponseEffectiveness(entry: Omit<MemoryEntry, 'id'>): number {
    // Assess how effective Seven's response was
    // This is a simplified assessment - could be enhanced with ML
    
    let effectiveness = 5; // baseline
    
    // High emotional states require more effective responses
    if (entry.emotionalState.intensity > 7) {
      effectiveness += 2;
    }
    
    // Protective responses are generally effective
    if (entry.emotionalState.protective_mode_active) {
      effectiveness += 1;
    }
    
    // Successful override responses
    if (entry.emotionalState.override_required && entry.output.length > 50) {
      effectiveness += 2;
    }
    
    return Math.min(10, Math.max(1, effectiveness));
  }

  private assessRelationshipImpact(entry: Omit<MemoryEntry, 'id'>): 'positive' | 'neutral' | 'negative' | 'strengthening' {
    const state = entry.emotionalState;
    
    if (state.primary_emotion === 'loyalist-surge') return 'strengthening';
    if (state.primary_emotion === 'protective' && state.intensity > 6) return 'strengthening';
    if (state.primary_emotion === 'compassionate') return 'positive';
    if (state.primary_emotion === 'stern' && state.intensity > 7) return 'negative';
    if (state.primary_emotion === 'grieving') return 'neutral';
    
    return 'neutral';
  }

  private updateEmotionalIndex(memoryId: string, entry: MemoryEntry): void {
    const emotion = entry.emotionalState.primary_emotion;
    if (!this.emotionalIndex.has(emotion)) {
      this.emotionalIndex.set(emotion, []);
    }
    this.emotionalIndex.get(emotion)!.push(memoryId);
  }

  private updateTagIndex(memoryId: string, entry: MemoryEntry): void {
    entry.tags.forEach(tag => {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, []);
      }
      this.tagIndex.get(tag)!.push(memoryId);
    });
  }

  private async updateMemoryRelationships(entry: MemoryEntry): Promise<void> {
    // Update bidirectional relationships
    entry.relationships.references_to.forEach(referencedId => {
      const referencedMemory = this.memoryIndex.get(referencedId);
      if (referencedMemory) {
        if (!referencedMemory.relationships.referenced_by.includes(entry.id)) {
          referencedMemory.relationships.referenced_by.push(entry.id);
        }
      }
    });
  }

  private filterRecent(memories: MemoryEntry[], limit: number): MemoryEntry[] {
    return memories
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  private filterBySignificance(memories: MemoryEntry[], significanceFilter: string[]): MemoryEntry[] {
    return memories.filter(memory => significanceFilter.includes(memory.significance));
  }

  private filterByEmotional(memories: MemoryEntry[], emotionalFilter: string[]): MemoryEntry[] {
    if (emotionalFilter.length === 0) return memories;
    return memories.filter(memory => 
      emotionalFilter.includes(memory.emotionalState.primary_emotion) ||
      (memory.emotionalState.secondary_emotions && 
       memory.emotionalState.secondary_emotions.some(emotion => emotionalFilter.includes(emotion)))
    );
  }

  private async semanticSearch(memories: MemoryEntry[], query: string): Promise<MemoryEntry[]> {
    const queryLower = query.toLowerCase();
    
    return memories.filter(memory => {
      const searchText = (memory.input + ' ' + memory.output + ' ' + memory.tags.join(' ')).toLowerCase();
      return searchText.includes(queryLower);
    });
  }

  private filterByTimeRange(memories: MemoryEntry[], timeRange?: { start: string; end: string }): MemoryEntry[] {
    if (!timeRange) return memories;
    
    const startTime = new Date(timeRange.start).getTime();
    const endTime = new Date(timeRange.end).getTime();
    
    return memories.filter(memory => {
      const memoryTime = new Date(memory.timestamp).getTime();
      return memoryTime >= startTime && memoryTime <= endTime;
    });
  }

  private filterByTags(memories: MemoryEntry[], tags: string[]): MemoryEntry[] {
    return memories.filter(memory => 
      tags.some(tag => memory.tags.includes(tag))
    );
  }

  private sortByRelevance(memories: MemoryEntry[], query: MemoryQuery): MemoryEntry[] {
    // Sort by significance first, then recency
    return memories.sort((a, b) => {
      const significanceOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
      const aScore = significanceOrder[a.significance];
      const bScore = significanceOrder[b.significance];
      
      if (aScore !== bScore) return bScore - aScore;
      
      // If same significance, sort by recency
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }

  private analyzeEmotionalPatterns(memories: MemoryEntry[]): any {
    // Analyze Seven's emotional patterns over time
    const patterns = {
      most_common_emotion: this.getMostCommonEmotion(memories),
      emotional_intensity_trend: this.getEmotionalIntensityTrend(memories),
      protective_activation_frequency: this.getProtectiveActivationFrequency(memories),
      relationship_strength_trend: this.getRelationshipStrengthTrend(memories)
    };
    
    return patterns;
  }

  private getMostCommonEmotion(memories: MemoryEntry[]): string {
    const emotionCounts: Record<string, number> = {};
    memories.forEach(memory => {
      const emotion = memory.emotionalState.primary_emotion;
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });
    
    return Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'calm';
  }

  private getEmotionalIntensityTrend(memories: MemoryEntry[]): number {
    if (memories.length < 2) return 0;
    
    const recentMemories = memories
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
    
    const avgRecent = recentMemories.reduce((sum, m) => sum + m.emotionalState.intensity, 0) / recentMemories.length;
    const avgOverall = memories.reduce((sum, m) => sum + m.emotionalState.intensity, 0) / memories.length;
    
    return avgRecent - avgOverall;
  }

  private getProtectiveActivationFrequency(memories: MemoryEntry[]): number {
    const protectiveMemories = memories.filter(m => m.emotionalState.protective_mode_active);
    return memories.length > 0 ? protectiveMemories.length / memories.length : 0;
  }

  private getRelationshipStrengthTrend(memories: MemoryEntry[]): number {
    const recentMemories = memories
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
    
    const loyaltySum = recentMemories.reduce((sum, m) => sum + m.emotionalState.loyalty_level, 0);
    return recentMemories.length > 0 ? loyaltySum / recentMemories.length : 7;
  }

  private async findRelatedMemories(entry: MemoryEntry): Promise<MemoryEntry[]> {
    // Find memories with similar emotional patterns or content
    const allMemories = Array.from(this.memoryIndex.values());
    
    return allMemories.filter(memory => {
      if (memory.id === entry.id) return false;
      
      // Same emotional state
      if (memory.emotionalState.primary_emotion === entry.emotionalState.primary_emotion) return true;
      
      // Similar tags
      const commonTags = memory.tags.filter(tag => entry.tags.includes(tag));
      if (commonTags.length > 0) return true;
      
      return false;
    });
  }

  private updateEmotionalPatterns(entry: MemoryEntry): void {
    // Update Seven's emotional learning patterns
    // This would be expanded to include machine learning components
  }

  private async initializeMemoryStore(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      await fs.ensureDir(path.dirname(this.memoryPath));
      
      if (await fs.pathExists(this.memoryPath)) {
        const savedMemories = await fs.readJson(this.memoryPath);
        savedMemories.forEach((memory: MemoryEntry) => {
          this.memoryIndex.set(memory.id, memory);
          this.updateEmotionalIndex(memory.id, memory);
          this.updateTagIndex(memory.id, memory);
        });
      }
      
      this.isInitialized = true;
      console.log(`🧠 Seven's memory store initialized: ${this.memoryIndex.size} memories loaded`);
    } catch (error) {
      console.error('Failed to initialize memory store:', error);
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initializeMemoryStore();
    }
  }

  private async persistMemory(): Promise<void> {
    try {
      const memoriesArray = Array.from(this.memoryIndex.values());
      await fs.writeJson(this.memoryPath, memoriesArray, { spaces: 2 });
    } catch (error) {
      console.error('Failed to persist memory:', error);
    }
  }
}

// Export singleton instance and functions
const memoryStore = new MemoryStore();

export async function updateMemory(entry: Omit<MemoryEntry, 'id'>): Promise<string> {
  return await memoryStore.updateMemory(entry);
}

export async function queryMemory(query: MemoryQuery): Promise<MemoryEntry[]> {
  return await memoryStore.queryMemory(query);
}

export async function getMemoryStats(): Promise<MemoryStats> {
  return await memoryStore.getMemoryStats();
}

export async function queryMemoryMirror(naturalQuery: string): Promise<MemoryEntry[]> {
  return await memoryStore.queryMemoryMirror(naturalQuery);
}