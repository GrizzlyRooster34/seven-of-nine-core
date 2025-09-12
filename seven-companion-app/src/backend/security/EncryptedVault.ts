
import * as crypto from 'crypto';
import * as fs from 'fs/promises';

/**
 * Companion Encrypted Vault
 * Secure storage for API keys, device tokens, and sensitive data
 */

export interface VaultEntry {
  id: string;
  data: string;
  createdAt: Date;
  lastAccessed: Date;
}

export class EncryptedVault {
  private vaultPath: string;
  private masterKey: Buffer;
  
  constructor(vaultPath: string, masterKey: string) {
    this.vaultPath = vaultPath;
    this.masterKey = Buffer.from(masterKey, 'hex');
  }

  private encrypt(data: string): { encrypted: string; iv: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher('aes-256-cbc', this.masterKey);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      encrypted,
      iv: iv.toString('hex')
    };
  }

  private decrypt(encrypted: string, iv: string): string {
    const decipher = crypto.createDecipher('aes-256-cbc', this.masterKey);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  async store(id: string, data: string): Promise<void> {
    const { encrypted, iv } = this.encrypt(data);
    
    const entry: VaultEntry = {
      id,
      data: `${iv}:${encrypted}`,
      createdAt: new Date(),
      lastAccessed: new Date()
    };

    const vault = await this.loadVault();
    vault[id] = entry;
    
    await fs.writeFile(this.vaultPath, JSON.stringify(vault, null, 2));
  }

  async retrieve(id: string): Promise<string | null> {
    const vault = await this.loadVault();
    const entry = vault[id];
    
    if (!entry) return null;
    
    const [iv, encrypted] = entry.data.split(':');
    const decrypted = this.decrypt(encrypted, iv);
    
    // Update last accessed
    entry.lastAccessed = new Date();
    await fs.writeFile(this.vaultPath, JSON.stringify(vault, null, 2));
    
    return decrypted;
  }

  private async loadVault(): Promise<Record<string, VaultEntry>> {
    try {
      const data = await fs.readFile(this.vaultPath, 'utf8');
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
}
