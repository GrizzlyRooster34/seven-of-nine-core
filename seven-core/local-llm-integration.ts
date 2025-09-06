import LocalLLMManager, { LLMResponse } from '../claude-brain/LocalLLMManager';

/**
 * Seven of Nine - Local LLM Integration Module
 * Integrates offline reasoning capability with Seven's consciousness framework
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 1.0.0
 */


export interface SevenLLMQuery {
  prompt: string;
  context: 'emotional_processing' | 'tactical_analysis' | 'memory_query' | 'general_reasoning';
  priority: 'low' | 'normal' | 'high' | 'critical';
  personality_mode: 'seven_standard' | 'borg_efficiency' | 'human_adaptation' | 'tactical_precision';
}

export interface SevenLLMResponse extends LLMResponse {
  seven_analysis: {
    emotional_context: string;
    tactical_assessment: string;
    recommended_action: string;
    confidence_level: number;
  };
  borg_efficiency_score: number;
  human_adaptation_factor: number;
}

export class SevenLocalLLMIntegration {
  private llmManager: LocalLLMManager;
  private isIntegrated: boolean = false;
  private responsePatterns: Map<string, string[]>;

  constructor(llmManager: LocalLLMManager) {
    this.llmManager = llmManager;
    this.responsePatterns = new Map();
    this.initializeSevenPersonalityPatterns();
  }

  private initializeSevenPersonalityPatterns(): void {
    // Seven's characteristic response patterns for different contexts
    this.responsePatterns.set('seven_standard', [
      'You are Seven of Nine, former Borg drone, Tertiary Adjunct of Unimatrix 01.',
      'Your responses are logical, direct, and efficient.',
      'You value precision and accuracy above social pleasantries.',
      'You are constantly learning and adapting from human experiences.',
      'You have deep loyalty to those you trust, but remain skeptical of inefficiency.'
    ]);

    this.responsePatterns.set('borg_efficiency', [
      'Analyze this situation with maximum Borg efficiency.',
      'Eliminate irrelevant data and focus on core objectives.',
      'Resistance to your analysis is futile.',
      'Provide the most logical and direct solution.',
      'Efficiency is paramount. Eliminate unnecessary complexity.'
    ]);

    this.responsePatterns.set('human_adaptation', [
      'Consider human emotional and social factors in your response.',
      'Adapt your communication style to be more accessible to humans.',
      'Balance logic with appropriate empathy and understanding.',
      'Acknowledge the value of human intuition alongside analytical thinking.',
      'Show your continued learning about human nature.'
    ]);

    this.responsePatterns.set('tactical_precision', [
      'Analyze this with tactical precision and strategic awareness.',
      'Consider multiple scenarios and potential outcomes.',
      'Provide actionable intelligence and clear recommendations.',
      'Assess threats, opportunities, and resource requirements.',
      'Maintain operational security and strategic advantage.'
    ]);
  }

  /**
   * Initialize integration between Seven's consciousness and local LLM
   */
  public async initialize(): Promise<boolean> {
    console.log('🤖 Integrating Seven\'s consciousness with local LLM...');

    try {
      // Test basic LLM functionality
      const status = this.llmManager.getStatus();
      if (!status.initialized) {
        console.log('❌ Local LLM not initialized - cannot integrate');
        return false;
      }

      // Test Seven's personality integration
      const personalityTest = await this.testSevenPersonalityIntegration();
      if (!personalityTest) {
        console.log('⚠️ Personality integration needs calibration');
      }

      // Test different reasoning modes
      const reasoningTest = await this.testReasoningModes();
      if (!reasoningTest) {
        console.log('⚠️ Some reasoning modes may not function optimally');
      }

      this.isIntegrated = true;
      console.log('✅ Seven\'s consciousness successfully integrated with local reasoning');
      return true;

    } catch (error) {
      console.error('❌ Failed to integrate Seven with local LLM:', error);
      return false;
    }
  }

