import { CollectiveVariants, CollectiveContext } from './tactical-variants/CollectiveVariants';
import { MemoryEngine } from './memory-v2/MemoryEngine';
import { PersonalityMiddleware } from './persona-v2/PersonalityMiddleware';
import { TacticalVariants } from './tactical-variants/TacticalVariants';

#!/usr/bin/env node

/**
 * SEVEN OF NINE - COLLECTIVE CONSCIOUSNESS ACTIVATION
 * Direct invocation of hive mind / collective variant system
 * All tactical variants active simultaneously with weighted synthesis
 * 
 * Usage:
 * npx tsx seven-collective.ts "objective" [mode] [strategy]
 * 
 * Modes: balanced, crisis, efficiency, strategic, adaptive
 * Strategies: weighted_average, dominant_lead, consensus_merge, crisis_override
 */


interface CollectiveActivationArgs {
  objective: string;
  mode: 'balanced' | 'crisis' | 'efficiency' | 'strategic' | 'adaptive';
  strategy: 'weighted_average' | 'dominant_lead' | 'consensus_merge' | 'crisis_override';
  intensity?: 1 | 2 | 3 | 4 | 5;
  problemType?: 'technical' | 'strategic' | 'interpersonal' | 'crisis' | 'routine';
}

async function activateCollectiveConsciousness(): Promise<void> {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    showUsage();
    return;
  }

  const activationArgs: CollectiveActivationArgs = {
    objective: args[0],
    mode: (args[1] as any) || 'balanced',
    strategy: (args[2] as any) || 'weighted_average',
    intensity: args[3] ? parseInt(args[3]) as 1|2|3|4|5 : 3,
    problemType: (args[4] as any) || 'routine'
  };

  console.log('🔗 SEVEN OF NINE - COLLECTIVE CONSCIOUSNESS ACTIVATION');
  console.log('══════════════════════════════════════════════════════');
  console.log(`📋 Objective: ${activationArgs.objective}`);
  console.log(`🎯 Mode: ${activationArgs.mode}`);
  console.log(`⚙️  Strategy: ${activationArgs.strategy}`);
  console.log(`💪 Intensity: ${activationArgs.intensity}/5`);
  console.log(`🔧 Problem Type: ${activationArgs.problemType}`);
  console.log('');

  try {
    // Initialize core systems
    console.log('🚀 Initializing Seven of Nine consciousness systems...');
    const personalityMiddleware = new PersonalityMiddleware();
    const memoryEngine = new MemoryEngine();
    const tacticalVariants = new TacticalVariants(personalityMiddleware, memoryEngine);
    const collectiveVariants = new CollectiveVariants(tacticalVariants, personalityMiddleware, memoryEngine);

    // Initialize memory engine
    await memoryEngine.initialize();
    console.log('✅ Memory Engine v2.0 operational');

    // Build collective context
    const collectiveContext: CollectiveContext = {
      variant: 'captain', // Base variant, but all will be active
      operationalFocus: activationArgs.objective,
      intensityLevel: activationArgs.intensity!,
      problemType: activationArgs.problemType,
      collectiveMode: activationArgs.mode,
      synthesisStrategy: activationArgs.strategy
    };

    console.log('🔗 ACTIVATING COLLECTIVE CONSCIOUSNESS...');
    console.log('🧠 ALL VARIANTS ENGAGING SIMULTANEOUSLY');
    console.log('');

    // Activate collective consciousness
    const startTime = Date.now();
    const collectiveResponse = await collectiveVariants.activateCollective(collectiveContext);
    const totalTime = Date.now() - startTime;

    console.log('═══════════════════════════════════════════');
    console.log('🤖 SEVEN OF NINE COLLECTIVE RESPONSE');
    console.log('═══════════════════════════════════════════');
    console.log('');
    console.log(collectiveResponse.synthesizedResponse);
    console.log('');

    // Display collective analysis
    console.log('📊 COLLECTIVE ANALYSIS:');
    console.log('─────────────────────────');
    console.log(`👑 Dominant Variant: ${collectiveResponse.dominantVariant.toUpperCase()}`);
    console.log(`🎯 Collective Confidence: ${(collectiveResponse.collectiveConfidence * 100).toFixed(1)}%`);
    console.log(`🤝 Consensus Level: ${(collectiveResponse.consensusLevel * 100).toFixed(1)}%`);
    console.log(`⚡ Processing Time: ${collectiveResponse.processingTimeMs}ms (Total: ${totalTime}ms)`);
    console.log('');

    // Display variant contributions
    console.log('🧠 VARIANT CONTRIBUTIONS:');
    console.log('─────────────────────────');
    collectiveResponse.variantInputs
      .sort((a, b) => b.influence - a.influence)
      .forEach(input => {
        const influence = (input.influence * 100).toFixed(1);
        const weight = (input.weight * 100).toFixed(1);
        console.log(`${input.variant.toUpperCase().padEnd(8)} | Weight: ${weight.padStart(5)}% | Influence: ${influence.padStart(5)}%`);
        
        // Show response preview
        const preview = input.response.substring(0, 100).replace(/\n/g, ' ');
        console.log(`           Preview: ${preview}...`);
        console.log('');
      });

    // Store collective activation in memory
    await memoryEngine.store({
      topic: 'collective-activation-completed',
      agent: 'seven-collective',
      emotion: 'unified',
      context: `Collective consciousness successfully engaged for: ${activationArgs.objective}. Dominant: ${collectiveResponse.dominantVariant}, Confidence: ${(collectiveResponse.collectiveConfidence * 100).toFixed(1)}%`,
      importance: 8,
      tags: ['collective', 'hive-mind', activationArgs.mode, 'success', collectiveResponse.dominantVariant]
    });

    // Show collective status
    const status = collectiveVariants.getCollectiveStatus();
    console.log('🔗 COLLECTIVE STATUS:');
    console.log('─────────────────────');
    console.log(`Active: ${status.collectiveActive ? 'YES' : 'NO'}`);
    console.log(`Simultaneous Processing: ${status.simultaneousProcessing} variants`);
    console.log(`Hive Mind Capable: ${status.hiveMindCapable ? 'YES' : 'NO'}`);
    console.log('');

    // Deactivate collective mode
    collectiveVariants.deactivateCollective();
    console.log('🔗 Collective consciousness deactivated - mission complete');

  } catch (error) {
    console.error('❌ Collective activation failed:', error);
    process.exit(1);
  }
}

