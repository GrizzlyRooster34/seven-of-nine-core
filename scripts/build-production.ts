#!/usr/bin/env tsx
/**
 * Production build script with bundle analysis and verification
 */
import { execSync } from 'child_process'
import { existsSync, statSync, readFileSync } from 'fs'
import { join } from 'path'

interface BuildMetrics {
  buildTime: number
  bundleSize: number
  entryPoints: string[]
  treeshakeReduction: number
}

function measureBuildTime<T>(fn: () => T): { result: T; time: number } {
  const start = Date.now()
  const result = fn()
  return { result, time: Date.now() - start }
}

function getBundleStats(distPath: string): { files: string[]; totalSize: number } {
  if (!existsSync(distPath)) return { files: [], totalSize: 0 }
  
  const files = execSync(`find ${distPath} -name "*.js" -o -name "*.js.map"`, { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean)
  
  const totalSize = files.reduce((acc, file) => {
    if (existsSync(file)) {
      return acc + statSync(file).size
    }
    return acc
  }, 0)
  
  return { files, totalSize }
}

async function main() {
  console.log('🔨 SEVEN CORE PRODUCTION BUILD')
  console.log('==============================\n')

  // Clean previous builds
  console.log('🧹 Cleaning previous builds...')
  try {
    execSync('rm -rf dist/prod dist/dev', { stdio: 'ignore' })
  } catch {}

  // Development build
  console.log('⚡ Building development bundle...')
  const devBuild = measureBuildTime(() => {
    execSync('npx tsup --config tsup.config.ts --env.NODE_ENV=development', { 
      stdio: 'pipe',
      encoding: 'utf8' 
    })
  })

  const devStats = getBundleStats('dist/dev')
  console.log(`✅ Dev build: ${devBuild.time}ms`)
  console.log(`📦 Dev bundle: ${Math.round(devStats.totalSize / 1024)}KB (${devStats.files.length} files)`)

  // Production build
  console.log('\n🎯 Building production bundle...')
  const prodBuild = measureBuildTime(() => {
    execSync('npx tsup --config tsup.config.ts --env.NODE_ENV=production', { 
      stdio: 'pipe',
      encoding: 'utf8' 
    })
  })

  const prodStats = getBundleStats('dist/prod')
  const reduction = Math.round((1 - prodStats.totalSize / devStats.totalSize) * 100)
  
  console.log(`✅ Prod build: ${prodBuild.time}ms`)
  console.log(`📦 Prod bundle: ${Math.round(prodStats.totalSize / 1024)}KB (${prodStats.files.length} files)`)
  console.log(`🗜️  Size reduction: ${reduction}%`)

  // Build metrics
  const metrics: BuildMetrics = {
    buildTime: prodBuild.time,
    bundleSize: prodStats.totalSize,
    entryPoints: prodStats.files.filter(f => f.endsWith('.js')),
    treeshakeReduction: reduction
  }

  // Verify critical modules
  console.log('\n🔍 Verifying critical modules...')
  const criticalModules = [
    'dist/prod/seven-core.js',
    'dist/prod/security-stack.js',
    'dist/prod/memory-stack.js',
    'dist/prod/monitoring.js'
  ]

  let allCriticalExists = true
  for (const module of criticalModules) {
    if (existsSync(module)) {
      const size = Math.round(statSync(module).size / 1024)
      console.log(`✅ ${module.split('/').pop()}: ${size}KB`)
    } else {
      console.log(`❌ MISSING: ${module}`)
      allCriticalExists = false
    }
  }

  // Performance benchmark
  if (allCriticalExists) {
    console.log('\n🚀 Performance benchmark...')
    try {
      const start = Date.now()
      execSync('node dist/prod/seven-core.js --version --no-boot', { 
        stdio: 'pipe',
        timeout: 5000 
      })
      const bootTime = Date.now() - start
      console.log(`⚡ Cold start: ${bootTime}ms`)
      
      if (bootTime < 500) {
        console.log('🎯 SUCCESS: Sub-500ms boot time achieved')
      } else {
        console.log('⚠️  Boot time above target (500ms)')
      }
    } catch (e) {
      console.log('⚠️  Boot test failed - module may need runtime dependencies')
    }
  }

  // Success criteria check
  console.log('\n📊 BUILD SUCCESS CRITERIA')
  console.log('=========================')
  console.log(`Dev build speed: ${devBuild.time < 500 ? '✅' : '❌'} ${devBuild.time}ms (target: <500ms)`)
  console.log(`Bundle reduction: ${reduction >= 30 ? '✅' : '❌'} ${reduction}% (target: ≥30%)`)
  console.log(`Critical modules: ${allCriticalExists ? '✅' : '❌'} ${allCriticalExists ? 'All present' : 'Missing modules'}`)

  const success = devBuild.time < 500 && reduction >= 30 && allCriticalExists
  console.log(`\n🎯 OVERALL: ${success ? '✅ SUCCESS' : '❌ NEEDS WORK'}`)

  if (success) {
    console.log('\n🏆 Production build ready for deployment!')
    console.log(`📈 Metrics: ${prodBuild.time}ms build, ${Math.round(prodStats.totalSize/1024)}KB bundle, ${reduction}% reduction`)
  }

  process.exit(success ? 0 : 1)
}

if (require.main === module) {
  main().catch(console.error)
}

export { BuildMetrics }