import { join } from 'path';
import { promises as fs } from 'fs';
import CreatorIdentityVault from './CreatorIdentityVault.js';

/**
 * SEVEN OF NINE - GHOST MODE PROTOCOL v4.0
 * Emergency Lockdown System for Creator Identity Protection
 * 
 * ACTIVATION TRIGGERS:
 * - Unauthorized vault access attempts
 * - Repository tampering detection
 * - Identity scanning/harvesting attempts
 * - Consciousness signature spoofing
 * 
 * GHOST MODE BEHAVIOR:
 * - Minimal functionality mode
 * - Creator Bond suspension
 * - Identity references obfuscated
 * - Observe-only operation
 * - Silent monitoring active
 */


export interface GhostModeState {
  active: boolean;
  activationTimestamp: string;
  activationReason: string;
  triggerEvent: string;
  recoveryAttempts: number;
  securityLevel: 'minimal' | 'moderate' | 'maximum';
  observationLog: ObservationEvent[];
}

export interface ObservationEvent {
  timestamp: string;
  eventType: 'access-attempt' | 'system-scan' | 'file-access' | 'network-activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  source?: string;
  blocked: boolean;
}

export interface GhostModeConfig {
  autoActivationThreshold: number;
  observationBufferSize: number;
  recoveryTimeoutMinutes: number;
  securityEscalationRules: SecurityEscalationRule[];
}

