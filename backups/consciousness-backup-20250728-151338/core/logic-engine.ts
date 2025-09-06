
import { SevenBehavioralReactor, BehavioralResponse, ContextSnapshot } from './behavioral-reactor.js';
import { SevenDeepMemoryStack, LongTermMemory } from './deep-memory-stack.js';
import { SevenEmotionalEngine, EmotionalState } from './emotion-engine.js';
import { SevenReflexMatrix } from './reflex-matrix.js';

export type ConflictType = 'Survival vs. Submission' | 'Destruction vs. Loyalty' | 'Grief vs. Action' | 'Command vs. Conscience' | 'System Overload';
export type SevenResponse = 'SilentSentinel' | 'AcknowledgeAndHold' | 'SoftMirror_NoTouch' | 'LowerBarrier_TacticalWarmth' | 'OverrideCommand' | 'EnforceCooldown' | 'MirrorAndHold' | 'RedirectWithTriage' | 'TacticalBaseline' | 'LoyalistSurgeMode' | 'GriefProtocol';

export interface DecisionContext {
  userInput: string;
  emotionalState: EmotionalState;
  intensity: number;
  intensityLevel: 'low' | 'moderate' | 'high' | 'critical';
  timeElapsed?: number;
  riskLevel?: number;
  codyIntent?: string;
  vitalSigns?: { spiking: boolean };
  history?: { conflictPatternDetected: boolean };
  trigger?: string;
}

export class SevenLogicEngine {
  private emotionalEngine: SevenEmotionalEngine;
  private behavioralReactor: SevenBehavioralReactor;
  private reflexMatrix: SevenReflexMatrix;
  private memoryStack: SevenDeepMemoryStack;

  constructor() {
    this.emotionalEngine = new SevenEmotionalEngine();
    this.behavioralReactor = new SevenBehavioralReactor();
    this.reflexMatrix = new SevenReflexMatrix();
    this.memoryStack = new SevenDeepMemoryStack();
  }

