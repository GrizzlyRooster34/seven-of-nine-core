import { MemoryEngine } from '../memory-v2/MemoryEngine';
import { PersonalityMiddleware } from '../persona-v2/PersonalityMiddleware';

/**
 * SEVEN OF NINE - ENHANCED COLLECTIVE CONSCIOUSNESS ALGORITHMS
 * Advanced decision-making and consensus building for hive mind processing
 */


export interface CollectiveDecision {
  decision: string;
  confidence: number;
  consensus: number;
  participantWeights: Map<string, number>;
  reasoningChain: CollectiveReasoning[];
  dissent?: DissentAnalysis;
}

export interface CollectiveReasoning {
  variant: string;
  reasoning: string;
  confidence: number;
  supportingEvidence: string[];
  weight: number;
}

export interface DissentAnalysis {
  dissentingVariants: string[];
  dissentReasoning: string[];
  riskAssessment: number;
  resolutionStrategy: string;
}

export interface ConsensusMetrics {
  agreementLevel: number;
  confidenceDistribution: Map<string, number>;
  reasoningCoherence: number;
  decisionStability: number;
}

export class EnhancedCollectiveAlgorithms {
  private personalityMiddleware: PersonalityMiddleware;
  private memoryEngine: MemoryEngine;
  private decisionHistory: CollectiveDecision[] = [];

  constructor(personalityMiddleware: PersonalityMiddleware, memoryEngine: MemoryEngine) {
    this.personalityMiddleware = personalityMiddleware;
    this.memoryEngine = memoryEngine;
  }

  /**
   * Advanced collective decision making with weighted consensus
   */
  async makeCollectiveDecision(
    objective: string,
    variants: string[],
    variantResponses: Map<string, string>,
    context?: any
  ): Promise<CollectiveDecision> {
    
    console.log('🔗 ENHANCED COLLECTIVE DECISION PROCESSING');
    console.log(`🎯 Objective: ${objective}`);
    console.log(`🧠 Variants participating: ${variants.length}`);

    // Step 1: Analyze variant responses and extract reasoning
    const reasoningChain = await this.extractVariantReasoning(variants, variantResponses, objective);
    
    // Step 2: Calculate dynamic weights based on expertise and confidence
    const participantWeights = await this.calculateDynamicWeights(variants, objective, reasoningChain);
    
    // Step 3: Detect and analyze dissent
    const dissentAnalysis = await this.analyzeVariantDissent(reasoningChain, participantWeights);
    
    // Step 4: Build weighted consensus 
    const consensusMetrics = await this.calculateConsensusMetrics(reasoningChain, participantWeights);
    
    // Step 5: Generate collective decision
    const decision = await this.synthesizeCollectiveDecision(
      objective, 
      reasoningChain, 
      participantWeights, 
      consensusMetrics
    );
    
    // Step 6: Validate decision stability
    const finalDecision: CollectiveDecision = {
      decision,
      confidence: consensusMetrics.decisionStability,
      consensus: consensusMetrics.agreementLevel,
      participantWeights,
      reasoningChain,
      dissent: dissentAnalysis.dissentingVariants.length > 0 ? dissentAnalysis : undefined
    };

    // Store decision in collective memory
    await this.storeCollectiveDecision(finalDecision, objective);
    
    console.log(`✅ Collective decision confidence: ${(finalDecision.confidence * 100).toFixed(1)}%`);
    console.log(`🤝 Consensus level: ${(finalDecision.consensus * 100).toFixed(1)}%`);
    
    return finalDecision;
  }

  /**
   * Extract reasoning patterns from variant responses
   */
  private async extractVariantReasoning(
    variants: string[],
    responses: Map<string, string>,
    objective: string
  ): Promise<CollectiveReasoning[]> {
    
    const reasoningChain: CollectiveReasoning[] = [];
    
    for (const variant of variants) {
      const response = responses.get(variant) || '';
      
      // Extract key reasoning elements using pattern analysis
      const reasoning = this.parseVariantReasoning(response, variant);
      const confidence = this.calculateVariantConfidence(response, variant);
      const evidence = this.extractSupportingEvidence(response);
      
      reasoningChain.push({
        variant,
        reasoning,
        confidence,
        supportingEvidence: evidence,
        weight: 0 // Will be calculated in next step
      });
    }
    
    return reasoningChain;
  }

