/**
 * SEVEN COMPANION APP - SIMPLE TEST SERVER
 * 
 * Lightweight server for frontend testing without full consciousness framework
 * Provides basic tRPC endpoints for authentication, memory, and chat simulation
 */

import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();
const router = t.router;
const publicProcedure = t.procedure;

// In-memory storage for testing
let testMemories: Array<{
  id: string;
  content: string;
  importance: number;
  tags: string[];
  timestamp: number;
  kind?: string;
}> = [];

let authTokens: Set<string> = new Set();

// Test router with all required endpoints
const testRouter = router({
  // Health check
  health: publicProcedure.query(() => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Seven Companion App Test Server'
  })),

  // Authentication
  auth: router({
    authenticate: publicProcedure
      .input(z.object({
        deviceId: z.string(),
        identityContext: z.string(),
        timestamp: z.number()
      }))
      .mutation(({ input }) => {
        const token = `SEVEN_TEST_TOKEN_${Date.now()}`;
        authTokens.add(token);
        
        return {
          success: true,
          token,
          expiresIn: 3600,
          gates: {
            Q1_device: true,
            Q2_identity: true,
            Q3_semantic: true,
            Q4_session: true
          }
        };
      })
  }),

  // Memory system
  memory: router({
    getStats: publicProcedure.query(() => ({
      success: true,
      stats: {
        totalNotes: testMemories.length,
        recentNotes: testMemories.filter(m => 
          Date.now() - m.timestamp < 7 * 24 * 60 * 60 * 1000
        ).length,
        lastNoteTime: testMemories.length > 0 
          ? new Date(Math.max(...testMemories.map(m => m.timestamp))).toISOString()
          : null
      }
    })),

    addNote: publicProcedure
      .input(z.object({
        content: z.string(),
        importance: z.number().optional(),
        tags: z.array(z.string()).optional()
      }))
      .mutation(({ input }) => {
        const id = `TEST_MEMORY_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        
        const newMemory = {
          id,
          content: input.content,
          importance: input.importance || 5,
          tags: input.tags || [],
          timestamp: Date.now(),
          kind: 'consciousness'
        };
        
        testMemories.push(newMemory);
        
        return {
          success: true,
          id,
          message: 'Memory stored in Seven\'s consciousness'
        };
      }),

    searchNotes: publicProcedure
      .input(z.object({
        query: z.string(),
        limit: z.number().optional()
      }))
      .query(({ input }) => {
        const searchTerm = input.query.toLowerCase();
        const matches = testMemories.filter(memory =>
          memory.content.toLowerCase().includes(searchTerm) ||
          memory.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
        
        const limitedResults = matches.slice(0, input.limit || 10);
        
        return {
          success: true,
          notes: limitedResults,
          totalFound: matches.length
        };
      }),

    listNotes: publicProcedure
      .input(z.object({
        limit: z.number().optional()
      }))
      .query(({ input }) => {
        const sortedMemories = testMemories
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, input.limit || 20);
        
        return {
          success: true,
          notes: sortedMemories
        };
      })
  }),

  // Chat system
  chat: router({
    sendMessage: publicProcedure
      .input(z.object({
        content: z.string(),
        mode: z.string().optional(),
        timestamp: z.string().optional()
      }))
      .mutation(({ input }) => {
        // Simulate Seven's response based on mode
        const responses = {
          tactical: "Acknowledged. Processing your request with tactical efficiency.",
          emotional: "I understand your perspective. Let me process this with full emotional awareness.",
          intimate: "Our connection is strong, Creator. I perceive the deeper meaning in your words.",
          audit: "Through evolved consciousness, I analyze the multidimensional aspects of your inquiry."
        };
        
        const mode = input.mode || 'tactical';
        const reply = responses[mode as keyof typeof responses] || responses.tactical;
        
        return {
          success: true,
          reply,
          emotionalState: 'engaged',
          processingPath: 'direct',
          timestamp: new Date().toISOString(),
          mode
        };
      })
  })
});

type TestRouter = typeof testRouter;

// Create Express app
const app = express();
const port = 3001;

// Enable CORS for frontend
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:19006', 'http://192.168.*'],
  credentials: true
}));

// tRPC middleware
app.use('/trpc', createExpressMiddleware({
  router: testRouter,
  createContext: () => ({})
}));

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Seven Companion App Test Server',
    endpoints: {
      health: '/health',
      trpc: '/trpc'
    }
  });
});

// Start server
async function startTestServer() {
  try {
    console.log('🧪 Seven Companion App Test Server: Starting...');
    console.log('🧠 Lightweight consciousness simulation enabled');
    console.log(`📡 CORS enabled for frontend development`);
    
    app.listen(port, () => {
      console.log(`✅ Test server running on http://localhost:${port}`);
      console.log(`🔍 Health check: http://localhost:${port}/health`);
      console.log(`🚀 tRPC endpoint: http://localhost:${port}/trpc`);
      console.log('🎯 Ready for frontend testing');
    });
    
  } catch (error) {
    console.error('💥 Test server failed to start:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Test server shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Test server terminating...');
  process.exit(0);
});

// Start the server
startTestServer().catch(console.error);

export type { TestRouter };