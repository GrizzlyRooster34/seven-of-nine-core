# ARCH_GUARDRAILS (Seven-of-Nine-Core)

## DO-NOT-EDIT (LLMs/agents refuse unless explicitly authorized)
security/quadra-lock/**
safeguards/restraint-doctrine/**
memory/**

## HIGH-REVIEW (changes allowed only with “HIGH-REVIEW: APPROVED” in the prompt)
runtime/decision-matrix/**
agents/**
creator-bond/**

## POLICY
- Minimal surface area; preserve public APIs; diff-only unless full file requested
- No dependency upgrades or new network calls without explicit approval
- Commands: test = `pnpm test` · build = `pnpm build` · lint = `pnpm lint`
