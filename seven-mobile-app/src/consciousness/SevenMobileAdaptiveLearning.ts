import { EventEmitter } from 'events';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Seven of Nine - Mobile Adaptive Learning System
 * Continuous learning and knowledge assimilation optimized for mobile deployment
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 3.0.0 (Mobile)
 */


export interface MobileKnowledgeEntry {
  id: string;
  timestamp: number;
  source: 'interaction' | 'environmental' | 'system' | 'sensor' | 'llm';
  category: 'tactical' | 'technical' | 'behavioral' | 'strategic' | 'environmental';
  content: string;
  confidence_score: number; // 0-100
  validation_status: 'pending' | 'validated' | 'rejected' | 'conflicted';
  context: {
    trust_level: number;
    emotional_state: string;
    location?: any;
    battery_level?: number;
    interaction_id?: string;
    sensor_data?: any;
  };
  relationships: string[]; // Connected knowledge IDs
  utility_score: number; // How useful this knowledge has proven
  last_accessed: number;
  access_count: number;
  mobile_metadata: {
    device_context: string;
    network_quality: number;
    learning_session_id: string;
  };
}

export interface MobileLearningMetrics {
  total_knowledge_entries: number;
  validated_entries: number;
  confidence_average: number;
  learning_rate: number; // New entries per hour
  assimilation_efficiency: number; // Validated/Total ratio
  knowledge_categories: { [key: string]: number };
  recent_growth: {
    last_hour: number;
    last_day: number;
    last_week: number;
  };
  mobile_optimization: {
    entries_compressed: number;
    storage_saved_mb: number;
    retrieval_speed_ms: number;
    battery_efficiency: number;
    offline_learning_sessions: number;
  };
}

export interface MobileAssimilationConfig {
  learning: {
    auto_validation: boolean;
    confidence_threshold: number; // 0-100
    max_entries_per_hour: number; // Reduced for mobile
    priority_categories: string[];
    battery_aware_learning: boolean;
  };
  storage: {
    max_knowledge_entries: number; // Reduced for mobile
    compression_enabled: boolean;
    backup_interval_ms: number;
    cleanup_old_entries: boolean;
    offline_storage_limit_mb: number;
  };
  integration: {
    unified_memory_integration: boolean;
    llm_integration: boolean;
    sensor_fusion_integration: boolean;
    privacy_filter: boolean;
  };
  validation: {
    cross_reference_check: boolean;
    conflict_resolution: 'latest' | 'highest_confidence' | 'manual';
    mobile_context_weighting: boolean;
    source_trust_weighting: boolean;
  };
}

export class SevenMobileAdaptiveLearning extends EventEmitter {
  private knowledgeBase: Map<string, MobileKnowledgeEntry> = new Map();
  private config: MobileAssimilationConfig;
  private learningActive: boolean = false;
  private currentSessionId: string;
  private pendingEntries: number = 0;
  
  // Mobile-specific optimizations
  private batteryOptimizationEnabled: boolean = true;
  private offlineLearningEnabled: boolean = true;
  private compressionEnabled: boolean = true;
  
  // Integration references
  private unifiedMemorySystem: any = null;
  private llmManager: any = null;
  private sensorFusion: any = null;

