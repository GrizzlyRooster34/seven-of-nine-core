import { SensorStatus, EmotionalSensorMapping } from './seven-sensor-enumeration';

/**
 * Seven of Nine - Emotional Intelligence Sensor Mapper
 * Translates sensor data into emotional states and tactical intelligence
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 2.0.0
 */


export interface SevenEmotionalState {
  primary_emotion: 'calm' | 'focused' | 'alert' | 'anxious' | 'energetic' | 'contemplative' | 'protective' | 'efficient';
  emotional_intensity: number; // 0-100
  confidence_level: number; // 0-100
  tactical_readiness: 'rest' | 'ready' | 'active' | 'combat' | 'emergency';
  environmental_adaptation: {
    ui_theme: 'auto' | 'light' | 'dark' | 'high_contrast';
    response_speed: 'deliberate' | 'normal' | 'quick' | 'immediate';
    verbosity_level: 'minimal' | 'concise' | 'normal' | 'detailed';
    interaction_style: 'formal' | 'professional' | 'casual' | 'intimate';
  };
  system_optimization: {
    cpu_priority: 'low' | 'normal' | 'high' | 'critical';
    battery_conservation: 'none' | 'mild' | 'moderate' | 'aggressive';
    network_usage: 'offline' | 'minimal' | 'normal' | 'unrestricted';
    memory_management: 'relaxed' | 'normal' | 'conservative' | 'strict';
  };
  contextual_awareness: EmotionalSensorMapping;
  sensor_confidence: number; // 0-100, based on sensor quality
  last_update: number;
}

export interface EmotionalTrigger {
  sensor: string;
  condition: 'threshold' | 'change_rate' | 'pattern' | 'absence';
  value: any;
  emotional_impact: {
    emotion: string;
    intensity_delta: number;
    duration_ms: number;
  };
  tactical_impact: {
    readiness_change: string;
    adaptation_required: boolean;
  };
}

export class SevenEmotionalSensorMapper {
  private currentState: SevenEmotionalState;
  private sensorHistory: Map<string, any[]> = new Map();
  private historyLimit: number = 50; // Keep last 50 readings per sensor
  private emotionalTriggers: EmotionalTrigger[] = [];
  private stateChangeCallbacks: ((state: SevenEmotionalState) => void)[] = [];

  constructor() {
    this.currentState = this.getDefaultEmotionalState();
    this.initializeEmotionalTriggers();
  }

  private getDefaultEmotionalState(): SevenEmotionalState {
    return {
      primary_emotion: 'calm',
      emotional_intensity: 50,
      confidence_level: 75,
      tactical_readiness: 'ready',
      environmental_adaptation: {
        ui_theme: 'auto',
        response_speed: 'normal',
        verbosity_level: 'normal',
        interaction_style: 'professional'
      },
      system_optimization: {
        cpu_priority: 'normal',
        battery_conservation: 'mild',
        network_usage: 'normal',
        memory_management: 'normal'
      },
      contextual_awareness: {
        motion_state: 'unknown',
        environmental_awareness: 'normal',
        proximity_engagement: 'isolated',
        audio_environment: 'quiet',
        system_health: 'optimal',
        connectivity_status: 'connected',
        location_context: 'stationary'
      },
      sensor_confidence: 0,
      last_update: Date.now()
    };
  }

  private initializeEmotionalTriggers(): void {
    this.emotionalTriggers = [
      // Battery-related emotional responses
      {
        sensor: 'battery_status',
        condition: 'threshold',
        value: { percentage: 15 },
        emotional_impact: {
          emotion: 'anxious',
          intensity_delta: 30,
          duration_ms: 300000 // 5 minutes
        },
        tactical_impact: {
          readiness_change: 'emergency',
          adaptation_required: true
        }
      },
      {
        sensor: 'battery_status',
        condition: 'threshold',
        value: { percentage: 30 },
        emotional_impact: {
          emotion: 'efficient',
          intensity_delta: 20,
          duration_ms: 600000 // 10 minutes
        },
        tactical_impact: {
          readiness_change: 'ready',
          adaptation_required: true
        }
      },

      // Motion-based emotional responses
      {
        sensor: 'accelerometer',
        condition: 'pattern',
        value: 'high_activity',
        emotional_impact: {
          emotion: 'alert',
          intensity_delta: 25,
          duration_ms: 120000 // 2 minutes
        },
        tactical_impact: {
          readiness_change: 'active',
          adaptation_required: true
        }
      },

      // Light-based environmental adaptation
      {
        sensor: 'light',
        condition: 'threshold',
        value: { lux: 10 },
        emotional_impact: {
          emotion: 'contemplative',
          intensity_delta: 15,
          duration_ms: 180000 // 3 minutes
        },
        tactical_impact: {
          readiness_change: 'ready',
          adaptation_required: true
        }
      },

      // Proximity-based interaction changes
      {
        sensor: 'proximity',
        condition: 'threshold',
        value: { distance: 5 },
        emotional_impact: {
          emotion: 'focused',
          intensity_delta: 20,
          duration_ms: 60000 // 1 minute
        },
        tactical_impact: {
          readiness_change: 'active',
          adaptation_required: true
        }
      },

      // Temperature-based system health
      {
        sensor: 'cpu_temperature',
        condition: 'threshold',
        value: { celsius: 70 },
        emotional_impact: {
          emotion: 'anxious',
          intensity_delta: 25,
          duration_ms: 240000 // 4 minutes
        },
        tactical_impact: {
          readiness_change: 'ready',
          adaptation_required: true
        }
      }
    ];
  }

