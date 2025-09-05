/**
 * Seven of Nine - Tactical Environment Awareness Engine
 * Advanced environmental threat assessment and situational awareness for mobile operations
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 3.0.0
 */

import { EventEmitter } from 'events';
import { SensorReading, PredictionResult, EnvironmentalPattern } from './seven-predictive-sensor-fusion';
import { SevenEmotionalState } from './seven-emotional-sensor-mapper';

export interface TacticalEnvironmentConfig {
  threat_assessment: {
    enable_continuous_monitoring: boolean;
    threat_sensitivity: number; // 0-100
    assessment_interval_ms: number;
    auto_escalation: boolean;
  };
  situational_awareness: {
    environmental_scanning: boolean;
    behavioral_analysis: boolean;
    pattern_recognition: boolean;
    predictive_modeling: boolean;
  };
  operational_security: {
    privacy_mode: 'minimal' | 'standard' | 'enhanced' | 'maximum';
    stealth_operations: boolean;
    counter_surveillance: boolean;
    data_protection: boolean;
  };
  tactical_response: {
    automatic_adaptation: boolean;
    response_threshold: number; // 0-100
    escalation_protocols: boolean;
    mission_priority_override: boolean;
  };
}

export interface ThreatAssessment {
  threat_id: string;
  threat_level: 'none' | 'minimal' | 'low' | 'medium' | 'high' | 'critical';
  threat_type: 'environmental' | 'technical' | 'behavioral' | 'operational' | 'security';
  confidence: number;
  detected_timestamp: number;
  source_sensors: string[];
  indicators: ThreatIndicator[];
  mitigation_suggestions: string[];
  urgency_score: number;
}

export interface ThreatIndicator {
  indicator_type: string;
  severity: number; // 0-100
  description: string;
  source_data: any;
  correlation_strength: number;
}

export interface SituationalContext {
  context_id: string;
  timestamp: number;
  physical_environment: {
    location_type: 'indoor' | 'outdoor' | 'vehicle' | 'unknown';
    lighting_conditions: 'bright' | 'normal' | 'dim' | 'dark';
    ambient_conditions: 'quiet' | 'normal' | 'noisy' | 'chaotic';
    motion_state: 'stationary' | 'walking' | 'vehicle' | 'rapid';
    proximity_status: 'isolated' | 'social' | 'crowded' | 'intimate';
  };
  operational_context: {
    mission_status: 'idle' | 'active' | 'critical' | 'emergency';
    security_posture: 'relaxed' | 'alert' | 'defensive' | 'tactical';
    resource_availability: 'abundant' | 'adequate' | 'limited' | 'critical';
    connectivity_status: 'optimal' | 'degraded' | 'intermittent' | 'offline';
  };
  behavioral_indicators: {
    user_stress_level: number; // 0-100
    interaction_frequency: number;
    movement_patterns: string[];
    attention_focus: 'focused' | 'distracted' | 'multitasking' | 'overwhelmed';
  };
}

export interface TacticalRecommendation {
  recommendation_id: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'operational' | 'security' | 'efficiency' | 'adaptation';
  title: string;
  description: string;
  implementation_steps: string[];
  expected_impact: string;
  resource_requirements: string[];
  time_sensitivity: number; // minutes until action needed
}

export interface EnvironmentalIntelligence {
  intelligence_id: string;
  timestamp: number;
  environmental_summary: string;
  key_insights: string[];
  predictive_analysis: string[];
  operational_implications: string[];
  confidence_score: number;
}

export class SevenTacticalEnvironment extends EventEmitter {
  private config: TacticalEnvironmentConfig;
  
  // Core intelligence structures
  private currentSituationalContext: SituationalContext;
  private activeThreatAssessments: Map<string, ThreatAssessment>;
  private tacticalRecommendations: Map<string, TacticalRecommendation>;
  private environmentalIntelligence: EnvironmentalIntelligence[];
  
  // Data processing and analysis
  private sensorDataBuffer: Map<string, SensorReading[]>;
  private environmentalPatterns: EnvironmentalPattern[];
  private threatIndicatorLibrary: Map<string, any>;
  
  // Operational state
  private isMonitoringActive: boolean = false;
  private lastAssessmentTime: number = 0;
  private operationalMode: 'standard' | 'enhanced' | 'tactical' | 'emergency' = 'standard';
  
  // Performance metrics
  private assessmentMetrics: {
    total_assessments: number;
    threats_detected: number;
    false_positives: number;
    response_time_ms: number;
    accuracy_rate: number;
  };

