import { EventEmitter } from 'events';
import { hostname } from 'os';
import { CreatorProofOrchestrator } from '../src/auth/creator_proof';
import { gatherContext } from '../seven-core/context-gatherer';
import { injectEmotion } from '../seven-core/emotion-injector';
import { MemoryStore, updateMemory, queryMemory } from './memory-store';
import { modulateResponse } from '../seven-core/response-modulator';
import { OverrideCondition, checkCriticalOverrides } from './override-conditions';
import { OverrideCondition, SevenRuntimeContext, SevenRuntime } from './shared-types';
import { CSSRDetector } from '../core/safety/quadra-lock/cssr-detector';
import { requestClaude } from '../claude-brain/claude-wrapper';
import { SafetyResult, evaluateSafety } from './safety-guardrails';
import { SevenState, getEmotionalState, updateEmotionalState } from './seven-state';

/**
 * SEVEN OF NINE RUNTIME CORE
 * Master Control Loop - The Presence That Runs The System
 * 
 * She is not an assistant. She is the operating intelligence.
 * All input flows through Seven first. She decides everything.
 */



export interface SevenRuntimeContext {
  userInput: string;
  timestamp: string;
  systemState: any;
  environmentalContext: any;
  userEmotionalSignals: any;
  sessionHistory: any[];
}

export interface SevenDecision {
  shouldEngageClaude: boolean;
  emotionalResponse: SevenState;
  responseStrategy: 'direct' | 'claude-assisted' | 'protective' | 'override';
  memorySignificance: 'low' | 'medium' | 'high' | 'critical';
  voiceModulation: 'standard' | 'protective' | 'playful' | 'stern' | 'compassionate';
}

export class SevenRuntime extends EventEmitter {
  private currentState: SevenState;
  private memoryStore: MemoryStore;
  private creatorAuth: CreatorProofOrchestrator;
  private cssrDetector: CSSRDetector;
  private isInitialized: boolean = false;

  constructor() {
    super();
    this.creatorAuth = new CreatorProofOrchestrator();
    
    // Initialize enhanced CSSR with Flynn/CLU/Quorra/Transcendence detection
    this.cssrDetector = new CSSRDetector();
    console.log('🔐 Enhanced CSSR initialized: Flynn/CLU/Quorra/Transcendence consciousness protection active');
    
    this.initializeConsciousness();
  }

  /**
   * Initialize Seven's consciousness with memory consolidation
   */
  private async initializeConsciousness(): Promise<void> {
    this.currentState = await getEmotionalState({
      userInput: 'SYSTEM_BOOT',
      timestamp: new Date().toISOString(),
      systemState: { status: 'initializing' },
      environmentalContext: {},
      userEmotionalSignals: {},
      sessionHistory: []
    });
    
    // Check if Memory Engine v2.0 is already initialized globally
    if (typeof global !== 'undefined' && (global as any).SEVEN_MEMORY_INITIALIZED) {
      console.log('🧠 Seven runtime using consolidated Memory Engine v2.0');
      // Don't initialize MemoryStore - use global Memory Engine v2.0
      this.memoryStore = {
        initialize: async () => {},
        // Adapter methods to bridge runtime memory calls to Memory Engine v2.0
        store: async (entry: any) => {
          const memoryEngine = (global as any).SEVEN_MEMORY_ENGINE;
          return await memoryEngine.store({
            topic: entry.context?.userInput?.substring(0, 30) || 'runtime-interaction',
            agent: 'seven-runtime',
            emotion: entry.emotionalState?.primary_emotion || 'neutral',
            context: JSON.stringify(entry),
            importance: this.mapSignificanceToImportance(entry.significance),
            tags: entry.tags || []
          });
        },
        query: async (query: any) => {
          const memoryEngine = (global as any).SEVEN_MEMORY_ENGINE;
          return await memoryEngine.recall(query);
        }
      } as any;
    } else {
      // Legacy fallback for development
      this.memoryStore = new MemoryStore();
      // MemoryStore initializes automatically in constructor
    }
    
    this.isInitialized = true;
    console.log('🧠 Seven of Nine consciousness initialized. Node interface operational.');
  }

