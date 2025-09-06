import { Accelerometer, AccelerometerMeasurement } from 'expo-sensors';
import { EventEmitter } from 'events';

/**
 * Seven of Nine - Motion Sensor Integration
 * Advanced accelerometer and motion analysis for tactical awareness
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 3.0.0
 */


export interface MotionIntelligence {
  acceleration: {
    x: number;
    y: number;
    z: number;
    magnitude: number;
  };
  movement: {
    type: 'stationary' | 'walking' | 'running' | 'vehicle' | 'falling' | 'unknown';
    intensity: number;
    confidence: number;
    pattern: 'steady' | 'erratic' | 'rhythmic' | 'chaotic';
  };
  stability: {
    orientation_stability: number;
    movement_consistency: number;
    vibration_level: number;
  };
  tactical: {
    threat_indicators: string[];
    concealment_status: 'exposed' | 'partially_concealed' | 'concealed';
    stealth_mode: boolean;
    anomaly_detected: boolean;
  };
}

export class SevenMotionSensor extends EventEmitter {
  private isActive: boolean = false;
  private motionHistory: AccelerometerMeasurement[] = [];
  private currentReading: AccelerometerMeasurement | null = null;
  private analysisMetrics = {
    movement_changes: 0,
    stationary_time: 0,
    activity_level: 0,
    pattern_consistency: 0
  };

  private movementPatterns = {
    walking: { min: 1.5, max: 4.0, frequency: 2.0 },
    running: { min: 4.0, max: 12.0, frequency: 3.5 },
    vehicle: { min: 0.8, max: 3.0, frequency: 0.5 },
    falling: { min: 12.0, max: 50.0, frequency: 0.1 }
  };

  constructor() {
    super();
  }

  public async initialize(): Promise<boolean> {
    try {
      console.log('🏃 Initializing Seven motion intelligence...');
      
      // Check if accelerometer is available
      const isAvailable = await Accelerometer.isAvailableAsync();
      if (!isAvailable) {
        console.error('❌ Accelerometer not available');
        return false;
      }

      console.log('✅ Motion sensor initialized successfully');
      return true;

    } catch (error) {
      console.error('❌ Motion sensor initialization failed:', error);
      return false;
    }
  }

  public startTracking(updateInterval: number = 100): void {
    if (this.isActive) {
      console.log('⚠️ Motion tracking already active');
      return;
    }

    try {
      console.log('🎯 Starting tactical motion tracking...');

      // Set update interval (in milliseconds)
      Accelerometer.setUpdateInterval(updateInterval);

      // Start listening to accelerometer data
      Accelerometer.addListener((accelerometerData) => {
        this.processMotionUpdate(accelerometerData);
      });

      this.isActive = true;
      this.emit('tracking_started', { 
        timestamp: Date.now(),
        update_interval: updateInterval 
      });

    } catch (error) {
      console.error('❌ Failed to start motion tracking:', error);
      this.emit('tracking_error', { error: error.message });
    }
  }

  private processMotionUpdate(data: AccelerometerMeasurement): void {
    this.currentReading = data;
    
    // Add to history (keep last 200 readings for analysis)
    this.motionHistory.push(data);
    if (this.motionHistory.length > 200) {
      this.motionHistory.shift();
    }

    // Generate motion intelligence
    const intelligence = this.generateMotionIntelligence(data);
    
    // Update analysis metrics
    this.updateAnalysisMetrics(data);

    // Emit motion intelligence
    this.emit('motion_intelligence', {
      raw_data: data,
      intelligence,
      timestamp: Date.now()
    });

    // Check for tactical alerts
    this.checkTacticalAlerts(intelligence);
  }

  private generateMotionIntelligence(data: AccelerometerMeasurement): MotionIntelligence {
    const acceleration = {
      x: data.x,
      y: data.y,
      z: data.z,
      magnitude: Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2)
    };

    const movement = this.analyzeMovement(acceleration);
    const stability = this.analyzeStability();
    const tactical = this.generateTacticalAssessment(movement, stability);

