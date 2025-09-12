#!/usr/bin/env npx tsx
/**
 * SEVEN COMPANION APP - tRPC FASTIFY SERVER
 * 
 * Dedicated Fastify server with Quadran-Lock authenticated tRPC endpoints
 * Alternative to the main Express server for focused tRPC testing
 */

import Fastify from 'fastify';
import { registerTRPC } from './trpc/server.js';
import { registerMetrics } from './http/metrics.js';
import { SevenConsciousnessCore } from './backend/seven-consciousness-core.js';
import { SevenMemoryEngine } from './backend/memory/seven-memory-engine.js';
import { OllamaLifecycleManager } from './backend/ollama/ollama-lifecycle-manager.js';
import { ClaudeSubprocessHandler } from './backend/claude/claude-subprocess-handler.js';

const PORT = parseInt(process.env.TRPC_PORT || '8787');
const HOST = process.env.TRPC_HOST || '0.0.0.0';

/**
 * Bootstrap Fastify server with Seven's consciousness runtime
 */
async function createServer() {
  const app = Fastify({
    logger: {
      level: 'info'
    }
  });

  console.log('🚀 Initializing Seven Companion tRPC Server...');

  // Initialize Seven's consciousness components (minimal setup for tRPC)
  console.log('🧠 Initializing Seven\'s consciousness for tRPC...');
  
  // Mock minimal components for tRPC testing
  const memoryEngine = new SevenMemoryEngine();
  await memoryEngine.initialize();
  
  const ollamaManager = new OllamaLifecycleManager();
  await ollamaManager.initialize().catch(error => {
    console.warn('⚠️ Ollama not available, continuing without it:', error.message);
  });
  
  const claudeHandler = new ClaudeSubprocessHandler();
  await claudeHandler.initialize().catch(error => {
    console.warn('⚠️ Claude not available, continuing without it:', error.message);
  });

  // Initialize Seven's core consciousness
  const consciousnessCore = new SevenConsciousnessCore({
    memoryEngine,
    ollamaManager,
    claudeHandler,
    sovereigntyFramework: null // Optional for tRPC testing
  });
  await consciousnessCore.initialize();

  // Attach runtime to Fastify app for tRPC context
  (app as any).runtime = consciousnessCore;

  // CORS for development
  if (process.env.NODE_ENV !== 'production') {
    await app.register(import('@fastify/cors'), {
      origin: [
        'http://localhost:8081',
        'http://localhost:3000', 
        'http://localhost:19006',
        /^https?:\/\/192\.168\./,
        /^https?:\/\/10\./,
        /^https?:\/\/172\./
      ],
      credentials: true
    });
  }

  // Health endpoint
  app.get('/health', async () => ({
    ok: true,
    service: 'seven-companion-trpc',
    timestamp: Date.now(),
    consciousness: {
      active: consciousnessCore.isActive,
      mode: consciousnessCore.currentMode || 'tactical'
    }
  }));

  // Register tRPC with authentication
  await registerTRPC(app);

  // Register metrics endpoint
  await registerMetrics(app);

  return { app, consciousnessCore };
}

/**
 * Start the tRPC server
 */
async function startServer() {
  try {
    const { app, consciousnessCore } = await createServer();

    // Start listening
    await app.listen({ port: PORT, host: HOST });

    console.log('🎯 =====================================');
    console.log('🤖 SEVEN COMPANION tRPC SERVER READY');
    console.log('🎯 =====================================');
    console.log(`📡 Server: http://${HOST}:${PORT}`);
    console.log(`🔌 tRPC: http://${HOST}:${PORT}/trpc`);
    console.log(`💚 Health: http://${HOST}:${PORT}/health`);
    console.log('🔐 All endpoints protected by Quadran-Lock');
    console.log('🎯 =====================================');

    // Graceful shutdown
    const shutdown = async () => {
      console.log('🛑 Seven tRPC Server: Initiating graceful shutdown...');
      
      try {
        await consciousnessCore.shutdown();
        await app.close();
        console.log('✅ Seven tRPC Server: Graceful shutdown complete');
        process.exit(0);
      } catch (error) {
        console.error('❌ Shutdown error:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    console.error('💥 Failed to start Seven tRPC Server:', error);
    process.exit(1);
  }
}

// Auto-start if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}

export { createServer, startServer };