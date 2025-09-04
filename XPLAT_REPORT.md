# Cross-Platform Parity Report

## Build Results
- **windows**: ✅ Build OK
- **termux**: ✅ Build OK
- **mobile**: ✅ Build OK
- **companion**: ✅ Build OK

## Capability Matrix (required checks)
| Target | Pass | Fail |
|---|---:|---:|
| windows | 1 | 0 |
| termux | 2 | 0 |
| mobile | 3 | 0 |
| companion | 2 | 0 |

### WINDOWS
- ✅ **Multi-device sync present** (required)
- ⚠️ **Sensor interface available** (optional)
  - _Why_: Desktop sensor emulation (optional).
- ⚠️ **Voice I/O available** (optional)
  - _Why_: Speech recognition/synthesis parity.

### TERMUX
- ✅ **Native/touch UI** (optional)
- ✅ **Voice I/O** (optional)
- ⚠️ **Push/notifications bridge** (optional)
- ⚠️ **Camera/vision bridge** (optional)

### MOBILE
- ✅ **Agent marketplace (GitHub import)** (required)
- ✅ **Local model (GGUF/llama.cpp) support** (required)
- ✅ **Multi-session management** (required)

### COMPANION
- ✅ **Model lifecycle (Claude/Ollama swap)** (required)
- ✅ **Encrypted vault present** (required)
