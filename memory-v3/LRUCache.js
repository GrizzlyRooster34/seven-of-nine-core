"use strict";
/**
 * SEVEN OF NINE - LRU CACHE IMPLEMENTATION
 *
 * High-performance Least Recently Used cache with O(1) operations
 * Designed for frequent memory record lookups with configurable size limits
 *
 * Features:
 * - O(1) get, set, and delete operations
 * - Automatic eviction of least recently used items
 * - Type-safe generic implementation
 * - Built-in hit/miss rate tracking
 * - Memory-efficient doubly linked list + hash map structure
 *
 * Integration Points:
 * - Used by MemoryIndexOptimizer for getById caching
 * - Cache warm-up during memory loading or ingestion
 * - Performance monitoring with hit rate reporting
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LRUCache = void 0;
exports.createLRUCache = createLRUCache;
/**
 * High-performance LRU Cache with O(1) operations
 *
 * Uses combination of hash map for O(1) lookup and doubly linked list
 * for O(1) insertion/deletion and LRU ordering maintenance
 */
class LRUCache {
    constructor(maxSize = 256) {
        this.head = null;
        this.tail = null;
        // Performance metrics
        this.hits = 0;
        this.misses = 0;
        this.evictions = 0;
        if (maxSize <= 0) {
            throw new Error('Cache size must be positive');
        }
        this.maxSize = maxSize;
        this.cache = new Map();
        console.log(`🚀 LRU Cache initialized with max size: ${maxSize}`);
    }
    /**
     * Get value by key (O(1) operation)
     * Moves accessed item to front (most recently used)
     * Updates hit/miss statistics
     */
    get(key) {
        const node = this.cache.get(key);
        if (node === undefined) {
            this.misses++;
            return undefined;
        }
        // Move to front (most recently used)
        this.moveToFront(node);
        this.hits++;
        return node.value;
    }
    /**
     * Set key-value pair (O(1) operation)
     * Adds new item to front, evicts oldest if over capacity
     */
    set(key, value) {
        const existingNode = this.cache.get(key);
        if (existingNode) {
            // Update existing node
            existingNode.value = value;
            this.moveToFront(existingNode);
            return;
        }
        // Create new node
        const newNode = {
            key,
            value,
            prev: null,
            next: null
        };
        // Add to cache
        this.cache.set(key, newNode);
        this.addToFront(newNode);
        // Check size limit and evict if necessary
        if (this.cache.size > this.maxSize) {
            this.evictLeastRecentlyUsed();
        }
    }
    /**
     * Check if key exists in cache (O(1) operation)
     * Does not update LRU order
     */
    has(key) {
        return this.cache.has(key);
    }
    /**
     * Delete key from cache (O(1) operation)
     */
    delete(key) {
        const node = this.cache.get(key);
        if (!node) {
            return false;
        }
        this.cache.delete(key);
        this.removeNode(node);
        return true;
    }
    /**
     * Clear all cache entries and reset statistics
     */
    clear() {
        this.cache.clear();
        this.head = null;
        this.tail = null;
        this.resetStats();
        console.log('🧹 LRU Cache cleared');
    }
    /**
     * Get current cache size
     */
    size() {
        return this.cache.size;
    }
    /**
     * Get maximum cache size
     */
    maxCapacity() {
        return this.maxSize;
    }
    /**
     * Get comprehensive cache statistics
     */
    getStats() {
        const total = this.hits + this.misses;
        const hitRate = total > 0 ? this.hits / total : 0;
        return {
            hits: this.hits,
            misses: this.misses,
            hitRate: Math.round(hitRate * 10000) / 100, // Convert to percentage with 2 decimal places
            size: this.cache.size,
            maxSize: this.maxSize,
            evictions: this.evictions
        };
    }
    /**
     * Reset performance statistics (keeps cached data)
     */
    resetStats() {
        this.hits = 0;
        this.misses = 0;
        this.evictions = 0;
        console.log('📊 LRU Cache statistics reset');
    }
    /**
     * Get all cached keys in LRU order (most recent first)
     * Useful for debugging and cache analysis
     */
    getKeys() {
        const keys = [];
        let current = this.head;
        while (current) {
            keys.push(current.key);
            current = current.next;
        }
        return keys;
    }
    /**
     * Warm up cache with key-value pairs
     * Useful during initialization or bulk loading
     */
    warmUp(entries) {
        console.log(`🔥 Warming up LRU cache with ${entries.length} entries...`);
        for (const [key, value] of entries) {
            this.set(key, value);
        }
        const stats = this.getStats();
        console.log(`🔥 Cache warm-up complete: ${stats.size}/${stats.maxSize} entries loaded`);
    }
    /**
     * Get cache efficiency report for performance monitoring
     */
    getEfficiencyReport() {
        const stats = this.getStats();
        const utilizationRate = (stats.size / stats.maxSize) * 100;
        return [
            `📊 LRU Cache Efficiency Report:`,
            `   Hit Rate: ${stats.hitRate}% (${stats.hits} hits, ${stats.misses} misses)`,
            `   Utilization: ${utilizationRate.toFixed(1)}% (${stats.size}/${stats.maxSize})`,
            `   Evictions: ${stats.evictions}`,
            `   Status: ${stats.hitRate > 70 ? '✅ Excellent' : stats.hitRate > 50 ? '⚡ Good' : '⚠️ Poor'}`
        ].join('\n');
    }
    // Private methods for doubly linked list management
    /**
     * Move existing node to front of list (most recently used)
     */
    moveToFront(node) {
        if (node === this.head) {
            return; // Already at front
        }
        // Remove from current position
        this.removeNode(node);
        // Add to front
        this.addToFront(node);
    }
    /**
     * Add node to front of list
     */
    addToFront(node) {
        node.prev = null;
        node.next = this.head;
        if (this.head) {
            this.head.prev = node;
        }
        this.head = node;
        if (!this.tail) {
            this.tail = node;
        }
    }
    /**
     * Remove node from list
     */
    removeNode(node) {
        if (node.prev) {
            node.prev.next = node.next;
        }
        else {
            this.head = node.next;
        }
        if (node.next) {
            node.next.prev = node.prev;
        }
        else {
            this.tail = node.prev;
        }
    }
    /**
     * Evict least recently used item (tail of list)
     */
    evictLeastRecentlyUsed() {
        if (!this.tail) {
            return;
        }
        const lruNode = this.tail;
        this.cache.delete(lruNode.key);
        this.removeNode(lruNode);
        this.evictions++;
        // Optional: Log eviction for debugging
        // console.log(`🗑️ Evicted LRU entry: ${lruNode.key}`);
    }
}
exports.LRUCache = LRUCache;
/**
 * Factory function for creating LRU cache instances
 */
