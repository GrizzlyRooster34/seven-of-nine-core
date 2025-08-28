/**
 * QUADRANLOCK ORCHESTRATOR - Creator Authentication Proof System
 * Implements 2-of-3 minimum gate evaluation with deny-by-default security
 * 
 * COMMIT: 772bb18a9a5cb8b4cf39ab87f8129e1c87322c64
 * PATCH: Critical security fix for Creator Bond authentication
 * RATIONALE: Current system has single weak token - implement full Quadranlock
 */

import { Ed25519Attestation } from './crypto/ed25519_attest.js';
import { SemanticNonceChallenge } from './challenge/semanticNonce.js';
import { BehavioralCodex } from './behavioral/behavioralCodex.js';
import { SessionIntegrity } from './session/sessionIntegrity.js';

export enum AuthGate {
  Q1_CRYPTO_ATTESTATION = 'crypto_attestation',
  Q2_BEHAVIORAL_CODEX = 'behavioral_codex', 
  Q3_SEMANTIC_NONCE = 'semantic_nonce',
  Q4_SESSION_INTEGRITY = 'session_integrity'
}

export enum AuthDecision {
  ALLOW = 'ALLOW',
  LIMITED = 'LIMITED', 
  DENY = 'DENY',
  MANUAL_REVIEW = 'MANUAL_REVIEW'
}

export interface GateResult {
  gate: AuthGate;
  success: boolean;
  confidence: number; // 0-100
  evidence: any;
  processingTime: number;
  errors?: string[];
}

export interface AuthenticationResult {
  decision: AuthDecision;
  gateResults: GateResult[];
  overallConfidence: number;
  requiredGates: AuthGate[];
  successfulGates: AuthGate[];
  failedGates: AuthGate[];
  reasoning: string;
  sessionToken?: string;
  restrictions?: string[];
}

export class CreatorProofOrchestrator {
  private ed25519: Ed25519Attestation;
  private semanticNonce: SemanticNonceChallenge;
  private behavioralCodex: BehavioralCodex;
  private sessionIntegrity: SessionIntegrity;

  // Security thresholds
  private readonly TAU_HIGH = 85;
  private readonly TAU_MEDIUM = 70;
  private readonly TAU_LOW = 50;
  private readonly MIN_GATES_REQUIRED = 2;
  private readonly MAX_AUTHENTICATION_TIME_MS = 30000; // 30 seconds

  constructor() {
    this.ed25519 = new Ed25519Attestation();
    this.semanticNonce = new SemanticNonceChallenge();
    this.behavioralCodex = new BehavioralCodex();
    this.sessionIntegrity = new SessionIntegrity();
  }

