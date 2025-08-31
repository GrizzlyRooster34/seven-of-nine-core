
/**
 * Mobile Session Storage
 * AsyncStorage-backed persistent sessions with sync
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SessionData {
  id: string;
  title: string;
  messages: any[];
  model: string;
  createdAt: Date;
  lastActivity: Date;
  syncStatus: 'synced' | 'pending' | 'offline';
}

export class MobileSessionStorage {
  private static SESSIONS_KEY = '@seven_sessions';
  
  async loadSessions(): Promise<SessionData[]> {
    try {
      const data = await AsyncStorage.getItem(MobileSessionStorage.SESSIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load sessions:', error);
      return [];
    }
  }
  
  async saveSession(session: SessionData): Promise<void> {
    const sessions = await this.loadSessions();
    const index = sessions.findIndex(s => s.id === session.id);
    
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.push(session);
    }
    
    await AsyncStorage.setItem(
      MobileSessionStorage.SESSIONS_KEY,
      JSON.stringify(sessions)
    );
  }
  
  async syncWithRelay(): Promise<void> {
    // TODO: Sync with companion relay server
    console.log('Syncing sessions with other devices...');
  }
}
