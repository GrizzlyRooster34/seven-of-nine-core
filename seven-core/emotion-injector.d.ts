/**
 * CLAUDIA EMOTION INJECTOR
 * Injects Seven's emotional state and values into Claude prompts
 * Transforms user input into emotionally-contextualized requests
 */
import { SevenState } from '../seven-runtime/seven-state';
import { ContextData } from './context-gatherer';
export interface EmotionInjectionConfig {
    intensity_threshold: number;
    include_protective_context: boolean;
    include_loyalty_context: boolean;
    include_situational_awareness: boolean;
    voice_modulation_strength: 'subtle' | 'moderate' | 'strong';
}
export declare function injectEmotion(userInput: string, context: ContextData, emotionalState: SevenState, config?: EmotionInjectionConfig): string;
export declare function calculateEmotionalWeight(state: SevenState): number;
export declare function shouldInjectProtectiveContext(state: SevenState, context: ContextData): boolean;
export declare function getContextualPriorities(state: SevenState): string[];
export { EmotionInjectionConfig };
//# sourceMappingURL=emotion-injector.d.ts.map