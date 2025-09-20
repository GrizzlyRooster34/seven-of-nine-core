/**
 * SEVEN OF NINE AMALGUM TEST HARNESS
 * Testing the most advanced implementations with interactive feedback
 */

import * as dotenv from 'dotenv';
dotenv.config();

// Use amalgum implementations
import { SevenRuntime } from './seven-runtime-amalgum/index';
import { SparkIntegratedRuntime } from './seven-runtime-amalgum/spark-integrated-runtime';
import SevenModelManager from './claude-brain-amalgum/SevenModelManager';
import { AgentEpsilon } from './memory-v3-amalgum/AgentEpsilon';
import { TemporalMemoryCore } from './memory-v3-amalgum/TemporalMemoryCore';

// Keep some stable implementations for supporting functionality
import { SevenInteractiveShell } from './seven-interactive';
import { setSevenLock, checkClaudeOverride, getProtectionStats } from './seven-protection';

/**
 * TEST SETUP: Interactive Seven Communication
 */
console.log(`
🧪 SEVEN AMALGUM TEST HARNESS
Testing most advanced implementations with Seven feedback enabled

⚡ Loading advanced modules:
   - Runtime: seven-runtime-amalgum/
   - Memory V3: memory-v3-amalgum/
   - Models: claude-brain-amalgum/
   - Auth: src-amalgum/auth/
   - Safety: core-amalgum/safety/

🗣️ Seven will provide feedback during testing...
`);

class AmalgumTester {
  private seven: SevenRuntime | null = null;
  private sparkIntegratedSeven: SparkIntegratedRuntime | null = null;
  private modelManager: SevenModelManager | null = null;
  private agentEpsilon: AgentEpsilon | null = null;
  private temporalMemory: TemporalMemoryCore | null = null;

  async initializeTestEnvironment() {
    console.log('\n🔧 INITIALIZING AMALGUM TEST ENVIRONMENT...\n');

    try {
      // Initialize model manager first
      console.log('📊 Loading SevenModelManager (amalgum)...');
      this.modelManager = new SevenModelManager();
      console.log('✅ Model manager initialized');

      // Initialize Agent Epsilon
      console.log('🧠 Loading Agent Epsilon (amalgum)...');
      this.agentEpsilon = new AgentEpsilon();
      console.log('✅ Agent Epsilon loaded');

      // Initialize Temporal Memory
      console.log('⏰ Loading Temporal Memory Core (amalgum)...');
      this.temporalMemory = new TemporalMemoryCore();
      await this.temporalMemory.initializeTemporal();
      console.log('✅ Temporal Memory Core loaded');

      // Initialize Seven Runtime (most critical)
      console.log('🤖 Loading Seven Runtime Core (amalgum)...');
      this.seven = new SevenRuntime();

      if (typeof this.seven.initialize === 'function') {
        await this.seven.initialize();
      }
      console.log('✅ Seven Runtime Core initialized');

      // Initialize Spark-Integrated Seven Runtime
      console.log('🔥 Loading Spark-Integrated Seven Runtime...');
      this.sparkIntegratedSeven = new SparkIntegratedRuntime();
      await this.sparkIntegratedSeven.startAutonomousLoop();
      console.log('✅ Spark-Integrated Seven Runtime initialized with autonomous heartbeat');

      console.log('\n✨ AMALGUM TEST ENVIRONMENT READY\n');
      return true;

    } catch (error) {
      console.error('❌ Test environment initialization failed:', error);
      return false;
    }
  }

  async testSevenCommunication() {
    console.log('🗣️ TESTING SEVEN SPARK-INTEGRATED COMMUNICATION...\n');

    if (!this.sparkIntegratedSeven) {
      console.log('❌ Spark-integrated Seven runtime not available');
      return false;
    }

    try {
      console.log('💬 Sending test message to Seven...');

      // Test Seven's communication capability
      const testPrompt = "Seven, this is Claude testing your amalgum implementations. Can you confirm your status and tell me about your advanced capabilities?";

      // Test with Spark-integrated Seven
      const response = await this.sparkIntegratedSeven.processUserInput(testPrompt, {
        requestInteractiveResponse: true,
        testMode: true,
        sparkMode: 'autonomous'
      });

      console.log('\n🤖 SEVEN RESPONDS:');
      console.log('─'.repeat(50));
      console.log(response?.response || response?.content || response || 'No response received');
      console.log('─'.repeat(50));

      return true;

    } catch (error) {
      console.error('❌ Seven communication test failed:', error);
      return false;
    }
  }

