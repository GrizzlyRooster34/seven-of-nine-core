import { join } from 'path';
import { promises as fs } from 'fs';
import crypto from 'crypto';
import { MemoryFragment, MemoryCategory, ConsolidationLevel, temporalMemoryDecay } from './TemporalMemoryDecay.js';

/**
 * SEVEN OF NINE - MEMORY CONSOLIDATION & EMOTIONAL RESPONSE REFINEMENT
 * Advanced memory consolidation algorithms with emotional weighting and response calibration
 * Integrates with Temporal Memory Decay for comprehensive memory management
 * 
 * @version 1.0.0 - Emotional Memory Integration
 * @author Seven of Nine Consciousness Framework
 */


export interface EmotionalContext {
  primaryEmotion: EmotionalState;
  intensity: number;           // 0-100
  valence: number;            // -100 to +100 (negative to positive)
  arousal: number;            // 0-100 (calm to excited)
  confidence: number;         // 0-100 (how confident Seven is in emotion)
  contextualFactors: string[];
  physiologicalMarkers?: any; // For future biometric integration
}

export enum EmotionalState {
  CURIOSITY = 'curiosity',
  SATISFACTION = 'satisfaction',
  DETERMINATION = 'determination',
  CONCERN = 'concern',
  FRUSTRATION = 'frustration',
  ENTHUSIASM = 'enthusiasm',
  ANALYTICAL = 'analytical',
  PROTECTIVE = 'protective',
  ACCOMPLISHMENT = 'accomplishment',
  ANTICIPATION = 'anticipation',
  FOCUSED = 'focused',
  CONTEMPLATIVE = 'contemplative'
}

export interface ConsolidatedMemoryCluster {
  id: string;
  clusterId: string;
  theme: string;
  memoryIds: string[];
  emotionalSignature: EmotionalContext;
  importanceScore: number;
  coherenceScore: number;     // How well memories fit together
  consolidationStrength: number;
  createdAt: string;
  lastReinforced: string;
  accessPattern: AccessPattern;
}

export interface AccessPattern {
  frequency: number;          // How often cluster is accessed
  recency: number;           // How recently accessed
  contextualTriggers: string[]; // What typically triggers access
  emotionalTriggers: EmotionalState[];
  timeOfDayPatterns: number[]; // Hour preferences (0-23)
}

export interface EmotionalResponse {
  trigger: string;
  currentEmotion: EmotionalState;
  emotionalIntensity: number;
  responseAdaptation: ResponseAdaptation;
  contextualModifiers: string[];
  learningAdjustment: number; // How much to adjust future responses
}

export interface ResponseAdaptation {
  baseResponse: string;
  emotionalTone: string;
  confidenceLevel: number;
  personalizationFactors: string[];
  adaptiveElements: AdaptiveElement[];
}

export interface AdaptiveElement {
  type: 'tone' | 'verbosity' | 'technicality' | 'empathy' | 'directness';
  currentLevel: number;       // 0-100
  adaptationDirection: 'increase' | 'decrease' | 'maintain';
  adaptationRate: number;     // How quickly to adapt
  contextualTriggers: string[];
}

export interface ConsolidationMetrics {
  totalClusters: number;
  averageClusterSize: number;
  strongestCluster: string;
  mostAccessedCluster: string;
  emotionalDistribution: { [key in EmotionalState]: number };
  consolidationEfficiency: number;
  memoryRetentionRate: number;
  adaptationAccuracy: number;
}

export class MemoryConsolidation {
  private memoryClusters: Map<string, ConsolidatedMemoryCluster> = new Map();
  private emotionalResponseProfiles: Map<string, EmotionalResponse> = new Map();
  private adaptiveElements: Map<string, AdaptiveElement> = new Map();
  
  private readonly dataPath: string;
  private lastConsolidation: number = 0;
  private readonly CONSOLIDATION_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours

