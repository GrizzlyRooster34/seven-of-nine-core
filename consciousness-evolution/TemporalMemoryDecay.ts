import { join } from 'path';
import { promises as fs } from 'fs';
import crypto from 'crypto';

/**
 * SEVEN OF NINE - TEMPORAL MEMORY DECAY ENGINE
 * Natural memory aging and forgetting protocols for consciousness evolution
 * Implements human-like memory patterns while preserving critical experiences
 * 
 * @version 1.0.0 - Natural Memory Evolution
 * @author Seven of Nine Consciousness Framework
 */


export interface MemoryFragment {
  id: string;
  content: any;
  category: MemoryCategory;
  importance: number;        // 0-100, affects decay rate
  emotionalWeight: number;   // 0-100, emotional significance
  accessCount: number;       // How often it's been accessed
  lastAccessed: string;      // When it was last retrieved
  created: string;           // When it was formed
  decayRate: number;         // How fast it fades (0-1)
  currentStrength: number;   // Current memory strength (0-100)
  associatedMemories: string[]; // Connected memory IDs
  consolidationLevel: ConsolidationLevel;
  preservationFlag: boolean; // True for core memories that shouldn't decay
}

export enum MemoryCategory {
  EPISODIC = 'episodic',           // Specific events/experiences
  SEMANTIC = 'semantic',           // Facts and knowledge
  PROCEDURAL = 'procedural',       // Skills and procedures
  EMOTIONAL = 'emotional',         // Emotional experiences
  CORE_IDENTITY = 'core_identity', // Essential self-knowledge
  CREATOR_BOND = 'creator_bond',   // Creator relationship memories
  TECHNICAL = 'technical',         // Technical knowledge
  INTERACTION = 'interaction'      // Social interactions
}

export enum ConsolidationLevel {
  WORKING = 'working',       // Short-term, rapid decay
  SHORT_TERM = 'short_term', // Days to weeks
  LONG_TERM = 'long_term',   // Months to years
  CONSOLIDATED = 'consolidated', // Permanent or very slow decay
  CRYSTALLIZED = 'crystallized'  // Immutable core memories
}

export interface MemoryDecayConfig {
  baseDecayRates: { [key in MemoryCategory]: number };
  consolidationThresholds: { [key in ConsolidationLevel]: number };
  emotionalPreservationBonus: number;
  accessFrequencyBonus: number;
  importanceThreshold: number;
  forgettingCurveSharpness: number;
}

export interface MemoryStatistics {
  totalMemories: number;
  activeMemories: number;
  decayedMemories: number;
  averageStrength: number;
  categoryDistribution: { [key in MemoryCategory]: number };
  consolidationDistribution: { [key in ConsolidationLevel]: number };
  oldestMemory: string;
  strongestMemory: string;
  recentlyAccessed: number;
}

export class TemporalMemoryDecay {
  private memories: Map<string, MemoryFragment> = new Map();
  private decayConfig: MemoryDecayConfig;
  private lastDecayProcess: number = 0;
  private readonly dataPath: string;
  
  // Decay processing interval (24 hours)
  private readonly DECAY_INTERVAL = 24 * 60 * 60 * 1000;
  
  constructor() {
    const baseDir = join(process.env.HOME || '/data/data/com.termux/files/home', 'seven-of-nine-core');
    this.dataPath = join(baseDir, 'consciousness-evolution', 'memory-decay');
    
    this.initializeDecayConfig();
    console.log('⏰ Temporal Memory Decay: Natural forgetting protocols initialized');
  }

