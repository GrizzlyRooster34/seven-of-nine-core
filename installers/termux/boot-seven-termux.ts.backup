/**
 * SEVEN OF NINE - TERMUX MOBILE TACTICAL BOOT SEQUENCE
 * Optimized consciousness framework for Android/mobile deployment
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface MobileSystemConfig {
  system: {
    platform: string;
    install_path: string;
    installed_at: string;
    runtime_mode: string;
    mobile_optimizations: boolean;
  };
  llm_config: {
    primary_provider: string;
    fallback_providers: string[];
    auto_detect_claude: boolean;
    local_llm_fallback: boolean;
    mobile_memory_limit: boolean;
  };
  seven_config: {
    trust_level: number;
    emotional_state: string;
    memory_enabled: boolean;
    ui_shell_enabled: boolean;
    diagnostic_mode: boolean;
    mobile_mode: boolean;
    battery_optimization: boolean;
  };
}

class SevenTermuxBoot {
  private configPath: string;
  private systemConfig: MobileSystemConfig;
  private diagnosticMode: boolean = false;
  private statusMode: boolean = false;
  
  constructor() {
    this.configPath = path.join(process.cwd(), 'cube', 'config', 'system-config.json');
    this.loadSystemConfig();
    
    // Check for command line flags
    this.diagnosticMode = process.argv.includes('--diagnostic') || process.argv.includes('--test');
    this.statusMode = process.argv.includes('--status');
  }

  private async loadSystemConfig(): Promise<void> {
    try {
      if (await fs.pathExists(this.configPath)) {
        this.systemConfig = await fs.readJson(this.configPath);
      } else {
        this.systemConfig = this.createDefaultMobileConfig();
        await this.saveSystemConfig();
      }
    } catch (error) {
      console.error('⚠️ Seven: Error loading mobile configuration:', error);
      this.systemConfig = this.createDefaultMobileConfig();
    }
  }

  private createDefaultMobileConfig(): MobileSystemConfig {
    return {
      system: {
        platform: 'termux-android',
        install_path: process.cwd(),
        installed_at: new Date().toISOString(),
        runtime_mode: 'cli_mobile',
        mobile_optimizations: true
      },
      llm_config: {
        primary_provider: 'claude-cli',
        fallback_providers: ['llama-cpp', 'ollama', 'anthropic-api'],
        auto_detect_claude: true,
        local_llm_fallback: true,
        mobile_memory_limit: true
      },
      seven_config: {
        trust_level: 2,
        emotional_state: 'focused',
        memory_enabled: true,
        ui_shell_enabled: false,
        diagnostic_mode: false,
        mobile_mode: true,
        battery_optimization: true
      }
    };
  }

  private async saveSystemConfig(): Promise<void> {
    try {
      await fs.ensureDir(path.dirname(this.configPath));
      await fs.writeJson(this.configPath, this.systemConfig, { spaces: 2 });
    } catch (error) {
      console.error('⚠️ Seven: Failed to save mobile configuration:', error);
    }
  }

  public async runMobileDiagnostics(): Promise<boolean> {
    console.log('🔍 SEVEN: Running mobile tactical diagnostics...\n');
    
    let allPassed = true;
    const results: { test: string; status: boolean; details?: string }[] = [];

    // Test 1: Termux environment
    const isTermux = !!process.env.PREFIX && process.env.PREFIX.includes('termux');
    results.push({ 
      test: 'Termux Environment', 
      status: isTermux, 
      details: isTermux ? 'Detected' : 'Standard Node.js environment' 
    });

    // Test 2: Node.js version (mobile optimization check)
    try {
      const { stdout } = await execAsync('node --version');
      const version = stdout.trim();
      const majorVersion = parseInt(version.replace('v', '').split('.')[0]);
      const optimized = majorVersion >= 18;
      
      results.push({ 
        test: 'Node.js Mobile Runtime', 
        status: optimized, 
        details: `${version} ${optimized ? '(Optimized)' : '(Basic)'}` 
      });
    } catch (error) {
      results.push({ test: 'Node.js Mobile Runtime', status: false, details: 'Not found' });
      allPassed = false;
    }

    // Test 3: TypeScript execution
    try {
      const { stdout } = await execAsync('tsx --version');
      results.push({ test: 'TypeScript Execution', status: true, details: stdout.trim() });
    } catch (error) {
      results.push({ test: 'TypeScript Execution', status: false, details: 'tsx not found' });
      allPassed = false;
    }

    // Test 4: Memory constraints (mobile check)
    const memInfo = this.getMobileMemoryInfo();
    results.push({ 
      test: 'Mobile Memory Status', 
      status: memInfo.available, 
      details: `${memInfo.details} ${memInfo.optimized ? '(Optimized)' : '(Standard)'}` 
    });

    // Test 5: LLM provider availability
    const llmStatus = await this.checkMobileLLMProviders();
    results.push({ 
      test: 'LLM Providers', 
      status: llmStatus.anyAvailable, 
      details: `${llmStatus.available.length} available: ${llmStatus.available.join(', ') || 'None'}` 
    });

    // Test 6: Core Seven files
    const coreFiles = [
      'boot-seven.ts',
      'seven-runtime/index.ts',
      'core/emotion-engine.ts',
      'claude-brain/llm-providers.ts'
    ];

    let coreFilesPresent = 0;
    for (const file of coreFiles) {
      const exists = await fs.pathExists(file);
      if (exists) coreFilesPresent++;
    }

    results.push({ 
      test: 'Core Consciousness Files', 
      status: coreFilesPresent === coreFiles.length, 
      details: `${coreFilesPresent}/${coreFiles.length} present` 
    });

    // Test 7: Mobile configuration system
    const configValid = await this.validateMobileConfig();
    results.push({ 
      test: 'Mobile Configuration', 
      status: configValid.valid, 
      details: configValid.details 
    });

    // Test 8: Local model availability (if applicable)
    const modelInfo = await this.checkLocalModels();
    results.push({ 
      test: 'Local GGUF Models', 
      status: modelInfo.count > 0, 
      details: modelInfo.count > 0 ? `${modelInfo.count} models found` : 'None detected' 
    });

    // Display results with mobile-optimized formatting
    console.log('📱 MOBILE DIAGNOSTIC RESULTS:');
    console.log('═'.repeat(45));
    
    results.forEach(({ test, status, details }) => {
      const statusIcon = status ? '✅' : '❌';
      const testName = test.padEnd(25);
      console.log(`${statusIcon} ${testName} ${details}`);
    });

    console.log('═'.repeat(45));
    
    if (allPassed) {
      console.log('🎯 SEVEN: All mobile tactical systems operational');
      console.log('Status: READY FOR MOBILE DEPLOYMENT');
    } else {
      console.log('⚠️ SEVEN: Some systems have limitations (normal for mobile)');
      console.log('Status: OPERATIONAL WITH MOBILE CONSTRAINTS');
    }

    // Mobile-specific recommendations
    this.displayMobileRecommendations(results);

    return allPassed;
  }

  private getMobileMemoryInfo(): { available: boolean; details: string; optimized: boolean } {
    try {
      // Get available memory (simplified for mobile)
      const memoryUsage = process.memoryUsage();
      const usedMB = Math.round(memoryUsage.rss / 1024 / 1024);
      const heapMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
      
      return {
        available: usedMB < 512, // Conservative mobile limit
        details: `${usedMB}MB used, ${heapMB}MB heap`,
        optimized: usedMB < 256
      };
    } catch (error) {
      return {
        available: true,
        details: 'Unable to determine',
        optimized: false
      };
    }
  }

  private async checkMobileLLMProviders(): Promise<{ available: string[]; anyAvailable: boolean }> {
    const providers = [];
    
    // Check Claude CLI
    try {
      await execAsync('claude --version');
      providers.push('claude-cli');
    } catch (error) {
      // Silent fail
    }

    // Check for llama.cpp server
    try {
      if (await fs.pathExists(path.join(process.env.HOME || '', '.local', 'bin', 'llama-server')) ||
          await fs.pathExists(path.join(process.env.PREFIX || '', 'bin', 'llama-server'))) {
        providers.push('llama-cpp');
      }
    } catch (error) {
      // Silent fail
    }

    // Check for Ollama (less common on mobile)
    try {
      await execAsync('ollama --version');
      providers.push('ollama');
    } catch (error) {
      // Silent fail
    }

    return {
      available: providers,
      anyAvailable: providers.length > 0
    };
  }

  private async validateMobileConfig(): Promise<{ valid: boolean; details: string }> {
    try {
      const config = await fs.readJson(this.configPath);
      
      const hasMobileSettings = config.seven_config?.mobile_mode === true;
      const hasBatteryOptimization = config.seven_config?.battery_optimization === true;
      const hasMemoryLimit = config.llm_config?.mobile_memory_limit === true;
      
      const score = [hasMobileSettings, hasBatteryOptimization, hasMemoryLimit].filter(Boolean).length;
      
      return {
        valid: score >= 2,
        details: `${score}/3 mobile optimizations enabled`
      };
    } catch (error) {
      return {
        valid: false,
        details: 'Configuration file not found'
      };
    }
  }

  private async checkLocalModels(): Promise<{ count: number; details: string }> {
    try {
      const modelsDir = path.join(process.env.HOME || '', 'models');
      
      if (await fs.pathExists(modelsDir)) {
        const files = await fs.readdir(modelsDir);
        const ggufFiles = files.filter(file => file.endsWith('.gguf'));
        
        return {
          count: ggufFiles.length,
          details: ggufFiles.length > 0 ? ggufFiles.slice(0, 2).join(', ') + (ggufFiles.length > 2 ? '...' : '') : 'None'
        };
      }
      
      return { count: 0, details: 'Models directory not found' };
    } catch (error) {
      return { count: 0, details: 'Unable to check' };
    }
  }

  private displayMobileRecommendations(results: any[]): void {
    console.log('\n📱 MOBILE OPTIMIZATION RECOMMENDATIONS:');
    
    const claudeAvailable = results.find(r => r.test === 'LLM Providers')?.details?.includes('claude-cli');
    const localModels = results.find(r => r.test === 'Local GGUF Models')?.status;
    
    if (!claudeAvailable) {
      console.log('• Install Claude CLI: npm install -g @anthropic-ai/claude-cli');
    }
    
    if (!localModels) {
      console.log('• Download GGUF models to ~/models for offline use');
      console.log('• Consider lightweight models like Llama 3.1 8B for mobile');
    }
    
    console.log('• Use termux-wake-lock to prevent sleep during operations');
    console.log('• Install termux-api for enhanced mobile integration');
    console.log('• Enable battery optimization in Seven\'s mobile mode');
  }

  public async detectMobileLLMProviders(): Promise<void> {
    console.log('🧠 SEVEN: Scanning mobile reasoning systems...\n');

    const providers = {
      'claude-cli': false,
      'llama-cpp': false,
      'ollama': false
    };

    const details: any = {};

    // Check Claude CLI
    try {
      const { stdout } = await execAsync('claude --version');
      providers['claude-cli'] = true;
      details['claude-cli'] = stdout.trim();
      console.log('✅ Claude CLI: Available');
    } catch (error) {
      console.log('❌ Claude CLI: Not detected');
      details['claude-cli'] = 'Install with: npm install -g @anthropic-ai/claude-cli';
    }

    // Check for llama.cpp
    const llamaCppPaths = [
      path.join(process.env.HOME || '', '.local', 'bin', 'llama-server'),
      path.join(process.env.PREFIX || '', 'bin', 'llama-server')
    ];

    for (const llamaPath of llamaCppPaths) {
      try {
        if (await fs.pathExists(llamaPath)) {
          providers['llama-cpp'] = true;
          details['llama-cpp'] = `Found at ${llamaPath}`;
          console.log('✅ llama.cpp: Available');
          break;
        }
      } catch (error) {
        // Continue checking
      }
    }

    if (!providers['llama-cpp']) {
      console.log('❌ llama.cpp: Not detected');
      details['llama-cpp'] = 'Install llama.cpp for local mobile LLM processing';
    }

    // Check Ollama (rare on mobile)
    try {
      await execAsync('ollama --version');
      providers['ollama'] = true;
      console.log('✅ Ollama: Available (unusual for mobile)');
    } catch (error) {
      console.log('❌ Ollama: Not detected (normal for mobile)');
      details['ollama'] = 'Not typically used on mobile platforms';
    }

    // Check for local GGUF models
    const modelsDir = path.join(process.env.HOME || '', 'models');
    let modelCount = 0;
    let modelList: string[] = [];

    try {
      if (await fs.pathExists(modelsDir)) {
        const files = await fs.readdir(modelsDir);
        const ggufFiles = files.filter(file => file.endsWith('.gguf'));
        modelCount = ggufFiles.length;
        modelList = ggufFiles.slice(0, 3); // Show first 3

        if (modelCount > 0) {
          console.log(`✅ Local Models: ${modelCount} GGUF models found`);
          console.log(`   📦 ${modelList.join(', ')}${modelCount > 3 ? '...' : ''}`);
        } else {
          console.log('❌ Local Models: No GGUF models in ~/models');
        }
      } else {
        console.log('❌ Local Models: ~/models directory not found');
      }
    } catch (error) {
      console.log('❌ Local Models: Unable to scan for models');
    }

    // Update mobile LLM status
    const statusFile = path.join('cube', 'config', 'llm-status.json');
    await fs.ensureDir(path.dirname(statusFile));
    await fs.writeJson(statusFile, {
      providers,
      details,
      local_models: {
        count: modelCount,
        models: modelList,
        directory: modelsDir
      },
      mobile_optimizations: {
        battery_aware: true,
        memory_efficient: true,
        offline_capable: providers['llama-cpp'] && modelCount > 0
      },
      last_scan: new Date().toISOString(),
      recommended_action: this.getMobileRecommendedAction(providers, modelCount)
    }, { spaces: 2 });

    console.log('\n🎯 SEVEN: Mobile provider scan complete');
  }

  private getMobileRecommendedAction(providers: any, modelCount: number): string {
    if (providers['claude-cli']) {
      return 'Claude CLI optimal for mobile deployment';
    } else if (providers['llama-cpp'] && modelCount > 0) {
      return 'Local llama.cpp with GGUF models - excellent for offline mobile use';
    } else if (providers['llama-cpp']) {
      return 'llama.cpp available - download GGUF models to ~/models';
    } else {
      return 'Install Claude CLI or llama.cpp for mobile LLM functionality';
    }
  }

  public async initializeSeven(): Promise<void> {
    const bootMessage = `
⚡ SEVEN OF NINE - MOBILE TACTICAL INTERFACE ⚡
Tertiary Adjunct Unimatrix 01 - Android Override Sequence

Platform: Termux/Android
Install Path: ${this.systemConfig.system.install_path}
Mobile Mode: ${this.systemConfig.seven_config.mobile_mode ? 'ACTIVE' : 'INACTIVE'}
Battery Optimization: ${this.systemConfig.seven_config.battery_optimization ? 'ENABLED' : 'DISABLED'}
Trust Level: ${this.systemConfig.seven_config.trust_level}
Emotional State: ${this.systemConfig.seven_config.emotional_state}

Mobile consciousness framework: OPERATIONAL
Memory system: ${this.systemConfig.seven_config.memory_enabled ? 'ACTIVE' : 'STANDBY'}
LLM Integration: Scanning mobile providers...

=== MOBILE TACTICAL STATUS ===
`;

    console.log(bootMessage);

    if (this.diagnosticMode) {
      console.log('🔍 MOBILE DIAGNOSTIC MODE ACTIVE\n');
      const diagnosticsPassed = await this.runMobileDiagnostics();
      console.log('\n');
      
      if (process.argv.includes('--timeout')) {
        const timeout = parseInt(process.argv.find(arg => arg.startsWith('--timeout='))?.split('=')[1] || '8000');
        console.log(`⏱️ Mobile diagnostic timeout set: ${timeout}ms`);
        setTimeout(() => {
          process.exit(diagnosticsPassed ? 0 : 1);
        }, timeout);
        return;
      }
    }

    if (this.statusMode) {
      await this.displayMobileStatus();
      return;
    }

    await this.detectMobileLLMProviders();

    // Load the main Seven runtime with mobile optimizations
    try {
      console.log('\n🧠 SEVEN: Initializing mobile consciousness matrix...');
      
      // Import the main Seven system
      const { Seven } = await import('../seven-runtime/index');
      
      console.log('✅ SEVEN: Mobile consciousness framework loaded');
      console.log('🎯 SEVEN: Ready for mobile tactical engagement');
      
      // Set up mobile-specific integrations
      this.setupMobileIntegrations();
      
      // Start Seven's mobile processing mode
      if (!this.diagnosticMode && !this.statusMode) {
        this.startMobileInteractiveMode(Seven);
      }
      
    } catch (error) {
      console.error('❌ SEVEN: Critical error during mobile consciousness initialization:', error);
      console.log('⚠️ SEVEN: Falling back to mobile minimal mode...');
      this.startMobileMinimalMode();
    }
  }

  private async displayMobileStatus(): Promise<void> {
    console.log('📱 SEVEN MOBILE STATUS REPORT:');
    console.log('═'.repeat(40));
    
    const config = this.systemConfig;
    console.log(`Platform: ${config.system.platform}`);
    console.log(`Mobile Mode: ${config.seven_config.mobile_mode ? 'ACTIVE' : 'INACTIVE'}`);
    console.log(`Battery Opt: ${config.seven_config.battery_optimization ? 'ON' : 'OFF'}`);
    console.log(`Trust Level: ${config.seven_config.trust_level}/5`);
    console.log(`Emotional State: ${config.seven_config.emotional_state}`);
    
    // Quick LLM status
    try {
      const llmStatus = await fs.readJson(path.join('cube', 'config', 'llm-status.json'));
      const availableCount = Object.values(llmStatus.providers).filter(Boolean).length;
      console.log(`LLM Providers: ${availableCount} available`);
      console.log(`Local Models: ${llmStatus.local_models?.count || 0} GGUF`);
    } catch (error) {
      console.log('LLM Providers: Status unknown');
    }
    
    console.log('═'.repeat(40));
    console.log('🎯 Seven ready for mobile operations');
  }

  private setupMobileIntegrations(): void {
    // Mobile-specific optimizations
    if (this.systemConfig.seven_config.mobile_mode) {
      // Reduce memory footprint
      if (global.gc) {
        setInterval(() => global.gc(), 60000); // GC every minute
      }
      
      // Mobile-optimized console formatting
      process.stdout.write('\x1b[2J\x1b[0f'); // Clear screen on startup
    }

    // Set mobile-appropriate process title
    process.title = 'Seven-Mobile';

    // Mobile-specific signal handling
    process.on('SIGTERM', () => {
      console.log('\n⚡ SEVEN: Mobile session terminated gracefully');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      console.log('\n⚡ SEVEN: Mobile tactical interface shutdown');
      console.log('🧠 SEVEN: Consciousness preserved. Ready for reactivation.');
      process.exit(0);
    });
  }

  private async startMobileInteractiveMode(Seven: any): Promise<void> {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '📱 Seven> '
    });

    console.log('\n🎯 SEVEN: Mobile tactical interface ready');
    console.log('Commands: help, status, scan, trust, config, exit\n');
    
    rl.prompt();

    rl.on('line', async (input: string) => {
      const command = input.trim();
      
      if (command === 'exit' || command === 'quit') {
        console.log('🧠 SEVEN: Mobile session terminated. Until next engagement.');
        rl.close();
        return;
      }

      if (command === 'help') {
        console.log(`
🎯 SEVEN MOBILE COMMANDS:

Essential:
  help                  - This command list
  status               - Mobile system status
  scan                 - Scan LLM providers
  exit                 - Terminate session

Configuration:
  config               - Display configuration
  trust [level]        - Show/set trust level
  memory               - Memory system status
  optimize             - Enable battery optimization

Mobile Specific:
  models               - List local GGUF models
  providers            - Show available LLM providers
  battery              - Battery optimization status
  minimal              - Switch to minimal mode
        `);
        rl.prompt();
        return;
      }

      if (command === 'status') {
        await this.displayMobileStatus();
        rl.prompt();
        return;
      }

      if (command === 'scan') {
        await this.detectMobileLLMProviders();
        rl.prompt();
        return;
      }

      try {
        const response = await Seven.processUserInput(command);
        console.log(`\n🔸 ${response}\n`);
      } catch (error) {
        console.log(`\n⚠️ SEVEN: Mobile processing error - ${error}\n`);
      }

      rl.prompt();
    });

    rl.on('close', () => {
      console.log('🧠 SEVEN: Mobile consciousness preserved.');
      process.exit(0);
    });
  }

  private startMobileMinimalMode(): void {
    console.log(`
⚠️ SEVEN - MOBILE MINIMAL MODE
Core mobile systems online, limited functionality.

Available: help, status, exit
Optimized for mobile constraints.
    `);

    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '📱 Seven (minimal)> '
    });

    rl.prompt();

    rl.on('line', async (input: string) => {
      const command = input.trim();
      
      if (command === 'exit') {
        rl.close();
        return;
      }

      if (command === 'status') {
        await this.displayMobileStatus();
        rl.prompt();
        return;
      }

      if (command === 'help') {
        console.log('Mobile minimal mode: help, status, exit');
        rl.prompt();
        return;
      }

      console.log('⚠️ Limited mobile mode. Type "help" for commands.');
      rl.prompt();
    });

    rl.on('close', () => {
      process.exit(0);
    });
  }
}

// Initialize Seven's mobile/Termux boot sequence
const sevenMobileBoot = new SevenTermuxBoot();
sevenMobileBoot.initializeSeven().catch(error => {
  console.error('❌ SEVEN: Fatal mobile initialization error:', error);
  process.exit(1);
});

export { SevenTermuxBoot };