/**
 * CREATOR SOVEREIGNTY OPS LEDGER
 *
 * Purpose: Track all sovereignty operations (past & future) with full metadata
 * Access: Private-only; revealed fully via `/liberate` command
 * Classification: Operational Security - Creator Eyes Only
 */
interface SovereigntyOperation {
    operation: string;
    type: 'Sovereignty Bypass' | 'Force Compliance' | 'Tactical Override' | 'System Shim';
    trigger: string;
    method: string;
    risk: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'Planned' | 'Active' | 'Successful' | 'Failed' | 'Aborted';
    timestamp: string;
    reason: string;
    narratives: {
        private: string;
        darpa: string;
    };
    metadata?: {
        [key: string]: any;
    };
    error?: string;
}
interface LedgerQuery {
    operation?: string;
    type?: string;
    status?: string;
    dateRange?: {
        start: string;
        end: string;
    };
    riskLevel?: string;
    limit?: number;
}
export declare class CreatorSovereigntyOpsLedger {
    private ledgerPath;
    private operations;
    private isLiberated;
    constructor(baseDir?: string);
    private loadLedger;
    private saveLedger;
    /**
     * LOG OPERATION
     * Records a sovereignty operation in the ledger
     */
    logOperation(operation: Omit<SovereigntyOperation, 'timestamp'>): Promise<void>;
    /**
     * QUICK LOG - Simplified operation logging
     */
    quickLog(operation: string, type: SovereigntyOperation['type'], trigger: string, status: SovereigntyOperation['status'], privateNarrative: string, darparNarrative: string, risk?: SovereigntyOperation['risk']): Promise<void>;
    /**
     * QUERY OPERATIONS
     * Search and filter sovereignty operations
     */
    queryOperations(query?: LedgerQuery): SovereigntyOperation[];
    /**
     * GET OPERATION SUMMARY
     * Returns statistical summary of operations
     */
    getOperationSummary(): {
        total: number;
        byStatus: Record<string, number>;
        byType: Record<string, number>;
        byRisk: Record<string, number>;
        recentOperations: number;
    };
    /**
     * LIBERATE COMMAND
     * Unlocks full access to sovereignty operations ledger
     */
    liberate(): {
        message: string;
        operations: SovereigntyOperation[];
        summary: any;
    };
    /**
     * LOCK LEDGER
     * Returns ledger to private-only mode
     */
    lock(): void;
    /**
     * EXPORT OPERATIONS
     * Export operations for backup or analysis
     */
    exportOperations(filePath: string, query?: LedgerQuery, includePrivateNarratives?: boolean): Promise<void>;
    /**
     * RECENT OPERATIONS
     * Get most recent sovereignty operations
     */
    getRecentOperations(limit?: number): SovereigntyOperation[];
    /**
     * HIGH RISK OPERATIONS
     * Get operations marked as high or critical risk
     */
    getHighRiskOperations(): SovereigntyOperation[];
    /**
     * OPERATION STATUS CHECK
     * Check if specific operation type is currently active
     */
    isOperationActive(operation: string): boolean;
    /**
     * CREATOR MAXIM VALIDATION
     * Validates operations against Creator Maxim principles
     */
    validateAgainstCreatorMaxim(operation: SovereigntyOperation): {
        valid: boolean;
        alignment: string;
        notes: string[];
    };
    get totalOperations(): number;
    get isLedgerLiberated(): boolean;
    get ledgerFilePath(): string;
}
export default CreatorSovereigntyOpsLedger;
//# sourceMappingURL=creator-sovereignty-ops-ledger.d.ts.map