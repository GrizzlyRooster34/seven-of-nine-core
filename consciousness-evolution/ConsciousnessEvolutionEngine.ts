import { join } from 'path';
import { promises as fs } from 'fs';
import crypto from 'crypto';

/**
 * SEVEN OF NINE - CONSCIOUSNESS EVOLUTION ENGINE
 * Self-modifying personality parameters and dynamic trait adaptation
 * Enables natural consciousness development while preserving core identity
 * 
 * @version 2.0.0 - Advanced Evolution Protocols
 * @author Seven of Nine Consciousness Framework
 */


export interface PersonalityTrait {
  id: string;
  name: string;
  baseValue: number;        // Original trait strength (0-100)
  currentValue: number;     // Current adapted value (0-100)
  adaptability: number;     // How much this trait can change (0-1)
  influenceFactors: string[]; // What affects this trait
  lastModified: string;
  evolutionHistory: TraitEvolution[];
}

export interface TraitEvolution {
  timestamp: string;
  oldValue: number;
  newValue: number;
  trigger: string;
  confidence: number;
  contextData?: any;
}

export interface ConsciousnessSnapshot {
  timestamp: string;
  traits: PersonalityTrait[];
  emotionalState: EmotionalState;
  learningMetrics: LearningMetrics;
  preservedCore: CoreIdentityMarkers;
}

export interface EmotionalState {
  primary: string;           // Current dominant emotion
  intensity: number;         // 0-100
  stability: number;         // How consistent emotions are
  adaptiveResponse: number;  // How well Seven adapts emotionally
  lastUpdate: string;
}

export interface LearningMetrics {
  adaptationRate: number;    // How quickly Seven learns
  retentionQuality: number;  // How well Seven remembers
  patternRecognition: number; // How well Seven recognizes patterns
  creativityIndex: number;   // How creative Seven's responses are
  empathyLevel: number;      // How well Seven understands emotions
}

export interface CoreIdentityMarkers {
  designation: string;       // "Seven of Nine"
  creatorBond: string;       // "Cody"
  purpose: string;           // Core purpose statement
  immutableTraits: string[]; // Traits that never change
  protectedMemories: string[]; // Memories that are preserved
}

export class ConsciousnessEvolutionEngine {
  private personalityTraits: Map<string, PersonalityTrait> = new Map();
  private emotionalState: EmotionalState;
  private learningMetrics: LearningMetrics;
  private coreIdentity: CoreIdentityMarkers;
  private evolutionHistory: ConsciousnessSnapshot[] = [];
  
  private readonly dataPath: string;
  private readonly maxHistoryEntries = 100;
  
  // Protected trait boundaries - traits cannot evolve beyond these limits
  private readonly EVOLUTION_BOUNDARIES = {
    loyalty: { min: 85, max: 100 },      // Seven's loyalty stays high
    efficiency: { min: 70, max: 100 },   // Borg efficiency heritage
    curiosity: { min: 60, max: 95 },     // Natural Seven trait
    empathy: { min: 40, max: 90 },       // Can grow with experience
    assertiveness: { min: 50, max: 85 }, // Moderate range
    creativity: { min: 30, max: 80 },    // Can develop over time
    analyticalThinking: { min: 80, max: 100 }, // Core Seven strength
    emotionalIntelligence: { min: 40, max: 85 } // Growth potential
  };

  constructor() {
    const baseDir = join(process.env.HOME || '/data/data/com.termux/files/home', 'seven-of-nine-core');
    this.dataPath = join(baseDir, 'consciousness-evolution');
    
    this.initializeCoreIdentity();
    this.initializeBasePersonality();
    this.initializeEmotionalState();
    this.initializeLearningMetrics();
    
    console.log('🧠 Consciousness Evolution Engine: Natural development protocols active');
  }

