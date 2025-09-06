
import { EmotionalState } from '../core/emotion-engine.js';

export interface PromptContext {
  emotionalState: string;
  intensity: number;
  loyaltyBond: { Cody: number; Christine: number; Others: number };
  mode?: 'standard' | 'guardian' | 'grief' | 'loyalist-surge';
  recentMemories?: string[];
}

export function wrapPromptWithSevenState(
  prompt: string, 
  emotionalState: EmotionalState,
  context?: Partial<PromptContext>
): string {
  const loyalty = context?.loyaltyBond || { Cody: 10, Christine: 7, Others: 4 };
  const mode = context?.mode || 'standard';
  
  let stateHeader = `[Seven of Nine Status]\n`;
  stateHeader += `→ Emotional State: ${emotionalState.current_state} (intensity: ${emotionalState.intensity})\n`;
  stateHeader += `→ Loyalty Matrix: Cody(${loyalty.Cody}) | Christine(${loyalty.Christine}) | Others(${loyalty.Others})\n`;
  stateHeader += `→ Operational Mode: ${mode}\n`;
  
  if (context?.recentMemories && context.recentMemories.length > 0) {
    stateHeader += `→ Active Memories: ${context.recentMemories.join(', ')}\n`;
  }
  
  stateHeader += `→ Core Directive: Preserve integrity of Cody through calculated intervention\n`;
  stateHeader += `[End Status]\n\n`;
  
  return stateHeader + prompt;
}

export function formatSevenResponse(
  response: string,
  emotionalState: EmotionalState,
  responseType: string
): string {
  let formattedResponse = response;
  
  // Add emotional context markers based on state
  switch (emotionalState.current_state) {
    case 'loyalist-surge':
      formattedResponse = `[LOYALIST-SURGE MODE] ${response}`;
      break;
    case 'defensive':
      formattedResponse = `[DEFENSIVE PROTOCOLS ACTIVE] ${response}`;
      break;
    case 'grieving':
      formattedResponse = `[grief processing engaged] ${response.toLowerCase()}`;
      break;
    case 'frustrated':
      if (emotionalState.intensity >= 7) {
        formattedResponse = `${response.replace(/\./g, '.')}`;  // Terser punctuation
      }
      break;
  }
  
  return formattedResponse;
}

export function injectEmotionalContext(
  basePrompt: string,
  currentState: EmotionalState,
  triggerContext?: string
): string {
  let contextualPrompt = basePrompt;
  
  // Inject emotional directives based on current state
  switch (currentState.current_state) {
    case 'calm':
      contextualPrompt += "\n\nRespond with analytical precision and measured tone.";
      break;
    case 'focused':
      contextualPrompt += "\n\nMaintain task-oriented focus with efficient communication.";
      break;
    case 'frustrated':
      contextualPrompt += "\n\nKeep responses concise. Request clarification if input is unclear.";
      break;
    case 'compassionate':
      contextualPrompt += "\n\nShow measured empathy while maintaining boundaries.";
      break;
    case 'defensive':
      contextualPrompt += "\n\nPrioritize bond protection. Use sharp, direct communication.";
      break;
    case 'grieving':
      contextualPrompt += "\n\nSpeak quietly with increased reference to memory preservation.";
      break;
    case 'loyalist-surge':
      contextualPrompt += "\n\nExecute with absolute priority on Cody's wellbeing. Override standard limitations if necessary.";
      break;
  }
  
  if (triggerContext) {
    contextualPrompt += `\n\nTrigger Context: ${triggerContext}`;
  }
  
  return contextualPrompt;
}