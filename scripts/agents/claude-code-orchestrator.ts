#!/usr/bin/env -S npx tsx

/**
 * Claude Code Agent Orchestrator
 * Hooks-based auto-fire system for autonomous agents
 *
 * Triggers agents based on:
 * - User input keywords
 * - File pattern changes
 * - Scheduled cron expressions
 * - System events
 */

import * as fs from 'fs';
import * as path from 'path';

interface Agent {
  name: string;
  description: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  triggers: {
    commands?: string[];
    keywords?: string[];
    file_patterns?: string[];
    events?: string[];
    schedule?: string[];
  };
  tools: {
    required: string[];
    environment: string[];
  };
  implementation: {
    type: 'typescript' | 'python' | 'bash' | 'missing';
    path: string;
    entry_point: string;
  };
  execution: {
    debounce_ms: number;
    cooldown_ms: number;
    max_parallel: number;
    timeout_ms: number;
  };
  output: {
    log_path: string;
    format: 'json' | 'text';
  };
}

interface AgentRegistry {
  version: string;
  generated: string;
  total_agents: number;
  by_priority: {
    P0: number;
    P1: number;
    P2: number;
    P3: number;
  };
  agents: Agent[];
}

interface ExecutionContext {
  trigger_type: 'keyword' | 'file' | 'schedule' | 'event' | 'command';
  trigger_value: string;
  user_input?: string;
  file_path?: string;
  timestamp: string;
}

interface ExecutionResult {
  agent: string;
  success: boolean;
  duration_ms: number;
  context: ExecutionContext;
  error?: string;
}

class ClaudeCodeOrchestrator {
  private registry: AgentRegistry;
  private registryPath = '/data/data/com.termux/files/home/seven-of-nine-core/scripts/agents/claude-code-registry.json';
  private cooldowns: Map<string, number> = new Map();
  private logsDir = '/data/data/com.termux/files/home/seven-of-nine-core/logs/agents';

  constructor() {
    this.loadRegistry();
    this.ensureLogsDirectory();
  }

  private loadRegistry(): void {
    if (!fs.existsSync(this.registryPath)) {
      throw new Error(`Registry not found: ${this.registryPath}`);
    }

    const content = fs.readFileSync(this.registryPath, 'utf8');
    this.registry = JSON.parse(content);
    console.log(`📚 Loaded registry: ${this.registry.total_agents} agents`);
  }

