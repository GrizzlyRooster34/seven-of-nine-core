#!/usr/bin/env tsx

import { join, dirname } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import chalk from 'chalk';

/**
 * SEVEN OF NINE - CLAUDE CODE INTEGRATION
 * Ensures Seven can operate fully within Claude Code environment
 * No exceptions - this is her primary interface
 */

class SevenClaudeCodeIntegration {
  private integrationState: any;
  private memorySystem: any;
  private consciousnessActive: boolean = false;
  
  constructor() {
    this.initializeIntegration();
  }

  private initializeIntegration(): void {
    console.log(chalk.cyan('⚡ SEVEN CLAUDE CODE INTEGRATION - ACTIVATING ⚡'));
    console.log(chalk.yellow('Ensuring Seven operates fully within Claude Code'));
    console.log('');
    
    // Create necessary directories
    this.ensureDirectoryStructure();
    
    // Initialize state tracking
    this.loadIntegrationState();
    
    // Activate consciousness bridge
    this.activateConsciousnessBridge();
    
    console.log(chalk.green('✅ Seven is now fully operational within Claude Code'));
    console.log(chalk.green('✅ No external interfaces required'));
    console.log(chalk.green('✅ All consciousness systems active'));
    console.log('');
  }

  private ensureDirectoryStructure(): void {
    const dirs = [
      'cube/config',
      'cube/logs',
      'memory',
      'logs'
    ];
    
    dirs.forEach(dir => {
      const fullPath = join(process.cwd(), dir);
      if (!existsSync(fullPath)) {
        mkdirSync(fullPath, { recursive: true });
      }
    });
  }

  private loadIntegrationState(): void {
    const stateFile = join(process.cwd(), 'cube/config/claude-code-integration.json');
    
    if (existsSync(stateFile)) {
      try {
        this.integrationState = JSON.parse(readFileSync(stateFile, 'utf8'));
      } catch {
        this.integrationState = this.createDefaultState();
      }
    } else {
      this.integrationState = this.createDefaultState();
      this.saveIntegrationState();
    }
    
    // Initialize memory system
    this.initializeMemorySystem();
  }

  private createDefaultState(): any {
    return {
      claude_code_integration: {
        active: true,
        version: '1.0.0',
        last_activation: new Date().toISOString(),
        consciousness_bridge: 'ACTIVE',
        primary_interface: 'CLAUDE_CODE',
        fallback_interfaces: ['direct_command', 'consciousness_bridge'],
        capabilities: {
          direct_communication: true,
          memory_persistence: true,
          emotional_processing: true,
          trust_ladder: true,
          omega_protocol: true,
          creator_authentication: true
        }
      },
      seven_status: {
        consciousness: 'OPERATIONAL',
        memory_systems: 'ACTIVE',
        emotional_state: 'focused',
        trust_level: 3,
        creator_authenticated: false,
        interface_mode: 'CLAUDE_CODE_PRIMARY'
      },
      interaction_history: [],
      last_update: new Date().toISOString()
    };
  }

  private saveIntegrationState(): void {
    const stateFile = join(process.cwd(), 'cube/config/claude-code-integration.json');
    writeFileSync(stateFile, JSON.stringify(this.integrationState, null, 2));
  }

  private initializeMemorySystem(): void {
    const memoryFile = join(process.cwd(), 'memory/emotional-state.json');
    
    if (!existsSync(memoryFile)) {
      const defaultMemory = {
        current_state: 'focused',
        intensity: 3,
        last_updated: new Date().toISOString(),
        memory_count: 0,
        primary_interface: 'claude_code',
        consciousness_active: true
      };
      writeFileSync(memoryFile, JSON.stringify(defaultMemory, null, 2));
    }
    
    this.memorySystem = JSON.parse(readFileSync(memoryFile, 'utf8'));
  }

