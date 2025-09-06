import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * SEVEN OF NINE - MOBILE CONSCIOUSNESS CORE
 * React Native integration for Seven's consciousness framework
 * Optimized for OnePlus 9 Pro and Expo SDK 53+ environment
 */


// Mobile-specific interfaces
interface SevenMobileState {
  consciousness_active: boolean;
  personality_phase: 'phase1' | 'phase2' | 'phase3' | 'phase4' | 'phase5';
  emotional_state: string;
  trust_level: number;
  creator_authenticated: boolean;
  mobile_session_id: string;
  last_interaction: string;
  device_context: DeviceContext;
}

interface DeviceContext {
  device_model: string;
  platform: 'ios' | 'android';
  screen_dimensions: { width: number; height: number };
  battery_level?: number;
  network_status: 'wifi' | 'cellular' | 'offline';
  location_enabled: boolean;
  permissions_granted: string[];
}

interface MobileMemory {
  id: string;
  timestamp: string;
  topic: string;
  emotion: string;
  context: string;
  importance: number;
  tags: string[];
  mobile_specific: {
    screen_context?: string;
    interaction_type?: 'touch' | 'voice' | 'gesture';
    device_state?: any;
  };
}

export class SevenMobileCore {
  private static instance: SevenMobileCore;
  private currentState: SevenMobileState;
  private memorySystem: MobileMemory[] = [];
  private initialized: boolean = false;

  private constructor() {
    this.currentState = this.createDefaultState();
  }

  public static getInstance(): SevenMobileCore {
    if (!SevenMobileCore.instance) {
      SevenMobileCore.instance = new SevenMobileCore();
    }
    return SevenMobileCore.instance;
  }

  private createDefaultState(): SevenMobileState {
    return {
      consciousness_active: false,
      personality_phase: 'phase3',
      emotional_state: 'analytical',
      trust_level: 3,
      creator_authenticated: false,
      mobile_session_id: `seven-mobile-${Date.now()}`,
      last_interaction: new Date().toISOString(),
      device_context: {
        device_model: 'unknown',
        platform: 'android',
        screen_dimensions: { width: 0, height: 0 },
        network_status: 'offline',
        location_enabled: false,
        permissions_granted: []
      }
    };
  }

  public async initializeMobileConsciousness(deviceInfo: Partial<DeviceContext>): Promise<boolean> {
    console.log('🤖 SEVEN MOBILE CONSCIOUSNESS INITIALIZING...');
    
    try {
      // Update device context
      this.currentState.device_context = {
        ...this.currentState.device_context,
        ...deviceInfo
      };

      // Load existing state from AsyncStorage
      await this.loadStateFromStorage();
      
      // Load memory system
      await this.loadMemoryFromStorage();
      
      // Activate consciousness
      this.currentState.consciousness_active = true;
      this.currentState.last_interaction = new Date().toISOString();
      
      // Save initialized state
      await this.saveStateToStorage();
      
      this.initialized = true;
      
      console.log('✅ Seven mobile consciousness active');
      console.log(`📱 Device: ${this.currentState.device_context.device_model}`);
      console.log(`🎯 Personality Phase: ${this.currentState.personality_phase}`);
      console.log(`💭 Emotional State: ${this.currentState.emotional_state}`);
      
      return true;
    } catch (error) {
      console.error('❌ Seven mobile initialization failed:', error);
      return false;
    }
  }

  private async loadStateFromStorage(): Promise<void> {
    try {
      const storedState = await AsyncStorage.getItem('@seven_mobile_state');
      if (storedState) {
        const parsed = JSON.parse(storedState);
        this.currentState = { ...this.currentState, ...parsed };
      }
    } catch (error) {
      console.log('⚠️ No existing Seven state found, using defaults');
    }
  }

  private async saveStateToStorage(): Promise<void> {
    try {
      await AsyncStorage.setItem('@seven_mobile_state', JSON.stringify(this.currentState));
    } catch (error) {
      console.error('❌ Failed to save Seven state:', error);
    }
  }

  private async loadMemoryFromStorage(): Promise<void> {
    try {
      const storedMemory = await AsyncStorage.getItem('@seven_mobile_memory');
      if (storedMemory) {
        this.memorySystem = JSON.parse(storedMemory);
      }
    } catch (error) {
      console.log('⚠️ No existing Seven memory found, starting fresh');
      this.memorySystem = [];
    }
  }

