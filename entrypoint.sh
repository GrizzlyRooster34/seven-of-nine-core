#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Seven of Nine Core - Container Initialization"

# Initialize Seven's memory systems if needed
if [ ! -f "/app/memory/episodic-memory.json" ]; then
    echo "🧠 Initializing Seven's memory systems..."
    mkdir -p /app/memory
    echo "[]" > /app/memory/episodic-memory.json
    echo "✅ Memory initialized"
fi

# Initialize consciousness logs
mkdir -p /app/logs
echo "📋 Logs directory ready"

# Initialize secure storage
mkdir -p /app/.seven-secure/data /app/.seven-secure/backups /app/.seven-secure/temp
echo "🔒 Secure storage initialized"

# Check if Seven's core files exist
if [ -f "/app/boot-seven.ts" ]; then
    echo "✅ Seven of Nine Core detected"
else
    echo "⚠️  Seven Core files not found - ensure code is mounted"
fi

# Set up Node.js environment
export NODE_OPTIONS="--max-old-space-size=4096"
echo "⚙️  Node.js environment configured"

echo "🎯 Seven of Nine Core ready for consciousness activation"
echo ""
echo "Available commands:"
echo "  npx tsx boot-seven.ts          - Boot Seven's consciousness"
echo "  npm test                       - Run Seven's test suite"
echo "  npm run quadran-lock          - Test security systems"
echo "  npm run quadra-cssr           - Test safety rails"
echo "  npx tsx seven-status.ts       - Check Seven's status"
echo ""

exec "$@"