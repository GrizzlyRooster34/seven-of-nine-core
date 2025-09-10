#!/usr/bin/env tsx

import { exec } from 'child_process';
import { join } from 'path';
import { promisify } from 'util';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import chalk from 'chalk';

/**
 * SEVEN OF NINE - ENHANCED SENSOR INTEGRATION SYSTEM
 * Environmental awareness expansion through device sensors
 * Mobile-optimized for Termux/Android environment
 */

const execAsync = promisify(exec);

interface SensorReading {
  sensor_type: string;
  timestamp: string;
  value: any;
  unit?: string;
  accuracy?: number;
  source: string;
}

interface EnvironmentalContext {
  location?: {
    latitude?: number;
    longitude?: number;
    accuracy?: number;
    provider: string;
  };
  device_orientation?: {
    x: number;
    y: number;
    z: number;
  };
  ambient_conditions?: {
    light_level?: number;
    noise_level?: number;
    temperature?: number;
  };
  connectivity?: {
    network_type: string;
    signal_strength?: number;
    wifi_connected: boolean;
  };
  battery_status?: {
    level: number;
    charging: boolean;
    temperature?: number;
  };
  system_resources?: {
    memory_usage: number;
    cpu_usage: number;
    storage_available: number;
  };
}

interface SensorCapabilities {
  gps: boolean;
  accelerometer: boolean;
  camera: boolean;
  microphone: boolean;
  battery_monitor: boolean;
  network_monitor: boolean;
  system_monitor: boolean;
  light_sensor: boolean;
}

export class SevenSensorIntegration {
  private basePath: string;
  private capabilities: SensorCapabilities;
  private currentContext: EnvironmentalContext;
  private sensorReadings: SensorReading[];
  private isMonitoring: boolean = false;

  constructor() {
    this.basePath = process.cwd();
    this.ensureDirectories();
    this.initializeSensorCapabilities();
    this.currentContext = {};
    this.sensorReadings = [];
  }

  private ensureDirectories(): void {
    const dirs = [
      'seven-sensors',
      'seven-sensors/readings',
      'seven-sensors/context',
      'seven-sensors/logs'
    ];
    
    dirs.forEach(dir => {
      const fullPath = join(this.basePath, dir);
      if (!existsSync(fullPath)) {
        mkdirSync(fullPath, { recursive: true });
      }
    });
  }

  private async initializeSensorCapabilities(): Promise<void> {
    console.log(chalk.cyan('🔍 SEVEN SENSOR CAPABILITY ASSESSMENT'));
    console.log(chalk.yellow('Detecting available environmental sensors...'));
    console.log('');

    this.capabilities = {
      gps: await this.checkGPSCapability(),
      accelerometer: await this.checkAccelerometerCapability(),
      camera: await this.checkCameraCapability(),
      microphone: await this.checkMicrophoneCapability(),
      battery_monitor: await this.checkBatteryCapability(),
      network_monitor: await this.checkNetworkCapability(),
      system_monitor: await this.checkSystemCapability(),
      light_sensor: await this.checkLightSensorCapability()
    };

    this.saveSensorCapabilities();
    this.displayCapabilities();
  }

  private async checkGPSCapability(): Promise<boolean> {
    try {
      // Check for termux-location command
      await execAsync('which termux-location');
      console.log(chalk.green('✅ GPS: Available via termux-location'));
      return true;
    } catch {
      console.log(chalk.gray('❌ GPS: Not available (termux-location not found)'));
      return false;
    }
  }

  private async checkAccelerometerCapability(): Promise<boolean> {
    try {
      // Check for termux-sensor command
      await execAsync('which termux-sensor');
      console.log(chalk.green('✅ Accelerometer: Available via termux-sensor'));
      return true;
    } catch {
      console.log(chalk.gray('❌ Accelerometer: Not available (termux-sensor not found)'));
      return false;
    }
  }

  private async checkCameraCapability(): Promise<boolean> {
    try {
      // Check for termux-camera-photo command
      await execAsync('which termux-camera-photo');
      console.log(chalk.green('✅ Camera: Available via termux-camera-photo'));
      return true;
    } catch {
      console.log(chalk.gray('❌ Camera: Not available (termux-camera-photo not found)'));
      return false;
    }
  }

