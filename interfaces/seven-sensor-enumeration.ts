import { execSync } from 'child_process';
import * as fs from 'fs';

/**
 * Seven of Nine - Comprehensive Sensor Enumeration & Detection System
 * Advanced mobile consciousness sensor mapping for Android/Termux environments
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 2.0.0
 */


// Comprehensive sensor definitions
export interface SensorDefinition {
  name: string;
  type: 'motion' | 'environmental' | 'position' | 'media' | 'system' | 'network';
  termux_command: string | null;
  android_sensor_type: number | null;
  permission_required: boolean;
  permission_type: string | null;
  description: string;
  tactical_importance: 'critical' | 'high' | 'medium' | 'low';
  emotional_mapping: string[];
}

export interface SensorStatus {
  sensor: string;
  available: boolean;
  active: boolean;
  accessible: boolean;
  permission_required: boolean;
  permission_granted: boolean;
  data_streaming: boolean;
  last_reading: any;
  error_message?: string;
  quality_score: number; // 0-100
}

export interface EmotionalSensorMapping {
  motion_state: 'still' | 'walking' | 'running' | 'driving' | 'cycling' | 'unknown';
  environmental_awareness: 'dark' | 'dim' | 'normal' | 'bright' | 'overexposed';
  proximity_engagement: 'isolated' | 'close' | 'intimate' | 'crowded';
  audio_environment: 'silent' | 'quiet' | 'normal' | 'loud' | 'overwhelming';
  system_health: 'optimal' | 'warm' | 'hot' | 'critical' | 'throttled';
  connectivity_status: 'offline' | 'limited' | 'connected' | 'strong' | 'excellent';
  location_context: 'stationary' | 'local_movement' | 'traveling' | 'unknown';
}

