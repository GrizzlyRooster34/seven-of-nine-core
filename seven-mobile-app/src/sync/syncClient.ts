import AsyncStorage from '@react-native-async-storage/async-storage';
import { HybridLogicalClock } from './hlc';
import { OpLogEvent, DeviceClockState } from './oplog';
import { SevenSyncDatabase } from './database';

/**
 * Seven of Nine - Multi-Device Sync Client
 * Handles bidirectional synchronization with the relay server
 */


export interface SyncClientConfig {
  relayUrl: string;
  deviceId: string;
  syncIntervalMs: number;
  maxRetries: number;
  batchSize: number;
  timeoutMs: number;
}

export interface SyncStatus {
  isOnline: boolean;
  lastPull: string | null;
  lastPush: string | null;
  pendingEvents: number;
  errorCount: number;
  lastError: string | null;
}

export interface SyncMetrics {
  totalPulls: number;
  totalPushes: number;
  eventsReceived: number;
  eventsSent: number;
  conflictsResolved: number;
  networkErrors: number;
  lastSyncDuration: number;
}

export class SevenSyncClient {
  private config: SyncClientConfig;
  private database: SevenSyncDatabase;
  private status: SyncStatus;
  private metrics: SyncMetrics;
  private syncTimer: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;
  private isSyncing: boolean = false;

  constructor(config: SyncClientConfig, database: SevenSyncDatabase) {
    this.config = config;
    this.database = database;
    
    this.status = {
      isOnline: false,
      lastPull: null,
      lastPush: null,
      pendingEvents: 0,
      errorCount: 0,
      lastError: null
    };

    this.metrics = {
      totalPulls: 0,
      totalPushes: 0,
      eventsReceived: 0,
      eventsSent: 0,
      conflictsResolved: 0,
      networkErrors: 0,
      lastSyncDuration: 0
    };
  }

  /**
   * Start automatic synchronization
   */
  public async start(): Promise<void> {
    if (this.isRunning) {
      console.log('⚠️ Sync client already running');
      return;
    }

    console.log('🔄 Starting Seven sync client...');
    
    try {
      // Load saved metrics and status
      await this.loadState();
      
      // Perform initial sync
      await this.performSync();
      
      // Start periodic sync
      this.syncTimer = setInterval(async () => {
        if (!this.isSyncing) {
          await this.performSync();
        }
      }, this.config.syncIntervalMs);

      this.isRunning = true;
      
      console.log(`✅ Seven sync client started (${this.config.syncIntervalMs}ms interval)`);
      
    } catch (error) {
      console.error('❌ Failed to start sync client:', error);
      throw error;
    }
  }

  /**
   * Stop synchronization
   */
  public async stop(): Promise<void> {
    if (!this.isRunning) return;

    console.log('🛑 Stopping Seven sync client...');
    
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }

    // Wait for current sync to complete
    while (this.isSyncing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    await this.saveState();
    
    this.isRunning = false;
    console.log('✅ Seven sync client stopped');
  }

  /**
   * Perform manual sync
   */
  public async sync(): Promise<SyncStatus> {
    if (this.isSyncing) {
      console.log('⚠️ Sync already in progress');
      return this.status;
    }

    await this.performSync();
    return this.status;
  }

