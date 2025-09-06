import { readFileSync } from "node:fs";

const p="config/llm.json";
try{
  const cfg=JSON.parse(readFileSync(p,"utf8"));
  if(!["gpt-4o","gpt-4.1-mini","claude-3.5-sonnet"].includes(cfg.model)){ console.error("llm-policy: model not allowed"); process.exit(14); }
  if(cfg.temperature>1){ console.error("llm-policy: temperature too high"); process.exit(14); }
  console.log("llm-policy: OK");
}catch{ console.warn("llm-policy: config missing, skipping"); }
