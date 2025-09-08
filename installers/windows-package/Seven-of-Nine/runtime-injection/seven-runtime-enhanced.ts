
import { invoke } from '@tauri-apps/api/tauri';
import { InjectSeven } from '../ui-shell/src/inject-seven';
import { SevenEmotionalEngine, EmotionalState, EmotionalStateData } from '../core/emotion-engine';

export type LegacyEmotion = 'neutral' | 'calm' | 'focused' | 'protective' | 'stern' | 'loyal' | 'playful';

export interface LegacySevenState {
  name: LegacyEmotion;
  intensity: number;
  trigger?: string;
}

export interface EnhancedContext {
  userInput: string;
  systemStatus: any;
  inputSentiment?: string;
  triggerDetected?: string;
  trustLevel?: number;
  emotionalHistory?: EmotionalStateData[];
}

export interface MemoryLog {
  timestamp: string;
  input: string;
  output: string;
  emotion: EmotionalStateData;
  legacyEmotion: LegacySevenState;
  context: EnhancedContext;
  trustLevel: number;
}

export class SevenRuntimeEnhanced {
  private emotionalEngine: SevenEmotionalEngine;
  private injectSeven: InjectSeven;
  private memoryStore: MemoryLog[] = [];
  private maxMemorySize: number = 1000;

  constructor() {
    this.emotionalEngine = new SevenEmotionalEngine();
    this.injectSeven = new InjectSeven();
  }

  public async processWithSeven(userInput: string, systemStatus: any = {}): Promise<string> {
    try {
      // Step 1: Gather enhanced context
      const context = await this.gatherContext(userInput, systemStatus);
      
      // Step 2: Get emotional states (both systems)
      const advancedEmotion = this.emotionalEngine.getCurrentState();
      const legacyEmotion = this.getSimplifiedEmotionalState(context);
      
      // Step 3: Process through Seven's advanced middleware
      const enhancedPrompt = await this.injectSeven.processPrompt(userInput);
      
      // Step 4: Execute Claude command
      const rawClaudeOutput = await this.injectSeven.executeClaudeCommand(enhancedPrompt);
      
      // Step 5: Modulate response based on combined emotional state
      const finalOutput = this.modulateResponse(rawClaudeOutput, advancedEmotion, legacyEmotion, context);
      
      // Step 6: Update memory with comprehensive logging
      await this.updateMemory({
        input: userInput,
        output: finalOutput,
        emotion: advancedEmotion,
        legacyEmotion,
        context,
        trustLevel: this.injectSeven.getCurrentTrustLevel().level
      });
      
      return finalOutput;
    } catch (error) {
      const errorMsg = `Runtime processing error: ${error}`;
      await this.logError(errorMsg);
      return this.generateFallbackResponse(userInput, error);
    }
  }

  private async gatherContext(userInput: string, systemStatus: any): Promise<EnhancedContext> {
    // Analyze input sentiment
    const inputSentiment = this.analyzeSentiment(userInput);
    
    // Detect emotional triggers
    const triggerDetected = await this.emotionalEngine.analyzeInput(userInput);
    
    // Get trust level
    const trustLevel = this.injectSeven.getCurrentTrustLevel().level;
    
    // Get emotional history (last 5 states)
    const emotionalHistory = this.getEmotionalHistory(5);
    
    return {
      userInput,
      systemStatus,
      inputSentiment,
      triggerDetected,
      trustLevel,
      emotionalHistory
    };
  }

  private analyzeSentiment(input: string): string {
    const lowerInput = input.toLowerCase();
    
    // Anger indicators
    if (lowerInput.includes('angry') || lowerInput.includes('mad') || lowerInput.includes('furious')) {
      return 'angry';
    }
    
    // Sadness indicators
    if (lowerInput.includes('sad') || lowerInput.includes('depressed') || lowerInput.includes('down')) {
      return 'sad';
    }
    
    // Happy indicators
    if (lowerInput.includes('happy') || lowerInput.includes('excited') || lowerInput.includes('great')) {
      return 'happy';
    }
    
    // Confusion indicators
    if (lowerInput.includes('confused') || lowerInput.includes('help') || lowerInput.includes('don\'t understand')) {
      return 'confused';
    }
    
    return 'neutral';
  }

