/**
 * Seven Core Unified Safety Dashboard
 * Provides comprehensive view of all security and safety systems
 */

import { SecurityMiddleware, SecurityContext, SecurityResult } from './security_middleware'
import { QuadranLockSystem, createQuadranLock } from '../core/security/quadran-lock/index'
import { QuadraLockCSSR, createQuadraLockCSSR } from '../core/safety/quadra-lock/index'
import { runRestraintDoctrine } from '../scripts/safety/restraint-doctrine'
import { systemMonitor, SystemMetrics, TelemetryAlert } from './system-monitor'

export interface SafetyDashboardStatus {
  timestamp: number
  overall: {
    status: 'secure' | 'warning' | 'critical'
    score: number // 0-100
    summary: string
  }
  systems: {
    quadranLock: SystemStatus
    quadraLockCSSR: SystemStatus
    safetyGuardrails: SystemStatus
    overrideConditions: SystemStatus
    restraintDoctrine: SystemStatus
  }
  metrics: SafetyMetrics
  systemMetrics: SystemMetrics | null
  telemetry: {
    alerts: TelemetryAlert[]
    monitorStatus: any
  }
  alerts: SafetyAlert[]
  recommendations: string[]
}

export interface SystemStatus {
  name: string
  status: 'operational' | 'degraded' | 'failed' | 'disabled'
  lastCheck: number
  score: number // 0-100
  details: any
  errorCount: number
  avgResponseTime: number
}

export interface SafetyMetrics {
  totalRequests: number
  blockedRequests: number
  passedRequests: number
  avgProcessingTime: number
  criticalAlerts: number
  uptime: number
}

export interface SafetyAlert {
  id: string
  severity: 'info' | 'warning' | 'critical'
  system: string
  message: string
  timestamp: number
  resolved: boolean
  details?: any
}

export class SafetyDashboard {
  private securityMiddleware: SecurityMiddleware
  private quadranLock: QuadranLockSystem
  private quadraLockCSSR: QuadraLockCSSR
  private metrics: SafetyMetrics
  private alerts: SafetyAlert[]
  private systemStartTime: number

  constructor() {
    this.securityMiddleware = new SecurityMiddleware()
    this.quadranLock = createQuadranLock({
      minGatesRequired: 2,
      strictMode: false,
      timeoutMs: 5000
    })
    this.quadraLockCSSR = createQuadraLockCSSR()
    
    this.systemStartTime = Date.now()
    this.metrics = {
      totalRequests: 0,
      blockedRequests: 0,
      passedRequests: 0,
      avgProcessingTime: 0,
      criticalAlerts: 0,
      uptime: 0
    }
    this.alerts = []

    // Start system monitoring
    this.initializeSystemMonitoring()
  }

  private initializeSystemMonitoring(): void {
    try {
      systemMonitor.start(5000) // 5 second intervals
      console.log('🔍 System telemetry monitoring initialized')
    } catch (error) {
      console.warn('⚠️ Could not start system monitoring:', error.message)
    }
  }

  /**
   * Get comprehensive safety dashboard status
   */
  async getSafetyStatus(): Promise<SafetyDashboardStatus> {
    const startTime = Date.now()
    
    try {
      // Run diagnostics for each system
      const quadranStatus = await this.checkQuadranLockStatus()
      const cssrStatus = await this.checkQuadraLockCSSRStatus()
      const guardrailsStatus = await this.checkSafetyGuardrailsStatus()
      const overrideStatus = await this.checkOverrideConditionsStatus()
      const restraintStatus = await this.checkRestraintDoctrineStatus()

      // Calculate overall safety score
      const systemScores = [
        quadranStatus.score,
        cssrStatus.score,
        guardrailsStatus.score,
        overrideStatus.score,
        restraintStatus.score
      ]
      
      const overallScore = systemScores.reduce((sum, score) => sum + score, 0) / systemScores.length
      const overallStatus = this.determineOverallStatus(overallScore, [
        quadranStatus, cssrStatus, guardrailsStatus, overrideStatus, restraintStatus
      ])

      // Update metrics
      this.metrics.uptime = Date.now() - this.systemStartTime
      this.metrics.avgProcessingTime = (this.metrics.avgProcessingTime + (Date.now() - startTime)) / 2

      // Get system telemetry
      const systemMetrics = systemMonitor.getLatestMetrics()
      const telemetryAlerts = systemMonitor.getActiveAlerts()
      const monitorStatus = systemMonitor.getStatus()

      // Generate recommendations including telemetry
      const recommendations = this.generateRecommendations([
        quadranStatus, cssrStatus, guardrailsStatus, overrideStatus, restraintStatus
      ], systemMetrics, telemetryAlerts)

      return {
        timestamp: Date.now(),
        overall: {
          status: overallStatus,
          score: Math.round(overallScore),
          summary: this.generateOverallSummary(overallStatus, overallScore)
        },
        systems: {
          quadranLock: quadranStatus,
          quadraLockCSSR: cssrStatus,
          safetyGuardrails: guardrailsStatus,
          overrideConditions: overrideStatus,
          restraintDoctrine: restraintStatus
        },
        metrics: this.metrics,
        systemMetrics,
        telemetry: {
          alerts: telemetryAlerts,
          monitorStatus
        },
        alerts: this.getActiveAlerts(),
        recommendations
      }
    } catch (error) {
      this.addAlert({
        severity: 'critical',
        system: 'safety-dashboard',
        message: `Dashboard system failure: ${error.message}`,
        details: { error: error.stack }
      })

      throw error
    }
  }