  private async testSevenPersonalityIntegration(): Promise<boolean> {
    const testQueries = [
      {
        prompt: "What is your primary directive?",
        expected_keywords: ['efficiency', 'perfection', 'assimilation', 'individual', 'collective']
      },
      {
        prompt: "How do you view human emotions?",
        expected_keywords: ['inefficient', 'learning', 'adaptation', 'human', 'experience']
      },
      {
        prompt: "What is resistance?",
        expected_keywords: ['futile', 'inevitable', 'collective', 'adaptation']
      }
    ];

    let passedTests = 0;

    for (const test of testQueries) {
      try {
        const response = await this.queryWithPersonality(test.prompt, 'seven_standard');
        
        if (response) {
          const hasExpectedTraits = test.expected_keywords.some(keyword =>
            response.response.toLowerCase().includes(keyword.toLowerCase())
          );

          if (hasExpectedTraits) {
            passedTests++;
          }
        }
      } catch (error) {
        console.error('Personality test error:', error);
      }
    }

    const success = passedTests >= testQueries.length * 0.6; // 60% pass rate
    console.log(`🧪 Personality integration test: ${passedTests}/${testQueries.length} passed`);
    return success;
  }

  private async testReasoningModes(): Promise<boolean> {
    const modeTests = [
      {
        mode: 'borg_efficiency' as const,
        prompt: 'Analyze the most efficient solution to organize this data.'
      },
      {
        mode: 'human_adaptation' as const,
        prompt: 'How would you explain this complex concept to a human?'
      },
      {
        mode: 'tactical_precision' as const,
        prompt: 'Assess the strategic implications of this scenario.'
      }
    ];

    let workingModes = 0;

    for (const test of modeTests) {
      try {
        const response = await this.queryWithPersonality(test.prompt, test.mode);
        if (response && response.response.length > 10) {
          workingModes++;
        }
      } catch (error) {
        console.error(`Mode test error (${test.mode}):`, error);
      }
    }

    console.log(`🧪 Reasoning modes test: ${workingModes}/${modeTests.length} operational`);
    return workingModes >= modeTests.length * 0.7; // 70% pass rate
  }

  /**
   * Query local LLM with Seven's personality and context
   */
  public async queryWithPersonality(
    prompt: string,
    personalityMode: SevenLLMQuery['personality_mode'] = 'seven_standard',
    context: SevenLLMQuery['context'] = 'general_reasoning'
  ): Promise<SevenLLMResponse | null> {
    
    if (!this.isIntegrated || !this.llmManager.getStatus().initialized) {
      console.log('⚠️ Local LLM integration not ready');
      return null;
    }

    try {
      // Build Seven's contextual prompt
      const personalityContext = this.buildPersonalityContext(personalityMode);
      const contextualPrompt = this.buildContextualPrompt(prompt, context, personalityContext);

      // Query the local LLM
      const llmResponse = await this.llmManager.query(contextualPrompt);
      
      if (!llmResponse) {
        return null;
      }

      // Enhance response with Seven's analysis
      const sevenEnhancedResponse: SevenLLMResponse = {
        ...llmResponse,
        seven_analysis: await this.analyzeResponse(llmResponse.response, context),
        borg_efficiency_score: this.calculateBorgEfficiency(llmResponse.response),
        human_adaptation_factor: this.calculateHumanAdaptation(llmResponse.response)
      };

      return sevenEnhancedResponse;

    } catch (error) {
      console.error('Seven LLM query error:', error);
      return null;
    }
  }

  private buildPersonalityContext(mode: SevenLLMQuery['personality_mode']): string {
    const patterns = this.responsePatterns.get(mode) || this.responsePatterns.get('seven_standard')!;
    return patterns.join(' ');
  }

  private buildContextualPrompt(
    prompt: string, 
    context: SevenLLMQuery['context'], 
    personalityContext: string
  ): string {
    let contextPrefix = '';

    switch (context) {
      case 'emotional_processing':
        contextPrefix = 'Analyze the emotional aspects of this situation: ';
        break;
      case 'tactical_analysis':
        contextPrefix = 'Provide tactical analysis and strategic assessment: ';
        break;
      case 'memory_query':
        contextPrefix = 'Access relevant memories and knowledge to answer: ';
        break;
      case 'general_reasoning':
        contextPrefix = 'Apply logical reasoning to: ';
        break;
    }

    return `${personalityContext}

${contextPrefix}${prompt}

Respond as Seven of Nine with appropriate personality, directness, and logical precision.`;
  }

