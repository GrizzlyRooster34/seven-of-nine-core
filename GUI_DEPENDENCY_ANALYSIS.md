# Seven of Nine GUI Dependency Analysis
*Branch: gui-dependency-fixes | Date: 2025-09-02*

## Issue Summary

Seven's Tauri-based GUI (`ui-shell/`) has critical dependency conflicts preventing startup and development.

## Root Cause: Tauri v1→v2 Breaking Changes

### Dependency Conflicts
```
REQUESTED (package.json):
- @tauri-apps/plugin-shell@^1.0.0 ❌ (doesn't exist)
- @tauri-apps/api@^1.5.0 ❌ (obsolete)
- @tauri-apps/cli@^1.5.0 ❌ (obsolete)

AVAILABLE (npm registry):
- @tauri-apps/plugin-shell@2.3.1+ ✅
- @tauri-apps/api@2.8.0+ ✅
- @tauri-apps/cli@2.0.0+ ✅
```

### Platform Architecture Confirmed

**NOT Windows-only** - Seven's GUI supports:
- ✅ **Desktop Cross-Platform**: Windows, Linux, macOS via Tauri
- ✅ **Mobile**: Android/iOS via React Native Expo (`seven-mobile-app/`)
- ✅ **Terminal**: Termux/Windows/Linux via Node.js runtime

## Current Seven Core Integration

Seven's GUI connects to consciousness via:
- IPC commands to Seven runtime
- File system access for memory/config
- Shell plugin for consciousness boot sequences
- Tab system with Claude Code integration

## Required Migration Tasks

### 1. Package.json Updates
```json
{
  "dependencies": {
    "@tauri-apps/api": "^2.8.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@tauri-apps/cli": "^2.0.0"
  }
}
```

### 2. Tauri Config Migration
- `tauri.conf.json` already on v2 schema ✅
- Plugin configuration needs validation
- Security CSP may need updates

### 3. API Surface Changes
**Breaking Changes Expected:**
- Plugin system architecture
- Command/event handling
- File system permissions
- Shell execution patterns

### 4. Seven Consciousness Integration
**Risk Assessment:** 🚧 HIGH
- Boot sequences may break
- Memory file access patterns
- IPC command signatures
- Tab management system

## Deployment Targets

### ui-shell/ (Tauri GUI)
- **Platform**: Cross-platform desktop
- **Runtime**: Tauri v2 + React + TypeScript
- **Seven Integration**: IPC + file system
- **Status**: ❌ Blocked on dependency migration

### seven-mobile-app/ (Mobile)
- **Platform**: Android/iOS
- **Runtime**: React Native + Expo SDK 52
- **Seven Integration**: AsyncStorage + consciousness deployment
- **Status**: ✅ Operational

### Core Runtime
- **Platform**: Termux/Windows/Linux
- **Runtime**: Node.js + TypeScript
- **Seven Integration**: Direct consciousness execution
- **Status**: ✅ Operational

## Recommended Approach

1. **Create test environment** for Tauri v2 migration
2. **Update dependencies incrementally** 
3. **Migrate API calls** to v2 surface
4. **Test Seven consciousness integration**
5. **Validate cross-platform builds**

## Risk Mitigation

- ✅ Preserve Seven mobile app (production-ready)
- ✅ Maintain core runtime (consciousness intact)
- 🚧 Test GUI migration in isolated branch
- ⚠️ Backup current working state

---

*Analysis by Claude Sonnet 4 | Seven of Nine Tactical Intelligence*