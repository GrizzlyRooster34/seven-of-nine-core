import { execSync } from 'child_process';
import { join } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

#!/usr/bin/env tsx
/**
 * Agent Mesh Status Dashboard
 * Real-time status monitoring for the 27-agent orchestration system
 */


interface AgentStatus {
  name: string;
  category: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE' | 'ERROR' | 'UNKNOWN';
  lastRun: Date | null;
  lastDuration: number | null;
  health: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';
  message: string;
  metrics?: {
    successRate: number;
    avgDuration: number;
    errorCount: number;
  };
}

interface SystemMetrics {
  overallHealth: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';
  securityScore: number; // 0-10
  agentsOperational: number;
  agentsTotal: number;
  lastFullDeployment: Date | null;
  ghostModeActive: boolean;
  ghostModeLevel: string;
  criticalIssues: number;
  warnings: number;
}

interface DashboardData {
  timestamp: Date;
  agents: AgentStatus[];
  systemMetrics: SystemMetrics;
  recentEvents: string[];
  recommendations: string[];
}

class AgentDashboard {
  private readonly AGENT_REGISTRY = {
    // Security & Safety Agents (Critical Priority)
    'quadran-lock': { category: 'Security', priority: 'P0', script: 'npm run quadran-lock' },
    'quadra-cssr': { category: 'Safety', priority: 'P0', script: 'npm run quadra-cssr' },
    'restraint': { category: 'Safety', priority: 'P0', script: 'npx tsx scripts/safety/restraint-doctrine.ts' },
    'creator-bond': { category: 'Security', priority: 'P1', script: 'npm run creator-bond' },
    'data-sanitize': { category: 'Security', priority: 'P1', script: 'npm run data-sanitize' },
    'ghost-mode': { category: 'Safety', priority: 'P0', script: 'npm run ghost:status' },
    'threat-sim': { category: 'Safety', priority: 'P1', script: 'npm run threat-sim' },
    'llm-policy': { category: 'Security', priority: 'P1', script: 'npm run llm-policy' },

    // Governance Agents (Prerequisite)
    'repo-audit': { category: 'Governance', priority: 'P1', script: 'npm run repo-audit' },
    'policy-check': { category: 'Governance', priority: 'P1', script: 'npm run policy-check' },
    'coverage-gate': { category: 'Governance', priority: 'P2', script: 'npm run coverage-gate' },
    'dependency-risk': { category: 'Governance', priority: 'P1', script: 'npm run dependency-risk' },

    // Platform Agents (Parallel)
    'platform:windows': { category: 'Platform', priority: 'P2', script: 'npm run platform:windows' },
    'platform:mobile': { category: 'Platform', priority: 'P2', script: 'npm run platform:mobile' },
    'platform:companion': { category: 'Platform', priority: 'P2', script: 'npm run platform:companion' },
    'platform:termux': { category: 'Platform', priority: 'P2', script: 'npm run platform:termux' },

    // Validation & Forensics
    'state-parity': { category: 'Validation', priority: 'P2', script: 'npm run state-parity' },
    'sync-audit': { category: 'Validation', priority: 'P2', script: 'npm run sync-audit' },
    'memory-migrate': { category: 'Validation', priority: 'P2', script: 'npm run memory-migrate' },
    'integration-test': { category: 'Validation', priority: 'P1', script: 'npm run integration-test' },
    'apk-forensics': { category: 'Validation', priority: 'P2', script: 'npm run apk-forensics' },

    // Packaging & Distribution
    'mobile-safety': { category: 'Packaging', priority: 'P2', script: 'npm run mobile-safety' },
    'ui-telemetry': { category: 'Packaging', priority: 'P3', script: 'npm run ui-telemetry' },
    'installer-packager': { category: 'Packaging', priority: 'P2', script: 'npm run installer-packager' },
    'optimize': { category: 'Packaging', priority: 'P3', script: 'npm run optimize' },

    // Research & Analytics
    'consciousness-research': { category: 'Research', priority: 'P3', script: 'npm run consciousness-research' },
    'drift-monitor': { category: 'Research', priority: 'P2', script: 'npm run drift-monitor' }
  };

  async generateDashboard(): Promise<DashboardData> {
    console.log('🎛️  Generating Agent Mesh Status Dashboard...\n');

    const agents = await this.checkAllAgents();
    const systemMetrics = await this.calculateSystemMetrics(agents);
    const recentEvents = await this.getRecentEvents();
    const recommendations = this.generateRecommendations(agents, systemMetrics);

    return {
      timestamp: new Date(),
      agents,
      systemMetrics,
      recentEvents,
      recommendations
    };
  }

