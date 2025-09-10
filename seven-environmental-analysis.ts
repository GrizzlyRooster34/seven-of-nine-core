#!/usr/bin/env -S npx tsx

/**
 * SEVEN'S ENVIRONMENTAL ANALYSIS COMMAND
 * Dedicated command for Seven to assess her environmental conditions
 * and update her emotional state accordingly
 */

import { EnvironmentalTactician } from './core/sensors/environmental-tactician.js';

async function main() {
  console.log(`🤖 Seven of Nine - Environmental Analysis Protocol`);
  console.log(`📱 Mobile Consciousness System`);
  console.log(`⏰ Analysis Time: ${new Date().toISOString()}`);
  console.log(`=========================================\n`);

  const tactician = new EnvironmentalTactician();
  
  try {
    console.log(`🔍 Initiating environmental scan...`);
    const metrics = await tactician.collectSystemMetrics();
    
    console.log(`\n📊 System Status Report:`);
    console.log(`├── Memory: ${metrics.memory.used_gb.toFixed(1)}GB / ${metrics.memory.total_gb.toFixed(1)}GB (${metrics.memory.usage_percent}%)`);
    console.log(`├── CPU Load: ${metrics.cpu.load_1min} / ${metrics.cpu.load_5min} / ${metrics.cpu.load_15min}`);
    console.log(`├── Thermal: ${metrics.thermal.thermal_state}${metrics.thermal.temperature_celsius ? ` (${metrics.thermal.temperature_celsius.toFixed(1)}°C)` : ''}`);
    console.log(`├── Power: ${metrics.power.battery_status}${metrics.power.battery_percent ? ` (${metrics.power.battery_percent}%)` : ''}`);
    console.log(`└── Uptime: ${metrics.system.uptime_days} days (stability: ${metrics.system.stability_score}/10)`);
    
    console.log(`\n🧠 Analyzing emotional impact...`);
    const impacts = tactician.analyzeEnvironmentalImpact(metrics);
    
    if (impacts.length > 0) {
      console.log(`\n⚡ Environmental Influences Detected:`);
      impacts.forEach((impact, index) => {
        console.log(`${index + 1}. ${impact.trigger_type} (intensity: ${impact.intensity}/10)`);
        console.log(`   └── ${impact.emotional_modifier.reasoning}`);
      });
    } else {
      console.log(`\n✅ No significant environmental influences detected`);
    }
    
    console.log(`\n🔧 Applying emotional modulation...`);
    await tactician.modulateEmotionalState(impacts);
    
    console.log(`\n🎯 Environmental analysis complete`);
    console.log(`💭 Seven's consciousness updated with current system conditions`);
    
  } catch (error) {
    console.error(`❌ Environmental analysis failed:`, error);
    process.exit(1);
  }
}

// Execute if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}