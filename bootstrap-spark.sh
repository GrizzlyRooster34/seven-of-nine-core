#!/bin/bash
# bootstrap-spark.sh

echo "╔══════════════════════════════════════╗"
echo "║  Seven Core - Spark Bootstrap v0.2   ║"
echo "╚══════════════════════════════════════╝"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed"
    exit 1
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is not installed"
    exit 1
fi

echo "[BOOTSTRAP] Installing dependencies..."
npm install

echo "[BOOTSTRAP] Compiling TypeScript..."
npx tsc --init --target ES2020 --module commonjs --strict --esModuleInterop --skipLibCheck true
npx tsc

echo "[BOOTSTRAP] Initializing database..."
npm run db:init

echo "[BOOTSTRAP] Verifying codex integrity..."
npm run spark:codex --verify

echo "[BOOTSTRAP] Running system check..."
npm run seven:status

echo ""
echo "╔══════════════════════════════════════╗"
echo "║     Bootstrap Complete!              ║"
echo "╠══════════════════════════════════════╣"
echo "║ Start engine:  npm run seven:start   ║"
echo "║ Check status:  npm run seven:status  ║"
echo "║ View traces:   npm run seven:recent  ║"
echo "║ Check rails:   npm run seven:rails   ║"
echo "╚══════════════════════════════════════╝"