"use strict";
/**
 * SEVEN OF NINE - MEMORY INDEX OPTIMIZER
 *
 * High-performance memory indexing system for sub-10ms memory lookups
 * Implements B-tree-style indexing with multiple access patterns
 * Enhanced with LRU cache layer for frequent memory record lookups
 *
 * Performance Targets:
 * - <1ms per cached lookup (LRU cache hit)
 * - <10ms per lookup on 1-5K records (index fallback)
 * - Immutable design with compact internal storage
 * - Multiple index types: id, tags, time ranges
 *
 * Integration Points:
 * - Wire into MemoryEngine.loadMemories() after decryption
 * - Rebuild index on memory append/remove operations
 * - Cache index with source version hash for invalidation
 * - LRU cache warm-up during boot or ingestion
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
exports.MemoryIndexOptimizer = void 0;
exports.createIndex = createIndex;
const crypto = __importStar(require("crypto"));
const LRUCache_1 = require("./LRUCache");
/**
 * Lightweight B-tree implementation optimized for memory operations
 */
class LightweightBTree {
    constructor(degree = 16, compareFunc) {
        this.root = null;
        this.degree = degree;
        this.compareFunc = compareFunc;
    }
    /**
     * Build B-tree from sorted key-value pairs (bulk loading)
     */
    buildFromSorted(sortedPairs) {
        if (sortedPairs.length === 0) {
            this.root = null;
            return;
        }
        // Build leaf level first
        const leaves = [];
        for (let i = 0; i < sortedPairs.length; i += this.degree) {
            const chunk = sortedPairs.slice(i, i + this.degree);
            const leaf = {
                keys: chunk.map(([k]) => k),
                values: chunk.map(([, v]) => v),
                isLeaf: true
            };
            leaves.push(leaf);
        }
        // Build internal nodes bottom-up
        let currentLevel = leaves;
        while (currentLevel.length > 1) {
            const nextLevel = [];
            for (let i = 0; i < currentLevel.length; i += this.degree) {
                const children = currentLevel.slice(i, i + this.degree);
                const keys = children.map(child => child.keys[0]);
                const internal = {
                    keys,
                    values: [], // Internal nodes don't store values
                    children,
                    isLeaf: false
                };
                nextLevel.push(internal);
            }
            currentLevel = nextLevel;
        }
        this.root = currentLevel[0];
    }
    /**
     * Find exact match by key
     */
    find(key) {
        if (!this.root)
            return undefined;
        return this.findInNode(this.root, key);
    }
    /**
     * Find all values in range [fromKey, toKey]
     */
    findRange(fromKey, toKey) {
        if (!this.root)
            return [];
        const results = [];
        this.findRangeInNode(this.root, fromKey, toKey, results);
        return results;
    }
    findInNode(node, key) {
        let i = 0;
        while (i < node.keys.length && this.compareFunc(key, node.keys[i]) > 0) {
            i++;
        }
        if (i < node.keys.length && this.compareFunc(key, node.keys[i]) === 0) {
            return node.isLeaf ? node.values[i] : undefined;
        }
        if (node.isLeaf) {
            return undefined;
        }
        return node.children ? this.findInNode(node.children[i], key) : undefined;
    }
    findRangeInNode(node, fromKey, toKey, results) {
        if (node.isLeaf) {
            for (let i = 0; i < node.keys.length; i++) {
                const key = node.keys[i];
                if (this.compareFunc(key, fromKey) >= 0 && this.compareFunc(key, toKey) <= 0) {
                    results.push(node.values[i]);
                }
            }
        }
        else if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
                // Check if this subtree might contain relevant values
                const childMinKey = node.children[i].keys[0];
                const childMaxKey = node.children[i].keys[node.children[i].keys.length - 1];
                if (this.compareFunc(childMaxKey, fromKey) >= 0 && this.compareFunc(childMinKey, toKey) <= 0) {
                    this.findRangeInNode(node.children[i], fromKey, toKey, results);
                }
            }
        }
    }
}
/**
 * High-performance memory index with multiple access patterns
 */
