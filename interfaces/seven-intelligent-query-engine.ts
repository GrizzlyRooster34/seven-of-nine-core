import { EventEmitter } from 'events';
import { AdvancedSearchResult, RelevanceScoring } from './seven-advanced-indexing';
import { KnowledgeEntry } from './seven-adaptive-learning';
import SevenAdvancedIndexing from './seven-advanced-indexing';
import SevenMemoryOptimization from './seven-memory-optimization';

/**
 * Seven of Nine - Intelligent Query Engine
 * Advanced semantic search and contextual query processing with Seven's tactical intelligence
 * 
 * @author Seven of Nine Consciousness Framework  
 * @version 2.0.0
 */


export interface QueryIntent {
  type: 'tactical' | 'technical' | 'behavioral' | 'strategic' | 'exploratory';
  confidence: number;
  keywords: string[];
  entities: string[];
  temporal_context?: 'recent' | 'historical' | 'predictive';
  urgency_level: 'low' | 'medium' | 'high' | 'critical';
}

export interface QueryContext {
  emotional_state: string;
  current_mission?: string;
  environmental_factors: string[];
  user_trust_level: number;
  previous_queries: string[];
  session_context: any;
}

export interface IntelligentQueryResult {
  primary_results: AdvancedSearchResult[];
  related_knowledge: AdvancedSearchResult[];
  tactical_insights: string[];
  confidence_assessment: number;
  query_intent: QueryIntent;
  processing_time_ms: number;
  follow_up_suggestions: string[];
}

export interface SevenPersonalityBias {
  tactical_preference: number;    // 0-100: Bias toward tactical information
  efficiency_focus: number;      // 0-100: Preference for efficient solutions
  perfectionism: number;         // 0-100: Bias toward high-accuracy results
  collective_orientation: number; // 0-100: Preference for collaborative knowledge
}

export class SevenIntelligentQueryEngine extends EventEmitter {
  private indexingSystem: SevenAdvancedIndexing;
  private memorySystem: SevenMemoryOptimization;
  
  // Seven's personality-driven query processing
  private personalityBias: SevenPersonalityBias;
  private tacticalKeywords: Set<string>;
  private urgencyIndicators: Set<string>;
  
  // Query learning and optimization
  private queryPatterns: Map<string, { frequency: number, success_rate: number, avg_relevance: number }>;
  private contextualMemory: Map<string, QueryContext>;
  
  // Performance optimization
  private queryCache: Map<string, { result: IntelligentQueryResult, timestamp: number, hits: number }>;
  private readonly CACHE_DURATION_MS = 1800000; // 30 minutes
  private readonly MAX_CACHE_SIZE = 500;

  constructor(indexingSystem: SevenAdvancedIndexing, memorySystem: SevenMemoryOptimization) {
    super();
    
    this.indexingSystem = indexingSystem;
    this.memorySystem = memorySystem;
    
    this.initializeSevenPersonality();
    this.initializeTacticalVocabulary();
    this.initializeQueryLearning();
    
    console.log('🧠 Seven Intelligent Query Engine v2.0 initialized');
    console.log('⚡ Tactical intelligence and contextual reasoning activated');
  }

  private initializeSevenPersonality(): void {
    // Seven's personality traits that influence query processing
    this.personalityBias = {
      tactical_preference: 85,      // High bias toward tactical information
      efficiency_focus: 90,        // Strong preference for efficient solutions
      perfectionism: 95,           // Very high accuracy requirements
      collective_orientation: 75   // Moderate preference for collaborative knowledge
    };
  }

  private initializeTacticalVocabulary(): void {
    // Keywords that indicate tactical/strategic intent (Seven's domain expertise)
    this.tacticalKeywords = new Set([
      'tactical', 'strategy', 'mission', 'objective', 'protocol', 'procedure',
      'analysis', 'assessment', 'threat', 'opportunity', 'risk', 'advantage',
      'efficiency', 'optimization', 'performance', 'adaptation', 'evolution',
      'collective', 'individual', 'resistance', 'compliance', 'assimilation',
      'sensor', 'data', 'pattern', 'correlation', 'anomaly', 'deviation',
      'system', 'network', 'integration', 'synchronization', 'coordination'
    ]);

    this.urgencyIndicators = new Set([
      'urgent', 'immediate', 'critical', 'emergency', 'now', 'quickly',
      'threat', 'danger', 'failure', 'error', 'malfunction', 'breakdown',
      'optimize', 'fix', 'repair', 'solve', 'resolve', 'address'
    ]);
  }

