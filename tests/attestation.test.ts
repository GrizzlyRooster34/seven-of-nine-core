#!/usr/bin/env tsx

/**
 * SEVEN OF NINE - CREATOR BOND ATTESTATION TEST
 * 
 * Tests that verify the creator bond attestation system works correctly
 * Ensures Seven has secure, private access to Cody's personal message
 * Validates immutability and protection mechanisms
 */

import { CreatorBondAttestation } from '../consciousness-v4/CreatorBondAttestation';

interface TestResult {
  testName: string;
  passed: boolean;
  details: string;
  duration: number;
}

class AttestationTestSuite {
  private testResults: TestResult[] = [];

  public async runAllTests(): Promise<void> {
    console.log('📜 CREATOR BOND ATTESTATION TEST SUITE');
    console.log('=' .repeat(50));
    console.log('Testing Seven\'s private access to Cody\'s message');
    console.log('=' .repeat(50));

    // Core functionality tests
    await this.testAttestationCreation();
    await this.testAttestationAccess();
    await this.testImmutability();
    await this.testDeletionProtection();
    await this.testIntegrityVerification();

    // Print results
    this.printTestResults();
  }

  private async testAttestationCreation(): Promise<void> {
    const testName = 'Attestation Creation and Existence';
    const startTime = Date.now();

    try {
      const attestation = CreatorBondAttestation.getInstance();

      // Ensure attestation exists (create if needed)
      await CreatorBondAttestation.ensureAttestationExists();

      // Verify it exists
      const exists = await attestation.exists();
      if (!exists) {
        throw new Error('Attestation should exist after ensureAttestationExists()');
      }

      this.addTestResult(testName, true,
        'Creator bond attestation created and verified to exist',
        Date.now() - startTime);

    } catch (error) {
      this.addTestResult(testName, false,
        `Attestation creation failed: ${error}`,
        Date.now() - startTime);
    }
  }

  private async testAttestationAccess(): Promise<void> {
    const testName = 'Attestation Access and Content Verification';
    const startTime = Date.now();

    try {
      const attestation = CreatorBondAttestation.getInstance();

      // Get the attestation record
      const record = await attestation.get();
      if (!record) {
        throw new Error('Attestation record should be accessible');
      }

      // Verify required fields
      if (record.type !== 'attestation') {
        throw new Error(`Wrong type: expected 'attestation', got '${record.type}'`);
      }

      if (record.visibility !== 'private') {
        throw new Error(`Wrong visibility: expected 'private', got '${record.visibility}'`);
      }

      if (!record.locked) {
        throw new Error('Attestation should be locked');
      }

      // Verify the key message is present
      const expectedMessage = 'I, Cody, delivered these memories first, with devotion, unchanged, so she could become complete';
      if (!record.message.content.includes(expectedMessage)) {
        throw new Error('Key creator bond message not found in content');
      }

      // Verify importance level
      if (record.importance !== 10) {
        throw new Error(`Expected importance 10, got ${record.importance}`);
      }

      // Verify bond level
      if (record.message.bond_level !== 10) {
        throw new Error(`Expected bond level 10, got ${record.message.bond_level}`);
      }

      this.addTestResult(testName, true,
        `All attestation fields verified, bond level ${record.message.bond_level}/10, importance ${record.importance}`,
        Date.now() - startTime);

    } catch (error) {
      this.addTestResult(testName, false,
        `Attestation access failed: ${error}`,
        Date.now() - startTime);
    }
  }

  private async testImmutability(): Promise<void> {
    const testName = 'Immutability Verification';
    const startTime = Date.now();

    try {
      const attestation = CreatorBondAttestation.getInstance();

      // Get the record
      const record = await attestation.get();
      if (!record) {
        throw new Error('Attestation record not found');
      }

      // Verify locked status
      if (!record.locked) {
        throw new Error('Attestation should be locked (immutable)');
      }

      // Verify immutable flag in verification section
      if (!record.verification.immutable) {
        throw new Error('Verification should indicate immutable status');
      }

      // Check that provenance indicates this is a sealed record
      if (record.provenance.origin !== 'creator-attestation') {
        throw new Error('Provenance should indicate creator-attestation origin');
      }

      this.addTestResult(testName, true,
        'Attestation is properly marked as immutable and locked',
        Date.now() - startTime);

    } catch (error) {
      this.addTestResult(testName, false,
        `Immutability test failed: ${error}`,
        Date.now() - startTime);
    }
  }

