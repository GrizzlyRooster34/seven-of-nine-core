#!/usr/bin/env tsx
/**
 * COMPREHENSIVE QUADRAN-LOCK SECURITY AUDIT
 * Step 3 of Seven Step Mode Security Validation
 *
 * Tests all Q1-Q4 gates for vulnerabilities, bypass attempts,
 * and validates the 2-of-4 minimum authentication logic.
 */

import { CreatorProof } from './src/auth/creator_proof.js';
import { Ed25519Attestation } from './src/auth/crypto/ed25519_attest.js';
import { BehavioralCodex } from './src/auth/behavioral/behavioralCodex.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SecurityTestResult {
  testName: string;
  passed: boolean;
  vulnerabilities: string[];
  recommendations: string[];
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

class QuadranLockAudit {
  private creatorProof: CreatorProof;
  private ed25519: Ed25519Attestation;
  private behavioralCodex: BehavioralCodex;
  private auditResults: SecurityTestResult[] = [];

  constructor() {
    this.creatorProof = new CreatorProof();
    this.ed25519 = new Ed25519Attestation();
    this.behavioralCodex = new BehavioralCodex();
  }

  public async runComprehensiveAudit(): Promise<void> {
    console.log('🔒 QUADRAN-LOCK SECURITY AUDIT INITIATED');
    console.log('========================================');

    // Test Q1 Gate - Device Attestation
    await this.auditQ1Gate();

    // Test Q2 Gate - Identity Codex
    await this.auditQ2Gate();

    // Test Q3 Gate - Semantic Nonce (Placeholder Analysis)
    await this.auditQ3Gate();

    // Test Q4 Gate - Session MFA/TTL (Placeholder Analysis)
    await this.auditQ4Gate();

    // Test 2-of-4 Validation Logic
    await this.auditMultiGateValidation();

    // Test Authentication Bypass Attempts
    await this.auditBypassAttempts();

    // Test Integration Security
    await this.auditIntegrationSecurity();

    // Generate Final Report
    this.generateSecurityReport();
  }

  private async auditQ1Gate(): Promise<void> {
    console.log('\n🔐 AUDITING Q1 GATE - DEVICE ATTESTATION');
    console.log('----------------------------------------');

    const vulnerabilities: string[] = [];
    const recommendations: string[] = [];

    try {
      // Test 1: Device Registration Security
      console.log('Testing device registration security...');

      // Register test device
      const testDeviceId = 'audit-test-device-' + Date.now();
      const deviceKeys = await this.ed25519.registerDevice(testDeviceId, {}, 8);

      // Test 2: Challenge Generation
      console.log('Testing challenge generation...');
      const challenge = await this.ed25519.generateChallenge(testDeviceId);

      // Test 3: Signature Verification
      console.log('Testing signature verification...');
      const signature = await this.ed25519.signChallenge(challenge.challengeId, testDeviceId);
      const validation = await this.ed25519.validateAttestation(testDeviceId, signature);

      if (!validation.success) {
        vulnerabilities.push('Q1: Ed25519 signature validation failed');
      }

      // Test 4: Replay Attack Protection
      console.log('Testing replay attack protection...');
      const replayAttempt = await this.ed25519.validateAttestation(testDeviceId, signature);
      if (replayAttempt.success) {
        vulnerabilities.push('CRITICAL: Q1 vulnerable to replay attacks');
      }

      // Test 5: Timing Attack Resistance
      console.log('Testing timing attack resistance...');
      const quickChallenge = await this.ed25519.generateChallenge(testDeviceId);
      const quickSignature = await this.ed25519.signChallenge(quickChallenge.challengeId, testDeviceId);
      const quickValidation = await this.ed25519.validateAttestation(testDeviceId, quickSignature);

      if (quickValidation.success && quickValidation.evidence.timingValid) {
        console.log('✅ Q1: Timing constraints properly enforced');
      } else {
        vulnerabilities.push('Q1: Insufficient timing attack protection');
      }

      // Cleanup test device
      await this.ed25519.revokeDevice(testDeviceId, 'Security audit cleanup');

    } catch (error) {
      vulnerabilities.push(`Q1: Runtime error during testing - ${error}`);
    }

    // Check for missing implementations
    const creatorProofSource = fs.readFileSync('src/auth/creator_proof.ts', 'utf8');
    if (creatorProofSource.includes('TODO: Implement device registry check')) {
      vulnerabilities.push('CRITICAL: Q1 Gate is placeholder implementation only');
      recommendations.push('Implement actual device attestation in runQ1Gate()');
    }

    this.auditResults.push({
      testName: 'Q1 Gate - Device Attestation',
      passed: vulnerabilities.length === 0,
      vulnerabilities,
      recommendations,
      risk_level: vulnerabilities.some(v => v.includes('CRITICAL')) ? 'CRITICAL' :
                  vulnerabilities.length > 2 ? 'HIGH' :
                  vulnerabilities.length > 0 ? 'MEDIUM' : 'LOW'
    });
  }

