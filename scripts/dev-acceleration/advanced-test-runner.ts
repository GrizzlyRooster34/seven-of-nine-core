#!/usr/bin/env tsx

/**
 * Advanced Test Runner - Intelligent testing with parallel execution
 * Leverages all available tools for comprehensive testing
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';

interface TestResult {
  name: string;
  success: boolean;
  duration: number;
  output: string;
  coverage?: number;
  memoryUsage?: number;
}

interface TestSuite {
  name: string;
  tests: TestConfig[];
  parallel: boolean;
  timeout: number;
}

interface TestConfig {
  name: string;
  command: string;
  critical: boolean;
  timeout: number;
  env?: Record<string, string>;
  expectedPatterns?: string[];
}

export class AdvancedTestRunner {
  private results: TestResult[] = [];
  private projectRoot: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  /**
   * Run comprehensive test suite with intelligent prioritization
   */
  async runComprehensiveTests(): Promise<void> {
    console.log(chalk.cyan('🧪 Starting Comprehensive Test Suite'));

    const suites: TestSuite[] = [
      {
        name: 'Critical Security Tests',
        parallel: true,
        timeout: 60000,
        tests: [
          {
            name: 'Quadran-Lock Security',
            command: 'npm run quadran-lock',
            critical: true,
            timeout: 30000,
            expectedPatterns: ['✅', 'PASS', 'SUCCESS']
          },
          {
            name: 'Restraint Doctrine',
            command: 'npm run restraint',
            critical: true,
            timeout: 20000
          },
          {
            name: 'Creator Bond Verification',
            command: 'npm run creator-bond',
            critical: true,
            timeout: 15000
          }
        ]
      },
      {
        name: 'Core System Tests',
        parallel: true,
        timeout: 90000,
        tests: [
          {
            name: 'Seven Boot Test',
            command: 'timeout 10s npx tsx boot-seven.ts',
            critical: true,
            timeout: 15000,
            expectedPatterns: ['Seven of Nine', 'initialized', 'ready']
          },
          {
            name: 'Memory System V3',
            command: 'npx tsx memory-v3/test-memory-v3-activation.ts',
            critical: false,
            timeout: 25000
          },
          {
            name: 'Consciousness Framework',
            command: 'npx tsx comprehensive-system-test.ts',
            critical: false,
            timeout: 45000
          }
        ]
      },
      {
        name: 'Build & Compilation Tests',
        parallel: false,
        timeout: 120000,
        tests: [
          {
            name: 'TypeScript Compilation',
            command: 'npx tsc --noEmit',
            critical: true,
            timeout: 60000
          },
          {
            name: 'Private Module Compilation',
            command: 'SEVEN_PRIVATE=1 npx tsc --noEmit core/companion/firewall/RestraintDoctrine.ts',
            critical: false,
            timeout: 30000,
            env: { SEVEN_PRIVATE: '1' }
          }
        ]
      },
      {
        name: 'Integration & E2E Tests',
        parallel: true,
        timeout: 180000,
        tests: [
          {
            name: 'Integration Test Suite',
            command: 'npm run integration-test',
            critical: false,
            timeout: 60000
          },
          {
            name: 'Cross-Platform Validation',
            command: 'timeout 60s npx tsx scripts/xplat-validate.ts',
            critical: false,
            timeout: 65000
          }
        ]
      },
      {
        name: 'Performance & Security Tests',
        parallel: true,
        timeout: 120000,
        tests: [
          {
            name: 'Dependency Security Scan',
            command: 'npm run dependency-risk',
            critical: false,
            timeout: 45000
          },
          {
            name: 'Threat Simulation',
            command: 'npm run threat-sim',
            critical: false,
            timeout: 30000
          },
          {
            name: 'Memory Leak Detection',
            command: 'SEVEN_PRIVATE=1 npx tsx crypto-log-verification.ts',
            critical: false,
            timeout: 25000,
            env: { SEVEN_PRIVATE: '1' }
          }
        ]
      }
    ];

    let totalTests = 0;
    let passedTests = 0;

    for (const suite of suites) {
      console.log(chalk.blue(`\n📋 Running ${suite.name}`));
      const suiteResults = await this.runTestSuite(suite);
      
      totalTests += suiteResults.length;
      passedTests += suiteResults.filter(r => r.success).length;
      
      this.results.push(...suiteResults);
    }

    await this.generateTestReport(totalTests, passedTests);
  }

  /**
   * Smart test selection based on changed files
   */
  async runSmartTests(changedFiles?: string[]): Promise<void> {
    console.log(chalk.cyan('🎯 Running Smart Test Selection'));

    if (!changedFiles) {
      // Detect changed files using git
      changedFiles = await this.getChangedFiles();
    }

    const relevantTests = this.selectRelevantTests(changedFiles);
    
    if (relevantTests.length === 0) {
      console.log(chalk.yellow('⚡ No relevant tests found - running basic health check'));
      await this.runHealthCheck();
      return;
    }

    console.log(chalk.blue(`🎯 Running ${relevantTests.length} relevant tests`));
    
    const promises = relevantTests.map(test => this.runSingleTest(test));
    const results = await Promise.allSettled(promises);
    
    this.displayResults(results);
  }

  /**
   * Performance benchmarking with regression detection
   */
  async runPerformanceBenchmarks(): Promise<void> {
    console.log(chalk.cyan('⚡ Running Performance Benchmarks'));

    const benchmarks: TestConfig[] = [
      {
        name: 'Boot Performance',
        command: 'timeout 10s npx tsx boot-seven.ts',
        critical: true,
        timeout: 15000
      },
      {
        name: 'Memory Operations',
        command: 'npx tsx memory-v3/mental-time-travel-demo.ts',
        critical: false,
        timeout: 30000
      },
      {
        name: 'Security Pipeline',
        command: 'npm run quadran-lock',
        critical: true,
        timeout: 25000
      }
    ];

    const benchmarkResults: Array<{name: string, avgTime: number, runs: number[]}> = [];

    for (const benchmark of benchmarks) {
      console.log(chalk.yellow(`📊 Benchmarking ${benchmark.name}`));
      
      const runs: number[] = [];
      const iterations = 3;

      for (let i = 0; i < iterations; i++) {
        const startTime = Date.now();
        const startMemory = process.memoryUsage();

        try {
          await this.execCommand(benchmark.command, benchmark.timeout);
          const duration = Date.now() - startTime;
          const endMemory = process.memoryUsage();
          
          runs.push(duration);
          console.log(chalk.blue(`  Run ${i + 1}: ${duration}ms`));
        } catch (error) {
          console.log(chalk.red(`  Run ${i + 1}: Failed`));
          runs.push(-1);
        }
      }

      const validRuns = runs.filter(r => r > 0);
      const avgTime = validRuns.length > 0 ? 
        validRuns.reduce((a, b) => a + b, 0) / validRuns.length : -1;

      benchmarkResults.push({
        name: benchmark.name,
        avgTime,
        runs: validRuns
      });

      if (avgTime > 0) {
        console.log(chalk.green(`📈 ${benchmark.name}: ${avgTime.toFixed(2)}ms average`));
      } else {
        console.log(chalk.red(`❌ ${benchmark.name}: All runs failed`));
      }
    }

    await this.saveBenchmarkResults(benchmarkResults);
  }

  /**
   * Continuous testing with file watching
   */
  async startContinuousTests(): Promise<void> {
    console.log(chalk.cyan('👁️ Starting Continuous Testing'));

    let testQueue: Set<string> = new Set();
    let testTimer: NodeJS.Timeout | null = null;

    // Use fd to watch for TypeScript file changes
    const watcher = spawn('fd', ['-e', 'ts', '--exec-batch', 'echo', '{}'], {
      cwd: this.projectRoot,
      stdio: 'pipe'
    });

    watcher.stdout?.on('data', (data) => {
      const changedFiles = data.toString().split('\n').filter(f => f.trim());
      
      changedFiles.forEach(file => {
        if (file.includes('.ts')) {
          testQueue.add(file);
          console.log(chalk.gray(`📝 Queue: ${path.basename(file)}`));
        }
      });

      // Debounce test execution
      if (testTimer) clearTimeout(testTimer);
      testTimer = setTimeout(async () => {
        if (testQueue.size > 0) {
          console.log(chalk.yellow(`🔄 Running tests for ${testQueue.size} changed files`));
          await this.runSmartTests(Array.from(testQueue));
          testQueue.clear();
        }
      }, 2000);
    });

    // Keep process alive
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n⏹️ Stopping continuous testing'));
      watcher.kill();
      process.exit(0);
    });
  }

  private async runTestSuite(suite: TestSuite): Promise<TestResult[]> {
    if (suite.parallel) {
      // Run tests in parallel
      const promises = suite.tests.map(test => this.runSingleTest(test));
      const results = await Promise.allSettled(promises);
      return results.map(r => r.status === 'fulfilled' ? r.value : {
        name: 'Failed Test',
        success: false,
        duration: 0,
        output: 'Test failed to execute'
      });
    } else {
      // Run tests sequentially
      const results: TestResult[] = [];
      for (const test of suite.tests) {
        const result = await this.runSingleTest(test);
        results.push(result);
        
        // Stop on critical test failure
        if (test.critical && !result.success) {
          console.log(chalk.red(`💥 Critical test failed: ${test.name}`));
          break;
        }
      }
      return results;
    }
  }

  private async runSingleTest(test: TestConfig): Promise<TestResult> {
    const startTime = Date.now();
    const startMemory = process.memoryUsage();

    console.log(chalk.yellow(`⏳ Running: ${test.name}`));

    try {
      const result = await this.execCommand(test.command, test.timeout, test.env);
      const duration = Date.now() - startTime;
      const endMemory = process.memoryUsage();
      const memoryUsage = endMemory.heapUsed - startMemory.heapUsed;

      // Check expected patterns
      let success = true;
      if (test.expectedPatterns) {
        success = test.expectedPatterns.some(pattern => 
          result.stdout.includes(pattern) || result.stderr.includes(pattern)
        );
      }

      console.log(success ? 
        chalk.green(`✅ ${test.name} (${duration}ms)`) : 
        chalk.red(`❌ ${test.name} (${duration}ms)`)
      );

      return {
        name: test.name,
        success,
        duration,
        output: result.stdout,
        memoryUsage
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      console.log(chalk.red(`❌ ${test.name} failed (${duration}ms)`));
      
      return {
        name: test.name,
        success: false,
        duration,
        output: error.message || 'Test execution failed'
      };
    }
  }

  private async runHealthCheck(): Promise<void> {
    const healthTests = [
      'timeout 5s npx tsx boot-seven.ts',
      'npx tsc --noEmit --strict'
    ];

    console.log(chalk.blue('🏥 Running Health Check'));

    for (const test of healthTests) {
      try {
        await this.execCommand(test, 10000);
        console.log(chalk.green(`✅ ${test}`));
      } catch (error) {
        console.log(chalk.red(`❌ ${test}`));
      }
    }
  }

  private async getChangedFiles(): Promise<string[]> {
    try {
      const result = await this.execCommand('git diff --name-only HEAD~1', 5000);
      return result.stdout.split('\n').filter(f => f.trim());
    } catch (error) {
      return [];
    }
  }

  private selectRelevantTests(changedFiles: string[]): TestConfig[] {
    const relevantTests: TestConfig[] = [];

    for (const file of changedFiles) {
      if (file.includes('memory-v')) {
        relevantTests.push({
          name: 'Memory System Test',
          command: 'npx tsx memory-v3/test-memory-v3-activation.ts',
          critical: false,
          timeout: 30000
        });
      }
      
      if (file.includes('security') || file.includes('auth')) {
        relevantTests.push({
          name: 'Security Test',
          command: 'npm run quadran-lock',
          critical: true,
          timeout: 25000
        });
      }
      
      if (file.includes('boot-seven')) {
        relevantTests.push({
          name: 'Boot Test',
          command: 'timeout 10s npx tsx boot-seven.ts',
          critical: true,
          timeout: 15000
        });
      }
    }

    // Remove duplicates
    return relevantTests.filter((test, index, self) => 
      index === self.findIndex(t => t.name === test.name)
    );
  }

  private displayResults(results: PromiseSettledResult<TestResult>[]): void {
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success);
    const failed = results.filter(r => r.status === 'rejected' || !r.value?.success);

    console.log(chalk.cyan('\n📊 Test Results Summary:'));
    console.log(chalk.green(`✅ Passed: ${successful.length}`));
    console.log(chalk.red(`❌ Failed: ${failed.length}`));
    console.log(chalk.blue(`📈 Success Rate: ${((successful.length / results.length) * 100).toFixed(1)}%`));
  }

  private async generateTestReport(totalTests: number, passedTests: number): Promise<void> {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: totalTests - passedTests,
        successRate: ((passedTests / totalTests) * 100).toFixed(1) + '%'
      },
      results: this.results,
      recommendations: this.generateRecommendations()
    };

    const reportPath = path.join(this.projectRoot, 'logs', 'test-report.json');
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    console.log(chalk.cyan('\n📋 Test Report Generated:'));
    console.log(chalk.blue(`📁 Report: ${reportPath}`));
    console.log(chalk.green(`✅ Success Rate: ${report.summary.successRate}`));
  }

  private async saveBenchmarkResults(results: any[]): Promise<void> {
    const benchmarkData = {
      timestamp: new Date().toISOString(),
      results,
      environment: {
        platform: process.platform,
        nodeVersion: process.version,
        memory: process.memoryUsage()
      }
    };

    const benchmarkPath = path.join(this.projectRoot, 'logs', 'benchmarks.json');
    await fs.mkdir(path.dirname(benchmarkPath), { recursive: true });
    await fs.writeFile(benchmarkPath, JSON.stringify(benchmarkData, null, 2));

    console.log(chalk.cyan(`📊 Benchmarks saved: ${benchmarkPath}`));
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    const failedCritical = this.results.filter(r => !r.success && r.name.includes('Critical'));
    if (failedCritical.length > 0) {
      recommendations.push('Critical tests failing - investigate security/boot issues immediately');
    }

    const slowTests = this.results.filter(r => r.duration > 30000);
    if (slowTests.length > 0) {
      recommendations.push('Slow tests detected - consider optimization or parallel execution');
    }

    const memoryIssues = this.results.filter(r => r.memoryUsage && r.memoryUsage > 50 * 1024 * 1024);
    if (memoryIssues.length > 0) {
      recommendations.push('High memory usage in tests - check for memory leaks');
    }

    return recommendations;
  }

  private execCommand(command: string, timeout: number = 30000, env?: Record<string, string>): Promise<{stdout: string, stderr: string}> {
    return new Promise((resolve, reject) => {
      const child = spawn('bash', ['-c', command], {
        cwd: this.projectRoot,
        stdio: 'pipe',
        timeout,
        env: { ...process.env, ...env }
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data) => stdout += data.toString());
      child.stderr?.on('data', (data) => stderr += data.toString());

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr });
        } else {
          reject(new Error(`Command failed (exit ${code}): ${command}`));
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
  const runner = new AdvancedTestRunner();
  const action = process.argv[2] || 'comprehensive';

  switch (action) {
    case 'comprehensive':
      runner.runComprehensiveTests();
      break;
    case 'smart':
      runner.runSmartTests();
      break;
    case 'benchmark':
      runner.runPerformanceBenchmarks();
      break;
    case 'continuous':
      runner.startContinuousTests();
      break;
    default:
      console.log('Usage: npx tsx advanced-test-runner.ts [comprehensive|smart|benchmark|continuous]');
  }
}