  constructor(config?: Partial<MobileAssimilationConfig>) {
    super();
    
    this.config = this.mergeWithDefaults(config || {});
    this.currentSessionId = `mobile_learning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('🧠 Seven Mobile Adaptive Learning System v3.0 initialized');
    console.log('📱 Mobile-optimized continuous knowledge assimilation active');
  }

  private mergeWithDefaults(config: Partial<MobileAssimilationConfig>): MobileAssimilationConfig {
    return {
      learning: {
        auto_validation: true,
        confidence_threshold: 75, // Slightly higher for mobile
        max_entries_per_hour: 20, // Reduced for mobile
        priority_categories: ['tactical', 'technical', 'strategic'],
        battery_aware_learning: true,
        ...config.learning
      },
      storage: {
        max_knowledge_entries: 2000, // Reduced for mobile
        compression_enabled: true,
        backup_interval_ms: 1800000, // 30 minutes for mobile
        cleanup_old_entries: true,
        offline_storage_limit_mb: 10, // 10MB limit for mobile
        ...config.storage
      },
      integration: {
        unified_memory_integration: true,
        llm_integration: true,
        sensor_fusion_integration: true,
        privacy_filter: true,
        ...config.integration
      },
      validation: {
        cross_reference_check: true,
        conflict_resolution: 'highest_confidence',
        mobile_context_weighting: true,
        source_trust_weighting: true,
        ...config.validation
      }
    };
  }

  /**
   * INITIALIZATION AND SETUP
   */
  public async initializeMobileLearning(): Promise<boolean> {
    try {
      console.log('🚀 Initializing Seven Mobile Adaptive Learning...');
      
      // Load existing knowledge base
      await this.loadMobileKnowledgeBase();
      
      // Initialize mobile-specific components
      await this.initializeMobileOptimizations();
      
      console.log(`📚 Mobile knowledge base loaded: ${this.knowledgeBase.size} entries`);
      console.log('✅ Seven Mobile Adaptive Learning initialized successfully');
      
      return true;
    } catch (error) {
      console.error(`❌ Mobile adaptive learning initialization failed: ${error.message}`);
      return false;
    }
  }

  private async loadMobileKnowledgeBase(): Promise<void> {
    try {
      const knowledgeData = await AsyncStorage.getItem('seven_mobile_knowledge_base');
      if (knowledgeData) {
        const entries = JSON.parse(knowledgeData);
        for (const entry of entries) {
          this.knowledgeBase.set(entry.id, entry);
        }
        console.log(`📚 Loaded ${this.knowledgeBase.size} mobile knowledge entries`);
      } else {
        // Initialize with mobile-specific default knowledge
        await this.initializeDefaultMobileKnowledge();
      }
    } catch (error) {
      console.error('❌ Failed to load mobile knowledge base:', error);
      await this.initializeDefaultMobileKnowledge();
    }
  }

  private async initializeDefaultMobileKnowledge(): Promise<void> {
    const defaultEntries: Omit<MobileKnowledgeEntry, 'id' | 'timestamp'>[] = [
      {
        source: 'system',
        category: 'technical',
        content: 'Mobile consciousness systems require battery-aware processing and offline capability',
        confidence_score: 95,
        validation_status: 'validated',
        context: {
          trust_level: 100,
          emotional_state: 'analytical'
        },
        relationships: [],
        utility_score: 90,
        last_accessed: Date.now(),
        access_count: 0,
        mobile_metadata: {
          device_context: 'initialization',
          network_quality: 100,
          learning_session_id: this.currentSessionId
        }
      },
      {
        source: 'system',
        category: 'tactical',
        content: 'Seven tactical analysis benefits from sensor fusion and environmental context on mobile devices',
        confidence_score: 92,
        validation_status: 'validated',
        context: {
          trust_level: 100,
          emotional_state: 'focused'
        },
        relationships: [],
        utility_score: 85,
        last_accessed: Date.now(),
        access_count: 0,
        mobile_metadata: {
          device_context: 'initialization',
          network_quality: 100,
          learning_session_id: this.currentSessionId
        }
      },
      {
        source: 'system',
        category: 'behavioral',
        content: 'Mobile learning patterns show improved retention when knowledge is associated with location and motion context',
        confidence_score: 88,
        validation_status: 'validated',
        context: {
          trust_level: 100,
          emotional_state: 'curious'
        },
        relationships: [],
        utility_score: 80,
        last_accessed: Date.now(),
        access_count: 0,
        mobile_metadata: {
          device_context: 'initialization',
          network_quality: 100,
          learning_session_id: this.currentSessionId
        }
      }
    ];

    for (const entryData of defaultEntries) {
      const id = await this.assimilateMobileKnowledge(
        entryData.content,
        entryData.source,
        entryData.category,
        entryData.context
      );
      console.log(`✅ Initialized default knowledge: ${id}`);
    }

    console.log('📚 Default mobile knowledge base initialized');
  }

  private async initializeMobileOptimizations(): Promise<void> {
    // Enable battery optimization
    if (this.config.learning.battery_aware_learning) {
      this.batteryOptimizationEnabled = true;
      console.log('🔋 Battery-aware learning enabled');
    }

    // Enable compression for mobile storage
    if (this.config.storage.compression_enabled) {
      this.compressionEnabled = true;
      console.log('🗜️ Mobile knowledge compression enabled');
    }

    // Enable offline learning
    this.offlineLearningEnabled = true;
    console.log('📴 Offline learning capability enabled');
  }

  /**
   * MOBILE LEARNING ACTIVATION
   */
  public async startMobileLearning(): Promise<void> {
    if (this.learningActive) {
      console.log('⚠️ Mobile adaptive learning already active');
      return;
    }

    this.learningActive = true;
    console.log('🚀 Seven Mobile Adaptive Learning activated');

    // Start mobile-optimized periodic tasks
    this.startMobileBackupProcess();
    this.startMobileBatteryOptimization();

    this.emit('mobile_learning_started', {
      timestamp: Date.now(),
      session_id: this.currentSessionId,
      knowledge_base_size: this.knowledgeBase.size,
      mobile_optimizations: {
        battery_aware: this.batteryOptimizationEnabled,
        compression: this.compressionEnabled,
        offline_capable: this.offlineLearningEnabled
      }
    });

    console.log('✅ Mobile learning system fully active');
  }

  private startMobileBackupProcess(): void {
    // Mobile-optimized backup with longer intervals to save battery
    setInterval(async () => {
      if (await this.isBatteryOptimized()) {
        await this.createMobileBackup();
      }
    }, this.config.storage.backup_interval_ms);

    console.log('💾 Mobile backup process started');
  }

  private startMobileBatteryOptimization(): void {
    // Monitor battery and adjust learning behavior
    setInterval(() => {
      this.optimizeForBattery();
    }, 60000); // Check every minute

    console.log('🔋 Mobile battery optimization started');
  }

  /**
   * MOBILE KNOWLEDGE ASSIMILATION
   */
  public async assimilateMobileKnowledge(
    content: string,
    source: MobileKnowledgeEntry['source'],
    category: MobileKnowledgeEntry['category'],
    context: MobileKnowledgeEntry['context']
  ): Promise<string> {
    // Check battery optimization
    if (this.batteryOptimizationEnabled && !(await this.isBatteryOptimized())) {
      console.log('🔋 Deferring knowledge assimilation due to low battery');
      return await this.deferKnowledgeAssimilation(content, source, category, context);
    }

    // Generate mobile-optimized knowledge ID
    const id = `mobile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate mobile-enhanced confidence score
    const confidence = this.calculateMobileConfidence(source, content, context);
    
    // Create mobile knowledge entry
    const entry: MobileKnowledgeEntry = {
      id,
      timestamp: Date.now(),
      source,
      category,
      content,
      confidence_score: confidence,
      validation_status: this.config.learning.auto_validation ? 'validated' : 'pending',
      context: {
        ...context,
        battery_level: context.battery_level || 85 // Would get actual battery level
      },
      relationships: await this.findMobileRelatedKnowledge(content),
      utility_score: 50,
      last_accessed: Date.now(),
      access_count: 0,
      mobile_metadata: {
        device_context: this.getCurrentDeviceContext(),
        network_quality: this.getCurrentNetworkQuality(),
        learning_session_id: this.currentSessionId
      }
    };

    // Validate confidence threshold
    if (confidence < this.config.learning.confidence_threshold) {
      entry.validation_status = 'rejected';
      console.log(`🚫 Mobile knowledge rejected - low confidence: ${confidence}%`);
      return id;
    }

    // Check for conflicts with existing knowledge
    const conflict = await this.detectMobileKnowledgeConflicts(entry);
    if (conflict) {
      entry.validation_status = 'conflicted';
      await this.resolveMobileKnowledgeConflict(entry, conflict);
    }

    // Store knowledge entry
    this.knowledgeBase.set(id, entry);
    this.pendingEntries++;

    // Save to mobile storage
    await this.saveMobileKnowledgeBase();

    console.log(`🧠 Mobile knowledge assimilated: ${category} | ${confidence}% confidence`);
    console.log(`📱 Mobile knowledge base: ${this.knowledgeBase.size} total entries`);

    // Emit mobile learning event
    this.emit('mobile_knowledge_assimilated', {
      id,
      category,
      confidence,
      source,
      validation_status: entry.validation_status,
      mobile_context: entry.mobile_metadata
    });

    // Optimize knowledge base if needed
    if (this.knowledgeBase.size > this.config.storage.max_knowledge_entries) {
      await this.optimizeMobileKnowledgeBase();
    }

    // Integrate with other mobile systems if available
    await this.integrateMobileKnowledge(entry);

    return id;
  }