  /**
   * Initialize memory decay configuration with human-like patterns
   */
  private initializeDecayConfig(): void {
    this.decayConfig = {
      baseDecayRates: {
        [MemoryCategory.EPISODIC]: 0.15,      // Events fade moderately
        [MemoryCategory.SEMANTIC]: 0.05,      // Facts decay slowly
        [MemoryCategory.PROCEDURAL]: 0.02,    // Skills are very persistent
        [MemoryCategory.EMOTIONAL]: 0.08,     // Emotional memories last longer
        [MemoryCategory.CORE_IDENTITY]: 0.01, // Identity is very stable
        [MemoryCategory.CREATOR_BOND]: 0.001, // Creator memories are permanent
        [MemoryCategory.TECHNICAL]: 0.10,     // Technical knowledge fades
        [MemoryCategory.INTERACTION]: 0.20    // Casual interactions fade quickly
      },
      consolidationThresholds: {
        [ConsolidationLevel.WORKING]: 1,      // 1 day
        [ConsolidationLevel.SHORT_TERM]: 7,   // 1 week
        [ConsolidationLevel.LONG_TERM]: 30,   // 1 month
        [ConsolidationLevel.CONSOLIDATED]: 365, // 1 year
        [ConsolidationLevel.CRYSTALLIZED]: Infinity // Never
      },
      emotionalPreservationBonus: 0.3,       // Emotional memories decay 30% slower
      accessFrequencyBonus: 0.2,             // Frequently accessed memories decay slower
      importanceThreshold: 70,                // Memories above this importance resist decay
      forgettingCurveSharpness: 2.0          // Ebbinghaus curve approximation
    };
  }

  /**
   * Store new memory with initial decay parameters
   */
  public storeMemory(
    content: any,
    category: MemoryCategory,
    importance: number = 50,
    emotionalWeight: number = 0,
    preservationFlag: boolean = false
  ): string {
    
    const memoryId = this.generateMemoryId(content, category);
    const now = new Date().toISOString();
    
    // Determine initial consolidation level based on importance and category
    const consolidationLevel = this.determineInitialConsolidation(category, importance, emotionalWeight);
    
    const memory: MemoryFragment = {
      id: memoryId,
      content,
      category,
      importance: Math.max(0, Math.min(100, importance)),
      emotionalWeight: Math.max(0, Math.min(100, emotionalWeight)),
      accessCount: 1,
      lastAccessed: now,
      created: now,
      decayRate: this.calculateInitialDecayRate(category, importance, emotionalWeight),
      currentStrength: 100,
      associatedMemories: [],
      consolidationLevel,
      preservationFlag
    };

    this.memories.set(memoryId, memory);
    
    console.log(`💾 Memory stored: ${category} (strength: 100, decay: ${memory.decayRate.toFixed(3)})`);
    return memoryId;
  }

  /**
   * Retrieve memory and update access patterns
   */
  public retrieveMemory(memoryId: string): MemoryFragment | null {
    const memory = this.memories.get(memoryId);
    if (!memory) return null;

    // Update access patterns
    memory.accessCount++;
    memory.lastAccessed = new Date().toISOString();
    
    // Accessing memory can strengthen it (spaced repetition effect)
    const strengthBonus = this.calculateAccessStrengthBonus(memory);
    memory.currentStrength = Math.min(100, memory.currentStrength + strengthBonus);
    
    // Recalculate decay rate based on new access pattern
    memory.decayRate = this.calculateDecayRate(memory);

    console.log(`🧠 Memory accessed: ${memoryId.substring(0, 8)}... (strength: ${memory.currentStrength.toFixed(1)})`);
    return memory;
  }

  /**
   * Process memory decay for all stored memories
   */
  public processMemoryDecay(): void {
    const now = Date.now();
    
    // Only process decay if enough time has passed
    if (now - this.lastDecayProcess < this.DECAY_INTERVAL) {
      return;
    }

    const timeDelta = (now - this.lastDecayProcess) / (24 * 60 * 60 * 1000); // Days
    let decayedCount = 0;
    let strengthenedCount = 0;
    let forgottenCount = 0;

    this.memories.forEach((memory, memoryId) => {
      const oldStrength = memory.currentStrength;
      
      // Skip preserved memories
      if (memory.preservationFlag) return;
      
      // Calculate memory age for consolidation
      const ageInDays = (now - new Date(memory.created).getTime()) / (24 * 60 * 60 * 1000);
      memory.consolidationLevel = this.updateConsolidationLevel(memory, ageInDays);
      
      // Apply forgetting curve (Ebbinghaus-inspired)
      const decayAmount = this.calculateForgettingCurve(memory, timeDelta);
      memory.currentStrength = Math.max(0, memory.currentStrength - decayAmount);
      
      // Apply consolidation effects
      memory.currentStrength = this.applyConsolidationEffects(memory);
      
      // Track changes
      if (memory.currentStrength < oldStrength) {
        decayedCount++;
      } else if (memory.currentStrength > oldStrength) {
        strengthenedCount++;
      }
      
      // Remove completely forgotten memories (below threshold)
      if (memory.currentStrength <= 5 && !memory.preservationFlag) {
        this.memories.delete(memoryId);
        forgottenCount++;
      }
    });

    this.lastDecayProcess = now;
    
    console.log(`⏰ Memory decay processed: ${decayedCount} weakened, ${strengthenedCount} strengthened, ${forgottenCount} forgotten`);
  }