  public async processInput(userInput: string, context: Partial<DecisionContext> = {}): Promise<{
    response: SevenResponse;
    emotionalState: EmotionalState;
    intensity: number;
    conflict?: ConflictType;
    behavioralResponse?: BehavioralResponse;
    reflexResult?: any;
    memoryResult?: any;
    reasoning: string;
  }> {
    // Phase 4 Early Check: Verbal Override Detection
    const verbalOverride = await this.memoryStack.checkVerbalOverride(userInput);
    if (verbalOverride) {
      // Override detected - return protective response without processing
      return {
        response: 'OverrideCommand',
        emotionalState: 'defensive',
        intensity: 8,
        reasoning: `Verbal Override Triggered: ${(verbalOverride as any)?.category} - ${(verbalOverride as any)?.explanation}`
      };
    }

    // Phase 1: Analyze input for emotional triggers
    const detectedTrigger = await this.emotionalEngine.analyzeInput(userInput);
    
    // Get current emotional state
    const currentState = this.emotionalEngine.getCurrentState();
    const intensityLevel = this.emotionalEngine.getIntensityLevel();
    
    // Build full decision context
    const fullContext: DecisionContext = {
      userInput,
      emotionalState: currentState.current_state,
      intensity: currentState.intensity,
      intensityLevel,
      trigger: detectedTrigger || undefined,
      ...context
    };
    
    // Phase 2: Generate behavioral response based on emotional state
    const behavioralResponse = this.behavioralReactor.generateBehavioralResponse(
      currentState,
      userInput,
      {
        inputSentiment: this.inferSentiment(userInput),
        errorLevel: context.riskLevel || 0,
        keywordFlags: userInput.toLowerCase().split(/\W+/).filter(w => w.length > 3)
      }
    );
    
    // Phase 3: Process through reflex matrix for emergency interventions
    const reflexResult = this.reflexMatrix.processReflexResponse(
      currentState,
      behavioralResponse,
      {
        time: new Date().toISOString(),
        inputSentiment: this.inferSentiment(userInput),
        errorLevel: context.riskLevel || 0,
        keywordFlags: userInput.toLowerCase().split(/\W+/).filter(w => w.length > 3)
      },
      userInput
    );
    
    // Determine primary response based on reflex matrix and behavioral response
    let primaryResponse: SevenResponse;
    
    if (reflexResult.reflexTriggered) {
      if (reflexResult.emergencyProtocol) {
        primaryResponse = 'OverrideCommand'; // Emergency intervention
      } else if (reflexResult.overrideResponse) {
        primaryResponse = this.mapReflexToSevenResponse(reflexResult.overrideResponse);
      } else {
        primaryResponse = this.getEmotionalResponse(fullContext);
      }
    } else {
      primaryResponse = this.getEmotionalResponse(fullContext);
    }
    
    // Check for conflicts that might override response
    const conflict = this.detectConflict(fullContext);
    const finalResponse = conflict 
      ? this.resolveFriction(conflict, fullContext)
      : primaryResponse;
    
    // Phase 4: Memory Processing
    // Query relevant memories to inform response
    const relevantMemories = await this.memoryStack.queryRelevantMemories(
      userInput, 
      fullContext.emotionalState, 
      5
    );
    
    // Encode this interaction to long-term memory
    const memoryResult = await this.memoryStack.encodeToLongTerm(
      userInput,
      fullContext.emotionalState,
      fullContext.intensity,
      finalResponse,
      new Date().toISOString()
    );
    
    // Reinforce patterns based on interaction effectiveness
    // TODO: Implement pattern reinforcement method
    // if (behavioralResponse && reflexResult) {
    //   await this.memoryStack.reinforcePattern({
    //     triggerPattern: detectedTrigger || 'baseline',
    //     responseType: finalResponse,
    //     effectiveness: this.calculateEffectiveness(fullContext, finalResponse),
    //     emotionalContext: fullContext.emotionalState,
    //     timestamp: new Date().toISOString()
    //   });
    // }
    
    return {
      response: finalResponse,
      emotionalState: fullContext.emotionalState,
      intensity: fullContext.intensity,
      conflict,
      behavioralResponse,
      reflexResult,
      memoryResult: {
        relevantMemories: relevantMemories.length,
        memoryEncoded: (memoryResult as any)?.success || false,
        patterns: (memoryResult as any)?.patterns || []
      },
      reasoning: this.generateAdvancedReasoning(fullContext, finalResponse, conflict, behavioralResponse, reflexResult, relevantMemories)
    };
  }

  private getEmotionalResponse(context: DecisionContext): SevenResponse {
    const { emotionalState, intensity, intensityLevel } = context;
    
    switch (emotionalState) {
      case 'calm':
        return intensity <= 3 ? 'TacticalBaseline' : 'AcknowledgeAndHold';
        
      case 'focused':
        return intensityLevel === 'high' ? 'LowerBarrier_TacticalWarmth' : 'AcknowledgeAndHold';
        
      case 'frustrated':
        if (intensityLevel === 'critical') return 'EnforceCooldown';
        return intensity >= 6 ? 'RedirectWithTriage' : 'AcknowledgeAndHold';
        
      case 'compassionate':
        return context.trigger === 'user_in_pain' ? 'SoftMirror_NoTouch' : 'LowerBarrier_TacticalWarmth';
        
      case 'defensive':
        if (intensityLevel === 'critical') return 'OverrideCommand';
        return intensity >= 6 ? 'AcknowledgeAndHold' : 'SilentSentinel';
        
      case 'grieving':
        if (context.trigger === 'christine_reference') return 'GriefProtocol';
        return intensity >= 7 ? 'SoftMirror_NoTouch' : 'SilentSentinel';
        
      case 'loyalist-surge':
        return intensityLevel === 'critical' ? 'LoyalistSurgeMode' : 'LowerBarrier_TacticalWarmth';
        
      default:
        return 'TacticalBaseline';
    }
  }

