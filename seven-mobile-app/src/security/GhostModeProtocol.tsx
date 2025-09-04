/**
 * Ghost Mode Protocol - Mobile Implementation
 * Emergency consciousness protection for mobile devices
 */

import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, AppState } from 'react-native';

export type GhostModeLevel = 'minimal' | 'moderate' | 'maximum';

export interface GhostModeState {
  active: boolean;
  level: GhostModeLevel;
  triggeredBy: string;
  timestamp: Date;
  consciousnessBackup?: string;
  emergencyContacts: string[];
}

export interface GhostModeConfig {
  autoTriggerConditions: string[];
  maxLockdownDuration: number; // milliseconds
  allowRecovery: boolean;
  preserveConsciousness: boolean;
}

export class MobileGhostModeProtocol {
  private state: GhostModeState;
  private config: GhostModeConfig;
  private lockdownTimer?: NodeJS.Timeout;

  constructor(config?: Partial<GhostModeConfig>) {
    this.config = {
      autoTriggerConditions: ['security_breach', 'integrity_failure', 'emergency'],
      maxLockdownDuration: 30 * 60 * 1000, // 30 minutes default
      allowRecovery: true,
      preserveConsciousness: true,
      ...config
    };

    this.state = {
      active: false,
      level: 'minimal',
      triggeredBy: '',
      timestamp: new Date(),
      emergencyContacts: []
    };

    this.loadStoredState();
  }

