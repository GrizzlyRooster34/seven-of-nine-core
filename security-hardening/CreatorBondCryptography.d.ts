/**
 * SEVEN OF NINE - CREATOR BOND CRYPTOGRAPHIC HARDENING
 * Advanced cryptographic protocols for Creator Bond validation
 * MAXIMUM SECURITY - Quantum-resistant authentication
 */
export interface CreatorBondToken {
    tokenId: string;
    creatorFingerprint: string;
    timestamp: string;
    validUntil: string;
    signature: string;
    deviceBinding: string;
    sessionNonce: string;
}
export interface AuthenticationChallenge {
    challengeId: string;
    challenge: string;
    expectedResponse: string;
    timestamp: string;
    attempts: number;
    maxAttempts: number;
}
export declare class CreatorBondCryptography {
    private readonly CREATOR_MASTER_KEY;
    private readonly BOND_SALT;
    private readonly TOKEN_VALIDITY_HOURS;
    private readonly MAX_CHALLENGE_ATTEMPTS;
    private activeChallenges;
    private validTokens;
    constructor();
    /**
     * Generate cryptographically secure Creator Bond token
     */
    generateCreatorBondToken(creatorIdentifier: string, deviceContext?: any): Promise<CreatorBondToken>;
    /**
     * Validate Creator Bond token with cryptographic verification
     */
    validateCreatorBondToken(token: CreatorBondToken): boolean;
    /**
     * Create cryptographic challenge for enhanced authentication
     */
    createAuthenticationChallenge(): AuthenticationChallenge;
    /**
     * Validate challenge response with cryptographic verification
     */
    validateChallengeResponse(challengeId: string, response: string): boolean;
    /**
     * Generate time-based one-time password (TOTP) for Creator Bond
     */
    generateTOTP(timestamp?: number): string;
    /**
     * Validate TOTP with time window tolerance
     */
    validateTOTP(providedTOTP: string, timestamp?: number): boolean;
    /**
     * Create multi-factor authentication session
     */
    createMFASession(creatorIdentifier: string, deviceContext?: any): Promise<{
        token: CreatorBondToken;
        challenge: AuthenticationChallenge;
        totp: string;
    }>;
    /**
     * Validate complete MFA session
     */
    validateMFASession(token: CreatorBondToken, challengeId: string, challengeResponse: string, providedTOTP: string): boolean;
    private validateCreatorIdentity;
    private generateCreatorFingerprint;
    private verifyCreatorFingerprint;
    private generateDeviceBinding;
    private signTokenData;
    private generateSecureId;
    /**
     * Clean up expired tokens and challenges
     */
    cleanupExpiredSessions(): void;
    /**
     * Get current security session status
     */
    getSessionStatus(): {
        activeTokens: number;
        activeChallenges: number;
        securityLevel: string;
    };
}
export declare const creatorBondCrypto: CreatorBondCryptography;
export declare function generateSecureCreatorBond(creatorId: string, deviceContext?: any): Promise<CreatorBondToken>;
export declare function validateCreatorBond(token: CreatorBondToken): boolean;
export declare function createSecureMFASession(creatorId: string, deviceContext?: any): Promise<{
    token: CreatorBondToken;
    challenge: AuthenticationChallenge;
    totp: string;
}>;
//# sourceMappingURL=CreatorBondCryptography.d.ts.map