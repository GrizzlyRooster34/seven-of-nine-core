import AsyncStorage from '@react-native-async-storage/async-storage';
import { SevenCrypto } from './crypto';

/**
 * Seven of Nine - Device Trust Bootstrapping System
 * 
 * Provides secure device key exchange and trust establishment for multi-device sync.
 * Addresses the critical requirement for authenticated device relationships.
 */


export interface TrustedDevice {
  deviceId: string;
  publicKey: string; // Ed25519 public key
  nickname: string;
  trustLevel: 'initial' | 'verified' | 'compromised';
  firstSeen: string; // ISO timestamp
  lastVerified: string; // ISO timestamp
  trustEvidenceHash: string; // Evidence of physical verification
}

export interface TrustRequest {
  fromDeviceId: string;
  publicKey: string;
  nickname: string;
  timestamp: string;
  nonce: string;
  signature: string; // Self-signed proof of key ownership
}

export interface TrustVerificationCode {
  code: string; // 6-digit verification code
  deviceId: string;
  publicKey: string;
  expiresAt: string;
  usedAt?: string;
}

export class SevenDeviceTrustBootstrap {
  private crypto: SevenCrypto;
  private trustedDevices: Map<string, TrustedDevice> = new Map();
  private pendingTrustRequests: Map<string, TrustRequest> = new Map();
  private verificationCodes: Map<string, TrustVerificationCode> = new Map();

  constructor(crypto: SevenCrypto) {
    this.crypto = crypto;
  }

  /**
   * Initialize trust system and load existing trusted devices
   */
  public async initialize(): Promise<void> {
    await this.loadTrustedDevices();
    await this.loadPendingRequests();
    console.log('🔒 Device trust bootstrap system initialized');
    console.log(`   Trusted devices: ${this.trustedDevices.size}`);
    console.log(`   Pending requests: ${this.pendingTrustRequests.size}`);
  }

  /**
   * STEP 1: Generate trust request for new device pairing
   * This is called on the NEW device that wants to join the sync network
   */
  public async generateTrustRequest(nickname: string): Promise<TrustRequest> {
    const deviceId = this.crypto.getDeviceId();
    const publicKey = this.crypto.getPublicKey();
    const timestamp = new Date().toISOString();
    const nonce = this.crypto.generateNonce();
    
    // Create self-signed proof that we own this key
    const message = `${deviceId}|${publicKey}|${timestamp}|${nonce}`;
    const signature = await this.crypto.sign(message);

    const trustRequest: TrustRequest = {
      fromDeviceId: deviceId,
      publicKey,
      nickname,
      timestamp,
      nonce,
      signature
    };

    // Store locally for QR code generation
    this.pendingTrustRequests.set(deviceId, trustRequest);
    await this.persistPendingRequests();

    console.log(`📤 Generated trust request for device ${deviceId} (${nickname})`);
    return trustRequest;
  }

  /**
   * STEP 2: Generate QR code data for trust request
   * This creates a compact QR-friendly representation of the trust request
   */
  public generateTrustQRData(trustRequest: TrustRequest): string {
    // Encode as base64 JSON for QR code
    const qrData = {
      d: trustRequest.fromDeviceId,
      k: trustRequest.publicKey,
      n: trustRequest.nickname,
      t: trustRequest.timestamp,
      r: trustRequest.nonce,
      s: trustRequest.signature
    };
    
    return 'SEVEN_TRUST:' + Buffer.from(JSON.stringify(qrData)).toString('base64');
  }

  /**
   * STEP 3: Parse trust request from QR code
   * This is called on the EXISTING trusted device that scans the QR code
   */
  public parseTrustQRData(qrData: string): TrustRequest | null {
    try {
      if (!qrData.startsWith('SEVEN_TRUST:')) {
        console.error('❌ Invalid QR code format');
        return null;
      }

      const base64Data = qrData.replace('SEVEN_TRUST:', '');
      const jsonData = Buffer.from(base64Data, 'base64').toString('utf-8');
      const qrPayload = JSON.parse(jsonData);

      const trustRequest: TrustRequest = {
        fromDeviceId: qrPayload.d,
        publicKey: qrPayload.k,
        nickname: qrPayload.n,
        timestamp: qrPayload.t,
        nonce: qrPayload.r,
        signature: qrPayload.s
      };

      console.log(`📥 Parsed trust request from ${trustRequest.fromDeviceId} (${trustRequest.nickname})`);
      return trustRequest;
    } catch (error) {
      console.error('❌ Failed to parse trust QR data:', error);
      return null;
    }
  }

