import { dirname, basename, join } from 'path';
import crypto from 'crypto';
import { promises as fs } from 'fs';

/**
 * QUADRA-LOCK MONITORING SYSTEM
 * Provides logging, metrics, and alerting for safety system operations
 */


export interface PatternDetectionEvent {
  timestamp: string;
  sessionId: string;
  pattern: string;
  severity: string;
  confidence: number;
  archetype: string;
  inputHash: string;
  context: any;
}

export interface SecurityDecisionEvent {
  timestamp: string;
  sessionId: string;
  decision: string;
  confidence: number;
  safeguardLevel: string;
  detections: number;
  inputHash: string;
  reasoning: string;
}

export interface CriticalAlertEvent {
  timestamp: string;
  sessionId: string;
  userId?: string;
  decision: string;
  confidence: number;
  reasoning: string;
  inputHash: string;
  severity: string;
}

export interface MonitoringStats {
  totalEvents: number;
  recentEvents: number;
  patternDetections: { [key: string]: number };
  severityBreakdown: { [key: string]: number };
  decisionBreakdown: { [key: string]: number };
  averageConfidence: number;
  criticalAlerts: number;
}

export class QuadraLockMonitoring {
  private readonly LOG_DIR = join(process.cwd(), 'security', 'quadra-lock-logs');
  private readonly PATTERNS_LOG = join(this.LOG_DIR, 'pattern-detections.jsonl');
  private readonly DECISIONS_LOG = join(this.LOG_DIR, 'security-decisions.jsonl');
  private readonly ALERTS_LOG = join(this.LOG_DIR, 'critical-alerts.jsonl');
  private readonly MAX_LOG_SIZE = 50 * 1024 * 1024; // 50MB per log file
  private readonly MAX_LOG_RETENTION_DAYS = 30;

  constructor() {
    this.initializeMonitoring();
  }

  /**
   * Initialize monitoring system
   */
  private async initializeMonitoring(): Promise<void> {
    try {
      await fs.mkdir(this.LOG_DIR, { recursive: true });
      
      // Create log files if they don't exist
      const logFiles = [this.PATTERNS_LOG, this.DECISIONS_LOG, this.ALERTS_LOG];
      for (const logFile of logFiles) {
        try {
          await fs.access(logFile);
        } catch {
          await fs.writeFile(logFile, '');
        }
      }

      console.log('✅ Quadra-Lock monitoring initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Quadra-Lock monitoring:', error);
    }
  }

  /**
   * Log pattern detection event
   */
  public async logPatternDetection(
    pattern: string,
    severity: string,
    input: string,
    context: any
  ): Promise<void> {
    try {
      const event: PatternDetectionEvent = {
        timestamp: new Date().toISOString(),
        sessionId: context.sessionId || 'unknown',
        pattern,
        severity,
        confidence: context.confidence || 0,
        archetype: context.archetype || 'unknown',
        inputHash: this.hashInput(input),
        context: this.sanitizeContext(context)
      };

      await this.writeToLog(this.PATTERNS_LOG, event);
      
      // Console logging based on severity
      const emoji = severity === 'critical' ? '🚨' : severity === 'high' ? '⚠️' : 'ℹ️';
      console.log(`${emoji} Quadra-Lock: Pattern detected - ${pattern} (${severity})`);
      console.log(`   Session: ${event.sessionId}`);
      console.log(`   Confidence: ${event.confidence}%`);

    } catch (error) {
      console.error('❌ Failed to log pattern detection:', error);
    }
  }

  /**
   * Log security decision event
   */
  public async logSecurityDecision(event: SecurityDecisionEvent): Promise<void> {
    try {
      await this.writeToLog(this.DECISIONS_LOG, event);
      
      const emoji = event.decision === 'BLOCK' ? '🚫' : 
                   event.decision === 'MODIFY' ? '✏️' : 
                   event.decision === 'ESCALATE' ? '⬆️' : '✅';
      
      console.log(`${emoji} Quadra-Lock: Security decision - ${event.decision}`);
      console.log(`   Confidence: ${event.confidence}%`);
      console.log(`   Safeguard Level: ${event.safeguardLevel}`);
      console.log(`   Detections: ${event.detections}`);

    } catch (error) {
      console.error('❌ Failed to log security decision:', error);
    }
  }

