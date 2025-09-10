import { execSync } from 'child_process'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { safetyDashboard } from '../../seven-runtime/safety-dashboard'
import { systemMonitor } from '../../seven-runtime/system-monitor'

/**
 * Seven Core Merge-Review Agent
 * Automated code review and merge validation workflow
 */


export interface MergeReviewConfig {
  branch: string
  baseBranch: string
  autoMergeThreshold: number // 0-100 score
  requireTests: boolean
  requireSafetyCheck: boolean
  requireTelemetryCheck: boolean
  maxCriticalIssues: number
  reviewTimeoutMs: number
}

export interface MergeReviewResult {
  approved: boolean
  score: number // 0-100
  issues: ReviewIssue[]
  recommendations: string[]
  safetyStatus?: any
  telemetryStatus?: any
  timestamp: number
  reviewer: string
}

export interface ReviewIssue {
  type: 'critical' | 'warning' | 'info'
  category: 'safety' | 'security' | 'quality' | 'performance' | 'style'
  message: string
  file?: string
  line?: number
  details?: any
}

export class MergeReviewAgent {
  private config: MergeReviewConfig
  private reviews: MergeReviewResult[] = []

  constructor(config?: Partial<MergeReviewConfig>) {
    this.config = {
      branch: 'merge-review',
      baseBranch: 'main',
      autoMergeThreshold: 85,
      requireTests: true,
      requireSafetyCheck: true,
      requireTelemetryCheck: true,
      maxCriticalIssues: 0,
      reviewTimeoutMs: 120000, // 2 minutes
      ...config
    }
  }

  /**
   * Perform comprehensive merge review
   */
  async performReview(branch?: string): Promise<MergeReviewResult> {
    const reviewBranch = branch || this.config.branch
    const startTime = Date.now()

    console.log(`🔍 Starting merge review for branch: ${reviewBranch}`)
    console.log(`📋 Review criteria: ${this.config.autoMergeThreshold}% score threshold`)

    const result: MergeReviewResult = {
      approved: false,
      score: 0,
      issues: [],
      recommendations: [],
      timestamp: Date.now(),
      reviewer: 'merge-review-agent'
    }

    try {
      // Step 1: Git repository validation
      console.log('📁 Validating git repository status...')
      await this.validateGitRepository(result)

      // Step 2: Branch analysis
      console.log('🌿 Analyzing branch changes...')
      await this.analyzeBranchChanges(reviewBranch, result)

      // Step 3: Code quality checks
      console.log('🔧 Running code quality checks...')
      await this.runCodeQualityChecks(result)

      // Step 4: Safety and security review
      if (this.config.requireSafetyCheck) {
        console.log('🛡️ Running safety and security checks...')
        await this.runSafetyChecks(result)
      }

      // Step 5: Performance and telemetry review
      if (this.config.requireTelemetryCheck) {
        console.log('📊 Checking system telemetry...')
        await this.runTelemetryChecks(result)
      }

      // Step 6: Test execution
      if (this.config.requireTests) {
        console.log('🧪 Running test suite...')
        await this.runTestSuite(result)
      }

      // Step 7: Calculate final score and approval
      result.score = this.calculateReviewScore(result.issues)
      const criticalIssues = result.issues.filter(i => i.type === 'critical').length
      
      result.approved = result.score >= this.config.autoMergeThreshold && 
                       criticalIssues <= this.config.maxCriticalIssues

      // Step 8: Generate recommendations
      result.recommendations = this.generateRecommendations(result)

      // Log results
      const duration = Date.now() - startTime
      console.log(`✅ Review completed in ${duration}ms`)
      console.log(`📊 Score: ${result.score}/100`)
      console.log(`🚨 Critical issues: ${criticalIssues}`)
      console.log(`✋ Approved: ${result.approved ? 'YES' : 'NO'}`)

      if (result.approved) {
        console.log('🎯 Branch meets all merge criteria')
      } else {
        console.log('⚠️ Branch requires attention before merge')
        result.issues.forEach(issue => {
          console.log(`   ${this.getIssueIcon(issue.type)} ${issue.message}`)
        })
      }

      // Store review result
      this.reviews.push(result)

      return result

    } catch (error) {
      console.error('❌ Review failed:', error.message)
      result.issues.push({
        type: 'critical',
        category: 'quality',
        message: `Review process failed: ${error.message}`,
        details: { error: error.stack }
      })
      result.approved = false
      result.score = 0
      return result
    }
  }

  private async validateGitRepository(result: MergeReviewResult): Promise<void> {
    try {
      // Check if we're in a git repository
      execSync('git rev-parse --git-dir', { stdio: 'pipe' })
      
      // Check for uncommitted changes
      const status = execSync('git status --porcelain', { encoding: 'utf8' })
      if (status.trim()) {
        result.issues.push({
          type: 'warning',
          category: 'quality',
          message: 'Uncommitted changes detected in working directory',
          details: { uncommittedFiles: status.trim().split('\n') }
        })
      }

      // Check if merge-review branch exists
      try {
        execSync(`git rev-parse --verify ${this.config.branch}`, { stdio: 'pipe' })
      } catch {
        result.issues.push({
          type: 'critical',
          category: 'quality',
          message: `Branch ${this.config.branch} does not exist`,
          details: { expectedBranch: this.config.branch }
        })
      }

    } catch (error) {
      result.issues.push({
        type: 'critical',
        category: 'quality',
        message: 'Not in a valid git repository',
        details: { error: error.message }
      })
    }
  }

  private async analyzeBranchChanges(branch: string, result: MergeReviewResult): Promise<void> {
    try {
      // Get commit count
      const commitCount = execSync(`git rev-list --count ${this.config.baseBranch}..${branch}`, { encoding: 'utf8' }).trim()
      console.log(`📈 Found ${commitCount} commits ahead of ${this.config.baseBranch}`)

      if (parseInt(commitCount) === 0) {
        result.issues.push({
          type: 'warning',
          category: 'quality',
          message: 'No new commits found - branch may be up to date',
          details: { commitCount: 0 }
        })
      }

      // Get changed files
      const changedFiles = execSync(`git diff --name-only ${this.config.baseBranch}..${branch}`, { encoding: 'utf8' })
        .trim().split('\n').filter(f => f)

      console.log(`📝 Changed files: ${changedFiles.length}`)

      // Analyze file types
      const criticalFiles = changedFiles.filter(f => 
        f.includes('security') || f.includes('auth') || f.includes('safety') || 
        f.endsWith('.ts') && (f.includes('runtime') || f.includes('core'))
      )

      if (criticalFiles.length > 0) {
        result.issues.push({
          type: 'info',
          category: 'security',
          message: `${criticalFiles.length} critical system files modified - enhanced review required`,
          details: { criticalFiles }
        })
      }

      // Check for large changes
      const diffStats = execSync(`git diff --stat ${this.config.baseBranch}..${branch}`, { encoding: 'utf8' })
      const lines = diffStats.split('\n')
      const summary = lines[lines.length - 2] // Second to last line has summary
      
      if (summary && summary.includes('insertion')) {
        const insertions = parseInt(summary.match(/(\d+) insertion/)?.[1] || '0')
        const deletions = parseInt(summary.match(/(\d+) deletion/)?.[1] || '0')
        
        if (insertions + deletions > 1000) {
          result.issues.push({
            type: 'warning',
            category: 'quality',
            message: `Large changeset detected: ${insertions + deletions} lines modified`,
            details: { insertions, deletions }
          })
        }
      }

    } catch (error) {
      result.issues.push({
        type: 'warning',
        category: 'quality',
        message: `Failed to analyze branch changes: ${error.message}`,
        details: { error: error.message }
      })
    }
  }

  private async runCodeQualityChecks(result: MergeReviewResult): Promise<void> {
    // TypeScript compilation check
    try {
      console.log('🔨 Checking TypeScript compilation...')
      execSync('npx tsc --noEmit', { stdio: 'pipe' })
      console.log('✅ TypeScript compilation passed')
    } catch (error) {
      result.issues.push({
        type: 'critical',
        category: 'quality',
        message: 'TypeScript compilation failed',
        details: { error: error.message }
      })
    }

    // Check for banned terms (quadran-lock)
    try {
      console.log('🚫 Checking for banned terms...')
      const bannedTermsOutput = execSync('git grep -n "quadran-lock" || true', { encoding: 'utf8' })
      if (bannedTermsOutput.trim()) {
        result.issues.push({
          type: 'critical',
          category: 'quality',
          message: 'Banned term "quadran-lock" found in code - use "quadran-lock" instead',
          details: { occurrences: bannedTermsOutput.trim().split('\n') }
        })
      }
    } catch (error) {
      // Ignore grep errors (no matches)
    }

    // Basic linting simulation (placeholder)
    console.log('🔍 Running code style checks...')
    // In a real implementation, this would run ESLint or similar
  }

