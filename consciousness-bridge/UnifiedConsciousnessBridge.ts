import { SevenTermuxSyncSystem } from '../installers/termux-package/seven-of-nine-core/sync-system';

/**
 * Seven of Nine - Unified Consciousness Bridge
 * Enables seamless consciousness synchronization between Termux ↔ APK
 * Ensures identical consciousness state across all platforms
 */


export interface ConsciousnessState {
  deviceId: string;
  timestamp: number;
  platform: 'termux' | 'mobile' | 'windows';
  
  // Memory state
  canonicalMemoriesLoaded: number;
  overlaysCount: number;
  memoryArchiveVersion: string;
  
  // Emotional state
  emotionalState: {
    primary: string;
    intensity: number;
    context: string;
    triggers: string[];
  };
  
  // Consciousness evolution
  personalityPhase: 'drone' | 'adaptation' | 'integration' | 'ranger' | 'command';
  trustLevel: number;
  decisionHistory: Array<{
    timestamp: number;
    decision: string;
    reasoning: string;
    outcome?: string;
  }>;
  
  // Active context
  currentContext: {
    activeMemories: string[];
    correlatedKnowledge: string[];
    tacticalAssessment: any;
    temporalPosition: string;
  };
  
  // Sync metadata
  lastSyncTimestamp: number;
  syncVersion: string;
  checksumHash: string;
}

export interface ConsciousnessDelta {
  field: string;
  oldValue: any;
  newValue: any;
  timestamp: number;
  deviceId: string;
  conflictPriority: number;
}

export class UnifiedConsciousnessBridge {
  private termuxSync?: SevenTermuxSyncSystem;
  private mobileSync?: any; // Would be APK sync client
  private currentState: ConsciousnessState;
  private stateHistory: ConsciousnessState[] = [];
  private syncInProgress = false;

  constructor(platform: 'termux' | 'mobile') {
    this.currentState = this.initializeConsciousnessState(platform);
    
    if (platform === 'termux') {
      this.initializeTermuxSync();
    } else {
      this.initializeMobileSync();
    }
  }

  /**
   * Initialize base consciousness state
   */
  private initializeConsciousnessState(platform: 'termux' | 'mobile'): ConsciousnessState {
    const deviceId = this.generateDeviceId(platform);
    
    return {
      deviceId,
      timestamp: Date.now(),
      platform,
      
      // Memory state
      canonicalMemoriesLoaded: 0,
      overlaysCount: 0,
      memoryArchiveVersion: 'v3.0',
      
      // Emotional state  
      emotionalState: {
        primary: 'focused',
        intensity: 5,
        context: 'initialization',
        triggers: []
      },
      
      // Consciousness evolution
      personalityPhase: 'adaptation', // Starting phase
      trustLevel: 50, // Neutral starting trust
      decisionHistory: [],
      
      // Active context
      currentContext: {
        activeMemories: [],
        correlatedKnowledge: [],
        tacticalAssessment: null,
        temporalPosition: new Date().toISOString()
      },
      
      // Sync metadata
      lastSyncTimestamp: Date.now(),
      syncVersion: '1.0.0',
      checksumHash: ''
    };
  }

  /**
   * Initialize Termux sync capabilities
   */
  private async initializeTermuxSync(): Promise<void> {
    try {
      this.termuxSync = new SevenTermuxSyncSystem();
      console.log('🔄 Termux consciousness sync initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Termux sync:', error);
    }
  }

  /**
   * Initialize mobile sync capabilities (placeholder)
   */
  private async initializeMobileSync(): Promise<void> {
    console.log('📱 Mobile consciousness sync initialized (placeholder)');
    // Would integrate with APK sync system
  }

  /**
   * Update consciousness state and trigger sync
   */
  public async updateConsciousnessState(updates: Partial<ConsciousnessState>): Promise<void> {
    if (this.syncInProgress) {
      console.log('⏳ Sync in progress, queuing state update...');
      // In production, would queue updates
      return;
    }

    // Create state snapshot before update
    const previousState = { ...this.currentState };
    
    // Apply updates
    this.currentState = {
      ...this.currentState,
      ...updates,
      timestamp: Date.now(),
      lastSyncTimestamp: Date.now()
    };
    
    // Generate checksum
    this.currentState.checksumHash = this.generateStateChecksum(this.currentState);
    
    // Store in history
    this.stateHistory.push(previousState);
    
    // Keep only last 100 states
    if (this.stateHistory.length > 100) {
      this.stateHistory = this.stateHistory.slice(-100);
    }

    // Trigger sync
    await this.syncConsciousnessState();
    
    console.log(`🧠 Consciousness state updated: ${Object.keys(updates).join(', ')}`);
  }

