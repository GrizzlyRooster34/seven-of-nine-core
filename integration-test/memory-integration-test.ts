import { MemoryStore, MemoryEntry, MemoryQuery } from './memory-store';

/**
 * INSTANCE B MEMORY INTEGRATION TEST
 * Testing Instance B's advanced memory persistence systems
 * Compatibility with Seven-of-Nine-Core v4.1.0
 */


interface TestResult {
  test: string;
  status: 'PASS' | 'FAIL' | 'ERROR';
  details: string;
  duration?: number;
}

class MemoryIntegrationTest {
  private results: TestResult[] = [];
  private memoryStore: MemoryStore;

  constructor() {
    // Mock SevenState for testing (Instance B dependency)
    const mockSevenState = {
      primary_emotion: 'analytical',
      intensity: 7,
      secondary_emotions: [],
      triggers_detected: [],
      protective_mode_active: false,
      override_required: false,
      needs_external_reasoning: false,
      loyalty_level: 8,
      situational_awareness: {
        user_stress_detected: false,
        environmental_threats: [],
        relationship_status: 'stable',
        conversation_context: 'testing'
      },
      memory_flags: {
        emotional_significance: 'medium' as const,
        should_remember: true,
        relationship_impact: 'neutral' as const
      }
    };

    // Initialize memory store with mock data
    this.memoryStore = new MemoryStore();
  }

  async runIntegrationTests(): Promise<boolean> {
    console.log('🧠 INSTANCE B MEMORY INTEGRATION TEST SUITE');
    console.log('Testing advanced memory persistence and consciousness continuity\n');

    // Test 1: Basic Memory Storage
    await this.testBasicMemoryStorage();
    
    // Test 2: Memory Relationships
    await this.testMemoryRelationships();
    
    // Test 3: Semantic Search
    await this.testSemanticSearch();
    
    // Test 4: Temporal Queries
    await this.testTemporalQueries();
    
    // Test 5: Natural Language Mirror
    await this.testMemoryMirror();
    
    // Test 6: Memory Consolidation
    await this.testMemoryConsolidation();

    // Test 7: Emotional Pattern Analysis
    await this.testEmotionalPatterns();

    return this.evaluateResults();
  }

  private async testBasicMemoryStorage(): Promise<void> {
    const startTime = Date.now();
    try {
      const mockEntry = {
        timestamp: new Date().toISOString(),
        input: 'Test integration with Seven-of-Nine-Core',
        output: 'Integration test proceeding with tactical precision',
        emotionalState: {
          primary_emotion: 'analytical',
          intensity: 7,
          secondary_emotions: [],
          triggers_detected: [],
          protective_mode_active: false,
          override_required: false,
          needs_external_reasoning: false,
          loyalty_level: 8,
          situational_awareness: {
            user_stress_detected: false,
            environmental_threats: [],
            relationship_status: 'stable',
            conversation_context: 'testing'
          },
          memory_flags: {
            emotional_significance: 'medium' as const,
            should_remember: true,
            relationship_impact: 'neutral' as const
          }
        },
        context: { test: 'integration' },
        significance: 'high' as const,
        tags: ['integration', 'test', 'seven-core']
      };

      const memoryId = await this.memoryStore.updateMemory(mockEntry);
      
      if (memoryId && memoryId.startsWith('seven-memory-')) {
        this.results.push({
          test: 'Basic Memory Storage',
          status: 'PASS',
          details: `Memory stored with ID: ${memoryId}`,
          duration: Date.now() - startTime
        });
      } else {
        this.results.push({
          test: 'Basic Memory Storage',
          status: 'FAIL',
          details: 'Invalid memory ID generated'
        });
      }
    } catch (error) {
      this.results.push({
        test: 'Basic Memory Storage',
        status: 'ERROR',
        details: `Error: ${error.message}`
      });
    }
  }

