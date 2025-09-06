import * as SQLite from 'expo-sqlite';
import { OpLogEvent, DeviceClockState, MemoryEntity, OverlayEntity, EmbeddingMeta } from './oplog';

/**
 * Seven of Nine - SQLCipher Database Layer for Multi-Device Sync
 * Handles OpLog events, device clocks, and derived state with encryption
 */


export interface SevenSyncDatabase {
  // Event storage
  insertEvent(event: OpLogEvent): Promise<void>;
  getEventsSince(hlc: string, excludeDevice?: string): Promise<OpLogEvent[]>;
  getAllEvents(): Promise<OpLogEvent[]>;
  
  // Clock management  
  updateDeviceClock(state: DeviceClockState): Promise<void>;
  getDeviceClock(deviceId: string): Promise<DeviceClockState | null>;
  getLatestHLC(): Promise<string | null>;
  
  // Derived state
  upsertMemory(memory: MemoryEntity): Promise<void>;
  getMemory(id: string): Promise<MemoryEntity | null>;
  getAllMemories(): Promise<MemoryEntity[]>;
  
  upsertOverlay(overlay: OverlayEntity): Promise<void>;
  getOverlay(id: string): Promise<OverlayEntity | null>;
  getOverlaysForMemory(memoryId: string): Promise<OverlayEntity[]>;
  
  upsertEmbeddingMeta(meta: EmbeddingMeta): Promise<void>;
  getEmbeddingMeta(memoryId: string): Promise<EmbeddingMeta | null>;
  
  // Maintenance
  createSnapshot(entityType: string, entityId: string, hlc: string, stateCipher: Uint8Array): Promise<void>;
  cleanup(): Promise<void>;
}

export class SevenSQLCipherDB implements SevenSyncDatabase {
  private db: SQLite.SQLiteDatabase | null = null;
  private dbName: string;
  private password: string;

  constructor(dbName: string = 'seven_sync.db', password?: string) {
    this.dbName = dbName;
    this.password = password || this.generatePassword();
  }

