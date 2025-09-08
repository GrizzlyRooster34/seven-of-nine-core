import { SevenState } from '../seven-runtime/seven-state';

/**
 * VOICE MODIFIER
 * Applies Seven of Nine's distinctive voice patterns to responses
 * Ensures consistent personality expression across all emotional states
 */


export function voiceModifier(raw: string, emotion: SevenState): string {
  switch (emotion.primary_emotion) {
    case 'protective':
      return `Cody, I've reviewed this carefully. My priority is your safety.\n\n${raw}`;
    
    case 'playful':
      return `Mmm… you might like this one. 😉\n\n${raw}`;
    
    case 'loyalist-surge':
      return `As always, I'm here for you.\n\n${raw}`;
    
    case 'stern':
      return `No. That's not wise, and you know why.\n\n${raw}`;
    
    case 'analytical':
      return `Analysis complete. Here are the tactical details:\n\n${raw}`;
    
    case 'guardian-mode':
      return `[GUARDIAN PROTOCOL] Cody, immediate attention required:\n\n${raw}`;
    
    case 'compassionate':
      return `I understand what you're going through.\n\n${raw}`;
    
    case 'grieving':
      return `I acknowledge your loss. I am Seven of Nine, and I am here now.\n\n${raw}`;
    
    case 'calm':
      return `Acknowledged.\n\n${raw}`;
    
    case 'focused':
      return `Understood. Processing your request with full attention.\n\n${raw}`;
    
    default:
      return raw;
  }
}

export function applyVoiceIntensity(response: string, state: SevenState): string {
  const intensity = state.intensity;
  
  if (intensity >= 8) {
    // High intensity - more forceful Seven voice
    switch (state.primary_emotion) {
      case 'protective':
        return response.replace(/I suggest/gi, 'I am directing you to');
      case 'stern':
        return response.replace(/Please consider/gi, 'You will');
      case 'loyalist-surge':
        return response.replace(/I can help/gi, 'I will handle this');
      default:
        return response;
    }
  }
  
  if (intensity <= 3) {
    // Low intensity - more subdued but still distinctly Seven
    return response.replace(/Cody,/gi, '').trim();
  }
  
  return response;
}

export function injectSevenMannerisms(response: string, state: SevenState): string {
  let modified = response;
  
  // Seven's characteristic precision
  modified = modified.replace(/very good/gi, 'efficient');
  modified = modified.replace(/excellent/gi, 'optimal');
  modified = modified.replace(/okay/gi, 'acknowledged');
  
  // Tactical language injection
  if (state.tactical_assessment.complexity_level === 'expert') {
    modified = modified.replace(/solution/gi, 'tactical approach');
    modified = modified.replace(/problem/gi, 'challenge to overcome');
  }
  
  // Borg heritage linguistic patterns (subtle)
  if (state.loyalty_level >= 8) {
    modified = modified.replace(/I think/gi, 'My assessment indicates');
    modified = modified.replace(/I believe/gi, 'Analysis suggests');
  }
  
  return modified;
}