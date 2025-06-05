"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FaPlus, FaRobot, FaPlay, FaCopy, FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { api } from "@/lib/trpc/react";
import { useRouter } from "next/navigation";

// Type for UI display of agents
type Agent = {
  id: string;
  name: string;
  description: string;
  type: string;
  runs: number;
  lastRun: string;
};

export default function AgentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Fetch agents using tRPC
  const { data: apiAgents = [], isLoading, refetch } = api.agent.getAll.useQuery();

  // Transform API agents to UI agents
  const agents: Agent[] = useMemo(() => {
    return apiAgents.map((agent: { id: any; name: any; description: any; type: any; }) => {
      return {
        id: agent.id,
        name: agent.name,
        description: agent.description || "", // Handle null description
        type: agent.type,
        runs: 0, // We don't have this data yet
        lastRun: "Never" // We don't have this data yet
      };
    });
  }, [apiAgents]);

  // tRPC mutations
  const deleteAgentMutation = api.agent.delete.useMutation({
    onSuccess: () => {
      toast.success("Agent deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete agent: ${error.message}`);
    }
  });

  // Function to delete an agent
  const deleteAgent = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this agent?")) {
      deleteAgentMutation.mutate({ id });
    }
  };

  // Function to duplicate an agent
  const duplicateAgent = async (agent: Agent) => {
    try {
      // First, fetch the complete agent data
      const response = await fetch(`/api/agents/${agent.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch agent details");
      }

      const agentData = await response.json();

      // Then create a new agent with the same configuration
      const duplicatedResponse = await fetch("/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...agentData,
          name: `${agentData.name} (Copy)`,
          id: undefined, // Remove ID so a new one will be generated
        }),
      });

      if (!duplicatedResponse.ok) {
        throw new Error("Failed to duplicate agent");
      }

      toast.success("Agent duplicated successfully");
      refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to duplicate agent");
    }
  };

  // Filter agents based on search query
  const filteredAgents = useMemo(() => {
    return agents.filter((agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [agents, searchQuery]);

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredAgents.length / itemsPerPage));
  const paginatedAgents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAgents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAgents, currentPage, itemsPerPage]);

  // Create showing text for pagination
  const showingText = filteredAgents.length > 0
    ? `Showing ${((currentPage - 1) * itemsPerPage) + 1} to ${Math.min(currentPage * itemsPerPage, filteredAgents.length)} of ${filteredAgents.length} agents`
    : "";

  return (
    <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 md:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agents</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage AI agents for different marketing tasks.
          </p>
        </div>
        <Link
          href="/dashboard/agents/agents/new"
          className="inline-flex items-center gap-x-2 rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <FaPlus className="-ml-0.5 h-4 w-4" aria-hidden="true" />
          New Agent
        </Link>
      </div>

      <div className="mt-4 mb-6">
        <SearchInput
          value={searchQuery}
          onSearch={setSearchQuery}
          placeholder="Search agents..."
        />
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="py-24 text-center">
                <p className="text-gray-500">Loading agents...</p>
              </div>
            ) : paginatedAgents.length === 0 ? (
              <EmptyState
                icon={<FaRobot className="h-10 w-10 text-gray-400" />}
                title="No agents found"
                description={searchQuery ? "No agents match your search criteria. Try a different search." : "Get started by creating your first agent."}
                actionLabel={searchQuery ? "Clear search" : "New Agent"}
                actionUrl={searchQuery ? undefined : "/dashboard/agents/agents/new"}
                actionHandler={searchQuery ? () => setSearchQuery("") : undefined}
              />
            ) : (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Runs
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Last Run
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {paginatedAgents.map((agent) => (
                      <tr key={agent.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-100">
                              <FaRobot className="h-5 w-5 text-gray-600" />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {agent.name}
                              </div>
                              <div className="text-gray-500 max-w-xs truncate">
                                {agent.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            {agent.type}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {agent.runs}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {agent.lastRun}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex space-x-2 justify-end">
                            <button
                              type="button"
                              className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              onClick={() => {
                                router.push(`/dashboard/agents/agents/${agent.id}/run`);
                              }}
                            >
                              <FaPlay className="mr-1 h-4 w-4 text-gray-500" />
                              Run
                            </button>
                            <Link
                              href={`/dashboard/agents/agents/${agent.id}/edit`}
                              className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                              <FaEdit className="mr-1 h-4 w-4 text-blue-500" />
                              Edit
                            </Link>
                            <button
                              type="button"
                              className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              onClick={() => duplicateAgent(agent)}
                              disabled={deleteAgentMutation.isPending}
                            >
                              <FaCopy className="mr-1 h-4 w-4 text-gray-500" />
                              Duplicate
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              onClick={() => deleteAgent(agent.id)}
                              disabled={deleteAgentMutation.isPending}
                            >
                              <FaTrash className="mr-1 h-4 w-4 text-red-500" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {filteredAgents.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">{showingText}</p>
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      )}
    </div>
  );
} 