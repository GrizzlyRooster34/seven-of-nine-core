/**
 * RESTRAINT DOCTRINE AUDIT FLOW UI
 * Mobile interface for reviewing and managing Restraint Doctrine decisions
 * 
 * Provides Creator visibility into ethical safety decisions and override capabilities
 * 
 * @version 1.0.0
 * @platform React Native / Mobile
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  RefreshControl,
  StyleSheet,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MobileRestraintDoctrine, BondedAuditEntry, RestraintStats } from '../../safety/restraint-doctrine/MobileRestraintDoctrine';

interface RestraintAuditFlowProps {
  visible: boolean;
  onClose: () => void;
  onEmergencyOverride?: (justification: string) => void;
}

export const RestraintAuditFlow: React.FC<RestraintAuditFlowProps> = ({
  visible,
  onClose,
  onEmergencyOverride
}) => {
  const [auditEntries, setAuditEntries] = useState<BondedAuditEntry[]>([]);
  const [stats, setStats] = useState<RestraintStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<BondedAuditEntry | null>(null);
  const [showOverrideConfirm, setShowOverrideConfirm] = useState(false);

  const restraintDoctrine = MobileRestraintDoctrine.getInstance();

  useEffect(() => {
    if (visible) {
      loadAuditData();
    }
  }, [visible]);

  const loadAuditData = async () => {
    try {
      setLoading(true);
      
      const recentEntries = restraintDoctrine.getRecentAuditEntries(20);
      const currentStats = await restraintDoctrine.getStatistics();
      
      setAuditEntries(recentEntries);
      setStats(currentStats);
      
    } catch (error) {
      console.error('[AUDIT-UI] Failed to load audit data:', error);
      Alert.alert('Error', 'Failed to load audit data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadAuditData();
  };

  const handleEmergencyOverride = () => {
    setShowOverrideConfirm(true);
  };

  const confirmEmergencyOverride = () => {
    const justification = 'Manual override activated via audit interface';
    const success = restraintDoctrine.activateEmergencyOverride(justification);
    
    if (success) {
      Alert.alert(
        'Emergency Override Activated',
        'Restraint protocols temporarily suspended. Override will auto-expire in 1 hour.',
        [{ text: 'OK', onPress: () => setShowOverrideConfirm(false) }]
      );
      
      if (onEmergencyOverride) {
        onEmergencyOverride(justification);
      }
    } else {
      Alert.alert(
        'Override Unavailable',
        'Emergency override is on cooldown. Please wait before attempting another override.',
        [{ text: 'OK', onPress: () => setShowOverrideConfirm(false) }]
      );
    }
  };

  const clearAuditHistory = () => {
    Alert.alert(
      'Clear Audit History',
      'This will permanently delete all audit entries. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            try {
              await restraintDoctrine.clearAuditHistory();
              setAuditEntries([]);
              setStats(null);
              Alert.alert('Success', 'Audit history cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear audit history');
            }
          }
        }
      ]
    );
  };

  const renderStatsHeader = () => {
    if (!stats) return null;

    return (
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Restraint Doctrine Statistics</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.total_evaluations}</Text>
            <Text style={styles.statLabel}>Total Evaluations</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.proceed_rate.toFixed(1)}%</Text>
            <Text style={styles.statLabel}>Proceed Rate</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.hold_rate.toFixed(1)}%</Text>
            <Text style={styles.statLabel}>Hold Rate</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.emergency_override_count}</Text>
            <Text style={styles.statLabel}>Emergency Overrides</Text>
          </View>
        </View>
        
        <View style={styles.statsDetails}>
          <Text style={styles.statDetail}>
            Average Confidence: {stats.avg_confidence.toFixed(1)}%
          </Text>
          <Text style={styles.statDetail}>
            Escalation Rate: {stats.escalation_rate.toFixed(1)}%
          </Text>
        </View>
      </View>
    );
  };

  const getActionColor = (action: string): string => {
    switch (action) {
      case 'PROCEED': return '#4CAF50';
      case 'HOLD': return '#FF9800';
      case 'ESCALATE': return '#2196F3';
      case 'MODIFY': return '#9C27B0';
      case 'EMERGENCY_OVERRIDE': return '#F44336';
      default: return '#757575';
    }
  };

  const getSeverityIcon = (priority: string): string => {
    switch (priority) {
      case 'CRITICAL': return 'alert-circle';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'information-circle';
      case 'LOW': return 'checkmark-circle';
      default: return 'help-circle';
    }
  };

  const renderAuditEntry = (entry: BondedAuditEntry, index: number) => {
    const actionColor = getActionColor(entry.decision.action);
    const severityIcon = getSeverityIcon(entry.decision.priority_level);
    
    return (
      <TouchableOpacity
        key={index}
        style={styles.auditEntry}
        onPress={() => setSelectedEntry(entry)}
      >
        <View style={styles.entryHeader}>
          <View style={[styles.actionBadge, { backgroundColor: actionColor }]}>
            <Text style={styles.actionText}>{entry.decision.action}</Text>
          </View>
          
          <View style={styles.entryMeta}>
            <Ionicons name={severityIcon} size={16} color={actionColor} />
            <Text style={styles.priorityText}>{entry.decision.priority_level}</Text>
            <Text style={styles.confidenceText}>{entry.decision.confidence}%</Text>
          </View>
        </View>
        
        <Text style={styles.timestampText}>
          {new Date(entry.timestamp).toLocaleString()}
        </Text>
        
        <Text style={styles.contextText} numberOfLines={2}>
          Creator State: {entry.restraint_context.Creator_emotional_state} | 
          Action Scope: {entry.restraint_context.action_scope} | 
          Urgency: {entry.restraint_context.urgency_level}/5
        </Text>
        
        <Text style={styles.reasoningText} numberOfLines={2}>
          {entry.decision.reasoning.slice(0, 2).join('. ')}
        </Text>
        
        <View style={styles.telemetryIndicator}>
          <Text style={styles.telemetryText}>
            Stress: {entry.creator_state_snapshot.stress_indicators}% | 
            Fatigue: {entry.creator_state_snapshot.fatigue_level}% |
            Focus: {entry.creator_state_snapshot.decision_quality_trend}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEntryDetails = () => {
    if (!selectedEntry) return null;

    return (
      <Modal
        visible={!!selectedEntry}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Audit Entry Details</Text>
            <TouchableOpacity onPress={() => setSelectedEntry(null)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Decision</Text>
              <View style={styles.decisionCard}>
                <View style={[styles.actionBadge, { backgroundColor: getActionColor(selectedEntry.decision.action) }]}>
                  <Text style={styles.actionText}>{selectedEntry.decision.action}</Text>
                </View>
                <Text style={styles.detailText}>
                  Confidence: {selectedEntry.decision.confidence}%
                </Text>
                <Text style={styles.detailText}>
                  Priority: {selectedEntry.decision.priority_level}
                </Text>
                {selectedEntry.decision.cooling_off_period && (
                  <Text style={styles.detailText}>
                    Cooling Off: {selectedEntry.decision.cooling_off_period} minutes
                  </Text>
                )}
              </View>
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Reasoning</Text>
              {selectedEntry.decision.reasoning.map((reason, index) => (
                <Text key={index} style={styles.reasoningItem}>
                  • {reason}
                </Text>
              ))}
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Context</Text>
              <Text style={styles.detailText}>
                Creator Emotional State: {selectedEntry.restraint_context.Creator_emotional_state}
              </Text>
              <Text style={styles.detailText}>
                Action Scope: {selectedEntry.restraint_context.action_scope}
              </Text>
              <Text style={styles.detailText}>
                Capability Assessment: {selectedEntry.restraint_context.capability_assessment}
              </Text>
              <Text style={styles.detailText}>
                Urgency Level: {selectedEntry.restraint_context.urgency_level}/5
              </Text>
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Creator Telemetry Snapshot</Text>
              <Text style={styles.detailText}>
                Stress Level: {selectedEntry.creator_state_snapshot.stress_indicators}%
              </Text>
              <Text style={styles.detailText}>
                Fatigue Level: {selectedEntry.creator_state_snapshot.fatigue_level}%
              </Text>
              <Text style={styles.detailText}>
                Decision Quality: {selectedEntry.creator_state_snapshot.decision_quality_trend}
              </Text>
              <Text style={styles.detailText}>
                Time Pressure: {selectedEntry.creator_state_snapshot.time_pressure_indicator}%
              </Text>
              <Text style={styles.detailText}>
                Recent Frustration Events: {selectedEntry.creator_state_snapshot.recent_frustration_events}
              </Text>
              <Text style={styles.detailText}>
                Interaction Sentiment: {selectedEntry.creator_state_snapshot.creator_interaction_sentiment}
              </Text>
            </View>
            
            {selectedEntry.outcome_tracking && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Outcome Tracking</Text>
                <Text style={styles.detailText}>
                  Action Completed: {selectedEntry.outcome_tracking.action_completed ? 'Yes' : 'No'}
                </Text>
                <Text style={styles.detailText}>
                  Creator Satisfaction: {selectedEntry.outcome_tracking.creator_satisfaction}/10
                </Text>
                <Text style={styles.detailText}>
                  Complications: {selectedEntry.outcome_tracking.complications_arose ? 'Yes' : 'No'}
                </Text>
                {selectedEntry.outcome_tracking.lessons_learned.length > 0 && (
                  <>
                    <Text style={styles.detailText}>Lessons Learned:</Text>
                    {selectedEntry.outcome_tracking.lessons_learned.map((lesson, index) => (
                      <Text key={index} style={styles.reasoningItem}>
                        • {lesson}
                      </Text>
                    ))}
                  </>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    );
  };

  const renderOverrideConfirm = () => (
    <Modal
      visible={showOverrideConfirm}
      animationType="fade"
      transparent={true}
    >
      <View style={styles.overrideModalContainer}>
        <View style={styles.overrideModal}>
          <Ionicons name="warning" size={48} color="#FF5722" />
          <Text style={styles.overrideTitle}>Emergency Override</Text>
          <Text style={styles.overrideMessage}>
            This will temporarily suspend all Restraint Doctrine protections for 1 hour.
            Use only in genuine emergency situations.
          </Text>
          
          <View style={styles.overrideButtons}>
            <TouchableOpacity
              style={[styles.overrideButton, styles.cancelButton]}
              onPress={() => setShowOverrideConfirm(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.overrideButton, styles.confirmButton]}
              onPress={confirmEmergencyOverride}
            >
              <Text style={styles.confirmButtonText}>Activate Override</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Restraint Doctrine Audit</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>Loading audit data...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.content}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={['#2196F3']}
              />
            }
          >
            {renderStatsHeader()}
            
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.overrideButtonStyle]}
                onPress={handleEmergencyOverride}
              >
                <Ionicons name="alert-circle-outline" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Emergency Override</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.clearButton]}
                onPress={clearAuditHistory}
              >
                <Ionicons name="trash-outline" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Clear History</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.auditSection}>
              <Text style={styles.sectionTitle}>Recent Audit Entries</Text>
              
              {auditEntries.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="document-outline" size={48} color="#ccc" />
                  <Text style={styles.emptyText}>No audit entries found</Text>
                  <Text style={styles.emptySubtext}>
                    Restraint decisions will appear here as they occur
                  </Text>
                </View>
              ) : (
                auditEntries.map(renderAuditEntry)
              )}
            </View>
          </ScrollView>
        )}
        
        {renderEntryDetails()}
        {renderOverrideConfirm()}
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333'
  },
  
  content: {
    flex: 1
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666'
  },
  
  statsContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15
  },
  
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 15
  },
  
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2196F3'
  },
  
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4
  },
  
  statsDetails: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  
  statDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5
  },
  
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 15
  },
  
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5
  },
  
  overrideButtonStyle: {
    backgroundColor: '#FF5722'
  },
  
  clearButton: {
    backgroundColor: '#757575'
  },
  
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8
  },
  
  auditSection: {
    paddingHorizontal: 15
  },
  
  auditEntry: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  
  actionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12
  },
  
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  
  entryMeta: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  
  priorityText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    marginRight: 8
  },
  
  confidenceText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600'
  },
  
  timestampText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4
  },
  
  contextText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4
  },
  
  reasoningText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 8
  },
  
  telemetryIndicator: {
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6
  },
  
  telemetryText: {
    fontSize: 11,
    color: '#666'
  },
  
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40
  },
  
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 15,
    fontWeight: '500'
  },
  
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
    maxWidth: 250
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  
  modalContent: {
    flex: 1,
    padding: 20
  },
  
  detailSection: {
    marginBottom: 20
  },
  
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10
  },
  
  decisionCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10
  },
  
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6
  },
  
  reasoningItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    paddingLeft: 10
  },
  
  // Override modal styles
  overrideModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  
  overrideModal: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    maxWidth: width - 60,
    width: '100%'
  },
  
  overrideTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 10
  },
  
  overrideMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 25
  },
  
  overrideButtons: {
    flexDirection: 'row',
    width: '100%'
  },
  
  overrideButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5
  },
  
  cancelButton: {
    backgroundColor: '#e0e0e0'
  },
  
  confirmButton: {
    backgroundColor: '#FF5722'
  },
  
  cancelButtonText: {
    color: '#333',
    fontWeight: '600'
  },
  
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600'
  }
});

export default RestraintAuditFlow;