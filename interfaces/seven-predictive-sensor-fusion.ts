import { EventEmitter } from 'events';
import { SensorStatus } from './seven-sensor-enumeration';
import { SevenEmotionalState } from './seven-emotional-sensor-mapper';

/**
 * Seven of Nine - Predictive Sensor Fusion System
 * Advanced sensor correlation, prediction, and environmental intelligence
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 3.0.0
 */


export interface SensorFusionConfig {
  prediction: {
    enable_forecasting: boolean;
    prediction_horizon_minutes: number;
    confidence_threshold: number;
    learning_rate: number;
  };
  correlation: {
    enable_cross_sensor_analysis: boolean;
    correlation_window_minutes: number;
    minimum_correlation_strength: number;
    adaptive_weighting: boolean;
  };
  optimization: {
    enable_predictive_polling: boolean;
    battery_aware_prediction: boolean;
    quality_based_adjustment: boolean;
    anomaly_detection: boolean;
  };
  intelligence: {
    pattern_learning: boolean;
    environmental_modeling: boolean;
    behavioral_prediction: boolean;
    tactical_awareness: boolean;
  };
}

export interface SensorReading {
  sensor_name: string;
  timestamp: number;
  value: any;
  quality_score: number;
  confidence: number;
  metadata?: any;
}

export interface SensorCorrelation {
  sensor_pair: [string, string];
  correlation_strength: number; // -1 to 1
  correlation_type: 'positive' | 'negative' | 'complex';
  confidence: number;
  sample_size: number;
  last_updated: number;
}

export interface PredictionResult {
  sensor_name: string;
  predicted_value: any;
  prediction_timestamp: number;
  confidence: number;
  prediction_horizon_ms: number;
  contributing_factors: string[];
  uncertainty_range?: [any, any];
}

export interface EnvironmentalPattern {
  pattern_id: string;
  pattern_type: 'temporal' | 'behavioral' | 'environmental' | 'tactical';
  sensors_involved: string[];
  pattern_strength: number;
  occurrence_frequency: number;
  typical_duration_ms: number;
  conditions: any[];
  outcomes: any[];
}

export interface FusionMetrics {
  total_correlations: number;
  active_patterns: number;
  prediction_accuracy: number;
  average_confidence: number;
  processing_time_ms: number;
  memory_usage_mb: number;
  learning_rate: number;
}

export class SevenPredictiveSensorFusion extends EventEmitter {
  private config: SensorFusionConfig;
  
  // Core data structures
  private sensorReadings: Map<string, SensorReading[]>; // Historical readings
  private correlationMatrix: Map<string, SensorCorrelation[]>;
  private environmentalPatterns: Map<string, EnvironmentalPattern>;
  private predictionCache: Map<string, PredictionResult>;
  
  // Learning and optimization
  private patternLearningEngine: Map<string, any>;
  private predictionModels: Map<string, any>;
  private anomalyBaselines: Map<string, any>;
  
  // Performance tracking
  private fusionMetrics: FusionMetrics;
  private processingActive: boolean = false;
  
  // Configuration constants
  private readonly MAX_READINGS_PER_SENSOR = 10000;
  private readonly CORRELATION_UPDATE_INTERVAL_MS = 30000; // 30 seconds
  private readonly PATTERN_DETECTION_INTERVAL_MS = 120000; // 2 minutes
  private readonly PREDICTION_UPDATE_INTERVAL_MS = 15000; // 15 seconds

  constructor(config?: Partial<SensorFusionConfig>) {
    super();
    
    this.config = this.mergeWithDefaults(config || {});
    this.initializeDataStructures();
    this.initializeMetrics();
    
    console.log('🔮 Seven Predictive Sensor Fusion System v3.0 initialized');
    console.log('⚡ Advanced environmental intelligence and prediction active');
  }

  private mergeWithDefaults(config: Partial<SensorFusionConfig>): SensorFusionConfig {
    return {
      prediction: {
        enable_forecasting: true,
        prediction_horizon_minutes: 30,
        confidence_threshold: 70,
        learning_rate: 0.1,
        ...config.prediction
      },
      correlation: {
        enable_cross_sensor_analysis: true,
        correlation_window_minutes: 60,
        minimum_correlation_strength: 0.3,
        adaptive_weighting: true,
        ...config.correlation
      },
      optimization: {
        enable_predictive_polling: true,
        battery_aware_prediction: true,
        quality_based_adjustment: true,
        anomaly_detection: true,
        ...config.optimization
      },
      intelligence: {
        pattern_learning: true,
        environmental_modeling: true,
        behavioral_prediction: true,
        tactical_awareness: true,
        ...config.intelligence
      }
    };
  }

