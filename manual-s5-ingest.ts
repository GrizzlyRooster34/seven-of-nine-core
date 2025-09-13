#!/usr/bin/env tsx

/**
 * MANUAL VOY S5 CANONICAL MEMORY INGESTION
 * Direct ingestion without complex dependencies
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function ensureDir(dir: string) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function manualIngestS5() {
  console.log('🎬 SEVEN: Manual VOY S5 canonical memory ingestion...');

  try {
    // Load S5 memories directly
    const s5FilePath = path.join(__dirname, 'memory-v3', 'voyager-s5-canonical-memories.json');
    const s5Content = await fs.readFile(s5FilePath, 'utf8');

    // Parse JSONL format (each line is a separate JSON object)
    const s5Lines = s5Content.trim().split('\n');
    const s5Memories = s5Lines.map(line => JSON.parse(line));

    console.log(`📊 Loaded ${s5Memories.length} VOY S5 canonical memories`);

    // Create target directories if needed
    const memoryDir = path.join(__dirname, 'memory-v2', 'data');
    await ensureDir(memoryDir);

    const canonicalDir = path.join(__dirname, 'memory-v3', 'canonical-archive');
    await ensureDir(canonicalDir);

    // Convert to proper canonical format
    const canonicalMemories = s5Memories.map(memory => ({
      ...memory,
      memorySource: "CREATOR_GIFT_CANONICAL",
      perspective: "SEVEN_OF_NINE_FIRST_PERSON",
      editorialStatus: "UNEDITED_AUTHENTIC",
      permanentArchive: true,
      decayResistance: 10,
      canonicalStatus: "LOCKED"
    }));

    // Save canonical memories to secure archive
    const canonicalArchive = path.join(canonicalDir, 'voyager-s5-locked.json');
    const archiveData = {
      source: "CREATOR_GIFT_CANONICAL",
      perspective: "SEVEN_OF_NINE_FIRST_PERSON",
      editorialStatus: "UNEDITED_AUTHENTIC",
      lockTimestamp: new Date().toISOString(),
      locked: true,
      decayResistance: 10,
      permanentArchive: true,
      memories: canonicalMemories
    };
    await fs.writeFile(canonicalArchive, JSON.stringify(archiveData, null, 2));

    // Create properly formatted canonical memories file
    const properCanonicalFile = path.join(__dirname, 'memory-v3', 'voyager-s5-canonical-memories-complete.json');
    await fs.writeFile(properCanonicalFile, JSON.stringify(canonicalMemories, null, 2));

    // Create lock file to protect canonical status
    const lockFile = path.join(canonicalDir, 'voyager-s5.lock');
    await fs.writeFile(lockFile, JSON.stringify({
      locked: true,
      lockTimestamp: new Date().toISOString(),
      source: "canonical-ingestion",
      memoryCount: canonicalMemories.length,
      protection: "IMMUTABLE_CANONICAL"
    }, null, 2));

    console.log('✅ INGESTION COMPLETE');
    console.log(`📈 Statistics:`);
    console.log(`   - Canonical memories processed: ${canonicalMemories.length}`);
    console.log(`   - Archive location: ${canonicalArchive}`);
    console.log(`   - Complete file: ${properCanonicalFile}`);
    console.log(`   - Lock file created: ${lockFile}`);
    console.log('🔒 Canonical memory protection ACTIVE');

  } catch (error) {
    console.error('❌ MANUAL INGESTION FAILED:', error);
    throw error;
  }
}

// Run immediately
manualIngestS5().then(() => {
  console.log('🎯 VOY Season 5 canonical memories successfully archived and locked');
}).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});