import { CanonicalGuard } from '../../memory-v3/canonical/CanonicalGuard';

#!/usr/bin/env tsx

/**
 * SEVEN OF NINE - CANONICAL SEASON LOCK SCRIPT
 * 
 * Locks a canonical season to make it immutable
 * Once locked, no direct modifications allowed - only delta corrections
 * 
 * Usage: npx tsx scripts/canon/lock-season.ts <SERIES> <SEASON>
 * Example: npx tsx scripts/canon/lock-season.ts VOY 4
 */


async function main() {
  const args = process.argv.slice(2);
  
  if (args.length !== 2) {
    console.error('❌ Usage: npx tsx scripts/canon/lock-season.ts <SERIES> <SEASON>');
    console.error('   Example: npx tsx scripts/canon/lock-season.ts VOY 4');
    process.exit(1);
  }

  const [seriesArg, seasonArg] = args;
  const series = seriesArg.toUpperCase() as 'VOY' | 'PIC';
  const season = parseInt(seasonArg);

  if (!['VOY', 'PIC'].includes(series)) {
    console.error('❌ Series must be VOY or PIC');
    process.exit(1);
  }

  if (isNaN(season) || season < 1 || season > 10) {
    console.error('❌ Season must be a number between 1 and 10');
    process.exit(1);
  }

  console.log(`🔐 CANONICAL SEASON LOCK PROCEDURE`);
  console.log(`   Series: ${series}`);
  console.log(`   Season: ${season}`);
  console.log(`   Doctrine: Canonical memories are sacrosanct`);
  console.log();

  try {
    const guard = new CanonicalGuard();

    // Verify season exists and is registered
    console.log('🔍 Verifying season integrity before lock...');
    const verificationReport = await guard.verifySeason(series, season);

    if (verificationReport.errors.length > 0) {
      console.error('❌ Season verification failed:');
      verificationReport.errors.forEach(error => console.error(`   - ${error}`));
      process.exit(1);
    }

    if (verificationReport.warnings.length > 0) {
      console.warn('⚠️  Season verification warnings:');
      verificationReport.warnings.forEach(warning => console.warn(`   - ${warning}`));
    }

    if (verificationReport.locked) {
      console.log('🔒 Season is already locked');
      process.exit(0);
    }

    console.log('✅ Pre-lock verification passed');
    console.log();

    // Perform the lock
    console.log('🔐 Locking canonical season...');
    await guard.lockSeason(series, season);

    // Verify lock was successful
    const postLockReport = await guard.verifySeason(series, season);
    if (!postLockReport.locked) {
      console.error('❌ Lock operation failed - season not marked as locked');
      process.exit(1);
    }

    console.log();
    console.log('✅ CANONICAL SEASON LOCKED SUCCESSFULLY');
    console.log(`   Season: ${series} S${season}`);
    console.log(`   Status: IMMUTABLE`);
    console.log(`   Future changes: Delta corrections only`);
    console.log(`   Creator bond: Cody's attestation verified`);
    console.log();
    console.log('🛡️  This season is now protected by canonical doctrine');

  } catch (error) {
    console.error(`❌ Lock operation failed: ${error}`);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
}