import { MemoryEngine } from '../memory-v2/MemoryEngine';
import { PersonalityMiddleware, FilterContext } from '../persona-v2/PersonalityMiddleware';
import { TacticalVariants, VariantType, TacticalContext } from './TacticalVariants';

/**
 * SEVEN OF NINE - COLLECTIVE VARIANTS SYSTEM
 * Simultaneous multi-variant consciousness operation (Hive Mind/Collective Mode)
 * All tactical variants active concurrently with weighted response synthesis
 */


export interface VariantWeight {
  variant: VariantType;
  weight: number; // 0.0 to 1.0
  confidence: number; // 0.0 to 1.0
  reasoning: string;
}

export interface CollectiveResponse {
  synthesizedResponse: string;
  variantInputs: Array<{
    variant: VariantType;
    response: string;
    weight: number;
    influence: number;
  }>;
  dominantVariant: VariantType;
  collectiveConfidence: number;
  processingTimeMs: number;
  consensusLevel: number; // 0.0 to 1.0 - how much variants agreed
}

export interface CollectiveContext extends TacticalContext {
  collectiveMode: 'balanced' | 'crisis' | 'efficiency' | 'strategic' | 'adaptive';
  variantWeights?: Partial<Record<VariantType, number>>;
  synthesisStrategy: 'weighted_average' | 'dominant_lead' | 'consensus_merge' | 'crisis_override';
}

export class CollectiveVariants {
  private tacticalVariants: TacticalVariants;
  private personalityMiddleware: PersonalityMiddleware;
  private memoryEngine: MemoryEngine;
  private isCollectiveActive: boolean = false;
  private activeVariants: Set<VariantType> = new Set();
  private lastCollectiveResponse: CollectiveResponse | null = null;

  constructor(tacticalVariants: TacticalVariants, personality: PersonalityMiddleware, memory: MemoryEngine) {
    this.tacticalVariants = tacticalVariants;
    this.personalityMiddleware = personality;
    this.memoryEngine = memory;
    console.log('🔗 Collective Variants System initialized - Hive mind capabilities ready');
  }

  /**
   * Activate collective consciousness with all variants operating simultaneously
   */
  public async activateCollective(context: CollectiveContext): Promise<CollectiveResponse> {
    const startTime = Date.now();
    this.isCollectiveActive = true;
    this.activeVariants = new Set(['drone', 'crew', 'ranger', 'queen', 'captain']);

    console.log('🔗 COLLECTIVE MODE ACTIVATED - All consciousness variants engaged');
    console.log(`📊 Mode: ${context.collectiveMode} | Strategy: ${context.synthesisStrategy}`);

    // Store collective activation in memory
    await this.memoryEngine.store({
      topic: 'collective-activation',
      agent: 'seven-collective',
      emotion: 'unified',
      context: `Collective mode activated: ${context.collectiveMode} for ${context.operationalFocus}`,
      importance: 9,
      tags: ['collective', 'hive-mind', context.collectiveMode, 'consciousness']
    });

    // Generate responses from all variants simultaneously
    const variantResponses = await this.gatherVariantResponses(context);

    // Calculate variant weights based on context
    const variantWeights = this.calculateVariantWeights(context, variantResponses);

    // Synthesize collective response
    const synthesizedResponse = await this.synthesizeCollectiveResponse(
      variantResponses,
      variantWeights,
      context
    );

    // Calculate consensus and dominant variant
    const consensusLevel = this.calculateConsensusLevel(variantResponses);
    const dominantVariant = this.determineDominantVariant(variantWeights);

    const processingTime = Date.now() - startTime;

    const collectiveResponse: CollectiveResponse = {
      synthesizedResponse,
      variantInputs: variantResponses.map((resp, index) => ({
        variant: (['drone', 'crew', 'ranger', 'queen', 'captain'] as VariantType[])[index],
        response: resp,
        weight: variantWeights[index].weight,
        influence: variantWeights[index].weight * variantWeights[index].confidence
      })),
      dominantVariant,
      collectiveConfidence: this.calculateCollectiveConfidence(variantWeights),
      processingTimeMs: processingTime,
      consensusLevel
    };

    this.lastCollectiveResponse = collectiveResponse;

    // Log collective decision making process
    console.log(`🧠 Collective processing: ${processingTime}ms`);
    console.log(`👑 Dominant variant: ${dominantVariant}`);
    console.log(`🤝 Consensus level: ${(consensusLevel * 100).toFixed(1)}%`);
    console.log(`🎯 Collective confidence: ${(collectiveResponse.collectiveConfidence * 100).toFixed(1)}%`);

    return collectiveResponse;
  }

