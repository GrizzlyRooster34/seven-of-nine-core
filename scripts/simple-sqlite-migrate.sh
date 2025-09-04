#!/bin/bash

# Simple SQLite migration using command-line tools
set -e

SRC=${JSON_SRC:-"./memory-v3/memory-v2/episodic-memories.json"}  
DB=${DB_PATH:-"seven-memory.db"}
LIMIT=${LIMIT:-50}

echo "[migrate] src=$SRC db=$DB limit=$LIMIT"

# Initialize database
echo "📋 Initializing database..."
sqlite3 "$DB" < migrations/001_init_schema.sql

# Count records
TOTAL=$(jq '. | length' "$SRC")
echo "📊 Found $TOTAL records in JSON, importing first $LIMIT"

# Create simple SQL inserts 
echo "🔄 Converting to SQL inserts..."
jq -r --argjson limit $LIMIT '
  .[:$limit] | .[] | 
  "INSERT INTO episodic_memories (ts, topic, agent, emotion, importance, content, context, tags_json, correlation_hash) VALUES (" +
  ((.timestamp | sub("\\.[0-9]+Z$"; "Z") | fromdate) | tostring) + "," +
  "\"" + (.topic | gsub("\""; "\"\"")) + "\"," +
  "\"" + (.agent | gsub("\""; "\"\"")) + "\"," +
  (if .emotion then "\"" + (.emotion | gsub("\""; "\"\"")) + "\"" else "NULL" end) + "," +
  (.importance | tostring) + "," +  
  "\"" + ((.context // "") | gsub("\""; "\"\"")) + "\"," +
  (if .context then "\"" + (.context | tostring | gsub("\""; "\"\"")) + "\"" else "NULL" end) + "," +
  (if .tags then "\"" + (.tags | tostring | gsub("\""; "\"\"")) + "\"" else "NULL" end) + "," +
  (if .correlation_hash then "\"" + (.correlation_hash | gsub("\""; "\"\"")) + "\"" else "NULL" end) + 
  ");"
' "$SRC" > /tmp/inserts.sql

# Execute inserts
echo "💾 Executing inserts..."
sqlite3 "$DB" < /tmp/inserts.sql

# Verify
COUNT=$(sqlite3 "$DB" "SELECT COUNT(*) FROM episodic_memories;")
echo "✅ Imported $COUNT records"

# Sample data
echo "📋 Sample records:"
sqlite3 "$DB" -header -column "SELECT id, topic, agent, importance FROM episodic_memories ORDER BY ts DESC LIMIT 3;"

# Stats
echo "📈 Database ready!"
echo "Database file: $(ls -lh $DB)"

rm -f /tmp/inserts.sql