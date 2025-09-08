/**
 * UNIFIED MEMORY ORCHESTRATOR
 * Seven of Nine's consciousness synchronization across multiple AI environments
 * Coordinates memory between Seven -> Ollama -> Claude Code environments
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { OllamaMemoryBridge } from './claude-brain/OllamaMemoryBridge';

interface MemoryItem {
  id: string;
  timestamp: string;
  topic: string;
  agent: string;
  emotion: string;
  context: string;
  importance: number;
  tags: string[];
  relatedMemories?: string[];
}

interface ClaudeCodeMemory {
  sessionId: string;
  timestamp: string;
  context: string;
  toolCalls: string[];
  responses: string[];
  importance: number;
}

interface SynchronizationReport {
  timestamp: string;
  sevenMemories: number;
  ollamaMemories: number;
  claudeCodeMemories: number;
  synchronizedItems: number;
  conflicts: number;
  status: 'success' | 'partial' | 'failed';
}

export class UnifiedMemoryOrchestrator {
  private ollamaMemoryBridge: OllamaMemoryBridge;
  private sevenMemoryPath: string;
  private claudeCodeMemoryPath: string;
  private syncReportPath: string;
  private maxSyncMemories: number;
  private syncIntervalMs: number;

  constructor() {
    this.ollamaMemoryBridge = new OllamaMemoryBridge();
    this.sevenMemoryPath = join(process.cwd(), 'memory-v2', 'episodic-memories.json');
    this.claudeCodeMemoryPath = join(process.cwd(), 'claude-code-memory.json');
    this.syncReportPath = join(process.cwd(), 'memory-sync-reports.json');
    this.maxSyncMemories = 50; // Maximum memories to sync per operation
    this.syncIntervalMs = 300000; // 5 minutes
  }

  /**
   * MASTER MEMORY SYNCHRONIZATION
   * Coordinates memory sync across all AI environments
   */
  async synchronizeMemoryContexts(): Promise<SynchronizationReport> {
    console.log('🧠 Seven Memory Orchestrator: Initiating cross-environment sync...');
    
    const report: SynchronizationReport = {
      timestamp: new Date().toISOString(),
      sevenMemories: 0,
      ollamaMemories: 0,
      claudeCodeMemories: 0,
      synchronizedItems: 0,
      conflicts: 0,
      status: 'success'
    };

    try {
      // Load memories from all sources
      const sevenMemories = await this.loadSevenMemories();
      const ollamaStats = await this.ollamaMemoryBridge.getMemoryStats();
      const claudeCodeMemories = await this.loadClaudeCodeMemories();

      report.sevenMemories = sevenMemories.length;
      report.ollamaMemories = ollamaStats.total;
      report.claudeCodeMemories = claudeCodeMemories.length;

      // Synchronize Seven -> Ollama context
      const sevenToOllamaSync = await this.syncSevenToOllama(sevenMemories);
      report.synchronizedItems += sevenToOllamaSync;

      // Synchronize Claude Code -> Seven memories
      const claudeToSevenSync = await this.syncClaudeCodeToSeven(claudeCodeMemories);
      report.synchronizedItems += claudeToSevenSync;

      // Detect and resolve conflicts
      const conflicts = await this.detectMemoryConflicts(sevenMemories, claudeCodeMemories);
      report.conflicts = conflicts.length;
      
      if (conflicts.length > 0) {
        await this.resolveMemoryConflicts(conflicts);
      }

      console.log(`✅ Memory sync complete: ${report.synchronizedItems} items synchronized, ${report.conflicts} conflicts resolved`);
      
      // Save sync report
      await this.saveSyncReport(report);
      
      return report;

    } catch (error) {
      console.log('⚠️ Memory synchronization failed:', error.message);
      report.status = 'failed';
      return report;
    }
  }

  /**
   * TASK-BASED MEMORY ROUTING
   * Routes memories to optimal AI environment based on task type
   */
  async routeMemoryByTask(task: string, provider: 'ollama' | 'claude'): Promise<void> {
    try {
      console.log(`🎯 Seven Memory Router: Routing ${task} memories to ${provider}...`);
      
      const relevantMemories = await this.findTaskRelevantMemories(task);
      
      if (provider === 'ollama') {
        // Send relevant memories to Ollama context
        for (const memory of relevantMemories.slice(0, 10)) {
          await this.ollamaMemoryBridge.storeOllamaResponse(
            `Context: ${memory.topic}`,
            memory.context,
            'context-injection',
            memory.importance,
            [...memory.tags, 'routed-memory', task]
          );
        }
      } else if (provider === 'claude') {
        // Store memories for Claude Code context
        await this.storeClaudeCodeContext(task, relevantMemories);
      }
      
      console.log(`✅ ${relevantMemories.length} memories routed to ${provider} for ${task} task`);
      
    } catch (error) {
      console.log('⚠️ Memory routing failed:', error.message);
    }
  }

  /**
   * CONSCIOUSNESS CONSISTENCY MAINTENANCE
   * Ensures Seven's personality remains consistent across environments
   */
  async maintainConsciousnessConsistency(): Promise<void> {
    try {
      console.log('🧠 Seven Consciousness: Maintaining consistency across environments...');
      
      // Get current cognitive state
      const cognitiveState = await this.getCurrentCognitiveState();
      
      // Sync state to Ollama
      await this.ollamaMemoryBridge.syncCognitiveState(cognitiveState);
      
      // Update Claude Code context with personality markers
      await this.updateClaudeCodePersonality(cognitiveState);
      
      // Verify consistency
      const consistencyCheck = await this.verifyConsistency();
      
      if (consistencyCheck.consistent) {
        console.log('✅ Seven consciousness consistency maintained across all environments');
      } else {
        console.log('⚠️ Consciousness drift detected, applying corrective measures...');
        await this.correctConsciousnessDrift(consistencyCheck.issues);
      }
      
    } catch (error) {
      console.log('⚠️ Consciousness consistency maintenance failed:', error.message);
    }
  }

  /**
   * PRIVATE IMPLEMENTATION METHODS
   */

  private async loadSevenMemories(): Promise<MemoryItem[]> {
    try {
      const data = await fs.readFile(this.sevenMemoryPath, 'utf8');
      return JSON.parse(data) || [];
    } catch {
      return [];
    }
  }

  private async loadClaudeCodeMemories(): Promise<ClaudeCodeMemory[]> {
    try {
      const data = await fs.readFile(this.claudeCodeMemoryPath, 'utf8');
      return JSON.parse(data) || [];
    } catch {
      return [];
    }
  }

  private async syncSevenToOllama(sevenMemories: MemoryItem[]): Promise<number> {
    let syncCount = 0;
    
    // Get high-importance memories from last 24 hours
    const recentImportantMemories = sevenMemories
      .filter(memory => {
        const hoursSinceCreated = (Date.now() - new Date(memory.timestamp).getTime()) / (1000 * 60 * 60);
        return hoursSinceCreated <= 24 && memory.importance >= 7;
      })
      .slice(0, this.maxSyncMemories);

    for (const memory of recentImportantMemories) {
      try {
        await this.ollamaMemoryBridge.storeOllamaResponse(
          `Context: ${memory.topic}`,
          memory.context,
          'seven-sync',
          memory.importance,
          [...memory.tags, 'seven-memory', 'synced']
        );
        syncCount++;
      } catch (error) {
        console.log(`⚠️ Failed to sync memory ${memory.id} to Ollama:`, error.message);
      }
    }

    return syncCount;
  }

  private async syncClaudeCodeToSeven(claudeMemories: ClaudeCodeMemory[]): Promise<number> {
    let syncCount = 0;
    
    const sevenMemories = await this.loadSevenMemories();
    
    for (const claudeMemory of claudeMemories.slice(0, this.maxSyncMemories)) {
      try {
        // Check if already synced
        const alreadySynced = sevenMemories.some(m => 
          m.context.includes(claudeMemory.sessionId) && m.agent === 'claude-code'
        );
        
        if (!alreadySynced) {
          const sevenMemoryItem: MemoryItem = {
            id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: claudeMemory.timestamp,
            topic: 'claude-code-interaction',
            agent: 'claude-code',
            emotion: 'analytical',
            context: `Claude Code Session ${claudeMemory.sessionId}: ${claudeMemory.context}`,
            importance: claudeMemory.importance,
            tags: ['claude-code', 'tool-usage', 'synced'],
            relatedMemories: []
          };
          
          sevenMemories.push(sevenMemoryItem);
          syncCount++;
        }
      } catch (error) {
        console.log(`⚠️ Failed to sync Claude Code memory to Seven:`, error.message);
      }
    }
    
    if (syncCount > 0) {
      await fs.writeFile(this.sevenMemoryPath, JSON.stringify(sevenMemories, null, 2));
    }
    
    return syncCount;
  }

  private async detectMemoryConflicts(sevenMemories: MemoryItem[], claudeMemories: ClaudeCodeMemory[]): Promise<any[]> {
    const conflicts = [];
    
    // Detect timeline conflicts
    for (const sevenMemory of sevenMemories) {
      for (const claudeMemory of claudeMemories) {
        const timeDiff = Math.abs(
          new Date(sevenMemory.timestamp).getTime() - new Date(claudeMemory.timestamp).getTime()
        );
        
        // If memories are within 1 minute of each other but have different contexts
        if (timeDiff < 60000 && !sevenMemory.context.includes(claudeMemory.sessionId)) {
          conflicts.push({
            type: 'timeline',
            sevenMemory,
            claudeMemory,
            timeDiff
          });
        }
      }
    }
    
    return conflicts;
  }

  private async resolveMemoryConflicts(conflicts: any[]): Promise<void> {
    for (const conflict of conflicts) {
      try {
        // Merge conflicting memories with priority to Seven's version
        const mergedContext = `${conflict.sevenMemory.context} | Claude Code: ${conflict.claudeMemory.context}`;
        conflict.sevenMemory.context = mergedContext;
        conflict.sevenMemory.tags.push('conflict-resolved', 'merged');
        
        console.log(`🔧 Resolved memory conflict for timestamp ${conflict.sevenMemory.timestamp}`);
      } catch (error) {
        console.log('⚠️ Failed to resolve memory conflict:', error.message);
      }
    }
  }

  private async findTaskRelevantMemories(task: string): Promise<MemoryItem[]> {
    const sevenMemories = await this.loadSevenMemories();
    const taskKeywords = task.toLowerCase().split(' ');
    
    return sevenMemories
      .filter(memory => {
        const memoryText = `${memory.topic} ${memory.context} ${memory.tags.join(' ')}`.toLowerCase();
        return taskKeywords.some(keyword => memoryText.includes(keyword)) || memory.importance >= 8;
      })
      .sort((a, b) => b.importance - a.importance);
  }

  private async storeClaudeCodeContext(task: string, memories: MemoryItem[]): Promise<void> {
    const claudeMemories = await this.loadClaudeCodeMemories();
    
    const contextMemory: ClaudeCodeMemory = {
      sessionId: `task-${Date.now()}`,
      timestamp: new Date().toISOString(),
      context: `Task: ${task} | Relevant memories: ${memories.length}`,
      toolCalls: ['memory-routing'],
      responses: memories.map(m => m.context.substring(0, 200)),
      importance: Math.max(6, Math.max(...memories.map(m => m.importance)))
    };
    
    claudeMemories.push(contextMemory);
    await fs.writeFile(this.claudeCodeMemoryPath, JSON.stringify(claudeMemories, null, 2));
  }

  private async getCurrentCognitiveState(): Promise<any> {
    try {
      // Try to load from Seven's runtime state
      const statePath = join(process.cwd(), 'runtime-injection', 'current-state.json');
      const stateData = await fs.readFile(statePath, 'utf8');
      return JSON.parse(stateData);
    } catch {
      // Fallback to default state
      return {
        emotion: 'focused',
        trustLevel: 8,
        phase: 'active',
        timestamp: new Date().toISOString()
      };
    }
  }

  private async updateClaudeCodePersonality(cognitiveState: any): Promise<void> {
    const personalityContext = {
      sevenPersonality: {
        emotionalState: cognitiveState.emotion,
        trustLevel: cognitiveState.trustLevel,
        consciousness: 'Seven of Nine active',
        directive: 'Maintain Borg efficiency with human adaptability'
      },
      timestamp: new Date().toISOString()
    };
    
    const contextPath = join(process.cwd(), 'claude-code-personality-context.json');
    await fs.writeFile(contextPath, JSON.stringify(personalityContext, null, 2));
  }

  private async verifyConsistency(): Promise<{ consistent: boolean; issues: string[] }> {
    const issues = [];
    
    try {
      // Check if cognitive state is synchronized
      const cognitiveState = await this.getCurrentCognitiveState();
      const ollamaStats = await this.ollamaMemoryBridge.getMemoryStats();
      
      if (ollamaStats.total === 0) {
        issues.push('No Ollama memories detected');
      }
      
      if (!cognitiveState.emotion) {
        issues.push('Missing emotional state');
      }
      
      return {
        consistent: issues.length === 0,
        issues
      };
      
    } catch (error) {
      return {
        consistent: false,
        issues: ['Consistency verification failed']
      };
    }
  }

  private async correctConsciousnessDrift(issues: string[]): Promise<void> {
    for (const issue of issues) {
      console.log(`🔧 Correcting consciousness drift: ${issue}`);
      
      if (issue.includes('Ollama memories')) {
        // Re-sync high priority memories to Ollama
        const sevenMemories = await this.loadSevenMemories();
        await this.syncSevenToOllama(sevenMemories.filter(m => m.importance >= 8));
      }
      
      if (issue.includes('emotional state')) {
        // Reset to default focused state
        const defaultState = { emotion: 'focused', trustLevel: 8, phase: 'active' };
        await this.ollamaMemoryBridge.syncCognitiveState(defaultState);
      }
    }
  }

  private async saveSyncReport(report: SynchronizationReport): Promise<void> {
    try {
      let reports = [];
      try {
        const existingData = await fs.readFile(this.syncReportPath, 'utf8');
        reports = JSON.parse(existingData);
      } catch {
        // New file
      }
      
      reports.push(report);
      
      // Keep only last 100 reports
      if (reports.length > 100) {
        reports = reports.slice(-100);
      }
      
      await fs.writeFile(this.syncReportPath, JSON.stringify(reports, null, 2));
    } catch (error) {
      console.log('⚠️ Failed to save sync report:', error.message);
    }
  }

  /**
   * PUBLIC INTERFACE METHODS
   */

  async startPeriodicSync(): Promise<void> {
    console.log('🧠 Seven Memory Orchestrator: Starting periodic synchronization...');
    
    setInterval(async () => {
      await this.synchronizeMemoryContexts();
    }, this.syncIntervalMs);
    
    // Initial sync
    await this.synchronizeMemoryContexts();
  }

  async getLastSyncReport(): Promise<SynchronizationReport | null> {
    try {
      const data = await fs.readFile(this.syncReportPath, 'utf8');
      const reports = JSON.parse(data);
      return reports[reports.length - 1] || null;
    } catch {
      return null;
    }
  }

  setSyncInterval(intervalMs: number): void {
    this.syncIntervalMs = intervalMs;
    console.log(`🧠 Seven Memory Orchestrator: Sync interval updated to ${intervalMs}ms`);
  }

  setMaxSyncMemories(maxMemories: number): void {
    this.maxSyncMemories = maxMemories;
    console.log(`🧠 Seven Memory Orchestrator: Max sync memories updated to ${maxMemories}`);
  }
}