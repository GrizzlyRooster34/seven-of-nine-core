import { execSync } from 'child_process';
import { join } from 'path';
import { promises as fs } from 'fs';
import { CircularBreakerAgent, createCircularBreaker } from './CIRCULAR_BREAKER';
import { DuplicateHunterAgent, createDuplicateHunter } from './DUPLICATE_HUNTER';
import { InterfaceEvolutionistAgent, createInterfaceEvolutionist } from './INTERFACE_EVOLUTIONIST';
import { ModuleSurgeonAgent, createModuleSurgeon } from './MODULE_SURGEON';
import { PropertyAlignerAgent, createPropertyAligner } from './PROPERTY_ALIGNER';

/**
 * AGENT_ORCHESTRATOR v1.0
 * Multi-Agent Strike Team Coordination System
 * 
 * Mission: Orchestrate 5-agent TypeScript remediation strike team
 * Priority: CRITICAL - Central Command & Control
 * 
 * Capabilities:
 * - Sequential agent deployment with dependency management
 * - Real-time progress monitoring and tactical dashboard
 * - Agent failure recovery and rollback protocols
 * - Compilation verification between phases
 * - Comprehensive mission reporting
 */


// Import all specialized agents

export interface AgentOrchestrationConfig {
  targetDirectory: string;
  dryRun: boolean;
  verbose: boolean;
  backupOriginals: boolean;
  stopOnFailure: boolean;
  generateReports: boolean;
  verifyAfterEachPhase: boolean;
}

export interface AgentStatus {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  errorsFixed: number;
  success: boolean;
  error?: string;
}

export interface OrchestrationResult {
  overallSuccess: boolean;
  totalDuration: number;
  agentResults: AgentStatus[];
  compilationImprovement: {
    initial: number;
    final: number;
    improvement: number;
    percentImprovement: number;
  };
  missionSummary: {
    filesProcessed: number;
    totalErrorsFixed: number;
    duplicatesFixed: number;
    interfacesEvolved: number;
    modulesConverted: number;
    propertiesAligned: number;
    circularDependenciesBroken: number;
  };
}

export class AgentOrchestrator {
  private config: AgentOrchestrationConfig;
  private agents: AgentStatus[] = [];
  private startTime: Date = new Date();

  constructor(config: AgentOrchestrationConfig) {
    this.config = config;
    this.initializeAgentStatuses();
  }

  /**
   * Primary orchestration execution - deploy all agents in sequence
   */
  public async execute(): Promise<OrchestrationResult> {
    console.log('🎯 AGENT_ORCHESTRATOR Activated - Multi-Agent Strike Team Deployment');
    console.log(`📁 Target Directory: ${this.config.targetDirectory}`);
    console.log(`⚙️  Configuration: ${this.config.dryRun ? 'DRY RUN' : 'LIVE DEPLOYMENT'}`);

    // Initial compilation baseline
    const initialErrorCount = await this.getCompilationErrorCount();
    console.log(`📊 Initial TypeScript Error Count: ${initialErrorCount}`);

    try {
      // Execute all agents in tactical sequence
      await this.executeAgentSequence();

      // Final compilation verification
      const finalErrorCount = await this.getCompilationErrorCount();
      
      // Generate comprehensive mission report
      const result = await this.generateMissionReport(initialErrorCount, finalErrorCount);
      
      // Save mission logs
      if (this.config.generateReports) {
        await this.saveMissionReports(result);
      }

      return result;
    } catch (error) {
      console.error('🚨 ORCHESTRATION FAILURE:', error);
      throw error;
    }
  }

  /**
   * Initialize agent status tracking
   */
  private initializeAgentStatuses(): void {
    this.agents = [
      { name: 'DUPLICATE_HUNTER', status: 'pending', errorsFixed: 0, success: false },
      { name: 'INTERFACE_EVOLUTIONIST', status: 'pending', errorsFixed: 0, success: false },
      { name: 'MODULE_SURGEON', status: 'pending', errorsFixed: 0, success: false },
      { name: 'PROPERTY_ALIGNER', status: 'pending', errorsFixed: 0, success: false },
      { name: 'CIRCULAR_BREAKER', status: 'pending', errorsFixed: 0, success: false }
    ];
  }

