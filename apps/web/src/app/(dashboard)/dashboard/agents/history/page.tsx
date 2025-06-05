"use client";

import { useState, useEffect, useMemo } from "react";
import { FaCheck, FaTimes, FaClock, FaSpinner, FaUser, FaThumbsUp, FaThumbsDown, FaRobot, FaNetworkWired, FaHistory } from "react-icons/fa";
import { format } from "date-fns";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { api } from "@/lib/trpc/react";
import { Spinner } from "@/components/ui/spinner";
import ReactMarkdown from "react-markdown";


// Types based on the schema
type RunStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED" | "AWAITING_HUMAN";

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  metadata?: Record<string, unknown>;
}

interface Run {
  id: string;
  name?: string;
  status: RunStatus;
  startedAt: Date;
  endedAt?: Date | null;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  logs?: LogEntry[];
  humanFeedbackRequired?: boolean;
  humanFeedback?: {
    approved: boolean;
    comments?: string;
    providedAt?: string;
  };
  agent?: {
    name: string;
  };
}

interface AgentRun extends Run {
  agentId: string;
  agentName?: string;
  type: "agent";
}

interface WorkflowRun extends Run {
  workflowId: string;
  type: "workflow";
  agentRuns?: AgentRun[];
}

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [runs, setRuns] = useState<(AgentRun | WorkflowRun)[]>([]);
  const [selectedRun, setSelectedRun] = useState<AgentRun | WorkflowRun | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Fetch agent runs
  const { data: agentRuns, isLoading: isLoadingAgentRuns } = api.agent.getAllRuns.useQuery();

  // Get run details query (not mutation)
  const { data: runDetails, refetch: fetchRunDetails } = api.agent.getRunDetails.useQuery(
    { runId: selectedRun?.id || "" },
    { enabled: false }
  );

  // Function to view run details
  const viewRunDetails = (run: AgentRun | WorkflowRun) => {
    if (run.type === "agent") {
      setSelectedRun(run);
      fetchRunDetails();
      setDetailsOpen(true);
    } else {
      setSelectedRun(run);
      setDetailsOpen(true);
    }
  };

  // Effect to update selected run when run details are loaded
  useEffect(() => {
    if (runDetails && selectedRun) {
      const updatedRun: AgentRun = {
        ...selectedRun as AgentRun,
        agentName: runDetails.agentName,
        input: runDetails.input as Record<string, unknown>,
        output: runDetails.output as Record<string, unknown>,
        logs: (runDetails.logs as unknown as LogEntry[]) || []
      };
      setSelectedRun(updatedRun);
    }
  }, [runDetails, selectedRun]);

  // Combine and format the runs data when it's available
  useEffect(() => {
    const formattedRuns: (AgentRun | WorkflowRun)[] = [];

    // Format agent runs
    if (agentRuns) {
      agentRuns.forEach((run: { id: any; agentId: any; agent: { name: any; }; status: any; startedAt: any; endedAt: any; input: any; output: any; logs: any; }) => {
        formattedRuns.push({
          id: run.id,
          agentId: run.agentId,
          agentName: (run as any).agent?.name || "Unknown Agent",
          type: "agent",
          status: run.status as RunStatus,
          startedAt: run.startedAt,
          endedAt: run.endedAt,
          input: run.input as Record<string, unknown> || {},
          output: run.output as Record<string, unknown> || {},
          logs: (run.logs as unknown as LogEntry[]) || []
        });
      });
    }

    // Sort by start date desc
    formattedRuns.sort((a, b) => {
      return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
    });

    setRuns(formattedRuns);
  }, [agentRuns]);

  // Function to handle providing human feedback
  const handleProvideFeedback = (approved: boolean) => {
    if (!selectedRun) return;

    // In a real implementation, this would be an API call
    const updatedRuns = runs.map(run => {
      if (run.id === selectedRun.id) {
        return {
          ...run,
          status: "COMPLETED" as RunStatus,
          humanFeedback: {
            approved,
            comments: feedback,
            providedAt: new Date().toISOString()
          }
        };
      }
      return run;
    });

    setRuns(updatedRuns);
    setFeedbackDialogOpen(false);
    setFeedback("");
  };

  // Function to provide feedback for a run
  const openFeedbackDialog = (run: AgentRun | WorkflowRun) => {
    setSelectedRun(run);
    setFeedbackDialogOpen(true);
  };

  // Helper to get status icon
  const getStatusIcon = (status: RunStatus) => {
    switch (status) {
      case "COMPLETED":
        return <FaCheck className="text-green-500" />;
      case "FAILED":
        return <FaTimes className="text-red-500" />;
      case "PENDING":
        return <FaClock className="text-gray-500" />;
      case "RUNNING":
        return <FaSpinner className="text-blue-500 animate-spin" />;
      case "AWAITING_HUMAN":
        return <FaUser className="text-purple-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  // Helper to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return format(new Date(dateString), "MMM d, yyyy h:mm a");
  };

  // Helper to get status badge
  const getStatusBadge = (status: RunStatus) => {
    let variant: string = "default";

    switch (status) {
      case "COMPLETED":
        variant = "bg-green-100 text-green-800";
        break;
      case "FAILED":
        variant = "bg-red-100 text-red-800";
        break;
      case "PENDING":
        variant = "bg-gray-100 text-gray-800";
        break;
      case "RUNNING":
        variant = "bg-blue-100 text-blue-800";
        break;
      case "AWAITING_HUMAN":
        variant = "bg-purple-100 text-purple-800";
        break;
      default:
        variant = "bg-gray-100 text-gray-800";
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variant}`}>
        {status.replace("_", " ")}
      </span>
    );
  };

  // Filter runs based on active tab and search query
  const filteredRuns = useMemo(() => {
    let filtered = runs;

    // Apply tab filter
    if (activeTab === "agents") {
      filtered = filtered.filter(run => run.type === "agent");
    } else if (activeTab === "workflows") {
      filtered = filtered.filter(run => run.type === "workflow");
    } else if (activeTab === "awaiting") {
      filtered = filtered.filter(run => run.status === "AWAITING_HUMAN");
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(run =>
        (run.name && run.name.toLowerCase().includes(query)) ||
        run.id.toLowerCase().includes(query) ||
        run.status.toLowerCase().includes(query) ||
        (run.type === "agent" && run.agentId.toLowerCase().includes(query)) ||
        (run.type === "agent" && run.agentName && run.agentName.toLowerCase().includes(query)) ||
        (run.type === "workflow" && run.workflowId.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [runs, activeTab, searchQuery]);

  // Apply pagination
  const totalPages = Math.max(1, Math.ceil(filteredRuns.length / itemsPerPage));
  const paginatedRuns = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRuns.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRuns, currentPage, itemsPerPage]);

  // Create showing text for pagination
  const showingText = filteredRuns.length > 0
    ? `Showing ${((currentPage - 1) * itemsPerPage) + 1} to ${Math.min(currentPage * itemsPerPage, filteredRuns.length)} of ${filteredRuns.length} runs`
    : "";

  // Reset pagination when changing tab or search
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // Handle loading state
  const isLoading = isLoadingAgentRuns;

  return (
    <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 md:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Run History</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage agent and workflow execution history.
          </p>
        </div>
      </div>

      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center">
          <nav className="flex space-x-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === "all"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              All Runs
            </button>
            <button
              onClick={() => setActiveTab("agents")}
              className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === "agents"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Agent Runs
            </button>
            <button
              onClick={() => setActiveTab("workflows")}
              className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === "workflows"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Workflow Runs
            </button>
            <button
              onClick={() => setActiveTab("awaiting")}
              className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === "awaiting"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Awaiting Feedback
            </button>
          </nav>
        </div>
      </div>

      <div className="mt-4 mb-6">
        <SearchInput
          value={searchQuery}
          onSearch={setSearchQuery}
          placeholder="Search runs..."
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
          <span className="ml-3 text-gray-600">Loading run history...</span>
        </div>
      ) : paginatedRuns.length === 0 ? (
        <EmptyState
          icon={<FaHistory className="h-10 w-10 text-gray-400" />}
          title="No runs found"
          description={searchQuery
            ? "No runs match your search criteria. Try a different search or filter."
            : activeTab === "awaiting"
              ? "No runs are currently awaiting human feedback."
              : activeTab === "agents"
                ? "No agent runs found. Run an agent to see its execution history."
                : activeTab === "workflows"
                  ? "No workflow runs found. Run a workflow to see its execution history."
                  : "No run history available yet. Create and run agents or workflows to see their execution history."
          }
          actionLabel={searchQuery ? "Clear search" : undefined}
          actionHandler={searchQuery ? () => setSearchQuery("") : undefined}
        />
      ) : (
        <RunsTable
          runs={paginatedRuns}
          viewRunDetails={viewRunDetails}
          openFeedbackDialog={openFeedbackDialog}
          getStatusIcon={getStatusIcon}
          getStatusBadge={getStatusBadge}
          formatDate={formatDate}
        />
      )}

      {filteredRuns.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showingText={showingText}
        />
      )}

      {/* Details dialog */}
      {detailsOpen && selectedRun && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <div className="relative bg-white rounded-lg max-w-4xl w-full mx-4 sm:mx-auto overflow-hidden shadow-xl transform transition-all">
            <div className="px-4 pt-5 pb-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedRun.name || (selectedRun.type === "agent" ? selectedRun.agentName || "Unnamed Agent" : "Unnamed Workflow")} Details
                </h3>
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                  onClick={() => setDetailsOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Type</p>
                    <p className="mt-1 flex items-center">
                      {selectedRun.type === "agent" ?
                        <><FaRobot className="mr-1" /> Agent</> :
                        <><FaNetworkWired className="mr-1" /> Workflow</>
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="mt-1">{getStatusBadge(selectedRun.status)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Started</p>
                    <p className="mt-1">{formatDate(selectedRun.startedAt.toISOString())}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Completed</p>
                    <p className="mt-1">{formatDate(selectedRun.endedAt?.toISOString())}</p>
                  </div>
                </div>

                {selectedRun.input && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Input</p>
                    <pre className="mt-1 bg-gray-50 p-3 rounded-md text-sm overflow-auto max-h-32 break-words whitespace-pre-wrap">
                      {JSON.stringify(selectedRun.input, null, 2)}
                    </pre>
                  </div>
                )}

                {selectedRun.output && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Output</p>
                    <div className="mt-1 bg-gray-50 p-3 rounded-md text-sm overflow-auto max-h-64">
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
                        {
                          typeof selectedRun.output === "string"
                            ? selectedRun.output
                            : (selectedRun.output && typeof selectedRun.output === "object" && "text" in selectedRun.output)
                              ? String(selectedRun.output.text)
                              : JSON.stringify(selectedRun.output, null, 2)
                        }
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {selectedRun.logs && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Logs</p>
                    <div className="mt-1 bg-gray-50 p-3 rounded-md text-sm max-h-64 overflow-auto">
                      {Array.isArray(selectedRun.logs) ? (
                        <ul className="space-y-1">
                          {selectedRun.logs.map((log, idx) => (
                            <li key={idx} className="font-mono text-xs break-words whitespace-pre-wrap">
                              {typeof log === 'string' ? log : JSON.stringify(log)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <pre className="break-words whitespace-pre-wrap">
                          {typeof selectedRun.logs === 'string'
                            ? selectedRun.logs
                            : JSON.stringify(selectedRun.logs, null, 2)
                          }
                        </pre>
                      )}
                    </div>
                  </div>
                )}

                {selectedRun.status === "AWAITING_HUMAN" && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="mr-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      onClick={() => setDetailsOpen(false)}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => {
                        setDetailsOpen(false);
                        openFeedbackDialog(selectedRun);
                      }}
                    >
                      Provide Feedback
                    </button>
                  </div>
                )}

                {/* If it's a workflow, show agent runs */}
                {selectedRun.type === "workflow" && selectedRun.agentRuns && selectedRun.agentRuns.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Agent Runs</p>
                    <div className="mt-2">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Started</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedRun.agentRuns.map(agentRun => (
                            <tr key={agentRun.id}>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">{agentRun.name}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">{getStatusBadge(agentRun.status)}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">{formatDate(agentRun.startedAt.toISOString())}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">{formatDate(agentRun.endedAt?.toISOString())}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback dialog */}
      {feedbackDialogOpen && selectedRun && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <div className="relative bg-white rounded-lg max-w-lg w-full mx-4 sm:mx-auto overflow-hidden shadow-xl transform transition-all">
            <div className="px-4 pt-5 pb-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Human Feedback Required</h3>
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                  onClick={() => setFeedbackDialogOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Output</p>
                  <div className="mt-1 bg-gray-50 p-3 rounded-md text-sm overflow-auto max-h-64">
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
                      {
                        typeof selectedRun.output === "string"
                          ? selectedRun.output
                          : (selectedRun.output && typeof selectedRun.output === "object" && "text" in selectedRun.output)
                            ? String(selectedRun.output.text)
                            : JSON.stringify(selectedRun.output, null, 2)
                      }
                    </ReactMarkdown>
                  </div>
                </div>

                <div>
                  <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
                    Comments (optional)
                  </label>
                  <textarea
                    id="feedback"
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                    onClick={() => handleProvideFeedback(false)}
                  >
                    <FaThumbsDown className="mr-2" /> Reject
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => handleProvideFeedback(true)}
                  >
                    <FaThumbsUp className="mr-2" /> Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Runs table component
function RunsTable({
  runs,
  viewRunDetails,
  openFeedbackDialog,
  getStatusIcon,
  getStatusBadge,
  formatDate
}: {
  runs: (AgentRun | WorkflowRun)[],
  viewRunDetails: (run: AgentRun | WorkflowRun) => void,
  openFeedbackDialog: (run: AgentRun | WorkflowRun) => void,
  getStatusIcon: (status: RunStatus) => React.ReactNode,
  getStatusBadge: (status: RunStatus) => React.ReactNode,
  formatDate: (date?: string) => string
}) {
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-6">
              Name
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              Type
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              Status
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              Started
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              Duration
            </th>
            <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {runs.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-3 py-4 text-center text-sm text-gray-500">
                No runs found
              </td>
            </tr>
          ) : (
            runs.map((run) => {
              // Calculate duration
              const startDate = new Date(run.startedAt);
              const endDate = run.endedAt ? new Date(run.endedAt) : new Date();
              const durationMs = endDate.getTime() - startDate.getTime();
              const durationSec = Math.floor(durationMs / 1000);
              const minutes = Math.floor(durationSec / 60);
              const seconds = durationSec % 60;
              const duration = `${minutes}m ${seconds}s`;

              return (
                <tr key={run.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {run.name || (run.type === "agent" ? run.agentName || "Unnamed Agent" : "Unnamed Workflow")}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      {run.type === "agent" ? (
                        <><FaRobot className="mr-1" /> Agent</>
                      ) : (
                        <><FaNetworkWired className="mr-1" /> Workflow</>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">{getStatusIcon(run.status)}</span>
                      {getStatusBadge(run.status)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {formatDate(run.startedAt.toISOString())}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {duration}
                  </td>
                  <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => viewRunDetails(run)}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        View
                      </button>

                      {run.status === "AWAITING_HUMAN" && (
                        <button
                          type="button"
                          onClick={() => openFeedbackDialog(run)}
                          className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          Feedback
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
} 