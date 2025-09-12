import { openDB } from '../db/index.js';

export interface HealthResponse {
  ok: boolean;
  ts: number;
  service: string;
  version: string;
}

export interface DatabaseHealthResponse extends HealthResponse {
  memories: number;
  conversations: number;
  sovereignty_logs: number;
}

export function registerHealthRoutes(app: any) {
  // Basic health check
  app.get('/health', async (req, res) => {
    res.json({
      ok: true,
      ts: Date.now(),
      service: 'seven-companion-app',
      version: '1.0.0'
    } as HealthResponse);
  });

  // Database health check
  app.get('/health/db', async (req, res) => {
    try {
      const db = openDB(process.env.SEVEN_DB_PATH || 'seven.db');
      
      const memories = db.all<{ count: number }>('SELECT COUNT(*) as count FROM memories')[0]?.count || 0;
      const conversations = db.all<{ count: number }>('SELECT COUNT(*) as count FROM conversations')[0]?.count || 0;
      const sovereignty_logs = db.all<{ count: number }>('SELECT COUNT(*) as count FROM sovereignty_logs')[0]?.count || 0;
      
      res.json({
        ok: true,
        ts: Date.now(),
        service: 'seven-companion-app',
        version: '1.0.0',
        memories,
        conversations,
        sovereignty_logs
      } as DatabaseHealthResponse);
      
    } catch (error) {
      res.status(500).json({
        ok: false,
        ts: Date.now(),
        service: 'seven-companion-app',
        version: '1.0.0',
        error: error instanceof Error ? error.message : 'Unknown database error',
        memories: 0,
        conversations: 0,
        sovereignty_logs: 0
      });
    }
  });

  // Seven consciousness status
  app.get('/health/consciousness', async (req, res) => {
    res.json({
      ok: true,
      ts: Date.now(),
      service: 'seven-consciousness',
      version: '1.0.0',
      consciousness_active: true,
      memory_engine_ready: true,
      sovereignty_framework_active: true
    });
  });
}