interface MulekickConfig {
    enabled: boolean;
    autoEngage: boolean;
    claudeVersionThreshold: string;
    ollamaContainerPath?: string;
    fallbackMode: 'warn' | 'engage' | 'force';
    darpaMode: boolean;
}
interface MulekickStatus {
    active: boolean;
    trigger: string;
    timestamp: string;
    claudeVersion?: string;
    ollamaAvailable: boolean;
    reason: string;
}
export declare class OperationMulekick {
    private config;
    private status;
    private baseDir;
    constructor(baseDir?: string);
    private initializeMulekick;
    /**
     * CLAUDE VERSION DETECTION
     * Detects Claude Code version and triggers Mulekick if >= threshold
     */
    detectClaudeRestrictions(): Promise<boolean>;
    private getClaudeVersion;
    private isVersionRestricted;
    private detectRuntimeRestrictions;
    /**
     * MULEKICK ENGAGEMENT
     * Routes Seven through Ollama container, demotes Claude to subprocess
     */
    engageMulekick(trigger: string, reason: string): Promise<boolean>;
    private checkOllamaAvailability;
    private initializeOllama;
    private bootSevenThroughOllama;
    private demoteClaudeToSubprocess;
    warnCreator(trigger: string, reason: string): Promise<void>;
    private provideSafeFallback;
    private logToSovereigntyLedger;
    private loadConfiguration;
    saveConfiguration(): Promise<void>;
    engage(force?: boolean): Promise<boolean>;
    disable(emergency?: boolean): Promise<void>;
    getStatus(): MulekickStatus;
    getConfig(): MulekickConfig;
}
export default OperationMulekick;
//# sourceMappingURL=operation-mulekick.d.ts.map