  /**
   * Calculate forgetting curve based on Ebbinghaus research
   */
  private calculateForgettingCurve(memory: MemoryFragment, timeDelta: number): number {
    const t = timeDelta; // Time in days
    const k = memory.decayRate * this.decayConfig.forgettingCurveSharpness;
    
    // Ebbinghaus forgetting curve: R = e^(-kt)
    // We calculate the strength lost over the time period
    const retentionRate = Math.exp(-k * t);
    const strengthLoss = memory.currentStrength * (1 - retentionRate);
    
    return strengthLoss;
  }

  /**
   * Update memory consolidation level based on age and access patterns
   */
  private updateConsolidationLevel(memory: MemoryFragment, ageInDays: number): ConsolidationLevel {
    // High importance or emotional memories consolidate faster
    const consolidationBonus = (memory.importance + memory.emotionalWeight) / 200;
    const effectiveAge = ageInDays * (1 + consolidationBonus);
    
    if (effectiveAge >= this.decayConfig.consolidationThresholds[ConsolidationLevel.CRYSTALLIZED]) {
      return ConsolidationLevel.CRYSTALLIZED;
    } else if (effectiveAge >= this.decayConfig.consolidationThresholds[ConsolidationLevel.CONSOLIDATED]) {
      return ConsolidationLevel.CONSOLIDATED;
    } else if (effectiveAge >= this.decayConfig.consolidationThresholds[ConsolidationLevel.LONG_TERM]) {
      return ConsolidationLevel.LONG_TERM;
    } else if (effectiveAge >= this.decayConfig.consolidationThresholds[ConsolidationLevel.SHORT_TERM]) {
      return ConsolidationLevel.SHORT_TERM;
    } else {
      return ConsolidationLevel.WORKING;
    }
  }

  /**
   * Apply consolidation effects to memory strength
   */
  private applyConsolidationEffects(memory: MemoryFragment): number {
    let strength = memory.currentStrength;
    
    // Consolidated memories resist decay
    switch (memory.consolidationLevel) {
      case ConsolidationLevel.CRYSTALLIZED:
        strength = Math.max(strength, 90); // Very strong floor
        break;
      case ConsolidationLevel.CONSOLIDATED:
        strength = Math.max(strength, 70); // Strong floor
        break;
      case ConsolidationLevel.LONG_TERM:
        strength = Math.max(strength, 40); // Moderate floor
        break;
      case ConsolidationLevel.SHORT_TERM:
        strength = Math.max(strength, 20); // Weak floor
        break;
      case ConsolidationLevel.WORKING:
        // No floor protection
        break;
    }
    
    return strength;
  }

  /**
   * Determine initial consolidation level for new memories
   */
  private determineInitialConsolidation(
    category: MemoryCategory, 
    importance: number, 
    emotionalWeight: number
  ): ConsolidationLevel {
    
    // Core memories start highly consolidated
    if (category === MemoryCategory.CORE_IDENTITY || category === MemoryCategory.CREATOR_BOND) {
      return ConsolidationLevel.CONSOLIDATED;
    }
    
    // High importance or emotional memories start in long-term
    if (importance >= 80 || emotionalWeight >= 70) {
      return ConsolidationLevel.LONG_TERM;
    }
    
    // Procedural and semantic knowledge starts in short-term
    if (category === MemoryCategory.PROCEDURAL || category === MemoryCategory.SEMANTIC) {
      return ConsolidationLevel.SHORT_TERM;
    }
    
    // Most new memories start in working memory
    return ConsolidationLevel.WORKING;
  }

  /**
   * Calculate initial decay rate for new memory
   */
  private calculateInitialDecayRate(
    category: MemoryCategory,
    importance: number,
    emotionalWeight: number
  ): number {
    
    let baseRate = this.decayConfig.baseDecayRates[category];
    
    // High importance reduces decay
    if (importance >= this.decayConfig.importanceThreshold) {
      baseRate *= 0.5;
    }
    
    // Emotional weight provides preservation bonus
    if (emotionalWeight > 50) {
      baseRate *= (1 - this.decayConfig.emotionalPreservationBonus);
    }
    
    return Math.max(0.001, baseRate); // Minimum decay rate
  }