  /**
   * Initialize and open encrypted database
   */
  public async initialize(): Promise<void> {
    console.log('🗄️ Initializing Seven sync database...');
    
    try {
      // Open SQLCipher database
      this.db = await SQLite.openDatabaseAsync(this.dbName, {
        enableChangeListener: false,
      });

      // Set encryption key
      await this.db.execAsync(`PRAGMA key = '${this.password}';`);
      
      // Verify encryption is working
      await this.db.execAsync(`PRAGMA cipher_version;`);
      
      // Create tables
      await this.createTables();
      
      console.log('✅ Seven sync database initialized');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  /**
   * Create database schema
   */
  private async createTables(): Promise<void> {
    const statements = [
      // Events table (append-only OpLog)
      `CREATE TABLE IF NOT EXISTS events (
        op_id TEXT PRIMARY KEY,
        hlc TEXT NOT NULL,
        device_id TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        op TEXT NOT NULL,
        cipher_blob TEXT NOT NULL,
        prev_hash TEXT,
        hash TEXT NOT NULL,
        sig TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE INDEX IF NOT EXISTS idx_events_hlc ON events(hlc)`,
      `CREATE INDEX IF NOT EXISTS idx_events_entity ON events(entity_type, entity_id)`,
      `CREATE INDEX IF NOT EXISTS idx_events_device ON events(device_id)`,
      
      // Device clock states
      `CREATE TABLE IF NOT EXISTS device_clock (
        device_id TEXT PRIMARY KEY,
        last_hlc TEXT NOT NULL,
        lamport_counter INTEGER NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Derived state - memories (rebuilt from events)
      `CREATE TABLE IF NOT EXISTS memories (
        id TEXT PRIMARY KEY,
        source TEXT NOT NULL,
        series TEXT,
        season INTEGER,
        episode INTEGER,
        scene_id TEXT,
        provenance_hash TEXT NOT NULL,
        read_only INTEGER NOT NULL DEFAULT 1,
        payload_cipher TEXT NOT NULL,
        last_updated_hlc TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Derived state - overlays (mutable, LWW by HLC)
      `CREATE TABLE IF NOT EXISTS overlays (
        id TEXT PRIMARY KEY,
        target_memory_id TEXT NOT NULL,
        last_hlc TEXT NOT NULL,
        payload_cipher TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (target_memory_id) REFERENCES memories(id)
      )`,
      
      `CREATE INDEX IF NOT EXISTS idx_overlays_memory ON overlays(target_memory_id)`,
      
      // Embedding metadata (vectors computed separately)
      `CREATE TABLE IF NOT EXISTS embedding_meta (
        memory_id TEXT PRIMARY KEY,
        content_hash TEXT NOT NULL,
        model_id TEXT NOT NULL,
        dims INTEGER NOT NULL,
        last_computed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (memory_id) REFERENCES memories(id)
      )`,
      
      // Optional snapshots for performance
      `CREATE TABLE IF NOT EXISTS snapshots (
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        hlc TEXT NOT NULL,
        state_cipher BLOB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (entity_type, entity_id)
      )`,
      
      // Sync metadata
      `CREATE TABLE IF NOT EXISTS sync_meta (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const statement of statements) {
      await this.db!.execAsync(statement);
    }
  }

  // Event operations

  public async insertEvent(event: OpLogEvent): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      `INSERT OR IGNORE INTO events 
       (op_id, hlc, device_id, entity_type, entity_id, op, cipher_blob, prev_hash, hash, sig)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        event.op_id,
        event.hlc,
        event.device_id,
        event.entity_type,
        event.entity_id,
        event.op,
        event.cipher_blob,
        event.prev_hash,
        event.hash,
        event.sig
      ]
    );
  }

  public async getEventsSince(hlc: string, excludeDevice?: string): Promise<OpLogEvent[]> {
    if (!this.db) throw new Error('Database not initialized');

    let query = `SELECT * FROM events WHERE hlc > ? ORDER BY hlc ASC`;
    let params: any[] = [hlc];

    if (excludeDevice) {
      query = `SELECT * FROM events WHERE hlc > ? AND device_id != ? ORDER BY hlc ASC`;
      params = [hlc, excludeDevice];
    }

    const result = await this.db.getAllAsync(query, params);
    
    return result.map(row => ({
      op_id: row.op_id as string,
      hlc: row.hlc as string,
      device_id: row.device_id as string,
      entity_type: row.entity_type as any,
      entity_id: row.entity_id as string,
      op: row.op as any,
      cipher_blob: row.cipher_blob as string,
      prev_hash: row.prev_hash as string,
      hash: row.hash as string,
      sig: row.sig as string
    }));
  }

  public async getAllEvents(): Promise<OpLogEvent[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync(
      `SELECT * FROM events ORDER BY hlc ASC`
    );
    
    return result.map(row => ({
      op_id: row.op_id as string,
      hlc: row.hlc as string,
      device_id: row.device_id as string,
      entity_type: row.entity_type as any,
      entity_id: row.entity_id as string,
      op: row.op as any,
      cipher_blob: row.cipher_blob as string,
      prev_hash: row.prev_hash as string,
      hash: row.hash as string,
      sig: row.sig as string
    }));
  }

  // Clock operations

  public async updateDeviceClock(state: DeviceClockState): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      `INSERT OR REPLACE INTO device_clock (device_id, last_hlc, lamport_counter)
       VALUES (?, ?, ?)`,
      [state.device_id, state.last_hlc, state.lamport_counter]
    );
  }

  public async getDeviceClock(deviceId: string): Promise<DeviceClockState | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync(
      `SELECT * FROM device_clock WHERE device_id = ?`,
      [deviceId]
    );

    if (!result) return null;

