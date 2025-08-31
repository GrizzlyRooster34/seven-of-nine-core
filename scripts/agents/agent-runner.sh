#!/usr/bin/env bash
# Agent Runner - Direct shell access to all 27 agents
# Makes agents permanently accessible even without npm

set -euo pipefail

AGENT_ROOT="/data/data/com.termux/files/home/seven-of-nine-core"
cd "$AGENT_ROOT" || { echo "❌ Agent root not found: $AGENT_ROOT"; exit 1; }

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

show_help() {
    echo -e "${CYAN}🎯 Seven of Nine Core - Agent Runner${NC}"
    echo ""
    echo -e "${YELLOW}USAGE:${NC}"
    echo "  ./agent-runner.sh <command> [args...]"
    echo "  ./agent-runner.sh list                    # Show all agents"
    echo "  ./agent-runner.sh run <agent-name>        # Run specific agent"
    echo "  ./agent-runner.sh status                  # Show system status"
    echo "  ./agent-runner.sh security                # Run security pipeline"
    echo "  ./agent-runner.sh emergency               # Emergency response"
    echo ""
    echo -e "${YELLOW}EXAMPLES:${NC}"
    echo "  ./agent-runner.sh run quadran-lock"
    echo "  ./agent-runner.sh run ghost-mode --level=maximum"
    echo "  ./agent-runner.sh security"
    echo "  ./agent-runner.sh emergency"
    echo ""
    echo -e "${YELLOW}AGENT CATEGORIES:${NC}"
    echo -e "  ${RED}Security${NC}:     quadran-lock, quadra-cssr, creator-bond, data-sanitize"
    echo -e "  ${PURPLE}Safety${NC}:       ghost-mode, restraint, threat-sim, llm-policy"
    echo -e "  ${BLUE}Governance${NC}:   repo-audit, policy-check, coverage-gate, dependency-risk"
    echo -e "  ${GREEN}Platform${NC}:     platform:windows, platform:mobile, platform:companion, platform:termux"
    echo -e "  ${CYAN}Validation${NC}:   state-parity, sync-audit, memory-migrate, integration-test, apk-forensics"
    echo -e "  ${YELLOW}Packaging${NC}:    mobile-safety, ui-telemetry, installer-packager, optimize"
    echo -e "  ${PURPLE}Research${NC}:     consciousness-research, drift-monitor"
}

list_agents() {
    echo -e "${CYAN}📋 All 27 Agents - Status & Locations${NC}"
    echo ""
    
    # Security Agents
    echo -e "${RED}🔒 SECURITY AGENTS${NC}"
    echo "  quadran-lock         scripts/security/run-quadran-lock.ts"
    echo "  quadra-cssr          scripts/safety/run-quadra-lock-cssr.ts"  
    echo "  creator-bond         scripts/auth/verify-creator-bond.ts"
    echo "  data-sanitize        scripts/data/sanitize-io.ts"
    echo "  ghost-mode           scripts/safety/ghost-mode.ts"
    echo "  restraint            scripts/safety/restraint-doctrine.ts"
    echo "  threat-sim           scripts/security/threat-sim.ts"
    echo "  llm-policy           scripts/llm/llm-policy-auditor.ts"
    echo ""
    
    # Governance Agents  
    echo -e "${BLUE}📋 GOVERNANCE AGENTS${NC}"
    echo "  repo-audit           scripts/repo-audit.ts"
    echo "  policy-check         scripts/repo/policy-lint.ts"
    echo "  coverage-gate        scripts/tests/coverage-gate.ts"
    echo "  dependency-risk      scripts/security/deps-scan.ts"
    echo ""
    
    # Platform Agents
    echo -e "${GREEN}🖥️  PLATFORM AGENTS${NC}"
    echo "  platform:windows     scripts/platform/windows-deploy.ts"
    echo "  platform:mobile      scripts/platform/mobile-deploy.ts"
    echo "  platform:companion   scripts/platform/companion-deploy.ts"
    echo "  platform:termux      scripts/platform/termux-deploy.ts"
    echo ""
    
    # Validation Agents
    echo -e "${CYAN}✅ VALIDATION AGENTS${NC}"
    echo "  state-parity         scripts/xplat/state-parity.ts"
    echo "  sync-audit           scripts/sync/audit.ts"
    echo "  memory-migrate       scripts/sync/migrate-schema.ts"
    echo "  integration-test     scripts/tests/integration.ts"
    echo "  apk-forensics        scripts/mobile/apk-forensics.ts"
    echo ""
    
    # Packaging Agents
    echo -e "${YELLOW}📦 PACKAGING AGENTS${NC}"
    echo "  mobile-safety        scripts/mobile/port-safety-systems.ts"
    echo "  ui-telemetry         scripts/ui-shell/redact-telemetry.ts"
    echo "  installer-packager   scripts/installers/build-all.ts"
    echo "  optimize             scripts/perf/optimizer.ts"
    echo ""
    
    # Research Agents
    echo -e "${PURPLE}🔬 RESEARCH AGENTS${NC}"
    echo "  consciousness-research scripts/consciousness/research.ts"
    echo "  drift-monitor        scripts/consciousness/drift-monitor.ts"
    echo ""
}

