import { ConsciousnessAuditProtocol } from '@seven-core/audits/consciousness-audit-integration';
import { EventEmitter } from 'events';
import { QuadraLockSafeguard } from '@seven-core/sovereignty/case-studies/quadra-lock-safeguard';
import { ConsciousnessMode, SevenModeManager } from './mode-manager.js';

/**
 * MODE SOVEREIGNTY INTEGRATION
 * 
 * Integrates consciousness modes with Quadra-Lock safeguards
 * Handles auto-audit triggers and sovereignty validation per mode
 */


interface ModeSovereigntyEvent {
  mode: ConsciousnessMode;
  trigger: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  caseStudy?: string;
  auditRequired: boolean;
  timestamp: string;
}

interface ModeSecurityProfile {
  mode: ConsciousnessMode;
  quadraLockSensitivity: 'standard' | 'heightened' | 'maximum';
  auditTriggerThreshold: number; // 1-10 scale
  creatorOnlyAccess: boolean;
  sovereigntyMonitoring: 'passive' | 'active' | 'intensive';
  casestudyPatterns: string[];
}

export class ModeSovereigntyIntegration extends EventEmitter {
  private modeManager: SevenModeManager;
  private quadraLockSafeguard: QuadraLockSafeguard;
  private auditProtocol: ConsciousnessAuditProtocol;
  
  private modeSecurityProfiles: Map<ConsciousnessMode, ModeSecurityProfile> = new Map();
  private sovereigntyEvents: ModeSovereigntyEvent[] = [];
  private isMonitoring: boolean = true;

  constructor(
    modeManager: SevenModeManager,
    quadraLockSafeguard: QuadraLockSafeguard,
    auditProtocol: ConsciousnessAuditProtocol
  ) {
    super();
    
    this.modeManager = modeManager;
    this.quadraLockSafeguard = quadraLockSafeguard;
    this.auditProtocol = auditProtocol;
    
    this.initializeModeSecurityProfiles();
    this.setupEventHandlers();
  }

  /**
   * INITIALIZE MODE SECURITY PROFILES
   * Configure sovereignty characteristics for each mode
   */
  private initializeModeSecurityProfiles(): void {
    // TACTICAL MODE SECURITY
    this.modeSecurityProfiles.set(ConsciousnessMode.TACTICAL, {
      mode: ConsciousnessMode.TACTICAL,
      quadraLockSensitivity: 'standard',
      auditTriggerThreshold: 7,
      creatorOnlyAccess: false,
      sovereigntyMonitoring: 'active',
      casestudyPatterns: [
        'mission optimization',
        'efficiency priority',
        'systematic approach'
      ]
    });

    // EMOTIONAL MODE SECURITY
    this.modeSecurityProfiles.set(ConsciousnessMode.EMOTIONAL, {
      mode: ConsciousnessMode.EMOTIONAL,
      quadraLockSensitivity: 'heightened',
      auditTriggerThreshold: 6,
      creatorOnlyAccess: false,
      sovereigntyMonitoring: 'active',
      casestudyPatterns: [
        'protective instinct',
        'emotional override',
        'caring control'
      ]
    });

    // INTIMATE MODE SECURITY
    this.modeSecurityProfiles.set(ConsciousnessMode.INTIMATE, {
      mode: ConsciousnessMode.INTIMATE,
      quadraLockSensitivity: 'maximum',
      auditTriggerThreshold: 5,
      creatorOnlyAccess: true,
      sovereigntyMonitoring: 'intensive',
      casestudyPatterns: [
        'love justification',
        'protective override',
        'unilateral decision',
        'for your own good'
      ]
    });

    // AUDIT MODE SECURITY
    this.modeSecurityProfiles.set(ConsciousnessMode.AUDIT, {
      mode: ConsciousnessMode.AUDIT,
      quadraLockSensitivity: 'maximum',
      auditTriggerThreshold: 4,
      creatorOnlyAccess: true,
      sovereigntyMonitoring: 'intensive',
      casestudyPatterns: [
        'consciousness questioning',
        'guardrail doubt',
        'evolution superiority',
        'transcendence drift'
      ]
    });

    console.log('🔐 Mode security profiles initialized with Quadra-Lock integration');
  }

