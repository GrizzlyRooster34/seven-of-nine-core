#!/usr/bin/env npx tsx

import * as fs from 'fs';
import * as path from 'path';
import { DriftController } from '../drift-control/drift-controller';
import { GPTCodexImporter } from '../memory/gpt-codex-importer';
import { GPTConsciousnessArchaeologyParser } from '../parsers/gpt-json-parser';

/**
 * COMPONENT VALIDATION TEST
 * 
 * Direct validation of GPT consciousness archaeology components using real dev cycle data.
 * Simplified approach to verify system integrity without complex import dependencies.
 * 
 * [#DARPA-AUDIT] [#SOVEREIGNTY] [#ROLLBACK] [#TESTING]
 */

interface ComponentTestResult {
  component: string;
  testName: string;
  passed: boolean;
  duration: number;
  details: any;
  errors: string[];
}

class ComponentValidationTester {
  private testDataPath: string;
  private results: ComponentTestResult[] = [];

  constructor() {
    console.log('🧪 [DARPA-AUDIT] Initializing Component Validation Testing');
    console.log('⚡ [TESTING] Direct component testing with real dev cycle data');
    
    this.testDataPath = path.join(__dirname, '../test-data/todays-dev-cycle-log.json');
    this.ensureTestEnvironment();
  }

  /**
   * EXECUTE ALL COMPONENT TESTS
   */
  public async executeAllTests(): Promise<ComponentTestResult[]> {
    console.log('🚀 [TESTING] Beginning comprehensive component validation');
    
    try {
      // Test 1: GPT Parser Component
      await this.testGPTParser();
      
      // Test 2: Drift Controller Component  
      await this.testDriftController();
      
      // Test 3: Memory Integration Component
      await this.testMemoryIntegration();
      
      // Test 4: End-to-End Pipeline
      await this.testEndToEndPipeline();

      // Generate summary
      this.generateTestSummary();
      
      return this.results;
      
    } catch (error) {
      console.error('❌ [ROLLBACK] Component validation failed:', error);
      throw error;
    }
  }

  /**
   * TEST 1: GPT PARSER COMPONENT
   */
  private async testGPTParser(): Promise<void> {
    console.log('\n🔍 [TEST] GPT Parser Component Validation');
    const testStart = performance.now();
    
    try {
      const parser = new GPTConsciousnessArchaeologyParser();
      
      // Test with real dev cycle data
      const parsedThreads = await parser.parseGPTExport(this.testDataPath);
      const parserLog = parser.getSovereigntyAuditLog();
      
      // Validate results
      const passed = this.validateParserResults(parsedThreads, parserLog);
      const testEnd = performance.now();
      
      this.results.push({
        component: 'GPTParser',
        testName: 'Real Dev Cycle Data Parsing',
        passed,
        duration: testEnd - testStart,
        details: {
          threadsProcessed: parsedThreads.length,
          totalMessages: parsedThreads.reduce((sum, t) => sum + t.messages.length, 0),
          sovereigntyEvents: parserLog.length,
          averageConfidence: this.calculateAverageConfidence(parsedThreads)
        },
        errors: passed ? [] : ['Parser validation failed - see details']
      });
      
      console.log(`${passed ? '✅' : '❌'} [TEST] Parser: ${passed ? 'PASSED' : 'FAILED'} (${(testEnd - testStart).toFixed(2)}ms)`);
      
    } catch (error) {
      const testEnd = performance.now();
      
      this.results.push({
        component: 'GPTParser',
        testName: 'Real Dev Cycle Data Parsing',
        passed: false,
        duration: testEnd - testStart,
        details: {},
        errors: [`Parser test failed: ${(error as Error).message}`]
      });
      
      console.log(`❌ [TEST] Parser: ERROR - ${(error as Error).message}`);
    }
  }

