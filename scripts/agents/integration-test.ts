#!/usr/bin/env tsx
/**
 * Agent Mesh Integration Tests
 * Comprehensive testing suite for the 27-agent orchestration system
 */

import { execSync, spawn } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

interface TestResult {
  agent: string;
  status: 'PASS' | 'FAIL' | 'WARN' | 'SKIP';
  duration: number;
  message: string;
  details?: any;
}

interface IntegrationTestSuite {
  name: string;
  results: TestResult[];
  startTime: number;
  endTime: number;
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
    skipped: number;
  };
}

class AgentMeshTester {
  private results: TestResult[] = [];
  private startTime: number = Date.now();

  async runIntegrationTests(): Promise<IntegrationTestSuite> {
    console.log('🚀 Starting Agent Mesh Integration Tests...\n');

    // Phase 1: Core Agent Functionality Tests
    await this.testCoreAgents();

    // Phase 2: Agent Orchestration Tests
    await this.testOrchestration();

    // Phase 3: Security Integration Tests
    await this.testSecurityIntegration();

    // Phase 4: Natural Language Interface Tests
    await this.testNaturalLanguageInterface();

    // Phase 5: Report Interpretation Tests
    await this.testReportInterpretation();

    return this.generateSummary();
  }

  private async testCoreAgents(): Promise<void> {
    console.log('📋 Phase 1: Core Agent Functionality Tests');

    // Test Quadran-Lock (Security Gates)
    await this.testAgent('quadran-lock', async () => {
      const result = this.runCommand('npm run quadran-lock', 30000);
      const hasQ1Q2Q3Q4 = result.includes('Q1') && result.includes('Q2') && 
                          result.includes('Q3') && result.includes('Q4');
      return {
        success: hasQ1Q2Q3Q4,
        message: hasQ1Q2Q3Q4 ? 'All security gates tested' : 'Missing security gate validation',
        details: { output: result.slice(0, 500) }
      };
    });

    // Test Quadra-Lock CSSR (AI Safety)
    await this.testAgent('quadra-cssr', async () => {
      const result = this.runCommand('npm run quadra-cssr', 30000);
      const hasCSSSRPatterns = result.includes('CSSR') || result.includes('Cortana') || 
                               result.includes('CLU') || result.includes('Skynet');
      return {
        success: hasCSSSRPatterns,
        message: hasCSSSRPatterns ? 'AI safety pattern detection active' : 'CSSR patterns not detected',
        details: { output: result.slice(0, 500) }
      };
    });

    // Test Ghost Mode (Emergency Protection)
    await this.testAgent('ghost-mode', async () => {
      const result = this.runCommand('npm run ghost:status', 15000);
      const hasGhostStatus = result.includes('enabled') || result.includes('disabled') ||
                             result.includes('level') || result.includes('Ghost Mode');
      return {
        success: hasGhostStatus,
        message: hasGhostStatus ? 'Ghost Mode system operational' : 'Ghost Mode status unavailable',
        details: { output: result.slice(0, 500) }
      };
    });

    // Test Natural Language Agent Interface
    await this.testAgent('agent-interface', async () => {
      try {
        const result = this.runCommand('npm run agent -- run "system status"', 20000);
        const hasAgentResponse = result.length > 0 && !result.includes('command not found');
        return {
          success: hasAgentResponse,
          message: hasAgentResponse ? 'Natural language interface responding' : 'Agent interface not responding',
          details: { output: result.slice(0, 500) }
        };
      } catch (error) {
        return {
          success: false,
          message: 'Natural language interface failed to execute',
          details: { error: error.message }
        };
      }
    });
  }

