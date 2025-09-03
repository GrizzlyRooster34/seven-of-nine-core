import http from 'http'
import Database from 'better-sqlite3'

let nativeAvailable = false
try { require('../../native-core/memory-engine/build/Release/memory_engine.node'); nativeAvailable = true } catch {}

const db = new Database(process.env.DB_PATH || 'seven-memory.db', { readonly:true })

function getStats() {
  const total = db.prepare('SELECT COUNT(*) AS n FROM episodic_memories').get() as any
  const pragma = {
    journal_mode: db.pragma('journal_mode', { simple:true }),
    synchronous: db.pragma('synchronous', { simple:true }),
    cache_size: db.pragma('cache_size', { simple:true })
  }
  return { total: total.n, pragma, nativeAvailable }
}

const server = http.createServer((req,res)=>{
  if (req.url === '/health') {
    const out = getStats()
    res.setHeader('content-type','application/json')
    res.end(JSON.stringify({ ok:true, ...out }))
  } else {
    res.statusCode = 404
    res.end('not found')
  }
})

const port = Number(process.env.PORT || 7077)
server.listen(port, ()=> console.log(`[health] listening on ${port}`))