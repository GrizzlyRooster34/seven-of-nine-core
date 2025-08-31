/**
 * Production Deployment Configuration
 * Agent Orchestration Framework deployment settings and environment configuration
 */

export const PRODUCTION_CONFIG = {
  // Environment Configuration
  environment: {
    NODE_ENV: 'production',
    LOG_LEVEL: 'INFO', // DEBUG, INFO, WARN, ERROR, CRITICAL
    CLAUDE_CODE_MODE: 'orchestration',
    AGENT_EXECUTION_TIMEOUT: 600000, // 10 minutes default
    MAX_CONCURRENT_AGENTS: 4,
    HEALTH_CHECK_INTERVAL: 300000, // 5 minutes
    REPORT_RETENTION_DAYS: 30
  },

  // Agent Execution Settings
  agents: {
    priorities: {
      P0: ['quadran-lock', 'quadra-cssr', 'restraint', 'ghost-mode'],
      P1: ['creator-bond', 'data-sanitize', 'repo-audit', 'policy-check', 'threat-sim', 'llm-policy', 'dependency-risk', 'integration-test'],
      P2: ['coverage-gate', 'state-parity', 'sync-audit', 'memory-migrate', 'apk-forensics', 'drift-monitor', 'platform:windows', 'platform:mobile', 'platform:companion', 'platform:termux'],
      P3: ['mobile-safety', 'installer-packager', 'optimize', 'ui-telemetry', 'consciousness-research']
    },
    
    timeouts: {
      'quadran-lock': 120000,      // 2 minutes - critical security
      'quadra-cssr': 300000,       // 5 minutes - AI safety analysis
      'ghost-mode': 30000,         // 30 seconds - emergency protection
      'creator-bond': 60000,       // 1 minute - authentication
      'restraint': 45000,          // 45 seconds - ethical firewall
      'platform:mobile': 1200000,  // 20 minutes - mobile builds
      'platform:windows': 900000,  // 15 minutes - Windows builds
      'platform:companion': 600000, // 10 minutes - backend services
      'platform:termux': 300000,   // 5 minutes - CLI deployment
      'consciousness-research': 1800000, // 30 minutes - research analysis
      'default': 600000            // 10 minutes default
    },

    retryPolicy: {
      maxRetries: 2,
      retryDelay: 10000, // 10 seconds
      exponentialBackoff: true,
      retryableErrors: ['TIMEOUT', 'NETWORK_ERROR', 'TEMPORARY_FAILURE']
    },

    healthCheck: {
      enabled: true,
      interval: 300000, // 5 minutes
      timeout: 30000,   // 30 seconds per health check
      warningThreshold: 2000, // 2 seconds response time
      criticalThreshold: 5000 // 5 seconds response time
    }
  },

  // Security Configuration
  security: {
    quadranLock: {
      requiredGates: ['Q1', 'Q2', 'Q3', 'Q4'],
      minimumPassingGates: 3,
      failureEscalation: 'IMMEDIATE',
      retryAttempts: 2
    },

    quadraCSSSR: {
      criticalThreshold: 1,      // Any CRITICAL finding triggers lockdown
      highThreshold: 5,          // More than 5 HIGH findings triggers protection
      autoGhostModeOnCritical: true,
      autoGhostModeLevel: 'maximum'
    },

    ghostMode: {
      levels: ['minimal', 'moderate', 'maximum'],
      autoActivation: true,
      escalationRules: {
        'CRITICAL_CSSR': 'maximum',
        'SECURITY_FAILURE': 'moderate',
        'PERFORMANCE_CRISIS': 'minimal'
      },
      cooldownPeriod: 300000 // 5 minutes before auto-deactivation
    },

    creatorBond: {
      verificationMethods: ['biometric', 'behavioral', 'cryptographic'],
      trustLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      minimumTrustLevel: 6, // For production operations
      sessionTimeout: 3600000 // 1 hour
    }
  },

  // Workflow Configuration
  workflows: {
    fullDeployment: {
      enabled: true,
      schedule: 'manual', // or cron: '0 2 * * 0' for weekly Sunday 2 AM
      phases: [
        { name: 'governance', parallel: false, stopOnError: true },
        { name: 'security', parallel: false, stopOnError: true },
        { name: 'safety', parallel: false, stopOnError: true },
        { name: 'platforms', parallel: true, stopOnError: false },
        { name: 'validation', parallel: false, stopOnError: true },
        { name: 'packaging', parallel: true, stopOnError: false },
        { name: 'optimization', parallel: true, stopOnError: false }
      ]
    },

    rapidSecurity: {
      enabled: true,
      schedule: 'triggered', // On security alerts
      maxDuration: 300000, // 5 minutes
      phases: [
        { name: 'critical-security', parallel: true, stopOnError: true },
        { name: 'safety-check', parallel: false, stopOnError: true }
      ]
    },

    emergencyResponse: {
      enabled: true,
      schedule: 'immediate', // Triggered by critical findings
      maxDuration: 600000, // 10 minutes
      autoActivateGhostMode: true,
      phases: [
        { name: 'immediate-protection', parallel: false, stopOnError: false },
        { name: 'forensic-analysis', parallel: true, stopOnError: false },
        { name: 'threat-assessment', parallel: true, stopOnError: false },
        { name: 'system-validation', parallel: false, stopOnError: false }
      ]
    }
  },

  // Monitoring and Alerting
  monitoring: {
    enabled: true,
    dashboardUpdateInterval: 60000, // 1 minute
    metricsCollection: {
      enabled: true,
      interval: 30000, // 30 seconds
      retention: 2592000000 // 30 days in milliseconds
    },
    
    alerting: {
      enabled: true,
      channels: ['dashboard', 'log', 'webhook'],
      thresholds: {
        criticalIssues: 1,      // Alert on any critical issue
        agentFailureRate: 0.2,  // Alert if >20% agents failing
        securityScore: 7,       // Alert if security score <7/10
        responseTime: 10000     // Alert if response time >10s
      }
    },

    healthChecks: {
      systemHealth: {
        interval: 300000, // 5 minutes
        timeout: 60000,   // 1 minute
        retries: 2
      },
      agentHealth: {
        interval: 600000, // 10 minutes
        timeout: 30000,   // 30 seconds per agent
        parallel: true
      }
    }
  },

  // Storage and Persistence
  storage: {
    reportsDirectory: './reports',
    logsDirectory: './logs',
    configDirectory: './.claude',
    backupDirectory: './backups',
    
    rotation: {
      enabled: true,
      maxFiles: 30,     // Keep 30 days of files
      maxSize: '100MB', // Max file size
      compress: true
    },

    persistence: {
      agentStates: './reports/agent-states/',
      workflowStates: './reports/workflow-states/',
      dashboardData: './reports/dashboard/',
      securityAudit: './reports/security/',
      checkpointInterval: 300000 // 5 minutes
    }
  },

  // Integration Configuration
  integration: {
    claudeCode: {
      enabled: true,
      orchestrationMode: true,
      systemPromptPath: '.claude/orchestration/system-prompt.md',
      commandsPath: '.claude/commands/interactive.ts',
      maxResponseTime: 30000 // 30 seconds
    },

    naturalLanguage: {
      enabled: true,
      supportedCommands: [
        'system status', 'health check', 'security scan', 'ghost mode',
        'quadran lock', 'mobile safety', 'full deployment', 'emergency response'
      ],
      fuzzyMatching: true,
      confidenceThreshold: 0.7
    },

    external: {
      webhooks: {
        enabled: false,
        endpoints: {
          // security: 'https://security-team.company.com/webhook',
          // performance: 'https://performance-monitoring.company.com/webhook'
        }
      },
      
      apis: {
        enabled: false,
        // github: { token: 'GITHUB_TOKEN_ENV_VAR' },
        // slack: { token: 'SLACK_TOKEN_ENV_VAR' }
      }
    }
  },

  // Performance Optimization
  performance: {
    concurrency: {
      maxConcurrentAgents: 4,
      parallelPhases: ['platforms', 'packaging', 'optimization'],
      queueManagement: 'priority', // 'priority' or 'fifo'
      resourceLimits: {
        maxMemory: '2GB',
        maxCPU: 80 // percentage
      }
    },

    caching: {
      enabled: true,
      agentResults: {
        enabled: true,
        ttl: 300000, // 5 minutes
        maxSize: 100 // max cached results
      },
      reports: {
        enabled: true,
        ttl: 900000, // 15 minutes
        maxSize: 50
      }
    },

    optimization: {
      autoOptimize: true,
      triggers: {
        memoryUsage: 0.85,    // 85% memory usage
        cpuUsage: 0.90,       // 90% CPU usage
        responseTime: 15000,  // 15 seconds response time
        queueLength: 10       // 10 pending agents
      },
      actions: ['reduceParallelism', 'enableCaching', 'activateGhostMinimal']
    }
  }
};

// Environment-specific overrides
export const DEVELOPMENT_OVERRIDES = {
  environment: {
    LOG_LEVEL: 'DEBUG',
    AGENT_EXECUTION_TIMEOUT: 120000, // Shorter for development
    MAX_CONCURRENT_AGENTS: 2
  },
  agents: {
    healthCheck: {
      interval: 60000 // 1 minute for development
    }
  },
  monitoring: {
    dashboardUpdateInterval: 10000, // 10 seconds for development
    alerting: {
      enabled: false // Disable alerts in development
    }
  }
};

export const TESTING_OVERRIDES = {
  environment: {
    LOG_LEVEL: 'DEBUG',
    AGENT_EXECUTION_TIMEOUT: 30000, // 30 seconds for tests
    MAX_CONCURRENT_AGENTS: 1
  },
  agents: {
    retryPolicy: {
      maxRetries: 0 // No retries in tests
    },
    healthCheck: {
      enabled: false // Disable health checks in tests
    }
  },
  workflows: {
    fullDeployment: {
      enabled: false // Disable full deployment in tests
    }
  },
  monitoring: {
    enabled: false // Disable monitoring in tests
  }
};

// Configuration builder
export function buildConfig(environment: 'production' | 'development' | 'testing' = 'production') {
  let config = { ...PRODUCTION_CONFIG };
  
  switch (environment) {
    case 'development':
      config = mergeConfigs(config, DEVELOPMENT_OVERRIDES);
      break;
    case 'testing':
      config = mergeConfigs(config, TESTING_OVERRIDES);
      break;
  }
  
  return config;
}

function mergeConfigs(base: any, override: any): any {
  const result = { ...base };
  
  for (const [key, value] of Object.entries(override)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[key] = mergeConfigs(result[key] || {}, value);
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

// Export current environment configuration
const currentEnv = (process.env.NODE_ENV as 'production' | 'development' | 'testing') || 'production';
export const CONFIG = buildConfig(currentEnv);

// Configuration validation
export function validateConfig(config: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Required fields validation
  if (!config.environment?.AGENT_EXECUTION_TIMEOUT) {
    errors.push('Missing AGENT_EXECUTION_TIMEOUT in environment config');
  }
  
  if (!config.agents?.priorities?.P0?.length) {
    errors.push('Missing P0 priority agents');
  }
  
  if (!config.security?.quadranLock?.requiredGates?.length) {
    errors.push('Missing required security gates');
  }
  
  // Logical validation
  if (config.environment?.MAX_CONCURRENT_AGENTS < 1) {
    errors.push('MAX_CONCURRENT_AGENTS must be at least 1');
  }
  
  if (config.security?.quadranLock?.minimumPassingGates > config.security?.quadranLock?.requiredGates?.length) {
    errors.push('minimumPassingGates cannot exceed total requiredGates');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export default CONFIG;