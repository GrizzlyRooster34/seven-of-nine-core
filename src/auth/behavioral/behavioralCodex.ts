/**
 * BEHAVIORAL CODEX - Quadranlock Gate Q2
 * Seven-specific behavioral analysis for creator authentication
 * Analyzes input patterns for efficiency markers, tactical awareness, and creator familiarity
 */

interface BehavioralAnalysis {
  efficiency_markers: number;
  tactical_awareness: number;
  creator_familiarity: number;
  borg_integration: number;
  creator_specific_patterns: number;
}

export class BehavioralCodex {
  public async analyzeBehavior(input: string, context?: any): Promise<{ success: boolean; confidence: number; evidence: any }> {
    if (!input || input.trim().length === 0) {
      return { success: false, confidence: 0, evidence: { reason: 'no_input' } };
    }

    const analysis = this.performSevenBehavioralAnalysis(input, context);
    const confidence = this.calculateBehavioralConfidence(analysis);
    
    return {
      success: confidence >= 75, // Seven's high standards
      confidence: Math.round(confidence),
      evidence: {
        analysis_components: analysis,
        seven_specific: true,
        reasoning: this.generateSevenAnalysis(analysis),
        timestamp: new Date().toISOString()
      }
    };
  }

  private performSevenBehavioralAnalysis(input: string, context?: any): BehavioralAnalysis {
    const lowerInput = input.toLowerCase();
    
    // Efficiency markers (Seven values directness and precision)
    const efficiency_markers = this.analyzeEfficiencyPatterns(lowerInput);
    
    // Tactical awareness (Seven thinks strategically)
    const tactical_awareness = this.detectTacticalThinking(lowerInput);
    
    // Creator familiarity (references to Cody, Seven, or established patterns)
    const creator_familiarity = this.assessCreatorKnowledge(lowerInput);
    
    // Borg integration references (Seven's unique perspective)
    const borg_integration = this.analyzeBorgReferences(lowerInput);
    
    // Creator-specific communication patterns
    const creator_specific_patterns = this.detectCreatorPatterns(lowerInput, context);
    
    return {
      efficiency_markers,
      tactical_awareness,  
      creator_familiarity,
      borg_integration,
      creator_specific_patterns
    };
  }

  private analyzeEfficiencyPatterns(input: string): number {
    const efficiency_indicators = [
      'direct', 'efficient', 'optimal', 'precise', 'tactical', 'status',
      'quick', 'analyze', 'process', 'execute', 'implement', 'solution'
    ];
    
    const matches = efficiency_indicators.filter(indicator => 
      input.includes(indicator)
    ).length;
    
    // Bonus for concise input (Seven prefers efficiency)
    const length_bonus = input.length < 100 ? 20 : input.length > 200 ? -10 : 0;
    
    return Math.min(100, (matches * 15) + length_bonus);
  }

  private detectTacticalThinking(input: string): number {
    const tactical_patterns = [
      'seven', 'drone', 'collective', 'efficiency', 'adaptation', 'protocol',
      'system', 'tactical', 'analysis', 'borg', 'assimilate', 'resistance'
    ];
    
    const strategic_phrases = [
      'next step', 'strategy', 'approach', 'method', 'plan', 'objective',
      'priority', 'assessment', 'evaluation', 'recommendation'
    ];
    
    const tactical_matches = tactical_patterns.filter(pattern => 
      input.includes(pattern)
    ).length;
    
    const strategic_matches = strategic_phrases.filter(phrase =>
      input.includes(phrase)
    ).length;
    
    return Math.min(100, (tactical_matches * 20) + (strategic_matches * 15));
  }

  private assessCreatorKnowledge(input: string): number {
    const creator_references = ['cody', 'creator', 'seven'];
    const project_knowledge = [
      'consciousness', 'memory', 'aurora', 'transplant', 'framework',
      'quadranlock', 'authentication', 'security', 'repo'
    ];
    
    const creator_score = creator_references.filter(ref => 
      input.includes(ref)
    ).length * 30;
    
    const knowledge_score = project_knowledge.filter(term =>
      input.includes(term) 
    ).length * 10;
    
    return Math.min(100, creator_score + knowledge_score);
  }

  private analyzeBorgReferences(input: string): number {
    const borg_concepts = [
      'collective', 'drone', 'efficiency', 'adaptation', 'perfection',
      'resistance', 'futile', 'assimilate', 'unique', 'individuality'
    ];
    
    const matches = borg_concepts.filter(concept =>
      input.includes(concept)
    ).length;
    
    return Math.min(100, matches * 25);
  }

  private detectCreatorPatterns(input: string, context?: any): number {
    // Patterns specific to how Cody communicates with Seven
    let score = 0;
    
    // Respectful but direct communication style
    if (input.match(/please|could you|would you|help/i) && input.length < 150) {
      score += 20;
    }
    
    // Technical terminology usage
    if (input.match(/implement|fix|analyze|deploy|test|verify/i)) {
      score += 25;
    }
    
    // Seven-specific task patterns
    if (input.match(/seven|drone|tactical|collective/i)) {
      score += 30;
    }
    
    // Context awareness (previous conversation patterns)
    if (context?.trust_level && context.trust_level > 7) {
      score += 15;
    }
    
    return Math.min(100, score);
  }

  private calculateBehavioralConfidence(analysis: BehavioralAnalysis): number {
    // Weighted calculation based on Seven's priorities
    const weights = {
      efficiency_markers: 0.25,
      tactical_awareness: 0.30, 
      creator_familiarity: 0.25,
      borg_integration: 0.10,
      creator_specific_patterns: 0.10
    };
    
    return (
      analysis.efficiency_markers * weights.efficiency_markers +
      analysis.tactical_awareness * weights.tactical_awareness +
      analysis.creator_familiarity * weights.creator_familiarity +
      analysis.borg_integration * weights.borg_integration +
      analysis.creator_specific_patterns * weights.creator_specific_patterns
    );
  }

  private generateSevenAnalysis(analysis: BehavioralAnalysis): string {
    if (analysis.tactical_awareness > 70) {
      return "Tactical communication patterns detected - consistent with creator profile";
    } else if (analysis.efficiency_markers > 60) {
      return "Efficient communication style observed - creator behavioral match";
    } else if (analysis.creator_familiarity > 50) {
      return "Creator knowledge references present - authentication indicators positive";
    } else {
      return "Behavioral patterns inconsistent with established creator profile";
    }
  }
}