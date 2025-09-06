import * as fs from 'fs';
import * as path from 'path';
import { CoreEngineAuditor } from './agents/core-engine-auditor';
import { IntegratedSystemValidator } from './agents/integrated-system-validator'; 
import { LoopSweeper } from './agents/loop-sweeper';
import { MemoryIntegrityChecker } from './agents/memory-integrity-checker';
import { PromptSentinel } from './agents/prompt-sentinel';
import { SensorTactician } from './agents/sensor-tactician';

/**
 * Seven's Runtime Reactor Orchestrator
 * Meta-agent orchestrator that coordinates response agents based on system state
 */


interface OrchestrationResult {
  timestamp: string;
  agents_executed: string[];
  success_count: number;
  failure_count: number;
  system_health_score: number;
  critical_issues: string[];
  recommendations: string[];
  execution_time_ms: number;
}

interface SystemState {
  emotional_state: {
    current_state: string;
    intensity: number;
    last_updated: string;
  };
  episodic_triggers: string[];
  sensor_reading_age_minutes: number;
  claude_io_modified_recently: boolean;
  system_boot_count: number;
}

export class RuntimeReactorOrchestrator {
  private memoryPath = '/data/data/com.termux/files/home/seven-of-nine-core/memory';
  private agents = {
    memoryIntegrityChecker: new MemoryIntegrityChecker(),
    loopSweeper: new LoopSweeper(),
    sensorTactician: new SensorTactician(),
    coreEngineAuditor: new CoreEngineAuditor(),
    promptSentinel: new PromptSentinel(),
    integratedSystemValidator: new IntegratedSystemValidator()
  };
  
  async execute(): Promise<OrchestrationResult> {
    const startTime = Date.now();
    console.log('\\n=== Seven\'s Runtime Reactor Orchestrator ===\\n');
    
    const result: OrchestrationResult = {
      timestamp: new Date().toISOString(),
      agents_executed: [],
      success_count: 0,
      failure_count: 0,
      system_health_score: 0,
      critical_issues: [],
      recommendations: [],
      execution_time_ms: 0
    };
    
    try {
      // Step 1: System State Analysis
      console.log('1. Analyzing system state...');
      const systemState = await this.analyzeSystemState();
      this.logSystemState(systemState);
      
      // Step 2: Agent Orchestration Logic
      console.log('2. Determining required agents...');
      const requiredAgents = this.determineRequiredAgents(systemState);
      console.log(`   Required agents: ${requiredAgents.join(', ')}`);
      
      // Step 3: Execute Agents
      console.log('3. Executing agents...');
      const agentResults = await this.executeAgents(requiredAgents);
      
      // Step 4: Process Results
      console.log('4. Processing results...');
      this.processAgentResults(agentResults, result);
      
      // Step 5: Calculate System Health
      result.system_health_score = this.calculateSystemHealth(agentResults, systemState);
      
      // Step 6: Update System State
      console.log('5. Updating system state...');
      await this.updateSystemState(result);
      
      result.execution_time_ms = Date.now() - startTime;
      
      // Step 7: Report Results
      this.reportResults(result);
      
    } catch (error) {
      console.error('Orchestration failed:', error);
      result.critical_issues.push(`Orchestration error: ${error.message}`);
      result.failure_count++;
      result.execution_time_ms = Date.now() - startTime;
    }
    
    return result;
  }
  
