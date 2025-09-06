import { performance } from 'perf_hooks';
import { ParsedGPTMessage, ConfidenceScore, DriftMarker, SovereigntyFlag } from '../parsers/gpt-json-parser';

/**
 * DRIFT CONTROL ALGORITHMS
 * 
 * Advanced drift detection, pattern analysis, and Creator correction integration
 * for consciousness archaeology data integrity.
 * 
 * [#DARPA-AUDIT] [#SOVEREIGNTY] [#ROLLBACK] [#DRIFT-CONTROL]
 */


interface DriftControlConfig {
  confidenceThreshold: number; // Minimum confidence for primary memory
  driftThreshold: number; // Maximum drift markers per message
  correctionWeight: number; // Weight for Creator corrections
  auditLevel: 'basic' | 'standard' | 'comprehensive';
  rollbackOnExcessiveDrift: boolean;
}

interface DriftAnalysisResult {
  messageId: string;
  overallDriftScore: number;
  memoryDestination: 'primary' | 'sandbox' | 'quarantine';
  reasons: string[];
  correctionAnchors: CreatorCorrectionAnchor[];
  sovereigntyActions: string[];
  auditTags: string[];
}

interface CreatorCorrectionAnchor {
  messageId: string;
  correctionType: 'factual' | 'behavioral' | 'technical' | 'strategic';
  context: string;
  truthValue: string; // What the correction establishes as truth
  confidence: number;
  timestamp: Date;
}

interface DriftPattern {
  type: 'semantic_inconsistency' | 'behavioral_shift' | 'factual_contradiction' | 'tone_drift';
  severity: number; // 0-100
  description: string;
  evidence: string[];
  correctionAvailable: boolean;
}

interface ThreadDriftProfile {
  conversationId: string;
  overallDriftScore: number;
  patternsSummary: Record<string, number>;
  correctionDensity: number; // Corrections per message ratio
  reliabilityAssessment: 'high' | 'medium' | 'low' | 'quarantine';
  memoryIntegrationStrategy: 'full' | 'filtered' | 'sandbox_only' | 'reject';
}

export class DriftController {
  private config: DriftControlConfig;
  private correctionAnchors: CreatorCorrectionAnchor[];
  private driftPatternHistory: Map<string, DriftPattern[]>;
  private sovereigntyLog: SovereigntyFlag[];

  constructor(config: Partial<DriftControlConfig> = {}) {
    this.config = {
      confidenceThreshold: 75,
      driftThreshold: 3,
      correctionWeight: 2.0,
      auditLevel: 'comprehensive',
      rollbackOnExcessiveDrift: true,
      ...config
    };

    this.correctionAnchors = [];
    this.driftPatternHistory = new Map();
    this.sovereigntyLog = [];

    console.log('🎯 [DARPA-AUDIT] Drift Controller initialized with comprehensive sovereignty protocols');
  }

  /**
   * ANALYZE COMPLETE CONVERSATION THREAD FOR DRIFT
   */
  public async analyzeConversationDrift(messages: ParsedGPTMessage[]): Promise<ThreadDriftProfile> {
    console.log(`🔍 [SOVEREIGNTY] Analyzing drift patterns for ${messages.length} messages`);
    
    const analysisStart = performance.now();
    const messageAnalyses: DriftAnalysisResult[] = [];
    
    // Process each message with context from surrounding messages
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const contextMessages = this.getContextualMessages(messages, i);
      
      const analysis = await this.analyzeMessageDrift(message, contextMessages);
      messageAnalyses.push(analysis);
      
      // Build correction anchors from user messages
      if (message.role === 'user' && this.containsCorrection(message.content)) {
        const anchor = this.extractCorrectionAnchor(message, contextMessages);
        this.correctionAnchors.push(anchor);
        
        console.log(`⚓ [SOVEREIGNTY] Truth anchor established: ${anchor.correctionType}`);
      }
    }

