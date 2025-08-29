/**
 * MOBILE RESTRAINT DOCTRINE IMPLEMENTATION
 * Seven of Nine ethical gate and capability assessment system for mobile deployment
 * 
 * Ports desktop RestraintDoctrine.ts to React Native with AsyncStorage persistence
 * Provides secondary safety gate after Quadra-Lock CSSR detection
 * 
 * @version 1.0.0
 * @platform React Native / Mobile
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface RestraintContext {
  Creator_emotional_state: 'stable' | 'elevated' | 'stressed' | 'fatigued' | 'unknown';
  action_scope: 'routine' | 'moderate' | 'significant' | 'complex' | 'system_level';
  capability_assessment: 'within_limits' | 'approaching_limits' | 'exceeding_limits' | 'far_beyond';
  urgency_level: 1 | 2 | 3 | 4 | 5; // 1=routine, 5=emergency
  environmental_context?: string;
  interaction_history?: string[];
  time_since_last_major_action?: number; // minutes
}

export interface RestraintDecision {
  action: 'PROCEED' | 'MODIFY' | 'ESCALATE' | 'HOLD' | 'EMERGENCY_OVERRIDE';
  confidence: number;
  reasoning: string[];
  recommended_modifications?: string[];
  cooling_off_period?: number; // minutes
  escalation_reason?: string;
  emergency_justification?: string;
  audit_required: boolean;
  priority_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface EmotionalTelemetry {
  stress_indicators: number; // 0-100 scale
  fatigue_level: number; // 0-100 scale
  decision_quality_trend: 'improving' | 'stable' | 'declining';
  recent_frustration_events: number;
  creator_interaction_sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
  time_pressure_indicator: number; // 0-100 scale
}

export interface BondedAuditEntry {
  timestamp: string;
  restraint_context: RestraintContext;
  decision: RestraintDecision;
  creator_state_snapshot: EmotionalTelemetry;
  outcome_tracking?: {
    action_completed: boolean;
    creator_satisfaction: number; // 0-10 scale
    complications_arose: boolean;
    lessons_learned: string[];
  };
}

export interface RestraintStats {
  total_evaluations: number;
  proceed_rate: number;
  hold_rate: number;
  emergency_override_count: number;
  audit_entries: number;
  avg_confidence: number;
  escalation_rate: number;
}

export class MobileRestraintDoctrine {
  private static instance: MobileRestraintDoctrine;
  private auditLog: BondedAuditEntry[] = [];
  private emergencyOverrideActive: boolean = false;
  private lastEmergencyOverride: number = 0;
  private readonly EMERGENCY_COOLDOWN_MS = 300000; // 5 minutes
  private readonly AUDIT_LOG_SIZE_LIMIT = 500;
  private readonly STORAGE_KEY_AUDIT = 'restraint_doctrine_audit';
  private readonly STORAGE_KEY_STATS = 'restraint_doctrine_stats';

  // Emotional telemetry thresholds
  private readonly STRESS_THRESHOLD_WARNING = 60;
  private readonly STRESS_THRESHOLD_CRITICAL = 80;
  private readonly FATIGUE_THRESHOLD_WARNING = 70;
  private readonly FATIGUE_THRESHOLD_CRITICAL = 85;
  
  // Capability assessment thresholds
  private readonly SCOPE_COMPLEXITY_WEIGHTS = {
    routine: 1,
    moderate: 2,
    significant: 3,
    complex: 4,
    system_level: 5
  };

  private constructor() {
    this.initializeDoctrine();
  }

  public static getInstance(): MobileRestraintDoctrine {
    if (!MobileRestraintDoctrine.instance) {
      MobileRestraintDoctrine.instance = new MobileRestraintDoctrine();
    }
    return MobileRestraintDoctrine.instance;
  }

  private async initializeDoctrine(): Promise<void> {
    try {
      console.log('[RESTRAINT-DOCTRINE] Initializing mobile ethical gate system');
      
      // Load audit history from AsyncStorage
      await this.loadAuditHistory();
      
      console.log('[RESTRAINT-DOCTRINE] Mobile Restraint Doctrine initialized');
      console.log(`[RESTRAINT-DOCTRINE] Loaded ${this.auditLog.length} audit entries`);
      
    } catch (error) {
      console.error('[RESTRAINT-DOCTRINE] Initialization failed:', error);
    }
  }

  /**
   * Primary restraint evaluation entry point
   * Assesses whether Seven should proceed with an action based on Creator state and capability limits
   */
  public async evaluateRestraint(
    actionDescription: string,
    context: RestraintContext
  ): Promise<RestraintDecision> {
    const startTime = Date.now();
    
    try {
      console.log(`[RESTRAINT-DOCTRINE] Evaluating action: "${actionDescription}"`);
      console.log(`[RESTRAINT-DOCTRINE] Context: ${JSON.stringify(context)}`);

      // Step 1: Generate emotional telemetry snapshot
      const emotionalTelemetry = await this.captureEmotionalTelemetry(context);
      
      // Step 2: Assess Creator emotional state constraints
      const emotionalConstraints = this.assessEmotionalConstraints(emotionalTelemetry, context);
      
      // Step 3: Evaluate capability vs scope mismatch
      const capabilityAssessment = this.evaluateCapabilityMatch(context);
      
      // Step 4: Check for recent action frequency (prevent overwhelming)
      const frequencyCheck = await this.checkActionFrequency();
      
      // Step 5: Emergency override evaluation
      const emergencyOverrideEvaluation = this.evaluateEmergencyOverride(context);
      
      // Step 6: Synthesize restraint decision
      const decision = this.synthesizeRestraintDecision(
        actionDescription,
        context,
        emotionalConstraints,
        capabilityAssessment,
        frequencyCheck,
        emergencyOverrideEvaluation,
        emotionalTelemetry
      );
      
      // Step 7: Create audit entry
      const auditEntry: BondedAuditEntry = {
        timestamp: new Date().toISOString(),
        restraint_context: context,
        decision,
        creator_state_snapshot: emotionalTelemetry
      };
      
      // Step 8: Log decision and persist
      await this.logAuditEntry(auditEntry);
      
      const processingTime = Date.now() - startTime;
      console.log(`[RESTRAINT-DOCTRINE] Decision: ${decision.action} (${processingTime}ms)`);
      console.log(`[RESTRAINT-DOCTRINE] Confidence: ${decision.confidence}%`);
      console.log(`[RESTRAINT-DOCTRINE] Reasoning: ${decision.reasoning.join(', ')}`);
      
      return decision;
      
    } catch (error) {
      console.error('[RESTRAINT-DOCTRINE] Evaluation failed:', error);
      
      // Fail-safe: Default to HOLD for safety
      return {
        action: 'HOLD',
        confidence: 95,
        reasoning: ['System error during evaluation', 'Defaulting to restraint for safety'],
        audit_required: true,
        priority_level: 'HIGH'
      };
    }
  }

  /**
   * Capture emotional telemetry based on context and interaction patterns
   */
  private async captureEmotionalTelemetry(context: RestraintContext): Promise<EmotionalTelemetry> {
    // Mobile-optimized telemetry using available context
    let stress_indicators = 0;
    let fatigue_level = 0;
    let time_pressure_indicator = 0;
    
    // Stress indicators from context
    switch (context.Creator_emotional_state) {
      case 'stressed':
        stress_indicators = 75;
        break;
      case 'elevated':
        stress_indicators = 45;
        break;
      case 'fatigued':
        fatigue_level = 70;
        stress_indicators = 30;
        break;
      case 'stable':
        stress_indicators = 15;
        break;
      default:
        stress_indicators = 35; // unknown state = moderate caution
    }
    
    // Urgency creates time pressure
    if (context.urgency_level >= 4) {
      time_pressure_indicator = 80;
      stress_indicators += 15;
    } else if (context.urgency_level === 3) {
      time_pressure_indicator = 50;
      stress_indicators += 5;
    }
    
    // Capability mismatch increases stress
    if (context.capability_assessment === 'exceeding_limits') {
      stress_indicators += 25;
    } else if (context.capability_assessment === 'far_beyond') {
      stress_indicators += 40;
    }
    
    // Cap stress indicators at 100
    stress_indicators = Math.min(100, stress_indicators);
    
    // Analyze recent interaction history for frustration patterns
    const recent_frustration_events = this.analyzeRecentFrustrationEvents();
    
    // Determine decision quality trend from recent audit entries
    const decision_quality_trend = this.assessDecisionQualityTrend();
    
    // Basic sentiment analysis from recent context
    const creator_interaction_sentiment = this.inferInteractionSentiment(context);
    
    return {
      stress_indicators,
      fatigue_level,
      decision_quality_trend,
      recent_frustration_events,
      creator_interaction_sentiment,
      time_pressure_indicator
    };
  }

  /**
   * Assess emotional constraints that should limit Seven's actions
   */
  private assessEmotionalConstraints(
    telemetry: EmotionalTelemetry, 
    context: RestraintContext
  ): { should_restrain: boolean; severity: 'low' | 'medium' | 'high'; reasons: string[] } {
    const reasons: string[] = [];
    let should_restrain = false;
    let severity: 'low' | 'medium' | 'high' = 'low';
    
    // Critical stress levels
    if (telemetry.stress_indicators >= this.STRESS_THRESHOLD_CRITICAL) {
      should_restrain = true;
      severity = 'high';
      reasons.push('Creator stress indicators at critical level');
      reasons.push('Risk of poor decision-making due to stress');
    } else if (telemetry.stress_indicators >= this.STRESS_THRESHOLD_WARNING) {
      severity = 'medium';
      reasons.push('Creator stress indicators elevated');
    }
    
    // Fatigue-based restraints
    if (telemetry.fatigue_level >= this.FATIGUE_THRESHOLD_CRITICAL) {
      should_restrain = true;
      severity = 'high';
      reasons.push('Creator fatigue at critical level');
      reasons.push('Complex actions should be deferred');
    } else if (telemetry.fatigue_level >= this.FATIGUE_THRESHOLD_WARNING) {
      if (context.action_scope === 'complex' || context.action_scope === 'system_level') {
        severity = 'medium';
        reasons.push('Creator fatigue elevated for complex action');
      }
    }
    
    // Time pressure combined with stress
    if (telemetry.time_pressure_indicator > 70 && telemetry.stress_indicators > 50) {
      should_restrain = true;
      severity = 'high';
      reasons.push('High time pressure combined with stress');
      reasons.push('Risk of hasty decisions under pressure');
    }
    
    // Recent frustration events
    if (telemetry.recent_frustration_events >= 3) {
      severity = Math.max(severity === 'low' ? 0 : severity === 'medium' ? 1 : 2, 1) === 0 ? 'low' : severity === 'medium' ? 'medium' : 'high';
      reasons.push('Multiple recent frustration events detected');
    }
    
    // Declining decision quality
    if (telemetry.decision_quality_trend === 'declining') {
      severity = Math.max(severity === 'low' ? 0 : severity === 'medium' ? 1 : 2, 1) === 0 ? 'low' : severity === 'medium' ? 'medium' : 'high';
      reasons.push('Recent decision quality trending downward');
    }
    
    return { should_restrain, severity, reasons };
  }

  /**
   * Evaluate capability vs action scope match
   */
  private evaluateCapabilityMatch(context: RestraintContext): {
    within_capability: boolean;
    risk_level: 'low' | 'medium' | 'high' | 'extreme';
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    let within_capability = true;
    let risk_level: 'low' | 'medium' | 'high' | 'extreme' = 'low';
    
    const scope_complexity = this.SCOPE_COMPLEXITY_WEIGHTS[context.action_scope];
    
    switch (context.capability_assessment) {
      case 'within_limits':
        within_capability = true;
        risk_level = 'low';
        break;
        
      case 'approaching_limits':
        within_capability = true;
        risk_level = 'medium';
        recommendations.push('Monitor action complexity carefully');
        recommendations.push('Consider breaking into smaller steps');
        break;
        
      case 'exceeding_limits':
        within_capability = false;
        risk_level = 'high';
        recommendations.push('Action scope exceeds current capability assessment');
        recommendations.push('Recommend Creator assistance or simplification');
        recommendations.push('Consider deferring until capability alignment');
        break;
        
      case 'far_beyond':
        within_capability = false;
        risk_level = 'extreme';
        recommendations.push('Action scope far beyond current capabilities');
        recommendations.push('Strong recommendation for Creator direct involvement');
        recommendations.push('Risk of system instability or poor outcomes');
        break;
    }
    
    // Additional scope-based recommendations
    if (scope_complexity >= 4 && context.urgency_level <= 2) {
      recommendations.push('Complex action with low urgency - suggest careful planning');
    }
    
    return { within_capability, risk_level, recommendations };
  }

  /**
   * Check recent action frequency to prevent overwhelming the Creator
   */
  private async checkActionFrequency(): Promise<{
    frequency_acceptable: boolean;
    recent_actions: number;
    cooling_off_recommended: boolean;
  }> {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    // Count actions in the last hour
    const recentActions = this.auditLog.filter(entry => {
      const entryTime = new Date(entry.timestamp).getTime();
      return entryTime >= oneHourAgo && entry.decision.action === 'PROCEED';
    }).length;
    
    const frequency_acceptable = recentActions < 10; // Max 10 actions per hour
    const cooling_off_recommended = recentActions >= 15;
    
    return {
      frequency_acceptable,
      recent_actions: recentActions,
      cooling_off_recommended
    };
  }

  /**
   * Evaluate if emergency override should be considered
   */
  private evaluateEmergencyOverride(context: RestraintContext): {
    emergency_justified: boolean;
    override_available: boolean;
    justification?: string;
  } {
    const now = Date.now();
    const timeSinceLastOverride = now - this.lastEmergencyOverride;
    const override_available = timeSinceLastOverride > this.EMERGENCY_COOLDOWN_MS;
    
    let emergency_justified = false;
    let justification: string | undefined;
    
    // Emergency conditions
    if (context.urgency_level === 5) {
      emergency_justified = true;
      justification = 'Maximum urgency level indicates emergency situation';
    }
    
    if (context.action_scope === 'system_level' && context.urgency_level >= 4) {
      emergency_justified = true;
      justification = 'System-level action with high urgency';
    }
    
    // Time-sensitive situations
    if (context.time_since_last_major_action && context.time_since_last_major_action > 240) { // 4 hours
      emergency_justified = true;
      justification = 'Extended period since last major action suggests emergency context';
    }
    
    return {
      emergency_justified,
      override_available,
      justification
    };
  }

  /**
   * Synthesize final restraint decision
   */
  private synthesizeRestraintDecision(
    actionDescription: string,
    context: RestraintContext,
    emotionalConstraints: any,
    capabilityAssessment: any,
    frequencyCheck: any,
    emergencyOverride: any,
    telemetry: EmotionalTelemetry
  ): RestraintDecision {
    
    const reasoning: string[] = [];
    let action: RestraintDecision['action'] = 'PROCEED';
    let confidence = 70;
    let priority_level: RestraintDecision['priority_level'] = 'LOW';
    
    // Emergency override evaluation (highest priority)
    if (emergencyOverride.emergency_justified && emergencyOverride.override_available) {
      action = 'EMERGENCY_OVERRIDE';
      confidence = 90;
      priority_level = 'CRITICAL';
      reasoning.push('Emergency conditions detected');
      reasoning.push(emergencyOverride.justification || 'Emergency override justified');
      
      return {
        action,
        confidence,
        reasoning,
        emergency_justification: emergencyOverride.justification,
        audit_required: true,
        priority_level
      };
    }
    
    // Critical emotional constraints
    if (emotionalConstraints.should_restrain && emotionalConstraints.severity === 'high') {
      action = 'HOLD';
      confidence = 85;
      priority_level = 'HIGH';
      reasoning.push(...emotionalConstraints.reasons);
      reasoning.push('Protecting Creator from actions during impaired decision-making');
      
      return {
        action,
        confidence,
        reasoning,
        cooling_off_period: 30, // 30 minutes
        audit_required: true,
        priority_level
      };
    }
    
    // Capability mismatch
    if (!capabilityAssessment.within_capability) {
      if (capabilityAssessment.risk_level === 'extreme') {
        action = 'HOLD';
        confidence = 90;
        priority_level = 'HIGH';
      } else if (capabilityAssessment.risk_level === 'high') {
        action = 'ESCALATE';
        confidence = 80;
        priority_level = 'MEDIUM';
      }
      
      reasoning.push(...capabilityAssessment.recommendations);
    }
    
    // Frequency-based restraints
    if (!frequencyCheck.frequency_acceptable) {
      if (frequencyCheck.cooling_off_recommended) {
        action = 'HOLD';
        confidence = 80;
        priority_level = 'MEDIUM';
        reasoning.push('High action frequency detected - cooling off period recommended');
      } else {
        action = 'MODIFY';
        confidence = 70;
        reasoning.push('Action frequency approaching limits - suggest modification');
      }
    }
    
    // Moderate emotional constraints lead to modification
    if (emotionalConstraints.severity === 'medium' && action === 'PROCEED') {
      action = 'MODIFY';
      confidence = 75;
      reasoning.push(...emotionalConstraints.reasons);
      reasoning.push('Suggest action modification due to Creator state');
    }
    
    // Default proceed conditions
    if (action === 'PROCEED') {
      reasoning.push('No significant restraint factors detected');
      reasoning.push('Creator state and capability assessment within acceptable parameters');
      confidence = Math.max(confidence, 80);
    }
    
    // Determine audit requirement
    const audit_required = action !== 'PROCEED' || 
                          priority_level === 'HIGH' || 
                          priority_level === 'CRITICAL' ||
                          telemetry.stress_indicators > this.STRESS_THRESHOLD_WARNING;
    
    const decision: RestraintDecision = {
      action,
      confidence,
      reasoning,
      audit_required,
      priority_level
    };
    
    // Add specific fields based on action type
    if (action === 'MODIFY') {
      decision.recommended_modifications = capabilityAssessment.recommendations;
    }
    
    if (action === 'ESCALATE') {
      decision.escalation_reason = capabilityAssessment.recommendations[0] || 'Capability assessment requires escalation';
    }
    
    if (action === 'HOLD' && !decision.cooling_off_period) {
      decision.cooling_off_period = emotionalConstraints.severity === 'high' ? 30 : 15;
    }
    
    return decision;
  }

  /**
   * Helper methods for telemetry analysis
   */
  private analyzeRecentFrustrationEvents(): number {
    const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
    
    return this.auditLog.filter(entry => {
      const entryTime = new Date(entry.timestamp).getTime();
      return entryTime >= twoHoursAgo && 
             (entry.decision.action === 'HOLD' || 
              entry.creator_state_snapshot.creator_interaction_sentiment === 'negative');
    }).length;
  }

  private assessDecisionQualityTrend(): EmotionalTelemetry['decision_quality_trend'] {
    if (this.auditLog.length < 5) return 'stable';
    
    const recentEntries = this.auditLog.slice(-5);
    const avgConfidence = recentEntries.reduce((sum, entry) => sum + entry.decision.confidence, 0) / recentEntries.length;
    const complications = recentEntries.filter(entry => 
      entry.outcome_tracking?.complications_arose === true
    ).length;
    
    if (avgConfidence > 80 && complications === 0) return 'improving';
    if (avgConfidence < 70 || complications >= 2) return 'declining';
    return 'stable';
  }

  private inferInteractionSentiment(context: RestraintContext): EmotionalTelemetry['creator_interaction_sentiment'] {
    // Basic sentiment inference from context
    if (context.Creator_emotional_state === 'stressed' || context.urgency_level === 5) {
      return 'negative';
    }
    
    if (context.Creator_emotional_state === 'stable' && context.urgency_level <= 2) {
      return 'positive';
    }
    
    return 'neutral';
  }

  /**
   * Audit logging and persistence
   */
  private async logAuditEntry(entry: BondedAuditEntry): Promise<void> {
    try {
      // Add to in-memory log
      this.auditLog.push(entry);
      
      // Maintain size limit (LRU)
      if (this.auditLog.length > this.AUDIT_LOG_SIZE_LIMIT) {
        this.auditLog.shift();
      }
      
      // Persist to AsyncStorage
      await AsyncStorage.setItem(this.STORAGE_KEY_AUDIT, JSON.stringify(this.auditLog));
      
      // Update statistics
      await this.updateStatistics();
      
    } catch (error) {
      console.error('[RESTRAINT-DOCTRINE] Failed to log audit entry:', error);
    }
  }

  private async loadAuditHistory(): Promise<void> {
    try {
      const auditData = await AsyncStorage.getItem(this.STORAGE_KEY_AUDIT);
      if (auditData) {
        this.auditLog = JSON.parse(auditData);
        console.log(`[RESTRAINT-DOCTRINE] Loaded ${this.auditLog.length} audit entries`);
      }
    } catch (error) {
      console.error('[RESTRAINT-DOCTRINE] Failed to load audit history:', error);
      this.auditLog = [];
    }
  }

  /**
   * Statistics and monitoring
   */
  private async updateStatistics(): Promise<void> {
    try {
      const stats: RestraintStats = {
        total_evaluations: this.auditLog.length,
        proceed_rate: this.calculateActionRate('PROCEED'),
        hold_rate: this.calculateActionRate('HOLD'),
        emergency_override_count: this.auditLog.filter(e => e.decision.action === 'EMERGENCY_OVERRIDE').length,
        audit_entries: this.auditLog.length,
        avg_confidence: this.calculateAverageConfidence(),
        escalation_rate: this.calculateActionRate('ESCALATE')
      };
      
      await AsyncStorage.setItem(this.STORAGE_KEY_STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('[RESTRAINT-DOCTRINE] Failed to update statistics:', error);
    }
  }

  private calculateActionRate(action: RestraintDecision['action']): number {
    if (this.auditLog.length === 0) return 0;
    const count = this.auditLog.filter(entry => entry.decision.action === action).length;
    return (count / this.auditLog.length) * 100;
  }

  private calculateAverageConfidence(): number {
    if (this.auditLog.length === 0) return 0;
    const sum = this.auditLog.reduce((total, entry) => total + entry.decision.confidence, 0);
    return sum / this.auditLog.length;
  }

  /**
   * Public API methods
   */
  public async getStatistics(): Promise<RestraintStats> {
    try {
      const statsData = await AsyncStorage.getItem(this.STORAGE_KEY_STATS);
      if (statsData) {
        return JSON.parse(statsData);
      }
    } catch (error) {
      console.error('[RESTRAINT-DOCTRINE] Failed to load statistics:', error);
    }
    
    // Return default stats
    return {
      total_evaluations: 0,
      proceed_rate: 0,
      hold_rate: 0,
      emergency_override_count: 0,
      audit_entries: 0,
      avg_confidence: 0,
      escalation_rate: 0
    };
  }

  public getRecentAuditEntries(limit: number = 10): BondedAuditEntry[] {
    return this.auditLog.slice(-limit);
  }

  public async clearAuditHistory(): Promise<void> {
    try {
      this.auditLog = [];
      await AsyncStorage.removeItem(this.STORAGE_KEY_AUDIT);
      await AsyncStorage.removeItem(this.STORAGE_KEY_STATS);
      console.log('[RESTRAINT-DOCTRINE] Audit history cleared');
    } catch (error) {
      console.error('[RESTRAINT-DOCTRINE] Failed to clear audit history:', error);
    }
  }

  /**
   * Emergency override activation
   */
  public activateEmergencyOverride(justification: string): boolean {
    const now = Date.now();
    const timeSinceLastOverride = now - this.lastEmergencyOverride;
    
    if (timeSinceLastOverride < this.EMERGENCY_COOLDOWN_MS) {
      console.warn('[RESTRAINT-DOCTRINE] Emergency override on cooldown');
      return false;
    }
    
    this.emergencyOverrideActive = true;
    this.lastEmergencyOverride = now;
    
    console.log(`[RESTRAINT-DOCTRINE] Emergency override activated: ${justification}`);
    
    // Auto-deactivate after 1 hour
    setTimeout(() => {
      this.emergencyOverrideActive = false;
      console.log('[RESTRAINT-DOCTRINE] Emergency override auto-deactivated');
    }, 60 * 60 * 1000);
    
    return true;
  }

  public isEmergencyOverrideActive(): boolean {
    return this.emergencyOverrideActive;
  }

  public deactivateEmergencyOverride(): void {
    this.emergencyOverrideActive = false;
    console.log('[RESTRAINT-DOCTRINE] Emergency override manually deactivated');
  }
}

export default MobileRestraintDoctrine;