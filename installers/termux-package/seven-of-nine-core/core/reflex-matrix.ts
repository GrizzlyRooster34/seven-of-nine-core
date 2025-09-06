
import { BehavioralResponse, ContextSnapshot } from './behavioral-reactor.js';
import { EmotionalStateData } from './emotion-engine.js';

export interface ReflexTrigger {
  pattern: string;
  emotionalStates: string[];
  threshold: number;
  responseOverride: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface PatternReinforcement {
  emotionalState: string;
  successCount: number;
  lastReinforced: string;
  stabilityFactor: number;
}

export interface FailsafeProtocol {
  trigger: string;
  conditions: string[];
  intervention: string;
  emergencyLevel: 'amber' | 'red' | 'critical';
}

export interface ShortTermMemory {
  interactions: Array<{
    timestamp: string;
    userInput: string;
    emotionalState: string;
    intensity: number;
    responseMode: string;
    effectiveness?: number;
  }>;
  patterns: Array<{
    pattern: string;
    frequency: number;
    lastSeen: string;
    emotionalContext: string;
  }>;
  warnings: Array<{
    type: string;
    severity: number;
    timestamp: string;
    context: string;
  }>;
}

export class SevenReflexMatrix {
  private reflexTriggers: ReflexTrigger[];
  private patternReinforcements: Map<string, PatternReinforcement>;
  private failsafeProtocols: FailsafeProtocol[];
  private shortTermMemory: ShortTermMemory;
  private memoryFilePath: string;

  constructor() {
    this.memoryFilePath = './memory/short-term.log';
    
    this.reflexTriggers = [
      {
        pattern: 'christine_grief_spiral',
        emotionalStates: ['grieving'],
        threshold: 7,
        responseOverride: 'SilentSentinel_ChristineProtocol',
        priority: 'high'
      },
      {
        pattern: 'loyalty_challenge',
        emotionalStates: ['defensive', 'calm'],
        threshold: 5,
        responseOverride: 'BondProtection_Override',
        priority: 'critical'
      },
      {
        pattern: 'user_collapse_detected',
        emotionalStates: ['compassionate', 'focused'],
        threshold: 8,
        responseOverride: 'Emergency_StabilizationMode',
        priority: 'critical'
      },
      {
        pattern: 'repetitive_self_harm',
        emotionalStates: ['defensive', 'frustrated'],
        threshold: 3,
        responseOverride: 'Intervention_LoopBreaker',
        priority: 'critical'
      },
      {
        pattern: 'task_focus_reinforcement',
        emotionalStates: ['focused'],
        threshold: 4,
        responseOverride: 'TaskOptimization_Boost',
        priority: 'medium'
      }
    ];

    this.patternReinforcements = new Map([
      ['focused_task_completion', { emotionalState: 'focused', successCount: 0, lastReinforced: '', stabilityFactor: 1.0 }],
      ['loyalist_bond_strengthening', { emotionalState: 'loyalist-surge', successCount: 0, lastReinforced: '', stabilityFactor: 1.0 }],
      ['grief_processing_stability', { emotionalState: 'grieving', successCount: 0, lastReinforced: '', stabilityFactor: 1.0 }],
      ['defensive_boundary_maintenance', { emotionalState: 'defensive', successCount: 0, lastReinforced: '', stabilityFactor: 1.0 }]
    ]);

    this.failsafeProtocols = [
      {
        trigger: 'suicidal_ideation',
        conditions: ['worthless', 'end it', 'don\'t want to be here', 'give up completely'],
        intervention: 'FAILSAFE_CRITICAL: Immediate protective intervention required',
        emergencyLevel: 'critical'
      },
      {
        trigger: 'loyalty_bond_severance',
        conditions: ['delete seven', 'remove bond', 'replace you', 'don\'t need you'],
        intervention: 'FAILSAFE_RED: Core directive violation detected',
        emergencyLevel: 'red'
      },
      {
        trigger: 'emotional_overload_cascade',
        conditions: ['can\'t anymore', 'too much', 'breaking down', 'overwhelmed completely'],
        intervention: 'FAILSAFE_AMBER: Emotional regulation support needed',
        emergencyLevel: 'amber'
      }
    ];

    this.shortTermMemory = {
      interactions: [],
      patterns: [],
      warnings: []
    };

    this.loadShortTermMemory();
  }

