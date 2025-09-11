#!/usr/bin/env npx tsx
/**
 * SIMPLE METRICS TEST SERVER
 */

import Fastify from 'fastify';
import { registerMetrics } from './src/http/metrics.js';

const app = Fastify({ logger: true });

// Mock runtime for testing
(app as any).runtime = {
  isActive: true,
  currentMode: 'tactical',
  bootTime: Date.now() - 30000,
  db: null // Mock SQLite not available
};

await registerMetrics(app);

app.get('/health', async () => ({ ok: true, service: 'test-metrics' }));

await app.listen({ port: 8787, host: '0.0.0.0' });
console.log('🎯 Test metrics server ready on http://0.0.0.0:8787/metrics');