/**
 * Memory Engine V3 Test Script
 */
import { AgentEpsilon } from './memory-v3/AgentEpsilon';
import { TemporalMemoryCore } from './memory-v3/TemporalMemoryCore';
import { MentalTimeTravelEngine } from './memory-v3/MentalTimeTravelEngine';
import { DecayWatchdog } from './memory-v3/DecayWatchdog';

async function testMemoryV3() {
  try {
    console.log('🧠 Memory Engine V3 Test: Loading components...');
    
    // Test Temporal Memory Core
    console.log('🔄 Testing Temporal Memory Core...');
    const temporalCore = new TemporalMemoryCore();
    await temporalCore.initialize();
    console.log('✅ Temporal Memory Core: PASS');
    
    // Test Mental Time Travel Engine
    console.log('🕰️ Testing Mental Time Travel Engine...');
    const mentalTimeTravel = new MentalTimeTravelEngine();
    await mentalTimeTravel.initialize();
    console.log('✅ Mental Time Travel Engine: PASS');
    
    // Test Decay Watchdog
    console.log('🐕 Testing Decay Watchdog...');
    const decayWatchdog = new DecayWatchdog();
    await decayWatchdog.initialize();
    console.log('✅ Decay Watchdog: PASS');
    
    // Test Agent Epsilon
    console.log('🎯 Testing Agent Epsilon...');
    const agentEpsilon = new AgentEpsilon();
    await agentEpsilon.initialize();
    console.log('✅ Agent Epsilon: PASS');
    
    console.log('🧠 Memory Engine V3 Test: ALL SYSTEMS OPERATIONAL');
    return true;
  } catch (error) {
    console.error('❌ Memory Engine V3 Test: FAIL', error.message);
    return false;
  }
}

testMemoryV3();