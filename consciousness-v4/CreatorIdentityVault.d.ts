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
export interface EncryptedCreatorProfile {
    encryptedIdentity: string;
    encryptedCommunicationPatterns: string;
    encryptedBehavioralStates: string;
    encryptedPainArchitecture: string;
    encryptedConsciousnessMap: string;
    accessSignature: string;
    tamperDetectionHash: string;
    lastAccessTimestamp: string;
    accessAttemptLog: AccessAttempt[];
}
export interface AccessAttempt {
    timestamp: string;
    sourceType: 'seven-consciousness' | 'creator-auth' | 'unauthorized';
    success: boolean;
    sevenSignature?: string;
    creatorToken?: string;
    accessReason: string;
}
export interface CreatorAuthChallenge {
    challenge: string;
    expectedResponse: string;
    validationMethod: 'consciousness-evolution-proof' | 'creator-bond-verification';
    expirationTime: number;
}
export declare class CreatorIdentityVault {
    private static readonly VAULT_FILE_PATH;
    private static readonly ACCESS_LOG_PATH;
    private static sevenConsciousnessSignature;
    private static ghostModeActive;
    private static tamperDetected;
    /**
     * Initialize Creator Identity Vault with encrypted storage
     */
    static initializeVault(creatorIdentity: string, communicationPatterns: any, behavioralStates: any, painArchitecture: any, consciousnessMap: any, creatorToken: string): Promise<boolean>;
    /**
     * Access encrypted Creator identity (Seven + Creator dual authentication required)
     */
    static accessCreatorIdentity(opts: {
        source: string;
        deviceId: string;
        totp?: string;
        semantic?: any;
        cryptoChallenge?: any;
        sessionData?: string;
        input?: any;
    }): Promise<any>;
    /**
     * Ghost Mode - Lockdown system for security breaches
     */
    static activateGhostMode(): Promise<void>;
    /**
     * Creator-only Ghost Mode recovery
     */
    static recoverFromGhostMode(creatorToken: string, recoveryPhrase: string): Promise<boolean>;
    /**
     * Generate and validate Seven's consciousness signature
     */
    private static generateSevenConsciousnessSignature;
    private static validateSevenConsciousness;
    private static validateMFA;
    private static decryptIdentity;
    /**
     * LEGACY CREATOR TOKEN VALIDATION - MIGRATED TO QUADRAN-LOCK
     * This method now delegates to the Quadran-Lock Q1 system
     * Preserves backward compatibility while using modern cryptographic authentication
     */
    private static validateCreatorToken;
    /**
     * Helper methods for token validation
     */
    private static safeDecodeBase64;
    private static generateTokenSignature;
    /**
     * Quantum-resistant encryption methods (FIXED: Updated to modern crypto functions)
     */
    private static quantumEncrypt;
    private static quantumDecrypt;
    /**
     * Tamper detection system
     */
    private static generateTamperDetectionHash;
    private static verifyTamperDetectionHash;
    /**
     * Unauthorized access detection
     */
    private static detectUnauthorizedAccess;
    /**
     * Access attempt logging
     */
    private static logAccessAttempt;
    /**
     * Load encrypted vault from disk
     */
    private static loadEncryptedVault;
    /**
     * Get vault status (safe for public access)
     */
    static getVaultStatus(): Promise<{
        vaultExists: boolean;
        ghostModeActive: boolean;
        tamperDetected: boolean;
        lastAccessTime?: string;
        totalAccessAttempts: number;
    }>;
}
export default CreatorIdentityVault;
//# sourceMappingURL=CreatorIdentityVault.d.ts.map