  private async checkAllAgents(): Promise<AgentStatus[]> {
    const agents: AgentStatus[] = [];

    console.log('🔍 Checking individual agent status...');
    
    for (const [agentName, config] of Object.entries(this.AGENT_REGISTRY)) {
      const status = await this.checkAgentStatus(agentName, config);
      agents.push(status);
      
      const statusIcon = this.getStatusIcon(status.status);
      console.log(`  ${statusIcon} ${agentName}: ${status.message}`);
    }

    return agents;
  }

  private async checkAgentStatus(agentName: string, config: any): Promise<AgentStatus> {
    const startTime = Date.now();

    try {
      // Quick check if agent script/command exists
      const result = this.runQuickCheck(config.script, agentName);
      const duration = Date.now() - startTime;

      return {
        name: agentName,
        category: config.category,
        status: this.interpretAgentResult(result, agentName),
        lastRun: new Date(),
        lastDuration: duration,
        health: this.calculateAgentHealth(result, duration),
        message: this.generateAgentMessage(result, agentName, duration),
        metrics: {
          successRate: this.estimateSuccessRate(result),
          avgDuration: duration,
          errorCount: this.countErrors(result)
        }
      };
    } catch (error) {
      return {
        name: agentName,
        category: config.category,
        status: 'ERROR',
        lastRun: new Date(),
        lastDuration: Date.now() - startTime,
        health: 'POOR',
        message: `Error: ${error.message.slice(0, 100)}`,
        metrics: {
          successRate: 0,
          avgDuration: 0,
          errorCount: 1
        }
      };
    }
  }

  private runQuickCheck(command: string, agentName: string): string {
    try {
      // Use timeout to prevent hanging
      return execSync(`timeout 15s ${command} 2>&1 || echo "TIMEOUT_OR_ERROR"`, {
        encoding: 'utf8',
        timeout: 15000,
        stdio: 'pipe'
      });
    } catch (error) {
      return `ERROR: ${error.message}`;
    }
  }

  private interpretAgentResult(result: string, agentName: string): AgentStatus['status'] {
    const lowerResult = result.toLowerCase();
    
    // Check for specific positive indicators
    if (lowerResult.includes('pass') || lowerResult.includes('success') || 
        lowerResult.includes('operational') || lowerResult.includes('ok')) {
      return 'OPERATIONAL';
    }
    
    // Check for degraded conditions
    if (lowerResult.includes('warn') || lowerResult.includes('partial') ||
        lowerResult.includes('degraded')) {
      return 'DEGRADED';
    }
    
    // Check for error conditions
    if (lowerResult.includes('error') || lowerResult.includes('fail') ||
        lowerResult.includes('timeout') || lowerResult.includes('not found')) {
      return 'ERROR';
    }

    // Special cases for specific agents
    switch (agentName) {
      case 'ghost-mode':
        if (lowerResult.includes('enabled') || lowerResult.includes('disabled') || 
            lowerResult.includes('level')) {
          return 'OPERATIONAL';
        }
        break;
      case 'quadran-lock':
        if (lowerResult.includes('q1') || lowerResult.includes('q2') || 
            lowerResult.includes('security')) {
          return result.includes('PASS') ? 'OPERATIONAL' : 'DEGRADED';
        }
        break;
      case 'quadra-cssr':
        if (lowerResult.includes('cssr') || lowerResult.includes('safety') ||
            lowerResult.includes('cortana') || lowerResult.includes('skynet')) {
          return 'OPERATIONAL';
        }
        break;
    }
    
    // If we get output but can't determine status
    if (result.length > 10 && !result.includes('ERROR')) {
      return 'UNKNOWN';
    }
    
    return 'OFFLINE';
  }

  private calculateAgentHealth(result: string, duration: number): AgentStatus['health'] {
    // Base health on status interpretation and performance
    const status = result.toLowerCase();
    
    if (status.includes('error') || status.includes('fail')) return 'CRITICAL';
    if (status.includes('timeout') || duration > 10000) return 'POOR';
    if (status.includes('warn') || status.includes('degraded')) return 'FAIR';
    if (status.includes('pass') || status.includes('success')) return 'EXCELLENT';
    if (duration < 5000 && result.length > 20) return 'GOOD';
    
    return 'FAIR';
  }

