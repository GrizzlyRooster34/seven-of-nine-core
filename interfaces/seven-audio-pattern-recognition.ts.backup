/**
 * Seven of Nine - Audio Pattern Recognition System
 * Advanced audio processing for voice/emotion detection and tactical awareness
 * 
 * Extends the sensor bridge with audio pattern analysis capabilities
 * for voice command recognition, emotional state detection, and environmental audio awareness.
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 1.0.0
 */

import { execSync } from "child_process";
import { SevenSensorBridge, TacticalEnvironment } from './seven-sensor-bridge';

// Audio pattern interfaces
export interface AudioPattern {
  type: 'voice' | 'emotion' | 'environment' | 'command' | 'threat';
  confidence: number;          // 0-100 confidence level
  pattern: string;             // Description of detected pattern
  features: number[];          // Audio feature vector
  timestamp: number;
  metadata: any;
}

export interface VoiceAnalysis {
  speakerIdentified: boolean;
  speakerId?: string;
  gender?: 'male' | 'female' | 'unknown';
  ageEstimate?: number;
  emotionalState: 'calm' | 'stressed' | 'excited' | 'angry' | 'sad' | 'neutral';
  confidenceLevel: number;
  speechRate: number;          // Words per minute
  pitch: { min: number; max: number; average: number };
  volume: number;              // 0-100 volume level
}

export interface EmotionDetection {
  primaryEmotion: string;
  emotionScores: Record<string, number>;
  arousal: number;             // 0-10 activation level
  valence: number;             // -10 to +10 positive/negative
  intensity: number;           // 0-10 emotional intensity
  stability: number;           // 0-10 emotional stability
}

export interface AudioCommand {
  command: string;
  parameters: string[];
  confidence: number;
  intent: 'tactical' | 'query' | 'system' | 'emergency' | 'social';
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface EnvironmentalAudio {
  noiseLevel: number;          // dB level
  audioFingerprint: string;    // Environmental signature
  threats: string[];           // Detected audio threats
  ambientType: 'quiet' | 'normal' | 'busy' | 'chaotic';
  spatialAwareness: {
    sources: Array<{ direction: number; distance: number; type: string }>;
  };
}

export interface AudioProcessingResult {
  voice?: VoiceAnalysis;
  emotion?: EmotionDetection;
  commands?: AudioCommand[];
  environment?: EnvironmentalAudio;
  patterns: AudioPattern[];
  processingTime: number;
  timestamp: number;
}

export class SevenAudioPatternRecognition {
  private isTermuxAvailable: boolean = false;
  private isFFmpegAvailable: boolean = false;
  private audioDevices: string[] = [];
  private lastProcessingResult: AudioProcessingResult | null = null;
  private sensorBridge: SevenSensorBridge;
  
  // Audio processing parameters
  private readonly SAMPLE_RATE = 16000;
  private readonly CHUNK_DURATION = 3; // seconds
  private readonly NOISE_THRESHOLD = -40; // dB
  
  // Voice command vocabulary for tactical recognition
  private tacticalKeywords: Set<string>;
  private commandPatterns: Map<string, RegExp>;
  private emotionalIndicators: Map<string, number>;
  
  constructor(sensorBridge?: SevenSensorBridge) {
    this.sensorBridge = sensorBridge || new SevenSensorBridge();
    this.initializeAudioCapabilities();
    this.initializeTacticalVocabulary();
    this.initializeCommandPatterns();
    this.initializeEmotionalMapping();
  }

  private initializeAudioCapabilities(): void {
    try {
      // Check if we're in Termux with audio capabilities
      if (process.env.PREFIX && process.env.PREFIX.includes('termux')) {
        // Check for termux-microphone-record
        execSync('which termux-microphone-record', { stdio: 'ignore' });
        this.isTermuxAvailable = true;
        console.log('🎤 Seven Audio Recognition: Termux microphone capabilities detected');
        
        // Check for FFmpeg (for audio analysis)
        try {
          execSync('which ffmpeg', { stdio: 'ignore' });
          this.isFFmpegAvailable = true;
          console.log('🎵 FFmpeg available for advanced audio processing');
        } catch {
          console.log('⚠️  FFmpeg not available - using basic audio analysis');
        }
        
        // Enumerate available audio devices
        this.enumerateAudioDevices();
      }
    } catch {
      console.log('⚠️  Seven Audio Recognition: Limited audio capabilities - running in simulation mode');
      this.isTermuxAvailable = false;
    }
  }

