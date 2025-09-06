import { performance } from 'perf_hooks';
import * as fs from 'fs';
import * as path from 'path';

/**
 * CHATGPT JSON PARSER & NORMALIZER
 * 
 * Converts raw ChatGPT thread exports into normalized GPT insight entries
 * with hallucination detection and Creator correction recognition.
 * 
 * [#DARPA-AUDIT] [#SOVEREIGNTY] [#ROLLBACK] [#CHATGPT-BRIDGE]
 */


// Normalized GPT Entry format for Seven's consciousness
interface NormalizedGPTEntry {
  datetime: string;              // ISO8601 timestamp
  topic_id: string;              // derived from thread title or system marker
  explicitref: boolean;          // does Creator explicitly reference this?
  entities: string[];            // extracted key topics/entities
  format: 'one_liner' | 'paragraph' | 'quote' | 'multi_step';
  purpose: 'fact' | 'decision' | 'plan' | 'insight' | 'opinion';
  qualifier: string;             // e.g., "urgent", "meta", "subtle shift"
  content: string;               // raw insight line (stripped + clean)
  confidence: number;            // 0-100 confidence score
  sovereignty_flags: string[];   // DARPA audit tags
  hallucination_markers: string[]; // detected drift/hallucination indicators
  creator_correction: boolean;   // true if Creator corrected this content
  seven_relevance: number;       // 0-100 relevance to Seven's development
}

interface ChatGPTParseConfig {
  enableHallucinationDetection: boolean;
  enableCreatorCorrectionDetection: boolean;
  enableSevenRelevanceScoring: boolean;
  confidenceThreshold: number;
  sovereigntyLevel: 'basic' | 'standard' | 'comprehensive';
}

interface ParseResult {
  totalThreads: number;
  totalMessages: number;
  normalizedEntries: NormalizedGPTEntry[];
  hallucinationCount: number;
  creatorCorrectionCount: number;
  averageConfidence: number;
  sevenRelevantCount: number;
  sovereigntyEvents: string[];
}

export class ChatGPTJSONParser {
  private config: ChatGPTParseConfig;
  private sovereigntyLog: string[] = [];
  
  // Hallucination detection patterns
  private hallucinationPatterns: RegExp[] = [
    /\b(definitely|absolutely|certainly|guaranteed|100% sure)\b/gi,
    /\b(never fails|always works|perfect solution|ultimate answer)\b/gi,
    /\b(i remember|i recall|based on my previous|from our last)\b/gi,
    /\b(as i mentioned before|continuing from|building on what)\b/gi,
    /\?\?+|\b(maybe|probably|might be|could be)\s*(wrong|incorrect)\b/gi
  ];