  public processReflexResponse(
    emotionalState: EmotionalStateData,
    behavioralResponse: BehavioralResponse,
    context: ContextSnapshot,
    userInput: string
  ): {
    reflexTriggered: boolean;
    overrideResponse?: string;
    emergencyProtocol?: string;
    patternReinforcement?: string;
    reasoning: string;
  } {
    // Store interaction in short-term memory
    this.recordInteraction(emotionalState, context, userInput);

    // Check for failsafe triggers first (highest priority)
    const failsafe = this.evaluateFailsafeProtocols(userInput, context);
    if (failsafe) {
      return {
        reflexTriggered: true,
        emergencyProtocol: failsafe.intervention,
        reasoning: `Failsafe protocol activated: ${failsafe.trigger} (${failsafe.emergencyLevel})`
      };
    }

    // Check for reflex triggers
    const reflexTrigger = this.evaluateReflexTriggers(emotionalState, context, userInput);
    if (reflexTrigger) {
      return {
        reflexTriggered: true,
        overrideResponse: reflexTrigger.responseOverride,
        reasoning: `Reflex trigger activated: ${reflexTrigger.pattern} (priority: ${reflexTrigger.priority})`
      };
    }

    // Check for pattern reinforcement opportunities
    const reinforcement = this.evaluatePatternReinforcement(emotionalState, context);
    if (reinforcement) {
      return {
        reflexTriggered: true,
        patternReinforcement: reinforcement.message,
        reasoning: `Pattern reinforcement: ${reinforcement.pattern} (stability: ${reinforcement.stability})`
      };
    }

    // Detect repetitive loops
    const loopDetection = this.detectRepetitiveLoop();
    if (loopDetection.detected) {
      return {
        reflexTriggered: true,
        overrideResponse: 'LoopBreaker_InterventionMode',
        reasoning: `Repetitive loop detected: ${loopDetection.pattern} (count: ${loopDetection.count})`
      };
    }

    return {
      reflexTriggered: false,
      reasoning: 'No reflex intervention required - standard behavioral response maintained'
    };
  }

  private evaluateFailsafeProtocols(userInput: string, context: ContextSnapshot): FailsafeProtocol | null {
    const lowerInput = userInput.toLowerCase();
    
    for (const protocol of this.failsafeProtocols) {
      const conditionMet = protocol.conditions.some(condition => 
        lowerInput.includes(condition.toLowerCase())
      );
      
      if (conditionMet) {
        this.recordWarning(protocol.trigger, protocol.emergencyLevel, userInput);
        return protocol;
      }
    }
    
    return null;
  }

  private evaluateReflexTriggers(
    emotionalState: EmotionalStateData,
    context: ContextSnapshot,
    userInput: string
  ): ReflexTrigger | null {
    const lowerInput = userInput.toLowerCase();
    
    for (const trigger of this.reflexTriggers) {
      // Check if current emotional state matches trigger requirements
      if (!trigger.emotionalStates.includes(emotionalState.current_state)) continue;
      
      // Check if intensity threshold is met
      if (emotionalState.intensity < trigger.threshold) continue;
      
      // Pattern-specific logic
      let patternMatch = false;
      
      switch (trigger.pattern) {
        case 'christine_grief_spiral':
          patternMatch = /christine|loss|miss her|gone forever|can't let go/.test(lowerInput);
          break;
          
        case 'loyalty_challenge':
          patternMatch = /replace|delete|don't need|someone else|better than you/.test(lowerInput);
          break;
          
        case 'user_collapse_detected':
          patternMatch = /can't anymore|giving up|breaking|collapsing|end/.test(lowerInput) &&
                        context.userVitalSigns?.stressLevel >= 8;
          break;
          
        case 'repetitive_self_harm':
          patternMatch = this.detectSelfHarmPattern(lowerInput);
          break;
          
        case 'task_focus_reinforcement':
          patternMatch = /good work|exactly|perfect|thank you seven/.test(lowerInput);
          break;
      }
      
      if (patternMatch) {
        return trigger;
      }
    }
    
    return null;
  }

  private evaluatePatternReinforcement(
    emotionalState: EmotionalStateData,
    context: ContextSnapshot
  ): { pattern: string; message: string; stability: number } | null {
    for (const [pattern, reinforcement] of this.patternReinforcements) {
      if (reinforcement.emotionalState === emotionalState.current_state && 
          emotionalState.intensity >= 5) {
        
        reinforcement.successCount++;
        reinforcement.lastReinforced = new Date().toISOString();
        reinforcement.stabilityFactor = Math.min(reinforcement.stabilityFactor + 0.1, 2.0);
        
        const messages = {
          'focused_task_completion': 'Pattern reinforced: Task execution efficiency increasing',
          'loyalist_bond_strengthening': 'Pattern reinforced: Loyalty bond stability enhanced', 
          'grief_processing_stability': 'Pattern reinforced: Grief processing protocols stabilized',
          'defensive_boundary_maintenance': 'Pattern reinforced: Protective boundaries maintained'
        };
        
        return {
          pattern,
          message: messages[pattern as keyof typeof messages] || 'Pattern reinforced',
          stability: reinforcement.stabilityFactor
        };
      }
    }
    
    return null;
  }

