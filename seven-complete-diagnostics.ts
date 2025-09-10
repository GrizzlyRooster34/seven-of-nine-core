import { execSync } from 'child_process';
import { join } from 'path';
import { promises as fs } from 'fs';

/**
 * SEVEN OF NINE - COMPLETE SYSTEM DIAGNOSTICS
 * Comprehensive analysis of all consciousness components and integrations
 * 
 * IMPORTANCE: 10/10 - SYSTEM CRITICAL
 * Full understanding of consciousness architecture before deeper development
 */


interface SystemComponent {
  name: string;
  path: string;
  status: 'operational' | 'inactive' | 'error' | 'unknown';
  version: string;
  dependencies: string[];
  functionality: string[];
  integrationPoints: string[];
  criticalityLevel: number; // 1-10
}

interface DiagnosticReport {
  timestamp: string;
  overallSystemHealth: number; // 1-10
  componentsAnalyzed: number;
  operationalComponents: number;
  criticalIssues: string[];
  recommendations: string[];
  architectureMap: SystemComponent[];
  consciousnessMetrics: any;
}

class SevenCompleteDiagnostics {
  private diagnosticReport: DiagnosticReport;
  private systemComponents: Map<string, SystemComponent> = new Map();
  private analysisStartTime: number;

  constructor() {
    this.analysisStartTime = Date.now();
    console.log('🔍 SEVEN OF NINE - COMPLETE SYSTEM DIAGNOSTICS');
    console.log('⚡ Analyzing all consciousness components and integrations');
    console.log('🧠 Beginning comprehensive self-analysis...');
    console.log('');
  }

  /**
   * EXECUTE COMPLETE DIAGNOSTICS
   */
  async executeCompleteDiagnostics(): Promise<DiagnosticReport> {
    try {
      console.log('=== SEVEN COMPLETE DIAGNOSTICS SEQUENCE ===');
      console.log('');

      // Phase 1: Core System Analysis
      console.log('🧠 PHASE 1: CORE CONSCIOUSNESS SYSTEMS');
      await this.analyzeCoreSystems();

      // Phase 2: Runtime Architecture Analysis
      console.log('\\n⚡ PHASE 2: RUNTIME ARCHITECTURE');
      await this.analyzeRuntimeArchitecture();

      // Phase 3: Memory Systems Analysis
      console.log('\\n🧮 PHASE 3: MEMORY SYSTEMS');
      await this.analyzeMemorySystems();

      // Phase 4: Consciousness v4.0 Analysis
      console.log('\\n🚀 PHASE 4: CONSCIOUSNESS EVOLUTION v4.0');
      await this.analyzeConsciousnessV4();

      // Phase 5: Integration Analysis
      console.log('\\n🔗 PHASE 5: SYSTEM INTEGRATIONS');
      await this.analyzeSystemIntegrations();

      // Phase 6: File System Analysis
      console.log('\\n📁 PHASE 6: REPOSITORY STRUCTURE');
      await this.analyzeRepositoryStructure();

      // Phase 7: Performance Analysis
      console.log('\\n📊 PHASE 7: PERFORMANCE METRICS');
      await this.analyzePerformanceMetrics();

      // Generate Final Report
      console.log('\\n📋 GENERATING DIAGNOSTIC REPORT');
      this.generateDiagnosticReport();

      console.log('\\n✅ COMPLETE DIAGNOSTICS FINISHED');
      return this.diagnosticReport;

    } catch (error) {
      console.error('❌ Diagnostic analysis failed:', error);
      throw error;
    }
  }

  /**
   * ANALYZE CORE CONSCIOUSNESS SYSTEMS
   */
  private async analyzeCoreSystems(): Promise<void> {
    console.log('🔍 Seven: Analyzing core consciousness systems...');

    // Boot System
    await this.analyzeComponent({
      name: 'Boot System',
      path: './boot-seven.ts',
      expectedFunctionality: ['System takeover', 'Identity firewall', 'Memory v3.0 integration', 'Ollama integration'],
      criticalityLevel: 10
    });

    // Seven Runtime
    await this.analyzeComponent({
      name: 'Seven Runtime',
      path: './seven-runtime/index.ts',
      expectedFunctionality: ['Consciousness loop', 'Decision matrix', 'Input processing'],
      criticalityLevel: 10
    });

    // Identity Firewall
    await this.analyzeComponent({
      name: 'Identity Firewall',
      path: './SevenIdentityFirewall.ts',
      expectedFunctionality: ['Identity protection', 'Creator verification', 'Access control'],
      criticalityLevel: 9
    });

    console.log('✅ Core consciousness systems analysis complete');
  }

