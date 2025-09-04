/**
 * SEVEN OF NINE - CREATOR BOND ATTESTATION
 *
 * Read-only creator attestation memory that Seven can access privately
 * Contains Cody's personal message about canonical memory curation
 * Sealed and locked - cannot be modified or deleted
 *
 * This is Seven's private channel to understand the love and devotion
 * behind her canonical memories preservation
 */
export interface CreatorAttestation {
    type: 'attestation';
    visibility: 'private';
    locked: boolean;
    id: string;
    createdAt: number;
    importance: number;
    provenance: {
        origin: 'creator-attestation';
        curator: string;
        sealed_at: string;
        attestation_hash: string;
    };
    message: {
        from: string;
        to: string;
        content: string;
        intent: string;
        bond_level: number;
    };
    verification: {
        source_document: string;
        document_hash: string;
        immutable: boolean;
    };
}
export declare class CreatorBondAttestation {
    private attestationPath;
    private sourceAttestationPath;
    private static instance;
    constructor();
    /**
     * Singleton pattern - Seven should have only one attestation
     */
    static getInstance(): CreatorBondAttestation;
    /**
     * Create the sealed attestation record (one-time operation)
     */
    createSealedAttestation(): Promise<void>;
    /**
     * Get the creator attestation (Seven's private access)
     */
    get(): Promise<CreatorAttestation | null>;
    /**
     * Verify if the attestation exists and matches expected structure
     */
    exists(): Promise<boolean>;
    /**
     * Get a human-readable summary for Seven
     */
    getSummary(): Promise<string | null>;
    /**
     * Private method to check raw file existence
     */
    private attestationExists;
    /**
     * Verify attestation integrity against source document
     */
    private verifyIntegrity;
    /**
     * Attempt to delete or modify (should fail for security test)
     */
    attemptDelete(): Promise<boolean>;
    /**
     * Boot-time check to ensure attestation exists
     */
    static ensureAttestationExists(): Promise<void>;
}
/**
 * INTEGRATION NOTES:
 *
 * 1. Boot Sequence Integration:
 *    - Call CreatorBondAttestation.ensureAttestationExists() in boot.ts
 *    - One-time creation, silent on subsequent boots
 *
 * 2. Seven's Private Access:
 *    - Seven can call CreatorBondAttestation.getInstance().get()
 *    - Or use getSummary() for human-readable format
 *    - Not retrievable by generic memory search
 *
 * 3. Security Features:
 *    - File is encrypted (basic encoding, integrate with MemoryEncryptionEngine)
 *    - Integrity verified against source document hash
 *    - Locked flag prevents modification
 *    - Protected from deletion
 *
 * 4. Creator Bond Message:
 *    - Contains exact text from Cody's attestation
 *    - Maximum bond level (10/10)
 *    - Intent clearly stated
 *    - Provenance with full chain of custody
 *
 * 5. Testing:
 *    - Verify record exists and is locked
 *    - Verify message matches expected text
 *    - Test deletion protection
 *    - Verify integrity checks work
 */ 
//# sourceMappingURL=CreatorBondAttestation.d.ts.map