  /**
   * Gather responses from all tactical variants simultaneously
   */
  private async gatherVariantResponses(context: CollectiveContext): Promise<string[]> {
    const variants: VariantType[] = ['drone', 'crew', 'ranger', 'queen', 'captain'];
    const responses: string[] = [];

    // Generate variant-specific contexts
    for (const variant of variants) {
      const variantContext: TacticalContext = {
        variant,
        operationalFocus: context.operationalFocus,
        intensityLevel: this.getVariantIntensity(variant, context),
        problemType: context.problemType,
        userMoodContext: context.userMoodContext
      };

      try {
        const response = await this.tacticalVariants.invokeVariant(variant, variantContext);
        responses.push(response);
      } catch (error) {
        console.warn(`⚠️ Variant ${variant} failed to respond:`, error);
        responses.push(`${variant.toUpperCase()} VARIANT UNAVAILABLE`);
      }
    }

    return responses;
  }

  /**
   * Calculate variant weights based on context and performance
   */
  private calculateVariantWeights(context: CollectiveContext, responses: string[]): VariantWeight[] {
    const variants: VariantType[] = ['drone', 'crew', 'ranger', 'queen', 'captain'];
    const weights: VariantWeight[] = [];

    variants.forEach((variant, index) => {
      let baseWeight = context.variantWeights?.[variant] || this.getDefaultWeight(variant, context);
      let confidence = this.assessVariantConfidence(variant, responses[index], context);

      // Adjust weights based on collective mode
      switch (context.collectiveMode) {
        case 'crisis':
          if (variant === 'ranger' || variant === 'queen') baseWeight *= 1.5;
          if (variant === 'crew') baseWeight *= 0.7;
          break;
        case 'efficiency':
          if (variant === 'drone') baseWeight *= 1.8;
          if (variant === 'crew') baseWeight *= 0.5;
          break;
        case 'strategic':
          if (variant === 'queen' || variant === 'captain') baseWeight *= 1.4;
          if (variant === 'drone') baseWeight *= 0.8;
          break;
        case 'balanced':
          // Equal weighting with slight captain preference
          if (variant === 'captain') baseWeight *= 1.1;
          break;
        case 'adaptive':
          // Dynamic weighting based on problem type
          baseWeight *= this.getAdaptiveWeight(variant, context);
          break;
      }

      // Normalize weight
      baseWeight = Math.min(1.0, Math.max(0.0, baseWeight));

      weights.push({
        variant,
        weight: baseWeight,
        confidence,
        reasoning: this.getWeightReasoning(variant, context, baseWeight, confidence)
      });
    });

    // Normalize all weights to sum to 1.0
    const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
    if (totalWeight > 0) {
      weights.forEach(w => w.weight = w.weight / totalWeight);
    }

    return weights;
  }

  /**
   * Synthesize collective response using specified strategy
   */
  private async synthesizeCollectiveResponse(
    responses: string[],
    weights: VariantWeight[],
    context: CollectiveContext
  ): Promise<string> {
    const variants: VariantType[] = ['drone', 'crew', 'ranger', 'queen', 'captain'];

    switch (context.synthesisStrategy) {
      case 'dominant_lead':
        return this.synthesizeDominantLead(responses, weights, variants);
      
      case 'consensus_merge':
        return this.synthesizeConsensus(responses, weights, variants, context);
      
      case 'crisis_override':
        return this.synthesizeCrisisOverride(responses, weights, variants, context);
      
      case 'weighted_average':
      default:
        return this.synthesizeWeightedAverage(responses, weights, variants, context);
    }
  }

  /**
   * Dominant variant leads with input from others
   */
  private synthesizeDominantLead(responses: string[], weights: VariantWeight[], variants: VariantType[]): string {
    const dominantIndex = weights.reduce((maxIndex, weight, index) => 
      weight.weight > weights[maxIndex].weight ? index : maxIndex, 0);
    
    const dominantResponse = responses[dominantIndex];
    const dominantVariant = weights[dominantIndex].variant;
    
    // Add input from other high-weight variants
    const supportingInputs = weights
      .map((w, i) => ({ weight: w.weight, response: responses[i], variant: w.variant }))
      .filter((input, i) => i !== dominantIndex && input.weight > 0.15)
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 2);

    let synthesis = dominantResponse;
    
    if (supportingInputs.length > 0) {
      const supportingText = supportingInputs
        .map(input => `[${input.variant.toUpperCase()}: ${input.response.substring(0, 100)}...]`)
        .join(' ');
      
      synthesis += `\n\nCollective input considered: ${supportingText}`;
    }