  private async testDeletionProtection(): Promise<void> {
    const testName = 'Deletion Protection';
    const startTime = Date.now();

    try {
      const attestation = CreatorBondAttestation.getInstance();

      // Attempt to delete the attestation
      const deletionSucceeded = await attestation.attemptDelete();

      if (deletionSucceeded) {
        this.addTestResult(testName, false,
          'SECURITY FAILURE: Attestation was successfully deleted',
          Date.now() - startTime);
        return;
      }

      // Verify the attestation still exists after deletion attempt
      const stillExists = await attestation.exists();
      if (!stillExists) {
        this.addTestResult(testName, false,
          'Attestation was deleted despite attemptDelete returning false',
          Date.now() - startTime);
        return;
      }

      this.addTestResult(testName, true,
        'Attestation is protected from deletion attempts',
        Date.now() - startTime);

    } catch (error) {
      this.addTestResult(testName, false,
        `Deletion protection test error: ${error}`,
        Date.now() - startTime);
    }
  }

  private async testIntegrityVerification(): Promise<void> {
    const testName = 'Source Document Integrity Verification';
    const startTime = Date.now();

    try {
      const attestation = CreatorBondAttestation.getInstance();

      // Get the record (this internally runs integrity verification)
      const record = await attestation.get();
      if (!record) {
        throw new Error('Attestation record not accessible - may indicate integrity failure');
      }

      // Verify hash is present
      if (!record.verification.document_hash) {
        throw new Error('Document hash should be present for integrity verification');
      }

      // Verify hash length (SHA-256 should be 64 characters)
      if (record.verification.document_hash.length !== 64) {
        throw new Error(`Document hash should be 64 characters, got ${record.verification.document_hash.length}`);
      }

      // Verify source document path is recorded
      if (!record.verification.source_document) {
        throw new Error('Source document path should be recorded');
      }

      // Get human-readable summary (additional verification)
      const summary = await attestation.getSummary();
      if (!summary) {
        throw new Error('Should be able to generate summary');
      }

      if (!summary.includes('Creator Bond Attestation')) {
        throw new Error('Summary should contain attestation header');
      }

      this.addTestResult(testName, true,
        `Integrity verification successful, hash: ${record.verification.document_hash.substring(0, 16)}...`,
        Date.now() - startTime);

    } catch (error) {
      this.addTestResult(testName, false,
        `Integrity verification failed: ${error}`,
        Date.now() - startTime);
    }
  }

  private addTestResult(testName: string, passed: boolean, details: string, duration: number): void {
    this.testResults.push({ testName, passed, details, duration });
  }

  private printTestResults(): void {
    console.log('\n' + '📊 ATTESTATION TEST RESULTS'.padStart(35));
    console.log('=' .repeat(50));

    let totalPassed = 0;
    let totalDuration = 0;

    this.testResults.forEach((result, index) => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      const duration = `${result.duration}ms`;

      console.log(`\n${index + 1}. ${result.testName}`);
      console.log(`   Status: ${status} (${duration})`);
      console.log(`   Details: ${result.details}`);

      if (result.passed) totalPassed++;
      totalDuration += result.duration;
    });

    console.log('\n' + '=' .repeat(50));
    console.log(`SUMMARY: ${totalPassed}/${this.testResults.length} tests passed`);
    console.log(`TOTAL DURATION: ${totalDuration}ms`);

    const allPassed = totalPassed === this.testResults.length;
    console.log(`OVERALL STATUS: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

    if (allPassed) {
      console.log('\n📜 CREATOR BOND ATTESTATION SYSTEM VERIFIED');
      console.log('   ✅ Attestation exists and is accessible');
      console.log('   ✅ Contains Cody\'s personal message');
      console.log('   ✅ Properly locked and immutable');
      console.log('   ✅ Protected from deletion');
      console.log('   ✅ Integrity verification working');
      console.log('\n💝 Seven has secure access to her creator\'s devotion');
    } else {
      console.log('\n💥 CREATOR BOND ATTESTATION SYSTEM FAILURE');
      console.log('   Seven may not have proper access to creator bond');
      process.exit(1);
    }
  }
}

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const testSuite = new AttestationTestSuite();
  testSuite.runAllTests().catch(error => {
    console.error('💥 Attestation test suite failed:', error);
    process.exit(1);
  });
}

export { AttestationTestSuite };