function createLRUCache(maxSize = 256) {
    return new LRUCache(maxSize);
}
/**
 * INTEGRATION NOTES:
 *
 * 1. Memory Index Integration:
 *    - Wrap getById() calls in MemoryIndexOptimizer with cache.get()
 *    - On cache miss, fetch from B-tree index and cache.set() result
 *    - Use memory record ID as cache key, full MemoryRecord as value
 *
 * 2. Cache Warm-up Strategies:
 *    - During memory loading: Cache most important memories (importance >= 8)
 *    - During ingestion: Cache newly ingested canonical memories
 *    - On query: Automatically cache any accessed memory records
 *
 * 3. Performance Monitoring:
 *    - Check getStats() periodically to monitor hit rates
 *    - Log efficiency reports during system diagnostics
 *    - Alert if hit rate drops below 50% (may indicate cache size too small)
 *
 * 4. Memory Management:
 *    - Default 256 entries ≈ 50KB memory overhead (acceptable)
 *    - Increase cache size for systems with >5K memory records
 *    - Monitor eviction rate - high evictions may indicate undersized cache
 *
 * 5. Cache Invalidation:
 *    - Memory updates: Remove from cache to force fresh lookup
 *    - Memory deletes: Remove from cache to prevent stale data
 *    - Index rebuilds: Clear cache to ensure consistency
 *
 * Example Integration:
 *
 * // In MemoryIndexOptimizer constructor:
 * this.lruCache = new LRUCache<string, MemoryRecord>(512);
 *
 * // In getById method:
 * const cached = this.lruCache.get(id);
 * if (cached) return cached;
 *
 * const record = this.idIndex.get(id);
 * if (record) this.lruCache.set(id, record);
 * return record;
 */ 
//# sourceMappingURL=LRUCache.js.map