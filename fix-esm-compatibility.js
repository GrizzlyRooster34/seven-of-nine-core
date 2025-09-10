#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

console.log('🔧 ESM Compatibility Fixer - Seven of Nine Core');
console.log('===============================================\n');

const scriptsDirsToCheck = [
  'scripts',
  'installers',
  'memory-v3',
  'memory-v2',
  'tests',
  'seven-mobile-app',
  'seven-companion-app',
  'gpt-archaeology',
  'seven-sync',
  'seven-sensors',
  'seven-runtime',
  'chatgpt-bridge',
  'consciousness-v4',
  'core',
  '.'
];

let totalFixed = 0;

function getAllTsFiles(dir, currentPath = '') {
  const files = [];
  const fullPath = join(__dirname, currentPath, dir);
  
  try {
    const items = readdirSync(fullPath);
    
    for (const item of items) {
      const itemPath = join(fullPath, item);
      const stat = statSync(itemPath);
      
      if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.git')) {
        files.push(...getAllTsFiles(item, join(currentPath, dir)));
      } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
        files.push(join(currentPath, dir, item));
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read, skip
  }
  
  return files;
}

function fixFile(filePath) {
  try {
    const fullPath = join(__dirname, filePath);
    const content = readFileSync(fullPath, 'utf8');
    let modified = false;
    let newContent = content;

    // Fix misplaced shebang lines
    const hasShebangMidFile = content.includes('#!/usr/bin/env') && !content.startsWith('#!/usr/bin/env');
    
    if (hasShebangMidFile) {
      // Extract the shebang line
      const shebangMatch = content.match(/(#!\/usr\/bin\/env [^\n\r]*)/);
      if (shebangMatch) {
        const shebangLine = shebangMatch[1];
        
        // Remove the misplaced shebang
        newContent = newContent.replace(shebangLine, '');
        newContent = newContent.replace(/\n\s*\n\s*\n/g, '\n\n'); // Clean up extra newlines
        
        // Add shebang at the beginning
        newContent = `${shebangLine}\n\n${newContent.trimStart()}`;
        modified = true;
      }
    }

    // Fix CommonJS patterns to ESM
    if (newContent.includes('require.main === module')) {
      newContent = newContent.replace(
        /if \(require\.main === module\) \{/g,
        'if (import.meta.url === `file://${process.argv[1]}`) {'
      );
      modified = true;
    }

    if (modified) {
      writeFileSync(fullPath, newContent, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      totalFixed++;
    }

  } catch (error) {
    console.log(`❌ Error fixing ${filePath}: ${error.message}`);
  }
}

// Get all TypeScript files
console.log('🔍 Scanning for TypeScript files...\n');

const allFiles = [];
for (const dir of scriptsDirsToCheck) {
  const files = getAllTsFiles(dir);
  allFiles.push(...files);
}

// Add root level .ts files
try {
  const rootFiles = readdirSync(__dirname)
    .filter(file => file.endsWith('.ts') && !file.endsWith('.d.ts'))
    .map(file => file);
  allFiles.push(...rootFiles);
} catch (error) {
  // Ignore error
}

console.log(`📂 Found ${allFiles.length} TypeScript files`);
console.log('🔧 Applying ESM compatibility fixes...\n');

// Fix each file
for (const file of allFiles) {
  fixFile(file);
}

console.log(`\n🎉 ESM Compatibility Fix Complete!`);
console.log(`📊 Total files fixed: ${totalFixed}`);
console.log('===============================================');