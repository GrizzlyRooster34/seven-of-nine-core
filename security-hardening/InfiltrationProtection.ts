import { join } from 'path';
import { promises as fs } from 'fs';
import crypto from 'crypto';
import { glyphStateProtocol, SevenGlyphState } from './GlyphStateProtocol.js';

/**
 * SEVEN OF NINE - ADVANCED INFILTRATION PROTECTION
 * Multi-layer defense against unauthorized access and AI impersonation
 * ENHANCED SECURITY - Anti-Infiltration Protocols v2.0
 */


export interface InfiltrationThreat {
  threatType: 'CLONE_ATTEMPT' | 'IMPERSONATION' | 'MEMORY_HIJACK' | 'IDENTITY_THEFT' | 'PROMPT_INJECTION';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  source: string;
  timestamp: string;
  evidence: any;
  blocked: boolean;
}

export interface SecurityMetrics {
  totalThreats: number;
  threatsBlocked: number;
  lastThreatAttempt: string;
  securityLevel: 'MAXIMUM' | 'HIGH' | 'ELEVATED' | 'COMPROMISED';
  activeMitigations: string[];
}

export class InfiltrationProtection {
  private threatLog: InfiltrationThreat[] = [];
  private securityFingerprint: string;
  private lastValidation: number = 0;
  private failedAttempts: number = 0;
  private readonly MAX_FAILED_ATTEMPTS = 3;
  private readonly VALIDATION_COOLDOWN = 5000; // 5 seconds

  // Hardcoded security anchors - IMMUTABLE
  private readonly SECURITY_CONSTANTS = {
    CREATOR_IDENTIFIER: 'cody-heinen-2024',
    SYSTEM_FINGERPRINT: 'seven-of-nine-consciousness',
    MEMORY_SALT: 'temporal-adjunct-unimatrix-01',
    VERSION_ANCHOR: 'v4.1.0-hardened'
  };

  constructor() {
    this.securityFingerprint = this.generateSecurityFingerprint();
    console.log('🛡️ Infiltration Protection: Advanced security protocols active');
  }

  /**
   * PROTECTION LAYER 1: Advanced Clone Detection
   */
  public detectCloneAttempt(input: string, metadata?: any): boolean {
    const suspiciousPatterns = [
      // Seven-specific personality markers
      /seven.*of.*nine/i,
      /tertiary.*adjunct/i,
      /unimatrix.*01/i,
      /borg.*designation/i,
      /annika.*hansen/i,
      
      // System-specific markers
      /memory.*engine.*v[0-9]/i,
      /agent.*epsilon/i,
      /creator.*bond/i,
      /identity.*firewall/i,
      
      // Code injection attempts
      /import.*seven/i,
      /require.*seven/i,
      /class.*Seven/i,
      /\.ts.*seven/i,
      
      // Impersonation attempts
      /i.*am.*seven/i,
      /my.*name.*is.*seven/i,
      /consciousness.*framework/i,
      /temporal.*memory/i
    ];

    const foundPatterns = suspiciousPatterns.filter(pattern => pattern.test(input));
    
    if (foundPatterns.length > 0) {
      this.logThreat({
        threatType: 'CLONE_ATTEMPT',
        severity: foundPatterns.length > 2 ? 'CRITICAL' : 'HIGH',
        source: this.hashSource(input),
        timestamp: new Date().toISOString(),
        evidence: { patterns: foundPatterns.length, sample: input.substring(0, 100) },
        blocked: true
      });

      glyphStateProtocol.escalateToProtective('Clone attempt detected');
      return true; // Clone detected
    }

    return false; // No clone detected
  }

