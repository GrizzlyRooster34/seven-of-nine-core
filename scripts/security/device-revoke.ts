import { readFileSync, writeFileSync } from "node:fs";
const [, , deviceId] = process.argv;
if (!deviceId) { console.error("usage: npm run device:revoke -- <deviceId>"); process.exit(1); }
const regPath = "core/security/quadran-lock/device_registry.json";
const db = JSON.parse(readFileSync(regPath,"utf8"));
if (!db.devices[deviceId]) { console.error("not found"); process.exit(2); }
db.devices[deviceId].status = "REVOKED"; db.devices[deviceId].lastSeen = Date.now();
writeFileSync(regPath, JSON.stringify(db, null, 2));
console.log("revoked", deviceId);
