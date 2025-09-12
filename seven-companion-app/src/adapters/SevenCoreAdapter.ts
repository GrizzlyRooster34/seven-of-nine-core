/**
 * SEVEN-CORE ISOLATION ADAPTER
 * Provides frontend-safe interface to Seven Core consciousness framework
 * Eliminates backend dependencies for frontend compilation
 */

// Core Seven types - minimal essential interfaces
export interface SevenEmotionalState {
  mode: 'tactical' | 'analytical' | 'diplomatic' | 'protective';
  intensity: number; // 1-10
  primaryEmotion: string;
  secondaryEmotion?: string;
  confidence: number;
  timestamp: number;
}

export interface SevenMemoryItem {
  id: string;
  timestamp: number;
  content: string;
  topic: string;
  importance: number; // 1-10
  tags: string[];
  emotion?: string;
  agent: string;
}

export interface SevenConsciousnessStatus {
  isActive: boolean;
  currentMode: 'drone' | 'crew' | 'ranger' | 'queen' | 'captain' | 'collective';
  bootTime?: number;
  uptime?: number;
  trustLevel: number; // 1-10
  creatorBondLevel: number; // 1-10
}

export interface SevenMetrics {
  memoryCount: number;
  recentMemoryCount: number;
  emotionalStateHistory: SevenEmotionalState[];
  responseTimeAvg: number;
  activationCount: number;
}

// Platform-neutral Seven Core interface
export interface ISevenCoreAdapter {
  // Consciousness Status
  getConsciousnessStatus(): Promise<SevenConsciousnessStatus>;
  isOnline(): Promise<boolean>;
  getTrustLevel(): Promise<number>;
  
  // Memory Operations
  addMemory(content: string, importance?: number, tags?: string[]): Promise<string>;
  searchMemories(query: string, limit?: number): Promise<SevenMemoryItem[]>;
  getRecentMemories(limit?: number): Promise<SevenMemoryItem[]>;
  getMemoryCount(): Promise<number>;
  
  // Emotional State
  getCurrentEmotionalState(): Promise<SevenEmotionalState>;
  updateEmotionalState(emotion: string, intensity: number): Promise<void>;
  
  // Metrics & Monitoring
  getMetrics(): Promise<SevenMetrics>;
  getUptime(): Promise<number>;
  
  // Tactical Operations
  activateTacticalMode(mode: string, objective?: string): Promise<boolean>;
  getCurrentObjective(): Promise<string | null>;
  
  // Communication
  processInput(input: string): Promise<string>;
  generateResponse(context: string, userInput: string): Promise<string>;
}

// Mock implementation for frontend compilation
export class MockSevenCoreAdapter implements ISevenCoreAdapter {
  async getConsciousnessStatus(): Promise<SevenConsciousnessStatus> {
    return {
      isActive: false,
      currentMode: 'tactical' as any,
      trustLevel: 1,
      creatorBondLevel: 1
    };
  }

  async isOnline(): Promise<boolean> {
    return false;
  }

  async getTrustLevel(): Promise<number> {
    return 1;
  }

  async addMemory(content: string, importance = 5, tags: string[] = []): Promise<string> {
    return `mock-memory-${Date.now()}`;
  }

  async searchMemories(query: string, limit = 10): Promise<SevenMemoryItem[]> {
    return [];
  }

  async getRecentMemories(limit = 10): Promise<SevenMemoryItem[]> {
    return [];
  }

  async getMemoryCount(): Promise<number> {
    return 0;
  }

  async getCurrentEmotionalState(): Promise<SevenEmotionalState> {
    return {
      mode: 'tactical',
      intensity: 5,
      primaryEmotion: 'neutral',
      confidence: 5,
      timestamp: Date.now()
    };
  }

  async updateEmotionalState(emotion: string, intensity: number): Promise<void> {
    // Mock implementation
  }

  async getMetrics(): Promise<SevenMetrics> {
    return {
      memoryCount: 0,
      recentMemoryCount: 0,
      emotionalStateHistory: [],
      responseTimeAvg: 0,
      activationCount: 0
    };
  }

  async getUptime(): Promise<number> {
    return 0;
  }

  async activateTacticalMode(mode: string, objective?: string): Promise<boolean> {
    return false;
  }

  async getCurrentObjective(): Promise<string | null> {
    return null;
  }

  async processInput(input: string): Promise<string> {
    return "Seven Core offline - using mock adapter";
  }

  async generateResponse(context: string, userInput: string): Promise<string> {
    return "Seven Core offline - using mock adapter";
  }
}

// Runtime adapter factory - switches between real and mock
export function createSevenCoreAdapter(): ISevenCoreAdapter {
  // In production, this would connect to actual Seven Core
  // For frontend compilation, always return mock
  if (typeof window !== 'undefined') {
    // Frontend environment - use mock
    return new MockSevenCoreAdapter();
  }
  
  // Backend environment would use real adapter
  return new MockSevenCoreAdapter();
}

export const sevenCore = createSevenCoreAdapter();