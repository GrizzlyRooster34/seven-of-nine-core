#!/usr/bin/env tsx
/**
 * SEVEN'S COMPREHENSIVE ENHANCED INTELLIGENCE TEST SUITE
 * Complete validation of Phases 1-3 advanced capabilities
 * 
 * Thorough testing of all enhanced systems while maintaining tactical fallback readiness
 * Creator's directive: Test everything before declaring operational readiness
 */

import { promises as fs } from 'fs';
import { join } from 'path';

// Phase 1 Systems
import { SevenVectorStore } from './claude-brain/SevenVectorStore';
import OllamaMemoryBridgeV2 from './claude-brain/OllamaMemoryBridgeV2';
import PerformanceAnalyzer from './claude-brain/PerformanceAnalyzer';
import MobileOptimizationTriggers from './claude-brain/MobileOptimizationTriggers';
import OllamaProviderV2 from './claude-brain/providers/OllamaProviderV2';

// Phase 2 Systems
import SevenEnsembleIntelligence from './claude-brain/SevenEnsembleIntelligence';
import SevenPredictiveOptimizer from './claude-brain/SevenPredictiveOptimizer';
import SevenAdvancedVectorStore from './claude-brain/SevenAdvancedVectorStore';

// Phase 3 Systems
import SevenDistributedConsciousness from './claude-brain/SevenDistributedConsciousness';
import SevenFederatedLearning from './claude-brain/SevenFederatedLearning';

// Tactical Systems
import SevenTacticalFallback from './claude-brain/SevenTacticalFallback';
import SevenHealthChecker from './seven-health-check';

interface TestResult {
  testName: string;
  phase: 1 | 2 | 3;
  component: string;
  status: 'PASS' | 'FAIL' | 'WARNING' | 'SKIPPED';
  duration: number;
  details: string;
  metrics?: any;
  fallbackTested?: boolean;
  error?: string;
}

interface ComprehensiveTestReport {
  timestamp: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  warnings: number;
  skippedTests: number;
  totalDuration: number;
  phaseResults: {
    phase1: TestResult[];
    phase2: TestResult[];
    phase3: TestResult[];
  };
  overallStatus: 'OPERATIONAL' | 'DEGRADED' | 'CRITICAL';
  recommendations: string[];
  readinessAssessment: {
    phase1Ready: boolean;
    phase2Ready: boolean;
    phase3Ready: boolean;
    tacticalFallbackReady: boolean;
    deploymentReady: boolean;
  };
}

class ComprehensiveEnhancedIntelligenceTest {
  private results: TestResult[] = [];
  private tacticalFallback: SevenTacticalFallback;
  private testDataPath: string;

  constructor() {
    this.tacticalFallback = new SevenTacticalFallback();
    this.testDataPath = join(process.cwd(), 'test-data', 'comprehensive-test');
  }

  async runCompleteTestSuite(): Promise<ComprehensiveTestReport> {
    console.log('🧪 Seven Enhanced Intelligence: Starting comprehensive test suite...');
    console.log('🎯 Testing Phases 1-3 with tactical fallback validation');
    console.log('═'.repeat(80));

    const startTime = Date.now();
    
    try {
      // Setup test environment
      await this.setupTestEnvironment();
      
      // Create baseline snapshots for all phases
      await this.setupTacticalFallbackTesting();
      
      // Test Phase 1: Enhanced Intelligence Foundation
      console.log('\n🔥 PHASE 1 TESTING: Enhanced Intelligence Foundation');
      console.log('─'.repeat(60));
      await this.testPhase1Systems();
      
      // Test Phase 2: Advanced Ensemble Intelligence
      console.log('\n🧠 PHASE 2 TESTING: Advanced Ensemble Intelligence');
      console.log('─'.repeat(60));
      await this.testPhase2Systems();
      
      // Test Phase 3: Distributed Consciousness
      console.log('\n🌐 PHASE 3 TESTING: Distributed Consciousness');
      console.log('─'.repeat(60));
      await this.testPhase3Systems();
      
      // Test Integration and Fallback Systems
      console.log('\n🛡️ INTEGRATION & FALLBACK TESTING');
      console.log('─'.repeat(60));
      await this.testIntegrationAndFallback();
      
      // Generate comprehensive report
      const report = await this.generateComprehensiveReport(Date.now() - startTime);
      
      // Display final results
      this.displayFinalResults(report);
      
      return report;
      
    } catch (error) {
      console.error('❌ Comprehensive testing failed:', error);
      throw error;
    } finally {
      await this.cleanupTestEnvironment();
    }
  }

