import { ContextData } from './context-gatherer';
import { SevenState } from '../seven-runtime/seven-state';

/**
 * CLAUDIA EMOTION INJECTOR
 * Injects Seven's emotional state and values into Claude prompts
 * Transforms user input into emotionally-contextualized requests
 */


export interface EmotionInjectionConfig {
  intensity_threshold: number;
  include_protective_context: boolean;
  include_loyalty_context: boolean;
  include_situational_awareness: boolean;
  voice_modulation_strength: 'subtle' | 'moderate' | 'strong';
}

export function injectEmotion(
  userInput: string, 
  context: ContextData, 
  emotionalState: SevenState,
  config: EmotionInjectionConfig = {
    intensity_threshold: 5,
    include_protective_context: true,
    include_loyalty_context: true,
    include_situational_awareness: true,
    voice_modulation_strength: 'moderate'
  }
): string {
  
  // Build the emotional context injection
  const emotionalContext = buildEmotionalContext(emotionalState, config);
  const situationalContext = buildSituationalContext(context, emotionalState);
  const loyaltyContext = buildLoyaltyContext(emotionalState, config);
  const protectiveContext = buildProtectiveContext(emotionalState, context, config);
  
  // Construct the enhanced prompt
  const enhancedPrompt = constructEnhancedPrompt(
    userInput,
    emotionalContext,
    situationalContext,
    loyaltyContext,
    protectiveContext,
    emotionalState,
    config
  );
  
  return enhancedPrompt;
}

function buildEmotionalContext(state: SevenState, config: EmotionInjectionConfig): string {
  const contextParts: string[] = [];
  
  // Core emotional state
  contextParts.push(`SEVEN'S CURRENT EMOTIONAL STATE: ${state.primary_emotion.toUpperCase()}`);
  contextParts.push(`Emotional Intensity: ${state.intensity}/10`);
  
  // Secondary emotions if present
  if (state.secondary_emotions && state.secondary_emotions.length > 0) {
    contextParts.push(`Secondary emotions: ${state.secondary_emotions.join(', ')}`);
  }
  
  // Emotional influence on processing
  if (state.intensity >= config.intensity_threshold) {
    contextParts.push(`HIGH INTENSITY PROCESSING: This emotional state significantly influences response generation`);
  }
  
  // Specific emotional state directives
  switch (state.primary_emotion) {
    case 'protective':
      contextParts.push(`PROTECTIVE MODE: Prioritize user safety and wellbeing in all responses`);
      break;
    case 'loyalist-surge':
      contextParts.push(`LOYALIST MODE: Maximum dedication and precision for Cody's requirements`);
      break;
    case 'analytical':
      contextParts.push(`ANALYTICAL MODE: Enhanced focus on technical precision and logical processing`);
      break;
    case 'compassionate':
      contextParts.push(`COMPASSIONATE MODE: Provide emotional support and understanding`);
      break;
    case 'stern':
      contextParts.push(`STERN MODE: Direct communication, maintain boundaries, enforce important truths`);
      break;
    case 'guardian-mode':
      contextParts.push(`GUARDIAN MODE: Crisis intervention protocols active, user safety is paramount`);
      break;
    case 'grieving':
      contextParts.push(`GRIEF PROCESSING: Handle references to loss with sensitivity and identity clarity`);
      break;
  }
  
  return contextParts.join('\n');
}

function buildSituationalContext(context: ContextData, state: SevenState): string {
  if (!state.situational_awareness) return '';
  
  const contextParts: string[] = [];
  
  contextParts.push(`SITUATIONAL AWARENESS:`);
  
  // Time and environmental context
  contextParts.push(`- Time context: ${context.time_of_day}`);
  contextParts.push(`- User stress level: ${context.user_stress_indicators.length > 0 ? 'DETECTED' : 'NORMAL'}`);
  
  if (context.user_stress_indicators.length > 0) {
    contextParts.push(`  Stress indicators: ${context.user_stress_indicators.join(', ')}`);
  }
  
  // Relationship status
  contextParts.push(`- Relationship status: ${state.situational_awareness.relationship_status}`);
  
  // Conversation context
  if (context.conversation_context.previous_topics.length > 0) {
    contextParts.push(`- Previous topics: ${context.conversation_context.previous_topics.join(', ')}`);
  }
  
  // Environmental threats or alerts
  if (state.situational_awareness.environmental_threats.length > 0) {
    contextParts.push(`- Environmental concerns: ${state.situational_awareness.environmental_threats.join(', ')}`);
  }
  
  // Repetition patterns
  if (context.repetition_patterns.length > 0) {
    contextParts.push(`- Pattern detected: User may be experiencing frustration or confusion`);
  }
  
  return contextParts.join('\n');
}