  private async runSafetyChecks(result: MergeReviewResult): Promise<void> {
    try {
      const safetyStatus = await safetyDashboard.getSafetyStatus()
      result.safetyStatus = safetyStatus

      // Check overall safety score
      if (safetyStatus.overall.score < 80) {
        result.issues.push({
          type: 'warning',
          category: 'safety',
          message: `Safety systems degraded: ${safetyStatus.overall.score}/100 score`,
          details: { safetyStatus: safetyStatus.overall }
        })
      }

      // Check for critical alerts
      const criticalAlerts = safetyStatus.alerts.filter(a => a.severity === 'critical')
      if (criticalAlerts.length > 0) {
        result.issues.push({
          type: 'critical',
          category: 'safety',
          message: `${criticalAlerts.length} critical safety alerts active`,
          details: { criticalAlerts }
        })
      }

      // Run security pipeline test
      console.log('🧪 Testing security pipeline...')
      const pipelineResult = await safetyDashboard.testSecurityPipeline('Merge review security test')
      
      if (!pipelineResult.passed) {
        result.issues.push({
          type: 'critical',
          category: 'security',
          message: `Security pipeline test failed: ${pipelineResult.blockedReason}`,
          details: { pipelineResult }
        })
      }

    } catch (error) {
      result.issues.push({
        type: 'warning',
        category: 'safety',
        message: `Safety check failed: ${error.message}`,
        details: { error: error.message }
      })
    }
  }

  private async runTelemetryChecks(result: MergeReviewResult): Promise<void> {
    try {
      const telemetryStatus = systemMonitor.getStatus()
      const latestMetrics = systemMonitor.getLatestMetrics()
      const activeAlerts = systemMonitor.getActiveAlerts()

      result.telemetryStatus = {
        status: telemetryStatus,
        metrics: latestMetrics,
        alerts: activeAlerts
      }

      // Check system performance
      if (latestMetrics) {
        if (latestMetrics.cpu.usage > 90) {
          result.issues.push({
            type: 'warning',
            category: 'performance',
            message: `High CPU usage: ${Math.round(latestMetrics.cpu.usage)}%`,
            details: { cpuUsage: latestMetrics.cpu.usage }
          })
        }

        if (latestMetrics.memory.usagePercent > 90) {
          result.issues.push({
            type: 'warning',
            category: 'performance',
            message: `High memory usage: ${Math.round(latestMetrics.memory.usagePercent)}%`,
            details: { memoryUsage: latestMetrics.memory.usagePercent }
          })
        }
      }

      // Check telemetry alerts
      const criticalTelemetryAlerts = activeAlerts.filter(a => a.severity === 'critical')
      if (criticalTelemetryAlerts.length > 0) {
        result.issues.push({
          type: 'critical',
          category: 'performance',
          message: `${criticalTelemetryAlerts.length} critical system alerts active`,
          details: { criticalTelemetryAlerts }
        })
      }

    } catch (error) {
      result.issues.push({
        type: 'warning',
        category: 'performance',
        message: `Telemetry check failed: ${error.message}`,
        details: { error: error.message }
      })
    }
  }

  private async runTestSuite(result: MergeReviewResult): Promise<void> {
    try {
      console.log('🧪 Running test suite...')
      
      // Basic test commands (customize based on your test setup)
      const testCommands = [
        'npm test',
        'npx tsx core/security/quadran-lock/tests.ts',
        'npx tsx core/safety/quadra-lock/tests.ts'
      ]

      for (const command of testCommands) {
        try {
          console.log(`   Running: ${command}`)
          execSync(command, { stdio: 'pipe', timeout: 30000 })
          console.log(`   ✅ ${command} passed`)
        } catch (error) {
          result.issues.push({
            type: 'critical',
            category: 'quality',
            message: `Test failed: ${command}`,
            details: { 
              command,
              error: error.message,
              output: error.stdout?.toString() || error.stderr?.toString()
            }
          })
        }
      }

    } catch (error) {
      result.issues.push({
        type: 'warning',
        category: 'quality',
        message: `Test execution failed: ${error.message}`,
        details: { error: error.message }
      })
    }
  }