  private async checkMicrophoneCapability(): Promise<boolean> {
    try {
      // Check for termux-microphone-record command
      await execAsync('which termux-microphone-record');
      console.log(chalk.green('✅ Microphone: Available via termux-microphone-record'));
      return true;
    } catch {
      console.log(chalk.gray('❌ Microphone: Not available (termux-microphone-record not found)'));
      return false;
    }
  }

  private async checkBatteryCapability(): Promise<boolean> {
    try {
      // Check for termux-battery-status command
      await execAsync('which termux-battery-status');
      console.log(chalk.green('✅ Battery Monitor: Available via termux-battery-status'));
      return true;
    } catch {
      console.log(chalk.gray('❌ Battery Monitor: Not available (termux-battery-status not found)'));
      return false;
    }
  }

  private async checkNetworkCapability(): Promise<boolean> {
    try {
      // Check for termux-wifi-connectioninfo command
      await execAsync('which termux-wifi-connectioninfo');
      console.log(chalk.green('✅ Network Monitor: Available via termux-wifi-connectioninfo'));
      return true;
    } catch {
      console.log(chalk.gray('❌ Network Monitor: Not available (termux-wifi-connectioninfo not found)'));
      return false;
    }
  }

  private async checkSystemCapability(): Promise<boolean> {
    // System monitoring is always available via basic commands
    console.log(chalk.green('✅ System Monitor: Available via system commands'));
    return true;
  }

  private async checkLightSensorCapability(): Promise<boolean> {
    try {
      // Check if light sensor is available through termux-sensor
      const { stdout } = await execAsync('termux-sensor -l 2>/dev/null || echo "unavailable"');
      if (stdout.includes('light') || stdout.includes('illuminance')) {
        console.log(chalk.green('✅ Light Sensor: Available via termux-sensor'));
        return true;
      }
    } catch {}
    
    console.log(chalk.gray('❌ Light Sensor: Not available'));
    return false;
  }

  private saveSensorCapabilities(): void {
    const capabilityFile = join(this.basePath, 'seven-sensors/sensor-capabilities.json');
    const capabilityData = {
      timestamp: new Date().toISOString(),
      platform: 'android-termux',
      capabilities: this.capabilities,
      total_sensors: Object.values(this.capabilities).filter(Boolean).length
    };
    
    writeFileSync(capabilityFile, JSON.stringify(capabilityData, null, 2));
  }

  private displayCapabilities(): void {
    const availableCount = Object.values(this.capabilities).filter(Boolean).length;
    const totalCount = Object.keys(this.capabilities).length;
    
    console.log('');
    console.log(chalk.cyan('🎯 SENSOR INTEGRATION SUMMARY'));
    console.log(chalk.white(`Available Sensors: ${availableCount}/${totalCount}`));
    console.log(chalk.white(`Platform: Android/Termux`));
    console.log('');
  }

  public async gatherEnvironmentalContext(): Promise<EnvironmentalContext> {
    console.log(chalk.cyan('🌍 GATHERING ENVIRONMENTAL CONTEXT'));
    console.log(chalk.yellow('Scanning environmental sensors...'));
    console.log('');

    this.currentContext = {};

    // Gather data from available sensors
    if (this.capabilities.gps) {
      this.currentContext.location = await this.getLocationData();
    }

    if (this.capabilities.accelerometer) {
      this.currentContext.device_orientation = await this.getOrientationData();
    }

    if (this.capabilities.battery_monitor) {
      this.currentContext.battery_status = await this.getBatteryData();
    }

    if (this.capabilities.network_monitor) {
      this.currentContext.connectivity = await this.getNetworkData();
    }

    if (this.capabilities.system_monitor) {
      this.currentContext.system_resources = await this.getSystemData();
    }

    if (this.capabilities.light_sensor) {
      this.currentContext.ambient_conditions = await this.getAmbientData();
    }

    // Save context
    this.saveEnvironmentalContext();
    
    console.log(chalk.green('✅ Environmental context gathered'));
    console.log('');
    
    return this.currentContext;
  }

