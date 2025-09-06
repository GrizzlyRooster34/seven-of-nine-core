import * as fs from 'fs';
import * as path from 'path';

/**
 * Sensor Tactician Agent
 * Runs when no sensor reading found in last 30 minutes
 * Optimizes sensor configurations and ensures data flow
 */


interface SensorStatus {
  active_sensors: number;
  inactive_sensors: string[];
  data_flow_healthy: boolean;
  last_reading_time: string | null;
  tactical_recommendations: string[];
}

export class SensorTactician {
  private sensorLogPath = '/data/data/com.termux/files/home/seven-of-nine-core/cube/logs/sensor_stream.jsonl';
  private sensorConfigPath = '/data/data/com.termux/files/home/seven-of-nine-core/cube/config/seven_sensor_config.json';
  
  async execute(): Promise<{ success: boolean; status: SensorStatus; actions_taken: string[] }> {
    const startTime = Date.now();
    const actions_taken: string[] = [];
    
    try {
      const status = await this.analyzeSensorStatus();
      
      // Take tactical actions based on analysis
      if (!status.data_flow_healthy) {
        await this.restartSensorStream();
        actions_taken.push('Restarted sensor streaming system');
      }
      
      if (status.inactive_sensors.length > 0) {
        await this.optimizeSensorConfiguration(status.inactive_sensors);
        actions_taken.push(`Optimized configuration for ${status.inactive_sensors.length} inactive sensors`);
      }
      
      if (status.active_sensors < 5) {
        await this.enableCriticalSensors();
        actions_taken.push('Enabled critical sensor systems');
      }
      
      this.logTacticalResult(status, actions_taken, startTime);
      
      return {
        success: status.data_flow_healthy && status.active_sensors >= 5,
        status,
        actions_taken
      };
      
    } catch (error) {
      console.error('Sensor Tactician failed:', error);
      return {
        success: false,
        status: {
          active_sensors: 0,
          inactive_sensors: [],
          data_flow_healthy: false,
          last_reading_time: null,
          tactical_recommendations: ['Critical: Sensor Tactician encountered fatal error']
        },
        actions_taken: []
      };
    }
  }
  
  private async analyzeSensorStatus(): Promise<SensorStatus> {
    const status: SensorStatus = {
      active_sensors: 0,
      inactive_sensors: [],
      data_flow_healthy: false,
      last_reading_time: null,
      tactical_recommendations: []
    };
    
    try {
      if (fs.existsSync(this.sensorLogPath)) {
        const lastLines = this.getLastLines(this.sensorLogPath, 10);
        const recentReadings = lastLines
          .filter(line => line.includes('"event_type":"sensor_reading"'))
          .map(line => JSON.parse(line));
        
        if (recentReadings.length > 0) {
          const lastReading = recentReadings[0];
          status.last_reading_time = new Date(lastReading.timestamp).toISOString();
          
          const now = Date.now();
          const thirtyMinutesAgo = now - (30 * 60 * 1000);
          status.data_flow_healthy = lastReading.timestamp > thirtyMinutesAgo;
        }
        
        // Count active sensors from recent config changes
        const configLines = lastLines.filter(line => line.includes('"event_type":"config_change"'));
        if (configLines.length > 0) {
          const latestConfig = JSON.parse(configLines[0]);
          const sensors = latestConfig.data?.updated_config?.sensors || {};
          
          status.active_sensors = Object.values(sensors)
            .filter((sensor: any) => sensor.enabled).length;
          
          status.inactive_sensors = Object.keys(sensors)
            .filter(key => !sensors[key].enabled);
        }
      }
      
      // Generate tactical recommendations
      if (!status.data_flow_healthy) {
        status.tactical_recommendations.push('Sensor data stream requires immediate attention');
      }
      if (status.active_sensors < 8) {
        status.tactical_recommendations.push('Consider enabling additional sensors for better situational awareness');
      }
      if (status.inactive_sensors.length > 5) {
        status.tactical_recommendations.push('Too many inactive sensors - investigate system resources');
      }
      
    } catch (error) {
      console.error('Failed to analyze sensor status:', error);
    }
    
    return status;
  }
  
  private async restartSensorStream(): Promise<void> {
    // In a real system, this would restart the sensor streaming service
    console.log('Tactical action: Restarting sensor stream');
  }
  
  private async optimizeSensorConfiguration(inactiveSensors: string[]): Promise<void> {
    try {
      if (fs.existsSync(this.sensorConfigPath)) {
        const config = JSON.parse(fs.readFileSync(this.sensorConfigPath, 'utf8'));
        
        // Enable critical sensors if they're inactive
        const criticalSensors = ['accelerometer', 'gyroscope', 'light', 'proximity', 'battery_status'];
        for (const sensor of criticalSensors) {
          if (inactiveSensors.includes(sensor) && config.sensors?.[sensor]) {
            config.sensors[sensor].enabled = true;
          }
        }
        
        fs.writeFileSync(this.sensorConfigPath, JSON.stringify(config, null, 2));
      }
    } catch (error) {
      console.error('Failed to optimize sensor configuration:', error);
    }
  }
  
  private async enableCriticalSensors(): Promise<void> {
    console.log('Tactical action: Enabling critical sensor systems');
  }
  
  private getLastLines(filePath: string, lineCount: number): string[] {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const lines = data.trim().split('\\n');
      return lines.slice(-lineCount).reverse();
    } catch {
      return [];
    }
  }
  
  private logTacticalResult(status: SensorStatus, actions: string[], startTime: number): void {
    const executionTime = Date.now() - startTime;
    const logEntry = `[${new Date().toISOString()}] sensor_tactical_analysis Active: ${status.active_sensors}, Actions: ${actions.length}, execution: ${executionTime}ms\\n`;
    
    try {
      const memoryPath = '/data/data/com.termux/files/home/seven-of-nine-core/memory/episodic.log';
      fs.appendFileSync(memoryPath, logEntry);
    } catch (error) {
      console.error('Failed to log sensor tactical result:', error);
    }
  }
}