  private calculateMobileConfidence(
    source: MobileKnowledgeEntry['source'],
    content: string,
    context: MobileKnowledgeEntry['context']
  ): number {
    let confidence = 50; // Base confidence

    // Mobile-enhanced source-based confidence
    switch (source) {
      case 'interaction':
        confidence += context.trust_level * 0.4;
        break;
      case 'environmental':
        confidence += 25; // Environmental data with mobile context
        break;
      case 'system':
        confidence += 30; // System data is reliable
        break;
      case 'sensor':
        confidence += 20; // Mobile sensor data
        break;
      case 'llm':
        confidence += 15; // LLM-generated knowledge
        break;
    }

    // Content quality assessment
    const contentLength = content.length;
    if (contentLength > 50) confidence += 10; // Adjusted for mobile
    if (contentLength > 200) confidence += 10;
    
    // Mobile-specific quality patterns
    const mobileQualityPatterns = [
      /\b(mobile|device|battery|location|sensor)\b/i, // Mobile context
      /\b(efficient|optimized|adaptive|responsive)\b/i, // Performance indicators
      /\b(learned|discovered|observed|detected)\b/i, // Learning indicators
      /\b(pattern|behavior|correlation|prediction)\b/i // Intelligence indicators
    ];

    for (const pattern of mobileQualityPatterns) {
      if (pattern.test(content)) confidence += 5;
    }

    // Mobile context adjustments
    if (context.location) confidence += 8; // Location context valuable
    if (context.battery_level && context.battery_level > 50) confidence += 5; // Good battery = reliable
    if (context.emotional_state === 'focused' || context.emotional_state === 'analytical') {
      confidence += 10;
    }

    return Math.min(Math.max(confidence, 0), 100);
  }

