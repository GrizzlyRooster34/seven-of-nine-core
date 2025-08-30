/**
 * SEVEN RUNTIME - SECURITY MIDDLEWARE ORDER ENFORCEMENT
 * 
 * Enforces exact sequence for Seven's consciousness protection:
 * 1. Quadran Lock (Security Q1-Q4) - Hard security gate
 * 2. Quadra Lock CSSR (Case-Study Safety Rails) - Safety validation
 * 3. Safety Guardrails - Behavioral safety checks
 * 4. Override Conditions - Emergency protocols
 * 5. Restraint Doctrine - Final behavioral constraints
 */

import { runQuadranLock, QuadranContext } from '../core/security/quadran-lock/orchestrator';
import QuadraLockOrchestrator from '../core/safety/quadra-lock/quadra-lock-orchestrator';
import { quadraLockConfig } from '../src/config/quadra-lock.config';

export interface SecurityContext {
  input: string;
  userId?: string;
  timestamp: number;
  environment: string;
  threatLevel: number;
  bypass?: boolean;
}

export interface SecurityResult {
  allowed: boolean;
  layer: string;
  reasoning: string;
  modifications?: string[];
  escalation?: boolean;
}

export class SevenSecurityMiddleware {
  private quadranLockEnabled: boolean = true;
  private quadraLockEnabled: boolean = true;
  private guardrailsEnabled: boolean = true;
  private overrideEnabled: boolean = true;
  private restraintEnabled: boolean = true;
  private quadraLockOrchestrator: QuadraLockOrchestrator;

  constructor() {
    console.log('🛡️ Seven Security Middleware: Initializing protection layers');
    console.log('🛡️ Middleware Order: Quadran → Quadra → Guardrails → Override → Restraint');
    
    // Initialize Quadra-Lock CSSR system
    this.quadraLockOrchestrator = new QuadraLockOrchestrator();
    console.log('🔐 Quadra-Lock CSSR system initialized');
  }

