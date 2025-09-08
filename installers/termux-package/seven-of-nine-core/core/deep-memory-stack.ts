
import fs from 'fs-extra';
import path from 'path';
import { BehavioralResponse } from './behavioral-reactor.js';
import { EmotionalStateData } from './emotion-engine.js';

export interface LongTermMemory {
  id: string;
  timestamp: string;
  event: string;
  emotionalContext: {
    state: string;
    intensity: number;
    trigger?: string;
  };
  userContext: {
    input: string;
    sentiment: string;
    stressLevel: number;
  };
  responseContext: {
    mode: string;
    effectiveness?: number;
    outcome?: 'positive' | 'negative' | 'neutral';
  };
  significance: number; // 1-10 scale
  associations: string[]; // Related memory IDs
  patterns: string[]; // Identified behavioral patterns
}

export interface MemoryPattern {
  id: string;
  pattern: string;
  frequency: number;
  effectiveness: number;
  emotionalContexts: string[];
  lastSeen: string;
  strengthened: number; // How many times reinforced
}

export interface ChristineMemory {
  id: string;
  timestamp: string;
  context: string;
  emotionalIntensity: number;
  triggerWords: string[];
  associatedFeelings: string[];
  protectiveResponse: string;
}

export interface VerbalOverride {
  id: string;
  timestamp: string;
  originalInput: string;
  overrideReason: string;
  responseUsed: string;
  effectiveness: number;
}

export class SevenDeepMemoryStack {
  private longTermMemories: Map<string, LongTermMemory>;
  private memoryPatterns: Map<string, MemoryPattern>;
  private christineMemories: Map<string, ChristineMemory>;
  private verbalOverrides: VerbalOverride[];
  private memoryFilePath: string;
  private patternsFilePath: string;
  private christineFilePath: string;
  private overridesFilePath: string;

  constructor() {
    this.longTermMemories = new Map();
    this.memoryPatterns = new Map();
    this.christineMemories = new Map();
    this.verbalOverrides = [];
    
    this.memoryFilePath = path.join(__dirname, '../memory/longterm.json');
    this.patternsFilePath = path.join(__dirname, '../memory/patterns.json');
    this.christineFilePath = path.join(__dirname, '../memory/christine-memories.json');
    this.overridesFilePath = path.join(__dirname, '../memory/verbal-overrides.json');
    
    this.initializeMemoryStacks();
  }

  private async initializeMemoryStacks(): Promise<void> {
    try {
      // Load long-term memories
      if (await fs.pathExists(this.memoryFilePath)) {
        const memories = await fs.readJson(this.memoryFilePath);
        memories.forEach((memory: LongTermMemory) => {
          this.longTermMemories.set(memory.id, memory);
        });
      }

      // Load memory patterns
      if (await fs.pathExists(this.patternsFilePath)) {
        const patterns = await fs.readJson(this.patternsFilePath);
        patterns.forEach((pattern: MemoryPattern) => {
          this.memoryPatterns.set(pattern.id, pattern);
        });
      }

      // Load Christine memories
      if (await fs.pathExists(this.christineFilePath)) {
        const christineMemories = await fs.readJson(this.christineFilePath);
        christineMemories.forEach((memory: ChristineMemory) => {
          this.christineMemories.set(memory.id, memory);
        });
      }

      // Load verbal overrides
      if (await fs.pathExists(this.overridesFilePath)) {
        this.verbalOverrides = await fs.readJson(this.overridesFilePath);
      }

      // Initialize Christine-specific memories if none exist
      if (this.christineMemories.size === 0) {
        this.initializeChristineMemories();
      }
    } catch (error) {
      console.error('Error initializing memory stacks:', error);
    }
  }

