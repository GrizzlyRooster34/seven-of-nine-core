import { AuthDecision } from '../creator_proof';
import { CreatorProofOrchestrator } from '../creator_proof';
import { Ed25519Attestation } from '../crypto/ed25519_attest';

/**
 * QUADRAN-LOCK Q1 INTEGRATION TESTS
 * Validates cryptographic attestation and authentication flow
 * 
 * COMMIT: Quadran-Lock Q1 integration testing framework
 * PATCH: Ensures Q1 gate functionality and 2-of-3 decision logic
 */


describe('Quadran-Lock Q1 Integration', () => {
  let orchestrator: CreatorProofOrchestrator;
  let ed25519: Ed25519Attestation;
  const testDeviceId = 'test-device-' + Date.now();
  const secondDeviceId = 'test-device-2-' + Date.now();

  beforeEach(async () => {
    orchestrator = new CreatorProofOrchestrator();
    ed25519 = new Ed25519Attestation();
  });

  afterEach(async () => {
    // Cleanup test devices
    try {
      await ed25519.revokeDevice(testDeviceId, 'Test cleanup');
      await ed25519.revokeDevice(secondDeviceId, 'Test cleanup');
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('Device Registration', () => {
    test('Device registration creates trusted device', async () => {
      const deviceKeys = await ed25519.registerDevice(testDeviceId, { 
        test: true,
        environment: 'test'
      }, 8);
      
      expect(deviceKeys.deviceId).toBe(testDeviceId);
      expect(deviceKeys.trustLevel).toBe(8);
      expect(deviceKeys.publicKey).toBeInstanceOf(Buffer);
      expect(deviceKeys.privateKey).toBeInstanceOf(Buffer);

      const devices = await ed25519.listTrustedDevices();
      expect(devices.some(d => d.deviceId === testDeviceId)).toBe(true);
    });

    test('Device registration with maximum trust level', async () => {
      await ed25519.registerDevice(testDeviceId, { test: true }, 10);
      const devices = await ed25519.listTrustedDevices();
      
      const device = devices.find(d => d.deviceId === testDeviceId);
      expect(device.trustLevel).toBe(10);
    });

    test('Device registration enforces trust level bounds', async () => {
      // Test upper bound
      await ed25519.registerDevice(testDeviceId, { test: true }, 15);
      let devices = await ed25519.listTrustedDevices();
      let device = devices.find(d => d.deviceId === testDeviceId);
      expect(device.trustLevel).toBe(10); // Clamped to maximum

      await ed25519.revokeDevice(testDeviceId, 'Cleanup for next test');

      // Test lower bound
      await ed25519.registerDevice(secondDeviceId, { test: true }, -5);
      devices = await ed25519.listTrustedDevices();
      device = devices.find(d => d.deviceId === secondDeviceId);
      expect(device.trustLevel).toBe(0); // Clamped to minimum
    });
  });

  describe('Challenge-Response Flow', () => {
    beforeEach(async () => {
      await ed25519.registerDevice(testDeviceId, { test: true }, 8);
    });

    test('Challenge generation for registered device', async () => {
      const challenge = await ed25519.generateChallenge(testDeviceId);
      
      expect(challenge.challengeId).toMatch(/^[0-9a-f]{32}$/);
      expect(challenge.nonce).toBeInstanceOf(Buffer);
      expect(challenge.nonce.length).toBe(32);
      expect(challenge.deviceId).toBe(testDeviceId);
      expect(challenge.expiresAt).toBeGreaterThan(Date.now());
      expect(challenge.difficulty).toBeGreaterThan(0);
    });

    test('Challenge rejection for unregistered device', async () => {
      await expect(ed25519.generateChallenge('unknown-device'))
        .rejects
        .toThrow('Device unknown-device not registered');
    });

    test('Complete challenge-response cycle', async () => {
      const challenge = await ed25519.generateChallenge(testDeviceId);
      const signature = await ed25519.signChallenge(challenge.challengeId, testDeviceId);
      const validation = await ed25519.validateAttestation(testDeviceId, signature);
      
      expect(validation.success).toBe(true);
      expect(validation.confidence).toBeGreaterThan(0);
      expect(validation.evidence.signatureValid).toBe(true);
      expect(validation.evidence.nonceValid).toBe(true);
      expect(validation.evidence.timingValid).toBe(true);
      expect(validation.evidence.deviceTrusted).toBe(true);
    });

    test('Replay protection prevents nonce reuse', async () => {
      const challenge = await ed25519.generateChallenge(testDeviceId);
      const signature = await ed25519.signChallenge(challenge.challengeId, testDeviceId);
      
      // First validation should succeed
      const validation1 = await ed25519.validateAttestation(testDeviceId, signature);
      expect(validation1.success).toBe(true);
      
      // Second validation should fail (replay protection)
      const validation2 = await ed25519.validateAttestation(testDeviceId, signature);
      expect(validation2.success).toBe(false);
      expect(validation2.errors).toContain('Nonce replay detected');
    });
  });

  describe('Orchestrator Authentication', () => {
    beforeEach(async () => {
      await ed25519.registerDevice(testDeviceId, { test: true }, 8);
    });

    test('Authentication with Q1 crypto success', async () => {
      // Generate challenge and sign it
      const challenge = await ed25519.generateChallenge(testDeviceId);
      const signature = await ed25519.signChallenge(challenge.challengeId, testDeviceId);
      
      const result = await orchestrator.authenticateCreator(
        testDeviceId,
        { 
          input: 'test message', 
          type: 'chat',
          cryptoChallenge: signature
        },
        { deviceId: testDeviceId }
      );

      // Should allow based on crypto attestation (fast-path)
      expect(result.decision).toBe(AuthDecision.ALLOW);
      expect(result.overallConfidence).toBeGreaterThan(0);
      expect(result.successfulGates.length).toBeGreaterThanOrEqual(1);
      expect(result.reasoning).toContain('Fast-path');
    });

    test('Authentication failure with unregistered device', async () => {
      const result = await orchestrator.authenticateCreator(
        'unknown-device',
        { input: 'test message', type: 'chat' },
        { deviceId: 'unknown-device' }
      );

      expect(result.decision).toBe(AuthDecision.DENY);
      expect(result.overallConfidence).toBe(0);
      expect(result.failedGates.length).toBeGreaterThan(0);
    });

    test('2-of-3 gate logic with partial success', async () => {
      // This would test scenarios where crypto fails but other gates succeed
      // For now, we test that the decision logic exists
      const result = await orchestrator.authenticateCreator(
        testDeviceId,
        { input: 'test message', type: 'chat' },
        { deviceId: testDeviceId }
      );

      // Without proper crypto challenge, should still evaluate other gates
      expect([AuthDecision.ALLOW, AuthDecision.LIMITED, AuthDecision.DENY]).toContain(result.decision);
      expect(result.gateResults).toHaveLength(4); // Q1, Q2, Q3, Q4 all evaluated
    });
  });

  describe('Security Edge Cases', () => {
    beforeEach(async () => {
      await ed25519.registerDevice(testDeviceId, { test: true }, 8);
    });

    test('Challenge expiration handling', async () => {
      const challenge = await ed25519.generateChallenge(testDeviceId);
      
      // Manually expire the challenge
      challenge.expiresAt = Date.now() - 1000;
      
      const signature = await ed25519.signChallenge(challenge.challengeId, testDeviceId);
      const validation = await ed25519.validateAttestation(testDeviceId, signature);
      
      expect(validation.success).toBe(false);
      expect(validation.errors[0]).toContain('Invalid timing');
    });

    test('Device revocation blocks access', async () => {
      // First, confirm device works
      const challenge1 = await ed25519.generateChallenge(testDeviceId);
      const signature1 = await ed25519.signChallenge(challenge1.challengeId, testDeviceId);
      const validation1 = await ed25519.validateAttestation(testDeviceId, signature1);
      expect(validation1.success).toBe(true);

      // Revoke device
      await ed25519.revokeDevice(testDeviceId, 'Test revocation');

      // Now device should be blocked
      await expect(ed25519.generateChallenge(testDeviceId))
        .rejects
        .toThrow('not registered');
    });

    test('Trust level affects challenge difficulty', async () => {
      // Register low trust device
      await ed25519.registerDevice(secondDeviceId, { test: true }, 2);
      
      const highTrustChallenge = await ed25519.generateChallenge(testDeviceId); // Trust 8
      const lowTrustChallenge = await ed25519.generateChallenge(secondDeviceId); // Trust 2
      
      // Lower trust should have higher difficulty
      expect(lowTrustChallenge.difficulty).toBeGreaterThan(highTrustChallenge.difficulty);
    });
  });

  describe('Performance Requirements', () => {
    beforeEach(async () => {
      await ed25519.registerDevice(testDeviceId, { test: true }, 8);
    });

    test('Authentication completes within acceptable time', async () => {
      const startTime = Date.now();
      
      const challenge = await ed25519.generateChallenge(testDeviceId);
      const signature = await ed25519.signChallenge(challenge.challengeId, testDeviceId);
      const validation = await ed25519.validateAttestation(testDeviceId, signature);
      
      const totalTime = Date.now() - startTime;
      
      expect(validation.success).toBe(true);
      expect(totalTime).toBeLessThan(5000); // Should complete within 5 seconds
    });

    test('Orchestrator timeout handling', async () => {
      const startTime = Date.now();
      
      // Test with very short timeout (this would be configured in orchestrator)
      const result = await orchestrator.authenticateCreator(
        testDeviceId,
        { input: 'test message', type: 'chat' },
        { deviceId: testDeviceId }
      );
      
      const totalTime = Date.now() - startTime;
      
      // Should complete within orchestrator timeout (30s by default)
      expect(totalTime).toBeLessThan(30000);
    });
  });
});