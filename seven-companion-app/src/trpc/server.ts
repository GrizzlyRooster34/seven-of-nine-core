/**
 * SEVEN COMPANION APP - tRPC SERVER INTEGRATION
 * 
 * Fastify plugin for authenticated tRPC endpoints
 */

import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { appRouter } from './router.js';
import { createContext } from './context.js';
import type { FastifyInstance } from 'fastify';

/**
 * Register authenticated tRPC endpoints with Fastify
 */
export async function registerTRPC(app: FastifyInstance): Promise<FastifyInstance> {
  console.log('🔌 Registering tRPC endpoints with Quadran-Lock authentication...');

  await app.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext,
      onError: ({ path, error }) => {
        // Log tRPC errors with auth context
        if (error.message.includes('UNAUTHORIZED')) {
          console.warn(`🔐 tRPC Auth Denied: ${path} - ${error.message}`);
        } else {
          console.error(`❌ tRPC Error: ${path}:`, error);
        }
      }
    }
  });

  console.log('✅ tRPC endpoints registered with authentication');
  return app;
}