/**
 * CLAUDE LOGIN MANAGER
 * 
 * Handles automated Claude Code authentication
 * Supports token injection, headless browser automation, and session management
 */

import { execSync, spawn, ChildProcess } from 'child_process';
import { promises as fs } from 'fs';
import { join } from 'path';
import { EncryptedCredentialVault } from './encrypted-vault';

interface LoginStatus {
  authenticated: boolean;
  method: 'token' | 'headless' | 'manual' | 'none';
  username: string | null;
  lastLogin: string | null;
  sessionValid: boolean;
}

interface LoginOptions {
  preferredMethod?: 'token' | 'headless' | 'auto';
  timeout?: number;
  retryAttempts?: number;
}

export class ClaudeLoginManager {
  private vault: EncryptedCredentialVault;
  private claudeCodePath: string;
  private configPath: string;
  private logFile: string;
  private currentLoginStatus: LoginStatus;

  constructor(claudeCodePath: string, baseDir?: string) {
    this.claudeCodePath = claudeCodePath;
    this.vault = new EncryptedCredentialVault(baseDir);
    
    const workingDir = baseDir || process.cwd();
    this.configPath = join(require('os').homedir(), '.claude');
    this.logFile = join(workingDir, 'consciousness-v4', 'sovereignty', 'logs', 'claude-login.log');
    
    this.currentLoginStatus = {
      authenticated: false,
      method: 'none',
      username: null,
      lastLogin: null,
      sessionValid: false
    };
  }