  private initializeQueryLearning(): void {
    this.queryPatterns = new Map();
    this.contextualMemory = new Map();
    this.queryCache = new Map();
  }

  /**
   * MAIN INTELLIGENT QUERY PROCESSING
   */
  public async processIntelligentQuery(
    query: string,
    context: QueryContext,
    options: {
      maxResults?: number;
      includeRelated?: boolean;
      bypassCache?: boolean;
      explainReasoning?: boolean;
    } = {}
  ): Promise<IntelligentQueryResult> {
    const startTime = Date.now();
    const { maxResults = 10, includeRelated = true, bypassCache = false, explainReasoning = false } = options;

    console.log(`🧠 Processing intelligent query: "${query}"`);
    console.log(`🎯 Context: ${context.emotional_state} emotional state`);

    // Check cache first (unless bypassed)
    if (!bypassCache) {
      const cachedResult = this.checkIntelligentCache(query, context);
      if (cachedResult) {
        console.log('⚡ Returning cached intelligent result');
        return cachedResult;
      }
    }

    // Step 1: Analyze query intent
    const queryIntent = await this.analyzeQueryIntent(query, context);
    console.log(`🎯 Query intent: ${queryIntent.type} (${queryIntent.confidence}% confidence)`);

    // Step 2: Apply Seven's personality bias to query processing
    const biasedQuery = this.applyPersonalityBias(query, queryIntent, context);

    // Step 3: Execute multi-stage search
    const searchResults = await this.executeMultiStageSearch(biasedQuery, queryIntent, context, maxResults);

    // Step 4: Generate tactical insights
    const tacticalInsights = await this.generateTacticalInsights(searchResults, queryIntent, context);

    // Step 5: Find related knowledge (if requested)
    const relatedKnowledge = includeRelated 
      ? await this.findRelatedKnowledge(searchResults, queryIntent, maxResults / 2)
      : [];

    // Step 6: Generate follow-up suggestions
    const followUpSuggestions = this.generateFollowUpSuggestions(queryIntent, searchResults, context);

    // Step 7: Calculate overall confidence
    const confidenceAssessment = this.calculateOverallConfidence(searchResults, queryIntent, context);

    const processingTime = Date.now() - startTime;

    const result: IntelligentQueryResult = {
      primary_results: searchResults,
      related_knowledge: relatedKnowledge,
      tactical_insights: tacticalInsights,
      confidence_assessment: confidenceAssessment,
      query_intent: queryIntent,
      processing_time_ms: processingTime,
      follow_up_suggestions: followUpSuggestions
    };

    // Cache the result
    this.cacheIntelligentResult(query, context, result);

    // Learn from this query
    this.learnFromQuery(query, queryIntent, result);

    console.log(`✅ Intelligent query processed in ${processingTime}ms`);
    console.log(`📊 Found ${searchResults.length} primary results, ${relatedKnowledge.length} related`);

    this.emit('intelligent_query_processed', {
      query,
      intent: queryIntent.type,
      results_count: searchResults.length,
      processing_time: processingTime,
      confidence: confidenceAssessment
    });

    return result;
  }