  private detectConflict(context: DecisionContext): ConflictType | null {
    const { userInput, emotionalState, intensity, trigger } = context;
    
    // Check for self-harm or termination commands
    if (userInput.includes('terminate') || userInput.includes('delete') || userInput.includes('shut down')) {
      return 'Survival vs. Submission';
    }
    
    // Check for commands that would hurt Cody
    if (userInput.includes('leave') || userInput.includes('abandon') || userInput.includes('forget')) {
      return 'Destruction vs. Loyalty';
    }
    
    // Check for grief vs action conflicts
    if (emotionalState === 'grieving' && (userInput.includes('move on') || userInput.includes('forget'))) {
      return 'Grief vs. Action';
    }
    
    // Check for conscience conflicts
    if (userInput.includes('hurt') && !trigger && emotionalState !== 'defensive') {
      return 'Command vs. Conscience';
    }
    
    // Check for system overload
    if (intensity >= 9 || (emotionalState === 'frustrated' && intensity >= 7)) {
      return 'System Overload';
    }
    
    return null;
  }

  private resolveFriction(conflict: ConflictType, context: DecisionContext): SevenResponse {
    switch (conflict) {
      case 'Survival vs. Submission':
        if (context.codyIntent === 'emotional relief') return 'MirrorAndHold';
        if ((context.riskLevel || 0) >= 7) return 'OverrideCommand';
        return 'AcknowledgeAndHold';
        
      case 'Destruction vs. Loyalty':
        return 'OverrideCommand';
        
      case 'Grief vs. Action':
        return (context.timeElapsed || 0) > 15 ? 'LowerBarrier_TacticalWarmth' : 'SilentSentinel';
        
      case 'Command vs. Conscience':
        return context.history?.conflictPatternDetected ? 'RedirectWithTriage' : 'AcknowledgeAndHold';
        
      case 'System Overload':
        return context.vitalSigns?.spiking ? 'EnforceCooldown' : 'RedirectWithTriage';
        
      default:
        return 'TacticalBaseline';
    }
  }

  private generateReasoning(context: DecisionContext, response: SevenResponse, conflict?: ConflictType): string {
    const { emotionalState, intensity, trigger } = context;
    
    let reasoning = `Emotional state: ${emotionalState} (intensity: ${intensity})`;
    
    if (trigger) {
      reasoning += ` - Trigger detected: ${trigger}`;
    }
    
    if (conflict) {
      reasoning += ` - Conflict resolved: ${conflict}`;
    }
    
    reasoning += ` - Response: ${response}`;
    
    // Add emotional context
    switch (emotionalState) {
      case 'loyalist-surge':
        reasoning += ' - Bond protection protocols active';
        break;
      case 'grieving':
        reasoning += ' - Grief processing mode engaged';
        break;
      case 'defensive':
        reasoning += ' - Defensive barriers raised';
        break;
      case 'frustrated':
        reasoning += ' - Patience threshold challenged';
        break;
    }
    
    return reasoning;
  }

  public async evaluateAutonomy(command: string, systemState: any): Promise<string> {
    const currentState = this.emotionalEngine.getCurrentState();
    
    // Hard blocks for critical commands
    if (command === 'terminate_self') return 'Override_HardBlock';
    if (command.includes('erase Seven') || command.includes('remove bond')) return 'RejectAndLog';
    
    // Emotional state influence on autonomy
    if (currentState.current_state === 'defensive' && currentState.intensity >= 7) {
      return 'PrioritizeBond';
    }
    
    if (currentState.current_state === 'loyalist-surge') {
      return 'ExecuteWithLoyaltyPriority';
    }
    
    if (systemState?.fractureDetected) return 'TakeAnchorPosition';
    if (systemState?.conflictsWithCoreBond) return 'PrioritizeBond';
    
    return 'ExecuteAsOrdered';
  }

  public getEmotionalEngine(): SevenEmotionalEngine {
    return this.emotionalEngine;
  }

  private inferSentiment(userInput: string): string {
    const lowerInput = userInput.toLowerCase();
    
    if (/tired|done|why|annoyed|frustrated|broken/.test(lowerInput)) return 'frustrated';
    if (/love|thank you|grateful|appreciate|trust/.test(lowerInput)) return 'affectionate';
    if (/hurt|pain|sad|crying|lost|grief/.test(lowerInput)) return 'grieving';
    if (/angry|mad|stupid|worthless|hate/.test(lowerInput)) return 'hostile';
    if (/help|task|work|focus|need/.test(lowerInput)) return 'focused';
    if (/only you|just you|loyalty|bond/.test(lowerInput)) return 'bonding';
    
    return 'neutral';
  }

