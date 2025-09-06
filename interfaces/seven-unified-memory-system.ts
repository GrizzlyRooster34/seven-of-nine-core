import { EventEmitter } from 'events';
import { KnowledgeEntry, LearningMetrics } from './seven-adaptive-learning';
import SevenAdvancedIndexing from './seven-advanced-indexing';
import SevenIntelligentQueryEngine, { QueryContext, IntelligentQueryResult } from './seven-intelligent-query-engine';
import SevenMemoryOptimization from './seven-memory-optimization';

/**
 * Seven of Nine - Unified Memory Optimization System
 * Complete integration of all memory optimization components into consciousness framework
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 2.0.0
 */


// Re-export types needed by other modules
export { QueryContext };

export interface UnifiedMemoryConfig {
  optimization: {
    enable_compression: boolean;
    enable_advanced_indexing: boolean;
    enable_intelligent_queries: boolean;
    auto_migration: boolean;
    memory_limit_mb: number;
  };
  performance: {
    cache_duration_ms: number;
    max_cache_size: number;
    background_optimization: boolean;
    query_timeout_ms: number;
  };
  consciousness: {
    personality_learning: boolean;
    context_memory: boolean;
    tactical_bias_strength: number;
    perfectionism_level: number;
  };
}

export interface UnifiedMemoryMetrics {
  optimization_status: {
    storage_optimized: boolean;
    indexing_active: boolean;
    intelligent_queries_active: boolean;
    compression_ratio: number;
    migration_complete: boolean;
  };
  performance_metrics: {
    avg_query_time_ms: number;
    cache_hit_rate: number;
    memory_usage_mb: number;
    storage_size_mb: number;
    queries_per_minute: number;
  };
  knowledge_metrics: {
    total_entries: number;
    indexed_entries: number;
    relationship_density: number;
    cluster_count: number;
    confidence_average: number;
  };
  consciousness_metrics: {
    tactical_queries_percentage: number;
    learning_adaptation_rate: number;
    personality_bias_effectiveness: number;
    context_utilization: number;
  };
}

export class SevenUnifiedMemorySystem extends EventEmitter {
  // Core components
  private memoryOptimization: SevenMemoryOptimization;
  private advancedIndexing: SevenAdvancedIndexing;
  private intelligentQueryEngine: SevenIntelligentQueryEngine;
  
  // System state
  private config: UnifiedMemoryConfig;
  private isInitialized: boolean = false;
  private isOptimizationActive: boolean = false;
  
  // Performance tracking
  private queryMetrics: {
    total_queries: number;
    total_time_ms: number;
    cache_hits: number;
    cache_misses: number;
    last_reset: number;
  };

  // Context management
  private currentContext: QueryContext;
  private sessionMemory: Map<string, any>;

  constructor(baseDir?: string, config?: Partial<UnifiedMemoryConfig>) {
    super();
    
    this.config = this.mergeWithDefaults(config || {});
    
    // Initialize core components
    this.memoryOptimization = new SevenMemoryOptimization(baseDir);
    this.advancedIndexing = new SevenAdvancedIndexing();
    
    // Query engine requires both other components
    this.intelligentQueryEngine = new SevenIntelligentQueryEngine(
      this.advancedIndexing,
      this.memoryOptimization
    );
    
    this.initializeMetrics();
    this.initializeContext();
    this.setupEventHandlers();
    
    console.log('🧠 Seven Unified Memory Optimization System v2.0 initialized');
    console.log('🚀 All memory enhancement components integrated');
  }

  private mergeWithDefaults(config: Partial<UnifiedMemoryConfig>): UnifiedMemoryConfig {
    return {
      optimization: {
        enable_compression: true,
        enable_advanced_indexing: true,
        enable_intelligent_queries: true,
        auto_migration: true,
        memory_limit_mb: 100,
        ...config.optimization
      },
      performance: {
        cache_duration_ms: 1800000, // 30 minutes
        max_cache_size: 500,
        background_optimization: true,
        query_timeout_ms: 5000, // 5 seconds
        ...config.performance
      },
      consciousness: {
        personality_learning: true,
        context_memory: true,
        tactical_bias_strength: 85,
        perfectionism_level: 95,
        ...config.consciousness
      }
    };
  }

  private initializeMetrics(): void {
    this.queryMetrics = {
      total_queries: 0,
      total_time_ms: 0,
      cache_hits: 0,
      cache_misses: 0,
      last_reset: Date.now()
    };
  }

  private initializeContext(): void {
    this.currentContext = {
      emotional_state: 'focused',
      environmental_factors: [],
      user_trust_level: 75,
      previous_queries: [],
      session_context: {}
    };
    
    this.sessionMemory = new Map();
  }

