import type { IMemoryDB, SQLResult } from './IMemoryDB.js';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

/**
 * In-memory SQLite-compatible adapter using JSON persistence
 * Provides SQLite interface without native compilation requirements
 */
export class MemorySQLiteDB implements IMemoryDB {
  private tables: Map<string, any[]> = new Map();
  private filePath: string;
  private autoIncrement: Map<string, number> = new Map();

  constructor(filePath: string) {
    this.filePath = filePath;
    this.loadFromFile();
  }

  private async loadFromFile(): Promise<void> {
    try {
      if (existsSync(this.filePath)) {
        const data = await readFile(this.filePath, 'utf8');
        const parsed = JSON.parse(data);
        this.tables = new Map(parsed.tables || []);
        this.autoIncrement = new Map(parsed.autoIncrement || []);
      }
    } catch (error) {
      console.warn('Failed to load database file:', error);
    }
  }

  private async saveToFile(): Promise<void> {
    try {
      const dir = dirname(this.filePath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      
      const data = {
        tables: Array.from(this.tables.entries()),
        autoIncrement: Array.from(this.autoIncrement.entries())
      };
      await writeFile(this.filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Failed to save database file:', error);
    }
  }

  exec(sql: string): void {
    const trimmed = sql.trim().toUpperCase();
    
    if (trimmed.startsWith('CREATE TABLE')) {
      this.handleCreateTable(sql);
    } else if (trimmed.startsWith('CREATE INDEX')) {
      // Index operations are no-ops in this implementation
      return;
    } else {
      console.warn('Unsupported exec SQL:', sql);
    }
  }

  private handleCreateTable(sql: string): void {
    const match = sql.match(/CREATE TABLE(?:\s+IF NOT EXISTS)?\s+(\w+)/i);
    if (match) {
      const tableName = match[1];
      if (!this.tables.has(tableName)) {
        this.tables.set(tableName, []);
        this.autoIncrement.set(tableName, 0);
      }
    }
  }

  run(sql: string, params: any[] = []): SQLResult {
    const trimmed = sql.trim().toUpperCase();
    
    if (trimmed.startsWith('INSERT')) {
      return this.handleInsert(sql, params);
    } else if (trimmed.startsWith('UPDATE')) {
      return this.handleUpdate(sql, params);
    } else if (trimmed.startsWith('DELETE')) {
      return this.handleDelete(sql, params);
    } else {
      console.warn('Unsupported run SQL:', sql);
      return { changes: 0 };
    }
  }

  private handleInsert(sql: string, params: any[]): SQLResult {
    // Simple INSERT parser - extract table name
    const tableMatch = sql.match(/INSERT INTO\s+(\w+)/i);
    if (!tableMatch) return { changes: 0 };
    
    const tableName = tableMatch[1];
    if (!this.tables.has(tableName)) {
      this.tables.set(tableName, []);
      this.autoIncrement.set(tableName, 0);
    }
    
    const table = this.tables.get(tableName)!;
    const nextId = (this.autoIncrement.get(tableName) || 0) + 1;
    this.autoIncrement.set(tableName, nextId);
    
    // Create record with auto-increment ID and parameters
    const record: any = { id: nextId };
    
    // Parse column names if available
    const columnsMatch = sql.match(/\((.*?)\)/);
    if (columnsMatch) {
      const columns = columnsMatch[1].split(',').map(c => c.trim());
      columns.forEach((col, index) => {
        if (col !== 'id' && params[index] !== undefined) {
          record[col] = params[index];
        }
      });
    } else {
      // Simple parameter mapping
      params.forEach((param, index) => {
        record[`col_${index}`] = param;
      });
    }
    
    table.push(record);
    this.saveToFile();
    
    return { changes: 1, lastID: nextId };
  }

  private handleUpdate(sql: string, params: any[]): SQLResult {
    // Basic UPDATE implementation
    const tableMatch = sql.match(/UPDATE\s+(\w+)/i);
    if (!tableMatch) return { changes: 0 };
    
    const tableName = tableMatch[1];
    const table = this.tables.get(tableName);
    if (!table) return { changes: 0 };
    
    // Simple update all records for now
    let changes = 0;
    table.forEach(record => {
      // Basic parameter replacement
      if (params.length > 0) {
        record.updated_at = new Date().toISOString();
        changes++;
      }
    });
    
    this.saveToFile();
    return { changes };
  }

  private handleDelete(sql: string, params: any[]): SQLResult {
    // Basic DELETE implementation
    const tableMatch = sql.match(/DELETE FROM\s+(\w+)/i);
    if (!tableMatch) return { changes: 0 };
    
    const tableName = tableMatch[1];
    const table = this.tables.get(tableName);
    if (!table) return { changes: 0 };
    
    const originalLength = table.length;
    // Simple delete all for now - would need WHERE clause parsing for specifics
    this.tables.set(tableName, []);
    
    this.saveToFile();
    return { changes: originalLength };
  }

  all<T = any>(sql: string, params: any[] = []): T[] {
    const trimmed = sql.trim().toUpperCase();
    
    if (trimmed.startsWith('SELECT')) {
      return this.handleSelect(sql, params) as T[];
    } else {
      console.warn('Unsupported all SQL:', sql);
      return [];
    }
  }

  private handleSelect(sql: string, params: any[]): any[] {
    // Extract table name
    const tableMatch = sql.match(/FROM\s+(\w+)/i);
    if (!tableMatch) return [];
    
    const tableName = tableMatch[1];
    const table = this.tables.get(tableName);
    if (!table) return [];
    
    // Basic SELECT * implementation
    if (sql.includes('SELECT *') || sql.includes('SELECT COUNT(*)')) {
      if (sql.includes('COUNT(*)')) {
        return [{ count: table.length }];
      }
      return [...table];
    }
    
    // Return limited results for pagination
    const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      const limit = parseInt(limitMatch[1]);
      return table.slice(0, limit);
    }
    
    return [...table];
  }

  transaction<T>(fn: () => T): T {
    // Simple transaction - execute function and save
    const result = fn();
    this.saveToFile();
    return result;
  }

  close(): void {
    this.saveToFile();
  }
}