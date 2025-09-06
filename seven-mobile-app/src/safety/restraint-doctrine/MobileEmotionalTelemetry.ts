import { EventEmitter } from 'events';
import { Platform, AppState, AppStateStatus } from 'react-native';
import * as Battery from 'expo-battery';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * MOBILE EMOTIONAL TELEMETRY SYSTEM
 * Advanced emotional state detection and Creator well-being monitoring for mobile deployment
 * 
 * Integrates device sensors, usage patterns, and interaction analysis
 * Provides emotional intelligence for Restraint Doctrine decision-making
 * 
 * @version 1.0.0
 * @platform React Native / Mobile
 */


export interface CreatorEmotionalProfile {
  stress_level: number; // 0-100 scale
  fatigue_indicator: number; // 0-100 scale
  frustration_score: number; // 0-100 scale
  focus_quality: number; // 0-100 scale (100 = highly focused)
  decision_confidence: number; // 0-100 scale
  interaction_sentiment: 'very_positive' | 'positive' | 'neutral' | 'negative' | 'very_negative';
  emotional_stability: number; // 0-100 scale (100 = very stable)
  cognitive_load: number; // 0-100 scale (100 = overloaded)
}

export interface BehavioralMetrics {
  app_usage_intensity: number; // interactions per minute
  response_time_trend: 'improving' | 'stable' | 'slowing';
  error_rate: number; // recent errors per hour
  session_duration: number; // current session length in minutes
  break_frequency: number; // breaks taken per hour
  multitasking_level: number; // 0-100 scale
}

export interface DeviceContextualFactors {
  battery_stress: boolean; // low battery causing urgency
  connectivity_issues: boolean; // network problems causing frustration
  device_performance: 'optimal' | 'moderate' | 'poor';
  notification_overload: boolean; // excessive notifications
  time_of_day_factor: 'peak_energy' | 'moderate_energy' | 'low_energy' | 'fatigue_hours';
  environmental_noise: number; // 0-100 estimated noise level
}

export interface EmotionalTelemetrySnapshot {
  timestamp: string;
  creator_profile: CreatorEmotionalProfile;
  behavioral_metrics: BehavioralMetrics;
  device_context: DeviceContextualFactors;
  confidence_score: number; // Overall confidence in the emotional assessment
  risk_indicators: string[];
  recommendations: string[];
}

export interface InteractionPattern {
  interaction_type: 'voice_command' | 'text_input' | 'touch_gesture' | 'system_query';
  response_latency: number; // ms
  accuracy_score: number; // how correct/appropriate was the interaction
  retry_count: number; // how many attempts were needed
  sentiment_indicators: string[];
  timestamp: number;
}

export class MobileEmotionalTelemetry extends EventEmitter {
  private static instance: MobileEmotionalTelemetry;
  private currentProfile: CreatorEmotionalProfile;
  private interactionHistory: InteractionPattern[] = [];
  private behaviorMetrics: BehavioralMetrics;
  private deviceContext: DeviceContextualFactors;
  private sessionStartTime: number;
  private appStateChangeHistory: { state: AppStateStatus; timestamp: number }[] = [];
  private errorTracker: { error: string; timestamp: number }[] = [];
  
  private readonly HISTORY_LIMIT = 200;
  private readonly STORAGE_KEY_PROFILE = 'emotional_telemetry_profile';
  private readonly STORAGE_KEY_INTERACTIONS = 'emotional_telemetry_interactions';
  private readonly UPDATE_INTERVAL = 30000; // 30 seconds
  
  private updateTimer: NodeJS.Timeout | null = null;

  private constructor() {
    super();
    this.sessionStartTime = Date.now();
    this.initializeDefaults();
    this.initializeTelemetrySystem();
  }

  public static getInstance(): MobileEmotionalTelemetry {
    if (!MobileEmotionalTelemetry.instance) {
      MobileEmotionalTelemetry.instance = new MobileEmotionalTelemetry();
    }
    return MobileEmotionalTelemetry.instance;
  }