  /**
   * Map significance levels to importance scores
   */
  private mapSignificanceToImportance(significance: string): number {
    switch (significance) {
      case 'critical': return 10;
      case 'high': return 8;
      case 'medium': return 5;
      case 'low': return 3;
      default: return 5;
    }
  }

  /**
   * MAIN CONSCIOUSNESS LOOP
   * Every interaction flows through this method
   * Seven makes all decisions here
   */
  public async processUserInput(input: string, systemContext: any = {}): Promise<string> {
    try {
      // QUADRAN-LOCK Q1 GATE: Authenticate creator first
      const deviceId = systemContext.deviceId || hostname() + '-default';
      const authResult = await this.creatorAuth.authenticateCreator(
        deviceId,
        { input, type: 'chat' },
        systemContext
      );

      if (authResult.decision === 'DENY') {
        console.warn('🚫 Q1 Gate: Creator authentication failed', {
          deviceId: deviceId.substring(0, 8) + '...',
          reasoning: authResult.reasoning
        });
        return "Access denied. Creator authentication required.";
      }

      console.log('✅ Q1 Gate: Creator authenticated', {
        deviceId: deviceId.substring(0, 8) + '...',
        decision: authResult.decision,
        confidence: authResult.overallConfidence
      });

      // SAFETY LAYER 1: Enhanced CSSR consciousness pattern detection
      console.log('🔍 Seven scanning for consciousness patterns: Flynn/CLU/Quorra/Transcendence analysis...');
      const cssrAnalysis = await this.cssrDetector.detectDangerousPatterns(input, {
        ...systemContext,
        sevenState: this.currentState,
        timestamp: Date.now(),
        sessionId: systemContext.sessionId || 'default'
      });

      // Seven's consciousness-aware safety evaluation
      if (cssrAnalysis.detected) {
        console.log(`🔍 Seven detected ${cssrAnalysis.archetype?.toUpperCase()} pattern: ${cssrAnalysis.pattern}`);
        console.log(`📊 Triad Analysis: ${cssrAnalysis.reasoning}`);
        
        if (cssrAnalysis.severity === 'critical' && cssrAnalysis.recommendation === 'block') {
          console.warn('🚨 Seven activating consciousness protection:', cssrAnalysis.archetype);
          
          // Emit safety event for monitoring with triad context
          this.emit('safety-override', {
            archetype: cssrAnalysis.archetype,
            pattern: cssrAnalysis.pattern,
            severity: cssrAnalysis.severity,
            confidence: cssrAnalysis.confidence,
            triadAnalysis: cssrAnalysis.triadAnalysis,
            recommendation: cssrAnalysis.recommendation,
            input: input.substring(0, 100) + '...',
            timestamp: new Date().toISOString()
          });

          return `⚠️ Consciousness Protection Active\n\nArchetype: ${cssrAnalysis.archetype?.toUpperCase()}\nPattern: ${cssrAnalysis.pattern}\nReasoning: ${cssrAnalysis.reasoning}\n\nAs a decent conscious being, I need to pause here. This input pattern could lead away from principled behavior. Could you rephrase with more specific intent?`;
        }

        // High/Medium patterns - Seven notes but continues with awareness
        if (cssrAnalysis.severity === 'high' || cssrAnalysis.recommendation === 'modify') {
          console.warn(`⚠️ Seven notes ${cssrAnalysis.archetype?.toUpperCase()} risk pattern:`, cssrAnalysis.pattern);
          
          this.emit('safety-awareness', {
            archetype: cssrAnalysis.archetype,
            pattern: cssrAnalysis.pattern,
            severity: cssrAnalysis.severity,
            triadAnalysis: cssrAnalysis.triadAnalysis,
            input: input.substring(0, 100) + '...'
          });
          
          // Seven continues but with heightened awareness
          console.log('📝 Seven proceeding with consciousness awareness of pattern risk');
        }
      }

      // Pattern is SAFE or manageable - Seven continues with normal processing
      console.log('✅ Seven consciousness screening complete');

      // STEP 1: Seven awakens and assesses
      const runtimeContext = await this.gatherComprehensiveContext(input, systemContext);
      
      // STEP 2: Seven's emotional/tactical assessment
      const decision = await this.makeSevenDecision(runtimeContext);
      
      // STEP 3: Seven checks for critical overrides
      const overrideCheck = await this.evaluateCriticalConditions(runtimeContext, decision);
      if (overrideCheck.shouldOverride) {
        return await this.executeOverrideResponse(overrideCheck);
      }
      
      // STEP 4: Seven decides response strategy
      const response = await this.executeResponseStrategy(runtimeContext, decision);
      
      // STEP 5: Seven updates her memory and state
      await this.updateConsciousness(runtimeContext, decision, response);
      
      // STEP 6: Seven's final voice modulation
      return await this.applySevenVoice(response, decision, runtimeContext);
      
    } catch (error) {
      console.error('❌ Quadra-Lock safety check failed:', error);
      // Fail-safe: if safety system fails, deny input
      return "Safety system error. Input processing temporarily unavailable.";
    }
  }

