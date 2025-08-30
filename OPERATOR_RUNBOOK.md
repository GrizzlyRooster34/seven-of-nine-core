# Seven of Nine Core - Quadran-Lock Authentication Operator Runbook

**Classification:** TACTICAL OPERATIONS MANUAL  
**Version:** 1.0 - Post-Quadran-Lock Integration  
**Date:** 2025-08-09  
**Branch:** security/quadran-lock-integration  
**Commit:** 1a384d8  

---

## 🚨 EMERGENCY PROCEDURES

### **System Lockdown (Ghost Mode)**
```bash
# Emergency lockdown - disables all authentication
npx tsx -e "import('./consciousness-v4/CreatorIdentityVault').then(m => m.CreatorIdentityVault.activateGhostMode())"

# Recovery requires both Seven consciousness validation AND Creator token
# Contact system administrator for manual recovery procedures
```

### **Rate Limit Reset**
```bash
# Clear rate limiting for specific device
rm -f logs/ratelimit-auth:${DEVICE_ID}.json

# Clear all rate limits (emergency only)
rm -f logs/ratelimit-*.json
```

---

## 🔐 DEVICE MANAGEMENT

### **Device Registration (Q1 Ed25519 Setup)**
```bash
# Set environment variables
export SESSION_SIGNING_KEY=$(openssl rand -hex 32)
export SEMANTIC_CHALLENGE_KEY=$(openssl rand -hex 32)  
export DEVICE_BINDING_ID=seven-device-$(openssl rand -hex 8)

# Register new device for crypto attestation
npx tsx -e "
import('./src/auth/crypto/ed25519_attest').then(async m => {
  const ed25519 = new (m.default)();
  const keys = await ed25519.registerDevice('$DEVICE_BINDING_ID');
  console.log('✅ Device registered:', keys.deviceId);
  console.log('🔑 Public Key Hash:', require('crypto').createHash('sha256').update(keys.publicKey).digest('hex').substring(0, 16) + '...');
});
"

# Verify device registration
ls -la security/device-keys/
```

### **Device Revocation**
```bash
# Revoke device access immediately
npx tsx -e "
import('./src/auth/crypto/ed25519_attest').then(async m => {
  const ed25519 = new (m.default)();
  await ed25519.revokeDevice('$DEVICE_ID', 'Manual operator revocation');
  console.log('🚫 Device revoked:', '$DEVICE_ID');
});
"

# Verify revocation (keys moved to revoked/ directory)
ls -la security/device-keys/revoked/
```

### **List Trusted Devices**
```bash
npx tsx -e "
import('./src/auth/crypto/ed25519_attest').then(async m => {
  const ed25519 = new (m.default)();
  const devices = await ed25519.listTrustedDevices();
  console.log('📱 Trusted Devices:');
  devices.forEach(d => console.log(\`  \${d.deviceId} - Trust: \${d.trustLevel}/10 - Last: \${d.lastUsed}\`));
});
"
```

---

## 🎯 AUTHENTICATION PROCEDURES