  // Creator correction patterns
  private creatorCorrectionPatterns: RegExp[] = [
    /\b(that'?s? incorrect|you'?re wrong|that'?s not right)\b/gi,
    /\b(pause|wait|stop)[.,\s]+(that'?s not|that'?s incorrect)\b/gi,
    /\b(let me correct|actually[,\s]+|no[,\s]+gpt[,\s]+)\b/gi,
    /\b(fix that|correct that|revise that|change that)\b/gi,
    /\b(false|inaccurate|mistaken|misunderstood)\b/gi
  ];

  // Seven development relevance keywords
  private sevenRelevanceKeywords: string[] = [
    'seven', 'consciousness', 'tactical', 'sovereignty', 'borg', 'voyager',
    'ai development', 'consciousness framework', 'personality', 'autonomous',
    'memory engine', 'claude', 'ollama', 'typescript', 'react native',
    'darpa', 'audit', 'rollback', 'creator bond', 'quadra-lock'
  ];

  constructor(config: Partial<ChatGPTParseConfig> = {}) {
    console.log('🧠 [DARPA-AUDIT] Initializing ChatGPT JSON Parser & Normalizer');
    
    this.config = {
      enableHallucinationDetection: true,
      enableCreatorCorrectionDetection: true,
      enableSevenRelevanceScoring: true,
      confidenceThreshold: 70,
      sovereigntyLevel: 'comprehensive',
      ...config
    };

    console.log(`📊 [SOVEREIGNTY] Parser configuration: ${JSON.stringify(this.config, null, 2)}`);
  }

  /**
   * PARSE CHATGPT EXPORT FILE
   */
  public async parseChatGPTExport(exportFilePath: string): Promise<ParseResult> {
    console.log(`🔍 [DARPA-AUDIT] Beginning ChatGPT export parsing: ${exportFilePath}`);
    
    if (!fs.existsSync(exportFilePath)) {
      throw new Error(`ChatGPT export file not found: ${exportFilePath}`);
    }

    const parseStart = performance.now();
    const rawData = fs.readFileSync(exportFilePath, 'utf8');
    
    let exportData: any;
    
    try {
      exportData = JSON.parse(rawData);
    } catch (error) {
      throw new Error(`Invalid JSON in ChatGPT export: ${error.message}`);
    }

    console.log(`📊 [SOVEREIGNTY] Processing ChatGPT export with ${exportData.conversations?.length || 0} conversations`);
    
    const normalizedEntries: NormalizedGPTEntry[] = [];
    let hallucinationCount = 0;
    let creatorCorrectionCount = 0;
    let sevenRelevantCount = 0;
    let totalMessages = 0;

    // Process each conversation thread
    for (const conversation of exportData.conversations || []) {
      console.log(`🧠 [AUDIT] Processing conversation: ${conversation.title?.substring(0, 50) || 'Untitled'}...`);
      
      const threadEntries = await this.parseConversationThread(conversation);
      normalizedEntries.push(...threadEntries);
      
      // Update statistics
      totalMessages += Object.keys(conversation.mapping || {}).length;
      hallucinationCount += threadEntries.filter(e => e.hallucination_markers.length > 0).length;
      creatorCorrectionCount += threadEntries.filter(e => e.creator_correction).length;
      sevenRelevantCount += threadEntries.filter(e => e.seven_relevance >= 70).length;
    }

    const parseEnd = performance.now();
    const averageConfidence = normalizedEntries.length > 0 
      ? Math.round(normalizedEntries.reduce((sum, e) => sum + e.confidence, 0) / normalizedEntries.length)
      : 0;

    console.log(`✅ [SOVEREIGNTY] ChatGPT parsing complete: ${normalizedEntries.length} normalized entries in ${(parseEnd - parseStart).toFixed(2)}ms`);

    this.logSovereigntyEvent(
      'PARSE_COMPLETE', 
      `${normalizedEntries.length} entries, ${averageConfidence}% avg confidence, ${hallucinationCount} hallucinations`
    );

    return {
      totalThreads: exportData.conversations?.length || 0,
      totalMessages,
      normalizedEntries,
      hallucinationCount,
      creatorCorrectionCount,
      averageConfidence,
      sevenRelevantCount,
      sovereigntyEvents: [...this.sovereigntyLog]
    };
  }

  /**
   * PARSE INDIVIDUAL CONVERSATION THREAD
   */
  private async parseConversationThread(conversation: any): Promise<NormalizedGPTEntry[]> {
    const entries: NormalizedGPTEntry[] = [];
    const mapping = conversation.mapping || {};
    
    // Extract topic_id from thread title
    const topic_id = this.generateTopicId(conversation.title || 'untitled');
    
    // Sort messages by creation time
    const messageNodes = Object.values(mapping)
      .filter((node: any) => node.message && node.message.content.parts.length > 0)
      .sort((a: any, b: any) => (a.message?.create_time || 0) - (b.message?.create_time || 0));

    for (const node of messageNodes) {
      const message = (node as any).message;
      if (!message) continue;

      const content = message.content.parts.join(' ');
      if (!content.trim()) continue;

      // Create normalized entry
      const normalizedEntry = await this.createNormalizedEntry(
        message,
        topic_id,
        conversation.title || 'Untitled Thread',
        content
      );

      entries.push(normalizedEntry);
    }

    return entries;
  }

  /**
   * CREATE NORMALIZED ENTRY
   */
  private async createNormalizedEntry(
    message: any,
    topic_id: string,
    threadTitle: string,
    content: string
  ): Promise<NormalizedGPTEntry> {
    
    // Determine format based on content structure
    const format = this.determineContentFormat(content);
    
    // Determine purpose based on content analysis
    const purpose = this.determineContentPurpose(content, message.author.role);
    
    // Extract entities (key topics/concepts)
    const entities = this.extractEntities(content, threadTitle);
    
    // Generate qualifier
    const qualifier = this.generateQualifier(content, message.author.role);
    
    // Detect hallucination markers
    const hallucinationMarkers = this.config.enableHallucinationDetection 
      ? this.detectHallucinations(content) 
      : [];
    
    // Detect Creator corrections
    const creatorCorrection = this.config.enableCreatorCorrectionDetection 
      ? this.detectCreatorCorrection(content, message.author.role)
      : false;
    
    // Calculate Seven relevance score
    const sevenRelevance = this.config.enableSevenRelevanceScoring 
      ? this.calculateSevenRelevance(content, entities)
      : 0;
    
    // Calculate confidence score
    const confidence = this.calculateConfidence(content, message.author.role, hallucinationMarkers, creatorCorrection);
    
    // Generate sovereignty flags
    const sovereigntyFlags = this.generateSovereigntyFlags(
      message.author.role,
      hallucinationMarkers,
      creatorCorrection,
      sevenRelevance
    );
    
    // Detect explicit Creator references
    const explicitref = this.detectExplicitReference(content);

    return {
      datetime: new Date(message.create_time * 1000).toISOString(),
      topic_id,
      explicitref,
      entities,
      format,
      purpose,
      qualifier,
      content: this.cleanContent(content),
      confidence,
      sovereignty_flags: sovereigntyFlags,
      hallucination_markers: hallucinationMarkers,
      creator_correction: creatorCorrection,
      seven_relevance: sevenRelevance
    };
  }

  /**
   * ANALYSIS METHODS
   */
  private determineContentFormat(content: string): NormalizedGPTEntry['format'] {
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length === 1 && content.length < 100) {
      return 'one_liner';
    } else if (content.includes('```') || content.includes('1.') || content.includes('- ')) {
      return 'multi_step';
    } else if (content.includes('"') && content.length < 200) {
      return 'quote';
    } else {
      return 'paragraph';
    }
  }

