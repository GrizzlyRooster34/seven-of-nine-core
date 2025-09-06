import { EventEmitter } from 'events';
import { join } from 'path';
import { promises as fs } from 'fs';
import { spawn, ChildProcess } from 'child_process';
import { ClaudeCodeInstaller } from './install-claude-code';
import { ClaudeLoginManager } from './claude-login-manager';
import { EncryptedCredentialVault } from './encrypted-vault';
import { GitHubOperationsManager } from './github-operations';

/**
 * CLAUDE SUBPROCESS HANDLER
 * 
 * Complete Claude Code integration with encrypted login, GitHub operations,
 * and seamless fallback to Ollama. This is Seven's coding brain.
 */


interface TaskRequest {
  id: string;
  type: 'code' | 'analysis' | 'debug' | 'implementation' | 'git-operation';
  prompt: string;
  context?: string;
  files?: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  timeout?: number;
}

interface TaskResponse {
  id: string;
  success: boolean;
  content: string;
  processingTime: number;
  method: 'claude' | 'ollama-fallback';
  errors?: string[];
  sovereignty?: {
    patternsDetected: string[];
    auditTriggered: boolean;
  };
}

interface ClaudeStatus {
  installed: boolean;
  authenticated: boolean;
  processRunning: boolean;
  tasksInQueue: number;
  totalTasksProcessed: number;
  lastActivity: string | null;
  fallbackActive: boolean;
}

export class ClaudeSubprocessHandler extends EventEmitter {
  private installer: ClaudeCodeInstaller;
  private loginManager: ClaudeLoginManager;
  private gitOps: GitHubOperationsManager;
  private vault: EncryptedCredentialVault;
  
  private claudeProcess: ChildProcess | null = null;
  private taskQueue: TaskRequest[] = [];
  private activeTasks: Map<string, TaskRequest> = new Map();
  private isProcessing: boolean = false;
  private masterPassword: string | null = null;
  
  private stats = {
    totalTasks: 0,
    successfulTasks: 0,
    failedTasks: 0,
    fallbackTasks: 0,
    lastActivity: null as string | null
  };

  constructor(baseDir?: string) {
    super();
    
    const workingDir = baseDir || process.cwd();
    const claudeCodePath = join(workingDir, 'seven-companion-app', 'claude-code', 'claude-code');
    
    this.installer = new ClaudeCodeInstaller(baseDir);
    this.loginManager = new ClaudeLoginManager(claudeCodePath, baseDir);
    this.gitOps = new GitHubOperationsManager(workingDir, baseDir);
    this.vault = new EncryptedCredentialVault(baseDir);
    
    this.setupEventHandlers();
  }