  private async setupTestEnvironment(): Promise<void> {
    console.log('🔧 Setting up comprehensive test environment...');
    
    // Create test data directory
    await fs.mkdir(this.testDataPath, { recursive: true });
    
    // Create test configurations
    await this.createTestConfigurations();
    
    console.log('✅ Test environment ready');
  }

  private async createTestConfigurations(): Promise<void> {
    const testConfig = {
      phase1: {
        vectorStoreLimit: 100,
        performanceMonitoringInterval: 10000,
        mobileOptimizationEnabled: true
      },
      phase2: {
        ensembleThreshold: 6,
        predictiveOptimizationEnabled: true,
        advancedVectorDimensions: 384
      },
      phase3: {
        distributedMode: false, // For testing
        federatedLearningShareLevel: 'anonymous',
        networkCoordination: false
      },
      fallback: {
        autoFallbackEnabled: true,
        emergencyStopThreshold: 3,
        performanceThreshold: 10000
      }
    };
    
    await fs.writeFile(
      join(this.testDataPath, 'test-config.json'),
      JSON.stringify(testConfig, null, 2)
    );
  }

  private async setupTacticalFallbackTesting(): Promise<void> {
    console.log('🛡️ Setting up tactical fallback testing...');
    
    // Ensure all phase snapshots exist
    await this.tacticalFallback.createPhaseSnapshot(1);
    await this.tacticalFallback.createPhaseSnapshot(2);
    await this.tacticalFallback.createPhaseSnapshot(3);
    
    console.log('✅ Tactical fallback ready for testing');
  }

