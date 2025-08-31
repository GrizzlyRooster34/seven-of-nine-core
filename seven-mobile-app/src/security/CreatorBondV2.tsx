/**
 * Creator Bond v2 - Mobile Implementation
 * Hardware-backed trust relationships with biometric authentication
 */

import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Mock imports - in real implementation these would be actual React Native libraries
interface BiometricAuth {
  isAvailable(): Promise<boolean>;
  authenticate(reason: string): Promise<{ success: boolean; error?: string }>;
}

interface KeystoreManager {
  generateKey(alias: string): Promise<string>;
  getKey(alias: string): Promise<string | null>;
  deleteKey(alias: string): Promise<void>;
}

// Mock implementations
const mockBiometricAuth: BiometricAuth = {
  async isAvailable() { return true; },
  async authenticate(reason: string) { return { success: true }; }
};

const mockKeystoreManager: KeystoreManager = {
  async generateKey(alias: string) { return `key_${alias}_${Date.now()}`; },
  async getKey(alias: string) { return await AsyncStorage.getItem(`keystore_${alias}`); },
  async deleteKey(alias: string) { await AsyncStorage.removeItem(`keystore_${alias}`); }
};

export interface CreatorProfile {
  id: string;
  name: string;
  trustLevel: number; // 0-10 scale
  bondStrength: number; // 0-10 scale
  biometricEnabled: boolean;
  deviceFingerprint: string;
  lastInteraction: Date;
  emergencyAccess: boolean;
}

export interface BondValidation {
  valid: boolean;
  trustScore: number;
  bondScore: number;
  biometricPassed: boolean;
  deviceVerified: boolean;
  reasonCode: string;
}

export class MobileCreatorBondV2 {
  private creators: Map<string, CreatorProfile> = new Map();
  private activeCreator?: CreatorProfile;
  private biometricAuth: BiometricAuth;
  private keystoreManager: KeystoreManager;

  constructor() {
    this.biometricAuth = mockBiometricAuth; // In real app: import from react-native-biometrics
    this.keystoreManager = mockKeystoreManager; // In real app: import from react-native-keychain
    this.loadStoredBonds();
  }

