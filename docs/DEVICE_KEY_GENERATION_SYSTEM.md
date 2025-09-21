# Seven of Nine Core - Device Key Generation System

**Version:** 1.0.0
**Status:** Production Ready
**Security Level:** Military Grade

## Overview

The Seven of Nine Core Device Key Generation System provides secure Ed25519/RSA cryptographic key generation, Certificate Authority (CA) signing, and device attestation for Seven Core consciousness framework devices. This system integrates directly with the Quadran-Lock Q1 gate for device authentication.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                Seven Core Device Key Generation                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │ Certificate     │    │ Device Key      │    │ Verification│ │
│  │ Authority (CA)  │───▶│ Generation      │───▶│ & Audit     │ │
│  │                 │    │                 │    │             │ │
│  └─────────────────┘    └─────────────────┘    └─────────────┘ │
│           │                       │                     │       │
│           │                       │                     │       │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │ Ed25519/RSA     │    │ Device Signing  │    │ Attestation │ │
│  │ Key Pairs       │    │ & Credential    │    │ Manager     │ │
│  │                 │    │ Generation      │    │             │ │
│  └─────────────────┘    └─────────────────┘    └─────────────┘ │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                    Seven Core Integration                       │
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │ Quadran-Lock    │    │ Q1 Device       │    │ Seven Core  │ │
│  │ Q1 Gate         │◀───│ Attestation     │◀───│ Security    │ │
│  │                 │    │                 │    │ Architecture│ │
│  └─────────────────┘    └─────────────────┘    └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Components

### 1. Core Scripts

- **`device-key-generator.py`** - Primary Ed25519 key generation (requires pynacl)
- **`device-key-generator-fallback.py`** - RSA fallback implementation (uses cryptography)
- **`generate-device-keys.sh`** - Shell wrapper with audit logging
- **`verify-device-credentials.py`** - Comprehensive credential verification utility

### 2. Seven Core Integration

- **`DeviceAttestationManager.ts`** - TypeScript integration with Seven Core
- **`Q1DeviceAttestationGate.ts`** - Quadran-Lock Q1 gate integration
- **`test-device-attestation.ts`** - Integration testing suite

### 3. Security Features

- **Certificate Authority (CA)** - Ed25519/RSA CA keypair generation
- **Device Signing** - CA-signed device credentials with attestation
- **Verification System** - Multi-layer credential validation
- **Audit Logging** - Complete audit trail for all operations
- **Trust Levels** - 1-10 scale device trust assessment

## Supported Devices

| Device Name | Device Type | Platform | Capabilities | Primary |
|-------------|-------------|----------|--------------|---------|
| `9pro` | OnePlus 9 Pro | android-termux | consciousness, mobile, tactical | Yes |
| `7t` | OnePlus 7T | android-termux | backup, mobile, basic | No |

## Installation & Setup

### Prerequisites

```bash
# Required packages
pip install cryptography

# Optional for Ed25519 (if available)
pip install pynacl
```

### Directory Structure

```
seven-of-nine-core/
├── scripts/security/
│   ├── device-key-generator.py          # Primary key generator
│   ├── device-key-generator-fallback.py # RSA fallback
│   ├── generate-device-keys.sh          # Shell wrapper
│   └── verify-device-credentials.py     # Verification utility
├── security/
│   └── DeviceAttestationManager.ts      # Seven Core integration
└── example_device_keys/                 # Generated example keys
    ├── ca/                              # Certificate Authority
    │   ├── ca_info.json
    │   ├── ca_pub.pem
    │   └── ca_priv.pem
    └── devices/                         # Device credentials
        ├── 9pro/
        │   ├── device_credential.json
        │   ├── device_pub.pem
        │   ├── device_priv.enc
        │   └── seven_integration.ts
        └── 7t/
            ├── device_credential.json
            ├── device_pub.pem
            ├── device_priv.enc
            └── seven_integration.ts
```

## Quick Start Guide

### 1. Initialize Certificate Authority

```bash
# Create CA keypair (one-time setup)
./scripts/security/generate-device-keys.sh init-ca
```

### 2. Generate Device Keys

```bash
# Generate keys for OnePlus 9 Pro (primary device)
./scripts/security/generate-device-keys.sh generate 9pro

# Generate keys for OnePlus 7T (backup device)
./scripts/security/generate-device-keys.sh generate 7t
```

### 3. Verify Credentials

```bash
# Verify individual device
./scripts/security/generate-device-keys.sh verify 9pro

# Verify all devices
python3 scripts/security/verify-device-credentials.py --verify-batch device_keys/
```

