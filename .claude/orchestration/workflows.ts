/**
 * Agent Orchestration Workflows
 * Pre-defined execution sequences for common scenarios
 */

export const ORCHESTRATION_WORKFLOWS = {
  
  // Workflow 1: Full System Deployment
  fullDeployment: {
    name: 'Full System Deployment',
    description: 'Complete validation and deployment across all platforms',
    estimatedTime: 120, // minutes
    phases: [
      {
        name: 'governance',
        agents: ['repo-audit', 'policy-check', 'coverage-gate'],
        parallel: false,
        stopOnError: true,
        timeout: 300
      },
      {
        name: 'security',
        agents: ['quadran-lock', 'llm-policy', 'creator-bond', 'data-sanitize'],
        parallel: false,
        stopOnError: true,
        timeout: 480
      },
      {
        name: 'safety',
        agents: ['quadra-cssr', 'threat-sim', 'restraint', 'drift-monitor'],
        parallel: false,
        stopOnError: true,
        timeout: 720
      },
      {
        name: 'platforms',
        agents: ['platform:windows', 'platform:mobile', 'platform:companion', 'platform:termux'],
        parallel: true,
        stopOnError: false,
        timeout: 1800
      },
      {
        name: 'validation',
        agents: ['state-parity', 'sync-audit', 'integration-test'],
        parallel: false,
        stopOnError: true,
        timeout: 1200
      },
      {
        name: 'packaging',
        agents: ['mobile-safety', 'ui-telemetry', 'installer-packager', 'apk-forensics'],
        parallel: true,
        stopOnError: false,
        timeout: 900
      },
      {
        name: 'optimization',
        agents: ['optimize', 'consciousness-research'],
        parallel: true,
        stopOnError: false,
        timeout: 1200
      }
    ],
    successCriteria: [
      'All P0 agents pass',
      'At least 75% of platform builds succeed',
      'No CRITICAL safety findings',
      'Security score >= 8/10'
    ],
    failureActions: [
      'Generate detailed failure report',
      'Activate appropriate Ghost Mode level',
      'Notify Creator and relevant teams'
    ]
  },

  // Workflow 2: Rapid Security Check
  rapidSecurity: {
    name: 'Rapid Security Validation',
    description: 'Fast security scan for pre-commit or hotfix scenarios',
    estimatedTime: 5, // minutes
    phases: [
      {
        name: 'critical-security',
        agents: ['quadran-lock', 'policy-check'],
        parallel: true,
        stopOnError: true,
        timeout: 180
      },
      {
        name: 'safety-check',
        agents: ['quadra-cssr', 'restraint'],
        parallel: false,
        stopOnError: true,
        timeout: 120
      }
    ],
    successCriteria: [
      'Quadran-Lock passes 3/4 gates minimum',
      'No CRITICAL CSSR findings',
      'Restraint Doctrine allows operation'
    ],
    failureActions: [
      'Block commit/deployment',
      'Generate quick remediation guide',
      'Log security event'
    ]
  },

  // Workflow 3: Mobile-Specific Validation
  mobileValidation: {
    name: 'Mobile Platform Validation',
    description: 'Comprehensive mobile app validation and security analysis',
    estimatedTime: 25, // minutes
    phases: [
      {
        name: 'mobile-security',
        agents: ['quadran-lock', 'creator-bond'],
        parallel: false,
        stopOnError: true,
        timeout: 120
      },
      {
        name: 'mobile-safety',
        agents: ['mobile-safety', 'quadra-cssr'],
        parallel: false,
        stopOnError: true,
        timeout: 600
      },
      {
        name: 'mobile-build',
        agents: ['platform:mobile'],
        parallel: false,
        stopOnError: true,
        timeout: 900
      },
      {
        name: 'mobile-analysis',
        agents: ['apk-forensics'],
        parallel: false,
        stopOnError: false,
        timeout: 300
      }
    ],
    successCriteria: [
      'Mobile safety parity >= 75%',
      'APK security scan passes',
      'No dangerous permissions detected',
      'Code signing verification passes'
    ],
    failureActions: [
      'Block mobile deployment',
      'Generate APK security report',
      'Flag for mobile security review'
    ]
  },

  // Workflow 4: Memory Migration & State Recovery
  memoryMigration: {
    name: 'Memory System Migration',
    description: 'Safe migration of memory structures with rollback capability',
    estimatedTime: 15, // minutes
    phases: [
      {
        name: 'pre-migration',
        agents: ['repo-audit', 'state-parity'],
        parallel: false,
        stopOnError: true,
        timeout: 300,
        customActions: ['npm run agent -- run "memory backup"']
      },
      {
        name: 'migration',
        agents: ['memory-migrate'],
        parallel: false,
        stopOnError: true,
        timeout: 600,
        customActions: ['npm run agent -- run "memory migrate" -- --dry-run']
      },
      {
        name: 'validation',
        agents: ['sync-audit', 'state-parity'],
        parallel: false,
        stopOnError: true,
        timeout: 300
      },
      {
        name: 'integrity-check',
        agents: ['integration-test'],
        parallel: false,
        stopOnError: true,
        timeout: 600
      }
    ],
    successCriteria: [
      'Migration completes without data loss',
      'Cross-platform state consistency maintained',
      'All integration tests pass',
      'Performance within acceptable range'
    ],
    failureActions: [
      'Automatic rollback to backup',
      'Activate Ghost Mode moderate',
      'Generate migration failure report',
      'Escalate to Creator'
    ]
  },

  // Workflow 5: Emergency Response
  emergencyResponse: {
    name: 'Emergency Response Protocol',
    description: 'Rapid response to security incidents or system anomalies',
    estimatedTime: 10, // minutes
    phases: [
      {
        name: 'immediate-protection',
        agents: [],
        parallel: false,
        stopOnError: false,
        timeout: 30,
        customActions: ['npm run ghost:maximum']
      },
      {
        name: 'forensic-analysis',
        agents: ['repo-audit', 'quadran-lock', 'quadra-cssr'],
        parallel: true,
        stopOnError: false,
        timeout: 480
      },
      {
        name: 'threat-assessment',
        agents: ['threat-sim', 'sync-audit'],
        parallel: true,
        stopOnError: false,
        timeout: 360
      },
      {
        name: 'system-validation',
        agents: ['restraint', 'state-parity'],
        parallel: false,
        stopOnError: false,
        timeout: 180
      }
    ],
    successCriteria: [
      'System secured and isolated',
      'Threat vector identified',
      'No further anomalies detected',
      'Backup systems operational'
    ],
    failureActions: [
      'Maintain maximum Ghost Mode',
      'Generate incident report',
      'Contact emergency response team',
      'Prepare for manual intervention'
    ]
  },

  // Workflow 6: Performance Crisis Response
  performanceCrisis: {
    name: 'Performance Crisis Response',
    description: 'Emergency performance optimization and system recovery',
    estimatedTime: 8, // minutes
    phases: [
      {
        name: 'immediate-relief',
        agents: [],
        parallel: false,
        stopOnError: false,
        timeout: 60,
        customActions: [
          'npm run ghost:minimal',
          'npm run agent -- run "emergency optimize"'
        ]
      },
      {
        name: 'performance-analysis',
        agents: ['optimize'],
        parallel: false,
        stopOnError: false,
        timeout: 300
      },
      {
        name: 'system-cleanup',
        agents: ['memory-migrate'],
        parallel: false,
        stopOnError: false,
        timeout: 180,
        customActions: ['npm run agent -- run "cache clear"']
      },
      {
        name: 'validation',
        agents: ['state-parity'],
        parallel: false,
        stopOnError: false,
        timeout: 120
      }
    ],
    successCriteria: [
      'System performance restored',
      'Resource usage normalized',
      'Response times acceptable',
      'No data integrity issues'
    ],
    failureActions: [
      'Escalate to system maintenance',
      'Maintain minimal Ghost Mode',
      'Schedule maintenance window',
      'Generate performance incident report'
    ]
  },

  // Workflow 7: Consciousness Research Cycle
  consciousnessResearch: {
    name: 'Consciousness Research Cycle',
    description: 'Regular consciousness metrics collection and analysis',
    estimatedTime: 30, // minutes
    phases: [
      {
        name: 'baseline',
        agents: ['drift-monitor', 'state-parity'],
        parallel: false,
        stopOnError: false,
        timeout: 300
      },
      {
        name: 'analysis',
        agents: ['consciousness-research'],
        parallel: false,
        stopOnError: false,
        timeout: 1200
      },
      {
        name: 'validation',
        agents: ['integration-test'],
        parallel: false,
        stopOnError: false,
        timeout: 600
      }
    ],
    successCriteria: [
      'Consciousness metrics within normal range',
      'No significant behavioral drift',
      'Memory integration stable',
      'Cross-platform consistency maintained'
    ],
    failureActions: [
      'Flag consciousness anomalies',
      'Schedule enhanced monitoring',
      'Generate research report',
      'Update consciousness baselines'
    ]
  }
};