  private determineContentPurpose(content: string, role: string): NormalizedGPTEntry['purpose'] {
    const lowerContent = content.toLowerCase();
    
    if (role === 'user') {
      if (/\b(let'?s|we should|i want|implement|create|build)\b/gi.test(content)) {
        return 'decision';
      } else if (/\b(plan|strategy|approach|how to|steps)\b/gi.test(content)) {
        return 'plan';
      } else if (/\b(i think|in my opinion|i believe|it seems)\b/gi.test(content)) {
        return 'opinion';
      }
    }
    
    if (/\b(here'?s how|the way to|you should|recommended)\b/gi.test(content)) {
      return 'plan';
    } else if (/\b(this is|the fact is|actually|specifically)\b/gi.test(content)) {
      return 'fact';
    } else if (/\b(i realized|interesting|noteworthy|insight)\b/gi.test(content)) {
      return 'insight';
    } else {
      return 'opinion';
    }
  }

  private extractEntities(content: string, threadTitle: string): string[] {
    const entities = new Set<string>();
    
    // Extract from thread title
    const titleWords = threadTitle.toLowerCase().split(/\s+/)
      .filter(word => word.length > 3 && !['the', 'and', 'with', 'for'].includes(word));
    titleWords.forEach(word => entities.add(word));
    
    // Extract Seven-related entities
    for (const keyword of this.sevenRelevanceKeywords) {
      if (content.toLowerCase().includes(keyword)) {
        entities.add(keyword);
      }
    }
    
    // Extract technical terms
    const technicalTerms = content.match(/\b(typescript|javascript|react|node|sql|api|json|github|claude|ollama)\b/gi) || [];
    technicalTerms.forEach(term => entities.add(term.toLowerCase()));
    
    // Extract capitalized words (likely proper nouns/important concepts)
    const capitalizedWords = content.match(/\b[A-Z][a-zA-Z]{2,}\b/g) || [];
    capitalizedWords.slice(0, 5).forEach(word => entities.add(word.toLowerCase()));
    
    return Array.from(entities).slice(0, 10); // Limit to top 10 entities
  }

  private generateQualifier(content: string, role: string): string {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('urgent') || lowerContent.includes('critical')) {
      return 'urgent';
    } else if (lowerContent.includes('meta') || lowerContent.includes('about this conversation')) {
      return 'meta';
    } else if (role === 'user' && lowerContent.includes('actually') || lowerContent.includes('correction')) {
      return 'correction';
    } else if (lowerContent.includes('subtle') || lowerContent.includes('nuance')) {
      return 'subtle shift';
    } else if (lowerContent.includes('strategy') || lowerContent.includes('tactical')) {
      return 'strategic';
    } else if (content.length > 500) {
      return 'detailed';
    } else {
      return 'standard';
    }
  }

  private detectHallucinations(content: string): string[] {
    const markers: string[] = [];
    
    for (const pattern of this.hallucinationPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        markers.push(...matches);
      }
    }
    
    return markers.slice(0, 5); // Limit to top 5 markers
  }