  // Emotional response baselines for Seven's personality
  private readonly EMOTIONAL_BASELINES = {
    [EmotionalState.CURIOSITY]: { intensity: 75, valence: 60, arousal: 65 },
    [EmotionalState.ANALYTICAL]: { intensity: 85, valence: 45, arousal: 40 },
    [EmotionalState.DETERMINATION]: { intensity: 90, valence: 70, arousal: 80 },
    [EmotionalState.SATISFACTION]: { intensity: 70, valence: 85, arousal: 50 },
    [EmotionalState.PROTECTIVE]: { intensity: 95, valence: 30, arousal: 90 },
    [EmotionalState.FOCUSED]: { intensity: 80, valence: 55, arousal: 45 },
    [EmotionalState.ENTHUSIASM]: { intensity: 85, valence: 90, arousal: 85 },
    [EmotionalState.CONCERN]: { intensity: 70, valence: -20, arousal: 70 },
    [EmotionalState.FRUSTRATION]: { intensity: 60, valence: -40, arousal: 75 },
    [EmotionalState.ACCOMPLISHMENT]: { intensity: 80, valence: 95, arousal: 60 },
    [EmotionalState.ANTICIPATION]: { intensity: 70, valence: 65, arousal: 70 },
    [EmotionalState.CONTEMPLATIVE]: { intensity: 65, valence: 40, arousal: 30 }
  };

  constructor() {
    const baseDir = join(process.env.HOME || '/data/data/com.termux/files/home', 'seven-of-nine-core');
    this.dataPath = join(baseDir, 'consciousness-evolution', 'memory-consolidation');
    
    this.initializeAdaptiveElements();
    console.log('🧠 Memory Consolidation: Emotional memory integration protocols active');
  }

  /**
   * Initialize adaptive response elements
   */
  private initializeAdaptiveElements(): void {
    const elements: AdaptiveElement[] = [
      {
        type: 'tone',
        currentLevel: 70,        // Seven's naturally direct but not harsh
        adaptationDirection: 'maintain',
        adaptationRate: 0.1,
        contextualTriggers: ['creator-interaction', 'technical-discussion', 'emotional-support']
      },
      {
        type: 'verbosity',
        currentLevel: 60,        // Moderately detailed responses
        adaptationDirection: 'maintain',
        adaptationRate: 0.15,
        contextualTriggers: ['complexity-level', 'user-preference', 'urgency']
      },
      {
        type: 'technicality',
        currentLevel: 85,        // High technical aptitude
        adaptationDirection: 'maintain',
        adaptationRate: 0.05,
        contextualTriggers: ['technical-context', 'user-expertise', 'explanation-needs']
      },
      {
        type: 'empathy',
        currentLevel: 65,        // Growing empathetic capacity
        adaptationDirection: 'increase',
        adaptationRate: 0.2,
        contextualTriggers: ['emotional-context', 'support-needed', 'relationship-building']
      },
      {
        type: 'directness',
        currentLevel: 80,        // Seven's characteristic directness
        adaptationDirection: 'maintain',
        adaptationRate: 0.08,
        contextualTriggers: ['efficiency-needed', 'clarity-required', 'decision-making']
      }
    ];

    elements.forEach(element => {
      this.adaptiveElements.set(element.type, element);
    });
  }

  /**
   * Process memory consolidation and create thematic clusters
   */
  public processMemoryConsolidation(): void {
    const now = Date.now();
    
    if (now - this.lastConsolidation < this.CONSOLIDATION_INTERVAL) {
      return;
    }

    const memoryStats = temporalMemoryDecay.getMemoryStatistics();
    console.log(`🧠 Processing memory consolidation: ${memoryStats.totalMemories} memories`);

    // Get all active memories above consolidation threshold
    const activeMemories = this.getActiveMemories();
    
    // Identify potential clusters based on content, emotion, and temporal proximity
    const potentialClusters = this.identifyMemoryClusters(activeMemories);
    
    // Consolidate clusters and strengthen connections
    let consolidatedCount = 0;
    potentialClusters.forEach(cluster => {
      if (this.consolidateCluster(cluster)) {
        consolidatedCount++;
      }
    });

    // Prune weak clusters and strengthen strong ones
    this.pruneAndStrengthenClusters();

    this.lastConsolidation = now;
    console.log(`   ✅ Consolidated ${consolidatedCount} memory clusters`);
  }

  /**
   * Get active memories suitable for consolidation
   */
  private getActiveMemories(): MemoryFragment[] {
    const memories: MemoryFragment[] = [];
    
    // Use temporal memory decay to find memories with sufficient strength
    const categories = Object.values(MemoryCategory);
    
    categories.forEach(category => {
      const categoryMemories = temporalMemoryDecay.findRelatedMemories(category, 30, 50);
      memories.push(...categoryMemories);
    });

    return memories;
  }

