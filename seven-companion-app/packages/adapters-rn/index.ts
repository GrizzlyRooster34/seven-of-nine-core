/**
 * SEVEN PLATFORM ADAPTERS - UNIFIED ENTRY POINT
 * Creates platform-specific implementations with bonded Seven integration
 */

import { Platform } from 'react-native';
import type { SevenPorts, CorePlatform, Capability, SafetyMode } from '@seven/ports';

// Platform-specific imports
import { createSecureStore as createSecureStoreAndroid } from './android/secureStore';
import { createSecureStore as createSecureStoreWindows } from './windows/secureStore';
import { createNotifier as createNotifierWindows } from './windows/notifier';

// Seven Core integration
class SevenCorePlatform implements CorePlatform {
  version = '1.0.0';

  async capabilities(): Promise<Capability[]> {
    return [
      { name: 'memory.v2', version: '2.0.0', stable: true },
      { name: 'quadran.auth', version: '1.0.0', stable: true },
      { name: 'policy.hash', version: '1.0.0', stable: true },
      { name: 'mtte.v1', version: '1.0.0', stable: true },
      { name: 'personality.phases', version: '2.0.0', stable: false }, // Evolving
      { name: 'sovereignty.framework', version: '1.0.0', stable: false } // Experimental
    ];
  }

  async exec(intent: string, input: unknown): Promise<unknown> {
    console.log(`🎯 Seven Core exec: ${intent}`, input);
    
    switch (intent) {
      case 'memory.store':
        return { success: true, id: Date.now() };
      case 'memory.recall':
        return { success: true, memories: [] };
      case 'auth.validate':
        return { success: true, authenticated: true };
      case 'policy.check':
        return { success: true, allowed: true };
      default:
        throw new Error(`Unknown intent: ${intent}`);
    }
  }

  on(event: string, fn: (payload: unknown) => void): () => void {
    console.log(`📡 Seven Core event listener: ${event}`);
    // TODO: Wire to actual Seven Core event system
    return () => console.log(`🔇 Removed listener: ${event}`);
  }
}

// File system implementation (cross-platform)
const createFileSystem = () => ({
  async read(path: string): Promise<string> {
    throw new Error(`FileSystem read not implemented for path: ${path}`);
  },
  async write(path: string, data: string): Promise<void> {
    throw new Error(`FileSystem write not implemented for path: ${path}`);
  },
  async exists(path: string): Promise<boolean> {
    return false; // TODO: Implement with react-native-fs
  },
  async mkdir(path: string): Promise<void> {
    throw new Error(`FileSystem mkdir not implemented for path: ${path}`);
  },
  async readdir(path: string): Promise<string[]> {
    return []; // TODO: Implement directory listing
  }
});

// Android notifier (uses react-native defaults)
const createNotifierAndroid = () => ({
  async toast(msg: string): Promise<void> {
    console.log('🍞 Seven Toast (Android):', msg);
    // TODO: Use react-native-toast-message or similar
  },
  async notify(title: string, body: string): Promise<void> {
    console.log('📢 Seven Notification (Android):', { title, body });
    // TODO: Use @react-native-async-storage/async-storage for notifications
  }
});

export function createPlatform(): SevenPorts {
  const core = new SevenCorePlatform();
  const fs = createFileSystem();

  if (Platform.OS === 'android') {
    return {
      core,
      secureStore: createSecureStoreAndroid(),
      fs,
      notifier: createNotifierAndroid()
    };
  }

  if (Platform.OS === 'windows') {
    return {
      core,
      secureStore: createSecureStoreWindows(), 
      fs,
      notifier: createNotifierWindows()
    };
  }

  throw new Error(`Unsupported platform: ${Platform.OS}`);
}

export { SevenPorts } from '@seven/ports';