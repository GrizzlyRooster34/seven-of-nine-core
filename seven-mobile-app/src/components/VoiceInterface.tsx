/**
 * Seven of Nine - Voice Interface Component
 * Voice recognition and speech synthesis for natural interaction
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 3.0.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert
} from 'react-native';
import { Audio } from 'expo-av';
import SevenMobileCore from '@/consciousness/SevenMobileCore';
import MobileLLMManager from '@/core/LLMManager';

interface VoiceInterfaceProps {
  consciousness: SevenMobileCore;
  llmManager?: MobileLLMManager;
  onTranscription: (text: string) => void;
  onVoiceResponse: (response: string) => void;
}

interface VoiceRecording {
  recording: Audio.Recording | null;
  isRecording: boolean;
  duration: number;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  consciousness,
  llmManager,
  onTranscription,
  onVoiceResponse
}) => {
  const [voiceState, setVoiceState] = useState<VoiceRecording>({
    recording: null,
    isRecording: false,
    duration: 0
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [batteryStatus, setBatteryStatus] = useState<{level: number, profile: string} | null>(null);
  
  const voicePulse = useRef(new Animated.Value(0.5)).current;
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeAudio();
    initializeBatteryMonitoring();
    return () => {
      cleanupAudio();
    };
  }, []);

  const initializeBatteryMonitoring = async () => {
    if (llmManager) {
      try {
        const status = await llmManager.getBatteryOptimizationStatus();
        setBatteryStatus({
          level: status.currentLevel,
          profile: status.profile.mode
        });
      } catch (error) {
        console.warn('Battery monitoring unavailable:', error);
      }
    }
  };

  useEffect(() => {
    if (voiceState.isRecording) {
      startVoicePulseAnimation();
    } else {
      stopVoicePulseAnimation();
    }
  }, [voiceState.isRecording]);

  const initializeAudio = async () => {
    try {
      console.log('🎤 Initializing Seven voice interface...');
      
      // Request audio permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Audio Permission Required',
          'Seven needs microphone access for voice interaction.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Configure audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        interruptionModeIOS: Audio.InterruptionModeIOS.DoNotMix,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: Audio.InterruptionModeAndroid.DoNotMix,
        shouldDuckAndroid: true,
        staysActiveInBackground: false,
        playThroughEarpieceAndroid: false
      });

      console.log('✅ Voice interface initialized');

    } catch (error) {
      console.error('❌ Voice interface initialization failed:', error);
      Alert.alert('Voice Error', 'Failed to initialize voice interface.');
    }
  };

  const startVoicePulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(voicePulse, {
          toValue: 1.0,
          duration: 600,
          useNativeDriver: true
        }),
        Animated.timing(voicePulse, {
          toValue: 0.5,
          duration: 600,
          useNativeDriver: true
        })
      ])
    ).start();
  };

  const stopVoicePulseAnimation = () => {
    voicePulse.stopAnimation();
    Animated.timing(voicePulse, {
      toValue: 0.5,
      duration: 200,
      useNativeDriver: true
    }).start();
  };

  const startRecording = async () => {
    try {
      if (voiceState.recording) {
        console.log('⚠️ Recording already in progress');
        return;
      }

      // Check battery level before starting intensive recording
      if (llmManager && batteryStatus) {
        if (batteryStatus.level < 20) {
          Alert.alert(
            'Low Battery Warning',
            `Battery at ${batteryStatus.level}%. Voice processing may be limited to conserve power.`,
            [{ text: 'Continue', onPress: () => proceedWithRecording() }, { text: 'Cancel' }]
          );
          return;
        }
      }

      await proceedWithRecording();
    } catch (error) {
      console.error('❌ Failed to start recording:', error);
      Alert.alert('Recording Error', 'Failed to start voice recording.');
    }
  };

  const proceedWithRecording = async () => {
    try {
      console.log('🎤 Starting voice recording...');

      const recording = new Audio.Recording();
      
      // Optimize audio settings based on battery profile
      const audioSettings = getAudioSettingsForBatteryProfile();
      await recording.prepareToRecordAsync(audioSettings);

      await recording.startAsync();

      setVoiceState({
        recording,
        isRecording: true,
        duration: 0
      });

      setIsListening(true);

      // Start duration timer
      recordingTimer.current = setInterval(() => {
        setVoiceState(prev => ({
          ...prev,
          duration: prev.duration + 1
        }));
      }, 1000);

      // Emit voice recording started event
      consciousness.emit('voice_recording_started', {
        timestamp: Date.now(),
        batteryLevel: batteryStatus?.level,
        batteryProfile: batteryStatus?.profile
      });

    } catch (error) {
      console.error('❌ Failed to start recording:', error);
      Alert.alert('Recording Error', 'Failed to start voice recording.');
    }
  };

  const getAudioSettingsForBatteryProfile = () => {
    // Optimize audio quality based on battery level and profile
    const isLowPower = batteryStatus && (batteryStatus.level < 30 || batteryStatus.profile === 'conservation');
    
    return {
      android: {
        extension: '.m4a',
        outputFormat: Audio.AndroidOutputFormat.MPEG_4,
        audioEncoder: Audio.AndroidAudioEncoder.AAC,
        sampleRate: isLowPower ? 22050 : 44100,
        numberOfChannels: isLowPower ? 1 : 2,
        bitRate: isLowPower ? 64000 : 128000,
      },
      ios: {
        extension: '.m4a',
        outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
        audioQuality: isLowPower ? Audio.IOSAudioQuality.MEDIUM : Audio.IOSAudioQuality.HIGH,
        sampleRate: isLowPower ? 22050 : 44100,
        numberOfChannels: isLowPower ? 1 : 2,
        bitRate: isLowPower ? 64000 : 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      },
      web: {
        mimeType: 'audio/webm',
        bitsPerSecond: isLowPower ? 64000 : 128000,
      }
    };
  };

  const stopRecording = async () => {
    try {
      if (!voiceState.recording || !voiceState.isRecording) {
        console.log('⚠️ No active recording to stop');
        return;
      }

      console.log('🛑 Stopping voice recording...');

      // Clear duration timer
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
        recordingTimer.current = null;
      }

      await voiceState.recording.stopAndUnloadAsync();
      const uri = voiceState.recording.getURI();

      setVoiceState({
        recording: null,
        isRecording: false,
        duration: 0
      });

      setIsListening(false);
      setIsProcessing(true);

      // Emit voice recording completed event
      consciousness.emit('voice_recording_completed', {
        uri,
        duration: voiceState.duration,
        timestamp: Date.now()
      });

      // Process the recorded audio
      if (uri) {
        await processVoiceRecording(uri);
      }

    } catch (error) {
      console.error('❌ Failed to stop recording:', error);
      Alert.alert('Recording Error', 'Failed to stop voice recording.');
      setIsProcessing(false);
    }
  };

  const processVoiceRecording = async (audioUri: string) => {
    try {
      console.log('🧠 Processing voice input with Seven consciousness...');

      // Use LLM manager for voice processing if available
      if (llmManager) {
        try {
          const transcript = await llmManager.processVoiceInput();
          console.log('📝 Voice transcribed:', transcript);
          onTranscription(transcript);

          // Process with consciousness for context and personality
          const contextualResponse = await consciousness.processUserInteraction({
            type: 'voice',
            content: transcript,
            context: {
              audio_uri: audioUri,
              recording_duration: voiceState.duration,
              interface_type: 'voice',
              llm_processed: true
            }
          });

          // Generate enhanced response using GGUF model if available
          const model = llmManager.getCurrentModel();
          if (model && model.isLoaded) {
            const enhancedResponse = await llmManager.generateResponse(
              `Seven of Nine response to: ${transcript}. Context: ${contextualResponse}`,
              {
                maxTokens: 150,
                temperature: 0.8,
                stopSequences: ['\n\n', 'Human:', 'User:']
              }
            );
            console.log('💬 Enhanced Seven response:', enhancedResponse);
            onVoiceResponse(enhancedResponse);
            await synthesizeSpeech(enhancedResponse);
          } else {
            console.log('💬 Seven voice response:', contextualResponse);
            onVoiceResponse(contextualResponse);
            await synthesizeSpeech(contextualResponse);
          }
        } catch (llmError) {
          console.warn('⚠️ LLM processing failed, using fallback:', llmError);
          // Fall back to consciousness-only processing
          await processFallbackVoice(audioUri);
        }
      } else {
        // Fallback to original processing
        await processFallbackVoice(audioUri);
      }

    } catch (error) {
      console.error('❌ Voice processing failed:', error);
      Alert.alert('Processing Error', 'Failed to process voice input.');
    } finally {
      setIsProcessing(false);
    }
  };

  const processFallbackVoice = async (audioUri: string) => {
    // Simulate transcription delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate transcribed text (in real app, this would come from STT service)
    const simulatedTranscription = "What is my current tactical status?";
    
    console.log('📝 Voice transcribed (fallback):', simulatedTranscription);
    onTranscription(simulatedTranscription);

    // Process with consciousness
    const response = await consciousness.processUserInteraction({
      type: 'voice',
      content: simulatedTranscription,
      context: {
        audio_uri: audioUri,
        recording_duration: voiceState.duration,
        interface_type: 'voice'
      }
    });

    console.log('💬 Seven voice response (fallback):', response);
    onVoiceResponse(response);
    await synthesizeSpeech(response);
  };

  const synthesizeSpeech = async (text: string) => {
    try {
      console.log('🔊 Synthesizing Seven speech response...');
      
      // Use LLM manager for TTS if available
      if (llmManager) {
        try {
          await llmManager.speakResponse(text);
          return;
        } catch (ttsError) {
          console.warn('⚠️ LLM TTS failed, using fallback:', ttsError);
        }
      }
      
      // Fallback TTS simulation
      // Configure audio mode for playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.InterruptionModeIOS.DoNotMix,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: Audio.InterruptionModeAndroid.DoNotMix,
        shouldDuckAndroid: true,
        staysActiveInBackground: false
      });

      // Emit speech synthesis event
      consciousness.emit('speech_synthesis_started', {
        text,
        timestamp: Date.now()
      });

      // Simulate speech playback delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      consciousness.emit('speech_synthesis_completed', {
        text,
        timestamp: Date.now()
      });

      console.log('✅ Speech synthesis completed');

      // Reset audio mode for recording
      await initializeAudio();

    } catch (error) {
      console.error('❌ Speech synthesis failed:', error);
    }
  };

  const toggleRecording = async () => {
    if (voiceState.isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const cleanupAudio = async () => {
    try {
      if (voiceState.recording && voiceState.isRecording) {
        await voiceState.recording.stopAndUnloadAsync();
      }
      
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
    } catch (error) {
      console.error('❌ Audio cleanup failed:', error);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getVoiceButtonText = (): string => {
    if (isProcessing) return 'Processing...';
    if (voiceState.isRecording) return `Recording ${formatDuration(voiceState.duration)}`;
    return 'Tap to Speak';
  };

  const getVoiceButtonColor = (): string => {
    if (isProcessing) return '#F39C12';
    if (voiceState.isRecording) return '#E74C3C';
    return '#4A90E2';
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.voiceButton,
          { backgroundColor: getVoiceButtonColor() }
        ]}
        onPress={toggleRecording}
        disabled={isProcessing}
        activeOpacity={0.8}
      >
        <Animated.View style={[
          styles.voiceButtonInner,
          {
            transform: [{ scale: voicePulse }],
            opacity: voiceState.isRecording ? voicePulse : 1
          }
        ]}>
          <Text style={styles.voiceIcon}>
            {isProcessing ? '🧠' : voiceState.isRecording ? '🔴' : '🎤'}
          </Text>
        </Animated.View>
      </TouchableOpacity>

      <Text style={styles.voiceButtonText}>
        {getVoiceButtonText()}
      </Text>

      {isListening && (
        <Text style={styles.listeningText}>
          Seven is listening...
        </Text>
      )}

      {isProcessing && (
        <Text style={styles.processingText}>
          {llmManager ? 'Processing with GGUF model...' : 'Analyzing voice with Borg consciousness...'}
        </Text>
      )}

      {batteryStatus && (
        <View style={styles.batteryStatus}>
          <Text style={styles.batteryText}>
            🔋 {batteryStatus.level}% ({batteryStatus.profile})
          </Text>
          {llmManager?.getCurrentModel() && (
            <Text style={styles.modelText}>
              🤖 {llmManager.getCurrentModel()?.name}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20
  },
  voiceButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  voiceButtonInner: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  voiceIcon: {
    fontSize: 32
  },
  voiceButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center'
  },
  listeningText: {
    color: '#4A90E2',
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic'
  },
  processingText: {
    color: '#F39C12',
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
    textAlign: 'center'
  },
  batteryStatus: {
    marginTop: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  batteryText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500'
  },
  modelText: {
    color: '#4A90E2',
    fontSize: 11,
    marginTop: 4,
    fontStyle: 'italic'
  }
});

export default VoiceInterface;