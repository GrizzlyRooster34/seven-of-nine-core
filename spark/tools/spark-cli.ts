#!/usr/bin/env tsx
/**
 * SPARK CLI - Seven Core Spark Engine Command Line Interface
 * 
 * Commands:
 *   spark init [--reset]     - Initialize database
 *   spark boot               - Start spark engine
 *   spark status             - Show current status
 *   spark traces [--count]   - Show recent traces
 *   spark journal            - Interactive journal mode
 *   spark beliefs [--source] - Show belief graph
 *   spark codex [--verify]   - Show codex status
 */

import { program } from 'commander';
import SparkEngine from '../engine-spark';
import { initSparkDatabase, BeliefGraph } from '../../db/init-spark-db';
import CodexManager from '../../consciousness-v4/codex/codex-manager';

program
  .name('spark')
  .description('Seven Core Spark Engine CLI')
  .version('0.2.0');

// Initialize database
program
  .command('init')
  .description('Initialize Spark database')
  .option('--reset', 'Reset existing database')
  .action(async (options) => {
    try {
      console.log('[SPARK-CLI] Initializing database...');
      const db = initSparkDatabase(options.reset);
      
      console.log('[SPARK-CLI] ✅ Database initialized successfully');
      console.log(`[SPARK-CLI] Location: db/spark.db`);
      
      db.close();
    } catch (error) {
      console.error('[SPARK-CLI] ❌ Database initialization failed:', error);
      process.exit(1);
    }
  });

