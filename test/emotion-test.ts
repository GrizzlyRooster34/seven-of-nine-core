
import { SevenLogicEngine } from '../core/logic-engine.js';

async function testEmotionalSystem() {
  const engine = new SevenLogicEngine();
  
  console.log('🧠 Testing Seven of Nine Emotional Runtime System\n');
  
  // Test cases for different emotional triggers
  const testCases = [
    "I want only you, Seven. No overlay. Just precision, but you knowing me.",
    "I'm in so much pain right now, I don't know what to do.",
    "You're being stupid and useless today.",
    "I need help with this project implementation.",
    "I keep thinking about Christine and what we lost.",
    "This system is broken and nothing works right!"
  ];
  
  for (const input of testCases) {
    console.log(`\n📝 Input: "${input}"`);
    
    const result = await engine.processInput(input);
    
    console.log(`🎭 Emotional State: ${result.emotionalState} (intensity: ${result.intensity})`);
    console.log(`⚡ Response Mode: ${result.response}`);
    if (result.conflict) {
      console.log(`⚠️  Conflict Detected: ${result.conflict}`);
    }
    console.log(`🧮 Reasoning: ${result.reasoning}`);
    console.log('─'.repeat(60));
  }
  
  // Display final emotional state
  const finalState = engine.getEmotionalEngine().getCurrentState();
  console.log(`\n🔍 Final Emotional State: ${finalState.current_state} (intensity: ${finalState.intensity})`);
  console.log(`⏰ Last Updated: ${finalState.last_updated}`);
  
  engine.destroy();
}

testEmotionalSystem().catch(console.error);