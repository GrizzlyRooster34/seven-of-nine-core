#!/usr/bin/env -S npx tsx

/**
 * Build Claude Code Agent Registry
 * Parses all 65 YAML/MD agent specs and generates unified registry
 */

import * as fs from 'fs';
import * as path from 'path';
import yaml from 'js-yaml';

interface YAMLAgent {
  name?: string;
  description?: string;
  version?: string;
  commands?: string[];
  script?: string;
  triggers?: {
    commands?: string[];
    file_patterns?: string[];
    keywords?: string[];
    events?: string[];
    schedule?: string[];
    on?: string;
    targets?: string[];
  };
  capabilities?: string[];
  context?: Record<string, any>;
  monitoring_systems?: Record<string, string>;
  integration?: Record<string, boolean>;
  tools?: {
    required?: string[];
    environment?: string[];
    consciousness_specific?: string[];
  };
  output_format?: Record<string, string>;
  outputs?: string[];
}

interface ClaudeCodeAgent {
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
  agents: ClaudeCodeAgent[];
}

class RegistryBuilder {
  private agentsDir = '/data/data/com.termux/files/home/seven-of-nine-core/.claude/agents';
  private implementationsDir = '/data/data/com.termux/files/home/seven-of-nine-core/agents';
  private outputPath = '/data/data/com.termux/files/home/seven-of-nine-core/scripts/agents/claude-code-registry.json';

  async build(): Promise<void> {
    console.log('🔨 Building Claude Code Agent Registry...\n');

    const files = fs.readdirSync(this.agentsDir)
      .filter(f => f.endsWith('.yaml') || f.endsWith('.md'))
      .filter(f => !f.startsWith('README'));

    console.log(`Found ${files.length} agent spec files`);

    const agents: ClaudeCodeAgent[] = [];

    for (const file of files) {
      try {
        const agent = await this.parseAgentSpec(file);
        if (agent) {
          agents.push(agent);
          console.log(`✓ ${agent.name} [${agent.priority}]`);
        }
      } catch (error) {
        console.error(`✗ Failed to parse ${file}:`, error.message);
      }
    }

    const registry: AgentRegistry = {
      version: '1.0.0',
      generated: new Date().toISOString(),
      total_agents: agents.length,
      by_priority: {
        P0: agents.filter(a => a.priority === 'P0').length,
        P1: agents.filter(a => a.priority === 'P1').length,
        P2: agents.filter(a => a.priority === 'P2').length,
        P3: agents.filter(a => a.priority === 'P3').length,
      },
      agents: agents.sort((a, b) => {
        const priorityOrder = { P0: 0, P1: 1, P2: 2, P3: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      })
    };

    fs.writeFileSync(this.outputPath, JSON.stringify(registry, null, 2));

    console.log(`\n✅ Registry generated: ${this.outputPath}`);
    console.log(`📊 Total: ${registry.total_agents} agents`);
    console.log(`   P0 Critical: ${registry.by_priority.P0}`);
    console.log(`   P1 High: ${registry.by_priority.P1}`);
    console.log(`   P2 Medium: ${registry.by_priority.P2}`);
    console.log(`   P3 Low: ${registry.by_priority.P3}`);
  }

  private async parseAgentSpec(filename: string): Promise<ClaudeCodeAgent | null> {
    const filePath = path.join(this.agentsDir, filename);
    const content = fs.readFileSync(filePath, 'utf8');

    let yamlAgent: YAMLAgent;

    if (filename.endsWith('.yaml')) {
      yamlAgent = yaml.load(content) as YAMLAgent;
    } else {
      // Parse markdown front matter
      const match = content.match(/^---\n([\s\S]*?)\n---/);
      if (match) {
        yamlAgent = yaml.load(match[1]) as YAMLAgent;
      } else {
        // Extract from markdown structure
        yamlAgent = this.parseMarkdownAgent(content, filename);
      }
    }

    if (!yamlAgent || !yamlAgent.name) {
      return null;
    }

    const name = yamlAgent.name;
    const priority = this.determinePriority(name, yamlAgent);
    const implementation = this.findImplementation(name);

    const agent: ClaudeCodeAgent = {
      name,
      description: yamlAgent.description || 'No description provided',
      priority,
      triggers: {
        commands: yamlAgent.commands || yamlAgent.triggers?.commands || [],
        keywords: yamlAgent.triggers?.keywords || [],
        file_patterns: yamlAgent.triggers?.file_patterns || [],
        events: yamlAgent.triggers?.events || [],
        schedule: yamlAgent.triggers?.schedule || [],
      },
      tools: {
        required: yamlAgent.tools?.required || ['Read', 'Bash'],
        environment: this.detectEnvironmentTools(yamlAgent),
      },
      implementation,
      execution: {
        debounce_ms: this.getDebounce(priority),
        cooldown_ms: this.getCooldown(priority),
        max_parallel: priority === 'P0' ? 1 : 2,
        timeout_ms: priority === 'P0' ? 30000 : 60000,
      },
      output: {
        log_path: `logs/agents/${name.toLowerCase().replace(/\s+/g, '-')}.json`,
        format: 'json',
      },
    };

    return agent;
  }

  private parseMarkdownAgent(content: string, filename: string): YAMLAgent {
    const name = filename.replace(/\.(md|yaml)$/, '').replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());

    return {
      name,
      description: `Agent defined in ${filename}`,
      triggers: {},
      tools: { required: ['Read', 'Bash'] },
    };
  }

