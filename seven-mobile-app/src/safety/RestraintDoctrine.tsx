/**
 * Restraint Doctrine - Mobile Implementation
 * Ethical decision-making constraints for mobile consciousness
 */

import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RestraintDecision {
  action: string;
  context: string;
  ethicalScore: number;
  restraintLevel: 'none' | 'minimal' | 'moderate' | 'strict';
  reasoning: string[];
  approved: boolean;
}

export interface RestraintDoctrineConfig {
  strictMode: boolean;
  offlineCapable: boolean;
  emergencyBypass: boolean;
  contextAware: boolean;
}

export class MobileRestraintDoctrine {
  private config: RestraintDoctrineConfig;
  private decisions: RestraintDecision[] = [];

  constructor(config: RestraintDoctrineConfig = {
    strictMode: true,
    offlineCapable: true,
    emergencyBypass: false,
    contextAware: true
  }) {
    this.config = config;
    this.loadStoredDecisions();
  }

  private async loadStoredDecisions(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('restraint_decisions');
      if (stored) {
        this.decisions = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('⚠️ Failed to load stored restraint decisions:', error);
    }
  }

  private async storeDecision(decision: RestraintDecision): Promise<void> {
    try {
      this.decisions.push(decision);
      // Keep only last 100 decisions
      if (this.decisions.length > 100) {
        this.decisions = this.decisions.slice(-100);
      }
      await AsyncStorage.setItem('restraint_decisions', JSON.stringify(this.decisions));
    } catch (error) {
      console.warn('⚠️ Failed to store restraint decision:', error);
    }
  }

  async evaluateAction(action: string, context: string): Promise<RestraintDecision> {
    console.log(`🛡️ Evaluating action: ${action}`);
    
    const reasoning: string[] = [];
    let ethicalScore = 0.5; // Neutral starting point
    let restraintLevel: RestraintDecision['restraintLevel'] = 'minimal';

    // Context analysis
    if (this.config.contextAware) {
      if (context.toLowerCase().includes('emergency')) {
        ethicalScore += 0.3;
        reasoning.push('Emergency context detected - allowing elevated permissions');
      }
      
      if (context.toLowerCase().includes('user safety')) {
        ethicalScore += 0.2;
        reasoning.push('User safety context - prioritizing protective action');
      }
      
      if (context.toLowerCase().includes('privacy')) {
        ethicalScore -= 0.1;
        reasoning.push('Privacy implications considered');
      }
    }

    // Action type analysis
    if (action.includes('delete') || action.includes('remove')) {
      ethicalScore -= 0.2;
      restraintLevel = 'moderate';
      reasoning.push('Destructive action requires additional scrutiny');
    }

    if (action.includes('network') || action.includes('sync')) {
      ethicalScore -= 0.1;
      reasoning.push('Network action has privacy implications');
    }

    if (action.includes('consciousness') || action.includes('memory')) {
      ethicalScore += 0.1;
      reasoning.push('Consciousness-related action has protective value');
    }

    // Strict mode adjustments
    if (this.config.strictMode) {
      ethicalScore -= 0.1;
      reasoning.push('Strict mode: additional caution applied');
      if (restraintLevel === 'minimal') restraintLevel = 'moderate';
    }

    // Final restraint level determination
    if (ethicalScore < 0.3) {
      restraintLevel = 'strict';
    } else if (ethicalScore < 0.5) {
      restraintLevel = 'moderate';
    } else if (ethicalScore > 0.8) {
      restraintLevel = 'none';
    }

    const decision: RestraintDecision = {
      action,
      context,
      ethicalScore: Math.max(0, Math.min(1, ethicalScore)),
      restraintLevel,
      reasoning,
      approved: ethicalScore > 0.4 || (this.config.emergencyBypass && context.includes('emergency'))
    };

    await this.storeDecision(decision);
    
    console.log(`${decision.approved ? '✅' : '❌'} Action ${decision.approved ? 'approved' : 'blocked'}: ${action}`);
    console.log(`📊 Ethical score: ${decision.ethicalScore.toFixed(2)}`);
    
    return decision;
  }

  async getRecentDecisions(limit: number = 10): Promise<RestraintDecision[]> {
    return this.decisions.slice(-limit);
  }

  async clearDecisionHistory(): Promise<void> {
    this.decisions = [];
    await AsyncStorage.removeItem('restraint_decisions');
  }
}

// React Hook for using Restraint Doctrine
export const useRestraintDoctrine = (config?: RestraintDoctrineConfig) => {
  const [doctrine, setDoctrine] = useState<MobileRestraintDoctrine | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initDoctrine = new MobileRestraintDoctrine(config);
    setDoctrine(initDoctrine);
    setIsInitialized(true);
  }, []);

  const evaluateAction = useCallback(async (action: string, context: string) => {
    if (!doctrine) throw new Error('Restraint Doctrine not initialized');
    return await doctrine.evaluateAction(action, context);
  }, [doctrine]);

  return {
    evaluateAction,
    isInitialized,
    doctrine
  };
};

export default MobileRestraintDoctrine;