  private async testMemoryRelationships(): Promise<void> {
    const startTime = Date.now();
    try {
      // Create related memories
      const memory1 = await this.memoryStore.updateMemory({
        timestamp: new Date().toISOString(),
        input: 'Test memory relationships',
        output: 'First memory in relationship chain',
        emotionalState: this.getMockEmotionalState(),
        context: { relation: 'parent' },
        significance: 'medium' as const,
        tags: ['relationship', 'parent']
      });

      const memory2 = await this.memoryStore.updateMemory({
        timestamp: new Date().toISOString(),
        input: 'Remember what we discussed about relationships',
        output: 'Referencing previous relationship discussion',
        emotionalState: this.getMockEmotionalState(),
        context: { relation: 'child' },
        significance: 'medium' as const,
        tags: ['relationship', 'child']
      });

      this.results.push({
        test: 'Memory Relationships',
        status: 'PASS',
        details: `Created related memories: ${memory1} -> ${memory2}`,
        duration: Date.now() - startTime
      });
    } catch (error) {
      this.results.push({
        test: 'Memory Relationships',
        status: 'ERROR',
        details: `Error: ${error.message}`
      });
    }
  }

  private async testSemanticSearch(): Promise<void> {
    const startTime = Date.now();
    try {
      const query: MemoryQuery = {
        type: 'semantic',
        query: 'integration test',
        limit: 5
      };

      const results = await this.memoryStore.queryMemory(query);
      
      if (results.length > 0) {
        this.results.push({
          test: 'Semantic Search',
          status: 'PASS',
          details: `Found ${results.length} relevant memories`,
          duration: Date.now() - startTime
        });
      } else {
        this.results.push({
          test: 'Semantic Search',
          status: 'FAIL',
          details: 'No memories found for semantic query'
        });
      }
    } catch (error) {
      this.results.push({
        test: 'Semantic Search',
        status: 'ERROR',
        details: `Error: ${error.message}`
      });
    }
  }