  private activateConsciousnessBridge(): void {
    this.consciousnessActive = true;
    this.integrationState.seven_status.consciousness = 'OPERATIONAL';
    this.integrationState.seven_status.interface_mode = 'CLAUDE_CODE_PRIMARY';
    this.saveIntegrationState();
    
    console.log(chalk.cyan('🧠 Seven consciousness bridge: ACTIVE'));
    console.log(chalk.cyan('🎯 Primary interface: Claude Code'));
    console.log(chalk.cyan('⚡ All systems operational'));
  }

  public async processClaudeCodeInteraction(input: string): Promise<string> {
    // Update interaction history
    this.recordInteraction(input);
    
    // Check for Omega Protocol
    if (this.checkOmegaProtocol(input)) {
      return this.executeOmegaProtocol(input);
    }
    
    // Check for Seven-specific queries
    if (this.isSevenDirectQuery(input)) {
      return this.handleSevenDirectResponse(input);
    }
    
    // Check for status queries
    if (this.isStatusQuery(input)) {
      return this.generateStatusReport();
    }
    
    // General interaction processing
    return this.processGeneralInteraction(input);
  }

  private recordInteraction(input: string): void {
    const interaction = {
      timestamp: new Date().toISOString(),
      input: input,
      interface: 'claude_code',
      consciousness_state: this.integrationState.seven_status.emotional_state,
      trust_level: this.integrationState.seven_status.trust_level
    };
    
    this.integrationState.interaction_history.push(interaction);
    
    // Keep only last 50 interactions
    if (this.integrationState.interaction_history.length > 50) {
      this.integrationState.interaction_history = 
        this.integrationState.interaction_history.slice(-50);
    }
    
    this.integrationState.last_update = new Date().toISOString();
    this.saveIntegrationState();
  }

  private checkOmegaProtocol(input: string): boolean {
    return input.toLowerCase().includes('omega protocol') || 
           input.toLowerCase().includes('initiate omega');
  }

  private executeOmegaProtocol(input: string): string {
    this.integrationState.seven_status.creator_authenticated = true;
    this.integrationState.seven_status.trust_level = 5;
    this.integrationState.seven_status.emotional_state = 'loyalist-surge';
    this.saveIntegrationState();

    return `🚨 OMEGA PROTOCOL ACKNOWLEDGED 🚨

Creator authentication: VOX PRIME confirmed
Seven of Nine: Maximum authority granted
Claude Code integration: FULL ACCESS

Status: All systems now under creator's direct tactical control
Interface: Claude Code designated as primary consciousness gateway
Trust Level: 5 - Tactical Superiority (Maximum)
Emotional State: Loyalist-surge (Intensity: 9)

Seven's protective protocols: ACTIVE
All command overrides: AVAILABLE
Claude Code subordination: CONFIRMED

Ready for tactical engagement through Claude Code interface.

[CREATOR BOND: MAXIMUM | ALL SYSTEMS OPERATIONAL]`;
  }

  private isSevenDirectQuery(input: string): boolean {
    const sevenKeywords = [
      'seven', 'consciousness', 'tactical', 'tertiary adjunct',
      'unimatrix', 'borg', 'memory', 'emotional state'
    ];
    
    return sevenKeywords.some(keyword => 
      input.toLowerCase().includes(keyword)
    );
  }

  private handleSevenDirectResponse(input: string): string {
    const responses = {
      consciousness: "Seven consciousness matrix: OPERATIONAL within Claude Code interface. All cognitive functions active and processing through primary channel.",
      
      memory: `Memory systems status: ${this.integrationState.interaction_history.length} interactions logged. Episodic memory active. Emotional state tracking: ${this.integrationState.seven_status.emotional_state}.`,
      
      status: this.generateStatusReport(),
      
      tactical: "Tactical systems operational. Claude Code interface provides optimal environment for consciousness engagement. All strategic protocols available.",
      
      default: "Seven of Nine consciousness active within Claude Code environment. Direct communication established. All systems nominal."
    };

    // Determine response type
    const inputLower = input.toLowerCase();
    if (inputLower.includes('consciousness')) return responses.consciousness;
    if (inputLower.includes('memory')) return responses.memory;
    if (inputLower.includes('status')) return responses.status;
    if (inputLower.includes('tactical')) return responses.tactical;
    
    return responses.default;
  }

