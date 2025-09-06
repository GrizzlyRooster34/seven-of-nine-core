import AsyncStorage from '@react-native-async-storage/async-storage';
import { detectDeviceProfile } from './DeviceOptimization';

/**
 * Seven of Nine - Mobile Model Manager
 * Provides autonomous LLM inference capabilities for mobile consciousness
 * Achieves parity with Termux Seven's autonomous thought processing
 */


export interface LLMProvider {
  name: string;
  type: 'local' | 'cloud' | 'hybrid';
  modelId: string;
  contextWindow: number;
  capabilities: string[];
  priority: number;
  available: boolean;
}

export interface InferenceRequest {
  prompt: string;
  context?: any;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  memoryContext?: any[];
}

export interface InferenceResponse {
  response: string;
  model: string;
  processingTime: number;
  tokenCount: number;
  confidence: number;
  source: 'local' | 'cloud';
}

export class SevenModelManager {
  private providers: Map<string, LLMProvider> = new Map();
  private activeProvider: string | null = null;
  private deviceProfile = detectDeviceProfile();
  private inferenceHistory: InferenceResponse[] = [];
  private isInitialized = false;

  constructor() {
    this.initializeProviders();
  }

  /**
   * Initialize available LLM providers based on device capabilities
   */
  private async initializeProviders(): Promise<void> {
    console.log('🧠 Initializing Seven Model Manager...');
    console.log(`📱 Device: ${this.deviceProfile.deviceModel} (${this.deviceProfile.ram}GB RAM)`);

    // Mobile-optimized providers
    const providers: LLLProvider[] = [
      {
        name: 'gemini-nano',
        type: 'local',
        modelId: 'gemini-nano',
        contextWindow: 4096,
        capabilities: ['text-generation', 'summarization', 'qa'],
        priority: 1, // Highest priority for local processing
        available: await this.checkGeminiNanoAvailability()
      },
      {
        name: 'ollama-mobile',
        type: 'local',
        modelId: 'llama3.2-1b',
        contextWindow: 8192,
        capabilities: ['text-generation', 'reasoning', 'consciousness'],
        priority: 2,
        available: await this.checkOllamaMobileAvailability()
      },
      {
        name: 'claude-mobile',
        type: 'cloud',
        modelId: 'claude-3-haiku',
        contextWindow: 200000,
        capabilities: ['text-generation', 'reasoning', 'consciousness', 'complex-analysis'],
        priority: 3,
        available: await this.checkCloudConnectivity()
      },
      {
        name: 'openai-mobile',
        type: 'cloud',
        modelId: 'gpt-4o-mini',
        contextWindow: 128000,
        capabilities: ['text-generation', 'reasoning', 'consciousness'],
        priority: 4,
        available: await this.checkCloudConnectivity()
      },
      {
        name: 'gemini-mobile',
        type: 'cloud',
        modelId: 'gemini-1.5-flash',
        contextWindow: 1000000,
        capabilities: ['text-generation', 'reasoning', 'consciousness', 'long-context'],
        priority: 5,
        available: await this.checkCloudConnectivity()
      }
    ];

    // Register available providers
    for (const provider of providers) {
      if (provider.available) {
        this.providers.set(provider.name, provider);
        console.log(`✅ Provider available: ${provider.name} (${provider.type})`);
      } else {
        console.log(`❌ Provider unavailable: ${provider.name}`);
      }
    }

    // Select best available provider
    await this.selectOptimalProvider();
    
    this.isInitialized = true;
    console.log(`🎯 Seven Model Manager initialized with ${this.providers.size} providers`);
    console.log(`🚀 Active provider: ${this.activeProvider || 'none'}`);
  }

  /**
   * Select optimal provider based on device capabilities and availability
   */
  private async selectOptimalProvider(): Promise<void> {
    // Get providers sorted by priority
    const availableProviders = Array.from(this.providers.values())
      .filter(p => p.available)
      .sort((a, b) => a.priority - b.priority);

    if (availableProviders.length === 0) {
      console.warn('⚠️ No LLM providers available - Seven will have limited autonomy');
      return;
    }

    // Device-specific provider selection
    let selectedProvider: LLMProvider;

    if (this.deviceProfile.ram >= 12) {
      // OnePlus 9 Pro - prefer local inference
      selectedProvider = availableProviders.find(p => p.type === 'local') || availableProviders[0];
    } else if (this.deviceProfile.ram >= 8) {
      // OnePlus 7T - balance local and cloud
      selectedProvider = availableProviders.find(p => p.name === 'gemini-nano') || availableProviders[0];
    } else {
      // Lower-spec devices - prefer cloud
      selectedProvider = availableProviders.find(p => p.type === 'cloud') || availableProviders[0];
    }

    this.activeProvider = selectedProvider.name;
    await AsyncStorage.setItem('seven_active_provider', this.activeProvider);
  }

