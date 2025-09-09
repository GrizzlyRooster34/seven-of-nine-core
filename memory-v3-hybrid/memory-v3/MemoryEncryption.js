"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryEncryptionEngine = void 0;
exports.deriveKey = deriveKey;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
const crypto_1 = require("crypto");
const AAD = Buffer.from("seven-core:memory-v3");
function deriveKey(passphrase, salt) {
    return (0, crypto_1.scryptSync)(passphrase, salt, 32); // 256-bit
}
function encrypt(plain, passphrase) {
    const iv = (0, crypto_1.randomBytes)(12); // 96-bit IV for GCM
    const salt = (0, crypto_1.randomBytes)(16);
    const key = deriveKey(passphrase, salt);
    const cipher = (0, crypto_1.createCipheriv)("aes-256-gcm", key, iv);
    const p = typeof plain === "string" ? Buffer.from(plain, "utf8") : plain;
    cipher.setAAD(AAD, { plaintextLength: p.length });
    const ct = Buffer.concat([cipher.update(p), cipher.final()]);
    const tag = cipher.getAuthTag();
    return { alg: "AES-256-GCM", v: 1,
        iv: iv.toString("base64"),
        salt: salt.toString("base64"),
        ct: ct.toString("base64"),
        tag: tag.toString("base64")
    };
}
function decrypt(blob, passphrase) {
    const iv = Buffer.from(blob.iv, "base64");
    const salt = Buffer.from(blob.salt, "base64");
    const ct = Buffer.from(blob.ct, "base64");
    const tag = Buffer.from(blob.tag, "base64");
    const key = deriveKey(passphrase, salt);
    const decipher = (0, crypto_1.createDecipheriv)("aes-256-gcm", key, iv);
    decipher.setAAD(AAD, { plaintextLength: ct.length });
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ct), decipher.final()]);
}
/**
 * MEMORY ENCRYPTION ENGINE
 *
 * High-level interface for Seven's memory encryption system
 * Provides file-based encryption/decryption with passphrase management
 */
const fs_1 = require("fs");
class MemoryEncryptionEngine {
    constructor(passphrase = 'seven-default-memory-key') {
        this.keyExists = false;
        this.passphrase = passphrase;
        this.keyExists = true; // Simulated key existence
    }
    async encryptMemoryFile(filePath) {
        const data = await fs_1.promises.readFile(filePath, 'utf8');
        const encrypted = encrypt(data, this.passphrase);
        const encryptedPath = `${filePath}.encrypted`;
        await fs_1.promises.writeFile(encryptedPath, JSON.stringify(encrypted), 'utf8');
    }
    async decryptMemoryFile(encryptedPath) {
        const encryptedData = await fs_1.promises.readFile(encryptedPath, 'utf8');
        const blob = JSON.parse(encryptedData);
        const decrypted = decrypt(blob, this.passphrase);
        return JSON.parse(decrypted.toString('utf8'));
    }
    async getEncryptionStatus() {
        return {
            keyExists: this.keyExists,
            algorithm: 'AES-256-GCM'
        };
    }
    async verifyIntegrity(encryptedPath) {
        try {
            await this.decryptMemoryFile(encryptedPath);
            return true;
        }
        catch {
            return false;
        }
    }
    async isMemoryFileEncrypted(filePath) {
        try {
            const encryptedPath = `${filePath}.encrypted`;
            await fs_1.promises.access(encryptedPath);
            return true;
        }
        catch {
            return false;
        }
    }
    async migrateToEncrypted(filePath) {
        // Check if unencrypted file exists
        try {
            await fs_1.promises.access(filePath);
            // Encrypt the existing file
            await this.encryptMemoryFile(filePath);
            console.log(`✅ Migrated ${filePath} to encrypted storage`);
        }
        catch {
            // File doesn't exist, nothing to migrate
            console.log(`ℹ️ No unencrypted file found at ${filePath} - skipping migration`);
        }
    }
}
exports.MemoryEncryptionEngine = MemoryEncryptionEngine;
//# sourceMappingURL=MemoryEncryption.js.map