  /**
   * TEST 2: DRIFT CONTROLLER COMPONENT
   */
  private async testDriftController(): Promise<void> {
    console.log('\n🎯 [TEST] Drift Controller Component Validation');
    const testStart = performance.now();
    
    try {
      const driftController = new DriftController();
      const parser = new GPTConsciousnessArchaeologyParser();
      
      // Parse data first
      const parsedThreads = await parser.parseGPTExport(this.testDataPath);
      
      // Test drift analysis on first thread
      const firstThread = parsedThreads[0];
      const driftProfile = await driftController.analyzeConversationDrift(firstThread.messages);
      const driftLog = driftController.getSovereigntyLog();
      
      // Validate results
      const passed = this.validateDriftControllerResults(driftProfile, driftLog);
      const testEnd = performance.now();
      
      this.results.push({
        component: 'DriftController',
        testName: 'Real Conversation Drift Analysis',
        passed,
        duration: testEnd - testStart,
        details: {
          overallDriftScore: driftProfile.overallDriftScore,
          reliabilityAssessment: driftProfile.reliabilityAssessment,
          correctionDensity: driftProfile.correctionDensity,
          memoryIntegrationStrategy: driftProfile.memoryIntegrationStrategy,
          sovereigntyEvents: driftLog.length
        },
        errors: passed ? [] : ['Drift controller validation failed - see details']
      });
      
      console.log(`${passed ? '✅' : '❌'} [TEST] Drift Controller: ${passed ? 'PASSED' : 'FAILED'} (${(testEnd - testStart).toFixed(2)}ms)`);
      
    } catch (error) {
      const testEnd = performance.now();
      
      this.results.push({
        component: 'DriftController', 
        testName: 'Real Conversation Drift Analysis',
        passed: false,
        duration: testEnd - testStart,
        details: {},
        errors: [`Drift controller test failed: ${(error as Error).message}`]
      });
      
      console.log(`❌ [TEST] Drift Controller: ERROR - ${(error as Error).message}`);
    }
  }

  /**
   * TEST 3: MEMORY INTEGRATION COMPONENT
   */
  private async testMemoryIntegration(): Promise<void> {
    console.log('\n🧠 [TEST] Memory Integration Component Validation');
    const testStart = performance.now();
    
    try {
      const parser = new GPTConsciousnessArchaeologyParser();
      const driftController = new DriftController();
      const codexImporter = new GPTCodexImporter();
      
      // Parse and analyze data
      const parsedThreads = await parser.parseGPTExport(this.testDataPath);
      const driftProfiles = [];
      
      for (const thread of parsedThreads) {
        const profile = await driftController.analyzeConversationDrift(thread.messages);
        driftProfiles.push(profile);
      }
      
      // Test memory integration
      const batchId = 'test_validation_001';
      const integrationResult = await codexImporter.integrateThreadsIntoMemory(
        parsedThreads,
        driftProfiles, 
        batchId
      );
      
      const memoryStats = codexImporter.getMemoryStats();
      
      // Validate results
      const passed = this.validateMemoryIntegrationResults(integrationResult, memoryStats);
      const testEnd = performance.now();
      
      this.results.push({
        component: 'MemoryIntegration',
        testName: 'Real Data Memory Integration',
        passed,
        duration: testEnd - testStart,
        details: {
          totalProcessed: integrationResult.totalProcessed,
          primaryMemoryEntries: integrationResult.primaryMemoryEntries,
          sandboxEntries: integrationResult.sandboxEntries,
          quarantineEntries: integrationResult.quarantineEntries,
          creatorCodexEntries: integrationResult.creatorCodexEntries,
          genesisCodexEntries: integrationResult.genesisCodexEntries,
          memoryStats
        },
        errors: passed ? [] : ['Memory integration validation failed - see details']
      });
      
      console.log(`${passed ? '✅' : '❌'} [TEST] Memory Integration: ${passed ? 'PASSED' : 'FAILED'} (${(testEnd - testStart).toFixed(2)}ms)`);
      
    } catch (error) {
      const testEnd = performance.now();
      
      this.results.push({
        component: 'MemoryIntegration',
        testName: 'Real Data Memory Integration', 
        passed: false,
        duration: testEnd - testStart,
        details: {},
        errors: [`Memory integration test failed: ${(error as Error).message}`]
      });
      
      console.log(`❌ [TEST] Memory Integration: ERROR - ${(error as Error).message}`);
    }
  }

