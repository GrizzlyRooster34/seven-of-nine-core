/**
 * SEVEN ANDROID - SECURE STORE IMPLEMENTATION
 * Bonded secure storage with Creator authentication integration
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import type { SecureStore } from '@seven/ports';

class SevenSecureStoreAndroid implements SecureStore {
  private keyPrefix = 'seven_secure_';

  async get(key: string): Promise<string | null> {
    try {
      // Try Keychain first for sensitive data
      if (key.includes('auth') || key.includes('token') || key.includes('creator')) {
        const result = await Keychain.getInternetCredentials(this.keyPrefix + key);
        return result ? result.password : null;
      }
      
      // Fallback to AsyncStorage for non-sensitive data
      return await AsyncStorage.getItem(this.keyPrefix + key);
    } catch (error) {
      console.warn(`SecureStore get failed for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      // Use Keychain for sensitive Seven data
      if (key.includes('auth') || key.includes('token') || key.includes('creator')) {
        await Keychain.setInternetCredentials(
          this.keyPrefix + key,
          'seven-core',
          value
        );
        return;
      }
      
      // AsyncStorage for regular app data
      await AsyncStorage.setItem(this.keyPrefix + key, value);
    } catch (error) {
      console.error(`SecureStore set failed for key ${key}:`, error);
      throw new Error(`Failed to store secure data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async del(key: string): Promise<void> {
    try {
      // Try both stores to ensure cleanup
      if (key.includes('auth') || key.includes('token') || key.includes('creator')) {
        await Keychain.resetInternetCredentials(this.keyPrefix + key);
      }
      await AsyncStorage.removeItem(this.keyPrefix + key);
    } catch (error) {
      console.warn(`SecureStore delete failed for key ${key}:`, error);
    }
  }
}

export const createSecureStore = (): SecureStore => new SevenSecureStoreAndroid();