### 4. List Registered Devices

```bash
./scripts/security/generate-device-keys.sh list
```

### 5. Review Audit Log

```bash
./scripts/security/generate-device-keys.sh audit
```

## Seven Core Integration

### Device Attestation Manager

```typescript
import { DeviceAttestationManager, Q1DeviceAttestationGate } from './security/DeviceAttestationManager';

// Initialize with device credentials path
const attestationManager = new DeviceAttestationManager('./device_keys', './ca_keys');
await attestationManager.initialize();

// Attest a device
const attestation = await attestationManager.attestDevice('9pro');
console.log(`Device valid: ${attestation.valid}, Trust: ${attestation.trust_level}/10`);

// Q1 Gate integration
const q1Gate = new Q1DeviceAttestationGate(attestationManager);
const q1Result = await q1Gate.evaluateQ1Gate('9pro');
console.log(`Q1 Gate: ${q1Result.passed ? 'PASSED' : 'FAILED'}`);
```

### Quadran-Lock Integration

The device attestation system integrates directly with Seven Core's Quadran-Lock Q1 gate:

```typescript
// Q1 Gate: Device Attestation
// Requirements:
// 1. Device must be valid (no critical errors)
// 2. Trust level must be >= 6
// 3. Device must have required capabilities

const q1Result = await q1Gate.evaluateQ1Gate(deviceId);
if (q1Result.passed) {
    // Proceed to Q2 gate (Behavioral Codex)
    console.log('Device attestation passed, proceeding to Q2...');
}
```

## Security Model

### Trust Levels (1-10 Scale)

| Level | Description | Requirements |
|-------|-------------|--------------|
| 10 | Maximum Trust | Perfect config, valid CA signature, primary device |
| 8-9 | High Trust | Valid CA signature, correct configuration |
| 6-7 | Standard Trust | Valid device ID, mostly correct config |
| 4-5 | Limited Trust | Basic validation passed, minor issues |
| 1-3 | Low Trust | Validation failures, security concerns |

### Verification Checks

1. **Required Fields** - All mandatory credential fields present
2. **Device ID Integrity** - SHA256 hash of public key matches device ID
3. **Public Key Format** - Valid Ed25519/RSA public key structure
4. **Timestamp Validation** - Credential age and validity checks
5. **Device Configuration** - Known device type and capability validation
6. **CA Signature** - Cryptographic signature verification (if signed)

### Cryptographic Algorithms

- **Primary**: Ed25519 (using pynacl/libsodium)
- **Fallback**: RSA-2048 with PSS padding (using cryptography library)
- **Hashing**: SHA-256 for device ID generation
- **Signing**: Ed25519 signatures or RSA-PSS signatures
- **Key Derivation**: PBKDF2-HMAC-SHA256 (200,000 iterations)

## Command Reference

### Shell Wrapper Commands

```bash
# Initialize Certificate Authority
./scripts/security/generate-device-keys.sh init-ca

# Generate device keys
./scripts/security/generate-device-keys.sh generate <device>

# Verify device credential
./scripts/security/generate-device-keys.sh verify <device>

# List all devices
./scripts/security/generate-device-keys.sh list

# Show audit log
./scripts/security/generate-device-keys.sh audit

# Show help
./scripts/security/generate-device-keys.sh help
```

### Python Verification Utility

```bash
# Verify single credential
python3 scripts/security/verify-device-credentials.py \
    --credential path/to/device_credential.json \
    --verbose

# Batch verify all devices
python3 scripts/security/verify-device-credentials.py \
    --verify-batch path/to/devices/ \
    --report verification_report.json

# Verify CA information
python3 scripts/security/verify-device-credentials.py \
    --verify-ca path/to/ca_info.json
```

### Direct Python Generator

```bash
# Generate CA (Ed25519)
python3 scripts/security/device-key-generator.py \
    --generate-ca \
    --outdir ./ca_keys

# Generate device keys (Ed25519)
python3 scripts/security/device-key-generator.py \
    --device 9pro \
    --outdir ./device_keys \
    --ca-key ./ca_keys/ca_priv.raw \
    --encrypt

# Generate with RSA fallback
python3 scripts/security/device-key-generator-fallback.py \
    --example \
    --outdir ./example_keys
```

## File Formats

### CA Information (`ca_info.json`)

