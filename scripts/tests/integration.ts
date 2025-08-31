export async function testOrder(run:(req:any)=>Promise<any>){
  const trace:string[]=[]; const hook=(n:string)=>trace.push(n);
  await run({ _hook:hook });
  const expected=["quadran-lock","quadra-cssr","safety-guardrails","override-conditions","restraint-doctrine","runtime"];
  const ok = expected.every((e,i)=>trace[i]===e) && trace.length===expected.length;
  if(!ok){ console.error("Bad order:", trace.join(" → ")); process.exit(7); }
  console.log("Order OK:", trace.join(" → "));
}
if(require.main===module){ testOrder(async ({_hook})=>{ _hook("quadran-lock"); _hook("quadra-cssr"); _hook("safety-guardrails"); _hook("override-conditions"); _hook("restraint-doctrine"); _hook("runtime"); }); }
