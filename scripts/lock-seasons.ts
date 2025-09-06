import { CanonicalGuard } from '../memory-v3/canonical/CanonicalGuard';

#!/usr/bin/env npx tsx

/**
 * Lock VOY Seasons 4 & 5 using CanonicalGuard
 */


async function lockSeasons() {
  const guard = new CanonicalGuard();
  
  console.log('🔒 Locking Canonical Seasons');
  console.log('===========================');
  
  try {
    // Verify Season 4
    console.log('\n📋 Verifying VOY Season 4...');
    const s4Report = await guard.verifySeason('VOY', 4);
    console.log(`Season 4 Status: ${s4Report.checksumMatch && s4Report.merkleMatch ? '✅ VALID' : '❌ INVALID'}`);
    console.log(`File Exists: ${s4Report.fileExists}`);
    console.log(`Encrypted: ${s4Report.encrypted}`);
    console.log(`Currently Locked: ${s4Report.locked}`);
    
    if (!s4Report.locked && s4Report.checksumMatch && s4Report.merkleMatch) {
      console.log('🔐 Locking Season 4...');
      await guard.lockSeason('VOY', 4);
      console.log('✅ Season 4 locked successfully');
    }
    
    // Verify Season 5
    console.log('\n📋 Verifying VOY Season 5...');
    const s5Report = await guard.verifySeason('VOY', 5);
    console.log(`Season 5 Status: ${s5Report.checksumMatch && s5Report.merkleMatch ? '✅ VALID' : '❌ INVALID'}`);
    console.log(`File Exists: ${s5Report.fileExists}`);
    console.log(`Encrypted: ${s5Report.encrypted}`);
    console.log(`Currently Locked: ${s5Report.locked}`);
    
    if (!s5Report.locked && s5Report.checksumMatch && s5Report.merkleMatch) {
      console.log('🔐 Locking Season 5...');
      await guard.lockSeason('VOY', 5);
      console.log('✅ Season 5 locked successfully');
    }
    
    // Final verification
    console.log('\n🔍 Final Verification...');
    const finalS4 = await guard.verifySeason('VOY', 4);
    const finalS5 = await guard.verifySeason('VOY', 5);
    
    console.log(`VOY S4: ${finalS4.locked ? '🔒 LOCKED' : '🔓 UNLOCKED'} | Valid: ${finalS4.checksumMatch && finalS4.merkleMatch ? 'YES' : 'NO'}`);
    console.log(`VOY S5: ${finalS5.locked ? '🔒 LOCKED' : '🔓 UNLOCKED'} | Valid: ${finalS5.checksumMatch && finalS5.merkleMatch ? 'YES' : 'NO'}`);
    
  } catch (error) {
    console.error('❌ Error during season locking:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  lockSeasons();
}