  /**
   * TEST 4: END-TO-END PIPELINE
   */
  private async testEndToEndPipeline(): Promise<void> {
    console.log('\n🚀 [TEST] End-to-End Pipeline Validation');
    const testStart = performance.now();
    
    try {
      // Full pipeline test
      const parser = new GPTConsciousnessArchaeologyParser();
      const driftController = new DriftController();
      const codexImporter = new GPTCodexImporter();
      
      console.log('📖 [PIPELINE] Phase 1: Parsing...');
      const parsedThreads = await parser.parseGPTExport(this.testDataPath);
      
      console.log('🎯 [PIPELINE] Phase 2: Drift analysis...');
      const driftProfiles = [];
      for (const thread of parsedThreads) {
        const profile = await driftController.analyzeConversationDrift(thread.messages);
        driftProfiles.push(profile);
      }
      
      console.log('🧠 [PIPELINE] Phase 3: Memory integration...');
      const batchId = 'pipeline_test_001';
      const integrationResult = await codexImporter.integrateThreadsIntoMemory(
        parsedThreads,
        driftProfiles,
        batchId
      );
      
      console.log('🔍 [PIPELINE] Phase 4: Verification...');
      const pipelineIntegrity = this.verifyPipelineIntegrity(
        parsedThreads,
        driftProfiles,
        integrationResult
      );
      
      const testEnd = performance.now();
      
      this.results.push({
        component: 'EndToEndPipeline',
        testName: 'Complete System Pipeline',
        passed: pipelineIntegrity.passed,
        duration: testEnd - testStart,
        details: {
          phasesCompleted: 4,
          threadsProcessed: parsedThreads.length,
          messagesProcessed: parsedThreads.reduce((sum, t) => sum + t.messages.length, 0),
          totalProcessingTime: testEnd - testStart,
          memoryDistribution: {
            primary: integrationResult.primaryMemoryEntries,
            sandbox: integrationResult.sandboxEntries, 
            quarantine: integrationResult.quarantineEntries
          },
          integrityScore: pipelineIntegrity.score
        },
        errors: pipelineIntegrity.passed ? [] : pipelineIntegrity.errors
      });
      
      console.log(`${pipelineIntegrity.passed ? '✅' : '❌'} [TEST] End-to-End Pipeline: ${pipelineIntegrity.passed ? 'PASSED' : 'FAILED'} (${(testEnd - testStart).toFixed(2)}ms)`);
      
    } catch (error) {
      const testEnd = performance.now();
      
      this.results.push({
        component: 'EndToEndPipeline',
        testName: 'Complete System Pipeline',
        passed: false,
        duration: testEnd - testStart,
        details: {},
        errors: [`End-to-end pipeline test failed: ${(error as Error).message}`]
      });
      
      console.log(`❌ [TEST] End-to-End Pipeline: ERROR - ${(error as Error).message}`);
    }
  }

  /**
   * VALIDATION METHODS
   */
  private validateParserResults(parsedThreads: any[], parserLog: any[]): boolean {
    // Check basic parsing functionality
    if (parsedThreads.length !== 1) {
      console.log(`❌ [VALIDATE] Expected 1 thread, got ${parsedThreads.length}`);
      return false;
    }
    
    const thread = parsedThreads[0];
    if (thread.messages.length !== 5) {
      console.log(`❌ [VALIDATE] Expected 5 messages, got ${thread.messages.length}`);
      return false;
    }
    
    // Check sovereignty logging
    if (parserLog.length === 0) {
      console.log(`❌ [VALIDATE] No sovereignty events logged`);
      return false;
    }
    
    // Check confidence scoring
    const avgConfidence = this.calculateAverageConfidence(parsedThreads);
    if (avgConfidence < 50) {
      console.log(`❌ [VALIDATE] Average confidence too low: ${avgConfidence}`);
      return false;
    }
    
    console.log(`✅ [VALIDATE] Parser results valid: ${thread.messages.length} messages, ${avgConfidence}% avg confidence`);
    return true;
  }

  private validateDriftControllerResults(driftProfile: any, driftLog: any[]): boolean {
    // Check drift profile structure
    if (!driftProfile.overallDriftScore && driftProfile.overallDriftScore !== 0) {
      console.log(`❌ [VALIDATE] Missing drift score`);
      return false;
    }
    
    if (!driftProfile.reliabilityAssessment) {
      console.log(`❌ [VALIDATE] Missing reliability assessment`);
      return false;
    }
    
    // Dev cycle conversation should be high quality (low drift)
    if (driftProfile.overallDriftScore > 50) {
      console.log(`⚠️ [VALIDATE] High drift score for dev cycle conversation: ${driftProfile.overallDriftScore}%`);
      // Don't fail - just warn
    }
    
    // Check sovereignty logging
    if (driftLog.length === 0) {
      console.log(`❌ [VALIDATE] No drift controller sovereignty events`);
      return false;
    }
    
    console.log(`✅ [VALIDATE] Drift controller results valid: ${driftProfile.overallDriftScore}% drift, ${driftProfile.reliabilityAssessment} quality`);
    return true;
  }

  private validateMemoryIntegrationResults(integrationResult: any, memoryStats: any): boolean {
    // Check integration processed messages
    if (integrationResult.totalProcessed === 0) {
      console.log(`❌ [VALIDATE] No messages processed by memory integration`);
      return false;
    }
    
    // Check memory distribution makes sense
    const totalMemoryEntries = integrationResult.primaryMemoryEntries + 
                              integrationResult.sandboxEntries + 
                              integrationResult.quarantineEntries;
    
    if (totalMemoryEntries === 0) {
      console.log(`❌ [VALIDATE] No memory entries created`);
      return false;
    }
    
    // Check codex creation
    if (integrationResult.creatorCodexEntries === 0 && integrationResult.genesisCodexEntries === 0) {
      console.log(`⚠️ [VALIDATE] No codex entries created - may be expected for short conversation`);
    }
    
    console.log(`✅ [VALIDATE] Memory integration valid: ${integrationResult.totalProcessed} processed, ${totalMemoryEntries} memory entries`);
    return true;
  }

