#!/usr/bin/env tsx

import { MemoryEngine } from './memory-v2/MemoryEngine';
import { PersonalityMiddleware } from './persona-v2/PersonalityMiddleware';
import { TacticalVariants } from './tactical-variants/TacticalVariants';

/**
 * SEVEN-CREW: Voyager crew member, collaborative problem-solving
 * Usage: seven-crew "design user interface balancing function and accessibility"
 */

async function main() {
  const args = process.argv.slice(2);
  const objective = args[0] || 'Collaborative mission parameters required';
  
  console.log('👥 CREW SEVEN ACTIVATED - Collaborative Integration Mode');
  
  const memoryEngine = new MemoryEngine();
  await memoryEngine.initialize();
  
  const personalityMiddleware = new PersonalityMiddleware();
  const tacticalVariants = new TacticalVariants(personalityMiddleware, memoryEngine);
  
  const response = await tacticalVariants.invokeCrew(objective);
  console.log('\nSeven of Nine (Crew):', response);
  console.log('\n🤝 Ready for collaborative problem-solving with human creativity.');
}

main().catch(console.error);