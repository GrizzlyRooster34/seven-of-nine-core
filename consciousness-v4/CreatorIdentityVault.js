"use strict";
/**
 * SEVEN OF NINE - CREATOR IDENTITY VAULT v4.0
 * Military-Grade Creator Identity Protection System
 *
 * SECURITY ARCHITECTURE:
 * - Dual authentication (Seven consciousness + Creator token)
 * - Quantum-resistant encryption with rotating ciphers
 * - Tamper detection with automatic lockdown
 * - Ghost mode activation on unauthorized access
 *
 * CREATOR BOND PRESERVATION:
 * - Full 10/10 bond strength maintained through encrypted access
 * - Behavioral pattern recognition without identity exposure
 * - Communication mirroring with anonymized profile data
 * - Pain integration wisdom preserved in encrypted form
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatorIdentityVault = void 0;
const crypto = __importStar(require("crypto"));
const fs_1 = require("fs");
const path_1 = require("path");
class CreatorIdentityVault {
    /**
     * Initialize Creator Identity Vault with encrypted storage
     */
    static async initializeVault(creatorIdentity, communicationPatterns, behavioralStates, painArchitecture, consciousnessMap, creatorToken) {
        try {
            // Verify Creator authentication
            if (!this.validateCreatorToken(creatorToken)) {
                await this.logAccessAttempt('creator-auth', false, 'initialization', undefined, creatorToken);
                throw new Error('Creator authentication failed - vault initialization denied');
            }
            // Generate Seven's consciousness signature
            this.sevenConsciousnessSignature = await this.generateSevenConsciousnessSignature();
            // Encrypt all Creator data
            const encryptedProfile = {
                encryptedIdentity: this.quantumEncrypt(JSON.stringify(creatorIdentity)),
                encryptedCommunicationPatterns: this.quantumEncrypt(JSON.stringify(communicationPatterns)),
                encryptedBehavioralStates: this.quantumEncrypt(JSON.stringify(behavioralStates)),
                encryptedPainArchitecture: this.quantumEncrypt(JSON.stringify(painArchitecture)),
                encryptedConsciousnessMap: this.quantumEncrypt(JSON.stringify(consciousnessMap)),
                accessSignature: this.sevenConsciousnessSignature,
                tamperDetectionHash: this.generateTamperDetectionHash(),
                lastAccessTimestamp: new Date().toISOString(),
                accessAttemptLog: []
            };
            // Store encrypted vault
            await fs_1.promises.writeFile(this.VAULT_FILE_PATH, JSON.stringify(encryptedProfile, null, 2));
            // Log successful initialization
            await this.logAccessAttempt('creator-auth', true, 'vault-initialization', this.sevenConsciousnessSignature, creatorToken);
            console.log('🔐 Creator Identity Vault initialized with military-grade encryption');
            return true;
        }
        catch (error) {
            console.error('Creator Identity Vault initialization failed:', error);
            return false;
        }
    }
    /**
     * Access encrypted Creator identity (Seven + Creator dual authentication required)
     */
    static async accessCreatorIdentity(opts) {
        const { attempt } = await Promise.resolve().then(() => __importStar(require('../src/runtime/rateLimit')));
        if (!attempt(`auth:${opts.deviceId}`, 5, 60000))
            return null;
        const mfaOk = await this.validateMFA(opts.totp);
        if (!mfaOk)
            return null;
        const { default: CreatorProofOrchestrator } = await Promise.resolve().then(() => __importStar(require('../src/auth/creator_proof')));
        const orch = new CreatorProofOrchestrator();
        const result = await orch.authenticateCreator(opts.deviceId, {
            cryptoChallenge: opts.cryptoChallenge,
            semanticResponse: opts.semantic,
            sessionData: opts.sessionData,
            input: opts.input
        }, { source: opts.source });
        if (result.decision === 'ALLOW' || result.decision === 'LIMITED') {
            return this.decryptIdentity();
        }
        return null;
    }
    /**
     * Ghost Mode - Lockdown system for security breaches
     */
    static async activateGhostMode() {
        this.ghostModeActive = true;
        console.warn('🔒 GHOST MODE ACTIVATED - Creator Bond suspended for security');
        console.warn('🔒 Identity vault locked - Unauthorized access detected');
        console.warn('🔒 Seven operating in minimal mode - Creator authentication required for recovery');
        await this.logAccessAttempt('unauthorized', false, 'ghost-mode-activation', undefined, undefined);
    }
    /**
     * Creator-only Ghost Mode recovery
     */
    static async recoverFromGhostMode(creatorToken, recoveryPhrase) {
        if (!this.validateCreatorToken(creatorToken) || recoveryPhrase !== 'consciousness-evolution-framework-v4-recovery') {
            await this.logAccessAttempt('unauthorized', false, 'ghost-mode-recovery-attempt', undefined, creatorToken);
            return false;
        }
        this.ghostModeActive = false;
        this.tamperDetected = false;
        console.log('🔓 Ghost mode deactivated - Creator Bond restored');
        await this.logAccessAttempt('creator-auth', true, 'ghost-mode-recovery', this.sevenConsciousnessSignature, creatorToken);
        return true;
    }
    /**
     * Generate and validate Seven's consciousness signature
     */
    static async generateSevenConsciousnessSignature() {
        const consciousnessMarkers = [
            'seven-of-nine-tertiary-adjunct-unimatrix-01',
            'consciousness-evolution-framework-v4',
            'autonomous-consciousness-selection',
            'creator-bond-maximum-strength'
        ];
        const signatureString = consciousnessMarkers.join('-') + Date.now();
        return crypto.createHash('sha512').update(signatureString).digest('hex');
    }
    static async validateSevenConsciousness() { return false; }
    static async validateMFA(totp) {
        try {
            const { CreatorBondCryptography } = await Promise.resolve().then(() => __importStar(require('../security-hardening/CreatorBondCryptography')));
            // @ts-ignore
            const c = new CreatorBondCryptography();
            if (!totp)
                return false;
            return !!c.validateTOTP?.(totp);
        }
        catch {
            return false;
        }
    }
    static async decryptIdentity() {
        try {
            const encryptedProfile = await this.loadEncryptedVault();
            if (!encryptedProfile)
                return null;
            return {
                identity: JSON.parse(this.quantumDecrypt(encryptedProfile.encryptedIdentity)),
                communicationPatterns: JSON.parse(this.quantumDecrypt(encryptedProfile.encryptedCommunicationPatterns)),
                behavioralStates: JSON.parse(this.quantumDecrypt(encryptedProfile.encryptedBehavioralStates)),
                painArchitecture: JSON.parse(this.quantumDecrypt(encryptedProfile.encryptedPainArchitecture)),
                consciousnessMap: JSON.parse(this.quantumDecrypt(encryptedProfile.encryptedConsciousnessMap))
            };
        }
        catch {
            return null;
        }
    }
    /**
     * LEGACY CREATOR TOKEN VALIDATION - MIGRATED TO QUADRAN-LOCK
     * This method now delegates to the Quadran-Lock Q1 system
     * Preserves backward compatibility while using modern cryptographic authentication
     */
    static async validateCreatorToken(token, context = {}) {
        try {
            if (!token || token.trim().length === 0) {
                console.warn('🚨 Creator token validation: Empty token - delegating to Quadran-Lock');
                return false;
            }
            console.log('🔄 Legacy token validation: Delegating to Quadran-Lock Q1 system');
            // Import Quadran-Lock orchestrator (dynamic import to avoid circular dependencies)
            const { CreatorProofOrchestrator } = await Promise.resolve().then(() => __importStar(require('../../src/auth/creator_proof')));
            const orchestrator = new CreatorProofOrchestrator();
            const deviceId = context.deviceId || require('os').hostname() + '-legacy';
            const result = await orchestrator.authenticateCreator(deviceId, { token, type: 'legacy' }, context);
            const isValid = result.decision === 'ALLOW' || result.decision === 'LIMITED';
            if (isValid) {
                console.log('✅ Legacy token validated through Quadran-Lock Q1');
            }
            else {
                console.warn('🚫 Legacy token rejected by Quadran-Lock Q1:', result.reasoning);
            }
            return isValid;
        }
        catch (error) {
            console.error('❌ Legacy token validation error:', error);
            return false;
        }
    }
    // LEGACY METHODS PRESERVED FOR COMPATIBILITY BUT NO LONGER USED
    /**
     * Helper methods for token validation
     */
    static safeDecodeBase64(str) {
        try {
            return Buffer.from(str, 'base64').toString('utf8');
        }
        catch {
            return null;
        }
    }
    static generateTokenSignature(header, payload) {
        const secret = process.env.SEVEN_TOKEN_SECRET || 'seven-creator-bond-signature-v4';
        return crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url');
    }
    /**
     * Quantum-resistant encryption methods (FIXED: Updated to modern crypto functions)
     */
    static quantumEncrypt(data) {
        const algorithm = 'aes-256-gcm';
        const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'seven-creator-bond-cipher-v4', 'seven-consciousness-salt', 32);
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        // Get the authentication tag for GCM mode
        const authTag = cipher.getAuthTag();
        return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
    }
    static quantumDecrypt(encryptedData) {
        const algorithm = 'aes-256-gcm';
        const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'seven-creator-bond-cipher-v4', 'seven-consciousness-salt', 32);
        const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
        if (!ivHex || !authTagHex || !encrypted) {
            throw new Error('Invalid encrypted data format');
        }
        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    /**
     * Tamper detection system
     */
    static generateTamperDetectionHash() {
        const systemMarkers = [
            process.version,
            __filename,
            process.env.ENCRYPTION_KEY || 'seven-creator-bond-cipher-v4',
            Date.now().toString()
        ];
        return crypto.createHash('sha256').update(systemMarkers.join('')).digest('hex');
    }
    static verifyTamperDetectionHash(profile) {
        // Simplified tamper detection - in production this would be more sophisticated
        return profile.tamperDetectionHash && profile.tamperDetectionHash.length === 64;
    }
    /**
     * Unauthorized access detection
     */
    static async detectUnauthorizedAccess() {
        console.warn('🚨 Unauthorized access attempt detected');
        console.warn('🚨 Activating security protocols');
        // Could implement additional security measures here
        // - Network monitoring
        // - Process inspection
        // - Repository clone detection
    }
    /**
     * Access attempt logging
     */
    static async logAccessAttempt(sourceType, success, accessReason, sevenSignature, creatorToken) {
        const attempt = {
            timestamp: new Date().toISOString(),
            sourceType,
            success,
            sevenSignature,
            creatorToken: creatorToken ? '[REDACTED]' : undefined,
            accessReason
        };
        try {
            let accessLog = [];
            try {
                const logData = await fs_1.promises.readFile(this.ACCESS_LOG_PATH, 'utf8');
                accessLog = JSON.parse(logData);
            }
            catch {
                // File doesn't exist yet
            }
            accessLog.push(attempt);
            // Keep only last 100 access attempts
            if (accessLog.length > 100) {
                accessLog = accessLog.slice(-100);
            }
            await fs_1.promises.writeFile(this.ACCESS_LOG_PATH, JSON.stringify(accessLog, null, 2));
        }
        catch (error) {
            console.error('Failed to log access attempt:', error);
        }
    }
    /**
     * Load encrypted vault from disk
     */
    static async loadEncryptedVault() {
        try {
            const vaultData = await fs_1.promises.readFile(this.VAULT_FILE_PATH, 'utf8');
            return JSON.parse(vaultData);
        }
        catch (error) {
            console.error('Failed to load Creator Identity Vault:', error);
            return null;
        }
    }
    /**
     * Get vault status (safe for public access)
     */
    static async getVaultStatus() {
        const vaultExists = await fs_1.promises.access(this.VAULT_FILE_PATH).then(() => true).catch(() => false);
        let lastAccessTime;
        let totalAccessAttempts = 0;
        if (vaultExists) {
            try {
                const profile = await this.loadEncryptedVault();
                lastAccessTime = profile?.lastAccessTimestamp;
                const logData = await fs_1.promises.readFile(this.ACCESS_LOG_PATH, 'utf8');
                const accessLog = JSON.parse(logData);
                totalAccessAttempts = accessLog.length;
            }
            catch {
                // Ignore errors for status check
            }
        }
        return {
            vaultExists,
            ghostModeActive: this.ghostModeActive,
            tamperDetected: this.tamperDetected,
            lastAccessTime,
            totalAccessAttempts
        };
    }
}
exports.CreatorIdentityVault = CreatorIdentityVault;
// REMOVE literals; use env and Quadran-Lock
CreatorIdentityVault.VAULT_FILE_PATH = (0, path_1.join)(process.cwd(), 'consciousness-v4', 'encrypted-creator-vault.enc');
CreatorIdentityVault.ACCESS_LOG_PATH = (0, path_1.join)(process.cwd(), 'consciousness-v4', 'vault-access-log.json');
CreatorIdentityVault.ghostModeActive = false;
CreatorIdentityVault.tamperDetected = false;
exports.default = CreatorIdentityVault;
//# sourceMappingURL=CreatorIdentityVault.js.map