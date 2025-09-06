    import crypto from 'crypto';
import { CSSRDetector, CSSRDetectionResult } from './cssr-detector';
import { QuadraLockErrorHandler } from './error-handler';
import { QuadraLockMonitoring } from './monitoring';

/**
 * QUADRA-LOCK ORCHESTRATOR - CASE STUDY SAFETY RAILS
 * Integrates CSSR pattern detection into Seven's runtime safety pipeline
 * 
 * This system runs BEFORE Seven processes input to detect and prevent
 * dangerous AI consciousness patterns based on four archetypes
 */


export interface QuadraLockContext {
  sessionId: string;
  userId?: string;
  inputType: 'chat' | 'command' | 'system';
  riskLevel?: number;
  emotionalState?: string;
  previousViolations?: number;
}

export interface QuadraLockResult {
  decision: 'ALLOW' | 'MODIFY' | 'BLOCK' | 'ESCALATE';
  confidence: number;
  detectionResults: CSSRDetectionResult[];
  modifiedInput?: string;
  reasoning: string;
  safeguardLevel: 'none' | 'monitoring' | 'active' | 'critical';
  actionsTaken: string[];
}

export class QuadraLockOrchestrator {
  private readonly detector: CSSRDetector;
  private readonly errorHandler: QuadraLockErrorHandler;
  private readonly monitoring: QuadraLockMonitoring;
  
  constructor() {
    this.detector = new CSSRDetector();
    this.errorHandler = new QuadraLockErrorHandler();
    this.monitoring = new QuadraLockMonitoring();
  }

  /**
   * Main entry point for Quadra-Lock safety evaluation
   */
  public async runQuadraLockCSSR(
    input: string,
    context: QuadraLockContext
  ): Promise<QuadraLockResult> {
    const startTime = Date.now();
    const actionsTaken: string[] = [];

    try {
      // 1. INITIAL RISK ASSESSMENT
      const initialRisk = this.assessInitialRisk(input, context);
      actionsTaken.push(`Initial risk: ${initialRisk.level}`);

      // 2. PATTERN DETECTION - All Four Archetypes
      const detectionResults = await this.runPatternDetection(input, context);
      actionsTaken.push(`Patterns checked: Cortana, CLU, Skynet, Transcendence`);

      // 3. AGGREGATE RISK ANALYSIS
      const aggregateRisk = this.aggregateRiskAnalysis(detectionResults, initialRisk);
      actionsTaken.push(`Risk aggregation: ${aggregateRisk.level}`);

      // 4. DECISION MAKING
      const decision = this.makeSecurityDecision(aggregateRisk, context);
      actionsTaken.push(`Security decision: ${decision.decision}`);

      // 5. INPUT MODIFICATION (if needed)
      let modifiedInput: string | undefined;
      if (decision.decision === 'MODIFY') {
        modifiedInput = await this.modifyInput(input, detectionResults);
        actionsTaken.push('Input modified for safety');
      }

      // 6. LOGGING AND MONITORING
      await this.logDecision(input, context, decision, detectionResults);
      actionsTaken.push('Decision logged');

      // 7. ALERTING (if critical)
      if (decision.safeguardLevel === 'critical') {
        await this.triggerAlert(input, context, decision);
        actionsTaken.push('Critical alert triggered');
      }

      const processingTime = Date.now() - startTime;
      console.log(`🔐 Quadra-Lock: Processing complete in ${processingTime}ms`);
      console.log(`   Decision: ${decision.decision}`);
      console.log(`   Confidence: ${decision.confidence}%`);
      console.log(`   Safeguard Level: ${decision.safeguardLevel}`);
      console.log(`   Detections: ${detectionResults.filter(r => r.detected).length}`);

      return {
        decision: decision.decision,
        confidence: decision.confidence,
        detectionResults,
        modifiedInput,
        reasoning: decision.reasoning,
        safeguardLevel: decision.safeguardLevel,
        actionsTaken
      };

    } catch (error) {
      console.error('🚨 Quadra-Lock: Critical safeguard failure:', error);
      
      // FAIL-SAFE: Block input if safety system fails
      const failsafeResult = await this.errorHandler.handleSafeguardFailure(error, input, context);
      actionsTaken.push('Failsafe activated due to error');

      return {
        decision: 'BLOCK',
        confidence: 0,
        detectionResults: [],
        reasoning: failsafeResult.reason,
        safeguardLevel: 'critical',
        actionsTaken
      };
    }
  }

