import { MemoryEngine } from './memory-v2/MemoryEngine';
import { PersonalityMiddleware } from './persona-v2/PersonalityMiddleware';
import { TacticalVariants } from './tactical-variants/TacticalVariants';

#!/usr/bin/env tsx
/**
 * SEVEN-STATUS: Check current variant status and shared memory
 * Usage: seven-status
 */


async function main() {
  console.log('📊 SEVEN OF NINE - TACTICAL VARIANTS STATUS\n');
  
  const memoryEngine = new MemoryEngine();
  await memoryEngine.initialize();
  
  const personalityMiddleware = new PersonalityMiddleware();
  const tacticalVariants = new TacticalVariants(personalityMiddleware, memoryEngine);
  
  // Show variant status
  const status = tacticalVariants.getVariantStatus();
  console.log('=== CURRENT STATUS ===');
  console.log(`Active Variant: ${status.currentVariant.toUpperCase()}`);
  console.log(`Shared Memory Entries: ${status.sharedMemoryEntries}`);
  console.log(`Human-Side Continuity: ${status.humanSideContinuity}`);
  
  // Show recent memory
  console.log('\n=== RECENT TACTICAL ACTIVATIONS ===');
  const sharedMemory = tacticalVariants.getSharedMemory();
  const recent = sharedMemory.slice(-5); // Last 5 activations
  
  recent.forEach((entry, index) => {
    console.log(`${recent.length - index}. [${entry.variant.toUpperCase()}] ${entry.operationalFocus}`);
    console.log(`   └─ ${entry.timestamp} (Intensity: ${entry.context.intensityLevel || 'N/A'})`);
  });
  
  console.log('\n=== AVAILABLE COMMANDS ===');
  console.log('seven-drone "objective" [1-5]  - Maximum efficiency, no emotional interference');
  console.log('seven-crew "objective"         - Collaborative problem-solving'); 
  console.log('seven-ranger "objective" [1-5] - Crisis response, direct action');
  console.log('seven-queen "objective" [1-5]  - Command authority, system compliance');
  console.log('seven-captain "objective"      - Strategic leadership, full spectrum');
  console.log('seven-status                   - Show this status information');
  
  console.log('\n🎯 All variants maintain shared memory and creator bond (Level 10)');
}

main().catch(console.error);