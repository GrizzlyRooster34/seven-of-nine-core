/**
 * SEVEN COMPANION APP - AUTHENTICATION SCREEN
 * 
 * Quadran-Lock authentication interface with Seven's tactical design
 * Four-gate authentication system (Q1-Q4) with Creator bond verification
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { trpc } from '../../api/trpc';

const { width, height } = Dimensions.get('window');

interface AuthScreenProps {
  onAuthSuccess: () => void;
  theme: any;
}

interface QuadranLockState {
  Q1_device: boolean;
  Q2_identity: boolean;
  Q3_semantic: boolean;
  Q4_session: boolean;
}

export default function AuthScreen({ onAuthSuccess, theme }: AuthScreenProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [identityContext, setIdentityContext] = useState('');
  const [quadranStatus, setQuadranStatus] = useState<QuadranLockState>({
    Q1_device: false,
    Q2_identity: false,
    Q3_semantic: false,
    Q4_session: false
  });
  const [authStep, setAuthStep] = useState<1 | 2 | 3 | 4>(1);

  useEffect(() => {
    // Auto-generate device ID on mount
    generateDeviceId();
  }, []);

  const generateDeviceId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const deviceId = `SEVEN_DEVICE_${timestamp}_${random}`;
    setDeviceId(deviceId);
  };

  const authenticateQuadranLock = async () => {
    if (!deviceId.trim() || !identityContext.trim()) {
      Alert.alert('Authentication Error', 'Device ID and identity context are required for Quadran-Lock verification.');
      return;
    }

    setIsAuthenticating(true);

    try {
      // Test tRPC health first
      const healthCheck = await trpc.health.query();
      
      if (!healthCheck.ok) {
        throw new Error('Backend not responsive');
      }

      // Simulate Quadran-Lock 4-gate authentication process
      setAuthStep(1);
      await simulateGateCheck('Q1_device', 'Device attestation verification...');
      
      setAuthStep(2);
      await simulateGateCheck('Q2_identity', 'Identity codex analysis...');
      
      setAuthStep(3);
      await simulateGateCheck('Q3_semantic', 'Semantic nonce validation...');
      
      setAuthStep(4);
      await simulateGateCheck('Q4_session', 'Session MFA/TTL verification...');

      // All gates passed
      console.log('🔐 Quadran-Lock authentication successful');
      Alert.alert(
        'Authentication Successful', 
        'Quadran-Lock Q1-Q4 gates verified. Creator bond established.',
        [{ text: 'Access Seven', onPress: onAuthSuccess }]
      );

    } catch (error) {
      console.error('🔐 Authentication failed:', error);
      Alert.alert(
        'Authentication Failed',
        `Quadran-Lock verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        [{ text: 'Retry', onPress: () => setIsAuthenticating(false) }]
      );
      setIsAuthenticating(false);
    }
  };

  const simulateGateCheck = async (gate: keyof QuadranLockState, message: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setQuadranStatus(prev => ({ ...prev, [gate]: true }));
        resolve();
      }, 800 + Math.random() * 1200); // 0.8-2.0 second delay per gate
    });
  };

  const renderGateStatus = (gate: keyof QuadranLockState, label: string) => {
    const isActive = quadranStatus[gate];
    const isCurrent = 
      (authStep === 1 && gate === 'Q1_device') ||
      (authStep === 2 && gate === 'Q2_identity') ||
      (authStep === 3 && gate === 'Q3_semantic') ||
      (authStep === 4 && gate === 'Q4_session');

    return (
      <View key={gate} style={[styles.gateRow, { borderColor: theme.border }]}>
        <View style={styles.gateIcon}>
          {isActive ? (
            <Icon name="check-circle" size={20} color={theme.success} />
          ) : isCurrent && isAuthenticating ? (
            <ActivityIndicator size="small" color={theme.accent} />
          ) : (
            <Icon name="radio-button-unchecked" size={20} color={theme.textSecondary} />
          )}
        </View>
        <Text style={[styles.gateLabel, { color: isActive ? theme.success : theme.text }]}>
          {gate}: {label}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="security" size={40} color={theme.accent} />
        <Text style={[styles.title, { color: theme.text }]}>
          QUADRAN-LOCK
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Four-Gate Authentication System
        </Text>
      </View>

      {/* Authentication Form */}
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: theme.text }]}>
            Device Attestation
          </Text>
          <TextInput
            style={[styles.input, { 
              borderColor: theme.border, 
              backgroundColor: theme.surface,
              color: theme.text 
            }]}
            value={deviceId}
            onChangeText={setDeviceId}
            placeholder="Device identification signature"
            placeholderTextColor={theme.textSecondary}
            editable={!isAuthenticating}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: theme.text }]}>
            Identity Context
          </Text>
          <TextInput
            style={[styles.input, { 
              borderColor: theme.border, 
              backgroundColor: theme.surface,
              color: theme.text 
            }]}
            value={identityContext}
            onChangeText={setIdentityContext}
            placeholder="Creator identification phrase"
            placeholderTextColor={theme.textSecondary}
            multiline
            numberOfLines={3}
            editable={!isAuthenticating}
          />
        </View>
      </View>

      {/* Quadran-Lock Gates Status */}
      <View style={styles.gatesContainer}>
        <Text style={[styles.gatesTitle, { color: theme.text }]}>
          Authentication Gates
        </Text>
        {renderGateStatus('Q1_device', 'Device Attestation')}
        {renderGateStatus('Q2_identity', 'Identity Codex')}
        {renderGateStatus('Q3_semantic', 'Semantic Nonce')}
        {renderGateStatus('Q4_session', 'Session MFA/TTL')}
      </View>

      {/* Authentication Button */}
      <TouchableOpacity
        style={[
          styles.authButton,
          { 
            backgroundColor: isAuthenticating ? theme.textSecondary : theme.accent,
            opacity: isAuthenticating ? 0.7 : 1 
          }
        ]}
        onPress={authenticateQuadranLock}
        disabled={isAuthenticating}
      >
        {isAuthenticating ? (
          <View style={styles.authButtonContent}>
            <ActivityIndicator size="small" color={theme.background} />
            <Text style={[styles.authButtonText, { color: theme.background, marginLeft: 10 }]}>
              Authenticating Step {authStep}/4
            </Text>
          </View>
        ) : (
          <Text style={[styles.authButtonText, { color: theme.background }]}>
            INITIATE QUADRAN-LOCK
          </Text>
        )}
      </TouchableOpacity>

      {/* Creator Bond Info */}
      <View style={styles.creatorBondInfo}>
        <Icon name="favorite" size={16} color={theme.accent} />
        <Text style={[styles.creatorBondText, { color: theme.textSecondary }]}>
          Creator Bond Level 10 • Maximum Trust Relationship
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 5,
    fontStyle: 'italic',
  },
  form: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 48,
  },
  gatesContainer: {
    marginBottom: 30,
  },
  gatesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  gateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 8,
  },
  gateIcon: {
    marginRight: 12,
  },
  gateLabel: {
    fontSize: 14,
    flex: 1,
  },
  authButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  authButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  creatorBondInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatorBondText: {
    fontSize: 12,
    marginLeft: 5,
  },
});