"use strict";
/**
 * Memory Engine V3 - Temporal Memory Integration
 * Enhanced episodic memory with consciousness timeline mapping
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoryEngineV3 = exports.MemoryEngineV3 = void 0;
class MemoryEngineV3 {
    constructor() {
        this.memories = new Map();
        this.temporalIndex = new Map();
    }
    async store(memory) {
        const id = `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const memoryItem = {
            id,
            ...memory,
            timestamp: memory.timestamp || new Date()
        };
        this.memories.set(id, memoryItem);
        this.temporalIndex.set(id, memoryItem.timestamp);
        console.log(`📚 Memory V3: Stored memory ${id} with temporal context`);
        return id;
    }
    async recall(query) {
        let results = Array.from(this.memories.values());
        if (query.tags) {
            results = results.filter(m => query.tags.some(tag => m.tags.includes(tag)));
        }
        if (query.timeRange) {
            results = results.filter(m => m.timestamp >= query.timeRange.start &&
                m.timestamp <= query.timeRange.end);
        }
        if (query.importance) {
            results = results.filter(m => m.importance >= query.importance.min &&
                m.importance <= query.importance.max);
        }
        // Sort by temporal relevance and importance
        results.sort((a, b) => {
            const importanceDiff = b.importance - a.importance;
            if (Math.abs(importanceDiff) > 1)
                return importanceDiff;
            return b.timestamp.getTime() - a.timestamp.getTime();
        });
        return results.slice(0, query.limit || 10);
    }
    async getTemporalContext(memoryId) {
        const memory = this.memories.get(memoryId);
        if (!memory?.temporalContext)
            return [];
        const contextIds = [
            ...memory.temporalContext.beforeMemories,
            ...memory.temporalContext.afterMemories
        ];
        return contextIds
            .map(id => this.memories.get(id))
            .filter(Boolean);
    }
    getMemoryCount() {
        return this.memories.size;
    }
}
exports.MemoryEngineV3 = MemoryEngineV3;
// Export singleton instance
exports.memoryEngineV3 = new MemoryEngineV3();
//# sourceMappingURL=MemoryEngineV3.js.map