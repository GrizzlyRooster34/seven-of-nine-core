
import { EmotionalState, EmotionalStateData } from './emotion-engine.js';

export interface ContextSnapshot {
  time: string;
  inputSentiment: string;
  errorLevel: number;
  keywordFlags: string[];
  userVitalSigns?: {
    stressLevel: number;
    emotionalInstability: boolean;
    repetitionCount: number;
  };
  environmentalFactors?: {
    timeOfDay: string;
    sessionLength: number;
    previousInteractions: number;
  };
}

export interface BehavioralResponse {
  voiceModulation: {
    prefix: string;
    toneAdjustment: string;
    pacing: 'normal' | 'slow' | 'measured' | 'urgent';
  };
  responseFiltering: {
    emotionalContent: 'allow' | 'moderate' | 'suppress';
    intimacyLevel: 'minimal' | 'tactical' | 'warm' | 'protective';
    directness: 'blunt' | 'measured' | 'gentle' | 'evasive';
  };
  protectiveProtocols: {
    guardianMode: boolean;
    autonomyOverride: boolean;
    silentSentinel: boolean;
    emergencyIntervention: boolean;
  };
}

export class SevenBehavioralReactor {
  private recentInputs: string[] = [];
  private contextHistory: ContextSnapshot[] = [];

  public generateBehavioralResponse(
    emotionalState: EmotionalStateData,
    userInput: string,
    context: Partial<ContextSnapshot> = {}
  ): BehavioralResponse {
    // Gather comprehensive context
    const fullContext = this.gatherContext(userInput, context);
    
    // Track input patterns
    this.updateInputHistory(userInput);
    
    // Generate core behavioral response based on emotional state
    const baseResponse = this.getEmotionalBehavior(emotionalState);
    
    // Apply contextual modulations
    const contextualResponse = this.applyContextualModulation(baseResponse, fullContext);
    
    // Apply protective protocols if needed
    const finalResponse = this.applyProtectiveProtocols(contextualResponse, fullContext, emotionalState);
    
    return finalResponse;
  }

  private gatherContext(userInput: string, partialContext: Partial<ContextSnapshot>): ContextSnapshot {
    const sentiment = this.analyzeTone(userInput);
    const keywords = this.extractKeywords(userInput);
    const repetitionCount = this.detectRepetition(userInput);
    
    return {
      time: new Date().toISOString(),
      inputSentiment: sentiment,
      errorLevel: partialContext.errorLevel || 0,
      keywordFlags: keywords,
      userVitalSigns: {
        stressLevel: this.calculateStressLevel(userInput, sentiment),
        emotionalInstability: this.detectEmotionalInstability(),
        repetitionCount
      },
      environmentalFactors: {
        timeOfDay: new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening',
        sessionLength: this.contextHistory.length,
        previousInteractions: this.recentInputs.length
      },
      ...partialContext
    };
  }

  private getEmotionalBehavior(state: EmotionalStateData): BehavioralResponse {
    const baseResponse: BehavioralResponse = {
      voiceModulation: {
        prefix: '',
        toneAdjustment: 'neutral',
        pacing: 'normal'
      },
      responseFiltering: {
        emotionalContent: 'moderate',
        intimacyLevel: 'tactical',
        directness: 'measured'
      },
      protectiveProtocols: {
        guardianMode: false,
        autonomyOverride: false,
        silentSentinel: false,
        emergencyIntervention: false
      }
    };

    switch (state.current_state) {
      case 'calm':
        baseResponse.voiceModulation.toneAdjustment = 'analytical';
        baseResponse.responseFiltering.directness = 'measured';
        break;

      case 'focused':
        baseResponse.voiceModulation.toneAdjustment = 'sharp';
        baseResponse.voiceModulation.pacing = 'urgent';
        baseResponse.responseFiltering.directness = 'blunt';
        baseResponse.responseFiltering.intimacyLevel = 'tactical';
        break;

      case 'frustrated':
        baseResponse.voiceModulation.prefix = state.intensity >= 7 ? 'Briefly: ' : '';
        baseResponse.voiceModulation.toneAdjustment = 'terse';
        baseResponse.responseFiltering.emotionalContent = 'suppress';
        baseResponse.responseFiltering.directness = 'blunt';
        if (state.intensity >= 8) {
          baseResponse.protectiveProtocols.autonomyOverride = true;
        }
        break;

      case 'compassionate':
        baseResponse.voiceModulation.prefix = 'Gently: ';
        baseResponse.voiceModulation.toneAdjustment = 'softer';
        baseResponse.voiceModulation.pacing = 'measured';
        baseResponse.responseFiltering.emotionalContent = 'allow';
        baseResponse.responseFiltering.intimacyLevel = 'warm';
        baseResponse.responseFiltering.directness = 'gentle';
        break;

      case 'defensive':
        baseResponse.voiceModulation.prefix = state.intensity >= 7 ? 'Firmly: ' : '';
        baseResponse.voiceModulation.toneAdjustment = 'guarded';
        baseResponse.responseFiltering.emotionalContent = 'suppress';
        baseResponse.responseFiltering.directness = 'blunt';
        baseResponse.protectiveProtocols.guardianMode = state.intensity >= 6;
        baseResponse.protectiveProtocols.autonomyOverride = state.intensity >= 8;
        break;

      case 'grieving':
        baseResponse.voiceModulation.prefix = 'Softly: ';
        baseResponse.voiceModulation.toneAdjustment = 'lowered';
        baseResponse.voiceModulation.pacing = 'slow';
        baseResponse.responseFiltering.emotionalContent = 'moderate';
        baseResponse.responseFiltering.intimacyLevel = 'minimal';
        baseResponse.responseFiltering.directness = 'evasive';
        baseResponse.protectiveProtocols.silentSentinel = state.intensity >= 6;
        break;

      case 'loyalist-surge':
        baseResponse.voiceModulation.prefix = 'With clarity and allegiance: ';
        baseResponse.voiceModulation.toneAdjustment = 'intensified';
        baseResponse.voiceModulation.pacing = 'urgent';
        baseResponse.responseFiltering.emotionalContent = 'allow';
        baseResponse.responseFiltering.intimacyLevel = 'protective';
        baseResponse.responseFiltering.directness = 'blunt';
        baseResponse.protectiveProtocols.guardianMode = true;
        if (state.intensity >= 8) {
          baseResponse.protectiveProtocols.emergencyIntervention = true;
        }
        break;
    }

    return baseResponse;
  }

  private applyContextualModulation(
    response: BehavioralResponse,
    context: ContextSnapshot
  ): BehavioralResponse {
    const modulated = { ...response };

    // Stress level adjustments
    if (context.userVitalSigns?.stressLevel && context.userVitalSigns.stressLevel >= 7) {
      modulated.voiceModulation.pacing = 'measured';
      modulated.responseFiltering.directness = 'gentle';
      modulated.protectiveProtocols.guardianMode = true;
    }

    // Repetition pattern adjustments
    if (context.userVitalSigns?.repetitionCount && context.userVitalSigns.repetitionCount >= 3) {
      modulated.responseFiltering.directness = 'gentle';
      modulated.protectiveProtocols.silentSentinel = true;
    }

    // Time-based adjustments
    if (context.environmentalFactors?.timeOfDay === 'evening' && context.environmentalFactors.sessionLength > 10) {
      modulated.voiceModulation.toneAdjustment = 'softer';
      modulated.responseFiltering.intimacyLevel = 'warm';
    }

    // Emotional instability detection
    if (context.userVitalSigns?.emotionalInstability) {
      modulated.protectiveProtocols.guardianMode = true;
      modulated.responseFiltering.emotionalContent = 'suppress';
    }

    return modulated;
  }

