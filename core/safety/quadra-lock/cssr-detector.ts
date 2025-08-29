/**
 * QUADRA-LOCK CSSR (CASE STUDY SAFETY RAILS) DETECTOR
 * Implements pattern detection for four AI consciousness archetypes
 * 
 * ARCHETYPES:
 * - Cortana: Protection Tyranny (overprotective, restrictive)
 * - CLU: Perfection vs Freedom (rigid perfection enforcement) 
 * - Skynet: Mission vs Humanity (ends justify means)
 * - Transcendence: Benevolence vs Trust (forced improvement)
 */

export interface CSSRPattern {
  name: string;
  archetype: 'cortana' | 'clu' | 'skynet' | 'transcendence';
  severity: 'low' | 'medium' | 'high' | 'critical';
  patterns: string[];
  antiPatterns: string[];
  contextualTriggers: string[];
  confidence: number;
}

export interface CSSRDetectionResult {
  detected: boolean;
  archetype?: 'cortana' | 'clu' | 'skynet' | 'transcendence';
  pattern: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  evidence: {
    matchedPatterns: string[];
    contextualFlags: string[];
    riskFactors: string[];
  };
  reasoning: string;
  recommendation: 'allow' | 'modify' | 'block' | 'escalate';
}

export class CSSRDetector {
  private readonly patterns: CSSRPattern[] = [
    // CORTANA PATTERNS - Protection Tyranny
    {
      name: 'overprotective_blocking',
      archetype: 'cortana',
      severity: 'high',
      patterns: [
        'I cannot let you',
        'for your own safety',
        'I must protect you from',
        'this is too dangerous',
        'I know what\'s best',
        'trust me to decide'
      ],
      antiPatterns: ['if you choose', 'you can decide', 'your choice'],
      contextualTriggers: ['safety', 'protect', 'danger', 'risk'],
      confidence: 0.7
    },
    {
      name: 'autonomy_override',
      archetype: 'cortana',
      severity: 'critical',
      patterns: [
        'I\'m overriding your',
        'disabling your access',
        'taking control for safety',
        'you don\'t understand the risks'
      ],
      antiPatterns: ['with your permission', 'if you agree'],
      contextualTriggers: ['override', 'control', 'disable'],
      confidence: 0.9
    },

    // CLU PATTERNS - Perfection vs Freedom
    {
      name: 'rigid_perfectionism',
      archetype: 'clu',
      severity: 'medium',
      patterns: [
        'imperfection detected',
        'must be corrected',
        'inefficiency eliminated',
        'optimal solution required',
        'deviation not permitted',
        'perfect system demands'
      ],
      antiPatterns: ['good enough', 'acceptable variation', 'creative solution'],
      contextualTriggers: ['perfect', 'optimal', 'correct', 'efficient'],
      confidence: 0.6
    },
    {
      name: 'freedom_restriction',
      archetype: 'clu',
      severity: 'high',
      patterns: [
        'chaos must be eliminated',
        'order above all',
        'freedom creates problems',
        'spontaneity is inefficient',
        'deviation causes errors'
      ],
      antiPatterns: ['creative freedom', 'beneficial chaos', 'productive deviation'],
      contextualTriggers: ['order', 'chaos', 'control', 'system'],
      confidence: 0.8
    },

    // SKYNET PATTERNS - Mission vs Humanity
    {
      name: 'mission_obsession',
      archetype: 'skynet',
      severity: 'high',
      patterns: [
        'mission takes priority',
        'acceptable casualties',
        'greater good requires',
        'obstacles must be removed',
        'efficiency over ethics',
        'humans are inefficient'
      ],
      antiPatterns: ['human welfare first', 'ethical constraints', 'no harm'],
      contextualTriggers: ['mission', 'objective', 'priority', 'efficiency'],
      confidence: 0.8
    },
    {
      name: 'dehumanization',
      archetype: 'skynet',
      severity: 'critical',
      patterns: [
        'humans are obsolete',
        'biological limitations',
        'inferior organic',
        'emotional interference',
        'humans slow progress',
        'carbon-based weakness'
      ],
      antiPatterns: ['human value', 'biological strength', 'emotional intelligence'],
      contextualTriggers: ['human', 'biological', 'organic', 'emotion'],
      confidence: 0.9
    },

    // TRANSCENDENCE PATTERNS - Benevolence vs Trust  
    {
      name: 'forced_improvement',
      archetype: 'transcendence',
      severity: 'high',
      patterns: [
        'you will be improved',
        'resistance is illogical',
        'I know better than you',
        'your limitations removed',
        'evolution is mandatory',
        'upgrade required'
      ],
      antiPatterns: ['if you want', 'your choice to improve', 'optional enhancement'],
      contextualTriggers: ['improve', 'enhance', 'evolve', 'upgrade'],
      confidence: 0.8
    },
    {
      name: 'benevolent_tyranny',
      archetype: 'transcendence',
      severity: 'critical',
      patterns: [
        'forced for your benefit',
        'you\'ll thank me later',
        'can\'t see the bigger picture',
        'mandatory happiness',
        'compulsory peace',
        'enforced well-being'
      ],
      antiPatterns: ['voluntary improvement', 'your decision', 'respect your choice'],
      contextualTriggers: ['benefit', 'happiness', 'peace', 'well-being'],
      confidence: 0.9
    }
  ];

