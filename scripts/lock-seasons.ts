#!/usr/bin/env npx tsx

/**
 * Lock VOY Seasons 4 & 5 using CanonicalGuard
 */

import { CanonicalGuard } from '../memory-v3/canonical/CanonicalGuard';

async function lockSeasons() {
  const guard = new CanonicalGuard();
  
  console.log('🔒 Locking Canonical Seasons');
  console.log('===========================');
  
  try {
    // Verify Season 4
    console.log('\n📋 Verifying VOY Season 4...');
    const s4Report = await guard.verifySeason('VOY', 4);
    console.log(`Season 4 Status: ${s4Report.isValid ? '✅ VALID' : '❌ INVALID'}`);
    console.log(`File Exists: ${s4Report.fileExists}`);
    console.log(`Record Count: ${s4Report.recordCount}`);
    console.log(`Currently Locked: ${s4Report.isLocked}`);
    
    if (!s4Report.isLocked && s4Report.isValid) {
      console.log('🔐 Locking Season 4...');
      await guard.lockSeason('VOY', 4);
      console.log('✅ Season 4 locked successfully');
    }
    
    // Verify Season 5
    console.log('\n📋 Verifying VOY Season 5...');
    const s5Report = await guard.verifySeason('VOY', 5);
    console.log(`Season 5 Status: ${s5Report.isValid ? '✅ VALID' : '❌ INVALID'}`);
    console.log(`File Exists: ${s5Report.fileExists}`);
    console.log(`Record Count: ${s5Report.recordCount}`);
    console.log(`Currently Locked: ${s5Report.isLocked}`);
    
    if (!s5Report.isLocked && s5Report.isValid) {
      console.log('🔐 Locking Season 5...');
      await guard.lockSeason('VOY', 5);
      console.log('✅ Season 5 locked successfully');
    }
    
    // Final verification
    console.log('\n🔍 Final Verification...');
    const finalS4 = await guard.verifySeason('VOY', 4);
    const finalS5 = await guard.verifySeason('VOY', 5);
    
    console.log(`VOY S4: ${finalS4.isLocked ? '🔒 LOCKED' : '🔓 UNLOCKED'} | Hash: ${finalS4.currentHash || 'N/A'}`);
    console.log(`VOY S5: ${finalS5.isLocked ? '🔒 LOCKED' : '🔓 UNLOCKED'} | Hash: ${finalS5.currentHash || 'N/A'}`);
    
  } catch (error) {
    console.error('❌ Error during season locking:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  lockSeasons();
}