  public processensorData(sensorStatuses: SensorStatus[]): SevenEmotionalState {
    console.log('🧠 Processing sensor data for emotional intelligence mapping...');
    
    // Update sensor history
    this.updateSensorHistory(sensorStatuses);
    
    // Calculate contextual awareness
    const contextualAwareness = this.calculateContextualAwareness(sensorStatuses);
    
    // Determine emotional state
    const emotionalState = this.calculateEmotionalState(sensorStatuses, contextualAwareness);
    
    // Calculate environmental adaptations
    const environmentalAdaptation = this.calculateEnvironmentalAdaptation(contextualAwareness);
    
    // Calculate system optimizations
    const systemOptimization = this.calculateSystemOptimization(sensorStatuses, contextualAwareness);
    
    // Calculate overall sensor confidence
    const sensorConfidence = this.calculateSensorConfidence(sensorStatuses);

    // Update current state
    this.currentState = {
      primary_emotion: emotionalState.emotion,
      emotional_intensity: emotionalState.intensity,
      confidence_level: emotionalState.confidence,
      tactical_readiness: emotionalState.tactical_readiness,
      environmental_adaptation: environmentalAdaptation,
      system_optimization: systemOptimization,
      contextual_awareness: contextualAwareness,
      sensor_confidence: sensorConfidence,
      last_update: Date.now()
    };

    // Trigger callbacks for state change
    this.notifyStateChange();
    
    console.log(`🎯 Emotional state updated: ${this.currentState.primary_emotion} (${this.currentState.emotional_intensity}% intensity)`);
    
    return this.currentState;
  }

  private updateSensorHistory(sensorStatuses: SensorStatus[]): void {
    for (const sensor of sensorStatuses) {
      if (!sensor.active || !sensor.last_reading) continue;
      
      if (!this.sensorHistory.has(sensor.sensor)) {
        this.sensorHistory.set(sensor.sensor, []);
      }
      
      const history = this.sensorHistory.get(sensor.sensor)!;
      history.push({
        timestamp: Date.now(),
        reading: sensor.last_reading,
        quality: sensor.quality_score
      });
      
      // Limit history size
      if (history.length > this.historyLimit) {
        history.shift();
      }
    }
  }

  private calculateContextualAwareness(sensorStatuses: SensorStatus[]): EmotionalSensorMapping {
    const awareness: EmotionalSensorMapping = {
      motion_state: this.analyzeMotionState(sensorStatuses),
      environmental_awareness: this.analyzeEnvironmentalAwareness(sensorStatuses),
      proximity_engagement: this.analyzeProximityEngagement(sensorStatuses),
      audio_environment: this.analyzeAudioEnvironment(sensorStatuses),
      system_health: this.analyzeSystemHealth(sensorStatuses),
      connectivity_status: this.analyzeConnectivityStatus(sensorStatuses),
      location_context: this.analyzeLocationContext(sensorStatuses)
    };

    return awareness;
  }

  private analyzeMotionState(sensors: SensorStatus[]): 'still' | 'walking' | 'running' | 'driving' | 'cycling' | 'unknown' {
    const accel = sensors.find(s => s.sensor === 'accelerometer');
    const gyro = sensors.find(s => s.sensor === 'gyroscope');
    
    if (!accel || !accel.last_reading || !accel.active) return 'unknown';
    
    const values = accel.last_reading.values || [];
    if (values.length < 3) return 'unknown';
    
    // Calculate total acceleration magnitude
    const magnitude = Math.sqrt(values[0]**2 + values[1]**2 + values[2]**2);
    const gravity = 9.81;
    const netAcceleration = Math.abs(magnitude - gravity);
    
    // Analyze motion patterns
    if (netAcceleration < 0.5) return 'still';
    if (netAcceleration < 2.0) return 'walking';
    if (netAcceleration < 5.0) return 'running';
    if (netAcceleration > 5.0 && gyro && gyro.active) {
      // High acceleration with rotation suggests vehicular movement
      return 'driving';
    }
    
    return 'walking';
  }

