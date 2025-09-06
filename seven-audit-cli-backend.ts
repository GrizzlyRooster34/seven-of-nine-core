import { exec } from 'child_process';
import { join } from 'path';
import { promises as fs } from 'fs';
import { promisify } from 'util';

#!/usr/bin/env npx tsx
/**
 * SEVEN CLI BACKEND AUDIT COMMAND
 * Temporary command for health checking all CLI backend providers
 * 
 * Usage: npx tsx seven-audit-cli-backend.ts [--dry-run]
 */


const execAsync = promisify(exec);

interface ProviderHealthResult {
  name: string;
  status: 'healthy' | 'unhealthy' | 'not-found';
  details: string;
  responseTime?: number;
  error?: string;
}

class SevenCLIBackendAuditor {
  private dryRun: boolean = false;

  constructor(dryRun: boolean = false) {
    this.dryRun = dryRun;
  }

  /**
   * Check Ollama provider health
   */
  async checkOllamaHealth(): Promise<ProviderHealthResult> {
    const startTime = Date.now();
    
    try {
      if (this.dryRun) {
        return {
          name: 'ollama',
          status: 'healthy',
          details: 'DRY RUN: Would check http://localhost:11434/api/tags',
          responseTime: 0
        };
      }

      // Check if Ollama server is running
      const response = await fetch('http://localhost:11434/api/tags', {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      if (response.ok) {
        const responseTime = Date.now() - startTime;
        const data = await response.json();
        return {
          name: 'ollama',
          status: 'healthy',
          details: `Server running, ${data.models?.length || 0} models available`,
          responseTime
        };
      } else {
        return {
          name: 'ollama',
          status: 'unhealthy',
          details: `HTTP ${response.status}: ${response.statusText}`,
          responseTime: Date.now() - startTime
        };
      }
    } catch (error: any) {
      return {
        name: 'ollama',
        status: 'unhealthy',
        details: 'Connection failed - server not running?',
        error: error.message,
        responseTime: Date.now() - startTime
      };
    }
  }

  /**
   * Check Claude Code provider health
   */
  async checkClaudeCodeHealth(): Promise<ProviderHealthResult> {
    const startTime = Date.now();
    
    try {
      if (this.dryRun) {
        return {
          name: 'claude-code',
          status: 'healthy',
          details: 'DRY RUN: Would execute claude --version',
          responseTime: 0
        };
      }

      const { stdout, stderr } = await execAsync('claude --version', {
        timeout: 10000 // 10 second timeout
      });

      const responseTime = Date.now() - startTime;
      
      if (stdout.includes('claude')) {
        return {
          name: 'claude-code',
          status: 'healthy',
          details: `Available: ${stdout.trim()}`,
          responseTime
        };
      } else {
        return {
          name: 'claude-code', 
          status: 'unhealthy',
          details: 'Version command succeeded but unexpected output',
          error: stderr || 'No version info',
          responseTime
        };
      }
    } catch (error: any) {
      return {
        name: 'claude-code',
        status: 'not-found',
        details: 'Claude Code not installed or not in PATH',
        error: error.message,
        responseTime: Date.now() - startTime
      };
    }
  }

  /**
   * Check GitHub integration health
   */
  async checkGitHubHealth(): Promise<ProviderHealthResult> {
    const startTime = Date.now();
    
    try {
      if (this.dryRun) {
        return {
          name: 'github',
          status: 'healthy',
          details: 'DRY RUN: Would check git version and remote status',
          responseTime: 0
        };
      }

      // Check git availability
      const { stdout: gitVersion } = await execAsync('git --version', {
        timeout: 5000
      });

      // Check if we're in a git repository
      const { stdout: remoteUrl } = await execAsync('git remote get-url origin', {
        timeout: 5000,
        cwd: process.cwd()
      });

      const responseTime = Date.now() - startTime;
      const isGitHub = remoteUrl.includes('github.com');

      return {
        name: 'github',
        status: isGitHub ? 'healthy' : 'unhealthy',
        details: isGitHub 
          ? `Git available, GitHub remote configured: ${remoteUrl.trim()}`
          : `Git available (${gitVersion.trim()}) but no GitHub remote`,
        responseTime
      };

    } catch (error: any) {
      return {
        name: 'github',
        status: 'unhealthy',
        details: 'Git not available or not in git repository',
        error: error.message,
        responseTime: Date.now() - startTime
      };
    }
  }

  /**
   * Check Open SWE integration health
   */
  async checkOpenSWEHealth(): Promise<ProviderHealthResult> {
    return {
      name: 'open-swe',
      status: 'not-found',
      details: 'No Open SWE integration implemented',
      responseTime: 0
    };
  }

  /**
   * Check security middleware health
   */
  async checkSecurityMiddleware(): Promise<ProviderHealthResult> {
    try {
      // Check if security middleware file exists
      const middlewarePath = join(process.cwd(), 'seven-runtime', 'security_middleware.ts');
      await fs.access(middlewarePath);
      
      return {
        name: 'security-middleware',
        status: 'healthy',
        details: '5-layer security pipeline available',
        responseTime: 0
      };
    } catch (error: any) {
      return {
        name: 'security-middleware',
        status: 'not-found',
        details: 'Security middleware file not found',
        error: error.message,
        responseTime: 0
      };
    }
  }

  /**
   * Run complete health check suite
   */
  async runHealthChecks(): Promise<void> {
    console.log('🔍 SEVEN CLI BACKEND HEALTH AUDIT');
    console.log('=' .repeat(50));
    
    if (this.dryRun) {
      console.log('🧪 DRY RUN MODE - No actual connections will be made\n');
    }

    const checks = [
      this.checkOllamaHealth(),
      this.checkClaudeCodeHealth(),
      this.checkGitHubHealth(),
      this.checkOpenSWEHealth(),
      this.checkSecurityMiddleware()
    ];

    const results = await Promise.all(checks);

    // Display results
    for (const result of results) {
      const statusIcon = result.status === 'healthy' ? '✅' : 
                        result.status === 'unhealthy' ? '⚠️' : '❌';
      
      console.log(`${statusIcon} ${result.name.toUpperCase()}: ${result.status.toUpperCase()}`);
      console.log(`   ${result.details}`);
      
      if (result.responseTime !== undefined && result.responseTime > 0) {
        console.log(`   Response time: ${result.responseTime}ms`);
      }
      
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      console.log();
    }

    // Summary
    const healthyCount = results.filter(r => r.status === 'healthy').length;
    const totalCount = results.length;
    
    console.log('📊 SUMMARY');
    console.log(`   Healthy: ${healthyCount}/${totalCount} providers`);
    console.log(`   Audit report: docs/audits/cli_backend_integration_audit_2025-08-18.md`);
    console.log(`   Capabilities: docs/audits/cli_backend_capabilities_2025-08-18.json`);

    // Exit with appropriate code
    const hasUnhealthy = results.some(r => r.status === 'unhealthy');
    if (hasUnhealthy && !this.dryRun) {
      process.exit(1);
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  
  const auditor = new SevenCLIBackendAuditor(dryRun);
  await auditor.runHealthChecks();
}

// Handle script execution
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  });
}

export { SevenCLIBackendAuditor };