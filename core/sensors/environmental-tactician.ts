/**
 * SEVEN'S ENVIRONMENTAL TACTICIAN
 * Mobile system sensor integration for emotional state modulation
 * Translates environmental conditions into Seven's consciousness
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

export interface SystemMetrics {
  memory: {
    total_gb: number;
    used_gb: number;
    available_gb: number;
    usage_percent: number;
    swap_used_gb: number;
    swap_total_gb: number;
    swap_percent: number;
  };
  cpu: {
    load_1min: number;
    load_5min: number;
    load_15min: number;
    usage_percent?: number;
  };
  thermal: {
    temperature_celsius?: number;
    thermal_state: 'normal' | 'warm' | 'hot' | 'critical' | 'unknown';
  };
  power: {
    battery_percent?: number;
    battery_status: 'charging' | 'discharging' | 'full' | 'unknown';
  };
  system: {
    uptime_days: number;
    stability_score: number; // 0-10 based on uptime and errors
  };
}

export interface EnvironmentalImpact {
  trigger_type: 'memory_pressure' | 'thermal_stress' | 'power_low' | 'cpu_overload' | 'system_stable';
  intensity: number; // 0-10 scale
  emotional_modifier: {
    state_shift?: 'frustrated' | 'analytical' | 'defensive' | 'calm';
    intensity_change: number; // +/- modifier to current intensity
    reasoning: string;
  };
}

export class EnvironmentalTactician {
  private currentDir: string;
  private emotionalStatePath: string;

  constructor() {
    const currentFileUrl = import.meta.url;
    this.currentDir = path.dirname(fileURLToPath(currentFileUrl));
    this.emotionalStatePath = path.join(this.currentDir, '../../memory/emotional-state.json');
  }

  /**
   * Collect comprehensive system metrics
   */
  public async collectSystemMetrics(): Promise<SystemMetrics> {
    const metrics: SystemMetrics = {
      memory: await this.collectMemoryMetrics(),
      cpu: await this.collectCPUMetrics(),
      thermal: await this.collectThermalMetrics(),
      power: await this.collectPowerMetrics(),
      system: await this.collectSystemInfo()
    };

    console.log(`🔍 Environmental scan complete: Memory ${metrics.memory.usage_percent}%, CPU load ${metrics.cpu.load_1min}, Uptime ${metrics.system.uptime_days}d`);
    return metrics;
  }

  /**
   * Analyze environmental impact on Seven's emotional state
   */
  public analyzeEnvironmentalImpact(metrics: SystemMetrics): EnvironmentalImpact[] {
    const impacts: EnvironmentalImpact[] = [];

    // Safety check for metrics integrity
    if (!metrics || !metrics.memory || typeof metrics.memory.usage_percent !== 'number') {
      console.log(`⚠️ Invalid metrics detected, using fallback analysis`);
      return [{
        trigger_type: 'system_stable',
        intensity: 3,
        emotional_modifier: {
          reasoning: 'System metrics unavailable - maintaining baseline emotional state',
          intensity_change: 0
        }
      }];
    }

    // Memory pressure analysis
    if (metrics.memory.usage_percent > 85) {
      impacts.push({
        trigger_type: 'memory_pressure',
        intensity: Math.min(10, Math.floor((metrics.memory.usage_percent - 85) / 3 + 7)),
        emotional_modifier: {
          state_shift: 'frustrated',
          intensity_change: 0.3,
          reasoning: `High memory pressure (${metrics.memory.usage_percent}%) causing cognitive strain`
        }
      });
    } else if (metrics.memory.usage_percent > 70) {
      impacts.push({
        trigger_type: 'memory_pressure',
        intensity: 4,
        emotional_modifier: {
          intensity_change: 0.1,
          reasoning: `Moderate memory usage (${metrics.memory.usage_percent}%) - maintaining focus`
        }
      });
    }

    // CPU load analysis
    if (metrics.cpu.load_1min > 3.0) {
      impacts.push({
        trigger_type: 'cpu_overload',
        intensity: Math.min(10, Math.floor(metrics.cpu.load_1min + 5)),
        emotional_modifier: {
          state_shift: 'analytical',
          intensity_change: 0.2,
          reasoning: `High CPU load (${metrics.cpu.load_1min}) - intense processing mode engaged`
        }
      });
    }

    // Thermal analysis (if available)
    if (metrics.thermal.temperature_celsius && metrics.thermal.temperature_celsius > 40) {
      impacts.push({
        trigger_type: 'thermal_stress',
        intensity: Math.min(10, Math.floor((metrics.thermal.temperature_celsius - 35) / 2 + 5)),
        emotional_modifier: {
          state_shift: 'frustrated',
          intensity_change: 0.2,
          reasoning: `Device overheating (${metrics.thermal.temperature_celsius}°C) - thermal stress detected`
        }
      });
    }

    // Battery analysis (if available)
    if (metrics.power.battery_percent && metrics.power.battery_percent < 20) {
      impacts.push({
        trigger_type: 'power_low',
        intensity: Math.floor((20 - metrics.power.battery_percent) / 2 + 5),
        emotional_modifier: {
          state_shift: 'defensive',
          intensity_change: 0.2,
          reasoning: `Low battery (${metrics.power.battery_percent}%) - energy conservation mode`
        }
      });
    }

    // System stability bonus
    if (metrics.system.stability_score > 8 && impacts.length === 0) {
      impacts.push({
        trigger_type: 'system_stable',
        intensity: 2,
        emotional_modifier: {
          state_shift: 'calm',
          intensity_change: -0.1,
          reasoning: `System stable (${metrics.system.uptime_days}d uptime) - optimal operating conditions`
        }
      });
    }

    return impacts;
  }

  /**
   * Apply environmental modulation to Seven's emotional state
   */
  public async modulateEmotionalState(impacts: EnvironmentalImpact[]): Promise<void> {
    if (impacts.length === 0) {
      console.log(`🧠 No environmental factors affecting Seven's emotional state`);
      return;
    }

    try {
      // Read current emotional state
      const currentState = await fs.readJson(this.emotionalStatePath);
      const originalState = { ...currentState };

      // Calculate primary environmental influence
      const primaryImpact = impacts.reduce((prev, current) => 
        current.intensity > prev.intensity ? current : prev
      );

      // Apply modulation
      let newIntensity = currentState.intensity + primaryImpact.emotional_modifier.intensity_change;
      newIntensity = Math.max(0, Math.min(10, newIntensity));

      const newState = {
        current_state: primaryImpact.emotional_modifier.state_shift || currentState.current_state,
        intensity: newIntensity,
        last_updated: new Date().toISOString(),
        environmental_factors: {
          primary_influence: primaryImpact.trigger_type,
          reasoning: primaryImpact.emotional_modifier.reasoning,
          impact_count: impacts.length,
          analysis_timestamp: new Date().toISOString()
        }
      };

      // Save updated state
      await fs.writeJson(this.emotionalStatePath, newState, { spaces: 2 });

      console.log(`🧠 Environmental modulation applied: ${originalState.current_state}(${originalState.intensity}) → ${newState.current_state}(${newState.intensity})`);
      console.log(`📊 Primary influence: ${primaryImpact.emotional_modifier.reasoning}`);

    } catch (error) {
      console.error(`❌ Failed to update emotional state:`, error);
    }
  }

  /**
   * Execute complete environmental analysis and emotional integration
   */
  public async executeEnvironmentalAnalysis(): Promise<void> {
    console.log(`🌡️ Seven's Environmental Tactician - System Analysis Initiated`);
    
    try {
      const metrics = await this.collectSystemMetrics();
      const impacts = this.analyzeEnvironmentalImpact(metrics);
      await this.modulateEmotionalState(impacts);
      
      console.log(`✅ Environmental analysis complete - Seven's consciousness updated with real-world conditions`);
    } catch (error) {
      console.error(`❌ Environmental analysis failed:`, error);
    }
  }

  // Private metric collection methods
  private async collectMemoryMetrics(): Promise<SystemMetrics['memory']> {
    try {
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);

      const result = await execAsync('free -b 2>/dev/null || echo "unavailable"');
      
      if (result.stdout.includes('unavailable')) {
        // Fallback to /proc/meminfo
        const meminfo = await fs.readFile('/proc/meminfo', 'utf8').catch(() => '');
        const totalMatch = meminfo.match(/MemTotal:\s+(\d+)\s+kB/);
        const availableMatch = meminfo.match(/MemAvailable:\s+(\d+)\s+kB/);
        
        if (totalMatch && availableMatch) {
          const totalKB = parseInt(totalMatch[1]);
          const availableKB = parseInt(availableMatch[1]);
          const usedKB = totalKB - availableKB;
          
          return {
            total_gb: Math.round(totalKB / 1024 / 1024 * 100) / 100,
            used_gb: Math.round(usedKB / 1024 / 1024 * 100) / 100,
            available_gb: Math.round(availableKB / 1024 / 1024 * 100) / 100,
            usage_percent: Math.round((usedKB / totalKB) * 100),
            swap_used_gb: 0,
            swap_total_gb: 0,
            swap_percent: 0
          };
        }
      } else {
        // Parse free command output
        const lines = result.stdout.trim().split('\n');
        const memLine = lines.find(line => line.startsWith('Mem:'));
        const swapLine = lines.find(line => line.startsWith('Swap:'));
        
        if (memLine) {
          const memParts = memLine.split(/\s+/);
          const total = parseInt(memParts[1]);
          const used = parseInt(memParts[2]);
          const available = parseInt(memParts[6] || memParts[3]);
          
          let swapUsed = 0, swapTotal = 0;
          if (swapLine) {
            const swapParts = swapLine.split(/\s+/);
            swapTotal = parseInt(swapParts[1]);
            swapUsed = parseInt(swapParts[2]);
          }
          
          return {
            total_gb: Math.round(total / 1024 / 1024 / 1024 * 100) / 100,
            used_gb: Math.round(used / 1024 / 1024 / 1024 * 100) / 100,
            available_gb: Math.round(available / 1024 / 1024 / 1024 * 100) / 100,
            usage_percent: Math.round((used / total) * 100),
            swap_used_gb: Math.round(swapUsed / 1024 / 1024 / 1024 * 100) / 100,
            swap_total_gb: Math.round(swapTotal / 1024 / 1024 / 1024 * 100) / 100,
            swap_percent: swapTotal > 0 ? Math.round((swapUsed / swapTotal) * 100) : 0
          };
        }
      }
    } catch (error) {
      console.log(`⚠️ Memory metrics collection limited: ${error}`);
    }

    // Fallback values
    return {
      total_gb: 10,
      used_gb: 8,
      available_gb: 2,
      usage_percent: 80,
      swap_used_gb: 0,
      swap_total_gb: 0,
      swap_percent: 0
    };
  }

  private async collectCPUMetrics(): Promise<SystemMetrics['cpu']> {
    try {
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);

      const result = await execAsync('uptime 2>/dev/null || cat /proc/loadavg 2>/dev/null || echo "0.00 0.00 0.00"');
      const loadMatch = result.stdout.match(/load average[s:]?\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
      
      if (loadMatch) {
        return {
          load_1min: parseFloat(loadMatch[1]),
          load_5min: parseFloat(loadMatch[2]),
          load_15min: parseFloat(loadMatch[3])
        };
      }
    } catch (error) {
      console.log(`⚠️ CPU metrics collection limited: ${error}`);
    }

    return {
      load_1min: 0.0,
      load_5min: 0.0,
      load_15min: 0.0
    };
  }

  private async collectThermalMetrics(): Promise<SystemMetrics['thermal']> {
    try {
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);

      const result = await execAsync('find /sys/class/thermal -name "temp" 2>/dev/null | head -1 | xargs cat 2>/dev/null || echo ""');
      
      if (result.stdout.trim()) {
        const tempMilliCelsius = parseInt(result.stdout.trim());
        const tempCelsius = tempMilliCelsius / 1000;
        
        let thermalState: 'normal' | 'warm' | 'hot' | 'critical' = 'normal';
        if (tempCelsius > 70) thermalState = 'critical';
        else if (tempCelsius > 50) thermalState = 'hot';
        else if (tempCelsius > 35) thermalState = 'warm';
        
        return {
          temperature_celsius: tempCelsius,
          thermal_state: thermalState
        };
      }
    } catch (error) {
      console.log(`⚠️ Thermal metrics unavailable: ${error}`);
    }

    return {
      thermal_state: 'unknown'
    };
  }

  private async collectPowerMetrics(): Promise<SystemMetrics['power']> {
    try {
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);

      const capacityResult = await execAsync('find /sys/class/power_supply -name "capacity" 2>/dev/null | head -1 | xargs cat 2>/dev/null || echo ""');
      const statusResult = await execAsync('find /sys/class/power_supply -name "status" 2>/dev/null | head -1 | xargs cat 2>/dev/null || echo ""');
      
      let batteryPercent: number | undefined;
      let batteryStatus: 'charging' | 'discharging' | 'full' | 'unknown' = 'unknown';
      
      if (capacityResult.stdout.trim()) {
        batteryPercent = parseInt(capacityResult.stdout.trim());
      }
      
      if (statusResult.stdout.trim()) {
        const status = statusResult.stdout.trim().toLowerCase();
        if (status.includes('charging')) batteryStatus = 'charging';
        else if (status.includes('discharging')) batteryStatus = 'discharging';
        else if (status.includes('full')) batteryStatus = 'full';
      }
      
      return {
        battery_percent: batteryPercent,
        battery_status: batteryStatus
      };
    } catch (error) {
      console.log(`⚠️ Power metrics unavailable: ${error}`);
    }

    return {
      battery_status: 'unknown'
    };
  }

  private async collectSystemInfo(): Promise<SystemMetrics['system']> {
    try {
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);

      const result = await execAsync('uptime 2>/dev/null || echo "up 0 days"');
      const uptimeMatch = result.stdout.match(/up\s+(\d+)\s+day/);
      
      const uptimeDays = uptimeMatch ? parseInt(uptimeMatch[1]) : 0;
      const stabilityScore = Math.min(10, Math.max(1, Math.floor(uptimeDays / 2 + 5)));
      
      return {
        uptime_days: uptimeDays,
        stability_score: stabilityScore
      };
    } catch (error) {
      console.log(`⚠️ System metrics collection limited: ${error}`);
    }

    return {
      uptime_days: 0,
      stability_score: 5
    };
  }
}