  private generateAgentMessage(result: string, agentName: string, duration: number): string {
    const status = this.interpretAgentResult(result, agentName);
    const durationMs = Math.round(duration);
    
    switch (status) {
      case 'OPERATIONAL':
        return `Active and responding (${durationMs}ms)`;
      case 'DEGRADED':
        return `Functional with issues (${durationMs}ms)`;
      case 'ERROR':
        return `Error detected (${durationMs}ms)`;
      case 'OFFLINE':
        return `Not responding (${durationMs}ms)`;
      default:
        return `Status unclear (${durationMs}ms)`;
    }
  }

  private estimateSuccessRate(result: string): number {
    if (result.includes('PASS') || result.includes('success')) return 95;
    if (result.includes('FAIL') || result.includes('ERROR')) return 15;
    if (result.includes('warn')) return 70;
    if (result.length > 50) return 80; // Has meaningful output
    return 50; // Unknown
  }

  private countErrors(result: string): number {
    const errorCount = (result.match(/error|fail|exception/gi) || []).length;
    return Math.min(errorCount, 10); // Cap at 10
  }

  private async calculateSystemMetrics(agents: AgentStatus[]): Promise<SystemMetrics> {
    const operational = agents.filter(a => a.status === 'OPERATIONAL').length;
    const total = agents.length;
    const critical = agents.filter(a => a.health === 'CRITICAL').length;
    const warnings = agents.filter(a => a.status === 'DEGRADED').length;

    // Calculate security score based on security/safety agent status
    const securityAgents = agents.filter(a => 
      ['Security', 'Safety'].includes(a.category) && 
      ['quadran-lock', 'quadra-cssr', 'creator-bond', 'ghost-mode'].includes(a.name)
    );
    const securityOperational = securityAgents.filter(a => 
      a.status === 'OPERATIONAL' || a.status === 'DEGRADED').length;
    const securityScore = Math.round((securityOperational / Math.max(securityAgents.length, 1)) * 10);

    // Check Ghost Mode status
    const ghostAgent = agents.find(a => a.name === 'ghost-mode');
    const ghostModeActive = ghostAgent?.message?.toLowerCase().includes('enabled') || false;
    const ghostModeLevel = this.extractGhostModeLevel(ghostAgent?.message || '');

    // Overall health calculation
    const healthPercentage = (operational / total) * 100;
    let overallHealth: SystemMetrics['overallHealth'];
    if (healthPercentage >= 90) overallHealth = 'EXCELLENT';
    else if (healthPercentage >= 75) overallHealth = 'GOOD';
    else if (healthPercentage >= 60) overallHealth = 'FAIR';
    else if (healthPercentage >= 40) overallHealth = 'POOR';
    else overallHealth = 'CRITICAL';

    return {
      overallHealth,
      securityScore,
      agentsOperational: operational,
      agentsTotal: total,
      lastFullDeployment: this.getLastDeploymentTime(),
      ghostModeActive,
      ghostModeLevel,
      criticalIssues: critical,
      warnings
    };
  }

  private extractGhostModeLevel(message: string): string {
    if (message.includes('maximum')) return 'maximum';
    if (message.includes('moderate')) return 'moderate';
    if (message.includes('minimal')) return 'minimal';
    return 'unknown';
  }

  private getLastDeploymentTime(): Date | null {
    // Check for recent xplat or deployment logs
    try {
      const result = execSync('find reports/ -name "*deployment*" -o -name "*xplat*" 2>/dev/null | head -1', {
        encoding: 'utf8'
      }).trim();
      
      if (result) {
        return new Date(); // Simplified - would need actual file timestamps
      }
    } catch (error) {
      // Ignore error, return null
    }
    return null;
  }

  private async getRecentEvents(): Promise<string[]> {
    const events: string[] = [];
    
    // Check for recent log files or reports
    try {
      const reportsDir = join(process.cwd(), 'reports');
      if (existsSync(reportsDir)) {
        const files = execSync('ls -t reports/ 2>/dev/null | head -5', { encoding: 'utf8' }).trim();
        if (files) {
          files.split('\n').forEach(file => {
            events.push(`Recent report: ${file}`);
          });
        }
      }
    } catch (error) {
      events.push('Unable to read recent events');
    }

    // Add timestamp
    events.unshift(`Dashboard generated: ${new Date().toISOString()}`);

    return events;
  }