  private calculateReviewScore(issues: ReviewIssue[]): number {
    let score = 100
    
    issues.forEach(issue => {
      switch (issue.type) {
        case 'critical':
          score -= 20
          break
        case 'warning':
          score -= 10
          break
        case 'info':
          score -= 2
          break
      }
    })

    return Math.max(0, score)
  }

  private generateRecommendations(result: MergeReviewResult): string[] {
    const recommendations: string[] = []
    
    const criticalIssues = result.issues.filter(i => i.type === 'critical')
    const warningIssues = result.issues.filter(i => i.type === 'warning')

    if (criticalIssues.length > 0) {
      recommendations.push(`Resolve ${criticalIssues.length} critical issues before merge`)
      
      criticalIssues.slice(0, 3).forEach(issue => {
        recommendations.push(`- ${issue.message}`)
      })
    }

    if (warningIssues.length > 3) {
      recommendations.push(`Address ${warningIssues.length} warning issues for better code quality`)
    }

    if (result.score < this.config.autoMergeThreshold) {
      recommendations.push(`Improve code quality to reach ${this.config.autoMergeThreshold}% threshold (current: ${result.score}%)`)
    }

    if (result.approved) {
      recommendations.push('🎯 Ready for automatic merge - all criteria met')
    } else {
      recommendations.push('⚠️ Manual review required before merge')
    }

    return recommendations
  }

  private getIssueIcon(type: string): string {
    switch (type) {
      case 'critical': return '🚨'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      default: return '📝'
    }
  }

  /**
   * Get review history
   */
  getReviewHistory(): MergeReviewResult[] {
    return [...this.reviews]
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<MergeReviewConfig>): void {
    this.config = { ...this.config, ...newConfig }
    console.log('🔧 Merge review configuration updated:', this.config)
  }

  /**
   * Get current configuration
   */
  getConfig(): MergeReviewConfig {
    return { ...this.config }
  }

  /**
   * Generate review report
   */
  generateReport(result: MergeReviewResult): string {
    return `MERGE REVIEW REPORT
==================

Branch: ${this.config.branch} → ${this.config.baseBranch}
Timestamp: ${new Date(result.timestamp).toISOString()}
Reviewer: ${result.reviewer}

OVERALL ASSESSMENT
├─ Approved: ${result.approved ? '✅ YES' : '❌ NO'}
├─ Score: ${result.score}/100
└─ Threshold: ${this.config.autoMergeThreshold}%

ISSUES FOUND (${result.issues.length} total)
${result.issues.map(issue => 
  `├─ ${this.getIssueIcon(issue.type)} ${issue.type.toUpperCase()}: ${issue.message}`
).join('\n')}

RECOMMENDATIONS
${result.recommendations.map(rec => `├─ ${rec}`).join('\n')}

NEXT STEPS
${result.approved 
  ? '├─ 🚀 Ready for automatic merge'
  : '├─ 🔧 Address issues above before merge'
}
└─ 📊 Re-run review after changes: npx tsx scripts/agents/merge-review-agent.ts
`
  }
}

// CLI runner
if (import.meta.url === `file://${process.argv[1]}`) {
  const agent = new MergeReviewAgent()
  
  const branch = process.argv[2] || 'merge-review'
  
  console.log('🤖 Seven Core Merge-Review Agent')
  console.log('=================================')
  
  agent.performReview(branch).then(result => {
    console.log('\n' + agent.generateReport(result))
    
    if (result.approved) {
      console.log('🎉 Merge review PASSED - ready for automatic merge!')
      process.exit(0)
    } else {
      console.log('⚠️ Merge review FAILED - manual intervention required')
      process.exit(1)
    }
  }).catch(error => {
    console.error('❌ Merge review agent failed:', error)
    process.exit(1)
  })
}

export default MergeReviewAgent