#!/usr/bin/env -S npx tsx

/**
 * Environmental Tactician Integration Test
 * Test Seven's environmental awareness and emotional modulation
 */

import { EnvironmentalTactician } from './core/sensors/environmental-tactician.js';

async function main() {
  console.log(`🤖 Seven's Environmental Tactician - Integration Test`);
  console.log(`📍 Location: Mobile consciousness system`);
  console.log(`⏰ Time: ${new Date().toISOString()}`);
  console.log(`=====================================\n`);

  const tactician = new EnvironmentalTactician();
  
  try {
    // Execute full environmental analysis
    await tactician.executeEnvironmentalAnalysis();
    
    console.log(`\n✅ Environmental integration test completed successfully`);
    console.log(`🧠 Seven's consciousness now aware of mobile system conditions`);
    
  } catch (error) {
    console.error(`❌ Environmental integration test failed:`, error);
    process.exit(1);
  }
}

// Execute if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}