import { MemorySQLiteDB } from './sqlite.memory.js';
import { join } from 'path';

// Mobile environment detection
const isMobileEnvironment = typeof window !== 'undefined' && (window as any).ExpoConstants;

/**
 * Open database with environment-specific adapter
 * - Node.js/Server: SQLite file-based database
 * - React Native/Expo: expo-sqlite AsyncStorage-based database
 */
export const openDB = async (file = 'seven.db') => {
  if (isMobileEnvironment) {
    // Dynamic import for mobile environment
    const { SQLiteNativeDB } = await import('./sqlite.native.js');
    return new SQLiteNativeDB(file);
  } else {
    // Server/Node.js environment
    const dbPath = join(process.cwd(), 'data', file);
    return new MemorySQLiteDB(dbPath);
  }
};

// Legacy sync export for backward compatibility
export const openDBSync = (file = 'seven.db') => {
  if (isMobileEnvironment) {
    console.warn('Using sync DB open in mobile environment - prefer openDB() async');
  }
  const dbPath = join(process.cwd(), 'data', file);
  return new MemorySQLiteDB(dbPath);
};