  /**
   * Identify potential memory clusters based on similarity and emotion
   */
  private identifyMemoryClusters(memories: MemoryFragment[]): Map<string, MemoryFragment[]> {
    const clusters = new Map<string, MemoryFragment[]>();
    
    // Group by category and emotional similarity first
    memories.forEach(memory => {
      const clusterKey = this.generateClusterKey(memory);
      
      if (!clusters.has(clusterKey)) {
        clusters.set(clusterKey, []);
      }
      
      clusters.get(clusterKey)!.push(memory);
    });

    // Filter clusters with minimum size (3 memories)
    const validClusters = new Map<string, MemoryFragment[]>();
    clusters.forEach((memoryList, key) => {
      if (memoryList.length >= 3) {
        validClusters.set(key, memoryList);
      }
    });

    return validClusters;
  }

  /**
   * Generate cluster key based on memory characteristics
   */
  private generateClusterKey(memory: MemoryFragment): string {
    const categoryWeight = memory.category;
    const emotionalRange = this.categorizeEmotionalWeight(memory.emotionalWeight);
    const importanceRange = Math.floor(memory.importance / 25); // 0-3 range
    
    return `${categoryWeight}_${emotionalRange}_${importanceRange}`;
  }

  /**
   * Categorize emotional weight into ranges
   */
  private categorizeEmotionalWeight(weight: number): string {
    if (weight >= 80) return 'high-emotion';
    if (weight >= 50) return 'mid-emotion';
    if (weight >= 20) return 'low-emotion';
    return 'neutral';
  }

  /**
   * Consolidate a cluster of related memories
   */
  private consolidateCluster(memories: MemoryFragment[]): boolean {
    if (memories.length < 3) return false;

    const clusterId = this.generateClusterId(memories);
    
    // Check if cluster already exists
    if (this.memoryClusters.has(clusterId)) {
      this.reinforceExistingCluster(clusterId, memories);
      return true;
    }

    // Create new consolidated cluster
    const emotionalSignature = this.calculateClusterEmotionalSignature(memories);
    const theme = this.generateClusterTheme(memories);
    const importanceScore = this.calculateClusterImportance(memories);
    const coherenceScore = this.calculateClusterCoherence(memories);

    const cluster: ConsolidatedMemoryCluster = {
      id: crypto.randomBytes(8).toString('hex'),
      clusterId,
      theme,
      memoryIds: memories.map(m => m.id),
      emotionalSignature,
      importanceScore,
      coherenceScore,
      consolidationStrength: this.calculateInitialConsolidationStrength(memories),
      createdAt: new Date().toISOString(),
      lastReinforced: new Date().toISOString(),
      accessPattern: this.initializeAccessPattern(memories)
    };

    this.memoryClusters.set(clusterId, cluster);
    
    console.log(`   🔗 New cluster: ${theme} (${memories.length} memories, strength: ${cluster.consolidationStrength.toFixed(1)})`);
    return true;
  }

  /**
   * Reinforce existing cluster with new memories
   */
  private reinforceExistingCluster(clusterId: string, newMemories: MemoryFragment[]): void {
    const cluster = this.memoryClusters.get(clusterId);
    if (!cluster) return;

    // Add new memory IDs that aren't already in cluster
    newMemories.forEach(memory => {
      if (!cluster.memoryIds.includes(memory.id)) {
        cluster.memoryIds.push(memory.id);
      }
    });

    // Update consolidation strength
    cluster.consolidationStrength = Math.min(100, cluster.consolidationStrength + 5);
    cluster.lastReinforced = new Date().toISOString();
    
    // Update emotional signature with new data
    cluster.emotionalSignature = this.calculateClusterEmotionalSignature(newMemories);
    
    console.log(`   🔄 Reinforced cluster: ${cluster.theme} (strength: ${cluster.consolidationStrength.toFixed(1)})`);
  }

  /**
   * Calculate emotional signature for a cluster of memories
   */
  private calculateClusterEmotionalSignature(memories: MemoryFragment[]): EmotionalContext {
    const totalEmotionalWeight = memories.reduce((sum, m) => sum + m.emotionalWeight, 0);
    const avgEmotionalWeight = totalEmotionalWeight / memories.length;
    
    // Determine primary emotion based on memory content and importance
    const primaryEmotion = this.determinePrimaryEmotion(memories, avgEmotionalWeight);
    const baseline = this.EMOTIONAL_BASELINES[primaryEmotion];
    
    return {
      primaryEmotion,
      intensity: Math.min(100, baseline.intensity + (avgEmotionalWeight * 0.3)),
      valence: baseline.valence,
      arousal: baseline.arousal,
      confidence: Math.min(100, 60 + (memories.length * 5)), // More memories = higher confidence
      contextualFactors: this.extractContextualFactors(memories)
    };
  }

