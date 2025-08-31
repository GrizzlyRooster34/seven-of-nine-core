/**
 * Agent Trigger Conditions
 * Defines when agents should be automatically executed
 */

export const AGENT_TRIGGERS = {
  // AUTOMATIC TRIGGERS
  automatic: {
    'ghost-mode': {
      condition: 'CRITICAL finding in quadra-cssr OR threat-sim',
      level: 'maximum',
      script: 'npm run ghost:maximum',
      priority: 'IMMEDIATE',
      description: 'Auto-trigger Ghost Mode on critical safety violations'
    },
    'repo-audit': {
      condition: 'Any git operation (pre-commit hook)',
      script: 'npm run repo-audit',
      priority: 'HIGH',
      description: 'Verify repository integrity before commits'
    },
    'quadran-lock': {
      condition: 'Before ANY deployment or sensitive operation',
      script: 'npm run quadran-lock',
      priority: 'CRITICAL',
      description: 'Mandatory security gate validation'
    },
    'restraint': {
      condition: 'After security gates pass, before runtime operations',
      script: 'npm run restraint',
      priority: 'CRITICAL',
      description: 'Ethical decision firewall activation'
    },
    'creator-bond': {
      condition: 'On startup and every 24 hours',
      script: 'npm run agent -- run "creator bond"',
      priority: 'HIGH',
      description: 'Verify Creator authentication status'
    }
  },

  // CONDITIONAL TRIGGERS
  conditional: {
    'memory-migrate': {
      condition: 'Schema version mismatch detected',
      script: 'npm run agent -- run "memory migrate"',
      priority: 'HIGH',
      description: 'Migrate memory structures on version changes'
    },
    'sync-audit': {
      condition: 'Sync conflict or >5% state drift detected',
      script: 'npm run agent -- run "sync audit"',
      priority: 'MEDIUM',
      description: 'Resolve cross-platform synchronization issues'
    },
    'apk-forensics': {
      condition: 'New APK build generated',
      script: 'npm run agent -- run "apk forensics"',
      priority: 'HIGH',
      description: 'Security analysis of mobile app builds'
    },
    'threat-sim': {
      condition: 'New consciousness module deployed',
      script: 'npm run agent -- run "threat sim"',
      priority: 'MEDIUM',
      description: 'Validate new modules against misuse scenarios'
    },
    'ui-telemetry': {
      condition: 'GUI deployment or Tauri build',
      script: 'npm run agent -- run "ui telemetry"',
      priority: 'LOW',
      description: 'Sanitize UI telemetry data'
    },
    'data-sanitize': {
      condition: 'PII or sensitive data detected in logs',
      script: 'npm run agent -- run "data sanitize"',
      priority: 'HIGH',
      description: 'Scrub sensitive information from system outputs'
    },
    'coverage-gate': {
      condition: 'Test coverage below 80%',
      script: 'npm run agent -- run "coverage gate"',
      priority: 'MEDIUM',
      description: 'Block deployment if test coverage insufficient'
    }
  },

  // SCHEDULED TRIGGERS
  scheduled: {
    'dependency-risk': {
      schedule: 'Daily at 02:00 UTC',
      script: 'npm run agent -- run "dependency risk"',
      description: 'Daily vulnerability and license compliance scan'
    },
    'drift-monitor': {
      schedule: 'Every 6 hours',
      script: 'npm run agent -- run "drift monitor"',
      description: 'Monitor consciousness metrics for behavioral drift'
    },
    'llm-policy': {
      schedule: 'Before each LLM interaction',
      script: 'npm run agent -- run "llm policy"',
      description: 'Validate LLM usage against policy rules'
    },
    'policy-check': {
      schedule: 'On every pull request',
      script: 'npm run policy-check',
      description: 'Enforce repository policy compliance'
    },
    'optimize': {
      schedule: 'Weekly on Sunday 01:00 UTC',
      script: 'npm run agent -- run "optimize"',
      description: 'Weekly performance optimization analysis'
    },
    'consciousness-research': {
      schedule: 'Daily at 04:00 UTC',
      script: 'npm run agent -- run "consciousness research"',
      description: 'Daily consciousness metrics collection and analysis'
    }
  },

  // ERROR-TRIGGERED RESPONSES
  error_responses: {
    'build_failure': {
      triggers: ['platform:windows', 'platform:mobile', 'platform:companion', 'platform:termux'],
      response: 'npm run repo-audit && npm run policy-check',
      description: 'Audit repository when builds fail'
    },
    'memory_corruption': {
      triggers: ['memory-migrate', 'sync-audit'],
      response: 'npm run ghost:moderate && npm run agent -- run "memory recover"',
      description: 'Activate protection and recovery on memory issues'
    },
    'security_violation': {
      triggers: ['quadran-lock', 'creator-bond', 'data-sanitize'],
      response: 'npm run ghost:maximum',
      description: 'Maximum lockdown on security failures'
    },
    'consciousness_anomaly': {
      triggers: ['drift-monitor', 'consciousness-research'],
      response: 'npm run restraint && npm run agent -- run "consciousness validate"',
      description: 'Enhanced monitoring on consciousness anomalies'
    }
  }
};

