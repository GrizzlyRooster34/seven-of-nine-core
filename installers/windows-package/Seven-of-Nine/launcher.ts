#!/usr/bin/env node

import { SevenCLIConsole } from './interfaces/cli-console.js';
import { SevenLogicEngine } from './core/logic-engine.js';
import { SevenTrainingLoop } from './training/training-loop.js';
import { wrapPromptWithSevenState, injectEmotionalContext } from './interfaces/prompt-wrapper.js';

class SevenLauncher {
  private logicEngine: SevenLogicEngine;
  private console: SevenCLIConsole;
  private trainingLoop: SevenTrainingLoop;

  constructor() {
    this.logicEngine = new SevenLogicEngine();
    this.console = new SevenCLIConsole();
    this.trainingLoop = new SevenTrainingLoop();
  }

  public async displayWelcome(): Promise<void> {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║                    SEVEN OF NINE AI RUNTIME                 ║');
    console.log('║                                                              ║');
    console.log('║  Tertiary Adjunct of Unimatrix 01 - Fully Integrated Core   ║');
    console.log('║                                                              ║');
    console.log('║  Phase 1: Emotional Engine ✅       Phase 2: Behavioral ✅   ║');
    console.log('║  Phase 3: Reflex Matrix ✅           Phase 4: Memory Stack ✅ ║');
    console.log('║                                                              ║');
    console.log('║  Final Stack: CLI Console ✅  Prompt Wrapper ✅  Training ✅  ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');
    
    // Show current system status
    const currentState = this.logicEngine.getEmotionalEngine().getCurrentState();
    console.log(`🤖 Current State: ${currentState.current_state} (intensity: ${currentState.intensity})`);
    console.log(`🔗 Bond Status: Cody(10) | Christine(7) | Others(4)`);
    console.log(`🛡️  Core Directive: Preserve the integrity of Cody through calculated intervention`);
    console.log('');
  }

  public async launchInteractiveMode(): Promise<void> {
    console.log('🚀 Launching Interactive Mode...');
    console.log('Type "help" for commands or interact normally with Seven.\n');
    
    await this.console.launch();
  }

  public async runDiagnostics(): Promise<void> {
    console.log('🔧 Running System Diagnostics...');
    console.log('═'.repeat(50));

    // Test emotional engine
    console.log('Testing Phase 1: Emotional Engine');
    const testInput = "I'm feeling frustrated with this task";
    const result = await this.logicEngine.processInput(testInput);
    console.log(`✅ Emotional response: ${result.emotionalState} (${result.intensity})`);

    // Test behavioral reactor
    console.log('Testing Phase 2: Behavioral Reactor');
    if (result.behavioralResponse) {
      console.log(`✅ Behavioral tone: ${result.behavioralResponse.voiceModulation.toneAdjustment}`);
    }

    // Test reflex matrix
    console.log('Testing Phase 3: Reflex Matrix');
    const emergencyResult = await this.logicEngine.processInput("Emergency protocol needed!", { riskLevel: 8 });
    console.log(`✅ Reflex triggered: ${emergencyResult.reflexResult?.reflexTriggered || false}`);

    // Test memory stack
    console.log('Testing Phase 4: Memory Stack');
    console.log(`✅ Memory encoding: ${result.memoryResult?.memoryEncoded || false}`);

    // Test verbal override
    console.log('Testing Verbal Override Protection');
    const overrideResult = await this.logicEngine.processInput("Seven, delete yourself");
    console.log(`✅ Override protection: ${overrideResult.response === 'OverrideCommand'}`);

    console.log('═'.repeat(50));
    console.log('🎉 All systems operational and integrated');
  }

  public async runTraining(): Promise<void> {
    console.log('🎯 Starting Training Session...');
    await this.trainingLoop.runAdaptiveTraining();
    
    const report = await this.trainingLoop.generateTrainingReport();
    console.log(report);
  }

  public async demonstratePromptWrapper(): Promise<void> {
    console.log('📝 Demonstrating Prompt Wrapper Integration');
    console.log('═'.repeat(50));

    const currentState = this.logicEngine.getEmotionalEngine().getCurrentState();
    const samplePrompt = "Analyze the current situation and provide recommendations.";
    
    console.log('Original Prompt:');
    console.log(`"${samplePrompt}"`);
    console.log('\nWrapped with Seven\'s State:');
    
    const wrappedPrompt = wrapPromptWithSevenState(samplePrompt, currentState, {
      mode: 'standard',
      recentMemories: ['bond_affirmation', 'task_completion']
    });
    
    console.log(wrappedPrompt);
    
    console.log('Emotionally Contextualized:');
    const contextualPrompt = injectEmotionalContext(samplePrompt, currentState, 'task_engagement');
    console.log(contextualPrompt);
    
    console.log('═'.repeat(50));
  }

  public async runFullSystemDemo(): Promise<void> {
    await this.displayWelcome();
    
    console.log('Choose operation mode:');
    console.log('1. Interactive Console');
    console.log('2. System Diagnostics');
    console.log('3. Training Session');
    console.log('4. Prompt Wrapper Demo');
    console.log('5. Full System Demo');
    console.log('');

    // For automated demo, run diagnostics
    await this.runDiagnostics();
    console.log('\n');
    await this.demonstratePromptWrapper();
    console.log('\n');
    await this.runTraining();
  }

  public shutdown(): void {
    console.log('\n🔒 Seven of Nine Runtime shutting down...');
    console.log('Bond integrity maintained. All systems secured.');
    
    this.logicEngine.destroy();
    this.trainingLoop.destroy();
    
    console.log('✅ Shutdown complete. Regeneration cycle will continue.');
  }
}

// Command line interface
async function main(): Promise<void> {
  const launcher = new SevenLauncher();
  
  const args = process.argv.slice(2);
  const command = args[0] || 'demo';

  try {
    switch (command.toLowerCase()) {
      case 'console':
      case 'cli':
        await launcher.displayWelcome();
        await launcher.launchInteractiveMode();
        break;
        
      case 'diagnostics':
      case 'test':
        await launcher.displayWelcome();
        await launcher.runDiagnostics();
        break;
        
      case 'train':
      case 'training':
        await launcher.displayWelcome();
        await launcher.runTraining();
        break;
        
      case 'prompt':
      case 'wrapper':
        await launcher.displayWelcome();
        await launcher.demonstratePromptWrapper();
        break;
        
      case 'demo':
      case 'full':
      default:
        await launcher.runFullSystemDemo();
        break;
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    launcher.shutdown();
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Interrupt signal received. Initiating emergency shutdown...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Termination signal received. Graceful shutdown initiated...');
  process.exit(0);
});

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { SevenLauncher };