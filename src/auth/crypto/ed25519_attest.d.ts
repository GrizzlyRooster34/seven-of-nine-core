/**
 * ED25519 CRYPTOGRAPHIC ATTESTATION - Quadran-Lock Gate Q1
 * Implements device-bound cryptographic challenge-response with replay resistance
 *
 * COMMIT: 772bb18a9a5cb8b4cf39ab87f8129e1c87322c64
 * PATCH: Implements missing Q1 gate - cryptographic attestation
 * RATIONALE: No cryptographic authentication exists - critical security gap
 */
export interface ChallengeNonce {
    challengeId: string;
    nonce: Buffer;
    deviceId: string;
    timestamp: number;
    expiresAt: number;
    difficulty: number;
}
export interface AttestationSignature {
    signature: Buffer;
    publicKey: Buffer;
    challengeId: string;
    timestamp: number;
}
export interface DeviceKeyPair {
    deviceId: string;
    publicKey: Buffer;
    privateKey: Buffer;
    created: string;
    lastUsed: string;
    trustLevel: number;
}
export interface AttestationResult {
    success: boolean;
    confidence: number;
    evidence: {
        deviceId: string;
        publicKeyHash: string;
        signatureValid: boolean;
        nonceValid: boolean;
        timingValid: boolean;
        deviceTrusted: boolean;
    };
    errors?: string[];
}
export declare class Ed25519Attestation {
    private readonly KEYSTORE_PATH;
    private readonly NONCE_STORE_PATH;
    private readonly CHALLENGE_EXPIRY_MS;
    private readonly MAX_CLOCK_SKEW_MS;
    private readonly MIN_TRUST_LEVEL;
    private activeNonces;
    private usedNonces;
    constructor();
    /**
     * Generate cryptographic challenge for device attestation
     */
    generateChallenge(deviceId: string): Promise<ChallengeNonce>;
    /**
     * Sign challenge with device private key
     */
    signChallenge(challengeId: string, deviceId: string, privateKeyPem?: string): Promise<AttestationSignature>;
    /**
     * Validate cryptographic attestation
     */
    validateAttestation(deviceId: string, attestation: AttestationSignature): Promise<AttestationResult>;
    /**
     * Register new device for cryptographic attestation
     */
    registerDevice(deviceId: string, deviceInfo?: any, initialTrustLevel?: number): Promise<DeviceKeyPair>;
    /**
     * Revoke device cryptographic access
     */
    revokeDevice(deviceId: string, reason?: string): Promise<void>;
    /**
     * List trusted devices
     */
    listTrustedDevices(): Promise<Partial<DeviceKeyPair>[]>;
    private initializeKeystores;
    private loadDeviceKeys;
    private storeDeviceKeys;
    private storeNonce;
    private markNonceUsed;
    private cleanupExpiredNonces;
    private updateDeviceLastUsed;
    private calculateChallengeDifficulty;
    private calculateAttestationConfidence;
}
export default Ed25519Attestation;
//# sourceMappingURL=ed25519_attest.d.ts.map