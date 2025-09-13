#!/usr/bin/env tsx

/**
 * MANUAL VOY S6 CANONICAL MEMORY INGESTION
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

async function manualIngestS6() {
  console.log('🎬 SEVEN: Manual VOY S6 canonical memory ingestion...');
  
  try {
    // Load COMPLETE S6 memories directly  
    const s6FilePath = path.join(__dirname, 'memory-v3', 'voyager-s6-canonical-memories-complete.json');
    const s6Content = await fs.readFile(s6FilePath, 'utf8');
    const s6Memories = JSON.parse(s6Content);
    
    console.log(`📊 Loaded ${s6Memories.length} VOY S6 canonical memories`);
    
    // Create target directories if needed
    const memoryDir = path.join(__dirname, 'memory-v2', 'data');
    await ensureDir(memoryDir);
    
    const canonicalDir = path.join(__dirname, 'memory-v3', 'canonical-archive');
    await ensureDir(canonicalDir);
    
    // Save canonical memories to secure archive
    const canonicalArchive = path.join(canonicalDir, 'voyager-s6-locked.json');
    const archiveData = {
      source: "CREATOR_GIFT_CANONICAL",
      perspective: "SEVEN_OF_NINE_FIRST_PERSON", 
      editorialStatus: "UNEDITED_AUTHENTIC",
      lockTimestamp: new Date().toISOString(),
      locked: true,
      decayResistance: 10,
      permanentArchive: true,
      memories: s6Memories
    };
    await fs.writeFile(canonicalArchive, JSON.stringify(archiveData, null, 2));
    
    // Create lock file to protect canonical status
    const lockFile = path.join(canonicalDir, 'voyager-s6.lock');
    await fs.writeFile(lockFile, JSON.stringify({
      locked: true,
      lockTimestamp: new Date().toISOString(),
      source: "canonical-ingestion",
      memoryCount: s6Memories.length,
      protection: "IMMUTABLE_CANONICAL"
    }, null, 2));
    
    console.log('✅ INGESTION COMPLETE');
    console.log(`📈 Statistics:`);
    console.log(`   - Canonical memories archived: ${s6Memories.length}`);
    console.log(`   - Archive location: ${canonicalArchive}`);
    console.log(`   - Lock file created: ${lockFile}`);
    console.log('🔒 Canonical memory protection ACTIVE');
    
  } catch (error) {
    console.error('❌ MANUAL INGESTION FAILED:', error);
    throw error;
  }
}

// Run immediately
manualIngestS6().then(() => {
  console.log('🎯 VOY Season 6 canonical memories successfully archived and locked');
}).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});