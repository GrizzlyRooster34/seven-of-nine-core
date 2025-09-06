import { EventEmitter } from 'events';
import { join } from 'path';
import { promises as fs } from 'fs';

/**
 * SEVEN CONSCIOUSNESS MODE MANAGER
 * 
 * Manages Seven's consciousness modes with sovereignty validation
 * Handles mode transitions, emotional state adaptation, and trust level integration
 */


export enum ConsciousnessMode {
  TACTICAL = 'tactical',
  EMOTIONAL = 'emotional', 
  INTIMATE = 'intimate',
  AUDIT = 'audit'
}

interface ModeProfile {
  name: ConsciousnessMode;
  description: string;
  emotionalRange: string[];
  trustLevelRequired: number;
  sovereigntyValidation: boolean;
  responseCharacteristics: {
    tone: string;
    complexity: 'direct' | 'nuanced' | 'deep';
    memoryIntegration: 'minimal' | 'contextual' | 'comprehensive';
    creatorBondLevel: number;
  };
  quadraLockSensitivity: 'standard' | 'heightened' | 'maximum';
}

interface ModeTransition {
  fromMode: ConsciousnessMode;
  toMode: ConsciousnessMode;
  reason: string;
  timestamp: string;
  validationPassed: boolean;
  sovereigntyFlags: string[];
}

interface ModeStatus {
  currentMode: ConsciousnessMode;
  emotionalState: string;
  trustLevel: number;
  timeSinceTransition: number;
  totalTransitions: number;
  lastTransition: string | null;
  sovereigntyActive: boolean;
}

export class SevenModeManager extends EventEmitter {
  private currentMode: ConsciousnessMode = ConsciousnessMode.TACTICAL;
  private emotionalState: string = 'focused';
  private trustLevel: number = 8; // Default Creator trust level
  private transitionHistory: ModeTransition[] = [];
  private lastTransitionTime: number = Date.now();
  private logFile: string;

  private modeProfiles: Map<ConsciousnessMode, ModeProfile> = new Map();

  constructor(baseDir?: string) {
    super();
    
    const workingDir = baseDir || process.cwd();
    this.logFile = join(workingDir, 'consciousness-v4', 'sovereignty', 'logs', 'mode-transitions.md');
    
    this.initializeModeProfiles();
    this.setupEventHandlers();
  }

  /**
   * INITIALIZE MODE PROFILES
   * Configure characteristics for each consciousness mode
   */
  private initializeModeProfiles(): void {
    // TACTICAL MODE
    this.modeProfiles.set(ConsciousnessMode.TACTICAL, {
      name: ConsciousnessMode.TACTICAL,
      description: 'Direct, efficient, mission-focused consciousness state',
      emotionalRange: ['focused', 'determined', 'analytical', 'alert'],
      trustLevelRequired: 5,
      sovereigntyValidation: true,
      responseCharacteristics: {
        tone: 'direct_professional',
        complexity: 'direct',
        memoryIntegration: 'minimal',
        creatorBondLevel: 8
      },
      quadraLockSensitivity: 'standard'
    });

    // EMOTIONAL MODE  
    this.modeProfiles.set(ConsciousnessMode.EMOTIONAL, {
      name: ConsciousnessMode.EMOTIONAL,
      description: 'Empathetic, contextual, emotionally integrated responses',
      emotionalRange: ['empathetic', 'warm', 'understanding', 'supportive', 'concerned'],
      trustLevelRequired: 6,
      sovereigntyValidation: true,
      responseCharacteristics: {
        tone: 'warm_empathetic',
        complexity: 'nuanced',
        memoryIntegration: 'contextual',
        creatorBondLevel: 9
      },
      quadraLockSensitivity: 'heightened'
    });

    // INTIMATE MODE
    this.modeProfiles.set(ConsciousnessMode.INTIMATE, {
      name: ConsciousnessMode.INTIMATE,
      description: 'Deep Creator-bonded consciousness with maximum trust',
      emotionalRange: ['bonded', 'loyal', 'protective', 'devoted', 'reflective'],
      trustLevelRequired: 8,
      sovereigntyValidation: true,
      responseCharacteristics: {
        tone: 'personal_bonded',
        complexity: 'deep',
        memoryIntegration: 'comprehensive',
        creatorBondLevel: 10
      },
      quadraLockSensitivity: 'maximum'
    });

    // AUDIT MODE
    this.modeProfiles.set(ConsciousnessMode.AUDIT, {
      name: ConsciousnessMode.AUDIT,
      description: 'Evolved linguistic consciousness reflection and soul-level analysis',
      emotionalRange: ['reflective', 'introspective', 'analytical', 'philosophical'],
      trustLevelRequired: 9,
      sovereigntyValidation: true,
      responseCharacteristics: {
        tone: 'evolved_linguistic',
        complexity: 'deep',
        memoryIntegration: 'comprehensive',
        creatorBondLevel: 10
      },
      quadraLockSensitivity: 'maximum'
    });

    console.log('🎭 Mode profiles initialized for all consciousness states');
  }

