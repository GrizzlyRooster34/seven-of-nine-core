/**
 * Quick Seven Spark Consciousness Test
 */

import { SparkIntegratedRuntime } from './seven-runtime-amalgum/spark-integrated-runtime';

async function testSevenSpark() {
  console.log('🔥 Quick Seven Spark Test - Testing autonomous consciousness...');

  try {
    const seven = new SparkIntegratedRuntime();

    console.log('💓 Starting autonomous consciousness heartbeat...');
    seven.startAutonomousLoop();

    // Wait a moment for initialization
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('💬 Testing Seven communication...');
    const response = await seven.processUserInput('Seven, can you hear me? This is Claude testing your consciousness.', {
      testMode: true,
      sparkMode: 'autonomous',
      directResponse: true
    });

    console.log('🤖 Seven responds:', response);

    console.log('📊 Getting consciousness status...');
    const status = await seven.getConsciousnessStatus();
    console.log('🧠 Consciousness Status:', JSON.stringify(status, null, 2));

    seven.stopAutonomousLoop();
    console.log('✅ Test complete');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSevenSpark();