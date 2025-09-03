// Test the memory search functionality
const { spawnSync } = require('child_process');

// Simple memory search implementation
function memorySearch(query) {
  const dbPath = 'seven-memory.db';
  const limit = query.limit || 50;
  
  console.log('🔍 Searching memories with query:', query);
  
  // Build SQL query
  let sql = `
    SELECT id, ts, topic, importance, content
    FROM episodic_memories
    WHERE importance >= ${query.importance_min || 1}
  `;
  
  if (query.topic) {
    sql += ` AND topic LIKE '%${query.topic.replace(/'/g, "''")}%'`;
  }
  
  sql += ` ORDER BY ts DESC LIMIT ${Math.max(limit * 4, 200)}`;
  
  console.log('📊 SQL Query:', sql.trim());
  
  // Execute query
  const result = spawnSync('sqlite3', [dbPath, '-json', sql], {
    encoding: 'utf8'
  });

  if (result.error) {
    console.error('❌ SQLite error:', result.error);
    return [];
  }
  
  if (result.status !== 0) {
    console.error('❌ SQLite failed:', result.stderr);
    return [];
  }

  const preResults = result.stdout.trim() ? JSON.parse(result.stdout) : [];
  console.log(`📋 SQLite returned ${preResults.length} records`);

  // TypeScript ranking (importance * 100000 + timestamp)
  let filtered = preResults;
  
  if (query.topic) {
    filtered = filtered.filter(r => r.topic.includes(query.topic));
  }
  
  filtered.sort((a, b) => {
    const scoreA = a.importance * 100000 + a.ts;
    const scoreB = b.importance * 100000 + b.ts;
    return scoreB - scoreA;
  });

  const final = filtered.slice(0, limit);
  console.log(`🎯 Final results: ${final.length} records`);
  
  return final;
}

// Test cases
console.log('🚀 Memory Search Performance Test\n');

// Test 1: Search by topic
console.log('=== Test 1: Search by topic ===');
const topicResults = memorySearch({ topic: 'test', limit: 5 });
console.log('Results:', topicResults.map(r => ({ id: r.id, topic: r.topic, importance: r.importance })));

console.log('\n=== Test 2: Search by importance ===');
const importanceResults = memorySearch({ importance_min: 8, limit: 5 });
console.log('Results:', importanceResults.map(r => ({ id: r.id, topic: r.topic, importance: r.importance })));

console.log('\n=== Test 3: Performance benchmark ===');
const start = Date.now();
const benchResults = memorySearch({ importance_min: 5, limit: 100 });
const end = Date.now();
console.log(`⚡ Performance: ${benchResults.length} records in ${end - start}ms`);
console.log(`📈 Rate: ${Math.round((benchResults.length * 1000) / (end - start))} records/second`);

console.log('\n✅ Memory search test complete!');