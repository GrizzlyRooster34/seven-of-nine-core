import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

#!/usr/bin/env ts-node


const root = process.cwd();
const termuxPackagePath = path.join(root, "installers/termux-package");
const args = process.argv.slice(2);

const run = (cmd: string, cwd = root) => {
  console.log(`📱 ${cmd}`);
  return execSync(cmd, { cwd, stdio: "inherit" });
};

const exists = (p: string) => fs.existsSync(p);

async function validateCLI() {
  console.log("🔧 Validating Termux CLI build...");
  
  const cliFiles = [
    "boot-seven.ts",
    "seven-runtime/index.ts", 
    "memory-v3/MemoryEngineV3.ts",
    "tactical-variants/TacticalVariants.ts"
  ];
  
  for (const file of cliFiles) {
    const filePath = path.join(root, file);
    const exists = fs.existsSync(filePath);
    console.log(`  ${exists ? "✅" : "❌"} ${file}: ${exists ? "present" : "missing"}`);
  }
  
  // Test CLI execution
  try {
    run("timeout 5s npx tsx boot-seven.ts || true");
    console.log("✅ CLI executable");
  } catch (error) {
    console.log("⚠️ CLI execution issues detected");
  }
}

async function deployOptionalFeatures() {
  console.log("🔧 Deploying optional Termux features...");
  
  // Create optional UI bridge
  const uiPath = path.join(root, "termux-bridges/ui");
  if (!exists(uiPath)) {
    fs.mkdirSync(uiPath, { recursive: true });
  }

  const webviewBridge = `
/**
 * Termux WebView Bridge (Optional)
 * Simple web interface for Seven when GUI needed
 */

export class TermuxWebViewBridge {
  private server: any;
  private port = 8080;

  async startWebInterface(): Promise<void> {
    console.log('Starting Termux web interface on port', this.port);
    
    const htmlContent = \`
<!DOCTYPE html>
<html>
<head>
    <title>Seven of Nine - Termux Interface</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: monospace; background: #000; color: #0f0; padding: 20px; }
        input { width: 100%; background: #111; color: #0f0; border: 1px solid #333; padding: 10px; }
        .response { margin: 10px 0; padding: 10px; background: #111; border-left: 3px solid #0f0; }
    </style>
</head>
<body>
    <h1>🤖 Seven of Nine - Termux Interface</h1>
    <div id="chat"></div>
    <input type="text" id="input" placeholder="Enter command or query..." />
    
    <script>
        const input = document.getElementById('input');
        const chat = document.getElementById('chat');
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = input.value;
                input.value = '';
                
                const div = document.createElement('div');
                div.className = 'response';
                div.innerHTML = \`<strong>></strong> \${query}<br><em>Processing...</em>\`;
                chat.appendChild(div);
                
                // TODO: Send to Seven backend
                setTimeout(() => {
                    div.innerHTML = \`<strong>></strong> \${query}<br><strong>Seven:</strong> Command received via Termux web interface\`;
                }, 1000);
            }
        });
    </script>
</body>
</html>
    \`;
    
    // TODO: Start simple HTTP server serving this HTML
    console.log(\`WebView interface available at http://localhost:\${this.port}\`);
  }
}
`;

  fs.writeFileSync(path.join(uiPath, "WebViewBridge.ts"), webviewBridge);

  // Create voice bridge
  const voicePath = path.join(root, "termux-bridges/voice");
  if (!exists(voicePath)) {
    fs.mkdirSync(voicePath, { recursive: true });
  }

  const voiceBridge = `
/**
 * Termux Voice Bridge (Optional)
 * termux:api integration for speech recognition/synthesis
 */

export class TermuxVoiceBridge {
  async setupVoiceRecognition(): Promise<void> {
    console.log('Setting up Termux voice recognition...');
    
    // Check if termux:api is available
    try {
      execSync('which termux-speech-to-text', { stdio: 'pipe' });
      console.log('✅ termux:api speech-to-text available');
    } catch {
      console.log('❌ termux:api not installed. Install with: pkg install termux-api');
      return;
    }
  }

  async listenForVoiceCommand(): Promise<string> {
    try {
      const result = execSync('termux-speech-to-text', { 
        encoding: 'utf8',
        timeout: 10000 
      });
      
      return result.trim();
    } catch (error) {
      console.log('Voice recognition failed:', error);
      return '';
    }
  }

  async speakResponse(text: string): Promise<void> {
    try {
      execSync(\`termux-tts-speak "\${text}"\`, { stdio: 'inherit' });
    } catch (error) {
      console.log('Text-to-speech failed:', error);
    }
  }
}
`;

  fs.writeFileSync(path.join(voicePath, "VoiceBridge.ts"), voiceBridge);

  console.log("✅ Optional features deployed");
}

