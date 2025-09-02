/**
 * Agent Orchestration Framework - Dependency Map & Execution Order
 * Defines the complete execution sequence for all 27 specialized agents
 */

export const AGENT_EXECUTION_PHASES = {
  // PHASE 1: Governance & Prerequisites
  governance: [
    'repo-audit',           // Must run first - repo integrity
    'policy-check',         // Enforce naming/token rules
    'coverage-gate',        // Block if coverage too low
    'dependency-risk'       // CVE/license scan
  ],

  // PHASE 2: Security Gates (BLOCKING)
  security: [
    'quadran-lock',         // Q1-Q4 crypto/identity gates
    'llm-policy',          // Model allowlist/jailbreak scan
    'data-sanitize',       // PII/secret scrubbing
    'creator-bond'         // Creator verification
  ],

  // PHASE 3: Safety Rails (BLOCKING)
  safety: [
    'quadra-cssr',         // Cortana/CLU/Skynet detection
    'threat-sim',          // Misuse scenario testing
    'restraint',           // Runtime firewall
    'drift-monitor'        // Consciousness metric drift
  ],

  // PHASE 4: Platform Builds (PARALLEL)
  platforms: {
    parallel: true,
    agents: [
      'platform:windows',
      'platform:mobile',
      'platform:companion',
      'platform:termux'
    ]
  },

  // PHASE 5: Validation & Forensics
  validation: [
    'state-parity',        // Cross-platform consistency
    'sync-audit',          // Distributed state verification
    'memory-migrate',      // Schema migration check
    'integration-test'     // E2E validation
  ],

  // PHASE 6: Packaging & Distribution
  packaging: [
    'mobile-safety',       // Mobile-specific safety parity
    'ui-telemetry',       // Redact sensitive data
    'installer-packager',  // Build artifacts
    'apk-forensics'       // Android security scan
  ],

  // PHASE 7: Performance & Optimization
  optimization: [
    'optimize',           // Performance tuning
    'consciousness-research' // Advanced metrics
  ]
};

export const AGENT_REGISTRY = {
  // Governance Agents
  'repo-audit': {
    script: 'npm run repo-audit',
    timeout: 120,
    priority: 'P0',
    blocking: true
  },
  'policy-check': {
    script: 'npm run policy-check',
    timeout: 60,
    priority: 'P0',
    blocking: true
  },
  'coverage-gate': {
    script: 'npm run agent -- run "coverage gate"',
    timeout: 180,
    priority: 'P1',
    blocking: false
  },
  'dependency-risk': {
    script: 'npm run agent -- run "dependency risk"',
    timeout: 300,
    priority: 'P1',
    blocking: false
  },

  // Security Agents
  'quadran-lock': {
    script: 'npm run quadran-lock',
    timeout: 90,
    priority: 'P0',
    blocking: true
  },
  'llm-policy': {
    script: 'npm run agent -- run "llm policy"',
    timeout: 120,
    priority: 'P0',
    blocking: true
  },
  'data-sanitize': {
    script: 'npm run agent -- run "data sanitize"',
    timeout: 180,
    priority: 'P1',
    blocking: true
  },
  'creator-bond': {
    script: 'npm run agent -- run "creator bond"',
    timeout: 60,
    priority: 'P0',
    blocking: true
  },

  // Safety Agents
  'quadra-cssr': {
    script: 'npm run quadra-cssr',
    timeout: 240,
    priority: 'P0',
    blocking: true
  },
  'threat-sim': {
    script: 'npm run agent -- run "threat sim"',
    timeout: 300,
    priority: 'P1',
    blocking: true
  },
  'restraint': {
    script: 'npm run restraint',
    timeout: 30,
    priority: 'P0',
    blocking: true
  },
  'drift-monitor': {
    script: 'npm run agent -- run "drift monitor"',
    timeout: 120,
    priority: 'P2',
    blocking: false
  },

  // Platform Agents
  'platform:windows': {
    script: 'npm run platform:windows',
    timeout: 600,
    priority: 'P1',
    blocking: false
  },
  'platform:mobile': {
    script: 'npm run platform:mobile',
    timeout: 900,
    priority: 'P1',
    blocking: false
  },
  'platform:companion': {
    script: 'npm run platform:companion',
    timeout: 450,
    priority: 'P1',
    blocking: false
  },
  'platform:termux': {
    script: 'npm run platform:termux',
    timeout: 300,
    priority: 'P1',
    blocking: false
  },

  // Validation Agents
  'state-parity': {
    script: 'npm run state-parity',
    timeout: 180,
    priority: 'P1',
    blocking: true
  },
  'sync-audit': {
    script: 'npm run agent -- run "sync audit"',
    timeout: 240,
    priority: 'P1',
    blocking: true
  },
  'memory-migrate': {
    script: 'npm run agent -- run "memory migrate"',
    timeout: 600,
    priority: 'P1',
    blocking: true
  },
  'integration-test': {
    script: 'npm run agent -- run "integration test"',
    timeout: 900,
    priority: 'P1',
    blocking: true
  },

  // Packaging Agents
  'mobile-safety': {
    script: 'npm run mobile-safety',
    timeout: 300,
    priority: 'P1',
    blocking: false
  },
  'ui-telemetry': {
    script: 'npm run agent -- run "ui telemetry"',
    timeout: 120,
    priority: 'P2',
    blocking: false
  },
  'installer-packager': {
    script: 'npm run agent -- run "installer packager"',
    timeout: 600,
    priority: 'P1',
    blocking: false
  },
  'apk-forensics': {
    script: 'npm run agent -- run "apk forensics"',
    timeout: 300,
    priority: 'P1',
    blocking: false
  },

  // Optimization Agents
  'optimize': {
    script: 'npm run agent -- run "optimize"',
    timeout: 480,
    priority: 'P2',
    blocking: false
  },
  'consciousness-research': {
    script: 'npm run agent -- run "consciousness research"',
    timeout: 600,
    priority: 'P2',
    blocking: false
  }
};

export const EXECUTION_RULES = {
  // Stop execution if any P0 agent fails
  failFast: true,
  
  // Maximum parallel agents
  maxParallel: 4,
  
  // Global timeout for entire orchestration
  globalTimeout: 7200, // 2 hours
  
  // Retry policy
  retryPolicy: {
    maxRetries: 3,
    backoff: 'exponential',
    retryableErrors: ['timeout', 'network', 'temporary']
  }
};