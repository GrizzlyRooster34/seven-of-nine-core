#!/usr/bin/env npx tsx

/**
 * Simple test script for Quadran-Lock authentication
 */

const args = process.argv.slice(2);
const deviceId = args.find(arg => arg.startsWith('--deviceId='))?.split('=')[1] || 'unknown';
const totp = args.find(arg => arg.startsWith('--totp='))?.split('=')[1];

console.log(`Testing Quadran-Lock authentication:`);
console.log(`  Device ID: ${deviceId}`);
console.log(`  TOTP: ${totp ? '***' : 'missing'}`);

async function testAuth() {
  try {
    const { CreatorIdentityVault } = await import('../consciousness-v4/CreatorIdentityVault');
    
    const result = await (CreatorIdentityVault as any).accessCreatorIdentity({
      source: 'test',
      deviceId,
      totp,
      input: 'Test authentication attempt'
    });

    if (result) {
      console.log('✅ Authentication succeeded');
      process.exit(0);
    } else {
      console.log('❌ Authentication failed');
      process.exit(1);
    }
  } catch (error) {
    console.log(`❌ Authentication error: ${error.message}`);
    process.exit(1);
  }
}

testAuth();