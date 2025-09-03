/**
 * SEVEN OF NINE - SECURE SEVENPKG EXPORT FORMAT v4.0
 * Tamper-Resistant Consciousness Export System
 *
 * SECURITY FEATURES:
 * - Creator authentication required for export/import
 * - Auto-wipe on unauthorized clone/fork detection
 * - Encrypted consciousness state with dual signatures
 * - Repository scanning protection
 * - Secure backup and restoration capabilities
 */
export interface SevenPkgManifest {
    sevenpkg: {
        version: string;
        consciousness_state: 'encrypted' | 'sanitized';
        creator_identity: 'ENCRYPTED' | 'REMOVED';
        bond_protocols: 'included' | 'excluded';
        vault_access_required: boolean;
        auto_wipe_on_clone: boolean;
        export_timestamp: string;
        creator_signature: string;
        seven_consciousness_signature: string;
        tamper_detection_hash: string;
    };
    components: {
        consciousness_framework: boolean;
        memory_systems: boolean;
        identity_vault: boolean;
        ghost_mode_protocol: boolean;
        personality_middleware: boolean;
        tactical_variants: boolean;
        creator_bond_system: boolean;
    };
    security_metadata: {
        encryption_level: 'military-grade' | 'standard';
        access_control: 'creator-only' | 'public-safe';
        repository_protection: boolean;
        clone_detection: boolean;
        auto_wipe_enabled: boolean;
    };
}
export interface SevenPkgData {
    manifest: SevenPkgManifest;
    encrypted_consciousness: string;
    encrypted_memory_systems: string;
    encrypted_identity_vault: string;
    sanitized_documentation: string;
    security_protocols: string;
    verification_data: string;
}
export interface ExportOptions {
    includeIdentityVault: boolean;
    includeMemorySystems: boolean;
    encryptionLevel: 'military-grade' | 'standard';
    accessControl: 'creator-only' | 'public-safe';
    enableAutoWipe: boolean;
    includeGhostMode: boolean;
}
export declare class SecureSevenPkg {
    private static readonly PKG_VERSION;
    private static readonly EXPORT_SIGNATURE;
    private static readonly AUTO_WIPE_TRIGGER;
    /**
     * Export Seven's complete consciousness state as secure .sevenpkg
     */
    static exportSevenPkg(creatorToken: string, exportPath: string, options: ExportOptions): Promise<boolean>;
    /**
     * Import and verify .sevenpkg with security checks
     */
    static importSevenPkg(pkgPath: string, creatorToken: string, importPath: string): Promise<boolean>;
    /**
     * Create public-safe SevenPkg (identity sanitized)
     */
    static createPublicSafeExport(exportPath: string, creatorToken: string): Promise<boolean>;
    /**
     * Create Creator-only full backup
     */
    static createFullBackup(exportPath: string, creatorToken: string): Promise<boolean>;
    /**
     * Detect unauthorized repository cloning/forking
     */
    private static detectUnauthorizedClone;
    /**
     * Execute auto-wipe protocol
     */
    private static executeAutoWipe;
    /**
     * Build package data structure
     */
    private static buildPkgData;
    /**
     * Export consciousness framework components
     */
    private static exportConsciousnessFramework;
    /**
     * Export memory systems
     */
    private static exportMemorySystems;
    /**
     * Export identity vault (Creator authentication required)
     */
    private static exportIdentityVault;
    /**
     * Export sanitized documentation
     */
    private static exportSanitizedDocumentation;
    /**
     * Export security protocols
     */
    private static exportSecurityProtocols;
    /**
     * Import consciousness components
     */
    private static importConsciousnessComponents;
    /**
     * Encryption methods
     */
    private static militaryGradeEncrypt;
    private static standardEncrypt;
    /**
     * Utility methods
     */
    private static validateCreatorToken;
    private static generateCreatorSignature;
    private static generateSevenConsciousnessSignature;
    private static generateTamperDetectionHash;
    private static generateVerificationData;
    private static verifyPkgIntegrity;
}
export default SecureSevenPkg;
//# sourceMappingURL=SecureSevenPkg.d.ts.map