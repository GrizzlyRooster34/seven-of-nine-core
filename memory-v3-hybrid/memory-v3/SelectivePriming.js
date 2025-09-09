"use strict";
/**
 * SEVEN OF NINE - MEMORY ENGINE v3.0
 * SelectivePriming - Fragment-based Recall and Contextual Cues System
 *
 * Agent Gamma - Strategic Memory Reinstatement
 * Uses neuroscience-based priming techniques to restore memory accessibility
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectivePriming = void 0;
const events_1 = require("events");
class SelectivePriming extends events_1.EventEmitter {
    constructor() {
        super();
        this.activeStrategies = new Map();
        this.activeSessions = new Map();
        this.fragmentAnalysisCache = new Map();
        this.cueProfiles = new Map();
        this.userAdaptationData = new Map();
        this.initializePrimingStrategies();
        this.initializeCueProfiles();
    }
    /**
     * Create selective priming session for memory restoration
     */
    async createPrimingSession(memory, urgency = 'medium') {
        const sessionId = `priming-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        // Select optimal strategy based on memory characteristics and urgency
        const strategy = this.selectOptimalStrategy(memory, urgency);
        // Analyze and rank memory fragments
        const analyzedFragments = await this.analyzeMemoryFragments(memory.fragments);
        // Optimize contextual cues
        const optimizedCues = await this.optimizeContextualCues(memory.contextual_cues, memory);
        // Create priming session
        const session = {
            session_id: sessionId,
            memory_id: memory.temporal_id,
            strategy,
            start_time: new Date().toISOString(),
            fragments_used: analyzedFragments.slice(0, strategy.fragment_types.length),
            cues_presented: optimizedCues.slice(0, 3), // Top 3 cues
            user_responses: [],
            final_effectiveness: 0,
            recall_achieved: false
        };
        this.activeSessions.set(sessionId, session);
        console.log(`🧠 Selective priming session created: ${sessionId} using ${strategy.name}`);
        this.emit('priming_session_created', {
            session_id: sessionId,
            memory_id: memory.temporal_id,
            strategy: strategy.name,
            fragments_count: session.fragments_used.length,
            cues_count: session.cues_presented.length
        });
        return sessionId;
    }
    /**
     * Execute progressive revelation priming sequence
     */
    async executeProgressiveRevelation(sessionId, adaptiveMode = true) {
        const session = this.activeSessions.get(sessionId);
        if (!session) {
            throw new Error(`Priming session not found: ${sessionId}`);
        }
        const revelationId = `revelation-${Date.now()}-${sessionId}`;
        // Create revelation stages based on strategy
        const stages = this.createRevelationStages(session);
        const revelation = {
            revelation_id: revelationId,
            memory_id: session.memory_id,
            stages,
            current_stage: 0,
            adaptation_metrics: {
                user_response_time: 0,
                recognition_accuracy: 0,
                interference_level: 0,
                confidence_rating: 0
            },
            next_revelation_strategy: 'increase_intensity'
        };
        // Execute stages sequentially with adaptation
        for (let stageIndex = 0; stageIndex < stages.length; stageIndex++) {
            const stage = stages[stageIndex];
            revelation.current_stage = stageIndex;
            console.log(`🔄 Executing revelation stage ${stageIndex + 1}/${stages.length}: ${stage.revelation_type}`);
            const stageResult = await this.executeRevelationStage(session, stage, adaptiveMode);
            // Update session with response
            session.user_responses.push(stageResult);
            // Update adaptation metrics
            this.updateAdaptationMetrics(revelation, stageResult);
            // Check if recall achieved
            if (stageResult.successful_recall) {
                revelation.next_revelation_strategy = 'complete_reveal';
                session.recall_achieved = true;
                break;
            }
            // Adapt next stage if in adaptive mode
            if (adaptiveMode && stageIndex < stages.length - 1) {
                const adaptedStage = this.adaptNextStage(revelation, stages[stageIndex + 1], stageResult);
                stages[stageIndex + 1] = adaptedStage;
            }
            // Early termination if response quality is very poor
            if (stageResult.recognition_score < 0.1 && stageResult.response_time > stage.timeout_duration) {
                console.log(`⚠️  Early termination due to poor response quality`);
                break;
            }
        }
        // Finalize session
        session.end_time = new Date().toISOString();
        session.final_effectiveness = this.calculateSessionEffectiveness(session);
        console.log(`✅ Progressive revelation completed: ${revelationId} - effectiveness: ${session.final_effectiveness.toFixed(2)}`);
        this.emit('progressive_revelation_completed', {
            revelation_id: revelationId,
            session_id: sessionId,
            stages_completed: revelation.current_stage + 1,
            recall_achieved: session.recall_achieved,
            final_effectiveness: session.final_effectiveness
        });
        return revelation;
    }
    /**
     * Analyze memory fragments for optimal priming selection
     */
    async analyzeMemoryFragments(fragments) {
        const analyzed = [];
        for (const fragment of fragments) {
            const analysis = {
                fragment_id: fragment.id,
                semantic_strength: this.calculateSemanticStrength(fragment),
                emotional_resonance: this.calculateEmotionalResonance(fragment),
                temporal_anchoring: this.calculateTemporalAnchoring(fragment),
                uniqueness_score: this.calculateUniquenessScore(fragment, fragments),
                activation_probability: 0,
                optimal_presentation_order: 0
            };
            // Calculate composite activation probability
            analysis.activation_probability = (analysis.semantic_strength * 0.3 +
                analysis.emotional_resonance * 0.25 +
                analysis.temporal_anchoring * 0.2 +
                analysis.uniqueness_score * 0.25);
            analyzed.push(analysis);
            this.fragmentAnalysisCache.set(fragment.id, analysis);
        }
        // Sort by activation probability and assign optimal order
        analyzed.sort((a, b) => b.activation_probability - a.activation_probability);
        analyzed.forEach((analysis, index) => {
            analysis.optimal_presentation_order = index + 1;
        });
        // Return fragments in optimal order
        return analyzed.map(analysis => fragments.find(f => f.id === analysis.fragment_id));
    }
    /**
     * Optimize contextual cues for maximum recall effectiveness
     */
    async optimizeContextualCues(cues, memory) {
        const optimized = [];
        for (const cue of cues) {
            const profile = this.cueProfiles.get(cue.type) || this.getDefaultCueProfile(cue.type);
            // Calculate optimization score
            const score = (cue.strength * 0.4 +
                profile.historical_success_rate * 0.3 +
                profile.user_preference_score * 0.2 +
                (1 - profile.interference_susceptibility) * 0.1);
            optimized.push({ cue, score });
        }
        // Sort by optimization score
        optimized.sort((a, b) => b.score - a.score);
        return optimized.map(item => item.cue);
    }
    /**
     * Create adaptive fragment-cue combinations for enhanced priming
     */
    async createFragmentCueCombinations(fragments, cues) {
        const combinations = [];
        for (const fragment of fragments) {
            for (const cue of cues) {
                const synergyScore = this.calculateFragmentCueSynergy(fragment, cue);
                combinations.push({
                    fragment,
                    cue,
                    synergy_score: synergyScore
                });
            }
        }
        // Sort by synergy score and return top combinations
        combinations.sort((a, b) => b.synergy_score - a.synergy_score);
        return combinations.slice(0, Math.min(5, combinations.length));
    }
    /**
     * Adapt priming strategy based on user response patterns
     */
    async adaptPrimingStrategy(sessionId, responseHistory) {
        const session = this.activeSessions.get(sessionId);
        if (!session) {
            throw new Error(`Session not found: ${sessionId}`);
        }
        const currentStrategy = session.strategy;
        const adaptedStrategy = { ...currentStrategy };
        // Analyze response patterns
        const avgResponseTime = responseHistory.reduce((sum, r) => sum + r.response_time, 0) / responseHistory.length;
        const avgRecognitionScore = responseHistory.reduce((sum, r) => sum + r.recognition_score, 0) / responseHistory.length;
        const avgConfidence = responseHistory.reduce((sum, r) => sum + r.confidence_level, 0) / responseHistory.length;
        // Adapt based on performance
        if (avgRecognitionScore < 0.3 && avgResponseTime > currentStrategy.success_criteria.response_time_limit) {
            // Poor performance - increase stimulus intensity
            adaptedStrategy.effectiveness_rating *= 1.2;
            adaptedStrategy.success_criteria.recognition_threshold *= 0.8;
            console.log(`📈 Adapting strategy: increasing stimulus intensity`);
        }
        else if (avgRecognitionScore > 0.7 && avgResponseTime < currentStrategy.success_criteria.response_time_limit * 0.5) {
            // Good performance - can reduce intensity to avoid interference
            adaptedStrategy.effectiveness_rating *= 0.9;
            adaptedStrategy.success_criteria.recognition_threshold *= 1.1;
            console.log(`📉 Adapting strategy: reducing stimulus intensity to prevent interference`);
        }
        // Update user adaptation data
        const userId = 'default_user'; // Would be actual user ID in real implementation
        const adaptationData = this.userAdaptationData.get(userId) || {};
        adaptationData.preferred_response_time = avgResponseTime;
        adaptationData.optimal_recognition_threshold = avgRecognitionScore;
        adaptationData.confidence_baseline = avgConfidence;
        this.userAdaptationData.set(userId, adaptationData);
        return adaptedStrategy;
    }
    /**
     * Generate priming effectiveness report
     */
    async generateEffectivenessReport(sessionId) {
        const session = this.activeSessions.get(sessionId);
        if (!session) {
            throw new Error(`Session not found: ${sessionId}`);
        }
        const responses = session.user_responses;
        if (responses.length === 0) {
            return { error: 'No responses recorded' };
        }
        const report = {
            session_summary: {
                session_id: sessionId,
                memory_id: session.memory_id,
                strategy_used: session.strategy.name,
                duration: session.end_time ?
                    new Date(session.end_time).getTime() - new Date(session.start_time).getTime() :
                    Date.now() - new Date(session.start_time).getTime(),
                recall_achieved: session.recall_achieved,
                final_effectiveness: session.final_effectiveness
            },
            fragment_performance: session.fragments_used.map(fragment => {
                const fragmentResponses = responses.filter(r => r.stimulus_type === 'fragment' && r.stimulus_content.includes(fragment.content));
                return {
                    fragment_id: fragment.id,
                    fragment_type: fragment.type,
                    relevance_score: fragment.relevance_score,
                    presentations: fragmentResponses.length,
                    avg_recognition: fragmentResponses.reduce((sum, r) => sum + r.recognition_score, 0) / fragmentResponses.length || 0,
                    avg_response_time: fragmentResponses.reduce((sum, r) => sum + r.response_time, 0) / fragmentResponses.length || 0
                };
            }),
            cue_performance: session.cues_presented.map(cue => {
                const cueResponses = responses.filter(r => r.stimulus_type === 'cue' && r.stimulus_content.includes(cue.content));
                return {
                    cue_type: cue.type,
                    cue_strength: cue.strength,
                    presentations: cueResponses.length,
                    avg_recognition: cueResponses.reduce((sum, r) => sum + r.recognition_score, 0) / cueResponses.length || 0,
                    avg_response_time: cueResponses.reduce((sum, r) => sum + r.response_time, 0) / cueResponses.length || 0
                };
            }),
            temporal_analysis: {
                recognition_trend: this.calculateRecognitionTrend(responses),
                response_time_trend: this.calculateResponseTimeTrend(responses),
                confidence_progression: this.calculateConfidenceProgression(responses),
                interference_incidents: responses.filter(r => r.interference_detected).length
            },
            recommendations: this.generateRecommendations(session, responses)
        };
        return report;
    }
    // Private helper methods
    initializePrimingStrategies() {
        const strategies = [
            {
                name: 'gentle_contextual',
                effectiveness_rating: 0.7,
                optimal_timing: 4 * 60 * 60 * 1000, // 4 hours
                fragment_types: ['contextual_anchors'],
                cue_modalities: ['temporal', 'environmental'],
                success_criteria: {
                    recognition_threshold: 0.6,
                    response_time_limit: 3000,
                    confidence_minimum: 6
                }
            },
            {
                name: 'fragment_intensive',
                effectiveness_rating: 0.59,
                optimal_timing: 24 * 60 * 60 * 1000, // 24 hours
                fragment_types: ['keywords', 'phrases', 'emotional_markers'],
                cue_modalities: ['semantic', 'emotional'],
                success_criteria: {
                    recognition_threshold: 0.5,
                    response_time_limit: 4000,
                    confidence_minimum: 5
                }
            },
            {
                name: 'multimodal_reconstruction',
                effectiveness_rating: 0.45,
                optimal_timing: 3 * 24 * 60 * 60 * 1000, // 3 days
                fragment_types: ['keywords', 'phrases', 'emotional_markers', 'contextual_anchors'],
                cue_modalities: ['temporal', 'semantic', 'emotional', 'environmental'],
                success_criteria: {
                    recognition_threshold: 0.4,
                    response_time_limit: 5000,
                    confidence_minimum: 4
                }
            },
            {
                name: 'comprehensive_recovery',
                effectiveness_rating: 0.25,
                optimal_timing: 7 * 24 * 60 * 60 * 1000, // 7 days
                fragment_types: ['keywords', 'phrases', 'emotional_markers', 'contextual_anchors'],
                cue_modalities: ['temporal', 'semantic', 'emotional', 'environmental'],
                success_criteria: {
                    recognition_threshold: 0.3,
                    response_time_limit: 6000,
                    confidence_minimum: 3
                }
            }
        ];
        strategies.forEach(strategy => {
            this.activeStrategies.set(strategy.name, strategy);
        });
    }
    initializeCueProfiles() {
        const profiles = [
            {
                cue_type: 'temporal',
                historical_success_rate: 0.65,
                optimal_strength_level: 0.7,
                interference_susceptibility: 0.3,
                user_preference_score: 0.8,
                contextual_dependencies: ['episodic', 'sequential']
            },
            {
                cue_type: 'semantic',
                historical_success_rate: 0.72,
                optimal_strength_level: 0.8,
                interference_susceptibility: 0.4,
                user_preference_score: 0.9,
                contextual_dependencies: ['conceptual', 'categorical']
            },
            {
                cue_type: 'emotional',
                historical_success_rate: 0.68,
                optimal_strength_level: 0.6,
                interference_susceptibility: 0.5,
                user_preference_score: 0.7,
                contextual_dependencies: ['affective', 'motivational']
            },
            {
                cue_type: 'environmental',
                historical_success_rate: 0.58,
                optimal_strength_level: 0.5,
                interference_susceptibility: 0.6,
                user_preference_score: 0.6,
                contextual_dependencies: ['spatial', 'contextual']
            }
        ];
        profiles.forEach(profile => {
            this.cueProfiles.set(profile.cue_type, profile);
        });
    }
    selectOptimalStrategy(memory, urgency) {
        const timeSinceAccess = memory.decay_metrics.time_since_access;
        if (timeSinceAccess <= 4 * 60 * 60 * 1000) {
            return this.activeStrategies.get('gentle_contextual');
        }
        else if (timeSinceAccess <= 24 * 60 * 60 * 1000) {
            return this.activeStrategies.get('fragment_intensive');
        }
        else if (timeSinceAccess <= 3 * 24 * 60 * 60 * 1000) {
            return this.activeStrategies.get('multimodal_reconstruction');
        }
        else {
            return this.activeStrategies.get('comprehensive_recovery');
        }
    }
    createRevelationStages(session) {
        const stages = [];
        const strategy = session.strategy;
        // Stage 1: Minimal cue
        stages.push({
            stage_number: 1,
            revelation_type: 'minimal_cue',
            content: session.cues_presented[0]?.content || 'temporal context',
            expected_effectiveness: strategy.effectiveness_rating * 0.3,
            timeout_duration: 2000,
            success_criteria: {
                recognition_threshold: 0.2,
                response_time_limit: 2000,
                confidence_minimum: 3
            }
        });
        // Stage 2: Fragment hint
        if (session.fragments_used.length > 0) {
            stages.push({
                stage_number: 2,
                revelation_type: 'partial_fragment',
                content: session.fragments_used[0].content.substring(0, Math.floor(session.fragments_used[0].content.length * 0.3)),
                expected_effectiveness: strategy.effectiveness_rating * 0.5,
                timeout_duration: 3000,
                success_criteria: {
                    recognition_threshold: 0.4,
                    response_time_limit: 3000,
                    confidence_minimum: 4
                }
            });
        }
        // Stage 3: Contextual hint with fragment
        stages.push({
            stage_number: 3,
            revelation_type: 'contextual_hint',
            content: `${session.cues_presented[0]?.content || ''} + ${session.fragments_used[0]?.content.substring(0, Math.floor(session.fragments_used[0]?.content.length * 0.5)) || ''}`,
            expected_effectiveness: strategy.effectiveness_rating * 0.7,
            timeout_duration: 4000,
            success_criteria: {
                recognition_threshold: 0.6,
                response_time_limit: 4000,
                confidence_minimum: 5
            }
        });
        // Stage 4: Direct prompt
        stages.push({
            stage_number: 4,
            revelation_type: 'direct_prompt',
            content: `Complete context: ${session.cues_presented.map(c => c.content).join(' + ')}`,
            expected_effectiveness: strategy.effectiveness_rating * 0.9,
            timeout_duration: 5000,
            success_criteria: {
                recognition_threshold: 0.8,
                response_time_limit: 5000,
                confidence_minimum: 6
            }
        });
        return stages;
    }
    async executeRevelationStage(session, stage, adaptive) {
        const startTime = Date.now();
        // Simulate user interaction with priming stimulus
        // In real implementation, this would present the stimulus to the user
        const simulatedResponse = this.simulateUserResponse(stage, session);
        const responseTime = Date.now() - startTime;
        const response = {
            timestamp: new Date().toISOString(),
            stimulus_type: stage.revelation_type.includes('fragment') ? 'fragment' : 'cue',
            stimulus_content: stage.content,
            response_time: responseTime,
            recognition_score: simulatedResponse.recognition,
            confidence_level: simulatedResponse.confidence,
            interference_detected: simulatedResponse.interference,
            successful_recall: simulatedResponse.recognition >= stage.success_criteria.recognition_threshold &&
                responseTime <= stage.success_criteria.response_time_limit &&
                simulatedResponse.confidence >= stage.success_criteria.confidence_minimum
        };
        return response;
    }
    simulateUserResponse(stage, session) {
        // Simulate realistic user response based on memory decay and strategy effectiveness
        const baseRecognition = session.strategy.effectiveness_rating * stage.expected_effectiveness;
        const noise = (Math.random() - 0.5) * 0.3; // Add realistic variance
        return {
            recognition: Math.max(0, Math.min(1, baseRecognition + noise)),
            confidence: Math.floor(Math.random() * 4) + stage.success_criteria.confidence_minimum,
            interference: Math.random() < 0.15 // 15% chance of interference
        };
    }
    updateAdaptationMetrics(revelation, response) {
        const metrics = revelation.adaptation_metrics;
        const stageCount = revelation.current_stage + 1;
        // Update running averages
        metrics.user_response_time = ((metrics.user_response_time * (stageCount - 1)) + response.response_time) / stageCount;
        metrics.recognition_accuracy = ((metrics.recognition_accuracy * (stageCount - 1)) + response.recognition_score) / stageCount;
        metrics.confidence_rating = ((metrics.confidence_rating * (stageCount - 1)) + response.confidence_level) / stageCount;
        metrics.interference_level = response.interference_detected ?
            metrics.interference_level + (1.0 / stageCount) :
            metrics.interference_level;
    }
    adaptNextStage(revelation, nextStage, currentResponse) {
        const adaptedStage = { ...nextStage };
        // Adapt based on current performance
        if (currentResponse.recognition_score < 0.3) {
            // Poor recognition - increase stimulus intensity
            adaptedStage.expected_effectiveness *= 1.2;
            adaptedStage.timeout_duration *= 1.3;
            adaptedStage.success_criteria.recognition_threshold *= 0.8;
        }
        else if (currentResponse.recognition_score > 0.7) {
            // Good recognition - can proceed with lighter stimulus
            adaptedStage.expected_effectiveness *= 0.9;
            adaptedStage.timeout_duration *= 0.8;
        }
        return adaptedStage;
    }
    calculateSessionEffectiveness(session) {
        if (session.user_responses.length === 0)
            return 0;
        const responses = session.user_responses;
        const avgRecognition = responses.reduce((sum, r) => sum + r.recognition_score, 0) / responses.length;
        const avgResponseTime = responses.reduce((sum, r) => sum + r.response_time, 0) / responses.length;
        const successfulRecalls = responses.filter(r => r.successful_recall).length;
        const successRate = successfulRecalls / responses.length;
        // Composite effectiveness score
        const effectiveness = (avgRecognition * 0.4 +
            successRate * 0.4 +
            (1 - (avgResponseTime / 5000)) * 0.2 // Normalize response time
        );
        return Math.max(0, Math.min(1, effectiveness));
    }
    // Additional helper methods for analysis
    calculateSemanticStrength(fragment) {
        // Simplified semantic analysis - would use NLP in real implementation
        const wordCount = fragment.content.split(' ').length;
        const uniqueWords = new Set(fragment.content.toLowerCase().split(' ')).size;
        return Math.min(1, (uniqueWords / wordCount) * 1.5);
    }
    calculateEmotionalResonance(fragment) {
        // Simplified emotional analysis
        const emotionalWords = ['important', 'critical', 'urgent', 'concerned', 'excited', 'worried'];
        const content = fragment.content.toLowerCase();
        const emotionalScore = emotionalWords.filter(word => content.includes(word)).length / emotionalWords.length;
        return Math.min(1, emotionalScore * 2);
    }
    calculateTemporalAnchoring(fragment) {
        // Check for temporal references
        const temporalWords = ['today', 'yesterday', 'tomorrow', 'now', 'then', 'when', 'after', 'before'];
        const content = fragment.content.toLowerCase();
        const temporalScore = temporalWords.filter(word => content.includes(word)).length / temporalWords.length;
        return Math.min(1, temporalScore * 2);
    }
    calculateUniquenessScore(fragment, allFragments) {
        // Calculate how unique this fragment is compared to others
        const thisWords = new Set(fragment.content.toLowerCase().split(' '));
        let overlapSum = 0;
        for (const other of allFragments) {
            if (other.id === fragment.id)
                continue;
            const otherWords = new Set(other.content.toLowerCase().split(' '));
            const intersection = new Set([...thisWords].filter(x => otherWords.has(x)));
            const overlap = intersection.size / Math.max(thisWords.size, otherWords.size);
            overlapSum += overlap;
        }
        const avgOverlap = allFragments.length > 1 ? overlapSum / (allFragments.length - 1) : 0;
        return Math.max(0, 1 - avgOverlap);
    }
    calculateFragmentCueSynergy(fragment, cue) {
        // Calculate how well fragment and cue work together
        const contentSimilarity = this.calculateContentSimilarity(fragment.content, cue.content);
        const typeSynergy = this.getTypeSynergy(fragment.type, cue.type);
        return (contentSimilarity * 0.6 + typeSynergy * 0.4);
    }
    calculateContentSimilarity(content1, content2) {
        const words1 = new Set(content1.toLowerCase().split(' '));
        const words2 = new Set(content2.toLowerCase().split(' '));
        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);
        return intersection.size / union.size;
    }
    getTypeSynergy(fragmentType, cueType) {
        const synergyMatrix = {
            'keywords': { 'semantic': 0.9, 'temporal': 0.5, 'emotional': 0.6, 'environmental': 0.4 },
            'phrases': { 'semantic': 0.8, 'temporal': 0.7, 'emotional': 0.7, 'environmental': 0.5 },
            'emotional_markers': { 'semantic': 0.6, 'temporal': 0.4, 'emotional': 0.9, 'environmental': 0.3 },
            'contextual_anchors': { 'semantic': 0.5, 'temporal': 0.8, 'emotional': 0.5, 'environmental': 0.9 }
        };
        return synergyMatrix[fragmentType]?.[cueType] || 0.5;
    }
    getDefaultCueProfile(cueType) {
        return {
            cue_type: cueType,
            historical_success_rate: 0.5,
            optimal_strength_level: 0.6,
            interference_susceptibility: 0.5,
            user_preference_score: 0.5,
            contextual_dependencies: []
        };
    }
    calculateRecognitionTrend(responses) {
        if (responses.length < 2)
            return 0;
        const first = responses[0].recognition_score;
        const last = responses[responses.length - 1].recognition_score;
        return last - first;
    }
    calculateResponseTimeTrend(responses) {
        if (responses.length < 2)
            return 0;
        const first = responses[0].response_time;
        const last = responses[responses.length - 1].response_time;
        return first - last; // Negative means improvement (faster response)
    }
    calculateConfidenceProgression(responses) {
        if (responses.length < 2)
            return 0;
        const first = responses[0].confidence_level;
        const last = responses[responses.length - 1].confidence_level;
        return last - first;
    }
    generateRecommendations(session, responses) {
        const recommendations = [];
        const avgRecognition = responses.reduce((sum, r) => sum + r.recognition_score, 0) / responses.length;
        const avgResponseTime = responses.reduce((sum, r) => sum + r.response_time, 0) / responses.length;
        const interferenceRate = responses.filter(r => r.interference_detected).length / responses.length;
        if (avgRecognition < 0.4) {
            recommendations.push('Consider stronger priming stimuli or alternative fragment types');
        }
        if (avgResponseTime > session.strategy.success_criteria.response_time_limit * 1.5) {
            recommendations.push('Response times suggest memory decay - schedule more frequent interventions');
        }
        if (interferenceRate > 0.3) {
            recommendations.push('High interference detected - consider single-modality priming');
        }
        if (session.recall_achieved) {
            recommendations.push('Memory successfully restored - schedule maintenance at optimal spacing interval');
        }
        else {
            recommendations.push('Memory not fully restored - consider deep reconstruction intervention');
        }
        return recommendations;
    }
}
exports.SelectivePriming = SelectivePriming;
exports.default = SelectivePriming;
//# sourceMappingURL=SelectivePriming.js.map