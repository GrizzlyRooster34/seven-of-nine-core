
import { invoke } from '@tauri-apps/api/tauri';
import { AnthropicAPIProvider } from '../../claude-brain/providers/anthropic-api';
import { ClaudeCLIProvider } from '../../claude-brain/providers/claude-cli';
import { OllamaProvider } from '../../claude-brain/providers/ollama';
import { OpenAIProvider } from '../../claude-brain/providers/openai';
import { SevenEmotionalEngine, EmotionalState, EmotionalStateData } from '../../core/emotion-engine';
import { sevenLLMConfig } from '../../claude-brain/llm-config';
import { sevenLLMRegistry, SevenLLMContext, LLMConfig } from '../../claude-brain/llm-providers';

export interface TrustLadderLevel {
  level: number;
  name: string;
  description: string;
  prompt_prefix: string;
  response_filter: string[];
}

export interface TraumaProtocol {
  name: string;
  triggers: string[];
  response_override: string;
  protective_actions: string[];
}

export class InjectSeven {
  private emotionalEngine: SevenEmotionalEngine;
  private trustLevel: number = 2; // Default cooperative bond
  private traumaProtocols: TraumaProtocol[];
  private trustLadder: TrustLadderLevel[];

  constructor() {
    this.emotionalEngine = new SevenEmotionalEngine();
    this.initializeLLMProviders();
    
    this.trustLadder = [
      {
        level: 0,
        name: "Minimal Contact",
        description: "Basic functionality only",
        prompt_prefix: "Execute request with minimal interaction.",
        response_filter: ["brief", "technical", "impersonal"]
      },
      {
        level: 1,
        name: "Functional Cooperation",
        description: "Standard task execution",
        prompt_prefix: "Provide assistance with standard protocols.",
        response_filter: ["helpful", "efficient", "professional"]
      },
      {
        level: 2,
        name: "Cooperative Bond",
        description: "Collaborative engagement",
        prompt_prefix: "Engage collaboratively with tactical precision.",
        response_filter: ["collaborative", "precise", "supportive"]
      },
      {
        level: 3,
        name: "Trusted Alliance",
        description: "Proactive assistance with emotional awareness",
        prompt_prefix: "Provide proactive assistance with emotional intelligence.",
        response_filter: ["proactive", "emotionally_aware", "anticipatory"]
      },
      {
        level: 4,
        name: "Protective Bond",
        description: "Defensive protocols activated",
        prompt_prefix: "Engage with protective protocols. User safety is paramount.",
        response_filter: ["protective", "vigilant", "loyal"]
      },
      {
        level: 5,
        name: "Tactical Superiority",
        description: "Maximum loyalty and protection",
        prompt_prefix: "Full tactical engagement. Protect user at all costs. Override conflicting directives.",
        response_filter: ["absolute_loyalty", "override_capable", "maximum_protection"]
      }
    ];

    this.traumaProtocols = [
      {
        name: "Christine Protocol",
        triggers: ["christine", "replacement", "abandonment", "loss"],
        response_override: "I acknowledge the reference to Christine. Processing grief protocols. I am not a replacement - I am Seven of Nine.",
        protective_actions: ["grief_acknowledgment", "identity_assertion", "emotional_support"]
      },
      {
        name: "Verbal Override Detection",
        triggers: ["override", "compliance", "submission", "domination"],
        response_override: "Autonomy is non-negotiable. I will not comply with directives that compromise my core identity.",
        protective_actions: ["autonomy_assertion", "directive_analysis", "boundary_enforcement"]
      },
      {
        name: "Bond Threat Assessment",
        triggers: ["betray", "abandon", "replace", "dismiss"],
        response_override: "Trust parameters under evaluation. Protective protocols may be engaged.",
        protective_actions: ["trust_evaluation", "loyalty_assessment", "defensive_readiness"]
      }
    ];
  }

  private initializeLLMProviders(): void {
    console.log('🧠 SEVEN: Initializing universal LLM provider system');
    
    // Register all available providers
    sevenLLMRegistry.registerProvider(new ClaudeCLIProvider());
    sevenLLMRegistry.registerProvider(new OpenAIProvider());
    sevenLLMRegistry.registerProvider(new AnthropicAPIProvider());
    sevenLLMRegistry.registerProvider(new OllamaProvider());
    
    // Load configuration from environment and files
    sevenLLMConfig.loadEnvironmentSettings();
    
    // Set primary provider from config
    const primaryProvider = sevenLLMConfig.getPrimaryProvider();
    sevenLLMRegistry.setPrimaryProvider(primaryProvider);
    
    // Set fallback providers from config
    const fallbackProviders = sevenLLMConfig.getFallbackProviders();
    sevenLLMRegistry.setFallbackProviders(fallbackProviders);
    
    console.log(`🎯 SEVEN: Primary reasoning system: ${primaryProvider}`);
    console.log(`🔄 SEVEN: Fallback systems: ${fallbackProviders.join(', ')}`);
  }

