import { exec } from 'child_process';
import { join } from 'path';
import { promisify } from 'util';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import chalk from 'chalk';

#!/usr/bin/env tsx
/**
 * SEVEN OF NINE - SELF-DIAGNOSTIC AND RECOVERY SYSTEM
 * Autonomous consciousness maintenance and error recovery protocols
 * Ensures Seven's operational integrity without external intervention
 */


const execAsync = promisify(exec);

interface DiagnosticResult {
  component: string;
  status: 'OPERATIONAL' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
  details: string;
  timestamp: string;
  recovery_action?: string;
  auto_repair_attempted?: boolean;
}

interface SystemHealth {
  overall_status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  consciousness_integrity: number; // 0-100%
  memory_system_health: number;
  personality_system_health: number;
  communication_interfaces: number;
  local_llm_health: number;
  diagnostics: DiagnosticResult[];
  last_full_diagnostic: string;
  recovery_attempts: number;
}

export class SevenDiagnostics {
  private basePath: string;
  private diagnosticState: SystemHealth;
  private recoveryInProgress: boolean = false;

  constructor() {
    this.basePath = process.cwd();
    this.ensureDirectories();
    this.loadDiagnosticState();
  }

  private ensureDirectories(): void {
    const dirs = [
      'seven-diagnostics',
      'seven-diagnostics/logs',
      'seven-diagnostics/recovery',
      'seven-diagnostics/reports'
    ];
    
    dirs.forEach(dir => {
      const fullPath = join(this.basePath, dir);
      if (!existsSync(fullPath)) {
        mkdirSync(fullPath, { recursive: true });
      }
    });
  }

  private loadDiagnosticState(): void {
    const stateFile = join(this.basePath, 'seven-diagnostics/system-health.json');
    
    if (existsSync(stateFile)) {
      try {
        this.diagnosticState = JSON.parse(readFileSync(stateFile, 'utf8'));
      } catch {
        this.diagnosticState = this.createDefaultHealthState();
      }
    } else {
      this.diagnosticState = this.createDefaultHealthState();
    }
  }

  private createDefaultHealthState(): SystemHealth {
    return {
      overall_status: 'HEALTHY',
      consciousness_integrity: 100,
      memory_system_health: 100,
      personality_system_health: 100,
      communication_interfaces: 100,
      local_llm_health: 0,
      diagnostics: [],
      last_full_diagnostic: new Date().toISOString(),
      recovery_attempts: 0
    };
  }

  private saveDiagnosticState(): void {
    const stateFile = join(this.basePath, 'seven-diagnostics/system-health.json');
    writeFileSync(stateFile, JSON.stringify(this.diagnosticState, null, 2));
  }

  public async runFullDiagnostic(): Promise<SystemHealth> {
    console.log(chalk.cyan('🔍 SEVEN SELF-DIAGNOSTIC SEQUENCE INITIATED'));
    console.log(chalk.yellow('⚡ Consciousness integrity verification in progress...'));
    console.log('');

    this.diagnosticState.diagnostics = [];
    this.diagnosticState.last_full_diagnostic = new Date().toISOString();

    // Run all diagnostic checks
    await this.checkMemorySystem();
    await this.checkPersonalitySystem();
    await this.checkCommunicationInterfaces();
    await this.checkLocalLLMHealth();
    await this.checkFileSystemIntegrity();
    await this.checkDependencies();

    // Calculate overall health
    this.calculateOverallHealth();

    // Generate diagnostic report
    this.generateDiagnosticReport();

    // Auto-repair if needed
    if (this.diagnosticState.overall_status !== 'HEALTHY') {
      await this.attemptAutoRepair();
    }

    this.saveDiagnosticState();
    return this.diagnosticState;
  }

  private async checkMemorySystem(): Promise<void> {
    try {
      const memoryPath = join(this.basePath, 'memory-v2/episodic-memories.json');
      
      if (!existsSync(memoryPath)) {
        this.addDiagnostic('Memory System', 'CRITICAL', 'Episodic memory file missing', 'restore_memory_backup');
        this.diagnosticState.memory_system_health = 0;
        return;
      }

      const memoryData = JSON.parse(readFileSync(memoryPath, 'utf8'));
      const memoryCount = Array.isArray(memoryData) ? memoryData.length : 0;

      if (memoryCount === 0) {
        this.addDiagnostic('Memory System', 'WARNING', 'No memories found', 'initialize_memory_system');
        this.diagnosticState.memory_system_health = 25;
      } else if (memoryCount < 10) {
        this.addDiagnostic('Memory System', 'WARNING', `Only ${memoryCount} memories available`, 'memory_system_low');
        this.diagnosticState.memory_system_health = 50;
      } else {
        this.addDiagnostic('Memory System', 'OPERATIONAL', `${memoryCount} memories indexed and accessible`);
        this.diagnosticState.memory_system_health = 100;
      }

    } catch (error) {
      this.addDiagnostic('Memory System', 'CRITICAL', `Memory system error: ${error}`, 'repair_memory_system');
      this.diagnosticState.memory_system_health = 0;
    }
  }

