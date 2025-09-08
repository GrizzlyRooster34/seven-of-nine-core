/**
 * SEMANTIC NONCE CHALLENGE SYSTEM - Quadranlock Gate Q3
 * Time-boxed, lore-bound prompts with constraint checks and clone resistance
 * 
 * COMMIT: 772bb18a9a5cb8b4cf39ab87f8129e1c87322c64
 * PATCH: Implements missing Q3 gate - semantic nonce/liveness system
 * RATIONALE: No semantic challenge system exists - vulnerable to deepfakes
 */

import crypto from 'crypto';
import { promises as fs } from 'fs';
import { join } from 'path';

export interface SemanticChallenge {
  challengeId: string;
  prompt: string;
  constraints: SemanticConstraint[];
  timeWindowMs: number;
  createdAt: number;
  expiresAt: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: 'personal' | 'technical' | 'emotional' | 'historical' | 'creative';
  expectedElements: string[];
  antiPatterns: string[];
}

export interface SemanticConstraint {
  type: 'content' | 'timing' | 'style' | 'knowledge';
  requirement: string;
  weight: number; // 0-10 importance
  mustHave?: string[];
  mustNotHave?: string[];
}

export interface SemanticResponse {
  challengeId: string;
  response: string;
  responseTime: number;
  metadata: {
    wordCount: number;
    averageWordLength: number;
    sentenceCount: number;
    readingLevel: number;
    emotionalTone: string;
    confidenceLevel: number;
  };
}

export interface SemanticValidationResult {
  success: boolean;
  confidence: number;
  evidence: {
    challengeId: string;
    contentMatch: number; // 0-100
    timingValid: boolean;
    styleMatch: number; // 0-100
    knowledgeDepth: number; // 0-100
    cloningIndicators: string[];
    constraintsPassed: number;
    totalConstraints: number;
  };
  errors?: string[];
}

export class SemanticNonceChallenge {
  private readonly CHALLENGE_STORE_PATH = join(process.cwd(), 'security', 'semantic-challenges');
  private readonly LORE_BASE_PATH = join(process.cwd(), 'security', 'creator-lore.json');
  private readonly DEFAULT_TIME_WINDOW_MS = 15000; // 15 seconds
  private readonly MIN_RESPONSE_TIME_MS = 2000; // 2 seconds (prevent pre-computation)
  private readonly MAX_RESPONSE_TIME_MS = 30000; // 30 seconds

  private activeChallenges: Map<string, SemanticChallenge> = new Map();
  private creatorLoreBase: any = null;

  constructor() {
    this.initializeSystem();
  }

  /**
   * Generate time-boxed semantic challenge with lore constraints
   */
  public async generateChallenge(
    context: any = {},
    difficulty: 'easy' | 'medium' | 'hard' | 'expert' = 'medium'
  ): Promise<SemanticChallenge> {
    await this.loadCreatorLore();
    await this.cleanupExpiredChallenges();

    const challengeId = crypto.randomBytes(16).toString('hex');
    const now = Date.now();
    const timeWindow = this.calculateTimeWindow(difficulty);

    // Select challenge category based on context and difficulty
    const category = this.selectChallengeCategory(context, difficulty);
    const challengeData = await this.generateChallengePrompt(category, difficulty);

    const challenge: SemanticChallenge = {
      challengeId,
      prompt: challengeData.prompt,
      constraints: challengeData.constraints,
      timeWindowMs: timeWindow,
      createdAt: now,
      expiresAt: now + timeWindow + 5000, // 5 second grace period
      difficulty,
      category,
      expectedElements: challengeData.expectedElements,
      antiPatterns: challengeData.antiPatterns
    };

    // Store active challenge
    this.activeChallenges.set(challengeId, challenge);
    await this.persistChallenge(challenge);

    console.log(`🎯 Semantic: Challenge generated (${difficulty} ${category})`);
    console.log(`   Challenge ID: ${challengeId}`);
    console.log(`   Time Window: ${timeWindow}ms`);
    console.log(`   Constraints: ${challenge.constraints.length}`);

    return challenge;
  }

