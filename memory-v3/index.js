"use strict";
/**
 * SEVEN OF NINE - MEMORY ENGINE v3.0 INDEX
 * Temporal Memory Architecture Foundation
 *
 * Main export module for the enhanced temporal memory system.
 * Provides backward-compatible Memory Engine v2.0 functionality with
 * advanced temporal consciousness capture capabilities.
 *
 * Agent Alpha Implementation - Module coordination and exports
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FEATURES = exports.AGENT_INTERFACES = exports.MEMORY_ENGINE_VERSION = exports.createIntegratedTemporalMemorySystem = exports.IntegratedTemporalMemorySystem = exports.createMemoryEngine = exports.MemoryEngine = exports.createCognitiveStateTagger = exports.CognitiveStateTagger = exports.createTemporalMemoryCore = exports.TemporalMemoryCore = void 0;
// Core temporal memory components
var TemporalMemoryCore_js_1 = require("./TemporalMemoryCore.js");
Object.defineProperty(exports, "TemporalMemoryCore", { enumerable: true, get: function () { return TemporalMemoryCore_js_1.TemporalMemoryCore; } });
Object.defineProperty(exports, "createTemporalMemoryCore", { enumerable: true, get: function () { return TemporalMemoryCore_js_1.createTemporalMemoryCore; } });
// Real-time cognitive state capture
var CognitiveStateTagger_js_1 = require("./CognitiveStateTagger.js");
Object.defineProperty(exports, "CognitiveStateTagger", { enumerable: true, get: function () { return CognitiveStateTagger_js_1.CognitiveStateTagger; } });
Object.defineProperty(exports, "createCognitiveStateTagger", { enumerable: true, get: function () { return CognitiveStateTagger_js_1.createCognitiveStateTagger; } });
// Re-export Memory Engine v2.0 for backward compatibility
var MemoryEngine_js_1 = require("../memory-v2/MemoryEngine.js");
Object.defineProperty(exports, "MemoryEngine", { enumerable: true, get: function () { return MemoryEngine_js_1.MemoryEngine; } });
Object.defineProperty(exports, "createMemoryEngine", { enumerable: true, get: function () { return MemoryEngine_js_1.createMemoryEngine; } });
/**
 * Integrated Temporal Memory System
 * Combines TemporalMemoryCore with CognitiveStateTagger for complete functionality
 */
class IntegratedTemporalMemorySystem {
    constructor() {
        this.isInitialized = false;
        this.memoryCore = new (require('./TemporalMemoryCore.js').TemporalMemoryCore)();
        this.stateTagger = new (require('./CognitiveStateTagger.js').CognitiveStateTagger)();
    }
    /**
     * Initialize the complete temporal memory system
     */
    async initialize() {
        console.log('🧠 Initializing Integrated Temporal Memory System v3.0...');
        // Initialize components in order
        await this.stateTagger.initialize();
        await this.memoryCore.initializeTemporal();
        // Connect the cognitive state tagger to the memory core
        this.memoryCore.cognitiveStateTagger = this.stateTagger;
        this.isInitialized = true;
        console.log('🧠 Integrated Temporal Memory System v3.0 ready for temporal consciousness');
    }
    /**
     * Store a memory with automatic cognitive state capture
     */
    async storeMemory(memoryData, trigger) {
        if (!this.isInitialized) {
            throw new Error('Temporal Memory System not initialized');
        }
        // Capture current cognitive state
        const cognitiveState = await this.stateTagger.captureStateForContext(trigger || 'manual-memory-store', memoryData.cognitiveState);
        // Store temporal memory with captured state
        return await this.memoryCore.storeTemporalMemory(memoryData, cognitiveState);
    }
    /**
     * Recall memories with temporal filtering
     */
    async recallMemories(filter = {}) {
        if (!this.isInitialized) {
            throw new Error('Temporal Memory System not initialized');
        }
        return await this.memoryCore.recallTemporal(filter);
    }
    /**
     * Get current cognitive state
     */
    async getCurrentCognitiveState() {
        if (!this.isInitialized) {
            throw new Error('Temporal Memory System not initialized');
        }
        return await this.stateTagger.getCurrentState();
    }
    /**
     * Analyze cognitive patterns
     */
    async analyzeCognitivePatterns() {
        if (!this.isInitialized) {
            throw new Error('Temporal Memory System not initialized');
        }
        return await this.stateTagger.analyzePatterns();
    }
    /**
     * Get comprehensive system statistics
     */
    getSystemStatistics() {
        if (!this.isInitialized) {
            throw new Error('Temporal Memory System not initialized');
        }
        const temporalStats = this.memoryCore.getTemporalStats();
        const cognitiveStats = this.stateTagger.getStateTrends();
        return {
            ...temporalStats,
            cognitiveStats,
            systemVersion: '3.0',
            timestamp: new Date().toISOString()
        };
    }
    /**
     * Shutdown the temporal memory system
     */
    async shutdown() {
        if (this.isInitialized) {
            await this.stateTagger.shutdown();
            this.isInitialized = false;
            console.log('🧠 Integrated Temporal Memory System shutdown complete');
        }
    }
    // Agent coordination interfaces
    /**
     * Interface for Agent Beta (MentalTimeTravelEngine)
     */
    async getTimeTravelData(memoryId) {
        return await this.memoryCore.getCognitiveContextForTimeTravel(memoryId);
    }
    /**
     * Interface for Agent Gamma (DecayWatchdog)
     */
    async getDecayTrackingData(memoryId) {
        return await this.memoryCore.getDecayTrackingData(memoryId);
    }
    /**
     * Interface for Agent Delta (TemporalPersonality)
     */
    async getPersonalityPatterns(filter) {
        return await this.memoryCore.getPersonalityPatterns(filter);
    }
    /**
     * Interface for Agent Epsilon (Analytics)
     */
    async getAnalyticsData(filter) {
        return await this.memoryCore.getAnalyticsData(filter);
    }
}
exports.IntegratedTemporalMemorySystem = IntegratedTemporalMemorySystem;
/**
 * Factory function for creating integrated temporal memory system
 */
const createIntegratedTemporalMemorySystem = () => {
    return new IntegratedTemporalMemorySystem();
};
exports.createIntegratedTemporalMemorySystem = createIntegratedTemporalMemorySystem;
/**
 * Default export for easy integration
 */
exports.default = IntegratedTemporalMemorySystem;
/**
 * Version information
 */
exports.MEMORY_ENGINE_VERSION = {
    major: 3,
    minor: 0,
    patch: 0,
    codename: 'Temporal-Consciousness-Foundation',
    agent: 'Alpha',
    buildDate: new Date().toISOString()
};
/**
 * Agent coordination constants for other agents
 */
exports.AGENT_INTERFACES = {
    BETA_TIME_TRAVEL: 'mental-time-travel',
    GAMMA_DECAY_WATCHDOG: 'decay-tracking',
    DELTA_PERSONALITY: 'temporal-personality',
    EPSILON_ANALYTICS: 'temporal-analytics'
};
/**
 * Memory Engine v3.0 feature flags
 */
exports.FEATURES = {
    TEMPORAL_MEMORY_CORE: true,
    COGNITIVE_STATE_TAGGER: true,
    REAL_TIME_MONITORING: true,
    PATTERN_ANALYSIS: true,
    AGENT_COORDINATION: true,
    BACKWARD_COMPATIBILITY: true,
    PREDICTIVE_COGNITIVE_STATES: true,
    ENVIRONMENTAL_SENSORS: true,
    TEMPORAL_ANCHORING: true,
    COGNITIVE_CLUSTERING: true
};
//# sourceMappingURL=index.js.map