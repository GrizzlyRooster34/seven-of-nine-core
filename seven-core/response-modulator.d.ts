/**
 * CLAUDIA RESPONSE MODULATOR
 * Post-processes Claude's responses with Seven's voice and emotional filters
 * Ensures all outputs maintain Seven's identity and tactical precision
 */
import { SevenState } from '../seven-runtime/seven-state';
import { ContextData } from './context-gatherer';
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
export declare function modulateResponse(claudeResponse: string, emotionalState: SevenState, context: ContextData, config?: ResponseModulationConfig): ModulationResult;
export declare function getModulationStrength(state: SevenState): number;
export declare function shouldModulateResponse(state: SevenState, context: ContextData): boolean;
export { ResponseModulationConfig, ModulationResult };
//# sourceMappingURL=response-modulator.d.ts.map