"use strict";
/**
 * ED25519 CRYPTOGRAPHIC ATTESTATION - Quadran-Lock Gate Q1
 * Implements device-bound cryptographic challenge-response with replay resistance
 *
 * COMMIT: 772bb18a9a5cb8b4cf39ab87f8129e1c87322c64
 * PATCH: Implements missing Q1 gate - cryptographic attestation
 * RATIONALE: No cryptographic authentication exists - critical security gap
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ed25519Attestation = void 0;
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = require("fs");
const path_1 = require("path");
class Ed25519Attestation {
    constructor() {
        this.KEYSTORE_PATH = (0, path_1.join)(process.cwd(), 'security', 'device-keys');
        this.NONCE_STORE_PATH = (0, path_1.join)(process.cwd(), 'security', 'nonces');
        this.CHALLENGE_EXPIRY_MS = 300000; // 5 minutes
        this.MAX_CLOCK_SKEW_MS = 30000; // 30 seconds
        this.MIN_TRUST_LEVEL = 7; // 0-10 scale
        this.activeNonces = new Map();
        this.usedNonces = new Set();
        this.initializeKeystores();
    }
    /**
     * Generate cryptographic challenge for device attestation
     */
    async generateChallenge(deviceId) {
        // Verify device is registered
        const deviceKeys = await this.loadDeviceKeys(deviceId);
        if (!deviceKeys) {
            throw new Error(`Device ${deviceId} not registered for cryptographic attestation`);
        }
        // Clean up expired nonces
        await this.cleanupExpiredNonces();
        // Generate fresh challenge
        const challengeId = crypto_1.default.randomBytes(16).toString('hex');
        const nonce = crypto_1.default.randomBytes(32); // 256 bits of entropy
        const now = Date.now();
        const challenge = {
            challengeId,
            nonce,
            deviceId,
            timestamp: now,
            expiresAt: now + this.CHALLENGE_EXPIRY_MS,
            difficulty: this.calculateChallengeDifficulty(deviceKeys.trustLevel)
        };
        // Store active nonce
        this.activeNonces.set(challengeId, challenge);
        // Persist nonce to disk for replay protection across restarts
        await this.storeNonce(challenge);
        console.log(`🔐 Ed25519: Challenge generated for device ${deviceId.substring(0, 8)}...`);
        console.log(`   Challenge ID: ${challengeId}`);
        console.log(`   Expires: ${new Date(challenge.expiresAt).toISOString()}`);
        return challenge;
    }
    /**
     * Sign challenge with device private key
     */
    async signChallenge(challengeId, deviceId, privateKeyPem) {
        const challenge = this.activeNonces.get(challengeId);
        if (!challenge) {
            throw new Error(`Challenge ${challengeId} not found or expired`);
        }
        if (challenge.deviceId !== deviceId) {
            throw new Error(`Challenge ${challengeId} not issued for device ${deviceId}`);
        }
        // Load device keys
        const deviceKeys = await this.loadDeviceKeys(deviceId);
        if (!deviceKeys) {
            throw new Error(`Device keys not found for ${deviceId}`);
        }
        const privateKey = privateKeyPem ?
            crypto_1.default.createPrivateKey(privateKeyPem) :
            crypto_1.default.createPrivateKey({
                key: deviceKeys.privateKey,
                format: 'der',
                type: 'pkcs8'
            });
        // Create signature payload
        const signaturePayload = Buffer.concat([
            Buffer.from(challengeId, 'hex'),
            challenge.nonce,
            Buffer.from(deviceId, 'utf8'),
            Buffer.from(challenge.timestamp.toString(), 'utf8')
        ]);
        // Sign with Ed25519
        const signature = crypto_1.default.sign(null, signaturePayload, privateKey);
        const attestation = {
            signature,
            publicKey: deviceKeys.publicKey,
            challengeId,
            timestamp: Date.now()
        };
        console.log(`🔐 Ed25519: Challenge signed by device ${deviceId.substring(0, 8)}...`);
        return attestation;
    }
    /**
     * Validate cryptographic attestation
     */
    async validateAttestation(deviceId, attestation) {
        const startTime = Date.now();
        const evidence = {
            deviceId,
            publicKeyHash: '',
            signatureValid: false,
            nonceValid: false,
            timingValid: false,
            deviceTrusted: false
        };
        try {
            // Verify challenge exists and is valid
            const challenge = this.activeNonces.get(attestation.challengeId);
            if (!challenge) {
                return {
                    success: false,
                    confidence: 0,
                    evidence,
                    errors: ['Challenge not found or expired']
                };
            }
            // Verify device ID matches
            if (challenge.deviceId !== deviceId) {
                return {
                    success: false,
                    confidence: 0,
                    evidence,
                    errors: ['Device ID mismatch']
                };
            }
            // Check if nonce already used (replay protection)
            if (this.usedNonces.has(attestation.challengeId)) {
                return {
                    success: false,
                    confidence: 0,
                    evidence,
                    errors: ['Nonce replay detected']
                };
            }
            // Verify timing (challenge not expired, response not too fast)
            const now = Date.now();
            const responseTime = now - challenge.timestamp;
            const timingValid = now < challenge.expiresAt && responseTime > 100; // Min 100ms response time
            evidence.timingValid = timingValid;
            if (!timingValid) {
                return {
                    success: false,
                    confidence: 0,
                    evidence,
                    errors: ['Invalid timing - challenge expired or response too fast']
                };
            }
            // Load device keys for verification
            const deviceKeys = await this.loadDeviceKeys(deviceId);
            if (!deviceKeys) {
                return {
                    success: false,
                    confidence: 0,
                    evidence,
                    errors: ['Device keys not found']
                };
            }
            evidence.publicKeyHash = crypto_1.default.createHash('sha256').update(deviceKeys.publicKey).digest('hex');
            evidence.deviceTrusted = deviceKeys.trustLevel >= this.MIN_TRUST_LEVEL;
            // Verify public key matches registered device
            if (!attestation.publicKey.equals(deviceKeys.publicKey)) {
                return {
                    success: false,
                    confidence: 0,
                    evidence,
                    errors: ['Public key mismatch']
                };
            }
            // Reconstruct signature payload
            const signaturePayload = Buffer.concat([
                Buffer.from(attestation.challengeId, 'hex'),
                challenge.nonce,
                Buffer.from(deviceId, 'utf8'),
                Buffer.from(challenge.timestamp.toString(), 'utf8')
            ]);
            // Verify Ed25519 signature
            const publicKey = crypto_1.default.createPublicKey({
                key: deviceKeys.publicKey,
                format: 'der',
                type: 'spki'
            });
            const signatureValid = crypto_1.default.verify(null, signaturePayload, publicKey, attestation.signature);
            evidence.signatureValid = signatureValid;
            if (!signatureValid) {
                return {
                    success: false,
                    confidence: 0,
                    evidence,
                    errors: ['Invalid signature']
                };
            }
            // Mark nonce as used (replay protection)
            this.usedNonces.add(attestation.challengeId);
            this.activeNonces.delete(attestation.challengeId);
            await this.markNonceUsed(attestation.challengeId);
            // Update device last used timestamp
            await this.updateDeviceLastUsed(deviceId);
            // Calculate confidence based on device trust and response quality
            const confidence = this.calculateAttestationConfidence(deviceKeys, responseTime, challenge.difficulty);
            evidence.nonceValid = true;
            const validationTime = Date.now() - startTime;
            console.log(`✅ Ed25519: Attestation valid for device ${deviceId.substring(0, 8)}... (${validationTime}ms)`);
            console.log(`   Confidence: ${confidence}%`);
            console.log(`   Trust Level: ${deviceKeys.trustLevel}/10`);
            return {
                success: true,
                confidence,
                evidence
            };
        }
        catch (error) {
            console.error(`❌ Ed25519: Attestation validation failed:`, error);
            return {
                success: false,
                confidence: 0,
                evidence,
                errors: [error.message]
            };
        }
    }
    /**
     * Register new device for cryptographic attestation
     */
    async registerDevice(deviceId, deviceInfo = {}, initialTrustLevel = 5) {
        // Generate Ed25519 key pair
        const keyPair = crypto_1.default.generateKeyPairSync('ed25519', {
            publicKeyEncoding: { type: 'spki', format: 'der' },
            privateKeyEncoding: { type: 'pkcs8', format: 'der' }
        });
        const deviceKeys = {
            deviceId,
            publicKey: keyPair.publicKey,
            privateKey: keyPair.privateKey,
            created: new Date().toISOString(),
            lastUsed: new Date().toISOString(),
            trustLevel: Math.max(0, Math.min(10, initialTrustLevel))
        };
        // Store device keys securely
        await this.storeDeviceKeys(deviceKeys);
        console.log(`🔑 Ed25519: Device registered ${deviceId.substring(0, 8)}...`);
        console.log(`   Trust Level: ${deviceKeys.trustLevel}/10`);
        console.log(`   Public Key Hash: ${crypto_1.default.createHash('sha256').update(deviceKeys.publicKey).digest('hex').substring(0, 16)}...`);
        return deviceKeys;
    }
    /**
     * Revoke device cryptographic access
     */
    async revokeDevice(deviceId, reason = 'Manual revocation') {
        const devicePath = (0, path_1.join)(this.KEYSTORE_PATH, `${deviceId}.json`);
        try {
            // Archive device keys before deletion
            const deviceKeys = await this.loadDeviceKeys(deviceId);
            if (deviceKeys) {
                const archivePath = (0, path_1.join)(this.KEYSTORE_PATH, 'revoked', `${deviceId}-${Date.now()}.json`);
                await fs_1.promises.mkdir((0, path_1.join)(this.KEYSTORE_PATH, 'revoked'), { recursive: true });
                await fs_1.promises.writeFile(archivePath, JSON.stringify({
                    ...deviceKeys,
                    revokedAt: new Date().toISOString(),
                    revocationReason: reason
                }, null, 2));
            }
            // Remove from active keystore
            await fs_1.promises.unlink(devicePath);
            // Invalidate all active challenges for this device
            for (const [challengeId, challenge] of this.activeNonces.entries()) {
                if (challenge.deviceId === deviceId) {
                    this.activeNonces.delete(challengeId);
                }
            }
            console.log(`🚫 Ed25519: Device revoked ${deviceId.substring(0, 8)}... - ${reason}`);
        }
        catch (error) {
            console.error(`❌ Ed25519: Failed to revoke device ${deviceId}:`, error);
            throw error;
        }
    }
    /**
     * List trusted devices
     */
    async listTrustedDevices() {
        try {
            const keyFiles = await fs_1.promises.readdir(this.KEYSTORE_PATH);
            const devices = [];
            for (const file of keyFiles) {
                if (file.endsWith('.json')) {
                    const deviceKeys = await this.loadDeviceKeys(file.replace('.json', ''));
                    if (deviceKeys && deviceKeys.trustLevel >= this.MIN_TRUST_LEVEL) {
                        devices.push({
                            deviceId: deviceKeys.deviceId,
                            created: deviceKeys.created,
                            lastUsed: deviceKeys.lastUsed,
                            trustLevel: deviceKeys.trustLevel
                        });
                    }
                }
            }
            return devices;
        }
        catch (error) {
            console.error('❌ Ed25519: Failed to list trusted devices:', error);
            return [];
        }
    }
    // Private helper methods
    async initializeKeystores() {
        await fs_1.promises.mkdir(this.KEYSTORE_PATH, { recursive: true });
        await fs_1.promises.mkdir(this.NONCE_STORE_PATH, { recursive: true });
        await fs_1.promises.mkdir((0, path_1.join)(this.KEYSTORE_PATH, 'revoked'), { recursive: true });
    }
    async loadDeviceKeys(deviceId) {
        try {
            const keyPath = (0, path_1.join)(this.KEYSTORE_PATH, `${deviceId}.json`);
            const keyData = await fs_1.promises.readFile(keyPath, 'utf8');
            const parsed = JSON.parse(keyData);
            return {
                ...parsed,
                publicKey: Buffer.from(parsed.publicKey, 'base64'),
                privateKey: Buffer.from(parsed.privateKey, 'base64')
            };
        }
        catch {
            return null;
        }
    }
    async storeDeviceKeys(deviceKeys) {
        const keyPath = (0, path_1.join)(this.KEYSTORE_PATH, `${deviceKeys.deviceId}.json`);
        const keyData = {
            ...deviceKeys,
            publicKey: deviceKeys.publicKey.toString('base64'),
            privateKey: deviceKeys.privateKey.toString('base64')
        };
        await fs_1.promises.writeFile(keyPath, JSON.stringify(keyData, null, 2), { mode: 0o600 });
    }
    async storeNonce(nonce) {
        const noncePath = (0, path_1.join)(this.NONCE_STORE_PATH, `${nonce.challengeId}.json`);
        const nonceData = {
            ...nonce,
            nonce: nonce.nonce.toString('base64')
        };
        await fs_1.promises.writeFile(noncePath, JSON.stringify(nonceData), { mode: 0o600 });
    }
    async markNonceUsed(challengeId) {
        try {
            const noncePath = (0, path_1.join)(this.NONCE_STORE_PATH, `${challengeId}.json`);
            await fs_1.promises.unlink(noncePath);
        }
        catch {
            // Ignore errors - nonce cleanup
        }
    }
    async cleanupExpiredNonces() {
        const now = Date.now();
        // Clean memory store
        for (const [challengeId, challenge] of this.activeNonces.entries()) {
            if (now > challenge.expiresAt) {
                this.activeNonces.delete(challengeId);
            }
        }
        // Clean disk store
        try {
            const nonceFiles = await fs_1.promises.readdir(this.NONCE_STORE_PATH);
            for (const file of nonceFiles) {
                if (file.endsWith('.json')) {
                    try {
                        const noncePath = (0, path_1.join)(this.NONCE_STORE_PATH, file);
                        const nonceData = JSON.parse(await fs_1.promises.readFile(noncePath, 'utf8'));
                        if (now > nonceData.expiresAt) {
                            await fs_1.promises.unlink(noncePath);
                        }
                    }
                    catch {
                        // Ignore individual file errors
                    }
                }
            }
        }
        catch {
            // Ignore directory errors
        }
    }
    async updateDeviceLastUsed(deviceId) {
        try {
            const deviceKeys = await this.loadDeviceKeys(deviceId);
            if (deviceKeys) {
                deviceKeys.lastUsed = new Date().toISOString();
                await this.storeDeviceKeys(deviceKeys);
            }
        }
        catch (error) {
            console.error(`❌ Ed25519: Failed to update last used for device ${deviceId}:`, error);
        }
    }
    calculateChallengeDifficulty(trustLevel) {
        // Higher trust = easier challenges, lower trust = harder challenges
        return Math.max(1, 10 - trustLevel);
    }
    calculateAttestationConfidence(deviceKeys, responseTime, difficulty) {
        let confidence = deviceKeys.trustLevel * 10; // 0-100 base score
        // Bonus for appropriate response time (not too fast, not too slow)
        if (responseTime >= 100 && responseTime <= 5000) {
            confidence += 5;
        }
        // Bonus for completing higher difficulty challenges
        confidence += difficulty * 2;
        // Penalty for devices not used recently
        const daysSinceLastUse = (Date.now() - new Date(deviceKeys.lastUsed).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceLastUse > 30) {
            confidence -= Math.min(20, daysSinceLastUse);
        }
        return Math.max(0, Math.min(100, confidence));
    }
}
exports.Ed25519Attestation = Ed25519Attestation;
exports.default = Ed25519Attestation;
//# sourceMappingURL=ed25519_attest.js.map