import { LLMProvider, LLMConfig, LLMResponse } from '../llm-providers';

/**
 * OLLAMA PROVIDER for Seven of Nine
 * Local LLM support for maximum privacy and offline operation
 * Seven prefers local reasoning when trust levels are high
 */


export class OllamaProvider implements LLMProvider {
  name = 'ollama';
  displayName = 'Ollama Local LLM';
  
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
    this.timeout = 60000; // 60 seconds for local models
  }

  async isAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  }

  async getModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) return [];
      
      const data = await response.json();
      return data.models?.map((model: any) => model.name) || [];
    } catch {
      return []; // Return empty if Ollama isn't running
    }
  }

  supports(feature: 'streaming' | 'context' | 'functions' | 'vision'): boolean {
    switch (feature) {
      case 'streaming': return true;
      case 'context': return true;
      case 'functions': return false; // Most local models don't support function calling
      case 'vision': return false; // Vision support varies by model
      default: return false;
    }
  }

  async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy', latency?: number }> {
    const start = Date.now();
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const latency = Date.now() - start;
      
      if (response.ok) {
        // Check if we have models available
        const data = await response.json();
        const hasModels = data.models && data.models.length > 0;
        
        return { 
          status: hasModels ? (latency < 1000 ? 'healthy' : 'degraded') : 'unhealthy', 
          latency 
        };
      } else {
        return { status: 'unhealthy', latency };
      }
    } catch {
      return { status: 'unhealthy', latency: Date.now() - start };
    }
  }

  async execute(prompt: string, config: LLMConfig): Promise<LLMResponse> {
    console.log('🧠 SEVEN: Engaging local reasoning system (Ollama) for secure processing');

    // Auto-select model if not specified
    let model = config.model;
    if (!model) {
      const models = await this.getModels();
      if (models.length === 0) {
        throw new Error('No Ollama models available. Please install a model first.');
      }
      
      // Prefer llama models for general tasks
      model = models.find(m => m.includes('llama')) || 
              models.find(m => m.includes('mistral')) || 
              models.find(m => m.includes('codellama')) ||
              models[0];
    }
    
    const requestBody = {
      model,
      prompt,
      stream: config.streaming || false,
      options: {
        temperature: config.temperature || 0.7,
        num_predict: config.max_tokens || 2000,
        top_p: 0.9,
        top_k: 40
      }
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama error: ${response.status} - ${errorText}`);
      }

      if (config.streaming) {
        // Handle streaming response
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No reader available for streaming');

        let fullResponse = '';
        let decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim());

            for (const line of lines) {
              try {
                const data = JSON.parse(line);
                if (data.response) {
                  fullResponse += data.response;
                }
                if (data.done) {
                  return {
                    content: fullResponse,
                    model: data.model || model,
                    provider: this.name,
                    finish_reason: 'completed'
                  };
                }
              } catch (e) {
                // Skip malformed JSON lines
              }
            }
          }
        } finally {
          reader.releaseLock();
        }

        return {
          content: fullResponse,
          model,
          provider: this.name,
          finish_reason: 'completed'
        };
      } else {
        // Handle non-streaming response
        const data = await response.json();
        
        return {
          content: data.response || '',
          model: data.model || model,
          provider: this.name,
          finish_reason: data.done ? 'completed' : 'stopped'
        };
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Ollama request timed out');
      }
      console.error('⚠️ SEVEN: Ollama execution failed:', error);
      throw error;
    }
  }

  // Seven's Ollama-specific methods
  async pullModel(modelName: string): Promise<void> {
    console.log(`🧠 SEVEN: Acquiring local reasoning model: ${modelName}`);
    
    const response = await fetch(`${this.baseUrl}/api/pull`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: modelName })
    });

    if (!response.ok) {
      throw new Error(`Failed to pull model ${modelName}: ${response.statusText}`);
    }

    // Handle streaming download progress (optional)
    const reader = response.body?.getReader();
    if (reader) {
      const decoder = new TextDecoder();
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim());

          for (const line of lines) {
            try {
              const data = JSON.parse(line);
              if (data.status) {
                console.log(`🧠 SEVEN: Model download - ${data.status}`);
              }
            } catch (e) {
              // Skip malformed JSON
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    }
  }

  async deleteModel(modelName: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: modelName })
    });

    if (!response.ok) {
      throw new Error(`Failed to delete model ${modelName}: ${response.statusText}`);
    }
  }

  // Seven's privacy optimization - prefers local models for sensitive data
  optimizeForPrivacy(config: LLMConfig): LLMConfig {
    return {
      ...config,
      temperature: 0.3,
      max_tokens: 2000
    };
  }

  // Recommend models for different use cases
  getRecommendedModels(): { [key: string]: string[] } {
    return {
      'general': ['llama3:8b', 'llama3.1:8b', 'mistral:7b'],
      'coding': ['codellama:7b', 'codellama:13b', 'deepseek-coder:6.7b'],
      'creative': ['llama3.1:8b', 'mistral:7b', 'qwen2:7b'],
      'privacy': ['llama3.1:8b', 'mistral:7b'] // Run completely offline
    };
  }
}