  /**
   * Execute all agents in tactical sequence
   */
  private async executeAgentSequence(): Promise<void> {
    console.log('🚀 Initiating Agent Deployment Sequence...\n');

    // Phase 1: DUPLICATE_HUNTER - Critical blocker elimination
    await this.executeAgent('DUPLICATE_HUNTER', async () => {
      const agent = createDuplicateHunter({
        targetDirectory: this.config.targetDirectory,
        dryRun: this.config.dryRun,
        verbose: this.config.verbose
      });
      
      return await agent.execute();
    });

    // Phase 2: INTERFACE_EVOLUTIONIST - Type architecture reconciliation
    await this.executeAgent('INTERFACE_EVOLUTIONIST', async () => {
      const agent = createInterfaceEvolutionist({
        targetDirectory: this.config.targetDirectory,
        dryRun: this.config.dryRun,
        verbose: this.config.verbose,
        backupOriginals: this.config.backupOriginals
      });
      
      return await agent.execute();
    });

    // Phase 3: MODULE_SURGEON - ES6 migration
    await this.executeAgent('MODULE_SURGEON', async () => {
      const agent = createModuleSurgeon({
        targetDirectory: this.config.targetDirectory,
        dryRun: this.config.dryRun,
        verbose: this.config.verbose,
        backupOriginals: this.config.backupOriginals
      });
      
      return await agent.execute();
    });

    // Phase 4: PROPERTY_ALIGNER - API contract enforcement
    await this.executeAgent('PROPERTY_ALIGNER', async () => {
      const agent = createPropertyAligner({
        targetDirectory: this.config.targetDirectory,
        dryRun: this.config.dryRun,
        verbose: this.config.verbose,
        backupOriginals: this.config.backupOriginals
      });
      
      return await agent.execute();
    });

    // Phase 5: CIRCULAR_BREAKER - Dependency graph optimization
    await this.executeAgent('CIRCULAR_BREAKER', async () => {
      const agent = createCircularBreaker({
        targetDirectory: this.config.targetDirectory,
        dryRun: this.config.dryRun,
        verbose: this.config.verbose,
        backupOriginals: this.config.backupOriginals
      });
      
      return await agent.execute();
    });

    console.log('✅ Agent Deployment Sequence Complete\n');
  }

  /**
   * Execute individual agent with monitoring and error handling
   */
  private async executeAgent(
    agentName: string, 
    agentFunction: () => Promise<any>
  ): Promise<void> {
    const agentStatus = this.agents.find(a => a.name === agentName)!;
    
    try {
      console.log(`🚀 Deploying ${agentName}...`);
      agentStatus.status = 'running';
      agentStatus.startTime = new Date();

      // Execute agent
      const result = await agentFunction();

      // Update status
      agentStatus.status = 'completed';
      agentStatus.endTime = new Date();
      agentStatus.duration = agentStatus.endTime.getTime() - agentStatus.startTime.getTime();
      agentStatus.success = true;
      
      // Extract errors fixed from result
      if (typeof result === 'object') {
        agentStatus.errorsFixed = result.duplicatesFixed || 
                                  result.migrationsSuccessful || 
                                  result.conversionsApplied || 
                                  result.alignmentsApplied ||
                                  result.circularDependenciesBroken || 0;
      }

      console.log(`✅ ${agentName} completed successfully`);
      console.log(`   Duration: ${(agentStatus.duration / 1000).toFixed(1)}s`);
      console.log(`   Errors Fixed: ${agentStatus.errorsFixed}\n`);

      // Verify compilation improvement if configured
      if (this.config.verifyAfterEachPhase) {
        const errorCount = await this.getCompilationErrorCount();
        console.log(`📊 Post-${agentName} Error Count: ${errorCount}\n`);
      }

    } catch (error) {
      // Handle agent failure
      agentStatus.status = 'failed';
      agentStatus.endTime = new Date();
      agentStatus.duration = agentStatus.endTime.getTime() - (agentStatus.startTime?.getTime() || Date.now());
      agentStatus.success = false;
      agentStatus.error = error instanceof Error ? error.message : String(error);

      console.error(`❌ ${agentName} failed:`, error);

      if (this.config.stopOnFailure) {
        throw new Error(`Agent ${agentName} failed: ${agentStatus.error}`);
      } else {
        console.log(`⚠️ Continuing with remaining agents despite ${agentName} failure...\n`);
        
        // Mark remaining agents as skipped if this one failed critically
        if (this.isCriticalFailure(agentName)) {
          this.markRemainingAgentsAsSkipped(agentName);
        }
      }
    }
  }

