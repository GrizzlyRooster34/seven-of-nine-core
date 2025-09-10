#!/usr/bin/env tsx

import { cssrScanFiles } from '../../core/safety/quadra-lock/cssr-detector-v2';

const files = process.argv.slice(2);
if (!files.length) {
  console.error('Usage: pnpm tsx scripts/dev/cssr-scan.ts <file ...>');
  process.exit(2);
}

cssrScanFiles(files).then((res) => {
  console.log(JSON.stringify(res, null, 2));
  process.exit(res.length ? 0 : 1);
}).catch((e) => {
  console.error(e);
  process.exit(1);
});