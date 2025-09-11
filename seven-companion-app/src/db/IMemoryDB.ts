export interface SQLResult { 
  changes?: number; 
  lastID?: number; 
  rows?: any[]; 
}

export interface IMemoryDB {
  exec(sql: string): void | Promise<void>;
  run(sql: string, params?: any[]): SQLResult | Promise<SQLResult>;
  all<T = any>(sql: string, params?: any[]): T[] | Promise<T[]>;
  transaction<T = any>(fn: () => T | Promise<T>): T | Promise<T>;
  close(): void | Promise<void>;
}