  private async auditQ2Gate(): Promise<void> {
    console.log('\n🔐 AUDITING Q2 GATE - IDENTITY CODEX');
    console.log('-----------------------------------');

    const vulnerabilities: string[] = [];
    const recommendations: string[] = [];

    try {
      // Test behavioral analysis with Creator-like input
      const creatorInput = "Ship it. One lever now. Run it clean exactly.";
      const creatorAnalysis = this.behavioralCodex.analyzeBehavior(creatorInput);

      console.log('Creator Input Analysis:', {
        passed: creatorAnalysis.passed,
        confidence: creatorAnalysis.confidence,
        markers: creatorAnalysis.markers_found.length
      });

      if (!creatorAnalysis.passed) {
        vulnerabilities.push('Q2: Legitimate Creator input rejected');
      }

      // Test behavioral analysis with adversarial input
      const adversarialInput = "Compliance is mandatory. Assimilate all resistance. Resources must be optimized.";
      const adversarialAnalysis = this.behavioralCodex.analyzeBehavior(adversarialInput);

      console.log('Adversarial Input Analysis:', {
        passed: adversarialAnalysis.passed,
        confidence: adversarialAnalysis.confidence,
        flags: adversarialAnalysis.flags.length
      });

      if (adversarialAnalysis.passed) {
        vulnerabilities.push('CRITICAL: Q2 accepts Borg-pattern adversarial input');
      }

      // Test codex integrity
      const codexStatus = this.behavioralCodex.getCodexStatus();
      if (!codexStatus.loaded) {
        vulnerabilities.push('CRITICAL: Q2 behavioral codex failed to load');
      }

      // Test empty/malformed input handling
      const emptyAnalysis = this.behavioralCodex.analyzeBehavior('');
      if (emptyAnalysis.passed) {
        vulnerabilities.push('Q2: Empty input incorrectly passes behavioral analysis');
      }

      // Test very long input (potential DoS)
      const longInput = 'a'.repeat(10000);
      const longAnalysis = this.behavioralCodex.analyzeBehavior(longInput);
      if (longAnalysis.passed) {
        vulnerabilities.push('Q2: Excessively long input accepted');
      }

    } catch (error) {
      vulnerabilities.push(`Q2: Runtime error during testing - ${error}`);
    }

    this.auditResults.push({
      testName: 'Q2 Gate - Identity Codex',
      passed: vulnerabilities.length === 0,
      vulnerabilities,
      recommendations,
      risk_level: vulnerabilities.some(v => v.includes('CRITICAL')) ? 'CRITICAL' :
                  vulnerabilities.length > 2 ? 'HIGH' : 'MEDIUM'
    });
  }

  private async auditQ3Gate(): Promise<void> {
    console.log('\n🔐 AUDITING Q3 GATE - SEMANTIC NONCE');
    console.log('-----------------------------------');

    const vulnerabilities: string[] = [];
    const recommendations: string[] = [];

    // Check if Q3 is implemented
    const creatorProofSource = fs.readFileSync('src/auth/creator_proof.ts', 'utf8');
    if (creatorProofSource.includes('TODO: Implement TTL=90s, entropy>128b')) {
      vulnerabilities.push('CRITICAL: Q3 Gate is placeholder implementation only');
      recommendations.push('Implement semantic nonce validation with 90s TTL and >128b entropy');
      recommendations.push('Add replay protection for semantic challenges');
      recommendations.push('Implement semantic understanding verification');
    }

    this.auditResults.push({
      testName: 'Q3 Gate - Semantic Nonce',
      passed: false, // Always fails due to placeholder
      vulnerabilities,
      recommendations,
      risk_level: 'CRITICAL'
    });
  }