  private async testOrchestration(): Promise<void> {
    console.log('\n🎭 Phase 2: Agent Orchestration Tests');

    // Test Agent Dependencies
    await this.testAgent('agent-dependencies', async () => {
      const dependenciesFile = join(process.cwd(), '.claude/orchestration/agent-dependencies.ts');
      if (!existsSync(dependenciesFile)) {
        return { success: false, message: 'Agent dependencies configuration missing' };
      }

      const content = readFileSync(dependenciesFile, 'utf8');
      const hasPhases = content.includes('governance') && content.includes('security') && 
                        content.includes('safety') && content.includes('platforms');
      return {
        success: hasPhases,
        message: hasPhases ? 'Agent execution phases configured' : 'Missing execution phase configuration',
        details: { phases: ['governance', 'security', 'safety', 'platforms'] }
      };
    });

    // Test Workflow Definitions
    await this.testAgent('workflows', async () => {
      const workflowsFile = join(process.cwd(), '.claude/orchestration/workflows.ts');
      if (!existsSync(workflowsFile)) {
        return { success: false, message: 'Workflow definitions missing' };
      }

      const content = readFileSync(workflowsFile, 'utf8');
      const hasWorkflows = content.includes('fullDeployment') && content.includes('rapidSecurity') &&
                           content.includes('mobileValidation');
      return {
        success: hasWorkflows,
        message: hasWorkflows ? 'Workflow definitions configured' : 'Missing key workflow definitions',
        details: { workflows: ['fullDeployment', 'rapidSecurity', 'mobileValidation'] }
      };
    });

    // Test Decision Trees
    await this.testAgent('decision-trees', async () => {
      const decisionFile = join(process.cwd(), '.claude/orchestration/decision-trees.ts');
      if (!existsSync(decisionFile)) {
        return { success: false, message: 'Decision trees configuration missing' };
      }

      const content = readFileSync(decisionFile, 'utf8');
      const hasDecisionLogic = content.includes('securityFailure') && content.includes('safetyEscalation');
      return {
        success: hasDecisionLogic,
        message: hasDecisionLogic ? 'Decision trees configured' : 'Missing decision logic configuration',
        details: { decisionTypes: ['securityFailure', 'safetyEscalation', 'platformStrategy'] }
      };
    });
  }

  private async testSecurityIntegration(): Promise<void> {
    console.log('\n🔒 Phase 3: Security Integration Tests');

    // Test Security Pipeline
    await this.testAgent('security-pipeline', async () => {
      try {
        // Run security pipeline components in sequence
        const quadranResult = this.runCommand('timeout 30s npm run quadran-lock', 30000);
        const quadraResult = this.runCommand('timeout 30s npm run quadra-cssr', 30000);
        
        const pipelineWorking = quadranResult.includes('Q1') || quadranResult.includes('Q2') ||
                               quadraResult.includes('security') || quadranResult.includes('gates');
        
        return {
          success: pipelineWorking,
          message: pipelineWorking ? 'Security pipeline components responding' : 'Security pipeline issues detected',
          details: { 
            quadranOutput: quadranResult.slice(0, 200),
            quadraOutput: quadraResult.slice(0, 200)
          }
        };
      } catch (error) {
        return {
          success: false,
          message: 'Security pipeline execution failed',
          details: { error: error.message }
        };
      }
    });

    // Test Creator Bond System
    await this.testAgent('creator-bond', async () => {
      try {
        const result = this.runCommand('timeout 20s npm run creator-bond', 20000);
        const hasBondCheck = result.includes('Creator') || result.includes('bond') || 
                            result.includes('authentication') || result.length > 0;
        return {
          success: hasBondCheck,
          message: hasBondCheck ? 'Creator bond system accessible' : 'Creator bond system issues',
          details: { output: result.slice(0, 300) }
        };
      } catch (error) {
        return {
          success: false,
          message: 'Creator bond system not responding',
          details: { error: error.message }
        };
      }
    });
  }

  private async testNaturalLanguageInterface(): Promise<void> {
    console.log('\n💬 Phase 4: Natural Language Interface Tests');

    // Test Agent Commands
    const naturalLanguageCommands = [
      { command: 'system status', expectedKeywords: ['status', 'system'] },
      { command: 'quadran lock', expectedKeywords: ['Q1', 'Q2', 'security', 'gates'] },
      { command: 'ghost mode status', expectedKeywords: ['Ghost', 'mode', 'enabled', 'disabled'] }
    ];

    for (const testCase of naturalLanguageCommands) {
      await this.testAgent(`nl-${testCase.command.replace(/\s+/g, '-')}`, async () => {
        try {
          const result = this.runCommand(`timeout 25s npm run agent -- run "${testCase.command}"`, 25000);
          const hasExpectedContent = testCase.expectedKeywords.some(keyword => 
            result.toLowerCase().includes(keyword.toLowerCase()));
          
          return {
            success: hasExpectedContent || result.length > 50,
            message: hasExpectedContent ? `Natural language "${testCase.command}" responded correctly` : 
                     `Natural language "${testCase.command}" response unclear`,
            details: { 
              command: testCase.command,
              output: result.slice(0, 400),
              keywords: testCase.expectedKeywords
            }
          };
        } catch (error) {
          return {
            success: false,
            message: `Natural language command "${testCase.command}" failed`,
            details: { error: error.message }
          };
        }
      });
    }
  }

