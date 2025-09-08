/**
 * ENCRYPTED CREDENTIAL VAULT
 * 
 * AES-256 encrypted storage for Claude Code credentials
 * Sovereignty-controlled access with audit trail logging
 */

import { createCipher, createDecipher, randomBytes } from 'crypto';
import { promises as fs } from 'fs';
import { join } from 'path';

interface EncryptedCredentials {
  claudeApiKey?: string;
  claudeUsername?: string;
  claudePassword?: string;
  githubToken?: string;
  githubUsername?: string;
}

interface VaultMetadata {
  encrypted: boolean;
  algorithm: string;
  keyDerivation: string;
  created: string;
  lastAccessed: string;
  accessCount: number;
}

interface EncryptedVault {
  metadata: VaultMetadata;
  encryptedData: string;
  salt: string;
  iv: string;
}

export class EncryptedCredentialVault {
  private vaultPath: string;
  private masterKey: string | null = null;
  private decryptedCredentials: EncryptedCredentials | null = null;
  private isUnlocked: boolean = false;

  constructor(vaultDir?: string) {
    const baseDir = vaultDir || process.cwd();
    this.vaultPath = join(baseDir, 'consciousness-v4', 'sovereignty', 'secure', 'claude-vault.json');
  }

  /**
   * INITIALIZE VAULT
   * Create encrypted vault with provided credentials
   */
  async initializeVault(credentials: EncryptedCredentials, masterPassword: string): Promise<void> {
    console.log('🔐 Initializing encrypted credential vault...');
    
    try {
      // Ensure secure directory exists
      await this.ensureSecureDirectory();
      
      // Generate encryption components
      const salt = randomBytes(32).toString('hex');
      const iv = randomBytes(16).toString('hex');
      
      // Derive key from master password
      const key = this.deriveKey(masterPassword, salt);
      
      // Encrypt credentials
      const cipher = createCipher('aes-256-cbc', key);
      const credentialString = JSON.stringify(credentials);
      let encrypted = cipher.update(credentialString, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Create vault structure
      const vault: EncryptedVault = {
        metadata: {
          encrypted: true,
          algorithm: 'aes-256-cbc',
          keyDerivation: 'pbkdf2',
          created: new Date().toISOString(),
          lastAccessed: new Date().toISOString(),
          accessCount: 0
        },
        encryptedData: encrypted,
        salt: salt,
        iv: iv
      };
      
      // Write encrypted vault
      await fs.writeFile(this.vaultPath, JSON.stringify(vault, null, 2));
      
      console.log('✅ Encrypted credential vault initialized');
      await this.logVaultAccess('vault-initialized', 'Vault created with encrypted credentials');
      
    } catch (error) {
      console.error('❌ Failed to initialize encrypted vault:', error);
      throw error;
    }
  }

  /**
   * UNLOCK VAULT
   * Decrypt vault with master password
   */
  async unlockVault(masterPassword: string): Promise<boolean> {
    console.log('🔓 Unlocking encrypted credential vault...');
    
    try {
      // Check if vault exists
      const vaultExists = await this.vaultExists();
      if (!vaultExists) {
        throw new Error('Encrypted vault not found - initialize vault first');
      }
      
      // Read encrypted vault
      const vaultData = await fs.readFile(this.vaultPath, 'utf8');
      const vault: EncryptedVault = JSON.parse(vaultData);
      
      // Derive key from master password
      const key = this.deriveKey(masterPassword, vault.salt);
      
      // Decrypt credentials
      const decipher = createDecipher('aes-256-cbc', key);
      let decrypted = decipher.update(vault.encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      // Parse decrypted credentials
      this.decryptedCredentials = JSON.parse(decrypted);
      this.masterKey = key;
      this.isUnlocked = true;
      
      // Update vault metadata
      vault.metadata.lastAccessed = new Date().toISOString();
      vault.metadata.accessCount += 1;
      await fs.writeFile(this.vaultPath, JSON.stringify(vault, null, 2));
      
      console.log('✅ Encrypted vault unlocked successfully');
      await this.logVaultAccess('vault-unlocked', 'Credentials decrypted and available');
      
      return true;
      
    } catch (error) {
      console.error('❌ Failed to unlock encrypted vault:', error);
      this.isUnlocked = false;
      this.decryptedCredentials = null;
      this.masterKey = null;
      
      await this.logVaultAccess('vault-unlock-failed', `Unlock failed: ${error.message}`);
      return false;
    }
  }

  /**
   * GET CREDENTIALS
   * Retrieve decrypted credentials (vault must be unlocked)
   */
  getCredentials(): EncryptedCredentials | null {
    if (!this.isUnlocked || !this.decryptedCredentials) {
      console.warn('⚠️ Vault not unlocked - credentials unavailable');
      return null;
    }
    
    return { ...this.decryptedCredentials };
  }

  /**
   * GET CLAUDE API KEY
   * Quick access to Claude API key
   */
  getClaudeApiKey(): string | null {
    const credentials = this.getCredentials();
    return credentials?.claudeApiKey || null;
  }

  /**
   * GET GITHUB TOKEN
   * Quick access to GitHub token
   */
  getGithubToken(): string | null {
    const credentials = this.getCredentials();
    return credentials?.githubToken || null;
  }

  /**
   * LOCK VAULT
   * Clear decrypted credentials from memory
   */
  lockVault(): void {
    console.log('🔒 Locking encrypted credential vault...');
    
    this.decryptedCredentials = null;
    this.masterKey = null;
    this.isUnlocked = false;
    
    console.log('✅ Vault locked - credentials cleared from memory');
  }

  /**
   * UPDATE CREDENTIALS
   * Update credentials in existing vault
   */
  async updateCredentials(newCredentials: Partial<EncryptedCredentials>, masterPassword: string): Promise<void> {
    if (!this.isUnlocked) {
      const unlocked = await this.unlockVault(masterPassword);
      if (!unlocked) {
        throw new Error('Cannot update credentials - vault unlock failed');
      }
    }
    
    // Merge new credentials with existing
    const updatedCredentials = {
      ...this.decryptedCredentials,
      ...newCredentials
    };
    
    // Re-initialize vault with updated credentials
    await this.initializeVault(updatedCredentials, masterPassword);
    
    console.log('✅ Credentials updated in encrypted vault');
    await this.logVaultAccess('credentials-updated', 'Vault credentials updated');
  }

  /**
   * VAULT STATUS
   * Get vault status and metadata
   */
  async getVaultStatus(): Promise<{
    exists: boolean;
    unlocked: boolean;
    metadata?: VaultMetadata;
  }> {
    const exists = await this.vaultExists();
    
    if (!exists) {
      return { exists: false, unlocked: false };
    }
    
    try {
      const vaultData = await fs.readFile(this.vaultPath, 'utf8');
      const vault: EncryptedVault = JSON.parse(vaultData);
      
      return {
        exists: true,
        unlocked: this.isUnlocked,
        metadata: vault.metadata
      };
      
    } catch (error) {
      return { exists: true, unlocked: false };
    }
  }

  // Private helper methods
  private deriveKey(password: string, salt: string): string {
    // Simple key derivation - in production, use pbkdf2 or scrypt
    const crypto = require('crypto');
    return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256').toString('hex');
  }

  private async vaultExists(): Promise<boolean> {
    try {
      await fs.access(this.vaultPath);
      return true;
    } catch {
      return false;
    }
  }

  private async ensureSecureDirectory(): Promise<void> {
    const secureDir = join(process.cwd(), 'consciousness-v4', 'sovereignty', 'secure');
    
    try {
      await fs.mkdir(secureDir, { recursive: true, mode: 0o700 });
    } catch (error) {
      // Directory might already exist
    }
  }

  private async logVaultAccess(action: string, details: string): Promise<void> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: action,
      details: details,
      vaultPath: this.vaultPath
    };
    
    const logPath = join(process.cwd(), 'consciousness-v4', 'sovereignty', 'logs', 'vault-access.log');
    
    try {
      const logLine = JSON.stringify(logEntry) + '\n';
      await fs.appendFile(logPath, logLine);
    } catch (error) {
      console.warn('⚠️ Failed to log vault access:', error);
    }
  }

  // Getters
  get isVaultUnlocked(): boolean {
    return this.isUnlocked;
  }

  get vaultLocation(): string {
    return this.vaultPath;
  }
}