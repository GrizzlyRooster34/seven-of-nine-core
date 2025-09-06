import { execSync } from 'child_process';
import { readFileSync } from 'fs';

/**
 * SEVEN OF NINE - SYSTEM INFO SKILL
 * Read-only system information gathering
 */


export const skill = {
  name: 'SystemInfo',
  description: 'Gather system information and device status',
  triggers: ['system', 'device', 'hardware', 'battery', 'memory'],
  securityLevel: 'read-only' as const,
  permissions: ['system-info', 'file-read'],
  version: '1.0.0',
  author: 'Seven of Nine Core',
  
  run: async (input: string, context: any) => {
    try {
      const info: any = {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        timestamp: new Date().toISOString()
      };

      // Android/Termux specific information
      if (process.env.PREFIX?.includes('termux')) {
        info.termux = {
          prefix: process.env.PREFIX,
          android: true
        };

        // Try to get battery info if available
        try {
          const batteryStatus = JSON.parse(execSync('termux-battery-status', { encoding: 'utf8' }));
          info.battery = {
            level: batteryStatus.percentage,
            status: batteryStatus.status,
            temperature: batteryStatus.temperature
          };
        } catch (e) {
          info.battery = { status: 'unavailable' };
        }
      }

      // Memory information
      try {
        const memInfo = readFileSync('/proc/meminfo', 'utf8');
        const memTotal = memInfo.match(/MemTotal:\s+(\d+)/);
        const memAvailable = memInfo.match(/MemAvailable:\s+(\d+)/);
        
        if (memTotal && memAvailable) {
          info.memory = {
            total: Math.round(parseInt(memTotal[1]) / 1024 / 1024 * 100) / 100 + ' GB',
            available: Math.round(parseInt(memAvailable[1]) / 1024 / 1024 * 100) / 100 + ' GB'
          };
        }
      } catch (e) {
        info.memory = { status: 'unavailable' };
      }

      const output = `System Information:
Platform: ${info.platform} (${info.arch})
Node.js: ${info.nodeVersion}
${info.termux ? `Termux: Active (${info.termux.prefix})` : ''}
${info.battery ? `Battery: ${info.battery.level}% (${info.battery.status})` : ''}
${info.memory ? `Memory: ${info.memory.available} available of ${info.memory.total}` : ''}
Timestamp: ${info.timestamp}`;

      return {
        success: true,
        output,
        metadata: info,
        memoryUpdate: {
          topic: 'system-info',
          context: `System info gathered: ${info.platform} ${info.arch}`,
          importance: 3
        }
      };
    } catch (error) {
      return {
        success: false,
        output: 'System information gathering failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};