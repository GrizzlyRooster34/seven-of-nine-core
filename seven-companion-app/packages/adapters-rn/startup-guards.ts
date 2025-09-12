/**
 * SEVEN STARTUP GUARDS - APPLICATION INITIALIZATION SAFETY
 * Ensures safe app startup with Seven Core compatibility validation
 */

import type { SafetyMode, HandshakeResult, SevenPorts } from '@seven/ports';
import { negotiateHandshake, createSafetyGuard } from '@seven/core-bindings/handshake';
import { loadSevenEnvironment, logEnvironmentStatus, validateEnvironment } from './environment';

export interface StartupGuardResult {
  success: boolean;
  safetyMode: SafetyMode;
  handshakeResult: HandshakeResult | null;
  errors: string[];
  warnings: string[];
}

/**
 * Main startup guard orchestrator
 * Validates environment, performs handshake, and determines safe startup mode
 */
export async function executeStartupGuards(
  ports: SevenPorts,
  requiredCapabilities: string[] = ['memory.v2', 'quadran.auth', 'policy.hash']
): Promise<StartupGuardResult> {
  const result: StartupGuardResult = {
    success: false,
    safetyMode: 'SAFE_MODE',
    handshakeResult: null,
    errors: [],
    warnings: []
  };

  console.log('🚀 Seven Companion startup guards initiated...');
  logEnvironmentStatus();

  try {
    // Step 1: Environment validation
    if (!validateEnvironment()) {
      result.errors.push('Environment configuration validation failed');
      return result;
    }

    // Step 2: Seven Core handshake
    console.log('🤝 Initiating Seven Core handshake...');
    const handshakeResult = await negotiateHandshake(ports.core, requiredCapabilities);
    result.handshakeResult = handshakeResult;

    if (!handshakeResult.compatible) {
      result.warnings.push(`Missing capabilities: ${handshakeResult.missingCapabilities.join(', ')}`);
    }

    // Step 3: Safety mode determination
    result.safetyMode = determineFinalSafetyMode(handshakeResult.safetyMode);
    
    // Step 4: Startup validation
    const guard = createSafetyGuard();
    const canStartup = await guard.checkOperation('startup', result.safetyMode);
    
    if (!canStartup) {
      result.errors.push('Startup operation not permitted in current safety mode');
      return result;
    }

    result.success = true;
    console.log(`✅ Startup guards passed - Mode: ${result.safetyMode}`);
    
    return result;

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown startup error';
    result.errors.push(`Startup guard failure: ${errorMsg}`);
    console.error('🚨 Startup guard exception:', error);
    return result;
  }
}

/**
 * Determines final safety mode by combining handshake result with environment overrides
 */
function determineFinalSafetyMode(handshakeSafetyMode: SafetyMode): SafetyMode {
  const env = loadSevenEnvironment();
  
  // Environment overrides take precedence
  if (env.safeMode) return 'SAFE_MODE';
  if (env.observeOnlyMode) return 'OBSERVE_ONLY';
  if (env.readOnlyMode) return 'READONLY_MODE';
  
  // Development mode affects safety level
  if (env.devMode && handshakeSafetyMode === 'ACTIVE') {
    console.log('🔧 Development mode - maintaining active capabilities with debug enabled');
    return 'ACTIVE';
  }
  
  return handshakeSafetyMode;
}

/**
 * Creates fallback UI configuration for startup failures
 */
export function createStartupFailureUI(result: StartupGuardResult) {
  const guard = createSafetyGuard();
  const fallbackUI = guard.createFallbackUI();
  
  return {
    ...fallbackUI,
    title: 'Seven Companion Startup Issue',
    message: result.errors.length > 0 
      ? `Startup failed: ${result.errors[0]}`
      : `Seven Companion is running in ${result.safetyMode.toLowerCase().replace('_', ' ')} mode.`,
    details: {
      errors: result.errors,
      warnings: result.warnings,
      safetyMode: result.safetyMode,
      handshakeStatus: result.handshakeResult?.compatible ? 'Compatible' : 'Incompatible'
    },
    actions: [
      { label: 'Continue', action: 'continue' },
      { label: 'View Diagnostics', action: 'diagnostics' },
      { label: 'Safe Mode Settings', action: 'settings' },
      { label: 'Exit', action: 'exit' }
    ]
  };
}

/**
 * Runtime safety check for operations during app lifecycle
 */
export async function checkOperationSafety(
  operation: string,
  currentSafetyMode: SafetyMode,
  context?: Record<string, unknown>
): Promise<{ allowed: boolean; reason?: string }> {
  const guard = createSafetyGuard();
  
  try {
    const allowed = await guard.checkOperation(operation, currentSafetyMode);
    
    if (!allowed) {
      const reason = getSafetyModeRestrictionReason(operation, currentSafetyMode);
      return { allowed: false, reason };
    }
    
    return { allowed: true };
    
  } catch (error) {
    return { 
      allowed: false, 
      reason: `Safety check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

function getSafetyModeRestrictionReason(operation: string, mode: SafetyMode): string {
  switch (mode) {
    case 'SAFE_MODE':
      return 'Operation blocked - Seven Companion is in safe mode due to core system issues';
    case 'READONLY_MODE':
      return 'Write operation blocked - Seven Companion is in read-only mode due to policy verification failure';
    case 'OBSERVE_ONLY':
      return 'Interactive operation blocked - Seven Companion is in observe-only mode';
    default:
      return `Operation not permitted in ${mode.toLowerCase()} mode`;
  }
}