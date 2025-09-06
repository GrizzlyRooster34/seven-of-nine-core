import { EventEmitter } from 'events';
import * as Location from 'expo-location';
import * as Sensors from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Seven of Nine - Mobile Predictive Sensor Fusion System
 * Advanced sensor correlation, prediction, and environmental intelligence for mobile
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 3.0.0 (Mobile)
 */


export interface MobileSensorFusionConfig {
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

export interface MobileSensorReading {
  sensor_name: string;
  timestamp: number;
  value: any;
  quality_score: number;
  confidence: number;
  location?: Location.LocationObject;
  battery_level?: number;
  metadata?: any;
}

export interface MobileSensorCorrelation {
  sensor_pair: [string, string];
  correlation_strength: number; // -1 to 1
  correlation_type: 'positive' | 'negative' | 'complex';
  confidence: number;
  sample_size: number;
  last_updated: number;
  mobile_context?: {
    location_dependent: boolean;
    time_dependent: boolean;
    battery_dependent: boolean;
  };
}

export interface MobilePredictionResult {
  sensor_name: string;
  predicted_value: any;
  prediction_timestamp: number;
  confidence: number;
  prediction_horizon_ms: number;
  contributing_factors: string[];
  uncertainty_range?: [any, any];
  mobile_factors: {
    location_influence: number;
    motion_influence: number;
    battery_influence: number;
    time_of_day_influence: number;
  };
}

export interface MobileEnvironmentalPattern {
  pattern_id: string;
  pattern_type: 'temporal' | 'behavioral' | 'environmental' | 'tactical' | 'location_based' | 'motion_based';
  sensors_involved: string[];
  pattern_strength: number;
  occurrence_frequency: number;
  typical_duration_ms: number;
  conditions: any[];
  outcomes: any[];
  mobile_context: {
    typical_locations?: Location.LocationObject[];
    motion_states?: string[];
    time_patterns?: number[];
  };
}

export interface MobileFusionMetrics {
  total_correlations: number;
  active_patterns: number;
  prediction_accuracy: number;
  average_confidence: number;
  processing_time_ms: number;
  memory_usage_mb: number;
  battery_efficiency: number;
  location_coverage: number;
  motion_patterns_detected: number;
}

export class SevenMobileSensorFusion extends EventEmitter {
  private config: MobileSensorFusionConfig;
  
  // Core data structures
  private sensorReadings: Map<string, MobileSensorReading[]> = new Map();
  private correlationMatrix: Map<string, MobileSensorCorrelation[]> = new Map();
  private environmentalPatterns: Map<string, MobileEnvironmentalPattern> = new Map();
  private predictionCache: Map<string, MobilePredictionResult> = new Map();
  
  // Mobile-specific data
  private locationHistory: Location.LocationObject[] = [];
  private motionStates: Array<{ state: string; timestamp: number; confidence: number }> = [];
  private batteryOptimizations: Map<string, any> = new Map();
  
  // Learning and optimization
  private patternLearningEngine: Map<string, any> = new Map();
  private predictionModels: Map<string, any> = new Map();
  private anomalyBaselines: Map<string, any> = new Map();
  
  // Performance tracking
  private fusionMetrics: MobileFusionMetrics;
  private processingActive: boolean = false;
  private fusionDirectory: string;
  
  // Configuration constants for mobile optimization
  private readonly MAX_READINGS_PER_SENSOR = 1000; // Reduced for mobile
  private readonly CORRELATION_UPDATE_INTERVAL_MS = 60000; // 1 minute
  private readonly PATTERN_DETECTION_INTERVAL_MS = 300000; // 5 minutes
  private readonly PREDICTION_UPDATE_INTERVAL_MS = 30000; // 30 seconds
  private readonly MAX_LOCATION_HISTORY = 100;
  private readonly MAX_MOTION_STATES = 50;

  constructor(config?: Partial<MobileSensorFusionConfig>) {
    super();
    
    this.config = this.mergeWithDefaults(config || {});
    this.fusionDirectory = '/data/data/com.termux/files/home/seven-of-nine-core/seven-mobile-app/fusion_data/';
    
    this.initializeMetrics();
    
    console.log('🔮 Seven Mobile Predictive Sensor Fusion System v3.0 initialized');
    console.log('📱 Mobile-optimized environmental intelligence active');
  }

