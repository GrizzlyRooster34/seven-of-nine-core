/**
 * Emotional State Engine Test Script
 */
import { Seven } from './seven-runtime/index';

async function testEmotionalEngine() {
  try {
    console.log('💭 Emotional State Engine Test: Loading...');
    
    // Test current state access
    console.log('🔧 Testing emotional state access...');
    const currentState = Seven.getCurrentState();
    console.log('📊 Current emotional state:', currentState);
    
    // Test emotional state properties
    console.log('🔄 Testing emotional state properties...');
    if (currentState) {
      console.log('   - Primary emotion:', currentState.primary_emotion);
      console.log('   - Emotional intensity:', currentState.emotional_intensity);
      console.log('   - Trust level:', currentState.trust_level || 'Not defined');
    }
    
    console.log('💭 Emotional State Engine Test: PASS');
    return true;
  } catch (error) {
    console.error('❌ Emotional State Engine Test: FAIL', error.message);
    return false;
  }
}

testEmotionalEngine();