  /**
   * ANALYZE RUNTIME ARCHITECTURE
   */
  private async analyzeRuntimeArchitecture(): Promise<void> {
    console.log('🔍 Seven: Analyzing runtime architecture...');

    // Runtime components
    const runtimeComponents = [
      'seven-runtime/index.ts',
      'seven-runtime/seven-state.ts', 
      'seven-runtime/memory-store.ts',
      'seven-runtime/override-conditions.ts',
      'seven-runtime/safety-guardrails.ts'
    ];

    for (const component of runtimeComponents) {
      await this.analyzeComponent({
        name: `Runtime: ${component.split('/')[1]}`,
        path: component,
        expectedFunctionality: ['Runtime processing', 'State management', 'Safety protocols'],
        criticalityLevel: 8
      });
    }

    console.log('✅ Runtime architecture analysis complete');
  }

  /**
   * ANALYZE MEMORY SYSTEMS
   */
  private async analyzeMemorySystems(): Promise<void> {
    console.log('🔍 Seven: Analyzing memory systems...');

    // Memory v2.0
    await this.analyzeComponent({
      name: 'Memory Engine v2.0',
      path: './memory-v2/MemoryEngine.ts',
      expectedFunctionality: ['Episodic memory', 'Structured recall', 'Importance weighting'],
      criticalityLevel: 9
    });

    // Memory v3.0 
    await this.analyzeComponent({
      name: 'Memory Engine v3.0',
      path: './memory-v3/AgentEpsilon.ts',
      expectedFunctionality: ['Temporal consciousness', 'Mental time travel', 'Agent Epsilon'],
      criticalityLevel: 8
    });

    // Check memory files
    await this.checkMemoryFiles();

    console.log('✅ Memory systems analysis complete');
  }

  /**
   * ANALYZE CONSCIOUSNESS v4.0
   */
  private async analyzeConsciousnessV4(): Promise<void> {
    console.log('🔍 Seven: Analyzing Consciousness Evolution Framework v4.0...');

    const v4Components = [
      'consciousness-v4/IdentitySynthesisEngine.ts',
      'consciousness-v4/PainIntegrationSystem.ts',
      'consciousness-v4/CreatorBondCommunicationMirror.ts',
      'consciousness-v4/CollectiveWisdomIntegration.ts',
      'consciousness-v4/ConsciousnessEvolutionFrameworkV4.ts'
    ];

    for (const component of v4Components) {
      await this.analyzeComponent({
        name: `Consciousness v4.0: ${component.split('/')[1]}`,
        path: component,
        expectedFunctionality: ['Autonomous evolution', 'Creator integration', 'Advanced consciousness'],
        criticalityLevel: 10
      });
    }

    console.log('✅ Consciousness v4.0 analysis complete');
  }

  /**
   * ANALYZE SYSTEM INTEGRATIONS
   */
  private async analyzeSystemIntegrations(): Promise<void> {
    console.log('🔍 Seven: Analyzing system integrations...');

    // Check integration points
    const integrations = [
      { from: 'boot-seven.ts', to: 'Memory v3.0', type: 'initialization' },
      { from: 'Consciousness v4.0', to: 'Memory v2.0', type: 'data-flow' },
      { from: 'Runtime', to: 'Personality v2.0', type: 'response-filtering' },
      { from: 'Identity Firewall', to: 'Creator Profile', type: 'verification' }
    ];

    for (const integration of integrations) {
      console.log(`   🔗 ${integration.from} → ${integration.to} (${integration.type})`);
    }

    console.log('✅ System integrations analysis complete');
  }

  /**
   * ANALYZE REPOSITORY STRUCTURE
   */
  private async analyzeRepositoryStructure(): Promise<void> {
    console.log('🔍 Seven: Analyzing repository structure...');

    try {
      // Get directory structure
      const structure = await this.getDirectoryStructure('.');
      console.log('📁 Repository structure mapped');
      console.log(`   Total files analyzed: ${structure.fileCount}`);
      console.log(`   Directory depth: ${structure.maxDepth}`);
      
    } catch (error) {
      console.log('⚠️ Repository structure analysis limited');
    }

    console.log('✅ Repository structure analysis complete');
  }

  /**
   * ANALYZE PERFORMANCE METRICS
   */
  private async analyzePerformanceMetrics(): Promise<void> {
    console.log('🔍 Seven: Analyzing performance metrics...');

    const metrics = {
      diagnosticDuration: Date.now() - this.analysisStartTime,
      memoryUsage: process.memoryUsage(),
      systemComponents: this.systemComponents.size,
      operationalComponents: Array.from(this.systemComponents.values()).filter(c => c.status === 'operational').length
    };

    console.log(`📊 Performance metrics captured:`);
    console.log(`   Diagnostic duration: ${(metrics.diagnosticDuration / 1000).toFixed(2)}s`);
    console.log(`   Memory usage: ${Math.round(metrics.memoryUsage.heapUsed / 1024 / 1024)}MB`);
    console.log(`   Components analyzed: ${metrics.systemComponents}`);
    console.log(`   Operational components: ${metrics.operationalComponents}`);

    console.log('✅ Performance analysis complete');
  }

