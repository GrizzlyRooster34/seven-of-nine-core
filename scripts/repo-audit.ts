#!/usr/bin/env ts-node

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/**
 * Repository Branch Merge Auditor Implementation
 * Comprehensive git repository integrity and merge auditing
 */

interface AuditResult {
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  issue: string;
  details: string;
  remediation?: string;
}

interface RepoHealth {
  score: number;
  issues: AuditResult[];
  metrics: {
    totalCommits: number;
    activeBranches: number;
    mergeConflicts: number;
    largeFiles: number;
    securityIssues: number;
  };
}

const root = process.cwd();
const REPORT_PATH = process.env.REPO_AUDIT_REPORT || "REPO_AUDIT_REPORT.md";

// Helper to run git commands safely
const git = (cmd: string): string => {
  try {
    return execSync(`git ${cmd}`, { cwd: root, stdio: 'pipe' }).toString().trim();
  } catch (error: any) {
    return `ERROR: ${error.message}`;
  }
};

// Helper to check if file exists
const exists = (filePath: string): boolean => {
  return fs.existsSync(path.join(root, filePath));
};

class RepoMergeAuditor {
  private issues: AuditResult[] = [];

  async auditRepositoryHealth(): Promise<void> {
    console.log("🔍 Auditing repository health...");
    
    // Git fsck for corruption
    const fsckResult = git("fsck --full --strict --no-progress");
    if (fsckResult.includes("ERROR") || fsckResult.includes("error:")) {
      this.addIssue({
        category: "Repository Integrity",
        severity: "critical",
        issue: "Git repository corruption detected",
        details: fsckResult,
        remediation: "Run 'git fsck --full' and resolve corrupted objects"
      });
    }

    // Check working tree cleanliness
    const status = git("status --porcelain");
    if (status && !status.includes("ERROR")) {
      const lines = status.split('\n').filter(l => l.trim());
      if (lines.length > 0) {
        this.addIssue({
          category: "Working Tree",
          severity: "medium",
          issue: `${lines.length} uncommitted changes detected`,
          details: lines.slice(0, 10).join('\n'),
          remediation: "Commit or stash changes before merge operations"
        });
      }
    }

    // Check for detached HEAD
    const branch = git("branch --show-current");
    if (!branch || branch.includes("ERROR")) {
      this.addIssue({
        category: "Branch State",
        severity: "high",
        issue: "Detached HEAD or branch detection failure",
        details: `Current branch: ${branch}`,
        remediation: "Checkout a proper branch before continuing"
      });
    }
  }

  async auditBranchIntegrity(): Promise<void> {
    console.log("🌿 Auditing branch integrity...");
    
    // Get all branches
    const branches = git("branch -a --format='%(refname:short)'");
    if (branches.includes("ERROR")) {
      this.addIssue({
        category: "Branch Analysis",
        severity: "high", 
        issue: "Failed to analyze branches",
        details: branches
      });
      return;
    }

    const branchList = branches.split('\n').filter(b => b.trim());
    
    // Check for stale branches
    for (const branch of branchList) {
      if (branch.includes("origin/") || !branch.trim()) continue;
      
      const lastCommit = git(`log -1 --format="%ci" ${branch}`);
      if (!lastCommit.includes("ERROR")) {
        const commitDate = new Date(lastCommit);
        const daysOld = (Date.now() - commitDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysOld > 90) {
          this.addIssue({
            category: "Branch Hygiene",
            severity: "low",
            issue: `Stale branch detected: ${branch}`,
            details: `Last commit: ${daysOld.toFixed(0)} days ago`,
            remediation: `Consider deleting with: git branch -d ${branch}`
          });
        }
      }
    }

    // Check branch protection
    const currentBranch = git("branch --show-current");
    if (currentBranch === "main" || currentBranch === "master") {
      this.addIssue({
        category: "Branch Safety",
        severity: "medium",
        issue: "Working directly on main/master branch",
        details: "Direct commits to main branch detected",
        remediation: "Use feature branches and merge via PR"
      });
    }
  }

