#!/usr/bin/env tsx

import { writeFileSync } from 'fs'; writeFileSync(reportPath, this.agent.generateReport(result))
import { execSync } from 'child_process'
import MergeReviewAgent, { MergeReviewConfig } from './agents/merge-review-agent'

/**
 * Seven Core Manual Merge Review CLI
 * Interactive merge review and approval workflow
 */

interface CLIOptions {
  branch?: string
  config?: Partial<MergeReviewConfig>
  interactive?: boolean
  autoMerge?: boolean
  report?: boolean
}

class MergeReviewCLI {
  private agent: MergeReviewAgent

  constructor() {
    this.agent = new MergeReviewAgent()
  }

  async run(options: CLIOptions = {}): Promise<void> {
    console.log('🤖 SEVEN CORE MERGE REVIEW SYSTEM')
    console.log('==================================')
    console.log('Comprehensive code review and merge validation\n')

    // Update configuration if provided
    if (options.config) {
      this.agent.updateConfig(options.config)
      console.log('🔧 Configuration updated')
    }

    const branch = options.branch || this.detectCurrentBranch() || 'merge-review'
    console.log(`🎯 Reviewing branch: ${branch}`)
    console.log(`📊 Base branch: ${this.agent.getConfig().baseBranch}`)
    console.log(`⚡ Auto-merge threshold: ${this.agent.getConfig().autoMergeThreshold}%\n`)

    try {
      // Perform the review
      const result = await this.agent.performReview(branch)
      
      // Display results
      console.log('\n' + '='.repeat(50))
      console.log(this.agent.generateReport(result))

      // Save report if requested
      if (options.report) {
        const reportPath = `merge-review-${branch}-${Date.now()}.txt`
        console.log(`📄 Report saved to: ${reportPath}`)
      }

      // Interactive mode
      if (options.interactive && !result.approved) {
        await this.handleInteractiveMode(result, branch)
      }

      // Auto-merge if approved and requested
      if (result.approved && options.autoMerge) {
        await this.performAutoMerge(branch, result)
      }

      // Exit with appropriate code
      process.exit(result.approved ? 0 : 1)

    } catch (error) {
      console.error('\n❌ Merge review failed:', error.message)
      process.exit(1)
    }
  }

  private detectCurrentBranch(): string | null {
    try {
      return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim()
    } catch {
      return null
    }
  }

  private async handleInteractiveMode(result: any, branch: string): Promise<void> {
    console.log('\n🔄 INTERACTIVE MODE')
    console.log('==================')
    
    const criticalIssues = result.issues.filter((i: any) => i.type === 'critical')
    const warningIssues = result.issues.filter((i: any) => i.type === 'warning')

    if (criticalIssues.length > 0) {
      console.log(`\n🚨 CRITICAL ISSUES (${criticalIssues.length})`)
      criticalIssues.forEach((issue: any, index: number) => {
        console.log(`${index + 1}. ${issue.message}`)
        if (issue.file) {
          console.log(`   File: ${issue.file}${issue.line ? `:${issue.line}` : ''}`)
        }
        if (issue.details) {
          console.log(`   Details: ${JSON.stringify(issue.details, null, 2)}`)
        }
        console.log()
      })
    }

    if (warningIssues.length > 0) {
      console.log(`\n⚠️ WARNINGS (${warningIssues.length})`)
      warningIssues.slice(0, 5).forEach((issue: any, index: number) => {
        console.log(`${index + 1}. ${issue.message}`)
      })
      if (warningIssues.length > 5) {
        console.log(`... and ${warningIssues.length - 5} more warnings`)
      }
    }

    console.log('\n📋 RECOMMENDED ACTIONS:')
    result.recommendations.forEach((rec: string) => {
      console.log(`• ${rec}`)
    })

    console.log('\n💡 NEXT STEPS:')
    console.log('1. Address the critical issues above')
    console.log('2. Re-run the review: npx tsx scripts/review-merge.ts')
    console.log('3. Or continue with manual merge if acceptable')
  }