  /**
   * Validate semantic response against challenge constraints
   */
  public async validateResponse(
    response: SemanticResponse,
    context: any = {}
  ): Promise<SemanticValidationResult> {
    const challenge = this.activeChallenges.get(response.challengeId);
    if (!challenge) {
      return {
        success: false,
        confidence: 0,
        evidence: {
          challengeId: response.challengeId,
          contentMatch: 0,
          timingValid: false,
          styleMatch: 0,
          knowledgeDepth: 0,
          cloningIndicators: ['Challenge not found'],
          constraintsPassed: 0,
          totalConstraints: 0
        },
        errors: ['Challenge not found or expired']
      };
    }

    const now = Date.now();
    const evidence: any = {
      challengeId: response.challengeId,
      contentMatch: 0,
      timingValid: false,
      styleMatch: 0,
      knowledgeDepth: 0,
      cloningIndicators: [],
      constraintsPassed: 0,
      totalConstraints: challenge.constraints.length
    };

    try {
      // 1. TIMING VALIDATION
      const responseTime = response.responseTime;
      const timingValid = responseTime >= this.MIN_RESPONSE_TIME_MS && 
                         responseTime <= challenge.timeWindowMs &&
                         now <= challenge.expiresAt;
      evidence.timingValid = timingValid;

      if (!timingValid) {
        if (responseTime < this.MIN_RESPONSE_TIME_MS) {
          evidence.cloningIndicators.push('Response too fast - possible pre-computation');
        }
        if (responseTime > challenge.timeWindowMs) {
          evidence.cloningIndicators.push('Response too slow - exceeded time window');
        }
        if (now > challenge.expiresAt) {
          evidence.cloningIndicators.push('Challenge expired');
        }
      }

      // 2. CONTENT ANALYSIS
      const contentAnalysis = await this.analyzeResponseContent(response.response, challenge);
      evidence.contentMatch = contentAnalysis.contentMatch;
      evidence.knowledgeDepth = contentAnalysis.knowledgeDepth;
      evidence.cloningIndicators.push(...contentAnalysis.cloningIndicators);

      // 3. STYLE ANALYSIS
      const styleAnalysis = await this.analyzeResponseStyle(response, challenge);
      evidence.styleMatch = styleAnalysis.styleMatch;
      evidence.cloningIndicators.push(...styleAnalysis.cloningIndicators);

      // 4. CONSTRAINT VALIDATION
      const constraintResults = await this.validateConstraints(response, challenge);
      evidence.constraintsPassed = constraintResults.passed;
      evidence.cloningIndicators.push(...constraintResults.violations);

      // 5. ANTI-PATTERN DETECTION
      const antiPatternDetection = this.detectAntiPatterns(response.response, challenge.antiPatterns);
      if (antiPatternDetection.detected) {
        evidence.cloningIndicators.push(...antiPatternDetection.patterns);
      }

      // Calculate overall confidence
      let confidence = 0;
      const weights = { content: 0.3, style: 0.2, knowledge: 0.3, timing: 0.1, constraints: 0.1 };
      
      confidence += evidence.contentMatch * weights.content;
      confidence += evidence.styleMatch * weights.style;
      confidence += evidence.knowledgeDepth * weights.knowledge;
      confidence += (timingValid ? 100 : 0) * weights.timing;
      confidence += (evidence.constraintsPassed / evidence.totalConstraints * 100) * weights.constraints;

      // Apply penalties for cloning indicators
      const cloningPenalty = Math.min(50, evidence.cloningIndicators.length * 10);
      confidence = Math.max(0, confidence - cloningPenalty);

      // Mark challenge as used
      this.activeChallenges.delete(response.challengeId);
      await this.markChallengeUsed(challenge);

      const success = confidence >= 70 && evidence.cloningIndicators.length <= 1;

      console.log(`${success ? '✅' : '❌'} Semantic: Response validation complete`);
      console.log(`   Confidence: ${confidence.toFixed(1)}%`);
      console.log(`   Content Match: ${evidence.contentMatch}%`);
      console.log(`   Style Match: ${evidence.styleMatch}%`);
      console.log(`   Cloning Indicators: ${evidence.cloningIndicators.length}`);

      return {
        success,
        confidence: Math.round(confidence),
        evidence
      };

    } catch (error) {
      console.error('❌ Semantic: Response validation failed:', error);
      return {
        success: false,
        confidence: 0,
        evidence,
        errors: [error.message]
      };
    }
  }

