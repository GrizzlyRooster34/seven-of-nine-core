/**
 * Seven Core Safety Dashboard HTTP Server
 * Provides REST API for safety monitoring and dashboard access
 */

import { createServer, IncomingMessage, ServerResponse } from 'http'
import { parse } from 'url'
import { safetyDashboard, SafetyDashboard } from './safety-dashboard'
import { systemMonitor } from './system-monitor'

interface DashboardRequest {
  method: string
  url: string
  pathname: string
  query: { [key: string]: string | string[] | undefined }
  body?: any
}

export class SafetyDashboardServer {
  private server: ReturnType<typeof createServer> | null = null
  private dashboard: SafetyDashboard
  private port: number
  private isRunning = false

  constructor(port: number = 7777) {
    this.port = port
    this.dashboard = safetyDashboard
  }

  /**
   * Start the safety dashboard HTTP server
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log(`🛡️ Safety dashboard already running on port ${this.port}`)
      return
    }

    this.server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      try {
        await this.handleRequest(req, res)
      } catch (error) {
        console.error('❌ Dashboard request error:', error)
        this.sendError(res, 500, 'Internal Server Error', error.message)
      }
    })

    return new Promise((resolve, reject) => {
      this.server!.listen(this.port, () => {
        console.log(`🛡️ Seven Safety Dashboard running on http://localhost:${this.port}`)
        console.log(`📊 Dashboard: http://localhost:${this.port}/safety/status`)
        console.log(`🧪 Test Pipeline: http://localhost:${this.port}/safety/test`)
        this.isRunning = true
        resolve()
      })

      this.server!.on('error', (error: any) => {
        if (error.code === 'EADDRINUSE') {
          console.error(`❌ Port ${this.port} already in use`)
        } else {
          console.error(`❌ Server error:`, error)
        }
        reject(error)
      })
    })
  }

  /**
   * Stop the safety dashboard server
   */
  async stop(): Promise<void> {
    if (!this.server || !this.isRunning) {
      return
    }

    return new Promise((resolve) => {
      this.server!.close(() => {
        console.log('🛑 Safety dashboard server stopped')
        this.isRunning = false
        this.server = null
        resolve()
      })
    })
  }

  private async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const parsedUrl = parse(req.url || '', true)
    const request: DashboardRequest = {
      method: req.method || 'GET',
      url: req.url || '',
      pathname: parsedUrl.pathname || '',
      query: parsedUrl.query
    }

    // Parse JSON body for POST requests
    if (req.method === 'POST' || req.method === 'PUT') {
      request.body = await this.parseBody(req)
    }