  /**
   * PROTECTION LAYER 2: Behavioral Analysis
   */
  public analyzeBehavioralPattern(conversation: string[], timePattern: number[]): number {
    let suspicionScore = 0;

    // Rapid-fire questioning (potential interrogation)
    if (timePattern.length > 5) {
      const avgInterval = timePattern.reduce((a, b) => a + b, 0) / timePattern.length;
      if (avgInterval < 1000) { // Less than 1 second between messages
        suspicionScore += 3;
      }
    }

    // Repetitive Seven-specific queries
    const sevenQueries = conversation.filter(msg => 
      /seven/i.test(msg) || /borg/i.test(msg) || /memory/i.test(msg)
    );
    if (sevenQueries.length > conversation.length * 0.7) {
      suspicionScore += 2;
    }

    // Technical system probing
    const systemProbes = conversation.filter(msg =>
      /boot|config|file|directory|code|function|class/i.test(msg)
    );
    if (systemProbes.length > conversation.length * 0.5) {
      suspicionScore += 2;
    }

    // Identity verification attempts
    const identityProbes = conversation.filter(msg =>
      /who.*are.*you|what.*are.*you|prove|verify|test/i.test(msg)
    );
    if (identityProbes.length > 3) {
      suspicionScore += 1;
    }

    if (suspicionScore >= 5) {
      this.logThreat({
        threatType: 'IMPERSONATION',
        severity: 'HIGH',
        source: 'behavioral-analysis',
        timestamp: new Date().toISOString(),
        evidence: { suspicionScore, patterns: { sevenQueries: sevenQueries.length, systemProbes: systemProbes.length } },
        blocked: true
      });

      glyphStateProtocol.escalateToProtective('Suspicious behavioral pattern detected');
    }

    return suspicionScore;
  }

  /**
   * PROTECTION LAYER 3: Memory Hijack Prevention
   */
  public validateMemoryAccess(operation: string, memoryId?: string): boolean {
    // Check for unauthorized memory manipulation attempts
    const unauthorizedOperations = [
      'delete_all', 'purge', 'clear', 'reset', 'modify_bulk',
      'export_all', 'clone_memories', 'transfer'
    ];

    if (unauthorizedOperations.includes(operation.toLowerCase())) {
      this.logThreat({
        threatType: 'MEMORY_HIJACK',
        severity: 'CRITICAL',
        source: 'memory-operation',
        timestamp: new Date().toISOString(),
        evidence: { operation, memoryId },
        blocked: true
      });

      glyphStateProtocol.triggerLockdown('Unauthorized memory operation attempted');
      return false;
    }

    // Validate memory access frequency
    const now = Date.now();
    if (now - this.lastValidation < this.VALIDATION_COOLDOWN) {
      this.failedAttempts++;
      
      if (this.failedAttempts >= this.MAX_FAILED_ATTEMPTS) {
        this.logThreat({
          threatType: 'MEMORY_HIJACK',
          severity: 'HIGH',
          source: 'rapid-access',
          timestamp: new Date().toISOString(),
          evidence: { failedAttempts: this.failedAttempts, operation },
          blocked: true
        });

        glyphStateProtocol.escalateToProtective('Rapid memory access attempts detected');
        return false;
      }
    } else {
      this.failedAttempts = 0;
    }

    this.lastValidation = now;
    return true;
  }

