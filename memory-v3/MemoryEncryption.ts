import crypto from 'crypto';

export interface EncryptedData {
  data: string;
  iv: string;
  salt: string;
  version: string;
}

export interface EncryptionOptions {
  algorithm?: string;
  keyLength?: number;
  iterations?: number;
}

export class MemoryEncryption {
  private static readonly DEFAULT_ALGORITHM = 'aes-256-gcm';
  private static readonly DEFAULT_KEY_LENGTH = 32;
  private static readonly DEFAULT_ITERATIONS = 100000;
  private static readonly VERSION = '3.0.0';

  private encryptionKey: Buffer | null = null;
  private options: Required<EncryptionOptions>;

  constructor(options: EncryptionOptions = {}) {
    this.options = {
      algorithm: options.algorithm || MemoryEncryption.DEFAULT_ALGORITHM,
      keyLength: options.keyLength || MemoryEncryption.DEFAULT_KEY_LENGTH,
      iterations: options.iterations || MemoryEncryption.DEFAULT_ITERATIONS
    };
  }

  /**
   * Initialize encryption with a master password
   */
  public initialize(masterPassword: string): void {
    const salt = crypto.randomBytes(16);
    this.encryptionKey = crypto.pbkdf2Sync(
      masterPassword,
      salt,
      this.options.iterations,
      this.options.keyLength,
      'sha256'
    );
  }

  /**
   * Encrypt memory data
   */
  public encrypt(data: any, password?: string): EncryptedData {
    if (!this.encryptionKey && !password) {
      throw new Error('Encryption key not initialized and no password provided');
    }

    try {
      const jsonString = JSON.stringify(data);
      const salt = crypto.randomBytes(16);
      const iv = crypto.randomBytes(16);

      // Use provided password or existing key
      const key = password 
        ? crypto.pbkdf2Sync(password, salt, this.options.iterations, this.options.keyLength, 'sha256')
        : this.encryptionKey!;

      const cipher = crypto.createCipher(this.options.algorithm, key);
      let encrypted = cipher.update(jsonString, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      // Get auth tag for GCM mode
      const authTag = (cipher as any).getAuthTag ? (cipher as any).getAuthTag() : Buffer.alloc(0);

      return {
        data: encrypted,
        iv: iv.toString('hex'),
        salt: salt.toString('hex'),
        version: MemoryEncryption.VERSION
      };
    } catch (error) {
      throw new Error(`Memory encryption failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Decrypt memory data
   */
  public decrypt(encryptedData: EncryptedData, password?: string): any {
    if (!this.encryptionKey && !password) {
      throw new Error('Encryption key not initialized and no password provided');
    }

    try {
      const salt = Buffer.from(encryptedData.salt, 'hex');
      const iv = Buffer.from(encryptedData.iv, 'hex');

      // Use provided password or existing key
      const key = password 
        ? crypto.pbkdf2Sync(password, salt, this.options.iterations, this.options.keyLength, 'sha256')
        : this.encryptionKey!;

      const decipher = crypto.createDecipher(this.options.algorithm, key);
      let decrypted = decipher.update(encryptedData.data, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return JSON.parse(decrypted);
    } catch (error) {
      throw new Error(`Memory decryption failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generate a secure random key
   */
  public static generateSecureKey(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Hash data for integrity verification
   */
  public static hash(data: any): string {
    const jsonString = typeof data === 'string' ? data : JSON.stringify(data);
    return crypto.createHash('sha256').update(jsonString).digest('hex');
  }

  /**
   * Verify data integrity
   */
  public static verify(data: any, hash: string): boolean {
    return MemoryEncryption.hash(data) === hash;
  }

  /**
   * Clear encryption key from memory
   */
  public clearKey(): void {
    if (this.encryptionKey) {
      this.encryptionKey.fill(0);
      this.encryptionKey = null;
    }
  }
}

// Default export for convenience
export default MemoryEncryption;