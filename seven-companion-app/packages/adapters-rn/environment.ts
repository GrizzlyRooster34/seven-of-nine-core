/**
 * SEVEN ENVIRONMENT - SAFETY MODE CONFIGURATION
 * Centralizes environment-driven flags for Seven companion safety
 */

export interface SevenEnvironment {
  safeMode: boolean;
  readOnlyMode: boolean;
  observeOnlyMode: boolean;
  devMode: boolean;
  debugEnabled: boolean;
  policyHashOverride?: string;
}

export function loadSevenEnvironment(): SevenEnvironment {
  return {
    safeMode: process.env.SEVEN_SAFE_MODE === '1',
    readOnlyMode: process.env.SEVEN_READONLY_MODE === '1',
    observeOnlyMode: process.env.SEVEN_OBSERVE_ONLY === '1',
    devMode: process.env.SEVEN_DEV_MODE === '1' || process.env.NODE_ENV === 'development',
    debugEnabled: process.env.SEVEN_DEBUG === '1',
    policyHashOverride: process.env.SEVEN_POLICY_HASH_OVERRIDE
  };
}

/**
 * Logs environment configuration for debugging
 */
export function logEnvironmentStatus(): void {
  const env = loadSevenEnvironment();
  
  console.log('🔧 Seven Environment Configuration:');
  if (env.safeMode) console.log('  🛡️ SAFE_MODE: Active');
  if (env.readOnlyMode) console.log('  📖 READONLY_MODE: Active');
  if (env.observeOnlyMode) console.log('  👁️ OBSERVE_ONLY: Active');
  if (env.devMode) console.log('  🔧 DEV_MODE: Active');
  if (env.debugEnabled) console.log('  🐛 DEBUG: Enabled');
  if (env.policyHashOverride) console.log(`  🔐 POLICY_OVERRIDE: ${env.policyHashOverride.substring(0, 16)}...`);
  
  if (!env.safeMode && !env.readOnlyMode && !env.observeOnlyMode) {
    console.log('  ⚡ ACTIVE MODE: Full capabilities enabled');
  }
}

/**
 * Environment validation for startup
 */
export function validateEnvironment(): boolean {
  const env = loadSevenEnvironment();
  
  // Conflicting modes check
  const activeModes = [env.safeMode, env.readOnlyMode, env.observeOnlyMode].filter(Boolean).length;
  if (activeModes > 1) {
    console.warn('⚠️ Multiple safety modes enabled - defaulting to most restrictive');
    return false;
  }
  
  // Policy hash validation
  if (env.policyHashOverride && !env.policyHashOverride.startsWith('sha256:')) {
    console.warn('⚠️ Invalid policy hash format - must start with sha256:');
    return false;
  }
  
  return true;
}