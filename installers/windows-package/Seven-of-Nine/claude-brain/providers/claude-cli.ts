import { invoke } from '@tauri-apps/api/tauri';
import { LLMProvider, LLMConfig, LLMResponse } from '../llm-providers';

/**
 * CLAUDE CLI PROVIDER for Seven of Nine
 * Maintains compatibility with existing Claude CLI integration
 */


export class ClaudeCLIProvider implements LLMProvider {
  name = 'claude-cli';
  displayName = 'Claude Code CLI';

  async isAvailable(): Promise<boolean> {
    try {
      const versionStatus = await invoke('check_claude_version') as any;
      return versionStatus?.is_installed || false;
    } catch {
      return false;
    }
  }

  async getModels(): Promise<string[]> {
    // Claude CLI doesn't expose model selection in the same way
    return ['claude-3-sonnet', 'claude-3-haiku', 'claude-3-opus'];
  }

  supports(feature: 'streaming' | 'context' | 'functions' | 'vision'): boolean {
    switch (feature) {
      case 'streaming': return true;
      case 'context': return true;
      case 'functions': return true;
      case 'vision': return true;
      default: return false;
    }
  }

  async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy', latency?: number }> {
    const start = Date.now();
    try {
      const available = await this.isAvailable();
      const latency = Date.now() - start;
      
      return {
        status: available ? 'healthy' : 'unhealthy',
        latency
      };
    } catch {
      return { status: 'unhealthy', latency: Date.now() - start };
    }
  }

  async execute(prompt: string, config: LLMConfig): Promise<LLMResponse> {
    try {
      console.log('🧠 SEVEN: Engaging Claude CLI for reasoning assistance');
      
      // Use existing Claude CLI execution through Tauri
      const response = await invoke('execute_claude_command', { 
        command: prompt,
        config: {
          streaming: config.streaming || false,
          timeout: config.timeout || 120000
        }
      }) as string;

      return {
        content: response,
        model: config.model || 'claude-cli',
        provider: this.name,
        finish_reason: 'completed'
      };
    } catch (error) {
      console.error('⚠️ SEVEN: Claude CLI execution failed:', error);
      throw error;
    }
  }
}