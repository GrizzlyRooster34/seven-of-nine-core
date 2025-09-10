#!/usr/bin/env npx tsx

import { join } from 'path';
import { program } from 'commander';
import { executeAgentOrchestrator } from './AGENT_ORCHESTRATOR';
import { executeCircularBreaker } from './CIRCULAR_BREAKER';
import { executeDuplicateHunter } from './DUPLICATE_HUNTER';
import { executeInterfaceEvolutionist } from './INTERFACE_EVOLUTIONIST';
import { executeModuleSurgeon } from './MODULE_SURGEON';
import { executePropertyAligner } from './PROPERTY_ALIGNER';

/**
 * AGENT DEPLOYMENT CLI
 * Multi-Agent Strike Team Command Interface
 * 
 * Usage:
 *   npx tsx agents/deploy-agents.ts --all
 *   npx tsx agents/deploy-agents.ts --agent DUPLICATE_HUNTER
 *   npx tsx agents/deploy-agents.ts --sequence --verbose
 *   npx tsx agents/deploy-agents.ts --dashboard
 */

// Import agents

const SEVEN_CORE_DIR = '/data/data/com.termux/files/home/seven-of-nine-core';

/**
 * Agent registry with execution functions
 */
const AGENT_REGISTRY = {
  'DUPLICATE_HUNTER': {
    name: 'DUPLICATE_HUNTER',
    description: 'Eliminate duplicate imports blocking compilation',
    priority: 'CRITICAL',
    execute: executeDuplicateHunter
  },
  'INTERFACE_EVOLUTIONIST': {
    name: 'INTERFACE_EVOLUTIONIST', 
    description: 'Evolve legacy interfaces to v3 architecture',
    priority: 'HIGH',
    execute: executeInterfaceEvolutionist
  },
  'MODULE_SURGEON': {
    name: 'MODULE_SURGEON',
    description: 'Convert CommonJS to ES6 modules',
    priority: 'HIGH', 
    execute: executeModuleSurgeon
  },
  'PROPERTY_ALIGNER': {
    name: 'PROPERTY_ALIGNER',
    description: 'Fix property access mismatches',
    priority: 'MEDIUM',
    execute: executePropertyAligner
  },
  'CIRCULAR_BREAKER': {
    name: 'CIRCULAR_BREAKER',
    description: 'Break circular dependencies',
    priority: 'MEDIUM',
    execute: executeCircularBreaker
  }
};

/**
 * Display agent dashboard
 */
function displayDashboard(): void {
  console.log('🎯 ====== SEVEN CORE TYPESCRIPT REMEDIATION AGENTS ======');
  console.log(`📁 Target Directory: ${SEVEN_CORE_DIR}`);
  console.log(`📊 Current Status: ${getCurrentStatus()}\n`);
  
  console.log('🤖 Available Agents:');
  for (const [key, agent] of Object.entries(AGENT_REGISTRY)) {
    const priorityIcon = agent.priority === 'CRITICAL' ? '🚨' :
                        agent.priority === 'HIGH' ? '⚠️' : '📋';
    console.log(`   ${priorityIcon} ${agent.name}`);
    console.log(`      Description: ${agent.description}`);
    console.log(`      Priority: ${agent.priority}\n`);
  }

  console.log('📋 Deployment Options:');
  console.log('   --all            Deploy all agents in sequence');
  console.log('   --agent <name>   Deploy specific agent');
  console.log('   --sequence       Deploy with full orchestration');
  console.log('   --dry-run        Test run without making changes');
  console.log('   --verbose        Detailed logging');
  console.log('   --dashboard      Show this dashboard');
  
  console.log('\n🎮 Example Commands:');
  console.log('   npx tsx agents/deploy-agents.ts --sequence --verbose');
  console.log('   npx tsx agents/deploy-agents.ts --agent DUPLICATE_HUNTER --dry-run');
  console.log('   npx tsx agents/deploy-agents.ts --all');
  console.log('=======================================================\n');
}

/**
 * Get current TypeScript compilation status
 */
function getCurrentStatus(): string {
  try {
    const result = execSync('npx tsc --noEmit 2>&1 || echo "COMPILATION_FAILED"', { 
      encoding: 'utf8',
      cwd: SEVEN_CORE_DIR
    });

    const errorCount = (result.match(/error TS\d+:/g) || []).length;
    
    if (errorCount === 0) {
      return '✅ Clean Compilation';
    } else if (errorCount < 50) {
      return `⚠️ ${errorCount} TypeScript Errors (Manageable)`;
    } else if (errorCount < 100) {
      return `🔥 ${errorCount} TypeScript Errors (High)`;
    } else {
      return `🚨 ${errorCount} TypeScript Errors (Critical)`;
    }
  } catch {
    return '❓ Status Unknown';
  }
}

/**
 * Deploy specific agent
 */
