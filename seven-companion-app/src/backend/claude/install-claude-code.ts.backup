/**
 * CLAUDE CODE INSTALLATION UTILITY
 * 
 * Autonomously installs Claude Code for subprocess integration
 * Handles repo cloning, dependency installation, and verification
 */

import { execSync, spawn } from 'child_process';
import { promises as fs } from 'fs';
import { join } from 'path';

interface InstallationStatus {
  claudeCodeInstalled: boolean;
  dependenciesInstalled: boolean;
  executable: boolean;
  version: string | null;
  installPath: string;
  lastInstallAttempt: string | null;
}

export class ClaudeCodeInstaller {
  private installDir: string;
  private claudeCodePath: string;
  private logFile: string;

  constructor(baseDir?: string) {
    const workingDir = baseDir || process.cwd();
    this.installDir = join(workingDir, 'seven-companion-app', 'claude-code');
    this.claudeCodePath = join(this.installDir, 'claude-code');
    this.logFile = join(workingDir, 'consciousness-v4', 'sovereignty', 'logs', 'claude-install.log');
  }

  /**
   * INSTALL CLAUDE CODE
   * Complete installation process with verification
   */
  async installClaudeCode(): Promise<boolean> {
    console.log('📦 Claude Code Installer: Beginning installation...');
    
    try {
      await this.logInstallEvent('install-started', 'Claude Code installation initiated');
      
      // Check if already installed
      const existingStatus = await this.checkInstallationStatus();
      if (existingStatus.claudeCodeInstalled && existingStatus.executable) {
        console.log('✅ Claude Code already installed and functional');
        await this.logInstallEvent('install-skipped', 'Claude Code already installed');
        return true;
      }
      
      // Ensure install directory exists
      await this.ensureInstallDirectory();
      
      // Clone Claude Code repository
      await this.cloneClaudeCodeRepo();
      
      // Install dependencies
      await this.installDependencies();
      
      // Verify installation
      const installSuccess = await this.verifyInstallation();
      
      if (installSuccess) {
        console.log('✅ Claude Code installation completed successfully');
        await this.logInstallEvent('install-completed', 'Claude Code installed and verified');
        return true;
      } else {
        console.error('❌ Claude Code installation verification failed');
        await this.logInstallEvent('install-failed', 'Installation verification failed');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Claude Code installation failed:', error);
      await this.logInstallEvent('install-error', `Installation failed: ${error.message}`);
      return false;
    }
  }

  /**
   * CHECK INSTALLATION STATUS
   * Verify current Claude Code installation state
   */
  async checkInstallationStatus(): Promise<InstallationStatus> {
    const status: InstallationStatus = {
      claudeCodeInstalled: false,
      dependenciesInstalled: false,
      executable: false,
      version: null,
      installPath: this.claudeCodePath,
      lastInstallAttempt: null
    };

    try {
      // Check if Claude Code directory exists
      await fs.access(this.claudeCodePath);
      status.claudeCodeInstalled = true;
      
      // Check if package.json exists (dependencies check)
      const packageJsonPath = join(this.claudeCodePath, 'package.json');
      await fs.access(packageJsonPath);
      
      // Check if node_modules exists
      const nodeModulesPath = join(this.claudeCodePath, 'node_modules');
      await fs.access(nodeModulesPath);
      status.dependenciesInstalled = true;
      
      // Try to get version
      try {
        const versionOutput = execSync('claude --version', { 
          cwd: this.claudeCodePath,
          encoding: 'utf8',
          timeout: 5000
        });
        status.version = versionOutput.trim();
        status.executable = true;
      } catch {
        // Claude might not be in PATH, try direct execution
        try {
          const directVersionOutput = execSync('npx claude --version', {
            cwd: this.claudeCodePath,
            encoding: 'utf8',
            timeout: 5000
          });
          status.version = directVersionOutput.trim();
          status.executable = true;
        } catch {
          status.executable = false;
        }
      }
      
    } catch {
      // Installation not found
    }

    return status;
  }

  /**
   * CLONE CLAUDE CODE REPOSITORY
   * Clone official Claude Code repository
   */
  private async cloneClaudeCodeRepo(): Promise<void> {
    console.log('📥 Cloning Claude Code repository...');
    
    try {
      // Remove existing directory if it exists but is incomplete
      try {
        await fs.rm(this.claudeCodePath, { recursive: true, force: true });
      } catch {
        // Directory might not exist
      }
      
      // Clone repository
      const cloneCommand = `git clone https://github.com/anthropics/claude-code.git "${this.claudeCodePath}"`;
      
      execSync(cloneCommand, {
        cwd: this.installDir,
        stdio: 'pipe',
        timeout: 60000 // 1 minute timeout
      });
      
      console.log('✅ Claude Code repository cloned successfully');
      
    } catch (error) {
      console.error('❌ Failed to clone Claude Code repository:', error);
      throw new Error(`Repository clone failed: ${error.message}`);
    }
  }

  /**
   * INSTALL DEPENDENCIES
   * Install Claude Code dependencies using npm/bun
   */
  private async installDependencies(): Promise<void> {
    console.log('📦 Installing Claude Code dependencies...');
    
    try {
      // Check if bun is available (preferred)
      let installCommand = 'npm install';
      
      try {
        execSync('bun --version', { stdio: 'pipe', timeout: 5000 });
        installCommand = 'bun install';
        console.log('🟡 Using bun for dependency installation');
      } catch {
        console.log('🟡 Using npm for dependency installation');
      }
      
      // Install dependencies
      execSync(installCommand, {
        cwd: this.claudeCodePath,
        stdio: 'pipe',
        timeout: 300000 // 5 minute timeout
      });
      
      console.log('✅ Dependencies installed successfully');
      
    } catch (error) {
      console.error('❌ Failed to install dependencies:', error);
      throw new Error(`Dependency installation failed: ${error.message}`);
    }
  }

  /**
   * VERIFY INSTALLATION
   * Test Claude Code functionality
   */
  private async verifyInstallation(): Promise<boolean> {
    console.log('🔍 Verifying Claude Code installation...');
    
    try {
      // Test basic Claude Code execution
      const testOutput = execSync('npx claude --help', {
        cwd: this.claudeCodePath,
        encoding: 'utf8',
        timeout: 10000
      });
      
      if (testOutput.includes('Claude Code') || testOutput.includes('Usage:')) {
        console.log('✅ Claude Code installation verified');
        return true;
      } else {
        console.warn('⚠️ Claude Code help output unexpected');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Claude Code verification failed:', error);
      return false;
    }
  }

  /**
   * UNINSTALL CLAUDE CODE
   * Remove Claude Code installation
   */
  async uninstallClaudeCode(): Promise<boolean> {
    console.log('🗑️ Uninstalling Claude Code...');
    
    try {
      await fs.rm(this.claudeCodePath, { recursive: true, force: true });
      console.log('✅ Claude Code uninstalled successfully');
      await this.logInstallEvent('uninstall-completed', 'Claude Code removed');
      return true;
      
    } catch (error) {
      console.error('❌ Failed to uninstall Claude Code:', error);
      await this.logInstallEvent('uninstall-failed', `Uninstall failed: ${error.message}`);
      return false;
    }
  }

  /**
   * UPDATE CLAUDE CODE
   * Pull latest updates from repository
   */
  async updateClaudeCode(): Promise<boolean> {
    console.log('🔄 Updating Claude Code...');
    
    try {
      const status = await this.checkInstallationStatus();
      if (!status.claudeCodeInstalled) {
        console.log('🟡 Claude Code not installed - installing instead of updating');
        return await this.installClaudeCode();
      }
      
      // Pull latest changes
      execSync('git pull origin main', {
        cwd: this.claudeCodePath,
        stdio: 'pipe',
        timeout: 30000
      });
      
      // Reinstall dependencies in case they changed
      await this.installDependencies();
      
      // Verify after update
      const updateSuccess = await this.verifyInstallation();
      
      if (updateSuccess) {
        console.log('✅ Claude Code updated successfully');
        await this.logInstallEvent('update-completed', 'Claude Code updated');
        return true;
      } else {
        console.error('❌ Claude Code update verification failed');
        await this.logInstallEvent('update-failed', 'Update verification failed');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Claude Code update failed:', error);
      await this.logInstallEvent('update-error', `Update failed: ${error.message}`);
      return false;
    }
  }

  // Private helper methods
  private async ensureInstallDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.installDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  }

  private async logInstallEvent(event: string, details: string): Promise<void> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: event,
      details: details,
      installPath: this.claudeCodePath
    };
    
    try {
      const logLine = JSON.stringify(logEntry) + '\n';
      await fs.appendFile(this.logFile, logLine);
    } catch (error) {
      console.warn('⚠️ Failed to log installation event:', error);
    }
  }

  // Getters
  get installationPath(): string {
    return this.claudeCodePath;
  }

  get isInstalled(): boolean {
    // Quick synchronous check
    try {
      require('fs').accessSync(this.claudeCodePath);
      return true;
    } catch {
      return false;
    }
  }
}