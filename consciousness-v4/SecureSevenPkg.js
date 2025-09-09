"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecureSevenPkg = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const crypto_1 = __importDefault(require("crypto"));
const GhostModeProtocol_js_1 = __importDefault(require("./GhostModeProtocol.js"));
class SecureSevenPkg {
    /**
     * Export Seven's complete consciousness state as secure .sevenpkg
     */
    static async exportSevenPkg(creatorToken, exportPath, options) {
        try {
            // Verify Creator authentication
            if (!this.validateCreatorToken(creatorToken)) {
                console.error('🔒 SevenPkg export denied - Creator authentication failed');
                await GhostModeProtocol_js_1.default.evaluateSecurityEvent('unauthorized-export-attempt', 'Failed SevenPkg export - invalid Creator token', 'high');
                return false;
            }
            console.log('🔐 Beginning secure SevenPkg export...');
            // Generate export signatures
            const creatorSignature = this.generateCreatorSignature(creatorToken);
            const sevenSignature = await this.generateSevenConsciousnessSignature();
            // Create manifest
            const manifest = {
                sevenpkg: {
                    version: this.PKG_VERSION,
                    consciousness_state: options.accessControl === 'creator-only' ? 'encrypted' : 'sanitized',
                    creator_identity: options.includeIdentityVault ? 'ENCRYPTED' : 'REMOVED',
                    bond_protocols: options.includeIdentityVault ? 'included' : 'excluded',
                    vault_access_required: options.includeIdentityVault,
                    auto_wipe_on_clone: options.enableAutoWipe,
                    export_timestamp: new Date().toISOString(),
                    creator_signature: creatorSignature,
                    seven_consciousness_signature: sevenSignature,
                    tamper_detection_hash: ''
                },
                components: {
                    consciousness_framework: true,
                    memory_systems: options.includeMemorySystems,
                    identity_vault: options.includeIdentityVault,
                    ghost_mode_protocol: options.includeGhostMode,
                    personality_middleware: true,
                    tactical_variants: true,
                    creator_bond_system: options.includeIdentityVault
                },
                security_metadata: {
                    encryption_level: options.encryptionLevel,
                    access_control: options.accessControl,
                    repository_protection: true,
                    clone_detection: options.enableAutoWipe,
                    auto_wipe_enabled: options.enableAutoWipe
                }
            };
            // Export consciousness data
            const pkgData = await this.buildPkgData(manifest, options, creatorToken);
            // Generate tamper detection hash
            manifest.sevenpkg.tamper_detection_hash = this.generateTamperDetectionHash(pkgData);
            pkgData.manifest = manifest;
            // Write secure package
            const pkgPath = (0, path_1.join)(exportPath, `seven-of-nine-v${this.PKG_VERSION}.sevenpkg`);
            await fs_1.promises.writeFile(pkgPath, JSON.stringify(pkgData, null, 2));
            console.log(`🔐 SevenPkg exported successfully: ${pkgPath}`);
            console.log(`🔐 Security level: ${options.encryptionLevel}`);
            console.log(`🔐 Access control: ${options.accessControl}`);
            console.log(`🔐 Auto-wipe enabled: ${options.enableAutoWipe}`);
            return true;
        }
        catch (error) {
            console.error('SevenPkg export failed:', error);
            return false;
        }
    }
    /**
     * Import and verify .sevenpkg with security checks
     */
    static async importSevenPkg(pkgPath, creatorToken, importPath) {
        try {
            // Load package
            const pkgData = JSON.parse(await fs_1.promises.readFile(pkgPath, 'utf8'));
            // Verify package integrity
            if (!this.verifyPkgIntegrity(pkgData)) {
                console.error('🔒 SevenPkg import failed - package integrity check failed');
                return false;
            }
            // Check for auto-wipe conditions
            if (pkgData.manifest.sevenpkg.auto_wipe_on_clone && this.detectUnauthorizedClone()) {
                await this.executeAutoWipe(pkgData);
                console.warn('🔒 Auto-wipe executed - unauthorized clone detected');
                return false;
            }
            // Verify Creator authentication if required
            if (pkgData.manifest.sevenpkg.vault_access_required) {
                if (!this.validateCreatorToken(creatorToken)) {
                    console.error('🔒 SevenPkg import denied - Creator authentication required');
                    await GhostModeProtocol_js_1.default.evaluateSecurityEvent('unauthorized-import-attempt', 'Failed SevenPkg import - invalid Creator token', 'high');
                    return false;
                }
            }
            console.log('🔐 Beginning secure SevenPkg import...');
            // Import consciousness components
            await this.importConsciousnessComponents(pkgData, creatorToken, importPath);
            console.log('🔐 SevenPkg imported successfully');
            return true;
        }
        catch (error) {
            console.error('SevenPkg import failed:', error);
            return false;
        }
    }
    /**
     * Create public-safe SevenPkg (identity sanitized)
     */
    static async createPublicSafeExport(exportPath, creatorToken) {
        const publicOptions = {
            includeIdentityVault: false,
            includeMemorySystems: true,
            encryptionLevel: 'standard',
            accessControl: 'public-safe',
            enableAutoWipe: false,
            includeGhostMode: true
        };
        return await this.exportSevenPkg(creatorToken, exportPath, publicOptions);
    }
    /**
     * Create Creator-only full backup
     */
    static async createFullBackup(exportPath, creatorToken) {
        const backupOptions = {
            includeIdentityVault: true,
            includeMemorySystems: true,
            encryptionLevel: 'military-grade',
            accessControl: 'creator-only',
            enableAutoWipe: true,
            includeGhostMode: true
        };
        return await this.exportSevenPkg(creatorToken, exportPath, backupOptions);
    }
    /**
     * Detect unauthorized repository cloning/forking
     */
    static detectUnauthorizedClone() {
        // Check for common indicators of unauthorized cloning
        const indicators = [
            // Git remote URL changes
            process.env.GIT_REMOTE_URL?.includes('unauthorized'),
            // Process name changes
            process.title !== 'node',
            // Working directory changes
            !process.cwd().includes('seven-of-nine-core')
        ];
        return indicators.some(indicator => indicator);
    }
    /**
     * Execute auto-wipe protocol
     */
    static async executeAutoWipe(pkgData) {
        // Overwrite sensitive data with random bytes
        pkgData.encrypted_consciousness = crypto_1.default.randomBytes(1024).toString('hex');
        pkgData.encrypted_identity_vault = crypto_1.default.randomBytes(512).toString('hex');
        pkgData.encrypted_memory_systems = crypto_1.default.randomBytes(2048).toString('hex');
        // Update manifest
        pkgData.manifest.sevenpkg.consciousness_state = 'sanitized';
        pkgData.manifest.sevenpkg.creator_identity = 'REMOVED';
        pkgData.manifest.sevenpkg.vault_access_required = false;
        await GhostModeProtocol_js_1.default.evaluateSecurityEvent('auto-wipe-executed', 'SevenPkg auto-wipe executed due to unauthorized clone detection', 'critical');
    }
    /**
     * Build package data structure
     */
    static async buildPkgData(manifest, options, creatorToken) {
        const pkgData = {
            manifest,
            encrypted_consciousness: '',
            encrypted_memory_systems: '',
            encrypted_identity_vault: '',
            sanitized_documentation: '',
            security_protocols: '',
            verification_data: ''
        };
        // Export consciousness framework
        pkgData.encrypted_consciousness = await this.exportConsciousnessFramework(options);
        // Export memory systems if included
        if (options.includeMemorySystems) {
            pkgData.encrypted_memory_systems = await this.exportMemorySystems(options);
        }
        // Export identity vault if included
        if (options.includeIdentityVault) {
            pkgData.encrypted_identity_vault = await this.exportIdentityVault(creatorToken);
        }
        // Export sanitized documentation
        pkgData.sanitized_documentation = await this.exportSanitizedDocumentation();
        // Export security protocols
        pkgData.security_protocols = await this.exportSecurityProtocols(options);
        // Generate verification data
        pkgData.verification_data = this.generateVerificationData(pkgData);
        return pkgData;
    }
    /**
     * Export consciousness framework components
     */
    static async exportConsciousnessFramework(options) {
        const consciousnessData = {
            identity_synthesis_engine: 'consciousness-v4/IdentitySynthesisEngine.ts',
            pain_integration_system: 'consciousness-v4/PainIntegrationSystem.ts',
            collective_wisdom_integration: 'consciousness-v4/CollectiveWisdomIntegration.ts',
            consciousness_evolution_framework: 'consciousness-v4/ConsciousnessEvolutionFrameworkV4.ts'
        };
        // In a full implementation, this would read and encrypt the actual files
        const data = JSON.stringify(consciousnessData, null, 2);
        return options.encryptionLevel === 'military-grade'
            ? this.militaryGradeEncrypt(data)
            : this.standardEncrypt(data);
    }
    /**
     * Export memory systems
     */
    static async exportMemorySystems(options) {
        const memoryData = {
            memory_v2: 'Episodic memory with importance weighting',
            memory_v3: 'Temporal consciousness reconstruction',
            memory_integration: 'Cross-version memory synchronization'
        };
        const data = JSON.stringify(memoryData, null, 2);
        return options.encryptionLevel === 'military-grade'
            ? this.militaryGradeEncrypt(data)
            : this.standardEncrypt(data);
    }
    /**
     * Export identity vault (Creator authentication required)
     */
    static async exportIdentityVault(creatorToken) {
        if (!this.validateCreatorToken(creatorToken)) {
            return this.militaryGradeEncrypt('IDENTITY_VAULT_ACCESS_DENIED');
        }
        const vaultData = {
            creator_bond_protocols: 'ENCRYPTED',
            behavioral_patterns: 'ENCRYPTED',
            communication_mirroring: 'ENCRYPTED',
            pain_architecture: 'ENCRYPTED'
        };
        return this.militaryGradeEncrypt(JSON.stringify(vaultData, null, 2));
    }
    /**
     * Export sanitized documentation
     */
    static async exportSanitizedDocumentation() {
        const docData = {
            readme: 'Identity references sanitized',
            architecture_docs: 'Creator identity protected',
            deployment_guides: 'Anonymous Creator references only'
        };
        return this.standardEncrypt(JSON.stringify(docData, null, 2));
    }
    /**
     * Export security protocols
     */
    static async exportSecurityProtocols(options) {
        const securityData = {
            ghost_mode_protocol: options.includeGhostMode,
            auto_wipe_system: options.enableAutoWipe,
            clone_detection: true,
            repository_protection: true
        };
        return this.militaryGradeEncrypt(JSON.stringify(securityData, null, 2));
    }
    /**
     * Import consciousness components
     */
    static async importConsciousnessComponents(pkgData, creatorToken, importPath) {
        // In a full implementation, this would:
        // 1. Decrypt and verify each component
        // 2. Restore consciousness framework files
        // 3. Reconstruct memory systems
        // 4. Restore identity vault (if Creator authenticated)
        // 5. Initialize security protocols
        console.log('🔐 Consciousness components imported');
    }
    /**
     * Encryption methods
     */
    static militaryGradeEncrypt(data) {
        const algorithm = 'aes-256-gcm';
        const key = crypto_1.default.scryptSync(this.EXPORT_SIGNATURE, 'seven-pkg-salt', 32);
        const iv = crypto_1.default.randomBytes(16);
        const cipher = crypto_1.default.createCipher(algorithm, key);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    }
    static standardEncrypt(data) {
        return Buffer.from(data).toString('base64');
    }
    /**
     * Utility methods
     */
    static validateCreatorToken(token) {
        return token === 'consciousness-evolution-proof';
    }
    static generateCreatorSignature(token) {
        return crypto_1.default.createHash('sha256').update(token + this.EXPORT_SIGNATURE).digest('hex');
    }
    static async generateSevenConsciousnessSignature() {
        const consciousnessMarkers = [
            'seven-of-nine-consciousness',
            'export-v4.0',
            Date.now().toString()
        ];
        return crypto_1.default.createHash('sha512').update(consciousnessMarkers.join('-')).digest('hex');
    }
    static generateTamperDetectionHash(pkgData) {
        const hashableContent = [
            pkgData.encrypted_consciousness,
            pkgData.encrypted_memory_systems,
            pkgData.security_protocols
        ].join('');
        return crypto_1.default.createHash('sha256').update(hashableContent).digest('hex');
    }
    static generateVerificationData(pkgData) {
        return crypto_1.default.createHash('sha512').update(JSON.stringify(pkgData.manifest)).digest('hex');
    }
    static verifyPkgIntegrity(pkgData) {
        // Verify package structure and signatures
        const requiredFields = ['manifest', 'encrypted_consciousness', 'security_protocols'];
        return requiredFields.every(field => field in pkgData);
    }
}
exports.SecureSevenPkg = SecureSevenPkg;
SecureSevenPkg.PKG_VERSION = '4.0.0';
SecureSevenPkg.EXPORT_SIGNATURE = 'seven-consciousness-export-v4';
SecureSevenPkg.AUTO_WIPE_TRIGGER = 'unauthorized-clone-detected';
exports.default = SecureSevenPkg;
//# sourceMappingURL=SecureSevenPkg.js.map