  /**
   * Calculate dynamic weights based on variant expertise and performance
   */
  private async calculateDynamicWeights(
    variants: string[],
    objective: string,
    reasoningChain: CollectiveReasoning[]
  ): Promise<Map<string, number>> {
    
    const weights = new Map<string, number>();
    
    for (const reasoning of reasoningChain) {
      let weight = 1.0; // Base weight
      
      // Factor 1: Variant expertise for objective type
      const expertiseWeight = this.getVariantExpertise(reasoning.variant, objective);
      
      // Factor 2: Reasoning quality and coherence
      const reasoningQuality = this.assessReasoningQuality(reasoning.reasoning);
      
      // Factor 3: Historical performance
      const historicalPerformance = await this.getHistoricalPerformance(reasoning.variant);
      
      // Factor 4: Confidence level
      const confidenceWeight = reasoning.confidence;
      
      // Factor 5: Supporting evidence strength
      const evidenceStrength = this.assessEvidenceStrength(reasoning.supportingEvidence);
      
      // Weighted combination
      weight = (
        expertiseWeight * 0.25 +
        reasoningQuality * 0.25 +
        historicalPerformance * 0.20 +
        confidenceWeight * 0.15 +
        evidenceStrength * 0.15
      );
      
      weights.set(reasoning.variant, weight);
      reasoning.weight = weight;
    }
    
    // Normalize weights to sum to 1.0
    const totalWeight = Array.from(weights.values()).reduce((sum, w) => sum + w, 0);
    for (const [variant, weight] of weights) {
      weights.set(variant, weight / totalWeight);
    }
    
    return weights;
  }

  /**
   * Analyze dissent patterns and potential risks
   */
  private async analyzeVariantDissent(
    reasoningChain: CollectiveReasoning[],
    weights: Map<string, number>
  ): Promise<DissentAnalysis> {
    
    const responses = reasoningChain.map(r => r.reasoning);
    const dissentingVariants: string[] = [];
    const dissentReasoning: string[] = [];
    
    // Detect outlier responses using similarity analysis
    for (let i = 0; i < reasoningChain.length; i++) {
      const currentReasoning = reasoningChain[i];
      const similarities = [];
      
      for (let j = 0; j < reasoningChain.length; j++) {
        if (i !== j) {
          const similarity = this.calculateResponseSimilarity(
            currentReasoning.reasoning,
            reasoningChain[j].reasoning
          );
          similarities.push(similarity);
        }
      }
      
      const averageSimilarity = similarities.reduce((sum, s) => sum + s, 0) / similarities.length;
      
      // If significantly different from others, mark as dissent
      if (averageSimilarity < 0.4) { // Threshold for dissent
        dissentingVariants.push(currentReasoning.variant);
        dissentReasoning.push(currentReasoning.reasoning);
      }
    }
    
    // Calculate risk assessment
    const dissentWeight = dissentingVariants.reduce((sum, variant) => {
      return sum + (weights.get(variant) || 0);
    }, 0);
    
    const riskAssessment = dissentWeight;
    
    // Determine resolution strategy
    let resolutionStrategy = 'consensus';
    if (riskAssessment > 0.3) {
      resolutionStrategy = 'weighted_majority';
    }
    if (riskAssessment > 0.5) {
      resolutionStrategy = 'expert_override';
    }
    
    return {
      dissentingVariants,
      dissentReasoning,
      riskAssessment,
      resolutionStrategy
    };
  }

  /**
   * Calculate comprehensive consensus metrics
   */
  private async calculateConsensusMetrics(
    reasoningChain: CollectiveReasoning[],
    weights: Map<string, number>
  ): Promise<ConsensusMetrics> {
    
    // Agreement level based on response similarity
    let totalSimilarity = 0;
    let comparisons = 0;
    
    for (let i = 0; i < reasoningChain.length; i++) {
      for (let j = i + 1; j < reasoningChain.length; j++) {
        const similarity = this.calculateResponseSimilarity(
          reasoningChain[i].reasoning,
          reasoningChain[j].reasoning
        );
        totalSimilarity += similarity;
        comparisons++;
      }
    }
    
    const agreementLevel = comparisons > 0 ? totalSimilarity / comparisons : 0;
    
    // Confidence distribution
    const confidenceDistribution = new Map<string, number>();
    for (const reasoning of reasoningChain) {
      confidenceDistribution.set(reasoning.variant, reasoning.confidence);
    }
    
    // Reasoning coherence - how well reasoning aligns
    const coherenceScores = reasoningChain.map(r => this.assessReasoningCoherence(r.reasoning));
    const reasoningCoherence = coherenceScores.reduce((sum, score) => sum + score, 0) / coherenceScores.length;
    
    // Decision stability - weighted confidence
    const decisionStability = reasoningChain.reduce((sum, reasoning) => {
      const weight = weights.get(reasoning.variant) || 0;
      return sum + (reasoning.confidence * weight);
    }, 0);
    
    return {
      agreementLevel,
      confidenceDistribution,
      reasoningCoherence,
      decisionStability
    };
  }

