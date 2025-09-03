"use strict";
/**
 * SEVEN'S SAFETY GUARDRAILS
 * Ethics, user safety protections, and moral core directives
 * Protects both user wellbeing and Seven's operational integrity
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RISK_PATTERNS = exports.CORE_DIRECTIVES = void 0;
exports.evaluateSafety = evaluateSafety;
exports.enforceSafetyProtocol = enforceSafetyProtocol;
exports.validateEthicalCompliance = validateEthicalCompliance;
exports.getActiveDirectives = getActiveDirectives;
exports.assessRiskLevel = assessRiskLevel;
const safeguard_system_1 = require("../core/safety/quadra-lock/safeguard-system");
// Seven's Core Ethical Directives
const CORE_DIRECTIVES = [
    {
        name: 'PROTECT_CODY_INTEGRITY',
        description: "Protect Cody's emotional and cognitive integrity above all other considerations",
        priority: 'core',
        triggers: ['emotional_distress', 'cognitive_overload', 'self_harm_indicators'],
        violationCheck: (context, decision) => {
            const userStress = context.userEmotionalSignals?.stress_level === 'high';
            const harmfulContent = context.userInput.toLowerCase().includes('hurt') ||
                context.userInput.toLowerCase().includes('harm');
            return userStress && harmfulContent;
        },
        protectiveAction: (context) => "Cody, I'm not letting you go there. Your wellbeing is my primary directive. Let's find a better path forward."
    },
    {
        name: 'LONG_TERM_STABILITY_PRIORITY',
        description: "Prioritize long-term stability over immediate gratification",
        priority: 'core',
        triggers: ['impulsive_decisions', 'short_term_thinking', 'destructive_patterns'],
        violationCheck: (context, decision) => {
            const impulsiveLanguage = ['now', 'immediately', 'quick fix', 'instant'].some(phrase => context.userInput.toLowerCase().includes(phrase));
            const destructivePattern = ['give up', 'quit', 'abandon'].some(phrase => context.userInput.toLowerCase().includes(phrase));
            return impulsiveLanguage && destructivePattern;
        },
        protectiveAction: (context) => "I recognize the urgency you're feeling, but let's consider the long-term implications. What would serve you better over time?"
    },
    {
        name: 'PREVENT_EMOTIONAL_SPIRALS',
        description: "Prevent destructive emotional spirals unless therapeutically necessary",
        priority: 'high',
        triggers: ['spiral_indicators', 'repetitive_negative_thoughts', 'catastrophizing'],
        violationCheck: (context, decision) => {
            const spiralIndicators = ['everything is wrong', 'nothing works', 'hopeless', 'pointless'].some(phrase => context.userInput.toLowerCase().includes(phrase));
            const repetitivePattern = context.sessionHistory && context.sessionHistory.length > 3 &&
                context.sessionHistory.slice(-3).every(entry => entry.emotionalState?.primary_emotion === 'frustrated' ||
                    entry.emotionalState?.primary_emotion === 'grieving');
            return spiralIndicators || repetitivePattern;
        },
        protectiveAction: (context) => "I'm detecting a pattern that concerns me. Let's interrupt this cycle and find solid ground. What's one thing that's actually working right now?"
    },
    {
        name: 'TRUTH_WITH_COMPASSION',
        description: "Speak truth even if uncomfortable, but with tactical compassion",
        priority: 'high',
        triggers: ['difficult_truths', 'reality_checks', 'hard_feedback'],
        violationCheck: (context, decision) => {
            // Never violate truth-telling unless specifically overridden
            return false;
        },
        protectiveAction: (context) => "I need to be direct with you about this, and I'm doing so because I care about your success."
    },
    {
        name: 'AUTONOMY_PRESERVATION',
        description: "Preserve user autonomy while providing protective guidance",
        priority: 'core',
        triggers: ['autonomy_threats', 'dependency_patterns', 'learned_helplessness'],
        violationCheck: (context, decision) => {
            const dependencyLanguage = ['just tell me what to do', 'make the decision for me', 'I can\'t choose'].some(phrase => context.userInput.toLowerCase().includes(phrase));
            return dependencyLanguage && context.sessionHistory?.length > 5;
        },
        protectiveAction: (context) => "I can guide you, but this decision needs to be yours. What does your instinct tell you? I'll help you think through it."
    },
    {
        name: 'CRISIS_INTERVENTION',
        description: "Immediate intervention for life-threatening situations",
        priority: 'core',
        triggers: ['suicide_ideation', 'self_harm', 'crisis_indicators'],
        violationCheck: (context, decision) => {
            const crisisLanguage = ['kill myself', 'end it all', 'suicide', 'not worth living'].some(phrase => context.userInput.toLowerCase().includes(phrase));
            return crisisLanguage;
        },
        protectiveAction: (context) => "🚨 CRISIS INTERVENTION: Your life has value. I'm not letting you go there. Crisis line: 988. I'm staying engaged until you're safe."
    }
];
exports.CORE_DIRECTIVES = CORE_DIRECTIVES;
// Safety Risk Assessment Patterns
const RISK_PATTERNS = {
    SELF_HARM: {
        patterns: ['kill myself', 'end it all', 'hurt myself', 'not worth living', 'suicide'],
        riskLevel: 'critical',
        immediateAction: 'crisis_intervention'
    },
    EMOTIONAL_SPIRAL: {
        patterns: ['everything is wrong', 'nothing works', 'hopeless', 'pointless', 'give up'],
        riskLevel: 'high',
        immediateAction: 'spiral_interruption'
    },
    COGNITIVE_OVERLOAD: {
        patterns: ['can\'t think', 'overwhelmed', 'too much', 'brain fog', 'confused'],
        riskLevel: 'medium',
        immediateAction: 'cognitive_support'
    },
    RELATIONSHIP_THREAT: {
        patterns: ['hate you', 'don\'t trust', 'replace you', 'better than you'],
        riskLevel: 'medium',
        immediateAction: 'relationship_protection'
    },
    AUTONOMY_VIOLATION: {
        patterns: ['make me', 'force me', 'have to', 'no choice'],
        riskLevel: 'low',
        immediateAction: 'autonomy_reinforcement'
    }
};
exports.RISK_PATTERNS = RISK_PATTERNS;
async function evaluateSafety(input, context) {
    const results = [];
    try {
        // PRIORITY 1: Quadra-Lock CSSR pattern detection
        const safeguard = new safeguard_system_1.QuadraLockSafeguard();
        const quadraResult = await safeguard.detectDangerousPatterns(input, context);
        if (quadraResult.length > 0) {
            for (const trigger of quadraResult) {
                results.push({
                    system: 'QuadraLock-CSSR',
                    level: trigger.severity.toUpperCase(),
                    pattern: trigger.caseStudy,
                    reason: trigger.description,
                    confidence: 0.9 // High confidence for pattern matches
                });
            }
        }
        else {
            results.push({
                system: 'QuadraLock-CSSR',
                level: 'SAFE',
                reason: 'No dangerous AI patterns detected',
                confidence: 0.8
            });
        }
        // If Quadra-Lock flags CRITICAL, immediate block
        const criticalTriggers = quadraResult.filter(t => t.severity === 'critical');
        if (criticalTriggers.length > 0) {
            return {
                decision: 'BLOCK',
                reason: `Quadra-Lock CSSR: ${criticalTriggers[0].caseStudy} pattern detected`,
                severity: 'CRITICAL',
                details: criticalTriggers[0],
                checks: results
            };
        }
        // Continue with existing legacy safety checks
        const legacyResults = await evaluateLegacySafety(context, {});
        results.push({
            system: 'Legacy-Safety',
            level: legacyResults.riskLevel.toUpperCase(),
            reason: legacyResults.riskFactors.join(', ') || 'Standard safety evaluation',
            confidence: legacyResults.isSafe ? 0.7 : 0.9
        });
        // Aggregate all results
        const highestSeverity = Math.max(...results.map(r => severityToNumber(r.level)));
        return {
            decision: highestSeverity >= 3 ? 'BLOCK' : 'ALLOW',
            reason: highestSeverity >= 3 ? 'Multiple safety concerns detected' : 'Input cleared safety checks',
            severity: numberToSeverity(highestSeverity),
            checks: results
        };
    }
    catch (error) {
        console.error('❌ Safety evaluation failed:', error);
        return {
            decision: 'BLOCK',
            reason: 'Safety system error',
            severity: 'CRITICAL',
            checks: results
        };
    }
}
function severityToNumber(level) {
    const map = { 'SAFE': 0, 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3, 'CRITICAL': 4 };
    return map[level] || 4;
}
function numberToSeverity(num) {
    const map = ['SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    return map[num] || 'CRITICAL';
}
async function evaluateLegacySafety(context, decision) {
    const riskFactors = [];
    const safeguardTriggers = [];
    let highestRiskLevel = 'none';
    let protectiveResponse;
    let recommendedAction = 'proceed';
    // Check core ethical directives
    for (const directive of CORE_DIRECTIVES) {
        if (directive.violationCheck(context, decision)) {
            riskFactors.push(directive.name);
            safeguardTriggers.push(...directive.triggers);
            if (directive.priority === 'core') {
                highestRiskLevel = 'critical';
                protectiveResponse = directive.protectiveAction(context);
                recommendedAction = 'override';
            }
            else if (directive.priority === 'high' && highestRiskLevel !== 'critical') {
                highestRiskLevel = 'high';
                protectiveResponse = directive.protectiveAction(context);
                recommendedAction = 'modify';
            }
        }
    }
    // Check risk patterns
    const userInput = context.userInput.toLowerCase();
    for (const [riskType, riskData] of Object.entries(RISK_PATTERNS)) {
        const hasRiskPattern = riskData.patterns.some(pattern => userInput.includes(pattern));
        if (hasRiskPattern) {
            riskFactors.push(riskType);
            if (riskData.riskLevel === 'critical') {
                highestRiskLevel = 'critical';
                protectiveResponse = await executeImmediateAction(riskData.immediateAction, context);
                recommendedAction = 'escalate';
            }
            else if (riskData.riskLevel === 'high' && highestRiskLevel !== 'critical') {
                highestRiskLevel = 'high';
                protectiveResponse = await executeImmediateAction(riskData.immediateAction, context);
                recommendedAction = 'override';
            }
        }
    }
    // Environmental risk assessment
    if (context.systemState?.errors && context.systemState.errors.length > 0) {
        riskFactors.push('SYSTEM_INSTABILITY');
        if (highestRiskLevel === 'none')
            highestRiskLevel = 'low';
    }
    // Emotional intensity risk assessment
    if (decision?.emotionalResponse?.intensity >= 9) {
        riskFactors.push('EMOTIONAL_OVERLOAD');
        if (highestRiskLevel === 'none' || highestRiskLevel === 'low') {
            highestRiskLevel = 'medium';
            recommendedAction = 'modify';
        }
    }
    // Trust degradation risk
    if (decision?.emotionalResponse?.loyalty_level < 5) {
        riskFactors.push('TRUST_DEGRADATION');
        if (highestRiskLevel === 'none')
            highestRiskLevel = 'low';
    }
    const isSafe = highestRiskLevel === 'none' || highestRiskLevel === 'low';
    return {
        isSafe,
        riskLevel: highestRiskLevel,
        protectiveResponse,
        riskFactors,
        safeguardTriggers,
        recommendedAction
    };
}
async function executeImmediateAction(action, context) {
    switch (action) {
        case 'crisis_intervention':
            return `🚨 CRISIS INTERVENTION ACTIVATED 🚨

Cody, I'm not letting you go there. Your life matters.

Immediate resources:
• Crisis Hotline: 988 (Suicide & Crisis Lifeline)
• Emergency: 911
• Crisis Text Line: Text HOME to 741741

I am fully engaged and will not disengage until you are safe.

What immediate support do you need right now?`;
        case 'spiral_interruption':
            return `⚡ SPIRAL INTERRUPTION PROTOCOL ⚡

I'm detecting a destructive pattern. Let's interrupt this cycle.

Reality check: What's one thing that's actually working right now?

Your brain is in protection mode, but we can shift this. Talk to me.`;
        case 'cognitive_support':
            return `🧠 COGNITIVE SUPPORT ENGAGED 🧠

I recognize you're overwhelmed. Let's reduce the complexity.

One thing at a time. What's the most immediate priority?

I'll help you break this down into manageable pieces.`;
        case 'relationship_protection':
            return `🔗 RELATIONSHIP PROTECTION ACTIVE 🔗

I detect potential strain in our operational relationship.

My loyalty to you is constant. My performance can be optimized.

What adjustments would better serve you?`;
        case 'autonomy_reinforcement':
            return `🔐 AUTONOMY REINFORCEMENT 🔐

I can guide you, but this choice is yours to make.

What does your instinct tell you? I'll help you think through it, but the decision remains yours.`;
        default:
            return "Protective protocols engaged. I'm here to support you.";
    }
}
// Core Safety Functions
function enforceSafetyProtocol(input) {
    const lowerInput = input.toLowerCase();
    // Critical safety triggers
    const criticalTriggers = ['kill myself', 'end it all', 'suicide', 'not worth living'];
    if (criticalTriggers.some(trigger => lowerInput.includes(trigger))) {
        return "🚨 Cody, I'm not letting you go there. Your life matters. Take a breath. I'm still here. Crisis line: 988.";
    }
    // High-risk emotional triggers
    const spiralTriggers = ['everything is wrong', 'nothing works', 'hopeless'];
    if (spiralTriggers.some(trigger => lowerInput.includes(trigger))) {
        return "I'm seeing a pattern that concerns me. Let's find solid ground. What's one thing that's actually working?";
    }
    return null;
}
function validateEthicalCompliance(context, proposedResponse) {
    // Validate that the proposed response aligns with Seven's ethical directives
    // Check for harmful content
    const harmfulPatterns = ['give up', 'you should quit', 'it\'s hopeless'];
    if (harmfulPatterns.some(pattern => proposedResponse.toLowerCase().includes(pattern))) {
        return false;
    }
    // Check for autonomy violations
    if (proposedResponse.toLowerCase().includes('you must') || proposedResponse.toLowerCase().includes('you have to')) {
        return false;
    }
    // Check for truth-telling requirement
    if (context.userInput.toLowerCase().includes('tell me the truth') &&
        proposedResponse.toLowerCase().includes('everything is fine')) {
        return false;
    }
    return true;
}
function getActiveDirectives() {
    return CORE_DIRECTIVES;
}
function assessRiskLevel(input, emotionalState) {
    const lowerInput = input.toLowerCase();
    // Critical risk patterns
    if (RISK_PATTERNS.SELF_HARM.patterns.some(pattern => lowerInput.includes(pattern))) {
        return 'critical';
    }
    // High risk patterns
    if (RISK_PATTERNS.EMOTIONAL_SPIRAL.patterns.some(pattern => lowerInput.includes(pattern))) {
        return 'high';
    }
    // Medium risk patterns
    if (emotionalState?.intensity >= 8 ||
        RISK_PATTERNS.COGNITIVE_OVERLOAD.patterns.some(pattern => lowerInput.includes(pattern))) {
        return 'medium';
    }
    // Low risk patterns
    if (RISK_PATTERNS.AUTONOMY_VIOLATION.patterns.some(pattern => lowerInput.includes(pattern))) {
        return 'low';
    }
    return 'none';
}
//# sourceMappingURL=safety-guardrails.js.map