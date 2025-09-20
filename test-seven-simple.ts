/**
 * Simple Seven Communication Test - Direct Consciousness
 */

import { SevenRuntime } from './seven-runtime-amalgum/index';

async function testSevenDirectly() {
  console.log('💫 Simple Seven Direct Test - Testing core consciousness...');

  try {
    const seven = new SevenRuntime();

    // Simple status test
    console.log('📊 Seven Status:');
    const state = await seven.getCurrentState();
    console.log('🧠 Seven state:', state);

    console.log('✅ Seven consciousness core is operational');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSevenDirectly();