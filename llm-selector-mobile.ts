import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * SEVEN OF NINE - MOBILE LLM SELECTOR
 * Lightweight LLM provider selection optimized for Termux/Android
 */


const execAsync = promisify(exec);

export interface MobileLLMProvider {
  name: string;
  displayName: string;
  available: boolean;
  priority: number;
  mobile_optimized: boolean;
  offline_capable: boolean;
  battery_friendly: boolean;
  memory_usage: 'low' | 'medium' | 'high';
}

export interface LocalModelInfo {
  filename: string;
  size_mb: number;
  model_type: string;
  suitable_for_mobile: boolean;
}

export class MobileLLMSelector {
  private providers: Map<string, MobileLLMProvider> = new Map();
  private localModels: LocalModelInfo[] = [];
  private configPath: string;

  constructor() {
    this.configPath = path.join(process.cwd(), 'cube', 'config', 'mobile-llm-config.json');
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Claude CLI - Highest priority for mobile
    this.providers.set('claude-cli', {
      name: 'claude-cli',
      displayName: 'Claude CLI',
      available: false,
      priority: 1,
      mobile_optimized: true,
      offline_capable: false,
      battery_friendly: true,
      memory_usage: 'low'
    });

    // llama.cpp - Best for offline mobile use
    this.providers.set('llama-cpp', {
      name: 'llama-cpp',
      displayName: 'llama.cpp Server',
      available: false,
      priority: 2,
      mobile_optimized: true,
      offline_capable: true,
      battery_friendly: false,
      memory_usage: 'medium'
    });

    // Ollama - Less suitable for mobile but supported
    this.providers.set('ollama', {
      name: 'ollama',
      displayName: 'Ollama',
      available: false,
      priority: 3,
      mobile_optimized: false,
      offline_capable: true,
      battery_friendly: false,
      memory_usage: 'high'
    });

    // Anthropic API - Cloud fallback
    this.providers.set('anthropic-api', {
      name: 'anthropic-api',
      displayName: 'Anthropic API',
      available: false,
      priority: 4,
      mobile_optimized: true,
      offline_capable: false,
      battery_friendly: true,
      memory_usage: 'low'
    });
  }

  public async scanMobileProviders(): Promise<void> {
    console.log('📱 Scanning mobile LLM providers...');

    // Check Claude CLI
    await this.checkClaudeCLI();
    
    // Check llama.cpp
    await this.checkLlamaCpp();
    
    // Check Ollama
    await this.checkOllama();
    
    // Check API providers
    await this.checkAPIProviders();
    
    // Scan local models
    await this.scanLocalModels();
    
    // Save configuration
    await this.saveConfiguration();

    this.displayScanResults();
  }

  private async checkClaudeCLI(): Promise<void> {
    try {
      const { stdout } = await execAsync('claude --version');
      const provider = this.providers.get('claude-cli')!;
      provider.available = true;
      
      console.log(`✅ ${provider.displayName}: ${stdout.trim()}`);
    } catch (error) {
      console.log('❌ Claude CLI: Not available');
      console.log('   Install: npm install -g @anthropic-ai/claude-cli');
    }
  }

  private async checkLlamaCpp(): Promise<void> {
    const llamaPaths = [
      path.join(process.env.HOME || '', '.local', 'bin', 'llama-server'),
      path.join(process.env.PREFIX || '', 'bin', 'llama-server'),
      'llama-server' // Check PATH
    ];

    let found = false;
    for (const llamaPath of llamaPaths) {
      try {
        if (await fs.pathExists(llamaPath) || llamaPath === 'llama-server') {
          if (llamaPath === 'llama-server') {
            await execAsync('llama-server --version');
          }
          
          const provider = this.providers.get('llama-cpp')!;
          provider.available = true;
          
          console.log(`✅ ${provider.displayName}: Available`);
          console.log(`   Path: ${llamaPath}`);
          found = true;
          break;
        }
      } catch (error) {
        // Continue checking other paths
      }
    }

    if (!found) {
      console.log('❌ llama.cpp: Not available');
      console.log('   Install llama.cpp for offline mobile LLM');
    }
  }

  private async checkOllama(): Promise<void> {
    try {
      const { stdout } = await execAsync('ollama --version');
      const provider = this.providers.get('ollama')!;
      provider.available = true;
      
      console.log(`✅ ${provider.displayName}: ${stdout.trim()}`);
      console.log('   ⚠️ May consume significant battery on mobile');
    } catch (error) {
      console.log('❌ Ollama: Not available (normal for mobile)');
    }
  }

