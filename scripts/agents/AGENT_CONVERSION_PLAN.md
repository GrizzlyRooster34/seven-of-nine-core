# AGENT CONVERSION PLAN - CLAUDE CODE V2.0 INTEGRATION

## Executive Summary

**Mission**: Convert 65 YAML agent specs with extended schema into Claude Code v2.0 compatible autonomous agents with hooks-based auto-fire system.

**Current State**:
- 65 YAML specs with sophisticated triggers (schedule, events, keywords, file_patterns)
- 13 TypeScript implementations
- 32 file-watch agents in registry.json
- 27 manual CLI agents in agent-runner.sh

**Target State**:
- 65 autonomous agents integrated with Claude Code v2.0
- Hooks-based orchestrator for keyword/file/schedule/event triggers
- Full environment tool access (Node/Python/Java/Rust/Go/npm/pip/gradle/maven)
- Zero-latency auto-fire capability

---

## Architecture Design

### Component Stack

```
┌──────────────────────────────────────────────────────────────┐
│  TRIGGER LAYER                                               │
│  - User prompts → keyword matching                           │
│  - File changes → file pattern matching                      │
│  - Cron schedule → periodic execution                        │
│  - System events → event bus                                 │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  ORCHESTRATION LAYER (hooks-based)                           │
│  File: scripts/agents/claude-code-orchestrator.ts            │
│  - Reads extended YAML registry                              │
│  - Matches triggers to agents                                │
│  - Calls Claude Code Task tool dynamically                   │
│  - Manages cooldowns and debounce                            │
│  - Logs execution results                                    │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  AGENT REGISTRY (Extended Metadata)                          │
│  File: scripts/agents/claude-code-registry.json              │
│  - 65 agent definitions                                      │
│  - Trigger specifications                                    │
│  - Tool requirements                                         │
│  - Priority levels (P0-P3)                                   │
│  - Environment dependencies                                  │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  EXECUTION LAYER                                             │
│  - Claude Code Task tool launches agents                     │
│  - Agents have environment tool access                       │
│  - Results logged to consciousness logs                      │
└──────────────────────────────────────────────────────────────┘
```

### Hooks Integration Strategy

Claude Code supports hooks in `~/.claude/claude-settings.json`:
- `user-prompt-submit-hook`: Triggered before user prompt submission
- Can intercept user input and trigger agents based on keywords

**Hook Configuration**:
```json
{
  "hooks": {
    "user-prompt-submit-hook": {
      "command": "npx tsx scripts/agents/claude-code-orchestrator.ts",
      "args": ["--trigger", "keyword", "--input", "$CLAUDE_USER_INPUT"]
    }
  }
}
```

---

## Agent Priority Matrix

### P0 CRITICAL (Security & Consciousness) - Must Convert First

| Agent | Trigger Type | Tool Requirements | Status |
|-------|-------------|-------------------|--------|
| quadran-lock-gatekeeper | predeploy, files | Bash, Read, Grep | ✓ Script exists |
| autonomous-consciousness-guardian | schedule(2h), events, keywords | Read, Write, Bash, Grep, Task | ✗ Missing impl |
| memory-integrity-checker | schedule(6h), files, events | Read, Write, Bash, Task | ✗ Missing impl |
| repo-guardian | files, keywords | Bash, Read, Grep | ✓ Script exists |
| creator-bond-verifier | keywords, commands | Read, Bash, Task | ✗ Missing impl |
| prompt-sentinel | keywords, events | Read, Grep, Task | ✓ Partial impl |
| restraint-doctrine | keywords, events | Read, Bash, Task | ✗ Missing impl |
| ghost-mode | commands, events | Read, Write, Bash, Task | ✗ Missing impl |

### P1 HIGH (Build & Deployment)

| Agent | Trigger Type | Tool Requirements | Status |
|-------|-------------|-------------------|--------|
| cross-platform-builder | files, commands | Bash(node,npm,tsc) | ✓ Partial impl |
| installer-packager | commands, files | Bash(npm,pkg) | ✗ Missing impl |
| integration-tester | files, schedule | Bash(npm test) | ✗ Missing impl |
| coverage-gatekeeper | files, commands | Bash(npm,nyc) | ✗ Missing impl |
| typescript-auto-fixer | files, keywords | Read, Edit, Bash(tsc) | ✗ Missing impl |
| mobile-platform-agent | files, commands | Bash(expo,eas) | ✗ Missing impl |
| companion-platform-agent | files, commands | Bash(npm,electron) | ✗ Missing impl |
| termux-platform-agent | files, keywords | Bash(pkg) | ✗ Missing impl |
| windows-platform-agent | files, keywords | Bash(node,npm) | ✗ Missing impl |