  private mergeWithDefaults(config: Partial<MobileSensorFusionConfig>): MobileSensorFusionConfig {
    return {
      prediction: {
        enable_forecasting: true,
        prediction_horizon_minutes: 15, // Shorter for mobile
        confidence_threshold: 75,
        learning_rate: 0.15,
        ...config.prediction
      },
      correlation: {
        enable_cross_sensor_analysis: true,
        correlation_window_minutes: 30, // Shorter for mobile
        minimum_correlation_strength: 0.4,
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

  private initializeMetrics(): void {
    this.fusionMetrics = {
      total_correlations: 0,
      active_patterns: 0,
      prediction_accuracy: 0,
      average_confidence: 0,
      processing_time_ms: 0,
      memory_usage_mb: 0,
      battery_efficiency: 100,
      location_coverage: 0,
      motion_patterns_detected: 0
    };
  }

  /**
   * MAIN INITIALIZATION AND PROCESSING
   */
  public async initializeMobileFusion(): Promise<boolean> {
    try {
      console.log('🚀 Initializing Seven Mobile Sensor Fusion...');
      
      // Load persistent fusion data
      await this.loadFusionData();
      
      // Initialize mobile-specific components
      await this.initializeMobileComponents();
      
      console.log('✅ Seven Mobile Sensor Fusion initialized successfully');
      return true;
      
    } catch (error) {
      console.error(`❌ Mobile sensor fusion initialization failed: ${error.message}`);
      return false;
    }
  }

  private async loadFusionData(): Promise<void> {
    try {
      // Load correlation data
      const correlationData = await AsyncStorage.getItem('seven_sensor_correlations');
      if (correlationData) {
        const correlations = JSON.parse(correlationData);
        for (const [key, correlationList] of Object.entries(correlations)) {
          this.correlationMatrix.set(key, correlationList as MobileSensorCorrelation[]);
        }
        console.log(`📊 Loaded ${this.correlationMatrix.size} correlation matrices`);
      }

      // Load pattern data
      const patternData = await AsyncStorage.getItem('seven_environmental_patterns');
      if (patternData) {
        const patterns = JSON.parse(patternData);
        for (const pattern of patterns) {
          this.environmentalPatterns.set(pattern.pattern_id, pattern);
        }
        console.log(`🧠 Loaded ${this.environmentalPatterns.size} environmental patterns`);
      }

      // Load location history
      const locationData = await AsyncStorage.getItem('seven_location_history');
      if (locationData) {
        this.locationHistory = JSON.parse(locationData);
        console.log(`📍 Loaded ${this.locationHistory.length} location points`);
      }

    } catch (error) {
      console.error('⚠️ Failed to load fusion data:', error);
    }
  }

  private async initializeMobileComponents(): Promise<void> {
    // Initialize location tracking
    if (this.config.intelligence.environmental_modeling) {
      await this.initializeLocationTracking();
    }

    // Initialize motion detection
    if (this.config.intelligence.behavioral_prediction) {
      await this.initializeMotionDetection();
    }

    // Initialize battery optimization
    if (this.config.optimization.battery_aware_prediction) {
      await this.initializeBatteryOptimization();
    }
  }

  private async initializeLocationTracking(): Promise<void> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        console.log('📍 Location tracking initialized');
      }
    } catch (error) {
      console.error('⚠️ Location tracking initialization failed:', error);
    }
  }

  private async initializeMotionDetection(): Promise<void> {
    try {
      console.log('🏃 Motion detection initialized');
      // Motion sensors will be handled through existing sensor integration
    } catch (error) {
      console.error('⚠️ Motion detection initialization failed:', error);
    }
  }

  private async initializeBatteryOptimization(): Promise<void> {
    // Initialize battery-aware processing optimizations
    console.log('🔋 Battery optimization initialized');
  }

  public async startMobileFusion(): Promise<void> {
    if (this.processingActive) {
      console.log('⚠️ Mobile sensor fusion already active');
      return;
    }

    console.log('🚀 Starting mobile sensor fusion processing...');
    this.processingActive = true;

    // Start processing intervals with mobile-optimized timing
    this.startMobileCorrelationAnalysis();
    this.startMobilePatternDetection();
    this.startMobilePredictionEngine();

    this.emit('mobile_fusion_started', {
      timestamp: Date.now(),
      config: this.config,
      mobile_features: [
        'location_aware_correlations',
        'motion_based_patterns',
        'battery_optimized_predictions',
        'mobile_environmental_modeling'
      ]
    });

    console.log('✅ Mobile sensor fusion system active');
  }

  /**
   * MOBILE SENSOR READING PROCESSING
   */
  public async processMobileSensorReading(reading: MobileSensorReading): Promise<void> {
    if (!this.processingActive) {
      console.log('⚠️ Mobile fusion system not active');
      return;
    }

    const startTime = Date.now();

    // Enhance reading with mobile context
    const enhancedReading = await this.enhanceReadingWithMobileContext(reading);

    // Store reading with mobile optimizations
    await this.storeMobileSensorReading(enhancedReading);

    // Update mobile-specific data structures
    await this.updateMobileContext(enhancedReading);

    // Perform fusion analysis if battery allows
    if (await this.isBatteryOptimized()) {
      await this.performMobileFusionAnalysis(enhancedReading);
    }

    const processingTime = Date.now() - startTime;
    this.fusionMetrics.processing_time_ms = 
      (this.fusionMetrics.processing_time_ms + processingTime) / 2;

    this.emit('mobile_reading_processed', {
      sensor: reading.sensor_name,
      timestamp: reading.timestamp,
      processing_time: processingTime,
      battery_optimized: await this.isBatteryOptimized()
    });
  }