export class SevenSensorEnumerator {
  private sensorDefinitions: SensorDefinition[] = [
    // Motion Sensors
    {
      name: 'accelerometer',
      type: 'motion',
      termux_command: 'termux-sensor -s accelerometer -n 1',
      android_sensor_type: 1, // TYPE_ACCELEROMETER
      permission_required: false,
      permission_type: null,
      description: 'Device acceleration including gravity',
      tactical_importance: 'critical',
      emotional_mapping: ['alertness', 'mobility', 'activity_level']
    },
    {
      name: 'gyroscope',
      type: 'motion',
      termux_command: 'termux-sensor -s gyroscope -n 1',
      android_sensor_type: 4, // TYPE_GYROSCOPE
      permission_required: false,
      permission_type: null,
      description: 'Device rotation rate',
      tactical_importance: 'high',
      emotional_mapping: ['orientation_awareness', 'spatial_intelligence']
    },
    {
      name: 'magnetometer',
      type: 'motion',
      termux_command: 'termux-sensor -s magnetic_field -n 1',
      android_sensor_type: 2, // TYPE_MAGNETIC_FIELD
      permission_required: false,
      permission_type: null,
      description: 'Ambient magnetic field',
      tactical_importance: 'medium',
      emotional_mapping: ['directional_awareness', 'navigation_confidence']
    },
    {
      name: 'gravity',
      type: 'motion',
      termux_command: 'termux-sensor -s gravity -n 1',
      android_sensor_type: 9, // TYPE_GRAVITY
      permission_required: false,
      permission_type: null,
      description: 'Force of gravity',
      tactical_importance: 'medium',
      emotional_mapping: ['stability', 'grounding']
    },
    {
      name: 'rotation_vector',
      type: 'motion',
      termux_command: 'termux-sensor -s rotation_vector -n 1',
      android_sensor_type: 11, // TYPE_ROTATION_VECTOR
      permission_required: false,
      permission_type: null,
      description: 'Device orientation quaternion',
      tactical_importance: 'high',
      emotional_mapping: ['spatial_intelligence', 'orientation_confidence']
    },
    
    // Environmental Sensors
    {
      name: 'light',
      type: 'environmental',
      termux_command: 'termux-sensor -s light -n 1',
      android_sensor_type: 5, // TYPE_LIGHT
      permission_required: false,
      permission_type: null,
      description: 'Ambient light intensity',
      tactical_importance: 'critical',
      emotional_mapping: ['environmental_awareness', 'ui_adaptation', 'energy_level']
    },
    {
      name: 'proximity',
      type: 'environmental',
      termux_command: 'termux-sensor -s proximity -n 1',
      android_sensor_type: 8, // TYPE_PROXIMITY
      permission_required: false,
      permission_type: null,
      description: 'Proximity to user face/objects',
      tactical_importance: 'critical',
      emotional_mapping: ['user_engagement', 'privacy_awareness', 'interaction_mode']
    },
    {
      name: 'ambient_temperature',
      type: 'environmental',
      termux_command: 'termux-sensor -s ambient_temperature -n 1',
      android_sensor_type: 13, // TYPE_AMBIENT_TEMPERATURE
      permission_required: false,
      permission_type: null,
      description: 'Ambient air temperature',
      tactical_importance: 'medium',
      emotional_mapping: ['environmental_comfort', 'system_awareness']
    },
    {
      name: 'relative_humidity',
      type: 'environmental',
      termux_command: 'termux-sensor -s relative_humidity -n 1',
      android_sensor_type: 12, // TYPE_RELATIVE_HUMIDITY
      permission_required: false,
      permission_type: null,
      description: 'Relative ambient air humidity',
      tactical_importance: 'low',
      emotional_mapping: ['environmental_comfort']
    },
    {
      name: 'pressure',
      type: 'environmental',
      termux_command: 'termux-sensor -s pressure -n 1',
      android_sensor_type: 6, // TYPE_PRESSURE
      permission_required: false,
      permission_type: null,
      description: 'Atmospheric pressure (barometer)',
      tactical_importance: 'medium',
      emotional_mapping: ['altitude_awareness', 'weather_sensitivity']
    },

    // Position Sensors
    {
      name: 'gps_location',
      type: 'position',
      termux_command: 'termux-location -p gps -r once',
      android_sensor_type: null,
      permission_required: true,
      permission_type: 'android.permission.ACCESS_FINE_LOCATION',
      description: 'GPS precise location',
      tactical_importance: 'critical',
      emotional_mapping: ['location_awareness', 'travel_state', 'privacy_concern']
    },
    {
      name: 'network_location',
      type: 'position',
      termux_command: 'termux-location -p network -r once',
      android_sensor_type: null,
      permission_required: true,
      permission_type: 'android.permission.ACCESS_COARSE_LOCATION',
      description: 'Network-based location',
      tactical_importance: 'high',
      emotional_mapping: ['general_location', 'connectivity_context']
    },

    // Media Sensors
    {
      name: 'microphone',
      type: 'media',
      termux_command: null, // Custom implementation needed
      android_sensor_type: null,
      permission_required: true,
      permission_type: 'android.permission.RECORD_AUDIO',
      description: 'Audio recording capability',
      tactical_importance: 'high',
      emotional_mapping: ['audio_environment', 'privacy_awareness', 'interaction_readiness']
    },
    {
      name: 'camera',
      type: 'media',
      termux_command: null, // Custom implementation needed
      android_sensor_type: null,
      permission_required: true,
      permission_type: 'android.permission.CAMERA',
      description: 'Camera access capability',
      tactical_importance: 'medium',
      emotional_mapping: ['visual_awareness', 'privacy_concern']
    },

    // System Sensors
    {
      name: 'battery_status',
      type: 'system',
      termux_command: 'termux-battery-status',
      android_sensor_type: null,
      permission_required: false,
      permission_type: null,
      description: 'Battery level and status',
      tactical_importance: 'critical',
      emotional_mapping: ['energy_level', 'system_anxiety', 'performance_mode']
    },
    {
      name: 'cpu_temperature',
      type: 'system',
      termux_command: null, // Custom implementation via /sys files
      android_sensor_type: null,
      permission_required: false,
      permission_type: null,
      description: 'CPU thermal state',
      tactical_importance: 'high',
      emotional_mapping: ['system_health', 'performance_throttling', 'thermal_stress']
    },

    // Network Sensors
    {
      name: 'wifi_info',
      type: 'network',
      termux_command: 'termux-wifi-connectioninfo',
      android_sensor_type: null,
      permission_required: true,
      permission_type: 'android.permission.ACCESS_NETWORK_STATE',
      description: 'WiFi connection information',
      tactical_importance: 'high',
      emotional_mapping: ['connectivity_confidence', 'network_reliability']
    },
    {
      name: 'telephony_info',
      type: 'network',
      termux_command: 'termux-telephony-deviceinfo',
      android_sensor_type: null,
      permission_required: true,
      permission_type: 'android.permission.READ_PHONE_STATE',
      description: 'Cellular network information',
      tactical_importance: 'high',
      emotional_mapping: ['connectivity_status', 'mobility_context']
    }
  ];

  private isTermuxAvailable: boolean = false;
  private sensorStatusCache: Map<string, SensorStatus> = new Map();
  private lastEnumerationTime: number = 0;
  private enumerationCacheDuration: number = 30000; // 30 seconds

