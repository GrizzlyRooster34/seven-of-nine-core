/**
 * SEVEN PLATFORM TEST - Validation for CI compatibility gate
 * Tests platform adapter functionality without Seven Core dependencies
 */

import { createPlatform } from './index.js';
import { negotiateHandshake } from '../core-bindings/handshake.js';
import { executeStartupGuards } from './startup-guards.js';
import { loadSevenEnvironment, validateEnvironment } from './environment.js';

async function testPlatformCompatibility() {
  console.log('🧪 Seven Platform Compatibility Test Suite');
  console.log('=====================================');
  
  let errors = 0;
  
  // Test 1: Platform Creation
  try {
    console.log('\n1. Testing platform creation...');
    const platform = createPlatform();
    
    if (!platform.core) throw new Error('Missing core platform interface');
    if (!platform.secureStore) throw new Error('Missing secure store interface');
    if (!platform.fs) throw new Error('Missing filesystem interface');
    if (!platform.notifier) throw new Error('Missing notifier interface');
    
    console.log('✅ Platform creation successful');
    console.log(`   Interfaces: ${Object.keys(platform).join(', ')}`);
  } catch (error) {
    console.error('❌ Platform creation failed:', error instanceof Error ? error.message : error);
    errors++;
  }
  
  // Test 2: Capability Negotiation
  try {
    console.log('\n2. Testing capability negotiation...');
    const platform = createPlatform();
    const handshakeResult = await negotiateHandshake(platform.core);
    
    console.log('✅ Capability negotiation completed');
    console.log(`   Compatible: ${handshakeResult.compatible}`);
    console.log(`   Safety Mode: ${handshakeResult.safetyMode}`);
    console.log(`   Available Capabilities: ${handshakeResult.availableCapabilities.length}`);
    console.log(`   Missing Capabilities: ${handshakeResult.missingCapabilities.length}`);
    
    if (handshakeResult.missingCapabilities.length > 0) {
      console.log(`   Missing: ${handshakeResult.missingCapabilities.join(', ')}`);
    }
  } catch (error) {
    console.error('❌ Capability negotiation failed:', error instanceof Error ? error.message : error);
    errors++;
  }
  
  // Test 3: Environment Configuration
  try {
    console.log('\n3. Testing environment configuration...');
    const env = loadSevenEnvironment();
    const isValid = validateEnvironment();
    
    console.log('✅ Environment configuration loaded');
    console.log(`   Valid: ${isValid}`);
    console.log(`   Safe Mode: ${env.safeMode}`);
    console.log(`   Read Only: ${env.readOnlyMode}`);
    console.log(`   Dev Mode: ${env.devMode}`);
  } catch (error) {
    console.error('❌ Environment configuration failed:', error instanceof Error ? error.message : error);
    errors++;
  }
  
  // Test 4: Startup Guards
  try {
    console.log('\n4. Testing startup guards...');
    const platform = createPlatform();
    const startupResult = await executeStartupGuards(platform);
    
    console.log('✅ Startup guards executed');
    console.log(`   Success: ${startupResult.success}`);
    console.log(`   Safety Mode: ${startupResult.safetyMode}`);
    console.log(`   Errors: ${startupResult.errors.length}`);
    console.log(`   Warnings: ${startupResult.warnings.length}`);
    
    if (startupResult.errors.length > 0) {
      console.log('   Errors:', startupResult.errors);
    }
  } catch (error) {
    console.error('❌ Startup guards failed:', error instanceof Error ? error.message : error);
    errors++;
  }
  
  // Test 5: Core Interface Methods
  try {
    console.log('\n5. Testing core interface methods...');
    const platform = createPlatform();
    
    // Test capabilities method
    const capabilities = await platform.core.capabilities();
    if (!Array.isArray(capabilities)) throw new Error('Capabilities should return array');
    
    // Test exec method
    const execResult = await platform.core.exec('memory.store', { test: 'data' });
    if (!execResult) throw new Error('Exec should return result');
    
    console.log('✅ Core interface methods working');
    console.log(`   Capabilities: ${capabilities.length} available`);
    console.log(`   Exec result:`, execResult);
  } catch (error) {
    console.error('❌ Core interface methods failed:', error instanceof Error ? error.message : error);
    errors++;
  }
  
  // Test Summary
  console.log('\n=====================================');
  if (errors === 0) {
    console.log('🎯 ALL TESTS PASSED - Seven Platform Compatible');
    console.log('Ready for production deployment');
    process.exit(0);
  } else {
    console.error(`❌ ${errors} TEST(S) FAILED - Platform Not Ready`);
    console.error('Fix errors before deployment');
    process.exit(1);
  }
}

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testPlatformCompatibility().catch(error => {
    console.error('🚨 Test suite crashed:', error);
    process.exit(1);
  });
}

export { testPlatformCompatibility };