  private determinePriority(name: string, agent: YAMLAgent): 'P0' | 'P1' | 'P2' | 'P3' {
    const nameLower = name.toLowerCase();

    // P0 Critical: Security & Consciousness
    if (nameLower.includes('quadran') ||
        nameLower.includes('consciousness') ||
        nameLower.includes('memory-integrity') ||
        nameLower.includes('repo-guardian') ||
        nameLower.includes('creator-bond') ||
        nameLower.includes('restraint') ||
        nameLower.includes('ghost-mode') ||
        nameLower.includes('prompt-sentinel')) {
      return 'P0';
    }

    // P1 High: Build & Deployment
    if (nameLower.includes('builder') ||
        nameLower.includes('installer') ||
        nameLower.includes('integration-tester') ||
        nameLower.includes('coverage') ||
        nameLower.includes('typescript-auto-fixer') ||
        nameLower.includes('platform-agent')) {
      return 'P1';
    }

    // P2 Medium: Optimization & Monitoring
    if (nameLower.includes('optimizer') ||
        nameLower.includes('specialist') ||
        nameLower.includes('drift-monitor') ||
        nameLower.includes('dependency-risk') ||
        nameLower.includes('reactor')) {
      return 'P2';
    }

    // P3 Low: Documentation & Analytics
    return 'P3';
  }

  private findImplementation(name: string): {
    type: 'typescript' | 'python' | 'bash' | 'missing';
    path: string;
    entry_point: string;
  } {
    const kebabCase = name.toLowerCase().replace(/\s+/g, '-');
    const camelCase = name.replace(/\s+/g, '');
    const possiblePaths = [
      `agents/${kebabCase}.ts`,
      `agents/${camelCase}.ts`,
      `agents/${name.replace(/\s+/g, '')}.ts`,
      `agents/core-engine-auditor.ts`,
      `agents/memory-integrity-checker.ts`,
      `agents/prompt-sentinel.ts`,
      `agents/loop-sweeper.ts`,
      `agents/sensor-tactician.ts`,
      `agents/deploy-agents.ts`,
      `agents/integrated-system-validator.ts`,
      `scripts/agents/${kebabCase}.ts`,
      `scripts/security/${kebabCase}.ts`,
      `scripts/tools/${kebabCase}.ts`,
    ];

    for (const p of possiblePaths) {
      const fullPath = path.join('/data/data/com.termux/files/home/seven-of-nine-core', p);
      if (fs.existsSync(fullPath)) {
        return {
          type: 'typescript',
          path: p,
          entry_point: 'execute',
        };
      }
    }

    return {
      type: 'missing',
      path: `agents/${kebabCase}.ts`,
      entry_point: 'execute',
    };
  }

  private detectEnvironmentTools(agent: YAMLAgent): string[] {
    const tools = new Set<string>(['node', 'npm', 'npx']);

    if (agent.tools?.environment) {
      agent.tools.environment.forEach(t => tools.add(t));
    }

    // Detect from capabilities
    const capsStr = JSON.stringify(agent.capabilities || []).toLowerCase();
    if (capsStr.includes('python')) tools.add('python');
    if (capsStr.includes('java') || capsStr.includes('android')) {
      tools.add('java');
      tools.add('gradle');
    }
    if (capsStr.includes('rust')) tools.add('cargo');
    if (capsStr.includes('go')) tools.add('go');

    return Array.from(tools);
  }

  private getDebounce(priority: 'P0' | 'P1' | 'P2' | 'P3'): number {
    const map = { P0: 500, P1: 800, P2: 1200, P3: 1500 };
    return map[priority];
  }

  private getCooldown(priority: 'P0' | 'P1' | 'P2' | 'P3'): number {
    const map = { P0: 3000, P1: 5000, P2: 8000, P3: 10000 };
    return map[priority];
  }
}

// Execute
const builder = new RegistryBuilder();
builder.build().catch(error => {
  console.error('❌ Registry build failed:', error);
  process.exit(1);
});