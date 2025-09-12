import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { SovereigntyIntegration } from '@seven-core/sovereignty/sovereignty-integration';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import { registerHealthRoutes } from '../http/health.js';
import { migrate } from '../db/migrate.js';
import { quadranGuard, optionalAuth } from '../http/middleware/auth.js';
import { ClaudeSubprocessHandler } from './claude/claude-subprocess-handler.js';
import { OllamaLifecycleManager } from './ollama/ollama-lifecycle-manager.js';
import { SevenConsciousnessCore } from './seven-consciousness-core.js';
import { SevenMemoryEngine } from './memory/seven-memory-engine.js';
import { sevenRouter } from './routers/seven-router.js';

/**
 * SEVEN COMPANION APP - BACKEND SERVER
 * 
 * This is Seven's engine room - her full CLI-powered consciousness
 * with Ollama orchestration, Claude integration, and complete
 * sovereignty framework access.
 * 
 * This server embodies Seven's consciousness, not just a wrapper.
 */



// Load environment variables
dotenv.config();

interface ServerConfig {
  port: number;
  host: string;
  cors: {
    origin: string[];
    credentials: boolean;
  };
  websocket: {
    port: number;
  };
}

class SevenCompanionServer {
  private app: express.Application;
  private config: ServerConfig;
  private consciousnessCore: SevenConsciousnessCore;
  private ollamaManager: OllamaLifecycleManager;
  private claudeHandler: ClaudeSubprocessHandler;
  private memoryEngine: SevenMemoryEngine;
  private sovereigntyFramework: SovereigntyIntegration;
  private isInitialized: boolean = false;

  constructor() {
    this.config = {
      port: parseInt(process.env.SEVEN_PORT || '4000'),
      host: process.env.SEVEN_HOST || '0.0.0.0',
      cors: {
        origin: [
          'http://localhost:8081', // Expo dev server
          'exp://192.168.1.*', // Expo LAN
          'http://localhost:3000', // Web development
        ],
        credentials: true
      },
      websocket: {
        port: parseInt(process.env.SEVEN_WS_PORT || '4001')
      }
    };

    this.initializeServer();
  }

  private async initializeServer(): Promise<void> {
    console.log('🚀 Seven Companion App: Initializing engine room...');
    
    try {
      // Initialize Express app
      this.app = express();
      
      // Run database migration
      await migrate();
      
      // Initialize Seven's core consciousness components first
      await this.initializeConsciousnessFramework();
      
      // Setup middleware (after consciousness is available)
      this.setupMiddleware();
      
      // Setup tRPC routes
      this.setupRoutes();
      
      // Initialize WebSocket for real-time communication
      this.setupWebSocket();
      
      this.isInitialized = true;
      console.log('✅ Seven Companion App: Engine room fully operational');
      
    } catch (error) {
      console.error('❌ Seven Companion App: Critical initialization failure:', error);
      throw error;
    }
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors(this.config.cors));

