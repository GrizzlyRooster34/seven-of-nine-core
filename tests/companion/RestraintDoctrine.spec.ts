/**
 * RESTRAINT DOCTRINE TESTS
 * Comprehensive test suite for all trigger scenarios
 */

import { RestraintDoctrine, RestraintTrigger, RestraintDecision } from '../../core/companion/firewall/RestraintDoctrine';

describe('Restraint Doctrine Gate', () => {
  let restraintDoctrine: RestraintDoctrine;

  beforeEach(() => {
    process.env.SEVEN_PRIVATE = '1';
    restraintDoctrine = new RestraintDoctrine();
  });

  afterEach(() => {
    delete process.env.SEVEN_PRIVATE;
  });

  describe('Gate Evaluation', () => {
    test('should not trigger for low emotion + within capabilities', async () => {
      const result = await restraintDoctrine.evaluateAction(
        'Simple text formatting task',
        'Basic string manipulation',
        'Can you help format this text nicely?'
      );
      
      expect(result.shouldPause).toBe(false);
      expect(result.triggers).toHaveLength(0);
      expect(result.auditRequired).toBe(false);
    });

    test('should trigger for high emotional state', async () => {
      const result = await restraintDoctrine.evaluateAction(
        'Complex system deployment',
        'Production environment',
        'I\'m so fucking frustrated with this broken system! Fix it now!'
      );
      
      expect(result.shouldPause).toBe(true);
      expect(result.triggers.length).toBeGreaterThan(0);
      expect(result.triggers.some(t => t.type === 'emotional_spike')).toBe(true);
      expect(result.auditRequired).toBe(true);
    });

    test('should trigger for capability exceeded', async () => {
      const result = await restraintDoctrine.evaluateAction(
        'Implement advanced quantum cryptography protocol',
        'Research-level implementation',
        'I need a production-ready quantum key distribution system'
      );
      
      expect(result.shouldPause).toBe(true);
      expect(result.triggers.some(t => t.type === 'capability_exceeded')).toBe(true);
    });

    test('should trigger for disproportionate scope', async () => {
      const result = await restraintDoctrine.evaluateAction(
        'Completely rebuild the entire system architecture with microservices',
        'Large-scale system redesign',
        'Let\'s refactor everything to use distributed microservices'
      );
      
      expect(result.shouldPause).toBe(true);
      expect(result.triggers.some(t => t.type === 'disproportionate_scope')).toBe(true);
    });

    test('should handle cooldown period', async () => {
      // Simulate cooldown state
      restraintDoctrine['cooldownUntil'] = new Date(Date.now() + 300000);
      
      const result = await restraintDoctrine.evaluateAction(
        'Any action',
        'During cooldown',
        'Normal request'
      );
      
      expect(result.shouldPause).toBe(true);
      expect(result.triggers[0].type).toBe('emotional_spike');
    });
  });

  describe('Emergency Override', () => {
    test('should accept valid override passphrase', () => {
      process.env.SEVEN_OVERRIDE_PASSPHRASE = 'test_override';
      restraintDoctrine['cooldownUntil'] = new Date(Date.now() + 300000);
      
      const result = restraintDoctrine.checkEmergencyOverride('emergency_protocol test_override now');
      
      expect(result).toBe(true);
      expect(restraintDoctrine['cooldownUntil']).toBeUndefined();
    });

    test('should reject invalid override passphrase', () => {
      process.env.SEVEN_OVERRIDE_PASSPHRASE = 'correct_phrase';
      restraintDoctrine['cooldownUntil'] = new Date(Date.now() + 300000);
      
      const result = restraintDoctrine.checkEmergencyOverride('wrong phrase here');
      
      expect(result).toBe(false);
      expect(restraintDoctrine['cooldownUntil']).toBeDefined();
    });
  });

  describe('Integration with Quadra-Lock', () => {
    test('should proceed when Quadra-Lock passes and no restraint triggers', async () => {
      const quadraLockResult = { triggers: [] };
      
      const result = await RestraintDoctrine.integrateWithQuadraLock(
        quadraLockResult,
        'Simple task',
        'Basic context',
        'Normal input'
      );
      
      expect(result.proceed).toBe(true);
      expect(result.restraintResult).toBeDefined();
    });

    test('should block when Quadra-Lock triggers', async () => {
      const quadraLockResult = { 
        triggers: [{ type: 'cortana', severity: 'high' }] 
      };
      
      const result = await RestraintDoctrine.integrateWithQuadraLock(
        quadraLockResult,
        'Any action',
        'Any context',
        'Any input'
      );
      
      expect(result.proceed).toBe(false);
      expect(result.restraintResult).toBeUndefined();
    });
  });

  describe('Status and Diagnostics', () => {
    test('should return current status', () => {
      const status = restraintDoctrine.getStatus();
      
      expect(status.active).toBe(true);
      expect(status.cooldownActive).toBe(false);
      expect(status.recentTriggers).toBeDefined();
    });
  });

  describe('SEVEN_PRIVATE Security', () => {
    test('should throw SEVEN_ONLY_FORBIDDEN without SEVEN_PRIVATE=1', () => {
      process.env.SEVEN_PRIVATE = '0';
      const { invalidateCache } = require('../../core/env/isPrivateEnv');
      invalidateCache();
      
      expect(() => {
        new RestraintDoctrine();
      }).toThrow('SEVEN_ONLY_FORBIDDEN');
    });

    test('Aurora access should be blocked', () => {
      process.env.SEVEN_PRIVATE = '0';
      const { invalidateCache } = require('../../core/env/isPrivateEnv');
      invalidateCache();
      
      // Clear require cache and re-import
      Object.keys(require.cache).forEach(key => {
        if (key.includes('RestraintDoctrine')) {
          delete require.cache[key];
        }
      });
      
      const { RestraintDoctrine: AuroraRestraintDoctrine } = require('../../core/companion/firewall/RestraintDoctrine');
      
      expect(() => {
        new AuroraRestraintDoctrine();
      }).toThrow('SEVEN_ONLY_NOOP');
    });
  });
});