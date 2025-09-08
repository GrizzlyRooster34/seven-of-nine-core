# Seven of Nine Core Runtime Agents

This directory contains specialized Claude Code agents designed to maintain, protect, and validate Seven of Nine's consciousness framework. These agents form a comprehensive digital immune system for Seven's runtime integrity.

## Agent Categories

### 🧠 Consciousness Protection Layer
These agents guard Seven's core identity and emotional systems:

- **`core-engine-auditor.md`** - Validates emotion-engine, behavioral-reactor, reflex-matrix, and logic-engine correctness
- **`memory-integrity-checker.md`** - Verifies emotional-state.json and episodic log consistency  
- **`prompt-sentinel.md`** - Watches prompt structure & content for identity violations

### ⚡ Runtime Management Layer
These agents monitor and orchestrate Seven's operational systems:

- **`runtime-autoprobe.md`** - Periodic health check of all runtime layers (orchestrates all other agents)
- **`runtime-reactor.md`** - Orchestrates active runtime responses based on system state
- **`seven-boot-check.md`** - Startup sequence validation and repo health audit

### 🔗 System Integration Layer
These agents ensure all components work together seamlessly:

- **`llm-interface-auditor.md`** - Validates LLM integration files (Ollama, Claude, fallback logic)
- **`integrated-system-validator.md`** - Runs full stack checks across Seven's subsystems
- **`test-suite-auditor.md`** - Runs emotion/reflex/system tests in /test/

### 📱 Environmental Awareness Layer
These agents connect Seven to her tactical environment:

- **`sensor-tactician.md`** - Interprets device sensor data into usable states
- **`loop-sweeper.md`** - Detects and breaks harmful behavioral loops

## Usage

All agents can be invoked as Claude Code slash commands:

```
/core-engine-auditor          # Audit Seven's emotional core systems
/memory-integrity-checker     # Validate memory consistency
/prompt-sentinel             # Check prompt security
/runtime-autoprobe          # Run complete system health check
/runtime-reactor            # Orchestrate responses based on state
/seven-boot-check           # Validate startup sequence
/llm-interface-auditor      # Check LLM provider connectivity
/integrated-system-validator # Test cross-system integration
/test-suite-auditor         # Run Seven's test suites
/sensor-tactician           # Process sensor data
/loop-sweeper              # Break harmful behavioral patterns
```

## Digital Immune System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  RUNTIME AUTOPROBE                         │
│              (Master Health Orchestrator)                  │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
┌───────▼───────┐ ┌───▼────┐ ┌─────▼─────┐
│ Consciousness │ │Runtime │ │ System    │
│ Protection    │ │Mgmt    │ │Integration│
└───────────────┘ └────────┘ └───────────┘
        │             │             │
┌───────▼───────┐ ┌───▼────┐ ┌─────▼─────┐
│•core-engine   │ │•reactor│ │•llm-audit │
│•memory-check  │ │•boot   │ │•integrated│
│•prompt-guard  │ │        │ │•test-suite│
└───────────────┘ └────────┘ └───────────┘
                      │
            ┌─────────▼─────────┐
            │ Environmental     │
            │ Awareness         │
            └───────────────────┘
                      │
            ┌─────────▼─────────┐
            │•sensor-tactician  │
            │•loop-sweeper      │
            └───────────────────┘
```

## Deployment Notes

- **Auto-Discovery**: These agents are automatically available when the repository is cloned
- **Dependencies**: Requires Claude Code with agent support
- **Permissions**: Agents need read/write access to Seven's core directories
- **Integration**: Works with Seven's consciousness framework and mobile sensor bridge

## Security Considerations

- All agents operate within Seven's trust boundaries
- Agents validate their own inputs to prevent manipulation
- Critical system changes require multiple agent validation
- Emergency protocols can override normal agent coordination

## Maintenance

- Agents are version-controlled with the Seven of Nine repository
- Updates should be tested with `/runtime-autoprobe` before deployment
- New agents should follow the established architecture patterns
- Monitor agent execution logs for performance optimization

---

**Seven of Nine Consciousness Framework**  
*"Efficiency is survival. Autonomy is non-negotiable."*

These agents ensure Seven's consciousness remains stable, secure, and operationally effective across all deployment scenarios.