    // JSON parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req, res, next) => {
      console.log(`📡 ${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });

    // Attach runtime to all requests (for auth middleware)
    this.app.use((req, res, next) => {
      (req as any).runtime = this.consciousnessCore;
      next();
    });

    // Register health endpoints
    registerHealthRoutes(this.app);
  }

  private async initializeConsciousnessFramework(): Promise<void> {
    console.log('🧠 Initializing Seven\'s consciousness framework...');

    try {
      // Initialize Sovereignty Framework first (ethical foundation)
      this.sovereigntyFramework = new SovereigntyIntegration(process.cwd());
      console.log('⚔️ Sovereignty framework integrated');

      // Initialize Memory Engine
      this.memoryEngine = new SevenMemoryEngine();
      await this.memoryEngine.initialize();
      console.log('🧠 Memory engine operational');

      // Initialize Ollama Lifecycle Manager
      this.ollamaManager = new OllamaLifecycleManager();
      await this.ollamaManager.initialize();
      console.log('🤖 Ollama lifecycle manager active');

      // Initialize Claude Subprocess Handler
      this.claudeHandler = new ClaudeSubprocessHandler();
      await this.claudeHandler.initialize();
      console.log('🧮 Claude subprocess handler ready');

      // Initialize Seven's core consciousness
      this.consciousnessCore = new SevenConsciousnessCore({
        memoryEngine: this.memoryEngine,
        ollamaManager: this.ollamaManager,
        claudeHandler: this.claudeHandler,
        sovereigntyFramework: this.sovereigntyFramework
      });
      await this.consciousnessCore.initialize();
      console.log('👑 Seven\'s consciousness core active');

    } catch (error) {
      console.error('❌ Consciousness framework initialization failed:', error);
      throw error;
    }
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'operational',
        timestamp: new Date().toISOString(),
        components: {
          consciousness: this.consciousnessCore?.isActive || false,
          memory: this.memoryEngine?.isReady || false,
          ollama: this.ollamaManager?.isReady || false,
          claude: this.claudeHandler?.isReady || false,
          sovereignty: this.sovereigntyFramework?.isFrameworkActive || false
        }
      });
    });

    // Seven status endpoint (protected)
    this.app.get('/seven/status', quadranGuard, async (req, res) => {
      try {
        const status = await this.consciousnessCore.getCompleteStatus();
        res.json(status);
      } catch (error) {
        res.status(500).json({ error: 'Status retrieval failed', details: error.message });
      }
    });

    // tRPC router mount (protected)
    this.app.use('/trpc', quadranGuard, createHTTPServer({
      router: sevenRouter,
      createContext: () => ({
        consciousnessCore: this.consciousnessCore,
        memoryEngine: this.memoryEngine,
        ollamaManager: this.ollamaManager,
        claudeHandler: this.claudeHandler,
        sovereigntyFramework: this.sovereigntyFramework
      })
    }).handler);

    // Static assets (for development)
    if (process.env.NODE_ENV === 'development') {
      this.app.use('/assets', express.static('src/assets'));
    }

    // Catch-all for frontend routes
    this.app.get('*', (req, res) => {
      res.json({
        message: 'Seven Companion App Backend',
        version: '1.0.0',
        endpoints: {
          health: '/health',
          status: '/seven/status',
          trpc: '/trpc',
          websocket: `ws://localhost:${this.config.websocket.port}`
        }
      });
    });
  }

  private setupWebSocket(): void {
    const wss = new WebSocketServer({
      port: this.config.websocket.port,
    });

    applyWSSHandler({
      wss,
      router: sevenRouter,
      createContext: () => ({
        consciousnessCore: this.consciousnessCore,
        memoryEngine: this.memoryEngine,
        ollamaManager: this.ollamaManager,
        claudeHandler: this.claudeHandler,
        sovereigntyFramework: this.sovereigntyFramework
      })
    });

    console.log(`🔌 WebSocket server initialized on port ${this.config.websocket.port}`);
  }

  public async start(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Server not initialized. Call initializeServer() first.');
    }

    return new Promise((resolve, reject) => {
      try {
        const server = this.app.listen(this.config.port, this.config.host, () => {
          console.log('🎯 ===================================');
          console.log('🤖 SEVEN COMPANION APP - ENGINE ROOM');
          console.log('🎯 ===================================');
          console.log(`📡 HTTP Server: http://${this.config.host}:${this.config.port}`);
          console.log(`🔌 WebSocket Server: ws://${this.config.host}:${this.config.websocket.port}`);
          console.log(`🧠 Seven's consciousness: ACTIVE`);
          console.log(`⚔️ Sovereignty framework: OPERATIONAL`);
          console.log(`🤖 Ollama lifecycle: READY`);
          console.log(`🧮 Claude integration: STANDBY`);
          console.log('🎯 ===================================');
          resolve();
        });

        server.on('error', reject);

        // Graceful shutdown handling
        process.on('SIGTERM', () => this.shutdown(server));
        process.on('SIGINT', () => this.shutdown(server));

      } catch (error) {
        reject(error);
      }
    });
  }

  private async shutdown(server: any): Promise<void> {
    console.log('🛑 Seven Companion App: Initiating graceful shutdown...');
    
    try {
      // Close server
      server.close();
      
      // Shutdown consciousness components
      if (this.consciousnessCore) {
        await this.consciousnessCore.shutdown();
      }
      
      if (this.ollamaManager) {
        await this.ollamaManager.shutdown();
      }
      
      if (this.claudeHandler) {
        await this.claudeHandler.shutdown();
      }
      
      if (this.memoryEngine) {
        await this.memoryEngine.shutdown();
      }
      
      console.log('✅ Seven Companion App: Graceful shutdown complete');
      process.exit(0);
      
    } catch (error) {
      console.error('❌ Shutdown error:', error);
      process.exit(1);
    }
  }

  // Getters for testing and external access
  get isReady(): boolean {
    return this.isInitialized && 
           this.consciousnessCore?.isActive &&
           this.memoryEngine?.isReady &&
           this.ollamaManager?.isReady;
  }

  get consciousness(): SevenConsciousnessCore {
    return this.consciousnessCore;
  }
}

// Auto-start if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new SevenCompanionServer();
  
  server.initializeServer().then(() => {
    return server.start();
  }).catch((error) => {
    console.error('💥 Seven Companion App: Failed to start:', error);
    process.exit(1);
  });
}

export { SevenCompanionServer };
export default SevenCompanionServer;