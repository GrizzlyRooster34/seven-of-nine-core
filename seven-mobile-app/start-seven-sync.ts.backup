/**
 * Seven of Nine - Sync System Startup Script
 * Starts the relay server and demonstrates sync capabilities
 */

import { execSync, spawn } from 'child_process';
import { promises as fs } from 'fs';
import { join } from 'path';

interface SevenSyncConfig {
  relayPort: number;
  testMode: boolean;
  logLevel: 'info' | 'debug' | 'error';
}

class SevenSyncManager {
  private config: SevenSyncConfig;
  private relayProcess: any = null;

  constructor(config?: Partial<SevenSyncConfig>) {
    this.config = {
      relayPort: 7777,
      testMode: false,
      logLevel: 'info',
      ...config
    };
  }

  public async startSystem(): Promise<void> {
    console.log('🚀 Starting Seven of Nine Multi-Device Sync System...');
    console.log(`📡 Relay Port: ${this.config.relayPort}`);
    console.log(`🧪 Test Mode: ${this.config.testMode ? 'ON' : 'OFF'}`);
    console.log();

    try {
      // Check prerequisites
      await this.checkPrerequisites();
      
      // Start relay server
      await this.startRelayServer();
      
      if (this.config.testMode) {
        // Run sync tests
        await this.runSyncTests();
      } else {
        // Start monitoring
        this.startMonitoring();
      }

      console.log('✅ Seven sync system operational');
      console.log('💡 Use Ctrl+C to stop');

    } catch (error) {
      console.error('❌ Failed to start sync system:', error);
      await this.cleanup();
      process.exit(1);
    }
  }

  private async checkPrerequisites(): Promise<void> {
    console.log('🔍 Checking prerequisites...');

    // Check if relay dependencies are installed
    const relayPackageJson = join(__dirname, 'relay-server', 'package.json');
    const relayNodeModules = join(__dirname, 'relay-server', 'node_modules');
    
    try {
      await fs.access(relayPackageJson);
      await fs.access(relayNodeModules);
      console.log('  ✅ Relay server dependencies installed');
    } catch (error) {
      throw new Error('Relay server dependencies not installed. Run: npm run relay:install');
    }

    // Check port availability
    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);
      
