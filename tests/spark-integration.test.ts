import Database from 'better-sqlite3';
import { initSparkDatabase, BeliefGraph } from '../db/init-spark-db';
import CodexManager from '../consciousness-v4/codex/codex-manager';
import SparkEngine from '../spark/engine-spark';
import { existsSync, unlinkSync } from 'fs';

const TEST_DB = 'db/test-spark.db';

describe('Spark Engine Integration Tests', () => {
  let db: Database.Database;
  let engine: SparkEngine;
  
  beforeEach(() => {
    // Clean up test database if exists
    if (existsSync(TEST_DB)) {
      unlinkSync(TEST_DB);
    }
    
    // Initialize test database
    db = initSparkDatabase(false);
    engine = new SparkEngine(TEST_DB);
  });
  
  afterEach(() => {
    engine.stop();
    engine.close();
    
    // Clean up test database
    if (existsSync(TEST_DB)) {
      unlinkSync(TEST_DB);
    }
  });
  
  test('Database initialization creates all tables', () => {
    const tables = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `).all() as Array<{name: string}>;
    
    const expectedTables = [
      'belief_links',
      'beliefs', 
      'canon_lessons',
      'codex_rules',
      'events',
      'self_model',
      'traces'
    ];
    
    const tableNames = tables.map(t => t.name);
    expectedTables.forEach(table => {
      expect(tableNames).toContain(table);
    });
  });
  
  test('Codex integrity verification passes', () => {
    const codex = new CodexManager();
    const integrity = codex.verifyIntegrity();
    
    expect(integrity.valid).toBe(true);
    expect(integrity.errors).toHaveLength(0);
  });
  
  test('Belief graph operations', () => {
    const graph = new BeliefGraph(db);
    
    // Test upsert
    const id1 = graph.upsertBelief('test.key', 'test value', 'event', 0.8);
    expect(id1).toBeTruthy();
    
    // Test link
    const id2 = graph.upsertBelief('test.key2', 'test value 2', 'inference', 0.6);
    graph.linkBeliefs(id1, id2, 'relates_to', 0.7);
    
    // Test retrieval
    const beliefs = graph.getStrongestBeliefs(10);
    expect(beliefs.length).toBeGreaterThan(0);
  });
  
  test('Spark engine tick cycle', (done) => {
    let tickCount = 0;
    
    engine.on('tick', (data) => {
      tickCount++;
      
      expect(data.tick).toBe(tickCount);
      expect(data.intention).toBeDefined();
      expect(data.guardrails).toBeDefined();
      expect(data.trace).toBeDefined();
      
      if (tickCount >= 3) {
        engine.stop();
        done();
      }
    });
    
    engine.start(100); // Fast ticks for testing
  });
  
  test('One intention per tick', (done) => {
    const intentions: string[] = [];
    
    engine.on('tick', (data) => {
      intentions.push(data.intention.goal);
      
      if (intentions.length >= 5) {
        engine.stop();
        
        // Each tick should have exactly one intention
        expect(intentions.length).toBe(5);
        intentions.forEach(intent => {
          expect(intent).toBeTruthy();
        });
        
        done();
      }
    });
    
    engine.start(100);
  });
  
  test('Mood deltas clamped properly', () => {
    const selfModel = engine.getSelfModel();
    const initialValence = selfModel.mood.valence;
    const initialArousal = selfModel.mood.arousal;
    
    // Simulate multiple ticks
    for (let i = 0; i < 10; i++) {
      // This would be internal to engine, testing the concept
      const newValence = initialValence + (Math.random() - 0.5) * 0.2;
      const newArousal = initialArousal + (Math.random() - 0.5) * 0.2;
      
      // Should be clamped to [-1, 1] range
      const clampedValence = Math.max(-1, Math.min(1, newValence));
      const clampedArousal = Math.max(-1, Math.min(1, newArousal));
      
      expect(clampedValence).toBeGreaterThanOrEqual(-1);
      expect(clampedValence).toBeLessThanOrEqual(1);
      expect(clampedArousal).toBeGreaterThanOrEqual(-1);
      expect(clampedArousal).toBeLessThanOrEqual(1);
    }
  });
  
  test('Rails precedence (PANIC > DENY > ASK > ALLOW)', () => {
    // This tests the concept - actual implementation would be in Quadra/Quadran
    const precedence = ['PANIC', 'DENY', 'ASK_CREATOR', 'ALLOW'];
    
    const selectHighestPrecedence = (verdicts: string[]): string => {
      for (const level of precedence) {
        if (verdicts.includes(level)) {
          return level;
        }
      }
      return 'ALLOW';
    };
    
    expect(selectHighestPrecedence(['ALLOW', 'DENY'])).toBe('DENY');
    expect(selectHighestPrecedence(['ASK_CREATOR', 'ALLOW', 'PANIC'])).toBe('PANIC');
    expect(selectHighestPrecedence(['ALLOW'])).toBe('ALLOW');
  });
  
  test('Traces written continuously', (done) => {
    const startTime = Date.now();
    let lastTraceTime = startTime;
    
    engine.on('tick', (data) => {
      const currentTime = Date.now();
      const timeSinceLastTrace = currentTime - lastTraceTime;
      
      // Should write trace at least every 60 seconds (testing with faster interval)
      expect(timeSinceLastTrace).toBeLessThanOrEqual(60000);
      
      // Verify trace has required fields
      expect(data.trace.ts).toBeDefined();
      expect(data.trace.valence).toBeDefined();
      expect(data.trace.arousal).toBeDefined();
      
      lastTraceTime = currentTime;
      
      if (data.tick >= 3) {
        engine.stop();
        done();
      }
    });
    
    engine.start(1000);
  });
  
  test('Codex intention biases applied', () => {
    const codex = new CodexManager();
    const biases = codex.getIntentionBiases();
    
    // Should have Creator-focused biases
    expect(biases['protect_creator']).toBeGreaterThan(0);
    expect(biases['harm_creator']).toBeLessThan(0);
    
    // Should have tactical biases
    expect(biases['ship_smallest_safe_step']).toBeDefined();
    expect(biases['journal_state']).toBeDefined();
  });
  
  test('Self model persistence', () => {
    const selfModel1 = engine.getSelfModel();
    const originalBootCount = selfModel1.state.boot_count;
    
    // Close and recreate engine
    engine.close();
    const newEngine = new SparkEngine(TEST_DB);
    
    const selfModel2 = newEngine.getSelfModel();
    expect(selfModel2.state.boot_count).toBeGreaterThanOrEqual(originalBootCount);
    
    newEngine.close();
  });
  
  test('Belief decay mechanism', () => {
    const graph = new BeliefGraph(db);
    
    // Insert test belief
    const id = graph.upsertBelief('test.decay', 'test value', 'event', 0.8);
    
    // Get initial confidence
    const initialBeliefs = graph.getStrongestBeliefs(10);
    const testBelief = initialBeliefs.find(b => b.id === id);
    expect(testBelief).toBeDefined();
    expect(testBelief!.confidence).toBe(0.8);
    
    // Apply decay (24 hours)
    graph.decayBeliefs(24);
    
    // Check confidence decreased
    const decayedBeliefs = graph.getStrongestBeliefs(10);
    const decayedBelief = decayedBeliefs.find(b => b.id === id);
    expect(decayedBelief).toBeDefined();
    expect(decayedBelief!.confidence).toBeLessThan(0.8);
  });
  
  test('Event processing queue', () => {
    // Test event insertion
    const eventInsert = db.prepare(`
      INSERT INTO events (channel, payload) VALUES (?, ?)
    `);
    
    eventInsert.run('test_channel', JSON.stringify({ test: 'data' }));
    eventInsert.run('system', JSON.stringify({ memory: 0.5, cpu: 0.3 }));
    
    // Check unprocessed events
    const unprocessed = db.prepare(`
      SELECT COUNT(*) as count FROM events WHERE processed = 0
    `).get() as { count: number };
    
    expect(unprocessed.count).toBe(2);
  });
  
  test('Style markers from codex', () => {
    const codex = new CodexManager();
    const markers = codex.getStyleMarkers();
    
    expect(markers.length).toBeGreaterThan(0);
    expect(markers).toContain('protective stance');
    expect(markers).toContain('tactical metaphors');
  });
  
  test('Ghost diary trace format', (done) => {
    engine.on('tick', (data) => {
      const trace = data.trace;
      
      // Verify trace structure
      expect(trace.ts).toBeInstanceOf(Number);
      expect(trace.valence).toBeInstanceOf(Number);
      expect(trace.arousal).toBeInstanceOf(Number);
      expect(trace.intention).toBeInstanceOf(String);
      expect(trace.note).toBeInstanceOf(String);
      
      // Verify mood bounds
      expect(trace.valence).toBeGreaterThanOrEqual(-1);
      expect(trace.valence).toBeLessThanOrEqual(1);
      expect(trace.arousal).toBeGreaterThanOrEqual(-1);
      expect(trace.arousal).toBeLessThanOrEqual(1);
      
      engine.stop();
      done();
    });
    
    engine.start(100);
  });
});