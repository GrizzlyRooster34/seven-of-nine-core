#!/usr/bin/env ts-node

import { execSync } from "node:child_process";
import crypto from 'crypto';
import fs from "node:fs";
import path from "node:path";
// import WebSocket from 'ws'; // Optional dependency - disable for basic deployment


const root = process.cwd();
const companionPath = path.join(root, "seven-companion-app");
const backendPath = path.join(companionPath, "src/backend");
const args = process.argv.slice(2);

const run = (cmd: string, cwd = root) => {
  console.log(`🤖 ${cmd}`);
  return execSync(cmd, { cwd, stdio: "inherit" });
};

const exists = (p: string) => fs.existsSync(p);

async function deployModelLifecycle() {
  console.log("🔄 Deploying model lifecycle manager...");
  
  const lifecyclePath = path.join(backendPath, "llm");
  if (!exists(lifecyclePath)) {
    fs.mkdirSync(lifecyclePath, { recursive: true });
  }

  const lifecycleManager = `
/**
 * Companion Model Lifecycle Manager
 * Claude/Ollama orchestration with hot-swapping
 */

export interface ModelProvider {
  name: 'claude' | 'ollama' | 'openai';
  available: boolean;
  models: string[];
  currentModel?: string;
}

export class OllamaLifecycleManager {
  private providers: Map<string, ModelProvider> = new Map();
  private activeProvider: string | null = null;

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    this.providers.set('claude', {
      name: 'claude',
      available: true,
      models: ['claude-3.5-sonnet', 'claude-3-haiku']
    });
    
    this.providers.set('ollama', {
      name: 'ollama', 
      available: this.checkOllamaAvailable(),
      models: []
    });
  }

  private checkOllamaAvailable(): boolean {
    try {
      execSync('ollama list', { stdio: 'pipe' });
      return true;
    } catch {
      return false;
    }
  }

  async listAvailableModels(): Promise<ModelProvider[]> {
    return Array.from(this.providers.values());
  }

  async switchProvider(provider: string, model?: string): Promise<void> {
    const p = this.providers.get(provider);
    if (!p?.available) {
      throw new Error(\`Provider \${provider} not available\`);
    }

    this.activeProvider = provider;
    if (model) p.currentModel = model;
    
    console.log(\`Switched to \${provider}\${model ? \`/\${model}\` : ''}\`);
  }

  async generateWithActiveProvider(prompt: string): Promise<string> {
    if (!this.activeProvider) {
      throw new Error('No active provider');
    }

    const provider = this.providers.get(this.activeProvider);
    console.log(\`Generating with \${provider?.name}/\${provider?.currentModel}\`);
    
    // TODO: Route to appropriate provider
    return \`Response from \${this.activeProvider}\`;
  }
}
`;

  fs.writeFileSync(path.join(lifecyclePath, "OllamaLifecycleManager.ts"), lifecycleManager);
  console.log("✅ Model lifecycle manager deployed");
}

async function deployEncryptedVault() {
  console.log("🔒 Deploying encrypted vault...");
  
  const securityPath = path.join(backendPath, "security");
  if (!exists(securityPath)) {
    fs.mkdirSync(securityPath, { recursive: true });
  }

  const encryptedVault = `
/**
 * Companion Encrypted Vault
 * Secure storage for API keys, device tokens, and sensitive data
 */


export interface VaultEntry {
  id: string;
  data: string;
  createdAt: Date;
  lastAccessed: Date;
}

export class EncryptedVault {
  private vaultPath: string;
  private masterKey: Buffer;
  
  constructor(vaultPath: string, masterKey: string) {
    this.vaultPath = vaultPath;
    this.masterKey = Buffer.from(masterKey, 'hex');
  }

  private encrypt(data: string): { encrypted: string; iv: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher('aes-256-gcm', this.masterKey, iv);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      encrypted,
      iv: iv.toString('hex')
    };
  }

  private decrypt(encrypted: string, iv: string): string {
    const decipher = crypto.createDecipher('aes-256-gcm', this.masterKey, Buffer.from(iv, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  async store(id: string, data: string): Promise<void> {
    const { encrypted, iv } = this.encrypt(data);
    
    const entry: VaultEntry = {
      id,
      data: \`\${iv}:\${encrypted}\`,
      createdAt: new Date(),
      lastAccessed: new Date()
    };

    const vault = await this.loadVault();
    vault[id] = entry;
    
    await fs.writeFile(this.vaultPath, JSON.stringify(vault, null, 2));
  }

  async retrieve(id: string): Promise<string | null> {
    const vault = await this.loadVault();
    const entry = vault[id];
    
    if (!entry) return null;
    
    const [iv, encrypted] = entry.data.split(':');
    const decrypted = this.decrypt(encrypted, iv);
    
    // Update last accessed
    entry.lastAccessed = new Date();
    await fs.writeFile(this.vaultPath, JSON.stringify(vault, null, 2));
    
    return decrypted;
  }

  private async loadVault(): Promise<Record<string, VaultEntry>> {
    try {
      const data = await fs.readFile(this.vaultPath, 'utf8');
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
}
`;

  fs.writeFileSync(path.join(securityPath, "EncryptedVault.ts"), encryptedVault);
  console.log("✅ Encrypted vault deployed");
}

