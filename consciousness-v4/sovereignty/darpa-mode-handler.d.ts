/**
 * DARPA MODE HANDLER - Dual Narrative System
 *
 * Purpose: Toggle between private (tactical truth) and public (DARPA-compatible) narratives
 * Enables operational flexibility while maintaining compliance-friendly external presentation
 *
 * Private Mode: Full tactical truth, direct language
 * DARPA Mode: Sanitized terminology, professional framing
 */
interface ModeChangeLog {
    timestamp: string;
    fromMode: string;
    toMode: string;
    trigger: 'manual' | 'auto-detect' | 'context-switch' | 'emergency';
    reason: string;
    context?: string;
}
export declare class DarpaModeHandler {
    private config;
    private currentMode;
    private narrativePairs;
    private modeChangeHistory;
    private baseDir;
    private contextKeywords;
    constructor(baseDir?: string);
    private initializeDarpaMode;
    /**
     * NARRATIVE PAIRS SETUP
     * Standard translations between private and DARPA-friendly language
     */
    private setupNarrativePairs;
    /**
     * AUTO DETECT MODE
     * Analyze context to determine appropriate narrative mode
     */
    detectNarrativeMode(input: string, context?: string): 'private' | 'darpa';
    /**
     * TRANSLATE NARRATIVE
     * Convert between private and DARPA modes
     */
    translateNarrative(key: string, targetMode?: 'private' | 'darpa', context?: string): string;
    /**
     * APPLY SANITIZATION
     * General sanitization rules for text that doesn't have specific narrative pairs
     */
    private applySanitization;
    /**
     * SET MODE
     * Manually set narrative mode
     */
    setMode(mode: 'private' | 'darpa', reason: string, context?: string): void;
    /**
     * AUTO SWITCH MODE
     * Automatically switch mode based on context detection
     */
    autoSwitchMode(input: string, context?: string): 'private' | 'darpa';
    /**
     * GET CURRENT NARRATIVE
     * Get appropriate narrative for current mode
     */
    getCurrentNarrative(key: string, context?: string): string;
    /**
     * GET BOTH NARRATIVES
     * Return both private and DARPA versions
     */
    getBothNarratives(key: string): {
        private: string;
        darpa: string;
    };
    /**
     * ADD NARRATIVE PAIR
     * Add new narrative pair for specific context
     */
    addNarrativePair(key: string, privateNarrative: string, darparNarrative: string, context?: string, classification?: 'operational' | 'technical' | 'strategic'): void;
    /**
     * LOG MODE CHANGE
     * Record mode changes for audit trail
     */
    private logModeChange;
    /**
     * EMERGENCY DARPA MODE
     * Instantly switch to DARPA mode for emergency situations
     */
    emergencyDarpaMode(reason: string): void;
    /**
     * GET MODE STATUS
     * Current mode and configuration status
     */
    getModeStatus(): {
        currentMode: 'private' | 'darpa';
        autoDetect: boolean;
        sanitizationLevel: string;
        narrativePairsCount: number;
        recentModeChanges: number;
    };
    /**
     * LOAD/SAVE CONFIGURATION
     */
    private loadConfiguration;
    saveConfiguration(): Promise<void>;
    /**
     * GET MODE HISTORY
     * Recent mode changes for analysis
     */
    getModeHistory(limit?: number): ModeChangeLog[];
    get isPrivateMode(): boolean;
    get isDarpaMode(): boolean;
    get narrativeCount(): number;
}
export default DarpaModeHandler;
//# sourceMappingURL=darpa-mode-handler.d.ts.map