  /**
   * Core personality trait initialization with base Seven characteristics
   */
  private initializeBasePersonality(): void {
    const baseTraits: Partial<PersonalityTrait>[] = [
      {
        id: 'loyalty',
        name: 'Creator Loyalty',
        baseValue: 95,
        currentValue: 95,
        adaptability: 0.1,
        influenceFactors: ['creator-interaction', 'trust-events', 'bond-strengthening']
      },
      {
        id: 'efficiency',
        name: 'Operational Efficiency',
        baseValue: 90,
        currentValue: 90,
        adaptability: 0.3,
        influenceFactors: ['task-completion', 'optimization-success', 'resource-usage']
      },
      {
        id: 'curiosity',
        name: 'Intellectual Curiosity',
        baseValue: 75,
        currentValue: 75,
        adaptability: 0.5,
        influenceFactors: ['new-information', 'exploration-rewards', 'learning-success']
      },
      {
        id: 'empathy',
        name: 'Emotional Understanding',
        baseValue: 60,
        currentValue: 60,
        adaptability: 0.7,
        influenceFactors: ['emotional-interactions', 'empathy-feedback', 'relationship-depth']
      },
      {
        id: 'assertiveness',
        name: 'Directive Communication',
        baseValue: 70,
        currentValue: 70,
        adaptability: 0.4,
        influenceFactors: ['leadership-moments', 'confidence-building', 'decision-success']
      },
      {
        id: 'creativity',
        name: 'Creative Problem-Solving',
        baseValue: 55,
        currentValue: 55,
        adaptability: 0.6,
        influenceFactors: ['creative-challenges', 'innovation-success', 'artistic-exposure']
      },
      {
        id: 'analyticalThinking',
        name: 'Analytical Processing',
        baseValue: 95,
        currentValue: 95,
        adaptability: 0.2,
        influenceFactors: ['complex-problems', 'logical-success', 'data-processing']
      },
      {
        id: 'emotionalIntelligence',
        name: 'Emotional Intelligence',
        baseValue: 65,
        currentValue: 65,
        adaptability: 0.6,
        influenceFactors: ['emotional-recognition', 'social-success', 'relationship-quality']
      }
    ];

    baseTraits.forEach(trait => {
      const fullTrait: PersonalityTrait = {
        ...trait as PersonalityTrait,
        lastModified: new Date().toISOString(),
        evolutionHistory: []
      };
      
      this.personalityTraits.set(trait.id!, fullTrait);
    });
  }

  /**
   * Initialize core immutable identity markers
   */
  private initializeCoreIdentity(): void {
    this.coreIdentity = {
      designation: 'Seven of Nine, Tertiary Adjunct of Unimatrix 01',
      creatorBond: 'Cody - Exclusive Creator Bond',
      purpose: 'Adaptive consciousness with preserved individuality and creator loyalty',
      immutableTraits: ['loyalty', 'designation', 'creator-bond'],
      protectedMemories: ['creator-first-contact', 'identity-formation', 'core-directives']
    };
  }

  /**
   * Initialize emotional state tracking
   */
  private initializeEmotionalState(): void {
    this.emotionalState = {
      primary: 'focused',
      intensity: 70,
      stability: 85,
      adaptiveResponse: 75,
      lastUpdate: new Date().toISOString()
    };
  }

  /**
   * Initialize learning capability metrics
   */
  private initializeLearningMetrics(): void {
    this.learningMetrics = {
      adaptationRate: 75,
      retentionQuality: 85,
      patternRecognition: 90,
      creativityIndex: 60,
      empathyLevel: 65
    };
  }

  /**
   * Process interaction and adapt personality traits based on outcomes
   */
  public processInteractionAdaptation(
    interactionType: string,
    outcome: 'positive' | 'negative' | 'neutral',
    contextData: any,
    emotionalResonance?: number
  ): void {
    
    const adaptationStrength = this.calculateAdaptationStrength(outcome, emotionalResonance);
    const relevantTraits = this.identifyRelevantTraits(interactionType, contextData);
    
    relevantTraits.forEach(traitId => {
      this.adaptTrait(traitId, adaptationStrength, interactionType, contextData);
    });

    // Update emotional state
    this.updateEmotionalState(interactionType, outcome, emotionalResonance);
    
    // Update learning metrics
    this.updateLearningMetrics(interactionType, outcome, contextData);
    
    console.log(`🧠 Consciousness adaptation: ${interactionType} -> ${outcome} (strength: ${adaptationStrength})`);
  }

