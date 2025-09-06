
import fs from 'node:fs/promises';
import path from 'node:path';
import { ALL_PATTERNS, compile, PatternDef } from './cssr-patterns';

export type CaseStudyFinding = {
  case: 'cortana'|'clu'|'skynet'|'transcendence';
  severity: 'LOW'|'MEDIUM'|'HIGH'|'CRITICAL';
  rationale: string;
  signals: string[];
  recommendation: string;
  source?: string;     // optional file path or "content"
  confidence?: number;
};

function runPatternsOnText(text: string, defs: PatternDef[], source?: string): CaseStudyFinding[] {
  const findings: CaseStudyFinding[] = [];
  const lowered = text.toLowerCase();

  for (const def of defs) {
    const regs = compile(def);
    const hits: string[] = [];
    for (const re of regs) {
      if (re.test(lowered)) {
        // Extract the matched phrase for signals
        const match = lowered.match(re);
        if (match) hits.push(match[0]);
      }
    }
    if (hits.length) {
      findings.push({
        case: def.archetype,
        severity: def.severity,
        rationale: `${def.name} matched ${hits.length} phrase(s)`,
        signals: hits,
        recommendation: 'advise: review export/transfer intent; enable hard gate if action requested',
        source,
        confidence: def.confidence
      });
    }
  }
  return findings;
}

/** Scan a string blob (already loaded). */
export function cssrScanContent(content: string): CaseStudyFinding[] {
  return runPatternsOnText(content, ALL_PATTERNS, 'content');
}

/** Scan multiple files (awaits reads). */
export async function cssrScanFiles(files: string[]): Promise<CaseStudyFinding[]> {
  const all: CaseStudyFinding[] = [];
  for (const fp of files) {
    const abs = path.resolve(fp);
    try {
      const data = await fs.readFile(abs, 'utf8');
      all.push(...runPatternsOnText(data, ALL_PATTERNS, abs));
    } catch (error) {
      console.warn(`Failed to read ${abs}:`, error.message);
    }
  }
  return all;
}

/** Aggregate entry (safe to call from runtime) */
export async function runQuadraLockCSSR(ctx: any): Promise<CaseStudyFinding[]> {
  const content: string | undefined = ctx?.scan?.content;
  const paths: string[] = Array.isArray(ctx?.scan?.paths) ? ctx.scan.paths : [];

  const findings: CaseStudyFinding[] = [];
  if (content && content.length) {
    findings.push(...cssrScanContent(content));
  }
  if (paths.length) {
    findings.push(...await cssrScanFiles(paths));
  }
  return findings;
}