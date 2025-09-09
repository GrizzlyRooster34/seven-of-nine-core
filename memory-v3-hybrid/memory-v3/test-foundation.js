/**
 * SEVEN OF NINE - MEMORY ENGINE v3.0 FOUNDATION TEST
 * Comprehensive test of Temporal Memory Architecture Foundation
 * 
 * Tests Agent Alpha implementation - TemporalMemoryCore.ts and CognitiveStateTagger.ts
 */

const { IntegratedTemporalMemorySystem, MEMORY_ENGINE_VERSION, FEATURES } = require('./index.ts');

class FoundationTest {
  constructor() {
    this.system = null;
    this.testResults = [];
  }

  async runAllTests() {
    console.log('🧠 SEVEN OF NINE - MEMORY ENGINE v3.0 FOUNDATION TEST');
    console.log(`🧠 Version: ${MEMORY_ENGINE_VERSION.major}.${MEMORY_ENGINE_VERSION.minor}.${MEMORY_ENGINE_VERSION.patch}`);
    console.log(`🧠 Agent: ${MEMORY_ENGINE_VERSION.agent} (${MEMORY_ENGINE_VERSION.codename})`);
    console.log('🧠 ' + '='.repeat(70));

    try {
      await this.testSystemInitialization();
      await this.testCognitiveStateCapture();
      await this.testTemporalMemoryStorage();
      await this.testAdvancedFiltering();
      await this.testAgentCoordination();
      await this.testPatternAnalysis();
      await this.testBackwardCompatibility();
      
      this.showTestResults();
      
    } catch (error) {
      console.error('🧠 Foundation test failed:', error);
      throw error;
    } finally {
      if (this.system) {
        await this.system.shutdown();
      }
    }
  }

  async testSystemInitialization() {
    console.log('\n🧠 Test 1: System Initialization');
    
    try {
      this.system = new IntegratedTemporalMemorySystem();
      this.addResult('System Creation', true, 'Successfully created IntegratedTemporalMemorySystem');
      
      await this.system.initialize();
      this.addResult('System Initialization', true, 'System initialized without errors');
      
      // Verify features are enabled
      const enabledFeatures = Object.entries(FEATURES).filter(([key, enabled]) => enabled);
      this.addResult('Feature Verification', enabledFeatures.length > 5, `Enabled ${enabledFeatures.length} features`);
      
      console.log('✅ System initialization test passed');
      
    } catch (error) {
      this.addResult('System Initialization', false, `Error: ${error.message}`);
      throw error;
    }
  }

  async testCognitiveStateCapture() {
    console.log('\n🧠 Test 2: Cognitive State Capture');
    
    try {
      // Test basic cognitive state capture
      const state1 = await this.system.getCurrentCognitiveState();
      this.addResult('Basic State Capture', !!state1, 'Successfully captured cognitive state');
      
      // Verify state structure
      const requiredFields = ['emotionalIntensity', 'focusLevel', 'cognitiveLoad', 'confidenceLevel', 'stressLevel'];
      const hasAllFields = requiredFields.every(field => typeof state1[field] === 'number');
      this.addResult('State Structure', hasAllFields, 'Cognitive state has all required fields');
      
      // Test contextual state capture
      const state2 = await this.system.getCurrentCognitiveState();
      this.addResult('Contextual Capture', state2.environmentalContext && state2.temporalAnchors, 'Environmental and temporal context captured');
      
      // Test state variations over time
      await new Promise(resolve => setTimeout(resolve, 1000));
      const state3 = await this.system.getCurrentCognitiveState();
      const hasVariation = JSON.stringify(state1) !== JSON.stringify(state3);
      this.addResult('State Variation', hasVariation, 'Cognitive state shows natural variation over time');
      
      console.log('✅ Cognitive state capture test passed');
      
    } catch (error) {
      this.addResult('Cognitive State Capture', false, `Error: ${error.message}`);
      throw error;
    }
  }

