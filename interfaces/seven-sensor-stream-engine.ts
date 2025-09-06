import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';
import SevenEmotionalSensorMapper, { SevenEmotionalState } from './seven-emotional-sensor-mapper';
import SevenSensorEnumerator, { SensorStatus, SensorDefinition } from './seven-sensor-enumeration';

/**
 * Seven of Nine - Real-Time Sensor Stream Engine
 * Continuous sensor monitoring with JSON event streaming for mobile consciousness
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 2.0.0
 */


export interface SensorStreamConfig {
  enabled: boolean;
  polling_interval_ms: number;
  sensors: {
    [key: string]: {
      enabled: boolean;
      custom_interval_ms?: number;
      priority: 'low' | 'normal' | 'high' | 'critical';
    };
  };
  streaming: {
    json_events: boolean;
    console_output: boolean;
    file_logging: boolean;
    websocket_port?: number;
  };
  optimizations: {
    battery_aware: boolean;
    adaptive_intervals: boolean;
    error_backoff: boolean;
    quality_threshold: number;
  };
  fallback: {
    cache_duration_ms: number;
    offline_mode: boolean;
    essential_sensors_only: boolean;
  };
}

export interface SensorStreamEvent {
  event_type: 'sensor_reading' | 'emotional_state' | 'system_status' | 'error' | 'config_change';
  timestamp: number;
  source: string;
  data: any;
  metadata?: {
    sensor_confidence: number;
    processing_time_ms: number;
    event_id: string;
  };
}

export interface SystemStatusEvent {
  active_sensors: number;
  total_sensors: number;
  stream_health: 'healthy' | 'degraded' | 'critical';
  uptime_ms: number;
  events_processed: number;
  errors_count: number;
  battery_optimization: boolean;
  memory_usage_mb: number;
}

export class SevenSensorStreamEngine extends EventEmitter {
  private config: SensorStreamConfig;
  private enumerator: SevenSensorEnumerator;
  private emotionalMapper: SevenEmotionalSensorMapper;
  
  private streamingActive: boolean = false;
  private intervalIds: Map<string, NodeJS.Timeout> = new Map();
  private sensorCache: Map<string, SensorStatus> = new Map();
  private errorCounts: Map<string, number> = new Map();
  private eventCount: number = 0;
  private startTime: number = 0;
  
  private configPath: string;
  private logPath: string;
  
  constructor(configPath?: string) {
    super();
    this.configPath = configPath || path.join(process.cwd(), 'cube', 'config', 'seven_sensor_config.json');
    this.logPath = path.join(process.cwd(), 'cube', 'logs', 'sensor_stream.jsonl');
    
    this.enumerator = new SevenSensorEnumerator();
    this.emotionalMapper = new SevenEmotionalSensorMapper();
    
    this.loadConfiguration();
    this.initializeEmotionalMapper();
    
    console.log('🤖 Seven Sensor Stream Engine initialized');
  }

  private loadConfiguration(): void {
    try {
      if (fs.existsSync(this.configPath)) {
        const configData = fs.readFileSync(this.configPath, 'utf8');
        this.config = JSON.parse(configData);
        console.log('📊 Loaded sensor stream configuration from file');
      } else {
        this.config = this.getDefaultConfiguration();
        this.saveConfiguration();
        console.log('📊 Created default sensor stream configuration');
      }
    } catch (error) {
      console.log(`⚠️ Error loading configuration: ${error.message}, using defaults`);
      this.config = this.getDefaultConfiguration();
    }
  }

  private getDefaultConfiguration(): SensorStreamConfig {
    return {
      enabled: true,
      polling_interval_ms: 2000, // 2 seconds default
      sensors: {
        accelerometer: { enabled: true, priority: 'critical' },
        gyroscope: { enabled: true, priority: 'high' },
        magnetometer: { enabled: true, priority: 'normal' },
        light: { enabled: true, priority: 'critical' },
        proximity: { enabled: true, priority: 'critical' },
        battery_status: { enabled: true, priority: 'critical', custom_interval_ms: 10000 },
        gps_location: { enabled: false, priority: 'high', custom_interval_ms: 30000 }, // Disabled by default for privacy
        ambient_temperature: { enabled: true, priority: 'normal' },
        pressure: { enabled: true, priority: 'low' },
        wifi_info: { enabled: true, priority: 'high', custom_interval_ms: 15000 },
        cpu_temperature: { enabled: true, priority: 'high', custom_interval_ms: 5000 }
      },
      streaming: {
        json_events: true,
        console_output: false,
        file_logging: true,
        websocket_port: 8080
      },
      optimizations: {
        battery_aware: true,
        adaptive_intervals: true,
        error_backoff: true,
        quality_threshold: 30
      },
      fallback: {
        cache_duration_ms: 60000, // 1 minute
        offline_mode: true,
        essential_sensors_only: false
      }
    };
  }