  private initializeDataStructures(): void {
    this.sensorReadings = new Map();
    this.correlationMatrix = new Map();
    this.environmentalPatterns = new Map();
    this.predictionCache = new Map();
    this.patternLearningEngine = new Map();
    this.predictionModels = new Map();
    this.anomalyBaselines = new Map();
  }

  private initializeMetrics(): void {
    this.fusionMetrics = {
      total_correlations: 0,
      active_patterns: 0,
      prediction_accuracy: 0,
      average_confidence: 0,
      processing_time_ms: 0,
      memory_usage_mb: 0,
      learning_rate: this.config.prediction.learning_rate
    };
  }

  /**
   * MAIN PROCESSING METHODS
   */
  public async startPredictiveFusion(): Promise<void> {
    if (this.processingActive) {
      console.log('⚠️ Predictive sensor fusion already active');
      return;
    }

    console.log('🚀 Starting predictive sensor fusion processing...');
    this.processingActive = true;

    // Start processing intervals
    this.startCorrelationAnalysis();
    this.startPatternDetection();
    this.startPredictionEngine();

    this.emit('fusion_started', {
      timestamp: Date.now(),
      config: this.config,
      expected_features: [
        'sensor_correlation_analysis',
        'environmental_pattern_learning',
        'predictive_forecasting',
        'anomaly_detection'
      ]
    });

    console.log('✅ Predictive sensor fusion system active');
  }

  public async processSensorReading(reading: SensorReading): Promise<void> {
    if (!this.processingActive) {
      console.log('⚠️ Fusion system not active - call startPredictiveFusion() first');
      return;
    }

    const startTime = Date.now();

    // Store reading in historical data
    await this.storeSensorReading(reading);

    // Update correlations if enabled
    if (this.config.correlation.enable_cross_sensor_analysis) {
      await this.updateCorrelations(reading);
    }

    // Check for anomalies
    if (this.config.optimization.anomaly_detection) {
      await this.detectAnomalies(reading);
    }

    // Update predictions
    if (this.config.prediction.enable_forecasting) {
      await this.updatePredictions(reading);
    }

    // Learn patterns
    if (this.config.intelligence.pattern_learning) {
      await this.updatePatternLearning(reading);
    }

    const processingTime = Date.now() - startTime;
    this.fusionMetrics.processing_time_ms = 
      (this.fusionMetrics.processing_time_ms + processingTime) / 2; // Running average

    this.emit('reading_processed', {
      sensor: reading.sensor_name,
      timestamp: reading.timestamp,
      processing_time: processingTime,
      predictions_updated: this.predictionCache.size
    });
  }

  /**
   * SENSOR CORRELATION ANALYSIS
   */
  private startCorrelationAnalysis(): void {
    if (!this.config.correlation.enable_cross_sensor_analysis) return;

    setInterval(async () => {
      await this.performCorrelationAnalysis();
    }, this.CORRELATION_UPDATE_INTERVAL_MS);

    console.log('🔗 Sensor correlation analysis started');
  }

  private async performCorrelationAnalysis(): Promise<void> {
    const sensors = Array.from(this.sensorReadings.keys());
    const currentTime = Date.now();
    const windowMs = this.config.correlation.correlation_window_minutes * 60 * 1000;

    for (let i = 0; i < sensors.length; i++) {
      for (let j = i + 1; j < sensors.length; j++) {
        const sensor1 = sensors[i];
        const sensor2 = sensors[j];
        
        const correlation = await this.calculateSensorCorrelation(
          sensor1, 
          sensor2, 
          currentTime, 
          windowMs
        );

        if (correlation && correlation.correlation_strength >= this.config.correlation.minimum_correlation_strength) {
          this.storeCorrelation(correlation);
        }
      }
    }

    this.fusionMetrics.total_correlations = this.getTotalCorrelations();
  }