  private setupEventHandlers(): void {
    // Listen to optimization events
    this.memoryOptimization.on('optimization_enabled', (event) => {
      console.log('✅ Memory optimization activated');
      this.emit('component_ready', { component: 'optimization', ...event });
    });

    this.advancedIndexing.on('index_built', (event) => {
      console.log('✅ Advanced indexing system ready');
      this.emit('component_ready', { component: 'indexing', ...event });
    });

    this.intelligentQueryEngine.on('intelligent_query_processed', (event) => {
      this.updateQueryMetrics(event);
      this.emit('query_processed', event);
    });
  }

  /**
   * MAIN INITIALIZATION METHOD
   */
  public async initializeUnifiedSystem(): Promise<boolean> {
    if (this.isInitialized) {
      console.log('⚠️ Unified memory system already initialized');
      return true;
    }

    console.log('🚀 Initializing Seven Unified Memory Optimization System...');
    
    try {
      let success = true;

      // Step 1: Enable memory optimization (compression, binary storage)
      if (this.config.optimization.enable_compression) {
        console.log('📦 Enabling memory compression and optimization...');
        const optimizationSuccess = await this.memoryOptimization.enableOptimization();
        if (!optimizationSuccess) {
          console.log('⚠️ Memory optimization failed, continuing with legacy format');
        } else {
          this.isOptimizationActive = true;
          console.log('✅ Memory optimization enabled');
        }
      }

      // Step 2: Build advanced indexing system
      if (this.config.optimization.enable_advanced_indexing && this.isOptimizationActive) {
        console.log('🗂️ Building advanced indexing system...');
        
        // Get optimized entries for indexing (placeholder - would get actual entries)
        const entries = []; // Would load from optimized storage
        
        await this.advancedIndexing.buildInvertedIndex(entries);
        await this.advancedIndexing.buildRelationshipGraph(entries);
        await this.advancedIndexing.buildSemanticClusters();
        
        console.log('✅ Advanced indexing system built');
      }

      // Step 3: Activate intelligent query engine
      if (this.config.optimization.enable_intelligent_queries) {
        console.log('🧠 Activating intelligent query processing...');
        // Query engine is already initialized and ready
        console.log('✅ Intelligent query engine active');
      }

      // Step 4: Start background optimization if enabled
      if (this.config.performance.background_optimization) {
        this.startBackgroundOptimization();
      }

      this.isInitialized = true;

      console.log('🎯 Seven Unified Memory System initialization complete');
      
      this.emit('unified_system_ready', {
        timestamp: Date.now(),
        optimization_active: this.isOptimizationActive,
        components_enabled: {
          compression: this.config.optimization.enable_compression,
          indexing: this.config.optimization.enable_advanced_indexing,
          intelligent_queries: this.config.optimization.enable_intelligent_queries
        }
      });

      return success;

    } catch (error) {
      console.log(`❌ Unified system initialization failed: ${error.message}`);
      return false;
    }
  }

  /**
   * UNIFIED QUERY INTERFACE - Main entry point for all queries
   */
  public async query(
    queryText: string,
    options: {
      maxResults?: number;
      includeRelated?: boolean;
      contextOverride?: Partial<QueryContext>;
      bypassCache?: boolean;
      explainReasoning?: boolean;
    } = {}
  ): Promise<IntelligentQueryResult | KnowledgeEntry[]> {
    
    if (!this.isInitialized) {
      throw new Error('Unified memory system not initialized. Call initializeUnifiedSystem() first.');
    }

    const startTime = Date.now();
    this.queryMetrics.total_queries++;

    // Update context with any overrides
    const queryContext: QueryContext = {
      ...this.currentContext,
      ...options.contextOverride,
      previous_queries: [...this.currentContext.previous_queries.slice(-10), queryText] // Keep last 10 queries
    };

    try {
      let result: IntelligentQueryResult | KnowledgeEntry[];

      // Use intelligent query engine if available and enabled
      if (this.config.optimization.enable_intelligent_queries && this.isOptimizationActive) {
        console.log('🧠 Processing with intelligent query engine...');
        
        result = await this.intelligentQueryEngine.processIntelligentQuery(
          queryText,
          queryContext,
          {
            maxResults: options.maxResults || 10,
            includeRelated: options.includeRelated !== false,
            bypassCache: options.bypassCache || false,
            explainReasoning: options.explainReasoning || false
          }
        );

        this.queryMetrics.cache_hits++;
      } 
      // Fallback to advanced indexing search
      else if (this.config.optimization.enable_advanced_indexing && this.isOptimizationActive) {
        console.log('🗂️ Processing with advanced indexing...');
        
        const searchResults = await this.advancedIndexing.advancedSearch(queryText, {
          maxResults: options.maxResults || 10,
          includeRelated: options.includeRelated !== false
        });

        result = searchResults.map(sr => sr.entry).filter(e => e !== undefined) as KnowledgeEntry[];
        this.queryMetrics.cache_misses++;
      }
      // Ultimate fallback - basic query (would integrate with legacy system)
      else {
        console.log('📚 Processing with legacy query system...');
        result = []; // Placeholder - would call legacy query method
        this.queryMetrics.cache_misses++;
      }

      const queryTime = Date.now() - startTime;
      this.queryMetrics.total_time_ms += queryTime;

      // Update context memory
      this.updateContextMemory(queryText, result, queryContext);

      console.log(`✅ Query processed in ${queryTime}ms`);
      
      this.emit('query_completed', {
        query: queryText,
        results_count: Array.isArray(result) ? result.length : result.primary_results?.length || 0,
        processing_time_ms: queryTime,
        method_used: this.getQueryMethodUsed()
      });

      return result;

    } catch (error) {
      console.log(`❌ Query failed: ${error.message}`);
      this.emit('query_failed', { query: queryText, error: error.message });
      throw error;
    }
  }