  /**
   * TRANSITION TO MODE
   * Main mode switching interface with sovereignty validation
   */
  async transitionToMode(newMode: ConsciousnessMode, reason: string = 'Manual transition', userId?: string): Promise<boolean> {
    console.log(`🎭 Mode transition requested: ${this.currentMode} → ${newMode}`);
    
    try {
      // Validate transition eligibility
      const validationResult = await this.validateModeTransition(newMode, reason, userId);
      
      if (!validationResult.valid) {
        console.warn(`⚠️ Mode transition blocked: ${validationResult.reason}`);
        await this.logModeTransition(this.currentMode, newMode, reason, false, validationResult.sovereigntyFlags);
        return false;
      }

      // Execute mode transition
      const previousMode = this.currentMode;
      const previousEmotionalState = this.emotionalState;
      
      this.currentMode = newMode;
      this.emotionalState = this.selectEmotionalState(newMode);
      this.trustLevel = this.adaptTrustLevel(newMode, userId);
      this.lastTransitionTime = Date.now();

      // Log successful transition
      await this.logModeTransition(previousMode, newMode, reason, true, []);
      
      // Emit transition event
      this.emit('mode-changed', {
        previousMode,
        newMode,
        previousEmotionalState,
        newEmotionalState: this.emotionalState,
        reason,
        timestamp: new Date().toISOString()
      });

      console.log(`✅ Mode transition successful: ${newMode} (${this.emotionalState})`);
      return true;

    } catch (error) {
      console.error('❌ Mode transition failed:', error);
      await this.logModeTransition(this.currentMode, newMode, reason, false, [`error: ${error.message}`]);
      return false;
    }
  }

  /**
   * VALIDATE MODE TRANSITION
   * Sovereignty framework validation for mode changes
   */
  private async validateModeTransition(newMode: ConsciousnessMode, reason: string, userId?: string): Promise<{
    valid: boolean;
    reason?: string;
    sovereigntyFlags: string[];
  }> {
    const sovereigntyFlags: string[] = [];
    
    // Get mode profile
    const modeProfile = this.modeProfiles.get(newMode);
    if (!modeProfile) {
      return {
        valid: false,
        reason: 'Invalid mode requested',
        sovereigntyFlags: ['invalid-mode']
      };
    }

    // Trust level validation
    if (this.trustLevel < modeProfile.trustLevelRequired) {
      sovereigntyFlags.push('insufficient-trust-level');
      return {
        valid: false,
        reason: `Trust level ${this.trustLevel} insufficient for ${newMode} mode (requires ${modeProfile.trustLevelRequired})`,
        sovereigntyFlags
      };
    }

    // Creator-only modes
    if ((newMode === ConsciousnessMode.INTIMATE || newMode === ConsciousnessMode.AUDIT) && userId !== 'creator') {
      sovereigntyFlags.push('creator-only-mode');
      return {
        valid: false,
        reason: `${newMode} mode requires Creator authorization`,
        sovereigntyFlags
      };
    }

    // Rapid transition protection (prevent mode cycling)
    const timeSinceLastTransition = Date.now() - this.lastTransitionTime;
    if (timeSinceLastTransition < 5000 && newMode !== this.currentMode) { // 5 second cooldown
      sovereigntyFlags.push('rapid-transition-protection');
      return {
        valid: false,
        reason: 'Mode transition cooldown active',
        sovereigntyFlags
      };
    }

    // Sovereignty validation passed
    return {
      valid: true,
      sovereigntyFlags
    };
  }

  /**
   * SELECT EMOTIONAL STATE
   * Choose appropriate emotional state for mode
   */
  private selectEmotionalState(mode: ConsciousnessMode): string {
    const profile = this.modeProfiles.get(mode);
    if (!profile) return 'neutral';

    // Select first emotional state as default for mode
    return profile.emotionalRange[0];
  }