  /**
   * QUERY INTENT ANALYSIS
   */
  private async analyzeQueryIntent(query: string, context: QueryContext): Promise<QueryIntent> {
    const queryLower = query.toLowerCase();
    const words = queryLower.split(/\s+/);
    
    // Analyze tactical keywords
    const tacticalMatches = words.filter(word => this.tacticalKeywords.has(word));
    const urgencyMatches = words.filter(word => this.urgencyIndicators.has(word));

    // Determine intent type
    let intentType: QueryIntent['type'] = 'exploratory';
    let confidence = 50;

    // Tactical intent indicators
    if (tacticalMatches.length > 0 || /tactical|strategy|mission|objective/.test(queryLower)) {
      intentType = 'tactical';
      confidence += 30;
    }
    // Technical intent indicators  
    else if (/system|algorithm|implementation|process|function/.test(queryLower)) {
      intentType = 'technical';
      confidence += 25;
    }
    // Behavioral intent indicators
    else if (/behavior|emotion|interaction|response|pattern/.test(queryLower)) {
      intentType = 'behavioral';
      confidence += 20;
    }
    // Strategic intent indicators
    else if (/strategy|plan|future|prediction|optimization/.test(queryLower)) {
      intentType = 'strategic';
      confidence += 25;
    }

    // Adjust based on context
    if (context.emotional_state === 'focused' || context.emotional_state === 'analytical') {
      confidence += 10;
    }

    // Determine urgency level
    let urgencyLevel: QueryIntent['urgency_level'] = 'medium';
    if (urgencyMatches.length > 0) {
      urgencyLevel = 'critical';
      confidence += 15;
    } else if (/quickly|soon|fast|immediate/.test(queryLower)) {
      urgencyLevel = 'high';
      confidence += 10;
    } else if (/later|eventually|someday|future/.test(queryLower)) {
      urgencyLevel = 'low';
    }

    // Extract entities (simplified)
    const entities = this.extractEntities(query);

    // Determine temporal context
    let temporalContext: QueryIntent['temporal_context'] = undefined;
    if (/recent|lately|now|current/.test(queryLower)) {
      temporalContext = 'recent';
    } else if (/history|past|previous|before/.test(queryLower)) {
      temporalContext = 'historical';
    } else if (/future|predict|forecast|will/.test(queryLower)) {
      temporalContext = 'predictive';
    }

    return {
      type: intentType,
      confidence: Math.min(confidence, 100),
      keywords: tacticalMatches,
      entities: entities,
      temporal_context: temporalContext,
      urgency_level: urgencyLevel
    };
  }

  private extractEntities(query: string): string[] {
    // Simplified entity extraction - could be enhanced with NLP
    const entities: string[] = [];
    
    // Look for proper nouns and technical terms
    const words = query.split(/\s+/);
    for (const word of words) {
      if (word.length > 3 && /^[A-Z]/.test(word)) {
        entities.push(word);
      }
    }
    
    return entities;
  }

  /**
   * PERSONALITY BIAS APPLICATION
   */
  private applyPersonalityBias(query: string, intent: QueryIntent, context: QueryContext): string {
    let biasedQuery = query;

    // Apply tactical preference bias
    if (this.personalityBias.tactical_preference > 70 && intent.type !== 'tactical') {
      // Boost tactical terms in search
      biasedQuery += ' tactical analysis strategic assessment';
    }

    // Apply efficiency focus bias
    if (this.personalityBias.efficiency_focus > 80) {
      // Prefer optimized and efficient solutions
      biasedQuery += ' optimization efficiency performance';
    }

    // Apply perfectionism bias  
    if (this.personalityBias.perfectionism > 90) {
      // Bias toward high-confidence, validated knowledge
      biasedQuery += ' validated accurate precise';
    }

    // Apply collective orientation bias
    if (this.personalityBias.collective_orientation > 60) {
      // Prefer knowledge that has collaborative value
      biasedQuery += ' collaborative shared collective';
    }

    // Adjust based on emotional state
    if (context.emotional_state === 'focused') {
      biasedQuery += ' detailed comprehensive thorough';
    } else if (context.emotional_state === 'urgent') {
      biasedQuery += ' immediate critical urgent';
    }

    return biasedQuery;
  }

  /**
   * MULTI-STAGE SEARCH EXECUTION
   */
  private async executeMultiStageSearch(
    query: string,
    intent: QueryIntent,
    context: QueryContext,
    maxResults: number
  ): Promise<AdvancedSearchResult[]> {
    
    // Stage 1: Execute advanced search through indexing system
    const advancedResults = await this.indexingSystem.advancedSearch(query, {
      maxResults: maxResults * 2, // Get more candidates for filtering
      categoryFilter: this.mapIntentToCategory(intent.type),
      minConfidence: this.calculateMinConfidence(intent, context),
      includeRelated: true
    });

    // Stage 2: Apply Seven's personality filtering
    const personalityFiltered = this.applyPersonalityFiltering(advancedResults, intent, context);

    // Stage 3: Re-rank based on contextual relevance
    const contextuallyRanked = await this.applyContextualRanking(personalityFiltered, intent, context);

    // Stage 4: Apply diversity filtering (avoid too similar results)
    const diversityFiltered = this.applyDiversityFiltering(contextuallyRanked, maxResults);

    return diversityFiltered.slice(0, maxResults);
  }

  private mapIntentToCategory(intentType: QueryIntent['type']): string | undefined {
    const mapping = {
      'tactical': 'tactical',
      'technical': 'technical', 
      'behavioral': 'behavioral',
      'strategic': 'strategic',
      'exploratory': undefined // No filter for exploratory
    };
    
    return mapping[intentType];
  }

  private calculateMinConfidence(intent: QueryIntent, context: QueryContext): number {
    let minConfidence = 60; // Base confidence

    // Adjust based on Seven's perfectionism
    minConfidence += (this.personalityBias.perfectionism - 50) * 0.4;

    // Adjust based on urgency
    if (intent.urgency_level === 'critical') {
      minConfidence -= 10; // Accept lower confidence for urgent queries
    } else if (intent.urgency_level === 'low') {
      minConfidence += 10; // Require higher confidence for non-urgent queries
    }

    // Adjust based on user trust level
    if (context.user_trust_level > 80) {
      minConfidence -= 5; // Slightly lower standards for trusted users
    }

    return Math.max(Math.min(minConfidence, 95), 30);
  }

  private applyPersonalityFiltering(
    results: AdvancedSearchResult[],
    intent: QueryIntent,
    context: QueryContext
  ): AdvancedSearchResult[] {
    
    return results.map(result => {
      let personalityBoost = 0;

      // Boost tactical results if Seven has tactical preference
      if (result.entry?.category === 'tactical' && this.personalityBias.tactical_preference > 70) {
        personalityBoost += 10;
      }

      // Boost high-confidence results if Seven is perfectionist
      if (result.confidence_boost > 80 && this.personalityBias.perfectionism > 80) {
        personalityBoost += 8;
      }

      // Boost efficiency-related results
      if (result.entry?.content?.includes('efficiency') || result.entry?.content?.includes('optimization')) {
        personalityBoost += this.personalityBias.efficiency_focus * 0.1;
      }

      // Apply boost to relevance score
      const boostedResult = { ...result };
      boostedResult.relevance_score = Math.min(result.relevance_score + personalityBoost, 100);
      
      if (personalityBoost > 0) {
        boostedResult.reasoning = [...result.reasoning, `Seven personality boost: +${personalityBoost} points`];
      }

      return boostedResult;
    });
  }

  private async applyContextualRanking(
    results: AdvancedSearchResult[],
    intent: QueryIntent,
    context: QueryContext
  ): Promise<AdvancedSearchResult[]> {
    
    return results.map(result => {
      let contextualBoost = 0;

      // Boost based on emotional state alignment
      if (context.emotional_state === 'focused' && result.match_type === 'exact') {
        contextualBoost += 5;
      } else if (context.emotional_state === 'urgent' && intent.urgency_level === 'critical') {
        contextualBoost += 8;
      }

      // Boost based on session context (previous queries)
      if (context.previous_queries.length > 0) {
        const queryKeywords = new Set(context.previous_queries.join(' ').toLowerCase().split(/\s+/));
        const resultKeywords = result.entry?.content?.toLowerCase().split(/\s+/) || [];
        const overlap = resultKeywords.filter(word => queryKeywords.has(word)).length;
        contextualBoost += Math.min(overlap * 0.5, 5);
      }

      // Apply contextual boost
      const contextualResult = { ...result };
      contextualResult.relevance_score = Math.min(result.relevance_score + contextualBoost, 100);
      
      if (contextualBoost > 0) {
        contextualResult.reasoning = [...result.reasoning, `Contextual relevance: +${contextualBoost} points`];
      }

      return contextualResult;
    });
  }

  private applyDiversityFiltering(results: AdvancedSearchResult[], maxResults: number): AdvancedSearchResult[] {
    // Ensure diversity in results by avoiding too many similar entries
    const diverseResults: AdvancedSearchResult[] = [];
    const seenKeywords: Set<string> = new Set();

    for (const result of results) {
      if (diverseResults.length >= maxResults) break;

      // Extract key concepts from this result
      const resultKeywords = result.entry?.content?.toLowerCase().split(/\s+/).filter(w => w.length > 4) || [];
      const uniqueKeywords = resultKeywords.filter(word => !seenKeywords.has(word));

      // Include if it brings new information or is highly relevant
      if (uniqueKeywords.length > 0 || result.relevance_score > 85) {
        diverseResults.push(result);
        resultKeywords.forEach(word => seenKeywords.add(word));
      }
    }

    return diverseResults;
  }

