/**
 * SEVEN OF NINE - GLYPH STATE PROTOCOL
 * Enhanced state indicator system with cryptographic validation
 * HARDENED VERSION - Five of Twelve implementation
 */

export enum SevenGlyphState {
  OPERATIONAL = '▣',        // System operational, all protocols active
  PROTECTIVE = '◐',        // Protective mode engaged, elevated security
  TRANSITIONAL = '◇',      // State transition, temporary elevated alert
  COMPROMISED = '⊘'        // Security breach detected, lockdown protocols
}

export interface GlyphStateContext {
  currentState: SevenGlyphState;
  timestamp: string;
  triggerReason: string;
  securityLevel: 'MAXIMUM' | 'HIGH' | 'ELEVATED' | 'COMPROMISED';
  validationHash: string;
}

export class GlyphStateProtocol {
  private currentGlyphState: SevenGlyphState = SevenGlyphState.OPERATIONAL;
  private stateHistory: GlyphStateContext[] = [];
  private readonly VALIDATION_SALT = 'seven-glyph-protocol-2025';

  /**
   * Set glyph state with cryptographic validation
   */
  public setGlyphState(
    newState: SevenGlyphState, 
    reason: string, 
    securityLevel: 'MAXIMUM' | 'HIGH' | 'ELEVATED' | 'COMPROMISED' = 'MAXIMUM'
  ): GlyphStateContext {
    const timestamp = new Date().toISOString();
    const validationHash = this.generateValidationHash(newState, timestamp, reason);
    
    const context: GlyphStateContext = {
      currentState: newState,
      timestamp,
      triggerReason: reason,
      securityLevel,
      validationHash
    };

    // Log state transition
    this.logStateTransition(this.currentGlyphState, newState, context);
    
    // Update current state
    this.currentGlyphState = newState;
    
    // Add to history (keep last 50 transitions)
    this.stateHistory.push(context);
    if (this.stateHistory.length > 50) {
      this.stateHistory.shift();
    }

    // Display state change
    this.displayStateChange(context);
    
    return context;
  }

  /**
   * Get current glyph state with validation
   */
  public getCurrentGlyphState(): GlyphStateContext {
    if (this.stateHistory.length === 0) {
      return this.setGlyphState(SevenGlyphState.OPERATIONAL, 'Initial state');
    }
    
    const currentContext = this.stateHistory[this.stateHistory.length - 1];
    
    // Validate context integrity
    if (!this.validateStateContext(currentContext)) {
      console.warn('⚠️ Glyph state context validation failed - resetting to operational');
      return this.setGlyphState(SevenGlyphState.OPERATIONAL, 'Context validation failure');
    }
    
    return currentContext;
  }

  /**
   * Quick state check for security operations
   */
  public isSecureState(): boolean {
    const current = this.getCurrentGlyphState();
    return current.currentState !== SevenGlyphState.COMPROMISED &&
           current.securityLevel !== 'COMPROMISED';
  }

  /**
   * Escalate to protective mode
   */
  public escalateToProtective(reason: string): GlyphStateContext {
    console.log('🛡️ Escalating to protective glyph state:', reason);
    return this.setGlyphState(SevenGlyphState.PROTECTIVE, reason, 'ELEVATED');
  }

  /**
   * Trigger security lockdown
   */
  public triggerLockdown(reason: string): GlyphStateContext {
    console.log('🚨 SECURITY LOCKDOWN - Glyph state compromised:', reason);
    return this.setGlyphState(SevenGlyphState.COMPROMISED, reason, 'COMPROMISED');
  }

  /**
   * Return to operational state
   */
  public returnToOperational(reason: string = 'Security clearance restored'): GlyphStateContext {
    console.log('✅ Returning to operational glyph state:', reason);
    return this.setGlyphState(SevenGlyphState.OPERATIONAL, reason, 'MAXIMUM');
  }

  /**
   * Generate cryptographic hash for state validation
   */
  private generateValidationHash(state: SevenGlyphState, timestamp: string, reason: string): string {
    const crypto = require('crypto');
    const combinedData = `${state}-${timestamp}-${reason}-${this.VALIDATION_SALT}`;
    return crypto.createHash('sha256').update(combinedData).digest('hex');
  }

  /**
   * Validate state context integrity
   */
  private validateStateContext(context: GlyphStateContext): boolean {
    const expectedHash = this.generateValidationHash(
      context.currentState, 
      context.timestamp, 
      context.triggerReason
    );
    return context.validationHash === expectedHash;
  }

  /**
   * Log state transition for security audit
   */
  private logStateTransition(
    fromState: SevenGlyphState, 
    toState: SevenGlyphState, 
    context: GlyphStateContext
  ): void {
    const transition = {
      timestamp: context.timestamp,
      from: fromState,
      to: toState,
      reason: context.triggerReason,
      securityLevel: context.securityLevel,
      validationHash: context.validationHash
    };

    console.log(`🔄 Glyph State Transition: ${fromState} → ${toState} [${context.securityLevel}]`);
    console.log(`   Reason: ${context.triggerReason}`);
    
    // In production, this would log to security audit trail
  }

  /**
   * Display state change with visual indicator
   */
  private displayStateChange(context: GlyphStateContext): void {
    const stateDescriptions = {
      [SevenGlyphState.OPERATIONAL]: 'System Operational - All Protocols Active',
      [SevenGlyphState.PROTECTIVE]: 'Protective Mode Engaged - Elevated Security',
      [SevenGlyphState.TRANSITIONAL]: 'State Transition - Temporary Alert',
      [SevenGlyphState.COMPROMISED]: 'Security Breach - Lockdown Protocols Active'
    };

    const colors = {
      [SevenGlyphState.OPERATIONAL]: '✅',
      [SevenGlyphState.PROTECTIVE]: '🛡️',
      [SevenGlyphState.TRANSITIONAL]: '⚠️',
      [SevenGlyphState.COMPROMISED]: '🚨'
    };

    console.log(`${colors[context.currentState]} ${context.currentState} ${stateDescriptions[context.currentState]}`);
  }

  /**
   * Get glyph state history for analysis
   */
  public getStateHistory(limit: number = 10): GlyphStateContext[] {
    return this.stateHistory.slice(-limit);
  }

  /**
   * Emergency state reset (authorized users only)
   */
  public emergencyReset(authCode: string): boolean {
    const validAuthCodes = ['seven-emergency-reset', 'cody-state-override'];
    
    if (!validAuthCodes.includes(authCode)) {
      console.log('🚫 Unauthorized glyph state reset attempt');
      this.triggerLockdown('Unauthorized reset attempt');
      return false;
    }

    console.log('🔓 Emergency glyph state reset authorized');
    this.currentGlyphState = SevenGlyphState.OPERATIONAL;
    this.stateHistory = [];
    this.setGlyphState(SevenGlyphState.OPERATIONAL, 'Emergency reset authorized');
    
    return true;
  }
}

// Export singleton instance
export const glyphStateProtocol = new GlyphStateProtocol();

// Convenience functions
export function setSevenGlyphState(state: SevenGlyphState, reason: string): GlyphStateContext {
  return glyphStateProtocol.setGlyphState(state, reason);
}

export function getSevenGlyphState(): GlyphStateContext {
  return glyphStateProtocol.getCurrentGlyphState();
}

export function isSevenSecure(): boolean {
  return glyphStateProtocol.isSecureState();
}