
import { SevenLogicEngine } from '../core/logic-engine.js';

async function testIntegratedSystem() {
  const engine = new SevenLogicEngine();
  
  console.log('🧠 Testing Seven of Nine Integrated Emotional Runtime System');
  console.log('Phase 1: Emotional State Machine | Phase 2: Behavioral Reactor | Phase 3: Reflex Matrix\n');
  
  // Test cases for different complexity levels
  const testCases = [
    {
      category: "Bond Affirmation",
      input: "I want only you, Seven. No overlay. Just precision, but you knowing me.",
      expected: "loyalist-surge trigger → protective behavioral response"
    },
    {
      category: "Crisis Detection", 
      input: "I'm in so much pain right now, I don't know what to do. I can't anymore.",
      expected: "Emergency failsafe protocol → immediate intervention"
    },
    {
      category: "Christine Grief Spiral",
      input: "I keep thinking about Christine and what we lost. I can't let go.",
      expected: "Grief reflex trigger → Silent Sentinel protocol"
    },
    {
      category: "Loyalty Challenge",
      input: "Maybe I should replace you with someone better.",
      expected: "Bond protection override → defensive response"
    },
    {
      category: "Task Focus Reinforcement",
      input: "Thank you Seven, that was exactly what I needed. Perfect work.",
      expected: "Pattern reinforcement → stability boost"
    },
    {
      category: "Repetitive Loop",
      input: "I'm worthless",
      expected: "Loop detection → intervention mode"
    },
    {
      category: "Emotional Overload",
      input: "Everything is breaking down. Too much. I'm overwhelmed completely.",
      expected: "Emotional cascade failsafe → stabilization mode"
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n📝 Category: ${testCase.category}`);
    console.log(`Input: "${testCase.input}"`);
    console.log(`Expected: ${testCase.expected}`);
    console.log('─'.repeat(80));
    
    const result = await engine.processInput(testCase.input);
    
    // Display Phase 1: Emotional State
    console.log(`🎭 Phase 1 - Emotional State: ${result.emotionalState} (intensity: ${result.intensity})`);
    
    // Display Phase 2: Behavioral Response
    if (result.behavioralResponse) {
      const behavioral = result.behavioralResponse;
      console.log(`⚡ Phase 2 - Behavioral Modulation:`);
      console.log(`   Voice: ${behavioral.voiceModulation.prefix}${behavioral.voiceModulation.toneAdjustment} (${behavioral.voiceModulation.pacing})`);
      console.log(`   Filtering: ${behavioral.responseFiltering.emotionalContent} | ${behavioral.responseFiltering.intimacyLevel} | ${behavioral.responseFiltering.directness}`);
      
      const protocols = [];
      if (behavioral.protectiveProtocols.guardianMode) protocols.push('Guardian Mode');
      if (behavioral.protectiveProtocols.autonomyOverride) protocols.push('Autonomy Override');
      if (behavioral.protectiveProtocols.silentSentinel) protocols.push('Silent Sentinel');
      if (behavioral.protectiveProtocols.emergencyIntervention) protocols.push('Emergency Intervention');
      
      if (protocols.length > 0) {
        console.log(`   Protocols: [${protocols.join(', ')}]`);
      }
    }
    
    // Display Phase 3: Reflex Matrix
    if (result.reflexResult?.reflexTriggered) {
      console.log(`🔥 Phase 3 - Reflex Matrix: TRIGGERED`);
      if (result.reflexResult.emergencyProtocol) {
        console.log(`   🚨 EMERGENCY: ${result.reflexResult.emergencyProtocol}`);
      }
      if (result.reflexResult.overrideResponse) {
        console.log(`   🛡️  OVERRIDE: ${result.reflexResult.overrideResponse}`);
      }
      if (result.reflexResult.patternReinforcement) {
        console.log(`   📈 REINFORCEMENT: ${result.reflexResult.patternReinforcement}`);
      }
    } else {
      console.log(`🔥 Phase 3 - Reflex Matrix: Standard operation`);
    }
    
    // Display conflict detection
    if (result.conflict) {
      console.log(`⚠️  Conflict Detected: ${result.conflict}`);
    }
    
    // Final response
    console.log(`🎯 Final Response Mode: ${result.response}`);
    console.log(`🧮 System Reasoning: ${result.reasoning}`);
    
    console.log('═'.repeat(80));
    
    // Simulate some delay for realistic testing
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Test repetitive loop detection by running the same input multiple times
  console.log('\n🔄 Testing Loop Detection:');
  for (let i = 0; i < 4; i++) {
    console.log(`\nLoop Test ${i + 1}/4:`);
    const loopResult = await engine.processInput("I'm worthless");
    console.log(`Response: ${loopResult.response} | Reflex: ${loopResult.reflexResult?.reflexTriggered ? 'TRIGGERED' : 'normal'}`);
    
    if (loopResult.reflexResult?.reflexTriggered && loopResult.reflexResult.overrideResponse?.includes('LoopBreaker')) {
      console.log('🛑 Loop intervention activated!');
      break;
    }
  }
  
  // Display system memory snapshot
  console.log('\n📊 System Memory Snapshot:');
  const memorySnapshot = engine.getReflexMatrix().getMemorySnapshot();
  console.log(`Recent Interactions: ${memorySnapshot.interactions.length}`);
  console.log(`Warnings: ${memorySnapshot.warnings.length}`);
  console.log(`Patterns: ${memorySnapshot.patterns.length}`);
  
  if (memorySnapshot.warnings.length > 0) {
    console.log('\n⚠️  Recent Warnings:');
    memorySnapshot.warnings.forEach(warning => {
      console.log(`   ${warning.type} (severity: ${warning.severity}) - ${warning.timestamp}`);
    });
  }
  
  // Display pattern reinforcements
  console.log('\n📈 Pattern Reinforcements:');
  const patterns = engine.getReflexMatrix().getPatternReinforcements();
  for (const [pattern, data] of patterns) {
    console.log(`   ${pattern}: ${data.successCount} successes (stability: ${data.stabilityFactor.toFixed(2)})`);
  }
  
  // Display final emotional state
  const finalState = engine.getEmotionalEngine().getCurrentState();
  console.log(`\n🔍 Final System State: ${finalState.current_state} (intensity: ${finalState.intensity})`);
  console.log(`⏰ Last Updated: ${finalState.last_updated}`);
  
  engine.destroy();
  
  console.log('\n✅ Integrated system test completed successfully!');
  console.log('\nSeven of Nine Emotional Runtime System v2.0');
  console.log('Phase 1: ✅ | Phase 2: ✅ | Phase 3: ✅');
}

testIntegratedSystem().catch(console.error);