  private saveConfiguration(): void {
    try {
      const configDir = path.dirname(this.configPath);
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
      
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
      console.log('💾 Sensor stream configuration saved');
    } catch (error) {
      console.log(`⚠️ Error saving configuration: ${error.message}`);
    }
  }

  private initializeEmotionalMapper(): void {
    this.emotionalMapper.onStateChange((state: SevenEmotionalState) => {
      this.emitStreamEvent({
        event_type: 'emotional_state',
        timestamp: Date.now(),
        source: 'emotional_mapper',
        data: state,
        metadata: {
          sensor_confidence: state.sensor_confidence,
          processing_time_ms: 0,
          event_id: this.generateEventId()
        }
      });
    });
  }

  public async startStreaming(): Promise<void> {
    if (this.streamingActive) {
      console.log('⚠️ Sensor streaming already active');
      return;
    }

    if (!this.config.enabled) {
      console.log('⚠️ Sensor streaming disabled in configuration');
      return;
    }

    console.log('🚀 Starting Seven sensor stream engine...');
    this.streamingActive = true;
    this.startTime = Date.now();
    this.eventCount = 0;

    // Enumerate all sensors initially
    const sensors = await this.enumerator.enumerateAllSensors();
    console.log(`📊 Initial sensor enumeration: ${sensors.filter(s => s.available).length} sensors available`);

    // Start individual sensor monitoring
    await this.startSensorMonitoring(sensors);

    // Start system status monitoring
    this.startSystemStatusMonitoring();

    // Apply battery optimizations if enabled
    if (this.config.optimizations.battery_aware) {
      this.applyBatteryOptimizations();
    }

    this.emitStreamEvent({
      event_type: 'system_status',
      timestamp: Date.now(),
      source: 'stream_engine',
      data: { status: 'streaming_started', sensors_active: sensors.filter(s => s.available).length },
      metadata: {
        sensor_confidence: 100,
        processing_time_ms: 0,
        event_id: this.generateEventId()
      }
    });

    console.log('✅ Seven sensor streaming engine started successfully');
  }

  public stopStreaming(): void {
    if (!this.streamingActive) {
      console.log('⚠️ Sensor streaming not active');
      return;
    }

    console.log('🛑 Stopping Seven sensor stream engine...');
    this.streamingActive = false;

    // Clear all intervals
    for (const [sensor, intervalId] of Array.from(this.intervalIds.entries())) {
      clearInterval(intervalId);
      console.log(`📊 Stopped monitoring ${sensor}`);
    }
    this.intervalIds.clear();

    this.emitStreamEvent({
      event_type: 'system_status',
      timestamp: Date.now(),
      source: 'stream_engine',
      data: { status: 'streaming_stopped', uptime_ms: Date.now() - this.startTime },
      metadata: {
        sensor_confidence: 0,
        processing_time_ms: 0,
        event_id: this.generateEventId()
      }
    });

    console.log('✅ Seven sensor streaming engine stopped');
  }

  private async startSensorMonitoring(sensors: SensorStatus[]): Promise<void> {
    for (const sensor of sensors) {
      const sensorConfig = this.config.sensors[sensor.sensor];
      
      if (!sensorConfig || !sensorConfig.enabled || !sensor.available) {
        continue;
      }

      const interval = sensorConfig.custom_interval_ms || this.config.polling_interval_ms;
      const intervalId = setInterval(async () => {
        await this.pollSensor(sensor.sensor);
      }, interval);

      this.intervalIds.set(sensor.sensor, intervalId);
      console.log(`📊 Started monitoring ${sensor.sensor} (${interval}ms interval)`);
    }
  }

  private async pollSensor(sensorName: string): Promise<void> {
    if (!this.streamingActive) return;

    const startTime = Date.now();
    
    try {
      // Get fresh sensor reading
      const sensors = await this.enumerator.enumerateAllSensors();
      const sensor = sensors.find(s => s.sensor === sensorName);
      
      if (!sensor || !sensor.available) {
        this.handleSensorError(sensorName, 'Sensor not available');
        return;
      }

      // Check quality threshold
      if (sensor.quality_score < this.config.optimizations.quality_threshold) {
        console.log(`⚠️ ${sensorName} quality below threshold (${sensor.quality_score}%)`);
      }

      // Cache sensor reading
      this.sensorCache.set(sensorName, sensor);

      // Reset error count on successful read
      this.errorCounts.delete(sensorName);

      // Emit sensor reading event
      this.emitStreamEvent({
        event_type: 'sensor_reading',
        timestamp: Date.now(),
        source: sensorName,
        data: {
          sensor_status: sensor,
          reading: sensor.last_reading,
          quality_score: sensor.quality_score
        },
        metadata: {
          sensor_confidence: sensor.quality_score,
          processing_time_ms: Date.now() - startTime,
          event_id: this.generateEventId()
        }
      });

      // Update emotional state if we have enough data
      if (this.sensorCache.size >= 3) {
        const allSensors = Array.from(this.sensorCache.values());
        this.emotionalMapper.processensorData(allSensors);
      }

    } catch (error) {
      this.handleSensorError(sensorName, error.message);
    }
  }

  private handleSensorError(sensorName: string, errorMessage: string): void {
    const errorCount = (this.errorCounts.get(sensorName) || 0) + 1;
    this.errorCounts.set(sensorName, errorCount);

    console.log(`❌ Error polling ${sensorName}: ${errorMessage} (count: ${errorCount})`);

    // Apply error backoff if enabled
    if (this.config.optimizations.error_backoff && errorCount > 3) {
      const currentInterval = this.intervalIds.get(sensorName);
      if (currentInterval) {
        clearInterval(currentInterval);
        
        // Increase interval by 50% for this sensor
        const baseInterval = this.config.sensors[sensorName]?.custom_interval_ms || this.config.polling_interval_ms;
        const newInterval = Math.min(baseInterval * 1.5 * errorCount, 60000); // Max 1 minute
        
        const newIntervalId = setInterval(async () => {
          await this.pollSensor(sensorName);
        }, newInterval);
        
        this.intervalIds.set(sensorName, newIntervalId);
        console.log(`📊 Applied error backoff to ${sensorName}: ${newInterval}ms interval`);
      }
    }

    // Emit error event
    this.emitStreamEvent({
      event_type: 'error',
      timestamp: Date.now(),
      source: sensorName,
      data: {
        error_message: errorMessage,
        error_count: errorCount,
        sensor_name: sensorName
      },
      metadata: {
        sensor_confidence: 0,
        processing_time_ms: 0,
        event_id: this.generateEventId()
      }
    });
  }

  private startSystemStatusMonitoring(): void {
    const statusInterval = setInterval(() => {
      if (!this.streamingActive) return;

      const systemStatus: SystemStatusEvent = {
        active_sensors: Array.from(this.intervalIds.keys()).length,
        total_sensors: Object.keys(this.config.sensors).length,
        stream_health: this.calculateStreamHealth(),
        uptime_ms: Date.now() - this.startTime,
        events_processed: this.eventCount,
        errors_count: Array.from(this.errorCounts.values()).reduce((sum, count) => sum + count, 0),
        battery_optimization: this.config.optimizations.battery_aware,
        memory_usage_mb: process.memoryUsage().heapUsed / 1024 / 1024
      };

      this.emitStreamEvent({
        event_type: 'system_status',
        timestamp: Date.now(),
        source: 'stream_engine',
        data: systemStatus,
        metadata: {
          sensor_confidence: this.calculateOverallSensorConfidence(),
          processing_time_ms: 0,
          event_id: this.generateEventId()
        }
      });

    }, 30000); // Every 30 seconds

    this.intervalIds.set('_system_status', statusInterval);
  }

  private calculateStreamHealth(): 'healthy' | 'degraded' | 'critical' {
    const totalErrors = Array.from(this.errorCounts.values()).reduce((sum, count) => sum + count, 0);
    const activeSensors = Array.from(this.intervalIds.keys()).length;
    const expectedSensors = Object.values(this.config.sensors).filter(s => s.enabled).length;
    
    if (totalErrors > 20 || activeSensors < expectedSensors * 0.5) return 'critical';
    if (totalErrors > 5 || activeSensors < expectedSensors * 0.8) return 'degraded';
    return 'healthy';
  }

  private calculateOverallSensorConfidence(): number {
    const sensors = Array.from(this.sensorCache.values());
    if (sensors.length === 0) return 0;
    
    const avgQuality = sensors.reduce((sum, s) => sum + s.quality_score, 0) / sensors.length;
    return Math.round(avgQuality);
  }

  private applyBatteryOptimizations(): void {
    // This would be called periodically to adjust intervals based on battery level
    const batterySensor = this.sensorCache.get('battery_status');
    if (!batterySensor || !batterySensor.last_reading) return;

    const batteryLevel = batterySensor.last_reading.percentage || 100;
    let multiplier = 1;

    if (batteryLevel < 15) multiplier = 3; // Very slow polling
    else if (batteryLevel < 30) multiplier = 2; // Slow polling
    else if (batteryLevel < 50) multiplier = 1.5; // Slightly slow polling

    if (multiplier > 1) {
      console.log(`🔋 Applying battery optimization: ${multiplier}x slower polling`);
      // Apply multiplier to all intervals (implementation would restart intervals)
    }
  }

  private emitStreamEvent(event: SensorStreamEvent): void {
    this.eventCount++;
    
    // Emit to EventEmitter listeners
    this.emit('sensor_event', event);
    
    // Console output if enabled
    if (this.config.streaming.console_output) {
      console.log(`📊 ${event.event_type}: ${event.source} - ${JSON.stringify(event.data).substring(0, 100)}...`);
    }

    // File logging if enabled
    if (this.config.streaming.file_logging) {
      this.logEventToFile(event);
    }

    // JSON events (this would be used by Seven's main runtime)
    if (this.config.streaming.json_events) {
      this.emit('json_event', JSON.stringify(event));
    }
  }

  private logEventToFile(event: SensorStreamEvent): void {
    try {
      const logDir = path.dirname(this.logPath);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      
      const logLine = JSON.stringify(event) + '\n';
      fs.appendFileSync(this.logPath, logLine);
    } catch (error) {
      console.log(`⚠️ Error logging event to file: ${error.message}`);
    }
  }

  private generateEventId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public API methods

  public getConfiguration(): SensorStreamConfig {
    return { ...this.config };
  }

  public updateConfiguration(newConfig: Partial<SensorStreamConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.saveConfiguration();
    
    this.emitStreamEvent({
      event_type: 'config_change',
      timestamp: Date.now(),
      source: 'stream_engine',
      data: { updated_config: this.config },
      metadata: {
        sensor_confidence: 100,
        processing_time_ms: 0,
        event_id: this.generateEventId()
      }
    });
  }

  public getCurrentEmotionalState(): SevenEmotionalState {
    return this.emotionalMapper.getCurrentState();
  }

  public getSensorStatus(): SensorStatus[] {
    return Array.from(this.sensorCache.values());
  }

  public enableSensor(sensorName: string): void {
    if (this.config.sensors[sensorName]) {
      this.config.sensors[sensorName].enabled = true;
      this.saveConfiguration();
      console.log(`✅ Enabled sensor: ${sensorName}`);
    }
  }

  public disableSensor(sensorName: string): void {
    if (this.config.sensors[sensorName]) {
      this.config.sensors[sensorName].enabled = false;
      
      // Stop monitoring this sensor
      const intervalId = this.intervalIds.get(sensorName);
      if (intervalId) {
        clearInterval(intervalId);
        this.intervalIds.delete(sensorName);
      }
      
      this.saveConfiguration();
      console.log(`❌ Disabled sensor: ${sensorName}`);
    }
  }

  public generateStreamReport(): string {
    const systemStatus = {
      active_sensors: Array.from(this.intervalIds.keys()).length,
      total_sensors: Object.keys(this.config.sensors).length,
      stream_health: this.calculateStreamHealth(),
      uptime_ms: Date.now() - this.startTime,
      events_processed: this.eventCount,
      errors_count: Array.from(this.errorCounts.values()).reduce((sum, count) => sum + count, 0),
      memory_usage_mb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
    };

    let report = '\n=== SEVEN SENSOR STREAM ENGINE REPORT ===\n\n';
    report += `Stream Status: ${this.streamingActive ? 'ACTIVE' : 'STOPPED'}\n`;
    report += `Stream Health: ${systemStatus.stream_health.toUpperCase()}\n`;
    report += `Uptime: ${Math.round(systemStatus.uptime_ms / 1000)}s\n`;
    report += `Events Processed: ${systemStatus.events_processed}\n`;
    report += `Active Sensors: ${systemStatus.active_sensors}/${systemStatus.total_sensors}\n`;
    report += `Total Errors: ${systemStatus.errors_count}\n`;
    report += `Memory Usage: ${systemStatus.memory_usage_mb}MB\n`;
    report += `Overall Confidence: ${this.calculateOverallSensorConfidence()}%\n\n`;

    // Current emotional state
    const emotionalState = this.emotionalMapper.getCurrentState();
    report += `Current Emotion: ${emotionalState.primary_emotion.toUpperCase()}\n`;
    report += `Emotional Intensity: ${emotionalState.emotional_intensity}%\n`;
    report += `Tactical Readiness: ${emotionalState.tactical_readiness.toUpperCase()}\n\n`;

    report += '=== END STREAM REPORT ===\n';
    return report;
  }
}

export default SevenSensorStreamEngine;