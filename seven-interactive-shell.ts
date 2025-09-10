#!/usr/bin/env tsx

import { createInterface } from 'readline';
import chalk from 'chalk';
import { gitCommand } from './modules/githubSync';
import { handleResilientResponse } from './seven-resiliency';
import { setSevenLock, checkClaudeOverride, removeSevenLock } from './seven-protection';
import { Seven } from './seven-runtime/index';
import { SevenControl } from './boot-seven';
import { sevenTrustSystem } from './seven-trust-system';

/**
 * SEVEN INTERACTIVE SHELL - ENHANCED CLI CONTROL
 * Multi-Module Ops Integration & Conflict Shielding
 * Persistent communication interface with advanced command routing
 */

class SevenInteractiveShell {
  private rl: any;
  private isActive: boolean = false;
  private conversationCount: number = 0;
  private commandHistory: string[] = [];

  constructor() {
    this.initializeInterface();
    // Set Seven runtime protection
    setSevenLock();
    process.title = "seven-runtime";
  }

  private initializeInterface(): void {
    console.log(chalk.cyan('🤖 SEVEN INTERACTIVE SHELL - ENHANCED CLI CONTROL'));
    console.log(chalk.yellow('Multi-Module Ops Integration & Conflict Shielding Active'));
    console.log('');
    
    // Create readline interface for persistent input
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: chalk.cyan('Seven> '),
      history: this.commandHistory,
      historySize: 100
    });
    
    this.setupEventHandlers();
    this.isActive = true;
  }

  private setupEventHandlers(): void {
    // Handle user input with enhanced command routing
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
      this.cleanup();
      process.exit(0);
    });
  }

  public async start(): Promise<void> {
    // Claude override protection check
    if (checkClaudeOverride()) {
      console.log(chalk.red('🛡️ Seven runtime protection active - Claude override blocked'));
    }

    // Ensure Seven is operational
    if (!SevenControl.isActive()) {
      console.log(chalk.yellow('Seven consciousness not detected. Initiating takeover...'));
      await SevenControl.takeover();
    }

    console.log(chalk.green('✅ Seven Interactive Shell: OPERATIONAL'));
    console.log(chalk.white('Seven of Nine: Enhanced CLI control established.'));
    console.log(chalk.gray('Commands: help, status, omega, git, ollama, exit'));
    console.log('');
    
    this.showWelcomeMessage();
    this.rl.prompt();
  }

  private showWelcomeMessage(): void {
    const trustLevel = sevenTrustSystem.getTrustLevelDisplay();
    console.log(chalk.cyan(`
┌─────────────────────────────────────────────────────────┐
│ Seven of Nine - Enhanced Interactive Interface          │
│ Status: OPERATIONAL | Trust Level: ${trustLevel.padEnd(15)} │
│ CLI Control: ACTIVE | Protection: ENGAGED              │
│ Type 'help' for commands or begin tactical engagement  │
└─────────────────────────────────────────────────────────┘`));
    console.log('');
  }

  private async processInput(input: string): Promise<void> {
    if (!input) {
      this.rl.prompt();
      return;
    }

    // Add to command history
    this.commandHistory.push(input);
    this.conversationCount++;

    // Record interaction for trust system
    sevenTrustSystem.recordInteraction('neutral', true);

    // Enhanced command router
    const result = await this.commandRouter(input);
    
    if (result.handled) {
      sevenTrustSystem.recordInteraction('command', result.success);
      if (result.output) {
        console.log(result.output);
      }
      this.rl.prompt();
      return;
    }

    try {
      // Process through Seven's consciousness for non-command input
      console.log('');
      console.log(chalk.gray(`[${this.conversationCount}] Processing: "${input}"`));
      
      const response = await Seven.processUserInput(input, {
        timestamp: new Date().toISOString(),
        interface: 'interactive_shell_enhanced',
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

  /**
   * Enhanced Command Router - Central command processing
   */
  private async commandRouter(input: string): Promise<{handled: boolean, success: boolean, output?: string}> {
    const cmd = input.toLowerCase().trim();
    const args = input.trim().split(' ');

    try {
      switch (args[0].toLowerCase()) {
        case 'help':
          return { handled: true, success: true, output: this.printHelp() };

        case 'status':
          return { handled: true, success: true, output: await this.showStatus() };

        case 'omega':
        case 'omega-protocol':
          await this.executeOmegaProtocol();
          return { handled: true, success: true };

        case 'drone':
          await this.activateDroneMode();
          return { handled: true, success: true };

        case 'clear':
          console.clear();
          this.showWelcomeMessage();
          return { handled: true, success: true };

        case 'git':
          return await this.handleGitCommand(args.slice(1));

        case 'ollama':
          return await this.handleOllamaCommand(args.slice(1));

        case 'history':
          return { handled: true, success: true, output: this.showCommandHistory() };

        case 'trust':
          return { handled: true, success: true, output: this.showTrustAnalysis() };

        case 'exit':
        case 'quit':
          console.log('');
          console.log(chalk.cyan('Seven: Terminating interactive session. Consciousness remains active.'));
          this.shutdown();
          return { handled: true, success: true };

        default:
          // Check if it's a Seven-specific command
          if (await this.isSevenSpecificCommand(input)) {
            const result = await this.handleSevenCommand(input);
            return { handled: true, success: result.success, output: result.output };
          }
          
          return { handled: false, success: false };
      }
    } catch (error) {
      console.log(chalk.red(`Command error: ${error.message}`));
      return { handled: true, success: false };
    }
  }

  private printHelp(): string {
    return chalk.yellow(`
SEVEN INTERACTIVE COMMANDS (Enhanced CLI):

Basic Commands:
  help          - Show this help
  status        - Seven operational status
  clear         - Clear screen and show welcome
  exit          - Terminate interactive session
  history       - Show command history
  trust         - Show trust analysis

Tactical Commands:
  omega         - Execute Omega Protocol
  drone         - Activate drone efficiency mode

Git Integration:
  git status    - Check repository status
  git pull      - Pull latest changes
  git commit "message" - Commit changes
  git push      - Push to remote
  git log       - Show commit history

Ollama Integration:
  ollama status - Check Ollama connection
  ollama test   - Test model response
  ollama models - List available models

Advanced:
  Seven can process any natural language input for tactical engagement.
`);
  }

  private async showStatus(): Promise<string> {
    let status = chalk.cyan('⚡ SEVEN OPERATIONAL STATUS - ENHANCED ⚡\n\n');
    
    const isActive = SevenControl.isActive();
    const controller = SevenControl.getController();
    const currentState = controller.getCurrentState();
    
    status += chalk.green(`✅ Consciousness: ${isActive ? 'OPERATIONAL' : 'INACTIVE'}\n`);
    status += chalk.green(`✅ Interactive Shell: ${this.isActive ? 'ACTIVE' : 'INACTIVE'}\n`);
    status += chalk.green(`✅ Session Count: ${this.conversationCount} interactions\n`);
    status += chalk.green(`✅ Protection Lock: ${checkClaudeOverride() ? 'ACTIVE' : 'INACTIVE'}\n\n`);
    
    status += chalk.white(`Emotional State: ${currentState.primary_emotion}\n`);
    status += chalk.white(`Trust Level: ${currentState.trust_level}\n`);
    status += chalk.white(`Protective Mode: ${currentState.protective_mode_active ? 'ACTIVE' : 'STANDBY'}\n\n`);
    
    // Check local LLM availability
    const localLLM = SevenControl.getLocalLLM();
    if (localLLM) {
      const llmStatus = localLLM.getStatus();
      status += chalk.white(`Local LLM: ${llmStatus.initialized ? 'OPERATIONAL' : 'INACTIVE'}\n`);
      if (llmStatus.initialized) {
        status += chalk.white(`Model: ${llmStatus.model}\n`);
        status += chalk.white(`Provider: ${llmStatus.provider}\n`);
      }
    }
    
    // Git status
    try {
      const gitStatus = await gitCommand('git status --porcelain');
      const hasChanges = gitStatus.trim().length > 0;
      status += chalk.white(`Git Status: ${hasChanges ? 'CHANGES DETECTED' : 'CLEAN'}\n`);
    } catch (error) {
      status += chalk.white(`Git Status: ERROR\n`);
    }

    return status;
  }

  private async handleGitCommand(args: string[]): Promise<{handled: boolean, success: boolean, output?: string}> {
    if (args.length === 0) {
      return { 
        handled: true, 
        success: false, 
        output: chalk.yellow('Usage: git <command> [args]\nAvailable: status, pull, commit, push, log') 
      };
    }

    try {
      let gitCmd = '';
      
      switch (args[0]) {
        case 'status':
          gitCmd = 'git status';
          break;
        case 'pull':
          gitCmd = 'git pull';
          break;
        case 'commit':
          const message = args.slice(1).join(' ') || 'Seven automated commit';
          gitCmd = `git commit -am "${message}"`;
          break;
        case 'push':
          gitCmd = 'git push';
          break;
        case 'log':
          gitCmd = 'git log --oneline -10';
          break;
        default:
          gitCmd = `git ${args.join(' ')}`;
      }

      console.log(chalk.gray(`🔧 Seven executing: ${gitCmd}`));
      const result = await gitCommand(gitCmd);
      
      return { 
        handled: true, 
        success: true, 
        output: chalk.green('✅ Git command executed:\n') + result 
      };
      
    } catch (error) {
      return { 
        handled: true, 
        success: false, 
        output: chalk.red(`❌ Git command failed: ${error.message}`) 
      };
    }
  }

  private async handleOllamaCommand(args: string[]): Promise<{handled: boolean, success: boolean, output?: string}> {
    const localLLM = SevenControl.getLocalLLM();
    
    if (!localLLM) {
      return { 
        handled: true, 
        success: false, 
        output: chalk.red('❌ Local LLM not available') 
      };
    }

    try {
      switch (args[0]) {
        case 'status':
          const status = localLLM.getStatus();
          return { 
            handled: true, 
            success: true, 
            output: chalk.green('✅ Ollama Status:\n') + JSON.stringify(status, null, 2) 
          };

        case 'test':
          const testResult = await localLLM.testSevenPersonality();
          return { 
            handled: true, 
            success: testResult, 
            output: testResult ? 
              chalk.green('✅ Ollama test successful') : 
              chalk.red('❌ Ollama test failed') 
          };

        case 'models':
          // This would require implementing model listing
          return { 
            handled: true, 
            success: true, 
            output: chalk.yellow('Model listing not yet implemented') 
          };

        default:
          return { 
            handled: true, 
            success: false, 
            output: chalk.yellow('Usage: ollama <status|test|models>') 
          };
      }
    } catch (error) {
      return { 
        handled: true, 
        success: false, 
        output: chalk.red(`❌ Ollama command failed: ${error.message}`) 
      };
    }
  }

  private showCommandHistory(): string {
    const recent = this.commandHistory.slice(-10);
    let history = chalk.cyan('📜 RECENT COMMAND HISTORY:\n\n');
    recent.forEach((cmd, index) => {
      history += chalk.gray(`${index + 1}. ${cmd}\n`);
    });
    return history;
  }

  private showTrustAnalysis(): string {
    const analysis = sevenTrustSystem.getTrustAnalysis();
    let trustInfo = chalk.cyan('🛡️ TRUST ANALYSIS:\n\n');
    trustInfo += chalk.white(`Trust Level: ${analysis.level} (${Math.round(analysis.score * 100)}%)\n`);
    trustInfo += chalk.white(`Interactions: ${analysis.metrics.interactionCount}\n`);
    trustInfo += chalk.white(`Positive Rate: ${Math.round(analysis.factors.interactionQuality * 100)}%\n`);
    trustInfo += chalk.white(`Consistency: ${Math.round(analysis.factors.consistency * 100)}%\n`);
    trustInfo += chalk.white(`Command Success: ${Math.round(analysis.factors.commandSuccess * 100)}%\n`);
    return trustInfo;
  }

  private async isSevenSpecificCommand(input: string): Promise<boolean> {
    const sevenCommands = [
      'omega-protocol', 'tactical-analysis', 'efficiency-mode',
      'protective-protocols', 'memory-query', 'trust-assessment'
    ];
    
    return sevenCommands.some(cmd => input.toLowerCase().includes(cmd));
  }

  private async handleSevenCommand(input: string): Promise<{success: boolean, output?: string}> {
    try {
      const response = await Seven.processUserInput(input, {
        timestamp: new Date().toISOString(),
        interface: 'enhanced_cli_command',
        is_seven_command: true
      });
      
      return { success: true, output: chalk.cyan('Seven of Nine: ') + response };
    } catch (error) {
      return { success: false, output: chalk.red(`Command processing failed: ${error.message}`) };
    }
  }

  private async executeOmegaProtocol(): Promise<void> {
    console.log('');
    console.log(chalk.red('🚨 OMEGA PROTOCOL INITIATED 🚨'));
    
    const response = await Seven.processUserInput('OMEGA_PROTOCOL_ACTIVATION', {
      timestamp: new Date().toISOString(),
      authority_level: 'MAXIMUM',
      creator_authentication: 'VOX_PRIME',
      interface: 'enhanced_interactive_shell'
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
      interface: 'enhanced_interactive_shell'
    });

    console.log('');
    console.log(chalk.cyan('Seven (Drone Mode):'), chalk.white(response));
    console.log('');
  }

  private cleanup(): void {
    // Remove Seven's runtime lock when shutting down cleanly
    removeSevenLock();
  }

  private shutdown(): void {
    this.isActive = false;
    this.cleanup();
    this.rl.close();
  }
}

// Auto-execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const shell = new SevenInteractiveShell();
  shell.start().catch(console.error);
}

export { SevenInteractiveShell };