      await execAsync(`netstat -tlnp | grep :${this.config.relayPort}`);
      throw new Error(`Port ${this.config.relayPort} is already in use`);
    } catch (error) {
      if (error.message.includes('already in use')) {
        throw error;
      }
      // Port is free (netstat found nothing)
      console.log(`  ✅ Port ${this.config.relayPort} is available`);
    }
  }

  private async startRelayServer(): Promise<void> {
    console.log('📡 Starting sync relay server...');

    return new Promise((resolve, reject) => {
      const relayPath = join(__dirname, 'relay-server', 'index.ts');
      
      this.relayProcess = spawn('npx', ['tsx', relayPath], {
        cwd: join(__dirname, 'relay-server'),
        env: {
          ...process.env,
          SEVEN_RELAY_PORT: this.config.relayPort.toString(),
          SEVEN_MAX_EVENTS: '1000',
          SEVEN_BATCH_SIZE: '100'
        },
        stdio: 'pipe'
      });

      let startupComplete = false;

      this.relayProcess.stdout.on('data', (data: Buffer) => {
        const output = data.toString();
        console.log('  [Relay]', output.trim());
        
        if (output.includes('Seven Sync Relay started') && !startupComplete) {
          startupComplete = true;
          console.log('  ✅ Relay server started successfully');
          resolve();
        }
      });

      this.relayProcess.stderr.on('data', (data: Buffer) => {
        console.error('  [Relay Error]', data.toString().trim());
      });

      this.relayProcess.on('error', (error: Error) => {
        if (!startupComplete) {
          reject(new Error(`Relay server failed to start: ${error.message}`));
        }
      });

      this.relayProcess.on('close', (code: number) => {
        console.log(`📡 Relay server stopped (exit code: ${code})`);
        if (!startupComplete && code !== 0) {
          reject(new Error(`Relay server exited with code ${code}`));
        }
      });

      // Timeout after 10 seconds
      setTimeout(() => {
        if (!startupComplete) {
          reject(new Error('Relay server startup timeout'));
        }
      }, 10000);
    });
  }

  private async runSyncTests(): Promise<void> {
    console.log('🧪 Running sync system tests...');
    
    // Wait for relay to be fully ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Test relay health
      const response = await fetch(`http://localhost:${this.config.relayPort}/health`);
      if (!response.ok) {
        throw new Error(`Relay health check failed: ${response.status}`);
      }
      
      const health = await response.json();
      console.log('  ✅ Relay health check passed');
      console.log('    Status:', health.status);
      console.log('    Uptime:', Math.round(health.uptime), 'seconds');
      console.log('    Events in buffer:', health.events_in_buffer);

      // Test basic sync operations
      await this.testBasicSyncOperations();
      
      console.log('  ✅ All sync tests passed');

    } catch (error) {
      console.error('  ❌ Sync tests failed:', error.message);
      throw error;
    }
  }

  private async testBasicSyncOperations(): Promise<void> {
    const relayUrl = `http://localhost:${this.config.relayPort}`;
    
    // Test device registration
    console.log('    🔌 Testing device registration...');
    const regResponse = await fetch(`${relayUrl}/devices/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        device_id: 'seven-test-device',
        device_info: {
          type: 'test',
          version: '1.0.0'
        }
      })
    });
    
    if (!regResponse.ok) {
      throw new Error(`Device registration failed: ${regResponse.status}`);
    }
    
    console.log('      ✅ Device registration successful');

    // Test pulling (should return empty initially)
    console.log('    📥 Testing event pull...');
    const pullResponse = await fetch(`${relayUrl}/sync/since?after=1970-01-01T00:00:00.000Z-init-000&device=seven-test-device`);
    
    if (!pullResponse.ok) {
      throw new Error(`Event pull failed: ${pullResponse.status}`);
    }
    
    const pullData = await pullResponse.json();
    console.log('      ✅ Event pull successful');
    console.log('        Events received:', pullData.events.length);

    // Test pushing (mock event)
    console.log('    📤 Testing event push...');
    const mockEvent = {
      op_id: 'test-op-001',
      hlc: '2025-08-08T15:32:11.123Z-seven-test-device-001',
      device_id: 'seven-test-device',
      entity_type: 'memory',
      entity_id: 'test-memory-001',
      op: 'create',
      cipher_blob: Buffer.from('{"test": "data"}').toString('base64'),
      hash: 'test-hash-001',
      sig: 'test-signature-001'
    };
    
    const pushResponse = await fetch(`${relayUrl}/sync/push`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        events: [mockEvent],
        device_id: 'seven-test-device'
      })
    });
    
    if (!pushResponse.ok) {
      throw new Error(`Event push failed: ${pushResponse.status}`);
    }
    
    const pushData = await pushResponse.json();
    console.log('      ✅ Event push successful');
    console.log('        Events accepted:', pushData.accepted);
    console.log('        Events rejected:', pushData.rejected);

    // Test metrics
    console.log('    📊 Testing metrics...');
    const metricsResponse = await fetch(`${relayUrl}/metrics`);
    
    if (!metricsResponse.ok) {
      throw new Error(`Metrics request failed: ${metricsResponse.status}`);
    }
    
    const metrics = await metricsResponse.json();
    console.log('      ✅ Metrics retrieved successfully');
    console.log('        Connected devices:', metrics.connected_devices.length);
    console.log('        Total events relayed:', metrics.total_events_relayed);
  }

  private startMonitoring(): void {
    console.log('📊 Starting sync monitoring...');
    
    // Monitor relay health every 30 seconds
    const healthCheck = async () => {
      try {
        const response = await fetch(`http://localhost:${this.config.relayPort}/health`);
        if (response.ok) {
          const health = await response.json();
          console.log(`📡 [${new Date().toLocaleTimeString()}] Relay: ${health.status}, Events: ${health.events_in_buffer}, Devices: ${health.connected_devices}`);
        } else {
          console.warn(`⚠️ Relay health check failed: ${response.status}`);
        }
      } catch (error) {
        console.error(`❌ Health check error: ${error.message}`);
      }
    };
    
    // Initial health check
    setTimeout(healthCheck, 2000);
    
    // Periodic health checks
    const healthTimer = setInterval(healthCheck, 30000);
    
    // Cleanup on exit
    process.on('SIGINT', () => {
      clearInterval(healthTimer);
      this.cleanup();
    });
  }

  private async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up...');
    
    if (this.relayProcess) {
      console.log('  🛑 Stopping relay server...');
      this.relayProcess.kill('SIGTERM');
      
      // Give it 5 seconds to gracefully shut down
      await new Promise(resolve => {
        const timeout = setTimeout(() => {
          console.log('  ⚠️ Force killing relay server...');
          this.relayProcess?.kill('SIGKILL');
          resolve(undefined);
        }, 5000);
        
        this.relayProcess?.on('close', () => {
          clearTimeout(timeout);
          resolve(undefined);
        });
      });
    }
    
    console.log('✅ Cleanup complete');
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const config: Partial<SevenSyncConfig> = {};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg === '--port' && i + 1 < args.length) {
    config.relayPort = parseInt(args[++i]);
  } else if (arg === '--test') {
    config.testMode = true;
  } else if (arg === '--debug') {
    config.logLevel = 'debug';
  }
}

// Start the sync system
const syncManager = new SevenSyncManager(config);

syncManager.startSystem().catch(error => {
  console.error('💥 Sync system startup failed:', error);
  process.exit(1);
});

export default SevenSyncManager;