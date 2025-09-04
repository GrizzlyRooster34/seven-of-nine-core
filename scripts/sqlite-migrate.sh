#!/bin/bash

# SQLite migration using command-line tools
set -e

SRC=${JSON_SRC:-"./memory-v3/memory-v2/episodic-memories.json"}
DB=${DB_PATH:-"seven-memory.db"}
LIMIT=${LIMIT:-100}

echo "[migrate] src=$SRC db=$DB limit=$LIMIT"

# Check if source exists
if [ ! -f "$SRC" ]; then
    echo "❌ Source file not found: $SRC"
    echo "Available memory files:"
    find ./memory-v3 -name "*.json" | head -5
    exit 1
fi

# Initialize database with schema
echo "📋 Initializing database schema..."
sqlite3 "$DB" < migrations/001_init_schema.sql

# Count records in JSON
TOTAL=$(jq '. | length' "$SRC")
echo "📊 Found $TOTAL records in JSON, importing first $LIMIT"

# Extract and convert records using jq + sqlite3
echo "🔄 Converting JSON to SQLite..."
jq -r --argjson limit $LIMIT '
  .[:$limit] | .[] | 
  [
    (.timestamp | strptime("%Y-%m-%dT%H:%M:%S.%fZ") | mktime),
    .topic,
    .agent,
    (.emotion // null),
    .importance,
    (.context // ""),
    (.context | if . then tostring else null end),
    (.tags | if . then tostring else null end),
    (.correlation_hash // null)
  ] | @csv
' "$SRC" | sqlite3 "$DB" ".mode csv" ".import /dev/stdin episodic_memories(ts, topic, agent, emotion, importance, content, context, tags_json, correlation_hash)"

# Verify import
COUNT=$(sqlite3 "$DB" "SELECT COUNT(*) FROM episodic_memories;")
echo "✅ Imported $COUNT records into SQLite"

# Show sample data
echo "📋 Sample records:"
sqlite3 "$DB" -header -column "SELECT id, topic, agent, importance, datetime(ts, 'unixepoch') as timestamp FROM episodic_memories ORDER BY ts DESC LIMIT 3;"

# Show database stats
echo "📈 Database stats:"
sqlite3 "$DB" "
SELECT 
  'Total records: ' || COUNT(*) as stat
FROM episodic_memories
UNION ALL
SELECT 
  'Unique topics: ' || COUNT(DISTINCT topic) as stat  
FROM episodic_memories
UNION ALL
SELECT
  'Avg importance: ' || ROUND(AVG(importance), 2) as stat
FROM episodic_memories;
"

echo "🎯 Migration complete! Database ready at: $DB"