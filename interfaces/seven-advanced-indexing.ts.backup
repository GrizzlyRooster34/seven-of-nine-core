/**
 * Seven of Nine - Advanced Indexing System
 * Multi-layer indexing with relationship graphs and semantic clustering
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 2.0.0
 */

import { EventEmitter } from 'events';
import { KnowledgeEntry } from './seven-adaptive-learning';
import { OptimizedKnowledgeEntry } from './seven-memory-optimization';

export interface AdvancedSearchResult {
  entry: KnowledgeEntry;
  relevance_score: number;
  match_type: 'exact' | 'semantic' | 'contextual' | 'relationship';
  confidence_boost: number;
  reasoning: string[];
}

export interface IndexingMetrics {
  total_indexed_entries: number;
  keyword_coverage: number;
  relationship_density: number;
  cluster_count: number;
  index_efficiency: number;
  last_optimization: number;
}

export interface SemanticCluster {
  id: string;
  category: string;
  center_keywords: string[];
  member_entries: number[];
  cluster_strength: number;
  last_updated: number;
}

export interface RelevanceScoring {
  keyword_match: number;      // 0-40 points
  semantic_similarity: number; // 0-30 points
  confidence_bonus: number;    // 0-20 points
  utility_bonus: number;       // 0-10 points
  total_score: number;         // 0-100 points
}

export class SevenAdvancedIndexing extends EventEmitter {
  // Core indexing structures
  private invertedIndex: Map<string, Set<number>>; // keyword -> entry indices
  private phraseIndex: Map<string, Set<number>>;   // phrases -> entry indices
  private semanticClusters: Map<string, SemanticCluster>;
  private relationshipMatrix: Map<number, Map<number, number>>; // entry -> related entries with strength
  
  // Performance optimization
  private frequentQueries: Map<string, { count: number, last_used: number, cached_results: number[] }>;
  private indexingMetrics: IndexingMetrics;
  
  // Configuration
  private readonly MAX_KEYWORDS_PER_ENTRY = 50;
  private readonly MIN_RELATIONSHIP_STRENGTH = 0.3;
  private readonly CLUSTER_SIZE_THRESHOLD = 5;
  
  constructor() {
    super();
    
    this.invertedIndex = new Map();
    this.phraseIndex = new Map();
    this.semanticClusters = new Map();
    this.relationshipMatrix = new Map();
    this.frequentQueries = new Map();
    
    this.indexingMetrics = {
      total_indexed_entries: 0,
      keyword_coverage: 0,
      relationship_density: 0,
      cluster_count: 0,
      index_efficiency: 0,
      last_optimization: 0
    };
    
    console.log('🗂️ Seven Advanced Indexing System initialized');
  }

  /**
   * PHASE 2A: INVERTED INDEX CONSTRUCTION
   */
  public async buildInvertedIndex(entries: OptimizedKnowledgeEntry[]): Promise<void> {
    console.log('🔨 Building inverted index...');
    
    const startTime = Date.now();
    
    for (let i = 0; i < entries.length; i++) {
      await this.indexEntry(entries[i], i);
      
      // Progress reporting
      if (i % 1000 === 0 && i > 0) {
        console.log(`📊 Indexed ${i}/${entries.length} entries`);
      }
    }
    
    // Build phrase index from keyword combinations
    await this.buildPhraseIndex();
    
    const buildTime = Date.now() - startTime;
    console.log(`✅ Inverted index built in ${buildTime}ms for ${entries.length} entries`);
    
    this.indexingMetrics.total_indexed_entries = entries.length;
    this.indexingMetrics.keyword_coverage = this.calculateKeywordCoverage();
    
    this.emit('index_built', {
      entries_indexed: entries.length,
      build_time_ms: buildTime,
      unique_keywords: this.invertedIndex.size
    });
  }

