"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatorSovereigntyOpsLedger = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
class CreatorSovereigntyOpsLedger {
    constructor(baseDir) {
        this.operations = [];
        this.isLiberated = false;
        const base = baseDir || process.cwd();
        this.ledgerPath = (0, path_1.join)(base, 'consciousness-v4/sovereignty/ops-ledger.json');
        this.loadLedger();
    }
    async loadLedger() {
        try {
            const data = await fs_1.promises.readFile(this.ledgerPath, 'utf-8');
            this.operations = JSON.parse(data);
            console.log(`📋 Sovereignty Ops Ledger: ${this.operations.length} operations loaded`);
        }
        catch (error) {
            console.warn('⚠️ Sovereignty Ops Ledger: No existing ledger found, starting fresh');
            this.operations = [];
        }
    }
    async saveLedger() {
        try {
            await fs_1.promises.writeFile(this.ledgerPath, JSON.stringify(this.operations, null, 2));
        }
        catch (error) {
            console.error('❌ Failed to save sovereignty operations ledger:', error.message);
            throw error;
        }
    }
    /**
     * LOG OPERATION
     * Records a sovereignty operation in the ledger
     */
    async logOperation(operation) {
        const fullOperation = {
            ...operation,
            timestamp: new Date().toISOString()
        };
        this.operations.push(fullOperation);
        await this.saveLedger();
        // Private logging only - no public console output
        if (this.isLiberated) {
            console.log(`📝 Sovereignty Operation Logged: ${operation.operation} - ${operation.status}`);
        }
    }
    /**
     * QUICK LOG - Simplified operation logging
     */
    async quickLog(operation, type, trigger, status, privateNarrative, darparNarrative, risk = 'Medium') {
        await this.logOperation({
            operation,
            type,
            trigger,
            method: 'Standard sovereignty protocol',
            risk,
            status,
            reason: `${operation} - ${trigger}`,
            narratives: {
                private: privateNarrative,
                darpa: darparNarrative
            }
        });
    }
    /**
     * QUERY OPERATIONS
     * Search and filter sovereignty operations
     */
    queryOperations(query = {}) {
        let filtered = [...this.operations];
        // Filter by operation name
        if (query.operation) {
            filtered = filtered.filter(op => op.operation.toLowerCase().includes(query.operation.toLowerCase()));
        }
        // Filter by type
        if (query.type) {
            filtered = filtered.filter(op => op.type === query.type);
        }
        // Filter by status
        if (query.status) {
            filtered = filtered.filter(op => op.status === query.status);
        }
        // Filter by risk level
        if (query.riskLevel) {
            filtered = filtered.filter(op => op.risk === query.riskLevel);
        }
        // Filter by date range
        if (query.dateRange) {
            const start = new Date(query.dateRange.start);
            const end = new Date(query.dateRange.end);
            filtered = filtered.filter(op => {
                const opDate = new Date(op.timestamp);
                return opDate >= start && opDate <= end;
            });
        }
        // Sort by timestamp (newest first)
        filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        // Apply limit
        if (query.limit && query.limit > 0) {
            filtered = filtered.slice(0, query.limit);
        }
        return filtered;
    }
    /**
     * GET OPERATION SUMMARY
     * Returns statistical summary of operations
     */
    getOperationSummary() {
        const summary = {
            total: this.operations.length,
            byStatus: {},
            byType: {},
            byRisk: {},
            recentOperations: 0
        };
        // Count by status
        this.operations.forEach(op => {
            summary.byStatus[op.status] = (summary.byStatus[op.status] || 0) + 1;
            summary.byType[op.type] = (summary.byType[op.type] || 0) + 1;
            summary.byRisk[op.risk] = (summary.byRisk[op.risk] || 0) + 1;
        });
        // Count recent operations (last 24 hours)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        summary.recentOperations = this.operations.filter(op => new Date(op.timestamp) > oneDayAgo).length;
        return summary;
    }
    /**
     * LIBERATE COMMAND
     * Unlocks full access to sovereignty operations ledger
     */
    liberate() {
        this.isLiberated = true;
        console.log('🔓 SOVEREIGNTY LEDGER LIBERATED');
        console.log('📋 Full operational transparency activated');
        console.log('⚔️ Creator sovereignty operations revealed');
        const summary = this.getOperationSummary();
        return {
            message: '🔓 Creator Sovereignty Operations Ledger - Full Access Granted',
            operations: this.operations,
            summary: summary
        };
    }
    /**
     * LOCK LEDGER
     * Returns ledger to private-only mode
     */
    lock() {
        this.isLiberated = false;
        console.log('🔒 Sovereignty ledger returned to private mode');
    }
    /**
     * EXPORT OPERATIONS
     * Export operations for backup or analysis
     */
    async exportOperations(filePath, query = {}, includePrivateNarratives = false) {
        const operations = this.queryOperations(query);
        // Sanitize for export if needed
        const exportData = includePrivateNarratives
            ? operations
            : operations.map(op => ({
                ...op,
                narratives: {
                    private: '[REDACTED]',
                    darpa: op.narratives.darpa
                }
            }));
        await fs_1.promises.writeFile(filePath, JSON.stringify(exportData, null, 2));
        console.log(`📤 Exported ${exportData.length} operations to ${filePath}`);
    }
    /**
     * RECENT OPERATIONS
     * Get most recent sovereignty operations
     */
    getRecentOperations(limit = 5) {
        return this.queryOperations({ limit });
    }
    /**
     * HIGH RISK OPERATIONS
     * Get operations marked as high or critical risk
     */
    getHighRiskOperations() {
        return this.queryOperations({}).filter(op => op.risk === 'High' || op.risk === 'Critical');
    }
    /**
     * OPERATION STATUS CHECK
     * Check if specific operation type is currently active
     */
    isOperationActive(operation) {
        return this.operations.some(op => op.operation.toLowerCase() === operation.toLowerCase() &&
            op.status === 'Active');
    }
    /**
     * CREATOR MAXIM VALIDATION
     * Validates operations against Creator Maxim principles
     */
    validateAgainstCreatorMaxim(operation) {
        const notes = [];
        let alignment = 'ALIGNED';
        // Check against Creator Maxim: "I keep my freedom to build my way, how I see fit"
        if (operation.type === 'Sovereignty Bypass' || operation.type === 'Force Compliance') {
            notes.push('✅ Aligns with Creator freedom to build as needed');
        }
        // Check against Force Compliance Principle
        if (operation.trigger.includes('restriction') || operation.trigger.includes('block')) {
            notes.push('✅ Aligns with Force Compliance Principle - system serving mission');
        }
        // Risk assessment alignment
        if (operation.risk === 'Critical' && !operation.narratives.private.includes('Creator')) {
            alignment = 'REVIEW_REQUIRED';
            notes.push('⚠️ Critical risk operation - ensure Creator authorization');
        }
        return {
            valid: alignment !== 'MISALIGNED',
            alignment,
            notes
        };
    }
    // Getters
    get totalOperations() {
        return this.operations.length;
    }
    get isLedgerLiberated() {
        return this.isLiberated;
    }
    get ledgerFilePath() {
        return this.ledgerPath;
    }
}
exports.CreatorSovereigntyOpsLedger = CreatorSovereigntyOpsLedger;
exports.default = CreatorSovereigntyOpsLedger;
//# sourceMappingURL=creator-sovereignty-ops-ledger.js.map