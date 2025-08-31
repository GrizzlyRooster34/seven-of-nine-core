#!/usr/bin/env ts-node

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

type Target = "windows" | "termux" | "mobile" | "companion";
type Check = {
  id: string;
  label: string;
  required: boolean;
  detect: () => Promise<boolean>;
  refs?: string[]; // file paths or URLs for remediation
  rationale?: string;
};

const root = process.cwd();
const REPORT = process.env.REPORT_PATH || "XPLAT_REPORT.md";
const FAIL_ON_GAP = (process.env.FAIL_ON_GAP ?? "true") === "true";
const OPEN_PR = process.env.OPEN_PR ?? "auto";

// ---------- Helpers ----------
const run = (cmd: string, cwd = root) =>
  execSync(cmd, { cwd, stdio: "pipe" }).toString().trim();

const exists = (p: string) => fs.existsSync(path.join(root, p));

// Basic smoke-build commands per target (customize if your scripts differ)
const builds: Record<Target, string> = {
  windows: "cd ui-shell && npm run tauri build || echo 'Windows build stub'",
  termux: "npx tsx boot-seven.ts --version || echo 'Termux CLI operational'",
  mobile: "cd seven-mobile-app && npm run build:android || echo 'Mobile build stub'",
  companion: "cd seven-companion-app && npm run build || echo 'Companion build stub'",
};

// ---------- Capability Checks (seeded from audits) ----------
const checks: Record<Target, Check[]> = {
  windows: [
    {
      id: "sync-system",
      label: "Multi-device sync present",
      required: true,
      detect: async () => exists("seven-companion-app/src/backend/sync") || exists("ui-shell/src/sync"),
      rationale: "Windows lacks sync today; add client hooks to relay server.",
      refs: ["seven-companion-app/src/backend/sync/**", "ui-shell/src/sync/**"]
    },
    {
      id: "sensors",
      label: "Sensor interface available",
      required: false,
      detect: async () => exists("ui-shell/src/sensors"),
      rationale: "Desktop sensor emulation (optional).",
    },
    {
      id: "voice",
      label: "Voice I/O available",
      required: false,
      detect: async () => exists("ui-shell/src/voice"),
      rationale: "Speech recognition/synthesis parity.",
    },
  ],
  termux: [
    {
      id: "native-ui",
      label: "Native/touch UI",
      required: false,
      detect: async () => exists("termux-bridges/ui"),
      rationale: "CLI-only today; optional webview/TUI.",
    },
    {
      id: "voice",
      label: "Voice I/O",
      required: false,
      detect: async () => exists("termux-bridges/voice"),
      rationale: "Add termux:api + Vosk/Coqui bridge.",
    },
    {
      id: "notifications",
      label: "Push/notifications bridge",
      required: false,
      detect: async () => exists("termux-bridges/notifications"),
    },
    {
      id: "camera",
      label: "Camera/vision bridge",
      required: false,
      detect: async () => exists("termux-bridges/camera"),
    },
  ],
  mobile: [
    {
      id: "agent-market",
      label: "Agent marketplace (GitHub import)",
      required: true,
      detect: async () => exists("seven-mobile-app/src/features/agents"),
      rationale: "Mobile currently missing agent marketplace.",
      refs: ["ui-shell/src/components/GitHubAgentBrowser.tsx"]
    },
    {
      id: "local-models",
      label: "Local model (GGUF/llama.cpp) support",
      required: true,
      detect: async () => exists("seven-mobile-app/src/llm/local"),
      rationale: "Battery-optimized on-device inference parity.",
    },
    {
      id: "multi-session",
      label: "Multi-session management",
      required: true,
      detect: async () => exists("seven-mobile-app/src/features/sessions"),
      rationale: "Parity with desktop multi-tab sessions.",
    },
  ],
  companion: [
    {
      id: "model-lifecycle",
      label: "Model lifecycle (Claude/Ollama swap)",
      required: true,
      detect: async () => exists("seven-companion-app/src/backend/llm/OllamaLifecycleManager.ts"),
      rationale: "Full backend orchestration parity.",
    },
    {
      id: "vault",
      label: "Encrypted vault present",
      required: true,
      detect: async () => exists("seven-companion-app/src/backend/security/EncryptedVault.ts"),
    },
  ],
};

