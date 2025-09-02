# Dumb Ass Protocol Audit Trail

This directory contains logs of Claude Code violations of the authoritative Quadran-Lock naming convention.

## Purpose
When Claude Code reverts to the forbidden `quadran-lock` token (no hyphen), the Dumb Ass Protocol is triggered and violations are logged here for audit purposes.

## Log Format
Each violation creates a timestamped log file with:
- Timestamp of violation
- Files containing banned tokens
- Specific violations detected
- Remediation actions taken

## Enforcement
- Any use of `quadran-lock` (no hyphen) triggers this protocol
- Claude Code will be flagged as "DUMB ASS" until corrected
- Build and CI will fail until violations are resolved

## Authoritative Reference
- **Quadran-Lock** = Security Protocols (Q1-Q4)
- **Quadra-Lock** = CSSR Safety Rails
- **quadran-lock** = FORBIDDEN FOREVER