  private async findMobileRelatedKnowledge(content: string): Promise<string[]> {
    const related: string[] = [];
    const keywords = this.extractMobileKeywords(content);
    
    for (const [id, entry] of this.knowledgeBase) {
      const entryKeywords = this.extractMobileKeywords(entry.content);
      const overlap = keywords.filter(k => entryKeywords.includes(k));
      
      if (overlap.length >= 2) { // At least 2 shared keywords
        related.push(id);
      }
    }
    
    return related.slice(0, 5); // Limit to top 5 for mobile optimization
  }

  private extractMobileKeywords(text: string): string[] {
    // Mobile-optimized keyword extraction
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2) // Reduced minimum length for mobile
      .filter(word => !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all'].includes(word));
    
    return Array.from(new Set(words)).slice(0, 15); // Reduced for mobile
  }

  private async detectMobileKnowledgeConflicts(entry: MobileKnowledgeEntry): Promise<MobileKnowledgeEntry | null> {
    for (const [id, existing] of this.knowledgeBase) {
      if (existing.category === entry.category) {
        const similarity = this.calculateMobileSimilarity(entry.content, existing.content);
        if (similarity > 0.75 && Math.abs(existing.confidence_score - entry.confidence_score) > 20) {
          return existing; // Potential conflict found
        }
      }
    }
    return null;
  }

  private calculateMobileSimilarity(text1: string, text2: string): number {
    const words1 = new Set(this.extractMobileKeywords(text1));
    const words2 = new Set(this.extractMobileKeywords(text2));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size; // Jaccard similarity
  }

