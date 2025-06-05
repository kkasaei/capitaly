"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeft, FaPaperPlane, FaCog, FaRobot, FaUser, FaInfoCircle, FaClipboard, 
         FaHistory, FaTrash, FaPlus, FaEraser } from "react-icons/fa";
import { toast } from "sonner";
import { api } from "@/lib/trpc/react";
import ReactMarkdown from "react-markdown";

// Message types for the chat
type MessageRole = "user" | "assistant" | "system";

// Define Agent Config type
interface AgentConfig {
  model?: string;
  temperature?: number;
  systemPrompt: string;
  memory?: boolean;
  capabilities?: string[];
}

// Define Agent type
interface DbAgent {
  id: string;
  name: string;
  description: string | null;
  type: string;
  tools: string[];
  config: unknown;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  runId?: string;
  toolCalls?: Array<{
    tool: string;
    input: Record<string, unknown>;
    output: string;
  }>;
}

interface RunDetails {
  id: string;
  agentId: string;
  agentName: string;
  status: string;
  input: unknown;
  output: unknown;
  logs: string[];
  startedAt: Date;
  endedAt?: Date;
}

interface Session {
  id: string;
  lastUpdated: Date;
  messageCount: number;
  lastMessage: string;
}

export default function AgentRunPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentId = params.id as string;
  const sessionParam = searchParams.get('session');
  
  const [isLoading, setIsLoading] = useState(true);
  const [agent, setAgent] = useState<DbAgent | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [runDetails, setRunDetails] = useState<RunDetails | null>(null);
  const [showRunDetails, setShowRunDetails] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  
  // Session management
  const [sessionId, setSessionId] = useState<string>(sessionParam || `session-${Date.now()}`);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  
  // Get agent details
  const { data: agentData, isLoading: agentLoading, error: agentError } = api.agent.getById.useQuery(
    { id: agentId },
    { enabled: !!agentId }
  );
  
  // Get session history
  const { data: sessionHistory, refetch: refetchHistory } = 
    api.agent.getSessionHistory.useQuery(
      { agentId, sessionId },
      { enabled: !!agentId && !!sessionId }
    );
  
  // Get all sessions for this agent
  const { data: sessions, refetch: refetchSessions } = api.agent.getAgentSessions.useQuery(
    { agentId },
    { enabled: !!agentId }
  );
  
  // Get run details query
  const { data: runData, refetch: fetchRunDetails } = api.agent.getRunDetails.useQuery(
    { runId: selectedRunId || "" },
    { enabled: !!selectedRunId }
  );
  
  // Mutations
  const runAgentMutation = api.agent.runAgent.useMutation({
    onError: (error) => {
      toast.error(`Error running agent: ${error.message}`);
      setIsProcessing(false);
    }
  });
  
  const clearHistoryMutation = api.agent.clearSessionHistory.useMutation({
    onSuccess: () => {
      setMessages([]);
      if (agent?.config) {
        const config = agent.config as unknown as AgentConfig;
        if (config?.systemPrompt) {
          setMessages([
            {
              id: "system-1",
              role: "system",
              content: config.systemPrompt,
              timestamp: new Date(),
            },
          ]);
        }
      }
      void refetchHistory();
      void refetchSessions();
      toast.success("Conversation history cleared");
    },
    onError: (error) => {
      toast.error(`Error clearing history: ${error.message}`);
    }
  });
  
  const deleteSessionMutation = api.agent.deleteSession.useMutation({
    onSuccess: () => {
      void refetchSessions();
      // Create a new session if we deleted the active one
      setSessionId(`session-${Date.now()}`);
      setMessages([]);
      if (agent?.config) {
        const config = agent.config as unknown as AgentConfig;
        if (config?.systemPrompt) {
          setMessages([
            {
              id: "system-1",
              role: "system",
              content: config.systemPrompt,
              timestamp: new Date(),
            },
          ]);
        }
      }
      
      toast.success("Session deleted");
      setShowSessions(false);
      
      // Update URL
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('session', sessionId);
      router.push(`/dashboard/agents/agents/${agentId}/run?${newParams.toString()}`);
    },
    onError: (error) => {
      toast.error(`Error deleting session: ${error.message}`);
    }
  });
  
  // Handle agent data changes
  useEffect(() => {
    if (agentData) {
      setAgent(agentData as DbAgent);
      
      // Only add system message if we don't have session history
      if (!sessionHistory || sessionHistory.length === 0) {
        const config = agentData.config as unknown as AgentConfig;
        if (config?.systemPrompt) {
          setMessages([
            {
              id: "system-1",
              role: "system",
              content: config.systemPrompt,
              timestamp: new Date(),
            },
          ]);
        }
      }
      
      setIsLoading(false);
    }
  }, [agentData, sessionHistory]);
  
  // Handle agent error
  useEffect(() => {
    if (agentError) {
      toast.error(`Failed to load agent: ${agentError.message}`);
      setIsLoading(false);
    }
  }, [agentError]);
  
  // Load session history when it changes
  useEffect(() => {
    if (sessionHistory && sessionHistory.length > 0) {
      setMessages(sessionHistory as Message[]);
    }
  }, [sessionHistory]);
  
  // Set active session when sessions data changes
  useEffect(() => {
    if (sessions && sessionId) {
      const currentSession = sessions.find((s) => s.id === sessionId);
      if (currentSession) {
        setActiveSession(currentSession as Session);
      } else {
        setActiveSession(null);
      }
    }
  }, [sessions, sessionId]);
  
  // Handle run data changes
  useEffect(() => {
    if (runData) {
      setRunDetails(runData as RunDetails);
      setShowRunDetails(true);
    }
  }, [runData]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Update URL when session changes
  useEffect(() => {
    if (sessionId && agentId) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('session', sessionId);
      router.push(`/dashboard/agents/agents/${agentId}/run?${newParams.toString()}`, { scroll: false });
    }
  }, [sessionId, agentId, router, searchParams]);
  
  // Submit a message to the agent
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isProcessing) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    
    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);
    
    try {
      // Call the agent API
      const result = await runAgentMutation.mutateAsync({
        agentId,
        input: input.trim(),
        sessionId,
        persistMemory: true,
      });
      
      // Add assistant response to chat
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: result.output,
        timestamp: new Date(),
        runId: result.runId,
        toolCalls: result.toolCalls,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Refresh sessions list to update the latest message
      void refetchSessions();
    } catch (error) {
      // Error is handled by the mutation
      console.error("Error running agent:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // View run details
  const handleViewRunDetails = (runId: string) => {
    setSelectedRunId(runId);
    void fetchRunDetails();
  };
  
  // Close run details modal
  const closeRunDetails = () => {
    setShowRunDetails(false);
    setRunDetails(null);
    setSelectedRunId(null);
  };
  
  // Create new session
  const handleNewSession = () => {
    const newSessionId = `session-${Date.now()}`;
    setSessionId(newSessionId);
    setMessages([]);
    
    // Add system message for new session
    if (agent?.config) {
      const config = agent.config as unknown as AgentConfig;
      if (config?.systemPrompt) {
        setMessages([
          {
            id: "system-1",
            role: "system",
            content: config.systemPrompt,
            timestamp: new Date(),
          },
        ]);
      }
    }
    
    toast.success("Started new conversation");
    setShowSessions(false);
  };
  
  // Switch session
  const handleSwitchSession = (session: Session) => {
    setSessionId(session.id);
    void refetchHistory();
    setShowSessions(false);
  };
  
  // Clear conversation history
  const handleClearHistory = () => {
    if (sessionId) {
      clearHistoryMutation.mutate({ agentId, sessionId });
    }
  };
  
  // Delete session
  const handleDeleteSession = (session: Session) => {
    if (confirm("Are you sure you want to delete this conversation? This action cannot be undone.")) {
      deleteSessionMutation.mutate({ agentId, sessionId: session.id });
    }
  };
  
  if (isLoading || agentLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!agent) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Agent Not Found</h2>
        <p className="mt-2 text-gray-600">The agent you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</p>
        <Link
          href="/dashboard/agents/agents"
          className="mt-4 inline-block text-blue-600 hover:text-blue-800"
        >
          Back to Agents
        </Link>
      </div>
    );
  }
  
  return (
    <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 md:px-8">
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="border-b pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard/agents/agents"
              className="text-gray-500 hover:text-gray-700"
            >
              <FaArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center">
              <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-100">
                <FaRobot className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-medium text-gray-900">{agent.name}</h2>
                <p className="text-sm text-gray-500 truncate max-w-md">{agent.description}</p>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowSessions(true)}
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <FaHistory className="mr-2 h-4 w-4 text-gray-500" />
              {activeSession ? 
                `Conversation (${activeSession.messageCount} messages)` : 
                "Conversations"}
            </button>
            
            <Link
              href={`/dashboard/agents/agents/${agentId}/edit`}
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <FaCog className="mr-2 h-4 w-4 text-gray-500" />
              Settings
            </Link>
          </div>
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.filter(m => m.role !== "system").map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-3xl rounded-lg px-4 py-3 ${
                message.role === "user" 
                  ? "bg-blue-100 text-blue-900" 
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <div className="flex items-center mb-1">
                <div className="h-6 w-6 mr-2 flex-shrink-0 flex items-center justify-center rounded-full bg-white">
                  {message.role === "user" 
                    ? <FaUser className="h-3 w-3 text-blue-600" /> 
                    : <FaRobot className="h-3 w-3 text-gray-600" />
                  }
                </div>
                <span className="text-xs font-medium">
                  {message.role === "user" ? "You" : agent.name}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
                
                {/* Run Details Button */}
                {message.role === "assistant" && message.runId && (
                  <button 
                    onClick={() => handleViewRunDetails(message.runId as string)}
                    className="ml-2 text-xs text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <FaInfoCircle className="h-3 w-3 mr-1" />
                    View Details
                  </button>
                )}
              </div>
              <div className="whitespace-pre-wrap">
                {message.role === "assistant" ? (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-4">{children}</p>,
                      h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xl font-bold mb-3">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
                      ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      code: ({ children }) => <code className="bg-gray-100 rounded px-1 py-0.5">{children}</code>,
                      pre: ({ children }) => <pre className="bg-gray-100 rounded p-4 mb-4 overflow-x-auto">{children}</pre>,
                      blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4">{children}</blockquote>,
                      a: ({ children, href }) => <a href={href} className="text-blue-600 hover:underline">{children}</a>,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  message.content
                )}
              </div>
              
              {/* Tool Calls */}
              {message.toolCalls && message.toolCalls.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <h4 className="text-xs font-semibold text-gray-700 mb-1">Tools Used:</h4>
                  <div className="space-y-2">
                    {message.toolCalls.map((toolCall, index) => (
                      <div key={index} className="bg-white rounded border p-2 text-xs">
                        <div className="font-medium">{toolCall.tool}</div>
                        <div className="mt-1 text-gray-500 overflow-x-auto max-h-32">
                          <pre>{JSON.stringify(toolCall.input, null, 2)}</pre>
                        </div>
                        <div className="mt-1 pt-1 border-t border-gray-100">
                          <div className="font-medium text-gray-600">Output:</div>
                          <div className="text-gray-800 whitespace-pre-wrap overflow-x-auto max-h-32">
                            {toolCall.output}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="border-t p-4">
        <div className="mb-3 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {activeSession ? (
              <span>Using conversation from {new Date(activeSession.lastUpdated).toLocaleDateString()}</span>
            ) : (
              <span>New conversation</span>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleNewSession}
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              <FaPlus className="mr-1 h-3 w-3" />
              New
            </button>
            <button
              onClick={handleClearHistory}
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              disabled={clearHistoryMutation.isPending}
            >
              <FaEraser className="mr-1 h-3 w-3" />
              Clear
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${agent.name}...`}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isProcessing}
          />
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!input.trim() || isProcessing}
          >
            {isProcessing ? (
              <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
            ) : (
              <FaPaperPlane className="h-4 w-4 mr-2" />
            )}
            Send
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          This agent uses {(agent.config as unknown as AgentConfig)?.model || "AI"} to respond. Your conversation is stored to maintain context.
        </p>
      </div>
      
      {/* Sessions Modal */}
      {showSessions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">Conversation History</h3>
              <button 
                onClick={() => setShowSessions(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {sessions && sessions.length > 0 ? (
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div 
                      key={session.id} 
                      className={`p-3 rounded-md border ${session.id === sessionId ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium text-sm">
                            Conversation from {new Date(session.lastUpdated).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {session.messageCount} messages
                          </div>
                          <div className="mt-2 text-sm text-gray-700 truncate max-w-sm">
                            {session.lastMessage}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSwitchSession(session as Session)}
                            disabled={session.id === sessionId}
                            className="text-blue-600 hover:text-blue-800 p-1"
                          >
                            {session.id === sessionId ? (
                              <span className="text-xs">Current</span>
                            ) : (
                              <span className="text-xs">Select</span>
                            )}
                          </button>
                          {session.id !== sessionId && (
                            <button
                              onClick={() => handleDeleteSession(session as Session)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <FaTrash className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaHistory className="h-10 w-10 mx-auto mb-4 text-gray-300" />
                  <p>No conversation history yet</p>
                  <p className="text-sm mt-1">Start chatting with your agent to create history</p>
                </div>
              )}
            </div>
            <div className="border-t p-3 flex justify-between">
              <button
                onClick={handleNewSession}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                New Conversation
              </button>
              <button
                onClick={() => setShowSessions(false)}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Run Details Modal */}
      {showRunDetails && runDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">Agent Run Details</h3>
              <button 
                onClick={closeRunDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <div className="space-y-4">
                {/* Run metadata */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Run ID</p>
                      <p className="font-mono text-gray-900">{runDetails.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className="font-semibold">
                        <span className={`inline-block rounded-full w-2 h-2 mr-1 ${
                          runDetails.status === "COMPLETED" ? "bg-green-500" : 
                          runDetails.status === "RUNNING" ? "bg-blue-500" : 
                          runDetails.status === "FAILED" ? "bg-red-500" : "bg-gray-500"
                        }`} />
                        {runDetails.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Started At</p>
                      <p>{new Date(runDetails.startedAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p>
                        {runDetails.endedAt ? 
                          `${Math.round((new Date(runDetails.endedAt).getTime() - new Date(runDetails.startedAt).getTime()) / 1000)} seconds` : 
                          "In progress"}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Input & Output */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-medium">Input</h4>
                    <button 
                      onClick={() => {
                        const inputText = typeof runDetails.input === 'object' && 
                          runDetails.input !== null && 
                          'text' in runDetails.input
                            ? String((runDetails.input as Record<string, unknown>).text || '')
                            : JSON.stringify(runDetails.input, null, 2);
                        void navigator.clipboard.writeText(inputText);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <FaClipboard className="h-3 w-3 mr-1" />
                      Copy
                    </button>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md text-sm font-mono whitespace-pre-wrap">
                    {typeof runDetails.input === 'object' && 
                     runDetails.input !== null && 
                     'text' in runDetails.input
                      ? String((runDetails.input as Record<string, unknown>).text || '')
                      : JSON.stringify(runDetails.input, null, 2)}
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-medium">Output</h4>
                    <button 
                      onClick={() => {
                        const outputText = typeof runDetails.output === 'object' && 
                          runDetails.output !== null && 
                          'text' in runDetails.output
                            ? String((runDetails.output as Record<string, unknown>).text || '')
                            : JSON.stringify(runDetails.output, null, 2);
                        void navigator.clipboard.writeText(outputText);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <FaClipboard className="h-3 w-3 mr-1" />
                      Copy
                    </button>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md text-sm whitespace-pre-wrap">
                    {typeof runDetails.output === 'object' && 
                     runDetails.output !== null && 
                     'text' in runDetails.output
                      ? String((runDetails.output as Record<string, unknown>).text || '')
                      : JSON.stringify(runDetails.output, null, 2)}
                  </div>
                </div>
                
                {/* Chain of Thought / Logs */}
                {runDetails.logs && runDetails.logs.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-1">Chain of Thought / Execution Logs</h4>
                    <div className="bg-gray-50 rounded-md border border-gray-200 overflow-x-auto">
                      <div className="p-3 space-y-2 text-sm font-mono">
                        {runDetails.logs.map((log, index) => (
                          <div key={index} className="whitespace-pre-wrap">{log}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Tool calls */}
                {typeof runDetails.output === 'object' && 
                 runDetails.output !== null && 
                 'toolCalls' in runDetails.output && 
                 Array.isArray((runDetails.output as Record<string, unknown>).toolCalls) && 
                 ((runDetails.output as Record<string, unknown>).toolCalls as unknown[]).length > 0 && (
                  <div>
                    <h4 className="font-medium mb-1">Tool Executions</h4>
                    <div className="space-y-3">
                      {((runDetails.output as Record<string, unknown>).toolCalls as {
                        tool: string;
                        input: Record<string, unknown>;
                        output: string;
                      }[]).map((toolCall, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                          <div className="font-medium text-sm">{toolCall.tool}</div>
                          <div className="mt-2">
                            <h5 className="text-xs text-gray-500 mb-1">Input:</h5>
                            <div className="bg-white p-2 rounded text-xs font-mono overflow-x-auto">
                              <pre>{JSON.stringify(toolCall.input, null, 2)}</pre>
                            </div>
                          </div>
                          <div className="mt-2">
                            <h5 className="text-xs text-gray-500 mb-1">Output:</h5>
                            <div className="bg-white p-2 rounded text-xs overflow-x-auto">
                              <div className="whitespace-pre-wrap">{toolCall.output}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t p-3 flex justify-end">
              <button
                onClick={closeRunDetails}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}