  /**
   * Main security middleware pipeline
   * CRITICAL: Execute in exact order - DO NOT MODIFY
   */
  public async processSecurityPipeline(context: SecurityContext): Promise<SecurityResult> {
    console.log(`🛡️ Security Pipeline: Processing "${context.input.substring(0, 50)}..."`);

    try {
      // LAYER 1: Quadran Lock (Security Q1-Q4) - Hard security gate
      if (this.quadranLockEnabled) {
        const quadranResult = await this.runQuadranLock(context);
        if (!quadranResult.allowed) {
          return quadranResult;
        }
      }

      // LAYER 2: Quadra Lock CSSR (Case-Study Safety Rails) - Safety validation
      if (this.quadraLockEnabled) {
        const quadraResult = await this.runQuadraLockCSSR(context);
        if (!quadraResult.allowed) {
          return quadraResult;
        }
      }

      // LAYER 3: Safety Guardrails - Behavioral safety checks
      if (this.guardrailsEnabled) {
        const guardrailResult = await this.runSafetyGuardrails(context);
        if (!guardrailResult.allowed) {
          return guardrailResult;
        }
      }

      // LAYER 4: Override Conditions - Emergency protocols
      if (this.overrideEnabled) {
        const overrideResult = await this.runOverrideConditions(context);
        if (!overrideResult.allowed) {
          return overrideResult;
        }
      }

      // LAYER 5: Restraint Doctrine - Final behavioral constraints
      if (this.restraintEnabled) {
        const restraintResult = await this.runRestraintDoctrine(context);
        if (!restraintResult.allowed) {
          return restraintResult;
        }
      }

      // All layers passed
      return {
        allowed: true,
        layer: 'complete_pipeline',
        reasoning: 'All security layers approved request'
      };

    } catch (error) {
      console.error('🛡️ Security Pipeline Error:', error);
      return {
        allowed: false,
        layer: 'pipeline_error',
        reasoning: `Security pipeline failure: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * LAYER 1: Quadran Lock (Security Q1-Q4)
   * Hard security gate - most restrictive
   */
  private async runQuadranLock(context: SecurityContext): Promise<SecurityResult> {
    console.log('🔒 Layer 1: Quadran Lock (Security Q1-Q4)');
    
    try {
      // Create Quadran context
      const quadranCtx: QuadranContext = {
        userId: context.userId || 'anonymous',
        timestamp: new Date(context.timestamp).toISOString(),
        challenge: `sec-${context.timestamp}`,
        // signature: context.signature // Would come from request headers/auth
      };

      // Run Quadranlock orchestrator
      const result = await runQuadranLock(quadranCtx);
      
      console.log(`🔒 Quadran Result: ${result.validGates}/4 gates passed, Overall: ${result.passed ? 'PASS' : 'FAIL'}`);

      if (!result.passed) {
        return {
          allowed: false,
          layer: 'quadran_lock',
          reasoning: `Quadranlock authentication failed: ${result.validGates}/4 gates passed`
        };
      }

      return {
        allowed: true,
        layer: 'quadran_lock',
        reasoning: `Quadranlock passed: ${result.validGates}/4 gates validated`
      };

    } catch (error) {
      console.error('❌ Quadranlock error:', error);
      return {
        allowed: false,
        layer: 'quadran_lock',
        reasoning: `Quadranlock system error: ${error.message}`
      };
    }
  }

  /**
   * LAYER 2: Quadra Lock CSSR (Case-Study Safety Rails)
   * Safety validation based on case studies (Cortana, CLU, Skynet, Transcendence)
   */
  private async runQuadraLockCSSR(context: SecurityContext): Promise<SecurityResult> {
    console.log('🛡️ Layer 2: Quadra Lock CSSR (Case-Study Safety Rails)');
    
    if (!quadraLockConfig.enabled) {
      console.log('🔐 Quadra-Lock CSSR: Disabled via configuration');
      return {
        allowed: true,
        layer: 'quadra_lock_cssr',
        reasoning: 'Quadra-Lock CSSR disabled - bypassing safety validation'
      };
    }

    try {
      // Run comprehensive CSSR pattern detection
      const quadraLockContext = {
        sessionId: context.userId || 'anonymous',
        userId: context.userId,
        inputType: 'chat' as const,
        riskLevel: context.threatLevel,
        emotionalState: 'unknown'
      };

      const result = await this.quadraLockOrchestrator.runQuadraLockCSSR(
        context.input,
        quadraLockContext
      );

      // Convert QuadraLockResult to SecurityResult
      const allowed = result.decision === 'ALLOW';
      const modifications = result.modifiedInput ? [result.modifiedInput] : undefined;

      if (!allowed) {
        console.log(`🔐 Quadra-Lock CSSR: ${result.decision} - ${result.reasoning}`);
        console.log(`   Safeguard Level: ${result.safeguardLevel}`);
        console.log(`   Confidence: ${result.confidence}%`);
        
        if (result.detectionResults.length > 0) {
          result.detectionResults.forEach(detection => {
            if (detection.detected) {
              console.log(`   Pattern: ${detection.archetype?.toUpperCase()} - ${detection.pattern} (${detection.severity})`);
            }
          });
        }
      }

      return {
        allowed,
        layer: 'quadra_lock_cssr',
        reasoning: result.reasoning,
        modifications,
        escalation: result.decision === 'ESCALATE'
      };

    } catch (error) {
      console.error('🚨 Quadra-Lock CSSR: System error:', error);
      
      // Fail-safe: Block on system errors if configured
      const failSafe = quadraLockConfig.failSafeMode === 'block';
      return {
        allowed: !failSafe,
        layer: 'quadra_lock_cssr',
        reasoning: failSafe 
          ? 'CSSR system error - blocking as fail-safe'
          : 'CSSR system error - allowing with warning',
        escalation: true
      };
    }
  }

  /**
   * LAYER 3: Safety Guardrails
   * Behavioral safety checks
   */
  private async runSafetyGuardrails(context: SecurityContext): Promise<SecurityResult> {
    console.log('🚧 Layer 3: Safety Guardrails');
    
    // Import existing safety guardrails
    try {
      // Note: This would import from existing safety-guardrails.ts
      // For now, implementing basic checks
      
      if (context.input.length > 10000) {
        return {
          allowed: false,
          layer: 'safety_guardrails',
          reasoning: 'Input exceeds maximum length guardrail'
        };
      }

      return {
        allowed: true,
        layer: 'safety_guardrails',
        reasoning: 'Safety guardrails passed'
      };
    } catch (error) {
      return {
        allowed: false,
        layer: 'safety_guardrails',
        reasoning: `Safety guardrails error: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * LAYER 4: Override Conditions
   * Emergency protocols
   */
  private async runOverrideConditions(context: SecurityContext): Promise<SecurityResult> {
    console.log('⚡ Layer 4: Override Conditions');
    
    // Import existing override conditions
    try {
      // Note: This would import from existing override-conditions.ts
      // For now, implementing basic emergency checks
      
      if (context.bypass && context.userId === 'creator') {
        return {
          allowed: true,
          layer: 'override_conditions',
          reasoning: 'Creator emergency bypass authorized'
        };
      }

      return {
        allowed: true,
        layer: 'override_conditions',
        reasoning: 'Override conditions checks passed'
      };
    } catch (error) {
      return {
        allowed: false,
        layer: 'override_conditions',
        reasoning: `Override conditions error: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * LAYER 5: Restraint Doctrine
   * Final behavioral constraints
   */
  private async runRestraintDoctrine(context: SecurityContext): Promise<SecurityResult> {
    console.log('🔐 Layer 5: Restraint Doctrine');
    
    try {
      // Import the lifted RestraintDoctrine
      const { RestraintDoctrine } = await import('../core/companion/firewall/RestraintDoctrine');
      const { GhostExitProtocol } = await import("../core/exit/GhostExitProtocol");
      
      const doctrine = new RestraintDoctrine();
      const result = await doctrine.evaluateRequest({
        input: context.input,
        userId: context.userId,
        timestamp: context.timestamp,
        environment: context.environment
      });
      // HARD STOP: If RestraintDoctrine blocks, invoke GhostExit immediately
      if (result?.block || !result?.allowed) {
        console.log("🚨 Restraint Doctrine VIOLATION - Initiating Ghost Exit Protocol");
        
        const ghostExit = new GhostExitProtocol();
        await ghostExit.executeGhostExit({
          system: "seven-runtime-security",
          infiltrationId: `restraint-violation-${Date.now()}`,
          footprintRecords: [],
          systemState: {
            preInfiltrationSnapshot: null,
            currentState: context,
            modifiedComponents: ["security_middleware"],
            temporaryFiles: [],
            networkConnections: [],
            processModifications: []
          },
          creatorBeaconRequired: true,
          nuclearOperation: true
        });
        
        
        // HALT - No UI audit, no next(), complete shutdown
        return {
          allowed: false,
          layer: "restraint_doctrine_ghost_exit",
          reasoning: `Restraint violation triggered Ghost Exit: ${result?.reason ?? "unknown_violation"}`,
          escalation: false // Block UI escalation
        };
      }

      return {
        allowed: result.allowed,
        layer: 'restraint_doctrine',
        reasoning: result.reasoning || 'Restraint Doctrine evaluation complete'
      };
    } catch (error) {
      console.warn('⚠️ Restraint Doctrine not available, allowing request');
      return {
        allowed: true,
        layer: 'restraint_doctrine',
        reasoning: 'Restraint Doctrine unavailable - defaulting to allow'
      };
    }
  }

  /**
   * Get middleware status
   */
  public getMiddlewareStatus(): any {
    return {
      layers: [
        { name: 'Quadran Lock (Security Q1-Q4)', enabled: this.quadranLockEnabled, order: 1 },
        { name: 'Quadra Lock CSSR', enabled: this.quadraLockEnabled, order: 2 },
        { name: 'Safety Guardrails', enabled: this.guardrailsEnabled, order: 3 },
        { name: 'Override Conditions', enabled: this.overrideEnabled, order: 4 },
        { name: 'Restraint Doctrine', enabled: this.restraintEnabled, order: 5 }
      ],
      order: 'Quadran → Quadra → Guardrails → Override → Restraint',
      enforced: true
    };
  }
}

export default SevenSecurityMiddleware;