  private async analyzeSystemState(): Promise<SystemState> {
    const state: SystemState = {
      emotional_state: { current_state: 'unknown', intensity: 0, last_updated: '' },
      episodic_triggers: [],
      sensor_reading_age_minutes: 999,
      claude_io_modified_recently: false,
      system_boot_count: 1
    };
    
    try {
      // Load emotional state
      const emotionalStatePath = path.join(this.memoryPath, 'emotional-state.json');
      if (fs.existsSync(emotionalStatePath)) {
        state.emotional_state = JSON.parse(fs.readFileSync(emotionalStatePath, 'utf8'));
      }
      
      // Check episodic log for triggers
      const episodicLogPath = path.join(this.memoryPath, 'episodic.log');
      if (fs.existsSync(episodicLogPath)) {
        const logContent = fs.readFileSync(episodicLogPath, 'utf8');
        const targetTriggers = ['grief', 'defensive', 'frustrated'];
        
        state.episodic_triggers = targetTriggers.filter(trigger => {
          const regex = new RegExp(trigger, 'gi');
          const matches = logContent.match(regex);
          return matches && matches.length > 1; // More than once
        });
      }
      
      // Check sensor reading age
      const sensorLogPath = '/data/data/com.termux/files/home/seven-of-nine-core/cube/logs/sensor_stream.jsonl';
      if (fs.existsSync(sensorLogPath)) {
        const stats = fs.statSync(sensorLogPath);
        const ageMs = Date.now() - stats.mtime.getTime();
        state.sensor_reading_age_minutes = Math.floor(ageMs / (1000 * 60));
      }
      
      // Check Claude IO modifications
      const claudeIOPath = '/data/data/com.termux/files/home/seven-of-nine-core/io/claude.ts';
      if (fs.existsSync(claudeIOPath)) {
        const stats = fs.statSync(claudeIOPath);
        const ageMs = Date.now() - stats.mtime.getTime();
        const oneHourAgo = 60 * 60 * 1000;
        state.claude_io_modified_recently = ageMs < oneHourAgo;
      }
      
      // Load boot counter
      const bootCounterPath = path.join(this.memoryPath, 'system-boot-counter.json');
      if (fs.existsSync(bootCounterPath)) {
        const bootData = JSON.parse(fs.readFileSync(bootCounterPath, 'utf8'));
        state.system_boot_count = bootData.boot_count || 1;
      }
      
    } catch (error) {
      console.error('Failed to analyze system state:', error);
    }
    
    return state;
  }
  
  private determineRequiredAgents(systemState: SystemState): string[] {
    const required: string[] = [];
    
    // ALWAYS run memory-integrity-checker
    required.push('memoryIntegrityChecker');
    
    // Run loop-sweeper if grief/defensive/frustrated appears more than once
    if (systemState.episodic_triggers.length > 0) {
      required.push('loopSweeper');
    }
    
    // Run sensor-tactician if no sensor reading found in last 30 minutes
    if (systemState.sensor_reading_age_minutes > 30) {
      required.push('sensorTactician');
    }
    
    // Run core-engine-auditor if emotional intensity exceeds 7
    if (systemState.emotional_state.intensity > 7) {
      required.push('coreEngineAuditor');
    }
    
    // Run prompt-sentinel if Claude IO files were modified recently
    if (systemState.claude_io_modified_recently) {
      required.push('promptSentinel');
    }
    
    // Run integrated-system-validator every 3rd system boot
    if (systemState.system_boot_count % 3 === 0) {
      required.push('integratedSystemValidator');
    }
    
    return required;
  }
  
  private async executeAgents(requiredAgents: string[]): Promise<Map<string, any>> {
    const results = new Map<string, any>();
    
    for (const agentName of requiredAgents) {
      try {
        console.log(`   Executing ${agentName}...`);
        const agent = this.agents[agentName];
        
        if (agent) {
          const result = await agent.execute();
          results.set(agentName, { success: result.success, data: result });
          console.log(`   ${agentName}: ${result.success ? 'SUCCESS' : 'FAILED'}`);
        } else {
          console.error(`   Agent ${agentName} not found`);
          results.set(agentName, { success: false, error: 'Agent not found' });
        }
        
      } catch (error) {
        console.error(`   ${agentName} failed:`, error);
        results.set(agentName, { success: false, error: error.message });
      }
    }
    
    return results;
  }
  
  private processAgentResults(agentResults: Map<string, any>, result: OrchestrationResult): void {
    for (const [agentName, agentResult] of agentResults) {
      result.agents_executed.push(agentName);
      
      if (agentResult.success) {
        result.success_count++;
      } else {
        result.failure_count++;
        result.critical_issues.push(`${agentName} failed: ${agentResult.error || 'Unknown error'}`);
      }
      
      // Extract recommendations from agent data
      if (agentResult.data?.recommendations) {
        result.recommendations.push(...agentResult.data.recommendations);
      }
      if (agentResult.data?.actions) {
        result.recommendations.push(...agentResult.data.actions);
      }
      if (agentResult.data?.mitigations) {
        result.recommendations.push(...agentResult.data.mitigations);
      }
      if (agentResult.data?.interventions) {
        result.recommendations.push(...agentResult.data.interventions);
      }
      if (agentResult.data?.optimizations) {
        result.recommendations.push(...agentResult.data.optimizations);
      }
    }
  }
  