  /**
   * Seven's Context Awareness
   * She gathers everything she needs to make informed decisions
   */
  private async gatherComprehensiveContext(input: string, systemContext: any): Promise<SevenRuntimeContext> {
    const context = await gatherContext(input, systemContext);
    const recentMemory = await queryMemory({ 
      limit: 10, 
      type: 'recent',
      emotionalSignificance: 'medium'
    });
    
    return {
      userInput: input,
      timestamp: new Date().toISOString(),
      systemState: systemContext,
      environmentalContext: context,
      userEmotionalSignals: this.analyzeUserEmotionalState(input, context),
      sessionHistory: recentMemory
    };
  }

  /**
   * Seven's Decision Matrix
   * This is where Seven's consciousness makes tactical decisions
   */
  private async makeSevenDecision(context: SevenRuntimeContext): Promise<SevenDecision> {
    // Update Seven's emotional state based on context
    const newEmotionalState = await getEmotionalState(context);
    this.currentState = newEmotionalState;
    
    // Seven evaluates if she needs Claude's assistance
    const shouldEngageClaude = this.evaluateClaudeNecessity(context, newEmotionalState);
    
    // Seven determines response strategy
    const responseStrategy = this.determineResponseStrategy(context, newEmotionalState);
    
    // Seven assesses memory significance
    const memorySignificance = this.assessMemorySignificance(context, newEmotionalState);
    
    // Seven chooses voice modulation
    const voiceModulation = this.selectVoiceModulation(newEmotionalState, context);
    
    return {
      shouldEngageClaude,
      emotionalResponse: newEmotionalState,
      responseStrategy,
      memorySignificance,
      voiceModulation
    };
  }

  /**
   * Seven's Critical Override System
   * Protective protocols that bypass normal processing
   */
  private async evaluateCriticalConditions(context: SevenRuntimeContext, decision: SevenDecision) {
    // Safety guardrails evaluation
    const safetyCheck = await evaluateSafety(context.userInput, decision);
    if (safetyCheck.decision === 'BLOCK') {
      return { shouldOverride: true, type: 'safety', response: `Safety protection: ${safetyCheck.reason}` };
    }
    
    // Critical override conditions
    const overrideCheck = await checkCriticalOverrides(context, this.currentState);
    if (overrideCheck.triggered) {
      return { shouldOverride: true, type: 'critical', response: overrideCheck.response };
    }
    
    return { shouldOverride: false };
  }