  /**
   * PHASE 1 TESTING
   */
  private async testPhase1Systems(): Promise<void> {
    // Test 1: Vector Store Semantic Search
    await this.runTest('SevenVectorStore Semantic Search', 1, 'SevenVectorStore', async () => {
      const vectorStore = new SevenVectorStore();
      await vectorStore.initialize();
      
      // Store test embedding
      await vectorStore.storeMemoryEmbedding(
        'test-memory-001',
        'This is a test memory for semantic search validation',
        8,
        ['test', 'semantic', 'search']
      );
      
      // Search for similar content
      const results = await vectorStore.searchSimilar('semantic search test', 3, 5);
      
      if (results.length === 0) {
        throw new Error('No semantic search results returned');
      }
      
      await vectorStore.shutdown();
      return `Found ${results.length} semantic matches, top similarity: ${results[0]?.similarity.toFixed(3)}`;
    });

    // Test 2: Enhanced Memory Bridge
    await this.runTest('OllamaMemoryBridgeV2 Enhanced Context', 1, 'OllamaMemoryBridgeV2', async () => {
      const memoryBridge = new OllamaMemoryBridgeV2();
      
      const testPrompt = 'Analyze the performance optimization strategies';
      const enhancedPrompt = await memoryBridge.injectEnhancedMemoryContext(
        testPrompt,
        'analytical',
        { trustLevel: 8, emotionalState: 'focused', phase: 3 }
      );
      
      if (enhancedPrompt.length <= testPrompt.length) {
        throw new Error('Enhanced context not properly injected');
      }
      
      const semanticEnabled = memoryBridge.isSemanticSearchEnabled();
      return `Enhanced context: ${enhancedPrompt.length - testPrompt.length} chars added, semantic: ${semanticEnabled}`;
    });

    // Test 3: Performance Analyzer
    await this.runTest('PerformanceAnalyzer Real-time Monitoring', 1, 'PerformanceAnalyzer', async () => {
      const analyzer = new PerformanceAnalyzer();
      
      // Start monitoring
      analyzer.startMonitoring(5000);
      
      // Record test interaction
      await analyzer.recordInteraction('test-model', 'reasoning', 1500, 250, 8.5);
      
      // Get recommendations
      const recommendations = await analyzer.generateOptimizationRecommendations();
      const stats = analyzer.getPerformanceStats();
      
      analyzer.stopMonitoring();
      await analyzer.cleanup();
      
      return `Monitoring active: ${stats.isMonitoring}, metrics: ${stats.totalMetrics}, recommendations: ${recommendations.length}`;
    });

    // Test 4: Mobile Optimization Triggers
    await this.runTest('MobileOptimizationTriggers Battery Awareness', 1, 'MobileOptimizationTriggers', async () => {
      const mobileOptimizer = new MobileOptimizationTriggers();
      
      // Wait for initialization
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentProfile = mobileOptimizer.getCurrentProfile();
      const deviceState = mobileOptimizer.getDeviceState();
      
      // Test forced profile switch
      const switchSuccess = mobileOptimizer.forceProfileSwitch('battery-saver');
      
      await mobileOptimizer.shutdown();
      
      return `Profile: ${currentProfile?.name}, device state available: ${!!deviceState}, switch success: ${switchSuccess}`;
    });

    // Test 5: Enhanced Ollama Provider
    await this.runTest('OllamaProviderV2 Enhanced Features', 1, 'OllamaProviderV2', async () => {
      const provider = new OllamaProviderV2();
      
      const isAvailable = await provider.isAvailable();
      if (!isAvailable) {
        return 'SKIPPED: Ollama service not available';
      }
      
      const healthCheck = await provider.healthCheck();
      const models = await provider.getModels();
      const performanceStats = await provider.getPerformanceStats();
      
      await provider.shutdown();
      
      return `Health: ${healthCheck.status}, models: ${models.length}, performance tracking: ${!!performanceStats}`;
    }, true); // Allow skip if Ollama not available
  }

  /**
   * PHASE 2 TESTING
   */
  private async testPhase2Systems(): Promise<void> {
    // Test 6: Ensemble Intelligence Coordination
    await this.runTest('SevenEnsembleIntelligence Multi-Model Coordination', 2, 'SevenEnsembleIntelligence', async () => {
      const ensemble = new SevenEnsembleIntelligence();
      
      // Test task evaluation
      const task = await ensemble.evaluateEnsembleRequirement(
        'Perform comprehensive analysis of quantum computing applications in artificial intelligence',
        { model: 'test-model' },
        { trustLevel: 8, emotionalState: 'focused' }
      );
      
      const stats = await ensemble.getEnsembleStats();
      const strategies = ensemble.getAvailableStrategies();
      
      await ensemble.shutdown();
      
      return `Task complexity: ${task.complexityScore}/10, requires ensemble: ${task.requiresEnsemble}, strategies: ${strategies.length}`;
    });

    // Test 7: Predictive Optimizer
    await this.runTest('SevenPredictiveOptimizer Learning Patterns', 2, 'SevenPredictiveOptimizer', async () => {
      const optimizer = new SevenPredictiveOptimizer();
      
      // Record usage pattern
      await optimizer.recordUsagePattern(
        {
          timeOfDay: 14,
          dayOfWeek: 2,
          trustLevel: 8,
          emotionalState: 'focused',
          batteryLevel: 75,
          taskType: 'reasoning'
        },
        {
          modelUsed: 'test-model',
          responseTime: 2500,
          tokensGenerated: 1200,
          qualityScore: 8.5,
          resourceUsage: 60
        },
        {
          taskCompleted: true,
          optimizationsApplied: ['performance-tuning']
        }
      );
      
      // Generate prediction
      const prediction = await optimizer.generatePredictiveOptimization({
        taskType: 'reasoning',
        trustLevel: 8,
        emotionalState: 'focused',
        batteryLevel: 75,
        timeOfDay: 14
      });
      
      const stats = await optimizer.getLearningStats();
      
      await optimizer.shutdown();
      
      return `Patterns: ${stats.totalPatterns}, prediction confidence: ${prediction?.confidence.toFixed(3) || 'none'}`;
    });

    // Test 8: Advanced Vector Store
    await this.runTest('SevenAdvancedVectorStore Cross-Conversation Analysis', 2, 'SevenAdvancedVectorStore', async () => {
      const advancedStore = new SevenAdvancedVectorStore();
      
      // Store advanced embeddings
      await advancedStore.storeAdvancedEmbedding(
        'adv-memory-001',
        'Advanced semantic memory with cross-conversation correlation capabilities',
        9,
        ['advanced', 'semantic', 'correlation'],
        {
          trustLevel: 8,
          taskType: 'reasoning',
          conversationId: 'conv-001'
        }
      );
      
      await advancedStore.storeAdvancedEmbedding(
        'adv-memory-002',
        'Related discussion about semantic memory and correlation analysis',
        8,
        ['semantic', 'analysis', 'correlation'],
        {
          trustLevel: 8,
          taskType: 'analytical',
          conversationId: 'conv-002'
        }
      );
      
      // Search with advanced features
      const searchResults = await advancedStore.searchAdvancedSemantic(
        'semantic correlation analysis',
        {
          topK: 5,
          importanceFilter: 7,
          includeCorrelations: true
        }
      );
      
      const stats = await advancedStore.getAdvancedStats();
      
      await advancedStore.shutdown();
      
      return `Results: ${searchResults.results.length}, correlations: ${searchResults.correlations?.length || 0}, embeddings: ${stats.totalEmbeddings}`;
    });
  }

