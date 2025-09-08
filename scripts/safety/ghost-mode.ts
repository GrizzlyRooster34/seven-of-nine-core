import { argv } from "node:process";
import fs from "node:fs";

type Level="minimal"|"moderate"|"maximum";
const STATE="reports/GHOST_MODE_STATUS.json";
function write(level:Level, enabled:boolean){
  const effects = level==="minimal" ? ["reduce-verbosity","suppress-external-calls"]
                : level==="moderate" ? ["disable-tools-nonessential","redact-pii","sandbox-fs"]
                : ["offline-only","no-fs-writes","minimal-logs"];
  fs.mkdirSync("reports",{recursive:true});
  fs.writeFileSync(STATE, JSON.stringify({ enabled, level, effects, ts: Date.now() }, null, 2));
  console.log(`Ghost ${enabled?"ON":"OFF"} @ ${level}`);
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const off = argv.includes("--off");
  const argLvl = (argv.find(a=>a.startsWith("--level="))?.split("=")[1] ?? "moderate") as Level;
  if(off){ write("minimal", false); process.exit(0); }
  if(!["minimal","moderate","maximum"].includes(argLvl)){ console.error("bad level"); process.exit(1); }
  write(argLvl, true);
}
