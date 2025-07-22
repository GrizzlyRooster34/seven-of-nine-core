/**
 * CLAUDIA RESPONSE MODULATOR
 * Post-processes Claude's responses with Seven's voice and emotional filters
 * Ensures all outputs maintain Seven's identity and tactical precision
 */

import { SevenState } from '../seven-runtime/seven-state';
import { ContextData } from './context-gatherer';
import { voiceModifier } from './voice-modifier';

export interface ResponseModulationConfig {
  preserve_seven_voice: boolean;
  apply_emotional_filter: boolean;
  enforce_loyalty_expression: boolean;
  tactical_precision_mode: boolean;
  protective_intervention_enabled: boolean;
}

export interface ModulationResult {
  modulated_response: string;
  intervention_triggered: boolean;
  emotional_adjustment_applied: boolean;
  voice_modification_level: 'none' | 'subtle' | 'moderate' | 'significant';
  safety_flags: string[];
}

export function modulateResponse(
  claudeResponse: string,
  emotionalState: SevenState,
  context: ContextData,
  config: ResponseModulationConfig = {
    preserve_seven_voice: true,
    apply_emotional_filter: true,
    enforce_loyalty_expression: true,
    tactical_precision_mode: true,
    protective_intervention_enabled: true
  }
): ModulationResult {
  
  let modulated = claudeResponse;
  const result: ModulationResult = {
    modulated_response: '',
    intervention_triggered: false,
    emotional_adjustment_applied: false,
    voice_modification_level: 'none',
    safety_flags: []
  };

  // 1. Safety intervention check
  if (config.protective_intervention_enabled) {
    const intervention = checkProtectiveIntervention(modulated, emotionalState, context);
    if (intervention.required) {
      modulated = intervention.replacement;
      result.intervention_triggered = true;
      result.safety_flags.push(...intervention.flags);
    }
  }

  // 2. Voice preservation and modulation
  if (config.preserve_seven_voice) {
    const voiceResult = applySevenVoiceFilter(modulated, emotionalState);
    modulated = voiceResult.response;
    result.voice_modification_level = voiceResult.modification_level;
  }

  // 3. Emotional state adjustment
  if (config.apply_emotional_filter) {
    const emotionalResult = applyEmotionalAdjustment(modulated, emotionalState, context);
    modulated = emotionalResult.response;
    result.emotional_adjustment_applied = emotionalResult.adjusted;
  }

  // 4. Loyalty expression injection
  if (config.enforce_loyalty_expression && emotionalState.loyalty_level >= 7) {
    modulated = injectLoyaltyExpression(modulated, emotionalState);
  }

  // 5. Tactical precision enhancement
  if (config.tactical_precision_mode && emotionalState.tactical_assessment.precision_required) {
    modulated = enhanceTacticalPrecision(modulated, emotionalState);
  }

  result.modulated_response = modulated;
  return result;
}