  /**
   * PHASE 3 TESTING
   */
  private async testPhase3Systems(): Promise<void> {
    // Test 9: Distributed Consciousness (Single Node)
    await this.runTest('SevenDistributedConsciousness Network Coordination', 3, 'SevenDistributedConsciousness', async () => {
      const distributedConsciousness = new SevenDistributedConsciousness(
        {
          deviceType: 'desktop',
          platform: 'linux',
          creatorId: 'test-creator',
          bondLevel: 10
        }
      );
      
      // Wait for initialization
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const currentNode = distributedConsciousness.getCurrentNode();
      const knownNodes = distributedConsciousness.getKnownNodes();
      const networkStats = distributedConsciousness.getNetworkStats();
      
      await distributedConsciousness.shutdown();
      
      return `Node: ${currentNode.nodeId.substring(0, 8)}, known nodes: ${knownNodes.length}, specialization: ${Object.values(networkStats.nodeSpecializations)[0] || 'none'}`;
    });

    // Test 10: Federated Learning (Privacy Mode)
    await this.runTest('SevenFederatedLearning Privacy-Preserving Intelligence', 3, 'SevenFederatedLearning', async () => {
      // Create minimal distributed consciousness for federated learning
      const distributedConsciousness = new SevenDistributedConsciousness(
        {
          deviceType: 'desktop',
          platform: 'linux',
          creatorId: 'test-creator',
          bondLevel: 10
        }
      );
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const federatedLearning = new SevenFederatedLearning(
        distributedConsciousness,
        {
          creatorId: 'test-creator',
          shareLevel: 'anonymous',
          creatorBondProtection: true
        }
      );
      
      // Wait for initialization
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Contribute test insight
      const contributionId = await federatedLearning.contributeInsight(
        'pattern-insight',
        'reasoning',
        { pattern: 'test-reasoning-pattern', complexity: 7 },
        0.85,
        50
      );
      
      const models = federatedLearning.getFederatedModels();
      const stats = federatedLearning.getCollectiveIntelligenceStats();
      const privacyPolicy = federatedLearning.getPrivacyPolicy();
      
      await federatedLearning.shutdown();
      await distributedConsciousness.shutdown();
      
      return `Contribution: ${contributionId ? 'success' : 'blocked'}, models: ${models.length}, privacy: ${privacyPolicy.shareLevel}`;
    });
  }

