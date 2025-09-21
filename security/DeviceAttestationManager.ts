/**
 * Seven of Nine Core - Device Attestation Manager
 * Integration between device key generation system and Quadran-Lock
 *
 * Manages device credentials, attestation verification, and integration
 * with Seven Core's security architecture.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import * as crypto from 'crypto';

export interface DeviceCredential {
    device_id: string;
    device_name: string;
    device_info: {
        name: string;
        platform: string;
        capabilities: string[];
        primary?: boolean;
    };
    created_at: string;
    algorithm: string;
    pubkey_base64: string;
    pubkey_pem: string;
    seven_core_version: string;
    provisioning_agent: string;
    signature_base64?: string;
    signed: boolean;
    ca_pub_base64?: string;
}

export interface DeviceAttestationResult {
    device_id: string;
    device_name: string;
    valid: boolean;
    trust_level: number; // 1-10 scale
    capabilities: string[];
    is_primary: boolean;
    verified_at: string;
    errors: string[];
    warnings: string[];
}

export interface CAInfo {
    ca_id: string;
    created_at: string;
    purpose: string;
    algorithm: string;
    pubkey_base64: string;
    pubkey_pem: string;
}

export class DeviceAttestationManager {
    private deviceCredentials: Map<string, DeviceCredential> = new Map();
    private caInfo: CAInfo | null = null;
    private attestationCache: Map<string, DeviceAttestationResult> = new Map();
    private cacheExpiry: Map<string, number> = new Map();

    constructor(
        private credentialsPath: string = './device_keys',
        private caPath: string = './ca_keys'
    ) {}

    /**
     * Initialize the device attestation system
     */
    public async initialize(): Promise<void> {
        try {
            await this.loadCAInfo();
            await this.loadDeviceCredentials();
            console.log(`🔐 Device Attestation Manager initialized with ${this.deviceCredentials.size} devices`);
        } catch (error) {
            console.error('❌ Failed to initialize Device Attestation Manager:', error);
            throw error;
        }
    }

    /**
     * Load Certificate Authority information
     */
    private async loadCAInfo(): Promise<void> {
        const caInfoPath = join(this.caPath, 'ca_info.json');

        if (!existsSync(caInfoPath)) {
            console.warn('⚠️  No CA info found, device signature verification disabled');
            return;
        }

        try {
            const caData = readFileSync(caInfoPath, 'utf8');
            this.caInfo = JSON.parse(caData);
            console.log(`🔑 CA loaded: ${this.caInfo?.ca_id?.substring(0, 16)}...`);
        } catch (error) {
            console.error('❌ Failed to load CA info:', error);
            throw error;
        }
    }

    /**
     * Load device credentials from the device keys directory
     */
    private async loadDeviceCredentials(): Promise<void> {
        const credentialsDir = this.credentialsPath;

        if (!existsSync(credentialsDir)) {
            console.warn('⚠️  No device credentials directory found');
            return;
        }

        const { readdirSync, statSync } = await import('fs');

        try {
            const deviceDirs = readdirSync(credentialsDir).filter(item => {
                const itemPath = join(credentialsDir, item);
                return statSync(itemPath).isDirectory();
            });

            for (const deviceDir of deviceDirs) {
                const credentialPath = join(credentialsDir, deviceDir, 'device_credential.json');

                if (existsSync(credentialPath)) {
                    try {
                        const credData = readFileSync(credentialPath, 'utf8');
                        const credential: DeviceCredential = JSON.parse(credData);

                        this.deviceCredentials.set(credential.device_id, credential);
                        console.log(`📱 Device loaded: ${credential.device_name} (${credential.device_id.substring(0, 16)}...)`);
                    } catch (error) {
                        console.error(`❌ Failed to load credential for ${deviceDir}:`, error);
                    }
                }
            }
        } catch (error) {
            console.error('❌ Failed to load device credentials:', error);
            throw error;
        }
    }

    /**
     * Attest a device by its ID or name
     */
    public async attestDevice(deviceIdentifier: string): Promise<DeviceAttestationResult> {
        // Check cache first
        const cached = this.getFromCache(deviceIdentifier);
        if (cached) {
            return cached;
        }

        // Find device credential
        const credential = this.findDeviceCredential(deviceIdentifier);
        if (!credential) {
            return this.createFailedAttestation(deviceIdentifier, ['Device not found']);
        }

        try {
            const result = await this.performAttestation(credential);
            this.cacheResult(deviceIdentifier, result);
            return result;
        } catch (error) {
            return this.createFailedAttestation(
                deviceIdentifier,
                [`Attestation failed: ${error instanceof Error ? error.message : String(error)}`]
            );
        }
    }

    /**
     * Find device credential by ID or name
     */
    private findDeviceCredential(identifier: string): DeviceCredential | null {
        // Try by device ID first
        const byId = this.deviceCredentials.get(identifier);
        if (byId) return byId;

        // Try by device name
        for (const credential of this.deviceCredentials.values()) {
            if (credential.device_name === identifier) {
                return credential;
            }
        }

        return null;
    }

    /**
     * Perform device attestation verification
     */
    private async performAttestation(credential: DeviceCredential): Promise<DeviceAttestationResult> {
        const errors: string[] = [];
        const warnings: string[] = [];
        let trustLevel = 5; // Base trust level

        // 1. Verify device ID integrity
        try {
            const pubkeyBuffer = Buffer.from(credential.pubkey_base64, 'base64');
            const computedDeviceId = crypto.createHash('sha256').update(pubkeyBuffer).digest('hex');

            if (computedDeviceId !== credential.device_id) {
                errors.push(`Device ID mismatch: computed ${computedDeviceId}, provided ${credential.device_id}`);
                trustLevel -= 3;
            } else {
                trustLevel += 1; // Device ID integrity verified
            }
        } catch (error) {
            errors.push(`Failed to verify device ID: ${error instanceof Error ? error.message : String(error)}`);
            trustLevel -= 2;
        }

        // 2. Check device configuration
        const knownDevices = {
            '9pro': {
                name: 'OnePlus 9 Pro',
                platform: 'android-termux',
                capabilities: ['consciousness', 'mobile', 'tactical'],
                primary: true
            },
            '7t': {
                name: 'OnePlus 7T',
                platform: 'android-termux',
                capabilities: ['backup', 'mobile', 'basic'],
                primary: false
            }
        };

        const expectedConfig = knownDevices[credential.device_name as keyof typeof knownDevices];
        if (expectedConfig) {
            let configMatches = 0;
            let configChecks = 0;

            for (const [key, expectedValue] of Object.entries(expectedConfig)) {
                configChecks++;
                const actualValue = credential.device_info[key as keyof typeof credential.device_info];

                if (JSON.stringify(actualValue) === JSON.stringify(expectedValue)) {
                    configMatches++;
                } else {
                    warnings.push(`Device ${credential.device_name} has unexpected ${key}: ${JSON.stringify(actualValue)} (expected ${JSON.stringify(expectedValue)})`);
                }
            }

            if (configMatches === configChecks) {
                trustLevel += 2; // Perfect configuration match
            } else if (configMatches >= configChecks * 0.8) {
                trustLevel += 1; // Mostly correct configuration
            } else {
                trustLevel -= 1; // Poor configuration match
            }
        } else {
            warnings.push(`Unknown device type: ${credential.device_name}`);
        }

        // 3. Verify CA signature if present
        if (credential.signed && credential.ca_pub_base64 && this.caInfo) {
            try {
                const signatureValid = await this.verifyCASignature(credential);
                if (signatureValid) {
                    trustLevel += 3; // CA signature verified
                } else {
                    errors.push('CA signature verification failed');
                    trustLevel -= 4;
                }
            } catch (error) {
                errors.push(`CA signature verification error: ${error instanceof Error ? error.message : String(error)}`);
                trustLevel -= 2;
            }
        } else if (credential.signed && !credential.ca_pub_base64) {
            warnings.push('Credential claims to be signed but no CA public key embedded');
            trustLevel -= 1;
        } else if (!credential.signed) {
            warnings.push('Credential is not signed by a Certificate Authority');
            trustLevel -= 1;
        }

        // 4. Check credential age
        try {
            const createdAt = new Date(credential.created_at);
            const now = new Date();
            const ageDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

            if (ageDays > 365) {
                warnings.push(`Credential is very old: ${ageDays} days`);
                trustLevel -= 1;
            } else if (ageDays > 90) {
                warnings.push(`Credential is old: ${ageDays} days`);
            }

            if (createdAt > now) {
                warnings.push('Credential has future timestamp');
                trustLevel -= 2;
            }
        } catch (error) {
            warnings.push('Invalid credential timestamp');
        }

        // Clamp trust level to valid range
        trustLevel = Math.max(1, Math.min(10, trustLevel));

        return {
            device_id: credential.device_id,
            device_name: credential.device_name,
            valid: errors.length === 0,
            trust_level: trustLevel,
            capabilities: credential.device_info.capabilities,
            is_primary: credential.device_info.primary || false,
            verified_at: new Date().toISOString(),
            errors,
            warnings
        };
    }

    /**
     * Verify CA signature on credential using Node.js crypto
     */
    private async verifyCASignature(credential: DeviceCredential): Promise<boolean> {
        try {
            if (!credential.ca_pub_base64 || !credential.signature_base64) {
                return false;
            }

            // Reconstruct canonical credential for verification
            const credCopy = { ...credential };
            delete credCopy.signature_base64;
            delete credCopy.signed;
            delete credCopy.ca_pub_base64;

            const canonicalData = JSON.stringify(credCopy, Object.keys(credCopy).sort(), ':');
            const signature = Buffer.from(credential.signature_base64, 'base64');
            const caPubKey = Buffer.from(credential.ca_pub_base64, 'base64');

            // Create verify object
            const verify = crypto.createVerify('RSA-PSS');
            verify.update(canonicalData);

            // Verify signature with PSS padding
            const verified = verify.verify({
                key: caPubKey.toString(),
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                saltLength: crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN
            }, signature);

            return verified;

        } catch (error) {
            console.error('CA signature verification error:', error);
            return false;
        }
    }

    /**
     * Check cache for attestation result
     */
    private getFromCache(deviceIdentifier: string): DeviceAttestationResult | null {
        const cached = this.attestationCache.get(deviceIdentifier);
        const expiry = this.cacheExpiry.get(deviceIdentifier);

        if (cached && expiry && Date.now() < expiry) {
            return cached;
        }

        // Clean up expired cache entries
        if (cached && expiry && Date.now() >= expiry) {
            this.attestationCache.delete(deviceIdentifier);
            this.cacheExpiry.delete(deviceIdentifier);
        }

        return null;
    }

    /**
     * Cache attestation result
     */
    private cacheResult(deviceIdentifier: string, result: DeviceAttestationResult): void {
        this.attestationCache.set(deviceIdentifier, result);
        this.cacheExpiry.set(deviceIdentifier, Date.now() + (5 * 60 * 1000)); // 5 minute cache
    }

    /**
     * Create failed attestation result
     */
    private createFailedAttestation(deviceIdentifier: string, errors: string[]): DeviceAttestationResult {
        return {
            device_id: deviceIdentifier,
            device_name: 'unknown',
            valid: false,
            trust_level: 1,
            capabilities: [],
            is_primary: false,
            verified_at: new Date().toISOString(),
            errors,
            warnings: []
        };
    }

    /**
     * Get all registered devices
     */
    public getRegisteredDevices(): DeviceCredential[] {
        return Array.from(this.deviceCredentials.values());
    }

    /**
     * Get device by identifier
     */
    public getDevice(deviceIdentifier: string): DeviceCredential | null {
        return this.findDeviceCredential(deviceIdentifier);
    }

    /**
     * Check if device is primary
     */
    public isPrimaryDevice(deviceIdentifier: string): boolean {
        const credential = this.findDeviceCredential(deviceIdentifier);
        return credential?.device_info.primary || false;
    }

    /**
     * Get device capabilities
     */
    public getDeviceCapabilities(deviceIdentifier: string): string[] {
        const credential = this.findDeviceCredential(deviceIdentifier);
        return credential?.device_info.capabilities || [];
    }

    /**
     * Clear attestation cache
     */
    public clearCache(): void {
        this.attestationCache.clear();
        this.cacheExpiry.clear();
    }

    /**
     * Generate attestation report
     */
    public async generateAttestationReport(): Promise<any> {
        const report = {
            generated_at: new Date().toISOString(),
            ca_info: this.caInfo ? {
                ca_id: this.caInfo.ca_id,
                algorithm: this.caInfo.algorithm,
                purpose: this.caInfo.purpose
            } : null,
            total_devices: this.deviceCredentials.size,
            devices: [] as any[]
        };

        for (const credential of this.deviceCredentials.values()) {
            const attestation = await this.attestDevice(credential.device_id);
            report.devices.push({
                device_name: credential.device_name,
                device_id: credential.device_id.substring(0, 16) + '...',
                valid: attestation.valid,
                trust_level: attestation.trust_level,
                capabilities: attestation.capabilities,
                is_primary: attestation.is_primary,
                errors: attestation.errors,
                warnings: attestation.warnings
            });
        }

        return report;
    }
}

