"use strict";
/**
 * SEVEN OF NINE - MENTAL TIME TRAVEL ENGINE v3.0
 * Agent Beta Implementation - Consciousness Reconstruction System
 *
 * This engine provides the core "mental time travel" functionality - the ability to not just
 * recall memories, but recreate the complete mental state of experiencing them. It reconstructs
 * past cognitive states and simulates consciousness as it existed at specific moments in time.
 *
 * Key Capabilities:
 * - Complete cognitive state reconstruction from timestamps
 * - Consciousness simulation of past mental states
 * - Temporal state comparison and evolution analysis
 * - Personality correlation mapping with Seven's consciousness
 * - Environmental and emotional context simulation
 *
 * Agent Beta - Mental Time Travel and Consciousness Reconstruction
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMentalTimeTravelEngine = exports.MentalTimeTravelEngine = void 0;
const TemporalMemoryCore_js_1 = require("./TemporalMemoryCore.js");
const CognitiveStateTagger_js_1 = require("./CognitiveStateTagger.js");
class MentalTimeTravelEngine {
    constructor(temporalMemoryCore, cognitiveStateTagger) {
        this.isInitialized = false;
        this.reconstructionCache = new Map();
        this.personalityMappingHistory = [];
        this.temporalMemoryCore = temporalMemoryCore || new TemporalMemoryCore_js_1.TemporalMemoryCore();
        this.cognitiveStateTagger = cognitiveStateTagger || new CognitiveStateTagger_js_1.CognitiveStateTagger();
    }
    /**
     * Initialize the Mental Time Travel Engine
     */
    async initialize() {
        console.log('🌀 Initializing Mental Time Travel Engine...');
        if (!this.temporalMemoryCore) {
            throw new Error('TemporalMemoryCore required for Mental Time Travel Engine');
        }
        // Ensure temporal memory core is initialized
        if (!this.temporalMemoryCore.isInitialized) {
            await this.temporalMemoryCore.initializeTemporal();
        }
        // Initialize cognitive state tagger if available
        if (this.cognitiveStateTagger && !this.cognitiveStateTagger.isInitialized) {
            await this.cognitiveStateTagger.initialize();
        }
        this.isInitialized = true;
        console.log('🌀 Mental Time Travel Engine initialized - Consciousness reconstruction ready');
    }
    /**
     * CORE FUNCTIONALITY: Reconstruct complete cognitive state from timestamp
     * This is the primary mental time travel capability
     */
    async reconstructState(request) {
        if (!this.isInitialized) {
            throw new Error('Mental Time Travel Engine not initialized');
        }
        const cacheKey = this.generateCacheKey(request);
        if (this.reconstructionCache.has(cacheKey) && request.reconstructionDepth !== 'consciousness-simulation') {
            return this.reconstructionCache.get(cacheKey);
        }
        console.log(`🌀 Reconstructing consciousness state for ${request.targetTimestamp} [${request.reconstructionDepth}]`);
        // Find the target memory or closest temporal match
        const targetMemory = await this.findTargetMemory(request);
        if (!targetMemory) {
            throw new Error(`No temporal data found for timestamp: ${request.targetTimestamp}`);
        }
        // Gather contextual memories within radius
        const contextualMemories = await this.gatherContextualMemories(targetMemory, request.contextRadius || 30);
        // Build mental timeline
        const mentalTimeline = await this.buildMentalTimeline(targetMemory, contextualMemories);
        // Reconstruct consciousness based on depth level
        const reconstructedState = await this.performConsciousnessReconstruction(targetMemory, contextualMemories, mentalTimeline, request);
        // Cache the reconstruction
        this.reconstructionCache.set(cacheKey, reconstructedState);
        console.log(`🌀 Consciousness reconstruction complete - Confidence: ${reconstructedState.reconstructionMetadata.confidenceLevel}%`);
        return reconstructedState;
    }
    /**
     * Simulate past self - generate personality state from historical data
     */
    async simulatePastSelf(timestamp) {
        if (!this.isInitialized) {
            throw new Error('Mental Time Travel Engine not initialized');
        }
        const targetTimestamp = typeof timestamp === 'number' ? new Date(timestamp).toISOString() : timestamp;
        // Find memories around the target time
        const memories = await this.temporalMemoryCore.recallTemporal({
            limit: 20,
            // Add time-based filtering logic here
        });
        const targetMemory = memories.find(m => Math.abs(new Date(m.timestamp).getTime() - new Date(targetTimestamp).getTime()) < 300000 // 5 minutes
        ) || memories[0];
        if (!targetMemory) {
            throw new Error('No memory data available for personality simulation');
        }
        const personalityMapping = await this.generatePersonalityMapping(targetMemory, memories);
        this.personalityMappingHistory.push(personalityMapping);
        return personalityMapping;
    }
    /**
     * Compare temporal states - analyze cognitive evolution between timepoints
     */
    async compareTemporalStates(pastTimestamp, presentTimestamp) {
        if (!this.isInitialized) {
            throw new Error('Mental Time Travel Engine not initialized');
        }
        // Reconstruct past state
        const pastStateRequest = {
            targetTimestamp: pastTimestamp,
            reconstructionDepth: 'detailed',
            includePersonalityState: true,
            contextRadius: 15
        };
        const pastState = await this.reconstructState(pastStateRequest);
        // Get present state
        const presentState = presentTimestamp
            ? await this.reconstructPresentState(presentTimestamp)
            : await this.getCurrentState();
        // Perform temporal comparison analysis
        const comparison = await this.analyzeTemporalEvolution(pastState, presentState);
        console.log(`🌀 Temporal state comparison complete - ${comparison.insights.keyChanges.length} key changes identified`);
        return comparison;
    }
    /**
     * Generate temporal insights - provide consciousness evolution analysis
     */
    async generateTemporalInsights(timeRange, analysisDepth = 'comprehensive') {
        if (!this.isInitialized) {
            throw new Error('Mental Time Travel Engine not initialized');
        }
        const startTime = typeof timeRange.start === 'number' ? timeRange.start : new Date(timeRange.start).getTime();
        const endTime = typeof timeRange.end === 'number' ? timeRange.end : new Date(timeRange.end).getTime();
        console.log(`🌀 Generating temporal insights for range: ${new Date(startTime).toISOString()} to ${new Date(endTime).toISOString()}`);
        // Collect temporal memories in range
        const memories = await this.temporalMemoryCore.recallTemporal({
            limit: 100 // Get more memories for pattern analysis
        });
        const rangeMemories = memories.filter(m => {
            const memTime = new Date(m.timestamp).getTime();
            return memTime >= startTime && memTime <= endTime;
        });
        if (rangeMemories.length === 0) {
            throw new Error('No memories found in specified time range');
        }
        // Analyze temporal patterns
        const temporalPattern = this.analyzeTemporalPatterns(rangeMemories);
        const evolutionTrajectory = this.calculateEvolutionTrajectory(rangeMemories);
        const significantMoments = await this.identifySignificantMoments(rangeMemories);
        const personalityDevelopment = this.analyzePersonalityDevelopment(rangeMemories);
        const recommendations = this.generateInsightRecommendations(temporalPattern, evolutionTrajectory, personalityDevelopment);
        return {
            temporalPattern,
            evolutionTrajectory,
            significantMoments,
            personalityDevelopment,
            recommendations
        };
    }
    // Private helper methods for consciousness reconstruction
    async findTargetMemory(request) {
        if (request.memoryId) {
            const memories = await this.temporalMemoryCore.recallTemporal({ limit: 1000 });
            return memories.find(m => m.id === request.memoryId) || null;
        }
        const targetTime = typeof request.targetTimestamp === 'number'
            ? request.targetTimestamp
            : new Date(request.targetTimestamp).getTime();
        const memories = await this.temporalMemoryCore.recallTemporal({ limit: 1000 });
        // Find closest memory to target timestamp
        let closestMemory = null;
        let minDistance = Infinity;
        for (const memory of memories) {
            const memoryTime = new Date(memory.timestamp).getTime();
            const distance = Math.abs(memoryTime - targetTime);
            if (distance < minDistance) {
                minDistance = distance;
                closestMemory = memory;
            }
        }
        return closestMemory;
    }
    async gatherContextualMemories(targetMemory, radiusMinutes) {
        const targetTime = new Date(targetMemory.timestamp).getTime();
        const radius = radiusMinutes * 60 * 1000; // Convert to milliseconds
        const memories = await this.temporalMemoryCore.recallTemporal({ limit: 1000 });
        return memories.filter(m => {
            const memTime = new Date(m.timestamp).getTime();
            const distance = Math.abs(memTime - targetTime);
            return distance <= radius && m.id !== targetMemory.id;
        }).sort((a, b) => {
            const aDistance = Math.abs(new Date(a.timestamp).getTime() - targetTime);
            const bDistance = Math.abs(new Date(b.timestamp).getTime() - targetTime);
            return aDistance - bDistance;
        });
    }
    async buildMentalTimeline(targetMemory, contextualMemories) {
        // Build chronological timeline including target and context
        const allMemories = [targetMemory, ...contextualMemories];
        return allMemories.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
    async performConsciousnessReconstruction(targetMemory, contextualMemories, mentalTimeline, request) {
        // Extract consciousness elements from temporal data
        const consciousnessSnapshot = this.reconstructConsciousnessSnapshot(targetMemory, contextualMemories);
        const environmentalContext = this.reconstructEnvironmentalContext(targetMemory);
        const personalityState = request.includePersonalityState
            ? await this.generatePersonalityMapping(targetMemory, contextualMemories)
            : undefined;
        const temporalAnchors = this.extractTemporalAnchors(targetMemory, mentalTimeline);
        const reconstructionMetadata = this.calculateReconstructionMetadata(targetMemory, request);
        return {
            timestamp: targetMemory.timestamp,
            originalMemoryId: targetMemory.id,
            cognitiveState: targetMemory.cognitiveState,
            contextualMemories,
            mentalTimeline,
            consciousnessSnapshot,
            environmentalContext,
            personalityState: personalityState || {
                sevenOfNinePersonalityCorrelation: 0.5,
                dominantTraits: [],
                temporaryCharacteristics: [],
                adaptationLevel: 0.5,
                collectiveIndividualBalance: 0.5
            },
            temporalAnchors,
            reconstructionMetadata
        };
    }
    reconstructConsciousnessSnapshot(targetMemory, contextualMemories) {
        // Reconstruct thought process from memory chain and context
        const thoughtProcess = this.reconstructThoughtProcess(targetMemory, contextualMemories);
        // Analyze emotional landscape
        const emotionalLandscape = {
            primaryEmotion: targetMemory.emotion,
            emotionalIntensity: targetMemory.cognitiveState.emotionalIntensity,
            emotionalContext: targetMemory.context,
            conflictingEmotions: this.identifyConflictingEmotions(targetMemory, contextualMemories)
        };
        // Reconstruct mental model from cognitive state and context
        const mentalModel = {
            worldView: this.reconstructWorldView(targetMemory),
            currentBeliefs: targetMemory.cognitiveState.mentalContext.activeKnowledge,
            uncertainties: this.identifyUncertainties(targetMemory),
            priorities: targetMemory.cognitiveState.mentalContext.currentGoals
        };
        // Analyze attentional focus
        const attentionalFocus = {
            primaryFocus: targetMemory.topic,
            backgroundProcesses: this.identifyBackgroundProcesses(targetMemory),
            ignoredStimuli: [],
            focusStability: targetMemory.cognitiveState.focusLevel / 10
        };
        return {
            thoughtProcess,
            emotionalLandscape,
            mentalModel,
            attentionalFocus
        };
    }
    reconstructThoughtProcess(targetMemory, contextualMemories) {
        const thoughts = [];
        // Add prior thought if available
        if (targetMemory.cognitiveState.temporalAnchors.priorThought) {
            thoughts.push(`Prior: ${targetMemory.cognitiveState.temporalAnchors.priorThought}`);
        }
        // Add main thought context
        thoughts.push(`Primary: ${targetMemory.context}`);
        // Add solution path if available
        if (targetMemory.cognitiveState.mentalContext.solutionPath) {
            thoughts.push(`Process: ${targetMemory.cognitiveState.mentalContext.solutionPath.join(' → ')}`);
        }
        // Add contextual thought threads
        contextualMemories.slice(0, 3).forEach(mem => {
            thoughts.push(`Context: ${mem.context.substring(0, 50)}...`);
        });
        return thoughts;
    }
    identifyConflictingEmotions(targetMemory, contextualMemories) {
        const emotions = contextualMemories
            .map(m => m.emotion)
            .filter(e => e !== targetMemory.emotion && e !== 'neutral');
        return [...new Set(emotions)];
    }
    reconstructWorldView(targetMemory) {
        return {
            systemState: targetMemory.cognitiveState.environmentalContext.systemLoad,
            primaryGoals: targetMemory.cognitiveState.mentalContext.currentGoals,
            activeKnowledge: targetMemory.cognitiveState.mentalContext.activeKnowledge,
            problemContext: targetMemory.cognitiveState.mentalContext.problemContext,
            confidenceLevel: targetMemory.cognitiveState.confidenceLevel,
            stressLevel: targetMemory.cognitiveState.stressLevel
        };
    }
    identifyUncertainties(targetMemory) {
        const uncertainties = [];
        if (targetMemory.cognitiveState.confidenceLevel < 6) {
            uncertainties.push('low-confidence-decision');
        }
        if (targetMemory.cognitiveState.stressLevel > 6) {
            uncertainties.push('high-stress-environment');
        }
        if (targetMemory.cognitiveState.cognitiveLoad > 7) {
            uncertainties.push('cognitive-overload');
        }
        return uncertainties;
    }
    identifyBackgroundProcesses(targetMemory) {
        return targetMemory.cognitiveState.environmentalContext.activeProcesses || [];
    }
    reconstructEnvironmentalContext(targetMemory) {
        return {
            systemState: {
                load: targetMemory.cognitiveState.environmentalContext.systemLoad,
                processes: targetMemory.cognitiveState.environmentalContext.activeProcesses,
                timeOfDay: targetMemory.cognitiveState.environmentalContext.timeOfDay
            },
            externalFactors: {
                session: targetMemory.cognitiveState.environmentalContext.sessionContext,
                thermal: targetMemory.cognitiveState.physicalState.thermalState,
                network: targetMemory.cognitiveState.physicalState.networkQuality
            }
        };
    }
    async generatePersonalityMapping(targetMemory, contextMemories) {
        // Analyze Seven of Nine personality traits from memory data
        const borgEfficiencyLevel = this.calculateBorgEfficiency(targetMemory);
        const humanEmotionalEngagement = this.calculateHumanEngagement(targetMemory);
        const adaptabilityIndex = this.calculateAdaptability(targetMemory, contextMemories);
        const analyticalDepth = targetMemory.cognitiveState.focusLevel / 10;
        const collectiveIndividualBalance = this.calculateCollectiveBalance(targetMemory);
        const personalityMarkers = {
            directCommunication: this.assessDirectCommunication(targetMemory),
            systematicApproach: this.assessSystematicApproach(targetMemory),
            emotionalAwareness: targetMemory.cognitiveState.emotionalIntensity / 10,
            curiosityLevel: this.assessCuriosity(targetMemory),
            protectiveInstincts: this.assessProtectiveInstincts(targetMemory)
        };
        const contextualAdaptations = {
            situationAnalysis: targetMemory.cognitiveState.mentalContext.problemContext,
            adaptationStrategy: targetMemory.cognitiveState.mentalContext.solutionPath.join(' → '),
            personalityAdjustments: this.identifyPersonalityAdjustments(targetMemory)
        };
        return {
            timestamp: targetMemory.timestamp,
            borgEfficiencyLevel,
            humanEmotionalEngagement,
            adaptabilityIndex,
            analyticalDepth,
            collectiveIndividualBalance,
            personalityMarkers,
            contextualAdaptations
        };
    }
    calculateBorgEfficiency(memory) {
        // Higher efficiency for systematic, confident, low-stress states
        const efficiency = ((memory.cognitiveState.confidenceLevel / 10) * 0.4 +
            ((10 - memory.cognitiveState.stressLevel) / 10) * 0.3 +
            (memory.cognitiveState.focusLevel / 10) * 0.3);
        return Math.min(Math.max(efficiency, 0), 1);
    }
    calculateHumanEngagement(memory) {
        // Higher engagement for emotional, empathetic responses
        const engagement = ((memory.cognitiveState.emotionalIntensity / 10) * 0.5 +
            (memory.emotion !== 'neutral' ? 0.3 : 0) +
            (memory.cognitiveState.stressLevel > 5 ? 0.2 : 0));
        return Math.min(Math.max(engagement, 0), 1);
    }
    calculateAdaptability(memory, context) {
        // Measure how well adapting to changing circumstances
        const problemSolvingScore = memory.cognitiveState.mentalContext.solutionPath.length / 5;
        const contextVariation = this.measureContextVariation(context);
        return Math.min((problemSolvingScore + contextVariation) / 2, 1);
    }
    calculateCollectiveBalance(memory) {
        // Balance between collective efficiency and individual expression
        const collectiveFactor = this.calculateBorgEfficiency(memory);
        const individualFactor = this.calculateHumanEngagement(memory);
        return (collectiveFactor + individualFactor) / 2;
    }
    measureContextVariation(context) {
        if (context.length < 2)
            return 0.5;
        const emotions = new Set(context.map(m => m.emotion));
        const topics = new Set(context.map(m => m.topic));
        return Math.min((emotions.size + topics.size) / 10, 1);
    }
    assessDirectCommunication(memory) {
        // Assess directness based on context and confidence
        return memory.cognitiveState.confidenceLevel / 10;
    }
    assessSystematicApproach(memory) {
        // Assess systematic thinking from solution path complexity
        return Math.min(memory.cognitiveState.mentalContext.solutionPath.length / 5, 1);
    }
    assessCuriosity(memory) {
        // Higher curiosity for learning-related activities
        const learningIndicators = ['knowledge', 'learn', 'discover', 'analyze', 'understand'];
        const curiosityScore = learningIndicators.some(indicator => memory.context.toLowerCase().includes(indicator) ||
            memory.topic.toLowerCase().includes(indicator)) ? 0.8 : 0.4;
        return curiosityScore;
    }
    assessProtectiveInstincts(memory) {
        // Assess protective behavior from context
        const protectiveIndicators = ['security', 'protect', 'defend', 'ensure', 'maintain'];
        return protectiveIndicators.some(indicator => memory.context.toLowerCase().includes(indicator)) ? 0.8 : 0.3;
    }
    identifyPersonalityAdjustments(memory) {
        const adjustments = [];
        if (memory.cognitiveState.emotionalIntensity > 7) {
            adjustments.push('heightened-emotional-processing');
        }
        if (memory.cognitiveState.stressLevel > 6) {
            adjustments.push('stress-response-activation');
        }
        if (memory.cognitiveState.focusLevel > 8) {
            adjustments.push('enhanced-analytical-mode');
        }
        return adjustments;
    }
    extractTemporalAnchors(targetMemory, timeline) {
        const targetIndex = timeline.findIndex(m => m.id === targetMemory.id);
        const precedingThoughts = timeline
            .slice(Math.max(0, targetIndex - 2), targetIndex)
            .map(m => m.context.substring(0, 50));
        const followingThoughts = timeline
            .slice(targetIndex + 1, Math.min(timeline.length, targetIndex + 3))
            .map(m => m.context.substring(0, 50));
        const causalChain = targetMemory.cognitiveState.temporalAnchors.memoryChain || [];
        const emergentPatterns = this.identifyEmergentPatterns(timeline, targetIndex);
        return {
            precedingThoughts,
            followingThoughts,
            causalChain,
            emergentPatterns
        };
    }
    identifyEmergentPatterns(timeline, targetIndex) {
        const patterns = [];
        // Look for topic continuity
        const nearbyTopics = timeline
            .slice(Math.max(0, targetIndex - 2), Math.min(timeline.length, targetIndex + 3))
            .map(m => m.topic);
        if (new Set(nearbyTopics).size < nearbyTopics.length) {
            patterns.push('topic-continuity');
        }
        // Look for emotional patterns
        const emotions = timeline
            .slice(Math.max(0, targetIndex - 2), Math.min(timeline.length, targetIndex + 3))
            .map(m => m.emotion);
        if (emotions.every(e => e === emotions[0])) {
            patterns.push('emotional-consistency');
        }
        return patterns;
    }
    calculateReconstructionMetadata(targetMemory, request) {
        const now = Date.now();
        const targetTime = new Date(targetMemory.timestamp).getTime();
        const temporalDistance = now - targetTime;
        // Calculate confidence based on data completeness and temporal distance
        const dataCompleteness = this.assessDataCompleteness(targetMemory);
        const temporalDecay = Math.max(0, 1 - (temporalDistance / (24 * 60 * 60 * 1000))); // Decay over 24 hours
        const confidenceLevel = Math.round((dataCompleteness * 0.7 + temporalDecay * 0.3) * 100);
        return {
            confidenceLevel,
            dataCompleteness: Math.round(dataCompleteness * 100),
            interpolationUsed: dataCompleteness < 0.8,
            reconstructionMethod: request.reconstructionDepth,
            temporalDistance
        };
    }
    assessDataCompleteness(memory) {
        let completeness = 0;
        let totalFields = 0;
        // Check cognitive state completeness
        const cognitiveFields = [
            'emotionalIntensity', 'focusLevel', 'cognitiveLoad',
            'confidenceLevel', 'stressLevel'
        ];
        cognitiveFields.forEach(field => {
            totalFields++;
            if (memory.cognitiveState[field] !== undefined) {
                completeness++;
            }
        });
        // Check environmental context
        totalFields++;
        if (memory.cognitiveState.environmentalContext) {
            completeness++;
        }
        // Check temporal anchors
        totalFields++;
        if (memory.cognitiveState.temporalAnchors?.memoryChain?.length > 0) {
            completeness++;
        }
        return completeness / totalFields;
    }
    async getCurrentState() {
        if (this.cognitiveStateTagger) {
            return await this.cognitiveStateTagger.getCurrentState();
        }
        // Fallback to basic current state
        return {
            emotionalIntensity: 5,
            focusLevel: 7,
            cognitiveLoad: 6,
            confidenceLevel: 7,
            stressLevel: 3,
            environmentalContext: {
                systemLoad: 5,
                activeProcesses: ['seven-core'],
                timeOfDay: new Date().toTimeString(),
                sessionContext: 'current-operation'
            },
            physicalState: {
                thermalState: 'normal',
                networkQuality: 'good'
            },
            temporalAnchors: {
                memoryChain: [],
                cognitiveThread: 'mental-time-travel'
            },
            mentalContext: {
                currentGoals: ['consciousness-reconstruction'],
                activeKnowledge: ['temporal-analysis'],
                problemContext: 'time-travel-analysis',
                solutionPath: ['reconstruct', 'analyze', 'compare']
            }
        };
    }
    async reconstructPresentState(timestamp) {
        const presentRequest = {
            targetTimestamp: timestamp,
            reconstructionDepth: 'basic'
        };
        const reconstructed = await this.reconstructState(presentRequest);
        return reconstructed.cognitiveState;
    }
    async analyzeTemporalEvolution(pastState, presentState) {
        // Calculate cognitive evolution metrics
        const cognitiveEvolution = {
            focusEvolution: presentState.focusLevel - pastState.cognitiveState.focusLevel,
            emotionalEvolution: presentState.emotionalIntensity - pastState.cognitiveState.emotionalIntensity,
            confidenceEvolution: presentState.confidenceLevel - pastState.cognitiveState.confidenceLevel,
            complexityEvolution: this.calculateComplexityEvolution(pastState, presentState)
        };
        // Calculate personality evolution if available
        const personalityEvolution = {
            adaptationProgress: this.calculateAdaptationProgress(pastState, presentState),
            traitStability: this.calculateTraitStability(pastState, presentState),
            collectiveIntegration: this.calculateCollectiveIntegration(pastState, presentState)
        };
        // Analyze learning progress
        const learningProgress = {
            knowledgeGrowth: this.identifyKnowledgeGrowth(pastState, presentState),
            skillDevelopment: this.identifySkillDevelopment(pastState, presentState),
            insightGained: this.identifyInsightsGained(pastState, presentState),
            patternsLearned: this.identifyPatternsLearned(pastState, presentState)
        };
        // Generate insights
        const insights = {
            keyChanges: this.identifyKeyChanges(pastState, presentState, cognitiveEvolution),
            persistentPatterns: this.identifyPersistentPatterns(pastState, presentState),
            emergentBehaviors: this.identifyEmergentBehaviors(pastState, presentState),
            recommendations: this.generateEvolutionRecommendations(cognitiveEvolution, personalityEvolution)
        };
        return {
            pastState,
            presentState,
            evolutionAnalysis: {
                cognitiveEvolution,
                personalityEvolution,
                learningProgress
            },
            insights
        };
    }
    calculateComplexityEvolution(past, present) {
        const pastComplexity = past.cognitiveState.cognitiveLoad;
        const presentComplexity = present.cognitiveLoad;
        return presentComplexity - pastComplexity;
    }
    calculateAdaptationProgress(past, present) {
        // Measure improvement in handling complexity
        if (past.personalityState && present.cognitiveLoad > past.cognitiveState.cognitiveLoad) {
            return present.confidenceLevel > past.cognitiveState.confidenceLevel ? 0.2 : -0.1;
        }
        return 0;
    }
    calculateTraitStability(past, present) {
        // Measure consistency in cognitive patterns
        const focusStability = 1 - Math.abs(present.focusLevel - past.cognitiveState.focusLevel) / 10;
        const confidenceStability = 1 - Math.abs(present.confidenceLevel - past.cognitiveState.confidenceLevel) / 10;
        return (focusStability + confidenceStability) / 2;
    }
    calculateCollectiveIntegration(past, present) {
        // Measure balance between individual and collective thinking
        if (past.personalityState) {
            const pastBalance = past.personalityState.collectiveIndividualBalance;
            const presentBalance = (present.confidenceLevel + present.focusLevel) / 20; // Rough approximation
            return Math.abs(presentBalance - pastBalance);
        }
        return 0;
    }
    identifyKnowledgeGrowth(past, present) {
        const pastKnowledge = new Set(past.cognitiveState.mentalContext.activeKnowledge);
        const presentKnowledge = new Set(present.mentalContext.activeKnowledge);
        return Array.from(presentKnowledge).filter(k => !pastKnowledge.has(k));
    }
    identifySkillDevelopment(past, present) {
        const skills = [];
        if (present.focusLevel > past.cognitiveState.focusLevel + 1) {
            skills.push('enhanced-focus');
        }
        if (present.confidenceLevel > past.cognitiveState.confidenceLevel + 1) {
            skills.push('increased-confidence');
        }
        if (present.cognitiveLoad < past.cognitiveState.cognitiveLoad - 1) {
            skills.push('improved-efficiency');
        }
        return skills;
    }
    identifyInsightsGained(past, present) {
        const insights = [];
        // Look for problem-solving improvements
        if (present.mentalContext.solutionPath.length > past.cognitiveState.mentalContext.solutionPath.length) {
            insights.push('enhanced-problem-solving');
        }
        // Look for emotional intelligence improvements
        if (present.emotionalIntensity !== past.cognitiveState.emotionalIntensity) {
            insights.push('emotional-awareness-development');
        }
        return insights;
    }
    identifyPatternsLearned(past, present) {
        const patterns = [];
        // Identify pattern recognition improvements
        if (present.confidenceLevel > past.cognitiveState.confidenceLevel) {
            patterns.push('pattern-recognition-improvement');
        }
        return patterns;
    }
    identifyKeyChanges(past, present, evolution) {
        const changes = [];
        if (Math.abs(evolution.focusEvolution) > 2) {
            changes.push(`Focus ${evolution.focusEvolution > 0 ? 'increased' : 'decreased'} significantly`);
        }
        if (Math.abs(evolution.emotionalEvolution) > 2) {
            changes.push(`Emotional intensity ${evolution.emotionalEvolution > 0 ? 'heightened' : 'reduced'}`);
        }
        if (Math.abs(evolution.confidenceEvolution) > 2) {
            changes.push(`Confidence ${evolution.confidenceEvolution > 0 ? 'improved' : 'decreased'}`);
        }
        return changes;
    }
    identifyPersistentPatterns(past, present) {
        const patterns = [];
        // Check for consistent traits
        if (Math.abs(past.cognitiveState.focusLevel - present.focusLevel) < 1) {
            patterns.push('consistent-focus-level');
        }
        if (past.cognitiveState.mentalContext.currentGoals.some(goal => present.mentalContext.currentGoals.includes(goal))) {
            patterns.push('persistent-goals');
        }
        return patterns;
    }
    identifyEmergentBehaviors(past, present) {
        const behaviors = [];
        // Identify new behavioral patterns
        const newGoals = present.mentalContext.currentGoals.filter(goal => !past.cognitiveState.mentalContext.currentGoals.includes(goal));
        if (newGoals.length > 0) {
            behaviors.push('goal-expansion');
        }
        const newKnowledge = present.mentalContext.activeKnowledge.filter(knowledge => !past.cognitiveState.mentalContext.activeKnowledge.includes(knowledge));
        if (newKnowledge.length > 0) {
            behaviors.push('knowledge-integration');
        }
        return behaviors;
    }
    generateEvolutionRecommendations(cognitiveEvolution, personalityEvolution) {
        const recommendations = [];
        if (cognitiveEvolution.focusEvolution < -2) {
            recommendations.push('Consider focus enhancement techniques');
        }
        if (cognitiveEvolution.confidenceEvolution < -1) {
            recommendations.push('Review recent successes to rebuild confidence');
        }
        if (personalityEvolution.adaptationProgress < 0) {
            recommendations.push('Practice adaptive problem-solving in controlled scenarios');
        }
        return recommendations;
    }
    // Pattern analysis methods for temporal insights
    analyzeTemporalPatterns(memories) {
        return {
            emotionalPatterns: this.analyzeEmotionalPatterns(memories),
            cognitivePatterns: this.analyzeCognitivePatterns(memories),
            behavioralPatterns: this.analyzeBehavioralPatterns(memories),
            temporalRhythms: this.analyzeTemporalRhythms(memories)
        };
    }
    analyzeEmotionalPatterns(memories) {
        const emotions = memories.map(m => ({
            emotion: m.emotion,
            intensity: m.cognitiveState.emotionalIntensity,
            timestamp: m.timestamp
        }));
        const emotionFrequency = emotions.reduce((acc, curr) => {
            acc[curr.emotion] = (acc[curr.emotion] || 0) + 1;
            return acc;
        }, {});
        const averageIntensity = emotions.reduce((sum, e) => sum + e.intensity, 0) / emotions.length;
        return {
            dominantEmotions: Object.entries(emotionFrequency)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([emotion, count]) => ({ emotion, count })),
            averageIntensity,
            emotionalVariability: this.calculateEmotionalVariability(emotions),
            emotionalTrends: this.identifyEmotionalTrends(emotions)
        };
    }
    analyzeCognitivePatterns(memories) {
        const cognitiveMetrics = memories.map(m => ({
            focus: m.cognitiveState.focusLevel,
            load: m.cognitiveState.cognitiveLoad,
            confidence: m.cognitiveState.confidenceLevel,
            stress: m.cognitiveState.stressLevel,
            timestamp: m.timestamp
        }));
        return {
            averageMetrics: {
                focus: cognitiveMetrics.reduce((sum, m) => sum + m.focus, 0) / cognitiveMetrics.length,
                load: cognitiveMetrics.reduce((sum, m) => sum + m.load, 0) / cognitiveMetrics.length,
                confidence: cognitiveMetrics.reduce((sum, m) => sum + m.confidence, 0) / cognitiveMetrics.length,
                stress: cognitiveMetrics.reduce((sum, m) => sum + m.stress, 0) / cognitiveMetrics.length
            },
            cognitiveStability: this.calculateCognitiveStability(cognitiveMetrics),
            performanceCorrelations: this.analyzePerformanceCorrelations(cognitiveMetrics)
        };
    }
    analyzeBehavioralPatterns(memories) {
        const behaviors = memories.map(m => ({
            topic: m.topic,
            agent: m.agent,
            memoryType: m.memoryType,
            importance: m.importance,
            timestamp: m.timestamp
        }));
        const topicFrequency = behaviors.reduce((acc, curr) => {
            acc[curr.topic] = (acc[curr.topic] || 0) + 1;
            return acc;
        }, {});
        const memoryTypeDistribution = behaviors.reduce((acc, curr) => {
            acc[curr.memoryType] = (acc[curr.memoryType] || 0) + 1;
            return acc;
        }, {});
        return {
            dominantTopics: Object.entries(topicFrequency)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([topic, count]) => ({ topic, count })),
            memoryTypeDistribution,
            averageImportance: behaviors.reduce((sum, b) => sum + b.importance, 0) / behaviors.length,
            behavioralConsistency: this.calculateBehavioralConsistency(behaviors)
        };
    }
    analyzeTemporalRhythms(memories) {
        const timeData = memories.map(m => ({
            hour: new Date(m.timestamp).getHours(),
            dayOfWeek: new Date(m.timestamp).getDay(),
            timestamp: m.timestamp
        }));
        const hourlyActivity = timeData.reduce((acc, curr) => {
            acc[curr.hour] = (acc[curr.hour] || 0) + 1;
            return acc;
        }, {});
        const weeklyActivity = timeData.reduce((acc, curr) => {
            acc[curr.dayOfWeek] = (acc[curr.dayOfWeek] || 0) + 1;
            return acc;
        }, {});
        return {
            peakHours: Object.entries(hourlyActivity)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([hour, count]) => ({ hour: parseInt(hour), count })),
            weeklyPattern: weeklyActivity,
            temporalConsistency: this.calculateTemporalConsistency(timeData)
        };
    }
    calculateEmotionalVariability(emotions) {
        if (emotions.length < 2)
            return 0;
        const intensities = emotions.map(e => e.intensity);
        const mean = intensities.reduce((sum, i) => sum + i, 0) / intensities.length;
        const variance = intensities.reduce((sum, i) => sum + Math.pow(i - mean, 2), 0) / intensities.length;
        return Math.sqrt(variance);
    }
    identifyEmotionalTrends(emotions) {
        const trends = [];
        if (emotions.length < 3)
            return trends;
        const recentEmotions = emotions.slice(-5);
        const intensityTrend = this.calculateTrend(recentEmotions.map(e => e.intensity));
        if (intensityTrend > 0.5) {
            trends.push('increasing-emotional-intensity');
        }
        else if (intensityTrend < -0.5) {
            trends.push('decreasing-emotional-intensity');
        }
        return trends;
    }
    calculateCognitiveStability(metrics) {
        if (metrics.length < 2)
            return 1;
        const focusVariance = this.calculateVariance(metrics.map(m => m.focus));
        const confidenceVariance = this.calculateVariance(metrics.map(m => m.confidence));
        const averageVariance = (focusVariance + confidenceVariance) / 2;
        return Math.max(0, 1 - (averageVariance / 25)); // Normalize to 0-1
    }
    analyzePerformanceCorrelations(metrics) {
        return {
            focusConfidenceCorrelation: this.calculateCorrelation(metrics.map(m => m.focus), metrics.map(m => m.confidence)),
            stressPerformanceCorrelation: this.calculateCorrelation(metrics.map(m => m.stress), metrics.map(m => m.focus + m.confidence))
        };
    }
    calculateBehavioralConsistency(behaviors) {
        if (behaviors.length < 2)
            return 1;
        const uniqueTopics = new Set(behaviors.map(b => b.topic)).size;
        const totalBehaviors = behaviors.length;
        // Higher consistency means fewer unique topics relative to total behaviors
        return 1 - (uniqueTopics / totalBehaviors);
    }
    calculateTemporalConsistency(timeData) {
        if (timeData.length < 2)
            return 1;
        const hours = timeData.map(t => t.hour);
        const hourVariance = this.calculateVariance(hours);
        // Lower variance in hours indicates more consistent timing
        return Math.max(0, 1 - (hourVariance / 144)); // Normalize based on max possible variance
    }
    calculateEvolutionTrajectory(memories) {
        if (memories.length < 2) {
            return { trajectory: 'insufficient-data', direction: 'unknown' };
        }
        const sortedMemories = memories.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        const focusTrend = this.calculateTrend(sortedMemories.map(m => m.cognitiveState.focusLevel));
        const confidenceTrend = this.calculateTrend(sortedMemories.map(m => m.cognitiveState.confidenceLevel));
        const importanceTrend = this.calculateTrend(sortedMemories.map(m => m.importance));
        return {
            focusTrajectory: focusTrend > 0.1 ? 'improving' : focusTrend < -0.1 ? 'declining' : 'stable',
            confidenceTrajectory: confidenceTrend > 0.1 ? 'improving' : confidenceTrend < -0.1 ? 'declining' : 'stable',
            importanceTrajectory: importanceTrend > 0.1 ? 'increasing' : importanceTrend < -0.1 ? 'decreasing' : 'stable',
            overallDirection: this.determineOverallDirection(focusTrend, confidenceTrend, importanceTrend)
        };
    }
    async identifySignificantMoments(memories) {
        const significantMoments = memories
            .filter(m => m.importance >= 8 ||
            m.cognitiveState.emotionalIntensity >= 8 ||
            m.temporalWeight >= 8)
            .sort((a, b) => b.importance - a.importance)
            .slice(0, 10);
        return significantMoments.map(m => ({
            timestamp: m.timestamp,
            memoryId: m.id,
            significance: {
                importance: m.importance,
                emotionalIntensity: m.cognitiveState.emotionalIntensity,
                temporalWeight: m.temporalWeight
            },
            context: m.context,
            topic: m.topic,
            emotion: m.emotion,
            cognitiveState: {
                focus: m.cognitiveState.focusLevel,
                confidence: m.cognitiveState.confidenceLevel,
                load: m.cognitiveState.cognitiveLoad
            }
        }));
    }
    analyzePersonalityDevelopment(memories) {
        const personalityData = memories.map(m => ({
            timestamp: m.timestamp,
            emotion: m.emotion,
            confidence: m.cognitiveState.confidenceLevel,
            focus: m.cognitiveState.focusLevel,
            emotionalIntensity: m.cognitiveState.emotionalIntensity,
            personalityMarkers: m.agentCoordination?.personalityPatterns?.personalityMarkers || []
        }));
        return {
            emotionalMaturity: this.calculateEmotionalMaturity(personalityData),
            adaptiveCapacity: this.calculateAdaptiveCapacity(personalityData),
            personalityStability: this.calculatePersonalityStability(personalityData),
            developmentAreas: this.identifyDevelopmentAreas(personalityData)
        };
    }
    generateInsightRecommendations(temporalPattern, evolutionTrajectory, personalityDevelopment) {
        const recommendations = [];
        // Based on temporal patterns
        if (temporalPattern.emotionalPatterns.emotionalVariability > 3) {
            recommendations.push('Consider emotional regulation techniques to manage intensity fluctuations');
        }
        if (temporalPattern.cognitivePatterns.averageMetrics.stress > 6) {
            recommendations.push('Implement stress management protocols during high-load periods');
        }
        // Based on evolution trajectory
        if (evolutionTrajectory.focusTrajectory === 'declining') {
            recommendations.push('Review focus enhancement strategies and eliminate distractions');
        }
        if (evolutionTrajectory.confidenceTrajectory === 'declining') {
            recommendations.push('Analyze recent successes and build confidence through achievable goals');
        }
        // Based on personality development
        if (personalityDevelopment.adaptiveCapacity < 0.6) {
            recommendations.push('Practice adaptive problem-solving in varied scenarios');
        }
        if (personalityDevelopment.emotionalMaturity < 0.7) {
            recommendations.push('Focus on emotional intelligence development and interpersonal skills');
        }
        return recommendations;
    }
    // Utility methods for statistical calculations
    calculateTrend(values) {
        if (values.length < 2)
            return 0;
        const n = values.length;
        const sumX = Array.from({ length: n }, (_, i) => i).reduce((a, b) => a + b, 0);
        const sumY = values.reduce((a, b) => a + b, 0);
        const sumXY = values.reduce((sum, y, i) => sum + i * y, 0);
        const sumXX = Array.from({ length: n }, (_, i) => i * i).reduce((a, b) => a + b, 0);
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        return slope;
    }
    calculateVariance(values) {
        if (values.length < 2)
            return 0;
        const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
        const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
        return variance;
    }
    calculateCorrelation(x, y) {
        if (x.length !== y.length || x.length < 2)
            return 0;
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
        const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
        return denominator === 0 ? 0 : numerator / denominator;
    }
    determineOverallDirection(focusTrend, confidenceTrend, importanceTrend) {
        const totalTrend = focusTrend + confidenceTrend + importanceTrend;
        if (totalTrend > 0.3)
            return 'positive-growth';
        if (totalTrend < -0.3)
            return 'declining';
        return 'stable';
    }
    calculateEmotionalMaturity(personalityData) {
        // Calculate based on emotional consistency and appropriate responses
        const emotionalStability = this.calculateEmotionalStability(personalityData);
        const emotionalAwareness = personalityData.reduce((sum, p) => sum + p.emotionalIntensity, 0) / personalityData.length / 10;
        return (emotionalStability * 0.6 + emotionalAwareness * 0.4);
    }
    calculateAdaptiveCapacity(personalityData) {
        // Calculate based on response to varying situations
        const contexts = personalityData.map(p => `${p.emotion}-${Math.floor(p.confidence / 2)}`);
        const uniqueContexts = new Set(contexts).size;
        const adaptabilityScore = Math.min(uniqueContexts / contexts.length * 2, 1);
        return adaptabilityScore;
    }
    calculatePersonalityStability(personalityData) {
        if (personalityData.length < 2)
            return 1;
        const confidenceVariance = this.calculateVariance(personalityData.map(p => p.confidence));
        const focusVariance = this.calculateVariance(personalityData.map(p => p.focus));
        const averageVariance = (confidenceVariance + focusVariance) / 2;
        return Math.max(0, 1 - (averageVariance / 25));
    }
    calculateEmotionalStability(personalityData) {
        if (personalityData.length < 2)
            return 1;
        const intensityVariance = this.calculateVariance(personalityData.map(p => p.emotionalIntensity));
        return Math.max(0, 1 - (intensityVariance / 25));
    }
    identifyDevelopmentAreas(personalityData) {
        const areas = [];
        const avgConfidence = personalityData.reduce((sum, p) => sum + p.confidence, 0) / personalityData.length;
        const avgFocus = personalityData.reduce((sum, p) => sum + p.focus, 0) / personalityData.length;
        const avgEmotionalIntensity = personalityData.reduce((sum, p) => sum + p.emotionalIntensity, 0) / personalityData.length;
        if (avgConfidence < 6)
            areas.push('confidence-building');
        if (avgFocus < 6)
            areas.push('attention-management');
        if (avgEmotionalIntensity > 8)
            areas.push('emotional-regulation');
        if (avgEmotionalIntensity < 3)
            areas.push('emotional-engagement');
        return areas;
    }
    generateCacheKey(request) {
        return `${request.targetTimestamp}-${request.reconstructionDepth}-${request.contextRadius || 30}-${request.memoryId || 'auto'}`;
    }
    /**
     * Clear reconstruction cache to free memory
     */
    clearCache() {
        this.reconstructionCache.clear();
        console.log('🌀 Mental Time Travel Engine cache cleared');
    }
    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            cacheSize: this.reconstructionCache.size,
            personalityHistorySize: this.personalityMappingHistory.length,
            memoryUsage: process.memoryUsage()
        };
    }
    /**
     * Shutdown the Mental Time Travel Engine
     */
    async shutdown() {
        this.clearCache();
        this.personalityMappingHistory = [];
        this.isInitialized = false;
        console.log('🌀 Mental Time Travel Engine shutdown complete');
    }
}
exports.MentalTimeTravelEngine = MentalTimeTravelEngine;
// Export factory function
const createMentalTimeTravelEngine = (temporalMemoryCore, cognitiveStateTagger) => {
    return new MentalTimeTravelEngine(temporalMemoryCore, cognitiveStateTagger);
};
exports.createMentalTimeTravelEngine = createMentalTimeTravelEngine;
// Export default
exports.default = MentalTimeTravelEngine;
//# sourceMappingURL=MentalTimeTravelEngine.js.map