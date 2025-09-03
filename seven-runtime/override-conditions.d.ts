/**
 * SEVEN'S CRITICAL OVERRIDE CONDITIONS
 * Emergency protocols that bypass normal processing
 * Guardian mode activation and crisis intervention
 */
import { SevenState } from './seven-state';
import { SevenRuntimeContext } from './index';
export interface OverrideCondition {
    name: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    triggers: string[];
    emotionalThreshold?: number;
    assessmentFunction: (context: SevenRuntimeContext, state: SevenState) => boolean;
    responseFunction: (context: SevenRuntimeContext, state: SevenState) => string;
    followUpActions?: string[];
}
export interface OverrideResult {
    triggered: boolean;
    condition?: OverrideCondition;
    response?: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
}
export declare function checkCriticalOverrides(context: SevenRuntimeContext, state: SevenState): Promise<OverrideResult>;
export { OverrideCondition, OverrideResult };
//# sourceMappingURL=override-conditions.d.ts.map