class MemoryIndexOptimizer {
    constructor(options = {}) {
        this.cacheEnabled = true;
        this.idIndex = new Map();
        this.tagIndex = new Map();
        this.timeIndex = new LightweightBTree(32, (a, b) => a - b);
        this.memories = new Map();
        this.sourceVersionHash = '';
        // Initialize LRU cache
        const cacheSize = options.cacheSize || 256;
        this.cacheEnabled = options.enableCache !== false; // Default true
        this.lruCache = new LRUCache_1.LRUCache(cacheSize);
    }
    /**
     * Build optimized indexes from memory records
     * Factory method for creating new index instances
     */
    static buildFrom(memories, options = {}) {
        const optimizer = new MemoryIndexOptimizer(options);
        // Calculate source version hash for cache invalidation
        const sourceData = JSON.stringify(memories.map(m => ({ id: m.id, updatedAt: m.updatedAt })));
        optimizer.sourceVersionHash = crypto.createHash('sha256').update(sourceData).digest('hex').substring(0, 16);
        // Build primary ID index (fastest lookup)
        for (const memory of memories) {
            optimizer.idIndex.set(memory.id, memory);
            optimizer.memories.set(memory.id, memory);
        }
        // Build tag index (inverted index for tag-based queries)
        for (const memory of memories) {
            for (const tag of memory.tags) {
                if (!optimizer.tagIndex.has(tag)) {
                    optimizer.tagIndex.set(tag, new Set());
                }
                optimizer.tagIndex.get(tag).add(memory.id);
            }
        }
        // Build time-based B-tree index for range queries
        const timeEntries = memories
            .map(m => [m.updatedAt, m.id])
            .sort((a, b) => a[0] - b[0]);
        optimizer.timeIndex.buildFromSorted(timeEntries);
        console.log(`🚀 Memory index built: ${memories.length} records, ${optimizer.tagIndex.size} unique tags, hash: ${optimizer.sourceVersionHash}`);
        return optimizer;
    }
    /**
     * Get memory record by ID (primary key lookup)
     * Enhanced with LRU cache layer for frequent lookups
     * Target: <0.1ms for cache hit, <1ms for cache miss + index lookup
     */
    getById(id) {
        // Check LRU cache first if enabled
        if (this.cacheEnabled) {
            const cachedRecord = this.lruCache.get(id);
            if (cachedRecord !== undefined) {
                return cachedRecord; // Cache hit - fastest path
            }
        }
        // Cache miss - fallback to index lookup
        const record = this.idIndex.get(id);
        // Cache the result for future lookups (if enabled and record exists)
        if (this.cacheEnabled && record !== undefined) {
            this.lruCache.set(id, record);
        }
        return record;
    }
    /**
     * Get all memory records containing specific tag
     * Target: <5ms for tag-based lookup
     */
    getByTag(tag) {
        const memoryIds = this.tagIndex.get(tag);
        if (!memoryIds)
            return [];
        const results = [];
        for (const id of memoryIds) {
            const memory = this.idIndex.get(id);
            if (memory)
                results.push(memory);
        }
        return results;
    }
    /**
     * Get memory records containing ALL specified tags (AND semantics)
     * Target: <8ms for multi-tag intersection
     */
    getByTagsAll(tags) {
        if (tags.length === 0)
            return [];
        if (tags.length === 1)
            return this.getByTag(tags[0]);
        // Find intersection of all tag sets (optimize by starting with smallest set)
        const tagSets = tags
            .map(tag => this.tagIndex.get(tag))
            .filter(set => set !== undefined);
        if (tagSets.length !== tags.length)
            return []; // Some tags don't exist
        // Sort by set size (smallest first for faster intersection)
        tagSets.sort((a, b) => a.size - b.size);
        // Start with smallest set and intersect with others
        let intersection = new Set(tagSets[0]);
        for (let i = 1; i < tagSets.length; i++) {
            const newIntersection = new Set();
            for (const id of intersection) {
                if (tagSets[i].has(id)) {
                    newIntersection.add(id);
                }
            }
            intersection = newIntersection;
            // Early exit if intersection becomes empty
            if (intersection.size === 0)
                break;
        }
        // Convert IDs to memory records
        const results = [];
        for (const id of intersection) {
            const memory = this.idIndex.get(id);
            if (memory)
                results.push(memory);
        }
        return results;
    }
    /**
     * Get memory records within time range [from, to]
     * Target: <10ms for time range queries using B-tree
     */
    getByTimeRange(from, to) {
        const memoryIds = this.timeIndex.findRange(from, to);
        const results = [];
        for (const id of memoryIds) {
            const memory = this.idIndex.get(id);
            if (memory)
                results.push(memory);
        }
        return results;
    }
    /**
     * Get memory records by importance threshold
     * Target: <8ms for importance filtering
     */
    getByImportanceMin(minImportance) {
        const results = [];
        for (const memory of this.memories.values()) {
            if ((memory.importance || 0) >= minImportance) {
                results.push(memory);
            }
        }
        return results;
    }
    /**
     * Complex query: tags AND time range AND importance
     * Target: <15ms for combined queries
     */
    getByComplexQuery(options) {
        let candidates = Array.from(this.memories.values());
        // Apply tag filter first (most selective)
        if (options.tags && options.tags.length > 0) {
            candidates = this.getByTagsAll(options.tags);
        }
        // Apply time range filter
        if (options.timeRange) {
            const timeResults = new Set(this.getByTimeRange(options.timeRange.from, options.timeRange.to).map(m => m.id));
            candidates = candidates.filter(m => timeResults.has(m.id));
        }
        // Apply importance filter
        if (options.minImportance !== undefined) {
            candidates = candidates.filter(m => (m.importance || 0) >= options.minImportance);
        }
        return candidates;
    }
    /**
     * Get current index size
     */
    size() {
        return this.memories.size;
    }
    /**
     * Get source version hash for cache invalidation
     */
    getSourceVersionHash() {
        return this.sourceVersionHash;
    }
    /**
     * Get index statistics for performance monitoring
     */
    getIndexStats() {
        const memoryUsage = this.memories.size * 200 + // Approximate per-record overhead
            this.tagIndex.size * 50 + // Tag index overhead
            this.idIndex.size * 100; // ID index overhead
        return {
            totalRecords: this.memories.size,
            uniqueTags: this.tagIndex.size,
            sourceVersionHash: this.sourceVersionHash,
            memoryUsageApprox: memoryUsage
        };
    }
    /**
     * Get LRU cache statistics for performance monitoring
     */
    getCacheStats() {
        return this.lruCache.getStats();
    }
    /**
     * Warm up cache with most important or frequently accessed memories
     * Call during boot sequence or after ingestion for optimal performance
     */
    warmUpCache(options = {}) {
        if (!this.cacheEnabled) {
            console.log('📋 Cache warm-up skipped - caching disabled');
            return;
        }
        const { importanceThreshold = 8, maxWarmupEntries = 128, targetMemoryIds } = options;
        let warmupCandidates = [];
        if (targetMemoryIds && targetMemoryIds.length > 0) {
            // Warm up specific memory IDs
            warmupCandidates = targetMemoryIds
                .map(id => this.memories.get(id))
                .filter(record => record !== undefined);
        }
        else {
            // Warm up high importance memories
            warmupCandidates = Array.from(this.memories.values())
                .filter(record => (record.importance || 0) >= importanceThreshold)
                .sort((a, b) => (b.importance || 0) - (a.importance || 0))
                .slice(0, maxWarmupEntries);
        }
        // Warm up the cache
        const warmupEntries = warmupCandidates.map(record => [record.id, record]);
        this.lruCache.warmUp(warmupEntries);
        console.log(`🔥 Memory index cache warmed up with ${warmupEntries.length} high-importance records`);
    }
    /**
     * Clear cache and optionally reset statistics
     * Useful when memory records are updated or index is rebuilt
     */
    clearCache(resetStats = false) {
        if (!this.cacheEnabled)
            return;
        this.lruCache.clear();
        if (resetStats) {
            this.lruCache.resetStats();
        }
        console.log('🧹 Memory index cache cleared');
    }
    /**
     * Get comprehensive cache efficiency report
     */
    getCacheEfficiencyReport() {
        if (!this.cacheEnabled) {
            return '📊 Cache Efficiency: DISABLED';
        }
        return this.lruCache.getEfficiencyReport();
    }
    /**
     * Enable or disable LRU cache
     */
    setCacheEnabled(enabled) {
        const wasEnabled = this.cacheEnabled;
        this.cacheEnabled = enabled;
        if (!enabled && wasEnabled) {
            this.lruCache.clear();
            console.log('📋 Memory index cache disabled and cleared');
        }
        else if (enabled && !wasEnabled) {
            console.log('🚀 Memory index cache enabled');
        }
    }
    /**
     * Update cache size (creates new cache, losing current cached data)
     */
    updateCacheSize(newSize) {
        if (newSize <= 0) {
            throw new Error('Cache size must be positive');
        }
        const oldStats = this.lruCache.getStats();
        this.lruCache = new LRUCache_1.LRUCache(newSize);
        console.log(`📊 Cache size updated: ${oldStats.maxSize} -> ${newSize} (previous cache cleared)`);
    }
}
exports.MemoryIndexOptimizer = MemoryIndexOptimizer;
/**
 * Factory function for creating indexed memory store
 */