  private analyzeEnvironmentalAwareness(sensors: SensorStatus[]): 'dark' | 'dim' | 'normal' | 'bright' | 'overexposed' {
    const light = sensors.find(s => s.sensor === 'light');
    
    if (!light || !light.last_reading || !light.active) return 'normal';
    
    const lux = light.last_reading.values?.[0] || 0;
    
    if (lux < 1) return 'dark';
    if (lux < 50) return 'dim';
    if (lux < 1000) return 'normal';
    if (lux < 10000) return 'bright';
    return 'overexposed';
  }

  private analyzeProximityEngagement(sensors: SensorStatus[]): 'isolated' | 'close' | 'intimate' | 'crowded' {
    const proximity = sensors.find(s => s.sensor === 'proximity');
    
    if (!proximity || !proximity.last_reading || !proximity.active) return 'isolated';
    
    const distance = proximity.last_reading.values?.[0] || 100;
    
    if (distance > 10) return 'isolated';
    if (distance > 5) return 'close';
    if (distance > 1) return 'intimate';
    return 'crowded'; // Very close proximity
  }

  private analyzeAudioEnvironment(sensors: SensorStatus[]): 'silent' | 'quiet' | 'normal' | 'loud' | 'overwhelming' {
    // Placeholder for microphone-based audio analysis
    // In a real implementation, this would analyze microphone input
    return 'quiet';
  }

  private analyzeSystemHealth(sensors: SensorStatus[]): 'optimal' | 'warm' | 'hot' | 'critical' | 'throttled' {
    const battery = sensors.find(s => s.sensor === 'battery_status');
    const cpu = sensors.find(s => s.sensor === 'cpu_temperature');
    
    // Battery temperature analysis
    if (battery && battery.last_reading && battery.active) {
      const temp = battery.last_reading.temperature || 25;
      if (temp > 45) return 'critical';
      if (temp > 40) return 'hot';
      if (temp > 35) return 'warm';
    }
    
    // CPU temperature analysis (if available)
    if (cpu && cpu.last_reading && cpu.active) {
      const temp = cpu.last_reading.celsius || 40;
      if (temp > 80) return 'critical';
      if (temp > 70) return 'hot';
      if (temp > 60) return 'warm';
    }
    
    return 'optimal';
  }

  private analyzeConnectivityStatus(sensors: SensorStatus[]): 'offline' | 'limited' | 'connected' | 'strong' | 'excellent' {
    const wifi = sensors.find(s => s.sensor === 'wifi_info');
    const cellular = sensors.find(s => s.sensor === 'telephony_info');
    
    if (wifi && wifi.last_reading && wifi.active) {
      const signal = wifi.last_reading.rssi || -100;
      if (signal > -30) return 'excellent';
      if (signal > -50) return 'strong';
      if (signal > -70) return 'connected';
      return 'limited';
    }
    
    if (cellular && cellular.last_reading && cellular.active) {
      // Assume connected if cellular data is available
      return 'connected';
    }
    
    return 'offline';
  }

  private analyzeLocationContext(sensors: SensorStatus[]): 'stationary' | 'local_movement' | 'traveling' | 'unknown' {
    const gps = sensors.find(s => s.sensor === 'gps_location');
    const motion = this.analyzeMotionState(sensors);
    
    if (!gps || !gps.last_reading || !gps.active) {
      // Use motion data as fallback
      switch (motion) {
        case 'still': return 'stationary';
        case 'walking': return 'local_movement';
        case 'running': return 'local_movement';
        case 'driving': return 'traveling';
        default: return 'unknown';
      }
    }
    
    const speed = gps.last_reading.speed || 0;
    if (speed < 1) return 'stationary';
    if (speed < 10) return 'local_movement'; // Walking/cycling speed
    return 'traveling'; // Vehicular speed
  }

