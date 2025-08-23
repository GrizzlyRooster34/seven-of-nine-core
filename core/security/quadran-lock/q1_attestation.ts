/**
 * Q1 Ed25519 Attestation System
 * First gate of Quadranlock authentication protocol
 */

import { createVerify } from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface Q1AttestationResult {
  valid: boolean;
  timestamp: string;
  signature?: string;
  error?: string;
}

export interface Q1AttestationContext {
  userId: string;
  timestamp: string;
  challenge?: string;
}

export class Q1EdAttestationGate {
  private publicKeyPath: string;

  constructor(publicKeyPath?: string) {
    this.publicKeyPath = publicKeyPath || path.join(process.cwd(), 'keys', 'creator_public.pem');
  }

  /**
   * Verify Ed25519 signature for Q1 gate
   */
  async verifySignature(context: Q1AttestationContext, signature: string): Promise<Q1AttestationResult> {
    try {
      // Load public key
      const publicKey = await this.loadPublicKey();
      if (!publicKey) {
        return {
          valid: false,
          timestamp: new Date().toISOString(),
          error: 'Public key not found'
        };
      }

      // Create message to verify
      const message = this.createVerificationMessage(context);

      // Verify signature using Ed25519
      const verify = createVerify('SHA256');
      verify.update(message);
      const isValid = verify.verify(publicKey, signature, 'base64');

      return {
        valid: isValid,
        timestamp: new Date().toISOString(),
        signature: signature
      };

    } catch (error) {
      return {
        valid: false,
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }

  /**
   * Create challenge for Q1 gate
   */
  createChallenge(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `q1-${timestamp}-${random}`;
  }

  private async loadPublicKey(): Promise<string | null> {
    try {
      return await fs.readFile(this.publicKeyPath, 'utf8');
    } catch (error) {
      console.warn(`⚠️ Q1: Failed to load public key from ${this.publicKeyPath}:`, error.message);
      return null;
    }
  }

  private createVerificationMessage(context: Q1AttestationContext): string {
    return JSON.stringify({
      userId: context.userId,
      timestamp: context.timestamp,
      challenge: context.challenge,
      gate: 'Q1'
    }, Object.keys(context).sort());
  }
}

/**
 * Main Q1 verification function
 */
export async function runQ1Attestation(context: Q1AttestationContext, signature: string): Promise<Q1AttestationResult> {
  const gate = new Q1EdAttestationGate();
  return await gate.verifySignature(context, signature);
}