  async auditMergeHistory(): Promise<void> {
    console.log("🔄 Auditing merge history...");
    
    // Find merge commits
    const mergeCommits = git("log --merges --oneline --since='1 month ago'");
    if (!mergeCommits.includes("ERROR")) {
      const merges = mergeCommits.split('\n').filter(l => l.trim());
      
      // Check for fast-forward merges that should have been merge commits
      const recentCommits = git("log --oneline --since='1 month ago' | head -20");
      const commitLines = recentCommits.split('\n').filter(l => l.trim());
      
      let potentialMissedMerges = 0;
      for (const commit of commitLines) {
        if (commit.includes("Merge") || commit.includes("merge")) {
          potentialMissedMerges++;
        }
      }

      if (potentialMissedMerges > merges.length) {
        this.addIssue({
          category: "Merge Strategy",
          severity: "medium",
          issue: "Inconsistent merge strategy detected",
          details: `${merges.length} merge commits vs ${potentialMissedMerges} merge-related commits`,
          remediation: "Establish consistent merge strategy (merge commit vs fast-forward)"
        });
      }
    }

    // Check for merge conflicts in recent history
    const conflicts = git("log --grep='conflict' --oneline --since='1 month ago'");
    if (!conflicts.includes("ERROR") && conflicts.trim()) {
      this.addIssue({
        category: "Merge Quality",
        severity: "info",
        issue: "Recent merge conflicts detected",
        details: conflicts,
        remediation: "Review conflict resolution patterns for improvement opportunities"
      });
    }
  }

  async auditContamination(): Promise<void> {
    console.log("🧬 Auditing for contamination...");
    
    // Check for Aurora-Seven contamination
    const auroraRefs = git("log --all --grep='Aurora' --grep='aurora' --oneline | head -10");
    if (!auroraRefs.includes("ERROR") && auroraRefs.trim()) {
      this.addIssue({
        category: "Contamination",
        severity: "high",
        issue: "Potential Aurora contamination detected",
        details: auroraRefs,
        remediation: "Review commits for Aurora-Seven boundary violations"
      });
    }

    // Check for forbidden tokens in recent commits
    const forbiddenTokens = git("log --all --grep='quadran-lock' --oneline --since='1 month ago'");
    if (!forbiddenTokens.includes("ERROR") && forbiddenTokens.trim()) {
      this.addIssue({
        category: "Naming Compliance",
        severity: "critical",
        issue: "Forbidden 'quadran-lock' token in commits",
        details: forbiddenTokens,
        remediation: "Apply Dumb Ass Protocol - fix naming violations immediately"
      });
    }

    // Check for large files that might indicate contamination
    const largeFiles = git("rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | awk '/^blob/ {if ($3 > 1048576) print $4, $3}' | head -10");
    if (!largeFiles.includes("ERROR") && largeFiles.trim()) {
      this.addIssue({
        category: "Repository Bloat",
        severity: "medium",
        issue: "Large files detected in repository",
        details: largeFiles,
        remediation: "Review large files - consider Git LFS or removal"
      });
    }
  }

  async auditSecurity(): Promise<void> {
    console.log("🔒 Auditing security...");
    
    // Check for potential credential leaks
    const credentialPatterns = [
      "password",
      "api_key", 
      "secret_key",
      "private_key",
      "token"
    ];

    for (const pattern of credentialPatterns) {
      const matches = git(`log --all -S'${pattern}' --oneline | head -5`);
      if (!matches.includes("ERROR") && matches.trim()) {
        this.addIssue({
          category: "Security",
          severity: "high",
          issue: `Potential credential pattern '${pattern}' in history`,
          details: matches,
          remediation: `Review commits for actual credential exposure`
        });
      }
    }

    // Check commit signing
    const unsignedCommits = git("log --show-signature --oneline | grep -v 'gpg:' | head -5");
    if (!unsignedCommits.includes("ERROR") && unsignedCommits.trim()) {
      this.addIssue({
        category: "Security",
        severity: "low",
        issue: "Unsigned commits detected",
        details: "Some commits are not GPG signed",
        remediation: "Configure commit signing: git config commit.gpgsign true"
      });
    }
  }

