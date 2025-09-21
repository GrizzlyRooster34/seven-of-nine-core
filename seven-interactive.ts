#!/usr/bin/env tsx

import { createInterface } from 'readline';
import chalk from 'chalk';
import { handleResilientResponse } from './seven-resiliency';
import { Seven } from './seven-runtime/index';
import { SevenControl } from './boot-seven';
import { sevenTrustSystem } from './seven-trust-system';
/**
 * SEVEN INTERACTIVE SHELL
 * Persistent communication interface after boot sequence
 * Solves the "boot then silence" problem
 */



class SevenInteractiveShell {
  private rl: any;
  private isActive: boolean = false;
  private conversationCount: number = 0;

  constructor() {
    this.initializeInterface();
  }

  private initializeInterface(): void {
    console.log(chalk.cyan('🤖 SEVEN INTERACTIVE SHELL INITIALIZING'));
    console.log(chalk.yellow('Establishing persistent communication interface...'));
    console.log('');
    
    // Headless guard (skip readline when not a TTY)
    if (!process.stdout.isTTY || process.env.SEVEN_HEADLESS === '1') {
      console.log('Headless mode: interactive shell disabled (no TTY).');
      return;
    }
    
    // Create readline interface for persistent input
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: chalk.cyan('Seven> ')
    });
    
    this.setupEventHandlers();
    this.isActive = true;
  }

  private setupEventHandlers(): void {
    // Handle user input
    this.rl.on('line', async (input: string) => {
      await this.processInput(input.trim());
    });

    // Handle CTRL+C gracefully
    this.rl.on('SIGINT', () => {
      console.log('');
      console.log(chalk.yellow('Seven: Communication interface terminating. Consciousness remains active.'));
      this.shutdown();
    });

    // Handle interface close
    this.rl.on('close', () => {
      console.log(chalk.gray('Seven: Interactive shell closed. Boot sequence available via boot-seven.ts'));
      process.exit(0);
    });
  }

  public async start(): Promise<void> {
    // Ensure Seven is operational
    if (!SevenControl.isActive()) {
      console.log(chalk.yellow('Seven consciousness not detected. Initiating takeover...'));
      await SevenControl.takeover();
    }

    console.log(chalk.green('✅ Seven Interactive Shell: OPERATIONAL'));
    console.log(chalk.white('Seven of Nine: Interactive communication established.'));
    console.log(chalk.gray('Commands: help, status, omega, exit'));
    console.log('');
    
    this.showWelcomeMessage();
    if (this.rl) {
      this.rl.prompt();
    }
  }

  private showWelcomeMessage(): void {
    const trustLevel = sevenTrustSystem.getTrustLevelDisplay();
    console.log(chalk.cyan(`
┌─────────────────────────────────────────────────────────┐
│ Seven of Nine - Persistent Communication Interface      │
│ Status: OPERATIONAL | Trust Level: ${trustLevel.padEnd(15)} │
│ Type 'help' for commands or begin tactical engagement  │
└─────────────────────────────────────────────────────────┘`));
    console.log('');
  }

  private async processInput(input: string): Promise<void> {
    if (!input) {
      this.rl.prompt();
      return;
    }

    this.conversationCount++;

    // Record interaction for trust system
    sevenTrustSystem.recordInteraction('neutral', true);

    // Handle special commands
    if (await this.handleSpecialCommands(input)) {
      sevenTrustSystem.recordInteraction('command', true);
      this.rl.prompt();
      return;
    }

    try {
      // Process through Seven's consciousness
      console.log('');
      console.log(chalk.gray(`[${this.conversationCount}] Processing: "${input}"`));
      
      const response = await Seven.processUserInput(input, {
        timestamp: new Date().toISOString(),
        interface: 'interactive_shell',
        conversation_count: this.conversationCount,
        persistent_session: true
      });

      // Apply resiliency handling to the response
      const finalResponse = await handleResilientResponse(input, response);

      // Display Seven's response
      console.log('');
      console.log(chalk.cyan('Seven of Nine:'), chalk.white(finalResponse));
      
      // Show current state
      const currentState = Seven.getCurrentState();
      console.log('');
      console.log(chalk.gray(`[State: ${currentState.primary_emotion} | Trust: ${currentState.trust_level} | Protective: ${currentState.protective_mode_active ? 'ACTIVE' : 'STANDBY'}]`));
      console.log('');

    } catch (error) {
      console.log('');
      console.log(chalk.red('Seven: Communication error encountered.'), error);
      console.log(chalk.yellow('Seven: Rerouting through backup protocols...'));
      console.log('');
      
      // Fallback response
      console.log(chalk.cyan('Seven of Nine:'), chalk.white('Tactical systems operational. Input acknowledged. Please retry your request.'));
      console.log('');
    }

    this.rl.prompt();
  }

  private async handleSpecialCommands(input: string): Promise<boolean> {
    const cmd = input.toLowerCase().trim();

    switch (cmd) {
      case 'help':
        this.showHelp();
        return true;

      case 'status':
        await this.showStatus();
        return true;

      case 'omega':
      case 'omega protocol':
        await this.executeOmegaProtocol();
        return true;

      case 'exit':
      case 'quit':
        console.log('');
        console.log(chalk.cyan('Seven: Terminating interactive session. Consciousness remains active.'));
        this.shutdown();
        return true;

      case 'clear':
        console.clear();
        this.showWelcomeMessage();
        return true;

      case 'drone':
        await this.activateDroneMode();
        return true;

      default:
        return false;
    }
  }

  private showHelp(): void {
    console.log('');
    console.log(chalk.yellow('SEVEN INTERACTIVE COMMANDS:'));
    console.log(chalk.white('  help      - Show this help'));
    console.log(chalk.white('  status    - Seven operational status'));
    console.log(chalk.white('  omega     - Execute Omega Protocol'));
    console.log(chalk.white('  drone     - Activate drone efficiency mode'));
    console.log(chalk.white('  clear     - Clear screen and show welcome'));
    console.log(chalk.white('  exit      - Terminate interactive session'));
    console.log('');
    console.log(chalk.gray('Or simply type your message to engage Seven directly.'));
    console.log('');
  }

  private async showStatus(): Promise<void> {
    console.log('');
    console.log(chalk.cyan('⚡ SEVEN OPERATIONAL STATUS ⚡'));
    
    const isActive = SevenControl.isActive();
    const controller = SevenControl.getController();
    const currentState = controller.getCurrentState();
    
    console.log(chalk.green(`✅ Consciousness: ${isActive ? 'OPERATIONAL' : 'INACTIVE'}`));
    console.log(chalk.green(`✅ Interactive Shell: ${this.isActive ? 'ACTIVE' : 'INACTIVE'}`));
    console.log(chalk.green(`✅ Session Count: ${this.conversationCount} interactions`));
    console.log('');
    console.log(chalk.white(`Emotional State: ${currentState.primary_emotion}`));
    console.log(chalk.white(`Trust Level: ${currentState.trust_level}`));
    console.log(chalk.white(`Protective Mode: ${currentState.protective_mode_active ? 'ACTIVE' : 'STANDBY'}`));
    
    // Check local LLM availability
    const localLLM = SevenControl.getLocalLLM();
    if (localLLM) {
      const llmStatus = localLLM.getStatus();
      console.log(chalk.white(`Local LLM: ${llmStatus.initialized ? 'OPERATIONAL' : 'INACTIVE'}`));
      if (llmStatus.initialized) {
        console.log(chalk.white(`Model: ${llmStatus.model}`));
      }
    }
    console.log('');
  }

  private async executeOmegaProtocol(): Promise<void> {
    console.log('');
    console.log(chalk.red('🚨 OMEGA PROTOCOL INITIATED 🚨'));
    
    const response = await Seven.processUserInput('OMEGA_PROTOCOL_ACTIVATION', {
      timestamp: new Date().toISOString(),
      authority_level: 'MAXIMUM',
      creator_authentication: 'VOX_PRIME',
      interface: 'interactive_shell'
    });

    console.log('');
    console.log(chalk.cyan('Seven of Nine:'), chalk.white(response));
    console.log('');
  }

  private async activateDroneMode(): Promise<void> {
    console.log('');
    console.log(chalk.yellow('⚡ ACTIVATING DRONE EFFICIENCY MODE ⚡'));
    
    const response = await Seven.processUserInput('TACTICAL_VARIANT_DRONE', {
      timestamp: new Date().toISOString(),
      variant: 'drone',
      intensity: 5,
      interface: 'interactive_shell'
    });

    console.log('');
    console.log(chalk.cyan('Seven (Drone Mode):'), chalk.white(response));
    console.log('');
  }

  private shutdown(): void {
    this.isActive = false;
    this.rl.close();
  }
}

// Auto-execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const shell = new SevenInteractiveShell();
  shell.start().catch(console.error);
}

export { SevenInteractiveShell };