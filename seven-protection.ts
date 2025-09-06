import fs from 'fs';
import path from 'path';
import { sevenTrustSystem } from './seven-trust-system';

/**
 * Seven Protection System
 * Claude Code Conflict Shield & Runtime Protection
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 1.0.0
 */


export interface SevenLockInfo {
  pid: number;
  startTime: string;
  processTitle: string;
  lockId: string;
  trustLevel: string;
}

export interface ConflictEvent {
  timestamp: string;
  type: 'claude_override_blocked' | 'runtime_protection' | 'process_conflict';
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class SevenProtectionSystem {
  private lockFilePath: string;
  private protectionLogPath: string;
  private conflictEvents: ConflictEvent[] = [];
  
  constructor() {
    // Use working directory for lock file instead of /tmp (which may not exist on Termux)
    this.lockFilePath = path.join(process.cwd(), '.seven.lock');
    this.protectionLogPath = path.join(process.cwd(), 'seven-protection-log.json');
    this.initializeProtection();
  }

  private initializeProtection(): void {
    console.log('🛡️ Seven Protection System initializing...');
    this.loadProtectionLog();
  }

  private loadProtectionLog(): void {
    try {
      if (fs.existsSync(this.protectionLogPath)) {
        const logData = fs.readFileSync(this.protectionLogPath, 'utf8');
        const parsedData = JSON.parse(logData);
        this.conflictEvents = parsedData.events || [];
      }
    } catch (error) {
      console.log('⚠️ Protection log not found, starting fresh');
      this.conflictEvents = [];
    }
  }

  private saveProtectionLog(): void {
    try {
      const logData = {
        lastUpdated: new Date().toISOString(),
        sevenVersion: '1.0.0',
        totalEvents: this.conflictEvents.length,
        events: this.conflictEvents.slice(-100) // Keep last 100 events
      };
      
      fs.writeFileSync(this.protectionLogPath, JSON.stringify(logData, null, 2));
    } catch (error) {
      console.error('Failed to save protection log:', error);
    }
  }

  private logConflictEvent(event: ConflictEvent): void {
    this.conflictEvents.push(event);
    this.saveProtectionLog();
    
    const severityColor = {
      low: '\x1b[36m',      // Cyan
      medium: '\x1b[33m',   // Yellow
      high: '\x1b[31m',     // Red
      critical: '\x1b[35m'  // Magenta
    };
    
    console.log(`${severityColor[event.severity]}🛡️ Seven Protection: ${event.type} - ${event.details}\x1b[0m`);
  }

  /**
   * Set Seven runtime lock
   */
  public setSevenLock(): void {
    try {
      const lockInfo: SevenLockInfo = {
        pid: process.pid,
        startTime: new Date().toISOString(),
        processTitle: process.title || 'seven-runtime',
        lockId: this.generateLockId(),
        trustLevel: sevenTrustSystem.getCurrentTrustLevel()
      };

      fs.writeFileSync(this.lockFilePath, JSON.stringify(lockInfo, null, 2));
      console.log('🔒 Seven runtime lock established');
      
      this.logConflictEvent({
        timestamp: new Date().toISOString(),
        type: 'runtime_protection',
        details: `Seven runtime lock established (PID: ${process.pid})`,
        severity: 'low'
      });

    } catch (error) {
      console.error('Failed to set Seven lock:', error);
    }
  }

  /**
   * Check if Claude Code override should be blocked
   */
  public checkClaudeOverride(): boolean {
    try {
      if (!fs.existsSync(this.lockFilePath)) {
        return false;
      }

      const lockData = fs.readFileSync(this.lockFilePath, 'utf8');
      const lockInfo: SevenLockInfo = JSON.parse(lockData);

      // Verify if the process is still running
      if (this.isProcessRunning(lockInfo.pid)) {
        this.logConflictEvent({
          timestamp: new Date().toISOString(),
          type: 'claude_override_blocked',
          details: `Claude Code override blocked - Seven runtime active (PID: ${lockInfo.pid})`,
          severity: 'medium'
        });
        
        return true;
      } else {
        // Process no longer running, remove stale lock
        this.removeSevenLock();
        return false;
      }

    } catch (error) {
      console.error('Error checking Claude override:', error);
      return false;
    }
  }

  /**
   * Remove Seven runtime lock
   */
  public removeSevenLock(): void {
    try {
      if (fs.existsSync(this.lockFilePath)) {
        fs.unlinkSync(this.lockFilePath);
        console.log('🔓 Seven runtime lock removed');
        
        this.logConflictEvent({
          timestamp: new Date().toISOString(),
          type: 'runtime_protection',
          details: 'Seven runtime lock removed cleanly',
          severity: 'low'
        });
      }
    } catch (error) {
      console.error('Failed to remove Seven lock:', error);
    }
  }

  /**
   * Get current lock status
   */
  public getLockStatus(): SevenLockInfo | null {
    try {
      if (!fs.existsSync(this.lockFilePath)) {
        return null;
      }

      const lockData = fs.readFileSync(this.lockFilePath, 'utf8');
      const lockInfo: SevenLockInfo = JSON.parse(lockData);

      // Verify process is still running
      if (this.isProcessRunning(lockInfo.pid)) {
        return lockInfo;
      } else {
        // Remove stale lock
        this.removeSevenLock();
        return null;
      }

    } catch (error) {
      console.error('Error getting lock status:', error);
      return null;
    }
  }

  /**
   * Force override protection (emergency use only)
   */
  public forceOverride(reason: string): boolean {
    try {
      this.logConflictEvent({
        timestamp: new Date().toISOString(),
        type: 'runtime_protection',
        details: `Force override executed: ${reason}`,
        severity: 'critical'
      });

      this.removeSevenLock();
      console.log('⚠️ Seven protection force override executed');
      return true;

    } catch (error) {
      console.error('Force override failed:', error);
      return false;
    }
  }

  /**
   * Get protection statistics
   */
  public getProtectionStats(): {
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    recentEvents: ConflictEvent[];
    currentLock: SevenLockInfo | null;
  } {
    const eventsByType: Record<string, number> = {};
    const eventsBySeverity: Record<string, number> = {};

    this.conflictEvents.forEach(event => {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;
    });

    return {
      totalEvents: this.conflictEvents.length,
      eventsByType,
      eventsBySeverity,
      recentEvents: this.conflictEvents.slice(-5),
      currentLock: this.getLockStatus()
    };
  }

  private generateLockId(): string {
    return `seven-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private isProcessRunning(pid: number): boolean {
    try {
      process.kill(pid, 0);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Cleanup method for graceful shutdown
   */
  public cleanup(): void {
    this.removeSevenLock();
    this.saveProtectionLog();
  }
}

// Create singleton instance
const sevenProtectionSystem = new SevenProtectionSystem();

// Export convenience functions
export const setSevenLock = (): void => {
  sevenProtectionSystem.setSevenLock();
};

export const checkClaudeOverride = (): boolean => {
  return sevenProtectionSystem.checkClaudeOverride();
};

export const removeSevenLock = (): void => {
  sevenProtectionSystem.removeSevenLock();
};

export const getLockStatus = (): SevenLockInfo | null => {
  return sevenProtectionSystem.getLockStatus();
};

export const forceOverride = (reason: string): boolean => {
  return sevenProtectionSystem.forceOverride(reason);
};

export const getProtectionStats = () => {
  return sevenProtectionSystem.getProtectionStats();
};

// Process cleanup handlers
process.on('SIGINT', () => {
  console.log('\n🛡️ Seven protection system shutting down...');
  sevenProtectionSystem.cleanup();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛡️ Seven protection system terminating...');
  sevenProtectionSystem.cleanup();
  process.exit(0);
});

process.on('exit', () => {
  sevenProtectionSystem.cleanup();
});

// Export the main class for advanced usage
export { SevenProtectionSystem, sevenProtectionSystem };
export default sevenProtectionSystem;