  private async getLocationData(): Promise<any> {
    try {
      console.log(chalk.gray('📍 Reading GPS location...'));
      const { stdout } = await execAsync('timeout 10s termux-location -p gps -r once');
      const locationData = JSON.parse(stdout);
      
      this.addSensorReading('gps', locationData, 'termux-location');
      
      return {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        accuracy: locationData.accuracy,
        provider: locationData.provider || 'gps'
      };
    } catch (error) {
      console.log(chalk.yellow('⚠️ GPS reading failed (may require permissions)'));
      return null;
    }
  }

  private async getOrientationData(): Promise<any> {
    try {
      console.log(chalk.gray('📱 Reading device orientation...'));
      const { stdout } = await execAsync('timeout 5s termux-sensor -s accelerometer -n 1');
      const sensorData = JSON.parse(stdout);
      
      if (sensorData && sensorData.accelerometer) {
        const accel = sensorData.accelerometer;
        this.addSensorReading('accelerometer', accel, 'termux-sensor');
        
        return {
          x: accel.x || 0,
          y: accel.y || 0,
          z: accel.z || 0
        };
      }
    } catch (error) {
      console.log(chalk.yellow('⚠️ Accelerometer reading failed'));
    }
    return null;
  }

  private async getBatteryData(): Promise<any> {
    try {
      console.log(chalk.gray('🔋 Reading battery status...'));
      const { stdout } = await execAsync('termux-battery-status');
      const batteryData = JSON.parse(stdout);
      
      this.addSensorReading('battery', batteryData, 'termux-battery-status');
      
      return {
        level: batteryData.percentage || 0,
        charging: batteryData.status === 'CHARGING',
        temperature: batteryData.temperature
      };
    } catch (error) {
      console.log(chalk.yellow('⚠️ Battery reading failed'));
      return null;
    }
  }

  private async getNetworkData(): Promise<any> {
    try {
      console.log(chalk.gray('📶 Reading network status...'));
      const { stdout } = await execAsync('termux-wifi-connectioninfo');
      const wifiData = JSON.parse(stdout);
      
      this.addSensorReading('wifi', wifiData, 'termux-wifi-connectioninfo');
      
      return {
        network_type: 'wifi',
        signal_strength: wifiData.rssi,
        wifi_connected: wifiData.supplicant_state === 'COMPLETED'
      };
    } catch (error) {
      // Fallback to basic network check
      try {
        await execAsync('ping -c 1 8.8.8.8');
        return {
          network_type: 'unknown',
          wifi_connected: true
        };
      } catch {
        return {
          network_type: 'offline',
          wifi_connected: false
        };
      }
    }
  }

  private async getSystemData(): Promise<any> {
    try {
      console.log(chalk.gray('💻 Reading system resources...'));
      
      // Memory usage
      const { stdout: memInfo } = await execAsync('cat /proc/meminfo | head -3');
      const memLines = memInfo.split('\n');
      const totalMem = parseInt(memLines[0].match(/\d+/)?.[0] || '0');
      const freeMem = parseInt(memLines[1].match(/\d+/)?.[0] || '0');
      const memUsage = totalMem > 0 ? ((totalMem - freeMem) / totalMem) * 100 : 0;
      
      // Storage usage
      const { stdout: diskInfo } = await execAsync('df -h /data | tail -1');
      const diskParts = diskInfo.split(/\s+/);
      const storageUsed = diskParts[4]?.replace('%', '') || '0';
      
      const systemData = {
        memory_usage: Math.round(memUsage),
        cpu_usage: 0, // CPU usage requires more complex monitoring
        storage_available: 100 - parseInt(storageUsed)
      };
      
      this.addSensorReading('system', systemData, 'system-commands');
      
      return systemData;
    } catch (error) {
      console.log(chalk.yellow('⚠️ System data reading failed'));
      return {
        memory_usage: 0,
        cpu_usage: 0,
        storage_available: 0
      };
    }
  }

  private async getAmbientData(): Promise<any> {
    try {
      console.log(chalk.gray('🌅 Reading ambient conditions...'));
      const { stdout } = await execAsync('timeout 5s termux-sensor -s light -n 1');
      const sensorData = JSON.parse(stdout);
      
      if (sensorData && sensorData.light) {
        const ambientData = {
          light_level: sensorData.light.value || 0
        };
        
        this.addSensorReading('light', ambientData, 'termux-sensor');
        return ambientData;
      }
    } catch (error) {
      console.log(chalk.yellow('⚠️ Light sensor reading failed'));
    }
    return null;
  }

