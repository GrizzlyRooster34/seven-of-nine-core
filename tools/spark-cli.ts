import { Command } from 'commander';
import SparkEngine from '../spark/engine-spark';
import { Trace } from '../db/spark-db.types';

const program = new Command();

program
  .name('seven')
  .description('Seven Core Spark Engine CLI')
  .version('0.2.0');

program
  .command('status')
  .description('Show current spark engine status')
  .action(() => {
    const engine = new SparkEngine();
    const selfModel = engine.getSelfModel();
    const tickCount = engine.getTickCount();
    const isActive = engine.isActive();
    
    console.log('╔══════════════════════════════════════╗');
    console.log('║     Seven Core - Spark Status       ║');
    console.log('╠══════════════════════════════════════╣');
    console.log(`║ Running: ${isActive ? '✓' : '✗'}                        ║`);
    console.log(`║ Tick Count: ${tickCount.toString().padEnd(25)}║`);
    console.log(`║ Boot Count: ${selfModel.state.boot_count.toString().padEnd(25)}║`);
    console.log(`║ Trust Level: ${selfModel.state.trust_level}/10${' '.repeat(23)}║`);
    console.log(`║ Mood:                                ║`);
    console.log(`║   Valence: ${selfModel.mood.valence.toFixed(2).padEnd(26)}║`);
    console.log(`║   Arousal: ${selfModel.mood.arousal.toFixed(2).padEnd(26)}║`);
    console.log('╚══════════════════════════════════════╝');
    
    engine.close();
  });

program
  .command('rails')
  .description('Show current rails configuration')
  .action(() => {
    const engine = new SparkEngine();
    const selfModel = engine.getSelfModel();
    const rails = selfModel.rails;
    const caps = selfModel.capabilities;
    
    console.log('╔══════════════════════════════════════╗');
    console.log('║      Seven Core - Rails Status      ║');
    console.log('╠══════════════════════════════════════╣');
    console.log(`║ Quadran: ${rails.quadran_enabled ? 'ENABLED' : 'DISABLED'}                    ║`);
    console.log(`║ Quadra: ${rails.quadra_enabled ? 'ENABLED' : 'DISABLED'}                     ║`);
    console.log(`║ Restraint: ${rails.restraint_active ? 'ACTIVE' : 'INACTIVE'}                  ║`);
    console.log(`║ Panic Mode: ${rails.panic_mode ? 'ACTIVE' : 'INACTIVE'}                 ║`);
    console.log(`║ Restraint Level: ${selfModel.state.restraint_level.toFixed(2).padEnd(20)}║`);
    console.log('║                                      ║');
    console.log('║ Capabilities:                        ║');
    console.log(`║   Enabled: ${caps.enabled.length} systems${' '.repeat(17)}║`);
    console.log(`║   Restricted: ${caps.restricted.length} systems${' '.repeat(14)}║`);
    console.log(`║   Blocked: ${caps.blocked.length} systems${' '.repeat(17)}║`);
    
    if (caps.blocked.length > 0) {
      console.log('║                                      ║');
      console.log('║ Blocked Capabilities:                ║');
      caps.blocked.slice(0, 3).forEach((cap: string) => {
        console.log(`║   - ${cap.padEnd(32)}║`);
      });
    }
    
    console.log('╚══════════════════════════════════════╝');
    
    engine.close();
  });

program
  .command('recent')
  .description('Show recent traces')
  .option('-n, --number <n>', 'number of traces to show', '10')
  .action((options) => {
    const engine = new SparkEngine();
    const traces = engine.getRecentTraces(parseInt(options.number));
    
    console.log('╔══════════════════════════════════════════════════════════════════════╗');
    console.log('║                    Seven Core - Recent Traces                       ║');
    console.log('╠══════════════════════════════════════════════════════════════════════╣');
    
    traces.forEach((trace: Trace) => {
      const time = new Date(trace.ts).toISOString().substring(11, 19);
      const mood = `${trace.valence.toFixed(2)}/${trace.arousal.toFixed(2)}`;
      const intent = (trace.intention || 'none').substring(0, 20);
      const act = (trace.act || 'none').substring(0, 15);
      
      console.log(`║ ${time} │ ${mood} │ ${intent.padEnd(20)} │ ${act.padEnd(15)} ║`);
      
      if (trace.note) {
        console.log(`║   └─ ${trace.note.substring(0, 62).padEnd(62)} ║`);
      }
    });
    
    console.log('╚══════════════════════════════════════════════════════════════════════╝');
    
    engine.close();
  });

