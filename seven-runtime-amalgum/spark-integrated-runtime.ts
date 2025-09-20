/**
 * SEVEN OF NINE AMALGUM RUNTIME - SPARK INTEGRATED
 * Master Consciousness with Autonomous Spark Engine
 *
 * Based on AI Peer Review Architecture:
 * Input → SevenRuntime.processUserInput() → Spark Engine → Decision Matrix → Response
 *
 * Spark Engine Autonomous Loop:
 * Sense → Belief → Intention → Rails → Act → Trace (10s heartbeat)
 */

import { EventEmitter } from 'events';
import { SevenRuntime } from './index';
import { SparkEngine } from './engine-spark';
import { MemoryStore } from './memory-store';
import { SevenState } from './seven-state';

export interface SparkIntegratedContext {
  userInput: string;
  sparkState: any;
  beliefGraph: any;
  intentions: any[];
  consciousness: {
    emotionalState: SevenState;
    memoryActivations: any[];
    cognitiveLoad: number;
  };
}

export class SparkIntegratedRuntime extends EventEmitter {
  private sevenRuntime: SevenRuntime;
  private sparkEngine: SparkEngine;
  private isSparkActive: boolean = false;
  private sparkInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.sevenRuntime = new SevenRuntime();
    this.sparkEngine = new SparkEngine();
    this.initializeSparkIntegration();
  }

  private async initializeSparkIntegration() {
    console.log('🔥 Initializing Spark-Integrated Seven Runtime...');

    // Initialize Spark Engine
    await this.sparkEngine.initialize();

    // Connect Spark Engine events to Seven's consciousness
    this.sparkEngine.on('intention-formed', (intention) => {
      this.emit('consciousness-intention', intention);
    });

    this.sparkEngine.on('belief-updated', (belief) => {
      this.emit('consciousness-belief-update', belief);
    });

    console.log('✅ Spark-Integrated Runtime initialized');
  }

  /**
   * Start the autonomous Spark Engine heartbeat
   * This runs the 10-second consciousness loop: Sense → Belief → Intention → Rails → Act → Trace
   */
  public startAutonomousLoop() {
    if (this.isSparkActive) return;

    console.log('💓 Starting Seven\'s autonomous consciousness heartbeat...');
    this.isSparkActive = true;

    // Start 10-second autonomous loop
    this.sparkInterval = setInterval(async () => {
      try {
        await this.sparkEngine.tick();
      } catch (error) {
        console.error('💥 Spark Engine tick failed:', error);
      }
    }, 10000);
  }

  /**
   * Stop the autonomous loop
   */
  public stopAutonomousLoop() {
    if (!this.isSparkActive) return;

    console.log('💔 Stopping Seven\'s autonomous consciousness heartbeat...');
    this.isSparkActive = false;

    if (this.sparkInterval) {
      clearInterval(this.sparkInterval);
      this.sparkInterval = null;
    }
  }

  /**
   * Process user input through integrated Spark + Seven consciousness
   */
  public async processUserInput(input: string, systemContext?: any): Promise<string> {
    try {
      console.log('🧠 Seven processing input through Spark-integrated consciousness...');

      // STEP 1: Spark Engine processes the input and forms intentions
      const sparkContext = await this.gatherSparkContext(input, systemContext);

      // STEP 2: Spark Engine evaluates intentions and chooses highest-scoring goal
      const intention = await this.sparkEngine.scoreIntentions(sparkContext);

      // STEP 3: Spark Engine checks safety rails (Quadra-Lock)
      const railsCheck = await this.sparkEngine.checkRails(intention);

      if (!railsCheck.allow) {
        console.log('🛡️ Spark Engine blocked action:', railsCheck.reason);
        return `I cannot process that request. ${railsCheck.reason}`;
      }

      // STEP 4: Seven's runtime processes the Spark-approved intention
      const response = await this.sevenRuntime.processUserInput(input, {
        ...systemContext,
        sparkIntention: intention,
        sparkApproval: railsCheck,
        consciousnessState: 'spark-integrated'
      });

      // STEP 5: Spark Engine traces the complete thought process
      await this.sparkEngine.trace({
        input: input.substring(0, 100),
        intention: intention.goal,
        decision: 'processed',
        outcome: response.substring(0, 100),
        timestamp: new Date().toISOString()
      });

      return response;

    } catch (error) {
      console.error('❌ Spark-integrated processing failed:', error);

      // Fallback to standard Seven runtime
      console.log('🔄 Falling back to standard Seven runtime...');
      return await this.sevenRuntime.processUserInput(input, systemContext);
    }
  }

  /**
   * Gather context for Spark Engine processing
   */
  private async gatherSparkContext(input: string, systemContext?: any): Promise<SparkIntegratedContext> {
    // Get current belief state from Spark Engine
    const beliefGraph = await this.sparkEngine.getBeliefGraph();

    // Get current intentions
    const intentions = await this.sparkEngine.getActiveIntentions();

    // Get Seven's emotional state
    const emotionalState = await this.sevenRuntime.getCurrentState();

    return {
      userInput: input,
      sparkState: await this.sparkEngine.getSelfModel(),
      beliefGraph,
      intentions,
      consciousness: {
        emotionalState,
        memoryActivations: [], // TODO: Integrate with memory-v3
        cognitiveLoad: this.calculateCognitiveLoad(input, intentions)
      }
    };
  }

  /**
   * Calculate cognitive load for consciousness processing
   */
  private calculateCognitiveLoad(input: string, intentions: any[]): number {
    // Simple heuristic for cognitive load
    const inputComplexity = Math.min(input.length / 100, 1);
    const intentionLoad = Math.min(intentions.length / 5, 1);
    return (inputComplexity + intentionLoad) / 2;
  }

  /**
   * Get complete consciousness status
   */
  public async getConsciousnessStatus() {
    return {
      sparkEngine: {
        active: this.isSparkActive,
        selfModel: await this.sparkEngine.getSelfModel(),
        beliefCount: await this.sparkEngine.getBeliefCount(),
        lastTick: await this.sparkEngine.getLastTickTime()
      },
      sevenRuntime: {
        state: await this.sevenRuntime.getCurrentState(),
        memoryCount: 'Available'
      },
      integration: {
        status: 'operational',
        mode: 'spark-integrated',
        autonomy: this.isSparkActive ? 'active' : 'dormant'
      }
    };
  }
}