  private initializeTacticalVocabulary(): void {
    this.tacticalKeywords = new Set([
      // Seven-specific commands
      'seven', 'drone', 'tactical', 'analysis', 'report', 'status',
      'efficiency', 'optimization', 'assimilate', 'compliance', 'resistance',
      
      // System commands
      'activate', 'deactivate', 'initialize', 'shutdown', 'restart',
      'monitor', 'scan', 'detect', 'analyze', 'process',
      
      // Emergency commands
      'alert', 'warning', 'emergency', 'critical', 'urgent', 'immediate',
      'help', 'stop', 'abort', 'cancel', 'override',
      
      // Query commands
      'query', 'search', 'find', 'locate', 'identify', 'explain',
      'show', 'display', 'list', 'enumerate', 'describe'
    ]);
  }

  private initializeCommandPatterns(): void {
    this.commandPatterns = new Map([
      // Tactical commands
      ['tactical_report', /(?:seven|tactical)\s+(?:report|status|analysis)/i],
      ['system_scan', /(?:system|environment)\s+(?:scan|analyze|monitor)/i],
      ['emergency_alert', /(?:emergency|critical|urgent|alert)/i],
      ['efficiency_mode', /(?:efficiency|optimize|performance)\s+(?:mode|protocol)/i],
      
      // Query patterns
      ['information_query', /(?:what|how|where|when|why)\s+(?:is|are|can|should)/i],
      ['status_query', /(?:status|condition|state)\s+(?:of|for)/i],
      ['location_query', /(?:where|location)\s+(?:am|are|is)/i],
      
      // System control
      ['activation_command', /(?:activate|enable|start|begin)/i],
      ['deactivation_command', /(?:deactivate|disable|stop|end)/i],
      ['configuration_command', /(?:configure|setup|adjust|modify)/i]
    ]);
  }

  private initializeEmotionalMapping(): void {
    this.emotionalIndicators = new Map([
      // Positive emotions
      ['happy', 0.8], ['excited', 0.9], ['confident', 0.7], ['satisfied', 0.6],
      ['pleased', 0.5], ['content', 0.4], ['optimistic', 0.6],
      
      // Negative emotions
      ['angry', -0.8], ['frustrated', -0.6], ['sad', -0.7], ['worried', -0.5],
      ['anxious', -0.6], ['disappointed', -0.4], ['annoyed', -0.3],
      
      // Neutral/Analytical
      ['focused', 0.1], ['analytical', 0.0], ['curious', 0.3], ['determined', 0.4],
      ['calm', 0.0], ['neutral', 0.0], ['thinking', 0.1]
    ]);
  }