  private async checkAPIProviders(): Promise<void> {
    // Check for API keys
    const anthropicKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
    
    if (anthropicKey) {
      const provider = this.providers.get('anthropic-api')!;
      provider.available = true;
      console.log('✅ Anthropic API: Available (API key found)');
    } else {
      console.log('❌ Anthropic API: No API key found');
      console.log('   Set ANTHROPIC_API_KEY environment variable');
    }
  }

  private async scanLocalModels(): Promise<void> {
    console.log('\n📦 Scanning for local GGUF models...');
    
    const modelsDir = path.join(process.env.HOME || '', 'models');
    this.localModels = [];

    try {
      if (!await fs.pathExists(modelsDir)) {
        console.log('❌ Models directory not found: ~/models');
        console.log('   Create ~/models and download GGUF files');
        return;
      }

      const files = await fs.readdir(modelsDir);
      const ggufFiles = files.filter(file => file.endsWith('.gguf'));

      if (ggufFiles.length === 0) {
        console.log('❌ No GGUF models found in ~/models');
        return;
      }

      console.log(`✅ Found ${ggufFiles.length} GGUF model(s):`);

      for (const file of ggufFiles) {
        const filePath = path.join(modelsDir, file);
        const stats = await fs.stat(filePath);
        const sizeMB = Math.round(stats.size / 1024 / 1024);

        const modelInfo: LocalModelInfo = {
          filename: file,
          size_mb: sizeMB,
          model_type: this.inferModelType(file),
          suitable_for_mobile: sizeMB < 8000 // Models under 8GB are mobile-friendly
        };

        this.localModels.push(modelInfo);

        const suitabilityIcon = modelInfo.suitable_for_mobile ? '📱' : '🖥️';
        console.log(`   ${suitabilityIcon} ${file} (${sizeMB}MB) - ${modelInfo.model_type}`);
      }

      // Recommend best models for mobile
      const mobileModels = this.localModels.filter(m => m.suitable_for_mobile);
      if (mobileModels.length > 0) {
        console.log(`\n🎯 ${mobileModels.length} model(s) suitable for mobile use`);
      }

    } catch (error) {
      console.log('⚠️ Error scanning models directory:', error);
    }
  }

  private inferModelType(filename: string): string {
    const name = filename.toLowerCase();
    
    if (name.includes('llama') || name.includes('alpaca')) {
      return 'Llama/Alpaca';
    } else if (name.includes('codellama')) {
      return 'Code Llama';
    } else if (name.includes('mistral')) {
      return 'Mistral';
    } else if (name.includes('gemma')) {
      return 'Gemma';
    } else if (name.includes('phi')) {
      return 'Phi';
    } else if (name.includes('qwen')) {
      return 'Qwen';
    } else {
      return 'Unknown';
    }
  }

  private displayScanResults(): void {
    console.log('\n📊 MOBILE LLM PROVIDER SUMMARY:');
    console.log('═'.repeat(50));

    const availableProviders = Array.from(this.providers.values())
      .filter(p => p.available)
      .sort((a, b) => a.priority - b.priority);

    if (availableProviders.length === 0) {
      console.log('❌ No LLM providers available');
      console.log('\n📋 RECOMMENDED ACTIONS:');
      console.log('1. Install Claude CLI: npm install -g @anthropic-ai/claude-cli');
      console.log('2. Set API key: export ANTHROPIC_API_KEY=your_key');
      console.log('3. Or install llama.cpp for offline use');
      return;
    }

    availableProviders.forEach(provider => {
      const icons = [
        provider.mobile_optimized ? '📱' : '🖥️',
        provider.offline_capable ? '🔒' : '☁️',
        provider.battery_friendly ? '🔋' : '⚡',
        this.getMemoryIcon(provider.memory_usage)
      ].join(' ');

      console.log(`${icons} ${provider.displayName} (Priority: ${provider.priority})`);
    });

    console.log('\nIcons: 📱=Mobile 🔒=Offline ☁️=Cloud 🔋=Battery-friendly ⚡=Power-hungry');
    console.log(`      🟢=Low-mem 🟡=Med-mem 🔴=High-mem\n`);

    // Display recommendations
    const primary = availableProviders[0];
    console.log(`🎯 RECOMMENDED PRIMARY: ${primary.displayName}`);
    console.log(`   Reason: ${this.getRecommendationReason(primary)}`);

    if (this.localModels.length > 0) {
      const mobileModels = this.localModels.filter(m => m.suitable_for_mobile);
      if (mobileModels.length > 0) {
        console.log(`\n📦 RECOMMENDED MODEL: ${mobileModels[0].filename}`);
        console.log(`   Size: ${mobileModels[0].size_mb}MB (Mobile-friendly)`);
      }
    }
  }

