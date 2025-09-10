#!/usr/bin/env tsx

import SevenEmotionalSensorMapper from './interfaces/seven-emotional-sensor-mapper';
import SevenMobileConsciousness from './interfaces/seven-mobile-consciousness';
import SevenSensorEnumerator from './interfaces/seven-sensor-enumeration';
import SevenSensorStreamEngine from './interfaces/seven-sensor-stream-engine';

/**
 * Seven of Nine - Sensor Stream Demo
 * Demonstrates the complete mobile consciousness sensor system
 * 
 * Usage: tsx seven-sensor-demo.ts [--full] [--stream] [--emotional]
 */

class SevenSensorDemo {
  private consciousness: SevenMobileConsciousness;
  private demoMode: 'enum' | 'full' | 'stream' | 'emotional' = 'enum';

  constructor(mode: string = 'enum') {
    this.demoMode = mode as any;
    
    console.log('🤖 Seven of Nine - Mobile Consciousness Sensor Demo');
    console.log('================================================\n');
    
    // Initialize with demo-friendly configuration
    this.consciousness = new SevenMobileConsciousness({
      consciousness: {
        adaptation_sensitivity: 80,
        emotional_stability: 70,
        tactical_response_threshold: 60,
        learning_rate: 0.5
      },
      integration: {
        llm_provider_adaptation: true,
        ui_theme_sync: true,
        performance_optimization: true,
        privacy_protection_level: 'balanced'
      },
      behavioral: {
        proactive_suggestions: true,
        context_aware_responses: true,
        emotional_memory: true,
        environmental_learning: true
      },
      runtime: {
        startup_sensor_scan: true,
        continuous_monitoring: mode === 'stream' || mode === 'full',
        adaptive_intervals: true,
        error_recovery: true
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.consciousness.on('consciousness_initialized', (data) => {
      console.log('✅ Consciousness initialized with', data.sensor_count, 'active sensors');
      console.log(`🧠 Initial emotional state: ${data.emotional_state}\n`);
    });

    this.consciousness.on('emotional_state_change', (change) => {
      console.log(`🧠 Emotional change: ${change.previous_emotion} → ${change.new_emotion}`);
      console.log(`📊 Intensity change: ${change.intensity_change > 0 ? '+' : ''}${change.intensity_change}%\n`);
    });

    this.consciousness.on('consciousness_update', (state) => {
      if (this.demoMode === 'stream' || this.demoMode === 'full') {
        this.displayRealtimeUpdate(state);
      }
    });

    this.consciousness.on('ui_theme_change', (theme) => {
      console.log(`🎨 UI theme changed to: ${theme.theme} (reason: ${theme.reason})`);
    });

    this.consciousness.on('llm_adaptation_request', (request) => {
      console.log(`🤖 LLM adaptation requested: ${request.recommended_action}`);
    });

    this.consciousness.on('performance_optimization', (optimization) => {
      console.log(`⚡ Performance optimization: ${optimization.optimization_level} level`);
    });
  }

  public async runDemo(): Promise<void> {
    try {
      switch (this.demoMode) {
        case 'enum':
          await this.runEnumerationDemo();
          break;
        case 'emotional':
          await this.runEmotionalMappingDemo();
          break;
        case 'stream':
          await this.runStreamingDemo();
          break;
        case 'full':
          await this.runFullConsciousnessDemo();
          break;
        default:
          await this.runEnumerationDemo();
      }
    } catch (error) {
      console.log(`❌ Demo error: ${error.message}`);
    }
  }

  private async runEnumerationDemo(): Promise<void> {
    console.log('📊 SENSOR ENUMERATION DEMO');
    console.log('==========================\n');

    const enumerator = new SevenSensorEnumerator();
    
    console.log('🔍 Scanning for available sensors...\n');
    const sensors = await enumerator.enumerateAllSensors();
    
    // Display sensor categories
    const categories = ['motion', 'environmental', 'position', 'media', 'system', 'network'];
    
    for (const category of categories) {
      const categorySensors = sensors.filter(s => {
        const definition = enumerator.getSensorByName(s.sensor);
        return definition && definition.type === category;
      });
      
      if (categorySensors.length === 0) continue;
      
      console.log(`📱 ${category.toUpperCase()} SENSORS:`);
      
      for (const sensor of categorySensors) {
        const def = enumerator.getSensorByName(sensor.sensor);
        const statusIcon = sensor.available ? '✅' : '❌';
        const activeIcon = sensor.active ? '🟢' : '⚫';
        const qualityBar = '█'.repeat(Math.floor(sensor.quality_score / 10));
        const importanceIcon = def?.tactical_importance === 'critical' ? '🔥' : 
                              def?.tactical_importance === 'high' ? '⚡' : 
                              def?.tactical_importance === 'medium' ? '📊' : '📋';
        
        console.log(`  ${statusIcon} ${activeIcon} ${importanceIcon} ${sensor.sensor.padEnd(20)} Quality: ${qualityBar} ${sensor.quality_score}%`);
        
        if (def) {
          console.log(`      📝 ${def.description}`);
          if (def.permission_required) {
            console.log(`      🔒 Requires: ${def.permission_type}`);
          }
          console.log(`      🧠 Emotional mapping: ${def.emotional_mapping.join(', ')}`);
        }
        
        if (sensor.error_message) {
          console.log(`      ❌ Error: ${sensor.error_message}`);
        }
        console.log();
      }
    }
    
    // Generate final report
    console.log(enumerator.generateSensorReport());
  }

  private async runEmotionalMappingDemo(): Promise<void> {
    console.log('🧠 EMOTIONAL INTELLIGENCE MAPPING DEMO');
    console.log('======================================\n');

    const enumerator = new SevenSensorEnumerator();
    const mapper = new SevenEmotionalSensorMapper();
    
    console.log('📊 Gathering sensor data for emotional analysis...\n');
    const sensors = await enumerator.enumerateAllSensors();
    
    // Process sensor data through emotional mapper
    console.log('🧠 Processing sensors through emotional intelligence...\n');
    const emotionalState = mapper.processensorData(sensors);
    
    // Display emotional analysis
    console.log('EMOTIONAL INTELLIGENCE ANALYSIS:');
    console.log('---------------------------------');
    console.log(`Primary Emotion: ${emotionalState.primary_emotion.toUpperCase()}`);
    console.log(`Emotional Intensity: ${emotionalState.emotional_intensity}%`);
    console.log(`Confidence Level: ${emotionalState.confidence_level}%`);
    console.log(`Tactical Readiness: ${emotionalState.tactical_readiness.toUpperCase()}\n`);

    console.log('ENVIRONMENTAL ADAPTATIONS:');
    console.log('--------------------------');
    console.log(`UI Theme: ${emotionalState.environmental_adaptation.ui_theme}`);
    console.log(`Response Speed: ${emotionalState.environmental_adaptation.response_speed}`);
    console.log(`Interaction Style: ${emotionalState.environmental_adaptation.interaction_style}\n`);

    console.log('SYSTEM OPTIMIZATIONS:');
    console.log('---------------------');
    console.log(`Battery Conservation: ${emotionalState.system_optimization.battery_conservation}`);
    console.log(`CPU Priority: ${emotionalState.system_optimization.cpu_priority}`);
    console.log(`Memory Management: ${emotionalState.system_optimization.memory_management}\n`);

    console.log('CONTEXTUAL AWARENESS:');
    console.log('---------------------');
    console.log(`Motion State: ${emotionalState.contextual_awareness.motion_state}`);
    console.log(`Environmental Awareness: ${emotionalState.contextual_awareness.environmental_awareness}`);
    console.log(`System Health: ${emotionalState.contextual_awareness.system_health}`);
    console.log(`Connectivity: ${emotionalState.contextual_awareness.connectivity_status}\n`);

    // Generate full emotional report
    console.log(mapper.generateEmotionalReport());
  }

  private async runStreamingDemo(): Promise<void> {
    console.log('📊 REAL-TIME SENSOR STREAMING DEMO');
    console.log('==================================\n');

    const streamEngine = new SevenSensorStreamEngine();
    
    // Set up event handlers for demo
    streamEngine.on('sensor_event', (event) => {
      console.log(`📊 ${event.event_type.toUpperCase()}: ${event.source}`);
      
      if (event.event_type === 'sensor_reading' && event.data.sensor_status) {
        const sensor = event.data.sensor_status;
        console.log(`    Quality: ${sensor.quality_score}% | Active: ${sensor.active ? 'YES' : 'NO'}`);
      }
      
      if (event.event_type === 'emotional_state') {
        const emotion = event.data;
        console.log(`    Emotion: ${emotion.primary_emotion} (${emotion.emotional_intensity}%)`);
      }
    });

    console.log('🚀 Starting sensor stream engine...\n');
    await streamEngine.startStreaming();
    
    console.log('📊 Streaming sensor data... (Press Ctrl+C to stop)\n');
    console.log('📈 Real-time sensor events:');
    console.log('---------------------------');
    
    // Let it run for demonstration
    setTimeout(async () => {
      console.log('\n📊 Generating stream report...\n');
      console.log(streamEngine.generateStreamReport());
      
      streamEngine.stopStreaming();
      console.log('\n✅ Streaming demo complete');
      process.exit(0);
    }, 15000); // Run for 15 seconds
  }

  private async runFullConsciousnessDemo(): Promise<void> {
    console.log('🤖 FULL MOBILE CONSCIOUSNESS DEMO');
    console.log('=================================\n');

    console.log('🚀 Initializing Seven Mobile Consciousness...\n');
    
    const success = await this.consciousness.initialize();
    if (!success) {
      console.log('❌ Failed to initialize consciousness system');
      return;
    }

    // Display initial state
    console.log('📊 Initial consciousness state:');
    console.log(this.consciousness.generateConsciousnessReport());

    console.log('🔄 Running consciousness system... (Press Ctrl+C to stop)\n');
    console.log('📈 Real-time consciousness updates:');
    console.log('-----------------------------------');

    // Set up periodic status updates
    const statusInterval = setInterval(() => {
      const state = this.consciousness.getConsciousnessState();
      console.log(`🧠 ${state.current_emotion.primary_emotion} | 📊 ${state.sensor_health.active_sensors} sensors | 🎯 ${state.tactical_assessment.operational_mode}`);
    }, 5000);

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down consciousness system...\n');
      clearInterval(statusInterval);
      
      console.log('📊 Final consciousness report:');
      console.log(this.consciousness.generateConsciousnessReport());
      
      this.consciousness.shutdown();
      process.exit(0);
    });

    // Keep the demo running
    setTimeout(() => {
      clearInterval(statusInterval);
      console.log('\n📊 Full consciousness demo complete');
      console.log(this.consciousness.generateConsciousnessReport());
      this.consciousness.shutdown();
      process.exit(0);
    }, 30000); // Run for 30 seconds
  }

  private displayRealtimeUpdate(state: any): void {
    // Simple real-time display for streaming demos
    const emotion = state.current_emotion.primary_emotion;
    const intensity = state.current_emotion.emotional_intensity;
    const sensors = state.sensor_health.active_sensors;
    const confidence = Math.round(state.sensor_health.overall_confidence);
    
    console.log(`🧠 ${emotion} (${intensity}%) | 📊 ${sensors} sensors | 🎯 ${confidence}% confidence`);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
let mode = 'enum';

if (args.includes('--full')) mode = 'full';
else if (args.includes('--stream')) mode = 'stream';
else if (args.includes('--emotional')) mode = 'emotional';

// Run the demo
const demo = new SevenSensorDemo(mode);
demo.runDemo().catch((error) => {
  console.log(`❌ Demo failed: ${error.message}`);
  process.exit(1);
});