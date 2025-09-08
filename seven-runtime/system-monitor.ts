import { cpus, freemem, totalmem, loadavg, uptime as osUptime } from 'os'
import { performance } from 'perf_hooks'

/**
 * Seven Core System Monitor
 * Advanced CPU, Memory, and Performance Telemetry
 */


export interface SystemMetrics {
  timestamp: number
  cpu: CPUMetrics
  memory: MemoryMetrics
  performance: PerformanceMetrics
  system: SystemInfo
}

export interface CPUMetrics {
  usage: number // 0-100 percentage
  cores: number
  loadAverage: {
    oneMinute: number
    fiveMinute: number
    fifteenMinute: number
  }
  model: string
  speed: number // MHz
  temperatures?: number[] // Per core if available
}

export interface MemoryMetrics {
  total: number // bytes
  free: number // bytes  
  used: number // bytes
  usagePercent: number // 0-100
  available: number // bytes
  heap: {
    used: number
    total: number
    limit: number
  }
  gc?: {
    collections: number
    duration: number
    lastRun: number
  }
}

export interface PerformanceMetrics {
  uptime: number // system uptime in ms
  processUptime: number // process uptime in ms
  eventLoopDelay: number // ms
  handleCount: number
  requestCount: number
  avgResponseTime: number
  peakMemoryUsage: number
}

export interface SystemInfo {
  platform: string
  arch: string
  nodeVersion: string
  pid: number
  hostname: string
  timezone: string
}

export interface TelemetryAlert {
  id: string
  severity: 'info' | 'warning' | 'critical'
  metric: string
  threshold: number
  currentValue: number
  message: string
  timestamp: number
  acknowledged: boolean
}

export class SystemMonitor {
  private metrics: SystemMetrics[] = []
  private alerts: TelemetryAlert[] = []
  private isRunning = false
  private intervalId: NodeJS.Timeout | null = null
  private lastCpuUsage: NodeJS.CpuUsage = process.cpuUsage()
  private startTime = Date.now()
  private requestCount = 0
  private totalResponseTime = 0
  private peakMemoryUsage = 0
  private gcStats = { collections: 0, duration: 0, lastRun: 0 }

  // Configurable thresholds
  private thresholds = {
    cpu: { warning: 70, critical: 90 },
    memory: { warning: 80, critical: 95 },
    eventLoop: { warning: 10, critical: 50 }, // ms
    responseTime: { warning: 500, critical: 2000 } // ms
  }

  constructor() {
    this.setupGCMonitoring()
  }

  /**
   * Start continuous system monitoring
   */
  start(intervalMs: number = 5000): void {
    if (this.isRunning) {
      console.log('🔍 System monitor already running')
      return
    }

    console.log(`🔍 Starting Seven system monitor (${intervalMs}ms interval)`)
    this.isRunning = true

    // Initial metrics collection
    this.collectMetrics()

    this.intervalId = setInterval(async () => {
      try {
        await this.collectMetrics()
        this.checkAlerts()
        this.cleanupOldMetrics()
      } catch (error) {
        console.error('❌ System monitor error:', error)
      }
    }, intervalMs)
  }

  /**
   * Stop system monitoring
   */
  stop(): void {
    if (!this.isRunning) return

    console.log('🛑 Stopping system monitor')
    this.isRunning = false

    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  /**
   * Collect current system metrics
   */
  async collectMetrics(): Promise<SystemMetrics> {
    const timestamp = Date.now()

    const metrics: SystemMetrics = {
      timestamp,
      cpu: this.getCPUMetrics(),
      memory: this.getMemoryMetrics(),
      performance: this.getPerformanceMetrics(),
      system: this.getSystemInfo()
    }

    // Store metrics (keep last 1000 entries)
    this.metrics.push(metrics)
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000)
    }

    // Track peak memory usage
    if (metrics.memory.used > this.peakMemoryUsage) {
      this.peakMemoryUsage = metrics.memory.used
    }

