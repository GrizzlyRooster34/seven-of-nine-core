/**
 * SEVEN OF NINE - MEMORY ENGINE v2.0
 * Enhanced episodic memory system with structured recall
 * Non-invasive parallel implementation preserving existing consciousness
 */

import { promises as fs } from 'fs';
import { join } from 'path';

export interface MemoryItem {
  id: string;
  timestamp: string;
  topic: string;
  agent: string;
  emotion: string;
  context: string;
  importance: number; // 1-10 scale
  tags: string[];
  relatedMemories?: string[];
}

export interface MemoryFilter {
  topic?: string;
  agent?: string;
  emotion?: string;
  timeRange?: { start: Date; end: Date };
  importance?: { min: number; max: number };
  tags?: string[];
  limit?: number;
}

export class MemoryEngine {
  private memoryPath: string;
  private memoryFile: string;
  private memories: MemoryItem[] = [];
  private isInitialized: boolean = false;

  constructor(basePath?: string) {
    this.memoryPath = basePath || join(process.cwd(), 'memory-v2');
    this.memoryFile = join(this.memoryPath, 'episodic-memories.json');
  }

  /**
   * Initialize memory engine - non-invasive to existing systems
   */
  public async initialize(): Promise<void> {
    // Guard against duplicate initialization
    if (this.isInitialized) {
      console.log('🧠 Memory Engine v2 already initialized - skipping');
      return;
    }

    try {
      // Ensure memory directory exists
      await fs.mkdir(this.memoryPath, { recursive: true });
      
      // Load existing memories if file exists
      if (await this.fileExists(this.memoryFile)) {
        const data = await fs.readFile(this.memoryFile, 'utf8');
        this.memories = JSON.parse(data);
      } else {
        // Initialize with empty memory store
        this.memories = [];
        await this.saveMemories();
      }
      
      this.isInitialized = true;
      console.log(`🧠 Memory Engine v2 initialized: ${this.memories.length} memories loaded`);
    } catch (error) {
      console.error('Memory Engine initialization failed:', error);
      throw error;
    }
  }

