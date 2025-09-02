import { execFile } from "node:child_process"; import { promisify } from "node:util";
const p = promisify(execFile); const bin = process.platform==="win32"?"rg.exe":"rg";
try{
  const { stdout } = await p(bin, ["-n","--hidden","-g","!node_modules","require\\.main\\s*===\\s*module"]);
  console.log((stdout||"").trim()? stdout : "No legacy require.main patterns found.");
} catch { console.warn("ripgrep not found; skipping scan."); }
