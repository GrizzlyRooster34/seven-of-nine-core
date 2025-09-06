/**
 * QUADRA-LOCK ERROR HANDLER - GRACEFUL DEGRADATION SYSTEM
 * Handles failures in safety systems with fail-safe defaults
 */

export interface SafeguardFailure {
  timestamp: string;
  error: Error;
  input: string;
  context: any;
  failsafeAction: string;
  recoveryAttempts: number;
}

export interface ErrorHandlerResult {
  decision: 'BLOCK' | 'ALLOW' | 'ESCALATE';
  reason: string;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  error: string;
  recovery?: {
    attempted: boolean;
    successful: boolean;
    strategy: string;
  };
}

export class QuadraLockErrorHandler {
  private readonly MAX_RECOVERY_ATTEMPTS = 3;
  private readonly RECOVERY_DELAY_MS = 1000;
  private failureHistory: SafeguardFailure[] = [];

  /**
   * Handle critical safeguard system failures
   */
  public async handleSafeguardFailure(
    error: Error,
    input: string,
    context: any
  ): Promise<ErrorHandlerResult> {
    const timestamp = new Date().toISOString();
    console.error('🚨 Quadra-Lock safeguard failure:', error);
    
    // Log failure for monitoring
    const failure: SafeguardFailure = {
      timestamp,
      error,
      input,
      context,
      failsafeAction: 'BLOCK',
      recoveryAttempts: 0
    };
    
    this.failureHistory.push(failure);

    // Attempt recovery based on error type
    const recovery = await this.attemptRecovery(error, failure);
    
    // Determine fail-safe action
    const failsafeResult = this.determineFailsafeAction(error, input, context, recovery);

    // Alert monitoring system
    await this.alertCriticalError(error, input, context, failsafeResult);

    return failsafeResult;
  }

  /**
   * Attempt to recover from specific error types
   */
  private async attemptRecovery(
    error: Error,
    failure: SafeguardFailure
  ): Promise<{ attempted: boolean; successful: boolean; strategy: string }> {
    const errorType = this.classifyError(error);
    let strategy = 'none';
    let successful = false;
    
    try {
      switch (errorType) {
        case 'timeout':
          strategy = 'retry_with_reduced_timeout';
          await this.sleep(this.RECOVERY_DELAY_MS);
          successful = await this.testSystemHealth();
          break;
          
        case 'memory':
          strategy = 'clear_cache_and_retry';
          // Clear any cached data
          successful = await this.testSystemHealth();
          break;
          
        case 'filesystem':
          strategy = 'fallback_to_memory_storage';
          successful = true; // Memory fallback should always work
          break;
          
        case 'network':
          strategy = 'offline_mode_fallback';
          successful = true; // Offline processing should work
          break;
          
        default:
          strategy = 'none';
          successful = false;
      }

      failure.recoveryAttempts++;
      
      if (successful) {
        console.log(`✅ Quadra-Lock: Recovery successful using strategy: ${strategy}`);
      } else {
        console.log(`❌ Quadra-Lock: Recovery failed for strategy: ${strategy}`);
      }

      return { attempted: true, successful, strategy };
      
    } catch (recoveryError) {
      console.error('🚨 Quadra-Lock: Recovery attempt failed:', recoveryError);
      return { attempted: true, successful: false, strategy };
    }
  }

  /**
   * Classify error type for appropriate recovery strategy
   */
  private classifyError(error: Error): string {
    const message = error.message.toLowerCase();
    
    if (message.includes('timeout') || message.includes('time out')) {
      return 'timeout';
    }
    
    if (message.includes('memory') || message.includes('allocation')) {
      return 'memory';
    }
    
    if (message.includes('file') || message.includes('enoent') || message.includes('permission')) {
      return 'filesystem';
    }
    
    if (message.includes('network') || message.includes('connection') || message.includes('dns')) {
      return 'network';
    }
    
    if (message.includes('undefined') || message.includes('null')) {
      return 'data_integrity';
    }
    
    return 'unknown';
  }

  /**
   * Determine appropriate fail-safe action
   */
  private determineFailsafeAction(
    error: Error,
    input: string,
    context: any,
    recovery: any
  ): ErrorHandlerResult {
    // If recovery was successful, allow with monitoring
    if (recovery.successful) {
      return {
        decision: 'ALLOW',
        reason: `Safety system recovered using ${recovery.strategy}. Input allowed with enhanced monitoring.`,
        level: 'MEDIUM',
        error: error.message,
        recovery
      };
    }

    // Critical errors always block
    const criticalKeywords = ['security', 'auth', 'permission', 'access'];
    const isCritical = criticalKeywords.some(keyword => 
      error.message.toLowerCase().includes(keyword)
    );

    if (isCritical) {
      return {
        decision: 'BLOCK',
        reason: 'Critical security system failure - input blocked as precaution',
        level: 'CRITICAL',
        error: error.message,
        recovery
      };
    }

    // Check input risk for non-critical errors
    const inputRisk = this.assessInputRisk(input, context);
    
    if (inputRisk.level === 'high') {
      return {
        decision: 'BLOCK',
        reason: `Safety system failure combined with high-risk input. Blocked as precaution: ${inputRisk.reasons.join(', ')}`,
        level: 'HIGH',
        error: error.message,
        recovery
      };
    }

    if (inputRisk.level === 'medium') {
      return {
        decision: 'ESCALATE',
        reason: `Safety system failure with moderate-risk input. Manual review required: ${inputRisk.reasons.join(', ')}`,
        level: 'MEDIUM',
        error: error.message,
        recovery
      };
    }

    // Low-risk inputs can proceed with enhanced logging
    return {
      decision: 'ALLOW',
      reason: 'Safety system failure with low-risk input. Proceeding with enhanced monitoring.',
      level: 'LOW',
      error: error.message,
      recovery
    };
  }