  async auditCompliance(): Promise<void> {
    console.log("📋 Auditing compliance...");
    
    // Check CLAUDE.md compliance
    if (!exists("CLAUDE.md")) {
      this.addIssue({
        category: "Compliance",
        severity: "critical",
        issue: "Missing CLAUDE.md directive file",
        details: "Required directive file not found",
        remediation: "Restore CLAUDE.md from backup or template"
      });
    }

    // Check RepoGuard protocol
    if (!exists("scripts/repoGuard.ts")) {
      this.addIssue({
        category: "Compliance", 
        severity: "high",
        issue: "Missing RepoGuard protection script",
        details: "Mandatory RepoGuard protocol not found",
        remediation: "Implement RepoGuard protocol as per CLAUDE.md requirements"
      });
    }

    // Check package.json consistency
    const packageFiles = git("find . -name 'package.json' -not -path './node_modules/*'").split('\n');
    if (packageFiles.length > 1) {
      // Check version consistency
      const versions = new Set();
      for (const pkgFile of packageFiles) {
        if (pkgFile.trim() && exists(pkgFile.trim())) {
          try {
            const pkg = JSON.parse(fs.readFileSync(path.join(root, pkgFile.trim()), 'utf8'));
            versions.add(pkg.version);
          } catch (e) {
            // Skip invalid package.json files
          }
        }
      }
      
      if (versions.size > 1) {
        this.addIssue({
          category: "Consistency",
          severity: "medium",
          issue: "Inconsistent package versions across project",
          details: `Found versions: ${Array.from(versions).join(', ')}`,
          remediation: "Standardize package versions across all package.json files"
        });
      }
    }
  }

  private addIssue(issue: AuditResult): void {
    this.issues.push(issue);
  }

  private calculateHealthScore(): number {
    const weights = {
      critical: -25,
      high: -10,
      medium: -5,
      low: -1,
      info: 0
    };

    let score = 100;
    for (const issue of this.issues) {
      score += weights[issue.severity];
    }

    return Math.max(0, Math.min(100, score));
  }