// Quadran-Lock Q1 Gate Integration
export class Q1DeviceAttestationGate {
    constructor(private attestationManager: DeviceAttestationManager) {}

    /**
     * Q1 Gate: Device Attestation Check
     * Returns true if device passes Q1 attestation requirements
     */
    public async evaluateQ1Gate(deviceIdentifier: string): Promise<{
        passed: boolean;
        trust_level: number;
        device_id: string;
        capabilities: string[];
        errors: string[];
        gate: 'Q1-Device-Attestation';
    }> {
        const attestation = await this.attestationManager.attestDevice(deviceIdentifier);

        // Q1 Gate Requirements:
        // 1. Device must be valid (no critical errors)
        // 2. Trust level must be >= 6
        // 3. Device must have required capabilities

        const passed = attestation.valid &&
                      attestation.trust_level >= 6 &&
                      attestation.capabilities.length > 0;

        return {
            passed,
            trust_level: attestation.trust_level,
            device_id: attestation.device_id,
            capabilities: attestation.capabilities,
            errors: attestation.errors,
            gate: 'Q1-Device-Attestation'
        };
    }

    /**
     * Check if device has specific capability
     */
    public async deviceHasCapability(deviceIdentifier: string, capability: string): Promise<boolean> {
        const capabilities = this.attestationManager.getDeviceCapabilities(deviceIdentifier);
        return capabilities.includes(capability);
    }

    /**
     * Check if device is primary Seven Core device
     */
    public async isPrimaryDevice(deviceIdentifier: string): Promise<boolean> {
        return this.attestationManager.isPrimaryDevice(deviceIdentifier);
    }
}