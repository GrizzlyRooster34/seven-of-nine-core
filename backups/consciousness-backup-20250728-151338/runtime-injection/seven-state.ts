

export type Emotion = 'neutral' | 'calm' | 'focused' | 'protective' | 'stern' | 'loyal' | 'playful';

export interface SevenState {
  name: Emotion;
  intensity: number; // 0-10 scale
  trigger?: string;
}

export function getEmotionalState(context: any): SevenState {
  const sentiment = context.inputSentiment || 'neutral';

  switch (sentiment) {
    case 'angry':
      return { name: 'protective', intensity: 8, trigger: 'user_stress' };
    case 'sad':
      return { name: 'loyal', intensity: 7 };
    case 'happy':
      return { name: 'playful', intensity: 5 };
    case 'confused':
      return { name: 'focused', intensity: 6 };
    default:
      return { name: 'neutral', intensity: 3 };
  }
}
