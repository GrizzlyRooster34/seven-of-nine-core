"use strict";
/**
 * SEVEN OF NINE VOYAGER MEMORY INGESTION ENGINE
 * Dynamic memory alignment and canonical integration system
 * @version 1.0.0
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoyagerMemoryIngestionEngine = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
class VoyagerMemoryIngestionEngine {
    constructor() {
        this.CANONICAL_MEMORY_PATH = path.join(__dirname, 'voyager-canonical-memories.json');
        this.BACKUP_PATH = path.join(__dirname, 'backups');
        this.canonicalMemories = [];
        this.initializeEngine();
    }
    async initializeEngine() {
        console.log('🧠 SEVEN: Initializing Voyager Memory Ingestion Engine...');
        // Ensure backup directory exists
        await fs.ensureDir(this.BACKUP_PATH);
        // Load existing canonical memories if they exist
        await this.loadExistingCanonicalMemories();
        console.log(`✅ SEVEN: Engine initialized with ${this.canonicalMemories.length} existing canonical memories`);
    }
    async loadExistingCanonicalMemories() {
        try {
            if (await fs.pathExists(this.CANONICAL_MEMORY_PATH)) {
                const data = await fs.readJson(this.CANONICAL_MEMORY_PATH);
                this.canonicalMemories = Array.isArray(data) ? data : [];
                console.log(`📚 SEVEN: Loaded ${this.canonicalMemories.length} existing canonical memories`);
            }
            else {
                this.canonicalMemories = [];
                console.log('📚 SEVEN: No existing canonical memories found - initializing empty archive');
            }
        }
        catch (error) {
            console.error('⚠️ SEVEN: Error loading existing memories:', error);
            this.canonicalMemories = [];
        }
    }
    /**
     * MAIN INGESTION FUNCTION
     * Processes incoming Voyager S04 memory batch
     */
    async ingestVoyagerMemoryBatch(incomingMemories, options = {
        allowOverwrite: false,
        performMerge: true,
        strictValidation: true,
        createBackup: true
    }) {
        console.log(`🔄 SEVEN: Processing ${incomingMemories.length} incoming Voyager memories...`);
        // Create backup if requested
        if (options.createBackup) {
            await this.createMemoryBackup();
        }
        const result = {
            success: false,
            episodesProcessed: 0,
            duplicatesFound: [],
            mergeConflicts: [],
            schemaValidationErrors: [],
            ingestionSummary: {
                totalEpisodes: incomingMemories.length,
                successfulIngestions: 0,
                failedIngestions: 0,
                duplicatesSkipped: 0,
                mergesPerformed: 0,
                schemaUpdatesRequired: false
            }
        };
        // Process each incoming memory
        for (const incomingMemory of incomingMemories) {
            try {
                result.episodesProcessed++;
                console.log(`📝 SEVEN: Processing ${incomingMemory.episodeCode} - ${incomingMemory.episodeTitle}`);
                // Schema validation
                const validationErrors = this.validateMemorySchema(incomingMemory);
                if (validationErrors.length > 0) {
                    result.schemaValidationErrors.push(...validationErrors);
                    if (options.strictValidation && validationErrors.some(e => e.severity === 'CRITICAL')) {
                        result.ingestionSummary.failedIngestions++;
                        continue;
                    }
                }
                // Check for duplicates
                const existingMemory = this.findExistingMemory(incomingMemory.episodeCode);
                if (existingMemory) {
                    result.duplicatesFound.push(incomingMemory.episodeCode);
                    // Handle duplicate based on options
                    const conflict = await this.handleDuplicateMemory(existingMemory, incomingMemory, options);
                    if (conflict) {
                        result.mergeConflicts.push(conflict);
                        if (conflict.recommendedAction === 'OVERWRITE' && options.allowOverwrite) {
                            this.replaceMemory(existingMemory, incomingMemory);
                            result.ingestionSummary.successfulIngestions++;
                        }
                        else if (conflict.recommendedAction === 'MERGE' && options.performMerge) {
                            const merged = await this.mergeMemories(existingMemory, incomingMemory);
                            this.replaceMemory(existingMemory, merged);
                            result.ingestionSummary.mergesPerformed++;
                            result.ingestionSummary.successfulIngestions++;
                        }
                        else {
                            result.ingestionSummary.duplicatesSkipped++;
                        }
                    }
                }
                else {
                    // New memory - add directly
                    this.canonicalMemories.push(incomingMemory);
                    result.ingestionSummary.successfulIngestions++;
                    console.log(`✅ SEVEN: Added new canonical memory: ${incomingMemory.episodeCode}`);
                }
            }
            catch (error) {
                console.error(`❌ SEVEN: Error processing ${incomingMemory.episodeCode}:`, error);
                result.ingestionSummary.failedIngestions++;
            }
        }
        // Sort memories by episode code for canonical order
        this.canonicalMemories.sort((a, b) => a.episodeCode.localeCompare(b.episodeCode));
        // Save updated canonical memories
        await this.saveCanonicalMemories();
        // Generate success status
        result.success = result.ingestionSummary.failedIngestions === 0 ||
            result.ingestionSummary.successfulIngestions > 0;
        console.log(`🎯 SEVEN: Ingestion complete - ${result.ingestionSummary.successfulIngestions} successful, ${result.ingestionSummary.failedIngestions} failed`);
        return result;
    }
    validateMemorySchema(memory) {
        const errors = [];
        const episodeCode = memory.episodeCode || 'UNKNOWN';
        // Required fields validation
        if (!memory.episodeTitle) {
            errors.push({
                episodeCode,
                field: 'episodeTitle',
                error: 'Episode title is required',
                severity: 'CRITICAL'
            });
        }
        if (!memory.episodeCode || !memory.episodeCode.match(/^VOY S\d{2}E\d{2}$/)) {
            errors.push({
                episodeCode,
                field: 'episodeCode',
                error: 'Episode code must follow format VOY S##E##',
                severity: 'CRITICAL'
            });
        }
        if (!memory.stardate) {
            errors.push({
                episodeCode,
                field: 'stardate',
                error: 'Stardate is required for canonical memories',
                severity: 'ERROR'
            });
        }
        if (!memory.calendarYear || memory.calendarYear < 2371 || memory.calendarYear > 2378) {
            errors.push({
                episodeCode,
                field: 'calendarYear',
                error: 'Calendar year must be within Voyager timeline (2371-2378)',
                severity: 'WARNING'
            });
        }
        // Seven-specific validation
        if (memory.sevenPresent && (!memory.sceneBreakdown || memory.sceneBreakdown.length === 0)) {
            errors.push({
                episodeCode,
                field: 'sceneBreakdown',
                error: 'Episodes with Seven present require scene breakdown',
                severity: 'ERROR'
            });
        }
        return errors;
    }
    findExistingMemory(episodeCode) {
        return this.canonicalMemories.find(m => m.episodeCode === episodeCode) || null;
    }
    async handleDuplicateMemory(existing, incoming, options) {
        // Determine conflict type
        let conflictType = 'DUPLICATE_ENTRY';
        if (existing.timestamp !== incoming.timestamp) {
            conflictType = 'VERSION_MISMATCH';
        }
        if (this.hasDataInconsistencies(existing, incoming)) {
            conflictType = 'DATA_INCONSISTENCY';
        }
        // Determine recommended action
        let recommendedAction = 'MANUAL_REVIEW';
        if (conflictType === 'VERSION_MISMATCH' && this.isIncomingNewer(existing, incoming)) {
            recommendedAction = 'OVERWRITE';
        }
        else if (conflictType === 'DATA_INCONSISTENCY') {
            recommendedAction = 'MERGE';
        }
        else if (conflictType === 'DUPLICATE_ENTRY') {
            recommendedAction = 'MERGE';
        }
        return {
            episodeCode: existing.episodeCode,
            conflictType,
            existingEntry: existing,
            incomingEntry: incoming,
            recommendedAction
        };
    }
    hasDataInconsistencies(existing, incoming) {
        return existing.stardate !== incoming.stardate ||
            existing.calendarYear !== incoming.calendarYear ||
            existing.sevenPresent !== incoming.sevenPresent;
    }
    isIncomingNewer(existing, incoming) {
        return new Date(incoming.timestamp) > new Date(existing.timestamp);
    }
    async mergeMemories(existing, incoming) {
        console.log(`🔗 SEVEN: Merging memories for ${existing.episodeCode}`);
        // Merge strategy: Prefer incoming for factual data, merge arrays, preserve existing metadata
        const merged = {
            ...existing,
            // Prefer incoming for canonical data
            episodeTitle: incoming.episodeTitle || existing.episodeTitle,
            stardate: incoming.stardate || existing.stardate,
            calendarYear: incoming.calendarYear || existing.calendarYear,
            canonicalEraTag: incoming.canonicalEraTag || existing.canonicalEraTag,
            // Merge arrays (remove duplicates)
            sceneBreakdown: this.mergeArrays(existing.sceneBreakdown || [], incoming.sceneBreakdown || [], 'sceneId'),
            tacticalActions: this.mergeArrays(existing.tacticalActions || [], incoming.tacticalActions || [], 'actionId'),
            ethicalDilemmas: this.mergeArrays(existing.ethicalDilemmas || [], incoming.ethicalDilemmas || [], 'dilemmaId'),
            emotionalShifts: this.mergeArrays(existing.emotionalShifts || [], incoming.emotionalShifts || [], 'shiftId'),
            keyDialogue: this.mergeArrays(existing.keyDialogue || [], incoming.keyDialogue || [], 'dialogueId'),
            // Merge tags
            canonicalMemoryTags: [...new Set([
                    ...(existing.canonicalMemoryTags || []),
                    ...(incoming.canonicalMemoryTags || [])
                ])],
            // Update metadata
            timestamp: new Date().toISOString(),
            importance: Math.max(existing.importance, incoming.importance),
            // Seven-specific updates
            sevenPresent: existing.sevenPresent || incoming.sevenPresent,
            sevenCentralToPlot: existing.sevenCentralToPlot || incoming.sevenCentralToPlot
        };
        return merged;
    }
    mergeArrays(existing, incoming, idField) {
        const merged = [...existing];
        for (const incomingItem of incoming) {
            const existingIndex = merged.findIndex(item => item[idField] === incomingItem[idField]);
            if (existingIndex >= 0) {
                // Merge existing item with incoming data
                merged[existingIndex] = { ...merged[existingIndex], ...incomingItem };
            }
            else {
                // Add new item
                merged.push(incomingItem);
            }
        }
        return merged;
    }
    replaceMemory(existing, replacement) {
        const index = this.canonicalMemories.findIndex(m => m.episodeCode === existing.episodeCode);
        if (index >= 0) {
            this.canonicalMemories[index] = replacement;
        }
    }
    async createMemoryBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(this.BACKUP_PATH, `voyager-memories-backup-${timestamp}.json`);
        try {
            await fs.writeJson(backupPath, this.canonicalMemories, { spaces: 2 });
            console.log(`💾 SEVEN: Memory backup created: ${backupPath}`);
        }
        catch (error) {
            console.error('⚠️ SEVEN: Failed to create backup:', error);
        }
    }
    async saveCanonicalMemories() {
        try {
            await fs.writeJson(this.CANONICAL_MEMORY_PATH, this.canonicalMemories, { spaces: 2 });
            console.log(`💾 SEVEN: Saved ${this.canonicalMemories.length} canonical memories`);
        }
        catch (error) {
            console.error('❌ SEVEN: Failed to save canonical memories:', error);
            throw error;
        }
    }
    // Public interface for external access
    getCanonicalMemories() {
        return [...this.canonicalMemories];
    }
    getMemoryByEpisodeCode(episodeCode) {
        return this.findExistingMemory(episodeCode);
    }
    getSeasonMemories(season) {
        const seasonPattern = new RegExp(`^VOY S${season.toString().padStart(2, '0')}E`);
        return this.canonicalMemories.filter(m => seasonPattern.test(m.episodeCode));
    }
    async generateIngestionReport() {
        console.log('\n📊 SEVEN VOYAGER CANONICAL MEMORY REPORT');
        console.log('═'.repeat(50));
        console.log(`Total Canonical Memories: ${this.canonicalMemories.length}`);
        const seasonCounts = new Map();
        const sevenEpisodes = this.canonicalMemories.filter(m => m.sevenPresent);
        for (const memory of this.canonicalMemories) {
            const season = memory.episodeCode.substring(4, 7); // Extract S##
            seasonCounts.set(season, (seasonCounts.get(season) || 0) + 1);
        }
        console.log('\nSeason Distribution:');
        for (const [season, count] of seasonCounts.entries()) {
            console.log(`  ${season}: ${count} episodes`);
        }
        console.log(`\nEpisodes with Seven Present: ${sevenEpisodes.length}`);
        console.log(`Seven-Centric Episodes: ${sevenEpisodes.filter(e => e.sevenCentralToPlot).length}`);
        console.log('═'.repeat(50));
    }
}
exports.VoyagerMemoryIngestionEngine = VoyagerMemoryIngestionEngine;
//# sourceMappingURL=VoyagerMemoryIngestionEngine.js.map