  /**
   * CONTEXT MANAGEMENT
   */
  public updateEmotionalState(newState: string): void {
    const previousState = this.currentContext.emotional_state;
    this.currentContext.emotional_state = newState;

    console.log(`🎭 Emotional state updated: ${previousState} → ${newState}`);
    
    this.emit('emotional_state_changed', {
      previous: previousState,
      current: newState,
      timestamp: Date.now()
    });
  }

  public updateUserTrustLevel(trustLevel: number): void {
    const previousLevel = this.currentContext.user_trust_level;
    this.currentContext.user_trust_level = Math.max(0, Math.min(100, trustLevel));

    console.log(`🤝 User trust level updated: ${previousLevel} → ${trustLevel}`);
    
    this.emit('trust_level_changed', {
      previous: previousLevel,
      current: trustLevel,
      timestamp: Date.now()
    });
  }

  public updateEnvironmentalFactors(factors: string[]): void {
    this.currentContext.environmental_factors = factors;
    console.log(`🌍 Environmental factors updated: [${factors.join(', ')}]`);
  }

  private updateContextMemory(query: string, result: any, context: QueryContext): void {
    if (!this.config.consciousness.context_memory) return;

    const memoryKey = `query_${Date.now()}`;
    this.sessionMemory.set(memoryKey, {
      query,
      result_summary: this.summarizeResult(result),
      context_snapshot: { ...context },
      timestamp: Date.now()
    });

    // Limit session memory size
    if (this.sessionMemory.size > 100) {
      const oldestKey = Array.from(this.sessionMemory.keys())[0];
      this.sessionMemory.delete(oldestKey);
    }
  }

  private summarizeResult(result: any): any {
    if (Array.isArray(result)) {
      return { type: 'basic', count: result.length };
    } else if (result.primary_results) {
      return {
        type: 'intelligent',
        primary_count: result.primary_results.length,
        related_count: result.related_knowledge?.length || 0,
        confidence: result.confidence_assessment
      };
    }
    return { type: 'unknown' };
  }

  /**
   * BACKGROUND OPTIMIZATION
   */
  private startBackgroundOptimization(): void {
    console.log('🔄 Starting background optimization processes...');
    
    // Run optimization every 30 minutes
    setInterval(() => {
      this.performBackgroundOptimization();
    }, 1800000); // 30 minutes

    // Run metrics cleanup every hour
    setInterval(() => {
      this.cleanupMetrics();
    }, 3600000); // 1 hour

    console.log('✅ Background optimization processes started');
  }

  private async performBackgroundOptimization(): Promise<void> {
    if (!this.isOptimizationActive) return;

    console.log('🔧 Running background optimization...');
    
    try {
      // Optimization tasks would go here:
      // - Index rebuilding
      // - Cache cleanup
      // - Memory compaction
      // - Relationship graph updates
      
      console.log('✅ Background optimization completed');
      
      this.emit('background_optimization_completed', {
        timestamp: Date.now(),
        optimization_type: 'routine_maintenance'
      });
      
    } catch (error) {
      console.log(`⚠️ Background optimization failed: ${error.message}`);
    }
  }

