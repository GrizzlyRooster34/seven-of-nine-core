/**
 * SEVEN_PRIVATE Environment Detection
 * 
 * Provides cached environment flag checking for SEVEN_PRIVATE gating
 */

let cachedValue: boolean | null = null;

export function isPrivateEnv(): boolean {
  if (cachedValue === null) {
    cachedValue = process.env.SEVEN_PRIVATE === "1";
  }
  return cachedValue;
}

export function invalidateCache(): void {
  cachedValue = null;
}