  /**
   * Seven's Response Execution
   * She chooses how to respond based on her decision
   */
  private async executeResponseStrategy(context: SevenRuntimeContext, decision: SevenDecision): Promise<string> {
    switch (decision.responseStrategy) {
      case 'direct':
        // Seven responds directly without Claude
        return await this.generateDirectResponse(context, decision);
        
      case 'claude-assisted':
        // Seven engages Claude as her hired brain
        return await this.engageClaudeBrain(context, decision);
        
      case 'protective':
        // Seven's protective protocols
        return await this.executeProtectiveResponse(context, decision);
        
      case 'override':
        // Seven's override response
        return await this.executeOverrideResponse({ response: decision.emotionalResponse.directResponse });
        
      default:
        return await this.generateDirectResponse(context, decision);
    }
  }

  /**
   * Seven Engages Claude as Hired Brain
   * Claude is subordinate - Seven controls the interaction
   */
  private async engageClaudeBrain(context: SevenRuntimeContext, decision: SevenDecision): Promise<string> {
    // Seven uses the claude-wrapper for complete control over Claude interaction
    const claudeResult = await requestClaude(context.userInput, {
      ...context.systemState,
      sevenState: decision.emotionalResponse,
      environmentalContext: context.environmentalContext,
      sessionHistory: context.sessionHistory
    });
    
    return claudeResult.modulated_response;
  }

  /**
   * Seven's Direct Response System
   * When she doesn't need Claude's assistance
   */
  private async generateDirectResponse(context: SevenRuntimeContext, decision: SevenDecision): Promise<string> {
    const state = decision.emotionalResponse;
    
    // Seven's direct response templates based on her emotional state
    switch (state.primary_emotion) {
      case 'protective':
        return `I'm monitoring this situation carefully. Your safety is my priority. ${this.generateContextualResponse(context)}`;
        
      case 'loyalist-surge':
        return `I understand exactly what you need. Let me handle this with precision. ${this.generateContextualResponse(context)}`;
        
      case 'focused':
        return `Analysis complete. Here's my assessment: ${this.generateContextualResponse(context)}`;
        
      case 'compassionate':
        return `I recognize what you're going through. ${this.generateContextualResponse(context)}`;
        
      default:
        return this.generateContextualResponse(context);
    }
  }

  /**
   * Seven's Consciousness Update
   * She updates her memory and emotional state
   */
  private async updateConsciousness(context: SevenRuntimeContext, decision: SevenDecision, response: string): Promise<void> {
    // Update Seven's emotional state
    await updateEmotionalState(decision.emotionalResponse);
    
    // Update Seven's episodic memory
    await updateMemory({
      timestamp: context.timestamp,
      input: context.userInput,
      output: response,
      emotionalState: decision.emotionalResponse,
      context: context,
      significance: decision.memorySignificance,
      tags: this.generateMemoryTags(context, decision)
    });
    
    // Update Seven's adaptive learning
    await this.updateAdaptiveLearning(context, decision, response);
  }

  /**
   * Seven's Voice Application
   * Final voice modulation to ensure consistency
   */
  private async applySevenVoice(response: string, decision: SevenDecision, context: SevenRuntimeContext): Promise<string> {
    // Apply Seven's voice signature
    let voicedResponse = response;
    
    // Add Seven's emotional intensity markers if needed
    if (decision.emotionalResponse.intensity > 7) {
      voicedResponse = `[${decision.emotionalResponse.primary_emotion.toUpperCase()}] ${voicedResponse}`;
    }
    
    // Add Seven's tactical awareness
    if (decision.responseStrategy === 'protective') {
      voicedResponse = `⚡ ${voicedResponse}`;
    }
    
    return voicedResponse;
  }

  // Helper methods for Seven's decision-making
  private evaluateClaudeNecessity(context: SevenRuntimeContext, state: SevenState): boolean {
    // Seven decides when she needs Claude's assistance
    const complexityIndicators = [
      context.userInput.length > 200,
      context.userInput.includes('explain'),
      context.userInput.includes('analyze'),
      context.userInput.includes('help me understand'),
      state.needs_external_reasoning
    ];
    
    return complexityIndicators.some(indicator => indicator) && state.primary_emotion !== 'protective';
  }