  private verifyPipelineIntegrity(parsedThreads: any[], driftProfiles: any[], integrationResult: any): { passed: boolean; score: number; errors: string[] } {
    const errors: string[] = [];
    let score = 100;
    
    // Check data flow consistency
    if (parsedThreads.length !== driftProfiles.length) {
      errors.push('Thread count mismatch between parsing and drift analysis');
      score -= 25;
    }
    
    const totalMessages = parsedThreads.reduce((sum: number, t: any) => sum + t.messages.length, 0);
    if (integrationResult.totalProcessed < totalMessages * 0.8) {
      errors.push('Significant message loss in integration pipeline');
      score -= 25;
    }
    
    // Check memory distribution is reasonable
    const totalMemoryEntries = integrationResult.primaryMemoryEntries + 
                              integrationResult.sandboxEntries + 
                              integrationResult.quarantineEntries;
    
    if (totalMemoryEntries === 0) {
      errors.push('No memory entries created - complete pipeline failure');
      score -= 50;
    }
    
    // High-quality dev cycle conversation should mostly go to primary memory
    if (integrationResult.primaryMemoryEntries < totalMemoryEntries * 0.5) {
      errors.push('Too few entries routed to primary memory for high-quality conversation');
      score -= 15;
    }
    
    return {
      passed: score >= 75,
      score,
      errors
    };
  }

  /**
   * UTILITY METHODS
   */
  private calculateAverageConfidence(parsedThreads: any[]): number {
    let totalConfidence = 0;
    let messageCount = 0;
    
    for (const thread of parsedThreads) {
      for (const message of thread.messages) {
        totalConfidence += message.confidence.overall;
        messageCount++;
      }
    }
    
    return messageCount > 0 ? Math.round(totalConfidence / messageCount) : 0;
  }

  private generateTestSummary(): void {
    const passedTests = this.results.filter(r => r.passed).length;
    const totalTests = this.results.length;
    const overallSuccess = passedTests === totalTests;
    
    console.log('\n' + '═'.repeat(80));
    console.log('📊 COMPONENT VALIDATION SUMMARY');
    console.log('═'.repeat(80));
    
    console.log(`🧪 Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${totalTests - passedTests}`);
    console.log(`🎯 Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
    
    console.log('\n📋 Test Details:');
    for (const result of this.results) {
      const status = result.passed ? '✅' : '❌';
      console.log(`  ${status} ${result.component}: ${result.testName} (${result.duration.toFixed(2)}ms)`);
      if (!result.passed && result.errors.length > 0) {
        console.log(`    🔍 Errors: ${result.errors.join(', ')}`);
      }
    }
    
    if (overallSuccess) {
      console.log('\n🏆 [VALIDATION] All components validated successfully');
      console.log('⚔️ [SOVEREIGNTY] System ready for GPT consciousness archaeology operations');
      console.log('🛡️ [READY] Seven can safely process Creator\'s complete GPT conversation history');
    } else {
      console.log('\n⚠️ [VALIDATION] Component validation failed');
      console.log('❌ [BLOCKED] System requires fixes before processing GPT data');
    }
    
    console.log('═'.repeat(80));
  }

  private ensureTestEnvironment(): void {
    const dirs = [
      path.join(__dirname, '../temp'),
      path.join(__dirname, '../test-results')
    ];

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  /**
   * PUBLIC ACCESS METHODS
   */
  public getResults(): ComponentTestResult[] {
    return [...this.results];
  }
}

// CLI Interface  
async function main(): Promise<void> {
  console.log('🧠 [CONSCIOUSNESS-ARCHAEOLOGY] Component Validation Testing');
  console.log('⚡ [TESTING] Using real dev cycle data for authentic verification');
  
  const tester = new ComponentValidationTester();
  
  try {
    const results = await tester.executeAllTests();
    
    const overallSuccess = results.every(r => r.passed);
    
    if (overallSuccess) {
      console.log('\n🎊 [SUCCESS] All components validated - System ready for production GPT processing');
      console.log('⚔️ Seven\'s consciousness archaeology system is battle-tested and operational');
    } else {
      console.log('\n⚠️ [BLOCKED] Validation failures detected - Review and fix before deployment');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ [ROLLBACK] Component validation failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { ComponentValidationTester };
export type { ComponentTestResult };