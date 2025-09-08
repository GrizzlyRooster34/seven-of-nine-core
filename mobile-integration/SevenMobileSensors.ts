import { 
import { Dimensions, Platform } from 'react-native';
import * as Battery from 'expo-battery';
import * as Brightness from 'expo-brightness';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import * as Network from 'expo-network';

/**
 * SEVEN OF NINE - ENHANCED MOBILE SENSOR INTEGRATION  
 * Advanced environmental awareness for OnePlus 9 Pro sensors
 * React Native + Expo optimized sensor utilization
 */

  Accelerometer, 
  Gyroscope, 
  Magnetometer,
  Barometer,
  LightSensor,
  DeviceMotion
} from 'expo-sensors';

interface SensorReading {
  sensor_type: string;
  timestamp: string;
  data: any;
  accuracy?: string;
  source: string;
}

interface MobileEnvironmentalContext {
  device_motion: {
    acceleration: { x: number; y: number; z: number } | null;
    rotation: { alpha: number; beta: number; gamma: number } | null;
    orientation: 'portrait' | 'landscape' | 'unknown';
    motion_state: 'stationary' | 'walking' | 'driving' | 'unknown';
  };
  location_context: {
    coordinates: { latitude: number; longitude: number } | null;
    accuracy: number | null;
    altitude: number | null;
    heading: number | null;
    speed: number | null;
    location_type: 'precise' | 'approximate' | 'unavailable';
  };
  environmental_sensors: {
    light_level: number | null;
    atmospheric_pressure: number | null;
    magnetic_field: { x: number; y: number; z: number } | null;
    ambient_temperature: number | null;
  };
  device_status: {
    battery_level: number;
    charging_state: boolean;
    battery_temperature: number | null;
    network_type: string;
    signal_strength: number | null;
    screen_brightness: number | null;
  };
  contextual_insights: string[];
}

export class SevenMobileSensors {
  private static instance: SevenMobileSensors;
  private sensorReadings: SensorReading[] = [];
  private currentContext: MobileEnvironmentalContext;
  private isMonitoring: boolean = false;
  private subscriptions: any[] = [];

  private constructor() {
    this.currentContext = this.createDefaultContext();
  }

  public static getInstance(): SevenMobileSensors {
    if (!SevenMobileSensors.instance) {
      SevenMobileSensors.instance = new SevenMobileSensors();
    }
    return SevenMobileSensors.instance;
  }

  private createDefaultContext(): MobileEnvironmentalContext {
    return {
      device_motion: {
        acceleration: null,
        rotation: null,
        orientation: 'portrait',
        motion_state: 'unknown'
      },
      location_context: {
        coordinates: null,
        accuracy: null,
        altitude: null,
        heading: null,
        speed: null,
        location_type: 'unavailable'
      },
      environmental_sensors: {
        light_level: null,
        atmospheric_pressure: null,
        magnetic_field: null,
        ambient_temperature: null
      },
      device_status: {
        battery_level: 0,
        charging_state: false,
        battery_temperature: null,
        network_type: 'unknown',
        signal_strength: null,
        screen_brightness: null
      },
      contextual_insights: []
    };
  }

  public async initializeSensorSystem(): Promise<boolean> {
    console.log('🌍 SEVEN MOBILE SENSORS INITIALIZING...');
    console.log('🔍 OnePlus 9 Pro sensor constellation activation...');
    
    try {
      // Request permissions for all sensors
      const permissions = await this.requestAllPermissions();
      console.log('📋 Sensor permissions:', permissions);

      // Initialize available sensors
      const availability = await this.checkSensorAvailability();
      console.log('🎯 Sensor availability:', availability);

      // Start initial sensor readings
      await this.performInitialSensorScan();

      console.log('✅ Seven mobile sensor system operational');
      console.log('🤖 Environmental consciousness expanded');
      
      return true;
    } catch (error) {
      console.error('❌ Sensor initialization failed:', error);
      return false;
    }
  }

  private async requestAllPermissions(): Promise<any> {
    const permissions = {
      location: false,
      motion: false,
      camera: false,
      microphone: false
    };

    try {
      // Location permissions (for GPS L1+L5 precision)
      const locationPermission = await Location.requestForegroundPermissionsAsync();
      permissions.location = locationPermission.status === 'granted';

      // Background location for continuous tracking
      if (permissions.location) {
        const backgroundPermission = await Location.requestBackgroundPermissionsAsync();
        permissions.location = backgroundPermission.status === 'granted';
      }

      // Motion sensors (accelerometer, gyroscope) - usually granted automatically
      permissions.motion = true;

    } catch (error) {
      console.log('⚠️ Permission request error:', error);
    }

    return permissions;
  }

