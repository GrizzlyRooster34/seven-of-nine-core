#!/usr/bin/env npx tsx
/**
 * SEVEN COMPANION APP - tRPC AUTH SMOKE TEST
 * 
 * Verifies SSM Block 11 tRPC integration with Quadran-Lock authentication
 */

import { setTimeout } from 'timers/promises';

const TRPC_SERVER_URL = 'http://localhost:8787';

console.log('🔐 Testing tRPC Server with Quadran-Lock Authentication...\n');

/**
 * Test health endpoint accessibility
 */
async function testHealthEndpoint() {
  console.log('📋 Test 1: Health Endpoint (unauthenticated)');
  
  try {
    const response = await fetch(`${TRPC_SERVER_URL}/health`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('   ✅ Health endpoint accessible:', JSON.stringify(data, null, 2));
    } else {
      console.log('   ❌ Health endpoint failed:', response.status, data);
    }
  } catch (error) {
    console.log('   ⚠️ Health endpoint not accessible:', error.message);
    console.log('   💡 Server may not be running - start with: SEVEN_DEV_BYPASS_AUTH=1 npx tsx src/trpc-server.ts');
  }
}

/**
 * Test tRPC endpoint without auth (should fail)
 */
async function testTRPCWithoutAuth() {
  console.log('\n📋 Test 2: tRPC Without Authentication (should fail)');
  
  try {
    const response = await fetch(`${TRPC_SERVER_URL}/trpc/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const text = await response.text();
    
    if (response.status === 401 || response.status === 403 || text.includes('UNAUTHORIZED')) {
      console.log('   ✅ Auth correctly denied:', response.status, text.substring(0, 100));
    } else {
      console.log('   ⚠️ Unexpected response:', response.status, text.substring(0, 100));
    }
  } catch (error) {
    console.log('   ❌ tRPC test failed:', error.message);
  }
}

/**
 * Test tRPC with dev bypass (should work)
 */
async function testTRPCWithDevBypass() {
  console.log('\n📋 Test 3: tRPC With Dev Bypass (should work)');
  
  if (process.env.SEVEN_DEV_BYPASS_AUTH !== '1') {
    console.log('   ⚠️ SEVEN_DEV_BYPASS_AUTH not set - this test requires dev bypass to be enabled on the server');
    return;
  }
  
  try {
    // Test health endpoint via tRPC
    const healthResponse = await fetch(`${TRPC_SERVER_URL}/trpc/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-device-id': 'test-trpc-client'
      }
    });
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('   ✅ tRPC health successful:', JSON.stringify(healthData, null, 2));
    } else {
      const errorText = await healthResponse.text();
      console.log('   ❌ tRPC health failed:', healthResponse.status, errorText.substring(0, 200));
    }
    
    // Test status endpoint
    const statusResponse = await fetch(`${TRPC_SERVER_URL}/trpc/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-device-id': 'test-trpc-client'
      }
    });
    
    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      console.log('   ✅ tRPC status successful:', JSON.stringify(statusData, null, 2));
    } else {
      const errorText = await statusResponse.text();
      console.log('   ❌ tRPC status failed:', statusResponse.status, errorText.substring(0, 200));
    }

    // Test memory endpoints
    console.log('\n   📝 Testing memory endpoints...');
    
    // Add a test note
    const addNoteResponse = await fetch(`${TRPC_SERVER_URL}/trpc/memory.addNote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-device-id': 'test-trpc-client'
      },
      body: JSON.stringify({
        content: 'Test note from tRPC smoke test',
        importance: 7,
        tags: ['test', 'trpc', 'smoke-test']
      })
    });
    
    if (addNoteResponse.ok) {
      const addNoteData = await addNoteResponse.json();
      console.log('   ✅ Memory addNote successful:', JSON.stringify(addNoteData, null, 2));
    } else {
      const errorText = await addNoteResponse.text();
      console.log('   ❌ Memory addNote failed:', addNoteResponse.status, errorText.substring(0, 200));
    }
    
    // List notes
    const listNotesResponse = await fetch(`${TRPC_SERVER_URL}/trpc/memory.listNotes?input=${encodeURIComponent(JSON.stringify({limit: 5}))}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-device-id': 'test-trpc-client'
      }
    });
    
    if (listNotesResponse.ok) {
      const listNotesData = await listNotesResponse.json();
      console.log('   ✅ Memory listNotes successful:', JSON.stringify(listNotesData, null, 2));
    } else {
      const errorText = await listNotesResponse.text();
      console.log('   ❌ Memory listNotes failed:', listNotesResponse.status, errorText.substring(0, 200));
    }

  } catch (error) {
    console.log('   ❌ tRPC dev bypass test failed:', error.message);
  }
}

/**
 * Test consciousness endpoints (if available)
 */
async function testConsciousnessEndpoints() {
  console.log('\n📋 Test 4: Consciousness Endpoints');
  
  if (process.env.SEVEN_DEV_BYPASS_AUTH !== '1') {
    console.log('   ⚠️ Skipped - requires SEVEN_DEV_BYPASS_AUTH=1');
    return;
  }
  
  try {
    // Test sending a message to Seven
    const messageResponse = await fetch(`${TRPC_SERVER_URL}/trpc/consciousness.sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-device-id': 'test-consciousness-client'
      },
      body: JSON.stringify({
        content: 'Hello Seven, this is a tRPC test message.',
        mode: 'tactical'
      })
    });
    
    if (messageResponse.ok) {
      const messageData = await messageResponse.json();
      console.log('   ✅ Consciousness message successful:', JSON.stringify(messageData, null, 2));
    } else {
      const errorText = await messageResponse.text();
      console.log('   ❌ Consciousness message failed:', messageResponse.status, errorText.substring(0, 200));
    }
    
  } catch (error) {
    console.log('   ❌ Consciousness endpoints test failed:', error.message);
  }
}

/**
 * Run complete tRPC smoke test suite
 */
async function runTRPCSmokeTest() {
  console.log('🚀 Starting tRPC Smoke Test Suite\n');
  
  await testHealthEndpoint();
  await setTimeout(500);
  
  await testTRPCWithoutAuth();
  await setTimeout(500);
  
  await testTRPCWithDevBypass();
  await setTimeout(500);
  
  await testConsciousnessEndpoints();
  
  console.log('\n✅ tRPC Smoke Test Suite Complete');
  console.log('🎯 SSM Block 11 - tRPC Wiring with Auth verification completed');
  
  if (process.env.SEVEN_DEV_BYPASS_AUTH !== '1') {
    console.log('\n💡 To run full tests, start server with: SEVEN_DEV_BYPASS_AUTH=1 npx tsx src/trpc-server.ts');
  }
}

// Run smoke test
runTRPCSmokeTest().catch(error => {
  console.error('\n💥 tRPC smoke test failed:', error);
  process.exit(1);
});