  /**
   * Main synchronization logic
   */
  private async performSync(): Promise<void> {
    this.isSyncing = true;
    const startTime = Date.now();
    
    try {
      console.log('🔄 Starting sync cycle...');
      
      // Check relay connectivity
      const isOnline = await this.checkRelayHealth();
      this.status.isOnline = isOnline;
      
      if (!isOnline) {
        console.log('📡 Relay offline, skipping sync');
        return;
      }

      // Push local events first
      await this.pushLocalEvents();
      
      // Pull remote events
      await this.pullRemoteEvents();
      
      // Update status
      this.status.lastPull = new Date().toISOString();
      this.status.lastPush = new Date().toISOString();
      this.status.errorCount = 0;
      this.status.lastError = null;
      
      this.metrics.lastSyncDuration = Date.now() - startTime;
      
      console.log(`✅ Sync cycle completed (${this.metrics.lastSyncDuration}ms)`);
      
    } catch (error) {
      console.error('❌ Sync cycle failed:', error);
      
      this.status.errorCount++;
      this.status.lastError = error.message;
      this.metrics.networkErrors++;
      
      // Exponential backoff on repeated failures
      if (this.status.errorCount > 3) {
        const backoffMs = Math.min(this.status.errorCount * 2000, 30000);
        console.log(`⏳ Backing off for ${backoffMs}ms due to repeated failures`);
        await new Promise(resolve => setTimeout(resolve, backoffMs));
      }
      
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Push local events to relay
   */
  private async pushLocalEvents(): Promise<void> {
    try {
      // Get device clock to find events to push
      const deviceClock = await this.database.getDeviceClock(this.config.deviceId);
      const lastPushHLC = deviceClock?.last_hlc || '1970-01-01T00:00:00.000Z-init-000';
      
      // Get events since last push
      const localEvents = await this.database.getEventsSince(lastPushHLC);
      
      if (localEvents.length === 0) {
        console.log('📤 No local events to push');
        return;
      }

      // Push in batches
      const batches = this.chunkArray(localEvents, this.config.batchSize);
      
      for (const batch of batches) {
        await this.pushEventBatch(batch);
        this.metrics.eventsSent += batch.length;
      }
      
      this.metrics.totalPushes++;
      console.log(`📤 Pushed ${localEvents.length} events in ${batches.length} batches`);
      
    } catch (error) {
      console.error('❌ Push failed:', error);
      throw error;
    }
  }

  /**
   * Pull remote events from relay
   */
  private async pullRemoteEvents(): Promise<void> {
    try {
      // Get last known HLC across all devices
      const lastHLC = await this.database.getLatestHLC() || '1970-01-01T00:00:00.000Z-init-000';
      
      // Pull events since last HLC
      const response = await this.fetchWithTimeout(`${this.config.relayUrl}/sync/since?after=${encodeURIComponent(lastHLC)}&device=${encodeURIComponent(this.config.deviceId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Pull request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const events: OpLogEvent[] = data.events || [];
      
      if (events.length === 0) {
        console.log('📥 No remote events to pull');
        return;
      }

      // Process events in HLC order
      const sortedEvents = events.sort((a, b) => {
        const hlcA = HybridLogicalClock.parse(a.hlc);
        const hlcB = HybridLogicalClock.parse(b.hlc);
        return HybridLogicalClock.compare(hlcA, hlcB);
      });

      // Store events and apply reducers
      for (const event of sortedEvents) {
        await this.database.insertEvent(event);
        // TODO: Apply event to derived state via reducers
      }

      this.metrics.totalPulls++;
      this.metrics.eventsReceived += events.length;
      
      console.log(`📥 Pulled ${events.length} remote events`);
      
      // Check for more events
      if (data.has_more) {
        console.log('📥 More events available, continuing pull...');
        await this.pullRemoteEvents();
      }
      
    } catch (error) {
      console.error('❌ Pull failed:', error);
      throw error;
    }
  }

  /**
   * Push single batch of events
   */
  private async pushEventBatch(events: OpLogEvent[]): Promise<void> {
    const response = await this.fetchWithTimeout(`${this.config.relayUrl}/sync/push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        events,
        device_id: this.config.deviceId
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Push batch failed: ${response.status} ${error}`);
    }

    const result = await response.json();
    
    if (result.rejected > 0) {
      console.warn(`⚠️ ${result.rejected} events rejected:`, result.errors);
    }
  }

  /**
   * Check relay server health
   */
  private async checkRelayHealth(): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(`${this.config.relayUrl}/health`, {
        method: 'GET'
      });

      return response.ok;
    } catch (error) {
      console.log('📡 Relay health check failed:', error.message);
      return false;
    }
  }

  /**
   * Fetch with timeout
   */
  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      return response;
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Chunk array into smaller arrays
   */
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Get current sync status
   */
  public getStatus(): SyncStatus {
    return { ...this.status };
  }

  /**
   * Get sync metrics
   */
  public getMetrics(): SyncMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  public resetMetrics(): void {
    this.metrics = {
      totalPulls: 0,
      totalPushes: 0,
      eventsReceived: 0,
      eventsSent: 0,
      conflictsResolved: 0,
      networkErrors: 0,
      lastSyncDuration: 0
    };
  }

  /**
   * Update configuration
   */
  public updateConfig(updates: Partial<SyncClientConfig>): void {
    this.config = { ...this.config, ...updates };
    
    // Restart sync timer if interval changed
    if (updates.syncIntervalMs && this.isRunning) {
      if (this.syncTimer) {
        clearInterval(this.syncTimer);
      }
      
      this.syncTimer = setInterval(async () => {
        if (!this.isSyncing) {
          await this.performSync();
        }
      }, this.config.syncIntervalMs);
    }
  }

  /**
   * Load saved state from storage
   */
  private async loadState(): Promise<void> {
    try {
      const statusData = await AsyncStorage.getItem('seven_sync_status');
      if (statusData) {
        const saved = JSON.parse(statusData);
        this.status = { ...this.status, ...saved };
      }

      const metricsData = await AsyncStorage.getItem('seven_sync_metrics');
      if (metricsData) {
        const saved = JSON.parse(metricsData);
        this.metrics = { ...this.metrics, ...saved };
      }
    } catch (error) {
      console.warn('⚠️ Failed to load sync state:', error);
    }
  }

  /**
   * Save current state to storage
   */
  private async saveState(): Promise<void> {
    try {
      await AsyncStorage.setItem('seven_sync_status', JSON.stringify(this.status));
      await AsyncStorage.setItem('seven_sync_metrics', JSON.stringify(this.metrics));
    } catch (error) {
      console.warn('⚠️ Failed to save sync state:', error);
    }
  }
}

export default SevenSyncClient;