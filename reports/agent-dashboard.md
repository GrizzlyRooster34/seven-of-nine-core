# Agent Mesh Status Dashboard

**Generated**: 2025-08-30T23:15:41.371Z
**System Health**: 🔴 CRITICAL
**Security Score**: 0/10
**Agents Operational**: 1/27

## 🎯 System Status Overview

| Metric | Value | Status |
|--------|-------|--------|
| Overall Health | CRITICAL | 🔴 |
| Security Score | 0/10 | ⚠️ |
| Agents Operational | 1/27 | ⚠️ |
| Ghost Mode | Inactive | 🟢 |
| Critical Issues | 11 | 🚨 |
| Warnings | 5 | ⚠️ |

### 🔒 Security Agents

🔴 **quadran-lock** 🔴
   - Status: ERROR
   - Health: CRITICAL
   - Duration: 1346ms
   - Message: Error detected (1346ms)
   - Success Rate: 15%

🔴 **creator-bond** 🔴
   - Status: ERROR
   - Health: CRITICAL
   - Duration: 1377ms
   - Message: Error detected (1377ms)
   - Success Rate: 15%

🔴 **data-sanitize** 🔴
   - Status: ERROR
   - Health: CRITICAL
   - Duration: 1679ms
   - Message: Error detected (1679ms)
   - Success Rate: 15%

🔵 **llm-policy** 🟢
   - Status: UNKNOWN
   - Health: GOOD
   - Duration: 1633ms
   - Message: Status unclear (1633ms)
   - Success Rate: 80%

### 🛡️ Safety Agents

🔴 **quadra-cssr** 🔴
   - Status: ERROR
   - Health: CRITICAL
   - Duration: 1379ms
   - Message: Error detected (1379ms)
   - Success Rate: 15%

🔴 **restraint** 🔴
   - Status: ERROR
   - Health: CRITICAL
   - Duration: 1706ms
   - Message: Error detected (1706ms)
   - Success Rate: 15%

🔴 **ghost-mode** 🔴
   - Status: ERROR
   - Health: CRITICAL
   - Duration: 436ms
   - Message: Error detected (436ms)
   - Success Rate: 15%

🔵 **threat-sim** 🟢
   - Status: UNKNOWN
   - Health: GOOD
   - Duration: 1680ms
   - Message: Status unclear (1680ms)
   - Success Rate: 80%

### 📋 Governance Agents

🔴 **repo-audit** 🔴
   - Status: ERROR
   - Health: CRITICAL
   - Duration: 3637ms
   - Message: Error detected (3637ms)
   - Success Rate: 15%

🔵 **policy-check** 🟢
   - Status: UNKNOWN
   - Health: GOOD
   - Duration: 1522ms
   - Message: Status unclear (1522ms)
   - Success Rate: 80%

🔵 **coverage-gate** 🟢
   - Status: UNKNOWN
   - Health: GOOD
   - Duration: 1669ms
   - Message: Status unclear (1669ms)
   - Success Rate: 80%

🔵 **dependency-risk** 🟢
   - Status: UNKNOWN
   - Health: GOOD
   - Duration: 1677ms
   - Message: Status unclear (1677ms)
   - Success Rate: 80%

### 🖥️ Platform Agents

🟡 **platform:windows** 🟡
   - Status: DEGRADED
   - Health: FAIR
   - Duration: 3335ms
   - Message: Functional with issues (3335ms)
   - Success Rate: 70%

🟡 **platform:mobile** 🟡
   - Status: DEGRADED
   - Health: FAIR
   - Duration: 2787ms
   - Message: Functional with issues (2787ms)
   - Success Rate: 70%

🟡 **platform:companion** 🟡
   - Status: DEGRADED
   - Health: FAIR
   - Duration: 2876ms
   - Message: Functional with issues (2876ms)
   - Success Rate: 70%

🟡 **platform:termux** 🟡
   - Status: DEGRADED
   - Health: FAIR
   - Duration: 2957ms
   - Message: Functional with issues (2957ms)
   - Success Rate: 70%

### ✅ Validation Agents

🔵 **state-parity** 🟢
   - Status: UNKNOWN
   - Health: GOOD
   - Duration: 1519ms
   - Message: Status unclear (1519ms)
   - Success Rate: 80%

🔵 **sync-audit** 🟢
   - Status: UNKNOWN
   - Health: GOOD
   - Duration: 1689ms
   - Message: Status unclear (1689ms)
   - Success Rate: 80%

🔵 **memory-migrate** 🟢
   - Status: UNKNOWN
   - Health: GOOD
   - Duration: 1659ms
   - Message: Status unclear (1659ms)
   - Success Rate: 80%

🔴 **integration-test** 🔴
   - Status: ERROR
   - Health: CRITICAL
   - Duration: 395ms
   - Message: Error detected (395ms)
   - Success Rate: 15%

🟢 **apk-forensics** 🔴
   - Status: OPERATIONAL
   - Health: CRITICAL
   - Duration: 1364ms
   - Message: Active and responding (1364ms)
   - Success Rate: 15%

### 📦 Packaging Agents

🟡 **mobile-safety** 🔴
   - Status: DEGRADED
   - Health: CRITICAL
   - Duration: 1372ms
   - Message: Functional with issues (1372ms)
   - Success Rate: 15%

🔵 **ui-telemetry** 🟢
   - Status: UNKNOWN
   - Health: GOOD
   - Duration: 1647ms
   - Message: Status unclear (1647ms)
   - Success Rate: 80%

🔵 **installer-packager** 🟢
   - Status: UNKNOWN
   - Health: GOOD
   - Duration: 1659ms
   - Message: Status unclear (1659ms)
   - Success Rate: 80%

🔵 **optimize** 🟢
   - Status: UNKNOWN
   - Health: GOOD
   - Duration: 1716ms
   - Message: Status unclear (1716ms)
   - Success Rate: 80%

### 🔬 Research Agents

🔴 **consciousness-research** 🔴
   - Status: ERROR
   - Health: CRITICAL
   - Duration: 416ms
   - Message: Error detected (416ms)
   - Success Rate: 15%

🔵 **drift-monitor** 🟢
   - Status: UNKNOWN
   - Health: GOOD
   - Duration: 1683ms
   - Message: Status unclear (1683ms)
   - Success Rate: 80%

## 📋 Recent Events

- Dashboard generated: 2025-08-30T23:15:41.369Z
- Recent report: MOBILE_SAFETY_PARITY.md
- Recent report: CSSR_SUMMARY.md
- Recent report: QUADRAN_SUMMARY.md
- Recent report: agent-dashboard.json
- Recent report: agent-dashboard.md

## 💡 Recommendations

- 🔒 SECURITY: Run security validation pipeline (npm run quadran-lock && npm run quadra-cssr)
- 🚨 CRITICAL: Fix 11 critical agent issues: quadran-lock, quadra-cssr, restraint, creator-bond, data-sanitize, ghost-mode, repo-audit, integration-test, apk-forensics, mobile-safety, consciousness-research
- ⚡ PERFORMANCE: Less than 80% agents operational - run integration tests
- 📱 PLATFORMS: 4 platform agents need attention

## ⚡ Quick Actions

```bash
# Run full system health check
npm run agent -- run "system health"

# Security validation pipeline
npm run quadran-lock && npm run quadra-cssr

# Integration tests
npx tsx scripts/agents/integration-test.ts

# Ghost Mode status
npm run ghost:status
```

---
*Dashboard generated by Agent Mesh Status Monitor*