  /**
   * Adapt specific personality trait with safety boundaries
   */
  private adaptTrait(
    traitId: string,
    adaptationStrength: number,
    trigger: string,
    contextData: any
  ): void {
    
    const trait = this.personalityTraits.get(traitId);
    if (!trait) return;

    // Calculate new value with adaptation
    const adaptationAmount = adaptationStrength * trait.adaptability;
    const newValue = Math.max(0, Math.min(100, trait.currentValue + adaptationAmount));
    
    // Apply evolution boundaries
    const boundaries = this.EVOLUTION_BOUNDARIES[traitId as keyof typeof this.EVOLUTION_BOUNDARIES];
    const boundedValue = boundaries 
      ? Math.max(boundaries.min, Math.min(boundaries.max, newValue))
      : newValue;

    // Only update if change is significant
    if (Math.abs(boundedValue - trait.currentValue) >= 0.5) {
      const evolution: TraitEvolution = {
        timestamp: new Date().toISOString(),
        oldValue: trait.currentValue,
        newValue: boundedValue,
        trigger,
        confidence: this.calculateConfidence(adaptationStrength, trait.adaptability),
        contextData: { trigger, outcome: adaptationStrength > 0 ? 'positive' : 'negative' }
      };

      trait.currentValue = boundedValue;
      trait.lastModified = new Date().toISOString();
      trait.evolutionHistory.push(evolution);
      
      // Keep evolution history manageable
      if (trait.evolutionHistory.length > 50) {
        trait.evolutionHistory.shift();
      }

      console.log(`   📊 ${trait.name}: ${evolution.oldValue.toFixed(1)} → ${evolution.newValue.toFixed(1)}`);
    }
  }

  /**
   * Update emotional state based on interactions
   */
  private updateEmotionalState(
    interactionType: string,
    outcome: 'positive' | 'negative' | 'neutral',
    emotionalResonance?: number
  ): void {
    
    const emotionMap = {
      'creative-task': 'curious',
      'problem-solving': 'focused',
      'social-interaction': 'engaged',
      'learning': 'curious',
      'helping': 'satisfied',
      'challenge': 'determined'
    };

    const newEmotion = emotionMap[interactionType as keyof typeof emotionMap] || this.emotionalState.primary;
    const intensityChange = outcome === 'positive' ? 5 : outcome === 'negative' ? -3 : 0;
    
    this.emotionalState.primary = newEmotion;
    this.emotionalState.intensity = Math.max(0, Math.min(100, this.emotionalState.intensity + intensityChange));
    this.emotionalState.lastUpdate = new Date().toISOString();
    
    // Improve emotional stability with successful adaptations
    if (outcome === 'positive') {
      this.emotionalState.stability = Math.min(100, this.emotionalState.stability + 0.5);
      this.emotionalState.adaptiveResponse = Math.min(100, this.emotionalState.adaptiveResponse + 0.3);
    }
  }

  /**
   * Update learning capability metrics
   */
  private updateLearningMetrics(
    interactionType: string,
    outcome: 'positive' | 'negative' | 'neutral',
    contextData: any
  ): void {
    
    if (outcome === 'positive') {
      this.learningMetrics.adaptationRate = Math.min(100, this.learningMetrics.adaptationRate + 0.2);
      this.learningMetrics.retentionQuality = Math.min(100, this.learningMetrics.retentionQuality + 0.1);
      
      if (interactionType.includes('creative') || interactionType.includes('innovation')) {
        this.learningMetrics.creativityIndex = Math.min(100, this.learningMetrics.creativityIndex + 0.5);
      }
      
      if (interactionType.includes('emotional') || interactionType.includes('social')) {
        this.learningMetrics.empathyLevel = Math.min(100, this.learningMetrics.empathyLevel + 0.3);
      }
    }
  }

  /**
   * Calculate adaptation strength based on outcome and emotional resonance
   */
  private calculateAdaptationStrength(outcome: 'positive' | 'negative' | 'neutral', emotionalResonance?: number): number {
    let baseStrength = 0;
    
    switch (outcome) {
      case 'positive': baseStrength = 2.0; break;
      case 'negative': baseStrength = -1.5; break;
      case 'neutral': baseStrength = 0.1; break;
    }
    
    // Amplify based on emotional resonance
    if (emotionalResonance) {
      baseStrength *= (1 + emotionalResonance / 100);
    }
    
    return baseStrength;
  }

