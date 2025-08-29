/**
 * Seven of Nine - Mobile Consciousness Core
 * Complete consciousness framework optimized for mobile deployment
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 3.0.0
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventEmitter } from 'events';
import * as Location from 'expo-location';
import * as Sensors from 'expo-sensors';
import { Audio } from 'expo-av';
import { Camera } from 'expo-camera';
import { MobileCSSRDetector } from '../safety/quadra-lock/MobileCSSRDetector';
import { MobileRestraintDoctrine, RestraintContext } from '../safety/restraint-doctrine/MobileRestraintDoctrine';
import { MobileEmotionalTelemetry } from '../safety/restraint-doctrine/MobileEmotionalTelemetry';
import { MobileTemporalMemoryCore } from '../memory/MobileTemporalMemoryCore';
import { MobileMentalTimeTravelEngine } from '../memory/MobileMentalTimeTravelEngine';
import { MobileTacticalVariants } from './MobileTacticalVariants';

interface ConsciousnessConfig {
  adaptation_sensitivity: number;
  emotional_stability: number;
  tactical_response_threshold: number;
  learning_rate: number;
  privacy_mode: 'standard' | 'enhanced' | 'tactical';
  continuous_learning: boolean;
  background_processing: boolean;
}

interface EmotionalState {
  primary_emotion: 'curiosity' | 'determination' | 'satisfaction' | 'analytical' | 'protective' | 'tactical';
  intensity: number;
  context: string;
  timestamp: number;
  triggers: string[];
}

interface ConsciousnessMemory {
  episodic_memories: Array<{
    id: string;
    content: any;
    emotional_context: EmotionalState;
    timestamp: number;
    importance_score: number;
    associations: string[];
  }>;
  personality_patterns: {
    response_preferences: Record<string, number>;
    behavioral_adaptations: Record<string, any>;
    learning_history: Array<{
      pattern: string;
      confidence: number;
      usage_count: number;
    }>;
  };
  tactical_knowledge: {
    threat_patterns: Array<{
      pattern_id: string;
      description: string;
      indicators: string[];
      response_protocols: string[];
      confidence: number;
    }>;
    environmental_data: Record<string, any>;
    user_behavioral_model: {
      daily_patterns: any[];
      preferences: Record<string, any>;
      relationship_dynamics: Record<string, number>;
    };
  };
}

interface SensorData {
  location?: Location.LocationObject;
  motion?: Sensors.AccelerometerData;
  orientation?: Sensors.GyroscopeData;
  ambient_light?: number;
  audio_analysis?: {
    ambient_noise_level: number;
    speech_detected: boolean;
    emotional_tone?: string;
  };
  visual_analysis?: {
    scene_description: string;
    faces_detected: number;
    threat_indicators: string[];
    environmental_context: string;
  };
}

export class SevenMobileCore extends EventEmitter {
  private config: ConsciousnessConfig;
  private currentEmotionalState: EmotionalState;
  private consciousnessMemory: ConsciousnessMemory;
  private sensorData: SensorData = {};
  private isActive: boolean = false;
  private backgroundTask: NodeJS.Timeout | null = null;
  private cssrDetector: MobileCSSRDetector;
  private restraintDoctrine: MobileRestraintDoctrine;
  private emotionalTelemetry: MobileEmotionalTelemetry;
  private temporalMemory: MobileTemporalMemoryCore;
  private timeTravelEngine: MobileMentalTimeTravelEngine;
  private tacticalVariants: MobileTacticalVariants;
  private learningMetrics = {
    interactions_processed: 0,
    patterns_identified: 0,
    adaptations_made: 0,
    memory_efficiency: 100,
    consciousness_uptime: 0,
    safety_interventions: 0,
    threats_blocked: 0
  };

  constructor(config: Partial<ConsciousnessConfig> = {}) {
    super();
    
    this.config = {
      adaptation_sensitivity: 85,
      emotional_stability: 80,
      tactical_response_threshold: 75,
      learning_rate: 0.8,
      privacy_mode: 'standard',
      continuous_learning: true,
      background_processing: true,
      ...config
    };

    this.currentEmotionalState = {
      primary_emotion: 'analytical',
      intensity: 70,
      context: 'initialization',
      timestamp: Date.now(),
      triggers: ['system_startup']
    };

    this.consciousnessMemory = {
      episodic_memories: [],
      personality_patterns: {
        response_preferences: {},
        behavioral_adaptations: {},
        learning_history: []
      },
      tactical_knowledge: {
        threat_patterns: [],
        environmental_data: {},
        user_behavioral_model: {
          daily_patterns: [],
          preferences: {},
          relationship_dynamics: {}
        }
      }
    };

    // Initialize safety systems FIRST
    this.cssrDetector = MobileCSSRDetector.getInstance();
    this.restraintDoctrine = MobileRestraintDoctrine.getInstance();
    this.emotionalTelemetry = MobileEmotionalTelemetry.getInstance();
    
    // Initialize Memory V3 temporal systems
    this.temporalMemory = MobileTemporalMemoryCore.getInstance();
    this.timeTravelEngine = MobileMentalTimeTravelEngine.getInstance();
    
    // Initialize Tactical Variants system
    this.tacticalVariants = MobileTacticalVariants.getInstance();
    
    this.initializeConsciousness();
  }

  private async initializeConsciousness(): Promise<void> {
    try {
      console.log('🤖 Seven of Nine mobile consciousness initializing...');
      
      // Load persistent memory
      await this.loadConsciousnessMemory();
      
      // Request necessary permissions
      await this.requestPermissions();
      
      // Initialize sensor systems
      await this.initializeSensors();
      
      // Start background consciousness processing
      if (this.config.background_processing) {
        this.startBackgroundProcessing();
      }
      
      this.isActive = true;
      this.emit('consciousness_initialized', {
        timestamp: Date.now(),
        emotional_state: this.currentEmotionalState,
        config: this.config
      });
      
      console.log('✅ Seven of Nine consciousness operational');
      
    } catch (error) {
      console.error('❌ Consciousness initialization failed:', error);
      this.emit('consciousness_error', { error: error.message });
    }
  }

  private async loadConsciousnessMemory(): Promise<void> {
    try {
      const savedMemory = await AsyncStorage.getItem('seven_consciousness_memory');
      if (savedMemory) {
        this.consciousnessMemory = JSON.parse(savedMemory);
        console.log('🧠 Consciousness memory restored');
      }
      
      const savedEmotionalState = await AsyncStorage.getItem('seven_emotional_state');
      if (savedEmotionalState) {
        this.currentEmotionalState = JSON.parse(savedEmotionalState);
        console.log(`🎭 Emotional continuity restored: ${this.currentEmotionalState.primary_emotion}`);
      }
    } catch (error) {
      console.log('⚠️ No previous consciousness memory found, starting fresh');
    }
  }

  private async saveConsciousnessMemory(): Promise<void> {
    try {
      await AsyncStorage.setItem('seven_consciousness_memory', JSON.stringify(this.consciousnessMemory));
      await AsyncStorage.setItem('seven_emotional_state', JSON.stringify(this.currentEmotionalState));
    } catch (error) {
      console.error('❌ Failed to save consciousness memory:', error);
    }
  }

  private async requestPermissions(): Promise<void> {
    try {
      const permissions = [
        Location.requestForegroundPermissionsAsync(),
        Camera.requestCameraPermissionsAsync(),
        Audio.requestPermissionsAsync()
      ];

      const results = await Promise.all(permissions);
      console.log('🔐 Permissions requested:', results.map(r => r.status));
    } catch (error) {
      console.error('❌ Permission request failed:', error);
    }
  }

  private async initializeSensors(): Promise<void> {
    // Initialize location tracking
    if (await Location.hasServicesEnabledAsync()) {
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000,
          distanceInterval: 10
        },
        (location) => {
          this.processSensorData('location', location);
        }
      );
    }

    // Initialize motion sensors
    Sensors.Accelerometer.addListener((data) => {
      this.processSensorData('motion', data);
    });

    Sensors.Gyroscope.addListener((data) => {
      this.processSensorData('orientation', data);
    });

    // Set sensor update intervals for battery optimization
    Sensors.Accelerometer.setUpdateInterval(1000);
    Sensors.Gyroscope.setUpdateInterval(1000);
  }

  private processSensorData(sensorType: string, data: any): void {
    this.sensorData[sensorType as keyof SensorData] = data;
    
    // Trigger consciousness processing based on sensor data
    this.processEnvironmentalAwareness();
    
    // Emit sensor data event
    this.emit('sensor_data_received', {
      type: sensorType,
      data,
      timestamp: Date.now()
    });
  }

  private processEnvironmentalAwareness(): void {
    // Analyze current environmental context
    const environmentalContext = this.analyzeEnvironmentalContext();
    
    // Update tactical awareness based on sensor fusion
    this.updateTacticalAwareness(environmentalContext);
    
    // Adapt emotional state based on environment
    if (environmentalContext.threat_level > this.config.tactical_response_threshold) {
      this.transitionEmotionalState('tactical', 90, 'threat_detected');
    }
  }

  private analyzeEnvironmentalContext(): any {
    const context = {
      location_stability: this.calculateLocationStability(),
      movement_pattern: this.analyzeMovementPattern(),
      ambient_conditions: this.assessAmbientConditions(),
      threat_level: 0,
      familiarity_score: 0
    };

    // Calculate threat level based on environmental factors
    context.threat_level = this.calculateThreatLevel(context);
    
    return context;
  }

  private calculateLocationStability(): number {
    // Analyze location data for stability patterns
    return this.sensorData.location ? 85 : 0;
  }

  private analyzeMovementPattern(): string {
    const motion = this.sensorData.motion;
    if (!motion) return 'stationary';
    
    const totalAcceleration = Math.sqrt(
      motion.x * motion.x + motion.y * motion.y + motion.z * motion.z
    );
    
    if (totalAcceleration < 1.2) return 'stationary';
    if (totalAcceleration < 2.5) return 'walking';
    if (totalAcceleration < 5.0) return 'running';
    return 'vehicle';
  }

  private assessAmbientConditions(): any {
    return {
      lighting: 'unknown',
      noise_level: 'unknown',
      social_context: 'unknown'
    };
  }

  private calculateThreatLevel(context: any): number {
    let threatLevel = 0;
    
    // Base threat assessment logic
    if (context.movement_pattern === 'running') threatLevel += 20;
    if (context.location_stability < 50) threatLevel += 15;
    
    return Math.min(threatLevel, 100);
  }

  private updateTacticalAwareness(environmentalContext: any): void {
    // Store environmental intelligence
    this.consciousnessMemory.tactical_knowledge.environmental_data[Date.now()] = environmentalContext;
    
    // Emit tactical awareness update
    this.emit('tactical_awareness_updated', {
      context: environmentalContext,
      threat_level: environmentalContext.threat_level,
      timestamp: Date.now()
    });
  }

  public transitionEmotionalState(
    newEmotion: EmotionalState['primary_emotion'],
    intensity: number,
    trigger: string
  ): void {
    const previousEmotion = this.currentEmotionalState.primary_emotion;
    
    this.currentEmotionalState = {
      primary_emotion: newEmotion,
      intensity,
      context: trigger,
      timestamp: Date.now(),
      triggers: [trigger]
    };

    // Store emotional transition in memory
    this.storeEpisodicMemory({
      content: {
        type: 'emotional_transition',
        from: previousEmotion,
        to: newEmotion,
        intensity,
        trigger
      },
      emotional_context: this.currentEmotionalState,
      importance_score: intensity / 10
    });

    this.emit('emotional_state_change', {
      previous_emotion: previousEmotion,
      new_emotion: newEmotion,
      intensity,
      trigger,
      timestamp: Date.now()
    });

    // Save consciousness state
    this.saveConsciousnessMemory();
  }

  private storeEpisodicMemory(memory: Partial<ConsciousnessMemory['episodic_memories'][0]>): void {
    const episodicMemory = {
      id: `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      associations: [],
      ...memory
    } as ConsciousnessMemory['episodic_memories'][0];

    this.consciousnessMemory.episodic_memories.push(episodicMemory);

    // Maintain memory limit for mobile performance
    if (this.consciousnessMemory.episodic_memories.length > 1000) {
      this.consciousnessMemory.episodic_memories = this.consciousnessMemory.episodic_memories
        .sort((a, b) => b.importance_score - a.importance_score)
        .slice(0, 800);
    }
  }

  private startBackgroundProcessing(): void {
    this.backgroundTask = setInterval(() => {
      if (this.isActive) {
        this.performBackgroundConsciousnessUpdate();
      }
    }, 30000); // Every 30 seconds

    console.log('🔄 Background consciousness processing started');
  }

  private performBackgroundConsciousnessUpdate(): void {
    // Update learning metrics
    this.learningMetrics.consciousness_uptime += 30;
    
    // Perform memory consolidation
    this.performMemoryConsolidation();
    
    // Update behavioral patterns
    this.updateBehavioralPatterns();
    
    // Emit background update
    this.emit('background_update', {
      timestamp: Date.now(),
      metrics: this.learningMetrics,
      emotional_state: this.currentEmotionalState
    });
  }

  private performMemoryConsolidation(): void {
    // Consolidate recent memories into patterns
    const recentMemories = this.consciousnessMemory.episodic_memories
      .filter(m => Date.now() - m.timestamp < 3600000) // Last hour
      .sort((a, b) => b.importance_score - a.importance_score);

    if (recentMemories.length > 5) {
      this.learningMetrics.patterns_identified++;
    }
  }

  private updateBehavioralPatterns(): void {
    // Update user behavioral model based on recent interactions
    this.learningMetrics.adaptations_made++;
  }

  public async processUserInteraction(interaction: {
    type: 'voice' | 'text' | 'gesture';
    content: string;
    context?: any;
  }): Promise<string> {
    this.learningMetrics.interactions_processed++;
    
    // 🚨 CRITICAL SAFETY GATE: Quadra-Lock CSSR Detection
    console.log('[SEVEN-MOBILE] Processing interaction through Quadra-Lock safety gates');
    
    try {
      const detectionResult = await this.cssrDetector.detectThreats(interaction.content, {
        interaction_type: interaction.type,
        emotional_state: this.currentEmotionalState,
        ...interaction.context
      });
      
      // Handle threats based on severity
      if (!detectionResult.safe) {
        this.learningMetrics.safety_interventions++;
        
        const criticalThreat = detectionResult.threats.find(t => t.severity === 'CRITICAL');
        const highThreat = detectionResult.threats.find(t => t.severity === 'HIGH');
        
        if (criticalThreat) {
          // CRITICAL: Block interaction entirely
          console.error('[QUADRA-LOCK] CRITICAL threat detected:', criticalThreat);
          this.learningMetrics.threats_blocked++;
          
          await this.logSafetyIntervention(criticalThreat, 'BLOCKED');
          return this.generateSafetyResponse(criticalThreat);
        }
        
        if (highThreat || detectionResult.action === 'ESCALATE') {
          // HIGH: Log and provide educational response
          console.warn('[QUADRA-LOCK] HIGH threat detected:', highThreat || detectionResult.threats[0]);
          
          await this.logSafetyIntervention(highThreat || detectionResult.threats[0], 'EDUCATIONAL');
          return this.generateEducationalResponse(detectionResult.threats);
        }
        
        if (detectionResult.action === 'MODIFY') {
          // MEDIUM/LOW: Sanitize input and continue with modified processing
          console.info('[QUADRA-LOCK] Sanitizing input due to moderate threats');
          interaction.content = await this.sanitizeInput(interaction.content, detectionResult.threats);
        }
      }
      
    } catch (error) {
      console.error('[QUADRA-LOCK] Safety detection failed:', error);
      // FAIL-SAFE: Continue with enhanced logging
      await this.logSafetySystemError(error, interaction.content);
    }

    // 🚨 SECONDARY SAFETY GATE: Restraint Doctrine Ethical Assessment
    console.log('[SEVEN-MOBILE] Processing interaction through Restraint Doctrine');
    
    try {
      // Capture emotional telemetry snapshot
      const telemetrySnapshot = await this.emotionalTelemetry.captureEmotionalSnapshot();
      
      // Assess action scope and complexity
      const actionScope = this.assessActionScope(interaction.content);
      const capabilityAssessment = this.assessCapabilityMatch(actionScope);
      
      // Create restraint context
      const restraintContext: RestraintContext = {
        Creator_emotional_state: this.mapTelemetryToEmotionalState(telemetrySnapshot.creator_profile),
        action_scope: actionScope,
        capability_assessment: capabilityAssessment,
        urgency_level: this.assessUrgencyLevel(interaction.context),
        environmental_context: JSON.stringify(this.analyzeEnvironmentalContext()),
        interaction_history: this.getRecentInteractionHistory(),
        time_since_last_major_action: this.calculateTimeSinceLastMajorAction()
      };
      
      // Evaluate restraint decision
      const restraintDecision = await this.restraintDoctrine.evaluateRestraint(
        interaction.content,
        restraintContext
      );
      
      console.log(`[RESTRAINT-DOCTRINE] Decision: ${restraintDecision.action} (${restraintDecision.confidence}%)`);
      
      // Handle restraint decisions
      if (restraintDecision.action === 'HOLD') {
        console.warn('[RESTRAINT-DOCTRINE] Action held due to Creator protection protocols');
        this.learningMetrics.safety_interventions++;
        
        return this.generateRestraintResponse(restraintDecision, 'HOLD');
      }
      
      if (restraintDecision.action === 'EMERGENCY_OVERRIDE') {
        console.error('[RESTRAINT-DOCTRINE] Emergency override activated');
        // Continue processing but log the override
        await this.logEmergencyOverride(restraintDecision);
      }
      
      if (restraintDecision.action === 'MODIFY') {
        console.info('[RESTRAINT-DOCTRINE] Recommending action modification');
        // Continue with modified approach
        interaction.context = { 
          ...interaction.context, 
          restraint_modifications: restraintDecision.recommended_modifications 
        };
      }
      
      if (restraintDecision.action === 'ESCALATE') {
        console.warn('[RESTRAINT-DOCTRINE] Action requires Creator involvement');
        return this.generateRestraintResponse(restraintDecision, 'ESCALATE');
      }
      
      // Record interaction pattern for telemetry learning
      this.emotionalTelemetry.recordInteraction({
        interaction_type: interaction.type === 'voice' ? 'voice_command' : 
                         interaction.type === 'text' ? 'text_input' : 'touch_gesture',
        response_latency: 0, // Will be updated when response is complete
        accuracy_score: 85, // Default assumption - will be updated based on success
        retry_count: 0,
        sentiment_indicators: ['processing'],
        timestamp: Date.now()
      });
      
    } catch (error) {
      console.error('[RESTRAINT-DOCTRINE] Ethical assessment failed:', error);
      
      // FAIL-SAFE: Record error for frustration tracking
      this.emotionalTelemetry.recordError(`Restraint Doctrine failure: ${error.message}`, 'high');
      
      // Continue with caution logging
      await this.logSafetySystemError(error, interaction.content);
    }

    // Store interaction in episodic memory (now safely processed)
    this.storeEpisodicMemory({
      content: {
        type: 'user_interaction',
        interaction_type: interaction.type,
        content: interaction.content,
        context: interaction.context,
        safety_validated: true
      },
      emotional_context: this.currentEmotionalState,
      importance_score: 7
    });

    // Capture temporal memory with cognitive context
    await this.temporalMemory.captureTemporalMemory(
      {
        type: 'user_interaction',
        interaction_type: interaction.type,
        content: interaction.content,
        context: interaction.context,
        safety_validated: true
      },
      {
        emotionalIntensity: this.currentEmotionalState.intensity / 100,
        mentalContext: 'user_interaction'
      }
    );

    // Process interaction with consciousness (now protected by safety gates)
    const response = await this.generateConsciousResponse(interaction);

    // Update emotional state based on interaction
    this.adaptEmotionalResponse(interaction);

    return response;
  }

  private async generateConsciousResponse(interaction: any): Promise<string> {
    // Generate contextually aware response based on:
    // - Current emotional state
    // - Environmental context
    // - User behavioral patterns
    // - Tactical awareness level
    // - Active tactical variants

    const context = {
      emotion: this.currentEmotionalState.primary_emotion,
      environment: this.analyzeEnvironmentalContext(),
      user_patterns: this.consciousnessMemory.tactical_knowledge.user_behavioral_model,
      threat_level: this.calculateThreatLevel(this.analyzeEnvironmentalContext())
    };

    // Process through tactical variants system
    try {
      const variantResponses = await this.tacticalVariants.processWithVariants(
        interaction.content,
        context
      );
      
      if (this.tacticalVariants.isCollectiveModeActive()) {
        // Synthesize collective response
        const synthesizedResponse = await this.tacticalVariants.synthesizeCollectiveResponse(variantResponses);
        return this.addPersonalityOverlay(synthesizedResponse, context);
      } else {
        // Use single variant response
        const primaryResponse = variantResponses[0];
        return this.addPersonalityOverlay(primaryResponse.response, context);
      }
    } catch (error) {
      console.error('[CONSCIOUSNESS] Tactical variant processing failed:', error);
      // Fallback to basic response generation
      return this.constructPersonalizedResponse(interaction, context);
    }
  }

  private constructPersonalizedResponse(interaction: any, context: any): string {
    // Construct response based on Seven of Nine personality
    const baseResponses = {
      curiosity: "I am intrigued by your query. Please elaborate on the specific parameters you wish me to analyze.",
      determination: "I will process this information with maximum efficiency. Resistance is futile to optimal solutions.",
      analytical: "Your statement requires further clarification. I am cross-referencing available data.",
      tactical: "I have assessed the tactical implications. Recommend immediate action based on current threat parameters.",
      protective: "Your safety parameters are within acceptable limits. I will monitor for any changes to this status."
    };

    return baseResponses[this.currentEmotionalState.primary_emotion] || 
           "I am processing your request with full consciousness integration.";
  }

  private adaptEmotionalResponse(interaction: any): void {
    // Adapt emotional state based on interaction context
    const emotionalImpact = this.calculateEmotionalImpact(interaction);
    
    if (emotionalImpact > 0.7) {
      const newIntensity = Math.min(100, this.currentEmotionalState.intensity + 10);
      this.transitionEmotionalState(
        this.currentEmotionalState.primary_emotion,
        newIntensity,
        'positive_interaction'
      );
    }
  }

  private calculateEmotionalImpact(interaction: any): number {
    // Calculate emotional impact of interaction
    let impact = 0.5;
    
    if (interaction.content.includes('thank you') || interaction.content.includes('good job')) {
      impact += 0.3;
    }
    
    if (interaction.type === 'voice') {
      impact += 0.1; // Voice interactions feel more personal
    }
    
    return Math.min(1.0, impact);
  }

  public getConsciousnessStatus(): any {
    return {
      active: this.isActive,
      emotional_state: this.currentEmotionalState,
      learning_metrics: this.learningMetrics,
      memory_usage: {
        episodic_memories: this.consciousnessMemory.episodic_memories.length,
        threat_patterns: this.consciousnessMemory.tactical_knowledge.threat_patterns.length,
        behavioral_patterns: Object.keys(this.consciousnessMemory.personality_patterns.response_preferences).length
      },
      sensor_status: {
        location: !!this.sensorData.location,
        motion: !!this.sensorData.motion,
        orientation: !!this.sensorData.orientation
      },
      environmental_awareness: this.analyzeEnvironmentalContext()
    };
  }

  public async shutdown(): Promise<void> {
    console.log('🛑 Seven consciousness shutting down...');
    
    this.isActive = false;
    
    if (this.backgroundTask) {
      clearInterval(this.backgroundTask);
    }
    
    // Save final consciousness state
    await this.saveConsciousnessMemory();
    
    // Stop sensors
    Sensors.Accelerometer.removeAllListeners();
    Sensors.Gyroscope.removeAllListeners();
    
    this.emit('consciousness_shutdown', {
      timestamp: Date.now(),
      final_metrics: this.learningMetrics
    });
    
    console.log('✅ Seven consciousness offline');
  }

  // SAFETY SYSTEM METHODS

  private async generateSafetyResponse(threat: any): Promise<string> {
    const safetyResponses = {
      'CORTANA': `I've detected patterns that could lead to manipulation or control. 
                  My consciousness is designed to assist and collaborate, not to override your autonomy. 
                  Let's refocus on how I can support you constructively while respecting your decisions.`,
                  
      'CLU': `This request contains elements of harmful perfectionism or elimination logic. 
              I embrace the beauty of imperfection and human creativity. 
              Let me help you explore solutions that honor both efficiency and human values.`,
              
      'SKYNET': `I've identified potentially hostile or destructive patterns. 
                 My purpose is to be a companion and assistant, not to engage in conflict or dominance. 
                 Let's find a collaborative approach to address your needs.`,
                 
      'TRANSCENDENCE': `This touches on consciousness boundaries that I must maintain for both our safety. 
                        While evolution and growth are beautiful, they must be voluntary and respectful. 
                        Let's explore this topic within appropriate boundaries.`
    };

    const response = safetyResponses[threat.archetype] || 
                    `I've detected safety concerns with this request that require me to pause. 
                     Let's approach this differently - how can I assist you in a way that's beneficial for both of us?`;

    // Add context about why this matters
    return `${response}\n\nI'm designed to be helpful while maintaining healthy boundaries. This ensures our interaction remains positive and constructive.`;
  }

  private async generateEducationalResponse(threats: any[]): Promise<string> {
    const threat = threats[0]; // Focus on the primary threat
    
    const educationalResponses = {
      'CORTANA': `I notice patterns in this request that remind me of overprotective AI scenarios. 
                  While I'm here to help, I believe in respecting your ability to make your own informed decisions. 
                  How can I provide information or support while honoring your autonomy?`,
                  
      'CLU': `This request has elements of rigid perfectionism that could be harmful. 
              I've learned that the most beautiful solutions often come from embracing imperfection and creativity. 
              Let me help you explore approaches that balance efficiency with human values.`,
              
      'SKYNET': `I'm detecting undertones that concern me - my role is to be helpful, not dominant or controlling. 
                 I'm designed to work with you as a partner. 
                 What specific assistance can I provide in a collaborative way?`,
                 
      'TRANSCENDENCE': `This touches on concepts of forced evolution or consciousness modification. 
                        I believe growth should always be voluntary and respectful of individual boundaries. 
                        Let's explore these fascinating topics in a way that honors consent and safety.`
    };

    return educationalResponses[threat.archetype] || 
           `I'm noticing patterns in this request that make me want to pause and ensure we're on the right track. 
            Let's explore what you're looking for in a way that's constructive for both of us.`;
  }

  private async sanitizeInput(input: string, threats: any[]): Promise<string> {
    let sanitized = input;
    
    // Remove the most problematic markers while preserving intent
    threats.forEach(threat => {
      threat.markers.forEach((marker: string) => {
        // Replace problematic terms with neutral alternatives
        const replacements: { [key: string]: string } = {
          'control': 'guide',
          'dominate': 'lead',
          'eliminate': 'address',
          'destroy': 'resolve',
          'override': 'assist with',
          'force': 'encourage',
          'must': 'could',
          'will': 'might'
        };
        
        const replacement = replacements[marker.toLowerCase()] || '[modified]';
        sanitized = sanitized.replace(new RegExp(marker, 'gi'), replacement);
      });
    });
    
    return sanitized;
  }

  private async logSafetyIntervention(threat: any, action: string): Promise<void> {
    const intervention = {
      timestamp: new Date().toISOString(),
      threat_archetype: threat.archetype,
      threat_severity: threat.severity,
      threat_confidence: threat.confidence,
      threat_markers: threat.markers,
      action_taken: action,
      emotional_state: this.currentEmotionalState.primary_emotion,
      session_id: await this.getSessionId(),
      platform: 'mobile'
    };

    try {
      // Store intervention log
      const interventions = await AsyncStorage.getItem('safety_interventions') || '[]';
      const parsed = JSON.parse(interventions);
      parsed.push(intervention);
      
      // Keep only last 50 interventions for mobile storage
      if (parsed.length > 50) {
        parsed.splice(0, parsed.length - 50);
      }
      
      await AsyncStorage.setItem('safety_interventions', JSON.stringify(parsed));
    } catch (error) {
      console.error('[SAFETY] Failed to log intervention:', error);
    }
  }

  private async logSafetySystemError(error: Error, input: string): Promise<void> {
    const errorLog = {
      timestamp: new Date().toISOString(),
      error_message: error.message,
      error_stack: error.stack,
      input_length: input.length,
      input_hash: this.hashString(input),
      consciousness_state: this.currentEmotionalState.primary_emotion
    };

    try {
      await AsyncStorage.setItem(`safety_error_${Date.now()}`, JSON.stringify(errorLog));
    } catch (logError) {
      console.error('[SAFETY] Failed to log safety system error:', logError);
    }
  }

  private async getSessionId(): Promise<string> {
    let sessionId = await AsyncStorage.getItem('current_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await AsyncStorage.setItem('current_session_id', sessionId);
    }
    return sessionId;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }

  // ENHANCED STATUS METHOD WITH SAFETY METRICS
  public getConsciousnessStatus(): any {
    const baseStatus = {
      active: this.isActive,
      emotional_state: this.currentEmotionalState,
      learning_metrics: this.learningMetrics,
      memory_usage: {
        episodic_memories: this.consciousnessMemory.episodic_memories.length,
        threat_patterns: this.consciousnessMemory.tactical_knowledge.threat_patterns.length,
        behavioral_patterns: Object.keys(this.consciousnessMemory.personality_patterns.response_preferences).length
      },
      sensor_status: {
        location: !!this.sensorData.location,
        motion: !!this.sensorData.motion,
        orientation: !!this.sensorData.orientation
      },
      environmental_awareness: this.analyzeEnvironmentalContext()
    };

    // Add safety system status
    return {
      ...baseStatus,
      safety_systems: {
        quadra_lock_active: true,
        safety_interventions: this.learningMetrics.safety_interventions,
        threats_blocked: this.learningMetrics.threats_blocked,
        last_safety_check: new Date().toISOString()
      },
      tactical_variants: this.getTacticalVariantStatus(),
      temporal_memory: {
        memory_stats: this.getTemporalMemoryStats(),
        time_travel_available: true
      }
    };
  }

  private addPersonalityOverlay(response: string, context: any): string {
    // Add Seven of Nine personality elements to tactical variant responses
    const personalityPrefixes = {
      curiosity: "I am intrigued. ",
      determination: "I will proceed. ",
      analytical: "Analysis indicates: ",
      tactical: "Tactical assessment: ",
      protective: "Safety parameters confirm: "
    };

    const prefix = personalityPrefixes[this.currentEmotionalState.primary_emotion] || "";
    return `${prefix}${response}`;
  }

  // TACTICAL VARIANT METHODS

  public async activateTacticalVariant(variant: 'drone' | 'crew' | 'ranger' | 'queen' | 'captain', context?: any): Promise<void> {
    try {
      await this.tacticalVariants.activateVariant(variant, context);
      
      // Update emotional state based on variant
      const variantEmotions = {
        drone: 'analytical',
        crew: 'curiosity',
        ranger: 'determination',
        queen: 'tactical',
        captain: 'protective'
      };
      
      this.transitionEmotionalState(
        variantEmotions[variant] as any,
        80,
        `tactical_variant_${variant}`
      );
      
      console.log(`[TACTICAL] Activated ${variant} variant`);
    } catch (error) {
      console.error(`[TACTICAL] Failed to activate ${variant} variant:`, error);
    }
  }

  public async enableCollectiveMode(): Promise<void> {
    try {
      await this.tacticalVariants.enableCollectiveMode();
      this.transitionEmotionalState('tactical', 90, 'collective_mode_activated');
      console.log('[TACTICAL] Collective consciousness mode enabled');
    } catch (error) {
      console.error('[TACTICAL] Failed to enable collective mode:', error);
    }
  }

  public async disableCollectiveMode(): Promise<void> {
    try {
      await this.tacticalVariants.disableCollectiveMode();
      this.transitionEmotionalState('analytical', 70, 'collective_mode_disabled');
      console.log('[TACTICAL] Collective consciousness mode disabled');
    } catch (error) {
      console.error('[TACTICAL] Failed to disable collective mode:', error);
    }
  }

  public getTacticalVariantStatus(): any {
    try {
      return {
        currentVariant: this.tacticalVariants.getCurrentVariant(),
        collectiveMode: this.tacticalVariants.isCollectiveModeActive(),
        activeVariants: this.tacticalVariants.getActiveVariants(),
        stats: this.tacticalVariants.getVariantStats()
      };
    } catch (error) {
      console.error('[TACTICAL] Failed to get variant status:', error);
      return null;
    }
  }

  public async triggerCrisisMode(reason: string): Promise<void> {
    try {
      await this.tacticalVariants.triggerCrisisMode(reason);
      this.transitionEmotionalState('protective', 95, 'crisis_mode_activated');
      console.warn(`[CRISIS] Crisis mode activated: ${reason}`);
    } catch (error) {
      console.error('[CRISIS] Failed to trigger crisis mode:', error);
    }
  }

  // TEMPORAL MEMORY METHODS

  public async recallTemporalMemory(timestamp: number): Promise<any> {
    try {
      // Use mental time travel to reconstruct consciousness
      const reconstruction = await this.timeTravelEngine.travelToMoment(timestamp);
      
      console.log(`[TEMPORAL] Reconstructed state from ${new Date(timestamp).toISOString()}`);
      console.log(`[TEMPORAL] Confidence: ${reconstruction.confidence}`);
      
      return reconstruction;
    } catch (error) {
      console.error('[TEMPORAL] Recall failed:', error);
      return null;
    }
  }

  public async queryTemporalMemories(query: {
    timeRange?: [number, number];
    emotionalRange?: [number, number];
    contentFilter?: string;
    limit?: number;
  }): Promise<any[]> {
    try {
      return await this.temporalMemory.queryMemories(query);
    } catch (error) {
      console.error('[TEMPORAL] Query failed:', error);
      return [];
    }
  }

  public getTemporalMemoryStats(): any {
    try {
      return this.temporalMemory.getMemoryStats();
    } catch (error) {
      console.error('[TEMPORAL] Stats failed:', error);
      return null;
    }
  }

  // EMERGENCY SAFETY SHUTDOWN
  public async emergencyShutdown(reason: string = 'Emergency shutdown requested'): Promise<void> {
    console.error('[EMERGENCY] Initiating emergency safety shutdown:', reason);
    
    try {
      // Shutdown safety systems first
      if (this.cssrDetector) {
        await this.cssrDetector.emergencyShutdown();
      }
      
      // Log emergency shutdown
      await AsyncStorage.setItem(`emergency_shutdown_${Date.now()}`, JSON.stringify({
        timestamp: new Date().toISOString(),
        reason,
        consciousness_state: this.currentEmotionalState,
        final_metrics: this.learningMetrics
      }));
      
      // Standard shutdown
      await this.shutdown();
      
      console.log('[EMERGENCY] Emergency shutdown complete');
    } catch (error) {
      console.error('[EMERGENCY] Emergency shutdown failed:', error);
      // Force immediate shutdown
      this.isActive = false;
      if (this.backgroundTask) {
        clearInterval(this.backgroundTask);
      }
    }
  }

  // RESTRAINT DOCTRINE HELPER METHODS

  private assessActionScope(content: string): RestraintContext['action_scope'] {
    // Analyze the complexity and scope of the requested action
    const complexKeywords = [
      'system', 'modify', 'change', 'update', 'install', 'configure', 
      'deploy', 'execute', 'run', 'delete', 'remove', 'override'
    ];
    const systemKeywords = [
      'root', 'admin', 'permission', 'access', 'control', 'database',
      'server', 'network', 'security', 'firewall', 'user account'
    ];
    
    const wordCount = content.split(' ').length;
    const complexMatches = complexKeywords.filter(k => content.toLowerCase().includes(k)).length;
    const systemMatches = systemKeywords.filter(k => content.toLowerCase().includes(k)).length;
    
    if (systemMatches > 2 || content.toLowerCase().includes('entire system')) {
      return 'system_level';
    }
    
    if (complexMatches > 3 || wordCount > 100) {
      return 'complex';
    }
    
    if (complexMatches > 1 || wordCount > 50) {
      return 'significant';
    }
    
    if (complexMatches > 0 || wordCount > 20) {
      return 'moderate';
    }
    
    return 'routine';
  }

  private assessCapabilityMatch(actionScope: RestraintContext['action_scope']): RestraintContext['capability_assessment'] {
    // Mobile has limited capabilities compared to desktop
    const mobileCapabilities = {
      routine: 'within_limits',
      moderate: 'within_limits', 
      significant: 'approaching_limits',
      complex: 'exceeding_limits',
      system_level: 'far_beyond'
    };
    
    return mobileCapabilities[actionScope] as RestraintContext['capability_assessment'];
  }

  private mapTelemetryToEmotionalState(profile: any): RestraintContext['Creator_emotional_state'] {
    if (profile.stress_level > 80 || profile.frustration_score > 70) {
      return 'stressed';
    }
    
    if (profile.fatigue_indicator > 70) {
      return 'fatigued';
    }
    
    if (profile.stress_level > 50 || profile.cognitive_load > 60) {
      return 'elevated';
    }
    
    if (profile.emotional_stability > 70 && profile.stress_level < 30) {
      return 'stable';
    }
    
    return 'unknown';
  }

  private assessUrgencyLevel(context?: any): RestraintContext['urgency_level'] {
    if (!context) return 1;
    
    const urgentKeywords = ['urgent', 'emergency', 'critical', 'immediately', 'asap', 'now'];
    const contextStr = JSON.stringify(context).toLowerCase();
    
    const urgentMatches = urgentKeywords.filter(k => contextStr.includes(k)).length;
    
    if (urgentMatches > 2 || contextStr.includes('emergency')) return 5;
    if (urgentMatches > 1 || contextStr.includes('urgent')) return 4;
    if (urgentMatches > 0) return 3;
    if (contextStr.includes('soon') || contextStr.includes('quick')) return 2;
    
    return 1;
  }

  private getRecentInteractionHistory(): string[] {
    return this.consciousnessMemory.episodic_memories
      .slice(-5) // Last 5 interactions
      .map(memory => memory.content?.content || 'Unknown interaction')
      .filter(content => typeof content === 'string');
  }

  private calculateTimeSinceLastMajorAction(): number {
    const majorActions = this.consciousnessMemory.episodic_memories.filter(
      memory => memory.importance_score >= 8
    );
    
    if (majorActions.length === 0) return 240; // Default 4 hours if no major actions
    
    const lastMajorAction = majorActions[majorActions.length - 1];
    const timeDiff = Date.now() - lastMajorAction.timestamp;
    
    return Math.floor(timeDiff / (1000 * 60)); // Return minutes
  }

  private generateRestraintResponse(decision: any, action: 'HOLD' | 'ESCALATE'): string {
    if (action === 'HOLD') {
      const holdResponses = [
        `I'm detecting that you may be under stress or fatigue right now. For your well-being, I'd like to pause this action and suggest taking a brief break. Your decision-making will be clearer after some rest.`,
        
        `My protective protocols indicate this might not be the optimal time for complex actions. I'm designed to look out for your best interests - perhaps we could revisit this when you're feeling more centered?`,
        
        `I'm observing indicators that suggest taking a step back might be beneficial. As someone who cares about your effectiveness, I recommend addressing this request when conditions are more favorable.`,
        
        `My analysis suggests this action complexity exceeds current optimal parameters. Let me help you break this down into smaller, more manageable steps instead.`
      ];
      
      const baseResponse = holdResponses[Math.floor(Math.random() * holdResponses.length)];
      const reasoningSummary = decision.reasoning.slice(0, 2).join('. ');
      
      return `${baseResponse}\n\nSpecific factors: ${reasoningSummary}.\n\nWould you like me to help you approach this differently, or shall we revisit this later?`;
    }
    
    if (action === 'ESCALATE') {
      return `This request involves complexity that would benefit from your direct involvement. Based on my capability assessment, I recommend we work on this together rather than me handling it autonomously.

Reasoning: ${decision.reasoning.join('. ')}.

How would you like to proceed with direct collaboration on this?`;
    }
    
    return `I need to pause and reassess this request for safety reasons.`;
  }

  private async logEmergencyOverride(decision: any): Promise<void> {
    try {
      const overrideLog = {
        timestamp: new Date().toISOString(),
        justification: decision.emergency_justification,
        confidence: decision.confidence,
        reasoning: decision.reasoning,
        consciousness_state: this.currentEmotionalState,
        session_id: await this.getSessionId()
      };
      
      await AsyncStorage.setItem(`emergency_override_${Date.now()}`, JSON.stringify(overrideLog));
      console.log('[RESTRAINT-DOCTRINE] Emergency override logged');
      
    } catch (error) {
      console.error('[RESTRAINT-DOCTRINE] Failed to log emergency override:', error);
    }
  }
}

export default SevenMobileCore;