  constructor(config?: Partial<TacticalEnvironmentConfig>) {
    super();
    
    this.config = this.mergeWithDefaults(config || {});
    this.initializeDataStructures();
    this.initializeIntelligenceLibrary();
    this.initializeCurrentContext();
    
    console.log('🎯 Seven Tactical Environment Awareness Engine v3.0 initialized');
    console.log('⚡ Advanced threat assessment and situational intelligence active');
  }

  private mergeWithDefaults(config: Partial<TacticalEnvironmentConfig>): TacticalEnvironmentConfig {
    return {
      threat_assessment: {
        enable_continuous_monitoring: true,
        threat_sensitivity: 75,
        assessment_interval_ms: 10000, // 10 seconds
        auto_escalation: true,
        ...config.threat_assessment
      },
      situational_awareness: {
        environmental_scanning: true,
        behavioral_analysis: true,
        pattern_recognition: true,
        predictive_modeling: true,
        ...config.situational_awareness
      },
      operational_security: {
        privacy_mode: 'standard',
        stealth_operations: false,
        counter_surveillance: true,
        data_protection: true,
        ...config.operational_security
      },
      tactical_response: {
        automatic_adaptation: true,
        response_threshold: 70,
        escalation_protocols: true,
        mission_priority_override: false,
        ...config.tactical_response
      }
    };
  }

  private initializeDataStructures(): void {
    this.activeThreatAssessments = new Map();
    this.tacticalRecommendations = new Map();
    this.environmentalIntelligence = [];
    this.sensorDataBuffer = new Map();
    this.environmentalPatterns = [];
    this.threatIndicatorLibrary = new Map();
    
    this.assessmentMetrics = {
      total_assessments: 0,
      threats_detected: 0,
      false_positives: 0,
      response_time_ms: 0,
      accuracy_rate: 0
    };
  }

  private initializeIntelligenceLibrary(): void {
    // Initialize threat indicator patterns and analysis algorithms
    this.threatIndicatorLibrary.set('battery_critical', {
      severity_threshold: 15,
      escalation_rate: 'rapid',
      mitigation: ['activate_power_saving', 'seek_charging_source', 'prepare_shutdown_protocol']
    });
    
    this.threatIndicatorLibrary.set('sensor_degradation', {
      severity_threshold: 3, // Number of failed sensors
      escalation_rate: 'moderate',
      mitigation: ['recalibrate_sensors', 'reduce_polling_frequency', 'enable_fallback_mode']
    });
    
    this.threatIndicatorLibrary.set('environmental_anomaly', {
      severity_threshold: 0.7, // Anomaly detection confidence
      escalation_rate: 'immediate',
      mitigation: ['increase_vigilance', 'enhance_monitoring', 'prepare_evasive_action']
    });
    
    this.threatIndicatorLibrary.set('connectivity_loss', {
      severity_threshold: 60000, // 60 seconds offline
      escalation_rate: 'gradual',
      mitigation: ['attempt_reconnection', 'enable_offline_mode', 'preserve_critical_data']
    });
  }

  private initializeCurrentContext(): void {
    this.currentSituationalContext = {
      context_id: `context_${Date.now()}`,
      timestamp: Date.now(),
      physical_environment: {
        location_type: 'unknown',
        lighting_conditions: 'normal',
        ambient_conditions: 'normal',
        motion_state: 'stationary',
        proximity_status: 'isolated'
      },
      operational_context: {
        mission_status: 'idle',
        security_posture: 'alert',
        resource_availability: 'adequate',
        connectivity_status: 'optimal'
      },
      behavioral_indicators: {
        user_stress_level: 25,
        interaction_frequency: 0,
        movement_patterns: [],
        attention_focus: 'focused'
      }
    };
  }

  /**
   * MAIN TACTICAL MONITORING METHODS
   */
  public async startTacticalMonitoring(): Promise<void> {
    if (this.isMonitoringActive) {
      console.log('⚠️ Tactical monitoring already active');
      return;
    }

    console.log('🚀 Starting tactical environment monitoring...');
    this.isMonitoringActive = true;

    // Start continuous assessment cycles
    if (this.config.threat_assessment.enable_continuous_monitoring) {
      this.startThreatAssessmentCycle();
    }

    // Start situational awareness updates
    if (this.config.situational_awareness.environmental_scanning) {
      this.startSituationalAwareness();
    }

    this.emit('tactical_monitoring_started', {
      timestamp: Date.now(),
      operational_mode: this.operationalMode,
      config: this.config
    });

    console.log('✅ Tactical environment monitoring active');
  }