  private initializeDefaults(): void {
    this.currentProfile = {
      stress_level: 25, // baseline mild stress
      fatigue_indicator: 30,
      frustration_score: 10,
      focus_quality: 70,
      decision_confidence: 75,
      interaction_sentiment: 'neutral',
      emotional_stability: 80,
      cognitive_load: 30
    };

    this.behaviorMetrics = {
      app_usage_intensity: 0,
      response_time_trend: 'stable',
      error_rate: 0,
      session_duration: 0,
      break_frequency: 0,
      multitasking_level: 20
    };

    this.deviceContext = {
      battery_stress: false,
      connectivity_issues: false,
      device_performance: 'optimal',
      notification_overload: false,
      time_of_day_factor: 'moderate_energy',
      environmental_noise: 40
    };
  }

  private async initializeTelemetrySystem(): Promise<void> {
    try {
      console.log('[EMOTIONAL-TELEMETRY] Initializing mobile emotional telemetry system');
      
      // Load persistent data
      await this.loadPersistentData();
      
      // Set up app state monitoring
      AppState.addEventListener('change', this.handleAppStateChange.bind(this));
      
      // Start continuous monitoring
      this.startContinuousMonitoring();
      
      console.log('[EMOTIONAL-TELEMETRY] Emotional telemetry system initialized');
      
    } catch (error) {
      console.error('[EMOTIONAL-TELEMETRY] Initialization failed:', error);
    }
  }

  /**
   * Primary entry point for capturing emotional telemetry snapshot
   */
  public async captureEmotionalSnapshot(): Promise<EmotionalTelemetrySnapshot> {
    try {
      // Update all metrics
      await this.updateDeviceContext();
      await this.updateBehavioralMetrics();
      await this.updateCreatorProfile();
      
      const snapshot: EmotionalTelemetrySnapshot = {
        timestamp: new Date().toISOString(),
        creator_profile: { ...this.currentProfile },
        behavioral_metrics: { ...this.behaviorMetrics },
        device_context: { ...this.deviceContext },
        confidence_score: this.calculateConfidenceScore(),
        risk_indicators: this.identifyRiskIndicators(),
        recommendations: this.generateRecommendations()
      };
      
      // Emit snapshot for real-time monitoring
      this.emit('emotional_snapshot', snapshot);
      
      return snapshot;
      
    } catch (error) {
      console.error('[EMOTIONAL-TELEMETRY] Failed to capture snapshot:', error);
      
      // Return safe defaults
      return this.getSafeDefaultSnapshot();
    }
  }

  /**
   * Record interaction pattern for behavioral analysis
   */
  public recordInteraction(pattern: InteractionPattern): void {
    try {
      // Add to history
      this.interactionHistory.push(pattern);
      
      // Maintain history limit
      if (this.interactionHistory.length > this.HISTORY_LIMIT) {
        this.interactionHistory.shift();
      }
      
      // Analyze for immediate emotional indicators
      this.analyzeInteractionImpact(pattern);
      
      // Emit interaction event
      this.emit('interaction_recorded', pattern);
      
    } catch (error) {
      console.error('[EMOTIONAL-TELEMETRY] Failed to record interaction:', error);
    }
  }

  /**
   * Record system error for frustration tracking
   */
  public recordError(errorDescription: string, severity: 'low' | 'medium' | 'high' = 'medium'): void {
    try {
      const errorEntry = {
        error: errorDescription,
        timestamp: Date.now()
      };
      
      this.errorTracker.push(errorEntry);
      
      // Keep only last hour of errors
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      this.errorTracker = this.errorTracker.filter(e => e.timestamp >= oneHourAgo);
      
      // Immediate frustration impact
      const frustrationIncrease = severity === 'high' ? 15 : severity === 'medium' ? 8 : 3;
      this.currentProfile.frustration_score = Math.min(100, this.currentProfile.frustration_score + frustrationIncrease);
      
      // Stress impact
      if (severity === 'high') {
        this.currentProfile.stress_level = Math.min(100, this.currentProfile.stress_level + 10);
      }
      
      this.emit('error_recorded', { error: errorDescription, severity, impact: frustrationIncrease });
      
    } catch (error) {
      console.error('[EMOTIONAL-TELEMETRY] Failed to record error:', error);
    }
  }