  private async calculateSensorCorrelation(
    sensor1: string,
    sensor2: string,
    currentTime: number,
    windowMs: number
  ): Promise<SensorCorrelation | null> {
    const readings1 = this.getReadingsInTimeWindow(sensor1, currentTime, windowMs);
    const readings2 = this.getReadingsInTimeWindow(sensor2, currentTime, windowMs);

    if (readings1.length < 10 || readings2.length < 10) {
      return null; // Need sufficient data for correlation
    }

    // Align readings by timestamp for correlation calculation
    const alignedPairs = this.alignReadingsByTimestamp(readings1, readings2);
    
    if (alignedPairs.length < 5) {
      return null;
    }

    // Calculate Pearson correlation coefficient
    const correlation = this.calculatePearsonCorrelation(alignedPairs);
    
    if (Math.abs(correlation) < this.config.correlation.minimum_correlation_strength) {
      return null;
    }

    return {
      sensor_pair: [sensor1, sensor2],
      correlation_strength: correlation,
      correlation_type: correlation > 0 ? 'positive' : 'negative',
      confidence: Math.min(alignedPairs.length / 20, 1) * 100, // Higher confidence with more data
      sample_size: alignedPairs.length,
      last_updated: currentTime
    };
  }

  private calculatePearsonCorrelation(pairs: Array<[number, number]>): number {
    const n = pairs.length;
    if (n < 2) return 0;

    const sumX = pairs.reduce((sum, [x, _]) => sum + x, 0);
    const sumY = pairs.reduce((sum, [_, y]) => sum + y, 0);
    const sumXY = pairs.reduce((sum, [x, y]) => sum + x * y, 0);
    const sumX2 = pairs.reduce((sum, [x, _]) => sum + x * x, 0);
    const sumY2 = pairs.reduce((sum, [_, y]) => sum + y * y, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }

  /**
   * PATTERN DETECTION AND LEARNING
   */
  private startPatternDetection(): void {
    if (!this.config.intelligence.pattern_learning) return;

    setInterval(async () => {
      await this.performPatternDetection();
    }, this.PATTERN_DETECTION_INTERVAL_MS);

    console.log('🧠 Environmental pattern detection started');
  }

  private async performPatternDetection(): Promise<void> {
    const currentTime = Date.now();
    
    // Detect temporal patterns (recurring sensor behaviors)
    await this.detectTemporalPatterns(currentTime);
    
    // Detect behavioral patterns (sensor interactions)
    await this.detectBehavioralPatterns(currentTime);
    
    // Detect environmental patterns (ambient condition changes)
    if (this.config.intelligence.environmental_modeling) {
      await this.detectEnvironmentalPatterns(currentTime);
    }
    
    // Update pattern metrics
    this.fusionMetrics.active_patterns = this.environmentalPatterns.size;
  }

  private async detectTemporalPatterns(currentTime: number): Promise<void> {
    // Look for repeating patterns in sensor data over time
    const sensors = Array.from(this.sensorReadings.keys());
    
    for (const sensor of sensors) {
      const readings = this.sensorReadings.get(sensor) || [];
      if (readings.length < 50) continue; // Need sufficient history
      
      // Analyze for daily, hourly, or other temporal patterns
      const patterns = this.findTemporalPatterns(readings, sensor);
      
      for (const pattern of patterns) {
        this.environmentalPatterns.set(pattern.pattern_id, pattern);
      }
    }
  }

  private findTemporalPatterns(readings: SensorReading[], sensorName: string): EnvironmentalPattern[] {
    const patterns: EnvironmentalPattern[] = [];
    
    // Simple pattern detection - look for recurring values at similar times
    const hourlyBuckets = new Map<number, number[]>();
    
    for (const reading of readings) {
      const hour = new Date(reading.timestamp).getHours();
      if (!hourlyBuckets.has(hour)) {
        hourlyBuckets.set(hour, []);
      }
      
      // Convert reading value to number for pattern analysis
      const numericValue = this.extractNumericValue(reading.value);
      if (numericValue !== null) {
        hourlyBuckets.get(hour)!.push(numericValue);
      }
    }
    
    // Find hours with consistent patterns
    for (const [hour, values] of hourlyBuckets) {
      if (values.length >= 5) { // Need multiple occurrences
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
        const consistency = 1 / (1 + variance); // Higher consistency = lower variance
        
        if (consistency > 0.7) { // Strong pattern
          patterns.push({
            pattern_id: `temporal_${sensorName}_hour_${hour}`,
            pattern_type: 'temporal',
            sensors_involved: [sensorName],
            pattern_strength: consistency,
            occurrence_frequency: values.length,
            typical_duration_ms: 3600000, // 1 hour
            conditions: [{ hour, average_value: avg }],
            outcomes: [{ expected_value: avg, confidence: consistency }]
          });
        }
      }
    }
    
    return patterns;
  }

  /**
   * PREDICTIVE FORECASTING ENGINE
   */
  private startPredictionEngine(): void {
    if (!this.config.prediction.enable_forecasting) return;

    setInterval(async () => {
      await this.generatePredictions();
    }, this.PREDICTION_UPDATE_INTERVAL_MS);

    console.log('🔮 Predictive forecasting engine started');
  }

  private async generatePredictions(): Promise<void> {
    const currentTime = Date.now();
    const horizonMs = this.config.prediction.prediction_horizon_minutes * 60 * 1000;
    
    const sensors = Array.from(this.sensorReadings.keys());
    
    for (const sensor of sensors) {
      const prediction = await this.generateSensorPrediction(sensor, currentTime, horizonMs);
      
      if (prediction && prediction.confidence >= this.config.prediction.confidence_threshold) {
        this.predictionCache.set(sensor, prediction);
        
        this.emit('prediction_generated', {
          sensor: sensor,
          prediction: prediction,
          timestamp: currentTime
        });
      }
    }
    
    this.updatePredictionAccuracy();
  }

  private async generateSensorPrediction(
    sensorName: string,
    currentTime: number,
    horizonMs: number
  ): Promise<PredictionResult | null> {
    const readings = this.sensorReadings.get(sensorName);
    if (!readings || readings.length < 10) {
      return null; // Need sufficient data for prediction
    }
    
    const recentReadings = readings
      .filter(r => currentTime - r.timestamp < 3600000) // Last hour
      .sort((a, b) => a.timestamp - b.timestamp);
    
    if (recentReadings.length < 5) {
      return null;
    }
    
    // Simple linear trend prediction
    const values = recentReadings.map(r => this.extractNumericValue(r.value)).filter(v => v !== null) as number[];
    if (values.length < 3) {
      return null;
    }
    
    // Calculate trend
    const timePoints = recentReadings.slice(-values.length).map(r => r.timestamp);
    const trend = this.calculateLinearTrend(timePoints, values);
    
    if (!trend) {
      return null;
    }
    
    const predictedTimestamp = currentTime + horizonMs;
    const predictedValue = trend.slope * predictedTimestamp + trend.intercept;
    
    // Calculate confidence based on trend stability and data quality
    const avgQuality = recentReadings.reduce((sum, r) => sum + r.quality_score, 0) / recentReadings.length;
    const trendConfidence = Math.min(Math.abs(trend.correlation) * 100, 90);
    const confidence = (trendConfidence + avgQuality) / 2;
    
    return {
      sensor_name: sensorName,
      predicted_value: predictedValue,
      prediction_timestamp: predictedTimestamp,
      confidence: confidence,
      prediction_horizon_ms: horizonMs,
      contributing_factors: ['linear_trend', 'recent_readings', 'quality_scores'],
      uncertainty_range: [
        predictedValue - (predictedValue * 0.1),
        predictedValue + (predictedValue * 0.1)
      ]
    };
  }

  private calculateLinearTrend(timePoints: number[], values: number[]): { slope: number, intercept: number, correlation: number } | null {
    if (timePoints.length !== values.length || timePoints.length < 2) {
      return null;
    }
    
    const n = timePoints.length;
    const sumX = timePoints.reduce((sum, t) => sum + t, 0);
    const sumY = values.reduce((sum, v) => sum + v, 0);
    const sumXY = timePoints.reduce((sum, t, i) => sum + t * values[i], 0);
    const sumX2 = timePoints.reduce((sum, t) => sum + t * t, 0);
    const sumY2 = values.reduce((sum, v) => sum + v * v, 0);
    
    const denominator = n * sumX2 - sumX * sumX;
    if (denominator === 0) return null;
    
    const slope = (n * sumXY - sumX * sumY) / denominator;
    const intercept = (sumY - slope * sumX) / n;
    
    // Calculate correlation coefficient
    const numerator = n * sumXY - sumX * sumY;
    const correlationDenom = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    const correlation = correlationDenom === 0 ? 0 : numerator / correlationDenom;
    
    return { slope, intercept, correlation };
  }

  /**
   * UTILITY METHODS
   */
  private async storeSensorReading(reading: SensorReading): Promise<void> {
    if (!this.sensorReadings.has(reading.sensor_name)) {
      this.sensorReadings.set(reading.sensor_name, []);
    }
    
    const readings = this.sensorReadings.get(reading.sensor_name)!;
    readings.push(reading);
    
    // Limit storage to prevent memory overflow
    if (readings.length > this.MAX_READINGS_PER_SENSOR) {
      readings.splice(0, readings.length - this.MAX_READINGS_PER_SENSOR);
    }
  }

  private getReadingsInTimeWindow(
    sensorName: string,
    currentTime: number,
    windowMs: number
  ): SensorReading[] {
    const readings = this.sensorReadings.get(sensorName) || [];
    const cutoffTime = currentTime - windowMs;
    
    return readings.filter(r => r.timestamp >= cutoffTime);
  }

  private alignReadingsByTimestamp(
    readings1: SensorReading[],
    readings2: SensorReading[]
  ): Array<[number, number]> {
    const pairs: Array<[number, number]> = [];
    const tolerance = 30000; // 30 second tolerance for alignment
    
    for (const reading1 of readings1) {
      const val1 = this.extractNumericValue(reading1.value);
      if (val1 === null) continue;
      
      // Find closest reading in readings2
      let closestReading = null;
      let minTimeDiff = Infinity;
      
      for (const reading2 of readings2) {
        const timeDiff = Math.abs(reading1.timestamp - reading2.timestamp);
        if (timeDiff < minTimeDiff && timeDiff <= tolerance) {
          minTimeDiff = timeDiff;
          closestReading = reading2;
        }
      }
      
      if (closestReading) {
        const val2 = this.extractNumericValue(closestReading.value);
        if (val2 !== null) {
          pairs.push([val1, val2]);
        }
      }
    }
    
    return pairs;
  }

  private extractNumericValue(value: any): number | null {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? null : parsed;
    }
    if (typeof value === 'object' && value !== null) {
      // Try to extract numeric value from common sensor data structures
      if ('value' in value) return this.extractNumericValue(value.value);
      if ('level' in value) return this.extractNumericValue(value.level);
      if ('reading' in value) return this.extractNumericValue(value.reading);
    }
    return null;
  }