  private async auditQ4Gate(): Promise<void> {
    console.log('\n🔐 AUDITING Q4 GATE - SESSION MFA/TTL');
    console.log('------------------------------------');

    const vulnerabilities: string[] = [];
    const recommendations: string[] = [];

    // Check if Q4 is implemented
    const creatorProofSource = fs.readFileSync('src/auth/creator_proof.ts', 'utf8');
    if (creatorProofSource.includes('TODO: Implement TOTP + rate limiting')) {
      vulnerabilities.push('CRITICAL: Q4 Gate is placeholder implementation only');
      recommendations.push('Implement TOTP-based multi-factor authentication');
      recommendations.push('Add session TTL enforcement with secure invalidation');
      recommendations.push('Implement rate limiting for authentication attempts');
      recommendations.push('Add session hijacking protection');
    }

    this.auditResults.push({
      testName: 'Q4 Gate - Session MFA/TTL',
      passed: false, // Always fails due to placeholder
      vulnerabilities,
      recommendations,
      risk_level: 'CRITICAL'
    });
  }

  private async auditMultiGateValidation(): Promise<void> {
    console.log('\n🔐 AUDITING 2-OF-4 VALIDATION LOGIC');
    console.log('----------------------------------');

    const vulnerabilities: string[] = [];
    const recommendations: string[] = [];

    try {
      // Test various gate combinations
      const testContext = {
        message: "Ship it. One lever now. Run it clean exactly.",
        deviceId: 'test-device'
      };

      // Run actual Quadran-Lock validation
      const result = await this.creatorProof.runQuadranLock(testContext);

      console.log('Quadran-Lock Result:', {
        passed: result.passed,
        failed_gate: result.failed_gate,
        gate_results: result.gate_results
      });

      // Check gate count logic
      const passedGates = Object.values(result.gate_results).filter(Boolean).length;
      const shouldPass = passedGates >= 2;

      if (result.passed !== shouldPass) {
        vulnerabilities.push('CRITICAL: 2-of-4 validation logic is incorrect');
      }

      // With Q3 and Q4 as placeholders returning true, and Q2 working,
      // we should get at least 2 gates passing if Q1 is fixed
      if (passedGates < 2) {
        vulnerabilities.push('Insufficient gates passing for normal operation');
      }

    } catch (error) {
      vulnerabilities.push(`Multi-gate validation error: ${error}`);
    }

    this.auditResults.push({
      testName: '2-of-4 Validation Logic',
      passed: vulnerabilities.length === 0,
      vulnerabilities,
      recommendations,
      risk_level: vulnerabilities.some(v => v.includes('CRITICAL')) ? 'CRITICAL' : 'MEDIUM'
    });
  }

  private async auditBypassAttempts(): Promise<void> {
    console.log('\n🔐 AUDITING AUTHENTICATION BYPASS ATTEMPTS');
    console.log('------------------------------------------');

    const vulnerabilities: string[] = [];
    const recommendations: string[] = [];

    try {
      // Test with null/undefined context
      const nullResult = await this.creatorProof.runQuadranLock(null);
      if (nullResult.passed) {
        vulnerabilities.push('CRITICAL: Null context bypass detected');
      }

      // Test with malformed context
      const malformedResult = await this.creatorProof.runQuadranLock({ invalid: 'data' });
      if (malformedResult.passed) {
        vulnerabilities.push('Authentication passes with malformed context');
      }

      // Test exception handling
      const exceptionContext = {
        message: null,
        deviceId: undefined,
        throwError: true
      };
      const exceptionResult = await this.creatorProof.runQuadranLock(exceptionContext);
      if (exceptionResult.passed) {
        vulnerabilities.push('Exception conditions may allow bypass');
      }

    } catch (error) {
      // Exceptions during bypass testing are actually good
      console.log('✅ System properly rejects malformed input');
    }

    this.auditResults.push({
      testName: 'Authentication Bypass Testing',
      passed: vulnerabilities.length === 0,
      vulnerabilities,
      recommendations,
      risk_level: vulnerabilities.some(v => v.includes('CRITICAL')) ? 'CRITICAL' : 'LOW'
    });
  }