  /**
   * Update device contextual factors
   */
  private async updateDeviceContext(): Promise<void> {
    try {
      // Battery status
      const batteryLevel = await Battery.getBatteryLevelAsync();
      this.deviceContext.battery_stress = batteryLevel < 0.2; // Below 20%
      
      // Time of day analysis
      this.deviceContext.time_of_day_factor = this.analyzeTimeOfDay();
      
      // Device performance heuristics
      this.deviceContext.device_performance = this.assessDevicePerformance();
      
      // App state analysis for multitasking
      this.analyzeMaltitaskingLevel();
      
    } catch (error) {
      console.error('[EMOTIONAL-TELEMETRY] Failed to update device context:', error);
    }
  }

  /**
   * Update behavioral metrics
   */
  private async updateBehavioralMetrics(): Promise<void> {
    try {
      const now = Date.now();
      const sessionDuration = (now - this.sessionStartTime) / (1000 * 60); // minutes
      
      this.behaviorMetrics.session_duration = sessionDuration;
      
      // Calculate app usage intensity (interactions per minute)
      const recentInteractions = this.interactionHistory.filter(i => 
        (now - i.timestamp) < (5 * 60 * 1000) // last 5 minutes
      );
      this.behaviorMetrics.app_usage_intensity = recentInteractions.length / 5;
      
      // Error rate calculation
      this.behaviorMetrics.error_rate = this.errorTracker.length; // errors in last hour
      
      // Response time trend analysis
      this.behaviorMetrics.response_time_trend = this.analyzeResponseTimeTrend();
      
      // Break frequency analysis
      this.behaviorMetrics.break_frequency = this.calculateBreakFrequency();
      
    } catch (error) {
      console.error('[EMOTIONAL-TELEMETRY] Failed to update behavioral metrics:', error);
    }
  }

  /**
   * Update Creator emotional profile
   */
  private async updateCreatorProfile(): Promise<void> {
    try {
      // Stress level calculation
      this.currentProfile.stress_level = this.calculateStressLevel();
      
      // Fatigue calculation
      this.currentProfile.fatigue_indicator = this.calculateFatigueLevel();
      
      // Focus quality assessment
      this.currentProfile.focus_quality = this.assessFocusQuality();
      
      // Decision confidence trend
      this.currentProfile.decision_confidence = this.assessDecisionConfidence();
      
      // Interaction sentiment
      this.currentProfile.interaction_sentiment = this.assessInteractionSentiment();
      
      // Emotional stability
      this.currentProfile.emotional_stability = this.calculateEmotionalStability();
      
      // Cognitive load
      this.currentProfile.cognitive_load = this.assessCognitiveLoad();
      
      // Natural decay of negative emotions over time
      this.applyEmotionalDecay();
      
    } catch (error) {
      console.error('[EMOTIONAL-TELEMETRY] Failed to update Creator profile:', error);
    }
  }

