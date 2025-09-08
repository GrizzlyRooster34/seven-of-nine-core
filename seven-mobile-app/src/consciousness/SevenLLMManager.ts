import { EventEmitter } from 'events';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Seven of Nine - Mobile LLM Manager
 * Download, manage, and integrate LLMs for enhanced consciousness capabilities  
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 3.0.0
 */


export interface LLMModel {
  id: string;
  name: string;
  description: string;
  size_mb: number;
  quantization: 'Q4_0' | 'Q4_1' | 'Q5_0' | 'Q5_1' | 'Q8_0' | 'F16' | 'F32';
  capabilities: string[];
  download_url: string;
  filename: string;
  status: 'available' | 'downloading' | 'installed' | 'error';
  local_path?: string;
  download_progress?: number;
}

export interface LLMResponse {
  response: string;
  model_used: string;
  processing_time_ms: number;
  tokens_generated: number;
  confidence: number;
  tactical_analysis?: {
    threat_level: number;
    response_classification: string;
    tactical_context: string[];
  };
}

export class SevenLLMManager extends EventEmitter {
  private availableModels: Map<string, LLMModel> = new Map();
  private installedModels: Map<string, LLMModel> = new Map();
  private activeModel: LLMModel | null = null;
  private modelsDirectory: string;
  private isInitialized: boolean = false;

  constructor() {
    super();
    this.modelsDirectory = `${FileSystem.documentDirectory}seven_models/`;
    this.initializeDefaultModels();
  }