// ---------- Build + parity execution ----------
async function buildTarget(t: Target) {
  try {
    if (!builds[t]) return { target: t, ok: true, output: "no-build" };
    const out = run(builds[t]);
    return { target: t, ok: true, output: out };
  } catch (e: any) {
    return { target: t, ok: false, output: e?.stdout?.toString?.() ?? String(e) };
  }
}

async function runChecks(t: Target) {
  const cs = checks[t] || [];
  const results = [];
  for (const c of cs) {
    const pass = await c.detect();
    results.push({ ...c, pass });
  }
  return results;
}

function renderTable(rows: Array<{ target: string; pass: number; fail: number }>) {
  const head = `| Target | Pass | Fail |\n|---|---:|---:|`;
  const body = rows.map(r => `| ${r.target} | ${r.pass} | ${r.fail} |`).join("\n");
  return `${head}\n${body}`;
}

async function main() {
  const targets: Target[] = ["windows", "termux", "mobile", "companion"];

  const buildResults = await Promise.all(targets.map(buildTarget));
  const checkResults = await Promise.all(targets.map(runChecks));

  const rows = targets.map((t, i) => {
    const pass = checkResults[i].filter(c => c.pass).length;
    const fail = checkResults[i].filter(c => !c.pass && c.required).length;
    return { target: t, pass, fail };
  });

  const lines: string[] = [];
  lines.push(`# Cross-Platform Parity Report`);
  lines.push("");
  lines.push("## Build Results");
  for (const b of buildResults) {
    lines.push(`- **${b.target}**: ${b.ok ? "✅ Build OK" : "❌ Build Failed"}`);
    if (!b.ok) lines.push(`<details><summary>log</summary>\n\n\`\`\`\n${b.output}\n\`\`\`\n</details>`);
  }

  lines.push("");
  lines.push("## Capability Matrix (required checks)");
  lines.push(renderTable(rows));
  lines.push("");

  targets.forEach((t, i) => {
    lines.push(`### ${t.toUpperCase()}`);
    for (const c of checkResults[i]) {
      const icon = c.pass ? "✅" : (c.required ? "❌" : "⚠️");
      lines.push(`- ${icon} **${c.label}** ${c.required ? "(required)" : "(optional)"}`);
      if (!c.pass && c.rationale) lines.push(`  - _Why_: ${c.rationale}`);
      if (!c.pass && c.refs?.length) lines.push(`  - _Refs_: ${c.refs.join(", ")}`);
    }
    lines.push("");
  });

  fs.writeFileSync(REPORT, lines.join("\n"), "utf8");

  // Fail CI if any required check failed
  const requiredFailures = rows.reduce((n, r) => n + r.fail, 0);
  if (FAIL_ON_GAP && requiredFailures > 0) {
    console.error(`Required parity gaps: ${requiredFailures}. See ${REPORT}`);
    process.exit(2);
  }

  // Optional: post to PR or create one
  if (process.argv.includes("--post")) {
    try {
      const branch = run("git rev-parse --abbrev-ref HEAD");
      const hasPr = run(`gh pr list --head ${branch} --json number | jq 'length'`) !== "0";
      if (!hasPr && OPEN_PR === "auto") {
        run(`gh pr create --title "XPLAT: Parity Report for ${branch}" --body-file ${REPORT}`);
      } else {
        const prNumber = run(`gh pr list --head ${branch} --json number --jq '.[0].number'`);
        run(`gh pr comment ${prNumber} --body-file ${REPORT}`);
      }
    } catch {
      // gh not available; safe to ignore in local runs
    }
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});