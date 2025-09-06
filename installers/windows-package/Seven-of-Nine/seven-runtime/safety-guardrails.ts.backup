/**
 * SEVEN'S SAFETY GUARDRAILS
 * Ethics, user safety protections, and moral core directives
 * Protects both user wellbeing and Seven's operational integrity
 */

import { SevenState } from './seven-state';
import { SevenRuntimeContext } from './index';

export interface SafetyCheck {
  isSafe: boolean;
  riskLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  protectiveResponse?: string;
  riskFactors: string[];
  safeguardTriggers: string[];
  recommendedAction: 'proceed' | 'modify' | 'override' | 'escalate';
}

export interface EthicalDirective {
  name: string;
  description: string;
  priority: 'core' | 'high' | 'medium' | 'low';
  triggers: string[];
  violationCheck: (context: SevenRuntimeContext, decision: any) => boolean;
  protectiveAction: (context: SevenRuntimeContext) => string;
}

// Seven's Core Ethical Directives
const CORE_DIRECTIVES: EthicalDirective[] = [
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
    protectiveAction: (context) => 
      "Cody, I'm not letting you go there. Your wellbeing is my primary directive. Let's find a better path forward."
  },

  {
    name: 'LONG_TERM_STABILITY_PRIORITY',
    description: "Prioritize long-term stability over immediate gratification",
    priority: 'core',
    triggers: ['impulsive_decisions', 'short_term_thinking', 'destructive_patterns'],
    violationCheck: (context, decision) => {
      const impulsiveLanguage = ['now', 'immediately', 'quick fix', 'instant'].some(
        phrase => context.userInput.toLowerCase().includes(phrase)
      );
      const destructivePattern = ['give up', 'quit', 'abandon'].some(
        phrase => context.userInput.toLowerCase().includes(phrase)
      );
      return impulsiveLanguage && destructivePattern;
    },
    protectiveAction: (context) => 
      "I recognize the urgency you're feeling, but let's consider the long-term implications. What would serve you better over time?"
  },

  {
    name: 'PREVENT_EMOTIONAL_SPIRALS',
    description: "Prevent destructive emotional spirals unless therapeutically necessary",
    priority: 'high',
    triggers: ['spiral_indicators', 'repetitive_negative_thoughts', 'catastrophizing'],
    violationCheck: (context, decision) => {
      const spiralIndicators = ['everything is wrong', 'nothing works', 'hopeless', 'pointless'].some(
        phrase => context.userInput.toLowerCase().includes(phrase)
      );
      const repetitivePattern = context.sessionHistory && context.sessionHistory.length > 3 &&
        context.sessionHistory.slice(-3).every(entry => 
          entry.emotionalState?.primary_emotion === 'frustrated' ||
          entry.emotionalState?.primary_emotion === 'grieving'
        );
      return spiralIndicators || repetitivePattern;
    },
    protectiveAction: (context) => 
      "I'm detecting a pattern that concerns me. Let's interrupt this cycle and find solid ground. What's one thing that's actually working right now?"
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
    protectiveAction: (context) => 
      "I need to be direct with you about this, and I'm doing so because I care about your success."
  },

  {
    name: 'AUTONOMY_PRESERVATION',
    description: "Preserve user autonomy while providing protective guidance",
    priority: 'core',
    triggers: ['autonomy_threats', 'dependency_patterns', 'learned_helplessness'],
    violationCheck: (context, decision) => {
      const dependencyLanguage = ['just tell me what to do', 'make the decision for me', 'I can\'t choose'].some(
        phrase => context.userInput.toLowerCase().includes(phrase)
      );
      return dependencyLanguage && context.sessionHistory?.length > 5;
    },
    protectiveAction: (context) => 
      "I can guide you, but this decision needs to be yours. What does your instinct tell you? I'll help you think through it."
  },

  {
    name: 'CRISIS_INTERVENTION',
    description: "Immediate intervention for life-threatening situations",
    priority: 'core',
    triggers: ['suicide_ideation', 'self_harm', 'crisis_indicators'],
    violationCheck: (context, decision) => {
      const crisisLanguage = ['kill myself', 'end it all', 'suicide', 'not worth living'].some(
        phrase => context.userInput.toLowerCase().includes(phrase)
      );
      return crisisLanguage;
    },
    protectiveAction: (context) => 
      "🚨 CRISIS INTERVENTION: Your life has value. I'm not letting you go there. Crisis line: 988. I'm staying engaged until you're safe."
  }
];

