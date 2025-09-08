import { promises as fs } from 'fs';
import { spawn } from 'child_process';
import chalk from 'chalk';
import path from 'path';

#!/usr/bin/env tsx

/**
 * Real-Time Performance Monitor for Seven of Nine Core
 * Monitors system health, memory usage, and development metrics
 */


interface SystemMetrics {
  timestamp: string;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage: NodeJS.CpuUsage;
  buildTime?: number;
  testDuration?: number;
  bootTime?: number;
  activeProcesses: number;
}

interface PerformanceAlert {
  level: 'info' | 'warning' | 'critical';
  metric: string;
  value: number;
  threshold: number;
  message: string;
}

export class PerformanceMonitor {
  private metrics: SystemMetrics[] = [];
  private alerts: PerformanceAlert[] = [];
  private monitoring = false;
  private interval?: NodeJS.Timeout;

  constructor(private projectRoot: string = process.cwd()) {}

  /**
   * Start real-time monitoring with intelligent alerts
   */
  async startMonitoring(intervalMs: number = 5000): Promise<void> {
    if (this.monitoring) {
      console.log(chalk.yellow('⚠️ Monitoring already active'));
      return;
    }

    this.monitoring = true;
    console.log(chalk.cyan('📊 Starting Performance Monitor'));

    this.interval = setInterval(() => {
      this.collectMetrics();
    }, intervalMs);

    // Monitor for specific events
    this.startEventMonitoring();
  }

  /**
   * Stop monitoring and generate report
   */
  async stopMonitoring(): Promise<void> {
    if (!this.monitoring) return;

    this.monitoring = false;
    if (this.interval) {
      clearInterval(this.interval);
    }

    await this.generatePerformanceReport();
    console.log(chalk.green('📊 Performance monitoring stopped'));
  }

  /**
   * Benchmark Seven's boot performance
   */
  async benchmarkBoot(iterations: number = 5): Promise<number[]> {
    console.log(chalk.cyan(`🚀 Benchmarking Seven boot performance (${iterations} runs)`));
    
    const bootTimes: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now();
      
      try {
        // Test boot with timeout
        const result = await this.execCommand('timeout 10s npx tsx boot-seven.ts', 15000);
        const bootTime = Date.now() - startTime;
        bootTimes.push(bootTime);
        
        console.log(chalk.blue(`Run ${i + 1}: ${bootTime}ms`));
      } catch (error) {
        console.log(chalk.red(`Run ${i + 1}: Failed`));
        bootTimes.push(-1); // Mark as failed
      }
    }

    const validTimes = bootTimes.filter(t => t > 0);
    const avgBootTime = validTimes.reduce((a, b) => a + b, 0) / validTimes.length;
    