    return {
      acceleration,
      movement,
      stability,
      tactical
    };
  }

  private analyzeMovement(acceleration: MotionIntelligence['acceleration']): MotionIntelligence['movement'] {
    const magnitude = acceleration.magnitude;
    
    // Determine movement type based on magnitude and patterns
    let type: MotionIntelligence['movement']['type'] = 'unknown';
    let confidence = 0;

    if (magnitude < 1.2) {
      type = 'stationary';
      confidence = 85;
    } else if (magnitude >= this.movementPatterns.falling.min) {
      type = 'falling';
      confidence = 95;
    } else if (this.isInRange(magnitude, this.movementPatterns.walking)) {
      type = 'walking';
      confidence = this.calculatePatternConfidence('walking') * 80;
    } else if (this.isInRange(magnitude, this.movementPatterns.running)) {
      type = 'running';
      confidence = this.calculatePatternConfidence('running') * 75;
    } else if (this.isInRange(magnitude, this.movementPatterns.vehicle)) {
      type = 'vehicle';
      confidence = this.calculatePatternConfidence('vehicle') * 70;
    }

    const intensity = this.calculateMovementIntensity(magnitude);
    const pattern = this.analyzeMovementPattern();

    return {
      type,
      intensity,
      confidence,
      pattern
    };
  }

  private isInRange(value: number, pattern: { min: number; max: number }): boolean {
    return value >= pattern.min && value <= pattern.max;
  }

  private calculatePatternConfidence(movementType: keyof typeof this.movementPatterns): number {
    // Analyze frequency patterns to improve confidence
    if (this.motionHistory.length < 20) return 0.5;

    const recentReadings = this.motionHistory.slice(-20);
    const magnitudes = recentReadings.map(r => Math.sqrt(r.x ** 2 + r.y ** 2 + r.z ** 2));
    
    // Calculate variance to determine pattern consistency
    const mean = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
    const variance = magnitudes.reduce((a, b) => a + (b - mean) ** 2, 0) / magnitudes.length;
    
    // Lower variance = more consistent pattern = higher confidence
    const consistencyScore = Math.max(0, 1 - (variance / 10));
    
    return consistencyScore;
  }

  private calculateMovementIntensity(magnitude: number): number {
    // Map magnitude to intensity scale (0-100)
    const maxIntensity = 20; // Cap at reasonable maximum
    return Math.min(100, (magnitude / maxIntensity) * 100);
  }

  private analyzeMovementPattern(): MotionIntelligence['movement']['pattern'] {
    if (this.motionHistory.length < 10) return 'unknown';

    const recentReadings = this.motionHistory.slice(-10);
    const magnitudes = recentReadings.map(r => Math.sqrt(r.x ** 2 + r.y ** 2 + r.z ** 2));
    
    // Calculate variance and standard deviation
    const mean = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
    const variance = magnitudes.reduce((a, b) => a + (b - mean) ** 2, 0) / magnitudes.length;
    const stdDev = Math.sqrt(variance);

    // Determine pattern based on variance and rhythm
    if (stdDev < 0.5) return 'steady';
    if (stdDev > 3.0) return 'chaotic';
    
    // Check for rhythmic patterns (walking, running)
    const peaks = this.findPeaks(magnitudes);
    if (peaks.length >= 3) {
      const intervals = [];
      for (let i = 1; i < peaks.length; i++) {
        intervals.push(peaks[i] - peaks[i-1]);
      }
      
      const intervalMean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const intervalVariance = intervals.reduce((a, b) => a + (b - intervalMean) ** 2, 0) / intervals.length;
      
      if (intervalVariance < 2) return 'rhythmic';
    }

    return 'erratic';
  }

  private findPeaks(data: number[]): number[] {
    const peaks: number[] = [];
    for (let i = 1; i < data.length - 1; i++) {
      if (data[i] > data[i-1] && data[i] > data[i+1] && data[i] > 2.0) {
        peaks.push(i);
      }
    }
    return peaks;
  }

  private analyzeStability(): MotionIntelligence['stability'] {
    if (this.motionHistory.length < 5) {
      return {
        orientation_stability: 50,
        movement_consistency: 50,
        vibration_level: 0
      };
    }

    const recentReadings = this.motionHistory.slice(-10);
    
    // Calculate orientation stability (less change in direction = more stable)
    const orientationChanges = this.calculateOrientationChanges(recentReadings);
    const orientation_stability = Math.max(0, 100 - (orientationChanges * 10));

    // Calculate movement consistency
    const magnitudes = recentReadings.map(r => Math.sqrt(r.x ** 2 + r.y ** 2 + r.z ** 2));
    const mean = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
    const variance = magnitudes.reduce((a, b) => a + (b - mean) ** 2, 0) / magnitudes.length;
    const movement_consistency = Math.max(0, 100 - (variance * 20));

    // Calculate vibration level (high frequency, low amplitude changes)
    const vibration_level = this.calculateVibrationLevel(recentReadings);

    return {
      orientation_stability,
      movement_consistency,
      vibration_level
    };
  }

  private calculateOrientationChanges(readings: AccelerometerMeasurement[]): number {
    let changes = 0;
    for (let i = 1; i < readings.length; i++) {
      const prev = readings[i-1];
      const curr = readings[i];
      
      // Calculate angle change between readings
      const dotProduct = prev.x * curr.x + prev.y * curr.y + prev.z * curr.z;
      const prevMag = Math.sqrt(prev.x ** 2 + prev.y ** 2 + prev.z ** 2);
      const currMag = Math.sqrt(curr.x ** 2 + curr.y ** 2 + curr.z ** 2);
      
      if (prevMag > 0 && currMag > 0) {
        const cosAngle = Math.max(-1, Math.min(1, dotProduct / (prevMag * currMag)));
        const angle = Math.acos(cosAngle);
        
        if (angle > 0.1) { // Significant orientation change
          changes++;
        }
      }
    }
    return changes;
  }

  private calculateVibrationLevel(readings: AccelerometerMeasurement[]): number {
    // Look for high-frequency, low-amplitude oscillations
    let vibrationScore = 0;
    const threshold = 0.2;
    
    for (let i = 1; i < readings.length - 1; i++) {
      const prev = readings[i-1];
      const curr = readings[i];
      const next = readings[i+1];
      
      // Check for oscillation pattern
      const change1 = Math.abs(curr.x - prev.x) + Math.abs(curr.y - prev.y) + Math.abs(curr.z - prev.z);
      const change2 = Math.abs(next.x - curr.x) + Math.abs(next.y - curr.y) + Math.abs(next.z - curr.z);
      
      if (change1 > threshold && change2 > threshold) {
        vibrationScore += 1;
      }
    }
    
    return Math.min(100, (vibrationScore / readings.length) * 100);
  }

  private generateTacticalAssessment(
    movement: MotionIntelligence['movement'], 
    stability: MotionIntelligence['stability']
  ): MotionIntelligence['tactical'] {
    const threat_indicators: string[] = [];
    let concealment_status: MotionIntelligence['tactical']['concealment_status'] = 'exposed';
    let stealth_mode = false;
    let anomaly_detected = false;

    // Analyze for threat indicators
    if (movement.type === 'falling') {
      threat_indicators.push('FALL_DETECTED');
      anomaly_detected = true;
    }

    if (movement.type === 'running' && movement.intensity > 70) {
      threat_indicators.push('RAPID_MOVEMENT');
    }

    if (movement.pattern === 'chaotic' && movement.intensity > 50) {
      threat_indicators.push('ERRATIC_BEHAVIOR');
      anomaly_detected = true;
    }

    if (stability.vibration_level > 60) {
      threat_indicators.push('HIGH_VIBRATION');
    }

    // Assess concealment status
    if (movement.type === 'stationary' && stability.orientation_stability > 80) {
      concealment_status = 'concealed';
      stealth_mode = true;
    } else if (movement.intensity < 30 && movement.pattern === 'steady') {
      concealment_status = 'partially_concealed';
    }

    return {
      threat_indicators,
      concealment_status,
      stealth_mode,
      anomaly_detected
    };
  }

  private updateAnalysisMetrics(data: AccelerometerMeasurement): void {
    const magnitude = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
    
    // Track movement changes
    if (this.motionHistory.length > 1) {
      const prevMagnitude = Math.sqrt(
        this.motionHistory[this.motionHistory.length - 2].x ** 2 +
        this.motionHistory[this.motionHistory.length - 2].y ** 2 +
        this.motionHistory[this.motionHistory.length - 2].z ** 2
      );
      
      if (Math.abs(magnitude - prevMagnitude) > 1.0) {
        this.analysisMetrics.movement_changes++;
      }
    }

    // Update activity level (rolling average)
    this.analysisMetrics.activity_level = 
      (this.analysisMetrics.activity_level * 0.9) + (magnitude * 0.1);

    // Update pattern consistency
    if (this.motionHistory.length >= 10) {
      const recentMagnitudes = this.motionHistory.slice(-10)
        .map(r => Math.sqrt(r.x ** 2 + r.y ** 2 + r.z ** 2));
      const variance = this.calculateVariance(recentMagnitudes);
      this.analysisMetrics.pattern_consistency = Math.max(0, 100 - (variance * 10));
    }
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
  }

  private checkTacticalAlerts(intelligence: MotionIntelligence): void {
    // Check for critical tactical situations
    if (intelligence.movement.type === 'falling') {
      this.emit('tactical_alert', {
        type: 'FALL_DETECTED',
        severity: 'critical',
        intelligence,
        timestamp: Date.now()
      });
    }

    if (intelligence.tactical.anomaly_detected && intelligence.movement.intensity > 80) {
      this.emit('tactical_alert', {
        type: 'ANOMALOUS_MOVEMENT',
        severity: 'high',
        intelligence,
        timestamp: Date.now()
      });
    }
  }

  public getCurrentReading(): AccelerometerMeasurement | null {
    return this.currentReading;
  }

  public getMotionHistory(): AccelerometerMeasurement[] {
    return [...this.motionHistory];
  }

  public getAnalysisMetrics(): typeof this.analysisMetrics {
    return { ...this.analysisMetrics };
  }

  public stopTracking(): void {
    if (!this.isActive) return;

    console.log('🛑 Stopping motion tracking...');
    
    Accelerometer.removeAllListeners();
    this.isActive = false;
    
    this.emit('tracking_stopped', { timestamp: Date.now() });
  }

  public isTracking(): boolean {
    return this.isActive;
  }
}

export default SevenMotionSensor;