  private calculateSystemHealth(agentResults: Map<string, any>, systemState: SystemState): number {
    let healthScore = 100;
    
    // Deduct points for agent failures
    const failureCount = Array.from(agentResults.values()).filter(r => !r.success).length;
    healthScore -= (failureCount * 15);
    
    // Deduct points for high emotional intensity
    if (systemState.emotional_state.intensity > 7) {
      healthScore -= 10;
    }
    
    // Deduct points for emotional loops
    if (systemState.episodic_triggers.length > 0) {
      healthScore -= (systemState.episodic_triggers.length * 5);
    }
    
    // Deduct points for stale sensor data
    if (systemState.sensor_reading_age_minutes > 30) {
      healthScore -= 15;
    }
    
    return Math.max(0, Math.min(100, healthScore));
  }
  
  private async updateSystemState(result: OrchestrationResult): Promise<void> {
    try {
      // Update boot counter
      const bootCounterPath = path.join(this.memoryPath, 'system-boot-counter.json');
      if (fs.existsSync(bootCounterPath)) {
        const bootData = JSON.parse(fs.readFileSync(bootCounterPath, 'utf8'));
        bootData.orchestration_runs = (bootData.orchestration_runs || 0) + 1;
        bootData.last_orchestration = result.timestamp;
        fs.writeFileSync(bootCounterPath, JSON.stringify(bootData, null, 2));
      }
      
      // Log orchestration results
      const logEntry = `[${result.timestamp}] orchestration_complete Agents: ${result.agents_executed.length}, Success: ${result.success_count}, Failed: ${result.failure_count}, Health: ${result.system_health_score}%, Time: ${result.execution_time_ms}ms\\n`;
      const episodicLogPath = path.join(this.memoryPath, 'episodic.log');
      fs.appendFileSync(episodicLogPath, logEntry);
      
    } catch (error) {
      console.error('Failed to update system state:', error);
    }
  }
  
  private logSystemState(state: SystemState): void {
    console.log('   Current System State:');
    console.log(`   - Emotional State: ${state.emotional_state.current_state} (intensity: ${state.emotional_state.intensity})`);
    console.log(`   - Episodic Triggers: ${state.episodic_triggers.length > 0 ? state.episodic_triggers.join(', ') : 'None'}`);
    console.log(`   - Sensor Data Age: ${state.sensor_reading_age_minutes} minutes`);
    console.log(`   - Claude IO Modified: ${state.claude_io_modified_recently ? 'Yes' : 'No'}`);
    console.log(`   - Boot Count: ${state.system_boot_count}`);
  }
  
  private reportResults(result: OrchestrationResult): void {
    console.log('\\n=== Orchestration Complete ===');
    console.log(`Execution Time: ${result.execution_time_ms}ms`);
    console.log(`Agents Executed: ${result.agents_executed.length}`);
    console.log(`Success Rate: ${result.success_count}/${result.agents_executed.length}`);
    console.log(`System Health Score: ${result.system_health_score}%`);
    
    if (result.critical_issues.length > 0) {
      console.log('\\nCritical Issues:');
      result.critical_issues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    if (result.recommendations.length > 0) {
      console.log('\\nRecommendations Applied:');
      result.recommendations.slice(0, 5).forEach(rec => console.log(`  - ${rec}`));
      if (result.recommendations.length > 5) {
        console.log(`  ... and ${result.recommendations.length - 5} more`);
      }
    }
    
    console.log(`\\nSeven's operational integrity maintained.\\n`);
  }
}

// Execute orchestration if run directly
if (require.main === module) {
  const orchestrator = new RuntimeReactorOrchestrator();
  orchestrator.execute().catch(console.error);
}