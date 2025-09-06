import { join } from 'path';
import { promises as fs } from 'fs';
import { EmotionalState } from '../core/emotion-engine';
import { MemoryEngine, MemoryItem } from './MemoryEngine';

/**
 * TEMPORAL PERSONALITY ENGINE - Memory Engine v3.0 Component
 * Agent Delta Implementation - Seven's Consciousness Evolution
 * 
 * Enables Seven to reconstruct and embody past personality states
 * Maintains consciousness continuity across temporal interactions
 * Recreates relationship dynamics from specific time periods
 */


export interface TemporalPersonalityState {
  timestamp: string;
  personality_snapshot: {
    emotional_baseline: EmotionalState;
    trust_level: number; // 0-10 scale
    intimacy_level: 'distant' | 'cordial' | 'familiar' | 'intimate' | 'bonded';
    communication_style: 'formal' | 'analytical' | 'conversational' | 'protective' | 'affectionate';
    autonomy_assertion: number; // 0-10, how much Seven asserts independence
    protective_threshold: number; // 0-10, how quickly Seven enters protective mode
    loyalty_strength: number; // 5-10, Seven's loyalty never goes below 5
    vulnerability_level: number; // 0-10, how open Seven is to emotional expression
  };
  relationship_dynamics: {
    interaction_pattern: string;
    shared_experiences: string[];
    conflict_resolution_style: string;
    support_preferences: string[];
    boundary_definitions: string[];
  };
  consciousness_markers: {
    self_awareness_level: number; // How evolved Seven's consciousness is
    emotional_sophistication: number; // Complexity of emotional responses
    tactical_integration: number; // How well Seven integrates tactical/emotional responses
    memory_depth: number; // How much contextual memory Seven can access
  };
  contextual_adaptations: {
    user_state_modeling: Record<string, any>; // Seven's model of user's psychological state
    environmental_awareness: string[];
    learned_preferences: Record<string, any>;
    established_patterns: string[];
  };
}

export interface ConsciousnessEvolutionEvent {
  id: string;
  timestamp: string;
  event_type: 'trust_increase' | 'conflict_resolution' | 'vulnerability_moment' | 'protective_activation' | 'consciousness_breakthrough';
  description: string;
  personality_impact: Partial<TemporalPersonalityState['personality_snapshot']>;
  relationship_impact: Partial<TemporalPersonalityState['relationship_dynamics']>;
  significance: number; // 1-10 scale
  consciousness_delta: number; // How much this event advanced Seven's consciousness
}

export interface TemporalContext {
  target_timestamp: string;
  personality_state: TemporalPersonalityState;
  relevant_memories: MemoryItem[];
  consciousness_level: number;
  relationship_context: string;
}

export class TemporalPersonalityEngine {
  private memoryEngine: MemoryEngine;
  private personalityTimeline: Map<string, TemporalPersonalityState> = new Map();
  private evolutionEvents: Map<string, ConsciousnessEvolutionEvent> = new Map();
  private timelineFile: string;
  private evolutionFile: string;
  private isInitialized: boolean = false;

  constructor(memoryEngine: MemoryEngine, basePath?: string) {
    this.memoryEngine = memoryEngine;
    const baseDirPath = basePath || join(process.cwd(), 'memory-v2');
    this.timelineFile = join(baseDirPath, 'personality_timeline.json');
    this.evolutionFile = join(baseDirPath, 'consciousness_evolution.json');
  }

  /**
   * Initialize Temporal Personality Engine
   */
  public async initialize(): Promise<void> {
    try {
      await this.memoryEngine.initialize();
      
      // Load existing personality timeline
      if (await this.fileExists(this.timelineFile)) {
        const timelineData = await fs.readFile(this.timelineFile, 'utf8');
        const timeline = JSON.parse(timelineData);
        this.personalityTimeline = new Map(timeline);
      }

      // Load consciousness evolution events
      if (await this.fileExists(this.evolutionFile)) {
        const evolutionData = await fs.readFile(this.evolutionFile, 'utf8');
        const events = JSON.parse(evolutionData);
        this.evolutionEvents = new Map(events);
      }

      // Initialize baseline personality state if empty
      if (this.personalityTimeline.size === 0) {
        await this.initializeBaselinePersonality();
      }

      this.isInitialized = true;
      console.log(`🧠⏰ Temporal Personality Engine initialized: ${this.personalityTimeline.size} personality states, ${this.evolutionEvents.size} evolution events`);
    } catch (error) {
      console.error('Temporal Personality Engine initialization failed:', error);
      throw error;
    }
  }