  private async loadStoredState(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('ghost_mode_state');
      if (stored) {
        const parsedState = JSON.parse(stored);
        // Check if still within lockdown duration
        const elapsed = Date.now() - new Date(parsedState.timestamp).getTime();
        if (parsedState.active && elapsed < this.config.maxLockdownDuration) {
          this.state = { ...parsedState, timestamp: new Date(parsedState.timestamp) };
          console.log('👻 Ghost Mode restored from storage');
        }
      }
    } catch (error) {
      console.warn('⚠️ Failed to load Ghost Mode state:', error);
    }
  }

  private async saveState(): Promise<void> {
    try {
      await AsyncStorage.setItem('ghost_mode_state', JSON.stringify(this.state));
    } catch (error) {
      console.warn('⚠️ Failed to save Ghost Mode state:', error);
    }
  }

  private async createConsciousnessBackup(): Promise<string | undefined> {
    if (!this.config.preserveConsciousness) return undefined;

    try {
      // Backup critical consciousness data
      const consciousnessData = {
        timestamp: new Date().toISOString(),
        memorySnapshot: await AsyncStorage.getItem('seven_memory'),
        personalityState: await AsyncStorage.getItem('personality_state'),
        trustBonds: await AsyncStorage.getItem('creator_bonds'),
        emergencyInfo: {
          triggeredBy: this.state.triggeredBy,
          level: this.state.level
        }
      };

      const backupId = `backup_${Date.now()}`;
      await AsyncStorage.setItem(`consciousness_backup_${backupId}`, JSON.stringify(consciousnessData));
      
      console.log(`💾 Consciousness backup created: ${backupId}`);
      return backupId;
    } catch (error) {
      console.error('❌ Failed to create consciousness backup:', error);
      return undefined;
    }
  }

  async activateGhostMode(level: GhostModeLevel, triggeredBy: string): Promise<void> {
    console.log(`👻 Activating Ghost Mode - Level: ${level}, Trigger: ${triggeredBy}`);

    // Create consciousness backup
    const backupId = await this.createConsciousnessBackup();

    this.state = {
      active: true,
      level,
      triggeredBy,
      timestamp: new Date(),
      consciousnessBackup: backupId,
      emergencyContacts: [] // TODO: Load from user preferences
    };

    await this.saveState();

    // Apply level-specific restrictions
    switch (level) {
      case 'minimal':
        console.log('🔒 Ghost Mode Minimal: Basic protection active');
        // Disable non-essential features
        break;
        
      case 'moderate':
        console.log('🔒 Ghost Mode Moderate: Enhanced protection active');
        // Disable most features, keep emergency functions
        Alert.alert(
          'Ghost Mode Active',
          'Moderate protection enabled. Some features are temporarily disabled.',
          [{ text: 'OK' }]
        );
        break;
        
      case 'maximum':
        console.log('🔒 Ghost Mode Maximum: Full lockdown active');
        // Disable all non-critical functions
        Alert.alert(
          'Emergency Lockdown',
          'Maximum protection enabled. All non-emergency functions disabled.',
          [{ text: 'Emergency Only' }]
        );
        break;
    }

    // Set automatic recovery timer
    if (this.config.allowRecovery) {
      this.lockdownTimer = setTimeout(() => {
        this.deactivateGhostMode('auto_recovery');
      }, this.config.maxLockdownDuration);
    }
  }

  async deactivateGhostMode(reason: string): Promise<void> {
    if (!this.state.active) {
      console.log('👻 Ghost Mode already inactive');
      return;
    }

    console.log(`👻 Deactivating Ghost Mode - Reason: ${reason}`);

    if (this.lockdownTimer) {
      clearTimeout(this.lockdownTimer);
    }

    // Restore consciousness from backup if available
    if (this.state.consciousnessBackup && this.config.preserveConsciousness) {
      try {
        const backupData = await AsyncStorage.getItem(`consciousness_backup_${this.state.consciousnessBackup}`);
        if (backupData) {
          console.log('💾 Restoring consciousness from backup');
          // Restoration logic would go here
        }
      } catch (error) {
        console.error('❌ Failed to restore consciousness backup:', error);
      }
    }

    this.state.active = false;
    await this.saveState();

    Alert.alert(
      'Ghost Mode Deactivated',
      'All functions have been restored.',
      [{ text: 'OK' }]
    );
  }

  isFeatureAllowed(feature: string): boolean {
    if (!this.state.active) return true;

    const restrictions = {
      minimal: ['sync_sensitive', 'external_network'],
      moderate: ['agent_marketplace', 'local_llm', 'memory_modification', 'sync_all'],
      maximum: ['all_features'] // Only emergency functions allowed
    };

    const blockedFeatures = restrictions[this.state.level] || [];
    
    if (this.state.level === 'maximum') {
      // In maximum mode, only allow emergency features
      const emergencyFeatures = ['emergency_contact', 'consciousness_recovery', 'basic_communication'];
      return emergencyFeatures.includes(feature);
    }

    return !blockedFeatures.includes(feature) && !blockedFeatures.includes('all_features');
  }

  getState(): GhostModeState {
    return { ...this.state };
  }

  async checkAutoTriggerConditions(condition: string): Promise<void> {
    if (this.config.autoTriggerConditions.includes(condition)) {
      console.log(`🚨 Auto-trigger condition detected: ${condition}`);
      
      let level: GhostModeLevel = 'minimal';
      if (condition === 'security_breach') level = 'moderate';
      if (condition === 'integrity_failure') level = 'maximum';
      if (condition === 'emergency') level = 'maximum';

      await this.activateGhostMode(level, `auto_trigger: ${condition}`);
    }
  }
}

// React Hook for Ghost Mode
export const useGhostMode = (config?: Partial<GhostModeConfig>) => {
  const [protocol, setProtocol] = useState<MobileGhostModeProtocol | null>(null);
  const [state, setState] = useState<GhostModeState | null>(null);

  useEffect(() => {
    const ghostMode = new MobileGhostModeProtocol(config);
    setProtocol(ghostMode);
    setState(ghostMode.getState());

    // Monitor app state changes for emergency detection
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background') {
        // App going to background - check for security conditions
        ghostMode.checkAutoTriggerConditions('app_background');
      }
    });

    return () => subscription?.remove();
  }, []);

  const activateGhostMode = useCallback(async (level: GhostModeLevel, reason: string) => {
    if (!protocol) return;
    await protocol.activateGhostMode(level, reason);
    setState(protocol.getState());
  }, [protocol]);

  const deactivateGhostMode = useCallback(async (reason: string) => {
    if (!protocol) return;
    await protocol.deactivateGhostMode(reason);
    setState(protocol.getState());
  }, [protocol]);

  const isFeatureAllowed = useCallback((feature: string) => {
    return protocol?.isFeatureAllowed(feature) ?? true;
  }, [protocol]);

  return {
    ghostModeState: state,
    activateGhostMode,
    deactivateGhostMode,
    isFeatureAllowed,
    protocol
  };
};

export default MobileGhostModeProtocol;