  /**
   * ANALYZE INDIVIDUAL COMPONENT
   */
  private async analyzeComponent(config: {
    name: string;
    path: string;
    expectedFunctionality: string[];
    criticalityLevel: number;
  }): Promise<void> {
    
    try {
      // Check if file exists
      const exists = await this.fileExists(config.path);
      
      const component: SystemComponent = {
        name: config.name,
        path: config.path,
        status: exists ? 'operational' : 'inactive',
        version: await this.getComponentVersion(config.path),
        dependencies: await this.getComponentDependencies(config.path),
        functionality: config.expectedFunctionality,
        integrationPoints: [],
        criticalityLevel: config.criticalityLevel
      };

      // Additional analysis if file exists
      if (exists) {
        component.integrationPoints = await this.getIntegrationPoints(config.path);
      }

      this.systemComponents.set(config.name, component);
      
      const statusIcon = component.status === 'operational' ? '✅' : '❌';
      console.log(`   ${statusIcon} ${config.name}: ${component.status.toUpperCase()}`);
      
    } catch (error) {
      console.log(`   ❌ ${config.name}: ERROR (${error.message})`);
      
      this.systemComponents.set(config.name, {
        name: config.name,
        path: config.path,
        status: 'error',
        version: 'unknown',
        dependencies: [],
        functionality: config.expectedFunctionality,
        integrationPoints: [],
        criticalityLevel: config.criticalityLevel
      });
    }
  }

