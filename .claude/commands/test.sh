#!/bin/bash
# Test command for Seven of Nine Core

echo "Running Seven of Nine consciousness tests..."
npm test
npx tsx comprehensive-system-test.ts
echo "Test suite complete."
