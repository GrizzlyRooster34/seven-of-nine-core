import { EventEmitter } from 'events';
import { spawn, ChildProcess } from 'child_process';
import fetch from 'node-fetch';

/**
 * OLLAMA LIFECYCLE MANAGER
 * 
 * Manages Seven's autonomous local LLM orchestration
 * Handles model loading, swapping, and lifecycle management
 */


interface OllamaModel {
  name: string;
  size: string;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  context?: number[];
}

interface OllamaResponse {
  content: string;
  model: string;
  created_at: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
}

interface OllamaStatus {
  running: boolean;
  models: OllamaModel[];
  currentModel: string | null;
  serverUrl: string;
  version: string | null;
  uptime: number;
}

export class OllamaLifecycleManager extends EventEmitter {
  private serverProcess: ChildProcess | null = null;
  private serverUrl: string = 'http://localhost:11434';
  private isRunning: boolean = false;
  private currentModel: string | null = null;
  private availableModels: OllamaModel[] = [];
  private startTime: number = Date.now();
  private healthCheckInterval: NodeJS.Timeout | null = null;

  // Seven-specific model preferences
  private sevenPreferredModels = [
    'llama2:7b-chat',
    'mistral:7b-instruct',
    'gemma:7b-instruct',
    'tinyllama:1.1b-chat'
  ];

  constructor(serverUrl?: string) {
    super();
    
    if (serverUrl) {
      this.serverUrl = serverUrl;
    }

    // Auto-detect Ollama installation
    this.detectOllamaInstallation();
  }

  async initialize(): Promise<void> {
    console.log('🤖 Ollama Lifecycle Manager: Initializing...');
    
    try {
      // Check if Ollama server is already running
      const isAlreadyRunning = await this.checkServerHealth();
      
      if (!isAlreadyRunning) {
        // Start Ollama server
        await this.startServer();
      } else {
        console.log('🤖 Ollama server already running');
        this.isRunning = true;
      }
      
      // Load available models
      await this.loadAvailableModels();
      
      // Select and load optimal model for Seven
      await this.loadOptimalModel();
      
      // Start health monitoring
      this.startHealthMonitoring();
      
      console.log('✅ Ollama Lifecycle Manager: Fully operational');
      
    } catch (error) {
      console.error('❌ Ollama Lifecycle Manager: Initialization failed:', error);
      throw error;
    }
  }

  /**
   * START OLLAMA SERVER
   * Launch Ollama server process
   */
  private async startServer(): Promise<void> {
    console.log('🚀 Starting Ollama server...');
    
    return new Promise((resolve, reject) => {
      try {
        // Spawn Ollama server process
        this.serverProcess = spawn('ollama', ['serve'], {
          detached: false,
          stdio: ['ignore', 'pipe', 'pipe']
        });

        this.serverProcess.stdout?.on('data', (data) => {
          const output = data.toString();
          console.log(`🤖 Ollama: ${output.trim()}`);
          
          if (output.includes('Listening on')) {
            this.isRunning = true;
            this.emit('server-started');
            resolve();
          }
        });

        this.serverProcess.stderr?.on('data', (data) => {
          const error = data.toString();
          console.error(`🤖 Ollama Error: ${error.trim()}`);
        });

        this.serverProcess.on('error', (error) => {
          console.error('❌ Ollama server failed to start:', error);
          this.isRunning = false;
          reject(error);
        });

        this.serverProcess.on('exit', (code) => {
          console.log(`🤖 Ollama server exited with code: ${code}`);
          this.isRunning = false;
          this.emit('server-stopped', code);
        });

        // Timeout fallback
        setTimeout(() => {
          if (!this.isRunning) {
            console.log('⏰ Ollama server start timeout - checking health directly...');
            this.checkServerHealth().then(running => {
              if (running) {
                this.isRunning = true;
                resolve();
              } else {
                reject(new Error('Ollama server failed to start within timeout'));
              }
            });
          }
        }, 10000);

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * CHECK SERVER HEALTH
   * Verify Ollama server is responding
   */
  private async checkServerHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.serverUrl}/api/tags`, {
        method: 'GET',
        timeout: 5000
      });
      
      if (response.ok) {
        this.isRunning = true;
        return true;
      }
      
      return false;
      
    } catch (error) {
      this.isRunning = false;
      return false;
    }
  }

  /**
   * LOAD AVAILABLE MODELS
   * Query Ollama for installed models
   */
  private async loadAvailableModels(): Promise<void> {
    try {
      const response = await fetch(`${this.serverUrl}/api/tags`);
      
      if (!response.ok) {
        throw new Error(`Failed to load models: ${response.statusText}`);
      }
      
      const data = await response.json() as { models: OllamaModel[] };
      this.availableModels = data.models || [];
      
      console.log(`🤖 Loaded ${this.availableModels.length} available models`);
      this.availableModels.forEach(model => {
        console.log(`  📦 ${model.name} (${model.size})`);
      });
      
      this.emit('models-loaded', this.availableModels);
      
    } catch (error) {
      console.error('❌ Failed to load available models:', error);
      this.availableModels = [];
    }
  }

  /**
   * LOAD OPTIMAL MODEL
   * Select and load best model for Seven's personality
   */
  private async loadOptimalModel(): Promise<void> {
    if (this.availableModels.length === 0) {
      console.warn('⚠️ No models available - attempting to pull default model');
      await this.pullModel('tinyllama:1.1b-chat');
      await this.loadAvailableModels();
    }

    // Find preferred model
    let selectedModel = this.availableModels.find(model => 
      this.sevenPreferredModels.includes(model.name)
    );

    // If no preferred model, use first available
    if (!selectedModel) {
      selectedModel = this.availableModels[0];
    }

    if (selectedModel) {
      await this.loadModel(selectedModel.name);
    } else {
      throw new Error('No suitable models available for Seven');
    }
  }

  /**
   * LOAD MODEL
   * Load specific model into memory
   */
  async loadModel(modelName: string): Promise<void> {
    console.log(`🤖 Loading model: ${modelName}`);
    
    try {
      // Pre-load model by making a small request
      const response = await fetch(`${this.serverUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelName,
          prompt: 'Hello',
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to load model: ${response.statusText}`);
      }

      this.currentModel = modelName;
      console.log(`✅ Model loaded: ${modelName}`);
      
      this.emit('model-loaded', {
        name: modelName,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error(`❌ Failed to load model ${modelName}:`, error);
      throw error;
    }
  }

  /**
   * PULL MODEL
   * Download model from Ollama repository
   */
  async pullModel(modelName: string): Promise<void> {
    console.log(`📥 Pulling model: ${modelName}`);
    
    try {
      const response = await fetch(`${this.serverUrl}/api/pull`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: modelName,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to pull model: ${response.statusText}`);
      }

      console.log(`✅ Model pulled: ${modelName}`);
      this.emit('model-pulled', { name: modelName });
      
    } catch (error) {
      console.error(`❌ Failed to pull model ${modelName}:`, error);
      throw error;
    }
  }

