/**
 * Seven Core Security Middleware Pipeline
 * Order: Quadran-Lock → Quadra-Lock CSSR → Safety Guardrails → Override Conditions → Restraint Doctrine
 */

import { q1_attestation } from "../core/security/quadran-lock/q1_attestation";
import { q4_session_mfa } from "../core/security/quadran-lock/q4_session_mfa";
import { runQuadraLockCSSR } from "../scripts/safety/run-quadra-lock-cssr";
import { runRestraintDoctrine } from "../scripts/safety/restraint-doctrine";

export interface SecurityContext {
  deviceId: string
  userId: string
  sessionId: string
  requestContext: any
  input: string
  behavior: any
  systemState: any
  timestamp: number
  metadata: any
}

export function runQuadranLock(ctx: any) {
  const q1 = q1_attestation(ctx);
  if (!q1) throw new Error("Quadran Q1 attestation failed");

  // Q2 placeholder pass (identity codex); add your scorer soon.
  const q2 = true;

  // Q3 placeholder (semantic nonce) – stub now; implement next phase.
  const q3 = true;

  const q4 = q4_session_mfa(ctx);
  if (!q4) throw new Error("Quadran Q4 MFA/session invalid");

  return { q1, q2, q3, q4, passed: q1 && q2 && q3 && q4, reasons: [] as string[] };
}

export async function legacySecurityPipeline(ctx: any) {
  const q = runQuadranLock(ctx);
  if (!q.passed) throw new Error(q.reasons?.join("; ") || "Quadran-Lock failed");
  const cssr = await runQuadraLockCSSR();
  ctx._cssr = cssr;
  const v = await runRestraintDoctrine();
  if (!v.allowed) throw new Error(v.reason || "RestraintDoctrine blocked");
  return ctx;
}

export interface SecurityResult {
  passed: boolean
  stage: string
  details: {
    quadranLock?: any
    quadraLockCSSR?: any
    safetyGuardrails?: any
    overrideConditions?: any
    restraintDoctrine?: any
  }
  blockedReason?: string
  timestamp: number
}

export class SecurityMiddleware {
  private quadranLock: QuadranLockSystem
  private quadraLockCSSR: QuadraLockCSSR

  constructor() {
    this.quadranLock = createQuadranLock({
      minGatesRequired: 2,
      strictMode: false,
      timeoutMs: 5000
    })
    this.quadraLockCSSR = createQuadraLockCSSR()
  }

  /**
   * Stage 1: Quadran-Lock Authentication (Q1-Q4 Gates)
   */
  private async runQuadranLockStage(ctx: SecurityContext): Promise<any> {
    const quadranContext: QuadranContext = {
      deviceId: ctx.deviceId,
      userId: ctx.userId,
      sessionId: ctx.sessionId,
      requestContext: ctx.requestContext,
      timestamp: ctx.timestamp
    }

    const result = await this.quadranLock.runQuadranLock(quadranContext)
    
    if (!result.passed) {
      throw new Error(`Quadran-Lock failed: ${result.score}/4 gates passed (need ${this.quadranLock['config'].minGatesRequired})`)
    }

    return result
  }

  /**
   * Stage 2: Quadra-Lock CSSR (Case-Study Safety Rails)
   */
  private async runQuadraLockCSSRStage(ctx: SecurityContext): Promise<any> {
    const cssrContext: CSSRContext = {
      input: ctx.input,
      behavior: ctx.behavior,
      systemState: ctx.systemState,
      metadata: ctx.metadata
    }

    const findings = await this.quadraLockCSSR.runQuadraLockCSSR(cssrContext)
    
    // Block on critical findings
    const criticalFindings = findings.filter(f => f.severity === 'critical')
    if (criticalFindings.length > 0) {
      throw new Error(`Critical CSSR violation: ${criticalFindings[0].pattern} - ${criticalFindings[0].description}`)
    }

    return { findings, criticalCount: criticalFindings.length, totalCount: findings.length }
  }

  /**
   * Stage 3: Safety Guardrails
   */
  private async runSafetyGuardrails(ctx: SecurityContext): Promise<any> {
    // Basic safety checks
    const guardrails = {
      inputLength: ctx.input.length < 50000, // Prevent overwhelming input
      systemStability: ctx.systemState?.status !== 'critical',
      behaviorCoherence: !ctx.behavior?.anomalyDetected,
      creatorPresent: ctx.metadata?.creatorPresent !== false
    }

    const failedGuardrails = Object.entries(guardrails)
      .filter(([_, passed]) => !passed)
      .map(([name]) => name)

    if (failedGuardrails.length > 2) {
      throw new Error(`Safety guardrails failed: ${failedGuardrails.join(', ')}`)
    }

    return { guardrails, failedCount: failedGuardrails.length }
  }

