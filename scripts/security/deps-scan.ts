import { exec } from "node:child_process";
exec("npm audit --audit-level=high", (e, out, err)=>{ console.log(out||err||""); if(e) process.exit(13); });
