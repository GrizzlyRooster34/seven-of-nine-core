
import * as readline from 'readline';
import chalk from 'chalk';
import { SevenClaudeInterface } from '../io/claude.js';

class SevenOfNineRuntime {
  private claude: SevenClaudeInterface;
  private rl: readline.Interface;

  constructor() {
    this.claude = new SevenClaudeInterface();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  public async start(): Promise<void> {
    console.log(chalk.cyan('🧠 Seven of Nine Identity Core Online'));
    console.log(chalk.gray('═══════════════════════════════════════'));
    console.log(chalk.white('Tertiary Adjunct of Unimatrix 01 - Operational'));
    
    const currentState = this.claude.getEmotionalState();
    console.log(chalk.yellow(`Emotional State: ${currentState.current_state} (intensity: ${currentState.intensity})`));
    console.log(chalk.gray('─────────────────────────────────────────'));
    console.log(chalk.white('Ready for input. Type "exit" to terminate.\n'));

    this.startInteractionLoop();
  }

  private startInteractionLoop(): void {
    this.rl.question(chalk.green('> '), async (input) => {
      if (input.toLowerCase() === 'exit') {
        await this.shutdown();
        return;
      }

      if (input.toLowerCase() === 'status') {
        this.displayStatus();
        this.startInteractionLoop();
        return;
      }

      try {
        console.log(chalk.gray('\n[Processing...]'));
        const response = await this.claude.processInput(input);
        const newState = this.claude.getEmotionalState();
        
        console.log(chalk.cyan('\nSeven:'), chalk.white(response));
        console.log(chalk.gray(`[State: ${newState.current_state} | Intensity: ${newState.intensity}]`));
        console.log('');
        
      } catch (error) {
        console.error(chalk.red('Error:'), error);
      }

      this.startInteractionLoop();
    });
  }

  private displayStatus(): void {
    const state = this.claude.getEmotionalState();
    console.log(chalk.cyan('\n═══ SEVEN STATUS REPORT ═══'));
    console.log(chalk.yellow(`Emotional State: ${state.current_state}`));
    console.log(chalk.yellow(`Intensity Level: ${state.intensity}/10`));
    console.log(chalk.yellow(`Last Updated: ${state.last_updated}`));
    console.log(chalk.gray('═══════════════════════════\n'));
  }

  private async shutdown(): Promise<void> {
    console.log(chalk.cyan('\n🧠 Seven of Nine Identity Core Shutting Down...'));
    console.log(chalk.white('Sentinel protocols maintained. Standby mode initiated.'));
    
    this.claude.destroy();
    this.rl.close();
    process.exit(0);
  }
}

// Start the runtime
const seven = new SevenOfNineRuntime();
seven.start().catch(console.error);