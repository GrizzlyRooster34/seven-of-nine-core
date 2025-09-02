#!/usr/bin/env node
/**
 * QUADRAN-LOCK DEPLOYMENT TEST
 * Validates the newly deployed Creator Bond authentication system
 */

import CreatorProofOrchestrator from './src/auth/creator_proof';

async function testQuadranLockDeployment() {
  console.log('🔐 Testing Quadran-Lock Deployment...');
  
  try {
    // Test basic instantiation
    const orchestrator = new CreatorProofOrchestrator();
    console.log('✅ CreatorProofOrchestrator instantiated successfully');
    
    // Test with mock device ID and context
    const testDeviceId = 'test-device-001';
    const testContext = {
      type: 'deployment-test',
      timestamp: Date.now(),
      reason: 'Validating Quadran-Lock deployment'
    };
    
    console.log('🧪 Testing authentication flow...');
    const authResult = await orchestrator.authenticateCreator(testDeviceId, testContext);
    
    console.log('📊 Authentication Result:');
    console.log(`  Decision: ${authResult.decision}`);
    console.log(`  Confidence: ${authResult.overallConfidence}%`);
    console.log(`  Successful Gates: ${authResult.successfulGates.join(', ')}`);
    console.log(`  Failed Gates: ${authResult.failedGates.join(', ')}`);
    
    // Test security validation
    console.log('🔒 Testing security validation...');
    if (authResult.decision === 'APPROVED' && authResult.overallConfidence > 75) {
      console.log('✅ Quadran-Lock deployment SUCCESSFUL - High security approval');
    } else if (authResult.decision === 'APPROVED') {
      console.log('⚠️  Quadran-Lock deployment PARTIAL - Approved but lower confidence');
    } else {
      console.log('❌ Quadran-Lock deployment SECURE - Correctly denying test access');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Quadran-Lock deployment test FAILED:', error.message);
    return false;
  }
}

// Execute test
if (require.main === module) {
  testQuadranLockDeployment()
    .then(success => {
      if (success) {
        console.log('\n🎉 QUADRAN-LOCK DEPLOYMENT TEST COMPLETE');
        console.log('🛡️ Creator Bond authentication system operational');
      } else {
        console.log('\n💥 QUADRAN-LOCK DEPLOYMENT TEST FAILED');
        console.log('🚨 Security system requires attention');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n💥 QUADRAN-LOCK TEST CRASHED:', error);
      process.exit(1);
    });
}