#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

function exists(p) { try { fs.accessSync(p); return true; } catch { return false; } }
function hasExport(p, token) {
  if (!exists(p)) return false;
  const t = fs.readFileSync(p, 'utf8');
  return new RegExp(`export\\s+(?:async\\s+)?function\\s+${token}\\b`).test(t)
      || new RegExp(`export\\s*\\{[^}]*\\b${token}\\b[^}]*\\}`).test(t);
}

const secDir  = path.join(process.cwd(), 'core/security/quadran-lock');
const cssrDir = path.join(process.cwd(), 'core/safety/quadra-lock');

if (!exists(secDir) || !exists(cssrDir)) {
  console.error('Missing required directories: core/security/quadran-lock and/or core/safety/quadra-lock');
  process.exit(1);
}

const secIndex  = path.join(secDir, 'index.ts');
const cssrIndex = path.join(cssrDir, 'index.ts');

if (!hasExport(secIndex, 'runQuadranLock')) {
  console.error('runQuadranLock export missing from core/security/quadran-lock/index.ts');
  process.exit(1);
}
if (!hasExport(cssrIndex, 'runQuadraLockCSSR')) {
  console.error('runQuadraLockCSSR export missing from core/safety/quadra-lock/index.ts');
  process.exit(1);
}

// Security files must NOT live under quadra-lock (CSSR) and vice versa
function scan(dir, shouldContain, bannedPatterns) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of files) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) scan(p, shouldContain, bannedPatterns);
    else {
      const content = fs.readFileSync(p, 'utf8');
      for (const bad of bannedPatterns) {
        if (bad.test(content)) {
          console.error(`Misplaced content in ${p} matching ${bad}`);
          process.exit(1);
        }
      }
    }
  }
}

// If any Q1-Q4 implementation keywords show up under CSSR dir → fail
scan(cssrDir, false, [/q1_/, /q2_/, /q3_/, /q4_/, /runQuadranLock\b/]);

// If any case-study markers show up under security dir → fail
scan(secDir, false, [/detectCortana|detectCLU|detectSkynet|detectTranscendence|runQuadraLockCSSR\b/]);

console.log('✅ Structure guards passed');