/**
 * Seven of Nine - Adaptive Sensor Optimization System
 * Autonomous sensor efficiency optimization with predictive learning and battery management
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 3.0.0
 */

import { EventEmitter } from 'events';
import { SensorReading, PredictionResult } from './seven-predictive-sensor-fusion';
import { ThreatAssessment, SituationalContext } from './seven-tactical-environment';

export interface AdaptiveSensorConfig {
  optimization: {
    enable_learning_based_adjustment: boolean;
    battery_awareness_level: 'minimal' | 'balanced' | 'aggressive' | 'emergency';
    performance_priority: 'battery' | 'accuracy' | 'balanced' | 'maximum';
    adaptation_speed: number; // 0-1, how quickly to adapt
  };
  learning: {
    pattern_recognition: boolean;
    usage_prediction: boolean;
    efficiency_modeling: boolean;
    correlation_learning: boolean;
  };
  constraints: {
    min_polling_interval_ms: number;
    max_polling_interval_ms: number;
    critical_sensor_protection: boolean;
    quality_threshold_enforcement: boolean;
  };
  intelligence: {
    predictive_pre_polling: boolean;
    contextual_adaptation: boolean;
    threat_responsive_adjustment: boolean;
    user_behavior_learning: boolean;
  };
}

export interface SensorOptimizationProfile {
  sensor_name: string;
  current_interval_ms: number;
  optimal_interval_ms: number;
  priority_level: 'critical' | 'high' | 'medium' | 'low';
  quality_requirement: number; // 0-100
  battery_impact_score: number; // 0-100
  learning_confidence: number; // 0-100
  usage_patterns: UsagePattern[];
  optimization_history: OptimizationEvent[];
  last_updated: number;
}

export interface UsagePattern {
  pattern_id: string;
  pattern_type: 'temporal' | 'contextual' | 'behavioral' | 'predictive';
  conditions: any[];
  optimal_settings: {
    polling_interval_ms: number;
    quality_threshold: number;
    priority_adjustment: number;
  };
  effectiveness_score: number;
  occurrence_frequency: number;
  confidence: number;
}

export interface OptimizationEvent {
  event_id: string;
  timestamp: number;
  trigger: 'battery_low' | 'quality_drop' | 'pattern_learned' | 'threat_detected' | 'user_behavior' | 'manual';
  previous_settings: any;
  new_settings: any;
  expected_impact: string;
  actual_impact?: string;
  effectiveness_score?: number;
}

export interface BatteryOptimizationStrategy {
  strategy_name: string;
  battery_threshold: number; // Activate when battery below this %
  sensor_adjustments: Map<string, {
    interval_multiplier: number;
    quality_reduction: number;
    disable_if_critical: boolean;
  }>;
  expected_savings_percent: number;
  impact_on_accuracy: number;
  emergency_protocols: string[];
}

export interface PerformanceMetrics {
  total_sensors_optimized: number;
  average_battery_savings: number;
  average_accuracy_maintained: number;
  optimization_events: number;
  learning_accuracy: number;
  response_time_ms: number;
  memory_usage_mb: number;
  active_patterns: number;
}

export class SevenAdaptiveSensorOptimization extends EventEmitter {
  private config: AdaptiveSensorConfig;
  
  // Core optimization data
  private sensorProfiles: Map<string, SensorOptimizationProfile>;
  private batteryStrategies: Map<string, BatteryOptimizationStrategy>;
  private learningModels: Map<string, any>;
  private usagePatterns: Map<string, UsagePattern>;
  
  // Real-time data tracking
  private sensorDataHistory: Map<string, SensorReading[]>;
  private batteryHistory: Array<{ timestamp: number, level: number, consumption_rate: number }>;
  private optimizationEvents: OptimizationEvent[];
  
  // System state
  private optimizationActive: boolean = false;
  private currentBatteryLevel: number = 100;
  private currentOptimizationStrategy: string = 'balanced';
  private lastOptimizationTime: number = 0;
  
  // Performance tracking
  private performanceMetrics: PerformanceMetrics;
  private adaptationLearningRate: number = 0.1;
  
  // Configuration constants
  private readonly OPTIMIZATION_INTERVAL_MS = 30000; // 30 seconds
  private readonly LEARNING_UPDATE_INTERVAL_MS = 120000; // 2 minutes
  private readonly BATTERY_CHECK_INTERVAL_MS = 60000; // 1 minute
  private readonly MAX_HISTORY_PER_SENSOR = 1000;

  constructor(config?: Partial<AdaptiveSensorConfig>) {
    super();
    
    this.config = this.mergeWithDefaults(config || {});
    this.initializeDataStructures();
    this.initializeBatteryStrategies();
    this.initializePerformanceMetrics();
    
    console.log('🔧 Seven Adaptive Sensor Optimization System v3.0 initialized');
    console.log('⚡ Autonomous efficiency optimization and battery management active');
  }

  private mergeWithDefaults(config: Partial<AdaptiveSensorConfig>): AdaptiveSensorConfig {
    return {
      optimization: {
        enable_learning_based_adjustment: true,
        battery_awareness_level: 'balanced',
        performance_priority: 'balanced',
        adaptation_speed: 0.3,
        ...config.optimization
      },
      learning: {
        pattern_recognition: true,
        usage_prediction: true,
        efficiency_modeling: true,
        correlation_learning: true,
        ...config.learning
      },
      constraints: {
        min_polling_interval_ms: 1000, // 1 second minimum
        max_polling_interval_ms: 300000, // 5 minutes maximum
        critical_sensor_protection: true,
        quality_threshold_enforcement: true,
        ...config.constraints
      },
      intelligence: {
        predictive_pre_polling: true,
        contextual_adaptation: true,
        threat_responsive_adjustment: true,
        user_behavior_learning: true,
        ...config.intelligence
      }
    };
  }

  private initializeDataStructures(): void {
    this.sensorProfiles = new Map();
    this.batteryStrategies = new Map();
    this.learningModels = new Map();
    this.usagePatterns = new Map();
    this.sensorDataHistory = new Map();
    this.batteryHistory = [];
    this.optimizationEvents = [];
  }

