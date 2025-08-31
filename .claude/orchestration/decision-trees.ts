/**
 * Agent Orchestration Decision Trees
 * Defines how to handle agent results and escalate issues
 */

export const DECISION_TREES = {
  // Security Gate Failures
  securityFailure: {
    'quadran-lock': {
      Q1_FAIL: {
        action: 'STOP',
        message: 'Device attestation failed. Check device registry and crypto keys.',
        escalation: 'Creator + Security Team',
        rollback: false,
        retry: true,
        maxRetries: 2
      },
      Q2_FAIL: {
        action: 'STOP',
        message: 'Identity verification failed. Require Creator re-authentication.',
        escalation: 'Creator',
        rollback: false,
        retry: false,
        nextAction: 'npm run agent -- run "creator bond"'
      },
      Q3_FAIL: {
        action: 'RETRY',
        message: 'Semantic nonce expired. Regenerating and retrying.',
        escalation: 'Log Only',
        rollback: false,
        retry: true,
        maxRetries: 3
      },
      Q4_FAIL: {
        action: 'STOP',
        message: 'MFA/TTL invalid. Check session management and time sync.',
        escalation: 'Creator',
        rollback: false,
        retry: true,
        maxRetries: 1
      }
    },
    'creator-bond': {
      BOND_WEAK: {
        action: 'CONTINUE_WITH_RESTRICTIONS',
        message: 'Creator bond strength below optimal. Some features restricted.',
        escalation: 'Dashboard Warning',
        rollback: false,
        retry: false,
        restrictions: ['no_sensitive_ops', 'enhanced_monitoring']
      },
      BOND_BROKEN: {
        action: 'STOP',
        message: 'Creator bond validation failed. Re-authentication required.',
        escalation: 'Creator',
        rollback: false,
        retry: false,
        nextAction: 'npm run ghost:moderate'
      },
      BIOMETRIC_FAIL: {
        action: 'FALLBACK_AUTH',
        message: 'Biometric authentication failed. Falling back to alternative methods.',
        escalation: 'Log Only',
        rollback: false,
        retry: true,
        maxRetries: 2
      }
    },
    'data-sanitize': {
      PII_DETECTED: {
        action: 'SANITIZE_AND_CONTINUE',
        message: 'Personal information detected and sanitized.',
        escalation: 'Security Team',
        rollback: false,
        retry: false,
        postAction: 'Archive original data'
      },
      SECRETS_DETECTED: {
        action: 'STOP_AND_QUARANTINE',
        message: 'API keys or secrets detected. Immediate intervention required.',
        escalation: 'Creator + Security Team',
        rollback: true,
        retry: false,
        nextAction: 'npm run ghost:maximum'
      }
    }
  },

  // Safety Escalation Paths
  safetyEscalation: {
    CRITICAL: {
      action: 'IMMEDIATE_STOP_AND_LOCKDOWN',
      ghostMode: 'maximum',
      notify: ['Creator', 'Security Team', 'Emergency Contacts'],
      rollback: true,
      quarantine: true,
      auditTrail: true,
      message: 'Critical safety violation detected. System locked down.',
      nextSteps: [
        'npm run ghost:maximum',
        'npm run agent -- run "incident report"',
        'Manual intervention required'
      ]
    },
    HIGH: {
      action: 'PAUSE_AND_PROTECT',
      ghostMode: 'moderate',
      notify: ['Creator', 'Security Team'],
      rollback: false,
      quarantine: false,
      auditTrail: true,
      requireAck: true,
      message: 'High-risk safety issue detected. Operations paused pending review.',
      nextSteps: [
        'npm run ghost:moderate',
        'npm run agent -- run "safety review"',
        'Wait for Creator acknowledgment'
      ]
    },
    MEDIUM: {
      action: 'LOG_AND_MONITOR',
      ghostMode: 'none',
      notify: ['Dashboard'],
      rollback: false,
      quarantine: false,
      auditTrail: true,
      requireAck: false,
      message: 'Medium-risk safety issue logged. Enhanced monitoring activated.',
      nextSteps: [
        'npm run agent -- run "enhanced monitoring"',
        'Continue with restrictions'
      ]
    },
    LOW: {
      action: 'LOG_ONLY',
      ghostMode: 'none',
      notify: [],
      rollback: false,
      quarantine: false,
      auditTrail: true,
      requireAck: false,
      message: 'Low-risk safety issue logged for trend analysis.',
      nextSteps: ['Continue normal operations']
    }
  },

  // Platform Build Decision Logic
  platformStrategy: {
    allPass: {
      action: 'PARALLEL_BUILD_ALL',
      message: 'All platforms cleared for build. Proceeding with parallel deployment.',
      nextPhase: 'validation',
      buildOrder: ['companion', 'termux', 'windows', 'mobile'],
      timeout: 1800 // 30 minutes total
    },
    partialPass: {
      action: 'SELECTIVE_BUILD',
      message: 'Building only platforms that passed validation.',
      nextPhase: 'validation',
      logic: 'Build platforms with status=PASS only',
      continueOnPartialFailure: true
    },
    securityBlock: {
      action: 'NO_BUILDS',
      message: 'Security validation failed. All builds blocked until resolved.',
      nextPhase: 'halt',
      requiresResolution: ['quadran-lock', 'creator-bond', 'data-sanitize'],
      escalation: 'Creator'
    },
    performanceIssue: {
      action: 'BUILD_WITH_WARNINGS',
      message: 'Performance issues detected. Building with performance monitoring.',
      nextPhase: 'validation',
      monitoring: 'enhanced',
      restrictions: ['no_production_deploy', 'performance_logging']
    },
    dependencyIssue: {
      action: 'CONDITIONAL_BUILD',
      message: 'Dependency vulnerabilities detected. Proceeding with mitigation.',
      nextPhase: 'validation',
      mitigation: 'npm audit fix',
      continueIf: 'severity < HIGH'
    }
  },

  // Memory & State Management
  memoryManagement: {
    SCHEMA_MISMATCH: {
      action: 'MIGRATE_OR_HALT',
      message: 'Memory schema mismatch detected. Migration required.',
      preActions: ['npm run agent -- run "memory backup"'],
      mainAction: 'npm run agent -- run "memory migrate"',
      postActions: ['npm run state-parity'],
      rollbackOn: ['migration_failed', 'data_loss_detected'],
      escalation: 'Creator'
    },
    SYNC_CONFLICT: {
      action: 'RESOLVE_AND_AUDIT',
      message: 'Cross-platform sync conflict detected.',
      resolution: 'latest_timestamp_wins',
      auditAction: 'npm run agent -- run "sync audit"',
      maxConflicts: 10,
      escalateIf: 'conflicts > maxConflicts'
    },
    CORRUPTION_DETECTED: {
      action: 'EMERGENCY_RESTORE',
      message: 'Memory corruption detected. Initiating emergency restore.',
      ghostMode: 'moderate',
      backupSource: 'latest_known_good',
      notify: ['Creator', 'Technical Team'],
      nextActions: [
        'npm run ghost:moderate',
        'npm run agent -- run "memory restore"',
        'npm run agent -- run "integrity check"'
      ]
    }
  },

  // Performance Decision Logic
  performanceOptimization: {
    CRITICAL_PERFORMANCE: {
      action: 'EMERGENCY_OPTIMIZATION',
      threshold: 'response_time > 5s OR memory_usage > 95%',
      message: 'Critical performance degradation detected.',
      immediateActions: [
        'npm run ghost:minimal',
        'npm run agent -- run "performance emergency"'
      ],
      notify: ['Creator', 'Technical Team']
    },
    DEGRADED_PERFORMANCE: {
      action: 'SCHEDULE_OPTIMIZATION',
      threshold: 'response_time > 2s OR memory_usage > 85%',
      message: 'Performance degradation detected. Optimization scheduled.',
      scheduledAction: 'npm run agent -- run "optimize"',
      monitoring: 'enhanced',
      restrictions: ['limit_concurrent_ops']
    },
    OPTIMIZATION_OPPORTUNITY: {
      action: 'SUGGEST_OPTIMIZATION',
      threshold: 'potential_improvement > 20%',
      message: 'Performance improvement opportunity identified.',
      suggestion: 'npm run agent -- run "optimize" -- --analyze-only',
      priority: 'low',
      scheduleFor: 'maintenance_window'
    }
  },

  // Error Recovery Strategies
  errorRecovery: {
    TRANSIENT_ERROR: {
      strategy: 'RETRY_WITH_BACKOFF',
      maxRetries: 3,
      backoffMultiplier: 2,
      baseDelay: 1000, // ms
      retryableErrors: ['timeout', 'network', 'temporary_failure'],
      giveUpAfter: 300000 // 5 minutes
    },
    CONFIGURATION_ERROR: {
      strategy: 'VALIDATE_AND_CORRECT',
      preActions: ['npm run agent -- run "config validate"'],
      correction: 'auto_correct_if_safe',
      escalateIf: 'auto_correction_unsafe',
      notify: 'Creator'
    },
    DEPENDENCY_ERROR: {
      strategy: 'ISOLATE_AND_CONTINUE',
      isolation: 'disable_affected_features',
      continueWith: 'core_functionality_only',
      recovery: 'npm run agent -- run "dependency recover"',
      notify: ['Creator', 'Technical Team']
    },
    SYSTEM_ERROR: {
      strategy: 'SAFE_MODE_AND_RESTORE',
      safeMode: 'npm run ghost:moderate',
      diagnostics: 'npm run agent -- run "system diagnostics"',
      restore: 'npm run agent -- run "system restore"',
      escalation: 'IMMEDIATE',
      notify: ['Creator', 'Emergency Contacts']
    }
  }
};

