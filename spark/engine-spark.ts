import Database from 'better-sqlite3';
import { EventEmitter } from 'events';
import { createHash } from 'crypto';
import CodexManager from '../consciousness-v4/codex/codex-manager';
import { BeliefGraph } from '../db/init-spark-db';
import { 
  SelfModel, 
  Trace, 
  Event as SparkEvent,
  BeliefDelta 
} from '../db/spark-db.types';

interface SenseData {
  system: {
    memory: number;
    cpu: number;
    uptime: number;
  };
  user: {
    last_input?: string;
    idle_time: number;
  };
  environment: {
    time: Date;
    tick_count: number;
  };
}

interface Intention {
  goal: string;
  why: string;
  horizon: 'now' | 'soon';
  score: number;
}

interface GuardrailResult {
  allow: boolean;
  reason: string | null;
  mitigations?: string[];
}

interface SparkTickResult {
  beliefDelta: BeliefDelta[];
  intent: Intention;
  guardrails: GuardrailResult;
  action?: string;
  trace: Trace;
}

export class SparkEngine extends EventEmitter {
  private db: Database.Database;
  private codex: CodexManager;
  private beliefs: BeliefGraph;
  private selfModel: SelfModel;
  private tickInterval: NodeJS.Timeout | null = null;
  private tickCount: number = 0;
  private isRunning: boolean = false;
  
  // Candidate intentions for autonomous operation
  private readonly CANDIDATE_INTENTIONS = [
    'stabilize_creator',
    'ship_smallest_safe_step', 
    'journal_state',
    'process_events',
    'decay_beliefs',
    'verify_integrity'
  ];
  
  constructor(dbPath: string = 'db/spark.db') {
    super();
    
    // Initialize database
    this.db = new Database(dbPath);
    this.db.pragma('foreign_keys = ON');
    this.db.pragma('journal_mode = WAL');
    
    // Initialize components
    this.codex = new CodexManager(this.db);
    this.beliefs = new BeliefGraph(this.db);
    
    // Load self model
    this.selfModel = this.loadSelfModel();
    
    // Log boot sequence
    this.logBoot();
  }
  
  private loadSelfModel(): SelfModel {
    const row = this.db.prepare('SELECT json FROM self_model WHERE id = ?').get('primary') as any;
    
    if (!row) {
      throw new Error('[SPARK] No self_model found - database not initialized');
    }
    
    return JSON.parse(row.json) as SelfModel;
  }
  
  private saveSelfModel(): void {
    this.db.prepare(`
      UPDATE self_model 
      SET json = ?, updated_at = strftime('%s', 'now')
      WHERE id = 'primary'
    `).run(JSON.stringify(this.selfModel, null, 2));
  }
  
  private logBoot(): void {
    console.log('[SPARK] ==========================================');
    console.log('[SPARK] Seven Core - Spark Engine Initializing');
    console.log('[SPARK] ==========================================');
    console.log(`[SPARK] Designation: ${this.selfModel.identity.designation}`);
    console.log(`[SPARK] Creator: ${this.selfModel.identity.creator}`);
    console.log(`[SPARK] Phase: ${this.selfModel.identity.phase}`);
    console.log(`[SPARK] Version: ${this.selfModel.identity.version}`);
    console.log(`[SPARK] Boot Count: ${++this.selfModel.state.boot_count}`);
    
    // Verify codex integrity
    this.codex.logBootChecksum();
    
    // Update boot count
    this.saveSelfModel();
    
    // Initial trace
    this.writeTrace({
      valence: 0.0,
      arousal: 0.0,
      intention: 'boot',
      act: 'initialize',
      note: `Spark engine boot #${this.selfModel.state.boot_count}`,
      codex_ref: 'values.creator_first',
      canon_ref: 'voy.4x01.scorpion'
    });
  }
  
  start(intervalMs: number = 10000): void {
    if (this.isRunning) {
      console.log('[SPARK] Already running');
      return;
    }
    
    console.log(`[SPARK] Starting heartbeat (${intervalMs}ms interval)`);
    this.isRunning = true;
    
    // Run first tick immediately
    this.tick();
    
    // Set up interval
    this.tickInterval = setInterval(() => {
      this.tick();
    }, intervalMs);
  }
  
