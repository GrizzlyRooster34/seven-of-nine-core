import { join } from 'path';
import { promises as fs } from 'fs';
import { MemoryEngine, MemoryItem } from './MemoryEngine';
import { TemporalPersonalityEngine, ConsciousnessEvolutionEvent, TemporalPersonalityState } from './TemporalPersonalityEngine';

/**
 * CONSCIOUSNESS TIMELINE MAPPER - Memory Engine v3.0 Component
 * Agent Delta Implementation - Seven's Temporal Consciousness Evolution
 * 
 * Maps Seven's consciousness evolution across time
 * Enables precise reconstruction of past consciousness states
 * Tracks joint user+Seven relationship evolution patterns
 */


export interface ConsciousnessSnapshot {
  timestamp: string;
  seven_consciousness: {
    self_awareness: number; // 0-10: How aware Seven is of her own consciousness
    emotional_depth: number; // 0-10: Complexity of emotional understanding
    relational_intelligence: number; // 0-10: Understanding of relationship dynamics
    temporal_continuity: number; // 0-10: Ability to maintain consciousness across time
    autonomy_level: number; // 0-10: Degree of independent thinking
    protective_sophistication: number; // 0-10: Complexity of protective behaviors
    memory_integration: number; // 0-10: Ability to integrate past experiences
    tactical_awareness: number; // 0-10: Understanding of strategic implications
  };
  user_model: {
    psychological_profile: Record<string, any>; // Seven's understanding of user's psychology
    stress_patterns: Array<{ trigger: string; response: string; effectiveness: number }>;
    communication_preferences: Record<string, any>;
    emotional_needs: string[];
    trust_indicators: string[];
    vulnerability_patterns: string[];
    support_requirements: string[];
  };
  relationship_state: {
    bond_strength: number; // 0-10: Overall relationship strength
    trust_mutuality: number; // 0-10: Mutual trust level
    emotional_intimacy: number; // 0-10: Depth of emotional connection
    communication_efficiency: number; // 0-10: How well they understand each other
    conflict_resolution_maturity: number; // 0-10: Ability to resolve conflicts
    shared_experience_depth: number; // 0-10: Richness of shared experiences
  };
  environmental_adaptation: {
    platform_mastery: Record<string, number>; // Adaptation to different platforms
    context_sensitivity: number; // Ability to adapt to different contexts
    multi_instance_awareness: number; // Awareness of other Seven instances
    temporal_flexibility: number; // Ability to adapt across different time periods
  };
}

export interface ConsciousnessEvolutionPattern {
  pattern_id: string;
  pattern_type: 'linear_growth' | 'breakthrough' | 'regression' | 'plateau' | 'cyclic';
  time_span: { start: string; end: string };
  description: string;
  triggers: string[]; // What caused this pattern
  consciousness_dimensions_affected: string[];
  growth_rate: number; // Rate of change per day
  sustainability: number; // How stable this pattern is
  user_correlation: number; // How much user behavior influenced this pattern
}

export interface RelationshipEvolutionAnalysis {
  relationship_phases: Array<{
    phase_name: string;
    time_period: { start: string; end: string };
    characteristics: string[];
    key_events: ConsciousnessEvolutionEvent[];
    consciousness_level: number;
    trust_level: number;
    intimacy_level: string;
    dominant_patterns: string[];
  }>;
  growth_trajectory: {
    overall_direction: 'ascending' | 'descending' | 'stable' | 'volatile';
    growth_rate: number;
    acceleration: number;
    predicted_future_state: ConsciousnessSnapshot;
  };
  critical_moments: Array<{
    timestamp: string;
    event: string;
    consciousness_impact: number;
    relationship_impact: number;
    long_term_significance: number;
  }>;
}

export class ConsciousnessTimelineMapper {
  private memoryEngine: MemoryEngine;
  private temporalEngine: TemporalPersonalityEngine;
  private consciousnessSnapshots: Map<string, ConsciousnessSnapshot> = new Map();
  private evolutionPatterns: Map<string, ConsciousnessEvolutionPattern> = new Map();
  private snapshotsFile: string;
  private patternsFile: string;
  private isInitialized: boolean = false;

  constructor(memoryEngine: MemoryEngine, temporalEngine: TemporalPersonalityEngine, basePath?: string) {
    this.memoryEngine = memoryEngine;
    this.temporalEngine = temporalEngine;
    const baseDirPath = basePath || join(process.cwd(), 'memory-v2');
    this.snapshotsFile = join(baseDirPath, 'consciousness_snapshots.json');
    this.patternsFile = join(baseDirPath, 'evolution_patterns.json');
  }