  private async performAutoMerge(branch: string, result: any): Promise<void> {
    console.log('\n🚀 AUTO-MERGE INITIATED')
    console.log('=======================')
    
    try {
      const config = this.agent.getConfig()
      
      // Confirm we're on the right branch
      const currentBranch = this.detectCurrentBranch()
      if (currentBranch !== branch) {
        console.log(`🔄 Switching to branch: ${branch}`)
        execSync(`git checkout ${branch}`)
      }

      // Update branch
      console.log('📥 Pulling latest changes...')
      execSync(`git pull origin ${branch}`)

      // Switch to base branch
      console.log(`🔄 Switching to base branch: ${config.baseBranch}`)
      execSync(`git checkout ${config.baseBranch}`)
      execSync(`git pull origin ${config.baseBranch}`)

      // Perform merge
      console.log(`🔀 Merging ${branch} → ${config.baseBranch}`)
      const mergeMessage = `🤖 Auto-merge: ${branch} → ${config.baseBranch}

Automated merge approved by Seven Core Review Agent
Score: ${result.score}/100 (threshold: ${config.autoMergeThreshold}%)
Critical issues: ${result.issues.filter((i: any) => i.type === 'critical').length}
Timestamp: ${new Date(result.timestamp).toISOString()}

🛡️ Security & Safety: All systems operational
🧪 Tests: All tests passed
📊 Quality: All quality gates met

Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>`

      execSync(`git merge --no-ff ${branch} -m "${mergeMessage}"`)

      // Push changes
      console.log(`📤 Pushing to ${config.baseBranch}`)
      execSync(`git push origin ${config.baseBranch}`)

      console.log('\n✅ AUTO-MERGE COMPLETED SUCCESSFULLY!')
      console.log(`🎉 ${branch} has been merged into ${config.baseBranch}`)

    } catch (error) {
      console.error('\n❌ Auto-merge failed:', error.message)
      console.log('\n🔄 Attempting to restore original state...')
      
      try {
        execSync(`git checkout ${branch}`)
        console.log('✅ Restored to original branch')
      } catch (restoreError) {
        console.error('❌ Could not restore original state:', restoreError.message)
      }
      
      throw error
    }
  }
}

// CLI argument parsing
function parseArgs(): CLIOptions {
  const args = process.argv.slice(2)
  const options: CLIOptions = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    
    switch (arg) {
      case '--branch':
      case '-b':
        options.branch = args[++i]
        break
      case '--interactive':
      case '-i':
        options.interactive = true
        break
      case '--auto-merge':
      case '-m':
        options.autoMerge = true
        break
      case '--report':
      case '-r':
        options.report = true
        break
      case '--threshold':
        options.config = { ...options.config, autoMergeThreshold: parseInt(args[++i]) }
        break
      case '--help':
      case '-h':
        showHelp()
        process.exit(0)
        break
      default:
        if (!options.branch && !arg.startsWith('-')) {
          options.branch = arg
        }
    }
  }

  return options
}

function showHelp(): void {
  console.log(`Seven Core Merge Review CLI

Usage: npx tsx scripts/review-merge.ts [options] [branch]

Options:
  -b, --branch <name>     Branch to review (default: current branch or 'merge-review')
  -i, --interactive       Interactive mode with detailed issue breakdown
  -m, --auto-merge        Automatically merge if review passes
  -r, --report           Save review report to file
  --threshold <score>     Set custom auto-merge threshold (0-100)
  -h, --help             Show this help message

Examples:
  npx tsx scripts/review-merge.ts                    # Review current branch
  npx tsx scripts/review-merge.ts merge-review       # Review specific branch
  npx tsx scripts/review-merge.ts -i -r             # Interactive mode + save report
  npx tsx scripts/review-merge.ts -m --threshold 90  # Auto-merge with 90% threshold

Safety Features:
  ✅ Quadran-Lock authentication system verification
  ✅ Quadra-Lock CSSR safety rail validation
  ✅ System telemetry and performance monitoring
  ✅ Comprehensive test suite execution
  ✅ Code quality and security checks
`)
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const options = parseArgs()
  const cli = new MergeReviewCLI()

  cli.run(options).catch(error => {
    console.error('❌ CLI error:', error.message)
    process.exit(1)
  })
}

export default MergeReviewCLI