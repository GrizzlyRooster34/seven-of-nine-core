import { existsSync } from "node:fs";

const ok = existsSync("tests") || existsSync("__tests__");
if(!ok){ console.error("no tests present → add at least one"); process.exit(12); }
console.log("coverage-gate: basic OK");
