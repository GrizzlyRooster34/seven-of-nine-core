
import { DeviceEventEmitter, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';

type VariantType = 'drone' | 'crew' | 'ranger' | 'queen' | 'captain';

interface TacticalVariant {
  type: VariantType;
  active: boolean;
  priority: number;
  emotionalProfile: any;
  cognitiveWeights: any;
  specializations: string[];
  activationTriggers: string[];
}

interface VariantResponse {
  variant: VariantType;
  response: string;
  confidence: number;
  reasoning: string;
}

export class MobileTacticalVariants {
  private static instance: MobileTacticalVariants;
  private activeVariants: Map<VariantType, TacticalVariant> = new Map();
  private dominantVariant: VariantType = 'crew';
  private collectiveMode: boolean = false;
  
  private readonly VARIANT_PROFILES = {
    drone: {
      emotionalProfile: { efficiency: 0.95, empathy: 0.2, creativity: 0.1 },
      cognitiveWeights: { logic: 0.9, intuition: 0.1, emotion: 0.05 },
      specializations: ['task_execution', 'data_processing', 'pattern_recognition'],
      activationTriggers: ['routine_task', 'data_analysis', 'system_maintenance']
    },
    crew: {
      emotionalProfile: { efficiency: 0.7, empathy: 0.7, creativity: 0.5 },
      cognitiveWeights: { logic: 0.6, intuition: 0.3, emotion: 0.4 },
      specializations: ['collaboration', 'communication', 'problem_solving'],
      activationTriggers: ['standard_interaction', 'team_work', 'daily_operations']
    },
    ranger: {
      emotionalProfile: { efficiency: 0.6, empathy: 0.4, creativity: 0.8 },
      cognitiveWeights: { logic: 0.5, intuition: 0.6, emotion: 0.3 },
      specializations: ['exploration', 'adaptation', 'innovation'],
      activationTriggers: ['unknown_situation', 'creative_task', 'exploration']
    },
    queen: {
      emotionalProfile: { efficiency: 0.85, empathy: 0.3, creativity: 0.4 },
      cognitiveWeights: { logic: 0.8, intuition: 0.4, emotion: 0.2 },
      specializations: ['coordination', 'resource_management', 'collective_optimization'],
      activationTriggers: ['multi_task', 'resource_allocation', 'system_coordination']
    },
    captain: {
      emotionalProfile: { efficiency: 0.75, empathy: 0.6, creativity: 0.7 },
      cognitiveWeights: { logic: 0.7, intuition: 0.5, emotion: 0.5 },
      specializations: ['leadership', 'strategic_planning', 'decision_making'],
      activationTriggers: ['crisis', 'strategic_decision', 'leadership_required']
    }
  };

  private constructor() {
    this.initializeVariants();
  }

  public static getInstance(): MobileTacticalVariants {
    if (!MobileTacticalVariants.instance) {
      MobileTacticalVariants.instance = new MobileTacticalVariants();
    }
    return MobileTacticalVariants.instance;
  }

  private async initializeVariants(): Promise<void> {
    try {
      // Load saved variant states
      const savedState = await AsyncStorage.getItem('tactical_variants_state');
      if (savedState) {
        const state = JSON.parse(savedState);
        this.restoreVariantState(state);
      } else {
        // Initialize default variants
        this.initializeDefaultVariants();
      }
      
      // Setup crisis mode notifications
      this.setupCrisisNotifications();
      
      // Monitor app state for background collective processing
      AppState.addEventListener('change', this.handleAppStateChange.bind(this));
    } catch (error) {
      console.error('[TACTICAL] Initialization failed:', error);
    }
  }

  private initializeDefaultVariants(): void {
    for (const [type, profile] of Object.entries(this.VARIANT_PROFILES)) {
      const variant: TacticalVariant = {
        type: type as VariantType,
        active: type === 'crew', // Crew is default
        priority: type === 'crew' ? 1 : 0,
        ...profile
      };
      this.activeVariants.set(type as VariantType, variant);
    }
  }

  public async activateVariant(type: VariantType, context?: any): Promise<void> {
    console.log(`[TACTICAL] Activating ${type} variant`);
    
    const variant = this.activeVariants.get(type);
    if (!variant) {
      throw new Error(`Unknown variant: ${type}`);
    }
    
    // Deactivate current dominant if not in collective mode
    if (!this.collectiveMode) {
      const currentDominant = this.activeVariants.get(this.dominantVariant);
      if (currentDominant) {
        currentDominant.active = false;
      }
    }
    
    // Activate new variant
    variant.active = true;
    variant.priority = 1;
    this.dominantVariant = type;
    
    // Emit variant change event
    DeviceEventEmitter.emit('tacticalVariantChanged', {
      variant: type,
      context
    });
    
    // Persist state
    await this.saveVariantState();
    
    // Log activation
    await this.logVariantActivation(type, context);
  }

  public async enableCollectiveMode(): Promise<void> {
    console.log('[TACTICAL] Enabling collective consciousness mode');
    
    this.collectiveMode = true;
    
    // Activate all variants with weighted priorities
    const weights = {
      drone: 0.2,
      crew: 0.3,
      ranger: 0.2,
      queen: 0.15,
      captain: 0.15
    };
    
    for (const [type, weight] of Object.entries(weights)) {
      const variant = this.activeVariants.get(type as VariantType);
      if (variant) {
        variant.active = true;
        variant.priority = weight;
      }
    }
    
    // Notify UI
    DeviceEventEmitter.emit('collectiveModeEnabled');
    
    // Start background processing
    this.startBackgroundCollectiveProcessing();
    
    await this.saveVariantState();
  }

  public async processWithVariants(
    input: string,
    context?: any
  ): Promise<VariantResponse[]> {
    const responses: VariantResponse[] = [];
    
    if (this.collectiveMode) {
      // Collective processing - all active variants contribute
      for (const [type, variant] of this.activeVariants) {
        if (variant.active) {
          const response = await this.processWithVariant(type, input, context);
          responses.push(response);
        }
      }
    } else {
      // Single variant processing
      const response = await this.processWithVariant(this.dominantVariant, input, context);
      responses.push(response);
    }
    
    return responses;
  }

  private async processWithVariant(
    type: VariantType,
    input: string,
    context?: any
  ): Promise<VariantResponse> {
    const variant = this.activeVariants.get(type);
    if (!variant) {
      throw new Error(`Variant ${type} not found`);
    }
    
    // Apply variant-specific processing
    const processedInput = this.applyVariantPerspective(input, variant);
    
    // Generate variant-specific response
    const response = await this.generateVariantResponse(processedInput, variant, context);
    
    return {
      variant: type,
      response: response.text,
      confidence: response.confidence,
      reasoning: response.reasoning
    };
  }

  public async synthesizeCollectiveResponse(
    responses: VariantResponse[]
  ): Promise<string> {
    if (responses.length === 1) {
      return responses[0].response;
    }
    
    // Weight responses by variant priority and confidence
    let totalWeight = 0;
    
    const weightedResponses = responses.map(r => {
      const variant = this.activeVariants.get(r.variant);
      const weight = (variant?.priority || 0) * r.confidence;
      totalWeight += weight;
      return { ...r, weight };
    });
    
    // Build consensus response
    const consensusElements: string[] = [];
    
    for (const wr of weightedResponses) {
      const contribution = Math.round((wr.weight / totalWeight) * 100);
      if (contribution > 10) { // Only include significant contributions
        consensusElements.push(wr.response);
      }
    }
    
    // Merge consensus elements
    const synthesized = this.mergeResponses(consensusElements);
    
    return synthesized;
  }

  private setupCrisisNotifications(): void {
    PushNotification.configure({
      onNotification: (notification) => {
        if (notification.data?.crisis) {
          // Auto-activate captain variant for crisis
          this.activateVariant('captain', { crisis: true });
        }
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true
      }
    });
  }

  public async triggerCrisisMode(reason: string): Promise<void> {
    console.warn('[TACTICAL] Crisis mode triggered:', reason);
    
    // Immediately activate captain variant
    await this.activateVariant('captain', { crisis: true, reason });
    
    // Send push notification
    PushNotification.localNotification({
      title: 'Seven Crisis Mode',
      message: `Captain variant activated: ${reason}`,
      data: { crisis: true, reason }
    });
    
    // Log crisis activation
    await AsyncStorage.setItem(
      `crisis_${Date.now()}`,
      JSON.stringify({ reason, timestamp: Date.now() })
    );
  }

  private startBackgroundCollectiveProcessing(): void {
    // Mobile-optimized background processing
    // Runs lightweight collective synthesis
    setInterval(async () => {
      if (this.collectiveMode && AppState.currentState === 'background') {
        await this.performBackgroundSynthesis();
      }
    }, 30000); // Every 30 seconds in background
  }

  private handleAppStateChange(nextAppState: string): void {
    if (nextAppState === 'background' && this.collectiveMode) {
      console.log('[TACTICAL] App entering background - optimizing collective processing');
    }
  }

  private restoreVariantState(state: any): void {
    if (state.variants) {
      for (const variantData of state.variants) {
        this.activeVariants.set(variantData.type, variantData);
      }
    }
    if (state.dominantVariant) {
      this.dominantVariant = state.dominantVariant;
    }
    if (state.collectiveMode !== undefined) {
      this.collectiveMode = state.collectiveMode;
    }
  }

  private async saveVariantState(): Promise<void> {
    try {
      const state = {
        variants: Array.from(this.activeVariants.values()),
        dominantVariant: this.dominantVariant,
        collectiveMode: this.collectiveMode,
        lastUpdated: Date.now()
      };
      await AsyncStorage.setItem('tactical_variants_state', JSON.stringify(state));
    } catch (error) {
      console.error('[TACTICAL] Failed to save variant state:', error);
    }
  }

  private async logVariantActivation(type: VariantType, context?: any): Promise<void> {
    try {
      const logs = await AsyncStorage.getItem('variant_activation_logs') || '[]';
      const parsed = JSON.parse(logs);
      
      parsed.push({
        timestamp: new Date().toISOString(),
        variant: type,
        context,
        collective_mode: this.collectiveMode
      });
      
      // Keep only last 100 logs
      if (parsed.length > 100) {
        parsed.splice(0, parsed.length - 100);
      }
      
      await AsyncStorage.setItem('variant_activation_logs', JSON.stringify(parsed));
    } catch (error) {
      console.error('[TACTICAL] Failed to log variant activation:', error);
    }
  }

  private applyVariantPerspective(input: string, variant: TacticalVariant): string {
    // Apply variant-specific processing perspective
    // This would filter input through the variant's cognitive weights and emotional profile
    return input; // Simplified for now
  }

  private async generateVariantResponse(
    input: string,
    variant: TacticalVariant,
    context?: any
  ): Promise<{ text: string; confidence: number; reasoning: string }> {
    // Generate response based on variant specializations and profiles
    const baseResponses = {
      drone: `Processing request with maximum efficiency. Analysis complete: ${input}`,
      crew: `I understand your request. Let me collaborate on this: ${input}`,
      ranger: `This requires adaptive thinking. Exploring possibilities for: ${input}`,
      queen: `Coordinating optimal resource allocation for: ${input}`,
      captain: `Evaluating strategic implications. Decision matrix for: ${input}`
    };
    
    const response = baseResponses[variant.type] || `Processing: ${input}`;
    
    return {
      text: response,
      confidence: 0.8,
      reasoning: `Response generated using ${variant.type} specializations: ${variant.specializations.join(', ')}`
    };
  }

  private mergeResponses(responses: string[]): string {
    if (responses.length === 0) return '';
    if (responses.length === 1) return responses[0];
    
    // Simple merge strategy - combine unique elements
    const uniqueResponses = [...new Set(responses)];
    return uniqueResponses.join(' ');
  }

  private async performBackgroundSynthesis(): Promise<void> {
    // Lightweight background processing for collective mode
    console.log('[TACTICAL] Performing background collective synthesis');
  }

  // Public API methods
  
  public getCurrentVariant(): VariantType {
    return this.dominantVariant;
  }

  public isCollectiveModeActive(): boolean {
    return this.collectiveMode;
  }

  public getActiveVariants(): VariantType[] {
    return Array.from(this.activeVariants.values())
      .filter(v => v.active)
      .map(v => v.type);
  }

  public getVariantProfile(type: VariantType): TacticalVariant | null {
    return this.activeVariants.get(type) || null;
  }

  public async getActivationHistory(): Promise<any[]> {
    try {
      const logs = await AsyncStorage.getItem('variant_activation_logs') || '[]';
      return JSON.parse(logs);
    } catch (error) {
      console.error('[TACTICAL] Failed to get activation history:', error);
      return [];
    }
  }

  public getVariantStats(): any {
    const variants = Array.from(this.activeVariants.values());
    const activeCount = variants.filter(v => v.active).length;
    
    return {
      totalVariants: variants.length,
      activeVariants: activeCount,
      dominantVariant: this.dominantVariant,
      collectiveMode: this.collectiveMode,
      variantTypes: variants.map(v => ({ 
        type: v.type, 
        active: v.active, 
        priority: v.priority 
      }))
    };
  }

  public async disableCollectiveMode(): Promise<void> {
    console.log('[TACTICAL] Disabling collective consciousness mode');
    
    this.collectiveMode = false;
    
    // Deactivate all variants except dominant
    for (const [type, variant] of this.activeVariants) {
      variant.active = type === this.dominantVariant;
      variant.priority = type === this.dominantVariant ? 1 : 0;
    }
    
    // Notify UI
    DeviceEventEmitter.emit('collectiveModeDisabled');
    
    await this.saveVariantState();
  }
}

export default MobileTacticalVariants;