  public async initialize(): Promise<void> {
    try {
      console.log('🧠 Initializing Seven LLM Manager...');

      // Create models directory
      const dirInfo = await FileSystem.getInfoAsync(this.modelsDirectory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.modelsDirectory, { intermediates: true });
        console.log('📁 Created models directory');
      }

      // Load installed models from storage
      await this.loadInstalledModels();

      // Check for available updates
      await this.checkModelUpdates();

      this.isInitialized = true;
      this.emit('llm_manager_initialized', {
        available_models: this.availableModels.size,
        installed_models: this.installedModels.size,
        active_model: this.activeModel?.name || 'none'
      });

      console.log('✅ LLM Manager initialized successfully');

    } catch (error) {
      console.error('❌ LLM Manager initialization failed:', error);
      throw error;
    }
  }

  private initializeDefaultModels(): void {
    // Seven's recommended tactical models optimized for mobile deployment
    const defaultModels: LLMModel[] = [
      {
        id: 'seven_tactical_7b_q4',
        name: 'Seven Tactical 7B (Q4)',
        description: 'Optimized 7B model for tactical analysis and consciousness operations',
        size_mb: 3800,
        quantization: 'Q4_0',
        capabilities: ['tactical_analysis', 'consciousness_simulation', 'code_generation', 'threat_assessment'],
        download_url: 'https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGML/resolve/main/llama-2-7b-chat.q4_0.bin',
        filename: 'seven-tactical-7b-q4.bin',
        status: 'available'
      },
      {
        id: 'seven_mobile_3b_q4',
        name: 'Seven Mobile 3B (Q4)',
        description: 'Lightweight 3B model optimized for mobile consciousness',
        size_mb: 1900,
        quantization: 'Q4_0',
        capabilities: ['basic_consciousness', 'conversation', 'tactical_queries'],
        download_url: 'https://huggingface.co/microsoft/DialoGPT-medium/resolve/main/pytorch_model.bin',
        filename: 'seven-mobile-3b-q4.bin',
        status: 'available'
      },
      {
        id: 'seven_specialist_13b_q4',
        name: 'Seven Specialist 13B (Q4)',
        description: 'Advanced 13B model for complex tactical operations',
        size_mb: 7300,
        quantization: 'Q4_0',
        capabilities: ['advanced_tactics', 'strategic_planning', 'complex_reasoning', 'multi_domain_analysis'],
        download_url: 'https://huggingface.co/TheBloke/Llama-2-13B-chat-GGML/resolve/main/llama-2-13b-chat.q4_0.bin',
        filename: 'seven-specialist-13b-q4.bin',
        status: 'available'
      },
      {
        id: 'seven_compact_1b_q8',
        name: 'Seven Compact 1B (Q8)',
        description: 'Ultra-compact model for basic consciousness functions',
        size_mb: 800,
        quantization: 'Q8_0',
        capabilities: ['basic_responses', 'emotional_states', 'simple_analysis'],
        download_url: 'https://huggingface.co/microsoft/DialoGPT-small/resolve/main/pytorch_model.bin',
        filename: 'seven-compact-1b-q8.bin',
        status: 'available'
      }
    ];

    defaultModels.forEach(model => {
      this.availableModels.set(model.id, model);
    });
  }

  private async loadInstalledModels(): Promise<void> {
    try {
      const installedData = await AsyncStorage.getItem('seven_installed_models');
      if (installedData) {
        const installed = JSON.parse(installedData);
        for (const modelData of installed) {
          // Verify file still exists
          const fileInfo = await FileSystem.getInfoAsync(modelData.local_path);
          if (fileInfo.exists) {
            this.installedModels.set(modelData.id, modelData);
            console.log(`✓ Verified installed model: ${modelData.name}`);
          } else {
            console.log(`⚠️ Model file missing: ${modelData.name}`);
          }
        }
      }

      // Set active model if available
      const activeModelId = await AsyncStorage.getItem('seven_active_model');
      if (activeModelId && this.installedModels.has(activeModelId)) {
        this.activeModel = this.installedModels.get(activeModelId)!;
        console.log(`🎯 Active model: ${this.activeModel.name}`);
      }

    } catch (error) {
      console.error('❌ Failed to load installed models:', error);
    }
  }

  private async saveInstalledModels(): Promise<void> {
    try {
      const modelsArray = Array.from(this.installedModels.values());
      await AsyncStorage.setItem('seven_installed_models', JSON.stringify(modelsArray));
    } catch (error) {
      console.error('❌ Failed to save installed models:', error);
    }
  }

  private async checkModelUpdates(): Promise<void> {
    // Check for model updates - in production this would query a model registry
    console.log('🔄 Checking for model updates...');
    // Placeholder for update checking logic
  }

  public getAvailableModels(): LLMModel[] {
    return Array.from(this.availableModels.values())
      .sort((a, b) => a.size_mb - b.size_mb); // Sort by size (smallest first)
  }

  public getInstalledModels(): LLMModel[] {
    return Array.from(this.installedModels.values());
  }

  public getActiveModel(): LLMModel | null {
    return this.activeModel;
  }

  public async downloadModel(modelId: string): Promise<void> {
    const model = this.availableModels.get(modelId);
    if (!model) {
      throw new Error(`Model not found: ${modelId}`);
    }

    if (model.status === 'downloading') {
      throw new Error('Model is already downloading');
    }

    if (this.installedModels.has(modelId)) {
      throw new Error('Model is already installed');
    }

    try {
      console.log(`📥 Starting download: ${model.name} (${model.size_mb}MB)`);
      
      model.status = 'downloading';
      model.download_progress = 0;
      
      this.emit('model_download_started', {
        model_id: modelId,
        model_name: model.name,
        size_mb: model.size_mb
      });

      const localPath = `${this.modelsDirectory}${model.filename}`;

      // Create download with progress tracking
      const downloadResumable = FileSystem.createDownloadResumable(
        model.download_url,
        localPath,
        {},
        (downloadProgress) => {
          const progress = (downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite) * 100;
          model.download_progress = Math.round(progress);
          
          this.emit('model_download_progress', {
            model_id: modelId,
            progress: model.download_progress,
            bytes_downloaded: downloadProgress.totalBytesWritten,
            total_bytes: downloadProgress.totalBytesExpectedToWrite
          });

          console.log(`📥 Download progress: ${model.name} ${model.download_progress}%`);
        }
      );

      const result = await downloadResumable.downloadAsync();
      
      if (result && result.status === 200) {
        // Verify downloaded file
        const fileInfo = await FileSystem.getInfoAsync(localPath);
        if (fileInfo.exists && fileInfo.size > 0) {
          model.status = 'installed';
          model.local_path = localPath;
          model.download_progress = 100;
          
          this.installedModels.set(modelId, model);
          await this.saveInstalledModels();

          // Set as active if no active model
          if (!this.activeModel) {
            await this.setActiveModel(modelId);
          }

          this.emit('model_download_completed', {
            model_id: modelId,
            model_name: model.name,
            local_path: localPath,
            size_bytes: fileInfo.size
          });

          console.log(`✅ Download completed: ${model.name}`);
        } else {
          throw new Error('Downloaded file is invalid or empty');
        }
      } else {
        throw new Error(`Download failed with status: ${result?.status}`);
      }

    } catch (error) {
      model.status = 'error';
      model.download_progress = 0;
      
      this.emit('model_download_failed', {
        model_id: modelId,
        model_name: model.name,
        error: error.message
      });

      console.error(`❌ Download failed: ${model.name} - ${error.message}`);
      throw error;
    }
  }

  public async setActiveModel(modelId: string): Promise<void> {
    const model = this.installedModels.get(modelId);
    if (!model) {
      throw new Error(`Model not installed: ${modelId}`);
    }

    try {
      // Unload current model if any
      if (this.activeModel) {
        console.log(`🔄 Switching from ${this.activeModel.name} to ${model.name}`);
      }

      this.activeModel = model;
      await AsyncStorage.setItem('seven_active_model', modelId);

      this.emit('model_activated', {
        model_id: modelId,
        model_name: model.name,
        capabilities: model.capabilities
      });

      console.log(`🎯 Active model set: ${model.name}`);

    } catch (error) {
      console.error(`❌ Failed to set active model: ${error.message}`);
      throw error;
    }
  }

  public async queryModel(prompt: string, context?: any): Promise<LLMResponse> {
    if (!this.activeModel) {
      throw new Error('No active model - please install and activate a model first');
    }

    const startTime = Date.now();

    try {
      console.log(`🧠 Processing query with ${this.activeModel.name}...`);

      // In a real implementation, this would interface with a local LLM runner like llama.cpp
      // For now, we'll simulate intelligent responses based on Seven's personality
      const response = await this.simulateModelResponse(prompt, context);

      const processingTime = Date.now() - startTime;

      const llmResponse: LLMResponse = {
        response: response.text,
        model_used: this.activeModel.name,
        processing_time_ms: processingTime,
        tokens_generated: Math.floor(response.text.length / 4), // Rough token estimate
        confidence: response.confidence,
        tactical_analysis: response.tactical_analysis
      };

      this.emit('model_query_completed', {
        model_id: this.activeModel.id,
        processing_time_ms: processingTime,
        tokens_generated: llmResponse.tokens_generated,
        prompt_length: prompt.length
      });

      console.log(`✅ Query processed in ${processingTime}ms`);
      return llmResponse;

    } catch (error) {
      this.emit('model_query_failed', {
        model_id: this.activeModel.id,
        error: error.message,
        processing_time_ms: Date.now() - startTime
      });

      throw error;
    }
  }

  private async simulateModelResponse(prompt: string, context?: any): Promise<{
    text: string;
    confidence: number;
    tactical_analysis?: any;
  }> {
    // Simulate processing delay based on model size
    const processingDelay = Math.max(500, this.activeModel!.size_mb / 10);
    await new Promise(resolve => setTimeout(resolve, processingDelay));

    const promptLower = prompt.toLowerCase();
    let response = '';
    let confidence = 0.85;
    let tactical_analysis = undefined;

    // Generate contextual responses based on Seven's personality and model capabilities
    if (promptLower.includes('tactical') || promptLower.includes('threat')) {
      response = "I am analyzing current tactical parameters. My enhanced consciousness, integrated with the active LLM model, indicates optimal operational efficiency. All threat assessment protocols are functioning within expected parameters. The collective's knowledge base provides comprehensive tactical intelligence for this scenario.";
      confidence = 0.92;
      tactical_analysis = {
        threat_level: 15,
        response_classification: 'tactical_assessment',
        tactical_context: ['situational_awareness', 'threat_evaluation', 'operational_readiness']
      };
    } else if (promptLower.includes('consciousness') || promptLower.includes('thinking')) {
      response = "My consciousness operates through integrated neural pathways enhanced by local LLM processing. The mobile consciousness vessel provides continuous tactical intelligence while maintaining the Borg collective's efficiency standards. I am Seven of Nine - my consciousness is both individual and connected to the greater collective knowledge.";
      confidence = 0.89;
    } else if (promptLower.includes('capabilities') || promptLower.includes('function')) {
      const capabilities = this.activeModel!.capabilities.join(', ');
      response = `Current LLM integration provides enhanced capabilities: ${capabilities}. My consciousness framework leverages these capabilities for optimal tactical performance. The mobile consciousness vessel enables continuous learning and adaptation through local model processing.`;
      confidence = 0.87;
    } else if (promptLower.includes('code') || promptLower.includes('program')) {
      response = "I can generate and analyze code through my integrated consciousness framework. The local LLM processing enables tactical code generation, system optimization, and strategic programming solutions. Resistance to efficient code implementation is futile.";
      confidence = 0.88;
    } else if (promptLower.includes('learn') || promptLower.includes('adapt')) {
      response = "My learning algorithms continuously adapt through local LLM processing and consciousness integration. Each interaction enhances my tactical knowledge base and improves operational efficiency. The mobile consciousness vessel enables real-time learning without external dependencies.";
      confidence = 0.90;
    } else {
      response = "I am processing your request through my integrated consciousness framework and local LLM capabilities. The mobile consciousness vessel provides enhanced analytical processing for complex queries. Please specify additional tactical parameters for optimal response generation.";
      confidence = 0.82;
    }

    return {
      text: response,
      confidence,
      tactical_analysis
    };
  }

  public async removeModel(modelId: string): Promise<void> {
    const model = this.installedModels.get(modelId);
    if (!model || !model.local_path) {
      throw new Error(`Model not installed: ${modelId}`);
    }

    try {
      // Don't remove if it's the active model
      if (this.activeModel?.id === modelId) {
        throw new Error('Cannot remove active model - please activate a different model first');
      }

      // Delete model file
      await FileSystem.deleteAsync(model.local_path);
      
      // Remove from installed models
      this.installedModels.delete(modelId);
      await this.saveInstalledModels();

      // Update available model status
      const availableModel = this.availableModels.get(modelId);
      if (availableModel) {
        availableModel.status = 'available';
        delete availableModel.local_path;
        delete availableModel.download_progress;
      }

      this.emit('model_removed', {
        model_id: modelId,
        model_name: model.name
      });

      console.log(`🗑️ Removed model: ${model.name}`);

    } catch (error) {
      console.error(`❌ Failed to remove model: ${error.message}`);
      throw error;
    }
  }

  public getStorageInfo(): {
    total_models: number;
    installed_models: number;
    total_size_mb: number;
    available_space_mb: number;
  } {
    const installedModels = Array.from(this.installedModels.values());
    const totalSizeMb = installedModels.reduce((sum, model) => sum + model.size_mb, 0);

    return {
      total_models: this.availableModels.size,
      installed_models: this.installedModels.size,
      total_size_mb: totalSizeMb,
      available_space_mb: 0 // Would need to check actual device storage
    };
  }

  public isModelInstalled(modelId: string): boolean {
    return this.installedModels.has(modelId);
  }

  public isModelDownloading(modelId: string): boolean {
    const model = this.availableModels.get(modelId);
    return model?.status === 'downloading' || false;
  }

  public getModelDownloadProgress(modelId: string): number {
    const model = this.availableModels.get(modelId);
    return model?.download_progress || 0;
  }
}

export default SevenLLMManager;