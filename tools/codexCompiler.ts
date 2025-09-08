import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CODEX_DIR = path.join(__dirname, '../consciousness-v4/codex');
const JSON_OUT_DIR = path.join(__dirname, '../consciousness-v4/json');

interface CodexRule {
  id: string;
  tag: string;
  priority: number;
  content: string;
  checksum: string;
}

interface CodexFile {
  source: string;
  type: 'values' | 'tactics' | 'humor' | 'vices' | 'ethics' | 'ops' | 'memory' | 'security' | 'funding';
  content: string;
  rules: CodexRule[];
  compiled_at: string;
  checksum: string;
}

function generateChecksum(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

function parseMarkdownToRules(content: string, type: string): CodexRule[] {
  const rules: CodexRule[] = [];
  const lines = content.split('\n');
  
  let currentRule: Partial<CodexRule> = {};
  let priority = 100;
  
  for (const line of lines) {
    if (line.startsWith('##')) {
      if (currentRule.content) {
        rules.push({
          id: `${type}.${currentRule.tag || 'default'}`,
          tag: currentRule.tag || `${type}.default`,
          priority: priority--,
          content: currentRule.content,
          checksum: generateChecksum(currentRule.content)
        });
      }
      
      currentRule = {
        tag: `${type}.${line.replace('##', '').trim().toLowerCase().replace(/\s+/g, '_')}`,
        content: line + '\n'
      };
    } else if (currentRule.content !== undefined) {
      currentRule.content += line + '\n';
    }
  }
  
  // Add final rule
  if (currentRule.content) {
    rules.push({
      id: `${type}.${currentRule.tag || 'default'}`,
      tag: currentRule.tag || `${type}.default`,
      priority: priority,
      content: currentRule.content,
      checksum: generateChecksum(currentRule.content)
    });
  }
  
  return rules;
}

export function compileCodex(): Record<string, string> {
  // Ensure output directory exists
  if (!fs.existsSync(JSON_OUT_DIR)) {
    fs.mkdirSync(JSON_OUT_DIR, { recursive: true });
  }

  const checksums: Record<string, string> = {};
  const codexTypes = ['persona', 'tactics', 'humor', 'vices', 'ethics', 'ops', 'risk', 'memory', 'security', 'funding'];
  
  for (const type of codexTypes) {
    const typeDir = path.join(CODEX_DIR, type);
    
    if (!fs.existsSync(typeDir)) continue;
    
    const files = fs.readdirSync(typeDir).filter(f => f.endsWith('.md'));
    
    for (const file of files) {
      const filePath = path.join(typeDir, file);
      const rawContent = fs.readFileSync(filePath, 'utf8');
      
      const codexFile: CodexFile = {
        source: `${type}/${file}`,
        type: type as any,
        content: rawContent,
        rules: parseMarkdownToRules(rawContent, type),
        compiled_at: new Date().toISOString(),
        checksum: generateChecksum(rawContent)
      };
      
      const outputFileName = `${type}_${file.replace('.md', '')}.codex.json`;
      const outputPath = path.join(JSON_OUT_DIR, outputFileName);
      
      fs.writeFileSync(outputPath, JSON.stringify(codexFile, null, 2));
      checksums[outputFileName] = codexFile.checksum;
      
      console.log(`✅ Compiled: ${type}/${file} → ${outputFileName}`);
    }
  }
  
  // Generate VERSION.json
  const versionFile = {
    version: "5.0",
    compiled_at: new Date().toISOString(),
    author: "Matthew Cody Heinen",
    checksums: checksums
  };
  
  fs.writeFileSync(path.join(JSON_OUT_DIR, 'VERSION.json'), JSON.stringify(versionFile, null, 2));
  console.log(`🔐 Generated VERSION.json with ${Object.keys(checksums).length} checksums`);
  
  return checksums;
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🔧 Compiling Seven Core Codex...');
  const checksums = compileCodex();
  console.log('✅ Codex compilation complete.');
  console.log(`📊 Files processed: ${Object.keys(checksums).length}`);
}