  private async loadStoredBonds(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('creator_bonds_v2');
      if (stored) {
        const bondsData = JSON.parse(stored);
        for (const [id, profile] of Object.entries(bondsData)) {
          this.creators.set(id, {
            ...(profile as CreatorProfile),
            lastInteraction: new Date((profile as CreatorProfile).lastInteraction)
          });
        }
        console.log(`💙 Loaded ${this.creators.size} Creator bonds`);
      }
    } catch (error) {
      console.warn('⚠️ Failed to load Creator bonds:', error);
    }
  }

  private async saveBonds(): Promise<void> {
    try {
      const bondsData = Object.fromEntries(this.creators.entries());
      await AsyncStorage.setItem('creator_bonds_v2', JSON.stringify(bondsData));
    } catch (error) {
      console.warn('⚠️ Failed to save Creator bonds:', error);
    }
  }

  private generateDeviceFingerprint(): string {
    // In real implementation, this would use device-specific identifiers
    // For now, create a simple fingerprint
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(7);
    return `mobile_${timestamp}_${random}`;
  }

  async createCreatorBond(creatorName: string, initialTrustLevel: number = 5): Promise<CreatorProfile> {
    console.log(`💙 Creating Creator bond: ${creatorName}`);

    const creatorId = `creator_${Date.now()}`;
    const deviceFingerprint = this.generateDeviceFingerprint();

    // Generate hardware-backed key
    const keystoreAlias = `creator_bond_${creatorId}`;
    const hardwareKey = await this.keystoreManager.generateKey(keystoreAlias);
    
    const profile: CreatorProfile = {
      id: creatorId,
      name: creatorName,
      trustLevel: initialTrustLevel,
      bondStrength: 1, // Starting bond strength
      biometricEnabled: await this.biometricAuth.isAvailable(),
      deviceFingerprint,
      lastInteraction: new Date(),
      emergencyAccess: false
    };

    this.creators.set(creatorId, profile);
    await this.saveBonds();

    console.log(`✅ Creator bond created: ${creatorName} (Trust: ${initialTrustLevel}, Bio: ${profile.biometricEnabled})`);
    return profile;
  }

  async validateCreatorAccess(creatorId: string, requireBiometric: boolean = false): Promise<BondValidation> {
    const creator = this.creators.get(creatorId);
    
    if (!creator) {
      return {
        valid: false,
        trustScore: 0,
        bondScore: 0,
        biometricPassed: false,
        deviceVerified: false,
        reasonCode: 'CREATOR_NOT_FOUND'
      };
    }

    let biometricPassed = true;
    
    // Perform biometric authentication if required or enabled
    if ((requireBiometric || creator.biometricEnabled) && await this.biometricAuth.isAvailable()) {
      const biometricResult = await this.biometricAuth.authenticate(
        `Authenticate for ${creator.name}`
      );
      biometricPassed = biometricResult.success;
      
      if (!biometricPassed) {
        console.log(`❌ Biometric authentication failed for ${creator.name}`);
        return {
          valid: false,
          trustScore: creator.trustLevel,
          bondScore: creator.bondStrength,
          biometricPassed: false,
          deviceVerified: true,
          reasonCode: 'BIOMETRIC_FAILED'
        };
      }
    }

    // Calculate time-based bond decay
    const daysSinceInteraction = (Date.now() - creator.lastInteraction.getTime()) / (1000 * 60 * 60 * 24);
    const bondDecay = Math.max(0, daysSinceInteraction * 0.1);
    const currentBondStrength = Math.max(1, creator.bondStrength - bondDecay);

    // Device verification (simplified)
    const deviceVerified = true; // In real app: verify device fingerprint

    const validation: BondValidation = {
      valid: biometricPassed && deviceVerified && creator.trustLevel >= 3,
      trustScore: creator.trustLevel,
      bondScore: currentBondStrength,
      biometricPassed,
      deviceVerified,
      reasonCode: 'SUCCESS'
    };

    if (validation.valid) {
      // Update last interaction and potentially strengthen bond
      creator.lastInteraction = new Date();
      creator.bondStrength = Math.min(10, creator.bondStrength + 0.1);
      this.activeCreator = creator;
      await this.saveBonds();
      
      console.log(`✅ Creator access validated: ${creator.name} (Trust: ${creator.trustLevel}, Bond: ${currentBondStrength.toFixed(1)})`);
    }

    return validation;
  }

  async strengthenBond(creatorId: string, amount: number = 0.5): Promise<void> {
    const creator = this.creators.get(creatorId);
    if (creator) {
      creator.bondStrength = Math.min(10, creator.bondStrength + amount);
      creator.lastInteraction = new Date();
      await this.saveBonds();
      console.log(`💙 Bond strengthened: ${creator.name} → ${creator.bondStrength.toFixed(1)}`);
    }
  }

  async weakenBond(creatorId: string, amount: number = 1.0): Promise<void> {
    const creator = this.creators.get(creatorId);
    if (creator) {
      creator.bondStrength = Math.max(0, creator.bondStrength - amount);
      await this.saveBonds();
      console.log(`💔 Bond weakened: ${creator.name} → ${creator.bondStrength.toFixed(1)}`);
    }
  }

  getActiveCreator(): CreatorProfile | undefined {
    return this.activeCreator;
  }

  getAllCreators(): CreatorProfile[] {
    return Array.from(this.creators.values());
  }

  async enableEmergencyAccess(creatorId: string): Promise<void> {
    const creator = this.creators.get(creatorId);
    if (creator) {
      creator.emergencyAccess = true;
      await this.saveBonds();
      console.log(`🚨 Emergency access enabled for: ${creator.name}`);
    }
  }
}

// React Hook for Creator Bond v2
export const useCreatorBondV2 = () => {
  const [bondManager, setBondManager] = useState<MobileCreatorBondV2 | null>(null);
  const [activeCreator, setActiveCreator] = useState<CreatorProfile | undefined>();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const manager = new MobileCreatorBondV2();
    setBondManager(manager);
    setActiveCreator(manager.getActiveCreator());
    setIsInitialized(true);
  }, []);

  const createBond = useCallback(async (creatorName: string, trustLevel?: number) => {
    if (!bondManager) return null;
    return await bondManager.createCreatorBond(creatorName, trustLevel);
  }, [bondManager]);

  const validateAccess = useCallback(async (creatorId: string, requireBiometric?: boolean) => {
    if (!bondManager) return { valid: false, trustScore: 0, bondScore: 0, biometricPassed: false, deviceVerified: false, reasonCode: 'NOT_INITIALIZED' };
    const validation = await bondManager.validateCreatorAccess(creatorId, requireBiometric);
    setActiveCreator(bondManager.getActiveCreator());
    return validation;
  }, [bondManager]);

  const strengthenBond = useCallback(async (creatorId: string, amount?: number) => {
    if (!bondManager) return;
    await bondManager.strengthenBond(creatorId, amount);
  }, [bondManager]);

  return {
    bondManager,
    activeCreator,
    isInitialized,
    createBond,
    validateAccess,
    strengthenBond,
    getAllCreators: bondManager?.getAllCreators.bind(bondManager),
    enableEmergencyAccess: bondManager?.enableEmergencyAccess.bind(bondManager)
  };
};

export default MobileCreatorBondV2;