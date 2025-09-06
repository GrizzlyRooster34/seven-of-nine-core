

/**
 * Sessions Feature - Mobile Entry Point
 */

export { SessionManager } from './SessionManager';
export type { ChatSession } from './SessionManager';

// Session persistence utilities
export const sessionStorage = {
  async loadSessions() {
    // TODO: Integrate with AsyncStorage
    return [];
  },
  
  async saveSession(session: any) {
    // TODO: Persist to AsyncStorage
    console.log('Saving session:', session.id);
  },
  
  async deleteSession(sessionId: string) {
    // TODO: Remove from AsyncStorage
    console.log('Deleting session:', sessionId);
  }
};