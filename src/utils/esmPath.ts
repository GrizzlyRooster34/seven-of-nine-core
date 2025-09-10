import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

export const fileFromMeta = (metaUrl: string) => fileURLToPath(metaUrl);
export const dirFromMeta = (metaUrl: string) => dirname(fileFromMeta(metaUrl));
export const resolveFromMeta = (metaUrl: string, ...rest: string[]) =>
  resolve(dirFromMeta(metaUrl), ...rest);