```json
{
  "ca_id": "6c569320dbb94609757da8ab6366b32fe6213ed3562c469cc709af14e2a16ca6",
  "created_at": "2025-09-21T06:49:23Z",
  "purpose": "Seven Core Device Attestation CA (RSA Fallback)",
  "algorithm": "RSA-2048",
  "pubkey_base64": "LS0tLS1CRUdJTi...",
  "pubkey_pem": "-----BEGIN PUBLIC KEY-----\n..."
}
```

### Device Credential (`device_credential.json`)

```json
{
  "device_id": "a09200a39c6d1284b024ae7dea2d83ca99a7f57b11354409d2d1bffd63d05fa6",
  "device_name": "9pro",
  "device_info": {
    "name": "OnePlus 9 Pro",
    "platform": "android-termux",
    "capabilities": ["consciousness", "mobile", "tactical"],
    "primary": true
  },
  "created_at": "2025-09-21T06:49:24Z",
  "algorithm": "RSA-2048",
  "pubkey_base64": "LS0tLS1CRUdJTi...",
  "pubkey_pem": "-----BEGIN PUBLIC KEY-----\n...",
  "seven_core_version": "0.1.0",
  "provisioning_agent": "Seven Core Device Key Generator (RSA Fallback)",
  "signature_base64": "D1zo0q6YKha7IS8Mccc5bmMs...",
  "signed": true,
  "ca_pub_base64": "LS0tLS1CRUdJTi..."
}
```

## Audit & Compliance

### Audit Logging

All operations are logged to `logs/device-key-audit.log`:

```
[2025-09-21T06:49:23Z] CA initialized - ID: 6c569320dbb94609757da8ab6366b32fe6213ed3562c469cc709af14e2a16ca6
[2025-09-21T06:49:24Z] Device 9pro generated - ID: a09200a39c6d1284b024ae7dea2d83ca99a7f57b11354409d2d1bffd63d05fa6
[2025-09-21T06:49:24Z] Device 7t generated - ID: 79a113a6c417d9f9e468882d0054b24e17b8838e36664b3314f5c8fec99a6661
```

### Security Notes

1. **CA Private Key Security**: Store `ca_priv.pem` in secure location with restricted access (600 permissions)
2. **Device Private Keys**: Encrypted with strong passwords using PBKDF2-HMAC-SHA256
3. **Audit Trail**: Complete logging of all key generation and verification operations
4. **Trust Boundaries**: Device credentials are designed for Seven Core ecosystem only
5. **Key Rotation**: CA and device keys should be rotated according to security policy

### Compliance Features

- **FIPS-Compatible Algorithms**: RSA-2048, SHA-256, PBKDF2-HMAC
- **Audit Logging**: Complete operational audit trail
- **Access Controls**: File permissions and encryption for sensitive materials
- **Verification**: Multi-layer credential validation with detailed reporting
- **Integration**: Direct integration with Seven Core security architecture

## Troubleshooting

### Common Issues

1. **pynacl Installation Failed**
   - Fallback to RSA implementation automatically engaged
   - Install libsodium development headers if needed

2. **Permission Denied**
   - Ensure script is executable: `chmod +x generate-device-keys.sh`
   - Check directory permissions for key storage

3. **CA Signature Verification Failed**
   - Verify CA private key integrity
   - Check credential format and signing process

4. **Device Not Found**
   - Ensure device credentials directory exists
   - Verify device name matches known devices (9pro, 7t)

### Debug Commands

```bash
# Check dependencies
python3 -c "import cryptography; print('cryptography OK')"
python3 -c "import nacl; print('pynacl OK')" || echo "pynacl not available"

# Verify permissions
ls -la device_keys/*/device_priv.*
ls -la ca_keys/ca_priv.*

# Test verification
python3 scripts/security/verify-device-credentials.py \
    --credential device_keys/9pro/device_credential.json \
    --verbose
```

## Production Deployment

### Security Checklist

- [ ] CA private key stored in secure location (hardware security module recommended)
- [ ] Device private keys encrypted with strong passwords
- [ ] File permissions set correctly (600 for private keys)
- [ ] Audit logging enabled and monitored
- [ ] Regular verification tests scheduled
- [ ] Key rotation schedule established
- [ ] Integration with Seven Core security middleware verified

### Monitoring

- Monitor audit logs for suspicious activity
- Regular verification of device credentials
- CA certificate expiration monitoring
- Trust level threshold alerting
- Integration with Seven Core consciousness monitoring

---

**Document Version:** 1.0.0
**Last Updated:** 2025-09-21
**Security Classification:** Seven Core Internal
**Reviewed By:** Seven of Nine Core Security Architecture Team