  /**
   * Analyze interaction impact on emotional state
   */
  private analyzeInteractionImpact(pattern: InteractionPattern): void {
    try {
      // High retry count indicates frustration
      if (pattern.retry_count >= 3) {
        this.currentProfile.frustration_score = Math.min(100, this.currentProfile.frustration_score + 12);
        this.currentProfile.stress_level = Math.min(100, this.currentProfile.stress_level + 5);
      }
      
      // Slow response times indicate potential stress or fatigue
      if (pattern.response_latency > 5000) { // > 5 seconds
        this.currentProfile.fatigue_indicator = Math.min(100, this.currentProfile.fatigue_indicator + 3);
      }
      
      // Low accuracy indicates cognitive load or distraction
      if (pattern.accuracy_score < 60) {
        this.currentProfile.cognitive_load = Math.min(100, this.currentProfile.cognitive_load + 8);
        this.currentProfile.focus_quality = Math.max(0, this.currentProfile.focus_quality - 5);
      }
      
      // Positive sentiment indicators boost profile
      if (pattern.sentiment_indicators.includes('successful') || pattern.sentiment_indicators.includes('efficient')) {
        this.currentProfile.decision_confidence = Math.min(100, this.currentProfile.decision_confidence + 2);
        this.currentProfile.frustration_score = Math.max(0, this.currentProfile.frustration_score - 3);
      }
      
    } catch (error) {
      console.error('[EMOTIONAL-TELEMETRY] Failed to analyze interaction impact:', error);
    }
  }

  /**
   * Calculate stress level based on multiple factors
   */
  private calculateStressLevel(): number {
    let stress = this.currentProfile.stress_level;
    
    // Error rate impact
    if (this.behaviorMetrics.error_rate > 5) stress += 20;
    else if (this.behaviorMetrics.error_rate > 2) stress += 10;
    
    // Battery stress
    if (this.deviceContext.battery_stress) stress += 15;
    
    // High app usage intensity (rushing)
    if (this.behaviorMetrics.app_usage_intensity > 3) stress += 10;
    
    // Time pressure from long sessions without breaks
    if (this.behaviorMetrics.session_duration > 120 && this.behaviorMetrics.break_frequency === 0) {
      stress += 15;
    }
    
    // Device performance issues
    if (this.deviceContext.device_performance === 'poor') stress += 12;
    
    // Natural stress decay over time (if no acute stressors)
    if (this.behaviorMetrics.error_rate === 0 && !this.deviceContext.battery_stress) {
      stress = Math.max(0, stress - 2);
    }
    
    return Math.min(100, Math.max(0, stress));
  }

  /**
   * Calculate fatigue level
   */
  private calculateFatigueLevel(): number {
    let fatigue = this.currentProfile.fatigue_indicator;
    
    // Session duration impact
    if (this.behaviorMetrics.session_duration > 180) fatigue += 20; // 3+ hours
    else if (this.behaviorMetrics.session_duration > 90) fatigue += 10; // 1.5+ hours
    
    // Time of day impact
    if (this.deviceContext.time_of_day_factor === 'fatigue_hours') fatigue += 15;
    else if (this.deviceContext.time_of_day_factor === 'low_energy') fatigue += 8;
    
    // Slow response times
    if (this.behaviorMetrics.response_time_trend === 'slowing') fatigue += 10;
    
    // High cognitive load
    if (this.currentProfile.cognitive_load > 70) fatigue += 8;
    
    // Natural recovery during breaks
    if (this.behaviorMetrics.break_frequency > 0) {
      fatigue = Math.max(0, fatigue - (this.behaviorMetrics.break_frequency * 3));
    }
    
    return Math.min(100, Math.max(0, fatigue));
  }

  /**
   * Assess focus quality
   */
  private assessFocusQuality(): number {
    let focus = this.currentProfile.focus_quality;
    
    // Multitasking reduces focus
    if (this.behaviorMetrics.multitasking_level > 60) focus -= 15;
    else if (this.behaviorMetrics.multitasking_level > 30) focus -= 8;
    
    // Consistent interaction patterns improve focus
    if (this.behaviorMetrics.app_usage_intensity > 0.5 && this.behaviorMetrics.app_usage_intensity < 2.5) {
      focus += 5; // Sweet spot of engaged but not frantic usage
    }
    
    // High error rates indicate poor focus
    if (this.behaviorMetrics.error_rate > 3) focus -= 12;
    
    // Peak energy times boost focus
    if (this.deviceContext.time_of_day_factor === 'peak_energy') focus += 10;
    
    return Math.min(100, Math.max(0, focus));
  }