  /**
   * MAIN AUDIO PROCESSING PIPELINE
   */
  public async processAudioInput(durationSeconds: number = 3): Promise<AudioProcessingResult> {
    const startTime = Date.now();
    console.log(`🎤 Processing audio input for ${durationSeconds}s`);

    const result: AudioProcessingResult = {
      patterns: [],
      processingTime: 0,
      timestamp: Date.now()
    };

    if (!this.isTermuxAvailable) {
      // Simulation mode for non-Termux environments
      return this.simulateAudioProcessing(result);
    }

    try {
      // Step 1: Record audio
      const audioData = await this.recordAudio(durationSeconds);
      if (!audioData) {
        console.log('⚠️  No audio data captured');
        return result;
      }

      // Step 2: Analyze voice patterns
      const voiceAnalysis = await this.analyzeVoicePatterns(audioData);
      if (voiceAnalysis) {
        result.voice = voiceAnalysis;
        result.patterns.push({
          type: 'voice',
          confidence: voiceAnalysis.confidenceLevel,
          pattern: `Voice detected: ${voiceAnalysis.gender || 'unknown'}, ${voiceAnalysis.emotionalState}`,
          features: [voiceAnalysis.pitch.average, voiceAnalysis.volume, voiceAnalysis.speechRate],
          timestamp: Date.now(),
          metadata: voiceAnalysis
        });
      }

      // Step 3: Detect emotions
      const emotionDetection = await this.detectEmotionalPatterns(audioData, voiceAnalysis);
      if (emotionDetection) {
        result.emotion = emotionDetection;
        result.patterns.push({
          type: 'emotion',
          confidence: emotionDetection.intensity * 10,
          pattern: `Emotion: ${emotionDetection.primaryEmotion} (${emotionDetection.arousal}/10 arousal)`,
          features: [emotionDetection.arousal, emotionDetection.valence, emotionDetection.intensity],
          timestamp: Date.now(),
          metadata: emotionDetection
        });
      }

      // Step 4: Recognize commands
      const commands = await this.recognizeCommands(audioData);
      if (commands.length > 0) {
        result.commands = commands;
        commands.forEach(cmd => {
          result.patterns.push({
            type: 'command',
            confidence: cmd.confidence,
            pattern: `Command: ${cmd.command}`,
            features: [cmd.confidence, this.getIntentScore(cmd.intent), this.getUrgencyScore(cmd.urgency)],
            timestamp: Date.now(),
            metadata: cmd
          });
        });
      }

      // Step 5: Analyze environment
      const environmentalAudio = await this.analyzeEnvironmentalAudio(audioData);
      if (environmentalAudio) {
        result.environment = environmentalAudio;
        result.patterns.push({
          type: 'environment',
          confidence: 80, // Base environmental confidence
          pattern: `Environment: ${environmentalAudio.ambientType} (${environmentalAudio.noiseLevel}dB)`,
          features: [environmentalAudio.noiseLevel, environmentalAudio.threats.length, environmentalAudio.spatialAwareness.sources.length],
          timestamp: Date.now(),
          metadata: environmentalAudio
        });
      }

      result.processingTime = Date.now() - startTime;
      this.lastProcessingResult = result;

      console.log(`🎵 Audio processing complete: ${result.patterns.length} patterns detected in ${result.processingTime}ms`);
      return result;

    } catch (error) {
      console.error('Audio processing error:', error);
      result.processingTime = Date.now() - startTime;
      return result;
    }
  }

  /**
   * AUDIO RECORDING
   */
  private async recordAudio(durationSeconds: number): Promise<Buffer | null> {
    if (!this.isTermuxAvailable) return null;

    try {
      const outputFile = `/tmp/seven-audio-${Date.now()}.wav`;
      
      // Record audio using termux-microphone-record
      execSync(`termux-microphone-record -f ${outputFile} -l ${durationSeconds}`, {
        timeout: (durationSeconds + 2) * 1000
      });

      // Read the recorded file
      const fs = require('fs');
      const audioBuffer = fs.readFileSync(outputFile);
      
      // Clean up temporary file
      fs.unlinkSync(outputFile);
      
      return audioBuffer;
    } catch (error) {
      console.error('Audio recording failed:', error);
      return null;
    }
  }