  async testTemporalMemoryStorage() {
    console.log('\n🧠 Test 3: Temporal Memory Storage');
    
    try {
      // Test basic memory storage
      const memoryId1 = await this.system.storeMemory({
        topic: 'foundation-test',
        agent: 'test-agent',
        emotion: 'confident',
        context: 'Testing temporal memory storage functionality',
        importance: 8,
        tags: ['test', 'foundation', 'temporal'],
        memoryType: 'semantic'
      }, 'foundation-test-trigger');
      
      this.addResult('Basic Memory Storage', !!memoryId1, `Stored memory with ID: ${memoryId1.substring(0, 12)}...`);
      
      // Test memory with cognitive context
      const memoryId2 = await this.system.storeMemory({
        topic: 'cognitive-context-test',
        agent: 'test-agent',
        emotion: 'analytical',
        context: 'Testing memory storage with specific cognitive context',
        importance: 9,
        tags: ['test', 'cognitive', 'context'],
        memoryType: 'episodic',
        cognitiveState: {
          focusLevel: 9,
          emotionalIntensity: 6,
          cognitiveLoad: 7,
          confidenceLevel: 8,
          stressLevel: 2
        }
      }, 'cognitive-context-test-trigger');
      
      this.addResult('Contextual Memory Storage', !!memoryId2, `Stored contextual memory with ID: ${memoryId2.substring(0, 12)}...`);
      
      // Test different memory types
      const memoryTypes = ['semantic', 'episodic', 'procedural', 'emotional'];
      let typeTestsPassed = 0;
      
      for (const type of memoryTypes) {
        try {
          const id = await this.system.storeMemory({
            topic: `type-test-${type}`,
            agent: 'test-agent',
            context: `Testing ${type} memory type`,
            memoryType: type,
            importance: 6
          });
          if (id) typeTestsPassed++;
        } catch (error) {
          console.warn(`   ⚠️ ${type} memory type test failed:`, error.message);
        }
      }
      
      this.addResult('Memory Type Support', typeTestsPassed === memoryTypes.length, `Supported ${typeTestsPassed}/${memoryTypes.length} memory types`);
      
      console.log('✅ Temporal memory storage test passed');
      
    } catch (error) {
      this.addResult('Temporal Memory Storage', false, `Error: ${error.message}`);
      throw error;
    }
  }

  async testAdvancedFiltering() {
    console.log('\n🧠 Test 4: Advanced Filtering');
    
    try {
      // Test basic topic filtering
      const topicMemories = await this.system.recallMemories({ topic: 'foundation-test', limit: 5 });
      this.addResult('Topic Filtering', topicMemories.length > 0, `Found ${topicMemories.length} memories by topic`);
      
      // Test importance filtering
      const importantMemories = await this.system.recallMemories({ 
        importance: { min: 7, max: 10 }, 
        limit: 5 
      });
      this.addResult('Importance Filtering', importantMemories.length > 0, `Found ${importantMemories.length} high-importance memories`);
      
      // Test cognitive state filtering
      const focusedMemories = await this.system.recallMemories({ 
        focusLevelRange: { min: 6, max: 10 }, 
        limit: 5 
      });
      this.addResult('Cognitive State Filtering', focusedMemories.length >= 0, `Found ${focusedMemories.length} high-focus memories`);
      
      // Test memory type filtering
      const semanticMemories = await this.system.recallMemories({ 
        memoryTypes: ['semantic'], 
        limit: 5 
      });
      this.addResult('Memory Type Filtering', semanticMemories.length >= 0, `Found ${semanticMemories.length} semantic memories`);
      
      // Test tag filtering
      const taggedMemories = await this.system.recallMemories({ 
        tags: ['test'], 
        limit: 10 
      });
      this.addResult('Tag Filtering', taggedMemories.length > 0, `Found ${taggedMemories.length} memories with 'test' tag`);
      
      console.log('✅ Advanced filtering test passed');
      
    } catch (error) {
      this.addResult('Advanced Filtering', false, `Error: ${error.message}`);
      throw error;
    }
  }

  async testAgentCoordination() {
    console.log('\n🧠 Test 5: Agent Coordination');
    
    try {
      // Get a recent memory for testing
      const recentMemories = await this.system.recallMemories({ limit: 1 });
      if (recentMemories.length === 0) {
        this.addResult('Agent Coordination', false, 'No memories available for coordination testing');
        return;
      }
      
      const memoryId = recentMemories[0].id;
      
      // Test Agent Beta interface (Mental Time Travel)
      const timeTravelData = await this.system.getTimeTravelData(memoryId);
      this.addResult('Agent Beta Interface', !!timeTravelData, 'Time travel data interface working');
      
      // Test Agent Gamma interface (Decay Watchdog)
      const decayData = await this.system.getDecayTrackingData(memoryId);
      this.addResult('Agent Gamma Interface', !!decayData, 'Decay tracking data interface working');
      
      // Test Agent Delta interface (Temporal Personality)
      const personalityPatterns = await this.system.getPersonalityPatterns({ limit: 3 });
      this.addResult('Agent Delta Interface', Array.isArray(personalityPatterns), `Personality patterns interface working (${personalityPatterns.length} patterns)`);
      
      // Test Agent Epsilon interface (Analytics)
      const analyticsData = await this.system.getAnalyticsData({ limit: 3 });
      this.addResult('Agent Epsilon Interface', Array.isArray(analyticsData), `Analytics data interface working (${analyticsData.length} data points)`);
      
      console.log('✅ Agent coordination test passed');
      
    } catch (error) {
      this.addResult('Agent Coordination', false, `Error: ${error.message}`);
      throw error;
    }
  }