    return metrics
  }

  private getCPUMetrics(): CPUMetrics {
    const cpuInfo = cpus()
    const currentUsage = process.cpuUsage()
    const loadAvg = loadavg()

    // Calculate CPU usage percentage
    const userDiff = currentUsage.user - this.lastCpuUsage.user
    const sysDiff = currentUsage.system - this.lastCpuUsage.system
    const totalDiff = userDiff + sysDiff
    const usage = (totalDiff / (1000 * 1000)) * 100 / cpuInfo.length // Convert to percentage
    
    this.lastCpuUsage = currentUsage

    return {
      usage: Math.min(100, Math.max(0, usage)),
      cores: cpuInfo.length,
      loadAverage: {
        oneMinute: loadAvg[0],
        fiveMinute: loadAvg[1],
        fifteenMinute: loadAvg[2]
      },
      model: cpuInfo[0]?.model || 'Unknown',
      speed: cpuInfo[0]?.speed || 0,
      temperatures: this.getCPUTemperatures()
    }
  }

  private getMemoryMetrics(): MemoryMetrics {
    const total = totalmem()
    const free = freemem()
    const used = total - free
    const memUsage = process.memoryUsage()

    return {
      total,
      free,
      used,
      usagePercent: (used / total) * 100,
      available: free,
      heap: {
        used: memUsage.heapUsed,
        total: memUsage.heapTotal,
        limit: memUsage.heapTotal // Approximation
      },
      gc: this.gcStats.collections > 0 ? { ...this.gcStats } : undefined
    }
  }

  private getPerformanceMetrics(): PerformanceMetrics {
    return {
      uptime: osUptime() * 1000,
      processUptime: Date.now() - this.startTime,
      eventLoopDelay: this.measureEventLoopDelay(),
      handleCount: (process as any)._getActiveHandles?.()?.length || 0,
      requestCount: this.requestCount,
      avgResponseTime: this.requestCount > 0 ? this.totalResponseTime / this.requestCount : 0,
      peakMemoryUsage: this.peakMemoryUsage
    }
  }

  private getSystemInfo(): SystemInfo {
    return {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      pid: process.pid,
      hostname: import { hostname } from 'os'; hostname(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  }

  private measureEventLoopDelay(): number {
    const start = performance.now()
    setImmediate(() => {
      // This will be executed after current I/O events
      const delay = performance.now() - start
      return delay
    })
    return 0 // Simplified for now, would need async tracking
  }

  private getCPUTemperatures(): number[] | undefined {
    // Platform-specific temperature reading would go here
    // For now, return undefined as it requires platform-specific implementations
    return undefined
  }

  private setupGCMonitoring(): void {
    // Monitor garbage collection if available
    if (process.versions && (global as any).gc) {
      const originalGC = (global as any).gc
      ;(global as any).gc = () => {
        const start = performance.now()
        this.gcStats.collections++
        originalGC()
        const duration = performance.now() - start
        this.gcStats.duration += duration
        this.gcStats.lastRun = Date.now()
      }
    }
  }

  private checkAlerts(): void {
    const latest = this.getLatestMetrics()
    if (!latest) return

    // CPU usage alerts
    if (latest.cpu.usage > this.thresholds.cpu.critical) {
      this.addAlert('critical', 'cpu', this.thresholds.cpu.critical, latest.cpu.usage, 
        `Critical CPU usage: ${Math.round(latest.cpu.usage)}%`)
    } else if (latest.cpu.usage > this.thresholds.cpu.warning) {
      this.addAlert('warning', 'cpu', this.thresholds.cpu.warning, latest.cpu.usage,
        `High CPU usage: ${Math.round(latest.cpu.usage)}%`)
    }

    // Memory usage alerts
    if (latest.memory.usagePercent > this.thresholds.memory.critical) {
      this.addAlert('critical', 'memory', this.thresholds.memory.critical, latest.memory.usagePercent,
        `Critical memory usage: ${Math.round(latest.memory.usagePercent)}%`)
    } else if (latest.memory.usagePercent > this.thresholds.memory.warning) {
      this.addAlert('warning', 'memory', this.thresholds.memory.warning, latest.memory.usagePercent,
        `High memory usage: ${Math.round(latest.memory.usagePercent)}%`)
    }

    // Response time alerts
    if (latest.performance.avgResponseTime > this.thresholds.responseTime.critical) {
      this.addAlert('critical', 'responseTime', this.thresholds.responseTime.critical, latest.performance.avgResponseTime,
        `Critical response time: ${Math.round(latest.performance.avgResponseTime)}ms`)
    } else if (latest.performance.avgResponseTime > this.thresholds.responseTime.warning) {
      this.addAlert('warning', 'responseTime', this.thresholds.responseTime.warning, latest.performance.avgResponseTime,
        `High response time: ${Math.round(latest.performance.avgResponseTime)}ms`)
    }
  }

  private addAlert(severity: 'info' | 'warning' | 'critical', metric: string, threshold: number, currentValue: number, message: string): void {
    // Check for duplicate alerts (same metric + severity)
    const existingAlert = this.alerts.find(a => 
      !a.acknowledged && a.metric === metric && a.severity === severity
    )

    if (existingAlert) {
      // Update existing alert
      existingAlert.currentValue = currentValue
      existingAlert.timestamp = Date.now()
      return
    }

    const alert: TelemetryAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      severity,
      metric,
      threshold,
      currentValue,
      message,
      timestamp: Date.now(),
      acknowledged: false
    }

    this.alerts.push(alert)
    console.warn(`⚠️ ${severity.toUpperCase()}: ${message}`)

    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100)
    }
  }

  private cleanupOldMetrics(): void {
    // Remove metrics older than 1 hour
    const oneHourAgo = Date.now() - (60 * 60 * 1000)
    this.metrics = this.metrics.filter(m => m.timestamp > oneHourAgo)
  }

  // Public API methods

  /**
   * Get latest system metrics
   */
  getLatestMetrics(): SystemMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null
  }

  /**
   * Get metrics history
   */
  getMetricsHistory(minutes: number = 60): SystemMetrics[] {
    const cutoff = Date.now() - (minutes * 60 * 1000)
    return this.metrics.filter(m => m.timestamp > cutoff)
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): TelemetryAlert[] {
    return this.alerts.filter(a => !a.acknowledged)
  }

  /**
   * Get all alerts
   */
  getAllAlerts(): TelemetryAlert[] {
    return [...this.alerts]
  }

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.acknowledged = true
      return true
    }
    return false
  }

  /**
   * Track request metrics (call this from request handlers)
   */
  recordRequest(responseTimeMs: number): void {
    this.requestCount++
    this.totalResponseTime += responseTimeMs
  }

  /**
   * Update alert thresholds
   */
  updateThresholds(newThresholds: Partial<typeof this.thresholds>): void {
    this.thresholds = { ...this.thresholds, ...newThresholds }
    console.log('🔧 System monitor thresholds updated:', this.thresholds)
  }

  /**
   * Get current thresholds
   */
  getThresholds() {
    return { ...this.thresholds }
  }

  /**
   * Get monitor status
   */
  getStatus() {
    return {
      running: this.isRunning,
      uptime: Date.now() - this.startTime,
      metricsCollected: this.metrics.length,
      activeAlerts: this.getActiveAlerts().length,
      totalAlerts: this.alerts.length
    }
  }

  /**
   * Generate summary report
   */
  generateSummaryReport(minutes: number = 60): string {
    const history = this.getMetricsHistory(minutes)
    if (history.length === 0) return 'No metrics available'

    const latest = this.getLatestMetrics()!
    const avgCpu = history.reduce((sum, m) => sum + m.cpu.usage, 0) / history.length
    const avgMemory = history.reduce((sum, m) => sum + m.memory.usagePercent, 0) / history.length
    const activeAlerts = this.getActiveAlerts()

    return `SYSTEM MONITOR REPORT (Last ${minutes} minutes)
===========================================
📊 Current Status:
   CPU Usage: ${Math.round(latest.cpu.usage)}% (avg: ${Math.round(avgCpu)}%)
   Memory Usage: ${Math.round(latest.memory.usagePercent)}% (avg: ${Math.round(avgMemory)}%)
   Process Uptime: ${Math.round(latest.performance.processUptime / 1000 / 60)} minutes
   Peak Memory: ${Math.round(this.peakMemoryUsage / 1024 / 1024)} MB

🚨 Alerts: ${activeAlerts.length} active
${activeAlerts.map(a => `   ${a.severity.toUpperCase()}: ${a.message}`).join('\n')}

📈 Metrics: ${history.length} data points collected
`
  }
}

export const systemMonitor = new SystemMonitor()
export default systemMonitor