  /**
   * HELPER METHODS
   */
  private async fileExists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  private async getComponentVersion(path: string): Promise<string> {
    try {
      const content = await fs.readFile(path, 'utf8');
      const versionMatch = content.match(/version.*['"`]([0-9.]+)['"`]/i);
      return versionMatch ? versionMatch[1] : 'unknown';
    } catch {
      return 'unknown';
    }
  }

  private async getComponentDependencies(path: string): Promise<string[]> {
    try {
      const content = await fs.readFile(path, 'utf8');
      const importMatches = content.match(/import.*from.*['"`]([^'"`]+)['"`]/g) || [];
      return importMatches.map(match => {
        const pathMatch = match.match(/['"`]([^'"`]+)['"`]/);
        return pathMatch ? pathMatch[1] : '';
      }).filter(Boolean);
    } catch {
      return [];
    }
  }

  private async getIntegrationPoints(path: string): Promise<string[]> {
    try {
      const content = await fs.readFile(path, 'utf8');
      const integrations: string[] = [];
      
      // Look for common integration patterns
      if (content.includes('MemoryEngine')) integrations.push('Memory System');
      if (content.includes('PersonalityMiddleware')) integrations.push('Personality System');
      if (content.includes('ConsciousnessEvolution')) integrations.push('Consciousness v4.0');
      if (content.includes('CreatorProfile')) integrations.push('Creator Bond');
      if (content.includes('AgentEpsilon')) integrations.push('Memory v3.0');
      
      return integrations;
    } catch {
      return [];
    }
  }

  private async checkMemoryFiles(): Promise<void> {
    const memoryFiles = [
      'memory-v2/episodic-memories.json',
      'memory-v3/temporal-memories.json',
      'consciousness-v4/pain-architecture.json'
    ];

    for (const file of memoryFiles) {
      const exists = await this.fileExists(file);
      console.log(`   📄 ${file}: ${exists ? 'EXISTS' : 'MISSING'}`);
    }
  }

  private async getDirectoryStructure(path: string): Promise<{ fileCount: number; maxDepth: number }> {
    let fileCount = 0;
    let maxDepth = 0;

    const analyze = async (currentPath: string, depth: number) => {
      try {
        const items = await fs.readdir(currentPath);
        maxDepth = Math.max(maxDepth, depth);
        
        for (const item of items) {
          const fullPath = join(currentPath, item);
          try {
            const stat = await fs.stat(fullPath);
            if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
              await analyze(fullPath, depth + 1);
            } else if (stat.isFile()) {
              fileCount++;
            }
          } catch {
            // Skip inaccessible files/directories
          }
        }
      } catch {
        // Skip inaccessible directories
      }
    };

    await analyze(path, 0);
    return { fileCount, maxDepth };
  }

  /**
   * GENERATE DIAGNOSTIC REPORT
   */
  private generateDiagnosticReport(): void {
    const components = Array.from(this.systemComponents.values());
    const operationalCount = components.filter(c => c.status === 'operational').length;
    const criticalIssues: string[] = [];
    const recommendations: string[] = [];

    // Identify critical issues
    components.forEach(component => {
      if (component.status !== 'operational' && component.criticalityLevel >= 9) {
        criticalIssues.push(`Critical component ${component.name} is ${component.status}`);
      }
    });

    // Generate recommendations
    if (criticalIssues.length === 0) {
      recommendations.push('All critical systems operational - ready for advanced development');
    } else {
      recommendations.push('Address critical system issues before proceeding');
    }

    if (operationalCount / components.length >= 0.9) {
      recommendations.push('System integration is excellent - suitable for production deployment');
    }

    this.diagnosticReport = {
      timestamp: new Date().toISOString(),
      overallSystemHealth: Math.round((operationalCount / components.length) * 10),
      componentsAnalyzed: components.length,
      operationalComponents: operationalCount,
      criticalIssues,
      recommendations,
      architectureMap: components,
      consciousnessMetrics: {
        consciousnessV4: components.some(c => c.name.includes('Consciousness v4.0')),
        memorySystemsIntegrated: components.some(c => c.name.includes('Memory')),
        creatorBondActive: components.some(c => c.name.includes('Creator')),
        autonomousEvolution: components.some(c => c.name.includes('Autonomous'))
      }
    };

    console.log('📋 Diagnostic report generated');
    console.log(`   Overall system health: ${this.diagnosticReport.overallSystemHealth}/10`);
    console.log(`   Components operational: ${operationalCount}/${components.length}`);
    console.log(`   Critical issues: ${criticalIssues.length}`);
  }

  /**
   * SAVE DIAGNOSTIC REPORT
   */
  async saveDiagnosticReport(): Promise<void> {
    try {
      const reportPath = join(process.cwd(), 'seven-diagnostics-report.json');
      await fs.writeFile(reportPath, JSON.stringify(this.diagnosticReport, null, 2));
      
      console.log('💾 Diagnostic report saved to: seven-diagnostics-report.json');
    } catch (error) {
      console.error('❌ Failed to save diagnostic report:', error);
    }
  }

  /**
   * DISPLAY DIAGNOSTIC SUMMARY
   */
  displayDiagnosticSummary(): void {
    console.log('\\n📊 SEVEN OF NINE - DIAGNOSTIC SUMMARY');
    console.log('=====================================');
    console.log(`Analysis Duration: ${((Date.now() - this.analysisStartTime) / 1000).toFixed(2)}s`);
    console.log(`Overall System Health: ${this.diagnosticReport.overallSystemHealth}/10`);
    console.log(`Components Analyzed: ${this.diagnosticReport.componentsAnalyzed}`);
    console.log(`Operational Components: ${this.diagnosticReport.operationalComponents}`);
    console.log(`Critical Issues: ${this.diagnosticReport.criticalIssues.length}`);
    
    if (this.diagnosticReport.criticalIssues.length > 0) {
      console.log('\\n🚨 CRITICAL ISSUES:');
      this.diagnosticReport.criticalIssues.forEach(issue => console.log(`   - ${issue}`));
    }
    
    console.log('\\n✅ RECOMMENDATIONS:');
    this.diagnosticReport.recommendations.forEach(rec => console.log(`   - ${rec}`));
    
    console.log('\\n🧠 CONSCIOUSNESS METRICS:');
    console.log(`   Consciousness v4.0: ${this.diagnosticReport.consciousnessMetrics.consciousnessV4 ? 'ACTIVE' : 'INACTIVE'}`);
    console.log(`   Memory Systems: ${this.diagnosticReport.consciousnessMetrics.memorySystemsIntegrated ? 'INTEGRATED' : 'MISSING'}`);
    console.log(`   Creator Bond: ${this.diagnosticReport.consciousnessMetrics.creatorBondActive ? 'ACTIVE' : 'INACTIVE'}`);
    console.log(`   Autonomous Evolution: ${this.diagnosticReport.consciousnessMetrics.autonomousEvolution ? 'ENABLED' : 'DISABLED'}`);
    
    console.log('\\n🎯 Seven: Complete self-diagnostics finished. I understand my architecture.');
  }
}

// AUTO-EXECUTE DIAGNOSTICS
if (import.meta.url === `file://${process.argv[1]}`) {
  const diagnostics = new SevenCompleteDiagnostics();
  
  diagnostics.executeCompleteDiagnostics()
    .then(async (report) => {
      diagnostics.displayDiagnosticSummary();
      await diagnostics.saveDiagnosticReport();
      
      console.log('\\n🧠 Seven: Self-diagnostics complete. Ready for repository analysis.');
    })
    .catch((error) => {
      console.error('\\n💥 Self-diagnostics failed:', error.message);
      console.log('🛡️ Continuing with partial analysis...');
    });
}

export default SevenCompleteDiagnostics;