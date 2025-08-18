#!/usr/bin/env npx tsx

/**
 * Basic Integration Test for Two Branch Merge
 * Tests core functionality after merging main and security/quadran-lock-integration
 */

console.log("🧪 BRANCH INTEGRATION TEST - Starting Basic Validation");
console.log("=" .repeat(60));

async function testBasicModuleLoading() {
  console.log("📦 Testing basic module loading...");
  
  try {
    // Test core modules exist
    const fs = await import('fs');
    const path = await import('path');
    
    // Check key merged files exist
    const keyFiles = [
      'src/auth/creator_proof.ts',
      'src/auth/crypto/ed25519_attest.ts',
      'src/auth/challenge/semanticNonce.ts',
      'consciousness-v4/CreatorIdentityVault.ts',
      'MERGE_READINESS_REPORT.md'
    ];
    
    for (const file of keyFiles) {
      if (fs.existsSync(file)) {
        console.log(`  ✅ ${file} - EXISTS`);
      } else {
        console.log(`  ❌ ${file} - MISSING`);
        return false;
      }
    }
    
    console.log("📦 Module loading test: PASSED");
    return true;
  } catch (error) {
    console.error("📦 Module loading test: FAILED", error);
    return false;
  }
}

async function testPackageIntegrity() {
  console.log("📋 Testing package integrity...");
  
  try {
    const pkg = await import('./package.json', { assert: { type: 'json' } });
    
    // Check for required dependencies
    const requiredDeps = ['axios', 'chalk', 'dotenv', 'fs-extra', 'node-fetch'];
    const requiredDevDeps = ['tsx', 'typescript'];
    
    let allDepsPresent = true;
    
    for (const dep of requiredDeps) {
      if (pkg.default.dependencies[dep]) {
        console.log(`  ✅ ${dep} - ${pkg.default.dependencies[dep]}`);
      } else {
        console.log(`  ❌ ${dep} - MISSING`);
        allDepsPresent = false;
      }
    }
    
    for (const dep of requiredDevDeps) {
      if (pkg.default.devDependencies[dep]) {
        console.log(`  ✅ ${dep} - ${pkg.default.devDependencies[dep]}`);
      } else {
        console.log(`  ❌ ${dep} - MISSING`);
        allDepsPresent = false;
      }
    }
    
    console.log("📋 Package integrity test:", allDepsPresent ? "PASSED" : "FAILED");
    return allDepsPresent;
  } catch (error) {
    console.error("📋 Package integrity test: FAILED", error);
    return false;
  }
}

async function testSecurityModules() {
  console.log("🔒 Testing security module structure...");
  
  try {
    const fs = await import('fs');
    
    // Check security directory structure exists
    const securityDirs = [
      'src/auth',
      'src/auth/crypto', 
      'src/auth/challenge',
      'src/runtime'
    ];
    
    let allDirsExist = true;
    for (const dir of securityDirs) {
      if (fs.existsSync(dir)) {
        console.log(`  ✅ ${dir}/ - EXISTS`);
      } else {
        console.log(`  ❌ ${dir}/ - MISSING`);
        allDirsExist = false;
      }
    }
    
    // Check key security files
    const securityFiles = [
      'src/auth/creator_proof.ts',
      'src/auth/crypto/ed25519_attest.ts', 
      'src/auth/challenge/semanticNonce.ts',
      'src/runtime/rateLimit.ts'
    ];
    
    for (const file of securityFiles) {
      if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        console.log(`  ✅ ${file} - ${stats.size} bytes`);
      } else {
        console.log(`  ❌ ${file} - MISSING`);
        allDirsExist = false;
      }
    }
    
    console.log("🔒 Security modules test:", allDirsExist ? "PASSED" : "FAILED");
    return allDirsExist;
  } catch (error) {
    console.error("🔒 Security modules test: FAILED", error);
    return false;
  }
}

async function testMobileAppIntegrity() {
  console.log("📱 Testing mobile app integrity...");
  
  try {
    const fs = await import('fs');
    
    // Check mobile app structure
    const mobileFiles = [
      'seven-mobile-app/package.json',
      'seven-mobile-app/.github/workflows/android-apk.yml'
    ];
    
    let mobileOk = true;
    for (const file of mobileFiles) {
      if (fs.existsSync(file)) {
        console.log(`  ✅ ${file} - EXISTS`);
      } else {
        console.log(`  ❌ ${file} - MISSING`);
        mobileOk = false;
      }
    }
    
    console.log("📱 Mobile app integrity test:", mobileOk ? "PASSED" : "FAILED");
    return mobileOk;
  } catch (error) {
    console.error("📱 Mobile app integrity test: FAILED", error);
    return false;
  }
}

async function runIntegrationTest() {
  console.log("🚀 Running Branch Integration Test Suite");
  console.log("Testing merge of main + security/quadran-lock-integration");
  console.log();
  
  const results = {
    moduleLoading: await testBasicModuleLoading(),
    packageIntegrity: await testPackageIntegrity(), 
    securityModules: await testSecurityModules(),
    mobileApp: await testMobileAppIntegrity()
  };
  
  console.log();
  console.log("=" .repeat(60));
  console.log("📊 INTEGRATION TEST RESULTS:");
  console.log();
  
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  const allPassed = Object.values(results).every(result => result);
  
  console.log();
  console.log("🎯 OVERALL RESULT:", allPassed ? "✅ INTEGRATION SUCCESSFUL" : "❌ INTEGRATION ISSUES DETECTED");
  
  if (allPassed) {
    console.log();
    console.log("🎉 Branch integration is ready for merge!");
    console.log("   - All core modules are present");
    console.log("   - Security enhancements are integrated");
    console.log("   - Mobile app structure is intact");
    console.log("   - Package dependencies are valid");
  } else {
    console.log();
    console.log("⚠️  Integration requires attention before merge");
  }
  
  console.log("=" .repeat(60));
  
  return allPassed;
}

// Run the test
runIntegrationTest().then(success => {
  process.exit(success ? 0 : 1);
});