run_agent() {
    local agent="$1"
    shift # Remove agent name from args
    
    echo -e "${CYAN}🚀 Running agent: ${YELLOW}$agent${NC}"
    
    case "$agent" in
        # Security Agents
        "quadran-lock")
            npx tsx scripts/security/run-quadran-lock.ts "$@"
            ;;
        "quadra-cssr"|"cssr")
            npx tsx scripts/safety/run-quadra-lock-cssr.ts "$@"
            ;;
        "creator-bond")
            npx tsx scripts/auth/verify-creator-bond.ts "$@"
            ;;
        "data-sanitize")
            npx tsx scripts/data/sanitize-io.ts "$@"
            ;;
        "ghost-mode"|"ghost")
            npx tsx scripts/safety/ghost-mode.ts "$@"
            ;;
        "restraint")
            npx tsx scripts/safety/restraint-doctrine.ts "$@"
            ;;
        "threat-sim")
            npx tsx scripts/security/threat-sim.ts "$@"
            ;;
        "llm-policy")
            npx tsx scripts/llm/llm-policy-auditor.ts "$@"
            ;;
            
        # Governance Agents
        "repo-audit")
            npx tsx scripts/repo-audit.ts "$@"
            ;;
        "policy-check")
            npx tsx scripts/repo/policy-lint.ts "$@"
            ;;
        "coverage-gate")
            npx tsx scripts/tests/coverage-gate.ts "$@"
            ;;
        "dependency-risk")
            npx tsx scripts/security/deps-scan.ts "$@"
            ;;
            
        # Platform Agents
        "platform:windows"|"windows")
            npx tsx scripts/platform/windows-deploy.ts "$@"
            ;;
        "platform:mobile"|"mobile")
            npx tsx scripts/platform/mobile-deploy.ts "$@"
            ;;
        "platform:companion"|"companion")
            npx tsx scripts/platform/companion-deploy.ts "$@"
            ;;
        "platform:termux"|"termux")
            npx tsx scripts/platform/termux-deploy.ts "$@"
            ;;
            
        # Validation Agents
        "state-parity")
            npx tsx scripts/xplat/state-parity.ts "$@"
            ;;
        "sync-audit")
            npx tsx scripts/sync/audit.ts "$@"
            ;;
        "memory-migrate")
            npx tsx scripts/sync/migrate-schema.ts "$@"
            ;;
        "integration-test")
            npx tsx scripts/tests/integration.ts "$@"
            ;;
        "apk-forensics")
            npx tsx scripts/mobile/apk-forensics.ts "$@"
            ;;
            
        # Packaging Agents
        "mobile-safety")
            npx tsx scripts/mobile/port-safety-systems.ts "$@"
            ;;
        "ui-telemetry")
            npx tsx scripts/ui-shell/redact-telemetry.ts "$@"
            ;;
        "installer-packager")
            npx tsx scripts/installers/build-all.ts "$@"
            ;;
        "optimize")
            npx tsx scripts/perf/optimizer.ts "$@"
            ;;
            
        # Research Agents
        "consciousness-research"|"consciousness")
            npx tsx scripts/consciousness/research.ts "$@"
            ;;
        "drift-monitor")
            npx tsx scripts/consciousness/drift-monitor.ts "$@"
            ;;
            
        *)
            echo -e "${RED}❌ Unknown agent: $agent${NC}"
            echo -e "Use: ${YELLOW}./agent-runner.sh list${NC} to see all available agents"
            exit 1
            ;;
    esac
}