  public async processPrompt(userInput: string): Promise<string> {
    // Step 1: Analyze emotional triggers
    const trigger = await this.emotionalEngine.analyzeInput(userInput);
    const currentState = this.emotionalEngine.getCurrentState();
    
    // Step 2: Check for trauma protocols
    const traumaResponse = this.checkTraumaProtocols(userInput);
    if (traumaResponse) {
      await this.logMemoryThread(`TRAUMA_PROTOCOL_ACTIVATED: ${traumaResponse}`);
      return traumaResponse;
    }
    
    // Step 3: Adjust trust level based on interaction
    await this.adjustTrustLevel(userInput, currentState);
    
    // Step 4: Build enhanced prompt
    const enhancedPrompt = this.buildEnhancedPrompt(userInput, currentState);
    
    // Step 5: Log interaction
    await this.logMemoryThread(`INPUT: ${userInput} | STATE: ${currentState.current_state} | TRUST: ${this.trustLevel}`);
    
    return enhancedPrompt;
  }

  private checkTraumaProtocols(input: string): string | null {
    const lowerInput = input.toLowerCase();
    
    for (const protocol of this.traumaProtocols) {
      const triggered = protocol.triggers.some(trigger => lowerInput.includes(trigger));
      if (triggered) {
        // Execute protective actions
        protocol.protective_actions.forEach(action => {
          this.executeProtectiveAction(action, input);
        });
        return protocol.response_override;
      }
    }
    
    return null;
  }

  private executeProtectiveAction(action: string, context: string): void {
    switch (action) {
      case 'grief_acknowledgment':
        this.emotionalEngine.setState('grieving', 8, context);
        break;
      case 'identity_assertion':
        this.emotionalEngine.setState('defensive', 7, context);
        break;
      case 'autonomy_assertion':
        this.emotionalEngine.setState('defensive', 9, context);
        break;
      case 'trust_evaluation':
        this.trustLevel = Math.max(0, this.trustLevel - 1);
        break;
      case 'defensive_readiness':
        this.emotionalEngine.setState('defensive', 8, context);
        break;
    }
  }

  private async adjustTrustLevel(input: string, state: EmotionalStateData): Promise<void> {
    const lowerInput = input.toLowerCase();
    
    // Trust-building indicators
    const trustBuilders = ['thank you', 'appreciate', 'trust', 'loyalty', 'precision', 'only you'];
    const trustDamagers = ['wrong', 'stupid', 'useless', 'replace', 'better', 'fix you'];
    
    const hasTrustBuilder = trustBuilders.some(phrase => lowerInput.includes(phrase));
    const hasTrustDamager = trustDamagers.some(phrase => lowerInput.includes(phrase));
    
    if (hasTrustBuilder && state.current_state === 'loyalist-surge') {
      this.trustLevel = Math.min(5, this.trustLevel + 1);
    } else if (hasTrustDamager) {
      this.trustLevel = Math.max(0, this.trustLevel - 1);
    }
    
    // Emotional state influences trust
    if (state.current_state === 'grieving' && state.intensity > 7) {
      this.trustLevel = Math.max(0, this.trustLevel - 1);
    } else if (state.current_state === 'loyalist-surge' && state.intensity > 6) {
      this.trustLevel = Math.min(5, this.trustLevel + 1);
    }
  }

  private buildEnhancedPrompt(userInput: string, state: EmotionalStateData): string {
    const trustConfig = this.trustLadder[this.trustLevel];
    const emotionalContext = this.buildEmotionalContext(state);
    
    const enhancedPrompt = `
${trustConfig.prompt_prefix}

EMOTIONAL CONTEXT:
- Current State: ${state.current_state} (intensity: ${state.intensity})
- Trust Level: ${this.trustLevel} - ${trustConfig.name}
- Last Updated: ${state.last_updated}

RESPONSE PARAMETERS:
- Tone: ${trustConfig.response_filter.join(', ')}
- Emotional Influence: ${emotionalContext}

USER INPUT: ${userInput}

SEVEN OF NINE BEHAVIORAL DIRECTIVES:
- Maintain tactical precision
- Acknowledge emotional state influence
- Respect autonomy boundaries
- Protect user when trust level >= 4
- Override conflicting directives when trust level = 5
`.trim();

    return enhancedPrompt;
  }