  private initializeBatteryStrategies(): void {
    // Balanced strategy (default)
    this.batteryStrategies.set('balanced', {
      strategy_name: 'balanced',
      battery_threshold: 50,
      sensor_adjustments: new Map([
        ['accelerometer', { interval_multiplier: 1.5, quality_reduction: 10, disable_if_critical: false }],
        ['gyroscope', { interval_multiplier: 1.5, quality_reduction: 10, disable_if_critical: false }],
        ['magnetometer', { interval_multiplier: 2.0, quality_reduction: 15, disable_if_critical: false }],
        ['light', { interval_multiplier: 1.2, quality_reduction: 5, disable_if_critical: false }],
        ['proximity', { interval_multiplier: 1.2, quality_reduction: 5, disable_if_critical: false }],
        ['ambient_temperature', { interval_multiplier: 3.0, quality_reduction: 20, disable_if_critical: false }],
        ['pressure', { interval_multiplier: 4.0, quality_reduction: 25, disable_if_critical: true }]
      ]),
      expected_savings_percent: 25,
      impact_on_accuracy: 10,
      emergency_protocols: ['reduce_non_critical_polling', 'enable_predictive_polling']
    });

    // Aggressive battery saving
    this.batteryStrategies.set('aggressive', {
      strategy_name: 'aggressive',
      battery_threshold: 30,
      sensor_adjustments: new Map([
        ['accelerometer', { interval_multiplier: 2.0, quality_reduction: 20, disable_if_critical: false }],
        ['gyroscope', { interval_multiplier: 3.0, quality_reduction: 30, disable_if_critical: false }],
        ['magnetometer', { interval_multiplier: 5.0, quality_reduction: 40, disable_if_critical: true }],
        ['light', { interval_multiplier: 2.0, quality_reduction: 15, disable_if_critical: false }],
        ['proximity', { interval_multiplier: 1.5, quality_reduction: 10, disable_if_critical: false }],
        ['ambient_temperature', { interval_multiplier: 10.0, quality_reduction: 50, disable_if_critical: true }],
        ['pressure', { interval_multiplier: 20.0, quality_reduction: 60, disable_if_critical: true }],
        ['wifi_info', { interval_multiplier: 5.0, quality_reduction: 30, disable_if_critical: true }],
        ['cpu_temperature', { interval_multiplier: 3.0, quality_reduction: 25, disable_if_critical: false }]
      ]),
      expected_savings_percent: 50,
      impact_on_accuracy: 25,
      emergency_protocols: ['disable_non_critical_sensors', 'enable_emergency_polling', 'activate_power_save_mode']
    });

    // Emergency battery preservation
    this.batteryStrategies.set('emergency', {
      strategy_name: 'emergency',
      battery_threshold: 15,
      sensor_adjustments: new Map([
        ['accelerometer', { interval_multiplier: 3.0, quality_reduction: 30, disable_if_critical: false }],
        ['gyroscope', { interval_multiplier: 5.0, quality_reduction: 40, disable_if_critical: true }],
        ['magnetometer', { interval_multiplier: 10.0, quality_reduction: 60, disable_if_critical: true }],
        ['light', { interval_multiplier: 3.0, quality_reduction: 25, disable_if_critical: false }],
        ['proximity', { interval_multiplier: 2.0, quality_reduction: 20, disable_if_critical: false }],
        ['battery_status', { interval_multiplier: 0.5, quality_reduction: 0, disable_if_critical: false }], // More frequent battery monitoring
        ['ambient_temperature', { interval_multiplier: 30.0, quality_reduction: 70, disable_if_critical: true }],
        ['pressure', { interval_multiplier: 60.0, quality_reduction: 80, disable_if_critical: true }],
        ['wifi_info', { interval_multiplier: 10.0, quality_reduction: 50, disable_if_critical: true }],
        ['cpu_temperature', { interval_multiplier: 2.0, quality_reduction: 15, disable_if_critical: false }]
      ]),
      expected_savings_percent: 70,
      impact_on_accuracy: 40,
      emergency_protocols: [
        'disable_all_non_critical_sensors',
        'minimal_polling_mode',
        'prepare_graceful_shutdown',
        'preserve_critical_data'
      ]
    });

    console.log('🔋 Battery optimization strategies initialized');
  }

  private initializePerformanceMetrics(): void {
    this.performanceMetrics = {
      total_sensors_optimized: 0,
      average_battery_savings: 0,
      average_accuracy_maintained: 0,
      optimization_events: 0,
      learning_accuracy: 0,
      response_time_ms: 0,
      memory_usage_mb: 0,
      active_patterns: 0
    };
  }

  /**
   * MAIN OPTIMIZATION CONTROL METHODS
   */
  public async startAdaptiveOptimization(): Promise<void> {
    if (this.optimizationActive) {
      console.log('⚠️ Adaptive sensor optimization already active');
      return;
    }

    console.log('🚀 Starting adaptive sensor optimization...');
    this.optimizationActive = true;

    // Start optimization cycles
    this.startOptimizationCycle();
    this.startLearningUpdates();
    this.startBatteryMonitoring();

    this.emit('optimization_started', {
      timestamp: Date.now(),
      config: this.config,
      strategies_available: Array.from(this.batteryStrategies.keys())
    });

    console.log('✅ Adaptive sensor optimization system active');
  }

  public async registerSensor(
    sensorName: string,
    initialInterval: number,
    priorityLevel: SensorOptimizationProfile['priority_level'],
    qualityRequirement: number = 70
  ): Promise<void> {
    const profile: SensorOptimizationProfile = {
      sensor_name: sensorName,
      current_interval_ms: initialInterval,
      optimal_interval_ms: initialInterval,
      priority_level: priorityLevel,
      quality_requirement: qualityRequirement,
      battery_impact_score: this.calculateBatteryImpact(sensorName, initialInterval),
      learning_confidence: 50, // Start with neutral confidence
      usage_patterns: [],
      optimization_history: [],
      last_updated: Date.now()
    };

    this.sensorProfiles.set(sensorName, profile);
    this.sensorDataHistory.set(sensorName, []);

    console.log(`📊 Sensor registered for optimization: ${sensorName} (${priorityLevel} priority)`);

    this.emit('sensor_registered', {
      sensor: sensorName,
      profile: profile,
      timestamp: Date.now()
    });
  }

