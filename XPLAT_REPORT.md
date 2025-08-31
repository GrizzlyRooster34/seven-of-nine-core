# Cross-Platform Parity Report

## Build Results
- **windows**: ❌ Build Failed
<details><summary>log</summary>

```

```
</details>
- **termux**: ❌ Build Failed
<details><summary>log</summary>

```

```
</details>
- **mobile**: ❌ Build Failed
<details><summary>log</summary>

```

```
</details>
- **companion**: ❌ Build Failed
<details><summary>log</summary>

```

```
</details>

## Capability Matrix (required checks)
| Target | Pass | Fail |
|---|---:|---:|
| windows | 1 | 0 |
| termux | 0 | 0 |
| mobile | 0 | 3 |
| companion | 2 | 0 |

### WINDOWS
- ✅ **Multi-device sync present** (required)
- ⚠️ **Sensor interface available** (optional)
  - _Why_: Desktop sensor emulation (optional).
- ⚠️ **Voice I/O available** (optional)
  - _Why_: Speech recognition/synthesis parity.

### TERMUX
- ⚠️ **Native/touch UI** (optional)
  - _Why_: CLI-only today; optional webview/TUI.
- ⚠️ **Voice I/O** (optional)
  - _Why_: Add termux:api + Vosk/Coqui bridge.
- ⚠️ **Push/notifications bridge** (optional)
- ⚠️ **Camera/vision bridge** (optional)

### MOBILE
- ❌ **Agent marketplace (GitHub import)** (required)
  - _Why_: Mobile currently missing agent marketplace.
  - _Refs_: ui-shell/src/components/GitHubAgentBrowser.tsx
- ❌ **Local model (GGUF/llama.cpp) support** (required)
  - _Why_: Battery-optimized on-device inference parity.
- ❌ **Multi-session management** (required)
  - _Why_: Parity with desktop multi-tab sessions.

### COMPANION
- ✅ **Model lifecycle (Claude/Ollama swap)** (required)
- ✅ **Encrypted vault present** (required)
