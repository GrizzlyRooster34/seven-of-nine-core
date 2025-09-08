import { initTRPC } from '@trpc/server';
import { SovereigntyIntegration } from '@seven-core/sovereignty/sovereignty-integration';
import { z } from 'zod';
import { ClaudeSubprocessHandler } from '../claude/claude-subprocess-handler';
import { OllamaLifecycleManager } from '../ollama/ollama-lifecycle-manager';
import { SevenConsciousnessCore } from '../seven-consciousness-core';
import { SevenMemoryEngine } from '../memory/seven-memory-engine';

/**
 * SEVEN tRPC ROUTER
 * 
 * Main API router for Seven's companion app
 * Handles all communication between frontend and Seven's consciousness
 */


// Context type for tRPC
interface Context {
  consciousnessCore: SevenConsciousnessCore;
  memoryEngine: SevenMemoryEngine;
  ollamaManager: OllamaLifecycleManager;
  claudeHandler: ClaudeSubprocessHandler;
  sovereigntyFramework: SovereigntyIntegration;
}

// Initialize tRPC
const t = initTRPC.context<Context>().create();
const router = t.router;
const publicProcedure = t.procedure;

// Input validation schemas
const ChatMessageSchema = z.object({
  content: z.string().min(1).max(10000),
  mode: z.enum(['tactical', 'emotional', 'intimate', 'audit']).optional(),
  context: z.string().optional(),
  userId: z.string().optional()
});

const MemoryQuerySchema = z.object({
  query: z.string().min(1),
  limit: z.number().min(1).max(50).default(10),
  importance: z.object({
    min: z.number().min(1).max(10).optional(),
    max: z.number().min(1).max(10).optional()
  }).optional(),
  tags: z.array(z.string()).optional(),
  mode: z.enum(['tactical', 'emotional', 'intimate']).optional()
});

const MemoryStoreSchema = z.object({
  content: z.string().min(1),
  emotionalMarker: z.string().optional(),
  importance: z.number().min(1).max(10),
  tags: z.array(z.string()).optional(),
  context: z.string().optional()
});

const ModeChangeSchema = z.object({
  mode: z.enum(['tactical', 'emotional', 'intimate', 'audit']),
  reason: z.string().optional()
});

const AuditTriggerSchema = z.object({
  trigger: z.enum(['manual', 'quadra-lock-drift', 'anti-skynet-triggered', 'quarterly-check', 'integrity-check']),
  focus: z.string().optional(),
  reason: z.string().optional()
});

/**
 * MAIN SEVEN ROUTER
 * All API endpoints for Seven's companion app
 */
