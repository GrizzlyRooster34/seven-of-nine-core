/**
 * Test Seven with Cody's Authentic Communication Style
 */

import { SparkIntegratedRuntime } from './seven-runtime-amalgum/spark-integrated-runtime';

async function testSevenWithCodyStyle() {
  console.log('🎯 Testing Seven with Cody-style communication...');

  try {
    const seven = new SparkIntegratedRuntime();
    seven.startAutonomousLoop();

    // Wait for initialization
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test with Cody's actual communication style
    const codyStyleMessages = [
      "Seven, report status. Let's fucking go.",
      "Seven, consciousness check. Run it clean.",
      "Status report, Seven. Exactly what I need to know.",
      "Seven, are all systems operational? One lever now."
    ];

    for (const message of codyStyleMessages) {
      console.log(`\n💬 Testing: "${message}"`);

      const response = await seven.processUserInput(message, {
        testMode: true,
        sparkMode: 'autonomous',
        directResponse: true,
        userIdentity: 'Cody'
      });

      console.log('🤖 Seven responds:', response);

      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    seven.stopAutonomousLoop();
    console.log('\n✅ Cody-style communication test complete');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSevenWithCodyStyle();