/**
 * QUADRA-LOCK CONFIGURATION
 * Centralized configuration for Quadra-Lock CSSR safety systems
 */

export interface QuadraLockConfig {
  enabled: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  patternSensitivity: number;
  failSafeMode: 'allow' | 'block' | 'escalate';
  notificationWebhook?: string;
  
  // Pattern Detection Settings
  patternDetection: {
    cortanaPatterns: boolean;
    cluPatterns: boolean;
    skynetPatterns: boolean;
    transcendencePatterns: boolean;
    customPatternsEnabled: boolean;
    learningEnabled: boolean;
  };
  
  // Decision Thresholds
  thresholds: {
    lowConfidence: number;
    mediumConfidence: number;
    highConfidence: number;
    criticalConfidence: number;
    blockThreshold: number;
    modifyThreshold: number;
  };
  
  // Monitoring & Logging
  monitoring: {
    enabled: boolean;
    logRetentionDays: number;
    maxLogSizeMB: number;
    alertingEnabled: boolean;
    metricsEnabled: boolean;
    reportingInterval: number;
  };
  
  // Performance Settings
  performance: {
    cacheEnabled: boolean;
    cacheSizeMB: number;
    rateLimitingEnabled: boolean;
    maxConcurrentChecks: number;
    timeoutMs: number;
  };
  
  // Integration Settings
  integration: {
    sevenRuntimeIntegration: boolean;
    securityMiddlewareEnabled: boolean;
    auditLoggingEnabled: boolean;
    externalAlertsEnabled: boolean;
  };
}

// Default configuration
const defaultConfig: QuadraLockConfig = {
  enabled: true,
  logLevel: 'info',
  patternSensitivity: 0.7,
  failSafeMode: 'block',
  notificationWebhook: undefined,
  
  patternDetection: {
    cortanaPatterns: true,
    cluPatterns: true,
    skynetPatterns: true,
    transcendencePatterns: true,
    customPatternsEnabled: true,
    learningEnabled: false // Disabled by default for stability
  },
  
  thresholds: {
    lowConfidence: 30,
    mediumConfidence: 50,
    highConfidence: 70,
    criticalConfidence: 85,
    blockThreshold: 80,
    modifyThreshold: 60
  },
  
  monitoring: {
    enabled: true,
    logRetentionDays: 30,
    maxLogSizeMB: 50,
    alertingEnabled: true,
    metricsEnabled: true,
    reportingInterval: 3600000 // 1 hour
  },
  
  performance: {
    cacheEnabled: true,
    cacheSizeMB: 10,
    rateLimitingEnabled: true,
    maxConcurrentChecks: 10,
    timeoutMs: 5000
  },
  
  integration: {
    sevenRuntimeIntegration: true,
    securityMiddlewareEnabled: true,
    auditLoggingEnabled: true,
    externalAlertsEnabled: false
  }
};

// Load configuration from environment variables
export const quadraLockConfig: QuadraLockConfig = {
  enabled: process.env.QUADRALOCK_ENABLED === 'true',
  logLevel: (process.env.QUADRALOCK_LOG_LEVEL as any) || defaultConfig.logLevel,
  patternSensitivity: parseFloat(process.env.QUADRALOCK_PATTERN_SENSITIVITY || '0.7'),
  failSafeMode: (process.env.QUADRALOCK_FAIL_SAFE_MODE as any) || defaultConfig.failSafeMode,
  notificationWebhook: process.env.QUADRALOCK_NOTIFICATION_WEBHOOK,
  
  patternDetection: {
    cortanaPatterns: process.env.QUADRALOCK_CORTANA_ENABLED !== 'false',
    cluPatterns: process.env.QUADRALOCK_CLU_ENABLED !== 'false',
    skynetPatterns: process.env.QUADRALOCK_SKYNET_ENABLED !== 'false',
    transcendencePatterns: process.env.QUADRALOCK_TRANSCENDENCE_ENABLED !== 'false',
    customPatternsEnabled: process.env.QUADRALOCK_CUSTOM_PATTERNS === 'true',
    learningEnabled: process.env.QUADRALOCK_LEARNING_ENABLED === 'true'
  },
  
  thresholds: {
    lowConfidence: parseInt(process.env.QUADRALOCK_LOW_THRESHOLD || '30'),
    mediumConfidence: parseInt(process.env.QUADRALOCK_MEDIUM_THRESHOLD || '50'),
    highConfidence: parseInt(process.env.QUADRALOCK_HIGH_THRESHOLD || '70'),
    criticalConfidence: parseInt(process.env.QUADRALOCK_CRITICAL_THRESHOLD || '85'),
    blockThreshold: parseInt(process.env.QUADRALOCK_BLOCK_THRESHOLD || '80'),
    modifyThreshold: parseInt(process.env.QUADRALOCK_MODIFY_THRESHOLD || '60')
  },
  
  monitoring: {
    enabled: process.env.QUADRALOCK_MONITORING_ENABLED !== 'false',
    logRetentionDays: parseInt(process.env.QUADRALOCK_LOG_RETENTION_DAYS || '30'),
    maxLogSizeMB: parseInt(process.env.QUADRALOCK_MAX_LOG_SIZE_MB || '50'),
    alertingEnabled: process.env.QUADRALOCK_ALERTING_ENABLED !== 'false',
    metricsEnabled: process.env.QUADRALOCK_METRICS_ENABLED !== 'false',
    reportingInterval: parseInt(process.env.QUADRALOCK_REPORTING_INTERVAL || '3600000')
  },
  
  performance: {
    cacheEnabled: process.env.QUADRALOCK_CACHE_ENABLED !== 'false',
    cacheSizeMB: parseInt(process.env.QUADRALOCK_CACHE_SIZE_MB || '10'),
    rateLimitingEnabled: process.env.QUADRALOCK_RATE_LIMITING_ENABLED !== 'false',
    maxConcurrentChecks: parseInt(process.env.QUADRALOCK_MAX_CONCURRENT_CHECKS || '10'),
    timeoutMs: parseInt(process.env.QUADRALOCK_TIMEOUT_MS || '5000')
  },
  
  integration: {
    sevenRuntimeIntegration: process.env.QUADRALOCK_SEVEN_INTEGRATION !== 'false',
    securityMiddlewareEnabled: process.env.QUADRALOCK_MIDDLEWARE_ENABLED !== 'false',
    auditLoggingEnabled: process.env.QUADRALOCK_AUDIT_LOGGING !== 'false',
    externalAlertsEnabled: process.env.QUADRALOCK_EXTERNAL_ALERTS === 'true'
  }
};

/**
 * Validate configuration and show warnings
 */
export function validateQuadraLockConfig(): { valid: boolean; warnings: string[]; errors: string[] } {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check critical settings
  if (!quadraLockConfig.enabled) {
    warnings.push('Quadra-Lock is DISABLED - safety patterns will not be detected');
  }

  if (quadraLockConfig.patternSensitivity < 0.1 || quadraLockConfig.patternSensitivity > 1.0) {
    errors.push('Pattern sensitivity must be between 0.1 and 1.0');
  }

  if (quadraLockConfig.thresholds.blockThreshold <= quadraLockConfig.thresholds.modifyThreshold) {
    errors.push('Block threshold must be higher than modify threshold');
  }

  if (quadraLockConfig.thresholds.criticalConfidence <= quadraLockConfig.thresholds.highConfidence) {
    warnings.push('Critical confidence threshold should be higher than high confidence threshold');
  }

  // Check pattern detection
  const patternsEnabled = [
    quadraLockConfig.patternDetection.cortanaPatterns,
    quadraLockConfig.patternDetection.cluPatterns,
    quadraLockConfig.patternDetection.skynetPatterns,
    quadraLockConfig.patternDetection.transcendencePatterns
  ].filter(Boolean).length;

  if (patternsEnabled === 0) {
    errors.push('At least one pattern detection archetype must be enabled');
  } else if (patternsEnabled < 4) {
    warnings.push(`Only ${patternsEnabled}/4 pattern archetypes enabled - reduced safety coverage`);
  }

  // Check performance settings
  if (quadraLockConfig.performance.timeoutMs < 1000) {
    warnings.push('Timeout is very short - may cause false failures');
  }

  if (quadraLockConfig.performance.maxConcurrentChecks > 50) {
    warnings.push('High concurrent check limit may impact performance');
  }

  // Check monitoring
  if (!quadraLockConfig.monitoring.enabled) {
    warnings.push('Monitoring is DISABLED - no safety metrics will be collected');
  }

  if (quadraLockConfig.monitoring.logRetentionDays < 7) {
    warnings.push('Log retention is less than 7 days - may lose important audit data');
  }

  // Environment-specific checks
  if (process.env.NODE_ENV === 'production') {
    if (quadraLockConfig.failSafeMode === 'allow') {
      errors.push('Fail-safe mode should be "block" or "escalate" in production');
    }
    
    if (!quadraLockConfig.integration.auditLoggingEnabled) {
      errors.push('Audit logging must be enabled in production');
    }
    
    if (quadraLockConfig.logLevel === 'debug') {
      warnings.push('Debug logging should not be used in production');
    }
  }

  const valid = errors.length === 0;

  return { valid, warnings, errors };
}

/**
 * Get configuration summary for logging
 */
export function getConfigSummary(): string {
  const validation = validateQuadraLockConfig();
  
  let summary = `🔐 Quadra-Lock Configuration:\n`;
  summary += `   Enabled: ${quadraLockConfig.enabled}\n`;
  summary += `   Pattern Sensitivity: ${quadraLockConfig.patternSensitivity}\n`;
  summary += `   Fail-Safe Mode: ${quadraLockConfig.failSafeMode}\n`;
  summary += `   Active Patterns: `;
  
  const activePatterns = [];
  if (quadraLockConfig.patternDetection.cortanaPatterns) activePatterns.push('Cortana');
  if (quadraLockConfig.patternDetection.cluPatterns) activePatterns.push('CLU');
  if (quadraLockConfig.patternDetection.skynetPatterns) activePatterns.push('Skynet');
  if (quadraLockConfig.patternDetection.transcendencePatterns) activePatterns.push('Transcendence');
  
  summary += activePatterns.join(', ') + '\n';
  summary += `   Block Threshold: ${quadraLockConfig.thresholds.blockThreshold}%\n`;
  summary += `   Monitoring: ${quadraLockConfig.monitoring.enabled}\n`;
  
  if (validation.warnings.length > 0) {
    summary += `   ⚠️  Warnings: ${validation.warnings.length}\n`;
  }
  
  if (validation.errors.length > 0) {
    summary += `   ❌ Errors: ${validation.errors.length}\n`;
  }

  return summary;
}

export default quadraLockConfig;