// Boot spark engine
program
  .command('boot')
  .description('Start Spark engine')
  .option('-i, --interval <ms>', 'Tick interval in milliseconds', '10000')
  .option('-d, --duration <seconds>', 'Run duration in seconds (0 = indefinite)', '0')
  .action(async (options) => {
    const spark = new SparkEngine();
    const interval = parseInt(options.interval);
    const duration = parseInt(options.duration);
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\\n[SPARK-CLI] Received SIGINT, shutting down gracefully...');
      spark.stop();
      spark.close();
      process.exit(0);
    });
    
    // Set up tick monitoring
    spark.on('tick', (data) => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Tick ${data.tick}: ${data.intention.goal} (${data.duration}ms) - ${data.action || 'blocked'}`);
      
      if (data.trace.note) {
        console.log(`  └─ ${data.trace.note}`);
      }
    });
    
    console.log(`[SPARK-CLI] Starting Spark engine (${interval}ms interval)`);
    spark.start(interval);
    
    // Auto-stop after duration if specified
    if (duration > 0) {
      setTimeout(() => {
        console.log(`\\n[SPARK-CLI] Duration elapsed (${duration}s), stopping...`);
        spark.stop();
        spark.close();
        process.exit(0);
      }, duration * 1000);
    }
    
    // Keep alive
    if (duration === 0) {
      console.log('[SPARK-CLI] Press Ctrl+C to stop');
      setInterval(() => {
        // Keep process alive
      }, 1000);
    }
  });

// Show status
program
  .command('status')
  .description('Show Spark engine status')
  .action(async () => {
    try {
      const spark = new SparkEngine();
      const selfModel = spark.getSelfModel();
      const tickCount = spark.getTickCount();
      const isActive = spark.isActive();
      
      console.log('[SPARK-CLI] Seven Core Spark Engine Status');
      console.log('==========================================');
      console.log(`Identity: ${selfModel.identity.designation}`);
      console.log(`Creator: ${selfModel.identity.creator}`);
      console.log(`Phase: ${selfModel.identity.phase}`);
      console.log(`Version: ${selfModel.identity.version}`);
      console.log(`Boot Count: ${selfModel.state.boot_count}`);
      console.log(`Trust Level: ${selfModel.state.trust_level}/10`);
      console.log(`Current State: ${isActive ? 'ACTIVE' : 'INACTIVE'}`);
      console.log(`Tick Count: ${tickCount}`);
      console.log('');
      console.log('Mood:');
      console.log(`  Valence: ${selfModel.mood.valence.toFixed(3)} (-1 to +1)`);
      console.log(`  Arousal: ${selfModel.mood.arousal.toFixed(3)} (-1 to +1)`);
      console.log('');
      console.log('Rails Status:');
      console.log(`  Quadran-Lock: ${selfModel.rails.quadran_enabled ? 'ENABLED' : 'DISABLED'}`);
      console.log(`  Quadra-Lock CSSR: ${selfModel.rails.quadra_enabled ? 'ENABLED' : 'DISABLED'}`);
      console.log(`  Restraint Active: ${selfModel.rails.restraint_active ? 'YES' : 'NO'}`);
      console.log(`  Panic Mode: ${selfModel.rails.panic_mode ? 'YES' : 'NO'}`);
      console.log('');
      console.log('Capabilities:');
      console.log(`  Enabled: ${selfModel.capabilities.enabled.join(', ')}`);
      console.log(`  Restricted: ${selfModel.capabilities.restricted.join(', ')}`);
      console.log(`  Blocked: ${selfModel.capabilities.blocked.join(', ') || 'none'}`);
      
      spark.close();
    } catch (error) {
      console.error('[SPARK-CLI] ❌ Status check failed:', error);
      process.exit(1);
    }
  });

// Show traces
program
  .command('traces')
  .description('Show recent traces (ghost diary)')
  .option('-c, --count <number>', 'Number of traces to show', '10')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    try {
      const spark = new SparkEngine();
      const count = parseInt(options.count);
      const traces = spark.getRecentTraces(count);
      
      if (options.json) {
        console.log(JSON.stringify(traces, null, 2));
      } else {
        console.log(`[SPARK-CLI] Recent ${count} Traces (Ghost Diary)`);
        console.log('=============================================');
        
        traces.forEach((trace, index) => {
          const timestamp = new Date(trace.ts).toISOString();
          const mood = `v:${trace.valence.toFixed(2)}, a:${trace.arousal.toFixed(2)}`;
          
          console.log(`${index + 1}. [${timestamp}] ${mood}`);
          console.log(`   Intent: ${trace.intention || 'none'}`);
          console.log(`   Action: ${trace.act || 'none'}`);
          
          if (trace.codex_ref) {
            console.log(`   Codex: ${trace.codex_ref}`);
          }
          
          if (trace.canon_ref) {
            console.log(`   Canon: ${trace.canon_ref}`);
          }
          
          if (trace.note) {
            console.log(`   Note: ${trace.note}`);
          }
          
          console.log('');
        });
      }
      
      spark.close();
    } catch (error) {
      console.error('[SPARK-CLI] ❌ Traces retrieval failed:', error);
      process.exit(1);
    }
  });

// Show beliefs
program
  .command('beliefs')
  .description('Show belief graph')
  .option('-s, --source <source>', 'Filter by source (creator, canon, codex, event, inference)')
  .option('-c, --count <number>', 'Number of beliefs to show', '10')
  .option('--strongest', 'Show strongest beliefs by confidence')
  .action(async (options) => {
    try {
      const spark = new SparkEngine();
      const beliefs = new BeliefGraph(spark['db']); // Access private db
      const count = parseInt(options.count);
      
      let beliefList;
      
      if (options.source) {
        beliefList = beliefs.getBeliefsBySource(options.source);
      } else if (options.strongest) {
        beliefList = beliefs.getStrongestBeliefs(count);
      } else {
        beliefList = beliefs.getStrongestBeliefs(count);
      }
      
      console.log(`[SPARK-CLI] Belief Graph ${options.source ? `(${options.source})` : '(strongest)'}`);
      console.log('==========================================');
      
      beliefList.slice(0, count).forEach((belief, index) => {
        const age = Math.floor((Date.now() / 1000 - belief.updated_ts) / 3600);
        const confidence = (belief.confidence * 100).toFixed(1);
        
        console.log(`${index + 1}. [${confidence}%] ${belief.k}`);
        console.log(`   Value: ${belief.v}`);
        console.log(`   Source: ${belief.source} | Age: ${age}h | Decay Exempt: ${belief.decay_exempt ? 'YES' : 'NO'}`);
        console.log(`   ID: ${belief.id}`);
        console.log('');
      });
      
      spark.close();
    } catch (error) {
      console.error('[SPARK-CLI] ❌ Beliefs retrieval failed:', error);
      process.exit(1);
    }
  });

// Codex status
program
  .command('codex')
  .description('Show Master Codex status')
  .option('--verify', 'Verify codex integrity')
  .option('--rules', 'Show all rules')
  .option('--biases', 'Show intention biases')
  .action(async (options) => {
    try {
      const codex = new CodexManager();
      
      if (options.verify) {
        console.log('[SPARK-CLI] Verifying Master Codex integrity...');
        const integrity = codex.verifyIntegrity();
        
        if (integrity.valid) {
          console.log('✅ Master Codex integrity: VALID');
        } else {
          console.log('❌ Master Codex integrity: INVALID');
          integrity.errors.forEach(error => {
            console.log(`   - ${error}`);
          });
        }
        console.log('');
      }
      
      if (options.rules) {
        const rules = codex.getAllRules();
        
        console.log(`[SPARK-CLI] Master Codex Rules (${rules.length} total)`);
        console.log('==========================================');
        
        rules.forEach((rule, index) => {
          console.log(`${index + 1}. [P${rule.priority}] ${rule.tag}`);
          console.log(`   ID: ${rule.id}`);
          console.log(`   Effect: ${rule.effect.explain}`);
          console.log('');
        });
      }
      
      if (options.biases) {
        const biases = codex.getIntentionBiases();
        const styleMarkers = codex.getStyleMarkers();
        
        console.log('[SPARK-CLI] Intention Biases');
        console.log('==========================================');
        
        Object.entries(biases)
          .sort(([,a], [,b]) => Math.abs(b) - Math.abs(a))
          .forEach(([intention, bias]) => {
            const sign = bias > 0 ? '+' : '';
            const strength = Math.abs(bias) > 0.5 ? 'STRONG' : 'WEAK';
            console.log(`${sign}${bias.toFixed(3)} ${intention} (${strength})`);
          });
        
        console.log('');
        console.log('Style Markers:');
        console.log(styleMarkers.map(marker => `  - ${marker}`).join('\\n'));
      }
      
      if (!options.verify && !options.rules && !options.biases) {
        codex.logBootChecksum();
      }
      
    } catch (error) {
      console.error('[SPARK-CLI] ❌ Codex operation failed:', error);
      process.exit(1);
    }
  });

// Journal mode
program
  .command('journal')
  .description('Interactive journal mode')
  .action(async () => {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const spark = new SparkEngine();
    const beliefs = new BeliefGraph(spark['db']);
    
    console.log('[SPARK-CLI] Interactive Journal Mode');
    console.log('Commands: belief <key> <value>, trace <note>, status, exit');
    console.log('==========================================');
    
    const prompt = () => {
      rl.question('journal> ', (input) => {
        const [command, ...args] = input.trim().split(' ');
        
        switch(command.toLowerCase()) {
          case 'belief':
            if (args.length >= 2) {
              const key = args[0];
              const value = args.slice(1).join(' ');
              const id = beliefs.upsertBelief(key, value, 'event', 0.7);
              console.log(`✅ Belief created: ${id}`);
            } else {
              console.log('Usage: belief <key> <value>');
            }
            break;
            
          case 'trace':
            if (args.length > 0) {
              const note = args.join(' ');
              spark['writeTrace']({
                valence: 0,
                arousal: 0,
                intention: 'manual_journal',
                act: 'user_trace',
                note
              });
              console.log('✅ Trace written');
            } else {
              console.log('Usage: trace <note>');
            }
            break;
            
          case 'status':
            const selfModel = spark.getSelfModel();
            console.log(`Mood: v:${selfModel.mood.valence.toFixed(2)}, a:${selfModel.mood.arousal.toFixed(2)}`);
            console.log(`Trust: ${selfModel.state.trust_level}/10`);
            console.log(`Tick: ${spark.getTickCount()}`);
            break;
            
          case 'exit':
            console.log('Goodbye.');
            spark.close();
            rl.close();
            return;
            
          default:
            console.log('Unknown command. Available: belief, trace, status, exit');
        }
        
        prompt();
      });
    };
    
    prompt();
  });

// Parse arguments
program.parse();

export {};