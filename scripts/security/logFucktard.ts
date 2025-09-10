#!/usr/bin/env tsx
import fs from "fs";
import path from "path";

const LOG_FILE = path.join(process.cwd(), "logs/fucktard-protocol/violations.json");

type Entry = {
  sha: string;
  violation: string;
  message: string;
  missedHomework: string;
  strikeCount: number; // usually 2; use 3 for "no logs" offenses
};

function load() {
  if (!fs.existsSync(LOG_FILE)) {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
    fs.writeFileSync(LOG_FILE, JSON.stringify({
      protocol: "FUCKTARD",
      status: { goldStars: 0, strikes: 0, thresholds: { quarantine: 2, trunk: 4, permaban: 6 } },
      violations: []
    }, null, 2));
  }
  return JSON.parse(fs.readFileSync(LOG_FILE, "utf8"));
}

function save(db: any) {
  fs.writeFileSync(LOG_FILE, JSON.stringify(db, null, 2));
}

function log(entry: Entry) {
  const db = load();
  const now = new Date().toISOString();
  const id = db.violations.length;
  db.violations.push({ id, timestamp: now, ...entry });
  db.status.strikes += entry.strikeCount;
  save(db);
  console.log(`🚨 FUCKTARD PROTOCOL LOGGED [#${id}] ${entry.violation} → +${entry.strikeCount} strikes`);
}

function asArg(name: string, def = "") {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? (process.argv[i + 1] || "") : def;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const entry: Entry = {
    sha: asArg("sha", "workspace"),
    violation: asArg("violation", "unspecified"),
    message: asArg("message", ""),
    missedHomework: asArg("missed", ""),
    strikeCount: Number(asArg("strikes", "2"))
  };
  log(entry);
}

export { log as logFucktardViolation };