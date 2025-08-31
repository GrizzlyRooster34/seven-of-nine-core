import { execFile } from "node:child_process"; import { promisify } from "node:util"; const p=promisify(execFile);
async function rg(q:string){ try{ const {stdout}=await p(process.platform==="win32"?"rg.exe":"rg",["-n","--hidden","-g","!node_modules",q]); return stdout;}catch{ return "";} }
(async ()=>{
  let fail=false;
  if((await rg("\\bquadranlock\\b")).trim()){ console.error("forbidden token: quadranlock"); fail=true; }
  if((await rg("\\.env")).trim()){ console.error(".env files checked in"); fail=true; }
  const badCase=(await rg("core/[A-Z]")).trim();
  if(badCase){ console.error("PascalCase under /core is disallowed"); fail=true; }
  if(fail) process.exit(6); else console.log("policy-check: OK");
})();
