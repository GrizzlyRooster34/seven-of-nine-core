
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const modelDir = './llms/';
const configPath = './llm_manager/llm_config.json';
const catalogPath = './llm_manager/llm_catalog.json';

function loadJSON(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getInstalledModels() {
  return fs.readdirSync(modelDir).filter(f => f.endsWith('.gguf'));
}

function downloadModel(url: string, target: string) {
  console.log(`⬇️ Downloading model from ${url}...`);
  execSync(`curl -L -o ${target} ${url}`, { stdio: 'inherit' });
}

function restartSystem() {
  console.log("♻️ Restarting session...");
  execSync('pm2 restart seven || npm run start', { stdio: 'inherit' });
}

function selectLLM() {
  const config = loadJSON(configPath);
  const catalog = loadJSON(catalogPath);
  const installed = getInstalledModels();
  const current = config.active_model;

  const latest = catalog.find(m => m.name !== current && !installed.includes(m.name));
  if (latest) {
    console.log(`🧠 Upgrade available: ${latest.name}`);
    const userConsent = true; // In real app, ask user
    if (userConsent) {
      downloadModel(latest.url, path.join(modelDir, latest.name));
      config.active_model = latest.name;
      config.last_checked = new Date().toISOString();
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      restartSystem();
    }
  } else {
    console.log("✅ Current model is up to date.");
  }
}

selectLLM();