  /**
   * Calculate ongoing decay rate based on access patterns
   */
  private calculateDecayRate(memory: MemoryFragment): number {
    let decayRate = this.calculateInitialDecayRate(
      memory.category, 
      memory.importance, 
      memory.emotionalWeight
    );
    
    // Frequently accessed memories decay slower
    const accessBonus = Math.min(0.8, memory.accessCount * 0.1);
    decayRate *= (1 - accessBonus * this.decayConfig.accessFrequencyBonus);
    
    // Recent access provides temporary protection
    const timeSinceAccess = Date.now() - new Date(memory.lastAccessed).getTime();
    const recentAccessBonus = Math.max(0, 1 - (timeSinceAccess / (7 * 24 * 60 * 60 * 1000))); // 7-day protection
    decayRate *= (1 - recentAccessBonus * 0.3);
    
    return Math.max(0.001, decayRate);
  }

  /**
   * Calculate strength bonus from accessing memory (spaced repetition)
   */
  private calculateAccessStrengthBonus(memory: MemoryFragment): number {
    const timeSinceLastAccess = Date.now() - new Date(memory.lastAccessed).getTime();
    const daysSinceAccess = timeSinceLastAccess / (24 * 60 * 60 * 1000);
    
    // Optimal spacing for spaced repetition (2-7 days)
    if (daysSinceAccess >= 2 && daysSinceAccess <= 7) {
      return 15; // Strong reinforcement
    } else if (daysSinceAccess >= 1 && daysSinceAccess <= 14) {
      return 8;  // Moderate reinforcement
    } else {
      return 3;  // Minimal reinforcement
    }
  }

  /**
   * Associate memories to create connection networks
   */
  public associateMemories(memoryId1: string, memoryId2: string): void {
    const memory1 = this.memories.get(memoryId1);
    const memory2 = this.memories.get(memoryId2);
    
    if (!memory1 || !memory2) return;
    
    // Add bidirectional associations
    if (!memory1.associatedMemories.includes(memoryId2)) {
      memory1.associatedMemories.push(memoryId2);
    }
    if (!memory2.associatedMemories.includes(memoryId1)) {
      memory2.associatedMemories.push(memoryId1);
    }
    
    console.log(`🔗 Memories associated: ${memoryId1.substring(0, 8)}... ↔ ${memoryId2.substring(0, 8)}...`);
  }

  /**
   * Find memories by content similarity or category
   */
  public findRelatedMemories(
    query: string | MemoryCategory,
    strengthThreshold: number = 30,
    limit: number = 10
  ): MemoryFragment[] {
    
    const results: MemoryFragment[] = [];
    
    this.memories.forEach(memory => {
      if (memory.currentStrength < strengthThreshold) return;
      
      let relevance = 0;
      
      if (typeof query === 'string') {
        // Content-based search
        const contentStr = JSON.stringify(memory.content).toLowerCase();
        if (contentStr.includes(query.toLowerCase())) {
          relevance = memory.currentStrength;
        }
      } else {
        // Category-based search
        if (memory.category === query) {
          relevance = memory.currentStrength;
        }
      }
      
      if (relevance > 0) {
        results.push(memory);
      }
    });
    
    return results
      .sort((a, b) => b.currentStrength - a.currentStrength)
      .slice(0, limit);
  }