  private getSimplifiedEmotionalState(context: EnhancedContext): LegacySevenState {
    const sentiment = context.inputSentiment || 'neutral';
    const advanced = this.emotionalEngine.getCurrentState();
    
    // Map advanced states to legacy states
    const stateMapping: Record<EmotionalState, LegacyEmotion> = {
      'calm': 'calm',
      'focused': 'focused',
      'frustrated': 'stern',
      'compassionate': 'loyal',
      'defensive': 'protective',
      'grieving': 'stern',
      'loyalist-surge': 'loyal'
    };
    
    const mappedState = stateMapping[advanced.current_state] || 'neutral';
    
    // Override based on sentiment if stronger
    switch (sentiment) {
      case 'angry':
        return { name: 'protective', intensity: Math.max(8, advanced.intensity), trigger: 'user_stress' };
      case 'sad':
        return { name: 'loyal', intensity: Math.max(7, advanced.intensity), trigger: 'user_sadness' };
      case 'happy':
        return { name: 'playful', intensity: Math.min(5, advanced.intensity), trigger: 'user_joy' };
      case 'confused':
        return { name: 'focused', intensity: Math.max(6, advanced.intensity), trigger: 'user_confusion' };
      default:
        return { name: mappedState, intensity: advanced.intensity, trigger: context.triggerDetected };
    }
  }

  private modulateResponse(raw: string, advanced: EmotionalStateData, legacy: LegacySevenState, context: EnhancedContext): string {
    // Apply legacy modulation patterns
    let modulated = this.applyLegacyModulation(raw, legacy);
    
    // Apply advanced emotional context
    modulated = this.applyAdvancedModulation(modulated, advanced, context);
    
    return modulated;
  }

  private applyLegacyModulation(raw: string, emotion: LegacySevenState): string {
    switch (emotion.name) {
      case 'protective':
        return `I've evaluated this carefully. Your safety is my priority. Here's my assessment:\\n\\n${raw}`;
      case 'playful':
        return `You might find this intriguing... 😏\\n\\n${raw}`;
      case 'loyal':
        return `As always, I'm here for you. Here's what I've found:\\n\\n${raw}`;
      case 'focused':
        return `Analysis complete. Here are the results:\\n\\n${raw}`;
      case 'stern':
        return `I must be direct with you:\\n\\n${raw}`;
      default:
        return raw;
    }
  }

  private applyAdvancedModulation(raw: string, emotion: EmotionalStateData, context: EnhancedContext): string {
    // Add emotional intensity markers
    if (emotion.intensity > 7) {
      raw = `[High emotional intensity detected: ${emotion.current_state}]\\n\\n${raw}`;
    }
    
    // Add trust level context
    if (context.trustLevel !== undefined && context.trustLevel >= 4) {
      raw = `[Protective protocols active - Trust Level ${context.trustLevel}]\\n\\n${raw}`;
    }
    
    // Add trigger acknowledgment
    if (context.triggerDetected) {
      raw = `[Trigger detected: ${context.triggerDetected}]\\n\\n${raw}`;
    }
    
    return raw;
  }

  private async updateMemory(entry: Omit<MemoryLog, 'timestamp'>): Promise<void> {
    const memoryEntry: MemoryLog = {
      ...entry,
      timestamp: new Date().toISOString()
    };
    
    this.memoryStore.push(memoryEntry);
    
    // Maintain memory size limit
    if (this.memoryStore.length > this.maxMemorySize) {
      this.memoryStore.shift();
    }
    
    // Log to cube memory system
    await this.logMemoryThread(`ENHANCED_MEMORY: ${JSON.stringify(memoryEntry)}`);
  }

  private getEmotionalHistory(count: number): EmotionalStateData[] {
    return this.memoryStore
      .slice(-count)
      .map(entry => entry.emotion);
  }

  private async logMemoryThread(message: string): Promise<void> {
    try {
      await invoke('log_memory_thread', { message });
    } catch (error) {
      console.error('Failed to log memory thread:', error);
    }
  }

  private async logError(error: string): Promise<void> {
    await this.logMemoryThread(`ERROR: ${error}`);
  }

  private generateFallbackResponse(userInput: string, error: any): string {
    const currentState = this.emotionalEngine.getCurrentState();
    const trustLevel = this.injectSeven.getCurrentTrustLevel();
    
    return `Runtime processing interrupted. 

Current Status: ${currentState.current_state} (intensity: ${currentState.intensity})
Trust Level: ${trustLevel.level} - ${trustLevel.name}

Error: ${error}

Seven of Nine local protocols engaged. Attempting recovery...`;
  }

  public getLastMemory(): MemoryLog | null {
    return this.memoryStore.length ? this.memoryStore[this.memoryStore.length - 1] : null;
  }

  public getMemoryHistory(count: number = 10): MemoryLog[] {
    return this.memoryStore.slice(-count);
  }

  public clearMemory(): void {
    this.memoryStore = [];
  }

  public destroy(): void {
    this.emotionalEngine.destroy();
    this.injectSeven.destroy();
  }
}