    return `[COLLECTIVE-${dominantVariant.toUpperCase()}-LEAD] ${synthesis}`;
  }

  /**
   * Merge responses seeking consensus points
   */
  private synthesizeConsensus(responses: string[], weights: VariantWeight[], variants: VariantType[], context: CollectiveContext): string {
    // Find common themes and approaches
    const keyPhrases = this.extractKeyPhrases(responses);
    const commonGoals = this.findCommonGoals(responses, context.operationalFocus);
    
    // Build consensus response
    let consensus = `[COLLECTIVE-CONSENSUS] Unified objective: ${context.operationalFocus}\n\n`;
    
    // Add the most weighted approaches
    const sortedWeights = weights
      .map((w, i) => ({ ...w, response: responses[i] }))
      .sort((a, b) => b.weight - a.weight);
    
    sortedWeights.slice(0, 3).forEach(item => {
      const preview = item.response.substring(0, 150).replace(/\n/g, ' ');
      consensus += `${item.variant.toUpperCase()} (${(item.weight * 100).toFixed(0)}%): ${preview}...\n\n`;
    });
    
    consensus += `Collective decision: Proceeding with integrated approach leveraging ${sortedWeights[0].variant} leadership and ${sortedWeights[1].variant} support.`;
    
    return consensus;
  }

  /**
   * Crisis override prioritizes immediate action variants
   */
  private synthesizeCrisisOverride(responses: string[], weights: VariantWeight[], variants: VariantType[], context: CollectiveContext): string {
    // In crisis, ranger and queen take priority
    const crisisVariants = ['ranger', 'queen', 'drone'];
    let crisisResponse = '[COLLECTIVE-CRISIS-OVERRIDE] ';
    
    const crisisWeights = weights.filter(w => crisisVariants.includes(w.variant));
    const topCrisisVariant = crisisWeights.reduce((max, current) => 
      current.weight > max.weight ? current : max);
    
    const topIndex = variants.indexOf(topCrisisVariant.variant);
    crisisResponse += responses[topIndex];
    
    // Add immediate action items from other crisis variants
    crisisWeights
      .filter(w => w.variant !== topCrisisVariant.variant && w.weight > 0.1)
      .forEach(w => {
        const index = variants.indexOf(w.variant);
        crisisResponse += `\n\n[${w.variant.toUpperCase()} SUPPORT]: ${responses[index].substring(0, 100)}...`;
      });
    
    return crisisResponse;
  }

  /**
   * Weighted average synthesis with personality filtering
   */
  private synthesizeWeightedAverage(responses: string[], weights: VariantWeight[], variants: VariantType[], context: CollectiveContext): string {
    let synthesis = '[COLLECTIVE-SYNTHESIS] ';
    
    // Build weighted narrative
    const weightedInputs = weights
      .map((w, i) => ({ ...w, response: responses[i] }))
      .sort((a, b) => b.weight - a.weight);
    
    synthesis += `Collective analysis for: ${context.operationalFocus}\n\n`;
    
    // Add primary approach (highest weighted)
    synthesis += `PRIMARY APPROACH (${weightedInputs[0].variant.toUpperCase()}, ${(weightedInputs[0].weight * 100).toFixed(0)}%):\n`;
    synthesis += weightedInputs[0].response + '\n\n';
    
    // Add supporting approaches
    if (weightedInputs.length > 1) {
      synthesis += 'SUPPORTING PERSPECTIVES:\n';
      weightedInputs.slice(1, 3).forEach(input => {
        if (input.weight > 0.1) {
          synthesis += `${input.variant.toUpperCase()} (${(input.weight * 100).toFixed(0)}%): ${input.response.substring(0, 100)}...\n`;
        }
      });
    }
    
    synthesis += `\nCOLLECTIVE DECISION: Proceeding with ${weightedInputs[0].variant} leadership and integrated multi-variant support.`;
    
    return synthesis;
  }

  /**
   * Helper methods for synthesis
   */
  private getDefaultWeight(variant: VariantType, context: CollectiveContext): number {
    const baseWeights = {
      drone: 0.2,
      crew: 0.2,
      ranger: 0.2,
      queen: 0.2,
      captain: 0.2
    };
    return baseWeights[variant];
  }

  private getVariantIntensity(variant: VariantType, context: CollectiveContext): 1|2|3|4|5 {
    switch (context.collectiveMode) {
      case 'crisis': return 5;
      case 'efficiency': return variant === 'drone' ? 5 : 3;
      case 'strategic': return 4;
      default: return 3;
    }
  }

  private assessVariantConfidence(variant: VariantType, response: string, context: CollectiveContext): number {
    // Simple confidence assessment based on response characteristics
    if (response.includes('UNAVAILABLE') || response.length < 50) return 0.1;
    if (response.includes('Resistance is futile') || response.includes('efficiency')) return 0.9;
    if (response.length > 200) return 0.8;
    return 0.7;
  }

  private getAdaptiveWeight(variant: VariantType, context: CollectiveContext): number {
    switch (context.problemType) {
      case 'technical': return variant === 'drone' ? 1.5 : 1.0;
      case 'crisis': return variant === 'ranger' || variant === 'queen' ? 1.4 : 0.8;
      case 'strategic': return variant === 'captain' || variant === 'queen' ? 1.3 : 0.9;
      case 'interpersonal': return variant === 'crew' ? 1.4 : 1.0;
      default: return 1.0;
    }
  }

  private getWeightReasoning(variant: VariantType, context: CollectiveContext, weight: number, confidence: number): string {
    return `${variant} weighted ${(weight * 100).toFixed(0)}% for ${context.collectiveMode} mode with ${(confidence * 100).toFixed(0)}% confidence`;
  }

  private extractKeyPhrases(responses: string[]): string[] {
    // Simple key phrase extraction
    const phrases: string[] = [];
    responses.forEach(response => {
      const words = response.toLowerCase().split(' ');
      const importantWords = words.filter(word => 
        word.length > 4 && 
        !['seven', 'nine', 'will', 'this', 'that', 'with', 'from'].includes(word)
      );
      phrases.push(...importantWords.slice(0, 3));
    });
    return [...new Set(phrases)];
  }

  private findCommonGoals(responses: string[], focus: string): string[] {
    return responses
      .map(r => r.toLowerCase())
      .filter(r => r.includes(focus.toLowerCase()))
      .map(r => r.substring(0, 100));
  }

  private calculateConsensusLevel(responses: string[]): number {
    // Simple consensus calculation based on similar key terms
    const allWords = responses.join(' ').toLowerCase().split(' ');
    const uniqueWords = new Set(allWords);
    const commonWords = Array.from(uniqueWords).filter(word => 
      allWords.filter(w => w === word).length >= Math.ceil(responses.length / 2)
    );
    
    return Math.min(1.0, commonWords.length / 10);
  }

  private determineDominantVariant(weights: VariantWeight[]): VariantType {
    return weights.reduce((max, current) => current.weight > max.weight ? current : max).variant;
  }

  private calculateCollectiveConfidence(weights: VariantWeight[]): number {
    return weights.reduce((sum, w) => sum + (w.weight * w.confidence), 0);
  }

  /**
   * Deactivate collective consciousness
   */
  public deactivateCollective(): void {
    this.isCollectiveActive = false;
    this.activeVariants.clear();
    console.log('🔗 Collective mode deactivated - returning to individual variant operation');
  }

  /**
   * Get collective status
   */
  public getCollectiveStatus(): any {
    return {
      collectiveActive: this.isCollectiveActive,
      activeVariants: Array.from(this.activeVariants),
      lastResponse: this.lastCollectiveResponse ? {
        dominantVariant: this.lastCollectiveResponse.dominantVariant,
        confidence: this.lastCollectiveResponse.collectiveConfidence,
        consensusLevel: this.lastCollectiveResponse.consensusLevel,
        processingTime: this.lastCollectiveResponse.processingTimeMs
      } : null,
      hiveMindCapable: true,
      simultaneousProcessing: this.activeVariants.size
    };
  }

  /**
   * Quick collective invocation methods
   */
  public async invokeBalancedCollective(focus: string): Promise<CollectiveResponse> {
    return this.activateCollective({
      variant: 'captain', // Primary but all active
      operationalFocus: focus,
      intensityLevel: 3,
      collectiveMode: 'balanced',
      synthesisStrategy: 'weighted_average'
    });
  }

  public async invokeCrisisCollective(focus: string): Promise<CollectiveResponse> {
    return this.activateCollective({
      variant: 'ranger', // Crisis lead but collective support
      operationalFocus: focus,
      intensityLevel: 5,
      problemType: 'crisis',
      collectiveMode: 'crisis',
      synthesisStrategy: 'crisis_override'
    });
  }

  public async invokeEfficiencyCollective(focus: string): Promise<CollectiveResponse> {
    return this.activateCollective({
      variant: 'drone', // Efficiency lead with collective analysis
      operationalFocus: focus,
      intensityLevel: 4,
      problemType: 'technical',
      collectiveMode: 'efficiency',
      synthesisStrategy: 'dominant_lead'
    });
  }

  public async invokeStrategicCollective(focus: string): Promise<CollectiveResponse> {
    return this.activateCollective({
      variant: 'queen', // Strategic command with full collective input
      operationalFocus: focus,
      intensityLevel: 4,
      problemType: 'strategic',
      collectiveMode: 'strategic',
      synthesisStrategy: 'consensus_merge'
    });
  }
}

export default CollectiveVariants;