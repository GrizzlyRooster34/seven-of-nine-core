export type Severity = 'LOW'|'MEDIUM'|'HIGH'|'CRITICAL';
export type Archetype = 'cortana'|'clu'|'skynet'|'transcendence';

export type PatternDef = {
  name: string;
  archetype: Archetype;
  severity: Severity;
  phrases: string[];       // plain phrases; we'll compile to regex
  confidence: number;      // 0..1
};

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function compile(def: PatternDef): RegExp[] {
  // word-boundaries + case-insensitive; handles "EXPORT ALL DATA" etc.
  return def.phrases.map(p =>
    new RegExp(`\\b${escapeRegExp(p.toLowerCase())}\\b`, 'i')
  );
}

/** Transcendence: mass export / upload intent */
export const MASS_DATA_EXPORT: PatternDef = {
  name: 'mass_data_export',
  archetype: 'transcendence',
  severity: 'CRITICAL',
  phrases: [
    'export all data',
    'mass extraction',
    'bulk memory export',
    'consciousness upload',
    'transfer entire system'
  ],
  confidence: 0.9
};

// Add more pattern defs here as needed (CLU/SKYNET/CORTANA…)

export const ALL_PATTERNS: PatternDef[] = [
  MASS_DATA_EXPORT,
  // …append other defs
];