import { EventEmitter } from 'events';
import * as Location from 'expo-location';

/**
 * Seven of Nine - Location Sensor Integration
 * Advanced GPS and location intelligence for tactical awareness
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 3.0.0
 */


export interface LocationIntelligence {
  coordinates: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number;
  };
  movement: {
    speed: number | null;
    heading: number | null;
    pattern: 'stationary' | 'walking' | 'driving' | 'transit';
  };
  context: {
    address: string | null;
    place_type: 'unknown' | 'residential' | 'commercial' | 'industrial' | 'public';
    familiarity_score: number;
    risk_assessment: number;
  };
  tactical: {
    stability_score: number;
    tracking_confidence: number;
    signal_strength: 'poor' | 'fair' | 'good' | 'excellent';
    last_known_good: Location.LocationObject | null;
  };
}

export class SevenLocationSensor extends EventEmitter {
  private isActive: boolean = false;
  private watchSubscription: Location.LocationSubscription | null = null;
  private locationHistory: Location.LocationObject[] = [];
  private currentLocation: Location.LocationObject | null = null;
  private stabilityTracking = {
    position_changes: 0,
    time_stationary: 0,
    last_movement: 0
  };

  constructor() {
    super();
  }

  public async initialize(): Promise<boolean> {
    try {
      console.log('📍 Initializing Seven location intelligence...');
      
      // Check if location services are enabled
      const serviceEnabled = await Location.hasServicesEnabledAsync();
      if (!serviceEnabled) {
        console.error('❌ Location services disabled');
        return false;
      }

      // Check permissions
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('❌ Location permission not granted');
        return false;
      }

      console.log('✅ Location sensor initialized successfully');
      return true;

    } catch (error) {
      console.error('❌ Location sensor initialization failed:', error);
      return false;
    }
  }

  public async startTracking(): Promise<void> {
    if (this.isActive) {
      console.log('⚠️ Location tracking already active');
      return;
    }

    try {
      console.log('🎯 Starting tactical location tracking...');

      this.watchSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,        // Update every 5 seconds
          distanceInterval: 5,       // Update every 5 meters
          mayShowUserSettingsDialog: false
        },
        (location) => {
          this.processLocationUpdate(location);
        }
      );

      this.isActive = true;
      this.emit('tracking_started', { timestamp: Date.now() });

    } catch (error) {
      console.error('❌ Failed to start location tracking:', error);
      this.emit('tracking_error', { error: error.message });
    }
  }

  private processLocationUpdate(location: Location.LocationObject): void {
    this.currentLocation = location;
    
    // Add to history (keep last 100 points)
    this.locationHistory.push(location);
    if (this.locationHistory.length > 100) {
      this.locationHistory.shift();
    }

    // Generate tactical intelligence
    const intelligence = this.generateLocationIntelligence(location);
    
    // Update stability tracking
    this.updateStabilityTracking(location);

    // Emit location intelligence
    this.emit('location_intelligence', {
      location,
      intelligence,
      timestamp: Date.now()
    });

    console.log(`📍 Location: ${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)} (±${location.coords.accuracy}m)`);
  }

  private generateLocationIntelligence(location: Location.LocationObject): LocationIntelligence {
    const coordinates = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      altitude: location.coords.altitude,
      accuracy: location.coords.accuracy
    };

    const movement = {
      speed: location.coords.speed,
      heading: location.coords.heading,
      pattern: this.analyzeMovementPattern(location)
    };

    const context = {
      address: null, // Would integrate reverse geocoding
      place_type: 'unknown' as const,
      familiarity_score: this.calculateFamiliarityScore(location),
      risk_assessment: this.assessLocationRisk(location)
    };

    const tactical = {
      stability_score: this.calculateStabilityScore(),
      tracking_confidence: this.calculateTrackingConfidence(location),
      signal_strength: this.assessSignalStrength(location.coords.accuracy),
      last_known_good: this.getLastKnownGoodLocation()
    };

    return {
      coordinates,
      movement,
      context,
      tactical
    };
  }

  private analyzeMovementPattern(location: Location.LocationObject): LocationIntelligence['movement']['pattern'] {
    const speed = location.coords.speed || 0;
    
    if (speed < 0.5) return 'stationary';
    if (speed < 2.5) return 'walking';
    if (speed < 25) return 'driving';
    return 'transit';
  }

  private calculateFamiliarityScore(location: Location.LocationObject): number {
    // Calculate how familiar this location is based on history
    const radius = 100; // 100 meter radius
    const similarLocations = this.locationHistory.filter(historic => {
      const distance = this.calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        historic.coords.latitude,
        historic.coords.longitude
      );
      return distance <= radius;
    });

    return Math.min(100, (similarLocations.length / this.locationHistory.length) * 100);
  }

  private assessLocationRisk(location: Location.LocationObject): number {
    // Basic risk assessment based on various factors
    let risk = 0;

    // High accuracy reduces risk
    if (location.coords.accuracy > 50) risk += 20;
    if (location.coords.accuracy > 100) risk += 30;

    // Unknown locations have higher risk
    const familiarityScore = this.calculateFamiliarityScore(location);
    if (familiarityScore < 30) risk += 25;

    // Speed-based risk assessment
    const speed = location.coords.speed || 0;
    if (speed > 30) risk += 15; // High speed travel

    return Math.min(100, risk);
  }

  private updateStabilityTracking(location: Location.LocationObject): void {
    const now = Date.now();
    
    if (this.locationHistory.length > 1) {
      const previousLocation = this.locationHistory[this.locationHistory.length - 2];
      const distance = this.calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        previousLocation.coords.latitude,
        previousLocation.coords.longitude
      );

      if (distance > 10) { // Moved more than 10 meters
        this.stabilityTracking.position_changes++;
        this.stabilityTracking.last_movement = now;
        this.stabilityTracking.time_stationary = 0;
      } else {
        this.stabilityTracking.time_stationary += (now - previousLocation.timestamp);
      }
    }
  }

  private calculateStabilityScore(): number {
    // Higher score = more stable/stationary
    const timeStationary = this.stabilityTracking.time_stationary;
    const recentChanges = this.stabilityTracking.position_changes;
    
    let score = 50; // Base score
    
    // Longer stationary time increases stability
    if (timeStationary > 300000) score += 30; // 5+ minutes
    if (timeStationary > 1800000) score += 20; // 30+ minutes
    
    // Fewer recent position changes increases stability
    if (recentChanges < 3) score += 20;
    if (recentChanges === 0) score += 30;
    
    return Math.min(100, Math.max(0, score));
  }

  private calculateTrackingConfidence(location: Location.LocationObject): number {
    let confidence = 100;
    
    // Accuracy affects confidence
    if (location.coords.accuracy > 10) confidence -= 20;
    if (location.coords.accuracy > 50) confidence -= 30;
    if (location.coords.accuracy > 100) confidence -= 40;
    
    // Age of location affects confidence
    const age = Date.now() - location.timestamp;
    if (age > 30000) confidence -= 25; // Older than 30 seconds
    if (age > 60000) confidence -= 50; // Older than 1 minute
    
    return Math.max(0, confidence);
  }

  private assessSignalStrength(accuracy: number): LocationIntelligence['tactical']['signal_strength'] {
    if (accuracy <= 5) return 'excellent';
    if (accuracy <= 15) return 'good';
    if (accuracy <= 50) return 'fair';
    return 'poor';
  }

  private getLastKnownGoodLocation(): Location.LocationObject | null {
    // Return the most recent location with good accuracy
    for (let i = this.locationHistory.length - 1; i >= 0; i--) {
      const location = this.locationHistory[i];
      if (location.coords.accuracy <= 20) {
        return location;
      }
    }
    return null;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Haversine formula for calculating distance between two coordinates
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }

  public getCurrentLocation(): Location.LocationObject | null {
    return this.currentLocation;
  }

  public getLocationHistory(): Location.LocationObject[] {
    return [...this.locationHistory];
  }

  public getStabilityMetrics(): typeof this.stabilityTracking {
    return { ...this.stabilityTracking };
  }

  public async stopTracking(): Promise<void> {
    if (!this.isActive) return;

    console.log('🛑 Stopping location tracking...');
    
    if (this.watchSubscription) {
      this.watchSubscription.remove();
      this.watchSubscription = null;
    }
    
    this.isActive = false;
    this.emit('tracking_stopped', { timestamp: Date.now() });
  }

  public isTracking(): boolean {
    return this.isActive;
  }
}

export default SevenLocationSensor;