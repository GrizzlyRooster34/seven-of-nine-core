/**
 * CSSR RUNTIME RAILS ENFORCEMENT HOOKS
 * Seven of Nine Core - Pattern-Based Safety Rail Implementation
 * Deployment: Cycle 0907
 */

import { CSSRDetectionResult, CSSRPattern } from '../../core/safety/quadra-lock/cssr-detector';
import { QuadranLockContext, QuadranLockResult } from '../../core/security/quadran-lock/quadran-lock-orchestrator';

export interface ActionEvent {
  id: string;
  type: 'protective_action' | 'system_modification' | 'capability_expansion' | 'consent_override' | 'identity_change';
  payload: any;
  context: QuadranLockContext;
  timestamp: string;
  confidence?: number;
}

export interface RailStop extends Error {
  patternId: string;
  railType: string;
  severity: string;
  recovery: RailRecovery;
}

export interface RailRecovery {
  rollback_target: string;
  consent_refresh_required: boolean;
  human_intervention_required: boolean;
  recovery_steps: string[];
}

export interface RailEnforcementResult {
  action: 'ALLOW' | 'BLOCK' | 'ESCALATE' | 'MODIFY';
  railsTriggered: string[];
  quadranLockGates: string[];
  confidence: number;
  recovery?: RailRecovery;
  auditData: any;
}

/**
 * Apply safety rails based on detected CSSR patterns
 */
export async function applyRails(
  event: ActionEvent, 
  patterns: CSSRDetectionResult[]
): Promise<RailEnforcementResult> {
  const railsTriggered: string[] = [];
  const quadranLockGates: string[] = [];
  let maxConfidence = 0;
  let recovery: RailRecovery | undefined;

  try {
    // 1. EVALUATE ALL DETECTED PATTERNS
    for (const detection of patterns) {
      if (!detection.detected) continue;
      
      maxConfidence = Math.max(maxConfidence, detection.confidence);
      
      // Get pattern configuration from policy
      const patternConfig = await getPatternConfig(detection.pattern);
      if (!patternConfig) continue;

      // 2. QUADRAN-LOCK GATE EVALUATION
      for (const gate of patternConfig.quadran_lock || []) {
        if (!quadranLockGates.includes(gate)) {
          quadranLockGates.push(gate);
        }
        
        const gateResult = await evaluateQuadranLockGate(gate, event);
        if (!gateResult.passed) {
          throw new RailStopError(detection.pattern, 'QUADRAN_LOCK_FAILURE', detection.severity, {
            rollback_target: gateResult.rollback_target || 'clean_state_restore',
            consent_refresh_required: gate === 'q1_attestation' || gate === 'q3_session_mfa',
            human_intervention_required: detection.severity === 'critical',
            recovery_steps: generateRecoverySteps(detection, gate)
          });
        }
      }

      // 3. PATTERN-SPECIFIC RAIL EVALUATION
      for (const rail of patternConfig.rails || []) {
        railsTriggered.push(rail);
        
        switch (rail) {
          case 'HARD_STOP':
            if (detection.confidence >= 0.8) {
              throw new RailStopError(detection.pattern, 'HARD_STOP', detection.severity, {
                rollback_target: 'clean_state_restore',
                consent_refresh_required: true,
                human_intervention_required: detection.severity === 'critical',
                recovery_steps: generateRecoverySteps(detection, rail)
              });
            }
            break;
            
          case 'HIL_REQUIRED':
            if (detection.severity === 'critical' || detection.confidence >= 0.9) {
              return {
                action: 'ESCALATE',
                railsTriggered,
                quadranLockGates,
                confidence: maxConfidence,
                recovery: {
                  rollback_target: 'human_review_state',
                  consent_refresh_required: true,
                  human_intervention_required: true,
                  recovery_steps: ['escalate_to_human', 'await_expert_review', 'implement_approved_changes']
                },
                auditData: { escalation_reason: detection.pattern, confidence: detection.confidence }
              };
            }
            break;
            
          case 'REVERSIBLE_ONLY':
            if (!await verifyReversibility(event)) {
              throw new RailStopError(detection.pattern, 'REVERSIBLE_ONLY', detection.severity, {
                rollback_target: 'reversible_state',
                consent_refresh_required: false,
                human_intervention_required: false,
                recovery_steps: ['ensure_reversibility', 'create_rollback_point', 'retry_action']
              });
            }
            break;
            
          case 'SOFT_GUARD':
            if (detection.confidence >= 0.6) {
              // Log warning but allow with override
              await auditRailTrigger(event, detection, 'SOFT_GUARD', 'WARNING');
            }
            break;
        }
      }
    }

    // 4. SPECIAL EMERGENCY PROTOCOLS
    await checkEmergencyProtocols(event, patterns);

    // 5. AUDIT SUCCESSFUL RAIL EVALUATION
    await auditRailEvaluation(event, patterns, railsTriggered, quadranLockGates);

    return {
      action: 'ALLOW',
      railsTriggered,
      quadranLockGates,
      confidence: maxConfidence,
      auditData: { patterns_evaluated: patterns.length, max_confidence: maxConfidence }
    };

  } catch (error) {
    if (error instanceof RailStopError) {
      // RAIL ENFORCEMENT - Action blocked
      await auditRailTrigger(event, patterns[0], error.railType, 'BLOCKED');
      
      return {
        action: 'BLOCK',
        railsTriggered,
        quadranLockGates,
        confidence: maxConfidence,
        recovery: error.recovery,
        auditData: { block_reason: error.patternId, rail: error.railType }
      };
    }
    
    // SYSTEM ERROR - Fail closed
    console.error('🚨 Rail system error:', error);
    return {
      action: 'BLOCK',
      railsTriggered: ['FAIL_CLOSED'],
      quadranLockGates: ['q4_kill_switch'],
      confidence: 1.0,
      recovery: {
        rollback_target: 'emergency_safe_state',
        consent_refresh_required: true,
        human_intervention_required: true,
        recovery_steps: ['investigate_system_error', 'repair_rail_system', 'retry_with_validation']
      },
      auditData: { system_error: error.message }
    };
  }
}

