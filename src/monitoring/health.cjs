const { spawnSync } = require('child_process');
const http = require('http');

class HealthMonitor {
  constructor(dbPath = 'seven-memory.db') {
    this.dbPath = dbPath;
  }

  query(sql) {
    const result = spawnSync('sqlite3', [this.dbPath, '-json', sql], {
      encoding: 'utf8'
    });

    if (result.error) throw result.error;
    if (result.status !== 0) {
      throw new Error(`SQLite error: ${result.stderr}`);
    }

    return result.stdout.trim() ? JSON.parse(result.stdout) : [];
  }

  getDbStats() {
    const stats = this.query(`
      SELECT 
        COUNT(*) as total_records,
        COUNT(DISTINCT topic) as unique_topics,
        COUNT(DISTINCT agent) as unique_agents,
        ROUND(AVG(importance), 2) as avg_importance,
        MIN(datetime(ts, 'unixepoch')) as earliest,
        MAX(datetime(ts, 'unixepoch')) as latest
      FROM episodic_memories
    `)[0];

    const pragmas = {
      journal_mode: spawnSync('sqlite3', [this.dbPath, 'PRAGMA journal_mode'], {encoding: 'utf8'}).stdout.trim(),
      synchronous: spawnSync('sqlite3', [this.dbPath, 'PRAGMA synchronous'], {encoding: 'utf8'}).stdout.trim(),
      cache_size: spawnSync('sqlite3', [this.dbPath, 'PRAGMA cache_size'], {encoding: 'utf8'}).stdout.trim()
    };

    return { ...stats, pragmas };
  }

  performanceTest() {
    const start = Date.now();
    const results = this.query(`
      SELECT id, ts, topic, importance 
      FROM episodic_memories 
      WHERE importance >= 5 
      ORDER BY ts DESC 
      LIMIT 100
    `);
    const end = Date.now();

    return {
      records: results.length,
      timeMs: end - start,
      recordsPerSecond: Math.round((results.length * 1000) / (end - start))
    };
  }

  getSystemStats() {
    // Get basic system info
    const uptime = spawnSync('uptime', [], {encoding: 'utf8'}).stdout.trim();
    const memInfo = spawnSync('free', ['-h'], {encoding: 'utf8'}).stdout.split('\n')[1];
    const nodeVersion = process.version;
    const platform = process.platform;

    return {
      uptime: uptime.split('load average:')[0].trim(),
      memory: memInfo.split(/\s+/).slice(1, 4).join(' used, '),
      node_version: nodeVersion,
      platform,
      pid: process.pid
    };
  }

  getHealthStatus() {
    try {
      const db = this.getDbStats();
      const performance = this.performanceTest();
      const system = this.getSystemStats();

      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: {
          records: db.total_records,
          topics: db.unique_topics,
          agents: db.unique_agents,
          avg_importance: db.avg_importance,
          date_range: `${db.earliest} to ${db.latest}`,
          wal_enabled: db.pragmas.journal_mode.includes('wal'),
          pragmas: db.pragmas
        },
        performance: {
          query_time_ms: performance.timeMs,
          records_per_second: performance.recordsPerSecond,
          last_test_records: performance.records
        },
        system,
        checks: {
          database_accessible: true,
          wal_mode: db.pragmas.journal_mode.includes('wal'),
          has_data: db.total_records > 0,
          performance_ok: performance.recordsPerSecond > 100
        }
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message,
        checks: {
          database_accessible: false,
          wal_mode: false,
          has_data: false,
          performance_ok: false
        }
      };
    }
  }
}

function createHealthEndpoint(port = 3001) {
  const monitor = new HealthMonitor();
  
  const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.url === '/health') {
      const health = monitor.getHealthStatus();
      const statusCode = health.status === 'healthy' ? 200 : 500;
      
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(health, null, 2));
      
    } else if (req.url === '/performance') {
      const performance = monitor.performanceTest();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(performance, null, 2));
      
    } else if (req.url === '/db-stats') {
      const stats = monitor.getDbStats();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(stats, null, 2));
      
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Not Found',
        endpoints: ['/health', '/performance', '/db-stats']
      }));
    }
  });
  
  server.listen(port, () => {
    console.log(`🩺 Health monitoring server running on http://localhost:${port}`);
    console.log('📊 Available endpoints:');
    console.log(`   • http://localhost:${port}/health`);
    console.log(`   • http://localhost:${port}/performance`);
    console.log(`   • http://localhost:${port}/db-stats`);
  });
  
  return server;
}

// CLI usage
if (require.main === module) {
  const port = process.env.PORT || 3001;
  const server = createHealthEndpoint(port);
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down health monitor...');
    server.close(() => {
      console.log('✅ Health monitor stopped');
      process.exit(0);
    });
  });
}

module.exports = { HealthMonitor, createHealthEndpoint };