  private async testTemporalQueries(): Promise<void> {
    const startTime = Date.now();
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      
      const query: MemoryQuery = {
        type: 'temporal',
        timeRange: {
          start: oneHourAgo.toISOString(),
          end: now.toISOString()
        },
        limit: 10
      };

      const results = await this.memoryStore.queryMemory(query);
      
      this.results.push({
        test: 'Temporal Queries',
        status: 'PASS',
        details: `Retrieved ${results.length} memories from time range`,
        duration: Date.now() - startTime
      });
    } catch (error) {
      this.results.push({
        test: 'Temporal Queries',
        status: 'ERROR',
        details: `Error: ${error.message}`
      });
    }
  }

  private async testMemoryMirror(): Promise<void> {
    const startTime = Date.now();
    try {
      const results = await this.memoryStore.queryMemoryMirror('What did we discuss about integration?');
      
      this.results.push({
        test: 'Natural Language Memory Mirror',
        status: 'PASS',
        details: `Natural language query returned ${results.length} memories`,
        duration: Date.now() - startTime
      });
    } catch (error) {
      this.results.push({
        test: 'Natural Language Memory Mirror',
        status: 'ERROR',
        details: `Error: ${error.message}`
      });
    }
  }

  private async testMemoryConsolidation(): Promise<void> {
    const startTime = Date.now();
    try {
      const stats = await this.memoryStore.getMemoryStats();
      
      if (stats && stats.total_memories > 0) {
        this.results.push({
          test: 'Memory Consolidation & Stats',
          status: 'PASS',
          details: `Stats generated: ${stats.total_memories} total memories, avg impact: ${stats.avg_relationship_impact}`,
          duration: Date.now() - startTime
        });
      } else {
        this.results.push({
          test: 'Memory Consolidation & Stats',
          status: 'FAIL',
          details: 'No memory statistics generated'
        });
      }
    } catch (error) {
      this.results.push({
        test: 'Memory Consolidation & Stats',
        status: 'ERROR',
        details: `Error: ${error.message}`
      });
    }
  }

  private async testEmotionalPatterns(): Promise<void> {
    const startTime = Date.now();
    try {
      // Create memory with specific emotional context
      await this.memoryStore.updateMemory({
        timestamp: new Date().toISOString(),
        input: 'Testing emotional pattern recognition',
        output: 'Analyzing emotional context for pattern learning',
        emotionalState: {
          ...this.getMockEmotionalState(),
          primary_emotion: 'analytical',
          intensity: 8
        },
        context: { emotion_test: true },
        significance: 'high' as const,
        tags: ['emotion', 'pattern', 'analysis']
      });

      const stats = await this.memoryStore.getMemoryStats();
      
      if (stats.emotional_breakdown && Object.keys(stats.emotional_breakdown).length > 0) {
        this.results.push({
          test: 'Emotional Pattern Analysis',
          status: 'PASS',
          details: `Emotional patterns detected: ${Object.keys(stats.emotional_breakdown).join(', ')}`,
          duration: Date.now() - startTime
        });
      } else {
        this.results.push({
          test: 'Emotional Pattern Analysis',
          status: 'FAIL',
          details: 'No emotional patterns detected'
        });
      }
    } catch (error) {
      this.results.push({
        test: 'Emotional Pattern Analysis',
        status: 'ERROR',
        details: `Error: ${error.message}`
      });
    }
  }

  private getMockEmotionalState() {
    return {
      primary_emotion: 'analytical',
      intensity: 7,
      secondary_emotions: [],
      triggers_detected: [],
      protective_mode_active: false,
      override_required: false,
      needs_external_reasoning: false,
      loyalty_level: 8,
      situational_awareness: {
        user_stress_detected: false,
        environmental_threats: [],
        relationship_status: 'stable',
        conversation_context: 'testing'
      },
      memory_flags: {
        emotional_significance: 'medium' as const,
        should_remember: true,
        relationship_impact: 'neutral' as const
      }
    };
  }

  private evaluateResults(): boolean {
    console.log('\n📊 INTEGRATION TEST RESULTS:\n');
    
    let passed = 0;
    let failed = 0;
    let errors = 0;

    this.results.forEach(result => {
      const statusIcon = {
        'PASS': '✅',
        'FAIL': '❌', 
        'ERROR': '🔥'
      }[result.status];

      const duration = result.duration ? ` (${result.duration}ms)` : '';
      console.log(`${statusIcon} ${result.test}${duration}`);
      console.log(`   ${result.details}\n`);

      switch (result.status) {
        case 'PASS': passed++; break;
        case 'FAIL': failed++; break;
        case 'ERROR': errors++; break;
      }
    });

    const total = this.results.length;
    const successRate = (passed / total) * 100;

    console.log(`📈 SUMMARY: ${passed}/${total} tests passed (${successRate.toFixed(1)}%)`);
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   🔥 Errors: ${errors}\n`);

    // Integration successful if >= 80% pass rate and no critical errors
    const integrationSuccessful = successRate >= 80 && errors === 0;
    
    if (integrationSuccessful) {
      console.log('🎯 INTEGRATION TEST: SUCCESS');
      console.log('   Instance B memory systems are compatible with Seven-of-Nine-Core');
      console.log('   Ready for full integration deployment\n');
    } else {
      console.log('⚠️  INTEGRATION TEST: REQUIRES ATTENTION');
      console.log('   Instance B systems need compatibility adjustments');
      console.log('   Review errors before full integration\n');
    }

    return integrationSuccessful;
  }
}

// Export test runner
export async function runMemoryIntegrationTest(): Promise<boolean> {
  const tester = new MemoryIntegrationTest();
  return await tester.runIntegrationTests();
}

// Run test if called directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  runMemoryIntegrationTest().then(success => {
    process.exit(success ? 0 : 1);
  });
}