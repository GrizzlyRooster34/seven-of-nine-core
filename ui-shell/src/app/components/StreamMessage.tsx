import React, { useState, useEffect } from "react";
import { 
  Terminal, 
  User, 
  Bot, 
  AlertCircle, 
  CheckCircle2
} from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { cn } from "@/app/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { claudeSyntaxTheme } from "@/app/lib/claudeSyntaxTheme";
import type { ClaudeStreamMessage } from "./AgentExecution";
import {
  TodoWidget,
  TodoReadWidget,
  LSWidget,
  ReadWidget,
  ReadResultWidget,
  GlobWidget,
  BashWidget,
  WriteWidget,
  GrepWidget,
  EditWidget,
  EditResultWidget,
  MCPWidget,
  CommandWidget,
  CommandOutputWidget,
  SummaryWidget,
  MultiEditWidget,
  MultiEditResultWidget,
  SystemReminderWidget,
  SystemInitializedWidget,
  TaskWidget,
  LSResultWidget,
  ThinkingWidget,
  WebSearchWidget,
  WebFetchWidget
} from "./ToolWidgets";

interface StreamMessageProps {
  message: ClaudeStreamMessage;
  className?: string;
  streamMessages: ClaudeStreamMessage[];
  onLinkDetected?: (url: string) => void;
}

/**
 * Component to render a single Claude Code stream message
 */
const StreamMessageComponent: React.FC<StreamMessageProps> = ({ message, className, streamMessages, onLinkDetected }) => {
  
  const [toolResults, setToolResults] = useState<Map<string, any>>(new Map());
  
  
  useEffect(() => {
    const results = new Map<string, any>();
    
    
    streamMessages.forEach(msg => {
      if (msg.type === "user" && msg.message?.content && Array.isArray(msg.message.content)) {
        msg.message.content.forEach((content: any) => {
          if (content.type === "tool_result" && content.tool_use_id) {
            results.set(content.tool_use_id, content);
          }
        });
      }
    });
    
    setToolResults(results);
  }, [streamMessages]);
  
  
  const getToolResult = (toolId: string | undefined): any => {
    if (!toolId) return null;
    return toolResults.get(toolId) || null;
  };
  
  try {
    
    if (message.isMeta && !message.leafUuid && !message.summary) {
      return null;
    }

    
    if (message.leafUuid && message.summary && (message as any).type === "summary") {
      return <SummaryWidget summary={message.summary} leafUuid={message.leafUuid} />;
    }

    
    if (message.type === "system" && message.subtype === "init") {
      return (
        <SystemInitializedWidget
          sessionId={message.session_id}
          model={message.model}
          cwd={message.cwd}
          tools={message.tools}
        />
      );
    }

    
    if (message.type === "assistant" && message.message) {
      const msg = message.message;
      
      let renderedSomething = false;
      
      const renderedCard = (
        <Card className={cn("border-primary/20 bg-primary/5", className)}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Bot className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1 space-y-2 min-w-0">
                {msg.content && Array.isArray(msg.content) && msg.content.map((content: any, idx: number) => {
                  
                  if (content.type === "text") {
                    
                    const textContent = typeof content.text === 'string' 
                      ? content.text 
                      : (content.text?.text || JSON.stringify(content.text || content));
                    
                    renderedSomething = true;
                    return (
                      <div key={idx} className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({ node, inline, className, children, ...props }: any) {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  style={claudeSyntaxTheme}
                                  language={match[1]}
                                  PreTag="div"
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            }
                          }}
                        >
                          {textContent}
                        </ReactMarkdown>
                      </div>
                    );
                  }
                  
                  
                  if (content.type === "thinking") {
                    renderedSomething = true;
                    return (
                      <div key={idx}>
                        <ThinkingWidget 
                          thinking={content.thinking || ''} 
                          signature={content.signature}
                        />
                      </div>
                    );
                  }
                  
                  
                  if (content.type === "tool_use") {
                    const toolName = content.name?.toLowerCase();
                    const input = content.input;
                    const toolId = content.id;
                    
                    
                    const toolResult = getToolResult(toolId);
                    
                    
                    const renderToolWidget = () => {
                      
                      if (toolName === "task" && input) {
                        renderedSomething = true;
                        return <TaskWidget description={input.description} prompt={input.prompt} result={toolResult} />;
                      }
                      
                      
                      if (toolName === "edit" && input?.file_path) {
                        renderedSomething = true;
                        return <EditWidget {...input} result={toolResult} />;
                      }
                      
                      
                      if (toolName === "multiedit" && input?.file_path && input?.edits) {
                        renderedSomething = true;
                        return <MultiEditWidget {...input} result={toolResult} />;
                      }
                      
                      
                      if (content.name?.startsWith("mcp__")) {
                        renderedSomething = true;
                        return <MCPWidget toolName={content.name} input={input} result={toolResult} />;
                      }
                      
                      
                      if (toolName === "todowrite" && input?.todos) {
                        renderedSomething = true;
                        return <TodoWidget todos={input.todos} result={toolResult} />;
                      }
                      
                      
                      if (toolName === "todoread") {
                        renderedSomething = true;
                        return <TodoReadWidget todos={input?.todos} result={toolResult} />;
                      }
                      
                      
                      if (toolName === "ls" && input?.path) {
                        renderedSomething = true;
                        return <LSWidget path={input.path} result={toolResult} />;
                      }
                      
                      
                      if (toolName === "read" && input?.file_path) {
                        renderedSomething = true;
                        return <ReadWidget filePath={input.file_path} result={toolResult} />;
                      }
                      
                      
                      if (toolName === "glob" && input?.pattern) {
                        renderedSomething = true;
                        return <GlobWidget pattern={input.pattern} result={toolResult} />;
                      }
                      
                      
                      if (toolName === "bash" && input?.command) {
                        renderedSomething = true;
                        return <BashWidget command={input.command} description={input.description} result={toolResult} />;
                      }
                      
                      
                      if (toolName === "write" && input?.file_path && input?.content) {
                        renderedSomething = true;
                        return <WriteWidget filePath={input.file_path} content={input.content} result={toolResult} />;
                      }
                      
                      
                      if (toolName === "grep" && input?.pattern) {
                        renderedSomething = true;
                        return <GrepWidget pattern={input.pattern} include={input.include} path={input.path} exclude={input.exclude} result={toolResult} />;
                      }
                      
                      
