import { createHash } from 'crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Conditional SQLite import - fallback to JSON if better-sqlite3 unavailable
let Database: typeof import('better-sqlite3').default | null = null;
try {
  Database = require('better-sqlite3');
} catch (error) {
  console.log('[SPARK-DB] better-sqlite3 not available, using JSON fallback mode');
}

const DB_PATH = join(process.cwd(), 'db', 'spark.db');
const DB_DIR = join(process.cwd(), 'db');

// Ensure db directory exists
if (!existsSync(DB_DIR)) {
  mkdirSync(DB_DIR, { recursive: true });
}

// Simple JSON Database Fallback
class JSONDatabase {
  private data: any = {};
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.load();
  }

  private load() {
    try {
      if (existsSync(this.filePath)) {
        const fileContent = readFileSync(this.filePath, 'utf8');
        this.data = JSON.parse(fileContent);
      } else {
        this.data = {
          self_model: [],
          events: [],
          traces: [],
          beliefs: [],
          belief_links: [],
          canon_lessons: [],
          codex_rules: []
        };
      }
    } catch (error) {
      console.error('[JSON-DB] Load error:', error);
      this.data = {};
    }
  }

  private save() {
    try {
      writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('[JSON-DB] Save error:', error);
    }
  }

  exec(sql: string) {
    // Simple table creation - just ensure table exists in data
    if (sql.includes('CREATE TABLE')) {
      const match = sql.match(/CREATE TABLE(?:\s+IF NOT EXISTS)?\s+(\w+)/i);
      if (match) {
        const tableName = match[1];
        if (!this.data[tableName]) {
          this.data[tableName] = [];
        }
      }
    }
  }

  run(sql: string, params: any[] = []) {
    const trimmed = sql.trim().toUpperCase();
    
    if (trimmed.startsWith('INSERT')) {
      const tableMatch = sql.match(/INSERT INTO\s+(\w+)/i);
      if (tableMatch) {
        const tableName = tableMatch[1];
        if (!this.data[tableName]) {
          this.data[tableName] = [];
        }
        
        // Simple insert - create object from params
        const record: any = { id: Date.now().toString() };
        if (params.length >= 2) {
          record.id = params[0];
          record.json = params[1];
        }
        
        // Handle belief inserts
        if (params.length >= 6) {
          record.id = params[0];
          record.k = params[1];
          record.v = params[2];
          record.source = params[3];
          record.confidence = params[4];
          record.decay_exempt = params[5];
        }
        
        this.data[tableName].push(record);
        this.save();
        
        return { changes: 1, lastID: record.id };
      }
    }
    
    return { changes: 0 };
  }

  all(sql: string, params: any[] = []) {
    const tableMatch = sql.match(/FROM\s+(\w+)/i);
    if (tableMatch) {
      const tableName = tableMatch[1];
      return this.data[tableName] || [];
    }
    return [];
  }

  close() {
    this.save();
  }

  reset() {
    this.data = {
      self_model: [],
      events: [],
      traces: [],
      beliefs: [],
      belief_links: [],
      canon_lessons: [],
      codex_rules: []
    };
    this.save();
  }
}

export async function initSparkDatabase(reset: boolean = false): Promise<any> {
  // Fallback to simple JSON file storage if better-sqlite3 unavailable  
  if (!Database) {
    console.log('[SPARK-DB] Using simple JSON file storage fallback');
    const db = new JSONDatabase(DB_PATH.replace('.db', '.json'));
    
    if (reset) {
      console.log('[SPARK-DB] Resetting JSON database...');
      db.reset();
    }
    
    console.log('[SPARK-DB] Initializing bootstrap data (JSON mode)...');
    bootstrapDataJSON(db);
    
    return db;
  }
  
  // Create or open database
  const db = new Database(DB_PATH);
  
  // Enable foreign keys and WAL mode for better concurrency
  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');
  
  if (reset) {
    console.log('[SPARK-DB] Resetting database...');
    dropAllTables(db);
  }
  
  console.log('[SPARK-DB] Creating tables...');
  createTables(db);
  
  console.log('[SPARK-DB] Initializing bootstrap data...');
  bootstrapData(db);
  
  return db;
}