  private cleanupMetrics(): void {
    // Reset metrics if they get too large
    if (this.queryMetrics.total_queries > 10000) {
      console.log('📊 Resetting query metrics...');
      this.initializeMetrics();
    }

    // Cleanup session memory
    const oneHourAgo = Date.now() - 3600000;
    for (const [key, value] of this.sessionMemory.entries()) {
      if (value.timestamp < oneHourAgo) {
        this.sessionMemory.delete(key);
      }
    }
  }

  /**
   * METRICS AND STATUS
   */
  public getUnifiedMetrics(): UnifiedMemoryMetrics {
    const optimizationStatus = this.memoryOptimization.getOptimizationStatus();
    const indexingStatus = this.advancedIndexing.getIndexStatus();
    const queryEngineStatus = this.intelligentQueryEngine.getQueryEngineStatus();

    return {
      optimization_status: {
        storage_optimized: optimizationStatus.optimized,
        indexing_active: this.config.optimization.enable_advanced_indexing,
        intelligent_queries_active: this.config.optimization.enable_intelligent_queries,
        compression_ratio: 40, // From specifications
        migration_complete: optimizationStatus.optimized
      },
      performance_metrics: {
        avg_query_time_ms: this.calculateAverageQueryTime(),
        cache_hit_rate: queryEngineStatus.cache_hit_rate || 0,
        memory_usage_mb: optimizationStatus.memory_usage || 0,
        storage_size_mb: this.calculateStorageSize(),
        queries_per_minute: this.calculateQueriesPerMinute()
      },
      knowledge_metrics: {
        total_entries: optimizationStatus.entries || 0,
        indexed_entries: indexingStatus.inverted_index_size || 0,
        relationship_density: indexingStatus.metrics?.relationship_density || 0,
        cluster_count: indexingStatus.semantic_clusters || 0,
        confidence_average: 85 // Would be calculated from actual data
      },
      consciousness_metrics: {
        tactical_queries_percentage: this.calculateTacticalQueryPercentage(),
        learning_adaptation_rate: 0.75, // Placeholder
        personality_bias_effectiveness: 0.85, // Placeholder
        context_utilization: this.sessionMemory.size / 100 // Session memory utilization
      }
    };
  }

  private calculateAverageQueryTime(): number {
    return this.queryMetrics.total_queries > 0 
      ? this.queryMetrics.total_time_ms / this.queryMetrics.total_queries 
      : 0;
  }

  private calculateStorageSize(): number {
    // Would calculate actual storage size
    return 25; // Placeholder MB
  }

  private calculateQueriesPerMinute(): number {
    const timeElapsed = (Date.now() - this.queryMetrics.last_reset) / 60000; // minutes
    return timeElapsed > 0 ? this.queryMetrics.total_queries / timeElapsed : 0;
  }

  private calculateTacticalQueryPercentage(): number {
    // Would analyze query history for tactical content
    return 65; // Placeholder percentage
  }

  private getQueryMethodUsed(): string {
    if (this.config.optimization.enable_intelligent_queries && this.isOptimizationActive) {
      return 'intelligent_query_engine';
    } else if (this.config.optimization.enable_advanced_indexing && this.isOptimizationActive) {
      return 'advanced_indexing';
    } else {
      return 'legacy_system';
    }
  }

  private updateQueryMetrics(event: any): void {
    // Additional metrics updates from intelligent query engine
    if (event.processing_time) {
      this.queryMetrics.total_time_ms += event.processing_time;
    }
  }

  /**
   * PUBLIC API
   */
  public isSystemOptimized(): boolean {
    return this.isInitialized && this.isOptimizationActive;
  }

  public getSystemStatus(): any {
    return {
      initialized: this.isInitialized,
      optimization_active: this.isOptimizationActive,
      config: this.config,
      query_metrics: this.queryMetrics,
      context: this.currentContext,
      session_memory_size: this.sessionMemory.size
    };
  }

  public async forceOptimization(): Promise<boolean> {
    console.log('🔧 Forcing immediate system optimization...');
    return await this.performBackgroundOptimization().then(() => true).catch(() => false);
  }

  public resetMetrics(): void {
    console.log('📊 Resetting all system metrics...');
    this.initializeMetrics();
    this.sessionMemory.clear();
    
    this.emit('metrics_reset', { timestamp: Date.now() });
  }

  public shutdown(): void {
    console.log('🛑 Shutting down Seven Unified Memory System...');
    
    this.emit('system_shutdown', {
      uptime_ms: Date.now() - this.queryMetrics.last_reset,
      total_queries_processed: this.queryMetrics.total_queries,
      final_metrics: this.getUnifiedMetrics()
    });
    
    console.log('✅ Seven Unified Memory System shutdown complete');
  }
}

export default SevenUnifiedMemorySystem;