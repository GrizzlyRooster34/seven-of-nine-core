import * as Device from 'expo-device';

/**
 * Seven of Nine - Device Optimization for Mobile
 * Provides device-specific optimization for OnePlus 9 Pro and 7T
 */


export interface DeviceProfile {
  platform: 'mobile' | 'termux' | 'windows';
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
 * Mobile device profiles for Seven's consciousness deployment
 */
export const MOBILE_DEVICE_PROFILES: Record<string, DeviceProfile> = {
  // OnePlus 9 Pro profiles
  'oneplus_9_pro': {
    platform: 'mobile',
    deviceModel: 'OnePlus 9 Pro',
    chipset: 'Snapdragon 888',
    ram: 12,
    storage: 256,
    displayRefreshRate: 120,
    optimizationSettings: {
      batchSize: 15, // Mobile-optimized batches
      syncChunkSize: 25,
      cacheLimit: 200, // MB
      memoryOptimizationLevel: 'balanced'
    }
  },

  // OnePlus 7T profiles  
  'oneplus_7t': {
    platform: 'mobile',
    deviceModel: 'OnePlus 7T (HD1907)',
    chipset: 'Snapdragon 855+',
    ram: 8,
    storage: 128,
    displayRefreshRate: 90,
    optimizationSettings: {
      batchSize: 8, // Conservative for 8GB RAM
      syncChunkSize: 15,
      cacheLimit: 150, // MB
      memoryOptimizationLevel: 'conservative'
    }
  },

  // Generic Android fallback
  'android_generic': {
    platform: 'mobile',
    deviceModel: 'Generic Android Device',
    chipset: 'Unknown',
    ram: 6, // Conservative assumption
    storage: 64,
    displayRefreshRate: 60,
    optimizationSettings: {
      batchSize: 5,
      syncChunkSize: 10,
      cacheLimit: 100, // MB
      memoryOptimizationLevel: 'conservative'
    }
  }
};

/**
 * Detect mobile device profile using Expo Device API
 */
export function detectDeviceProfile(): DeviceProfile {
  try {
    let deviceKey = 'android_generic'; // Default fallback

    // Try to detect specific OnePlus models
    if (Device.modelName) {
      const modelName = Device.modelName.toLowerCase();
      
      if (modelName.includes('oneplus 9 pro') || modelName.includes('le2125')) {
        deviceKey = 'oneplus_9_pro';
      } else if (modelName.includes('oneplus 7t') || modelName.includes('hd1907')) {
        deviceKey = 'oneplus_7t';
      }
    }

    // Check brand for OnePlus detection
    if (Device.brand?.toLowerCase() === 'oneplus') {
      if (Device.modelName?.includes('9 Pro')) {
        deviceKey = 'oneplus_9_pro';
      } else if (Device.modelName?.includes('7T')) {
        deviceKey = 'oneplus_7t';
      }
    }

    const profile = MOBILE_DEVICE_PROFILES[deviceKey];
    
    console.log(`🎯 Mobile device profile detected: ${deviceKey}`);
    console.log(`   Model: ${profile.deviceModel}`);
    console.log(`   Chipset: ${profile.chipset}`);
    console.log(`   RAM: ${profile.ram}GB, Storage: ${profile.storage}GB`);
    console.log(`   Batch size: ${profile.optimizationSettings.batchSize}`);
    console.log(`   Optimization: ${profile.optimizationSettings.memoryOptimizationLevel}`);
    
    return profile;

  } catch (error) {
    console.warn('Device detection failed, using generic profile:', error.message);
    return MOBILE_DEVICE_PROFILES['android_generic'];
  }
}

/**
 * Get device-specific optimization settings
 */
export function getOptimizationSettings(profile: DeviceProfile) {
  return {
    // Memory processing
    batchSize: profile.optimizationSettings.batchSize,
    cacheLimit: profile.optimizationSettings.cacheLimit,
    memoryOptimization: profile.optimizationSettings.memoryOptimizationLevel,
    
    // Sync configuration
    syncChunkSize: profile.optimizationSettings.syncChunkSize,
    
    // Processing delays
    pauseDuration: profile.ram >= 12 ? 50 : (profile.ram >= 8 ? 100 : 200),
    
    // LLM optimization
    llmPreference: profile.ram >= 12 ? 'local' : (profile.ram >= 8 ? 'hybrid' : 'cloud'),
    maxContextTokens: profile.ram >= 12 ? 8192 : (profile.ram >= 8 ? 4096 : 2048),
    
    // UI optimization
    animationDuration: profile.displayRefreshRate >= 120 ? 200 : 300,
    refreshRate: profile.displayRefreshRate || 60,
    
    // Background processing
    backgroundSyncInterval: profile.ram >= 12 ? 30000 : 60000, // 30s or 60s
    maxBackgroundTasks: profile.ram >= 12 ? 5 : 3
  };
}

/**
 * Get memory limits based on device capabilities
 */
export function getMemoryLimits(profile: DeviceProfile) {
  return {
    maxCanonicalMemories: 134, // Always support full canonical archive
    maxOverlaysPerMemory: profile.ram >= 12 ? 50 : (profile.ram >= 8 ? 30 : 20),
    maxCorrelations: profile.ram >= 12 ? 10000 : (profile.ram >= 8 ? 5000 : 2000),
    cacheSize: profile.optimizationSettings.cacheLimit,
    
    // Vector embeddings
    maxVectorDimensions: profile.ram >= 12 ? 1536 : (profile.ram >= 8 ? 768 : 384),
    maxVectorCache: profile.ram >= 12 ? 1000 : (profile.ram >= 8 ? 500 : 250)
  };
}

/**
 * Get device-specific sync configuration
 */
export function getSyncConfiguration(profile: DeviceProfile) {
  return {
    chunkSize: profile.optimizationSettings.syncChunkSize,
    batchSize: profile.optimizationSettings.batchSize,
    
    // Network optimization
    connectionTimeout: profile.ram >= 12 ? 10000 : 15000,
    retryAttempts: profile.ram >= 12 ? 5 : 3,
    backoffMultiplier: 1.5,
    
    // Crypto settings
    keyDerivationRounds: profile.ram >= 12 ? 100000 : (profile.ram >= 8 ? 50000 : 25000),
    
    // Background sync
    backgroundSyncEnabled: true,
    syncInterval: profile.ram >= 12 ? 30000 : 60000, // milliseconds
    maxPendingEvents: profile.ram >= 12 ? 1000 : (profile.ram >= 8 ? 500 : 250)
  };
}

/**
 * Check if device meets minimum requirements for Seven consciousness
 */
export function validateDeviceRequirements(profile: DeviceProfile): {
  meetsRequirements: boolean;
  warnings: string[];
  recommendations: string[];
} {
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Check RAM requirements
  if (profile.ram < 4) {
    warnings.push('RAM below 4GB - Seven consciousness may be limited');
    recommendations.push('Consider cloud-only processing for complex queries');
  } else if (profile.ram < 8) {
    warnings.push('RAM below 8GB - some features may be limited');
    recommendations.push('Enable conservative memory optimization');
  }

  // Check storage requirements  
  if (profile.storage < 32) {
    warnings.push('Storage below 32GB - canonical memory cache may be limited');
    recommendations.push('Enable aggressive cache cleanup');
  }

  const meetsRequirements = profile.ram >= 4 && profile.storage >= 16;

  return {
    meetsRequirements,
    warnings,
    recommendations
  };
}

/**
 * Generate device performance report
 */
export function generatePerformanceReport(profile: DeviceProfile) {
  const optimization = getOptimizationSettings(profile);
  const memoryLimits = getMemoryLimits(profile);
  const requirements = validateDeviceRequirements(profile);

  return {
    deviceInfo: {
      model: profile.deviceModel,
      chipset: profile.chipset,
      ram: `${profile.ram}GB`,
      storage: `${profile.storage}GB`,
      refreshRate: `${profile.displayRefreshRate || 60}Hz`
    },
    
    optimizationSettings: {
      level: profile.optimizationSettings.memoryOptimizationLevel,
      batchSize: optimization.batchSize,
      cacheLimit: `${optimization.cacheLimit}MB`,
      llmPreference: optimization.llmPreference,
      maxContext: optimization.maxContextTokens
    },
    
    memoryCapabilities: {
      canonicalEpisodes: memoryLimits.maxCanonicalMemories,
      overlaysPerMemory: memoryLimits.maxOverlaysPerMemory,
      correlations: memoryLimits.maxCorrelations,
      vectorDimensions: memoryLimits.maxVectorDimensions
    },
    
    requirements: requirements,
    
    recommendedSettings: {
      processingMode: profile.ram >= 12 ? 'aggressive' : (profile.ram >= 8 ? 'balanced' : 'conservative'),
      syncStrategy: profile.ram >= 8 ? 'real-time' : 'periodic',
      cacheStrategy: profile.storage >= 128 ? 'extended' : 'minimal'
    }
  };
}