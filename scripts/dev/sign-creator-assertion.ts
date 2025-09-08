import { sign } from "@noble/ed25519";
import { writeFileSync } from "node:fs";

// Usage (secure host): node scripts/dev/sign-creator-assertion.ts <hex-ed25519-privkey> <subject> <nonce>
(async () => {
  const [, , privHex, sub = "CreatorPrime", nonce = `nonce-${Date.now()}`] = process.argv;
  if (!privHex) { console.error("need <hex-ed25519-privkey>"); process.exit(1); }
  const issuedAt = Date.now();
  const msg = new TextEncoder().encode(`seven-core/creator-identity:${sub}:${nonce}:${issuedAt}`);
  const sig = await sign(msg, Uint8Array.from(Buffer.from(privHex, "hex")));
  const signature = Buffer.from(sig).toString("hex");
  const assertion = { sub, nonce, issuedAt, signature };
  writeFileSync("runtime/creator_assertion.json", JSON.stringify(assertion, null, 2));
  console.log("Wrote runtime/creator_assertion.json");
})();
