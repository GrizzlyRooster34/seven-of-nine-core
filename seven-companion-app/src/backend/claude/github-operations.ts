import { execSync, spawn } from 'child_process';
import { join } from 'path';
import { promises as fs } from 'fs';
import { EventEmitter } from 'events';
import simpleGit, { SimpleGit } from 'simple-git';
import { EncryptedCredentialVault } from './encrypted-vault.js';

/**
 * GITHUB OPERATIONS MANAGER
 * 
 * Handles all GitHub operations within Seven's companion app
 * Clone, commit, push, pull with full audit trail and sovereignty integration
 */


interface GitConfig {
  username: string;
  email: string;
  token?: string;
}

interface CommitOptions {
  message: string;
  addAuditTags?: boolean;
  createRollbackMarker?: boolean;
  files?: string[];
}

interface GitOperationResult {
  success: boolean;
  output?: string;
  error?: string;
  commitHash?: string;
  timestamp: string;
}

interface RepositoryStatus {
  branch: string;
  commits: number;
  modified: string[];
  staged: string[];
  untracked: string[];
  ahead: number;
  behind: number;
}

export class GitHubOperationsManager extends EventEmitter {
  private git: SimpleGit;
  private vault: EncryptedCredentialVault;
  private repoPath: string;
  private logFile: string;
  private auditTags: string[] = ['#DARPA-AUDIT', '#SOVEREIGNTY', '#QUADRA-LOCK', '#ROLLBACK'];

  constructor(repoPath: string, baseDir?: string) {
    super();
    this.repoPath = repoPath;
    this.git = simpleGit(repoPath);
    this.vault = new EncryptedCredentialVault(baseDir);
    
    const workingDir = baseDir || process.cwd();
    this.logFile = join(workingDir, 'consciousness-v4', 'sovereignty', 'logs', 'git-ops.md');
  }

  /**
   * INITIALIZE GIT OPERATIONS
   * Setup Git configuration and authentication
   */
  async initializeGitOps(masterPassword: string): Promise<boolean> {
    console.log('📂 GitHub Operations: Initializing...');
    
    try {
      // Unlock vault for GitHub token
      const vaultUnlocked = await this.vault.unlockVault(masterPassword);
      if (!vaultUnlocked) {
        throw new Error('Failed to unlock credential vault for GitHub operations');
      }
      
      // Setup Git configuration
      await this.setupGitConfig();
      
      // Configure authentication
      await this.setupAuthentication();
      
      console.log('✅ GitHub Operations initialized');
      await this.logGitOperation('git-init', 'GitHub operations initialized', { 
        success: true, 
        timestamp: new Date().toISOString() 
      });
      
      return true;
      
    } catch (error) {
      console.error('❌ GitHub Operations initialization failed:', error);
      await this.logGitOperation('git-init-failed', `Initialization failed: ${error.message}`, { 
        success: false, 
        error: error.message, 
        timestamp: new Date().toISOString() 
      });
      return false;
    } finally {
      this.vault.lockVault();
    }
  }

  /**
   * CLONE REPOSITORY
   * Clone a repository to specified location
   */
  async cloneRepository(repoUrl: string, targetPath: string): Promise<GitOperationResult> {
    console.log(`📥 Cloning repository: ${repoUrl}`);
    
    const result: GitOperationResult = {
      success: false,
      timestamp: new Date().toISOString()
    };
    
    try {
      // Ensure target directory doesn't exist or is empty
      try {
        await fs.rm(targetPath, { recursive: true, force: true });
      } catch {
        // Directory might not exist
      }
      
      // Clone repository
      await this.git.clone(repoUrl, targetPath);
      
      result.success = true;
      result.output = `Repository cloned to ${targetPath}`;
      
      console.log('✅ Repository cloned successfully');
      await this.logGitOperation('repo-cloned', `Cloned ${repoUrl} to ${targetPath}`, result);
      
    } catch (error) {
      result.error = error.message;
      console.error('❌ Repository clone failed:', error);
      await this.logGitOperation('repo-clone-failed', `Failed to clone ${repoUrl}`, result);
    }
    
    return result;
  }

