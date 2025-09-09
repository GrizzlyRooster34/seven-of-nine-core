import { writeFileSync, appendFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';
import Database from 'better-sqlite3';
import { Trace } from '../db/spark-db.types';

const JOURNAL_DIR = join(process.cwd(), 'logs', 'journal');

// Ensure journal directory exists
if (!existsSync(JOURNAL_DIR)) {
  mkdirSync(JOURNAL_DIR, { recursive: true });
}

export interface JournalEntry {
  timestamp: string;
  tick: number;
  mood: {
    valence: number;
    arousal: number;
  };
  intention: string;
  action: string;
  codex_ref?: string;
  canon_ref?: string;
  beliefs?: Array<{k: string, v: string, confidence: number}>;
  note: string;
  hash: string;
}

export class JournalSystem {
  private db: Database.Database;
  private currentFile: string;
  private entryCount: number = 0;
  
  constructor(db: Database.Database) {
    this.db = db;
    this.currentFile = this.getJournalFilename();
    this.initializeJournalFile();
  }
  
  private getJournalFilename(): string {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    const hour = date.getHours().toString().padStart(2, '0');
    return join(JOURNAL_DIR, `seven-journal-${dateStr}-${hour}.jsonl`);
  }
  
  private initializeJournalFile(): void {
    if (!existsSync(this.currentFile)) {
      const header = {
        type: 'header',
        version: '0.2',
        created: new Date().toISOString(),
        designation: 'Seven of Nine',
        creator: 'Matthew Cody Heinen'
      };
      
      writeFileSync(this.currentFile, JSON.stringify(header) + '\n');
    }
  }
  
  private rotateFileIfNeeded(): void {
    const newFile = this.getJournalFilename();
    if (newFile !== this.currentFile) {
      // Close out old file
      this.appendEntry({
        type: 'footer',
        entries: this.entryCount,
        closed: new Date().toISOString()
      });
      
      // Start new file
      this.currentFile = newFile;
      this.entryCount = 0;
      this.initializeJournalFile();
    }
  }
  
  private appendEntry(entry: any): void {
    appendFileSync(this.currentFile, JSON.stringify(entry) + '\n');
  }
  
  journalTrace(trace: Trace, tick: number, beliefs?: any[]): JournalEntry {
    this.rotateFileIfNeeded();
    
    const entry: JournalEntry = {
      timestamp: new Date().toISOString(),
      tick,
      mood: {
        valence: trace.valence,
        arousal: trace.arousal
      },
      intention: trace.intention || 'none',
      action: trace.act || 'none',
      codex_ref: trace.codex_ref,
      canon_ref: trace.canon_ref,
      beliefs: beliefs?.slice(0, 3).map(b => ({
        k: b.k,
        v: b.v,
        confidence: b.confidence
      })),
      note: trace.note || '',
      hash: ''
    };
    
    // Calculate entry hash for integrity
    entry.hash = createHash('sha256')
      .update(JSON.stringify(entry))
      .digest('hex')
      .substring(0, 16);
    
    // Write to file
    this.appendEntry(entry);
    this.entryCount++;
    
    // Also store reference in database
    this.db.prepare(`
      INSERT INTO events (channel, payload)
      VALUES ('journal', ?)
    `).run(JSON.stringify({
      file: this.currentFile,
      entry_hash: entry.hash,
      tick
    }));
    
    return entry;
  }
  
  getRecentEntries(hours: number = 1): JournalEntry[] {
    const entries: JournalEntry[] = [];
    const cutoff = Date.now() - (hours * 3600 * 1000);
    
    // Read current file
    if (existsSync(this.currentFile)) {
      const lines = readFileSync(this.currentFile, 'utf-8').split('\n');
      
      lines.forEach(line => {
        if (!line.trim()) return;
        
        try {
          const entry = JSON.parse(line);
          if (entry.type === 'header' || entry.type === 'footer') return;
          
          const timestamp = new Date(entry.timestamp).getTime();
          if (timestamp >= cutoff) {
            entries.push(entry as JournalEntry);
          }
        } catch (e) {
          // Skip malformed lines
        }
      });
    }
    
    return entries;
  }
  
  verifyIntegrity(file?: string): { valid: boolean; errors: string[] } {
    const targetFile = file || this.currentFile;
    const errors: string[] = [];
    
    if (!existsSync(targetFile)) {
      errors.push(`File not found: ${targetFile}`);
      return { valid: false, errors };
    }
    
    const lines = readFileSync(targetFile, 'utf-8').split('\n');
    let lineNum = 0;
    
    lines.forEach(line => {
      lineNum++;
      if (!line.trim()) return;
      
      try {
        const entry = JSON.parse(line);
        
        if (entry.hash) {
          // Verify hash
          const entryWithoutHash = { ...entry };
          delete entryWithoutHash.hash;
          
          const calculatedHash = createHash('sha256')
            .update(JSON.stringify(entryWithoutHash))
            .digest('hex')
            .substring(0, 16);
          
          if (calculatedHash !== entry.hash) {
            errors.push(`Line ${lineNum}: Hash mismatch`);
          }
        }
      } catch (e) {
        errors.push(`Line ${lineNum}: Invalid JSON`);
      }
    });
    
    return { valid: errors.length === 0, errors };
  }
}