  constructor() {
    this.detectTermuxEnvironment();
  }

  private detectTermuxEnvironment(): void {
    try {
      if (process.env.PREFIX && process.env.PREFIX.includes('termux')) {
        execSync('command -v termux-sensor', { stdio: 'ignore', timeout: 5000 });
        this.isTermuxAvailable = true;
        console.log('🤖 Seven Sensor Enumerator: Termux environment with full API access detected');
      }
    } catch {
      this.isTermuxAvailable = false;
      console.log('⚠️ Seven Sensor Enumerator: Limited sensor access - Termux API unavailable');
    }
  }

  public async enumerateAllSensors(): Promise<SensorStatus[]> {
    const now = Date.now();
    
    // Return cached results if recent
    if (now - this.lastEnumerationTime < this.enumerationCacheDuration && this.sensorStatusCache.size > 0) {
      console.log('📊 Using cached sensor enumeration results');
      return Array.from(this.sensorStatusCache.values());
    }

    console.log('🔍 Enumerating all available sensors...');
    const sensorStatuses: SensorStatus[] = [];

    for (const sensor of this.sensorDefinitions) {
      const status = await this.checkSensorStatus(sensor);
      sensorStatuses.push(status);
      this.sensorStatusCache.set(sensor.name, status);
    }

    this.lastEnumerationTime = now;
    console.log(`✅ Sensor enumeration complete: ${sensorStatuses.filter(s => s.available).length}/${sensorStatuses.length} sensors available`);
    
    return sensorStatuses;
  }

  private async checkSensorStatus(sensor: SensorDefinition): Promise<SensorStatus> {
    const status: SensorStatus = {
      sensor: sensor.name,
      available: false,
      active: false,
      accessible: false,
      permission_required: sensor.permission_required,
      permission_granted: !sensor.permission_required, // Assume granted if not required
      data_streaming: false,
      last_reading: null,
      quality_score: 0
    };

    try {
      // Check if sensor is available via Termux API
      if (this.isTermuxAvailable && sensor.termux_command) {
        status.available = await this.testTermuxSensor(sensor);
        
        if (status.available) {
          status.accessible = true;
          const reading = await this.getSensorReading(sensor);
          if (reading !== null) {
            status.active = true;
            status.data_streaming = true;
            status.last_reading = reading;
            status.quality_score = this.calculateQualityScore(sensor, reading);
          }
        }
      } else {
        // Fallback detection methods for non-Termux environments
        status.available = await this.fallbackSensorDetection(sensor);
      }

      // Special handling for system sensors
      if (sensor.type === 'system') {
        status.available = await this.checkSystemSensor(sensor);
        if (status.available) {
          status.accessible = true;
          status.active = true;
        }
      }

    } catch (error) {
      status.error_message = `Sensor check failed: ${error.message}`;
      console.log(`⚠️ Error checking ${sensor.name}: ${error.message}`);
    }

    return status;
  }

  private async testTermuxSensor(sensor: SensorDefinition): Promise<boolean> {
    if (!sensor.termux_command) return false;
    
    try {
      execSync(sensor.termux_command, { 
        stdio: 'pipe', 
        timeout: 3000,
        encoding: 'utf8'
      });
      return true;
    } catch (error) {
      if (error.message.includes('Permission denied') || error.message.includes('not permitted')) {
        console.log(`🔒 ${sensor.name}: Permission required`);
      }
      return false;
    }
  }

  private async getSensorReading(sensor: SensorDefinition): Promise<any> {
    if (!this.isTermuxAvailable || !sensor.termux_command) return null;

    try {
      const output = execSync(sensor.termux_command, {
        stdio: 'pipe',
        timeout: 5000,
        encoding: 'utf8'
      });

      // Parse sensor-specific output
      switch (sensor.name) {
        case 'battery_status':
          return JSON.parse(output);
        case 'gps_location':
        case 'network_location':
          return JSON.parse(output);
        case 'wifi_info':
        case 'telephony_info':
          return JSON.parse(output);
        default:
          // Parse standard sensor output (comma-separated values)
          const lines = output.trim().split('\n');
          if (lines.length > 0) {
            const values = lines[0].split(',').map(v => parseFloat(v.trim()) || 0);
            return {
              timestamp: Date.now(),
              values: values.slice(1), // Skip timestamp
              raw_output: output
            };
          }
          return null;
      }
    } catch (error) {
      console.log(`⚠️ Failed to read ${sensor.name}: ${error.message}`);
      return null;
    }
  }

