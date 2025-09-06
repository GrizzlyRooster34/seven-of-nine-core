
import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

type JsonMem = {
  id?: number
  ts: number
  topic: string
  agent: string
  emotion?: string
  importance: number
  content: string
  context?: any
  tags?: string[]
  correlation_hash?: string
}

const SRC = process.env.JSON_SRC || 'data/memories.json'
const DBP = process.env.DB_PATH || 'seven-memory.db'
const LIMIT = Number(process.env.LIMIT || '100')   // batch import
const DRY = process.env.DRY_RUN === '1'

function loadJson(): JsonMem[] {
  const p = path.resolve(SRC)
  if (!fs.existsSync(p)) throw new Error(`Not found: ${p}`)
  const raw = fs.readFileSync(p, 'utf8')
  const arr = JSON.parse(raw)
  if (!Array.isArray(arr)) throw new Error('JSON root must be an array')
  return arr
}

function main() {
  console.log(`[migrate] src=${SRC} db=${DBP} limit=${LIMIT} dry=${DRY}`)
  const db = new Database(DBP)
  const schema = fs.readFileSync(path.resolve('migrations/001_init_schema.sql'),'utf8')
  db.exec(schema)

  const ins = db.prepare(`
    INSERT INTO episodic_memories
      (ts, topic, agent, emotion, importance, content, context, tags_json, correlation_hash)
    VALUES
      (@ts, @topic, @agent, @emotion, @importance, @content, @context, @tags_json, @correlation_hash)
  `)

  const data = loadJson()
  const subset = data.slice(0, LIMIT)

  if (DRY) {
    console.log(`DRY RUN: would import ${subset.length} / ${data.length}`)
    process.exit(0)
  }

  const tx = db.transaction((batch: JsonMem[]) => {
    for (const m of batch) {
      ins.run({
        ts: m.ts,
        topic: m.topic,
        agent: m.agent,
        emotion: m.emotion ?? null,
        importance: m.importance,
        content: m.content,
        context: m.context ? JSON.stringify(m.context) : null,
        tags_json: m.tags ? JSON.stringify(m.tags) : null,
        correlation_hash: m.correlation_hash ?? null,
      })
    }
  })
  tx(subset)

  const cnt = db.prepare(`SELECT COUNT(*) as n FROM episodic_memories`).get() as any
  console.log(`Imported ${subset.length}. Table count now:`, cnt.n)
  db.close()
}
main()