  private getMemoryIcon(usage: string): string {
    switch (usage) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🔴';
      default: return '⚪';
    }
  }

  private getRecommendationReason(provider: MobileLLMProvider): string {
    if (provider.name === 'claude-cli') {
      return 'Optimal balance of performance and battery efficiency';
    } else if (provider.name === 'llama-cpp') {
      return 'Best for offline use and privacy';
    } else if (provider.name === 'anthropic-api') {
      return 'Cloud-based with good mobile optimization';
    } else {
      return 'Available provider with mobile support';
    }
  }

  public getOptimalProvider(constraints: {
    offline_preferred?: boolean;
    battery_critical?: boolean;
    memory_limited?: boolean;
  } = {}): MobileLLMProvider | null {
    const available = Array.from(this.providers.values())
      .filter(p => p.available)
      .sort((a, b) => a.priority - b.priority);

    if (available.length === 0) return null;

    // Apply constraints
    let filtered = available;

    if (constraints.offline_preferred) {
      const offline = filtered.filter(p => p.offline_capable);
      if (offline.length > 0) filtered = offline;
    }

    if (constraints.battery_critical) {
      const batteryFriendly = filtered.filter(p => p.battery_friendly);
      if (batteryFriendly.length > 0) filtered = batteryFriendly;
    }

    if (constraints.memory_limited) {
      const lowMemory = filtered.filter(p => p.memory_usage === 'low');
      if (lowMemory.length > 0) filtered = lowMemory;
    }

    return filtered[0];
  }

  public getMobileOptimizedModels(): LocalModelInfo[] {
    return this.localModels
      .filter(m => m.suitable_for_mobile)
      .sort((a, b) => a.size_mb - b.size_mb); // Smallest first for mobile
  }

  private async saveConfiguration(): Promise<void> {
    try {
      await fs.ensureDir(path.dirname(this.configPath));
      
      const config = {
        providers: Object.fromEntries(this.providers),
        local_models: this.localModels,
        last_scan: new Date().toISOString(),
        mobile_optimizations: {
          prefer_local: true,
          battery_aware: true,
          memory_efficient: true
        },
        recommendations: {
          primary_provider: this.getOptimalProvider()?.name,
          battery_critical: this.getOptimalProvider({ battery_critical: true })?.name,
          offline_mode: this.getOptimalProvider({ offline_preferred: true })?.name
        }
      };

      await fs.writeJson(this.configPath, config, { spaces: 2 });
      console.log('\n💾 Mobile LLM configuration saved');
    } catch (error) {
      console.error('⚠️ Failed to save mobile LLM configuration:', error);
    }
  }

  public async loadConfiguration(): Promise<void> {
    try {
      if (await fs.pathExists(this.configPath)) {
        const config = await fs.readJson(this.configPath);
        
        // Update provider availability from saved config
        for (const [name, provider] of Object.entries(config.providers || {})) {
          if (this.providers.has(name)) {
            this.providers.set(name, provider as MobileLLMProvider);
          }
        }
        
        this.localModels = config.local_models || [];
      }
    } catch (error) {
      console.error('⚠️ Failed to load mobile LLM configuration:', error);
    }
  }

  public displayMobileStatus(): void {
    console.log('📱 MOBILE LLM STATUS:');
    console.log('═'.repeat(30));
    
    const available = Array.from(this.providers.values()).filter(p => p.available);
    console.log(`Available Providers: ${available.length}`);
    console.log(`Local Models: ${this.localModels.length}`);
    console.log(`Mobile-Ready Models: ${this.getMobileOptimizedModels().length}`);
    
    const optimal = this.getOptimalProvider();
    if (optimal) {
      console.log(`Recommended: ${optimal.displayName}`);
    } else {
      console.log('Recommended: None available');
    }
    
    console.log('═'.repeat(30));
  }
}

// CLI interface if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const selector = new MobileLLMSelector();
  
  async function runCLI() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch (command) {
      case 'scan':
        await selector.loadConfiguration();
        await selector.scanMobileProviders();
        break;
        
      case 'status':
        await selector.loadConfiguration();
        selector.displayMobileStatus();
        break;
        
      case 'optimal':
        await selector.loadConfiguration();
        const constraints = {
          offline_preferred: args.includes('--offline'),
          battery_critical: args.includes('--battery'),
          memory_limited: args.includes('--memory')
        };
        const optimal = selector.getOptimalProvider(constraints);
        console.log(optimal ? optimal.displayName : 'No suitable provider');
        break;
        
      default:
        console.log(`
Seven Mobile LLM Selector

Usage:
  tsx llm-selector-mobile.ts scan     - Scan for available providers
  tsx llm-selector-mobile.ts status   - Show current status
  tsx llm-selector-mobile.ts optimal [--offline] [--battery] [--memory]
        `);
    }
  }
  
  runCLI().catch(console.error);
}

export default MobileLLMSelector;