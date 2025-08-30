#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const bannedRegexes = [
  /(?<!\/)\bquadranlock\b(?!\w)/i,              // no-hyphen token banned (not in paths)
  /core\/security\/quadra-lock/,                // wrong folder for security
  /core\/safety\/quadran-lock/                  // wrong folder for CSSR
];
const ignoreDirs = new Set(['node_modules', '.git', 'dist', 'build', 'out', '.next']);
const ignoreFiles = new Set(['scripts/ban-terms.js', 'scripts/structure-guards.js', 'CLAUDE.md', '.github/pull_request_template.md']);

const args = process.argv.slice(2);
const stagedOnly = args.includes('--staged');

function listFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoreDirs.has(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(p));
    else out.push(p);
  }
  return out;
}

function listStagedFiles() {
  const cp = require('child_process');
  const res = cp.execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' });
  return res.split('\n').filter(Boolean);
}

const files = stagedOnly ? listStagedFiles() : listFiles(root);
let violations = [];

for (const f of files) {
  // Skip enforcement files that legitimately document the banned terms
  const relPath = path.relative(root, f);
  if (ignoreFiles.has(relPath)) continue;
  
  const text = fs.readFileSync(f, 'utf8');
  for (const rx of bannedRegexes) {
    if (rx.test(text)) violations.push({ file: f, rule: rx.toString() });
  }
}

if (violations.length) {
  console.error('BANNED TERMS/PATHS DETECTED:');
  for (const v of violations) console.error(` - ${v.file} :: ${v.rule}`);
  process.exit(1);
}