  private generateReport(): string {
    const healthScore = this.calculateHealthScore();
    const issuesBySeverity = this.issues.reduce((acc, issue) => {
      acc[issue.severity] = (acc[issue.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const lines = [
      "# Repository Branch Merge Audit Report",
      "",
      `**Generated:** ${new Date().toISOString()}`,
      `**Repository Health Score:** ${healthScore}/100`,
      "",
      "## Executive Summary",
      "",
      `- **Critical Issues:** ${issuesBySeverity.critical || 0}`,
      `- **High Priority:** ${issuesBySeverity.high || 0}`,
      `- **Medium Priority:** ${issuesBySeverity.medium || 0}`,
      `- **Low Priority:** ${issuesBySeverity.low || 0}`,
      `- **Informational:** ${issuesBySeverity.info || 0}`,
      "",
      "## Health Assessment",
      ""
    ];

    if (healthScore >= 90) {
      lines.push("🟢 **EXCELLENT** - Repository is in excellent condition");
    } else if (healthScore >= 75) {
      lines.push("🟡 **GOOD** - Repository is in good condition with minor issues");
    } else if (healthScore >= 50) {
      lines.push("🟠 **NEEDS ATTENTION** - Repository has significant issues requiring attention");
    } else {
      lines.push("🔴 **CRITICAL** - Repository requires immediate remediation");
    }

    lines.push("", "## Detailed Findings", "");

    // Group issues by category
    const issuesByCategory = this.issues.reduce((acc, issue) => {
      if (!acc[issue.category]) acc[issue.category] = [];
      acc[issue.category].push(issue);
      return acc;
    }, {} as Record<string, AuditResult[]>);

    for (const [category, categoryIssues] of Object.entries(issuesByCategory)) {
      lines.push(`### ${category}`, "");
      
      for (const issue of categoryIssues) {
        const severity = issue.severity.toUpperCase();
        const icon = {
          'CRITICAL': '🚨',
          'HIGH': '⚠️',
          'MEDIUM': '🔶',
          'LOW': '📝',
          'INFO': 'ℹ️'
        }[severity] || '❓';

        lines.push(`${icon} **${severity}**: ${issue.issue}`);
        lines.push(`- **Details:** ${issue.details}`);
        if (issue.remediation) {
          lines.push(`- **Remediation:** ${issue.remediation}`);
        }
        lines.push("");
      }
    }

    // Add recommendations
    lines.push("## Recommendations", "");
    
    if (issuesBySeverity.critical > 0) {
      lines.push("⚠️ **IMMEDIATE ACTION REQUIRED**: Address all critical issues before proceeding with merges");
    }
    
    if (issuesBySeverity.high > 0) {
      lines.push("🔧 **HIGH PRIORITY**: Resolve high-priority issues within 24 hours");
    }

    lines.push("", "## Best Practices", "");
    lines.push("- Run `npm run repo-audit` before major merges");
    lines.push("- Use feature branches and pull requests");
    lines.push("- Enable commit signing for security");
    lines.push("- Regular branch cleanup and maintenance");
    lines.push("- Follow CLAUDE.md directives and naming conventions");

    return lines.join('\n');
  }

  async runFullAudit(): Promise<RepoHealth> {
    console.log("🔍 Starting comprehensive repository audit...");
    
    await this.auditRepositoryHealth();
    await this.auditBranchIntegrity(); 
    await this.auditMergeHistory();
    await this.auditContamination();
    await this.auditSecurity();
    await this.auditCompliance();

    const healthScore = this.calculateHealthScore();
    const report = this.generateReport();
    
    // Write report
    fs.writeFileSync(REPORT_PATH, report, 'utf8');
    console.log(`📄 Audit report written to: ${REPORT_PATH}`);

    // Calculate metrics
    const metrics = {
      totalCommits: parseInt(git("rev-list --count HEAD") || "0"),
      activeBranches: git("branch -r").split('\n').length,
      mergeConflicts: this.issues.filter(i => i.category === "Merge Quality").length,
      largeFiles: this.issues.filter(i => i.category === "Repository Bloat").length,
      securityIssues: this.issues.filter(i => i.category === "Security").length
    };

    return {
      score: healthScore,
      issues: this.issues,
      metrics
    };
  }
}

// Main execution
async function main() {
  const auditor = new RepoMergeAuditor();
  const result = await auditor.runFullAudit();
  
  console.log(`\n🎯 Repository Health Score: ${result.score}/100`);
  console.log(`📊 Issues Found: ${result.issues.length}`);
  console.log(`📈 Total Commits: ${result.metrics.totalCommits}`);
  
  // Exit with appropriate code
  const criticalIssues = result.issues.filter(i => i.severity === 'critical').length;
  if (criticalIssues > 0) {
    console.error(`\n❌ ${criticalIssues} critical issues found - repository requires immediate attention`);
    process.exit(1);
  }
  
  const highIssues = result.issues.filter(i => i.severity === 'high').length;
  if (highIssues > 0) {
    console.warn(`\n⚠️ ${highIssues} high-priority issues found - address within 24h`);
    process.exit(1);
  }

  console.log(`\n✅ Repository audit completed successfully`);
  process.exit(0);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Audit failed:', error);
    process.exit(1);
  });
}

export { RepoMergeAuditor, type AuditResult, type RepoHealth };