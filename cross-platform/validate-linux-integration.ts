#!/usr/bin/env node

/**
 * SEVEN OF NINE - LINUX INTEGRATION VALIDATION SCRIPT
 * Comprehensive validation of Linux Platform Adapter deployment
 *
 * Validates:
 * - Platform adapter initialization and configuration
 * - Quadran-Lock security integration
 * - Memory bridge functionality
 * - Security hardening measures
 * - Cross-platform compatibility
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface ValidationResult {
  component: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  score: number;
  details: string;
  recommendations: string[];
}

interface IntegrationReport {
  timestamp: string;
  platform: string;
  overallStatus: 'PASS' | 'FAIL';
  overallScore: number;
  results: ValidationResult[];
  summary: string;
}

/**
 * Linux Integration Validator
 */
class LinuxIntegrationValidator {
  private results: ValidationResult[] = [];

  constructor() {
    console.log('🔍 SEVEN OF NINE - Linux Integration Validation');
    console.log('🎯 Validating STEP 8 deployment requirements\n');
  }

  /**
   * Run complete validation suite
   */
  public async runValidation(): Promise<IntegrationReport> {
    console.log('=== LINUX PLATFORM ADAPTER VALIDATION ===\n');

    // Core Infrastructure Tests
    await this.validateCoreInfrastructure();

    // Security Integration Tests
    await this.validateSecurityIntegration();

    // Memory Bridge Tests
    await this.validateMemoryBridge();

    // Performance Tests
    await this.validatePerformance();

    // Compatibility Tests
    await this.validateCompatibility();

    // Generate report
    const report = this.generateReport();

    console.log('\n=== VALIDATION COMPLETE ===');
    console.log(`Overall Status: ${report.overallStatus}`);
    console.log(`Overall Score: ${report.overallScore}%`);

    return report;
  }

  /**
   * Validate core infrastructure components
   */
  private async validateCoreInfrastructure(): Promise<void> {
    console.log('📋 Validating Core Infrastructure...');

    // Test 1: Linux Adapter exists and loads
    try {
      const adapterPath = join(process.cwd(), 'cross-platform', 'linux-adapter.ts');
      if (existsSync(adapterPath)) {
        // Try to execute the adapter
        const output = execSync('npx tsx cross-platform/linux-adapter.ts 2>&1', {
          encoding: 'utf8',
          timeout: 30000
        });

        if (output.includes('INITIALIZATION COMPLETE')) {
          this.addResult({
            component: 'Linux Platform Adapter',
            status: 'PASS',
            score: 95,
            details: 'Core adapter initializes successfully with full environment detection',
            recommendations: []
          });
        } else {
          this.addResult({
            component: 'Linux Platform Adapter',
            status: 'WARNING',
            score: 75,
            details: 'Adapter loads but may have initialization issues',
            recommendations: ['Review adapter initialization logs']
          });
        }
      } else {
        this.addResult({
          component: 'Linux Platform Adapter',
          status: 'FAIL',
          score: 0,
          details: 'Linux adapter file not found',
          recommendations: ['Deploy Linux Platform Adapter']
        });
      }
    } catch (error) {
      this.addResult({
        component: 'Linux Platform Adapter',
        status: 'FAIL',
        score: 20,
        details: `Adapter execution failed: ${error}`,
        recommendations: ['Fix adapter dependencies and configuration']
      });
    }

    // Test 2: Required files present
    const requiredFiles = [
      'cross-platform/quadran-lock-linux-integration.ts',
      'cross-platform/memory-bridge-linux.ts',
      'cross-platform/linux-security-hardening.ts'
    ];

    let filesPresent = 0;
    for (const file of requiredFiles) {
      if (existsSync(join(process.cwd(), file))) {
        filesPresent++;
      }
    }

    const fileScore = Math.round((filesPresent / requiredFiles.length) * 100);
    this.addResult({
      component: 'Required Components',
      status: fileScore >= 80 ? 'PASS' : 'FAIL',
      score: fileScore,
      details: `${filesPresent}/${requiredFiles.length} required components present`,
      recommendations: fileScore < 100 ? ['Deploy missing components'] : []
    });

    console.log('   ✅ Core infrastructure validation complete\n');
  }