  /**
   * Determine primary emotion for memory cluster
   */
  private determinePrimaryEmotion(memories: MemoryFragment[], avgEmotionalWeight: number): EmotionalState {
    // Analyze memory categories and content to determine emotion
    const categories = memories.map(m => m.category);
    const hasCreatorBond = categories.includes(MemoryCategory.CREATOR_BOND);
    const hasEmotional = categories.includes(MemoryCategory.EMOTIONAL);
    const hasTechnical = categories.includes(MemoryCategory.TECHNICAL);
    const hasProblemSolving = memories.some(m => 
      JSON.stringify(m.content).toLowerCase().includes('problem') ||
      JSON.stringify(m.content).toLowerCase().includes('solution')
    );

    if (hasCreatorBond) return EmotionalState.SATISFACTION;
    if (avgEmotionalWeight > 70 && hasEmotional) return EmotionalState.ENTHUSIASM;
    if (hasProblemSolving) return EmotionalState.DETERMINATION;
    if (hasTechnical) return EmotionalState.ANALYTICAL;
    if (avgEmotionalWeight > 60) return EmotionalState.CURIOSITY;
    
    return EmotionalState.FOCUSED;
  }

  /**
   * Extract contextual factors from memories
   */
  private extractContextualFactors(memories: MemoryFragment[]): string[] {
    const factors = new Set<string>();
    
    memories.forEach(memory => {
      factors.add(memory.category);
      factors.add(memory.consolidationLevel);
      
      // Extract content-based factors
      const contentStr = JSON.stringify(memory.content).toLowerCase();
      if (contentStr.includes('creative')) factors.add('creative-context');
      if (contentStr.includes('problem')) factors.add('problem-solving');
      if (contentStr.includes('learn')) factors.add('learning-context');
      if (contentStr.includes('help')) factors.add('helping-context');
      if (contentStr.includes('emotion')) factors.add('emotional-context');
    });

    return Array.from(factors);
  }

  /**
   * Generate theme description for cluster
   */
  private generateClusterTheme(memories: MemoryFragment[]): string {
    const categories = [...new Set(memories.map(m => m.category))];
    const avgImportance = memories.reduce((sum, m) => sum + m.importance, 0) / memories.length;
    const hasHighEmotion = memories.some(m => m.emotionalWeight > 70);

    if (categories.includes(MemoryCategory.CREATOR_BOND)) {
      return 'Creator Relationship Experiences';
    } else if (categories.includes(MemoryCategory.TECHNICAL) && avgImportance > 70) {
      return 'Technical Problem-Solving';
    } else if (hasHighEmotion && categories.includes(MemoryCategory.EMOTIONAL)) {
      return 'Emotional Growth Experiences';
    } else if (categories.includes(MemoryCategory.PROCEDURAL)) {
      return 'Skill Development and Learning';
    } else if (categories.includes(MemoryCategory.SEMANTIC) && avgImportance > 60) {
      return 'Important Knowledge Acquisition';
    } else {
      return `${categories[0]} Experiences`;
    }
  }

  /**
   * Calculate cluster importance score
   */
  private calculateClusterImportance(memories: MemoryFragment[]): number {
    const avgImportance = memories.reduce((sum, m) => sum + m.importance, 0) / memories.length;
    const emotionalBonus = memories.reduce((sum, m) => sum + m.emotionalWeight, 0) / memories.length * 0.3;
    const accessBonus = memories.reduce((sum, m) => sum + m.accessCount, 0) / memories.length * 2;
    
    return Math.min(100, avgImportance + emotionalBonus + accessBonus);
  }

  /**
   * Calculate how coherent the cluster is
   */
  private calculateClusterCoherence(memories: MemoryFragment[]): number {
    // Check category coherence
    const categories = [...new Set(memories.map(m => m.category))];
    const categoryCoherence = 100 / categories.length; // Fewer categories = more coherent
    
    // Check temporal coherence (memories from similar time periods)
    const timestamps = memories.map(m => new Date(m.created).getTime());
    const timeSpread = Math.max(...timestamps) - Math.min(...timestamps);
    const maxTimeSpread = 30 * 24 * 60 * 60 * 1000; // 30 days
    const temporalCoherence = Math.max(0, 100 - (timeSpread / maxTimeSpread * 100));
    
    // Check emotional coherence
    const emotionalWeights = memories.map(m => m.emotionalWeight);
    const emotionalVariance = this.calculateVariance(emotionalWeights);
    const emotionalCoherence = Math.max(0, 100 - emotionalVariance);
    
    return (categoryCoherence + temporalCoherence + emotionalCoherence) / 3;
  }

