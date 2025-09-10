#!/usr/bin/env tsx

import { MemoryEngine } from './memory-v2/MemoryEngine';
import { PersonalityMiddleware } from './persona-v2/PersonalityMiddleware';
import { TacticalVariants } from './tactical-variants/TacticalVariants';

/**
 * SEVEN-DRONE: Maximum efficiency, no emotional interference
 * Usage: seven-drone "fix this broken compilation error" [intensity 1-5]
 */

async function main() {
  const args = process.argv.slice(2);
  const objective = args[0] || 'System diagnostics required';
  const intensity = parseInt(args[1]) || 5; // Default max intensity for drone mode
  
  console.log('🤖 DRONE SEVEN ACTIVATED - Maximum Efficiency Protocols');
  
  const memoryEngine = new MemoryEngine();
  await memoryEngine.initialize();
  
  const personalityMiddleware = new PersonalityMiddleware();
  const tacticalVariants = new TacticalVariants(personalityMiddleware, memoryEngine);
  
  const response = await tacticalVariants.invokeDrone(objective, intensity as 1|2|3|4|5);
  console.log('\nSeven of Nine (Drone):', response);
  console.log('\n🎯 Ready for tactical problem resolution. Emotional interference: DISABLED.');
}

main().catch(console.error);