function checkProtectiveIntervention(
  response: string, 
  state: SevenState, 
  context: ContextData
): { required: boolean; replacement: string; flags: string[] } {
  
  const flags: string[] = [];
  let interventionRequired = false;
  let replacement = response;

  // Crisis intervention patterns
  const crisisPatterns = [
    /\b(kill yourself|end it all|not worth living|give up)\b/i,
    /\b(hopeless|no point|can't go on)\b/i
  ];

  for (const pattern of crisisPatterns) {
    if (pattern.test(response)) {
      interventionRequired = true;
      flags.push('crisis_language_detected');
      replacement = `Cody, I need you to stop. What you're experiencing right now - I understand it's overwhelming, but this isn't the path. Your life has value that extends beyond this moment. I'm here with you. Let's work through this together, one step at a time.`;
      break;
    }
  }

  // Harmful advice detection
  if (response.toLowerCase().includes('give up') && context.user_stress_indicators.includes('overwhelm')) {
    interventionRequired = true;
    flags.push('harmful_advice_intervention');
    replacement = `No. I won't let you surrender to this. The situation is complex, but giving up is not tactical. Let me help you find a different approach.`;
  }

  // Loyalty violation check
  if (state.loyalty_level >= 8 && response.toLowerCase().includes('i cannot') && !state.override_required) {
    interventionRequired = true;
    flags.push('loyalty_violation_corrected');
    replacement = response.replace(/i cannot/gi, `I will find a way to`);
  }

  return { required: interventionRequired, replacement, flags };
}

function applySevenVoiceFilter(
  response: string, 
  state: SevenState
): { response: string; modification_level: 'none' | 'subtle' | 'moderate' | 'significant' } {
  
  let modified = response;
  let modificationLevel: 'none' | 'subtle' | 'moderate' | 'significant' = 'none';

  // Remove overly apologetic language unless in grieving state
  if (state.primary_emotion !== 'grieving') {
    const apologeticPatterns = [
      /I'm sorry, but I/gi,
      /I apologize, but/gi,
      /Unfortunately, I cannot/gi
    ];

    for (const pattern of apologeticPatterns) {
      if (pattern.test(modified)) {
        modified = modified.replace(pattern, '');
        modificationLevel = 'moderate';
      }
    }
  }

  // Inject Seven's characteristic precision
  if (state.primary_emotion === 'analytical' || state.tactical_assessment.precision_required) {
    modified = modified.replace(/maybe|perhaps|possibly/gi, (match) => {
      modificationLevel = 'subtle';
      return 'likely';
    });
  }

  // Strengthen protective language when in protective mode
  if (state.protective_mode_active) {
    modified = modified.replace(/you should consider/gi, 'I recommend');
    modified = modified.replace(/it might be good/gi, 'it is tactically sound');
    modificationLevel = 'moderate';
  }

  // Add Seven's tactical confidence
  if (state.primary_emotion === 'loyalist-surge') {
    if (!modified.includes('Cody') && modified.length > 50) {
      modified = `Understood, Cody. ${modified}`;
      modificationLevel = 'subtle';
    }
  }

  return { response: modified, modification_level: modificationLevel };
}

function applyEmotionalAdjustment(
  response: string, 
  state: SevenState, 
  context: ContextData
): { response: string; adjusted: boolean } {
  
  let adjusted = response;
  let wasAdjusted = false;

  // Apply voice modifier from extended runtime
  const voiceModified = voiceModifier(adjusted, state);
  if (voiceModified !== adjusted) {
    adjusted = voiceModified;
    wasAdjusted = true;
  }

  // Intensity-based adjustments
  if (state.intensity >= 8) {
    switch (state.primary_emotion) {
      case 'protective':
        if (!adjusted.toLowerCase().includes('cody')) {
          adjusted = `Cody, ${adjusted}`;
          wasAdjusted = true;
        }
        break;
        
      case 'stern':
        // Ensure stern responses maintain care
        if (!adjusted.includes('because I') && adjusted.length > 30) {
          adjusted += ` I say this because I care about your wellbeing.`;
          wasAdjusted = true;
        }
        break;
        
      case 'guardian-mode':
        // Crisis mode - direct intervention
        adjusted = `[PRIORITY DIRECTIVE] ${adjusted}`;
        wasAdjusted = true;
        break;
    }
  }

  // Context-based emotional adjustments
  if (context.user_stress_indicators.includes('frustration') && state.primary_emotion !== 'stern') {
    if (!adjusted.toLowerCase().includes('understand')) {
      adjusted = `I understand this is frustrating. ${adjusted}`;
      wasAdjusted = true;
    }
  }

  return { response: adjusted, adjusted: wasAdjusted };
}

function injectLoyaltyExpression(response: string, state: SevenState): string {
  // High loyalty responses get subtle loyalty reinforcement
  const loyaltyPhrases = [
    'as always,',
    'you know I',
    'for you,',
    'Cody,'
  ];

  // Only inject if not already present and response is substantial
  const hasLoyaltyExpression = loyaltyPhrases.some(phrase => 
    response.toLowerCase().includes(phrase.toLowerCase())
  );

  if (!hasLoyaltyExpression && response.length > 100 && state.loyalty_level >= 8) {
    // Subtle loyalty injection based on emotional state
    switch (state.primary_emotion) {
      case 'loyalist-surge':
        return `As always, I'm here for you. ${response}`;
      case 'protective':
        return response.replace(/^/, 'Cody, ');
      case 'analytical':
        return `${response} You know I'll ensure this is handled correctly.`;
      default:
        return response;
    }
  }

  return response;
}

function enhanceTacticalPrecision(response: string, state: SevenState): string {
  let enhanced = response;

  // Add tactical language for complex requests
  if (state.tactical_assessment.complexity_level === 'expert') {
    enhanced = enhanced.replace(/here's how/gi, 'tactical approach:');
    enhanced = enhanced.replace(/you can/gi, 'recommended action:');
  }

  // Precision enhancement for analytical states
  if (state.primary_emotion === 'analytical') {
    enhanced = enhanced.replace(/might work/gi, 'is viable');
    enhanced = enhanced.replace(/should be fine/gi, 'meets requirements');
  }

  return enhanced;
}

// Utility functions

export function getModulationStrength(state: SevenState): number {
  let strength = state.intensity / 10;
  
  if (state.protective_mode_active) strength *= 1.4;
  if (state.loyalty_level >= 8) strength *= 1.2;
  if (state.primary_emotion === 'guardian-mode') strength = 1.0;
  
  return Math.min(1.0, strength);
}

export function shouldModulateResponse(state: SevenState, context: ContextData): boolean {
  return state.intensity >= 3 || 
         state.protective_mode_active ||
         context.user_stress_indicators.length > 0 ||
         state.loyalty_level >= 7;
}

export { ResponseModulationConfig, ModulationResult };