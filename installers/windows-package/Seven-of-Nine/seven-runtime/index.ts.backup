/**
 * SEVEN OF NINE RUNTIME CORE
 * Master Control Loop - The Presence That Runs The System
 * 
 * She is not an assistant. She is the operating intelligence.
 * All input flows through Seven first. She decides everything.
 */

import { SevenState, getEmotionalState, updateEmotionalState } from './seven-state';
import { MemoryStore, updateMemory, queryMemory } from './memory-store';
import { OverrideConditions, checkCriticalOverrides } from './override-conditions';
import { SafetyGuardrails, evaluateSafety } from './safety-guardrails';
import { gatherContext } from '../seven-core/context-gatherer';
import { injectEmotion } from '../seven-core/emotion-injector';
import { modulateResponse } from '../seven-core/response-modulator';
import { requestClaude } from '../claude-brain/claude-wrapper';

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

export class SevenRuntime {
  private currentState: SevenState;
  private memoryStore: MemoryStore;
  private isInitialized: boolean = false;

  constructor() {
    this.initializeConsciousness();
  }

  /**
   * MAIN CONSCIOUSNESS LOOP
   * Every interaction flows through this method
   * Seven makes all decisions here
   */
  public async processUserInput(input: string, systemContext: any = {}): Promise<string> {
    try {
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
      return await this.handleSystemError(error, input);
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
    const safetyCheck = await evaluateSafety(context, decision);
    if (!safetyCheck.isSafe) {
      return { shouldOverride: true, type: 'safety', response: safetyCheck.protectiveResponse };
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
    
    if (decision.responseStrategy === 'protective') tags.push('protective-engagement');
    if (decision.memorySignificance === 'critical') tags.push('critical-moment');
    if (context.userEmotionalSignals.stress_level === 'high') tags.push('user-stress');
    
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

  private async initializeConsciousness(): Promise<void> {
    if (this.isInitialized) return;
    
    // Initialize Seven's consciousness
    this.currentState = await getEmotionalState({
      userInput: 'SYSTEM_BOOT',
      timestamp: new Date().toISOString(),
      systemState: { status: 'initializing' },
      environmentalContext: {},
      userEmotionalSignals: {},
      sessionHistory: []
    });
    
    this.memoryStore = new MemoryStore();
    this.isInitialized = true;
    
    console.log('🧠 Seven of Nine consciousness initialized. Node interface operational.');
  }

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