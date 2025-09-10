import { Tab } from '@/app/contexts/TabContext';
import { useCallback, useMemo } from 'react';
import { useTabContext } from '@/app/contexts/TabContext';

interface UseTabStateReturn {
  
  tabs: Tab[];
  activeTab: Tab | undefined;
  activeTabId: string | null;
  tabCount: number;
  chatTabCount: number;
  agentTabCount: number;
  
  
  createChatTab: (projectId?: string, title?: string) => string;
  createAgentTab: (agentRunId: string, agentName: string) => string;
  createAgentExecutionTab: (agent: any, tabId: string) => string;
  createProjectsTab: () => string | null;
  createUsageTab: () => string | null;
  createMCPTab: () => string | null;
  createSettingsTab: () => string | null;
  createClaudeMdTab: () => string | null;
  createClaudeFileTab: (fileId: string, fileName: string) => string;
  createCreateAgentTab: () => string;
  createImportAgentTab: () => string;
  closeTab: (id: string, force?: boolean) => Promise<boolean>;
  closeCurrentTab: () => Promise<boolean>;
  switchToTab: (id: string) => void;
  switchToNextTab: () => void;
  switchToPreviousTab: () => void;
  switchToTabByIndex: (index: number) => void;
  updateTab: (id: string, updates: Partial<Tab>) => void;
  updateTabTitle: (id: string, title: string) => void;
  updateTabStatus: (id: string, status: Tab['status']) => void;
  markTabAsChanged: (id: string, hasChanges: boolean) => void;
  findTabBySessionId: (sessionId: string) => Tab | undefined;
  findTabByAgentRunId: (agentRunId: string) => Tab | undefined;
  findTabByType: (type: Tab['type']) => Tab | undefined;
  canAddTab: () => boolean;
}

export const useTabState = (): UseTabStateReturn => {
  const {
    tabs,
    activeTabId,
    addTab,
    removeTab,
    updateTab,
    setActiveTab,
    getTabById,
    getTabsByType
  } = useTabContext();

  const activeTab = useMemo(() => 
    activeTabId ? getTabById(activeTabId) : undefined,
    [activeTabId, getTabById]
  );

  const tabCount = tabs.length;
  const chatTabCount = useMemo(() => getTabsByType('chat').length, [getTabsByType]);
  const agentTabCount = useMemo(() => getTabsByType('agent').length, [getTabsByType]);

  const createChatTab = useCallback((projectId?: string, title?: string): string => {
    const tabTitle = title || `Chat ${chatTabCount + 1}`;
    return addTab({
      type: 'chat',
      title: tabTitle,
      sessionId: projectId,
      status: 'idle',
      hasUnsavedChanges: false,
      icon: 'message-square'
    });
  }, [addTab, chatTabCount]);

  const createAgentTab = useCallback((agentRunId: string, agentName: string): string => {
    
    const existingTab = tabs.find(tab => tab.agentRunId === agentRunId);
    if (existingTab) {
      setActiveTab(existingTab.id);
      return existingTab.id;
    }

    return addTab({
      type: 'agent',
      title: agentName,
      agentRunId,
      status: 'running',
      hasUnsavedChanges: false,
      icon: 'bot'
    });
  }, [addTab, tabs, setActiveTab]);

  const createProjectsTab = useCallback((): string | null => {
    
    const existingTab = tabs.find(tab => tab.type === 'projects');
    if (existingTab) {
      setActiveTab(existingTab.id);
      return existingTab.id;
    }

    return addTab({
      type: 'projects',
      title: 'CC Projects',
      status: 'idle',
      hasUnsavedChanges: false,
      icon: 'folder'
    });
  }, [addTab, tabs, setActiveTab]);

  const createUsageTab = useCallback((): string | null => {
    
    const existingTab = tabs.find(tab => tab.type === 'usage');
    if (existingTab) {
      setActiveTab(existingTab.id);
      return existingTab.id;
    }

    return addTab({
      type: 'usage',
      title: 'Usage',
      status: 'idle',
      hasUnsavedChanges: false,
      icon: 'bar-chart'
    });
  }, [addTab, tabs, setActiveTab]);

  const createMCPTab = useCallback((): string | null => {
    
    const existingTab = tabs.find(tab => tab.type === 'mcp');
    if (existingTab) {
      setActiveTab(existingTab.id);
      return existingTab.id;
    }

    return addTab({
      type: 'mcp',
      title: 'MCP Servers',
      status: 'idle',
      hasUnsavedChanges: false,
      icon: 'server'
    });
  }, [addTab, tabs, setActiveTab]);

  const createSettingsTab = useCallback((): string | null => {
    
    const existingTab = tabs.find(tab => tab.type === 'settings');
    if (existingTab) {
      setActiveTab(existingTab.id);
      return existingTab.id;
    }

    return addTab({
      type: 'settings',
      title: 'Settings',
      status: 'idle',
      hasUnsavedChanges: false,
      icon: 'settings'
    });
  }, [addTab, tabs, setActiveTab]);

  const createClaudeMdTab = useCallback((): string | null => {
    
    const existingTab = tabs.find(tab => tab.type === 'claude-md');
    if (existingTab) {
      setActiveTab(existingTab.id);
      return existingTab.id;
    }

    return addTab({
      type: 'claude-md',
      title: 'CLAUDE.md',
      status: 'idle',
      hasUnsavedChanges: false,
      icon: 'file-text'
    });
  }, [addTab, tabs, setActiveTab]);

  const createClaudeFileTab = useCallback((fileId: string, fileName: string): string => {
    
    const existingTab = tabs.find(tab => tab.type === 'claude-file' && tab.claudeFileId === fileId);
    if (existingTab) {
      setActiveTab(existingTab.id);
      return existingTab.id;
    }

    return addTab({
      type: 'claude-file',
      title: fileName,
      claudeFileId: fileId,
      status: 'idle',
      hasUnsavedChanges: false,
      icon: 'file-text'
    });
  }, [addTab, tabs, setActiveTab]);

  const createAgentExecutionTab = useCallback((agent: any, _tabId: string): string => {
    return addTab({
      type: 'agent-execution',
      title: `Run: ${agent.name}`,
      agentData: agent,
      status: 'idle',
      hasUnsavedChanges: false,
      icon: 'bot'
    });
  }, [addTab]);

  const createCreateAgentTab = useCallback((): string => {
    
    const existingTab = tabs.find(tab => tab.type === 'create-agent');
    if (existingTab) {
      setActiveTab(existingTab.id);
      return existingTab.id;
    }

    return addTab({
      type: 'create-agent',
      title: 'Create Agent',
      status: 'idle',
      hasUnsavedChanges: false,
      icon: 'plus'
    });
  }, [addTab, tabs, setActiveTab]);

  const createImportAgentTab = useCallback((): string => {
    
    const existingTab = tabs.find(tab => tab.type === 'import-agent');
    if (existingTab) {
      setActiveTab(existingTab.id);
      return existingTab.id;
    }

    return addTab({
      type: 'import-agent',
      title: 'Import Agent',
      status: 'idle',
      hasUnsavedChanges: false,
      icon: 'import'
    });
  }, [addTab, tabs, setActiveTab]);

  const closeTab = useCallback(async (id: string, force: boolean = false): Promise<boolean> => {
    const tab = getTabById(id);
    if (!tab) return true;

    
    if (!force && tab.hasUnsavedChanges) {
      
      const confirmed = window.confirm(`Tab "${tab.title}" has unsaved changes. Close anyway?`);
      if (!confirmed) return false;
    }