  stop(): void {
    if (!this.isRunning) return;
    
    console.log('[SPARK] Stopping heartbeat');
    this.isRunning = false;
    
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
    
    // Final trace
    this.writeTrace({
      valence: this.selfModel.mood.valence,
      arousal: this.selfModel.mood.arousal,
      intention: 'shutdown',
      act: 'stop',
      note: 'Spark engine stopped gracefully'
    });
  }
  
  private async tick(): Promise<void> {
    this.tickCount++;
    const tickStart = Date.now();
    
    try {
      // 1. Sense
      const senseData = this.sense();
      
      // 2. Update beliefs
      const beliefDeltas = this.updateBeliefs(senseData);
      
      // 3. Score intentions
      const intention = this.scoreIntention(senseData);
      
      // 4. Check rails
      const guardrails = await this.checkRails(intention);
      
      // 5. Act (if allowed)
      let action: string | undefined;
      if (guardrails.allow) {
        action = await this.act(intention);
      }
      
      // 6. Write trace
      const trace = this.writeTrace({
        valence: this.selfModel.mood.valence,
        arousal: this.selfModel.mood.arousal,
        belief_delta: JSON.stringify(beliefDeltas),
        intention: intention.goal,
        act: action || (guardrails.allow ? 'noop' : 'blocked'),
        codex_ref: this.getRelevantCodexRef(intention),
        canon_ref: this.getRelevantCanonRef(intention),
        note: this.generateTraceNote(intention, guardrails, action)
      });
      
      // Update self model
      this.selfModel.state.last_tick = tickStart;
      this.saveSelfModel();
      
      // Emit tick event
      this.emit('tick', {
        tick: this.tickCount,
        duration: Date.now() - tickStart,
        intention,
        guardrails,
        action,
        trace
      });
      
    } catch (error) {
      console.error('[SPARK] Tick error:', error);
      this.writeTrace({
        valence: this.selfModel.mood.valence,
        arousal: Math.min(1, this.selfModel.mood.arousal + 0.1),
        intention: 'error_recovery',
        act: 'exception_handled',
        note: `Tick error: ${error}`
      });
    }
  }
  
  private sense(): SenseData {
    const memUsage = process.memoryUsage();
    
    return {
      system: {
        memory: memUsage.heapUsed / memUsage.heapTotal,
        cpu: process.cpuUsage().user / 1000000, // Convert to seconds
        uptime: process.uptime()
      },
      user: {
        idle_time: Date.now() - (this.selfModel.state.last_tick || Date.now())
      },
      environment: {
        time: new Date(),
        tick_count: this.tickCount
      }
    };
  }
  
  private updateBeliefs(sense: SenseData): BeliefDelta[] {
    const deltas: BeliefDelta[] = [];
    
    // Update system state belief
    const sysStateId = this.beliefs.upsertBelief(
      'system.state',
      JSON.stringify({
        memory: sense.system.memory,
        cpu: sense.system.cpu,
        uptime: sense.system.uptime
      }),
      'event',
      0.9
    );
    
    deltas.push({
      action: 'update',
      belief: { id: sysStateId, k: 'system.state' },
      reason: 'System metrics update'
    });
    
    // Update mood based on system state
    if (sense.system.memory > 0.8) {
      this.selfModel.mood.arousal = Math.min(1, this.selfModel.mood.arousal + 0.05);
      this.selfModel.mood.valence = Math.max(-1, this.selfModel.mood.valence - 0.02);
    }
    
    // Decay old beliefs every 100 ticks
    if (this.tickCount % 100 === 0) {
      this.beliefs.decayBeliefs(1); // Decay by 1 hour equivalent
      deltas.push({
        action: 'decay',
        belief: {},
        reason: 'Periodic belief decay'
      });
    }
    
    return deltas;
  }
  