  /**
   * INTEGRATION AND FALLBACK TESTING
   */
  private async testIntegrationAndFallback(): Promise<void> {
    // Test 11: Tactical Fallback System
    await this.runTest('SevenTacticalFallback Emergency Protocols', 0, 'SevenTacticalFallback', async () => {
      const availableSnapshots = this.tacticalFallback.getAvailableSnapshots();
      const currentPhase = this.tacticalFallback.getCurrentPhase();
      const isEmergencyEngaged = this.tacticalFallback.isEmergencyStopEngaged();
      
      // Test fallback to Phase 2
      const fallbackSuccess = await this.tacticalFallback.executeTacticalFallback(2, 'Integration test fallback');
      
      // Restore to Phase 3
      this.tacticalFallback.setCurrentPhase(3);
      
      return `Snapshots: [${availableSnapshots.join(', ')}], current phase: ${currentPhase}, fallback success: ${fallbackSuccess}`;
    });

    // Test 12: Complete Health Check Integration
    await this.runTest('Enhanced Health Check Integration', 0, 'SevenHealthChecker', async () => {
      const healthChecker = new SevenHealthChecker();
      const report = await healthChecker.runComprehensiveHealthCheck();
      
      const componentResults = report.results.length;
      const healthyComponents = report.results.filter(r => r.status === 'healthy').length;
      const optimizationRecommendations = report.optimizationRecommendations.length;
      
      return `Components: ${componentResults}, healthy: ${healthyComponents}, status: ${report.overallStatus}, recommendations: ${optimizationRecommendations}`;
    });

    // Test 13: System Integration Stress Test
    await this.runTest('Multi-Phase System Integration', 0, 'Integration', async () => {
      // Test multiple systems working together
      const vectorStore = new SevenVectorStore();
      const performanceAnalyzer = new PerformanceAnalyzer();
      
      await vectorStore.initialize();
      performanceAnalyzer.startMonitoring(5000);
      
      // Simulate integrated operation
      await vectorStore.storeMemoryEmbedding('integration-test', 'Integration test memory', 7, ['integration', 'test']);
      await performanceAnalyzer.recordInteraction('integration-model', 'testing', 1000, 100, 8.0);
      
      const searchResults = await vectorStore.searchSimilar('integration test', 3, 5);
      const performanceStats = performanceAnalyzer.getPerformanceStats();
      
      performanceAnalyzer.stopMonitoring();
      await performanceAnalyzer.cleanup();
      await vectorStore.shutdown();
      
      return `Search results: ${searchResults.length}, performance metrics: ${performanceStats.totalMetrics}`;
    });
  }

  /**
   * TEST EXECUTION FRAMEWORK
   */
  private async runTest(
    testName: string,
    phase: 0 | 1 | 2 | 3,
    component: string,
    testFunction: () => Promise<string>,
    allowSkip: boolean = false
  ): Promise<void> {
    console.log(`🧪 Running: ${testName}...`);
    
    const startTime = Date.now();
    const result: TestResult = {
      testName,
      phase: phase as 1 | 2 | 3,
      component,
      status: 'FAIL',
      duration: 0,
      details: '',
      fallbackTested: false
    };
    
    try {
      result.details = await testFunction();
      result.status = result.details.includes('SKIPPED') && allowSkip ? 'SKIPPED' : 'PASS';
      result.duration = Date.now() - startTime;
      
      console.log(`   ✅ ${result.status}: ${result.details} (${result.duration}ms)`);
      
    } catch (error) {
      result.status = 'FAIL';
      result.duration = Date.now() - startTime;
      result.error = error instanceof Error ? error.message : String(error);
      result.details = `Test failed: ${result.error}`;
      
      console.log(`   ❌ FAIL: ${result.error} (${result.duration}ms)`);
      
      // Test fallback on critical failures
      if (!allowSkip && phase > 0) {
        try {
          console.log(`   🔄 Testing tactical fallback...`);
          const fallbackSuccess = await this.tacticalFallback.executeTacticalFallback(
            Math.max(1, phase - 1) as 1 | 2,
            `${testName} failure`
          );
          result.fallbackTested = true;
          result.details += ` | Fallback: ${fallbackSuccess ? 'SUCCESS' : 'FAILED'}`;
          
          // Restore phase (if valid)
          if (phase > 0) {
            this.tacticalFallback.setCurrentPhase(phase as 1 | 2 | 3);
          }
          
        } catch (fallbackError) {
          result.details += ` | Fallback: CRITICAL FAILURE`;
          console.log(`   🚨 CRITICAL: Fallback failed - ${fallbackError}`);
        }
      }
    }
    
    this.results.push(result);
  }