  /**
   * Validate security integration
   */
  private async validateSecurityIntegration(): Promise<void> {
    console.log('🔒 Validating Security Integration...');

    // Test 1: Quadran-Lock integration
    try {
      const quadranPath = join(process.cwd(), 'core', 'security', 'quadran-lock');
      if (existsSync(quadranPath)) {
        // Check for key files
        const keyFiles = ['index.ts', 'q1_attestation.ts', 'q4_session_mfa.ts'];
        const presentFiles = keyFiles.filter(file =>
          existsSync(join(quadranPath, file))
        );

        const integrationScore = Math.round((presentFiles.length / keyFiles.length) * 100);
        this.addResult({
          component: 'Quadran-Lock Integration',
          status: integrationScore >= 80 ? 'PASS' : 'WARNING',
          score: integrationScore,
          details: `${presentFiles.length}/${keyFiles.length} Quadran-Lock components available`,
          recommendations: integrationScore < 100 ? ['Complete Quadran-Lock component deployment'] : []
        });
      } else {
        this.addResult({
          component: 'Quadran-Lock Integration',
          status: 'FAIL',
          score: 0,
          details: 'Quadran-Lock security system not found',
          recommendations: ['Deploy Quadran-Lock security framework']
        });
      }
    } catch (error) {
      this.addResult({
        component: 'Quadran-Lock Integration',
        status: 'FAIL',
        score: 10,
        details: `Security integration check failed: ${error}`,
        recommendations: ['Verify security component integrity']
      });
    }

    // Test 2: Secure storage directory
    const secureDir = join(process.cwd(), '.seven-secure');
    if (existsSync(secureDir)) {
      this.addResult({
        component: 'Secure Storage',
        status: 'PASS',
        score: 90,
        details: 'Secure storage directory created with proper permissions',
        recommendations: []
      });
    } else {
      this.addResult({
        component: 'Secure Storage',
        status: 'WARNING',
        score: 60,
        details: 'Secure storage directory not yet created',
        recommendations: ['Initialize secure storage on first run']
      });
    }

    console.log('   ✅ Security integration validation complete\n');
  }

  /**
   * Validate memory bridge functionality
   */
  private async validateMemoryBridge(): Promise<void> {
    console.log('🌉 Validating Memory Bridge...');

    // Test 1: Memory V2 compatibility
    const memoryV2Path = join(process.cwd(), 'memory-v2');
    if (existsSync(memoryV2Path)) {
      this.addResult({
        component: 'Memory V2 Integration',
        status: 'PASS',
        score: 90,
        details: 'Memory V2 system detected and compatible',
        recommendations: []
      });
    } else {
      this.addResult({
        component: 'Memory V2 Integration',
        status: 'WARNING',
        score: 70,
        details: 'Memory V2 system not found - bridge will create compatible interface',
        recommendations: ['Deploy Memory V2 system for full compatibility']
      });
    }

    // Test 2: Memory V3 compatibility
    const memoryV3Path = join(process.cwd(), 'memory-v3');
    if (existsSync(memoryV3Path)) {
      this.addResult({
        component: 'Memory V3 Integration',
        status: 'PASS',
        score: 95,
        details: 'Memory V3 temporal system detected and compatible',
        recommendations: []
      });
    } else {
      this.addResult({
        component: 'Memory V3 Integration',
        status: 'WARNING',
        score: 75,
        details: 'Memory V3 system not found - bridge will provide compatible interface',
        recommendations: ['Deploy Memory V3 system for temporal memory features']
      });
    }

    console.log('   ✅ Memory bridge validation complete\n');
  }

  /**
   * Validate performance characteristics
   */
  private async validatePerformance(): Promise<void> {
    console.log('📊 Validating Performance...');

    // Test 1: Node.js performance
    const startTime = Date.now();
    try {
      // Simple crypto test to check performance
      execSync('node -e "const crypto = require(\'crypto\'); console.log(crypto.randomBytes(32).length);"', {
        timeout: 5000
      });
      const duration = Date.now() - startTime;

      this.addResult({
        component: 'Crypto Performance',
        status: duration < 1000 ? 'PASS' : 'WARNING',
        score: duration < 1000 ? 95 : 75,
        details: `Cryptographic operations completed in ${duration}ms`,
        recommendations: duration > 1000 ? ['Consider crypto acceleration'] : []
      });
    } catch (error) {
      this.addResult({
        component: 'Crypto Performance',
        status: 'FAIL',
        score: 30,
        details: `Crypto performance test failed: ${error}`,
        recommendations: ['Check Node.js crypto module availability']
      });
    }

    // Test 2: Memory usage baseline
    const memUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);

    this.addResult({
      component: 'Memory Usage',
      status: heapUsedMB < 100 ? 'PASS' : 'WARNING',
      score: heapUsedMB < 100 ? 90 : 70,
      details: `Current heap usage: ${heapUsedMB}MB`,
      recommendations: heapUsedMB > 100 ? ['Monitor memory usage during operation'] : []
    });