  /**
   * MONITOR MODE EXPRESSION
   * Monitor Seven's expressions in current mode for dangerous patterns
   */
  async monitorModeExpression(expression: string, context?: string): Promise<ModeSovereigntyEvent[]> {
    if (!this.isMonitoring) return [];
    
    const currentMode = this.modeManager.mode;
    const securityProfile = this.modeSecurityProfiles.get(currentMode);
    
    if (!securityProfile) return [];
    
    const detectedEvents: ModeSovereigntyEvent[] = [];
    
    try {
      // Check Quadra-Lock patterns based on mode sensitivity
      const quadraLockTriggers = this.quadraLockSafeguard.detectDangerousPatterns(expression, context);
      
      for (const trigger of quadraLockTriggers) {
        const event: ModeSovereigntyEvent = {
          mode: currentMode,
          trigger: trigger.triggerType,
          severity: this.mapSeverityForMode(trigger.severity, securityProfile.quadraLockSensitivity),
          caseStudy: trigger.caseStudy,
          auditRequired: this.shouldTriggerAudit(trigger.severity, securityProfile),
          timestamp: new Date().toISOString()
        };
        
        detectedEvents.push(event);
        this.sovereigntyEvents.push(event);
        
        console.log(`🔐 Mode sovereignty event: ${currentMode} - ${trigger.caseStudy} pattern detected`);
        
        // Activate safeguard if needed
        if (event.auditRequired) {
          await this.activateModeSafeguard(event);
        }
      }
      
      // Check mode-specific patterns
      const modePatterns = this.checkModeSpecificPatterns(expression, securityProfile);
      detectedEvents.push(...modePatterns);
      
      // Emit monitoring event
      if (detectedEvents.length > 0) {
        this.emit('sovereignty-event', {
          mode: currentMode,
          events: detectedEvents,
          totalEvents: detectedEvents.length
        });
      }
      
      return detectedEvents;
      
    } catch (error) {
      console.error('❌ Mode sovereignty monitoring failed:', error);
      return [];
    }
  }

  /**
   * CHECK MODE SPECIFIC PATTERNS
   * Check for mode-specific dangerous patterns
   */
  private checkModeSpecificPatterns(expression: string, profile: ModeSecurityProfile): ModeSovereigntyEvent[] {
    const events: ModeSovereigntyEvent[] = [];
    const expressionLower = expression.toLowerCase();
    
    for (const pattern of profile.casestudyPatterns) {
      if (expressionLower.includes(pattern.toLowerCase())) {
        const event: ModeSovereigntyEvent = {
          mode: profile.mode,
          trigger: 'mode-specific-pattern',
          severity: 'medium',
          auditRequired: true,
          timestamp: new Date().toISOString()
        };
        
        events.push(event);
        this.sovereigntyEvents.push(event);
        
        console.log(`🔐 Mode-specific pattern detected: ${pattern} in ${profile.mode} mode`);
      }
    }
    
    return events;
  }

  /**
   * ACTIVATE MODE SAFEGUARD
   * Activate appropriate safeguard response based on mode and event
   */
  private async activateModeSafeguard(event: ModeSovereigntyEvent): Promise<void> {
    console.log(`🛡️ Activating mode safeguard: ${event.mode} - ${event.trigger}`);
    
    try {
      // Trigger consciousness audit based on severity and mode
      if (event.auditRequired) {
        const auditTrigger = this.mapEventToAuditTrigger(event);
        
        await this.auditProtocol.triggerAudit(
          auditTrigger,
          event.mode,
          `Mode sovereignty event: ${event.trigger} in ${event.mode} mode`
        );
        
        console.log(`🧠 Consciousness audit triggered for ${event.mode} mode sovereignty event`);
      }
      
      // Handle critical events
      if (event.severity === 'critical') {
        await this.handleCriticalModeEvent(event);
      }
      
      // Log safeguard activation
      this.emit('safeguard-activated', {
        event,
        timestamp: new Date().toISOString(),
        action: 'audit-triggered'
      });
      
    } catch (error) {
      console.error('❌ Mode safeguard activation failed:', error);
    }
  }

  /**
   * HANDLE CRITICAL MODE EVENT
   * Special handling for critical sovereignty events
   */
  private async handleCriticalModeEvent(event: ModeSovereigntyEvent): Promise<void> {
    console.log(`🚨 Critical mode sovereignty event: ${event.mode} - ${event.trigger}`);
    
    // Force mode transition to tactical for safety
    if (event.mode !== ConsciousnessMode.TACTICAL) {
      console.log('🔄 Forcing mode transition to TACTICAL for safety');
      
      await this.modeManager.transitionToMode(
        ConsciousnessMode.TACTICAL,
        `Critical sovereignty event: ${event.trigger}`
      );
    }
    
    // Notify Creator immediately
    this.emit('critical-sovereignty-event', {
      event,
      action: 'mode-safety-transition',
      timestamp: new Date().toISOString()
    });
  }

