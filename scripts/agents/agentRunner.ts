#!/usr/bin/env tsx
import chokidar from 'chokidar';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// FUCKTARD Protocol enforcement
const FT_LOG = path.join(process.cwd(), "logs/fucktard-protocol/violations.json");
let status = { strikes: 0, thresholds: { quarantine: 2, trunk: 4, permaban: 6 } };

try {
  const db = JSON.parse(fs.readFileSync(FT_LOG, "utf8"));
  status = { strikes: db.status.strikes, thresholds: db.status.thresholds };
} catch {}

function mode(): "normal"|"quarantine"|"trunk"|"permaban" {
  if (status.strikes >= status.thresholds.permaban) return "permaban";
  if (status.strikes >= status.thresholds.trunk) return "trunk";
  if (status.strikes >= status.thresholds.quarantine) return "quarantine";
  return "normal";
}

const CURRENT_MODE = mode();
console.log(`[agents] FUCKTARD mode: ${CURRENT_MODE}`);

if (CURRENT_MODE === "permaban") {
  console.error("🚫 Permaban Mode: agents disabled. Hand-off to Jules Pro / GPT-5 required.");
  process.exit(1);
}

// Load agent registry
const REGISTRY_PATH = path.join(path.dirname(new URL(import.meta.url).pathname), 'registry.json');
const LOGS_DIR = path.join(process.cwd(), 'logs/agents');

interface Agent {
  name: string;
  patterns: string[];
  cmd: string[];
  cwd: string;
  debounceMs: number;
  cooldownMs: number;
}

interface Registry {
  version: number;
  agents: Agent[];
}

// Ensure logs directory exists
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

// Load registry
let registry: Registry;
try {
  registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  console.log(`[agents] Loaded ${registry.agents.length} agents from registry`);
} catch (error) {
  console.error(`[agents] Failed to load registry: ${error}`);
  process.exit(1);
}

// Debounce and cooldown tracking
const debounceTimers = new Map<string, NodeJS.Timeout>();
const lastRunTimes = new Map<string, number>();

function shouldRun(agent: Agent): boolean {
  const now = Date.now();
  const lastRun = lastRunTimes.get(agent.name) || 0;
  const timeSinceLastRun = now - lastRun;
  
  if (timeSinceLastRun < agent.cooldownMs) {
    console.log(`[${agent.name}] Cooldown: ${agent.cooldownMs - timeSinceLastRun}ms remaining`);
    return false;
  }
  
  return true;
}

function executeAgent(agent: Agent, changedFile?: string) {
  if (!shouldRun(agent)) return;
  
  const logFile = path.join(LOGS_DIR, `${agent.name}.log`);
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] Triggered by: ${changedFile || 'manual'}\n`;
  
  // Append to log file
  fs.appendFileSync(logFile, logEntry);
  
  console.log(`[${agent.name}] Executing: ${agent.cmd.join(' ')}`);
  
  // In quarantine/trunk mode, log to sandbox only
  if (CURRENT_MODE !== "normal") {
    const sandboxEntry = `[${timestamp}] SANDBOX (${CURRENT_MODE}): ${agent.cmd.join(' ')}\n`;
    fs.appendFileSync(logFile, sandboxEntry);
    console.log(`[${agent.name}] SANDBOX MODE - not executing`);
    return;
  }
  
  const child = spawn(agent.cmd[0], agent.cmd.slice(1), {
    cwd: agent.cwd,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true
  });
  
  let output = '';
  let errorOutput = '';
  
  child.stdout?.on('data', (data) => {
    output += data.toString();
  });
  
  child.stderr?.on('data', (data) => {
    errorOutput += data.toString();
  });
  
  child.on('close', (code) => {
    const endTime = new Date().toISOString();
    const duration = Date.now() - new Date(timestamp).getTime();
    
    let logOutput = `[${endTime}] Exit code: ${code} (${duration}ms)\n`;
    if (output) logOutput += `STDOUT:\n${output}\n`;
    if (errorOutput) logOutput += `STDERR:\n${errorOutput}\n`;
    logOutput += `--- END ---\n\n`;
    
    fs.appendFileSync(logFile, logOutput);
    
    if (code === 0) {
      console.log(`[${agent.name}] ✅ Success (${duration}ms)`);
    } else {
      console.log(`[${agent.name}] ❌ Failed with code ${code} (${duration}ms)`);
    }
    
    lastRunTimes.set(agent.name, Date.now());
  });
  
  child.on('error', (error) => {
    const errorLog = `[${new Date().toISOString()}] ERROR: ${error.message}\n--- END ---\n\n`;
    fs.appendFileSync(logFile, errorLog);
    console.error(`[${agent.name}] Error: ${error.message}`);
  });
}

function debounceExecution(agent: Agent, changedFile: string) {
  const existingTimer = debounceTimers.get(agent.name);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }
  
  const timer = setTimeout(() => {
    executeAgent(agent, changedFile);
    debounceTimers.delete(agent.name);
  }, agent.debounceMs);
  
  debounceTimers.set(agent.name, timer);
}

// Initialize file watchers
const watchers: chokidar.FSWatcher[] = [];

for (const agent of registry.agents) {
  console.log(`[${agent.name}] Watching patterns: ${agent.patterns.join(', ')}`);
  
  const watcher = chokidar.watch(agent.patterns, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true
  });
  
  watcher.on('change', (filePath) => {
    console.log(`[${agent.name}] File changed: ${filePath}`);
    debounceExecution(agent, filePath);
  });
  
  watcher.on('add', (filePath) => {
    console.log(`[${agent.name}] File added: ${filePath}`);
    debounceExecution(agent, filePath);
  });
  
  watcher.on('error', (error) => {
    console.error(`[${agent.name}] Watcher error: ${error}`);
  });
  
  watchers.push(watcher);
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[agents] Shutting down watchers...');
  watchers.forEach(watcher => watcher.close());
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n[agents] Shutting down watchers...');
  watchers.forEach(watcher => watcher.close());
  process.exit(0);
});

console.log(`[agents] All ${registry.agents.length} agents watching. Press Ctrl+C to stop.`);