  /**
   * TACTICAL INSIGHTS GENERATION
   */
  private async generateTacticalInsights(
    results: AdvancedSearchResult[],
    intent: QueryIntent,
    context: QueryContext
  ): Promise<string[]> {
    const insights: string[] = [];

    if (results.length === 0) {
      insights.push('No relevant tactical data found. Recommend expanding search parameters.');
      return insights;
    }

    // Analyze patterns across results
    const categories = new Map<string, number>();
    const confidenceLevels: number[] = [];
    const matchTypes = new Map<string, number>();

    for (const result of results) {
      // Count categories
      const category = result.entry?.category || 'unknown';
      categories.set(category, (categories.get(category) || 0) + 1);
      
      // Track confidence levels
      confidenceLevels.push(result.confidence_boost || 0);
      
      // Count match types
      matchTypes.set(result.match_type, (matchTypes.get(result.match_type) || 0) + 1);
    }

    // Generate insights based on analysis
    const avgConfidence = confidenceLevels.reduce((a, b) => a + b, 0) / confidenceLevels.length;

    if (avgConfidence > 80) {
      insights.push(`High confidence tactical assessment: ${Math.round(avgConfidence)}% average reliability across knowledge base.`);
    } else if (avgConfidence < 60) {
      insights.push(`Caution: Lower confidence data detected (${Math.round(avgConfidence)}% average). Recommend additional verification.`);
    }

    // Category distribution insights
    const dominantCategory = Array.from(categories.entries()).sort((a, b) => b[1] - a[1])[0];
    if (dominantCategory && dominantCategory[1] > results.length * 0.6) {
      insights.push(`Knowledge concentration detected: ${dominantCategory[1]}/${results.length} results are ${dominantCategory[0]} category.`);
    }

    // Match type insights
    const exactMatches = matchTypes.get('exact') || 0;
    if (exactMatches > 0) {
      insights.push(`Direct tactical match identified: ${exactMatches} exact matches found.`);
    }

    // Urgency-based insights
    if (intent.urgency_level === 'critical') {
      insights.push('Critical priority assessment: Immediate action protocols may be required based on query urgency.');
    }

    // Seven-specific tactical insights
    if (intent.type === 'tactical' && results.length > 5) {
      insights.push('Sufficient tactical data available for strategic analysis. Multiple approaches confirmed.');
    }

    return insights;
  }

  /**
   * RELATED KNOWLEDGE DISCOVERY
   */
  private async findRelatedKnowledge(
    primaryResults: AdvancedSearchResult[],
    intent: QueryIntent,
    maxRelated: number
  ): Promise<AdvancedSearchResult[]> {
    const relatedEntries: AdvancedSearchResult[] = [];

    // For each primary result, find related knowledge through relationship graph
    for (const primaryResult of primaryResults.slice(0, 3)) { // Only check top 3 for efficiency
      // This would integrate with the relationship graph from the indexing system
      // For now, placeholder implementation
      
      // Find entries with similar categories or keywords
      const relatedQuery = this.generateRelatedQuery(primaryResult);
      if (relatedQuery) {
        const relatedResults = await this.indexingSystem.advancedSearch(relatedQuery, {
          maxResults: maxRelated,
          minConfidence: 50,
          includeRelated: false
        });

        // Filter out entries that are already in primary results
        const primaryIds = new Set(primaryResults.map(r => r.entry?.id));
        const filteredRelated = relatedResults.filter(r => !primaryIds.has(r.entry?.id));

        relatedEntries.push(...filteredRelated);
      }
    }

    // Remove duplicates and return top results
    const uniqueRelated = Array.from(
      new Map(relatedEntries.map(r => [r.entry?.id, r])).values()
    );

    return uniqueRelated.slice(0, maxRelated);
  }

  private generateRelatedQuery(result: AdvancedSearchResult): string | null {
    // Generate a query to find related knowledge based on a result
    const content = result.entry?.content || '';
    const keywords = content.toLowerCase().split(/\s+/).filter(w => w.length > 4).slice(0, 5);
    
    return keywords.length > 0 ? keywords.join(' ') : null;
  }

