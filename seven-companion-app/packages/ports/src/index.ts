/**
 * SEVEN COMPANION - INTERNAL PORTS LAYER
 * Stable interfaces to protect app from Seven Core evolution
 */

export interface Capability {
  name: string;
  version: string;
  stable: boolean;
}

export interface CorePlatform {
  version: string;
  capabilities(): Promise<Capability[]>;
  exec(intent: string, input: unknown): Promise<unknown>;
  on(event: string, fn: (payload: unknown) => void): () => void;
}

export interface SecureStore {
  get(k: string): Promise<string | null>;
  set(k: string, v: string): Promise<void>;
  del(k: string): Promise<void>;
}

export interface FileSystem {
  read(p: string): Promise<string>;
  write(p: string, data: string): Promise<void>;
  exists(p: string): Promise<boolean>;
  mkdir(p: string): Promise<void>;
  readdir(p: string): Promise<string[]>;
}

export interface Notifier {
  toast(msg: string): Promise<void>;
  notify(title: string, body: string): Promise<void>;
}

export interface SevenPorts {
  core: CorePlatform;
  secureStore: SecureStore;
  fs: FileSystem;
  notifier: Notifier;
}

// Platform capability constants for negotiation
export const REQUIRED_CAPABILITIES = [
  'memory.v2',
  'mtte.v1', 
  'policy.hash',
  'quadran.auth'
] as const;

export const OPTIONAL_CAPABILITIES = [
  'memory.v3',
  'personality.phases',
  'sovereignty.framework'
] as const;

// Safety modes
export type SafetyMode = 'ACTIVE' | 'SAFE_MODE' | 'READONLY_MODE' | 'OBSERVE_ONLY';

export interface SafetyConfig {
  mode: SafetyMode;
  allowedOperations: string[];
  policyHashAllowlist: string[];
  fallbackUI: boolean;
}