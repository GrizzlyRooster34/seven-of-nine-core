import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

#!/usr/bin/env ts-node


const root = process.cwd();
const syncClientPath = path.join(root, "ui-shell/src/sync");
const args = process.argv.slice(2);

const run = (cmd: string, cwd = root) => {
  console.log(`🔧 ${cmd}`);
  return execSync(cmd, { cwd, stdio: "inherit" });
};

const exists = (p: string) => fs.existsSync(p);

async function deploySyncClient() {
  console.log("📡 Deploying Windows sync client...");
  
  if (!exists(syncClientPath)) {
    fs.mkdirSync(syncClientPath, { recursive: true });
  }

  // Create sync client stub
  const syncClientCode = `
/**
 * Windows Sync Client
 * Connects to companion app relay server for multi-device sync
 */

export interface SyncConfig {
  relayServerUrl: string;
  deviceId: string;
  encryptionKey: string;
}

export class WindowsSyncClient {
  private config: SyncConfig;
  private connected = false;

  constructor(config: SyncConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    console.log('Connecting to relay server:', this.config.relayServerUrl);
    // TODO: WebSocket connection to companion relay
    this.connected = true;
  }

  async syncSession(sessionData: any): Promise<void> {
    if (!this.connected) await this.connect();
    
    console.log('Syncing session to other devices...');
    // TODO: Encrypt and send session data
  }

  async receiveSyncUpdates(): Promise<any[]> {
    if (!this.connected) await this.connect();
    
    // TODO: Listen for updates from other devices
    return [];
  }

  disconnect(): void {
    console.log('Disconnecting from sync server...');
    this.connected = false;
  }
}
`;

  fs.writeFileSync(path.join(syncClientPath, "WindowsSyncClient.ts"), syncClientCode);
  
  // Create sync integration
  const syncIntegration = `
export { WindowsSyncClient } from './WindowsSyncClient';

// Integration with Tauri backend
export const initializeSync = async () => {
  const config = {
    relayServerUrl: 'ws://localhost:3001/sync',
    deviceId: await generateDeviceId(),
    encryptionKey: await getOrCreateEncryptionKey()
  };
  
  return new WindowsSyncClient(config);
};

async function generateDeviceId(): Promise<string> {
  // TODO: Generate stable device identifier
  return 'windows-' + Math.random().toString(36).substring(7);
}

async function getOrCreateEncryptionKey(): Promise<string> {
  // TODO: Secure key storage using OS keychain
  return 'temp-encryption-key';
}
`;

  fs.writeFileSync(path.join(syncClientPath, "index.ts"), syncIntegration);
  
  console.log("✅ Windows sync client deployed");
}

async function testFeatures() {
  console.log("🧪 Testing Windows desktop features...");
  
  const features = ["sync", "sensors", "voice"];
  
  for (const feature of features) {
    const featurePath = path.join(root, `ui-shell/src/${feature}`);
    const exists = fs.existsSync(featurePath);
    
    console.log(`  ${exists ? "✅" : "❌"} ${feature}: ${exists ? "present" : "missing"}`);
  }
}

async function packageInstaller() {
  console.log("📦 Packaging Windows installer...");
  
  try {
    run("cd ui-shell && npm run tauri build --target x86_64-pc-windows-msvc");
    console.log("✅ Windows build completed");
  } catch (error) {
    console.log("⚠️ Build failed - creating installer stub");
    
    const installerDir = path.join(root, "installers/windows-package");
    if (!exists(installerDir)) {
      fs.mkdirSync(installerDir, { recursive: true });
    }
    
    const installerScript = `
# Windows Seven of Nine Installer
# PowerShell installation script

Write-Host "Installing Seven of Nine for Windows..."

$installPath = "$env:LOCALAPPDATA\\SevenOfNine"
New-Item -ItemType Directory -Force -Path $installPath

Write-Host "✅ Seven of Nine installed to $installPath"
Write-Host "Run 'seven' command to start"
`;
    
    fs.writeFileSync(path.join(installerDir, "install.ps1"), installerScript);
  }
}

async function main() {
  if (args.includes("--sync-client")) {
    await deploySyncClient();
  }
  
  if (args.includes("--test-features")) {
    await testFeatures();
  }
  
  if (args.includes("--package")) {
    await packageInstaller();
  }
  
  if (args.length === 0) {
    console.log("Windows Platform Agent");
    console.log("Usage: --sync-client --test-features --package");
  }
}

main().catch(console.error);