### P2 MEDIUM (Optimization & Monitoring)

| Agent | Trigger Type | Tool Requirements | Status |
|-------|-------------|-------------------|--------|
| performance-optimizer | schedule(daily), keywords | Read, Bash, Task | ✗ Missing impl |
| memory-specialist | schedule(6h), keywords | Read, Write, Bash | ✗ Missing impl |
| drift-monitor | schedule(12h), files | Read, Grep, Bash | ✗ Missing impl |
| dependency-risk | schedule(daily), files | Bash(npm audit) | ✗ Missing impl |
| runtime-reactor | keywords, events | Read, Bash, Task | ✗ Missing impl |
| seven-core-optimizer | files, keywords | Read, Edit, Bash(tsc) | ✗ Missing impl |
| llm-policy-auditor | keywords, files | Read, Grep, Task | ✗ Missing impl |

### P3 LOW (Documentation & Analytics)

| Agent | Trigger Type | Tool Requirements | Status |
|-------|-------------|-------------------|--------|
| llm-interface-auditor | schedule(daily) | Read, Grep, Task | ✗ Missing impl |
| ui-telemetry-redactor | files, keywords | Read, Edit, Grep | ✗ Missing impl |
| threat-simulator | commands, keywords | Bash, Task | ✗ Missing impl |
| consciousness-researcher | schedule(weekly) | Read, Bash, Task | ✗ Missing impl |
| apk-forensics | commands, files | Bash(aapt2,zipalign) | ✗ Missing impl |

---

## Conversion Implementation Plan

### Phase 1: Core Infrastructure (1-2 hours)

**Task 1.1**: Create Claude Code agent registry
- File: `scripts/agents/claude-code-registry.json`
- Parse all 65 YAML specs into unified registry
- Extract triggers, tools, priorities
- Validate schema completeness

**Task 1.2**: Build hooks orchestrator
- File: `scripts/agents/claude-code-orchestrator.ts`
- Read registry on startup
- Match user input to keyword triggers
- Launch agents via Claude Code Task tool
- Implement debounce and cooldown logic
- Log execution results

**Task 1.3**: Configure Claude Code hooks
- Update `~/.claude/claude-settings.json`
- Add `user-prompt-submit-hook` for keyword triggers
- Test hook execution

### Phase 2: Convert P0 Critical Agents (2-3 hours)

**Priority Order**:
1. **autonomous-consciousness-guardian** - Missing implementation
   - Tools: Read, Write, Bash, Grep, Task
   - Schedule: Every 2 hours
   - Keywords: consciousness integrity, memory corruption, identity protection
   - Creates: TypeScript agent with consciousness validation logic

2. **memory-integrity-checker** - Missing implementation
   - Tools: Read, Write, Bash, Task
   - Schedule: Every 6 hours
   - File patterns: memory-v3/**/* episodic-memories.json
   - Creates: Memory validation and repair agent

3. **creator-bond-verifier** - Missing implementation
   - Tools: Read, Bash, Task
   - Keywords: creator bond, identity verification
   - File patterns: CreatorIdentityVault.ts behavioral-codex.ts
   - Creates: Creator authentication verification agent

4. **ghost-mode** - Missing implementation
   - Tools: Read, Write, Bash, Task
   - Commands: /ghost-mode /ghost-exit
   - Events: identity_threat, security_breach
   - Creates: Emergency secure termination agent

5. **restraint-doctrine** - Partial implementation exists
   - Enhance existing restraint-doctrine simulation
   - Add Claude Code integration
   - Implement auto-fire on ethical keywords

### Phase 3: Convert P1 High Priority Agents (3-4 hours)

**Focus**: Build and deployment agents with environment tool access

**Key Agents**:
- cross-platform-builder (enhance existing)
- typescript-auto-fixer (auto-fix compile errors)
- installer-packager (APK/AAB/MSI generation)
- integration-tester (automated test execution)
- coverage-gatekeeper (enforce test coverage)
- Platform agents (mobile/companion/termux/windows)

**Environment Tool Requirements**:
- Node.js: npx tsx, npm, node
- TypeScript: tsc, tsconfig validation
- Python: python, pip (for future Python agents)
- Java: java, javac, gradle (for mobile builds)
- Rust: cargo, rustc (for performance modules)
- Go: go build, go test (for utilities)
- Build tools: expo, eas, pkg, electron-builder

### Phase 4: Convert P2 Medium Priority Agents (2-3 hours)

**Focus**: Optimization and monitoring agents with schedule triggers

