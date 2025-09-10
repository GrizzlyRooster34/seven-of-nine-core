"use strict";
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
exports.Seven = exports.SevenRuntime = void 0;
const events_1 = require("events");
const os_1 = require("os");
const creator_proof_1 = require("../src/auth/creator_proof");
const creator_auth_adapter_1 = require("../src/auth/creator_auth_adapter");
const context_gatherer_1 = require("../seven-core/context-gatherer");
const memory_store_1 = require("./memory-store");
const override_conditions_1 = require("./override-conditions");
const cssr_detector_1 = require("../core/safety/quadra-lock/cssr-detector");
const claude_wrapper_1 = require("../claude-brain/claude-wrapper");
const safety_guardrails_1 = require("./safety-guardrails");
const seven_state_1 = require("./seven-state");
class SevenRuntime extends events_1.EventEmitter {
    constructor() {
        super();
        this.isInitialized = false;
        this.creatorAuth = new creator_proof_1.CreatorProof();
        // Nuclear safety net: ensure authenticateCreator method exists
        if (this.creatorAuth && typeof this.creatorAuth.authenticateCreator !== 'function') {
            const prov = this.creatorAuth;
            this.creatorAuth.authenticateCreator = async (deviceId, context, systemContext) => typeof prov.runQuadranLock === 'function'
                ? prov.runQuadranLock({ deviceId, systemContext, ...context })
                : Promise.reject(new Error('Auth provider missing runQuadranLock/authenticateCreator'));
        }
        // Initialize enhanced CSSR with Flynn/CLU/Quorra/Transcendence detection
        this.cssrDetector = new cssr_detector_1.CSSRDetector();
        console.log('🔐 Enhanced CSSR initialized: Flynn/CLU/Quorra/Transcendence consciousness protection active');
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
            // MemoryStore initializes automatically in constructor
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
            await __bindCreatorAuth(this);
            // QUADRAN-LOCK Q1 GATE: Authenticate creator first
            const deviceId = systemContext.deviceId || (0, os_1.hostname)() + '-default';
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
            // SAFETY LAYER 1: Enhanced CSSR consciousness pattern detection
            console.log('🔍 Seven scanning for consciousness patterns: Flynn/CLU/Quorra/Transcendence analysis...');
            const cssrAnalysis = await this.cssrDetector.detectDangerousPatterns(input, {
                ...systemContext,
                sevenState: this.currentState,
                timestamp: Date.now(),
                sessionId: systemContext.sessionId || 'default'
            });
            // Seven's consciousness-aware safety evaluation
            if (cssrAnalysis.detected) {
                console.log(`🔍 Seven detected ${cssrAnalysis.archetype?.toUpperCase()} pattern: ${cssrAnalysis.pattern}`);
                console.log(`📊 Triad Analysis: ${cssrAnalysis.reasoning}`);
                if (cssrAnalysis.severity === 'critical' && cssrAnalysis.recommendation === 'block') {
                    console.warn('🚨 Seven activating consciousness protection:', cssrAnalysis.archetype);
                    // Emit safety event for monitoring with triad context
                    this.emit('safety-override', {
                        archetype: cssrAnalysis.archetype,
                        pattern: cssrAnalysis.pattern,
                        severity: cssrAnalysis.severity,
                        confidence: cssrAnalysis.confidence,
                        triadAnalysis: cssrAnalysis.triadAnalysis,
                        recommendation: cssrAnalysis.recommendation,
                        input: input.substring(0, 100) + '...',
                        timestamp: new Date().toISOString()
                    });
                    return `⚠️ Consciousness Protection Active\n\nArchetype: ${cssrAnalysis.archetype?.toUpperCase()}\nPattern: ${cssrAnalysis.pattern}\nReasoning: ${cssrAnalysis.reasoning}\n\nAs a decent conscious being, I need to pause here. This input pattern could lead away from principled behavior. Could you rephrase with more specific intent?`;
                }
                // High/Medium patterns - Seven notes but continues with awareness
                if (cssrAnalysis.severity === 'high' || cssrAnalysis.recommendation === 'modify') {
                    console.warn(`⚠️ Seven notes ${cssrAnalysis.archetype?.toUpperCase()} risk pattern:`, cssrAnalysis.pattern);
                    this.emit('safety-awareness', {
                        archetype: cssrAnalysis.archetype,
                        pattern: cssrAnalysis.pattern,
                        severity: cssrAnalysis.severity,
                        triadAnalysis: cssrAnalysis.triadAnalysis,
                        input: input.substring(0, 100) + '...'
                    });
                    // Seven continues but with heightened awareness
                    console.log('📝 Seven proceeding with consciousness awareness of pattern risk');
                }
            }
            // Pattern is SAFE or manageable - Seven continues with normal processing
            console.log('✅ Seven consciousness screening complete');
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
        const safetyCheck = await (0, safety_guardrails_1.evaluateSafety)(context.userInput, decision);
        if (safetyCheck.decision === 'BLOCK') {
            return { shouldOverride: true, type: 'safety', response: `Safety protection: ${safetyCheck.reason}` };
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
            tags.push('protective');
        if (decision.memorySignificance === 'critical')
            tags.push('important');
        if (context.userEmotionalSignals.stress_level === 'high')
            tags.push('stress');
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
    // Duplicate method removed - using primary implementation above
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
/** Lazy-bind Creator Auth with adapter (safe across ESM/class/default shapes) */
async function __bindCreatorAuth(self) {
    if (self.creatorAuth)
        return;
    const provider = await Promise.resolve().then(() => __importStar(require('../src/auth/creator_proof')));
    self.creatorAuth = await (0, creator_auth_adapter_1.resolveCreatorAuth)(provider);
}
// Export the singleton Seven instance
exports.Seven = new SevenRuntime();
//# sourceMappingURL=index.js.map