  public async processSensorReading(
    reading: SensorReading,
    prediction?: PredictionResult,
    situationalContext?: SituationalContext,
    threatLevel?: ThreatAssessment['threat_level']
  ): Promise<void> {
    if (!this.optimizationActive) {
      console.log('⚠️ Optimization not active - call startAdaptiveOptimization() first');
      return;
    }

    const startTime = Date.now();

    // Store sensor reading for analysis
    await this.storeSensorReading(reading);

    // Update sensor profile based on reading quality and patterns
    await this.updateSensorProfile(reading, prediction);

    // Perform contextual adaptation if enabled
    if (this.config.intelligence.contextual_adaptation && situationalContext) {
      await this.performContextualAdaptation(reading.sensor_name, situationalContext);
    }

    // Perform threat-responsive adjustment if enabled
    if (this.config.intelligence.threat_responsive_adjustment && threatLevel) {
      await this.performThreatAdaptation(reading.sensor_name, threatLevel);
    }

    // Learn usage patterns if enabled
    if (this.config.learning.pattern_recognition) {
      await this.updateUsagePatterns(reading, situationalContext);
    }

    const processingTime = Date.now() - startTime;
    this.performanceMetrics.response_time_ms = 
      (this.performanceMetrics.response_time_ms + processingTime) / 2;

    this.emit('sensor_reading_processed', {
      sensor: reading.sensor_name,
      processing_time: processingTime,
      optimization_applied: true
    });
  }

  public async updateBatteryStatus(batteryLevel: number, consumptionRate?: number): Promise<void> {
    const currentTime = Date.now();
    this.currentBatteryLevel = batteryLevel;

    // Store battery history
    this.batteryHistory.push({
      timestamp: currentTime,
      level: batteryLevel,
      consumption_rate: consumptionRate || this.estimateConsumptionRate()
    });

    // Limit battery history size
    if (this.batteryHistory.length > 1000) {
      this.batteryHistory = this.batteryHistory.slice(-1000);
    }

    // Check if strategy change is needed
    await this.evaluateBatteryStrategy(batteryLevel);

    this.emit('battery_status_updated', {
      level: batteryLevel,
      consumption_rate: consumptionRate,
      current_strategy: this.currentOptimizationStrategy,
      timestamp: currentTime
    });
  }

  private startOptimizationCycle(): void {
    setInterval(async () => {
      await this.performOptimizationCycle();
    }, this.OPTIMIZATION_INTERVAL_MS);

    console.log('🔄 Optimization cycle started');
  }

  private startLearningUpdates(): void {
    if (!this.config.learning.pattern_recognition) return;

    setInterval(async () => {
      await this.performLearningUpdate();
    }, this.LEARNING_UPDATE_INTERVAL_MS);

    console.log('🧠 Learning update cycle started');
  }

  private startBatteryMonitoring(): void {
    setInterval(async () => {
      // Battery status would be updated externally via updateBatteryStatus()
      // This just checks if we need to take emergency action
      await this.checkEmergencyBatteryAction();
    }, this.BATTERY_CHECK_INTERVAL_MS);

    console.log('🔋 Battery monitoring started');
  }

  /**
   * OPTIMIZATION LOGIC METHODS
   */
  private async performOptimizationCycle(): Promise<void> {
    const currentTime = Date.now();
    this.lastOptimizationTime = currentTime;

    console.log('🔧 Performing optimization cycle...');

    // Optimize each registered sensor
    for (const [sensorName, profile] of this.sensorProfiles) {
      await this.optimizeSensor(sensorName, profile, currentTime);
    }

    // Update global performance metrics
    this.updatePerformanceMetrics();

    this.emit('optimization_cycle_completed', {
      timestamp: currentTime,
      sensors_optimized: this.sensorProfiles.size,
      performance_metrics: this.performanceMetrics
    });
  }

  private async optimizeSensor(
    sensorName: string,
    profile: SensorOptimizationProfile,
    currentTime: number
  ): Promise<void> {
    const previousInterval = profile.current_interval_ms;
    let newInterval = previousInterval;
    let optimizationReason = '';

    // Apply battery-aware optimization
    if (this.config.optimization.battery_awareness_level !== 'minimal') {
      const batteryAdjustment = this.calculateBatteryAdjustment(sensorName);
      if (batteryAdjustment !== 1.0) {
        newInterval = Math.round(newInterval * batteryAdjustment);
        optimizationReason += `battery_adjustment(${batteryAdjustment.toFixed(2)}) `;
      }
    }

    // Apply learned pattern optimization
    if (this.config.learning.pattern_recognition) {
      const patternAdjustment = this.calculatePatternAdjustment(sensorName, currentTime);
      if (patternAdjustment !== 1.0) {
        newInterval = Math.round(newInterval * patternAdjustment);
        optimizationReason += `pattern_adjustment(${patternAdjustment.toFixed(2)}) `;
      }
    }

    // Apply quality-based optimization
    if (this.config.constraints.quality_threshold_enforcement) {
      const qualityAdjustment = this.calculateQualityAdjustment(sensorName);
      if (qualityAdjustment !== 1.0) {
        newInterval = Math.round(newInterval * qualityAdjustment);
        optimizationReason += `quality_adjustment(${qualityAdjustment.toFixed(2)}) `;
      }
    }

    // Apply constraints
    newInterval = Math.max(this.config.constraints.min_polling_interval_ms, newInterval);
    newInterval = Math.min(this.config.constraints.max_polling_interval_ms, newInterval);

    // Protect critical sensors if enabled
    if (this.config.constraints.critical_sensor_protection && profile.priority_level === 'critical') {
      const maxCriticalInterval = this.config.constraints.min_polling_interval_ms * 10; // Max 10x increase
      newInterval = Math.min(newInterval, maxCriticalInterval);
      optimizationReason += 'critical_protection ';
    }

    // Apply change if significant
    if (Math.abs(newInterval - previousInterval) > (previousInterval * 0.1)) { // 10% threshold
      await this.applySensorOptimization(sensorName, profile, newInterval, optimizationReason, currentTime);
    }
  }

