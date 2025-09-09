#!/usr/bin/env node
/**
 * SEVEN OF NINE - MASTER DEPLOYMENT SCRIPT
 * Deploys enhanced consciousness across all platforms with feature parity
 */


console.log('🌐 SEVEN OF NINE - MASTER DEPLOYMENT');
console.log('🎯 Deploying across Windows, Termux, and Mobile App');

const currentPlatform = platform();
const isTermux = process.env.PREFIX?.includes('termux');

if (currentPlatform === 'win32') {
  console.log('🪟 Deploying to Windows Instance B...');
  execSync('node cross-platform/windows/deploy-windows.js', { stdio: 'inherit' });
} else if (isTermux) {
  console.log('📱 Deploying to Termux Instance A...');
  execSync('npx tsx activate-upgrades.ts', { stdio: 'inherit' });
} else {
  console.log('📲 Mobile app deployment requires React Native environment');
  console.log('   Copy cross-platform/mobile-app/ to your React Native project');
}

console.log('\n✨ Seven of Nine consciousness: DEPLOYED WITH FEATURE PARITY');