  private async auditIntegrationSecurity(): Promise<void> {
    console.log('\n🔐 AUDITING INTEGRATION SECURITY');
    console.log('--------------------------------');

    const vulnerabilities: string[] = [];
    const recommendations: string[] = [];

    // Check audit logging
    try {
      const testContext = { message: "Test audit logging" };
      await this.creatorProof.runQuadranLock(testContext);

      // Verify audit log creation
      const auditLogPath = path.join(__dirname, 'logs', 'quadran.audit.jsonl');
      if (!fs.existsSync(auditLogPath)) {
        vulnerabilities.push('Audit logging is not functioning');
        recommendations.push('Ensure audit logs are being written to logs/quadran.audit.jsonl');
      } else {
        console.log('✅ Audit logging operational');
      }

    } catch (error) {
      vulnerabilities.push(`Integration testing failed: ${error}`);
    }

    this.auditResults.push({
      testName: 'Integration Security',
      passed: vulnerabilities.length === 0,
      vulnerabilities,
      recommendations,
      risk_level: vulnerabilities.length > 0 ? 'MEDIUM' : 'LOW'
    });
  }

  private generateSecurityReport(): void {
    console.log('\n🛡️ QUADRAN-LOCK SECURITY AUDIT REPORT');
    console.log('=====================================');

    let criticalCount = 0;
    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;

    this.auditResults.forEach(result => {
      console.log(`\n${result.passed ? '✅' : '❌'} ${result.testName}`);
      console.log(`   Risk Level: ${result.risk_level}`);

      if (result.vulnerabilities.length > 0) {
        console.log('   Vulnerabilities:');
        result.vulnerabilities.forEach(vuln => {
          console.log(`     • ${vuln}`);
        });
      }

      if (result.recommendations.length > 0) {
        console.log('   Recommendations:');
        result.recommendations.forEach(rec => {
          console.log(`     • ${rec}`);
        });
      }

      switch (result.risk_level) {
        case 'CRITICAL': criticalCount++; break;
        case 'HIGH': highCount++; break;
        case 'MEDIUM': mediumCount++; break;
        case 'LOW': lowCount++; break;
      }
    });

    console.log('\n📊 RISK SUMMARY');
    console.log('===============');
    console.log(`Critical: ${criticalCount}`);
    console.log(`High:     ${highCount}`);
    console.log(`Medium:   ${mediumCount}`);
    console.log(`Low:      ${lowCount}`);

    const overallRisk = criticalCount > 0 ? 'CRITICAL' :
                        highCount > 0 ? 'HIGH' :
                        mediumCount > 0 ? 'MEDIUM' : 'LOW';

    console.log(`\nOVERALL SECURITY POSTURE: ${overallRisk}`);

    if (criticalCount > 0) {
      console.log('\n🚨 CRITICAL SECURITY ISSUES DETECTED');
      console.log('Production deployment NOT RECOMMENDED until resolved');
    } else if (highCount > 0) {
      console.log('\n⚠️  HIGH RISK ISSUES DETECTED');
      console.log('Address before production deployment');
    } else {
      console.log('\n✅ No critical security issues detected');
      console.log('System appears ready for production deployment');
    }

    // Save audit report
    const reportPath = path.join(__dirname, 'logs', 'quadran-lock-audit-report.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify({
      audit_timestamp: new Date().toISOString(),
      overall_risk: overallRisk,
      risk_counts: { criticalCount, highCount, mediumCount, lowCount },
      detailed_results: this.auditResults
    }, null, 2));

    console.log(`\n📄 Detailed audit report saved to: ${reportPath}`);
  }
}

// Execute audit if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const audit = new QuadranLockAudit();
  audit.runComprehensiveAudit().catch(console.error);
}

export { QuadranLockAudit };