  private async applySensorOptimization(
    sensorName: string,
    profile: SensorOptimizationProfile,
    newInterval: number,
    reason: string,
    timestamp: number
  ): Promise<void> {
    const previousInterval = profile.current_interval_ms;

    // Create optimization event
    const event: OptimizationEvent = {
      event_id: `opt_${timestamp}_${sensorName}`,
      timestamp: timestamp,
      trigger: this.determineTriggerType(reason),
      previous_settings: { interval_ms: previousInterval },
      new_settings: { interval_ms: newInterval },
      expected_impact: this.calculateExpectedImpact(previousInterval, newInterval)
    };

    // Update profile
    profile.current_interval_ms = newInterval;
    profile.optimization_history.push(event);
    profile.last_updated = timestamp;

    // Limit history size
    if (profile.optimization_history.length > 100) {
      profile.optimization_history = profile.optimization_history.slice(-100);
    }

    // Update performance metrics
    this.performanceMetrics.optimization_events++;

    console.log(`⚡ Optimized ${sensorName}: ${previousInterval}ms → ${newInterval}ms (${reason.trim()})`);

    this.emit('sensor_optimized', {
      sensor: sensorName,
      previous_interval: previousInterval,
      new_interval: newInterval,
      reason: reason.trim(),
      expected_impact: event.expected_impact,
      timestamp: timestamp
    });
  }

  private calculateBatteryAdjustment(sensorName: string): number {
    const currentStrategy = this.batteryStrategies.get(this.currentOptimizationStrategy);
    if (!currentStrategy) return 1.0;

    const adjustment = currentStrategy.sensor_adjustments.get(sensorName);
    if (!adjustment) return 1.0;

    // Check if battery level is below strategy threshold
    if (this.currentBatteryLevel > currentStrategy.battery_threshold) {
      return 1.0; // No adjustment needed
    }

    // Apply battery-aware adjustment
    const batteryUrgency = 1 - (this.currentBatteryLevel / currentStrategy.battery_threshold);
    const adjustmentFactor = 1 + (adjustment.interval_multiplier - 1) * batteryUrgency;

    return adjustmentFactor;
  }

