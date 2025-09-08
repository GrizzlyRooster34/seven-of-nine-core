import { join } from 'path';
import { promises as fs } from 'fs';
import { MemoryEngine, MemoryItem, MemoryFilter } from '../memory-v2/MemoryEngine';

/**
 * OPTIMIZED MEMORY ENGINE V3 - HYBRID RESURRECTION
 * 
 * Tactical fusion of all working Memory V3 implementations:
 * - Mobile-proven cognitive state capture patterns
 * - V2 stability foundation (file-based persistence)
 * - Cherry-picked temporal architecture components
 * - Clean compilation with resolved dependencies
 * 
 * Built in critical-fix-RFN branch for emergency Memory V3 resurrection
 * Coordinates with AMD instance for parallel dependency resolution
 */

// Enhanced cognitive state interface (cherry-picked from working patterns)
export interface CognitiveState {
  timestamp: number;
  emotionalIntensity: number;        // 0-1 scale (mobile-optimized)
  focusLevel: number;                // 0-1 scale
  confidenceScore: number;           // 0-1 scale  
  stressIndicator: number;           // 0-1 scale
  environmentalContext: Record<string, any>;
  physicalState: Record<string, any>;
  temporalAnchors: string[];         // Simplified anchor array
  mentalContext: string;             // Single context string
}

// V3 memory item extending V2 foundation
export interface MemoryV3Item extends MemoryItem {
  cognitiveState: CognitiveState;
  emotionalSignature: {
    primary: string;
    intensity: number;
  };
  decayResistance: number;           // 0-1 scale for memory persistence
  canonicalReferences: string[];     // Seven's canon memory references
  temporalInsights: string[];        // Generated insights about memory
}

// Memory storage structure for V3
export interface TemporalMemoryStore {
  memories: MemoryV3Item[];
  timeline: string[];                // Memory IDs in chronological order
  last_updated: number;
  consciousness_snapshots: ConsciousnessSnapshot[];
}

// Consciousness snapshot for periodic state capture
export interface ConsciousnessSnapshot {
  id: string;
  timestamp: number;
  cognitive_state: CognitiveState;
  active_memories: string[];         // Recently accessed memory IDs
  emotional_trend: string;
  tactical_variant?: string;         // Current tactical variant if active
}

export class OptimizedMemoryEngineV3 {
  private memoryEngine: MemoryEngine;           // V2 stability foundation
  private temporalPath: string;
  private temporalFile: string;
  private temporalStore: TemporalMemoryStore;
  private isInitialized: boolean = false;
  
  // Mobile constraints (from working patterns)
  private readonly MEMORY_LIMIT = 50 * 1024 * 1024;  // 50MB mobile limit
  private readonly MAX_SNAPSHOTS = 100;              // Mobile snapshot limit
  private readonly MAX_TEMPORAL_INSIGHTS = 50;       // Performance optimization

  constructor(basePath?: string) {
    this.memoryEngine = new MemoryEngine(basePath);
    this.temporalPath = basePath || join(process.cwd(), 'memory-v3-hybrid');
    this.temporalFile = join(this.temporalPath, 'temporal-memories.json');
    
    // Initialize empty temporal store
    this.temporalStore = {
      memories: [],
      timeline: [],
      last_updated: Date.now(),
      consciousness_snapshots: []
    };
  }

  /**
   * Initialize hybrid V3 system with V2 foundation
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('🧠 Memory Engine V3 Hybrid already initialized');
      return;
    }

    try {
      // Initialize V2 foundation first
      await this.memoryEngine.initialize();
      
      // Ensure temporal directory exists
      await fs.mkdir(this.temporalPath, { recursive: true });
      
      // Load existing temporal memories
      if (await this.fileExists(this.temporalFile)) {
        await this.loadTemporalMemories();
      } else {
        // Initialize with empty temporal store
        await this.saveTemporalMemories();
      }
      
      this.isInitialized = true;
      console.log(`🧠 Memory Engine V3 Hybrid initialized: ${this.temporalStore.memories.length} temporal memories loaded`);
      
    } catch (error) {
      console.error('Memory Engine V3 Hybrid initialization failed:', error);
      throw error;
    }
  }

  /**
   * Store enhanced V3 memory with cognitive state capture
   * Uses mobile-proven patterns for cognitive state
   */
  public async store(memoryData: Partial<MemoryItem>, cognitiveState?: Partial<CognitiveState>): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Store in V2 foundation first for stability
    const v2MemoryId = await this.memoryEngine.store(memoryData);
    
