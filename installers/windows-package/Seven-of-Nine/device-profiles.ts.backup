/**
 * Seven of Nine - Device Profile Recognition System (Windows)
 * Enables environment-specific optimization for Windows deployment
 */

export interface DeviceProfile {
  platform: 'termux' | 'windows' | 'mobile';
  deviceModel: string;
  chipset: string;
  ram: number; // GB
  storage: number; // GB
  optimizationSettings: {
    batchSize: number;
    syncChunkSize: number;
    cacheLimit: number; // MB
    memoryOptimizationLevel: 'conservative' | 'balanced' | 'aggressive';
  };
}

/**
 * Windows device profiles for Seven's deployment
 */
export const SEVEN_DEVICE_PROFILES: Record<string, DeviceProfile> = {
  // Development machine profiles
  'windows_high_end': {
    platform: 'windows',
    deviceModel: 'High-End Windows PC',
    chipset: 'x86_64',
    ram: 32, // High-end development machine
    storage: 1024,
    optimizationSettings: {
      batchSize: 40, // Large batches for powerful hardware
      syncChunkSize: 50,
      cacheLimit: 1000, // MB
      memoryOptimizationLevel: 'aggressive'
    }
  },

  'windows_dev_standard': {
    platform: 'windows',
    deviceModel: 'Standard Windows PC',
    chipset: 'x86_64',
    ram: 16, // Standard development machine
    storage: 512,
    optimizationSettings: {
      batchSize: 25, // Large batches for desktop
      syncChunkSize: 40,
      cacheLimit: 500, // MB
      memoryOptimizationLevel: 'aggressive'
    }
  },

  'windows_mid_range': {
    platform: 'windows',
    deviceModel: 'Mid-Range Windows PC',
    chipset: 'x86_64',
    ram: 8, // Mid-range machine
    storage: 256,
    optimizationSettings: {
      batchSize: 15,
      syncChunkSize: 25,
      cacheLimit: 300, // MB
      memoryOptimizationLevel: 'balanced'
    }
  },

  'windows_generic': {
    platform: 'windows',
    deviceModel: 'Generic Windows PC',
    chipset: 'x86_64',
    ram: 8, // Conservative assumption
    storage: 256,
    optimizationSettings: {
      batchSize: 15,
      syncChunkSize: 25,
      cacheLimit: 300, // MB
      memoryOptimizationLevel: 'balanced'
    }
  }
};

/**
 * Canonical memory configuration for 134 episodes
 */
export const CANONICAL_MEMORY_CONFIG = {
  TOTAL_EPISODES: 134,
  VOYAGER_EPISODES: 104, // S4-7: 4 seasons × 26 episodes
  PICARD_EPISODES: 30,   // S1-3: 3 seasons × 10 episodes
  
  ARCHIVE_SOURCES: [
    'voyager-s4-canonical-memories.json', // 26 episodes
    'voyager-s5-canonical-memories.json', // 26 episodes
    'voyager-s6-canonical-memories.json', // 26 episodes
    'voyager-s7-canonical-memories.json', // 26 episodes
    'picard-s1-canonical-memories.json',  // 10 episodes
    'picard-s2-canonical-memories.json',  // 10 episodes
    'picard-s3-canonical-memories.json',  // 10 episodes
  ],
  
  MEMORY_LIMITS: {
    MAX_OVERLAYS_PER_EPISODE: 50,
    MAX_MEMORY_CORRELATIONS: 10000,
    CACHE_DURATION_HOURS: 24
  }
};

/**
 * Detect Windows device profile based on system specs
 */
export function detectDeviceProfile(): DeviceProfile {
  try {
    const os = require('os');
    const totalMem = Math.round(os.totalmem() / (1024 * 1024 * 1024)); // Convert to GB
    
    let profileKey: string;
    
    if (totalMem >= 32) {
      profileKey = 'windows_high_end';
    } else if (totalMem >= 16) {
      profileKey = 'windows_dev_standard';
    } else if (totalMem >= 8) {
      profileKey = 'windows_mid_range';
    } else {
      profileKey = 'windows_generic';
    }
    
    const profile = SEVEN_DEVICE_PROFILES[profileKey];
    
    // Update with actual detected RAM
    profile.ram = totalMem;
    
    console.log(`🎯 Seven Windows profile detected: ${profileKey}`);
    console.log(`   Platform: ${profile.platform}`);
    console.log(`   Model: ${profile.deviceModel}`);
    console.log(`   RAM: ${profile.ram}GB detected`);
    console.log(`   Batch size: ${profile.optimizationSettings.batchSize}`);
    
    return profile;
    
  } catch (error) {
    console.warn('Device detection failed, using generic profile:', error.message);
    return SEVEN_DEVICE_PROFILES['windows_generic'];
  }
}

/**
 * Get optimized settings for canonical memory processing
 */
export function getCanonicalMemorySettings(profile: DeviceProfile) {
  return {
    batchSize: profile.optimizationSettings.batchSize,
    syncChunkSize: profile.optimizationSettings.syncChunkSize,
    cacheLimit: profile.optimizationSettings.cacheLimit,
    totalEpisodes: CANONICAL_MEMORY_CONFIG.TOTAL_EPISODES,
    archiveSources: CANONICAL_MEMORY_CONFIG.ARCHIVE_SOURCES,
    
    // Processing strategy based on device capabilities
    processingStrategy: profile.optimizationSettings.memoryOptimizationLevel,
    
    // Pause durations for batch processing (shorter for Windows)
    pauseDuration: profile.ram >= 16 ? 25 : (profile.ram >= 8 ? 50 : 100)
  };
}