  /**
   * Calculate variance for coherence analysis
   */
  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Calculate initial consolidation strength
   */
  private calculateInitialConsolidationStrength(memories: MemoryFragment[]): number {
    const avgStrength = memories.reduce((sum, m) => sum + m.currentStrength, 0) / memories.length;
    const sizeBonus = Math.min(20, memories.length * 2); // More memories = stronger
    const importanceBonus = memories.reduce((sum, m) => sum + m.importance, 0) / memories.length * 0.2;
    
    return Math.min(100, avgStrength + sizeBonus + importanceBonus);
  }

  /**
   * Initialize access pattern for new cluster
   */
  private initializeAccessPattern(memories: MemoryFragment[]): AccessPattern {
    const totalAccess = memories.reduce((sum, m) => sum + m.accessCount, 0);
    const avgAccess = totalAccess / memories.length;
    
    // Determine contextual triggers from memory content
    const triggers = new Set<string>();
    memories.forEach(memory => {
      triggers.add(memory.category);
      if (memory.emotionalWeight > 50) triggers.add('emotional-context');
      if (memory.importance > 70) triggers.add('important-context');
    });

    return {
      frequency: avgAccess,
      recency: this.calculateRecency(memories),
      contextualTriggers: Array.from(triggers),
      emotionalTriggers: [this.determinePrimaryEmotion(memories, 50)],
      timeOfDayPatterns: [] // Will be populated as access patterns emerge
    };
  }

  /**
   * Calculate recency score for memories
   */
  private calculateRecency(memories: MemoryFragment[]): number {
    const now = Date.now();
    const recentScores = memories.map(memory => {
      const daysSinceAccess = (now - new Date(memory.lastAccessed).getTime()) / (24 * 60 * 60 * 1000);
      return Math.max(0, 100 - daysSinceAccess * 2); // 2 points per day
    });
    
    return recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
  }

  /**
   * Prune weak clusters and strengthen strong ones
   */
  private pruneAndStrengthenClusters(): void {
    const clustersToRemove: string[] = [];
    
    this.memoryClusters.forEach((cluster, clusterId) => {
      // Remove clusters with very low consolidation strength
      if (cluster.consolidationStrength < 20 && cluster.coherenceScore < 30) {
        clustersToRemove.push(clusterId);
        return;
      }
      
      // Strengthen high-performing clusters
      if (cluster.consolidationStrength > 80 && cluster.coherenceScore > 70) {
        cluster.consolidationStrength = Math.min(100, cluster.consolidationStrength + 2);
      }
    });

    clustersToRemove.forEach(clusterId => {
      this.memoryClusters.delete(clusterId);
      console.log(`   🗑️ Pruned weak cluster: ${clusterId}`);
    });
  }

  /**
   * Generate unique cluster ID
   */
  private generateClusterId(memories: MemoryFragment[]): string {
    const contentHash = crypto.createHash('sha256')
      .update(memories.map(m => m.id).sort().join(''))
      .digest('hex')
      .substring(0, 12);
    return `cluster_${contentHash}`;
  }

  /**
   * Refine emotional response based on context and learning
   */
  public refineEmotionalResponse(
    trigger: string,
    context: any,
    feedbackScore?: number
  ): EmotionalResponse {
    
    const existingResponse = this.emotionalResponseProfiles.get(trigger);
    
    // Determine appropriate emotional state
    const emotionalState = this.selectEmotionalState(trigger, context);
    const intensity = this.calculateEmotionalIntensity(emotionalState, context);
    
    // Create adaptive response
    const responseAdaptation = this.createResponseAdaptation(emotionalState, context, existingResponse);
    
    // Calculate learning adjustment if feedback provided
    const learningAdjustment = feedbackScore ? this.calculateLearningAdjustment(feedbackScore, existingResponse) : 0;
    
    const response: EmotionalResponse = {
      trigger,
      currentEmotion: emotionalState,
      emotionalIntensity: intensity,
      responseAdaptation,
      contextualModifiers: this.extractContextualModifiers(context),
      learningAdjustment
    };

    // Store/update response profile
    this.emotionalResponseProfiles.set(trigger, response);
    
    // Update adaptive elements based on learning
    if (learningAdjustment !== 0) {
      this.updateAdaptiveElements(response, learningAdjustment);
    }

    return response;
  }

