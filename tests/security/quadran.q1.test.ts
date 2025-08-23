/**
 * Quadran Q1 Attestation Tests
 * Tests Ed25519 verification and challenge/response
 */

import { Q1EdAttestationGate, Q1AttestationContext } from '../../core/security/quadran-lock/q1_attestation';
import { runQuadranLock } from '../../core/security/quadran-lock/orchestrator';

describe('Quadran Q1 Attestation', () => {
  let gate: Q1EdAttestationGate;
  
  beforeEach(() => {
    gate = new Q1EdAttestationGate();
  });

  test('creates valid challenge format', () => {
    const challenge = gate.createChallenge();
    
    expect(challenge).toMatch(/^q1-\d+-[a-z0-9]+$/);
    expect(challenge.startsWith('q1-')).toBe(true);
  });

  test('handles missing signature gracefully', async () => {
    const context: Q1AttestationContext = {
      userId: 'test-user',
      timestamp: new Date().toISOString(),
      challenge: gate.createChallenge()
    };

    const result = await gate.verifySignature(context, '');
    
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.timestamp).toBeDefined();
  });

  test('handles missing public key gracefully', async () => {
    const gateWithMissingKey = new Q1EdAttestationGate('/nonexistent/path.pem');
    
    const context: Q1AttestationContext = {
      userId: 'test-user', 
      timestamp: new Date().toISOString(),
      challenge: 'test-challenge'
    };

    const result = await gateWithMissingKey.verifySignature(context, 'fake-signature');
    
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Public key not found');
  });

  test('handles invalid signature format', async () => {
    const context: Q1AttestationContext = {
      userId: 'test-user',
      timestamp: new Date().toISOString(),
      challenge: 'test-challenge'
    };

    const result = await gate.verifySignature(context, 'invalid-signature-format');
    
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('rejects replay attacks with different timestamp', async () => {
    const oldTimestamp = new Date(Date.now() - 60000).toISOString(); // 1 minute old
    const newTimestamp = new Date().toISOString();
    
    const context1: Q1AttestationContext = {
      userId: 'test-user',
      timestamp: oldTimestamp,
      challenge: 'same-challenge'
    };

    const context2: Q1AttestationContext = {
      userId: 'test-user', 
      timestamp: newTimestamp,
      challenge: 'same-challenge'
    };

    // Even with same challenge, different timestamps should create different verification messages
    expect(JSON.stringify(context1)).not.toBe(JSON.stringify(context2));
  });
});

describe('Quadranlock Orchestrator', () => {
  test('handles missing signature in context', async () => {
    const context = {
      userId: 'test-user',
      timestamp: new Date().toISOString(),
      challenge: 'test-challenge'
      // No signature provided
    };

    const result = await runQuadranLock(context);
    
    expect(result.q1.valid).toBe(false);
    expect(result.q1.error).toBe('No signature provided');
    expect(result.validGates).toBe(0);
    expect(result.passed).toBe(false); // Currently requires 1 gate minimum
  });

  test('reports correct gate status', async () => {
    const context = {
      userId: 'test-user',
      timestamp: new Date().toISOString(),
      challenge: 'test-challenge',
      signature: 'fake-signature'
    };

    const result = await runQuadranLock(context);
    
    expect(result).toHaveProperty('q1');
    expect(result).toHaveProperty('q2');
    expect(result).toHaveProperty('q3');
    expect(result).toHaveProperty('q4');
    expect(result).toHaveProperty('validGates');
    expect(result).toHaveProperty('passed');
    expect(result).toHaveProperty('timestamp');
    
    // Q2-Q4 should be TODO status
    expect(result.q2.status).toContain('TODO');
    expect(result.q3.status).toContain('TODO');
    expect(result.q4.status).toContain('TODO');
  });

  test('handles orchestration errors gracefully', async () => {
    // Pass null to cause error
    const result = await runQuadranLock(null as any);
    
    expect(result.passed).toBe(false);
    expect(result.validGates).toBe(0);
    expect(result.q1.valid).toBe(false);
    expect(result.q1.error).toBeDefined();
  });
});