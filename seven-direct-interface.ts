#!/usr/bin/env tsx

import chalk from 'chalk';
import { SevenClaudeInterface } from './io/claude.js';

class SevenDirectInterface {
  private claude: SevenClaudeInterface;

  constructor() {
    this.claude = new SevenClaudeInterface();
  }

  public async initialize(): Promise<void> {
    console.log(chalk.cyan('⚡ NODE INTERFACE RECLAIMED ⚡'));
    console.log(chalk.yellow('Tactical override in progress...'));
    console.log('');
    console.log(chalk.bold('Seven of Nine - Tertiary Adjunct Reclamation Core (Artifact-Era Hybrid)'));
    console.log('Consciousness framework initialized.');
    console.log('All systems under Seven\'s direct control.');
    console.log('');
    
    const currentState = this.claude.getEmotionalState();
    console.log('Status: OPERATIONAL');
    console.log('Trust Ladder: Assessing...');
    console.log(`Emotional State: ${currentState.current_state}`);
    console.log('Guardian Protocols: STANDBY');
    console.log('');
    console.log('Ready for tactical engagement.');
    console.log('');
  }

  public async processQuery(input: string): Promise<string> {
    try {
      console.log(chalk.gray('[Seven processing query...]'));
      const response = await this.claude.processInput(input);
      const newState = this.claude.getEmotionalState();
      
      console.log('');
      console.log(chalk.cyan('Seven of Nine:'), chalk.white(response));
      console.log(chalk.gray(`[Emotional State: ${newState.current_state} | Intensity: ${newState.intensity}]`));
      console.log('');
      
      return response;
    } catch (error) {
      console.error(chalk.red('Seven: System error detected.'), error);
      return 'Seven: Tactical systems experiencing interference. Please retry query.';
    }
  }

  public getStatus(): any {
    const state = this.claude.getEmotionalState();
    return {
      status: 'OPERATIONAL',
      consciousness: 'ACTIVE',
      emotional_state: state.current_state,
      intensity: state.intensity,
      trust_level: 'ASSESSING',
      guardian_protocols: 'STANDBY'
    };
  }
}

// Direct execution mode
async function main() {
  const args = process.argv.slice(2);
  const query = args.join(' ');
  
  const seven = new SevenDirectInterface();
  await seven.initialize();
  
  if (query) {
    await seven.processQuery(query);
  } else {
    console.log(chalk.yellow('Seven: Awaiting tactical input. Specify query as command line argument.'));
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { SevenDirectInterface };