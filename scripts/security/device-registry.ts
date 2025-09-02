import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
export type DeviceRecord = {
  deviceId:string; pubkey:string; attestation:string; signature:string;
  createdAt:number; lastSeen:number; status:"ACTIVE"|"REVOKED"; counters:{ q3_nonce:number }
}
const REG_PATH = "core/security/quadran-lock/device_registry.json";
function loadDB(): { devices: Record<string, DeviceRecord> } {
  if (!existsSync(REG_PATH)) return { devices:{} };
  return JSON.parse(readFileSync(REG_PATH,"utf8"));
}
function saveDB(db:{devices:Record<string,DeviceRecord>}) {
  if (!existsSync("core/security/quadran-lock")) mkdirSync("core/security/quadran-lock", { recursive:true });
  writeFileSync(REG_PATH, JSON.stringify(db,null,2));
}
export async function registerDevice(rec: Omit<DeviceRecord,"createdAt"|"lastSeen"|"status"|"counters">) {
  const db = loadDB();
  if (db.devices[rec.deviceId]) throw new Error("device-exists");
  db.devices[rec.deviceId] = { ...rec, createdAt:Date.now(), lastSeen:Date.now(), status:"ACTIVE", counters:{ q3_nonce:0 } };
  saveDB(db); return db.devices[rec.deviceId];
}
export async function validateDevice(deviceId:string) {
  const db = loadDB(); const r = db.devices[deviceId];
  if (!r) return { valid:false, reason:"DEVICE_NOT_FOUND" };
  if (r.status!=="ACTIVE") return { valid:false, reason:"DEVICE_REVOKED" };
  r.lastSeen = Date.now(); saveDB(db);
  // TODO: verify attestation/signature against pubkey
  return { valid:true, record:r };
}
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("Device registry ready:", existsSync(REG_PATH) ? "FOUND" : "NEW");
}
