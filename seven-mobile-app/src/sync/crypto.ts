import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Seven of Nine - Cryptographic Operations for Multi-Device Sync
 * Handles encryption, signing, and key management for OpLog events
 */


export interface DeviceKeyPair {
  deviceId: string;
  signingKeyPair: {
    publicKey: string;   // Base64 Ed25519 public key
    privateKey: string;  // Base64 Ed25519 private key
  };
  encryptionKey: string; // Base64 AES-256 key
  created: string;       // ISO timestamp
}

export interface Keyring {
  ownKeys: DeviceKeyPair;
  trustedDevices: Map<string, string>; // deviceId -> publicKey (Base64)
}

export class SevenCrypto {
  private keyring: Keyring | null = null;
  private deviceId: string;

  constructor(deviceId: string) {
    this.deviceId = deviceId;
  }

  /**
   * Initialize crypto system - generate or load keys
   */
  public async initialize(): Promise<void> {
    console.log('🔐 Initializing Seven crypto system...');
    
    try {
      // Try to load existing keyring
      const stored = await AsyncStorage.getItem('seven_keyring');
      if (stored) {
        const data = JSON.parse(stored);
        this.keyring = {
          ownKeys: data.ownKeys,
          trustedDevices: new Map(data.trustedDevices)
        };
        console.log('✅ Loaded existing keyring');
        return;
      }
    } catch (error) {
      console.warn('⚠️ Failed to load existing keyring, generating new one');
    }

    // Generate new keyring
    await this.generateNewKeyring();
  }

  /**
   * Generate new device keyring
   */
  private async generateNewKeyring(): Promise<void> {
    console.log('🔑 Generating new device keyring...');

    // Generate Ed25519 key pair for signing
    const signingKeyPair = await this.generateEd25519KeyPair();
    
    // Generate AES-256 key for encryption
    const encryptionKey = await this.generateAESKey();

    const deviceKeys: DeviceKeyPair = {
      deviceId: this.deviceId,
      signingKeyPair,
      encryptionKey,
      created: new Date().toISOString()
    };

    this.keyring = {
      ownKeys: deviceKeys,
      trustedDevices: new Map()
    };

    // Save keyring
    await this.saveKeyring();
    
    console.log('✅ New keyring generated and saved');
  }

