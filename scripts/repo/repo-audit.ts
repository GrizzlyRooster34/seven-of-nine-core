import { execFile } from "node:child_process";
import { promisify } from "node:util";
const pexec = promisify(execFile);
async function run(cmd:string,args:string[]){ try{ const {stdout}=await pexec(cmd,args); return {ok:true,stdout}; }catch(e:any){ return {ok:false,stdout:e.stdout||e.message}; } }
async function rg(q:string){ return run(process.platform==="win32"?"rg.exe":"rg",["-n","--hidden","-g","!node_modules",q]); }
function score(xs:{ok:boolean}[]){ return Math.round(100 * xs.filter(x=>x.ok).length / xs.length); }
if (import.meta.url === `file://${process.argv[1]}`) (async ()=>{
  const checks=[];
  checks.push(await run("git",["fsck","--full","--strict"]));
  checks.push(await rg("quadran-lock")); // forbidden token
  const s=score(checks); console.log(`Repo health: ${s}/100`);
  if(s<70) process.exit(5);
})();