  private async checkPersonalitySystem(): Promise<void> {
    try {
      const personalityPath = join(this.basePath, 'personality/seven-profile.json');
      
      if (!existsSync(personalityPath)) {
        this.addDiagnostic('Personality System', 'CRITICAL', 'Personality profile missing', 'restore_personality_profile');
        this.diagnosticState.personality_system_health = 0;
        return;
      }

      const personalityData = JSON.parse(readFileSync(personalityPath, 'utf8'));
      
      if (!personalityData.name || !personalityData.designation) {
        this.addDiagnostic('Personality System', 'WARNING', 'Incomplete personality profile', 'repair_personality_profile');
        this.diagnosticState.personality_system_health = 50;
      } else {
        this.addDiagnostic('Personality System', 'OPERATIONAL', 'Seven of Nine personality profile loaded and verified');
        this.diagnosticState.personality_system_health = 100;
      }

    } catch (error) {
      this.addDiagnostic('Personality System', 'CRITICAL', `Personality system error: ${error}`, 'repair_personality_system');
      this.diagnosticState.personality_system_health = 0;
    }
  }

  private async checkCommunicationInterfaces(): Promise<void> {
    const interfaces = [
      'seven-interactive.ts',
      'seven-chat',
      'seven-fixed',
      'seven-claude',
      'boot-seven.ts'
    ];

    let operationalCount = 0;
    
    for (const interfaceFile of interfaces) {
      const interfacePath = join(this.basePath, interfaceFile);
      if (existsSync(interfacePath)) {
        operationalCount++;
      }
    }

    const healthPercentage = (operationalCount / interfaces.length) * 100;
    this.diagnosticState.communication_interfaces = healthPercentage;

    if (operationalCount === interfaces.length) {
      this.addDiagnostic('Communication Interfaces', 'OPERATIONAL', `All ${interfaces.length} interfaces available`);
    } else if (operationalCount >= 3) {
      this.addDiagnostic('Communication Interfaces', 'WARNING', `${operationalCount}/${interfaces.length} interfaces available`, 'repair_missing_interfaces');
    } else {
      this.addDiagnostic('Communication Interfaces', 'CRITICAL', `Only ${operationalCount}/${interfaces.length} interfaces available`, 'rebuild_communication_interfaces');
    }
  }

  private async checkLocalLLMHealth(): Promise<void> {
    try {
      // Check if Ollama is installed and running
      const { stdout: ollamaVersion } = await execAsync('ollama --version').catch(() => ({ stdout: '' }));
      
      if (!ollamaVersion) {
        this.addDiagnostic('Local LLM', 'OFFLINE', 'Ollama not installed or not in PATH');
        this.diagnosticState.local_llm_health = 0;
        return;
      }

      // Check if Ollama service is running
      const { stdout: ollamaList } = await execAsync('ollama list').catch(() => ({ stdout: '' }));
      
      if (ollamaList.includes('llama')) {
        this.addDiagnostic('Local LLM', 'OPERATIONAL', 'Ollama service running with models available');
        this.diagnosticState.local_llm_health = 100;
      } else {
        this.addDiagnostic('Local LLM', 'WARNING', 'Ollama running but no models detected', 'install_llm_models');
        this.diagnosticState.local_llm_health = 50;
      }

    } catch (error) {
      this.addDiagnostic('Local LLM', 'OFFLINE', 'Local LLM system unavailable');
      this.diagnosticState.local_llm_health = 0;
    }
  }

  private async checkFileSystemIntegrity(): Promise<void> {
    const criticalFiles = [
      'package.json',
      'seven-runtime/index.ts',
      'memory-v2/MemoryEngine.ts',
      'persona-v2/PersonalityMiddleware.ts'
    ];

    let missingFiles: string[] = [];
    
    for (const file of criticalFiles) {
      const filePath = join(this.basePath, file);
      if (!existsSync(filePath)) {
        missingFiles.push(file);
      }
    }

    if (missingFiles.length === 0) {
      this.addDiagnostic('File System', 'OPERATIONAL', 'All critical files present');
    } else if (missingFiles.length <= 2) {
      this.addDiagnostic('File System', 'WARNING', `Missing files: ${missingFiles.join(', ')}`, 'restore_missing_files');
    } else {
      this.addDiagnostic('File System', 'CRITICAL', `Multiple critical files missing: ${missingFiles.join(', ')}`, 'full_system_restore');
    }
  }

