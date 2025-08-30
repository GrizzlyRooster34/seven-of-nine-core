/**
 * Session Manager - Mobile Implementation
 * Multi-session management with mobile-optimized UI
 */

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
  model: string;
}

export const SessionManager: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    // TODO: Load from AsyncStorage
    const mockSessions: ChatSession[] = [
      {
        id: '1',
        title: 'Code Review Session',
        lastMessage: 'The implementation looks good overall...',
        timestamp: new Date(),
        messageCount: 15,
        model: 'Claude-3.5-Sonnet'
      },
      {
        id: '2',
        title: 'Mobile App Planning',
        lastMessage: 'Let\'s discuss the UI components...',
        timestamp: new Date(Date.now() - 3600000),
        messageCount: 8,
        model: 'GPT-4'
      }
    ];
    setSessions(mockSessions);
    setActiveSession('1');
  };

  const createSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `Session ${sessions.length + 1}`,
      lastMessage: '',
      timestamp: new Date(),
      messageCount: 0,
      model: 'Claude-3.5-Sonnet'
    };
    setSessions([newSession, ...sessions]);
    setActiveSession(newSession.id);
  };

  const deleteSession = (sessionId: string) => {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setSessions(sessions.filter(s => s.id !== sessionId));
            if (activeSession === sessionId) {
              setActiveSession(sessions[0]?.id || null);
            }
          }
        }
      ]
    );
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const renderSession = ({ item }: { item: ChatSession }) => (
    <TouchableOpacity
      style={[
        styles.sessionCard,
        activeSession === item.id && styles.activeSession
      ]}
      onPress={() => setActiveSession(item.id)}
      onLongPress={() => deleteSession(item.id)}
    >
      <View style={styles.sessionHeader}>
        <Text style={styles.sessionTitle}>{item.title}</Text>
        <Text style={styles.sessionTime}>{formatTimestamp(item.timestamp)}</Text>
      </View>
      <Text style={styles.sessionLastMessage} numberOfLines={2}>
        {item.lastMessage || 'No messages yet'}
      </Text>
      <View style={styles.sessionFooter}>
        <Text style={styles.sessionMeta}>{item.messageCount} messages</Text>
        <Text style={styles.sessionModel}>{item.model}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat Sessions</Text>
        <TouchableOpacity style={styles.newButton} onPress={createSession}>
          <Text style={styles.newButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={sessions}
        keyExtractor={item => item.id}
        renderItem={renderSession}
        style={styles.sessionList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  newButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  newButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  sessionList: {
    flex: 1,
  },
  sessionCard: {
    backgroundColor: 'white',
    margin: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeSession: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  sessionTime: {
    fontSize: 12,
    color: '#6c757d',
  },
  sessionLastMessage: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 12,
    lineHeight: 20,
  },
  sessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionMeta: {
    fontSize: 12,
    color: '#6c757d',
  },
  sessionModel: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '500',
  },
});