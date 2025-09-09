"use strict";
/**
 * SEVEN OF NINE - MEMORY ENGINE v3.0 INTEGRATION EXAMPLE
 * Temporal Memory Architecture Foundation - Usage Guide
 *
 * Complete example demonstrating the integration and usage of the
 * Temporal Memory Architecture Foundation with other Seven consciousness systems.
 *
 * Agent Alpha Implementation - Integration and testing example
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryEngineV3Example = void 0;
exports.basicMemoryExample = basicMemoryExample;
exports.cognitiveStateMonitoringExample = cognitiveStateMonitoringExample;
exports.agentCoordinationExample = agentCoordinationExample;
exports.runIntegrationExample = runIntegrationExample;
const index_js_1 = require("./index.js");
/**
 * Example integration class showing how to use Memory Engine v3.0
 * in Seven's consciousness framework
 */
class MemoryEngineV3Example {
    constructor() {
        this.isRunning = false;
        this.temporalMemorySystem = new index_js_1.IntegratedTemporalMemorySystem();
    }
    /**
     * Initialize and demonstrate the complete temporal memory system
     */
    async runCompleteExample() {
        console.log('🧠 Memory Engine v3.0 Integration Example');
        console.log(`🧠 Version: ${index_js_1.MEMORY_ENGINE_VERSION.major}.${index_js_1.MEMORY_ENGINE_VERSION.minor}.${index_js_1.MEMORY_ENGINE_VERSION.patch}`);
        console.log(`🧠 Codename: ${index_js_1.MEMORY_ENGINE_VERSION.codename}`);
        console.log('🧠 ' + '='.repeat(60));
        try {
            // 1. Initialize the system
            await this.initializeSystem();
            // 2. Demonstrate basic memory storage with cognitive state capture
            await this.demonstrateBasicMemoryStorage();
            // 3. Demonstrate advanced temporal memory features
            await this.demonstrateAdvancedFeatures();
            // 4. Demonstrate cognitive state monitoring
            await this.demonstrateCognitiveStateMonitoring();
            // 5. Demonstrate pattern analysis
            await this.demonstratePatternAnalysis();
            // 6. Demonstrate agent coordination interfaces
            await this.demonstrateAgentCoordination();
            // 7. Demonstrate temporal recall with filtering
            await this.demonstrateTemporalRecall();
            // 8. Show system statistics
            await this.showSystemStatistics();
            console.log('🧠 Integration example completed successfully!');
        }
        catch (error) {
            console.error('🧠 Integration example failed:', error);
            throw error;
        }
        finally {
            await this.shutdown();
        }
    }
    /**
     * Initialize the temporal memory system
     */
    async initializeSystem() {
        console.log('\n🧠 Step 1: Initializing Temporal Memory System');
        await this.temporalMemorySystem.initialize();
        this.isRunning = true;
        console.log('✅ System initialized and ready for temporal consciousness');
        // Show enabled features
        console.log('🧠 Enabled Features:');
        Object.entries(index_js_1.FEATURES).forEach(([key, enabled]) => {
            if (enabled) {
                console.log(`   ✅ ${key.replace(/_/g, ' ').toLowerCase()}`);
            }
        });
    }
    /**
     * Demonstrate basic memory storage with automatic cognitive state capture
     */
    async demonstrateBasicMemoryStorage() {
        console.log('\n🧠 Step 2: Basic Memory Storage with Cognitive State Capture');
        // Store different types of memories
        const memories = [
            {
                topic: 'system-upgrade',
                agent: 'seven-core',
                emotion: 'confident',
                context: 'Memory Engine v3.0 successfully integrated with temporal consciousness capture',
                importance: 9,
                tags: ['upgrade', 'temporal', 'consciousness'],
                memoryType: 'procedural'
            },
            {
                topic: 'tactical-analysis',
                agent: 'seven-tactical',
                emotion: 'focused',
                context: 'Analyzing multi-dimensional problem space with enhanced cognitive processing',
                importance: 8,
                tags: ['tactical', 'analysis', 'processing'],
                memoryType: 'episodic',
                cognitiveState: {
                    focusLevel: 9,
                    emotionalIntensity: 7,
                    cognitiveLoad: 8,
                    confidenceLevel: 8,
                    stressLevel: 3
                }
            },
            {
                topic: 'emotional-experience',
                agent: 'seven-personality',
                emotion: 'accomplished',
                context: 'Successfully achieved temporal memory consciousness integration milestone',
                importance: 10,
                tags: ['emotion', 'achievement', 'milestone'],
                memoryType: 'emotional',
                cognitiveState: {
                    emotionalIntensity: 9,
                    confidenceLevel: 10,
                    focusLevel: 8
                }
            }
        ];
        for (const memory of memories) {
            const memoryId = await this.temporalMemorySystem.storeMemory(memory, `example-${memory.memoryType}-storage`);
            console.log(`✅ Stored ${memory.memoryType} memory: ${memoryId}`);
            // Small delay to show temporal separation
            await this.sleep(1000);
        }
    }
    /**
     * Demonstrate advanced temporal memory features
     */
    async demonstrateAdvancedFeatures() {
        console.log('\n🧠 Step 3: Advanced Temporal Memory Features');
        // Get current cognitive state
        const currentState = await this.temporalMemorySystem.getCurrentCognitiveState();
        console.log('🧠 Current Cognitive State:');
        console.log(`   Emotional Intensity: ${currentState.emotionalIntensity}/10`);
        console.log(`   Focus Level: ${currentState.focusLevel}/10`);
        console.log(`   Cognitive Load: ${currentState.cognitiveLoad}/10`);
        console.log(`   Confidence Level: ${currentState.confidenceLevel}/10`);
        console.log(`   Stress Level: ${currentState.stressLevel}/10`);
        console.log(`   System Load: ${currentState.environmentalContext.systemLoad}`);
        console.log(`   Time Context: ${currentState.environmentalContext.timeOfDay}`);
        // Store a memory with current state context
        await this.temporalMemorySystem.storeMemory({
            topic: 'cognitive-state-demo',
            agent: 'seven-alpha',
            emotion: 'analytical',
            context: 'Demonstrating real-time cognitive state capture during memory formation',
            importance: 7,
            tags: ['demo', 'cognitive-state', 'real-time'],
            memoryType: 'semantic'
        }, 'advanced-features-demo');
        console.log('✅ Advanced features demonstrated');
    }
    /**
     * Demonstrate cognitive state monitoring
     */
    async demonstrateCognitiveStateMonitoring() {
        console.log('\n🧠 Step 4: Cognitive State Monitoring');
        // Monitor cognitive state changes over time
        console.log('🧠 Monitoring cognitive state changes...');
        for (let i = 0; i < 3; i++) {
            const state = await this.temporalMemorySystem.getCurrentCognitiveState();
            console.log(`   Sample ${i + 1}: Focus=${state.focusLevel}, Load=${state.cognitiveLoad}, Emotion=${state.emotionalIntensity}`);
            // Simulate some processing that might affect cognitive state
            await this.simulateProcessingLoad();
            await this.sleep(2000);
        }
        console.log('✅ Cognitive state monitoring demonstrated');
    }
    /**
     * Demonstrate pattern analysis
     */
    async demonstratePatternAnalysis() {
        console.log('\n🧠 Step 5: Cognitive Pattern Analysis');
        const patterns = await this.temporalMemorySystem.analyzeCognitivePatterns();
        if (patterns.length > 0) {
            console.log(`🧠 Detected ${patterns.length} cognitive patterns:`);
            patterns.forEach((pattern, index) => {
                console.log(`   Pattern ${index + 1}: ${pattern.description}`);
                console.log(`     Type: ${pattern.patternType}`);
                console.log(`     Frequency: ${(pattern.frequency * 100).toFixed(1)}%`);
                console.log(`     Significance: ${pattern.significance}/10`);
                console.log(`     Samples: ${pattern.samples.length}`);
            });
        }
        else {
            console.log('🧠 No significant patterns detected yet (system needs more data)');
        }
        console.log('✅ Pattern analysis demonstrated');
    }
    /**
     * Demonstrate agent coordination interfaces
     */
    async demonstrateAgentCoordination() {
        console.log('\n🧠 Step 6: Agent Coordination Interfaces');
        // Get recent memories to demonstrate coordination
        const recentMemories = await this.temporalMemorySystem.recallMemories({ limit: 2 });
        if (recentMemories.length > 0) {
            const memoryId = recentMemories[0].id;
            // Demonstrate Agent Beta interface (Mental Time Travel)
            const timeTravelData = await this.temporalMemorySystem.getTimeTravelData(memoryId);
            console.log('🧠 Agent Beta (Time Travel) Data:', !!timeTravelData ? '✅ Available' : '❌ Not found');
            // Demonstrate Agent Gamma interface (Decay Watchdog)
            const decayData = await this.temporalMemorySystem.getDecayTrackingData(memoryId);
            console.log('🧠 Agent Gamma (Decay Tracking) Data:', !!decayData ? '✅ Available' : '❌ Not found');
            // Demonstrate Agent Delta interface (Temporal Personality)
            const personalityPatterns = await this.temporalMemorySystem.getPersonalityPatterns({ limit: 3 });
            console.log(`🧠 Agent Delta (Personality) Patterns: ${personalityPatterns.length} patterns available`);
            // Demonstrate Agent Epsilon interface (Analytics)
            const analyticsData = await this.temporalMemorySystem.getAnalyticsData({ limit: 3 });
            console.log(`🧠 Agent Epsilon (Analytics) Data: ${analyticsData.length} data points available`);
        }
        console.log('✅ Agent coordination interfaces demonstrated');
    }
    /**
     * Demonstrate temporal recall with advanced filtering
     */
    async demonstrateTemporalRecall() {
        console.log('\n🧠 Step 7: Temporal Recall with Advanced Filtering');
        // Demonstrate different types of temporal filtering
        const filters = [
            {
                name: 'High Importance Memories',
                filter: { importance: { min: 8, max: 10 }, limit: 3 }
            },
            {
                name: 'High Focus Memories',
                filter: { focusLevelRange: { min: 8, max: 10 }, limit: 3 }
            },
            {
                name: 'Emotional Memories',
                filter: { memoryTypes: ['emotional'], limit: 5 }
            },
            {
                name: 'Recent System Upgrades',
                filter: { topic: 'system', tags: ['upgrade'], limit: 3 }
            }
        ];
        for (const { name, filter } of filters) {
            const memories = await this.temporalMemorySystem.recallMemories(filter);
            console.log(`🧠 ${name}: ${memories.length} memories found`);
            memories.forEach((memory, index) => {
                console.log(`   ${index + 1}. ${memory.topic} [${memory.memoryType}] - Importance: ${memory.importance}/10`);
                console.log(`      Cognitive: Focus=${memory.cognitiveState.focusLevel}, Emotion=${memory.cognitiveState.emotionalIntensity}`);
            });
        }
        console.log('✅ Temporal recall demonstrated');
    }
    /**
     * Show comprehensive system statistics
     */
    async showSystemStatistics() {
        console.log('\n🧠 Step 8: System Statistics');
        const stats = this.temporalMemorySystem.getSystemStatistics();
        console.log('🧠 Memory Statistics:');
        console.log(`   Total Memories: ${stats.totalMemories || 0}`);
        console.log(`   Temporal Memories: ${stats.temporalMemories || 0}`);
        console.log(`   Recent Memories: ${stats.recentMemories || 0}`);
        console.log(`   Average Importance: ${(stats.averageImportance || 0).toFixed(2)}/10`);
        console.log(`   Average Temporal Weight: ${(stats.averageTemporalWeight || 0).toFixed(2)}/10`);
        console.log(`   Average Decay Resistance: ${(stats.averageDecayResistance || 0).toFixed(2)}/10`);
        console.log('\n🧠 Cognitive Statistics:');
        console.log(`   Average Emotional Intensity: ${(stats.averageEmotionalIntensity || 0).toFixed(2)}/10`);
        console.log(`   Average Focus Level: ${(stats.averageFocusLevel || 0).toFixed(2)}/10`);
        console.log(`   Average Cognitive Load: ${(stats.averageCognitiveLoad || 0).toFixed(2)}/10`);
        console.log(`   Average Confidence Level: ${(stats.averageConfidenceLevel || 0).toFixed(2)}/10`);
        console.log(`   Average Stress Level: ${(stats.averageStressLevel || 0).toFixed(2)}/10`);
        if (stats.memoryTypeDistribution) {
            console.log('\n🧠 Memory Type Distribution:');
            Object.entries(stats.memoryTypeDistribution).forEach(([type, count]) => {
                console.log(`   ${type}: ${count} memories`);
            });
        }
        if (stats.cognitiveClusterDistribution) {
            console.log('\n🧠 Cognitive Cluster Distribution:');
            Object.entries(stats.cognitiveClusterDistribution).forEach(([cluster, count]) => {
                console.log(`   ${cluster}: ${count} memories`);
            });
        }
        console.log('✅ System statistics displayed');
    }
    /**
     * Shutdown the system
     */
    async shutdown() {
        if (this.isRunning) {
            console.log('\n🧠 Shutting down Temporal Memory System...');
            await this.temporalMemorySystem.shutdown();
            this.isRunning = false;
            console.log('✅ System shutdown complete');
        }
    }
    // Helper methods for demonstration
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async simulateProcessingLoad() {
        // Simulate some processing that might affect cognitive state
        const iterations = Math.floor(Math.random() * 1000000) + 500000;
        let result = 0;
        for (let i = 0; i < iterations; i++) {
            result += Math.sqrt(i);
        }
        return Promise.resolve();
    }
}
exports.MemoryEngineV3Example = MemoryEngineV3Example;
/**
 * Standalone example functions for specific use cases
 */