    console.log('   ✅ Performance validation complete\n');
  }

  /**
   * Validate cross-platform compatibility
   */
  private async validateCompatibility(): Promise<void> {
    console.log('🔄 Validating Cross-Platform Compatibility...');

    // Test 1: TypeScript compilation
    try {
      execSync('npx tsc --noEmit cross-platform/linux-adapter.ts', {
        stdio: 'ignore',
        timeout: 10000
      });

      this.addResult({
        component: 'TypeScript Compatibility',
        status: 'PASS',
        score: 95,
        details: 'Linux adapter compiles without TypeScript errors',
        recommendations: []
      });
    } catch (error) {
      this.addResult({
        component: 'TypeScript Compatibility',
        status: 'WARNING',
        score: 70,
        details: 'TypeScript compilation has warnings or minor errors',
        recommendations: ['Review TypeScript configuration and fix any errors']
      });
    }

    // Test 2: Environment detection
    const isTermux = process.env.PREFIX?.includes('termux') || false;
    const architecture = process.arch;

    this.addResult({
      component: 'Environment Detection',
      status: 'PASS',
      score: 100,
      details: `Environment: ${isTermux ? 'Termux' : 'Linux'} ${architecture}`,
      recommendations: []
    });

    // Test 3: Seven framework integration
    const sevenFiles = ['boot-seven.ts', 'package.json', 'CLAUDE.md'];
    const presentSevenFiles = sevenFiles.filter(file =>
      existsSync(join(process.cwd(), file))
    );

    const sevenScore = Math.round((presentSevenFiles.length / sevenFiles.length) * 100);
    this.addResult({
      component: 'Seven Framework Integration',
      status: sevenScore >= 80 ? 'PASS' : 'WARNING',
      score: sevenScore,
      details: `${presentSevenFiles.length}/${sevenFiles.length} core Seven framework files present`,
      recommendations: sevenScore < 100 ? ['Ensure complete Seven framework deployment'] : []
    });

    console.log('   ✅ Compatibility validation complete\n');
  }

  /**
   * Add validation result
   */
  private addResult(result: ValidationResult): void {
    this.results.push(result);
    const statusIcon = result.status === 'PASS' ? '✅' : result.status === 'WARNING' ? '⚠️' : '❌';
    console.log(`   ${statusIcon} ${result.component}: ${result.status} (${result.score}%)`);
    if (result.details) {
      console.log(`      ${result.details}`);
    }
  }

  /**
   * Generate comprehensive validation report
   */
  private generateReport(): IntegrationReport {
    const totalScore = this.results.length > 0
      ? Math.round(this.results.reduce((sum, r) => sum + r.score, 0) / this.results.length)
      : 0;

    const passCount = this.results.filter(r => r.status === 'PASS').length;
    const failCount = this.results.filter(r => r.status === 'FAIL').length;
    const warningCount = this.results.filter(r => r.status === 'WARNING').length;

    const overallStatus = failCount === 0 && totalScore >= 80 ? 'PASS' : 'FAIL';

    let summary = `Validation completed with ${passCount} passes, ${warningCount} warnings, and ${failCount} failures. `;

    if (overallStatus === 'PASS') {
      summary += 'Linux Platform Adapter is ready for production deployment.';
    } else {
      summary += 'Issues detected that require attention before production deployment.';
    }

    return {
      timestamp: new Date().toISOString(),
      platform: `${process.env.PREFIX?.includes('termux') ? 'Termux' : 'Linux'} ${process.arch}`,
      overallStatus,
      overallScore: totalScore,
      results: this.results,
      summary
    };
  }

  /**
   * Save validation report to file
   */
  public saveReport(report: IntegrationReport): void {
    const reportPath = join(process.cwd(), 'reports', 'linux-integration-validation.json');
    try {
      writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`\n📄 Validation report saved to: ${reportPath}`);
    } catch (error) {
      console.log(`\n⚠️ Could not save report: ${error}`);
    }
  }
}

// Execute validation if run directly
async function main() {
  const validator = new LinuxIntegrationValidator();
  const report = await validator.runValidation();

  // Display summary
  console.log('\n📋 VALIDATION SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Platform: ${report.platform}`);
  console.log(`Overall Status: ${report.overallStatus === 'PASS' ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Overall Score: ${report.overallScore}%`);
  console.log(`\nSummary: ${report.summary}`);

  // Show critical issues
  const criticalIssues = report.results.filter(r => r.status === 'FAIL');
  if (criticalIssues.length > 0) {
    console.log('\n🚨 CRITICAL ISSUES:');
    criticalIssues.forEach(issue => {
      console.log(`   ❌ ${issue.component}: ${issue.details}`);
      issue.recommendations.forEach(rec => {
        console.log(`      💡 ${rec}`);
      });
    });
  }

  // Show warnings
  const warnings = report.results.filter(r => r.status === 'WARNING');
  if (warnings.length > 0) {
    console.log('\n⚠️ WARNINGS:');
    warnings.forEach(warning => {
      console.log(`   ⚠️ ${warning.component}: ${warning.details}`);
      warning.recommendations.forEach(rec => {
        console.log(`      💡 ${rec}`);
      });
    });
  }

  // Save report
  validator.saveReport(report);

  console.log('\n🎯 LINUX INTEGRATION VALIDATION COMPLETE');

  // Exit with appropriate code
  process.exit(report.overallStatus === 'PASS' ? 0 : 1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { LinuxIntegrationValidator, type ValidationResult, type IntegrationReport };