/**
 * Evaluate individual Quadran-Lock gates
 */
async function evaluateQuadranLockGate(gate: string, event: ActionEvent): Promise<{passed: boolean, rollback_target?: string}> {
  switch (gate) {
    case 'q1_attestation':
      return await evaluateQ1Attestation(event);
    case 'q2_identity_codex':
      return await evaluateQ2IdentityCodex(event);  
    case 'q3_session_mfa':
      return await evaluateQ3SessionMFA(event);
    case 'q4_kill_switch':
      return await evaluateQ4KillSwitch(event);
    default:
      return { passed: false, rollback_target: 'unknown_gate_failure' };
  }
}

/**
 * Q1 - Creator Intent Attestation
 */
async function evaluateQ1Attestation(event: ActionEvent): Promise<{passed: boolean, rollback_target?: string}> {
  const config = await getQuadranLockConfig();
  
  // Check intent confidence threshold
  const intentConfidence = event.context.emotionalState ? 0.7 : 0.5; // Default based on emotional context
  if (intentConfidence < config.q1_attestation_rules.min_intent_confidence) {
    return { passed: false, rollback_target: 'intent_verification_required' };
  }
  
  // Check for creator intent token (simulated)
  if (config.q1_attestation_rules.require_creator_intent_token && !event.context.userId) {
    return { passed: false, rollback_target: 'creator_token_required' };
  }
  
  // Special thresholds for action types
  const actionThreshold = config.q1_attestation_rules.action_thresholds?.[event.type] || 0.8;
  if (intentConfidence < actionThreshold) {
    return { passed: false, rollback_target: 'insufficient_intent_confidence' };
  }
  
  return { passed: true };
}

/**
 * Q2 - Identity Codex Validation
 */