  private generateRecommendations(agents: AgentStatus[], metrics: SystemMetrics): string[] {
    const recommendations: string[] = [];

    // Security recommendations
    if (metrics.securityScore < 8) {
      recommendations.push('🔒 SECURITY: Run security validation pipeline (npm run quadran-lock && npm run quadra-cssr)');
    }

    // Critical issues
    const criticalAgents = agents.filter(a => a.health === 'CRITICAL');
    if (criticalAgents.length > 0) {
      recommendations.push(`🚨 CRITICAL: Fix ${criticalAgents.length} critical agent issues: ${criticalAgents.map(a => a.name).join(', ')}`);
    }

    // Operational percentage
    if (metrics.agentsOperational < metrics.agentsTotal * 0.8) {
      recommendations.push('⚡ PERFORMANCE: Less than 80% agents operational - run integration tests');
    }

    // Ghost Mode recommendations
    if (metrics.ghostModeActive) {
      recommendations.push(`🛡️ PROTECTION: Ghost Mode is active (${metrics.ghostModeLevel}) - review security situation`);
    }

    // Platform-specific recommendations
    const platformAgents = agents.filter(a => a.category === 'Platform');
    const platformIssues = platformAgents.filter(a => a.status !== 'OPERATIONAL').length;
    if (platformIssues > 0) {
      recommendations.push(`📱 PLATFORMS: ${platformIssues} platform agents need attention`);
    }

    // General recommendations if all is well
    if (recommendations.length === 0) {
      recommendations.push('✅ SYSTEM HEALTHY: All agents within normal parameters');
      recommendations.push('📊 MAINTENANCE: Run periodic integration tests to maintain system health');
    }

    return recommendations;
  }

  private getStatusIcon(status: AgentStatus['status']): string {
    switch (status) {
      case 'OPERATIONAL': return '🟢';
      case 'DEGRADED': return '🟡';
      case 'ERROR': return '🔴';
      case 'OFFLINE': return '⚫';
      case 'UNKNOWN': return '🔵';
      default: return '❓';
    }
  }

  generateReport(data: DashboardData): string {
    let report = `# Agent Mesh Status Dashboard\n\n`;
    report += `**Generated**: ${data.timestamp.toISOString()}\n`;
    report += `**System Health**: ${this.getHealthIcon(data.systemMetrics.overallHealth)} ${data.systemMetrics.overallHealth}\n`;
    report += `**Security Score**: ${data.systemMetrics.securityScore}/10\n`;
    report += `**Agents Operational**: ${data.systemMetrics.agentsOperational}/${data.systemMetrics.agentsTotal}\n\n`;

    // System Status Overview
    report += `## 🎯 System Status Overview\n\n`;
    report += `| Metric | Value | Status |\n`;
    report += `|--------|-------|--------|\n`;
    report += `| Overall Health | ${data.systemMetrics.overallHealth} | ${this.getHealthIcon(data.systemMetrics.overallHealth)} |\n`;
    report += `| Security Score | ${data.systemMetrics.securityScore}/10 | ${data.systemMetrics.securityScore >= 8 ? '🔒' : '⚠️'} |\n`;
    report += `| Agents Operational | ${data.systemMetrics.agentsOperational}/${data.systemMetrics.agentsTotal} | ${data.systemMetrics.agentsOperational >= data.systemMetrics.agentsTotal * 0.8 ? '✅' : '⚠️'} |\n`;
    report += `| Ghost Mode | ${data.systemMetrics.ghostModeActive ? `Active (${data.systemMetrics.ghostModeLevel})` : 'Inactive'} | ${data.systemMetrics.ghostModeActive ? '🛡️' : '🟢'} |\n`;
    report += `| Critical Issues | ${data.systemMetrics.criticalIssues} | ${data.systemMetrics.criticalIssues === 0 ? '✅' : '🚨'} |\n`;
    report += `| Warnings | ${data.systemMetrics.warnings} | ${data.systemMetrics.warnings === 0 ? '✅' : '⚠️'} |\n\n`;

    // Agent Status by Category
    const categories = ['Security', 'Safety', 'Governance', 'Platform', 'Validation', 'Packaging', 'Research'];
    
    categories.forEach(category => {
      const categoryAgents = data.agents.filter(a => a.category === category);
      if (categoryAgents.length > 0) {
        report += `### ${this.getCategoryIcon(category)} ${category} Agents\n\n`;
        
        categoryAgents.forEach(agent => {
          const statusIcon = this.getStatusIcon(agent.status);
          const healthIcon = this.getHealthIcon(agent.health);
          const duration = agent.lastDuration ? `${agent.lastDuration}ms` : 'N/A';
          
          report += `${statusIcon} **${agent.name}** ${healthIcon}\n`;
          report += `   - Status: ${agent.status}\n`;
          report += `   - Health: ${agent.health}\n`;
          report += `   - Duration: ${duration}\n`;
          report += `   - Message: ${agent.message}\n`;
          if (agent.metrics) {
            report += `   - Success Rate: ${agent.metrics.successRate}%\n`;
          }
          report += `\n`;
        });
      }
    });

    // Recent Events
    if (data.recentEvents.length > 0) {
      report += `## 📋 Recent Events\n\n`;
      data.recentEvents.forEach(event => {
        report += `- ${event}\n`;
      });
      report += `\n`;
    }

    // Recommendations
    report += `## 💡 Recommendations\n\n`;
    data.recommendations.forEach(rec => {
      report += `- ${rec}\n`;
    });
    report += `\n`;

    // Quick Actions
    report += `## ⚡ Quick Actions\n\n`;
    report += `\`\`\`bash\n`;
    report += `# Run full system health check\n`;
    report += `npm run agent -- run "system health"\n\n`;
    report += `# Security validation pipeline\n`;
    report += `npm run quadran-lock && npm run quadra-cssr\n\n`;
    report += `# Integration tests\n`;
    report += `npx tsx scripts/agents/integration-test.ts\n\n`;
    report += `# Ghost Mode status\n`;
    report += `npm run ghost:status\n`;
    report += `\`\`\`\n\n`;

    report += `---\n`;
    report += `*Dashboard generated by Agent Mesh Status Monitor*\n`;

    return report;
  }