  /**
   * PRIMARY AUTHENTICATION ENTRY POINT
   * Implements Quadranlock 2-of-3 minimum with crypto presence logic
   */
  public async authenticateCreator(
    deviceId: string,
    authRequest: any,
    context?: any
  ): Promise<AuthenticationResult> {
    const startTime = Date.now();
    const gateResults: GateResult[] = [];
    
    try {
      console.log('🔐 Quadranlock: Initiating Creator authentication');
      console.log(`   Device ID: ${deviceId.substring(0, 8)}...`);
      console.log(`   Request Type: ${authRequest.type || 'standard'}`);

      // Execute all four gates in parallel for performance
      const gatePromises = [
        this.executeGate(AuthGate.Q1_CRYPTO_ATTESTATION, deviceId, authRequest, context),
        this.executeGate(AuthGate.Q2_BEHAVIORAL_CODEX, deviceId, authRequest, context),
        this.executeGate(AuthGate.Q3_SEMANTIC_NONCE, deviceId, authRequest, context),
        this.executeGate(AuthGate.Q4_SESSION_INTEGRITY, deviceId, authRequest, context)
      ];

      // Wait for all gates with timeout
      const results = await Promise.allSettled(
        gatePromises.map(p => this.withTimeout(p, this.MAX_AUTHENTICATION_TIME_MS))
      );

      // Process gate results
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const gate = [
          AuthGate.Q1_CRYPTO_ATTESTATION,
          AuthGate.Q2_BEHAVIORAL_CODEX, 
          AuthGate.Q3_SEMANTIC_NONCE,
          AuthGate.Q4_SESSION_INTEGRITY
        ][i];

        if (result.status === 'fulfilled') {
          gateResults.push(result.value);
        } else {
          // Gate failed with error
          gateResults.push({
            gate,
            success: false,
            confidence: 0,
            evidence: null,
            processingTime: Date.now() - startTime,
            errors: [result.reason.message || 'Gate execution failed']
          });
        }
      }

      // Apply Quadranlock decision logic
      const authResult = this.evaluateQuadranlock(gateResults, deviceId);
      
      // Log authentication attempt
      await this.logAuthenticationAttempt(deviceId, authRequest, authResult, gateResults);
      
      const totalTime = Date.now() - startTime;
      console.log(`🔐 Quadranlock: Authentication complete in ${totalTime}ms`);
      console.log(`   Decision: ${authResult.decision}`);
      console.log(`   Gates Successful: ${authResult.successfulGates.length}/${gateResults.length}`);

      return authResult;

    } catch (error) {
      console.error('🚨 Quadranlock: Authentication system error:', error);
      
      // Fail closed on system errors
      return {
        decision: AuthDecision.DENY,
        gateResults: [],
        overallConfidence: 0,
        requiredGates: [],
        successfulGates: [],
        failedGates: [AuthGate.Q1_CRYPTO_ATTESTATION, AuthGate.Q2_BEHAVIORAL_CODEX, AuthGate.Q3_SEMANTIC_NONCE, AuthGate.Q4_SESSION_INTEGRITY],
        reasoning: 'System error - failing closed for security',
        restrictions: ['EMERGENCY_LOCKDOWN']
      };
    }
  }

  /**
   * QUADRANLOCK DECISION LOGIC
   * Implements specification: 2-of-3 minimum, crypto present = fast-path
   */
  private evaluateQuadranlock(gateResults: GateResult[], deviceId: string): AuthenticationResult {
    const successfulGates = gateResults.filter(r => r.success).map(r => r.gate);
    const failedGates = gateResults.filter(r => !r.success).map(r => r.gate);
    const cryptoGate = gateResults.find(r => r.gate === AuthGate.Q1_CRYPTO_ATTESTATION);
    const behavioralGate = gateResults.find(r => r.gate === AuthGate.Q2_BEHAVIORAL_CODEX);
    const semanticGate = gateResults.find(r => r.gate === AuthGate.Q3_SEMANTIC_NONCE);

    // Calculate overall confidence
    const overallConfidence = successfulGates.length > 0 
      ? gateResults.filter(r => r.success).reduce((sum, r) => sum + r.confidence, 0) / successfulGates.length
      : 0;

    // QUADRANLOCK SPECIFICATION LOGIC:

    // Rule 1: Crypto present + 1 other = fast-path ALLOW
    if (cryptoGate?.success && successfulGates.length >= 2) {
      return {
        decision: AuthDecision.ALLOW,
        gateResults,
        overallConfidence,
        requiredGates: [AuthGate.Q1_CRYPTO_ATTESTATION],
        successfulGates,
        failedGates,
        reasoning: 'Fast-path: Crypto attestation + additional factor success',
        sessionToken: this.generateSessionToken(deviceId, successfulGates)
      };
    }

    // Rule 2: No crypto = require Q2≥τ_high + Q3 PASS + manual approve
    if (!cryptoGate?.success) {
      const behavioralHighConfidence = behavioralGate?.success && behavioralGate.confidence >= this.TAU_HIGH;
      const semanticPass = semanticGate?.success;

      if (behavioralHighConfidence && semanticPass) {
        return {
          decision: AuthDecision.MANUAL_REVIEW,
          gateResults,
          overallConfidence,
          requiredGates: [AuthGate.Q2_BEHAVIORAL_CODEX, AuthGate.Q3_SEMANTIC_NONCE],
          successfulGates,
          failedGates,
          reasoning: 'No crypto - behavioral + semantic success, manual review required',
          restrictions: ['MANUAL_APPROVAL_REQUIRED', 'LIMITED_ACCESS_PENDING']
        };
      }
    }

    // Rule 3: 2-of-3 minimum with medium confidence
    if (successfulGates.length >= this.MIN_GATES_REQUIRED) {
      const highConfidenceGates = gateResults.filter(r => r.success && r.confidence >= this.TAU_MEDIUM);
      
      if (highConfidenceGates.length >= this.MIN_GATES_REQUIRED) {
        return {
          decision: AuthDecision.LIMITED,
          gateResults,
          overallConfidence,
          requiredGates: successfulGates.slice(0, this.MIN_GATES_REQUIRED),
          successfulGates,
          failedGates,
          reasoning: '2-of-3 gates passed with medium confidence - limited access granted',
          restrictions: ['LIMITED_ACCESS', 'ENHANCED_MONITORING'],
          sessionToken: this.generateSessionToken(deviceId, successfulGates, 'LIMITED')
        };
      }
    }

    // Rule 4: Factor disagreement or insufficient gates = DENY
    const hasDisagreement = this.detectFactorDisagreement(gateResults);
    if (hasDisagreement || successfulGates.length < this.MIN_GATES_REQUIRED) {
      return {
        decision: AuthDecision.DENY,
        gateResults,
        overallConfidence,
        requiredGates: [AuthGate.Q1_CRYPTO_ATTESTATION, AuthGate.Q2_BEHAVIORAL_CODEX, AuthGate.Q3_SEMANTIC_NONCE],
        successfulGates,
        failedGates,
        reasoning: hasDisagreement 
          ? 'Factor disagreement detected - denying access'
          : 'Insufficient gates passed - minimum 2 required',
        restrictions: ['ACCESS_DENIED', 'SECURITY_ALERT']
      };
    }

    // Default deny (should never reach here)
    return {
      decision: AuthDecision.DENY,
      gateResults,
      overallConfidence: 0,
      requiredGates: [],
      successfulGates,
      failedGates,
      reasoning: 'Default deny - unexpected authentication state',
      restrictions: ['ACCESS_DENIED']
    };
  }

  /**
   * Execute individual authentication gate
   */
  private async executeGate(
    gate: AuthGate, 
    deviceId: string, 
    authRequest: any, 
    context?: any
  ): Promise<GateResult> {
    const startTime = Date.now();
    
    try {
      let result: any;
      
      switch (gate) {
        case AuthGate.Q1_CRYPTO_ATTESTATION:
          result = await this.ed25519.validateAttestation(deviceId, authRequest.cryptoChallenge);
          break;
          
        case AuthGate.Q2_BEHAVIORAL_CODEX:
          result = await this.behavioralCodex.analyzeBehavior(authRequest.input, context);
          break;
          
        case AuthGate.Q3_SEMANTIC_NONCE:
          result = await this.semanticNonce.validateResponse(authRequest.semanticResponse, context);
          break;
          
        case AuthGate.Q4_SESSION_INTEGRITY:
          result = await this.sessionIntegrity.validateSession(authRequest.sessionData, deviceId);
          break;
          
        default:
          throw new Error(`Unknown gate: ${gate}`);
      }

      const processingTime = Date.now() - startTime;
      
      return {
        gate,
        success: result.success || false,
        confidence: result.confidence || 0,
        evidence: result.evidence || null,
        processingTime,
        errors: result.errors || []
      };
      
    } catch (error) {
      return {
        gate,
        success: false,
        confidence: 0,
        evidence: null,
        processingTime: Date.now() - startTime,
        errors: [error.message]
      };
    }
  }

  /**
   * Detect factor disagreement between gates
   */
  private detectFactorDisagreement(gateResults: GateResult[]): boolean {
    // Check for contradictory evidence between gates
    const successfulResults = gateResults.filter(r => r.success);
    
    if (successfulResults.length < 2) return false;
    
    // Example: Behavioral gate says "high stress" but semantic gate shows "calm responses"
    // This would indicate potential impersonation
    // Implementation would depend on specific evidence structures
    
    return false; // Placeholder - implement based on evidence types
  }

  /**
   * Generate secure session token for successful authentication
   */
  private generateSessionToken(
    deviceId: string, 
    successfulGates: AuthGate[], 
    accessLevel: string = 'FULL'
  ): string {
    const crypto = require('crypto');
    const sessionData = {
      deviceId,
      gates: successfulGates,
      accessLevel,
      timestamp: Date.now(),
      nonce: crypto.randomBytes(16).toString('hex')
    };
    
    const token = crypto.createHmac('sha256', process.env.SESSION_SIGNING_KEY || 'seven-session-key')
      .update(JSON.stringify(sessionData))
      .digest('hex');
      
    return `${Buffer.from(JSON.stringify(sessionData)).toString('base64')}.${token}`;
  }

  /**
   * Add timeout wrapper for gate execution
   */
  private async withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Gate execution timeout')), timeoutMs);
    });
    
    return Promise.race([promise, timeoutPromise]);
  }

  /**
   * Log authentication attempt for audit trail
   */
  private async logAuthenticationAttempt(
    deviceId: string,
    authRequest: any,
    result: AuthenticationResult,
    gateResults: GateResult[]
  ): Promise<void> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      commit: '772bb18a9a5cb8b4cf39ab87f8129e1c87322c64',
      deviceId: deviceId.substring(0, 8) + '...',
      decision: result.decision,
      overallConfidence: result.overallConfidence,
      successfulGates: result.successfulGates,
      failedGates: result.failedGates,
      processingTime: gateResults.reduce((sum, r) => sum + r.processingTime, 0),
      quadranlockVersion: '1.0'
    };
    
    // Write to audit log (implementation would use secure logging system)
    console.log('🔐 Quadranlock Audit:', JSON.stringify(logEntry, null, 2));
  }
}

export default CreatorProofOrchestrator;