import fs from "node:fs";
import path from "node:path";

// Optional: swap for "sshpk" or "tweetnacl" later; for now, presence check + TODO for signature verify.
type Device = { deviceId: string; pubkey_ssh_ed25519: string };
type Registry = { devices: Device[] };

const REG_PATH = path.resolve(__dirname, "device_registry.json");

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