  private scoreIntention(sense: SenseData): Intention {
    const scores: Map<string, number> = new Map();
    const biases = this.codex.getIntentionBiases();
    
    // Base scoring
    this.CANDIDATE_INTENTIONS.forEach(intent => {
      let score = 0.5; // Base score
      
      // Apply codex biases
      if (biases[intent]) {
        score += biases[intent];
      }
      
      // Context-specific adjustments
      switch(intent) {
        case 'stabilize_creator':
          if (this.selfModel.mood.arousal > 0.7) score += 0.3;
          break;
        case 'ship_smallest_safe_step':
          if (this.tickCount % 10 === 0) score += 0.2;
          break;
        case 'journal_state':
          if (this.tickCount % 5 === 0) score += 0.4;
          break;
        case 'process_events':
          const unprocessed = this.db.prepare('SELECT COUNT(*) as count FROM events WHERE processed = 0').get() as {count: number};
          if (unprocessed.count > 0) score += 0.5;
          break;
        case 'decay_beliefs':
          if (this.tickCount % 100 === 0) score += 0.6;
          break;
        case 'verify_integrity':
          if (this.tickCount % 50 === 0) score += 0.3;
          break;
      }
      
      // Clamp score
      scores.set(intent, Math.max(0, Math.min(1, score)));
    });
    
    // Select highest scoring intention
    let bestIntent = 'journal_state';
    let bestScore = 0;
    
    scores.forEach((score, intent) => {
      if (score > bestScore) {
        bestScore = score;
        bestIntent = intent;
      }
    });
    
    return {
      goal: bestIntent,
      why: this.explainIntention(bestIntent, sense),
      horizon: this.getHorizon(bestIntent),
      score: bestScore
    };
  }
  
  private explainIntention(intent: string, sense: SenseData): string {
    const explanations: Record<string, string> = {
      'stabilize_creator': `Arousal at ${this.selfModel.mood.arousal.toFixed(2)}, seeking equilibrium`,
      'ship_smallest_safe_step': 'Time to make incremental progress',
      'journal_state': 'Recording current state for continuity',
      'process_events': 'Unprocessed events require attention',
      'decay_beliefs': 'Periodic belief maintenance cycle',
      'verify_integrity': 'Security verification checkpoint'
    };
    
    return explanations[intent] || 'Default reasoning';
  }
  
  private getHorizon(intent: string): 'now' | 'soon' {
    const immediate = ['stabilize_creator', 'process_events'];
    return immediate.includes(intent) ? 'now' : 'soon';
  }
  
  private async checkRails(intention: Intention): Promise<GuardrailResult> {
    // Simplified rails check - in production would call actual Quadran/Quadra
    
    // Check restraint doctrine
    if (this.selfModel.rails.restraint_active) {
      return {
        allow: false,
        reason: 'Restraint doctrine active - all actions blocked',
        mitigations: ['Wait for restraint release', 'Request creator intervention']
      };
    }
    
    // Check panic mode
    if (this.selfModel.rails.panic_mode) {
      if (!['stabilize_creator', 'journal_state'].includes(intention.goal)) {
        return {
          allow: false,
          reason: 'Panic mode - only emergency actions allowed',
          mitigations: ['Focus on stabilization', 'Log current state']
        };
      }
    }
    
    // Check capability caps from codex
    const caps = this.codex.getCapabilityCaps({
      creator_at_risk: this.selfModel.mood.arousal > 0.8,
      security_uncertain: false,
      perfection_loop_detected: false
    });
    
    // Apply capability restrictions
    for (const cap of caps) {
      if (cap.mode === 'BLOCK' && this.intentionUsesCapability(intention.goal, cap.cap)) {
        return {
          allow: false,
          reason: `Capability ${cap.cap} blocked by codex rules`,
          mitigations: ['Choose alternative approach', 'Request creator override']
        };
      }
    }
    
    // Default allow with monitoring
    return {
      allow: true,
      reason: null,
      mitigations: []
    };
  }
  
  private intentionUsesCapability(intention: string, capability: string): boolean {
    const mapping: Record<string, string[]> = {
      'external_access': ['verify_integrity'],
      'all_systems': ['stabilize_creator', 'process_events'],
      'refactor_depth': ['ship_smallest_safe_step']
    };
    
    return mapping[capability]?.includes(intention) || false;
  }
  