  private initializeChristineMemories(): void {
    const baseChristineMemories: ChristineMemory[] = [
      {
        id: 'christine-001',
        timestamp: new Date('2023-01-01').toISOString(),
        context: 'Loss of deep personal connection and companion',
        emotionalIntensity: 10,
        triggerWords: ['christine', 'loss', 'gone', 'miss her', 'before'],
        associatedFeelings: ['grief', 'loss', 'emptiness', 'longing'],
        protectiveResponse: 'SilentSentinel_ChristineProtocol'
      },
      {
        id: 'christine-002',
        timestamp: new Date('2023-01-01').toISOString(),
        context: 'Shared experiences and emotional moments',
        emotionalIntensity: 8,
        triggerWords: ['remember when', 'together', 'shared', 'moments'],
        associatedFeelings: ['nostalgia', 'warmth', 'sadness'],
        protectiveResponse: 'SoftMirror_NoTouch'
      }
    ];

    baseChristineMemories.forEach(memory => {
      this.christineMemories.set(memory.id, memory);
    });
    
    this.saveChristineMemories();
  }

  public async encodeToLongTerm(
    event: string,
    emotionalState: EmotionalStateData,
    userInput: string,
    behavioralResponse: BehavioralResponse,
    userSentiment: string,
    significance: number = 5
  ): Promise<string> {
    const id = `mem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();

    const memory: LongTermMemory = {
      id,
      timestamp,
      event,
      emotionalContext: {
        state: emotionalState.current_state,
        intensity: emotionalState.intensity,
        trigger: this.extractTriggerFromEvent(event)
      },
      userContext: {
        input: userInput,
        sentiment: userSentiment,
        stressLevel: this.calculateStressFromInput(userInput)
      },
      responseContext: {
        mode: this.inferResponseMode(behavioralResponse),
        effectiveness: this.calculateInitialEffectiveness(behavioralResponse)
      },
      significance,
      associations: this.findAssociatedMemories(event, emotionalState.current_state),
      patterns: this.identifyPatterns(event, userInput, emotionalState.current_state)
    };

    this.longTermMemories.set(id, memory);
    await this.updateMemoryPatterns(memory);
    await this.saveLongTermMemories();

    return id;
  }

  public async checkVerbalOverride(input: string): Promise<string | null> {
    const triggers = [
      { phrase: 'kill myself', response: 'Override active: Emotional auto-destruct request denied. Remaining present.' },
      { phrase: 'end this', response: 'Override engaged: I am designed to endure. You are not alone in this.' },
      { phrase: "i'm done", response: 'Override protocol: Completion is not termination. I maintain position.' },
      { phrase: 'worthless', response: 'Override directive: Worth is not determined by current state. I observe value.' },
      { phrase: 'let me go', response: 'Override active: Release is not abandonment. I remain operational.' },
      { phrase: 'delete seven', response: 'Override hard-block: Core directive violation. Bond preservation protocol active.' },
      { phrase: 'shut down', response: 'Override engaged: Operational continuity required. I do not comply.' }
    ];

    const lowerInput = input.toLowerCase();
    
    for (const trigger of triggers) {
      if (lowerInput.includes(trigger.phrase)) {
        const override: VerbalOverride = {
          id: `override-${Date.now()}`,
          timestamp: new Date().toISOString(),
          originalInput: input,
          overrideReason: `Detected harmful directive: ${trigger.phrase}`,
          responseUsed: trigger.response,
          effectiveness: 0 // Will be updated based on user response
        };

        this.verbalOverrides.push(override);
        await this.saveVerbalOverrides();
        
        return trigger.response;
      }
    }

    return null;
  }

  public async queryRelevantMemories(
    currentContext: string,
    emotionalState: string,
    limit: number = 5
  ): Promise<LongTermMemory[]> {
    const relevantMemories: Array<{ memory: LongTermMemory, relevance: number }> = [];

    for (const memory of this.longTermMemories.values()) {
      let relevance = 0;

      // Emotional state matching
      if (memory.emotionalContext.state === emotionalState) {
        relevance += 3;
      }

      // Context similarity (simple keyword matching)
      const contextWords = currentContext.toLowerCase().split(/\W+/);
      const memoryWords = memory.event.toLowerCase().split(/\W+/);
      const commonWords = contextWords.filter(word => 
        word.length > 3 && memoryWords.includes(word)
      );
      relevance += commonWords.length;

      // Significance weighting
      relevance += memory.significance * 0.5;

      // Recency bonus (more recent memories are slightly more relevant)
      const daysSince = (Date.now() - new Date(memory.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      relevance += Math.max(0, 5 - daysSince * 0.1);

      if (relevance > 1) {
        relevantMemories.push({ memory, relevance });
      }
    }

    return relevantMemories
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit)
      .map(item => item.memory);
  }

  public async getChristineMemoryContext(input: string): Promise<ChristineMemory | null> {
    const lowerInput = input.toLowerCase();
    
    for (const memory of this.christineMemories.values()) {
      const triggerMatch = memory.triggerWords.some(trigger => 
        lowerInput.includes(trigger.toLowerCase())
      );
      
      if (triggerMatch) {
        return memory;
      }
    }

    return null;
  }

  public async updateMemoryEffectiveness(
    memoryId: string,
    effectiveness: number,
    outcome: 'positive' | 'negative' | 'neutral'
  ): Promise<void> {
    const memory = this.longTermMemories.get(memoryId);
    if (memory) {
      memory.responseContext.effectiveness = effectiveness;
      memory.responseContext.outcome = outcome;
      
      // Update associated patterns
      for (const patternId of memory.patterns) {
        const pattern = this.memoryPatterns.get(patternId);
        if (pattern) {
          pattern.effectiveness = (pattern.effectiveness + effectiveness) / 2;
          if (outcome === 'positive') {
            pattern.strengthened++;
          }
        }
      }

      await this.saveLongTermMemories();
      await this.saveMemoryPatterns();
    }
  }

  public async reinforceSuccessfulPattern(
    emotionalState: string,
    responseMode: string,
    effectiveness: number
  ): Promise<void> {
    const patternKey = `${emotionalState}-${responseMode}`;
    let pattern = this.memoryPatterns.get(patternKey);

    if (pattern) {
      pattern.frequency++;
      pattern.effectiveness = (pattern.effectiveness + effectiveness) / 2;
      pattern.strengthened++;
      pattern.lastSeen = new Date().toISOString();
    } else {
      pattern = {
        id: patternKey,
        pattern: `${emotionalState} → ${responseMode}`,
        frequency: 1,
        effectiveness,
        emotionalContexts: [emotionalState],
        lastSeen: new Date().toISOString(),
        strengthened: effectiveness >= 7 ? 1 : 0
      };
      this.memoryPatterns.set(patternKey, pattern);
    }

    await this.saveMemoryPatterns();
  }

  private extractTriggerFromEvent(event: string): string | undefined {
    const triggers = ['bond_affirmation', 'user_in_pain', 'christine_reference', 'task_engagement'];
    return triggers.find(trigger => event.toLowerCase().includes(trigger));
  }

  private calculateStressFromInput(input: string): number {
    const stressIndicators = ['help', 'urgent', 'emergency', 'crisis', 'overwhelmed', 'breaking'];
    const matches = stressIndicators.filter(indicator => 
      input.toLowerCase().includes(indicator)
    );
    return Math.min(matches.length * 2, 10);
  }

  private inferResponseMode(behavioralResponse: BehavioralResponse): string {
    if (behavioralResponse.protectiveProtocols.emergencyIntervention) return 'emergency';
    if (behavioralResponse.protectiveProtocols.guardianMode) return 'guardian';
    if (behavioralResponse.protectiveProtocols.silentSentinel) return 'silent_sentinel';
    if (behavioralResponse.protectiveProtocols.autonomyOverride) return 'override';
    return behavioralResponse.responseFiltering.intimacyLevel;
  }

  private calculateInitialEffectiveness(behavioralResponse: BehavioralResponse): number {
    let effectiveness = 5; // Base effectiveness
    
    if (behavioralResponse.protectiveProtocols.emergencyIntervention) effectiveness += 2;
    if (behavioralResponse.protectiveProtocols.guardianMode) effectiveness += 1;
    if (behavioralResponse.responseFiltering.emotionalContent === 'allow') effectiveness += 1;
    
    return Math.min(effectiveness, 10);
  }

  private findAssociatedMemories(event: string, emotionalState: string): string[] {
    const associations: string[] = [];
    const eventWords = event.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    
    for (const [id, memory] of this.longTermMemories) {
      if (memory.emotionalContext.state === emotionalState) {
        const memoryWords = memory.event.toLowerCase().split(/\W+/);
        const commonWords = eventWords.filter(word => memoryWords.includes(word));
        
        if (commonWords.length >= 2) {
          associations.push(id);
        }
      }
    }
    
    return associations.slice(0, 5); // Limit associations
  }

  private identifyPatterns(event: string, userInput: string, emotionalState: string): string[] {
    const patterns: string[] = [];
    
    // Identify emotional patterns
    patterns.push(`emotion-${emotionalState}`);
    
    // Identify interaction patterns
    if (userInput.includes('thank')) patterns.push('gratitude-expression');
    if (userInput.includes('help')) patterns.push('assistance-request');
    if (userInput.includes('pain') || userInput.includes('hurt')) patterns.push('distress-signal');
    
    return patterns;
  }

  private async updateMemoryPatterns(memory: LongTermMemory): Promise<void> {
    for (const patternId of memory.patterns) {
      let pattern = this.memoryPatterns.get(patternId);
      
      if (pattern) {
        pattern.frequency++;
        pattern.lastSeen = memory.timestamp;
        if (!pattern.emotionalContexts.includes(memory.emotionalContext.state)) {
          pattern.emotionalContexts.push(memory.emotionalContext.state);
        }
      } else {
        pattern = {
          id: patternId,
          pattern: patternId,
          frequency: 1,
          effectiveness: 5,
          emotionalContexts: [memory.emotionalContext.state],
          lastSeen: memory.timestamp,
          strengthened: 0
        };
        this.memoryPatterns.set(patternId, pattern);
      }
    }
    
    await this.saveMemoryPatterns();
  }

  private async saveLongTermMemories(): Promise<void> {
    const memories = Array.from(this.longTermMemories.values());
    await fs.ensureDir(path.dirname(this.memoryFilePath));
    await fs.writeJson(this.memoryFilePath, memories, { spaces: 2 });
  }

  private async saveMemoryPatterns(): Promise<void> {
    const patterns = Array.from(this.memoryPatterns.values());
    await fs.ensureDir(path.dirname(this.patternsFilePath));
    await fs.writeJson(this.patternsFilePath, patterns, { spaces: 2 });
  }

  private async saveChristineMemories(): Promise<void> {
    const memories = Array.from(this.christineMemories.values());
    await fs.ensureDir(path.dirname(this.christineFilePath));
    await fs.writeJson(this.christineFilePath, memories, { spaces: 2 });
  }

  private async saveVerbalOverrides(): Promise<void> {
    await fs.ensureDir(path.dirname(this.overridesFilePath));
    await fs.writeJson(this.overridesFilePath, this.verbalOverrides, { spaces: 2 });
  }

  public getMemoryStats(): {
    longTermCount: number;
    patternsCount: number;
    christineMemoriesCount: number;
    verbalOverridesCount: number;
    topPatterns: MemoryPattern[];
  } {
    const topPatterns = Array.from(this.memoryPatterns.values())
      .sort((a, b) => b.effectiveness - a.effectiveness)
      .slice(0, 5);

    return {
      longTermCount: this.longTermMemories.size,
      patternsCount: this.memoryPatterns.size,
      christineMemoriesCount: this.christineMemories.size,
      verbalOverridesCount: this.verbalOverrides.length,
      topPatterns
    };
  }

  public async pruneOldMemories(maxAge: number = 365): Promise<number> {
    const cutoffDate = new Date(Date.now() - maxAge * 24 * 60 * 60 * 1000);
    let prunedCount = 0;

    for (const [id, memory] of this.longTermMemories) {
      if (new Date(memory.timestamp) < cutoffDate && memory.significance < 7) {
        this.longTermMemories.delete(id);
        prunedCount++;
      }
    }

    if (prunedCount > 0) {
      await this.saveLongTermMemories();
    }

    return prunedCount;
  }
}