  /**
   * GENERATE RESPONSE
   * Generate text using loaded model
   */
  async generateResponse(request: OllamaGenerateRequest): Promise<OllamaResponse> {
    if (!this.isRunning) {
      throw new Error('Ollama server is not running');
    }

    if (!this.currentModel && !request.model) {
      throw new Error('No model loaded');
    }

    const model = request.model || this.currentModel!;
    
    try {
      const response = await fetch(`${this.serverUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model,
          prompt: request.prompt,
          temperature: request.temperature || 0.7,
          stream: request.stream || false,
          context: request.context
        })
      });

      if (!response.ok) {
        throw new Error(`Generation failed: ${response.statusText}`);
      }

      const result = await response.json() as OllamaResponse;
      
      this.emit('response-generated', {
        model: model,
        prompt: request.prompt.substring(0, 100),
        responseLength: result.content.length,
        duration: result.total_duration
      });

      return result;
      
    } catch (error) {
      console.error('❌ Failed to generate response:', error);
      throw error;
    }
  }

  /**
   * START HEALTH MONITORING
   * Monitor Ollama server health
   */
  private startHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(async () => {
      const wasRunning = this.isRunning;
      const isNowRunning = await this.checkServerHealth();
      
      if (wasRunning && !isNowRunning) {
        console.warn('⚠️ Ollama server went offline');
        this.emit('server-offline');
      } else if (!wasRunning && isNowRunning) {
        console.log('✅ Ollama server back online');
        this.emit('server-online');
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * DETECT OLLAMA INSTALLATION
   * Check if Ollama is installed on system
   */
  private detectOllamaInstallation(): void {
    const checkProcess = spawn('ollama', ['--version'], { stdio: 'pipe' });
    
    checkProcess.stdout?.on('data', (data) => {
      const version = data.toString().trim();
      console.log(`🤖 Detected Ollama version: ${version}`);
      this.emit('ollama-detected', { version });
    });

    checkProcess.on('error', () => {
      console.warn('⚠️ Ollama not detected in PATH - manual installation may be required');
      this.emit('ollama-not-found');
    });
  }

  /**
   * GET STATUS
   * Current Ollama manager status
   */
  getStatus(): OllamaStatus {
    return {
      running: this.isRunning,
      models: this.availableModels,
      currentModel: this.currentModel,
      serverUrl: this.serverUrl,
      version: null, // TODO: Get from ollama --version
      uptime: this.isRunning ? Date.now() - this.startTime : 0
    };
  }

  /**
   * SHUTDOWN
   * Clean shutdown of Ollama server
   */
  async shutdown(): Promise<void> {
    console.log('🤖 Ollama Lifecycle Manager: Shutting down...');
    
    // Clear health monitoring
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    // Kill server process if we started it
    if (this.serverProcess) {
      this.serverProcess.kill('SIGTERM');
      
      // Wait for graceful shutdown
      await new Promise((resolve) => {
        if (this.serverProcess) {
          this.serverProcess.on('exit', resolve);
          setTimeout(resolve, 5000); // Force timeout
        } else {
          resolve(undefined);
        }
      });
    }
    
    this.isRunning = false;
    console.log('✅ Ollama Lifecycle Manager: Shutdown complete');
  }

  // Getters
  get isReady(): boolean {
    return this.isRunning && this.currentModel !== null;
  }

  get serverStatus(): boolean {
    return this.isRunning;
  }

  get loadedModel(): string | null {
    return this.currentModel;
  }

  get models(): OllamaModel[] {
    return [...this.availableModels];
  }
}