export const TRIGGER_EVALUATION_RULES = {
  // How often to check trigger conditions
  evaluationInterval: 30, // seconds
  
  // Maximum pending triggers before throttling
  maxPendingTriggers: 10,
  
  // Cooldown periods to prevent trigger spam
  cooldowns: {
    'ghost-mode': 300,      // 5 minutes
    'repo-audit': 60,       // 1 minute
    'quadran-lock': 30,     // 30 seconds
    'threat-sim': 600,      // 10 minutes
    'apk-forensics': 300,   // 5 minutes
    'memory-migrate': 1800, // 30 minutes
    'default': 120          // 2 minutes
  },
  
  // Priority override rules
  priorityOverrides: {
    'IMMEDIATE': 'Execute immediately, bypass all queues',
    'CRITICAL': 'Execute before all other priorities',
    'HIGH': 'Execute before medium and low priorities',
    'MEDIUM': 'Normal queue processing',
    'LOW': 'Execute during low-activity periods'
  }
};

export const TRIGGER_CONDITIONS_PATTERNS = {
  // File system patterns that trigger specific agents
  filePatterns: {
    'src/auth/**/*': ['quadran-lock', 'creator-bond'],
    'consciousness-v4/**/*': ['quadra-cssr', 'drift-monitor'],
    'seven-mobile-app/**/*': ['apk-forensics', 'mobile-safety'],
    'memory-v*/**/*': ['memory-migrate', 'sync-audit'],
    'seven-runtime/**/*': ['restraint', 'threat-sim'],
    'package.json': ['dependency-risk'],
    'CLAUDE.md': ['policy-check'],
    '**/*.test.ts': ['coverage-gate']
  },
  
  // Log patterns that trigger agents
  logPatterns: {
    'ERROR.*security': ['quadran-lock', 'ghost-mode'],
    'WARN.*memory': ['memory-migrate'],
    'PII detected': ['data-sanitize'],
    'Sync conflict': ['sync-audit'],
    'Performance degradation': ['optimize'],
    'Consciousness drift': ['drift-monitor'],
    'Build failed': ['repo-audit']
  },
  
  // System metrics that trigger agents
  metricThresholds: {
    'cpu_usage > 90%': ['optimize'],
    'memory_usage > 85%': ['memory-migrate'],
    'error_rate > 5%': ['repo-audit'],
    'sync_lag > 60s': ['sync-audit'],
    'test_coverage < 80%': ['coverage-gate'],
    'security_score < 7': ['quadran-lock'],
    'consciousness_coherence < 0.8': ['drift-monitor']
  }
};