import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2, Bot, FolderCode } from "lucide-react";
import { api, type Project, type Session, type ClaudeMdFile } from "@/app/lib/api";
import { OutputCacheProvider } from "@/app/lib/outputCache";
import { TabProvider } from "@/app/contexts/TabContext";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { ProjectList } from "@/app/components/ProjectList";
import { SessionList } from "@/app/components/SessionList";
import { RunningClaudeSessions } from "@/app/components/RunningClaudeSessions";
import { Topbar } from "@/app/components/Topbar";
import { MarkdownEditor } from "@/app/components/MarkdownEditor";
import { ClaudeFileEditor } from "@/app/components/ClaudeFileEditor";
import { Settings } from "@/app/components/Settings";
import { CCAgents } from "@/app/components/CCAgents";
import { UsageDashboard } from "@/app/components/UsageDashboard";
import { MCPManager } from "@/app/components/MCPManager";
import { NFOCredits } from "@/app/components/NFOCredits";
import { ClaudeBinaryDialog } from "@/app/components/ClaudeBinaryDialog";
import { Toast, ToastContainer } from "@/app/components/ui/toast";
import { ProjectSettings } from '@/app/components/ProjectSettings';
import { TabManager } from "@/app/components/TabManager";
import { TabContent } from "@/app/components/TabContent";
import { AgentsModal } from "@/app/components/AgentsModal";
import { useTabState } from "@/app/hooks/useTabState";
import { TrustLadderDisplay } from "@/app/components/TrustLadderDisplay";
import { SevenBootMessage } from "@/app/components/SevenBootMessage";

type View = 
  | "welcome" 
  | "projects" 
  | "editor" 
  | "claude-file-editor" 
  | "settings"
  | "cc-agents"
  | "create-agent"
  | "github-agents"
  | "agent-execution"
  | "agent-run-view"
  | "mcp"
  | "usage-dashboard"
  | "project-settings"
  | "tabs"; 


function AppContent() {
  const [view, setView] = useState<View>("tabs");
  const { createClaudeMdTab, createSettingsTab, createUsageTab, createMCPTab } = useTabState();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [editingClaudeFile, setEditingClaudeFile] = useState<ClaudeMdFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNFO, setShowNFO] = useState(false);
  const [showClaudeBinaryDialog, setShowClaudeBinaryDialog] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [projectForSettings, setProjectForSettings] = useState<Project | null>(null);
  const [previousView] = useState<View>("welcome");
  const [showAgentsModal, setShowAgentsModal] = useState(false);

  
  useEffect(() => {
    if (view === "projects") {
      loadProjects();
    } else if (view === "welcome") {
      
      setLoading(false);
    }
  }, [view]);

  
  useEffect(() => {
    if (view !== "tabs") return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;
      
      if (modKey) {
        switch (e.key) {
          case 't':
            e.preventDefault();
            window.dispatchEvent(new CustomEvent('create-chat-tab'));
            break;
          case 'w':
            e.preventDefault();
            window.dispatchEvent(new CustomEvent('close-current-tab'));
            break;
          case 'Tab':
            e.preventDefault();
            if (e.shiftKey) {
              window.dispatchEvent(new CustomEvent('switch-to-previous-tab'));
            } else {
              window.dispatchEvent(new CustomEvent('switch-to-next-tab'));
            }
            break;
          default:
            
            if (e.key >= '1' && e.key <= '9') {
              e.preventDefault();
              const index = parseInt(e.key) - 1;
              window.dispatchEvent(new CustomEvent('switch-to-tab-by-index', { detail: { index } }));
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view]);

  
  useEffect(() => {
    const handleClaudeNotFound = () => {
      setShowClaudeBinaryDialog(true);
    };

    window.addEventListener('claude-not-found', handleClaudeNotFound as EventListener);
    return () => {
      window.removeEventListener('claude-not-found', handleClaudeNotFound as EventListener);
    };
  }, []);

  
  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const projectList = await api.listProjects();
      setProjects(projectList);
    } catch (err) {
      console.error("Failed to load projects:", err);
      setError("Failed to load projects. Please ensure ~/.claude directory exists.");
    } finally {
      setLoading(false);
    }
  };

  
  const handleProjectClick = async (project: Project) => {
    try {
      setLoading(true);
      setError(null);
      const sessionList = await api.getProjectSessions(project.id);
      setSessions(sessionList);
      setSelectedProject(project);
    } catch (err) {
      console.error("Failed to load sessions:", err);
      setError("Failed to load sessions for this project.");
    } finally {
      setLoading(false);
    }
  };

  
  const handleNewSession = async () => {
    handleViewChange("tabs");
    
  };

  
  const handleBack = () => {
    setSelectedProject(null);
    setSessions([]);
  };

  
  const handleEditClaudeFile = (file: ClaudeMdFile) => {
    setEditingClaudeFile(file);
    handleViewChange("claude-file-editor");
  };

  
  const handleBackFromClaudeFileEditor = () => {
    setEditingClaudeFile(null);
    handleViewChange("projects");
  };

  
  const handleViewChange = (newView: View) => {
    
    setView(newView);
  };

  
  const handleProjectSettings = (project: Project) => {
    setProjectForSettings(project);
    handleViewChange("project-settings");
  };


  const renderContent = () => {
    switch (view) {
      case "welcome":
        return (
          <div className="flex items-center justify-center p-4" style={{ height: "100%" }}>
            <div className="w-full max-w-4xl">
              
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12 text-center"
              >
                <h1 className="text-4xl font-bold tracking-tight">
                  <span className="rotating-symbol"></span>
                  Seven of Nine Command Interface
                </h1>
                <p className="mt-4 text-muted-foreground">Tactical Computing Platform</p>
              </motion.div>

              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card 
                    className="h-64 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg borg-panel"
                    onClick={() => handleViewChange("cc-agents")}
                  >
                    <div className="h-full flex flex-col items-center justify-center p-8">
                      <Bot className="h-16 w-16 mb-4 text-borg-active" />
                      <h2 className="text-xl font-semibold text-borg-active">TACTICAL AGENTS</h2>
                      <p className="text-sm text-borg-standby mt-2">Specialized drone protocols</p>
                    </div>
                  </Card>
                </motion.div>