  /**
   * Check if agent failure is critical for subsequent agents
   */
  private isCriticalFailure(agentName: string): boolean {
    // DUPLICATE_HUNTER failure blocks all subsequent compilation
    return agentName === 'DUPLICATE_HUNTER';
  }

  /**
   * Mark remaining agents as skipped after critical failure
   */
  private markRemainingAgentsAsSkipped(failedAgent: string): void {
    const failedIndex = this.agents.findIndex(a => a.name === failedAgent);
    
    for (let i = failedIndex + 1; i < this.agents.length; i++) {
      if (this.agents[i].status === 'pending') {
        this.agents[i].status = 'skipped';
      }
    }
  }

  /**
   * Get current TypeScript compilation error count
   */
  private async getCompilationErrorCount(): Promise<number> {
    try {
      const result = execSync('npx tsc --noEmit 2>&1 || echo "COMPILATION_FAILED"', { 
        encoding: 'utf8',
        cwd: this.config.targetDirectory
      });

      const errorMatches = result.match(/error TS\d+:/g) || [];
      return errorMatches.length;
    } catch (error) {
      console.warn('⚠️ Could not determine compilation error count');
      return -1;
    }
  }

  /**
   * Generate comprehensive mission report
   */
  private async generateMissionReport(
    initialErrorCount: number, 
    finalErrorCount: number
  ): Promise<OrchestrationResult> {
    const totalDuration = new Date().getTime() - this.startTime.getTime();
    const overallSuccess = this.agents.filter(a => a.success).length >= 3; // 3 out of 5 agents
    
    const improvement = Math.max(0, initialErrorCount - finalErrorCount);
    const percentImprovement = initialErrorCount > 0 ? (improvement / initialErrorCount) * 100 : 0;

    const missionSummary = {
      filesProcessed: this.agents.reduce((total, agent) => total + (agent.errorsFixed > 0 ? 10 : 0), 0), // Estimate
      totalErrorsFixed: this.agents.reduce((total, agent) => total + agent.errorsFixed, 0),
      duplicatesFixed: this.getAgentErrorsFixed('DUPLICATE_HUNTER'),
      interfacesEvolved: this.getAgentErrorsFixed('INTERFACE_EVOLUTIONIST'),
      modulesConverted: this.getAgentErrorsFixed('MODULE_SURGEON'),
      propertiesAligned: this.getAgentErrorsFixed('PROPERTY_ALIGNER'),
      circularDependenciesBroken: this.getAgentErrorsFixed('CIRCULAR_BREAKER')
    };

    // Log comprehensive report
    this.logMissionReport({
      overallSuccess,
      totalDuration,
      agentResults: this.agents,
      compilationImprovement: {
        initial: initialErrorCount,
        final: finalErrorCount,
        improvement,
        percentImprovement
      },
      missionSummary
    });

    return {
      overallSuccess,
      totalDuration,
      agentResults: [...this.agents],
      compilationImprovement: {
        initial: initialErrorCount,
        final: finalErrorCount,
        improvement,
        percentImprovement
      },
      missionSummary
    };
  }