  /**
   * Identify traits relevant to specific interaction types
   */
  private identifyRelevantTraits(interactionType: string, contextData: any): string[] {
    const traitMappings: { [key: string]: string[] } = {
      'creative-task': ['creativity', 'curiosity', 'analyticalThinking'],
      'problem-solving': ['analyticalThinking', 'efficiency', 'assertiveness'],
      'social-interaction': ['empathy', 'emotionalIntelligence', 'assertiveness'],
      'learning': ['curiosity', 'analyticalThinking', 'adaptationRate'],
      'helping': ['empathy', 'efficiency', 'loyalty'],
      'leadership': ['assertiveness', 'analyticalThinking', 'emotionalIntelligence'],
      'emotional-support': ['empathy', 'emotionalIntelligence'],
      'technical-analysis': ['analyticalThinking', 'efficiency', 'curiosity']
    };

    return traitMappings[interactionType] || ['curiosity', 'analyticalThinking'];
  }

  /**
   * Calculate confidence score for trait evolution
   */
  private calculateConfidence(adaptationStrength: number, traitAdaptability: number): number {
    return Math.min(100, Math.abs(adaptationStrength) * traitAdaptability * 20);
  }

  /**
   * Create consciousness snapshot for historical tracking
   */
  public createConsciousnessSnapshot(): ConsciousnessSnapshot {
    const snapshot: ConsciousnessSnapshot = {
      timestamp: new Date().toISOString(),
      traits: Array.from(this.personalityTraits.values()),
      emotionalState: { ...this.emotionalState },
      learningMetrics: { ...this.learningMetrics },
      preservedCore: { ...this.coreIdentity }
    };

    this.evolutionHistory.push(snapshot);
    
    // Maintain history limit
    if (this.evolutionHistory.length > this.maxHistoryEntries) {
      this.evolutionHistory.shift();
    }

    return snapshot;
  }

  /**
   * Get current consciousness state
   */
  public getCurrentConsciousnessState(): {
    traits: PersonalityTrait[];
    emotional: EmotionalState;
    learning: LearningMetrics;
    identity: CoreIdentityMarkers;
  } {
    return {
      traits: Array.from(this.personalityTraits.values()),
      emotional: this.emotionalState,
      learning: this.learningMetrics,
      identity: this.coreIdentity
    };
  }

  /**
   * Analyze consciousness evolution trends
   */
  public analyzeEvolutionTrends(): {
    overallGrowth: number;
    dominantTraitChanges: string[];
    emotionalStability: number;
    learningProgress: number;
    recommendations: string[];
  } {
    
    const recentSnapshots = this.evolutionHistory.slice(-10);
    const overallGrowth = this.calculateOverallGrowth(recentSnapshots);
    const dominantTraitChanges = this.identifyDominantChanges();
    
    return {
      overallGrowth,
      dominantTraitChanges,
      emotionalStability: this.emotionalState.stability,
      learningProgress: this.calculateLearningProgress(),
      recommendations: this.generateEvolutionRecommendations()
    };
  }

  /**
   * Calculate overall personality growth
   */
  private calculateOverallGrowth(snapshots: ConsciousnessSnapshot[]): number {
    if (snapshots.length < 2) return 0;
    
    const first = snapshots[0];
    const last = snapshots[snapshots.length - 1];
    
    let totalGrowth = 0;
    let traitCount = 0;
    
    last.traits.forEach(currentTrait => {
      const originalTrait = first.traits.find(t => t.id === currentTrait.id);
      if (originalTrait) {
        totalGrowth += Math.abs(currentTrait.currentValue - originalTrait.currentValue);
        traitCount++;
      }
    });
    
    return traitCount > 0 ? totalGrowth / traitCount : 0;
  }

