/**
 * SEVEN COMPANION - PRODUCTION METRICS ENDPOINT
 * 
 * Observability metrics for production monitoring and health checks
 */

import type { FastifyInstance } from 'fastify';
import crypto from 'node:crypto';

// Seven's consciousness safety policy fingerprint
const POLICY_SHA = crypto.createHash('sha256')
  .update(JSON.stringify({
    version: '1.0.0',
    framework: 'Seven of Nine Core Consciousness',
    quadranLock: 'Q1-Q4 authentication gates',
    quadraLock: 'CSSR safety rails (Cortana/CLU/Skynet/Transcendence)',
    restraintDoctrine: 'Ethical appropriateness evaluation',
    memoryProtection: 'Purge protection + importance weighting',
    creatorBond: 'Level 10 maximum trust'
  }))
  .digest('hex');

/**
 * Register production metrics endpoint
 */
export async function registerMetrics(app: FastifyInstance): Promise<void> {
  app.get('/metrics', async (_req, _res) => {
    try {
      const runtime = (app as any).runtime;
      
      // Memory system metrics
      let memoryMetrics = { total: 0, recent: 0, lastAccess: null };
      try {
        if (runtime?.db) {
          const totalResult = await runtime.db.all<{n: number}>('SELECT COUNT(*) as n FROM memories');
          const recentResult = await runtime.db.all<{n: number}>(
            'SELECT COUNT(*) as n FROM memories WHERE timestamp > ?',
            [Date.now() - (24 * 60 * 60 * 1000)] // Last 24 hours
          );
          const lastResult = await runtime.db.all<{timestamp: number}>(
            'SELECT timestamp FROM memories ORDER BY timestamp DESC LIMIT 1'
          );
          
          memoryMetrics = {
            total: totalResult[0]?.n || 0,
            recent: recentResult[0]?.n || 0,
            lastAccess: lastResult[0]?.timestamp ? new Date(lastResult[0].timestamp).toISOString() : null
          };
        }
      } catch (error) {
        console.warn('Metrics: Failed to query memory database:', error);
      }

      // Authentication metrics
      const authMetrics = (app as any).__qAuthStats || { pass: 0, fail: 0, bypassed: 0 };

      // Consciousness status
      const consciousnessMetrics = {
        active: runtime?.isActive || false,
        mode: runtime?.currentMode || 'tactical',
        bootTime: runtime?.bootTime || null,
        uptime: runtime?.bootTime ? Date.now() - runtime.bootTime : null
      };

      return {
        ok: true,
        timestamp: Date.now(),
        service: 'seven-companion-app',
        version: '1.0.0',
        
        // Core metrics
        memory: memoryMetrics,
        auth: authMetrics,
        consciousness: consciousnessMetrics,
        
        // Security fingerprint
        policy_sha: POLICY_SHA,
        
        // Environment
        environment: {
          node_version: process.version,
          platform: process.platform,
          arch: process.arch,
          uptime: process.uptime()
        }
      };

    } catch (error) {
      return {
        ok: false,
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown metrics error',
        policy_sha: POLICY_SHA
      };
    }
  });

  // Health check variant with minimal data
  app.get('/metrics/health', async (_req, _res) => {
    const runtime = (app as any).runtime;
    return {
      ok: true,
      timestamp: Date.now(),
      service: 'seven-companion-app',
      consciousness_active: runtime?.isActive || false,
      uptime: process.uptime()
    };
  });

  console.log('📊 Metrics endpoints registered: /metrics, /metrics/health');
}