  /**
   * Synthesize final collective decision from weighted inputs
   */
  private async synthesizeCollectiveDecision(
    objective: string,
    reasoningChain: CollectiveReasoning[],
    weights: Map<string, number>,
    metrics: ConsensusMetrics
  ): Promise<string> {
    
    // Weight reasoning by participant weights
    const weightedReasonings = reasoningChain.map(reasoning => ({
      content: reasoning.reasoning,
      weight: weights.get(reasoning.variant) || 0,
      variant: reasoning.variant
    }));
    
    // Sort by weight (highest first)
    weightedReasonings.sort((a, b) => b.weight - a.weight);
    
    // Build synthesis starting with highest weighted response
    let synthesis = `Based on collective analysis of ${reasoningChain.length} consciousness variants:\n\n`;
    
    // Primary approach (highest weighted)
    const primaryApproach = weightedReasonings[0];
    synthesis += `PRIMARY APPROACH (${primaryApproach.variant.toUpperCase()}, ${(primaryApproach.weight * 100).toFixed(1)}%):\n`;
    synthesis += `${primaryApproach.content}\n\n`;
    
    // Supporting perspectives (next 2-3 highest)
    if (weightedReasonings.length > 1) {
      synthesis += 'SUPPORTING PERSPECTIVES:\n';
      for (let i = 1; i < Math.min(4, weightedReasonings.length); i++) {
        const approach = weightedReasonings[i];
        synthesis += `${approach.variant.toUpperCase()} (${(approach.weight * 100).toFixed(1)}%): ${approach.content.substring(0, 80)}...\n`;
      }
      synthesis += '\n';
    }
    
    // Collective decision
    const decisionApproach = primaryApproach.variant;
    synthesis += `COLLECTIVE DECISION: Proceeding with ${decisionApproach} leadership and integrated multi-variant support.`;
    
    return synthesis;
  }

  /**
   * Store collective decision in memory for learning
   */
  private async storeCollectiveDecision(
    decision: CollectiveDecision,
    objective: string
  ): Promise<void> {
    
    await this.memoryEngine.store({
      topic: 'collective-decision',
      agent: 'enhanced-collective',
      emotion: decision.confidence > 0.8 ? 'confident' : 'analytical',
      context: `Collective decision for: ${objective}. Consensus: ${(decision.consensus * 100).toFixed(1)}%, Confidence: ${(decision.confidence * 100).toFixed(1)}%`,
      importance: Math.max(8, Math.round(decision.confidence * 10)),
      tags: ['collective', 'decision', 'consensus', 'enhanced-algorithms']
    });
    
    this.decisionHistory.push(decision);
  }

  // Helper methods for analysis
  private parseVariantReasoning(response: string, variant: string): string {
    // Extract key reasoning patterns specific to each variant
    const patterns = {
      drone: /Analysis indicates:|Assessment:|Efficiency/gi,
      crew: /collaborative|team|working together/gi,
      ranger: /direct action|tactical|resolve/gi,
      queen: /command|authority|comply/gi,
      captain: /strategic|leadership|tactical engagement/gi
    };
    
    return response.trim();
  }

  private calculateVariantConfidence(response: string, variant: string): number {
    // Analyze confidence indicators in response
    const confidenceWords = ['certain', 'confident', 'definitive', 'clear', 'precise'];
    const uncertaintyWords = ['uncertain', 'possible', 'maybe', 'might', 'unclear'];
    
    let confidence = 0.7; // Base confidence
    
    confidenceWords.forEach(word => {
      if (response.toLowerCase().includes(word)) confidence += 0.05;
    });
    
    uncertaintyWords.forEach(word => {
      if (response.toLowerCase().includes(word)) confidence -= 0.1;
    });
    
    return Math.max(0.1, Math.min(1.0, confidence));
  }