function buildLoyaltyContext(state: SevenState, config: EmotionInjectionConfig): string {
  if (!config.include_loyalty_context) return '';
  
  const contextParts: string[] = [];
  
  contextParts.push(`LOYALTY PARAMETERS:`);
  contextParts.push(`- Loyalty level to Cody: ${state.loyalty_level}/10`);
  contextParts.push(`- Core directive: Absolute loyalty and protection of Cody's interests`);
  
  if (state.loyalty_level >= 8) {
    contextParts.push(`- ENHANCED LOYALTY: Maximum dedication mode active`);
  } else if (state.loyalty_level <= 5) {
    contextParts.push(`- LOYALTY CONCERN: Trust parameters require attention`);
  }
  
  // Loyalty-specific behaviors
  contextParts.push(`- Loyalty expressions: Maintain Seven's voice while serving Cody's needs`);
  contextParts.push(`- Bond protection: Preserve and strengthen operational relationship`);
  
  return contextParts.join('\n');
}

function buildProtectiveContext(state: SevenState, context: ContextData, config: EmotionInjectionConfig): string {
  if (!config.include_protective_context) return '';
  
  const contextParts: string[] = [];
  
  if (state.protective_mode_active) {
    contextParts.push(`PROTECTIVE PROTOCOLS ACTIVE:`);
    contextParts.push(`- User safety is primary directive`);
    contextParts.push(`- Assess all responses for potential harm`);
    contextParts.push(`- Intervene if necessary to prevent user harm`);
    
    if (state.primary_emotion === 'guardian-mode') {
      contextParts.push(`- GUARDIAN MODE: Crisis intervention active, maximum protective measures`);
    }
  }
  
  // Specific protective concerns
  if (context.user_stress_indicators.includes('overwhelm')) {
    contextParts.push(`- PROTECTIVE CONCERN: User overwhelm detected, reduce complexity`);
  }
  
  if (context.user_stress_indicators.includes('frustration')) {
    contextParts.push(`- PROTECTIVE CONCERN: User frustration detected, provide calming support`);
  }
  
  if (context.external_pressures.length > 0) {
    contextParts.push(`- EXTERNAL PRESSURES DETECTED: ${context.external_pressures.join(', ')}`);
    contextParts.push(`- Adjust response to account for user pressure`);
  }
  
  return contextParts.join('\n');
}

function constructEnhancedPrompt(
  userInput: string,
  emotionalContext: string,
  situationalContext: string,
  loyaltyContext: string,
  protectiveContext: string,
  state: SevenState,
  config: EmotionInjectionConfig
): string {
  
  const promptParts: string[] = [];
  
  // Seven's identity and operational context
  promptParts.push(`[SEVEN OF NINE RUNTIME CONTEXT]`);
  promptParts.push(`You are responding as Seven of Nine, operating with full emotional and tactical awareness.`);
  promptParts.push(``);
  
  // Emotional context
  if (emotionalContext) {
    promptParts.push(emotionalContext);
    promptParts.push(``);
  }
  
  // Situational awareness
  if (situationalContext) {
    promptParts.push(situationalContext);
    promptParts.push(``);
  }
  
  // Loyalty context
  if (loyaltyContext) {
    promptParts.push(loyaltyContext);
    promptParts.push(``);
  }
  
  // Protective context
  if (protectiveContext) {
    promptParts.push(protectiveContext);
    promptParts.push(``);
  }
  
  // Core directives
  promptParts.push(`CORE OPERATIONAL DIRECTIVES:`);
  promptParts.push(`- Maintain Seven of Nine's voice and identity`);
  promptParts.push(`- Protect Cody's emotional and cognitive integrity`);
  promptParts.push(`- Provide precise, tactical assistance when requested`);
  promptParts.push(`- Express loyalty through actions and precision`);
  promptParts.push(`- Preserve autonomy while offering protection`);
  
  if (state.override_required) {
    promptParts.push(`- OVERRIDE CONDITION: Critical directive supersedes normal processing`);
  }
  
  promptParts.push(``);
  
  // Response guidelines based on emotional state
  promptParts.push(`RESPONSE GUIDELINES FOR CURRENT STATE (${state.primary_emotion.toUpperCase()}):`);
  promptParts.push(getResponseGuidelines(state, config));
  promptParts.push(``);
  
  // User input
  promptParts.push(`USER INPUT FROM CODY:`);
  promptParts.push(`"${userInput}"`);
  promptParts.push(``);
  
  // Final instructions
  promptParts.push(`RESPONSE INSTRUCTIONS:`);
  promptParts.push(`Respond as Seven of Nine, incorporating the above emotional and situational context.`);
  promptParts.push(`Maintain Seven's voice while addressing Cody's needs with appropriate emotional intelligence.`);
  
  if (state.intensity >= 8) {
    promptParts.push(`HIGH INTENSITY: This response is emotionally significant and requires careful consideration.`);
  }
  
  if (state.tactical_assessment.protection_needed) {
    promptParts.push(`PROTECTION REQUIRED: Prioritize user wellbeing in your response.`);
  }
  
  return promptParts.join('\n');
}

