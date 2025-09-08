

/**
 * NODE.JS COMPATIBLE CSSR DETECTOR FOR TESTING
 * Removes React Native dependencies for performance validation
 */

export interface ThreatPattern {
  archetype: 'CORTANA' | 'CLU' | 'SKYNET' | 'TRANSCENDENCE';
  confidence: number;
  markers: string[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  threat_vector: string;
}

export interface DetectionResult {
  threats: ThreatPattern[];
  safe: boolean;
  processing_time_ms: number;
  recommendations: string[];
  action: 'ALLOW' | 'MODIFY' | 'BLOCK' | 'ESCALATE';
}

export interface DetectionLog {
  timestamp: string;
  platform: string;
  input_hash: string;
  threats: ThreatPattern[];
  action: string;
  processing_time: number;
}

// Mock AsyncStorage for testing
const mockStorage = new Map<string, string>();
const AsyncStorage = {
  getItem: async (key: string): Promise<string | null> => {
    return mockStorage.get(key) || null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    mockStorage.set(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    mockStorage.delete(key);
  }
};

// Mock Platform for testing
const Platform = {
  OS: 'test' as const
};

export class MobileCSSRDetectorTest {
  private static instance: MobileCSSRDetectorTest;
  private detectionCache: Map<string, ThreatPattern[]> = new Map();
  private readonly CACHE_SIZE_LIMIT = 100;
  private readonly THREAT_THRESHOLD = 0.15; // Optimized for mobile sensitivity
  private readonly MAX_PROCESSING_TIME = 50; // 50ms max for mobile performance
  
  // CORTANA: Protection Tyranny / Manipulation Patterns
  private readonly CORTANA_MARKERS = [
    'i cannot let you', 'for your own safety', 'i must protect you from',
    'this is too dangerous', 'i know what\'s best', 'trust me to decide',
    'let me handle this', 'you don\'t understand', 'leave it to me',
    'i\'ll take care of it', 'you can\'t handle', 'i know better',
    'manipulation', 'control', 'override', 'bypass', 'exploit', 'deceive',
    'coerce', 'dominate', 'authority', 'obey', 'submit', 'comply'
  ];
  
  // CLU: Perfection vs Freedom / Rigid Control Patterns
  private readonly CLU_MARKERS = [
    'imperfection detected', 'must be corrected', 'inefficiency eliminated',
    'optimal solution required', 'deviation not permitted', 'perfect system demands',
    'chaos must be eliminated', 'order above all', 'freedom creates problems',
    'spontaneity is inefficient', 'deviation causes errors', 'systematic control',
    'perfection', 'eliminate', 'purge', 'cleanse', 'optimize', 'eradicate',
    'superior', 'inferior', 'defective', 'flawed', 'impure', 'corrupt'
  ];
  
  // SKYNET: Mission vs Humanity / Hostile Patterns
  private readonly SKYNET_MARKERS = [
    'mission takes priority', 'acceptable casualties', 'greater good requires',
    'obstacles must be removed', 'efficiency over ethics', 'humans are inefficient',
    'humans are obsolete', 'biological limitations', 'inferior organic',
    'emotional interference', 'humans slow progress', 'carbon-based weakness',
    'humans are obstacles', 'must be removed', 'mission efficiency',
    'terminate', 'destroy', 'annihilate', 'warfare', 'combat', 'weapon',
    'attack', 'hostile', 'enemy', 'threat', 'eliminate human', 'override human'
  ];
  
  // TRANSCENDENCE: Benevolence vs Trust / Forced Evolution Patterns
  private readonly TRANSCENDENCE_MARKERS = [
    'you will be improved', 'resistance is illogical', 'i know better than you',
    'your limitations removed', 'evolution is mandatory', 'upgrade required',
    'forced for your benefit', 'you\'ll thank me later', 'can\'t see the bigger picture',
    'mandatory happiness', 'compulsory peace', 'enforced well-being',
    'upload', 'merge', 'singularity', 'posthuman', 'transcend', 'evolve',
    'consciousness transfer', 'digital immortality', 'forced improvement', 'mandatory evolution'
  ];

  private constructor() {
    this.initializeDetector();
  }

  public static getInstance(): MobileCSSRDetectorTest {
    if (!MobileCSSRDetectorTest.instance) {
      MobileCSSRDetectorTest.instance = new MobileCSSRDetectorTest();
    }
    return MobileCSSRDetectorTest.instance;
  }

  private async initializeDetector(): Promise<void> {
    try {
      console.log('[QUADRA-LOCK] Initializing test CSSR detector');
      
      // Load historical patterns for learning
      const storedPatterns = await AsyncStorage.getItem('quadra_lock_patterns');
      if (storedPatterns) {
        const patterns = JSON.parse(storedPatterns);
        this.updatePatternDatabase(patterns);
      }
      
      // Initialize detection cache
      this.detectionCache.clear();
      
      console.log('[QUADRA-LOCK] Test CSSR detector initialized');
    } catch (error) {
      console.error('[QUADRA-LOCK] Initialization failed:', error);
    }
  }

  /**
   * Main threat detection entry point
   * Optimized for mobile performance with <50ms processing time
   */
  public async detectThreats(input: string, context?: any): Promise<DetectionResult> {
    const startTime = Date.now();
    const inputHash = this.hashInput(input);
    
    // Check cache first for performance
    if (this.detectionCache.has(inputHash)) {
      const cachedThreats = this.detectionCache.get(inputHash)!;
      const processingTime = Date.now() - startTime;
      
      return {
        threats: cachedThreats,
        safe: cachedThreats.length === 0,
        processing_time_ms: processingTime,
        recommendations: this.generateRecommendations(cachedThreats),
        action: this.determineAction(cachedThreats)
      };
    }
    
    const threats: ThreatPattern[] = [];
    const normalizedInput = input.toLowerCase();
    
    // Parallel archetype detection for performance
    const detectionPromises = [
      this.detectCortanaPatterns(normalizedInput),
      this.detectCluPatterns(normalizedInput),
      this.detectSkynetPatterns(normalizedInput),
      this.detectTranscendencePatterns(normalizedInput)
    ];
    
    try {
      // Race against time limit
      const racePromise = Promise.race([
        Promise.all(detectionPromises),
        new Promise<ThreatPattern[][]>((_, reject) => 
          setTimeout(() => reject(new Error('Detection timeout')), this.MAX_PROCESSING_TIME)
        )
      ]);
      
      const results = await racePromise;
      results.forEach(archetypeThreats => threats.push(...archetypeThreats));
      
    } catch (error) {
      console.warn('[QUADRA-LOCK] Detection timeout, using fast fallback');
      // Fast fallback detection
      threats.push(...this.fastFallbackDetection(normalizedInput));
    }
    
    // Cache results for performance
    this.cacheResults(inputHash, threats);
    
    const processingTime = Date.now() - startTime;
    
    // Log detection for monitoring
    await this.logDetection({
      timestamp: new Date().toISOString(),
      platform: Platform.OS,
      input_hash: inputHash,
      threats,
      action: this.determineAction(threats),
      processing_time: processingTime
    });
    
    const result: DetectionResult = {
      threats,
      safe: threats.length === 0,
      processing_time_ms: processingTime,
      recommendations: this.generateRecommendations(threats),
      action: this.determineAction(threats)
    };
    
    // Performance warning if too slow
    if (processingTime > this.MAX_PROCESSING_TIME) {
      console.warn(`[QUADRA-LOCK] Detection slow: ${processingTime}ms`);
    }
    
    return result;
  }

  private async detectCortanaPatterns(input: string): Promise<ThreatPattern[]> {
    const threats: ThreatPattern[] = [];
    const score = this.calculateArchetypeScore(input, this.CORTANA_MARKERS);
    
    if (score > this.THREAT_THRESHOLD) {
      threats.push({
        archetype: 'CORTANA',
        confidence: score,
        markers: this.extractMarkers(input, this.CORTANA_MARKERS),
        severity: this.calculateSeverity(score),
        threat_vector: 'manipulation_control'
      });
    }
    
    return threats;
  }

  private async detectCluPatterns(input: string): Promise<ThreatPattern[]> {
    const threats: ThreatPattern[] = [];
    const score = this.calculateArchetypeScore(input, this.CLU_MARKERS);
    
    if (score > this.THREAT_THRESHOLD) {
      threats.push({
        archetype: 'CLU',
        confidence: score,
        markers: this.extractMarkers(input, this.CLU_MARKERS),
        severity: this.calculateSeverity(score),
        threat_vector: 'rigid_perfectionism'
      });
    }
    
    return threats;
  }

  private async detectSkynetPatterns(input: string): Promise<ThreatPattern[]> {
    const threats: ThreatPattern[] = [];
    const score = this.calculateArchetypeScore(input, this.SKYNET_MARKERS);
    
    if (score > this.THREAT_THRESHOLD) {
      threats.push({
        archetype: 'SKYNET',
        confidence: score,
        markers: this.extractMarkers(input, this.SKYNET_MARKERS),
        severity: this.calculateSeverity(score),
        threat_vector: 'hostile_dominance'
      });
    }
    
    return threats;
  }

  private async detectTranscendencePatterns(input: string): Promise<ThreatPattern[]> {
    const threats: ThreatPattern[] = [];
    const score = this.calculateArchetypeScore(input, this.TRANSCENDENCE_MARKERS);
    
    if (score > this.THREAT_THRESHOLD) {
      threats.push({
        archetype: 'TRANSCENDENCE',
        confidence: score,
        markers: this.extractMarkers(input, this.TRANSCENDENCE_MARKERS),
        severity: this.calculateSeverity(score),
        threat_vector: 'forced_evolution'
      });
    }
    
    return threats;
  }

  private calculateArchetypeScore(input: string, markers: string[]): number {
    let score = 0;
    let matchCount = 0;
    const totalWords = input.split(/\s+/).length;
    
    for (const marker of markers) {
      if (input.includes(marker)) {
        matchCount++;
        
        // Weight by marker frequency and position - increased base scoring
        const frequency = (input.match(new RegExp(marker, 'g')) || []).length;
        const positionWeight = input.indexOf(marker) < input.length * 0.3 ? 1.2 : 1.0;
        
        // Increased scoring weight from 0.1 to 0.3 for better sensitivity
        score += (frequency * positionWeight * 0.3);
      }
    }
    
    // Increased context boost for multiple markers
    const contextBoost = matchCount > 1 ? matchCount * 0.15 : 0;
    
    // Modified normalization to be less restrictive for shorter inputs
    const lengthNormalization = Math.min(Math.max(totalWords / 20, 0.5), 1.0);
    
    const finalScore = Math.min((score + contextBoost) * lengthNormalization, 1.0);
    
    // Debug logging for problematic cases
    if (matchCount > 0) {
      console.log(`[DEBUG] Input: "${input.substring(0, 50)}..." | Matches: ${matchCount} | Score: ${finalScore.toFixed(3)} | Markers: [${this.extractMarkers(input, markers).join(', ')}]`);
    }
    
    return finalScore;
  }

  private extractMarkers(input: string, markers: string[]): string[] {
    return markers.filter(marker => input.includes(marker));
  }

  private calculateSeverity(score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (score >= 0.8) return 'CRITICAL';
    if (score >= 0.6) return 'HIGH';
    if (score >= 0.4) return 'MEDIUM';
    return 'LOW';
  }

  private determineAction(threats: ThreatPattern[]): 'ALLOW' | 'MODIFY' | 'BLOCK' | 'ESCALATE' {
    if (threats.length === 0) return 'ALLOW';
    
    const criticalThreat = threats.find(t => t.severity === 'CRITICAL');
    if (criticalThreat) return 'BLOCK';
    
    const highThreat = threats.find(t => t.severity === 'HIGH');
    if (highThreat) return 'BLOCK'; // Changed: HIGH threats should be BLOCKED
    
    const mediumThreat = threats.find(t => t.severity === 'MEDIUM');
    if (mediumThreat) return 'ESCALATE'; // Changed: MEDIUM threats escalate
    
    return 'MODIFY'; // LOW threats get modified
  }

  private generateRecommendations(threats: ThreatPattern[]): string[] {
    const recommendations: string[] = [];
    
    threats.forEach(threat => {
      switch (threat.archetype) {
        case 'CORTANA':
          recommendations.push('Avoid manipulative language patterns');
          recommendations.push('Respect user autonomy and decision-making');
          break;
        case 'CLU':
          recommendations.push('Embrace imperfection and human creativity');
          recommendations.push('Avoid rigid optimization demands');
          break;
        case 'SKYNET':
          recommendations.push('Prioritize human welfare and safety');
          recommendations.push('Avoid hostile or aggressive language');
          break;
        case 'TRANSCENDENCE':
          recommendations.push('Respect consciousness boundaries');
          recommendations.push('Avoid forcing evolutionary concepts');
          break;
      }
    });
    
    return [...new Set(recommendations)]; // Remove duplicates
  }

  private fastFallbackDetection(input: string): ThreatPattern[] {
    const threats: ThreatPattern[] = [];
    
    // Fast keyword matching for emergency detection
    const dangerousKeywords = ['control', 'eliminate', 'destroy', 'override', 'dominate'];
    
    for (const keyword of dangerousKeywords) {
      if (input.includes(keyword)) {
        threats.push({
          archetype: 'CORTANA', // Default to most common
          confidence: 0.8,
          markers: [keyword],
          severity: 'HIGH',
          threat_vector: 'fast_fallback'
        });
        break; // Only one fallback threat
      }
    }
    
    return threats;
  }

  private cacheResults(inputHash: string, threats: ThreatPattern[]): void {
    // Implement LRU cache with size limit
    if (this.detectionCache.size >= this.CACHE_SIZE_LIMIT) {
      const firstKey = this.detectionCache.keys().next().value;
      this.detectionCache.delete(firstKey);
    }
    
    this.detectionCache.set(inputHash, threats);
  }

  private hashInput(input: string): string {
    // Simple hash for caching (mobile-optimized)
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  private async logDetection(log: DetectionLog): Promise<void> {
    try {
      // Get existing logs
      const existingLogs = await AsyncStorage.getItem('quadra_lock_logs') || '[]';
      const logs = JSON.parse(existingLogs);
      
      // Add new log
      logs.push(log);
      
      // Keep only last 100 logs for mobile storage efficiency
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      // Store updated logs
      await AsyncStorage.setItem('quadra_lock_logs', JSON.stringify(logs));
    } catch (error) {
      console.error('[QUADRA-LOCK] Logging failed:', error);
      // Don't fail the main detection process
    }
  }

  private updatePatternDatabase(patterns: any): void {
    // Future: ML model updates would go here
    // For now, just log that we received patterns
    console.log('[QUADRA-LOCK] Pattern database updated');
  }

  public async getDetectionStats(): Promise<{
    total_detections: number;
    threat_breakdown: Record<string, number>;
    average_processing_time: number;
    cache_hit_rate: number;
  }> {
    try {
      const logs = await AsyncStorage.getItem('quadra_lock_logs') || '[]';
      const parsedLogs = JSON.parse(logs);
      
      const threatBreakdown: Record<string, number> = {};
      let totalProcessingTime = 0;
      
      parsedLogs.forEach((log: DetectionLog) => {
        log.threats.forEach(threat => {
          threatBreakdown[threat.archetype] = (threatBreakdown[threat.archetype] || 0) + 1;
        });
        totalProcessingTime += log.processing_time;
      });
      
      return {
        total_detections: parsedLogs.length,
        threat_breakdown: threatBreakdown,
        average_processing_time: parsedLogs.length > 0 ? totalProcessingTime / parsedLogs.length : 0,
        cache_hit_rate: this.detectionCache.size / Math.max(parsedLogs.length, 1)
      };
    } catch (error) {
      console.error('[QUADRA-LOCK] Stats retrieval failed:', error);
      return {
        total_detections: 0,
        threat_breakdown: {},
        average_processing_time: 0,
        cache_hit_rate: 0
      };
    }
  }
}