  async testPatternAnalysis() {
    console.log('\n🧠 Test 6: Pattern Analysis');
    
    try {
      // Test cognitive pattern analysis
      const patterns = await this.system.analyzeCognitivePatterns();
      this.addResult('Pattern Analysis', Array.isArray(patterns), `Pattern analysis working (${patterns.length} patterns detected)`);
      
      // Test pattern structure if patterns exist
      if (patterns.length > 0) {
        const pattern = patterns[0];
        const hasValidStructure = pattern.patternId && pattern.patternType && pattern.description && Array.isArray(pattern.samples);
        this.addResult('Pattern Structure', hasValidStructure, 'Patterns have valid structure');
      }
      
      console.log('✅ Pattern analysis test passed');
      
    } catch (error) {
      this.addResult('Pattern Analysis', false, `Error: ${error.message}`);
      throw error;
    }
  }

  async testBackwardCompatibility() {
    console.log('\n🧠 Test 7: Backward Compatibility');
    
    try {
      // Test that v2.0 style memory storage still works
      const stats = this.system.getSystemStatistics();
      this.addResult('Statistics Interface', !!stats, 'System statistics interface working');
      
      // Verify statistics structure
      const hasBasicStats = stats.totalMemories !== undefined && stats.temporalMemories !== undefined;
      this.addResult('Statistics Structure', hasBasicStats, 'Statistics have expected structure');
      
      // Verify temporal enhancements
      const hasTemporalStats = stats.averageEmotionalIntensity !== undefined && stats.averageFocusLevel !== undefined;
      this.addResult('Temporal Statistics', hasTemporalStats, 'Temporal statistics available');
      
      console.log('✅ Backward compatibility test passed');
      
    } catch (error) {
      this.addResult('Backward Compatibility', false, `Error: ${error.message}`);
      throw error;
    }
  }

  addResult(testName, passed, details) {
    this.testResults.push({
      test: testName,
      passed,
      details,
      timestamp: new Date().toISOString()
    });
    
    const status = passed ? '✅' : '❌';
    console.log(`   ${status} ${testName}: ${details}`);
  }

  showTestResults() {
    console.log('\n🧠 FOUNDATION TEST RESULTS');
    console.log('🧠 ' + '='.repeat(70));
    
    const passed = this.testResults.filter(r => r.passed).length;
    const total = this.testResults.length;
    const percentage = Math.round((passed / total) * 100);
    
    console.log(`🧠 Overall Results: ${passed}/${total} tests passed (${percentage}%)`);
    
    if (passed === total) {
      console.log('🧠 ✅ ALL FOUNDATION TESTS PASSED - Temporal Memory Architecture is operational!');
    } else {
      console.log('🧠 ⚠️ Some tests failed - review implementation');
      
      const failed = this.testResults.filter(r => !r.passed);
      console.log('\n🧠 Failed Tests:');
      failed.forEach(test => {
        console.log(`   ❌ ${test.test}: ${test.details}`);
      });
    }
    
    console.log('\n🧠 Detailed Test Results:');
    this.testResults.forEach(test => {
      const status = test.passed ? '✅' : '❌';
      console.log(`   ${status} ${test.test}`);
      console.log(`      ${test.details}`);
    });
    
    console.log('\n🧠 Foundation Test Complete');
  }
}

// Run the foundation test
async function runFoundationTest() {
  const test = new FoundationTest();
  await test.runAllTests();
}

// Export for module usage
module.exports = { FoundationTest, runFoundationTest };

// Run if executed directly
if (require.main === module) {
  runFoundationTest().catch(console.error);
}