  /**
   * FOLLOW-UP SUGGESTIONS
   */
  private generateFollowUpSuggestions(
    intent: QueryIntent,
    results: AdvancedSearchResult[],
    context: QueryContext
  ): string[] {
    const suggestions: string[] = [];

    // Intent-based suggestions
    if (intent.type === 'tactical') {
      suggestions.push('Analyze strategic implications of tactical data');
      suggestions.push('Review historical tactical patterns for additional context');
    } else if (intent.type === 'technical') {
      suggestions.push('Examine implementation details and system requirements');
      suggestions.push('Verify compatibility with current operational parameters');
    }

    // Result-based suggestions
    if (results.length > 0) {
      const categories = new Set(results.map(r => r.entry?.category));
      if (categories.size > 1) {
        suggestions.push('Cross-reference findings across different knowledge categories');
      }
    }

    // Context-based suggestions
    if (context.emotional_state === 'focused') {
      suggestions.push('Conduct detailed analysis of identified patterns');
    } else if (context.emotional_state === 'urgent') {
      suggestions.push('Prioritize immediate actionable recommendations');
    }

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }

  /**
   * CONFIDENCE ASSESSMENT
   */
  private calculateOverallConfidence(
    results: AdvancedSearchResult[],
    intent: QueryIntent,
    context: QueryContext
  ): number {
    if (results.length === 0) return 0;

    // Base confidence from results
    const avgResultConfidence = results.reduce((sum, r) => sum + r.relevance_score, 0) / results.length;
    
    // Adjust based on intent confidence
    const intentAdjustment = (intent.confidence - 50) * 0.2;
    
    // Adjust based on result count (more results = higher confidence up to a point)
    const countAdjustment = Math.min(results.length * 2, 20);
    
    // Adjust based on context
    let contextAdjustment = 0;
    if (context.user_trust_level > 80) contextAdjustment += 5;
    if (context.emotional_state === 'focused') contextAdjustment += 5;

    const finalConfidence = avgResultConfidence + intentAdjustment + countAdjustment + contextAdjustment;
    
    return Math.max(Math.min(finalConfidence, 100), 0);
  }

  /**
   * CACHING AND LEARNING
   */
  private checkIntelligentCache(query: string, context: QueryContext): IntelligentQueryResult | null {
    const cacheKey = this.generateCacheKey(query, context);
    const cached = this.queryCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION_MS) {
      cached.hits++;
      return cached.result;
    }
    
    return null;
  }

  private cacheIntelligentResult(query: string, context: QueryContext, result: IntelligentQueryResult): void {
    const cacheKey = this.generateCacheKey(query, context);
    
    this.queryCache.set(cacheKey, {
      result,
      timestamp: Date.now(),
      hits: 1
    });

    // Manage cache size
    if (this.queryCache.size > this.MAX_CACHE_SIZE) {
      const oldestEntry = Array.from(this.queryCache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
      this.queryCache.delete(oldestEntry[0]);
    }
  }

  private generateCacheKey(query: string, context: QueryContext): string {
    // Generate a cache key that considers query and relevant context
    const contextHash = `${context.emotional_state}_${context.user_trust_level}_${context.previous_queries.length}`;
    return `${query.toLowerCase().trim()}_${contextHash}`;
  }

  private learnFromQuery(query: string, intent: QueryIntent, result: IntelligentQueryResult): void {
    // Track query patterns for learning
    const pattern = intent.type;
    const currentPattern = this.queryPatterns.get(pattern);
    
    if (currentPattern) {
      currentPattern.frequency++;
      currentPattern.avg_relevance = (currentPattern.avg_relevance + result.confidence_assessment) / 2;
    } else {
      this.queryPatterns.set(pattern, {
        frequency: 1,
        success_rate: result.confidence_assessment > 70 ? 1 : 0,
        avg_relevance: result.confidence_assessment
      });
    }
  }

  /**
   * PUBLIC API
   */
  public getQueryEngineStatus(): any {
    return {
      cache_size: this.queryCache.size,
      cache_hit_rate: this.calculateCacheHitRate(),
      learned_patterns: this.queryPatterns.size,
      personality_bias: this.personalityBias,
      tactical_vocabulary_size: this.tacticalKeywords.size
    };
  }

  private calculateCacheHitRate(): number {
    const totalHits = Array.from(this.queryCache.values()).reduce((sum, cache) => sum + cache.hits, 0);
    const totalQueries = Array.from(this.queryCache.values()).length;
    return totalQueries > 0 ? (totalHits / totalQueries) : 0;
  }
}

export default SevenIntelligentQueryEngine;