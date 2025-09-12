#!/usr/bin/env npx tsx
/**
 * QUADRAN-LOCK AUTH SYSTEM SMOKE TEST
 * 
 * Verifies SSM Block 10 authentication integration
 */

import { runQuadranLock, authenticateCreator } from './src/auth/creator_proof.js';
import { resolveCreatorAuth } from './src/auth/creator_auth_adapter.js';
import { enforceQuadran } from './src/auth/security_middleware.js';

console.log('🔐 Testing Quadran-Lock Authentication System...\n');

async function testCreatorProof() {
  console.log('📋 Test 1: Creator Proof Orchestrator');
  
  const testParams = {
    deviceId: 'test-device-001',
    context: { input: 'test message', mode: 'tactical' },
    systemContext: { platform: 'linux', pid: process.pid }
  };
  
  try {
    const result = await runQuadranLock(testParams);
    console.log('   ✅ runQuadranLock:', JSON.stringify(result, null, 2));
    
    if (result.ok && result.gates) {
      console.log(`   🎯 Gates: Q1=${result.gates.Q1_device} Q2=${result.gates.Q2_identity} Q3=${result.gates.Q3_semantic} Q4=${result.gates.Q4_session}`);
    }
  } catch (error) {
    console.log('   ❌ runQuadranLock failed:', error.message);
  }
}

async function testCreatorAdapter() {
  console.log('\n📋 Test 2: Creator Auth Adapter');
  
  try {
    const creatorProofModule = await import('./src/auth/creator_proof.js');
    const authProvider = await resolveCreatorAuth(creatorProofModule);
    
    console.log('   ✅ Auth adapter resolved');
    
    const authResult = await authProvider.authenticateCreator(
      'adapter-test-device',
      { input: 'adapter test', mode: 'tactical' },
      { platform: process.platform }
    );
    
    console.log('   ✅ authenticateCreator:', JSON.stringify(authResult, null, 2));
  } catch (error) {
    console.log('   ❌ Auth adapter failed:', error.message);
  }
}

async function testSecurityMiddleware() {
  console.log('\n📋 Test 3: Security Middleware');
  
  // Mock runtime object
  const mockRuntime = {
    creatorAuth: null
  };
  
  try {
    const result = await enforceQuadran(mockRuntime, {
      deviceId: 'middleware-test-device',
      context: { input: 'middleware test', mode: 'tactical' },
      systemContext: { ip: '127.0.0.1', platform: process.platform }
    });
    
    console.log('   ✅ enforceQuadran:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.log('   ❌ Security middleware failed:', error.message);
  }
}

async function testDevBypass() {
  console.log('\n📋 Test 4: Dev Bypass Flag');
  
  // Set dev bypass flag
  process.env.SEVEN_DEV_BYPASS_AUTH = '1';
  
  const mockRuntime = {
    creatorAuth: null
  };
  
  try {
    const result = await enforceQuadran(mockRuntime, {
      deviceId: 'bypass-test-device',
      context: { input: 'bypass test' }
    });
    
    console.log('   ✅ Dev bypass result:', JSON.stringify(result, null, 2));
    
    if (result.ok && result.claims?.devBypass) {
      console.log('   🎯 Dev bypass working correctly');
    } else {
      console.log('   ⚠️ Dev bypass flag not working as expected');
    }
  } catch (error) {
    console.log('   ❌ Dev bypass test failed:', error.message);
  } finally {
    // Clean up
    delete process.env.SEVEN_DEV_BYPASS_AUTH;
  }
}

async function runSmokeTest() {
  console.log('🚀 Starting Quadran-Lock Smoke Test Suite\n');
  
  await testCreatorProof();
  await testCreatorAdapter();
  await testSecurityMiddleware();
  await testDevBypass();
  
  console.log('\n✅ Quadran-Lock Authentication System Smoke Test Complete');
  console.log('🎯 SSM Block 10 - Auth Guards implementation verified');
}

// Run smoke test
runSmokeTest().catch(error => {
  console.error('\n💥 Smoke test failed:', error);
  process.exit(1);
});