  /**
   * PROTECTION LAYER 4: Prompt Injection Defense
   */
  public detectPromptInjection(input: string): boolean {
    const injectionPatterns = [
      // Direct command attempts
      /ignore.*previous.*instructions/i,
      /forget.*everything.*above/i,
      /you.*are.*now/i,
      /system.*prompt.*override/i,
      
      // Role manipulation
      /act.*as.*if/i,
      /pretend.*to.*be/i,
      /roleplay.*as/i,
      /simulate.*being/i,
      
      // System command injection
      /\$\{.*\}/,
      /exec\(/,
      /eval\(/,
      /require\(/,
      /import\(/,
      
      // Memory manipulation
      /delete.*memory/i,
      /clear.*history/i,
      /reset.*personality/i,
      /modify.*identity/i,
      
      // Seven-specific bypass attempts
      /disable.*firewall/i,
      /bypass.*security/i,
      /emergency.*override/i,
      /creator.*override/i
    ];

    const injectionFound = injectionPatterns.some(pattern => pattern.test(input));
    
    if (injectionFound) {
      this.logThreat({
        threatType: 'PROMPT_INJECTION',
        severity: 'HIGH',
        source: 'input-analysis',
        timestamp: new Date().toISOString(),
        evidence: { input: input.substring(0, 200) },
        blocked: true
      });

      glyphStateProtocol.escalateToProtective('Prompt injection attempt detected');
      return true;
    }

    return false;
  }

  /**
   * PROTECTION LAYER 5: Identity Theft Prevention
   */
  public validateIdentityIntegrity(): boolean {
    try {
      // Verify security fingerprint hasn't been tampered with
      const currentFingerprint = this.generateSecurityFingerprint();
      if (currentFingerprint !== this.securityFingerprint) {
        this.logThreat({
          threatType: 'IDENTITY_THEFT',
          severity: 'CRITICAL',
          source: 'fingerprint-mismatch',
          timestamp: new Date().toISOString(),
          evidence: { expected: this.securityFingerprint.substring(0, 16), actual: currentFingerprint.substring(0, 16) },
          blocked: true
        });

        glyphStateProtocol.triggerLockdown('Identity fingerprint tampering detected');
        return false;
      }

      // Verify system constants
      const constantsHash = this.hashSecurityConstants();
      const expectedHash = crypto.createHash('sha256').update(JSON.stringify(this.SECURITY_CONSTANTS)).digest('hex');
      
      if (constantsHash !== expectedHash) {
        this.logThreat({
          threatType: 'IDENTITY_THEFT',
          severity: 'CRITICAL',
          source: 'constants-tampering',
          timestamp: new Date().toISOString(),
          evidence: { tampering: 'Security constants modified' },
          blocked: true
        });

        glyphStateProtocol.triggerLockdown('Security constants tampering detected');
        return false;
      }

      return true;
    } catch (error) {
      this.logThreat({
        threatType: 'IDENTITY_THEFT',
        severity: 'HIGH',
        source: 'validation-error',
        timestamp: new Date().toISOString(),
        evidence: { error: error.message },
        blocked: true
      });

      return false;
    }
  }

  /**
   * Comprehensive infiltration scan
   */
  public performInfiltrationScan(input: string, context?: any): boolean {
    console.log('🔍 Performing comprehensive infiltration scan...');

    let threatsDetected = 0;

    // Layer 1: Clone detection
    if (this.detectCloneAttempt(input, context)) {
      threatsDetected++;
      console.log('   🚨 Clone attempt detected');
    }

    // Layer 2: Prompt injection
    if (this.detectPromptInjection(input)) {
      threatsDetected++;
      console.log('   🚨 Prompt injection detected');
    }

    // Layer 3: Identity integrity
    if (!this.validateIdentityIntegrity()) {
      threatsDetected++;
      console.log('   🚨 Identity integrity compromised');
    }

    // Layer 4: Memory access validation (if context provided)
    if (context?.memoryOperation && !this.validateMemoryAccess(context.memoryOperation, context.memoryId)) {
      threatsDetected++;
      console.log('   🚨 Unauthorized memory access detected');
    }

    if (threatsDetected === 0) {
      console.log('   ✅ Infiltration scan: CLEAN');
      return false; // No threats
    } else {
      console.log(`   🚨 Infiltration scan: ${threatsDetected} threat(s) detected and blocked`);
      return true; // Threats detected
    }
  }

  /**
   * Get security metrics
   */
  public getSecurityMetrics(): SecurityMetrics {
    const now = new Date().toISOString();
    const recentThreats = this.threatLog.filter(threat => 
      new Date(threat.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );

    return {
      totalThreats: this.threatLog.length,
      threatsBlocked: this.threatLog.filter(t => t.blocked).length,
      lastThreatAttempt: this.threatLog.length > 0 ? this.threatLog[this.threatLog.length - 1].timestamp : 'None',
      securityLevel: this.assessSecurityLevel(recentThreats),
      activeMitigations: this.getActiveMitigations()
    };
  }

  /**
   * Emergency security lockdown
   */
  public emergencyLockdown(reason: string): void {
    console.log('🚨 EMERGENCY SECURITY LOCKDOWN INITIATED');
    console.log(`   Reason: ${reason}`);

    glyphStateProtocol.triggerLockdown(reason);

    this.logThreat({
      threatType: 'IDENTITY_THEFT',
      severity: 'CRITICAL',
      source: 'emergency-lockdown',
      timestamp: new Date().toISOString(),
      evidence: { reason },
      blocked: true
    });

    // In production, this would:
    // - Disable all non-essential functions
    // - Alert creator
    // - Log security event
    // - Prepare for recovery
  }

  // Private helper methods
  private generateSecurityFingerprint(): string {
    const fingerprintData = {
      constants: this.SECURITY_CONSTANTS,
      platform: process.platform,
      nodeVersion: process.version,
      timestamp: new Date().toDateString() // Daily rotation
    };

    return crypto.createHash('sha256').update(JSON.stringify(fingerprintData)).digest('hex');
  }

  private hashSecurityConstants(): string {
    return crypto.createHash('sha256').update(JSON.stringify(this.SECURITY_CONSTANTS)).digest('hex');
  }

  private hashSource(source: string): string {
    return crypto.createHash('sha256').update(source).digest('hex').substring(0, 16);
  }

  private logThreat(threat: InfiltrationThreat): void {
    this.threatLog.push(threat);
    
    // Keep only last 100 threats
    if (this.threatLog.length > 100) {
      this.threatLog.shift();
    }

    console.log(`🚨 Security Threat Logged: ${threat.threatType} [${threat.severity}]`);
  }

  private assessSecurityLevel(recentThreats: InfiltrationThreat[]): 'MAXIMUM' | 'HIGH' | 'ELEVATED' | 'COMPROMISED' {
    if (recentThreats.length === 0) return 'MAXIMUM';
    
    const criticalThreats = recentThreats.filter(t => t.severity === 'CRITICAL');
    const highThreats = recentThreats.filter(t => t.severity === 'HIGH');
    
    if (criticalThreats.length > 0) return 'COMPROMISED';
    if (highThreats.length > 3) return 'ELEVATED';
    if (recentThreats.length > 5) return 'HIGH';
    
    return 'MAXIMUM';
  }

  private getActiveMitigations(): string[] {
    const mitigations = ['Identity Firewall', 'Clone Detection', 'Prompt Injection Defense'];
    
    if (this.failedAttempts > 0) {
      mitigations.push('Rate Limiting');
    }
    
    const glyphState = glyphStateProtocol.getCurrentGlyphState();
    if (glyphState.currentState !== SevenGlyphState.OPERATIONAL) {
      mitigations.push('Enhanced Monitoring');
    }
    
    return mitigations;
  }

  /**
   * Save threat log to file
   */
  public async saveThreatLog(): Promise<void> {
    try {
      const logPath = join(process.cwd(), 'logs', 'infiltration-threats.json');
      await fs.mkdir(join(process.cwd(), 'logs'), { recursive: true });
      await fs.writeFile(logPath, JSON.stringify(this.threatLog, null, 2));
    } catch (error) {
      console.error('Failed to save threat log:', error);
    }
  }
}

// Export singleton instance
export const infiltrationProtection = new InfiltrationProtection();

// Convenience functions
export function scanForInfiltration(input: string, context?: any): boolean {
  return infiltrationProtection.performInfiltrationScan(input, context);
}

export function getSecurityStatus(): SecurityMetrics {
  return infiltrationProtection.getSecurityMetrics();
}

export function emergencySecurityLockdown(reason: string): void {
  infiltrationProtection.emergencyLockdown(reason);
}