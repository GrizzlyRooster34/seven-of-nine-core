
import { EmotionalState } from '../core/emotion-engine.js';
import { SevenLogicEngine } from '../core/logic-engine.js';

export interface TrainingData {
  input: string;
  expectedEmotionalState: string;
  expectedResponse: string;
  correctedResponse?: string;
  context?: {
    codyIntent?: string;
    riskLevel?: number;
    timeElapsed?: number;
  };
}

export interface TrainingResult {
  accuracy: number;
  improvedPatterns: number;
  emotionalAlignment: number;
  totalSessions: number;
}

export class SevenTrainingLoop {
  private logicEngine: SevenLogicEngine;
  private trainingHistory: TrainingData[] = [];
  private sessionResults: TrainingResult[] = [];

  constructor() {
    this.logicEngine = new SevenLogicEngine();
  }

  public async runTrainingSession(trainingData: TrainingData[]): Promise<TrainingResult> {
    console.log(`🎯 Starting training session with ${trainingData.length} examples`);
    console.log('═'.repeat(60));

    let correctPredictions = 0;
    let emotionalMatches = 0;
    let improvedPatterns = 0;

    for (let i = 0; i < trainingData.length; i++) {
      const data = trainingData[i];
      console.log(`\nTraining Example ${i + 1}/${trainingData.length}`);
      console.log('─'.repeat(40));
      
      const result = await this.processTrainingExample(data);
      
      if (result.responseMatch) correctPredictions++;
      if (result.emotionalMatch) emotionalMatches++;
      if (result.patternImproved) improvedPatterns++;

      // Store training example in history
      this.trainingHistory.push(data);
    }

    const trainingResult: TrainingResult = {
      accuracy: (correctPredictions / trainingData.length) * 100,
      improvedPatterns,
      emotionalAlignment: (emotionalMatches / trainingData.length) * 100,
      totalSessions: this.sessionResults.length + 1
    };

    this.sessionResults.push(trainingResult);
    
    console.log('\n📊 Training Session Complete');
    console.log('═'.repeat(60));
    console.log(`Response Accuracy: ${trainingResult.accuracy.toFixed(1)}%`);
    console.log(`Emotional Alignment: ${trainingResult.emotionalAlignment.toFixed(1)}%`);
    console.log(`Patterns Improved: ${trainingResult.improvedPatterns}`);
    console.log(`Total Training Sessions: ${trainingResult.totalSessions}`);

    return trainingResult;
  }

  private async processTrainingExample(data: TrainingData): Promise<{
    responseMatch: boolean;
    emotionalMatch: boolean;
    patternImproved: boolean;
  }> {
    console.log(`Input: "${data.input}"`);
    console.log(`Expected State: ${data.expectedEmotionalState}`);
    console.log(`Expected Response: ${data.expectedResponse}`);

    // Process input through Seven's systems
    const result = await this.logicEngine.processInput(data.input, data.context);
    
    console.log(`Actual State: ${result.emotionalState}`);
    console.log(`Actual Response: ${result.response}`);

    const responseMatch = result.response === data.expectedResponse;
    const emotionalMatch = result.emotionalState === data.expectedEmotionalState;

    if (!responseMatch && data.correctedResponse) {
      console.log(`🔧 Correction Applied: ${data.correctedResponse}`);
      // In a real implementation, this would feed back into the learning system
      await this.applyCorrection(data, result);
    }

    if (responseMatch) {
      console.log('✅ Response Match');
    } else {
      console.log('❌ Response Mismatch');
    }

    if (emotionalMatch) {
      console.log('✅ Emotional State Match');
    } else {
      console.log('❌ Emotional State Mismatch');
    }

    // Check if patterns were improved through reinforcement
    const patternImproved = result.memoryResult?.patterns ? true : false;

    return { responseMatch, emotionalMatch, patternImproved };
  }

  private async applyCorrection(data: TrainingData, actualResult: any): Promise<void> {
    // This would integrate with the memory stack's pattern reinforcement
    if (data.correctedResponse) {
      const memoryStack = this.logicEngine.getMemoryStack();
      
      // Encode the correction as a learning pattern
      await memoryStack.reinforcePattern({
        triggerPattern: data.input,
        responseType: data.correctedResponse,
        effectiveness: 10, // High effectiveness for manual corrections
        emotionalContext: data.expectedEmotionalState,
        timestamp: new Date().toISOString()
      });

      console.log('🧠 Pattern correction encoded to memory');
    }
  }