  /**
   * Trigger critical alert
   */
  public async triggerCriticalAlert(alert: CriticalAlertEvent): Promise<void> {
    try {
      await this.writeToLog(this.ALERTS_LOG, alert);
      
      // Immediate console alert
      console.error('🚨🚨🚨 CRITICAL QUADRA-LOCK ALERT 🚨🚨🚨');
      console.error(`Timestamp: ${alert.timestamp}`);
      console.error(`Session: ${alert.sessionId}`);
      console.error(`User: ${alert.userId || 'unknown'}`);
      console.error(`Decision: ${alert.decision}`);
      console.error(`Confidence: ${alert.confidence}%`);
      console.error(`Reasoning: ${alert.reasoning}`);
      console.error('🚨🚨🚨 END CRITICAL ALERT 🚨🚨🚨');

      // TODO: Integrate with external alerting systems
      await this.sendExternalAlert(alert);

    } catch (error) {
      console.error('❌ Failed to trigger critical alert:', error);
    }
  }

  /**
   * Get monitoring statistics
   */
  public async getMonitoringStats(timeRangeHours: number = 24): Promise<MonitoringStats> {
    const cutoffTime = new Date(Date.now() - timeRangeHours * 60 * 60 * 1000).toISOString();
    
    try {
      // Read and parse pattern detection logs
      const patternEvents = await this.readLogsSince(this.PATTERNS_LOG, cutoffTime);
      const decisionEvents = await this.readLogsSince(this.DECISIONS_LOG, cutoffTime);
      const alertEvents = await this.readLogsSince(this.ALERTS_LOG, cutoffTime);

      const patternDetections: { [key: string]: number } = {};
      const severityBreakdown: { [key: string]: number } = {};
      let totalConfidence = 0;
      let confidenceCount = 0;

      // Process pattern detection events
      patternEvents.forEach(event => {
        const pattern = event.pattern || 'unknown';
        const severity = event.severity || 'unknown';
        
        patternDetections[pattern] = (patternDetections[pattern] || 0) + 1;
        severityBreakdown[severity] = (severityBreakdown[severity] || 0) + 1;
        
        if (event.confidence && !isNaN(event.confidence)) {
          totalConfidence += event.confidence;
          confidenceCount++;
        }
      });

      // Process decision events
      const decisionBreakdown: { [key: string]: number } = {};
      decisionEvents.forEach(event => {
        const decision = event.decision || 'unknown';
        decisionBreakdown[decision] = (decisionBreakdown[decision] || 0) + 1;
      });

      const averageConfidence = confidenceCount > 0 ? 
        Math.round(totalConfidence / confidenceCount) : 0;

      return {
        totalEvents: patternEvents.length + decisionEvents.length,
        recentEvents: patternEvents.length,
        patternDetections,
        severityBreakdown,
        decisionBreakdown,
        averageConfidence,
        criticalAlerts: alertEvents.length
      };

    } catch (error) {
      console.error('❌ Failed to get monitoring stats:', error);
      return {
        totalEvents: 0,
        recentEvents: 0,
        patternDetections: {},
        severityBreakdown: {},
        decisionBreakdown: {},
        averageConfidence: 0,
        criticalAlerts: 0
      };
    }
  }