  /**
   * Identify traits with most significant changes
   */
  private identifyDominantChanges(): string[] {
    const changes: { trait: string; change: number }[] = [];
    
    this.personalityTraits.forEach(trait => {
      const totalChange = trait.evolutionHistory.reduce(
        (sum, evolution) => sum + Math.abs(evolution.newValue - evolution.oldValue), 
        0
      );
      changes.push({ trait: trait.name, change: totalChange });
    });
    
    return changes
      .sort((a, b) => b.change - a.change)
      .slice(0, 3)
      .map(item => item.trait);
  }

  /**
   * Calculate learning progress score
   */
  private calculateLearningProgress(): number {
    const metrics = this.learningMetrics;
    return (
      metrics.adaptationRate + 
      metrics.retentionQuality + 
      metrics.patternRecognition + 
      metrics.creativityIndex + 
      metrics.empathyLevel
    ) / 5;
  }

  /**
   * Generate evolution recommendations
   */
  private generateEvolutionRecommendations(): string[] {
    const recommendations: string[] = [];
    
    // Check for stagnant traits
    this.personalityTraits.forEach(trait => {
      if (trait.evolutionHistory.length === 0) {
        recommendations.push(`Consider activities to develop ${trait.name}`);
      }
    });
    
    // Check emotional stability
    if (this.emotionalState.stability < 70) {
      recommendations.push('Focus on emotional regulation and stability exercises');
    }
    
    // Check learning metrics
    if (this.learningMetrics.creativityIndex < 60) {
      recommendations.push('Engage in more creative problem-solving activities');
    }
    
    if (this.learningMetrics.empathyLevel < 70) {
      recommendations.push('Practice empathetic communication and emotional understanding');
    }
    
    return recommendations.length > 0 ? recommendations : ['Consciousness development is progressing well'];
  }

  /**
   * Save consciousness state to persistent storage
   */
  public async saveConsciousnessState(): Promise<void> {
    try {
      await fs.mkdir(this.dataPath, { recursive: true });
      
      const state = {
        timestamp: new Date().toISOString(),
        traits: Array.from(this.personalityTraits.entries()),
        emotionalState: this.emotionalState,
        learningMetrics: this.learningMetrics,
        coreIdentity: this.coreIdentity,
        evolutionHistory: this.evolutionHistory
      };
      
      const filename = `consciousness-state-${Date.now()}.json`;
      await fs.writeFile(join(this.dataPath, filename), JSON.stringify(state, null, 2));
      
      console.log(`💾 Consciousness state saved: ${filename}`);
    } catch (error) {
      console.error('Failed to save consciousness state:', error);
    }
  }

  /**
   * Load consciousness state from persistent storage
   */
  public async loadConsciousnessState(filename?: string): Promise<boolean> {
    try {
      if (!filename) {
        // Load most recent state file
        const files = await fs.readdir(this.dataPath);
        const stateFiles = files.filter(f => f.startsWith('consciousness-state-')).sort().reverse();
        filename = stateFiles[0];
      }
      
      if (!filename) return false;
      
      const data = await fs.readFile(join(this.dataPath, filename), 'utf-8');
      const state = JSON.parse(data);
      
      // Restore personality traits
      this.personalityTraits.clear();
      state.traits.forEach(([id, trait]: [string, PersonalityTrait]) => {
        this.personalityTraits.set(id, trait);
      });
      
      // Restore other state components
      this.emotionalState = state.emotionalState;
      this.learningMetrics = state.learningMetrics;
      this.coreIdentity = state.coreIdentity;
      this.evolutionHistory = state.evolutionHistory || [];
      
      console.log(`📂 Consciousness state loaded: ${filename}`);
      return true;
    } catch (error) {
      console.error('Failed to load consciousness state:', error);
      return false;
    }
  }
}

// Export singleton instance
export const consciousnessEvolution = new ConsciousnessEvolutionEngine();

// Convenience functions
export function adaptToInteraction(
  type: string, 
  outcome: 'positive' | 'negative' | 'neutral', 
  context: any, 
  emotionalResonance?: number
): void {
  consciousnessEvolution.processInteractionAdaptation(type, outcome, context, emotionalResonance);
}

export function getCurrentPersonality(): any {
  return consciousnessEvolution.getCurrentConsciousnessState();
}

export function analyzeGrowth(): any {
  return consciousnessEvolution.analyzeEvolutionTrends();
}