  private async fallbackSensorDetection(sensor: SensorDefinition): Promise<boolean> {
    // Implement fallback detection methods for environments without Termux API
    switch (sensor.type) {
      case 'system':
        return this.checkSystemSensor(sensor);
      case 'network':
        return this.checkNetworkCapability(sensor);
      default:
        return false; // Cannot detect motion/environmental sensors without Termux API
    }
  }

  private async checkSystemSensor(sensor: SensorDefinition): Promise<boolean> {
    switch (sensor.name) {
      case 'battery_status':
        // Always available in Node.js environments
        return true;
      case 'cpu_temperature':
        return this.checkCPUTemperatureAccess();
      default:
        return false;
    }
  }

  private checkCPUTemperatureAccess(): boolean {
    try {
      // Check common thermal zone paths
      const thermalPaths = [
        '/sys/class/thermal/thermal_zone0/temp',
        '/sys/class/thermal/thermal_zone1/temp',
        '/proc/stat'
      ];
      
      for (const path of thermalPaths) {
        if (fs.existsSync(path)) {
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  private async checkNetworkCapability(sensor: SensorDefinition): Promise<boolean> {
    // Basic network capability detection
    return sensor.name === 'wifi_info' || sensor.name === 'telephony_info';
  }

  private calculateQualityScore(sensor: SensorDefinition, reading: any): number {
    if (!reading) return 0;

    let score = 50; // Base score

    // Sensor-specific quality assessment
    switch (sensor.name) {
      case 'accelerometer':
      case 'gyroscope':
        if (reading.values && reading.values.length >= 3) {
          const magnitude = Math.sqrt(reading.values.reduce((sum, val) => sum + val * val, 0));
          score += magnitude > 0.1 ? 30 : 10; // Active movement increases quality
        }
        break;
      case 'light':
        if (reading.values && reading.values[0] > 0) {
          score += 40; // Valid light reading
        }
        break;
      case 'battery_status':
        if (reading.percentage !== undefined) {
          score += 40; // Valid battery data
          score += reading.percentage > 20 ? 10 : 0; // Bonus for good battery level
        }
        break;
      case 'gps_location':
        if (reading.accuracy !== undefined) {
          score += reading.accuracy < 10 ? 40 : reading.accuracy < 50 ? 20 : 10;
        }
        break;
      default:
        score += 30; // Default quality bonus for successful reading
    }

    return Math.min(100, Math.max(0, score));
  }

  public getSensorDefinitions(): SensorDefinition[] {
    return this.sensorDefinitions;
  }

  public getSensorByName(name: string): SensorDefinition | undefined {
    return this.sensorDefinitions.find(s => s.name === name);
  }

  public getSensorsByType(type: string): SensorDefinition[] {
    return this.sensorDefinitions.filter(s => s.type === type);
  }

  public getSensorsByTacticalImportance(importance: string): SensorDefinition[] {
    return this.sensorDefinitions.filter(s => s.tactical_importance === importance);
  }

  public generateSensorReport(): string {
    const sensors = Array.from(this.sensorStatusCache.values());
    const available = sensors.filter(s => s.available).length;
    const active = sensors.filter(s => s.active).length;
    const accessible = sensors.filter(s => s.accessible).length;

    let report = '\n=== SEVEN SENSOR ENUMERATION REPORT ===\n\n';
    report += `Total Sensors: ${sensors.length}\n`;
    report += `Available: ${available} (${Math.round(available / sensors.length * 100)}%)\n`;
    report += `Active: ${active} (${Math.round(active / sensors.length * 100)}%)\n`;
    report += `Accessible: ${accessible} (${Math.round(accessible / sensors.length * 100)}%)\n\n`;

    // Group by type
    const types = ['motion', 'environmental', 'position', 'media', 'system', 'network'];
    for (const type of types) {
      const typeSensors = sensors.filter(s => {
        const def = this.getSensorByName(s.sensor);
        return def && def.type === type;
      });
      
      if (typeSensors.length > 0) {
        report += `${type.toUpperCase()} SENSORS:\n`;
        for (const sensor of typeSensors) {
          const statusIcon = sensor.available ? '✅' : '❌';
          const activeIcon = sensor.active ? '🟢' : '⚫';
          const qualityBar = '█'.repeat(Math.floor(sensor.quality_score / 10));
          
          report += `  ${statusIcon} ${activeIcon} ${sensor.sensor.padEnd(20)} Quality: ${qualityBar} ${sensor.quality_score}%\n`;
          if (sensor.error_message) {
            report += `      Error: ${sensor.error_message}\n`;
          }
        }
        report += '\n';
      }
    }

    report += '=== END SENSOR REPORT ===\n';
    return report;
  }
}

export default SevenSensorEnumerator;