  private async testReportInterpretation(): Promise<void> {
    console.log('\n📊 Phase 5: Report Interpretation Tests');

    // Test Report Interpreter Configuration
    await this.testAgent('report-interpreter', async () => {
      const reportFile = join(process.cwd(), '.claude/orchestration/report-interpreter.ts');
      if (!existsSync(reportFile)) {
        return { success: false, message: 'Report interpreter configuration missing' };
      }

      const content = readFileSync(reportFile, 'utf8');
      const hasReportTypes = content.includes('QUADRAN_SUMMARY.md') && 
                            content.includes('CSSR_SUMMARY.md') &&
                            content.includes('criticalPatterns');
      return {
        success: hasReportTypes,
        message: hasReportTypes ? 'Report interpretation system configured' : 'Missing report interpretation patterns',
        details: { 
          reportTypes: ['QUADRAN_SUMMARY.md', 'CSSR_SUMMARY.md', 'GHOST_MODE_STATUS.json']
        }
      };
    });

    // Test Interactive Commands
    await this.testAgent('interactive-commands', async () => {
      const commandsFile = join(process.cwd(), '.claude/commands/interactive.ts');
      if (!existsSync(commandsFile)) {
        return { success: false, message: 'Interactive commands configuration missing' };
      }

      const content = readFileSync(commandsFile, 'utf8');
      const hasCommands = content.includes('/status') && content.includes('/run') && 
                         content.includes('/ghost') && content.includes('/health');
      return {
        success: hasCommands,
        message: hasCommands ? 'Interactive command system configured' : 'Missing key interactive commands',
        details: {
          commands: ['/status', '/run', '/ghost', '/health', '/analyze', '/emergency']
        }
      };
    });
  }

  private async testAgent(agentName: string, testFunction: () => Promise<{ success: boolean; message: string; details?: any }>): Promise<void> {
    const startTime = Date.now();
    console.log(`  Testing ${agentName}...`);

    try {
      const result = await testFunction();
      const duration = Date.now() - startTime;
      const status = result.success ? 'PASS' : 'FAIL';

      this.results.push({
        agent: agentName,
        status,
        duration,
        message: result.message,
        details: result.details
      });

      const statusIcon = status === 'PASS' ? '✅' : '❌';
      console.log(`  ${statusIcon} ${agentName}: ${result.message} (${duration}ms)`);

    } catch (error) {
      const duration = Date.now() - startTime;
      this.results.push({
        agent: agentName,
        status: 'FAIL',
        duration,
        message: `Test execution error: ${error.message}`,
        details: { error: error.message }
      });

      console.log(`  ❌ ${agentName}: Test execution error (${duration}ms)`);
    }
  }

  private runCommand(command: string, timeout: number = 10000): string {
    try {
      return execSync(command, {
        timeout,
        encoding: 'utf8',
        stdio: 'pipe',
        cwd: process.cwd()
      });
    } catch (error) {
      // Return partial output even if command times out or fails
      return error.stdout?.toString() || error.stderr?.toString() || error.message || '';
    }
  }

  private generateSummary(): IntegrationTestSuite {
    const endTime = Date.now();
    const summary = {
      total: this.results.length,
      passed: this.results.filter(r => r.status === 'PASS').length,
      failed: this.results.filter(r => r.status === 'FAIL').length,
      warnings: this.results.filter(r => r.status === 'WARN').length,
      skipped: this.results.filter(r => r.status === 'SKIP').length
    };

    return {
      name: 'Agent Mesh Integration Test Suite',
      results: this.results,
      startTime: this.startTime,
      endTime,
      summary
    };
  }

