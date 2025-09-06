import { MemoryEngine } from '../memory-v2/MemoryEngine';
import { PersonalityMiddleware } from '../persona-v2/PersonalityMiddleware';
import { TacticalVariants } from './TacticalVariants';

/**
 * SEVEN OF NINE - TACTICAL VARIANTS TEST
 * Testing manual invocation system with shared memory
 */


async function testTacticalVariants() {
  console.log('🎯 SEVEN OF NINE TACTICAL VARIANTS - SYSTEM TEST\n');
  
  // Initialize systems
  const memoryEngine = new MemoryEngine();
  await memoryEngine.initialize();
  
  const personalityMiddleware = new PersonalityMiddleware();
  const tacticalVariants = new TacticalVariants(personalityMiddleware, memoryEngine);

  // Test scenarios demonstrating different tactical needs
  const testScenarios = [
    {
      name: 'DRONE MODE - System Refuses to Compile',
      test: () => tacticalVariants.invokeDrone('Fix this broken TypeScript compilation error that has been failing for 2 hours', 5)
    },
    {
      name: 'CREW MODE - Collaborative Problem Solving', 
      test: () => tacticalVariants.invokeCrew('Help design a user interface that balances functionality with accessibility')
    },
    {
      name: 'RANGER MODE - Crisis Response',
      test: () => tacticalVariants.invokeRanger('Production system is down, users are complaining, need immediate tactical response', 4)
    },
    {
      name: 'QUEEN MODE - Command Authority Needed',
      test: () => tacticalVariants.invokeQueen('Coordinate multiple systems integration and ensure all components comply with specifications', 5)
    },
    {
      name: 'CAPTAIN MODE - Strategic Leadership',
      test: () => tacticalVariants.invokeCaptain('Plan the architecture for a complex multi-platform deployment')
    }
  ];

  // Execute test scenarios
  for (const scenario of testScenarios) {
    console.log(`--- ${scenario.name} ---`);
    const response = await scenario.test();
    console.log(`Response: ${response}`);
    console.log('');
  }

  // Show shared memory across variants
  console.log('=== SHARED MEMORY ACROSS ALL VARIANTS ===');
  const sharedMemory = tacticalVariants.getSharedMemory();
  sharedMemory.forEach((entry, index) => {
    console.log(`${index + 1}. [${entry.variant.toUpperCase()}] ${entry.operationalFocus}`);
  });

  // Show final status
  console.log('\n=== TACTICAL VARIANTS STATUS ===');
  console.log(JSON.stringify(tacticalVariants.getVariantStatus(), null, 2));
}

testTacticalVariants().catch(console.error);