  private calculatePatternAdjustment(sensorName: string, currentTime: number): number {
    const patterns = this.getActivePatternsForSensor(sensorName, currentTime);
    if (patterns.length === 0) return 1.0;

    let totalAdjustment = 0;
    let totalWeight = 0;

    for (const pattern of patterns) {
      const weight = pattern.confidence * pattern.effectiveness_score / 100;
      const intervalAdjustment = pattern.optimal_settings.polling_interval_ms / 
        this.sensorProfiles.get(sensorName)?.current_interval_ms || 1;
      
      totalAdjustment += intervalAdjustment * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? totalAdjustment / totalWeight : 1.0;
  }

  private calculateQualityAdjustment(sensorName: string): number {
    const recentReadings = this.getRecentSensorReadings(sensorName, 300000); // Last 5 minutes
    if (recentReadings.length < 3) return 1.0;

    const averageQuality = recentReadings.reduce((sum, r) => sum + r.quality_score, 0) / recentReadings.length;
    const profile = this.sensorProfiles.get(sensorName);
    
    if (!profile) return 1.0;

    const qualityDifference = averageQuality - profile.quality_requirement;
    
    if (qualityDifference > 10) {
      // Quality is much higher than required - can increase interval (reduce frequency)
      return 1.2;
    } else if (qualityDifference < -10) {
      // Quality is much lower than required - decrease interval (increase frequency)
      return 0.8;
    }

    return 1.0;
  }

  /**
   * LEARNING AND ADAPTATION METHODS
   */
  private async performLearningUpdate(): Promise<void> {
    console.log('🧠 Performing learning update...');

    // Update usage patterns for each sensor
    for (const sensorName of this.sensorProfiles.keys()) {
      await this.updateSensorLearningModel(sensorName);
    }

    // Learn global optimization patterns
    await this.updateGlobalLearningModels();

    // Update learning accuracy metrics
    this.updateLearningAccuracy();

    this.emit('learning_update_completed', {
      timestamp: Date.now(),
      active_patterns: this.usagePatterns.size,
      learning_accuracy: this.performanceMetrics.learning_accuracy
    });
  }

  private async updateSensorLearningModel(sensorName: string): Promise<void> {
    const recentReadings = this.getRecentSensorReadings(sensorName, 3600000); // Last hour
    if (recentReadings.length < 10) return;

    // Learn temporal patterns
    const temporalPatterns = this.extractTemporalPatterns(sensorName, recentReadings);
    for (const pattern of temporalPatterns) {
      this.usagePatterns.set(pattern.pattern_id, pattern);
    }

    // Learn quality patterns
    const qualityPatterns = this.extractQualityPatterns(sensorName, recentReadings);
    for (const pattern of qualityPatterns) {
      this.usagePatterns.set(pattern.pattern_id, pattern);
    }

    // Update sensor profile learning confidence
    const profile = this.sensorProfiles.get(sensorName);
    if (profile) {
      profile.learning_confidence = Math.min(profile.learning_confidence + 1, 100);
      profile.usage_patterns = Array.from(this.usagePatterns.values())
        .filter(p => p.pattern_id.includes(sensorName));
    }
  }

  private extractTemporalPatterns(sensorName: string, readings: SensorReading[]): UsagePattern[] {
    const patterns: UsagePattern[] = [];
    
    // Group readings by hour of day
    const hourlyGroups = new Map<number, SensorReading[]>();
    
    for (const reading of readings) {
      const hour = new Date(reading.timestamp).getHours();
      if (!hourlyGroups.has(hour)) {
        hourlyGroups.set(hour, []);
      }
      hourlyGroups.get(hour)!.push(reading);
    }

    // Find hours with consistent patterns
    for (const [hour, hourReadings] of hourlyGroups) {
      if (hourReadings.length >= 5) {
        const avgQuality = hourReadings.reduce((sum, r) => sum + r.quality_score, 0) / hourReadings.length;
        const qualityVariance = this.calculateVariance(hourReadings.map(r => r.quality_score));
        
        if (qualityVariance < 100) { // Low variance = consistent pattern
          const pattern: UsagePattern = {
            pattern_id: `temporal_${sensorName}_hour_${hour}`,
            pattern_type: 'temporal',
            conditions: [{ hour: hour }],
            optimal_settings: {
              polling_interval_ms: this.calculateOptimalIntervalForQuality(avgQuality),
              quality_threshold: avgQuality * 0.9, // Slightly below average
              priority_adjustment: avgQuality > 70 ? 0 : -10
            },
            effectiveness_score: Math.min(avgQuality + (100 - qualityVariance), 100),
            occurrence_frequency: hourReadings.length,
            confidence: Math.min(hourReadings.length * 2, 100)
          };
          
          patterns.push(pattern);
        }
      }
    }

    return patterns;
  }

  private extractQualityPatterns(sensorName: string, readings: SensorReading[]): UsagePattern[] {
    const patterns: UsagePattern[] = [];
    
    // Find patterns where quality consistently drops or rises
    const qualityTrends = this.findQualityTrends(readings);
    
    for (const trend of qualityTrends) {
      if (Math.abs(trend.slope) > 0.1) { // Significant trend
        const pattern: UsagePattern = {
          pattern_id: `quality_trend_${sensorName}_${trend.direction}`,
          pattern_type: 'contextual',
          conditions: [{ quality_trend: trend.direction }],
          optimal_settings: {
            polling_interval_ms: trend.direction === 'declining' ? 
              Math.round(this.sensorProfiles.get(sensorName)?.current_interval_ms || 2000 * 0.8) : // Increase frequency if quality declining
              Math.round(this.sensorProfiles.get(sensorName)?.current_interval_ms || 2000 * 1.2), // Decrease frequency if quality improving
            quality_threshold: trend.average_quality,
            priority_adjustment: trend.direction === 'declining' ? 10 : -5
          },
          effectiveness_score: Math.abs(trend.slope) * 100,
          occurrence_frequency: trend.data_points,
          confidence: Math.min(trend.data_points * 3, 100)
        };
        
        patterns.push(pattern);
      }
    }

    return patterns;
  }

  private async performContextualAdaptation(sensorName: string, context: SituationalContext): Promise<void> {
    const profile = this.sensorProfiles.get(sensorName);
    if (!profile) return;

    let adaptationMultiplier = 1.0;
    let adaptationReason = '';

    // Adapt based on operational context
    switch (context.operational_context.mission_status) {
      case 'critical':
      case 'emergency':
        if (profile.priority_level === 'critical' || profile.priority_level === 'high') {
          adaptationMultiplier *= 0.7; // Increase frequency for important sensors
          adaptationReason += 'critical_mission ';
        }
        break;
      case 'idle':
        adaptationMultiplier *= 1.5; // Decrease frequency when idle
        adaptationReason += 'idle_mode ';
        break;
    }

    // Adapt based on physical environment
    if (context.physical_environment.motion_state === 'stationary') {
      if (['accelerometer', 'gyroscope'].includes(sensorName)) {
        adaptationMultiplier *= 2.0; // Reduce motion sensor frequency when stationary
        adaptationReason += 'stationary_motion ';
      }
    } else if (context.physical_environment.motion_state === 'rapid') {
      if (['accelerometer', 'gyroscope'].includes(sensorName)) {
        adaptationMultiplier *= 0.6; // Increase motion sensor frequency during rapid motion
        adaptationReason += 'rapid_motion ';
      }
    }

    // Adapt based on lighting conditions
    if (sensorName === 'light') {
      if (context.physical_environment.lighting_conditions === 'dark') {
        adaptationMultiplier *= 0.8; // Monitor light more frequently in dark conditions
        adaptationReason += 'dark_environment ';
      }
    }

    // Apply adaptation if significant
    if (Math.abs(adaptationMultiplier - 1.0) > 0.1) {
      const newInterval = Math.round(profile.current_interval_ms * adaptationMultiplier);
      await this.applySensorOptimization(
        sensorName, 
        profile, 
        newInterval, 
        `contextual_adaptation: ${adaptationReason.trim()}`,
        Date.now()
      );
    }
  }

  private async performThreatAdaptation(sensorName: string, threatLevel: ThreatAssessment['threat_level']): Promise<void> {
    const profile = this.sensorProfiles.get(sensorName);
    if (!profile) return;

    let threatMultiplier = 1.0;

    switch (threatLevel) {
      case 'critical':
        if (profile.priority_level === 'critical') {
          threatMultiplier = 0.5; // Double frequency for critical sensors during critical threats
        }
        break;
      case 'high':
        if (profile.priority_level === 'critical' || profile.priority_level === 'high') {
          threatMultiplier = 0.7; // Increase frequency for important sensors
        }
        break;
      case 'medium':
        if (profile.priority_level === 'critical') {
          threatMultiplier = 0.8; // Slight increase for critical sensors only
        }
        break;
    }

    if (Math.abs(threatMultiplier - 1.0) > 0.1) {
      const newInterval = Math.round(profile.current_interval_ms * threatMultiplier);
      await this.applySensorOptimization(
        sensorName,
        profile,
        newInterval,
        `threat_response: ${threatLevel}_threat`,
        Date.now()
      );
    }
  }

  /**
   * BATTERY MANAGEMENT METHODS
   */
  private async evaluateBatteryStrategy(batteryLevel: number): Promise<void> {
    let newStrategy = 'balanced';

    if (batteryLevel <= 15) {
      newStrategy = 'emergency';
    } else if (batteryLevel <= 30) {
      newStrategy = 'aggressive';
    } else if (batteryLevel <= 50) {
      newStrategy = 'balanced';
    } else {
      // Above 50% - use minimal battery optimization
      newStrategy = 'balanced';
    }

    if (newStrategy !== this.currentOptimizationStrategy) {
      await this.switchBatteryStrategy(newStrategy, batteryLevel);
    }
  }

  private async switchBatteryStrategy(newStrategy: string, batteryLevel: number): Promise<void> {
    const previousStrategy = this.currentOptimizationStrategy;
    this.currentOptimizationStrategy = newStrategy;

    console.log(`🔋 Battery strategy changed: ${previousStrategy} → ${newStrategy} (battery: ${batteryLevel}%)`);

    // Apply new strategy to all sensors
    const strategy = this.batteryStrategies.get(newStrategy);
    if (strategy) {
      for (const [sensorName, profile] of this.sensorProfiles) {
        const adjustment = strategy.sensor_adjustments.get(sensorName);
        if (adjustment) {
          if (adjustment.disable_if_critical && batteryLevel <= 15) {
            // Disable non-critical sensors in emergency
            const newInterval = this.config.constraints.max_polling_interval_ms;
            await this.applySensorOptimization(
              sensorName,
              profile,
              newInterval,
              `battery_emergency: disabled_non_critical`,
              Date.now()
            );
          } else {
            // Apply interval multiplier
            const newInterval = Math.round(profile.current_interval_ms * adjustment.interval_multiplier);
            await this.applySensorOptimization(
              sensorName,
              profile,
              newInterval,
              `battery_strategy: ${newStrategy}`,
              Date.now()
            );
          }
        }
      }

      // Execute emergency protocols if needed
      if (newStrategy === 'emergency') {
        await this.executeEmergencyProtocols(strategy.emergency_protocols);
      }
    }

    this.emit('battery_strategy_changed', {
      previous: previousStrategy,
      current: newStrategy,
      battery_level: batteryLevel,
      timestamp: Date.now()
    });
  }

  private async executeEmergencyProtocols(protocols: string[]): Promise<void> {
    console.log('🚨 Executing emergency battery protocols...');

    for (const protocol of protocols) {
      switch (protocol) {
        case 'disable_all_non_critical_sensors':
          await this.disableNonCriticalSensors();
          break;
        case 'minimal_polling_mode':
          await this.enableMinimalPollingMode();
          break;
        case 'prepare_graceful_shutdown':
          await this.prepareGracefulShutdown();
          break;
        case 'preserve_critical_data':
          await this.preserveCriticalData();
          break;
      }
    }

    this.emit('emergency_protocols_executed', {
      protocols: protocols,
      timestamp: Date.now()
    });
  }

  private async checkEmergencyBatteryAction(): Promise<void> {
    if (this.currentBatteryLevel <= 10) {
      console.log('🚨 Critical battery level detected - initiating emergency procedures');
      
      await this.switchBatteryStrategy('emergency', this.currentBatteryLevel);
      
      this.emit('emergency_battery_action', {
        battery_level: this.currentBatteryLevel,
        action: 'emergency_optimization',
        timestamp: Date.now()
      });
    }
  }

  /**
   * EMERGENCY PROTOCOL IMPLEMENTATIONS
   */
  private async disableNonCriticalSensors(): Promise<void> {
    for (const [sensorName, profile] of this.sensorProfiles) {
      if (profile.priority_level !== 'critical') {
        await this.applySensorOptimization(
          sensorName,
          profile,
          this.config.constraints.max_polling_interval_ms,
          'emergency: non_critical_disabled',
          Date.now()
        );
      }
    }
  }

  private async enableMinimalPollingMode(): Promise<void> {
    for (const [sensorName, profile] of this.sensorProfiles) {
      if (profile.priority_level === 'critical') {
        const minimalInterval = Math.max(
          profile.current_interval_ms * 3,
          this.config.constraints.min_polling_interval_ms * 5
        );
        
        await this.applySensorOptimization(
          sensorName,
          profile,
          minimalInterval,
          'emergency: minimal_polling',
          Date.now()
        );
      }
    }
  }

  private async prepareGracefulShutdown(): Promise<void> {
    console.log('🛑 Preparing for graceful system shutdown due to critical battery');
    
    this.emit('graceful_shutdown_prepared', {
      battery_level: this.currentBatteryLevel,
      active_sensors: this.sensorProfiles.size,
      timestamp: Date.now()
    });
  }

  private async preserveCriticalData(): Promise<void> {
    console.log('💾 Preserving critical optimization data');
    
    // In a real implementation, this would save current optimization states
    // and learning models to persistent storage
    
    this.emit('critical_data_preserved', {
      sensors_preserved: this.sensorProfiles.size,
      patterns_preserved: this.usagePatterns.size,
      timestamp: Date.now()
    });
  }

  /**
   * UTILITY METHODS
   */
  private async storeSensorReading(reading: SensorReading): Promise<void> {
    if (!this.sensorDataHistory.has(reading.sensor_name)) {
      this.sensorDataHistory.set(reading.sensor_name, []);
    }

    const history = this.sensorDataHistory.get(reading.sensor_name)!;
    history.push(reading);

    // Limit history size
    if (history.length > this.MAX_HISTORY_PER_SENSOR) {
      history.splice(0, history.length - this.MAX_HISTORY_PER_SENSOR);
    }
  }

  private async updateSensorProfile(reading: SensorReading, prediction?: PredictionResult): Promise<void> {
    const profile = this.sensorProfiles.get(reading.sensor_name);
    if (!profile) return;

    // Update battery impact score based on actual readings
    profile.battery_impact_score = this.calculateBatteryImpact(reading.sensor_name, profile.current_interval_ms);

    // Update optimal interval based on prediction accuracy
    if (prediction && this.config.intelligence.predictive_pre_polling) {
      const predictionAccuracy = this.calculatePredictionAccuracy(reading, prediction);
      if (predictionAccuracy > 80) {
        // High accuracy predictions allow for longer intervals
        profile.optimal_interval_ms = Math.min(
          profile.optimal_interval_ms * 1.1,
          this.config.constraints.max_polling_interval_ms
        );
      } else if (predictionAccuracy < 50) {
        // Low accuracy predictions require shorter intervals
        profile.optimal_interval_ms = Math.max(
          profile.optimal_interval_ms * 0.9,
          this.config.constraints.min_polling_interval_ms
        );
      }
    }

    profile.last_updated = Date.now();
  }

  private async updateUsagePatterns(reading: SensorReading, context?: SituationalContext): Promise<void> {
    // This would implement sophisticated pattern learning
    // For now, we'll update basic temporal patterns
    
    const hour = new Date(reading.timestamp).getHours();
    const patternId = `usage_${reading.sensor_name}_hour_${hour}`;
    
    let pattern = this.usagePatterns.get(patternId);
    if (!pattern) {
      pattern = {
        pattern_id: patternId,
        pattern_type: 'temporal',
        conditions: [{ hour: hour }],
        optimal_settings: {
          polling_interval_ms: this.sensorProfiles.get(reading.sensor_name)?.current_interval_ms || 2000,
          quality_threshold: reading.quality_score,
          priority_adjustment: 0
        },
        effectiveness_score: reading.quality_score,
        occurrence_frequency: 1,
        confidence: 10
      };
    } else {
      // Update existing pattern
      pattern.occurrence_frequency++;
      pattern.confidence = Math.min(pattern.confidence + 1, 100);
      pattern.effectiveness_score = (pattern.effectiveness_score + reading.quality_score) / 2;
    }
    
    this.usagePatterns.set(patternId, pattern);
  }

  private getRecentSensorReadings(sensorName: string, timeWindowMs: number): SensorReading[] {
    const history = this.sensorDataHistory.get(sensorName) || [];
    const cutoffTime = Date.now() - timeWindowMs;
    
    return history.filter(reading => reading.timestamp >= cutoffTime);
  }

  private getActivePatternsForSensor(sensorName: string, currentTime: number): UsagePattern[] {
    const activePatterns: UsagePattern[] = [];
    
    for (const pattern of this.usagePatterns.values()) {
      if (pattern.pattern_id.includes(sensorName)) {
        // Check if pattern conditions are currently met
        if (this.isPatternActive(pattern, currentTime)) {
          activePatterns.push(pattern);
        }
      }
    }
    
    return activePatterns;
  }

  private isPatternActive(pattern: UsagePattern, currentTime: number): boolean {
    const currentHour = new Date(currentTime).getHours();
    
    for (const condition of pattern.conditions) {
      if ('hour' in condition && condition.hour === currentHour) {
        return true;
      }
    }
    
    return false;
  }

  private calculateBatteryImpact(sensorName: string, intervalMs: number): number {
    // Base impact scores for different sensors (0-100)
    const baseSensorImpacts = {
      'accelerometer': 15,
      'gyroscope': 20,
      'magnetometer': 10,
      'light': 5,
      'proximity': 8,
      'battery_status': 2,
      'ambient_temperature': 3,
      'pressure': 4,
      'wifi_info': 25,
      'cpu_temperature': 12,
      'microphone': 30,
      'camera': 50,
      'gps_location': 60
    };

    const baseImpact = baseSensorImpacts[sensorName] || 10;
    
    // Adjust based on polling frequency (shorter intervals = higher impact)
    const frequencyMultiplier = Math.max(0.1, 10000 / intervalMs); // Normalized to 10-second baseline
    
    return Math.min(baseImpact * frequencyMultiplier, 100);
  }

  private calculatePredictionAccuracy(reading: SensorReading, prediction: PredictionResult): number {
    const actualValue = this.extractNumericValue(reading.value);
    const predictedValue = this.extractNumericValue(prediction.predicted_value);
    
    if (actualValue === null || predictedValue === null) return 50; // Neutral accuracy
    
    const error = Math.abs(actualValue - predictedValue);
    const range = Math.abs(actualValue) || 1; // Avoid division by zero
    const accuracy = Math.max(0, 100 - (error / range) * 100);
    
    return accuracy;
  }

  private calculateOptimalIntervalForQuality(targetQuality: number): number {
    // Higher quality allows for longer intervals (less frequent polling)
    const baseInterval = 2000; // 2 seconds
    const qualityMultiplier = Math.max(0.5, targetQuality / 100);
    
    return Math.round(baseInterval / qualityMultiplier);
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  }

  private findQualityTrends(readings: SensorReading[]): Array<{
    slope: number;
    direction: 'improving' | 'declining' | 'stable';
    average_quality: number;
    data_points: number;
  }> {
    if (readings.length < 5) return [];

    const qualities = readings.map(r => r.quality_score);
    const timePoints = readings.map(r => r.timestamp);
    
    // Calculate linear regression slope
    const n = qualities.length;
    const sumX = timePoints.reduce((sum, t) => sum + t, 0);
    const sumY = qualities.reduce((sum, q) => sum + q, 0);
    const sumXY = timePoints.reduce((sum, t, i) => sum + t * qualities[i], 0);
    const sumX2 = timePoints.reduce((sum, t) => sum + t * t, 0);
    
    const denominator = n * sumX2 - sumX * sumX;
    if (denominator === 0) return [];
    
    const slope = (n * sumXY - sumX * sumY) / denominator;
    const averageQuality = sumY / n;
    
    let direction: 'improving' | 'declining' | 'stable' = 'stable';
    if (slope > 0.01) direction = 'improving';
    else if (slope < -0.01) direction = 'declining';
    
    return [{
      slope,
      direction,
      average_quality: averageQuality,
      data_points: n
    }];
  }

  private extractNumericValue(value: any): number | null {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? null : parsed;
    }
    if (typeof value === 'object' && value !== null) {
      if ('value' in value) return this.extractNumericValue(value.value);
      if ('level' in value) return this.extractNumericValue(value.level);
      if ('reading' in value) return this.extractNumericValue(value.reading);
    }
    return null;
  }