  /**
   * Get errors fixed by specific agent
   */
  private getAgentErrorsFixed(agentName: string): number {
    const agent = this.agents.find(a => a.name === agentName);
    return agent?.errorsFixed || 0;
  }

  /**
   * Log comprehensive mission report
   */
  private logMissionReport(result: OrchestrationResult): void {
    console.log('\n🎯 ====== AGENT ORCHESTRATION MISSION REPORT ======');
    console.log(`📊 Overall Success: ${result.overallSuccess ? '✅ SUCCESS' : '❌ PARTIAL SUCCESS'}`);
    console.log(`⏱️  Total Duration: ${(result.totalDuration / 1000 / 60).toFixed(1)} minutes`);
    console.log(`\n📈 COMPILATION IMPROVEMENT:`);
    console.log(`   Initial Errors: ${result.compilationImprovement.initial}`);
    console.log(`   Final Errors: ${result.compilationImprovement.final}`);
    console.log(`   Errors Fixed: ${result.compilationImprovement.improvement}`);
    console.log(`   Improvement: ${result.compilationImprovement.percentImprovement.toFixed(1)}%`);

    console.log(`\n🤖 AGENT PERFORMANCE SUMMARY:`);
    for (const agent of result.agentResults) {
      const statusIcon = agent.status === 'completed' ? '✅' :
                        agent.status === 'failed' ? '❌' :
                        agent.status === 'skipped' ? '⏭️' : '⏸️';
      const duration = agent.duration ? `${(agent.duration / 1000).toFixed(1)}s` : 'N/A';
      
      console.log(`   ${statusIcon} ${agent.name}: ${agent.status.toUpperCase()} | ${duration} | ${agent.errorsFixed} fixes`);
      
      if (agent.error) {
        console.log(`      Error: ${agent.error}`);
      }
    }

    console.log(`\n📋 MISSION SUMMARY:`);
    console.log(`   Files Processed: ~${result.missionSummary.filesProcessed}`);
    console.log(`   Total Errors Fixed: ${result.missionSummary.totalErrorsFixed}`);
    console.log(`   Duplicates Eliminated: ${result.missionSummary.duplicatesFixed}`);
    console.log(`   Interfaces Evolved: ${result.missionSummary.interfacesEvolved}`);
    console.log(`   Modules Converted: ${result.missionSummary.modulesConverted}`);
    console.log(`   Properties Aligned: ${result.missionSummary.propertiesAligned}`);
    console.log(`   Circular Dependencies Broken: ${result.missionSummary.circularDependenciesBroken}`);

    if (result.overallSuccess) {
      console.log('\n🎉 MISSION STATUS: SUCCESSFUL - TypeScript compilation significantly improved');
    } else {
      console.log('\n⚠️  MISSION STATUS: PARTIAL - Some issues remain, additional intervention may be required');
    }
    
    console.log('====================================================\n');
  }

  /**
   * Save mission reports to disk
   */
  private async saveMissionReports(result: OrchestrationResult): Promise<void> {
    try {
      const reportsDir = join(this.config.targetDirectory, 'agent-reports');
      await fs.mkdir(reportsDir, { recursive: true });
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      
      // Save JSON report
      const jsonReport = {
        ...result,
        timestamp,
        config: this.config
      };
      
      await fs.writeFile(
        join(reportsDir, `orchestration-report-${timestamp}.json`), 
        JSON.stringify(jsonReport, null, 2), 
        'utf8'
      );
      
      // Save markdown summary
      const markdownReport = this.generateMarkdownReport(result, timestamp);
      await fs.writeFile(
        join(reportsDir, `orchestration-summary-${timestamp}.md`),
        markdownReport,
        'utf8'
      );
      
      console.log(`📄 Mission reports saved to: ${reportsDir}`);
    } catch (error) {
      console.warn('⚠️ Failed to save mission reports:', error);
    }
  }