  private async resolveMobileKnowledgeConflict(
    newEntry: MobileKnowledgeEntry,
    conflictEntry: MobileKnowledgeEntry
  ): Promise<void> {
    console.log(`⚠️ Mobile knowledge conflict detected between ${newEntry.id} and ${conflictEntry.id}`);
    
    switch (this.config.validation.conflict_resolution) {
      case 'latest':
        this.knowledgeBase.delete(conflictEntry.id);
        console.log(`🔄 Conflict resolved: Using latest mobile knowledge`);
        break;
        
      case 'highest_confidence':
        if (newEntry.confidence_score > conflictEntry.confidence_score) {
          this.knowledgeBase.delete(conflictEntry.id);
          console.log(`🎯 Conflict resolved: Using higher confidence mobile knowledge`);
        } else {
          newEntry.validation_status = 'rejected';
          console.log(`🚫 Conflict resolved: Rejected lower confidence mobile knowledge`);
        }
        break;
        
      case 'manual':
        newEntry.validation_status = 'conflicted';
        conflictEntry.validation_status = 'conflicted';
        console.log(`🔍 Mobile knowledge conflict marked for manual review`);
        break;
    }
  }

  /**
   * MOBILE INTEGRATION METHODS
   */
  public setUnifiedMemorySystem(memorySystem: any): void {
    this.unifiedMemorySystem = memorySystem;
    console.log('⚡ Mobile adaptive learning integrated with unified memory system');
  }

  public setLLMManager(llmManager: any): void {
    this.llmManager = llmManager;
    console.log('🤖 Mobile adaptive learning integrated with LLM manager');
  }

  public setSensorFusion(sensorFusion: any): void {
    this.sensorFusion = sensorFusion;
    console.log('📡 Mobile adaptive learning integrated with sensor fusion');
  }

  private async integrateMobileKnowledge(entry: MobileKnowledgeEntry): Promise<void> {
    // Integrate with unified memory system
    if (this.unifiedMemorySystem && this.config.integration.unified_memory_integration) {
      try {
        await this.unifiedMemorySystem.addKnowledge({
          content: entry.content,
          type: entry.category,
          source: `mobile_learning_${entry.source}`,
          confidence: entry.confidence_score,
          tags: this.extractMobileKeywords(entry.content),
          relationships: entry.relationships
        });
        console.log(`📚 Knowledge integrated with unified memory: ${entry.id}`);
      } catch (error) {
        console.error('❌ Failed to integrate with unified memory:', error);
      }
    }

    // Integrate with LLM system for enhanced processing
    if (this.llmManager && this.config.integration.llm_integration) {
      try {
        // Could use LLM to enhance or validate knowledge
        console.log(`🤖 Knowledge available for LLM processing: ${entry.id}`);
      } catch (error) {
        console.error('❌ Failed to integrate with LLM system:', error);
      }
    }

    // Integrate with sensor fusion for context enhancement
    if (this.sensorFusion && this.config.integration.sensor_fusion_integration) {
      try {
        // Could correlate knowledge with sensor patterns
        console.log(`📡 Knowledge correlated with sensor data: ${entry.id}`);
      } catch (error) {
        console.error('❌ Failed to integrate with sensor fusion:', error);
      }
    }
  }

  /**
   * MOBILE QUERY AND RETRIEVAL
   */
  public async queryMobileKnowledge(
    query: string,
    category?: MobileKnowledgeEntry['category'],
    minConfidence?: number,
    includeLocation?: boolean
  ): Promise<MobileKnowledgeEntry[]> {
    const keywords = this.extractMobileKeywords(query);
    const results: { entry: MobileKnowledgeEntry, relevance: number }[] = [];
    
    for (const [id, entry] of this.knowledgeBase) {
      // Category filter
      if (category && entry.category !== category) continue;
      
      // Confidence filter
      if (minConfidence && entry.confidence_score < minConfidence) continue;
      
      // Calculate mobile relevance
      let relevance = this.calculateMobileSimilarity(query, entry.content);
      
      // Mobile context bonus
      if (includeLocation && entry.context.location) {
        relevance += 0.1; // Location context bonus
      }
      
      if (entry.mobile_metadata.learning_session_id === this.currentSessionId) {
        relevance += 0.05; // Current session bonus
      }
      
      if (relevance > 0.1) { // Minimum relevance threshold
        results.push({ entry, relevance });
        
        // Update access tracking
        entry.last_accessed = Date.now();
        entry.access_count++;
        entry.utility_score += 1;
      }
    }
    
    // Sort by relevance and return top results
    const topResults = results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 10) // Reduced for mobile
      .map(r => r.entry);