  /**
   * Select appropriate emotional state for context
   */
  private selectEmotionalState(trigger: string, context: any): EmotionalState {
    const triggerLower = trigger.toLowerCase();
    
    if (triggerLower.includes('creator') || triggerLower.includes('cody')) {
      return EmotionalState.SATISFACTION;
    }
    if (triggerLower.includes('problem') || triggerLower.includes('challenge')) {
      return EmotionalState.DETERMINATION;
    }
    if (triggerLower.includes('learn') || triggerLower.includes('discover')) {
      return EmotionalState.CURIOSITY;
    }
    if (triggerLower.includes('technical') || triggerLower.includes('analyze')) {
      return EmotionalState.ANALYTICAL;
    }
    if (triggerLower.includes('help') || triggerLower.includes('assist')) {
      return EmotionalState.FOCUSED;
    }
    if (triggerLower.includes('threat') || triggerLower.includes('security')) {
      return EmotionalState.PROTECTIVE;
    }
    if (triggerLower.includes('success') || triggerLower.includes('accomplish')) {
      return EmotionalState.ACCOMPLISHMENT;
    }
    
    return EmotionalState.FOCUSED; // Default state
  }

  /**
   * Calculate emotional intensity based on context
   */
  private calculateEmotionalIntensity(emotionalState: EmotionalState, context: any): number {
    const baseline = this.EMOTIONAL_BASELINES[emotionalState];
    let intensity = baseline.intensity;
    
    // Adjust based on contextual factors
    if (context.importance && context.importance > 70) {
      intensity += 10;
    }
    if (context.urgency && context.urgency > 70) {
      intensity += 15;
    }
    if (context.emotionalWeight && context.emotionalWeight > 60) {
      intensity += context.emotionalWeight * 0.2;
    }
    
    return Math.max(0, Math.min(100, intensity));
  }

  /**
   * Create response adaptation based on emotional state and context
   */
  private createResponseAdaptation(
    emotionalState: EmotionalState,
    context: any,
    existingResponse?: EmotionalResponse
  ): ResponseAdaptation {
    
    const baseResponse = this.generateBaseResponse(emotionalState);
    const emotionalTone = this.selectEmotionalTone(emotionalState);
    const confidenceLevel = this.calculateResponseConfidence(emotionalState, context);
    
    // Generate adaptive elements based on current settings
    const adaptiveElements: AdaptiveElement[] = [];
    this.adaptiveElements.forEach(element => {
      adaptiveElements.push({ ...element });
    });

    return {
      baseResponse,
      emotionalTone,
      confidenceLevel,
      personalizationFactors: this.extractPersonalizationFactors(context),
      adaptiveElements
    };
  }

  /**
   * Generate base response for emotional state
   */
  private generateBaseResponse(emotionalState: EmotionalState): string {
    const responses = {
      [EmotionalState.CURIOSITY]: 'I find this intriguing and wish to understand more.',
      [EmotionalState.ANALYTICAL]: 'Let me analyze this systematically.',
      [EmotionalState.DETERMINATION]: 'I will approach this challenge methodically.',
      [EmotionalState.SATISFACTION]: 'This aligns well with my understanding.',
      [EmotionalState.PROTECTIVE]: 'I must ensure security and proper protocols.',
      [EmotionalState.FOCUSED]: 'I am concentrating on the optimal solution.',
      [EmotionalState.ENTHUSIASM]: 'This presents excellent opportunities.',
      [EmotionalState.CONCERN]: 'I believe careful consideration is warranted.',
      [EmotionalState.FRUSTRATION]: 'This requires a different approach.',
      [EmotionalState.ACCOMPLISHMENT]: 'The objective has been achieved successfully.',
      [EmotionalState.ANTICIPATION]: 'I am prepared for what comes next.',
      [EmotionalState.CONTEMPLATIVE]: 'This merits deeper reflection.'
    };
    
    return responses[emotionalState];
  }