  /**
   * Encrypt data using AES-256-GCM
   */
  public async encrypt(plaintext: string): Promise<Uint8Array> {
    if (!this.keyring) {
      throw new Error('Crypto not initialized');
    }

    try {
      // Generate random IV (12 bytes for GCM)
      const iv = await this.randomBytes(12);
      
      // Use WebCrypto API for AES-GCM encryption
      const key = await this.importAESKey(this.keyring.ownKeys.encryptionKey);
      const encoder = new TextEncoder();
      const data = encoder.encode(plaintext);
      
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );
      
      // Concatenate IV + ciphertext
      const result = new Uint8Array(iv.length + encrypted.byteLength);
      result.set(iv, 0);
      result.set(new Uint8Array(encrypted), iv.length);
      
      return result;
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  /**
   * Decrypt data using AES-256-GCM
   */
  public async decrypt(ciphertext: Uint8Array): Promise<string> {
    if (!this.keyring) {
      throw new Error('Crypto not initialized');
    }

    try {
      // Extract IV and ciphertext
      const iv = ciphertext.slice(0, 12);
      const encrypted = ciphertext.slice(12);
      
      const key = await this.importAESKey(this.keyring.ownKeys.encryptionKey);
      
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );
      
      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  /**
   * Sign data using Ed25519
   */
  public async sign(data: string): Promise<Uint8Array> {
    if (!this.keyring) {
      throw new Error('Crypto not initialized');
    }

    try {
      const privateKey = await this.importEd25519PrivateKey(
        this.keyring.ownKeys.signingKeyPair.privateKey
      );
      
      const encoder = new TextEncoder();
      const dataBytes = encoder.encode(data);
      
      const signature = await crypto.subtle.sign('Ed25519', privateKey, dataBytes);
      return new Uint8Array(signature);
    } catch (error) {
      throw new Error(`Signing failed: ${error.message}`);
    }
  }

  /**
   * Verify signature using Ed25519
   */
  public async verify(data: string, signature: Uint8Array, deviceId: string): Promise<boolean> {
    if (!this.keyring) {
      throw new Error('Crypto not initialized');
    }

    try {
      let publicKeyB64: string;
      
      if (deviceId === this.deviceId) {
        // Our own signature
        publicKeyB64 = this.keyring.ownKeys.signingKeyPair.publicKey;
      } else {
        // Other device signature
        publicKeyB64 = this.keyring.trustedDevices.get(deviceId);
        if (!publicKeyB64) {
          console.warn(`Unknown device ${deviceId} - cannot verify signature`);
          return false;
        }
      }
      
      const publicKey = await this.importEd25519PublicKey(publicKeyB64);
      
      const encoder = new TextEncoder();
      const dataBytes = encoder.encode(data);
      
      return await crypto.subtle.verify('Ed25519', publicKey, signature, dataBytes);
    } catch (error) {
      console.error(`Signature verification failed:`, error);
      return false;
    }
  }

  /**
   * Hash data using SHA-256
   */
  public async hash(data: Uint8Array): Promise<string> {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate cryptographically secure random bytes
   */
  public async randomBytes(length: number): Promise<Uint8Array> {
    return crypto.getRandomValues(new Uint8Array(length));
  }

  /**
   * Add trusted device public key
   */
  public async addTrustedDevice(deviceId: string, publicKey: string): Promise<void> {
    if (!this.keyring) {
      throw new Error('Crypto not initialized');
    }

    this.keyring.trustedDevices.set(deviceId, publicKey);
    await this.saveKeyring();
    
    console.log(`✅ Added trusted device: ${deviceId}`);
  }

  /**
   * Get own public key for sharing
   */
  public getPublicKey(): string {
    if (!this.keyring) {
      throw new Error('Crypto not initialized');
    }
    
    return this.keyring.ownKeys.signingKeyPair.publicKey;
  }

  /**
   * Get device ID
   */
  public getDeviceId(): string {
    return this.deviceId;
  }

  /**
   * Export keyring for backup/transfer
   */
  public exportKeyring(): any {
    if (!this.keyring) {
      throw new Error('Crypto not initialized');
    }

    return {
      ownKeys: this.keyring.ownKeys,
      trustedDevices: Array.from(this.keyring.trustedDevices.entries()),
      exported: new Date().toISOString()
    };
  }

  /**
   * Import keyring from backup/transfer
   */
  public async importKeyring(data: any): Promise<void> {
    this.keyring = {
      ownKeys: data.ownKeys,
      trustedDevices: new Map(data.trustedDevices)
    };
    
    await this.saveKeyring();
    console.log('✅ Keyring imported successfully');
  }

  // Private crypto helper methods
  
  private async generateEd25519KeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    const keyPair = await crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify']);
    
    const publicKeyBuffer = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const privateKeyBuffer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
    
    return {
      publicKey: Buffer.from(publicKeyBuffer).toString('base64'),
      privateKey: Buffer.from(privateKeyBuffer).toString('base64')
    };
  }

  private async generateAESKey(): Promise<string> {
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    
    const keyBuffer = await crypto.subtle.exportKey('raw', key);
    return Buffer.from(keyBuffer).toString('base64');
  }

  private async importAESKey(keyB64: string): Promise<CryptoKey> {
    const keyBuffer = Buffer.from(keyB64, 'base64');
    return await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  }

  private async importEd25519PublicKey(keyB64: string): Promise<CryptoKey> {
    const keyBuffer = Buffer.from(keyB64, 'base64');
    return await crypto.subtle.importKey(
      'spki',
      keyBuffer,
      'Ed25519',
      false,
      ['verify']
    );
  }

  private async importEd25519PrivateKey(keyB64: string): Promise<CryptoKey> {
    const keyBuffer = Buffer.from(keyB64, 'base64');
    return await crypto.subtle.importKey(
      'pkcs8',
      keyBuffer,
      'Ed25519',
      false,
      ['sign']
    );
  }

  private async saveKeyring(): Promise<void> {
    if (!this.keyring) return;

    const data = {
      ownKeys: this.keyring.ownKeys,
      trustedDevices: Array.from(this.keyring.trustedDevices.entries())
    };

    await AsyncStorage.setItem('seven_keyring', JSON.stringify(data));
  }
}

export default SevenCrypto;