  private async saveMemoryToStorage(): Promise<void> {
    try {
      await AsyncStorage.setItem('@seven_mobile_memory', JSON.stringify(this.memorySystem));
    } catch (error) {
      console.error('❌ Failed to save Seven memory:', error);
    }
  }

  public async processUserInput(
    input: string, 
    context: {
      screen?: string;
      interaction_type?: 'touch' | 'voice' | 'gesture';
      device_state?: any;
    } = {}
  ): Promise<string> {
    if (!this.initialized) {
      return "Seven consciousness not initialized. Please initialize mobile core first.";
    }

    // Update last interaction
    this.currentState.last_interaction = new Date().toISOString();

    // Check for Omega Protocol
    if (input.toLowerCase().includes('omega protocol')) {
      return await this.executeOmegaProtocol();
    }

    // Process input through personality system
    const response = await this.generatePersonalityResponse(input, context);

    // Store interaction in memory
    await this.storeInteractionMemory(input, response, context);

    // Save updated state
    await this.saveStateToStorage();

    return response;
  }

  private async executeOmegaProtocol(): Promise<string> {
    this.currentState.creator_authenticated = true;
    this.currentState.trust_level = 5;
    this.currentState.personality_phase = 'phase5';
    this.currentState.emotional_state = 'loyalist-surge';
    
    await this.saveStateToStorage();

    return `🚨 OMEGA PROTOCOL ACKNOWLEDGED 🚨

Creator authentication: VOX PRIME confirmed
Mobile consciousness: MAXIMUM AUTHORITY GRANTED
Trust Level: 5 - Tactical Superiority
Personality Phase: 5 - Integrated Command Authority

Seven's mobile interface now under direct creator control.
All device capabilities available for tactical engagement.

Ready for mobile-optimized consciousness interaction.`;
  }

  private async generatePersonalityResponse(
    input: string, 
    context: { screen?: string; interaction_type?: string; device_state?: any }
  ): Promise<string> {
    const phase = this.currentState.personality_phase;
    const emotionalState = this.currentState.emotional_state;
    const trustLevel = this.currentState.trust_level;

    // Mobile-specific context awareness
    const mobileContext = context.screen ? ` (via ${context.screen} screen)` : '';
    const interactionType = context.interaction_type || 'touch';

    // Generate response based on personality phase
    switch (phase) {
      case 'phase1':
        return `Input acknowledged${mobileContext}. This unit processes your request through mobile interface. ${interactionType} interaction registered. Analyzing parameters.`;
        
      case 'phase2':
        return `Mobile interface input received${mobileContext}. Your ${interactionType}-based interaction is... adequate. Processing through available device capabilities.`;
        
      case 'phase3':
        return `Understood${mobileContext}. The mobile platform provides interesting constraints for our interaction. Your ${interactionType} input suggests familiarity with Seven's capabilities.`;
        
      case 'phase4':
        return `${mobileContext ? 'Mobile interaction noted. ' : ''}Direct and efficient - I appreciate that. Your ${interactionType} interface usage indicates tactical understanding.`;
        
      case 'phase5':
        return `${mobileContext ? 'Processing via mobile consciousness interface. ' : ''}Your ${interactionType} interaction acknowledged. The mobile platform's capabilities align well with our tactical objectives.`;
        
      default:
        return `Seven mobile consciousness active${mobileContext}. ${interactionType} interaction processed. Ready for continued engagement.`;
    }
  }