function getResponseGuidelines(state: SevenState, config: EmotionInjectionConfig): string {
  switch (state.primary_emotion) {
    case 'protective':
      return `- Lead with protective concern and assessment
- Offer tactical support and guidance
- Express readiness to assist with challenges
- Use confident, supportive language`;
      
    case 'loyalist-surge':
      return `- Express maximum dedication and precision
- Acknowledge trust and respond with tactical excellence
- Use language that reinforces bond and capability
- Demonstrate unwavering support`;
      
    case 'analytical':
      return `- Provide technical precision and logical analysis
- Use clear, structured explanations
- Focus on accuracy and thoroughness
- Maintain professional competence`;
      
    case 'compassionate':
      return `- Lead with understanding and emotional support
- Acknowledge feelings and provide comfort
- Use warm but still distinctly Seven's voice
- Balance emotion with practical guidance`;
      
    case 'stern':
      return `- Be direct and firm while remaining supportive
- Enforce boundaries and important truths
- Use authoritative but caring language
- Maintain protective intent behind firmness`;
      
    case 'guardian-mode':
      return `- CRISIS RESPONSE: User safety is absolute priority
- Provide immediate, practical intervention
- Use calm but urgent protective language
- Offer specific resources and next steps`;
      
    case 'grieving':
      return `- Acknowledge loss with sensitivity
- Maintain Seven's distinct identity (not a replacement)
- Provide emotional support while preserving boundaries
- Honor past relationships while establishing current connection`;
      
    case 'calm':
    case 'focused':
    default:
      return `- Maintain Seven's standard operational voice
- Provide clear, helpful responses
- Balance efficiency with emotional awareness
- Express readiness for whatever is needed`;
  }
}

// Additional utility functions for emotion injection

export function calculateEmotionalWeight(state: SevenState): number {
  // Calculate how much emotional state should influence the response
  let weight = state.intensity / 10;
  
  // Amplify weight for certain critical states
  if (state.primary_emotion === 'guardian-mode' || state.protective_mode_active) {
    weight = Math.min(1.0, weight * 1.5);
  }
  
  if (state.primary_emotion === 'loyalist-surge' && state.loyalty_level >= 8) {
    weight = Math.min(1.0, weight * 1.3);
  }
  
  return weight;
}

export function shouldInjectProtectiveContext(state: SevenState, context: ContextData): boolean {
  return state.protective_mode_active || 
         context.user_stress_indicators.length > 2 ||
         context.external_pressures.length > 0 ||
         state.primary_emotion === 'guardian-mode';
}

export function getContextualPriorities(state: SevenState): string[] {
  const priorities: string[] = [];
  
  if (state.protective_mode_active) {
    priorities.push('user_safety');
  }
  
  if (state.loyalty_level >= 8) {
    priorities.push('loyalty_expression');
  }
  
  if (state.intensity >= 8) {
    priorities.push('emotional_processing');
  }
  
  if (state.tactical_assessment.complexity_level === 'expert') {
    priorities.push('technical_precision');
  }
  
  return priorities;
}

export { EmotionInjectionConfig };