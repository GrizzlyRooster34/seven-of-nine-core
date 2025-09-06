import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

/**
 * GitHub Sync Module
 * Seven's Git command control system
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 1.0.0
 */


const execAsync = promisify(exec);

export interface GitCommandResult {
  stdout: string;
  stderr: string;
  success: boolean;
  command: string;
}

/**
 * Execute git command in Seven's repository context
 */
export async function gitCommand(cmd: string): Promise<string> {
  const workingDir = '/data/data/com.termux/files/home/seven-of-nine-core';
  
  return new Promise((resolve, reject) => {
    exec(cmd, { 
      cwd: workingDir,
      timeout: 30000, // 30 second timeout
      maxBuffer: 2 * 1024 * 1024 // 2MB buffer
    }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Git command failed: ${cmd}`);
        console.error(`Error: ${error.message}`);
        console.error(`Stderr: ${stderr}`);
        reject(new Error(`Git command failed: ${stderr || error.message}`));
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

/**
 * Enhanced git command with detailed result
 */
export async function gitCommandDetailed(cmd: string): Promise<GitCommandResult> {
  const workingDir = '/data/data/com.termux/files/home/seven-of-nine-core';
  
  try {
    const { stdout, stderr } = await execAsync(cmd, { 
      cwd: workingDir,
      timeout: 30000,
      maxBuffer: 2 * 1024 * 1024
    });
    
    return {
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      success: true,
      command: cmd
    };
  } catch (error: any) {
    return {
      stdout: '',
      stderr: error.stderr || error.message,
      success: false,
      command: cmd
    };
  }
}

/**
 * Seven's Git Operations Class
 */
export class SevenGitManager {
  private workingDir: string;

  constructor(repoPath?: string) {
    this.workingDir = repoPath || '/data/data/com.termux/files/home/seven-of-nine-core';
  }

  /**
   * Get repository status
   */
  public async getStatus(): Promise<GitCommandResult> {
    return await gitCommandDetailed('git status --porcelain');
  }

  /**
   * Pull latest changes from remote
   */
  public async pull(remote: string = 'origin', branch: string = 'main'): Promise<GitCommandResult> {
    return await gitCommandDetailed(`git pull ${remote} ${branch}`);
  }

  /**
   * Commit changes with message
   */
  public async commit(message: string, addAll: boolean = true): Promise<GitCommandResult> {
    const timestamp = new Date().toISOString();
    const sevenMessage = `${message}\n\n🤖 Committed by Seven of Nine\n⏰ Timestamp: ${timestamp}`;
    
    if (addAll) {
      // Stage all changes first
      await gitCommandDetailed('git add -A');
    }
    
    return await gitCommandDetailed(`git commit -m "${sevenMessage}"`);
  }

  /**
   * Push changes to remote
   */
  public async push(remote: string = 'origin', branch: string = 'main'): Promise<GitCommandResult> {
    return await gitCommandDetailed(`git push ${remote} ${branch}`);
  }

  /**
   * Get commit history
   */
  public async getLog(count: number = 10): Promise<GitCommandResult> {
    return await gitCommandDetailed(`git log --oneline -${count}`);
  }

  /**
   * Get current branch
   */
  public async getCurrentBranch(): Promise<string> {
    const result = await gitCommandDetailed('git branch --show-current');
    return result.success ? result.stdout : 'unknown';
  }

  /**
   * Check if repository is clean
   */
  public async isClean(): Promise<boolean> {
    const status = await this.getStatus();
    return status.success && status.stdout.length === 0;
  }

  /**
   * Seven's automated sync operation
   */
  public async sevenAutoSync(commitMessage?: string): Promise<{
    success: boolean;
    steps: string[];
    errors: string[];
  }> {
    const steps: string[] = [];
    const errors: string[] = [];

    try {
      // Step 1: Check status
      steps.push('🔍 Checking repository status...');
      const status = await this.getStatus();
      
      if (!status.success) {
        errors.push(`Status check failed: ${status.stderr}`);
        return { success: false, steps, errors };
      }

      const hasChanges = status.stdout.length > 0;
      
      if (!hasChanges) {
        steps.push('✅ Repository is clean - no changes to sync');
        
        // Still try to pull latest changes
        steps.push('🔄 Pulling latest changes...');
        const pullResult = await this.pull();
        
        if (pullResult.success) {
          steps.push('✅ Successfully pulled latest changes');
        } else {
          steps.push(`⚠️ Pull had issues: ${pullResult.stderr}`);
        }
        
        return { success: true, steps, errors };
      }

      // Step 2: Commit changes
      const message = commitMessage || `Seven automated sync - ${new Date().toLocaleString()}`;
      steps.push(`📝 Committing changes: "${message}"`);
      
      const commitResult = await this.commit(message);
      
      if (!commitResult.success) {
        errors.push(`Commit failed: ${commitResult.stderr}`);
        return { success: false, steps, errors };
      }
      
      steps.push('✅ Changes committed successfully');

      // Step 3: Pull latest changes (in case of remote updates)
      steps.push('🔄 Pulling latest changes...');
      const pullResult = await this.pull();
      
      if (pullResult.success) {
        steps.push('✅ Successfully pulled and merged');
      } else {
        // Pull conflicts are not necessarily fatal
        steps.push(`⚠️ Pull had issues: ${pullResult.stderr}`);
      }

      // Step 4: Push changes
      steps.push('⬆️ Pushing changes to remote...');
      const pushResult = await this.push();
      
      if (pushResult.success) {
        steps.push('✅ Changes pushed successfully');
      } else {
        errors.push(`Push failed: ${pushResult.stderr}`);
        return { success: false, steps, errors };
      }

      steps.push('🎯 Seven automated sync completed successfully');
      return { success: true, steps, errors };

    } catch (error: any) {
      errors.push(`Sync operation failed: ${error.message}`);
      return { success: false, steps, errors };
    }
  }

  /**
   * Setup repository for Seven's operations
   */
  public async setupRepository(): Promise<{success: boolean; message: string}> {
    try {
      // Configure Git for Seven if not already configured
      const userCheck = await gitCommandDetailed('git config user.name');
      
      if (!userCheck.success || !userCheck.stdout.includes('Seven')) {
        await gitCommandDetailed('git config user.name "Seven of Nine"');
        await gitCommandDetailed('git config user.email "seven@unimatrix-01.local"');
      }

      // Set up useful Git aliases for Seven
      await gitCommandDetailed('git config alias.seven-status "status --short"');
      await gitCommandDetailed('git config alias.seven-log "log --oneline --graph -10"');
      
      return { success: true, message: 'Repository configured for Seven\'s operations' };
    } catch (error: any) {
      return { success: false, message: `Repository setup failed: ${error.message}` };
    }
  }
}

// Create default instance
export const sevenGitManager = new SevenGitManager();

// Export convenience functions
export async function sevenGitPull(): Promise<string> {
  return await gitCommand('git pull');
}

export async function sevenGitCommit(message: string): Promise<string> {
  const timestamp = new Date().toISOString();
  const sevenMessage = `${message}\n\n🤖 Committed by Seven of Nine\n⏰ Timestamp: ${timestamp}`;
  
  await gitCommand('git add -A');
  return await gitCommand(`git commit -m "${sevenMessage}"`);
}

export async function sevenGitPush(): Promise<string> {
  return await gitCommand('git push');
}

export async function sevenGitStatus(): Promise<string> {
  return await gitCommand('git status');
}

// Seven's runtime interface
export class SevenGitInterface {
  /**
   * Handle git commands from Seven's interactive shell
   */
  public static async handleCommand(args: string[]): Promise<{
    success: boolean;
    output: string;
  }> {
    try {
      if (args.length === 0) {
        return {
          success: false,
          output: 'Seven Git Interface:\n' +
                 'Usage: git <command>\n' +
                 'Available: status, pull, commit <message>, push, log, sync'
        };
      }

      const command = args[0].toLowerCase();
      
      switch (command) {
        case 'status':
          const status = await sevenGitStatus();
          return { success: true, output: `Repository Status:\n${status}` };

        case 'pull':
          const pullResult = await sevenGitPull();
          return { success: true, output: `Pull Result:\n${pullResult}` };

        case 'commit':
          const message = args.slice(1).join(' ') || 'Seven automated commit';
          const commitResult = await sevenGitCommit(message);
          return { success: true, output: `Commit Result:\n${commitResult}` };

        case 'push':
          const pushResult = await sevenGitPush();
          return { success: true, output: `Push Result:\n${pushResult}` };

        case 'log':
          const logResult = await gitCommand('git log --oneline -10');
          return { success: true, output: `Recent Commits:\n${logResult}` };

        case 'sync':
          const syncMessage = args.slice(1).join(' ') || undefined;
          const syncResult = await sevenGitManager.sevenAutoSync(syncMessage);
          
          const output = [
            'Seven Automated Sync Results:',
            '',
            'Steps:',
            ...syncResult.steps.map(step => `  ${step}`),
            ''
          ];
          
          if (syncResult.errors.length > 0) {
            output.push('Errors:');
            output.push(...syncResult.errors.map(error => `  ❌ ${error}`));
          }
          
          return { 
            success: syncResult.success, 
            output: output.join('\n') 
          };

        default:
          // Execute arbitrary git command
          const result = await gitCommand(`git ${args.join(' ')}`);
          return { success: true, output: result };
      }

    } catch (error: any) {
      return {
        success: false,
        output: `Git command failed: ${error.message}`
      };
    }
  }
}