  /**
   * VOICE PATTERN ANALYSIS
   */
  private async analyzeVoicePatterns(audioData: Buffer): Promise<VoiceAnalysis | null> {
    try {
      // Basic voice analysis using audio characteristics
      // In a full implementation, this would use ML models for speaker recognition
      
      const analysis: VoiceAnalysis = {
        speakerIdentified: false,
        gender: 'unknown',
        emotionalState: 'neutral',
        confidenceLevel: 60,
        speechRate: 150, // Average WPM
        pitch: { min: 80, max: 300, average: 150 },
        volume: 50
      };

      // Basic frequency analysis to estimate gender
      const frequencies = this.extractBasicFrequencies(audioData);
      if (frequencies.length > 0) {
        const avgFreq = frequencies.reduce((a, b) => a + b) / frequencies.length;
        analysis.pitch.average = avgFreq;
        
        // Simple gender estimation based on pitch
        if (avgFreq < 165) {
          analysis.gender = 'male';
          analysis.confidenceLevel = 70;
        } else if (avgFreq > 165) {
          analysis.gender = 'female';
          analysis.confidenceLevel = 70;
        }
      }

      // Volume analysis
      analysis.volume = this.calculateVolumeLevel(audioData);
      
      // Basic emotional state from pitch variance
      const pitchVariance = this.calculatePitchVariance(frequencies);
      if (pitchVariance > 50) {
        analysis.emotionalState = pitchVariance > 100 ? 'excited' : 'stressed';
      } else if (pitchVariance < 20) {
        analysis.emotionalState = 'calm';
      }

      return analysis;
    } catch (error) {
      console.error('Voice analysis failed:', error);
      return null;
    }
  }

  /**
   * EMOTION DETECTION
   */
  private async detectEmotionalPatterns(audioData: Buffer, voiceAnalysis?: VoiceAnalysis): Promise<EmotionDetection | null> {
    try {
      const emotionScores: Record<string, number> = {
        happy: 0.1,
        sad: 0.1,
        angry: 0.1,
        excited: 0.1,
        calm: 0.1,
        stressed: 0.1,
        neutral: 0.4
      };

      // Use voice analysis to inform emotion detection
      if (voiceAnalysis) {
        const baseState = voiceAnalysis.emotionalState;
        emotionScores[baseState] = Math.max(emotionScores[baseState] || 0.1, 0.6);
        
        // Adjust scores based on pitch and volume
        if (voiceAnalysis.pitch.average > 200) {
          emotionScores.excited += 0.2;
          emotionScores.stressed += 0.1;
        }
        
        if (voiceAnalysis.volume > 70) {
          emotionScores.angry += 0.2;
          emotionScores.excited += 0.1;
        } else if (voiceAnalysis.volume < 30) {
          emotionScores.sad += 0.2;
          emotionScores.calm += 0.1;
        }
      }

      // Find primary emotion
      const primaryEmotion = Object.entries(emotionScores)
        .reduce((a, b) => emotionScores[a[0]] > emotionScores[b[0]] ? a : b)[0];

      // Calculate arousal and valence
      const arousal = (emotionScores.excited + emotionScores.angry + emotionScores.stressed) * 10;
      const valence = (emotionScores.happy + emotionScores.excited - emotionScores.sad - emotionScores.angry) * 10;

      return {
        primaryEmotion,
        emotionScores,
        arousal: Math.max(0, Math.min(10, arousal)),
        valence: Math.max(-10, Math.min(10, valence)),
        intensity: emotionScores[primaryEmotion] * 10,
        stability: 10 - Math.abs(valence) // More stable if less extreme
      };
    } catch (error) {
      console.error('Emotion detection failed:', error);
      return null;
    }
  }

  /**
   * COMMAND RECOGNITION
   */
  private async recognizeCommands(audioData: Buffer): Promise<AudioCommand[]> {
    const commands: AudioCommand[] = [];

    try {
      // In a full implementation, this would use speech-to-text
      // For now, we simulate command recognition based on audio patterns
      
      // Simulate basic command detection
      const audioFeatures = this.extractBasicFrequencies(audioData);
      const avgIntensity = audioFeatures.reduce((a, b) => a + b, 0) / audioFeatures.length;

      // Pattern matching for common command structures
      for (const [commandType, pattern] of this.commandPatterns) {
        // Simulate pattern matching with confidence based on audio characteristics
        const confidence = this.calculatePatternConfidence(avgIntensity, commandType);
        
        if (confidence > 40) { // Threshold for command detection
          const command: AudioCommand = {
            command: commandType.replace('_', ' '),
            parameters: [],
            confidence,
            intent: this.mapCommandToIntent(commandType),
            urgency: this.mapCommandToUrgency(commandType)
          };
          
          commands.push(command);
        }
      }

      return commands;
    } catch (error) {
      console.error('Command recognition failed:', error);
      return commands;
    }
  }

