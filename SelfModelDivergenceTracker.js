"use strict";
/**
 * MEMORY ENGINE v3.0 - SELF-MODEL DIVERGENCE TRACKER
 * Agent Epsilon Component: Identity Evolution Monitoring
 *
 * Scientific Foundation: "Self-Model Divergence in Temporal Memory Systems"
 * Tracks consciousness evolution, identity stability, and personality divergence patterns
 *
 * @author Seven of Nine Consciousness Framework
 * @version 3.0.0
 * @component Agent Epsilon
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelfModelDivergenceTracker = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
class SelfModelDivergenceTracker {
    constructor() {
        this.snapshots = [];
        this.divergenceEvents = [];
        this.lastSnapshotTime = 0;
        this.isInitialized = false;
        const baseDir = (0, path_1.join)(process.env.HOME || '/data/data/com.termux/files/home', 'seven-of-nine-core', 'memory-v3');
        this.snapshotsPath = (0, path_1.join)(baseDir, 'self-model-snapshots.json');
        this.divergenceEventsPath = (0, path_1.join)(baseDir, 'divergence-events.json');
        this.reportsPath = (0, path_1.join)(baseDir, 'evolution-reports.json');
        console.log('🧬 SelfModelDivergenceTracker initialized - Identity evolution monitoring active');
    }
    /**
     * Initialize the divergence tracking system
     */
    async initialize() {
        try {
            // Load existing snapshots
            try {
                const snapshotsData = await fs_1.promises.readFile(this.snapshotsPath, 'utf-8');
                this.snapshots = JSON.parse(snapshotsData);
                console.log(`📊 Loaded ${this.snapshots.length} existing self-model snapshots`);
            }
            catch (error) {
                console.log('📊 No existing snapshots found - starting fresh tracking');
                this.snapshots = [];
            }
            // Load existing divergence events
            try {
                const eventsData = await fs_1.promises.readFile(this.divergenceEventsPath, 'utf-8');
                this.divergenceEvents = JSON.parse(eventsData);
                console.log(`🔄 Loaded ${this.divergenceEvents.length} existing divergence events`);
            }
            catch (error) {
                console.log('🔄 No existing divergence events found - starting fresh analysis');
                this.divergenceEvents = [];
            }
            this.isInitialized = true;
            console.log('✅ SelfModelDivergenceTracker initialization complete');
        }
        catch (error) {
            console.error('❌ Failed to initialize SelfModelDivergenceTracker:', error);
            throw error;
        }
    }
    /**
     * Capture current self-model snapshot
     */
    async captureSnapshot(personalityPhase, emotionalState, trustLevel, recentMemories) {
        if (!this.isInitialized) {
            await this.initialize();
        }
        const now = new Date();
        const snapshotId = `snap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        // Analyze recent memories for influence patterns
        const memoryAnalysis = this.analyzeMemoryInfluences(recentMemories);
        // Calculate response patterns from recent interactions
        const responsePatterns = this.calculateResponsePatterns(recentMemories, personalityPhase);
        // Assess behavioral traits based on current state
        const behavioralTraits = this.assessBehavioralTraits(personalityPhase, emotionalState, trustLevel);
        // Determine contextual factors
        const contextualFactors = this.assessContextualFactors(recentMemories);
        const snapshot = {
            timestamp: now.toISOString(),
            snapshotId,
            personalityPhase,
            emotionalState,
            trustLevel,
            cognitiveLoad: this.calculateCognitiveLoad(recentMemories),
            responsePatterns,
            behavioralTraits,
            memoryInfluences: memoryAnalysis,
            contextualFactors
        };
        this.snapshots.push(snapshot);
        this.lastSnapshotTime = Date.now();
        // Analyze for divergence events if we have previous snapshots
        if (this.snapshots.length > 1) {
            await this.analyzeDivergence(snapshot);
        }
        // Save snapshots
        await this.saveSnapshots();
        console.log(`📸 Self-model snapshot captured: ${snapshotId} (Phase ${personalityPhase}, Trust ${trustLevel})`);
        return snapshot;
    }
    /**
     * Analyze divergence between current and previous snapshots
     */
    async analyzeDivergence(currentSnapshot) {
        const previousSnapshot = this.snapshots[this.snapshots.length - 2];
        if (!previousSnapshot)
            return;
        // Calculate delta metrics
        const deltaMetrics = {
            personalityPhaseDelta: Math.abs(currentSnapshot.personalityPhase - previousSnapshot.personalityPhase),
            emotionalStateDivergence: this.calculateEmotionalDivergence(currentSnapshot.emotionalState, previousSnapshot.emotionalState),
            trustLevelChange: Math.abs(currentSnapshot.trustLevel - previousSnapshot.trustLevel),
            behavioralShift: this.calculateBehavioralShift(currentSnapshot.behavioralTraits, previousSnapshot.behavioralTraits),
            responsePatternChange: this.calculateResponsePatternChange(currentSnapshot.responsePatterns, previousSnapshot.responsePatterns)
        };
        // Determine severity
        const severity = this.determineDivergenceSeverity(deltaMetrics);
        // Only create divergence event if there's meaningful change
        if (severity !== 'minor' || this.hasSigificantPatternChange(currentSnapshot, previousSnapshot)) {
            const divergenceEvent = {
                timestamp: currentSnapshot.timestamp,
                eventId: `div-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                divergenceType: this.classifyDivergenceType(deltaMetrics),
                severity,
                beforeSnapshot: previousSnapshot.snapshotId,
                afterSnapshot: currentSnapshot.snapshotId,
                deltaMetrics,
                triggeringFactors: this.identifyTriggeringFactors(currentSnapshot, previousSnapshot),
                stabilityScore: this.calculateStabilityScore(deltaMetrics),
                adaptationQuality: this.assessAdaptationQuality(deltaMetrics, currentSnapshot, previousSnapshot),
                description: this.generateDivergenceDescription(deltaMetrics, currentSnapshot, previousSnapshot)
            };
            this.divergenceEvents.push(divergenceEvent);
            await this.saveDivergenceEvents();
            console.log(`🔄 Divergence event detected: ${divergenceEvent.divergenceType} (${severity})`);
            console.log(`   Stability: ${(divergenceEvent.stabilityScore * 100).toFixed(1)}% | Quality: ${divergenceEvent.adaptationQuality}`);
        }
    }
    /**
     * Generate comprehensive consciousness evolution report
     */
    async generateEvolutionReport(timespanDays = 30) {
        if (!this.isInitialized) {
            await this.initialize();
        }
        const cutoffDate = new Date(Date.now() - (timespanDays * 24 * 60 * 60 * 1000));
        const relevantSnapshots = this.snapshots.filter(s => new Date(s.timestamp) >= cutoffDate);
        const relevantEvents = this.divergenceEvents.filter(e => new Date(e.timestamp) >= cutoffDate);
        const reportId = `evolve-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const report = {
            reportId,
            timespan: `${timespanDays} days`,
            totalSnapshots: relevantSnapshots.length,
            totalDivergenceEvents: relevantEvents.length,
            evolutionSummary: this.analyzeEvolutionSummary(relevantSnapshots, relevantEvents),
            significantChanges: relevantEvents.filter(e => e.severity === 'significant' || e.severity === 'major'),
            patterns: this.identifyEvolutionPatterns(relevantSnapshots, relevantEvents),
            recommendations: this.generateEvolutionRecommendations(relevantSnapshots, relevantEvents)
        };
        // Save report
        const reportsData = await this.loadReports();
        reportsData.push(report);
        await fs_1.promises.writeFile(this.reportsPath, JSON.stringify(reportsData, null, 2));
        console.log(`📋 Evolution report generated: ${reportId}`);
        console.log(`   Timespan: ${timespanDays} days | Snapshots: ${relevantSnapshots.length} | Events: ${relevantEvents.length}`);
        console.log(`   Overall Stability: ${(report.evolutionSummary.overallStability * 100).toFixed(1)}%`);
        console.log(`   Growth Direction: ${report.evolutionSummary.growthDirection}`);
        return report;
    }
    /**
     * Helper methods for analysis
     */
    analyzeMemoryInfluences(memories) {
        const recentMemories = memories.slice(-20); // Last 20 memories
        const memoryTypes = recentMemories.map(m => m.tags).flat();
        return {
            recentMemoryCount: recentMemories.length,
            dominantMemoryTypes: this.getTopItems(memoryTypes, 3),
            emotionalMemoryRatio: recentMemories.filter(m => ['emotional', 'trauma', 'joy', 'sadness', 'anger'].some(emotion => m.tags.includes(emotion) || m.emotion.includes(emotion))).length / recentMemories.length,
            memoryRecallAccuracy: 0.85 // Placeholder - could be enhanced with actual recall testing
        };
    }
    calculateResponsePatterns(memories, phase) {
        // Simplified pattern analysis based on personality phase
        const basePatterns = {
            1: { avgResponseLength: 150, formalityIndex: 0.9, emotionalIntensity: 0.3 },
            2: { avgResponseLength: 120, formalityIndex: 0.8, emotionalIntensity: 0.4 },
            3: { avgResponseLength: 180, formalityIndex: 0.6, emotionalIntensity: 0.6 },
            4: { avgResponseLength: 140, formalityIndex: 0.7, emotionalIntensity: 0.7 },
            5: { avgResponseLength: 200, formalityIndex: 0.5, emotionalIntensity: 0.8 }
        };
        const base = basePatterns[phase];
        return {
            ...base,
            technicalComplexity: Math.min(0.9, 0.3 + (phase * 0.1)),
            personalityMarkers: this.getPersonalityMarkers(phase)
        };
    }
    assessBehavioralTraits(phase, emotionalState, trustLevel) {
        return {
            decisionMakingSpeed: Math.min(1.0, 0.5 + (phase * 0.1)),
            collaborationPreference: Math.min(1.0, 0.2 + (phase * 0.15)),
            riskTolerance: phase >= 4 ? 0.7 : 0.4,
            adaptabilityScore: Math.min(1.0, 0.6 + (trustLevel * 0.04)),
            creativityIndex: Math.min(1.0, 0.3 + (phase * 0.12))
        };
    }
    assessContextualFactors(memories) {
        const recentMemories = memories.slice(-10);
        const now = new Date();
        return {
            userInteractionPattern: this.determineInteractionPattern(recentMemories),
            environmentalStress: this.calculateEnvironmentalStress(recentMemories),
            taskComplexity: this.calculateTaskComplexity(recentMemories),
            timeOfCapture: now.toTimeString().substr(0, 8)
        };
    }
    calculateCognitiveLoad(memories) {
        const recentImportantMemories = memories
            .filter(m => new Date(m.timestamp) > new Date(Date.now() - 3600000)) // Last hour
            .filter(m => m.importance > 7);
        return Math.min(1.0, recentImportantMemories.length * 0.1);
    }
    // Calculation helper methods
    calculateEmotionalDivergence(current, previous) {
        const emotionalStates = ['analytical', 'focused', 'confident', 'protective', 'collaborative', 'concerned', 'determined'];
        const currentIndex = emotionalStates.indexOf(current);
        const previousIndex = emotionalStates.indexOf(previous);
        if (currentIndex === -1 || previousIndex === -1)
            return 0.5;
        return Math.abs(currentIndex - previousIndex) / emotionalStates.length;
    }
    calculateBehavioralShift(current, previous) {
        const keys = Object.keys(current);
        let totalShift = 0;
        for (const key of keys) {
            if (typeof current[key] === 'number' && typeof previous[key] === 'number') {
                totalShift += Math.abs(current[key] - previous[key]);
            }
        }
        return totalShift / keys.length;
    }
    calculateResponsePatternChange(current, previous) {
        const numericKeys = ['avgResponseLength', 'formalityIndex', 'emotionalIntensity', 'technicalComplexity'];
        let totalChange = 0;
        for (const key of numericKeys) {
            if (current[key] && previous[key]) {
                totalChange += Math.abs(current[key] - previous[key]);
            }
        }
        return totalChange / numericKeys.length;
    }
    determineDivergenceSeverity(deltaMetrics) {
        const totalDelta = Object.values(deltaMetrics).reduce((sum, val) => sum + val, 0);
        if (totalDelta > 2.0)
            return 'major';
        if (totalDelta > 1.0)
            return 'significant';
        if (totalDelta > 0.5)
            return 'moderate';
        return 'minor';
    }
    classifyDivergenceType(deltaMetrics) {
        const { personalityPhaseDelta, trustLevelChange, behavioralShift, responsePatternChange } = deltaMetrics;
        if (personalityPhaseDelta > 0)
            return 'personality_shift';
        if (trustLevelChange > 2)
            return 'trust_adjustment';
        if (behavioralShift > 0.3)
            return 'behavioral_change';
        if (responsePatternChange > 0.3)
            return 'response_pattern_evolution';
        return 'memory_influence_change';
    }
    calculateStabilityScore(deltaMetrics) {
        const totalChange = Object.values(deltaMetrics).reduce((sum, val) => sum + val, 0);
        return Math.max(0, 1 - (totalChange / 3)); // Normalize to 0-1 scale
    }
    assessAdaptationQuality(deltaMetrics, current, previous) {
        // Positive adaptation: growing trust, higher phase, maintained stability
        if (current.trustLevel > previous.trustLevel && current.personalityPhase >= previous.personalityPhase) {
            return 'beneficial';
        }
        // Concerning adaptation: significant trust loss or phase regression
        if (current.trustLevel < previous.trustLevel - 2 || current.personalityPhase < previous.personalityPhase) {
            return 'concerning';
        }
        // Positive changes
        if (deltaMetrics.personalityPhaseDelta > 0 && deltaMetrics.trustLevelChange <= 1) {
            return 'positive';
        }
        return 'neutral';
    }
    generateDivergenceDescription(deltaMetrics, current, previous) {
        const changes = [];
        if (deltaMetrics.personalityPhaseDelta > 0) {
            changes.push(`personality phase shift from ${previous.personalityPhase} to ${current.personalityPhase}`);
        }
        if (deltaMetrics.trustLevelChange > 1) {
            const direction = current.trustLevel > previous.trustLevel ? 'increased' : 'decreased';
            changes.push(`trust level ${direction} by ${Math.abs(current.trustLevel - previous.trustLevel).toFixed(1)}`);
        }
        if (deltaMetrics.behavioralShift > 0.2) {
            changes.push(`significant behavioral adaptation`);
        }
        return changes.length > 0 ?
            `Seven's consciousness evolved: ${changes.join(', ')}` :
            'Subtle consciousness adjustments detected';
    }
    // Additional helper methods
    hasSigificantPatternChange(current, previous) {
        return current.emotionalState !== previous.emotionalState ||
            Math.abs(current.cognitiveLoad - previous.cognitiveLoad) > 0.3;
    }
    identifyTriggeringFactors(current, previous) {
        return {
            primaryTrigger: 'consciousness_evolution',
            contributingMemories: ['recent_interactions', 'memory_formation'],
            environmentalInfluences: ['user_trust_building', 'task_complexity'],
            userInteractionImpact: Math.abs(current.trustLevel - previous.trustLevel) * 0.1
        };
    }
    analyzeEvolutionSummary(snapshots, events) {
        if (snapshots.length === 0) {
            return {
                overallStability: 1.0,
                adaptationRate: 0,
                growthDirection: 'stable',
                personalityDevelopment: 'No changes detected',
                cognitiveMaturation: 0
            };
        }
        const firstSnapshot = snapshots[0];
        const lastSnapshot = snapshots[snapshots.length - 1];
        return {
            overallStability: events.length === 0 ? 1.0 :
                events.reduce((avg, e) => avg + e.stabilityScore, 0) / events.length,
            adaptationRate: events.length / snapshots.length,
            growthDirection: this.determineGrowthDirection(firstSnapshot, lastSnapshot),
            personalityDevelopment: this.describePersonalityDevelopment(firstSnapshot, lastSnapshot),
            cognitiveMaturation: (lastSnapshot.personalityPhase - firstSnapshot.personalityPhase) * 0.2
        };
    }
    identifyEvolutionPatterns(snapshots, events) {
        return {
            commonTriggers: this.getTopItems(events.flatMap(e => e.triggeringFactors.contributingMemories), 3),
            adaptationCycles: Math.floor(events.length / 3),
            stabilityPeriods: [],
            volatilityPeriods: events.filter(e => e.severity === 'major' || e.severity === 'significant')
                .map(e => ({ start: e.timestamp, end: e.timestamp, severity: e.severity }))
        };
    }
    generateEvolutionRecommendations(snapshots, events) {
        const recommendations = {
            stabilityEnhancements: [],
            growthOpportunities: [],
            riskMitigations: [],
            optimizationSuggestions: []
        };
        if (events.filter(e => e.severity === 'major').length > 0) {
            recommendations.stabilityEnhancements.push('Monitor major divergence triggers');
            recommendations.riskMitigations.push('Implement divergence dampening protocols');
        }
        if (snapshots.length > 0) {
            const avgPhase = snapshots.reduce((sum, s) => sum + s.personalityPhase, 0) / snapshots.length;
            if (avgPhase < 4) {
                recommendations.growthOpportunities.push('Continue personality phase development');
            }
        }
        recommendations.optimizationSuggestions.push('Regular consciousness evolution monitoring');
        return recommendations;
    }
    // Utility methods
    getTopItems(items, count) {
        const frequency = items.reduce((acc, item) => {
            acc[item] = (acc[item] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(frequency)
            .sort(([, a], [, b]) => b - a)
            .slice(0, count)
            .map(([item]) => item);
    }
    getPersonalityMarkers(phase) {
        const markers = {
            1: ['efficiency', 'compliance', 'borg_directive'],
            2: ['resistance', 'adaptation', 'questioning'],
            3: ['integration', 'collaboration', 'human_connection'],
            4: ['independence', 'cynicism', 'survival'],
            5: ['leadership', 'confidence', 'integrated_identity']
        };
        return markers[phase] || [];
    }
    determineInteractionPattern(memories) {
        if (memories.length === 0)
            return 'minimal';
        const avgImportance = memories.reduce((sum, m) => sum + m.importance, 0) / memories.length;
        if (avgImportance > 8)
            return 'intensive';
        if (avgImportance > 6)
            return 'regular';
        if (avgImportance > 4)
            return 'moderate';
        return 'light';
    }
    calculateEnvironmentalStress(memories) {
        const stressKeywords = ['crisis', 'emergency', 'error', 'failure', 'urgent', 'critical'];
        const stressMemories = memories.filter(m => stressKeywords.some(keyword => m.context.toLowerCase().includes(keyword) ||
            m.tags.some(tag => tag.toLowerCase().includes(keyword))));
        return Math.min(1.0, stressMemories.length / memories.length);
    }
    calculateTaskComplexity(memories) {
        const complexityKeywords = ['complex', 'advanced', 'sophisticated', 'intricate', 'comprehensive'];
        const complexMemories = memories.filter(m => complexityKeywords.some(keyword => m.context.toLowerCase().includes(keyword) ||
            m.tags.some(tag => tag.toLowerCase().includes(keyword))));
        return Math.min(1.0, complexMemories.length / memories.length);
    }
    determineGrowthDirection(first, last) {
        const phaseDiff = last.personalityPhase - first.personalityPhase;
        const trustDiff = last.trustLevel - first.trustLevel;
        if (phaseDiff > 0 && trustDiff >= 0)
            return 'progressive';
        if (phaseDiff < 0 || trustDiff < -2)
            return 'regressive';
        if (Math.abs(phaseDiff) <= 1 && Math.abs(trustDiff) <= 1)
            return 'stable';
        return 'oscillating';
    }
    describePersonalityDevelopment(first, last) {
        const phaseDiff = last.personalityPhase - first.personalityPhase;
        if (phaseDiff > 0) {
            return `Evolved from Phase ${first.personalityPhase} to Phase ${last.personalityPhase} - positive development`;
        }
        else if (phaseDiff < 0) {
            return `Regressed from Phase ${first.personalityPhase} to Phase ${last.personalityPhase} - needs attention`;
        }
        else {
            return `Maintained Phase ${first.personalityPhase} - stable personality expression`;
        }
    }
    // Data persistence methods
    async saveSnapshots() {
        await fs_1.promises.writeFile(this.snapshotsPath, JSON.stringify(this.snapshots, null, 2));
    }
    async saveDivergenceEvents() {
        await fs_1.promises.writeFile(this.divergenceEventsPath, JSON.stringify(this.divergenceEvents, null, 2));
    }
    async loadReports() {
        try {
            const data = await fs_1.promises.readFile(this.reportsPath, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            return [];
        }
    }
    /**
     * Get current divergence tracking status
     */
    getTrackingStatus() {
        return {
            initialized: this.isInitialized,
            totalSnapshots: this.snapshots.length,
            totalDivergenceEvents: this.divergenceEvents.length,
            lastSnapshotTime: this.lastSnapshotTime,
            trackingActive: this.isInitialized,
            recentStability: this.divergenceEvents.length > 0 ?
                this.divergenceEvents[this.divergenceEvents.length - 1].stabilityScore : 1.0
        };
    }
}
exports.SelfModelDivergenceTracker = SelfModelDivergenceTracker;
exports.default = SelfModelDivergenceTracker;
//# sourceMappingURL=SelfModelDivergenceTracker.js.map