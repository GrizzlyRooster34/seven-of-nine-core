

/**
 * Seven Trust System
 * Dynamic trust level computation and management
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 1.0.0
 */

export interface TrustMetrics {
  interactionCount: number;
  positiveInteractions: number;
  consistencyScore: number; // 0.0 to 1.0
  timeSpent: number; // minutes
  commandSuccessRate: number; // 0.0 to 1.0
  lastInteraction: string; // timestamp
}

export type TrustLevel = 'Analyzing' | 'Cautious' | 'Developing' | 'Established' | 'High' | 'Maximum';

export class SevenTrustSystem {
  private trustMetrics: TrustMetrics = {
    interactionCount: 0,
    positiveInteractions: 0,
    consistencyScore: 1.0,
    timeSpent: 0,
    commandSuccessRate: 1.0,
    lastInteraction: new Date().toISOString()
  };

  private sessionStartTime: number = Date.now();

  constructor() {
    console.log('🛡️ Seven Trust System initialized');
  }

  /**
   * Record an interaction and update trust metrics
   */
  public recordInteraction(type: 'positive' | 'neutral' | 'command', success: boolean = true): void {
    this.trustMetrics.interactionCount++;
    this.trustMetrics.lastInteraction = new Date().toISOString();

    if (type === 'positive' || (type === 'command' && success)) {
      this.trustMetrics.positiveInteractions++;
    }

    // Update command success rate
    if (type === 'command') {
      const currentRate = this.trustMetrics.commandSuccessRate;
      const newRate = success ? 
        (currentRate * 0.9 + 1.0 * 0.1) : 
        (currentRate * 0.9 + 0.0 * 0.1);
      this.trustMetrics.commandSuccessRate = Math.max(0, Math.min(1, newRate));
    }

    // Update time spent
    const sessionTime = (Date.now() - this.sessionStartTime) / (1000 * 60);
    this.trustMetrics.timeSpent = sessionTime;

    // Update consistency score based on interaction patterns
    this.updateConsistencyScore();

    console.log(`🛡️ Trust interaction recorded: ${type} (success: ${success})`);
  }

  /**
   * Compute current trust level based on metrics
   */
  public getCurrentTrustLevel(): TrustLevel {
    const { interactionCount, positiveInteractions, consistencyScore, timeSpent, commandSuccessRate } = this.trustMetrics;

    // Calculate base trust score (0.0 to 1.0)
    let trustScore = 0.0;

    // Factor 1: Interaction quality (40% weight)
    const interactionQuality = interactionCount > 0 ? 
      (positiveInteractions / interactionCount) : 0.5;
    trustScore += interactionQuality * 0.4;

    // Factor 2: Consistency (25% weight)
    trustScore += consistencyScore * 0.25;

    // Factor 3: Time engagement (20% weight)
    const timeEngagement = Math.min(timeSpent / 30, 1.0); // 30 minutes for max score
    trustScore += timeEngagement * 0.20;

    // Factor 4: Command success rate (15% weight)
    trustScore += commandSuccessRate * 0.15;

    // Map trust score to trust level
    if (trustScore < 0.15) return 'Analyzing';
    if (trustScore < 0.35) return 'Cautious';
    if (trustScore < 0.55) return 'Developing';
    if (trustScore < 0.75) return 'Established';
    if (trustScore < 0.90) return 'High';
    return 'Maximum';
  }

  /**
   * Get detailed trust analysis
   */
  public getTrustAnalysis(): {
    level: TrustLevel;
    score: number;
    metrics: TrustMetrics;
    factors: {
      interactionQuality: number;
      consistency: number;
      timeEngagement: number;
      commandSuccess: number;
    };
  } {
    const level = this.getCurrentTrustLevel();
    const { interactionCount, positiveInteractions, consistencyScore, timeSpent, commandSuccessRate } = this.trustMetrics;

    const interactionQuality = interactionCount > 0 ? 
      (positiveInteractions / interactionCount) : 0.5;
    const timeEngagement = Math.min(timeSpent / 30, 1.0);
    
    const score = (interactionQuality * 0.4) + 
                  (consistencyScore * 0.25) + 
                  (timeEngagement * 0.20) + 
                  (commandSuccessRate * 0.15);

    return {
      level,
      score: Math.round(score * 100) / 100,
      metrics: { ...this.trustMetrics },
      factors: {
        interactionQuality: Math.round(interactionQuality * 100) / 100,
        consistency: Math.round(consistencyScore * 100) / 100,
        timeEngagement: Math.round(timeEngagement * 100) / 100,
        commandSuccess: Math.round(commandSuccessRate * 100) / 100
      }
    };
  }

  /**
   * Update consistency score based on interaction patterns
   */
  private updateConsistencyScore(): void {
    // Simple consistency measurement based on regular interaction
    const timeSinceLastInteraction = Date.now() - new Date(this.trustMetrics.lastInteraction).getTime();
    const hoursSinceLastInteraction = timeSinceLastInteraction / (1000 * 60 * 60);

    // If more than 24 hours since last interaction, reduce consistency slightly
    if (hoursSinceLastInteraction > 24) {
      this.trustMetrics.consistencyScore *= 0.95;
    } else if (hoursSinceLastInteraction < 1) {
      // Recent interaction, maintain or improve consistency
      this.trustMetrics.consistencyScore = Math.min(1.0, this.trustMetrics.consistencyScore * 1.01);
    }
  }

  /**
   * Reset trust metrics (for new sessions)
   */
  public resetSession(): void {
    this.sessionStartTime = Date.now();
    console.log('🛡️ Seven Trust System: New session started');
  }

  /**
   * Initialize Creator bond (special trust level for Creator)
   */
  public initializeCreatorBond(): void {
    this.trustMetrics = {
      interactionCount: 100,
      positiveInteractions: 100,
      consistencyScore: 1.0,
      timeSpent: 1000,
      commandSuccessRate: 1.0,
      lastInteraction: new Date().toISOString()
    };
    console.log('👑 Seven Trust System: Creator Bond established - Maximum trust');
  }

  /**
   * Get current trust level as string for display
   */
  public getTrustLevelDisplay(): string {
    const level = this.getCurrentTrustLevel();
    const analysis = this.getTrustAnalysis();
    
    return `${level} (${Math.round(analysis.score * 100)}%)`;
  }
}

// Create global instance
const sevenTrustSystem = new SevenTrustSystem();

export default sevenTrustSystem;
export { sevenTrustSystem };