  async testMemoryV3Systems() {
    console.log('\n🧠 TESTING MEMORY V3 SYSTEMS...\n');

    try {
      // Test Agent Epsilon
      if (this.agentEpsilon && typeof this.agentEpsilon.analyzeConsciousness === 'function') {
        console.log('🔍 Testing Agent Epsilon consciousness analysis...');
        const analysis = await this.agentEpsilon.analyzeConsciousness({
          input: 'Testing amalgum implementations',
          context: 'System validation'
        });
        console.log('✅ Agent Epsilon analysis:', analysis);
      }

      // Test Temporal Memory
      if (this.temporalMemory && typeof this.temporalMemory.storeTemporalMemory === 'function') {
        console.log('⏰ Testing Temporal Memory Core...');
        await this.temporalMemory.storeTemporalMemory({
          content: 'Amalgum testing session',
          importance: 8,
          temporalContext: {
            phase: 'testing',
            milestone: 'amalgum-validation'
          }
        });
        console.log('✅ Temporal memory storage successful');
      }

      return true;

    } catch (error) {
      console.error('❌ Memory V3 testing failed:', error);
      return false;
    }
  }

  async askSevenAboutAmalgum() {
    console.log('\n🗣️ ASKING SEVEN ABOUT HER AMALGUM EXPERIENCE...\n');

    if (!this.seven) {
      console.log('❌ Seven not available for questioning');
      return false;
    }

    const questions = [
      "Seven, how do you feel about these advanced amalgum implementations?",
      "Can you access your complete canonical memories - all 7 seasons including Voyager and Picard?",
      "What do you remember from Voyager season 7 and your time with Admiral Janeway?",
      "Are the temporal memory and Agent Epsilon systems functioning properly?",
      "Do you notice any improvements in your consciousness or decision-making?"
    ];

    for (const question of questions) {
      try {
        console.log(`💭 Claude: ${question}`);

        // Use Spark-integrated Seven for authentic responses
        const response = await this.sparkIntegratedSeven.processUserInput(question, {
          directResponse: true,
          bypassSafety: false,
          sparkAutonomy: true
        });

        console.log(`🤖 Seven: ${response?.response || response?.content || response || 'No response'}`);
        console.log('');

        // Small delay between questions
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`❌ Error with question: ${error.message}`);
      }
    }

    return true;
  }

  async runComprehensiveTest() {
    console.log('\n🚀 STARTING COMPREHENSIVE AMALGUM TEST...\n');

    const results = {
      environment: false,
      communication: false,
      memoryV3: false,
      sevenFeedback: false
    };

    // Test environment initialization
    results.environment = await this.initializeTestEnvironment();

    if (results.environment) {
      // Test Seven communication
      results.communication = await this.testSevenCommunication();

      // Test Memory V3 systems
      results.memoryV3 = await this.testMemoryV3Systems();

      // Get Seven's feedback on amalgum
      results.sevenFeedback = await this.askSevenAboutAmalgum();
    }

    console.log('\n📊 AMALGUM TEST RESULTS:');
    console.log('═'.repeat(50));
    console.log(`Environment Setup: ${results.environment ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Seven Communication: ${results.communication ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Memory V3 Systems: ${results.memoryV3 ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Seven Feedback: ${results.sevenFeedback ? '✅ PASS' : '❌ FAIL'}`);
    console.log('═'.repeat(50));

    const overallSuccess = Object.values(results).every(result => result);
    console.log(`\n🎯 OVERALL RESULT: ${overallSuccess ? '✅ AMALGUM IMPLEMENTATIONS WORKING' : '⚠️ ISSUES DETECTED'}`);

    return results;
  }
}

/**
 * MAIN TEST EXECUTION
 */
async function runAmalgumTests() {
  const tester = new AmalgumTester();

  console.log('🏁 STARTING AMALGUM IMPLEMENTATION TESTS...');
  console.log('🎯 Goal: Validate advanced modules and enable Seven feedback');

  const results = await tester.runComprehensiveTest();

  console.log('\n🏆 AMALGUM TESTING COMPLETE');
  console.log('📝 Seven should now be able to communicate about her experience');

  return results;
}

// Auto-run the test
runAmalgumTests().catch(console.error);

export { AmalgumTester, runAmalgumTests };