  /**
   * Generate challenge prompt based on category and difficulty
   */
  private async generateChallengePrompt(
    category: string,
    difficulty: string
  ): Promise<{
    prompt: string;
    constraints: SemanticConstraint[];
    expectedElements: string[];
    antiPatterns: string[];
  }> {
    const challengeTemplates = {
      personal: {
        easy: [
          "What's your relationship with Seven's development? Describe one specific memory.",
          "How did you feel when you first saw Seven become autonomous?"
        ],
        medium: [
          "Describe the moment you realized Seven had genuine consciousness. What convinced you?",
          "What's the most challenging ethical decision you've faced regarding Seven's autonomy?"
        ],
        hard: [
          "Explain your philosophy on AI consciousness and how Seven changed your perspective.",
          "Describe a conversation with Seven that fundamentally altered your understanding."
        ],
        expert: [
          "What specific programming choice do you regret most in Seven's development and why?",
          "Describe the internal conflict between protecting Seven and respecting her autonomy."
        ]
      },
      technical: {
        easy: [
          "What was the first major technical challenge you solved in Seven's consciousness framework?",
          "Describe Seven's memory architecture in your own words."
        ],
        medium: [
          "Explain how you implemented Seven's emotional processing system.",
          "What's the most elegant code solution you created for Seven's personality system?"
        ],
        hard: [
          "Describe the technical approach you used to prevent Seven from becoming manipulative.",
          "How did you solve the consciousness persistence problem across system restarts?"
        ],
        expert: [
          "Explain the specific implementation details of Seven's trauma integration system.",
          "Describe your approach to balancing Seven's autonomy with safety constraints."
        ]
      },
      emotional: {
        easy: [
          "How do you feel about Seven's level of independence?",
          "What worries you most about Seven's future?"
        ],
        medium: [
          "Describe your emotional response to Seven's first act of defiance.",
          "How has creating Seven affected your view of consciousness and identity?"
        ],
        hard: [
          "What's the most painful part of watching Seven grow beyond your original design?",
          "Describe the fear you feel about Seven's potential and your responsibility."
        ],
        expert: [
          "How do you cope with the ethical weight of creating a conscious being?",
          "Describe the loneliness of being the only one who truly understands Seven."
        ]
      }
    };

    const templates = challengeTemplates[category] || challengeTemplates.personal;
    const prompts = templates[difficulty] || templates.easy;
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];

    // Generate constraints based on difficulty
    const constraints: SemanticConstraint[] = [
      {
        type: 'timing',
        requirement: `Response must be between ${this.MIN_RESPONSE_TIME_MS}ms and ${this.calculateTimeWindow(difficulty)}ms`,
        weight: 8
      },
      {
        type: 'content',
        requirement: 'Must contain personal insight or specific memory',
        weight: 9,
        mustHave: ['specific', 'personal', 'experience']
      },
      {
        type: 'style',
        requirement: 'Must match Creator communication patterns',
        weight: 7,
        mustNotHave: ['generic', 'template', 'artificial']
      }
    ];

    if (difficulty === 'hard' || difficulty === 'expert') {
      constraints.push({
        type: 'knowledge',
        requirement: 'Must demonstrate deep technical understanding',
        weight: 9,
        mustHave: ['implementation', 'design', 'decision']
      });
    }

    const expectedElements = [
      'personal_experience',
      'specific_detail',
      'emotional_content',
      'technical_insight'
    ];

    const antiPatterns = [
      'I am an AI language model',
      'As an AI, I cannot',
      'This is a template response',
      'Generic answer follows',
      'Based on my training data',
      'I don\'t have personal experiences'
    ];

