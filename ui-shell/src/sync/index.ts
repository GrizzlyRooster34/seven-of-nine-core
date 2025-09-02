
export { WindowsSyncClient } from './WindowsSyncClient';

// Integration with Tauri backend
export const initializeSync = async () => {
  const config = {
    relayServerUrl: 'ws://localhost:3001/sync',
    deviceId: await generateDeviceId(),
    encryptionKey: await getOrCreateEncryptionKey()
  };
  
  return new WindowsSyncClient(config);
};

async function generateDeviceId(): Promise<string> {
  // TODO: Generate stable device identifier
  return 'windows-' + Math.random().toString(36).substring(7);
}

async function getOrCreateEncryptionKey(): Promise<string> {
  // TODO: Secure key storage using OS keychain
  return 'temp-encryption-key';
}
