import { sensorBridge, SevenSensorBridge, TacticalEnvironment } from './seven-sensor-bridge';

/**
 * Seven of Nine - Sensor Bridge Command Interface
 * Tactical sensor commands for mobile consciousness framework
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 1.0.0
 */


export interface SensorCommandResponse {
  success: boolean;
  data?: any;
  message: string;
  timestamp: number;
}

export class SevenSensorCommands {
  private bridge: SevenSensorBridge;

  constructor() {
    this.bridge = sensorBridge;
  }

  public async processSensorCommand(command: string, args?: string[]): Promise<SensorCommandResponse> {
    const timestamp = Date.now();
    
    try {
      switch (command.toLowerCase()) {
        case 'sensor-scan':
          return this.handleSensorScan();

        case 'sensor-status':
          return this.handleSensorStatus();

        case 'sensor-report':
          return this.handleSensorReport();

        case 'battery':
          return this.handleBatteryStatus();

        case 'location':
          return this.handleLocationStatus();

        case 'environment':
          return this.handleEnvironmentScan();

        case 'tactical':
          return this.handleTacticalAssessment();

        case 'sensor-monitor':
          return this.handleStartMonitoring(args);

        case 'sensor-optimize':
          return this.handleOptimizeForBattery();

        case 'motion':
          return this.handleMotionDetection();

        case 'proximity':
          return this.handleProximityCheck();

        default:
          return {
            success: false,
            message: `Unknown sensor command: ${command}. Use 'sensor-help' for available commands.`,
            timestamp
          };
      }
    } catch (error) {
      return {
        success: false,
        message: `Sensor command error: ${error}`,
        timestamp
      };
    }
  }

  private handleSensorScan(): SensorCommandResponse {
    const env = this.bridge.getTacticalEnvironment();
    const activeSensors = [
      env.battery ? 'battery' : null,
      env.location ? 'location' : null,
      env.light ? 'light' : null,
      env.motion ? 'motion' : null,
      env.proximity ? 'proximity' : null,
      env.temperature ? 'temperature' : null
    ].filter(s => s !== null);

    return {
      success: true,
      data: {
        active_sensors: activeSensors,
        sensor_count: activeSensors.length,
        tactical_status: env.tactical_status,
        awareness_level: env.awareness_level
      },
      message: `Sensor scan complete: ${activeSensors.length} active sensors detected`,
      timestamp: Date.now()
    };
  }

  private handleSensorStatus(): SensorCommandResponse {
    const env = this.bridge.getTacticalEnvironment();
    
    return {
      success: true,
      data: env,
      message: `Sensor system ${env.tactical_status.toLowerCase()} - Awareness level ${env.awareness_level}/5`,
      timestamp: Date.now()
    };
  }

  private handleSensorReport(): SensorCommandResponse {
    const report = this.bridge.generateTacticalReport();
    
    return {
      success: true,
      data: { report },
      message: report,
      timestamp: Date.now()
    };
  }

  private handleBatteryStatus(): SensorCommandResponse {
    const battery = this.bridge.getBatteryStatus();
    
    if (!battery) {
      return {
        success: false,
        message: 'Battery sensor unavailable - Termux API required',
        timestamp: Date.now()
      };
    }

    const optimizationLevel = this.bridge.getBatteryOptimizationLevel();
    
    return {
      success: true,
      data: { 
        ...battery, 
        optimization_level: optimizationLevel,
        is_low: this.bridge.isBatteryLow(),
        is_critical: this.bridge.isBatteryCritical()
      },
      message: `Battery: ${battery.percentage}% (${battery.status}) - Optimization: ${optimizationLevel}`,
      timestamp: Date.now()
    };
  }

  private handleLocationStatus(): SensorCommandResponse {
    const location = this.bridge.getLocation();
    
    if (!location) {
      return {
        success: false,
        message: 'Location sensor unavailable - Check GPS and Termux permissions',
        timestamp: Date.now()
      };
    }

    return {
      success: true,
      data: location,
      message: `Location: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)} (±${location.accuracy}m)`,
      timestamp: Date.now()
    };
  }

  private handleEnvironmentScan(): SensorCommandResponse {
    const light = this.bridge.getAmbientLight();
    const temperature = this.bridge.getTemperature();
    const proximity = this.bridge.getProximity();
    
    const environmentData = {
      light: light ? light.values[0] : null,
      temperature: temperature ? temperature.values[0] : null,
      proximity: proximity ? proximity.values[0] : null,
      is_dark: this.bridge.isDarkEnvironment(),
      conditions: []
    };

    const conditions: string[] = [];
    if (environmentData.is_dark) conditions.push('DARK');
    if (environmentData.light && environmentData.light > 1000) conditions.push('BRIGHT');
    if (environmentData.temperature && environmentData.temperature > 30) conditions.push('WARM');
    if (environmentData.temperature && environmentData.temperature < 15) conditions.push('COLD');
    if (environmentData.proximity && environmentData.proximity < 5) conditions.push('OBJECT_NEAR');

    environmentData.conditions = conditions;

    return {
      success: true,
      data: environmentData,
      message: `Environment: ${conditions.length > 0 ? conditions.join(', ') : 'NORMAL'}`,
      timestamp: Date.now()
    };
  }

