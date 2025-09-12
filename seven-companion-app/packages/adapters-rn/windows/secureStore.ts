/**
 * SEVEN WINDOWS - SECURE STORE IMPLEMENTATION  
 * Windows bonded secure storage with DPAPI integration preparation
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SecureStore } from '@seven/ports';

class SevenSecureStoreWindows implements SecureStore {
  private keyPrefix = 'seven_secure_';

  async get(key: string): Promise<string | null> {
    try {
      // TODO: Integrate with Windows Credential Manager or DPAPI when native module available
      // For now, use AsyncStorage with warning for sensitive data
      if (key.includes('auth') || key.includes('token') || key.includes('creator')) {
        console.warn('⚠️ Windows: Using AsyncStorage for sensitive data - DPAPI integration pending');
      }
      
      return await AsyncStorage.getItem(this.keyPrefix + key);
    } catch (error) {
      console.warn(`SecureStore get failed for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      // TODO: Route sensitive data through Windows native secure storage
      if (key.includes('auth') || key.includes('token') || key.includes('creator')) {
        console.warn('⚠️ Windows: Storing sensitive Seven data in AsyncStorage - upgrade to DPAPI recommended');
      }
      
      await AsyncStorage.setItem(this.keyPrefix + key, value);
    } catch (error) {
      console.error(`SecureStore set failed for key ${key}:`, error);
      throw new Error(`Failed to store secure data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.keyPrefix + key);
    } catch (error) {
      console.warn(`SecureStore delete failed for key ${key}:`, error);
    }
  }
}

export const createSecureStore = (): SecureStore => new SevenSecureStoreWindows();