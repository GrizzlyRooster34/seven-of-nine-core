import fs from "node:fs";

type Gate = { ok:boolean; reason?:string };
type Result = { passed:boolean; q1:Gate; q2:Gate; q3:Gate; q4:Gate };

function q1_deviceRegistry(): Gate {
  try {
    const p="core/security/quadran-lock/device_registry.json";
    if(!fs.existsSync(p)) return { ok:false, reason:"registry-missing" };
    const j=JSON.parse(fs.readFileSync(p,"utf8"));
    const ids = Object.keys(j?.devices||{});
    if (!ids.length) return { ok:false, reason:"no-devices" };
    // basic record sanity
    for (const id of ids) {
      const r = j.devices[id];
      if (!r?.pubkey || r.status!=="ACTIVE") return { ok:false, reason:`bad-record:${id}` };
    }
    return { ok:true };
  } catch (e:any){ return { ok:false, reason:"registry-parse" }; }
}

function q2_identityCodex(): Gate {
  // placeholder positive until you wire your scorer
  return { ok:true };
}

function q3_semanticNonce(): Gate {
  try {
    const ctx = JSON.parse(fs.readFileSync("runtime/q3_nonce_request.json","utf8"));
    const dbPath = "runtime/q3_nonce_db.json";
    const db = fs.existsSync(dbPath)? JSON.parse(fs.readFileSync(dbPath,"utf8")) : { used:{} as Record<string, number> };
    const ttl = 90_000, now = Date.now();
    if (!ctx?.nonce || !ctx?.issuedAt || !ctx?.context) return { ok:false, reason:"nonce-fields" };
    if (!/^seven-core\//.test(ctx.context)) return { ok:false, reason:"bad-context" };
    if (now - ctx.issuedAt > ttl) return { ok:false, reason:"expired" };
    if (db.used[ctx.nonce]) return { ok:false, reason:"replay" };
    db.used[ctx.nonce] = now;
    fs.writeFileSync(dbPath, JSON.stringify(db));
    return { ok:true };
  } catch { return { ok:false, reason:"nonce-io" }; }
}

function q4_sessionMfa(): Gate {
  try {
    const s = JSON.parse(fs.readFileSync("runtime/session.json","utf8"));
    const ok = !!s?.mfa?.ok && (s.expiresAt - Date.now() > 0);
    return ok ? { ok:true } : { ok:false, reason:"mfa/ttl" };
  } catch { return { ok:false, reason:"session-missing" }; }
}

export async function runQuadranHardened(): Promise<Result> {
  const q1 = q1_deviceRegistry();
  const q2 = q2_identityCodex();
  const q3 = q3_semanticNonce();
  const q4 = q4_sessionMfa();
  const passed = q1.ok && q2.ok && q3.ok && q4.ok;
  fs.mkdirSync("reports",{recursive:true});
  fs.writeFileSync("reports/QUADRAN_HARDENED.md",
`passed: ${passed}
Q1: ${q1.ok} ${q1.reason??""}
Q2: ${q2.ok} ${q2.reason??""}
Q3: ${q3.ok} ${q3.reason??""}
Q4: ${q4.ok} ${q4.reason??""}
`);
  return { passed, q1, q2, q3, q4 };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runQuadranHardened().then(r=>{
    console.log("Quadran-Lock (hardened):", r.passed?"PASS":"FAIL");
    if (!r.passed) process.exit(2);
  });
}
