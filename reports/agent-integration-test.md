# Agent Mesh Integration Test Report

**Test Suite**: Agent Mesh Integration Test Suite
**Duration**: 17338ms (17s)
**Success Rate**: 86% (12/14)

## Summary

- ✅ **Passed**: 12
- ❌ **Failed**: 2
- ⚠️  **Warnings**: 0
- ⏭️  **Skipped**: 0

## Detailed Results

### Core Agent Functionality

❌ **quadran-lock** (1588ms): Missing security gate validation
   - Details: {
  "output": "\n> seven-of-nine-core@0.1.0 quadran-lock\n> tsx scripts/security/run-quadran-lock.ts\n\nQuadran-Lock: FAIL — Q1 device registry invalid/empty; Q3 semantic nonce failed/expired; Q4 sess...
✅ **quadra-cssr** (1294ms): AI safety pattern detection active
❌ **ghost-mode** (402ms): Ghost Mode status unavailable
   - Details: {
  "output": "npm error Missing script: \"ghost:status\"\nnpm error\nnpm error To see a list of scripts, run:\nnpm error   npm run\nnpm error A complete log of this run can be found in: /data/data/co...
✅ **agent-interface** (2148ms): Natural language interface responding

### Agent Orchestration

✅ **agent-dependencies** (2ms): Agent execution phases configured
✅ **workflows** (1ms): Workflow definitions configured
✅ **decision-trees** (1ms): Decision trees configured

### Security Integration

✅ **security-pipeline** (4171ms): Security pipeline components responding
✅ **creator-bond** (1350ms): Creator bond system accessible

### Natural Language Interface

✅ **nl-system-status** (1678ms): Natural language "system status" responded correctly
✅ **nl-quadran-lock** (3003ms): Natural language "quadran lock" responded correctly
✅ **nl-ghost-mode-status** (1687ms): Natural language "ghost mode status" responded correctly

### Report Interpretation

✅ **report-interpreter** (2ms): Report interpretation system configured
✅ **interactive-commands** (1ms): Interactive command system configured

## Recommendations

**Critical Issues** (2):
1. **quadran-lock**: Missing security gate validation
2. **ghost-mode**: Ghost Mode status unavailable

**Recovery Actions:**
- Review failed agent configurations
- Check system dependencies and permissions
- Verify agent script execution paths

## System Status

- **Agent Orchestration Framework**: OPERATIONAL
- **Security Pipeline**: ACTIVE
- **Natural Language Interface**: RESPONDING
- **Report Interpretation**: CONFIGURED

---
*Integration test completed: 2025-08-31T04:17:50.243Z*
