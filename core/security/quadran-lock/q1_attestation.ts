import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Optional: swap for "sshpk" or "tweetnacl" later; for now, presence check + TODO for signature verify.
type Device = { deviceId: string; pubkey_ssh_ed25519: string };
type Registry = { devices: Device[] };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REG_PATH = path.resolve(__dirname, "device_registry.json");

// Export types that orchestrator expects
export interface Q1AttestationResult {
  valid: boolean;
  timestamp: string;
  error?: string;
}

export interface Q1AttestationContext {
  env?: { deviceId?: string };
  runtime?: { deviceId?: string };
  auth?: { pubkey_ssh_ed25519?: string };
}

// Legacy function - keep for compatibility
export function q1_attestation(ctx: any): boolean {
  const reg = JSON.parse(fs.readFileSync(REG_PATH, "utf8")) as Registry;
  const deviceId = ctx?.env?.deviceId || ctx?.runtime?.deviceId;
  const presentedKey = ctx?.auth?.pubkey_ssh_ed25519; // from launcher / env

  if (!deviceId || !presentedKey) return false;

  const match = reg.devices.find(d => d.deviceId === deviceId);
  if (!match) return false;

  // Minimal match: same key string registered. (Upgrade: verify signed nonce)
  if (match.pubkey_ssh_ed25519 !== presentedKey) return false;

  // TODO (upgrade): verify a signed semantic nonce with the registered public key
  return true;
}

// New function that orchestrator expects
export async function runQ1Attestation(ctx: Q1AttestationContext, signature?: string): Promise<Q1AttestationResult> {
  const timestamp = new Date().toISOString();
  
  try {
    const isValid = q1_attestation(ctx);
    return {
      valid: isValid,
      timestamp
    };
  } catch (error) {
    return {
      valid: false,
      timestamp,
      error: error.message || 'Q1 attestation failed'
    };
  }
}