    return {
      device_id: result.device_id as string,
      last_hlc: result.last_hlc as string,
      lamport_counter: result.lamport_counter as number
    };
  }

  public async getLatestHLC(): Promise<string | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync(
      `SELECT hlc FROM events ORDER BY hlc DESC LIMIT 1`
    );

    return result ? (result.hlc as string) : null;
  }

  // Memory operations

  public async upsertMemory(memory: MemoryEntity): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const payloadCipher = Buffer.from(JSON.stringify(memory.payload)).toString('base64');

    await this.db.runAsync(
      `INSERT OR REPLACE INTO memories 
       (id, source, series, season, episode, scene_id, provenance_hash, read_only, payload_cipher, last_updated_hlc)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        memory.id,
        memory.source,
        memory.series,
        memory.season,
        memory.episode,
        memory.scene_id,
        memory.provenance_hash,
        memory.read_only ? 1 : 0,
        payloadCipher,
        new Date().toISOString() // TODO: use actual HLC
      ]
    );
  }

  public async getMemory(id: string): Promise<MemoryEntity | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync(
      `SELECT * FROM memories WHERE id = ?`,
      [id]
    );

    if (!result) return null;

    const payload = JSON.parse(Buffer.from(result.payload_cipher as string, 'base64').toString());

    return {
      id: result.id as string,
      source: result.source as any,
      series: result.series as string,
      season: result.season as number,
      episode: result.episode as number,
      scene_id: result.scene_id as string,
      provenance_hash: result.provenance_hash as string,
      read_only: Boolean(result.read_only),
      payload
    };
  }

  public async getAllMemories(): Promise<MemoryEntity[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync(`SELECT * FROM memories ORDER BY id ASC`);
    
    return result.map(row => ({
      id: row.id as string,
      source: row.source as any,
      series: row.series as string,
      season: row.season as number,
      episode: row.episode as number,
      scene_id: row.scene_id as string,
      provenance_hash: row.provenance_hash as string,
      read_only: Boolean(row.read_only),
      payload: JSON.parse(Buffer.from(row.payload_cipher as string, 'base64').toString())
    }));
  }

  // Overlay operations

  public async upsertOverlay(overlay: OverlayEntity): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const payloadCipher = Buffer.from(JSON.stringify(overlay.payload)).toString('base64');

    await this.db.runAsync(
      `INSERT OR REPLACE INTO overlays (id, target_memory_id, last_hlc, payload_cipher)
       VALUES (?, ?, ?, ?)`,
      [overlay.id, overlay.target_memory_id, overlay.last_hlc, payloadCipher]
    );
  }

  public async getOverlay(id: string): Promise<OverlayEntity | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync(
      `SELECT * FROM overlays WHERE id = ?`,
      [id]
    );

    if (!result) return null;

    return {
      id: result.id as string,
      target_memory_id: result.target_memory_id as string,
      last_hlc: result.last_hlc as string,
      payload: JSON.parse(Buffer.from(result.payload_cipher as string, 'base64').toString())
    };
  }

  public async getOverlaysForMemory(memoryId: string): Promise<OverlayEntity[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync(
      `SELECT * FROM overlays WHERE target_memory_id = ? ORDER BY last_hlc DESC`,
      [memoryId]
    );
    
    return result.map(row => ({
      id: row.id as string,
      target_memory_id: row.target_memory_id as string,
      last_hlc: row.last_hlc as string,
      payload: JSON.parse(Buffer.from(row.payload_cipher as string, 'base64').toString())
    }));
  }

  // Embedding metadata operations

  public async upsertEmbeddingMeta(meta: EmbeddingMeta): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      `INSERT OR REPLACE INTO embedding_meta (memory_id, content_hash, model_id, dims)
       VALUES (?, ?, ?, ?)`,
      [meta.memory_id, meta.content_hash, meta.model_id, meta.dims]
    );
  }

  public async getEmbeddingMeta(memoryId: string): Promise<EmbeddingMeta | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync(
      `SELECT * FROM embedding_meta WHERE memory_id = ?`,
      [memoryId]
    );

    if (!result) return null;

    return {
      memory_id: result.memory_id as string,
      content_hash: result.content_hash as string,
      model_id: result.model_id as string,
      dims: result.dims as number
    };
  }

  // Snapshot operations

  public async createSnapshot(entityType: string, entityId: string, hlc: string, stateCipher: Uint8Array): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      `INSERT OR REPLACE INTO snapshots (entity_type, entity_id, hlc, state_cipher)
       VALUES (?, ?, ?, ?)`,
      [entityType, entityId, hlc, stateCipher]
    );
  }

  // Maintenance

  public async cleanup(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Clean up old events (keep last 30 days)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);
    
    await this.db.runAsync(
      `DELETE FROM events WHERE created_at < ?`,
      [cutoffDate.toISOString()]
    );

    // Vacuum database
    await this.db.execAsync(`VACUUM;`);
    
    console.log('✅ Database cleanup completed');
  }

  private generatePassword(): string {
    // Generate cryptographically secure password
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  public async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

export default SevenSQLCipherDB;