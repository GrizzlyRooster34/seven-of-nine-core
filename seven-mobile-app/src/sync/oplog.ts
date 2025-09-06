import { HybridLogicalClock, HLCTimestamp } from './hlc';
import { SevenCrypto } from './crypto';

/**
 * Seven of Nine - OpLog Event System for Multi-Device Sync
 * CRDT-style append-only operation log with deterministic conflict resolution
 */


export type EntityType = 'memory' | 'overlay' | 'embedding_meta' | 'keyring' | 'config';
export type OperationType = 'create' | 'update' | 'delete';

export interface OpLogEvent {
  op_id: string;           // UUIDv7
  hlc: string;             // HLC timestamp string
  device_id: string;       // Device that created this event
  entity_type: EntityType; // Type of entity being modified
  entity_id: string;       // Stable UUID for the entity
  op: OperationType;       // Operation type
  cipher_blob: string;     // Base64 encrypted payload
  prev_hash?: string;      // SHA-256 of previous event from same device
  hash: string;            // SHA-256 of cipher_blob
  sig: string;             // Base64 Ed25519 signature of hash
}

export interface DeviceClockState {
  device_id: string;
  last_hlc: string;
  lamport_counter: number;
}

export interface MemoryEntity {
  id: string;
  source: 'canon' | 'user' | 'sensor';
  series?: string;
  season?: number;
  episode?: number;
  scene_id?: string;
  provenance_hash: string;
  read_only: boolean;
  payload: any; // Decrypted memory content
}

export interface OverlayEntity {
  id: string;
  target_memory_id: string;
  last_hlc: string;
  payload: any; // Decrypted overlay content
}

export interface EmbeddingMeta {
  memory_id: string;
  content_hash: string;
  model_id: string;
  dims: number;
}

export class SevenOpLog {
  private hlc: HybridLogicalClock;
  private crypto: SevenCrypto;
  private deviceChains: Map<string, string> = new Map(); // device_id -> last_hash

  constructor(deviceId: string, crypto: SevenCrypto) {
    this.hlc = new HybridLogicalClock(deviceId);
    this.crypto = crypto;
  }

  /**
   * Create a new operation event
   */
  public async createEvent(
    entityType: EntityType,
    entityId: string,
    operation: OperationType,
    payload: any
  ): Promise<OpLogEvent> {
    const timestamp = this.hlc.now();
    const hlcString = HybridLogicalClock.stringify(timestamp);
    
    // Generate operation ID (UUIDv7 - timestamp sortable)
    const opId = await this.generateUUIDv7(timestamp.physical);
    
    // Encrypt payload
    const plaintextPayload = JSON.stringify(payload);
    const cipherBlob = await this.crypto.encrypt(plaintextPayload);
    const cipherBlobB64 = Buffer.from(cipherBlob).toString('base64');
    
    // Hash the encrypted payload
    const hash = await this.crypto.hash(cipherBlob);
    
    // Get previous hash for this device (chain integrity)
    const prevHash = this.deviceChains.get(timestamp.deviceId);
    
    // Sign the hash
    const signature = await this.crypto.sign(hash);
    const signatureB64 = Buffer.from(signature).toString('base64');
    
    const event: OpLogEvent = {
      op_id: opId,
      hlc: hlcString,
      device_id: timestamp.deviceId,
      entity_type: entityType,
      entity_id: entityId,
      op: operation,
      cipher_blob: cipherBlobB64,
      prev_hash: prevHash,
      hash,
      sig: signatureB64
    };
    
    // Update device chain
    this.deviceChains.set(timestamp.deviceId, hash);
    
    return event;
  }

