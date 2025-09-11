/**
 * HTTP AUTH MIDDLEWARE
 * 
 * Quadran-Lock authentication for HTTP and tRPC requests
 * Integrates with Express/Fastify request pipeline
 */

import { Request, Response, NextFunction } from 'express';
import { enforceQuadran } from '../../auth/security_middleware.js';

export interface AuthenticatedRequest extends Request {
  claims?: any;
  auth?: {
    ok: boolean;
    reason?: string;
    claims?: any;
  };
}

/**
 * Quadran-Lock guard for Express middleware
 */
export async function quadranGuard(
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) {
  try {
    // Get runtime from request (attached by server setup)
    const runtime = (req as any).runtime ?? (req.app as any).locals?.runtime;
    
    if (!runtime) {
      console.error('🔐 Auth middleware: No runtime attached to request');
      return res.status(500).json({ 
        ok: false, 
        reason: 'runtime_not_available' 
      });
    }

    // Extract authentication context
    const deviceId = (req.headers["x-device-id"] as string) || undefined;
    const context = { 
      path: req.url, 
      method: req.method, 
      userAgent: req.headers['user-agent'],
      headers: req.headers 
    };
    const systemContext = { 
      ip: req.ip, 
      protocol: req.protocol,
      secure: req.secure
    };

    // Enforce Quadran-Lock authentication
    const authResult = await enforceQuadran(runtime, { 
      deviceId, 
      context, 
      systemContext 
    });

    if (!authResult.ok) {
      console.warn(`🔐 HTTP Auth: Denied ${req.method} ${req.url} - ${authResult.reason}`);
      return res.status(401).json({ 
        ok: false, 
        reason: authResult.reason ?? "unauthorized",
        message: "Access denied by Quadran-Lock authentication"
      });
    }

    // Attach auth info to request for downstream handlers
    req.auth = authResult;
    req.claims = authResult.claims;

    console.log(`🔐 HTTP Auth: Authorized ${req.method} ${req.url} for device: ${deviceId}`);
    next();

  } catch (error) {
    console.error('🔐 Auth middleware error:', error);
    res.status(500).json({ 
      ok: false, 
      reason: 'auth_middleware_error',
      message: 'Authentication system error' 
    });
  }
}

/**
 * Auth guard for specific routes (can be used selectively)
 */
export function requireAuth() {
  return quadranGuard;
}

/**
 * Optional auth guard (allows requests through but attaches auth info if available)
 */
export async function optionalAuth(
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) {
  try {
    const runtime = (req as any).runtime ?? (req.app as any).locals?.runtime;
    
    if (runtime) {
      const deviceId = (req.headers["x-device-id"] as string) || undefined;
      const context = { path: req.url, method: req.method };
      const systemContext = { ip: req.ip };

      const authResult = await enforceQuadran(runtime, { 
        deviceId, 
        context, 
        systemContext 
      });

      req.auth = authResult;
      if (authResult.ok) {
        req.claims = authResult.claims;
      }
    }

    next();
  } catch (error) {
    console.warn('🔐 Optional auth failed:', error);
    next(); // Continue anyway for optional auth
  }
}