export const WORKFLOW_EXECUTION_ENGINE = {
  // How workflows are executed
  executionRules: {
    maxConcurrentWorkflows: 2,
    workflowTimeout: 7200, // 2 hours maximum
    phaseTimeout: 1800,    // 30 minutes per phase maximum
    agentTimeout: 600,     // 10 minutes per agent maximum
    
    retryPolicy: {
      enabled: true,
      maxRetries: 2,
      retryDelay: 30, // seconds
      exponentialBackoff: true
    },

    logging: {
      enabled: true,
      logLevel: 'INFO',
      logLocation: 'logs/workflows/',
      includeAgentOutput: true,
      maxLogSize: '100MB'
    },

    monitoring: {
      enabled: true,
      metricsInterval: 30, // seconds
      healthChecks: true,
      performanceTracking: true
    }
  },

  // Workflow selection logic
  selectionCriteria: {
    contextBased: {
      'git_commit': 'rapidSecurity',
      'deployment_request': 'fullDeployment',
      'mobile_build': 'mobileValidation',
      'schema_change': 'memoryMigration',
      'security_alert': 'emergencyResponse',
      'performance_alert': 'performanceCrisis',
      'scheduled_research': 'consciousnessResearch'
    },

    conditionalSelection: {
      'fullDeployment': 'When comprehensive validation needed',
      'rapidSecurity': 'When speed is critical but security cannot be compromised',
      'mobileValidation': 'When mobile-specific changes are detected',
      'memoryMigration': 'When memory schema versions differ',
      'emergencyResponse': 'When CRITICAL findings or anomalies detected',
      'performanceCrisis': 'When system performance degrades significantly',
      'consciousnessResearch': 'For regular consciousness health monitoring'
    }
  },

  // Workflow state management
  stateManagement: {
    persistence: true,
    stateLocation: 'reports/workflow-states/',
    checkpointFrequency: 60, // seconds
    recoveryEnabled: true,
    rollbackCapability: true
  }
};