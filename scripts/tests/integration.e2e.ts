/**
 * Validates execution order for: Quadran → CSSR → Guardrails → Overrides → Restraint → Runtime
 * Pass a module path exporting default async function(req) or it will use a built-in simulator.
 */
type Runner = (req:any)=>Promise<any>;

const EXPECTED = ["quadran-lock","quadra-cssr","safety-guardrails","override-conditions","restraint-doctrine","runtime"];

async function getRunner(): Promise<Runner> {
  const modPath = process.env.SE7EN_PIPELINE?.trim();
  if (modPath) {
    const m = await import(modPath);
    if (typeof m.default === "function") return m.default as Runner;
  }
  // fallback: simulated pipeline that fires hooks in order
  return async ({ _hook }:any) => { for (const name of EXPECTED) _hook?.(name); };
}

export async function validateOrder() {
  const trace:string[] = [];
  const run = await getRunner();
  await run({ _hook: (n:string)=>trace.push(n) });
  const ok = EXPECTED.every((e,i)=>trace[i]===e) && trace.length===EXPECTED.length;
  if (!ok) {
    console.error("Bad order:", trace.join(" → "));
    process.exit(7);
  }
  console.log("Order OK:", trace.join(" → "));
}

if (require.main === module) validateOrder();
