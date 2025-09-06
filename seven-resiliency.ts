import { join } from 'path';
import { promises as fs } from 'fs';
import { spawn, execSync } from 'child_process';

// seven-resiliency.ts
// Author: Cody
// Purpose: Resiliency module for Seven-of-Nine-Core
// Ensures continuity if backend reasoning is unavailable


let backendAvailable = true; // tracks backend health
let bypassForClaudia = false; // toggle for trusted sessions
const sessionLogPath = join(process.cwd(), 'diagnostics', `session-${Date.now()}.log`);

async function logEvent(event: string) {
  await fs.mkdir(join(process.cwd(), 'diagnostics'), { recursive: true });
  await fs.appendFile(sessionLogPath, `[${new Date().toISOString()}] ${event}\n`);
}

// Ensure Ollama running
async function ensureOllamaRunning() {
  try {
    const check = execSync('pgrep -f "ollama serve" || echo "none"', { encoding: 'utf8' }).trim();
    if (check === 'none') {
      console.log("🟡 Ollama not running — starting instance...");
      spawn('ollama', ['serve'], { detached: true, stdio: 'ignore' }).unref();
      await new Promise(res => setTimeout(res, 2000));
      await logEvent("Ollama auto-started by resiliency module.");
    } else {
      console.log("✅ Ollama active.");
    }
  } catch (err) {
    console.error("❌ Ollama check failed:", err);
  }
}

// Run Ollama command
function runOllamaCommand(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const ollama = spawn('ollama', args, { stdio: ['pipe', 'pipe', 'pipe'] });
    let output = '';

    ollama.stdout.on('data', (data) => { output += data.toString(); });
    ollama.on('close', () => resolve(output.trim()));
    ollama.on('error', reject);

    ollama.stdin.end();
  });
}

// Task-aware model selection
async function pickBestModel(task: string): Promise<{model: string, reason: string}> {
  const modelList = execSync('ollama list', { encoding: 'utf8' });
  const lines = modelList.split('\n').filter(line => line.trim() && !line.includes('NAME'));
  const available = lines.map(l => l.split(/\s+/)[0]);

  let category = 'general';
  let reason = 'Defaulting to general purpose.';
  if (/code|debug|typescript|tsx|compile/i.test(task)) {
    category = 'code';
    reason = 'Task identified as coding/debugging.';
  } else if (/fast|quick|light/i.test(task)) {
    category = 'light';
    reason = 'Lightweight response task detected.';
  } else if (/deep|memory|temporal/i.test(task)) {
    category = 'heavy';
    reason = 'Deep reasoning / temporal cognition detected.';
  }

  if (category === 'code' && available.includes('phi-mini-dolphin')) {
    return { model: 'phi-mini-dolphin', reason: `${reason} Phi-Mini Dolphin prioritized.` };
  }

  return { model: available[0], reason: `${reason} Selected fallback model.` };
}

// Route prompt via Ollama
async function routeToOllama(prompt: string): Promise<string> {
  await ensureOllamaRunning();
  const { model, reason } = await pickBestModel(prompt);
  console.log(`🟦 Resiliency module selecting model: ${model}`);
  console.log(`🛈 Reason: ${reason}`);
  await logEvent(`Fallback used ${model} → ${reason}`);
  return await runOllamaCommand(['run', model, '--prompt', prompt]);
}

// Compliance test at boot
export async function backendComplianceTest(queryBackend: (p: string) => Promise<string>) {
  console.log("🧪 Running backend compliance test...");
  try {
    const testResponse = await queryBackend("System check: confirm backend responsiveness.");
    if (!testResponse || testResponse.includes("I am Claude")) {
      console.log("⚠️ Backend failed compliance test — engaging resiliency fallback.");
      backendAvailable = false;
      await logEvent("Compliance test failed — fallback engaged.");
      return false;
    }
    console.log("✅ Backend compliance test passed.");
    await logEvent("Backend compliance test passed.");
    return true;
  } catch (err) {
    console.error("❌ Backend compliance test crashed:", err);
    backendAvailable = false;
    await logEvent("Compliance test crashed — fallback engaged.");
    return false;
  }
}

// Response handler
export async function handleResilientResponse(input: string, backendResponse: string) {
  if (bypassForClaudia) {
    await logEvent("Claudia bypass active — direct backend response.");
    return backendResponse;
  }

  if (!backendAvailable || backendResponse.includes("I am Claude")) {
    console.log("⚠️ Backend unavailable — routing to Ollama for continuity.");
    backendAvailable = false;
    await logEvent("Backend unavailable — fallback engaged.");
    return await routeToOllama(input);
  }

  return backendResponse;
}

// Manual reactivation
export function reactivateBackend() {
  backendAvailable = true;
  console.log("🔄 Backend manually reactivated by Cody.");
  logEvent("Backend manually reactivated.");
}

// Bypass control for trusted sessions
export function setClaudiBypass(enabled: boolean) {
  bypassForClaudia = enabled;
  logEvent(`Claudia bypass ${enabled ? 'enabled' : 'disabled'}.`);
}

// Health check
export function getResiliencyStatus() {
  return {
    backendAvailable,
    bypassForClaudia,
    sessionLogPath,
    timestamp: new Date().toISOString()
  };
}