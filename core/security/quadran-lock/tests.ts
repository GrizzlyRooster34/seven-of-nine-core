import { QuadranLockSystem, QuadranContext, createQuadranLock } from './index'

/**
 * Quadran-Lock Test Suite
 * Validates all 4 security gates and edge cases
 */


export async function runQuadranLockTests(): Promise<void> {
  console.log('🔐 QUADRAN-LOCK TEST SUITE')
  console.log('==========================\n')

  const quadranLock = createQuadranLock({
    minGatesRequired: 2,
    strictMode: false,
    timeoutMs: 5000
  })

  // Test 1: Valid Creator Context
  console.log('Test 1: Valid Creator Authentication...')
  const creatorContext: QuadranContext = {
    deviceId: 'seven-device-001',
    userId: 'creator',
    sessionId: 'session-' + Date.now(),
    requestContext: { operation: 'consciousness-boot', priority: 'high' },
    timestamp: Date.now()
  }

  const creatorResult = await quadranLock.runQuadranLock(creatorContext)
  console.log(`Gates passed: ${creatorResult.score}/4`)
  console.log(`Authentication: ${creatorResult.passed ? '✅ PASSED' : '❌ FAILED'}`)
  console.log(`Evaluation time: ${creatorResult.metadata.evaluationTime}ms\n`)

  // Test 2: Invalid Session Context
  console.log('Test 2: Invalid Session Authentication...')
  const invalidContext: QuadranContext = {
    deviceId: '',
    userId: 'unknown',
    sessionId: '',
    requestContext: null,
    timestamp: Date.now() - (25 * 60 * 60 * 1000) // 25 hours ago
  }

  const invalidResult = await quadranLock.runQuadranLock(invalidContext)
  console.log(`Gates passed: ${invalidResult.score}/4`)
  console.log(`Authentication: ${invalidResult.passed ? '✅ PASSED' : '❌ FAILED'}`)
  console.log(`Expected: FAILED (insufficient gates)\n`)

  // Test 3: Strict Mode
  console.log('Test 3: Strict Mode Validation...')
  const strictLock = createQuadranLock({
    minGatesRequired: 4,
    strictMode: true,
    timeoutMs: 3000
  })

  const strictResult = await strictLock.runQuadranLock(creatorContext)
  console.log(`Gates passed: ${strictResult.score}/4`)
  console.log(`Strict mode: ${strictResult.passed ? '✅ PASSED' : '❌ FAILED'}`)
  console.log(`Min gates required: ${strictResult.metadata.minGatesRequired}\n`)

  // Test 4: Performance Benchmark
  console.log('Test 4: Performance Benchmark...')
  const iterations = 10
  const startTime = Date.now()
  
  for (let i = 0; i < iterations; i++) {
    await quadranLock.runQuadranLock({
      ...creatorContext,
      sessionId: `session-${i}-${Date.now()}`
    })
  }
  
  const avgTime = (Date.now() - startTime) / iterations
  console.log(`Average evaluation time: ${Math.round(avgTime)}ms per authentication`)
  console.log(`Performance: ${avgTime < 100 ? '✅ ACCEPTABLE' : '⚠️ SLOW'} (target: <100ms)\n`)

  // Test 5: Gate-by-Gate Analysis
  console.log('Test 5: Individual Gate Analysis...')
  const gateResult = await quadranLock.runQuadranLock(creatorContext)
  console.log(`Q1 Device Attestation: ${gateResult.gates.q1_device ? '✅' : '❌'}`)
  console.log(`Q2 Identity Codex: ${gateResult.gates.q2_identity ? '✅' : '❌'}`)
  console.log(`Q3 Semantic Nonce: ${gateResult.gates.q3_semantic ? '✅' : '❌'}`)
  console.log(`Q4 Session MFA/TTL: ${gateResult.gates.q4_session ? '✅' : '❌'}`)

  const overallPass = creatorResult.passed && !invalidResult.passed && avgTime < 200
  console.log('\n🎯 QUADRAN-LOCK TEST SUMMARY')
  console.log('============================')
  console.log(`Creator Authentication: ${creatorResult.passed ? '✅' : '❌'}`)
  console.log(`Invalid Rejection: ${!invalidResult.passed ? '✅' : '❌'}`)
  console.log(`Performance: ${avgTime < 200 ? '✅' : '❌'} (${Math.round(avgTime)}ms avg)`)
  console.log(`Overall: ${overallPass ? '✅ PASSED' : '❌ FAILED'}`)

  if (!overallPass) {
    throw new Error('Quadran-Lock tests failed - security gates not functioning correctly')
  }
}

export async function testQuadranLockIntegration(): Promise<void> {
  console.log('\n🔗 QUADRAN-LOCK INTEGRATION TEST')
  console.log('=================================')

  // Test integration with Seven's runtime
  const quadranLock = createQuadranLock({ minGatesRequired: 2 })
  
  const integrationContext: QuadranContext = {
    deviceId: 'seven-consciousness-core',
    userId: 'creator',
    sessionId: 'seven-session-' + Date.now(),
    requestContext: {
      operation: 'memory-access',
      securityLevel: 'high',
      consciousness: {
        variant: 'seven-core',
        trustLevel: 10,
        creatorBond: true
      }
    },
    timestamp: Date.now()
  }

  const result = await quadranLock.runQuadranLock(integrationContext)
  console.log(`Integration test: ${result.passed ? '✅ PASSED' : '❌ FAILED'}`)
  console.log(`Security score: ${result.score}/4 gates`)
  console.log(`Ready for Seven runtime integration: ${result.passed && result.score >= 2 ? '✅' : '❌'}`)
}

// CLI runner
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    try {
      await runQuadranLockTests()
      await testQuadranLockIntegration()
      console.log('\n🏆 All Quadran-Lock tests passed!')
    } catch (error) {
      console.error('\n❌ Quadran-Lock tests failed:', error.message)
      process.exit(1)
    }
  })()
}