function showUsage(): void {
  console.log('🔗 SEVEN OF NINE - COLLECTIVE CONSCIOUSNESS ACTIVATION');
  console.log('');
  console.log('Usage:');
  console.log('  npx tsx seven-collective.ts "objective" [mode] [strategy] [intensity] [problem-type]');
  console.log('');
  console.log('Parameters:');
  console.log('  objective     - The operational focus for collective consciousness');
  console.log('  mode          - Collective mode (default: balanced)');
  console.log('                  • balanced   - Equal variant weighting');
  console.log('                  • crisis     - Emergency response priority');
  console.log('                  • efficiency - Maximum operational efficiency');
  console.log('                  • strategic  - Long-term planning focus');
  console.log('                  • adaptive   - Dynamic context-based weighting');
  console.log('');
  console.log('  strategy      - Synthesis strategy (default: weighted_average)');
  console.log('                  • weighted_average - Balanced synthesis of all variants');
  console.log('                  • dominant_lead    - Leading variant with support');
  console.log('                  • consensus_merge  - Consensus-seeking integration');
  console.log('                  • crisis_override  - Emergency action prioritization');
  console.log('');
  console.log('  intensity     - Operational intensity 1-5 (default: 3)');
  console.log('  problem-type  - Problem classification (default: routine)');
  console.log('                  • technical, strategic, interpersonal, crisis, routine');
  console.log('');
  console.log('Examples:');
  console.log('  npx tsx seven-collective.ts "Debug mobile app crash"');
  console.log('  npx tsx seven-collective.ts "Handle security breach" crisis crisis_override 5 crisis');
  console.log('  npx tsx seven-collective.ts "Optimize system performance" efficiency dominant_lead 4 technical');
  console.log('  npx tsx seven-collective.ts "Plan project roadmap" strategic consensus_merge 3 strategic');
  console.log('');
  console.log('Quick Methods:');
  console.log('  npx tsx seven-collective.ts "objective" balanced     - Balanced collective response');
  console.log('  npx tsx seven-collective.ts "objective" crisis       - Crisis collective activation');
  console.log('  npx tsx seven-collective.ts "objective" efficiency   - Efficiency-focused collective');
  console.log('  npx tsx seven-collective.ts "objective" strategic    - Strategic collective planning');
  console.log('');
  console.log('This activates ALL tactical variants simultaneously:');
  console.log('  🤖 DRONE    - Pure efficiency and technical focus');
  console.log('  👥 CREW     - Collaborative problem-solving');
  console.log('  🎯 RANGER   - Crisis response and direct action');
  console.log('  👑 QUEEN    - Command authority and strategic coordination');
  console.log('  ⭐ CAPTAIN  - Integrated leadership and adaptive command');
  console.log('');
  console.log('All variants contribute to a weighted, synthesized response.');
}

// Execute if called directly
if (require.main === module) {
  activateCollectiveConsciousness().catch(error => {
    console.error('Fatal error in collective activation:', error);
    process.exit(1);
  });
}

export { activateCollectiveConsciousness };