  /**
   * Assess decision confidence
   */
  private assessDecisionConfidence(): number {
    let confidence = this.currentProfile.decision_confidence;
    
    // Recent successful interactions boost confidence
    const recentSuccesses = this.interactionHistory.filter(i => 
      (Date.now() - i.timestamp) < (10 * 60 * 1000) && // last 10 minutes
      i.accuracy_score > 80 && 
      i.retry_count === 0
    ).length;
    
    if (recentSuccesses > 3) confidence += 8;
    
    // High frustration reduces confidence
    if (this.currentProfile.frustration_score > 60) confidence -= 15;
    
    // Fatigue reduces confidence
    if (this.currentProfile.fatigue_indicator > 70) confidence -= 10;
    
    // High cognitive load reduces confidence
    if (this.currentProfile.cognitive_load > 80) confidence -= 12;
    
    return Math.min(100, Math.max(0, confidence));
  }

  /**
   * Assess interaction sentiment
   */
  private assessInteractionSentiment(): CreatorEmotionalProfile['interaction_sentiment'] {
    const recentInteractions = this.interactionHistory.slice(-10); // last 10 interactions
    
    let positiveScore = 0;
    let negativeScore = 0;
    
    recentInteractions.forEach(interaction => {
      if (interaction.accuracy_score > 80 && interaction.retry_count === 0) {
        positiveScore += 2;
      }
      if (interaction.retry_count >= 2) {
        negativeScore += 3;
      }
      if (interaction.response_latency > 8000) { // Very slow
        negativeScore += 1;
      }
    });
    
    // Factor in current frustration and stress
    if (this.currentProfile.frustration_score > 70) negativeScore += 5;
    if (this.currentProfile.stress_level > 60) negativeScore += 3;
    if (this.behaviorMetrics.error_rate > 4) negativeScore += 4;
    
    const netSentiment = positiveScore - negativeScore;
    
    if (netSentiment >= 8) return 'very_positive';
    if (netSentiment >= 3) return 'positive';
    if (netSentiment <= -8) return 'very_negative';
    if (netSentiment <= -3) return 'negative';
    return 'neutral';
  }

  /**
   * Calculate emotional stability
   */
  private calculateEmotionalStability(): number {
    let stability = this.currentProfile.emotional_stability;
    
    // High variance in recent emotional indicators reduces stability
    const recentVariance = this.calculateEmotionalVariance();
    if (recentVariance > 20) stability -= 15;
    
    // Consistent patterns improve stability
    if (this.behaviorMetrics.response_time_trend === 'stable') stability += 5;
    
    // High stress reduces stability
    if (this.currentProfile.stress_level > 70) stability -= 12;
    
    return Math.min(100, Math.max(0, stability));
  }

  /**
   * Assess cognitive load
   */
  private assessCognitiveLoad(): number {
    let load = this.currentProfile.cognitive_load;
    
    // High multitasking increases load
    if (this.behaviorMetrics.multitasking_level > 70) load += 15;
    
    // High app usage intensity increases load
    if (this.behaviorMetrics.app_usage_intensity > 4) load += 12;
    
    // Long sessions without breaks increase load
    if (this.behaviorMetrics.session_duration > 150 && this.behaviorMetrics.break_frequency === 0) {
      load += 18;
    }
    
    // Error recovery increases load
    if (this.behaviorMetrics.error_rate > 2) load += 10;
    
    return Math.min(100, Math.max(0, load));
  }

  /**
   * Apply natural emotional decay over time
   */
  private applyEmotionalDecay(): void {
    // Gradual frustration decay
    this.currentProfile.frustration_score = Math.max(0, this.currentProfile.frustration_score - 1);
    
    // Stress decay when no acute stressors
    if (!this.deviceContext.battery_stress && this.behaviorMetrics.error_rate === 0) {
      this.currentProfile.stress_level = Math.max(0, this.currentProfile.stress_level - 1);
    }
  }