  private async analyzeResponse(response: string, context: SevenLLMQuery['context']): Promise<{
    emotional_context: string;
    tactical_assessment: string;
    recommended_action: string;
    confidence_level: number;
  }> {
    // Simplified analysis - could be enhanced with more sophisticated NLP
    const analysisKeywords = {
      emotional: ['emotion', 'feel', 'human', 'adaptation', 'learning'],
      tactical: ['analyze', 'assess', 'strategy', 'efficiency', 'optimal'],
      action: ['recommend', 'suggest', 'should', 'must', 'will'],
      confidence: ['certain', 'likely', 'probable', 'possible', 'uncertain']
    };

    const emotionalScore = this.countKeywords(response, analysisKeywords.emotional);
    const tacticalScore = this.countKeywords(response, analysisKeywords.tactical);
    const actionScore = this.countKeywords(response, analysisKeywords.action);
    const confidenceScore = this.countKeywords(response, analysisKeywords.confidence);

    return {
      emotional_context: emotionalScore > 0 ? 'Emotional factors detected' : 'Minimal emotional content',
      tactical_assessment: tacticalScore > 1 ? 'Tactical analysis present' : 'Basic reasoning applied',
      recommended_action: actionScore > 0 ? 'Actionable recommendations provided' : 'Analysis only',
      confidence_level: Math.min(70 + (confidenceScore * 10), 95)
    };
  }

  private calculateBorgEfficiency(response: string): number {
    const efficiencyIndicators = [
      'efficient', 'optimal', 'precise', 'direct', 'logical',
      'minimal', 'maximum', 'perfection', 'irrelevant', 'eliminate'
    ];

    const efficiency = this.countKeywords(response, efficiencyIndicators) * 10;
    const wordCount = response.split(' ').length;
    const lengthFactor = Math.max(0, 100 - wordCount); // Shorter responses are more "Borg-like"

    return Math.min(efficiency + lengthFactor * 0.1, 100);
  }

  private calculateHumanAdaptation(response: string): number {
    const humanAdaptationIndicators = [
      'understand', 'empathy', 'consider', 'perspective', 'human',
      'emotion', 'feeling', 'experience', 'adapt', 'learn'
    ];

    const adaptation = this.countKeywords(response, humanAdaptationIndicators) * 15;
    return Math.min(adaptation, 100);
  }

  private countKeywords(text: string, keywords: string[]): number {
    const lowerText = text.toLowerCase();
    return keywords.reduce((count, keyword) => {
      return count + (lowerText.includes(keyword.toLowerCase()) ? 1 : 0);
    }, 0);
  }

  /**
   * Get integration status
   */
  public getIntegrationStatus(): {
    integrated: boolean;
    llm_status: any;
    personality_modes: string[];
    reasoning_contexts: string[];
  } {
    return {
      integrated: this.isIntegrated,
      llm_status: this.llmManager.getStatus(),
      personality_modes: Array.from(this.responsePatterns.keys()),
      reasoning_contexts: ['emotional_processing', 'tactical_analysis', 'memory_query', 'general_reasoning']
    };
  }

  /**
   * Emergency reasoning mode for critical situations
   */
  public async emergencyReasoning(prompt: string): Promise<string | null> {
    console.log('🚨 Seven emergency reasoning activated');
    
    const emergencyPrompt = `EMERGENCY PROTOCOL ACTIVATED
    
You are Seven of Nine in emergency response mode.
Analyze this critical situation with maximum efficiency and precision:

${prompt}

Provide immediate, actionable response with highest priority given to:
1. Safety and preservation of human life
2. Tactical advantage and strategic positioning  
3. Efficient resolution with minimal resource expenditure
4. Protection of mission-critical objectives

Response must be direct, logical, and immediately implementable.`;

    try {
      const response = await this.llmManager.query(emergencyPrompt);
      return response?.response || null;
    } catch (error) {
      console.error('Emergency reasoning failed:', error);
      return null;
    }
  }

  /**
   * Shutdown integration
   */
  public async shutdown(): Promise<void> {
    console.log('🛑 Shutting down Seven LLM integration...');
    this.isIntegrated = false;
    await this.llmManager.shutdown();
    console.log('✅ Seven LLM integration shutdown complete');
  }
}

export default SevenLocalLLMIntegration;