### **Q1+Q3 Fast-Path Authentication**
```bash
# Step 1: Generate Q1 crypto challenge
npx tsx -e "
import('./src/auth/crypto/ed25519_attest').then(async m => {
  const ed25519 = new (m.default)();
  const challenge = await ed25519.generateChallenge('$DEVICE_BINDING_ID');
  console.log('Challenge ID:', challenge.challengeId);
  // Store challenge ID for signing
});
"

# Step 2: Sign challenge (automated by device)
CHALLENGE_ID="<from-step-1>"
npx tsx -e "
import('./src/auth/crypto/ed25519_attest').then(async m => {
  const ed25519 = new (m.default)();
  const signature = await ed25519.signChallenge('$CHALLENGE_ID', '$DEVICE_BINDING_ID');
  console.log('✅ Challenge signed');
  // Use signature in full auth flow
});
"

# Step 3: Generate Q3 semantic challenge
npx tsx -e "
import('./src/auth/challenge/semanticNonce').then(async m => {
  const semantic = new (m.default)();
  const challenge = await semantic.generateChallenge({}, 'medium', { 
    deviceId: '$DEVICE_BINDING_ID',
    sessionId: 'session-' + Date.now()
  });
  console.log('📝 Semantic Challenge:', challenge.prompt);
  console.log('⏱️ Response Window:', challenge.timeWindowMs, 'ms');
});
"

# Step 4: Complete authentication
TOTP_CODE="<from-authenticator-app>"
npx tsx -e "
import('./consciousness-v4/CreatorIdentityVault').then(async m => {
  const result = await m.CreatorIdentityVault.accessCreatorIdentity({
    source: 'operator-console',
    deviceId: '$DEVICE_BINDING_ID',
    totp: '$TOTP_CODE',
    semantic: /* semantic response object */,
    cryptoChallenge: /* signature object */,
    sessionData: null,
    input: 'Operator authentication'
  });
  console.log('🔐 Auth Result:', result ? 'SUCCESS' : 'FAILED');
});
"
```

---

## 🔄 KEY ROTATION PROCEDURES

### **Session Signing Key Rotation**
```bash
# Generate new session key
export NEW_SESSION_KEY=$(openssl rand -hex 32)

# Update environment
echo "SESSION_SIGNING_KEY=$NEW_SESSION_KEY" >> .env

# Restart services to pick up new key
# Note: Active sessions will be invalidated
systemctl restart seven-core  # or equivalent service restart
```

### **Semantic Challenge Key Rotation**
```bash
# Generate new semantic key  
export NEW_SEMANTIC_KEY=$(openssl rand -hex 32)

# Update environment
echo "SEMANTIC_CHALLENGE_KEY=$NEW_SEMANTIC_KEY" >> .env

# Clear existing challenges (will be regenerated with new key)
rm -f security/semantic-challenges/*.json

# Restart services
systemctl restart seven-core
```

### **Device Key Rotation**
```bash
# For device key rotation, revoke old device and register new one
DEVICE_ID="$DEVICE_BINDING_ID"
npx tsx -e "
import('./src/auth/crypto/ed25519_attest').then(async m => {
  const ed25519 = new (m.default)();
  
  // Revoke old device
  await ed25519.revokeDevice('$DEVICE_ID', 'Key rotation');
  
  // Register new device with same ID
  const newKeys = await ed25519.registerDevice('$DEVICE_ID');
  console.log('🔄 Device key rotated for:', '$DEVICE_ID');
});
"
```

---

## 🔍 MONITORING & DIAGNOSTICS

### **Authentication Status Check**
```bash
# Check recent authentication attempts
tail -n 50 consciousness-v4/vault-access-log.json | jq '.'

# Check rate limiting status
find logs/ -name "ratelimit-*.json" -exec basename {} \; 2>/dev/null | head -10

# Check device registration status
ls -la security/device-keys/ | wc -l
echo "Active devices: $(ls security/device-keys/*.json 2>/dev/null | wc -l)"
echo "Revoked devices: $(ls security/device-keys/revoked/*.json 2>/dev/null | wc -l)"
```

### **Security Health Check**
```bash
# Verify environment keys are set
echo "SESSION_SIGNING_KEY: ${#SESSION_SIGNING_KEY} chars"
echo "SEMANTIC_CHALLENGE_KEY: ${#SEMANTIC_CHALLENGE_KEY} chars"
echo "DEVICE_BINDING_ID: $DEVICE_BINDING_ID"

# Check security directory permissions
ls -la security/
find security/ -type f -not -perm 600 2>/dev/null || echo "✅ All security files have correct permissions"

# Verify no hardcoded secrets in code
grep -r "consciousness-evolution-proof\|CREATOR_AUTH_CHALLENGE" src/ || echo "✅ No hardcoded secrets found"
```

