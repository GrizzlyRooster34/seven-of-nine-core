/**
 * SEVEN COMPANION - tRPC CLIENT
 * 
 * Type-safe tRPC client for mobile app remote mode
 */

import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../trpc/router.js';

// Environment configuration
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND || 'http://localhost:8787';

/**
 * tRPC client for Seven Companion App
 * Provides type-safe API calls to the backend server
 */
export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${BACKEND_URL}/trpc`,
      headers: () => {
        // Add authentication headers if available
        const authToken = global.localStorage?.getItem('seven_auth_token');
        return authToken ? { authorization: `Bearer ${authToken}` } : {};
      },
    }),
  ],
});

/**
 * Health check utility for testing connection
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const result = await trpc.health.query();
    return result.ok === true;
  } catch (error) {
    console.warn('Backend health check failed:', error);
    return false;
  }
}

/**
 * Test memory operations
 */
export async function testMemoryOperations() {
  try {
    // Test adding a note
    const addResult = await trpc.memory.addNote.mutate({
      content: 'Test note from mobile app',
      importance: 7,
      tags: ['mobile', 'test', 'trpc']
    });

    if (!addResult.success) {
      throw new Error(`Failed to add note: ${addResult.error}`);
    }

    // Test listing notes
    const listResult = await trpc.memory.listNotes.query({ limit: 5 });
    
    if (!listResult.success) {
      throw new Error(`Failed to list notes: ${listResult.error}`);
    }

    // Test memory stats
    const statsResult = await trpc.memory.getStats.query();
    
    if (!statsResult.success) {
      throw new Error(`Failed to get stats: ${statsResult.error}`);
    }

    return {
      success: true,
      noteId: addResult.id,
      notesCount: listResult.notes.length,
      totalMemories: statsResult.stats?.totalNotes || 0
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Configure backend URL for different environments
 */
export function configureBackend(url: string) {
  console.log(`📡 Seven tRPC Client: Configured for ${url}`);
  // Note: This would require recreating the client in a real implementation
  // For now, set environment variable before client creation
}

export default trpc;