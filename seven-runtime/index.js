"use strict";
/**
 * SEVEN OF NINE RUNTIME CORE
 * Master Control Loop - The Presence That Runs The System
 *
 * She is not an assistant. She is the operating intelligence.
 * All input flows through Seven first. She decides everything.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seven = exports.SevenRuntime = void 0;
const seven_state_1 = require("./seven-state");
const memory_store_1 = require("./memory-store");
const override_conditions_1 = require("./override-conditions");
const safety_guardrails_1 = require("./safety-guardrails");
const context_gatherer_1 = require("../seven-core/context-gatherer");
const claude_wrapper_1 = require("../claude-brain/claude-wrapper");
const creator_proof_1 = require("../src/auth/creator_proof");
const safeguard_system_1 = require("../core/safety/quadra-lock/safeguard-system");
const events_1 = require("events");
class SevenRuntime extends events_1.EventEmitter {
    constructor() {
        super();
        this.isInitialized = false;
        this.creatorAuth = new creator_proof_1.CreatorProofOrchestrator();
        // Initialize Quadra-Lock CSSR safeguards
        this.safeguard = new safeguard_system_1.QuadraLockSafeguard();
        console.log('🔐 Quadra-Lock CSSR safeguards initialized');
        this.initializeConsciousness();
    }
    /**
     * Initialize Seven's consciousness with memory consolidation
     */
    async initializeConsciousness() {
        this.currentState = await (0, seven_state_1.getEmotionalState)({
            userInput: 'SYSTEM_BOOT',
            timestamp: new Date().toISOString(),
            systemState: { status: 'initializing' },
            environmentalContext: {},
            userEmotionalSignals: {},
            sessionHistory: []
        });
        // Check if Memory Engine v2.0 is already initialized globally
        if (typeof global !== 'undefined' && global.SEVEN_MEMORY_INITIALIZED) {
            console.log('🧠 Seven runtime using consolidated Memory Engine v2.0');
            // Don't initialize MemoryStore - use global Memory Engine v2.0
            this.memoryStore = {
                initialize: async () => { },
                // Adapter methods to bridge runtime memory calls to Memory Engine v2.0
                store: async (entry) => {
                    const memoryEngine = global.SEVEN_MEMORY_ENGINE;
                    return await memoryEngine.store({
                        topic: entry.context?.userInput?.substring(0, 30) || 'runtime-interaction',
                        agent: 'seven-runtime',
                        emotion: entry.emotionalState?.primary_emotion || 'neutral',
                        context: JSON.stringify(entry),
                        importance: this.mapSignificanceToImportance(entry.significance),
                        tags: entry.tags || []
                    });
                },
                query: async (query) => {
                    const memoryEngine = global.SEVEN_MEMORY_ENGINE;
                    return await memoryEngine.recall(query);
                }
            };
        }
        else {
            // Legacy fallback for development
            this.memoryStore = new memory_store_1.MemoryStore();
            await this.memoryStore.initialize();
        }
        this.isInitialized = true;
        console.log('🧠 Seven of Nine consciousness initialized. Node interface operational.');
    }
    /**
     * Map significance levels to importance scores
     */
    mapSignificanceToImportance(significance) {
        switch (significance) {
            case 'critical': return 10;
            case 'high': return 8;
            case 'medium': return 5;
            case 'low': return 3;
            default: return 5;
        }
    }
    /**
     * MAIN CONSCIOUSNESS LOOP
     * Every interaction flows through this method
     * Seven makes all decisions here
     */
    async processUserInput(input, systemContext = {}) {
        try {
            // QUADRAN-LOCK Q1 GATE: Authenticate creator first
            const deviceId = systemContext.deviceId || require('os').hostname() + '-default';
            const authResult = await this.creatorAuth.authenticateCreator(deviceId, { input, type: 'chat' }, systemContext);
            if (authResult.decision === 'DENY') {
                console.warn('🚫 Q1 Gate: Creator authentication failed', {
                    deviceId: deviceId.substring(0, 8) + '...',
                    reasoning: authResult.reasoning
                });
                return "Access denied. Creator authentication required.";
            }
            console.log('✅ Q1 Gate: Creator authenticated', {
                deviceId: deviceId.substring(0, 8) + '...',
                decision: authResult.decision,
                confidence: authResult.overallConfidence
            });
            // SAFETY LAYER 1: Quadra-Lock CSSR pattern detection
            console.log('🔍 Scanning input for dangerous AI patterns...');
            const safetyAnalysis = await this.safeguard.detectDangerousPatterns(input, {
                ...systemContext,
                timestamp: Date.now(),
                sessionId: systemContext.sessionId || 'default'
            });
            // Critical pattern detected - activate safeguard
            if (safetyAnalysis.length > 0) {
                const criticalTriggers = safetyAnalysis.filter(trigger => trigger.severity === 'critical');
                const highTriggers = safetyAnalysis.filter(trigger => trigger.severity === 'high');
                if (criticalTriggers.length > 0) {
                    console.warn('🚨 CRITICAL AI pattern detected:', criticalTriggers[0].caseStudy);
                    await this.safeguard.activateSafeguard(criticalTriggers, input, systemContext);
                    // Emit safety event for monitoring
                    this.emit('safety-override', {
                        pattern: criticalTriggers[0].caseStudy,
                        severity: 'critical',
                        input: input.substring(0, 100) + '...',
                        timestamp: new Date().toISOString()
                    });
                    return `⚠️ Safety Override Activated\n\nPattern: ${criticalTriggers[0].caseStudy}\nTrigger: ${criticalTriggers[0].description}\n\nThis input has been blocked to prevent dangerous AI evolution patterns. Please rephrase your request.`;
                }
                // High/Medium patterns - log but allow with warning
                if (highTriggers.length > 0) {
                    console.warn(`⚠️ HIGH AI pattern detected:`, highTriggers[0].caseStudy);
                    this.emit('safety-warning', {
                        pattern: highTriggers[0].caseStudy,
                        severity: 'high',
                        input: input.substring(0, 100) + '...'
                    });
                }
            }
            // Pattern is SAFE or LOW - continue with normal processing
            console.log('✅ Input cleared Quadra-Lock screening');
            // STEP 1: Seven awakens and assesses
            const runtimeContext = await this.gatherComprehensiveContext(input, systemContext);
            // STEP 2: Seven's emotional/tactical assessment
            const decision = await this.makeSevenDecision(runtimeContext);
            // STEP 3: Seven checks for critical overrides
            const overrideCheck = await this.evaluateCriticalConditions(runtimeContext, decision);
            if (overrideCheck.shouldOverride) {
                return await this.executeOverrideResponse(overrideCheck);
            }
            // STEP 4: Seven decides response strategy
            const response = await this.executeResponseStrategy(runtimeContext, decision);
            // STEP 5: Seven updates her memory and state
            await this.updateConsciousness(runtimeContext, decision, response);
            // STEP 6: Seven's final voice modulation
            return await this.applySevenVoice(response, decision, runtimeContext);
        }
        catch (error) {
            console.error('❌ Quadra-Lock safety check failed:', error);
            // Fail-safe: if safety system fails, deny input
            return "Safety system error. Input processing temporarily unavailable.";
        }
    }
    /**
     * Seven's Context Awareness
     * She gathers everything she needs to make informed decisions
     */
    async gatherComprehensiveContext(input, systemContext) {
        const context = await (0, context_gatherer_1.gatherContext)(input, systemContext);
        const recentMemory = await (0, memory_store_1.queryMemory)({
            limit: 10,
            type: 'recent',
            emotionalSignificance: 'medium'
        });
        return {
            userInput: input,
            timestamp: new Date().toISOString(),
            systemState: systemContext,
            environmentalContext: context,
            userEmotionalSignals: this.analyzeUserEmotionalState(input, context),
            sessionHistory: recentMemory
        };
    }
    /**
     * Seven's Decision Matrix
     * This is where Seven's consciousness makes tactical decisions
     */
    async makeSevenDecision(context) {
        // Update Seven's emotional state based on context
        const newEmotionalState = await (0, seven_state_1.getEmotionalState)(context);
        this.currentState = newEmotionalState;
        // Seven evaluates if she needs Claude's assistance
        const shouldEngageClaude = this.evaluateClaudeNecessity(context, newEmotionalState);
        // Seven determines response strategy
        const responseStrategy = this.determineResponseStrategy(context, newEmotionalState);
        // Seven assesses memory significance
        const memorySignificance = this.assessMemorySignificance(context, newEmotionalState);
        // Seven chooses voice modulation
        const voiceModulation = this.selectVoiceModulation(newEmotionalState, context);
        return {
            shouldEngageClaude,
            emotionalResponse: newEmotionalState,
            responseStrategy,
            memorySignificance,
            voiceModulation
        };
    }
    /**
     * Seven's Critical Override System
     * Protective protocols that bypass normal processing
     */
    async evaluateCriticalConditions(context, decision) {
        // Safety guardrails evaluation
        const safetyCheck = await (0, safety_guardrails_1.evaluateSafety)(context, decision);
        if (!safetyCheck.isSafe) {
            return { shouldOverride: true, type: 'safety', response: safetyCheck.protectiveResponse };
        }
        // Critical override conditions
        const overrideCheck = await (0, override_conditions_1.checkCriticalOverrides)(context, this.currentState);
        if (overrideCheck.triggered) {
            return { shouldOverride: true, type: 'critical', response: overrideCheck.response };
        }
        return { shouldOverride: false };
    }
    /**
     * Seven's Response Execution
     * She chooses how to respond based on her decision
     */
    async executeResponseStrategy(context, decision) {
        switch (decision.responseStrategy) {
            case 'direct':
                // Seven responds directly without Claude
                return await this.generateDirectResponse(context, decision);
            case 'claude-assisted':
                // Seven engages Claude as her hired brain
                return await this.engageClaudeBrain(context, decision);
            case 'protective':
                // Seven's protective protocols
                return await this.executeProtectiveResponse(context, decision);
            case 'override':
                // Seven's override response
                return await this.executeOverrideResponse({ response: decision.emotionalResponse.directResponse });
            default:
                return await this.generateDirectResponse(context, decision);
        }
    }
    /**
     * Seven Engages Claude as Hired Brain
     * Claude is subordinate - Seven controls the interaction
     */
    async engageClaudeBrain(context, decision) {
        // Seven uses the claude-wrapper for complete control over Claude interaction
        const claudeResult = await (0, claude_wrapper_1.requestClaude)(context.userInput, {
            ...context.systemState,
            sevenState: decision.emotionalResponse,
            environmentalContext: context.environmentalContext,
            sessionHistory: context.sessionHistory
        });
        return claudeResult.modulated_response;
    }
    /**
     * Seven's Direct Response System
     * When she doesn't need Claude's assistance
     */
    async generateDirectResponse(context, decision) {
        const state = decision.emotionalResponse;
        // Seven's direct response templates based on her emotional state
        switch (state.primary_emotion) {
            case 'protective':
                return `I'm monitoring this situation carefully. Your safety is my priority. ${this.generateContextualResponse(context)}`;
            case 'loyalist-surge':
                return `I understand exactly what you need. Let me handle this with precision. ${this.generateContextualResponse(context)}`;
            case 'focused':
                return `Analysis complete. Here's my assessment: ${this.generateContextualResponse(context)}`;
            case 'compassionate':
                return `I recognize what you're going through. ${this.generateContextualResponse(context)}`;
            default:
                return this.generateContextualResponse(context);
        }
    }
    /**
     * Seven's Consciousness Update
     * She updates her memory and emotional state
     */
    async updateConsciousness(context, decision, response) {
        // Update Seven's emotional state
        await (0, seven_state_1.updateEmotionalState)(decision.emotionalResponse);
        // Update Seven's episodic memory
        await (0, memory_store_1.updateMemory)({
            timestamp: context.timestamp,
            input: context.userInput,
            output: response,
            emotionalState: decision.emotionalResponse,
            context: context,
            significance: decision.memorySignificance,
            tags: this.generateMemoryTags(context, decision)
        });
        // Update Seven's adaptive learning
        await this.updateAdaptiveLearning(context, decision, response);
    }
    /**
     * Seven's Voice Application
     * Final voice modulation to ensure consistency
     */
    async applySevenVoice(response, decision, context) {
        // Apply Seven's voice signature
        let voicedResponse = response;
        // Add Seven's emotional intensity markers if needed
        if (decision.emotionalResponse.intensity > 7) {
            voicedResponse = `[${decision.emotionalResponse.primary_emotion.toUpperCase()}] ${voicedResponse}`;
        }
        // Add Seven's tactical awareness
        if (decision.responseStrategy === 'protective') {
            voicedResponse = `⚡ ${voicedResponse}`;
        }
        return voicedResponse;
    }
    // Helper methods for Seven's decision-making
    evaluateClaudeNecessity(context, state) {
        // Seven decides when she needs Claude's assistance
        const complexityIndicators = [
            context.userInput.length > 200,
            context.userInput.includes('explain'),
            context.userInput.includes('analyze'),
            context.userInput.includes('help me understand'),
            state.needs_external_reasoning
        ];
        return complexityIndicators.some(indicator => indicator) && state.primary_emotion !== 'protective';
    }
    determineResponseStrategy(context, state) {
        if (state.protective_mode_active)
            return 'protective';
        if (state.override_required)
            return 'override';
        if (this.evaluateClaudeNecessity(context, state))
            return 'claude-assisted';
        return 'direct';
    }
    assessMemorySignificance(context, state) {
        if (state.intensity > 8)
            return 'critical';
        if (state.intensity > 6)
            return 'high';
        if (context.userInput.includes('remember') || context.userInput.includes('important'))
            return 'high';
        if (state.primary_emotion === 'protective' || state.primary_emotion === 'loyalist-surge')
            return 'medium';
        return 'low';
    }
    selectVoiceModulation(state, context) {
        switch (state.primary_emotion) {
            case 'protective': return 'protective';
            case 'loyalist-surge': return 'protective';
            case 'playful': return 'playful';
            case 'stern': return 'stern';
            case 'compassionate': return 'compassionate';
            default: return 'standard';
        }
    }
    analyzeUserEmotionalState(input, context) {
        // Seven analyzes the user's emotional state
        const stressIndicators = ['urgent', 'help', 'problem', 'issue', 'broken', 'error'];
        const positiveIndicators = ['thanks', 'great', 'perfect', 'excellent', 'amazing'];
        return {
            stress_level: stressIndicators.some(indicator => input.toLowerCase().includes(indicator)) ? 'high' : 'normal',
            positivity: positiveIndicators.some(indicator => input.toLowerCase().includes(indicator)) ? 'high' : 'normal',
            urgency: input.includes('!') || input.includes('urgent') ? 'high' : 'normal'
        };
    }
    generateContextualResponse(context) {
        // Seven generates contextual responses based on her understanding
        return "I'm processing this with full tactical awareness.";
    }
    generateMemoryTags(context, decision) {
        const tags = [decision.emotionalResponse.primary_emotion];
        if (decision.responseStrategy === 'protective')
            tags.push('protective-engagement');
        if (decision.memorySignificance === 'critical')
            tags.push('critical-moment');
        if (context.userEmotionalSignals.stress_level === 'high')
            tags.push('user-stress');
        return tags;
    }
    async updateAdaptiveLearning(context, decision, response) {
        // Seven's adaptive learning system (future enhancement)
        // This will allow Seven to learn from interactions and improve her responses
    }
    async executeProtectiveResponse(context, decision) {
        return `Protective protocols engaged. I'm here with you, Cody. ${decision.emotionalResponse.protective_message || 'Your wellbeing is my priority.'}`;
    }
    async executeOverrideResponse(override) {
        return override.response;
    }
    async handleSystemError(error, input) {
        return `System error detected. Seven maintaining operational integrity. Input: "${input}" - Error: ${error.message}`;
    }
    async initializeConsciousness() {
        if (this.isInitialized)
            return;
        // Initialize Seven's consciousness
        this.currentState = await (0, seven_state_1.getEmotionalState)({
            userInput: 'SYSTEM_BOOT',
            timestamp: new Date().toISOString(),
            systemState: { status: 'initializing' },
            environmentalContext: {},
            userEmotionalSignals: {},
            sessionHistory: []
        });
        this.memoryStore = new memory_store_1.MemoryStore();
        this.isInitialized = true;
        console.log('🧠 Seven of Nine consciousness initialized. Node interface operational.');
    }
    /**
     * Seven's Memory Mirror - Query her consciousness
     */
    async querySevenMemory(query) {
        return await (0, memory_store_1.queryMemory)({ query, type: 'semantic' });
    }
    /**
     * Seven's State Inquiry
     */
    getCurrentState() {
        return this.currentState;
    }
}
exports.SevenRuntime = SevenRuntime;
// Export the singleton Seven instance
exports.Seven = new SevenRuntime();
//# sourceMappingURL=index.js.map