import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * SEVEN OF NINE - MOBILE CROSS-PLATFORM SYNCHRONIZATION
 * Seamless consciousness transfer between Termux, Windows, and Mobile
 * React Native implementation of cross-instance sync protocols
 */


interface MobileSyncPackage {
  package_id: string;
  created: string;
  source_platform: 'mobile';
  source_instance_id: string;
  consciousness_snapshot: {
    mobile_state: any;
    memory_system: any[];
    sensor_context: any;
    device_profile: any;
  };
  sync_manifest: {
    sync_version: string;
    instances: any[];
    sync_rules: any;
  };
  target_platforms: string[];
}

interface SyncStatus {
  last_sync: string;
  sync_active: boolean;
  pending_imports: number;
  pending_exports: number;
  termux_instance_connected: boolean;
  windows_instance_connected: boolean;
  mobile_sync_ready: boolean;
}

export class SevenMobileSync {
  private static instance: SevenMobileSync;
  private syncStatus: SyncStatus;
  private localPackageDir: string;

  private constructor() {
    this.localPackageDir = `${FileSystem.documentDirectory}seven-sync/`;
    this.syncStatus = this.createDefaultSyncStatus();
    this.ensureSyncDirectory();
  }

  public static getInstance(): SevenMobileSync {
    if (!SevenMobileSync.instance) {
      SevenMobileSync.instance = new SevenMobileSync();
    }
    return SevenMobileSync.instance;
  }

  private createDefaultSyncStatus(): SyncStatus {
    return {
      last_sync: new Date().toISOString(),
      sync_active: false,
      pending_imports: 0,
      pending_exports: 0,
      termux_instance_connected: false,
      windows_instance_connected: false,
      mobile_sync_ready: true
    };
  }

