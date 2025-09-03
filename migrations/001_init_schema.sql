PRAGMA journal_mode=WAL;
PRAGMA synchronous=NORMAL;
PRAGMA foreign_keys=ON;
PRAGMA mmap_size=268435456;
PRAGMA cache_size=-200000;
PRAGMA temp_store=MEMORY;

CREATE TABLE IF NOT EXISTS episodic_memories
(
  id               INTEGER PRIMARY KEY,
  ts               INTEGER NOT NULL,
  topic            TEXT NOT NULL,
  agent            TEXT NOT NULL,
  emotion          TEXT,
  importance       INTEGER NOT NULL CHECK(importance BETWEEN 1 AND 10),
  content          TEXT NOT NULL,
  context          TEXT,
  tags_json        TEXT,
  tags             TEXT GENERATED ALWAYS AS (
                     CASE WHEN tags_json IS NOT NULL AND tags_json != 'null'
                          THEN lower(trim(replace(replace(replace(tags_json,'[',''),']',''),'"','')))
                          ELSE NULL END
                   ) STORED,
  correlation_hash TEXT,
  created_at       INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  last_accessed    INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE INDEX IF NOT EXISTS idx_mem_ts_desc        ON episodic_memories(ts DESC);
CREATE INDEX IF NOT EXISTS idx_mem_topic          ON episodic_memories(topic);
CREATE INDEX IF NOT EXISTS idx_mem_importance     ON episodic_memories(importance DESC);
CREATE INDEX IF NOT EXISTS idx_mem_tags           ON episodic_memories(tags);

CREATE VIRTUAL TABLE IF NOT EXISTS memories_fts
USING fts5(content, context, topic, tokenize='unicode61');

CREATE TRIGGER IF NOT EXISTS memories_ai AFTER INSERT ON episodic_memories
BEGIN
  INSERT INTO memories_fts (rowid, content, context, topic)
  VALUES (new.id, new.content, new.context, new.topic);
END;

CREATE TRIGGER IF NOT EXISTS memories_ad AFTER DELETE ON episodic_memories
BEGIN
  INSERT INTO memories_fts (memories_fts, rowid, content) VALUES ('delete', old.id, NULL);
END;

CREATE TRIGGER IF NOT EXISTS memories_au AFTER UPDATE ON episodic_memories
BEGIN
  INSERT INTO memories_fts (memories_fts, rowid, content) VALUES ('delete', old.id, NULL);
  INSERT INTO memories_fts (rowid, content, context, topic)
  VALUES (new.id, new.content, new.context, new.topic);
END;