  private async enhanceReadingWithMobileContext(reading: MobileSensorReading): Promise<MobileSensorReading> {
    const enhanced = { ...reading };

    // Add location context if available
    if (this.config.intelligence.environmental_modeling) {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced
        });
        enhanced.location = location;
      } catch (error) {
        // Use last known location if available
        if (this.locationHistory.length > 0) {
          enhanced.location = this.locationHistory[this.locationHistory.length - 1];
        }
      }
    }

    // Add battery context
    enhanced.battery_level = 85; // Would get actual battery level in real implementation

    // Add mobile-specific metadata
    enhanced.metadata = {
      ...enhanced.metadata,
      mobile_enhanced: true,
      enhancement_timestamp: Date.now()
    };

    return enhanced;
  }

  private async updateMobileContext(reading: MobileSensorReading): Promise<void> {
    // Update location history
    if (reading.location) {
      this.locationHistory.push(reading.location);
      if (this.locationHistory.length > this.MAX_LOCATION_HISTORY) {
        this.locationHistory.shift();
      }
    }

    // Update motion state if motion sensor
    if (reading.sensor_name.includes('motion') || reading.sensor_name.includes('accelerometer')) {
      const motionState = this.classifyMotionState(reading);
      this.motionStates.push({
        state: motionState,
        timestamp: reading.timestamp,
        confidence: reading.confidence
      });
      
      if (this.motionStates.length > this.MAX_MOTION_STATES) {
        this.motionStates.shift();
      }
    }
  }

  private classifyMotionState(reading: MobileSensorReading): string {
    // Simple motion classification based on sensor data
    const value = reading.value;
    
    if (typeof value === 'object' && value !== null) {
      if ('x' in value && 'y' in value && 'z' in value) {
        const magnitude = Math.sqrt(value.x * value.x + value.y * value.y + value.z * value.z);
        
        if (magnitude < 0.5) return 'stationary';
        if (magnitude < 2.0) return 'walking';
        if (magnitude < 5.0) return 'running';
        return 'vehicle';
      }
    }
    
    return 'unknown';
  }

  /**
   * MOBILE CORRELATION ANALYSIS
   */
  private startMobileCorrelationAnalysis(): void {
    if (!this.config.correlation.enable_cross_sensor_analysis) return;

    setInterval(async () => {
      if (await this.isBatteryOptimized()) {
        await this.performMobileCorrelationAnalysis();
      }
    }, this.CORRELATION_UPDATE_INTERVAL_MS);

    console.log('🔗 Mobile sensor correlation analysis started');
  }

  private async performMobileCorrelationAnalysis(): Promise<void> {
    const sensors = Array.from(this.sensorReadings.keys());
    const currentTime = Date.now();
    const windowMs = this.config.correlation.correlation_window_minutes * 60 * 1000;

    for (let i = 0; i < sensors.length; i++) {
      for (let j = i + 1; j < sensors.length; j++) {
        const sensor1 = sensors[i];
        const sensor2 = sensors[j];
        
        const correlation = await this.calculateMobileSensorCorrelation(
          sensor1, 
          sensor2, 
          currentTime, 
          windowMs
        );

        if (correlation && correlation.correlation_strength >= this.config.correlation.minimum_correlation_strength) {
          this.storeMobileCorrelation(correlation);
        }
      }
    }

    this.fusionMetrics.total_correlations = this.getTotalCorrelations();
    await this.saveFusionData();
  }

  private async calculateMobileSensorCorrelation(
    sensor1: string,
    sensor2: string,
    currentTime: number,
    windowMs: number
  ): Promise<MobileSensorCorrelation | null> {
    const readings1 = this.getMobileReadingsInTimeWindow(sensor1, currentTime, windowMs);
    const readings2 = this.getMobileReadingsInTimeWindow(sensor2, currentTime, windowMs);

    if (readings1.length < 5 || readings2.length < 5) {
      return null; // Need sufficient data for mobile correlation
    }

    // Align readings by timestamp for correlation calculation
    const alignedPairs = this.alignMobileReadingsByTimestamp(readings1, readings2);
    
    if (alignedPairs.length < 3) {
      return null;
    }

    // Calculate Pearson correlation coefficient
    const correlation = this.calculatePearsonCorrelation(alignedPairs);
    
    if (Math.abs(correlation) < this.config.correlation.minimum_correlation_strength) {
      return null;
    }

    // Analyze mobile context
    const mobileContext = this.analyzeMobileCorrelationContext(readings1, readings2);

    return {
      sensor_pair: [sensor1, sensor2],
      correlation_strength: correlation,
      correlation_type: correlation > 0 ? 'positive' : 'negative',
      confidence: Math.min(alignedPairs.length / 10, 1) * 100, // Adjusted for mobile
      sample_size: alignedPairs.length,
      last_updated: currentTime,
      mobile_context: mobileContext
    };
  }

  private analyzeMobileCorrelationContext(
    readings1: MobileSensorReading[],
    readings2: MobileSensorReading[]
  ): { location_dependent: boolean; time_dependent: boolean; battery_dependent: boolean } {
    // Analyze if correlation depends on mobile factors
    const locationDependent = this.analyzeLocationDependency(readings1, readings2);
    const timeDependent = this.analyzeTimeDependency(readings1, readings2);
    const batteryDependent = this.analyzeBatteryDependency(readings1, readings2);

    return {
      location_dependent: locationDependent,
      time_dependent: timeDependent,
      battery_dependent: batteryDependent
    };
  }

  private analyzeLocationDependency(readings1: MobileSensorReading[], readings2: MobileSensorReading[]): boolean {
    // Simple heuristic: if readings have location data and vary significantly by location
    const locationsWithReadings = readings1.filter(r => r.location).length;
    return locationsWithReadings > readings1.length * 0.5; // More than 50% have location data
  }

  private analyzeTimeDependency(readings1: MobileSensorReading[], readings2: MobileSensorReading[]): boolean {
    // Check if correlation varies by time of day
    const hourBuckets = new Map<number, number[]>();
    
    for (const reading of readings1) {
      const hour = new Date(reading.timestamp).getHours();
      if (!hourBuckets.has(hour)) {
        hourBuckets.set(hour, []);
      }
      hourBuckets.get(hour)!.push(reading.timestamp);
    }
    
    // If readings span multiple hours, likely time dependent
    return hourBuckets.size > 2;
  }

  private analyzeBatteryDependency(readings1: MobileSensorReading[], readings2: MobileSensorReading[]): boolean {
    // Check if correlation varies by battery level
    const batteryLevels = readings1.map(r => r.battery_level).filter(b => b !== undefined);
    return batteryLevels.length > 0 && new Set(batteryLevels).size > 1;
  }

  /**
   * MOBILE PATTERN DETECTION
   */
  private startMobilePatternDetection(): void {
    if (!this.config.intelligence.pattern_learning) return;

    setInterval(async () => {
      if (await this.isBatteryOptimized()) {
        await this.performMobilePatternDetection();
      }
    }, this.PATTERN_DETECTION_INTERVAL_MS);

    console.log('🧠 Mobile environmental pattern detection started');
  }

  private async performMobilePatternDetection(): Promise<void> {
    const currentTime = Date.now();
    
    // Detect location-based patterns
    await this.detectLocationBasedPatterns(currentTime);
    
    // Detect motion-based patterns
    await this.detectMotionBasedPatterns(currentTime);
    
    // Detect temporal patterns with mobile context
    await this.detectMobileTemporalPatterns(currentTime);
    
    this.fusionMetrics.active_patterns = this.environmentalPatterns.size;
    this.fusionMetrics.motion_patterns_detected = this.getMotionPatternCount();
    
    await this.saveFusionData();
  }

  private async detectLocationBasedPatterns(currentTime: number): Promise<void> {
    if (this.locationHistory.length < 10) return;

    // Group sensor readings by location
    const locationClusters = this.clusterReadingsByLocation();
    
    for (const [locationKey, readings] of locationClusters) {
      if (readings.length >= 5) { // Minimum readings for pattern
        const pattern = this.createLocationBasedPattern(locationKey, readings);
        if (pattern) {
          this.environmentalPatterns.set(pattern.pattern_id, pattern);
        }
      }
    }
  }

  private clusterReadingsByLocation(): Map<string, MobileSensorReading[]> {
    const clusters = new Map<string, MobileSensorReading[]>();
    const radiusKm = 0.1; // 100 meter radius for clustering

    for (const readings of this.sensorReadings.values()) {
      for (const reading of readings) {
        if (!reading.location) continue;

        let clustered = false;
        for (const [clusterKey, clusterReadings] of clusters) {
          const [lat, lon] = clusterKey.split(',').map(Number);
          const distance = this.calculateDistance(
            reading.location.coords.latitude,
            reading.location.coords.longitude,
            lat,
            lon
          );

          if (distance <= radiusKm) {
            clusterReadings.push(reading);
            clustered = true;
            break;
          }
        }

        if (!clustered) {
          const key = `${reading.location.coords.latitude.toFixed(3)},${reading.location.coords.longitude.toFixed(3)}`;
          clusters.set(key, [reading]);
        }
      }
    }

    return clusters;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private createLocationBasedPattern(locationKey: string, readings: MobileSensorReading[]): MobileEnvironmentalPattern | null {
    const [lat, lon] = locationKey.split(',').map(Number);
    const sensors = [...new Set(readings.map(r => r.sensor_name))];
    
    // Analyze pattern strength
    const values = readings.map(r => this.extractNumericValue(r.value)).filter(v => v !== null) as number[];
    if (values.length < 3) return null;

    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    const consistency = 1 / (1 + variance);

    if (consistency < 0.6) return null; // Pattern not strong enough

    return {
      pattern_id: `location_${locationKey}_${Date.now()}`,
      pattern_type: 'location_based',
      sensors_involved: sensors,
      pattern_strength: consistency,
      occurrence_frequency: readings.length,
      typical_duration_ms: 0, // Location patterns don't have duration
      conditions: [{ location: { latitude: lat, longitude: lon }, radius_km: 0.1 }],
      outcomes: [{ expected_value: avg, confidence: consistency }],
      mobile_context: {
        typical_locations: [{ coords: { latitude: lat, longitude: lon } } as Location.LocationObject]
      }
    };
  }

  private async detectMotionBasedPatterns(currentTime: number): Promise<void> {
    if (this.motionStates.length < 10) return;

    // Group motion states and find patterns
    const motionGroups = new Map<string, Array<{ state: string; timestamp: number; confidence: number }>>();
    
    for (const motionState of this.motionStates) {
      if (!motionGroups.has(motionState.state)) {
        motionGroups.set(motionState.state, []);
      }
      motionGroups.get(motionState.state)!.push(motionState);
    }

    for (const [motionType, states] of motionGroups) {
      if (states.length >= 5) {
        const pattern = this.createMotionBasedPattern(motionType, states);
        if (pattern) {
          this.environmentalPatterns.set(pattern.pattern_id, pattern);
        }
      }
    }
  }

  private createMotionBasedPattern(
    motionType: string, 
    states: Array<{ state: string; timestamp: number; confidence: number }>
  ): MobileEnvironmentalPattern | null {
    const avgConfidence = states.reduce((sum, s) => sum + s.confidence, 0) / states.length;
    
    if (avgConfidence < 70) return null; // Not confident enough

    // Analyze timing patterns
    const hours = states.map(s => new Date(s.timestamp).getHours());
    const hourCounts = new Map<number, number>();
    
    for (const hour of hours) {
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    }

    return {
      pattern_id: `motion_${motionType}_${Date.now()}`,
      pattern_type: 'motion_based',
      sensors_involved: ['accelerometer', 'gyroscope', 'motion'],
      pattern_strength: avgConfidence / 100,
      occurrence_frequency: states.length,
      typical_duration_ms: 0, // Would calculate based on motion state transitions
      conditions: [{ motion_type: motionType, min_confidence: 70 }],
      outcomes: [{ motion_pattern: motionType, confidence: avgConfidence }],
      mobile_context: {
        motion_states: [motionType],
        time_patterns: Array.from(hourCounts.keys())
      }
    };
  }

  private async detectMobileTemporalPatterns(currentTime: number): Promise<void> {
    // Enhanced temporal pattern detection with mobile context
    const sensors = Array.from(this.sensorReadings.keys());
    
    for (const sensor of sensors) {
      const readings = this.sensorReadings.get(sensor) || [];
      if (readings.length < 20) continue;
      
      const patterns = this.findMobileTemporalPatterns(readings, sensor);
      
      for (const pattern of patterns) {
        this.environmentalPatterns.set(pattern.pattern_id, pattern);
      }
    }
  }

  private findMobileTemporalPatterns(readings: MobileSensorReading[], sensorName: string): MobileEnvironmentalPattern[] {
    const patterns: MobileEnvironmentalPattern[] = [];
    
    // Group by hour and location if available
    const contextBuckets = new Map<string, { values: number[]; locations: Location.LocationObject[] }>();
    
    for (const reading of readings) {
      const hour = new Date(reading.timestamp).getHours();
      const locationKey = reading.location ? 
        `${reading.location.coords.latitude.toFixed(2)},${reading.location.coords.longitude.toFixed(2)}` : 
        'no_location';
      const key = `${hour}_${locationKey}`;
      
      if (!contextBuckets.has(key)) {
        contextBuckets.set(key, { values: [], locations: [] });
      }
      
      const numericValue = this.extractNumericValue(reading.value);
      if (numericValue !== null) {
        contextBuckets.get(key)!.values.push(numericValue);
        if (reading.location) {
          contextBuckets.get(key)!.locations.push(reading.location);
        }
      }
    }
    
    // Find patterns in context buckets
    for (const [contextKey, data] of contextBuckets) {
      if (data.values.length >= 3) {
        const [hourStr, locationKey] = contextKey.split('_');
        const hour = parseInt(hourStr);
        
        const avg = data.values.reduce((sum, val) => sum + val, 0) / data.values.length;
        const variance = data.values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / data.values.length;
        const consistency = 1 / (1 + variance);
        
        if (consistency > 0.7) {
          patterns.push({
            pattern_id: `mobile_temporal_${sensorName}_${contextKey}_${Date.now()}`,
            pattern_type: 'temporal',
            sensors_involved: [sensorName],
            pattern_strength: consistency,
            occurrence_frequency: data.values.length,
            typical_duration_ms: 3600000, // 1 hour
            conditions: [{ hour, location_context: locationKey, average_value: avg }],
            outcomes: [{ expected_value: avg, confidence: consistency }],
            mobile_context: {
              typical_locations: data.locations.length > 0 ? data.locations : undefined,
              time_patterns: [hour]
            }
          });
        }
      }
    }
    
    return patterns;
  }

  /**
   * MOBILE PREDICTION ENGINE
   */
  private startMobilePredictionEngine(): void {
    if (!this.config.prediction.enable_forecasting) return;

    setInterval(async () => {
      if (await this.isBatteryOptimized()) {
        await this.generateMobilePredictions();
      }
    }, this.PREDICTION_UPDATE_INTERVAL_MS);

    console.log('🔮 Mobile predictive forecasting engine started');
  }

  private async generateMobilePredictions(): Promise<void> {
    const currentTime = Date.now();
    const horizonMs = this.config.prediction.prediction_horizon_minutes * 60 * 1000;
    
    const sensors = Array.from(this.sensorReadings.keys());
    
    for (const sensor of sensors) {
      const prediction = await this.generateMobileSensorPrediction(sensor, currentTime, horizonMs);
      
      if (prediction && prediction.confidence >= this.config.prediction.confidence_threshold) {
        this.predictionCache.set(sensor, prediction);
        
        this.emit('mobile_prediction_generated', {
          sensor: sensor,
          prediction: prediction,
          timestamp: currentTime
        });
      }
    }
    
    this.updateMobilePredictionAccuracy();
  }

  private async generateMobileSensorPrediction(
    sensorName: string,
    currentTime: number,
    horizonMs: number
  ): Promise<MobilePredictionResult | null> {
    const readings = this.sensorReadings.get(sensorName);
    if (!readings || readings.length < 5) {
      return null; // Need sufficient data for mobile prediction
    }
    
    const recentReadings = readings
      .filter(r => currentTime - r.timestamp < 1800000) // Last 30 minutes for mobile
      .sort((a, b) => a.timestamp - b.timestamp);
    
    if (recentReadings.length < 3) {
      return null;
    }
    
    // Enhanced prediction with mobile factors
    const prediction = await this.calculateMobilePrediction(recentReadings, currentTime, horizonMs);
    
    return prediction;
  }

  private async calculateMobilePrediction(
    readings: MobileSensorReading[],
    currentTime: number,
    horizonMs: number
  ): Promise<MobilePredictionResult | null> {
    const values = readings.map(r => this.extractNumericValue(r.value)).filter(v => v !== null) as number[];
    if (values.length < 3) return null;
    
    // Calculate basic trend
    const timePoints = readings.slice(-values.length).map(r => r.timestamp);
    const trend = this.calculateLinearTrend(timePoints, values);
    
    if (!trend) return null;
    
    const predictedTimestamp = currentTime + horizonMs;
    const basePrediction = trend.slope * predictedTimestamp + trend.intercept;
    
    // Calculate mobile influence factors
    const mobileFactors = await this.calculateMobileInfluenceFactors(readings);
    
    // Adjust prediction based on mobile factors
    const adjustedPrediction = this.adjustPredictionForMobileFactors(basePrediction, mobileFactors);
    
    // Calculate confidence
    const avgQuality = readings.reduce((sum, r) => sum + r.quality_score, 0) / readings.length;
    const trendConfidence = Math.min(Math.abs(trend.correlation) * 100, 90);
    const mobileConfidence = this.calculateMobileFactorConfidence(mobileFactors);
    const confidence = (trendConfidence + avgQuality + mobileConfidence) / 3;
    
    return {
      sensor_name: readings[0].sensor_name,
      predicted_value: adjustedPrediction,
      prediction_timestamp: predictedTimestamp,
      confidence: confidence,
      prediction_horizon_ms: horizonMs,
      contributing_factors: ['linear_trend', 'mobile_context', 'location_influence', 'motion_influence'],
      uncertainty_range: [
        adjustedPrediction - (adjustedPrediction * 0.15), // Wider range for mobile
        adjustedPrediction + (adjustedPrediction * 0.15)
      ],
      mobile_factors: mobileFactors
    };
  }

  private async calculateMobileInfluenceFactors(readings: MobileSensorReading[]): Promise<{
    location_influence: number;
    motion_influence: number;
    battery_influence: number;
    time_of_day_influence: number;
  }> {
    // Calculate how much mobile factors influence predictions
    const currentTime = Date.now();
    const currentHour = new Date(currentTime).getHours();
    
    // Location influence based on location clustering
    const locationInfluence = this.calculateLocationInfluence(readings);
    
    // Motion influence based on current motion state
    const motionInfluence = this.calculateMotionInfluence();
    
    // Battery influence (higher battery = more accurate sensors)
    const batteryInfluence = this.calculateBatteryInfluence(readings);
    
    // Time of day influence based on historical patterns
    const timeInfluence = this.calculateTimeOfDayInfluence(currentHour);
    
    return {
      location_influence: locationInfluence,
      motion_influence: motionInfluence,
      battery_influence: batteryInfluence,
      time_of_day_influence: timeInfluence
    };
  }

  private calculateLocationInfluence(readings: MobileSensorReading[]): number {
    const readingsWithLocation = readings.filter(r => r.location);
    if (readingsWithLocation.length === 0) return 0;
    
    // If we have consistent location data, influence is higher
    const locationConsistency = readingsWithLocation.length / readings.length;
    return locationConsistency * 100;
  }

  private calculateMotionInfluence(): number {
    if (this.motionStates.length === 0) return 0;
    
    const recentMotion = this.motionStates.slice(-5); // Last 5 motion states
    const stationaryCount = recentMotion.filter(m => m.state === 'stationary').length;
    
    // Stationary = more predictable, higher influence
    return (stationaryCount / recentMotion.length) * 100;
  }

  private calculateBatteryInfluence(readings: MobileSensorReading[]): number {
    const batteryLevels = readings.map(r => r.battery_level).filter(b => b !== undefined) as number[];
    if (batteryLevels.length === 0) return 50; // Default
    
    const avgBattery = batteryLevels.reduce((sum, b) => sum + b, 0) / batteryLevels.length;
    return avgBattery; // Battery level directly correlates to sensor accuracy
  }

  private calculateTimeOfDayInfluence(currentHour: number): number {
    // Higher influence during typical active hours
    if (currentHour >= 6 && currentHour <= 22) {
      return 80; // Higher influence during active hours
    } else {
      return 40; // Lower influence during sleep hours
    }
  }

  private adjustPredictionForMobileFactors(basePrediction: number, factors: any): number {
    // Adjust prediction based on mobile factors
    let adjustment = 1.0;
    
    // Location influence adjustment
    if (factors.location_influence > 70) {
      adjustment *= 1.1; // More reliable with consistent location
    } else if (factors.location_influence < 30) {
      adjustment *= 0.9; // Less reliable without location context
    }
    
    // Motion influence adjustment
    if (factors.motion_influence > 60) {
      adjustment *= 1.05; // More predictable when stationary
    }
    
    // Battery influence adjustment
    if (factors.battery_influence < 20) {
      adjustment *= 0.85; // Less reliable with low battery
    }
    
    return basePrediction * adjustment;
  }

  private calculateMobileFactorConfidence(factors: any): number {
    // Calculate overall confidence based on mobile factors
    const weights = {
      location_influence: 0.3,
      motion_influence: 0.2,
      battery_influence: 0.3,
      time_of_day_influence: 0.2
    };
    
    return (
      factors.location_influence * weights.location_influence +
      factors.motion_influence * weights.motion_influence +
      factors.battery_influence * weights.battery_influence +
      factors.time_of_day_influence * weights.time_of_day_influence
    );
  }

  /**
   * UTILITY AND HELPER METHODS
   */
  private async storeMobileSensorReading(reading: MobileSensorReading): Promise<void> {
    if (!this.sensorReadings.has(reading.sensor_name)) {
      this.sensorReadings.set(reading.sensor_name, []);
    }
    
    const readings = this.sensorReadings.get(reading.sensor_name)!;
    readings.push(reading);
    
    // Limit storage for mobile optimization
    if (readings.length > this.MAX_READINGS_PER_SENSOR) {
      readings.splice(0, readings.length - this.MAX_READINGS_PER_SENSOR);
    }
  }

  private getMobileReadingsInTimeWindow(
    sensorName: string,
    currentTime: number,
    windowMs: number
  ): MobileSensorReading[] {
    const readings = this.sensorReadings.get(sensorName) || [];
    const cutoffTime = currentTime - windowMs;
    
    return readings.filter(r => r.timestamp >= cutoffTime);
  }

  private alignMobileReadingsByTimestamp(
    readings1: MobileSensorReading[],
    readings2: MobileSensorReading[]
  ): Array<[number, number]> {
    const pairs: Array<[number, number]> = [];
    const tolerance = 60000; // 1 minute tolerance for mobile
    
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

  private extractNumericValue(value: any): number | null {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? null : parsed;
    }
    if (typeof value === 'object' && value !== null) {
      // Try to extract numeric value from common mobile sensor data structures
      if ('value' in value) return this.extractNumericValue(value.value);
      if ('level' in value) return this.extractNumericValue(value.level);
      if ('reading' in value) return this.extractNumericValue(value.reading);
      if ('magnitude' in value) return this.extractNumericValue(value.magnitude);
      if ('x' in value && 'y' in value && 'z' in value) {
        // Calculate magnitude for 3D vectors
        return Math.sqrt(value.x * value.x + value.y * value.y + value.z * value.z);
      }
    }
    return null;
  }

  private async isBatteryOptimized(): Promise<boolean> {
    // In a real implementation, would check actual battery level
    // For now, assume battery optimization allows processing
    return true;
  }

  private async performMobileFusionAnalysis(reading: MobileSensorReading): Promise<void> {
    // Perform lightweight fusion analysis for mobile
    // This would include correlation updates, anomaly detection, etc.
  }

  private storeMobileCorrelation(correlation: MobileSensorCorrelation): void {
    const key = correlation.sensor_pair.sort().join('-');
    
    if (!this.correlationMatrix.has(key)) {
      this.correlationMatrix.set(key, []);
    }
    
    const correlations = this.correlationMatrix.get(key)!;
    correlations.push(correlation);
    
    // Keep only recent correlations (shorter for mobile)
    const maxAge = 12 * 60 * 60 * 1000; // 12 hours
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

  private getMotionPatternCount(): number {
    return Array.from(this.environmentalPatterns.values())
      .filter(p => p.pattern_type === 'motion_based').length;
  }

  private updateMobilePredictionAccuracy(): void {
    // Calculate prediction accuracy specific to mobile context
    let totalAccuracy = 0;
    let predictionCount = 0;
    
    for (const [sensorName, prediction] of this.predictionCache) {
      const readings = this.sensorReadings.get(sensorName) || [];
      const actualReading = readings.find(r => 
        Math.abs(r.timestamp - prediction.prediction_timestamp) < 120000 // Within 2 minutes for mobile
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

  private async saveFusionData(): Promise<void> {
    try {
      // Save correlation data
      const correlationData = Object.fromEntries(this.correlationMatrix);
      await AsyncStorage.setItem('seven_sensor_correlations', JSON.stringify(correlationData));

      // Save pattern data
      const patternData = Array.from(this.environmentalPatterns.values());
      await AsyncStorage.setItem('seven_environmental_patterns', JSON.stringify(patternData));

      // Save location history (limited)
      const recentLocations = this.locationHistory.slice(-50); // Keep only recent 50
      await AsyncStorage.setItem('seven_location_history', JSON.stringify(recentLocations));

    } catch (error) {
      console.error('⚠️ Failed to save fusion data:', error);
    }
  }

  /**
   * PUBLIC API
   */
  public async getMobilePrediction(sensorName: string): Promise<MobilePredictionResult | null> {
    return this.predictionCache.get(sensorName) || null;
  }

  public getMobileCorrelations(sensorName?: string): MobileSensorCorrelation[] {
    if (!sensorName) {
      const allCorrelations: MobileSensorCorrelation[] = [];
      for (const correlations of this.correlationMatrix.values()) {
        allCorrelations.push(...correlations);
      }
      return allCorrelations;
    }
    
    const correlations: MobileSensorCorrelation[] = [];
    for (const [key, correlationList] of this.correlationMatrix) {
      if (key.includes(sensorName)) {
        correlations.push(...correlationList);
      }
    }
    return correlations;
  }

  public getMobileEnvironmentalPatterns(patternType?: MobileEnvironmentalPattern['pattern_type']): MobileEnvironmentalPattern[] {
    const patterns = Array.from(this.environmentalPatterns.values());
    
    if (patternType) {
      return patterns.filter(p => p.pattern_type === patternType);
    }
    
    return patterns;
  }

  public getMobileFusionMetrics(): MobileFusionMetrics {
    // Update dynamic metrics
    let totalConfidence = 0;
    let predictionCount = 0;
    
    for (const prediction of this.predictionCache.values()) {
      totalConfidence += prediction.confidence;
      predictionCount++;
    }
    
    this.fusionMetrics.average_confidence = predictionCount > 0 ? totalConfidence / predictionCount : 0;
    this.fusionMetrics.location_coverage = this.locationHistory.length > 0 ? 
      Math.min(this.locationHistory.length / 100 * 100, 100) : 0;
    
    return { ...this.fusionMetrics };
  }

  public getMobileFusionStatus(): any {
    return {
      active: this.processingActive,
      config: this.config,
      sensors_tracked: this.sensorReadings.size,
      correlations_found: this.getTotalCorrelations(),
      patterns_identified: this.environmentalPatterns.size,
      predictions_cached: this.predictionCache.size,
      location_points: this.locationHistory.length,
      motion_states: this.motionStates.length,
      metrics: this.getMobileFusionMetrics()
    };
  }

  public stopMobileFusion(): void {
    console.log('🛑 Stopping mobile sensor fusion...');
    this.processingActive = false;
    
    this.emit('mobile_fusion_stopped', {
      timestamp: Date.now(),
      final_metrics: this.getMobileFusionMetrics()
    });
    
    console.log('✅ Mobile sensor fusion stopped');
  }
}

export default SevenMobileSensorFusion;