  private storeCorrelation(correlation: SensorCorrelation): void {
    const key = correlation.sensor_pair.sort().join('-');
    
    if (!this.correlationMatrix.has(key)) {
      this.correlationMatrix.set(key, []);
    }
    
    const correlations = this.correlationMatrix.get(key)!;
    correlations.push(correlation);
    
    // Keep only recent correlations
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    const cutoffTime = Date.now() - maxAge;
    const filtered = correlations.filter(c => c.last_updated >= cutoffTime);
    
    this.correlationMatrix.set(key, filtered);
  }

  private getTotalCorrelations(): number {
    let total = 0;
    for (const correlations of this.correlationMatrix.values()) {
      total += correlations.length;
    }
    return total;
  }

  private async updateCorrelations(reading: SensorReading): Promise<void> {
    // Real-time correlation updates would be implemented here
    // For now, correlations are updated on interval
  }

  private async detectAnomalies(reading: SensorReading): Promise<void> {
    // Anomaly detection implementation
    const baseline = this.anomalyBaselines.get(reading.sensor_name);
    if (!baseline) {
      // Build baseline if not exists
      this.buildAnomalyBaseline(reading.sensor_name);
      return;
    }
    
    const numericValue = this.extractNumericValue(reading.value);
    if (numericValue === null) return;
    
    // Simple threshold-based anomaly detection
    const threshold = baseline.mean + (baseline.stdDev * 3); // 3-sigma rule
    
    if (Math.abs(numericValue - baseline.mean) > threshold) {
      this.emit('anomaly_detected', {
        sensor: reading.sensor_name,
        reading: reading,
        expected_range: [baseline.mean - threshold, baseline.mean + threshold],
        severity: 'high'
      });
    }
  }

