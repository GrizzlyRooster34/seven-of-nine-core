/**
 * Agent Marketplace - Mobile Implementation
 * GitHub agent browser with mobile-optimized UI
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

interface Agent {
  id: string;
  name: string;
  description: string;
  author: string;
  stars: number;
  url: string;
}

export const AgentMarketplace: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder - integrate with GitHub API for agent discovery
    setTimeout(() => {
      setAgents([
        {
          id: '1',
          name: 'Code Reviewer',
          description: 'Automated code review and suggestions',
          author: 'seven-core',
          stars: 42,
          url: 'https://github.com/seven-core/agent-code-reviewer'
        },
        {
          id: '2', 
          name: 'Data Analyst',
          description: 'Statistical analysis and visualization',
          author: 'community',
          stars: 28,
          url: 'https://github.com/community/agent-data-analyst'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const installAgent = (agent: Agent) => {
    // TODO: Implement agent installation
    console.log('Installing agent:', agent.name);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading agents...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Agent Marketplace</Text>
      {agents.map(agent => (
        <View key={agent.id} style={styles.agentCard}>
          <Text style={styles.agentName}>{agent.name}</Text>
          <Text style={styles.agentDescription}>{agent.description}</Text>
          <Text style={styles.agentMeta}>by {agent.author} • ⭐ {agent.stars}</Text>
          <TouchableOpacity 
            style={styles.installButton}
            onPress={() => installAgent(agent)}
          >
            <Text style={styles.installButtonText}>Install</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  agentCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  agentName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  agentDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  agentMeta: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
  },
  installButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  installButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});