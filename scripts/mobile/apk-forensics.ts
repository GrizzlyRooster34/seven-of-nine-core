import fs from "node:fs";

const rel = "apps/mobile/android/app/build/outputs/apk/release/app-release.apk";
const dbg = "apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk";
if (fs.existsSync(rel)) { console.log("APK FOUND (release):", rel); process.exit(0); }
if (fs.existsSync(dbg)) { console.log("APK FOUND (debug):", dbg); process.exit(0); }
console.error("APK NOT FOUND. Try: npm run apk:assemble  (builds debug)");
process.exit(9);