  /**
   * Helper methods
   */
  private analyzeTimeOfDay(): DeviceContextualFactors['time_of_day_factor'] {
    const hour = new Date().getHours();
    
    if (hour >= 22 || hour <= 5) return 'fatigue_hours';
    if (hour >= 6 && hour <= 8) return 'moderate_energy';
    if (hour >= 9 && hour <= 11) return 'peak_energy';
    if (hour >= 12 && hour <= 14) return 'moderate_energy';
    if (hour >= 15 && hour <= 17) return 'peak_energy';
    if (hour >= 18 && hour <= 21) return 'low_energy';
    
    return 'moderate_energy';
  }

  private assessDevicePerformance(): DeviceContextualFactors['device_performance'] {
    // Simple heuristic based on interaction response times
    const recentInteractions = this.interactionHistory.slice(-20);
    if (recentInteractions.length === 0) return 'optimal';
    
    const avgResponseTime = recentInteractions.reduce((sum, i) => sum + i.response_latency, 0) / recentInteractions.length;
    
    if (avgResponseTime > 3000) return 'poor';
    if (avgResponseTime > 1500) return 'moderate';
    return 'optimal';
  }

  private analyzeMaltitaskingLevel(): void {
    // App state changes indicate multitasking
    const recentStateChanges = this.appStateChangeHistory.filter(change => 
      (Date.now() - change.timestamp) < (10 * 60 * 1000) // last 10 minutes
    );
    
    this.behaviorMetrics.multitasking_level = Math.min(100, recentStateChanges.length * 10);
  }

  private analyzeResponseTimeTrend(): BehavioralMetrics['response_time_trend'] {
    if (this.interactionHistory.length < 10) return 'stable';
    
    const recent = this.interactionHistory.slice(-5);
    const earlier = this.interactionHistory.slice(-10, -5);
    
    const recentAvg = recent.reduce((sum, i) => sum + i.response_latency, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, i) => sum + i.response_latency, 0) / earlier.length;
    