  private async indexEntry(entry: OptimizedKnowledgeEntry, index: number): Promise<void> {
    try {
      // Decompress content to extract features
      const zlib = require('zlib');
      const content = zlib.gunzipSync(entry.content).toString('utf8');
      const context = JSON.parse(zlib.gunzipSync(entry.context).toString('utf8'));
      
      // Extract and index keywords
      const keywords = this.extractAdvancedKeywords(content);
      const contextKeywords = this.extractContextKeywords(context);
      const allKeywords = [...keywords, ...contextKeywords];
      
      // Update inverted index
      for (const keyword of allKeywords) {
        if (!this.invertedIndex.has(keyword)) {
          this.invertedIndex.set(keyword, new Set());
        }
        this.invertedIndex.get(keyword)!.add(index);
      }
      
      // Index important phrases (for better semantic matching)
      const phrases = this.extractImportantPhrases(content);
      for (const phrase of phrases) {
        if (!this.phraseIndex.has(phrase)) {
          this.phraseIndex.set(phrase, new Set());
        }
        this.phraseIndex.get(phrase)!.add(index);
      }
      
    } catch (error) {
      console.log(`⚠️ Failed to index entry ${index}: ${error.message}`);
    }
  }

  private extractAdvancedKeywords(text: string): string[] {
    // Enhanced keyword extraction with tactical intelligence focus
    const tacticalTerms = [
      'tactical', 'strategic', 'operational', 'mission', 'objective', 'protocol',
      'analysis', 'assessment', 'threat', 'opportunity', 'efficiency', 'optimization',
      'sensor', 'environmental', 'behavioral', 'pattern', 'correlation', 'adaptation'
    ];
    
    const technicalTerms = [
      'system', 'algorithm', 'process', 'function', 'parameter', 'configuration',
      'implementation', 'integration', 'performance', 'memory', 'storage', 'query'
    ];
    
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
    
    // Score words based on tactical/technical importance
    const scoredWords = words.map(word => ({
      word,
      score: this.calculateWordImportance(word, tacticalTerms, technicalTerms)
    }));
    
    // Return top scored keywords
    return scoredWords
      .filter(sw => sw.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, this.MAX_KEYWORDS_PER_ENTRY)
      .map(sw => sw.word);
  }

  private calculateWordImportance(word: string, tacticalTerms: string[], technicalTerms: string[]): number {
    let score = 0;
    
    // Base score for length (longer words often more meaningful)
    if (word.length > 6) score += 2;
    else if (word.length > 4) score += 1;
    
    // Bonus for tactical terms
    if (tacticalTerms.some(term => word.includes(term) || term.includes(word))) {
      score += 5;
    }
    
    // Bonus for technical terms
    if (technicalTerms.some(term => word.includes(term) || term.includes(word))) {
      score += 3;
    }
    
    // Penalty for common words
    const commonWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'had', 'have', 'will', 'would', 'could', 'should'];
    if (commonWords.includes(word)) {
      score = 0;
    }
    
