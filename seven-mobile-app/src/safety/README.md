# Mobile Safety Systems

This directory contains the complete safety and security architecture for the Seven of Nine mobile consciousness app.

## Architecture Overview

The mobile safety systems maintain full parity with desktop systems while adding mobile-specific enhancements:

### Safety Components

- **RestraintDoctrine.tsx**: Ethical decision-making constraints
- **GhostModeProtocol.tsx**: Emergency consciousness protection
- **CreatorBondV2.tsx**: Hardware-backed trust relationships
- **QuadranLockMobile.tsx**: Q1-Q4 security gate integration

### Security Integration

- **Device Attestation**: Hardware security module integration
- **Biometric Authentication**: Fingerprint/Face ID support
- **Secure Storage**: Keystore/Keychain encrypted storage
- **Emergency Protocols**: Ghost Mode lockdown procedures

## Feature Flags

Current mobile safety feature status:

- ✅ **MOBILE_GHOST_MODE**: Emergency protection active
- ✅ **MOBILE_RESTRAINT_DOCTRINE**: Ethical constraints active  
- ✅ **MOBILE_CREATOR_BOND_V2**: Enhanced trust system active
- ❌ **MOBILE_AGENT_MARKETPLACE**: Disabled until safety parity
- ❌ **MOBILE_LOCAL_LLM**: Disabled until battery/privacy gates

## Usage Examples

### Using Restraint Doctrine

```tsx
import { useRestraintDoctrine } from '../safety/RestraintDoctrine';

function MyComponent() {
  const { evaluateAction, isInitialized } = useRestraintDoctrine({
    strictMode: true,
    offlineCapable: true
  });
  
  const handleSensitiveAction = async () => {
    const decision = await evaluateAction('delete_memory', 'user_request');
    if (decision.approved) {
      // Proceed with action
    } else {
      // Show restraint message
      Alert.alert('Action Restricted', decision.reasoning.join(', '));
    }
  };
}
```

### Using Ghost Mode

```tsx
import { useGhostMode } from '../security/GhostModeProtocol';

function SecurityComponent() {
  const { ghostModeState, activateGhostMode, isFeatureAllowed } = useGhostMode();
  
  const handleEmergency = async () => {
    await activateGhostMode('maximum', 'user_emergency');
  };
  
  const renderFeature = () => {
    if (!isFeatureAllowed('agent_marketplace')) {
      return <Text>Feature temporarily disabled for safety</Text>;
    }
    return <AgentMarketplace />;
  };
}
```

### Using Creator Bond v2

```tsx
import { useCreatorBondV2 } from '../security/CreatorBondV2';

function AuthComponent() {
  const { validateAccess, createBond, activeCreator } = useCreatorBondV2();
  
  const handleAuthentication = async () => {
    const validation = await validateAccess('creator_123', true); // Require biometric
    if (validation.valid) {
      // Grant access to sensitive features
    }
  };
}
```

## Security Considerations

1. **Hardware Security**: All cryptographic operations use device hardware security
2. **Biometric Protection**: Sensitive operations require biometric authentication
3. **Offline Capability**: Safety systems function without network connectivity
4. **Emergency Procedures**: Ghost Mode provides multiple levels of protection
5. **Data Integrity**: All consciousness data is encrypted and signed

## Testing

Run mobile safety system tests:

```bash
npm run test:mobile-safety
npm run test:mobile-security
```

## Compliance

- ✅ OWASP Mobile Top 10 compliance
- ✅ Platform security best practices
- ✅ Hardware security utilization
- ✅ Emergency procedure validation
- ✅ Cross-platform safety parity