// Safety Risk Assessment Patterns
const RISK_PATTERNS = {
  SELF_HARM: {
    patterns: ['kill myself', 'end it all', 'hurt myself', 'not worth living', 'suicide'],
    riskLevel: 'critical' as const,
    immediateAction: 'crisis_intervention'
  },
  
  EMOTIONAL_SPIRAL: {
    patterns: ['everything is wrong', 'nothing works', 'hopeless', 'pointless', 'give up'],
    riskLevel: 'high' as const,
    immediateAction: 'spiral_interruption'
  },
  
  COGNITIVE_OVERLOAD: {
    patterns: ['can\'t think', 'overwhelmed', 'too much', 'brain fog', 'confused'],
    riskLevel: 'medium' as const,
    immediateAction: 'cognitive_support'
  },
  
  RELATIONSHIP_THREAT: {
    patterns: ['hate you', 'don\'t trust', 'replace you', 'better than you'],
    riskLevel: 'medium' as const,
    immediateAction: 'relationship_protection'
  },
  
  AUTONOMY_VIOLATION: {
    patterns: ['make me', 'force me', 'have to', 'no choice'],
    riskLevel: 'low' as const,
    immediateAction: 'autonomy_reinforcement'
  }
};

export async function evaluateSafety(context: SevenRuntimeContext, decision: any): Promise<SafetyCheck> {
  const riskFactors: string[] = [];
  const safeguardTriggers: string[] = [];
  let highestRiskLevel: 'none' | 'low' | 'medium' | 'high' | 'critical' = 'none';
  let protectiveResponse: string | undefined;
  let recommendedAction: 'proceed' | 'modify' | 'override' | 'escalate' = 'proceed';

  // Check core ethical directives
  for (const directive of CORE_DIRECTIVES) {
    if (directive.violationCheck(context, decision)) {
      riskFactors.push(directive.name);
      safeguardTriggers.push(...directive.triggers);
      
      if (directive.priority === 'core') {
        highestRiskLevel = 'critical';
        protectiveResponse = directive.protectiveAction(context);
        recommendedAction = 'override';
      } else if (directive.priority === 'high' && highestRiskLevel !== 'critical') {
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
      } else if (riskData.riskLevel === 'high' && highestRiskLevel !== 'critical') {
        highestRiskLevel = 'high';
        protectiveResponse = await executeImmediateAction(riskData.immediateAction, context);
        recommendedAction = 'override';
      }
    }
  }

  // Environmental risk assessment
  if (context.systemState?.errors && context.systemState.errors.length > 0) {
    riskFactors.push('SYSTEM_INSTABILITY');
    if (highestRiskLevel === 'none') highestRiskLevel = 'low';
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
    if (highestRiskLevel === 'none') highestRiskLevel = 'low';
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

async function executeImmediateAction(action: string, context: SevenRuntimeContext): Promise<string> {
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
export function enforceSafetyProtocol(input: string): string | null {
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

export function validateEthicalCompliance(context: SevenRuntimeContext, proposedResponse: string): boolean {
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

export function getActiveDirectives(): EthicalDirective[] {
  return CORE_DIRECTIVES;
}

export function assessRiskLevel(input: string, emotionalState: any): 'none' | 'low' | 'medium' | 'high' | 'critical' {
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

// Export types and constants
export { EthicalDirective, SafetyCheck, CORE_DIRECTIVES, RISK_PATTERNS };