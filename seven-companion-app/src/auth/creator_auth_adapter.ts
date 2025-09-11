/**
 * CREATOR AUTH ADAPTER
 * 
 * Canonical interface for Quadran-Lock authentication
 * Provides lazy binding and unified auth interface
 */

export interface CreatorAuthProvider {
  authenticateCreator(deviceId: string, context: any, systemContext?: any): Promise<AuthResult>;
  runQuadranLock?(params: any): Promise<any>;
}

export interface AuthResult {
  ok?: boolean;
  authorized?: boolean;
  pass?: boolean;
  reason?: string;
  claims?: any;
}

/**
 * Resolve creator authentication provider
 * Provides unified interface regardless of underlying implementation
 */
export async function resolveCreatorAuth(provider: any): Promise<CreatorAuthProvider> {
  // If provider already has authenticateCreator, use it directly
  if (typeof provider?.authenticateCreator === 'function') {
    return provider as CreatorAuthProvider;
  }

  // If provider has runQuadranLock, wrap it
  if (typeof provider?.runQuadranLock === 'function') {
    return {
      async authenticateCreator(deviceId: string, context: any, systemContext?: any): Promise<AuthResult> {
        try {
          const result = await provider.runQuadranLock({ 
            deviceId, 
            ...context, 
            systemContext 
          });
          
          // Normalize result to AuthResult interface
          const ok = !!(result?.ok ?? result?.authorized ?? result?.pass ?? result === true);
          return {
            ok,
            reason: result?.reason ?? (ok ? 'authenticated' : 'denied'),
            claims: result
          };
        } catch (error) {
          return {
            ok: false,
            reason: error instanceof Error ? error.message : 'auth_error',
            claims: null
          };
        }
      },
      runQuadranLock: provider.runQuadranLock
    };
  }

  // Fallback mock for development
  console.warn('⚠️ No valid auth provider found, using development mock');
  return {
    async authenticateCreator(): Promise<AuthResult> {
      if (process.env.SEVEN_DEV_BYPASS_AUTH === '1') {
        return { ok: true, reason: 'dev_bypass', claims: { devBypass: true } };
      }
      return { ok: false, reason: 'no_auth_provider' };
    }
  };
}