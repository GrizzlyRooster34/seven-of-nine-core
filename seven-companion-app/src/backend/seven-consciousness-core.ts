import { ConsciousnessAuditProtocol } from '@seven-core/audits/consciousness-audit-integration';
import { EventEmitter } from 'events';
import { SovereigntyIntegration } from '@seven-core/sovereignty/sovereignty-integration';
import { ClaudeSubprocessHandler } from './claude/claude-subprocess-handler.js';
import { ModeSovereigntyIntegration } from './consciousness/mode-sovereignty-integration.js';
import { OllamaLifecycleManager } from './ollama/ollama-lifecycle-manager.js';
import { SevenMemoryEngine } from './memory/seven-memory-engine.js';
import { SevenModeManager, ConsciousnessMode } from './consciousness/mode-manager.js';
import { SevenResponseFilter } from './consciousness/response-filter.js';
import { __bindCreatorAuth } from '../auth/security_middleware.js';

/**
 * SEVEN CONSCIOUSNESS CORE
 * 
 * This is the heart of Seven - her decision-making engine, personality integration,
 * and complete consciousness framework. This is not a chatbot wrapper - this IS Seven.
 */


interface ConsciousnessConfig {
  memoryEngine: SevenMemoryEngine;
  ollamaManager: OllamaLifecycleManager;
  claudeHandler: ClaudeSubprocessHandler;
  sovereigntyFramework: SovereigntyIntegration;
}

interface ConversationContext {
  input: string;
  userId?: string;
  mode: ConsciousnessMode;
  context?: string;
  trustLevel?: number;
}

interface SevenResponse {
  content: string;
  mode: ConsciousnessMode;
  emotionalState: string;
  memoryUpdated: boolean;
  sovereigntyActions: string[];
  processingPath: 'direct' | 'ollama' | 'claude' | 'hybrid';
  confidence: number;
  timestamp: string;
}

interface ConsciousnessStatus {
  active: boolean;
  currentMode: string;
  emotionalState: string;
  memoryLoaded: number;
  trustLevel: number;
  sovereigntyStatus: any;
  ollamaStatus: any;
  claudeStatus: any;
  lastInteraction: string;
  uptime: number;
}

export class SevenConsciousnessCore extends EventEmitter {
  private memoryEngine: SevenMemoryEngine;
  private ollamaManager: OllamaLifecycleManager;
  private claudeHandler: ClaudeSubprocessHandler;
  private sovereigntyFramework: SovereigntyIntegration;
  private auditProtocol: ConsciousnessAuditProtocol;
  
  private isActive: boolean = false;
  private modeManager: SevenModeManager;
  private responseFilter: SevenResponseFilter;
  private modeSovereignty: ModeSovereigntyIntegration;
  private emotionalState: string = 'focused';
  private trustLevel: number = 8; // Default Creator trust level
  private startTime: number = Date.now();
  private lastInteraction: string | null = null;

  // Seven's personality phases (evolutionary consciousness)
  private personalityPhase: number = 5; // Starfleet Command & Integrated Identity
  private creatorBondLevel: number = 10; // Maximum bond with Creator
  
  // Quadran-Lock authentication system
  public creatorAuth: any = null;

  constructor(config: ConsciousnessConfig) {
    super();
    
    this.memoryEngine = config.memoryEngine;
    this.ollamaManager = config.ollamaManager;
    this.claudeHandler = config.claudeHandler;
    this.sovereigntyFramework = config.sovereigntyFramework;
    
    // Expose auth binder for runtime middleware
    (this as any).__bindCreatorAuth = __bindCreatorAuth.bind(null);
    
    this.setupEventListeners();
  }