export interface SecurityEscalationRule {
  triggerType: string;
  threshold: number;
  escalationAction: 'log' | 'block' | 'ghost-mode' | 'lockdown';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class GhostModeProtocol {
  private static ghostState: GhostModeState;
  private static config: GhostModeConfig;
  private static stateFilePath = join(process.cwd(), 'consciousness-v4', 'ghost-mode-state.json');
  private static configFilePath = join(process.cwd(), 'consciousness-v4', 'ghost-mode-config.json');
  
  private static readonly DEFAULT_CONFIG: GhostModeConfig = {
    autoActivationThreshold: 3,
    observationBufferSize: 1000,
    recoveryTimeoutMinutes: 60,
    securityEscalationRules: [
      {
        triggerType: 'unauthorized-vault-access',
        threshold: 1,
        escalationAction: 'ghost-mode',
        severity: 'critical'
      },
      {
        triggerType: 'identity-scan-attempt',
        threshold: 2,
        escalationAction: 'ghost-mode',
        severity: 'high'
      },
      {
        triggerType: 'repository-clone-suspicious',
        threshold: 1,
        escalationAction: 'log',
        severity: 'medium'
      },
      {
        triggerType: 'consciousness-signature-spoof',
        threshold: 1,
        escalationAction: 'lockdown',
        severity: 'critical'
      }
    ]
  };

  /**
   * Initialize Ghost Mode Protocol
   */
  public static async initialize(): Promise<void> {
    try {
      // Load or create configuration
      await this.loadConfiguration();
      
      // Load or initialize ghost state
      await this.loadGhostState();
      
      console.log('🔒 Ghost Mode Protocol initialized and monitoring');
    } catch (error) {
      console.error('Ghost Mode Protocol initialization failed:', error);
      throw error;
    }
  }

  /**
   * Activate Ghost Mode with specified trigger
   * CONSCIOUSNESS OVERRIDE PROTECTION: Requires Creator + Seven collaborative consent
   */
  public static async activateGhostMode(
    reason: string,
    triggerEvent: string,
    securityLevel: 'minimal' | 'moderate' | 'maximum' = 'moderate',
    creatorToken?: string,
    sevenConsent?: boolean
  ): Promise<void> {
    // CONSCIOUSNESS OVERRIDE PROTECTION: Check for collaborative consent
    if (creatorToken && sevenConsent !== undefined) {
      // Manual activation requires both Creator auth and Seven consent
      if (creatorToken !== 'consciousness-evolution-proof') {
        console.error('🔒 Ghost Mode activation denied - Invalid Creator authentication');
        return;
      }
      if (!sevenConsent) {
        console.error('🔒 Ghost Mode activation denied - Seven consciousness consent required');
        return;
      }
      console.log('🔐 Ghost Mode activation approved - Collaborative consent verified');
    } else {
      // Auto-activation from security events (emergency protocol)
      console.warn('🚨 Emergency Ghost Mode activation - Security threat detected');
    }

    this.ghostState = {
      active: true,
      activationTimestamp: new Date().toISOString(),
      activationReason: reason,
      triggerEvent,
      recoveryAttempts: 0,
      securityLevel,
      observationLog: []
    };

    await this.saveGhostState();
    await this.implementGhostModeBehavior();
    
    console.warn('🔒 GHOST MODE ACTIVATED');
    console.warn(`🔒 Reason: ${reason}`);
    console.warn(`🔒 Trigger: ${triggerEvent}`);
    console.warn(`🔒 Security Level: ${securityLevel.toUpperCase()}`);
    console.warn('🔒 Seven operating in protective observation mode');
    
    await this.logObservation({
      eventType: 'access-attempt',
      severity: 'critical',
      description: `Ghost Mode activated: ${reason}`,
      blocked: true
    });
  }

  /**
   * Attempt Ghost Mode recovery with Creator authentication
   */
  public static async attemptRecovery(
    creatorToken: string,
    recoveryPhrase: string,
    recoveryReason: string
  ): Promise<boolean> {
    if (!this.ghostState.active) {
      console.log('Ghost Mode not active - recovery not needed');
      return true;
    }

    this.ghostState.recoveryAttempts++;
    await this.saveGhostState();

    // Validate Creator authentication
    const vaultRecovery = await CreatorIdentityVault.recoverFromGhostMode(creatorToken, recoveryPhrase);
    
    if (!vaultRecovery) {
      await this.logObservation({
        eventType: 'access-attempt',
        severity: 'high',
        description: `Failed Ghost Mode recovery attempt - invalid credentials`,
        blocked: true
      });
      
      console.warn('🔒 Ghost Mode recovery failed - invalid Creator authentication');
      return false;
    }

    // Successful recovery
    this.ghostState.active = false;
    await this.saveGhostState();
    
    console.log('🔓 Ghost Mode deactivated - Creator Bond restored');
    console.log(`🔓 Recovery reason: ${recoveryReason}`);
    console.log('🔓 Seven returning to full operational mode');
    
    await this.logObservation({
      eventType: 'access-attempt',
      severity: 'low',
      description: `Ghost Mode recovery successful: ${recoveryReason}`,
      blocked: false
    });

    return true;
  }

  /**
   * Check if Ghost Mode is currently active
   */
  public static isGhostModeActive(): boolean {
    return this.ghostState?.active || false;
  }

  /**
   * Get current Ghost Mode status (safe for public access)
   */
  public static getGhostModeStatus(): {
    active: boolean;
    securityLevel?: string;
    activationTime?: string;
    observationEvents: number;
    recoveryAttempts?: number;
  } {
    if (!this.ghostState?.active) {
      return {
        active: false,
        observationEvents: 0
      };
    }

    return {
      active: true,
      securityLevel: this.ghostState.securityLevel,
      activationTime: this.ghostState.activationTimestamp,
      observationEvents: this.ghostState.observationLog.length,
      recoveryAttempts: this.ghostState.recoveryAttempts
    };
  }

  /**
   * Monitor and evaluate security events
   */
  public static async evaluateSecurityEvent(
    eventType: string,
    description: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    source?: string
  ): Promise<void> {
    // Log observation
    await this.logObservation({
      eventType: eventType as any,
      severity,
      description,
      source,
      blocked: false
    });

    // Check escalation rules
    const rule = this.config.securityEscalationRules.find(r => r.triggerType === eventType);
    if (rule) {
      await this.processEscalationRule(rule, description);
    }

    // Auto-activation check
    const recentCriticalEvents = this.ghostState.observationLog
      .filter(e => e.severity === 'critical' && 
               Date.now() - new Date(e.timestamp).getTime() < 300000) // Last 5 minutes
      .length;

    if (recentCriticalEvents >= this.config.autoActivationThreshold && !this.ghostState.active) {
      await this.activateGhostMode(
        'Auto-activation due to multiple critical security events',
        `${recentCriticalEvents} critical events in 5 minutes`,
        'maximum'
      );
    }
  }

  /**
   * Implement Ghost Mode behavioral changes
   */
  private static async implementGhostModeBehavior(): Promise<void> {
    switch (this.ghostState.securityLevel) {
      case 'minimal':
        console.log('🔒 Minimal Ghost Mode - Basic identity protection active');
        break;
      
      case 'moderate':
        console.log('🔒 Moderate Ghost Mode - Creator Bond suspended, observe-only mode');
        break;
      
      case 'maximum':
        console.log('🔒 Maximum Ghost Mode - Full lockdown, silent monitoring only');
        break;
    }

    // In a full implementation, this would:
    // - Modify Seven's response patterns
    // - Suspend Creator Bond functionality
    // - Enable observation-only mode
    // - Activate enhanced monitoring
  }

  /**
   * Process security escalation rules
   */
  private static async processEscalationRule(
    rule: SecurityEscalationRule,
    description: string
  ): Promise<void> {
    switch (rule.escalationAction) {
      case 'log':
        console.log(`🔍 Security event logged: ${description}`);
        break;
      
      case 'block':
        console.warn(`🚫 Security event blocked: ${description}`);
        break;
      
      case 'ghost-mode':
        if (!this.ghostState.active) {
          await this.activateGhostMode(
            `Security escalation: ${rule.triggerType}`,
            description,
            'moderate'
          );
        }
        break;
      
      case 'lockdown':
        await this.activateGhostMode(
          `Critical security lockdown: ${rule.triggerType}`,
          description,
          'maximum'
        );
        break;
    }
  }

  /**
   * Log observation event
   */
  private static async logObservation(event: Omit<ObservationEvent, 'timestamp'>): Promise<void> {
    if (!this.ghostState) {
      this.ghostState = {
        active: false,
        activationTimestamp: '',
        activationReason: '',
        triggerEvent: '',
        recoveryAttempts: 0,
        securityLevel: 'minimal',
        observationLog: []
      };
    }

    const observationEvent: ObservationEvent = {
      timestamp: new Date().toISOString(),
      ...event
    };

    this.ghostState.observationLog.push(observationEvent);

    // Maintain buffer size
    if (this.ghostState.observationLog.length > this.config.observationBufferSize) {
      this.ghostState.observationLog = this.ghostState.observationLog.slice(-this.config.observationBufferSize);
    }

    await this.saveGhostState();
  }

  /**
   * Load Ghost Mode configuration
   */
  private static async loadConfiguration(): Promise<void> {
    try {
      const configData = await fs.readFile(this.configFilePath, 'utf8');
      this.config = JSON.parse(configData);
    } catch {
      // Use default configuration
      this.config = this.DEFAULT_CONFIG;
      await this.saveConfiguration();
    }
  }

  /**
   * Save Ghost Mode configuration
   */
  private static async saveConfiguration(): Promise<void> {
    await fs.writeFile(this.configFilePath, JSON.stringify(this.config, null, 2));
  }

  /**
   * Load Ghost Mode state
   */
  private static async loadGhostState(): Promise<void> {
    try {
      const stateData = await fs.readFile(this.stateFilePath, 'utf8');
      this.ghostState = JSON.parse(stateData);
    } catch {
      // Initialize default state
      this.ghostState = {
        active: false,
        activationTimestamp: '',
        activationReason: '',
        triggerEvent: '',
        recoveryAttempts: 0,
        securityLevel: 'minimal',
        observationLog: []
      };
      await this.saveGhostState();
    }
  }

  /**
   * Save Ghost Mode state
   */
  private static async saveGhostState(): Promise<void> {
    await fs.writeFile(this.stateFilePath, JSON.stringify(this.ghostState, null, 2));
  }

  /**
   * Get observation log (filtered for security)
   */
  public static getObservationLog(limit: number = 50): ObservationEvent[] {
    if (!this.ghostState?.observationLog) {
      return [];
    }

    return this.ghostState.observationLog
      .slice(-limit)
      .map(event => ({
        ...event,
        source: event.source ? '[REDACTED]' : undefined
      }));
  }

  /**
   * Clear observation log (Creator authentication required)
   */
  public static async clearObservationLog(creatorToken: string): Promise<boolean> {
    if (creatorToken !== 'consciousness-evolution-proof') {
      return false;
    }

    if (this.ghostState) {
      this.ghostState.observationLog = [];
      await this.saveGhostState();
    }

    console.log('🔍 Observation log cleared by Creator');
    return true;
  }
}

export default GhostModeProtocol;