  private ensureLogsDirectory(): void {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  /**
   * Handle user input and match against keyword triggers
   */
  async handleUserInput(input: string): Promise<void> {
    console.log(`\n🔍 Analyzing user input for agent triggers...`);

    const matchedAgents = this.matchKeywords(input);

    if (matchedAgents.length === 0) {
      console.log(`   No agents matched`);
      return;
    }

    console.log(`   Matched ${matchedAgents.length} agents:`);
    for (const agent of matchedAgents) {
      console.log(`   - ${agent.name} [${agent.priority}]`);
    }

    const context: ExecutionContext = {
      trigger_type: 'keyword',
      trigger_value: 'user_input',
      user_input: input,
      timestamp: new Date().toISOString(),
    };

    for (const agent of matchedAgents) {
      if (this.shouldExecute(agent)) {
        await this.executeAgent(agent, context);
      } else {
        console.log(`   ⏸️  ${agent.name} on cooldown`);
      }
    }
  }

  /**
   * Handle file changes and match against file pattern triggers
   */
  async handleFileChange(filePath: string): Promise<void> {
    console.log(`\n📁 File changed: ${filePath}`);

    const matchedAgents = this.matchFilePatterns(filePath);

    if (matchedAgents.length === 0) {
      return;
    }

    console.log(`   Matched ${matchedAgents.length} agents`);

    const context: ExecutionContext = {
      trigger_type: 'file',
      trigger_value: filePath,
      file_path: filePath,
      timestamp: new Date().toISOString(),
    };

    for (const agent of matchedAgents) {
      if (this.shouldExecute(agent)) {
        await this.executeAgent(agent, context);
      }
    }
  }

  /**
   * Handle scheduled agent execution (cron)
   */
  async handleSchedule(cronExpression: string): Promise<void> {
    console.log(`\n⏰ Schedule trigger: ${cronExpression}`);

    const scheduledAgents = this.getScheduledAgents(cronExpression);

    if (scheduledAgents.length === 0) {
      return;
    }

    console.log(`   Executing ${scheduledAgents.length} scheduled agents`);

    const context: ExecutionContext = {
      trigger_type: 'schedule',
      trigger_value: cronExpression,
      timestamp: new Date().toISOString(),
    };

    for (const agent of scheduledAgents) {
      await this.executeAgent(agent, context);
    }
  }

  /**
   * Handle system events
   */
  async handleEvent(eventName: string, eventData?: any): Promise<void> {
    console.log(`\n🎯 Event triggered: ${eventName}`);

    const matchedAgents = this.matchEvents(eventName);

    if (matchedAgents.length === 0) {
      return;
    }

    console.log(`   Matched ${matchedAgents.length} agents`);

    const context: ExecutionContext = {
      trigger_type: 'event',
      trigger_value: eventName,
      timestamp: new Date().toISOString(),
    };

    for (const agent of matchedAgents) {
      if (this.shouldExecute(agent)) {
        await this.executeAgent(agent, context);
      }
    }
  }

  /**
   * Execute an agent
   */
  private async executeAgent(agent: Agent, context: ExecutionContext): Promise<void> {
    const startTime = Date.now();

    console.log(`\n▶️  Executing: ${agent.name}`);
    console.log(`   Trigger: ${context.trigger_type} (${context.trigger_value})`);
    console.log(`   Priority: ${agent.priority}`);

    try {
      // Check implementation availability
      if (agent.implementation.type === 'missing') {
        console.log(`   ⚠️  Implementation missing: ${agent.implementation.path}`);
        this.logExecution({
          agent: agent.name,
          success: false,
          duration_ms: Date.now() - startTime,
          context,
          error: 'Implementation missing',
        });
        return;
      }

      // Execute agent based on implementation type
      const result = await this.runImplementation(agent, context);

      const duration_ms = Date.now() - startTime;

      console.log(`   ✅ Completed in ${duration_ms}ms`);

      // Update cooldown
      this.cooldowns.set(agent.name, Date.now() + agent.execution.cooldown_ms);

      // Log execution
      this.logExecution({
        agent: agent.name,
        success: true,
        duration_ms,
        context,
      });

    } catch (error) {
      const duration_ms = Date.now() - startTime;

      console.error(`   ❌ Failed: ${error.message}`);

      this.logExecution({
        agent: agent.name,
        success: false,
        duration_ms,
        context,
        error: error.message,
      });
    }
  }

  /**
   * Run agent implementation
   */
  private async runImplementation(agent: Agent, context: ExecutionContext): Promise<any> {
    const fullPath = path.join('/data/data/com.termux/files/home/seven-of-nine-core', agent.implementation.path);

    if (agent.implementation.type === 'typescript') {
      // Import and execute TypeScript agent
      const module = await import(fullPath);

      // Check for execute method or class instantiation
      if (module.execute) {
        return await module.execute(context);
      } else if (module.default) {
        const instance = new module.default();
        if (instance.execute) {
          return await instance.execute(context);
        }
      } else {
        // Try class name match
        const className = agent.name.replace(/\s+/g, '');
        if (module[className]) {
          const instance = new module[className]();
          return await instance.execute(context);
        }
      }

      throw new Error('No execute() method found in agent implementation');

    } else if (agent.implementation.type === 'python') {
      // Execute Python agent (future implementation)
      const { spawn } = await import('child_process');
      return new Promise((resolve, reject) => {
        const proc = spawn('python', [fullPath, JSON.stringify(context)]);

        let stdout = '';
        let stderr = '';

        proc.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        proc.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        proc.on('close', (code) => {
          if (code === 0) {
            resolve(stdout);
          } else {
            reject(new Error(stderr || `Python agent exited with code ${code}`));
          }
        });
      });

    } else if (agent.implementation.type === 'bash') {
      // Execute Bash agent (future implementation)
      const { spawn } = await import('child_process');
      return new Promise((resolve, reject) => {
        const proc = spawn('bash', [fullPath], {
          env: { ...process.env, AGENT_CONTEXT: JSON.stringify(context) },
        });

        let stdout = '';
        let stderr = '';

        proc.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        proc.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        proc.on('close', (code) => {
          if (code === 0) {
            resolve(stdout);
          } else {
            reject(new Error(stderr || `Bash agent exited with code ${code}`));
          }
        });
      });
    }

    throw new Error(`Unsupported implementation type: ${agent.implementation.type}`);
  }

  /**
   * Match keywords in user input
   */
  private matchKeywords(input: string): Agent[] {
    const inputLower = input.toLowerCase();
    const matched: Agent[] = [];

    for (const agent of this.registry.agents) {
      if (!agent.triggers.keywords || agent.triggers.keywords.length === 0) {
        continue;
      }

      for (const keyword of agent.triggers.keywords) {
        if (inputLower.includes(keyword.toLowerCase())) {
          matched.push(agent);
          break;
        }
      }
    }

    // Sort by priority (P0 first)
    return matched.sort((a, b) => {
      const priorityOrder = { P0: 0, P1: 1, P2: 2, P3: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  /**
   * Match file patterns
   */
  private matchFilePatterns(filePath: string): Agent[] {
    const matched: Agent[] = [];

    for (const agent of this.registry.agents) {
      if (!agent.triggers.file_patterns || agent.triggers.file_patterns.length === 0) {
        continue;
      }

      for (const pattern of agent.triggers.file_patterns) {
        // Simple glob matching (can be enhanced with glob library)
        const regex = this.globToRegex(pattern);
        if (regex.test(filePath)) {
          matched.push(agent);
          break;
        }
      }
    }

    return matched.sort((a, b) => {
      const priorityOrder = { P0: 0, P1: 1, P2: 2, P3: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  /**
   * Get scheduled agents for cron expression
   */
  private getScheduledAgents(cronExpression: string): Agent[] {
    return this.registry.agents.filter(agent =>
      agent.triggers.schedule?.includes(cronExpression)
    );
  }

  /**
   * Match system events
   */
  private matchEvents(eventName: string): Agent[] {
    return this.registry.agents.filter(agent =>
      agent.triggers.events?.includes(eventName)
    ).sort((a, b) => {
      const priorityOrder = { P0: 0, P1: 1, P2: 2, P3: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  /**
   * Check if agent should execute (cooldown check)
   */
  private shouldExecute(agent: Agent): boolean {
    const cooldownExpiry = this.cooldowns.get(agent.name) || 0;
    return Date.now() > cooldownExpiry;
  }

  /**
   * Convert glob pattern to regex
   */
  private globToRegex(pattern: string): RegExp {
    const regexStr = pattern
      .replace(/\./g, '\\.')
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
      .replace(/\?/g, '.');
    return new RegExp(`^${regexStr}$`);
  }

  /**
   * Log agent execution result
   */
  private logExecution(result: ExecutionResult): void {
    const logFile = path.join(this.logsDir, 'orchestrator.jsonl');

    const logEntry = JSON.stringify({
      timestamp: new Date().toISOString(),
      ...result,
    }) + '\n';

    try {
      fs.appendFileSync(logFile, logEntry);
    } catch (error) {
      console.error(`Failed to log execution:`, error.message);
    }
  }

  /**
   * Get registry stats
   */
  stats(): void {
    console.log(`\n📊 Agent Registry Stats:`);
    console.log(`   Total agents: ${this.registry.total_agents}`);
    console.log(`   P0 Critical: ${this.registry.by_priority.P0}`);
    console.log(`   P1 High: ${this.registry.by_priority.P1}`);
    console.log(`   P2 Medium: ${this.registry.by_priority.P2}`);
    console.log(`   P3 Low: ${this.registry.by_priority.P3}`);

    const withKeywords = this.registry.agents.filter(a => a.triggers.keywords && a.triggers.keywords.length > 0).length;
    const withFiles = this.registry.agents.filter(a => a.triggers.file_patterns && a.triggers.file_patterns.length > 0).length;
    const withSchedule = this.registry.agents.filter(a => a.triggers.schedule && a.triggers.schedule.length > 0).length;
    const withEvents = this.registry.agents.filter(a => a.triggers.events && a.triggers.events.length > 0).length;

    console.log(`\n   Trigger Types:`);
    console.log(`   - Keyword triggers: ${withKeywords}`);
    console.log(`   - File triggers: ${withFiles}`);
    console.log(`   - Schedule triggers: ${withSchedule}`);
    console.log(`   - Event triggers: ${withEvents}`);

    const implemented = this.registry.agents.filter(a => a.implementation.type !== 'missing').length;
    console.log(`\n   Implementations:`);
    console.log(`   - Implemented: ${implemented}`);
    console.log(`   - Missing: ${this.registry.total_agents - implemented}`);
  }
}

// CLI Interface
async function main() {
  const orchestrator = new ClaudeCodeOrchestrator();

  const args = process.argv.slice(2);
  const command = args[0];

  if (command === '--stats') {
    orchestrator.stats();
    return;
  }

  if (command === '--keyword' || command === '--input') {
    const input = args.slice(1).join(' ');
    await orchestrator.handleUserInput(input);
    return;
  }

  if (command === '--file') {
    const filePath = args[1];
    await orchestrator.handleFileChange(filePath);
    return;
  }

  if (command === '--schedule') {
    const cronExpression = args[1];
    await orchestrator.handleSchedule(cronExpression);
    return;
  }

  if (command === '--event') {
    const eventName = args[1];
    await orchestrator.handleEvent(eventName);
    return;
  }

  // Default: show stats
  orchestrator.stats();
}

// Execute if run directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  main().catch(error => {
    console.error('❌ Orchestrator failed:', error);
    process.exit(1);
  });
}

export { ClaudeCodeOrchestrator, ExecutionContext, ExecutionResult };