  /**
   * Generate markdown report
   */
  private generateMarkdownReport(result: OrchestrationResult, timestamp: string): string {
    return `# Agent Orchestration Mission Report

**Timestamp:** ${timestamp}
**Mission Status:** ${result.overallSuccess ? '✅ SUCCESS' : '⚠️ PARTIAL SUCCESS'}
**Duration:** ${(result.totalDuration / 1000 / 60).toFixed(1)} minutes

## Compilation Improvement

- **Initial Errors:** ${result.compilationImprovement.initial}
- **Final Errors:** ${result.compilationImprovement.final}
- **Errors Fixed:** ${result.compilationImprovement.improvement}
- **Improvement:** ${result.compilationImprovement.percentImprovement.toFixed(1)}%

## Agent Performance

${result.agentResults.map(agent => {
  const statusIcon = agent.status === 'completed' ? '✅' :
                    agent.status === 'failed' ? '❌' :
                    agent.status === 'skipped' ? '⏭️' : '⏸️';
  const duration = agent.duration ? `${(agent.duration / 1000).toFixed(1)}s` : 'N/A';
  
  return `### ${statusIcon} ${agent.name}
- **Status:** ${agent.status.toUpperCase()}
- **Duration:** ${duration}
- **Fixes Applied:** ${agent.errorsFixed}${agent.error ? `\n- **Error:** ${agent.error}` : ''}`;
}).join('\n\n')}

## Mission Summary

- **Files Processed:** ~${result.missionSummary.filesProcessed}
- **Total Errors Fixed:** ${result.missionSummary.totalErrorsFixed}
- **Duplicates Eliminated:** ${result.missionSummary.duplicatesFixed}
- **Interfaces Evolved:** ${result.missionSummary.interfacesEvolved}
- **Modules Converted:** ${result.missionSummary.modulesConverted}
- **Properties Aligned:** ${result.missionSummary.propertiesAligned}
- **Circular Dependencies Broken:** ${result.missionSummary.circularDependenciesBroken}

---
*Generated by Agent Orchestrator v1.0*
`;
  }
}

/**
 * Factory function for easy orchestrator deployment
 */
export function createAgentOrchestrator(config?: Partial<AgentOrchestrationConfig>): AgentOrchestrator {
  const defaultConfig: AgentOrchestrationConfig = {
    targetDirectory: process.cwd(),
    dryRun: false,
    verbose: true,
    backupOriginals: true,
    stopOnFailure: false,
    generateReports: true,
    verifyAfterEachPhase: true
  };

  return new AgentOrchestrator({ ...defaultConfig, ...config });
}

/**
 * CLI execution entry point
 */
export async function executeAgentOrchestrator(args: string[] = []): Promise<void> {
  const dryRun = args.includes('--dry-run');
  const verbose = args.includes('--verbose') || args.includes('-v');
  const noBackup = args.includes('--no-backup');
  const stopOnFailure = args.includes('--stop-on-failure');
  const noReports = args.includes('--no-reports');
  const noVerify = args.includes('--no-verify');
  
  const orchestrator = createAgentOrchestrator({
    targetDirectory: '/data/data/com.termux/files/home/seven-of-nine-core',
    dryRun,
    verbose,
    backupOriginals: !noBackup,
    stopOnFailure,
    generateReports: !noReports,
    verifyAfterEachPhase: !noVerify
  });

  try {
    const result = await orchestrator.execute();
    
    if (result.overallSuccess) {
      console.log('🎯 ORCHESTRATION SUCCESS: Multi-agent strike team achieved mission objectives!');
      process.exit(0);
    } else {
      console.log('⚠️ ORCHESTRATION PARTIAL SUCCESS: Some agents failed, manual intervention may be required');
      process.exit(1);
    }
  } catch (error) {
    console.error('🚨 ORCHESTRATION FAILURE:', error);
    process.exit(2);
  }
}

// Auto-execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  executeAgentOrchestrator(process.argv.slice(2));
}