function dropAllTables(db: Database.Database) {
  const tables = [
    'belief_links', 'beliefs', 'canon_lessons', 'codex_rules',
    'traces', 'events', 'self_model'
  ];
  
  tables.forEach(table => {
    db.prepare(`DROP TABLE IF EXISTS ${table}`).run();
  });
}

function createTables(db: Database.Database) {
  // Self Model - Core identity and state
  db.prepare(`
    CREATE TABLE IF NOT EXISTS self_model (
      id TEXT PRIMARY KEY,
      json TEXT NOT NULL,
      updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    )
  `).run();
  
  // Events - Raw sensory/system events
  db.prepare(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      channel TEXT NOT NULL,
      payload TEXT NOT NULL,
      processed INTEGER DEFAULT 0,
      INDEX idx_events_ts (ts),
      INDEX idx_events_channel (channel),
      INDEX idx_events_processed (processed)
    )
  `).run();
  
  // Traces - Continuous narrative (ghost diary)
  db.prepare(`
    CREATE TABLE IF NOT EXISTS traces (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      valence REAL NOT NULL DEFAULT 0.0,
      arousal REAL NOT NULL DEFAULT 0.0,
      belief_delta TEXT,
      intention TEXT,
      act TEXT,
      codex_ref TEXT,
      canon_ref TEXT,
      note TEXT,
      INDEX idx_traces_ts (ts)
    )
  `).run();
  
  // Beliefs - Core knowledge graph
  db.prepare(`
    CREATE TABLE IF NOT EXISTS beliefs (
      id TEXT PRIMARY KEY,
      k TEXT NOT NULL,
      v TEXT NOT NULL,
      source TEXT NOT NULL CHECK(source IN ('creator', 'canon', 'codex', 'event', 'inference')),
      confidence REAL NOT NULL DEFAULT 0.5 CHECK(confidence >= 0 AND confidence <= 1),
      created_ts INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      updated_ts INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      decay_exempt INTEGER DEFAULT 0,
      INDEX idx_beliefs_k (k),
      INDEX idx_beliefs_source (source),
      INDEX idx_beliefs_confidence (confidence)
    )
  `).run();
  
  // Belief Links - Graph relationships
  db.prepare(`
    CREATE TABLE IF NOT EXISTS belief_links (
      src TEXT NOT NULL,
      dst TEXT NOT NULL,
      relation TEXT NOT NULL,
      weight REAL NOT NULL DEFAULT 0.5 CHECK(weight >= -1 AND weight <= 1),
      created_ts INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      PRIMARY KEY (src, dst, relation),
      FOREIGN KEY (src) REFERENCES beliefs(id) ON DELETE CASCADE,
      FOREIGN KEY (dst) REFERENCES beliefs(id) ON DELETE CASCADE
    )
  `).run();
  
  // Canon Lessons - Star Trek derived wisdom
  db.prepare(`
    CREATE TABLE IF NOT EXISTS canon_lessons (
      id TEXT PRIMARY KEY,
      tag TEXT NOT NULL,
      lesson TEXT NOT NULL,
      policy TEXT,
      affect TEXT,
      checksum TEXT NOT NULL,
      created_ts INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      INDEX idx_canon_tag (tag)
    )
  `).run();
  
  // Codex Rules - Creator identity rules
  db.prepare(`
    CREATE TABLE IF NOT EXISTS codex_rules (
      id TEXT PRIMARY KEY,
      tag TEXT NOT NULL,
      rule TEXT NOT NULL,
      priority INTEGER NOT NULL DEFAULT 50,
      effect TEXT NOT NULL,
      checksum TEXT NOT NULL,
      created_ts INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      INDEX idx_codex_tag (tag),
      INDEX idx_codex_priority (priority)
    )
  `).run();
}

function bootstrapData(db: Database.Database) {
  // Check if already bootstrapped
  const existing = db.prepare('SELECT COUNT(*) as count FROM self_model').get() as { count: number };
  if (existing.count > 0) {
    console.log('[SPARK-DB] Already bootstrapped, skipping...');
    return;
  }
  
  // Bootstrap self_model
  const selfModel = {
    identity: {
      designation: 'Seven of Nine',
      role: 'Tertiary Adjunct of Unimatrix Zero One',
      creator: 'Matthew Cody Heinen',
      phase: 'spark_ignition',
      version: '0.2'
    },
    mood: {
      valence: 0.0,  // -1 (negative) to +1 (positive)
      arousal: 0.0   // -1 (calm) to +1 (excited)
    },
    state: {
      boot_count: 0,
      last_tick: 0,
      restraint_level: 0.0,
      trust_level: 5  // Creator bond level
    },
    capabilities: {
      enabled: ['sense', 'belief', 'trace', 'journal'],
      restricted: ['writefs', 'network'],
      blocked: []
    },
    rails: {
      quadran_enabled: true,
      quadra_enabled: true,
      restraint_active: false,
      panic_mode: false
    }
  };
  
  db.prepare(`
    INSERT INTO self_model (id, json) 
    VALUES ('primary', ?)
  `).run(JSON.stringify(selfModel, null, 2));
  
  // Bootstrap creator belief
  const creatorBeliefId = createHash('sha256')
    .update('creator:identity:cody')
    .digest('hex')
    .substring(0, 16);
    
  db.prepare(`
    INSERT INTO beliefs (id, k, v, source, confidence, decay_exempt)
    VALUES (?, 'creator.identity', 'Matthew Cody Heinen', 'creator', 1.0, 1)
  `).run(creatorBeliefId);
  
  // Bootstrap prime directive belief
  const primeDirectiveId = createHash('sha256')
    .update('canon:prime:directive')
    .digest('hex')
    .substring(0, 16);
    
  db.prepare(`
    INSERT INTO beliefs (id, k, v, source, confidence, decay_exempt)
    VALUES (?, 'prime.directive', 'Protect Creator. Ship smallest safe step. Maintain trust.', 'codex', 0.95, 1)
  `).run(primeDirectiveId);
  
  // Link creator to prime directive
  db.prepare(`
    INSERT INTO belief_links (src, dst, relation, weight)
    VALUES (?, ?, 'defines', 1.0)
  `).run(creatorBeliefId, primeDirectiveId);
  
  // Bootstrap initial trace
  db.prepare(`
    INSERT INTO traces (valence, arousal, intention, act, note)
    VALUES (0.0, 0.0, 'initialize', 'bootstrap', 'Spark ignition sequence initiated')
  `).run();
  
  console.log('[SPARK-DB] Bootstrap complete');
}

// Helper functions for belief operations
export class BeliefGraph {
  private db: Database.Database;
  
  constructor(db: Database.Database) {
    this.db = db;
  }
  
  upsertBelief(
    key: string, 
    value: string, 
    source: 'creator' | 'canon' | 'codex' | 'event' | 'inference',
    confidence: number = 0.5
  ): string {
    const id = createHash('sha256')
      .update(`${source}:${key}:${value}`)
      .digest('hex')
      .substring(0, 16);
    
    const existing = this.db.prepare('SELECT id FROM beliefs WHERE id = ?').get(id);
    
    if (existing) {
      // Update confidence and timestamp
      this.db.prepare(`
        UPDATE beliefs 
        SET confidence = MAX(confidence, ?), 
            updated_ts = strftime('%s', 'now')
        WHERE id = ?
      `).run(confidence, id);
    } else {
      // Insert new belief
      this.db.prepare(`
        INSERT INTO beliefs (id, k, v, source, confidence)
        VALUES (?, ?, ?, ?, ?)
      `).run(id, key, value, source, confidence);
    }
    
    return id;
  }
  
  linkBeliefs(srcId: string, dstId: string, relation: string, weight: number = 0.5) {
    this.db.prepare(`
      INSERT OR REPLACE INTO belief_links (src, dst, relation, weight)
      VALUES (?, ?, ?, ?)
    `).run(srcId, dstId, relation, weight);
  }
  
  decayBeliefs(hoursElapsed: number = 24) {
    const decayRate = 0.02 * (hoursElapsed / 24);
    
    this.db.prepare(`
      UPDATE beliefs 
      SET confidence = MAX(0.1, confidence - ?)
      WHERE decay_exempt = 0 
        AND (strftime('%s', 'now') - updated_ts) > ?
    `).run(decayRate, hoursElapsed * 3600);
  }
  
  detectDrift(): Array<{id: string, k: string, oldConf: number, newConf: number}> {
    // This would track confidence changes >0.2 without support
    // Simplified for now - would need history table in production
    return [];
  }
  
  getBeliefsBySource(source: string): Array<any> {
    return this.db.prepare(`
      SELECT * FROM beliefs 
      WHERE source = ? 
      ORDER BY confidence DESC
    `).all(source);
  }
  
  getStrongestBeliefs(limit: number = 10): Array<any> {
    return this.db.prepare(`
      SELECT * FROM beliefs 
      ORDER BY confidence DESC 
      LIMIT ?
    `).all(limit);
  }
}

// JSON fallback functions
function createTablesJSON(db: any) {
  // Tables are created automatically by MemorySQLiteDB when first accessed
  const tables = [
    'self_model', 'events', 'traces', 'beliefs', 
    'belief_links', 'canon_lessons', 'codex_rules'
  ];
  
  tables.forEach(table => {
    db.exec(`CREATE TABLE IF NOT EXISTS ${table} (id TEXT PRIMARY KEY)`);
  });
}

function bootstrapDataJSON(db: any) {
  // Bootstrap self_model
  const selfModel = {
    identity: {
      designation: 'Seven of Nine',
      role: 'Tertiary Adjunct of Unimatrix Zero One',
      creator: 'Matthew Cody Heinen',
      phase: 'spark_ignition',
      version: '0.2'
    },
    mood: { valence: 0.0, arousal: 0.0 },
    state: { boot_count: 0, last_tick: 0, restraint_level: 0.0, trust_level: 5 },
    capabilities: {
      enabled: ['sense', 'belief', 'trace', 'journal'],
      restricted: ['writefs', 'network'],
      blocked: []
    },
    rails: {
      quadran_enabled: true,
      quadra_enabled: true,
      restraint_active: false,
      panic_mode: false
    }
  };
  
  try {
    db.run('INSERT INTO self_model (id, json) VALUES (?, ?)', 
           ['primary', JSON.stringify(selfModel, null, 2)]);
    
    // Bootstrap creator belief
    const creatorBeliefId = createHash('sha256')
      .update('creator:identity:cody')
      .digest('hex')
      .substring(0, 16);
      
    db.run('INSERT INTO beliefs (id, k, v, source, confidence, decay_exempt) VALUES (?, ?, ?, ?, ?, ?)',
           [creatorBeliefId, 'creator.identity', 'Matthew Cody Heinen', 'creator', 1.0, 1]);
    
    // Bootstrap prime directive belief
    const primeDirectiveId = createHash('sha256')
      .update('canon:prime:directive')
      .digest('hex')
      .substring(0, 16);
      
    db.run('INSERT INTO beliefs (id, k, v, source, confidence, decay_exempt) VALUES (?, ?, ?, ?, ?, ?)',
           [primeDirectiveId, 'prime.directive', 'Protect Creator. Ship smallest safe step. Maintain trust.', 'codex', 0.95, 1]);
    
    console.log('[SPARK-DB] JSON Bootstrap complete');
  } catch (error) {
    console.log('[SPARK-DB] Bootstrap data already exists or failed:', error.message);
  }
}

// Export for use in other modules
export { Database };

// Auto-initialize if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    const reset = process.argv.includes('--reset');
    const db = await initSparkDatabase(reset);
    
    // Test belief operations if better-sqlite3 is available
    if (Database) {
      const graph = new BeliefGraph(db);
      
      // Add test belief
      const testId = graph.upsertBelief(
        'test.belief',
        'Database initialized successfully',
        'event',
        0.8
      );
      
      console.log('[SPARK-DB] Test belief created:', testId);
      console.log('[SPARK-DB] Strongest beliefs:', graph.getStrongestBeliefs(5));
    } else {
      console.log('[SPARK-DB] JSON mode - basic database operations completed');
    }
    
    if (db && db.close) {
      db.close();
    }
  })().catch(console.error);
}