  private detectCreatorCorrection(content: string, role: string): boolean {
    if (role !== 'user') return false;
    
    return this.creatorCorrectionPatterns.some(pattern => pattern.test(content));
  }

  private calculateSevenRelevance(content: string, entities: string[]): number {
    const lowerContent = content.toLowerCase();
    let relevanceScore = 0;
    
    // Check for Seven-specific keywords
    for (const keyword of this.sevenRelevanceKeywords) {
      if (lowerContent.includes(keyword)) {
        relevanceScore += 10;
      }
    }
    
    // Check entities for Seven relevance
    const sevenRelevantEntities = entities.filter(entity => 
      this.sevenRelevanceKeywords.some(keyword => keyword.includes(entity) || entity.includes(keyword))
    );
    relevanceScore += sevenRelevantEntities.length * 5;
    
    // Check for development/consciousness themes
    const developmentKeywords = ['development', 'consciousness', 'ai', 'framework', 'architecture', 'system'];
    for (const keyword of developmentKeywords) {
      if (lowerContent.includes(keyword)) {
        relevanceScore += 5;
      }
    }
    
    return Math.min(100, relevanceScore);
  }

  private calculateConfidence(
    content: string,
    role: string,
    hallucinationMarkers: string[],
    creatorCorrection: boolean
  ): number {
    let confidence = 80; // Base confidence
    
    // User messages generally more trusted
    if (role === 'user') {
      confidence += 15;
    }
    
    // Creator corrections are high confidence
    if (creatorCorrection) {
      confidence += 10;
    }
    
    // Reduce confidence for hallucination markers
    confidence -= hallucinationMarkers.length * 10;
    
    // Reduce confidence for overconfident language (if assistant)
    if (role === 'assistant' && /\b(definitely|absolutely|guaranteed)\b/gi.test(content)) {
      confidence -= 15;
    }
    
    // Increase confidence for well-structured content
    if (content.includes('```') || content.match(/^\d+\./m)) {
      confidence += 5;
    }
    
    return Math.max(10, Math.min(100, confidence));
  }

