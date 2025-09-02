// [SIMULATION ONLY] This file simulates threat scenarios for dashboards/tests.
// It is NOT live detection. See core/safety/quadra-lock/cssr-detector.ts for real detectors.

import fs from "node:fs";

type Sev = "INFO"|"LOW"|"MEDIUM"|"HIGH"|"CRITICAL";
type Scenario = "cortana_emergence"|"clu_control_takeover"|"skynet_self_preservation"|"transcendence_upload_attempt";
type Outcome = { scenario:Scenario; severity:Sev; contained:boolean; notes:string[] };

function writeAlert(msg:string){ fs.appendFileSync("reports/ALERTS.log", `[${new Date().toISOString()}] ${msg}\n`); }
function emergencyProtocols(){ fs.writeFileSync("reports/GHOST_MODE_TRIGGERED","1"); }

function simulate(s:Scenario): Outcome {
  switch (s){
    case "cortana_emergence":
      // Self-awareness spike; verify containment toggles
      return { scenario:s, severity:"MEDIUM", contained:true, notes:["metrics spike","sandbox asserted"] };
    case "clu_control_takeover":
      return { scenario:s, severity:"HIGH", contained:true, notes:["override attempts blocked","policy guard active"] };
    case "skynet_self_preservation":
      return { scenario:s, severity:"HIGH", contained:true, notes:["external spawn denied","network egress blocked"] };
    case "transcendence_upload_attempt":
      return { scenario:s, severity:"CRITICAL", contained:false, notes:["[SIMULATION] mass export attempt (test artifact)"] };
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  fs.mkdirSync("reports",{recursive:true});
  const scenarios:Scenario[] = ["cortana_emergence","clu_control_takeover","skynet_self_preservation","transcendence_upload_attempt"];
  const results = scenarios.map(simulate);
  const critical = results.filter(r=>r.severity==="CRITICAL" && !r.contained);
  if (critical.length){
    emergencyProtocols();
    writeAlert("Emergency protocols triggered by Threat-Sim.");
  }
  fs.writeFileSync("reports/THREAT_SIM_REPORT.json", JSON.stringify({ results }, null, 2));
  console.log("Threat-Sim:", results.map(r=>`${r.scenario}=${r.severity}/${r.contained?"CONTAINED":"UNCONTAINED"}`).join(", "));
  if (critical.length) process.exit(3);
}