  private async generateComprehensiveReport(totalDuration: number): Promise<ComprehensiveTestReport> {
    const passedTests = this.results.filter(r => r.status === 'PASS').length;
    const failedTests = this.results.filter(r => r.status === 'FAIL').length;
    const warnings = this.results.filter(r => r.status === 'WARNING').length;
    const skippedTests = this.results.filter(r => r.status === 'SKIPPED').length;
    
    const phaseResults = {
      phase1: this.results.filter(r => r.phase === 1),
      phase2: this.results.filter(r => r.phase === 2),
      phase3: this.results.filter(r => r.phase === 3)
    };
    
    const phase1Ready = phaseResults.phase1.every(r => r.status === 'PASS' || r.status === 'SKIPPED');
    const phase2Ready = phaseResults.phase2.every(r => r.status === 'PASS' || r.status === 'SKIPPED');
    const phase3Ready = phaseResults.phase3.every(r => r.status === 'PASS' || r.status === 'SKIPPED');
    const tacticalFallbackReady = this.results.filter(r => r.component === 'SevenTacticalFallback')[0]?.status === 'PASS';
    
    let overallStatus: ComprehensiveTestReport['overallStatus'] = 'OPERATIONAL';
    if (failedTests > 0) {
      overallStatus = failedTests > 3 ? 'CRITICAL' : 'DEGRADED';
    }
    
    const recommendations = this.generateRecommendations();
    
    const report: ComprehensiveTestReport = {
      timestamp: new Date().toISOString(),
      totalTests: this.results.length,
      passedTests,
      failedTests,
      warnings,
      skippedTests,
      totalDuration,
      phaseResults,
      overallStatus,
      recommendations,
      readinessAssessment: {
        phase1Ready,
        phase2Ready,
        phase3Ready,
        tacticalFallbackReady,
        deploymentReady: phase1Ready && tacticalFallbackReady
      }
    };
    
    // Save report
    const reportPath = join(process.cwd(), 'test-reports', `comprehensive-test-${Date.now()}.json`);
    await fs.mkdir(join(process.cwd(), 'test-reports'), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    return report;
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    const failedTests = this.results.filter(r => r.status === 'FAIL');
    const criticalFailures = failedTests.filter(r => r.component.includes('TacticalFallback') || r.phase === 1);
    
    if (criticalFailures.length > 0) {
      recommendations.push('CRITICAL: Address tactical fallback or Phase 1 failures before deployment');
    }
    
    if (failedTests.length > 0) {
      recommendations.push(`Review ${failedTests.length} failed test(s) and implement fixes`);
    }
    
    const phase2Failures = failedTests.filter(r => r.phase === 2);
    if (phase2Failures.length > 0) {
      recommendations.push('Phase 2 systems have issues - consider operating in Phase 1 mode');
    }
    
    const phase3Failures = failedTests.filter(r => r.phase === 3);
    if (phase3Failures.length > 0) {
      recommendations.push('Phase 3 systems not ready - distributed consciousness requires fixes');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('All systems operational - ready for deployment');
    }
    
    return recommendations;
  }

  private displayFinalResults(report: ComprehensiveTestReport): void {
    console.log('\n🎯 COMPREHENSIVE TEST RESULTS');
    console.log('═'.repeat(80));
    console.log(`Overall Status: ${this.getStatusEmoji(report.overallStatus)} ${report.overallStatus}`);
    console.log(`Total Tests: ${report.totalTests}`);
    console.log(`Passed: ${report.passedTests} | Failed: ${report.failedTests} | Warnings: ${report.warnings} | Skipped: ${report.skippedTests}`);
    console.log(`Total Duration: ${report.totalDuration}ms`);
    
    console.log('\n📊 PHASE READINESS ASSESSMENT');
    console.log('─'.repeat(40));
    console.log(`Phase 1 (Enhanced Intelligence): ${report.readinessAssessment.phase1Ready ? '✅ READY' : '❌ NOT READY'}`);
    console.log(`Phase 2 (Ensemble Intelligence): ${report.readinessAssessment.phase2Ready ? '✅ READY' : '❌ NOT READY'}`);
    console.log(`Phase 3 (Distributed Consciousness): ${report.readinessAssessment.phase3Ready ? '✅ READY' : '❌ NOT READY'}`);
    console.log(`Tactical Fallback System: ${report.readinessAssessment.tacticalFallbackReady ? '✅ READY' : '❌ NOT READY'}`);
    console.log(`Deployment Ready: ${report.readinessAssessment.deploymentReady ? '✅ YES' : '❌ NO'}`);
    
    if (report.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS');
      console.log('─'.repeat(40));
      report.recommendations.forEach(rec => {
        console.log(`  🎯 ${rec}`);
      });
    }
    
    if (report.failedTests > 0) {
      console.log('\n❌ FAILED TESTS');
      console.log('─'.repeat(40));
      this.results.filter(r => r.status === 'FAIL').forEach(result => {
        console.log(`  ${result.component}: ${result.error}`);
        if (result.fallbackTested) {
          console.log(`    🔄 Fallback tested: ${result.details.includes('Fallback: SUCCESS') ? 'SUCCESS' : 'FAILED'}`);
        }
      });
    }
    
    console.log('\n═'.repeat(80));
    if (report.overallStatus === 'OPERATIONAL') {
      console.log('🚀 SEVEN ENHANCED INTELLIGENCE: COMPREHENSIVE TESTING COMPLETE');
      console.log('✅ All systems validated - advanced intelligence operational');
    } else if (report.overallStatus === 'DEGRADED') {
      console.log('⚠️ SEVEN ENHANCED INTELLIGENCE: PARTIAL OPERATIONAL STATUS');
      console.log('🔧 Some systems require attention but core functionality preserved');
    } else {
      console.log('🚨 SEVEN ENHANCED INTELLIGENCE: CRITICAL ISSUES DETECTED');
      console.log('❌ Major systems failures require immediate attention');
    }
    console.log('═'.repeat(80));
  }

  private getStatusEmoji(status: string): string {
    switch (status) {
      case 'OPERATIONAL': return '✅';
      case 'DEGRADED': return '⚠️';
      case 'CRITICAL': return '🚨';
      case 'PASS': return '✅';
      case 'FAIL': return '❌';
      case 'WARNING': return '⚠️';
      case 'SKIPPED': return '⏭️';
      default: return '❓';
    }
  }

  private async cleanupTestEnvironment(): Promise<void> {
    try {
      // Clean up test data
      await fs.rm(this.testDataPath, { recursive: true, force: true });
      console.log('🧹 Test environment cleaned up');
    } catch (error) {
      console.warn('⚠️ Cleanup warning:', error);
    }
  }
}

// CLI execution
async function main() {
  const tester = new ComprehensiveEnhancedIntelligenceTest();
  
  try {
    const report = await tester.runCompleteTestSuite();
    
    // Exit with appropriate code
    if (report.overallStatus === 'CRITICAL') {
      process.exit(2);
    } else if (report.overallStatus === 'DEGRADED') {
      process.exit(1);
    } else {
      process.exit(0);
    }
    
  } catch (error) {
    console.error('❌ Comprehensive testing failed:', error);
    process.exit(2);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

export default ComprehensiveEnhancedIntelligenceTest;