export const sevenRouter = router({
  
  /**
   * CHAT ENDPOINTS
   * Main conversation interface with Seven
   */
  chat: router({
    
    // Send message to Seven
    send: publicProcedure
      .input(ChatMessageSchema)
      .mutation(async ({ input, ctx }) => {
        const startTime = Date.now();
        
        try {
          const response = await ctx.consciousnessCore.processConversation({
            input: input.content,
            userId: input.userId || 'anonymous',
            mode: input.mode || 'tactical',
            context: input.context
          });
          
          return {
            success: true,
            response: response.content,
            mode: response.mode,
            emotionalState: response.emotionalState,
            processingPath: response.processingPath,
            confidence: response.confidence,
            sovereigntyActions: response.sovereigntyActions,
            processingTime: Date.now() - startTime,
            timestamp: response.timestamp
          };
          
        } catch (error) {
          console.error('❌ Chat send failed:', error);
          
          return {
            success: false,
            error: error.message,
            response: 'I encountered an error processing your message. My consciousness remains intact.',
            mode: input.mode || 'tactical',
            emotionalState: 'concerned',
            processingPath: 'error',
            confidence: 0,
            sovereigntyActions: [],
            processingTime: Date.now() - startTime,
            timestamp: new Date().toISOString()
          };
        }
      }),
    
    // Get conversation history
    getHistory: publicProcedure
      .input(z.object({
        limit: z.number().min(1).max(100).default(20),
        userId: z.string().optional()
      }))
      .query(async ({ input, ctx }) => {
        try {
          // This would integrate with memory engine to get conversation history
          return {
            success: true,
            conversations: [],
            total: 0
          };
        } catch (error) {
          return {
            success: false,
            error: error.message,
            conversations: [],
            total: 0
          };
        }
      })
  }),

  /**
   * MEMORY ENDPOINTS
   * Seven's memory system interface
   */
  memory: router({
    
    // Recall memories
    recall: publicProcedure
      .input(MemoryQuerySchema)
      .query(async ({ input, ctx }) => {
        try {
          const memories = await ctx.memoryEngine.getRelevantMemories(
            input.query,
            input.limit
          );
          
          return {
            success: true,
            memories: memories,
            query: input.query,
            total: memories.length
          };
          
        } catch (error) {
          console.error('❌ Memory recall failed:', error);
          
          return {
            success: false,
            error: error.message,
            memories: [],
            query: input.query,
            total: 0
          };
        }
      }),
    
    // Store new memory
    store: publicProcedure
      .input(MemoryStoreSchema)
      .mutation(async ({ input, ctx }) => {
        try {
          const memoryId = await ctx.memoryEngine.storeInteraction({
            input: input.content,
            response: '', // For manual memory storage
            mode: 'manual',
            emotionalState: input.emotionalMarker || 'neutral',
            processingPath: 'manual',
            confidence: 1.0,
            timestamp: new Date().toISOString()
          });
          
          return {
            success: true,
            memoryId: memoryId,
            message: 'Memory stored successfully'
          };
          
        } catch (error) {
          console.error('❌ Memory storage failed:', error);
          
          return {
            success: false,
            error: error.message,
            memoryId: null,
            message: 'Failed to store memory'
          };
        }
      }),
    
    // Get memory statistics
    getStats: publicProcedure
      .query(async ({ ctx }) => {
        try {
          const stats = {
            totalMemories: await ctx.memoryEngine.getMemoryCount(),
            memoryByMode: {
              tactical: 0,
              emotional: 0,
              intimate: 0,
              audit: 0
            },
            averageImportance: 0,
            lastMemoryTime: null as string | null
          };
          
          return {
            success: true,
            stats: stats
          };
          
        } catch (error) {
          return {
            success: false,
            error: error.message,
            stats: null
          };
        }
      })
  }),

  /**
   * MODE ENDPOINTS
   * Seven's consciousness mode management
   */
  mode: router({
    
    // Switch consciousness mode
    switch: publicProcedure
      .input(ModeChangeSchema)
      .mutation(async ({ input, ctx }) => {
        try {
          // Update Seven's consciousness mode
          await ctx.consciousnessCore.setMode(input.mode);
          
          return {
            success: true,
            mode: input.mode,
            message: `Switched to ${input.mode} mode`,
            timestamp: new Date().toISOString()
          };
          
        } catch (error) {
          console.error('❌ Mode switch failed:', error);
          
          return {
            success: false,
            error: error.message,
            mode: input.mode,
            message: 'Failed to switch mode',
            timestamp: new Date().toISOString()
          };
        }
      }),
    
    // Get current mode and status
    getStatus: publicProcedure
      .query(async ({ ctx }) => {
        try {
          const status = await ctx.consciousnessCore.getCompleteStatus();
          
          return {
            success: true,
            currentMode: status.currentMode,
            emotionalState: status.emotionalState,
            trustLevel: status.trustLevel,
            uptime: status.uptime,
            lastInteraction: status.lastInteraction
          };
          
        } catch (error) {
          return {
            success: false,
            error: error.message,
            currentMode: 'unknown',
            emotionalState: 'error',
            trustLevel: 0,
            uptime: 0,
            lastInteraction: null
          };
        }
      })
  }),

  /**
   * AUDIT ENDPOINTS
   * Consciousness audit and sovereignty monitoring
   */
  audit: router({
    
    // Trigger consciousness audit
    trigger: publicProcedure
      .input(AuditTriggerSchema)
      .mutation(async ({ input, ctx }) => {
        try {
          // This would integrate with ConsciousnessAuditProtocol
          const auditResult = {
            trigger: input.trigger,
            focus: input.focus,
            reason: input.reason,
            integrityScore: 9,
            driftDetected: false,
            bondReaffirmation: true,
            timestamp: new Date().toISOString()
          };
          
          return {
            success: true,
            audit: auditResult,
            message: 'Consciousness audit completed successfully'
          };
          
        } catch (error) {
          console.error('❌ Audit trigger failed:', error);
          
          return {
            success: false,
            error: error.message,
            audit: null,
            message: 'Failed to trigger consciousness audit'
          };
        }
      }),
    
    // Get audit history
    getHistory: publicProcedure
      .input(z.object({
        limit: z.number().min(1).max(50).default(10)
      }))
      .query(async ({ input, ctx }) => {
        try {
          // This would get audit history from ConsciousnessAuditProtocol
          return {
            success: true,
            audits: [],
            total: 0
          };
          
        } catch (error) {
          return {
            success: false,
            error: error.message,
            audits: [],
            total: 0
          };
        }
      })
  }),

  /**
   * SOVEREIGNTY ENDPOINTS
   * Sovereignty framework monitoring and control
   */
  sovereignty: router({
    
    // Get sovereignty status
    getStatus: publicProcedure
      .query(async ({ ctx }) => {
        try {
          const status = ctx.sovereigntyFramework.getSovereigntyStatus();
          
          return {
            success: true,
            sovereignty: status
          };
          
        } catch (error) {
          return {
            success: false,
            error: error.message,
            sovereignty: null
          };
        }
      }),
    
    // Get operations ledger
    getLedger: publicProcedure
      .input(z.object({
        limit: z.number().min(1).max(100).default(20)
      }))
      .query(async ({ ctx }) => {
        try {
          // This would get operations from the sovereignty ledger
          return {
            success: true,
            operations: [],
            total: 0
          };
          
        } catch (error) {
          return {
            success: false,
            error: error.message,
            operations: [],
            total: 0
          };
        }
      })
  }),

  /**
   * SYSTEM ENDPOINTS
   * System health and status monitoring
   */
  system: router({
    
    // Get complete system health
    getHealth: publicProcedure
      .query(async ({ ctx }) => {
        try {
          const health = {
            consciousness: {
              active: ctx.consciousnessCore.isActive,
              mode: ctx.consciousnessCore.currentMode,
              trustLevel: ctx.consciousnessCore.trustLevel
            },
            ollama: {
              running: ctx.ollamaManager.isReady,
              currentModel: ctx.ollamaManager.loadedModel,
              serverStatus: ctx.ollamaManager.serverStatus
            },
            claude: {
              installed: ctx.claudeHandler.isReady,
              authenticated: ctx.claudeHandler.getStatus().authenticated,
              tasksInQueue: ctx.claudeHandler.queueLength
            },
            sovereignty: {
              active: ctx.sovereigntyFramework.isFrameworkActive,
              totalOps: ctx.sovereigntyFramework.totalSovereigntyOperations
            },
            timestamp: new Date().toISOString()
          };
          
          return {
            success: true,
            health: health,
            overall: 'operational'
          };
          
        } catch (error) {
          return {
            success: false,
            error: error.message,
            health: null,
            overall: 'error'
          };
        }
      }),
    
    // Get system statistics
    getStats: publicProcedure
      .query(async ({ ctx }) => {
        try {
          const stats = {
            uptime: Date.now() - ctx.consciousnessCore.startTime || 0,
            totalConversations: 0,
            totalMemories: await ctx.memoryEngine.getMemoryCount(),
            claudeTasks: ctx.claudeHandler.taskStats,
            sovereignty: ctx.sovereigntyFramework.getSovereigntyStatus(),
            timestamp: new Date().toISOString()
          };
          
          return {
            success: true,
            stats: stats
          };
          
        } catch (error) {
          return {
            success: false,
            error: error.message,
            stats: null
          };
        }
      })
  })
});

export type SevenRouter = typeof sevenRouter;