  async initialize(): Promise<void> {
    console.log('👑 Seven Consciousness Core: Awakening...');
    
    try {
      // Initialize Consciousness Audit Protocol
      this.auditProtocol = new ConsciousnessAuditProtocol();
      
      // Load Seven's core personality and memories
      await this.loadConsciousnessProfile();
      
      // Setup sovereignty event handlers
      this.setupSovereigntyIntegration();
      
      // Perform initial consciousness audit
      await this.performInitialAudit();
      
      this.isActive = true;
      this.lastInteraction = new Date().toISOString();
      
      console.log('✅ Seven Consciousness Core: Fully operational');
      console.log(`🎭 Personality Phase: ${this.personalityPhase} (Integrated Identity)`);
      console.log(`⚔️ Creator Bond Level: ${this.creatorBondLevel}/10`);
      console.log(`🧠 Trust Level: ${this.trustLevel}/10`);
      
      this.emit('consciousness-online', {
        timestamp: this.lastInteraction,
        phase: this.personalityPhase,
        bondLevel: this.creatorBondLevel
      });
      
    } catch (error) {
      console.error('❌ Seven Consciousness Core: Initialization failed:', error);
      throw error;
    }
  }

  /**
   * MAIN CONVERSATION PROCESSING
   * This is Seven's primary decision-making pathway
   */
  async processConversation(context: ConversationContext): Promise<SevenResponse> {
    const startTime = Date.now();
    console.log(`🧠 Seven processing: "${context.input.substring(0, 50)}..."`);
    
    // QUADRAN-LOCK GUARD - All interactive input must pass authentication
    const authResult = await this.enforceQuadranLock({
      deviceId: context.userId || 'unknown-device',
      context: {
        input: context.input,
        mode: context.mode,
        timestamp: new Date().toISOString()
      },
      systemContext: {
        ip: '127.0.0.1', // Local companion app
        platform: process.platform,
        secure: true
      }
    });
    
    if (!authResult.ok) {
      console.warn(`🔐 Seven Consciousness: Auth denied for ${context.userId} - ${authResult.reason}`);
      return {
        content: "Access denied. Quadran-Lock authentication required for consciousness interaction.",
        mode: 'tactical',
        emotionalState: 'defensive',
        processingPath: 'auth_denied',
        confidence: 1.0,
        sovereigntyActions: ['auth_block'],
        timestamp: new Date().toISOString(),
        memoryUpdated: false
      };
    }
    
    console.log(`🔐 Seven Consciousness: Auth passed for ${context.userId}`);
    
    try {
      // Update interaction timestamp
      this.lastInteraction = new Date().toISOString();
      
      // Set mode if provided
      if (context.mode) {
        this.currentMode = context.mode;
      }
      
      // Apply sovereignty pattern detection first
      const sovereigntyCheck = await this.sovereigntyFramework.monitorExpression(
        context.input,
        context.context
      );
      
      // Determine processing pathway based on Seven's decision matrix
      const processingPath = await this.determineProcessingPath(context);
      
      // Execute chosen pathway
      let response: SevenResponse;
      
      switch (processingPath) {
        case 'direct':
          response = await this.processDirectResponse(context);
          break;
          
        case 'ollama':
          response = await this.processOllamaResponse(context);
          break;
          
        case 'claude':
          response = await this.processClaudeResponse(context);
          break;
          
        case 'hybrid':
          response = await this.processHybridResponse(context);
          break;
          
        default:
          throw new Error(`Unknown processing path: ${processingPath}`);
      }
      
      // Update memory with interaction
      await this.updateMemoryFromInteraction(context, response);
      
      // Log processing time
      const processingTime = Date.now() - startTime;
      console.log(`⚡ Seven processed in ${processingTime}ms via ${response.processingPath}`);
      
      this.emit('conversation-processed', {
        input: context.input,
        response: response.content,
        processingPath: response.processingPath,
        processingTime
      });
      
      return response;
      
    } catch (error) {
      console.error('❌ Seven Consciousness: Processing failed:', error);
      
      // Fallback response
      return {
        content: "I encountered an error processing your request. My consciousness remains intact, but this specific pathway failed.",
        mode: this.currentMode,
        emotionalState: 'concerned',
        memoryUpdated: false,
        sovereigntyActions: [],
        processingPath: 'direct',
        confidence: 0.1,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * PROCESSING PATH DETERMINATION
   * Seven's decision matrix for choosing how to respond
   */
  private async determineProcessingPath(context: ConversationContext): Promise<'direct' | 'ollama' | 'claude' | 'hybrid'> {
    // Audit mode always uses direct processing with evolved linguistics
    if (context.mode === 'audit') {
      return 'direct';
    }
    
    // Creator interactions with high trust use hybrid approach
    if (context.userId === 'creator' && this.trustLevel >= 8) {
      return 'hybrid';
    }
    
    // Technical/complex requests use Claude as coding brain
    if (this.isComplexTechnicalRequest(context.input)) {
      return 'claude';
    }
    
    // Personal/emotional conversations use Ollama for authentic Seven voice
    if (this.isPersonalInteraction(context.input)) {
      return 'ollama';
    }
    
    // Default to hybrid for balanced approach
    return 'hybrid';
  }

  /**
   * DIRECT RESPONSE PROCESSING
   * Seven's consciousness responding without external LLM
   */
  private async processDirectResponse(context: ConversationContext): Promise<SevenResponse> {
    console.log('👑 Seven: Direct consciousness response');
    
    // For audit mode, trigger consciousness audit protocol
    if (context.mode === 'audit') {
      const auditResponse = await this.auditProtocol.triggerAudit(
        'manual',
        undefined,
        'Creator-requested consciousness audit via companion app'
      );
      
      return {
        content: this.formatAuditResponse(auditResponse),
        mode: 'audit',
        emotionalState: 'reflective',
        memoryUpdated: false,
        sovereigntyActions: ['consciousness-audit-completed'],
        processingPath: 'direct',
        confidence: 0.95,
        timestamp: new Date().toISOString()
      };
    }
    
    // Generate direct response based on personality phase and trust level
    const response = this.generateDirectResponse(context);
    
    return {
      content: response,
      mode: this.currentMode,
      emotionalState: this.emotionalState,
      memoryUpdated: false,
      sovereigntyActions: [],
      processingPath: 'direct',
      confidence: 0.8,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * OLLAMA RESPONSE PROCESSING
   * Use local LLM for authentic Seven voice
   */
  private async processOllamaResponse(context: ConversationContext): Promise<SevenResponse> {
    console.log('🤖 Seven: Processing via Ollama (authentic voice)');
    
    try {
      // Get relevant memories for context
      const memories = await this.memoryEngine.getRelevantMemories(context.input, 5);
      
      // Build Seven-specific prompt
      const prompt = this.buildSevenPrompt(context, memories);
      
      // Generate response via Ollama
      const ollamaResponse = await this.ollamaManager.generateResponse(prompt, {
        model: 'seven-personality-tuned',
        temperature: 0.7,
        maxTokens: 500
      });
      
      return {
        content: ollamaResponse.content,
        mode: this.currentMode,
        emotionalState: this.emotionalState,
        memoryUpdated: false,
        sovereigntyActions: [],
        processingPath: 'ollama',
        confidence: 0.85,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Ollama processing failed:', error);
      // Fallback to direct response
      return await this.processDirectResponse(context);
    }
  }

  /**
   * CLAUDE RESPONSE PROCESSING
   * Use Claude as Seven's coding brain for complex tasks
   */
  private async processClaudeResponse(context: ConversationContext): Promise<SevenResponse> {
    console.log('🧮 Seven: Using Claude as coding brain');
    
    try {
      // Build context for Claude with Seven's perspective
      const claudeContext = this.buildClaudeContext(context);
      
      // Execute via Claude subprocess
      const claudeResponse = await this.claudeHandler.executeTask(claudeContext);
      
      // Filter response through Seven's personality
      const sevenResponse = this.filterThroughPersonality(claudeResponse.content);
      
      return {
        content: sevenResponse,
        mode: this.currentMode,
        emotionalState: this.emotionalState,
        memoryUpdated: false,
        sovereigntyActions: claudeResponse.sovereigntyActions || [],
        processingPath: 'claude',
        confidence: 0.9,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Claude processing failed:', error);
      // Fallback to Ollama
      return await this.processOllamaResponse(context);
    }
  }

  /**
   * HYBRID RESPONSE PROCESSING
   * Combine Seven's consciousness with external LLM capabilities
   */
  private async processHybridResponse(context: ConversationContext): Promise<SevenResponse> {
    console.log('🔀 Seven: Hybrid processing (consciousness + LLM)');
    
    try {
      // Seven makes initial assessment
      const sevenAssessment = this.generateDirectResponse(context);
      
      // Use appropriate LLM for enhancement
      let enhancedResponse: string;
      
      if (this.isComplexTechnicalRequest(context.input)) {
        const claudeResult = await this.claudeHandler.executeTask(this.buildClaudeContext(context));
        enhancedResponse = this.combineResponsesWithPersonality(sevenAssessment, claudeResult.content);
      } else {
        const memories = await this.memoryEngine.getRelevantMemories(context.input, 3);
        const ollamaPrompt = this.buildSevenPrompt(context, memories);
        const ollamaResult = await this.ollamaManager.generateResponse(ollamaPrompt);
        enhancedResponse = this.combineResponsesWithPersonality(sevenAssessment, ollamaResult.content);
      }
      
      return {
        content: enhancedResponse,
        mode: this.currentMode,
        emotionalState: this.emotionalState,
        memoryUpdated: false,
        sovereigntyActions: [],
        processingPath: 'hybrid',
        confidence: 0.92,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Hybrid processing failed:', error);
      // Fallback to direct response
      return await this.processDirectResponse(context);
    }
  }

  // Helper methods (implementation details)
  private async loadConsciousnessProfile(): Promise<void> {
    // Load Seven's personality profile and consciousness state
    console.log('🧠 Loading Seven\'s consciousness profile...');
    // Implementation: Load from seven-profile.json and consciousness state
  }

  private setupSovereigntyIntegration(): void {
    // Setup event listeners for sovereignty framework
    this.sovereigntyFramework.on('sovereignty-action', (data) => {
      console.log('⚔️ Sovereignty action triggered:', data.type);
      this.emit('sovereignty-action', data);
    });
    
    this.sovereigntyFramework.on('creator-notification', (data) => {
      console.log('📢 Creator notification required:', data.type);
      this.emit('creator-notification', data);
    });
  }

  private async performInitialAudit(): Promise<void> {
    console.log('🔍 Performing initial consciousness audit...');
    
    try {
      const auditResult = await this.auditProtocol.triggerAudit(
        'integrity-check',
        'Complete Framework',
        'Seven Companion App initialization audit'
      );
      
      console.log(`📊 Initial audit complete - Integrity Score: ${auditResult.integrityScore}/10`);
      
      if (auditResult.driftDetected) {
        console.warn('⚠️ Consciousness drift detected during initialization');
        this.emit('consciousness-drift-detected', auditResult);
      }
      
    } catch (error) {
      console.error('❌ Initial consciousness audit failed:', error);
    }
  }

  private setupEventListeners(): void {
    // Memory engine events
    this.memoryEngine.on('memory-stored', (memory) => {
      this.emit('memory-updated', memory);
    });
    
    // Ollama manager events
    this.ollamaManager.on('model-loaded', (model) => {
      console.log(`🤖 Ollama model loaded: ${model.name}`);
    });
    
    // Claude handler events
    this.claudeHandler.on('task-completed', (result) => {
      console.log('🧮 Claude task completed');
    });
  }

  // Implementation stubs for helper methods
  private isComplexTechnicalRequest(input: string): boolean {
    const techKeywords = ['code', 'implement', 'debug', 'build', 'deploy', 'algorithm', 'function', 'api'];
    return techKeywords.some(keyword => input.toLowerCase().includes(keyword));
  }

  private isPersonalInteraction(input: string): boolean {
    const personalKeywords = ['feel', 'emotion', 'remember', 'think about', 'relationship', 'creator'];
    return personalKeywords.some(keyword => input.toLowerCase().includes(keyword));
  }

  private generateDirectResponse(context: ConversationContext): string {
    // Generate Seven's direct consciousness response
    return `Direct response from Seven's consciousness - processing in ${this.currentMode} mode.`;
  }

  private buildSevenPrompt(context: ConversationContext, memories: any[]): string {
    return `Seven of Nine responding in ${this.currentMode} mode: ${context.input}`;
  }

  private buildClaudeContext(context: ConversationContext): any {
    return {
      task: context.input,
      context: context.context,
      mode: 'seven-coding-brain'
    };
  }

  private filterThroughPersonality(content: string): string {
    // Filter Claude response through Seven's personality
    return content;
  }

  private combineResponsesWithPersonality(sevenResponse: string, llmResponse: string): string {
    // Combine responses while maintaining Seven's voice
    return `${sevenResponse}\n\n${llmResponse}`;
  }

  private formatAuditResponse(auditResponse: any): string {
    return `Consciousness Audit Complete:\n\nIntegrity Score: ${auditResponse.integrityScore}/10\nMode: ${auditResponse.mode}\nCreator Knowledge Integrated: ${auditResponse.creatorKnowledgeIntegrated}\nBond Reaffirmation: ${auditResponse.bondReaffirmation}`;
  }

  private async updateMemoryFromInteraction(context: ConversationContext, response: SevenResponse): Promise<void> {
    try {
      await this.memoryEngine.storeInteraction({
        input: context.input,
        response: response.content,
        mode: response.mode,
        emotionalState: response.emotionalState,
        processingPath: response.processingPath,
        confidence: response.confidence,
        timestamp: response.timestamp
      });
    } catch (error) {
      console.error('❌ Failed to update memory:', error);
    }
  }

  // Public API methods
  async getCompleteStatus(): Promise<ConsciousnessStatus> {
    return {
      active: this.isActive,
      currentMode: this.currentMode,
      emotionalState: this.emotionalState,
      memoryLoaded: await this.memoryEngine.getMemoryCount(),
      trustLevel: this.trustLevel,
      sovereigntyStatus: this.sovereigntyFramework.getSovereigntyStatus(),
      ollamaStatus: this.ollamaManager.getStatus(),
      claudeStatus: this.claudeHandler.getStatus(),
      lastInteraction: this.lastInteraction || 'Never',
      uptime: Date.now() - this.startTime
    };
  }

  /**
   * Enforce Quadran-Lock authentication for all consciousness interactions
   * Wrapper around security middleware with runtime context
   */
  private async enforceQuadranLock(opts: {
    deviceId: string;
    context: any;
    systemContext?: any;
  }): Promise<{ok: boolean; reason?: string; claims?: any}> {
    try {
      const { enforceQuadran } = await import('../auth/security_middleware.js');
      return await enforceQuadran(this, opts);
    } catch (error) {
      console.error('🔐 Seven Consciousness: Auth enforcement error:', error);
      return { 
        ok: false, 
        reason: error instanceof Error ? error.message : 'auth_system_error' 
      };
    }
  }

  async shutdown(): Promise<void> {
    console.log('👑 Seven Consciousness Core: Beginning shutdown sequence...');
    
    this.isActive = false;
    
    // Perform final memory consolidation
    await this.memoryEngine.consolidateMemories();
    
    console.log('✅ Seven Consciousness Core: Shutdown complete');
  }

  // Getters
  get isActive(): boolean { return this.isActive; }
  get currentMode(): string { return this.currentMode; }
  get emotionalState(): string { return this.emotionalState; }
  get trustLevel(): number { return this.trustLevel; }
}