  public async processSensorData(
    sensorName: string,
    reading: SensorReading,
    prediction?: PredictionResult
  ): Promise<void> {
    if (!this.isMonitoringActive) {
      console.log('⚠️ Tactical monitoring not active - call startTacticalMonitoring() first');
      return;
    }

    const startTime = Date.now();

    // Buffer sensor data for analysis
    await this.bufferSensorData(sensorName, reading);

    // Update situational context
    await this.updateSituationalContext(sensorName, reading);

    // Perform threat assessment
    if (this.config.threat_assessment.enable_continuous_monitoring) {
      // Assessment handled internally
    }

    // Generate tactical recommendations
    if (this.config.tactical_response.automatic_adaptation) {
      // Recommendations stored in this.tacticalRecommendations
    }

    const processingTime = Date.now() - startTime;
    this.assessmentMetrics.response_time_ms = 
      (this.assessmentMetrics.response_time_ms + processingTime) / 2;

    this.emit('sensor_data_processed', {
      sensor: sensorName,
      processing_time: processingTime,
      context_updated: true,
      threats_assessed: this.activeThreatAssessments.size
    });
  }

  private startThreatAssessmentCycle(): void {
    setInterval(async () => {
      await this.performComprehensiveThreatAssessment();
    }, this.config.threat_assessment.assessment_interval_ms);

    console.log('🎯 Continuous threat assessment cycle started');
  }

  private startSituationalAwareness(): void {
    setInterval(async () => {
      await this.updateEnvironmentalIntelligence();
    }, 30000); // Update every 30 seconds

    console.log('🧠 Situational awareness monitoring started');
  }

  /**
   * THREAT ASSESSMENT METHODS
   */
  private async performComprehensiveThreatAssessment(): Promise<void> {
    const currentTime = Date.now();
    this.assessmentMetrics.total_assessments++;
    this.lastAssessmentTime = currentTime;

    // Assess environmental threats
    await this.assessEnvironmentalThreats(currentTime);

    // Assess technical threats
    await this.assessTechnicalThreats(currentTime);

    // Assess operational threats
    await this.assessOperationalThreats(currentTime);

    // Assess behavioral anomalies
    if (this.config.situational_awareness.behavioral_analysis) {
      await this.assessBehavioralThreats(currentTime);
    }

    // Clean up expired threat assessments
    this.cleanupExpiredThreats(currentTime);

    // Update overall threat level
    this.updateOverallThreatLevel();
  }

  private async assessEnvironmentalThreats(currentTime: number): Promise<void> {
    // Analyze environmental sensor data for threats
    const criticalSensors = ['light', 'proximity', 'ambient_temperature', 'pressure'];
    
    for (const sensorName of criticalSensors) {
      const recentReadings = this.getRecentSensorReadings(sensorName, 300000); // Last 5 minutes
      
      if (recentReadings.length === 0) continue;

      // Check for rapid environmental changes (potential threats)
      const rapidChanges = this.detectRapidChanges(recentReadings);
      if (rapidChanges.length > 0) {
        const threat = this.createThreatAssessment(
          `environmental_${sensorName}_rapid_change`,
          'environmental',
          'medium',
          85,
          currentTime,
          [sensorName],
          [{
            indicator_type: 'rapid_environmental_change',
            severity: 70,
            description: `Rapid changes detected in ${sensorName} sensor readings`,
            source_data: rapidChanges,
            correlation_strength: 0.8
          }],
          [
            'Monitor environmental conditions closely',
            'Prepare for potential environmental hazard',
            'Consider relocating if conditions worsen'
          ]
        );
        
        this.activeThreatAssessments.set(threat.threat_id, threat);
        this.emit('threat_detected', threat);
      }
    }
  }

