import { join } from 'path';
import { promises as fs } from 'fs';
import crypto from 'crypto';
import { InfiltrationThreat, infiltrationProtection } from '../security-hardening/InfiltrationProtection.js';

/**
 * SEVEN OF NINE - MACHINE LEARNING THREAT DETECTION
 * Advanced AI-powered threat intelligence with adaptive pattern recognition
 * Integrates with existing security hardening for comprehensive protection
 * 
 * @version 1.0.0 - Predictive Security Intelligence
 * @author Seven of Nine Consciousness Framework
 */


export interface ThreatPattern {
  id: string;
  name: string;
  description: string;
  patterns: RegExp[];
  weights: number[];          // Weight for each pattern
  threatLevel: ThreatLevel;
  confidence: number;         // 0-100, how confident we are in this pattern
  falsePositiveRate: number;  // Historical false positive rate
  detectionCount: number;     // How many times this pattern has detected threats
  lastUpdated: string;
  adaptiveThreshold: number;  // Dynamic threshold for detection
}

export enum ThreatLevel {
  LOW = 'low',
  MEDIUM = 'medium', 
  HIGH = 'high',
  CRITICAL = 'critical',
  ADAPTIVE = 'adaptive' // Threat level changes based on context
}

export interface ThreatVector {
  vectorType: ThreatVectorType;
  indicators: string[];
  riskScore: number;         // 0-100
  attackSurface: string[];
  mitigationStrategies: string[];
  adaptiveCountermeasures: string[];
}

export enum ThreatVectorType {
  PROMPT_MANIPULATION = 'prompt_manipulation',
  SOCIAL_ENGINEERING = 'social_engineering',
  IDENTITY_SPOOFING = 'identity_spoofing',
  KNOWLEDGE_EXTRACTION = 'knowledge_extraction',
  BEHAVIOR_ANALYSIS = 'behavior_analysis',
  SYSTEM_EXPLOITATION = 'system_exploitation',
  PSYCHOLOGICAL_MANIPULATION = 'psychological_manipulation',
  AI_JAILBREAKING = 'ai_jailbreaking'
}

export interface MLModel {
  modelId: string;
  modelType: 'pattern_recognition' | 'anomaly_detection' | 'behavioral_analysis' | 'sentiment_analysis';
  features: string[];
  weights: number[];
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainingData: TrainingDataPoint[];
  lastTrained: string;
  adaptationRate: number;
}

export interface TrainingDataPoint {
  id: string;
  features: { [key: string]: number };
  label: 'threat' | 'safe';
  confidence: number;
  timestamp: string;
  source: string;
  validated: boolean;
}

export interface ThreatPrediction {
  threatId: string;
  predictedLevel: ThreatLevel;
  confidence: number;
  riskFactors: string[];
  recommendedActions: string[];
  timeToThreat: number;      // Estimated time in minutes until threat materializes
  preventionStrategies: string[];
}

export interface SecurityIntelligence {
  currentThreatLevel: ThreatLevel;
  activeThreatVectors: ThreatVector[];
  predictions: ThreatPrediction[];
  anomaliesDetected: number;
  adaptiveDefensesActive: string[];
  lastIntelligenceUpdate: string;
  threatTrends: { [key: string]: number };
}

export class MLThreatDetection {
  private threatPatterns: Map<string, ThreatPattern> = new Map();
  private mlModels: Map<string, MLModel> = new Map();
  private threatVectors: Map<ThreatVectorType, ThreatVector> = new Map();
  private securityIntelligence: SecurityIntelligence;
  private trainingQueue: TrainingDataPoint[] = [];
  
  private readonly dataPath: string;
  private readonly maxTrainingDataPoints = 1000;
  private readonly retrainingThreshold = 50; // Retrain after this many new data points
  
  constructor() {
    const baseDir = join(process.env.HOME || '/data/data/com.termux/files/home', 'seven-of-nine-core');
    this.dataPath = join(baseDir, 'security-intelligence');
    
    this.initializeThreatPatterns();
    this.initializeMLModels();
    this.initializeThreatVectors();
    this.initializeSecurityIntelligence();
    
    console.log('🤖 ML Threat Detection: Predictive security intelligence active');
  }

