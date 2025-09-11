/**
 * SEVEN COMPANION APP - tRPC CONTEXT
 * 
 * Enforces Quadran-Lock authentication for all tRPC procedures
 * Provides database and claims context to authenticated requests
 */

import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import type { FastifyRequest } from 'fastify';
import { enforceQuadran } from '../auth/security_middleware.js';

export interface TRPCContext {
  db: any;
  runtime: any;
  claims?: any;
  deviceId?: string;
  isAuthenticated: boolean;
}

/**
 * Create tRPC context with Quadran-Lock authentication enforcement
 */
export async function createContext({ req }: CreateFastifyContextOptions): Promise<TRPCContext> {
  // Get runtime attached to Fastify instance
  const runtime: any = (req.server as any).runtime;
  
  if (!runtime) {
    throw new Error('Runtime not available - server initialization error');
  }

  try {
    // Extract device context from request
    const deviceId = (req.headers['x-device-id'] as string) || 'unknown-device';
    const context = {
      path: req.url,
      method: req.method,
      userAgent: req.headers['user-agent']
    };
    const systemContext = {
      ip: req.ip,
      protocol: req.protocol,
      secure: req.protocol === 'https'
    };

    // Enforce Quadran-Lock authentication
    const authResult = await enforceQuadran(runtime, {
      deviceId,
      context,
      systemContext
    });

    if (!authResult.ok) {
      console.warn(`🔐 tRPC Context: Auth denied for ${deviceId} - ${authResult.reason}`);
      throw new Error(`UNAUTHORIZED: ${authResult.reason || 'Access denied'}`);
    }

    console.log(`🔐 tRPC Context: Auth passed for ${deviceId}`);

    return {
      db: runtime.db || runtime.memoryEngine || null,
      runtime: runtime,
      claims: authResult.claims,
      deviceId: deviceId,
      isAuthenticated: true
    };

  } catch (error) {
    console.error('🔐 tRPC Context: Authentication error:', error);
    
    // For development with bypass flag, allow through with limited context
    if (process.env.SEVEN_DEV_BYPASS_AUTH === '1') {
      console.warn('🚨 tRPC Context: Using dev bypass mode');
      return {
        db: runtime.db || runtime.memoryEngine || null,
        runtime: runtime,
        claims: { devBypass: true },
        deviceId: 'dev-bypass-device',
        isAuthenticated: true
      };
    }

    throw error;
  }
}

export type Context = TRPCContext;