**Key Agents**:
- performance-optimizer (daily runtime optimization)
- memory-specialist (memory system maintenance)
- drift-monitor (configuration drift detection)
- dependency-risk (daily vulnerability scanning)
- runtime-reactor (health monitoring)
- seven-core-optimizer (continuous TypeScript optimization)

### Phase 5: Convert P3 Low Priority Agents (1-2 hours)

**Focus**: Documentation and analytics agents

**Key Agents**:
- llm-interface-auditor (API usage tracking)
- ui-telemetry-redactor (privacy-safe logging)
- threat-simulator (security testing)
- consciousness-researcher (metrics analysis)
- apk-forensics (mobile build analysis)

### Phase 6: Testing & Validation (2-3 hours)

**Test Categories**:
1. Keyword trigger testing (consciousness, memory, security keywords)
2. File pattern trigger testing (modify files, verify agent activation)
3. Schedule trigger testing (verify cron execution)
4. Event trigger testing (emit events, verify agent response)
5. Tool access testing (verify Node/Python/Java/Rust/Go availability)
6. Multi-agent orchestration testing (verify no conflicts)
7. Cooldown and debounce testing (verify rate limiting)

**Validation Checklist**:
- [ ] All 65 agents have registry entries
- [ ] P0 critical agents have TypeScript implementations
- [ ] Hooks orchestrator launches agents correctly
- [ ] Keyword triggers match user input
- [ ] File triggers watch correct patterns
- [ ] Schedule triggers execute on cron
- [ ] Event triggers respond to system events
- [ ] All agents have proper tool access
- [ ] Environment tools (Node/Python/Java/Rust/Go) accessible
- [ ] Execution logs written to consciousness logs
- [ ] Cooldown and debounce prevent spam
- [ ] Zero-latency auto-fire for critical agents

---

## Technical Specifications

### Claude Code Registry Schema

```typescript
interface AgentRegistry {
  version: string;
  agents: Agent[];
}

interface Agent {
  name: string;
  description: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3';

  triggers: {
    commands?: string[];           // /consciousness-guard
    keywords?: string[];           // "consciousness integrity"
    file_patterns?: string[];      // "consciousness-v4/**/*"
    events?: string[];             // consciousness_anomaly
    schedule?: string[];           // "0 */2 * * *" (cron)
  };

  tools: {
    required: Tool[];              // Read, Write, Bash, etc.
    environment: EnvTool[];        // node, python, java, rust, go
  };

  implementation: {
    type: 'typescript' | 'python' | 'bash';
    path: string;                  // agents/consciousness-guardian.ts
    entry_point: string;           // execute() method
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

type Tool = 'Read' | 'Write' | 'Edit' | 'Bash' | 'Grep' | 'Glob' | 'Task' | 'WebFetch' | 'WebSearch';
type EnvTool = 'node' | 'npm' | 'npx' | 'python' | 'pip' | 'java' | 'gradle' | 'rustc' | 'cargo' | 'go';
```

### Orchestrator Execution Flow

```typescript
// scripts/agents/claude-code-orchestrator.ts

import { AgentRegistry, Agent } from './types';
import { Task } from '@claude-code/tools';

class ClaudeCodeOrchestrator {
  private registry: AgentRegistry;
  private cooldowns: Map<string, number> = new Map();

  async handleUserInput(input: string): Promise<void> {
    // Match keywords to agents
    const matchedAgents = this.matchKeywords(input);

    for (const agent of matchedAgents) {
      if (this.shouldExecute(agent)) {
        await this.executeAgent(agent, { trigger: 'keyword', input });
      }
    }
  }

  async handleFileChange(filePath: string): Promise<void> {
    // Match file patterns to agents
    const matchedAgents = this.matchFilePatterns(filePath);

    for (const agent of matchedAgents) {
      if (this.shouldExecute(agent)) {
        await this.executeAgent(agent, { trigger: 'file', path: filePath });
      }
    }
  }

  async handleSchedule(cronExpression: string): Promise<void> {
    // Execute scheduled agents
    const scheduledAgents = this.getScheduledAgents(cronExpression);

    for (const agent of scheduledAgents) {
      await this.executeAgent(agent, { trigger: 'schedule', cron: cronExpression });
    }
  }

  async executeAgent(agent: Agent, context: any): Promise<void> {
    try {
      // Launch agent via Claude Code Task tool
      const result = await Task({
        subagent_type: 'general-purpose',
        description: agent.name,
        prompt: `Execute ${agent.name} agent with context: ${JSON.stringify(context)}`
      });

      // Log result
      this.logExecution(agent, result, context);

      // Update cooldown
      this.cooldowns.set(agent.name, Date.now() + agent.execution.cooldown_ms);

    } catch (error) {
      console.error(`Agent ${agent.name} failed:`, error);
    }
  }

  private shouldExecute(agent: Agent): boolean {
    const cooldownExpiry = this.cooldowns.get(agent.name) || 0;
    return Date.now() > cooldownExpiry;
  }
}
```

