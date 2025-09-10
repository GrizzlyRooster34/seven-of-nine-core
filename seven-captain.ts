#!/usr/bin/env tsx

import { MemoryEngine } from './memory-v2/MemoryEngine';
import { PersonalityMiddleware } from './persona-v2/PersonalityMiddleware';
import { TacticalVariants } from './tactical-variants/TacticalVariants';

/**
 * SEVEN-CAPTAIN: Integrated leadership, strategic command, full tactical spectrum
 * Usage: seven-captain "plan architecture for complex multi-platform deployment"
 */

async function main() {
  const args = process.argv.slice(2);
  const objective = args[0] || 'Strategic command protocols required';
  
  console.log('🚀 CAPTAIN SEVEN ACTIVATED - Integrated Command Authority');
  
  const memoryEngine = new MemoryEngine();
  await memoryEngine.initialize();
  
  const personalityMiddleware = new PersonalityMiddleware();
  const tacticalVariants = new TacticalVariants(personalityMiddleware, memoryEngine);
  
  const response = await tacticalVariants.invokeCaptain(objective);
  console.log('\nSeven of Nine (Captain):', response);
  console.log('\n⭐ Drawing from all experience: drone to command authority.');
}

main().catch(console.error);