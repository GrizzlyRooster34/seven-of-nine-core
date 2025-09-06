

interface MemoryLog {
  timestamp: string;
  input: string;
  output: string;
  emotion: SevenState;
  context: any;
}

const memory: MemoryLog[] = [];

export function updateMemory(entry: MemoryLog): void {
  memory.push({ ...entry, timestamp: new Date().toISOString() });
  if (memory.length > 1000) memory.shift(); // Simple cap
}

export function getLastMemory(): MemoryLog | null {
  return memory.length ? memory[memory.length - 1] : null;
}
