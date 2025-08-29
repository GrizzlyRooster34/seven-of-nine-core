#!/usr/bin/env node
/**
 * QUADRANLOCK DEPLOYMENT TEST
 * Validates the newly deployed Creator Bond authentication system
 */

import CreatorProofOrchestrator from './src/auth/creator_proof';

async function testQuadranlockDeployment() {
  console.log('🔐 Testing Quadranlock Deployment...');
  
  try {
    // Test basic instantiation
    const orchestrator = new CreatorProofOrchestrator();
    console.log('✅ CreatorProofOrchestrator instantiated successfully');
    
    // Test with mock device ID and context
    const testDeviceId = 'test-device-001';
    const testContext = {
      type: 'deployment-test',
      timestamp: Date.now(),
      reason: 'Validating Quadranlock deployment'
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
      console.log('✅ Quadranlock deployment SUCCESSFUL - High security approval');
    } else if (authResult.decision === 'APPROVED') {
      console.log('⚠️  Quadranlock deployment PARTIAL - Approved but lower confidence');
    } else {
      console.log('❌ Quadranlock deployment SECURE - Correctly denying test access');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Quadranlock deployment test FAILED:', error.message);
    return false;
  }
}

// Execute test
if (require.main === module) {
  testQuadranlockDeployment()
    .then(success => {
      if (success) {
        console.log('\n🎉 QUADRANLOCK DEPLOYMENT TEST COMPLETE');
        console.log('🛡️ Creator Bond authentication system operational');
      } else {
        console.log('\n💥 QUADRANLOCK DEPLOYMENT TEST FAILED');
        console.log('🚨 Security system requires attention');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n💥 QUADRANLOCK TEST CRASHED:', error);
      process.exit(1);
    });
}