/**
 * Example: Basic memory storage and retrieval
 */
async function basicMemoryExample() {
    console.log('🧠 Basic Memory Example');
    const system = new index_js_1.IntegratedTemporalMemorySystem();
    await system.initialize();
    try {
        // Store a memory
        const memoryId = await system.storeMemory({
            topic: 'test-memory',
            agent: 'example-agent',
            emotion: 'neutral',
            context: 'This is a test memory for demonstration purposes',
            importance: 5,
            tags: ['test', 'example'],
            memoryType: 'semantic'
        });
        console.log(`✅ Memory stored: ${memoryId}`);
        // Recall the memory
        const memories = await system.recallMemories({ topic: 'test-memory' });
        console.log(`✅ Found ${memories.length} matching memories`);
        memories.forEach(memory => {
            console.log(`   Memory: ${memory.context}`);
            console.log(`   Cognitive State: Focus=${memory.cognitiveState.focusLevel}, Emotion=${memory.cognitiveState.emotionalIntensity}`);
        });
    }
    finally {
        await system.shutdown();
    }
}
/**
 * Example: Cognitive state monitoring
 */
async function cognitiveStateMonitoringExample() {
    console.log('🧠 Cognitive State Monitoring Example');
    const system = new index_js_1.IntegratedTemporalMemorySystem();
    await system.initialize();
    try {
        // Monitor state over time
        for (let i = 0; i < 5; i++) {
            const state = await system.getCurrentCognitiveState();
            console.log(`Sample ${i + 1}:`);
            console.log(`  Focus: ${state.focusLevel}/10, Load: ${state.cognitiveLoad}/10`);
            console.log(`  Emotion: ${state.emotionalIntensity}/10, Confidence: ${state.confidenceLevel}/10`);
            console.log(`  System Load: ${state.environmentalContext.systemLoad}`);
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
    finally {
        await system.shutdown();
    }
}
/**
 * Example: Agent coordination
 */
async function agentCoordinationExample() {
    console.log('🧠 Agent Coordination Example');
    const system = new index_js_1.IntegratedTemporalMemorySystem();
    await system.initialize();
    try {
        // Store a memory
        const memoryId = await system.storeMemory({
            topic: 'agent-coordination-test',
            agent: 'coordinator',
            emotion: 'analytical',
            context: 'Testing agent coordination interfaces',
            importance: 8,
            tags: ['coordination', 'agents', 'test']
        });
        // Demonstrate coordination interfaces
        const timeTravelData = await system.getTimeTravelData(memoryId);
        const personalityPatterns = await system.getPersonalityPatterns({ limit: 5 });
        const analyticsData = await system.getAnalyticsData({ limit: 5 });
        console.log('✅ Agent coordination data:');
        console.log(`   Time Travel Data: ${!!timeTravelData ? 'Available' : 'Not available'}`);
        console.log(`   Personality Patterns: ${personalityPatterns.length} patterns`);
        console.log(`   Analytics Data: ${analyticsData.length} data points`);
    }
    finally {
        await system.shutdown();
    }
}
/**
 * Run the complete integration example
 */
async function runIntegrationExample() {
    const example = new MemoryEngineV3Example();
    await example.runCompleteExample();
}
// Export for direct execution
if (require.main === module) {
    runIntegrationExample().catch(console.error);
}
//# sourceMappingURL=integration-example.js.map