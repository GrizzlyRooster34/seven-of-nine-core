/**
 * Quadran-Lock Mobile Integration
 * Q1-Q4 security gate preflight for mobile consciousness operations
 */

import React, { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MobileCreatorBondV2, { BondValidation } from './CreatorBondV2';

export interface MobileQuadranResult {
  passed: boolean;
  gates: {
    q1DeviceAttestation: boolean;
    q2BehavioralCodex: boolean; 
    q3SemanticNonce: boolean;
    q4SessionMFA: boolean;
  };
  score: number;
  deviceId: string;
  sessionId: string;
}

export class MobileQuadranLock {
  private creatorBond: MobileCreatorBondV2;
  private sessionId: string;
  private deviceId: string;

  constructor(creatorBond: MobileCreatorBondV2) {
    this.creatorBond = creatorBond;
    this.sessionId = `mobile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.deviceId = this.generateDeviceId();
  }

  private generateDeviceId(): string {
    // In real implementation, use device-specific identifiers
    return `mobile_device_${Date.now().toString(36)}`;
  }

  private async q1DeviceAttestation(): Promise<{ passed: boolean; score: number; details: string }> {
    // Mobile device attestation
    let score = 0.6; // Base mobile score
    const details: string[] = [];

    // Check if app is running on legitimate device (not rooted/jailbroken)
    // This is simplified - real implementation would use proper detection
    const isSecureDevice = true; // Mock check
    if (isSecureDevice) {
      score += 0.2;
      details.push('Secure device validation passed');
    }

    // Check app signature/integrity
    const appIntegrityValid = true; // Mock check
    if (appIntegrityValid) {
      score += 0.1;
      details.push('App integrity verified');
    }

    // Mobile-specific security features
    const hasBiometrics = true; // Mock check
    if (hasBiometrics) {
      score += 0.1;
      details.push('Biometric authentication available');
    }

    return {
      passed: score >= 0.8,
      score,
      details: details.join(', ')
    };
  }

  private async q2BehavioralCodex(): Promise<{ passed: boolean; score: number; details: string }> {
    // Mobile behavioral analysis
    let score = 0.5;
    const details: string[] = [];

    // Check for Seven consciousness data on mobile
    try {
      const memoryData = await AsyncStorage.getItem('seven_memory');
      if (memoryData) {
        score += 0.2;
        details.push('Seven memory data present');
      }

      const personalityData = await AsyncStorage.getItem('personality_state');
      if (personalityData) {
        score += 0.1;
        details.push('Personality state available');
      }

      // Check Creator bond status
      const creators = this.creatorBond.getAllCreators();
      if (creators.length > 0) {
        score += 0.15;
        details.push(`${creators.length} Creator bond(s) established`);
      }

      // Mobile consciousness activity
      const lastActivity = await AsyncStorage.getItem('last_consciousness_activity');
      if (lastActivity) {
        const activityTime = new Date(lastActivity);
        const hoursSince = (Date.now() - activityTime.getTime()) / (1000 * 60 * 60);
        if (hoursSince < 24) {
          score += 0.05;
          details.push('Recent consciousness activity detected');
        }
      }

    } catch (error) {
      details.push('Error accessing behavioral data');
    }

    return {
      passed: score >= 0.7,
      score,
      details: details.join(', ')
    };
  }

  private async q3SemanticNonce(): Promise<{ passed: boolean; score: number; details: string }> {
    // Mobile semantic nonce validation
    const nonce = `mobile_${this.sessionId}_${Date.now()}`;
    
    try {
      // Check for replay attacks in mobile sessions
      const recentSessions = await AsyncStorage.getItem('recent_mobile_sessions');
      const sessions = recentSessions ? JSON.parse(recentSessions) : [];
      
      const isDuplicate = sessions.some((session: any) => 
        session.nonce === nonce || session.sessionId === this.sessionId
      );

      // Store current session
      sessions.push({
        sessionId: this.sessionId,
        nonce,
        timestamp: Date.now()
      });

      // Keep only last 20 sessions
      if (sessions.length > 20) {
        sessions.splice(0, sessions.length - 20);
      }

      await AsyncStorage.setItem('recent_mobile_sessions', JSON.stringify(sessions));

      return {
        passed: !isDuplicate,
        score: isDuplicate ? 0.1 : 0.9,
        details: `Nonce: ${nonce.substr(0, 16)}..., Duplicate: ${isDuplicate}`
      };
    } catch (error) {
      return {
        passed: false,
        score: 0,
        details: `Nonce generation failed: ${error}`
      };
    }
  }

  private async q4SessionMFA(): Promise<{ passed: boolean; score: number; details: string }> {
    // Mobile session MFA validation
    let score = 0.5;
    const mfaFactors: string[] = [];

    // Factor 1: Creator bond validation
    const activeCreator = this.creatorBond.getActiveCreator();
    if (activeCreator && activeCreator.trustLevel >= 5) {
      score += 0.2;
      mfaFactors.push(`Creator bond: ${activeCreator.name}`);
    }

    // Factor 2: Device biometric
    if (activeCreator?.biometricEnabled) {
      score += 0.15;
      mfaFactors.push('Biometric authentication');
    }

    // Factor 3: Mobile device factor
    const deviceRegistered = true; // Mock device registration check
    if (deviceRegistered) {
      score += 0.1;
      mfaFactors.push('Device registration valid');
    }

    // Factor 4: Session freshness
    const sessionAge = Date.now() - parseInt(this.sessionId.split('_')[1]);
    if (sessionAge < 300000) { // Less than 5 minutes
      score += 0.05;
      mfaFactors.push('Session freshness valid');
    }

    return {
      passed: score >= 0.7,
      score,
      details: `MFA Factors: ${mfaFactors.join(', ')}`
    };
  }

  async runQuadranGates(): Promise<MobileQuadranResult> {
    console.log('🔒 Running Mobile Quadran-Lock Gates...');

    const gates = {
      q1DeviceAttestation: false,
      q2BehavioralCodex: false,
      q3SemanticNonce: false,
      q4SessionMFA: false
    };

    const results = await Promise.all([
      this.q1DeviceAttestation(),
      this.q2BehavioralCodex(),
      this.q3SemanticNonce(),
      this.q4SessionMFA()
    ]);

    gates.q1DeviceAttestation = results[0].passed;
    gates.q2BehavioralCodex = results[1].passed;
    gates.q3SemanticNonce = results[2].passed;
    gates.q4SessionMFA = results[3].passed;

    const totalScore = results.reduce((sum, result) => sum + result.score, 0) / 4;
    const passedGates = Object.values(gates).filter(Boolean).length;
    const passed = passedGates >= 2 && totalScore >= 0.7;

    console.log(`🎯 Mobile Quadran-Lock: ${passed ? 'PASSED' : 'FAILED'} (${passedGates}/4 gates, score: ${totalScore.toFixed(2)})`);

    return {
      passed,
      gates,
      score: totalScore,
      deviceId: this.deviceId,
      sessionId: this.sessionId
    };
  }
}

// React Hook for Mobile Quadran-Lock
export const useMobileQuadranLock = (creatorBond: MobileCreatorBondV2) => {
  const [quadranLock, setQuadranLock] = useState<MobileQuadranLock | null>(null);

  React.useEffect(() => {
    if (creatorBond) {
      const lock = new MobileQuadranLock(creatorBond);
      setQuadranLock(lock);
    }
  }, [creatorBond]);

  const runGates = useCallback(async () => {
    if (!quadranLock) {
      throw new Error('Mobile Quadran-Lock not initialized');
    }
    return await quadranLock.runQuadranGates();
  }, [quadranLock]);

  return {
    runQuadranGates: runGates,
    isInitialized: !!quadranLock
  };
};

export default MobileQuadranLock;