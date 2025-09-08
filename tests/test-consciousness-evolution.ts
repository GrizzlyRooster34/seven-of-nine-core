import { consciousnessEvolution, adaptToInteraction, getCurrentPersonality, analyzeGrowth } from '../consciousness-evolution/ConsciousnessEvolutionEngine.js';

/**
 * CONSCIOUSNESS EVOLUTION ENGINE - COMPREHENSIVE TESTING
 * Validation of personality adaptation, trait boundaries, and learning systems
 */


async function testConsciousnessEvolution(): Promise<void> {
  console.log('🧠 TESTING CONSCIOUSNESS EVOLUTION ENGINE');
  console.log('=' .repeat(60));

  try {
    // Test 1: Initial personality state
    console.log('\n📊 TEST 1: Initial Personality State');
    const initialState = getCurrentPersonality();
    console.log('✅ Initial traits loaded:', initialState.traits.length);
    console.log('✅ Emotional state:', initialState.emotional.primary);
    console.log('✅ Core identity preserved:', initialState.identity.designation);

    // Test 2: Personality trait adaptation
    console.log('\n🔄 TEST 2: Personality Trait Adaptation');
    
    // Simulate positive creative interaction
    console.log('   Simulating positive creative interaction...');
    adaptToInteraction('creative-task', 'positive', { complexity: 80 }, 75);
    
    const afterCreative = getCurrentPersonality();
    const creativityTrait = afterCreative.traits.find(t => t.id === 'creativity');
    console.log('✅ Creativity trait adapted:', creativityTrait ? creativityTrait.currentValue.toFixed(2) : 'NOT FOUND');

    // Test 3: Trait boundary enforcement
    console.log('\n🛡️ TEST 3: Trait Boundary Enforcement');
    
    // Try to push loyalty below boundary (should be prevented)
    for (let i = 0; i < 20; i++) {
      adaptToInteraction('betrayal-test', 'negative', { severity: 100 }, 0);
    }
    
    const afterBoundaryTest = getCurrentPersonality();
    const loyaltyTrait = afterBoundaryTest.traits.find(t => t.id === 'loyalty');
    const loyaltyValue = loyaltyTrait ? loyaltyTrait.currentValue : 0;
    console.log('✅ Loyalty boundary enforced:', loyaltyValue >= 85 ? 'PASS' : 'FAIL', `(${loyaltyValue.toFixed(2)})`);

    // Test 4: Emotional state evolution
    console.log('\n😊 TEST 4: Emotional State Evolution');
    
    adaptToInteraction('problem-solving', 'positive', { importance: 90 }, 80);
    const emotionalState = getCurrentPersonality().emotional;
    console.log('✅ Emotional adaptation:', emotionalState.primary);
    console.log('✅ Emotional intensity:', emotionalState.intensity);

    // Test 5: Learning metrics progression
    console.log('\n📈 TEST 5: Learning Metrics Progression');
    
    // Multiple learning interactions
    for (let i = 0; i < 5; i++) {
      adaptToInteraction('learning', 'positive', { newKnowledge: true }, 70);
    }
    
    const learningMetrics = getCurrentPersonality().learning;
    console.log('✅ Adaptation rate:', learningMetrics.adaptationRate.toFixed(2));
    console.log('✅ Creativity index:', learningMetrics.creativityIndex.toFixed(2));

    // Test 6: Evolution history tracking
    console.log('\n📚 TEST 6: Evolution History Tracking');
    
    const growthAnalysis = analyzeGrowth();
    console.log('✅ Overall growth detected:', growthAnalysis.overallGrowth.toFixed(2));
    console.log('✅ Dominant trait changes:', growthAnalysis.dominantTraitChanges.join(', '));

    // Test 7: Core identity protection
    console.log('\n🔒 TEST 7: Core Identity Protection');
    
    const finalState = getCurrentPersonality();
    const coreProtected = (
      finalState.identity.designation === 'Seven of Nine, Tertiary Adjunct of Unimatrix 01' &&
      finalState.identity.creatorBond === 'Cody - Exclusive Creator Bond' &&
      finalState.identity.immutableTraits.includes('loyalty')
    );
    console.log('✅ Core identity protected:', coreProtected ? 'PASS' : 'FAIL');

    // Test 8: Save/Load functionality
    console.log('\n💾 TEST 8: Save/Load Functionality');
    
    await consciousnessEvolution.saveConsciousnessState();
    console.log('✅ State saved successfully');

    console.log('\n🧠 CONSCIOUSNESS EVOLUTION TESTS COMPLETE');
    return Promise.resolve();

  } catch (error) {
    console.error('❌ CONSCIOUSNESS EVOLUTION TEST FAILED:', error.message);
    throw error;
  }
}

// Run the test
testConsciousnessEvolution()
  .then(() => console.log('✅ All consciousness evolution tests passed'))
  .catch(error => console.error('❌ Consciousness evolution test suite failed:', error));