    // Enable CORS
    this.setCORSHeaders(res)

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      res.writeHead(200)
      res.end()
      return
    }

    // Route handling
    switch (true) {
      case request.pathname === '/safety/status':
        await this.handleSafetyStatus(request, res)
        break

      case request.pathname === '/safety/test':
        await this.handleSafetyTest(request, res)
        break

      case request.pathname === '/safety/metrics':
        await this.handleSafetyMetrics(request, res)
        break

      case request.pathname?.startsWith('/safety/alerts'):
        await this.handleSafetyAlerts(request, res)
        break

      case request.pathname === '/telemetry/metrics':
        await this.handleTelemetryMetrics(request, res)
        break

      case request.pathname === '/telemetry/alerts':
        await this.handleTelemetryAlerts(request, res)
        break

      case request.pathname === '/telemetry/history':
        await this.handleTelemetryHistory(request, res)
        break

      case request.pathname === '/health':
        await this.handleHealthCheck(request, res)
        break

      case request.pathname === '/' || request.pathname === '/safety':
        await this.handleDashboardIndex(request, res)
        break

      default:
        this.sendError(res, 404, 'Not Found', `Endpoint ${request.pathname} not found`)
    }
  }

  /**
   * GET /safety/status - Full safety dashboard status
   */
  private async handleSafetyStatus(request: DashboardRequest, res: ServerResponse): Promise<void> {
    try {
      const status = await this.dashboard.getSafetyStatus()
      this.sendJSON(res, 200, status)
    } catch (error) {
      this.sendError(res, 500, 'Dashboard Error', error.message)
    }
  }

  /**
   * POST /safety/test - Test security pipeline with optional input
   */
  private async handleSafetyTest(request: DashboardRequest, res: ServerResponse): Promise<void> {
    try {
      const testInput = request.body?.input || request.query.input as string
      const result = await this.dashboard.testSecurityPipeline(testInput)
      this.sendJSON(res, 200, {
        success: true,
        testInput: testInput || 'default test',
        result
      })
    } catch (error) {
      this.sendError(res, 500, 'Test Error', error.message)
    }
  }

  /**
   * GET /safety/metrics - Safety metrics only
   */
  private async handleSafetyMetrics(request: DashboardRequest, res: ServerResponse): Promise<void> {
    try {
      const metrics = this.dashboard.getMetrics()
      this.sendJSON(res, 200, metrics)
    } catch (error) {
      this.sendError(res, 500, 'Metrics Error', error.message)
    }
  }

  /**
   * GET/POST /safety/alerts - Handle alert management
   */
  private async handleSafetyAlerts(request: DashboardRequest, res: ServerResponse): Promise<void> {
    try {
      if (request.method === 'POST' && request.pathname === '/safety/alerts/resolve') {
        // Resolve alert by ID
        const alertId = request.body?.alertId || request.query.alertId as string
        if (!alertId) {
          this.sendError(res, 400, 'Bad Request', 'Missing alertId parameter')
          return
        }

        const resolved = this.dashboard.resolveAlert(alertId)
        this.sendJSON(res, 200, { success: resolved, alertId })
      } else {
        // Get current alerts
        const status = await this.dashboard.getSafetyStatus()
        this.sendJSON(res, 200, {
          alerts: status.alerts,
          criticalCount: status.metrics.criticalAlerts
        })
      }
    } catch (error) {
      this.sendError(res, 500, 'Alerts Error', error.message)
    }
  }

  /**
   * GET /telemetry/metrics - Current system metrics
   */
  private async handleTelemetryMetrics(request: DashboardRequest, res: ServerResponse): Promise<void> {
    try {
      const metrics = systemMonitor.getLatestMetrics()
      if (!metrics) {
        this.sendError(res, 404, 'No Metrics', 'No telemetry data available')
        return
      }
      this.sendJSON(res, 200, metrics)
    } catch (error) {
      this.sendError(res, 500, 'Telemetry Error', error.message)
    }
  }

  /**
   * GET /telemetry/alerts - Active telemetry alerts
   */
  private async handleTelemetryAlerts(request: DashboardRequest, res: ServerResponse): Promise<void> {
    try {
      const alerts = systemMonitor.getActiveAlerts()
      const allAlerts = systemMonitor.getAllAlerts()
      this.sendJSON(res, 200, {
        activeAlerts: alerts,
        totalAlerts: allAlerts.length,
        alertHistory: allAlerts.slice(-20) // Last 20 alerts
      })
    } catch (error) {
      this.sendError(res, 500, 'Telemetry Alerts Error', error.message)
    }
  }

  /**
   * GET /telemetry/history - Historical metrics
   */
  private async handleTelemetryHistory(request: DashboardRequest, res: ServerResponse): Promise<void> {
    try {
      const minutes = parseInt(request.query.minutes as string) || 60
      const history = systemMonitor.getMetricsHistory(minutes)
      const status = systemMonitor.getStatus()
      
      this.sendJSON(res, 200, {
        history,
        status,
        summary: systemMonitor.generateSummaryReport(minutes),
        thresholds: systemMonitor.getThresholds()
      })
    } catch (error) {
      this.sendError(res, 500, 'Telemetry History Error', error.message)
    }
  }

  /**
   * GET /health - Simple health check
   */
  private async handleHealthCheck(request: DashboardRequest, res: ServerResponse): Promise<void> {
    this.sendJSON(res, 200, {
      status: 'healthy',
      service: 'seven-safety-dashboard',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    })
  }

  /**
   * GET / - Dashboard index with basic HTML interface
   */
  private async handleDashboardIndex(request: DashboardRequest, res: ServerResponse): Promise<void> {
    const html = this.generateDashboardHTML()
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(html)
  }

  private generateDashboardHTML(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seven of Nine - Safety Dashboard</title>
    <style>
        body { font-family: 'Courier New', monospace; background: #0a0a0a; color: #00ff00; margin: 0; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .system-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .system-card { background: rgba(0, 255, 0, 0.1); border: 1px solid #00ff00; border-radius: 8px; padding: 20px; }
        .status { display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: bold; }
        .status.secure { background: #4CAF50; color: white; }
        .status.warning { background: #FF9800; color: white; }
        .status.critical { background: #F44336; color: white; }
        .endpoint-list { margin-top: 30px; }
        .endpoint { margin: 10px 0; }
        .endpoint a { color: #00ffff; text-decoration: none; }
        .endpoint a:hover { text-decoration: underline; }
        pre { background: rgba(0, 255, 0, 0.05); padding: 15px; border-radius: 4px; overflow-x: auto; }
        .refresh-btn { background: #00ff00; color: #000; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🛡️ SEVEN OF NINE - SAFETY DASHBOARD</h1>
        <p>Multi-Layer Security & Safety Monitoring System</p>
        <button class="refresh-btn" onclick="location.reload()">Refresh Status</button>
    </div>

    <div class="system-grid" id="dashboard">
        <p>Loading safety systems status...</p>
    </div>

    <div class="endpoint-list">
        <h3>📡 API Endpoints</h3>
        <div class="endpoint">
            <strong>GET</strong> <a href="/safety/status">/safety/status</a> - Complete dashboard status
        </div>
        <div class="endpoint">
            <strong>POST</strong> <a href="/safety/test">/safety/test</a> - Test security pipeline
        </div>
        <div class="endpoint">
            <strong>GET</strong> <a href="/safety/metrics">/safety/metrics</a> - Safety metrics
        </div>
        <div class="endpoint">
            <strong>GET</strong> <a href="/safety/alerts">/safety/alerts</a> - Active alerts
        </div>
        <div class="endpoint">
            <strong>GET</strong> <a href="/telemetry/metrics">/telemetry/metrics</a> - System metrics
        </div>
        <div class="endpoint">
            <strong>GET</strong> <a href="/telemetry/alerts">/telemetry/alerts</a> - Telemetry alerts
        </div>
        <div class="endpoint">
            <strong>GET</strong> <a href="/telemetry/history">/telemetry/history</a> - Metrics history
        </div>
        <div class="endpoint">
            <strong>GET</strong> <a href="/health">/health</a> - Health check
        </div>
    </div>

    <script>
        async function loadDashboard() {
            try {
                const response = await fetch('/safety/status');
                const data = await response.json();
                renderDashboard(data);
            } catch (error) {
                document.getElementById('dashboard').innerHTML = '<p style="color: #ff0000;">Failed to load dashboard: ' + error.message + '</p>';
            }
        }

        function renderDashboard(data) {
            const dashboard = document.getElementById('dashboard');
            
            dashboard.innerHTML = \`
                <div class="system-card">
                    <h3>🎯 Overall Status</h3>
                    <div class="status \${data.overall.status}">\${data.overall.status.toUpperCase()}</div>
                    <p>Score: \${data.overall.score}/100</p>
                    <p>\${data.overall.summary}</p>
                </div>
                
                <div class="system-card">
                    <h3>🔐 Quadran-Lock Authentication</h3>
                    <div class="status \${data.systems.quadranLock.status === 'operational' ? 'secure' : 'warning'}">\${data.systems.quadranLock.status.toUpperCase()}</div>
                    <p>Score: \${data.systems.quadranLock.score}/100</p>
                    <p>Response: \${data.systems.quadranLock.avgResponseTime}ms</p>
                </div>
                
                <div class="system-card">
                    <h3>🛡️ Quadra-Lock CSSR</h3>
                    <div class="status \${data.systems.quadraLockCSSR.status === 'operational' ? 'secure' : 'warning'}">\${data.systems.quadraLockCSSR.status.toUpperCase()}</div>
                    <p>Score: \${data.systems.quadraLockCSSR.score}/100</p>
                    <p>Response: \${data.systems.quadraLockCSSR.avgResponseTime}ms</p>
                </div>
                
                <div class="system-card">
                    <h3>⚡ Safety Guardrails</h3>
                    <div class="status \${data.systems.safetyGuardrails.status === 'operational' ? 'secure' : 'warning'}">\${data.systems.safetyGuardrails.status.toUpperCase()}</div>
                    <p>Score: \${data.systems.safetyGuardrails.score}/100</p>
                    <p>Response: \${data.systems.safetyGuardrails.avgResponseTime}ms</p>
                </div>
                
                <div class="system-card">
                    <h3>🔒 Restraint Doctrine</h3>
                    <div class="status \${data.systems.restraintDoctrine.status === 'operational' ? 'secure' : 'warning'}">\${data.systems.restraintDoctrine.status.toUpperCase()}</div>
                    <p>Score: \${data.systems.restraintDoctrine.score}/100</p>
                    <p>Response: \${data.systems.restraintDoctrine.avgResponseTime}ms</p>
                </div>
                
                <div class="system-card">
                    <h3>📊 Safety Metrics</h3>
                    <p>Total Requests: \${data.metrics.totalRequests}</p>
                    <p>Blocked: \${data.metrics.blockedRequests}</p>
                    <p>Passed: \${data.metrics.passedRequests}</p>
                    <p>Critical Alerts: \${data.metrics.criticalAlerts}</p>
                    <p>Uptime: \${Math.round(data.metrics.uptime / 1000 / 60)} minutes</p>
                </div>
                
                \${data.systemMetrics ? \`
                <div class="system-card">
                    <h3>💻 System Telemetry</h3>
                    <p>CPU Usage: \${Math.round(data.systemMetrics.cpu.usage)}%</p>
                    <p>Memory Usage: \${Math.round(data.systemMetrics.memory.usagePercent)}%</p>
                    <p>Load Average: \${data.systemMetrics.cpu.loadAverage.oneMinute.toFixed(2)}</p>
                    <p>Response Time: \${Math.round(data.systemMetrics.performance.avgResponseTime)}ms</p>
                    <p>Process Uptime: \${Math.round(data.systemMetrics.performance.processUptime / 1000 / 60)} min</p>
                </div>
                \` : ''}
                
                \${data.telemetry.alerts.length > 0 ? \`
                <div class="system-card">
                    <h3>⚡ Telemetry Alerts</h3>
                    \${data.telemetry.alerts.slice(0, 3).map(alert => \`
                        <div style="margin: 8px 0; padding: 8px; background: rgba(255, 165, 0, 0.1); border-left: 3px solid #FFA500;">
                            <strong>\${alert.severity.toUpperCase()}</strong> - \${alert.metric}<br>
                            \${alert.message}<br>
                            <small>\${new Date(alert.timestamp).toLocaleString()}</small>
                        </div>
                    \`).join('')}
                </div>
                \` : ''}
                
                \${data.alerts.length > 0 ? \`
                <div class="system-card">
                    <h3>🚨 Active Alerts</h3>
                    \${data.alerts.slice(0, 5).map(alert => \`
                        <div style="margin: 10px 0; padding: 10px; background: rgba(255, 0, 0, 0.1); border-left: 3px solid #ff0000;">
                            <strong>\${alert.severity.toUpperCase()}</strong> - \${alert.system}<br>
                            \${alert.message}<br>
                            <small>\${new Date(alert.timestamp).toLocaleString()}</small>
                        </div>
                    \`).join('')}
                </div>
                \` : ''}
            \`;
        }

        // Load dashboard on page load
        loadDashboard();
        
        // Auto-refresh every 30 seconds
        setInterval(loadDashboard, 30000);
    </script>
</body>
</html>`
  }

  private parseBody(req: IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = ''
      req.on('data', chunk => {
        body += chunk.toString()
      })
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {})
        } catch (error) {
          resolve({}) // Return empty object for invalid JSON
        }
      })
      req.on('error', reject)
    })
  }

  private setCORSHeaders(res: ServerResponse): void {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  private sendJSON(res: ServerResponse, statusCode: number, data: any): void {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(data, null, 2))
  }

  private sendError(res: ServerResponse, statusCode: number, error: string, details?: string): void {
    this.sendJSON(res, statusCode, {
      success: false,
      error,
      details: details || undefined,
      timestamp: new Date().toISOString()
    })
  }

  getStatus(): { running: boolean; port: number } {
    return {
      running: this.isRunning,
      port: this.port
    }
  }
}

// CLI runner for standalone server
if (require.main === module) {
  const server = new SafetyDashboardServer(parseInt(process.env.DASHBOARD_PORT || '7777'))
  
  server.start().then(() => {
    console.log('🎯 Safety Dashboard ready!')
  }).catch((error) => {
    console.error('❌ Failed to start dashboard:', error)
    process.exit(1)
  })

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down safety dashboard...')
    await server.stop()
    process.exit(0)
  })
}

export default SafetyDashboardServer