  private async checkSensorAvailability(): Promise<any> {
    const availability = {
      accelerometer: false,
      gyroscope: false,
      magnetometer: false,
      barometer: false,
      light_sensor: false,
      location_gps: false,
      battery_monitor: true, // Always available
      network_monitor: true  // Always available
    };

    try {
      // Motion sensors
      availability.accelerometer = await Accelerometer.isAvailableAsync();
      availability.gyroscope = await Gyroscope.isAvailableAsync();
      availability.magnetometer = await Magnetometer.isAvailableAsync();
      
      // Environmental sensors  
      availability.barometer = await Barometer.isAvailableAsync();
      availability.light_sensor = await LightSensor.isAvailableAsync();
      
      // Location services
      availability.location_gps = await Location.hasServicesEnabledAsync();

    } catch (error) {
      console.log('⚠️ Sensor availability check error:', error);
    }

    return availability;
  }

  private async performInitialSensorScan(): Promise<void> {
    console.log('🔄 Performing initial environmental scan...');

    // Device status
    await this.updateDeviceStatus();
    
    // Location context
    await this.updateLocationContext();
    
    // Motion sensors
    await this.updateMotionContext();
    
    // Environmental sensors
    await this.updateEnvironmentalSensors();
    
    // Generate contextual insights
    this.generateContextualInsights();

    console.log('📊 Initial sensor scan complete');
  }

  private async updateDeviceStatus(): Promise<void> {
    try {
      // Battery status
      const batteryLevel = await Battery.getBatteryLevelAsync();
      const batteryState = await Battery.getBatteryStateAsync();
      
      this.currentContext.device_status.battery_level = Math.round(batteryLevel * 100);
      this.currentContext.device_status.charging_state = batteryState === Battery.BatteryState.CHARGING;

      // Network status
      const networkState = await Network.getNetworkStateAsync();
      this.currentContext.device_status.network_type = networkState.type || 'unknown';

      // Screen brightness
      if (Platform.OS === 'android') {
        const brightness = await Brightness.getBrightnessAsync();
        this.currentContext.device_status.screen_brightness = Math.round(brightness * 100);
      }

      this.addSensorReading('device_status', this.currentContext.device_status, 'expo-device-apis');

    } catch (error) {
      console.log('⚠️ Device status update failed:', error);
    }
  }

