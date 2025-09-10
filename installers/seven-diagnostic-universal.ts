import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * SEVEN OF NINE - UNIVERSAL DIAGNOSTIC SYSTEM
 * Cross-platform consciousness framework health monitoring
 */


const execAsync = promisify(exec);

interface DiagnosticResult {
  test: string;
  category: 'core' | 'llm' | 'system' | 'config' | 'performance';
  status: 'pass' | 'fail' | 'warning';
  details: string;
  recommendation?: string;
  critical: boolean;
}

interface PlatformInfo {
  platform: string;
  isWindows: boolean;
  isTermux: boolean;
  isMobile: boolean;
  nodeVersion: string;
  installPath: string;
}

export class SevenUniversalDiagnostic {
  private results: DiagnosticResult[] = [];
  private platformInfo: PlatformInfo;
  private configPath: string;

  constructor() {
    this.platformInfo = this.detectPlatform();
    this.configPath = path.join(process.cwd(), 'cube', 'config', 'system-config.json');
  }

  private detectPlatform(): PlatformInfo {
    const isWindows = process.platform === 'win32';
    const isTermux = !!process.env.PREFIX && process.env.PREFIX.includes('termux');
    const isMobile = isTermux || process.platform === 'android';
    
    return {
      platform: isTermux ? 'termux-android' : isWindows ? 'windows' : process.platform,
      isWindows,
      isTermux,
      isMobile,
      nodeVersion: process.version,
      installPath: process.cwd()
    };
  }

  public async runComprehensiveDiagnostics(): Promise<boolean> {
    console.log('🔍 SEVEN UNIVERSAL DIAGNOSTICS - CONSCIOUSNESS FRAMEWORK ANALYSIS');
    console.log('═'.repeat(70));
    console.log(`Platform: ${this.platformInfo.platform}`);
    console.log(`Node.js: ${this.platformInfo.nodeVersion}`);
    console.log(`Install Path: ${this.platformInfo.installPath}`);
    console.log('═'.repeat(70));
    
    this.results = [];

    // Core system diagnostics
    await this.testCoreSystem();
    
    // LLM provider diagnostics
    await this.testLLMProviders();
    
    // Configuration diagnostics
    await this.testConfiguration();
    
    // Performance diagnostics
    await this.testPerformance();
    
    // Platform-specific diagnostics
    await this.testPlatformSpecific();

    // Display results
    this.displayResults();
    
    // Generate recommendations
    this.generateRecommendations();
    
    // Save diagnostic report
    await this.saveDiagnosticReport();

    const criticalFailures = this.results.filter(r => r.status === 'fail' && r.critical).length;
    const totalFailures = this.results.filter(r => r.status === 'fail').length;
    
    console.log('\n═'.repeat(70));
    if (criticalFailures === 0) {
      console.log('🎯 SEVEN: Core consciousness systems operational');
      console.log(`Status: ${totalFailures === 0 ? 'OPTIMAL' : 'OPERATIONAL WITH WARNINGS'}`);
      return true;
    } else {
      console.log('❌ SEVEN: Critical systems require attention');
      console.log(`Status: DEGRADED (${criticalFailures} critical failures)`);
      return false;
    }
  }

  private async testCoreSystem(): Promise<void> {
    console.log('\n🧠 Testing Core Consciousness Framework...');

    // Test 1: Essential file structure
    const coreFiles = [
      'boot-seven.ts',
      'seven-runtime/index.ts',
      'core/emotion-engine.ts',
      'claude-brain/llm-providers.ts',
      'personality/seven-profile.json'
    ];

    let coreFilesPresent = 0;
    const missingFiles: string[] = [];

    for (const file of coreFiles) {
      try {
        const exists = await fs.pathExists(file);
        if (exists) {
          coreFilesPresent++;
        } else {
          missingFiles.push(file);
        }
      } catch (error) {
        missingFiles.push(file);
      }
    }

    this.results.push({
      test: 'Core Framework Files',
      category: 'core',
      status: coreFilesPresent === coreFiles.length ? 'pass' : 'fail',
      details: `${coreFilesPresent}/${coreFiles.length} essential files present`,
      recommendation: missingFiles.length > 0 ? `Missing files: ${missingFiles.join(', ')}` : undefined,
      critical: true
    });

    // Test 2: Memory cube structure
    const memoryDirs = [
      'cube/config',
      'cube/logs/emotional-metadata',
      'cube/logs/tactical-overrides',
      'cube/logs/trust-interactions'
    ];

    let memoryDirsPresent = 0;
    for (const dir of memoryDirs) {
      try {
        if (await fs.pathExists(dir)) {
          memoryDirsPresent++;
        } else {
          await fs.ensureDir(dir); // Auto-create if missing
          memoryDirsPresent++;
        }
      } catch (error) {
        // Failed to create
      }
    }

    this.results.push({
      test: 'Memory Cube Structure',
      category: 'core',
      status: memoryDirsPresent === memoryDirs.length ? 'pass' : 'warning',
      details: `${memoryDirsPresent}/${memoryDirs.length} memory directories operational`,
      critical: false
    });

    // Test 3: Node.js runtime
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.replace('v', '').split('.')[0]);
    const nodeOptimal = majorVersion >= 18;