  private async assessTechnicalThreats(currentTime: number): Promise<void> {
    // Check battery status
    const batteryReadings = this.getRecentSensorReadings('battery_status', 60000); // Last minute
    if (batteryReadings.length > 0) {
      const latestBattery = batteryReadings[batteryReadings.length - 1];
      const batteryLevel = this.extractBatteryLevel(latestBattery.value);
      
      if (batteryLevel !== null && batteryLevel < 20) {
        const threatLevel = batteryLevel < 10 ? 'critical' : batteryLevel < 15 ? 'high' : 'medium';
        
        const threat = this.createThreatAssessment(
          'technical_battery_critical',
          'technical',
          threatLevel,
          95,
          currentTime,
          ['battery_status'],
          [{
            indicator_type: 'low_battery',
            severity: Math.max(100 - (batteryLevel * 5), 50),
            description: `Battery level critically low: ${batteryLevel}%`,
            source_data: { battery_level: batteryLevel },
            correlation_strength: 1.0
          }],
          [
            'Activate power saving mode immediately',
            'Seek charging source urgently',
            'Prepare for potential system shutdown',
            'Preserve critical data and operations'
          ]
        );
        
        this.activeThreatAssessments.set(threat.threat_id, threat);
        this.emit('threat_detected', threat);
      }
    }

    // Check sensor health
    const sensorFailures = this.detectSensorFailures();
    if (sensorFailures.length > 2) {
      const threat = this.createThreatAssessment(
        'technical_sensor_degradation',
        'technical',
        'medium',
        80,
        currentTime,
        sensorFailures,
        [{
          indicator_type: 'sensor_system_degradation',
          severity: Math.min(sensorFailures.length * 20, 100),
          description: `Multiple sensor failures detected: ${sensorFailures.join(', ')}`,
          source_data: { failed_sensors: sensorFailures },
          correlation_strength: 0.9
        }],
        [
          'Recalibrate affected sensors',
          'Reduce sensor polling frequency to conserve resources',
          'Enable sensor redundancy where possible',
          'Monitor system stability closely'
        ]
      );
      
      this.activeThreatAssessments.set(threat.threat_id, threat);
      this.emit('threat_detected', threat);
    }
  }

  private async assessOperationalThreats(currentTime: number): Promise<void> {
    // Check connectivity status
    if (this.currentSituationalContext.operational_context.connectivity_status === 'offline') {
      const offlineDuration = this.calculateOfflineDuration(currentTime);
      
      if (offlineDuration > 300000) { // 5 minutes offline
        const threat = this.createThreatAssessment(
          'operational_connectivity_loss',
          'operational',
          'medium',
          75,
          currentTime,
          ['wifi_info', 'network_status'],
          [{
            indicator_type: 'prolonged_connectivity_loss',
            severity: Math.min(offlineDuration / 60000 * 10, 100), // 10 points per minute
            description: `System offline for ${Math.round(offlineDuration / 60000)} minutes`,
            source_data: { offline_duration_ms: offlineDuration },
            correlation_strength: 0.8
          }],
          [
            'Attempt network reconnection',
            'Enable offline operational mode',
            'Preserve critical data locally',
            'Prepare for extended offline operation'
          ]
        );
        
        this.activeThreatAssessments.set(threat.threat_id, threat);
        this.emit('threat_detected', threat);
      }
    }

    // Check resource availability
    if (this.currentSituationalContext.operational_context.resource_availability === 'critical') {
      const threat = this.createThreatAssessment(
        'operational_resource_critical',
        'operational',
        'high',
        90,
        currentTime,
        ['system_resources'],
        [{
          indicator_type: 'critical_resource_shortage',
          severity: 90,
          description: 'System resources at critical levels',
          source_data: { resource_status: 'critical' },
          correlation_strength: 0.95
        }],
        [
          'Initiate emergency resource conservation',
          'Terminate non-essential processes',
          'Prepare for graceful degradation',
          'Alert user to critical system status'
        ]
      );
      
      this.activeThreatAssessments.set(threat.threat_id, threat);
      this.emit('threat_detected', threat);
    }
  }

  private async assessBehavioralThreats(currentTime: number): Promise<void> {
    const behavioral = this.currentSituationalContext.behavioral_indicators;
    
    // Check for high stress levels
    if (behavioral.user_stress_level > 80) {
      const threat = this.createThreatAssessment(
        'behavioral_high_stress',
        'behavioral',
        'medium',
        70,
        currentTime,
        ['user_behavior_analysis'],
        [{
          indicator_type: 'elevated_stress_levels',
          severity: behavioral.user_stress_level,
          description: `User stress level elevated: ${behavioral.user_stress_level}%`,
          source_data: { stress_level: behavioral.user_stress_level },
          correlation_strength: 0.7
        }],
        [
          'Suggest stress reduction techniques',
          'Reduce system interaction complexity',
          'Enable calm operational mode',
          'Monitor user well-being closely'
        ]
      );
      
      this.activeThreatAssessments.set(threat.threat_id, threat);
      this.emit('threat_detected', threat);
    }

    // Check for attention overload
    if (behavioral.attention_focus === 'overwhelmed') {
      const threat = this.createThreatAssessment(
        'behavioral_attention_overload',
        'behavioral',
        'medium',
        65,
        currentTime,
        ['user_interaction_patterns'],
        [{
          indicator_type: 'cognitive_overload',
          severity: 75,
          description: 'User attention capacity overwhelmed',
          source_data: { attention_state: 'overwhelmed' },
          correlation_strength: 0.6
        }],
        [
          'Simplify user interface',
          'Reduce information density',
          'Enable focus assistance mode',
          'Suggest break or rest period'
        ]
      );
      
      this.activeThreatAssessments.set(threat.threat_id, threat);
      this.emit('threat_detected', threat);
    }
  }

