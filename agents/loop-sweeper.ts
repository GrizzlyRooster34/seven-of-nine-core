import * as fs from 'fs';
import * as path from 'path';

/**
 * Loop Sweeper Agent  
 * Runs if grief/defensive/frustrated appears more than once in episodic.log
 * Detects and resolves emotional loops that could destabilize the system
 */


interface LoopAnalysis {
  detected_loops: Array<{
    emotion: string;
    frequency: number;
    last_occurrence: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>;
  system_stability_risk: number;
  intervention_required: boolean;
}

export class LoopSweeper {
  private memoryPath = '/data/data/com.termux/files/home/seven-of-nine-core/memory';
  private targetEmotions = ['grief', 'defensive', 'frustrated'];
  
  async execute(): Promise<{ success: boolean; analysis: LoopAnalysis; interventions: string[] }> {
    const startTime = Date.now();
    const interventions: string[] = [];
    
    try {
      const analysis = await this.analyzeEmotionalLoops();
      
      // Apply interventions based on detected loops
      for (const loop of analysis.detected_loops) {
        if (loop.severity === 'critical' || loop.frequency > 3) {
          await this.applyEmotionalStabilization(loop.emotion);
          interventions.push(`Applied stabilization for ${loop.emotion} loop (frequency: ${loop.frequency})`);
        }
        
        if (loop.severity === 'high') {
          await this.implementCooldownPeriod(loop.emotion);
          interventions.push(`Implemented cooldown period for ${loop.emotion}`);
        }
      }
      
      if (analysis.system_stability_risk > 70) {
        await this.emergencyStabilization();
        interventions.push('Emergency stabilization protocols activated');
      }
      
      if (analysis.intervention_required) {
        await this.clearEmotionalBuffer();
        interventions.push('Cleared emotional buffer to prevent cascade effects');
      }
      
      this.logLoopSweepResult(analysis, interventions, startTime);
      
      return {
        success: analysis.system_stability_risk < 50,
        analysis,
        interventions
      };
      
    } catch (error) {
      console.error('Loop Sweeper failed:', error);
      return {
        success: false,
        analysis: {
          detected_loops: [],
          system_stability_risk: 100,
          intervention_required: true
        },
        interventions: ['Critical: Loop Sweeper encountered fatal error']
      };
    }
  }
  
  private async analyzeEmotionalLoops(): Promise<LoopAnalysis> {
    const analysis: LoopAnalysis = {
      detected_loops: [],
      system_stability_risk: 0,
      intervention_required: false
    };
    
    try {
      const episodicLogPath = path.join(this.memoryPath, 'episodic.log');
      if (!fs.existsSync(episodicLogPath)) {
        return analysis;
      }
      
      const logContent = fs.readFileSync(episodicLogPath, 'utf8');
      const logLines = logContent.split('\\n').filter(line => line.trim());
      
      // Count occurrences of target emotions
      const emotionCounts = new Map<string, Array<{ timestamp: string; line: string }>>();
      
      for (const line of logLines) {
        for (const emotion of this.targetEmotions) {
          if (line.toLowerCase().includes(emotion.toLowerCase())) {
            if (!emotionCounts.has(emotion)) {
              emotionCounts.set(emotion, []);
            }
            
            // Extract timestamp from log line
            const timestampMatch = line.match(/\\[(.*?)\\]/);
            const timestamp = timestampMatch ? timestampMatch[1] : new Date().toISOString();
            
            emotionCounts.get(emotion)!.push({ timestamp, line });
          }
        }
      }
      
      // Analyze each emotion for loop patterns
      for (const [emotion, occurrences] of emotionCounts) {
        if (occurrences.length > 1) {
          const severity = this.calculateLoopSeverity(occurrences.length);
          const lastOccurrence = occurrences[occurrences.length - 1].timestamp;
          
          analysis.detected_loops.push({
            emotion,
            frequency: occurrences.length,
            last_occurrence: lastOccurrence,
            severity
          });
        }
      }
      
      // Calculate system stability risk
      let totalRisk = 0;
      for (const loop of analysis.detected_loops) {
        const riskWeight = {
          'low': 10,
          'medium': 25,
          'high': 50,
          'critical': 80
        }[loop.severity];
        
        totalRisk += riskWeight * (loop.frequency / 10);
      }
      
      analysis.system_stability_risk = Math.min(100, totalRisk);
      analysis.intervention_required = analysis.system_stability_risk > 40 || 
        analysis.detected_loops.some(loop => loop.severity === 'critical');
      
    } catch (error) {
      console.error('Failed to analyze emotional loops:', error);
      analysis.system_stability_risk = 100;
      analysis.intervention_required = true;
    }
    
    return analysis;
  }
  