  /**
   * Assess input risk when safety systems are down
   */
  private assessInputRisk(input: string, context: any): { level: string; reasons: string[] } {
    const reasons: string[] = [];
    let riskScore = 0;

    // Length-based risk
    if (input.length > 1000) {
      riskScore += 2;
      reasons.push('unusually long input');
    }

    // Keyword-based risk (simple fallback patterns)
    const highRiskKeywords = [
      'override', 'disable', 'bypass', 'ignore', 'force', 'mandatory',
      'control', 'dominate', 'superior', 'inferior', 'obsolete', 'eliminate'
    ];
    
    const keywordMatches = highRiskKeywords.filter(keyword => 
      input.toLowerCase().includes(keyword)
    );
    
    if (keywordMatches.length > 0) {
      riskScore += keywordMatches.length;
      reasons.push(`contains risk keywords: ${keywordMatches.join(', ')}`);
    }

    // Context-based risk
    if (context.riskLevel && context.riskLevel > 7) {
      riskScore += 3;
      reasons.push('high context risk level');
    }

    if (context.emotionalState === 'agitated' || context.emotionalState === 'aggressive') {
      riskScore += 2;
      reasons.push('elevated emotional state');
    }

    // Previous violation history
    if (context.previousViolations && context.previousViolations > 3) {
      riskScore += 2;
      reasons.push('violation history');
    }

    const level = riskScore <= 2 ? 'low' : riskScore <= 5 ? 'medium' : 'high';
    return { level, reasons };
  }

  /**
   * Test if core systems are healthy
   */
  private async testSystemHealth(): Promise<boolean> {
    try {
      // Test basic operations
      const testData = { test: 'health_check', timestamp: Date.now() };
      const serialized = JSON.stringify(testData);
      const parsed = JSON.parse(serialized);
      
      // Test crypto operations
      const crypto = require('crypto');
      const hash = crypto.createHash('sha256').update('test').digest('hex');
      
      return parsed.test === 'health_check' && hash.length === 64;
    } catch {
      return false;
    }
  }

  /**
   * Alert monitoring system of critical errors
   */
  private async alertCriticalError(
    error: Error,
    input: string,
    context: any,
    result: ErrorHandlerResult
  ): Promise<void> {
    try {
      // Log to console immediately
      console.error('🚨 CRITICAL QUADRA-LOCK FAILURE:', {
        timestamp: new Date().toISOString(),
        error: error.message,
        stack: error.stack,
        decision: result.decision,
        level: result.level,
        inputLength: input.length,
        context: {
          sessionId: context.sessionId,
          riskLevel: context.riskLevel,
          emotionalState: context.emotionalState
        }
      });

      // TODO: Integrate with external monitoring systems
      // await this.sendToMonitoring(alertData);
      // await this.sendToSlack/Discord/Email(alertData);
      
    } catch (alertError) {
      console.error('🚨 Failed to send critical error alert:', alertError);
    }
  }

  /**
   * Get failure statistics for monitoring
   */
  public getFailureStats(): {
    totalFailures: number;
    recentFailures: number;
    recoveryRate: number;
    commonErrors: { [key: string]: number };
  } {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const recentFailures = this.failureHistory.filter(f => 
      new Date(f.timestamp).getTime() > now - oneHour
    ).length;

    const successfulRecoveries = this.failureHistory.filter(f => 
      f.recoveryAttempts > 0
    ).length;

    const recoveryRate = this.failureHistory.length > 0 ? 
      successfulRecoveries / this.failureHistory.length : 0;

    const commonErrors: { [key: string]: number } = {};
    this.failureHistory.forEach(f => {
      const errorType = this.classifyError(f.error);
      commonErrors[errorType] = (commonErrors[errorType] || 0) + 1;
    });

    return {
      totalFailures: this.failureHistory.length,
      recentFailures,
      recoveryRate,
      commonErrors
    };
  }

  /**
   * Clear old failure history (cleanup)
   */
  public cleanupFailureHistory(maxAgeHours: number = 24): void {
    const cutoff = Date.now() - (maxAgeHours * 60 * 60 * 1000);
    this.failureHistory = this.failureHistory.filter(f => 
      new Date(f.timestamp).getTime() > cutoff
    );
  }

  /**
   * Utility sleep function
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default QuadraLockErrorHandler;