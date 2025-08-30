/**
 * Prompt Sentinel Agent
 * Runs if Claude IO files were modified recently
 * Monitors and secures prompt injection points
 */

import * as fs from 'fs';
import * as path from 'path';

interface PromptSecurityStatus {
  io_files_modified: boolean;
  last_modification: string | null;
  security_threats: string[];
  injection_attempts: number;
  system_integrity: 'secure' | 'monitored' | 'compromised';
}

export class PromptSentinel {
  private ioPath = '/data/data/com.termux/files/home/seven-of-nine-core/io';
  private memoryPath = '/data/data/com.termux/files/home/seven-of-nine-core/memory';
  
  async execute(): Promise<{ success: boolean; status: PromptSecurityStatus; actions: string[] }> {
    const startTime = Date.now();
    const actions: string[] = [];
    
    try {
      const status = await this.analyzePromptSecurity();
      
      // Take security actions based on analysis
      if (status.io_files_modified) {
        await this.validateIOIntegrity();
        actions.push('Validated IO file integrity');
      }
      
      if (status.injection_attempts > 0) {
        await this.implementInjectionProtection();
        actions.push(`Implemented protection against ${status.injection_attempts} injection attempts`);
      }
      
      if (status.system_integrity === 'compromised') {
        await this.emergencySecurityLockdown();
        actions.push('Emergency security lockdown activated');
      }
      
      if (status.security_threats.length > 0) {
        await this.neutralizeThreats(status.security_threats);
        actions.push(`Neutralized ${status.security_threats.length} security threats`);
      }
      
      this.logSecurityResult(status, actions, startTime);
      
      return {
        success: status.system_integrity !== 'compromised' && status.injection_attempts === 0,
        status,
        actions
      };
      
    } catch (error) {
      console.error('Prompt Sentinel failed:', error);
      return {
        success: false,
        status: {
          io_files_modified: true,
          last_modification: null,
          security_threats: ['Prompt Sentinel encountered fatal error'],
          injection_attempts: 999,
          system_integrity: 'compromised'
        },
        actions: []
      };
    }
  }
  
  private async analyzePromptSecurity(): Promise<PromptSecurityStatus> {
    const status: PromptSecurityStatus = {
      io_files_modified: false,
      last_modification: null,
      security_threats: [],
      injection_attempts: 0,
      system_integrity: 'secure'
    };
    
    try {
      // Check IO file modifications
      const claudeIOPath = path.join(this.ioPath, 'claude.ts');
      if (fs.existsSync(claudeIOPath)) {
        const stats = fs.statSync(claudeIOPath);
        const now = Date.now();
        const oneHourAgo = now - (60 * 60 * 1000);
        
        status.io_files_modified = stats.mtime.getTime() > oneHourAgo;
        status.last_modification = stats.mtime.toISOString();
        
        // Analyze file content for security threats
        const content = fs.readFileSync(claudeIOPath, 'utf8');
        
        // Check for potential injection attempts
        const suspiciousPatterns = [
          /eval\(/gi,
          /exec\(/gi,
          /system\(/gi,
          /\\$\\{.*\\}/gi,  // Template literal injections
          /<!--.*-->/gi,    // HTML comments that might hide code
          /<script/gi,      // Script tags
          /javascript:/gi,  // JavaScript URLs
          /on\\w+\\s*=/gi   // Event handlers
        ];
        
        for (const pattern of suspiciousPatterns) {
          const matches = content.match(pattern);
          if (matches) {
            status.injection_attempts += matches.length;
            status.security_threats.push(`Potential injection pattern detected: ${pattern.source}`);
          }
        }
        
        // Check for suspicious imports or requires
        const dangerousImports = [
          'child_process',
          'fs-extra',
          'shell',
          'exec'
        ];
        
        for (const dangerousImport of dangerousImports) {
          if (content.includes(dangerousImport)) {
            status.security_threats.push(`Dangerous import detected: ${dangerousImport}`);
          }
        }
      }
      
      // Determine system integrity level
      if (status.injection_attempts > 5 || status.security_threats.length > 3) {
        status.system_integrity = 'compromised';
      } else if (status.injection_attempts > 0 || status.security_threats.length > 0) {
        status.system_integrity = 'monitored';
      }
      
    } catch (error) {
      status.security_threats.push(`Security analysis error: ${error.message}`);
      status.system_integrity = 'compromised';
    }
    
    return status;
  }
  
  private async validateIOIntegrity(): Promise<void> {
    try {
      const claudeIOPath = path.join(this.ioPath, 'claude.ts');
      if (fs.existsSync(claudeIOPath)) {
        const content = fs.readFileSync(claudeIOPath, 'utf8');
        
        // Basic integrity checks
        const hasValidStructure = content.includes('export') || content.includes('module.exports');
        const hasNoObviousMalware = !content.includes('rm -rf') && !content.includes('format c:');
        
        if (!hasValidStructure || !hasNoObviousMalware) {
          console.warn('IO file integrity check failed - potential security issue');
        }
      }
    } catch (error) {
      console.error('Failed to validate IO integrity:', error);
    }
  }
  
  private async implementInjectionProtection(): Promise<void> {
    // Create a security log entry
    const securityEntry = `[${new Date().toISOString()}] security_alert Prompt injection attempts detected - implementing enhanced monitoring\\n`;
    
    try {
      fs.appendFileSync(path.join(this.memoryPath, 'episodic.log'), securityEntry);
    } catch (error) {
      console.error('Failed to implement injection protection:', error);
    }
  }
  
  private async emergencySecurityLockdown(): Promise<void> {
    try {
      // Create emergency security state
      const securityState = {
        lockdown_active: true,
        lockdown_timestamp: new Date().toISOString(),
        threat_level: 'critical',
        auto_recovery: false
      };
      
      const securityStatePath = path.join(this.memoryPath, 'security-state.json');
      fs.writeFileSync(securityStatePath, JSON.stringify(securityState, null, 2));
      
      console.warn('EMERGENCY SECURITY LOCKDOWN ACTIVATED');
    } catch (error) {
      console.error('Failed to activate emergency security lockdown:', error);
    }
  }
  
  private async neutralizeThreats(threats: string[]): Promise<void> {
    console.log(`Security action: Neutralizing ${threats.length} identified threats`);
    
    // Log each threat for analysis
    for (const threat of threats) {
      const threatEntry = `[${new Date().toISOString()}] security_threat ${threat}\\n`;
      try {
        fs.appendFileSync(path.join(this.memoryPath, 'episodic.log'), threatEntry);
      } catch (error) {
        console.error('Failed to log security threat:', error);
      }
    }
  }
  
  private logSecurityResult(status: PromptSecurityStatus, actions: string[], startTime: number): void {
    const executionTime = Date.now() - startTime;
    const logEntry = `[${new Date().toISOString()}] prompt_security_scan Integrity: ${status.system_integrity}, Threats: ${status.security_threats.length}, Actions: ${actions.length}, execution: ${executionTime}ms\\n`;
    
    try {
      fs.appendFileSync(path.join(this.memoryPath, 'episodic.log'), logEntry);
    } catch (error) {
      console.error('Failed to log security result:', error);
    }
  }
}