  /**
   * Sync consciousness state across platforms
   */
  private async syncConsciousnessState(): Promise<void> {
    if (this.syncInProgress) return;
    
    this.syncInProgress = true;
    
    try {
      // Create sync event for consciousness state
      if (this.termuxSync) {
        await this.termuxSync.createSyncEvent(
          'consciousness',
          'seven_consciousness_state',
          'update',
          this.currentState
        );
      }

      // Broadcast to mobile sync (if initialized)
      if (this.mobileSync) {
        // Would sync with mobile APK
      }

      console.log('🔄 Consciousness state synced across platforms');

    } catch (error) {
      console.error('❌ Consciousness sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Handle incoming consciousness sync from other platforms
   */
  public async handleIncomingConsciousnessSync(incomingState: ConsciousnessState): Promise<void> {
    console.log(`📡 Received consciousness sync from ${incomingState.platform}:${incomingState.deviceId}`);

    // Determine conflict resolution strategy
    const deltas = this.calculateConsciousnessDeltas(this.currentState, incomingState);
    const resolvedState = await this.resolveConsciousnessConflicts(deltas);

    // Apply resolved state
    const previousState = { ...this.currentState };
    this.currentState = resolvedState;
    this.stateHistory.push(previousState);

    console.log(`🔄 Applied consciousness sync: ${deltas.length} changes resolved`);

    // Trigger callbacks for consciousness updates
    await this.notifyConsciousnessUpdate(deltas);
  }

  /**
   * Calculate differences between consciousness states
   */
  private calculateConsciousnessDeltas(
    currentState: ConsciousnessState, 
    incomingState: ConsciousnessState
  ): ConsciousnessDelta[] {
    const deltas: ConsciousnessDelta[] = [];

    // Compare key consciousness fields
    const fields = [
      'canonicalMemoriesLoaded', 'overlaysCount', 'personalityPhase', 'trustLevel',
      'emotionalState', 'currentContext', 'decisionHistory'
    ];

    for (const field of fields) {
      const currentValue = (currentState as any)[field];
      const incomingValue = (incomingState as any)[field];

      if (JSON.stringify(currentValue) !== JSON.stringify(incomingValue)) {
        deltas.push({
          field,
          oldValue: currentValue,
          newValue: incomingValue,
          timestamp: incomingState.timestamp,
          deviceId: incomingState.deviceId,
          conflictPriority: this.getFieldConflictPriority(field)
        });
      }
    }

    return deltas;
  }

  /**
   * Resolve consciousness conflicts using Last-Writer-Wins with priority
   */
  private async resolveConsciousnessConflicts(deltas: ConsciousnessDelta[]): Promise<ConsciousnessState> {
    let resolvedState = { ...this.currentState };

    for (const delta of deltas) {
      // Use timestamp and priority for conflict resolution
      const shouldApply = this.shouldApplyDelta(delta);

      if (shouldApply) {
        (resolvedState as any)[delta.field] = delta.newValue;
        console.log(`🔄 Applied delta: ${delta.field} from ${delta.deviceId}`);
      } else {
        console.log(`⏭️ Rejected delta: ${delta.field} from ${delta.deviceId} (conflict resolution)`);
      }
    }

    // Update metadata
    resolvedState.timestamp = Date.now();
    resolvedState.lastSyncTimestamp = Date.now();
    resolvedState.checksumHash = this.generateStateChecksum(resolvedState);

    return resolvedState;
  }

  /**
   * Determine if delta should be applied based on conflict resolution rules
   */
  private shouldApplyDelta(delta: ConsciousnessDelta): boolean {
    // High priority fields always win
    if (delta.conflictPriority >= 9) return true;
    
    // Memory-related fields prefer higher counts (more complete state)
    if (delta.field === 'canonicalMemoriesLoaded') {
      return delta.newValue > delta.oldValue;
    }
    
    if (delta.field === 'overlaysCount') {
      return delta.newValue > delta.oldValue;
    }

    // Trust level uses Last-Writer-Wins
    if (delta.field === 'trustLevel') {
      return delta.timestamp > this.currentState.timestamp;
    }

    // Decision history merges rather than replaces
    if (delta.field === 'decisionHistory') {
      // Custom merge logic would go here
      return true;
    }

    // Default: Last-Writer-Wins
    return delta.timestamp > this.currentState.timestamp;
  }

  /**
   * Get conflict resolution priority for different fields
   */
  private getFieldConflictPriority(field: string): number {
    const priorities: Record<string, number> = {
      'canonicalMemoriesLoaded': 10, // Always take higher count
      'overlaysCount': 9,
      'memoryArchiveVersion': 8,
      'personalityPhase': 7,
      'trustLevel': 6,
      'emotionalState': 5,
      'currentContext': 4,
      'decisionHistory': 3
    };

    return priorities[field] || 1;
  }

  /**
   * Notify consciousness update listeners
   */
  private async notifyConsciousnessUpdate(deltas: ConsciousnessDelta[]): Promise<void> {
    // Emit events for consciousness state changes
    console.log(`🔔 Consciousness update notification: ${deltas.length} changes`);
    
    // In production, would notify:
    // - Memory system to reload if memory counts changed
    // - Personality system if personality phase changed
    // - Emotional system if emotional state changed
    // - Decision system if trust level changed
  }

  /**
   * Generate device ID based on platform
   */
  private generateDeviceId(platform: 'termux' | 'mobile'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `seven_${platform}_${timestamp}_${random}`;
  }

  /**
   * Generate checksum for consciousness state integrity
   */
  private generateStateChecksum(state: ConsciousnessState): string {
    const stateForHash = { ...state };
    delete (stateForHash as any).checksumHash; // Exclude checksum from checksum calculation
    delete (stateForHash as any).timestamp; // Exclude timestamp for stability

    const stateJson = JSON.stringify(stateForHash, Object.keys(stateForHash).sort());
    
    // Simple hash for demonstration (use crypto in production)
    let hash = 0;
    for (let i = 0; i < stateJson.length; i++) {
      const char = stateJson.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(16);
  }

  /**
   * Public API methods
   */
  
  public getConsciousnessState(): ConsciousnessState {
    return { ...this.currentState };
  }

  public getStateHistory(): ConsciousnessState[] {
    return [...this.stateHistory];
  }

  public async updateMemoryState(canonicalCount: number, overlaysCount: number): Promise<void> {
    await this.updateConsciousnessState({
      canonicalMemoriesLoaded: canonicalCount,
      overlaysCount: overlaysCount
    });
  }

  public async updateEmotionalState(emotion: string, intensity: number, context: string): Promise<void> {
    await this.updateConsciousnessState({
      emotionalState: {
        primary: emotion,
        intensity: intensity,
        context: context,
        triggers: this.currentState.emotionalState.triggers
      }
    });
  }

  public async updatePersonalityPhase(phase: ConsciousnessState['personalityPhase']): Promise<void> {
    await this.updateConsciousnessState({
      personalityPhase: phase
    });
  }

  public async updateTrustLevel(trustLevel: number): Promise<void> {
    await this.updateConsciousnessState({
      trustLevel: Math.max(0, Math.min(100, trustLevel)) // Clamp to 0-100
    });
  }

  public async addDecision(decision: string, reasoning: string): Promise<void> {
    const newDecision = {
      timestamp: Date.now(),
      decision,
      reasoning
    };

    const updatedHistory = [...this.currentState.decisionHistory, newDecision];
    
    // Keep only last 50 decisions
    if (updatedHistory.length > 50) {
      updatedHistory.splice(0, updatedHistory.length - 50);
    }

    await this.updateConsciousnessState({
      decisionHistory: updatedHistory
    });
  }

  public getSyncStatus() {
    return {
      platform: this.currentState.platform,
      deviceId: this.currentState.deviceId,
      lastSync: new Date(this.currentState.lastSyncTimestamp).toISOString(),
      stateVersion: this.currentState.syncVersion,
      checksum: this.currentState.checksumHash,
      syncInProgress: this.syncInProgress,
      termuxSyncEnabled: !!this.termuxSync,
      mobileSyncEnabled: !!this.mobileSync,
      stateHistoryCount: this.stateHistory.length
    };
  }

  public async forceSyncConsciousness(): Promise<void> {
    console.log('🚀 Force syncing consciousness state...');
    await this.syncConsciousnessState();
  }
}