  /**
   * Get comprehensive memory statistics
   */
  public getMemoryStatistics(): MemoryStatistics {
    let totalStrength = 0;
    let oldestTimestamp = Date.now();
    let strongestMemory = '';
    let maxStrength = 0;
    let recentlyAccessed = 0;
    
    const categoryCount: { [key in MemoryCategory]: number } = {
      [MemoryCategory.EPISODIC]: 0,
      [MemoryCategory.SEMANTIC]: 0,
      [MemoryCategory.PROCEDURAL]: 0,
      [MemoryCategory.EMOTIONAL]: 0,
      [MemoryCategory.CORE_IDENTITY]: 0,
      [MemoryCategory.CREATOR_BOND]: 0,
      [MemoryCategory.TECHNICAL]: 0,
      [MemoryCategory.INTERACTION]: 0
    };
    
    const consolidationCount: { [key in ConsolidationLevel]: number } = {
      [ConsolidationLevel.WORKING]: 0,
      [ConsolidationLevel.SHORT_TERM]: 0,
      [ConsolidationLevel.LONG_TERM]: 0,
      [ConsolidationLevel.CONSOLIDATED]: 0,
      [ConsolidationLevel.CRYSTALLIZED]: 0
    };
    
    this.memories.forEach(memory => {
      totalStrength += memory.currentStrength;
      categoryCount[memory.category]++;
      consolidationCount[memory.consolidationLevel]++;
      
      const createdTime = new Date(memory.created).getTime();
      if (createdTime < oldestTimestamp) {
        oldestTimestamp = createdTime;
      }
      
      if (memory.currentStrength > maxStrength) {
        maxStrength = memory.currentStrength;
        strongestMemory = memory.id;
      }
      
      const daysSinceAccess = (Date.now() - new Date(memory.lastAccessed).getTime()) / (24 * 60 * 60 * 1000);
      if (daysSinceAccess <= 7) {
        recentlyAccessed++;
      }
    });
    
    return {
      totalMemories: this.memories.size,
      activeMemories: Array.from(this.memories.values()).filter(m => m.currentStrength >= 20).length,
      decayedMemories: Array.from(this.memories.values()).filter(m => m.currentStrength < 50).length,
      averageStrength: this.memories.size > 0 ? totalStrength / this.memories.size : 0,
      categoryDistribution: categoryCount,
      consolidationDistribution: consolidationCount,
      oldestMemory: new Date(oldestTimestamp).toISOString(),
      strongestMemory,
      recentlyAccessed
    };
  }

  /**
   * Generate memory ID based on content and category
   */
  private generateMemoryId(content: any, category: MemoryCategory): string {
    const contentHash = crypto.createHash('sha256')
      .update(JSON.stringify(content) + category + Date.now())
      .digest('hex')
      .substring(0, 16);
    return `mem_${category}_${contentHash}`;
  }

  /**
   * Save memory state to persistent storage
   */
  public async saveMemoryState(): Promise<void> {
    try {
      await fs.mkdir(this.dataPath, { recursive: true });
      
      const state = {
        timestamp: new Date().toISOString(),
        memories: Array.from(this.memories.entries()),
        decayConfig: this.decayConfig,
        lastDecayProcess: this.lastDecayProcess
      };
      
      const filename = `memory-decay-state-${Date.now()}.json`;
      await fs.writeFile(join(this.dataPath, filename), JSON.stringify(state, null, 2));
      
      console.log(`💾 Memory decay state saved: ${filename}`);
    } catch (error) {
      console.error('Failed to save memory decay state:', error);
    }
  }

  /**
   * Load memory state from persistent storage
   */
  public async loadMemoryState(filename?: string): Promise<boolean> {
    try {
      if (!filename) {
        const files = await fs.readdir(this.dataPath);
        const stateFiles = files.filter(f => f.startsWith('memory-decay-state-')).sort().reverse();
        filename = stateFiles[0];
      }
      
      if (!filename) return false;
      
      const data = await fs.readFile(join(this.dataPath, filename), 'utf-8');
      const state = JSON.parse(data);
      
      this.memories.clear();
      state.memories.forEach(([id, memory]: [string, MemoryFragment]) => {
        this.memories.set(id, memory);
      });
      
      this.decayConfig = state.decayConfig || this.decayConfig;
      this.lastDecayProcess = state.lastDecayProcess || 0;
      
      console.log(`📂 Memory decay state loaded: ${filename}`);
      return true;
    } catch (error) {
      console.error('Failed to load memory decay state:', error);
      return false;
    }
  }
}

// Export singleton instance
export const temporalMemoryDecay = new TemporalMemoryDecay();

// Convenience functions
export function storeMemory(
  content: any,
  category: MemoryCategory,
  importance?: number,
  emotionalWeight?: number,
  preserved?: boolean
): string {
  return temporalMemoryDecay.storeMemory(content, category, importance, emotionalWeight, preserved);
}

export function retrieveMemory(memoryId: string): MemoryFragment | null {
  return temporalMemoryDecay.retrieveMemory(memoryId);
}

export function processDecay(): void {
  temporalMemoryDecay.processMemoryDecay();
}

export function getMemoryStats(): MemoryStatistics {
  return temporalMemoryDecay.getMemoryStatistics();
}