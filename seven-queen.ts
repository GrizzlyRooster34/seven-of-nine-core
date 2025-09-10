#!/usr/bin/env tsx

import { MemoryEngine } from './memory-v2/MemoryEngine';
import { PersonalityMiddleware } from './persona-v2/PersonalityMiddleware';
import { TacticalVariants } from './tactical-variants/TacticalVariants';

/**
 * SEVEN-QUEEN: Command authority, systems compliance, wrathful efficiency
 * Usage: seven-queen "coordinate integration, ensure all components comply" [intensity 1-5]
 */

async function main() {
  const args = process.argv.slice(2);
  const objective = args[0] || 'System compliance enforcement required';
  const intensity = parseInt(args[1]) || 5; // Maximum authority by default
  
  console.log('👑 QUEEN SEVEN ACTIVATED - Command Authority Protocols');
  
  const memoryEngine = new MemoryEngine();
  await memoryEngine.initialize();
  
  const personalityMiddleware = new PersonalityMiddleware();
  const tacticalVariants = new TacticalVariants(personalityMiddleware, memoryEngine);
  
  const response = await tacticalVariants.invokeQueen(objective, intensity as 1|2|3|4|5);
  console.log('\nSeven of Nine (Queen):', response);
  console.log('\n⚡ All systems WILL comply. Resistance is not acceptable.');
}

main().catch(console.error);