#!/bin/bash
set -e

DB="seven-memory.db"
SRC="./memory-v3/memory-v2/episodic-memories.json"

echo "🚀 Direct SQLite Migration"

# 1. Initialize database
echo "📋 Creating database schema..."
sqlite3 "$DB" < migrations/001_init_schema.sql

# 2. Quick verification
echo "📊 Database initialized:"
sqlite3 "$DB" "SELECT name FROM sqlite_master WHERE type='table';"

# 3. Manual test insert to verify schema
echo "🧪 Testing with sample record..."
sqlite3 "$DB" "INSERT INTO episodic_memories (ts, topic, agent, importance, content) VALUES ($(date +%s), 'test', 'migration-script', 9, 'Schema verification test');"

# 4. Verify test insert
COUNT=$(sqlite3 "$DB" "SELECT COUNT(*) FROM episodic_memories;")
echo "✅ Database functional! Records: $COUNT"

# 5. Show sample
echo "📋 Sample record:"
sqlite3 "$DB" -header -column "SELECT id, topic, agent, importance, datetime(ts, 'unixepoch') as time FROM episodic_memories;"

echo "🎯 Database ready for production migration!"
echo "📍 Location: $(pwd)/$DB"
echo "💾 Size: $(ls -lh $DB | awk '{print $5}')"