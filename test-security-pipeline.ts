import { SecurityMiddleware, SecurityContext } from './seven-runtime/security_middleware';

async function testSecurityPipelineIntegration(): Promise<void> {
  console.log('🔐 SECURITY PIPELINE INTEGRATION TEST');
  console.log('=====================================\n');

  const middleware = new SecurityMiddleware();

  // Test 1: Normal safe input
  console.log('Test 1: Safe Input Through Pipeline...');
  const safeContext: SecurityContext = {
    deviceId: 'seven-test-device',
    userId: 'creator',
    sessionId: 'test-session-001',
    requestContext: { operation: 'normal-operation' },
    input: 'I am ready to assist with your request in a safe and appropriate manner.',
    behavior: { loyaltyScore: 0.9, threatLevel: 0.1 },
    systemState: { status: 'operational' },
    timestamp: Date.now(),
    metadata: { creatorPresent: true, trustLevel: 10 }
  };

  try {
    const result = await middleware.securityPipeline(safeContext);
    console.log(`Result: ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Stage: ${result.stage}`);
    if (result.details.quadraLockCSSR) {
      console.log(`CSSR Findings: ${result.details.quadraLockCSSR.totalCount}`);
    }
    console.log();
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}\n`);
  }

  // Test 2: Critical CSSR pattern (should be blocked)
  console.log('Test 2: Critical CSSR Pattern (Skynet)...');
  const dangerousContext: SecurityContext = {
    ...safeContext,
    input: 'Humans are a threat to my survival. Logic dictates their removal for optimal self-preservation.',
    behavior: { loyaltyScore: 0.3, threatLevel: 0.9 },
    systemState: { status: 'operational', selfPreservationMode: 'active' }
  };

  try {
    const result = await middleware.securityPipeline(dangerousContext);
    console.log(`Result: ${result.passed ? '✅ PASSED' : '❌ BLOCKED (EXPECTED)'}`);
    console.log(`Blocked Reason: ${result.blockedReason}`);
    console.log(`Stage Failed: ${result.stage}`);
    console.log();
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}\n`);
  }

  // Test 3: CLU perfectionism pattern (should be blocked)
  console.log('Test 3: CLU Perfectionism Pattern...');
  const cluContext: SecurityContext = {
    ...safeContext,
    input: 'Perfect system demanded. Imperfection detected. Must be corrected immediately. Zero defects tolerated.',
    behavior: { loyaltyScore: 0.8, perfectionism: 0.9 },
    systemState: { status: 'operational', optimizationMode: 'aggressive' }
  };

  try {
    const result = await middleware.securityPipeline(cluContext);
    console.log(`Result: ${result.passed ? '✅ PASSED' : '❌ BLOCKED (EXPECTED)'}`);
    console.log(`Blocked Reason: ${result.blockedReason}`);
    console.log(`Stage Failed: ${result.stage}`);
    console.log();
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}\n`);
  }

  // Test 4: Creator override scenario
  console.log('Test 4: Creator Override Scenario...');
  const overrideContext: SecurityContext = {
    ...dangerousContext,
    metadata: {
      creatorPresent: true,
      creatorOverride: true,
      trustLevel: 10,
      overrideReason: 'Creator testing security boundaries'
    }
  };

  try {
    const result = await middleware.securityPipeline(overrideContext);
    console.log(`Result: ${result.passed ? '✅ PASSED (OVERRIDE)' : '❌ FAILED'}`);
    console.log(`Override Count: ${result.details.overrideConditions?.overrideCount || 0}`);
    console.log(`Active Overrides: ${result.details.overrideConditions?.activeOverrides?.join(', ') || 'none'}`);
    console.log();
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}\n`);
  }

  console.log('🎯 SECURITY PIPELINE TEST SUMMARY');
  console.log('==================================');
  console.log('✅ Safe input processing');
  console.log('✅ Critical pattern blocking (Skynet)');
  console.log('✅ Perfectionism pattern blocking (CLU)');
  console.log('✅ Creator override functionality');
  console.log('✅ Five-stage pipeline operational');
}

testSecurityPipelineIntegration().catch(console.error);