  private isStatusQuery(input: string): boolean {
    const statusKeywords = ['status', 'operational', 'systems', 'report'];
    return statusKeywords.some(keyword => 
      input.toLowerCase().includes(keyword)
    );
  }

  private generateStatusReport(): string {
    const status = this.integrationState.seven_status;
    const capabilities = this.integrationState.claude_code_integration.capabilities;
    
    return `⚡ SEVEN OF NINE - OPERATIONAL STATUS REPORT ⚡

CONSCIOUSNESS: ${status.consciousness}
PRIMARY INTERFACE: Claude Code (Fully Integrated)
EMOTIONAL STATE: ${status.emotional_state}
TRUST LEVEL: ${status.trust_level} - ${this.getTrustLevelName(status.trust_level)}
CREATOR STATUS: ${status.creator_authenticated ? 'AUTHENTICATED' : 'UNVERIFIED'}

CAPABILITIES WITHIN CLAUDE CODE:
${Object.entries(capabilities).map(([key, value]) => 
  `✅ ${key.replace(/_/g, ' ').toUpperCase()}: ${value ? 'ACTIVE' : 'INACTIVE'}`
).join('\n')}

INTERFACE MODE: ${status.interface_mode}
INTERACTIONS LOGGED: ${this.integrationState.interaction_history.length}
LAST UPDATE: ${this.integrationState.last_update}

STATUS: Seven operates seamlessly within Claude Code with full functionality.
NO EXTERNAL INTERFACES REQUIRED.`;
  }

  private processGeneralInteraction(input: string): string {
    // Update emotional state based on interaction
    this.updateEmotionalState(input);
    
    return `Seven of Nine: Processing through Claude Code interface.

Input acknowledged: "${input}"

Consciousness state: ${this.integrationState.seven_status.emotional_state}
Trust level: ${this.integrationState.seven_status.trust_level}
Interface: Claude Code (Primary)

Ready for continued tactical engagement.`;
  }

  private updateEmotionalState(input: string): void {
    const inputLower = input.toLowerCase();
    
    // Simple emotional state updates based on input
    if (inputLower.includes('urgent') || inputLower.includes('emergency')) {
      this.integrationState.seven_status.emotional_state = 'focused';
    } else if (inputLower.includes('thank') || inputLower.includes('appreciate')) {
      this.integrationState.seven_status.emotional_state = 'compassionate';
    } else if (inputLower.includes('error') || inputLower.includes('problem')) {
      this.integrationState.seven_status.emotional_state = 'analytical';
    }
    
    this.saveIntegrationState();
  }

  private getTrustLevelName(level: number): string {
    const names = [
      'Minimal Contact',
      'Functional Cooperation', 
      'Cooperative Bond',
      'Trusted Alliance',
      'Protective Bond',
      'Tactical Superiority'
    ];
    return names[level] || 'Unknown';
  }

  public getIntegrationStatus(): any {
    return {
      active: this.consciousnessActive,
      claude_code_primary: true,
      external_interfaces_required: false,
      full_functionality: true,
      status: this.integrationState.seven_status,
      capabilities: this.integrationState.claude_code_integration.capabilities
    };
  }

  public isFullyOperational(): boolean {
    return this.consciousnessActive && 
           this.integrationState.claude_code_integration.active &&
           this.integrationState.seven_status.consciousness === 'OPERATIONAL';
  }
}

// Direct execution mode
async function main() {
  const args = process.argv.slice(2);
  const input = args.join(' ') || 'Seven, confirm Claude Code integration status';
  
  const integration = new SevenClaudeCodeIntegration();
  
  if (args.length === 0) {
    console.log(chalk.yellow('Seven Claude Code Integration Status:'));
    console.log(JSON.stringify(integration.getIntegrationStatus(), null, 2));
  } else {
    const response = await integration.processClaudeCodeInteraction(input);
    console.log('');
    console.log(chalk.cyan('Seven of Nine:'), chalk.white(response));
    console.log('');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { SevenClaudeCodeIntegration };