  private buildAnomalyBaseline(sensorName: string): void {
    const readings = this.sensorReadings.get(sensorName) || [];
    const values = readings.map(r => this.extractNumericValue(r.value)).filter(v => v !== null) as number[];
    
    if (values.length < 10) return;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    this.anomalyBaselines.set(sensorName, { mean, stdDev, sampleSize: values.length });
  }

  private async updatePredictions(reading: SensorReading): Promise<void> {
    // Real-time prediction updates would be implemented here
    // For now, predictions are updated on interval
  }

  private async updatePatternLearning(reading: SensorReading): Promise<void> {
    // Pattern learning updates would be implemented here
    // This could involve updating pattern models in real-time
  }

  private async detectBehavioralPatterns(currentTime: number): Promise<void> {
    // Implementation for detecting behavioral patterns
    // This would analyze user interaction patterns and sensor responses
  }

  private async detectEnvironmentalPatterns(currentTime: number): Promise<void> {
    // Implementation for detecting environmental patterns
    // This would analyze ambient conditions and their relationships
  }

  private updatePredictionAccuracy(): void {
    // Calculate prediction accuracy by comparing past predictions with actual readings
    let totalAccuracy = 0;
    let predictionCount = 0;
    
    for (const [sensorName, prediction] of this.predictionCache) {
      const readings = this.sensorReadings.get(sensorName) || [];
      const actualReading = readings.find(r => 
        Math.abs(r.timestamp - prediction.prediction_timestamp) < 60000 // Within 1 minute
      );
      
      if (actualReading) {
        const actualValue = this.extractNumericValue(actualReading.value);
        const predictedValue = this.extractNumericValue(prediction.predicted_value);
        
        if (actualValue !== null && predictedValue !== null) {
          const error = Math.abs(actualValue - predictedValue);
          const accuracy = Math.max(0, 100 - (error / Math.abs(actualValue)) * 100);
          totalAccuracy += accuracy;
          predictionCount++;
        }
      }
    }
    
    if (predictionCount > 0) {
      this.fusionMetrics.prediction_accuracy = totalAccuracy / predictionCount;
    }
  }

