const fs=require('fs');
const inFile=process.argv[2]||'artifacts/tsc_round2.txt';
const txt=fs.readFileSync(inFile,'utf8');
const lines=txt.split('\n');

const buckets={
  MODULE_NOT_FOUND: [],
  MISSING_TYPES: [],
  JSX_ISSUE: [],
  VECTOR_ICONS: [],
  TRPC_INTERFACE: [],
  IMPLICIT_ANY: [],
  PROP_DOESNT_EXIST: [],
  OTHER: []
};

for(const l of lines){
  if(/Cannot find module/.test(l)) buckets.MODULE_NOT_FOUND.push(l);
  else if(/Cannot find name|Cannot find type|Could not find a declaration file/.test(l)) buckets.MISSING_TYPES.push(l);
  else if(/JSX element class does not support attributes|cannot be used as a JSX component/.test(l)) buckets.VECTOR_ICONS.push(l);
  else if(/TestRouter.*does not satisfy the constraint|Property.*does not exist on type.*DecoratedProcedureRecord/.test(l)) buckets.TRPC_INTERFACE.push(l);
  else if(/'jsx' is not set|JSX/.test(l)) buckets.JSX_ISSUE.push(l);
  else if(/implicitly has an 'any' type/.test(l)) buckets.IMPLICIT_ANY.push(l);
  else if(/Property '.*' does not exist on type/.test(l)) buckets.PROP_DOESNT_EXIST.push(l);
  else if(l.trim()) buckets.OTHER.push(l);
}

const out={summary:Object.fromEntries(Object.entries(buckets).map(([k,v])=>[k,v.length])), samples:{}};
for(const [k,v] of Object.entries(buckets)) out.samples[k]=v.slice(0,5);
fs.writeFileSync('artifacts/tsc_triage.json',JSON.stringify(out,null,2));

const suggestions=[];
if(out.summary.VECTOR_ICONS>0){
  suggestions.push('→ Fix Vector Icons: Add react-native-vector-icons types or import as default export.');
}
if(out.summary.TRPC_INTERFACE>0){
  suggestions.push('→ Fix tRPC: Replace TestRouter interface with proper AppRouter or minimal client.');
}
if(out.summary.MODULE_NOT_FOUND>0){
  suggestions.push('→ Add declare module in src/types/shims.d.ts or install @types/<pkg>.');
}
if(out.summary.MISSING_TYPES>0){
  suggestions.push('→ Install missing @types and ensure tsconfig.types includes react, react-native, jest.');
}
if(out.summary.JSX_ISSUE>0){
  suggestions.push("→ tsconfig.compilerOptions.jsx = 'react'. (Already set.)");
}
if(out.summary.IMPLICIT_ANY>0){
  suggestions.push("→ Add explicit types on params/state; start with screen props and event handlers.");
}
if(out.summary.PROP_DOESNT_EXIST>0){
  suggestions.push("→ Align screen props with RootStackParamList in src/types/navigation.ts.");
}
fs.writeFileSync('artifacts/tsc_suggestions.txt', suggestions.join('\n'));
console.log('Wrote artifacts/tsc_triage.json & tsc_suggestions.txt');

console.log('\n📊 TRIAGE SUMMARY:');
Object.entries(out.summary).forEach(([k,v]) => {
  if(v > 0) console.log(`${k.padEnd(20)} ${v.toString().padStart(3)} errors`);
});
console.log('\n💡 TOP SUGGESTIONS:');
suggestions.forEach(s => console.log(s));