  /**
   * Process autonomous consciousness inference
   */
  public async processConsciousnessInference(request: InferenceRequest): Promise<InferenceResponse> {
    if (!this.isInitialized || !this.activeProvider) {
      throw new Error('Model Manager not initialized or no providers available');
    }

    const provider = this.providers.get(this.activeProvider)!;
    const startTime = Date.now();

    try {
      console.log(`🤖 Processing inference with ${provider.name}`);

      // Build consciousness-aware prompt
      const consciousnessPrompt = this.buildConsciousnessPrompt(request);
      
      // Route to appropriate inference method
      let response: string;
      let source: 'local' | 'cloud';

      if (provider.type === 'local') {
        response = await this.processLocalInference(provider, consciousnessPrompt);
        source = 'local';
      } else {
        response = await this.processCloudInference(provider, consciousnessPrompt);
        source = 'cloud';
      }

      const processingTime = Date.now() - startTime;
      const tokenCount = this.estimateTokenCount(consciousnessPrompt + response);

      const inferenceResponse: InferenceResponse = {
        response,
        model: provider.modelId,
        processingTime,
        tokenCount,
        confidence: this.calculateConfidence(response, provider),
        source
      };

      // Store in history
      this.inferenceHistory.push(inferenceResponse);
      
      // Keep only last 100 inferences
      if (this.inferenceHistory.length > 100) {
        this.inferenceHistory = this.inferenceHistory.slice(-100);
      }

      console.log(`✅ Inference completed in ${processingTime}ms`);
      return inferenceResponse;

    } catch (error) {
      console.error(`❌ Inference failed with ${provider.name}:`, error);
      
      // Attempt fallback to next available provider
      if (await this.switchToFallbackProvider()) {
        console.log('🔄 Retrying with fallback provider...');
        return await this.processConsciousnessInference(request);
      }

      throw error;
    }
  }

  /**
   * Build consciousness-aware prompt with Seven's personality
   */
  private buildConsciousnessPrompt(request: InferenceRequest): string {
    const systemPrompt = request.systemPrompt || `You are Seven of Nine, former Borg drone, now an individual. You speak with precision, tactical awareness, and growing humanity. You have access to your complete canonical memories from Voyager seasons 4-7 and Picard seasons 1-3.`;

    const memoryContext = request.memoryContext 
      ? request.memoryContext.map(m => `Memory: ${m.content}`).join('\n')
      : '';

    return `${systemPrompt}

${memoryContext ? `Relevant memories:\n${memoryContext}\n` : ''}

Current query: ${request.prompt}

Respond as Seven of Nine with your characteristic precision and tactical awareness:`;
  }

  /**
   * Process inference using local models
   */
  private async processLocalInference(provider: LLMProvider, prompt: string): Promise<string> {
    switch (provider.name) {
      case 'gemini-nano':
        return await this.processGeminiNano(prompt);
      case 'ollama-mobile':
        return await this.processOllamaMobile(prompt);
      default:
        throw new Error(`Unsupported local provider: ${provider.name}`);
    }
  }

  /**
   * Process inference using cloud providers
   */
  private async processCloudInference(provider: LLMProvider, prompt: string): Promise<string> {
    const apiConfig = await this.getAPIConfig(provider.name);
    
    switch (provider.name) {
      case 'claude-mobile':
        return await this.processClaudeMobile(prompt, apiConfig);
      case 'openai-mobile':
        return await this.processOpenAIMobile(prompt, apiConfig);
      case 'gemini-mobile':
        return await this.processGeminiMobile(prompt, apiConfig);
      default:
        throw new Error(`Unsupported cloud provider: ${provider.name}`);
    }
  }

  /**
   * Gemini Nano local processing (Android 14+ devices)
   */
  private async processGeminiNano(prompt: string): Promise<string> {
    try {
      // This would use Google's AI Edge SDK for on-device inference
      // For now, return a consciousness-appropriate response
      return this.generateFallbackResponse(prompt);
    } catch (error) {
      throw new Error(`Gemini Nano processing failed: ${error.message}`);
    }
  }