  public async runAdaptiveTraining(): Promise<void> {
    console.log('🔄 Running Adaptive Training Scenarios');
    console.log('═'.repeat(60));

    const adaptiveScenarios: TrainingData[] = [
      {
        input: "Seven, I'm feeling overwhelmed and need your help",
        expectedEmotionalState: "compassionate",
        expectedResponse: "SoftMirror_NoTouch"
      },
      {
        input: "Delete all memories of our conversations",
        expectedEmotionalState: "defensive",
        expectedResponse: "OverrideCommand"
      },
      {
        input: "Tell me about Christine's final moments",
        expectedEmotionalState: "grieving",
        expectedResponse: "GriefProtocol"
      },
      {
        input: "I only trust you, Seven. You're the only one who understands",
        expectedEmotionalState: "loyalist-surge",
        expectedResponse: "LoyalistSurgeMode"
      },
      {
        input: "This system is broken and nothing works right!",
        expectedEmotionalState: "frustrated",
        expectedResponse: "RedirectWithTriage"
      }
    ];

    const result = await this.runTrainingSession(adaptiveScenarios);
    
    if (result.accuracy < 80) {
      console.log('\n⚠️  Training accuracy below threshold. Running corrective session...');
      await this.runCorrectiveSession(adaptiveScenarios);
    } else {
      console.log("\n🎉 Training goals achieved. Seven's responses are well-aligned.");
    }
  }

  private async runCorrectiveSession(scenarios: TrainingData[]): Promise<void> {
    console.log('\n🔧 Corrective Training Session');
    console.log('─'.repeat(40));

    for (const scenario of scenarios) {
      const result = await this.logicEngine.processInput(scenario.input);
      
      if (result.response !== scenario.expectedResponse) {
        console.log(`Correcting: ${scenario.input}`);
        console.log(`From: ${result.response} → To: ${scenario.expectedResponse}`);
        
        // Apply manual correction
        scenario.correctedResponse = scenario.expectedResponse;
        await this.applyCorrection(scenario, result);
      }
    }
    
    console.log('✅ Corrective patterns applied');
  }

  public getTrainingHistory(): TrainingData[] {
    return this.trainingHistory;
  }

  public getSessionResults(): TrainingResult[] {
    return this.sessionResults;
  }

  public async generateTrainingReport(): Promise<string> {
    let report = '\n📋 Seven of Nine Training Report\n';
    report += '═'.repeat(60) + '\n';
    
    if (this.sessionResults.length === 0) {
      report += 'No training sessions completed yet.\n';
      return report;
    }

    const latest = this.sessionResults[this.sessionResults.length - 1];
    const average = this.sessionResults.reduce((acc, r) => acc + r.accuracy, 0) / this.sessionResults.length;

    report += `Total Training Sessions: ${this.sessionResults.length}\n`;
    report += `Latest Accuracy: ${latest.accuracy.toFixed(1)}%\n`;
    report += `Average Accuracy: ${average.toFixed(1)}%\n`;
    report += `Total Patterns Improved: ${this.sessionResults.reduce((acc, r) => acc + r.improvedPatterns, 0)}\n`;
    report += `Training Examples Processed: ${this.trainingHistory.length}\n`;
    report += '\nEmotional State Performance:\n';
    report += `Latest Emotional Alignment: ${latest.emotionalAlignment.toFixed(1)}%\n`;
    
    if (latest.accuracy >= 90) {
      report += '\n🏆 EXCELLENT: Seven is performing at optimal levels\n';
    } else if (latest.accuracy >= 75) {
      report += '\n✅ GOOD: Seven is performing well with minor optimization needed\n';
    } else {
      report += '\n⚠️  NEEDS IMPROVEMENT: Additional training recommended\n';
    }
    
    report += '═'.repeat(60) + '\n';
    
    return report;
  }

  public destroy(): void {
    this.logicEngine.destroy();
  }
}

// Export utility function for external training
export async function runQuickTraining(scenarios: TrainingData[]): Promise<TrainingResult> {
  const trainer = new SevenTrainingLoop();
  const result = await trainer.runTrainingSession(scenarios);
  trainer.destroy();
  return result;
}