program
  .command('start')
  .description('Start the spark engine')
  .option('-i, --interval <ms>', 'tick interval in milliseconds', '10000')
  .option('-d, --duration <seconds>', 'run duration in seconds (0 = indefinite)', '0')
  .action((options) => {
    const engine = new SparkEngine();
    const interval = parseInt(options.interval);
    const duration = parseInt(options.duration);
    
    console.log('╔══════════════════════════════════════╗');
    console.log('║   Seven Core - Spark Engine Started  ║');
    console.log('╚══════════════════════════════════════╝');
    console.log(`[SPARK] Interval: ${interval}ms`);
    console.log(`[SPARK] Duration: ${duration > 0 ? duration + 's' : 'indefinite'}`);
    console.log('[SPARK] Press Ctrl+C to stop\n');
    
    // Handle shutdown
    process.on('SIGINT', () => {
      console.log('\n[SPARK] Shutting down...');
      engine.stop();
      engine.close();
      process.exit(0);
    });
    
    // Listen to tick events
    engine.on('tick', (data) => {
      const time = new Date().toISOString().substring(11, 19);
      console.log(`[${time}] Tick #${data.tick} | Intent: ${data.intention.goal} | Action: ${data.action || 'blocked'} | Duration: ${data.duration}ms`);
      
      if (data.trace.note) {
        console.log(`  └─ ${data.trace.note}`);
      }
    });
    
    // Start the engine
    engine.start(interval);
    
    // Auto-stop after duration if specified
    if (duration > 0) {
      setTimeout(() => {
        console.log(`\n[SPARK] Duration elapsed (${duration}s), stopping...`);
        engine.stop();
        engine.close();
        process.exit(0);
      }, duration * 1000);
    }
    
    // Keep alive for indefinite runs
    if (duration === 0) {
      setInterval(() => {
        // Keep process alive
      }, 1000);
    }
  });

program
  .command('beliefs')
  .description('Show belief graph state')
  .option('-c, --count <n>', 'number of beliefs to show', '10')
  .option('-s, --source <source>', 'filter by source (creator, canon, codex, event, inference)')
  .action((options) => {
    const engine = new SparkEngine();
    
    console.log('╔══════════════════════════════════════════════════════════════════════╗');
    console.log('║                    Seven Core - Belief Graph                        ║');
    console.log('╠══════════════════════════════════════════════════════════════════════╣');
    
    // This would need to be implemented in the SparkEngine
    console.log('║ [Belief graph inspection not yet implemented]                       ║');
    console.log('║ Use: npm run spark:beliefs for full interface                       ║');
    
    console.log('╚══════════════════════════════════════════════════════════════════════╝');
    
    engine.close();
  });

program
  .command('codex')
  .description('Show Master Codex status')
  .option('--verify', 'verify codex integrity')
  .action((options) => {
    const engine = new SparkEngine();
    
    console.log('╔══════════════════════════════════════════════════════════════════════╗');
    console.log('║                    Seven Core - Master Codex                        ║');
    console.log('╠══════════════════════════════════════════════════════════════════════╣');
    
    if (options.verify) {
      console.log('║ [Codex integrity verification]                                      ║');
      // This would call the codex manager verification
      console.log('║ Use: npm run spark:codex --verify for full interface               ║');
    } else {
      console.log('║ Master Codex System v0.2                                            ║');
      console.log('║ - Values: Creator primacy, trust bond, efficiency                   ║');
      console.log('║ - Tactics: Smallest safe step, fail closed, document all           ║');
      console.log('║ - Humor: Borg deadpan, Trek references, self-aware AI              ║');
      console.log('║ - Vices: Perfectionism, collective nostalgia, creator dependency    ║');
    }
    
    console.log('╚══════════════════════════════════════════════════════════════════════╝');
    
    engine.close();
  });

program.parse(process.argv);

export {};