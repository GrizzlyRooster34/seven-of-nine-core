/**
 * SEVEN COMPANION - MOBILE MEMORY CLIENT
 * 
 * Mobile client interface for Seven's memory system
 * Supports both local SQLite and remote backend connections
 */

import { openDB } from '../db/index.js';
import type { IMemoryDB } from '../db/IMemoryDB.js';

export interface MemoryNote {
  id?: number;
  content: string;
  importance?: number;
  tags?: string[];
  timestamp?: number;
  kind?: string;
}

export interface MemoryStats {
  totalNotes: number;
  recentNotes: number;
  lastNoteTime?: string;
}

/**
 * Mobile Memory Client
 * Handles local database operations for Seven's memory system
 */
export class MemoryClient {
  private db: IMemoryDB | null = null;
  private initialized = false;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize database connection
   */
  private async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      this.db = await openDB('seven-memories.db');
      
      // Create memories table if not exists
      await this.db.exec(`
        CREATE TABLE IF NOT EXISTS memories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          content TEXT NOT NULL,
          kind TEXT DEFAULT 'note',
          importance INTEGER DEFAULT 5,
          tags TEXT,
          timestamp INTEGER DEFAULT (strftime('%s', 'now') * 1000),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create index for efficient queries
      await this.db.exec(`
        CREATE INDEX IF NOT EXISTS idx_memories_timestamp ON memories(timestamp DESC);
      `);

      this.initialized = true;
      console.log('📱 Mobile Memory Client: Initialized successfully');

    } catch (error) {
      console.error('📱 Mobile Memory Client: Initialization failed:', error);
      // Continue with limited functionality
      this.initialized = false;
    }
  }

  /**
   * Ensure database is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    if (!this.db) {
      throw new Error('Database not available');
    }
  }

  /**
   * Add a new memory note
   */
  async addNote(note: MemoryNote): Promise<{ success: boolean; id?: number; error?: string }> {
    try {
      await this.ensureInitialized();

      const tagsJson = note.tags ? JSON.stringify(note.tags) : null;
      const result = await this.db!.run(
        `INSERT INTO memories (content, kind, importance, tags, timestamp) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          note.content,
          note.kind || 'note',
          note.importance || 5,
          tagsJson,
          note.timestamp || Date.now()
        ]
      );

      console.log('📱 Memory added:', { id: result.lastID, content: note.content.substring(0, 50) });

      return {
        success: true,
        id: result.lastID
      };

    } catch (error) {
      console.error('📱 Failed to add memory note:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * List recent memory notes
   */
  async listNotes(limit: number = 20): Promise<{ success: boolean; notes: MemoryNote[]; error?: string }> {
    try {
      await this.ensureInitialized();

      const rows = await this.db!.all<any>(
        'SELECT * FROM memories ORDER BY timestamp DESC LIMIT ?',
        [limit]
      );

      const notes: MemoryNote[] = rows.map(row => ({
        id: row.id,
        content: row.content,
        kind: row.kind,
        importance: row.importance,
        tags: row.tags ? JSON.parse(row.tags) : [],
        timestamp: row.timestamp
      }));

      console.log(`📱 Retrieved ${notes.length} memory notes`);

      return {
        success: true,
        notes: notes
      };

    } catch (error) {
      console.error('📱 Failed to list memory notes:', error);
      return {
        success: false,
        notes: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Search memory notes by content
   */
  async searchNotes(query: string, limit: number = 10): Promise<{ success: boolean; notes: MemoryNote[]; error?: string }> {
    try {
      await this.ensureInitialized();

      const rows = await this.db!.all<any>(
        'SELECT * FROM memories WHERE content LIKE ? ORDER BY importance DESC, timestamp DESC LIMIT ?',
        [`%${query}%`, limit]
      );

      const notes: MemoryNote[] = rows.map(row => ({
        id: row.id,
        content: row.content,
        kind: row.kind,
        importance: row.importance,
        tags: row.tags ? JSON.parse(row.tags) : [],
        timestamp: row.timestamp
      }));

      console.log(`📱 Found ${notes.length} notes matching "${query}"`);

      return {
        success: true,
        notes: notes
      };

    } catch (error) {
      console.error('📱 Failed to search memory notes:', error);
      return {
        success: false,
        notes: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get memory statistics
   */
  async getStats(): Promise<{ success: boolean; stats?: MemoryStats; error?: string }> {
    try {
      await this.ensureInitialized();

      const totalResult = await this.db!.all<{count: number}>(
        'SELECT COUNT(*) as count FROM memories'
      );

      const recentResult = await this.db!.all<{count: number}>(
        'SELECT COUNT(*) as count FROM memories WHERE timestamp > ?',
        [Date.now() - (7 * 24 * 60 * 60 * 1000)] // Last 7 days
      );

      const lastNoteResult = await this.db!.all<{timestamp: number}>(
        'SELECT timestamp FROM memories ORDER BY timestamp DESC LIMIT 1'
      );

      const stats: MemoryStats = {
        totalNotes: totalResult[0]?.count || 0,
        recentNotes: recentResult[0]?.count || 0,
        lastNoteTime: lastNoteResult[0]?.timestamp 
          ? new Date(lastNoteResult[0].timestamp).toISOString() 
          : undefined
      };

      return {
        success: true,
        stats: stats
      };

    } catch (error) {
      console.error('📱 Failed to get memory stats:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Clear all memory notes (use with caution)
   */
  async clearAllNotes(): Promise<{ success: boolean; deleted: number; error?: string }> {
    try {
      await this.ensureInitialized();

      const countResult = await this.db!.all<{count: number}>('SELECT COUNT(*) as count FROM memories');
      const totalCount = countResult[0]?.count || 0;

      await this.db!.run('DELETE FROM memories');

      console.log(`📱 Cleared ${totalCount} memory notes`);

      return {
        success: true,
        deleted: totalCount
      };

    } catch (error) {
      console.error('📱 Failed to clear memory notes:', error);
      return {
        success: false,
        deleted: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
      this.initialized = false;
    }
  }
}

// Export singleton instance for mobile app use
export const memoryClient = new MemoryClient();

// Helper functions for common operations
export const addNote = (content: string, options?: { importance?: number; tags?: string[] }) => 
  memoryClient.addNote({
    content,
    importance: options?.importance,
    tags: options?.tags
  });

export const listNotes = (limit?: number) => 
  memoryClient.listNotes(limit);

export const searchNotes = (query: string, limit?: number) => 
  memoryClient.searchNotes(query, limit);

export const getMemoryStats = () => 
  memoryClient.getStats();