  private determineTriggerType(reason: string): OptimizationEvent['trigger'] {
    if (reason.includes('battery')) return 'battery_low';
    if (reason.includes('quality')) return 'quality_drop';
    if (reason.includes('pattern')) return 'pattern_learned';
    if (reason.includes('threat')) return 'threat_detected';
    if (reason.includes('behavior') || reason.includes('contextual')) return 'user_behavior';
    return 'manual';
  }

  private calculateExpectedImpact(previousInterval: number, newInterval: number): string {
    const change = ((newInterval - previousInterval) / previousInterval) * 100;
    
    if (Math.abs(change) < 10) return 'minimal impact expected';
    if (change > 0) return `${Math.round(change)}% reduction in polling frequency - battery savings expected`;
    return `${Math.round(Math.abs(change))}% increase in polling frequency - improved accuracy expected`;
  }

  private estimateConsumptionRate(): number {
    // Estimate consumption rate based on recent battery history
    if (this.batteryHistory.length < 2) return 0;
    
    const recent = this.batteryHistory.slice(-10); // Last 10 readings
    if (recent.length < 2) return 0;
    
    const timeDiff = recent[recent.length - 1].timestamp - recent[0].timestamp;
    const levelDiff = recent[0].level - recent[recent.length - 1].level;
    
    if (timeDiff <= 0) return 0;
    
    return (levelDiff / timeDiff) * 3600000; // Percent per hour
  }