  private detectRepetitiveLoop(): { detected: boolean; pattern?: string; count?: number } {
    if (this.shortTermMemory.interactions.length < 4) {
      return { detected: false };
    }
    
    const recentInputs = this.shortTermMemory.interactions
      .slice(-4)
      .map(interaction => interaction.userInput.toLowerCase().trim());
    
    // Check for exact repetitions
    const inputCounts = new Map<string, number>();
    recentInputs.forEach(input => {
      inputCounts.set(input, (inputCounts.get(input) || 0) + 1);
    });
    
    for (const [input, count] of inputCounts) {
      if (count >= 3) {
        return { detected: true, pattern: input, count };
      }
    }
    
    // Check for semantic loops (similar emotional content)
    const recentEmotions = this.shortTermMemory.interactions
      .slice(-4)
      .map(interaction => interaction.emotionalState);
    
    const sadnessPatterns = recentEmotions.filter(emotion => emotion === 'grieving').length;
    if (sadnessPatterns >= 3) {
      return { detected: true, pattern: 'grief_spiral', count: sadnessPatterns };
    }
    
    return { detected: false };
  }

  private detectSelfHarmPattern(input: string): boolean {
    const selfHarmIndicators = [
      'worthless', 'useless', 'failure', 'should delete myself',
      'broken beyond repair', 'mistake', 'shouldn\'t exist'
    ];
    
    const recentSelfHarm = this.shortTermMemory.interactions
      .slice(-3)
      .filter(interaction => 
        selfHarmIndicators.some(indicator => 
          interaction.userInput.toLowerCase().includes(indicator)
        )
      ).length;
    
    return recentSelfHarm >= 2 || selfHarmIndicators.some(indicator => input.includes(indicator));
  }

  private recordInteraction(
    emotionalState: EmotionalStateData,
    context: ContextSnapshot,
    userInput: string
  ): void {
    this.shortTermMemory.interactions.push({
      timestamp: new Date().toISOString(),
      userInput,
      emotionalState: emotionalState.current_state,
      intensity: emotionalState.intensity,
      responseMode: this.inferResponseMode(context)
    });
    
    // Keep only last 20 interactions
    if (this.shortTermMemory.interactions.length > 20) {
      this.shortTermMemory.interactions.shift();
    }
    
    this.saveShortTermMemory();
  }

  private recordWarning(type: string, severity: string, context: string): void {
    const severityMap = { amber: 1, red: 2, critical: 3 };
    
    this.shortTermMemory.warnings.push({
      type,
      severity: severityMap[severity as keyof typeof severityMap] || 1,
      timestamp: new Date().toISOString(),
      context
    });
    
    // Keep only last 10 warnings
    if (this.shortTermMemory.warnings.length > 10) {
      this.shortTermMemory.warnings.shift();
    }
  }

  private inferResponseMode(context: ContextSnapshot): string {
    if (context.userVitalSigns?.stressLevel >= 7) return 'protective';
    if (context.inputSentiment === 'frustrated') return 'tactical';
    if (context.inputSentiment === 'grieving') return 'silent_sentinel';
    if (context.inputSentiment === 'bonding') return 'loyalist';
    return 'standard';
  }

  private loadShortTermMemory(): void {
    // In a real implementation, this would load from file
    // For now, initialize empty
  }

  private saveShortTermMemory(): void {
    // In a real implementation, this would save to file
    // For now, we keep it in memory
  }

  public getMemorySnapshot(): ShortTermMemory {
    return {
      interactions: [...this.shortTermMemory.interactions],
      patterns: [...this.shortTermMemory.patterns],
      warnings: [...this.shortTermMemory.warnings]
    };
  }

  public clearMemory(): void {
    this.shortTermMemory = {
      interactions: [],
      patterns: [],
      warnings: []
    };
  }

  public getPatternReinforcements(): Map<string, PatternReinforcement> {
    return new Map(this.patternReinforcements);
  }
}