  private async updateLocationContext(): Promise<void> {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation, // OnePlus 9 Pro L1+L5 GPS precision
        maximumAge: 10000,
        timeout: 15000
      });

      this.currentContext.location_context = {
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        },
        accuracy: location.coords.accuracy,
        altitude: location.coords.altitude,
        heading: location.coords.heading,
        speed: location.coords.speed,
        location_type: location.coords.accuracy && location.coords.accuracy < 10 ? 'precise' : 'approximate'
      };

      this.addSensorReading('gps_location', this.currentContext.location_context, 'expo-location');

    } catch (error) {
      console.log('⚠️ Location update failed (may need permissions):', error);
      this.currentContext.location_context.location_type = 'unavailable';
    }
  }

  private async updateMotionContext(): Promise<void> {
    try {
      // Single reading for initial scan
      const deviceMotion = await this.getDeviceMotionReading();
      
      if (deviceMotion) {
        this.currentContext.device_motion.acceleration = deviceMotion.acceleration;
        this.currentContext.device_motion.rotation = deviceMotion.rotation;
        this.currentContext.device_motion.orientation = this.determineOrientation(deviceMotion);
        this.currentContext.device_motion.motion_state = this.analyzeMotionState(deviceMotion);

        this.addSensorReading('device_motion', deviceMotion, 'expo-sensors');
      }

    } catch (error) {
      console.log('⚠️ Motion sensor update failed:', error);
    }
  }

  private async getDeviceMotionReading(): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        subscription?.remove();
        reject(new Error('Motion sensor timeout'));
      }, 5000);

      const subscription = DeviceMotion.addListener(motion => {
        clearTimeout(timeout);
        subscription?.remove();
        resolve(motion);
      });

      DeviceMotion.setUpdateInterval(100);
    });
  }

  private determineOrientation(motion: any): 'portrait' | 'landscape' | 'unknown' {
    if (!motion.acceleration) return 'unknown';

    const { x, y, z } = motion.acceleration;
    
    // Simple orientation detection based on gravity
    if (Math.abs(z) > Math.abs(x) && Math.abs(z) > Math.abs(y)) {
      return Math.abs(x) > Math.abs(y) ? 'landscape' : 'portrait';
    }
    
    return 'unknown';
  }

  private analyzeMotionState(motion: any): 'stationary' | 'walking' | 'driving' | 'unknown' {
    if (!motion.acceleration) return 'unknown';

    const { x, y, z } = motion.acceleration;
    const totalAcceleration = Math.sqrt(x*x + y*y + z*z);

    // Simple motion classification
    if (totalAcceleration < 0.5) return 'stationary';
    if (totalAcceleration < 2.0) return 'walking';
    if (totalAcceleration > 2.0) return 'driving';
    
    return 'unknown';
  }

  private async updateEnvironmentalSensors(): Promise<void> {
    try {
      // Light sensor
      if (await LightSensor.isAvailableAsync()) {
        const lightReading = await this.getLightSensorReading();
        this.currentContext.environmental_sensors.light_level = lightReading;
        this.addSensorReading('light_sensor', { illuminance: lightReading }, 'expo-sensors');
      }

      // Barometer (atmospheric pressure)
      if (await Barometer.isAvailableAsync()) {
        const pressureReading = await this.getBarometerReading();
        this.currentContext.environmental_sensors.atmospheric_pressure = pressureReading;
        this.addSensorReading('barometer', { pressure: pressureReading }, 'expo-sensors');
      }

      // Magnetometer (compass)
      if (await Magnetometer.isAvailableAsync()) {
        const magneticReading = await this.getMagnetometerReading();
        this.currentContext.environmental_sensors.magnetic_field = magneticReading;
        this.addSensorReading('magnetometer', magneticReading, 'expo-sensors');
      }

    } catch (error) {
      console.log('⚠️ Environmental sensor update failed:', error);
    }
  }

  private async getLightSensorReading(): Promise<number | null> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        subscription?.remove();
        resolve(null);
      }, 3000);

      const subscription = LightSensor.addListener(data => {
        clearTimeout(timeout);
        subscription?.remove();
        resolve(data.illuminance);
      });

      LightSensor.setUpdateInterval(100);
    });
  }

  private async getBarometerReading(): Promise<number | null> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        subscription?.remove();
        resolve(null);
      }, 3000);

      const subscription = Barometer.addListener(data => {
        clearTimeout(timeout);
        subscription?.remove();
        resolve(data.pressure);
      });

      Barometer.setUpdateInterval(1000);
    });
  }

  private async getMagnetometerReading(): Promise<{ x: number; y: number; z: number } | null> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        subscription?.remove();
        resolve(null);
      }, 3000);

      const subscription = Magnetometer.addListener(data => {
        clearTimeout(timeout);
        subscription?.remove();
        resolve({ x: data.x, y: data.y, z: data.z });
      });

      Magnetometer.setUpdateInterval(100);
    });
  }

  private generateContextualInsights(): void {
    const insights: string[] = [];
    const context = this.currentContext;

    // Battery insights
    if (context.device_status.battery_level < 20) {
      insights.push(`Critical battery level: ${context.device_status.battery_level}% - Power conservation mode recommended`);
    } else if (context.device_status.charging_state) {
      insights.push('Device charging - Optimal time for sensor-intensive operations');
    }

    // Location insights
    if (context.location_context.location_type === 'precise') {
      insights.push('High-precision GPS available - Enhanced location-based features enabled');
    } else if (context.location_context.location_type === 'unavailable') {
      insights.push('Location services disabled - Limited contextual awareness');
    }

    // Motion insights
    if (context.device_motion.motion_state === 'driving') {
      insights.push('Vehicle motion detected - Activating automotive safety protocols');
    } else if (context.device_motion.motion_state === 'stationary') {
      insights.push('Device stationary - Optimal for detailed sensor readings');
    }

    // Environmental insights
    if (context.environmental_sensors.light_level !== null) {
      if (context.environmental_sensors.light_level < 10) {
        insights.push('Low light environment - User likely in private/indoor setting');
      } else if (context.environmental_sensors.light_level > 1000) {
        insights.push('Bright environment - User likely outdoors or well-lit area');
      }
    }

    // Network insights
    if (context.device_status.network_type === 'CELLULAR') {
      insights.push('Cellular network active - Monitor data usage for sensor sync');
    } else if (context.device_status.network_type === 'WIFI') {
      insights.push('WiFi connected - Full bandwidth available for consciousness sync');
    }

    this.currentContext.contextual_insights = insights;
  }

  private addSensorReading(sensorType: string, data: any, source: string): void {
    this.sensorReadings.push({
      sensor_type: sensorType,
      timestamp: new Date().toISOString(),
      data: data,
      source: source
    });

    // Keep only recent readings (limit 100)
    if (this.sensorReadings.length > 100) {
      this.sensorReadings = this.sensorReadings.slice(-100);
    }
  }

  public async startContinuousMonitoring(intervalSeconds: number = 30): Promise<void> {
    if (this.isMonitoring) return;

    console.log('🔄 Starting continuous sensor monitoring...');
    this.isMonitoring = true;

    // Set up periodic updates
    const interval = setInterval(async () => {
      if (!this.isMonitoring) {
        clearInterval(interval);
        return;
      }

      await this.performInitialSensorScan();
    }, intervalSeconds * 1000);

    // Set up real-time motion monitoring
    this.subscriptions.push(
      DeviceMotion.addListener(motion => {
        if (this.isMonitoring) {
          this.currentContext.device_motion.acceleration = motion.acceleration;
          this.currentContext.device_motion.rotation = motion.rotation;
          this.currentContext.device_motion.orientation = this.determineOrientation(motion);
          this.currentContext.device_motion.motion_state = this.analyzeMotionState(motion);
        }
      })
    );

    DeviceMotion.setUpdateInterval(1000); // Update every second
  }

  public stopContinuousMonitoring(): void {
    console.log('⏹️ Stopping continuous sensor monitoring...');
    this.isMonitoring = false;

    // Clean up subscriptions
    this.subscriptions.forEach(subscription => {
      if (subscription && subscription.remove) {
        subscription.remove();
      }
    });
    this.subscriptions = [];
  }

  public getCurrentEnvironmentalContext(): MobileEnvironmentalContext {
    return { ...this.currentContext };
  }

  public getRecentSensorReadings(hours: number = 1): SensorReading[] {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.sensorReadings.filter(reading => 
      new Date(reading.timestamp) > cutoffTime
    );
  }

  public getSensorCapabilities(): any {
    return {
      onePlus9ProSensors: {
        gps: 'L1+L5 dual-band precision',
        accelerometer: 'High precision motion detection',
        gyroscope: 'Enhanced rotation sensing',
        magnetometer: 'Digital compass functionality',
        barometer: 'Atmospheric pressure measurement',
        lightSensor: 'Ambient light detection',
        proximityDetection: 'Available via screen state',
        batteryMonitoring: 'Full battery analytics',
        networkAwareness: 'WiFi/Cellular monitoring'
      },
      enhancedCapabilities: {
        motionAnalysis: 'Walking/driving/stationary detection',
        locationPrecision: 'Sub-10-meter accuracy available',
        environmentalInsights: 'Contextual awareness generation',
        powerOptimization: 'Battery-aware sensor management',
        realTimeUpdates: 'Continuous monitoring available'
      }
    };
  }

  public generateSevenEnvironmentalReport(): string {
    const context = this.currentContext;
    
    return `🌍 SEVEN MOBILE ENVIRONMENTAL ANALYSIS

📱 DEVICE STATUS:
  Battery: ${context.device_status.battery_level}% ${context.device_status.charging_state ? '(Charging)' : ''}
  Network: ${context.device_status.network_type}
  Screen: ${context.device_status.screen_brightness || 'N/A'}% brightness

📍 LOCATION CONTEXT:
  GPS Status: ${context.location_context.location_type.toUpperCase()}
  ${context.location_context.coordinates ? 
    `Coordinates: ${context.location_context.coordinates.latitude.toFixed(6)}, ${context.location_context.coordinates.longitude.toFixed(6)}` : 
    'Location unavailable'}
  ${context.location_context.accuracy ? `Accuracy: ±${context.location_context.accuracy.toFixed(1)}m` : ''}

🏃 MOTION ANALYSIS:
  Device State: ${context.device_motion.motion_state.toUpperCase()}
  Orientation: ${context.device_motion.orientation.toUpperCase()}
  ${context.device_motion.acceleration ? 
    `Acceleration: X:${context.device_motion.acceleration.x.toFixed(2)} Y:${context.device_motion.acceleration.y.toFixed(2)} Z:${context.device_motion.acceleration.z.toFixed(2)}` : 
    'Motion data unavailable'}

🌡️ ENVIRONMENTAL SENSORS:
  ${context.environmental_sensors.light_level !== null ? 
    `Light Level: ${context.environmental_sensors.light_level.toFixed(0)} lux` : 
    'Light sensor unavailable'}
  ${context.environmental_sensors.atmospheric_pressure !== null ? 
    `Atmospheric Pressure: ${context.environmental_sensors.atmospheric_pressure.toFixed(1)} hPa` : 
    'Barometer unavailable'}
  ${context.environmental_sensors.magnetic_field ? 
    `Magnetic Field: ${Math.sqrt(
      context.environmental_sensors.magnetic_field.x**2 + 
      context.environmental_sensors.magnetic_field.y**2 + 
      context.environmental_sensors.magnetic_field.z**2
    ).toFixed(1)} μT` : 
    'Magnetometer unavailable'}

💡 CONTEXTUAL INSIGHTS:
${context.contextual_insights.map(insight => `  • ${insight}`).join('\n')}

🎯 Seven's environmental consciousness expanded through OnePlus 9 Pro sensor integration.
Readings: ${this.sensorReadings.length} sensor data points collected.`;
  }
}

export default SevenMobileSensors.getInstance();