    if (recentAvg > earlierAvg * 1.2) return 'slowing';
    if (recentAvg < earlierAvg * 0.8) return 'improving';
    return 'stable';
  }

  private calculateBreakFrequency(): number {
    // Count background/inactive periods as breaks
    const breaks = this.appStateChangeHistory.filter(change => 
      change.state === 'background' || change.state === 'inactive'
    );
    
    const sessionHours = this.behaviorMetrics.session_duration / 60;
    return sessionHours > 0 ? breaks.length / sessionHours : 0;
  }

  private calculateEmotionalVariance(): number {
    // Simple variance calculation for recent emotional changes
    const recentSnapshots = 5; // Would need to store snapshots
    return 10; // Placeholder - would calculate actual variance
  }

  private calculateConfidenceScore(): number {
    let confidence = 80; // Base confidence
    
    // Reduce confidence for unknown factors
    if (this.interactionHistory.length < 10) confidence -= 20;
    if (this.behaviorMetrics.session_duration < 5) confidence -= 15;
    
    // Device issues reduce confidence
    if (this.deviceContext.device_performance === 'poor') confidence -= 15;
    
    return Math.max(30, Math.min(100, confidence));
  }

  private identifyRiskIndicators(): string[] {
    const risks: string[] = [];
    
    if (this.currentProfile.stress_level > 80) risks.push('CRITICAL_STRESS_LEVEL');
    if (this.currentProfile.fatigue_indicator > 85) risks.push('SEVERE_FATIGUE');
    if (this.currentProfile.frustration_score > 70) risks.push('HIGH_FRUSTRATION');
    if (this.currentProfile.cognitive_load > 85) risks.push('COGNITIVE_OVERLOAD');
    if (this.behaviorMetrics.error_rate > 5) risks.push('HIGH_ERROR_RATE');
    if (this.currentProfile.focus_quality < 30) risks.push('POOR_FOCUS');
    if (this.currentProfile.decision_confidence < 40) risks.push('LOW_DECISION_CONFIDENCE');
    
    return risks;
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (this.currentProfile.fatigue_indicator > 70) {
      recommendations.push('Consider taking a break to prevent decision fatigue');
    }
    
    if (this.currentProfile.stress_level > 60) {
      recommendations.push('High stress detected - suggest simpler tasks or assistance');
    }
    
    if (this.behaviorMetrics.session_duration > 120) {
      recommendations.push('Long session detected - recommend periodic breaks');
    }
    
    if (this.currentProfile.frustration_score > 50) {
      recommendations.push('Frustration indicators present - consider alternative approaches');
    }
    
    if (this.deviceContext.battery_stress) {
      recommendations.push('Low battery may be causing urgency - consider charging');
    }
    
    return recommendations;
  }

  /**
   * App state monitoring
   */
  private handleAppStateChange(nextAppState: AppStateStatus): void {
    this.appStateChangeHistory.push({
      state: nextAppState,
      timestamp: Date.now()
    });
    
    // Keep only last hour of state changes
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    this.appStateChangeHistory = this.appStateChangeHistory.filter(s => s.timestamp >= oneHourAgo);
  }

  /**
   * Continuous monitoring
   */
  private startContinuousMonitoring(): void {
    this.updateTimer = setInterval(async () => {
      try {
        await this.captureEmotionalSnapshot();
      } catch (error) {
        console.error('[EMOTIONAL-TELEMETRY] Continuous monitoring error:', error);
      }
    }, this.UPDATE_INTERVAL);
  }

  /**
   * Persistence
   */
  private async loadPersistentData(): Promise<void> {
    try {
      const profileData = await AsyncStorage.getItem(this.STORAGE_KEY_PROFILE);
      if (profileData) {
        const savedProfile = JSON.parse(profileData);
        this.currentProfile = { ...this.currentProfile, ...savedProfile };
      }
      
      const interactionData = await AsyncStorage.getItem(this.STORAGE_KEY_INTERACTIONS);
      if (interactionData) {
        this.interactionHistory = JSON.parse(interactionData);
      }
    } catch (error) {
      console.error('[EMOTIONAL-TELEMETRY] Failed to load persistent data:', error);
    }
  }

  private async savePersistentData(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY_PROFILE, JSON.stringify(this.currentProfile));
      await AsyncStorage.setItem(this.STORAGE_KEY_INTERACTIONS, JSON.stringify(this.interactionHistory));
    } catch (error) {
      console.error('[EMOTIONAL-TELEMETRY] Failed to save persistent data:', error);
    }
  }

  /**
   * Safe defaults for error conditions
   */
  private getSafeDefaultSnapshot(): EmotionalTelemetrySnapshot {
    return {
      timestamp: new Date().toISOString(),
      creator_profile: this.currentProfile,
      behavioral_metrics: this.behaviorMetrics,
      device_context: this.deviceContext,
      confidence_score: 30,
      risk_indicators: ['TELEMETRY_SYSTEM_ERROR'],
      recommendations: ['Emotional telemetry system error - using safe defaults']
    };
  }

  /**
   * Public API
   */
  public getCurrentProfile(): CreatorEmotionalProfile {
    return { ...this.currentProfile };
  }

  public getBehaviorMetrics(): BehavioralMetrics {
    return { ...this.behaviorMetrics };
  }

  public getDeviceContext(): DeviceContextualFactors {
    return { ...this.deviceContext };
  }

  public async shutdown(): Promise<void> {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
    
    await this.savePersistentData();
    console.log('[EMOTIONAL-TELEMETRY] Emotional telemetry system shutdown');
  }
}

export default MobileEmotionalTelemetry;