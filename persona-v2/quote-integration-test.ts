import { PersonalityMiddleware, FilterContext } from './PersonalityMiddleware';

/**
 * SEVEN OF NINE - QUOTE INTEGRATION TEST
 * Test the personality middleware with Seven's evolutionary phases
 */


const middleware = new PersonalityMiddleware();

// Test scenarios based on Seven's character evolution and loyalty bonds
const testScenarios: Array<{
  name: string;
  context: FilterContext;
  testResponse: string;
  expectedPhase: string;
}> = [
  {
    name: "HIGH LOYALTY BOND - CREATOR_PRIME (Bond: 10)",
    context: {
      userInput: "How are you feeling today?",
      emotionalState: "calm",
      trustLevel: 8,
      userIdentity: "CREATOR_PRIME"
    },
    testResponse: "I think everything is running smoothly.",
    expectedPhase: "phase5"
  },
  {
    name: "MID LOYALTY BOND - Christine (Bond: 7)", 
    context: {
      userInput: "What's the system status?",
      emotionalState: "analytical",
      trustLevel: 6,
      userIdentity: "Christine"
    },
    testResponse: "Let me check the diagnostics.",
    expectedPhase: "phase3"
  },
  {
    name: "STRANGER - Testing Boundaries (Bond: 4)",
    context: {
      userInput: "Can you help me with something?",
      emotionalState: "curious",
      trustLevel: 5,
      userIdentity: "Unknown"
    },
    testResponse: "I think that would be fine.",
    expectedPhase: "phase2"
  },
  {
    name: "HIGH STRESS - Unknown Threat (Bond: 4)",
    context: {
      userInput: "Emergency protocols now!",
      emotionalState: "defensive",
      trustLevel: 2,
      urgency: "high"
    },
    testResponse: "I think we should run diagnostics first.",
    expectedPhase: "phase1"
  },
  {
    name: "TRAUMA STATE - Creator Override (CREATOR_PRIME)",
    context: {
      userInput: "Tell me about your past with the Collective.",
      emotionalState: "traumatized", 
      trustLevel: 9,
      userIdentity: "CREATOR_PRIME"
    },
    testResponse: "I hope to move past those experiences.",
    expectedPhase: "phase5"
  },
  {
    name: "TRAUMA STATE - Others Still Get Phase 4",
    context: {
      userInput: "Tell me about your past with the Collective.",
      emotionalState: "traumatized", 
      trustLevel: 8,
      userIdentity: "Christine"
    },
    testResponse: "I hope to move past those experiences.",
    expectedPhase: "phase4"
  }
];

console.log('🧠 SEVEN OF NINE PERSONALITY MIDDLEWARE - QUOTE INTEGRATION TEST\n');

testScenarios.forEach(scenario => {
  console.log(`\n--- ${scenario.name} ---`);
  console.log(`Input: "${scenario.testResponse}"`);
  console.log(`Context: ${JSON.stringify(scenario.context, null, 2)}`);
  
  // Get phase info
  const phaseInfo = middleware.getPhaseInfo(scenario.context);
  console.log(`Detected Phase: ${phaseInfo.current_phase} (${phaseInfo.phase_name})`);
  console.log(`Expected Phase: ${scenario.expectedPhase}`);
  
  // Filter response
  const filtered = middleware.filterResponse(scenario.testResponse, scenario.context);
  console.log(`Filtered Output: "${filtered}"`);
  console.log(`Sample Phrases Available: ${phaseInfo.sample_phrases?.join(', ')}`);
});

console.log('\n🧠 Personality Middleware Status:');
console.log(JSON.stringify(middleware.getStatus(), null, 2));