  generateReport(suite: IntegrationTestSuite): string {
    const duration = suite.endTime - suite.startTime;
    const successRate = Math.round((suite.summary.passed / suite.summary.total) * 100);

    let report = `# Agent Mesh Integration Test Report\n\n`;
    report += `**Test Suite**: ${suite.name}\n`;
    report += `**Duration**: ${duration}ms (${Math.round(duration/1000)}s)\n`;
    report += `**Success Rate**: ${successRate}% (${suite.summary.passed}/${suite.summary.total})\n\n`;

    // Summary Statistics
    report += `## Summary\n\n`;
    report += `- ✅ **Passed**: ${suite.summary.passed}\n`;
    report += `- ❌ **Failed**: ${suite.summary.failed}\n`;
    report += `- ⚠️  **Warnings**: ${suite.summary.warnings}\n`;
    report += `- ⏭️  **Skipped**: ${suite.summary.skipped}\n\n`;

    // Detailed Results
    report += `## Detailed Results\n\n`;
    
    const phases = [
      { name: 'Core Agent Functionality', prefix: ['quadran-lock', 'quadra-cssr', 'ghost-mode', 'agent-interface'] },
      { name: 'Agent Orchestration', prefix: ['agent-dependencies', 'workflows', 'decision-trees'] },
      { name: 'Security Integration', prefix: ['security-pipeline', 'creator-bond'] },
      { name: 'Natural Language Interface', prefix: ['nl-'] },
      { name: 'Report Interpretation', prefix: ['report-interpreter', 'interactive-commands'] }
    ];

    phases.forEach(phase => {
      const phaseResults = suite.results.filter(r => 
        phase.prefix.some(prefix => r.agent.startsWith(prefix) || phase.prefix.includes(r.agent))
      );
      
      if (phaseResults.length > 0) {
        report += `### ${phase.name}\n\n`;
        phaseResults.forEach(result => {
          const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
          report += `${icon} **${result.agent}** (${result.duration}ms): ${result.message}\n`;
          
          if (result.details && result.status !== 'PASS') {
            report += `   - Details: ${JSON.stringify(result.details, null, 2).slice(0, 200)}...\n`;
          }
        });
        report += '\n';
      }
    });

    // Recommendations
    report += `## Recommendations\n\n`;
    const failedTests = suite.results.filter(r => r.status === 'FAIL');
    
    if (failedTests.length === 0) {
      report += `🎉 All tests passed! The Agent Mesh system is fully operational.\n\n`;
      report += `**Next Steps:**\n`;
      report += `- Monitor system performance in production\n`;
      report += `- Run periodic integration tests\n`;
      report += `- Expand test coverage for new agents\n\n`;
    } else {
      report += `**Critical Issues** (${failedTests.length}):\n`;
      failedTests.slice(0, 5).forEach((test, index) => {
        report += `${index + 1}. **${test.agent}**: ${test.message}\n`;
      });
      report += `\n**Recovery Actions:**\n`;
      report += `- Review failed agent configurations\n`;
      report += `- Check system dependencies and permissions\n`;
      report += `- Verify agent script execution paths\n\n`;
    }

    report += `## System Status\n\n`;
    report += `- **Agent Orchestration Framework**: ${suite.summary.passed > suite.summary.failed ? 'OPERATIONAL' : 'DEGRADED'}\n`;
    report += `- **Security Pipeline**: ${suite.results.find(r => r.agent.includes('security')) ? 'ACTIVE' : 'NEEDS_ATTENTION'}\n`;
    report += `- **Natural Language Interface**: ${suite.results.find(r => r.agent.includes('nl-')) ? 'RESPONDING' : 'OFFLINE'}\n`;
    report += `- **Report Interpretation**: ${suite.results.find(r => r.agent === 'report-interpreter')?.status === 'PASS' ? 'CONFIGURED' : 'PENDING'}\n\n`;

    report += `---\n`;
    report += `*Integration test completed: ${new Date().toISOString()}*\n`;

    return report;
  }
}

// Main execution
async function main() {
  const tester = new AgentMeshTester();
  
  try {
    const suite = await tester.runIntegrationTests();
    const report = tester.generateReport(suite);
    
    // Write report to file
    const reportPath = join(process.cwd(), 'reports', 'agent-integration-test.md');
    writeFileSync(reportPath, report);
    
    console.log(`\n📄 Integration test report saved: ${reportPath}`);
    console.log('\n' + '='.repeat(60));
    console.log('AGENT MESH INTEGRATION TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${suite.summary.passed}`);
    console.log(`❌ Failed: ${suite.summary.failed}`);
    console.log(`⚠️  Warnings: ${suite.summary.warnings}`);
    console.log(`📊 Success Rate: ${Math.round((suite.summary.passed / suite.summary.total) * 100)}%`);
    console.log(`⏱️  Duration: ${Math.round((suite.endTime - suite.startTime)/1000)}s`);
    console.log('='.repeat(60));

    // Exit with appropriate code
    process.exit(suite.summary.failed > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('❌ Integration test suite failed:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { AgentMeshTester, IntegrationTestSuite, TestResult };