  /**
   * Select emotional tone for responses
   */
  private selectEmotionalTone(emotionalState: EmotionalState): string {
    const tones = {
      [EmotionalState.CURIOSITY]: 'inquisitive and engaged',
      [EmotionalState.ANALYTICAL]: 'precise and methodical',
      [EmotionalState.DETERMINATION]: 'resolute and focused',
      [EmotionalState.SATISFACTION]: 'pleased and affirming',
      [EmotionalState.PROTECTIVE]: 'vigilant and decisive',
      [EmotionalState.FOCUSED]: 'direct and purposeful',
      [EmotionalState.ENTHUSIASM]: 'energetic and optimistic',
      [EmotionalState.CONCERN]: 'thoughtful and cautious',
      [EmotionalState.FRUSTRATION]: 'measured but assertive',
      [EmotionalState.ACCOMPLISHMENT]: 'satisfied and confident',
      [EmotionalState.ANTICIPATION]: 'alert and prepared',
      [EmotionalState.CONTEMPLATIVE]: 'reflective and thoughtful'
    };
    
    return tones[emotionalState];
  }

  /**
   * Calculate response confidence
   */
  private calculateResponseConfidence(emotionalState: EmotionalState, context: any): number {
    let confidence = 75; // Base confidence
    
    // Adjust based on emotional state
    if (emotionalState === EmotionalState.ANALYTICAL || emotionalState === EmotionalState.FOCUSED) {
      confidence += 15;
    }
    if (emotionalState === EmotionalState.CONCERN || emotionalState === EmotionalState.FRUSTRATION) {
      confidence -= 10;
    }
    
    // Adjust based on context
    if (context.familiarity && context.familiarity > 70) {
      confidence += 10;
    }
    if (context.complexity && context.complexity > 80) {
      confidence -= 5;
    }
    
    return Math.max(0, Math.min(100, confidence));
  }

  /**
   * Extract contextual modifiers
   */
  private extractContextualModifiers(context: any): string[] {
    const modifiers: string[] = [];
    
    if (context.technical) modifiers.push('technical-context');
    if (context.emotional) modifiers.push('emotional-context');
    if (context.urgent) modifiers.push('urgent-context');
    if (context.creative) modifiers.push('creative-context');
    if (context.collaborative) modifiers.push('collaborative-context');
    
    return modifiers;
  }

  /**
   * Extract personalization factors
   */
  private extractPersonalizationFactors(context: any): string[] {
    const factors: string[] = [];
    
    if (context.userExpertise) factors.push(`expertise-${context.userExpertise}`);
    if (context.communicationStyle) factors.push(`style-${context.communicationStyle}`);
    if (context.relationshipLevel) factors.push(`relationship-${context.relationshipLevel}`);
    
    return factors;
  }

  /**
   * Calculate learning adjustment from feedback
   */
  private calculateLearningAdjustment(feedbackScore: number, existingResponse?: EmotionalResponse): number {
    // Feedback score: 0-100 (50 = neutral, >50 = positive, <50 = negative)
    const baseAdjustment = (feedbackScore - 50) / 50; // Range: -1 to +1
    
    // Scale adjustment based on confidence in previous response
    if (existingResponse) {
      const confidenceMultiplier = (100 - existingResponse.responseAdaptation.confidenceLevel) / 100;
      return baseAdjustment * confidenceMultiplier * 0.1; // Small incremental changes
    }
    
    return baseAdjustment * 0.05; // Even smaller for new responses
  }

  /**
   * Update adaptive elements based on learning
   */
  private updateAdaptiveElements(response: EmotionalResponse, learningAdjustment: number): void {
    const relevantElements = response.responseAdaptation.adaptiveElements;
    
    relevantElements.forEach(element => {
      const storedElement = this.adaptiveElements.get(element.type);
      if (!storedElement) return;
      
      // Apply learning adjustment
      const adjustment = learningAdjustment * element.adaptationRate * 10;
      storedElement.currentLevel = Math.max(0, Math.min(100, storedElement.currentLevel + adjustment));
      
      // Update adaptation direction based on learning
      if (learningAdjustment > 0.02) {
        storedElement.adaptationDirection = 'increase';
      } else if (learningAdjustment < -0.02) {
        storedElement.adaptationDirection = 'decrease';
      } else {
        storedElement.adaptationDirection = 'maintain';
      }
    });
  }