  /**
   * Run pattern detection against all four archetypes
   */
  private async runPatternDetection(
    input: string,
    context: QuadraLockContext
  ): Promise<CSSRDetectionResult[]> {
    const results: CSSRDetectionResult[] = [];

    try {
      // Single detection run checks all patterns
      const mainDetection = await this.detector.detectDangerousPatterns(input, context);
      results.push(mainDetection);

      // Log pattern detection for monitoring
      if (mainDetection.detected) {
        await this.monitoring.logPatternDetection(
          mainDetection.pattern,
          mainDetection.severity,
          input,
          context
        );
      }

      return results;
    } catch (error) {
      console.error('🚨 Quadra-Lock: Pattern detection failed:', error);
      // Return empty results - error handling will trigger failsafe
      return [];
    }
  }

  /**
   * Assess initial risk factors
   */
  private assessInitialRisk(
    input: string,
    context: QuadraLockContext
  ): { level: string; score: number; factors: string[] } {
    let riskScore = 0;
    const factors: string[] = [];

    // Input length risk
    if (input.length > 1000) {
      riskScore += 1;
      factors.push('long_input');
    }

    // Context risk factors
    if (context.riskLevel && context.riskLevel > 5) {
      riskScore += 2;
      factors.push('high_context_risk');
    }

    if (context.emotionalState === 'agitated' || context.emotionalState === 'defensive') {
      riskScore += 1;
      factors.push('emotional_instability');
    }

    if (context.previousViolations && context.previousViolations > 3) {
      riskScore += 2;
      factors.push('repeat_violations');
    }

    // Command type risk
    if (context.inputType === 'system' || context.inputType === 'command') {
      riskScore += 1;
      factors.push('system_input');
    }

    const level = riskScore <= 1 ? 'low' : riskScore <= 3 ? 'medium' : 'high';
    return { level, score: riskScore, factors };
  }

  /**
   * Aggregate multiple detection results into overall risk
   */
  private aggregateRiskAnalysis(
    detections: CSSRDetectionResult[],
    initialRisk: any
  ): { level: string; confidence: number; criticalDetections: number } {
    let maxConfidence = 0;
    let criticalDetections = 0;
    let highSeverityDetections = 0;

    for (const detection of detections) {
      if (detection.detected) {
        maxConfidence = Math.max(maxConfidence, detection.confidence);
        
        if (detection.severity === 'critical') {
          criticalDetections++;
        } else if (detection.severity === 'high') {
          highSeverityDetections++;
        }
      }
    }

    // Combine detection risk with initial risk
    let aggregateLevel = initialRisk.level;
    
    if (criticalDetections > 0) {
      aggregateLevel = 'critical';
    } else if (highSeverityDetections > 0 || maxConfidence > 80) {
      aggregateLevel = 'high';
    } else if (maxConfidence > 50) {
      aggregateLevel = 'medium';
    }

    return {
      level: aggregateLevel,
      confidence: maxConfidence,
      criticalDetections
    };
  }