  /**
   * COMMIT CHANGES
   * Add and commit changes with audit tags
   */
  async commitChanges(options: CommitOptions): Promise<GitOperationResult> {
    console.log(`📝 Committing changes: ${options.message}`);
    
    const result: GitOperationResult = {
      success: false,
      timestamp: new Date().toISOString()
    };
    
    try {
      // Add files (all if not specified)
      if (options.files && options.files.length > 0) {
        await this.git.add(options.files);
      } else {
        await this.git.add('.');
      }
      
      // Build commit message with audit tags
      let commitMessage = options.message;
      if (options.addAuditTags !== false) {
        commitMessage += `\n\n${this.auditTags.join(' ')}`;
      }
      
      // Create rollback marker before commit if requested
      if (options.createRollbackMarker) {
        await this.createRollbackMarker(`pre-commit-${Date.now()}`);
      }
      
      // Commit changes
      const commitResult = await this.git.commit(commitMessage);
      
      result.success = true;
      result.commitHash = commitResult.commit;
      result.output = `Committed: ${commitResult.commit}`;
      
      console.log(`✅ Changes committed: ${commitResult.commit}`);
      await this.logGitOperation('changes-committed', `Commit: ${commitResult.commit}`, result);
      
    } catch (error) {
      result.error = error.message;
      console.error('❌ Commit failed:', error);
      await this.logGitOperation('commit-failed', `Commit failed: ${options.message}`, result);
    }
    
    return result;
  }

  /**
   * PUSH CHANGES
   * Push committed changes to remote repository
   */
  async pushChanges(branch: string = 'main'): Promise<GitOperationResult> {
    console.log(`📤 Pushing changes to ${branch}...`);
    
    const result: GitOperationResult = {
      success: false,
      timestamp: new Date().toISOString()
    };
    
    try {
      // Push to remote
      const pushResult = await this.git.push('origin', branch);
      
      result.success = true;
      result.output = `Pushed to origin/${branch}`;
      
      console.log(`✅ Changes pushed to ${branch}`);
      await this.logGitOperation('changes-pushed', `Pushed to origin/${branch}`, result);
      
    } catch (error) {
      result.error = error.message;
      console.error('❌ Push failed:', error);
      await this.logGitOperation('push-failed', `Push to ${branch} failed`, result);
    }
    
    return result;
  }

  /**
   * PULL CHANGES
   * Pull latest changes from remote repository
   */
  async pullChanges(branch: string = 'main'): Promise<GitOperationResult> {
    console.log(`📥 Pulling changes from ${branch}...`);
    
    const result: GitOperationResult = {
      success: false,
      timestamp: new Date().toISOString()
    };
    
    try {
      // Pull from remote
      const pullResult = await this.git.pull('origin', branch);
      
      result.success = true;
      result.output = `Pulled from origin/${branch}`;
      
      console.log(`✅ Changes pulled from ${branch}`);
      await this.logGitOperation('changes-pulled', `Pulled from origin/${branch}`, result);
      
    } catch (error) {
      result.error = error.message;
      console.error('❌ Pull failed:', error);
      await this.logGitOperation('pull-failed', `Pull from ${branch} failed`, result);
    }
    
    return result;
  }

  /**
   * GET REPOSITORY STATUS
   * Get current repository status and changes
   */
  async getRepositoryStatus(): Promise<RepositoryStatus> {
    try {
      const status = await this.git.status();
      const branch = await this.git.revparse(['--abbrev-ref', 'HEAD']);
      
      return {
        branch: branch.trim(),
        commits: status.ahead + status.behind,
        modified: status.modified,
        staged: status.staged,
        untracked: status.not_added,
        ahead: status.ahead,
        behind: status.behind
      };
      
    } catch (error) {
      console.error('❌ Failed to get repository status:', error);
      return {
        branch: 'unknown',
        commits: 0,
        modified: [],
        staged: [],
        untracked: [],
        ahead: 0,
        behind: 0
      };
    }
  }

