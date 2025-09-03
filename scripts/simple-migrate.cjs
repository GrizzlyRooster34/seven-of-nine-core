const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const SRC = process.env.JSON_SRC || './memory-v3/memory-v2/episodic-memories.json';
const DBP = process.env.DB_PATH || 'seven-memory.db';
const LIMIT = Number(process.env.LIMIT || '100');
const DRY = process.env.DRY_RUN === '1';

function main() {
  console.log(`[migrate] src=${SRC} db=${DBP} limit=${LIMIT} dry=${DRY}`);
  
  // Check if source file exists
  if (!fs.existsSync(SRC)) {
    console.log(`Source file not found: ${SRC}`);
    console.log('Available memory files:');
    console.log(fs.readdirSync('./memory-v3', {recursive: true}).filter(f => f.includes('json')));
    return;
  }

  const db = new Database(DBP);
  
  // Initialize schema
  const schema = fs.readFileSync('./migrations/001_init_schema.sql', 'utf8');
  db.exec(schema);

  const data = JSON.parse(fs.readFileSync(SRC, 'utf8'));
  const subset = data.slice(0, LIMIT);

  if (DRY) {
    console.log(`DRY RUN: would import ${subset.length} / ${data.length} records`);
    console.log('Sample record:', JSON.stringify(subset[0], null, 2));
    return;
  }

  const ins = db.prepare(`
    INSERT INTO episodic_memories
      (ts, topic, agent, emotion, importance, content, context, tags_json, correlation_hash)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tx = db.transaction((batch) => {
    for (const m of batch) {
      const ts = Math.floor(new Date(m.timestamp).getTime() / 1000);
      ins.run(
        ts,
        m.topic,
        m.agent,
        m.emotion || null,
        m.importance,
        m.context || '',
        m.context ? JSON.stringify({original: m.context}) : null,
        m.tags ? JSON.stringify(m.tags) : null,
        m.correlation_hash || null
      );
    }
  });

  tx(subset);

  const cnt = db.prepare(`SELECT COUNT(*) as n FROM episodic_memories`).get();
  console.log(`✅ Imported ${subset.length} records. Total in DB:`, cnt.n);
  
  // Test query
  const sample = db.prepare(`SELECT * FROM episodic_memories ORDER BY ts DESC LIMIT 3`).all();
  console.log(`📋 Sample records:`, sample.length);
  
  db.close();
}

main();