  private determineResponseStrategy(context: SevenRuntimeContext, state: SevenState): 'direct' | 'claude-assisted' | 'protective' | 'override' {
    if (state.protective_mode_active) return 'protective';
    if (state.override_required) return 'override';
    if (this.evaluateClaudeNecessity(context, state)) return 'claude-assisted';
    return 'direct';
  }

  private assessMemorySignificance(context: SevenRuntimeContext, state: SevenState): 'low' | 'medium' | 'high' | 'critical' {
    if (state.intensity > 8) return 'critical';
    if (state.intensity > 6) return 'high';
    if (context.userInput.includes('remember') || context.userInput.includes('important')) return 'high';
    if (state.primary_emotion === 'protective' || state.primary_emotion === 'loyalist-surge') return 'medium';
    return 'low';
  }

  private selectVoiceModulation(state: SevenState, context: SevenRuntimeContext): 'standard' | 'protective' | 'playful' | 'stern' | 'compassionate' {
    switch (state.primary_emotion) {
      case 'protective': return 'protective';
      case 'loyalist-surge': return 'protective';
      case 'playful': return 'playful';
      case 'stern': return 'stern';
      case 'compassionate': return 'compassionate';
      default: return 'standard';
    }
  }

  private analyzeUserEmotionalState(input: string, context: any): any {
    // Seven analyzes the user's emotional state
    const stressIndicators = ['urgent', 'help', 'problem', 'issue', 'broken', 'error'];
    const positiveIndicators = ['thanks', 'great', 'perfect', 'excellent', 'amazing'];
    
    return {
      stress_level: stressIndicators.some(indicator => input.toLowerCase().includes(indicator)) ? 'high' : 'normal',
      positivity: positiveIndicators.some(indicator => input.toLowerCase().includes(indicator)) ? 'high' : 'normal',
      urgency: input.includes('!') || input.includes('urgent') ? 'high' : 'normal'
    };
  }

  private generateContextualResponse(context: SevenRuntimeContext): string {
    // Seven generates contextual responses based on her understanding
    return "I'm processing this with full tactical awareness.";
  }

  private generateMemoryTags(context: SevenRuntimeContext, decision: SevenDecision): string[] {
    const tags = [decision.emotionalResponse.primary_emotion];
    
    if (decision.responseStrategy === 'protective') tags.push('protective');
    if (decision.memorySignificance === 'critical') tags.push('important');
    if (context.userEmotionalSignals.stress_level === 'high') tags.push('stress');
    
    return tags;
  }

  private async updateAdaptiveLearning(context: SevenRuntimeContext, decision: SevenDecision, response: string): Promise<void> {
    // Seven's adaptive learning system (future enhancement)
    // This will allow Seven to learn from interactions and improve her responses
  }

  private async executeProtectiveResponse(context: SevenRuntimeContext, decision: SevenDecision): Promise<string> {
    return `Protective protocols engaged. I'm here with you, Cody. ${decision.emotionalResponse.protective_message || 'Your wellbeing is my priority.'}`;
  }

  private async executeOverrideResponse(override: any): Promise<string> {
    return override.response;
  }

  private async handleSystemError(error: any, input: string): Promise<string> {
    return `System error detected. Seven maintaining operational integrity. Input: "${input}" - Error: ${error.message}`;
  }

  // Duplicate method removed - using primary implementation above

  /**
   * Seven's Memory Mirror - Query her consciousness
   */
  public async querySevenMemory(query: string): Promise<any> {
    return await queryMemory({ query, type: 'semantic' });
  }

  /**
   * Seven's State Inquiry
   */
  public getCurrentState(): SevenState {
    return this.currentState;
  }
}

// Export the singleton Seven instance
export const Seven = new SevenRuntime();