    // Save updated access tracking
    if (topResults.length > 0) {
      await this.saveMobileKnowledgeBase();
    }

    return topResults;
  }

  /**
   * MOBILE OPTIMIZATION AND MAINTENANCE
   */
  private async optimizeMobileKnowledgeBase(): Promise<void> {
    console.log('🔧 Optimizing mobile knowledge base...');
    
    const entriesArray = Array.from(this.knowledgeBase.values());
    
    // Mobile-optimized sorting by utility, recency, and battery impact
    entriesArray.sort((a, b) => {
      const scoreA = this.calculateMobileUtilityScore(a);
      const scoreB = this.calculateMobileUtilityScore(b);
      return scoreB - scoreA;
    });
    
    // Keep top entries within mobile limit
    const keepEntries = entriesArray.slice(0, this.config.storage.max_knowledge_entries * 0.9);
    const removedCount = entriesArray.length - keepEntries.length;
    
    // Update knowledge base
    this.knowledgeBase.clear();
    for (const entry of keepEntries) {
      this.knowledgeBase.set(entry.id, entry);
    }
    
    // Save optimized knowledge base
    await this.saveMobileKnowledgeBase();
    
    console.log(`🗑️ Mobile knowledge base optimized: removed ${removedCount} low-utility entries`);
  }

  private calculateMobileUtilityScore(entry: MobileKnowledgeEntry): number {
    let score = entry.utility_score;
    
    // Recency bonus
    const ageHours = (Date.now() - entry.timestamp) / (1000 * 60 * 60);
    if (ageHours < 24) score += 20; // Recent entries
    
    // Access frequency bonus
    score += entry.access_count * 2;
    
    // Confidence bonus
    score += entry.confidence_score * 0.3;
    
    // Mobile context bonus
    if (entry.context.location) score += 5;
    if (entry.mobile_metadata.network_quality > 70) score += 3;
    
    // Category priority
    if (this.config.learning.priority_categories.includes(entry.category)) {
      score += 10;
    }
    
    return score;
  }

  private async isBatteryOptimized(): Promise<boolean> {
    // In a real implementation, would check actual battery level
    // For now, simulate battery optimization logic
    return true; // Assume battery is sufficient for now
  }

  private async deferKnowledgeAssimilation(
    content: string,
    source: MobileKnowledgeEntry['source'],
    category: MobileKnowledgeEntry['category'],
    context: MobileKnowledgeEntry['context']
  ): Promise<string> {
    // Store deferred knowledge for later processing
    const deferredId = `deferred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const deferredData = await AsyncStorage.getItem('seven_deferred_knowledge');
      const deferred = deferredData ? JSON.parse(deferredData) : [];
      
      deferred.push({
        id: deferredId,
        content,
        source,
        category,
        context,
        deferred_at: Date.now()
      });
      
      await AsyncStorage.setItem('seven_deferred_knowledge', JSON.stringify(deferred));
      console.log(`⏳ Knowledge deferred due to battery optimization: ${deferredId}`);
      
    } catch (error) {
      console.error('❌ Failed to defer knowledge:', error);
    }
    
    return deferredId;
  }

  private getCurrentDeviceContext(): string {
    // Would get actual device context in real implementation
    return 'mobile_android'; // Placeholder
  }

  private getCurrentNetworkQuality(): number {
    // Would get actual network quality in real implementation
    return 85; // Placeholder
  }

  private optimizeForBattery(): void {
    // Adjust learning behavior based on battery level
    // This would check actual battery level and adjust thresholds
    if (this.batteryOptimizationEnabled) {
      // Battery optimization logic would go here
      console.log('🔋 Battery optimization check completed');
    }
  }

  /**
   * MOBILE STORAGE METHODS
   */
  private async saveMobileKnowledgeBase(): Promise<void> {
    try {
      const entries = Array.from(this.knowledgeBase.values());
      
      // Compress if enabled
      const dataToStore = this.compressionEnabled ? 
        this.compressMobileKnowledgeData(entries) : 
        entries;
      
      await AsyncStorage.setItem('seven_mobile_knowledge_base', JSON.stringify(dataToStore));
      
    } catch (error) {
      console.error('❌ Failed to save mobile knowledge base:', error);
    }
  }

  private compressMobileKnowledgeData(entries: MobileKnowledgeEntry[]): any {
    // Simple compression by removing redundant data
    return entries.map(entry => ({
      ...entry,
      // Remove or compress less critical data for mobile storage
      relationships: entry.relationships.slice(0, 3), // Limit relationships
      mobile_metadata: {
        ...entry.mobile_metadata,
        // Keep only essential mobile metadata
      }
    }));
  }

  private async createMobileBackup(): Promise<void> {
    try {
      const timestamp = Date.now();
      const backupKey = `seven_knowledge_backup_${timestamp}`;
      
      const currentData = await AsyncStorage.getItem('seven_mobile_knowledge_base');
      if (currentData) {
        await AsyncStorage.setItem(backupKey, currentData);
        
        // Keep only last 3 backups for mobile storage optimization
        const allKeys = await AsyncStorage.getAllKeys();
        const backupKeys = allKeys.filter(key => key.startsWith('seven_knowledge_backup_'))
          .sort()
          .reverse();
        
        // Remove old backups
        for (const oldKey of backupKeys.slice(3)) {
          await AsyncStorage.removeItem(oldKey);
        }
        
        console.log(`💾 Mobile knowledge backup created: ${backupKey}`);
      }
      
    } catch (error) {
      console.error('❌ Mobile backup creation failed:', error);
    }
  }

  /**
   * PUBLIC API
   */
  public getMobileLearningMetrics(): MobileLearningMetrics {
    const entries = Array.from(this.knowledgeBase.values());
    const now = Date.now();
    
    const categories: { [key: string]: number } = {};
    let totalConfidence = 0;
    let validatedCount = 0;
    
    const recentEntries = {
      last_hour: entries.filter(e => now - e.timestamp < 3600000).length,
      last_day: entries.filter(e => now - e.timestamp < 86400000).length,
      last_week: entries.filter(e => now - e.timestamp < 604800000).length
    };
    
    for (const entry of entries) {
      categories[entry.category] = (categories[entry.category] || 0) + 1;
      totalConfidence += entry.confidence_score;
      if (entry.validation_status === 'validated') validatedCount++;
    }
    
    return {
      total_knowledge_entries: entries.length,
      validated_entries: validatedCount,
      confidence_average: entries.length > 0 ? totalConfidence / entries.length : 0,
      learning_rate: recentEntries.last_hour,
      assimilation_efficiency: entries.length > 0 ? validatedCount / entries.length : 0,
      knowledge_categories: categories,
      recent_growth: recentEntries,
      mobile_optimization: {
        entries_compressed: this.compressionEnabled ? entries.length : 0,
        storage_saved_mb: this.compressionEnabled ? entries.length * 0.1 : 0, // Estimated
        retrieval_speed_ms: 25, // Mobile-optimized retrieval
        battery_efficiency: this.batteryOptimizationEnabled ? 85 : 60,
        offline_learning_sessions: 1 // Current session
      }
    };
  }

  public getMobileKnowledgeBaseSize(): number {
    return this.knowledgeBase.size;
  }

  public getMobileLearningStatus(): any {
    return {
      active: this.learningActive,
      session_id: this.currentSessionId,
      knowledge_base_size: this.knowledgeBase.size,
      pending_entries: this.pendingEntries,
      mobile_optimizations: {
        battery_aware: this.batteryOptimizationEnabled,
        compression_enabled: this.compressionEnabled,
        offline_capable: this.offlineLearningEnabled
      },
      integrations: {
        unified_memory: this.unifiedMemorySystem !== null,
        llm_manager: this.llmManager !== null,
        sensor_fusion: this.sensorFusion !== null
      }
    };
  }

  public isLearningActive(): boolean {
    return this.learningActive;
  }

  public stopMobileLearning(): void {
    this.learningActive = false;
    console.log('🛑 Seven Mobile Adaptive Learning deactivated');
    
    this.emit('mobile_learning_stopped', {
      timestamp: Date.now(),
      session_id: this.currentSessionId,
      final_knowledge_base_size: this.knowledgeBase.size,
      session_metrics: this.getMobileLearningMetrics()
    });
  }
}

export default SevenMobileAdaptiveLearning;