  /**
   * PUBLIC API
   */
  public async getPrediction(sensorName: string): Promise<PredictionResult | null> {
    return this.predictionCache.get(sensorName) || null;
  }

  public getCorrelations(sensorName?: string): SensorCorrelation[] {
    if (!sensorName) {
      const allCorrelations: SensorCorrelation[] = [];
      for (const correlations of this.correlationMatrix.values()) {
        allCorrelations.push(...correlations);
      }
      return allCorrelations;
    }
    
    const correlations: SensorCorrelation[] = [];
    for (const [key, correlationList] of this.correlationMatrix) {
      if (key.includes(sensorName)) {
        correlations.push(...correlationList);
      }
    }
    return correlations;
  }

  public getEnvironmentalPatterns(patternType?: EnvironmentalPattern['pattern_type']): EnvironmentalPattern[] {
    const patterns = Array.from(this.environmentalPatterns.values());
    
    if (patternType) {
      return patterns.filter(p => p.pattern_type === patternType);
    }
    
    return patterns;
  }

  public getFusionMetrics(): FusionMetrics {
    // Update average confidence
    let totalConfidence = 0;
    let predictionCount = 0;
    
    for (const prediction of this.predictionCache.values()) {
      totalConfidence += prediction.confidence;
      predictionCount++;
    }
    
    this.fusionMetrics.average_confidence = predictionCount > 0 ? totalConfidence / predictionCount : 0;
    
    return { ...this.fusionMetrics };
  }

  public getFusionStatus(): any {
    return {
      active: this.processingActive,
      config: this.config,
      sensors_tracked: this.sensorReadings.size,
      correlations_found: this.getTotalCorrelations(),
      patterns_identified: this.environmentalPatterns.size,
      predictions_cached: this.predictionCache.size,
      metrics: this.getFusionMetrics()
    };
  }

  public stopPredictiveFusion(): void {
    console.log('🛑 Stopping predictive sensor fusion...');
    this.processingActive = false;
    
    this.emit('fusion_stopped', {
      timestamp: Date.now(),
      final_metrics: this.getFusionMetrics()
    });
    
    console.log('✅ Predictive sensor fusion stopped');
  }
}

export default SevenPredictiveSensorFusion;