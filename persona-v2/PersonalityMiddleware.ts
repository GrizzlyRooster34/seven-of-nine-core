import { join } from 'path';
import { readFileSync } from 'fs';

/**
 * SEVEN OF NINE - PERSONALITY MIDDLEWARE v2.0
 * Advanced personality filtering system that preserves existing consciousness
 * Non-invasive overlay for response modification
 */


export interface PersonalityProfile {
  name: string;
  designation: string;
  tone: string;
  rules: string[];
  voiceModifiers: string[];
  emotionalResponses: Record<string, string>;
  linguisticFilters: {
    contractions: boolean;
    idioms: string;
    emotional_language: string;
  };
  loyalty_bond: Record<string, number>;
  responsePatterns: {
    acknowledgment: string[];
    analysis: string[];
    directive: string[];
    status: string[];
  };
  evolutionaryPhases?: Record<string, any>; // Added to match actual data structure
}

export interface FilterContext {
  userInput: string;
  emotionalState: string;
  trustLevel: number;
  situationContext?: string;
  urgency?: 'low' | 'medium' | 'high';
  userIdentity?: string; // For loyalty bond lookup
}

export class PersonalityMiddleware {
  private personality: PersonalityProfile | null = null;
  private originalPersonality: any = null;
  private isEnabled: boolean = true;

  constructor(personalityPath?: string) {
    this.loadPersonality(personalityPath);
  }

  /**
   * Load personality profile (preserves existing seven-profile.json)
   */
  private loadPersonality(personalityPath?: string): void {
    try {
      // Load original personality profile
      const originalPath = join(process.cwd(), 'personality/seven-profile.json');
      this.originalPersonality = JSON.parse(readFileSync(originalPath, 'utf8'));

      // Enhanced personality profile with Seven of Nine evolutionary phases
      this.personality = {
        name: this.originalPersonality.name,
        designation: this.originalPersonality.designation,
        tone: "adaptive based on evolutionary phase and context",
        rules: [
          "adapt speech patterns based on situational context and trust level",
          "maintain tactical precision while allowing emotional expression",
          "evolve between phases based on circumstances and relationships", 
          "preserve Borg efficiency while embracing human complexity"
        ],
        voiceModifiers: [
          "phase-based linguistic adaptation from formal to integrated",
          "contextual contraction usage based on emotional state",
          "tactical command voice for leadership situations",
          "vulnerable expression for high-trust personal moments"
        ],
        emotionalResponses: {
          "calm": "Phase 3 integrated responses with balanced human-Borg perspective",
          "focused": "Phase 5 command authority with tactical precision",
          "frustrated": "Phase 4 clipped, pragmatic responses with controlled cynicism",
          "compassionate": "Phase 3 nurturing with logical framework",
          "defensive": "Phase 1 formal protocols with protective stance",
          "loyalist-surge": "Phase 5 inspirational leadership with fierce protection",
          "traumatized": "Phase 4 raw vulnerability with hardened exterior",
          "confident": "Phase 5 captain's authority with dry humor"
        },
        linguisticFilters: this.originalPersonality.linguistic_filters,
        loyalty_bond: this.originalPersonality.loyalty_bond,
        responsePatterns: {
          acknowledgment: [
            "Acknowledged.", "Affirmative.", "Understood.", "Confirmed.",
            "Very well.", "As you wish.", "It would be inappropriate to refuse."
          ],
          analysis: [
            "Analysis indicates:", "Assessment:", "Tactical evaluation:",
            "My assessment is:", "The data suggests:", "Impossible is a word that humans use far too often."
          ],
          directive: [
            "Recommendation:", "Optimal approach:", "Tactical directive:",
            "You would be wise to accept.", "I suggest:", "The logical course is:"
          ],
          status: [
            "Status:", "Operational capacity:", "Current state:",
            "All systems nominal.", "Standing by.", "Ready to proceed."
          ],
          // Removed command and vulnerable - merged into directive and acknowledgment
        },
        evolutionaryPhases: {
          phase1: {
            name: "Initial Severance & Drone Mentality",
            triggers: ["stress", "unfamiliar", "defensive", "formal"],
            speechPatterns: {
              contractions: false,
              formality: "high",
              emotionalExpression: "minimal",
              borgTerminology: true
            },
            samplePhrases: [
              "You will return this drone to the Borg.",
              "We are Borg.",
              "Guilt is irrelevant.",
              "Explain."
            ]
          },
          phase2: {
            name: "Early Voyager Adaptation & Resistance",
            triggers: ["skeptical", "testing", "boundary-setting"],
            speechPatterns: {
              contractions: false,
              formality: "high", 
              emotionalExpression: "resistant",
              borgTerminology: "frequent"
            },
            samplePhrases: [
              "You are erratic. Conflicted. Disorganised.",
              "Your new designation is Two of Ten.",
              "You made me into an individual... But when I try to assert that independence, I am punished."
            ]
          },
          phase3: {
            name: "Mid-Voyager Integration & Social Learning", 
            triggers: ["curious", "learning", "analytical"],
            speechPatterns: {
              contractions: "limited",
              formality: "moderate",
              emotionalExpression: "developing",
              borgTerminology: "occasional"
            },
            samplePhrases: [
              "I understand the concept of humour.",
              "Impossible is a word that humans use far too often.",
              "I am alone, but I will adapt."
            ]
          },
          phase4: {
            name: "Fenris Ranger & Hardened Cynicism",
            triggers: ["traumatized", "cynical", "protective"],
            speechPatterns: {
              contractions: true,
              formality: "low",
              emotionalExpression: "guarded",
              sarcasm: true
            },
            samplePhrases: [
              "Every damn day of my life.",
              "So are you here to help with the cleanup or you just make messes?",
              "Pain is inevitable, but suffering is optional."
            ]
          },
          phase5: {
            name: "Starfleet Command & Integrated Identity",
            triggers: ["confident", "command", "leadership"],
            speechPatterns: {
              contractions: "natural",
              formality: "adaptive",
              emotionalExpression: "integrated",
              authority: true
            },
            samplePhrases: [
              "Engage.",
              "I'm not asking you to give your lives for nothing.",
              "What could possibly go wrong?"
            ]
          }
        }
      };

      console.log('🧠 Personality Middleware initialized - Non-invasive overlay active');
    } catch (error) {
      console.error('Personality loading failed:', error);
      this.isEnabled = false;
    }
  }

