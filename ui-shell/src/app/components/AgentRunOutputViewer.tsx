import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Maximize2, 
  Minimize2, 
  Copy, 
  RefreshCw, 
  RotateCcw, 
  ChevronDown,
  Bot,
  Clock,
  Hash,
  DollarSign,
  StopCircle
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Toast, ToastContainer } from '@/app/components/ui/toast';
import { Popover } from '@/app/components/ui/popover';
import { api, type AgentRunWithMetrics } from '@/app/lib/api';
import { useOutputCache } from '@/app/lib/outputCache';
import { listen, type UnlistenFn } from '@tauri-apps/api/event';
import { StreamMessage } from './StreamMessage';
import { ErrorBoundary } from './ErrorBoundary';
import { formatISOTimestamp } from '@/app/lib/date-utils';
import { AGENT_ICONS } from './CCAgents';
import type { ClaudeStreamMessage } from './AgentExecution';
import { useTabState } from '@/app/hooks/useTabState';

interface AgentRunOutputViewerProps {
  /**
   * The agent run ID to display
   */
  agentRunId: string;
  /**
   * Tab ID for this agent run
   */
  tabId: string;
  /**
   * Optional className for styling
   */
  className?: string;
}

/**
 * AgentRunOutputViewer - Modal component for viewing agent execution output
 * 
 * @example
 * <AgentRunOutputViewer
 *   run={agentRun}
 *   onClose={() => setSelectedRun(null)}
 * />
 */
export function AgentRunOutputViewer({ 
  agentRunId, 
  tabId,
  className 
}: AgentRunOutputViewerProps) {
  const { updateTabTitle, updateTabStatus } = useTabState();
  const [run, setRun] = useState<AgentRunWithMetrics | null>(null);
  const [messages, setMessages] = useState<ClaudeStreamMessage[]>([]);
  const [rawJsonlOutput, setRawJsonlOutput] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [copyPopoverOpen, setCopyPopoverOpen] = useState(false);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  
  
  const isInitialLoadRef = useRef(true);
  const hasSetupListenersRef = useRef(false);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const outputEndRef = useRef<HTMLDivElement>(null);
  const fullscreenScrollRef = useRef<HTMLDivElement>(null);
  const fullscreenMessagesEndRef = useRef<HTMLDivElement>(null);
  const unlistenRefs = useRef<UnlistenFn[]>([]);
  const { getCachedOutput, setCachedOutput } = useOutputCache();

  
  const isAtBottom = () => {
    const container = isFullscreen ? fullscreenScrollRef.current : scrollAreaRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      return distanceFromBottom < 1;
    }
    return true;
  };

  const scrollToBottom = () => {
    if (!hasUserScrolled) {
      const endRef = isFullscreen ? fullscreenMessagesEndRef.current : outputEndRef.current;
      if (endRef) {
        endRef.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  
  useEffect(() => {
    const loadAgentRun = async () => {
      try {
        setLoading(true);
        const agentRun = await api.getAgentRun(parseInt(agentRunId));
        setRun(agentRun);
        updateTabTitle(tabId, `Agent: ${agentRun.agent_name || 'Unknown'}`);
        updateTabStatus(tabId, agentRun.status === 'running' ? 'running' : agentRun.status === 'failed' ? 'error' : 'complete');
      } catch (error) {
        console.error('Failed to load agent run:', error);
        updateTabStatus(tabId, 'error');
      } finally {
        setLoading(false);
      }
    };
    
    if (agentRunId) {
      loadAgentRun();
    }
  }, [agentRunId, tabId, updateTabTitle, updateTabStatus]);

  
  useEffect(() => {
    return () => {
      unlistenRefs.current.forEach(unlisten => unlisten());
      unlistenRefs.current = [];
      hasSetupListenersRef.current = false;
    };
  }, []);

  
  useEffect(() => {
    const shouldAutoScroll = !hasUserScrolled || isAtBottom();
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [messages, hasUserScrolled, isFullscreen]);

  const loadOutput = async (skipCache = false) => {
    if (!run?.id) return;

    console.log('[AgentRunOutputViewer] Loading output for run:', {
      runId: run.id,
      status: run.status,
      sessionId: run.session_id,
      skipCache
    });

    try {
      
      if (!skipCache) {
        const cached = getCachedOutput(run.id);
        if (cached) {
          console.log('[AgentRunOutputViewer] Found cached output');
          const cachedJsonlLines = cached.output.split('\n').filter(line => line.trim());
          setRawJsonlOutput(cachedJsonlLines);
          setMessages(cached.messages);
          
          if (Date.now() - cached.lastUpdated < 5000 && run.status !== 'running') {
            console.log('[AgentRunOutputViewer] Using recent cache, skipping refresh');
            return;
          }
        }
      }

      setLoading(true);

      
      if (run.session_id && run.session_id !== '') {
        console.log('[AgentRunOutputViewer] Attempting to load from JSONL with session_id:', run.session_id);
        try {
          const history = await api.loadAgentSessionHistory(run.session_id);
          console.log('[AgentRunOutputViewer] Successfully loaded JSONL history:', history.length, 'messages');
          
          
          const loadedMessages: ClaudeStreamMessage[] = history.map(entry => ({
            ...entry,
            type: entry.type || "assistant"
          }));
          
          setMessages(loadedMessages);
          setRawJsonlOutput(history.map(h => JSON.stringify(h)));
          
          
          setCachedOutput(run.id, {
            output: history.map(h => JSON.stringify(h)).join('\n'),
            messages: loadedMessages,
            lastUpdated: Date.now(),
            status: run.status
          });
          
          
          if (run.status === 'running') {
            console.log('[AgentRunOutputViewer] Setting up live listeners for running session');
            setupLiveEventListeners();
            
            try {
              await api.streamSessionOutput(run.id);
            } catch (streamError) {
              console.warn('[AgentRunOutputViewer] Failed to start streaming, will poll instead:', streamError);
            }
          }
          
          return;
        } catch (err) {
          console.warn('[AgentRunOutputViewer] Failed to load from JSONL:', err);
          console.warn('[AgentRunOutputViewer] Falling back to regular output method');
        }
      } else {
        console.log('[AgentRunOutputViewer] No session_id available, using fallback method');
      }

      
      console.log('[AgentRunOutputViewer] Using getSessionOutput fallback');
      const rawOutput = await api.getSessionOutput(run.id);
      console.log('[AgentRunOutputViewer] Received raw output:', rawOutput.length, 'characters');
      
      
      const jsonlLines = rawOutput.split('\n').filter(line => line.trim());
      setRawJsonlOutput(jsonlLines);
      
      const parsedMessages: ClaudeStreamMessage[] = [];
      for (const line of jsonlLines) {
        try {
          const message = JSON.parse(line) as ClaudeStreamMessage;
          parsedMessages.push(message);
        } catch (err) {
          console.error("[AgentRunOutputViewer] Failed to parse message:", err, line);
        }
      }
      console.log('[AgentRunOutputViewer] Parsed', parsedMessages.length, 'messages from output');
      setMessages(parsedMessages);
      
      
      setCachedOutput(run.id, {
        output: rawOutput,
        messages: parsedMessages,
        lastUpdated: Date.now(),
        status: run.status
      });
      
      
      if (run.status === 'running') {
        console.log('[AgentRunOutputViewer] Setting up live listeners for running session (fallback)');
        setupLiveEventListeners();
        
        try {
          await api.streamSessionOutput(run.id);
        } catch (streamError) {