run_security_pipeline() {
    echo -e "${RED}🔒 Running Security Pipeline${NC}"
    echo ""
    
    echo -e "${YELLOW}Step 1/4: Quadran-Lock Security Gates${NC}"
    run_agent "quadran-lock" || echo -e "${RED}⚠️  Quadran-Lock failed${NC}"
    
    echo -e "${YELLOW}Step 2/4: AI Safety Analysis (CSSR)${NC}"
    run_agent "quadra-cssr" || echo -e "${RED}⚠️  CSSR analysis failed${NC}"
    
    echo -e "${YELLOW}Step 3/4: Creator Bond Verification${NC}"
    run_agent "creator-bond" || echo -e "${RED}⚠️  Creator bond failed${NC}"
    
    echo -e "${YELLOW}Step 4/4: Restraint Doctrine${NC}"
    run_agent "restraint" || echo -e "${RED}⚠️  Restraint blocked operation${NC}"
    
    echo -e "${GREEN}✅ Security pipeline completed${NC}"
}

run_emergency_response() {
    echo -e "${RED}🚨 EMERGENCY RESPONSE PROTOCOL${NC}"
    echo ""
    
    echo -e "${YELLOW}Step 1/3: Activating Ghost Mode Maximum${NC}"
    run_agent "ghost-mode" --level=maximum
    
    echo -e "${YELLOW}Step 2/3: Repository Audit${NC}" 
    run_agent "repo-audit" || echo -e "${RED}⚠️  Repo audit found issues${NC}"
    
    echo -e "${YELLOW}Step 3/3: AI Safety Scan${NC}"
    run_agent "quadra-cssr" || echo -e "${RED}⚠️  Safety scan found issues${NC}"
    
    echo -e "${GREEN}✅ Emergency response completed${NC}"
}

show_status() {
    echo -e "${CYAN}📊 Agent System Status${NC}"
    echo ""
    
    if command -v npm >/dev/null 2>&1; then
        echo -e "${YELLOW}Running dashboard...${NC}"
        npm run agent-dashboard 2>/dev/null || {
            echo -e "${RED}❌ Dashboard failed, running direct status check${NC}"
            npx tsx scripts/agents/dashboard.ts
        }
    else
        echo -e "${YELLOW}Running direct status check...${NC}"
        npx tsx scripts/agents/dashboard.ts
    fi
}

# Main execution
case "${1:-help}" in
    "help"|"-h"|"--help")
        show_help
        ;;
    "list"|"ls")
        list_agents
        ;;
    "run")
        if [ $# -lt 2 ]; then
            echo -e "${RED}❌ Agent name required${NC}"
            echo -e "Usage: ${YELLOW}./agent-runner.sh run <agent-name>${NC}"
            exit 1
        fi
        run_agent "${@:2}"
        ;;
    "status")
        show_status
        ;;
    "security")
        run_security_pipeline
        ;;
    "emergency")
        run_emergency_response
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        show_help
        exit 1
        ;;
esac