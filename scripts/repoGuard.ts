import fs from "fs";
import path from "path";

// scripts/repoGuard.ts


// Configuration per repo
const repoConfig = {
  "seven-of-nine-core": {
    denyPatterns: [
      "TemplateRegistry.ts",
      "ModularPersonaEngine",
      "aurora-core",
      "support.ts",
      "ENABLED = false", // persona templates
      "Creator = null",
      "Christine = null"
    ],
    allowedDirs: ["seven-runtime", "logs", "broadcasting", "personas"]
  },
  "aurora-core": {
    denyPatterns: [
      "TrustGovernor",
      "ChristineReflection",
      "seven-runtime",
      "Creator =",
      "Molly",
      "Bonnie"
    ],
    allowedDirs: ["core", "modules", "docs", "evolution"]
  }
};

// Resolve repo name from root folder
const currentRepo = path.basename(path.resolve("."));
const config = repoConfig[currentRepo];

if (!config) {
  console.error(`❌ RepoGuardian Error: Unrecognized repo "${currentRepo}"`);
  process.exit(1);
}

console.log(`🔍 Running RepoGuardian for: ${currentRepo}`);

const violations: string[] = [];

function scanDirectory(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // Skip common ignore directories
    if (entry.isDirectory()) {
      if (['node_modules', '.git', 'dist', 'build', '.next'].includes(entry.name)) {
        continue;
      }
      scanDirectory(fullPath);
    } else {
      // Only scan text files under 1MB
      const stats = fs.statSync(fullPath);
      if (stats.size > 1024 * 1024) continue; // Skip files > 1MB
      
      // Only scan certain file types
      const ext = path.extname(fullPath).toLowerCase();
      if (!['.ts', '.js', '.md', '.json', '.txt'].includes(ext)) continue;

      try {
        const content = fs.readFileSync(fullPath, "utf-8");

        // Skip self-reference in repoGuard.ts
        if (fullPath.includes('repoGuard.ts')) continue;
        
        // Allow historical references in documentation
        if (fullPath.includes('README.md') || fullPath.includes('CLAUDE.md') || 
            fullPath.includes('alignment-audit') || fullPath.includes('consciousness-v4') ||
            fullPath.includes('darpa-ready-compliance') || fullPath.includes('phase6.md')) {
          continue;
        }

        for (const pattern of config.denyPatterns) {
          if (content.includes(pattern)) {
            violations.push(`❌ Violation: "${pattern}" found in ${fullPath}`);
          }
        }
      } catch (error) {
        // Skip binary or problematic files
        continue;
      }
    }
  }
}

scanDirectory(".");

if (violations.length > 0) {
  console.error("\n🚨 REPOGUARD BLOCKED PUSH\n");
  violations.forEach(v => console.error(v));
  console.error(`\n🛑 Commit aborted. Fix violations before continuing.\n`);
  process.exit(1);
} else {
  console.log("✅ RepoGuardian Passed: No violations detected.");
}