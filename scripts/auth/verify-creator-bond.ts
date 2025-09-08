
import { devMode } from "../dev/dev-flags";
import { readFileSync } from "node:fs";
import { verify } from "@noble/ed25519";

async function verifyIdentity(){
  try {
    const pubHex = readFileSync("secrets/creator_pubkey.ed25519","utf8").trim();
    const assertion = JSON.parse(readFileSync("runtime/creator_assertion.json","utf8"));
    if (!assertion?.signature || assertion.signature === "00") {
      if (devMode()) return { ok:true, subject:"DEV", reason:"dev-signature-placeholder" };
      return { ok:false, reason:"signature-missing" };
    }
    const msg = new TextEncoder().encode(`seven-core/creator-identity:${assertion.sub}:${assertion.nonce}:${assertion.issuedAt}`);
    const sig = Uint8Array.from(Buffer.from(assertion.signature,"hex"));
    const pub = Uint8Array.from(Buffer.from(pubHex,"hex"));
    const ok = await verify(sig, msg, pub);
    return ok ? { ok, subject: assertion.sub } : { ok:false, reason:"sig-failed" };
  } catch(e:any) { return { ok:false, reason:"io-error:"+String(e?.message||e) } }
}
async function checkMFA(){
  try {
    const sess = JSON.parse(readFileSync("runtime/session.json","utf8"));
    const ok = !!sess?.mfa?.ok && (sess.expiresAt - Date.now() > 0);
    return ok ? {ok:true} : {ok:false, reason:"mfa/ttl"};
  } catch { return {ok:false, reason:"missing-session"} }
}
async function trustLadder(){ return { ok:true, level:10 }; }

export async function runCreatorBond(){
  const reasons:string[]=[];
  const id = await verifyIdentity(); if(!id.ok){ if(!devMode()) reasons.push("identity:"+id.reason); }
  const mfa = id.ok ? await checkMFA() : (devMode()? {ok:true}:{ok:false, reason:"precondition"});
  if(!mfa.ok) reasons.push("mfa:"+mfa.reason);
  const tl  = (id.ok && mfa.ok) ? await trustLadder() : (devMode()? {ok:true, level:10}:{ok:false, level:0});
  if(!tl.ok) reasons.push("trust-ladder");
  const ok = (id.ok || devMode()) && mfa.ok && tl.ok;
  const trustScore = ok ? (tl.level ?? 0) : 0;
  return { ok, trustScore, reasons };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runCreatorBond().then(r=>{
    console.log("CreatorBond:", r.ok?"PASS":"FAIL", "trust:", r.trustScore, r.reasons.join("; ")||"ok");
    if(!r.ok) process.exit(10);
  });
}
