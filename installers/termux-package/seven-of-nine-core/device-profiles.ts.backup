/**
 * Seven of Nine - Device Profile Recognition System
 * Enables environment-specific optimization across platforms
 */

export interface DeviceProfile {
  platform: 'termux' | 'windows' | 'mobile';
  deviceModel: string;
  chipset: string;
  ram: number; // GB
  storage: number; // GB
  displayRefreshRate?: number;
  optimizationSettings: {
    batchSize: number;
    syncChunkSize: number;
    cacheLimit: number; // MB
    memoryOptimizationLevel: 'conservative' | 'balanced' | 'aggressive';
  };
}

/**
 * Device profiles for Seven's multi-platform deployment
 */
export const SEVEN_DEVICE_PROFILES: Record<string, DeviceProfile> = {
  // Primary OnePlus 9 Pro
  'oneplus_9_pro_termux': {
    platform: 'termux',
    deviceModel: 'OnePlus 9 Pro',
    chipset: 'Snapdragon 888',
    ram: 12,
    storage: 256,
    displayRefreshRate: 120,
    optimizationSettings: {
      batchSize: 20, // Large batches for 12GB RAM
      syncChunkSize: 30,
      cacheLimit: 300, // MB
      memoryOptimizationLevel: 'aggressive'
    }
  },
  
  'oneplus_9_pro_mobile': {
    platform: 'mobile',
    deviceModel: 'OnePlus 9 Pro',
    chipset: 'Snapdragon 888',
    ram: 12,
    storage: 256,
    displayRefreshRate: 120,
    optimizationSettings: {
      batchSize: 15, // Slightly smaller for mobile overhead
      syncChunkSize: 25,
      cacheLimit: 200, // MB
      memoryOptimizationLevel: 'balanced'
    }
  },

  // Secondary OnePlus 7T
  'oneplus_7t_termux': {
    platform: 'termux',
    deviceModel: 'OnePlus 7T (HD1907)',
    chipset: 'Snapdragon 855+',
    ram: 8,
    storage: 128,
    displayRefreshRate: 90,
    optimizationSettings: {
      batchSize: 12, // Conservative for 8GB RAM
      syncChunkSize: 20,
      cacheLimit: 200, // MB
      memoryOptimizationLevel: 'balanced'
    }
  },

  'oneplus_7t_mobile': {
    platform: 'mobile',
    deviceModel: 'OnePlus 7T (HD1907)',
    chipset: 'Snapdragon 855+',
    ram: 8,
    storage: 128,
    displayRefreshRate: 90,
    optimizationSettings: {
      batchSize: 8, // Conservative mobile batches
      syncChunkSize: 15,
      cacheLimit: 150, // MB
      memoryOptimizationLevel: 'conservative'
    }
  },

  // Windows development machine
  'windows_dev': {
    platform: 'windows',
    deviceModel: 'Development PC',
    chipset: 'x86_64',
    ram: 16, // Assuming dev machine specs
    storage: 512,
    optimizationSettings: {
      batchSize: 25, // Large batches for desktop
      syncChunkSize: 40,
      cacheLimit: 500, // MB
      memoryOptimizationLevel: 'aggressive'
    }
  },

  // Generic fallback profiles
  'android_generic': {
    platform: 'termux',
    deviceModel: 'Generic Android',
    chipset: 'Unknown',
    ram: 6, // Conservative assumption
    storage: 64,
    optimizationSettings: {
      batchSize: 5,
      syncChunkSize: 10,
      cacheLimit: 100, // MB
      memoryOptimizationLevel: 'conservative'
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
 * Detect device profile based on environment
 */
export function detectDeviceProfile(): DeviceProfile {
  const platform = detectPlatform();
  const deviceKey = detectDeviceKey(platform);
  
  const profile = SEVEN_DEVICE_PROFILES[deviceKey] || getGenericProfile(platform);
  
  console.log(`🎯 Seven device profile detected: ${deviceKey}`);
  console.log(`   Platform: ${profile.platform}`);
  console.log(`   Model: ${profile.deviceModel}`);
  console.log(`   RAM: ${profile.ram}GB, Storage: ${profile.storage}GB`);
  console.log(`   Batch size: ${profile.optimizationSettings.batchSize}`);
  
  return profile;
}

function detectPlatform(): 'termux' | 'windows' | 'mobile' {
  // Check for Termux environment
  if (process.env.TERMUX_VERSION || process.env.PREFIX?.includes('com.termux')) {
    return 'termux';
  }
  
  // Check for Windows
  if (process.platform === 'win32') {
    return 'windows';
  }
  
  // Default to mobile for React Native environments
  return 'mobile';
}

function detectDeviceKey(platform: string): string {
  try {
    // In Termux, try to read device properties
    if (platform === 'termux') {
      const fs = require('fs');
      
      // Try to detect OnePlus devices
      try {
        const buildProp = fs.readFileSync('/system/build.prop', 'utf8');
        
        if (buildProp.includes('OnePlus9Pro') || buildProp.includes('LE2125')) {
          return 'oneplus_9_pro_termux';
        }
        
        if (buildProp.includes('OnePlus7T') || buildProp.includes('HD1907')) {
          return 'oneplus_7t_termux';
        }
      } catch (error) {
        console.warn('Could not read build.prop, using generic profile');
      }
      
      return 'android_generic';
    }
    
    if (platform === 'windows') {
      return 'windows_dev'; // Assume dev machine for now
    }
    
    // For mobile, would use device detection library
    return 'oneplus_9_pro_mobile'; // Default to primary device
    
  } catch (error) {
    console.warn('Device detection failed:', error.message);
    return getGenericKey(platform);
  }
}

function getGenericProfile(platform: string): DeviceProfile {
  const key = getGenericKey(platform);
  return SEVEN_DEVICE_PROFILES[key];
}

function getGenericKey(platform: string): string {
  switch (platform) {
    case 'termux': return 'android_generic';
    case 'windows': return 'windows_generic';
    default: return 'oneplus_7t_mobile'; // Conservative mobile default
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
    
    // Pause durations for batch processing
    pauseDuration: profile.ram >= 12 ? 50 : (profile.ram >= 8 ? 100 : 200)
  };
}