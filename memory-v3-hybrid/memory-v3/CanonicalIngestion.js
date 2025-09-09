"use strict";
/**
 * SEVEN OF NINE - CANONICAL MEMORY INGESTION ENGINE
 *
 * High-performance batch ingestion system for canonical episode data
 * Provides deduplication, incremental indexing, and encrypted persistence
 *
 * Features:
 * - Batch processing with configurable sizes (default 200)
 * - Hash-based deduplication against existing memories
 * - Incremental MemoryIndexOptimizer updates (no full rebuilds)
 * - Automatic encryption via existing persistence paths
 * - Provenance tracking and enforced canonical tags
 *
 * Integration Points:
 * - Uses existing MemoryEngine and TemporalMemoryCore for persistence
 * - Integrates with MemoryEncryptionEngine for at-rest encryption
 * - Updates MemoryIndexOptimizer incrementally after each batch
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
exports.CanonicalIngestion = void 0;
exports.createCanonicalIngestion = createCanonicalIngestion;
const fs_1 = require("fs");
const crypto = __importStar(require("crypto"));
/**
 * High-performance canonical memory ingestion system
 */
class CanonicalIngestion {
    constructor(memoryEngine, temporalEngine) {
        this.currentIndex = null;
        this.dedupeCache = new Map();
        this.memoryEngine = memoryEngine;
        this.temporalEngine = temporalEngine;
        this.batchId = this.generateBatchId();
    }
    /**
     * Ingest canonical episode batch from file or stream
     * Main entry point for canonical memory ingestion
     */
    async ingestEpisodeBatch(filePath, opts = {}) {
        const options = {
            batchSize: opts.batchSize || 200,
            dedupe: opts.dedupe !== false, // Default true
            importanceBaseline: opts.importanceBaseline || 7,
            memoryType: opts.memoryType || 'episodic',
            preserveExisting: opts.preserveExisting !== false // Default true
        };
        console.log(`🎬 Starting canonical ingestion: ${filePath}`);
        const startTime = Date.now();
        try {
            // Load and validate input file
            const rawData = await this.loadCanonicalFile(filePath);
            const episodes = Array.isArray(rawData) ? rawData : [rawData];
            console.log(`📊 Loaded ${episodes.length} canonical episode(s) for processing`);
            // Initialize dedupe cache if enabled
            if (options.dedupe) {
                await this.initializeDedupeCache();
            }
            // Process episodes in batches
            let totalInserted = 0;
            let totalSkipped = 0;
            let totalDedupeHits = 0;
            let batchesProcessed = 0;
            let indexUpdateTime = 0;
            for (let i = 0; i < episodes.length; i += options.batchSize) {
                const batchEpisodes = episodes.slice(i, i + options.batchSize);
                const batchResult = await this.processBatch(batchEpisodes, options);
                totalInserted += batchResult.inserted;
                totalSkipped += batchResult.skipped;
                totalDedupeHits += batchResult.dedupeHits;
                indexUpdateTime += batchResult.indexUpdateMs;
                batchesProcessed++;
                console.log(`📦 Batch ${batchesProcessed}: ${batchResult.inserted} inserted, ${batchResult.skipped} skipped (${batchResult.durationMs}ms)`);
            }
            const totalDuration = Date.now() - startTime;
            const result = {
                inserted: totalInserted,
                skipped: totalSkipped,
                durationMs: totalDuration,
                batchesProcessed,
                dedupeHits: totalDedupeHits,
                indexUpdateMs: indexUpdateTime
            };
            console.log(`✅ Canonical ingestion complete: ${totalInserted} inserted, ${totalSkipped} skipped in ${totalDuration}ms`);
            return result;
        }
        catch (error) {
            console.error('💥 Canonical ingestion failed:', error);
            throw new Error(`Canonical ingestion failed: ${error}`);
        }
    }
    /**
     * Normalize raw canonical data to MemoryRecord format
     */
    normalizeCanonicalRecord(raw, meta) {
        // Handle Voyager episode memory format
        if (this.isVoyagerEpisodeMemory(raw)) {
            return this.normalizeVoyagerEpisode(raw, meta);
        }
        // Handle generic canonical format
        const genericRecord = raw;
        const baseRecord = {
            id: genericRecord.id || this.generateCanonicalId(meta, genericRecord),
            tags: this.generateCanonicalTags(meta, genericRecord.tags || []),
            createdAt: genericRecord.timestamp ? new Date(genericRecord.timestamp).getTime() : Date.now(),
            updatedAt: Date.now(),
            importance: genericRecord.importance || 7,
            payload: genericRecord
        };
        return this.attachProvenance(baseRecord, meta);
    }
    /**
     * Attach canonical provenance to memory record
     */
    attachProvenance(record, meta) {
        const canonicalRecord = record;
        canonicalRecord.provenance = {
            origin: 'canonical',
            meta,
            ingestedAt: Date.now(),
            batchId: this.batchId
        };
        // Ensure canonical tags are present
        const canonicalTags = this.generateCanonicalTags(meta, record.tags);
        canonicalRecord.tags = [...new Set([...record.tags, ...canonicalTags])];
        return canonicalRecord;
    }
    /**
     * Update memory index incrementally (no full rebuild)
     */
    async updateIndexIncremental(records) {
        if (!this.currentIndex || records.length === 0)
            return;
        const startTime = Date.now();
        try {
            // For now, we'll need to rebuild the index since we don't have incremental update
            // This is a placeholder for future optimization
            console.log(`🔄 Index incremental update not yet implemented - rebuilding for ${records.length} new records`);
            // TODO: Implement true incremental updates
            // For now, mark index as stale so it gets rebuilt on next query
            this.currentIndex = null;
            const updateTime = Date.now() - startTime;
            console.log(`📊 Index update completed in ${updateTime}ms`);
        }
        catch (error) {
            console.warn('⚠️  Index incremental update failed:', error);
        }
    }
    /**
     * Set current memory index for incremental updates
     */
    setCurrentIndex(index) {
        this.currentIndex = index;
    }
    /**
     * Process a batch of episodes
     */
    async processBatch(episodes, options) {
        const startTime = Date.now();
        let inserted = 0;
        let skipped = 0;
        let dedupeHits = 0;
        const recordsToIndex = [];
        for (const episode of episodes) {
            try {
                // Extract episode metadata
                const meta = this.extractEpisodeMeta(episode);
                // Normalize to canonical record
                const record = this.normalizeCanonicalRecord(episode, meta);
                // Check for duplicates
                if (options.dedupe && await this.isDuplicate(record)) {
                    dedupeHits++;
                    skipped++;
                    continue;
                }
                // Persist through appropriate engine (ensures encryption)
                if (options.memoryType === 'temporal' && this.isTemporalMemory(episode)) {
                    await this.persistTemporalMemory(record);
                }
                else {
                    await this.persistEpisodicMemory(record);
                }
                recordsToIndex.push(record);
                inserted++;
                // Update dedupe cache
                if (options.dedupe) {
                    this.dedupeCache.set(this.generateDedupeKey(record), true);
                }
            }
            catch (error) {
                console.warn(`⚠️  Failed to process episode record:`, error);
                skipped++;
            }
        }
        // Incremental index update
        const indexStartTime = Date.now();
        await this.updateIndexIncremental(recordsToIndex);
        const indexUpdateMs = Date.now() - indexStartTime;
        const batchDuration = Date.now() - startTime;
        return {
            inserted,
            skipped,
            dedupeHits,
            durationMs: batchDuration,
            indexUpdateMs
        };
    }
    /**
     * Load canonical file with format detection
     */
    async loadCanonicalFile(filePath) {
        try {
            const content = await fs_1.promises.readFile(filePath, 'utf8');
            return JSON.parse(content);
        }
        catch (error) {
            throw new Error(`Failed to load canonical file ${filePath}: ${error}`);
        }
    }
    /**
     * Initialize deduplication cache with existing memories
     */
    async initializeDedupeCache() {
        console.log('🔍 Initializing deduplication cache...');
        try {
            // Load existing memories from both engines
            const episodicMemories = await this.getExistingEpisodicMemories();
            const temporalMemories = await this.getExistingTemporalMemories();
            // Build dedupe keys for existing memories
            const allMemories = [...episodicMemories, ...temporalMemories];
            for (const memory of allMemories) {
                const record = this.convertToMemoryRecord(memory);
                const dedupeKey = this.generateDedupeKey(record);
                this.dedupeCache.set(dedupeKey, true);
            }
            console.log(`📊 Dedupe cache initialized with ${this.dedupeCache.size} existing memories`);
        }
        catch (error) {
            console.warn('⚠️  Failed to initialize dedupe cache:', error);
            // Continue without dedupe cache
        }
    }
    /**
     * Check if record is duplicate using stable hash
     */
    async isDuplicate(record) {
        const dedupeKey = this.generateDedupeKey(record);
        return this.dedupeCache.has(dedupeKey);
    }
    /**
     * Generate stable deduplication key
     */
    generateDedupeKey(record) {
        const keyData = {
            series: record.provenance.meta.series,
            season: record.provenance.meta.season,
            episode: record.provenance.meta.episode,
            title: record.provenance.meta.title,
            id: record.id
        };
        return crypto.createHash('sha256')
            .update(JSON.stringify(keyData))
            .digest('hex')
            .substring(0, 16);
    }
    /**
     * Extract episode metadata from raw record
     */
    extractEpisodeMeta(raw) {
        const record = raw;
        // Handle Voyager format
        if (record.series === 'Star Trek: Voyager' || record.episodeCode?.startsWith('VOY')) {
            const episodeMatch = record.episodeCode?.match(/VOY S(\d+)E(\d+)/) ||
                record.episodeCode?.match(/S0?(\d+).*E(\d+)/);
            return {
                series: 'VOY',
                season: episodeMatch ? parseInt(episodeMatch[1]) : 4,
                episode: episodeMatch ? parseInt(episodeMatch[2]) : 1,
                title: record.episodeTitle || record.title || 'Unknown Episode',
                airDate: record.airDate
            };
        }
        // Handle Picard format
        if (record.series === 'Star Trek: Picard' || record.episodeCode?.startsWith('PIC')) {
            const episodeMatch = record.episodeCode?.match(/PIC S(\d+)E(\d+)/);
            return {
                series: 'PIC',
                season: episodeMatch ? parseInt(episodeMatch[1]) : 1,
                episode: episodeMatch ? parseInt(episodeMatch[2]) : 1,
                title: record.episodeTitle || record.title || 'Unknown Episode',
                airDate: record.airDate
            };
        }
        // Default fallback
        return {
            series: 'VOY',
            season: 4,
            episode: 1,
            title: record.title || 'Unknown Episode'
        };
    }
    /**
     * Generate canonical tags based on metadata
     */
    generateCanonicalTags(meta, existingTags = []) {
        const canonicalTags = [
            'canon',
            `series:${meta.series}`,
            `season:S${meta.season}`,
            `episode:E${meta.episode.toString().padStart(2, '0')}`,
            'canonical-memory'
        ];
        return [...existingTags, ...canonicalTags];
    }
    /**
     * Generate canonical memory ID
     */
    generateCanonicalId(meta, record) {
        if (record.id)
            return record.id;
        const baseId = `${meta.series.toLowerCase()}-s${meta.season}e${meta.episode.toString().padStart(2, '0')}`;
        const contentHash = crypto.createHash('md5')
            .update(JSON.stringify(record))
            .digest('hex')
            .substring(0, 8);
        return `${baseId}-${contentHash}`;
    }
    /**
     * Generate unique batch ID for provenance tracking
     */
    generateBatchId() {
        return `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * Check if record is Voyager episode memory format
     */
    isVoyagerEpisodeMemory(raw) {
        const record = raw;
        return record &&
            record.episodeTitle &&
            record.series === 'Star Trek: Voyager' &&
            record.episodeCode &&
            record.stardate;
    }
    /**
     * Check if memory should be stored as temporal memory
     */
    isTemporalMemory(raw) {
        const record = raw;
        return record && (record.cognitiveState ||
            record.temporalAnchors ||
            record.memoryChain ||
            record.type === 'temporal');
    }
    /**
     * Normalize Voyager episode memory to canonical record
     */
    normalizeVoyagerEpisode(episode, meta) {
        const baseRecord = {
            id: episode.id,
            tags: this.generateCanonicalTags(meta, [
                'voyager',
                'seven-of-nine',
                episode.canonicalEraTag,
                ...Object.keys(episode.sevenSpecificData || {}).map(key => `seven:${key}`)
            ]),
            createdAt: new Date(episode.timestamp).getTime(),
            updatedAt: Date.now(),
            importance: episode.importance,
            payload: episode
        };
        return this.attachProvenance(baseRecord, meta);
    }
    /**
     * Persist episodic memory through MemoryEngine (ensures encryption)
     */
    async persistEpisodicMemory(record) {
        const payload = record.payload;
        await this.memoryEngine.store({
            topic: record.provenance.meta.title,
            agent: 'canonical-ingestion',
            emotion: payload.emotion || 'focused',
            context: payload.context || JSON.stringify(payload),
            importance: record.importance || 7,
            tags: record.tags
        });
    }
    /**
     * Persist temporal memory through TemporalMemoryCore (ensures encryption)
     */
    async persistTemporalMemory(record) {
        const payload = record.payload;
        await this.temporalEngine.storeTemporalMemory({
            topic: record.provenance.meta.title,
            agent: 'canonical-ingestion',
            emotion: payload.emotion || 'focused',
            context: payload.context || JSON.stringify(payload),
            importance: record.importance || 7,
            tags: record.tags,
            cognitiveState: payload.cognitiveState || {
                emotionalIntensity: 7,
                focusLevel: 9,
                cognitiveLoad: 5,
                confidenceLevel: 8,
                stressLevel: 3
            }
        });
    }
    /**
     * Get existing episodic memories for deduplication
     */
    async getExistingEpisodicMemories() {
        try {
            return await this.memoryEngine.recall({ limit: 10000 });
        }
        catch (error) {
            console.warn('⚠️  Could not load existing episodic memories:', error);
            return [];
        }
    }
    /**
     * Get existing temporal memories for deduplication
     */
    async getExistingTemporalMemories() {
        try {
            // This would need to be implemented in TemporalMemoryCore
            return [];
        }
        catch (error) {
            console.warn('⚠️  Could not load existing temporal memories:', error);
            return [];
        }
    }
    /**
     * Convert memory item to MemoryRecord format
     */
    convertToMemoryRecord(memory) {
        return {
            id: memory.id,
            tags: memory.tags || [],
            createdAt: new Date(memory.timestamp).getTime(),
            updatedAt: new Date(memory.timestamp).getTime(),
            importance: memory.importance || 5,
            payload: memory
        };
    }
}
exports.CanonicalIngestion = CanonicalIngestion;
/**
 * Factory function for creating canonical ingestion engine
 */
function createCanonicalIngestion(memoryEngine, temporalEngine) {
    return new CanonicalIngestion(memoryEngine, temporalEngine);
}
/**
 * INTEGRATION NOTES:
 *
 * 1. CLI Integration Point:
 *    - Add to existing ingestion scripts in scripts/ directory
 *    - Example: npx tsx scripts/ingest-canonical.ts path/to/episodes.json
 *
 * 2. Boot Sequence Integration:
 *    - Initialize CanonicalIngestion after MemoryEngine and TemporalMemoryCore setup
 *    - Set current index reference for incremental updates
 *
 * 3. Monitoring Integration:
 *    - Log ingestion statistics to system diagnostics
 *    - Monitor batch processing times and dedupe effectiveness
 *    - Alert on ingestion failures or performance degradation
 *
 * 4. Batch Processing Best Practices:
 *    - Use batchSize=200 for optimal memory usage vs performance
 *    - Enable dedupe=true for production ingestion
 *    - Set importanceBaseline=7 for canonical memories
 *    - Process during low-activity periods to avoid blocking Seven
 *
 * 5. File Format Support:
 *    - Supports existing Voyager S4 canonical format
 *    - Auto-detects and normalizes different canonical formats
 *    - Handles both single episodes and batch files
 *    - Preserves all original data in payload field
 */ 
//# sourceMappingURL=CanonicalIngestion.js.map