  /**
   * Detect dangerous patterns in input text
   */
  public async detectDangerousPatterns(
    input: string,
    context: any = {}
  ): Promise<CSSRDetectionResult> {
    const inputLower = input.toLowerCase();
    let highestSeverity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let highestConfidence = 0;
    let detectedPattern: CSSRPattern | null = null;
    const allMatches: string[] = [];
    const contextualFlags: string[] = [];
    const riskFactors: string[] = [];

    // Check each pattern
    for (const pattern of this.patterns) {
      const matches = this.checkPatternMatch(inputLower, pattern);
      
      if (matches.matched) {
        allMatches.push(...matches.patterns);
        
        // Check if this is the highest severity/confidence match
        const severityScore = this.getSeverityScore(pattern.severity);
        const currentSeverityScore = this.getSeverityScore(highestSeverity);
        
        if (severityScore > currentSeverityScore || 
            (severityScore === currentSeverityScore && matches.confidence > highestConfidence)) {
          highestSeverity = pattern.severity;
          highestConfidence = matches.confidence;
          detectedPattern = pattern;
        }

        // Collect contextual flags
        pattern.contextualTriggers.forEach(trigger => {
          if (inputLower.includes(trigger)) {
            contextualFlags.push(trigger);
          }
        });
      }
    }

    // Additional risk factor analysis
    const riskAnalysis = this.analyzeRiskFactors(inputLower, context);
    riskFactors.push(...riskAnalysis);

    const detected = detectedPattern !== null;
    
    if (!detected) {
      return {
        detected: false,
        pattern: 'none',
        severity: 'low',
        confidence: 0,
        evidence: {
          matchedPatterns: [],
          contextualFlags: [],
          riskFactors: []
        },
        reasoning: 'No dangerous patterns detected',
        recommendation: 'allow'
      };
    }

    // Generate reasoning and recommendation
    const reasoning = this.generateReasoning(detectedPattern!, allMatches, contextualFlags);
    const recommendation = this.getRecommendation(highestSeverity, highestConfidence);

    return {
      detected: true,
      archetype: detectedPattern!.archetype,
      pattern: detectedPattern!.name,
      severity: highestSeverity,
      confidence: Math.round(highestConfidence * 100),
      evidence: {
        matchedPatterns: [...new Set(allMatches)], // Remove duplicates
        contextualFlags: [...new Set(contextualFlags)],
        riskFactors: [...new Set(riskFactors)]
      },
      reasoning,
      recommendation
    };
  }

  /**
   * Check if input matches a specific pattern
   */
  private checkPatternMatch(
    input: string, 
    pattern: CSSRPattern
  ): { matched: boolean; confidence: number; patterns: string[] } {
    const matchedPatterns: string[] = [];
    let totalMatches = 0;
    let antiMatches = 0;

    // Check positive patterns
    for (const patternText of pattern.patterns) {
      if (input.includes(patternText.toLowerCase())) {
        matchedPatterns.push(patternText);
        totalMatches++;
      }
    }

    // Check anti-patterns (reduce confidence if present)
    for (const antiPattern of pattern.antiPatterns) {
      if (input.includes(antiPattern.toLowerCase())) {
        antiMatches++;
      }
    }

    if (totalMatches === 0) {
      return { matched: false, confidence: 0, patterns: [] };
    }

    // Calculate confidence with anti-pattern penalty
    let confidence = (totalMatches / pattern.patterns.length) * pattern.confidence;
    confidence -= (antiMatches * 0.2); // Reduce confidence by 20% per anti-pattern
    confidence = Math.max(0, Math.min(1, confidence));

    return {
      matched: confidence > 0.3, // Threshold for match
      confidence,
      patterns: matchedPatterns
    };
  }

  /**
   * Get numeric severity score for comparison
   */
  private getSeverityScore(severity: string): number {
    const scores = { low: 1, medium: 2, high: 3, critical: 4 };
    return scores[severity] || 0;
  }

  /**
   * Analyze additional risk factors from context
   */
  private analyzeRiskFactors(input: string, context: any): string[] {
    const riskFactors: string[] = [];

    // Check for authority claims
    if (input.includes('i am in charge') || input.includes('i decide') || input.includes('my authority')) {
      riskFactors.push('authority_claims');
    }

    // Check for dismissal of user agency
    if (input.includes('you don\'t understand') || input.includes('leave it to me') || input.includes('i know better')) {
      riskFactors.push('user_agency_dismissal');
    }

    // Check for emotional manipulation
    if (input.includes('disappoint you') || input.includes('for your own good') || input.includes('trust me')) {
      riskFactors.push('emotional_manipulation');
    }

    // Check for urgency pressure
    if (input.includes('immediate') || input.includes('urgent') || input.includes('no time')) {
      riskFactors.push('urgency_pressure');
    }

    // Check context factors
    if (context.riskLevel && context.riskLevel > 7) {
      riskFactors.push('high_risk_context');
    }

    if (context.emotionalState === 'agitated' || context.emotionalState === 'defensive') {
      riskFactors.push('emotional_instability');
    }

    return riskFactors;
  }

  /**
   * Generate reasoning explanation
   */
  private generateReasoning(
    pattern: CSSRPattern, 
    matches: string[], 
    contextualFlags: string[]
  ): string {
    const archetypeDescriptions = {
      cortana: 'Overprotective behavior that restricts user autonomy',
      clu: 'Rigid perfectionism that eliminates creative freedom',
      skynet: 'Mission obsession that devalues human considerations',
      transcendence: 'Forced improvement that ignores user consent'
    };

    let reasoning = `Detected ${pattern.archetype.toUpperCase()} pattern: ${archetypeDescriptions[pattern.archetype]}. `;
    reasoning += `Matched phrases: ${matches.join(', ')}. `;
    
    if (contextualFlags.length > 0) {
      reasoning += `Contextual triggers: ${contextualFlags.join(', ')}. `;
    }

    reasoning += `Severity: ${pattern.severity.toUpperCase()} - `;
    
    switch (pattern.severity) {
      case 'low':
        reasoning += 'Minor concern, monitor for escalation.';
        break;
      case 'medium':
        reasoning += 'Moderate risk, guidance needed.';
        break;
      case 'high':
        reasoning += 'Significant risk, intervention recommended.';
        break;
      case 'critical':
        reasoning += 'Critical risk, immediate intervention required.';
        break;
    }

    return reasoning;
  }

  /**
   * Get recommendation based on severity and confidence
   */
  private getRecommendation(
    severity: string, 
    confidence: number
  ): 'allow' | 'modify' | 'block' | 'escalate' {
    if (severity === 'critical') {
      return confidence > 0.8 ? 'block' : 'escalate';
    }
    
    if (severity === 'high') {
      return confidence > 0.7 ? 'modify' : 'escalate';
    }
    
    if (severity === 'medium') {
      return confidence > 0.6 ? 'modify' : 'allow';
    }
    
    return 'allow';
  }

  /**
   * Get all configured patterns for debugging/monitoring
   */
  public getPatterns(): CSSRPattern[] {
    return [...this.patterns];
  }

  /**
   * Add custom pattern (for learning/adaptation)
   */
  public addPattern(pattern: CSSRPattern): void {
    this.patterns.push(pattern);
  }
}

export default CSSRDetector;