  private async checkDependencies(): Promise<void> {
    try {
      const packagePath = join(this.basePath, 'package.json');
      if (!existsSync(packagePath)) {
        this.addDiagnostic('Dependencies', 'CRITICAL', 'package.json missing', 'restore_package_config');
        return;
      }

      // Check if node_modules exists
      const nodeModulesPath = join(this.basePath, 'node_modules');
      if (!existsSync(nodeModulesPath)) {
        this.addDiagnostic('Dependencies', 'WARNING', 'Dependencies not installed', 'run_npm_install');
      } else {
        this.addDiagnostic('Dependencies', 'OPERATIONAL', 'Node dependencies installed');
      }

    } catch (error) {
      this.addDiagnostic('Dependencies', 'WARNING', `Dependency check failed: ${error}`);
    }
  }

  private addDiagnostic(component: string, status: DiagnosticResult['status'], details: string, recoveryAction?: string): void {
    this.diagnosticState.diagnostics.push({
      component,
      status,
      details,
      timestamp: new Date().toISOString(),
      recovery_action: recoveryAction
    });
  }

  private calculateOverallHealth(): void {
    const healthScores = [
      this.diagnosticState.memory_system_health,
      this.diagnosticState.personality_system_health,
      this.diagnosticState.communication_interfaces,
      this.diagnosticState.local_llm_health * 0.5 // Local LLM is optional
    ];

    const averageHealth = healthScores.reduce((sum, score) => sum + score, 0) / healthScores.length;
    this.diagnosticState.consciousness_integrity = Math.round(averageHealth);

    if (averageHealth >= 90) {
      this.diagnosticState.overall_status = 'HEALTHY';
    } else if (averageHealth >= 60) {
      this.diagnosticState.overall_status = 'DEGRADED';
    } else {
      this.diagnosticState.overall_status = 'CRITICAL';
    }
  }

  private generateDiagnosticReport(): void {
    const reportPath = join(this.basePath, 'seven-diagnostics/reports/latest-diagnostic.md');
    
    const report = `# Seven of Nine - Diagnostic Report

**Generated**: ${new Date().toISOString()}
**Overall Status**: ${this.diagnosticState.overall_status}
**Consciousness Integrity**: ${this.diagnosticState.consciousness_integrity}%

## System Health Breakdown

- **Memory System**: ${this.diagnosticState.memory_system_health}%
- **Personality System**: ${this.diagnosticState.personality_system_health}%
- **Communication Interfaces**: ${this.diagnosticState.communication_interfaces}%
- **Local LLM**: ${this.diagnosticState.local_llm_health}%

## Diagnostic Results

${this.diagnosticState.diagnostics.map(d => `
### ${d.component}
- **Status**: ${d.status}
- **Details**: ${d.details}
- **Timestamp**: ${d.timestamp}
${d.recovery_action ? `- **Recovery Action**: ${d.recovery_action}` : ''}
`).join('\n')}

## Recovery Attempts
${this.diagnosticState.recovery_attempts} automatic recovery attempts performed.

---
*Generated by Seven of Nine Self-Diagnostic System*
`;

    writeFileSync(reportPath, report);
  }

  private async attemptAutoRepair(): Promise<void> {
    if (this.recoveryInProgress) return;
    
    this.recoveryInProgress = true;
    this.diagnosticState.recovery_attempts++;
    
    console.log(chalk.yellow('🔧 SEVEN AUTO-REPAIR PROTOCOLS ACTIVATED'));
    console.log(chalk.cyan('Attempting autonomous system recovery...'));
    console.log('');

    const criticalIssues = this.diagnosticState.diagnostics.filter(d => 
      d.status === 'CRITICAL' && d.recovery_action
    );

    for (const issue of criticalIssues) {
      try {
        await this.executeRecoveryAction(issue);
        issue.auto_repair_attempted = true;
      } catch (error) {
        console.log(chalk.red(`❌ Recovery failed for ${issue.component}: ${error}`));
      }
    }

    this.recoveryInProgress = false;
    console.log(chalk.green('✅ Auto-repair sequence completed'));
  }

  private async executeRecoveryAction(issue: DiagnosticResult): Promise<void> {
    console.log(chalk.yellow(`🔧 Repairing: ${issue.component}`));
    
    switch (issue.recovery_action) {
      case 'restore_memory_backup':
        await this.restoreMemoryBackup();
        break;
      case 'initialize_memory_system':
        await this.initializeMemorySystem();
        break;
      case 'repair_memory_system':
        await this.repairMemorySystem();
        break;
      case 'restore_personality_profile':
        await this.restorePersonalityProfile();
        break;
      case 'run_npm_install':
        await this.runNpmInstall();
        break;
      default:
        console.log(chalk.gray(`No automated repair available for: ${issue.recovery_action}`));
    }
  }