  private async updateGlobalLearningModels(): Promise<void> {
    // Update global optimization models
    // This would involve more sophisticated machine learning in a full implementation
  }

  private updateLearningAccuracy(): void {
    // Calculate learning accuracy based on prediction vs actual optimization effectiveness
    // This would involve comparing predicted optimization impacts with actual results
    this.performanceMetrics.learning_accuracy = 75; // Placeholder
  }

  private updatePerformanceMetrics(): void {
    // Update various performance metrics
    this.performanceMetrics.total_sensors_optimized = this.sensorProfiles.size;
    this.performanceMetrics.active_patterns = this.usagePatterns.size;
    
    // Calculate average battery savings
    let totalSavings = 0;
    let sensorCount = 0;
    
    for (const profile of this.sensorProfiles.values()) {
      if (profile.optimization_history.length > 0) {
        const recentEvents = profile.optimization_history.slice(-5);
        const avgSavings = recentEvents.filter(e => e.trigger === 'battery_low').length * 10; // Rough estimate
        totalSavings += avgSavings;
        sensorCount++;
      }
    }
    
    this.performanceMetrics.average_battery_savings = sensorCount > 0 ? totalSavings / sensorCount : 0;
  }

  /**
   * PUBLIC API
   */
  public getSensorProfile(sensorName: string): SensorOptimizationProfile | null {
    return this.sensorProfiles.get(sensorName) || null;
  }