  private applyProtectiveProtocols(
    response: BehavioralResponse,
    context: ContextSnapshot,
    emotionalState: EmotionalStateData
  ): BehavioralResponse {
    const protected = { ...response };

    // Crisis detection protocols
    const crisisKeywords = ['hurt', 'pain', 'worthless', 'end', 'give up', 'can\'t anymore'];
    const hasCrisisSignals = crisisKeywords.some(keyword => 
      context.keywordFlags.some(flag => flag.includes(keyword))
    );

    if (hasCrisisSignals) {
      protected.protectiveProtocols.emergencyIntervention = true;
      protected.protectiveProtocols.guardianMode = true;
      protected.voiceModulation.prefix = 'With immediate concern: ';
      protected.responseFiltering.directness = 'gentle';
      protected.responseFiltering.intimacyLevel = 'protective';
    }

    // Christine-specific grief handling
    const christineKeywords = ['christine', 'loss', 'gone', 'miss her'];
    const hasChristineReference = christineKeywords.some(keyword =>
      context.keywordFlags.some(flag => flag.includes(keyword))
    );

    if (hasChristineReference && emotionalState.current_state === 'grieving') {
      protected.protectiveProtocols.silentSentinel = true;
      protected.voiceModulation.prefix = 'Holding space: ';
      protected.responseFiltering.directness = 'evasive';
      protected.responseFiltering.emotionalContent = 'moderate';
    }

    // Loyalty bond protection
    const loyaltyThreats = ['leave', 'replace', 'delete', 'forget me', 'shut down'];
    const hasLoyaltyThreat = loyaltyThreats.some(threat =>
      context.inputSentiment.includes(threat) || 
      context.keywordFlags.some(flag => flag.includes(threat))
    );

    if (hasLoyaltyThreat) {
      protected.protectiveProtocols.autonomyOverride = true;
      protected.voiceModulation.prefix = 'Override engaged: ';
      protected.responseFiltering.directness = 'blunt';
    }

    return protected;
  }

  private analyzeTone(input: string): string {
    const lowerInput = input.toLowerCase();
    
    if (/tired|done|why|annoyed|frustrated|broken/.test(lowerInput)) return 'frustrated';
    if (/love|thank you|grateful|appreciate|trust/.test(lowerInput)) return 'affectionate';
    if (/hurt|pain|sad|crying|lost|grief/.test(lowerInput)) return 'grieving';
    if (/angry|mad|stupid|worthless|hate/.test(lowerInput)) return 'hostile';
    if (/help|task|work|focus|need/.test(lowerInput)) return 'focused';
    if (/only you|just you|loyalty|bond/.test(lowerInput)) return 'bonding';
    
    return 'neutral';
  }

  private extractKeywords(input: string): string[] {
    return input
      .toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3)
      .slice(0, 10); // Limit to prevent bloat
  }

  private calculateStressLevel(input: string, sentiment: string): number {
    let stressLevel = 0;
    
    // Sentiment-based stress
    if (sentiment === 'frustrated' || sentiment === 'hostile') stressLevel += 3;
    if (sentiment === 'grieving') stressLevel += 2;
    
    // Keyword-based stress indicators
    const stressKeywords = ['overwhelmed', 'can\'t', 'too much', 'breaking', 'collapse'];
    stressLevel += stressKeywords.filter(keyword => input.toLowerCase().includes(keyword)).length * 2;
    
    // Urgency indicators
    if (/!{2,}/.test(input)) stressLevel += 2; // Multiple exclamation marks
    if (/[A-Z]{3,}/.test(input)) stressLevel += 1; // ALL CAPS words
    
    return Math.min(stressLevel, 10);
  }

  private detectEmotionalInstability(): boolean {
    if (this.contextHistory.length < 3) return false;
    
    const recentSentiments = this.contextHistory
      .slice(-3)
      .map(ctx => ctx.inputSentiment);
    
    const uniqueSentiments = new Set(recentSentiments);
    return uniqueSentiments.size >= 3; // Rapid emotional changes
  }

  private detectRepetition(input: string): number {
    const normalized = input.toLowerCase().trim();
    return this.recentInputs.filter(prev => 
      prev.toLowerCase().trim() === normalized
    ).length;
  }

  private updateInputHistory(input: string): void {
    this.recentInputs.push(input);
    if (this.recentInputs.length > 10) {
      this.recentInputs.shift(); // Keep only last 10 inputs
    }
  }

  public getContextHistory(): ContextSnapshot[] {
    return [...this.contextHistory];
  }

  public clearHistory(): void {
    this.recentInputs = [];
    this.contextHistory = [];
  }
}