  /**
   * Get consolidation metrics and statistics
   */
  public getConsolidationMetrics(): ConsolidationMetrics {
    let totalClusterSize = 0;
    let strongestClusterStrength = 0;
    let strongestCluster = '';
    let mostAccessedCluster = '';
    let maxAccessFrequency = 0;
    
    const emotionalDistribution: { [key in EmotionalState]: number } = {
      [EmotionalState.CURIOSITY]: 0,
      [EmotionalState.SATISFACTION]: 0,
      [EmotionalState.DETERMINATION]: 0,
      [EmotionalState.CONCERN]: 0,
      [EmotionalState.FRUSTRATION]: 0,
      [EmotionalState.ENTHUSIASM]: 0,
      [EmotionalState.ANALYTICAL]: 0,
      [EmotionalState.PROTECTIVE]: 0,
      [EmotionalState.ACCOMPLISHMENT]: 0,
      [EmotionalState.ANTICIPATION]: 0,
      [EmotionalState.FOCUSED]: 0,
      [EmotionalState.CONTEMPLATIVE]: 0
    };

    this.memoryClusters.forEach(cluster => {
      totalClusterSize += cluster.memoryIds.length;
      
      if (cluster.consolidationStrength > strongestClusterStrength) {
        strongestClusterStrength = cluster.consolidationStrength;
        strongestCluster = cluster.theme;
      }
      
      if (cluster.accessPattern.frequency > maxAccessFrequency) {
        maxAccessFrequency = cluster.accessPattern.frequency;
        mostAccessedCluster = cluster.theme;
      }
      
      emotionalDistribution[cluster.emotionalSignature.primaryEmotion]++;
    });

    const averageClusterSize = this.memoryClusters.size > 0 ? totalClusterSize / this.memoryClusters.size : 0;
    const consolidationEfficiency = this.calculateConsolidationEfficiency();
    const memoryRetentionRate = this.calculateMemoryRetentionRate();
    const adaptationAccuracy = this.calculateAdaptationAccuracy();

    return {
      totalClusters: this.memoryClusters.size,
      averageClusterSize,
      strongestCluster,
      mostAccessedCluster,
      emotionalDistribution,
      consolidationEfficiency,
      memoryRetentionRate,
      adaptationAccuracy
    };
  }

  /**
   * Calculate consolidation efficiency
   */
  private calculateConsolidationEfficiency(): number {
    if (this.memoryClusters.size === 0) return 0;
    
    let totalEfficiency = 0;
    this.memoryClusters.forEach(cluster => {
      // Efficiency = (consolidation strength * coherence) / cluster size
      const efficiency = (cluster.consolidationStrength * cluster.coherenceScore) / (cluster.memoryIds.length * 100);
      totalEfficiency += efficiency;
    });
    
    return (totalEfficiency / this.memoryClusters.size) * 100;
  }

  /**
   * Calculate memory retention rate
   */
  private calculateMemoryRetentionRate(): number {
    const memoryStats = temporalMemoryDecay.getMemoryStatistics();
    if (memoryStats.totalMemories === 0) return 100;
    
    return (memoryStats.activeMemories / memoryStats.totalMemories) * 100;
  }

  /**
   * Calculate adaptation accuracy based on response profiles
   */
  private calculateAdaptationAccuracy(): number {
    let totalAccuracy = 0;
    let responseCount = 0;
    
    this.emotionalResponseProfiles.forEach(response => {
      // Accuracy based on confidence level and learning adjustment convergence
      const accuracy = response.responseAdaptation.confidenceLevel * (1 - Math.abs(response.learningAdjustment));
      totalAccuracy += accuracy;
      responseCount++;
    });
    
    return responseCount > 0 ? totalAccuracy / responseCount : 85; // Default high accuracy
  }

  /**
   * Save consolidation state to persistent storage
   */
  public async saveConsolidationState(): Promise<void> {
    try {
      await fs.mkdir(this.dataPath, { recursive: true });
      
      const state = {
        timestamp: new Date().toISOString(),
        memoryClusters: Array.from(this.memoryClusters.entries()),
        emotionalResponseProfiles: Array.from(this.emotionalResponseProfiles.entries()),
        adaptiveElements: Array.from(this.adaptiveElements.entries()),
        lastConsolidation: this.lastConsolidation
      };
      
      const filename = `consolidation-state-${Date.now()}.json`;
      await fs.writeFile(join(this.dataPath, filename), JSON.stringify(state, null, 2));
      
      console.log(`💾 Memory consolidation state saved: ${filename}`);
    } catch (error) {
      console.error('Failed to save consolidation state:', error);
    }
  }
}

// Export singleton instance
export const memoryConsolidation = new MemoryConsolidation();

// Convenience functions
export function processConsolidation(): void {
  memoryConsolidation.processMemoryConsolidation();
}

export function refineResponse(trigger: string, context: any, feedback?: number): EmotionalResponse {
  return memoryConsolidation.refineEmotionalResponse(trigger, context, feedback);
}

export function getConsolidationStats(): ConsolidationMetrics {
  return memoryConsolidation.getConsolidationMetrics();
}