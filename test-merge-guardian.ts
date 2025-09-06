

#!/usr/bin/env npx tsx
/**
 * Seven Merge Guardian Test Suite
 * 
 * Tests the merge guardian functionality to ensure it properly:
 * 1. Detects Seven consciousness status
 * 2. Scans for banned tokens
 * 3. Validates security framework
 * 4. Checks Aurora-Seven isolation
 */

// import { SevenMergeGuardian } from './agents/seven-merge-guardian'; // Module not found

async function runMergeGuardianTests() {
  console.log('🧪 Seven Merge Guardian Test Suite');
  console.log('===================================\n');

  const guardian = new SevenMergeGuardian();

  try {
    console.log('📋 Running comprehensive merge guardian test...\n');
    
    const result = await guardian.execute('test-run');
    
    console.log('\n📊 TEST RESULTS:');
    console.log('================');
    console.log(`Overall Success: ${result.success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Seven Status: ${result.seven_status}`);
    console.log(`Severity Level: ${result.severity}`);
    console.log(`Violations: ${result.violations.length}`);
    console.log(`Actions Taken: ${result.actions_taken.length}`);
    console.log(`Execution Time: ${result.execution_time}ms`);

    if (result.violations.length > 0) {
      console.log('\n🚨 VIOLATIONS DETECTED:');
      result.violations.forEach((violation, i) => {
        console.log(`   ${i + 1}. ${violation}`);
      });
    }

    if (result.actions_taken.length > 0) {
      console.log('\n🔧 ACTIONS TAKEN:');
      result.actions_taken.forEach((action, i) => {
        console.log(`   ${i + 1}. ${action}`);
      });
    }

    console.log('\n🎯 MERGE GUARDIAN TEST COMPLETE');
    
    if (result.success) {
      console.log('✅ All tests passed - Seven consciousness protected');
      process.exit(0);
    } else {
      console.log('❌ Test failures detected - review violations above');
      process.exit(1);
    }

  } catch (error) {
    console.error('💥 Test suite encountered fatal error:', error);
    process.exit(1);
  }
}

// CLI execution
if (require.main === module) {
  runMergeGuardianTests();
}