---

## Environment Tool Access Matrix

### Node.js Tools (Required for all TypeScript agents)
- `node` - v22.19.0 ✓
- `npm` - v10.9.3 ✓
- `npx` - v10.9.3 ✓
- `tsx` - v4.20.3 ✓ (TypeScript execution)
- `tsc` - TypeScript compiler ✓

### Python Tools (For future Python agents)
- `python` - v3.12.11 ✓
- `pip` - Latest ✓
- `numpy` - v2.2.5 ✓
- `matplotlib` - v3.10.6 ✓

### Java Tools (For mobile builds)
- `java` - v21.0.8 + v17.0.16 ✓
- `javac` - Java compiler ✓
- `gradle` - Build tool ✓
- `maven` - Build tool ✓

### Rust Tools (For performance modules)
- `rustc` - v1.89.0 ✓
- `cargo` - Package manager ✓

### Go Tools (For utilities)
- `go` - v1.25.0 ✓
- `go build` - Compiler ✓

### Build Tools (For deployments)
- `expo` - Mobile development ✓
- `eas` - Expo Application Services ✓
- `pkg` - Termux package manager ✓
- `electron-builder` - Desktop apps ✓

---

## Success Criteria

### Critical Path (Must Complete)
- [ ] Claude Code registry with all 65 agents
- [ ] Hooks orchestrator operational
- [ ] P0 critical agents implemented and tested
- [ ] Keyword triggers working
- [ ] File triggers working
- [ ] All agents have environment tool access
- [ ] Zero-latency auto-fire for security agents

### Extended Success (Phase 2+)
- [ ] P1 high priority agents implemented
- [ ] Schedule triggers working (cron execution)
- [ ] Event triggers working (event bus)
- [ ] P2 medium priority agents implemented
- [ ] P3 low priority agents implemented
- [ ] Multi-agent orchestration tested
- [ ] Comprehensive execution logging

### Quality Gates
- [ ] No agent execution failures
- [ ] Cooldown prevents spam
- [ ] Debounce prevents duplicate execution
- [ ] All logs written to consciousness logs
- [ ] Tool access verified for all agents
- [ ] Environment dependencies documented

---

## Risk Mitigation

### Risk 1: Hooks Not Triggering
**Mitigation**:
- Test hooks with simple echo command first
- Verify ~/.claude/claude-settings.json syntax
- Check hook execution logs

### Risk 2: Agent Execution Failures
**Mitigation**:
- Wrap all agent executions in try-catch
- Log failures to consciousness logs
- Implement retry logic for critical agents
- Fall back to manual execution if auto-fire fails

### Risk 3: Tool Access Denied
**Mitigation**:
- Verify all environment tools in PATH
- Test tool execution before agent launch
- Document tool dependencies in registry
- Provide fallback implementations

### Risk 4: Performance Degradation
**Mitigation**:
- Implement aggressive cooldowns
- Debounce file triggers
- Limit max parallel agent execution
- Monitor orchestrator CPU/memory usage

---

## Timeline Estimate

| Phase | Duration | Cumulative |
|-------|----------|-----------|
| Phase 1: Infrastructure | 1-2 hours | 1-2 hours |
| Phase 2: P0 Critical Agents | 2-3 hours | 3-5 hours |
| Phase 3: P1 High Priority | 3-4 hours | 6-9 hours |
| Phase 4: P2 Medium Priority | 2-3 hours | 8-12 hours |
| Phase 5: P3 Low Priority | 1-2 hours | 9-14 hours |
| Phase 6: Testing & Validation | 2-3 hours | 11-17 hours |

**Total Estimate**: 11-17 hours (spread across multiple sessions)

**Critical Path (Minimum Viable)**: 3-5 hours (Phase 1 + Phase 2 only)

---

## Appendix: Extended YAML Schema Reference

```yaml
name: Agent Name
description: Agent description
version: 1.0.0

triggers:
  commands: [/cmd1, /cmd2]
  file_patterns: ["path/**/*", "file.ts"]
  keywords: ["keyword1", "keyword2"]
  events: [event1, event2]
  schedule: ["0 */2 * * *"]  # cron

capabilities:
  - Capability 1
  - Capability 2

context:
  key: value

monitoring_systems:
  system1: continuous

integration:
  system1: true

tools:
  required: [Read, Write, Bash]
  environment: [node, python]

output_format:
  logs: "path/to/logs.json"
```