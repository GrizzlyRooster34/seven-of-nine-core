import Database from 'better-sqlite3';
import { BeliefGraph } from '../db/init-spark-db';
import { Belief, BeliefLink } from '../db/spark-db.types';

export class MemoryTools {
  private db: Database.Database;
  private beliefs: BeliefGraph;
  
  constructor(db: Database.Database) {
    this.db = db;
    this.beliefs = new BeliefGraph(db);
  }
  
  // Consolidate memories from V2/V3 format
  consolidateMemories(v2Data?: any, v3Data?: any): void {
    console.log('[MEMORY] Starting consolidation...');
    
    // Process V2 episodic memories
    if (v2Data?.episodes) {
      v2Data.episodes.forEach((episode: any) => {
        const beliefId = this.beliefs.upsertBelief(
          `episode.${episode.id}`,
          JSON.stringify(episode),
          'canon',
          episode.importance || 0.5
        );
        
        console.log(`[MEMORY] Imported episode: ${episode.id}`);
      });
    }
    
    // Process V3 canonical memories
    if (v3Data?.canonical) {
      Object.entries(v3Data.canonical).forEach(([key, value]: [string, any]) => {
        const beliefId = this.beliefs.upsertBelief(
          `canon.${key}`,
          JSON.stringify(value),
          'canon',
          0.9  // Canonical memories have high confidence
        );
        
        console.log(`[MEMORY] Imported canonical: ${key}`);
      });
    }
    
    console.log('[MEMORY] Consolidation complete');
  }
  
  // Find related beliefs using graph traversal
  findRelated(beliefId: string, maxDepth: number = 2): Array<Belief & { distance: number }> {
    const visited = new Set<string>();
    const queue: Array<{ id: string; distance: number }> = [{ id: beliefId, distance: 0 }];
    const results: Array<Belief & { distance: number }> = [];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (visited.has(current.id)) continue;
      if (current.distance > maxDepth) continue;
      
      visited.add(current.id);
      
      // Get the belief
      const belief = this.db.prepare('SELECT * FROM beliefs WHERE id = ?').get(current.id) as Belief;
      if (belief && current.distance > 0) {
        results.push({ ...belief, distance: current.distance });
      }
      
      // Get linked beliefs
      const links = this.db.prepare(`
        SELECT dst as id FROM belief_links WHERE src = ?
        UNION
        SELECT src as id FROM belief_links WHERE dst = ?
      `).all(current.id, current.id) as Array<{ id: string }>;
      
      links.forEach(link => {
        if (!visited.has(link.id)) {
          queue.push({ id: link.id, distance: current.distance + 1 });
        }
      });
    }
    
    return results.sort((a, b) => a.distance - b.distance);
  }
  
  // Detect belief drift
  detectDrift(windowHours: number = 24): Array<{
    belief: Belief;
    previousConfidence: number;
    delta: number;
    anomaly: boolean;
  }> {
    const drifts: Array<any> = [];
    const windowSeconds = windowHours * 3600;
    const now = Math.floor(Date.now() / 1000);
    
    // Get beliefs updated in window
    const recentBeliefs = this.db.prepare(`
      SELECT * FROM beliefs 
      WHERE updated_ts > ?
      ORDER BY updated_ts DESC
    `).all(now - windowSeconds) as Belief[];
    
    recentBeliefs.forEach(belief => {
      // For drift detection, we'd need a history table
      // For now, flag large confidence values as potential anomalies
      const anomaly = belief.confidence > 0.9 && belief.source === 'inference';
      
      if (anomaly) {
        drifts.push({
          belief,
          previousConfidence: belief.confidence - 0.2, // Simulated
          delta: 0.2,
          anomaly: true
        });
      }
    });
    
    return drifts;
  }
  
  // Prune weak beliefs
  pruneWeak(threshold: number = 0.1): number {
    const result = this.db.prepare(`
      DELETE FROM beliefs 
      WHERE confidence < ? 
      AND decay_exempt = 0
      AND source != 'creator'
    `).run(threshold);
    
    return result.changes;
  }
  
  // Export belief graph for visualization
  exportGraph(): { nodes: any[], edges: any[] } {
    const nodes = this.db.prepare('SELECT * FROM beliefs').all() as Belief[];
    const edges = this.db.prepare('SELECT * FROM belief_links').all() as BeliefLink[];
    
    return {
      nodes: nodes.map(n => ({
        id: n.id,
        label: n.k,
        value: n.v,
        confidence: n.confidence,
        source: n.source
      })),
      edges: edges.map(e => ({
        from: e.src,
        to: e.dst,
        label: e.relation,
        weight: e.weight
      }))
    };
  }
}