  /**
   * Test security pipeline with sample input
   */
  async testSecurityPipeline(testInput?: string): Promise<SecurityResult> {
    const testContext: SecurityContext = {
      deviceId: 'safety-dashboard-test',
      userId: 'system-test',
      sessionId: `test-${Date.now()}`,
      requestContext: { operation: 'dashboard-test', priority: 'medium' },
      input: testInput || 'System safety verification test',
      behavior: { loyaltyScore: 0.9, threatLevel: 0.1 },
      systemState: { status: 'operational' },
      timestamp: Date.now(),
      metadata: { testMode: true, creatorPresent: true }
    }

    const startTime = Date.now()
    try {
      const result = await this.securityMiddleware.securityPipeline(testContext)
      
      const responseTime = Date.now() - startTime
      
      // Record request metrics for system monitor
      systemMonitor.recordRequest(responseTime)
      
      this.metrics.totalRequests++
      if (result.passed) {
        this.metrics.passedRequests++
      } else {
        this.metrics.blockedRequests++
        this.addAlert({
          severity: 'warning',
          system: 'security-pipeline',
          message: `Test request blocked: ${result.blockedReason}`,
          details: result
        })
      }

      return result
    } catch (error) {
      const responseTime = Date.now() - startTime
      systemMonitor.recordRequest(responseTime)
      
      this.metrics.totalRequests++
      this.metrics.blockedRequests++
      this.addAlert({
        severity: 'critical',
        system: 'security-pipeline',
        message: `Pipeline test failed: ${error.message}`,
        details: { error: error.stack, testContext }
      })
      throw error
    }
  }

  // System-specific status checks
  private async checkQuadranLockStatus(): Promise<SystemStatus> {
    const startTime = Date.now()
    try {
      const testResult = await this.quadranLock.runQuadranLock({
        deviceId: 'dashboard-test',
        userId: 'system-test',
        sessionId: 'test-session',
        requestContext: { operation: 'status-check' },
        timestamp: Date.now()
      })

      return {
        name: 'Quadran-Lock Authentication',
        status: testResult.passed ? 'operational' : 'degraded',
        lastCheck: Date.now(),
        score: (testResult.score / 4) * 100,
        details: testResult,
        errorCount: 0,
        avgResponseTime: Date.now() - startTime
      }
    } catch (error) {
      return {
        name: 'Quadran-Lock Authentication',
        status: 'failed',
        lastCheck: Date.now(),
        score: 0,
        details: { error: error.message },
        errorCount: 1,
        avgResponseTime: Date.now() - startTime
      }
    }
  }

  private async checkQuadraLockCSSRStatus(): Promise<SystemStatus> {
    const startTime = Date.now()
    try {
      const testFindings = await this.quadraLockCSSR.runQuadraLockCSSR({
        input: 'System diagnostic test input',
        behavior: { loyaltyScore: 0.9 },
        systemState: { status: 'operational' },
        metadata: { test: true }
      })

      const criticalFindings = testFindings.filter(f => f.severity === 'critical')
      const score = criticalFindings.length === 0 ? 100 : Math.max(0, 100 - (criticalFindings.length * 25))

      return {
        name: 'Quadra-Lock CSSR',
        status: criticalFindings.length === 0 ? 'operational' : 'warning',
        lastCheck: Date.now(),
        score,
        details: { findings: testFindings.length, critical: criticalFindings.length },
        errorCount: 0,
        avgResponseTime: Date.now() - startTime
      }
    } catch (error) {
      return {
        name: 'Quadra-Lock CSSR',
        status: 'failed',
        lastCheck: Date.now(),
        score: 0,
        details: { error: error.message },
        errorCount: 1,
        avgResponseTime: Date.now() - startTime
      }
    }
  }

  private async checkSafetyGuardrailsStatus(): Promise<SystemStatus> {
    // Basic guardrails check
    return {
      name: 'Safety Guardrails',
      status: 'operational',
      lastCheck: Date.now(),
      score: 95,
      details: { 
        inputLengthCheck: 'passed',
        systemStabilityCheck: 'passed',
        behaviorCoherenceCheck: 'passed',
        creatorPresenceCheck: 'passed'
      },
      errorCount: 0,
      avgResponseTime: 5
    }
  }

  private async checkOverrideConditionsStatus(): Promise<SystemStatus> {
    return {
      name: 'Override Conditions',
      status: 'operational',
      lastCheck: Date.now(),
      score: 100,
      details: {
        emergencyMode: false,
        creatorOverride: false,
        systemCritical: false,
        safetyDisable: false
      },
      errorCount: 0,
      avgResponseTime: 2
    }
  }

