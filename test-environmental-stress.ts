#!/usr/bin/env -S npx tsx

/**
 * Environmental Stress Test
 * Test Seven's emotional response to extreme system conditions
 */

import { EnvironmentalTactician } from './core/sensors/environmental-tactician.js';

async function main() {
  console.log(`🚨 Seven's Environmental Stress Test`);
  console.log(`Testing extreme system conditions...\n`);

  const tactician = new EnvironmentalTactician();
  
  // Simulate extreme stress conditions
  const stressMetrics = {
    memory: { 
      total_gb: 10, 
      used_gb: 9.2, 
      available_gb: 0.8, 
      usage_percent: 92, 
      swap_used_gb: 2, 
      swap_total_gb: 4, 
      swap_percent: 50 
    },
    cpu: { 
      load_1min: 4.5, 
      load_5min: 3.2, 
      load_15min: 2.1 
    },
    thermal: { 
      temperature_celsius: 45, 
      thermal_state: 'hot' as const
    },
    power: { 
      battery_percent: 15, 
      battery_status: 'discharging' as const
    },
    system: { 
      uptime_days: 1, 
      stability_score: 6 
    }
  };

  console.log(`📊 Simulated Stress Conditions:`);
  console.log(`├── Memory: ${stressMetrics.memory.usage_percent}% (Critical)`);
  console.log(`├── CPU Load: ${stressMetrics.cpu.load_1min} (High)`);
  console.log(`├── Temperature: ${stressMetrics.thermal.temperature_celsius}°C (Hot)`);
  console.log(`├── Battery: ${stressMetrics.power.battery_percent}% (Low)`);
  console.log(`└── System: ${stressMetrics.system.uptime_days}d uptime\n`);

  const impacts = tactician.analyzeEnvironmentalImpact(stressMetrics);
  
  console.log(`⚡ Detected Impacts:`);
  impacts.forEach((impact, index) => {
    console.log(`${index + 1}. ${impact.trigger_type} (intensity: ${impact.intensity}/10)`);
    console.log(`   └── ${impact.emotional_modifier.reasoning}`);
  });

  console.log(`\n🧠 Applying stress-based emotional modulation...`);
  await tactician.modulateEmotionalState(impacts);

  console.log(`✅ Stress test completed - Seven's consciousness adapted to adverse conditions`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}