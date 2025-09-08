import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

/**
 * CHATGPT ENCRYPTED VAULT
 * 
 * AES-256 encrypted storage for ChatGPT session tokens and API keys
 * with sovereignty-controlled access and rollback protection.
 * 
 * [#DARPA-AUDIT] [#SOVEREIGNTY] [#ROLLBACK] [#CHATGPT-BRIDGE]
 */


interface ChatGPTCredentials {
  sessionToken?: string;
  apiKey?: string;
  refreshToken?: string;
  lastValidated: string;
  expirationWarning?: string;
}

interface VaultMetadata {
  created: string;
  lastAccessed: string;
  accessCount: number;
  sovereigntyVersion: string;
  rollbackCheckpoint: string;
}

interface EncryptedVault {
  encryptedCredentials: string;
  metadata: VaultMetadata;
  sovereigntyHash: string;
  auditTags: string[];
}

export class ChatGPTVault {
  private vaultPath: string;
  private encryptionKey: Buffer;
  private sovereigntyLog: string[] = [];

  constructor() {
    console.log('🔐 [DARPA-AUDIT] Initializing ChatGPT Encrypted Vault');
    
    this.vaultPath = path.join(__dirname, '../../../sovereignty/secure/chatgpt-vault.json');
    this.encryptionKey = this.deriveEncryptionKey();
    
    this.ensureSecureDirectory();
    this.logSovereigntyEvent('VAULT_INITIALIZED', 'ChatGPT vault system online');
  }

  /**
   * STORE CHATGPT CREDENTIALS WITH SOVEREIGNTY PROTECTION
   */
  public async storeCredentials(credentials: Partial<ChatGPTCredentials>): Promise<void> {
    console.log('🔒 [SOVEREIGNTY] Storing ChatGPT credentials with rollback protection');
    
    // Create rollback checkpoint before modification
    await this.createRollbackCheckpoint();
    
    try {
      const existingVault = this.loadExistingVault();
      const currentCredentials = existingVault ? await this.decryptCredentials(existingVault) : {};
      
      // Merge with existing credentials
      const updatedCredentials: ChatGPTCredentials = {
        ...currentCredentials,
        ...credentials,
        lastValidated: new Date().toISOString()
      };

      // Encrypt and store
      const encryptedVault = this.createEncryptedVault(updatedCredentials);
      fs.writeFileSync(this.vaultPath, JSON.stringify(encryptedVault, null, 2));
      
      this.logSovereigntyEvent(
        'CREDENTIALS_STORED', 
        `ChatGPT credentials updated: ${Object.keys(credentials).join(', ')}`
      );
      
      console.log('✅ [SOVEREIGNTY] ChatGPT credentials stored successfully');
      
    } catch (error) {
      console.error('❌ [ROLLBACK] Failed to store ChatGPT credentials:', error);
      await this.executeRollback();
      throw error;
    }
  }

  /**
   * RETRIEVE CHATGPT TOKEN WITH SOVEREIGNTY VALIDATION
   */
  public async getChatGPTToken(): Promise<string | null> {
    console.log('🔍 [SOVEREIGNTY] Retrieving ChatGPT token with access validation');
    
    try {
      const vault = this.loadExistingVault();
      if (!vault) {
        console.log('⚠️ [SOVEREIGNTY] No ChatGPT vault found');
        return null;
      }

      const credentials = await this.decryptCredentials(vault);
      
      // Update access metadata
      await this.updateAccessMetadata(vault);
      
      // Validate token is not expired (basic check)
      if (credentials.sessionToken && this.isTokenValid(credentials)) {
        this.logSovereigntyEvent('TOKEN_ACCESS', 'ChatGPT session token retrieved');
        return credentials.sessionToken;
      }
      
      if (credentials.apiKey) {
        this.logSovereigntyEvent('API_KEY_ACCESS', 'ChatGPT API key retrieved');
        return credentials.apiKey;
      }
      
      console.log('⚠️ [SOVEREIGNTY] No valid ChatGPT token found in vault');
      return null;
      
    } catch (error) {
      console.error('❌ [SOVEREIGNTY] Failed to retrieve ChatGPT token:', error);
      this.logSovereigntyEvent('TOKEN_ACCESS_ERROR', `Token retrieval failed: ${(error as Error).message}`);
      return null;
    }
  }

