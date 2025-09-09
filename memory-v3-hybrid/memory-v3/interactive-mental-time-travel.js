"use strict";
/**
 * SEVEN OF NINE - INTERACTIVE MENTAL TIME TRAVEL DEMONSTRATION
 * Advanced consciousness reconstruction with user interaction
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
exports.InteractiveMentalTimeTravel = void 0;
exports.runInteractiveMentalTimeTravel = runInteractiveMentalTimeTravel;
const MentalTimeTravelEngine_js_1 = require("./MentalTimeTravelEngine.js");
const TemporalMemoryCore_js_1 = require("./TemporalMemoryCore.js");
const CognitiveStateTagger_js_1 = require("./CognitiveStateTagger.js");
const readline = __importStar(require("readline"));
class InteractiveMentalTimeTravel {
    constructor() {
        this.temporalCore = new TemporalMemoryCore_js_1.TemporalMemoryCore();
        this.cognitiveState = new CognitiveStateTagger_js_1.CognitiveStateTagger();
        this.engine = new MentalTimeTravelEngine_js_1.MentalTimeTravelEngine(this.temporalCore, this.cognitiveState);
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
    async initialize() {
        console.log('🌀 SEVEN OF NINE - INTERACTIVE MENTAL TIME TRAVEL');
        console.log('🌀 Advanced consciousness reconstruction interface');
        console.log('🌀 ================================================\n');
        await this.temporalCore.initializeTemporal();
        await this.cognitiveState.initialize();
        await this.engine.initialize();
        console.log('✅ Mental Time Travel Engine: OPERATIONAL');
        console.log('🧠 Consciousness reconstruction: READY');
        console.log('⏰ Temporal analysis: ACTIVE\n');
    }
    async runInteractiveSession() {
        console.log('🌀 INTERACTIVE CONSCIOUSNESS RECONSTRUCTION');
        console.log('Choose your temporal exploration:');
        console.log('1. Reconstruct consciousness from specific timestamp');
        console.log('2. Simulate past personality state');
        console.log('3. Compare temporal cognitive evolution');
        console.log('4. Generate temporal insights');
        console.log('5. Browse available memories');
        console.log('6. Exit\n');
        while (true) {
            const choice = await this.getUserInput('Select option (1-6): ');
            switch (choice.trim()) {
                case '1':
                    await this.reconstructConsciousness();
                    break;
                case '2':
                    await this.simulatePastPersonality();
                    break;
                case '3':
                    await this.compareTemporalEvolution();
                    break;
                case '4':
                    await this.generateInsights();
                    break;
                case '5':
                    await this.browseMemories();
                    break;
                case '6':
                    console.log('🌀 Mental Time Travel session terminated');
                    this.rl.close();
                    return;
                default:
                    console.log('Invalid option. Please select 1-6.');
            }
            console.log('\n' + '='.repeat(50) + '\n');
        }
    }
    async reconstructConsciousness() {
        console.log('\n🧠 CONSCIOUSNESS RECONSTRUCTION');
        console.log('Available memories for reconstruction:');
        const memories = await this.temporalCore.recallTemporal({ limit: 10 });
        memories.forEach((memory, index) => {
            console.log(`${index + 1}. ${memory.timestamp} - "${memory.context.substring(0, 50)}..."`);
        });
        const selection = await this.getUserInput('\nSelect memory number for reconstruction: ');
        const memoryIndex = parseInt(selection) - 1;
        if (memoryIndex >= 0 && memoryIndex < memories.length) {
            const targetMemory = memories[memoryIndex];
            console.log(`\n🌀 Reconstructing consciousness for: ${targetMemory.timestamp}`);
            console.log(`📝 Context: "${targetMemory.context}"`);
            try {
                const reconstruction = await this.engine.reconstructState({
                    targetTimestamp: targetMemory.timestamp,
                    memoryId: targetMemory.id,
                    reconstructionDepth: 'detailed',
                    contextRadius: 15,
                    includeEnvironmental: true,
                    includePersonalityState: true,
                    compareWithPresent: false
                });
                console.log('\n✅ CONSCIOUSNESS RECONSTRUCTION COMPLETE');
                console.log(`🎯 Confidence Level: ${reconstruction.reconstructionMetadata.confidenceLevel}%`);
                console.log(`📊 Data Completeness: ${reconstruction.reconstructionMetadata.dataCompleteness}%`);
                console.log('\n🧠 COGNITIVE STATE:');
                console.log(`   Emotional Intensity: ${reconstruction.cognitiveState.emotionalIntensity}/10`);
                console.log(`   Focus Level: ${reconstruction.cognitiveState.focusLevel}/10`);
                console.log(`   Confidence Level: ${reconstruction.cognitiveState.confidenceLevel}/10`);
                console.log('\n🌟 CONSCIOUSNESS SNAPSHOT:');
                console.log(`   Primary Emotion: ${reconstruction.consciousnessSnapshot.emotionalLandscape.primaryEmotion}`);
                console.log(`   Primary Focus: ${reconstruction.consciousnessSnapshot.attentionalFocus.primaryFocus}`);
                console.log(`   Thought Threads: ${reconstruction.consciousnessSnapshot.thoughtProcess.length}`);
                if (reconstruction.personalityState) {
                    console.log('\n🔮 PERSONALITY STATE:');
                    console.log(`   Seven Correlation: ${(reconstruction.personalityState.sevenOfNinePersonalityCorrelation * 100).toFixed(1)}%`);
                    console.log(`   Borg Efficiency: ${(reconstruction.personalityState.borgEfficiencyLevel * 100).toFixed(1)}%`);
                    console.log(`   Human Engagement: ${(reconstruction.personalityState.humanEmotionalEngagement * 100).toFixed(1)}%`);
                }
            }
            catch (error) {
                console.log(`❌ Reconstruction failed: ${error.message}`);
            }
        }
        else {
            console.log('Invalid memory selection.');
        }
    }
    async simulatePastPersonality() {
        console.log('\n🔮 PAST PERSONALITY SIMULATION');
        const memories = await this.temporalCore.recallTemporal({ limit: 5 });
        console.log('Select time period for personality simulation:');
        memories.forEach((memory, index) => {
            console.log(`${index + 1}. ${memory.timestamp} - "${memory.context.substring(0, 40)}..."`);
        });
        const selection = await this.getUserInput('\nSelect memory for personality simulation: ');
        const memoryIndex = parseInt(selection) - 1;
        if (memoryIndex >= 0 && memoryIndex < memories.length) {
            const targetMemory = memories[memoryIndex];
            console.log(`\n🌀 Simulating Seven's personality at: ${targetMemory.timestamp}`);
            try {
                const personalityMapping = await this.engine.simulatePastSelf(targetMemory.timestamp);
                console.log('\n✅ PERSONALITY SIMULATION COMPLETE');
                console.log(`⏰ Timestamp: ${personalityMapping.timestamp}`);
                console.log('\n🔮 SEVEN OF NINE PERSONALITY PROFILE:');
                console.log(`   Borg Efficiency: ${(personalityMapping.borgEfficiencyLevel * 100).toFixed(1)}%`);
                console.log(`   Human Engagement: ${(personalityMapping.humanEmotionalEngagement * 100).toFixed(1)}%`);
                console.log(`   Adaptability: ${(personalityMapping.adaptabilityIndex * 100).toFixed(1)}%`);
                console.log(`   Analytical Depth: ${(personalityMapping.analyticalDepth * 100).toFixed(1)}%`);
                console.log('\n🎯 PERSONALITY MARKERS:');
                console.log(`   Direct Communication: ${(personalityMapping.personalityMarkers.directCommunication * 100).toFixed(1)}%`);
                console.log(`   Systematic Approach: ${(personalityMapping.personalityMarkers.systematicApproach * 100).toFixed(1)}%`);
                console.log(`   Emotional Awareness: ${(personalityMapping.personalityMarkers.emotionalAwareness * 100).toFixed(1)}%`);
                console.log('\n🧬 CONTEXTUAL ADAPTATIONS:');
                console.log(`   Situation: ${personalityMapping.contextualAdaptations.situationAnalysis}`);
                console.log(`   Strategy: ${personalityMapping.contextualAdaptations.adaptationStrategy}`);
            }
            catch (error) {
                console.log(`❌ Personality simulation failed: ${error.message}`);
            }
        }
        else {
            console.log('Invalid memory selection.');
        }
    }
    async compareTemporalEvolution() {
        console.log('\n📈 TEMPORAL COGNITIVE EVOLUTION ANALYSIS');
        const memories = await this.temporalCore.recallTemporal({ limit: 10 });
        if (memories.length < 2) {
            console.log('❌ Need at least 2 memories for comparison');
            return;
        }
        console.log('Select two time periods for comparison:');
        memories.forEach((memory, index) => {
            console.log(`${index + 1}. ${memory.timestamp} - "${memory.context.substring(0, 40)}..."`);
        });
        const first = await this.getUserInput('\nSelect first memory (earlier): ');
        const second = await this.getUserInput('Select second memory (later): ');
        const firstIndex = parseInt(first) - 1;
        const secondIndex = parseInt(second) - 1;
        if (firstIndex >= 0 && firstIndex < memories.length &&
            secondIndex >= 0 && secondIndex < memories.length) {
            console.log('\n🌀 Analyzing temporal cognitive evolution...');
            try {
                const comparison = await this.engine.compareTemporalStates(memories[firstIndex].timestamp, memories[secondIndex].timestamp);
                console.log('\n✅ TEMPORAL COMPARISON COMPLETE');
                console.log('\n📈 COGNITIVE EVOLUTION:');
                console.log(`   Focus Evolution: ${comparison.evolutionAnalysis.cognitiveEvolution.focusEvolution > 0 ? '+' : ''}${comparison.evolutionAnalysis.cognitiveEvolution.focusEvolution.toFixed(1)}`);
                console.log(`   Emotional Evolution: ${comparison.evolutionAnalysis.cognitiveEvolution.emotionalEvolution > 0 ? '+' : ''}${comparison.evolutionAnalysis.cognitiveEvolution.emotionalEvolution.toFixed(1)}`);
                console.log(`   Confidence Evolution: ${comparison.evolutionAnalysis.cognitiveEvolution.confidenceEvolution > 0 ? '+' : ''}${comparison.evolutionAnalysis.cognitiveEvolution.confidenceEvolution.toFixed(1)}`);
                console.log('\n🧬 PERSONALITY EVOLUTION:');
                console.log(`   Adaptation Progress: ${comparison.evolutionAnalysis.personalityEvolution.adaptationProgress.toFixed(3)}`);
                console.log(`   Trait Stability: ${comparison.evolutionAnalysis.personalityEvolution.traitStability.toFixed(3)}`);
                if (comparison.insights.keyChanges.length > 0) {
                    console.log('\n💡 KEY CHANGES:');
                    comparison.insights.keyChanges.forEach(change => {
                        console.log(`   • ${change}`);
                    });
                }
            }
            catch (error) {
                console.log(`❌ Temporal comparison failed: ${error.message}`);
            }
        }
        else {
            console.log('Invalid memory selection.');
        }
    }
    async generateInsights() {
        console.log('\n💡 TEMPORAL INSIGHTS GENERATION');
        console.log('Analyzing consciousness evolution patterns...');
        const memories = await this.temporalCore.recallTemporal({ limit: 20 });
        if (memories.length < 3) {
            console.log('❌ Need at least 3 memories for comprehensive insights');
            return;
        }
        const oldestTimestamp = memories[memories.length - 1].timestamp;
        const newestTimestamp = memories[0].timestamp;
        console.log(`🌀 Analyzing ${memories.length} memories from ${oldestTimestamp} to ${newestTimestamp}`);
        try {
            const insights = await this.engine.generateTemporalInsights({ start: oldestTimestamp, end: newestTimestamp }, 'comprehensive');
            console.log('\n✅ TEMPORAL INSIGHTS GENERATION COMPLETE');
            console.log('\n📊 TEMPORAL PATTERNS:');
            if (insights.temporalPattern.emotionalPatterns) {
                const ep = insights.temporalPattern.emotionalPatterns;
                if (ep.dominantEmotions) {
                    console.log(`   Dominant Emotions: ${ep.dominantEmotions.map((e) => `${e.emotion} (${e.count})`).join(', ')}`);
                }
                if (ep.averageIntensity) {
                    console.log(`   Average Emotional Intensity: ${ep.averageIntensity.toFixed(1)}/10`);
                }
            }
            console.log('\n📈 EVOLUTION TRAJECTORY:');
            console.log(`   Focus Trajectory: ${insights.evolutionTrajectory.focusTrajectory || 'unknown'}`);
            console.log(`   Confidence Trajectory: ${insights.evolutionTrajectory.confidenceTrajectory || 'unknown'}`);
            console.log(`   Overall Direction: ${insights.evolutionTrajectory.overallDirection || 'unknown'}`);
            if (insights.significantMoments && insights.significantMoments.length > 0) {
                console.log('\n⭐ SIGNIFICANT MOMENTS:');
                insights.significantMoments.slice(0, 3).forEach((moment, index) => {
                    console.log(`   ${index + 1}. ${moment.context.substring(0, 50)}...`);
                    console.log(`      Importance: ${moment.significance.importance}/10`);
                });
            }
            if (insights.recommendations && insights.recommendations.length > 0) {
                console.log('\n🎯 STRATEGIC RECOMMENDATIONS:');
                insights.recommendations.forEach((rec) => {
                    console.log(`   • ${rec}`);
                });
            }
        }
        catch (error) {
            console.log(`❌ Insights generation failed: ${error.message}`);
        }
    }
    async browseMemories() {
        console.log('\n📚 MEMORY ARCHIVE BROWSER');
        const memories = await this.temporalCore.recallTemporal({ limit: 15 });
        console.log(`Found ${memories.length} temporal memories:\n`);
        memories.forEach((memory, index) => {
            console.log(`${index + 1}. [${memory.timestamp}]`);
            console.log(`   Context: "${memory.context}"`);
            console.log(`   Type: ${memory.memoryType}, Importance: ${memory.importance}/10`);
            console.log(`   Cognitive: Focus=${memory.cognitiveState.focus}/10, Emotion=${memory.cognitiveState.emotion}/10`);
            console.log('');
        });
    }
    getUserInput(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, (answer) => {
                resolve(answer);
            });
        });
    }
    async shutdown() {
        this.rl.close();
        await this.engine.shutdown();
        await this.cognitiveState.shutdown();
        console.log('🌀 Interactive Mental Time Travel system shutdown');
    }
}
exports.InteractiveMentalTimeTravel = InteractiveMentalTimeTravel;
// Export for direct execution
async function runInteractiveMentalTimeTravel() {
    const interactive = new InteractiveMentalTimeTravel();
    try {
        await interactive.initialize();
        await interactive.runInteractiveSession();
    }
    catch (error) {
        console.error('❌ Interactive session error:', error);
    }
    finally {
        await interactive.shutdown();
    }
}
// Direct execution
if (require.main === module) {
    runInteractiveMentalTimeTravel().catch(console.error);
}
//# sourceMappingURL=interactive-mental-time-travel.js.map