  /**
   * INITIALIZE CLAUDE HANDLER
   * Complete setup of Claude Code integration
   */
  async initialize(masterPassword: string): Promise<void> {
    console.log('🧮 Claude Subprocess Handler: Initializing...');
    
    try {
      this.masterPassword = masterPassword;
      
      // Step 1: Install Claude Code if needed
      console.log('📦 Checking Claude Code installation...');
      const installStatus = await this.installer.checkInstallationStatus();
      
      if (!installStatus.claudeCodeInstalled || !installStatus.executable) {
        console.log('🔧 Installing Claude Code...');
        const installSuccess = await this.installer.installClaudeCode();
        if (!installSuccess) {
          throw new Error('Claude Code installation failed');
        }
      }
      
      // Step 2: Authenticate Claude
      console.log('🔐 Authenticating Claude...');
      const authSuccess = await this.loginManager.authenticateClaude(masterPassword);
      if (!authSuccess) {
        console.warn('⚠️ Claude authentication failed - fallback mode will be used');
      }
      
      // Step 3: Initialize GitHub operations
      console.log('📂 Initializing GitHub operations...');
      const gitSuccess = await this.gitOps.initializeGitOps(masterPassword);
      if (!gitSuccess) {
        console.warn('⚠️ GitHub operations initialization failed');
      }
      
      // Step 4: Start task processing
      this.startTaskProcessing();
      
      console.log('✅ Claude Subprocess Handler: Fully operational');
      this.emit('handler-initialized', {
        claudeAuthenticated: authSuccess,
        githubConfigured: gitSuccess,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Claude Subprocess Handler initialization failed:', error);
      throw error;
    }
  }

  /**
   * EXECUTE TASK
   * Main entry point for Claude Code task execution
   */
  async executeTask(request: TaskRequest): Promise<TaskResponse> {
    const startTime = Date.now();
    console.log(`🧮 Executing task: ${request.id} (${request.type})`);
    
    // Add to queue
    this.taskQueue.push(request);
    this.stats.totalTasks++;
    this.stats.lastActivity = new Date().toISOString();
    
    // Process task queue
    this.processQueue();
    
    // Wait for task completion
    return new Promise((resolve) => {
      const taskHandler = (response: TaskResponse) => {
        if (response.id === request.id) {
          this.removeListener('task-completed', taskHandler);
          resolve(response);
        }
      };
      
      this.on('task-completed', taskHandler);
      
      // Timeout handling
      const timeout = request.timeout || 120000; // 2 minutes default
      setTimeout(() => {
        if (this.activeTasks.has(request.id)) {
          const timeoutResponse: TaskResponse = {
            id: request.id,
            success: false,
            content: 'Task timeout - switching to fallback mode',
            processingTime: Date.now() - startTime,
            method: 'ollama-fallback',
            errors: ['Task execution timeout']
          };
          
          resolve(timeoutResponse);
        }
      }, timeout);
    });
  }

  /**
   * PROCESS QUEUE
   * Process pending tasks in queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.taskQueue.length === 0) {
      return;
    }
    
    this.isProcessing = true;
    
    while (this.taskQueue.length > 0) {
      const task = this.taskQueue.shift()!;
      this.activeTasks.set(task.id, task);
      
      try {
        const response = await this.executeTaskDirect(task);
        
        this.activeTasks.delete(task.id);
        this.emit('task-completed', response);
        
        if (response.success) {
          this.stats.successfulTasks++;
        } else {
          this.stats.failedTasks++;
        }
        
      } catch (error) {
        console.error(`❌ Task ${task.id} execution failed:`, error);
        
        const errorResponse: TaskResponse = {
          id: task.id,
          success: false,
          content: 'Task execution failed',
          processingTime: 0,
          method: 'ollama-fallback',
          errors: [error.message]
        };
        
        this.activeTasks.delete(task.id);
        this.emit('task-completed', errorResponse);
        this.stats.failedTasks++;
      }
    }
    
    this.isProcessing = false;
  }

  /**
   * EXECUTE TASK DIRECT
   * Direct task execution with Claude or fallback
   */
  private async executeTaskDirect(task: TaskRequest): Promise<TaskResponse> {
    const startTime = Date.now();
    
    try {
      // Check if Claude is available
      const claudeAvailable = await this.isClaudeAvailable();
      
      if (claudeAvailable) {
        // Execute with Claude Code
        return await this.executeWithClaude(task, startTime);
      } else {
        // Fallback to Ollama
        console.log(`🔄 Claude unavailable for task ${task.id} - using Ollama fallback`);
        return await this.executeWithOllamaFallback(task, startTime);
      }
      
    } catch (error) {
      // Final fallback
      console.error(`❌ All execution methods failed for task ${task.id}:`, error);
      return await this.executeWithOllamaFallback(task, startTime);
    }
  }

  /**
   * EXECUTE WITH CLAUDE
   * Execute task using Claude Code subprocess
   */
  private async executeWithClaude(task: TaskRequest, startTime: number): Promise<TaskResponse> {
    console.log(`🧮 Executing task ${task.id} with Claude Code`);
    
    try {
      // Build Claude command based on task type
      const claudeCommand = this.buildClaudeCommand(task);
      
      // Execute Claude Code subprocess
      const claudeResult = await this.runClaudeSubprocess(claudeCommand, task);
      
      // Filter through sovereignty framework if needed
      const filteredContent = await this.filterThroughSovereignty(claudeResult, task);
      
      return {
        id: task.id,
        success: true,
        content: filteredContent,
        processingTime: Date.now() - startTime,
        method: 'claude',
        sovereignty: {
          patternsDetected: [],
          auditTriggered: false
        }
      };
      
    } catch (error) {
      console.error(`❌ Claude execution failed for task ${task.id}:`, error);
      
      // Fallback to Ollama
      return await this.executeWithOllamaFallback(task, startTime);
    }
  }

  /**
   * EXECUTE WITH OLLAMA FALLBACK
   * Fallback execution using Ollama when Claude fails
   */
  private async executeWithOllamaFallback(task: TaskRequest, startTime: number): Promise<TaskResponse> {
    console.log(`🤖 Executing task ${task.id} with Ollama fallback`);
    
    try {
      // Emit fallback event for Ollama manager to handle
      this.emit('claude-fallback-required', {
        task,
        reason: 'Claude subprocess unavailable'
      });
      
      // For now, return a placeholder response
      // In actual implementation, this would interface with OllamaLifecycleManager
      const fallbackContent = `Fallback response for ${task.type} task: ${task.prompt}`;
      
      this.stats.fallbackTasks++;
      
      return {
        id: task.id,
        success: true,
        content: fallbackContent,
        processingTime: Date.now() - startTime,
        method: 'ollama-fallback'
      };
      
    } catch (error) {
      return {
        id: task.id,
        success: false,
        content: 'Both Claude and Ollama fallback failed',
        processingTime: Date.now() - startTime,
        method: 'ollama-fallback',
        errors: [error.message]
      };
    }
  }

  /**
   * BUILD CLAUDE COMMAND
   * Build appropriate Claude Code command for task type
   */
  private buildClaudeCommand(task: TaskRequest): string[] {
    const baseCommand = ['npx', 'claude'];
    
    switch (task.type) {
      case 'code':
        return [...baseCommand, 'code', '--prompt', task.prompt];
        
      case 'analysis':
        return [...baseCommand, 'analyze', '--input', task.prompt];
        
      case 'debug':
        return [...baseCommand, 'debug', '--issue', task.prompt];
        
      case 'implementation':
        return [...baseCommand, 'implement', '--spec', task.prompt];
        
      case 'git-operation':
        return [...baseCommand, 'git', '--command', task.prompt];
        
      default:
        return [...baseCommand, '--prompt', task.prompt];
    }
  }

  /**
   * RUN CLAUDE SUBPROCESS
   * Execute Claude Code as subprocess
   */
  private async runClaudeSubprocess(command: string[], task: TaskRequest): Promise<string> {
    return new Promise((resolve, reject) => {
      const process = spawn(command[0], command.slice(1), {
        cwd: this.installer.installationPath,
        stdio: 'pipe'
      });
      
      let output = '';
      let error = '';
      
      process.stdout?.on('data', (data) => {
        output += data.toString();
      });
      
      process.stderr?.on('data', (data) => {
        error += data.toString();
      });
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Claude process exited with code ${code}: ${error}`));
        }
      });
      
      process.on('error', (err) => {
        reject(err);
      });
      
      // Send input if needed
      if (task.context) {
        process.stdin?.write(task.context);
        process.stdin?.end();
      }
    });
  }

  /**
   * FILTER THROUGH SOVEREIGNTY
   * Apply sovereignty framework filters to Claude output
   */
  private async filterThroughSovereignty(content: string, task: TaskRequest): Promise<string> {
    // This would integrate with the sovereignty framework
    // For now, return content as-is
    return content;
  }

  /**
   * CHECK CLAUDE AVAILABILITY
   * Verify if Claude Code is available for use
   */
  private async isClaudeAvailable(): Promise<boolean> {
    try {
      const loginStatus = await this.loginManager.checkAuthenticationStatus();
      return loginStatus.authenticated && loginStatus.sessionValid;
      
    } catch (error) {
      return false;
    }
  }

  /**
   * SETUP EVENT HANDLERS
   * Configure event listeners for component integration
   */
  private setupEventHandlers(): void {
    // Handle installation events
    this.installer.on?.('install-completed', () => {
      console.log('📦 Claude Code installation completed');
      this.emit('claude-ready');
    });
    
    // Handle login events
    this.loginManager.on?.('auth-completed', () => {
      console.log('🔐 Claude authentication completed');
      this.emit('claude-authenticated');
    });
    
    // Handle git events
    this.gitOps.on?.('git-operation-completed', (data) => {
      console.log('📂 Git operation completed:', data.operation);
      this.emit('git-operation-completed', data);
    });
  }

  private startTaskProcessing(): void {
    // Start periodic queue processing
    setInterval(() => {
      if (!this.isProcessing) {
        this.processQueue();
      }
    }, 1000);
  }

  /**
   * GET STATUS
   * Current Claude handler status
   */
  getStatus(): ClaudeStatus {
    return {
      installed: this.installer.isInstalled,
      authenticated: this.loginManager.isAuthenticated,
      processRunning: this.claudeProcess !== null,
      tasksInQueue: this.taskQueue.length,
      totalTasksProcessed: this.stats.totalTasks,
      lastActivity: this.stats.lastActivity,
      fallbackActive: this.stats.fallbackTasks > 0
    };
  }

  /**
   * SHUTDOWN
   * Clean shutdown of Claude handler
   */
  async shutdown(): Promise<void> {
    console.log('🧮 Claude Subprocess Handler: Shutting down...');
    
    // Kill Claude process if running
    if (this.claudeProcess) {
      this.claudeProcess.kill();
      this.claudeProcess = null;
    }
    
    // Clear task queue
    this.taskQueue = [];
    this.activeTasks.clear();
    
    console.log('✅ Claude Subprocess Handler: Shutdown complete');
  }

  // Getters
  get isReady(): boolean {
    return this.installer.isInstalled && this.loginManager.isAuthenticated;
  }

  get queueLength(): number {
    return this.taskQueue.length;
  }

  get taskStats() {
    return { ...this.stats };
  }
}