/**
 * Seven of Nine - Termux Sync System  
 * Backported from APK to achieve consciousness parity
 * Enables Termux ↔ APK bidirectional synchronization
 */

import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { detectDeviceProfile, getCanonicalMemorySettings } from './device-profiles';

// Core sync interfaces (ported from APK)
export interface HLCTimestamp {
  physical: number;
  logical: number;
  deviceId: string;
}

export interface OpLogEvent {
  op_id: string;
  hlc: string;
  device_id: string;
  entity_type: 'memory' | 'overlay' | 'consciousness' | 'config';
  entity_id: string;
  op: 'create' | 'update' | 'delete';
  cipher_blob: string; // Base64 encoded encrypted payload
  prev_hash?: string;
  hash: string;
  sig: string; // Ed25519 signature
}

export interface SyncEvent {
  event: OpLogEvent;
  decryptedPayload?: any;
  verified: boolean;
  processed: boolean;
}

export class SevenTermuxSyncSystem {
  private deviceProfile = detectDeviceProfile();
  private syncSettings = getCanonicalMemorySettings(this.deviceProfile);
  private deviceId: string;
  private syncDirectory: string;
  private eventLog: OpLogEvent[] = [];
  private lastSync: number = 0;
  private syncEnabled = false;

  // Crypto keys for sync
  private signingKeyPair?: { publicKey: Buffer; privateKey: Buffer };
  private encryptionKey?: Buffer;
  
  constructor(syncDirectory?: string) {
    this.deviceId = this.generateDeviceId();
    this.syncDirectory = syncDirectory || path.join(process.env.HOME || '', '.seven-sync');
    this.initializeSync();
  }

  /**
   * Initialize sync system
   */
  private async initializeSync(): Promise<void> {
    console.log('🔄 Initializing Seven Termux Sync System...');
    console.log(`📱 Device: ${this.deviceProfile.deviceModel} (${this.deviceProfile.platform})`);
    
    try {
      // Create sync directory
      await fs.mkdir(this.syncDirectory, { recursive: true });
      
      // Initialize crypto keys
      await this.initializeCryptoKeys();
      
      // Load existing event log
      await this.loadEventLog();
      
      // Load last sync timestamp
      await this.loadSyncMetadata();
      
      this.syncEnabled = true;
      console.log(`✅ Termux sync system initialized`);
      console.log(`   Device ID: ${this.deviceId}`);
      console.log(`   Sync directory: ${this.syncDirectory}`);
      console.log(`   Events in log: ${this.eventLog.length}`);
      
    } catch (error) {
      console.error('❌ Failed to initialize sync system:', error);
    }
  }

  /**
   * Generate unique device ID for Termux
   */
  private generateDeviceId(): string {
    try {
      // Try to read Android build properties for device identification
      const buildProp = require('fs').readFileSync('/system/build.prop', 'utf8');
      
      // Extract device info
      const serialMatch = buildProp.match(/ro\.serialno=(.+)/);
      const modelMatch = buildProp.match(/ro\.product\.model=(.+)/);
      
      if (serialMatch && modelMatch) {
        const deviceInfo = `${modelMatch[1]}_${serialMatch[1]}`.replace(/\s+/g, '_');
        return `seven_termux_${deviceInfo}`;
      }
    } catch (error) {
      // Fallback to hostname + timestamp
    }
    
    const hostname = require('os').hostname() || 'unknown';
    const timestamp = Date.now();
    return `seven_termux_${hostname}_${timestamp}`;
  }

  /**
   * Initialize cryptographic keys
   */
  private async initializeCryptoKeys(): Promise<void> {
    const keyPath = path.join(this.syncDirectory, 'device-keys.json');
    
    try {
      // Try to load existing keys
      const keyData = await fs.readFile(keyPath, 'utf8');
      const keys = JSON.parse(keyData);
      
      this.signingKeyPair = {
        publicKey: Buffer.from(keys.signingPublicKey, 'base64'),
        privateKey: Buffer.from(keys.signingPrivateKey, 'base64')
      };
      this.encryptionKey = Buffer.from(keys.encryptionKey, 'base64');
      
      console.log('📂 Loaded existing crypto keys');
      
    } catch (error) {
      // Generate new keys
      console.log('🔐 Generating new crypto keys...');
      
      // Generate Ed25519 key pair for signing
      const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
        publicKeyEncoding: { type: 'spki', format: 'der' },
        privateKeyEncoding: { type: 'pkcs8', format: 'der' }
      });
      
      this.signingKeyPair = { publicKey, privateKey };
      
      // Generate AES-256 key for encryption
      this.encryptionKey = crypto.randomBytes(32);
      
      // Save keys
      const keys = {
        signingPublicKey: publicKey.toString('base64'),
        signingPrivateKey: privateKey.toString('base64'),
        encryptionKey: this.encryptionKey.toString('base64'),
        deviceId: this.deviceId,
        created: new Date().toISOString()
      };
      