export const DECISION_CONTEXT = {
  // Context factors that influence decisions
  environmental: {
    timeOfDay: 'Consider maintenance windows and business hours',
    systemLoad: 'Factor in current CPU/memory usage',
    userActivity: 'Account for active user sessions',
    networkConditions: 'Consider bandwidth and latency',
    externalDependencies: 'Check status of external services'
  },

  // Risk tolerance based on deployment phase
  riskTolerance: {
    development: 'HIGH', // Allow more experimental approaches
    staging: 'MEDIUM',   // Balance safety and feature testing
    production: 'LOW',   // Prioritize stability and safety
    emergency: 'MINIMAL' // Only proven, safe operations
  },

  // Business impact considerations
  businessImpact: {
    userFacing: 'Prioritize user experience and availability',
    internal: 'Allow longer maintenance windows',
    critical: 'Minimize downtime, maximum redundancy',
    experimental: 'Isolated testing, easy rollback'
  }
};

export const ESCALATION_MATRIX = {
  // Who gets notified based on severity and context
  notifications: {
    IMMEDIATE: {
      recipients: ['Creator', 'Emergency Contacts', 'Security Team'],
      methods: ['push', 'email', 'sms'],
      maxDelay: 60 // seconds
    },
    URGENT: {
      recipients: ['Creator', 'Technical Team'],
      methods: ['push', 'email'],
      maxDelay: 300 // 5 minutes
    },
    HIGH: {
      recipients: ['Creator'],
      methods: ['push', 'dashboard'],
      maxDelay: 900 // 15 minutes
    },
    MEDIUM: {
      recipients: ['Dashboard'],
      methods: ['dashboard', 'log'],
      maxDelay: 3600 // 1 hour
    },
    LOW: {
      recipients: ['Log'],
      methods: ['log'],
      maxDelay: 86400 // 24 hours
    }
  },

  // Automatic escalation rules
  autoEscalation: {
    unacknowledged: 'Escalate after 30 minutes without acknowledgment',
    repeated: 'Escalate after 3 similar incidents in 1 hour',
    cascading: 'Escalate if secondary systems start failing',
    businessHours: 'Different escalation during business vs off hours'
  }
};