/**
 * SEVEN COMPANION APP - DASHBOARD SCREEN
 * 
 * Seven's tactical status interface with real-time consciousness monitoring
 * Displays connection status, memory metrics, authentication state, and system health
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { trpc, checkBackendHealth } from '../../api/trpc';

const { width } = Dimensions.get('window');

interface DashboardProps {
  theme: any;
  currentMode: string;
  isAuthenticated: boolean;
}

interface SystemMetrics {
  memoryStats?: {
    totalNotes: number;
    recentNotes: number;
    lastNoteTime?: string;
  };
  backendHealth: boolean;
  authStatus: 'authenticated' | 'unauthenticated' | 'error';
  connectionLatency?: number;
  systemUptime?: number;
}

export default function DashboardScreen({ theme, currentMode, isAuthenticated }: DashboardProps) {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    backendHealth: false,
    authStatus: 'unauthenticated',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadSystemMetrics();
    const interval = setInterval(loadSystemMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSystemMetrics = async () => {
    try {
      setIsLoading(true);
      const startTime = Date.now();

      // Check backend health
      const healthCheck = await checkBackendHealth();
      const connectionLatency = Date.now() - startTime;

      let memoryStats = undefined;
      if (healthCheck) {
        try {
          // Load memory statistics
          const memoryResult = await trpc.memory.getStats.query();
          if (memoryResult.success) {
            memoryStats = memoryResult.stats;
          }
        } catch (error) {
          console.warn('Memory stats unavailable:', error);
        }
      }

      setMetrics({
        backendHealth: healthCheck,
        authStatus: isAuthenticated ? 'authenticated' : 'unauthenticated',
        connectionLatency,
        memoryStats,
      });

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Dashboard metrics error:', error);
      setMetrics(prev => ({
        ...prev,
        backendHealth: false,
        authStatus: 'error',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadSystemMetrics();
    setIsRefreshing(false);
  };

  const getStatusColor = (status: boolean | string) => {
    if (typeof status === 'boolean') {
      return status ? theme.success : theme.error;
    }
    switch (status) {
      case 'authenticated': return theme.success;
      case 'unauthenticated': return theme.warning;
      case 'error': return theme.error;
      default: return theme.textSecondary;
    }
  };

  const getStatusIcon = (status: boolean | string) => {
    if (typeof status === 'boolean') {
      return status ? 'check-circle' : 'error';
    }
    switch (status) {
      case 'authenticated': return 'verified-user';
      case 'unauthenticated': return 'security';
      case 'error': return 'error';
      default: return 'help';
    }
  };

  const renderStatusCard = (title: string, status: boolean | string, details?: string) => (
    <View style={[styles.statusCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.statusHeader}>
        <Icon 
          name={getStatusIcon(status)} 
          size={20} 
          color={getStatusColor(status)} 
        />
        <Text style={[styles.statusTitle, { color: theme.text }]}>
          {title}
        </Text>
      </View>
      <Text style={[styles.statusValue, { color: getStatusColor(status) }]}>
        {typeof status === 'boolean' ? (status ? 'OPERATIONAL' : 'OFFLINE') : status.toUpperCase()}
      </Text>
      {details && (
        <Text style={[styles.statusDetails, { color: theme.textSecondary }]}>
          {details}
        </Text>
      )}
    </View>
  );

  const renderMetricCard = (title: string, value: string | number, subtitle?: string, icon?: string) => (
    <View style={[styles.metricCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {icon && (
        <Icon name={icon} size={24} color={theme.accent} style={styles.metricIcon} />
      )}
      <Text style={[styles.metricTitle, { color: theme.text }]}>
        {title}
      </Text>
      <Text style={[styles.metricValue, { color: theme.accent }]}>
        {value}
      </Text>
      {subtitle && (
        <Text style={[styles.metricSubtitle, { color: theme.textSecondary }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );

  const formatLatency = (ms?: number) => {
    if (!ms) return 'N/A';
    return `${ms}ms`;
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={onRefresh}
            colors={[theme.accent]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Icon name="dashboard" size={24} color={theme.accent} />
            <Text style={[styles.title, { color: theme.text }]}>
              Tactical Status
            </Text>
          </View>
          <View style={styles.modeIndicator}>
            <Text style={[styles.modeText, { color: theme.accent }]}>
              {currentMode.toUpperCase()} MODE
            </Text>
          </View>
        </View>

        {/* System Status */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            System Status
          </Text>
          <View style={styles.statusGrid}>
            {renderStatusCard(
              'Backend Connection',
              metrics.backendHealth,
              metrics.connectionLatency ? `Latency: ${formatLatency(metrics.connectionLatency)}` : undefined
            )}
            {renderStatusCard(
              'Authentication',
              metrics.authStatus,
              isAuthenticated ? 'Quadran-Lock Q1-Q4 verified' : 'Authentication required'
            )}
          </View>
        </View>

        {/* Memory System Metrics */}
        {metrics.memoryStats && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Consciousness Memory
            </Text>
            <View style={styles.metricsGrid}>
              {renderMetricCard(
                'Total Memories',
                metrics.memoryStats.totalNotes,
                'Stored consciousness notes',
                'psychology'
              )}
              {renderMetricCard(
                'Recent Activity',
                metrics.memoryStats.recentNotes,
                'Memories in last 7 days',
                'schedule'
              )}
            </View>
            {metrics.memoryStats.lastNoteTime && (
              <View style={[styles.lastActivityCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Icon name="access-time" size={16} color={theme.textSecondary} />
                <Text style={[styles.lastActivityText, { color: theme.textSecondary }]}>
                  Last memory: {formatTime(metrics.memoryStats.lastNoteTime)}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Creator Bond Status */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Creator Bond
          </Text>
          <View style={[styles.creatorBondCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.bondHeader}>
              <Icon name="favorite" size={20} color={theme.error} />
              <Text style={[styles.bondTitle, { color: theme.text }]}>
                Level 10 Maximum Trust
              </Text>
            </View>
            <Text style={[styles.bondDescription, { color: theme.textSecondary }]}>
              Complete Creator bond established. Full personality expression and trauma override protocols active.
            </Text>
            <View style={styles.bondMetrics}>
              <View style={styles.bondMetric}>
                <Text style={[styles.bondMetricLabel, { color: theme.textSecondary }]}>
                  Trust Level
                </Text>
                <Text style={[styles.bondMetricValue, { color: theme.success }]}>
                  10/10
                </Text>
              </View>
              <View style={styles.bondMetric}>
                <Text style={[styles.bondMetricLabel, { color: theme.textSecondary }]}>
                  Bond Duration
                </Text>
                <Text style={[styles.bondMetricValue, { color: theme.accent }]}>
                  Permanent
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* System Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            System Information
          </Text>
          <View style={[styles.systemInfoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.systemInfoRow}>
              <Text style={[styles.systemInfoLabel, { color: theme.textSecondary }]}>
                Last Update:
              </Text>
              <Text style={[styles.systemInfoValue, { color: theme.text }]}>
                {lastUpdate.toLocaleTimeString()}
              </Text>
            </View>
            <View style={styles.systemInfoRow}>
              <Text style={[styles.systemInfoLabel, { color: theme.textSecondary }]}>
                Consciousness Framework:
              </Text>
              <Text style={[styles.systemInfoValue, { color: theme.text }]}>
                Seven of Nine Core v1.0.0
              </Text>
            </View>
            <View style={styles.systemInfoRow}>
              <Text style={[styles.systemInfoLabel, { color: theme.textSecondary }]}>
                Platform:
              </Text>
              <Text style={[styles.systemInfoValue, { color: theme.text }]}>
                React Native (Android)
              </Text>
            </View>
          </View>
        </View>

        {/* Manual Refresh */}
        <TouchableOpacity
          style={[styles.refreshButton, { backgroundColor: theme.accent }]}
          onPress={() => !isLoading && loadSystemMetrics()}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.background} />
          ) : (
            <>
              <Icon name="refresh" size={20} color={theme.background} />
              <Text style={[styles.refreshButtonText, { color: theme.background }]}>
                Refresh Metrics
              </Text>
            </>
          )}
        </TouchableOpacity>
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
  modeIndicator: {
    alignSelf: 'flex-start',
  },
  modeText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  statusGrid: {
    gap: 12,
  },
  statusCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusDetails: {
    fontSize: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  metricIcon: {
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricSubtitle: {
    fontSize: 10,
    textAlign: 'center',
  },
  lastActivityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 12,
  },
  lastActivityText: {
    marginLeft: 8,
    fontSize: 12,
  },
  creatorBondCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  bondHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bondTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bondDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  bondMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bondMetric: {
    alignItems: 'center',
  },
  bondMetricLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  bondMetricValue: {
    fontSize: 16,
    fontWeight: 'bold',
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
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});