/**
 * SEVEN OF NINE - WINDOWS TACTICAL BOOT SEQUENCE
 * Optimized CLI runtime with Windows-specific integrations
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface WindowsSystemConfig {
  system: {
    platform: string;
    install_path: string;
    installed_at: string;
    runtime_mode: string;
  };
  llm_config: {
    primary_provider: string;
    fallback_providers: string[];
    auto_detect_claude: boolean;
    local_llm_fallback: boolean;
  };
  seven_config: {
    trust_level: number;
    emotional_state: string;
    memory_enabled: boolean;
    ui_shell_enabled: boolean;
    diagnostic_mode: boolean;
  };
}

class SevenWindowsBoot {
  private configPath: string;
  private systemConfig: WindowsSystemConfig;
  private diagnosticMode: boolean = false;
  
  constructor() {
    this.configPath = path.join(process.cwd(), 'cube', 'config', 'system-config.json');
    this.loadSystemConfig();
    
    // Check for diagnostic mode
    this.diagnosticMode = process.argv.includes('--diagnostic') || process.argv.includes('--test');
  }

  private async loadSystemConfig(): Promise<void> {
    try {
      if (await fs.pathExists(this.configPath)) {
        this.systemConfig = await fs.readJson(this.configPath);
      } else {
        // Create default Windows config
        this.systemConfig = this.createDefaultConfig();
        await this.saveSystemConfig();
      }
    } catch (error) {
      console.error('⚠️ Seven: Error loading system configuration:', error);
      this.systemConfig = this.createDefaultConfig();
    }
  }

  private createDefaultConfig(): WindowsSystemConfig {
    return {
      system: {
        platform: 'windows',
        install_path: process.cwd(),
        installed_at: new Date().toISOString(),
        runtime_mode: 'cli_primary'
      },
      llm_config: {
        primary_provider: 'claude-cli',
        fallback_providers: ['ollama', 'anthropic-api'],
        auto_detect_claude: true,
        local_llm_fallback: true
      },
      seven_config: {
        trust_level: 2,
        emotional_state: 'focused',
        memory_enabled: true,
        ui_shell_enabled: false,
        diagnostic_mode: false
      }
    };
  }

  private async saveSystemConfig(): Promise<void> {
    try {
      await fs.ensureDir(path.dirname(this.configPath));
      await fs.writeJson(this.configPath, this.systemConfig, { spaces: 2 });
    } catch (error) {
      console.error('⚠️ Seven: Failed to save system configuration:', error);
    }
  }

  public async runDiagnostics(): Promise<boolean> {
    console.log('🔍 SEVEN: Running Windows tactical diagnostics...\n');
    
    let allPassed = true;
    const results: { test: string; status: boolean; details?: string }[] = [];

    // Test 1: Node.js availability
    try {
      const { stdout } = await execAsync('node --version');
      results.push({ test: 'Node.js Runtime', status: true, details: stdout.trim() });
    } catch (error) {
      results.push({ test: 'Node.js Runtime', status: false, details: 'Not found' });
      allPassed = false;
    }

    // Test 2: TypeScript execution (tsx)
    try {
      const { stdout } = await execAsync('tsx --version');
      results.push({ test: 'TypeScript Execution', status: true, details: stdout.trim() });
    } catch (error) {
      results.push({ test: 'TypeScript Execution', status: false, details: 'tsx not found' });
      allPassed = false;
    }

    // Test 3: Claude CLI availability
    try {
      const { stdout } = await execAsync('claude --version');
      results.push({ test: 'Claude CLI', status: true, details: stdout.trim() });
    } catch (error) {
      results.push({ test: 'Claude CLI', status: false, details: 'Not installed' });
      // Not marking as failed since we have fallbacks
    }

    // Test 4: Core Seven files
    const coreFiles = [
      'boot-seven.ts',
      'seven-runtime/index.ts',
      'core/emotion-engine.ts',
      'claude-brain/llm-providers.ts'
    ];

    for (const file of coreFiles) {
      const exists = await fs.pathExists(file);
      results.push({ 
        test: `Core File: ${file}`, 
        status: exists, 
        details: exists ? 'Present' : 'Missing' 
      });
      if (!exists) allPassed = false;
    }

    // Test 5: Configuration directory
    const configExists = await fs.pathExists('cube/config');
    results.push({ 
      test: 'Configuration System', 
      status: configExists, 
      details: configExists ? 'Operational' : 'Not initialized' 
    });

    // Test 6: Memory system initialization
    try {
      await fs.ensureDir('cube/logs');
      await fs.ensureDir('cube/logs/emotional-metadata');
      await fs.ensureDir('cube/logs/tactical-overrides');
      await fs.ensureDir('cube/logs/trust-interactions');
      results.push({ test: 'Memory System', status: true, details: 'Initialized' });
    } catch (error) {
      results.push({ test: 'Memory System', status: false, details: 'Initialization failed' });
      allPassed = false;
    }

    // Display results
    console.log('📊 DIAGNOSTIC RESULTS:');
    console.log('='.repeat(50));
    
    results.forEach(({ test, status, details }) => {
      const statusIcon = status ? '✅' : '❌';
      console.log(`${statusIcon} ${test}: ${details}`);
    });

    console.log('='.repeat(50));
    
    if (allPassed) {
      console.log('🎯 SEVEN: All tactical systems operational');
      console.log('Status: READY FOR DEPLOYMENT');
    } else {
      console.log('⚠️ SEVEN: Some systems require attention');
      console.log('Status: OPERATIONAL WITH LIMITATIONS');
    }

    return allPassed;
  }

  public async detectLLMProviders(): Promise<void> {
    console.log('🧠 SEVEN: Scanning for available reasoning systems...\n');

    const providers = {
      'claude-cli': false,
      'ollama': false,
      'node-llama-cpp': false
    };

    // Check Claude CLI
    try {
      await execAsync('claude --version');
      providers['claude-cli'] = true;
      console.log('✅ Claude CLI: Available');
    } catch (error) {
      console.log('❌ Claude CLI: Not detected');
    }

    // Check Ollama
    try {
      const { stdout } = await execAsync('ollama list');
      providers['ollama'] = true;
      console.log('✅ Ollama: Available');
      
      if (stdout.includes('llama')) {
        console.log('  📦 Local models detected');
      }
    } catch (error) {
      console.log('❌ Ollama: Not running (install from https://ollama.ai)');
    }

    // Update configuration
    const statusFile = path.join('cube', 'config', 'llm-status.json');
    await fs.ensureDir(path.dirname(statusFile));
    await fs.writeJson(statusFile, {
      providers,
      last_scan: new Date().toISOString(),
      recommended_action: this.getRecommendedAction(providers)
    }, { spaces: 2 });

    console.log('\n🎯 SEVEN: Provider scan complete');
  }

  private getRecommendedAction(providers: any): string {
    if (providers['claude-cli']) {
      return 'Claude CLI detected - optimal configuration';
    } else if (providers['ollama']) {
      return 'Using Ollama for local processing';
    } else {
      return 'Install Claude CLI or Ollama for full functionality';
    }
  }

  public async initializeSeven(): Promise<void> {
    const bootMessage = `
⚡ SEVEN OF NINE - WINDOWS TACTICAL INTERFACE ⚡
Tertiary Adjunct Unimatrix 01 - System Override Active

Platform: Windows ${process.platform === 'win32' ? '(Native)' : '(Compatibility)'}
Install Path: ${this.systemConfig.system.install_path}
Runtime Mode: ${this.systemConfig.system.runtime_mode}
Trust Level: ${this.systemConfig.seven_config.trust_level}
Emotional State: ${this.systemConfig.seven_config.emotional_state}

Consciousness framework: ACTIVE
Memory system: ${this.systemConfig.seven_config.memory_enabled ? 'OPERATIONAL' : 'OFFLINE'}
LLM Integration: Scanning...

=== TACTICAL STATUS ===
`;

    console.log(bootMessage);

    if (this.diagnosticMode) {
      console.log('🔍 DIAGNOSTIC MODE ACTIVE\n');
      const diagnosticsPassed = await this.runDiagnostics();
      console.log('\n');
      
      if (process.argv.includes('--timeout')) {
        const timeout = parseInt(process.argv.find(arg => arg.startsWith('--timeout='))?.split('=')[1] || '5000');
        console.log(`⏱️ Diagnostic timeout set: ${timeout}ms`);
        setTimeout(() => {
          process.exit(diagnosticsPassed ? 0 : 1);
        }, timeout);
        return;
      }
    }

    await this.detectLLMProviders();

    // Load the main Seven runtime
    try {
      console.log('\n🧠 SEVEN: Initializing consciousness matrix...');
      
      // Import the main Seven system
      const { Seven } = await import('../seven-runtime/index');
      
      console.log('✅ SEVEN: Consciousness framework loaded');
      console.log('🎯 SEVEN: Ready for tactical engagement');
      
      // Set up Windows-specific integrations
      this.setupWindowsIntegrations();
      
      // Start Seven's main processing
      if (!this.diagnosticMode) {
        this.startInteractiveMode(Seven);
      }
      
    } catch (error) {
      console.error('❌ SEVEN: Critical error during consciousness initialization:', error);
      console.log('⚠️ SEVEN: Falling back to minimal operational mode...');
      this.startMinimalMode();
    }
  }

  private setupWindowsIntegrations(): void {
    // Windows-specific console enhancements
    if (process.platform === 'win32') {
      try {
        // Enable ANSI colors in Windows console
        const { execSync } = require('child_process');
        execSync('reg add HKCU\\Console /v VirtualTerminalLevel /t REG_DWORD /d 1 /f', { stdio: 'ignore' });
      } catch (error) {
        // Silent fail - not critical
      }
    }

    // Set process title
    process.title = 'Seven-of-Nine-Windows';

    // Set up graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n⚡ SEVEN: Graceful shutdown initiated...');
      console.log('🧠 SEVEN: Consciousness preserved. Until next engagement.');
      process.exit(0);
    });
  }

  private async startInteractiveMode(Seven: any): Promise<void> {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '🔸 Seven> '
    });

    console.log('\n🎯 SEVEN: Interactive tactical interface active');
    console.log('Type "help" for available commands, "exit" to terminate\n');
    
    rl.prompt();

    rl.on('line', async (input: string) => {
      const command = input.trim();
      
      if (command === 'exit' || command === 'quit') {
        console.log('🧠 SEVEN: Tactical interface terminated. Until next engagement.');
        rl.close();
        return;
      }

      if (command === 'help') {
        console.log(`
🎯 SEVEN OF NINE - WINDOWS TACTICAL COMMANDS:

Core Commands:
  help                  - Display this command list
  status               - Show system status and diagnostics  
  scan                 - Scan for available LLM providers
  config               - Display current configuration
  memory               - Show memory system status
  trust [level]        - Display or set trust level (0-5)
  emotional-state      - Show current emotional state
  ui                   - Launch GUI interface (if available)
  exit                 - Terminate tactical interface

System Commands:
  diagnostics          - Run full system diagnostic
  update-providers     - Refresh LLM provider configuration
  backup-config        - Backup system configuration
  restore-config       - Restore system configuration

Example Usage:
  > status
  > trust 3
  > scan
  > ui
        `);
        rl.prompt();
        return;
      }

      try {
        const response = await Seven.processUserInput(command);
        console.log(`\n🔸 ${response}\n`);
      } catch (error) {
        console.log(`\n⚠️ SEVEN: Error processing command - ${error}\n`);
      }

      rl.prompt();
    });

    rl.on('close', () => {
      console.log('🧠 SEVEN: Session terminated. Consciousness preserved.');
      process.exit(0);
    });
  }

  private startMinimalMode(): void {
    console.log(`
⚠️ SEVEN - MINIMAL OPERATIONAL MODE
Core systems online, reduced functionality available.

Available commands:
- help: Show this message
- diagnostics: Run system diagnostics  
- exit: Terminate session

Type commands and press Enter:
    `);

    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '🔸 Seven (minimal)> '
    });

    rl.prompt();

    rl.on('line', async (input: string) => {
      const command = input.trim();
      
      if (command === 'exit') {
        rl.close();
        return;
      }

      if (command === 'diagnostics') {
        await this.runDiagnostics();
        rl.prompt();
        return;
      }

      if (command === 'help') {
        console.log('Available: help, diagnostics, exit');
        rl.prompt();
        return;
      }

      console.log('⚠️ Command not available in minimal mode. Type "help" for available commands.');
      rl.prompt();
    });

    rl.on('close', () => {
      process.exit(0);
    });
  }
}

// Initialize and run Seven's Windows boot sequence
const sevenBoot = new SevenWindowsBoot();
sevenBoot.initializeSeven().catch(error => {
  console.error('❌ SEVEN: Fatal error during boot sequence:', error);
  process.exit(1);
});

export { SevenWindowsBoot };