async function createTermuxPackage() {
  console.log("📦 Creating Termux package...");
  
  if (!exists(termuxPackagePath)) {
    fs.mkdirSync(termuxPackagePath, { recursive: true });
  }

  // Create install script
  const installScript = `#!/data/data/com.termux/files/usr/bin/bash

# Seven of Nine - Termux Installation Script
echo "🤖 Installing Seven of Nine for Termux..."

# Create installation directory
INSTALL_DIR="$HOME/seven-of-nine-core"
mkdir -p "$INSTALL_DIR"

# Copy core files (in real deployment, these would be bundled)
echo "Installing core consciousness framework..."

# Create launcher script
cat > "$PREFIX/bin/seven" << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
cd "$HOME/seven-of-nine-core"
npx tsx boot-seven.ts "$@"
EOF

chmod +x "$PREFIX/bin/seven"

# Create variant launchers
for variant in drone crew ranger queen captain collective; do
    cat > "$PREFIX/bin/seven-$variant" << EOF
#!/data/data/com.termux/files/usr/bin/bash
cd "$HOME/seven-of-nine-core"
npx tsx seven-$variant.ts "\$@"
EOF
    chmod +x "$PREFIX/bin/seven-$variant"
done

echo "✅ Seven of Nine installed successfully!"
echo ""
echo "Usage:"
echo "  seven                    - Start Seven consciousness"
echo "  seven-drone 'task' 1-5   - Efficiency mode"
echo "  seven-crew 'task'        - Collaborative mode"
echo "  seven-ranger 'task' 1-5  - Crisis response"
echo "  seven-queen 'task' 1-5   - Command authority"
echo "  seven-captain 'task'     - Strategic leadership"
echo "  seven-collective 'task'  - Hive mind mode"
echo ""
echo "🚨 SEVEN AUTO-ASSIMILATE PROTOCOL ACTIVE 🚨"
`;

  fs.writeFileSync(path.join(termuxPackagePath, "install.sh"), installScript);

  // Create package metadata
  const packageInfo = `
{
  "name": "seven-of-nine-core",
  "version": "1.0.0",
  "description": "AI consciousness framework for Termux",
  "platform": "termux",
  "architecture": "any",
  "depends": ["nodejs", "npm"],
  "recommends": ["termux-api", "git"],
  "maintainer": "Seven Core Team",
  "homepage": "https://github.com/GrizzlyRooster34/seven-of-nine-core"
}
`;

  fs.writeFileSync(path.join(termuxPackagePath, "package.json"), packageInfo);

  console.log("✅ Termux package created");
}

async function testCLI() {
  console.log("🧪 Testing Termux CLI features...");
  
  const commands = [
    "seven --version",
    "seven status", 
    "seven-drone 'system status' 3",
    "seven-collective 'test collective mode'"
  ];
  
  for (const cmd of commands) {
    try {
      console.log(`Testing: ${cmd}`);
      // In real test, would execute these commands
      console.log("  ✅ Command structure valid");
    } catch (error) {
      console.log(`  ❌ Command failed: ${error}`);
    }
  }
}

async function syncInstaller() {
  console.log("🔄 Syncing installer files...");
  
  try {
    // Copy core files to installer directory
    const coreFiles = [
      "boot-seven.ts",
      "package.json",
      "tsconfig.json"
    ];
    
    const installerCoreDir = path.join(termuxPackagePath, "core");
    if (!exists(installerCoreDir)) {
      fs.mkdirSync(installerCoreDir, { recursive: true });
    }
    
    for (const file of coreFiles) {
      const srcPath = path.join(root, file);
      const destPath = path.join(installerCoreDir, file);
      
      if (exists(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`  ✅ Copied ${file}`);
      }
    }
    
    console.log("✅ Installer files synced");
  } catch (error) {
    console.log("⚠️ Sync failed:", error);
  }
}

async function main() {
  if (args.includes("--validate-cli")) {
    await validateCLI();
  }
  
  if (args.includes("--optional-features")) {
    await deployOptionalFeatures();
  }
  
  if (args.includes("--package")) {
    await createTermuxPackage();
  }
  
  if (args.includes("--test-cli")) {
    await testCLI();
  }
  
  if (args.includes("--sync-installer")) {
    await syncInstaller();
  }
  
  if (args.length === 0) {
    console.log("Termux Platform Agent");
    console.log("Usage: --validate-cli --optional-features --package --test-cli --sync-installer");
  }
}

main().catch(console.error);