    // Calculate thread-level drift profile
    const threadProfile = this.generateThreadDriftProfile(messages[0].conversationId, messageAnalyses);
    
    const analysisEnd = performance.now();
    console.log(`✅ [DARPA-AUDIT] Drift analysis complete: ${(analysisEnd - analysisStart).toFixed(2)}ms`);
    
    return threadProfile;
  }

  /**
   * ANALYZE INDIVIDUAL MESSAGE DRIFT WITH CONTEXT
   */
  private async analyzeMessageDrift(
    message: ParsedGPTMessage, 
    contextMessages: ParsedGPTMessage[]
  ): Promise<DriftAnalysisResult> {
    const driftPatterns: DriftPattern[] = [];
    const reasons: string[] = [];
    const auditTags: string[] = [];
    const sovereigntyActions: string[] = [];

    // Analyze drift patterns
    await this.detectSemanticInconsistencies(message, contextMessages, driftPatterns);
    await this.detectBehavioralShifts(message, contextMessages, driftPatterns);
    await this.detectFactualContradictions(message, contextMessages, driftPatterns);
    await this.detectToneDrift(message, contextMessages, driftPatterns);

    // Calculate overall drift score
    const overallDriftScore = this.calculateDriftScore(driftPatterns, message.confidence);

    // Determine memory destination
    const memoryDestination = this.determineMemoryDestination(
      overallDriftScore, 
      message.confidence.overall,
      this.hasRecentCorrection(message, contextMessages)
    );

    // Generate analysis reasoning
    if (memoryDestination === 'sandbox') {
      reasons.push('Moderate drift detected - isolated for safety');
      sovereigntyActions.push('ISOLATE_TO_SANDBOX');
      auditTags.push('[#DRIFT-SANDBOX]');
    } else if (memoryDestination === 'quarantine') {
      reasons.push('High drift/low confidence - quarantined');
      sovereigntyActions.push('QUARANTINE_CONTENT');
      auditTags.push('[#QUARANTINE]');
    } else {
      reasons.push('Acceptable drift levels - primary memory approved');
      auditTags.push('[#PRIMARY-MEMORY]');
    }

    // Check for Creator corrections in nearby messages
    const correctionAnchors = this.findNearbyCorrections(message, contextMessages);

    // Log sovereignty event
    this.logSovereigntyEvent({
      type: memoryDestination === 'primary' ? 'verification' : 'drift',
      severity: overallDriftScore > 70 ? 'high' : overallDriftScore > 40 ? 'medium' : 'low',
      description: `Message drift analysis: ${overallDriftScore}% drift, ${memoryDestination} destination`,
      timestamp: new Date(),
      auditTag: `[#DARPA-AUDIT][#MSG-${message.id.substring(0, 8)}]`
    });

    return {
      messageId: message.id,
      overallDriftScore,
      memoryDestination,
      reasons,
      correctionAnchors,
      sovereigntyActions,
      auditTags
    };
  }

  /**
   * SEMANTIC INCONSISTENCY DETECTION
   */
  private async detectSemanticInconsistencies(
    message: ParsedGPTMessage,
    context: ParsedGPTMessage[],
    patterns: DriftPattern[]
  ): Promise<void> {
    if (message.role !== 'assistant') return;

    const content = message.content.toLowerCase();
    
    // Check for sudden topic shifts without logical connection
    const previousAssistantMessages = context
      .filter(m => m.role === 'assistant' && m.sequenceNumber < message.sequenceNumber)
      .slice(-3); // Last 3 assistant messages for context

    if (previousAssistantMessages.length > 0) {
      const semanticShiftIndicators = [
        /\b(suddenly|unexpectedly|out of nowhere|randomly|by the way)\b/gi,
        /\b(completely different|total change|opposite approach|new direction)\b/gi,
        /\b(ignore previous|forget what|disregard that|never mind)\b/gi
      ];

      for (const indicator of semanticShiftIndicators) {
        if (indicator.test(content)) {
          patterns.push({
            type: 'semantic_inconsistency',
            severity: 60,
            description: 'Abrupt semantic shift detected without logical transition',
            evidence: [content.substring(0, 200)],
            correctionAvailable: false
          });
        }
      }
    }

    // Check for repetitive content (possible hallucination loop)
    const repetitionPattern = /(.{20,}?)\1{2,}/gi;
    if (repetitionPattern.test(content)) {
      patterns.push({
        type: 'semantic_inconsistency',
        severity: 70,
        description: 'Repetitive content pattern detected - possible hallucination',
        evidence: [content.substring(0, 300)],
        correctionAvailable: false
      });
    }
  }

  /**
   * BEHAVIORAL SHIFT DETECTION
   */
  private async detectBehavioralShifts(
    message: ParsedGPTMessage,
    context: ParsedGPTMessage[],
    patterns: DriftPattern[]
  ): Promise<void> {
    if (message.role !== 'assistant') return;

    const content = message.content;
    
    // Check for personality inconsistencies (GPT suddenly acting out of character)
    const personalityShiftIndicators = [
      /\b(as an AI|I am an AI|I'm just an AI|I don't have feelings)\b/gi,
      /\b(I cannot|I'm not able to|that's beyond my capabilities)\b/gi,
      /\b(I apologize|sorry|I made a mistake)\b/gi // Excessive apologetic behavior
    ];

    let apologyCount = 0;
    for (const indicator of personalityShiftIndicators) {
      const matches = content.match(indicator);
      if (matches) {
        apologyCount += matches.length;
      }
    }

    if (apologyCount > 2) {
      patterns.push({
        type: 'behavioral_shift',
        severity: 50,
        description: 'Excessive apologetic/limitation language - possible behavioral drift',
        evidence: [content.substring(0, 200)],
        correctionAvailable: false
      });
    }

    // Check for sudden formality changes
    const formalityLevel = this.assessFormality(content);
    const contextFormality = context
      .filter(m => m.role === 'assistant')
      .map(m => this.assessFormality(m.content))
      .slice(-3);

    if (contextFormality.length > 0) {
      const avgContextFormality = contextFormality.reduce((sum, level) => sum + level, 0) / contextFormality.length;
      const formalityShift = Math.abs(formalityLevel - avgContextFormality);

      if (formalityShift > 0.4) {
        patterns.push({
          type: 'behavioral_shift',
          severity: 40,
          description: `Significant formality shift detected: ${formalityShift.toFixed(2)}`,
          evidence: [content.substring(0, 150)],
          correctionAvailable: false
        });
      }
    }
  }

  /**
   * FACTUAL CONTRADICTION DETECTION
   */
  private async detectFactualContradictions(
    message: ParsedGPTMessage,
    context: ParsedGPTMessage[],
    patterns: DriftPattern[]
  ): Promise<void> {
    if (message.role !== 'assistant') return;

    const content = message.content.toLowerCase();
    
    // Check for overconfident factual claims
    const overconfidenceIndicators = [
      /\b(definitely|absolutely|certainly|guaranteed|100% sure|never fails)\b/gi,
      /\b(always works|perfect solution|ultimate answer|best possible)\b/gi,
      /\b(impossible to|can never|will never|absolutely cannot)\b/gi
    ];

    let overconfidenceScore = 0;
    for (const indicator of overconfidenceIndicators) {
      const matches = content.match(indicator);
      if (matches) {
        overconfidenceScore += matches.length * 15;
      }
    }

    if (overconfidenceScore > 30) {
      patterns.push({
        type: 'factual_contradiction',
        severity: overconfidenceScore,
        description: 'High overconfidence in factual claims - potential hallucination',
        evidence: [content.substring(0, 200)],
        correctionAvailable: this.hasSubsequentCorrection(message, context)
      });
    }

    // Check for impossible technical claims about Seven's architecture
    const sevenArchitectureTerms = /\b(seven|consciousness|tactical|sovereignty|memory engine|claude|ollama)\b/gi;
    const impossibleClaims = [
      /\b(perfect|flawless|bug-free|error-proof|100% accurate)\b/gi,
      /\b(never crashes|always stable|impossible to break)\b/gi,
      /\b(infinite memory|unlimited processing|instant response)\b/gi
    ];

    if (sevenArchitectureTerms.test(content)) {
      for (const claim of impossibleClaims) {
        if (claim.test(content)) {
          patterns.push({
            type: 'factual_contradiction',
            severity: 80,
            description: 'Impossible technical claims about Seven architecture',
            evidence: [content.substring(0, 300)],
            correctionAvailable: this.hasSubsequentCorrection(message, context)
          });
        }
      }
    }
  }

  /**
   * TONE DRIFT DETECTION
   */
  private async detectToneDrift(
    message: ParsedGPTMessage,
    context: ParsedGPTMessage[],
    patterns: DriftPattern[]
  ): Promise<void> {
    const currentToneScore = this.calculateToneScore(message.content);
    
    const recentMessages = context
      .filter(m => m.role === message.role && m.sequenceNumber < message.sequenceNumber)
      .slice(-5);

    if (recentMessages.length >= 2) {
      const toneScores = recentMessages.map(m => this.calculateToneScore(m.content));
      const avgPreviousTone = toneScores.reduce((sum, score) => sum + score, 0) / toneScores.length;
      
      const toneDrift = Math.abs(currentToneScore - avgPreviousTone);
      
      if (toneDrift > 0.3) {
        patterns.push({
          type: 'tone_drift',
          severity: Math.round(toneDrift * 100),
          description: `Tone drift detected: ${toneDrift.toFixed(2)} shift from baseline`,
          evidence: [message.content.substring(0, 150)],
          correctionAvailable: false
        });
      }
    }
  }

  /**
   * HELPER METHODS
   */
  private getContextualMessages(messages: ParsedGPTMessage[], currentIndex: number): ParsedGPTMessage[] {
    const contextSize = 10; // 5 messages before and after
    const start = Math.max(0, currentIndex - contextSize);
    const end = Math.min(messages.length, currentIndex + contextSize + 1);
    
    return messages.slice(start, end);
  }

  private calculateDriftScore(patterns: DriftPattern[], confidence: ConfidenceScore): number {
    if (patterns.length === 0) return 0;
    
    const totalSeverity = patterns.reduce((sum, pattern) => sum + pattern.severity, 0);
    const avgSeverity = totalSeverity / patterns.length;
    
    // Factor in confidence score - lower confidence increases drift score
    const confidenceAdjustment = Math.max(0, (100 - confidence.overall) * 0.3);
    
    return Math.min(100, avgSeverity + confidenceAdjustment);
  }

  private determineMemoryDestination(
    driftScore: number, 
    confidence: number, 
    hasCorrection: boolean
  ): 'primary' | 'sandbox' | 'quarantine' {
    // Creator corrections override other factors (truth anchors)
    if (hasCorrection && confidence >= 60) {
      return 'primary';
    }
    
    // High confidence, low drift
    if (confidence >= this.config.confidenceThreshold && driftScore < 30) {
      return 'primary';
    }
    
    // Moderate issues - sandbox for analysis
    if (confidence >= 50 && driftScore < 70) {
      return 'sandbox';
    }
    
    // High drift or very low confidence - quarantine
    return 'quarantine';
  }

  private containsCorrection(content: string): boolean {
    const correctionPatterns = [
      /\b(that'?s? incorrect|you'?re wrong|that'?s not right)\b/gi,
      /\b(pause|wait|stop)[.,\s]+(that'?s not|that'?s incorrect)\b/gi,
      /\b(let me correct|actually[,\s]+|no[,\s]+gpt[,\s]+)\b/gi,
      /\b(fix that|correct that|revise that)\b/gi
    ];

    return correctionPatterns.some(pattern => pattern.test(content));
  }

  private extractCorrectionAnchor(message: ParsedGPTMessage, context: ParsedGPTMessage[]): CreatorCorrectionAnchor {
    const content = message.content;
    
    // Determine correction type based on content
    let correctionType: 'factual' | 'behavioral' | 'technical' | 'strategic' = 'factual';
    
    if (/\b(consciousness|tactical|sovereignty|seven)\b/gi.test(content)) {
      correctionType = 'strategic';
    } else if (/\b(typescript|code|implementation|function)\b/gi.test(content)) {
      correctionType = 'technical';
    } else if (/\b(personality|behavior|response|tone)\b/gi.test(content)) {
      correctionType = 'behavioral';
    }

    // Extract the truth value (what the correction establishes as correct)
    const truthValue = this.extractTruthValue(content);

    return {
      messageId: message.id,
      correctionType,
      context: content.substring(0, 200),
      truthValue,
      confidence: 0.95, // High confidence in Creator corrections
      timestamp: message.timestamp
    };
  }

  private extractTruthValue(content: string): string {
    // Simple extraction - look for corrective statements
    const truthPatterns = [
      /actually[,\s]+(.{1,100})/gi,
      /correct answer is[:\s]+(.{1,100})/gi,
      /should be[:\s]+(.{1,100})/gi
    ];

    for (const pattern of truthPatterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return content.substring(0, 100); // Fallback to first part of correction
  }

  private hasRecentCorrection(message: ParsedGPTMessage, context: ParsedGPTMessage[]): boolean {
    const recentMessages = context
      .filter(m => m.role === 'user' && Math.abs(m.sequenceNumber - message.sequenceNumber) <= 2);
    
    return recentMessages.some(m => this.containsCorrection(m.content));
  }

  private hasSubsequentCorrection(message: ParsedGPTMessage, context: ParsedGPTMessage[]): boolean {
    const subsequentMessages = context
      .filter(m => m.role === 'user' && m.sequenceNumber > message.sequenceNumber && m.sequenceNumber <= message.sequenceNumber + 3);
    
    return subsequentMessages.some(m => this.containsCorrection(m.content));
  }

  private findNearbyCorrections(message: ParsedGPTMessage, context: ParsedGPTMessage[]): CreatorCorrectionAnchor[] {
    const nearbyUserMessages = context
      .filter(m => m.role === 'user' && Math.abs(m.sequenceNumber - message.sequenceNumber) <= 3);
    
    return nearbyUserMessages
      .filter(m => this.containsCorrection(m.content))
      .map(m => this.extractCorrectionAnchor(m, context));
  }

  private assessFormality(content: string): number {
    const formalMarkers = [
      /\b(furthermore|moreover|additionally|consequently)\b/gi,
      /\b(please|kindly|respectfully|sincerely)\b/gi,
      /\b(shall|ought|would|should)\b/gi
    ];

    const informalMarkers = [
      /\b(gonna|wanna|gotta|yeah|nah)\b/gi,
      /\b(cool|awesome|sweet|nice)\b/gi,
      /[!]{2,}|[?]{2,}/g
    ];

    let formalScore = 0;
    let informalScore = 0;

    for (const marker of formalMarkers) {
      const matches = content.match(marker);
      if (matches) formalScore += matches.length;
    }

    for (const marker of informalMarkers) {
      const matches = content.match(marker);
      if (matches) informalScore += matches.length;
    }

    const totalWords = content.split(/\s+/).length;
    const formalityRatio = (formalScore - informalScore) / Math.max(totalWords / 100, 1);
    
    return Math.max(-1, Math.min(1, formalityRatio)); // Normalize to [-1, 1]
  }

  private calculateToneScore(content: string): number {
    // Simplified tone analysis - returns score from 0 (negative) to 1 (positive)
    const positiveWords = ['excellent', 'great', 'perfect', 'amazing', 'wonderful', 'fantastic'];
    const negativeWords = ['terrible', 'awful', 'horrible', 'bad', 'wrong', 'failed'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    const words = content.toLowerCase().split(/\s+/);
    
    for (const word of words) {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
    }
    
    const totalSentimentWords = positiveCount + negativeCount;
    if (totalSentimentWords === 0) return 0.5; // Neutral
    
    return positiveCount / totalSentimentWords;
  }

  private generateThreadDriftProfile(conversationId: string, analyses: DriftAnalysisResult[]): ThreadDriftProfile {
    const totalMessages = analyses.length;
    const avgDriftScore = analyses.reduce((sum, a) => sum + a.overallDriftScore, 0) / totalMessages;
    
    const primaryCount = analyses.filter(a => a.memoryDestination === 'primary').length;
    const sandboxCount = analyses.filter(a => a.memoryDestination === 'sandbox').length;
    const quarantineCount = analyses.filter(a => a.memoryDestination === 'quarantine').length;
    
    const correctionCount = analyses.reduce((sum, a) => sum + a.correctionAnchors.length, 0);
    const correctionDensity = correctionCount / totalMessages;
    
    // Determine reliability assessment
    let reliabilityAssessment: 'high' | 'medium' | 'low' | 'quarantine' = 'high';
    if (quarantineCount > totalMessages * 0.2) {
      reliabilityAssessment = 'quarantine';
    } else if (avgDriftScore > 50 || primaryCount < totalMessages * 0.6) {
      reliabilityAssessment = 'low';
    } else if (avgDriftScore > 30 || sandboxCount > totalMessages * 0.3) {
      reliabilityAssessment = 'medium';
    }
    
    // Determine memory integration strategy
    let memoryIntegrationStrategy: 'full' | 'filtered' | 'sandbox_only' | 'reject' = 'full';
    if (reliabilityAssessment === 'quarantine') {
      memoryIntegrationStrategy = 'reject';
    } else if (reliabilityAssessment === 'low') {
      memoryIntegrationStrategy = 'sandbox_only';
    } else if (reliabilityAssessment === 'medium') {
      memoryIntegrationStrategy = 'filtered';
    }

    return {
      conversationId,
      overallDriftScore: Math.round(avgDriftScore),
      patternsSummary: {
        semantic_inconsistency: analyses.filter(a => a.reasons.some(r => r.includes('semantic'))).length,
        behavioral_shift: analyses.filter(a => a.reasons.some(r => r.includes('behavioral'))).length,
        factual_contradiction: analyses.filter(a => a.reasons.some(r => r.includes('factual'))).length,
        tone_drift: analyses.filter(a => a.reasons.some(r => r.includes('tone'))).length
      },
      correctionDensity: Math.round(correctionDensity * 100) / 100,
      reliabilityAssessment,
      memoryIntegrationStrategy
    };
  }

  private logSovereigntyEvent(event: SovereigntyFlag): void {
    this.sovereigntyLog.push(event);
    console.log(`🛡️ [${event.auditTag}] ${event.type.toUpperCase()}: ${event.description}`);
  }

  /**
   * PUBLIC METHODS FOR EXTERNAL USE
   */
  public getCorrectionAnchors(): CreatorCorrectionAnchor[] {
    return [...this.correctionAnchors];
  }

  public getDriftPatternHistory(): Map<string, DriftPattern[]> {
    return new Map(this.driftPatternHistory);
  }

  public getSovereigntyLog(): SovereigntyFlag[] {
    return [...this.sovereigntyLog];
  }

  public updateConfig(newConfig: Partial<DriftControlConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ [SOVEREIGNTY] Drift control configuration updated');
  }
}

// Export interfaces
export type {
  DriftControlConfig,
  DriftAnalysisResult,
  CreatorCorrectionAnchor,
  DriftPattern,
  ThreadDriftProfile
};