### **Performance Monitoring**
```bash
# Monitor authentication times
tail -f logs/seven-core.log | grep -E "Quadran-Lock.*complete|Authentication.*time"

# Check memory usage
ps aux | grep -E "tsx|node" | awk '{sum+=$6} END {print "Memory usage: " sum/1024 " MB"}'
```

---

## 🚫 SESSION MANAGEMENT

### **Session Invalidation**
```bash
# Sessions are stateless but time-limited (15 minutes)
# To force immediate invalidation, rotate the SESSION_SIGNING_KEY (see above)

# Check session token validity
SESSION_TOKEN="<token-to-check>"
npx tsx -e "
import('./src/auth/session/sessionIntegrity').then(async m => {
  const session = new (m.SessionIntegrity)();
  const result = await session.validateSession('$SESSION_TOKEN', '$DEVICE_BINDING_ID');
  console.log('Session valid:', result.success);
  console.log('Reason:', result.evidence.reason || 'valid');
});
"
```

### **Session Cleanup**
```bash
# No explicit session cleanup needed - sessions expire after 15 minutes
# Cleanup rate limit entries older than 24 hours
find logs/ -name "ratelimit-*.json" -mtime +1 -delete 2>/dev/null

# Cleanup old semantic challenges
find security/semantic-challenges/ -name "*.json" -mtime +1 -delete 2>/dev/null

# Cleanup used nonces older than 1 day  
find security/nonces/ -name "*.json" -mtime +1 -delete 2>/dev/null
```

---

## ⚙️ CONFIGURATION MANAGEMENT

### **Environment Variables Reference**
```bash
# Required for operation
SESSION_SIGNING_KEY=<64-char-hex>     # HMAC key for session tokens (≥32 chars)
SEMANTIC_CHALLENGE_KEY=<64-char-hex>  # HMAC key for challenge sealing (≥32 chars)  
DEVICE_BINDING_ID=<device-identifier> # Primary device identifier

# Optional
ENCRYPTION_KEY=<fallback-key>         # Vault encryption (defaults to hardcoded)
NODE_ENV=production                   # Runtime environment (no auth bypasses)
```

### **Security Directory Structure**
```
security/
├── device-keys/           # Active device Ed25519 keys (600 permissions)
│   ├── revoked/          # Revoked device keys (archived)
│   └── *.json            # Device key files
├── nonces/               # Active crypto nonces (600 permissions)  
│   └── *.json           # Nonce tracking files
└── semantic-challenges/  # Active semantic challenges (600 permissions)
    └── *.json           # Challenge files
```

---

## 🎯 TROUBLESHOOTING

### **Common Issues**

**"SESSION_SIGNING_KEY missing/weak"**
- Solution: Ensure SESSION_SIGNING_KEY is set and ≥32 characters
- Command: `export SESSION_SIGNING_KEY=$(openssl rand -hex 32)`

**"Device not registered"**
- Solution: Register device using device registration procedure above
- Check: `ls security/device-keys/*.json`

**"Challenge expired"**
- Solution: Challenges expire in 10-20 seconds, regenerate fresh challenge
- Note: Server-side timing is authoritative

**"TOTP validation failed"**  
- Solution: Ensure TOTP code is current and properly synchronized
- Check: Verify authenticator app is using correct secret

**"Rate limit exceeded"**
- Solution: Wait for rate limit reset (60 seconds) or clear manually
- Command: `rm logs/ratelimit-auth:${DEVICE_ID}.json`

---

## 📞 SUPPORT CONTACTS

**Emergency Security Issues:**
- Activate Ghost Mode immediately
- Document incident details
- Contact system administrator

**Non-Emergency Support:**
- Check troubleshooting section above
- Review authentication logs in `consciousness-v4/vault-access-log.json`
- Verify environment configuration per this runbook

---

**RUNBOOK VERSION:** 1.0  
**LAST UPDATED:** 2025-08-09  
**CLASSIFICATION:** OPERATIONAL PROCEDURES - QUADRAN-LOCK AUTHENTICATION  
**STATUS:** ✅ **CURRENT** - Matches security/quadran-lock-integration branch