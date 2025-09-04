#!/usr/bin/env node

// Node.js SQLite migration using spawn to call sqlite3 command
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SRC = process.env.JSON_SRC || './memory-v3/memory-v2/episodic-memories.json';
const DB = process.env.DB_PATH || 'seven-memory.db';
const LIMIT = parseInt(process.env.LIMIT || '50');
const DRY = process.env.DRY_RUN === '1';

function execSqlite(db, sql) {
  const result = spawnSync('sqlite3', [db], {
    input: sql,
    encoding: 'utf8'
  });
  
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`SQLite error: ${result.stderr}`);
  }
  
  return result.stdout.trim();
}

function main() {
  console.log(`[migrate] src=${SRC} db=${DB} limit=${LIMIT} dry=${DRY}`);

  // Check source file
  if (!fs.existsSync(SRC)) {
    console.log(`❌ Source not found: ${SRC}`);
    return;
  }

  // Load and parse JSON
  const data = JSON.parse(fs.readFileSync(SRC, 'utf8'));
  const subset = data.slice(0, LIMIT);
  
  console.log(`📊 Found ${data.length} records, processing ${subset.length}`);

  if (DRY) {
    console.log('🔍 DRY RUN - Sample record:');
    console.log(JSON.stringify(subset[0], null, 2));
    return;
  }

  // Initialize DB (if not exists)
  if (!fs.existsSync(DB)) {
    console.log('📋 Initializing database...');
    const schema = fs.readFileSync('./migrations/001_init_schema.sql', 'utf8');
    execSqlite(DB, schema);
  }

  // Prepare SQL inserts
  console.log('🔄 Converting records...');
  let inserts = [];
  
  for (const record of subset) {
    const ts = Math.floor(new Date(record.timestamp).getTime() / 1000);
    const topic = (record.topic || '').replace(/'/g, "''");
    const agent = (record.agent || '').replace(/'/g, "''");
    const emotion = record.emotion ? `'${record.emotion.replace(/'/g, "''")}'` : 'NULL';
    const importance = record.importance || 5;
    const content = (record.context || '').replace(/'/g, "''");
    const context = record.context ? `'${JSON.stringify(record.context).replace(/'/g, "''")}'` : 'NULL';
    const tags = record.tags ? `'${JSON.stringify(record.tags).replace(/'/g, "''")}'` : 'NULL';
    
    inserts.push(
      `INSERT INTO episodic_memories (ts, topic, agent, emotion, importance, content, context, tags_json) ` +
      `VALUES (${ts}, '${topic}', '${agent}', ${emotion}, ${importance}, '${content}', ${context}, ${tags});`
    );
  }

  // Execute inserts in transaction
  const sql = `
    BEGIN TRANSACTION;
    ${inserts.join('\n    ')}
    COMMIT;
  `;

  console.log('💾 Executing transaction...');
  execSqlite(DB, sql);

  // Verify results
  const count = execSqlite(DB, 'SELECT COUNT(*) FROM episodic_memories;');
  console.log(`✅ Migration complete! Total records: ${count}`);

  // Show sample
  console.log('📋 Sample records:');
  const sample = execSqlite(DB, `
    SELECT id, topic, agent, importance, datetime(ts, 'unixepoch') as time 
    FROM episodic_memories 
    ORDER BY ts DESC 
    LIMIT 3;
  `);
  console.log(sample);

  // Stats
  const stats = execSqlite(DB, `
    SELECT 
      'Total: ' || COUNT(*) as stat
    FROM episodic_memories
    UNION ALL
    SELECT 
      'Topics: ' || COUNT(DISTINCT topic) as stat
    FROM episodic_memories
    UNION ALL  
    SELECT
      'Avg Importance: ' || ROUND(AVG(importance), 1) as stat
    FROM episodic_memories;
  `);
  console.log('📈 Database stats:');
  console.log(stats);
}

if (require.main === module) {
  main();
}