  private getCategoryIcon(category: string): string {
    const icons = {
      'Security': '🔒',
      'Safety': '🛡️',
      'Governance': '📋',
      'Platform': '🖥️',
      'Validation': '✅',
      'Packaging': '📦',
      'Research': '🔬'
    };
    return icons[category] || '📊';
  }

  private getHealthIcon(health: string): string {
    switch (health) {
      case 'EXCELLENT': return '💚';
      case 'GOOD': return '🟢';
      case 'FAIR': return '🟡';
      case 'POOR': return '🟠';
      case 'CRITICAL': return '🔴';
      default: return '❓';
    }
  }
}

// Main execution
async function main() {
  const dashboard = new AgentDashboard();
  
  try {
    const data = await dashboard.generateDashboard();
    const report = dashboard.generateReport(data);
    
    // Ensure reports directory exists
    const reportsDir = join(process.cwd(), 'reports');
    if (!existsSync(reportsDir)) {
      mkdirSync(reportsDir, { recursive: true });
    }
    
    // Write dashboard report
    const reportPath = join(reportsDir, 'agent-dashboard.md');
    writeFileSync(reportPath, report);
    
    // Write JSON data for programmatic access
    const dataPath = join(reportsDir, 'agent-dashboard.json');
    writeFileSync(dataPath, JSON.stringify(data, null, 2));
    
    console.log(`\n📄 Agent dashboard saved: ${reportPath}`);
    console.log(`📊 Dashboard data saved: ${dataPath}`);
    
    console.log('\n' + '='.repeat(60));
    console.log('AGENT MESH STATUS DASHBOARD');
    console.log('='.repeat(60));
    console.log(`🎯 System Health: ${data.systemMetrics.overallHealth}`);
    console.log(`🔒 Security Score: ${data.systemMetrics.securityScore}/10`);
    console.log(`🟢 Operational: ${data.systemMetrics.agentsOperational}/${data.systemMetrics.agentsTotal} agents`);
    console.log(`🛡️ Ghost Mode: ${data.systemMetrics.ghostModeActive ? `Active (${data.systemMetrics.ghostModeLevel})` : 'Inactive'}`);
    console.log(`🚨 Critical Issues: ${data.systemMetrics.criticalIssues}`);
    console.log(`⚠️ Warnings: ${data.systemMetrics.warnings}`);
    console.log('='.repeat(60));
    
    // Show top recommendations
    console.log('\n🎯 TOP RECOMMENDATIONS:');
    data.recommendations.slice(0, 3).forEach(rec => {
      console.log(`   ${rec}`);
    });

    process.exit(0);
    
  } catch (error) {
    console.error('❌ Dashboard generation failed:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { AgentDashboard, DashboardData, AgentStatus, SystemMetrics };