function createIndex(memories, options = {}) {
    const index = MemoryIndexOptimizer.buildFrom(memories, options);
    // Auto warm-up cache with high importance memories if enabled
    if (options.enableCache !== false) {
        index.warmUpCache({ importanceThreshold: 8, maxWarmupEntries: Math.min(128, Math.floor(memories.length * 0.1)) });
    }
    return {
        index,
        sourceVersionHash: index.getSourceVersionHash(),
        builtAt: Date.now()
    };
}
/**
 * INTEGRATION NOTES:
 *
 * 1. Memory Loading Integration:
 *    - In MemoryEngine.loadMemoriesWithEncryption(): After successful load
 *    - Convert MemoryItem[] to MemoryRecord[] format
 *    - Call createIndex() to build optimized indexes
 *    - Cache IndexedMemoryStore with source version hash
 *
 * 2. Memory Query Integration:
 *    - In MemoryEngine.recall(): Check if index exists and is current
 *    - Use index.getByTag(), index.getByComplexQuery() instead of Array.filter()
 *    - Fallback to original Array.filter() if index is unavailable
 *
 * 3. Index Maintenance (Non-blocking):
 *    - On memory append: Mark index as stale, rebuild in background
 *    - On memory delete: Mark index as stale, rebuild in background
 *    - Use source version hash to detect when rebuild is needed
 *    - Implement lazy index rebuild to avoid blocking main memory operations
 *
 * 4. Memory Record Conversion:
 *    - Convert MemoryItem to MemoryRecord:
 *      {
 *        id: memoryItem.id,
 *        tags: memoryItem.tags,
 *        createdAt: new Date(memoryItem.timestamp).getTime(),
 *        updatedAt: new Date(memoryItem.timestamp).getTime(),
 *        importance: memoryItem.importance,
 *        payload: memoryItem
 *      }
 *
 * 5. Query Pattern Examples:
 *    // Replace this:
 *    memories.filter(m => m.tags.includes('upgrade'))
 *
 *    // With this:
 *    indexedStore.index.getByTag('upgrade').map(r => r.payload as MemoryItem)
 *
 *    // Complex queries:
 *    indexedStore.index.getByComplexQuery({
 *      tags: ['consciousness', 'upgrade'],
 *      minImportance: 7,
 *      timeRange: { from: Date.now() - 86400000, to: Date.now() }
 *    })
 *
 * 6. Performance Monitoring:
 *    - Add timing measurements around index operations
 *    - Log index rebuild times and query performance
 *    - Monitor memory usage of indexes
 *    - Alert if query times exceed 10ms threshold
 */ 
//# sourceMappingURL=MemoryIndexOptimizer.js.map