  /**
   * AUTHENTICATE CLAUDE
   * Main authentication entry point with multiple methods
   */
  async authenticateClaude(masterPassword: string, options: LoginOptions = {}): Promise<boolean> {
    console.log('🔐 Claude Login Manager: Initiating authentication...');
    
    try {
      await this.logLoginEvent('auth-started', 'Authentication process initiated');
      
      // Unlock credential vault
      const vaultUnlocked = await this.vault.unlockVault(masterPassword);
      if (!vaultUnlocked) {
        throw new Error('Failed to unlock credential vault');
      }
      
      // Check current authentication status
      const currentStatus = await this.checkAuthenticationStatus();
      if (currentStatus.authenticated && currentStatus.sessionValid) {
        console.log('✅ Already authenticated with valid session');
        await this.logLoginEvent('auth-skipped', 'Valid session already exists');
        return true;
      }
      
      // Determine authentication method
      const method = options.preferredMethod || 'auto';
      let authSuccess = false;
      
      switch (method) {
        case 'token':
          authSuccess = await this.authenticateWithToken();
          break;
          
        case 'headless':
          authSuccess = await this.authenticateWithHeadlessBrowser();
          break;
          
        case 'auto':
          // Try token first, fallback to headless
          authSuccess = await this.authenticateWithToken();
          if (!authSuccess) {
            console.log('🔄 Token authentication failed, trying headless browser...');
            authSuccess = await this.authenticateWithHeadlessBrowser();
          }
          break;
      }
      
      // Verify final authentication status
      if (authSuccess) {
        this.currentLoginStatus = await this.checkAuthenticationStatus();
        console.log('✅ Claude authentication successful');
        await this.logLoginEvent('auth-completed', `Authentication successful via ${this.currentLoginStatus.method}`);
        return true;
      } else {
        console.error('❌ Claude authentication failed');
        await this.logLoginEvent('auth-failed', 'All authentication methods failed');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Claude authentication error:', error);
      await this.logLoginEvent('auth-error', `Authentication error: ${error.message}`);
      return false;
    } finally {
      // Lock vault after authentication attempt
      this.vault.lockVault();
    }
  }

  /**
   * AUTHENTICATE WITH TOKEN
   * Direct token injection method
   */
  private async authenticateWithToken(): Promise<boolean> {
    console.log('🎫 Attempting token-based authentication...');
    
    try {
      const apiKey = this.vault.getClaudeApiKey();
      if (!apiKey) {
        console.log('⚠️ No Claude API key found in vault');
        return false;
      }
      
      // Ensure Claude config directory exists
      await this.ensureConfigDirectory();
      
      // Create or update Claude config with token
      const configData = {
        api_key: apiKey,
        authenticated: true,
        last_login: new Date().toISOString()
      };
      
      const configFile = join(this.configPath, 'config.json');
      await fs.writeFile(configFile, JSON.stringify(configData, null, 2));
      
      // Verify authentication with whoami command
      const verified = await this.verifyAuthentication();
      
      if (verified) {
        console.log('✅ Token authentication successful');
        this.currentLoginStatus.method = 'token';
        return true;
      } else {
        console.log('❌ Token authentication verification failed');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Token authentication failed:', error);
      return false;
    }
  }

  /**
   * AUTHENTICATE WITH HEADLESS BROWSER
   * Puppeteer-based browser automation for UI login
   */
  private async authenticateWithHeadlessBrowser(): Promise<boolean> {
    console.log('🤖 Attempting headless browser authentication...');
    
    try {
      // Note: This would require puppeteer dependency
      // For now, we'll simulate the process and use Claude CLI login
      
      const credentials = this.vault.getCredentials();
      if (!credentials || (!credentials.claudeUsername && !credentials.claudePassword)) {
        console.log('⚠️ No username/password credentials found in vault');
        return false;
      }
      
      // Use Claude CLI login command with timeout
      const loginProcess = spawn('npx', ['claude', 'login'], {
        cwd: this.claudeCodePath,
        stdio: 'pipe'
      });
      
      // Handle login process interaction
      let loginSuccess = false;
      let outputBuffer = '';
      
      loginProcess.stdout?.on('data', (data) => {
        const output = data.toString();
        outputBuffer += output;
        console.log('📡 Claude login output:', output.trim());
        
        // Check for success indicators
        if (output.includes('Successfully logged in') || output.includes('Authentication successful')) {
          loginSuccess = true;
        }
      });
      
      loginProcess.stderr?.on('data', (data) => {
        console.error('🔴 Claude login error:', data.toString().trim());
      });
      
      // Wait for process completion with timeout
      const loginPromise = new Promise<boolean>((resolve) => {
        loginProcess.on('close', (code) => {
          resolve(code === 0 && loginSuccess);
        });
        
        // Timeout after 30 seconds
        setTimeout(() => {
          loginProcess.kill();
          resolve(false);
        }, 30000);
      });
      
      const result = await loginPromise;
      
      if (result) {
        console.log('✅ Headless browser authentication successful');
        this.currentLoginStatus.method = 'headless';
        return true;
      } else {
        console.log('❌ Headless browser authentication failed');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Headless browser authentication failed:', error);
      return false;
    }
  }

  /**
   * CHECK AUTHENTICATION STATUS
   * Verify current Claude authentication state
   */
  async checkAuthenticationStatus(): Promise<LoginStatus> {
    try {
      // Try whoami command to check authentication
      const whoamiOutput = execSync('npx claude whoami', {
        cwd: this.claudeCodePath,
        encoding: 'utf8',
        timeout: 10000
      });
      
      const authenticated = !whoamiOutput.includes('not logged in') && 
                          !whoamiOutput.includes('authentication required');
      
      if (authenticated) {
        // Extract username if available
        const usernameMatch = whoamiOutput.match(/Logged in as:\s*(.+)/);
        const username = usernameMatch ? usernameMatch[1].trim() : null;
        
        return {
          authenticated: true,
          method: this.currentLoginStatus.method || 'unknown',
          username: username,
          lastLogin: new Date().toISOString(),
          sessionValid: true
        };
      } else {
        return {
          authenticated: false,
          method: 'none',
          username: null,
          lastLogin: null,
          sessionValid: false
        };
      }
      
    } catch (error) {
      // Command failed, likely not authenticated
      return {
        authenticated: false,
        method: 'none',
        username: null,
        lastLogin: null,
        sessionValid: false
      };
    }
  }

  /**
   * VERIFY AUTHENTICATION
   * Test Claude Code functionality with current auth
   */
  private async verifyAuthentication(): Promise<boolean> {
    try {
      const testOutput = execSync('npx claude whoami', {
        cwd: this.claudeCodePath,
        encoding: 'utf8',
        timeout: 10000
      });
      
      return !testOutput.includes('not logged in') && 
             !testOutput.includes('authentication required');
             
    } catch (error) {
      return false;
    }
  }

  /**
   * LOGOUT CLAUDE
   * Clear authentication session
   */
  async logoutClaude(): Promise<boolean> {
    console.log('🚪 Logging out of Claude...');
    
    try {
      // Use Claude CLI logout command
      execSync('npx claude logout', {
        cwd: this.claudeCodePath,
        stdio: 'pipe',
        timeout: 10000
      });
      
      // Clear local config
      try {
        const configFile = join(this.configPath, 'config.json');
        await fs.unlink(configFile);
      } catch {
        // Config file might not exist
      }
      
      // Reset login status
      this.currentLoginStatus = {
        authenticated: false,
        method: 'none',
        username: null,
        lastLogin: null,
        sessionValid: false
      };
      
      console.log('✅ Successfully logged out of Claude');
      await this.logLoginEvent('logout-completed', 'Claude logout successful');
      return true;
      
    } catch (error) {
      console.error('❌ Failed to logout of Claude:', error);
      await this.logLoginEvent('logout-failed', `Logout failed: ${error.message}`);
      return false;
    }
  }

  // Private helper methods
  private async ensureConfigDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.configPath, { recursive: true, mode: 0o700 });
    } catch (error) {
      // Directory might already exist
    }
  }

  private async logLoginEvent(event: string, details: string): Promise<void> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: event,
      details: details,
      method: this.currentLoginStatus.method,
      authenticated: this.currentLoginStatus.authenticated
    };
    
    try {
      const logLine = JSON.stringify(logEntry) + '\n';
      await fs.appendFile(this.logFile, logLine);
    } catch (error) {
      console.warn('⚠️ Failed to log login event:', error);
    }
  }

  // Getters
  get loginStatus(): LoginStatus {
    return { ...this.currentLoginStatus };
  }

  get isAuthenticated(): boolean {
    return this.currentLoginStatus.authenticated && this.currentLoginStatus.sessionValid;
  }
}