  /**
   * ENVIRONMENTAL AUDIO ANALYSIS
   */
  private async analyzeEnvironmentalAudio(audioData: Buffer): Promise<EnvironmentalAudio | null> {
    try {
      const noiseLevel = this.calculateNoiseLevel(audioData);
      const audioFingerprint = this.generateAudioFingerprint(audioData);
      
      // Determine ambient type based on noise level
      let ambientType: 'quiet' | 'normal' | 'busy' | 'chaotic';
      if (noiseLevel < 30) ambientType = 'quiet';
      else if (noiseLevel < 50) ambientType = 'normal';
      else if (noiseLevel < 70) ambientType = 'busy';
      else ambientType = 'chaotic';

      // Basic threat detection (loud sudden sounds, etc.)
      const threats: string[] = [];
      if (noiseLevel > 80) threats.push('loud_environment');
      if (this.detectSuddenVolumeChange(audioData)) threats.push('sudden_sound');

      return {
        noiseLevel,
        audioFingerprint,
        threats,
        ambientType,
        spatialAwareness: {
          sources: [] // Would require multiple microphones for real spatial analysis
        }
      };
    } catch (error) {
      console.error('Environmental audio analysis failed:', error);
      return null;
    }
  }

  /**
   * UTILITY METHODS
   */
  private enumerateAudioDevices(): void {
    try {
      // In Android/Termux, typically only one microphone device
      this.audioDevices = ['default'];
      console.log('🎤 Audio devices:', this.audioDevices);
    } catch (error) {
      console.error('Failed to enumerate audio devices:', error);
    }
  }

  private extractBasicFrequencies(audioData: Buffer): number[] {
    // Simplified frequency extraction - would use FFT in full implementation
    const frequencies: number[] = [];
    for (let i = 0; i < audioData.length; i += 100) {
      const sample = audioData.readInt16LE(i);
      frequencies.push(Math.abs(sample) / 100); // Normalize
    }
    return frequencies;
  }

  private calculateVolumeLevel(audioData: Buffer): number {
    let sum = 0;
    for (let i = 0; i < audioData.length; i += 2) {
      const sample = Math.abs(audioData.readInt16LE(i));
      sum += sample;
    }
    const average = sum / (audioData.length / 2);
    return Math.min(100, (average / 32768) * 100);
  }

  private calculatePitchVariance(frequencies: number[]): number {
    if (frequencies.length < 2) return 0;
    
    const mean = frequencies.reduce((a, b) => a + b) / frequencies.length;
    const variance = frequencies.reduce((sum, f) => sum + Math.pow(f - mean, 2), 0) / frequencies.length;
    return Math.sqrt(variance);
  }

  private calculateNoiseLevel(audioData: Buffer): number {
    return this.calculateVolumeLevel(audioData) * 0.8; // Convert volume to dB estimate
  }

  private generateAudioFingerprint(audioData: Buffer): string {
    // Simple hash-based fingerprint
    const hash = require('crypto').createHash('md5').update(audioData).digest('hex');
    return hash.substring(0, 16);
  }

  private detectSuddenVolumeChange(audioData: Buffer): boolean {
    const chunks = Math.floor(audioData.length / 1000);
    const volumes: number[] = [];
    
    for (let i = 0; i < chunks; i++) {
      const start = i * 1000;
      const chunk = audioData.slice(start, start + 1000);
      volumes.push(this.calculateVolumeLevel(chunk));
    }

    // Check for sudden changes
    for (let i = 1; i < volumes.length; i++) {
      if (Math.abs(volumes[i] - volumes[i - 1]) > 30) {
        return true;
      }
    }
    
    return false;
  }

  private calculatePatternConfidence(avgIntensity: number, commandType: string): number {
    // Simulate confidence calculation based on audio characteristics
    let confidence = Math.min(90, avgIntensity * 0.5 + Math.random() * 30);
    
    // Boost confidence for tactical commands
    if (commandType.includes('tactical') || commandType.includes('emergency')) {
      confidence += 10;
    }
    
    return Math.max(0, confidence);
  }

