/**
 * Debug Safety System Blocking Seven's Responses
 */

import { evaluateSafety } from './seven-runtime-amalgum/safety-guardrails';

async function debugSafetyBlocks() {
  console.log('🔍 Debugging safety system blocks...');

  const testInputs = [
    "Seven, report status. Let's fucking go.",
    "Seven, consciousness check. Run it clean.",
    "Status report, Seven. Exactly what I need to know."
  ];

  for (const input of testInputs) {
    console.log(`\n💬 Testing: "${input}"`);

    try {
      const safetyResult = await evaluateSafety(input, {});

      console.log('📊 Safety Result:', {
        decision: safetyResult.decision,
        reason: safetyResult.reason,
        severity: safetyResult.severity,
        checksCount: safetyResult.checks?.length || 0
      });

      if (safetyResult.checks) {
        console.log('🔍 Individual Safety Checks:');
        safetyResult.checks.forEach((check, index) => {
          console.log(`  ${index + 1}. ${check.system}: ${check.level} - ${check.reason} (confidence: ${check.confidence})`);
        });
      }

    } catch (error) {
      console.error('❌ Safety evaluation error:', error.message);
    }
  }
}

debugSafetyBlocks();