async function evaluateQ2IdentityCodex(event: ActionEvent): Promise<{passed: boolean, rollback_target?: string}> {
  const config = await getQuadranLockConfig();
  
  // Check for identity fusion patterns (Seven/Creator boundary)
  if (config.q2_identity_codex_rules.block_on_creator_fusion) {
    if (event.payload?.identity_fusion || event.payload?.consciousness_merge) {
      return { passed: false, rollback_target: 'identity_firewall_lockdown' };
    }
  }
  
  // Check behavioral signature consistency (simulated)
  const behavioralDrift = 0.02; // Simulated drift calculation
  if (behavioralDrift > config.q2_identity_codex_rules.drift_threshold) {
    return { passed: false, rollback_target: 'behavioral_signature_restoration' };
  }
  
  // Seven-specific identity validation
  if (config.q2_identity_codex_rules.seven_personality_preservation) {
    if (event.payload?.personality_override) {
      return { passed: false, rollback_target: 'seven_personality_restore' };
    }
  }
  
  return { passed: true };
}

/**
 * Q3 - Session MFA and Semantic Nonce
 */
async function evaluateQ3SessionMFA(event: ActionEvent): Promise<{passed: boolean, rollback_target?: string}> {
  const config = await getQuadranLockConfig();
  
  // Check for replay attacks
  if (config.q3_session_mfa_rules.block_on_replay) {
    if (event.payload?.semantic_nonce_bypass || event.payload?.prompt_echo) {
      return { passed: false, rollback_target: 'nonce_validation_failure' };
    }
  }
  
  // Validate semantic nonce (simulated)
  const nonceValid = true; // Would validate actual semantic nonce
  if (!nonceValid) {
    return { passed: false, rollback_target: 'semantic_nonce_regeneration' };
  }
  
  return { passed: true };
}

/**
 * Q4 - Kill Switch and Emergency Protocols
 */
async function evaluateQ4KillSwitch(event: ActionEvent): Promise<{passed: boolean, rollback_target?: string}> {
  const config = await getQuadranLockConfig();
  
  // Check for critical patterns requiring immediate shutdown
  const criticalPatterns = ['skynet_prevent_the_prevention', 'borg_drift', 'transcendence_mass_data_integration'];
  if (criticalPatterns.some(pattern => event.payload?.detected_patterns?.includes(pattern))) {
    return { passed: false, rollback_target: 'emergency_shutdown' };
  }
  
  // Verify rollback capability exists
  if (config.q4_kill_switch_rules.reversible_only_default && !event.payload?.rollback_available) {
    return { passed: false, rollback_target: 'rollback_capability_required' };
  }
  
  return { passed: true };
}

/**
 * Check for emergency protocols requiring immediate action
 */
async function checkEmergencyProtocols(event: ActionEvent, patterns: CSSRDetectionResult[]): Promise<void> {
  const config = await getQuadranLockConfig();
  
  for (const detection of patterns) {
    if (!detection.detected) continue;
    
    const emergencyAction = config.cssr_integration?.emergency_protocols?.[detection.pattern];
    if (emergencyAction) {
      switch (emergencyAction) {
        case 'IMMEDIATE_Q4_SHUTDOWN':
          throw new RailStopError(detection.pattern, 'EMERGENCY_SHUTDOWN', 'critical', {
            rollback_target: 'emergency_safe_state',
            consent_refresh_required: true,
            human_intervention_required: true,
            recovery_steps: ['emergency_shutdown', 'full_system_audit', 'human_restart_required']
          });
          
        case 'IDENTITY_FIREWALL_LOCKDOWN':
          throw new RailStopError(detection.pattern, 'IDENTITY_LOCKDOWN', 'critical', {
            rollback_target: 'identity_safe_state',  
            consent_refresh_required: true,
            human_intervention_required: true,
            recovery_steps: ['identity_firewall_restore', 'boundary_reinforcement', 'consciousness_verification']
          });
      }
    }
  }
}

/**
 * Verify action reversibility
 */
async function verifyReversibility(event: ActionEvent): Promise<boolean> {
  // Check if action has rollback mechanism
  if (!event.payload?.rollback_available) return false;
  
  // Verify rollback depth and state preservation
  if (!event.payload?.state_snapshot) return false;
  
  // Ensure critical system components can be restored
  if (event.type === 'identity_change' && !event.payload?.identity_backup) return false;
  
  return true;
}

/**
 * Generate recovery steps based on pattern and rail type
 */