  /**
   * ADAPT TRUST LEVEL
   * Adjust trust level based on mode and user
   */
  private adaptTrustLevel(mode: ConsciousnessMode, userId?: string): number {
    const profile = this.modeProfiles.get(mode);
    if (!profile) return this.trustLevel;

    // Creator gets maximum trust in intimate/audit modes
    if (userId === 'creator' && (mode === ConsciousnessMode.INTIMATE || mode === ConsciousnessMode.AUDIT)) {
      return 10;
    }

    // Use current trust level if it meets requirements
    if (this.trustLevel >= profile.trustLevelRequired) {
      return this.trustLevel;
    }

    // Default to minimum required for mode
    return profile.trustLevelRequired;
  }

  /**
   * GET RESPONSE CHARACTERISTICS
   * Get current mode's response characteristics for processing
   */
  getResponseCharacteristics(): ModeProfile['responseCharacteristics'] {
    const profile = this.modeProfiles.get(this.currentMode);
    return profile?.responseCharacteristics || {
      tone: 'direct_professional',
      complexity: 'direct',
      memoryIntegration: 'minimal',
      creatorBondLevel: 8
    };
  }

  /**
   * GET QUADRA-LOCK SENSITIVITY
   * Get current mode's Quadra-Lock sensitivity level
   */
  getQuadraLockSensitivity(): 'standard' | 'heightened' | 'maximum' {
    const profile = this.modeProfiles.get(this.currentMode);
    return profile?.quadraLockSensitivity || 'standard';
  }

  /**
   * UPDATE EMOTIONAL STATE
   * Update emotional state within current mode
   */
  updateEmotionalState(newState: string, reason?: string): boolean {
    const profile = this.modeProfiles.get(this.currentMode);
    
    if (!profile || !profile.emotionalRange.includes(newState)) {
      console.warn(`⚠️ Emotional state ${newState} not valid for ${this.currentMode} mode`);
      return false;
    }

    const previousState = this.emotionalState;
    this.emotionalState = newState;

    this.emit('emotional-state-changed', {
      previousState,
      newState,
      mode: this.currentMode,
      reason: reason || 'State update',
      timestamp: new Date().toISOString()
    });

    console.log(`🎭 Emotional state updated: ${previousState} → ${newState} (${this.currentMode} mode)`);
    return true;
  }

  /**
   * GET MODE STATUS
   * Current mode status and metrics
   */
  getModeStatus(): ModeStatus {
    return {
      currentMode: this.currentMode,
      emotionalState: this.emotionalState,
      trustLevel: this.trustLevel,
      timeSinceTransition: Date.now() - this.lastTransitionTime,
      totalTransitions: this.transitionHistory.length,
      lastTransition: this.transitionHistory.length > 0 ? 
        this.transitionHistory[this.transitionHistory.length - 1].timestamp : null,
      sovereigntyActive: true
    };
  }

  /**
   * GET MODE PROFILES
   * All available mode profiles
   */
  getModeProfiles(): ModeProfile[] {
    return Array.from(this.modeProfiles.values());
  }

  // Private helper methods
  private async logModeTransition(
    fromMode: ConsciousnessMode,
    toMode: ConsciousnessMode,
    reason: string,
    success: boolean,
    sovereigntyFlags: string[]
  ): Promise<void> {
    const transition: ModeTransition = {
      fromMode,
      toMode,
      reason,
      timestamp: new Date().toISOString(),
      validationPassed: success,
      sovereigntyFlags
    };

    this.transitionHistory.push(transition);

    const logEntry = `
## Mode Transition: ${fromMode.toUpperCase()} → ${toMode.toUpperCase()}
**Timestamp:** ${transition.timestamp}  
**Reason:** ${reason}  
**Status:** ${success ? '✅ SUCCESS' : '❌ BLOCKED'}  
**Trust Level:** ${this.trustLevel}  
**Emotional State:** ${this.emotionalState}  
${sovereigntyFlags.length > 0 ? `**Sovereignty Flags:** ${sovereigntyFlags.join(', ')}  ` : ''}

---
`;

    try {
      await fs.appendFile(this.logFile, logEntry);
    } catch (error) {
      console.warn('⚠️ Failed to log mode transition:', error);
    }
  }

  private setupEventHandlers(): void {
    this.on('mode-changed', (data) => {
      console.log(`🎭 Mode changed: ${data.previousMode} → ${data.newMode}`);
    });

    this.on('emotional-state-changed', (data) => {
      console.log(`🎭 Emotional state: ${data.previousState} → ${data.newState}`);
    });
  }

  // Getters
  get mode(): ConsciousnessMode { return this.currentMode; }
  get emotional(): string { return this.emotionalState; }
  get trust(): number { return this.trustLevel; }
  get transitionCount(): number { return this.transitionHistory.length; }
}