async function deploySyncServer() {
  console.log("🔄 Deploying sync server...");
  
  const syncPath = path.join(backendPath, "sync");
  if (!exists(syncPath)) {
    fs.mkdirSync(syncPath, { recursive: true });
  }

  const syncServer = `
/**
 * Companion Sync Server
 * WebSocket relay for multi-device session synchronization
 */


export interface SyncMessage {
  type: 'session_update' | 'device_join' | 'device_leave';
  deviceId: string;
  sessionId?: string;
  data?: any;
  timestamp: Date;
}

export class CompanionSyncServer {
  private devices: Map<string, any> = new Map();
  private sessions: Map<string, any> = new Map();
  private port: number;

  constructor(port = 3001) {
    this.port = port;
    console.log(\`Sync server configured for port \${port} (WebSocket disabled for basic deployment)\`);
  }

  startServer() {
    console.log(\`To enable WebSocket sync server, install 'ws' package and uncomment WebSocket code\`);
    // TODO: Implement basic HTTP-based sync as fallback
  }

  private handleMessage(fromDevice: string, message: string) {
    try {
      const syncMessage: SyncMessage = JSON.parse(message);
      
      if (syncMessage.type === 'session_update') {
        this.sessions.set(syncMessage.sessionId!, syncMessage.data);
        // this.broadcastToOthers(fromDevice, syncMessage);
      }
    } catch (error) {
      console.error('Invalid sync message:', error);
    }
  }

  private broadcastToOthers(excludeDevice: string, message: SyncMessage) {
    const messageStr = JSON.stringify(message);
    console.log(\`Would broadcast to devices: \${messageStr}\`);
    // WebSocket broadcasting disabled - fallback to HTTP sync
  }
}
`;

  fs.writeFileSync(path.join(syncPath, "CompanionSyncServer.ts"), syncServer);
  console.log("✅ Sync server deployed");
}

async function testBackend() {
  console.log("🧪 Testing companion backend features...");
  
  const features = [
    { name: "model-lifecycle", path: "src/backend/llm/OllamaLifecycleManager.ts" },
    { name: "vault", path: "src/backend/security/EncryptedVault.ts" },
    { name: "sync-server", path: "src/backend/sync/CompanionSyncServer.ts" }
  ];
  
  for (const feature of features) {
    const featurePath = path.join(companionPath, feature.path);
    const exists = fs.existsSync(featurePath);
    
    console.log(`  ${exists ? "✅" : "❌"} ${feature.name}: ${exists ? "present" : "missing"}`);
  }
}

async function startRelay() {
  console.log("🚀 Starting relay server...");
  
  try {
    run("cd seven-companion-app/relay-server && npm start");
  } catch (error) {
    console.log("⚠️ Relay server start failed - creating startup script");
    
    const startupScript = `
#!/bin/bash
# Companion Relay Server Startup
cd seven-companion-app/relay-server
npm install
npm start
`;
    
    fs.writeFileSync(path.join(root, "start-relay.sh"), startupScript);
    console.log("Created start-relay.sh script");
  }
}

async function main() {
  if (args.includes("--model-lifecycle")) {
    await deployModelLifecycle();
  }
  
  if (args.includes("--vault")) {
    await deployEncryptedVault();
  }
  
  if (args.includes("--sync-server")) {
    await deploySyncServer();
  }
  
  if (args.includes("--test-backend")) {
    await testBackend();
  }
  
  if (args.includes("--start-relay")) {
    await startRelay();
  }
  
  if (args.length === 0) {
    console.log("Companion Platform Agent");
    console.log("Usage: --model-lifecycle --vault --sync-server --test-backend --start-relay");
  }
}

main().catch(console.error);