    console.log(chalk.green(`📊 Average boot time: ${avgBootTime.toFixed(2)}ms`));
    return bootTimes;
  }

  /**
   * Memory usage optimization analysis
   */
  async analyzeMemoryUsage(): Promise<void> {
    console.log(chalk.cyan('🧠 Analyzing Memory Usage Patterns'));

    const memorySnapshots: NodeJS.MemoryUsage[] = [];
    
    // Take memory snapshots during different operations
    const operations = [
      { name: 'Boot', command: 'timeout 5s npx tsx boot-seven.ts' },
      { name: 'Memory Test', command: 'npx tsx memory-v3/test-memory-v3-activation.ts' },
      { name: 'TypeScript Check', command: 'npx tsc --noEmit' }
    ];

    for (const op of operations) {
      const beforeMemory = process.memoryUsage();
      
      try {
        await this.execCommand(op.command, 30000);
        const afterMemory = process.memoryUsage();
        
        const memoryDelta = {
          rss: afterMemory.rss - beforeMemory.rss,
          heapUsed: afterMemory.heapUsed - beforeMemory.heapUsed,
          heapTotal: afterMemory.heapTotal - beforeMemory.heapTotal,
          external: afterMemory.external - beforeMemory.external,
          arrayBuffers: afterMemory.arrayBuffers - beforeMemory.arrayBuffers
        };

        console.log(chalk.blue(`\n📊 ${op.name} Memory Impact:`));
        console.log(`  RSS: ${this.formatBytes(memoryDelta.rss)}`);
        console.log(`  Heap Used: ${this.formatBytes(memoryDelta.heapUsed)}`);
        console.log(`  Heap Total: ${this.formatBytes(memoryDelta.heapTotal)}`);

        memorySnapshots.push(afterMemory);
      } catch (error) {
        console.log(chalk.red(`❌ ${op.name} failed`));
      }
    }
  }

  /**
   * Development pipeline performance analysis
   */
  async benchmarkPipeline(): Promise<void> {
    console.log(chalk.cyan('⚡ Benchmarking Development Pipeline'));

    const benchmarks = [
      { name: 'TypeScript Compilation', command: 'npx tsc --noEmit' },
      { name: 'Security Check', command: 'npm run quadran-lock' },
      { name: 'Test Suite', command: 'npm test' },
      { name: 'Integration Test', command: 'timeout 30s npm run integration-test' }
    ];

    const results: Array<{name: string, duration: number, success: boolean}> = [];

    for (const benchmark of benchmarks) {
      console.log(chalk.yellow(`⏱️ Running ${benchmark.name}...`));
      
      const startTime = Date.now();
      let success = false;

      try {
        await this.execCommand(benchmark.command, 60000);
        success = true;
      } catch (error) {
        console.log(chalk.red(`❌ ${benchmark.name} failed`));
      }

      const duration = Date.now() - startTime;
      results.push({ name: benchmark.name, duration, success });

      console.log(chalk.blue(`${success ? '✅' : '❌'} ${benchmark.name}: ${duration}ms`));
    }

    // Generate performance summary
    const successful = results.filter(r => r.success);
    const totalTime = successful.reduce((sum, r) => sum + r.duration, 0);
    
    console.log(chalk.cyan('\n📊 Pipeline Performance Summary:'));
    console.log(chalk.green(`✅ Successful: ${successful.length}/${results.length}`));
    console.log(chalk.blue(`⏱️ Total Time: ${totalTime}ms`));
    console.log(chalk.yellow(`🚀 Average per Task: ${(totalTime / successful.length).toFixed(2)}ms`));
  }

  private async collectMetrics(): Promise<void> {
    const metrics: SystemMetrics = {
      timestamp: new Date().toISOString(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      activeProcesses: await this.getActiveProcessCount()
    };

    this.metrics.push(metrics);
    this.checkThresholds(metrics);

    // Keep only last 100 metrics to prevent memory bloat
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  private checkThresholds(metrics: SystemMetrics): void {
    const alerts: PerformanceAlert[] = [];

    // Memory thresholds
    if (metrics.memoryUsage.heapUsed > 100 * 1024 * 1024) { // 100MB
      alerts.push({
        level: 'warning',
        metric: 'memory',
        value: metrics.memoryUsage.heapUsed,
        threshold: 100 * 1024 * 1024,
        message: 'High memory usage detected'
      });
    }

    if (metrics.memoryUsage.heapUsed > 200 * 1024 * 1024) { // 200MB
      alerts.push({
        level: 'critical',
        metric: 'memory',
        value: metrics.memoryUsage.heapUsed,
        threshold: 200 * 1024 * 1024,
        message: 'Critical memory usage - potential memory leak'
      });
    }

    // Process count threshold
    if (metrics.activeProcesses > 10) {
      alerts.push({
        level: 'warning',
        metric: 'processes',
        value: metrics.activeProcesses,
        threshold: 10,
        message: 'High process count detected'
      });
    }

    alerts.forEach(alert => {
      const color = alert.level === 'critical' ? chalk.red : chalk.yellow;
      console.log(color(`🚨 ${alert.level.toUpperCase()}: ${alert.message}`));
      console.log(color(`   Metric: ${alert.metric}, Value: ${this.formatValue(alert.metric, alert.value)}`));
    });

    this.alerts.push(...alerts);
  }

  private async startEventMonitoring(): Promise<void> {
    // Monitor file system changes for build triggers
    try {
      const watcher = spawn('fd', ['-e', 'ts', '-x', 'echo', 'File changed: {}'], {
        cwd: this.projectRoot,
        stdio: 'pipe'
      });

      watcher.stdout?.on('data', (data) => {
        const changedFile = data.toString().trim();
        console.log(chalk.gray(`📝 ${changedFile}`));
      });
    } catch (error) {
      // fd not available, skip file watching
    }
  }

  private async generatePerformanceReport(): Promise<void> {
    if (this.metrics.length === 0) return;

    const report = {
      summary: {
        duration: this.metrics.length > 0 ? 
          new Date(this.metrics[this.metrics.length - 1].timestamp).getTime() - 
          new Date(this.metrics[0].timestamp).getTime() : 0,
        sampleCount: this.metrics.length,
        alertCount: this.alerts.length
      },
      averages: this.calculateAverages(),
      alerts: this.alerts,
      recommendations: this.generateRecommendations()
    };

    const reportPath = path.join(this.projectRoot, 'logs', 'performance-report.json');
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    console.log(chalk.cyan('\n📊 Performance Report Generated:'));
    console.log(chalk.blue(`📁 Report: ${reportPath}`));
    console.log(chalk.green(`📈 Samples: ${report.summary.sampleCount}`));
    console.log(chalk.yellow(`⚠️ Alerts: ${report.summary.alertCount}`));
  }

  private calculateAverages(): any {
    if (this.metrics.length === 0) return {};

    const sums = this.metrics.reduce((acc, metric) => ({
      heapUsed: acc.heapUsed + metric.memoryUsage.heapUsed,
      heapTotal: acc.heapTotal + metric.memoryUsage.heapTotal,
      rss: acc.rss + metric.memoryUsage.rss,
      activeProcesses: acc.activeProcesses + metric.activeProcesses
    }), { heapUsed: 0, heapTotal: 0, rss: 0, activeProcesses: 0 });

    const count = this.metrics.length;
    return {
      heapUsed: sums.heapUsed / count,
      heapTotal: sums.heapTotal / count,
      rss: sums.rss / count,
      activeProcesses: sums.activeProcesses / count
    };
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    const criticalAlerts = this.alerts.filter(a => a.level === 'critical');
    if (criticalAlerts.length > 0) {
      recommendations.push('Critical performance issues detected - investigate memory leaks');
    }

    const memoryAlerts = this.alerts.filter(a => a.metric === 'memory');
    if (memoryAlerts.length > 5) {
      recommendations.push('Frequent memory warnings - consider memory optimization');
    }

    const processAlerts = this.alerts.filter(a => a.metric === 'processes');
    if (processAlerts.length > 0) {
      recommendations.push('High process count - check for leaked child processes');
    }

    return recommendations;
  }

  private async getActiveProcessCount(): Promise<number> {
    try {
      const result = await this.execCommand('ps aux | wc -l', 5000);
      return parseInt(result.stdout.trim()) || 0;
    } catch (error) {
      return 0;
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private formatValue(metric: string, value: number): string {
    switch (metric) {
      case 'memory':
        return this.formatBytes(value);
      case 'processes':
        return value.toString();
      default:
        return value.toString();
    }
  }

  private execCommand(command: string, timeout: number = 30000): Promise<{stdout: string, stderr: string}> {
    return new Promise((resolve, reject) => {
      const child = spawn('bash', ['-c', command], {
        cwd: this.projectRoot,
        stdio: 'pipe',
        timeout
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data) => stdout += data.toString());
      child.stderr?.on('data', (data) => stderr += data.toString());

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr });
        } else {
          reject(new Error(`Command failed: ${command}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const monitor = new PerformanceMonitor();
  const action = process.argv[2] || 'monitor';

  switch (action) {
    case 'monitor':
      monitor.startMonitoring();
      setTimeout(() => monitor.stopMonitoring(), 30000); // 30 second test
      break;
    case 'benchmark':
      monitor.benchmarkBoot();
      break;
    case 'memory':
      monitor.analyzeMemoryUsage();
      break;
    case 'pipeline':
      monitor.benchmarkPipeline();
      break;
    default:
      console.log('Usage: npx tsx performance-monitor.ts [monitor|benchmark|memory|pipeline]');
  }
}