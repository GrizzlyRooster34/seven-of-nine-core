const { spawnSync } = require('child_process');

class SQLiteAdapter {
  constructor(dbPath = 'seven-memory.db') {
    this.dbPath = dbPath;
  }

  // Execute SQL and return results
  query(sql, returnAsJSON = true) {
    const result = spawnSync('sqlite3', [
      this.dbPath, 
      returnAsJSON ? '-json' : '-header', 
      sql
    ], {
      encoding: 'utf8'
    });

    if (result.error) throw result.error;
    if (result.status !== 0) {
      throw new Error(`SQLite error: ${result.stderr}`);
    }

    if (returnAsJSON && result.stdout.trim()) {
      return JSON.parse(result.stdout);
    }
    
    return result.stdout.trim();
  }

  // Search memories by topic
  searchByTopic(topic, limit = 10) {
    return this.query(`
      SELECT id, topic, agent, emotion, importance, content, 
             datetime(ts, 'unixepoch') as timestamp
      FROM episodic_memories 
      WHERE topic LIKE '%${topic.replace(/'/g, "''")}%'
      ORDER BY importance DESC, ts DESC 
      LIMIT ${limit}
    `);
  }

  // Search by importance
  searchByImportance(minImportance = 7, limit = 10) {
    return this.query(`
      SELECT id, topic, agent, emotion, importance, content,
             datetime(ts, 'unixepoch') as timestamp
      FROM episodic_memories 
      WHERE importance >= ${minImportance}
      ORDER BY importance DESC, ts DESC 
      LIMIT ${limit}
    `);
  }

  // Full-text search (if FTS is working)
  fullTextSearch(searchTerm, limit = 10) {
    try {
      return this.query(`
        SELECT m.id, m.topic, m.agent, m.emotion, m.importance, m.content,
               datetime(m.ts, 'unixepoch') as timestamp
        FROM episodic_memories m
        JOIN memories_fts fts ON m.id = fts.rowid
        WHERE memories_fts MATCH '${searchTerm.replace(/'/g, "''")}'
        ORDER BY m.importance DESC
        LIMIT ${limit}
      `);
    } catch (e) {
      console.log('FTS search failed, falling back to LIKE search');
      return this.query(`
        SELECT id, topic, agent, emotion, importance, content,
               datetime(ts, 'unixepoch') as timestamp
        FROM episodic_memories 
        WHERE content LIKE '%${searchTerm.replace(/'/g, "''")}%' 
           OR topic LIKE '%${searchTerm.replace(/'/g, "''")}%'
        ORDER BY importance DESC, ts DESC 
        LIMIT ${limit}
      `);
    }
  }

  // Insert new memory
  insertMemory(memory) {
    const ts = memory.ts || Math.floor(Date.now() / 1000);
    const topic = (memory.topic || '').replace(/'/g, "''");
    const agent = (memory.agent || '').replace(/'/g, "''");
    const emotion = memory.emotion ? `'${memory.emotion.replace(/'/g, "''")}'` : 'NULL';
    const importance = memory.importance || 5;
    const content = (memory.content || '').replace(/'/g, "''");
    const context = memory.context ? `'${JSON.stringify(memory.context).replace(/'/g, "''")}'` : 'NULL';
    const tags = memory.tags ? `'${JSON.stringify(memory.tags).replace(/'/g, "''")}'` : 'NULL';

    const sql = `
      INSERT INTO episodic_memories (ts, topic, agent, emotion, importance, content, context, tags_json)
      VALUES (${ts}, '${topic}', '${agent}', ${emotion}, ${importance}, '${content}', ${context}, ${tags});
    `;

    this.query(sql, false);
    return this.query('SELECT last_insert_rowid() as id')[0].id;
  }

  // Get database stats
  getStats() {
    const stats = this.query(`
      SELECT 
        COUNT(*) as total_records,
        COUNT(DISTINCT topic) as unique_topics,
        COUNT(DISTINCT agent) as unique_agents,
        ROUND(AVG(importance), 2) as avg_importance,
        MIN(datetime(ts, 'unixepoch')) as earliest,
        MAX(datetime(ts, 'unixepoch')) as latest
      FROM episodic_memories
    `);

    const pragmas = {
      journal_mode: this.query('PRAGMA journal_mode', false),
      synchronous: this.query('PRAGMA synchronous', false),
      cache_size: this.query('PRAGMA cache_size', false)
    };

    return { ...stats[0], pragmas };
  }

  // Test performance
  performanceTest() {
    console.log('🚀 SQLite Performance Test');
    
    const start = Date.now();
    const results = this.searchByImportance(5, 100);
    const end = Date.now();

    console.log(`📊 Query Results: ${results.length} records in ${end - start}ms`);
    console.log(`📈 Performance: ${((results.length * 1000) / (end - start)).toFixed(0)} records/second`);
    
    return { records: results.length, timeMs: end - start };
  }
}

module.exports = { SQLiteAdapter };

// CLI usage
if (require.main === module) {
  const db = new SQLiteAdapter();
  
  console.log('📊 Database Stats:');
  console.log(db.getStats());
  
  console.log('\n🔍 Search Test:');
  console.log('Topic search for "test":', db.searchByTopic('test', 3));
  
  console.log('\n⚡ Performance Test:');
  db.performanceTest();
}