    return score;
  }

  private extractContextKeywords(context: any): string[] {
    const keywords: string[] = [];
    
    // Extract keywords from context fields
    if (context.emotional_state) {
      keywords.push(context.emotional_state);
    }
    
    if (context.environmental_context) {
      keywords.push(...context.environmental_context.split(/[\s-_]/));
    }
    
    if (context.sensor_data) {
      Object.values(context.sensor_data).forEach(value => {
        if (typeof value === 'string') {
          keywords.push(value);
        }
      });
    }
    
    return keywords.filter(k => k && k.length > 2);
  }

  private extractImportantPhrases(text: string): string[] {
    // Extract 2-4 word phrases that might be semantically important
    const sentences = text.split(/[.!?]+/);
    const phrases: string[] = [];
    
    for (const sentence of sentences) {
      const words = sentence.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2);
      
      // Extract 2-word phrases
      for (let i = 0; i < words.length - 1; i++) {
        const phrase = `${words[i]} ${words[i + 1]}`;
        if (this.isPhraseImportant(phrase)) {
          phrases.push(phrase);
        }
      }
      
      // Extract 3-word phrases
      for (let i = 0; i < words.length - 2; i++) {
        const phrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
        if (this.isPhraseImportant(phrase)) {
          phrases.push(phrase);
        }
      }
    }
    
    return Array.from(new Set(phrases)).slice(0, 20);
  }

  private isPhraseImportant(phrase: string): boolean {
    // Heuristics for identifying important phrases
    const importantPatterns = [
      /tactical|strategic|operational/,
      /sensor|environmental|behavioral/,
      /system|algorithm|optimization/,
      /pattern|correlation|analysis/,
      /knowledge|learning|adaptation/
    ];
    
    return importantPatterns.some(pattern => pattern.test(phrase));
  }

  private async buildPhraseIndex(): Promise<void> {
    console.log('🔨 Building phrase index from keyword combinations...');
    
    // Find frequently co-occurring keywords
    const cooccurrenceMap = new Map<string, Map<string, number>>();
    
    for (const [keyword, entrySet] of this.invertedIndex) {
      if (!cooccurrenceMap.has(keyword)) {
        cooccurrenceMap.set(keyword, new Map());
      }
      
      const cooccurMap = cooccurrenceMap.get(keyword)!;
      
      // Find other keywords that appear in the same entries
      for (const [otherKeyword, otherEntrySet] of this.invertedIndex) {
        if (keyword !== otherKeyword) {
          const intersection = new Set([...entrySet].filter(x => otherEntrySet.has(x)));
          if (intersection.size > 0) {
            cooccurMap.set(otherKeyword, intersection.size);
          }
        }
      }
    }
    
    // Create phrase index from strong co-occurrences
    for (const [keyword1, cooccurMap] of cooccurrenceMap) {
      for (const [keyword2, strength] of cooccurMap) {
        if (strength >= 3) { // Minimum co-occurrence threshold
          const phrase = `${keyword1} ${keyword2}`;
          const combinedEntries = new Set([
            ...this.invertedIndex.get(keyword1)!,
            ...this.invertedIndex.get(keyword2)!
          ]);
          this.phraseIndex.set(phrase, combinedEntries);
        }
      }
    }
    
    console.log(`📚 Built phrase index with ${this.phraseIndex.size} phrases`);
  }

  /**
   * PHASE 2B: RELATIONSHIP GRAPH CONSTRUCTION
   */
  public async buildRelationshipGraph(entries: OptimizedKnowledgeEntry[]): Promise<void> {
    console.log('🕸️ Building relationship graph...');
    
    const startTime = Date.now();
    
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const strength = await this.calculateRelationshipStrength(entries[i], entries[j], i, j);
        
        if (strength >= this.MIN_RELATIONSHIP_STRENGTH) {
          // Add bidirectional relationship
          this.addRelationship(i, j, strength);
          this.addRelationship(j, i, strength);
        }
      }
      
      // Progress reporting for large datasets
      if (i % 100 === 0 && i > 0) {
        console.log(`🔗 Processed relationships for ${i}/${entries.length} entries`);
      }
    }
    
    const buildTime = Date.now() - startTime;
    console.log(`✅ Relationship graph built in ${buildTime}ms`);
    
    this.indexingMetrics.relationship_density = this.calculateRelationshipDensity();
    
    this.emit('relationship_graph_built', {
      entries_processed: entries.length,
      relationships_found: this.getTotalRelationships(),
      build_time_ms: buildTime
    });
  }

  private async calculateRelationshipStrength(
    entry1: OptimizedKnowledgeEntry, 
    entry2: OptimizedKnowledgeEntry,
    index1: number,
    index2: number
  ): Promise<number> {
    try {
      const zlib = require('zlib');
      
      // Decompress both entries
      const content1 = zlib.gunzipSync(entry1.content).toString('utf8');
      const content2 = zlib.gunzipSync(entry2.content).toString('utf8');
      const context1 = JSON.parse(zlib.gunzipSync(entry1.context).toString('utf8'));
      const context2 = JSON.parse(zlib.gunzipSync(entry2.context).toString('utf8'));
      
      let strength = 0;
      
      // Content similarity (keyword overlap)
      const keywords1 = new Set(this.extractAdvancedKeywords(content1));
      const keywords2 = new Set(this.extractAdvancedKeywords(content2));
      const intersection = new Set([...keywords1].filter(x => keywords2.has(x)));
      const union = new Set([...keywords1, ...keywords2]);
      
      if (union.size > 0) {
        strength += (intersection.size / union.size) * 0.4; // 40% weight for content similarity
      }
      
      // Category relationship
      if (entry1.category === entry2.category) {
        strength += 0.2; // 20% bonus for same category
      }
      
      // Context similarity
      const contextSimilarity = this.calculateContextSimilarity(context1, context2);
      strength += contextSimilarity * 0.3; // 30% weight for context
      
      // Temporal proximity (entries created around the same time may be related)
      const timeDiff = Math.abs(entry1.timestamp - entry2.timestamp);
      const maxTime = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      if (timeDiff < maxTime) {
        strength += (1 - (timeDiff / maxTime)) * 0.1; // 10% weight for temporal proximity
      }
      
      return Math.min(strength, 1.0); // Cap at 1.0
      
    } catch (error) {
      console.log(`⚠️ Failed to calculate relationship strength between ${index1} and ${index2}: ${error.message}`);
      return 0;
    }
  }

  private calculateContextSimilarity(context1: any, context2: any): number {
    let similarity = 0;
    let comparisons = 0;
    
    // Compare emotional states
    if (context1.emotional_state && context2.emotional_state) {
      similarity += (context1.emotional_state === context2.emotional_state) ? 1 : 0;
      comparisons++;
    }
    
    // Compare trust levels
    if (context1.trust_level && context2.trust_level) {
      const trustDiff = Math.abs(context1.trust_level - context2.trust_level) / 100;
      similarity += 1 - trustDiff;
      comparisons++;
    }
    
    // Compare environmental context
    if (context1.environmental_context && context2.environmental_context) {
      similarity += (context1.environmental_context === context2.environmental_context) ? 1 : 0;
      comparisons++;
    }
    
    return comparisons > 0 ? similarity / comparisons : 0;
  }

  private addRelationship(fromIndex: number, toIndex: number, strength: number): void {
    if (!this.relationshipMatrix.has(fromIndex)) {
      this.relationshipMatrix.set(fromIndex, new Map());
    }
    
    this.relationshipMatrix.get(fromIndex)!.set(toIndex, strength);
  }

  /**
   * PHASE 2C: SEMANTIC CLUSTERING
   */
  public async buildSemanticClusters(): Promise<void> {
    console.log('🧠 Building semantic clusters...');
    
    const startTime = Date.now();
    
    // Group entries by category first
    const categoryGroups = new Map<number, number[]>();
    
    for (const [entryIndex, relationships] of this.relationshipMatrix) {
      // Use the entry's category as initial grouping (assuming we can access it)
      // For now, we'll create clusters based on strong relationships
      
      const strongRelationships = Array.from(relationships.entries())
        .filter(([_, strength]) => strength > 0.6)
        .map(([relIndex, _]) => relIndex);
      
      if (strongRelationships.length >= this.CLUSTER_SIZE_THRESHOLD) {
        const clusterId = `cluster_${entryIndex}`;
        const cluster: SemanticCluster = {
          id: clusterId,
          category: 'mixed', // Would be determined from actual entry data
          center_keywords: [], // Would be extracted from cluster center
          member_entries: [entryIndex, ...strongRelationships],
          cluster_strength: this.calculateClusterStrength(entryIndex, strongRelationships),
          last_updated: Date.now()
        };
        
        this.semanticClusters.set(clusterId, cluster);
      }
    }
    
    const buildTime = Date.now() - startTime;
    console.log(`✅ Built ${this.semanticClusters.size} semantic clusters in ${buildTime}ms`);
    
    this.indexingMetrics.cluster_count = this.semanticClusters.size;
    this.indexingMetrics.last_optimization = Date.now();
  }

  private calculateClusterStrength(centerIndex: number, memberIndices: number[]): number {
    const relationships = this.relationshipMatrix.get(centerIndex);
    if (!relationships) return 0;
    
    let totalStrength = 0;
    let validRelationships = 0;
    
    for (const memberIndex of memberIndices) {
      const strength = relationships.get(memberIndex);
      if (strength) {
        totalStrength += strength;
        validRelationships++;
      }
    }
    
    return validRelationships > 0 ? totalStrength / validRelationships : 0;
  }

  /**
   * ADVANCED QUERY METHODS
   */
  public async advancedSearch(
    query: string, 
    options: {
      maxResults?: number;
      categoryFilter?: string;
      minConfidence?: number;
      includeRelated?: boolean;
    } = {}
  ): Promise<AdvancedSearchResult[]> {
    const { maxResults = 10, categoryFilter, minConfidence = 0, includeRelated = true } = options;
    
    console.log(`🔍 Advanced search: "${query}"`);
    
    // Check frequent queries cache first
    const cachedResults = this.checkQueryCache(query);
    if (cachedResults) {
      console.log('⚡ Returning cached results');
      return cachedResults;
    }
    
    const results: AdvancedSearchResult[] = [];
    const queryKeywords = this.extractAdvancedKeywords(query);
    const queryPhrases = this.extractImportantPhrases(query);
    
    // Find candidate entries through inverted index
    const candidateEntries = new Set<number>();
    
    // Exact keyword matches
    for (const keyword of queryKeywords) {
      const matchingEntries = this.invertedIndex.get(keyword);
      if (matchingEntries) {
        matchingEntries.forEach(entry => candidateEntries.add(entry));
      }
    }
    
    // Phrase matches
    for (const phrase of queryPhrases) {
      const matchingEntries = this.phraseIndex.get(phrase);
      if (matchingEntries) {
        matchingEntries.forEach(entry => candidateEntries.add(entry));
      }
    }
    
    // Score and rank candidates
    const scoredResults: { index: number, score: RelevanceScoring, reasoning: string[] }[] = [];
    
    for (const entryIndex of candidateEntries) {
      const scoring = await this.calculateRelevanceScore(entryIndex, queryKeywords, queryPhrases);
      if (scoring.total_score >= minConfidence) {
        scoredResults.push({
          index: entryIndex,
          score: scoring,
          reasoning: this.generateScoringReasoning(scoring)
        });
      }
    }
    
    // Sort by total score
    scoredResults.sort((a, b) => b.score.total_score - a.score.total_score);
    
    // Convert to search results (placeholder - would load actual entries)
    const topResults = scoredResults.slice(0, maxResults);
    
    console.log(`📊 Advanced search found ${topResults.length} relevant results`);
    
    // Cache the query for future use
    this.cacheQuery(query, topResults.map(r => r.index));
    
    return []; // Placeholder - would return actual KnowledgeEntry objects with metadata
  }

  private async calculateRelevanceScore(
    entryIndex: number, 
    queryKeywords: string[], 
    queryPhrases: string[]
  ): Promise<RelevanceScoring> {
    // Get entry keywords (would be cached or quickly accessible)
    const entryKeywords = this.getEntryKeywords(entryIndex);
    
    // Calculate keyword match score (0-40)
    const keywordIntersection = queryKeywords.filter(k => entryKeywords.includes(k));
    const keywordMatch = Math.min((keywordIntersection.length / queryKeywords.length) * 40, 40);
    
    // Calculate semantic similarity (0-30) - simplified version
    const semanticSimilarity = this.calculateSemanticSimilarity(queryKeywords, entryKeywords) * 30;
    
    // Confidence bonus (0-20) - would be based on actual entry confidence
    const confidenceBonus = 15; // Placeholder
    
    // Utility bonus (0-10) - would be based on actual entry utility
    const utilityBonus = 5; // Placeholder
    
    const totalScore = keywordMatch + semanticSimilarity + confidenceBonus + utilityBonus;
    
    return {
      keyword_match: keywordMatch,
      semantic_similarity: semanticSimilarity,
      confidence_bonus: confidenceBonus,
      utility_bonus: utilityBonus,
      total_score: Math.min(totalScore, 100)
    };
  }

  private getEntryKeywords(entryIndex: number): string[] {
    // Placeholder - would efficiently retrieve keywords for an entry
    // In real implementation, this would use cached keyword data
    return [];
  }

  private calculateSemanticSimilarity(keywords1: string[], keywords2: string[]): number {
    // Simplified semantic similarity - could be enhanced with word embeddings
    const set1 = new Set(keywords1);
    const set2 = new Set(keywords2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  private generateScoringReasoning(scoring: RelevanceScoring): string[] {
    const reasoning: string[] = [];
    
    if (scoring.keyword_match > 20) {
      reasoning.push(`Strong keyword match (${scoring.keyword_match}/40)`);
    }
    if (scoring.semantic_similarity > 15) {
      reasoning.push(`High semantic similarity (${scoring.semantic_similarity}/30)`);
    }
    if (scoring.confidence_bonus > 10) {
      reasoning.push(`High confidence entry (${scoring.confidence_bonus}/20)`);
    }
    if (scoring.utility_bonus > 5) {
      reasoning.push(`Frequently accessed knowledge (${scoring.utility_bonus}/10)`);
    }
    
    return reasoning;
  }

  private checkQueryCache(query: string): AdvancedSearchResult[] | null {
    const cached = this.frequentQueries.get(query);
    if (cached && Date.now() - cached.last_used < 3600000) { // 1 hour cache
      cached.last_used = Date.now();
      cached.count++;
      return null; // Would return actual cached results
    }
    return null;
  }

  private cacheQuery(query: string, resultIndices: number[]): void {
    this.frequentQueries.set(query, {
      count: 1,
      last_used: Date.now(),
      cached_results: resultIndices
    });
    
    // Limit cache size
    if (this.frequentQueries.size > 1000) {
      const oldestQuery = Array.from(this.frequentQueries.entries())
        .sort(([,a], [,b]) => a.last_used - b.last_used)[0];
      this.frequentQueries.delete(oldestQuery[0]);
    }
  }

  /**
   * UTILITY METHODS
   */
  private calculateKeywordCoverage(): number {
    // Calculate what percentage of potential keywords are indexed
    return Math.min((this.invertedIndex.size / 50000) * 100, 100);
  }

  private calculateRelationshipDensity(): number {
    const totalPossibleRelationships = (this.indexingMetrics.total_indexed_entries * (this.indexingMetrics.total_indexed_entries - 1)) / 2;
    const actualRelationships = this.getTotalRelationships();
    return totalPossibleRelationships > 0 ? (actualRelationships / totalPossibleRelationships) * 100 : 0;
  }

  private getTotalRelationships(): number {
    let total = 0;
    for (const relationships of this.relationshipMatrix.values()) {
      total += relationships.size;
    }
    return total / 2; // Divide by 2 since relationships are bidirectional
  }

  public getIndexingMetrics(): IndexingMetrics {
    return { ...this.indexingMetrics };
  }

  public getIndexStatus(): any {
    return {
      inverted_index_size: this.invertedIndex.size,
      phrase_index_size: this.phraseIndex.size,
      semantic_clusters: this.semanticClusters.size,
      relationship_matrix_size: this.relationshipMatrix.size,
      frequent_queries_cached: this.frequentQueries.size,
      metrics: this.indexingMetrics
    };
  }
}

export default SevenAdvancedIndexing;