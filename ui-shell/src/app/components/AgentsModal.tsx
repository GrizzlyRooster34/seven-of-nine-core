import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Plus, Loader2, Play, Clock, CheckCircle, XCircle, Trash2, Import, ChevronDown, FileJson, Globe, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Toast } from '@/app/components/ui/toast';
import { api, type Agent, type AgentRunWithMetrics } from '@/app/lib/api';
import { useTabState } from '@/app/hooks/useTabState';
import { formatISOTimestamp } from '@/app/lib/date-utils';
import { open as openDialog, save } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';
import { GitHubAgentBrowser } from '@/app/components/GitHubAgentBrowser';

interface AgentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AgentsModal: React.FC<AgentsModalProps> = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState('agents');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [runningAgents, setRunningAgents] = useState<AgentRunWithMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [showGitHubBrowser, setShowGitHubBrowser] = useState(false);
  const { createAgentTab, createCreateAgentTab } = useTabState();

  
  useEffect(() => {
    if (open) {
      loadAgents();
      loadRunningAgents();
    }
  }, [open]);

  
  useEffect(() => {
    if (!open) return;
    
    const interval = setInterval(() => {
      loadRunningAgents();
    }, 3000); 

    return () => clearInterval(interval);
  }, [open]);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const agentList = await api.listAgents();
      setAgents(agentList);
    } catch (error) {
      console.error('Failed to load agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRunningAgents = async () => {
    try {
      const runs = await api.listRunningAgentSessions();
      const agentRuns = runs.map(run => ({
        id: run.id,
        agent_id: run.agent_id,
        agent_name: run.agent_name,
        task: run.task,
        model: run.model,
        status: 'running' as const,
        created_at: run.created_at,
        project_path: run.project_path,
      } as AgentRunWithMetrics));
      
      setRunningAgents(agentRuns);
    } catch (error) {
      console.error('Failed to load running agents:', error);
    }
  };

  const handleRunAgent = async (agent: Agent) => {
    
    const tabId = `agent-exec-${agent.id}-${Date.now()}`;
    
    
    onOpenChange(false);
    
    
    window.dispatchEvent(new CustomEvent('open-agent-execution', { 
      detail: { agent, tabId } 
    }));
  };

  const handleDeleteAgent = async (agent: Agent) => {
    setAgentToDelete(agent);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!agentToDelete?.id) return;
    try {
      await api.deleteAgent(agentToDelete.id);
      loadAgents(); 
      setShowDeleteDialog(false);
      setAgentToDelete(null);
    } catch (error) {
      console.error('Failed to delete agent:', error);
    }
  };

  const handleOpenAgentRun = (run: AgentRunWithMetrics) => {
    
    createAgentTab(run.id!.toString(), run.agent_name);
    onOpenChange(false);
  };

  const handleCreateAgent = () => {
    
    onOpenChange(false);
    createCreateAgentTab();
  };

  const handleImportFromFile = async () => {
    try {
      const filePath = await openDialog({
        multiple: false,
        filters: [{
          name: 'JSON',
          extensions: ['json']
        }]
      });
      
      if (filePath) {
        const agent = await api.importAgentFromFile(filePath as string);
        loadAgents(); 
        setToast({ message: `Agent "${agent.name}" imported successfully`, type: "success" });
      }
    } catch (error) {
      console.error('Failed to import agent:', error);
      setToast({ message: "Failed to import agent", type: "error" });
    }
  };

  const handleImportFromGitHub = () => {
    setShowGitHubBrowser(true);
  };

  const handleExportAgent = async (agent: Agent) => {
    try {
      const exportData = await api.exportAgent(agent.id!);
      const filePath = await save({
        defaultPath: `${agent.name.toLowerCase().replace(/\s+/g, '-')}.json`,
        filters: [{
          name: 'JSON',
          extensions: ['json']
        }]
      });
      
      if (filePath) {
        await invoke('write_file', { path: filePath, content: JSON.stringify(exportData, null, 2) });
        setToast({ message: "Agent exported successfully", type: "success" });
      }
    } catch (error) {
      console.error('Failed to export agent:', error);
      setToast({ message: "Failed to export agent", type: "error" });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[600px] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Agent Management
          </DialogTitle>
          <DialogDescription>
            Create new agents or manage running agent executions
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="mx-6">
            <TabsTrigger value="agents">Available Agents</TabsTrigger>
            <TabsTrigger value="running" className="relative">
              Running Agents
              {runningAgents.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                  {runningAgents.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="agents" className="h-full m-0">
              <ScrollArea className="h-full px-6 pb-6">
                
                <div className="flex gap-2 mb-4 pt-4">
                  <Button onClick={handleCreateAgent} className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Agent
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        <Import className="w-4 h-4 mr-2" />
                        Import Agent
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={handleImportFromFile}>
                        <FileJson className="w-4 h-4 mr-2" />
                        From File
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleImportFromGitHub}>
                        <Globe className="w-4 h-4 mr-2" />
                        From GitHub
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
