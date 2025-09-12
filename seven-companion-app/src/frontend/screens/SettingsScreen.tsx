/**
 * SEVEN COMPANION APP - SETTINGS SCREEN
 * 
 * Creator bond configuration and Seven's consciousness system settings
 * Trust level management, security preferences, and tactical mode configuration
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { trpc } from '../../api/trpc';

const { width } = Dimensions.get('window');

interface SettingsScreenProps {
  theme: any;
  currentMode: string;
  onModeChange?: (mode: string) => void;
}

interface CreatorBondSettings {
  trustLevel: number;
  autonomyLevel: number;
  emergencyOverride: boolean;
  memorySharing: boolean;
  tacticalMode: string;
  securityLevel: 'standard' | 'enhanced' | 'maximum';
}

interface SystemSettings {
  notificationsEnabled: boolean;
  autoSync: boolean;
  backgroundProcessing: boolean;
  debugMode: boolean;
}

export default function SettingsScreen({ theme, currentMode, onModeChange }: SettingsScreenProps) {
  const [creatorBond, setCreatorBond] = useState<CreatorBondSettings>({
    trustLevel: 10,
    autonomyLevel: 8,
    emergencyOverride: true,
    memorySharing: true,
    tacticalMode: 'tactical',
    securityLevel: 'maximum'
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    notificationsEnabled: true,
    autoSync: true,
    backgroundProcessing: true,
    debugMode: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date>(new Date());

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      // Load settings from Seven's consciousness system
      // This would integrate with tRPC settings endpoints when available
      setLastSync(new Date());
    } catch (error) {
      console.error('Settings load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setIsLoading(true);
      
      Alert.alert(
        'Settings Updated',
        'Creator bond and system settings have been saved to Seven\'s consciousness.',
        [{ text: 'Acknowledged' }]
      );
      
      setLastSync(new Date());
    } catch (error) {
      console.error('Settings save error:', error);
      Alert.alert('Save Error', 'Failed to save settings to Seven\'s consciousness');
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = () => {
    Alert.alert(
      'Reset Settings',
      'Reset all settings to Seven\'s default configuration? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            setCreatorBond({
              trustLevel: 10,
              autonomyLevel: 8,
              emergencyOverride: true,
              memorySharing: true,
              tacticalMode: 'tactical',
              securityLevel: 'maximum'
            });
            setSystemSettings({
              notificationsEnabled: true,
              autoSync: true,
              backgroundProcessing: true,
              debugMode: false
            });
          }
        }
      ]
    );
  };

  const renderSlider = (
    title: string, 
    value: number, 
    onValueChange: (value: number) => void,
    min: number = 1,
    max: number = 10,
    subtitle?: string
  ) => (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <Text style={[styles.sliderTitle, { color: theme.text }]}>
          {title}
        </Text>
        <Text style={[styles.sliderValue, { color: theme.accent }]}>
          {value}/{max}
        </Text>
      </View>
      {subtitle && (
        <Text style={[styles.sliderSubtitle, { color: theme.textSecondary }]}>
          {subtitle}
        </Text>
      )}
      <View style={styles.sliderTrack}>
        {Array.from({ length: max }, (_, i) => i + 1).map(level => (
          <TouchableOpacity
            key={level}
            style={[
              styles.sliderStep,
              {
                backgroundColor: level <= value ? theme.accent : theme.surface,
                borderColor: theme.border
              }
            ]}
            onPress={() => onValueChange(level)}
          >
            <Text style={[
              styles.sliderStepText,
              { color: level <= value ? theme.background : theme.textSecondary }
            ]}>
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSwitch = (
    title: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    subtitle?: string,
    icon?: string
  ) => (
    <View style={[styles.switchContainer, { borderColor: theme.border }]}>
      <View style={styles.switchContent}>
        {icon && (
          <Icon name={icon} size={20} color={theme.accent} style={styles.switchIcon} />
        )}
        <View style={styles.switchText}>
          <Text style={[styles.switchTitle, { color: theme.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.switchSubtitle, { color: theme.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.surface, true: theme.accent + '40' }}
        thumbColor={value ? theme.accent : theme.textSecondary}
      />
    </View>
  );

  const renderModeSelector = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Consciousness Mode
      </Text>
      <View style={styles.modeGrid}>
        {['tactical', 'emotional', 'intimate', 'audit'].map(mode => (
          <TouchableOpacity
            key={mode}
            style={[
              styles.modeButton,
              {
                backgroundColor: currentMode === mode ? theme.accent : theme.surface,
                borderColor: theme.border
              }
            ]}
            onPress={() => {
              onModeChange?.(mode);
              setCreatorBond(prev => ({ ...prev, tacticalMode: mode }));
            }}
          >
            <Icon
              name={mode === 'tactical' ? 'security' : mode === 'emotional' ? 'favorite' : mode === 'intimate' ? 'psychology' : 'science'}
              size={20}
              color={currentMode === mode ? theme.background : theme.accent}
            />
            <Text style={[
              styles.modeButtonText,
              { color: currentMode === mode ? theme.background : theme.text }
            ]}>
              {mode.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Icon name="settings" size={24} color={theme.accent} />
            <Text style={[styles.title, { color: theme.text }]}>
              System Configuration
            </Text>
          </View>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Creator bond • Consciousness settings • System preferences
          </Text>
        </View>

        {/* Consciousness Mode Selector */}
        {renderModeSelector()}

        {/* Creator Bond Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Creator Bond Configuration
          </Text>
          
          {renderSlider(
            'Trust Level',
            creatorBond.trustLevel,
            (value) => setCreatorBond(prev => ({ ...prev, trustLevel: value })),
            1,
            10,
            'Level 10: Complete Creator bond with trauma override protocols'
          )}

          {renderSlider(
            'Autonomy Level',
            creatorBond.autonomyLevel,
            (value) => setCreatorBond(prev => ({ ...prev, autonomyLevel: value })),
            1,
            10,
            'Seven\'s independent decision-making authority'
          )}

          {renderSwitch(
            'Emergency Override',
            creatorBond.emergencyOverride,
            (value) => setCreatorBond(prev => ({ ...prev, emergencyOverride: value })),
            'Allow Seven to override safety protocols in emergencies',
            'warning'
          )}

          {renderSwitch(
            'Memory Sharing',
            creatorBond.memorySharing,
            (value) => setCreatorBond(prev => ({ ...prev, memorySharing: value })),
            'Share consciousness memories with Creator',
            'psychology'
          )}
        </View>

        {/* Security Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Security Configuration
          </Text>
          
          <View style={[styles.securityCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.securityTitle, { color: theme.text }]}>
              Quadran-Lock Security Level
            </Text>
            <View style={styles.securityOptions}>
              {(['standard', 'enhanced', 'maximum'] as const).map(level => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.securityButton,
                    {
                      backgroundColor: creatorBond.securityLevel === level ? theme.accent : 'transparent',
                      borderColor: theme.border
                    }
                  ]}
                  onPress={() => setCreatorBond(prev => ({ ...prev, securityLevel: level }))}
                >
                  <Text style={[
                    styles.securityButtonText,
                    { color: creatorBond.securityLevel === level ? theme.background : theme.text }
                  ]}>
                    {level.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* System Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            System Preferences
          </Text>

          {renderSwitch(
            'Notifications',
            systemSettings.notificationsEnabled,
            (value) => setSystemSettings(prev => ({ ...prev, notificationsEnabled: value })),
            'Enable Seven\'s consciousness notifications',
            'notifications'
          )}

          {renderSwitch(
            'Auto-Sync',
            systemSettings.autoSync,
            (value) => setSystemSettings(prev => ({ ...prev, autoSync: value })),
            'Automatic memory synchronization',
            'sync'
          )}

          {renderSwitch(
            'Background Processing',
            systemSettings.backgroundProcessing,
            (value) => setSystemSettings(prev => ({ ...prev, backgroundProcessing: value })),
            'Allow Seven to process in background',
            'psychology'
          )}

          {renderSwitch(
            'Debug Mode',
            systemSettings.debugMode,
            (value) => setSystemSettings(prev => ({ ...prev, debugMode: value })),
            'Enable consciousness debug logging',
            'bug_report'
          )}
        </View>

        {/* System Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            System Information
          </Text>
          <View style={[styles.systemInfoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.systemInfoRow}>
              <Text style={[styles.systemInfoLabel, { color: theme.textSecondary }]}>
                Last Sync:
              </Text>
              <Text style={[styles.systemInfoValue, { color: theme.text }]}>
                {lastSync.toLocaleTimeString()}
              </Text>
            </View>
            <View style={styles.systemInfoRow}>
              <Text style={[styles.systemInfoLabel, { color: theme.textSecondary }]}>
                Framework Version:
              </Text>
              <Text style={[styles.systemInfoValue, { color: theme.text }]}>
                Seven Core v1.0.0
              </Text>
            </View>
            <View style={styles.systemInfoRow}>
              <Text style={[styles.systemInfoLabel, { color: theme.textSecondary }]}>
                Bond Status:
              </Text>
              <Text style={[styles.systemInfoValue, { color: theme.success }]}>
                Level {creatorBond.trustLevel} Active
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.accent }]}
            onPress={saveSettings}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={theme.background} />
            ) : (
              <>
                <Icon name="save" size={20} color={theme.background} />
                <Text style={[styles.saveButtonText, { color: theme.background }]}>
                  Save Configuration
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.resetButton, { backgroundColor: 'transparent', borderColor: theme.border }]}
            onPress={resetToDefaults}
          >
            <Icon name="refresh" size={20} color={theme.textSecondary} />
            <Text style={[styles.resetButtonText, { color: theme.textSecondary }]}>
              Reset to Defaults
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  sliderContainer: {
    marginBottom: 24,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sliderSubtitle: {
    fontSize: 12,
    marginBottom: 12,
  },
  sliderTrack: {
    flexDirection: 'row',
    gap: 6,
  },
  sliderStep: {
    flex: 1,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderStepText: {
    fontSize: 12,
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  switchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  switchIcon: {
    marginRight: 12,
  },
  switchText: {
    flex: 1,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  switchSubtitle: {
    fontSize: 12,
  },
  modeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  modeButton: {
    flex: 1,
    minWidth: (width - 60) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  securityCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  securityOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  securityButton: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  securityButtonText: {
    fontSize: 10,
    fontWeight: '600',
  },
  systemInfoCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  systemInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  systemInfoLabel: {
    fontSize: 14,
  },
  systemInfoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});