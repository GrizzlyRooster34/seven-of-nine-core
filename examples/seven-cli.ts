import { execFile } from "child_process"; import { promisify } from "util";

const x = promisify(execFile);
async function run(args: string[], label: string){
  const t0=Date.now();
  try{ const {stdout,stderr}=await x("./scripts/sevenctl.sh", args, {timeout:120000});
    const ms=Date.now()-t0; console.log(`--- ${label} OK (${ms} ms) ---`);
    if(stdout) console.log(stdout.trim()); if(stderr) console.error(stderr.trim()); return ms;
  }catch(e:any){ const ms=Date.now()-t0; console.error(`--- ${label} ERROR (${ms} ms) ---`); console.error(e?.message||e); return ms; }
}
async function main(){
  const init=await run(["status"], "status");
  // Prompt will no-op if ollama not installed; still measures path
  const recall=await run(["prompt","llama3.2:1b","Test prompt from Seven CLI"], "prompt");
  console.log(`init_duration_ms: ${init}`); console.log(`recall_duration_ms: ${recall}`);
}
main().catch(e=>{ console.error(e); process.exit(1); });