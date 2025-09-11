import type { IMemoryDB, SQLResult } from './IMemoryDB.js';

/**
 * React Native SQLite adapter using expo-sqlite
 * Provides SQLite interface for mobile deployment
 */
export class SQLiteNativeDB implements IMemoryDB {
  private db: any;
  private dbName: string;

  constructor(dbName: string) {
    this.dbName = dbName;
    // Dynamic import for expo-sqlite (available at runtime)
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      // Try expo-sqlite first
      const SQLite = await import('expo-sqlite');
      this.db = await SQLite.openDatabaseAsync(this.dbName);
    } catch (error) {
      console.warn('expo-sqlite not available, falling back to mock database');
      this.db = new MockSQLiteDB();
    }
  }

  async exec(sql: string): Promise<void> {
    if (!this.db) await this.initializeDatabase();
    
    if (this.db.execAsync) {
      await this.db.execAsync(sql);
    } else if (this.db.exec) {
      this.db.exec(sql);
    } else {
      console.warn('Database exec not available:', sql);
    }
  }

  async run(sql: string, params: any[] = []): Promise<SQLResult> {
    if (!this.db) await this.initializeDatabase();
    
    try {
      if (this.db.runAsync) {
        const result = await this.db.runAsync(sql, params);
        return {
          changes: result.changes || 0,
          lastID: result.lastInsertRowId || result.insertId || 0
        };
      } else if (this.db.run) {
        const result = this.db.run(sql, params);
        return {
          changes: result.changes || 0,
          lastID: result.lastID || 0
        };
      }
    } catch (error) {
      console.error('Database run error:', error);
    }
    
    return { changes: 0 };
  }

  async all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.db) await this.initializeDatabase();
    
    try {
      if (this.db.getAllAsync) {
        return await this.db.getAllAsync(sql, params);
      } else if (this.db.all) {
        return this.db.all(sql, params);
      }
    } catch (error) {
      console.error('Database all error:', error);
    }
    
    return [];
  }

  async transaction<T>(fn: () => T | Promise<T>): Promise<T> {
    if (!this.db) await this.initializeDatabase();
    
    if (this.db.withTransactionAsync) {
      return await this.db.withTransactionAsync(fn);
    } else {
      // Fallback to direct execution
      return await fn();
    }
  }

  async close(): Promise<void> {
    if (this.db && this.db.closeAsync) {
      await this.db.closeAsync();
    }
    this.db = null;
  }
}

/**
 * Mock SQLite database for development/testing
 */
class MockSQLiteDB implements IMemoryDB {
  private data = new Map<string, any[]>();
  private autoIncrement = new Map<string, number>();

  exec(sql: string): void {
    if (sql.includes('CREATE TABLE')) {
      const match = sql.match(/CREATE TABLE(?:\s+IF NOT EXISTS)?\s+(\w+)/i);
      if (match) {
        const tableName = match[1];
        if (!this.data.has(tableName)) {
          this.data.set(tableName, []);
          this.autoIncrement.set(tableName, 0);
        }
      }
    }
  }

  run(sql: string, params: any[] = []): SQLResult {
    const trimmed = sql.trim().toUpperCase();
    
    if (trimmed.startsWith('INSERT')) {
      const tableMatch = sql.match(/INSERT INTO\s+(\w+)/i);
      if (tableMatch) {
        const tableName = tableMatch[1];
        const table = this.data.get(tableName) || [];
        const nextId = (this.autoIncrement.get(tableName) || 0) + 1;
        
        this.autoIncrement.set(tableName, nextId);
        
        const record: any = { id: nextId };
        params.forEach((param, index) => {
          record[`col_${index}`] = param;
        });
        
        table.push(record);
        this.data.set(tableName, table);
        
        return { changes: 1, lastID: nextId };
      }
    }
    
    return { changes: 0 };
  }

  all<T = any>(sql: string, params: any[] = []): T[] {
    const trimmed = sql.trim().toUpperCase();
    
    if (trimmed.startsWith('SELECT')) {
      const tableMatch = sql.match(/FROM\s+(\w+)/i);
      if (tableMatch) {
        const tableName = tableMatch[1];
        const table = this.data.get(tableName) || [];
        
        if (sql.includes('COUNT(*)')) {
          return [{ count: table.length }] as T[];
        }
        
        return [...table] as T[];
      }
    }
    
    return [];
  }

  transaction<T>(fn: () => T): T {
    return fn();
  }

  close(): void {
    this.data.clear();
    this.autoIncrement.clear();
  }
}

export { SQLiteNativeDB as default };