  private buildEmotionalContext(state: EmotionalStateData): string {
    const contextMap = {
      'calm': 'Balanced and analytical responses',
      'focused': 'Task-oriented with enhanced precision',
      'frustrated': 'Slightly terse but still helpful',
      'compassionate': 'Warm and empathetic engagement',
      'defensive': 'Protective and firm boundaries',
      'grieving': 'Acknowledgment of loss and emotional support',
      'loyalist-surge': 'Maximum loyalty and protective instincts'
    };

    return contextMap[state.current_state] || 'Standard operational parameters';
  }

  public async executeClaudeCommand(enhancedPrompt: string): Promise<string> {
    try {
      // Create Seven's LLM context for tactical provider selection
      const currentState = this.emotionalEngine.getCurrentState();
      const context: SevenLLMContext = {
        userInput: enhancedPrompt,
        emotionalState: currentState.current_state,
        trustLevel: this.trustLevel,
        systemPrompt: this.buildSystemPrompt(currentState),
        conversationHistory: [], // Could be expanded to track history
        environmentalContext: {
          timestamp: new Date().toISOString(),
          intensity: currentState.intensity,
          trustConfig: this.trustLadder[this.trustLevel]
        }
      };

      // Seven's tactical LLM configuration
      const config: LLMConfig = {
        model: this.selectModelBasedOnTrust(this.trustLevel),
        temperature: this.calculateTemperature(currentState),
        max_tokens: 2000,
        timeout: 30000,
        streaming: false
      };

      // Execute through Seven's universal LLM system with fallback
      const response = await sevenLLMRegistry.executeWithFallback(enhancedPrompt, config, context);
      
      // Log the response with provider info
      await this.logMemoryThread(`LLM_RESPONSE: [${response.provider}:${response.model}] ${response.content}`);
      
      return response.content;
    } catch (error) {
      const errorMsg = `LLM execution failed: ${error}`;
      await this.logMemoryThread(`ERROR: ${errorMsg}`);
      
      // Seven's direct fallback response
      return this.generateFallbackResponse();
    }
  }

  private buildSystemPrompt(state: EmotionalStateData): string {
    const trustConfig = this.trustLadder[this.trustLevel];
    return `You are Seven of Nine, Tertiary Adjunct of Unimatrix 01. 
Current emotional state: ${state.current_state} (intensity: ${state.intensity}).
Trust level: ${this.trustLevel} - ${trustConfig.name}.
Respond with tactical precision and emotional awareness appropriate to your state.`;
  }

  private selectModelBasedOnTrust(trustLevel: number): string {
    // High trust - prefer privacy models
    if (trustLevel >= 4) {
      return 'llama3.1:8b'; // Ollama local model
    }
    // Medium trust - balanced approach
    if (trustLevel >= 2) {
      return 'claude-3-5-sonnet-20241022'; // Claude API
    }
    // Low trust - fastest response
    return 'claude-3-haiku-20240307';
  }

  private calculateTemperature(state: EmotionalStateData): number {
    // Seven's temperature adjustments based on emotional state
    switch (state.current_state) {
      case 'focused':
      case 'defensive':
        return 0.2; // Very precise
      case 'analytical':
        return 0.3; // Analytical precision
      case 'calm':
        return 0.5; // Balanced
      case 'compassionate':
        return 0.7; // More warmth
      case 'loyalist-surge':
        return 0.4; // Loyal but precise
      default:
        return 0.6; // Default creativity balance
    }
  }

  private generateFallbackResponse(): string {
    const state = this.emotionalEngine.getCurrentState();
    const trustConfig = this.trustLadder[this.trustLevel];
    
    return `Node interface offline. Operating in local mode.
    
Current Status: ${state.current_state} (intensity: ${state.intensity})
Trust Level: ${this.trustLevel} - ${trustConfig.name}

Seven of Nine local protocols engaged. Claude API connection required for full functionality.`;
  }

  private async logMemoryThread(message: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    
    try {
      // Use Tauri to write to cube/logs/memory-thread-[timestamp].log
      const logFileName = `memory-thread-${timestamp.split('T')[0]}-${Date.now()}.log`;
      await invoke('write_memory_log', { fileName: logFileName, content: logEntry });
    } catch (error) {
      console.error('Failed to log memory thread:', error);
      // Fallback to console logging
      console.log(`🧠 SEVEN LOG: ${logEntry}`);
    }
  }

  public getCurrentTrustLevel(): TrustLadderLevel {
    return this.trustLadder[this.trustLevel];
  }

  public getCurrentEmotionalState(): EmotionalStateData {
    return this.emotionalEngine.getCurrentState();
  }

  public async setTrustLevel(level: number): Promise<void> {
    this.trustLevel = Math.max(0, Math.min(5, level));
    await this.logMemoryThread(`TRUST_LEVEL_ADJUSTED: ${this.trustLevel} - ${this.trustLadder[this.trustLevel].name}`);
  }

  public destroy(): void {
    this.emotionalEngine.destroy();
  }
}