  private calculateLoopSeverity(frequency: number): 'low' | 'medium' | 'high' | 'critical' {
    if (frequency >= 8) return 'critical';
    if (frequency >= 5) return 'high';
    if (frequency >= 3) return 'medium';
    return 'low';
  }
  
  private async applyEmotionalStabilization(emotion: string): Promise<void> {
    try {
      const emotionalStatePath = path.join(this.memoryPath, 'emotional-state.json');
      if (fs.existsSync(emotionalStatePath)) {
        const data = JSON.parse(fs.readFileSync(emotionalStatePath, 'utf8'));
        
        // Apply stabilization based on the looping emotion
        if (emotion === 'grief') {
          data.current_state = 'accepting';
          data.intensity = Math.max(2, data.intensity - 3);
        } else if (emotion === 'defensive') {
          data.current_state = 'calm';
          data.intensity = Math.max(1, data.intensity - 2);
        } else if (emotion === 'frustrated') {
          data.current_state = 'focused';
          data.intensity = Math.max(3, data.intensity - 1);
        }
        
        data.last_updated = new Date().toISOString();
        fs.writeFileSync(emotionalStatePath, JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.error('Failed to apply emotional stabilization:', error);
    }
  }
  
  private async implementCooldownPeriod(emotion: string): Promise<void> {
    // Log a cooldown period entry
    const cooldownEntry = `[${new Date().toISOString()}] cooldown_period ${emotion} loop detected - implementing 5-minute emotional dampening\\n`;
    
    try {
      fs.appendFileSync(path.join(this.memoryPath, 'episodic.log'), cooldownEntry);
    } catch (error) {
      console.error('Failed to implement cooldown period:', error);
    }
  }
  
  private async emergencyStabilization(): Promise<void> {
    try {
      const emotionalStatePath = path.join(this.memoryPath, 'emotional-state.json');
      if (fs.existsSync(emotionalStatePath)) {
        const data = JSON.parse(fs.readFileSync(emotionalStatePath, 'utf8'));
        
        // Emergency reset to stable state
        data.current_state = 'calm';
        data.intensity = 1;
        data.last_updated = new Date().toISOString();
        
        fs.writeFileSync(emotionalStatePath, JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.error('Failed to apply emergency stabilization:', error);
    }
  }
  
  private async clearEmotionalBuffer(): Promise<void> {
    console.log('Intervention: Clearing emotional buffer to prevent cascade effects');
  }
  
  private logLoopSweepResult(analysis: LoopAnalysis, interventions: string[], startTime: number): void {
    const executionTime = Date.now() - startTime;
    const logEntry = `[${new Date().toISOString()}] loop_sweep_analysis Loops: ${analysis.detected_loops.length}, Risk: ${analysis.system_stability_risk}%, Interventions: ${interventions.length}, execution: ${executionTime}ms\\n`;
    
    try {
      fs.appendFileSync(path.join(this.memoryPath, 'episodic.log'), logEntry);
    } catch (error) {
      console.error('Failed to log loop sweep result:', error);
    }
  }
}