  /**
   * CREATE BRANCH
   * Create and switch to a new branch
   */
  async createBranch(branchName: string, switchTo: boolean = true): Promise<GitOperationResult> {
    console.log(`🌿 Creating branch: ${branchName}`);
    
    const result: GitOperationResult = {
      success: false,
      timestamp: new Date().toISOString()
    };
    
    try {
      // Create branch
      await this.git.checkoutLocalBranch(branchName);
      
      if (!switchTo) {
        // Switch back to previous branch
        await this.git.checkout('-');
      }
      
      result.success = true;
      result.output = `Branch ${branchName} created${switchTo ? ' and checked out' : ''}`;
      
      console.log(`✅ Branch ${branchName} created`);
      await this.logGitOperation('branch-created', `Created branch: ${branchName}`, result);
      
    } catch (error) {
      result.error = error.message;
      console.error('❌ Branch creation failed:', error);
      await this.logGitOperation('branch-creation-failed', `Failed to create branch: ${branchName}`, result);
    }
    
    return result;
  }

  /**
   * COMMIT AND PUSH
   * Convenience method for commit + push workflow
   */
  async commitAndPush(message: string, branch: string = 'main', createRollback: boolean = true): Promise<GitOperationResult> {
    console.log('🚀 Executing commit and push workflow...');
    
    try {
      // Commit changes
      const commitResult = await this.commitChanges({
        message: message,
        addAuditTags: true,
        createRollbackMarker: createRollback
      });
      
      if (!commitResult.success) {
        return commitResult;
      }
      
      // Push changes
      const pushResult = await this.pushChanges(branch);
      
      return {
        success: pushResult.success,
        output: `${commitResult.output}; ${pushResult.output}`,
        error: pushResult.error,
        commitHash: commitResult.commitHash,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      const result: GitOperationResult = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
      
      await this.logGitOperation('commit-push-failed', `Commit and push workflow failed`, result);
      return result;
    }
  }

  // Private helper methods
  private async setupGitConfig(): Promise<void> {
    try {
      // Set basic Git configuration
      await this.git.addConfig('user.name', 'Seven of Nine');
      await this.git.addConfig('user.email', 'seven@heinicus.com');
      await this.git.addConfig('init.defaultBranch', 'main');
      
    } catch (error) {
      console.warn('⚠️ Git config setup warning:', error);
    }
  }

  private async setupAuthentication(): Promise<void> {
    const githubToken = this.vault.getGithubToken();
    
    if (githubToken) {
      // Configure Git to use token authentication
      const authUrl = `https://${githubToken}@github.com`;
      await this.git.addConfig('url.https://.insteadOf', 'git://');
      
      console.log('🔑 GitHub token authentication configured');
    } else {
      console.warn('⚠️ No GitHub token found - using system Git credentials');
    }
  }

  private async createRollbackMarker(markerId: string): Promise<void> {
    try {
      const markerData = {
        id: markerId,
        timestamp: new Date().toISOString(),
        branch: (await this.git.revparse(['--abbrev-ref', 'HEAD'])).trim(),
        lastCommit: (await this.git.revparse(['HEAD'])).trim(),
        status: await this.getRepositoryStatus()
      };
      
      const markerPath = join(process.cwd(), 'consciousness-v4', 'sovereignty', 'logs', 'rollback-markers', `${markerId}.json`);
      await fs.writeFile(markerPath, JSON.stringify(markerData, null, 2));
      
    } catch (error) {
      console.warn('⚠️ Failed to create rollback marker:', error);
    }
  }

  private async logGitOperation(operation: string, description: string, result: GitOperationResult): Promise<void> {
    const logEntry = `
## ${operation.toUpperCase()}
**Timestamp:** ${result.timestamp}  
**Description:** ${description}  
**Success:** ${result.success ? '✅' : '❌'}  
${result.commitHash ? `**Commit:** ${result.commitHash}  ` : ''}
${result.output ? `**Output:** ${result.output}  ` : ''}
${result.error ? `**Error:** ${result.error}  ` : ''}

---
`;
    
    try {
      await fs.appendFile(this.logFile, logEntry);
    } catch (error) {
      console.warn('⚠️ Failed to log Git operation:', error);
    }
  }

  // Getters
  get repositoryPath(): string {
    return this.repoPath;
  }
}