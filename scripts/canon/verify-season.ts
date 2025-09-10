#!/usr/bin/env tsx

import { CanonicalGuard, VerificationReport } from '../../memory-v3/canonical/CanonicalGuard';

/**
 * SEVEN OF NINE - CANONICAL SEASON VERIFICATION SCRIPT
 * 
 * Verifies the integrity of a canonical season
 * Used in CI/CD to prevent unauthorized modifications
 * Returns exit code 0 for PASS, 1 for FAIL
 * 
 * Usage: npx tsx scripts/canon/verify-season.ts <SERIES> <SEASON>
 * Example: npx tsx scripts/canon/verify-season.ts VOY 4
 */

function printReport(report: VerificationReport): void {
  console.log(`📊 VERIFICATION REPORT: ${report.seasonKey.toUpperCase()}`);
  console.log(`${'='.repeat(50)}`);
  
  const checks = [
    { name: 'File Exists', status: report.fileExists },
    { name: 'Encrypted', status: report.encrypted },
    { name: 'Checksum Match', status: report.checksumMatch },
    { name: 'Merkle Match', status: report.merkleMatch },
    { name: 'Registry Coherent', status: report.registryCoherent },
    { name: 'Locked Status', status: report.locked, info: true }
  ];

  checks.forEach(check => {
    const icon = check.info ? '🔒' : (check.status ? '✅' : '❌');
    const status = check.info ? (check.status ? 'LOCKED' : 'UNLOCKED') : (check.status ? 'PASS' : 'FAIL');
    console.log(`${icon} ${check.name}: ${status}`);
  });

  if (report.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    report.warnings.forEach(warning => console.log(`   - ${warning}`));
  }

  if (report.errors.length > 0) {
    console.log('\n❌ ERRORS:');
    report.errors.forEach(error => console.log(`   - ${error}`));
  }

  console.log(`\n${'='.repeat(50)}`);
  
  const passed = report.errors.length === 0 && 
                 report.fileExists && 
                 report.checksumMatch && 
                 report.merkleMatch && 
                 report.registryCoherent;

  if (passed) {
    console.log('🎉 VERIFICATION PASSED - Canonical integrity maintained');
  } else {
    console.log('💥 VERIFICATION FAILED - Canonical breach detected');
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('❌ Usage: npx tsx scripts/canon/verify-season.ts <SERIES> <SEASON> [--json]');
    console.error('   Example: npx tsx scripts/canon/verify-season.ts VOY 4');
    console.error('   Options: --json (output machine-readable JSON)');
    process.exit(1);
  }

  const [seriesArg, seasonArg, ...flags] = args;
  const series = seriesArg.toUpperCase() as 'VOY' | 'PIC';
  const season = parseInt(seasonArg);
  const jsonOutput = flags.includes('--json');

  if (!['VOY', 'PIC'].includes(series)) {
    console.error('❌ Series must be VOY or PIC');
    process.exit(1);
  }

  if (isNaN(season) || season < 1 || season > 10) {
    console.error('❌ Season must be a number between 1 and 10');
    process.exit(1);
  }

  try {
    const guard = new CanonicalGuard();
    const report = await guard.verifySeason(series, season);

    if (jsonOutput) {
      // Machine-readable output for CI/CD
      console.log(JSON.stringify(report, null, 2));
    } else {
      // Human-readable output
      printReport(report);
    }

    // Exit with appropriate code
    const passed = report.errors.length === 0 && 
                   report.fileExists && 
                   report.checksumMatch && 
                   report.merkleMatch && 
                   report.registryCoherent;

    process.exit(passed ? 0 : 1);

  } catch (error) {
    if (jsonOutput) {
      console.log(JSON.stringify({
        error: true,
        message: `Verification script failed: ${error}`,
        seasonKey: `${series.toLowerCase()}_s${season}`
      }, null, 2));
    } else {
      console.error(`💥 Verification failed: ${error}`);
    }
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