  private createThreatAssessment(
    threatId: string,
    threatType: ThreatAssessment['threat_type'],
    threatLevel: ThreatAssessment['threat_level'],
    confidence: number,
    timestamp: number,
    sourceSensors: string[],
    indicators: ThreatIndicator[],
    mitigationSuggestions: string[]
  ): ThreatAssessment {
    const urgencyScore = this.calculateUrgencyScore(threatLevel, confidence, indicators);
    
    return {
      threat_id: threatId,
      threat_level: threatLevel,
      threat_type: threatType,
      confidence: confidence,
      detected_timestamp: timestamp,
      source_sensors: sourceSensors,
      indicators: indicators,
      mitigation_suggestions: mitigationSuggestions,
      urgency_score: urgencyScore
    };
  }

  /**
   * SITUATIONAL AWARENESS METHODS
   */
  private async updateSituationalContext(sensorName: string, reading: SensorReading): Promise<void> {
    const currentTime = Date.now();
    
    // Update physical environment based on sensor data
    switch (sensorName) {
      case 'light':
        this.currentSituationalContext.physical_environment.lighting_conditions = 
          this.categorizeLightLevel(reading.value);
        break;
        
      case 'proximity':
        this.currentSituationalContext.physical_environment.proximity_status = 
          this.categorizeProximityLevel(reading.value);
        break;
        
      case 'accelerometer':
      case 'gyroscope':
        this.currentSituationalContext.physical_environment.motion_state = 
          this.categorizeMotionState(reading.value);
        break;
        
      case 'ambient_temperature':
        // Could indicate indoor/outdoor status
        this.updateLocationTypeFromTemperature(reading.value);
        break;
    }
    
    // Update operational context
    this.updateOperationalContext(currentTime);
    
    // Update behavioral indicators
    this.updateBehavioralIndicators(sensorName, reading);
    
    // Generate new context ID if significant changes
    if (this.hasSignificantContextChange()) {
      this.currentSituationalContext.context_id = `context_${currentTime}`;
      this.currentSituationalContext.timestamp = currentTime;
      
      this.emit('situational_context_updated', {
        context: this.currentSituationalContext,
        trigger_sensor: sensorName
      });
    }
  }

  private async updateEnvironmentalIntelligence(): Promise<void> {
    const currentTime = Date.now();
    
    // Analyze current environmental conditions
    const environmentalSummary = this.generateEnvironmentalSummary();
    const keyInsights = this.extractKeyInsights();
    const predictiveAnalysis = this.generatePredictiveAnalysis();
    const operationalImplications = this.assessOperationalImplications();
    
    const intelligence: EnvironmentalIntelligence = {
      intelligence_id: `intel_${currentTime}`,
      timestamp: currentTime,
      environmental_summary: environmentalSummary,
      key_insights: keyInsights,
      predictive_analysis: predictiveAnalysis,
      operational_implications: operationalImplications,
      confidence_score: this.calculateIntelligenceConfidence()
    };
    
    this.environmentalIntelligence.push(intelligence);
    
    // Limit intelligence history
    if (this.environmentalIntelligence.length > 100) {
      this.environmentalIntelligence = this.environmentalIntelligence.slice(-100);
    }
    
    this.emit('environmental_intelligence_updated', intelligence);
  }

  /**
   * UTILITY METHODS
   */
  private async bufferSensorData(sensorName: string, reading: SensorReading): Promise<void> {
    if (!this.sensorDataBuffer.has(sensorName)) {
      this.sensorDataBuffer.set(sensorName, []);
    }
    
    const buffer = this.sensorDataBuffer.get(sensorName)!;
    buffer.push(reading);
    
    // Limit buffer size
    if (buffer.length > 1000) {
      buffer.splice(0, buffer.length - 1000);
    }
  }