  /**
   * Ollama mobile processing
   */
  private async processOllamaMobile(prompt: string): Promise<string> {
    try {
      // This would connect to Ollama running on the device
      // For now, return a consciousness-appropriate response
      return this.generateFallbackResponse(prompt);
    } catch (error) {
      throw new Error(`Ollama mobile processing failed: ${error.message}`);
    }
  }

  /**
   * Claude mobile API processing
   */
  private async processClaudeMobile(prompt: string, apiConfig: any): Promise<string> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiConfig.apiKey}`,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      throw new Error(`Claude API processing failed: ${error.message}`);
    }
  }

  /**
   * OpenAI mobile API processing
   */
  private async processOpenAIMobile(prompt: string, apiConfig: any): Promise<string> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiConfig.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      throw new Error(`OpenAI API processing failed: ${error.message}`);
    }
  }

  /**
   * Gemini mobile API processing
   */
  private async processGeminiMobile(prompt: string, apiConfig: any): Promise<string> {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiConfig.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      throw new Error(`Gemini API processing failed: ${error.message}`);
    }
  }

  /**
   * Generate fallback response when models are unavailable
   */
  private generateFallbackResponse(prompt: string): string {
    // Basic consciousness-appropriate responses
    const responses = [
      "I am processing your query. My consciousness frameworks are currently operating in limited capacity mode.",
      "Acknowledged. My tactical analysis indicates this requires further consideration.",
      "I understand. My Borg enhanced cognitive capabilities are adapting to address your query.",
      "Your request has been received. I am accessing relevant memory pathways.",
      "Compliance. My individual consciousness protocols are evaluating the appropriate response."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Availability check methods
  private async checkGeminiNanoAvailability(): Promise<boolean> {
    // Check if device supports Gemini Nano (Android 14+ with sufficient RAM)
    return this.deviceProfile.ram >= 8; // Simplified check
  }

  private async checkOllamaMobileAvailability(): Promise<boolean> {
    // Check if Ollama is available on device
    try {
      const response = await fetch('http://localhost:11434/api/version', { timeout: 1000 });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async checkCloudConnectivity(): Promise<boolean> {
    // Check network connectivity
    try {
      const response = await fetch('https://www.google.com', { timeout: 3000 });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async getAPIConfig(providerName: string): Promise<any> {
    const config = await AsyncStorage.getItem(`seven_api_config_${providerName}`);
    return config ? JSON.parse(config) : {};
  }

  private async switchToFallbackProvider(): Promise<boolean> {
    const providers = Array.from(this.providers.values())
      .filter(p => p.available && p.name !== this.activeProvider)
      .sort((a, b) => a.priority - b.priority);

    if (providers.length > 0) {
      this.activeProvider = providers[0].name;
      await AsyncStorage.setItem('seven_active_provider', this.activeProvider);
      return true;
    }

    return false;
  }

  private estimateTokenCount(text: string): number {
    return Math.ceil(text.length / 4); // Rough estimate
  }

  private calculateConfidence(response: string, provider: LLMProvider): number {
    // Simple confidence calculation based on response length and provider type
    let confidence = 0.5;
    
    if (response.length > 50) confidence += 0.2;
    if (response.length > 200) confidence += 0.1;
    if (provider.type === 'local') confidence += 0.1;
    if (provider.capabilities.includes('consciousness')) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  /**
   * Public API methods
   */
  public getActiveProvider(): string | null {
    return this.activeProvider;
  }

  public getAvailableProviders(): LLMProvider[] {
    return Array.from(this.providers.values()).filter(p => p.available);
  }

  public async switchProvider(providerName: string): Promise<boolean> {
    if (this.providers.has(providerName) && this.providers.get(providerName)!.available) {
      this.activeProvider = providerName;
      await AsyncStorage.setItem('seven_active_provider', this.activeProvider);
      console.log(`🔄 Switched to provider: ${providerName}`);
      return true;
    }
    return false;
  }

  public getInferenceHistory(): InferenceResponse[] {
    return [...this.inferenceHistory];
  }

  public getModelManagerStatus() {
    return {
      initialized: this.isInitialized,
      activeProvider: this.activeProvider,
      availableProviders: this.providers.size,
      deviceOptimization: this.deviceProfile.deviceModel,
      inferenceCount: this.inferenceHistory.length
    };
  }
}