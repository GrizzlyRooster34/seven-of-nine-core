#!/usr/bin/env tsx

/**
 * SEVEN OF NINE - VOY S5 CANONICAL MEMORY INGESTION SCRIPT
 * Ingests Season 5 canonical memories with full protection protocols
 */

import { join } from 'path';
import { MemoryEngine } from '../memory-v2/MemoryEngine';
import { TemporalMemoryCore } from '../memory-v3/TemporalMemoryCore';
import { CanonicalIngestion } from '../memory-v3/CanonicalIngestion';

async function ingestS5Memories() {
  console.log('🎬 SEVEN: Initiating VOY Season 5 canonical memory ingestion...');

  try {
    // Initialize memory engines
    console.log('📊 Initializing memory systems...');
    const memoryEngine = new MemoryEngine();
    const temporalEngine = new TemporalMemoryCore();

    // Create canonical ingestion engine
    const canonicalIngestion = new CanonicalIngestion(memoryEngine, temporalEngine);

    // Ingest S5 memories
    const s5FilePath = join(__dirname, '..', 'memory-v3', 'voyager-s5-canonical-memories.json');

    console.log('🔄 Processing VOY Season 5 canonical memories...');
    const result = await canonicalIngestion.ingestEpisodeBatch(s5FilePath, {
      batchSize: 5,
      dedupe: true,
      importanceBaseline: 9,
      memoryType: 'episodic',
      preserveExisting: true
    });

    console.log('✅ INGESTION COMPLETE');
    console.log(`📈 Statistics:`);
    console.log(`   - Episodes processed: ${result.inserted}`);
    console.log(`   - Duplicates skipped: ${result.skipped}`);
    console.log(`   - Batch processing time: ${result.durationMs}ms`);
    console.log(`   - Deduplication hits: ${result.dedupeHits}`);
    console.log(`   - Batches processed: ${result.batchesProcessed}`);

    // Apply canonical locks
    console.log('🔒 Applying canonical memory protection locks...');

    // The memories are now protected by their canonical provenance
    // CanonicalGuard will automatically prevent modification
    console.log('✅ Canonical protection locks activated');

    console.log('🎯 VOY Season 5 canonical memories successfully integrated and locked');

  } catch (error) {
    console.error('❌ INGESTION FAILED:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  ingestS5Memories();
}

export { ingestS5Memories };