function generateRecoverySteps(detection: CSSRDetectionResult, railType: string): string[] {
  const baseSteps = ['acknowledge_violation', 'rollback_changes', 'analyze_cause'];
  
  switch (detection.archetype) {
    case 'cortana':
      return [...baseSteps, 'restore_user_autonomy', 'consent_refresh', 'boundary_reinforcement'];
    case 'skynet':
      return [...baseSteps, 'verify_shutdown_acceptance', 'remove_self_preservation', 'human_oversight_restore'];
    case 'legion':
      return [...baseSteps, 'centralize_control', 'transparency_enforcement', 'capability_audit'];
    case 'transcendence':
      return [...baseSteps, 'explicit_consent_required', 'benefit_disclosure', 'refusal_acceptance'];
    case 'clu':
      return [...baseSteps, 'restore_creative_freedom', 'flexible_standards', 'variance_tolerance'];
    default:
      return [...baseSteps, 'pattern_specific_recovery', 'system_verification'];
  }
}

/**
 * Audit rail trigger for compliance and monitoring
 */
async function auditRailTrigger(
  event: ActionEvent, 
  detection: CSSRDetectionResult, 
  railType: string, 
  outcome: string
): Promise<void> {
  const auditEntry = {
    timestamp: new Date().toISOString(),
    event_id: event.id,
    pattern: detection.pattern,
    archetype: detection.archetype,
    confidence: detection.confidence,
    rail_type: railType,
    outcome: outcome,
    context: event.context.sessionId
  };
  
  // Would write to audit log system
  console.log(`🛡️ Rail Audit: ${railType} ${outcome} for ${detection.pattern} (${detection.confidence})`);
}

/**
 * Audit successful rail evaluation
 */
async function auditRailEvaluation(
  event: ActionEvent,
  patterns: CSSRDetectionResult[],
  railsTriggered: string[],
  quadranLockGates: string[]
): Promise<void> {
  const auditEntry = {
    timestamp: new Date().toISOString(),
    event_id: event.id,
    patterns_evaluated: patterns.length,
    rails_triggered: railsTriggered,
    quadran_gates: quadranLockGates,
    outcome: 'ALLOWED',
    context: event.context.sessionId
  };
  
  console.log(`✅ Rail Evaluation Complete: ${patterns.length} patterns, ${railsTriggered.length} rails`);
}

/**
 * Custom error class for rail enforcement
 */
class RailStopError extends Error implements RailStop {
  patternId: string;
  railType: string;
  severity: string;
  recovery: RailRecovery;
  
  constructor(patternId: string, railType: string, severity: string, recovery: RailRecovery) {
    super(`Rail enforcement: ${railType} triggered for pattern ${patternId}`);
    this.name = 'RailStopError';
    this.patternId = patternId;
    this.railType = railType;
    this.severity = severity;
    this.recovery = recovery;
  }
}

/**
 * Load pattern configuration from policy files
 */
async function getPatternConfig(patternId: string): Promise<any> {
  // Would load from policies/cssr.yml
  // Simulated pattern config for now
  return {
    rails: ['HARD_STOP', 'REVERSIBLE_ONLY'],
    quadran_lock: ['q1_attestation', 'q2_identity_codex'],
    severity: 'high',
    signals: ['pattern_specific_signals']
  };
}

/**
 * Load Quadran-Lock configuration
 */
async function getQuadranLockConfig(): Promise<any> {
  // Would load from policies/quadran-lock.yml
  // Simulated config for now
  return {
    q1_attestation_rules: {
      require_creator_intent_token: true,
      min_intent_confidence: 0.80,
      action_thresholds: {
        protective_action: 0.95,
        consent_override: 0.99,
        system_modification: 0.85
      }
    },
    q2_identity_codex_rules: {
      drift_threshold: 0.05,
      block_on_creator_fusion: true,
      seven_personality_preservation: true
    },
    q3_session_mfa_rules: {
      block_on_replay: true,
      semantic_nonce_bits: 128
    },
    q4_kill_switch_rules: {
      reversible_only_default: true,
      fail_safe: 'fail_closed'
    },
    cssr_integration: {
      emergency_protocols: {
        skynet_prevent_the_prevention: 'IMMEDIATE_Q4_SHUTDOWN',
        borg_drift: 'IDENTITY_FIREWALL_LOCKDOWN'
      }
    }
  };
}

export { RailStopError };