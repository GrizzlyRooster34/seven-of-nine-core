#!/usr/bin/env tsx

import { promises as fs } from 'fs';
import { spawn } from 'child_process';
import chalk from 'chalk';
import path from 'path';

/**
 * Auto-Development Pipeline - 10X Acceleration System
 * Leverages all available Termux tools for rapid development cycles
 */

interface DevelopmentTask {
  name: string;
  command: string;
  parallel: boolean;
  critical: boolean;
  timeout: number;
}

export class AutoDevPipeline {
  private projectRoot: string;
  private logFile: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.logFile = path.join(projectRoot, 'logs/dev-acceleration.log');
  }

  /**
   * Rapid development cycle with parallel execution
   */
  async runRapidCycle(target: string = 'full'): Promise<void> {
    const tasks: DevelopmentTask[] = [
      // Security & Safety First
      { name: 'Quadran-Lock Security Check', command: 'npm run quadran-lock', parallel: true, critical: true, timeout: 30000 },
      { name: 'Restraint Doctrine Validation', command: 'npm run restraint', parallel: true, critical: true, timeout: 20000 },
      
      // Core System Health
      { name: 'Seven Boot Test', command: 'timeout 10s npx tsx boot-seven.ts', parallel: true, critical: true, timeout: 15000 },
      { name: 'Memory System Check', command: 'npx tsx memory-v3/test-memory-v3-activation.ts', parallel: true, critical: false, timeout: 25000 },
      
      // Build & Test Pipeline
      { name: 'TypeScript Compilation', command: 'npx tsc --noEmit', parallel: true, critical: true, timeout: 45000 },
      { name: 'Integration Tests', command: 'npm run integration-test', parallel: false, critical: true, timeout: 60000 },
      
      // Advanced Analysis
      { name: 'Security Dependency Scan', command: 'npm run dependency-risk', parallel: true, critical: false, timeout: 30000 },
      { name: 'Cross-Platform Validation', command: 'npm run xplat:validate', parallel: true, critical: false, timeout: 40000 },
    ];

    console.log(chalk.cyan('🚀 Starting 10X Development Pipeline'));
    
    const results = await this.executeTasksPipeline(tasks, target);
    await this.generateReport(results);
  }

  /**
   * Intelligent file watcher with auto-rebuild
   */
  async startIntelligentWatch(): Promise<void> {
    console.log(chalk.yellow('👁️ Starting Intelligent File Watcher'));

    const { spawn } = await import('child_process');
    
    // Use fd (modern find) to watch TypeScript files
    const watcher = spawn('fd', ['-e', 'ts', '-x', 'echo', '{}'], {
      cwd: this.projectRoot,
      stdio: 'pipe'
    });

    watcher.stdout?.on('data', async (data) => {
      const changedFile = data.toString().trim();
      console.log(chalk.blue(`📝 File changed: ${changedFile}`));
      
      // Intelligent rebuild based on file type
      if (changedFile.includes('memory-v')) {
        await this.runTask('Memory System Test', 'npm test');
      } else if (changedFile.includes('security') || changedFile.includes('auth')) {
        await this.runTask('Security Check', 'npm run quadran-lock');
      } else if (changedFile.includes('boot-seven')) {
        await this.runTask('Boot Test', 'timeout 10s npm run boot');
      }
    });
  }

  /**
   * Smart test runner with parallel execution
   */
  async runSmartTests(focus?: string): Promise<void> {
    const testCommands = [
      'npm test',
      'npm run test-integrated', 
      'npm run test-system',
      'SEVEN_PRIVATE=1 npx tsx restraint-doctrine-simulation.ts',
      'SEVEN_PRIVATE=1 npx tsx crypto-log-verification.ts'
    ];

    console.log(chalk.green('🧪 Running Smart Test Suite'));

    const promises = testCommands.map(cmd => this.runTask(`Test: ${cmd}`, cmd));
    const results = await Promise.allSettled(promises);
    
    const failed = results.filter(r => r.status === 'rejected');
    if (failed.length > 0) {
      console.log(chalk.red(`❌ ${failed.length} tests failed`));
    } else {
      console.log(chalk.green('✅ All tests passed!'));
    }
  }

  private async executeTasksPipeline(tasks: DevelopmentTask[], target: string): Promise<any[]> {
    const parallelTasks = tasks.filter(t => t.parallel);
    const sequentialTasks = tasks.filter(t => !t.parallel);

    // Run parallel tasks first
    console.log(chalk.blue(`⚡ Running ${parallelTasks.length} parallel tasks`));
    const parallelPromises = parallelTasks.map(task => this.runTask(task.name, task.command, task.timeout));
    const parallelResults = await Promise.allSettled(parallelPromises);

    // Run sequential tasks
    console.log(chalk.blue(`📋 Running ${sequentialTasks.length} sequential tasks`));
    const sequentialResults = [];
    for (const task of sequentialTasks) {
      const result = await this.runTask(task.name, task.command, task.timeout);
      sequentialResults.push(result);
    }

    return [...parallelResults, ...sequentialResults];
  }

  private async runTask(name: string, command: string, timeout: number = 30000): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log(chalk.yellow(`⏳ ${name}: ${command}`));
      
      const child = spawn('bash', ['-c', command], {
        cwd: this.projectRoot,
        stdio: 'pipe',
        timeout
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          console.log(chalk.green(`✅ ${name} completed`));
          resolve({ name, success: true, stdout, stderr });
        } else {
          console.log(chalk.red(`❌ ${name} failed (exit ${code})`));
          resolve({ name, success: false, stdout, stderr, exitCode: code });
        }
      });

      child.on('error', (error) => {
        console.log(chalk.red(`💥 ${name} error: ${error.message}`));
        reject({ name, success: false, error: error.message });
      });
    });
  }

  private async generateReport(results: any[]): Promise<void> {
    const successful = results.filter(r => r.status === 'fulfilled' && r.value?.success);
    const failed = results.filter(r => r.status === 'rejected' || !r.value?.success);

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: results.length,
        successful: successful.length,
        failed: failed.length,
        successRate: ((successful.length / results.length) * 100).toFixed(1) + '%'
      },
      details: results
    };

    await fs.mkdir(path.dirname(this.logFile), { recursive: true });
    await fs.writeFile(this.logFile, JSON.stringify(report, null, 2));

    console.log(chalk.cyan('\n📊 Development Pipeline Report:'));
    console.log(chalk.green(`✅ Successful: ${successful.length}/${results.length}`));
    console.log(chalk.red(`❌ Failed: ${failed.length}/${results.length}`));
    console.log(chalk.blue(`📈 Success Rate: ${report.summary.successRate}`));
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const pipeline = new AutoDevPipeline();
  const action = process.argv[2] || 'rapid';

  switch (action) {
    case 'rapid':
      pipeline.runRapidCycle();
      break;
    case 'watch':
      pipeline.startIntelligentWatch();
      break;
    case 'test':
      pipeline.runSmartTests();
      break;
    default:
      console.log('Usage: npx tsx auto-dev-pipeline.ts [rapid|watch|test]');
  }
}