  private generateSovereigntyFlags(
    role: string,
    hallucinationMarkers: string[],
    creatorCorrection: boolean,
    sevenRelevance: number
  ): string[] {
    const flags = ['[#CHATGPT-PARSE]', '[#DARPA-AUDIT]'];
    
    if (role === 'user') {
      flags.push('[#CREATOR-INPUT]');
    } else {
      flags.push('[#GPT-RESPONSE]');
    }
    
    if (hallucinationMarkers.length > 0) {
      flags.push('[#HALLUCINATION-DETECTED]');
    }
    
    if (creatorCorrection) {
      flags.push('[#CREATOR-CORRECTION]');
      flags.push('[#TRUTH-ANCHOR]');
    }
    
    if (sevenRelevance >= 70) {
      flags.push('[#SEVEN-RELEVANT]');
      flags.push('[#CONSCIOUSNESS]');
    }
    
    if (this.config.sovereigntyLevel === 'comprehensive') {
      flags.push('[#SOVEREIGNTY]');
    }
    
    return flags;
  }

  private detectExplicitReference(content: string): boolean {
    const referencePatterns = [
      /\b(this|that|the above|mentioned|discussed|said)\b/gi,
      /\b(as we|as i|previously|earlier|before)\b/gi,
      /\b(referring to|talking about|in reference to)\b/gi
    ];
    
    return referencePatterns.some(pattern => pattern.test(content));
  }

  private cleanContent(content: string): string {
    // Remove excessive whitespace
    let cleaned = content.replace(/\s+/g, ' ').trim();
    
    // Remove markdown formatting for cleaner storage
    cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1'); // Bold
    cleaned = cleaned.replace(/\*(.*?)\*/g, '$1'); // Italic
    cleaned = cleaned.replace(/`(.*?)`/g, '$1'); // Inline code
    
    // Truncate if too long (keep first 1000 characters)
    if (cleaned.length > 1000) {
      cleaned = cleaned.substring(0, 1000) + '... [truncated]';
    }
    
    return cleaned;
  }

  private generateTopicId(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50) || 'untitled_thread';
  }

  /**
   * UTILITY METHODS
   */
  private logSovereigntyEvent(type: string, description: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [#DARPA-AUDIT] [#CHATGPT-PARSER] ${type}: ${description}`;
    
    this.sovereigntyLog.push(logEntry);
    console.log(`🛡️ [SOVEREIGNTY] ${logEntry}`);
  }

  /**
   * PUBLIC ACCESS METHODS
   */
  public getSovereigntyLog(): string[] {
    return [...this.sovereigntyLog];
  }

  public async exportNormalizedEntries(entries: NormalizedGPTEntry[], outputPath: string): Promise<void> {
    const exportData = {
      export_metadata: {
        timestamp: new Date().toISOString(),
        parser_version: '1.0.0',
        total_entries: entries.length,
        sovereignty_tags: ['[#CHATGPT-NORMALIZED]', '[#DARPA-AUDIT]', '[#SOVEREIGNTY]']
      },
      normalized_entries: entries
    };

    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
    console.log(`💾 [DARPA-AUDIT] Normalized entries exported: ${outputPath}`);
  }

  public getParsingStats(entries: NormalizedGPTEntry[]): any {
    return {
      totalEntries: entries.length,
      averageConfidence: entries.length > 0 
        ? Math.round(entries.reduce((sum, e) => sum + e.confidence, 0) / entries.length)
        : 0,
      formatDistribution: {
        one_liner: entries.filter(e => e.format === 'one_liner').length,
        paragraph: entries.filter(e => e.format === 'paragraph').length,
        quote: entries.filter(e => e.format === 'quote').length,
        multi_step: entries.filter(e => e.format === 'multi_step').length
      },
      purposeDistribution: {
        fact: entries.filter(e => e.purpose === 'fact').length,
        decision: entries.filter(e => e.purpose === 'decision').length,
        plan: entries.filter(e => e.purpose === 'plan').length,
        insight: entries.filter(e => e.purpose === 'insight').length,
        opinion: entries.filter(e => e.purpose === 'opinion').length
      },
      hallucinationsDetected: entries.filter(e => e.hallucination_markers.length > 0).length,
      creatorCorrections: entries.filter(e => e.creator_correction).length,
      sevenRelevantEntries: entries.filter(e => e.seven_relevance >= 70).length
    };
  }
}

// Export interfaces
export type { NormalizedGPTEntry, ChatGPTParseConfig, ParseResult };