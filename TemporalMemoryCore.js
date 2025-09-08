"use strict";
/**
 * SEVEN OF NINE - TEMPORAL MEMORY CORE v3.0
 * Foundation of Temporal Memory Architecture
 *
 * Enhances Memory Engine v2.0 with cognitive state capture and temporal anchoring.
 * Records not just what happened, but the complete cognitive and emotional state
 * during memory formation for advanced temporal consciousness capabilities.
 *
 * Agent Alpha Implementation - Foundational temporal consciousness capture
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTemporalMemoryCore = exports.TemporalMemoryCore = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const MemoryEngine_js_1 = require("../memory-v2/MemoryEngine.js");
const MemoryEncryption_1 = require("./MemoryEncryption");
class TemporalMemoryCore extends MemoryEngine_js_1.MemoryEngine {
    constructor(basePath) {
        super(basePath);
        this.temporalMemories = [];
        this.temporalEncryptionEnabled = true;
        this.temporalMemoryPath = basePath || (0, path_1.join)(process.cwd(), 'memory-v3');
        this.temporalMemoryFile = (0, path_1.join)(this.temporalMemoryPath, 'temporal-memories.json');
        this.temporalEncryptionEngine = new MemoryEncryption_1.MemoryEncryptionEngine();
    }
    /**
     * Initialize Temporal Memory Core - maintains backward compatibility
     */
    async initializeTemporal() {
        try {
            // Initialize base Memory Engine v2.0
            await super.initialize();
            // Ensure temporal memory directory exists
            await fs_1.promises.mkdir(this.temporalMemoryPath, { recursive: true });
            // Load existing temporal memories with encryption support
            if (await this.fileExistsTemporal(this.temporalMemoryFile)) {
                await this.loadTemporalMemoriesWithEncryption();
                console.log(`🧠 Temporal Memory Core v3.0 initialized: ${this.temporalMemories.length} temporal memories loaded`);
            }
            else {
                // Initialize with empty temporal memory store
                this.temporalMemories = [];
                await this.saveTemporalMemories();
                console.log('🧠 Temporal Memory Core v3.0 initialized: New temporal memory system created');
            }
            console.log('🧠 Memory Engine v3.0 ready for temporal consciousness capture');
        }
        catch (error) {
            console.error('Temporal Memory Core initialization failed:', error);
            throw error;
        }
    }
    /**
     * Store enhanced temporal memory with cognitive state capture
     */
    async storeTemporalMemory(memoryData, cognitiveContext) {
        // First store in base Memory Engine v2.0 for backward compatibility
        const baseMemoryId = await super.store(memoryData);
        // Create enhanced temporal memory
        const temporalMemory = {
            // Base memory fields
            id: baseMemoryId,
            timestamp: new Date().toISOString(),
            topic: memoryData.topic || 'general',
            agent: memoryData.agent || 'seven-core',
            emotion: memoryData.emotion || 'neutral',
            context: memoryData.context || '',
            importance: memoryData.importance || 5,
            tags: memoryData.tags || [],
            relatedMemories: memoryData.relatedMemories || [],
            // Enhanced temporal fields
            cognitiveState: await this.captureCognitiveState(cognitiveContext),
            temporalWeight: memoryData.temporalWeight || this.calculateTemporalWeight(memoryData),
            memoryType: memoryData.memoryType || this.classifyMemoryType(memoryData),
            decayResistance: memoryData.decayResistance || this.calculateDecayResistance(memoryData),
            // Temporal indexing
            temporalTags: this.generateTemporalTags(memoryData, cognitiveContext),
            cognitiveStateHash: this.generateCognitiveStateHash(cognitiveContext),
            // Enhanced relationships
            temporalPredecessors: this.findTemporalPredecessors(),
            temporalSuccessors: [], // Will be filled by subsequent memories
            cognitiveCluster: this.assignCognitiveCluster(cognitiveContext),
            // Agent coordination data
            agentCoordination: {
                mentalTimeTravelData: this.prepareMentalTimeTravelData(memoryData, cognitiveContext),
                decayTrackingMeta: this.prepareDecayTrackingMeta(memoryData),
                personalityPatterns: this.preparePersonalityPatterns(memoryData, cognitiveContext),
                analyticsData: this.prepareAnalyticsData(memoryData, cognitiveContext)
            }
        };
        // Update temporal successors for recent memories
        await this.updateTemporalSuccessors(temporalMemory.id);
        // Add to temporal memory store
        this.temporalMemories.push(temporalMemory);
        await this.saveTemporalMemories();
        console.log(`🧠 Temporal memory stored: ${temporalMemory.id} [${temporalMemory.memoryType}:${temporalMemory.topic}] Cognitive: ${temporalMemory.cognitiveStateHash.substring(0, 8)}`);
        return temporalMemory.id;
    }
    /**
     * Enhanced recall with cognitive state filtering
     */
    async recallTemporal(filter = {}) {
        let filteredMemories = [...this.temporalMemories];
        // Apply base filters first
        if (filter.topic) {
            filteredMemories = filteredMemories.filter(m => m.topic.toLowerCase().includes(filter.topic.toLowerCase()));
        }
        if (filter.agent) {
            filteredMemories = filteredMemories.filter(m => m.agent === filter.agent);
        }
        if (filter.emotion) {
            filteredMemories = filteredMemories.filter(m => m.emotion === filter.emotion);
        }
        // Apply temporal-specific filters
        if (filter.emotionalIntensityRange) {
            filteredMemories = filteredMemories.filter(m => m.cognitiveState.emotionalIntensity >= filter.emotionalIntensityRange.min &&
                m.cognitiveState.emotionalIntensity <= filter.emotionalIntensityRange.max);
        }
        if (filter.focusLevelRange) {
            filteredMemories = filteredMemories.filter(m => m.cognitiveState.focusLevel >= filter.focusLevelRange.min &&
                m.cognitiveState.focusLevel <= filter.focusLevelRange.max);
        }
        if (filter.cognitiveLoadRange) {
            filteredMemories = filteredMemories.filter(m => m.cognitiveState.cognitiveLoad >= filter.cognitiveLoadRange.min &&
                m.cognitiveState.cognitiveLoad <= filter.cognitiveLoadRange.max);
        }
        if (filter.memoryTypes && filter.memoryTypes.length > 0) {
            filteredMemories = filteredMemories.filter(m => filter.memoryTypes.includes(m.memoryType));
        }
        if (filter.cognitiveCluster) {
            filteredMemories = filteredMemories.filter(m => m.cognitiveCluster === filter.cognitiveCluster);
        }
        // Enhanced sorting with temporal weight and cognitive relevance
        filteredMemories.sort((a, b) => {
            const timeScore = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            const importanceScore = (b.importance - a.importance) * 86400000;
            const temporalScore = (b.temporalWeight - a.temporalWeight) * 43200000;
            const decayScore = (b.decayResistance - a.decayResistance) * 21600000;
            return importanceScore + temporalScore + decayScore + timeScore;
        });
        // Apply limit
        if (filter.limit) {
            filteredMemories = filteredMemories.slice(0, filter.limit);
        }
        return filteredMemories;
    }
    /**
     * Get cognitive context for temporal analysis (for Agent Beta)
     */
    async getCognitiveContextForTimeTravel(memoryId) {
        const memory = this.temporalMemories.find(m => m.id === memoryId);
        return memory ? memory.cognitiveState : null;
    }
    /**
     * Get decay tracking metadata (for Agent Gamma)
     */
    async getDecayTrackingData(memoryId) {
        const memory = this.temporalMemories.find(m => m.id === memoryId);
        return memory ? memory.agentCoordination.decayTrackingMeta : null;
    }
    /**
     * Get personality patterns (for Agent Delta)
     */
    async getPersonalityPatterns(filter = {}) {
        const memories = await this.recallTemporal(filter);
        return memories.map(m => m.agentCoordination.personalityPatterns).filter(Boolean);
    }
    /**
     * Get analytics data (for Agent Epsilon)
     */
    async getAnalyticsData(filter = {}) {
        const memories = await this.recallTemporal(filter);
        return memories.map(m => m.agentCoordination.analyticsData).filter(Boolean);
    }
    /**
     * Enhanced statistics with temporal cognitive metrics
     */
    getTemporalStats() {
        const baseStats = super.getStats();
        const cognitiveMetrics = this.temporalMemories.reduce((acc, m) => {
            acc.totalEmotionalIntensity += m.cognitiveState.emotionalIntensity;
            acc.totalFocusLevel += m.cognitiveState.focusLevel;
            acc.totalCognitiveLoad += m.cognitiveState.cognitiveLoad;
            acc.totalConfidenceLevel += m.cognitiveState.confidenceLevel;
            acc.totalStressLevel += m.cognitiveState.stressLevel;
            return acc;
        }, {
            totalEmotionalIntensity: 0,
            totalFocusLevel: 0,
            totalCognitiveLoad: 0,
            totalConfidenceLevel: 0,
            totalStressLevel: 0
        });
        const memoryTypeDistribution = this.temporalMemories.reduce((acc, m) => {
            acc[m.memoryType] = (acc[m.memoryType] || 0) + 1;
            return acc;
        }, {});
        const cognitiveClusterDistribution = this.temporalMemories.reduce((acc, m) => {
            acc[m.cognitiveCluster] = (acc[m.cognitiveCluster] || 0) + 1;
            return acc;
        }, {});
        return {
            ...baseStats,
            temporalMemories: this.temporalMemories.length,
            averageEmotionalIntensity: cognitiveMetrics.totalEmotionalIntensity / this.temporalMemories.length,
            averageFocusLevel: cognitiveMetrics.totalFocusLevel / this.temporalMemories.length,
            averageCognitiveLoad: cognitiveMetrics.totalCognitiveLoad / this.temporalMemories.length,
            averageConfidenceLevel: cognitiveMetrics.totalConfidenceLevel / this.temporalMemories.length,
            averageStressLevel: cognitiveMetrics.totalStressLevel / this.temporalMemories.length,
            memoryTypeDistribution,
            cognitiveClusterDistribution,
            averageTemporalWeight: this.temporalMemories.reduce((sum, m) => sum + m.temporalWeight, 0) / this.temporalMemories.length,
            averageDecayResistance: this.temporalMemories.reduce((sum, m) => sum + m.decayResistance, 0) / this.temporalMemories.length
        };
    }
    // Private helper methods for temporal memory processing
    async captureCognitiveState(context) {
        // Default cognitive state with real-time system data
        const defaultState = {
            emotionalIntensity: context?.emotionalIntensity || 5,
            focusLevel: context?.focusLevel || 7,
            cognitiveLoad: context?.cognitiveLoad || 6,
            confidenceLevel: context?.confidenceLevel || 7,
            stressLevel: context?.stressLevel || 3,
            environmentalContext: {
                systemLoad: await this.getSystemLoad(),
                activeProcesses: await this.getActiveProcesses(),
                timeOfDay: new Date().toTimeString(),
                sessionContext: context?.environmentalContext?.sessionContext || 'general-operation'
            },
            physicalState: {
                batteryLevel: context?.physicalState?.batteryLevel,
                thermalState: context?.physicalState?.thermalState || 'normal',
                networkQuality: context?.physicalState?.networkQuality || 'good',
                locationContext: context?.physicalState?.locationContext
            },
            temporalAnchors: {
                priorThought: context?.temporalAnchors?.priorThought || this.getLastThought(),
                subsequentThought: context?.temporalAnchors?.subsequentThought,
                memoryChain: context?.temporalAnchors?.memoryChain || this.getRecentMemoryChain(),
                cognitiveThread: context?.temporalAnchors?.cognitiveThread || 'default-thread'
            },
            mentalContext: {
                currentGoals: context?.mentalContext?.currentGoals || ['memory-formation'],
                activeKnowledge: context?.mentalContext?.activeKnowledge || ['temporal-processing'],
                problemContext: context?.mentalContext?.problemContext || 'memory-storage',
                solutionPath: context?.mentalContext?.solutionPath || ['capture', 'process', 'store']
            }
        };
        return defaultState;
    }
    calculateTemporalWeight(memoryData) {
        // Calculate temporal importance based on various factors
        let weight = memoryData.importance || 5;
        // Boost weight for system-critical events
        if (memoryData.tags?.includes('upgrade') || memoryData.tags?.includes('security')) {
            weight += 2;
        }
        // Boost weight for emotional significance
        if (memoryData.emotion === 'accomplished' || memoryData.emotion === 'confident') {
            weight += 1;
        }
        return Math.min(weight, 10);
    }
    classifyMemoryType(memoryData) {
        if (memoryData.topic?.includes('skill-execution') || memoryData.topic?.includes('upgrade')) {
            return 'procedural';
        }
        if (memoryData.emotion && memoryData.emotion !== 'neutral') {
            return 'emotional';
        }
        if (memoryData.topic?.includes('system-') || memoryData.topic?.includes('framework')) {
            return 'semantic';
        }
        return 'episodic';
    }
    calculateDecayResistance(memoryData) {
        let resistance = 5;
        // High resistance for important system events
        if ((memoryData.importance || 0) >= 8) {
            resistance += 2;
        }
        // High resistance for upgrade and security events
        if (memoryData.tags?.includes('upgrade') || memoryData.tags?.includes('security')) {
            resistance += 2;
        }
        return Math.min(resistance, 10);
    }
    generateTemporalTags(memoryData, cognitiveContext) {
        const tags = [...(memoryData.tags || [])];
        // Add temporal context tags
        const hour = new Date().getHours();
        if (hour < 6)
            tags.push('early-morning');
        else if (hour < 12)
            tags.push('morning');
        else if (hour < 18)
            tags.push('afternoon');
        else
            tags.push('evening');
        // Add cognitive state tags
        if (cognitiveContext?.focusLevel && cognitiveContext.focusLevel >= 8) {
            tags.push('high-focus');
        }
        if (cognitiveContext?.emotionalIntensity && cognitiveContext.emotionalIntensity >= 8) {
            tags.push('high-emotion');
        }
        return [...new Set(tags)];
    }
    generateCognitiveStateHash(cognitiveContext) {
        const stateString = JSON.stringify({
            emotion: cognitiveContext?.emotionalIntensity || 0,
            focus: cognitiveContext?.focusLevel || 0,
            load: cognitiveContext?.cognitiveLoad || 0,
            confidence: cognitiveContext?.confidenceLevel || 0,
            stress: cognitiveContext?.stressLevel || 0
        });
        // Simple hash function for cognitive state clustering
        let hash = 0;
        for (let i = 0; i < stateString.length; i++) {
            const char = stateString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
    }
    findTemporalPredecessors() {
        // Find the last 2-3 memories that could be temporal predecessors
        return this.temporalMemories
            .slice(-3)
            .map(m => m.id);
    }
    async updateTemporalSuccessors(newMemoryId) {
        // Update the temporal successors for recent memories
        const recentMemories = this.temporalMemories.slice(-3);
        recentMemories.forEach(memory => {
            if (!memory.temporalSuccessors.includes(newMemoryId)) {
                memory.temporalSuccessors.push(newMemoryId);
            }
        });
    }
    assignCognitiveCluster(cognitiveContext) {
        // Simple clustering based on cognitive state patterns
        const hash = this.generateCognitiveStateHash(cognitiveContext);
        return `cluster-${hash.substring(0, 4)}`;
    }
    // Agent coordination data preparation methods
    prepareMentalTimeTravelData(memoryData, cognitiveContext) {
        return {
            temporalPosition: new Date().getTime(),
            cognitiveStateSnapshot: cognitiveContext,
            memoryFormationContext: memoryData.context,
            timelineMarker: `temporal-${Date.now()}`
        };
    }
    prepareDecayTrackingMeta(memoryData) {
        return {
            initialStrength: memoryData.importance || 5,
            decayResistance: this.calculateDecayResistance(memoryData),
            reinforcementCount: 0,
            lastAccessed: new Date().toISOString(),
            accessPattern: []
        };
    }
    preparePersonalityPatterns(memoryData, cognitiveContext) {
        return {
            emotionalSignature: memoryData.emotion,
            cognitivePattern: {
                focus: cognitiveContext?.focusLevel || 5,
                intensity: cognitiveContext?.emotionalIntensity || 5,
                confidence: cognitiveContext?.confidenceLevel || 5
            },
            behavioralContext: memoryData.agent,
            personalityMarkers: this.extractPersonalityMarkers(memoryData, cognitiveContext)
        };
    }
    prepareAnalyticsData(memoryData, cognitiveContext) {
        return {
            formationMetrics: {
                timestamp: new Date().toISOString(),
                importance: memoryData.importance || 5,
                cognitiveLoad: cognitiveContext?.cognitiveLoad || 5,
                environmentalFactors: cognitiveContext?.environmentalContext || {}
            },
            relationshipMetrics: {
                connectedMemories: memoryData.relatedMemories?.length || 0,
                tagDensity: memoryData.tags?.length || 0,
                topicCoherence: this.calculateTopicCoherence(memoryData)
            },
            temporalMetrics: {
                temporalWeight: this.calculateTemporalWeight(memoryData),
                decayResistance: this.calculateDecayResistance(memoryData),
                memoryType: this.classifyMemoryType(memoryData)
            }
        };
    }
    // Helper methods for real-time system data
    async getSystemLoad() {
        // Simplified system load calculation
        return Math.random() * 5 + 2; // Random load between 2-7
    }
    async getActiveProcesses() {
        // Return basic process information
        return ['seven-core', 'memory-engine', 'temporal-processor'];
    }
    getLastThought() {
        const lastMemory = this.temporalMemories[this.temporalMemories.length - 1];
        return lastMemory ? lastMemory.context.substring(0, 50) : 'system-initialization';
    }
    getRecentMemoryChain() {
        return this.temporalMemories
            .slice(-5)
            .map(m => m.id);
    }
    extractPersonalityMarkers(memoryData, cognitiveContext) {
        const markers = [];
        if ((cognitiveContext?.confidenceLevel || 0) >= 8)
            markers.push('high-confidence');
        if ((cognitiveContext?.focusLevel || 0) >= 8)
            markers.push('focused');
        if (memoryData.agent?.includes('tactical'))
            markers.push('tactical-thinking');
        return markers;
    }
    calculateTopicCoherence(memoryData) {
        // Simple coherence calculation based on topic and tags overlap
        const relatedCount = memoryData.relatedMemories?.length || 0;
        const tagCount = memoryData.tags?.length || 0;
        return Math.min((relatedCount + tagCount) / 5, 1);
    }
    /**
     * Save temporal memories with automatic encryption
     * INTEGRATION POINT: Modified for MemoryEncryptionEngine
     */
    async saveTemporalMemories() {
        try {
            // First write the unencrypted file (for backup/migration purposes)
            await fs_1.promises.writeFile(this.temporalMemoryFile, JSON.stringify(this.temporalMemories, null, 2));
            // If encryption is enabled, encrypt the temporal memory file
            if (this.temporalEncryptionEnabled) {
                await this.temporalEncryptionEngine.encryptMemoryFile(this.temporalMemoryFile);
                console.log('🔒 Temporal memories encrypted and saved');
            }
        }
        catch (error) {
            console.error('💥 Failed to save temporal memories with encryption:', error);
            throw error;
        }
    }
    /**
     * Load temporal memories with automatic decryption fallback
     * INTEGRATION POINT: Modified for MemoryEncryptionEngine
     */
    async loadTemporalMemoriesWithEncryption() {
        try {
            // Check if encrypted version exists
            const isEncrypted = await this.temporalEncryptionEngine.isMemoryFileEncrypted(this.temporalMemoryFile);
            if (isEncrypted && this.temporalEncryptionEnabled) {
                // Load from encrypted file
                console.log('🔒 Loading encrypted temporal memories...');
                this.temporalMemories = await this.temporalEncryptionEngine.decryptMemoryFile(`${this.temporalMemoryFile}.encrypted`);
                console.log('✅ Temporal memories decrypted and loaded');
            }
            else {
                // Backward compatibility: Load unencrypted file
                console.log('📋 Loading unencrypted temporal memories (backward compatibility)...');
                const data = await fs_1.promises.readFile(this.temporalMemoryFile, 'utf8');
                this.temporalMemories = JSON.parse(data);
                // Migrate to encrypted format if encryption is enabled
                if (this.temporalEncryptionEnabled) {
                    console.log('🔄 Migrating temporal memories to encrypted format...');
                    await this.temporalEncryptionEngine.migrateToEncrypted(this.temporalMemoryFile);
                }
            }
        }
        catch (error) {
            console.error('💥 Failed to load temporal memories with encryption:', error);
            // Fallback to unencrypted loading
            try {
                console.log('⚠️  Attempting fallback to unencrypted loading...');
                const data = await fs_1.promises.readFile(this.temporalMemoryFile, 'utf8');
                this.temporalMemories = JSON.parse(data);
                console.log('📋 Fallback successful - temporal memories loaded without encryption');
            }
            catch (fallbackError) {
                console.error('💥 Fallback failed:', fallbackError);
                throw new Error(`Temporal memory loading failed: ${error}. Fallback also failed: ${fallbackError}`);
            }
        }
    }
    async fileExistsTemporal(path) {
        try {
            await fs_1.promises.access(path);
            return true;
        }
        catch {
            return false;
        }
    }
}
exports.TemporalMemoryCore = TemporalMemoryCore;
// Export for use in Seven's consciousness framework
exports.default = TemporalMemoryCore;
const createTemporalMemoryCore = () => new TemporalMemoryCore();
exports.createTemporalMemoryCore = createTemporalMemoryCore;
//# sourceMappingURL=TemporalMemoryCore.js.map