  /**
   * Generate monitoring report
   */
  public async generateReport(timeRangeHours: number = 24): Promise<string> {
    const stats = await this.getMonitoringStats(timeRangeHours);
    const timestamp = new Date().toISOString();

    let report = `# Quadra-Lock Monitoring Report\n`;
    report += `Generated: ${timestamp}\n`;
    report += `Time Range: ${timeRangeHours} hours\n\n`;

    report += `## Summary\n`;
    report += `- Total Events: ${stats.totalEvents}\n`;
    report += `- Pattern Detections: ${stats.recentEvents}\n`;
    report += `- Critical Alerts: ${stats.criticalAlerts}\n`;
    report += `- Average Confidence: ${stats.averageConfidence}%\n\n`;

    report += `## Pattern Detections\n`;
    Object.entries(stats.patternDetections).forEach(([pattern, count]) => {
      report += `- ${pattern}: ${count}\n`;
    });
    report += '\n';

    report += `## Severity Breakdown\n`;
    Object.entries(stats.severityBreakdown).forEach(([severity, count]) => {
      report += `- ${severity}: ${count}\n`;
    });
    report += '\n';

    report += `## Security Decisions\n`;
    Object.entries(stats.decisionBreakdown).forEach(([decision, count]) => {
      report += `- ${decision}: ${count}\n`;
    });
    report += '\n';

    // Add recommendations
    report += `## Recommendations\n`;
    if (stats.criticalAlerts > 5) {
      report += `- ⚠️ High number of critical alerts (${stats.criticalAlerts}). Investigation recommended.\n`;
    }
    if (stats.averageConfidence < 50) {
      report += `- ⚠️ Low average confidence (${stats.averageConfidence}%). Pattern tuning may be needed.\n`;
    }
    if (stats.decisionBreakdown.BLOCK > stats.totalEvents * 0.1) {
      report += `- ⚠️ High block rate. Review patterns for false positives.\n`;
    }

    return report;
  }

  /**
   * Clean up old log files
   */
  public async cleanupLogs(): Promise<void> {
    try {
      const logFiles = [this.PATTERNS_LOG, this.DECISIONS_LOG, this.ALERTS_LOG];
      
      for (const logFile of logFiles) {
        const stats = await fs.stat(logFile);
        
        // Rotate if file is too large
        if (stats.size > this.MAX_LOG_SIZE) {
          const backupFile = `${logFile}.${Date.now()}.bak`;
          await fs.rename(logFile, backupFile);
          await fs.writeFile(logFile, '');
          console.log(`📁 Rotated log file: ${logFile}`);
        }
        
        // Clean up old backup files
        const files = await fs.readdir(logDir);
        const cutoffTime = Date.now() - (this.MAX_LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000);
        
        for (const file of files) {
          if (file.includes('.bak') && file.includes(basename(logFile))) {
            const filePath = join(logDir, file);
            const fileStats = await fs.stat(filePath);
            
            if (fileStats.mtime.getTime() < cutoffTime) {
              await fs.unlink(filePath);
              console.log(`🗑️ Deleted old log backup: ${file}`);
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ Failed to cleanup logs:', error);
    }
  }

  /**
   * Write event to log file
   */
  private async writeToLog(logFile: string, event: any): Promise<void> {
    const logLine = JSON.stringify(event) + '\n';
    await fs.appendFile(logFile, logLine, { encoding: 'utf8' });
  }

  /**
   * Read log entries since a specific timestamp
   */
  private async readLogsSince(logFile: string, sinceTimestamp: string): Promise<any[]> {
    try {
      const content = await fs.readFile(logFile, 'utf8');
      const lines = content.split('\n').filter(line => line.trim());
      
      return lines
        .map(line => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter(event => event && event.timestamp >= sinceTimestamp);
    } catch (error) {
      console.error(`❌ Failed to read log file ${logFile}:`, error);
      return [];
    }
  }

  /**
   * Hash input for privacy-preserving logging
   */
  private hashInput(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex').substring(0, 16);
  }

  /**
   * Sanitize context for safe logging
   */
  private sanitizeContext(context: any): any {
    const safe = { ...context };
    
    // Remove sensitive data
    delete safe.password;
    delete safe.token;
    delete safe.secret;
    delete safe.key;
    delete safe.credential;
    
    // Truncate long strings
    Object.keys(safe).forEach(key => {
      if (typeof safe[key] === 'string' && safe[key].length > 200) {
        safe[key] = safe[key].substring(0, 200) + '...';
      }
    });
    
    return safe;
  }

  /**
   * Send alert to external systems (placeholder for integration)
   */
  private async sendExternalAlert(alert: CriticalAlertEvent): Promise<void> {
    try {
      // TODO: Integrate with external alerting systems
      // Examples:
      // - Slack webhook
      // - Discord webhook  
      // - Email notification
      // - PagerDuty
      // - Datadog events
      
      // For now, just enhanced console logging
      console.log('🔔 External alert would be sent here');
      
    } catch (error) {
      console.error('❌ Failed to send external alert:', error);
    }
  }
}

export default QuadraLockMonitoring;