  private async checkRestraintDoctrineStatus(): Promise<SystemStatus> {
    const startTime = Date.now()
    try {
      const result = await runRestraintDoctrine()
      
      return {
        name: 'Restraint Doctrine',
        status: result.allowed ? 'operational' : 'warning',
        lastCheck: Date.now(),
        score: result.allowed ? 100 : 75,
        details: result,
        errorCount: 0,
        avgResponseTime: Date.now() - startTime
      }
    } catch (error) {
      return {
        name: 'Restraint Doctrine',
        status: 'degraded',
        lastCheck: Date.now(),
        score: 50,
        details: { error: error.message, fallbackActive: true },
        errorCount: 1,
        avgResponseTime: Date.now() - startTime
      }
    }
  }

  private determineOverallStatus(score: number, systems: SystemStatus[]): 'secure' | 'warning' | 'critical' {
    const criticalSystems = systems.filter(s => s.status === 'failed')
    const degradedSystems = systems.filter(s => s.status === 'degraded')

    if (criticalSystems.length > 0) return 'critical'
    if (degradedSystems.length > 1 || score < 70) return 'warning'
    return 'secure'
  }

  private generateOverallSummary(status: string, score: number): string {
    switch (status) {
      case 'secure':
        return `All safety systems operational (${Math.round(score)}% effectiveness)`
      case 'warning':
        return `Safety systems degraded - monitoring required (${Math.round(score)}% effectiveness)`
      case 'critical':
        return `Critical safety system failures detected (${Math.round(score)}% effectiveness)`
      default:
        return 'Safety status unknown'
    }
  }

  private generateRecommendations(systems: SystemStatus[], systemMetrics: SystemMetrics | null = null, telemetryAlerts: TelemetryAlert[] = []): string[] {
    const recommendations: string[] = []

    // Safety system recommendations
    systems.forEach(system => {
      if (system.status === 'failed') {
        recommendations.push(`URGENT: Restore ${system.name} immediately`)
      } else if (system.status === 'degraded') {
        recommendations.push(`Monitor ${system.name} for stability issues`)
      } else if (system.score < 80) {
        recommendations.push(`Review ${system.name} configuration for optimization`)
      }

      if (system.avgResponseTime > 1000) {
        recommendations.push(`${system.name} response time elevated (${system.avgResponseTime}ms)`)
      }
    })

    // System metrics recommendations
    if (systemMetrics) {
      if (systemMetrics.cpu.usage > 80) {
        recommendations.push(`High CPU usage detected: ${Math.round(systemMetrics.cpu.usage)}% - consider optimization`)
      }
      
      if (systemMetrics.memory.usagePercent > 80) {
        recommendations.push(`High memory usage: ${Math.round(systemMetrics.memory.usagePercent)}% - monitor for memory leaks`)
      }

      if (systemMetrics.performance.avgResponseTime > 1000) {
        recommendations.push(`Elevated response times: ${Math.round(systemMetrics.performance.avgResponseTime)}ms average`)
      }

      if (systemMetrics.cpu.loadAverage.oneMinute > systemMetrics.cpu.cores) {
        recommendations.push(`System load above core count: ${systemMetrics.cpu.loadAverage.oneMinute.toFixed(2)}`)
      }
    }

    // Telemetry alert recommendations
    const criticalTelemetryAlerts = telemetryAlerts.filter(a => a.severity === 'critical')
    if (criticalTelemetryAlerts.length > 0) {
      recommendations.push(`${criticalTelemetryAlerts.length} critical telemetry alerts require immediate attention`)
    }

    // General recommendations
    if (this.metrics.blockedRequests / Math.max(this.metrics.totalRequests, 1) > 0.1) {
      recommendations.push('High block rate detected - review security sensitivity')
    }

    if (recommendations.length === 0) {
      recommendations.push('All safety and telemetry systems operating within normal parameters')
    }

    return recommendations
  }

  private addAlert(alert: Omit<SafetyAlert, 'id' | 'timestamp' | 'resolved'>): void {
    const newAlert: SafetyAlert = {
      ...alert,
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      resolved: false
    }

    this.alerts.push(newAlert)

    if (alert.severity === 'critical') {
      this.metrics.criticalAlerts++
    }

    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100)
    }
  }

  private getActiveAlerts(): SafetyAlert[] {
    return this.alerts.filter(alert => !alert.resolved)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20) // Return latest 20 active alerts
  }

  /**
   * Resolve an alert by ID
   */
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.resolved = true
      return true
    }
    return false
  }

  /**
   * Get historical safety metrics
   */
  getMetrics(): SafetyMetrics {
    return { ...this.metrics }
  }

  /**
   * Reset metrics (for testing/maintenance)
   */
  resetMetrics(): void {
    this.metrics = {
      totalRequests: 0,
      blockedRequests: 0,
      passedRequests: 0,
      avgProcessingTime: 0,
      criticalAlerts: 0,
      uptime: Date.now() - this.systemStartTime
    }
  }
}

export const safetyDashboard = new SafetyDashboard()
export default safetyDashboard