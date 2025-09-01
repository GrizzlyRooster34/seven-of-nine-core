import { existsSync } from "node:fs";
try { if (existsSync("scripts/repo/repo-audit.plus.js")) await import("../repo/repo-audit.plus.js");
      else if (existsSync("scripts/repo/repo-audit.plus.ts")) await import("../repo/repo-audit.plus.ts");
      else await import("../repo/repo-audit.js");
} catch (e) { console.error("Repo-Audit runner failed:", e); process.exit(5); }
