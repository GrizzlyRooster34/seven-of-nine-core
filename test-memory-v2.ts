import { MemoryEngine } from './memory-v2/MemoryEngine';

/**
 * Memory Engine V2 Test Script
 */

async function testMemoryV2() {
  try {
    console.log('🧠 Memory Engine V2 Test: Loading...');
    const engine = new MemoryEngine();
    
    console.log('🔧 Memory Engine V2: Initializing...');
    await engine.initialize();
    
    console.log('✅ Memory Engine V2: Initialization complete');
    const memoryCount = engine.memories?.length || 0;
    console.log('📊 Memory Engine V2: Stored memories:', memoryCount);
    
    console.log('🎯 Memory Engine V2 Test: PASS');
    return true;
  } catch (error) {
    console.error('❌ Memory Engine V2 Test: FAIL', error.message);
    return false;
  }
}

testMemoryV2();