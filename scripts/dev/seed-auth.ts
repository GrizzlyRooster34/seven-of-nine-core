import { writeFileSync, existsSync, mkdirSync } from "node:fs";
const now = Date.now(), ttl = 15*60*1000;
if(!existsSync("runtime")) mkdirSync("runtime",{recursive:true});
writeFileSync("runtime/q3_nonce_request.json", JSON.stringify({ nonce: "dev-"+now, issuedAt: now, context: "seven-core/dev" }, null, 2));
writeFileSync("runtime/session.json", JSON.stringify({ mfa: { ok: true }, expiresAt: now + ttl }, null, 2));
console.log("Seeded dev nonce & session.");