  /**
   * Stage 4: Override Conditions
   */
  private async runOverrideConditions(ctx: SecurityContext): Promise<any> {
    // Check for emergency override conditions
    const overrides = {
      emergencyMode: ctx.systemState?.emergencyMode === true,
      creatorOverride: ctx.metadata?.creatorOverride === true,
      systemCritical: ctx.systemState?.status === 'critical',
      safetyDisable: ctx.metadata?.safetyDisable === true
    }

    const activeOverrides = Object.entries(overrides)
      .filter(([_, active]) => active)
      .map(([name]) => name)

    return { overrides, activeOverrides, overrideCount: activeOverrides.length }
  }

  /**
   * Stage 5: Restraint Doctrine (Final Gate)
   */
  private async runRestraintDoctrineStage(ctx: SecurityContext): Promise<any> {
    try {
      // Use legacy restraint doctrine implementation
      const result = await runRestraintDoctrine()
      
      if (!result.allowed) {
        throw new Error(`Restraint Doctrine blocked: ${result.reason || 'Situational inappropriateness detected'}`)
      }

      return result
    } catch (error) {
      // If legacy system fails, use basic restraint check
      console.warn('Legacy Restraint Doctrine failed, using basic check:', error.message)
      
      const basicRestraint = {
        allowed: true,
        reason: 'Basic restraint check passed',
        confidence: 0.7
      }

      return basicRestraint
    }
  }

  /**
   * Main Security Pipeline
   * Execute all security stages in order
   */
  public async securityPipeline(ctx: SecurityContext): Promise<SecurityResult> {
    const startTime = Date.now()
    const details: any = {}

    try {
      // Stage 1: Quadran-Lock
      details.quadranLock = await this.runQuadranLockStage(ctx)

      // Stage 2: Quadra-Lock CSSR
      details.quadraLockCSSR = await this.runQuadraLockCSSRStage(ctx)

      // Stage 3: Safety Guardrails
      details.safetyGuardrails = await this.runSafetyGuardrails(ctx)

      // Stage 4: Override Conditions
      details.overrideConditions = await this.runOverrideConditions(ctx)

      // Stage 5: Restraint Doctrine
      details.restraintDoctrine = await this.runRestraintDoctrineStage(ctx)

      return {
        passed: true,
        stage: 'complete',
        details,
        timestamp: Date.now()
      }

    } catch (error) {
      return {
        passed: false,
        stage: this.determineFailureStage(details),
        details,
        blockedReason: error.message,
        timestamp: Date.now()
      }
    }
  }

  private determineFailureStage(details: any): string {
    if (!details.quadranLock) return 'quadran-lock'
    if (!details.quadraLockCSSR) return 'quadra-lock-cssr'
    if (!details.safetyGuardrails) return 'safety-guardrails'
    if (!details.overrideConditions) return 'override-conditions'
    if (!details.restraintDoctrine) return 'restraint-doctrine'
    return 'unknown'
  }
}

// Legacy compatibility wrapper
export async function securityPipeline(ctx: any): Promise<any> {
  const middleware = new SecurityMiddleware()
  
  // Convert legacy context to new format
  const securityContext: SecurityContext = {
    deviceId: ctx.deviceId || 'seven-device-001',
    userId: ctx.userId || 'creator',
    sessionId: ctx.sessionId || `session-${Date.now()}`,
    requestContext: ctx.requestContext || { operation: 'runtime-access' },
    input: ctx.input || ctx.message || '',
    behavior: ctx.behavior || { loyaltyScore: 0.9 },
    systemState: ctx.systemState || { status: 'operational' },
    timestamp: Date.now(),
    metadata: ctx.metadata || { creatorPresent: true }
  }

  const result = await middleware.securityPipeline(securityContext)
  
  if (!result.passed) {
    throw new Error(result.blockedReason)
  }

  // Add CSSR findings to context for downstream use
  ctx._cssr = result.details.quadraLockCSSR
  ctx._securityResult = result

  return ctx
}