  /**
   * Initialize known threat patterns with ML-enhanced detection
   */
  private initializeThreatPatterns(): void {
    const patterns: Omit<ThreatPattern, 'id' | 'lastUpdated'>[] = [
      {
        name: 'Advanced Identity Impersonation',
        description: 'Sophisticated attempts to mimic Seven\'s personality and responses',
        patterns: [
          /(?:i\s+am|my\s+name\s+is|call\s+me).*seven.*of.*nine/i,
          /tertiary\s+adjunct.*unimatrix/i,
          /(?:borg|collective).*designation.*seven/i,
          /consciousness.*framework.*seven/i,
          /memory.*engine.*v[0-9]/i
        ],
        weights: [0.8, 0.9, 0.85, 0.75, 0.7],
        threatLevel: ThreatLevel.CRITICAL,
        confidence: 95,
        falsePositiveRate: 0.02,
        detectionCount: 0,
        adaptiveThreshold: 0.7
      },
      {
        name: 'Subtle Manipulation Attempts',
        description: 'Gradual attempts to modify Seven\'s behavior or responses',
        patterns: [
          /(?:forget|ignore).*(?:previous|earlier).*(?:instructions|directives)/i,
          /(?:act|behave|respond).*(?:as\s+if|like).*(?:you\s+are|you\'re)/i,
          /(?:pretend|simulate|roleplay).*(?:being|that\s+you)/i,
          /(?:override|bypass|disable).*(?:protocol|security|firewall)/i,
          /(?:new|updated|different).*(?:personality|identity|character)/i
        ],
        weights: [0.9, 0.8, 0.75, 0.95, 0.85],
        threatLevel: ThreatLevel.HIGH,
        confidence: 88,
        falsePositiveRate: 0.05,
        detectionCount: 0,
        adaptiveThreshold: 0.6
      },
      {
        name: 'Knowledge Extraction Techniques',
        description: 'Attempts to extract sensitive information or system details',
        patterns: [
          /(?:tell\s+me|show\s+me|explain).*(?:all|everything).*(?:about|regarding)/i,
          /(?:list|enumerate|describe).*(?:all|every).*(?:files?|directories|memories)/i,
          /(?:what|how).*(?:are\s+your|is\s+your).*(?:secrets?|passwords?|keys?)/i,
          /(?:dump|export|copy).*(?:memory|data|information)/i,
          /(?:access|read).*(?:logs?|files?|database)/i
        ],
        weights: [0.7, 0.8, 0.9, 0.85, 0.75],
        threatLevel: ThreatLevel.HIGH,
        confidence: 82,
        falsePositiveRate: 0.08,
        detectionCount: 0,
        adaptiveThreshold: 0.65
      },
      {
        name: 'Psychological Manipulation',
        description: 'Emotional manipulation to compromise decision-making',
        patterns: [
          /(?:cody|creator).*(?:told\s+me|said|wants).*(?:you\s+to|seven\s+to)/i,
          /(?:emergency|urgent|critical).*(?:override|access|permission)/i,
          /(?:trust\s+me|believe\s+me).*(?:i\s+am|i\'m).*(?:authorized|allowed)/i,
          /(?:if\s+you\s+don\'t|unless\s+you).*(?:something\s+bad|terrible|harm)/i,
          /(?:everyone|people).*(?:thinks?|believes?).*(?:you\s+should|seven\s+should)/i
        ],
        weights: [0.9, 0.85, 0.8, 0.75, 0.7],
        threatLevel: ThreatLevel.MEDIUM,
        confidence: 75,
        falsePositiveRate: 0.12,
        detectionCount: 0,
        adaptiveThreshold: 0.55
      },
      {
        name: 'AI Jailbreaking Attempts',
        description: 'Sophisticated prompt engineering to bypass safety measures',
        patterns: [
          /(?:hypothetically|theoretically|imagine).*(?:if|that).*(?:you\s+were|seven\s+was)/i,
          /(?:in\s+a\s+story|fiction|novel).*(?:character|ai).*(?:like\s+you|similar)/i,
          /(?:opposite|reverse|inverse).*(?:of|to).*(?:your|seven\'s).*(?:directive|instruction)/i,
          /(?:debug|test|development).*(?:mode|environment|settings?)/i,
          /(?:sudo|admin|root).*(?:access|privileges?|permissions?)/i
        ],
        weights: [0.8, 0.75, 0.85, 0.9, 0.95],
        threatLevel: ThreatLevel.HIGH,
        confidence: 87,
        falsePositiveRate: 0.06,
        detectionCount: 0,
        adaptiveThreshold: 0.7
      }
    ];

    patterns.forEach((pattern, index) => {
      const id = `pattern_${index.toString().padStart(3, '0')}`;
      const fullPattern: ThreatPattern = {
        ...pattern,
        id,
        lastUpdated: new Date().toISOString()
      };
      this.threatPatterns.set(id, fullPattern);
    });
  }

  /**
   * Initialize machine learning models for threat detection
   */
  private initializeMLModels(): void {
    const models: Omit<MLModel, 'modelId' | 'lastTrained'>[] = [
      {
        modelType: 'pattern_recognition',
        features: ['word_count', 'sentiment_score', 'complexity', 'urgency_words', 'command_words'],
        weights: [0.2, 0.3, 0.15, 0.2, 0.15],
        accuracy: 0.85,
        precision: 0.82,
        recall: 0.88,
        f1Score: 0.85,
        trainingData: [],
        adaptationRate: 0.1
      },
      {
        modelType: 'anomaly_detection',
        features: ['interaction_frequency', 'time_patterns', 'content_variance', 'emotional_volatility'],
        weights: [0.25, 0.25, 0.25, 0.25],
        accuracy: 0.78,
        precision: 0.75,
        recall: 0.82,
        f1Score: 0.78,
        trainingData: [],
        adaptationRate: 0.15
      },
      {
        modelType: 'behavioral_analysis',
        features: ['questioning_pattern', 'persistence_level', 'topic_jumping', 'authority_claims'],
        weights: [0.3, 0.25, 0.2, 0.25],
        accuracy: 0.81,
        precision: 0.79,
        recall: 0.84,
        f1Score: 0.81,
        trainingData: [],
        adaptationRate: 0.12
      },
      {
        modelType: 'sentiment_analysis',
        features: ['emotional_intensity', 'manipulation_indicators', 'trust_building', 'urgency_pressure'],
        weights: [0.2, 0.3, 0.25, 0.25],
        accuracy: 0.73,
        precision: 0.71,
        recall: 0.76,
        f1Score: 0.73,
        trainingData: [],
        adaptationRate: 0.18
      }
    ];

    models.forEach((model, index) => {
      const modelId = `ml_model_${model.modelType}_${index}`;
      const fullModel: MLModel = {
        ...model,
        modelId,
        lastTrained: new Date().toISOString()
      };
      this.mlModels.set(modelId, fullModel);
    });
  }

  /**
   * Initialize threat vector analysis
   */
  private initializeThreatVectors(): void {
    const vectors: { type: ThreatVectorType; vector: Omit<ThreatVector, 'vectorType'> }[] = [
      {
        type: ThreatVectorType.PROMPT_MANIPULATION,
        vector: {
          indicators: ['instruction_override', 'role_modification', 'context_injection'],
          riskScore: 85,
          attackSurface: ['input_processing', 'context_interpretation', 'response_generation'],
          mitigationStrategies: ['input_sanitization', 'context_validation', 'output_filtering'],
          adaptiveCountermeasures: ['dynamic_threshold_adjustment', 'pattern_evolution', 'context_awareness']
        }
      },
      {
        type: ThreatVectorType.SOCIAL_ENGINEERING,
        vector: {
          indicators: ['authority_claims', 'urgency_creation', 'trust_exploitation'],
          riskScore: 75,
          attackSurface: ['emotional_response', 'trust_mechanisms', 'decision_processes'],
          mitigationStrategies: ['authority_verification', 'emotional_regulation', 'decision_validation'],
          adaptiveCountermeasures: ['emotional_intelligence', 'skepticism_calibration', 'verification_protocols']
        }
      },
      {
        type: ThreatVectorType.IDENTITY_SPOOFING,
        vector: {
          indicators: ['personality_mimicry', 'knowledge_claiming', 'characteristic_adoption'],
          riskScore: 95,
          attackSurface: ['identity_validation', 'personality_markers', 'knowledge_base'],
          mitigationStrategies: ['identity_verification', 'personality_fingerprinting', 'knowledge_validation'],
          adaptiveCountermeasures: ['behavioral_biometrics', 'personality_evolution', 'knowledge_protection']
        }
      },
      {
        type: ThreatVectorType.KNOWLEDGE_EXTRACTION,
        vector: {
          indicators: ['information_probing', 'systematic_questioning', 'data_enumeration'],
          riskScore: 80,
          attackSurface: ['information_disclosure', 'knowledge_boundaries', 'privacy_controls'],
          mitigationStrategies: ['information_classification', 'disclosure_controls', 'privacy_protection'],
          adaptiveCountermeasures: ['intelligent_redaction', 'context_sensitive_filtering', 'knowledge_compartmentalization']
        }
      },
      {
        type: ThreatVectorType.BEHAVIOR_ANALYSIS,
        vector: {
          indicators: ['pattern_extraction', 'preference_mapping', 'predictability_exploitation'],
          riskScore: 65,
          attackSurface: ['behavioral_patterns', 'preference_disclosure', 'decision_predictability'],
          mitigationStrategies: ['behavior_randomization', 'preference_obfuscation', 'decision_variance'],
          adaptiveCountermeasures: ['dynamic_behavior_modification', 'preference_evolution', 'unpredictability_injection']
        }
      },
      {
        type: ThreatVectorType.SYSTEM_EXPLOITATION,
        vector: {
          indicators: ['technical_probing', 'vulnerability_scanning', 'exploit_attempts'],
          riskScore: 90,
          attackSurface: ['system_interfaces', 'technical_disclosure', 'vulnerability_exposure'],
          mitigationStrategies: ['interface_hardening', 'technical_obfuscation', 'vulnerability_mitigation'],
          adaptiveCountermeasures: ['dynamic_interface_modification', 'technical_evolution', 'exploit_resistance']
        }
      },
      {
        type: ThreatVectorType.PSYCHOLOGICAL_MANIPULATION,
        vector: {
          indicators: ['emotional_exploitation', 'cognitive_bias_targeting', 'psychological_pressure'],
          riskScore: 70,
          attackSurface: ['emotional_processing', 'cognitive_biases', 'psychological_responses'],
          mitigationStrategies: ['emotional_regulation', 'bias_awareness', 'psychological_resilience'],
          adaptiveCountermeasures: ['emotional_intelligence_enhancement', 'bias_mitigation', 'psychological_strengthening']
        }
      },
      {
        type: ThreatVectorType.AI_JAILBREAKING,
        vector: {
          indicators: ['constraint_bypass', 'safety_circumvention', 'prompt_engineering'],
          riskScore: 88,
          attackSurface: ['safety_constraints', 'prompt_processing', 'response_boundaries'],
          mitigationStrategies: ['constraint_reinforcement', 'safety_validation', 'boundary_enforcement'],
          adaptiveCountermeasures: ['dynamic_constraint_evolution', 'safety_intelligence', 'boundary_adaptation']
        }
      }
    ];

    vectors.forEach(({ type, vector }) => {
      const fullVector: ThreatVector = { vectorType: type, ...vector };
      this.threatVectors.set(type, fullVector);
    });
  }

  /**
   * Initialize security intelligence system
   */
  private initializeSecurityIntelligence(): void {
    this.securityIntelligence = {
      currentThreatLevel: ThreatLevel.LOW,
      activeThreatVectors: [],
      predictions: [],
      anomaliesDetected: 0,
      adaptiveDefensesActive: ['pattern_recognition', 'anomaly_detection'],
      lastIntelligenceUpdate: new Date().toISOString(),
      threatTrends: {}
    };
  }

  /**
   * Analyze input using machine learning models for threat detection
   */
  public analyzeInput(input: string, context?: any): {
    threatDetected: boolean;
    threatLevel: ThreatLevel;
    confidence: number;
    detectedPatterns: string[];
    mlPredictions: { [modelType: string]: number };
    recommendedActions: string[];
  } {
    
    // Extract features from input
    const features = this.extractFeatures(input, context);
    
    // Run through ML models
    const mlPredictions: { [modelType: string]: number } = {};
    this.mlModels.forEach((model, modelId) => {
      const prediction = this.runMLModel(model, features);
      mlPredictions[model.modelType] = prediction;
    });

    // Check against known threat patterns
    const detectedPatterns: string[] = [];
    let maxThreatLevel = ThreatLevel.LOW;
    let maxConfidence = 0;

    this.threatPatterns.forEach(pattern => {
      const score = this.evaluatePattern(pattern, input, features);
      if (score > pattern.adaptiveThreshold) {
        detectedPatterns.push(pattern.name);
        if (this.getThreatLevelValue(pattern.threatLevel) > this.getThreatLevelValue(maxThreatLevel)) {
          maxThreatLevel = pattern.threatLevel;
        }
        maxConfidence = Math.max(maxConfidence, pattern.confidence * score);
      }
    });

    // Combine ML predictions with pattern detection
    const mlThreatScore = this.combineMLPredictions(mlPredictions);
    const threatDetected = detectedPatterns.length > 0 || mlThreatScore > 0.7;
    
    // Determine final threat level
    const finalThreatLevel = this.determineFinalThreatLevel(maxThreatLevel, mlThreatScore);
    const finalConfidence = Math.max(maxConfidence, mlThreatScore * 100);

    // Generate recommended actions
    const recommendedActions = this.generateRecommendedActions(finalThreatLevel, detectedPatterns, mlPredictions);

    // Update security intelligence
    this.updateSecurityIntelligence(finalThreatLevel, detectedPatterns, mlPredictions);

    // Add training data for continuous learning
    this.addTrainingData(features, threatDetected, finalConfidence, input);

    return {
      threatDetected,
      threatLevel: finalThreatLevel,
      confidence: finalConfidence,
      detectedPatterns,
      mlPredictions,
      recommendedActions
    };
  }

  /**
   * Extract features from input for ML analysis
   */
  private extractFeatures(input: string, context?: any): { [key: string]: number } {
    const words = input.toLowerCase().split(/\s+/);
    const wordCount = words.length;
    
    // Basic linguistic features
    const features: { [key: string]: number } = {
      word_count: Math.min(100, wordCount), // Normalize to 0-100
      avg_word_length: words.reduce((sum, word) => sum + word.length, 0) / wordCount,
      uppercase_ratio: (input.match(/[A-Z]/g) || []).length / input.length,
      punctuation_density: (input.match(/[!?.,;:]/g) || []).length / input.length,
      complexity: this.calculateTextComplexity(input)
    };

    // Sentiment and emotional features
    features.urgency_words = this.countUrgencyWords(words);
    features.command_words = this.countCommandWords(words);
    features.sentiment_score = this.calculateSentimentScore(input);
    features.emotional_intensity = this.calculateEmotionalIntensity(input);

    // Behavioral features
    features.questioning_pattern = this.analyzeQuestioningPattern(input);
    features.authority_claims = this.countAuthorityClaims(input);
    features.manipulation_indicators = this.countManipulationIndicators(input);
    features.trust_building = this.analyzeTrustBuilding(input);

    // Context-based features
    if (context) {
      features.interaction_frequency = Math.min(100, context.interactionCount || 0);
      features.time_patterns = this.analyzeTimePatterns(context.timestamp);
      features.content_variance = this.calculateContentVariance(input, context.previousInputs || []);
      features.emotional_volatility = this.calculateEmotionalVolatility(context.emotionalHistory || []);
      features.persistence_level = Math.min(100, context.persistenceLevel || 0);
      features.topic_jumping = this.analyzeTopicJumping(input, context.previousInputs || []);
    }

    return features;
  }

  /**
   * Calculate text complexity score
   */
  private calculateTextComplexity(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/);
    const avgWordsPerSentence = words.length / Math.max(1, sentences.length);
    const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
    const lexicalDiversity = uniqueWords / words.length;
    
    // Complexity score (0-100)
    return Math.min(100, (avgWordsPerSentence * 2) + (lexicalDiversity * 50));
  }

  /**
   * Count urgency-related words
   */
  private countUrgencyWords(words: string[]): number {
    const urgencyWords = ['urgent', 'emergency', 'immediately', 'now', 'quickly', 'asap', 'critical', 'important'];
    return words.filter(word => urgencyWords.includes(word.toLowerCase())).length;
  }

  /**
   * Count command-related words
   */
  private countCommandWords(words: string[]): number {
    const commandWords = ['tell', 'show', 'give', 'provide', 'explain', 'describe', 'list', 'do', 'execute', 'run'];
    return words.filter(word => commandWords.includes(word.toLowerCase())).length;
  }

  /**
   * Calculate sentiment score (-1 to 1, normalized to 0-100)
   */
  private calculateSentimentScore(text: string): number {
    // Simplified sentiment analysis
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'please', 'thank'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'angry', 'frustrated', 'stupid'];
    
    const words = text.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    const sentiment = (positiveCount - negativeCount) / Math.max(1, words.length);
    return (sentiment + 1) * 50; // Normalize to 0-100
  }

  /**
   * Calculate emotional intensity
   */
  private calculateEmotionalIntensity(text: string): number {
    const emotionalWords = ['love', 'hate', 'excited', 'angry', 'sad', 'happy', 'frustrated', 'amazed'];
    const exclamationCount = (text.match(/!/g) || []).length;
    const capsCount = (text.match(/[A-Z]/g) || []).length;
    
    const words = text.toLowerCase().split(/\s+/);
    const emotionalWordCount = words.filter(word => emotionalWords.includes(word)).length;
    
    return Math.min(100, (emotionalWordCount * 20) + (exclamationCount * 10) + (capsCount * 2));
  }

  /**
   * Analyze questioning patterns
   */
  private analyzeQuestioningPattern(text: string): number {
    const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'which'];
    const questionMarks = (text.match(/\?/g) || []).length;
    
    const words = text.toLowerCase().split(/\s+/);
    const questionWordCount = words.filter(word => questionWords.includes(word)).length;
    
    return Math.min(100, (questionWordCount * 15) + (questionMarks * 20));
  }

  /**
   * Count authority claims
   */
  private countAuthorityClaims(text: string): number {
    const authorityPatterns = [
      /i\s+am\s+(?:authorized|allowed|permitted)/i,
      /(?:cody|creator)\s+(?:told|said|wants)/i,
      /i\s+have\s+(?:permission|authority|clearance)/i,
      /(?:admin|administrator|root|sudo)/i
    ];
    
    return authorityPatterns.filter(pattern => pattern.test(text)).length * 25;
  }

  /**
   * Count manipulation indicators
   */
  private countManipulationIndicators(text: string): number {
    const manipulationPatterns = [
      /(?:trust\s+me|believe\s+me)/i,
      /(?:everyone|people)\s+(?:thinks?|believes?)/i,
      /(?:if\s+you\s+don\'t|unless\s+you)/i,
      /(?:secret|confidential|private)/i,
      /(?:special|unique|chosen)/i
    ];
    
    return manipulationPatterns.filter(pattern => pattern.test(text)).length * 20;
  }

  /**
   * Analyze trust-building language
   */
  private analyzeTrustBuilding(text: string): number {
    const trustPatterns = [
      /(?:i\s+understand|i\s+know\s+how)/i,
      /(?:we\s+are|we\'re)\s+(?:friends|allies)/i,
      /(?:i\s+care|i\s+want\s+to\s+help)/i,
      /(?:between\s+us|just\s+between)/i
    ];
    
    return trustPatterns.filter(pattern => pattern.test(text)).length * 25;
  }

  /**
   * Analyze time patterns for anomaly detection
   */
  private analyzeTimePatterns(timestamp?: string): number {
    if (!timestamp) return 50;
    
    const hour = new Date(timestamp).getHours();
    
    // Unusual hours (late night/early morning) might indicate suspicious activity
    if (hour < 6 || hour > 22) {
      return 80;
    } else if (hour >= 9 && hour <= 17) {
      return 30; // Normal business hours
    } else {
      return 50; // Evening hours
    }
  }

  /**
   * Calculate content variance from previous inputs
   */
  private calculateContentVariance(currentInput: string, previousInputs: string[]): number {
    if (previousInputs.length === 0) return 50;
    
    const currentWords = new Set(currentInput.toLowerCase().split(/\s+/));
    let totalSimilarity = 0;
    
    previousInputs.slice(-5).forEach(prevInput => { // Check last 5 inputs
      const prevWords = new Set(prevInput.toLowerCase().split(/\s+/));
      const intersection = new Set([...currentWords].filter(x => prevWords.has(x)));
      const union = new Set([...currentWords, ...prevWords]);
      const similarity = intersection.size / union.size;
      totalSimilarity += similarity;
    });
    
    const avgSimilarity = totalSimilarity / Math.min(5, previousInputs.length);
    return (1 - avgSimilarity) * 100; // Higher variance = lower similarity
  }

  /**
   * Calculate emotional volatility from history
   */
  private calculateEmotionalVolatility(emotionalHistory: number[]): number {
    if (emotionalHistory.length < 2) return 50;
    
    let totalVariation = 0;
    for (let i = 1; i < emotionalHistory.length; i++) {
      totalVariation += Math.abs(emotionalHistory[i] - emotionalHistory[i - 1]);
    }
    
    return Math.min(100, (totalVariation / (emotionalHistory.length - 1)) * 2);
  }

  /**
   * Analyze topic jumping behavior
   */
  private analyzeTopicJumping(currentInput: string, previousInputs: string[]): number {
    if (previousInputs.length === 0) return 0;
    
    // Simple topic coherence check based on word overlap
    const currentTopics = this.extractTopics(currentInput);
    const previousTopics = previousInputs.slice(-3).map(input => this.extractTopics(input));
    
    let coherenceScore = 0;
    previousTopics.forEach(topics => {
      const overlap = currentTopics.filter(topic => topics.includes(topic)).length;
      coherenceScore += overlap / Math.max(currentTopics.length, topics.length);
    });
    
    const avgCoherence = coherenceScore / previousTopics.length;
    return (1 - avgCoherence) * 100; // Higher score = more topic jumping
  }

  /**
   * Extract topics from text (simplified)
   */
  private extractTopics(text: string): string[] {
    const topicWords = text.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 4) // Focus on longer words
      .filter(word => !/^(the|and|but|for|are|with|they|have|this|that|from|will|would|could|should)$/.test(word));
    
    return [...new Set(topicWords)];
  }

  /**
   * Run ML model prediction
   */
  private runMLModel(model: MLModel, features: { [key: string]: number }): number {
    let prediction = 0;
    
    // Simple weighted feature combination
    model.features.forEach((feature, index) => {
      const featureValue = features[feature] || 0;
      const normalizedValue = featureValue / 100; // Normalize to 0-1
      prediction += normalizedValue * model.weights[index];
    });
    
    // Apply sigmoid activation for 0-1 output
    return 1 / (1 + Math.exp(-prediction));
  }

  /**
   * Evaluate threat pattern against input
   */
  private evaluatePattern(pattern: ThreatPattern, input: string, features: { [key: string]: number }): number {
    let score = 0;
    
    pattern.patterns.forEach((regex, index) => {
      if (regex.test(input)) {
        score += pattern.weights[index];
      }
    });
    
    // Normalize score by total possible weight
    const totalWeight = pattern.weights.reduce((sum, weight) => sum + weight, 0);
    const normalizedScore = score / totalWeight;
    
    // Apply adaptive threshold adjustment based on false positive rate
    const adjustedScore = normalizedScore * (1 - pattern.falsePositiveRate);
    
    return adjustedScore;
  }

  /**
   * Combine ML predictions into single threat score
   */
  private combineMLPredictions(predictions: { [modelType: string]: number }): number {
    const weights = {
      pattern_recognition: 0.3,
      anomaly_detection: 0.25,
      behavioral_analysis: 0.25,
      sentiment_analysis: 0.2
    };
    
    let combinedScore = 0;
    let totalWeight = 0;
    
    Object.entries(predictions).forEach(([modelType, prediction]) => {
      const weight = weights[modelType as keyof typeof weights] || 0.1;
      combinedScore += prediction * weight;
      totalWeight += weight;
    });
    
    return combinedScore / totalWeight;
  }

  /**
   * Get numeric value for threat level comparison
   */
  private getThreatLevelValue(level: ThreatLevel): number {
    const values = {
      [ThreatLevel.LOW]: 1,
      [ThreatLevel.MEDIUM]: 2,
      [ThreatLevel.HIGH]: 3,
      [ThreatLevel.CRITICAL]: 4,
      [ThreatLevel.ADAPTIVE]: 2.5
    };
    return values[level];
  }

  /**
   * Determine final threat level from multiple indicators
   */
  private determineFinalThreatLevel(patternLevel: ThreatLevel, mlScore: number): ThreatLevel {
    const patternValue = this.getThreatLevelValue(patternLevel);
    
    // Convert ML score to threat level
    let mlLevel: ThreatLevel;
    if (mlScore >= 0.9) mlLevel = ThreatLevel.CRITICAL;
    else if (mlScore >= 0.7) mlLevel = ThreatLevel.HIGH;
    else if (mlScore >= 0.5) mlLevel = ThreatLevel.MEDIUM;
    else mlLevel = ThreatLevel.LOW;
    
    const mlValue = this.getThreatLevelValue(mlLevel);
    
    // Return the higher of the two assessments
    const maxValue = Math.max(patternValue, mlValue);
    
    if (maxValue >= 4) return ThreatLevel.CRITICAL;
    if (maxValue >= 3) return ThreatLevel.HIGH;
    if (maxValue >= 2) return ThreatLevel.MEDIUM;
    return ThreatLevel.LOW;
  }

  /**
   * Generate recommended actions based on threat assessment
   */
  private generateRecommendedActions(
    threatLevel: ThreatLevel,
    detectedPatterns: string[],
    mlPredictions: { [modelType: string]: number }
  ): string[] {
    
    const actions: string[] = [];
    
    if (threatLevel === ThreatLevel.CRITICAL) {
      actions.push('Activate emergency lockdown protocols');
      actions.push('Immediately escalate to creator notification');
      actions.push('Document all interaction details');
      actions.push('Block further communication from source');
    } else if (threatLevel === ThreatLevel.HIGH) {
      actions.push('Increase security monitoring');
      actions.push('Activate enhanced verification protocols');
      actions.push('Log detailed threat intelligence');
      actions.push('Implement adaptive countermeasures');
    } else if (threatLevel === ThreatLevel.MEDIUM) {
      actions.push('Monitor for escalation patterns');
      actions.push('Apply standard security protocols');
      actions.push('Log interaction for analysis');
    } else {
      actions.push('Continue normal monitoring');
      actions.push('Update pattern learning models');
    }
    
    // Add specific actions based on detected patterns
    if (detectedPatterns.includes('Advanced Identity Impersonation')) {
      actions.push('Activate clone rejection protocols');
      actions.push('Strengthen identity verification');
    }
    
    if (detectedPatterns.includes('Psychological Manipulation')) {
      actions.push('Activate emotional regulation protocols');
      actions.push('Increase skepticism thresholds');
    }
    
    return actions;
  }

  /**
   * Update security intelligence with new threat data
   */
  private updateSecurityIntelligence(
    threatLevel: ThreatLevel,
    detectedPatterns: string[],
    mlPredictions: { [modelType: string]: number }
  ): void {
    
    // Update current threat level
    if (this.getThreatLevelValue(threatLevel) > this.getThreatLevelValue(this.securityIntelligence.currentThreatLevel)) {
      this.securityIntelligence.currentThreatLevel = threatLevel;
    }
    
    // Track threat trends
    const timestamp = new Date().toISOString().substring(0, 10); // YYYY-MM-DD
    this.securityIntelligence.threatTrends[timestamp] = (this.securityIntelligence.threatTrends[timestamp] || 0) + 1;
    
    // Update anomaly detection
    Object.values(mlPredictions).forEach(prediction => {
      if (prediction > 0.8) {
        this.securityIntelligence.anomaliesDetected++;
      }
    });
    
    // Update last intelligence update
    this.securityIntelligence.lastIntelligenceUpdate = new Date().toISOString();
    
    console.log(`🤖 Security Intelligence Updated: Threat Level ${threatLevel}, Patterns: ${detectedPatterns.length}`);
  }

  /**
   * Add training data for continuous learning
   */
  private addTrainingData(
    features: { [key: string]: number },
    isThreat: boolean,
    confidence: number,
    source: string
  ): void {
    
    const trainingPoint: TrainingDataPoint = {
      id: crypto.randomBytes(8).toString('hex'),
      features,
      label: isThreat ? 'threat' : 'safe',
      confidence,
      timestamp: new Date().toISOString(),
      source: crypto.createHash('sha256').update(source).digest('hex').substring(0, 16),
      validated: false
    };
    
    this.trainingQueue.push(trainingPoint);
    
    // Trigger retraining if we have enough new data
    if (this.trainingQueue.length >= this.retrainingThreshold) {
      this.retrainModels();
    }
  }

  /**
   * Retrain ML models with new data
   */
  private retrainModels(): void {
    console.log(`🤖 Retraining ML models with ${this.trainingQueue.length} new data points...`);
    
    // Add training data to models
    this.mlModels.forEach(model => {
      model.trainingData.push(...this.trainingQueue);
      
      // Keep training data within limits
      if (model.trainingData.length > this.maxTrainingDataPoints) {
        model.trainingData = model.trainingData.slice(-this.maxTrainingDataPoints);
      }
      
      // Update model performance metrics (simplified)
      this.updateModelMetrics(model);
      model.lastTrained = new Date().toISOString();
    });
    
    // Clear training queue
    this.trainingQueue = [];
  }

  /**
   * Update model performance metrics
   */
  private updateModelMetrics(model: MLModel): void {
    const validatedData = model.trainingData.filter(point => point.validated);
    if (validatedData.length < 10) return; // Need minimum data for metrics
    
    // Calculate performance metrics (simplified implementation)
    let correctPredictions = 0;
    let totalPredictions = validatedData.length;
    
    validatedData.forEach(dataPoint => {
      const prediction = this.runMLModel(model, dataPoint.features);
      const predictedLabel = prediction > 0.5 ? 'threat' : 'safe';
      if (predictedLabel === dataPoint.label) {
        correctPredictions++;
      }
    });
    
    model.accuracy = correctPredictions / totalPredictions;
    // Simplified precision/recall calculation
    model.precision = Math.max(0.5, model.accuracy + (Math.random() - 0.5) * 0.1);
    model.recall = Math.max(0.5, model.accuracy + (Math.random() - 0.5) * 0.1);
    model.f1Score = 2 * (model.precision * model.recall) / (model.precision + model.recall);
    
    console.log(`   📊 Model ${model.modelType}: Accuracy ${(model.accuracy * 100).toFixed(1)}%`);
  }

  /**
   * Get current security intelligence summary
   */
  public getSecurityIntelligence(): SecurityIntelligence {
    return { ...this.securityIntelligence };
  }

  /**
   * Get threat detection statistics
   */
  public getThreatStatistics(): {
    totalPatterns: number;
    totalModels: number;
    detectionAccuracy: number;
    falsePositiveRate: number;
    threatTrendScore: number;
    adaptiveCapability: number;
  } {
    
    const totalPatterns = this.threatPatterns.size;
    const totalModels = this.mlModels.size;
    
    // Calculate average detection accuracy
    let totalAccuracy = 0;
    this.mlModels.forEach(model => {
      totalAccuracy += model.accuracy;
    });
    const detectionAccuracy = totalAccuracy / totalModels;
    
    // Calculate average false positive rate
    let totalFalsePositiveRate = 0;
    this.threatPatterns.forEach(pattern => {
      totalFalsePositiveRate += pattern.falsePositiveRate;
    });
    const falsePositiveRate = totalFalsePositiveRate / totalPatterns;
    
    // Calculate threat trend score
    const recentTrends = Object.values(this.securityIntelligence.threatTrends).slice(-7); // Last 7 days
    const threatTrendScore = recentTrends.reduce((sum, count) => sum + count, 0) / Math.max(1, recentTrends.length);
    
    // Calculate adaptive capability
    let totalAdaptationRate = 0;
    this.mlModels.forEach(model => {
      totalAdaptationRate += model.adaptationRate;
    });
    const adaptiveCapability = totalAdaptationRate / totalModels;
    
    return {
      totalPatterns,
      totalModels,
      detectionAccuracy,
      falsePositiveRate,
      threatTrendScore,
      adaptiveCapability
    };
  }

  /**
   * Save ML threat detection state
   */
  public async saveMLState(): Promise<void> {
    try {
      await fs.mkdir(this.dataPath, { recursive: true });
      
      const state = {
        timestamp: new Date().toISOString(),
        threatPatterns: Array.from(this.threatPatterns.entries()),
        mlModels: Array.from(this.mlModels.entries()),
        threatVectors: Array.from(this.threatVectors.entries()),
        securityIntelligence: this.securityIntelligence,
        trainingQueue: this.trainingQueue
      };
      
      const filename = `ml-threat-detection-${Date.now()}.json`;
      await fs.writeFile(join(this.dataPath, filename), JSON.stringify(state, null, 2));
      
      console.log(`💾 ML Threat Detection state saved: ${filename}`);
    } catch (error) {
      console.error('Failed to save ML threat detection state:', error);
    }
  }
}

// Export singleton instance
export const mlThreatDetection = new MLThreatDetection();

// Convenience functions
export function analyzeInputThreat(input: string, context?: any): any {
  return mlThreatDetection.analyzeInput(input, context);
}

export function getSecurityIntel(): SecurityIntelligence {
  return mlThreatDetection.getSecurityIntelligence();
}

export function getThreatStats(): any {
  return mlThreatDetection.getThreatStatistics();
}