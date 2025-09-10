#!/usr/bin/env tsx

import SafetyDashboardServer from './seven-runtime/safety-dashboard-server'

/**
 * Seven Safety Dashboard Launcher
 * Quick start script for safety monitoring dashboard
 */

async function startDashboard() {
  const port = parseInt(process.env.DASHBOARD_PORT || '7777')
  const server = new SafetyDashboardServer(port)

  console.log('🛡️ SEVEN OF NINE - SAFETY DASHBOARD')
  console.log('=====================================')
  console.log('Initializing comprehensive safety monitoring...')

  try {
    await server.start()
    
    console.log('\n🎯 Dashboard URLs:')
    console.log(`   📊 Main Dashboard: http://localhost:${port}/`)
    console.log(`   🔍 API Status:     http://localhost:${port}/safety/status`)
    console.log(`   🧪 Test Pipeline:  http://localhost:${port}/safety/test`)
    console.log(`   📈 Metrics:        http://localhost:${port}/safety/metrics`)
    console.log(`   🚨 Alerts:         http://localhost:${port}/safety/alerts`)
    console.log(`   💚 Health Check:   http://localhost:${port}/health`)

    console.log('\n⚡ Features Active:')
    console.log('   ✅ Quadran-Lock Authentication (Q1-Q4 gates)')
    console.log('   ✅ Quadra-Lock CSSR (Case-Study Safety Rails)')
    console.log('   ✅ Safety Guardrails & Override Conditions')
    console.log('   ✅ Restraint Doctrine Monitoring')
    console.log('   ✅ Real-time Metrics & Alert Management')
    console.log('   ✅ Security Pipeline Testing')

    console.log('\n🔄 Auto-refresh dashboard every 30 seconds')
    console.log('📱 Mobile-friendly responsive interface')
    console.log('\nPress Ctrl+C to stop the dashboard')

  } catch (error) {
    console.error('\n❌ Failed to start safety dashboard:', error.message)
    process.exit(1)
  }

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n\n🛑 Shutting down Seven safety dashboard...')
    await server.stop()
    console.log('✅ Safety dashboard stopped successfully')
    process.exit(0)
  })

  process.on('SIGTERM', async () => {
    console.log('\n🛑 Terminating dashboard...')
    await server.stop()
    process.exit(0)
  })
}

startDashboard().catch(console.error)