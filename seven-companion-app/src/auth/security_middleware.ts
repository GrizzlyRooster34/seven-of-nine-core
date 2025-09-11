/**
 * SECURITY MIDDLEWARE
 * 
 * Single source of truth for all authentication across Seven Companion App
 * Enforces Quadran-Lock on all entry points (shell, HTTP, tRPC, background agents)
 */

import { resolveCreatorAuth, type CreatorAuthProvider } from './creator_auth_adapter.js';

export type AuthResult = { 
  ok: boolean; 
  reason?: string; 
  claims?: any;
};

/**
 * Enforce Quadran-Lock authentication across all entry points
 */
export async function enforceQuadran(
  runtime: any,
  opts: { 
    deviceId?: string; 
    context?: any; 
    systemContext?: any; 
    requireBond?: boolean;
  } = {}
): Promise<AuthResult> {
  // DEV BYPASS - explicit, auditable, off by default
  if (process.env.SEVEN_DEV_BYPASS_AUTH === "1") {
    console.warn('🚨 SECURITY: Development auth bypass enabled');
    return { ok: true, claims: { devBypass: true } };
  }

  // Ensure auth is bound to runtime
  await (__bindCreatorAuth(runtime));
  
  if (!runtime.creatorAuth?.authenticateCreator) {
    return { ok: false, reason: "auth_not_bound" };
  }

  // Prepare authentication context
  const deviceId = opts.deviceId ?? 
                   opts.context?.deviceId ?? 
                   process.env.DEVICE_ID ?? 
                   process.env.TERMUX_VERSION ? `termux-${process.env.USER}` : 
                   "unknown-device";
                   
  const systemContext = { 
    platform: process.platform, 
    pid: process.pid,
    nodeVersion: process.version,
    ...(opts.systemContext ?? {}) 
  };
  
  const context = { 
    ...(opts.context ?? {}), 
    deviceId,
    timestamp: new Date().toISOString()
  };

  try {
    const result = await runtime.creatorAuth.authenticateCreator(deviceId, context, systemContext);
    
    // Normalize result to consistent AuthResult format
    const ok = !!(result?.ok ?? result?.authorized ?? result?.pass ?? result === true);
    
    if (ok) {
      console.log(`🔐 Quadran-Lock: Authentication successful for device: ${deviceId}`);
    } else {
      console.warn(`🔐 Quadran-Lock: Authentication failed - ${result?.reason ?? "denied"}`);
    }
    
    return { 
      ok, 
      reason: result?.reason ?? (ok ? "authenticated" : "denied"),
      claims: result?.claims ?? result
    };
    
  } catch (error) {
    console.error('🔐 Quadran-Lock: Authentication error:', error);
    return { 
      ok: false, 
      reason: error instanceof Error ? error.message : "auth_exception" 
    };
  }
}

/**
 * Bind creator authentication to runtime (lazy loading)
 * Prevents "is not a function" errors by ensuring auth is always available
 */
async function __bindCreatorAuth(runtime: any): Promise<void> {
  if (runtime.creatorAuth?.authenticateCreator) {
    return; // Already bound
  }

  try {
    // Dynamic import to avoid circular dependencies
    const provider = await import('./creator_proof.js');
    runtime.creatorAuth = await resolveCreatorAuth(provider);
    
    // Last-ditch compatibility shim for legacy implementations
    if (typeof runtime.creatorAuth.authenticateCreator !== "function") {
      const p: any = runtime.creatorAuth;
      runtime.creatorAuth.authenticateCreator = async (deviceId: string, context: any, systemContext?: any) => {
        return p.runQuadranLock?.({ deviceId, ...(context || {}), systemContext }) ?? 
               { ok: false, reason: "no_auth_method" };
      };
    }
    
    console.log('🔐 Creator authentication bound to runtime');
    
  } catch (error) {
    console.error('🔐 Failed to bind creator authentication:', error);
    
    // Emergency fallback to prevent complete system failure
    runtime.creatorAuth = {
      async authenticateCreator(): Promise<AuthResult> {
        if (process.env.SEVEN_DEV_BYPASS_AUTH === '1') {
          return { ok: true, reason: 'emergency_dev_bypass', claims: { emergency: true } };
        }
        return { ok: false, reason: 'auth_binding_failed' };
      }
    };
  }
}

// Export the binder for manual runtime initialization
export { __bindCreatorAuth };