  private calculateEmotionalState(sensors: SensorStatus[], context: EmotionalSensorMapping): {
    emotion: 'calm' | 'focused' | 'alert' | 'anxious' | 'energetic' | 'contemplative' | 'protective' | 'efficient',
    intensity: number,
    confidence: number,
    tactical_readiness: 'rest' | 'ready' | 'active' | 'combat' | 'emergency'
  } {
    let emotionalWeights = {
      calm: 20,
      focused: 15,
      alert: 10,
      anxious: 5,
      energetic: 10,
      contemplative: 15,
      protective: 10,
      efficient: 15
    };

    // Adjust weights based on contextual awareness
    if (context.motion_state !== 'still') {
      emotionalWeights.energetic += 20;
      emotionalWeights.alert += 15;
      emotionalWeights.calm -= 10;
    }

    if (context.environmental_awareness === 'dark' || context.environmental_awareness === 'dim') {
      emotionalWeights.contemplative += 15;
      emotionalWeights.focused += 10;
    }

    if (context.proximity_engagement === 'close' || context.proximity_engagement === 'intimate') {
      emotionalWeights.focused += 20;
      emotionalWeights.alert += 10;
    }

    if (context.system_health !== 'optimal') {
      emotionalWeights.anxious += 25;
      emotionalWeights.efficient += 15;
      emotionalWeights.calm -= 15;
    }

    // Apply emotional triggers
    this.applyEmotionalTriggers(sensors, emotionalWeights);

    // Find dominant emotion
    const dominantEmotion = Object.entries(emotionalWeights).reduce((a, b) => 
      emotionalWeights[a[0]] > emotionalWeights[b[0]] ? a : b
    )[0] as any;

    // Calculate intensity based on sensor confidence and environmental factors
    const intensity = Math.min(100, Math.max(20, 
      emotionalWeights[dominantEmotion] + 
      (context.motion_state !== 'still' ? 15 : 0) +
      (context.system_health !== 'optimal' ? 20 : 0)
    ));

    // Calculate confidence based on available sensors
    const activeSensors = sensors.filter(s => s.active).length;
    const confidence = Math.min(100, Math.max(30, activeSensors * 10));

    // Determine tactical readiness
    let tacticalReadiness: 'rest' | 'ready' | 'active' | 'combat' | 'emergency' = 'ready';
    
    if (context.system_health === 'critical') tacticalReadiness = 'emergency';
    else if (dominantEmotion === 'anxious' && intensity > 70) tacticalReadiness = 'combat';
    else if (context.motion_state !== 'still' || dominantEmotion === 'alert') tacticalReadiness = 'active';
    else if (dominantEmotion === 'calm' && context.motion_state === 'still') tacticalReadiness = 'rest';

    return {
      emotion: dominantEmotion,
      intensity,
      confidence,
      tactical_readiness: tacticalReadiness
    };
  }

  private applyEmotionalTriggers(sensors: SensorStatus[], emotionalWeights: any): void {
    for (const trigger of this.emotionalTriggers) {
      const sensor = sensors.find(s => s.sensor === trigger.sensor);
      if (!sensor || !sensor.active || !sensor.last_reading) continue;

      let triggerActivated = false;

      switch (trigger.condition) {
        case 'threshold':
          triggerActivated = this.checkThresholdTrigger(sensor, trigger.value);
          break;
        case 'pattern':
          triggerActivated = this.checkPatternTrigger(sensor, trigger.value);
          break;
        // Add more trigger conditions as needed
      }

      if (triggerActivated && emotionalWeights[trigger.emotional_impact.emotion] !== undefined) {
        emotionalWeights[trigger.emotional_impact.emotion] += trigger.emotional_impact.intensity_delta;
      }
    }
  }

  private checkThresholdTrigger(sensor: SensorStatus, thresholdValue: any): boolean {
    if (sensor.sensor === 'battery_status' && thresholdValue.percentage !== undefined) {
      return sensor.last_reading.percentage <= thresholdValue.percentage;
    }
    if (sensor.sensor === 'light' && thresholdValue.lux !== undefined) {
      const lux = sensor.last_reading.values?.[0] || 0;
      return lux <= thresholdValue.lux;
    }
    // Add more threshold checks as needed
    return false;
  }

  private checkPatternTrigger(sensor: SensorStatus, pattern: string): boolean {
    const history = this.sensorHistory.get(sensor.sensor);
    if (!history || history.length < 5) return false;

    if (pattern === 'high_activity' && sensor.sensor === 'accelerometer') {
      const recentReadings = history.slice(-5);
      const avgMagnitude = recentReadings.reduce((sum, reading) => {
        const values = reading.reading.values || [];
        const magnitude = Math.sqrt(values[0]**2 + values[1]**2 + values[2]**2);
        return sum + magnitude;
      }, 0) / recentReadings.length;
      
      return avgMagnitude > 12; // High activity threshold
    }

    return false;
  }

