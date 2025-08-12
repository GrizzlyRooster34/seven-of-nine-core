#!/usr/bin/env npx tsx

/**
 * Canonical JSONL Coverage Validation Script
 * Validates episode coverage and schema compliance for VOY Season 4 & 5
 */

import * as fs from 'fs';
import * as path from 'path';

interface ValidationResult {
  total_records: number;
  distinct_episode_codes: string[];
  missing_codes: string[];
  duplicate_codes: string[];
  extra_codes: string[];
  schema_violations: number;
  violations_detail: string[];
}

interface CanonicalRecord {
  id: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  importance: number;
  payload: {
    series: string;
    episodeCode: string;
    episodeTitle: string;
    seasonOrderContext: string;
    canonicalEraTag: string;
    [key: string]: any;
  };
  provenance: {
    origin: string;
    meta: {
      series: string;
      season: number;
      episode: number | string;
      title: string;
    };
    curator: string;
    ingested_at: string;
    attestation_reference: string;
    source: string;
  };
}

function generateExpectedCodes(season: number): string[] {
  const codes: string[] = [];
  for (let ep = 1; ep <= 26; ep++) {
    codes.push(`S0${season}E${ep.toString().padStart(2, '0')}`);
  }
  return codes;
}

function validateSeasonFile(filePath: string, expectedCodes: string[]): ValidationResult {
  const result: ValidationResult = {
    total_records: 0,
    distinct_episode_codes: [],
    missing_codes: [],
    duplicate_codes: [],
    extra_codes: [],
    schema_violations: 0,
    violations_detail: []
  };

  if (!fs.existsSync(filePath)) {
    result.violations_detail.push(`File not found: ${filePath}`);
    result.schema_violations++;
    return result;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  
  result.total_records = lines.length;
  const episodeCodes: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const line = lines[i];

    try {
      const record: CanonicalRecord = JSON.parse(line);
      
      // Schema validation
      const requiredFields = ['id', 'tags', 'createdAt', 'updatedAt', 'importance', 'payload', 'provenance'];
      for (const field of requiredFields) {
        if (!(field in record)) {
          result.violations_detail.push(`Line ${lineNum}: Missing required field '${field}'`);
          result.schema_violations++;
        }
      }

      // Validate tags
      if (record.tags) {
        const requiredTags = ['canon', 'series:VOY'];
        for (const tag of requiredTags) {
          if (!record.tags.includes(tag)) {
            result.violations_detail.push(`Line ${lineNum}: Missing required tag '${tag}'`);
            result.schema_violations++;
          }
        }
      }

      // Validate payload
      if (record.payload) {
        if (record.payload.episodeCode) {
          episodeCodes.push(record.payload.episodeCode);
        } else {
          result.violations_detail.push(`Line ${lineNum}: Missing episodeCode in payload`);
          result.schema_violations++;
        }
      }

      // Validate provenance
      if (record.provenance) {
        if (record.provenance.origin !== 'canonical') {
          result.violations_detail.push(`Line ${lineNum}: provenance.origin must be 'canonical'`);
          result.schema_violations++;
        }
        if (record.provenance.meta && record.provenance.meta.series !== 'VOY') {
          result.violations_detail.push(`Line ${lineNum}: provenance.meta.series must be 'VOY'`);
          result.schema_violations++;
        }
      }

    } catch (error) {
      result.violations_detail.push(`Line ${lineNum}: Invalid JSON - ${error.message}`);
      result.schema_violations++;
    }
  }

  // Episode coverage analysis
  result.distinct_episode_codes = [...new Set(episodeCodes)].sort();
  
  // Find duplicates
  const codeMap = new Map<string, number>();
  episodeCodes.forEach(code => {
    codeMap.set(code, (codeMap.get(code) || 0) + 1);
  });
  
  result.duplicate_codes = Array.from(codeMap.entries())
    .filter(([code, count]) => count > 1)
    .map(([code]) => code);

  // Find missing codes
  result.missing_codes = expectedCodes.filter(code => !result.distinct_episode_codes.includes(code));

  // Find extra codes
  result.extra_codes = result.distinct_episode_codes.filter(code => !expectedCodes.includes(code));

  return result;
}

function printCoverageTable(season: number, result: ValidationResult) {
  console.log(`\n=== VOY Season ${season} Coverage Analysis ===`);
  console.log(`Total Records: ${result.total_records}`);
  console.log(`Distinct Episode Codes: ${result.distinct_episode_codes.length}`);
  console.log(`Schema Violations: ${result.schema_violations}`);
  
  if (result.missing_codes.length > 0) {
    console.log(`❌ Missing Codes: [${result.missing_codes.join(', ')}]`);
  } else {
    console.log(`✅ Missing Codes: []`);
  }
  
  if (result.duplicate_codes.length > 0) {
    console.log(`❌ Duplicate Codes: [${result.duplicate_codes.join(', ')}]`);
  } else {
    console.log(`✅ Duplicate Codes: []`);
  }
  
  if (result.extra_codes.length > 0) {
    console.log(`❌ Extra Codes: [${result.extra_codes.join(', ')}]`);
  } else {
    console.log(`✅ Extra Codes: []`);
  }

  if (result.violations_detail.length > 0) {
    console.log(`\n❌ Schema Violations:`);
    result.violations_detail.forEach(violation => console.log(`  - ${violation}`));
  }
}

function main() {
  const baseDir = path.join(process.cwd(), 'memory-v3', 'canonical', 'voyager');
  
  console.log('🔍 Canonical JSONL Coverage Validation');
  console.log('=====================================');

  // Validate Season 4
  const season4File = path.join(baseDir, 'season4.jsonl');
  const season4Expected = generateExpectedCodes(4);
  const season4Result = validateSeasonFile(season4File, season4Expected);
  printCoverageTable(4, season4Result);

  // Validate Season 5
  const season5File = path.join(baseDir, 'season5.jsonl');
  const season5Expected = generateExpectedCodes(5);
  const season5Result = validateSeasonFile(season5File, season5Expected);
  printCoverageTable(5, season5Result);

  // Final validation
  console.log(`\n=== FINAL VALIDATION STATUS ===`);
  const totalViolations = season4Result.schema_violations + season5Result.schema_violations;
  const totalMissing = season4Result.missing_codes.length + season5Result.missing_codes.length;
  const totalDuplicates = season4Result.duplicate_codes.length + season5Result.duplicate_codes.length;
  const totalExtra = season4Result.extra_codes.length + season5Result.extra_codes.length;

  if (totalViolations === 0 && totalMissing === 0 && totalDuplicates === 0 && totalExtra === 0) {
    console.log(`✅ VALIDATION PASSED: All checks successful`);
    process.exit(0);
  } else {
    console.log(`❌ VALIDATION FAILED:`);
    if (totalViolations > 0) console.log(`  - Schema violations: ${totalViolations}`);
    if (totalMissing > 0) console.log(`  - Missing episodes: ${totalMissing}`);
    if (totalDuplicates > 0) console.log(`  - Duplicate episodes: ${totalDuplicates}`);
    if (totalExtra > 0) console.log(`  - Extra episodes: ${totalExtra}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}