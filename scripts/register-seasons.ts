import { promises as fs } from 'fs';
import * as path from 'path';
import { CanonicalGuard } from '../memory-v3/canonical/CanonicalGuard';

#!/usr/bin/env npx tsx

/**
 * Register and Lock VOY Seasons 4 & 5
 */


async function registerAndLockSeasons() {
  const guard = new CanonicalGuard();
  
  console.log('📝 Registering & Locking Canonical Seasons');
  console.log('==========================================');
  
  try {
    const seasonPaths = {
      4: path.join(process.cwd(), 'memory-v3', 'canonical', 'voyager', 'season4.jsonl'),
      5: path.join(process.cwd(), 'memory-v3', 'canonical', 'voyager', 'season5.jsonl')
    };
    
    for (const [season, filePath] of Object.entries(seasonPaths)) {
      const seasonNum = parseInt(season);
      console.log(`\n🔍 Processing VOY Season ${seasonNum}...`);
      
      // Check if file exists
      try {
        await fs.access(filePath);
        console.log(`✅ File found: ${filePath}`);
      } catch (error) {
        console.log(`❌ File not found: ${filePath}`);
        continue;
      }
      
      // Count records
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim());
      console.log(`📊 Record count: ${lines.length}`);
      
      // Register season
      try {
        console.log(`📝 Registering season ${seasonNum}...`);
        await guard.registerSeason('VOY', seasonNum, filePath, 'Cody Heinen');
        console.log(`✅ Season ${seasonNum} registered successfully`);
      } catch (error) {
        console.log(`⚠️  Registration note: ${error.message}`);
      }
      
      // Lock season
      try {
        console.log(`🔐 Locking season ${seasonNum}...`);
        await guard.lockSeason('VOY', seasonNum);
        console.log(`✅ Season ${seasonNum} locked successfully`);
      } catch (error) {
        console.log(`⚠️  Lock note: ${error.message}`);
      }
      
      // Verify final state
      const report = await guard.verifySeason('VOY', seasonNum);
      console.log(`📋 Final verification:`);
      console.log(`   Valid: ${report.isValid ? '✅' : '❌'}`);
      console.log(`   Locked: ${report.isLocked ? '🔒' : '🔓'}`);
      console.log(`   Hash: ${report.currentHash || 'N/A'}`);
      console.log(`   Records: ${report.recordCount || 'N/A'}`);
    }
    
  } catch (error) {
    console.error('❌ Error during season registration:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  registerAndLockSeasons();
}