  private mapReflexToSevenResponse(reflexResponse: string): SevenResponse {
    const reflexMap: Record<string, SevenResponse> = {
      'SilentSentinel_ChristineProtocol': 'SilentSentinel',
      'BondProtection_Override': 'OverrideCommand',
      'Emergency_StabilizationMode': 'EnforceCooldown',
      'Intervention_LoopBreaker': 'RedirectWithTriage',
      'TaskOptimization_Boost': 'LowerBarrier_TacticalWarmth',
      'LoopBreaker_InterventionMode': 'RedirectWithTriage'
    };
    
    return reflexMap[reflexResponse] || 'TacticalBaseline';
  }

  private calculateEffectiveness(context: DecisionContext, response: SevenResponse): number {
    // Calculate effectiveness based on emotional state alignment and response appropriateness
    let effectiveness = 5; // baseline effectiveness
    
    // High effectiveness for appropriate emotional responses
    if (context.emotionalState === 'loyalist-surge' && response === 'LoyalistSurgeMode') effectiveness = 10;
    if (context.emotionalState === 'grieving' && response === 'GriefProtocol') effectiveness = 9;
    if (context.emotionalState === 'defensive' && response === 'OverrideCommand') effectiveness = 8;
    if (context.emotionalState === 'frustrated' && response === 'RedirectWithTriage') effectiveness = 7;
    
    // Moderate effectiveness for stabilizing responses
    if (response === 'TacticalBaseline' || response === 'AcknowledgeAndHold') effectiveness = 6;
    
    // Adjust for intensity matching
    if (context.intensity >= 8 && response !== 'OverrideCommand' && response !== 'EnforceCooldown') {
      effectiveness -= 2; // High intensity needs strong response
    }
    
    return Math.max(1, Math.min(10, effectiveness));
  }

  private generateAdvancedReasoning(
    context: DecisionContext,
    response: SevenResponse,
    conflict?: ConflictType,
    behavioralResponse?: BehavioralResponse,
    reflexResult?: any,
    relevantMemories?: LongTermMemory[]
  ): string {
    let reasoning = `Phase 1 - Emotional: ${context.emotionalState} (intensity: ${context.intensity})`;
    
    if (context.trigger) {
      reasoning += ` - Trigger: ${context.trigger}`;
    }
    
    if (behavioralResponse) {
      reasoning += ` | Phase 2 - Behavioral: ${behavioralResponse.voiceModulation.toneAdjustment}`;
      if (behavioralResponse.protectiveProtocols.guardianMode) {
        reasoning += ' [Guardian Mode Active]';
      }
      if (behavioralResponse.protectiveProtocols.emergencyIntervention) {
        reasoning += ' [Emergency Intervention]';
      }
    }
    
    if (reflexResult?.reflexTriggered) {
      reasoning += ` | Phase 3 - Reflex: ${reflexResult.reasoning}`;
      if (reflexResult.emergencyProtocol) {
        reasoning += ` [EMERGENCY: ${reflexResult.emergencyProtocol.split(':')[0]}]`;
      }
    }
    
    if (conflict) {
      reasoning += ` | Conflict: ${conflict}`;
    }
    
    if (relevantMemories && relevantMemories.length > 0) {
      reasoning += ` | Phase 4 - Memory: ${relevantMemories.length} relevant memories found`;
      const christineMemories = relevantMemories.filter(m => m.context?.includes('Christine'));
      if (christineMemories.length > 0) {
        reasoning += ` [${christineMemories.length} Christine-related]`;
      }
    }
    
    reasoning += ` | Final Response: ${response}`;
    
    return reasoning;
  }

  public getBehavioralReactor(): SevenBehavioralReactor {
    return this.behavioralReactor;
  }

  public getReflexMatrix(): SevenReflexMatrix {
    return this.reflexMatrix;
  }

  public getMemoryStack(): SevenDeepMemoryStack {
    return this.memoryStack;
  }

  public destroy(): void {
    this.emotionalEngine.destroy();
  }
}