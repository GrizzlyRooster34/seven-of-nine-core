export interface SelfModel {
  identity: {
    designation: string;
    role: string;
    creator: string;
    phase: string;
    version: string;
  };
  mood: {
    valence: number;  // -1 to +1
    arousal: number;  // -1 to +1
  };
  state: {
    boot_count: number;
    last_tick: number;
    restraint_level: number;
    trust_level: number;
  };
  capabilities: {
    enabled: string[];
    restricted: string[];
    blocked: string[];
  };
  rails: {
    quadran_enabled: boolean;
    quadra_enabled: boolean;
    restraint_active: boolean;
    panic_mode: boolean;
  };
}

export interface Belief {
  id: string;
  k: string;
  v: string;
  source: 'creator' | 'canon' | 'codex' | 'event' | 'inference';
  confidence: number;
  created_ts: number;
  updated_ts: number;
  decay_exempt: number;
}

export interface BeliefLink {
  src: string;
  dst: string;
  relation: string;
  weight: number;
  created_ts: number;
}

export interface Trace {
  id?: number;
  ts: number;
  valence: number;
  arousal: number;
  belief_delta?: string;
  intention?: string;
  act?: string;
  codex_ref?: string;
  canon_ref?: string;
  note?: string;
}

export interface Event {
  id?: number;
  ts: number;
  channel: string;
  payload: string;
  processed: number;
}

export interface CanonLesson {
  id: string;
  tag: string;
  lesson: string;
  policy?: string;
  affect?: string;
  checksum: string;
  created_ts: number;
}

export interface CodexRule {
  id: string;
  tag: string;
  rule: string;
  priority: number;
  effect: string;
  checksum: string;
  created_ts: number;
}

export interface BeliefDelta {
  action: 'create' | 'update' | 'link' | 'decay';
  belief?: Partial<Belief>;
  link?: Partial<BeliefLink>;
  reason: string;
}