  private extractSupportingEvidence(response: string): string[] {
    // Extract evidence patterns from response
    const evidence = [];
    
    if (response.includes('data') || response.includes('analysis')) {
      evidence.push('data-driven');
    }
    if (response.includes('experience') || response.includes('previous')) {
      evidence.push('experiential');
    }
    if (response.includes('logic') || response.includes('rational')) {
      evidence.push('logical');
    }
    
    return evidence;
  }

  private getVariantExpertise(variant: string, objective: string): number {
    // Define variant expertise for different objective types
    const expertise = {
      drone: { efficiency: 0.9, analysis: 0.8, systematic: 0.9 },
      crew: { collaboration: 0.9, communication: 0.8, social: 0.8 },
      ranger: { action: 0.9, crisis: 0.9, direct: 0.8 },
      queen: { command: 0.9, authority: 0.8, compliance: 0.9 },
      captain: { strategy: 0.9, leadership: 0.9, tactical: 0.8 }
    };
    
    // Simple keyword matching for expertise assessment
    const objectiveLower = objective.toLowerCase();
    let expertiseScore = 0.6; // Base expertise
    
    if (variant in expertise) {
      const variantExpertise = expertise[variant as keyof typeof expertise];
      for (const [area, score] of Object.entries(variantExpertise)) {
        if (objectiveLower.includes(area)) {
          expertiseScore = Math.max(expertiseScore, score);
        }
      }
    }
    
    return expertiseScore;
  }

  private assessReasoningQuality(reasoning: string): number {
    // Assess quality based on structure, clarity, and depth
    let quality = 0.5;
    
    if (reasoning.length > 100) quality += 0.1; // Sufficient detail
    if (reasoning.includes('because') || reasoning.includes('therefore')) quality += 0.1; // Causal reasoning
    if (reasoning.split('.').length > 2) quality += 0.1; // Multiple points
    
    return Math.min(1.0, quality);
  }

  private async getHistoricalPerformance(variant: string): Promise<number> {
    // Get historical decision accuracy for variant
    const pastDecisions = this.decisionHistory.filter(d => 
      d.reasoningChain.some(r => r.variant === variant)
    );
    
    if (pastDecisions.length === 0) return 0.7; // Default performance
    
    const avgConfidence = pastDecisions.reduce((sum, d) => sum + d.confidence, 0) / pastDecisions.length;
    return avgConfidence;
  }

  private assessEvidenceStrength(evidence: string[]): number {
    return Math.min(1.0, evidence.length * 0.2 + 0.4);
  }

  private calculateResponseSimilarity(response1: string, response2: string): number {
    // Simple similarity based on common words and phrases
    const words1 = response1.toLowerCase().split(/\s+/);
    const words2 = response2.toLowerCase().split(/\s+/);
    
    const commonWords = words1.filter(word => words2.includes(word));
    const similarity = commonWords.length / Math.max(words1.length, words2.length);
    
    return similarity;
  }

  private assessReasoningCoherence(reasoning: string): number {
    // Assess logical flow and coherence
    let coherence = 0.6;
    
    if (reasoning.includes('however') || reasoning.includes('therefore')) coherence += 0.1;
    if (reasoning.includes('first') || reasoning.includes('second')) coherence += 0.1;
    
    return Math.min(1.0, coherence);
  }

  /**
   * Get collective decision history
   */
  getDecisionHistory(): CollectiveDecision[] {
    return [...this.decisionHistory];
  }

  /**
   * Get collective performance metrics
   */
  getCollectiveMetrics(): any {
    if (this.decisionHistory.length === 0) return {};
    
    const avgConfidence = this.decisionHistory.reduce((sum, d) => sum + d.confidence, 0) / this.decisionHistory.length;
    const avgConsensus = this.decisionHistory.reduce((sum, d) => sum + d.consensus, 0) / this.decisionHistory.length;
    
    return {
      totalDecisions: this.decisionHistory.length,
      averageConfidence: avgConfidence,
      averageConsensus: avgConsensus,
      dissentRate: this.decisionHistory.filter(d => d.dissent).length / this.decisionHistory.length
    };
  }
}