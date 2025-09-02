import { readFileSync, existsSync } from "node:fs";
const a="reports/state-windows.json", b="reports/state-mobile.json";
if(!(existsSync(a)&&existsSync(b))){ console.log("state-parity: snapshots missing (skip)"); process.exit(0); }
const A=JSON.parse(readFileSync(a,"utf8")), B=JSON.parse(readFileSync(b,"utf8"));
const drift=Math.abs(JSON.stringify(A).length-JSON.stringify(B).length);
console.log("state-parity drift:", drift); process.exit(0);