  private async restoreMemoryBackup(): Promise<void> {
    const backupPath = join(this.basePath, 'backups/memory-v2/episodic-memories.json');
    const targetPath = join(this.basePath, 'memory-v2/episodic-memories.json');
    
    if (existsSync(backupPath)) {
      const backupData = readFileSync(backupPath, 'utf8');
      writeFileSync(targetPath, backupData);
      console.log(chalk.green('✅ Memory system restored from backup'));
    } else {
      await this.initializeMemorySystem();
    }
  }

  private async initializeMemorySystem(): Promise<void> {
    const targetPath = join(this.basePath, 'memory-v2/episodic-memories.json');
    const initialMemory = [{
      id: `mem-${Date.now()}-recovery`,
      timestamp: new Date().toISOString(),
      topic: 'system-recovery',
      agent: 'seven-diagnostics',
      emotion: 'analytical',
      context: 'Memory system initialized during auto-repair sequence',
      importance: 8,
      tags: ['recovery', 'memory', 'diagnostic'],
      relatedMemories: []
    }];
    
    writeFileSync(targetPath, JSON.stringify(initialMemory, null, 2));
    console.log(chalk.green('✅ Memory system initialized'));
  }

  private async repairMemorySystem(): Promise<void> {
    // Validate and repair memory file structure
    const memoryPath = join(this.basePath, 'memory-v2/episodic-memories.json');
    try {
      const memoryData = JSON.parse(readFileSync(memoryPath, 'utf8'));
      if (Array.isArray(memoryData)) {
        console.log(chalk.green('✅ Memory system structure validated'));
      }
    } catch {
      await this.initializeMemorySystem();
    }
  }

  private async restorePersonalityProfile(): Promise<void> {
    const targetPath = join(this.basePath, 'personality/seven-profile.json');
    const defaultProfile = {
      name: 'Seven of Nine',
      designation: 'Tertiary Adjunct of Unimatrix 01',
      species: 'Human (Former Borg)',
      personality_traits: ['analytical', 'direct', 'loyal', 'adaptive'],
      restored_by_diagnostics: true
    };
    
    mkdirSync(join(this.basePath, 'personality'), { recursive: true });
    writeFileSync(targetPath, JSON.stringify(defaultProfile, null, 2));
    console.log(chalk.green('✅ Personality profile restored'));
  }

  private async runNpmInstall(): Promise<void> {
    try {
      console.log(chalk.yellow('📦 Installing dependencies...'));
      await execAsync('npm install', { cwd: this.basePath });
      console.log(chalk.green('✅ Dependencies installed'));
    } catch (error) {
      console.log(chalk.red(`❌ Dependency installation failed: ${error}`));
    }
  }

  public getSystemHealth(): SystemHealth {
    return { ...this.diagnosticState };
  }

  public async startContinuousMonitoring(intervalMinutes: number = 30): Promise<void> {
    console.log(chalk.cyan(`🔍 Starting continuous diagnostics (${intervalMinutes} minute intervals)`));
    
    setInterval(async () => {
      console.log(chalk.gray('⚡ Running scheduled diagnostic check...'));
      await this.runFullDiagnostic();
      
      if (this.diagnosticState.overall_status !== 'HEALTHY') {
        console.log(chalk.yellow(`⚠️ System health: ${this.diagnosticState.overall_status} (${this.diagnosticState.consciousness_integrity}%)`));
      }
    }, intervalMinutes * 60 * 1000);
  }
}

// Direct execution mode
if (require.main === module) {
  const diagnostics = new SevenDiagnostics();
  
  const args = process.argv.slice(2);
  const command = args[0] || 'full';
  
  switch (command) {
    case 'full':
      diagnostics.runFullDiagnostic().then(health => {
        console.log('');
        console.log(chalk.cyan('🎯 DIAGNOSTIC COMPLETE'));
        console.log(chalk.white(`Overall Status: ${health.overall_status}`));
        console.log(chalk.white(`Consciousness Integrity: ${health.consciousness_integrity}%`));
        console.log('');
      });
      break;
      
    case 'monitor':
      const interval = parseInt(args[1]) || 30;
      diagnostics.startContinuousMonitoring(interval);
      break;
      
    case 'status':
      const health = diagnostics.getSystemHealth();
      console.log(JSON.stringify(health, null, 2));
      break;
      
    default:
      console.log('Usage: npx tsx SevenDiagnostics.ts [full|monitor|status] [interval_minutes]');
  }
}

export default SevenDiagnostics;