# Claude Code Instance Identity

## Device Information
- **Device**: [DEVICE_MODEL] (e.g., OnePlus 9 Pro, ThinkPad X1, Framework Laptop)
- **OS**: [OPERATING_SYSTEM] (e.g., OxygenOS, Windows 11, Ubuntu 22.04)
- **Terminal**: [TERMINAL_ENV] (e.g., Termux, PowerShell, bash, zsh)
- **Branch**: `claude-instance-[device]-[os]-[terminal]`

## Instance Configuration
- **Claude Code Model**: Sonnet 4
- **Platform**: [PLATFORM] (Android, Windows, Linux)
- **Working Directory**: [HOME_PATH]
- **Seven Core Path**: [SEVEN_CORE_PATH] (if applicable)

## Environment Specs
- **Shell**: [SHELL] (bash, zsh, powershell, fish)
- **Node.js**: [STATUS/VERSION]
- **Git**: [STATUS/VERSION]
- **Python**: [STATUS/VERSION]

## Synchronization Protocol
- **Primary Branch**: `master` (shared configurations)
- **Instance Branch**: `claude-instance-[device]-[os]-[terminal]` (device-specific)
- **Sync Method**: Git-based with automated sync
- **Conflict Resolution**: [Device priority or Master authority]

## Instance Status
- **Created**: [DATE]
- **Status**: [Active/Standby/Master/Secondary]
- **Priority**: [NUMBER] ([Role description])
- **Dumbass Protocol**: Enforced
- **Agent Mesh**: 39 agents deployed and operational

## Device-Specific Notes
[Hardware specs, OS features, development environment capabilities, special considerations]

## Master Instance Responsibilities (if applicable)
[Only include if this is a master instance]
- Approve/reject category-specific configuration changes
- Resolve device sync conflicts within category
- Optimize platform-specific Claude Code performance
- Maintain category agent configurations

---

**Instance Identifier**: `claude-[device]-[terminal]-[sequence/role]`  
**Authority Level**: [MASTER/SECONDARY/STANDARD]  
**Last Sync**: [TIMESTAMP]  
**Next Sync**: Automated via [statusline/profile]

---

## 📋 SETUP CHECKLIST

- [ ] Updated device information above
- [ ] Created instance branch: `claude-instance-[device]-[os]-[terminal]`
- [ ] Copied appropriate sync script template
- [ ] Read OPERATIONAL_BRIEFING.md (mandatory)
- [ ] Read CLAUDE.md (mandatory - contains Dumbass Protocol)
- [ ] Read HOMEWORK_CLAUDE.md (current disciplinary status)
- [ ] Installed configurations via `./install-configs.sh`
- [ ] Tested agent mesh functionality
- [ ] Committed initial instance setup
- [ ] Pushed instance branch to origin