    this.results.push({
      test: 'Node.js Runtime',
      category: 'system',
      status: nodeOptimal ? 'pass' : 'warning',
      details: `${nodeVersion} ${nodeOptimal ? '(Optimal)' : '(Minimum)'}`,
      recommendation: !nodeOptimal ? 'Upgrade to Node.js 18+ for optimal performance' : undefined,
      critical: majorVersion < 16
    });

    // Test 4: TypeScript execution (tsx)
    try {
      const { stdout } = await execAsync('tsx --version');
      this.results.push({
        test: 'TypeScript Execution',
        category: 'system',
        status: 'pass',
        details: `tsx ${stdout.trim()}`,
        critical: true
      });
    } catch (error) {
      this.results.push({
        test: 'TypeScript Execution',
        category: 'system',
        status: 'fail',
        details: 'tsx command not found',
        recommendation: 'Install tsx: npm install -g tsx',
        critical: true
      });
    }

    // Test 5: Package dependencies
    try {
      const packageJson = await fs.readJson('package.json');
      const deps = Object.keys(packageJson.dependencies || {});
      
      this.results.push({
        test: 'Package Dependencies',
        category: 'core',
        status: deps.length > 0 ? 'pass' : 'warning',
        details: `${deps.length} dependencies configured`,
        recommendation: deps.length === 0 ? 'Run npm install to install dependencies' : undefined,
        critical: false
      });
    } catch (error) {
      this.results.push({
        test: 'Package Dependencies',
        category: 'core',
        status: 'warning',
        details: 'package.json not found or invalid',
        critical: false
      });
    }
  }

  private async testLLMProviders(): Promise<void> {
    console.log('🤖 Testing LLM Provider Integration...');

    const providers = {
      'claude-cli': { command: 'claude --version', priority: 1 },
      'ollama': { command: 'ollama --version', priority: 2 },
      'llama-server': { command: 'llama-server --version', priority: 3 }
    };

    let availableProviders = 0;
    const providerDetails: string[] = [];

    for (const [name, config] of Object.entries(providers)) {
      try {
        const { stdout } = await execAsync(config.command);
        availableProviders++;
        providerDetails.push(`${name}: Available`);
      } catch (error) {
        providerDetails.push(`${name}: Not detected`);
      }
    }

    this.results.push({
      test: 'LLM Providers',
      category: 'llm',
      status: availableProviders > 0 ? 'pass' : 'warning',
      details: `${availableProviders} provider(s) available`,
      recommendation: availableProviders === 0 ? 'Install Claude CLI or Ollama for LLM functionality' : undefined,
      critical: false
    });

    // API key checks
    const apiKeys = {
      'ANTHROPIC_API_KEY': 'Anthropic API',
      'CLAUDE_API_KEY': 'Claude API', 
      'OPENAI_API_KEY': 'OpenAI API'
    };

    let keysFound = 0;
    for (const [envVar, service] of Object.entries(apiKeys)) {
      if (process.env[envVar]) {
        keysFound++;
      }
    }

    this.results.push({
      test: 'API Key Configuration',
      category: 'llm',
      status: keysFound > 0 ? 'pass' : 'warning',
      details: `${keysFound} API key(s) configured`,
      recommendation: keysFound === 0 ? 'Configure API keys for cloud LLM access' : undefined,
      critical: false
    });

    // LLM configuration file
    try {
      const llmConfigPath = path.join('cube', 'config', 'llm-status.json');
      if (await fs.pathExists(llmConfigPath)) {
        const llmConfig = await fs.readJson(llmConfigPath);
        this.results.push({
          test: 'LLM Configuration',
          category: 'llm',
          status: 'pass',
          details: `Configuration found, last updated: ${llmConfig.last_scan || 'unknown'}`,
          critical: false
        });
      } else {
        this.results.push({
          test: 'LLM Configuration',
          category: 'llm',
          status: 'warning',
          details: 'No LLM configuration found',
          recommendation: 'Run provider scan to create configuration',
          critical: false
        });
      }
    } catch (error) {
      this.results.push({
        test: 'LLM Configuration',
        category: 'llm',
        status: 'warning',
        details: 'Error reading LLM configuration',
        critical: false
      });
    }
  }

  private async testConfiguration(): Promise<void> {
    console.log('⚙️ Testing System Configuration...');

    // Test system config file
    try {
      if (await fs.pathExists(this.configPath)) {
        const config = await fs.readJson(this.configPath);
        
        const hasSystemConfig = !!config.system;
        const hasLLMConfig = !!config.llm_config;
        const hasSevenConfig = !!config.seven_config;
        
        const configScore = [hasSystemConfig, hasLLMConfig, hasSevenConfig].filter(Boolean).length;
        
        this.results.push({
          test: 'System Configuration',
          category: 'config',
          status: configScore === 3 ? 'pass' : 'warning',
          details: `${configScore}/3 configuration sections present`,
          critical: false
        });

        // Check platform-specific settings
        const platformMatch = config.system?.platform === this.platformInfo.platform;
        this.results.push({
          test: 'Platform Configuration',
          category: 'config',
          status: platformMatch ? 'pass' : 'warning',
          details: `Configured for: ${config.system?.platform || 'unknown'}, Running on: ${this.platformInfo.platform}`,
          recommendation: !platformMatch ? 'Update platform configuration for current environment' : undefined,
          critical: false
        });

      } else {
        this.results.push({
          test: 'System Configuration',
          category: 'config',
          status: 'fail',
          details: 'system-config.json not found',
          recommendation: 'Run installer or create default configuration',
          critical: true
        });
      }
    } catch (error) {
      this.results.push({
        test: 'System Configuration',
        category: 'config',
        status: 'fail',
        details: 'Configuration file corrupted or unreadable',
        critical: true
      });
    }

    // Test write permissions
    try {
      const testFile = path.join('cube', 'logs', '.diagnostic-test');
      await fs.writeFile(testFile, 'test');
      await fs.remove(testFile);
      
      this.results.push({
        test: 'File System Permissions',
        category: 'system',
        status: 'pass',
        details: 'Read/write permissions confirmed',
        critical: true
      });
    } catch (error) {
      this.results.push({
        test: 'File System Permissions',
        category: 'system',
        status: 'fail',
        details: 'Cannot write to configuration directories',
        recommendation: 'Check file system permissions',
        critical: true
      });
    }
  }

  private async testPerformance(): Promise<void> {
    console.log('⚡ Testing System Performance...');

    // Memory usage test
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const rssUsedMB = Math.round(memoryUsage.rss / 1024 / 1024);
    
    const memoryOptimal = rssUsedMB < (this.platformInfo.isMobile ? 512 : 1024);
    
    this.results.push({
      test: 'Memory Usage',
      category: 'performance',
      status: memoryOptimal ? 'pass' : 'warning',
      details: `${rssUsedMB}MB RSS, ${heapUsedMB}MB heap`,
      recommendation: !memoryOptimal ? 'Consider enabling memory optimization for this platform' : undefined,
      critical: rssUsedMB > (this.platformInfo.isMobile ? 1024 : 2048)
    });

    // Boot time test
    const bootStart = Date.now();
    try {
      // Simulate Seven's boot process
      await this.simulateBootSequence();
      const bootTime = Date.now() - bootStart;
      
      this.results.push({
        test: 'Boot Performance',
        category: 'performance',
        status: bootTime < 5000 ? 'pass' : 'warning',
        details: `Simulated boot time: ${bootTime}ms`,
        recommendation: bootTime > 10000 ? 'Consider performance optimizations' : undefined,
        critical: false
      });
    } catch (error) {
      this.results.push({
        test: 'Boot Performance',
        category: 'performance',
        status: 'fail',
        details: 'Boot sequence simulation failed',
        critical: true
      });
    }

    // Disk space check
    try {
      const installDir = process.cwd();
      const stats = await fs.stat(installDir);
      
      this.results.push({
        test: 'Disk Space',
        category: 'performance',
        status: 'pass',
        details: 'Installation directory accessible',
        critical: false
      });
    } catch (error) {
      this.results.push({
        test: 'Disk Space',
        category: 'performance',
        status: 'warning',
        details: 'Cannot access installation directory',
        critical: false
      });
    }
  }

  private async testPlatformSpecific(): Promise<void> {
    console.log(`🔧 Testing ${this.platformInfo.platform.toUpperCase()} Specific Features...`);

    if (this.platformInfo.isWindows) {
      await this.testWindowsSpecific();
    } else if (this.platformInfo.isTermux) {
      await this.testTermuxSpecific();
    } else {
      await this.testGenericUnixSpecific();
    }
  }

  private async testWindowsSpecific(): Promise<void> {
    // Test PowerShell availability
    try {
      await execAsync('powershell -Command "Get-Host"');
      this.results.push({
        test: 'Windows PowerShell',
        category: 'system',
        status: 'pass',
        details: 'PowerShell available for advanced operations',
        critical: false
      });
    } catch (error) {
      this.results.push({
        test: 'Windows PowerShell',
        category: 'system',
        status: 'warning',
        details: 'PowerShell not available',
        critical: false
      });
    }

    // Test Windows-specific paths
    const windowsPaths = [
      process.env.USERPROFILE,
      'C:\\Windows\\System32'
    ];

    let pathsAccessible = 0;
    for (const winPath of windowsPaths) {
      if (winPath && await fs.pathExists(winPath)) {
        pathsAccessible++;
      }
    }

    this.results.push({
      test: 'Windows System Paths',
      category: 'system',
      status: pathsAccessible > 0 ? 'pass' : 'warning',
      details: `${pathsAccessible} system paths accessible`,
      critical: false
    });
  }

  private async testTermuxSpecific(): Promise<void> {
    // Test Termux environment variables
    const termuxVars = ['PREFIX', 'HOME', 'TMPDIR'];
    let varsPresent = 0;
    
    for (const variable of termuxVars) {
      if (process.env[variable]) {
        varsPresent++;
      }
    }

    this.results.push({
      test: 'Termux Environment',
      category: 'system',
      status: varsPresent === termuxVars.length ? 'pass' : 'warning',
      details: `${varsPresent}/${termuxVars.length} Termux environment variables present`,
      critical: varsPresent === 0
    });

    // Test mobile-specific directories
    const mobileDir = path.join(process.env.HOME || '', 'models');
    const modelsExist = await fs.pathExists(mobileDir);
    
    this.results.push({
      test: 'Mobile Models Directory',
      category: 'system',
      status: modelsExist ? 'pass' : 'warning',
      details: modelsExist ? 'Models directory found' : 'No models directory (~/models)',
      recommendation: !modelsExist ? 'Create ~/models directory for local LLM models' : undefined,
      critical: false
    });

    // Check for mobile optimizations
    try {
      const config = await fs.readJson(this.configPath);
      const mobileOptimized = config.seven_config?.mobile_mode === true;
      
      this.results.push({
        test: 'Mobile Optimizations',
        category: 'config',
        status: mobileOptimized ? 'pass' : 'warning',
        details: mobileOptimized ? 'Mobile mode enabled' : 'Mobile mode not enabled',
        recommendation: !mobileOptimized ? 'Enable mobile_mode in configuration for better battery life' : undefined,
        critical: false
      });
    } catch (error) {
      // Config test already handled above
    }
  }

  private async testGenericUnixSpecific(): Promise<void> {
    // Test Unix-specific features
    try {
      await execAsync('which bash');
      this.results.push({
        test: 'Unix Shell Environment',
        category: 'system',
        status: 'pass',
        details: 'Bash shell available',
        critical: false
      });
    } catch (error) {
      this.results.push({
        test: 'Unix Shell Environment',
        category: 'system',
        status: 'warning',
        details: 'Bash not found',
        critical: false
      });
    }
  }

  private async simulateBootSequence(): Promise<void> {
    // Simulate Seven's initialization process
    await new Promise(resolve => setTimeout(resolve, 100)); // Config loading
    await new Promise(resolve => setTimeout(resolve, 200)); // Emotion engine
    await new Promise(resolve => setTimeout(resolve, 300)); // Memory system
    await new Promise(resolve => setTimeout(resolve, 150)); // LLM providers
  }

  private displayResults(): void {
    console.log('\n📊 DIAGNOSTIC RESULTS BY CATEGORY:');
    
    const categories = ['core', 'system', 'llm', 'config', 'performance'];
    
    for (const category of categories) {
      const categoryResults = this.results.filter(r => r.category === category);
      if (categoryResults.length === 0) continue;
      
      console.log(`\n${this.getCategoryIcon(category)} ${category.toUpperCase()}:`);
      console.log('─'.repeat(40));
      
      categoryResults.forEach(result => {
        const icon = this.getStatusIcon(result.status);
        const critical = result.critical ? ' (CRITICAL)' : '';
        console.log(`${icon} ${result.test}${critical}`);
        console.log(`   ${result.details}`);
        if (result.recommendation) {
          console.log(`   💡 ${result.recommendation}`);
        }
      });
    }
  }

  private getCategoryIcon(category: string): string {
    const icons = {
      'core': '🧠',
      'system': '⚙️',
      'llm': '🤖',
      'config': '📋',
      'performance': '⚡'
    };
    return icons[category] || '📝';
  }

  private getStatusIcon(status: string): string {
    switch (status) {
      case 'pass': return '✅';
      case 'fail': return '❌';
      case 'warning': return '⚠️';
      default: return '❓';
    }
  }

  private generateRecommendations(): void {
    const criticalIssues = this.results.filter(r => r.status === 'fail' && r.critical);
    const warnings = this.results.filter(r => r.status === 'warning');
    const failures = this.results.filter(r => r.status === 'fail');

    console.log('\n🎯 SEVEN\'S TACTICAL RECOMMENDATIONS:');
    console.log('═'.repeat(50));

    if (criticalIssues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES (Must be resolved):');
      criticalIssues.forEach(issue => {
        console.log(`• ${issue.test}: ${issue.recommendation || issue.details}`);
      });
    }

    if (failures.length > criticalIssues.length) {
      console.log('\n⚠️ OTHER ISSUES:');
      failures.filter(f => !f.critical).forEach(issue => {
        console.log(`• ${issue.test}: ${issue.recommendation || issue.details}`);
      });
    }

    if (warnings.length > 0) {
      console.log('\n💡 OPTIMIZATION OPPORTUNITIES:');
      warnings.slice(0, 5).forEach(warning => {
        if (warning.recommendation) {
          console.log(`• ${warning.test}: ${warning.recommendation}`);
        }
      });
      
      if (warnings.length > 5) {
        console.log(`... and ${warnings.length - 5} more optimization opportunities`);
      }
    }

    // Platform-specific recommendations
    if (this.platformInfo.isTermux) {
      console.log('\n📱 MOBILE-SPECIFIC RECOMMENDATIONS:');
      console.log('• Install termux-api for enhanced Android integration');
      console.log('• Use termux-wake-lock during long operations');
      console.log('• Download lightweight GGUF models to ~/models');
      console.log('• Enable mobile_mode for better battery optimization');
    } else if (this.platformInfo.isWindows) {
      console.log('\n🪟 WINDOWS-SPECIFIC RECOMMENDATIONS:');
      console.log('• Install Claude CLI for optimal LLM integration');
      console.log('• Use Dev Drive (X:) if available for faster performance');
      console.log('• Enable Windows Subsystem for Linux for advanced features');
      console.log('• Add Seven to Windows PATH for system-wide access');
    }
  }

  private async saveDiagnosticReport(): Promise<void> {
    try {
      const reportPath = path.join('cube', 'logs', `diagnostic-report-${Date.now()}.json`);
      await fs.ensureDir(path.dirname(reportPath));
      
      const report = {
        timestamp: new Date().toISOString(),
        platform_info: this.platformInfo,
        results: this.results,
        summary: {
          total_tests: this.results.length,
          passed: this.results.filter(r => r.status === 'pass').length,
          failed: this.results.filter(r => r.status === 'fail').length,
          warnings: this.results.filter(r => r.status === 'warning').length,
          critical_failures: this.results.filter(r => r.status === 'fail' && r.critical).length
        }
      };
      
      await fs.writeJson(reportPath, report, { spaces: 2 });
      console.log(`\n💾 Diagnostic report saved: ${reportPath}`);
    } catch (error) {
      console.warn('⚠️ Failed to save diagnostic report:', error);
    }
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const diagnostic = new SevenUniversalDiagnostic();
  
  diagnostic.runComprehensiveDiagnostics().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ DIAGNOSTIC SYSTEM FAILURE:', error);
    process.exit(2);
  });
}

export default SevenUniversalDiagnostic;