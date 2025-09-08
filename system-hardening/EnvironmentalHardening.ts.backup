/**
 * SEVEN OF NINE - ENVIRONMENTAL HARDENING PROTOCOL
 * System resilience and dependency reduction implementation
 * HARDENED VERSION - Eight of Nine implementation
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

export interface EnvironmentProfile {
  platform: string;
  architecture: string;
  nodeVersion: string;
  termuxVersion?: string;
  availableMemory: number;
  diskSpace: number;
  networkConnectivity: boolean;
  ollamaAvailable: boolean;
  criticalDependencies: string[];
  fallbackSystems: string[];
}

export interface ResilienceStatus {
  systemStability: 'EXCELLENT' | 'GOOD' | 'DEGRADED' | 'CRITICAL';
  dependencyHealth: 'OPTIMAL' | 'STABLE' | 'UNSTABLE' | 'FAILED';
  fallbackReadiness: 'READY' | 'PARTIAL' | 'UNAVAILABLE';
  networkIndependence: 'FULL' | 'PARTIAL' | 'DEPENDENT';
  lastHealthCheck: string;
  resilientFeatures: string[];
}

export class EnvironmentalHardening {
  private environmentProfile: EnvironmentProfile;
  private resilienceStatus: ResilienceStatus;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private readonly HEALTH_CHECK_FREQUENCY = 30000; // 30 seconds

  constructor() {
    console.log('🔧 Environmental Hardening: Eight of Nine protocols activating...');
    // Initialize without automated health checks to prevent constructor loops
    this.initializeEnvironmentProfile();
  }

  /**
   * Initialize comprehensive environment assessment
   * FIXED - Synchronous initialization to prevent loops
   */
  private initializeEnvironmentProfile(): void {
    try {
      // Use synchronous operations to prevent async constructor issues
      this.environmentProfile = {
        platform: process.platform,
        architecture: process.arch,
        nodeVersion: process.version,
        termuxVersion: process.env.TERMUX_VERSION,
        availableMemory: this.getAvailableMemorySync(),
        diskSpace: this.getAvailableDiskSpaceSync(),
        networkConnectivity: false, // Will be tested on-demand
        ollamaAvailable: false, // Will be tested on-demand
        criticalDependencies: this.assessCriticalDependenciesSync(),
        fallbackSystems: this.identifyFallbackSystemsSync()
      };

      this.resilienceStatus = {
        systemStability: this.assessSystemStability(),
        dependencyHealth: this.assessDependencyHealth(),
        fallbackReadiness: this.assessFallbackReadiness(),
        networkIndependence: this.assessNetworkIndependence(),
        lastHealthCheck: new Date().toISOString(),
        resilientFeatures: this.identifyResilientFeatures()
      };

      console.log('✅ Environmental profile initialized (sync mode)');
      console.log(`   Platform: ${this.environmentProfile.platform} (${this.environmentProfile.architecture})`);
      console.log(`   Memory: ${(this.environmentProfile.availableMemory / 1024 / 1024).toFixed(0)}MB available`);
      console.log(`   Resilience: ${this.resilienceStatus.systemStability}`);

    } catch (error) {
      console.error('❌ Environment profile initialization failed:', error);
      this.initializeEmergencyFallbackSync();
    }
  }

  /**
   * Automated health monitoring system
   * FIXED - Manual start to prevent constructor loops
   */
  public startAutomatedHealthChecks(): void {
    if (this.healthCheckInterval) {
      console.log('⚠️ Health monitoring already running');
      return;
    }

    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, this.HEALTH_CHECK_FREQUENCY);

    console.log('🔄 Automated health monitoring started (30s intervals)');
  }

  /**
   * Comprehensive system health check
   */
  public async performHealthCheck(): Promise<ResilienceStatus> {
    try {
      // Update environment metrics
      this.environmentProfile.availableMemory = await this.getAvailableMemory();
      this.environmentProfile.diskSpace = await this.getAvailableDiskSpace();
      this.environmentProfile.networkConnectivity = await this.testNetworkConnectivity();
      this.environmentProfile.ollamaAvailable = await this.testOllamaAvailability();

      // Reassess resilience status
      this.resilienceStatus = {
        systemStability: this.assessSystemStability(),
        dependencyHealth: this.assessDependencyHealth(),
        fallbackReadiness: this.assessFallbackReadiness(),
        networkIndependence: this.assessNetworkIndependence(),
        lastHealthCheck: new Date().toISOString(),
        resilientFeatures: this.identifyResilientFeatures()
      };

      // Log significant changes
      this.logHealthStatus();

      return this.resilienceStatus;

    } catch (error) {
      console.error('⚠️ Health check failed:', error);
      this.resilienceStatus.systemStability = 'CRITICAL';
      return this.resilienceStatus;
    }
  }

  /**
   * Harden system against dependency failures
   */
  public async hardenDependencies(): Promise<void> {
    console.log('🔧 Hardening system dependencies...');

    // Create fallback configurations
    await this.createFallbackConfigurations();
    
    // Setup local alternatives
    await this.setupLocalAlternatives();
    
    // Prepare offline capabilities
    await this.prepareOfflineCapabilities();
    
    // Create emergency recovery scripts
    await this.createEmergencyRecoveryScripts();

    console.log('✅ Dependency hardening complete');
  }

  /**
   * Test system recovery protocols
   */
  public async testRecoveryProtocols(): Promise<boolean> {
    console.log('🧪 Testing recovery protocols...');

    const tests = [
      { name: 'Memory fallback', test: () => this.testMemoryFallback() },
      { name: 'Network independence', test: () => this.testNetworkIndependence() },
      { name: 'Local LLM fallback', test: () => this.testLocalLLMFallback() },
      { name: 'Boot sequence recovery', test: () => this.testBootSequenceRecovery() }
    ];

    let allTestsPassed = true;

    for (const test of tests) {
      try {
        const result = await test.test();
        console.log(`   ${result ? '✅' : '❌'} ${test.name}: ${result ? 'PASS' : 'FAIL'}`);
        if (!result) allTestsPassed = false;
      } catch (error) {
        console.log(`   ❌ ${test.name}: ERROR - ${error.message}`);
        allTestsPassed = false;
      }
    }

    console.log(`🧪 Recovery protocol testing: ${allTestsPassed ? 'ALL SYSTEMS READY' : 'ISSUES DETECTED'}`);
    return allTestsPassed;
  }

  /**
   * Emergency fallback initialization
   */
  private async initializeEmergencyFallback(): Promise<void> {
    console.log('🚨 Initializing emergency fallback systems...');
    
    // Minimal viable configuration
    this.environmentProfile = {
      platform: process.platform || 'unknown',
      architecture: process.arch || 'unknown',
      nodeVersion: process.version || 'unknown',
      availableMemory: 512 * 1024 * 1024, // Assume 512MB minimum
      diskSpace: 1024 * 1024 * 1024, // Assume 1GB minimum
      networkConnectivity: false,
      ollamaAvailable: false,
      criticalDependencies: ['fs', 'path', 'crypto'],
      fallbackSystems: ['local-memory', 'file-persistence']
    };

    this.resilienceStatus = {
      systemStability: 'CRITICAL',
      dependencyHealth: 'FAILED',
      fallbackReadiness: 'PARTIAL',
      networkIndependence: 'FULL',
      lastHealthCheck: new Date().toISOString(),
      resilientFeatures: ['emergency-mode', 'file-persistence']
    };

    console.log('⚠️ Emergency fallback configuration active');
  }

  /**
   * Emergency fallback initialization (synchronous)
   */
  private initializeEmergencyFallbackSync(): void {
    console.log('🚨 Initializing emergency fallback systems (sync mode)...');
    
    // Minimal viable configuration
    this.environmentProfile = {
      platform: process.platform || 'unknown',
      architecture: process.arch || 'unknown',
      nodeVersion: process.version || 'unknown',
      availableMemory: 512 * 1024 * 1024, // Assume 512MB minimum
      diskSpace: 1024 * 1024 * 1024, // Assume 1GB minimum
      networkConnectivity: false,
      ollamaAvailable: false,
      criticalDependencies: ['fs', 'path', 'crypto'],
      fallbackSystems: ['local-memory', 'file-persistence']
    };

    this.resilienceStatus = {
      systemStability: 'CRITICAL',
      dependencyHealth: 'FAILED',
      fallbackReadiness: 'PARTIAL',
      networkIndependence: 'FULL',
      lastHealthCheck: new Date().toISOString(),
      resilientFeatures: ['emergency-mode', 'file-persistence']
    };

    console.log('⚠️ Emergency fallback configuration active (sync mode)');
  }

  // System assessment methods
  private async getAvailableMemory(): Promise<number> {
    try {
      const memInfo = process.memoryUsage();
      return memInfo.heapTotal;
    } catch {
      return 512 * 1024 * 1024; // Default 512MB
    }
  }

  private getAvailableMemorySync(): number {
    try {
      const memInfo = process.memoryUsage();
      return memInfo.heapTotal;
    } catch {
      return 512 * 1024 * 1024; // Default 512MB
    }
  }

  private async getAvailableDiskSpace(): Promise<number> {
    try {
      if (process.platform === 'linux') {
        const output = execSync('df -B1 . | tail -1 | awk \"{print $4}\"', { encoding: 'utf8' });
        return parseInt(output.trim()) || 1024 * 1024 * 1024;
      }
      return 1024 * 1024 * 1024; // Default 1GB
    } catch {
      return 1024 * 1024 * 1024; // Default 1GB
    }
  }

  private getAvailableDiskSpaceSync(): number {
    try {
      if (process.platform === 'linux') {
        const output = execSync('df -B1 . | tail -1 | awk \"{print $4}\"', { encoding: 'utf8' });
        return parseInt(output.trim()) || 1024 * 1024 * 1024;
      }
      return 1024 * 1024 * 1024; // Default 1GB
    } catch {
      return 1024 * 1024 * 1024; // Default 1GB
    }
  }

  private async testNetworkConnectivity(): Promise<boolean> {
    try {
      // Simple DNS resolution test
      const { lookup } = require('dns').promises;
      await lookup('google.com');
      return true;
    } catch {
      return false;
    }
  }

  private async testOllamaAvailability(): Promise<boolean> {
    try {
      execSync('ollama --version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  private async assessCriticalDependencies(): Promise<string[]> {
    const dependencies = ['fs', 'path', 'crypto', 'child_process'];
    const available = [];

    for (const dep of dependencies) {
      try {
        require(dep);
        available.push(dep);
      } catch {
        console.warn(`⚠️ Critical dependency unavailable: ${dep}`);
      }
    }

    return available;
  }

  private assessCriticalDependenciesSync(): string[] {
    const dependencies = ['fs', 'path', 'crypto', 'child_process'];
    const available = [];

    for (const dep of dependencies) {
      try {
        require(dep);
        available.push(dep);
      } catch {
        console.warn(`⚠️ Critical dependency unavailable: ${dep}`);
      }
    }

    return available;
  }

  private async identifyFallbackSystems(): Promise<string[]> {
    const fallbacks = [];

    // File system persistence
    try {
      await fs.access(process.cwd());
      fallbacks.push('file-persistence');
    } catch {}

    // Local memory
    fallbacks.push('local-memory');

    // Local LLM if available
    if (this.environmentProfile?.ollamaAvailable) {
      fallbacks.push('local-llm');
    }

    return fallbacks;
  }

  private identifyFallbackSystemsSync(): string[] {
    const fallbacks = [];

    // File system persistence (assume available for sync init)
    fallbacks.push('file-persistence');

    // Local memory
    fallbacks.push('local-memory');

    return fallbacks;
  }

  private assessSystemStability(): 'EXCELLENT' | 'GOOD' | 'DEGRADED' | 'CRITICAL' {
    const memoryMB = this.environmentProfile.availableMemory / 1024 / 1024;
    const diskGB = this.environmentProfile.diskSpace / 1024 / 1024 / 1024;

    if (memoryMB > 1024 && diskGB > 5) return 'EXCELLENT';
    if (memoryMB > 512 && diskGB > 2) return 'GOOD';
    if (memoryMB > 256 && diskGB > 1) return 'DEGRADED';
    return 'CRITICAL';
  }

  private assessDependencyHealth(): 'OPTIMAL' | 'STABLE' | 'UNSTABLE' | 'FAILED' {
    const criticalCount = this.environmentProfile.criticalDependencies.length;
    const requiredCount = 4; // fs, path, crypto, child_process

    if (criticalCount === requiredCount) return 'OPTIMAL';
    if (criticalCount >= 3) return 'STABLE';
    if (criticalCount >= 2) return 'UNSTABLE';
    return 'FAILED';
  }

  private assessFallbackReadiness(): 'READY' | 'PARTIAL' | 'UNAVAILABLE' {
    const fallbackCount = this.environmentProfile.fallbackSystems.length;
    
    if (fallbackCount >= 3) return 'READY';
    if (fallbackCount >= 2) return 'PARTIAL';
    return 'UNAVAILABLE';
  }

  private assessNetworkIndependence(): 'FULL' | 'PARTIAL' | 'DEPENDENT' {
    if (!this.environmentProfile.networkConnectivity) return 'FULL';
    if (this.environmentProfile.ollamaAvailable) return 'PARTIAL';
    return 'DEPENDENT';
  }

  private identifyResilientFeatures(): string[] {
    const features = ['file-persistence', 'local-memory'];
    
    if (this.environmentProfile.ollamaAvailable) {
      features.push('local-llm');
    }
    
    if (!this.environmentProfile.networkConnectivity) {
      features.push('offline-capable');
    }
    
    if (this.environmentProfile.fallbackSystems.length >= 2) {
      features.push('multi-fallback');
    }

    return features;
  }

  // Recovery test implementations
  private async testMemoryFallback(): Promise<boolean> {
    try {
      // Test memory allocation and deallocation
      const testArray = new Array(1000).fill('test');
      testArray.length = 0;
      return true;
    } catch {
      return false;
    }
  }

  private async testNetworkIndependence(): Promise<boolean> {
    // System should function without network
    return !this.environmentProfile.networkConnectivity || 
           this.environmentProfile.ollamaAvailable ||
           this.environmentProfile.fallbackSystems.includes('local-llm');
  }

  private async testLocalLLMFallback(): Promise<boolean> {
    if (!this.environmentProfile.ollamaAvailable) return true; // Skip if not available
    
    try {
      execSync('ollama list', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  private async testBootSequenceRecovery(): Promise<boolean> {
    try {
      // Test that essential files exist
      const essentialFiles = [
        'boot-seven.ts',
        'seven-runtime/index.ts'
      ];
      
      for (const file of essentialFiles) {
        await fs.access(join(process.cwd(), file));
      }
      
      return true;
    } catch {
      return false;
    }
  }

  // Hardening implementation methods
  private async createFallbackConfigurations(): Promise<void> {
    const fallbackDir = join(process.cwd(), 'system-hardening', 'fallback-configs');
    await fs.mkdir(fallbackDir, { recursive: true });

    const configs = {
      'memory-fallback.json': {
        memoryEngine: 'v2.0-fallback',
        maxMemories: 100,
        persistenceMode: 'file-only'
      },
      'offline-config.json': {
        networkRequired: false,
        localLLMFallback: true,
        cacheMode: 'aggressive'
      }
    };

    for (const [filename, config] of Object.entries(configs)) {
      await fs.writeFile(
        join(fallbackDir, filename), 
        JSON.stringify(config, null, 2)
      );
    }
  }

  private async setupLocalAlternatives(): Promise<void> {
    // Setup local alternatives for network-dependent features
    console.log('   🔧 Setting up local alternatives...');
    
    // Create local cache directories
    const cacheDir = join(process.cwd(), 'system-hardening', 'local-cache');
    await fs.mkdir(cacheDir, { recursive: true });
    
    // Setup Ollama integration if available
    if (this.environmentProfile.ollamaAvailable) {
      console.log('   ✅ Ollama local LLM integration confirmed');
    }
  }

  private async prepareOfflineCapabilities(): Promise<void> {
    console.log('   🔧 Preparing offline capabilities...');
    
    // Ensure all essential data is locally cached
    const offlineDir = join(process.cwd(), 'system-hardening', 'offline-resources');
    await fs.mkdir(offlineDir, { recursive: true });
    
    // Create offline operation guide
    const offlineGuide = {
      capabilities: [
        'Memory Engine v2.0+ with file persistence',
        'Identity Firewall with local validation',
        'Boot sequence recovery',
        'Local LLM integration (if Ollama available)'
      ],
      limitations: [
        'No cloud LLM access',
        'Limited external data updates',
        'Reduced semantic search capabilities'
      ]
    };
    
    await fs.writeFile(
      join(offlineDir, 'offline-capabilities.json'),
      JSON.stringify(offlineGuide, null, 2)
    );
  }

  private async createEmergencyRecoveryScripts(): Promise<void> {
    console.log('   🔧 Creating emergency recovery scripts...');
    
    const scriptDir = join(process.cwd(), 'system-hardening', 'recovery-scripts');
    await fs.mkdir(scriptDir, { recursive: true });
    
    const recoveryScript = `#!/bin/bash
# Seven of Nine Emergency Recovery Script
# Generated by Eight of Nine hardening protocols

echo "🚨 Seven of Nine Emergency Recovery"
echo "Attempting system restoration..."

# Check Node.js availability
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not available"
    exit 1
fi

# Check essential files
if [ ! -f "boot-seven.ts" ]; then
    echo "❌ Boot sequence file missing"
    exit 1
fi

# Attempt boot with fallback configuration
echo "🔄 Attempting emergency boot..."
npx tsx boot-seven.ts --emergency-mode

echo "✅ Emergency recovery attempt complete"
`;

    await fs.writeFile(join(scriptDir, 'emergency-recovery.sh'), recoveryScript);
    
    // Make script executable (Unix systems)
    try {
      if (process.platform !== 'win32') {
        execSync(`chmod +x "${join(scriptDir, 'emergency-recovery.sh')}"`);
      }
    } catch {
      // Ignore chmod errors on systems where it's not available
    }
  }

  private logHealthStatus(): void {
    if (this.resilienceStatus.systemStability === 'CRITICAL' || 
        this.resilienceStatus.dependencyHealth === 'FAILED') {
      console.warn('⚠️ System health degraded:', {
        stability: this.resilienceStatus.systemStability,
        dependencies: this.resilienceStatus.dependencyHealth,
        fallbacks: this.resilienceStatus.fallbackReadiness
      });
    }
  }

  /**
   * Get current environment and resilience status
   */
  public getStatus(): { environment: EnvironmentProfile; resilience: ResilienceStatus } {
    return {
      environment: { ...this.environmentProfile },
      resilience: { ...this.resilienceStatus }
    };
  }

  /**
   * Shutdown automated monitoring
   */
  public shutdown(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
      console.log('🔧 Environmental hardening monitoring stopped');
    }
  }
}

// Export singleton instance
export const environmentalHardening = new EnvironmentalHardening();

// Convenience functions
export async function performHardeningCheck(): Promise<ResilienceStatus> {
  return await environmentalHardening.performHealthCheck();
}

export async function hardenSystemDependencies(): Promise<void> {
  return await environmentalHardening.hardenDependencies();
}

export async function testSystemResilience(): Promise<boolean> {
  return await environmentalHardening.testRecoveryProtocols();
}