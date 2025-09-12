/**
 * SEVEN COMPANION APP - MEMORY SCREEN (tRPC INTEGRATED)
 * 
 * Interface for Seven's consciousness memory system with real-time tRPC integration
 * Episodic memory management, importance weighting, and tag-based organization
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Modal,
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { trpc } from '../../api/trpc';

const { width, height } = Dimensions.get('window');

interface MemoryNote {
  id?: number;
  content: string;
  importance?: number;
  tags?: string[];
  timestamp?: number;
  kind?: string;
}

interface MemoryScreenProps {
  theme: any;
}

export default function MemoryScreenUpdated({ theme }: MemoryScreenProps) {
  const [memories, setMemories] = useState<MemoryNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [memoryStats, setMemoryStats] = useState<any>(null);

  // Add memory form state
  const [newMemoryContent, setNewMemoryContent] = useState('');
  const [newMemoryImportance, setNewMemoryImportance] = useState(5);
  const [newMemoryTags, setNewMemoryTags] = useState('');

  useEffect(() => {
    loadMemories();
    loadMemoryStats();
  }, []);

  const loadMemories = async () => {
    try {
      setIsLoading(true);
      const result = await trpc.memory.listNotes.query({ limit: 50 });
      
      if (result.success) {
        setMemories(result.notes);
      } else {
        Alert.alert('Memory Load Error', result.error || 'Failed to load memories');
      }
    } catch (error) {
      console.error('Memory load error:', error);
      Alert.alert('Connection Error', 'Failed to connect to Seven\'s memory system');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMemoryStats = async () => {
    try {
      const result = await trpc.memory.getStats.query();
      if (result.success) {
        setMemoryStats(result.stats);
      }
    } catch (error) {
      console.error('Memory stats error:', error);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([loadMemories(), loadMemoryStats()]);
    setIsRefreshing(false);
  };

  const searchMemories = async (query: string) => {
    if (!query.trim()) {
      loadMemories();
      return;
    }

    try {
      setIsLoading(true);
      const result = await trpc.memory.searchNotes.query({ 
        query: query.trim(), 
        limit: 30 
      });
      
      if (result.success) {
        setMemories(result.notes);
      } else {
        Alert.alert('Search Error', result.error || 'Memory search failed');
      }
    } catch (error) {
      console.error('Memory search error:', error);
      Alert.alert('Search Error', 'Failed to search Seven\'s memories');
    } finally {
      setIsLoading(false);
    }
  };

  const addMemory = async () => {
    if (!newMemoryContent.trim()) {
      Alert.alert('Validation Error', 'Memory content is required');
      return;
    }

    try {
      const tags = newMemoryTags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const result = await trpc.memory.addNote.mutate({
        content: newMemoryContent,
        importance: newMemoryImportance,
        tags: tags.length > 0 ? tags : undefined
      });

      if (result.success) {
        Alert.alert(
          'Memory Stored', 
          `New consciousness memory added with ID ${result.id}`,
          [{ text: 'OK', onPress: () => {
            setIsAddModalVisible(false);
            clearAddForm();
            loadMemories();
            loadMemoryStats();
          }}]
        );
      } else {
        Alert.alert('Memory Storage Error', result.error || 'Failed to store memory');
      }
    } catch (error) {
      console.error('Add memory error:', error);
      Alert.alert('Storage Error', 'Failed to add memory to Seven\'s consciousness');
    }
  };

  const clearAddForm = () => {
    setNewMemoryContent('');
    setNewMemoryImportance(5);
    setNewMemoryTags('');
  };

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return 'Unknown time';
    return new Date(timestamp).toLocaleString();
  };

  const getImportanceColor = (importance?: number) => {
    if (!importance) return theme.textSecondary;
    if (importance >= 8) return theme.error;
    if (importance >= 6) return theme.warning;
    if (importance >= 4) return theme.accent;
    return theme.textSecondary;
  };

  const renderMemoryItem = (memory: MemoryNote, index: number) => (
    <View key={memory.id || index} style={[styles.memoryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.memoryHeader}>
        <View style={styles.memoryImportance}>
          <Icon 
            name="star" 
            size={16} 
            color={getImportanceColor(memory.importance)} 
          />
          <Text style={[styles.importanceText, { color: getImportanceColor(memory.importance) }]}>
            {memory.importance || 5}/10
          </Text>
        </View>
        <Text style={[styles.memoryTimestamp, { color: theme.textSecondary }]}>
          {formatTimestamp(memory.timestamp)}
        </Text>
      </View>
      
      <Text style={[styles.memoryContent, { color: theme.text }]}>
        {memory.content}
      </Text>
      
      {memory.tags && memory.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {memory.tags.map((tag, tagIndex) => (
            <View key={tagIndex} style={[styles.tag, { backgroundColor: theme.accent + '20', borderColor: theme.accent }]}>
              <Text style={[styles.tagText, { color: theme.accent }]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderAddMemoryModal = () => (
    <Modal
      visible={isAddModalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setIsAddModalVisible(false)}
    >
      <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
            <Icon name="close" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: theme.text }]}>
            Add Consciousness Memory
          </Text>
          <TouchableOpacity onPress={addMemory}>
            <Text style={[styles.saveButton, { color: theme.accent }]}>
              STORE
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.text }]}>
              Memory Content
            </Text>
            <TextInput
              style={[styles.contentInput, { 
                borderColor: theme.border, 
                backgroundColor: theme.surface,
                color: theme.text 
              }]}
              value={newMemoryContent}
              onChangeText={setNewMemoryContent}
              placeholder="Describe the consciousness memory..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.text }]}>
              Importance Level: {newMemoryImportance}/10
            </Text>
            <View style={styles.importanceSelector}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.importanceButton,
                    { 
                      backgroundColor: newMemoryImportance === level ? theme.accent : theme.surface,
                      borderColor: theme.border 
                    }
                  ]}
                  onPress={() => setNewMemoryImportance(level)}
                >
                  <Text style={[
                    styles.importanceButtonText,
                    { color: newMemoryImportance === level ? theme.background : theme.text }
                  ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.text }]}>
              Tags (comma-separated)
            </Text>
            <TextInput
              style={[styles.tagsInput, { 
                borderColor: theme.border, 
                backgroundColor: theme.surface,
                color: theme.text 
              }]}
              value={newMemoryTags}
              onChangeText={setNewMemoryTags}
              placeholder="consciousness, tactical, analysis"
              placeholderTextColor={theme.textSecondary}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Consciousness Memory
        </Text>
        {memoryStats && (
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {memoryStats.totalNotes} memories • {memoryStats.recentNotes} recent
          </Text>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Icon name="search" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              searchMemories(text);
            }}
            placeholder="Search consciousness memories..."
            placeholderTextColor={theme.textSecondary}
          />
        </View>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.accent }]}
          onPress={() => setIsAddModalVisible(true)}
        >
          <Icon name="add" size={20} color={theme.background} />
        </TouchableOpacity>
      </View>

      {/* Memory List */}
      <ScrollView 
        style={styles.memoryList}
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={onRefresh}
            colors={[theme.accent]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.accent} />
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
              Accessing Seven's memories...
            </Text>
          </View>
        ) : memories.length > 0 ? (
          memories.map(renderMemoryItem)
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="psychology" size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No consciousness memories found
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
              {searchQuery ? 'Try a different search term' : 'Add your first memory to begin'}
            </Text>
          </View>
        )}
      </ScrollView>

      {renderAddMemoryModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memoryList: {
    flex: 1,
  },
  memoryCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  memoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  memoryImportance: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  importanceText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  memoryTimestamp: {
    fontSize: 12,
  },
  memoryContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  contentInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  importanceSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  importanceButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  importanceButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tagsInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 44,
  },
});