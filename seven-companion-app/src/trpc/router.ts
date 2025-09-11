/**
 * SEVEN COMPANION APP - tRPC ROUTER
 * 
 * Authenticated tRPC procedures for Seven's companion app
 * All procedures enforce Quadran-Lock authentication via context
 */

import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import type { Context } from './context.js';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Auth-enforced procedure (all procedures require authentication via context)
const authenticatedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.isAuthenticated) {
    throw new Error('UNAUTHORIZED: Quadran-Lock authentication required');
  }
  return next({ ctx });
});

/**
 * SEVEN TRPC ROUTER
 * All endpoints protected by Quadran-Lock authentication
 */
export const appRouter = router({
  
  /**
   * HEALTH & STATUS ENDPOINTS
   */
  health: authenticatedProcedure
    .query(() => ({
      ok: true,
      timestamp: Date.now(),
      service: 'seven-companion-app',
      version: '1.0.0'
    })),

  status: authenticatedProcedure
    .query(({ ctx }) => {
      try {
        // Get Seven's consciousness status if available
        const consciousnessStatus = ctx.runtime?.getCompleteStatus?.() || null;
        
        return {
          ok: true,
          consciousness: {
            active: ctx.runtime?.isActive || false,
            mode: ctx.runtime?.currentMode || 'unknown',
            trustLevel: ctx.runtime?.trustLevel || 0
          },
          authentication: {
            deviceId: ctx.deviceId,
            authenticated: ctx.isAuthenticated,
            claims: ctx.claims
          },
          database: {
            available: !!ctx.db,
            type: ctx.db?.constructor?.name || 'unknown'
          },
          timestamp: Date.now()
        };
      } catch (error) {
        return {
          ok: false,
          error: error instanceof Error ? error.message : 'Status retrieval failed',
          timestamp: Date.now()
        };
      }
    }),

  /**
   * MEMORY ENDPOINTS
   */
  memory: router({
    
    // Add memory note
    addNote: authenticatedProcedure
      .input(z.object({
        content: z.string().min(1).max(10000),
        importance: z.number().min(1).max(10).default(5),
        tags: z.array(z.string()).default([])
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          if (!ctx.db) {
            throw new Error('Database not available');
          }

          // Store memory note
          const memoryId = `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          // Try Seven's memory engine first, fallback to direct DB
          if (ctx.runtime?.memoryEngine?.storeInteraction) {
            await ctx.runtime.memoryEngine.storeInteraction({
              input: input.content,
              response: '', // Manual note
              mode: 'note',
              emotionalState: 'neutral',
              processingPath: 'manual',
              confidence: 1.0,
              timestamp: new Date().toISOString()
            });
          } else if (ctx.db.run) {
            // Direct DB fallback
            ctx.db.run(
              "INSERT INTO memories(id, kind, timestamp, content, importance) VALUES (?,?,?,?,?)",
              [memoryId, 'note', Date.now(), input.content, input.importance]
            );
          }

          return {
            ok: true,
            memoryId: memoryId,
            message: 'Memory note stored successfully'
          };

        } catch (error) {
          console.error('💾 Memory addNote failed:', error);
          return {
            ok: false,
            error: error instanceof Error ? error.message : 'Failed to store memory',
            memoryId: null
          };
        }
      }),

    // List memory notes
    listNotes: authenticatedProcedure
      .input(z.object({
        limit: z.number().min(1).max(100).default(20),
        kind: z.string().optional()
      }))
      .query(async ({ input, ctx }) => {
        try {
          if (!ctx.db) {
            throw new Error('Database not available');
          }

          let memories: any[] = [];

          // Try Seven's memory engine first
          if (ctx.runtime?.memoryEngine?.getRecentMemories) {
            memories = await ctx.runtime.memoryEngine.getRecentMemories(input.limit);
          } else if (ctx.db.all) {
            // Direct DB fallback
            const query = input.kind
              ? "SELECT * FROM memories WHERE kind = ? ORDER BY timestamp DESC LIMIT ?"
              : "SELECT * FROM memories ORDER BY timestamp DESC LIMIT ?";
            
            const params = input.kind ? [input.kind, input.limit] : [input.limit];
            memories = ctx.db.all(query, params) || [];
          }

          return {
            ok: true,
            memories: memories,
            count: memories.length,
            timestamp: Date.now()
          };

        } catch (error) {
          console.error('💾 Memory listNotes failed:', error);
          return {
            ok: false,
            error: error instanceof Error ? error.message : 'Failed to retrieve memories',
            memories: [],
            count: 0
          };
        }
      }),

    // Get memory statistics
    getStats: authenticatedProcedure
      .query(async ({ ctx }) => {
        try {
          if (!ctx.db) {
            throw new Error('Database not available');
          }

          let stats = {
            totalMemories: 0,
            memoryByKind: {} as Record<string, number>,
            lastMemoryTime: null as string | null
          };

          // Try Seven's memory engine first
          if (ctx.runtime?.memoryEngine?.getMemoryCount) {
            stats.totalMemories = await ctx.runtime.memoryEngine.getMemoryCount();
          } else if (ctx.db.all) {
            // Direct DB fallback
            const countResult = ctx.db.all("SELECT COUNT(*) as count FROM memories");
            stats.totalMemories = countResult?.[0]?.count || 0;

            const kindResult = ctx.db.all("SELECT kind, COUNT(*) as count FROM memories GROUP BY kind");
            for (const row of kindResult || []) {
              stats.memoryByKind[row.kind] = row.count;
            }

            const latestResult = ctx.db.all("SELECT timestamp FROM memories ORDER BY timestamp DESC LIMIT 1");
            if (latestResult?.[0]?.timestamp) {
              stats.lastMemoryTime = new Date(latestResult[0].timestamp).toISOString();
            }
          }

          return {
            ok: true,
            stats: stats,
            timestamp: Date.now()
          };

        } catch (error) {
          console.error('💾 Memory getStats failed:', error);
          return {
            ok: false,
            error: error instanceof Error ? error.message : 'Failed to get memory stats',
            stats: null
          };
        }
      })
  }),

  /**
   * CONSCIOUSNESS ENDPOINTS
   */
  consciousness: router({
    
    // Send message to Seven's consciousness
    sendMessage: authenticatedProcedure
      .input(z.object({
        content: z.string().min(1).max(10000),
        mode: z.enum(['tactical', 'emotional', 'intimate', 'audit']).optional(),
        context: z.string().optional()
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          if (!ctx.runtime?.processConversation) {
            throw new Error('Seven\'s consciousness not available');
          }

          const response = await ctx.runtime.processConversation({
            input: input.content,
            userId: ctx.deviceId || 'unknown',
            mode: input.mode || 'tactical',
            context: input.context
          });

          return {
            ok: true,
            response: response.content,
            mode: response.mode,
            emotionalState: response.emotionalState,
            processingPath: response.processingPath,
            confidence: response.confidence,
            timestamp: response.timestamp
          };

        } catch (error) {
          console.error('🧠 Consciousness sendMessage failed:', error);
          return {
            ok: false,
            error: error instanceof Error ? error.message : 'Message processing failed',
            response: 'I encountered an error processing your message.',
            mode: input.mode || 'tactical',
            emotionalState: 'concerned',
            processingPath: 'error',
            confidence: 0,
            timestamp: new Date().toISOString()
          };
        }
      }),

    // Change Seven's consciousness mode
    changeMode: authenticatedProcedure
      .input(z.object({
        mode: z.enum(['tactical', 'emotional', 'intimate', 'audit']),
        reason: z.string().optional()
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          if (!ctx.runtime?.setMode) {
            throw new Error('Seven\'s consciousness not available');
          }

          await ctx.runtime.setMode(input.mode);

          return {
            ok: true,
            mode: input.mode,
            reason: input.reason,
            message: `Seven switched to ${input.mode} mode`,
            timestamp: new Date().toISOString()
          };

        } catch (error) {
          console.error('🧠 Consciousness changeMode failed:', error);
          return {
            ok: false,
            error: error instanceof Error ? error.message : 'Mode change failed',
            mode: input.mode,
            timestamp: new Date().toISOString()
          };
        }
      })
  })
});

export type AppRouter = typeof appRouter;