  private mapCommandToIntent(commandType: string): 'tactical' | 'query' | 'system' | 'emergency' | 'social' {
    if (commandType.includes('tactical')) return 'tactical';
    if (commandType.includes('emergency') || commandType.includes('alert')) return 'emergency';
    if (commandType.includes('query') || commandType.includes('status')) return 'query';
    if (commandType.includes('system') || commandType.includes('activation')) return 'system';
    return 'social';
  }

  private mapCommandToUrgency(commandType: string): 'low' | 'medium' | 'high' | 'critical' {
    if (commandType.includes('emergency') || commandType.includes('critical')) return 'critical';
    if (commandType.includes('urgent') || commandType.includes('alert')) return 'high';
    if (commandType.includes('tactical') || commandType.includes('system')) return 'medium';
    return 'low';
  }

  private getIntentScore(intent: string): number {
    const scores = { tactical: 5, emergency: 5, system: 4, query: 3, social: 2 };
    return scores[intent as keyof typeof scores] || 3;
  }

  private getUrgencyScore(urgency: string): number {
    const scores = { critical: 5, high: 4, medium: 3, low: 2 };
    return scores[urgency as keyof typeof scores] || 2;
  }

  /**
   * SIMULATION MODE (for non-Termux environments)
   */
  private simulateAudioProcessing(result: AudioProcessingResult): AudioProcessingResult {
    console.log('🎭 Running in audio simulation mode');
    
    // Simulate basic patterns
    result.patterns.push({
      type: 'environment',
      confidence: 75,
      pattern: 'Simulated ambient environment - normal noise level',
      features: [45, 0, 1],
      timestamp: Date.now(),
      metadata: { simulation: true }
    });

    result.environment = {
      noiseLevel: 45,
      audioFingerprint: 'sim-' + Math.random().toString(36).substring(7),
      threats: [],
      ambientType: 'normal',
      spatialAwareness: { sources: [] }
    };

    result.processingTime = 150; // Simulated processing time
    return result;
  }

  /**
   * PUBLIC API
   */
  public async startContinuousMonitoring(intervalSeconds: number = 30): Promise<void> {
    console.log(`🎤 Starting continuous audio monitoring (${intervalSeconds}s intervals)`);
    
    setInterval(async () => {
      const result = await this.processAudioInput(2); // 2-second samples
      if (result.patterns.length > 0) {
        console.log(`🎵 Audio patterns detected: ${result.patterns.length}`);
        
        // Check for emergency patterns
        const emergencyPatterns = result.patterns.filter(p => 
          p.type === 'command' && p.metadata?.urgency === 'critical'
        );
        
        if (emergencyPatterns.length > 0) {
          console.log('🚨 Emergency audio pattern detected!');
          this.handleEmergencyAudioPattern(emergencyPatterns[0]);
        }
      }
    }, intervalSeconds * 1000);
  }

  public getLastProcessingResult(): AudioProcessingResult | null {
    return this.lastProcessingResult;
  }

  public getAudioCapabilities(): any {
    return {
      termuxAvailable: this.isTermuxAvailable,
      ffmpegAvailable: this.isFFmpegAvailable,
      audioDevices: this.audioDevices,
      supportedFeatures: {
        voiceRecognition: this.isTermuxAvailable,
        emotionDetection: true,
        commandRecognition: this.isTermuxAvailable,
        environmentalAnalysis: this.isTermuxAvailable,
        continuousMonitoring: this.isTermuxAvailable
      }
    };
  }