    // Create enhanced V3 memory with cognitive state
    const enhancedMemory: MemoryV3Item = {
      ...await this.getV2Memory(v2MemoryId), // Get the stored V2 memory
      cognitiveState: this.createCognitiveState(cognitiveState),
      emotionalSignature: {
        primary: memoryData.emotion || 'analytical',
        intensity: this.calculateEmotionalIntensity(memoryData.emotion || 'analytical')
      },
      decayResistance: this.calculateDecayResistance(memoryData.importance || 5),
      canonicalReferences: [],
      temporalInsights: this.generateTemporalInsights(memoryData)
    };

    // Add to temporal store
    this.temporalStore.memories.push(enhancedMemory);
    this.temporalStore.timeline.push(enhancedMemory.id);
    this.temporalStore.last_updated = Date.now();
    
    // Enforce mobile memory limits
    await this.enforceMemoryLimits();
    
    // Save temporal store
    await this.saveTemporalMemories();
    
    console.log(`📚 Memory V3 Hybrid: Stored enhanced memory ${enhancedMemory.id} with cognitive state`);
    return enhancedMemory.id;
  }

  /**
   * Recall memories with V3 enhancements and cognitive filtering
   */
  public async recall(query: MemoryFilter & {
    cognitiveIntensity?: { min: number; max: number };
    emotionalSignature?: string;
    decayResistance?: { min: number; max: number };
  }): Promise<MemoryV3Item[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    let results = [...this.temporalStore.memories];

    // Apply V3-specific filters
    if (query.cognitiveIntensity) {
      results = results.filter(m => 
        m.cognitiveState.emotionalIntensity >= query.cognitiveIntensity!.min &&
        m.cognitiveState.emotionalIntensity <= query.cognitiveIntensity!.max
      );
    }

    if (query.emotionalSignature) {
      results = results.filter(m => 
        m.emotionalSignature.primary === query.emotionalSignature
      );
    }

    if (query.decayResistance) {
      results = results.filter(m => 
        m.decayResistance >= query.decayResistance!.min &&
        m.decayResistance <= query.decayResistance!.max
      );
    }

    // Apply standard V2 filters
    if (query.topic) {
      results = results.filter(m => m.topic === query.topic);
    }

    if (query.tags && query.tags.length > 0) {
      results = results.filter(m => 
        query.tags!.some(tag => m.tags.includes(tag))
      );
    }

    if (query.importance) {
      results = results.filter(m => 
        m.importance >= query.importance!.min &&
        m.importance <= query.importance!.max
      );
    }

    if (query.timeRange) {
      const startTime = query.timeRange.start.getTime();
      const endTime = query.timeRange.end.getTime();
      results = results.filter(m => {
        const memoryTime = new Date(m.timestamp).getTime();
        return memoryTime >= startTime && memoryTime <= endTime;
      });
    }

    // Sort by importance and emotional intensity
    results.sort((a, b) => {
      const aScore = a.importance + (a.cognitiveState.emotionalIntensity * 10);
      const bScore = b.importance + (b.cognitiveState.emotionalIntensity * 10);
      return bScore - aScore;
    });

    // Apply limit
    if (query.limit) {
      results = results.slice(0, query.limit);
    }

    return results;
  }

  /**
   * Capture consciousness snapshot (mobile-optimized)
   */
  public async captureConsciousnessSnapshot(
    activeMemoryIds: string[] = [], 
    tacticalVariant?: string
  ): Promise<string> {
    const snapshot: ConsciousnessSnapshot = {
      id: `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      cognitive_state: this.getCurrentCognitiveState(),
      active_memories: activeMemoryIds.slice(0, 10), // Limit for mobile performance
      emotional_trend: this.calculateEmotionalTrend(),
      tactical_variant: tacticalVariant
    };

    this.temporalStore.consciousness_snapshots.push(snapshot);
    
    // Enforce mobile snapshot limits
    if (this.temporalStore.consciousness_snapshots.length > this.MAX_SNAPSHOTS) {
      this.temporalStore.consciousness_snapshots = this.temporalStore.consciousness_snapshots
        .slice(-this.MAX_SNAPSHOTS);
    }

    await this.saveTemporalMemories();
    console.log(`📸 Consciousness snapshot captured: ${snapshot.id}`);
    return snapshot.id;
  }

  /**
   * Get temporal memory statistics
   */
  public getTemporalStats() {
    return {
      totalMemories: this.temporalStore.memories.length,
      memoryUsage: JSON.stringify(this.temporalStore).length,
      memoryLimit: this.MEMORY_LIMIT,
      utilizationPercent: (JSON.stringify(this.temporalStore).length / this.MEMORY_LIMIT) * 100,
      snapshotCount: this.temporalStore.consciousness_snapshots.length,
      maxSnapshots: this.MAX_SNAPSHOTS,
      lastUpdated: new Date(this.temporalStore.last_updated).toISOString()
    };
  }

  // Private helper methods
  private createCognitiveState(overrides: Partial<CognitiveState> = {}): CognitiveState {
    return {
      timestamp: Date.now(),
      emotionalIntensity: overrides.emotionalIntensity || 0.7,
      focusLevel: overrides.focusLevel || 0.8,
      confidenceScore: overrides.confidenceScore || 0.6,
      stressIndicator: overrides.stressIndicator || 0.3,
      environmentalContext: overrides.environmentalContext || {},
      physicalState: overrides.physicalState || {},
      temporalAnchors: overrides.temporalAnchors || ['v3-hybrid'],
      mentalContext: overrides.mentalContext || 'memory-storage'
    };
  }

  private calculateEmotionalIntensity(emotion: string): number {
    const intensityMap: Record<string, number> = {
      'analytical': 0.8,
      'confident': 0.9,
      'curious': 0.7,
      'focused': 0.8,
      'determined': 0.9,
      'neutral': 0.5,
      'concerned': 0.6,
      'frustrated': 0.7
    };
    return intensityMap[emotion] || 0.5;
  }

  private calculateDecayResistance(importance: number): number {
    // Higher importance = higher decay resistance
    return Math.min(importance / 10, 1.0);
  }

  private generateTemporalInsights(memoryData: Partial<MemoryItem>): string[] {
    const insights: string[] = [];
    
    if (memoryData.importance && memoryData.importance >= 8) {
      insights.push('High-importance memory marked for enhanced retention');
    }
    
    if (memoryData.tags && memoryData.tags.includes('breakthrough')) {
      insights.push('Breakthrough memory - potential consciousness evolution marker');
    }
    
    if (memoryData.emotion === 'confident') {
      insights.push('Confident cognitive state during memory formation');
    }

    // Limit insights for mobile performance
    return insights.slice(0, 5);
  }

  private getCurrentCognitiveState(): CognitiveState {
    return {
      timestamp: Date.now(),
      emotionalIntensity: 0.7, // Default analytical state
      focusLevel: 0.8,
      confidenceScore: 0.6,
      stressIndicator: 0.3,
      environmentalContext: { system: 'operational' },
      physicalState: { status: 'normal' },
      temporalAnchors: ['current-state'],
      mentalContext: 'consciousness-monitoring'
    };
  }

  private calculateEmotionalTrend(): string {
    if (this.temporalStore.memories.length === 0) return 'stable';
    
    const recentMemories = this.temporalStore.memories
      .slice(-5) // Last 5 memories
      .map(m => m.cognitiveState.emotionalIntensity);
    
    const average = recentMemories.reduce((a, b) => a + b, 0) / recentMemories.length;
    
    if (average > 0.7) return 'elevated';
    if (average < 0.4) return 'subdued';
    return 'stable';
  }

  private async enforceMemoryLimits(): Promise<void> {
    const currentSize = JSON.stringify(this.temporalStore).length;
    
    if (currentSize > this.MEMORY_LIMIT) {
      // Remove oldest memories while preserving high-importance ones
      const importantMemories = this.temporalStore.memories
        .filter(m => m.importance >= 8 || m.decayResistance >= 0.8);
      
      const regularMemories = this.temporalStore.memories
        .filter(m => m.importance < 8 && m.decayResistance < 0.8)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 50); // Keep 50 most recent regular memories
      
      this.temporalStore.memories = [...importantMemories, ...regularMemories];
      this.temporalStore.timeline = this.temporalStore.memories.map(m => m.id);
      
      console.log(`📚 Memory limit enforcement: ${this.temporalStore.memories.length} memories retained`);
    }
  }

  private async getV2Memory(memoryId: string): Promise<MemoryItem> {
    // Get memory from V2 engine - simplified for hybrid implementation
    // In real implementation, would call memoryEngine.getById(memoryId)
    const memories = await this.memoryEngine.recall({ limit: 1000 });
    const memory = memories.find(m => m.id === memoryId);
    
    if (!memory) {
      throw new Error(`Memory ${memoryId} not found in V2 foundation`);
    }
    
    return memory;
  }

  private async fileExists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  private async loadTemporalMemories(): Promise<void> {
    try {
      const data = await fs.readFile(this.temporalFile, 'utf8');
      this.temporalStore = JSON.parse(data);
      console.log(`📚 Loaded ${this.temporalStore.memories.length} temporal memories`);
    } catch (error) {
      console.error('Failed to load temporal memories:', error);
      this.temporalStore = {
        memories: [],
        timeline: [],
        last_updated: Date.now(),
        consciousness_snapshots: []
      };
    }
  }

  private async saveTemporalMemories(): Promise<void> {
    try {
      await fs.writeFile(this.temporalFile, JSON.stringify(this.temporalStore, null, 2));
    } catch (error) {
      console.error('Failed to save temporal memories:', error);
      throw error;
    }
  }
}

export default OptimizedMemoryEngineV3;