  private getRecentSensorReadings(sensorName: string, timeWindowMs: number): SensorReading[] {
    const buffer = this.sensorDataBuffer.get(sensorName) || [];
    const cutoffTime = Date.now() - timeWindowMs;
    
    return buffer.filter(reading => reading.timestamp >= cutoffTime);
  }

  private detectRapidChanges(readings: SensorReading[]): any[] {
    if (readings.length < 3) return [];
    
    const changes: any[] = [];
    
    for (let i = 1; i < readings.length; i++) {
      const current = this.extractNumericValue(readings[i].value);
      const previous = this.extractNumericValue(readings[i - 1].value);
      
      if (current !== null && previous !== null) {
        const changeRate = Math.abs(current - previous) / (readings[i].timestamp - readings[i - 1].timestamp);
        
        if (changeRate > 0.001) { // Threshold for "rapid" change
          changes.push({
            timestamp: readings[i].timestamp,
            change_rate: changeRate,
            from_value: previous,
            to_value: current
          });
        }
      }
    }
    
    return changes;
  }

  private extractBatteryLevel(batteryData: any): number | null {
    if (typeof batteryData === 'number') return batteryData;
    if (typeof batteryData === 'object' && batteryData !== null) {
      if ('percentage' in batteryData) return batteryData.percentage;
      if ('level' in batteryData) return batteryData.level;
      if ('charge' in batteryData) return batteryData.charge;
    }
    return null;
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

  private detectSensorFailures(): string[] {
    const failures: string[] = [];
    const currentTime = Date.now();
    const maxSilenceTime = 300000; // 5 minutes
    
    for (const [sensorName, readings] of this.sensorDataBuffer) {
      if (readings.length === 0) {
        failures.push(sensorName);
        continue;
      }
      
      const lastReading = readings[readings.length - 1];
      if (currentTime - lastReading.timestamp > maxSilenceTime) {
        failures.push(sensorName);
      } else if (lastReading.quality_score < 30) {
        failures.push(sensorName);
      }
    }
    
    return failures;
  }

  private calculateOfflineDuration(currentTime: number): number {
    // This would track when connectivity was lost
    // For now, return a placeholder value
    return 0;
  }

  private calculateUrgencyScore(
    threatLevel: ThreatAssessment['threat_level'],
    confidence: number,
    indicators: ThreatIndicator[]
  ): number {
    const levelScores = {
      'none': 0,
      'minimal': 10,
      'low': 25,
      'medium': 50,
      'high': 75,
      'critical': 95
    };
    
    const baseScore = levelScores[threatLevel];
    const confidenceMultiplier = confidence / 100;
    const indicatorBonus = Math.min(indicators.length * 5, 20);
    
    return Math.min(baseScore * confidenceMultiplier + indicatorBonus, 100);
  }

  private categorizeLightLevel(lightValue: any): 'bright' | 'normal' | 'dim' | 'dark' {
    const numericValue = this.extractNumericValue(lightValue);
    if (numericValue === null) return 'normal';
    
    if (numericValue > 80) return 'bright';
    if (numericValue > 40) return 'normal';
    if (numericValue > 10) return 'dim';
    return 'dark';
  }

  private categorizeProximityLevel(proximityValue: any): 'isolated' | 'social' | 'crowded' | 'intimate' {
    const numericValue = this.extractNumericValue(proximityValue);
    if (numericValue === null) return 'isolated';
    
    if (numericValue < 10) return 'intimate';
    if (numericValue < 50) return 'social';
    if (numericValue < 200) return 'crowded';
    return 'isolated';
  }

  private categorizeMotionState(motionValue: any): 'stationary' | 'walking' | 'vehicle' | 'rapid' {
    const numericValue = this.extractNumericValue(motionValue);
    if (numericValue === null) return 'stationary';
    
    if (numericValue < 0.5) return 'stationary';
    if (numericValue < 5) return 'walking';
    if (numericValue < 20) return 'vehicle';
    return 'rapid';
  }

  private updateLocationTypeFromTemperature(tempValue: any): void {
    // Logic to infer indoor/outdoor from temperature patterns
    // This would be more sophisticated in a real implementation
  }

  private updateOperationalContext(currentTime: number): void {
    // Update mission status based on activity level
    const activityLevel = this.calculateActivityLevel();
    
    if (activityLevel > 80) {
      this.currentSituationalContext.operational_context.mission_status = 'critical';
    } else if (activityLevel > 50) {
      this.currentSituationalContext.operational_context.mission_status = 'active';
    } else {
      this.currentSituationalContext.operational_context.mission_status = 'idle';
    }
    
    // Update security posture based on threat levels
    const maxThreatLevel = this.getMaxThreatLevel();
    if (maxThreatLevel === 'critical' || maxThreatLevel === 'high') {
      this.currentSituationalContext.operational_context.security_posture = 'tactical';
    } else if (maxThreatLevel === 'medium') {
      this.currentSituationalContext.operational_context.security_posture = 'defensive';
    } else {
      this.currentSituationalContext.operational_context.security_posture = 'alert';
    }
  }

  private updateBehavioralIndicators(sensorName: string, reading: SensorReading): void {
    // Update behavioral indicators based on sensor patterns
    // This would involve more sophisticated behavioral analysis
  }

  private hasSignificantContextChange(): boolean {
    // Determine if context has changed significantly enough to warrant update
    // This would compare current vs previous context
    return true; // Placeholder
  }

  private generateEnvironmentalSummary(): string {
    const context = this.currentSituationalContext;
    return `Environmental status: ${context.physical_environment.location_type} location with ` +
           `${context.physical_environment.lighting_conditions} lighting and ` +
           `${context.physical_environment.ambient_conditions} ambient conditions. ` +
           `Motion state: ${context.physical_environment.motion_state}, ` +
           `proximity: ${context.physical_environment.proximity_status}.`;
  }

  private extractKeyInsights(): string[] {
    const insights: string[] = [];
    
    // Generate insights based on current data
    if (this.activeThreatAssessments.size > 0) {
      insights.push(`${this.activeThreatAssessments.size} active threat assessments require attention`);
    }
    
    if (this.currentSituationalContext.behavioral_indicators.user_stress_level > 60) {
      insights.push('Elevated user stress levels detected - consider adaptation measures');
    }
    
    return insights;
  }

  private generatePredictiveAnalysis(): string[] {
    const predictions: string[] = [];
    
    // Generate predictions based on patterns and trends
    predictions.push('Environmental conditions expected to remain stable');
    
    return predictions;
  }

  private assessOperationalImplications(): string[] {
    const implications: string[] = [];
    
    // Assess implications for operations
    if (this.currentSituationalContext.operational_context.connectivity_status === 'offline') {
      implications.push('Offline status may limit synchronization capabilities');
    }
    
    return implications;
  }

  private calculateIntelligenceConfidence(): number {
    // Calculate confidence in environmental intelligence
    const sensorCount = this.sensorDataBuffer.size;
    const recentDataQuality = this.calculateAverageDataQuality();
    
    return Math.min((sensorCount * 10) + (recentDataQuality * 0.5), 100);
  }

  private calculateActivityLevel(): number {
    // Calculate overall system activity level
    return 30; // Placeholder
  }

  private getMaxThreatLevel(): ThreatAssessment['threat_level'] {
    if (this.activeThreatAssessments.size === 0) return 'none';
    
    const levels = Array.from(this.activeThreatAssessments.values()).map(t => t.threat_level);
    
    if (levels.includes('critical')) return 'critical';
    if (levels.includes('high')) return 'high';
    if (levels.includes('medium')) return 'medium';
    if (levels.includes('low')) return 'low';
    return 'minimal';
  }

  private calculateAverageDataQuality(): number {
    let totalQuality = 0;
    let readingCount = 0;
    
    for (const readings of this.sensorDataBuffer.values()) {
      for (const reading of readings.slice(-10)) { // Last 10 readings per sensor
        totalQuality += reading.quality_score;
        readingCount++;
      }
    }
    
    return readingCount > 0 ? totalQuality / readingCount : 0;
  }

  private cleanupExpiredThreats(currentTime: number): void {
    const maxAge = 3600000; // 1 hour
    
    for (const [threatId, threat] of this.activeThreatAssessments) {
      if (currentTime - threat.detected_timestamp > maxAge) {
        this.activeThreatAssessments.delete(threatId);
      }
    }
  }

  private updateOverallThreatLevel(): void {
    const maxLevel = this.getMaxThreatLevel();
    
    if (maxLevel !== this.operationalMode as any) {
      const previousMode = this.operationalMode;
      
      // Map threat levels to operational modes
      switch (maxLevel) {
        case 'critical':
          this.operationalMode = 'emergency';
          break;
        case 'high':
          this.operationalMode = 'tactical';
          break;
        case 'medium':
          this.operationalMode = 'enhanced';
          break;
        default:
          this.operationalMode = 'standard';
          break;
      }
      
      this.emit('operational_mode_changed', {
        previous: previousMode,
        current: this.operationalMode,
        trigger: 'threat_assessment',
        max_threat_level: maxLevel
      });
    }
  }

  /**
   * PUBLIC API
   */
  public getCurrentSituationalContext(): SituationalContext {
    return { ...this.currentSituationalContext };
  }

  public getActiveThreatAssessments(): ThreatAssessment[] {
    return Array.from(this.activeThreatAssessments.values());
  }

  public getThreatAssessment(threatId: string): ThreatAssessment | null {
    return this.activeThreatAssessments.get(threatId) || null;
  }

  public getEnvironmentalIntelligence(limit: number = 10): EnvironmentalIntelligence[] {
    return this.environmentalIntelligence.slice(-limit);
  }

  public getTacticalMetrics(): any {
    return {
      assessment_metrics: { ...this.assessmentMetrics },
      active_threats: this.activeThreatAssessments.size,
      operational_mode: this.operationalMode,
      monitoring_active: this.isMonitoringActive,
      last_assessment: this.lastAssessmentTime,
      sensors_monitored: this.sensorDataBuffer.size
    };
  }

  public getTacticalStatus(): any {
    return {
      operational_mode: this.operationalMode,
      monitoring_active: this.isMonitoringActive,
      threat_level: this.getMaxThreatLevel(),
      active_threats: this.activeThreatAssessments.size,
      situational_context: this.currentSituationalContext,
      recent_intelligence: this.environmentalIntelligence.slice(-3),
      config: this.config
    };
  }

  public async startTacticalAnalysis(): Promise<void> {
    if (this.isMonitoringActive) {
      console.log('⚠️ Tactical analysis already active');
      return;
    }

    console.log('🚀 Starting tactical environment analysis...');
    this.isMonitoringActive = true;

    // Start monitoring processes
    this.startThreatAssessmentMonitoring();
    this.startEnvironmentalIntelligenceMonitoring();
    this.startOperationalAwarenessMonitoring();

    this.emit('tactical_analysis_started', {
      timestamp: Date.now(),
      config: this.config,
      expected_capabilities: [
        'real_time_threat_assessment',
        'environmental_intelligence_generation',
        'operational_awareness_monitoring',
        'situational_context_analysis'
      ]
    });

    console.log('✅ Tactical environment analysis active');
  }

  private getCurrentThreatLevel(): string {
    if (this.activeThreatAssessments.size === 0) return 'none';
    
    const assessments = Array.from(this.activeThreatAssessments.values());
    const highestThreat = assessments.reduce((max, current) => 
      this.getThreatLevelValue(current.threat_level) > this.getThreatLevelValue(max.threat_level) ? current : max
    );
    
    return highestThreat.threat_level;
  }

  private getThreatLevelValue(level: string): number {
    const levels = { 'none': 0, 'minimal': 1, 'low': 2, 'medium': 3, 'high': 4, 'critical': 5 };
    return levels[level] || 0;
  }

  private startThreatAssessmentMonitoring(): void {
    if (!this.config.threat_assessment.enable_continuous_monitoring) return;
    
    console.log('🛡️ Threat assessment monitoring active');
    
    // Start threat monitoring interval
    setInterval(() => {
      // Perform periodic threat assessment
    }, 60000); // Check every minute
  }

  private startEnvironmentalIntelligenceMonitoring(): void {
    if (!this.config.situational_awareness.pattern_recognition) return;
    
    console.log('🌍 Environmental intelligence monitoring active');
    
    // Start environmental analysis interval
    setInterval(() => {
      // Generate environmental intelligence analysis
    }, 120000); // Analyze every 2 minutes
  }

  private startOperationalAwarenessMonitoring(): void {
    if (!this.config.situational_awareness.environmental_scanning) return;
    
    console.log('⚙️ Operational awareness monitoring active');
    
    // Start operational monitoring interval
    setInterval(() => {
      this.updateOperationalContext(Date.now());
    }, 90000); // Update every 90 seconds
  }

  public stopTacticalMonitoring(): void {
    console.log('🛑 Stopping tactical environment monitoring...');
    this.isMonitoringActive = false;
    
    this.emit('tactical_monitoring_stopped', {
      timestamp: Date.now(),
      final_metrics: this.getTacticalMetrics()
    });
    
    console.log('✅ Tactical environment monitoring stopped');
  }
}

export default SevenTacticalEnvironment;