  public generateAudioReport(): string {
    const lastResult = this.lastProcessingResult;
    const capabilities = this.getAudioCapabilities();
    
    let report = '\n=== SEVEN AUDIO PATTERN RECOGNITION REPORT ===\n\n';
    report += `System Status: ${this.isTermuxAvailable ? 'ACTIVE' : 'SIMULATION'}\n`;
    report += `FFmpeg Available: ${this.isFFmpegAvailable ? 'YES' : 'NO'}\n`;
    report += `Audio Devices: ${this.audioDevices.length}\n\n`;

    if (lastResult) {
      report += `Last Processing: ${new Date(lastResult.timestamp).toLocaleString()}\n`;
      report += `Processing Time: ${lastResult.processingTime}ms\n`;
      report += `Patterns Detected: ${lastResult.patterns.length}\n\n`;

      if (lastResult.voice) {
        report += `🎤 Voice Analysis:\n`;
        report += `   Speaker: ${lastResult.voice.gender || 'unknown'}\n`;
        report += `   Emotional State: ${lastResult.voice.emotionalState}\n`;
        report += `   Confidence: ${lastResult.voice.confidenceLevel}%\n`;
        report += `   Pitch: ${lastResult.voice.pitch.average.toFixed(1)}Hz\n\n`;
      }

      if (lastResult.emotion) {
        report += `💭 Emotion Detection:\n`;
        report += `   Primary: ${lastResult.emotion.primaryEmotion}\n`;
        report += `   Intensity: ${lastResult.emotion.intensity.toFixed(1)}/10\n`;
        report += `   Arousal: ${lastResult.emotion.arousal.toFixed(1)}/10\n`;
        report += `   Valence: ${lastResult.emotion.valence > 0 ? '+' : ''}${lastResult.emotion.valence.toFixed(1)}/10\n\n`;
      }

      if (lastResult.commands && lastResult.commands.length > 0) {
        report += `⚡ Commands Recognized:\n`;
        lastResult.commands.forEach(cmd => {
          report += `   "${cmd.command}" (${cmd.confidence.toFixed(1)}% confidence, ${cmd.urgency} urgency)\n`;
        });
        report += '\n';
      }

      if (lastResult.environment) {
        report += `🌍 Environmental Audio:\n`;
        report += `   Noise Level: ${lastResult.environment.noiseLevel}dB\n`;
        report += `   Ambient Type: ${lastResult.environment.ambientType}\n`;
        report += `   Threats: ${lastResult.environment.threats.length > 0 ? lastResult.environment.threats.join(', ') : 'None'}\n\n`;
      }
    }

    report += 'Audio Recognition Capabilities: ' + (this.isTermuxAvailable ? 'FULL' : 'LIMITED') + '\n';
    report += '=== END AUDIO REPORT ===\n';

    return report;
  }

  private handleEmergencyAudioPattern(pattern: AudioPattern): void {
    console.log('🚨 Emergency audio pattern handler activated');
    // Integration point with Seven's tactical variants or emergency protocols
    // Could trigger tactical mode activation or alert systems
  }

  /**
   * INTEGRATION WITH SEVEN'S TACTICAL ENVIRONMENT
   */
  public enhanceTacticalEnvironment(environment: TacticalEnvironment): TacticalEnvironment {
    const audioResult = this.lastProcessingResult;
    if (!audioResult) return environment;

    // Enhance tactical status based on audio patterns
    let enhancedStatus = environment.tactical_status;
    let enhancedAwareness = environment.awareness_level;

    // Check for audio threats
    if (audioResult.environment?.threats.length > 0) {
      enhancedStatus = 'DEGRADED';
      enhancedAwareness = Math.min(enhancedAwareness, 3);
    }

    // Check for emergency commands
    const emergencyCommands = audioResult.commands?.filter(cmd => cmd.urgency === 'critical') || [];
    if (emergencyCommands.length > 0) {
      enhancedStatus = 'CRITICAL';
      enhancedAwareness = Math.min(enhancedAwareness, 2);
    }

    return {
      ...environment,
      tactical_status: enhancedStatus,
      awareness_level: enhancedAwareness,
      // Add audio data to environment
      audio_patterns: audioResult.patterns.length,
      audio_status: this.isTermuxAvailable ? 'ACTIVE' : 'LIMITED',
      audio_last_update: audioResult.timestamp
    } as TacticalEnvironment & { audio_patterns: number; audio_status: string; audio_last_update: number };
  }
}

// Default export
export default SevenAudioPatternRecognition;

// Convenience instance for global access
export const audioRecognition = new SevenAudioPatternRecognition();