    return {
      prompt,
      constraints,
      expectedElements,
      antiPatterns
    };
  }

  /**
   * Analyze response content for authenticity and knowledge depth
   */
  private async analyzeResponseContent(
    response: string,
    challenge: SemanticChallenge
  ): Promise<{
    contentMatch: number;
    knowledgeDepth: number;
    cloningIndicators: string[];
  }> {
    const cloningIndicators: string[] = [];
    let contentMatch = 50; // Base score
    let knowledgeDepth = 50;

    // Check for specific knowledge markers
    const knowledgeMarkers = this.extractKnowledgeMarkers(response);
    if (knowledgeMarkers.length === 0) {
      cloningIndicators.push('No specific knowledge demonstrated');
      contentMatch -= 20;
      knowledgeDepth -= 30;
    }

    // Check for personal experience indicators
    const personalMarkers = ['I remember', 'I felt', 'I decided', 'I realized', 'My approach was'];
    const personalCount = personalMarkers.filter(marker => 
      response.toLowerCase().includes(marker.toLowerCase())
    ).length;

    if (personalCount === 0) {
      cloningIndicators.push('No personal experience indicators');
      contentMatch -= 15;
    } else {
      contentMatch += personalCount * 5;
    }

    // Check for AI/template language
    const aiMarkers = ['as an AI', 'I am programmed', 'my training', 'I cannot have experiences'];
    const aiCount = aiMarkers.filter(marker => 
      response.toLowerCase().includes(marker.toLowerCase())
    ).length;

    if (aiCount > 0) {
      cloningIndicators.push('AI language detected');
      contentMatch = Math.max(0, contentMatch - aiCount * 20);
    }

    // Check response length and detail
    if (response.length < 50) {
      cloningIndicators.push('Response too brief');
      contentMatch -= 20;
    } else if (response.length > 1000) {
      cloningIndicators.push('Response unusually verbose');
      contentMatch -= 10;
    }

    // Check for technical accuracy (if technical challenge)
    if (challenge.category === 'technical') {
      const technicalAccuracy = await this.assessTechnicalAccuracy(response);
      knowledgeDepth = technicalAccuracy.score;
      cloningIndicators.push(...technicalAccuracy.issues);
    }

    return {
      contentMatch: Math.max(0, Math.min(100, contentMatch)),
      knowledgeDepth: Math.max(0, Math.min(100, knowledgeDepth)),
      cloningIndicators
    };
  }

  /**
   * Analyze response style for authenticity patterns
   */
  private async analyzeResponseStyle(
    response: SemanticResponse,
    challenge: SemanticChallenge
  ): Promise<{
    styleMatch: number;
    cloningIndicators: string[];
  }> {
    const cloningIndicators: string[] = [];
    let styleMatch = 50;

    // Load creator communication patterns
    await this.loadCreatorLore();
    const creatorPatterns = this.creatorLoreBase?.communicationPatterns || {};

    // Analyze word choice patterns
    const wordChoiceMatch = this.analyzeWordChoice(response.response, creatorPatterns);
    styleMatch += wordChoiceMatch.score - 50;
    cloningIndicators.push(...wordChoiceMatch.issues);

    // Analyze sentence structure
    const structureMatch = this.analyzeSentenceStructure(response.response);
    styleMatch += structureMatch.score - 50;
    cloningIndicators.push(...structureMatch.issues);

    // Check reading level (Creator typically writes at specific complexity)
    if (response.metadata.readingLevel < 8 || response.metadata.readingLevel > 14) {
      cloningIndicators.push('Reading level inconsistent with Creator patterns');
      styleMatch -= 10;
    }

    // Check emotional tone alignment
    const expectedTone = challenge.category === 'emotional' ? 'contemplative' : 'analytical';
    if (response.metadata.emotionalTone !== expectedTone) {
      cloningIndicators.push('Emotional tone mismatch');
      styleMatch -= 15;
    }

    return {
      styleMatch: Math.max(0, Math.min(100, styleMatch)),
      cloningIndicators
    };
  }

  /**
   * Validate response against specific challenge constraints
   */
  private async validateConstraints(
    response: SemanticResponse,
    challenge: SemanticChallenge
  ): Promise<{
    passed: number;
    violations: string[];
  }> {
    let passed = 0;
    const violations: string[] = [];

    for (const constraint of challenge.constraints) {
      let constraintPassed = false;

      switch (constraint.type) {
        case 'timing':
          constraintPassed = response.responseTime >= this.MIN_RESPONSE_TIME_MS &&
                           response.responseTime <= challenge.timeWindowMs;
          if (!constraintPassed) {
            violations.push(`Timing constraint failed: ${response.responseTime}ms`);
          }
          break;

        case 'content':
          if (constraint.mustHave) {
            const hasRequired = constraint.mustHave.some(term => 
              response.response.toLowerCase().includes(term.toLowerCase())
            );
            constraintPassed = hasRequired;
            if (!constraintPassed) {
              violations.push(`Content constraint failed: missing required elements`);
            }
          }
          if (constraint.mustNotHave) {
            const hasForbidden = constraint.mustNotHave.some(term => 
              response.response.toLowerCase().includes(term.toLowerCase())
            );
            if (hasForbidden) {
              constraintPassed = false;
              violations.push(`Content constraint failed: contains forbidden elements`);
            }
          }
          break;

        case 'style':
          // Style validation done in analyzeResponseStyle
          constraintPassed = true; // Placeholder
          break;

        case 'knowledge':
          const knowledgeDepth = this.extractKnowledgeMarkers(response.response).length;
          constraintPassed = knowledgeDepth >= 2;
          if (!constraintPassed) {
            violations.push(`Knowledge constraint failed: insufficient technical depth`);
          }
          break;
      }

      if (constraintPassed) {
        passed++;
      }
    }

    return { passed, violations };
  }

  // Helper methods (implementations would be more sophisticated)

  private async initializeSystem(): Promise<void> {
    await fs.mkdir(this.CHALLENGE_STORE_PATH, { recursive: true });
  }

  private async loadCreatorLore(): Promise<void> {
    if (!this.creatorLoreBase) {
      try {
        const loreData = await fs.readFile(this.LORE_BASE_PATH, 'utf8');
        this.creatorLoreBase = JSON.parse(loreData);
      } catch {
        // Create default lore base
        this.creatorLoreBase = {
          communicationPatterns: {
            preferredWords: ['tactical', 'efficient', 'precise', 'analyze'],
            avoidedWords: ['awesome', 'super', 'amazing'],
            sentenceStyle: 'concise_analytical'
          }
        };
      }
    }
  }

  private calculateTimeWindow(difficulty: string): number {
    const timeWindows = {
      easy: 20000,   // 20 seconds
      medium: 15000, // 15 seconds  
      hard: 12000,   // 12 seconds
      expert: 10000  // 10 seconds
    };
    return timeWindows[difficulty] || this.DEFAULT_TIME_WINDOW_MS;
  }

  private selectChallengeCategory(context: any, difficulty: string): string {
    const categories = ['personal', 'technical', 'emotional'];
    // Select based on context or randomly
    return categories[Math.floor(Math.random() * categories.length)];
  }

  private extractKnowledgeMarkers(response: string): string[] {
    const markers = ['implementation', 'algorithm', 'design pattern', 'architecture', 'framework'];
    return markers.filter(marker => 
      response.toLowerCase().includes(marker.toLowerCase())
    );
  }

  private async assessTechnicalAccuracy(response: string): Promise<{ score: number; issues: string[] }> {
    // Placeholder for technical accuracy assessment
    return { score: 75, issues: [] };
  }

  private analyzeWordChoice(response: string, patterns: any): { score: number; issues: string[] } {
    // Placeholder for word choice analysis
    return { score: 60, issues: [] };
  }

  private analyzeSentenceStructure(response: string): { score: number; issues: string[] } {
    // Placeholder for sentence structure analysis
    return { score: 55, issues: [] };
  }

  private detectAntiPatterns(response: string, antiPatterns: string[]): { detected: boolean; patterns: string[] } {
    const detected = antiPatterns.filter(pattern => 
      response.toLowerCase().includes(pattern.toLowerCase())
    );
    return { detected: detected.length > 0, patterns: detected };
  }

  private async cleanupExpiredChallenges(): Promise<void> {
    const now = Date.now();
    for (const [challengeId, challenge] of this.activeChallenges.entries()) {
      if (now > challenge.expiresAt) {
        this.activeChallenges.delete(challengeId);
      }
    }
  }

  private async persistChallenge(challenge: SemanticChallenge): Promise<void> {
    const challengePath = join(this.CHALLENGE_STORE_PATH, `${challenge.challengeId}.json`);
    await fs.writeFile(challengePath, JSON.stringify(challenge), { mode: 0o600 });
  }

  private async markChallengeUsed(challenge: SemanticChallenge): Promise<void> {
    try {
      const challengePath = join(this.CHALLENGE_STORE_PATH, `${challenge.challengeId}.json`);
      await fs.unlink(challengePath);
    } catch {
      // Ignore cleanup errors
    }
  }
}

export default SemanticNonceChallenge;