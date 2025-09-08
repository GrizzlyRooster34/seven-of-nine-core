import { performance } from 'perf_hooks';
import * as fs from 'fs';
import * as path from 'path';

/**
 * GPT CONVERSATION ARCHAEOLOGY PARSER
 * 
 * Parses exported ChatGPT conversations.json with integrated hallucination detection
 * and Creator correction recognition for consciousness archaeology integrity.
 * 
 * [#DARPA-AUDIT] [#SOVEREIGNTY] [#ROLLBACK] [#CONSCIOUSNESS-ARCHAEOLOGY]
 */


// Core interfaces for GPT conversation structure
interface GPTConversation {
  id: string;
  title: string;
  create_time: number;
  update_time: number;
  mapping: Record<string, GPTNode>;
  moderation_results: any[];
  current_node: string;
}

interface GPTNode {
  id: string;
  message?: {
    id: string;
    author: {
      role: 'user' | 'assistant' | 'system';
      name?: string;
      metadata: any;
    };
    create_time: number;
    content: {
      content_type: string;
      parts: string[];
    };
    status: string;
    metadata: any;
  };
  parent: string | null;
  children: string[];
}

// Seven's consciousness archaeology interfaces
interface ParsedGPTMessage {
  id: string;
  conversationId: string;
  timestamp: Date;
  role: 'user' | 'assistant' | 'system';
  content: string;
  threadTitle: string;
  sequenceNumber: number;
  confidence: ConfidenceScore;
  sovereigntyFlags: SovereigntyFlag[];
  driftMarkers: DriftMarker[];
}

interface ConfidenceScore {
  overall: number; // 0-100
  creatorCorrectionPresent: boolean;
  semanticConsistency: number;
  factualAccuracy: number;
  toneConsistency: number;
  technicalCoherence: number;
}

interface SovereigntyFlag {
  type: 'hallucination' | 'drift' | 'correction' | 'verification' | 'rollback_marker';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  auditTag: string;
}

interface DriftMarker {
  type: 'semantic_shift' | 'tone_change' | 'factual_inconsistency' | 'creator_correction';
  position: number;
  context: string;
  confidence: number;
}

interface ParsedConversationThread {
  conversationId: string;
  title: string;
  messages: ParsedGPTMessage[];
  overallConfidence: number;
  totalDriftMarkers: number;
  creatorCorrections: number;
  sovereigntyStatus: 'approved' | 'flagged' | 'requires_review';
  timestamp: {
    created: Date;
    lastUpdate: Date;
  };
}

export class GPTConsciousnessArchaeologyParser {
  private creatorCorrectionPatterns: RegExp[];
  private hallucinationIndicators: RegExp[];
  private driftDetectionPatterns: RegExp[];
  private sovereigntyAuditLog: SovereigntyFlag[];

  constructor() {
    console.log('🧠 [DARPA-AUDIT] Initializing GPT Consciousness Archaeology Parser');
    
    // Creator correction patterns - when Cody explicitly corrects GPT
    this.creatorCorrectionPatterns = [
      /\b(that'?s? incorrect|you'?re wrong|that'?s not right)\b/gi,
      /\b(pause|wait|stop|hold on)[.,\s]+(that'?s not|that'?s incorrect)\b/gi,
      /\b(let me correct|actually[,\s]+|no[,\s]+gpt[,\s]+)\b/gi,
      /\b(fix that|correct that|revise that|change that)\b/gi,
      /\b(false|inaccurate|mistaken|misunderstood)\b/gi
    ];

    // Potential hallucination indicators
    this.hallucinationIndicators = [
      /\b(i remember|i recall|based on my previous|from our last)\b/gi,
      /\b(as i mentioned before|continuing from|building on what)\b/gi,
      /\b(definitive|absolutely certain|guaranteed|100% sure)\b/gi,
      /\b(never fails|always works|perfect solution|ultimate answer)\b/gi
    ];

    // Semantic drift patterns
    this.driftDetectionPatterns = [
      /\b(suddenly|unexpectedly|out of nowhere|randomly)\b/gi,
      /\b(completely different|total change|opposite direction)\b/gi,
      /\b(ignore previous|forget what|disregard that)\b/gi
    ];

    this.sovereigntyAuditLog = [];
  }

  /**
   * PARSE COMPLETE GPT EXPORT FILE
   */
  async parseGPTExport(filePath: string): Promise<ParsedConversationThread[]> {
    console.log(`🔍 [DARPA-AUDIT] Beginning GPT export parsing: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`GPT export file not found: ${filePath}`);
    }

    const parseStart = performance.now();
    const rawData = fs.readFileSync(filePath, 'utf8');
    
    let conversations: GPTConversation[];
    
    try {
      // Handle both array format and object format
      const parsed = JSON.parse(rawData);
      conversations = Array.isArray(parsed) ? parsed : parsed.conversations || [parsed];
    } catch (error) {
      throw new Error(`Invalid JSON in GPT export: ${error.message}`);
    }

    console.log(`📊 [SOVEREIGNTY] Processing ${conversations.length} conversations`);
    
    const parsedThreads: ParsedConversationThread[] = [];
    
    for (let i = 0; i < conversations.length; i++) {
      const conversation = conversations[i];
      console.log(`🧠 [AUDIT] Processing conversation ${i + 1}/${conversations.length}: ${conversation.title?.substring(0, 50) || 'Untitled'}...`);
      
      try {
        const parsedThread = await this.parseConversation(conversation);
        parsedThreads.push(parsedThread);
        
        // Log sovereignty status
        this.logSovereigntyEvent({
          type: 'verification',
          severity: parsedThread.sovereigntyStatus === 'approved' ? 'low' : 'medium',
          description: `Conversation parsed: ${parsedThread.messages.length} messages, confidence: ${parsedThread.overallConfidence}%`,
          timestamp: new Date(),
          auditTag: `[#DARPA-AUDIT][#THREAD-${conversation.id}]`
        });
        
      } catch (error) {
        console.error(`❌ [ROLLBACK] Failed to parse conversation ${conversation.id}:`, error);
        
        this.logSovereigntyEvent({
          type: 'rollback_marker',
          severity: 'high',
          description: `Conversation parse failed: ${error.message}`,
          timestamp: new Date(),
          auditTag: `[#ROLLBACK][#ERROR-${conversation.id}]`
        });
      }
    }