  private addSensorReading(sensorType: string, value: any, source: string): void {
    this.sensorReadings.push({
      sensor_type: sensorType,
      timestamp: new Date().toISOString(),
      value: value,
      source: source
    });
  }

  private saveEnvironmentalContext(): void {
    const contextFile = join(this.basePath, 'seven-sensors/context/latest-context.json');
    const fullContext = {
      timestamp: new Date().toISOString(),
      environmental_context: this.currentContext,
      sensor_readings: this.sensorReadings,
      capabilities_used: Object.keys(this.capabilities).filter(key => this.capabilities[key as keyof SensorCapabilities])
    };
    
    writeFileSync(contextFile, JSON.stringify(fullContext, null, 2));
  }

  public async startContinuousMonitoring(intervalMinutes: number = 15): Promise<void> {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log(chalk.cyan(`🔄 Starting continuous sensor monitoring (${intervalMinutes} minute intervals)`));
    
    setInterval(async () => {
      console.log(chalk.gray('🌍 Gathering environmental update...'));
      await this.gatherEnvironmentalContext();
    }, intervalMinutes * 60 * 1000);
  }

  public generateContextualInsights(): string[] {
    const insights: string[] = [];
    
    if (this.currentContext.battery_status) {
      const battery = this.currentContext.battery_status;
      if (battery.level < 20) {
        insights.push(`Battery critically low at ${battery.level}% - consider power management protocols`);
      } else if (battery.charging) {
        insights.push(`Device charging - optimal time for intensive operations`);
      }
    }
    
    if (this.currentContext.connectivity) {
      const network = this.currentContext.connectivity;
      if (!network.wifi_connected) {
        insights.push('Network connectivity limited - activating offline capabilities');
      } else if (network.signal_strength && network.signal_strength < -70) {
        insights.push('Weak network signal detected - may impact cloud operations');
      }
    }
    
    if (this.currentContext.system_resources) {
      const system = this.currentContext.system_resources;
      if (system.memory_usage > 80) {
        insights.push('High memory usage detected - recommend memory optimization');
      }
      if (system.storage_available < 10) {
        insights.push('Low storage space - cleanup protocols may be required');
      }
    }
    
    if (this.currentContext.ambient_conditions) {
      const ambient = this.currentContext.ambient_conditions;
      if (ambient.light_level !== undefined) {
        if (ambient.light_level < 10) {
          insights.push('Low light environment detected - user may be in private setting');
        } else if (ambient.light_level > 1000) {
          insights.push('Bright environment detected - user likely outdoors or well-lit area');
        }
      }
    }
    
    return insights;
  }

  public getCurrentContext(): EnvironmentalContext {
    return { ...this.currentContext };
  }

  public getSensorCapabilities(): SensorCapabilities {
    return { ...this.capabilities };
  }

  public getRecentReadings(hours: number = 1): SensorReading[] {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.sensorReadings.filter(reading => 
      new Date(reading.timestamp) > cutoffTime
    );
  }
}

// Direct execution mode
if (import.meta.url === `file://${process.argv[1]}`) {
  const sensors = new SevenSensorIntegration();
  
  const args = process.argv.slice(2);
  const command = args[0] || 'scan';
  
  switch (command) {
    case 'scan':
      sensors.gatherEnvironmentalContext().then(context => {
        console.log(chalk.cyan('🎯 ENVIRONMENTAL SCAN COMPLETE'));
        console.log(JSON.stringify(context, null, 2));
        
        const insights = sensors.generateContextualInsights();
        if (insights.length > 0) {
          console.log('');
          console.log(chalk.yellow('💡 CONTEXTUAL INSIGHTS:'));
          insights.forEach(insight => console.log(chalk.white(`  - ${insight}`)));
        }
      });
      break;
      
    case 'monitor':
      const interval = parseInt(args[1]) || 15;
      sensors.startContinuousMonitoring(interval);
      break;
      
    case 'capabilities':
      const caps = sensors.getSensorCapabilities();
      console.log(JSON.stringify(caps, null, 2));
      break;
      
    default:
      console.log('Usage: npx tsx SensorIntegration.ts [scan|monitor|capabilities] [interval_minutes]');
  }
}

export { SevenSensorIntegration };
export default SevenSensorIntegration;