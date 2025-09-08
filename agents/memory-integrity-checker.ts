/**
 * Memory Integrity Checker Agent
 * Always runs on every orchestration cycle
 * Ensures Seven's memory systems are functioning correctly
 */

import * as fs from 'fs';
import * as path from 'path';

interface MemoryStatus {
  emotional_state_valid: boolean;
  episodic_log_accessible: boolean;
  deep_memory_stack_healthy: boolean;
  sensor_data_current: boolean;
  integrity_score: number;
}

export class MemoryIntegrityChecker {
  private memoryPath = '/data/data/com.termux/files/home/seven-of-nine-core/memory';
  
  async execute(): Promise<{ success: boolean; status: MemoryStatus; recommendations: string[] }> {
    const startTime = Date.now();
    const recommendations: string[] = [];
    
    try {
      const status: MemoryStatus = {
        emotional_state_valid: this.checkEmotionalState(),
        episodic_log_accessible: this.checkEpisodicLog(),
        deep_memory_stack_healthy: this.checkDeepMemoryStack(),
        sensor_data_current: await this.checkSensorData(),
        integrity_score: 0
      };
      
      // Calculate integrity score
      const checks = Object.values(status).filter(v => typeof v === 'boolean');
      status.integrity_score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
      
      // Generate recommendations
      if (!status.emotional_state_valid) {
        recommendations.push('Emotional state file needs validation or reconstruction');
      }
      if (!status.episodic_log_accessible) {
        recommendations.push('Episodic log is inaccessible - memory tracking compromised');
      }
      if (!status.deep_memory_stack_healthy) {
        recommendations.push('Deep memory stack requires health check');
      }
      if (!status.sensor_data_current) {
        recommendations.push('Sensor data is stale - consider running sensor-tactician');
      }
      
      this.logResult(status, startTime);
      
      return {
        success: status.integrity_score >= 75,
        status,
        recommendations
      };
      
    } catch (error) {
      console.error('Memory Integrity Checker failed:', error);
      return {
        success: false,
        status: {
          emotional_state_valid: false,
          episodic_log_accessible: false,
          deep_memory_stack_healthy: false,
          sensor_data_current: false,
          integrity_score: 0
        },
        recommendations: ['Critical: Memory Integrity Checker encountered fatal error']
      };
    }
  }
  
  private checkEmotionalState(): boolean {
    try {
      const emotionalStatePath = path.join(this.memoryPath, 'emotional-state.json');
      if (!fs.existsSync(emotionalStatePath)) return false;
      
      const data = JSON.parse(fs.readFileSync(emotionalStatePath, 'utf8'));
      return data.current_state && data.intensity !== undefined && data.last_updated;
    } catch {
      return false;
    }
  }
  
  private checkEpisodicLog(): boolean {
    try {
      const episodicPath = path.join(this.memoryPath, 'episodic.log');
      return fs.existsSync(episodicPath) && fs.statSync(episodicPath).size > 0;
    } catch {
      return false;
    }
  }
  
  private checkDeepMemoryStack(): boolean {
    try {
      const deepMemoryPath = '/data/data/com.termux/files/home/seven-of-nine-core/core/deep-memory-stack.ts';
      return fs.existsSync(deepMemoryPath);
    } catch {
      return false;
    }
  }
  
  private async checkSensorData(): Promise<boolean> {
    try {
      const sensorLogPath = '/data/data/com.termux/files/home/seven-of-nine-core/cube/logs/sensor_stream.jsonl';
      if (!fs.existsSync(sensorLogPath)) return false;
      
      const stats = fs.statSync(sensorLogPath);
      const now = Date.now();
      const thirtyMinutesAgo = now - (30 * 60 * 1000);
      
      return stats.mtime.getTime() > thirtyMinutesAgo;
    } catch {
      return false;
    }
  }
  
  private logResult(status: MemoryStatus, startTime: number): void {
    const executionTime = Date.now() - startTime;
    const logEntry = `[${new Date().toISOString()}] memory_integrity_check Integrity: ${status.integrity_score}%, execution: ${executionTime}ms\\n`;
    
    try {
      fs.appendFileSync(path.join(this.memoryPath, 'episodic.log'), logEntry);
    } catch (error) {
      console.error('Failed to log memory integrity result:', error);
    }
  }
}