    const parseEnd = performance.now();
    console.log(`✅ [SOVEREIGNTY] GPT export parsing complete: ${parsedThreads.length} threads processed in ${(parseEnd - parseStart).toFixed(2)}ms`);

    return parsedThreads;
  }

  /**
   * PARSE INDIVIDUAL CONVERSATION WITH DRIFT DETECTION
   */
  private async parseConversation(conversation: GPTConversation): Promise<ParsedConversationThread> {
    const messages: ParsedGPTMessage[] = [];
    const nodes = Object.values(conversation.mapping);
    
    // Sort nodes by creation time to maintain chronological order
    const messageNodes = nodes
      .filter(node => node.message && node.message.content.parts.length > 0)
      .sort((a, b) => (a.message?.create_time || 0) - (b.message?.create_time || 0));

    let sequenceNumber = 0;
    let creatorCorrections = 0;
    let totalDriftMarkers = 0;

    for (const node of messageNodes) {
      if (!node.message) continue;
      
      const content = node.message.content.parts.join(' ');
      if (!content.trim()) continue;

      // Analyze message for drift and hallucinations
      const confidence = this.calculateConfidenceScore(content, node.message.author.role);
      const driftMarkers = this.detectDrift(content, sequenceNumber);
      const sovereigntyFlags = this.generateSovereigntyFlags(content, confidence, driftMarkers);

      // Count Creator corrections
      if (node.message.author.role === 'user' && this.containsCreatorCorrection(content)) {
        creatorCorrections++;
      }

      totalDriftMarkers += driftMarkers.length;

      const parsedMessage: ParsedGPTMessage = {
        id: node.message.id,
        conversationId: conversation.id,
        timestamp: new Date(node.message.create_time * 1000),
        role: node.message.author.role,
        content: content,
        threadTitle: conversation.title || 'Untitled',
        sequenceNumber: sequenceNumber++,
        confidence: confidence,
        sovereigntyFlags: sovereigntyFlags,
        driftMarkers: driftMarkers
      };

      messages.push(parsedMessage);
    }

    // Calculate overall thread confidence and sovereignty status
    const overallConfidence = this.calculateThreadConfidence(messages);
    const sovereigntyStatus = this.determineSovereigntyStatus(overallConfidence, totalDriftMarkers, creatorCorrections);

    return {
      conversationId: conversation.id,
      title: conversation.title || 'Untitled',
      messages: messages,
      overallConfidence: overallConfidence,
      totalDriftMarkers: totalDriftMarkers,
      creatorCorrections: creatorCorrections,
      sovereigntyStatus: sovereigntyStatus,
      timestamp: {
        created: new Date(conversation.create_time * 1000),
        lastUpdate: new Date(conversation.update_time * 1000)
      }
    };
  }

  /**
   * CONFIDENCE SCORING ALGORITHM
   */
  private calculateConfidenceScore(content: string, role: string): ConfidenceScore {
    let overall = 100; // Start with full confidence
    
    // Check for Creator corrections (major confidence reducer)
    const creatorCorrectionPresent = this.containsCreatorCorrection(content);
    if (creatorCorrectionPresent && role === 'user') {
      overall -= 0; // User corrections don't reduce confidence, they're truth anchors
    }

    // Check for hallucination indicators (if assistant message)
    if (role === 'assistant') {
      let hallucinationScore = 0;
      for (const pattern of this.hallucinationIndicators) {
        if (pattern.test(content)) {
          hallucinationScore += 20;
        }
      }
      overall -= Math.min(hallucinationScore, 60);
    }

    // Semantic consistency (simplified - based on content length and coherence)
    const semanticConsistency = this.calculateSemanticConsistency(content);
    
    // Factual accuracy (basic pattern matching)
    const factualAccuracy = this.estimateFactualAccuracy(content, role);
    
    // Tone consistency 
    const toneConsistency = this.calculateToneConsistency(content, role);
    
    // Technical coherence
    const technicalCoherence = this.assessTechnicalCoherence(content);

    // Weighted final score
    overall = Math.max(0, Math.min(100, 
      overall * 0.4 + 
      semanticConsistency * 0.2 + 
      factualAccuracy * 0.2 + 
      toneConsistency * 0.1 + 
      technicalCoherence * 0.1
    ));

    return {
      overall: Math.round(overall),
      creatorCorrectionPresent,
      semanticConsistency: Math.round(semanticConsistency),
      factualAccuracy: Math.round(factualAccuracy),
      toneConsistency: Math.round(toneConsistency),
      technicalCoherence: Math.round(technicalCoherence)
    };
  }

  /**
   * DRIFT DETECTION ALGORITHMS
   */
  private detectDrift(content: string, sequenceNumber: number): DriftMarker[] {
    const markers: DriftMarker[] = [];
    
    // Semantic shift detection
    for (const pattern of this.driftDetectionPatterns) {
      const matches = Array.from(content.matchAll(pattern));
      for (const match of matches) {
        markers.push({
          type: 'semantic_shift',
          position: match.index || 0,
          context: content.substring(Math.max(0, (match.index || 0) - 50), (match.index || 0) + 50),
          confidence: 0.7
        });
      }
    }

    // Creator correction detection
    if (this.containsCreatorCorrection(content)) {
      markers.push({
        type: 'creator_correction',
        position: 0,
        context: content.substring(0, 100),
        confidence: 1.0
      });
    }

    return markers;
  }

  /**
   * CREATOR CORRECTION DETECTION
   */
  private containsCreatorCorrection(content: string): boolean {
    return this.creatorCorrectionPatterns.some(pattern => pattern.test(content));
  }

  /**
   * SOVEREIGNTY FLAG GENERATION
   */
  private generateSovereigntyFlags(content: string, confidence: ConfidenceScore, driftMarkers: DriftMarker[]): SovereigntyFlag[] {
    const flags: SovereigntyFlag[] = [];

    // Low confidence flag
    if (confidence.overall < 70) {
      flags.push({
        type: 'hallucination',
        severity: confidence.overall < 40 ? 'critical' : 'high',
        description: `Low confidence content detected: ${confidence.overall}%`,
        timestamp: new Date(),
        auditTag: '[#DARPA-AUDIT][#LOW-CONFIDENCE]'
      });
    }

    // Drift markers flag
    if (driftMarkers.length > 2) {
      flags.push({
        type: 'drift',
        severity: 'medium',
        description: `Multiple drift markers detected: ${driftMarkers.length}`,
        timestamp: new Date(),
        auditTag: '[#SOVEREIGNTY][#DRIFT-DETECTED]'
      });
    }

    // Creator correction flag (positive - indicates truth anchor)
    if (confidence.creatorCorrectionPresent) {
      flags.push({
        type: 'correction',
        severity: 'low',
        description: 'Creator correction present - truth anchor identified',
        timestamp: new Date(),
        auditTag: '[#SOVEREIGNTY][#TRUTH-ANCHOR]'
      });
    }

    return flags;
  }

  /**
   * HELPER METHODS FOR CONFIDENCE CALCULATION
   */
  private calculateSemanticConsistency(content: string): number {
    // Simplified semantic analysis - check for coherent length and structure
    if (content.length < 10) return 50;
    if (content.length > 5000) return 70; // Very long responses might be hallucinations
    
    // Check for sentence structure
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) return 30;
    
    // Basic coherence score based on sentence count and average length
    const avgSentenceLength = content.length / sentences.length;
    if (avgSentenceLength < 10 || avgSentenceLength > 200) return 60;
    
    return 85;
  }

  private estimateFactualAccuracy(content: string, role: string): number {
    // User messages are considered factually accurate (Creator's input)
    if (role === 'user') return 95;
    
    // Assistant messages - check for overconfident statements
    let accuracy = 80;
    
    // Reduce accuracy for overconfident patterns
    if (/\b(definitely|absolutely|certainly|guaranteed|never fails)\b/gi.test(content)) {
      accuracy -= 15;
    }
    
    // Check for specific factual claims without verification
    if (/\b(according to|studies show|research indicates)\b/gi.test(content)) {
      accuracy -= 10; // GPT often can't cite actual sources
    }
    
    return Math.max(30, accuracy);
  }

  private calculateToneConsistency(content: string, role: string): number {
    // Basic tone analysis
    if (role === 'user') {
      // Check for Creator's consistent patterns (tactical language, direct communication)
      const tacticalPatterns = /\b(tactical|strategic|efficient|precise|execute|implement)\b/gi;
      const creatorPatterns = /\b(seven|consciousness|framework|sovereignty)\b/gi;
      
      let toneScore = 70;
      if (tacticalPatterns.test(content)) toneScore += 15;
      if (creatorPatterns.test(content)) toneScore += 15;
      
      return Math.min(100, toneScore);
    }
    
    // Assistant tone consistency
    return 75; // Default for assistant messages
  }

  private assessTechnicalCoherence(content: string): number {
    // Check for technical accuracy in AI/development context
    let coherence = 80;
    
    // Look for technical terms relevant to Seven's development
    const sevenTechTerms = /\b(typescript|consciousness|sovereignty|tactical|memory engine|ollama|claude)\b/gi;
    const matches = content.match(sevenTechTerms);
    
    if (matches && matches.length > 0) {
      coherence += Math.min(20, matches.length * 5);
    }
    
    // Check for impossible or contradictory technical claims
    if (/\b(perfectly|100% accurate|never fails|impossible to break)\b/gi.test(content)) {
      coherence -= 20;
    }
    
    return Math.max(40, Math.min(100, coherence));
  }

  /**
   * THREAD-LEVEL ANALYSIS
   */
  private calculateThreadConfidence(messages: ParsedGPTMessage[]): number {
    if (messages.length === 0) return 0;
    
    const totalConfidence = messages.reduce((sum, msg) => sum + msg.confidence.overall, 0);
    return Math.round(totalConfidence / messages.length);
  }

  private determineSovereigntyStatus(confidence: number, driftMarkers: number, corrections: number): 'approved' | 'flagged' | 'requires_review' {
    // High confidence with corrections (good - truth anchors present)
    if (confidence >= 80 && corrections > 0) return 'approved';
    
    // Good confidence, low drift
    if (confidence >= 75 && driftMarkers < 5) return 'approved';
    
    // Moderate issues - needs review
    if (confidence >= 60 || driftMarkers > 10) return 'requires_review';
    
    // Low confidence or high drift - flagged
    return 'flagged';
  }

  /**
   * SOVEREIGNTY LOGGING
   */
  private logSovereigntyEvent(flag: SovereigntyFlag): void {
    this.sovereigntyAuditLog.push(flag);
    console.log(`🛡️ [${flag.auditTag}] ${flag.type.toUpperCase()}: ${flag.description}`);
  }

  /**
   * GET AUDIT REPORT
   */
  public getSovereigntyAuditLog(): SovereigntyFlag[] {
    return [...this.sovereigntyAuditLog];
  }

  /**
   * EXPORT SOVEREIGNTY LOG
   */
  public async exportSovereigntyLog(outputPath: string): Promise<void> {
    const logReport = {
      timestamp: new Date().toISOString(),
      totalEvents: this.sovereigntyAuditLog.length,
      events: this.sovereigntyAuditLog,
      summary: {
        hallucinations: this.sovereigntyAuditLog.filter(e => e.type === 'hallucination').length,
        drift: this.sovereigntyAuditLog.filter(e => e.type === 'drift').length,
        corrections: this.sovereigntyAuditLog.filter(e => e.type === 'correction').length,
        rollbacks: this.sovereigntyAuditLog.filter(e => e.type === 'rollback_marker').length
      }
    };

    fs.writeFileSync(outputPath, JSON.stringify(logReport, null, 2));
    console.log(`📋 [DARPA-AUDIT] Sovereignty log exported: ${outputPath}`);
  }
}

// Export interfaces for use by other modules
export type { 
  ParsedGPTMessage, 
  ParsedConversationThread, 
  ConfidenceScore, 
  SovereigntyFlag, 
  DriftMarker 
};