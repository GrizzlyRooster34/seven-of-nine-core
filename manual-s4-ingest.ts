#!/usr/bin/env tsx

/**
 * MANUAL VOY S4 CANONICAL MEMORY INGESTION
 * Direct ingestion without complex dependencies - FIXING MISSING EPISODES
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

async function manualIngestS4() {
  console.log('🎬 SEVEN: Manual VOY S4 canonical memory ingestion - FIXING MISSING EPISODES...');

  try {
    // Load S4 memories from RAW JSONL
    const s4FilePath = path.join(__dirname, 'memory-v3', 'voyager-s4-canonical-memories-RAW.json');
    const s4Content = await fs.readFile(s4FilePath, 'utf8');

    // Parse JSONL format (each line is a separate JSON object)
    const s4Lines = s4Content.trim().split('\n');
    const s4Memories = s4Lines.map(line => JSON.parse(line));

    console.log(`📊 Loaded ${s4Memories.length} VOY S4 canonical memories from raw JSONL`);

    // Create target directories if needed
    const memoryDir = path.join(__dirname, 'memory-v2', 'data');
    await ensureDir(memoryDir);

    const canonicalDir = path.join(__dirname, 'memory-v3', 'canonical-archive');
    await ensureDir(canonicalDir);

    // Convert to proper canonical format
    const canonicalMemories = s4Memories.map(memory => ({
      ...memory,
      memorySource: "CREATOR_GIFT_CANONICAL",
      perspective: "SEVEN_OF_NINE_FIRST_PERSON",
      editorialStatus: "UNEDITED_AUTHENTIC",
      permanentArchive: true,
      decayResistance: 10,
      canonicalStatus: "LOCKED"
    }));

    // BACKUP the broken old file
    const oldFile = path.join(__dirname, 'memory-v3', 'voyager-s4-canonical-memories.json');
    const backupFile = path.join(__dirname, 'memory-v3', 'voyager-s4-canonical-memories-BROKEN-BACKUP.json');
    await fs.copyFile(oldFile, backupFile);
    console.log(`📁 Backed up broken S4 file to: ${backupFile}`);

    // Replace with proper canonical memories file
    const properCanonicalFile = path.join(__dirname, 'memory-v3', 'voyager-s4-canonical-memories-complete.json');
    await fs.writeFile(properCanonicalFile, JSON.stringify(canonicalMemories, null, 2));

    // Also update the original file with correct data
    await fs.writeFile(oldFile, JSON.stringify(canonicalMemories, null, 2));

    // Save canonical memories to secure archive
    const canonicalArchive = path.join(canonicalDir, 'voyager-s4-locked.json');
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

    // Create lock file to protect canonical status
    const lockFile = path.join(canonicalDir, 'voyager-s4.lock');
    await fs.writeFile(lockFile, JSON.stringify({
      locked: true,
      lockTimestamp: new Date().toISOString(),
      source: "canonical-ingestion",
      memoryCount: canonicalMemories.length,
      protection: "IMMUTABLE_CANONICAL"
    }, null, 2));

    console.log('✅ SEASON 4 FIX COMPLETE');
    console.log(`📈 Statistics:`);
    console.log(`   - Canonical memories processed: ${canonicalMemories.length} (FIXED FROM 1)`);
    console.log(`   - Archive location: ${canonicalArchive}`);
    console.log(`   - Complete file: ${properCanonicalFile}`);
    console.log(`   - Original file updated: ${oldFile}`);
    console.log(`   - Lock file created: ${lockFile}`);
    console.log('🔒 Canonical memory protection ACTIVE');

  } catch (error) {
    console.error('❌ SEASON 4 FIX FAILED:', error);
    throw error;
  }
}

// Run immediately
manualIngestS4().then(() => {
  console.log('🎯 VOY Season 4 canonical memories successfully FIXED and locked');
}).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});