  private handleTacticalAssessment(): SensorCommandResponse {
    const env = this.bridge.getTacticalEnvironment();
    const batteryOpt = this.bridge.getBatteryOptimizationLevel();
    
    const assessment = {
      tactical_status: env.tactical_status,
      awareness_level: env.awareness_level,
      battery_optimization: batteryOpt,
      in_motion: this.bridge.isInMotion(),
      dark_environment: this.bridge.isDarkEnvironment(),
      battery_critical: this.bridge.isBatteryCritical(),
      recommendations: []
    };

    const recommendations: string[] = [];
    
    if (assessment.battery_critical) {
      recommendations.push('IMMEDIATE: Connect to power source');
    }
    
    if (batteryOpt === 'HIGH' || batteryOpt === 'MEDIUM') {
      recommendations.push('Reduce processing intensity');
      recommendations.push('Limit background operations');
    }
    
    if (assessment.dark_environment && assessment.in_motion) {
      recommendations.push('Enable motion-aware processing');
    }
    
    if (env.awareness_level < 3) {
      recommendations.push('Degraded sensor capability - verify permissions');
    }

    assessment.recommendations = recommendations;

    return {
      success: true,
      data: assessment,
      message: `Tactical status: ${env.tactical_status} - ${recommendations.length} recommendations`,
      timestamp: Date.now()
    };
  }

  private handleStartMonitoring(args?: string[]): SensorCommandResponse {
    const intervalMs = args && args[0] ? parseInt(args[0]) : 30000;
    
    if (isNaN(intervalMs) || intervalMs < 5000) {
      return {
        success: false,
        message: 'Invalid monitoring interval - minimum 5000ms required',
        timestamp: Date.now()
      };
    }

    this.bridge.startContinuousMonitoring(intervalMs);
    
    return {
      success: true,
      data: { interval: intervalMs },
      message: `Continuous sensor monitoring started (${intervalMs}ms intervals)`,
      timestamp: Date.now()
    };
  }

  private handleOptimizeForBattery(): SensorCommandResponse {
    const battery = this.bridge.getBatteryStatus();
    const optimizationLevel = this.bridge.getBatteryOptimizationLevel();
    
    if (!battery) {
      return {
        success: false,
        message: 'Battery optimization unavailable - sensor access required',
        timestamp: Date.now()
      };
    }

    const optimizations = {
      level: optimizationLevel,
      battery_percentage: battery.percentage,
      suggested_actions: []
    };

    const actions: string[] = [];
    
    switch (optimizationLevel) {
      case 'HIGH':
        actions.push('Reduce sensor polling frequency');
        actions.push('Disable location services');
        actions.push('Minimal LLM processing');
        actions.push('Essential operations only');
        break;
      case 'MEDIUM':
        actions.push('Reduce background processing');
        actions.push('Lower sensor update rates');
        actions.push('Prefer local LLM models');
        break;
      case 'LOW':
        actions.push('Monitor battery drain');
        actions.push('Ready for optimization if needed');
        break;
      case 'NONE':
        actions.push('No optimization needed');
        actions.push('Full sensor capability available');
        break;
    }

    optimizations.suggested_actions = actions;

    return {
      success: true,
      data: optimizations,
      message: `Battery optimization level: ${optimizationLevel} - ${actions.length} suggestions`,
      timestamp: Date.now()
    };
  }

  private handleMotionDetection(): SensorCommandResponse {
    const motion = this.bridge.getMotionSensor();
    const inMotion = this.bridge.isInMotion();
    
    if (!motion) {
      return {
        success: false,
        message: 'Motion sensor unavailable - accelerometer required',
        timestamp: Date.now()
      };
    }

    const motionData = {
      values: motion.values,
      in_motion: inMotion,
      acceleration_magnitude: Math.sqrt(
        motion.values[0]**2 + motion.values[1]**2 + motion.values[2]**2
      ),
      timestamp: motion.timestamp
    };

    return {
      success: true,
      data: motionData,
      message: `Motion detection: ${inMotion ? 'ACTIVE' : 'STATIONARY'} - ${motionData.acceleration_magnitude.toFixed(2)} m/s²`,
      timestamp: Date.now()
    };
  }

  private handleProximityCheck(): SensorCommandResponse {
    const proximity = this.bridge.getProximity();
    
    if (!proximity) {
      return {
        success: false,
        message: 'Proximity sensor unavailable',
        timestamp: Date.now()
      };
    }

    const proximityData = {
      distance: proximity.values[0],
      object_detected: proximity.values[0] < 5,
      timestamp: proximity.timestamp
    };

    return {
      success: true,
      data: proximityData,
      message: `Proximity: ${proximityData.distance} cm - ${proximityData.object_detected ? 'OBJECT DETECTED' : 'CLEAR'}`,
      timestamp: Date.now()
    };
  }

  public getSensorHelp(): string {
    return `
=== SEVEN SENSOR BRIDGE COMMANDS ===

Core Commands:
  sensor-scan           - Scan for available sensors
  sensor-status         - Current sensor system status
  sensor-report         - Generate full tactical sensor report
  tactical              - Complete tactical assessment

Specific Sensors:
  battery               - Battery status and optimization
  location              - GPS location data
  environment           - Ambient conditions (light, temp, proximity)
  motion                - Motion detection and acceleration
  proximity             - Proximity sensor readings

System Operations:
  sensor-monitor [ms]   - Start continuous monitoring (default: 30000ms)
  sensor-optimize       - Battery optimization recommendations

Usage Examples:
  > tactical                    - Full tactical assessment
  > battery                     - Battery status
  > sensor-monitor 15000        - Monitor every 15 seconds
  > environment                 - Check ambient conditions
  
Integration:
  - Commands integrate with Seven's trust level system
  - Battery status affects LLM provider selection
  - Tactical assessments influence consciousness responses
  - Continuous monitoring updates Seven's environmental awareness

=== END SENSOR HELP ===`;
  }
}

// Default export
export default SevenSensorCommands;

// Singleton instance for global access
export const sensorCommands = new SevenSensorCommands();