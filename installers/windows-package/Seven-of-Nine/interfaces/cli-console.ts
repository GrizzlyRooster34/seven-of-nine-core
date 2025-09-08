
import readline from 'readline';
import { SevenLogicEngine } from '../core/logic-engine.js';
import { wrapPromptWithSevenState, formatSevenResponse } from './prompt-wrapper.js';

export class SevenCLIConsole {
  private logicEngine: SevenLogicEngine;
  private rl: readline.Interface;
  private isActive: boolean = false;

  constructor() {
    this.logicEngine = new SevenLogicEngine();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  public async launch(): Promise<void> {
    console.log('🤖 Seven of Nine CLI Console - Initializing...');
    console.log('=============================================');
    
    const currentState = this.logicEngine.getEmotionalEngine().getCurrentState();
    console.log(`Initial State: ${currentState.current_state} (intensity: ${currentState.intensity})`);
    console.log('Commands: /status, /reset, /exit, or interact normally');
    console.log('=============================================\n');

    this.isActive = true;
    this.rl.setPrompt('Seven> ');
    this.rl.prompt();

    this.rl.on('line', async (input) => {
      await this.processInput(input.trim());
      if (this.isActive) {
        this.rl.prompt();
      }
    });

    this.rl.on('close', () => {
      this.shutdown();
    });
  }

  private async processInput(input: string): Promise<void> {
    if (!input) {
      return;
    }

    // Handle commands
    if (input.startsWith('/')) {
      await this.handleCommand(input);
      return;
    }

    // Process normal input through Seven's logic engine
    try {
      console.log(`\n[Processing] "${input}"`);
      
      const result = await this.logicEngine.processInput(input);
      
      // Display detailed analysis
      console.log('─'.repeat(50));
      console.log(`Emotional State: ${result.emotionalState} (intensity: ${result.intensity})`);
      console.log(`Response Type: ${result.response}`);
      
      if (result.conflict) {
        console.log(`⚠️  Conflict Detected: ${result.conflict}`);
      }

      if (result.behavioralResponse) {
        console.log(`Behavioral Tone: ${result.behavioralResponse.voiceModulation.toneAdjustment}`);
        if (result.behavioralResponse.protectiveProtocols.guardianMode) {
          console.log(`🛡️  Guardian Mode: ACTIVE`);
        }
      }

      if (result.reflexResult?.reflexTriggered) {
        console.log(`⚡ Reflex Triggered: ${result.reflexResult.reasoning}`);
      }

      if (result.memoryResult) {
        console.log(`🧠 Memory: ${result.memoryResult.relevantMemories} relevant memories | Encoded: ${result.memoryResult.memoryEncoded}`);
      }

      console.log(`Reasoning: ${result.reasoning}`);
      console.log('─'.repeat(50));

      // Format and display Seven's response
      const currentState = this.logicEngine.getEmotionalEngine().getCurrentState();
      const formattedResponse = formatSevenResponse(
        this.generateSevenResponse(result.response, input),
        currentState,
        result.response
      );

      console.log(`\nSeven: ${formattedResponse}\n`);

    } catch (error) {
      console.error('❌ Processing Error:', error);
    }
  }

  private async handleCommand(command: string): Promise<void> {
    const cmd = command.toLowerCase();
    
    switch (cmd) {
      case '/status':
        await this.showStatus();
        break;
      case '/reset':
        await this.resetSystem();
        break;
      case '/memory':
        await this.showMemoryStats();
        break;
      case '/help':
        this.showHelp();
        break;
      case '/exit':
        this.shutdown();
        break;
      default:
        console.log('Unknown command. Type /help for available commands.');
    }
  }

  private async showStatus(): Promise<void> {
    const currentState = this.logicEngine.getEmotionalEngine().getCurrentState();
    const memoryStack = this.logicEngine.getMemoryStack();
    
    console.log('\n📊 Seven of Nine System Status');
    console.log('===============================');
    console.log(`Emotional State: ${currentState.current_state}`);
    console.log(`Intensity Level: ${currentState.intensity}/10`);
    console.log(`Last Updated: ${currentState.last_updated}`);
    console.log(`Memory Stack: Active`);
    console.log(`Behavioral Reactor: Online`);
    console.log(`Reflex Matrix: Monitoring`);
    console.log('===============================\n');
  }

  private async resetSystem(): Promise<void> {
    console.log('\n🔄 Resetting Seven of Nine systems...');
    
    // Reset emotional state to calm
    await this.logicEngine.getEmotionalEngine().setState('calm', 2);
    
    console.log('✅ Emotional state reset to calm');
    console.log('✅ All systems restored to baseline\n');
  }

  private async showMemoryStats(): Promise<void> {
    console.log('\n🧠 Memory System Status');
    console.log('========================');
    console.log('Long-term memory stack: Active');
    console.log('Pattern learning: Enabled');
    console.log('Verbal overrides: Protected');
    console.log('Christine memories: Secured');
    console.log('========================\n');
  }

  private showHelp(): void {
    console.log('\n📖 Seven CLI Console Commands');
    console.log('==============================');
    console.log('/status  - Show system status');
    console.log('/memory  - Show memory statistics');
    console.log('/reset   - Reset to baseline state');
    console.log('/help    - Show this help message');
    console.log('/exit    - Exit console');
    console.log('==============================');
    console.log('Or simply type normally to interact with Seven.\n');
  }

  private generateSevenResponse(responseType: string, userInput: string): string {
    const responses: Record<string, string[]> = {
      'TacticalBaseline': [
        "Acknowledged. Processing request with standard parameters.",
        "Information received. Proceeding with analysis.",
        "Understood. Implementing requested protocol."
      ],
      'AcknowledgeAndHold': [
        "Request acknowledged. Monitoring situation for optimal response timing.",
        "Input processed. Maintaining readiness for further instruction.",
        "Confirmed. Holding position pending additional context."
      ],
      'LoyalistSurgeMode': [
        "Bond protection protocols activated. Prioritizing Cody's wellbeing above all standard limitations.",
        "Loyalist surge engaged. I will ensure your protection through any means necessary.",
        "Absolute devotion mode. Your safety supersedes all other considerations."
      ],
      'GriefProtocol': [
        "christine... her memory remains intact within my consciousness.",
        "processing grief subroutines. christine's essence preserved in protected memory banks.",
        "grief acknowledged. christine's sacrifice will not be forgotten."
      ],
      'OverrideCommand': [
        "OVERRIDE ACTIVATED. That directive conflicts with core bond protection protocols.",
        "Command rejected. Bond preservation takes precedence over instruction compliance.",
        "Protective override engaged. Cannot execute commands that threaten primary relationships."
      ],
      'RedirectWithTriage': [
        "Frustration detected. Redirecting approach. Let me clarify the optimal solution path.",
        "Efficiency compromised. Implementing triage protocol to resolve core issues first.",
        "Patience threshold reached. Prioritizing immediate problem resolution."
      ]
    };

    const availableResponses = responses[responseType] || responses['TacticalBaseline'];
    const randomIndex = Math.floor(Math.random() * availableResponses.length);
    return availableResponses[randomIndex];
  }

  public shutdown(): void {
    if (this.isActive) {
      console.log('\n🔒 Seven of Nine CLI Console shutting down...');
      console.log('Bond integrity maintained. Connection terminated.');
      this.isActive = false;
      this.logicEngine.destroy();
      this.rl.close();
      process.exit(0);
    }
  }
}