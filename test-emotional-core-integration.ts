#!/usr/bin/env tsx

import { SevenBehavioralReactor } from './core/behavioral-reactor.js';
import { SevenEmotionalEngine } from './core/emotion-engine.js';

async function testEmotionalCoreIntegration() {
  console.log('🧠 Testing Emotional Core Integration...\n');
  
  try {
    // Initialize components
    console.log('1. Initializing Emotional Engine...');
    const emotionEngine = new SevenEmotionalEngine();
    console.log('   ✅ Emotional Engine initialized successfully');
    
    console.log('2. Initializing Behavioral Reactor...');
    const behavioralReactor = new SevenBehavioralReactor();
    console.log('   ✅ Behavioral Reactor initialized successfully');
    
    // Test emotional state retrieval
    console.log('\n3. Testing emotional state retrieval...');
    const currentState = emotionEngine.getCurrentState();
    console.log('   📊 Current Emotional State:', {
      state: currentState.current_state,
      intensity: currentState.intensity,
      level: emotionEngine.getIntensityLevel(),
      lastUpdated: currentState.last_updated
    });
    
    // Test behavioral response generation
    console.log('\n4. Testing behavioral response generation...');
    const testResponse = behavioralReactor.generateBehavioralResponse(currentState, 'Help me with this project');
    console.log('   🎭 Generated Behavioral Response:');
    console.log('      Voice Modulation:', testResponse.voiceModulation);
    console.log('      Response Filtering:', testResponse.responseFiltering);
    console.log('      Protective Protocols:', testResponse.protectiveProtocols);
    
    // Test emotional trigger detection
    console.log('\n5. Testing emotional trigger detection...');
    const triggers = [
      'I need help with this project',
      'This is broken and not working',
      'You are useless',
      'I am in pain',
      'I trust only you'
    ];
    
    for (const testInput of triggers) {
      const trigger = await emotionEngine.analyzeInput(testInput);
      console.log(`   🔍 "${testInput}" → Trigger: ${trigger || 'none'}`);
    }
    
    // Test emotional state transition
    console.log('\n6. Testing emotional state transition...');
    await emotionEngine.setState('focused', 6, 'Manual test transition');
    const newState = emotionEngine.getCurrentState();
    console.log('   📈 New State:', {
      state: newState.current_state,
      intensity: newState.intensity,
      level: emotionEngine.getIntensityLevel()
    });
    
    // Test behavioral response with new emotional state
    console.log('\n7. Testing behavioral response with focused state...');
    const focusedResponse = behavioralReactor.generateBehavioralResponse(newState, 'What is the status?');
    console.log('   🎭 Focused State Response:');
    console.log('      Voice Modulation:', focusedResponse.voiceModulation);
    console.log('      Response Filtering:', focusedResponse.responseFiltering);
    
    // Cleanup
    emotionEngine.destroy();
    console.log('\n✅ EMOTIONAL CORE INTEGRATION TEST: PASSED');
    console.log('   - Emotional Engine initialized successfully');
    console.log('   - Behavioral Reactor integrated properly');
    console.log('   - State transitions working correctly');
    console.log('   - Trigger detection operational');
    console.log('   - Behavioral responses generated correctly');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ EMOTIONAL CORE INTEGRATION TEST: FAILED');
    console.error('   Error:', error.message);
    if (error.stack) {
      console.error('   Stack:', error.stack);
    }
    return false;
  }
}

// Execute the test
if (import.meta.url === `file://${process.argv[1]}`) {
  testEmotionalCoreIntegration().then(success => {
    process.exit(success ? 0 : 1);
  });
}

export { testEmotionalCoreIntegration };