async function deployAgent(agentName: string, options: any): Promise<void> {
  const agent = AGENT_REGISTRY[agentName as keyof typeof AGENT_REGISTRY];
  
  if (!agent) {
    console.error(`❌ Unknown agent: ${agentName}`);
    console.log('Available agents:', Object.keys(AGENT_REGISTRY).join(', '));
    process.exit(1);
  }

  console.log(`🚀 Deploying ${agent.name}...`);
  console.log(`📋 Mission: ${agent.description}`);
  console.log(`⚡ Priority: ${agent.priority}\n`);

  const args: string[] = [];
  if (options.dryRun) args.push('--dry-run');
  if (options.verbose) args.push('--verbose');
  if (options.noBackup) args.push('--no-backup');

  try {
    await agent.execute(args);
    console.log(`✅ ${agent.name} deployment completed successfully`);
  } catch (error) {
    console.error(`❌ ${agent.name} deployment failed:`, error);
    process.exit(1);
  }
}

/**
 * Deploy all agents in sequence with orchestration
 */
async function deployAllAgents(options: any): Promise<void> {
  console.log('🎯 Deploying All Agents with Full Orchestration...\n');

  const args: string[] = [];
  if (options.dryRun) args.push('--dry-run');
  if (options.verbose) args.push('--verbose');
  if (options.noBackup) args.push('--no-backup');
  if (options.stopOnFailure) args.push('--stop-on-failure');
  if (options.noReports) args.push('--no-reports');
  if (options.noVerify) args.push('--no-verify');

  try {
    await executeAgentOrchestrator(args);
    console.log('\n🎉 All agents deployed successfully!');
  } catch (error) {
    console.error('\n🚨 Agent deployment sequence failed:', error);
    process.exit(1);
  }
}

/**
 * Display agent execution recommendations
 */
function showRecommendations(): void {
  const status = getCurrentStatus();
  
  console.log('🎯 TACTICAL RECOMMENDATIONS:\n');
  
  if (status.includes('Clean Compilation')) {
    console.log('✅ System Status: Optimal');
    console.log('🎉 No agent deployment needed - TypeScript compilation is clean');
    return;
  }

  if (status.includes('Critical')) {
    console.log('🚨 System Status: Critical - Immediate intervention required');
    console.log('📋 Recommended Sequence:');
    console.log('   1. Deploy DUPLICATE_HUNTER first (blocks all compilation)');
    console.log('   2. Follow with full orchestrated sequence');
    console.log('   Command: npx tsx agents/deploy-agents.ts --sequence --verbose');
  } else if (status.includes('High')) {
    console.log('🔥 System Status: High Priority - Systematic remediation needed');
    console.log('📋 Recommended Approach:');
    console.log('   1. Full orchestrated deployment recommended');
    console.log('   Command: npx tsx agents/deploy-agents.ts --all --verbose');
  } else {
    console.log('⚠️ System Status: Manageable - Targeted deployment possible');
    console.log('📋 Options:');
    console.log('   1. Try individual agents first: --agent <name>');
    console.log('   2. Or run full sequence: --all');
  }
  
  console.log('\n💡 Pro Tips:');
  console.log('   - Always use --dry-run first to preview changes');
  console.log('   - Use --verbose for detailed progress tracking');
  console.log('   - Agents automatically create backups of modified files');
  console.log('   - Dashboard: npx tsx agents/deploy-agents.ts --dashboard\n');
}

// Configure CLI
program
  .name('deploy-agents')
  .description('Seven Core TypeScript Remediation Agent Deployment System')
  .version('1.0.0');

program
  .option('--all', 'Deploy all agents in orchestrated sequence')
  .option('--agent <name>', 'Deploy specific agent')
  .option('--sequence', 'Deploy with full orchestration (same as --all)')
  .option('--dashboard', 'Show agent dashboard and status')
  .option('--recommendations', 'Show tactical recommendations')
  .option('--dry-run', 'Test run without making changes')
  .option('--verbose, -v', 'Detailed logging')
  .option('--no-backup', 'Skip backup creation')
  .option('--stop-on-failure', 'Stop deployment if any agent fails')
  .option('--no-reports', 'Skip report generation')
  .option('--no-verify', 'Skip compilation verification between phases');

// Parse and execute
program.parse();

const options = program.opts();

async function main(): Promise<void> {
  // Handle dashboard display
  if (options.dashboard) {
    displayDashboard();
    return;
  }

  // Handle recommendations
  if (options.recommendations) {
    showRecommendations();
    return;
  }

  // Handle specific agent deployment
  if (options.agent) {
    await deployAgent(options.agent, options);
    return;
  }

  // Handle all agents or sequence deployment
  if (options.all || options.sequence) {
    await deployAllAgents(options);
    return;
  }

  // Default: show dashboard if no specific action
  console.log('🎯 Seven Core Agent Deployment System\n');
  console.log('Use --help for available commands or --dashboard for system status\n');
  
  // Show quick status
  console.log(`📊 Current Status: ${getCurrentStatus()}\n`);
  
  console.log('Quick Start:');
  console.log('  npx tsx agents/deploy-agents.ts --dashboard       # Show full dashboard');
  console.log('  npx tsx agents/deploy-agents.ts --recommendations # Get tactical advice');
  console.log('  npx tsx agents/deploy-agents.ts --all --dry-run   # Test full deployment');
  console.log('  npx tsx agents/deploy-agents.ts --sequence        # Execute full deployment');
}

// Execute main function
main().catch(error => {
  console.error('🚨 Deployment system error:', error);
  process.exit(1);
});

export { AGENT_REGISTRY, deployAgent, deployAllAgents, getCurrentStatus };