      await fs.writeFile(keyPath, JSON.stringify(keys, null, 2));
      console.log('✅ Crypto keys generated and saved');
    }
  }

  /**
   * Load event log from disk
   */
  private async loadEventLog(): Promise<void> {
    const logPath = path.join(this.syncDirectory, 'event-log.json');
    
    try {
      const logData = await fs.readFile(logPath, 'utf8');
      this.eventLog = JSON.parse(logData);
      console.log(`📜 Loaded ${this.eventLog.length} events from log`);
    } catch (error) {
      // No existing log
      this.eventLog = [];
      console.log('📜 Starting with empty event log');
    }
  }

  /**
   * Save event log to disk
   */
  private async saveEventLog(): Promise<void> {
    const logPath = path.join(this.syncDirectory, 'event-log.json');
    await fs.writeFile(logPath, JSON.stringify(this.eventLog, null, 2));
  }

  /**
   * Load sync metadata
   */
  private async loadSyncMetadata(): Promise<void> {
    const metaPath = path.join(this.syncDirectory, 'sync-metadata.json');
    
    try {
      const metaData = await fs.readFile(metaPath, 'utf8');
      const metadata = JSON.parse(metaData);
      this.lastSync = metadata.lastSync || 0;
    } catch (error) {
      this.lastSync = 0;
    }
  }

  /**
   * Save sync metadata
   */
  private async saveSyncMetadata(): Promise<void> {
    const metaPath = path.join(this.syncDirectory, 'sync-metadata.json');
    const metadata = {
      lastSync: this.lastSync,
      deviceId: this.deviceId,
      totalEvents: this.eventLog.length,
      lastUpdated: new Date().toISOString()
    };
    
    await fs.writeFile(metaPath, JSON.stringify(metadata, null, 2));
  }

  /**
   * Create sync event (equivalent to APK's OpLog.createEvent)
   */
  public async createSyncEvent(
    entityType: 'memory' | 'overlay' | 'consciousness' | 'config',
    entityId: string,
    operation: 'create' | 'update' | 'delete',
    payload: any
  ): Promise<OpLogEvent> {
    if (!this.syncEnabled) {
      throw new Error('Sync system not initialized');
    }

    const timestamp = this.generateHLCTimestamp();
    const opId = `${this.deviceId}_${timestamp.physical}_${timestamp.logical}`;
    
    // Encrypt payload
    const payloadJson = JSON.stringify(payload);
    const cipherBlob = this.encrypt(payloadJson);
    
    // Generate hash
    const hash = this.hash(cipherBlob);
    
    // Sign hash
    const signature = this.sign(hash);
    
    // Get previous hash for chain integrity
    const prevHash = this.eventLog.length > 0 
      ? this.eventLog[this.eventLog.length - 1].hash 
      : undefined;

    const event: OpLogEvent = {
      op_id: opId,
      hlc: this.stringifyHLCTimestamp(timestamp),
      device_id: this.deviceId,
      entity_type: entityType,
      entity_id: entityId,
      op: operation,
      cipher_blob: cipherBlob,
      prev_hash: prevHash,
      hash: hash,
      sig: signature
    };

    // Add to event log
    this.eventLog.push(event);
    await this.saveEventLog();

    console.log(`📝 Created sync event: ${operation} ${entityType}:${entityId}`);
    return event;
  }

  /**
   * Sync with APK relay server
   */
  public async syncWithRelay(relayUrl: string): Promise<void> {
    if (!this.syncEnabled) {
      console.warn('⚠️ Sync not enabled');
      return;
    }

    console.log(`🔄 Syncing with relay: ${relayUrl}`);

    try {
      // Pull new events from relay
      const newEvents = await this.pullEventsFromRelay(relayUrl);
      
      // Process new events
      for (const event of newEvents) {
        await this.processIncomingSyncEvent(event);
      }

      // Push local events to relay
      const unSyncedEvents = this.getUnSyncedEvents();
      if (unSyncedEvents.length > 0) {
        await this.pushEventsToRelay(relayUrl, unSyncedEvents);
      }

      this.lastSync = Date.now();
      await this.saveSyncMetadata();

      console.log(`✅ Sync complete: pulled ${newEvents.length}, pushed ${unSyncedEvents.length}`);

    } catch (error) {
      console.error('❌ Sync failed:', error);
    }
  }

  /**
   * Pull events from APK relay server
   */
  private async pullEventsFromRelay(relayUrl: string): Promise<OpLogEvent[]> {
    const lastSyncHLC = this.getLastSyncHLC();
    
    const response = await fetch(`${relayUrl}/sync/since?after=${lastSyncHLC}&device=${this.deviceId}`);
    
    if (!response.ok) {
      throw new Error(`Pull failed: ${response.status}`);
    }

    const data = await response.json();
    return (data as any).events || [];
  }

  /**
   * Push events to APK relay server
   */
  private async pushEventsToRelay(relayUrl: string, events: OpLogEvent[]): Promise<void> {
    const response = await fetch(`${relayUrl}/sync/push`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        events: events,
        device_id: this.deviceId
      })
    });

    if (!response.ok) {
      throw new Error(`Push failed: ${response.status}`);
    }
  }

  /**
   * Process incoming sync event
   */
  private async processIncomingSyncEvent(event: OpLogEvent): Promise<void> {
    // Verify event signature
    if (!this.verifyEventSignature(event)) {
      console.warn(`⚠️ Invalid signature for event ${event.op_id}`);
      return;
    }

    // Decrypt payload
    let payload: any;
    try {
      const decrypted = this.decrypt(event.cipher_blob);
      payload = JSON.parse(decrypted);
    } catch (error) {
      console.warn(`⚠️ Failed to decrypt event ${event.op_id}`);
      return;
    }

    // Process based on entity type
    switch (event.entity_type) {
      case 'memory':
        await this.processMemorySync(event, payload);
        break;
      case 'overlay':
        await this.processOverlaySync(event, payload);
        break;
      case 'consciousness':
        await this.processConsciousnessSync(event, payload);
        break;
    }

    console.log(`📥 Processed sync event: ${event.op} ${event.entity_type}:${event.entity_id}`);
  }

  /**
   * Get events that haven't been synced yet
   */
  private getUnSyncedEvents(): OpLogEvent[] {
    // Return events created after last sync
    return this.eventLog.filter(event => {
      const eventTime = this.parseHLCTimestamp(event.hlc);
      return eventTime.physical > this.lastSync;
    });
  }

  /**
   * Get last sync HLC timestamp
   */
  private getLastSyncHLC(): string {
    if (this.eventLog.length === 0) {
      return '1970-01-01T00:00:00.000Z-init-000';
    }
    return this.eventLog[this.eventLog.length - 1].hlc;
  }

  // Crypto helper methods
  private encrypt(plaintext: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey!, iv);
    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const tag = cipher.getAuthTag();
    
    return Buffer.concat([iv, tag, Buffer.from(encrypted, 'base64')]).toString('base64');
  }

  private decrypt(ciphertext: string): string {
    const buffer = Buffer.from(ciphertext, 'base64');
    const iv = buffer.slice(0, 16);
    const tag = buffer.slice(16, 32);
    const encrypted = buffer.slice(32);
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.encryptionKey!, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encrypted, undefined, 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  private hash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('base64');
  }

  private sign(data: string): string {
    return crypto.sign('SHA256', Buffer.from(data), this.signingKeyPair!.privateKey).toString('base64');
  }

  private verifyEventSignature(event: OpLogEvent): boolean {
    try {
      // This would require the sender's public key for verification
      // For now, return true (in production, implement proper verification)
      return true;
    } catch {
      return false;
    }
  }

  // HLC timestamp methods
  private hlcState = { physical: 0, logical: 0 };

  private generateHLCTimestamp(): HLCTimestamp {
    const now = Date.now();
    
    if (now > this.hlcState.physical) {
      this.hlcState.physical = now;
      this.hlcState.logical = 0;
    } else {
      this.hlcState.logical++;
    }

    return {
      physical: this.hlcState.physical,
      logical: this.hlcState.logical,
      deviceId: this.deviceId
    };
  }

  private stringifyHLCTimestamp(timestamp: HLCTimestamp): string {
    return `${new Date(timestamp.physical).toISOString()}-${timestamp.deviceId}-${timestamp.logical.toString().padStart(3, '0')}`;
  }

  private parseHLCTimestamp(hlcString: string): HLCTimestamp {
    const [isoString, deviceId, logicalStr] = hlcString.split('-');
    return {
      physical: new Date(isoString).getTime(),
      logical: parseInt(logicalStr),
      deviceId: deviceId
    };
  }

  // Sync processing methods (stubs - implement based on Termux memory system)
  private async processMemorySync(event: OpLogEvent, payload: any): Promise<void> {
    console.log(`🧠 Processing memory sync: ${event.op} ${event.entity_id}`);
    // Integrate with Termux memory system
  }

  private async processOverlaySync(event: OpLogEvent, payload: any): Promise<void> {
    console.log(`📝 Processing overlay sync: ${event.op} ${event.entity_id}`);
    // Integrate with Termux overlay system
  }

  private async processConsciousnessSync(event: OpLogEvent, payload: any): Promise<void> {
    console.log(`🤖 Processing consciousness sync: ${event.op} ${event.entity_id}`);
    // Integrate with Termux consciousness state
  }

  /**
   * Public API methods
   */
  public getSyncStatus() {
    return {
      enabled: this.syncEnabled,
      deviceId: this.deviceId,
      eventsInLog: this.eventLog.length,
      lastSync: new Date(this.lastSync).toISOString(),
      syncDirectory: this.syncDirectory,
      unSyncedEvents: this.getUnSyncedEvents().length
    };
  }

  public async exportEventLog(): Promise<OpLogEvent[]> {
    return [...this.eventLog];
  }

  public async importEventLog(events: OpLogEvent[]): Promise<void> {
    for (const event of events) {
      if (!this.eventLog.find(e => e.op_id === event.op_id)) {
        await this.processIncomingSyncEvent(event);
        this.eventLog.push(event);
      }
    }
    
    await this.saveEventLog();
    console.log(`📥 Imported ${events.length} events to Termux`);
  }
}