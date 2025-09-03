import http from 'http'
import { spawnSync } from 'child_process'

let nativeAvailable = false
try { require('../../native-core/memory-engine/build/Release/memory_engine.node'); nativeAvailable = true } catch {}

const dbPath = process.env.DB_PATH || 'seven-memory.db'

function sqliteQuery(sql: string): any {
  const result = spawnSync('sqlite3', [dbPath, '-json', sql], {
    encoding: 'utf8'
  })

  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`SQLite error: ${result.stderr}`)
  }

  return result.stdout.trim() ? JSON.parse(result.stdout) : []
}

function getStats() {
  const total = sqliteQuery('SELECT COUNT(*) AS n FROM episodic_memories')[0]
  const pragma = {
    journal_mode: spawnSync('sqlite3', [dbPath, 'PRAGMA journal_mode'], {encoding: 'utf8'}).stdout.trim(),
    synchronous: spawnSync('sqlite3', [dbPath, 'PRAGMA synchronous'], {encoding: 'utf8'}).stdout.trim(),
    cache_size: spawnSync('sqlite3', [dbPath, 'PRAGMA cache_size'], {encoding: 'utf8'}).stdout.trim()
  }
  return { total: total.n, pragma, nativeAvailable }
}

function performanceTest() {
  const start = Date.now()
  const results = sqliteQuery(`
    SELECT id, ts, topic, importance 
    FROM episodic_memories 
    WHERE importance >= 5 
    ORDER BY ts DESC 
    LIMIT 100
  `)
  const end = Date.now()

  return {
    records: results.length,
    timeMs: end - start,
    recordsPerSecond: Math.round((results.length * 1000) / (end - start))
  }
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  try {
    if (req.url === '/health') {
      const stats = getStats()
      const perf = performanceTest()
      
      const response = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: {
          records: stats.total,
          wal_enabled: stats.pragma.journal_mode.includes('wal'),
          pragma: stats.pragma
        },
        performance: perf,
        native_module: nativeAvailable,
        checks: {
          database_accessible: true,
          has_data: stats.total > 0,
          performance_ok: perf.recordsPerSecond > 100
        }
      }
      
      res.end(JSON.stringify(response, null, 2))
      
    } else if (req.url === '/perf') {
      const perf = performanceTest()
      res.end(JSON.stringify(perf, null, 2))
      
    } else {
      res.statusCode = 404
      res.end(JSON.stringify({ error: 'Not found', endpoints: ['/health', '/perf'] }))
    }
  } catch (error) {
    res.statusCode = 500
    res.end(JSON.stringify({ 
      status: 'error', 
      message: error.message,
      timestamp: new Date().toISOString()
    }))
  }
})

const port = Number(process.env.PORT || 7077)
server.listen(port, () => console.log(`[health] listening on ${port}`))