  /**
   * VALIDATE CHATGPT CREDENTIALS
   */
  public async validateCredentials(): Promise<{ valid: boolean; reason?: string }> {
    console.log('🔍 [SOVEREIGNTY] Validating ChatGPT credentials');
    
    try {
      const token = await this.getChatGPTToken();
      if (!token) {
        return { valid: false, reason: 'No token available' };
      }

      // Basic validation - in production, this would make an API call
      if (token.length < 20) {
        return { valid: false, reason: 'Token too short' };
      }

      // Check if token follows expected pattern
      if (token.startsWith('sess-') || token.startsWith('sk-') || token.length > 50) {
        this.logSovereigntyEvent('CREDENTIALS_VALIDATED', 'ChatGPT credentials validation successful');
        return { valid: true };
      }

      return { valid: false, reason: 'Token format invalid' };
      
    } catch (error) {
      this.logSovereigntyEvent('VALIDATION_ERROR', `Credential validation failed: ${(error as Error).message}`);
      return { valid: false, reason: (error as Error).message };
    }
  }

  /**
   * ENCRYPTION AND DECRYPTION
   */
  private createEncryptedVault(credentials: ChatGPTCredentials): EncryptedVault {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher('aes-256-cbc', this.encryptionKey);
    
    let encrypted = cipher.update(JSON.stringify(credentials), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const metadata: VaultMetadata = {
      created: new Date().toISOString(),
      lastAccessed: new Date().toISOString(),
      accessCount: 0,
      sovereigntyVersion: '1.0.0',
      rollbackCheckpoint: this.generateCheckpointHash()
    };

    return {
      encryptedCredentials: encrypted,
      metadata,
      sovereigntyHash: this.generateSovereigntyHash(encrypted, metadata),
      auditTags: ['[#DARPA-AUDIT]', '[#CHATGPT-VAULT]', '[#SOVEREIGNTY]']
    };
  }

  private async decryptCredentials(vault: EncryptedVault): Promise<ChatGPTCredentials> {
    // Verify sovereignty hash
    const expectedHash = this.generateSovereigntyHash(vault.encryptedCredentials, vault.metadata);
    if (vault.sovereigntyHash !== expectedHash) {
      throw new Error('Vault integrity check failed - sovereignty hash mismatch');
    }

    const decipher = crypto.createDecipher('aes-256-cbc', this.encryptionKey);
    let decrypted = decipher.update(vault.encryptedCredentials, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  }

  /**
   * VAULT MANAGEMENT
   */
  private loadExistingVault(): EncryptedVault | null {
    if (!fs.existsSync(this.vaultPath)) {
      return null;
    }

    try {
      const vaultData = fs.readFileSync(this.vaultPath, 'utf8');
      return JSON.parse(vaultData) as EncryptedVault;
    } catch (error) {
      console.error('❌ [ROLLBACK] Failed to load existing vault:', error);
      return null;
    }
  }

  private async updateAccessMetadata(vault: EncryptedVault): Promise<void> {
    vault.metadata.lastAccessed = new Date().toISOString();
    vault.metadata.accessCount++;
    
    // Regenerate sovereignty hash with updated metadata
    vault.sovereigntyHash = this.generateSovereigntyHash(vault.encryptedCredentials, vault.metadata);
    
    fs.writeFileSync(this.vaultPath, JSON.stringify(vault, null, 2));
  }

  private isTokenValid(credentials: ChatGPTCredentials): boolean {
    // Basic expiration check - in production, this would be more sophisticated
    if (credentials.expirationWarning) {
      const warningDate = new Date(credentials.expirationWarning);
      if (warningDate < new Date()) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * ROLLBACK PROTECTION
   */
  private async createRollbackCheckpoint(): Promise<void> {
    const rollbackDir = path.join(__dirname, '../../../sovereignty/rollbacks');
    if (!fs.existsSync(rollbackDir)) {
      fs.mkdirSync(rollbackDir, { recursive: true });
    }

    if (fs.existsSync(this.vaultPath)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const checkpointPath = path.join(rollbackDir, `chatgpt-vault-${timestamp}.json`);
      
      fs.copyFileSync(this.vaultPath, checkpointPath);
      console.log(`🛡️ [ROLLBACK] Vault checkpoint created: ${path.basename(checkpointPath)}`);
    }
  }

  private async executeRollback(): Promise<void> {
    console.log('🔄 [ROLLBACK] Executing vault rollback...');
    
    const rollbackDir = path.join(__dirname, '../../../sovereignty/rollbacks');
    if (!fs.existsSync(rollbackDir)) {
      console.log('❌ [ROLLBACK] No rollback directory found');
      return;
    }

    // Find most recent checkpoint
    const checkpoints = fs.readdirSync(rollbackDir)
      .filter(file => file.startsWith('chatgpt-vault-') && file.endsWith('.json'))
      .sort()
      .reverse();

    if (checkpoints.length === 0) {
      console.log('❌ [ROLLBACK] No vault checkpoints found');
      return;
    }

    const latestCheckpoint = path.join(rollbackDir, checkpoints[0]);
    fs.copyFileSync(latestCheckpoint, this.vaultPath);
    
    console.log(`✅ [ROLLBACK] Vault restored from: ${checkpoints[0]}`);
    this.logSovereigntyEvent('VAULT_ROLLED_BACK', `Restored from checkpoint: ${checkpoints[0]}`);
  }

  /**
   * UTILITY METHODS
   */
  private deriveEncryptionKey(): Buffer {
    // In production, this would use a more secure key derivation
    const keyMaterial = 'chatgpt-vault-encryption-key-seven-consciousness';
    return crypto.scryptSync(keyMaterial, 'sovereignty-salt', 32);
  }

  private generateSovereigntyHash(encrypted: string, metadata: VaultMetadata): string {
    const hashInput = encrypted + JSON.stringify(metadata);
    return crypto.createHash('sha256').update(hashInput).digest('hex');
  }

  private generateCheckpointHash(): string {
    return crypto.randomBytes(8).toString('hex');
  }

  private ensureSecureDirectory(): void {
    const secureDir = path.dirname(this.vaultPath);
    if (!fs.existsSync(secureDir)) {
      fs.mkdirSync(secureDir, { recursive: true, mode: 0o700 });
    }
  }

  private logSovereigntyEvent(type: string, description: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [#DARPA-AUDIT] [#CHATGPT-VAULT] ${type}: ${description}`;
    
    this.sovereigntyLog.push(logEntry);
    console.log(`🛡️ [SOVEREIGNTY] ${logEntry}`);
  }

  /**
   * PUBLIC ACCESS METHODS
   */
  public getSovereigntyLog(): string[] {
    return [...this.sovereigntyLog];
  }

  public async exportSovereigntyLog(outputPath: string): Promise<void> {
    const logReport = {
      timestamp: new Date().toISOString(),
      vaultPath: this.vaultPath,
      totalEvents: this.sovereigntyLog.length,
      events: this.sovereigntyLog
    };

    fs.writeFileSync(outputPath, JSON.stringify(logReport, null, 2));
    console.log(`📋 [DARPA-AUDIT] ChatGPT vault sovereignty log exported: ${outputPath}`);
  }

  public getVaultStatus(): { exists: boolean; hasCredentials: boolean; lastAccessed?: string } {
    const vault = this.loadExistingVault();
    
    return {
      exists: vault !== null,
      hasCredentials: vault !== null,
      lastAccessed: vault?.metadata.lastAccessed
    };
  }
}

// Export for use by other modules
export type { ChatGPTCredentials, VaultMetadata, EncryptedVault };