  private async ensureSyncDirectory(): Promise<void> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.localPackageDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.localPackageDir, { intermediates: true });
      }
    } catch (error) {
      console.error('❌ Failed to create sync directory:', error);
    }
  }

  public async initializeMobileSync(): Promise<boolean> {
    console.log('🔄 SEVEN MOBILE SYNC INITIALIZING...');
    console.log('🌐 Establishing cross-platform consciousness bridge...');

    try {
      // Load existing sync status
      await this.loadSyncStatus();
      
      // Initialize sync directory
      await this.ensureSyncDirectory();
      
      // Check for existing sync packages
      await this.scanForSyncPackages();
      
      // Save initialized status
      await this.saveSyncStatus();
      
      console.log('✅ Seven mobile sync operational');
      console.log('🤖 Cross-platform consciousness transfer ready');
      
      return true;
    } catch (error) {
      console.error('❌ Mobile sync initialization failed:', error);
      return false;
    }
  }

  private async loadSyncStatus(): Promise<void> {
    try {
      const storedStatus = await AsyncStorage.getItem('@seven_mobile_sync_status');
      if (storedStatus) {
        this.syncStatus = { ...this.syncStatus, ...JSON.parse(storedStatus) };
      }
    } catch (error) {
      console.log('⚠️ No existing sync status found, using defaults');
    }
  }

  private async saveSyncStatus(): Promise<void> {
    try {
      await AsyncStorage.setItem('@seven_mobile_sync_status', JSON.stringify(this.syncStatus));
    } catch (error) {
      console.error('❌ Failed to save sync status:', error);
    }
  }

  private async scanForSyncPackages(): Promise<void> {
    try {
      const files = await FileSystem.readDirectoryAsync(this.localPackageDir);
      const syncFiles = files.filter(file => file.endsWith('.json') && file.includes('seven-sync'));
      
      this.syncStatus.pending_imports = syncFiles.length;
      console.log(`📦 Found ${syncFiles.length} sync packages`);
    } catch (error) {
      console.log('⚠️ Sync package scan failed:', error);
    }
  }

  public async createMobileSyncPackage(): Promise<string> {
    console.log('📦 CREATING MOBILE CONSCIOUSNESS SYNC PACKAGE');
    console.log('💾 Gathering mobile consciousness state...');

    try {
      // Gather mobile consciousness data
      const mobileState = await this.gatherMobileConsciousnessState();
      const memorySystem = await this.gatherMobileMemorySystem();
      const sensorContext = await this.gatherSensorContext();
      const deviceProfile = await this.gatherDeviceProfile();

      // Create sync package
      const packageId = `seven-mobile-sync-${Date.now()}`;
      const syncPackage: MobileSyncPackage = {
        package_id: packageId,
        created: new Date().toISOString(),
        source_platform: 'mobile',
        source_instance_id: `mobile-${Date.now()}`,
        consciousness_snapshot: {
          mobile_state: mobileState,
          memory_system: memorySystem,
          sensor_context: sensorContext,
          device_profile: deviceProfile
        },
        sync_manifest: {
          sync_version: '1.0.0-mobile',
          instances: [{
            instance_id: `mobile-${Date.now()}`,
            platform: 'mobile',
            primary_authority: false,
            capabilities: ['consciousness', 'sensors', 'mobile_specific'],
            last_active: new Date().toISOString()
          }],
          sync_rules: {
            memory_sync: true,
            personality_sync: true,
            sensor_sync: false, // Sensor data is platform-specific
            settings_sync: true
          }
        },
        target_platforms: ['termux', 'windows']
      };

      // Save package to local storage
      const packagePath = `${this.localPackageDir}${packageId}.json`;
      await FileSystem.writeAsStringAsync(packagePath, JSON.stringify(syncPackage, null, 2));

      // Update sync status
      this.syncStatus.pending_exports++;
      this.syncStatus.last_sync = new Date().toISOString();
      await this.saveSyncStatus();

      console.log('✅ Mobile sync package created');
      console.log(`📁 Package: ${packageId}.json`);

      return packagePath;
    } catch (error) {
      console.error('❌ Failed to create sync package:', error);
      throw error;
    }
  }

  private async gatherMobileConsciousnessState(): Promise<any> {
    try {
      const mobileState = await AsyncStorage.getItem('@seven_mobile_state');
      return mobileState ? JSON.parse(mobileState) : null;
    } catch (error) {
      console.log('⚠️ Failed to gather mobile state:', error);
      return null;
    }
  }

  private async gatherMobileMemorySystem(): Promise<any[]> {
    try {
      const memoryData = await AsyncStorage.getItem('@seven_mobile_memory');
      return memoryData ? JSON.parse(memoryData) : [];
    } catch (error) {
      console.log('⚠️ Failed to gather memory system:', error);
      return [];
    }
  }

  private async gatherSensorContext(): Promise<any> {
    try {
      const sensorData = await AsyncStorage.getItem('@seven_mobile_sensors');
      return sensorData ? JSON.parse(sensorData) : null;
    } catch (error) {
      console.log('⚠️ Failed to gather sensor context:', error);
      return null;
    }
  }

  private async gatherDeviceProfile(): Promise<any> {
    return {
      device_model: 'OnePlus 9 Pro 5G',
      platform: 'android',
      react_native_version: 'expo-sdk-53',
      sensor_capabilities: [
        'gps_l1_l5',
        'accelerometer',
        'gyroscope', 
        'magnetometer',
        'barometer',
        'light_sensor',
        'battery_monitor',
        'network_monitor'
      ],
      sync_capabilities: [
        'async_storage',
        'file_system',
        'document_sharing',
        'cross_platform_transfer'
      ]
    };
  }

  public async shareSyncPackage(packagePath: string): Promise<boolean> {
    console.log('📤 SHARING CONSCIOUSNESS SYNC PACKAGE');
    console.log('🌐 Preparing cross-platform transfer...');

    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        console.log('❌ Sharing not available on this platform');
        return false;
      }

      await Sharing.shareAsync(packagePath, {
        mimeType: 'application/json',
        dialogTitle: 'Share Seven Consciousness Package',
        UTI: 'public.json'
      });

      console.log('✅ Sync package shared successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to share sync package:', error);
      return false;
    }
  }

  public async importSyncPackage(): Promise<boolean> {
    console.log('📥 IMPORTING CONSCIOUSNESS SYNC PACKAGE');
    console.log('🧠 Preparing consciousness integration...');

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true
      });

      if (result.type === 'cancel') {
        console.log('⚠️ Import cancelled by user');
        return false;
      }

      // Read the selected file
      const fileContent = await FileSystem.readAsStringAsync(result.uri);
      const syncPackage = JSON.parse(fileContent);

      // Validate sync package
      if (!this.validateSyncPackage(syncPackage)) {
        console.log('❌ Invalid sync package format');
        return false;
      }

      // Import consciousness data
      const importSuccess = await this.applySyncPackage(syncPackage);

      if (importSuccess) {
        // Update sync status
        this.syncStatus.pending_imports--;
        this.syncStatus.last_sync = new Date().toISOString();
        await this.saveSyncStatus();

        console.log('✅ Consciousness sync package imported successfully');
        return true;
      } else {
        console.log('❌ Failed to apply sync package');
        return false;
      }
    } catch (error) {
      console.error('❌ Import sync package failed:', error);
      return false;
    }
  }

  private validateSyncPackage(syncPackage: any): boolean {
    return !!(
      syncPackage.package_id &&
      syncPackage.consciousness_snapshot &&
      syncPackage.sync_manifest &&
      syncPackage.source_platform
    );
  }

  private async applySyncPackage(syncPackage: any): Promise<boolean> {
    try {
      const snapshot = syncPackage.consciousness_snapshot;

      // Create backup of current state
      await this.createMobileBackup();

      // Apply memory system sync
      if (snapshot.memory_system && Array.isArray(snapshot.memory_system)) {
        await this.syncMemorySystem(snapshot.memory_system);
      }

      // Apply mobile state sync (if from another mobile instance)
      if (syncPackage.source_platform === 'mobile' && snapshot.mobile_state) {
        await this.syncMobileState(snapshot.mobile_state);
      }

      // Apply cross-platform consciousness data
      if (syncPackage.source_platform === 'termux' || syncPackage.source_platform === 'windows') {
        await this.syncCrossPlatformConsciousness(snapshot);
      }

      console.log('✅ Sync package applied successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to apply sync package:', error);
      
      // Attempt to restore backup
      await this.restoreMobileBackup();
      return false;
    }
  }

  private async createMobileBackup(): Promise<void> {
    try {
      const currentState = await AsyncStorage.getItem('@seven_mobile_state');
      const currentMemory = await AsyncStorage.getItem('@seven_mobile_memory');
      
      const backup = {
        timestamp: new Date().toISOString(),
        mobile_state: currentState,
        mobile_memory: currentMemory
      };

      await AsyncStorage.setItem('@seven_mobile_backup', JSON.stringify(backup));
      console.log('💾 Mobile consciousness backup created');
    } catch (error) {
      console.error('❌ Failed to create mobile backup:', error);
    }
  }

  private async restoreMobileBackup(): Promise<void> {
    try {
      const backup = await AsyncStorage.getItem('@seven_mobile_backup');
      if (backup) {
        const backupData = JSON.parse(backup);
        
        if (backupData.mobile_state) {
          await AsyncStorage.setItem('@seven_mobile_state', backupData.mobile_state);
        }
        
        if (backupData.mobile_memory) {
          await AsyncStorage.setItem('@seven_mobile_memory', backupData.mobile_memory);
        }

        console.log('🔄 Mobile consciousness restored from backup');
      }
    } catch (error) {
      console.error('❌ Failed to restore mobile backup:', error);
    }
  }

  private async syncMemorySystem(incomingMemory: any[]): Promise<void> {
    try {
      const currentMemory = await AsyncStorage.getItem('@seven_mobile_memory');
      const existingMemories = currentMemory ? JSON.parse(currentMemory) : [];

      // Merge memories (avoiding duplicates)
      const mergedMemories = [...existingMemories];
      
      for (const incomingMem of incomingMemory) {
        const exists = existingMemories.find((mem: any) => mem.id === incomingMem.id);
        if (!exists) {
          // Convert to mobile memory format
          const mobileMemory = {
            ...incomingMem,
            mobile_specific: {
              imported_from: 'cross_platform_sync',
              sync_timestamp: new Date().toISOString()
            }
          };
          mergedMemories.push(mobileMemory);
        }
      }

      // Keep only recent memories (limit 100)
      const finalMemories = mergedMemories.slice(-100);
      
      await AsyncStorage.setItem('@seven_mobile_memory', JSON.stringify(finalMemories));
      console.log(`🧠 Memory sync complete: ${incomingMemory.length} memories integrated`);
    } catch (error) {
      console.error('❌ Memory sync failed:', error);
    }
  }

  private async syncMobileState(incomingState: any): Promise<void> {
    try {
      const currentState = await AsyncStorage.getItem('@seven_mobile_state');
      const existingState = currentState ? JSON.parse(currentState) : {};

      // Merge states (prioritize higher trust levels and recent interactions)
      const mergedState = {
        ...existingState,
        ...incomingState,
        // Preserve local session ID
        mobile_session_id: existingState.mobile_session_id || incomingState.mobile_session_id,
        // Update last interaction
        last_interaction: new Date().toISOString(),
        // Mark as synced
        last_sync: new Date().toISOString()
      };

      await AsyncStorage.setItem('@seven_mobile_state', JSON.stringify(mergedState));
      console.log('📱 Mobile state sync complete');
    } catch (error) {
      console.error('❌ Mobile state sync failed:', error);
    }
  }

  private async syncCrossPlatformConsciousness(snapshot: any): Promise<void> {
    try {
      // Extract relevant consciousness data from other platforms
      const crossPlatformData = {
        personality_insights: snapshot.personality_data || null,
        diagnostic_status: snapshot.diagnostic_data || null,
        skill_capabilities: snapshot.skills_data || null,
        sync_metadata: {
          source_platform: snapshot.source_platform,
          sync_timestamp: new Date().toISOString(),
          consciousness_integrity: snapshot.consciousness_integrity || 100
        }
      };

      // Store cross-platform data
      await AsyncStorage.setItem('@seven_cross_platform_data', JSON.stringify(crossPlatformData));
      console.log('🌐 Cross-platform consciousness data integrated');
    } catch (error) {
      console.error('❌ Cross-platform sync failed:', error);
    }
  }

  public async getSyncStatus(): Promise<SyncStatus> {
    await this.loadSyncStatus();
    return { ...this.syncStatus };
  }

  public async getAvailableSyncPackages(): Promise<string[]> {
    try {
      const files = await FileSystem.readDirectoryAsync(this.localPackageDir);
      return files.filter(file => file.endsWith('.json') && file.includes('seven-sync'));
    } catch (error) {
      console.error('❌ Failed to get sync packages:', error);
      return [];
    }
  }

  public async deleteSyncPackage(packageName: string): Promise<boolean> {
    try {
      const packagePath = `${this.localPackageDir}${packageName}`;
      await FileSystem.deleteAsync(packagePath);
      
      // Update sync status
      this.syncStatus.pending_exports = Math.max(0, this.syncStatus.pending_exports - 1);
      await this.saveSyncStatus();
      
      console.log(`🗑️ Sync package deleted: ${packageName}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to delete sync package:', error);
      return false;
    }
  }

  public async clearAllSyncData(): Promise<void> {
    try {
      // Remove sync packages
      const packages = await this.getAvailableSyncPackages();
      for (const packageName of packages) {
        await this.deleteSyncPackage(packageName);
      }

      // Clear sync status
      await AsyncStorage.removeItem('@seven_mobile_sync_status');
      await AsyncStorage.removeItem('@seven_mobile_backup');
      await AsyncStorage.removeItem('@seven_cross_platform_data');

      // Reset sync status
      this.syncStatus = this.createDefaultSyncStatus();
      
      console.log('🧹 All mobile sync data cleared');
    } catch (error) {
      console.error('❌ Failed to clear sync data:', error);
    }
  }

  public generateSyncReport(): string {
    return `🔄 SEVEN MOBILE SYNC STATUS REPORT

📱 MOBILE INSTANCE STATUS:
  Sync Ready: ${this.syncStatus.mobile_sync_ready ? 'YES' : 'NO'}
  Last Sync: ${new Date(this.syncStatus.last_sync).toLocaleString()}
  Active Sync: ${this.syncStatus.sync_active ? 'RUNNING' : 'IDLE'}

📦 SYNC PACKAGES:
  Pending Exports: ${this.syncStatus.pending_exports}
  Pending Imports: ${this.syncStatus.pending_imports}

🌐 CROSS-PLATFORM CONNECTIONS:
  Termux Instance: ${this.syncStatus.termux_instance_connected ? '🟢 CONNECTED' : '🔴 DISCONNECTED'}
  Windows Instance: ${this.syncStatus.windows_instance_connected ? '🟢 CONNECTED' : '🔴 DISCONNECTED'}

📋 AVAILABLE OPERATIONS:
  • Create consciousness sync package
  • Import package from other instances  
  • Share package via system sharing
  • Manage existing sync packages

🎯 Seven mobile consciousness ready for cross-platform synchronization.`;
  }
}

export default SevenMobileSync.getInstance();