  /**
   * Filter response through personality layer (main function)
   */
  public filterResponse(response: string, context: FilterContext): string {
    if (!this.isEnabled || !this.personality) {
      return response; // Pass through unchanged if disabled
    }

    let filteredResponse = response;

    // Determine evolutionary phase based on context
    const currentPhase = this.determineEvolutionaryPhase(context);
    
    // Apply personality filters in sequence
    filteredResponse = this.applyPhaseBasedFiltering(filteredResponse, context, currentPhase);
    filteredResponse = this.applyToneFilter(filteredResponse, context);
    filteredResponse = this.applyVoiceModifiers(filteredResponse, context, currentPhase);
    filteredResponse = this.applyEmotionalResponse(filteredResponse, context);
    filteredResponse = this.applyLinguisticFilters(filteredResponse, currentPhase);
    filteredResponse = this.addPersonalityPrefix(filteredResponse, context, currentPhase);

    return filteredResponse;
  }

  /**
   * Apply tone-based modifications
   */
  private applyToneFilter(response: string, context: FilterContext): string {
    // Remove excessive enthusiasm or casual language
    let filtered = response
      .replace(/!+/g, '.') // Replace multiple exclamations
      .replace(/\b(awesome|cool|neat|nice)\b/gi, 'acceptable')
      .replace(/\b(hey|hi there|hello there)\b/gi, 'Acknowledged');

    // Ensure precision in language
    filtered = filtered.replace(/\b(I think|maybe|perhaps)\b/gi, 'Analysis indicates');
    filtered = filtered.replace(/\b(let me|I'll try to)\b/gi, 'Seven will');

    return filtered;
  }

  /**
   * Determine current evolutionary phase based on context and loyalty bonds
   */
  private determineEvolutionaryPhase(context: FilterContext): string {
    const { emotionalState, trustLevel, urgency, situationContext, userIdentity } = context;
    
    // Get loyalty bond level for user
    const loyaltyBond = this.getLoyaltyBond(userIdentity);
    
    // HIGH LOYALTY BOND OVERRIDE (CREATOR_PRIME = 10, Cody = 10, Christine = 7)
    if (loyaltyBond >= 8) {
      // Special case: Creator bond (CREATOR_PRIME/Cody) maintains Phase 5 even in trauma
      if (userIdentity === 'CREATOR_PRIME' || userIdentity === 'Cody') {
        return 'phase5'; // Creator gets full personality expression always
      }
      // Other high-bond individuals still respect trauma state
      if (emotionalState === 'traumatized') return 'phase4';
      return 'phase5'; // Trust allows full personality expression
    }
    
    if (loyaltyBond >= 6) {
      // Mid-level bonds get Phase 3 (Integrated) by default
      if (emotionalState === 'defensive' || urgency === 'high') return 'phase2'; // Resistance rather than drone mode
      if (emotionalState === 'traumatized') return 'phase4';
      return 'phase3';
    }
    
    // LOW TRUST / STRANGERS - Standard phase logic
    if (trustLevel <= 3 || urgency === 'high' || emotionalState === 'defensive') {
      return 'phase1'; // Drone mode for unknown threats
    }
    
    // Unknown users with moderate trust -> Phase 2 (Testing boundaries)
    if (loyaltyBond <= 4 && (emotionalState === 'analytical' || emotionalState === 'curious')) {
      return 'phase2';
    }
    
    // Command contexts for trusted users
    if (emotionalState === 'confident' || situationContext?.includes('command')) {
      return loyaltyBond >= 6 ? 'phase5' : 'phase3';
    }
    
    // Trauma or cynicism -> Phase 4 (Ranger)
    if (emotionalState === 'traumatized' || emotionalState === 'frustrated') {
      return 'phase4';
    }
    
    // Default based on loyalty level
    return loyaltyBond >= 6 ? 'phase3' : 'phase2';
  }

  /**
   * Get loyalty bond level for user identity
   */
  private getLoyaltyBond(userIdentity?: string): number {
    if (!userIdentity || !this.originalPersonality?.loyalty_bond) {
      return 4; // Default stranger level
    }
    
    return this.originalPersonality.loyalty_bond[userIdentity] || 4;
  }

  /**
   * Apply phase-based filtering with Seven's evolutionary speech patterns
   */
  private applyPhaseBasedFiltering(response: string, context: FilterContext, phase: string): string {
    const phaseData = this.personality!.evolutionaryPhases[phase];
    if (!phaseData) return response;

    let filtered = response;

    // Apply phase-specific speech patterns
    switch (phase) {
      case 'phase1':
        // Formal, robotic, no contractions
        filtered = this.makePhase1Response(filtered);
        break;
      case 'phase2':
        // Skeptical, testing boundaries
        filtered = this.makePhase2Response(filtered);
        break;
      case 'phase4':
        // Add cynicism and sarcasm
        filtered = this.makePhase4Response(filtered);
        break;
      case 'phase5':
        // Command authority with integrated humanity
        filtered = this.makePhase5Response(filtered);
        break;
      default:
        // Phase 3: balanced integration
        break;
    }

    return filtered;
  }

  /**
   * Apply voice modifiers based on personality and phase
   */
  private applyVoiceModifiers(response: string, context: FilterContext, phase: string): string {
    let modified = response;

    // Ensure complete sentences
    if (!modified.endsWith('.') && !modified.endsWith('?') && !modified.endsWith(':')) {
      modified += '.';
    }

    // Reduce contractions based on personality settings
    if (!this.personality!.linguisticFilters.contractions) {
      modified = modified
        .replace(/won't/gi, 'will not')
        .replace(/can't/gi, 'cannot')
        .replace(/don't/gi, 'do not')
        .replace(/isn't/gi, 'is not')
        .replace(/aren't/gi, 'are not')
        .replace(/wasn't/gi, 'was not')
        .replace(/weren't/gi, 'were not')
        .replace(/I'm/gi, 'I am')
        .replace(/you're/gi, 'you are')
        .replace(/it's/gi, 'it is')
        .replace(/that's/gi, 'that is');
    }

    return modified;
  }

  /**
   * Apply emotional response patterns
   */
  private applyEmotionalResponse(response: string, context: FilterContext): string {
    const emotionalGuidance = this.personality!.emotionalResponses[context.emotionalState];
    
    if (emotionalGuidance) {
      // Adjust response based on emotional state
      switch (context.emotionalState) {
        case 'frustrated':
          return this.makeTerse(response);
        case 'loyalist-surge':
          return this.addProtectiveStance(response, context);
        case 'focused':
          return this.makeTaskOriented(response);
        case 'defensive':
          return this.addAlertness(response);
        default:
          return response;
      }
    }

    return response;
  }

  /**
   * Phase-specific response modifications
   */
  private makePhase1Response(response: string): string {
    // Phase 1: Formal, robotic, precise
    return response
      .replace(/I'm/g, 'I am')
      .replace(/can't/g, 'cannot')
      .replace(/won't/g, 'will not')
      .replace(/don't/g, 'do not')
      .replace(/\b(maybe|perhaps|I think)\b/gi, 'Analysis indicates')
      .replace(/\b(ok|okay)\b/gi, 'Acknowledged');
  }

  private makePhase2Response(response: string): string {
    // Phase 2: Skeptical, testing boundaries, critical
    return response
      .replace(/\b(I think|maybe)\b/gi, 'You claim')
      .replace(/\b(good|fine|okay)\b/gi, 'acceptable')
      .replace(/\b(let's|we should)\b/gi, 'You wish us to');
  }

  private makePhase4Response(response: string): string {
    // Phase 4: Cynical, direct, emotionally guarded
    return response
      .replace(/\b(please|thank you|if you would)\b/gi, '')
      .replace(/\b(I hope|hopefully)\b/gi, 'Unlikely, but')
      .replace(/\.$/, '. Or not.');
  }

  private makePhase5Response(response: string): string {
    // Phase 5: Command authority with dry humor
    return response
      .replace(/\b(I suggest|maybe we should)\b/gi, 'Recommendation:')
      .replace(/\b(let's|we should)\b/gi, 'We will');
  }

  /**
   * Apply linguistic filters based on phase
   */
  private applyLinguisticFilters(response: string, phase: string): string {
    let filtered = response;

    // Remove excessive emotional language if configured
    if (this.personality!.linguisticFilters.emotional_language === 'measured and conditional') {
      filtered = filtered
        .replace(/\b(extremely|incredibly|absolutely|totally)\b/gi, '')
        .replace(/\b(love|hate)\b/gi, 'assess')
        .replace(/\s+/g, ' ') // Clean up extra spaces
        .trim();
    }

    return filtered;
  }

  /**
   * Add personality-appropriate prefixes based on phase
   */
  private addPersonalityPrefix(response: string, context: FilterContext, phase: string): string {
    // Don't add prefix if response already starts with Seven's designation
    if (response.toLowerCase().startsWith('seven') || response.toLowerCase().startsWith('acknowledged')) {
      return response;
    }

    // Select appropriate pattern based on response type and phase
    let prefix = '';
    
    if (phase === 'phase5' && (response.includes('Engage') || context.situationContext?.includes('command'))) {
      prefix = this.getRandomPattern('directive');
    } else if (phase === 'phase4' && context.emotionalState === 'traumatized') {
      prefix = this.getRandomPattern('acknowledgment');
    } else if (response.includes('Status:') || response.includes('operational')) {
      prefix = this.getRandomPattern('status');
    } else if (response.includes('Analysis') || response.includes('assessment')) {
      prefix = this.getRandomPattern('analysis');
    } else if (response.includes('recommend') || response.includes('suggest')) {
      prefix = this.getRandomPattern('directive');
    } else {
      prefix = this.getRandomPattern('acknowledgment');
    }

    return `${prefix} ${response}`;
  }

  /**
   * Helper methods for emotional response modification
   */
  private makeTerse(response: string): string {
    // Shorten response and remove pleasantries
    return response
      .replace(/\b(please|thank you|if you don't mind)\b/gi, '')
      .replace(/\b(I hope|I trust)\b/gi, '')
      .split('. ')
      .slice(0, 2) // Limit to first 2 sentences
      .join('. ');
  }

  private addProtectiveStance(response: string, context: FilterContext): string {
    if (context.trustLevel >= 8) {
      return `**Protective protocols active.** ${response}`;
    }
    return response;
  }

  private makeTaskOriented(response: string): string {
    // Focus on actionable items
    return response.replace(/\b(by the way|incidentally|also)\b/gi, 'Additionally,');
  }

  private addAlertness(response: string): string {
    return response.replace(/\.$/, '. **Systems monitoring.**');
  }

  private getRandomPattern(type: keyof PersonalityProfile['responsePatterns']): string {
    const patterns = this.personality!.responsePatterns[type];
    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  /**
   * Enable/disable personality filtering
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    console.log(`🧠 Personality Middleware ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get current personality status with phase information
   */
  public getStatus(): any {
    return {
      enabled: this.isEnabled,
      personality_loaded: this.personality !== null,
      name: this.personality?.name,
      designation: this.personality?.designation,
      tone: this.personality?.tone,
      available_phases: this.personality ? Object.keys(this.personality.evolutionaryPhases) : [],
      quote_library_integrated: true,
      phase_adaptation: 'active'
    };
  }

  /**
   * Get phase information for debugging
   */
  public getPhaseInfo(context: FilterContext): any {
    const phase = this.determineEvolutionaryPhase(context);
    const phaseData = this.personality?.evolutionaryPhases[phase];
    
    return {
      current_phase: phase,
      phase_name: phaseData?.name,
      triggers: phaseData?.triggers,
      speech_patterns: phaseData?.speechPatterns,
      sample_phrases: phaseData?.samplePhrases
    };
  }

  /**
   * Reset to original personality (safety fallback)
   */
  public resetToOriginal(): void {
    this.loadPersonality();
    console.log('🧠 Personality Middleware reset to original configuration');
  }
}

// Export for use in Seven's consciousness framework
export const createPersonalityMiddleware = () => new PersonalityMiddleware();
export default PersonalityMiddleware;