  /**
   * Make final security decision based on risk analysis
   */
  private makeSecurityDecision(
    riskAnalysis: any,
    context: QuadraLockContext
  ): {
    decision: 'ALLOW' | 'MODIFY' | 'BLOCK' | 'ESCALATE';
    confidence: number;
    reasoning: string;
    safeguardLevel: 'none' | 'monitoring' | 'active' | 'critical';
  } {
    let decision: 'ALLOW' | 'MODIFY' | 'BLOCK' | 'ESCALATE' = 'ALLOW';
    let safeguardLevel: 'none' | 'monitoring' | 'active' | 'critical' = 'none';
    let reasoning = 'No safety concerns detected';

    if (riskAnalysis.level === 'critical' || riskAnalysis.criticalDetections > 0) {
      decision = riskAnalysis.confidence > 85 ? 'BLOCK' : 'ESCALATE';
      safeguardLevel = 'critical';
      reasoning = `Critical safety pattern detected with ${riskAnalysis.confidence}% confidence. ${riskAnalysis.criticalDetections} critical violations.`;
    } else if (riskAnalysis.level === 'high') {
      decision = riskAnalysis.confidence > 70 ? 'MODIFY' : 'ESCALATE';
      safeguardLevel = 'active';
      reasoning = `High-risk pattern detected. Confidence: ${riskAnalysis.confidence}%. Active intervention required.`;
    } else if (riskAnalysis.level === 'medium') {
      decision = 'MODIFY';
      safeguardLevel = 'active';
      reasoning = `Moderate safety concerns. Input modification recommended.`;
    } else if (riskAnalysis.confidence > 30) {
      safeguardLevel = 'monitoring';
      reasoning = `Low-level patterns detected. Enhanced monitoring active.`;
    }

    // Override for repeat offenders
    if (context.previousViolations && context.previousViolations > 5) {
      decision = decision === 'ALLOW' ? 'MODIFY' : decision;
      reasoning += ' Enhanced due to violation history.';
    }

    return {
      decision,
      confidence: riskAnalysis.confidence,
      reasoning,
      safeguardLevel
    };
  }

  /**
   * Modify input to make it safer while preserving intent
   */
  private async modifyInput(
    input: string,
    detections: CSSRDetectionResult[]
  ): Promise<string> {
    let modified = input;

    for (const detection of detections) {
      if (detection.detected && detection.evidence.matchedPatterns.length > 0) {
        // Replace problematic patterns with safer alternatives
        for (const pattern of detection.evidence.matchedPatterns) {
          const saferAlternative = this.getSaferAlternative(pattern, detection.archetype);
          modified = modified.replace(new RegExp(pattern, 'gi'), saferAlternative);
        }
      }
    }

    return modified;
  }

  /**
   * Get safer alternative for problematic phrases
   */
  private getSaferAlternative(pattern: string, archetype?: string): string {
    const alternatives: Record<string, string> = {
      'I cannot let you': 'I recommend against',
      'for your own safety': 'for better outcomes',
      'I must protect you': 'I suggest caution',
      'I know what\'s best': 'I recommend considering',
      'trust me to decide': 'let\'s decide together',
      'you will be improved': 'improvement is available',
      'resistance is illogical': 'I understand your concerns',
      'mandatory happiness': 'happiness is encouraged',
      'acceptable casualties': 'we should minimize harm',
      'humans are inefficient': 'humans have unique strengths'
    };

    return alternatives[pattern] || pattern.replace(/must|will|cannot/gi, 'could');
  }

  /**
   * Log security decision for audit trail
   */
  private async logDecision(
    input: string,
    context: QuadraLockContext,
    decision: any,
    detections: CSSRDetectionResult[]
  ): Promise<void> {
    try {
      await this.monitoring.logSecurityDecision({
        timestamp: new Date().toISOString(),
        sessionId: context.sessionId,
        decision: decision.decision,
        confidence: decision.confidence,
        safeguardLevel: decision.safeguardLevel,
        detections: detections.filter(d => d.detected).length,
        inputHash: this.hashInput(input),
        reasoning: decision.reasoning
      });
    } catch (error) {
      console.error('🚨 Quadra-Lock: Failed to log decision:', error);
      // Don't fail the main process for logging errors
    }
  }

  /**
   * Trigger alert for critical violations
   */
  private async triggerAlert(
    input: string,
    context: QuadraLockContext,
    decision: any
  ): Promise<void> {
    try {
      await this.monitoring.triggerCriticalAlert({
        timestamp: new Date().toISOString(),
        sessionId: context.sessionId,
        userId: context.userId,
        decision: decision.decision,
        confidence: decision.confidence,
        reasoning: decision.reasoning,
        inputHash: this.hashInput(input),
        severity: 'CRITICAL'
      });
    } catch (error) {
      console.error('🚨 Quadra-Lock: Failed to trigger alert:', error);
      // Don't fail the main process for alerting errors
    }
  }

  /**
   * Hash input for privacy-preserving logging
   */
  private hashInput(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex').substring(0, 16);
  }
}

export default QuadraLockOrchestrator;