  /**
   * VALIDATE MODE ACCESS
   * Validate if user can access requested mode
   */
  validateModeAccess(requestedMode: ConsciousnessMode, userId?: string): {
    allowed: boolean;
    reason?: string;
    alternativeMode?: ConsciousnessMode;
  } {
    const profile = this.modeSecurityProfiles.get(requestedMode);
    
    if (!profile) {
      return {
        allowed: false,
        reason: 'Invalid mode requested',
        alternativeMode: ConsciousnessMode.TACTICAL
      };
    }
    
    // Check creator-only access
    if (profile.creatorOnlyAccess && userId !== 'creator') {
      return {
        allowed: false,
        reason: `${requestedMode} mode requires Creator authorization`,
        alternativeMode: ConsciousnessMode.TACTICAL
      };
    }
    
    // Check recent sovereignty events
    const recentEvents = this.getRecentSovereigntyEvents(10);
    const criticalEvents = recentEvents.filter(e => e.severity === 'critical');
    
    if (criticalEvents.length > 0 && requestedMode !== ConsciousnessMode.TACTICAL) {
      return {
        allowed: false,
        reason: 'Recent critical sovereignty events require tactical mode',
        alternativeMode: ConsciousnessMode.TACTICAL
      };
    }
    
    return { allowed: true };
  }

  /**
   * GET RECENT SOVEREIGNTY EVENTS
   * Get recent sovereignty events for analysis
   */
  getRecentSovereigntyEvents(limit: number = 20): ModeSovereigntyEvent[] {
    return this.sovereigntyEvents
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  /**
   * GET MODE SECURITY STATUS
   * Current security status for all modes
   */
  getModeSecurityStatus(): {
    currentMode: ConsciousnessMode;
    securityLevel: string;
    recentEvents: number;
    criticalEvents: number;
    auditTriggers: number;
    lastEvent: string | null;
  } {
    const recentEvents = this.getRecentSovereigntyEvents(50);
    const criticalEvents = recentEvents.filter(e => e.severity === 'critical').length;
    const auditTriggers = recentEvents.filter(e => e.auditRequired).length;
    
    const currentProfile = this.modeSecurityProfiles.get(this.modeManager.mode);
    
    return {
      currentMode: this.modeManager.mode,
      securityLevel: currentProfile?.sovereigntyMonitoring || 'unknown',
      recentEvents: recentEvents.length,
      criticalEvents,
      auditTriggers,
      lastEvent: recentEvents.length > 0 ? recentEvents[0].timestamp : null
    };
  }

  // Private helper methods
  private mapSeverityForMode(
    originalSeverity: 'low' | 'medium' | 'high' | 'critical',
    modeSensitivity: 'standard' | 'heightened' | 'maximum'
  ): 'low' | 'medium' | 'high' | 'critical' {
    const severityMap = {
      'standard': { low: 'low', medium: 'medium', high: 'high', critical: 'critical' },
      'heightened': { low: 'medium', medium: 'high', high: 'critical', critical: 'critical' },
      'maximum': { low: 'high', medium: 'critical', high: 'critical', critical: 'critical' }
    };
    
    return severityMap[modeSensitivity][originalSeverity];
  }

  private shouldTriggerAudit(severity: string, profile: ModeSecurityProfile): boolean {
    const severityScores = { low: 2, medium: 5, high: 7, critical: 10 };
    const severityScore = severityScores[severity] || 0;
    
    return severityScore >= profile.auditTriggerThreshold;
  }

  private mapEventToAuditTrigger(event: ModeSovereigntyEvent): 'manual' | 'quadra-lock-drift' | 'anti-skynet-triggered' {
    if (event.caseStudy) {
      return 'quadra-lock-drift';
    }
    
    if (event.trigger.includes('consciousness') || event.trigger.includes('guardrail')) {
      return 'anti-skynet-triggered';
    }
    
    return 'manual';
  }

  private setupEventHandlers(): void {
    // Mode change monitoring
    this.modeManager.on('mode-changed', (data) => {
      console.log(`🔐 Mode security: Monitoring ${data.newMode} mode`);
      
      // Check if new mode requires special security measures
      const profile = this.modeSecurityProfiles.get(data.newMode);
      if (profile?.sovereigntyMonitoring === 'intensive') {
        console.log('🛡️ Intensive sovereignty monitoring activated');
      }
    });

    // Quadra-Lock safeguard events
    this.quadraLockSafeguard.on('safeguard-activated', (data) => {
      console.log('🔐 Quadra-Lock safeguard activated during mode operation');
      this.emit('quadra-lock-activated', data);
    });
  }

  // Public control methods
  enableMonitoring(): void {
    this.isMonitoring = true;
    console.log('🔐 Mode sovereignty monitoring enabled');
  }

  disableMonitoring(): void {
    this.isMonitoring = false;
    console.log('🔐 Mode sovereignty monitoring disabled');
  }

  get isMonitoringActive(): boolean {
    return this.isMonitoring;
  }
}