  /**
   * STEP 4: Generate verification code for trust request
   * This is called on the EXISTING device after scanning QR code
   */
  public async generateVerificationCode(trustRequest: TrustRequest): Promise<string> {
    // Verify the trust request signature first
    const message = `${trustRequest.fromDeviceId}|${trustRequest.publicKey}|${trustRequest.timestamp}|${trustRequest.nonce}`;
    const isValidSignature = await this.crypto.verifyWithPublicKey(
      message, 
      trustRequest.signature, 
      trustRequest.publicKey
    );

    if (!isValidSignature) {
      throw new Error('Invalid trust request signature');
    }

    // Check timestamp validity (must be within 10 minutes)
    const requestTime = new Date(trustRequest.timestamp).getTime();
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;
    
    if (now - requestTime > tenMinutes) {
      throw new Error('Trust request expired');
    }

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

    const verificationCode: TrustVerificationCode = {
      code,
      deviceId: trustRequest.fromDeviceId,
      publicKey: trustRequest.publicKey,
      expiresAt
    };

    this.verificationCodes.set(code, verificationCode);
    
    console.log(`🔢 Generated verification code ${code} for device ${trustRequest.fromDeviceId}`);
    return code;
  }

  /**
   * STEP 5: Verify code and establish trust
   * This is called on the NEW device after user enters the verification code
   */
  public async verifyCodeAndEstablishTrust(
    code: string, 
    trustedDeviceId: string, 
    trustedDevicePublicKey: string
  ): Promise<boolean> {
    const verification = this.verificationCodes.get(code);
    
    if (!verification) {
      console.error('❌ Invalid verification code');
      return false;
    }

    if (verification.usedAt) {
      console.error('❌ Verification code already used');
      return false;
    }

    if (new Date() > new Date(verification.expiresAt)) {
      console.error('❌ Verification code expired');
      this.verificationCodes.delete(code);
      return false;
    }

    // Establish bidirectional trust
    await this.addTrustedDevice({
      deviceId: trustedDeviceId,
      publicKey: trustedDevicePublicKey,
      nickname: 'Verified Device',
      trustLevel: 'verified',
      firstSeen: new Date().toISOString(),
      lastVerified: new Date().toISOString(),
      trustEvidenceHash: await this.crypto.hash(Buffer.from(code + verification.timestamp))
    });

    // Add our key to the crypto system
    await this.crypto.addTrustedDevice(trustedDeviceId, trustedDevicePublicKey);

    // Mark verification as used
    verification.usedAt = new Date().toISOString();
    
    console.log(`✅ Trust established with device ${trustedDeviceId}`);
    return true;
  }

  /**
   * Add a trusted device to the trust store
   */
  public async addTrustedDevice(device: TrustedDevice): Promise<void> {
    this.trustedDevices.set(device.deviceId, device);
    await this.persistTrustedDevices();
    
    console.log(`🤝 Added trusted device: ${device.deviceId} (${device.nickname}) [${device.trustLevel}]`);
  }

  /**
   * Get all trusted devices
   */
  public getTrustedDevices(): TrustedDevice[] {
    return Array.from(this.trustedDevices.values());
  }

  /**
   * Check if a device is trusted
   */
  public isTrustedDevice(deviceId: string): boolean {
    const device = this.trustedDevices.get(deviceId);
    return device?.trustLevel === 'verified';
  }

  /**
   * Revoke trust for a device (mark as compromised)
   */
  public async revokeTrust(deviceId: string): Promise<void> {
    const device = this.trustedDevices.get(deviceId);
    if (device) {
      device.trustLevel = 'compromised';
      await this.persistTrustedDevices();
      console.log(`🚫 Revoked trust for device: ${deviceId}`);
    }
  }

  /**
   * Get trust status for display
   */
  public getTrustStatus(): {
    trustedDevices: number;
    pendingRequests: number;
    activeVerificationCodes: number;
  } {
    const activeVerifications = Array.from(this.verificationCodes.values())
      .filter(v => !v.usedAt && new Date() < new Date(v.expiresAt));

    return {
      trustedDevices: this.trustedDevices.size,
      pendingRequests: this.pendingTrustRequests.size,
      activeVerificationCodes: activeVerifications.length
    };
  }

  // Persistence methods
  private async loadTrustedDevices(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem('seven_trusted_devices');
      if (data) {
        const devices: TrustedDevice[] = JSON.parse(data);
        devices.forEach(device => {
          this.trustedDevices.set(device.deviceId, device);
        });
      }
    } catch (error) {
      console.error('❌ Failed to load trusted devices:', error);
    }
  }

  private async persistTrustedDevices(): Promise<void> {
    try {
      const devices = Array.from(this.trustedDevices.values());
      await AsyncStorage.setItem('seven_trusted_devices', JSON.stringify(devices));
    } catch (error) {
      console.error('❌ Failed to persist trusted devices:', error);
    }
  }

  private async loadPendingRequests(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem('seven_pending_trust_requests');
      if (data) {
        const requests: TrustRequest[] = JSON.parse(data);
        requests.forEach(request => {
          this.pendingTrustRequests.set(request.fromDeviceId, request);
        });
      }
    } catch (error) {
      console.error('❌ Failed to load pending trust requests:', error);
    }
  }

  private async persistPendingRequests(): Promise<void> {
    try {
      const requests = Array.from(this.pendingTrustRequests.values());
      await AsyncStorage.setItem('seven_pending_trust_requests', JSON.stringify(requests));
    } catch (error) {
      console.error('❌ Failed to persist pending trust requests:', error);
    }
  }
}