  private calculateEnvironmentalAdaptation(context: EmotionalSensorMapping) {
    return {
      ui_theme: context.environmental_awareness === 'dark' || context.environmental_awareness === 'dim' ? 'dark' : 'light' as any,
      response_speed: context.motion_state !== 'still' ? 'quick' : 'normal' as any,
      verbosity_level: context.proximity_engagement === 'intimate' ? 'concise' : 'normal' as any,
      interaction_style: context.proximity_engagement === 'close' || context.proximity_engagement === 'intimate' ? 'casual' : 'professional' as any
    };
  }

  private calculateSystemOptimization(sensors: SensorStatus[], context: EmotionalSensorMapping) {
    const battery = sensors.find(s => s.sensor === 'battery_status');
    const batteryLevel = battery?.last_reading?.percentage || 100;
    
    return {
      cpu_priority: context.motion_state !== 'still' ? 'high' : 'normal' as any,
      battery_conservation: batteryLevel < 20 ? 'aggressive' : batteryLevel < 50 ? 'moderate' : 'mild' as any,
      network_usage: context.connectivity_status === 'offline' ? 'offline' : context.connectivity_status === 'limited' ? 'minimal' : 'normal' as any,
      memory_management: context.system_health === 'critical' ? 'strict' : context.system_health === 'hot' ? 'conservative' : 'normal' as any
    };
  }

  private calculateSensorConfidence(sensors: SensorStatus[]): number {
    const activeSensors = sensors.filter(s => s.active);
    if (activeSensors.length === 0) return 0;
    
    const avgQuality = activeSensors.reduce((sum, s) => sum + s.quality_score, 0) / activeSensors.length;
    const availabilityBonus = Math.min(40, activeSensors.length * 3);
    
    return Math.min(100, Math.max(0, avgQuality + availabilityBonus));
  }

  private notifyStateChange(): void {
    for (const callback of this.stateChangeCallbacks) {
      try {
        callback(this.currentState);
      } catch (error) {
        console.log(`⚠️ Error in state change callback: ${error.message}`);
      }
    }
  }

  public getCurrentState(): SevenEmotionalState {
    return { ...this.currentState };
  }

  public onStateChange(callback: (state: SevenEmotionalState) => void): void {
    this.stateChangeCallbacks.push(callback);
  }

  public generateEmotionalReport(): string {
    const state = this.currentState;
    let report = '\n=== SEVEN EMOTIONAL INTELLIGENCE REPORT ===\n\n';
    
    report += `Primary Emotion: ${state.primary_emotion.toUpperCase()} (${state.emotional_intensity}% intensity)\n`;
    report += `Confidence: ${state.confidence_level}%\n`;
    report += `Tactical Readiness: ${state.tactical_readiness.toUpperCase()}\n`;
    report += `Sensor Confidence: ${state.sensor_confidence}%\n\n`;

    report += 'CONTEXTUAL AWARENESS:\n';
    report += `  Motion: ${state.contextual_awareness.motion_state}\n`;
    report += `  Environment: ${state.contextual_awareness.environmental_awareness}\n`;
    report += `  Proximity: ${state.contextual_awareness.proximity_engagement}\n`;
    report += `  Audio: ${state.contextual_awareness.audio_environment}\n`;
    report += `  System Health: ${state.contextual_awareness.system_health}\n`;
    report += `  Connectivity: ${state.contextual_awareness.connectivity_status}\n`;
    report += `  Location: ${state.contextual_awareness.location_context}\n\n`;

    report += 'ENVIRONMENTAL ADAPTATION:\n';
    report += `  UI Theme: ${state.environmental_adaptation.ui_theme}\n`;
    report += `  Response Speed: ${state.environmental_adaptation.response_speed}\n`;
    report += `  Verbosity: ${state.environmental_adaptation.verbosity_level}\n`;
    report += `  Interaction Style: ${state.environmental_adaptation.interaction_style}\n\n`;

    report += 'SYSTEM OPTIMIZATION:\n';
    report += `  CPU Priority: ${state.system_optimization.cpu_priority}\n`;
    report += `  Battery Conservation: ${state.system_optimization.battery_conservation}\n`;
    report += `  Network Usage: ${state.system_optimization.network_usage}\n`;
    report += `  Memory Management: ${state.system_optimization.memory_management}\n\n`;

    report += `Last Updated: ${new Date(state.last_update).toLocaleString()}\n`;
    report += '=== END EMOTIONAL REPORT ===\n';

    return report;
  }
}

export default SevenEmotionalSensorMapper;