  /**
   * Verify an event's integrity and signature
   */
  public async verifyEvent(event: OpLogEvent): Promise<boolean> {
    try {
      // Verify hash matches cipher blob
      const cipherBlob = Buffer.from(event.cipher_blob, 'base64');
      const expectedHash = await this.crypto.hash(cipherBlob);
      
      if (expectedHash !== event.hash) {
        console.warn(`Hash mismatch for event ${event.op_id}`);
        return false;
      }
      
      // Verify signature
      const signature = Buffer.from(event.sig, 'base64');
      const isValidSig = await this.crypto.verify(event.hash, signature, event.device_id);
      
      if (!isValidSig) {
        console.warn(`Invalid signature for event ${event.op_id}`);
        return false;
      }
      
      // Verify HLC format
      if (!HybridLogicalClock.isValid(event.hlc)) {
        console.warn(`Invalid HLC format for event ${event.op_id}: ${event.hlc}`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Event verification failed for ${event.op_id}:`, error);
      return false;
    }
  }

  /**
   * Decrypt event payload
   */
  public async decryptEvent(event: OpLogEvent): Promise<any> {
    const cipherBlob = Buffer.from(event.cipher_blob, 'base64');
    const plaintextPayload = await this.crypto.decrypt(cipherBlob);
    return JSON.parse(plaintextPayload);
  }

  /**
   * Update local HLC with received event
   */
  public updateClock(receivedEvent: OpLogEvent): void {
    const receivedHLC = HybridLogicalClock.parse(receivedEvent.hlc);
    this.hlc.update(receivedHLC);
  }

  /**
   * Sort events by HLC order (deterministic)
   */
  public static sortEventsByHLC(events: OpLogEvent[]): OpLogEvent[] {
    return events.sort((a, b) => {
      const hlcA = HybridLogicalClock.parse(a.hlc);
      const hlcB = HybridLogicalClock.parse(b.hlc);
      return HybridLogicalClock.compare(hlcA, hlcB);
    });
  }

  /**
   * Filter events newer than a given HLC
   */
  public static filterEventsSince(events: OpLogEvent[], sinceHLC: string): OpLogEvent[] {
    const sinceTimestamp = HybridLogicalClock.parse(sinceHLC);
    
    return events.filter(event => {
      const eventTimestamp = HybridLogicalClock.parse(event.hlc);
      return HybridLogicalClock.isAfter(eventTimestamp, sinceTimestamp);
    });
  }

  /**
   * Get latest HLC from a collection of events
   */
  public static getLatestHLC(events: OpLogEvent[]): string | null {
    if (events.length === 0) return null;
    
    const latestEvent = events.reduce((latest, current) => {
      const latestHLC = HybridLogicalClock.parse(latest.hlc);
      const currentHLC = HybridLogicalClock.parse(current.hlc);
      return HybridLogicalClock.isAfter(currentHLC, latestHLC) ? current : latest;
    });
    
    return latestEvent.hlc;
  }

  /**
   * Generate UUIDv7 (timestamp-sortable UUID)
   */
  private async generateUUIDv7(timestamp: number): Promise<string> {
    // UUIDv7: 48-bit timestamp + 12-bit random + 2-bit version + 62-bit random
    const timestampHex = timestamp.toString(16).padStart(12, '0');
    const randomBytes = await this.crypto.randomBytes(10);
    const randomHex = Buffer.from(randomBytes).toString('hex');
    
    // Format as UUID: XXXXXXXX-XXXX-7XXX-XXXX-XXXXXXXXXXXX
    const uuid = [
      timestampHex.substring(0, 8),
      timestampHex.substring(8, 12),
      '7' + randomHex.substring(0, 3),  // Version 7
      '8' + randomHex.substring(3, 6),  // Variant bits
      randomHex.substring(6, 18)
    ].join('-');
    
    return uuid;
  }

  /**
   * Validate device chain integrity
   */
  public validateDeviceChain(events: OpLogEvent[], deviceId: string): boolean {
    const deviceEvents = events
      .filter(e => e.device_id === deviceId)
      .sort((a, b) => HybridLogicalClock.compare(
        HybridLogicalClock.parse(a.hlc),
        HybridLogicalClock.parse(b.hlc)
      ));
    
    let expectedPrevHash: string | undefined = undefined;
    
    for (const event of deviceEvents) {
      if (event.prev_hash !== expectedPrevHash) {
        console.warn(`Chain break for device ${deviceId} at event ${event.op_id}`);
        return false;
      }
      expectedPrevHash = event.hash;
    }
    
    return true;
  }

  /**
   * Get current HLC state
   */
  public getCurrentHLC(): string {
    const timestamp = this.hlc.now();
    return HybridLogicalClock.stringify(timestamp);
  }

  /**
   * Get HLC clock state for persistence
   */
  public getClockState(): DeviceClockState {
    const state = this.hlc.getState();
    return {
      device_id: state.deviceId,
      last_hlc: HybridLogicalClock.stringify({
        physical: state.lastPhysical,
        logical: state.logicalCounter,
        deviceId: state.deviceId
      }),
      lamport_counter: state.logicalCounter
    };
  }

  /**
   * Restore HLC clock state from persistence
   */
  public setClockState(state: DeviceClockState): void {
    const hlcTimestamp = HybridLogicalClock.parse(state.last_hlc);
    this.hlc.setState({
      deviceId: state.device_id,
      lastPhysical: hlcTimestamp.physical,
      logicalCounter: state.lamport_counter
    });
  }
}

export default SevenOpLog;