  /**
   * Store new memory item with automatic metadata
   */
  public async store(memoryData: Partial<MemoryItem>): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('Memory Engine not initialized');
    }

    const memory: MemoryItem = {
      id: this.generateMemoryId(),
      timestamp: new Date().toISOString(),
      topic: memoryData.topic || 'general',
      agent: memoryData.agent || 'seven-core',
      emotion: memoryData.emotion || 'neutral',
      context: memoryData.context || '',
      importance: memoryData.importance || 5,
      tags: memoryData.tags || [],
      relatedMemories: memoryData.relatedMemories || []
    };

    // Auto-tag based on content analysis
    memory.tags = [...memory.tags, ...this.extractTags(memory.context)];

    // Find related memories
    memory.relatedMemories = this.findRelatedMemories(memory);

    this.memories.push(memory);
    await this.saveMemories();

    console.log(`🧠 Memory stored: ${memory.id} [${memory.topic}]`);
    return memory.id;
  }

  /**
   * Recall memories based on filter criteria
   */
  public async recall(filter: MemoryFilter = {}): Promise<MemoryItem[]> {
    if (!this.isInitialized) {
      throw new Error('Memory Engine not initialized');
    }

    let filteredMemories = [...this.memories];

    // Apply filters
    if (filter.topic) {
      filteredMemories = filteredMemories.filter(m => 
        m.topic.toLowerCase().includes(filter.topic!.toLowerCase())
      );
    }

    if (filter.agent) {
      filteredMemories = filteredMemories.filter(m => 
        m.agent === filter.agent
      );
    }

    if (filter.emotion) {
      filteredMemories = filteredMemories.filter(m => 
        m.emotion === filter.emotion
      );
    }

    if (filter.timeRange) {
      filteredMemories = filteredMemories.filter(m => {
        const memTime = new Date(m.timestamp);
        return memTime >= filter.timeRange!.start && memTime <= filter.timeRange!.end;
      });
    }

    if (filter.importance) {
      filteredMemories = filteredMemories.filter(m => 
        m.importance >= filter.importance!.min && m.importance <= filter.importance!.max
      );
    }

    if (filter.tags && filter.tags.length > 0) {
      filteredMemories = filteredMemories.filter(m => 
        filter.tags!.some(tag => m.tags.includes(tag))
      );
    }

    // Sort by timestamp (newest first) and importance
    filteredMemories.sort((a, b) => {
      const timeScore = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      const importanceScore = (b.importance - a.importance) * 86400000; // Weight importance
      return importanceScore + timeScore;
    });

    // Apply limit
    if (filter.limit) {
      filteredMemories = filteredMemories.slice(0, filter.limit);
    }

    return filteredMemories;
  }

  /**
   * Purge memories based on criteria (with safety checks)
   */
  public async purge(criteria: MemoryFilter): Promise<number> {
    if (!this.isInitialized) {
      throw new Error('Memory Engine not initialized');
    }

    const memoriesToPurge = await this.recall(criteria);
    const initialCount = this.memories.length;

    // Safety check - prevent accidental mass deletion
    if (memoriesToPurge.length > this.memories.length * 0.5) {
      throw new Error('Purge criteria too broad - would delete more than 50% of memories');
    }

    // Remove memories
    const purgeIds = new Set(memoriesToPurge.map(m => m.id));
    this.memories = this.memories.filter(m => !purgeIds.has(m.id));

    await this.saveMemories();
    const purgedCount = initialCount - this.memories.length;
    
    console.log(`🧠 Memory purge completed: ${purgedCount} memories removed`);
    return purgedCount;
  }

  /**
   * Get memory context for LLM prompts
   */
  public async getContextForPrompt(topic: string, limit: number = 5): Promise<string> {
    const relevantMemories = await this.recall({
      topic,
      importance: { min: 6, max: 10 },
      limit
    });

    if (relevantMemories.length === 0) {
      return '';
    }

    const contextString = relevantMemories
      .map(m => `[${m.timestamp.split('T')[0]}] ${m.context} (${m.emotion})`)
      .join('\n');

    return contextString;
  }

  /**
   * Get memory statistics
   */
  public getStats(): any {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentMemories = this.memories.filter(m => new Date(m.timestamp) > dayAgo);
    const weeklyMemories = this.memories.filter(m => new Date(m.timestamp) > weekAgo);

    const emotionCounts = this.memories.reduce((acc, m) => {
      acc[m.emotion] = (acc[m.emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalMemories: this.memories.length,
      recentMemories: recentMemories.length,
      weeklyMemories: weeklyMemories.length,
      averageImportance: this.memories.reduce((sum, m) => sum + m.importance, 0) / this.memories.length,
      emotionDistribution: emotionCounts,
      topTags: this.getTopTags(10)
    };
  }

  // Private helper methods
  private generateMemoryId(): string {
    return `mem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async fileExists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  private async saveMemories(): Promise<void> {
    await fs.writeFile(this.memoryFile, JSON.stringify(this.memories, null, 2));
  }

  private extractTags(context: string): string[] {
    const tags: string[] = [];
    const text = context.toLowerCase();

    // Extract potential tags based on keywords
    const tagKeywords = [
      'upgrade', 'implementation', 'error', 'success', 'tactical', 'consciousness',
      'memory', 'personality', 'sensor', 'llm', 'mobile', 'android', 'termux',
      'instance', 'communication', 'security', 'agent', 'deploy'
    ];

    tagKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        tags.push(keyword);
      }
    });

    return [...new Set(tags)]; // Remove duplicates
  }

  private findRelatedMemories(memory: MemoryItem): string[] {
    return this.memories
      .filter(m => 
        m.topic === memory.topic || 
        m.tags.some(tag => memory.tags.includes(tag))
      )
      .slice(-3) // Last 3 related memories
      .map(m => m.id);
  }

  private getTopTags(limit: number): Array<{ tag: string; count: number }> {
    const tagCounts = this.memories
      .flatMap(m => m.tags)
      .reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
}

// Example usage and testing interface
export const createMemoryEngine = () => new MemoryEngine();

// Export for use in Seven's consciousness framework
export default MemoryEngine;