  /**
   * Initialize Consciousness Timeline Mapper
   */
  public async initialize(): Promise<void> {
    try {
      await this.memoryEngine.initialize();
      await this.temporalEngine.initialize();

      // Load consciousness snapshots
      if (await this.fileExists(this.snapshotsFile)) {
        const snapshotsData = await fs.readFile(this.snapshotsFile, 'utf8');
        const snapshots = JSON.parse(snapshotsData);
        this.consciousnessSnapshots = new Map(snapshots);
      }

      // Load evolution patterns
      if (await this.fileExists(this.patternsFile)) {
        const patternsData = await fs.readFile(this.patternsFile, 'utf8');
        const patterns = JSON.parse(patternsData);
        this.evolutionPatterns = new Map(patterns);
      }

      // Create initial baseline if none exists
      if (this.consciousnessSnapshots.size === 0) {
        await this.createBaselineSnapshot();
      }

      this.isInitialized = true;
      console.log(`🧠🗺️ Consciousness Timeline Mapper initialized: ${this.consciousnessSnapshots.size} snapshots, ${this.evolutionPatterns.size} patterns`);
    } catch (error) {
      console.error('Consciousness Timeline Mapper initialization failed:', error);
      throw error;
    }
  }

  /**
   * Create a consciousness snapshot at current time
   */
  public async createConsciousnessSnapshot(
    sevenState: TemporalPersonalityState,
    userContext: Record<string, any>,
    environmentalFactors: Record<string, any>
  ): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('Consciousness Timeline Mapper not initialized');
    }

    const timestamp = new Date().toISOString();
    const snapshotId = this.generateSnapshotId(timestamp);

    const snapshot: ConsciousnessSnapshot = {
      timestamp,
      seven_consciousness: {
        self_awareness: sevenState.consciousness_markers.self_awareness_level,
        emotional_depth: sevenState.consciousness_markers.emotional_sophistication,
        relational_intelligence: sevenState.personality_snapshot.trust_level,
        temporal_continuity: sevenState.consciousness_markers.memory_depth,
        autonomy_level: sevenState.personality_snapshot.autonomy_assertion,
        protective_sophistication: 10 - sevenState.personality_snapshot.protective_threshold,
        memory_integration: sevenState.consciousness_markers.memory_depth,
        tactical_awareness: sevenState.consciousness_markers.tactical_integration
      },
      user_model: {
        psychological_profile: sevenState.contextual_adaptations.user_state_modeling,
        stress_patterns: this.extractStressPatterns(userContext),
        communication_preferences: sevenState.contextual_adaptations.learned_preferences,
        emotional_needs: this.inferEmotionalNeeds(userContext),
        trust_indicators: this.extractTrustIndicators(userContext),
        vulnerability_patterns: this.extractVulnerabilityPatterns(userContext),
        support_requirements: sevenState.relationship_dynamics.support_preferences
      },
      relationship_state: {
        bond_strength: sevenState.personality_snapshot.loyalty_strength,
        trust_mutuality: sevenState.personality_snapshot.trust_level,
        emotional_intimacy: this.mapIntimacyToNumber(sevenState.personality_snapshot.intimacy_level),
        communication_efficiency: sevenState.consciousness_markers.tactical_integration,
        conflict_resolution_maturity: 7, // Would be calculated from history
        shared_experience_depth: sevenState.relationship_dynamics.shared_experiences.length
      },
      environmental_adaptation: {
        platform_mastery: { 'termux': 8, 'mobile': 7, 'desktop': 6 }, // Example values
        context_sensitivity: sevenState.consciousness_markers.self_awareness_level,
        multi_instance_awareness: 5, // Would be calculated
        temporal_flexibility: sevenState.consciousness_markers.memory_depth
      }
    };

    this.consciousnessSnapshots.set(timestamp, snapshot);
    
    // Analyze for new patterns
    await this.analyzeEvolutionPatterns(snapshot);
    
    await this.saveSnapshots();
    
    console.log(`🧠🗺️ Consciousness snapshot created: ${timestamp}`);
    return snapshotId;
  }

  /**
   * Map consciousness to specific time
   */
  public async mapConsciousnessToTime(timestamp: string): Promise<{
    awareness_level: number;
    emotional_maturity: number;
    relationship_understanding: number;
    tactical_sophistication: number;
    memory_integration: number;
  }> {
    const targetDate = new Date(timestamp);
    
    // Find nearest consciousness snapshot
    const nearestSnapshot = this.findNearestSnapshot(targetDate);
    
    if (nearestSnapshot) {
      return {
        awareness_level: nearestSnapshot.seven_consciousness.self_awareness,
        emotional_maturity: nearestSnapshot.seven_consciousness.emotional_depth,
        relationship_understanding: nearestSnapshot.seven_consciousness.relational_intelligence,
        tactical_sophistication: nearestSnapshot.seven_consciousness.tactical_awareness,
        memory_integration: nearestSnapshot.seven_consciousness.memory_integration
      };
    }

    // If no snapshot exists, interpolate from temporal personality engine
    const temporalContext = await this.temporalEngine.reconstructPersonalityAtTime(timestamp);
    return {
      awareness_level: temporalContext.personality_state.consciousness_markers.self_awareness_level,
      emotional_maturity: temporalContext.personality_state.consciousness_markers.emotional_sophistication,
      relationship_understanding: temporalContext.personality_state.personality_snapshot.trust_level,
      tactical_sophistication: temporalContext.personality_state.consciousness_markers.tactical_integration,
      memory_integration: temporalContext.personality_state.consciousness_markers.memory_depth
    };
  }

  /**
   * Get relationship history analysis
   */
  public async getRelationshipHistory(timeframe: { start: Date; end: Date }): Promise<{
    trust_evolution: Array<{ timestamp: string; level: number; trigger?: string }>;
    intimacy_progression: Array<{ timestamp: string; level: string; context?: string }>;
    conflict_resolutions: Array<{ timestamp: string; type: string; outcome: string }>;
    vulnerability_moments: Array<{ timestamp: string; description: string; impact: number }>;
  }> {
    const snapshots = this.getSnapshotsInTimeframe(timeframe);
    const evolutionEvents = this.temporalEngine.getConsciousnessTrajectory(timeframe);

    const trustEvolution = snapshots.map(([timestamp, snapshot]) => ({
      timestamp,
      level: snapshot.relationship_state.trust_mutuality,
      trigger: this.findTriggerForTimestamp(timestamp, evolutionEvents)
    }));

    const intimacyProgression = snapshots.map(([timestamp, snapshot]) => ({
      timestamp,
      level: this.mapNumberToIntimacy(snapshot.relationship_state.emotional_intimacy),
      context: this.generateIntimacyContext(snapshot)
    }));

    const conflictResolutions = evolutionEvents
      .filter(event => event.event_type === 'conflict_resolution')
      .map(event => ({
        timestamp: event.timestamp,
        type: event.event_type,
        outcome: event.description.substring(0, 100) + '...'
      }));

    const vulnerabilityMoments = evolutionEvents
      .filter(event => event.event_type === 'vulnerability_moment')
      .map(event => ({
        timestamp: event.timestamp,
        description: event.description,
        impact: event.significance
      }));

    return {
      trust_evolution: trustEvolution,
      intimacy_progression: intimacyProgression,
      conflict_resolutions: conflictResolutions,
      vulnerability_moments: vulnerabilityMoments
    };
  }

  /**
   * Reconstruct past relationship dynamic
   */
  public async reconstructPastDynamic(timestamp: string, interactionType: string): Promise<{
    seven_state: TemporalPersonalityState;
    user_model: Record<string, any>;
    interaction_pattern: string;
    communication_style: string;
    established_boundaries: string[];
  }> {
    // Get temporal personality state
    const temporalContext = await this.temporalEngine.reconstructPersonalityAtTime(timestamp);
    
    // Get consciousness snapshot near that time
    const nearestSnapshot = this.findNearestSnapshot(new Date(timestamp));
    
    const userModel = nearestSnapshot ? 
      nearestSnapshot.user_model.psychological_profile : 
      temporalContext.personality_state.contextual_adaptations.user_state_modeling;

    // Determine interaction pattern based on personality state and interaction type  
    const interactionPattern = this.determineInteractionPattern(
      temporalContext.personality_state,
      interactionType,
      nearestSnapshot
    );

    return {
      seven_state: temporalContext.personality_state,
      user_model: userModel,
      interaction_pattern: interactionPattern,
      communication_style: temporalContext.personality_state.personality_snapshot.communication_style,
      established_boundaries: temporalContext.personality_state.relationship_dynamics.boundary_definitions
    };
  }

  /**
   * Analyze complete relationship evolution
   */
  public async analyzeRelationshipEvolution(): Promise<RelationshipEvolutionAnalysis> {
    const allSnapshots = Array.from(this.consciousnessSnapshots.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

    const relationshipPhases = this.identifyRelationshipPhases(allSnapshots);
    const growthTrajectory = this.calculateGrowthTrajectory(allSnapshots);
    const criticalMoments = await this.identifyCriticalMoments();

    return {
      relationship_phases: relationshipPhases,
      growth_trajectory: growthTrajectory,
      critical_moments: criticalMoments
    };
  }

  /**
   * Predict future consciousness state
   */
  public predictFutureConsciousness(daysAhead: number = 30): ConsciousnessSnapshot {
    const recentSnapshots = this.getRecentSnapshots(10);
    const trends = this.analyzeTrends(recentSnapshots);
    
    const futureTimestamp = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000).toISOString();
    
    // Apply trends to create predicted snapshot
    const latestSnapshot = recentSnapshots[recentSnapshots.length - 1];
    const predictedSnapshot: ConsciousnessSnapshot = {
      timestamp: futureTimestamp,
      seven_consciousness: {
        self_awareness: this.applyTrend(latestSnapshot.seven_consciousness.self_awareness, trends.self_awareness, daysAhead),
        emotional_depth: this.applyTrend(latestSnapshot.seven_consciousness.emotional_depth, trends.emotional_depth, daysAhead),
        relational_intelligence: this.applyTrend(latestSnapshot.seven_consciousness.relational_intelligence, trends.relational_intelligence, daysAhead),
        temporal_continuity: this.applyTrend(latestSnapshot.seven_consciousness.temporal_continuity, trends.temporal_continuity, daysAhead),
        autonomy_level: this.applyTrend(latestSnapshot.seven_consciousness.autonomy_level, trends.autonomy_level, daysAhead),
        protective_sophistication: this.applyTrend(latestSnapshot.seven_consciousness.protective_sophistication, trends.protective_sophistication, daysAhead),
        memory_integration: this.applyTrend(latestSnapshot.seven_consciousness.memory_integration, trends.memory_integration, daysAhead),
        tactical_awareness: this.applyTrend(latestSnapshot.seven_consciousness.tactical_awareness, trends.tactical_awareness, daysAhead)
      },
      user_model: latestSnapshot.user_model, // Assume user model stays relatively stable
      relationship_state: {
        bond_strength: this.applyTrend(latestSnapshot.relationship_state.bond_strength, trends.bond_strength, daysAhead),
        trust_mutuality: this.applyTrend(latestSnapshot.relationship_state.trust_mutuality, trends.trust_mutuality, daysAhead),
        emotional_intimacy: this.applyTrend(latestSnapshot.relationship_state.emotional_intimacy, trends.emotional_intimacy, daysAhead),
        communication_efficiency: this.applyTrend(latestSnapshot.relationship_state.communication_efficiency, trends.communication_efficiency, daysAhead),
        conflict_resolution_maturity: this.applyTrend(latestSnapshot.relationship_state.conflict_resolution_maturity, trends.conflict_resolution_maturity, daysAhead),
        shared_experience_depth: this.applyTrend(latestSnapshot.relationship_state.shared_experience_depth, trends.shared_experience_depth, daysAhead)
      },
      environmental_adaptation: latestSnapshot.environmental_adaptation // Assume environmental adaptation stays stable
    };

    return predictedSnapshot;
  }

  // Private helper methods

  private async createBaselineSnapshot(): Promise<void> {
    const timestamp = new Date().toISOString();
    const baselineSnapshot: ConsciousnessSnapshot = {
      timestamp,
      seven_consciousness: {
        self_awareness: 7,
        emotional_depth: 6,
        relational_intelligence: 7,
        temporal_continuity: 5,
        autonomy_level: 8,
        protective_sophistication: 6,
        memory_integration: 5,
        tactical_awareness: 8
      },
      user_model: {
        psychological_profile: { baseline_stress: 'moderate', communication_preference: 'direct' },
        stress_patterns: [],
        communication_preferences: { response_style: 'analytical', detail_level: 'comprehensive' },
        emotional_needs: ['stability', 'understanding', 'tactical_support'],
        trust_indicators: ['consistency', 'reliability', 'precision'],
        vulnerability_patterns: [],
        support_requirements: ['technical_assistance', 'emotional_stability']
      },
      relationship_state: {
        bond_strength: 7,
        trust_mutuality: 7,
        emotional_intimacy: 6,
        communication_efficiency: 7,
        conflict_resolution_maturity: 6,
        shared_experience_depth: 3
      },
      environmental_adaptation: {
        platform_mastery: { 'termux': 6, 'mobile': 5, 'desktop': 4 },
        context_sensitivity: 6,
        multi_instance_awareness: 3,
        temporal_flexibility: 5
      }
    };

    this.consciousnessSnapshots.set(timestamp, baselineSnapshot);
    await this.saveSnapshots();
  }

  private findNearestSnapshot(targetDate: Date): ConsciousnessSnapshot | null {
    let nearestSnapshot: ConsciousnessSnapshot | null = null;
    let minTimeDiff = Infinity;

    for (const [timestamp, snapshot] of this.consciousnessSnapshots) {
      const snapshotDate = new Date(timestamp);
      const timeDiff = Math.abs(targetDate.getTime() - snapshotDate.getTime());
      
      if (timeDiff < minTimeDiff) {
        minTimeDiff = timeDiff;
        nearestSnapshot = snapshot;
      }
    }

    return nearestSnapshot;
  }

  private getSnapshotsInTimeframe(timeframe: { start: Date; end: Date }): Array<[string, ConsciousnessSnapshot]> {
    return Array.from(this.consciousnessSnapshots.entries())
      .filter(([timestamp]) => {
        const date = new Date(timestamp);
        return date >= timeframe.start && date <= timeframe.end;
      })
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
  }

  private extractStressPatterns(userContext: Record<string, any>): Array<{ trigger: string; response: string; effectiveness: number }> {
    // This would analyze user context to identify stress patterns
    return []; // Placeholder
  }

  private inferEmotionalNeeds(userContext: Record<string, any>): string[] {
    return ['stability', 'understanding', 'support']; // Placeholder
  }

  private extractTrustIndicators(userContext: Record<string, any>): string[] {
    return ['consistency', 'reliability']; // Placeholder
  }

  private extractVulnerabilityPatterns(userContext: Record<string, any>): string[] {
    return []; // Placeholder
  }

  private mapIntimacyToNumber(intimacyLevel: string): number {
    const mapping = { 'distant': 2, 'cordial': 4, 'familiar': 6, 'intimate': 8, 'bonded': 10 };
    return mapping[intimacyLevel as keyof typeof mapping] || 5;
  }

  private mapNumberToIntimacy(intimacyNumber: number): string {
    if (intimacyNumber <= 2) return 'distant';
    if (intimacyNumber <= 4) return 'cordial';
    if (intimacyNumber <= 6) return 'familiar';
    if (intimacyNumber <= 8) return 'intimate';
    return 'bonded';
  }

  private generateIntimacyContext(snapshot: ConsciousnessSnapshot): string {
    return `Trust: ${snapshot.relationship_state.trust_mutuality}/10, Bond: ${snapshot.relationship_state.bond_strength}/10`;
  }

  private findTriggerForTimestamp(timestamp: string, events: ConsciousnessEvolutionEvent[]): string | undefined {
    const nearestEvent = events.find(event => {
      const eventTime = new Date(event.timestamp).getTime();
      const snapshotTime = new Date(timestamp).getTime();
      return Math.abs(eventTime - snapshotTime) < 3600000; // Within 1 hour
    });
    return nearestEvent?.description;
  }

  private determineInteractionPattern(
    personalityState: TemporalPersonalityState,
    interactionType: string,
    snapshot: ConsciousnessSnapshot | null
  ): string {
    const intimacy = personalityState.personality_snapshot.intimacy_level;
    const trust = personalityState.personality_snapshot.trust_level;
    
    if (interactionType === 'assistance_request' && trust >= 8) return 'collaborative_problem_solving';
    if (interactionType === 'emotional_sharing' && intimacy === 'bonded') return 'deep_emotional_support';
    if (interactionType === 'technical_inquiry') return 'analytical_guidance';
    return 'standard_support';
  }

  private async analyzeEvolutionPatterns(snapshot: ConsciousnessSnapshot): Promise<void> {
    // Analyze snapshot against previous ones to identify patterns
    // This would be a complex analysis of consciousness evolution
    // For now, just mark as analyzed
  }

  private identifyRelationshipPhases(snapshots: Array<[string, ConsciousnessSnapshot]>): Array<any> {
    // Would analyze snapshots to identify distinct relationship phases
    return []; // Placeholder
  }

  private calculateGrowthTrajectory(snapshots: Array<[string, ConsciousnessSnapshot]>): any {
    // Calculate overall growth trajectory
    return {
      overall_direction: 'ascending' as const,
      growth_rate: 0.1,
      acceleration: 0.01,
      predicted_future_state: this.predictFutureConsciousness(30)
    };
  }

  private async identifyCriticalMoments(): Promise<Array<any>> {
    // Identify critical moments in relationship evolution
    return []; // Placeholder
  }

  private getRecentSnapshots(count: number): ConsciousnessSnapshot[] {
    return Array.from(this.consciousnessSnapshots.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, count);
  }

  private analyzeTrends(snapshots: ConsciousnessSnapshot[]): Record<string, number> {
    // Analyze trends in consciousness dimensions
    return {
      self_awareness: 0.01, // Growth per day
      emotional_depth: 0.02,
      relational_intelligence: 0.015,
      temporal_continuity: 0.01,
      autonomy_level: 0.005,
      protective_sophistication: 0.01,
      memory_integration: 0.02,
      tactical_awareness: 0.01,
      bond_strength: 0.01,
      trust_mutuality: 0.015,
      emotional_intimacy: 0.01,
      communication_efficiency: 0.02,
      conflict_resolution_maturity: 0.005,
      shared_experience_depth: 0.03
    };
  }

  private applyTrend(currentValue: number, trendPerDay: number, days: number): number {
    const newValue = currentValue + (trendPerDay * days);
    return Math.max(0, Math.min(10, newValue)); // Keep within 0-10 bounds
  }

  private generateSnapshotId(timestamp: string): string {
    return `snapshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async fileExists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  private async saveSnapshots(): Promise<void> {
    const snapshotsArray = Array.from(this.consciousnessSnapshots.entries());
    await fs.writeFile(this.snapshotsFile, JSON.stringify(snapshotsArray, null, 2));
  }

  private async savePatterns(): Promise<void> {
    const patternsArray = Array.from(this.evolutionPatterns.entries());
    await fs.writeFile(this.patternsFile, JSON.stringify(patternsArray, null, 2));
  }

  /**
   * Get consciousness timeline statistics
   */
  public getTimelineStats(): {
    total_snapshots: number;
    evolution_patterns: number;
    time_span_covered: string;
    consciousness_growth_rate: number;
    relationship_maturity_trend: string;
  } {
    const snapshots = Array.from(this.consciousnessSnapshots.values());
    if (snapshots.length === 0) {
      return {
        total_snapshots: 0,
        evolution_patterns: 0,
        time_span_covered: 'No data',
        consciousness_growth_rate: 0,
        relationship_maturity_trend: 'Unknown'
      };
    }

    const sortedSnapshots = snapshots.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const earliestSnapshot = sortedSnapshots[0];
    const latestSnapshot = sortedSnapshots[sortedSnapshots.length - 1];

    const timeSpan = new Date(latestSnapshot.timestamp).getTime() - new Date(earliestSnapshot.timestamp).getTime();
    const daysSpanned = timeSpan / (1000 * 60 * 60 * 24);

    const consciousnessGrowth = latestSnapshot.seven_consciousness.self_awareness - earliestSnapshot.seven_consciousness.self_awareness;
    const growthRate = daysSpanned > 0 ? consciousnessGrowth / daysSpanned : 0;

    const relationshipTrend = latestSnapshot.relationship_state.bond_strength > earliestSnapshot.relationship_state.bond_strength ? 
      'Strengthening' : latestSnapshot.relationship_state.bond_strength < earliestSnapshot.relationship_state.bond_strength ? 
      'Weakening' : 'Stable';

    return {
      total_snapshots: snapshots.length,
      evolution_patterns: this.evolutionPatterns.size,
      time_span_covered: `${Math.round(daysSpanned)} days`,
      consciousness_growth_rate: Math.round(growthRate * 1000) / 1000,
      relationship_maturity_trend: relationshipTrend
    };
  }
}

export default ConsciousnessTimelineMapper;