#!/usr/bin/env node
/* Detect "dumbass" or "fucking dumbass" in a provided string (commit msg / PR comment). */
const s = (process.argv.slice(2).join(' ') || '').toLowerCase();
const hit = /\bfucking\s+dumbass\b|\bdumbass\b/i.test(s);
if (hit) { console.log('OVERRIDE=1'); process.exit(2); }
console.log('OVERRIDE=0');