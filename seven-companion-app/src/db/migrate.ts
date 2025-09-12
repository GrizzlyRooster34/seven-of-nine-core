import { openDB } from './index.js';

export async function migrate(dbFile = process.env.SEVEN_DB_PATH || 'seven.db') {
  const db = openDB(dbFile);
  
  // Seven core memory tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kind TEXT NOT NULL,
      ts INTEGER NOT NULL,
      content TEXT NOT NULL,
      importance INTEGER DEFAULT 5,
      tags TEXT DEFAULT '[]',
      mode TEXT DEFAULT 'tactical'
    );
    CREATE INDEX IF NOT EXISTS idx_memories_ts ON memories(ts);
    CREATE INDEX IF NOT EXISTS idx_memories_kind ON memories(kind);
    CREATE INDEX IF NOT EXISTS idx_memories_importance ON memories(importance);
  `);
  
  // Conversations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      input TEXT NOT NULL,
      response TEXT NOT NULL,
      mode TEXT NOT NULL,
      emotional_state TEXT,
      confidence REAL DEFAULT 0.5,
      timestamp INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_conversations_ts ON conversations(timestamp);
    CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
  `);
  
  // Sovereignty logs
  db.exec(`
    CREATE TABLE IF NOT EXISTS sovereignty_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      trigger_event TEXT NOT NULL,
      result TEXT NOT NULL,
      audit_trail TEXT,
      timestamp INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_sovereignty_ts ON sovereignty_logs(timestamp);
  `);
  
  console.log('✅ Database migration completed');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  migrate().catch(console.error);
}