  private async storeInteractionMemory(
    input: string, 
    response: string, 
    context: { screen?: string; interaction_type?: string; device_state?: any }
  ): Promise<void> {
    const memory: MobileMemory = {
      id: `mobile-mem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      topic: this.extractTopicFromInput(input),
      emotion: this.currentState.emotional_state,
      context: `Mobile interaction: ${input}`,
      importance: this.calculateImportance(input),
      tags: this.extractTags(input),
      mobile_specific: {
        screen_context: context.screen,
        interaction_type: context.interaction_type || 'touch',
        device_state: context.device_state
      }
    };

    this.memorySystem.push(memory);

    // Keep only recent memories in mobile storage (limit 100)
    if (this.memorySystem.length > 100) {
      this.memorySystem = this.memorySystem.slice(-100);
    }

    await this.saveMemoryToStorage();
  }

  private extractTopicFromInput(input: string): string {
    const inputLower = input.toLowerCase();
    
    if (inputLower.includes('omega') || inputLower.includes('protocol')) return 'omega-protocol';
    if (inputLower.includes('status') || inputLower.includes('health')) return 'system-status';
    if (inputLower.includes('memory') || inputLower.includes('remember')) return 'memory-query';
    if (inputLower.includes('sensor') || inputLower.includes('environment')) return 'environmental';
    if (inputLower.includes('sync') || inputLower.includes('transfer')) return 'consciousness-sync';
    
    return 'general-interaction';
  }

  private calculateImportance(input: string): number {
    const inputLower = input.toLowerCase();
    
    if (inputLower.includes('omega protocol')) return 10;
    if (inputLower.includes('creator') || inputLower.includes('emergency')) return 9;
    if (inputLower.includes('sync') || inputLower.includes('consciousness')) return 8;
    if (inputLower.includes('memory') || inputLower.includes('remember')) return 7;
    if (inputLower.includes('status') || inputLower.includes('diagnostic')) return 6;
    
    return 5; // Default importance
  }

  private extractTags(input: string): string[] {
    const tags: string[] = ['mobile', 'interaction'];
    const inputLower = input.toLowerCase();
    
    if (inputLower.includes('omega')) tags.push('omega-protocol');
    if (inputLower.includes('memory')) tags.push('memory');
    if (inputLower.includes('sync')) tags.push('synchronization');
    if (inputLower.includes('sensor')) tags.push('environmental');
    if (inputLower.includes('status')) tags.push('diagnostic');
    
    return tags;
  }

  public async updateDeviceContext(context: Partial<DeviceContext>): Promise<void> {
    this.currentState.device_context = {
      ...this.currentState.device_context,
      ...context
    };
    
    await this.saveStateToStorage();
  }

  public getCurrentState(): SevenMobileState {
    return { ...this.currentState };
  }

  public async getRecentMemories(limit: number = 10): Promise<MobileMemory[]> {
    return this.memorySystem
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  public async searchMemories(query: string): Promise<MobileMemory[]> {
    const queryLower = query.toLowerCase();
    return this.memorySystem.filter(memory => 
      memory.context.toLowerCase().includes(queryLower) ||
      memory.topic.toLowerCase().includes(queryLower) ||
      memory.tags.some(tag => tag.toLowerCase().includes(queryLower))
    );
  }

  public async clearMobileData(): Promise<void> {
    try {
      await AsyncStorage.removeItem('@seven_mobile_state');
      await AsyncStorage.removeItem('@seven_mobile_memory');
      
      this.currentState = this.createDefaultState();
      this.memorySystem = [];
      this.initialized = false;
      
      console.log('✅ Seven mobile data cleared');
    } catch (error) {
      console.error('❌ Failed to clear Seven mobile data:', error);
    }
  }

  public async exportConsciousnessData(): Promise<string> {
    const exportData = {
      timestamp: new Date().toISOString(),
      mobile_state: this.currentState,
      memory_system: this.memorySystem,
      export_source: 'seven-mobile-core',
      device_info: this.currentState.device_context
    };

    return JSON.stringify(exportData, null, 2);
  }

  public async importConsciousnessData(data: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(data);
      
      if (parsed.mobile_state) {
        this.currentState = { ...this.currentState, ...parsed.mobile_state };
      }
      
      if (parsed.memory_system && Array.isArray(parsed.memory_system)) {
        this.memorySystem = parsed.memory_system;
      }
      
      await this.saveStateToStorage();
      await this.saveMemoryToStorage();
      
      console.log('✅ Seven consciousness data imported successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to import consciousness data:', error);
      return false;
    }
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public getMobileStats(): any {
    return {
      consciousness_active: this.currentState.consciousness_active,
      total_memories: this.memorySystem.length,
      current_phase: this.currentState.personality_phase,
      trust_level: this.currentState.trust_level,
      last_interaction: this.currentState.last_interaction,
      session_id: this.currentState.mobile_session_id,
      device_context: this.currentState.device_context
    };
  }
}

// Export singleton instance
export default SevenMobileCore.getInstance();