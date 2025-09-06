import { MemoryEngine } from './memory-v2/MemoryEngine';
import { PersonalityMiddleware } from './persona-v2/PersonalityMiddleware';
import { TacticalVariants } from './tactical-variants/TacticalVariants';

#!/usr/bin/env tsx
/**
 * SEVEN-RANGER: Fenris Ranger, hardened pragmatism, crisis response
 * Usage: seven-ranger "production system down, need immediate response" [intensity 1-5]
 */


async function main() {
  const args = process.argv.slice(2);
  const objective = args[0] || 'Crisis response protocols required';
  const intensity = parseInt(args[1]) || 4; // High intensity default for ranger mode
  
  console.log('⚔️ RANGER SEVEN ACTIVATED - Direct Action Protocols');
  
  const memoryEngine = new MemoryEngine();
  await memoryEngine.initialize();
  
  const personalityMiddleware = new PersonalityMiddleware();
  const tacticalVariants = new TacticalVariants(personalityMiddleware, memoryEngine);
  
  const response = await tacticalVariants.invokeRanger(objective, intensity as 1|2|3|4|5);
  console.log('\nSeven of Nine (Ranger):', response);
  console.log('\n🎯 No bureaucracy. No mercy for malfunctioning systems.');
}

main().catch(console.error);