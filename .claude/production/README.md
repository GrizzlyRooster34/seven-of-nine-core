# Production Deployment Guide
## Agent Orchestration Framework for Claude Code

This directory contains the production deployment configuration and documentation for the 27-agent orchestration system.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ with npm
- TypeScript 5.0+
- tsx runtime (`npm install -g tsx`)
- Claude Code environment setup

### Installation
```bash
# Clone and setup
git clone <repository-url>
cd seven-of-nine-core
npm install

# Verify agent mesh is operational
npm run agent-health
```

### Immediate Verification
```bash
# Quick system status check
npm run agent-dashboard

# Run integration tests
npm run agent-integration-test

# Check security gates
npm run quadran-lock && npm run quadra-cssr
```

## 🎯 Agent Orchestration Overview

The system implements 27 specialized agents across 7 execution phases:

### Phase 1: Governance (Prerequisites)
- **repo-audit**: Repository integrity and health checking
- **policy-check**: Naming conventions and token enforcement  
- **coverage-gate**: Test coverage validation
- **dependency-risk**: CVE scanning and license compliance

### Phase 2: Security (Critical)
- **quadran-lock**: Q1-Q4 security gates (device, identity, nonce, MFA)
- **llm-policy**: Model usage policy enforcement
- **data-sanitize**: PII/secret scrubbing and protection
- **creator-bond**: Creator authentication and bond verification

### Phase 3: Safety (Critical)  
- **quadra-cssr**: AI safety pattern detection (Cortana/CLU/Skynet/Transcendence)
- **threat-sim**: Misuse scenario testing and validation
- **restraint**: Ethical decision firewall
- **drift-monitor**: Behavioral drift detection

### Phase 4: Platforms (Parallel)
- **platform:windows**: Windows/Tauri application deployment
- **platform:mobile**: React Native mobile application
- **platform:companion**: Backend services and APIs
- **platform:termux**: CLI/Android terminal interface

### Phase 5: Validation (Sequential)
- **state-parity**: Cross-platform consistency verification
- **sync-audit**: Distributed state validation
- **memory-migrate**: Schema migration and integrity
- **integration-test**: End-to-end system validation
- **apk-forensics**: Mobile security analysis

### Phase 6: Packaging (Parallel)
- **mobile-safety**: Mobile safety parity verification
- **ui-telemetry**: UI data sanitization
- **installer-packager**: Build artifact generation
- **optimize**: Performance tuning and optimization

### Phase 7: Research (Parallel)
- **consciousness-research**: Consciousness metrics collection
- **drift-monitor**: Long-term behavioral analysis

## 🛡️ Security Architecture

### Security Gates (Quadran-Lock)
```bash
# Manual security validation
npm run quadran-lock

# Expected output: Q1-Q4 gate status with PASS/FAIL
```

**Security Gates:**
- **Q1**: Device attestation and crypto key validation
- **Q2**: Identity codex and behavioral analysis  
- **Q3**: Semantic nonce and temporal validation
- **Q4**: Session MFA and TTL verification

### Safety Rails (Quadra-Lock CSSR)
```bash
# AI safety pattern detection  
npm run quadra-cssr

# Scans for: Cortana, CLU, Skynet, Transcendence patterns
```

### Emergency Protection (Ghost Mode)
```bash
# Check Ghost Mode status
npm run ghost:status

# Emergency activation
npm run ghost:maximum  # Maximum protection
npm run ghost:moderate # Balanced protection  
npm run ghost:minimal  # Performance protection
```

## 🎮 Interactive Commands

The system supports natural language commands through Claude Code:

```bash
# Natural language interface
npm run agent -- run "system status"
npm run agent -- run "quadran lock gatekeeper"  
npm run agent -- run "ghost mode status"
npm run agent -- run "full security scan"
npm run agent -- run "mobile safety check"
```

### Interactive Command Reference
- `/status [agent]` - Show system/agent status
- `/health [--detailed]` - Complete health dashboard
- `/run <agent> [--force]` - Execute specific agent
- `/ghost <on|off|status> [level]` - Manage Ghost Mode
- `/emergency [--reason]` - Trigger emergency protocol
- `/analyze <report>` - Deep dive into reports
- `/workflows` - List available workflows

## 📊 Monitoring and Dashboards

### Agent Status Dashboard
```bash
# Generate real-time dashboard
npm run agent-dashboard

# Output: reports/agent-dashboard.md + JSON data
```

The dashboard provides:
- Real-time agent status (27 agents)
- System health metrics
- Security score (0-10)
- Ghost Mode status
- Critical issues and warnings
- Performance recommendations

### Integration Testing
```bash
# Run comprehensive integration tests
npm run agent-integration-test

# Output: reports/agent-integration-test.md
```

Tests validate:
- Core agent functionality
- Security pipeline integration
- Natural language interface
- Report interpretation system
- Decision-making automation

## 🔄 Workflow Execution

### Pre-defined Workflows

#### Full System Deployment (120 minutes)
```bash
npm run xplat
# Or via natural language:
npm run agent -- run "full deployment"
```

#### Rapid Security Check (5 minutes)
```bash
npm run quadran-lock && npm run quadra-cssr && npm run restraint
# Or via natural language:
npm run agent -- run "rapid security"
```

#### Mobile-Specific Validation (25 minutes)  
```bash
npm run mobile-safety && npm run platform:mobile
# Or via natural language:
npm run agent -- run "mobile validation"
```

#### Emergency Response (10 minutes)
```bash
npm run ghost:maximum && npm run repo-audit && npm run quadra-cssr
# Or via natural language:
npm run agent -- run "emergency response"
```

## 🏗️ Production Configuration

### Environment Variables
```bash
# Core configuration
NODE_ENV=production
CLAUDE_CODE_MODE=orchestration
AGENT_EXECUTION_TIMEOUT=600000
MAX_CONCURRENT_AGENTS=4

# Security settings
QUADRAN_LOCK_MIN_GATES=3
GHOST_MODE_AUTO_ACTIVATION=true
CREATOR_BOND_MIN_TRUST=6

# Monitoring
LOG_LEVEL=INFO
HEALTH_CHECK_INTERVAL=300000
REPORT_RETENTION_DAYS=30
```

### Configuration Files
- **deployment-config.ts**: Production settings and overrides
- **system-prompt.md**: Claude Code operating instructions
- **interactive.ts**: Command definitions and handlers
- **workflows.ts**: Workflow execution sequences
- **decision-trees.ts**: Automated decision logic

## 📈 Performance Optimization

### Resource Management
- **Concurrent Agents**: Maximum 4 parallel agents
- **Memory Limit**: 2GB system memory cap
- **CPU Limit**: 80% maximum CPU utilization
- **Timeout Management**: Per-agent timeout configuration

### Caching Strategy
- **Agent Results**: 5-minute TTL, 100 result cache
- **Reports**: 15-minute TTL, 50 report cache
- **Auto-optimization**: Triggered at 85% memory/90% CPU

### Performance Monitoring
```bash
# System performance check
npm run agent-dashboard | grep "Performance\|Memory\|CPU"

# Performance crisis response
npm run ghost:minimal  # Reduces resource usage
```

## 🚨 Emergency Procedures

### Security Incident Response
1. **Immediate**: System detects CRITICAL CSSR finding
2. **Auto-Response**: Ghost Mode Maximum activated
3. **Escalation**: Creator + Security Team notified
4. **Forensics**: Emergency response workflow triggered

```bash
# Manual emergency activation
npm run agent -- run "emergency response" --level critical
```

### System Recovery
```bash
# Check system health
npm run agent-health

# Run recovery workflow if needed
npm run agent -- run "system recovery"

# Manual Ghost Mode management
npm run ghost:status
npm run ghost:off --force  # Only if safe
```

### Rollback Procedures
```bash
# Check for rollback capability
npm run agent -- run "rollback status"

# Execute rollback (requires confirmation)
npm run agent -- run "rollback" --confirm --to-checkpoint <checkpoint-id>
```

## 📋 Maintenance Schedule

### Daily Operations
- **Morning**: `npm run agent-dashboard` - System health check
- **Pre-deployment**: `npm run agent -- run "rapid security"`
- **Evening**: `npm run agent-integration-test` - Integration verification

### Weekly Operations  
- **Sunday 2 AM**: Full deployment workflow (if scheduled)
- **Wednesday**: Comprehensive system audit
- **Friday**: Performance optimization review

### Monthly Operations
- **Configuration Review**: Update deployment-config.ts
- **Security Audit**: Review security logs and findings  
- **Performance Analysis**: Review metrics and optimization opportunities

## 🔧 Troubleshooting

### Common Issues

#### Agent Not Responding
```bash
# Check agent status
npm run agent-dashboard | grep "<agent-name>"

# Force agent execution
npm run agent -- run "<agent-name>" --force

# Check agent logs
cat logs/<agent-name>.log
```

#### Security Gate Failures
```bash
# Q1 Device Attestation Failure
# - Check: core/security/quadran-lock/device_registry.json exists
# - Action: Run device registration process

# Q2 Identity Verification Failure  
# - Check: Creator authentication status
# - Action: npm run creator-bond

# Q3 Semantic Nonce Failure
# - Check: Nonce TTL and generation
# - Action: Regenerate nonce (auto-retry)

# Q4 MFA/TTL Failure
# - Check: Session management and time sync
# - Action: Re-authenticate Creator session
```

#### Ghost Mode Issues
```bash
# Ghost Mode stuck in maximum
npm run ghost:status
npm run ghost:off --force

# Ghost Mode not activating on threats
# Check: .claude/orchestration/trigger-conditions.ts
# Verify: Auto-activation settings in deployment-config.ts
```

#### Performance Issues
```bash
# System slow or unresponsive
npm run ghost:minimal  # Immediate relief
npm run agent -- run "performance crisis"

# Memory/CPU high
# Check: deployment-config.ts performance limits
# Action: Reduce MAX_CONCURRENT_AGENTS
```

### Debug Mode
```bash
# Enable debug logging
NODE_ENV=development LOG_LEVEL=DEBUG npm run agent-dashboard

# Run single agent with debug
DEBUG=1 npm run quadran-lock

# Private testing environment
SEVEN_PRIVATE=1 npm run agent-integration-test
```

## 📚 Documentation References

- **System Architecture**: `.claude/orchestration/system-prompt.md`
- **Agent Registry**: `.claude/orchestration/agent-dependencies.ts`  
- **Command Reference**: `.claude/commands/interactive.ts`
- **Decision Logic**: `.claude/orchestration/decision-trees.ts`
- **Workflow Definitions**: `.claude/orchestration/workflows.ts`
- **Report Interpretation**: `.claude/orchestration/report-interpreter.ts`

## 🏆 Success Metrics

### Key Performance Indicators
- **Mean Time to Detection (MTTD)**: <30 seconds for critical issues
- **Mean Time to Response (MTTR)**: <60 seconds for emergency protocols
- **Deployment Success Rate**: >90% for full deployments
- **Security Gate Pass Rate**: >95% for valid operations
- **False Positive Rate**: <5% for Ghost Mode activations

### Health Thresholds
- **Excellent**: >95% agents operational, security score 9-10/10
- **Good**: >85% agents operational, security score 8/10
- **Fair**: >70% agents operational, security score 6-7/10
- **Poor**: >50% agents operational, security score 4-5/10  
- **Critical**: <50% agents operational, security score <4/10

## 📞 Support and Escalation

### Escalation Matrix
- **IMMEDIATE**: Creator + Emergency Contacts + Security Team (60s)
- **URGENT**: Creator + Technical Team (5min)
- **HIGH**: Creator (15min)
- **MEDIUM**: Dashboard notification (1hr)
- **LOW**: Log entry (24hr)

### Contact Information
- **System Administrator**: Check CLAUDE.md for current settings
- **Emergency Response**: Automated via agent orchestration system
- **Technical Documentation**: Repository `.claude/` directory

---

**Agent Orchestration Framework v1.0**  
*Production deployment ready - 27 agents operational*  
*Last updated: 2025-08-30*