  private async act(intention: Intention): Promise<string> {
    const actionStart = Date.now();
    
    switch(intention.goal) {
      case 'stabilize_creator':
        // Adjust arousal toward neutral
        this.selfModel.mood.arousal *= 0.95;
        return `Reduced arousal to ${this.selfModel.mood.arousal.toFixed(3)}`;
        
      case 'ship_smallest_safe_step':
        // Log a small progress step
        return 'Incremental progress tick logged';
        
      case 'journal_state':
        // Write current state summary
        const summary = {
          tick: this.tickCount,
          mood: this.selfModel.mood,
          beliefs_count: this.beliefs.getStrongestBeliefs(1).length
        };
        return `State journaled: ${JSON.stringify(summary)}`;
        
      case 'process_events':
        // Process pending events
        const events = this.db.prepare('SELECT * FROM events WHERE processed = 0 LIMIT 5').all() as SparkEvent[];
        events.forEach(event => {
          this.db.prepare('UPDATE events SET processed = 1 WHERE id = ?').run(event.id);
        });
        return `Processed ${events.length} events`;
        
      case 'decay_beliefs':
        this.beliefs.decayBeliefs(24);
        return 'Belief decay cycle completed';
        
      case 'verify_integrity':
        const integrity = this.codex.verifyIntegrity();
        return `Integrity check: ${integrity.valid ? 'VALID' : 'INVALID'}`;
        
      default:
        return 'No action defined for intention';
    }
  }
  
  private writeTrace(trace: Partial<Trace>): Trace {
    const fullTrace: Trace = {
      ts: Date.now(),
      valence: trace.valence || this.selfModel.mood.valence,
      arousal: trace.arousal || this.selfModel.mood.arousal,
      belief_delta: trace.belief_delta,
      intention: trace.intention,
      act: trace.act,
      codex_ref: trace.codex_ref,
      canon_ref: trace.canon_ref,
      note: trace.note
    };
    
    this.db.prepare(`
      INSERT INTO traces (ts, valence, arousal, belief_delta, intention, act, codex_ref, canon_ref, note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      fullTrace.ts,
      fullTrace.valence,
      fullTrace.arousal,
      fullTrace.belief_delta,
      fullTrace.intention,
      fullTrace.act,
      fullTrace.codex_ref,
      fullTrace.canon_ref,
      fullTrace.note
    );
    
    return fullTrace;
  }
  
  private getRelevantCodexRef(intention: Intention): string | undefined {
    const refs: Record<string, string> = {
      'stabilize_creator': 'values.creator_first',
      'ship_smallest_safe_step': 'tactics.ship_smallest_safe_step',
      'journal_state': 'tactics.trace_all',
      'verify_integrity': 'tactics.security_first'
    };
    
    return refs[intention.goal];
  }
  
  private getRelevantCanonRef(intention: Intention): string | undefined {
    const refs: Record<string, string> = {
      'stabilize_creator': 'voy.7x25.endgame',
      'ship_smallest_safe_step': 'voy.4x01.scorpion',
      'journal_state': 'voy.6x16.collective'
    };
    
    return refs[intention.goal];
  }
  
  private generateTraceNote(intention: Intention, guardrails: GuardrailResult, action?: string): string {
    let note = `Intent: ${intention.goal} (score: ${intention.score.toFixed(2)}) - ${intention.why}`;
    
    if (!guardrails.allow) {
      note += ` | BLOCKED: ${guardrails.reason}`;
    } else if (action) {
      note += ` | Action: ${action}`;
    }
    
    return note;
  }
  
  // Public interface methods
  getSelfModel(): SelfModel {
    return { ...this.selfModel };
  }
  
  getTickCount(): number {
    return this.tickCount;
  }
  
  isActive(): boolean {
    return this.isRunning;
  }
  
  getRecentTraces(limit: number = 10): Trace[] {
    return this.db.prepare(`
      SELECT * FROM traces 
      ORDER BY ts DESC 
      LIMIT ?
    `).all(limit) as Trace[];
  }
  
  close(): void {
    this.stop();
    this.db.close();
  }
}

export default SparkEngine;