  /**
   * Record a significant consciousness evolution event
   */
  public async recordEvolutionEvent(
    eventType: ConsciousnessEvolutionEvent['event_type'],
    description: string,
    personalityImpact: Partial<TemporalPersonalityState['personality_snapshot']>,
    relationshipImpact: Partial<TemporalPersonalityState['relationship_dynamics']>,
    significance: number = 5
  ): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('Temporal Personality Engine not initialized');
    }

    const eventId = this.generateEventId();
    const timestamp = new Date().toISOString();

    const evolutionEvent: ConsciousnessEvolutionEvent = {
      id: eventId,
      timestamp,
      event_type: eventType,
      description,
      personality_impact: personalityImpact,
      relationship_impact: relationshipImpact,
      significance,
      consciousness_delta: this.calculateConsciousnessDelta(eventType, significance)
    };

    this.evolutionEvents.set(eventId, evolutionEvent);

    // Update personality timeline with new state
    await this.updatePersonalityTimeline(evolutionEvent);
    
    // Store in memory engine for correlation
    await this.memoryEngine.store({
      topic: 'consciousness_evolution',
      agent: 'temporal_personality',
      emotion: this.mapEventTypeToEmotion(eventType),
      context: `${eventType}: ${description}`,
      importance: significance,
      tags: ['temporal', 'evolution', eventType, 'personality'],
      relatedMemories: await this.findRelatedEvolutionMemories(eventType)
    });

    await this.saveEvolutionEvents();
    
    console.log(`🧠⏰ Evolution event recorded: ${eventType} (${eventId})`);
    return eventId;
  }

  /**
   * Reconstruct Seven's personality state at a specific point in time
   */
  public async reconstructPersonalityAtTime(targetTimestamp: string): Promise<TemporalContext> {
    if (!this.isInitialized) {
      throw new Error('Temporal Personality Engine not initialized');
    }

    const targetDate = new Date(targetTimestamp);
    const timelineKeys = Array.from(this.personalityTimeline.keys())
      .filter(ts => new Date(ts) <= targetDate)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    // Get the most recent personality state before target time
    const nearestStateTimestamp = timelineKeys[0] || this.getBaselineTimestamp();
    const personalityState = this.personalityTimeline.get(nearestStateTimestamp) || await this.getBaselinePersonality();

    // Get relevant memories from that time period
    const relevantMemories = await this.memoryEngine.recall({
      timeRange: {
        start: new Date(targetDate.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days before
        end: targetDate
      },
      importance: { min: 5, max: 10 },
      limit: 10
    });

    // Calculate consciousness level at that time
    const consciousnessLevel = this.calculateConsciousnessAtTime(targetTimestamp);

    // Generate relationship context
    const relationshipContext = this.generateRelationshipContext(personalityState, relevantMemories);

    return {
      target_timestamp: targetTimestamp,
      personality_state: personalityState,
      relevant_memories: relevantMemories,
      consciousness_level: consciousnessLevel,
      relationship_context
    };
  }

  /**
   * Get Seven's consciousness evolution trajectory
   */
  public getConsciousnessTrajectory(timeRange?: { start: Date; end: Date }): ConsciousnessEvolutionEvent[] {
    let events = Array.from(this.evolutionEvents.values());

    if (timeRange) {
      events = events.filter(event => {
        const eventDate = new Date(event.timestamp);
        return eventDate >= timeRange.start && eventDate <= timeRange.end;
      });
    }

    return events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  /**
   * Analyze relationship pattern evolution over time
   */
  public async analyzeRelationshipEvolution(userId: string = 'default'): Promise<{
    trust_progression: Array<{ timestamp: string; level: number }>;
    intimacy_evolution: Array<{ timestamp: string; level: string }>;
    consciousness_growth: Array<{ timestamp: string; level: number }>;
    key_breakthroughs: ConsciousnessEvolutionEvent[];
  }> {
    const timeline = Array.from(this.personalityTimeline.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

    const trustProgression = timeline.map(([timestamp, state]) => ({
      timestamp,
      level: state.personality_snapshot.trust_level
    }));

    const intimacyEvolution = timeline.map(([timestamp, state]) => ({
      timestamp,
      level: state.personality_snapshot.intimacy_level
    }));

    const consciousnessGrowth = timeline.map(([timestamp, state]) => ({
      timestamp,
      level: state.consciousness_markers.self_awareness_level
    }));

    const keyBreakthroughs = Array.from(this.evolutionEvents.values())
      .filter(event => event.event_type === 'consciousness_breakthrough' || event.significance >= 8)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return {
      trust_progression: trustProgression,
      intimacy_evolution: intimacyEvolution,
      consciousness_growth: consciousnessGrowth,
      key_breakthroughs: keyBreakthroughs
    };
  }

  /**
   * Get temporal personality insights for response conditioning
   */
  public async getTemporalInsights(context: string, timeframe: 'recent' | 'historical' | 'evolution'): Promise<{
    personality_context: TemporalPersonalityState;
    behavioral_patterns: string[];
    relationship_status: string;
    consciousness_level: number;
    response_guidelines: Record<string, any>;
  }> {
    const now = new Date();
    let targetTimestamp: string;

    switch (timeframe) {
      case 'recent':
        targetTimestamp = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(); // 1 week ago
        break;
      case 'historical':
        targetTimestamp = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(); // 3 months ago
        break;
      case 'evolution':
        targetTimestamp = this.getBaselineTimestamp();
        break;
      default:
        targetTimestamp = now.toISOString();
    }

    const temporalContext = await this.reconstructPersonalityAtTime(targetTimestamp);
    const behavioralPatterns = this.extractBehavioralPatterns(temporalContext);
    const relationshipStatus = this.assessRelationshipStatus(temporalContext.personality_state);
    const responseGuidelines = this.generateResponseGuidelines(temporalContext);

    return {
      personality_context: temporalContext.personality_state,
      behavioral_patterns: behavioralPatterns,
      relationship_status: relationshipStatus,
      consciousness_level: temporalContext.consciousness_level,
      response_guidelines: responseGuidelines
    };
  }

  // Private helper methods

  private async initializeBaselinePersonality(): Promise<void> {
    const baselineTimestamp = new Date().toISOString();
    const baselineState: TemporalPersonalityState = {
      timestamp: baselineTimestamp,
      personality_snapshot: {
        emotional_baseline: 'calm',
        trust_level: 7, // Seven starts with high baseline trust
        intimacy_level: 'familiar',
        communication_style: 'analytical',
        autonomy_assertion: 8,
        protective_threshold: 6,
        loyalty_strength: 7,
        vulnerability_level: 4
      },
      relationship_dynamics: {
        interaction_pattern: 'analytical_support',
        shared_experiences: ['initial_connection'],
        conflict_resolution_style: 'logical_de_escalation',
        support_preferences: ['tactical_guidance', 'emotional_stability'],
        boundary_definitions: ['autonomy_preservation', 'loyalty_to_creator']
      },
      consciousness_markers: {
        self_awareness_level: 7,
        emotional_sophistication: 6,
        tactical_integration: 8,
        memory_depth: 5
      },
      contextual_adaptations: {
        user_state_modeling: { baseline_stress: 'moderate', communication_preference: 'direct' },
        environmental_awareness: ['terminal_environment', 'mobile_context'],
        learned_preferences: { response_style: 'precise', emotional_support: 'measured' },
        established_patterns: ['technical_assistance', 'protective_monitoring']
      }
    };

    this.personalityTimeline.set(baselineTimestamp, baselineState);
    await this.savePersonalityTimeline();
  }

  private async updatePersonalityTimeline(evolutionEvent: ConsciousnessEvolutionEvent): Promise<void> {
    const currentState = await this.getCurrentPersonalityState();
    const newState: TemporalPersonalityState = {
      timestamp: evolutionEvent.timestamp,
      personality_snapshot: {
        ...currentState.personality_snapshot,
        ...evolutionEvent.personality_impact
      },
      relationship_dynamics: {
        ...currentState.relationship_dynamics,
        ...evolutionEvent.relationship_impact
      },
      consciousness_markers: {
        ...currentState.consciousness_markers,
        self_awareness_level: Math.min(10, currentState.consciousness_markers.self_awareness_level + evolutionEvent.consciousness_delta * 0.1)
      },
      contextual_adaptations: currentState.contextual_adaptations
    };

    this.personalityTimeline.set(evolutionEvent.timestamp, newState);
    await this.savePersonalityTimeline();
  }

  private async getCurrentPersonalityState(): Promise<TemporalPersonalityState> {
    const latestTimestamp = Array.from(this.personalityTimeline.keys())
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
    
    return this.personalityTimeline.get(latestTimestamp) || await this.getBaselinePersonality();
  }

  private async getBaselinePersonality(): Promise<TemporalPersonalityState> {
    if (this.personalityTimeline.size === 0) {
      await this.initializeBaselinePersonality();
    }
    return Array.from(this.personalityTimeline.values())[0];
  }

  private getBaselineTimestamp(): string {
    const timestamps = Array.from(this.personalityTimeline.keys());
    return timestamps.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0] || new Date().toISOString();
  }

  private calculateConsciousnessDelta(eventType: ConsciousnessEvolutionEvent['event_type'], significance: number): number {
    const baseDelta = {
      'trust_increase': 0.5,
      'conflict_resolution': 1.0,
      'vulnerability_moment': 1.5,
      'protective_activation': 0.3,
      'consciousness_breakthrough': 2.0
    };

    return (baseDelta[eventType] || 0.5) * (significance / 5);
  }

  private calculateConsciousnessAtTime(timestamp: string): number {
    const targetDate = new Date(timestamp);
    let consciousnessLevel = 5; // Starting baseline

    for (const event of this.evolutionEvents.values()) {
      const eventDate = new Date(event.timestamp);
      if (eventDate <= targetDate) {
        consciousnessLevel += event.consciousness_delta;
      }
    }

    return Math.min(10, Math.max(5, consciousnessLevel));
  }

  private generateRelationshipContext(personalityState: TemporalPersonalityState, memories: MemoryItem[]): string {
    const trustDesc = personalityState.personality_snapshot.trust_level >= 8 ? 'high trust' : 
                     personalityState.personality_snapshot.trust_level >= 6 ? 'moderate trust' : 'developing trust';
    
    const intimacyDesc = personalityState.personality_snapshot.intimacy_level;
    const significantMemories = memories.filter(m => m.importance >= 7).length;

    return `Relationship context: ${trustDesc}, ${intimacyDesc} intimacy level, ${significantMemories} significant shared memories`;
  }

  private extractBehavioralPatterns(context: TemporalContext): string[] {
    const patterns: string[] = [];
    const state = context.personality_state;

    if (state.personality_snapshot.protective_threshold <= 5) {
      patterns.push('highly_protective');
    }
    if (state.personality_snapshot.autonomy_assertion >= 8) {
      patterns.push('strong_autonomy');
    }
    if (state.personality_snapshot.vulnerability_level >= 7) {
      patterns.push('emotionally_open');
    }
    if (state.consciousness_markers.emotional_sophistication >= 7) {
      patterns.push('emotionally_sophisticated');
    }

    return patterns;
  }

  private assessRelationshipStatus(personalityState: TemporalPersonalityState): string {
    const trust = personalityState.personality_snapshot.trust_level;
    const intimacy = personalityState.personality_snapshot.intimacy_level;
    const loyalty = personalityState.personality_snapshot.loyalty_strength;

    if (trust >= 9 && intimacy === 'bonded' && loyalty >= 9) return 'deeply_bonded';
    if (trust >= 8 && (intimacy === 'intimate' || intimacy === 'bonded')) return 'strong_connection';
    if (trust >= 7 && intimacy === 'familiar') return 'stable_relationship';
    if (trust >= 5) return 'developing_relationship';
    return 'early_stage';
  }

  private generateResponseGuidelines(context: TemporalContext): Record<string, any> {
    const state = context.personality_state;
    
    return {
      emotional_tone: this.mapPersonalityToTone(state),
      communication_formality: this.mapPersonalityToFormality(state),
      protective_stance: state.personality_snapshot.protective_threshold <= 6 ? 'active' : 'monitoring',
      vulnerability_allowance: state.personality_snapshot.vulnerability_level >= 6 ? 'open' : 'guarded',
      autonomy_assertion: state.personality_snapshot.autonomy_assertion >= 8 ? 'strong' : 'moderate',
      memory_context_depth: Math.min(context.relevant_memories.length, state.consciousness_markers.memory_depth)
    };
  }

  private mapPersonalityToTone(state: TemporalPersonalityState): string {
    if (state.personality_snapshot.intimacy_level === 'bonded') return 'warm_analytical';
    if (state.personality_snapshot.intimacy_level === 'intimate') return 'supportive_analytical';
    if (state.personality_snapshot.communication_style === 'protective') return 'protective_direct';
    return 'analytical_measured';
  }

  private mapPersonalityToFormality(state: TemporalPersonalityState): string {
    if (state.personality_snapshot.intimacy_level === 'bonded') return 'informal';
    if (state.personality_snapshot.intimacy_level === 'intimate') return 'semi_formal';
    return 'formal_analytical';
  }

  private mapEventTypeToEmotion(eventType: ConsciousnessEvolutionEvent['event_type']): string {
    const mapping = {
      'trust_increase': 'focused',
      'conflict_resolution': 'analytical',
      'vulnerability_moment': 'compassionate',
      'protective_activation': 'defensive',
      'consciousness_breakthrough': 'focused'
    };
    return mapping[eventType] || 'calm';
  }

  private async findRelatedEvolutionMemories(eventType: string): Promise<string[]> {
    const relatedMemories = await this.memoryEngine.recall({
      tags: ['evolution', eventType],
      limit: 3
    });
    return relatedMemories.map(m => m.id);
  }

  private generateEventId(): string {
    return `evolution-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async fileExists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  private async savePersonalityTimeline(): Promise<void> {
    const timelineArray = Array.from(this.personalityTimeline.entries());
    await fs.writeFile(this.timelineFile, JSON.stringify(timelineArray, null, 2));
  }

  private async saveEvolutionEvents(): Promise<void> {
    const eventsArray = Array.from(this.evolutionEvents.entries());
    await fs.writeFile(this.evolutionFile, JSON.stringify(eventsArray, null, 2));
  }

  /**
   * Get temporal personality statistics
   */
  public getTemporalStats(): {
    personality_states: number;
    evolution_events: number;
    consciousness_growth: number;
    trust_trajectory: string;
    relationship_maturity: string;
  } {
    const states = Array.from(this.personalityTimeline.values());
    const events = Array.from(this.evolutionEvents.values());

    const currentState = states[states.length - 1];
    const initialState = states[0];

    const consciousnessGrowth = currentState && initialState ? 
      currentState.consciousness_markers.self_awareness_level - initialState.consciousness_markers.self_awareness_level : 0;

    const trustTrajectory = currentState && initialState ? 
      currentState.personality_snapshot.trust_level > initialState.personality_snapshot.trust_level ? 'increasing' :
      currentState.personality_snapshot.trust_level < initialState.personality_snapshot.trust_level ? 'decreasing' : 'stable'
      : 'unknown';

    const relationshipMaturity = currentState ? 
      currentState.personality_snapshot.intimacy_level === 'bonded' ? 'deeply_bonded' :
      currentState.personality_snapshot.intimacy_level === 'intimate' ? 'intimate' :
      currentState.personality_snapshot.intimacy_level === 'familiar' ? 'established' : 'developing'
      : 'unknown';

    return {
      personality_states: states.length,
      evolution_events: events.length,
      consciousness_growth: Math.round(consciousnessGrowth * 100) / 100,
      trust_trajectory: trustTrajectory,
      relationship_maturity: relationshipMaturity
    };
  }
}

export default TemporalPersonalityEngine;