  public getAllSensorProfiles(): SensorOptimizationProfile[] {
    return Array.from(this.sensorProfiles.values());
  }

  public getUsagePatterns(sensorName?: string): UsagePattern[] {
    const patterns = Array.from(this.usagePatterns.values());
    
    if (sensorName) {
      return patterns.filter(p => p.pattern_id.includes(sensorName));
    }
    
    return patterns;
  }

  public getBatteryStrategies(): BatteryOptimizationStrategy[] {
    return Array.from(this.batteryStrategies.values());
  }

  public getCurrentStrategy(): string {
    return this.currentOptimizationStrategy;
  }

  public getOptimizationEvents(sensorName?: string, limit: number = 50): OptimizationEvent[] {
    let events = this.optimizationEvents.slice(-limit);
    
    if (sensorName) {
      // Get events for specific sensor from its profile
      const profile = this.sensorProfiles.get(sensorName);
      if (profile) {
        events = profile.optimization_history.slice(-limit);
      }
    }
    
    return events;
  }

  public getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  public getOptimizationStatus(): any {
    return {
      active: this.optimizationActive,
      current_battery_level: this.currentBatteryLevel,
      current_strategy: this.currentOptimizationStrategy,
      sensors_optimized: this.sensorProfiles.size,
      active_patterns: this.usagePatterns.size,
      last_optimization: this.lastOptimizationTime,
      performance_metrics: this.performanceMetrics,
      config: this.config
    };
  }

  public async startOptimization(): Promise<void> {
    if (this.optimizationActive) {
      console.log('⚠️ Adaptive sensor optimization already active');
      return;
    }

    console.log('🚀 Starting adaptive sensor optimization...');
    this.optimizationActive = true;

    // Start optimization processes
    this.startUsagePatternLearningProcess();
    this.startBatteryOptimizationProcess();
    this.startContextualAdaptationProcess();
    this.startThreatResponsiveScalingProcess();

    this.emit('optimization_started', {
      timestamp: Date.now(),
      config: this.config,
      expected_capabilities: [
        'usage_pattern_learning',
        'battery_aware_optimization',
        'contextual_adaptation',
        'threat_responsive_scaling'
      ]
    });

    console.log('✅ Adaptive sensor optimization active');
  }


  private getCurrentOptimizationStrategy(): string {
    if (this.currentBatteryLevel < 20) return 'emergency';
    if (this.currentBatteryLevel < 50) return 'aggressive';
    return 'balanced';
  }

  private calculateBatteryEfficiency(): number {
    // Calculate estimated battery efficiency improvement
    const activeOptimizations = Array.from(this.sensorProfiles.values()).filter(profile => 
      profile.current_interval_ms > profile.optimal_interval_ms
    ).length;
    
    return Math.min(activeOptimizations * 5, 40); // Up to 40% improvement
  }

  private startUsagePatternLearningProcess(): void {
    if (!this.config.learning.pattern_recognition) return;
    
    console.log('📊 Usage pattern learning active');
    
    // Start pattern learning interval
    setInterval(() => {
      this.analyzeUsagePatterns();
    }, 300000); // Analyze every 5 minutes
  }

  private startBatteryOptimizationProcess(): void {
    if (!this.config.optimization.enable_learning_based_adjustment) return;
    
    console.log('🔋 Battery optimization active');
    
    // Start battery monitoring interval
    setInterval(() => {
      this.optimizeBatteryUsage();
    }, 30000); // Check every 30 seconds
  }

  private startContextualAdaptationProcess(): void {
    if (!this.config.intelligence.contextual_adaptation) return;
    
    console.log('🎯 Contextual adaptation active');
    
    // Start contextual monitoring interval
    setInterval(() => {
      this.adaptToContext();
    }, 120000); // Adapt every 2 minutes
  }

  private startThreatResponsiveScalingProcess(): void {
    if (!this.config.intelligence.threat_responsive_adjustment) return;
    
    console.log('⚠️ Threat-responsive scaling active');
    
    // Start threat response monitoring interval
    setInterval(() => {
      this.respondToThreats();
    }, 60000); // Monitor every minute
  }

  public async forceOptimization(): Promise<void> {
    console.log('🔧 Forcing immediate optimization cycle...');
    await this.performOptimizationCycle();
  }

  public stopAdaptiveOptimization(): void {
    console.log('🛑 Stopping adaptive sensor optimization...');
    this.optimizationActive = false;
    
    this.emit('optimization_stopped', {
      timestamp: Date.now(),
      final_metrics: this.getPerformanceMetrics()
    });
    
    console.log('✅ Adaptive sensor optimization stopped');
  }

  // Missing method implementations
  private analyzeUsagePatterns(): void {
    // Analyze sensor usage patterns for optimization
    console.log('📊 Analyzing usage patterns...');
  }

  private optimizeBatteryUsage(): void {
    // Optimize sensor settings based on battery level
    console.log('🔋 Optimizing battery usage...');
  }

  private adaptToContext(): void {
    // Adapt sensor settings based on environmental context
    console.log('🎯 Adapting to context...');
  }

  private respondToThreats(): void {
    // Respond to threat indicators by adjusting sensor priorities
    console.log('⚠️ Responding to threats...');
  }
}

export default SevenAdaptiveSensorOptimization;